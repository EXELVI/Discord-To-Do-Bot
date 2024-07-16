const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    name: "new",
    description: "Create a new to-do",
    permission: [],
    category: "to-do",
    "integration_types": [0, 1],
    "contexts": [0, 1, 2],
    data: {
        name: "new",
        description: "Create a new to-do",
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

        var dataaa = new Date()

        var month = dataaa.getMonth() + 1,
        day =    dataaa.getDate(), 
        hour =   dataaa.getHours(), 
        minute = dataaa.getSeconds() + 5 > 60 ? dataaa.getMinutes() + 1 :dataaa.getMinutes(),
        second = dataaa.getSeconds() + 5 > 60 ? 0 : dataaa.getSeconds() + 5

        if (date) {

            var format = "MM|DD|HH|mm|ss"

            var rowUp10 = new Discord.ActionRowBuilder()
            var rowUp = new Discord.ActionRowBuilder()
            var rowDown = new Discord.ActionRowBuilder()
            var rowDown10 = new Discord.ActionRowBuilder()

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
            

            const embed = new Discord.EmbedBuilder()
                .setTitle("Date picker")
                .setDescription("Select the date for the to-do" + 
                    "\n\n```" +
                    "MM  /  DD / HH | mm : ss " +
                    //`-- ${month.toString().padStart(2, "0")} -- / --- ${day.toString().padStart(2, "0")} --- / --- ${hour.toString().padStart(2, "0")} --- | --- ${minute.toString().padStart(2, "0")} --- : --- ${second.toString().padStart(2, "0")} ---` + 
                    "```"
                )

            interaction.reply({ embeds: [embed], components: [rowUp10, rowUp, rowDown, rowDown10] })

        }

        const db = (await databasePromise).db("to-do")

        const toDo = {
            title: title,
            description: description,
            date: date,
            id: uuidv4(),
            user: interaction.user.id
        }
        console.log(toDo)
    }
}




