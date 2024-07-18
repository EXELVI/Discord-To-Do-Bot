let listFormats = ['RELATIVE', 'DATE', 'TIME', 'SHORT TIME', 'FULL']
let listUnformatted = ['R', 'D', 'T', 't', 'F']

module.exports = functions = {
    /**
    * Converte una timestamp in una data formattata per Discord.
    * @param {number} date - La timestamp da convertire.
    * @param {string} format - Il formato della data desiderato: 'RELATIVE', 'DATE', 'TIME', 'SHORT TIME', 'FULL'.
    * @returns {string} La data formattata.
    */
    discordTimestamp: function (date, format) {
        let parsed = Math.floor(date / 1000)
        return `<t:${parsed}:${listUnformatted[listFormats.indexOf(format.toUpperCase())]}>`
    },
}