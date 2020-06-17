const mysql = require('mysql');
const fs = require('fs');
const { RichEmbed } = require('discord.js');

/* Reading JSON files from other directory */
const jobs = JSON.parse(fs.readFileSync('config/jobs.json', 'utf8'));
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));

function numberWithCommas(x) { // Formats numbers to have commas in the proper place
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
var db_config = { // settings for the database to connect
    host: config.databaseHost,
      user: config.databaseUser,
      password: config.databasePass,
      database: config.databaseName
  };
  
  var con;
  
  function handleDisconnect() { // function that recursively calls itself if it finds the database connection has been disconnected
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

  function isAlphanumeric(inputtxt) { // returns true as long as the inputTxt is alphanumeric, else false
    var letters = /^[0-9a-zA-Z]+$/;
    if (letters.test(inputtxt)) {
      return true;
    } 
    else {
      return false;
    }
  }

  const isKoreanWord = (input) => { // for KMS servers, as some IGNs will be in Korean
    const match = input.match(/[\u3131-\uD79D]/g);
    return match ? match.length === input.length : false;
  }

module.exports.run = async (bot, message, args)=> {
    handleDisconnect();
        var characterName = args[0]; // 0 being the first argument !character <name> name = args[0]
        if(args.length <= 0) // checks if they provided a character name
        {
            message.channel.send("You did not provide the neccessary arguments, !character <name>");
            console.log(message.author.username + " has used !character command and didn't give enough arguments");
            return;
        }
        else if(!isAlphanumeric(characterName) && !isKoreanWord(characterName)) // checks if its a legal name to use
        { 
          message.channel.send("You provided an illegal name, !character <name>");
          console.log(message.author.username + " has used !character command and gave an illegal name.");
          return;
        }
        else{
            con.query(`SELECT * FROM characters WHERE name = '${characterName}'`, (err, rows) => {
              // select every row from characters as long as the name is the given character name
              // it returns rows[] an array which stores the columns, rows[0] would be column 1 and so on
                if (err) throw err;
                if(rows.length <= 0) // if no columns appear then no characters with that name exists
                {
                    message.reply("That character does not exist.");
                    console.log(message.author.username + " used !character command");
                    return;
                }
                else
                {
                  var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()];
                  var accountId = rows[0].accountid;

                  con.query(`SELECT * FROM accounts WHERE id = ${accountId}`, (err, account) => {
                    // do another query here for the accounts so we can get donation points and other account wide stats

                    var onlineColor = (account[0].loggedin > 0) ? '#008000' : '#FF0000'; // if the account is logged in it'll return green else red
                    var isAdmin = (rows[0].gm == 6) ? "[Admin] " + rows[0].name : rows[0].name; // checks if the character is a GM, if so add [Admin] to their name

                    /* Stats */
                    var mesos = rows[0].meso;
                    var donationPoints = account[0].dpoints; // some column names for donation points might be different, change accordingly, i.e account[0].dp
                    var fame = rows[0].fame;

                    const embed = new RichEmbed()
                    .setTitle("Character Info")
                    .setThumbnail(config.serverMascot) // artwork of server pic
                    .setColor(onlineColor) // green if account is online, red is offline
                    .setDescription(rows[0].name + "'s Info/Stats")
                    .addField("IGN", isAdmin, true) // IGN
                    .addField("Fame", numberWithCommas(fame), true) // Fame
                    .addBlankField(true)
                    .addField("Level", rows[0].level, true) // Level
                    .addField("Mesos", numberWithCommas(mesos), true) // Mesos
                    .addField("Job", jobs[rows[0].job], true) // What job, some may show as undefined just add that ID to the jobs.json
                    .addField("Donation Points", numberWithCommas(donationPoints), true) // donation points
                    .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);
                    message.channel.send(embed);
                    console.log(message.author.username + " has used !character command");
                    con.destroy(); // end the connection to the database
                  });
                }
            });
        }
}

module.exports.help = {
    name : "character"
}