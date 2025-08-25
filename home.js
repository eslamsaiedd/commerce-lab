
window.addEventListener('load', () => {

let allProduct = document.querySelector(".all-product")
let products = null
let jsondata;
let listProduct = []
let carts = []
let favArrFromHome =  JSON.parse(localStorage.getItem('favArrFromHome')) || []
let addFromHome =  JSON.parse(localStorage.getItem('addFromHome')) || [] 
localStorage.getItem("updateButton")

FirstRequestToGraph()
function FirstRequestToGraph() {
    return fetch('https://fakestoreapi.com/products', {
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
                    <span class="material-symbols-outlined fav">
                        favorite
                    </span>   
                    <a class="newProduct" href="singlePro.html?id=${ele.id}" >
                        <div class="main-image">
                            <img class="image" loading="lazy" src="${ele.image}" alt="...">
                        </div>
                        <div class="description">${ele.title.split(' ').slice(0,3).join(" ")}</div>
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


        addedItem() // called function updating button (add to cart => added) 
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

// updating text's button (add to cart => added) 
function addedItem(){
    let addButton = document.querySelectorAll(".addButton")
    let get_id = JSON.parse(localStorage.getItem('addFromHome'))
    addButton.forEach(btn => {
            get_id.forEach(ele => {
            if (ele.id == btn.parentElement.parentElement.id) {
                btn.textContent ="Added"
            }
        })
    })
}
    
//? search bar 
// function search() {
//     let searchInput = document.getElementById('searchInput').value.toUpperCase()
//     let product = document.querySelectorAll(".product")
//     let productName = document.getElementsByTagName("h2")

//     for (let i = 0; i < productName.length; i++) {
//         if (productName[i].innerHTML.toUpperCase().indexOf(searchInput) >= 0) {
//             product[i].style.display = ""
//         }else {
//             product[i].style.display = "none"
//         }    
//     }    
// }


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
}, 1000)

//! add product for shopping page => buy this product

function addProductToCart(item) {
    let element = {
        img: item.parentElement.parentElement.children[1].children[0].children[0].src,
        id: item.parentElement.parentElement.id,
        title: item.parentElement.parentElement.children[1].children[1].textContent,
        price: item.parentElement.children[0].textContent,
        quantity: 1 
    }
    
    addFromHome.push(element)
    localStorage.setItem('addFromHome', JSON.stringify(addFromHome)) 
    countFavProducts()
    addedItem()
}


async function init() {
   await fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(data => {
        listProduct = data
        changeHeart()
        loadFavProduct()
    })
}
init()
  
//* change heart when click on it and send to favorite page. 

function changeHeart() {
    let favs = document.querySelectorAll(".fav")
    
    favs.forEach((fav) => {

        fav.addEventListener("click", function addToFavorite(e) {
            
            if (!e.currentTarget.classList.contains("clicked")) {
                fav.classList.add("clicked")
                
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
            countFavProducts()
            displayToast()
        })
    })
}

//! If the product exists in favorite array , add => (clicked) 
function loadFavProduct() {
    
    favArrFromHome.forEach((element) =>{
        document.querySelectorAll(".product").forEach((product) =>{
            if (element.id == product.id) {
                product.children[0].classList.add("clicked")
           }
        })
    })
}

    
//! menu list 
document.querySelector('.menu').addEventListener("click", () => {    
    document.querySelector('.list-menu').style.display = "flex"
})

document.querySelector('.close-list').addEventListener("click", () => {
    document.querySelector('.list-menu').style.display = "none"
})


// make the header fixed => (hide on scroll, show on scroll up)
let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", function() {
let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

if (currentScroll > lastScrollTop) {
    header.style.top = "-80px"; 
} else {
    header.style.top = "20px";
}
lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
});

// if write any thing wrang display 404 page

function handleRoutes() {
    const route = window.location.pathname   // Default to '#/' if hash is empty
    
    const validRoutes = ['/','/product-list/index.html','/product-list/mne-page.html','/product-list/women-page.html','/product-list/electronics-page.html','/product-list/fav-page.html'];  // Add your valid routes here

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

//! how many product in this array(favArrFromHome)

countFavProducts()
function countFavProducts() {
    if (!favArrFromHome.length == 0) {
        let countTheProductsFAv = document.querySelectorAll(".countTheProducts")
        countTheProductsFAv.forEach((ele) => {
            ele.textContent = `${favArrFromHome.length}`
        })
    }
    
    if (!addFromHome.length == 0) {
        let countTheProductsShop = document.querySelectorAll(".countTheProductsShop")
        countTheProductsShop.forEach((ele) => {
            // console.log(ele.textContent);         
            ele.textContent = `${addFromHome.length}`
        })
    }
}


//! if added a new product to the favorite page => show the toast

function displayToast() {
    let toast = document.querySelector(".toastr")
    toast.classList.add("active-toast")

       setTimeout(() => {
        toast.classList.remove("active-toast")
    },4000)
}

})