function sum(a, b) {
    return a + b;
}

function convertCurreny(money, value) {
    let x = +money * +value;
    return x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function getDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let MM = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let HH = String(today.getHours()).padStart(2, '0')
    let mm = String(today.getMinutes()).padStart(2, '0')

    today = MM + '/' + dd + '/' + yyyy + ' ' + HH + ":" + mm;
    return today
}
// const dt = new Date();
// const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

// console.log(`${padL(dt.getMonth() + 1)}/${padL(dt.getDate())}/${dt.getFullYear()} ${padL(dt.getHours())}:${padL(dt.getMinutes())}:${padL(dt.getSeconds())}`
// );