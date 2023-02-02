const dotenv = require("dotenv");
dotenv.config();
const { Client, GatewayIntentBits, Partials, ActivityType, Collection } = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const path = require('node:path');
const createTables = require("./database/createTables");
const utils = require("./utils");
const db = require("./database/db");
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages],
    partials: [Partials.Channel]
});

const commands = new Collection();


client.on('ready', async () => {
    console.log("listo para sexo");
    client.user.setPresence({ status: "online", activities: [{ name: "girls", type: ActivityType.Watching }] });
    require("./events/slashcommands");
    createTables();
});
const slashCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of slashCommands) {
    const slash = require(`./commands/${file}`)
    console.log('sexooooooooo');
    commands.set(slash.data.name, slash);
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand) return;

    const slashC = commands.get(interaction.commandName);
    if (!slashC) return;
    try {
        await slashC.run(interaction);
    } catch (e) {
        console.log(`ERROR PA HPTA ${e.stack}`);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("switch-session")) {
            const decision = interaction.customId.trim().split("-")[2];
            const authorId = interaction.customId.trim().split("-")[3];
            const accId = interaction.customId.trim().split("-")[4];
            if (authorId !== interaction.user.id) return await interaction.reply({ content: "You are not allowed to interact with these buttons.", ephemeral: true });
            switch (decision) {
                case "refuse": {
                    await interaction.deferUpdate();
                    await interaction.message.edit({ content: "Alright, i didn't switch your session.", components: [] });
                    break;
                }
                case "agree": {
                    await interaction.deferUpdate();
                    await interaction.message.edit({ content: "Switching...", components: [] });
                    const currentSession = await utils.getSessionData(interaction.user.id);
                    if (!currentSession) {
                        await db.query("INSERT INTO sessions SET ?", { account_id: Number(accId), discord_user_id: interaction.user.id });
                        await interaction.message.edit("Successfully logged in.");
                    }
                    else {
                        await db.query("UPDATE sessions SET account_id = ? WHERE discord_user_id = ?", [currentSession.account.id, interaction.user.id]);
                        await interaction.message.edit("Successfully logged out from your previous account and logged in.");
                    }
                }
            }
        }
    }
});

client.login(process.env.TOKEN);