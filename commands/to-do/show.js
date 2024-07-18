const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { discordTimestamp } = require("../../functions/general.js")
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
                name: "description",
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

    async execute(interaction, client) {
        const databasePromise = await require("../../db.js")

        const db = await databasePromise.db("to-do")

        const title = interaction.options.getString("title")
        const description = interaction.options.getString("description")

        if (!title && !description) {
            var todos = await db.collection("todos").find({ user: interaction.user.id }).toArray()
            var fields = []
        }
       

    }
}




