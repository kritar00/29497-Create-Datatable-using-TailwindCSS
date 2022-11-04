import apiCall from "./modules/API.js"
import getDate from "./modules/helpers.js"

let titleInput = document.getElementById('titleInput')
let imageInput = document.getElementById('imageInput')
let contentInput = document.getElementById('contentInput')
let popup = document.querySelector('.popup-form')
let list = document.getElementById("list")
let url = 'https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs'
let id = null

async function displayData(props) {
    let productItem = '';
    props.forEach(function (props, index) {
        let { id, title, content, createdAt, image } = props;
        productItem += ` 
            <tr class="item-wrapper odd:bg-white even:bg-stone-200">
            <td class="w-12 whitespace-nowrap text-blue-500 font-bold hover:underline">${id}</td>
            <td class="w-52 whitespace-nowrap">${createdAt}</td>
            <td class="whitespace-nowrap overflow-hidden max-w-sm">${title}</td>
            <td class="w-16 whitespace-nowrap"><img src="${image}"></td>
            <td class="whitespace-nowrap">${content}
            <button data-id=${id} class="float-right remove-item"><i class="uil uil-times pointer-events-none text-3xl"></i></button>
            <button data-id=${id} class="float-right edit-item"><i class="uil uil-edit-alt pointer-events-none text-3xl"></i></button>
            </td>
            </tr> `
        list.innerHTML = productItem;
    })
}
getData()
//GET method
async function getData() {
    await apiCall("GET", url).then((data) => {
        displayData(data);
    }).catch(function (err) {
        console.log(err);
    })
}
//Control POST and PUT
async function submitControl(event) {
    event.preventDefault()
    let obj = JSON.stringify({
        id: id || "",
        createdAt: getDate(),
        title: this.elements['title'].value,
        image: this.elements['image'].value,
        content: this.elements['content'].value
    });
    if (id) {
        await apiCall("PUT", `${url}/${id}`, obj).then((data) => {
            getData()
            popup.style.display = 'none'
        }).catch(function (err) {
            console.log(err);
        })
        id = null
    }
    else {
        await apiCall("POST", url, obj).then((data) => {
            getData()
        }).catch(function (err) {
            console.log(err);
        })
    }
    this.reset()
}
//Control Delete and Edit button
async function controlItem(event) {
    if (event.target.classList.contains('remove-item')) {
        id = event.target.dataset.id
        await apiCall("DELETE", `${url}/${id}`).then((data) => {
            getData()
        })
        id = null
    }
    else if (event.target.classList.contains('edit-item')) {
        id = event.target.dataset.id
        popup.style.display = 'block'
        await apiCall("GET", `${url}/${id}`).then((data) => {
            titleInput.value = data.title
            imageInput.value = data.image
            contentInput.value = data.content
        })
    }
}
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