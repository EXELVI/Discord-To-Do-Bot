const colors = require('colors/safe');
const Discord = require('discord.js');
const chalk = require('chalk');


const ascii = [
    "88888888888              8888888b.           ",
    "    888                  888  \"Y88b          ",
    "    888                  888    888          ",
    "    888   .d88b.         888    888  .d88b.  ",
    "    888  d88\"\"88b        888    888 d88\"\"88b ",
    "    888  888  888 888888 888    888 888  888 ",
    "    888  Y88..88P        888  .d88P Y88..88P ",
    "    888   \"Y88P\"         8888888P\"   \"Y88P\"  ",
]

function fadeColors(colors) {
    const startColor = [0, 0, 255];  // Blu
    const endColor = [255, 0, 0];  // Rosso

    const startColorDev = [0, 0, 255];  // Blu
    const endColorDev = [0, 255, 0];  // Rosso


    const colorSteps = colors.length - 1;

    const colorFade = [];
    for (let i = 0; i <= colorSteps; i++) {
        const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * (i / colorSteps));
        const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * (i / colorSteps));
        const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * (i / colorSteps));
        colorFade.push([r, g, b]);
    }

    for (let i = 0; i < colorFade.length; i++) {
        const color = colorFade[i];
        const colorDev = colorFadeDev[i];
        console.log(chalk.rgb(color[0], color[1], color[2])(colors[i]))
    }
}

module.exports = {
    name: 'ready',
    execute: async () => {
        const client = require('../../client.js');
        console.log("Bot is ready!");
        colors.enable();
        console.log(colors.green(`-- ONLINE --`));
        fadeColors(ascii);
        console.log(colors.red(`
User: ${client.user.tag}
      
        `))


    }
}