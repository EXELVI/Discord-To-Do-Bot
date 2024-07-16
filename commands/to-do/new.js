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
                description: "Remind me at this date (Example: 2h, 2d2h, 2w2d2h, 2m2w2d2h, 2m, 2min)",
                type: 3,
                required: false
                
            }
        ]
    },
    async execute(interaction, client) {
        const databasePromise = await require("../../db.js")

        const title = interaction.options.getString("title")
        const description = interaction.options.getString("description")
        const date = interaction.options.getString("date")

        //parse date in seconds
        const dateInMs = require("ms")(date)
        if (dateInMs === undefined) return interaction.reply({ content: "Invalid date format", ephemeral: true })
        

     

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




        