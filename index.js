//index.js
require('dotenv').config()


const Discord = require('discord.js');

const manager = require('./manager.js');
//Facy logging
manager.on('shardCreate', shard => console.log(`☑️ Launched shard #${shard.id}`));

manager.spawn();

const databasePromise = require('./db.js');

databasePromise.then(async database => {

    setInterval(async () => {
        var todos = await database.db("to-do").collection("to-do").find().toArray()
        todos = todos.filter(x => !x.completed && !x.reminded && x.date)

        todos.forEach(async todo => {
            if (todo.reminded) return;

            var todoDate = new Date(todo.date).getTime();
            var now = new Date().getTime();
            if (todoDate <= now) {
                var users = todo.users;
                users.forEach(async user => {
                    var embed = new Discord.EmbedBuilder()
                    .setTitle("To-do reminder")
                    .setDescription(todo.title)
                    .addFields([
                        {name : "Description", value: todo.description || "No description"},
                        {name: "Created by", value: `<@${todo.creator}>`},
                        {name: "Created at", value: discordTimestamp(todo.timestamp, "Relative")},
                        {name: "ID", value: "```" + todo.id + "```"}
                    ])

                    await manager.broadcastEval(async (client, {user, embed}) => {
                        var usr = await client.users.cache.get(user)
                        if (usr) {
                 
                        usr.send({embeds: [embed]})
                            
                        }

                    }, { context: { user: user, embed: embed } });


                })

                database.db("to-do").collection("to-do").updateOne({ id: todo.id }, { $set: { reminded: true } })

            }
        })
    }, 5000)
})