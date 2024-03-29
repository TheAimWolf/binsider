const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Deletes a number of messages from the channel.')
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('The number of messages to delete.')
            .setRequired(true)),
	async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount <= 1 || amount > 100) {
            return interaction.reply('You need to input a number between 1 and 99.');
        }
        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `Deleted ${amount} messages.`, ephemeral: true });
	},
};