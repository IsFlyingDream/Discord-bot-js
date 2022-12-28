#!/usr/bin/env node
//本文件關鍵字為：$save
//以下方法因為$save 加上時間有許多問題：內部機器時間與Discord時間不同、需要加判斷式、容易玩壞的問題，因此僅有$save的功能
//const { channel } = require('diagnostics_channel');
const { Client, GatewayIntentBits } = require('discord.js');

const keepAlive = require(`./server`);//保持機器人清醒

//const { token } = require('./token.json');
//剛加前綴字
//const { prefix } = require('./token.json');
// 從 .env 檔案中讀取環境變數
//const dotenv = require('dotenv')
//dotenv.config();
const prefix = process.env['PREFIX'];
const token = process.env['TOKEN'];

var fs = require("fs"),
  path = require("path");


//const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });



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


  //if (prefixText[0] === `${prefix}`) {//判斷前綴字
  if (prefixText[0] === prefix) {//判斷前綴字
    const keyWord = prefixText.substr(1);//砍掉第一個前綴字
    const rules = /save+/;

    //刪除檔案的function
    function deleteFile(url, name) {
      var files = [];

      if (fs.existsSync(url)) {    //判断给定的路径是否存在

        files = fs.readdirSync(url);    //返回文件和子目录的数组

        files.forEach(function(file, index) {

          var curPath = path.join(url, file);

          if (fs.statSync(curPath).isDirectory()) { //同步读取文件夹文件，如果是文件夹，则函数回调
            deleteFile(curPath, name);
          } else {

            if (file.indexOf(name) > -1) {    //是指定文件，则删除
              fs.unlinkSync(curPath);
              console.log("刪除文件：" + curPath);
            }
          }
        });
      } else {
        console.log("給予的路徑不存在！");
      }
    }

    //  以下是判斷式  ------------------------
    if (keyWord === `save`) {
      //(最新)執行此方法>>cli.bat改成字串傳值，不同段 以&&相接-------------    
      //*
      var exec = require('child_process').exec;
      function execute() {
        let cmd = 'cd DiscordChatExporter.Cli';
        cmd += ' && dotnet DiscordChatExporter.Cli.dll export -t \"' + token + '\" -c ' + message.channel.id + ' -o "%G_%C.html" ';
        exec(cmd,
          (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
              console.log(`exec error: ${error}`);
            }

            // Send a local file發送本地文件      
            message.channel.send({
              files: [{
                attachment: './DiscordChatExporter.Cli/' + message.guild.name + '_' + message.channel.name + '.html',
                name: message.guild.name + '_' + message.channel.name + '.html'
              }]
            }).then(msg => {              //aaaaaaaa
              //檔案傳送完以後就刪除本機檔案
              deleteFile('DiscordChatExporter.Cli/', message.guild.name + '_' + message.channel.name + '.html');

            }).catch(console.error);

          });

      }
      execute();
      //*/
      //*/


      message.reply('全部時段，儲存中...');//機器人的回應
    }
    /*以下因為時間判斷若有打錯，系統就會當掉，並且replit時間與內部時間不同，有錯誤情況發生，因此不使用
    else if (rules.test(keyWord) === true) {
      const timeString = keyWord.substr(4);//取得後續字串的時間
      console.log(timeString);

      //(最新)執行此方法>>cli.bat改成字串傳值，不同段 以&&相接-------------   
     
      let exec = require('child_process').exec;
      function execute2() {
        
        let cmd2 = 'cd DiscordChatExporter.Cli';
        cmd2 += ' && dotnet DiscordChatExporter.Cli.dll export -t \"' + token + '\" -c ' +  message.channel.id + ' ' + timeString  +  '  -o "%G_%C.html" ';

          exec(cmd2,
          (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
              console.log(`exec error: ${error}`);
            }

            // Send a local file發送本地文件      
            message.channel.send({
              files: [{
                attachment: './DiscordChatExporter.Cli/' + message.guild.name + '_' + message.channel.name + '.html',
                name: message.guild.name + '_' + message.channel.name + '.html'
              }]
            }).then(msg => {
              //aaaaaaaa
              //檔案傳送完以後就刪除本機檔案
               deleteFile('DiscordChatExporter.Cli/', message.guild.name + '_' + message.channel.name + '.html');
              
            }).catch(console.error);
              
          });
      }
      execute2();
      
      message.reply('指定時段，儲存中...');//機器人的回應
    }*/
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
      cmd +=' && dotnet DiscordChatExporter.Cli.dll export -t \"'+process.env.TOKEN+'\" -c 1053640153308086292 -o \"\\Desktop\\%G_%C.html\" ';
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



//client.login(token);
keepAlive();
client.login(token);

