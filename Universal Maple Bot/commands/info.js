const { RichEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));

module.exports.run = async (bot,message,args) => {
    var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()];
    const embed = new RichEmbed()
    .setColor(config.serverColor)
    .setTitle(config.serverName)
    .setThumbnail(config.serverMascot)
    .setDescription("INSERT Region & Version #")
    .addField('Exp', '1x', true) // replace 1x with what your server rates are
    .addField('Item', '1x', true) // replace 1x with what your server rates are
    .addField('Meso', '1x', true) // replace 1x with what your server rates are
    .addField('Server State', 'N/A',true) // replace N/A with w/e you want really
    .addField('Server Location', 'N/A', true)
    .addField('Release Date', 'N/A')
    // .setURL(config.serverWebsite) make sure ur link has an http:// otherwise it will throw an error, I commented it out for now
    .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);
    message.channel.send(embed);
    console.log(message.author.username + " has used !info command");
}

module.exports.help = {
    name : "info"
}