const { MessageEmbed } = require('discord.js')
const bdd = require('../utils').bdd

class Ping {
  exec(interaction, user, role) {
    bdd.query(`SELECT * FROM users WHERE EXISTS(SELECT * FROM users WHERE userid = "${interaction.user.id}") AND userid = "${user.id}"`, function (error, results, fields) {
      if (results[0] == null) {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(`Cet utilisateur n'a pas d'oc actif`)
          ]
        })
      } else {
        bdd.query(`SELECT * FROM oc WHERE name = "${results[0].activeoc}"`, function (error, results1, fields) {
          bdd.query(`UPDATE oc SET roles = "${results1[0].roles + " " + role.id}" WHERE name = "${results1[0].name}"`, function (error, results, fields) {
            interaction.guild.members.cache.find(users => users.id === user.id).roles.add(interaction.guild.roles.cache.find(roles => roles.id === role.id))
            interaction.reply({
              content: "Le rôle a bien été ajouté"
            })
          });
        })
      }
    })
  }
}
module.exports = Ping