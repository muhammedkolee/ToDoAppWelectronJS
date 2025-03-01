// electron için gerekli modüller
const { contextBridge, ipcRenderer, ipcMain } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // Yeni pencerenin açılması için haberleşme öğesi.
    newWindow: (message) => {
        ipcRenderer.send("preload:newWindow", message);
    },

    // Yeni todo eklenmesi için haberleşme öğesi.
    newToDo: (data) => {
        ipcRenderer.send("preload:newToDo", data);
    },

    // ToDo listesinin yenilenmesi için haberleşme öğesi.
    reload: (data) => {             // clickButon fonksiyonu => ipcRenderer bu fonksiyonu çalıştırdığında bu kod bloğu çalışır.
        ipcRenderer.send("preload:reload", data);
    },

    // Verilerin tekrar gönderilmesi için iki taraflı haberleşme öğesi.
    receiving: (callback) => {      // receiving fonksiyonu => ipcMain tarafı resend isminde bir fonksiyonun çalışmasını istediğinde ipcRenderer bu fonksiyonu çalıştırır.
        ipcRenderer.on("resend", (event, data) => {
            callback(data);
        });
    },

    // ToDo'nun silinmesi için gerekli haberleşme öğesi.
    removeToDo: (data) => {
        ipcRenderer.send("preload:removeToDo", data);
    },

    // Uygulama ilk açıldığında verilerin gönderilmesi için haberleşme öğesi.
    veriDoldur: () => ipcRenderer.invoke("veriDoldur")
});