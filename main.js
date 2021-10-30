const { app, BrowserWindow, ipcMain: ipc } = require("electron");
require('v8-compile-cache');
const express = require("express")
var appp = express();
const path = require('path')
const fs = require("fs")
const rpc = require("discord-rpc");
const { redirect } = require("statuses");
const client = new rpc.Client({ transport: 'ipc' });
var bodyParser = require('body-parser')

appp.set('view engine', 'html')
const {
  JsonDatabase,
} = require("wio.db");
const db = new JsonDatabase({
  databasePath:"./databases/rpc.json"
});
appp.use(bodyParser.urlencoded({ extended: false }))
appp.use(bodyParser.json())
const AppID = "903315059604877342"
const details = (db.get("rpc").details) || "ayarlanmamış";
const largeImageKey = (db.get("rpc").imagekey) || "ayarlanmamış";
const largeImageText = (db.get("rpc").imagetext) || "ayarlanmamış";
client.on('ready', () => {

client.setActivity({
  details: details,
  largeImageKey: largeImageKey,
  largeImageText: largeImageText,
  startTimestamp: new Date(),
  buttons: [
    { label: "Sitem", url: "https://cenap.js.org/" },{label: "bu rpcyi caldığım kaynak", url: "https://github.com/elevenvac/apptime-desktop/blob/main/main.js"}
  ]
});
});
rpc.register(AppID);
client.login({ clientId: AppID }).catch((error) => {
throw error.message;
});

appp.get("/", (req,res) => {

res.sendFile(__dirname+"/index.html")
})

appp.post("/rpcset", (req,res) =>{

  console.log(req.body)
db.set("rpc",{ "details": req.body.details, "imagekey": req.body.imagekey, "imagetext": req.body.imagetext})
//fs.writeFileSync("rpc.json", ({ "details": req.body.details, "imagekey": req.body.imagekey, "imagetext": req.body.imagetext}));
  res.send("Projeyi tekrar başlat Ğ")
  console.log(db.get("rpc"))
  
})


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('client.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

appp.listen(8000,() => {
  console.log("APPlistened")
})
