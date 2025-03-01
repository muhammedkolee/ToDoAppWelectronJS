// electron için gerekli modüller
const electron = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const Database = require("better-sqlite3");
const { app, BrowserWindow, Menu, ipcMain } = electron;

// ToDo'ları kaydedebilmek için gerekli değişkenlerin oluşturulması.
// const kayitlar = fs.readFileSync("kayitlar.json", "utf-8");
// const ListToDo = JSON.parse(kayitlar);

// Database sınıfından obje oluşturma.
const db = Database("kayitlar.db");

db.prepare(`
    create table if not exists todos(
        id integer primary key autoincrement,
        description text not null
    )

`).run()

// Ana ve todo ekleme pencere öğesi
let mainWindow;
let newWindow;

// Uygulama çalışıyor.
app.on("ready", () => {
    // Pencere oluşturuldu.
    mainWindow = new BrowserWindow({
        webPreferences: {
            // Güvenlik için gerekli ayarlar.
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false
        }
    });

    // Ana pencerede gösterilecek dosyanın path yolu.
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/mainWindow.html"),
            protocol: "file",
            slashes: true
        })
    )

    // Menü oluşturuldu.
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Menü ayarlandı.
    Menu.setApplicationMenu(mainMenu);

    // Yeni pencere açma komutu.
    ipcMain.on("preload:newWindow", () => {
        createWindow();
    });

    // Yeni todo ekleme komutu.
    ipcMain.on("preload:newToDo", (event, data) => {
        // ListToDo.ToDos.push({
        //     id: ListToDo.ToDos.length + 1,
        //     description: data
        // })
        // fs.writeFileSync("kayitlar.json", JSON.stringify(ListToDo, null, 2), "utf-8");
        const stmt = db.prepare(`insert into todos(description) values(?)`);
        const info = stmt.run(data);
        const query = db.prepare("select * from todos");
        const todos = query.all();

        mainWindow.webContents.send("resend", todos);
        // event.reply("resend", ListToDo.ToDos);      // Eklenen todou göstermek için veri gönderildi.
    })

    ipcMain.on("preload:reload", (event, data) => {                 // clickButon ismindeki fonksiyonu dinleyen ve fonksiyon çağırıldığında bu kod bloğunu çalıştıran fonksiyon.
        const query = db.prepare("select * from todos");
        const todos = query.all();
        
        event.reply("resend", todos);                      // clickButon fonksiyonu çağırıldığında resend isminde fonksiyonu çalıştırmak için tekrar veri gönderir.
    })

    // Silmesi istenen todoyu kayıtlardan silme fonksiyonu.
    ipcMain.on("preload:removeToDo", (event, data) => {
        const query = db.prepare("delete from todos where id = ?");
        query.run(data);
        const query2 = db.prepare("select * from todos");
        const todos = query2.all();
        event.reply("resend", todos);      // Kayıtlar değiştiği için tekrar gösterilmek üzere kayıt tekrar gönderildi.
    })

    // Uygulama ilk açıldığında verilerin kullanıcıya gösterilmesi için veriler gönderildi.
    ipcMain.handle("veriDoldur", async () => {
        const query = db.prepare("select * from todos");
        const todos = query.all();
        return todos;
    })

    // Uygulamadan çıkış.
    mainWindow.on("close", () => {
        // db.close();
        app.quit();
    });
})

// Menü ayarları
const mainMenuTemplate = [
    {
        label: "Dosya",
        submenu: [
            {
                label: "Ekle"           // Yeni ToDo eklenmesi.
            },
            {
                label: "Sil"            // Var olan ToDo'nun silinmesi.
            },
            {
                label: "Çıkış",
                accelerator: "Ctrl+Q",  // Uygulamanın kapanışı.
                role: "quit"
            }
        ]
    },
    {
        label: "Dev Tools",
        submenu: [
            {
                label: "Yenile",
                accelerator: "Ctrl+R",
                role: "reload"
            },
            {
                label: "Dev Tools",
                accelerator: "F12",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    }
]

// Yeni pencere oluşturma fonksiyonu
function createWindow() {
    newWindow = new BrowserWindow({
        width: 500,
        height: 350,
        title: "ToDo Ekle",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false 
        }
    })

    newWindow.loadURL(url.format({
        pathname: path.join(__dirname, "pages/addTodo.html"),
        protocol: "file",
        slashes: true
    }))

    newWindow.on("close", () => {
        newWindow = null;
    })
}

// ToDo silme fonksiyonu
function deleteToDo(ToDoId) {
    ListToDo.ToDos = ListToDo.ToDos.filter(todo => todo.id != ToDoId);
    fs.writeFileSync("kayitlar.json", JSON.stringify(ListToDo, null, 2), "utf-8");
    editToDo();
}

// ToDo'ların ID numaralarını ayarlayan fonksiyon.
function editToDo() {
    let count = 1;
    for (let todo of ListToDo.ToDos){
        if (todo.id == count){
            count++;
            continue;
        }
        else {
            todo.id = count;
            count++;
        }
    }
}