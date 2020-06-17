const Discord = require('discord.js');
const bot = new Discord.Client();
const mysql = require('mysql') // if you get an mysql error, in terminal do "npm install mysql --save"
const { RichEmbed } = require('discord.js');

const path = require('path')
const fs = require("fs")

/* directories that store JOB and config Info */
const config = require(path.join(__dirname, 'config', 'config.json')) // reading config.json in the directory "config"
const jobs = require(path.join(__dirname, 'config', 'jobs.json')) // reading jobs.json in the directory "config"

bot.commands = new Discord.Collection();
fs.readdir("./commands/", (err,files) => { // reading all files from the commands directory
    if (err) throw err;

    let jsFiles = files.filter(f => f.split(".").pop() === "js"); // checks if it has the keyword .js at the end
    if(jsFiles.length <= 0)
    {
        console.log("No commands were found in the commands directory.");
        return;
    }
    console.log(`Now loading ${jsFiles.length} commands...`);

    jsFiles.forEach((f,i) => { // if the file does have a js at the end add it to bot.commands Collection()
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded.`)
        bot.commands.set(props.help.name,props); // adding whatever is in the help.name section of the commands, these are the keywords that will trigger the command
    });
    console.log('Successfully finished loading all commands.')
});

bot.on('ready', () => {
    console.log('The bot is logged on!');
    bot.user.setActivity(config.serverWebsite); // Displays the bot as "playing" the server website URL
  });

bot.on('guildMemberAdd', member =>{
    console.log(member.user.username + ` just joined ${config.serverName} Discord Server.`);
    if(!config.addRole){ // set addRole in config.json to true if you want the bot to set players role upon joining
        return;
    }
    var role = config.roleToAdd; // roleToAdd is the id of the role you want players to have when joining your discord

    member.addRole(role)
    console.log(member.user.username + " was given the Player Role");
});

bot.on('message', message =>
{
    // Command Handler
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1); // args is an array, the first part of the command !example will be cut off the array

    let cmd = bot.commands.get(command.slice(1));
    if(cmd) cmd.run(bot, message, args);

});

bot.login(config.token);