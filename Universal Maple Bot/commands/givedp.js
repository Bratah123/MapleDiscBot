const mysql = require('mysql')
const fs = require('fs');
const { RichEmbed } = require('discord.js');

// reading config.json in the config directory
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
    var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()];
    let username = args[0]; // first argument needed, character name
    var dpAmount = parseInt(args[1], 10); // 2nd argument needed, we parse it so it becomes an Int value and can add it to the total DP they had already.
    console.log(message.author.username + " has used !givedp command");
    if(args.length <= 1)
    {
        message.channel.send("Please provide the neccessary arguments, !givedp <username> <amount>");
    }
    else
    {
        if(message.channel.type !='dm') // checks if the message is in the discord server or not, crashes if it tries to check permissions in DMs
        {
        if (message.member.hasPermission("ADMINISTRATOR")) // checks if the user is an admin in the discord server
        {
            if(isNaN(dpAmount)) // checks if dp Amount
            {
                message.channel.send(dpAmount + " is not a valid number.");
                return;
            }
            else
            {
                con.query(`SELECT * FROM characters WHERE name = '${username}'`, (err, account) =>{
                    if (err) throw err;
                    if(account.length < 1)  // checks if the character even exists
                    {
                        message.channel.send("The character " + username + " does not exist.");
                        return;
                    }
                    else
                    {
                        con.query(`SELECT * FROM accounts WHERE id = ${account[0].accountid}`, (err, rows) => // column name could be account[0].accountId make sure to check ur SQL to fix errors accordingly
                        {
                            if (err) throw err;
                            if(rows[0].loggedin > 0) // check if they are online or not
                            {
                                message.channel.send("Make sure the player is not connected to the server.");
                                return;
                            }
                            else
                            {
                                var realcash = rows[0].dpoints; // change dpoint to the column name accordingly to your column name. I.E. rows[0].dp
                                var totalAmount = realcash + dpAmount;
                                var updateDp = `UPDATE accounts SET dpoints = '${totalAmount}' WHERE id = '${account[0].accountid}'`;
                                // in updateDP "dpoint" change accordingly to your OWN column name for donation points
                                con.query(updateDp, (err) => { // query that UPDATES the donation points
                                if(err) throw err;
                                const embed = new RichEmbed().setTitle("Donation Points")
                                .setThumbnail(config.serverMascot)
                                .setDescription("Successfully gave ACCOUNT: " + account[0].name + " " + dpAmount + " donation points.")
                                .setColor('#008000')
                                .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);
                                console.log("The account " + username + ", has been given " + dpAmount + " donation points.");
                                message.channel.send(embed);
                                con.destroy();
                                });
                            }
                        });
                    }
                });
            }
        }
        else
        {
            message.channel.send("You do not have the proper permissions to use this command.");
        }
        }
        else
        {
            message.channel.send("You do not have the proper permissions to use this command.");
            console.log(message.author.username + " tried to use this command in DMs");
        }
    }
}
module.exports.help = {
    name: "givedp"
}