let removeCount = document.querySelector('.remove')
let addCount = document.querySelector('.add')
let count = document.querySelector('.count')
let numberOfRequests = document.querySelector('.number-of-requests')
let addToCart = document.querySelector('.addToCaret')
let cart = document.querySelector('.cart')
let cartPage = document.querySelector('.cart-page')
let flexEmpty = document.querySelector('.flex-empty')
let close = document.getElementById('close-btn')
let multiply = document.querySelector('.multiply')
let btn = document.querySelector('.Checkout')
let detailsPro = document.querySelector('.flex-product') 

let favArrFromHome =  JSON.parse(localStorage.getItem('favArrFromHome')) || []
let addFromHome =  JSON.parse(localStorage.getItem('addFromHome')) || []


// paint the product here

let products = null
fetch('https://fakestoreapi.com/products')
.then(response => response.json())
.then(data => {
    products = data
    showDetail()
})


function handleShow(element) {
    element.classList.toggle('show')
}

function handleHide(element) {
    element.classList.remove('show')
}

function hideElement(ele) {
    ele.style.display = "none"
}

addCount.onclick = function () {
    count.textContent++
    multiply.textContent = count.textContent
    numberOfRequests.textContent = count.textContent
    document.querySelector('.pricee').textContent = `$${multiply.textContent * 125 }.00`
}

removeCount.onclick = function () {
    if (count.textContent == 1) {
        return
    }else {
        count.textContent--
        multiply.textContent = count.textContent
        numberOfRequests.textContent = count.textContent
        document.querySelector('.pricee').textContent = `$${multiply.textContent * 125 }.00`
    }

    if (numberOfRequests.textContent == 0) {
        hideElement(numberOfRequests)
        hideElement(btn)
        hideElement(detailsPro)
        flexEmpty.style.display = "flex"
    }
}

//! when you click on this button send this product to shopping page

addToCart.addEventListener("click", function(e) {

    let element = {
        img: e.currentTarget.parentElement.parentElement.parentElement.children[0].children[0].children[0].src,
        id: e.currentTarget.parentElement.parentElement.parentElement.id,
        title: e.currentTarget.parentElement.parentElement.children[0].textContent,
        price: e.currentTarget.parentElement.parentElement.children[2].textContent
    }
    // console.log(element.price);
    
    addFromHome.push(element)
    localStorage.setItem('addFromHome', JSON.stringify(addFromHome)) 
})

// close.onclick = function () {
//     handleHide(cartPage)
// }

// cart.onclick = function () {
//     handleShow(cartPage)
//     if (count.textContent == 0 ) {
//         flexEmpty.style.display = "flex"
//     }
// }

let deleteIcon = document.querySelector('.delete')
// deleteIcon.onclick = function () {
//     flexEmpty.style.display = "flex"
//     hideElement(btn)
//     this.parentNode.remove()
//     hideElement(numberOfRequests)
// }    




//? get data from api 

function showDetail() {
    
    let productId = new URLSearchParams(window.location.search).get('id')
    let thisProduct = products.filter(value => {
        return value.id == productId
    })[0]

    if(!thisProduct) {
        window.location.href = "/"
    }

    //! display rate this product

    let rating = Math.round(thisProduct.rating.rate);  // Get the rounded rating
    let stars = document.querySelectorAll('.star-rating span');  // Select all star elements

    // Loop through the stars and add 'checked' class based on the rating
    for (let i = 0; i < rating; i++) {
        stars[i].classList.add("checked");
    }

    
    document.querySelector('.image ').src = thisProduct.image 
    document.querySelector('.productName ').textContent = thisProduct.title 
    document.querySelector('.productDisc ').textContent = thisProduct.description 
    document.querySelector('.price').textContent = `$${thisProduct.price}` 
    document.querySelector('.content').id = thisProduct.id


    //! show 5 products only

    let listProducts = document.querySelector('.listProducts')
    
    for(let i = 0; i < 5; i++) {
    
        let arrayContent4 = products.filter((value,index) => value.id != productId && index <= 5)
        
        let productElement = document.createElement("div")
        productElement.classList.add("product")
        productElement.id = arrayContent4[i].id
        productElement.innerHTML = `
            <img class="fav" onclick="changeHeart(this)" src="https://cf-vectorizer-live.s3.amazonaws.com/vectorized/2k3ibr2cemKXwpYV9ZlXxHVr2Ab/2k3ik53QXe73xFDcEtT64b46vX9.svg">
            <a class="item" href="singlePro.html?id=${arrayContent4[i].id}"> 
                <div class="main-img">
                    <img src="${arrayContent4[i].image}" alt="">
                </div>
                <div class="description">${arrayContent4[i].title.split(" ").slice(0,6).join(" ")}</div>
            </a>
            <div class="star-rating">
                <span class="material-symbols-outlined ">
                    star
                </span>
                <span class="material-symbols-outlined ">
                    star
                </span>
                <span class="material-symbols-outlined">
                    star
                </span>
                <span class="material-symbols-outlined">
                    star
                </span>
                <span class="material-symbols-outlined">
                    star
                </span>
            </div>
            <div class="priceANDbutton">
                <div class="priceOfPiece">$${arrayContent4[i].price}</div>
                <button class="addButton" onclick="addProductToShop(this)">
                Add to cart
                </button>
            </div>
        `
        listProducts.appendChild(productElement)
    }

    //! we rate the products 
    
    products.forEach((element, index) => {
        let rating = Math.round(element.rating.rate);  
        let productElement = document.querySelectorAll(".product")[index];  
        let stars = productElement.querySelectorAll(".star-rating span");
    
        if (stars.length > 0) {  
            for (let i = 0; i < rating; i++) {
                if (stars[i]) {
                    stars[i].classList.add("checked");
                }
            }
        } 
    });
    
}

//! search bar

function search() {
    let searchInput = document.getElementById('searchInput').value.toUpperCase()
    let product = document.querySelectorAll(".product")
    let productName = document.getElementsByTagName("h2")
    for (let i = 0; i < productName.length; i++) {
        if (productName[i].innerHTML.toUpperCase().indexOf(searchInput) >= 0) {
            product[i].style.display = ""
        }else {
            product[i].style.display = "none"
        }    
    }    
}

//! add product for shopping page 

function addProductToShop(product) {

    let element = {
        img:product.parentElement.parentElement.children[1].children[0].children[0].src,
        id:product.parentElement.parentElement.id,
        price:product.parentElement.parentElement.children[3].children[0].textContent,
        title: product.parentElement.parentElement.children[1].children[1].textContent
    }
    addFromHome.push(element)
    localStorage.setItem('addFromHome', JSON.stringify(addFromHome)) 

}

//! send element to fav page  

function changeHeart(fav) {
    if (fav.src = "https://cf-vectorizer-live.s3.amazonaws.com/vectorized/2k3ibr2cemKXwpYV9ZlXxHVr2Ab/2k3ik53QXe73xFDcEtT64b46vX9.svg") {
        fav.src = "https://i.ibb.co/S5nQtT8/free-heart-icon-431-thumb-removebg-preview.png"
        let elem = {
            img:fav.parentElement.children[1].children[0].children[0].src,
            id: fav.parentElement.id,
            title: fav.parentElement.children[1].children[1].textContent,
            price: fav.parentElement.children[3].children[0].textContent
        }
        console.log(elem.price);
        
        favArrFromHome.push(elem)
    }
    localStorage.setItem('favArrFromHome', JSON.stringify(favArrFromHome)) 
}

// show and hide menu list

function showList() {
    document.querySelector('.list').style.display = "block"
}
function hideList() {
    document.querySelector('.list').style.display = "none"
}




