const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require('../database/db');
const utils = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("logout")
        .setDescription("No need to explain."),
    async run(interaction) {
        await interaction.deferReply();
        const currentAcc = await utils.getSessionData(interaction.user.id);
        if (!currentAcc) {
            return await interaction.editReply("You aren't signed in on any account.");
        }
        await db.query("DELETE FROM sessions WHERE discord_user_id = ?", [interaction.user.id]);
        await interaction.editReply("You were successfully logged out.");
    }
}