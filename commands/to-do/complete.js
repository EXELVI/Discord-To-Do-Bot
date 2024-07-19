const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { discordTimestamp } = require("../../functions/general.js")

const moment = require('moment');


module.exports = {
    name: "complete",
    description: "Completes a to-do",
    permission: [],
    category: "to-do",
    "integration_types": [0, 1],
    "contexts": [0, 1, 2],
    data: {
        options: [
            {
                name: "title",
                description: "Search by title",
                type: 3,
                required: false
            },
            {
                name: "id",
                description: "Search by ID",
                type: 3,
                required: false
            },
        ]

    },
    /**
* Esegue la gestione dell'evento di creazione di un'interazione.
* @param {Discord.BaseInteraction} interaction - L'interazione creata.
* @returns {Promise<void>} - Una Promise che rappresenta l'avvenuta gestione dell'interazione.
*/

    async execute(interaction,) {
        /**
         Example:
{
    "title": "Test",
    "description": "A test todo",
    "date": false, //Reminder
    "id": "8fea4211-700e-4426-8c39-eee939f5c0ce",
    "users": [
      "1262666648498995273",
      "412625961402630175",
      "462339171537780737"
    ],
    "creator": "462339171537780737",
    "timestamp": 1721299443166, //Created timestamp
    "completed": false,
    "completedBy": null,
    "completedTimestamp": null
  }
         */
        const databasePromise = await require("../../db.js")
        const client = require("../../client.js")

        const db = await databasePromise.db("to-do")

        const title = interaction.options.getString("title")
        const id = interaction.options.getString("id")

        let todos = []
        if (title) {
            todos = await db.collection("to-do").find({ title: title }).toArray()
        } else if (id) {
            todos = await db.collection("to-do").find({ id: id }).toArray()
        } else {
            todos = await db.collection("to-do").find({}).toArray()
        }

        if (todos.length === 0) {
            return interaction.reply("No to-dos found")
        }

      
            var menuOptions = []

            for (var i = 0; todos.length > i; i++) {
                const relativeDate = moment(todos[i].timestamp).fromNow()
                var reminded = todos[i].reminded || false
                menuOptions.push({ label: todos[i].title, emoji: todos[i].completed ? "✅" : (!todos[i].date ? "🔴" : (reminded ? "🔔" : "🔕")), value: todos[i].id, description: relativeDate + " | " + (todos[i].description || "No description") })
            }

            menuOptions.sort((a, b) => {
                if (a.emoji === "✅") return 1
                if (b.emoji === "✅") return -1
                return 0
            })

            const embed = new Discord.EmbedBuilder()
                .setTitle("Select to-dos to set as completed")
                .setDescription("Select the to-dos you want to set as completed")

            const menu = new Discord.StringSelectMenuBuilder()
                .setCustomId('todo')
                .setPlaceholder('Select to-dos to set as completed')
                .addOptions(menuOptions)
                .setMaxValues(menuOptions.length)
                .setMinValues(1)


            const row = new Discord.ActionRowBuilder()
                .addComponents(menu)

            interaction.reply({ components: [row], embeds: [embed] }).then(() => {

                var collector = interaction.channel.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 60000 })
                // don't ask for confirmation
                collector.on('collect', async i => {
                    if (i.customId === 'todo') {
                        i.deferUpdate()
                        var toComplete = i.values
                        for (var i = 0; toComplete.length > i; i++) {
                            await db.collection("to-do").updateOne({ id: toComplete[i] }, { $set: { completed: !todos.find(t => t.id === toComplete[i]).completed, completedTimestamp: Date.now() } })
                        }
                        var embed = new Discord.EmbedBuilder()
                            .setTitle("To-dos set as completed")
                            .setDescription("The selected to-dos have been set as completed")
                            .setColor("Green")
                        interaction.editReply({ embeds: [embed] })
                        collector.stop()
                    }
                })

                collector.on('end', async collected => {
                    var menu = new Discord.StringSelectMenuBuilder()
                        .setCustomId('todo')
                        .setPlaceholder('Select to-dos to set as completed')
                        .addOptions(menuOptions)
                        .setMaxValues(menuOptions.length)
                        .setMinValues(1)
                        .setDisabled(true)

                    var row = new Discord.ActionRowBuilder()
                        .addComponents(menu)

                    interaction.editReply({ components: [row] })
                }
                )


            })




        
    }
}




