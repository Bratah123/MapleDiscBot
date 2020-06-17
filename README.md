# MapleDiscBot
"Universal" plug n play maplestory discord bot for your private server.

I tried to make this maplestory discord bot as plug n play as possible but you are still going to need to some work.
Note, I'm don't claim to be a good programmer and there might be some memes in here but it could help newer people
and I think its time I released something :P

Make sure to use Visual Studio Code for any debugging or editing.

## How to get a discord bot token? <h2>
1. discordapp.com
2. Developers tab at the top then select developer portal
![Discord Taskbar](https://media.discordapp.net/attachments/631249406775132182/722900574022139925/fa160fc47785eeb2a73f763244dcef34.png)
3. Top right click new Application, name it accordingly
  
![Discord Application Button](https://cdn.discordapp.com/attachments/631249406775132182/722901729573863424/eb9cd2edd04845b4a5a9581f7f897cc1.png)

4. Now click on your new application you just created
5. Select the Bot option on the left side of the screen

![Discord Bot Option](https://cdn.discordapp.com/attachments/631249406775132182/722902298896105544/454736b9a5d5ce7e45dc2aedad8b8d34.png)

6. Top right click add bot
7. Now you can see the token ID hidden, click copy and there you go you have your token ID

![Token](https://cdn.discordapp.com/attachments/631249406775132182/722902431893028905/e6a8b8f3fae0e3f6650d7e5e6ac148b8.png)


## How to set up the bot <h2>
1. The first thing you want to fill out for it to work is config.json in the config Folder
  
  ![config file](https://cdn.discordapp.com/attachments/631249406775132182/722903468884623360/9374ffcdfbe7479e389cbbe079fb83d5.png)
2. YOU MUST FILL OUT ALL ASPECTS FOR IT TO WORK
3.Starting with token, you want to put your bot token you just made into token area
4.addRole: addRole is defaulted to false, if you put it to true make sure to put the role ID you want players who joins ur discord server to get.
5.serverName: just put ur server name I.E.(whateverMS, nottakenMS)
6.serverWebsite: insert your website URL.
7.serverMascot : URL of a picture, you kinda need to fill this one out otherwise you will get errors
7.5: serverColor : the hexcode to a color that matches your server artwork.
8. databaseName : your database name.
9. databasePass : Password of your database I defaulted it to nothing, but that is where you wanna put your SQL password.
10. databaseUser: defaulted to root, change if otherwise.
11. databaseHost : again defaulted to localhost.

FINISH: If you matched all criterias(you probably won't), run the bot with start.bat and boom you should have a working bot (it will restart the bot if it crashes).
It should look like this.

![Console Bot](https://cdn.discordapp.com/attachments/631249406775132182/722905288268578877/e24282ae54c99746c077e6b13d69e049.png)

## I get errors how to fix!1!!?? <h2>
1. make sure to type "npm install mysql" in terminal of visual studio code
