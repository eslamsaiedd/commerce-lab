//! pull product from home page and show these product in this page

let addFromHome = JSON.parse(localStorage.getItem("addFromHome")) || [];
let favArrFromHome = JSON.parse(localStorage.getItem("favArrFromHome")) || [];
let tableProducts = document.querySelector(".table-products");
for (let i = 0; i < addFromHome.length; i++) {
  let newProduct = document.createElement("tr");
  newProduct.classList.add("products");
  newProduct.id = addFromHome[i].id;
  newProduct.innerHTML = `
        
        <div class="imageAndInfo">
            <div class="image">
                <img src="${addFromHome[i].img}" alt="">
            </div>
            <div class="infoAboutProduct">
                <a data-th="title" class="product-title" href="singlePro.html?id=${addFromHome[i].id}">
                ${addFromHome[i].title}
                </a>
                <div data-th="price" class="price">${addFromHome[i].price}</div>
            </div>
        </div>

        <div class="counterAndRemove">
            <div class="quantity-child">
                <span  class="material-symbols-outlined size-icon remove">
                    remove
                </span>
                <div class="quantity-num">${addFromHome[i].quantity}</div>
                <span  class="material-symbols-outlined size-icon add">
                    add
                </span>
            </div>
            <div data-th="product-title" class="remove-product">
                <span class="material-symbols-outlined cancel">
                    delete
                </span>
            </div>
        </div>

    `;
  tableProducts.appendChild(newProduct);

  // for mobile responsive
  let contentForRespons = document.createElement("div");
  contentForRespons.classList.add("contentForRespons");
  contentForRespons.id = addFromHome[i].id;
  contentForRespons.innerHTML = `
        <div class="left-content">
            <div class="create-back-img">
                <img class="imageForRespons" src="${
                  addFromHome[i].img
                }" alt=""> 
            </div>
        </div>    
        <div class="right-content">
            <a href="singlePro.html?id=${
              addFromHome[i].id
            }" class="title">${addFromHome[i].title
    .split(" ")
    .slice(0, 3)
    .join(" ")}</a>
            <p class="priceIntoResponsive">${addFromHome[i].price}</p>
            <div class="counterAndremove">
                <div class="counter">
                    <span class="material-symbols-outlined removeForMobil">
                        remove
                    </span>
                    <div class="quantityNumForMobil">
                        ${addFromHome[i].quantity}
                    </div>
                    <span class="material-symbols-outlined addForMobil">
                        add
                    </span>
                </div>
                
                <div class=" styleForRemove">
                    <span class="material-symbols-outlined">
                        delete
                    </span> 
                </div>
            </div>
        </div>
    `;
  document.querySelector(".mobileContent").appendChild(contentForRespons);
}

//! remove product from addFromHome
function deleteProduct() {
  let removeIcon = document.querySelectorAll(".remove-product span");
  removeIcon.forEach((cancel) => {
    cancel.addEventListener("click", (e) => {
      e.currentTarget.parentElement.parentElement.parentElement.remove();

      let filteredArray = addFromHome.filter((ele) => {
        return (
          ele.id != e.currentTarget.parentElement.parentElement.parentElement.id
        );
      });

      addFromHome = filteredArray;
      localStorage.setItem("addFromHome", JSON.stringify(addFromHome));

      countAnyChangePrice();
      countItems();
      checkStatusCart();
    });
  });
}

//! delete product and appear alert ask if are you sure for delete this product
function deleteProductResponsive() {
  let removeIcon = document.querySelectorAll(".styleForRemove span");
  let alertMessage = document.querySelector(".alertWhenRemoveProduct");
  let container = document.querySelector(".container");

  removeIcon.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      container.classList.add("blurBackGround");
      alertMessage.style.display = "block";

      // if user say yes
      document.querySelector(".yes").onclick = () => {
        let product =
          e.target.parentElement.parentElement.parentElement.parentElement;
        if (product) {
          const itemId = product.id; // catch id
          product.remove(); // remove the product

          // remove product from array
          addFromHome = addFromHome.filter(
            (p) => String(p.id) !== String(itemId)
          );
          localStorage.setItem("addFromHome", JSON.stringify(addFromHome));

          countAnyChangePrice();
          countItems();
          checkStatusCart();
        }
        // delete alert message
        alertMessage.style.display = "none";
        container.classList.remove("blurBackGround");
      };

      //   if user say no
      document.querySelector(".no").onclick = () => {
        alertMessage.style.display = "none";
        container.classList.remove("blurBackGround");
      };
    });
  });
}

//! remove all value in input when you press on close icon
let closeIconInput = document.querySelector(".closeIconInput");
let discountCodeInput = document.querySelector(".discount-code-input");

discountCodeInput.addEventListener("input", function () {
    console.log(discountCodeInput.value);
  if (discountCodeInput.value.length > 0) {
    closeIconInput.style.display = "block";
    if (discountCodeInput.value) {

    }
  } else {
    closeIconInput.style.display = "none";
  }
});

closeIconInput.addEventListener("click", function () {
  discountCodeInput.value = "";
  closeIconInput.style.display = "none";
  discountCodeInput.focus();
  document.querySelector(".massage-error").style.display = "none";
});

//! menu list
document.querySelector(".menu").addEventListener("click", () => {
  document.querySelector(".list-menu").style.display = "flex";
});

document.querySelector(".close-list").addEventListener("click", () => {
  document.querySelector(".list-menu").style.display = "none";
});

// make the header fixed => (hide on scroll, show on scroll up)
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
  "BIGSALE75",
];

let totalPrice = document.querySelector(".totalPrice");
let discount = document.querySelector(".discount-price");
let applyButton = document.querySelector(".apply-code");

let couponApplied = false; // to check if this code used before or not 
applyButton.addEventListener("click", (e) => {
  let finalPrice = 0;
  let isValid = false;
  for (let i = 0; i < validCoupon.length; i++) {
    if (discountCodeInput.value === validCoupon[i]) {
      isValid = true;
      break;
    }
  }

  if (isValid) {
    e.preventDefault()  
    document.querySelector(".valid-coupon").style.display = "flex";
    document.querySelector(".massage-error").style.display = "none";
    if (!couponApplied) {
        // //! total price minus discount and display price after discount
      let finalPrice = totalPrice.textContent.slice(1) - discount.textContent.slice(2);
      totalPrice.innerHTML = `$${finalPrice}`;
      couponApplied = true;
    }
  }else if (discountCodeInput.value == "") {
    discountCodeInput.blur()
  }else {
    document.querySelector(".massage-error").style.display = "block";
    document.querySelector(".valid-coupon").style.display = "none";
  }
});

// working in desktop and mobile
function quantityHandler(addClass, removeClass, counterClass) {
  let counter = document.getElementsByClassName(counterClass);
  let add = document.getElementsByClassName(addClass);
  let remove = document.getElementsByClassName(removeClass);

  // if we have any data bring it
  let savedData = JSON.parse(localStorage.getItem("cartData"));
  if (savedData) {
    addFromHome.forEach((p) => {
      let match = savedData.find((s) => s.id === p.id);
      if (match) p.quantity = match.quantity;
    });
  }

  for (let i = 0; i < addFromHome.length; i++) {
    counter[i].textContent = addFromHome[i].quantity || 1;

    // Increase
    add[i].addEventListener("click", () => {
      updateQuantity(addFromHome[i].id, 1, counter[i]);
    });

    // Decrease
    remove[i].addEventListener("click", (e) => {
        
        if (counter[i].textContent == 1 ) {
            e.preventDefault()
        }else {
            updateQuantity(addFromHome[i].id, -1, counter[i]);
        }
    });
  }

  function updateQuantity(id, change, counterElem) {
    let product = addFromHome.find((ele) => ele.id === id);
    if (product) {
      product.quantity = Math.max(0, (product.quantity || 1) + change);
      counterElem.textContent = product.quantity;

      // save any changes in localstorage
      localStorage.setItem("cartData", JSON.stringify(addFromHome));
      countAnyChangePrice();
    }
  }
}

deleteProduct();
deleteProductResponsive();
quantityHandler("addForMobil", "removeForMobil", "quantityNumForMobil");
quantityHandler("add", "remove", "quantity-num");

//* if happened any change in quantity or product overAll(price) and count the total price
function countAnyChangePrice() {
  let sumItemsPrice = document.querySelector(".sumItemsPrice");
  let finalPrice = 0;
  for (let i = 0; i < addFromHome.length; i++) {
    finalPrice +=
      Number(addFromHome[i].price.slice(1)) * Number(addFromHome[i].quantity);
  }

  sumItemsPrice.innerHTML = `$${Math.floor(finalPrice)}`;
  totalPrice.textContent = `$${Math.floor(finalPrice)}`; // if there isn't discount
}
countAnyChangePrice();

//! how many items into the cart
function countItems() {
  document.querySelectorAll(".howManyItemIntoCart").forEach(function (ele) {
    ele.textContent = addFromHome.length;
    if (ele.textContent !== 0) {
      document
        .querySelectorAll(".changeLastLetter")
        .forEach(function (element) {
          element.textContent = "items";
        });
    }
  });
}
countItems();

// how many product into favorite page
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
}

//* when you on click checkout make a function to check  if cart empty or not
function checkStatusCart() {
  if (addFromHome.length == 0) {
    let bodyContent = document.querySelector(".body-content");
    bodyContent.style.display = "none";
    let ifCartEmpty = document.createElement("div");
    ifCartEmpty.className = "ifCartEmpty";
    document.querySelector(".container").appendChild(ifCartEmpty);
    ifCartEmpty.innerHTML = `
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrvP7DAxhovNoTYpHIyefB9qO2NctVhrMVK_ksmM3TUZithpgJonPIjJxv4KX4BTyeiK4&usqp=CAU" alt="">
            <div>Your cart is empty. <a href="./index.html">start shopping now</a></div>
            
        `;
  }
}
checkStatusCart();
