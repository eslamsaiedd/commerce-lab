
window.addEventListener('load', () => {

let allProduct = document.querySelector(".all-product")
let products = null
let jsondata;
let listProduct = []
let carts = []
let favArrFromHome =  JSON.parse(localStorage.getItem('favArrFromHome')) || []

let addFromHome =  JSON.parse(localStorage.getItem('addFromHome')) || []

FirstRequestToGraph()
function FirstRequestToGraph() {
    return fetch('https://fakestoreapi.com/products ', {
        method: 'GET'
    })
.then(function(response) {
    return response.json();
})
.then(function(json){
    listProduct = json
    listProduct.filter((ele, index)=> { allProduct.innerHTML += 
            `
                <div class="product" id="${++index}">
                    <img class="fav" src="https://cf-vectorizer-live.s3.amazonaws.com/vectorized/2k3ibr2cemKXwpYV9ZlXxHVr2Ab/2k3ik53QXe73xFDcEtT64b46vX9.svg">
                    <a class="newProduct" href="singlePro.html?id=${ele.id}" >
                        <div class="main-image">
                            <img class="image" src="${ele.image}" alt="">
                        </div>
                        <div class="description">${ele.title.split(' ').slice(0,6).join(" ")}</div>
                    </a>
                    <div data-rating="${ele.rating.rate}" class="star-rating">
                        <span class="material-symbols-outlined">
                            star
                        </span>
                        <span class="material-symbols-outlined">
                            star
                        </span>
                        <span class="material-symbols-outlined ">
                            star
                        </span>
                        <span class="material-symbols-outlined ">
                            star
                        </span>
                        <span class="material-symbols-outlined ">
                            star
                        </span>
                    </div>
                    <div class="priceANDbutton">
                        <div class="priceOfPiece">$${ele.price}</div>
                        <button class="addButton">
                            Add to cart
                        </button>
                    </div>
                </div>    
            `
        })

                    //* show rate product

         function rating() {

            listProduct.forEach((element, index) => {
                
                let rating = Math.round(element.rating.rate);  // Round the rating for each product
                let productElement = document.querySelectorAll(".product")[index];  // Select the specific product container
                let stars = productElement.querySelectorAll(".star-rating span");  // Get stars for that specific product
            
                if (stars.length > 0) {  // Check if stars exist
                    for (let i = 0; i < rating; i++) {
                        if (stars[i]) {
                            stars[i].classList.add("checked");
                        }else {
                            stars[i].classList.add("changeColorMode");   
                        }
                    }
                } else {
                    console.warn(`No stars found for product at index ${index}`);
                }
            });
        }
        rating()
    })
}
//? search bar 


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

//? shopping cart

let listCart = document.querySelector('.listCart')

//! i get the id by click on button (add to cart)
let product_id
allProduct.addEventListener("click", (event) => {

    let positionClick = event.target
    if (positionClick.classList.contains("addButton")) {
        product_id = positionClick.parentElement.parentElement.id
        addCart(product_id)
    }  
})


//! add product in cart and position This Product In Cart

function addCart(product_id) {
    let positionThisProductInCart = carts.findIndex((value)=> value.product_id == product_id)
    
    if (carts.length <= 0) {
        carts = [{
            product_id: product_id, 
            quantity: 1
        }]
    }else if(positionThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        })
    }else {
        carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1  
    }
    localStorage.setItem('cart',JSON.stringify(carts))
}

setTimeout(() => {
    let btn = document.querySelectorAll('.addButton')
    btn.forEach((item)=> {
        item.addEventListener('click' ,  function() {addProductToCart(item)})
    })
}, 1000);

function addProductToCart(item) {
    let element
    if (carts.length > 0) {

        carts.forEach(cart => {
            let newCart = document.createElement("div")
            newCart.classList.add('products')
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id)
            let info = listProduct[positionProduct] 
            newCart.id = info.id
        })

        element = {
            img: item.parentElement.parentElement.children[1].children[0].children[0].src,
            id: item.parentElement.parentElement.id,
            title: item.parentElement.parentElement.children[1].children[1].textContent,
            price: item.parentElement.children[0].textContent,
            
        }
        addFromHome.push(element)
    }
    localStorage.setItem('addFromHome', JSON.stringify(addFromHome)) 
}

function init() {
    fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(data => {
        listProduct = data
            // get cart from memory
        if (localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'))
        }
    })
}
init()
  
//* change heart when click on it and send to favorite page. 

setTimeout(() => {

    let favs = document.querySelectorAll(".fav")
    favs.forEach((fav) => {

        fav.addEventListener("click", function addToFavorite(e) {
        
            if (e.currentTarget.src = "https://cf-vectorizer-live.s3.amazonaws.com/vectorized/2k3ibr2cemKXwpYV9ZlXxHVr2Ab/2k3ik53QXe73xFDcEtT64b46vX9.svg") {
                e.currentTarget.src = "https://i.ibb.co/S5nQtT8/free-heart-icon-431-thumb-removebg-preview.png"
                let elem = {
                    img:e.currentTarget.parentElement.children[1].children[0].children[0].src,
                    id: e.currentTarget.parentElement.id,
                    title: e.currentTarget.parentElement.children[1].children[1].textContent,
                    price: e.currentTarget.parentElement.children[3].children[0].textContent,
                    rating: e.currentTarget.parentElement.children[2].dataset.rating
                }
                
                favArrFromHome.push(elem)
            }
            localStorage.setItem('favArrFromHome', JSON.stringify(favArrFromHome)) 
        })

    })
    
}, 1000);

    
//! menu list 

function showList() {
    document.querySelector('.list-menu').style.display = "block"
}
function hideList() {
    document.querySelector('.list-menu').style.display = "none"
}

//! create active class name for navBar 
let navBar = document.querySelectorAll(".navBar a")
let windowPathName = window.location.pathname
navBar.forEach(link => {
    if (link.href.includes(windowPathName)) {
        link.classList.add('active')
    }
})

//! if write any thing wrang display 404 page

function handleRoutes() {
    const route = window.location.pathname   // Default to '#/' if hash is empty
    
    const validRoutes = ['/','/product-list/home.html','/product-list/mne-page.html','/product-list/women-page.html','/product-list/electronics-page.html','/product-list/fav-page.html'];  // Add your valid routes here

    if (!validRoutes.includes(route)) {
        // If the route is not valid, redirect to the 404 page
        window.location.href = '/product-list/404.html';
    }
}
// Listen for route changes (hash-based routing)
window.addEventListener('load', handleRoutes);
window.addEventListener('hashchange', handleRoutes);


//!move to top on click on the button

let buttonTop = document.querySelector(".top")
buttonTop.onclick = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
window.onscroll = function () {
    this.scrollY >= 500 ? buttonTop.style.display = 'flex' :  buttonTop.style.display = 'none'
}

//! when click on the custom input change the color mode
let customInput = document.querySelector("#custom-input")

let darkMode = false 
customInput.addEventListener("click", function switchDarkMode() {

    if (darkMode == false) {
        darkMode = true
        document.querySelector("body").style.backgroundColor = "#000000d6"
        document.querySelectorAll(".product").forEach((e) => {e.style.backgroundColor = "#00000085"})
        document.querySelector(".input").style.cssText = "background-color:transparent;border-color:#fff"
        document.querySelectorAll(".description , .priceOfPiece , a , .material-symbols-outlined , h1")
        .forEach((e) => { e.style.color = "#fff"})
        document.querySelectorAll(".checked").forEach((e) => { e.style.color = "#ffa500" })
        
    }else {
        darkMode = false
        document.querySelector("body").style.backgroundColor = "#eee"
        document.querySelectorAll(".product").forEach((e) => {e.style.backgroundColor = "#fff"})
        document.querySelector(".input").style.cssText = "background-color:transparent;border-color:gray"
        document.querySelectorAll("a , .material-symbols-outlined").forEach((e) => { e.style.color = "gray"})
        document.querySelectorAll(".checked").forEach((e) => { e.style.color = "#ffa500" })
        document.querySelectorAll(".description ,.priceOfPiece , h1").forEach((e) => { e.style.color = "#000"})
    }
})




})

