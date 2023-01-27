const dotenv = require("dotenv");
dotenv.config();
const { Client, GatewayIntentBits, Partials, ActivityType, Collection } = require("discord.js");
const ms = require("ms");
const fs = require("fs");
const path = require('node:path');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages],
    partials: [Partials.Channel]
});

const commands = new Collection();


client.on('ready', async () => {
    console.log("listo para sexo");
    client.user.setPresence({ status: "online", activities: [{ name: "girls", type: ActivityType.Watching }] });
});
const slashCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of slashCommands) {
    const slash = require(`./commands/${file}`)
    console.log('sexooooooooo');
    commands.set(slash.data.name, slash);
}

client.on('interactionCreate', async (interaction, message) => {
    if (!interaction.isCommand) return;

    const slashC = commands.get(interaction.commandName);
    if (!slashC) return;
    try {
        await slashC.run(interaction);
    } catch (e) {
        console.log(`ERROR PA HPTA ${e}`);
    }
});

client.login(process.env.TOKEN);