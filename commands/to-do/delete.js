const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { discordTimestamp } = require("../../functions/general.js")

const moment = require('moment');


module.exports = {
    name: "delete",
    description: "Deletes a to-do",
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

        //If !title or !id show all
        //If title show all with title
        //if ID directly delete 
        // Otherwise select menu with multiple options
        // Ask for confirmation

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

        if (todos.length === 1) {
            const todo = todos[0]
            const todoEmbed = new Discord.EmbedBuilder()
                .setTitle("Do you want to delete this to-do?")
                .setDescription("**" + todo.title + "** \n" + (todo.description || "No description"))
                .addFields([{
                    name: "Created",
                    value: todo.date ? discordTimestamp(todo.timestamp, "FULL") : "No date",
                    inline: true
                }, {
                    name: "Creator",
                    value: "<@" + todo.creator + ">",
                    inline: true
                }, {
                    name: "Completed",
                    value: todo.completed ? "Yes" : "No",
                }])

            const confirm = new Discord.ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Confirm')
                .setStyle('Success')
            const cancel = new Discord.ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle('Danger')

            const row = new Discord.ActionRowBuilder()
                .addComponents(confirm, cancel)

            interaction.reply({ embeds: [todoEmbed], components: [row] }).then(() => {
                const filter = i => i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
                collector.on('collect', async i => {
                    if (i.customId === 'confirm') {
                        await db.collection("to-do").deleteOne({ id: todo.id })
                        todoEmbed.setColor("Red")
                        i.update({ content: 'Deleted', embeds: [todoEmbed] });

                        collector.stop();
                    } else if (i.customId === 'cancel') {
                        i.update({ content: 'Cancelled'});
                        collector.stop();
                    }
                });

                collector.on('end', (collected, reason) => {
                    var confirm = new Discord.ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('Confirm')
                        .setStyle('Success')
                        .setDisabled(true)
                    var cancel = new Discord.ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Cancel')
                        .setStyle('Danger')
                        .setDisabled(true)
                    const row = new Discord.ActionRowBuilder()
                        .addComponents(confirm, cancel)
                    if (reason === 'time') interaction.editReply({ components: [row], content: 'Time is up!' });
                    else interaction.editReply({ components: [row] })
                });
            });
        } else {
            var menuOptions = []

            for (var i = 0; todos.length > i; i++) {
                const relativeDate = moment(todos[i].timestamp).fromNow()
                var reminded = todos[i].reminded || false
                menuOptions.push({ label: todos[i].title, emoji: todos[i].completed ? "✅" : (!todos[i].date ? "🔴" : (reminded ? "🔔" : "🔕")), value: todos[i].id, description: relativeDate + " | " + (todos[i].description || "No description") })
            }



            const menu = new Discord.StringSelectMenuBuilder()
                .setCustomId('todo')
                .setPlaceholder('Select to-dos to delete')
                .addOptions(menuOptions)
                .setMaxValues(menuOptions.length)
                .setMinValues(1)

            const row = new Discord.ActionRowBuilder()
                .addComponents(menu)

            interaction.reply({ embeds: [{ title: "Select to-dos to delete" }], components: [row] }).then(msg => {
                msg.awaitMessageComponent({ filter: i => i.user.id === interaction.user.id, time: 60000 }).then(i => {
                    if (i.customId === 'todo') {
                        i.deferUpdate()
                        var toDelete = i.values
                        var confirm = new Discord.ButtonBuilder()
                            .setCustomId('confirm')
                            .setLabel('Confirm')
                            .setStyle('Success')
                        var cancel = new Discord.ButtonBuilder()
                            .setCustomId('cancel')
                            .setLabel('Cancel')
                            .setStyle('Danger')

                        const row = new Discord.ActionRowBuilder()
                            .addComponents(confirm, cancel)

                        interaction.editReply({ content: "Are you sure you want to delete these to-dos?", components: [row] }).then(() => {
                            const filter = i => i.user.id === interaction.user.id;
                            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
                            collector.on('collect', async i => {
                                if (i.customId === 'confirm') {
                                    await db.collection("to-do").deleteMany({ id: { $in: toDelete } })
                                    i.update({ content: 'Deleted', components: [] });
                                    collector.stop();
                                } else if (i.customId === 'cancel') {
                                    i.update({ content: 'Cancelled', components: [] });
                                    collector.stop();
                                }
                            });

                            collector.on('end', (collected, reason) => {
                                var confirm = new Discord.ButtonBuilder()
                                    .setCustomId('confirm')
                                    .setLabel('Confirm')
                                    .setStyle('Success')
                                    .setDisabled(true)
                                var cancel = new Discord.ButtonBuilder()
                                    .setCustomId('cancel')
                                    .setLabel('Cancel')
                                    .setStyle('Danger')
                                    .setDisabled(true)
                                const row = new Discord.ActionRowBuilder()
                                    .addComponents(confirm, cancel)
                                if (reason === 'time') interaction.editReply({ components: [row], content: 'Time is up!' });
                                else interaction.editReply({ components: [row] })
                            });
                        });
                    }

                })



            })

        }
    }
}




