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
        const description = interaction.options.getString("description")

        if (!title && !description) {
            
            var todos = await db.collection("to-do").find().toArray()
            todos = todos.filter(x => x.users.includes(interaction.user.id))
            var fields = []

            
            for (var i = 0; todos.length > i; i++) {
                fields.push({ name: (todos[i].completed ? ":white_check_mark: " : (!todos[i].date ? ":red_circle: " : ":orange_circle: ")) + todos[i].title, value: todos[i].description, inline: false })
            }


            const embed = new Discord.EmbedBuilder()
                .setTitle("To-do list")
                .setFields(fields)

            interaction.reply({ embeds: [embed] })

                
        }
       

    }
}




