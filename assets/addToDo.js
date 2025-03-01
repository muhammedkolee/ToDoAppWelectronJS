// ToDo'nun eklenmesi için gerekli öğeler html dosyasından alındı.
let todoInput = document.getElementById("todoInput");
let addToDoButton = document.getElementById("addToDoButton");

// Ekle butonuna tıklandığında çalışacak fonksiyon.
addToDoButton.addEventListener("click", () => {
    if(todoInput.value === "")
    {
        alert("Değer boş olamaz.");
        return
    }
    window.electronAPI.newToDo(todoInput.value);
    todoInput.value = null;
})