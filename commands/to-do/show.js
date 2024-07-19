const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { discordTimestamp } = require("../../functions/general.js")

const moment = require('moment');


module.exports = {
    name: "show",
    description: "Shows all to-do",
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
    "date": false,
    "id": "8fea4211-700e-4426-8c39-eee939f5c0ce",
    "users": [
      "1262666648498995273",
      "412625961402630175",
      "462339171537780737"
    ],
    "creator": "462339171537780737",
    "timestamp": 1721299443166,
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

        if (!title && !id) {

            var todos = await db.collection("to-do").find().toArray()
            todos = todos.filter(x => x.users.includes(interaction.user.id))
            var menuOptions = []
            var embedFields = []

            for (var i = 0; todos.length > i; i++) {

                const relativeDate = moment(todos[i].timestamp).fromNow()

                var reminded = todos[i].reminded || false
                embedFields.push({ name: (todos[i].completed ? ":white_check_mark: " : (!todos[i].date ? ":red_circle: " : (!todos[i].date ? "🔴" : (reminded ? ":bell:" : ":no_bell:")))) + todos[i].title, value: discordTimestamp(todos[i].timestamp, "Relative") + " | " + (todos[i].description || "No description") })
                menuOptions.push({ label: todos[i].title, emoji: todos[i].completed ? "✅" : (!todos[i].date ? "🔴" : (reminded ? "🔔" : "🔕")), value: todos[i].id, description: relativeDate + " | " + (todos[i].description || "No description") })
            }

            var embed = new Discord.EmbedBuilder()
                .setTitle("To-do")
                .addFields(embedFields)

            var menu = new Discord.StringSelectMenuBuilder()
                .setCustomId("todo")
                .setPlaceholder("Select a to-do")
                .addOptions(menuOptions)

            var row = new Discord.ActionRowBuilder()
                .addComponents(menu)

            interaction.reply({ embeds: [embed], components: [row] }).then(msg => {
                var collector = msg.createMessageComponentCollector({ filter: i => i.user.id == interaction.user.id, time: 120000 })
                collector.on("collect", async i => {
                    i.deferUpdate()
                    var todo = todos.find(x => x.id == i.values[0])
                    var embed = new Discord.EmbedBuilder()
                        .setTitle(todo.title)
                        .setDescription(todo.description)
                        .addFields([
                            { name: "Created by", value: `<@${todo.creator}>`, inline: true },
                            { name: "Created at", value: discordTimestamp(todo.timestamp, "Relative"), inline: true },
                            { name: "Completed", value: todo.completed ? "Yes" : "No", inline: true },
                            { name: "Completed by", value: todo.completedBy ? `<@${todo.completedBy}>` : "No one", inline: true },
                            { name: "Completed at", value: todo.completedTimestamp ? discordTimestamp(todo.completedTimestamp, "Relative") : "No one", inline: true },
                            { name: "Reminded", value: todo.reminded ? "Yes" : "No", inline: true },
                            { name: "Remind date", value: todo.date ? discordTimestamp(todo.date, "Relative") : "No date", inline: true },
                            { name: "User" + (todo.users > 1 ? "" : "s [" + todo.users.length + "]"), value: todo.users.map(x => `<@${x}>`).join(", "), inline: false },
                            { name: "ID", value: "```" + todo.id + "```", inline: false }

                        ])
                    interaction.editReply({ embeds: [embed] })
                })

                collector.on("end", async () => {
                    var menu = new Discord.StringSelectMenuBuilder()
                        .setCustomId("todo")
                        .setPlaceholder("Select a to-do")
                        .addOptions(menuOptions)
                        .setDisabled(true)

                    var row = new Discord.ActionRowBuilder()
                        .addComponents(menu)

                    interaction.editReply({ components: [row] })
                })

            })
        } else {
            var todos = await db.collection("to-do").find({ $or: [{ title: title }, { id: id }] }).toArray()
            if (todos.length > 1) {

                var menuOptions = []
                var embedFields = []

                for (var i = 0; todos.length > i; i++) {                        
                        const relativeDate = moment(todos[i].timestamp).fromNow()
                            var reminded = todos[i].reminded || false
                        embedFields.push({ name: (todos[i].completed ? ":white_check_mark: " : (!todos[i].date ? ":red_circle: " : (!todos[i].date ? "🔴" : (reminded ? ":bell:" : ":no_bell:"))) + todos[i].title), value: discordTimestamp(todos[i].timestamp, "Relative") + " | " + (todos[i].description || "No description") })
                        menuOptions.push({ label: todos[i].title, emoji: todos[i].completed ? "✅" : (!todos[i].date ? "🔴" : (reminded ? "🔔" : "🔕")), value: todos[i].id, description: relativeDate + " | " + (todos[i].description || "No description") })
                    }
                
                var embed = new Discord.EmbedBuilder()
                    .setTitle("To-do")
                    .setDescription("Multiple to-do found with: \n```" + title + "``` ")
                    .addFields(embedFields)

                var menu = new Discord.StringSelectMenuBuilder()
                    .setCustomId("todo")
                    .setPlaceholder("Select a to-do")
                    .addOptions(menuOptions)
                
                var row = new Discord.ActionRowBuilder()
                    .addComponents(menu)
                    
                interaction.reply({ embeds: [embed], components: [row] }).then(msg => {
                    var collector = msg.createMessageComponentCollector({ filter: i => i.user.id == interaction.user.id, time: 120000 })
                    collector.on("collect", async i => {
                        i.deferUpdate()
                        var todo = todos.find(x => x.id == i.values[0])
                        var embed = new Discord.EmbedBuilder()
                            .setTitle(todo.title)
                            .setDescription(todo.description)
                            .addFields([
                                { name: "Created by", value: `<@${todo.creator}>`, inline: true },
                                { name: "Created at", value: discordTimestamp(todo.timestamp, "Relative"), inline: true },
                                { name: "Completed", value: todo.completed ? "Yes" : "No", inline: true },
                                { name: "Completed by", value: todo.completedBy ? `<@${todo.completedBy}>` : "No one", inline: true },
                                { name: "Completed at", value: todo.completedTimestamp ? discordTimestamp(todo.completedTimestamp, "Relative") : "No one", inline: true },
                                { name: "Reminded", value: todo.reminded ? "Yes" : "No", inline: true },
                                { name: "Remind date", value: todo.date ? discordTimestamp(todo.date, "Relative") : "No date", inline: true },
                                { name: "User" + (todo.users > 1 ? "" : "s [" + todo.users.length + "]"), value: todo.users.map(x => `<@${x}>`).join(", "), inline: false },
                                { name: "ID", value: "```" + todo.id + "```", inline: false }

                            ])
                        interaction.editReply({ embeds: [embed] })
                    })

                    collector.on("end", async () => {
                        var menu = new Discord.StringSelectMenuBuilder()
                            .setCustomId("todo")
                            .setPlaceholder("Select a to-do")
                            .addOptions(menuOptions)
                            .setDisabled(true)

                        var row = new Discord.ActionRowBuilder()
                            .addComponents(menu)

                        interaction.editReply({ components: [row] })
                    })

                })
            
            } else {
                if (!todos) return interaction.reply({ content: "No to-do found", ephemeral: true })
                var todo = todos[0]
                var embed = new Discord.EmbedBuilder()
                    .setTitle(todo.title)
                    .setDescription(todo.description)
                    .addFields([
                        { name: "Created by", value: `<@${todo.creator}>`, inline: true },
                        { name: "Created at", value: discordTimestamp(todo.timestamp, "Relative"), inline: true },
                        { name: "Completed", value: todo.completed ? "Yes" : "No", inline: true },
                        { name: "Completed by", value: todo.completedBy ? `<@${todo.completedBy}>` : "No one", inline: true },
                        { name: "Completed at", value: todo.completedTimestamp ? discordTimestamp(todo.completedTimestamp, "Relative") : "No one", inline: true },
                        { name: "Reminded", value: todo.reminded ? "Yes" : "No", inline: true },
                        { name: "Remind date", value: todo.date ? discordTimestamp(todo.date, "Relative") : "No date", inline: true },
                        { name: "Users", value: todo.users.map(x => `<@${x}>`).join(", "), inline: false },
                        { name: "ID", value: "```" + todo.id + "```", inline: false }
                    ])
                interaction.reply({ embeds: [embed] })
            }

        }


    }
}




