
let favArrFromHome =  JSON.parse(localStorage.getItem('favArrFromHome')) || []
let addFromHome =  JSON.parse(localStorage.getItem('addFromHome')) || []
let finalPage = localStorage.getItem('finalPage') 
let productId = new URLSearchParams(window.location.search).get('id')


let addProFromSinglePage = document.querySelector(".addProFromSinglePage")

window.addEventListener('load', () => {

//! paint the product here
let products = null
async function loadData() {
        const singleProductData = await fetch(`https://fakestoreapi.com/products/${productId}`);
        products = await singleProductData.json();
        await showSingleProduct();
        loadElement();
        checkItemIfAdded()
}
loadData();

let count = document.querySelector('.count')
let addBtn = document.querySelector('.add')

//* add in the counter and make effect when you click
addBtn.addEventListener("click" , () => {
    count.textContent++
})
addBtn.addEventListener('mousedown', (e) => {
  e.currentTarget.classList.add('transation');
});
addBtn.addEventListener('mouseup', (e) => {
  e.currentTarget.classList.remove('transation');
});

//! prevent remove button to work if counter == 1 and make effect when you click
let removeCount = document.querySelector('.remove')
removeCount.addEventListener("click" , function(e){
    if (count.textContent == 1) {
        e.target.preventDefault()
        removeCount.classList.add("preventButton")
    }
    count.textContent--
})
removeCount.addEventListener('mousedown', (e) => {
  e.currentTarget.classList.add('transation');
});
removeCount.addEventListener('mouseup', (e) => {
  e.currentTarget.classList.remove('transation');
});



//! when you click on this button send this product to shopping page
let price = document.querySelector(".price")
let addToCart = document.querySelector('.addToCaret')
addToCart.addEventListener("click", function(e) {
    let element = {
        img: e.currentTarget.parentElement.parentElement.parentElement.children[0].children[0].children[0].src,
        id: e.currentTarget.parentElement.parentElement.parentElement.id,
        title: e.currentTarget.parentElement.parentElement.children[0].textContent,
        //! how many product * product's price
        price: e.currentTarget.parentElement.parentElement.children[2].textContent,
        quantity: count.textContent
    }
    // console.log(element.price);
    addFromHome.push(element)
    localStorage.setItem('addFromHome', JSON.stringify(addFromHome)) 
    countFavProducts()
})



let fourProducts = null
fetch('https://fakestoreapi.com/products?limit=5')
    .then(res=> res.json())
    .then(json => {
        fourProducts = json
        showDetail(fourProducts)
    });
    
    
function showSingleProduct() {
    document.querySelector('.image ').src = products.image 
    document.querySelector('.productName ').textContent = products.title 
    document.querySelector('.productDisc ').textContent = products.description 
    document.querySelector('.price').textContent = `$${products.price}` 
    document.querySelector('.content').id = products.id
}

//? catch data from api to display 5 items below main product

function showDetail(fourProducts) {
    
    //! display rate this product
    
    let rating = Math.round(products.rating.rate);  // Get the rounded rating
    let stars = document.querySelectorAll('.star-rating span');  // Select all star elements
    for (let i = 0; i < rating; i++) {
        stars[i].classList.add("checked");
    }
        
        //! show 5 products only
        
        let filteredArray = fourProducts.filter((element) => element.id != productId)   
        for(let i = 0; i < filteredArray.length; i++) {
        
        let productElement = document.createElement("div")
        productElement.classList.add("product")
        productElement.id = filteredArray[i].id
        productElement.innerHTML = `
            <span class="material-symbols-outlined fav">
                favorite
            </span>   
            <a class="item" href="singlePro.html?id=${filteredArray[i].id}"> 
                <div class="main-img">
                    <img  src="${filteredArray[i].image}" alt="">
                </div>
                <div class="description">${filteredArray[i].title.split(" ").slice(0,4).join(" ")}</div>
            </a>
            <div  class="ratingOtherProduct">
                <span class="material-symbols-outlined">
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
                <span class="material-symbols-outlined">
                    star
                </span>
            </div>
            <div class="priceANDbutton">
                <div class="priceOfPiece">$${filteredArray[i].price}</div>
                <button class="addButton">
                Add to cart
                </button>
            </div>
        `
        document.querySelector('.listProducts').appendChild(productElement)

        // console.log(filteredArray);
        
    }

    //! add products for shopping page 

    document.querySelectorAll(".addButton").forEach((product) => {
        product.addEventListener("click", function addProductToShop(e) {
            
            let element = {
                img:e.currentTarget.parentElement.parentElement.children[1].children[0].children[0].src,
                id:e.currentTarget.parentElement.parentElement.id,
                price:e.currentTarget.parentElement.parentElement.children[3].children[0].textContent,
                title: e.currentTarget.parentElement.parentElement.children[1].children[1].textContent
            }
            addFromHome.push(element)
            localStorage.setItem('addFromHome', JSON.stringify(addFromHome)) 
            countFavProducts()
        })
    })

    //! send elements to favorite page when I click on the favorite icon

    document.querySelectorAll(".fav").forEach((fav) => {
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
        })
    })

    //! If the product exists, put (clicked) as a className  
    let otherProducts = document.querySelectorAll(".product")
    favArrFromHome.forEach((eleFav) => {
        
        otherProducts.forEach((elePro) => {
            if (elePro.id == eleFav.id){
                elePro.children[0].classList.add("clicked")                    
            }
        })
    })
    
    addFromHome.forEach(element => {  
        document.querySelectorAll(".addButton").forEach(btn => {
            if (btn.parentElement.parentElement.id == element.id) {
                btn.textContent = "added"
            }
        })
    })

    //  put the rate on the products 

    fourProducts.forEach((element, index) => {
        let rating = Math.round(element.rating.rate);  
        let productElements = document.querySelectorAll(".product")[index];  
        let stars = productElements.querySelectorAll(".ratingOtherProduct span");
        if (stars.length > 0) {  
            for (let i = 0; i < rating; i++) {
                if (stars[i]) { stars[i].classList.add("checked")}
            }
        } 
    });
    
}






//! search bar (don't work)

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

//! show and hide menu list

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

//! when add new product to fav => display alert

//* send main product to favorite page when you click on the button

addProFromSinglePage.addEventListener("click", (e) => {
    addProFromSinglePage.classList.toggle("clicked")

    if (addProFromSinglePage.classList.contains("clicked")) {
        let element = {
            img:e.currentTarget.parentElement.parentElement.parentElement.parentElement
            .children[0].children[0].children[0].src,
            id: e.currentTarget.parentElement.parentElement.parentElement.parentElement.id,
            title: e.currentTarget.parentElement.parentElement.parentElement.children[0].textContent,
            price: e.currentTarget.parentElement.parentElement.parentElement.children[2].textContent
        }
        favArrFromHome.push(element)    
        countFavProducts()
    }else {
        favArrFromHome = favArrFromHome.filter((ele) => {
            return ele.id != e.currentTarget.parentElement.parentElement.parentElement.parentElement.id
        })
    }
    localStorage.setItem('favArrFromHome', JSON.stringify(favArrFromHome)) 
})

//! when increase or decrease => display number over cart
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

//? if favorite array include current product

function loadElement() {
    let content = document.querySelector('.content') 
    favArrFromHome.forEach(element => {
        if (element.id == content.id) {
            addProFromSinglePage.classList.add("clicked")
        }
    });
}

// check if this product into the cart or not
function checkItemIfAdded() {
    let content  = document.querySelector(".content")
    addFromHome.forEach(ele => {
        if(ele.id == content.id) {
            let btn = document.querySelector(".addToCaret")
            btn.textContent = "Added" 
        }    
    })
}



}) // window.load  

