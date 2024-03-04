const { SlashCommandBuilder } = require('discord.js');
const subscriptions = require('../../subscriptions.json');
const postedItems = require('../../postedItems.json');
const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');

function checkFeeds(client) {
    const parser = new Parser();
    setInterval(async () => {
        subscriptions.forEach(async (subscription) => {
            // Check for new items and post them in the channel
            // You can use a library like 'rss-parser' to parse the RSS feed
            // Here's an example implementation using 'rss-parser'

            try {
                const feed = await parser.parseURL(subscription.url);

                // Iterate over all items in the feed
                for (const item of feed.items) {
                    // Check if the item is already posted
                    const isAlreadyPosted = postedItems.includes(item.link);

                    if (!isAlreadyPosted) {
                        // Add the posted item to the 'postedItems' array
                        postedItems.push(item.link);
                        // Post the item in the channel
                        const channel = await client.channels.fetch(subscription.channel);

                        await channel.send(`Neuer Post von *${item.name}*\n${item.link}`);

                    }
                }
            } catch (error) {
                console.error(`Error checking ${subscription.url}: ${error}`);
            }
        });
        const filePath = path.resolve(__dirname, '../../postedItems.json');
        fs.writeFileSync(filePath, JSON.stringify(postedItems));
        const filePath2 = path.resolve(__dirname, '../../subscriptions.json');
        fs.writeFileSync(filePath2, JSON.stringify(subscriptions));
    }, 5000);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subscribe')
        .setDescription('Subscribe to an RSS feed.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL of the RSS feed.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to post new items to.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('A name for the subscription.')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const channel = interaction.options.getChannel('channel');
        const name = interaction.options.getString('name');
        const subscription = { url: url, channel: channel.id, name: name };
        subscriptions.push(subscription);
        const filePath = path.resolve(__dirname, '../../subscriptions.json');
        fs.writeFileSync(filePath, JSON.stringify(subscriptions));
        console.log('Subscriptions file updated.');
        await interaction.reply({content: `New subscription to ${url} in ${channel}.`, ephemeral: true });
    },
    checkFeeds,
    subscriptions: subscriptions
};