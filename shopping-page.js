
//! pull product from home page and show these product in this page 

// let addFromHome ;
let addFromHome =  JSON.parse(localStorage.getItem('addFromHome')) || []

let tableProducts = document.querySelector(".table-products")
for(let i = 0; i < addFromHome.length; i++) {
    
    let newProduct = document.createElement("tr")
    newProduct.classList.add("products")
    newProduct.id = addFromHome[i].id
    newProduct.innerHTML = 
    `
        <td data-th="product-title" class="remove-product">
            <span class="material-symbols-outlined cancel">
                cancel
            </span>
        </td>
        <td class="image">
            <img src="${addFromHome[i].img}" alt="">
        </td>
        <a data-th="title" class="product-title"  href="singlePro.html?id=${addFromHome[i].id}" >${addFromHome[i].title}</a>
        <td data-th="price" class="price">${addFromHome[i].price}</td>
        <td class="quantity">
            <div class="quantity-child">
                <span class="material-symbols-outlined size-icon">
                    remove
                </span>
                <div class="number">1</div>
                <span class="material-symbols-outlined size-icon">
                    add
                </span>
            </div>
        </td>
        <td class="Subtotal">${addFromHome[i].price}</td>

    `
    tableProducts.appendChild(newProduct)
}

//* handle empty shopping cart

function handleEmptyShopCart() {
    if (addFromHome.length < 1) {
        let tableProducts = document.querySelector('.table-products')
        let createTr = document.createElement("tr")
        createTr.classList.add("handleEmptyShopCart")
        createTr.innerHTML = ` <td> Empty Shopping List </td> `
        tableProducts.appendChild(createTr)
    }
}

//! remove product from addFromHome

let cancels = document.querySelectorAll('.remove-product span')
function deleteProduct() {
    handleEmptyShopCart()
    cancels.forEach(cancel => {

        cancel.addEventListener('click',(e) => {
            e.currentTarget.parentElement.parentElement.remove()
            let filteredArray = addFromHome.filter((ele) => {
                return ele.id != e.currentTarget.parentElement.parentElement.id
            })

            addFromHome = filteredArray
            localStorage.setItem('addFromHome', JSON.stringify(addFromHome))
            handleEmptyShopCart()
        })
    });
}


deleteProduct()



