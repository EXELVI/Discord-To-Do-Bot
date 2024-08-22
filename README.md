# ☑️ Discord To-Do Bot

[![GitHub stars](https://img.shields.io/github/stars/EXELVI/Connect_Four?style=for-the-badge)](https://github.com/EXELVI/Connect_Four/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/EXELVI/Connect_Four?style=for-the-badge)](https://github.com/EXELVI/Connect_Four)
[![GitHub issues](https://img.shields.io/github/issues/EXELVI/Connect_Four?style=for-the-badge)](https://github.com/EXELVI/Connect_Four/issues)
[![Last Commit](https://img.shields.io/github/last-commit/EXELVI/Connect_Four?style=for-the-badge)](https://github.com/EXELVI/Connect_Four/commits/main)

![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PNPM](https://img.shields.io/badge/PNPM-CF51E1?style=for-the-badge&logo=pnpm&logoColor=white)

Welcome to the **Discord To-Do Bot** repository! This bot is a simple to-do list bot that allows you to create, edit, delete, complete and show to-dos. The bot is built using Discord.js, MongoDB and Node.js.

## 📝 Features

- **Create, Edit, and Manage To-Dos**: Create new to-dos, edit them, and mark them as complete or incomplete.
- **Shard Management**: Efficiently handles multiple shards to ensure the bot scales with large servers.
- **MongoDB Integration**: Persistent storage of user data using MongoDB.
- **Slash Commands**: Modern command interactions with Discord's slash commands.
- **Reminders**: Get reminders for pending to-dos at a specified time.
- **To-Do Modals**: Interactive to-do modals for easy editing.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Discord Bot Token](https://discord.com/developers/applications) (with enabled intents)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/EXELVI/Discord-To-Do-Bot.git
    cd Discord-To-Do-Bot
    ```

2.  Install the dependencies:

    If you are using pnpm:

    ```bash
    pnpm install
    ```

    else:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory and add the following:

    ```
    token=YOUR_DISCORD_BOT_TOKEN
    mongodb=YOUR_MONGODB_CONNECTION_STRING
    ```

4. Start the bot:

    ```bash
    node index.js
    ```

## 📚 Commands

### General

- **`/help`**: Lists all available commands.
- **`/test`**: Shows all shards ping, bot uptime and memory usage.

### To-Do

- **`/new`**: Create a new to-do.
- **`/show`**: Show a to-do.
- **`/edit`**: Edit a to-do.
- **`/delete`**: Delete one or multiple to-dos.
- **`/complete`**: Complete one or multiple to-dos.
- **`/uncomplete`**: Uncomplete one or multiple to-dos.


## 📅 Events

### General

- **`ready`**: Logs the bot's ready status and registers slash commands.

### To-Do

- **`modalEdit`**: Handles to-do edit modal interactions.

## 📄 Functions

- **`discordTimestamp`**: Returns a Discord timestamp for a given date.

## 📂 Project Structure

```bash
│   .env                # Contains token and MongoDB credentials (excluded from git)
│   .gitattributes
│   .gitignore
│   bot.js              # Handles the bot's shard
│   client.js           # Bot client setup (required in bot.js)
│   db.js               # MongoDB connection setup
│   index.js            # Shard manager, to-do reminder
│   manager.js          # Shard manager setup
│   package-lock.json
│   package.json
│   pnpm-lock.yaml
│   README.md           # You are here!
│
├───commands            # Commands directory
│   ├───general
│   │       help.js     # Help command, lists all commands
│   │       test.js     # Shows all shards ping, bot uptime and memory usage
│   │
│   └───to-do
│           complete.js # Complete(s)/uncomplete(s) one/multiple to-do
│           delete.js   # Delete(s) one/multiple to-do
│           edit.js     # Edit one to-do
│           new.js      # Create a new to-do
│           show.js     # Show a to-do
│
├───events
│   ├───general
│   │       ready.js    # Ready event, logs bot's ready status, registers slash commands,
│   │
│   └───to-do
│           modalEdit.js  # Handles to-do edit modal interactions
│
└───functions
        general.js    # General functions (discordTimestamp)
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check the [issues page](https://github.com/EXELVI/Discord-To-Do-Bot/issues).