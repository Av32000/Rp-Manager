const { Intents, Client, Constants } = require('discord.js')
const dotenv = require('dotenv')
const mysql = require('mysql')
const utils = require('./utils')

dotenv.config()

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ]
})

client.on('ready', () => {
  const guildID = "895704892021288971"
  const guild = client.guilds.cache.get(guildID)
  let commands

  if (guild) {
    commands = guild.commands
  } else {
    commands = client.application.commands
  }

  commands?.create({
    name: "ping",
    description: "Renvoie pong si le bot est allumé"
  })

  commands?.create({
    name: "add_oc",
    description: "Ajoute un oc a l'utilisateur",
    options: [
      {
        name: "name",
        description: "Le nom de l'oc",
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
      },
      {
        name: "description",
        description: "La description de l'oc",
        required: true,
        type: Constants.ApplicationCommandOptionTypes.STRING
      },
      {
        name: "image_url",
        description: "L'url du message de l'image de l'oc",
        required: false,
        type: Constants.ApplicationCommandOptionTypes.STRING
      }]
  })

    commands?.create({
      name: "select_oc",
      description: "Séléctionne un oc",
      options: [
        {
          name: "oc",
          description: "Le nom de l'oc",
          required: true,
          type: Constants.ApplicationCommandOptionTypes.STRING
        }
      ]
    })

    commands?.create({
      name: "add_role",
      description: "Ajoute un role a l'utilisateur et a son oc",
      options: [
        {
          name: "user",
          description: "L'utilisateur",
          required: true,
          type: Constants.ApplicationCommandOptionTypes.USER
        },
        {
          name: "role",
          description: "Le role",
          required: true,
          type: Constants.ApplicationCommandOptionTypes.ROLE
        },
      ]
    })

  console.log("The bot is ready !")
})

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const { commandName, options } = interaction

    if (commandName == "ping") {
      let file = require('./commands/ping')
      let instance = new file
      instance.exec(interaction);
    } else if (commandName == "add_oc") {
      let file = require('./commands/add_oc')
      let instance = new file
      instance.exec(interaction, options.getString("name"), options.getString("description"), options.getString("image_url"));
    } else if (commandName == "add_role") {
      let file = require('./commands/add_role')
      let instance = new file
      instance.exec(interaction, options.getUser('user'), options.getRole('role'));
    } else if (commandName == "select_oc") {
      let file = require('./commands/select_oc')
      let instance = new file
      instance.exec(interaction, options.getString("oc"));
    }
  }
})

function initDB() {
  var connection = mysql.createConnection({
    host: `${process.env.BDDHOST}`,
    user: `${process.env.BDDUSER}`,
    password: `${process.env.BDDPASS}`,
    database: 'rp_manager'
  });

  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }

    console.log('connected as id ' + connection.threadId);
  });

  utils.bdd = connection;

}

initDB()
client.login(process.env.TOKEN)