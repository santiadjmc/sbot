const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const utils = require("../utils");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Displays a user's profile or your own")
    .addUserOption(o => o.setName("target").setDescription("User whose profile u wanna see (Don't specify if u wanna see ur own)").setRequired(false)),
    async run(interaction) {
        await interaction.deferReply();
        const target = interaction.options.getUser("target") ?? interaction.user;
        const userData = await utils.getSessionData(target.id);
        if (!userData) return await interaction.editReply(`User \`${target.tag}\` has no active account.`);
        const embed = new EmbedBuilder()
        .setTitle(`${userData.account.username}'s profile (\`${target.tag}\`)`)
        .addFields(
            {
                name: 'XP',
                value: `${userData.player.xp} / ${userData.player.next_lvl_xp} \`${String((userData.player.xp / userData.player.next_lvl_xp) * 100).slice(0, 5)}%\``
            },
            {
                name: "health",
                value: `${userData.player.health} / ${userData.player.max_health} \`${String((userData.player.health / userData.player.max_health) * 100).slice(0, 5)}%\``
            },
            {
                name: "stammina",
                value: `${userData.player.stammina} / ${userData.player.max_stammina}`
            },
            {
                name: "Account creation",
                value: `Created on <t:${userData.account.account_creation}> (<t:${userData.account.account_creation}:R>)`
            }
        )
        .setColor('Random')
        .setTimestamp(Date.now())
        await interaction.editReply({ embeds: [embed] });
    }
}