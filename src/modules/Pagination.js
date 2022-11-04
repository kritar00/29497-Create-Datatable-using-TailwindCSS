export default function displayList(items, wrapper, rows_per_page, page) {
    wrapper.innerHTML = "";
    page--;
    let loop_start = rows_per_page * page
    let paginatedItems = items.slice(loop_start + rows_per_page)
    console.log(paginatedItems);
    for (let i = loop_start; i < loop_start; i++) {
    }
}