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
module.exports.run = async (bot, message, args) => {
    handleDisconnect();
    var d = new Date,
    dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()];
    let username = args[0];
    console.log(message.author.username + " has used !unban command");
    if(args.length < 1)
    {
        message.channel.send("Please provide the neccessary arguments, !unban <character>");
    }
    else
    {
        if(message.channel.type !='dm') // check if the message is in the discord or it will cause errors
        {
        if (message.member.hasPermission("ADMINISTRATOR")) // check if the player has admin permissions
        {
            con.query(`SELECT * FROM characters WHERE name = '${username}'`, (err, account) =>{
                if (err) throw err; // Checks if the account exists or not
                if(account.length < 1) 
                {
                    message.channel.send("The character " + username + " does not exist.");
                    return;
                }
                else
                {
                    con.query(`SELECT * FROM accounts WHERE id = ${account[0].accountid}`, (err, rows) =>
                    {
                        if (err) throw err;
                        if(rows[0].loggedin > 0) // Check if the player is online or not
                        {
                            message.channel.send("Make sure the player is not connected to the server.");
                            return;
                        }
                        else
                        {
                            var updateBan = `UPDATE accounts SET banned = 0 WHERE id = '${account[0].accountid}'`; // Unbans the player

                            con.query(updateBan, (err) => {
                            if(err) throw err;
                            const embed = new RichEmbed().setTitle("Unbanned")
                            .setThumbnail(config.serverMascot)
                            .setDescription("Successfully unbanned ACCOUNT: " + account[0].name + ".")
                            .setColor(config.serverColor)
                            .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);
                            console.log("The account " + username + ", has been unbanned.");
                            message.channel.send(embed);
                            con.destroy();
                            });
                        }
                    });
                }
            });
        }
        else
        {
            message.channel.send("You do not have the proper permissions to use this command.");
             // sends this to them if they try to use the command in discord server
        }
        }
        else
        {
            message.channel.send("You do not have the proper permissions to use this command.");
            // sends this to them if they try to use the command in bot DMs
            console.log(message.author.username + " tried to use this command in DMs");
        }
    }
}
module.exports.help = {
    name: "unban"
}