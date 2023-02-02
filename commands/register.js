const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require('../database/db');
const utils = require('../utils');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register your account")
    .addStringOption(o => o.setName("username").setDescription("Your new account's username (don't enter your real name)").setRequired(true))
    .addStringOption(o => o.setName("password").setDescription("Your new account's password (it'll be encrypted)").setRequired(true)),
    async run(interaction) {
        await interaction.deferReply();
        const userAccounts = await utils.getAccounts(interaction.user.id);
        if (userAccounts.length > 2) return await interaction.editReply("You cannot own more than 3 accounts.");
        const username = interaction.options.getString("username");
        const foundU = await db.query("SELECT * FROM accounts WHERE username = ?", [username]);
        if (foundU[0]) return await interaction.editReply("There's already an account with the selected username, try another one.");
        const password = interaction.options.getString("password");
        const created = await db.query("INSERT INTO accounts SET ?", {
            discord_user_id: interaction.user.id,
            username,
            password: utils.encrypt(process.env.ENCRYPTION_KEY, password),
            account_creation: Math.round(Date.now() / 1000)
        });
        await db.query("INSERT INTO players SET ?", [{
            account_id: created.insertId
        }]);
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`switch-session-refuse-${interaction.user.id}-${created.insertId}`)
            .setStyle(ButtonStyle.Danger)
            .setLabel("Nah"),
            new ButtonBuilder()
            .setCustomId(`switch-session-agree-${interaction.user.id}-${created.insertId}`)
            .setStyle(ButtonStyle.Success)
            .setLabel("Sure")
        );
        await interaction.editReply({ content: "Your account has been successfully created, would you like to switch your session to the new account?", components: [row] });
    }
}