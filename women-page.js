let favArrFromHome = JSON.parse(localStorage.getItem("favArrFromHome")) || [];
let addFromHome = JSON.parse(localStorage.getItem("addFromHome")) || [];
let listProduct = [];
let allProduct = document.querySelector(".all-product");

fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => {
    listProduct = data;
    listProduct.filter((ele, index) => {
      if (ele.category == "women's clothing" || ele.category == "jewelery") {
        allProduct.innerHTML += `
        <div class="product" id="${++index}">
            <span class="material-symbols-outlined fav">
                favorite
            </span>   
            <a class="newProduct" href="singlePro.html?id=${ele.id}">
                <div class="main-image">
                    <img class="image" src="${ele.image}" alt="">
                </div>
                <div class="description">${ele.title
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")}</div>
            </a>
            <div data-rating="${ele.rating.rate}" class="star-rating">
                <span class="material-symbols-outlined fixedFontSize">
                    star
                </span>
                <span class="material-symbols-outlined fixedFontSize">
                    star
                </span>
                <span class="material-symbols-outlined fixedFontSize ">
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
                <div class="priceOfPiece">$${ele.price}</div>
                <button class="addButton">
                    Add to cart
                </button>
            </div>
        </div>    
        `;
      }

      // display rate on products
    });

    function rating() {
      listProduct.forEach((element, index) => {
        let rating = Math.round(element.rating.rate); // Round the rating for each product
        let productElement = document.querySelectorAll(".product")[index]; // Select the specific product container
        let stars = productElement.querySelectorAll(".star-rating span"); // Get stars for that specific product

        if (stars.length > 0) {
          // Check if stars exist
          for (let i = 0; i < rating; i++) {
            if (stars[i]) {
              stars[i].classList.add("checked");
            } else {
              stars[i].classList.add("changeColorMode");
            }
          }
        }
      });
    }
    rating();
  });

// search bar

function search() {
  let searchInput = document.getElementById("searchInput").value.toUpperCase();
  let product = document.querySelectorAll(".product");
  let productName = document.getElementsByTagName("h2");

  for (let i = 0; i < productName.length; i++) {
    if (productName[i].innerHTML.toUpperCase().indexOf(searchInput) >= 0) {
      product[i].style.display = "";
    } else {
      product[i].style.display = "none";
    }
  }
}

async function init() {
  await fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      listProduct = data;
      changeHeart();
      loadFavProduct();
      addProductToCart();
      addedItem();
    });
}
init();

function changeHeart() {
  let favs = document.querySelectorAll(".fav");
  favs.forEach((fav) => {
    fav.addEventListener("pointerdown", function addToFavorite(e) {
      if (!e.currentTarget.classList.contains("clicked")) {
        fav.classList.add("clicked");
        let elem = {
          img: e.currentTarget.parentElement.children[1].children[0].children[0]
            .src,
          id: e.currentTarget.parentElement.id,
          title:
            e.currentTarget.parentElement.children[1].children[1].textContent,
          price:
            e.currentTarget.parentElement.children[3].children[0].textContent,
          rating: e.currentTarget.parentElement.children[2].dataset.rating,
        };
        favArrFromHome.push(elem);
        displayToast();
      }
      localStorage.setItem("favArrFromHome", JSON.stringify(favArrFromHome));
      countFavProducts();
    });
  });
}

function loadFavProduct() {
  favArrFromHome.forEach((element) => {
    document.querySelectorAll(".product").forEach((product) => {
      if (element.id == product.id) {
        product.children[0].classList.add("clicked");
      }
    });
  });
}

// Add product for shopping page
addProductToCart();
function addProductToCart() {
  let btn = document.querySelectorAll(".addButton");
  btn.forEach((e) => {
    e.addEventListener("pointerdown", () => {
      let element = {
        img: e.parentElement.parentElement.children[1].children[0].children[0]
          .src,
        id: e.parentElement.parentElement.id,
        title:
          e.parentElement.parentElement.children[1].children[1].textContent,
        price: e.parentElement.children[0].textContent,
        quantity: 1,
      };
      addFromHome.push(element);
      localStorage.setItem("addFromHome", JSON.stringify(addFromHome));
      countFavProducts();
      addedItem();
    });
  });
}

function addedItem() {
  let addButton = document.querySelectorAll(".addButton");
  let get_id = JSON.parse(localStorage.getItem("addFromHome"));
  addButton.forEach((btn) => {
    get_id.forEach((ele) => {
      if (ele.id == btn.parentElement.parentElement.id) {
        btn.innerHTML = `
                                <span class="material-symbols-outlined">
                                    check
                                </span>
                                Added
                                `;
      }
    });
  });
}

//! menu list
document.querySelector(".menu").addEventListener("pointerdown", () => {
  document.querySelector(".list-menu").style.display = "flex";
});
document.querySelector(".close-list").addEventListener("pointerdown", () => {
  document.querySelector(".list-menu").style.display = "none";
});

//! when add new product to fav => show like alert
countFavProducts();
function countFavProducts() {
  if (!favArrFromHome.length == 0) {
    let countTheProductsFAv = document.querySelectorAll(".countTheProducts");
    countTheProductsFAv.forEach((ele) => {
      ele.style.display = "block"
      ele.textContent = `${favArrFromHome.length}`;
    });
  } else {
    document.querySelectorAll(".countTheProducts").forEach((ele) => {
      ele.style.display = "none";
    });
  }

  if (!addFromHome.length == 0) {
    let countTheProductsShop = document.querySelectorAll(
      ".countTheProductsShop"
    );
    countTheProductsShop.forEach((ele) => {
      ele.style.display = "block"
      ele.textContent = `${addFromHome.length}`;
    });
  } else {
    document.querySelectorAll(".countTheProductsShop").forEach((ele) => {
      ele.style.display = "none";
    });
  }
}

//! make the header fixed => (hide on scroll, show on scroll up)
let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    header.style.top = "-80px";
  } else {
    header.style.top = "20px";
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

function displayToast() {
  let toast = document.querySelector(".toastr");
  toast.classList.add("active-toast");

  setTimeout(() => {
    toast.classList.remove("active-toast");
  }, 4000);
}

//dynamic current route and pervious route.
document.querySelector(".pervious-route").href = document.referrer;
const url = document.referrer;
const match = url.match(/\/([^\/]+)\.html$/);
if (match) {
  const name = match[1].split("-")[0];

  if (name.charAt(0).toUpperCase() + name.slice(1) == "Index") {
    document.querySelector(".pervious-route").textContent = "Home";
  } else if (name.charAt(0).toUpperCase() + name.slice(1) == "Shopping") {
    document.querySelector(".pervious-route").textContent = "Cart";
  } else if (name.charAt(0).toUpperCase() + name.slice(1) == "Fav") {
    document.querySelector(".pervious-route").textContent = "Favorite";
  } else {
    document.querySelector(".pervious-route").textContent =
      name.charAt(0).toUpperCase() + name.slice(1);
  }
}

//dynamic current route and name this page.
let currentNameRoute = window.location.pathname.slice(1, -10);
currentNameRoute =
  currentNameRoute.charAt(0).toUpperCase() + currentNameRoute.slice(1);
document.querySelector(".current-route").href = window.location;
document.querySelector(".current-route").textContent = currentNameRoute;
