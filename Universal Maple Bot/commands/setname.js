const mysql = require('mysql')
const { RichEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));

function isAlphanumeric(inputtxt) { // we use this function to make sure its a legal name otherwise SQL will freak out
    var letters = /^[0-9a-zA-Z]+$/;
    if (letters.test(inputtxt)) {
      return true;
    } 
    else {
      return false;
    }
  }

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
    var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()];
    let username = args[0]; // old name
    let newName = args[1]; // new name
    console.log(message.author.username + " has used !setname command");
    if(args.length <= 1)
    {
        message.channel.send("Please provide the neccessary arguments, !setname <username> <new name>");
    }
    else
    {
        if(message.channel.type !='dm') // check if the message is in the discord or it will cause errors
        {
        if (message.member.hasPermission("ADMINISTRATOR")) // check if the player has admin permissions
        {
            if(!isAlphanumeric(newName)) // check if the name is legal
            {
                message.channel.send(newName + " is not a valid IGN.");
                console.log(message.author.username + " used !setname command and provided an illegal name.")
                return;
            }
            else
            {
                con.query(`SELECT * FROM characters WHERE name = '${username}'`, (err, account) =>{
                    if (err) throw err;
                    if(account.length < 1)  // gotta check if the character exists in the first place
                    {
                        message.channel.send('The character "' + username + '" does not exist.');
                        console.log(message.author.username + " used !setname command");
                        return;
                    }
                    else
                    {
                        if (err) throw err;
                        con.query(`SELECT * FROM accounts WHERE id = ${account[0].accountid}`, (err, rows) => {
                            if(rows[0].loggedin > 0) // check if they are online or not
                            {
                                message.channel.send("Make sure the player is not connected to the server.");
                                return;
                            }
                            else
                            {
                                con.query(`SELECT * FROM characters WHERE name = '${newName}'`, (err, character) => {
                                    var updateName = `UPDATE characters SET name = '${newName}' WHERE name = '${username}'`;
                                    if(character.length >= 1){ // if there is 1 or more rows that pop up the name is taken
                                        message.channel.send("This IGN is already taken.");
                                        return;
                                    }
                                    con.query(updateName, (err) => { // execute the query to update name
                                    if(err) throw err;
                                    const embed = new RichEmbed().setTitle("IGN Change")
                                    .setThumbnail(config.serverMascot)
                                    .setDescription("Successfully changed Character: " + username + " to " + newName + ".")
                                    .setColor('#008000')
                                    .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);
                                    console.log("The IGN for character " + username + ", has been changed to " + newName + ".");
                                    message.channel.send(embed);
                                    con.destroy(); // disconnect from the database
                                    });
                                })
                            }
                        });
                    }
                });
            }
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
    name: "setname"
}