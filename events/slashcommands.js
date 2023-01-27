const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const { create } = require("domain");
const commands = [];
const slashCommands = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));

for (const file of slashCommands) {
    const slash = require(`../commands/${file}`);
    commands.push(slash.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
createSlash()
async function createSlash() {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENTID), {
            body: commands
        }
        )
        console.log('chúpenla q ya cargaron los comandos');
    } catch (e) {
        console.error(e);
    }
}