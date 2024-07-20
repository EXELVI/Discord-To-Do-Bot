const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Shows all commands",
    permission: [],
    category: "general",
    async execute(interaction) {
        const databasePromise = await require("../../db.js")
        const client = require("../../client.js")
        var commandsid = await databasePromise.db("to-do").collection("commands").find({}).toArray()
        let totalPage = 2;
        let page = 1;

        var page1commands = []
        var page2commands = []

        let page1 = new Discord.EmbedBuilder() // General
            .setTitle("Commands")
            .setDescription("General commands")
            .setColor("Blurple")

        let page2 = new Discord.EmbedBuilder() // To-dos
            .setTitle("Commands")
            .setDescription("To-do commands")
            .setColor("Navy")

        client.commands.forEach(command => {
            if (command.category == "general")
                page1commands.push({ name: `</${command.name}:${commandsid.find(c => c.name == command.name).id}>` + " " + (command.permission ? "🔒" : "🔓"), value: command.description })
            if (command.category == "to-do")
                page2commands.push({ name: `</${command.name}:${commandsid.find(c => c.name == command.name).id}>` + " " + (command.permission ? "🔒" : "🔓"), value: command.description })
        })
        page1.addFields(page1commands);
        page2.addFields(page2commands);

        let button1 = new Discord.ButtonBuilder()
            .setCustomId("Next")
            .setLabel("Next")
            .setStyle("Primary")

        let button2 = new Discord.ButtonBuilder()
            .setCustomId("Previous")
            .setLabel("Previous")
            .setStyle("Primary")

        if (page == 1) button1.setDisabled()
        if (page == totalPage) button2.setDisabled()

        let row = new Discord.ActionRowBuilder()
            .addComponents(button1)
            .addComponents(button2)

        interaction.reply({ embeds: [eval("page" + page.toString())], components: [row] })
            .then(msg => {
                const collector = msg.createMessageComponentCollector()

                collector.on("collect", async i => {
                    i.deferUpdate()
                    if (i.user.id !== interaction.user.id) {
                        return i.reply({ content: "You can't interact with this", ephemeral: true });
                    }

                    if (i.customId == "Previous") {
                        page--
                        if (page < 1) page = 1
                    }
                    if (i.customId == "Next") {
                        page++
                        if (page > totalPage) page = totalPage
                    }

                    let button1 = new Discord.ButtonBuilder()
                        .setCustomId("Next")
                        .setLabel("Next")
                        .setStyle("Primary")

                    let button2 = new Discord.ButtonBuilder()
                        .setCustomId("Previous")
                        .setLabel("Previous")
                        .setStyle("Primary")

                    if (page == 1) button1.setDisabled()
                    if (page == totalPage) button2.setDisabled()

                    let row = new Discord.ActionRowBuilder()
                        .addComponents(button1)
                        .addComponents(button2)

                    interaction.editReply({ embeds: [eval("page" + page.toString())], components: [row] })
                })
            })

    },
};