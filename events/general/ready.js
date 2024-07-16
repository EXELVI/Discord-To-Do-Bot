const colors = require('colors/safe');
const Discord = require('discord.js');
const chalk = require('chalk');


const ascii = [
    "88888888888              8888888b.           ",
    "    888                  888  \"Y88b          ",
    "    888                  888    888          ",
    "    888   .d88b.         888    888  .d88b.  ",
    "    888  d88\"\"88b        888    888 d88\"\"88b ",
    "    888  888  888 888888 888    888 888  888 ",
    "    888  Y88..88P        888  .d88P Y88..88P ",
    "    888   \"Y88P\"         8888888P\"   \"Y88P\"  ",
]

function fadeColors(colors) {
    const startColor = [0, 0, 255];  // Blu
    const endColor = [255, 0, 0];  // Rosso

    const startColorDev = [0, 0, 255];  // Blu
    const endColorDev = [0, 255, 0];  // Rosso


    const colorSteps = colors.length - 1;

    const colorFade = [];
    for (let i = 0; i <= colorSteps; i++) {
        const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * (i / colorSteps));
        const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * (i / colorSteps));
        const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * (i / colorSteps));
        colorFade.push([r, g, b]);
    }

    for (let i = 0; i < colorFade.length; i++) {
        const color = colorFade[i];
        console.log(chalk.rgb(color[0], color[1], color[2])(colors[i]))
    }
}

module.exports = {
    name: 'ready',
    execute: async () => {
        const client = require('../../client.js');
        console.log("Bot is ready!");
        colors.enable();
        console.log(colors.green(`-- ONLINE --`));
        fadeColors(ascii);
        console.log(colors.red(`
User: ${client.user.tag}
      
        `))

        const databasePromise = require('../../db.js');

        databasePromise.then(async database => {
        var db = await database.db("inside")
        if (process.env.commands != "false") {

            const globalCommands = []

            console.log("Starting commands creation!")
            let guildCommands = []

            await client.commands
                .forEach(async command => {
                    let data = command.data || {}
                    data.name = command.name
                    data.description = (command.onlyStaff ? "🔒" : "") + command.description
                    if (command.options) data.options = command.options
                    if (command.integration_types) data.integration_types = command.integration_types
                    if (command.contexts) data.contexts = command.contexts

                    if (!guildCommands.find(x => x.name == command.name)) {
                        if (command?.onlyInside) {
                            await client.guilds.cache.get("759013736509079593").commands.create(data).then(async cmd => {
                                console.log("Created " + cmd.name)
                                var cmdDb = await db.collection("commands").findOne({ name: cmd.name })
                                if (!cmdDb) {
                                    db.collection("commands").insertOne({ name: cmd.name, id: cmd.id, timestamp: cmd.createdTimestamp })
                                } else {
                                    db.collection("commands").updateOne({ name: cmd.name }, { $set: { id: cmd.id, timestamp: cmd.createdTimestamp } })
                                }

                            })
                        } else globalCommands.push(data)

                        if (command.type) {
                            var data2 = {
                                name: command.name,
                                type: command.type,
                            }
                            if (command.integration_types) data2.integration_types = command.integration_types
                            if (command.contexts) data2.contexts = command.contexts
                            if (command?.onlyInside) client.guilds.cache.get("759013736509079593").commands.create(data2)
                            else globalCommands.push(data2)
                        }
                    }
                })

            const rest = new Discord.REST().setToken(process.env.token);

            console.log(`Started refreshing ${globalCommands.length} application (/) commands.`);

            const data = await rest.put(
                Discord.Routes.applicationCommands("1133848954333827242"),
                { body: globalCommands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);


            data.forEach(async cmd => {
                var cmdDb = await db.collection("commands").findOne({ name: cmd.name })
                if (!cmdDb) {
                    db.collection("commands").insertOne({ name: cmd.name, id: cmd.id })
                } else {

                    db.collection("commands").updateOne({ name: cmd.name }, { $set: { id: cmd.id } })
                }

                console.log("------------------------ Created ------------------------\n", cmd.name)
            })


            console.log("Commands created!")
        } else console.log("Commands creation disabled!")
    })


    }
}