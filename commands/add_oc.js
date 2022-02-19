const { MessageEmbed } = require('discord.js')
const bdd = require('../utils').bdd

class Ping {
  exec(interaction, name, description, image_url) {

    bdd.query(`SELECT * FROM oc WHERE EXISTS(SELECT * FROM oc WHERE name = "${name}")`, function (error, results, fields) {
      if (results[0] != null) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(`Cet oc existe déjà !`)
          ]
        })
      } else {
        bdd.query(`INSERT INTO oc (userid, name, description) VALUES (${interaction.user.id} , "${name}", "${description}")`, function (error, results, fields) {
          const embed = new MessageEmbed()
            .setColor('AQUA')
            .setTitle(`Fiche d'identité de ${name}`)
            .setDescription(`${description}`)
            .setFooter(`OC de ${interaction.user.tag}`, interaction.user.displayAvatarURL())

          if (image_url != null && image_url.includes(".png")) {
            embed.setThumbnail(image_url)
            bdd.query(`UPDATE oc SET icon_url = "${image_url}" WHERE name = "${name}"`, function (error, results, fields) {console.log(results)})
          }

          interaction.reply({
            embeds: [embed]
          })
        });
      }
    })
  }
}
module.exports = Ping