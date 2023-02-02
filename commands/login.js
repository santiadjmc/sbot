const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require('../database/db');
const utils = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("login")
    .setDescription("Log into your account")
    .addStringOption(o => o.setName("username").setDescription("The account's username (Case sensitive)").setRequired(true))
    .addStringOption(o => o.setName("password").setDescription("The account's password (Case sensitive)").setRequired(true)),
    async run (interaction) {
        await interaction.deferReply();
        const currentAcc = await utils.getSessionData(interaction.user.id);
        if (currentAcc) return await interaction.editReply("You already are logged in, if you wanna switch accounts, first log out.");
        const username = interaction.options.getString("username");
        const password = interaction.options.getString("password");
        const foundAcc = await db.query("SELECT * FROM accounts WHERE username = ? ", [username]);
        if (!foundAcc[0]) return await interaction.editReply("That username doesn't exists.");
        if (password !== utils.decrypt(process.env.ENCRYPTION_KEY, foundAcc[0].password)) return await interaction.editReply("Incorrect password.");
        await db.query("INSERT INTO sessions SET ?", { account_id: foundAcc[0].id, discord_user_id: interaction.user.id });
        await interaction.editReply("Sucessfully logged in.");
    }
}