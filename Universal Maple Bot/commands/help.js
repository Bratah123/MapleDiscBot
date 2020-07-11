const { RichEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));

module.exports.run = async (bot,message,args) => {
    var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()];
        const embed = new RichEmbed()
        .setTitle("Commands")
        .setColor(config.serverColor)
        .setDescription(`All Commands from ${config.serverName} Bot`)
        .addField("Player Commands", "!online\n!info\n!faq\n!character <name>\n!rankings <meso|fame>")
        .addField("Admin Commands", "!givedp <username> <amount>\n!givemeso <name> <amount>\n!setname <name> <new name>\n!unban <name>")
        .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);
        message.author.send(embed);
        console.log(message.author.username + " has used !help command");
}

module.exports.help = {
    name : "help"
}