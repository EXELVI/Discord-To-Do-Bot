const Discord = require("discord.js")
const moment = require("moment")

module.exports = {
    name: 'interactionCreate',
    /**
* Esegue la gestione dell'evento di creazione di un'interazione.
* @param {Discord.BaseInteraction} interaction - L'interazione creata.
* @returns {Promise<void>} - Una Promise che rappresenta l'avvenuta gestione dell'interazione.
*/

    execute: async (interaction) => {
        if (!interaction.isModalSubmit()) return;
        const databasePromise = await require("../../db.js")
        const client = require("../../client.js")

        var titleInput = interaction.fields.getTextInputValue("title")
        var descriptionInput = interaction.fields.getTextInputValue("description")
        var dateInput = interaction.fields.getTextInputValue("date")

        const db = await databasePromise.db("to-do")

        const id = interaction.customId.split("|")[1]

        const todo = await db.collection("to-do").findOne({ id: id })

        if (!todo) {
            return interaction.reply("No to-do found")
        }

        todo.title = titleInput
        todo.description = descriptionInput
        todo.date = moment(dateInput).valueOf()

        await db.collection("to-do").updateOne({ id: id }, { $set: todo })

        interaction.reply("To-do updated successfully")



    }
}