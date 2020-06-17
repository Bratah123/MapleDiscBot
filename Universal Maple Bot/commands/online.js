const mysql = require('mysql')
const { RichEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));

var db_config = { // settings for the database to connect
  host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePass,
    database: config.databaseName
};
  
  var con;
  
  function handleDisconnect() { // function that recursively calls itself when it fails to connect to the DB or lost connection
    con = mysql.createConnection(db_config);
  
    con.connect(function(err) { 
      if(err) {
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000);
      }                                     
    });                                     
    con.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
      } else {
        throw err;
      }
    });
  }
module.exports.run = async (bot, message, args) =>
{
    handleDisconnect();
        con.query(`SELECT * FROM accounts WHERE loggedin >= 1`, (err, rows) =>{
          // finding all accounts that have loggedin column set as a number higher than 0 which means they are online
            var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()];
            if(err) throw err;
            playersOnline = rows.length;
            let embed = new RichEmbed().setColor('#008000') // #00800 is green
            .setTitle("Players Online")
            .setThumbnail(config.serverMascot)
            .setDescription(playersOnline + " player(s) online.")
            .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);
            message.channel.send(embed)
            console.log(message.author.username + " has used !online command");
            con.destroy();
        });
}

module.exports.help = {
    name : "online"
}