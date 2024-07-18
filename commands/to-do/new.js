const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { discordTimestamp } = require("../../functions/general.js")
module.exports = {
    name: "new",
    description: "Create a new to-do",
    permission: [],
    category: "to-do",
    "integration_types": [0, 1],
    "contexts": [0, 1, 2],
    data: {
        options: [
            {
                name: "title",
                description: "The title of the to-do",
                type: 3,
                required: true
            },
            {
                name: "description",
                description: "The description of the to-do",
                type: 3,
                required: false
            },
            {
                name: "users", 
                description: "The users to share the to-do with",
                type: 3,
                required: false
            },
            {
                name: "date",
                description: "Opens the date picker",
                type: 5,
                required: false

            }
        ]
    },
    /**
* Esegue la gestione dell'evento di creazione di un'interazione.
* @param {Discord.BaseInteraction} interaction - L'interazione creata.
* @returns {Promise<void>} - Una Promise che rappresenta l'avvenuta gestione dell'interazione.
*/

    async execute(interaction, client) {
        const databasePromise = await require("../../db.js")

        const title = interaction.options.getString("title")
        const description = interaction.options.getString("description")
        const date = interaction.options.getBoolean("date")
        console.log(interaction.options)

        var dataaa = new Date()

        var month = dataaa.getMonth() + 1,
            day = dataaa.getDate(),
            hour = dataaa.getMinutes() + 5 > 60 ? dataaa.getHours() + 1 : dataaa.getHours(),
            minute = dataaa.getMinutes() + 5 > 60 ? dataaa.getMinutes() - 55 : dataaa.getMinutes() + 5,
            second = dataaa.getSeconds()

        async function createToDo(title, description, date = false) {

            const db = (await databasePromise).db("to-do")

            const toDo = {
                title: title,
                description: description,
                date: date,
                id: uuidv4(),
                user: interaction.user.id
            }

            db.collection("to-do").insertOne(toDo)

            let embed = new Discord.EmbedBuilder()
                .setTitle("To-do created")
                .setDescription("The to-do has been created successfully")
                .addFields({ name: "Title", value: title, inline: true }, { name: "Description", value: description, inline: true }, { name: "Date", value: date ? discordTimestamp(date, "FULL") : "No date", inline: true })
                .setColor("Green")

            if (!date) {
                interaction.reply({ embeds: [embed], ephemeral: true })
            } else {
                interaction.editReply({ embeds: [embed], ephemeral: true, components: [] })
            }






        }

        if (date) {

            var format = "MM|DD|HH|mm|ss"

            var rowUp10 = new Discord.ActionRowBuilder()
            var rowUp = new Discord.ActionRowBuilder()
            var rowDown = new Discord.ActionRowBuilder()
            var rowDown10 = new Discord.ActionRowBuilder()
            var row = new Discord.ActionRowBuilder()

            var confirm = new Discord.ButtonBuilder()
                .setCustomId("confirm")
                .setLabel("Confirm")
                .setStyle("Success")

            var cancel = new Discord.ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle("Danger")

            row.addComponents(confirm, cancel)

            format.split("|").forEach((x, i) => {
                console.log(x, i)
                var buttonUp10 = new Discord.ButtonBuilder()
                    .setCustomId("up10" + i)
                    .setLabel("⏫")
                    .setStyle("Danger")

                var buttonUp = new Discord.ButtonBuilder()
                    .setCustomId("up" + i)
                    .setLabel("⬆️")
                    .setStyle("Primary")

                var buttonDown = new Discord.ButtonBuilder()
                    .setCustomId("down" + i)
                    .setLabel("⬇️")
                    .setStyle("Primary")

                var buttonDown10 = new Discord.ButtonBuilder()
                    .setCustomId("down10" + i)
                    .setLabel("⏬")
                    .setStyle("Danger")

                rowUp10.addComponents(buttonUp10)
                rowUp.addComponents(buttonUp)
                rowDown.addComponents(buttonDown)
                rowDown10.addComponents(buttonDown10)

            })


            var embed = new Discord.EmbedBuilder()
                .setTitle("Date picker")
                .setDescription("Select the date for the to-do" +
                    "\n\n```" +
                    "MM   /   DD   /   HH  |   mm   :   ss \n" +
                    `${month.toString().padStart(2, "0")}   /   ${day.toString().padStart(2, "0")}   /   ${hour.toString().padStart(2, "0")}  |   ${minute.toString().padStart(2, "0")}   :   ${second.toString().padStart(2, "0")}` +
                    "```"
                )

            interaction.reply({ embeds: [embed], components: [rowUp10, rowUp, rowDown, rowDown10, row], ephemeral: true }).then(() => {
                const collector = interaction.channel.createMessageComponentCollector({ filter: i => i.user.id == interaction.user.id, time: 180000 })

                collector.on("collect", async i => {
                    i.deferUpdate()


                    if (i.customId.startsWith("up10")) {
                        var index = i.customId.replace("up10", "")
                        if (index == 0) month += 10
                        if (index == 1) day += 10
                        if (index == 2) hour += 10
                        if (index == 3) minute += 10
                        if (index == 4) second += 10
                    } else if (i.customId.startsWith("up")) {
                        var index = i.customId.replace("up", "")
                        if (index == 0) month++
                        if (index == 1) day++
                        if (index == 2) hour++
                        if (index == 3) minute++
                        if (index == 4) second++
                    } else if (i.customId.startsWith("down")) {
                        var index = i.customId.replace("down", "")
                        if (index == 0) month--
                        if (index == 1) day--
                        if (index == 2) hour--
                        if (index == 3) minute--
                        if (index == 4) second--
                    } else if (i.customId.startsWith("down10")) {
                        var index = i.customId.replace("down10", "")
                        if (index == 0) month -= 10
                        if (index == 1) day -= 10
                        if (index == 2) hour -= 10
                        if (index == 3) minute -= 10
                        if (index == 4) second -= 10

                    } else if (i.customId == "confirm") {
                        var date = new Date()
                        date.setMonth(month)
                        date.setDate(day)
                        date.setHours(hour)
                        date.setMinutes(minute)
                        date.setSeconds(second)
                        console.log(date)
                        createToDo(title, description, date)
                        collector.stop()
                    } else if (i.customId == "cancel") {
                        collector.stop("cancel")
                    }

                    if (i.customId != "confirm" && i.customId != "cancel") {
                        var format = "MM|DD|HH|mm|ss"
                        var date = new Date()
                        format.split("|").forEach((x, i) => {
                            if (x == "MM") date.setMonth(month)
                            if (x == "DD") date.setDate(day)
                            if (x == "HH") date.setHours(hour)
                            if (x == "mm") date.setMinutes(minute)
                            if (x == "ss") date.setSeconds(second)
                        })
                        embed.setDescription("Select the date for the to-do" +
                            "\n\n```" +
                            "MM   /   DD   /   HH  |   mm   :   ss \n" +
                            `${date.getMonth().toString().padStart(2, "0")}   /   ${date.getDate().toString().padStart(2, "0")}   /   ${date.getHours().toString().padStart(2, "0")}  |   ${date.getMinutes().toString().padStart(2, "0")}   :   ${date.getSeconds().toString().padStart(2, "0")}` +
                            "```"
                        )
                        interaction.editReply({ embeds: [embed], components: [rowUp10, rowUp, rowDown, rowDown10, row], ephemeral: true })
                    }
                })

                collector.on("end", async (collected, reason) => {
                    var confirm = new Discord.ButtonBuilder()
                        .setCustomId("confirm")
                        .setLabel("Confirm")
                        .setStyle("Success")
                        .setDisabled(true)

                    var cancel = new Discord.ButtonBuilder()
                        .setCustomId("cancel")
                        .setLabel("Cancel")
                        .setStyle("Danger")
                        .setDisabled(true)

                    var row = new Discord.ActionRowBuilder()
                        .addComponents(confirm, cancel)

                    if (reason == "time") {
                        embed.setColor("DarkOrange")
                        interaction.editReply({ content: "Time's up!", components: [row], embeds: [embed], ephemeral: true })
                    } else if (reason == "cancel") {
                        embed.setColor("Red")
                        interaction.editReply({ content: "Canceled", components: [row], embeds: [embed], ephemeral: true })
                    } else {
                        interaction.editReply({ components: [row] })
                    }
                })
            })

        } else {
            createToDo(title, description)
        }

    }
}




