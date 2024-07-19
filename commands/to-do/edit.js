const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { discordTimestamp } = require("../../functions/general.js")

const moment = require('moment');


module.exports = {
    name: "edit",
    description: "Edit a to-do",
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
            .setTitle("To-Do")
            .setDescription("Select the to-dos you want to edit")

        const menu = new Discord.StringSelectMenuBuilder()
            .setCustomId('todo')
            .setPlaceholder('Select to-dos to edit')
            .addOptions(menuOptions)
            .setMaxValues(menuOptions.length)
            .setMinValues(1)

        const row = new Discord.ActionRowBuilder()
            .addComponent(menu)

        interaction.reply({ embeds: [embed], components: [row] }).then(() => {
            const collector = interaction.channel.createMessageComponentCollector({ componentType: 'SELECT_MENU' });

            collector.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: "You can't interact with this menu", ephemeral: true });
                }

                const todo = todos.find(x => x.id === i.values[0])

                if (!todo) {
                    return i.reply({ content: "No to-do found", ephemeral: true });
                }

                i.deferUpdate()

                var modal = new Discord.ModalBuilder()
                    .setTitle("Edit to-do")
                    .setDescription("Edit the to-do")
                    .setColor("blurple")
                    .setFooter("To-do ID: " + todo.id)
                    .addComponents([
                        new Discord.ActionRowBuilder()
                            .addComponent(new Discord.ButtonBuilder()
                                .setCustomId("title")
                                .setLabel("Title")
                                .setStyle("PRIMARY")
                                .setValue(todo.title)
                                .setDisabled(todo.completed)
                            )
                    ])
                    .addComponents([
                        new Discord.ActionRowBuilder()
                            .addComponent(new Discord.ButtonBuilder()
                                .setCustomId("description")
                                .setLabel("Description")
                                .setStyle("PRIMARY")
                                .setValue(todo.description)
                                .setDisabled(todo.completed)
                            )
                    ])
                    .addComponents([
                        new Discord.ActionRowBuilder()
                            .addComponent(new Discord.ButtonBuilder()
                                .setCustomId("date")
                                .setLabel("Date")
                                .setStyle("PRIMARY")
                                .setValue(todo.date ? new Date(todo.date).toISOString() : "")
                                .setDisabled(todo.completed)
                            )
                    ])
                    .addComponents([
                        new Discord.ActionRowBuilder()
                            .addComponent(new Discord.ButtonBuilder()
                                .setCustomId("completed")
                                .setLabel("Completed")
                                .setStyle("SUCCESS")
                                .setDisabled(todo.completed)
                            )
                    ])
                    .addComponents([
                        new Discord.ActionRowBuilder()
                            .addComponent(new Discord.ButtonBuilder()
                                .setCustomId("delete")
                                .setLabel("Delete")
                                .setStyle("DANGER")
                            )
                    ])

            });
        })
    }
}




