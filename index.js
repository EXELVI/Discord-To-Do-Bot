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

        todos.forEach(async todo => {
            if (todo.reminded) return;

            var todoDate = new Date(todo.date).getTime();
            var now = new Date().getTime();
            if (todoDate <= now) {
                var users = todo.users;
                users.forEach(async user => {
                    var userFetched = await manager.broadcastEval((client) => client.users.cache.get(user));
                    var user = userFetched.find(x => x);
                    if (user) {
                        user.send({ content: `🔔 **Reminder**\n\n**Title:** ${todo.title}\n**Description:** ${todo.description}` });
                    }
                })

                database.db("to-do").collection("to-do").updateOne({ id: todo.id }, { $set: { reminded: true } })

            }
        })
    }, 5000)
})