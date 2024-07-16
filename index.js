//index.js
require('dotenv').config()


const Discord = require('discord.js');

const manager = require('./manager.js');
//Facy logging
manager.on('shardCreate', shard => console.log(`☑️ Launched shard #${shard.id}`));

manager.spawn();

const databasePromise = require('./db.js');
