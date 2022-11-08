import apiCall from "./modules/API.js"
import getDate from "./modules/helpers.js"

let titleInput = document.getElementById('titleInput')
let imageInput = document.getElementById('imageInput')
let contentInput = document.getElementById('contentInput')
let popup = document.querySelector('.popup-form')
let list = document.getElementById("list")
const pagination_element = document.getElementById('pagination')
let url = 'https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs'
let id = null
let current_page = 1
let rows = 5
let start = 0
let end = rows
let total
let select = document.getElementById('page-select')
const btnNext = document.querySelector('.btn-next')
const btnPrev = document.querySelector('.btn-prev')
function displayData(props) {
    let productItem = '';
    props.map(function (prop, index) {
        if (index >= start && index < end)
            productItem += ` 
            <tr class="item-wrapper odd:bg-white even:bg-stone-200">
            <td class="w-12 whitespace-nowrap text-blue-500 font-bold hover:underline">${prop.id}</td>
            <td class="w-52 whitespace-nowrap">${prop.createdAt}</td>
            <td class="whitespace-nowrap overflow-hidden w-5">${prop.title}</td>
            <td class="w-16 whitespace-nowrap"><img src="${prop.image}"></td>
            <td class="whitespace-nowrap overflow-hidden">${prop.content}
            <button data-id=${prop.id} class="float-right remove-item"><i class="uil uil-times pointer-events-none text-3xl"></i></button>
            <button data-id=${prop.id} class="float-right edit-item"><i class="uil uil-edit-alt pointer-events-none text-3xl"></i></button>
            </td>
            </tr> `
    })
    list.innerHTML = productItem;
}

getData()
//GET method
async function getData() {
    apiCall("GET", url).then((data) => {
        displayData(data);
        pagination(data, total = Math.ceil(data.length / rows))
        pageShift(data)
    }).catch(function (err) {
        console.log(err);
    })
}
//Control Pagination
function pagination(props, total) {
    displayNumOfPages(total)
    btnNext.addEventListener('click', () => {
        current_page++;
        if (current_page > total) {
            current_page = total
        }
        if (current_page === total)
            btnNext.classList.add('opacity-50')
        btnPrev.classList.remove('opacity-50')
        start = (current_page - 1) * rows
        end = current_page * rows
        displayData(props)
    })
    btnPrev.addEventListener('click', () => {
        current_page--;
        if (current_page <= 1) {
            current_page = 1
        }
        if (current_page === 1)
            btnPrev.classList.add('opacity-50')
        btnNext.classList.remove('opacity-50')
        start = (current_page - 1) * rows
        end = current_page * rows
        displayData(props)
    })

    select.addEventListener('change', () => {
        current_page = 1
        rows = select.value
        total = Math.ceil(props.length / rows)
        start = (current_page - 1) * rows
        end = current_page * rows
        displayNumOfPages(total)
        displayData(props)
        pageShift(props)
    })

}
function displayNumOfPages(total) {
    let page = ''
    page += `<li class="hover:bg-violet-700 active:bg-violet-500 focus:outline-none focus:ring focus:ring-violet-300 px-2 page"><a>${1}</a></li>`
    for (let i = 2; i <= total; i++) {
        page += `<li class="hover:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300 px-2 page"><a>${i}</a></li>`
    }
    document.getElementById('page-number').innerHTML = page
}
function pageShift(props) {
    let pageNumber = document.querySelectorAll('.page')
    console.log(pageNumber);
    for (let i = 0; i < pageNumber.length; i++) {
        pageNumber[i].addEventListener('click', () => {
            let value = i + 1
            current_page = value
            if (current_page > 1 && current_page < total) {
                btnPrev.classList.remove('opacity-50')
                btnNext.classList.remove('opacity-50')
            }
            if (current_page === 1) {
                btnPrev.classList.add('opacity-50')
                btnNext.classList.remove('opacity-50')
            }
            if (current_page === total) {
                btnNext.classList.add('opacity-50')
                btnPrev.classList.remove('opacity-50')
            }
            start = (current_page - 1) * rows
            end = current_page * rows
            displayData(props)
        })
    }
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
        apiCall("PUT", `${url}/${id}`, obj).then((data) => {
            getData()
            popup.style.display = 'none'
        }).catch(function (err) {
            console.log(err);
        })
        id = null
    }
    else {
        apiCall("POST", url, obj).then((data) => {
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
        apiCall("DELETE", `${url}/${id}`).then((data) => {
            getData()

            id = null
        }).catch(function (err) {
            console.log(err);
        })
    }
    else if (event.target.classList.contains('edit-item')) {
        id = event.target.dataset.id
        popup.style.display = 'block'
        apiCall("GET", `${url}/${id}`).then((data) => {
            titleInput.value = data.title
            imageInput.value = data.image
            contentInput.value = data.content
        }).catch(function (err) {
            console.log(err);
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