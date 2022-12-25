#!/usr/bin/env node
//本文件關鍵字為：$save
//const { channel } = require('diagnostics_channel');
const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./token.json');
//const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });

//剛加前綴字
const { prefix } = require('./token.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
/*//最初範例寫法
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});*/

/*使用說明(指令說明)
$save   //存全部
$save --after "2022-12-24 18:00" //存從2022-12-24 18:00之後的紀錄
$save --after "2022-12-24 18:00" --before "2022-12-24 20:00"  //存從2022-12-24 18:00 ~ 2022-12-24 20:00的紀錄
*/
client.on('messageCreate', async (message) => {//從訊息上辨認
   
  const prefixText = String(message.content);

  if (prefixText[0] === `${prefix}`) {//判斷前綴字
    const keyWord = prefixText.substr(1);//砍掉第一個前綴字
    const rules = /save+/;//裡面那個$是寫死的，找不到參照變數prefix的方式 

    if (keyWord === `save`) {
      //(最新)執行此方法>>cli.bat改成字串傳值，不同段 以&&相接-------------    
      //*
      var exec = require('child_process').exec;
      function execute() { 
        var cmd = 'echo 321';
        cmd +=' && cd DiscordChatExporter.Cli/';
        cmd +=' && dotnet DiscordChatExporter.Cli.dll export -t \"'+token+'\" -c '+message.channel.id+' -o \"\\Desktop\\%G_%C.html\" ';
        exec(cmd,
            (error, stdout, stderr) => {
                console.log(`${stdout}`);
                console.log(`${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
        });
      }
      execute();
      //*/

      message.reply('全部時段，儲存中...');//機器人的回應
    }
    else if (rules.test(keyWord) === true) {
      const timeString = keyWord.substr(4);//取得後續字串的時間
      console.log(timeString);

      //(最新)執行此方法>>cli.bat改成字串傳值，不同段 以&&相接-------------   
      //*
      var exec = require('child_process').exec;
      function execute() { 
        var cmd = 'echo 321';
        cmd +=' && cd DiscordChatExporter.Cli/';
        cmd +=' && dotnet DiscordChatExporter.Cli.dll export -t \"'+token+'\" -c '+message.channel.id+'  '+timeString+'  -o \"\\Desktop\\%G_%C.html\" ';
        exec(cmd,
            (error, stdout, stderr) => {
                console.log(`${stdout}`);
                console.log(`${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
        });
      }
      execute();
      //*/
      message.reply('指定時段，儲存中...');//機器人的回應
    }
  }
});

//啟動指令無法獲取ID，因此不使用
/*
client.on('interactionCreate', async interaction => {//啟動指令
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'save') {

    //(1)原始寫法:(寫死)嘗試加入要抓命令提是字元的code，命令提是字元在這個檔案內：cli.bat
          const exec = require('child_process').exec;
      var yourscript = exec('cli.bat',
          (error, stdout, stderr) => {
              console.log(`${stdout}`);
              console.log(`${stderr}`);
              if (error !== null) {
                  console.log(`exec error: ${error}`);
              }
      });
    

    //(2)最新_執行此方法>>cli.bat改成字串傳值，不同段 以&&相接-------------   
    var exec = require('child_process').exec;
    function execute() { 
      //var cmd = 'cd /d "E:/postsql/bin>" && shp2pgsql -W "GBK" C:/tcc/beijing_points.shp  viwpt >C:/tcc/viwpt.sql && psql -d spatial -f C:/tcc/viwpt.sql postgres';
      var cmd = 'echo 321';
      cmd +=' && cd DiscordChatExporter.Cli/';
      cmd +=' && dotnet DiscordChatExporter.Cli.dll export -t \"'+token+'\" -c 1053640153308086292 -o \"\\Desktop\\%G_%C.html\" ';
      exec(cmd,
          (error, stdout, stderr) => {
              console.log(`${stdout}`);
              console.log(`${stderr}`);
              if (error !== null) {
                  console.log(`exec error: ${error}`);
              }
      });
    }
    execute();

    await interaction.reply('Pong!');
  }
});*/



client.login(token);
