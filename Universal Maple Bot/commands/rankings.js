const mysql = require('mysql')
const { RichEmbed } = require('discord.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));

function numberWithCommas(x) { // formats the number into commans accordingly
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
module.exports.run = async (bot, message , args) => {
    handleDisconnect();
    var rankingType = args[0]; // the ranking type the player provided
    var rankingArr = ["meso", "fame", "level"]; // if you want to add more you add "rb" into this array
    var d = new Date, dformat = [d.getMonth()+1,d.getDate(),d.getFullYear()];
    if(args.length <= 0) // check if they provided the ranking type
    {
        message.channel.send("Please provide a ranking type, !rankings <meso|fame|level>")
        return;
    }
    else
    {
        if(rankingType.toLowerCase() == rankingArr[0] || rankingType.toLowerCase() == rankingArr[1] || rankingType.toLowerCase() == rankingArr[2]) 
        // this if statement is a meme, but add to it when you add another type into the ranking array
        {
            var columnType;
            switch(rankingType) // check what ranking type the player provided and change columnType equivalent to what it is in the SQL
            {
                case "meso":
                    columnType = "meso";
                    break;
                case "rb":
                    columnType = "reborns"; // there is a rb column for possibly rb servers so I kept it here
                    // change reborns to the corresponding columnType in your SQL
                    break;
                case "fame":
                    columnType = "fame";
                    break;
                case "level":
                    columnType = "level";
                    break;
                default :
                    console.log("[ERROR] arguments given by player were incorrect.");
                    break;
            }
            con.query(`SELECT * FROM characters WHERE gm <= 0 ORDER BY ${columnType} DESC`, (err, rows) => {
                if (err) throw err;
                if(rows.length < 1) // rare, but we check if any characters at all even exists
                {
                    message.channel.send("No characters were found.");
                    return;
                }
                else
                {
                    // memes :P
                    var rankType1;
                    var rankType1Name;

                    var rankType2;
                    var rankType2Name;

                    var rankType3;
                    var rankType3Name;

                    var rankType4;
                    var rankType4Name;

                    var rankType5;
                    var rankType5Name;

                    switch(columnType) // more memes :)
                    {
                        // checks if there is more than one character if not then set that ranking to NONE
                        case "meso":
                            rankType1 = rows[0].meso;
                            rankType2 = (rows.length < 2) ? "NONE" : rows[1].meso;
                            rankType3 = (rows.length < 3) ? "NONE" : rows[2].meso;
                            rankType4 = (rows.length < 4) ? "NONE" : rows[3].meso;
                            rankType5 = (rows.length < 5) ? "NONE" : rows[4].meso;

                            rankType1Name = rows[0].name;
                            rankType2Name = (rows.length < 2) ? "NONE" : rows[1].name;
                            rankType3Name = (rows.length < 3) ? "NONE" : rows[2].name;
                            rankType4Name = (rows.length < 4) ? "NONE" : rows[3].name;
                            rankType5Name = (rows.length < 5) ? "NONE" : rows[4].name;
                            break;
                        case "reborns":
                            rankType1 = rows[0].reborns;
                            rankType2 = (rows.length < 2) ? "NONE" : rows[1].reborns;
                            rankType3 = (rows.length < 3) ? "NONE" : rows[2].reborns;
                            rankType4 = (rows.length < 4) ? "NONE" : rows[3].reborns;
                            rankType5 = (rows.length < 5) ? "NONE" : rows[4].reborns;

                            rankType1Name = rows[0].name;
                            rankType2Name = (rows.length < 2) ? "NONE" : rows[1].name;
                            rankType3Name = (rows.length < 3) ? "NONE" : rows[2].name;
                            rankType4Name = (rows.length < 4) ? "NONE" : rows[3].name;
                            rankType5Name = (rows.length < 5) ? "NONE" : rows[4].name;
                            break;
                        case "fame":
                            rankType1 = rows[0].fame;
                            rankType2 = (rows.length < 2) ? "NONE" : rows[1].fame;
                            rankType3 = (rows.length < 3) ? "NONE" : rows[2].fame;
                            rankType4 = (rows.length < 4) ? "NONE" : rows[3].fame;
                            rankType5 = (rows.length < 5) ? "NONE" : rows[4].fame;

                            rankType1Name = rows[0].name;
                            rankType2Name = (rows.length < 2) ? "NONE" : rows[1].name;
                            rankType3Name = (rows.length < 3) ? "NONE" : rows[2].name;
                            rankType4Name = (rows.length < 4) ? "NONE" : rows[3].name;
                            rankType5Name = (rows.length < 5) ? "NONE" : rows[4].name;
                            break;
                        case "level":
                            rankType1 = rows[0].level;
                            rankType2 = (rows.length < 2) ? "NONE" : rows[1].level;
                            rankType3 = (rows.length < 3) ? "NONE" : rows[2].level;
                            rankType4 = (rows.length < 4) ? "NONE" : rows[3].level;
                            rankType5 = (rows.length < 5) ? "NONE" : rows[4].level;

                            rankType1Name = rows[0].name;
                            rankType2Name = (rows.length < 2) ? "NONE" : rows[1].name;
                            rankType3Name = (rows.length < 3) ? "NONE" : rows[2].name;
                            rankType4Name = (rows.length < 4) ? "NONE" : rows[3].name;
                            rankType5Name = (rows.length < 5) ? "NONE" : rows[4].name;
                            break;
                        default:
                            console.log("[ERROR] columnType is undefined.");
                            break;
                    }

                    const embed = new RichEmbed()
                    .setTitle(`${rankingType.toUpperCase()} RANKINGS`)
                    .setThumbnail(config.serverMascot)
                    .setDescription("Top 5 Characters for " + rankingType.toUpperCase())
                    .addField("1st", rankType1Name + ": " + numberWithCommas(rankType1) + ` ${rankingType.toUpperCase()}(s)`)
                    .addField("2nd",rankType2Name + ": " + numberWithCommas(rankType2) + ` ${rankingType.toUpperCase()}(s)`)
                    .addField("3rd",rankType3Name + ": " + numberWithCommas(rankType3) + ` ${rankingType.toUpperCase()}(s)`)
                    .addField("4th",rankType4Name + ": " + numberWithCommas(rankType4) + ` ${rankingType.toUpperCase()}(s)`)
                    .addField("5th",rankType5Name + ": " + numberWithCommas(rankType5) + ` ${rankingType.toUpperCase()}(s)`)
                    .setColor('#ADD8E6')
                    .setFooter(`${config.serverName} - ` + dformat[0] + "/" + dformat[1] + "/" + dformat[2]);

                    message.channel.send(embed);
                    con.destroy();
                }
            });
        }
        else // if they provided an incorrect ranking type send them this message
        {
            message.channel.send('"' + rankingType + '" is not a valid ranking type, !rankings <fame|meso|level>');
            return;
        }
    }
}

module.exports.help = {
    name : "rankings"
}