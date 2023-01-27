const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong'),
    async run(interaction) {
        const start = Date.now();
        await interaction.reply({ content: `:ping_pong: | Pong: \`${interaction.client.ws.ping} ms\``, ephemeral: true });
        const end = Date.now();
        await interaction.editReply({ content: `:ping_pong: | Pong: \nSocket ping: \`${interaction.client.ws.ping} ms\`\nHTTP API: \`${end - start} ms (${(end - start) / 1000} s) \`` });
    }
}