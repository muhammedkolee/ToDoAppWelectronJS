// Uygulama ilk açıldığında çalışır (Verileri yazdırma fonksiyonu).
// ipcRenderer.send("preload:reload");

// html dosyasından gerekli öğelerin js dosyasında kullanılması için değişkenlere atanması.
let addToDoBtn = document.getElementById("addToDoBtn");
let reloadButton = document.getElementById("reloadButton");
let todoList = document.getElementById("todoList");
let baslik = document.getElementById("baslik");


// Yeni ToDo eklemeyi sağlayan pencereyi oluşturan fonksiyon.
addToDoBtn.addEventListener("click", () => {
    window.electronAPI.newWindow();
})

// ToDoların yenilenmesini sağlayan fonksiyon.
reloadButton.addEventListener("click", () => {
    console.log("Butona tıklandı.")
    window.electronAPI.reload();
})

// Çöp kutusuna tıklandığında todo'yu silen fonksiyon.
todoList.addEventListener("click", function (event) {
    const target = event.target;
    if (target.id === "silmeButon") {
        const todoItem = target.closest("li");
        console.log("todoItem: ", todoItem);
        let idDiv = todoItem.querySelector("#itemId");
        console.log("div: ", idDiv)
        // const span = todoItem.getElementById("itemId");
        // console.log("span: ", span);

        const todoId = idDiv.innerText;
        console.log(todoId);
        window.electronAPI.removeToDo(todoId);
    }
    else{
        console.log(target)
    }
})

// Kullanıcıya gösterilecek olan ToDo'ların verilerini getiren ve gösteren fonksiyon.
window.electronAPI.receiving((data) => {        // receiving fonksiyonu => preload.js dosyasından gelen tetikleme ile bu fonksiyon çalışır.
    showToDos(data);
})

// Uygulama ilk başlatıldığında çalışacak fonksiyon.
const ilkVeri = await window.electronAPI.veriDoldur();
showToDos(ilkVeri);

// ToDo'ları kullanıcıya gösteren fonksiyon.
function showToDos(liste) {
    todoList.innerHTML = "";    // Liste boşaltılıyor ki aynı todolar tekrar eklenmesin.
    let i = 1;
    for (let eleman of liste) {
        // ToDo'ların dinamik olarak gösterilmesi için gerekli elementler oluşturuluyor.
        let oge = document.createElement("li");
        let metin = document.createElement("span");
        let idDiv = document.createElement("div");
        let trashButton = document.createElement("button");
        let trash = document.createElement("i");

        // Öğeler görsellik açısından bootstrap kodlarıyla donatılıyor.
        oge.className = "list-group-item d-flex justify-content-between align-items-center";
        metin.className = "badge bg-primary rounded-pill";
        trash.className = "bi bi-trash";
        trashButton.className = "btn btn-danger btn-sm";
        trashButton.id = "silmeButon";
        trash.id = "silmeButon";
        idDiv.innerText = `${eleman.id}`;
        idDiv.id = "itemId";
        metin.innerText = i;

        // Öğeler dinamik olarak ekleniyor.
        todoList.appendChild(oge);
        oge.appendChild(metin);
        oge.innerHTML += eleman.description;
        oge.appendChild(idDiv);
        oge.appendChild(trashButton);
        trashButton.appendChild(trash);
        i++;
    }
}