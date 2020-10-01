# MapleDiscBot
### "Universal" plug and play MapleStory Discord bot for your private server.
If you have any questions or bug reports, my Discord ID is `Not Brandon#4444`

I tried to make this maplestory discord bot as plug n play as possible but you are still going to need to some work.
Note, I don't claim to be a good programmer but I think this could help people who are new at creating a Discord bot and I think its time I released something for them :P

Make sure to use Visual Studio Code for any debugging or editing.

## 1. How to get a discord bot token? <h2>
1. Visit the [Discord Developer Portal](https://discord.com/developers/applications)
  
2. At the top right corner of the page, click on the `New Application` button, and fill in the appropriate details
  
![Discord Application Button](https://cdn.discordapp.com/attachments/631249406775132182/722901729573863424/eb9cd2edd04845b4a5a9581f7f897cc1.png)

3. Now click on your new application you just created

4. Select the Bot option on the left side of the screen

![Discord Bot Option](https://cdn.discordapp.com/attachments/631249406775132182/722902298896105544/454736b9a5d5ce7e45dc2aedad8b8d34.png)

5. At the right under `Build-A-Bot`, click on the `Add Bot` button

6. Under `Token`, click on `Click to Reveal Token`. You can now see the hidden token ID; you may click on the `Copy` button to have it added to your clipboard

![Token](https://cdn.discordapp.com/attachments/631249406775132182/722902431893028905/e6a8b8f3fae0e3f6650d7e5e6ac148b8.png)

## 2. How to set up the bot <h2>
1. The first thing you want to fill out for it to work is `config.json` in the config Folder
  
![config file](https://cdn.discordapp.com/attachments/631249406775132182/722903468884623360/9374ffcdfbe7479e389cbbe079fb83d5.png)

2. **YOU MUST FILL OUT ALL ASPECTS FOR IT TO WORK**

3. Starting with token, you want to put your bot token you just made into token area

4. `addRole` : `addRole` defaults to `false`. If you set it to `true`, make sure to fill out the `role ID` that you want automatically assigned for newcomers to your Discord server.

5. `serverName` : Insert your server name (e.g. whateverMS, nottakenMS, SpiritMS, etc.)

6. `serverWebsite` : Insert your website URL.

7. `serverMascot` : URL of a picture, you kinda need to fill this one out otherwise you will get errors

7.5: `serverColor` : The hexcode to a color that matches your server artwork.

8. `databaseName` : Your database name.

9. `databasePass` : Password of your database. It is empty by default, but that is where you would set your SQL password.

10. `databaseUser` : Defaulted to root, change if otherwise.

11. `databaseHost` : Again defaulted to localhost.

FINISH: If you matched all criterias(you probably won't), run the bot with `start.bat` and boom you should have a working bot (it will restart the bot if it crashes).
It should look like this.

![Console Bot](https://cdn.discordapp.com/attachments/631249406775132182/722905288268578877/e24282ae54c99746c077e6b13d69e049.png)

## 3. I get errors how to fix!1!!?? <h2>
  
![mysql error](https://media.discordapp.net/attachments/696165783272685568/722896954270417239/unknown.png)

Make sure to type `npm install mysql` in terminal of visual studio code.


![badAPI error](https://media.discordapp.net/attachments/696165783272685568/722899994956529715/unknown.png?width=1061&height=154)

Make sure to fill out the `serverMascot` section of `config.json`


### !givedp !character doesn't work!

1. Open the files in commands folder, and read the comments

2. You want `account[0].dpoint` to match the column name in your SQL. (e.g. `account[0].dpoints`, `account[0].dp`, or `account[0].donationPoints`)

![dp](https://media.discordapp.net/attachments/631249406775132182/722919637783674990/d4ac0dbac50cf15a3ed1a29c298362e3.png)

Similarly for the `!givedp` command, you'd want to change the `dpoint` column accordingly
1. In the `updateDp` Variable change `SET "dpoints"` to whatever your donation points is called
2. Do the same for realcash. Change it to `rows[0].dpoints` or whatever your column name is in SQL.

![givedp](https://cdn.discordapp.com/attachments/631249406775132182/722920371485147186/e5ddd7403d0bf5463b834a6ee725f084.png)

Extra: You can read through the source code and change it to your liking, in `info.js` I removed the `setURL()` but you can easily reenable features to your liking.

## Gallery <h2>

![rankings](https://cdn.discordapp.com/attachments/631249406775132182/722926569256910938/bd55ac078210298f038da307d43e6b96.png)

![online](https://media.discordapp.net/attachments/631249406775132182/722926971578875905/ea6162e280dfe0fa1c410f6d71866764.png)
