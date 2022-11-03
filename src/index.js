import getDate from "./helpers.js"

let list = document.getElementById("list")
let titleInput = document.getElementById('titleInput')
let imageInput = document.getElementById('imageInput')
let contentInput = document.getElementById('contentInput')
let popup = document.querySelector('.popup-form')
let url = 'https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs'
let id = null

async function displayData(props) {
    let productItem = '';
    props.forEach(function (props, index) {
        let { id, title, content, createdAt, image } = props;
        productItem += ` 
              <tr class="item-wrapper odd:bg-white even:bg-stone-200">
              <td class="whitespace-nowrap text-blue-500 font-bold hover:underline">${id}</td>
              <td class="whitespace-nowrap">${createdAt}</td>
              <td class="whitespace-nowrap">${title}</td>
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
async function getData(id) {
    const http = new XMLHttpRequest();
    http.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText)
            if (id) {
                titleInput.value = response.title
                imageInput.value = response.image
                contentInput.value = response.content
            }
            else {
                displayData(response)
            }
        }
    }
    http.open("GET", id ? `${url}/${id}` : url)
    http.send()
}

document.querySelector('.form-container').addEventListener('submit', submitControl)
//Control POST and PUT
async function submitControl(event) {
    event.preventDefault()
    if (id === null) {
        let obj = JSON.stringify({
            id: "",
            createdAt: getDate(),
            title: this.elements['title'].value,
            image: this.elements['image'].value,
            content: this.elements['content'].value
        });
        await postData(obj)
    }
    else {
        let obj = JSON.stringify({
            id: id,
            createdAt: getDate(),
            title: this.elements['title'].value,
            image: this.elements['image'].value,
            content: this.elements['content'].value
        });
        await editAtApi(id, obj)
        id = null
    }
    this.reset()
}
//POST method
async function postData(obj) {
    const http = new XMLHttpRequest();
    http.open('POST', url);
    http.responseType = 'json'
    http.setRequestHeader('Content-Type', 'application/json');
    http.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 201) {
                getData()
            }
        }
    }
    http.send(obj);
}
//PUT method
async function editAtApi(id, obj) {
    const http = new XMLHttpRequest();
    http.open('PUT', `${url}/${id}`);
    http.responseType = 'json'
    http.setRequestHeader('Content-Type', 'application/json');
    http.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                popup.style.display = 'none'
                getData()
            }
        }
    }
    http.send(obj);
}
//DELETE method
async function deleteAtApi(id) {
    const http = new XMLHttpRequest();
    http.open('DELETE', `${url}/${id}`);
    http.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                getData()
                id = null
            }
        }
    }
    http.send();
}
//Control Delete and Edit button
async function controlItem(event) {
    if (event.target.classList.contains('remove-item')) {
        id = event.target.dataset.id
        await deleteAtApi(id)
    }
    else if (event.target.classList.contains('edit-item')) {
        id = event.target.dataset.id
        popup.style.display = 'block'
        getData(id)
    }
}
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