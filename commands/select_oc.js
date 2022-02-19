const { MessageEmbed } = require('discord.js')
const bdd = require('../utils').bdd
const wait = require("timers/promises").setTimeout;

class Ping {
  async exec(interaction, oc) {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setDescription("Récupération des roles...")
      ]
    })
    await wait(1000);
    //Récuperer les anciens roles (si nécéssaire)
    let lastRoles = [];
    bdd.query(`SELECT activeoc FROM users WHERE userid = ${interaction.user.id}`, function (error, results, fields) {
      if (results[0] != null) {
        bdd.query(`SELECT * FROM oc WHERE name = "${results[0].activeoc}"`, function (error, results1, fields) {
          if (results1[0].roles != null) {
            console.log(results1[0].roles)
            results1[0].roles.split(" ").forEach(element => {
              if (element != null && interaction.guild.roles.cache.find(i => i.id == element) != undefined) {
                lastRoles.push(interaction.guild.roles.cache.find(i => i.id == element))
              }
            });
          }
        })
      }
    })
    await wait(1000);
    //Verifier que l'oc existe
    interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setDescription("Validation de l'oc...")
      ]
    })
    let exists = true;
    bdd.query(`SELECT * FROM oc WHERE userid = ${interaction.user.id} AND name = "${oc}"`, function (error, results, fields) {
      if (results[0] == null) {
        exists = false;
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setDescription("Cet oc n'existe pas ou alors, il ne vous appartient pas !")
          ]
        })
      }
    })
    await wait(1000);
    if (exists == false) {
      return;
    }
    //Changer l'oc actif
    interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setDescription("Changement de l'oc actif...")
      ]
    })
    bdd.query(`SELECT * FROM users WHERE userid = ${interaction.user.id}`, function (error, results, fields) {
      if (results[0] == null) {
        bdd.query(`INSERT INTO users (userid, activeoc) VALUES (${interaction.user.id} , "${oc}")`)
      } else {
        bdd.query(`UPDATE users SET activeoc = "${oc}" WHERE userid = ${interaction.user.id}`)
      }
    })
    await wait(1000);
    //Récuperer les nouveaux roles
    interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setDescription("Récupération des nouveaux roles")
      ]
    })
    let newRoles = [];
    bdd.query(`SELECT activeoc FROM users WHERE userid = ${interaction.user.id}`, function (error, results, fields) {
      if (results[0] != null) {
        bdd.query(`SELECT roles FROM oc WHERE name = "${results[0].activeoc}"`, function (error, results1, fields) {
          if (results1[0].roles != null) {
            results1[0].roles.split(" ").forEach(element => {
              if (element != null && interaction.guild.roles.cache.find(i => i.id == element) != undefined) {
                newRoles.push(interaction.guild.roles.cache.find(i => i.id == element))
              }
            });
          }
        })
      }
    })
    await wait(1000);
    //Retirer les anciens roles (si nécéssaire)
    if (interaction.user.id != interaction.guild.ownerId) {
      interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription("Retrait des anciens roles...")
        ]
      })
      if (lastRoles[0] != null) {
        lastRoles.forEach(element => {
          if (element != null && element != undefined) {
            interaction.member.roles.remove(element)
          }
        })
      }
    }

    //Ajouter les nouveaux roles (si nécéssaire)
    if (interaction.user.id != interaction.guild.ownerId) {
      interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription("Ajouts des nouveaux roles...")
        ]
      })
      if (newRoles[0] != null) {
        newRoles.forEach(element => {
          if (element != null && element != undefined) {
            interaction.member.roles.add(element)
          }
        })
      }
    }
    //Changer le Pseudo
    if (interaction.user.id != interaction.guild.ownerId) {
      interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription("Changement du pseudo...")
        ]
      })
      interaction.member.setNickname(oc)
      interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription(`Vous jouez désormais ${oc}`)
            .setColor("#4287f5")
        ]
      })
    } else {
      interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setDescription(`Vous jouez désormais ${oc} mais vous êtes prpriéaire du serveur. Je n'ai pas la permission de gérer vos rôles et votre pseudo !`)
            .setColor("#4287f5")
        ]
      })
    }
  }
}
module.exports = Ping