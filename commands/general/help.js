const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Shows all commands",
    permission: [],
    category: "general",
    async execute(interaction, client) {
        const db = await require("../../db.js")
        var commandsid = await db.collection("commands").find().toArray()
        let totalPage = 3;
        let page = 1;

        var page1 = new Discord.EmbedBuilder()

        client.commands.forEach(command => {    
         
                page1commands.push({ name: `</${command.name}:${commandsid.find(c => c.name == command.name).id}>` + " " + (command.onlyStaff ? ":lock:" : ""), value: command.description });
        

        }
        )
        page1.addFields(page1commands);




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

                    if (i.user.id != interaction.member.id) return i.reply({ content: await getTranslation("help.errors.buttonNotYours", userlanguage), ephemeral: true })

                    if (i.customId == "indietro") {
                        page--
                        if (page < 1) page = 1
                    }
                    if (i.customId == "avanti") {
                        page++
                        if (page > totalPage) page = totalPage
                    }


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