const mysql = require('mysql')
const { RichEmbed } = require('discord.js');
const fs = require('fs')

// reading config.json in the config directory
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));

var db_config = { // settings for the database to connect
    host: config.databaseHost,
      user: config.databaseUser,
      password: config.databasePass,
      database: config.databaseName
};
  
  var con;
  
  function handleDisconnect() {// function that recursively calls itself when it fails to connect to the DB or lost connection
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
    let username = args[0]; // character name is first argument
    var mesoAmount = parseInt(args[1], 10); // we convert 2nd argument into an Int value
    console.log(message.author.username + " has used !givemeso command");
    if(args.length <= 1) // checks if the person provided enough arguments
    {
        message.channel.send("Please provide the neccessary arguments, !givemeso <username> <amount>");
    }
    else
    {
        if(message.channel.type !='dm') // checks if message is in DMs, cause you get problems if you check permissions in DMs
        {
        if (message.member.hasPermission("ADMINISTRATOR")) // checks if the player has admin permissions on discord
        {
            if(isNaN(mesoAmount)) // checks if its a valid number to use
            {
                message.channel.send(mesoAmount + " is not a valid number.");
                return;
            }
            else
            {
                con.query(`SELECT * FROM characters WHERE name = '${username}'`, (err, account) =>{
                    // finding all the rows where name is the username given by the player in discord
                    if (err) throw err;
                    if(account.length < 1) // if no rows appear then no character with that username exists
                    {
                        message.channel.send('The character "' + username + '" does not exist.');
                        return;
                    }
                    else
                    {
                        
                        if (err) throw err;
                        con.query(`SELECT * FROM accounts WHERE id = ${account[0].accountid}`, (err, rows) => {
                            // calling a query for accounts so we can check if they are online
                            if(rows[0].loggedin > 0) // check if they are online or not
                            {
                                message.channel.send("Make sure the player is not connected to the server.");
                                return;
                            }
                            else
                            {
                                var realcash = account[0].meso;
                                var totalAmount = realcash + mesoAmount;
                                var updateDp = `UPDATE characters SET meso = '${totalAmount}' WHERE name = '${username}'`; // this adds onto their current amount of mesos

                                con.query(updateDp, (err) => {
                                if(err) throw err;
                                const embed = new RichEmbed().setTitle("Mesos")
                                .setThumbnail(config.serverMascot)
                                .setDescription("Successfully gave ACCOUNT: " + account[0].name + " " + mesoAmount + " mesos.")
                                .setColor('#008000')
                                .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);
                                console.log("The account " + username + ", has been given " + mesoAmount + " mesos");
                                message.channel.send(embed);
                                con.destroy(); // disconnect database connection
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
    name: "givemeso"
}