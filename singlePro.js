let favArrFromHome = JSON.parse(localStorage.getItem("favArrFromHome")) || [];
let addFromHome = JSON.parse(localStorage.getItem("addFromHome")) || [];
let finalPage = localStorage.getItem("finalPage");
let productId = new URLSearchParams(window.location.search).get("id");

let addProFromSinglePage = document.querySelector(".addProFromSinglePage");

window.addEventListener("load", () => {
  //! paint the product here
  let products = null;
  async function loadData() {
    const singleProductData = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    products = await singleProductData.json();
    await showSingleProduct();
    loadElement();
    mainProSent()
  }
  loadData();

  

  //! store the quantity

  let count = document.querySelector(".count");
  let addBtn = document.querySelector(".add");
  let minusBtn = document.querySelector(".remove");
  function quantity() {
    // if savedData not array make it array
    let savedData = JSON.parse(localStorage.getItem("cartData"));
    if (!Array.isArray(savedData)) {
      savedData = [];
    }
    // get the quantity for this product
    let match = savedData.find((p) => p.id === productId);
    // if there is quantity store it, if not start with 1
    let currentQuantity = match ? match.quantity : 1;

    count.textContent = currentQuantity;

    // increase
    addBtn.addEventListener("click", () => {
      currentQuantity++;
      count.textContent = currentQuantity;
      saveQuantity(productId, currentQuantity);
    });

    // decrease
    minusBtn.addEventListener("click", () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        count.textContent = currentQuantity;
        saveQuantity(productId, currentQuantity);
      }
    });

    // to upgrade info in localstorage
    function saveQuantity(id, quantity) {
      let updatedData = JSON.parse(localStorage.getItem("cartData"));

      // if this product exist remove it, after update push it
      updatedData = updatedData.filter((p) => p.id !== id);
      updatedData.push({ id, quantity });
      localStorage.setItem("cartData", JSON.stringify(updatedData));
    }
  }
  quantity();
  
  //! transition when you click on + and - 
  addBtn.addEventListener("mousedown", (e) => {
    e.currentTarget.classList.add("transation");
  });
  addBtn.addEventListener("mouseup", (e) => {
    e.currentTarget.classList.remove("transation");
  });
  minusBtn.addEventListener("mousedown", (e) => {
    e.currentTarget.classList.add("transation");
  });
  minusBtn.addEventListener("mouseup", (e) => {
    e.currentTarget.classList.remove("transation");
  });

  // if this product exist => change the button text
  function addedItem() {
    
    let addButton = document.querySelectorAll( ".sendToCart")
    let get_id = JSON.parse(localStorage.getItem("addFromHome"));
    addButton.forEach((btn) => {
      get_id.forEach((ele) => {
        if (ele.id == btn.parentElement.parentElement.id) {
          btn.innerHTML = 
          `
            <span class="material-symbols-outlined">
              check
            </span>
            Added
          `;
        }
      });
    });
  }

  //! sending the main product to cart

  let addToCart = document.querySelector(".addToCart");
  addToCart.addEventListener("click", function (e) {
    let element = {
      img: e.currentTarget.parentElement.parentElement.parentElement.children[0]
        .children[0].children[0].src,
      id: e.currentTarget.parentElement.parentElement.parentElement.id,
      title:
        e.currentTarget.parentElement.parentElement.children[0].textContent,
      price:
        e.currentTarget.parentElement.parentElement.children[2].textContent,
      quantity: count.textContent
    };
    
    if (addFromHome.length > 0) {
      const exists = addFromHome.some(item => item.id === productId);

      if (!exists) {
        addFromHome.push(element);
        localStorage.setItem("addFromHome", JSON.stringify(addFromHome));
        mainProSent();
        // countFavProducts();
      }
    }else {
      addFromHome.push(element);
      localStorage.setItem("addFromHome", JSON.stringify(addFromHome));
      mainProSent();
      // countFavProducts();
    }
  });

  //! when the main product sent to shopping cart
  function  mainProSent() {

    let addButton = document.querySelectorAll(".addToCart")
    let get_id = JSON.parse(localStorage.getItem("addFromHome"));
    addButton.forEach((btn) => {
      get_id.forEach((ele) => {
        if (ele.id == btn.parentElement.parentElement.parentElement.id) {
          btn.style.display = 'none'
          let removeIconAdded = document.querySelector('.removeIconAdded')
          removeIconAdded.style.display = 'flex'
          removeIconAdded.innerHTML = `
                                      <span class="material-symbols-outlined">
                                        delete  
                                      </span>
                                      `;
          document.querySelector('.ifProductAddedToCart').style.display = "flex"
          removeIconAdded.style.width = "150px"
        }
      });
    });
  }


//! delete the main product 

    let btn = document.querySelector('.removeIconAdded')
    document.querySelector('.removeIconAdded').addEventListener('click',() => {
      if (btn.classList.contains("removeIconAdded")) {

        let filterArr = addFromHome.filter((item) => {
          return item.id != productId
        })
        addFromHome = filterArr
        
        document.querySelector('.ifProductAddedToCart').style.display = "none"
        btn.style.display = 'none'
        document.querySelector('.addToCart').style.display = 'flex'
        document.querySelector('.addToCart').textContent = 'Add to cart'
        document.querySelector('.addToCart').style.width = '300px'
        localStorage.setItem('addFromHome', JSON.stringify(addFromHome))
        countFavProducts()
      }
    })    

  let fourProducts = null;
  fetch("https://fakestoreapi.com/products?limit=5")
    .then((res) => res.json())
    .then((json) => {
      fourProducts = json;
      showDetail(fourProducts);
    });

  function showSingleProduct() {
    document.querySelector(".image ").src = products.image;
    document.querySelector(".productName ").textContent = products.title;
    document.querySelector(".productDisc ").textContent = products.description;
    document.querySelector(".price").textContent = `$${products.price}`;
    document.querySelector(".content").id = products.id;
    // document.querySelector('.star-rating').dataset = products.rating.rate
  }

  //? catch data from api to display 5 items below main product

  function showDetail(fourProducts) {

    //! display rate the main product
    let rating = Math.round(products.rating.rate); // Get the rounded rating
    let stars = document.querySelectorAll(".star-rating span"); // Select all star elements
    for (let i = 0; i < rating; i++) {
      stars[i].classList.add("checked");
    }

    //! show 5 products only

    let filteredArray = fourProducts.filter(
      (element) => element.id != productId
    );
    for (let i = 0; i < filteredArray.length; i++) {
      let productElement = document.createElement("div");
      productElement.classList.add("product");
      productElement.id = filteredArray[i].id;
      productElement.innerHTML = `
            <span class="material-symbols-outlined fav">
                favorite
            </span>   
            <a class="item" href="singlePro.html?id=${filteredArray[i].id}"> 
                <div class="main-img">
                    <img  src="${filteredArray[i].image}" alt="">
                </div>
                <div class="description">${filteredArray[i].title
                  .split(" ")
                  .slice(0, 4)
                  .join(" ")}</div>
            </a>
            <div data-rating="${filteredArray[i].rating.rate}" class="ratingOtherProduct">
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
                <button class="sendToCart">
                Add to cart
                </button>
            </div>
        `;
      document.querySelector(".listProducts").appendChild(productElement);
    addedItem();

    }

    //! add products for shopping page

    document.querySelectorAll(".sendToCart").forEach((product) => {
      product.addEventListener("click", function addProductToShop(e) {
        let element = {
          img: e.currentTarget.parentElement.parentElement
          .children[1].children[0].children[0].src,
          id: e.currentTarget.parentElement.parentElement.id,
          price:e.currentTarget.parentElement.parentElement
          .children[3].children[0].textContent,
          title:e.currentTarget.parentElement.parentElement.children[1].children[1].textContent
        };
        addFromHome.push(element);        
        localStorage.setItem("addFromHome", JSON.stringify(addFromHome));
        countFavProducts();
        addedItem();
      });
    });

    //! send products to favorite page when I click on the favorite icon

    document.querySelectorAll(".fav").forEach((fav) => {
      fav.addEventListener("click", function addToFavorite(e) {
        if (!e.currentTarget.classList.contains("clicked")) {
          fav.classList.add("clicked");
          let elem = {
            img: e.currentTarget.parentElement.children[1].children[0]
              .children[0].src,
            id: e.currentTarget.parentElement.id,
            title:
              e.currentTarget.parentElement.children[1].children[1].textContent,
            price:
              e.currentTarget.parentElement.children[3].children[0].textContent,
            rating: e.currentTarget.parentElement.children[2].dataset.rating,
          };
          console.log(elem.rating);
          favArrFromHome.push(elem);
        }
        localStorage.setItem("favArrFromHome", JSON.stringify(favArrFromHome));
        countFavProducts();
        displayToast()
      });
    });

    //! If the product exists, put (clicked) as a className
    let otherProducts = document.querySelectorAll(".product");
    favArrFromHome.forEach((eleFav) => {
      otherProducts.forEach((elePro) => {
        if (elePro.id == eleFav.id) {
          elePro.children[0].classList.add("clicked");
        }
      });
    });

    //  put the rate on the products

    fourProducts.forEach((element, index) => {
      let rating = Math.round(element.rating.rate);
      let productElements = document.querySelectorAll(".product")[index];
      let stars = productElements.querySelectorAll(".ratingOtherProduct span");
      if (stars.length > 0) {
        for (let i = 0; i < rating; i++) {
          if (stars[i]) {
            stars[i].classList.add("checked");
          }
        }
      }
    });
  }

  //! search bar (don't work)

  function search() {
    let searchInput = document
      .getElementById("searchInput")
      .value.toUpperCase();
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

  //! show and hide menu list

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
    let currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      header.style.top = "-80px";
    } else {
      header.style.top = "20px";
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  });

  //* send main product to favorite page

  addProFromSinglePage.addEventListener("click", (e) => {
    addProFromSinglePage.classList.toggle("clicked");

    if (addProFromSinglePage.classList.contains("clicked")) {
      let element = {
        img: e.currentTarget.parentElement.parentElement.parentElement.parentElement.parentElement
        .children[0].children[0].children[0].src,
        id: e.currentTarget.parentElement.parentElement.parentElement
          .parentElement.parentElement.id,
        title:
          e.currentTarget.parentElement.parentElement.parentElement.parentElement.children[0].textContent,
        price:
          e.currentTarget.parentElement.parentElement.parentElement.parentElement.children[2]
            .textContent,
        rating: products.rating.rate,
      };
      console.log(element.rating);
      
      favArrFromHome.push(element);
      countFavProducts();
      displayToast()
    } else {
      favArrFromHome = favArrFromHome.filter((ele) => {
        return (
          ele.id !=
          e.currentTarget.parentElement.parentElement.parentElement.parentElement.id
        );
      });
    }
    localStorage.setItem("favArrFromHome", JSON.stringify(favArrFromHome));
  });

  //! when increase or decrease => display number over cart

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

      // how many products in cart
    if (!addFromHome.length == 0) {
      let countTheProductsShop = document.querySelectorAll(".countTheProductsShop");
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

  //? if favorite array include current product

  function loadElement() {
    let content = document.querySelector(".content");
    favArrFromHome.forEach((element) => {
      if (element.id == content.id) {
        addProFromSinglePage.classList.add("clicked");
      }
    });
  }

  function displayToast() {
    let toast = document.querySelector(".toastr");
    toast.classList.add("active-toast");

    setTimeout(() => {
      toast.classList.remove("active-toast");
    }, 4000);
  }

}); // window.load
