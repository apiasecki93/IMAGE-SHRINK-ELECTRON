const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require("electron");

//Set env
process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;
//console.log(process.platform)

let mainWindow;
let aboutWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// Create main window function to be called when the app is ready
function createMainWindow() {

    //mainWindow instanciation (with properties of the main window)
  mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: isDev ? 800 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    backgroundColor: '#ffffff',

    // enabled node intergateion with the main window so we could use node modules using webPreference properies
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        // nodeIntegrationInWorker: true
    },
  })

    //to open web tools automatically when dev mode enabled
    if(isDev) {
        mainWindow.webContents.openDevTools()
    }

        //mainWindow.loadURL(`http://nlbxtsca02p/WebViews/Middels_readers.html`) <-- to use https protocol with link
        //mainWindow.loadURL(`file://${__dirname}/app/index.html`) to use from file system with loadURL method
        //alternativly I will use short handed loadFile method:
    mainWindow.loadFile('./app/index.html')
        //mainWindow.loadURL(`http://nlbxtsca02p/WebViews/Middels_readers.html`)

}


function createAboutWindow() {

    //mainWindow instanciation (with properties of the main window)
  aboutWindow = new BrowserWindow({
    title: "About ImageShrink",
    width:  500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev ? true : false,
    backgroundColor: '#ffffff',

    //enabled node intergateion with the about window
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        // nodeIntegrationInWorker: true
    },
  })
    
  
    //aboutWindow.loadURL(`http://nlbxtsca02p/WebViews/Middels_readers.html`)
    aboutWindow.loadFile('./app/about.html')


}

app.on("ready", () => {
    createMainWindow()
    //createAboutWindow()
    // creating template
    const mainMenu = Menu.buildFromTemplate(menu)
    // setting template
    Menu.setApplicationMenu(mainMenu)


    // globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
    // globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools())


    mainWindow.on('close', () => mainWindow = null)
});


const menu = [
    ...(isMac 
        ? 
            [
                { 
                    label: app.name,
                    submenu: [
                        {
                            label: 'About',
                            click: createAboutWindow
                        },
                    ]
                },
            ]
        : []),
    // standard file menu:
    {
        role: 'fileMenu'
    },
    ...(!isMac ? [
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow
                },
            ]
        }
    ]: []),
    ...(isDev ? [
        {
            label: 'Developer Tools',
            submenu: [
                {role: 'reload'},
                {role: 'forcereload'},
                {type: 'separator'},
                {role: 'toggledevtools'},

            ]
        }
    ]: [])
    
    
    //EXAMPLE HOW TO SET LABEL ON BY ONE:
    // {
    //     label: 'File',
    //     submenu: [
    //         {
    //             label: 'Quit',
    //             accelerator:  'CmdOrCtrl+W',
    //             click: () => app.quit() //exits the application
    //         },
    //     ],
    // },
]

ipcMain.on('image:minimize', (e, options) => {
    console.log(options)
})



// Quit when all windows are closed, except on macOS. There, it's common
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (!isMac) {
        app.quit()
    }
})

app.on('active', () => {
    //on macOS it is common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})



