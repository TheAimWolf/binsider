const { SlashCommandBuilder } = require('discord.js');
const { subscriptions }  = require('./subscribe.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unsubscribe')
        .setDescription('Unsubscribe from a RSS feed.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL of the RSS feed.')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const subscription = subscriptions.find(sub => sub.url === url);
        if (!subscription) {
            return interaction.reply(`The URL ${url} is not subscribed.`);
        }
        const index = subscriptions.indexOf(subscription);
        subscriptions.splice(index, 1);
        interaction.reply({content: `Unsubscribed from ${url}`, ephemeral: true });
        
    }
};