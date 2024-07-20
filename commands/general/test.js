const Discord = require('discord.js');
const { discordTimestamp } = require("../../functions/general.js")

module.exports = {
    name: "test",
    description: "Sends bot stats",
    permission: [],
    category: "general",
    /**
* Esegue la gestione dell'evento di creazione di un'interazione.
* @param {Discord.BaseInteraction} interaction - L'interazione creata.
* @returns {Promise<void>} - Una Promise che rappresenta l'avvenuta gestione dell'interazione.
*/
    async execute(interaction) {
        const client = require("../../client.js")
        var clients = await client.shard.broadcastEval(x => { return { ready: x.isReady(), ping: x.ws.ping } })
        var fields = []

        for (var i = 0; client.shard.ids.length > i; i++) {
            fields.push({ name: "Shard " + client.shard.ids[i], value: clients[i].ready ? ":green_circle: " + clients[i].ping + "ms" : ":red_circle:", inline: true})
        }
        const embed = new Discord.EmbedBuilder()
            .setTitle("Bot stats")
            .setDescription("**Uptime** " + `${discordTimestamp(new Date().getTime() - client.uptime, "Relative")}` + "\n" + "**Ping** `" + `${client.ws.ping}ms` + "`" + "\n**Ram** `" + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` + "`")
            .setFields(fields)

        interaction.reply({ embeds: [embed] })
    },
};
