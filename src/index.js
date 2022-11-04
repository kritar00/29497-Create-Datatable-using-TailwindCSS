import { submitControl, controlItem, getData } from "./modules/API.js"

let list = document.getElementById("list")
let popup = document.querySelector('.popup-form')




getData()

document.querySelector('.form-container').addEventListener('submit', submitControl)

list.addEventListener('click', controlItem)
let tableHeaders = document.getElementsByTagName('th')
for (let i = 0; i < tableHeaders.length; i++) {
    tableHeaders[i].classList.add('text-left', 'p-3', 'text-sm', 'font-semibold', 'tracking-wide')
}
document.getElementById('addBtn').addEventListener('click', function () {
    popup.style.display = 'block'
})

document.getElementById('cancel').addEventListener('click', function () {
    popup.style.display = 'none'
    document.querySelector('.form-container').reset()
})