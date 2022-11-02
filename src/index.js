let list = document.getElementById("list")
let titleInput = document.getElementById('titleInput')
let imageInput = document.getElementById('imageInput')
let contentInput = document.getElementById('contentInput')
// let title = ''
// let imageLink = ''
// let content = ''
let url = 'https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs'
// titleInput.addEventListener('input', function (e) {
//     title = e.target.value
// })
// imageInput.addEventListener('input', function (e) {
//     imageLink = e.target.value
// })
// contentInput.addEventListener('input', function (e) {
//     content = e.target.value
// })

async function displayData(props) {
    let productItem = '';
    props.forEach(function (props, index) {
        let { id, title, content, createdAt, image } = props;
        productItem += ` 
              <tr class="item-wrapper">
              <td>${id}</td>
              <td>${title}</td>
              <td>${createdAt}</td>
              <td class="w-16"><img src="${image}"></td>
              <td>${content}
              <button data-id=${id} class="float-right remove-item"><i class="uil uil-times"></i></button>
              <button data-id=${id} class="float-right edit-item"><i class="uil uil-edit-alt"></i></button>
              </td>
            </tr> `
        list.innerHTML = productItem;
    })
}

//GET method
getData()
async function getData() {
    const http = new XMLHttpRequest();
    http.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(this.responseText)
            displayData(response)
        }
    }
    http.open("GET", url)
    http.send()
}

document.querySelector('.form-container').addEventListener('submit', postData)

function postData(event) {
    event.preventDefault();
    const http = new XMLHttpRequest();
    http.open('POST', url);
    http.responseType = 'json'
    http.setRequestHeader('Content-Type', 'application/json');
    http.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 201) {
                getData()
                console.log('Add Item to the List')
            }
        }
    }
    let obj = JSON.stringify({
        id: "",
        createdAt: getDate(),
        title: this.elements['title'].value,
        image: this.elements['image'].value,
        content: this.elements['content'].value
    });
    http.send(obj);
    this.reset()
}
function deleteItem(event) {
    if (event.target.classList.contains('remove-item')) {
        let id = event.target.dataset.id
        const http = new XMLHttpRequest();
        http.open('DELETE', `${url}/${id}`);
        http.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    getData()
                    console.log('Item deleted')
                }
            }
        }
        http.send();
    }
}
list.addEventListener('click', deleteItem)
tableHeaders = document.getElementsByTagName('th')
for (let i = 0; i < tableHeaders.length; i++) {
    tableHeaders[i].classList.add('text-left', 'p-3', 'text-sm', 'font-semibold', 'tracking-wide')
}
document.getElementById('addBtn').addEventListener('click', function () {
    document.querySelector('.popup-form').style.display = 'block'
})

document.getElementById('cancel').addEventListener('click', function () {
    document.querySelector('.popup-form').style.display = 'none'
})
