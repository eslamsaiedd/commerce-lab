

let favArrFromHome =  JSON.parse(localStorage.getItem('favArrFromHome')) || []

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
        <div class="description">${favArrFromHome[i].title}</div>
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


{/* <div class="priceOfPiece">${favArrFromHome[i].price}</div>
    <button class="addButton">
        Add to cart
    </button> */}

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
        } else {
            console.warn(`No stars found for product at index ${index}`);
        }
    });
}
rating()

//! check if favorite page is empty

function handleEmptyFavCart() {
    if(favArrFromHome.length < 1) {
        let emptyList =   document.querySelector('.fav-product')
        // emptyList.textContent = 'Empty Product List'
        emptyList.innerHTML =
        `
        <div class="empty-product-page">
        <img src="https://i.ibb.co/Yc2bqCh/shopping-cart-outline-vector-illustration-260nw-2029023626-removebg-preview.png">
        <p>Empty Product List</p>
        </div>
        `
        emptyList.classList.add('center')
    }
}

//!remove favorite product from favArrFromHome

let removeFavProduct = document.querySelectorAll(".remove-fav-product")
function removeProductFromFav() {
    handleEmptyFavCart()
    removeFavProduct.forEach((fav) => {
        
        fav.addEventListener("click", (e) => {
            e.currentTarget.parentElement.remove()
            let filteredProduct = favArrFromHome.filter((ele) => {
                return ele.id != e.currentTarget.parentElement.id 
            })
            favArrFromHome = filteredProduct
            localStorage.setItem('favArrFromHome', JSON.stringify(favArrFromHome))
            handleEmptyFavCart()
        })
    })
}
removeProductFromFav()

