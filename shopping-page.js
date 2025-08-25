
//! pull product from home page and show these product in this page 

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
        <a data-th="title" class="product-title" href="singlePro.html?id=${addFromHome[i].id}">${addFromHome[i].title.split(' ').slice(0,3).join(" ")}</a>
        <td data-th="price" class="price">${addFromHome[i].price}</td>
        <td class="quantity">
            <div class="quantity-child">
                <span  class="material-symbols-outlined size-icon remove">
                    remove
                </span>
                <div class="quantity-num">${addFromHome[i].quantity}</div>
                <span  class="material-symbols-outlined size-icon add">
                    add
                </span>
            </div>
        </td>
        <td class="Subtotal"></td>
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

function deleteProduct() {
    handleEmptyShopCart()
    let cancels = document.querySelectorAll('.remove-product span')

    cancels.forEach(cancel => {
        cancel.addEventListener('click',(e) => {
            e.currentTarget.parentElement.parentElement.remove()

            let filteredArray = addFromHome.filter((ele) => {
                return ele.id != e.currentTarget.parentElement.parentElement.id
            })

            addFromHome = filteredArray
            localStorage.setItem('addFromHome', JSON.stringify(addFromHome))

            countAnyChangePrice()
            handleEmptyShopCart()
            countItems()
            checkStatusCart()
        })
    });
}



//! remove all value in input when you press on close icon
let closeIconInput = document.querySelector(".closeIconInput")
let discountCodeInput = document.querySelector(".discount-code-input")

discountCodeInput.addEventListener("input", function() {
    if (discountCodeInput.value.length > 0) {
        closeIconInput.style.display = "block";
    } else {
        closeIconInput.style.display = "none";
    }
});

closeIconInput.addEventListener("click", function() {
    discountCodeInput.value = "";
    closeIconInput.style.display = "none";
    discountCodeInput.focus();
    document.querySelector(".massage-error").style.display = "none"

});

//! create array contains valid coupons
let validCoupon = [
    "SAVE20OFF",
    "DISCOUNT15",
    "FREESHIP99",
    "BUY1GET1",
    "FLASHSALE25",
    "LUCKY10",
    "WELCOME5",
    "EXTRA30OFF",
    "VIPDEAL50",
    "BIGSALE75"
];


let totalPrice = document.querySelector(".totalPrice") 
let discount = document.querySelector(".discount-price")

let applyButton = document.querySelector(".apply-code")
applyButton.addEventListener("click", () => {
    let finalPrice = 0
    let isValid = false;
    for (let i = 0; i < validCoupon.length; i++) {
        if (discountCodeInput.value === validCoupon[i]) {
            isValid = true;
            break; 
        }
    }

    if (isValid) {  
        document.querySelector(".valid-coupon").style.display = "flex";
        document.querySelector(".massage-error").style.display = "none";
    } else {
        document.querySelector(".massage-error").style.display = "block";
        document.querySelector(".valid-coupon").style.display = "none";
    }
    //! total price minus discount and display price after discount 
    finalPrice = totalPrice.textContent.slice(1) - discount.textContent.slice(2)
    totalPrice.innerHTML = `$${finalPrice}`
});

//! quantity => increase or decrease 
let counter = document.getElementsByClassName("quantity-num")
function quantity() {
    let counter = document.getElementsByClassName("quantity-num")
    let add = document.getElementsByClassName("add")
    for (let i = 0; i < addFromHome.length; i++) {
        add[i].addEventListener("click", () => {
            updateQuantity(addFromHome[i].id,1,counter[i])
        })

        let remove = document.getElementsByClassName("remove")
        remove[i].addEventListener("click", (e) => {
            if (counter[i].textContent == 1 ) { e.target.preventDefault() } // if quantity decrease than 1, it will stop
            updateQuantity(addFromHome[i].id,-1,counter[i])
        })
    }

    function updateQuantity(id, change ,newQuantity) {
        let product = addFromHome.find(ele => ele.id === id)
        if(product) {
            product.quantity = Math.max(0, product.quantity + change);
            newQuantity.textContent = product.quantity
            changeSubtotal()
        }
    }
}
deleteProduct()

let Subtotal = document.querySelectorAll(".Subtotal")
quantity()
function changeSubtotal() {
    for (let i = 0; i < addFromHome.length; i++ ){
        Subtotal[i].textContent = Number(addFromHome[i].price.slice(1)) * Number(addFromHome[i].quantity) 
    }
    countAnyChangePrice()
}
changeSubtotal()

// count the total price and Adjustable

function countAnyChangePrice() {
    let finalPrice = 0
    for (let i = 0; i < addFromHome.length; i++) {
        finalPrice += parseFloat(Subtotal[i].textContent)
    }
    console.log(finalPrice);
    let sumItemsPrice = document.querySelector(".sumItemsPrice")
    sumItemsPrice.innerHTML = `$${finalPrice}`
    totalPrice.textContent = `$${finalPrice}` // if there isn't discount
}
countAnyChangePrice()



//! how many items into the cart 
function countItems(){
    document.querySelectorAll(".howManyItemIntoCart").forEach(function(ele){
        ele.textContent = addFromHome.length
        if (ele.textContent !== 0) {
            document.querySelectorAll(".changeLastLetter").forEach(function(element){
                element.textContent = "items"
            })
        }
    })
} 
countItems()

// drop down list 
document.querySelector(".dropDown").addEventListener("click", () => {
    document.querySelector('.menu').classList.toggle("hiddenDropDownList")
})


//* when you on click checkout make a function to check  if cart empty or not 
function checkStatusCart() {
    if (addFromHome.length == 0) { 
        let bodyContent = document.querySelector('.body-content')
        bodyContent.style.display = "none"
        let ifCartEmpty = document.createElement('div')
        ifCartEmpty.className = 'ifCartEmpty'
        document.querySelector('.container').appendChild(ifCartEmpty)
        ifCartEmpty.innerHTML = 
        `
        <div>Your cart is empty. Start shopping now</div>
        <a href="men-page.html">Men's products</a>
        <a href="women-page.html">Women's products</a>
        <a href="electronics-page.html">Electronic products</a>
        `

    }
    // console.log(addFromHome);
} 
checkStatusCart()
