
let favArrFromHome =  JSON.parse(localStorage.getItem('favArrFromHome')) || []
let addFromHome =  JSON.parse(localStorage.getItem('addFromHome')) || []

for (let i = 0; i < favArrFromHome.length; i++){
    let favProduct = document.querySelector('.fav-product')
    let product = document.createElement('div')
    product.classList.add("item")
    product.id = favArrFromHome[i].id
    product.innerHTML = 
    `
    <span class="material-symbols-outlined remove-fav-product">
        close
    </span>
    <a class="newProduct" href="singlePro.html?id=${favArrFromHome[i].id}">
        <div class="main-image">
            <img class="image" src="${favArrFromHome[i].img}" alt="">
        </div>
        <div class="description">${favArrFromHome[i].title.split(' ').slice(0,4).join(" ")}</div>
    </a>
    <div class="star-rating">
        <span class="material-symbols-outlined fixedFontSize">
            star
        </span>
        <span class="material-symbols-outlined fixedFontSize">
            star
        </span>
        <span class="material-symbols-outlined fixedFontSize">
            star
        </span>
        <span class="material-symbols-outlined fixedFontSize">
            star
        </span>
        <span class="material-symbols-outlined fixedFontSize">
            star
        </span>
    </div>
    <div class="priceANDbutton">
        <div class="priceOfPiece">${favArrFromHome[i].price}</div>
        <button class="addButton">
            Add to cart
        </button>
    </div>
        
    `
    favProduct.appendChild(product)
}

//! display rating on products 
function rating() {
    
    favArrFromHome.forEach((element, index) => {
        
        let rating = Math.round(element.rating);  // Round the rating for each product
        let productElement = document.querySelectorAll(".item")[index];  // Select the specific product container
        let stars = productElement.querySelectorAll(".star-rating span");  // Get stars for that specific product
        
        if (stars.length > 0) {  // Check if stars exist
            for (let i = 0; i < rating; i++) {
                if (stars[i]) {
                    stars[i].classList.add("checked");
                }else {
                    stars[i].classList.add("changeColorMode");   
                }
            }
        }else {
            console.warn(`No stars found for product at index ${index}`);
        }
    });
}
rating()

//!remove favorite product from favArrFromHome

let removeFavProduct = document.querySelectorAll(".remove-fav-product")
function removeProductFromFav() {
    removeFavProduct.forEach((fav) => {
        
        fav.addEventListener("click", (e) => {
            e.currentTarget.parentElement.remove()
            let filteredProduct = favArrFromHome.filter((ele) => {
                return ele.id != e.currentTarget.parentElement.id 
            })
            favArrFromHome = filteredProduct
            localStorage.setItem('favArrFromHome', JSON.stringify(favArrFromHome))
        })
    })
    checkStatusCart()
}
removeProductFromFav()

addProductToCart()
function addProductToCart() {
    let btn = document.querySelectorAll('.addButton')
    btn.forEach((e) => {
        e.addEventListener("click", () => {

            let element = {
                img: e.parentElement.parentElement.children[1].children[0].children[0].src,
                id: e.parentElement.parentElement.id,
                title: e.parentElement.parentElement.children[1].children[1].textContent,
                price: e.parentElement.children[0].textContent,
                quantity: 1
            }            
            addFromHome.push(element)
            localStorage.setItem('addFromHome', JSON.stringify(addFromHome)) 
            addedItem()
            countFavProducts()
        })
    })
}

// updating text's button (add to cart => added) 
function addedItem() {
    let addButton = document.querySelectorAll(".addButton")
    let get_id = JSON.parse(localStorage.getItem('addFromHome'))
    addButton.forEach(btn => {
            get_id.forEach(ele => {
            if (ele.id == btn.parentElement.parentElement.id) {
                btn.innerHTML = `
                                <span class="material-symbols-outlined">
                                    check
                                </span>
                                Added
                                `            
            }
        })
    })
}
addedItem()

//! make the header fixed => (hide on scroll, show on scroll up)
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

//! menu list 
document.querySelector('.menu').addEventListener("click", () => {    
    document.querySelector('.list-menu').style.display = "flex"
})

document.querySelector('.close-list').addEventListener("click", () => {
    document.querySelector('.list-menu').style.display = "none"
})
countFavProducts()
function countFavProducts() {

    if (!addFromHome.length == 0) {
        let countTheProductsShop = document.querySelectorAll(".countTheProductsShop")
        countTheProductsShop.forEach((ele) => {
            ele.textContent = `${addFromHome.length}`
        })
    }else {
        document.querySelectorAll('.countTheProductsShop').forEach((ele)=> {
            ele.style.display="none"
        })
    }
}

//dynamic current route and pervious route.
document.querySelector('.pervious-route').href = document.referrer
const url =  document.referrer;
const match = url.match(/\/([^\/]+)\.html$/);
    if (match) {
        const name = match[1].split("-")[0];
        name = name.charAt(0).toUpperCase() + name.slice(1)

        if (name == 'Index') {
            document.querySelector('.pervious-route').textContent = "Home"
        }else if (name == "Shopping") {
            document.querySelector('.pervious-route').textContent = "Cart"
        }
        else {
            document.querySelector('.pervious-route').textContent = name
        }
    }
//dynamic current route and name this page.
let currentNameRoute = window.location.pathname.slice(1,-10)
currentNameRoute = currentNameRoute.charAt(0).toUpperCase() + currentNameRoute.slice(1) 
document.querySelector(".current-route").href = window.location 
document.querySelector(".current-route").textContent =currentNameRoute  

//* when you on click checkout make a function to check  if cart empty or not 
function checkStatusCart() {
    if (favArrFromHome.length == 0) { 
        let ifCartEmpty = document.createElement('div')
        ifCartEmpty.className = 'ifCartEmpty'
        document.querySelector('.fav-product').appendChild(ifCartEmpty)
        ifCartEmpty.innerHTML = 
        `
        <div>Your cart is empty. Start shopping now</div>
        <a href="men-page.html">Men's products</a>
        <a href="women-page.html">Women's products</a>
        <a href="electronics-page.html">Electronic products</a>
        `
        document.querySelector('.fav-product').style.gridTemplateColumns = "repeat(1, 1fr)"
    }
} 
checkStatusCart()