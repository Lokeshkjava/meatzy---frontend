const firebaseConfig = {
    apiKey: "AIzaSyCGw4N7bk3-c45lK9S9XnfsIV_T0z-6Das",
    authDomain: "meatzy-1d3c6.firebaseapp.com",
    projectId: "meatzy-1d3c6",
    storageBucket: "meatzy-1d3c6.firebasestorage.app",
    messagingSenderId: "880492865945",
    appId: "1:880492865945:web:8190153cdaf2c1848ccb08"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* =====================================================
   MEATZY FRESH MEAT
   FRONTEND VERSION
===================================================== */


/* =====================================================
   WHATSAPP NUMBER
===================================================== */

const MEATZY_WHATSAPP = "919059781224";


/* =====================================================
   PRODUCTS
===================================================== */

const products = [

    /* ================= CHICKEN ================= */

    {
        id: 1,
        name: "Chicken Curry Cut",
        category: "Chicken",
        price: 320,
        unit: "kg",
        image: "Chicken Curry Cut.webp"
    },

    {
        id: 2,
        name: "Chicken Boneless",
        category: "Chicken",
        price: 420,
        unit: "kg",
        image: "Chicken boneless.webp"
    },

    {
        id: 3,
        name: "Chicken Breast",
        category: "Chicken",
        price: 390,
        unit: "kg",
        image: "Chicken breast.webp"
    },

    {
        id: 4,
        name: "Chicken Wings",
        category: "Chicken",
        price: 350,
        unit: "kg",
        image: "Chicken wings.webp"
    },


    /* ================= BURN CHICKEN ================= */

    {
        id: 5,
        name: "Burn Chicken",
        category: "Burn Chicken",
        price: 450,
        unit: "kg",
        image: "Burn Chicken.jpg"
    },


    /* ================= DESI CHICKEN ================= */

    {
        id: 6,
        name: "Desi Chicken",
        category: "Desi Chicken",
        price: 680,
        unit: "kg",
        image: "Desi chicken cut.jpg"
    },


    /* ================= LIVER ================= */

    {
        id: 7,
        name: "Chicken Liver",
        category: "Liver",
        price: 280,
        unit: "kg",
        image: "Chicken liver.webp"
    },


    /* ================= MUTTON ================= */

    {
        id: 8,
        name: "Mutton Curry Cut",
        category: "Mutton",
        price: 900,
        unit: "kg",
        sundayOnly: true,
        image: "Mutton curry cut.webp"
    },

    {
        id: 9,
        name: "Mutton Boneless",
        category: "Mutton",
        price: 1400,
        unit: "kg",
        sundayOnly: true,
        image: "Mutton Boneless.webp"
    },


    /* ================= BOTI ================= */

    {
        id: 10,
        name: "Boti",
        category: "Boti",
        price: 850,
        unit: "kg",
        sundayOnly: true,
        image: "Boti.jpg"
    },


    /* ================= GOAT HEAD + PAYA ================= */

    {
        id: 11,
        name: "Goat Head with Paya",
        category: "Goat Head + Paya",
        price: 700,
        unit: "piece",
        sundayOnly: true,
        image: "Head and Legs.jpg"
    },


    /* ================= SNEHA OMEGA EGGS ================= */

    {
        id: 12,
        name: "Sneha Omega Eggs",
        category: "Sneha Omega Eggs",
        price: 90,
        eggPackPrices: {
            12: 90,
            30: 210
        },
        unit: "pack",
        image: "Sneha Eggs.avif"
    },


    /* ================= NORMAL EGGS ================= */

    {
        id: 13,
        name: "Normal Eggs",
        category: "Normal Eggs",
        price: 180,
        eggPackPrices: {
            6: 36,
            12: 72,
            18: 108,
            30: 180
        },
        unit: "pack",
        image: "Eggs Tray.jpeg"
    }

];


/* =====================================================
   VARIABLES
===================================================== */

let selectedCategory = "All";

let cart = JSON.parse(
    localStorage.getItem("meatzyCart") || "{}"
);


/* =====================================================
   DOM ELEMENTS
===================================================== */

const productsEl =
    document.getElementById("products");

const filtersEl =
    document.getElementById("filters");

const cartDrawer =
    document.getElementById("cartDrawer");

const overlay =
    document.getElementById("overlay");

const checkoutModal =
    document.getElementById("checkoutModal");

const cartItems =
    document.getElementById("cartItems");

const cartSubtotal =
    document.getElementById("cartSubtotal");

const cartDelivery =
    document.getElementById("cartDelivery");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const orderNowBtn =
    document.getElementById("orderNowBtn");

const menuBtn =
    document.getElementById("menuBtn");

const nav =
    document.getElementById("nav");

const locationBtn =
    document.getElementById("locationBtn");

const locationStatus =
    document.getElementById("locationStatus");

const checkoutLocationBtn =
    document.getElementById("checkoutLocationBtn");

const checkoutLocationStatus =
    document.getElementById("checkoutLocationStatus");


/* =====================================================
   SUNDAY CHECK
===================================================== */

function isSunday() {

    return new Date().getDay() === 0;

}


/* =====================================================
   CATEGORIES
===================================================== */

function renderFilters() {

    const categories = [

        "All",

        "Chicken",

        "Burn Chicken",

        "Liver",

        "Mutton",

        "Boti",

        "Goat Head + Paya",

        "Sneha Omega Eggs",

        "Normal Eggs"

    ];


    filtersEl.innerHTML =
        categories.map(category => {

            return `

                <button
                    class="${
                        category === selectedCategory
                            ? "active"
                            : ""
                    }"
                    onclick="setCategory('${category}')">

                    ${category}

                </button>

            `;

        }).join("");

}


/* =====================================================
   CATEGORY FILTER
===================================================== */

function setCategory(category) {

    selectedCategory = category;

    render();

    const shop =
        document.getElementById("shop");

    if (shop) {

        shop.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================================
   QUANTITY OPTIONS
===================================================== */

function getQuantityOptions(product) {

    /* Eggs */

    if (
        product.category === "Sneha Omega Eggs"
    ) {

        return [12, 30];

    }


    if (
        product.category === "Normal Eggs"
    ) {

        return [6, 12, 18, 30];

    }


    /* Goat head */

    if (
        product.category === "Goat Head + Paya"
    ) {

        return [1];

    }


    /* Meat */

    return [
        250,
        500,
        1000
    ];

}


/* =====================================================
   QUANTITY TEXT
===================================================== */

function formatQuantity(
    product,
    quantity
) {

    if (
        product.category === "Sneha Omega Eggs" ||
        product.category === "Normal Eggs"
    ) {

        return `${quantity} eggs`;

    }


    if (
        product.category === "Goat Head + Paya"
    ) {

        return "1 set";

    }


    if (quantity === 1000) {

        return "1 kg";

    }


    return `${quantity} grams`;

}


/* =====================================================
   PRICE
===================================================== */

function calculatePrice(
    product,
    quantity
) {

    /* Eggs */

    if (
        product.eggPackPrices &&
        product.eggPackPrices[quantity]
    ) {

        return product.eggPackPrices[quantity];

    }


    /* Goat head */

    if (
        product.category === "Goat Head + Paya"
    ) {

        return product.price;

    }


    /* Meat */

    return Math.round(
        (product.price / 1000) *
        quantity
    );

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function render() {

    renderFilters();


    let filteredProducts =
        products.filter(product => {

            if (
                selectedCategory !== "All" &&
                product.category !== selectedCategory
            ) {

                return false;

            }


            return true;

        });


    productsEl.innerHTML =
        filteredProducts.map(product => {

            const index =
                products.findIndex(
                    p => p.id === product.id
                );


            const quantities =
                getQuantityOptions(product);


            const firstQuantity =
                quantities[0];


            const firstPrice =
                calculatePrice(
                    product,
                    firstQuantity
                );


            const sundayMessage =
                product.sundayOnly &&
                !isSunday();


            return `

                <article class="product">

                    <div class="product-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            loading="eager">

                    </div>


                    <div class="product-body">

                        <h3>
                            ${product.name}
                        </h3>


                        <div class="meta">
                            ${product.category}
                        </div>


                        ${
                            product.sundayOnly
                            ? `
                                <div class="sunday-badge">
                                    SUNDAY ONLY
                                </div>
                              `
                            : ""
                        }


                        ${
                            sundayMessage
                            ? `
                                <div class="unavailable-message">
                                    Available only on Sunday
                                </div>
                              `
                            : ""
                        }


                        <label class="quantity-label">
                            Select quantity
                        </label>


                        <select
                            class="weight-select"
                            id="quantity-${index}"
                            onchange="updateProductPrice(${index})"
                            ${
                                sundayMessage
                                ? "disabled"
                                : ""
                            }>

                            ${quantities.map(
                                quantity => {

                                    return `

                                        <option
                                            value="${quantity}">

                                            ${
                                                formatQuantity(
                                                    product,
                                                    quantity
                                                )
                                            }

                                        </option>

                                    `;

                                }
                            ).join("")}

                        </select>


                        <div
                            class="price"
                            id="price-${index}">

                            ₹${firstPrice}

                        </div>


                        <button
                            class="add-btn"
                            onclick="addToCart(${index})"
                            ${
                                sundayMessage
                                ? "disabled"
                                : ""
                            }>

                            ${
                                sundayMessage
                                ? "AVAILABLE SUNDAY"
                                : "ADD TO CART"
                            }

                        </button>

                    </div>

                </article>

            `;

        }).join("");

}


/* =====================================================
   UPDATE PRICE
===================================================== */

function updateProductPrice(index) {

    const product =
        products[index];


    const quantitySelect =
        document.getElementById(
            `quantity-${index}`
        );


    const priceElement =
        document.getElementById(
            `price-${index}`
        );


    if (
        !quantitySelect ||
        !priceElement
    ) {

        return;

    }


    const quantity =
        Number(quantitySelect.value);


    const price =
        calculatePrice(
            product,
            quantity
        );


    priceElement.textContent =
        `₹${price}`;

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(index) {

    const product =
        products[index];


    /* Sunday-only products */

    if (
        product.sundayOnly &&
        !isSunday()
    ) {

        alert(
            `${product.name} is available only on Sunday.`
        );

        return;

    }


    const quantitySelect =
        document.getElementById(
            `quantity-${index}`
        );


    if (!quantitySelect) {

        return;

    }


    const quantity =
        Number(quantitySelect.value);


    const cartKey =
        `${product.id}-${quantity}`;


    if (!cart[cartKey]) {

        cart[cartKey] = {

            productId:
                product.id,

            quantity:
                quantity,

            count:
                0

        };

    }


    cart[cartKey].count++;


    saveCart();

    openCart();

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(
        "meatzyCart",
        JSON.stringify(cart)
    );


    renderCart();

}


/* =====================================================
   CHANGE CART
===================================================== */

function changeCartQuantity(
    cartKey,
    change
) {

    if (!cart[cartKey]) {

        return;

    }


    cart[cartKey].count += change;


    if (
        cart[cartKey].count <= 0
    ) {

        delete cart[cartKey];

    }


    saveCart();

}


/* =====================================================
   DELIVERY CHARGE
===================================================== */

function calculateDeliveryCharge(subtotal) {

    if (subtotal <= 0) {

        return 0;

    }

    /*
        Below ₹500  → ₹20 delivery
        ₹500 or more → FREE delivery
    */

    if (subtotal < 500) {

        return 20;

    }

    return 0;

}

/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    let subtotal = 0;

    let itemCount = 0;


    const cartKeys =
        Object.keys(cart);


    if (
        cartKeys.length === 0
    ) {

        cartItems.innerHTML = `

            <div class="empty">

                Your cart is empty.

                <br><br>

                Add fresh products to continue.

            </div>

        `;


        cartSubtotal.textContent = "0";

        cartDelivery.textContent = "0";

        cartTotal.textContent = "0";

        cartCount.textContent = "0";

        return;

    }


    cartItems.innerHTML =
        cartKeys.map(cartKey => {

            const item =
                cart[cartKey];


            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (!product) {

                return "";

            }


            const price =
                calculatePrice(
                    product,
                    item.quantity
                );


            const itemTotal =
                price *
                item.count;


            subtotal += itemTotal;

            itemCount +=
                item.count;


            return `

                <div class="cart-row">

                    <div>

                        <strong>
                            ${product.name}
                        </strong>

                        <br>

                        <small>

                            ${
                                formatQuantity(
                                    product,
                                    item.quantity
                                )
                            }

                            × ${item.count}

                            —
                            ₹${itemTotal}

                        </small>

                    </div>


                    <div class="qty">

                        <button
                            onclick="changeCartQuantity(
                                '${cartKey}',
                                -1
                            )">

                            −

                        </button>


                        <b>
                            ${item.count}
                        </b>


                        <button
                            onclick="changeCartQuantity(
                                '${cartKey}',
                                1
                            )">

                            +

                        </button>

                    </div>

                </div>

            `;

        }).join("");


    const delivery =
        calculateDeliveryCharge(
            subtotal
        );


    const total =
        subtotal +
        delivery;


    cartSubtotal.textContent =
        subtotal;


    cartDelivery.textContent =
        delivery;


    cartTotal.textContent =
        total;


    cartCount.textContent =
        itemCount;

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    cartDrawer.classList.add("open");

    overlay.classList.add("show");

    renderCart();

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    cartDrawer.classList.remove(
        "open"
    );

    overlay.classList.remove(
        "show"
    );

}


/* =====================================================
   CART BUTTON
===================================================== */

document
    .getElementById("cartBtn")
    .addEventListener(
        "click",
        openCart
    );


document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


overlay.addEventListener(
    "click",
    closeCart
);


/* =====================================================
   ORDER NOW
===================================================== */

orderNowBtn.addEventListener(
    "click",
    () => {

        document
            .getElementById("shop")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =====================================================
   MOBILE MENU
===================================================== */

menuBtn.addEventListener(
    "click",
    () => {

        nav.classList.toggle(
            "show"
        );

    }
);


/* =====================================================
   CLOSE MOBILE MENU
===================================================== */

nav.querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                nav.classList.remove(
                    "show"
                );

            }
        );

    });


/* =====================================================
   CATEGORY CARDS
===================================================== */

document
    .querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                setCategory(
                    card.dataset.filter
                );

            }
        );

    });


/* =====================================================
   CHECKOUT
===================================================== */

document
    .getElementById("checkoutBtn")
    .addEventListener(
        "click",
        () => {

            if (
                Object.keys(cart).length === 0
            ) {

                alert(
                    "Please add at least one product."
                );

                return;

            }


            updateCheckoutSummary();


            checkoutModal.classList.add(
                "show"
            );

        }
    );


/* =====================================================
   CHECKOUT SUMMARY
===================================================== */

function updateCheckoutSummary() {

    let subtotal = 0;


    Object.values(cart)
        .forEach(item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (!product) {

                return;

            }


            const price =
                calculatePrice(
                    product,
                    item.quantity
                );


            subtotal +=
                price *
                item.count;

        });


    const delivery =
        calculateDeliveryCharge(
            subtotal
        );


    const total =
        subtotal +
        delivery;


    document
        .getElementById(
            "checkoutSummary"
        )
        .innerHTML = `

            <div class="summary-row">
                <span>Subtotal</span>
                <strong>₹${subtotal}</strong>
            </div>

            <div class="summary-row">
                <span>Delivery</span>
                <strong>₹${delivery}</strong>
            </div>

            <div class="summary-row total">
                <span>Total</span>
                <strong>₹${total}</strong>
            </div>

        `;

}


/* =====================================================
   CLOSE CHECKOUT
===================================================== */

document
    .getElementById("closeCheckout")
    .addEventListener(
        "click",
        () => {

            checkoutModal.classList.remove(
                "show"
            );

        }
    );


/* =====================================================
   LOCATION
===================================================== */

let customerLocation = null;


function getCustomerLocation(
    statusElement
) {

    if (
        !navigator.geolocation
    ) {

        statusElement.textContent =
            "Location is not supported by this browser.";

        return;

    }


    statusElement.textContent =
        "Getting your location...";


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            customerLocation = {
                latitude,
                longitude
            };


            statusElement.innerHTML =

                `Location selected.<br>` +

                `<a
                    href="https://www.google.com/maps?q=${latitude},${longitude}"
                    target="_blank"
                    rel="noopener">

                    View location on map

                </a>`;

        },

        error => {

            console.error(
                "Location error:",
                error
            );


            statusElement.textContent =
                "Unable to access location. Please enter your address.";

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }

    );

}


locationBtn.addEventListener(
    "click",
    () => {

        getCustomerLocation(
            locationStatus
        );

    }
);


checkoutLocationBtn.addEventListener(
    "click",
    () => {

        getCustomerLocation(
            checkoutLocationStatus
        );

    }
);


/* =====================================================
   CHECKOUT FORM + FIREBASE ORDER SAVE
===================================================== */

document
    .getElementById("checkoutForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const orderMessage =
            document.getElementById("orderMessage");

        const name =
            document
                .getElementById("customerName")
                .value
                .trim();

        const phone =
            document
                .getElementById("customerPhone")
                .value
                .trim();

        const address =
            document
                .getElementById("customerAddress")
                .value
                .trim();

        const deliverySlot =
            document
                .getElementById("deliverySlot")
                .value;


        /* ================= VALIDATION ================= */

        if (!/^[6-9]\d{9}$/.test(phone)) {

            alert(
                "Enter a valid 10-digit Indian mobile number."
            );

            return;
        }


        if (Object.keys(cart).length === 0) {

            alert("Your cart is empty.");

            return;
        }


        if (!deliverySlot) {

            alert("Please select a delivery slot.");

            return;
        }


        /* ================= ORDER ITEMS ================= */

        const orderItems =
            Object.values(cart)
                .map(item => {

                    const product =
                        products.find(
                            p =>
                                p.id ===
                                item.productId
                        );


                    if (!product) {
                        return null;
                    }


                    const price =
                        calculatePrice(
                            product,
                            item.quantity
                        );


                    return {

                        productId:
                            product.id,

                        productName:
                            product.name,

                        category:
                            product.category,

                        quantity:
                            item.quantity,

                        count:
                            item.count,

                        price:
                            price,

                        total:
                            price *
                            item.count
                    };

                })
                .filter(item => item !== null);


        /* ================= TOTAL ================= */

        const subtotal =
            orderItems.reduce(
                (sum, item) =>
                    sum + item.total,
                0
            );


        const deliveryCharge =
            calculateDeliveryCharge(
                subtotal
            );


        const total =
            subtotal +
            deliveryCharge;


        /* ================= ORDER NUMBER ================= */

        const orderNumber =
            "MZ" +
            Date.now()
                .toString()
                .slice(-7);


        /* ================= FIREBASE ORDER ================= */

        const order = {

            orderNumber:

                orderNumber,

            orderDateText: new Date().toLocaleString("en-IN"),


            customer: {

                name:
                    name,

                phone:
                    phone,

                address:
                    address

            },


            deliverySlot:

                deliverySlot,


            items:

                orderItems,


            subtotal:

                subtotal,


            deliveryCharge:

                deliveryCharge,


            total:

                total,


            paymentMethod:

                "COD",


            paymentStatus:

                "PENDING",


            location:

                customerLocation || null,


            /* IMPORTANT */

            createdAt:

                firebase.firestore.FieldValue.serverTimestamp()

        };


        /* ================= SAVE TO FIREBASE ================= */

        try {

            orderMessage.textContent =
                "Saving your order...";


            const docRef =
                await db
                    .collection("orders")
                    .add(order);


            console.log(
                "Order saved successfully:",
                docRef.id
            );


            /* ================= SUCCESS ================= */

            showOrderSuccess({

                ...order,

                firebaseId:
                    docRef.id

            });


        } catch (error) {

            console.error(
                "Firebase order save error:",
                error
            );


            orderMessage.innerHTML = `

                <div class="error-box">

                    <h3>
                        Order could not be saved
                    </h3>

                    <p>
                        Please try again.
                    </p>

                    <small>
                        ${error.message}
                    </small>

                </div>

            `;

        }

    });


/* =====================================================
   ORDER SUCCESS
===================================================== */

function showOrderSuccess(order) {

    const orderMessage =
        document.getElementById(
            "orderMessage"
        );


    orderMessage.innerHTML = `

        <div class="success-box">

            <h3>
                Order Placed Successfully!
            </h3>

            <p>
                Order Number:
                <strong>
                    ${order.orderNumber}
                </strong>
            </p>

            <p>
                Order Date:
                <strong>
                    ${order.orderDateText}
                </strong>
            </p>

            <p>
                Total:
                <strong>
                    ₹${order.total}
                </strong>
            </p>

            <p>
                Payment:
                <strong>
                    Cash on Delivery
                </strong>
            </p>


            <button
                type="button"
                class="checkout-submit"
                id="whatsappOrderBtn">

                SEND ORDER ON WHATSAPP

            </button>

        </div>

    `;


    document
        .getElementById(
            "whatsappOrderBtn"
        )
        .addEventListener(
            "click",
            () => {

                shareOrderOnWhatsApp(
                    order
                );

            }
        );


    /* ===============================
       CLEAR CART
    =============================== */

    cart = {};

    saveCart();

}


/* =====================================================
   WHATSAPP CUSTOMER QUERY
===================================================== */

function openWhatsAppQuery() {

    const message =
        "Hello MEATZY Fresh Meat 👋\n\n" +
        "I have a query regarding your products/order.\n\n" +
        "Please help me.";


    const whatsappURL =
        "https://wa.me/" +
        MEATZY_WHATSAPP +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

}


document
    .getElementById(
        "whatsappQueryBtn"
    )
    .addEventListener(
        "click",
        openWhatsAppQuery
    );


/* =====================================================
   HERO WHATSAPP
===================================================== */

document
    .getElementById(
        "heroWhatsappBtn"
    )
    .addEventListener(
        "click",
        openWhatsAppQuery
    );


/* =====================================================
   CONTACT WHATSAPP
===================================================== */

document
    .getElementById(
        "contactWhatsappBtn"
    )
    .addEventListener(
        "click",
        openWhatsAppQuery
    );


/* =====================================================
   WHATSAPP ORDER
===================================================== */

function shareOrderOnWhatsApp(order) {

    if (!order || !order.orderNumber) {

        console.error("Invalid order.");
        return;

    }

    const lines = [

        "MEATZY FRESH MEAT",

        "====================",

        `Order Number: ${order.orderNumber}`,

        `Order Date: ${order.orderDateText}`,

        "",

        "CUSTOMER DETAILS",

        `Name: ${order.customer.name}`,

        `Mobile: ${order.customer.phone}`,

        `Address: ${order.customer.address}`,

        `Delivery: ${order.deliverySlot}`,

        "",

        "ORDER ITEMS",

        "====================",

        ...order.items.map(item => {

            let quantityText;

            if (item.category.includes("Eggs")) {

                quantityText = `${item.quantity} eggs`;

            } else if (item.quantity === 1000) {

                quantityText = "1 kg";

            } else {

                quantityText = `${item.quantity} grams`;

            }

            return `${item.productName} - ${quantityText} × ${item.count} = ₹${item.total}`;

        }),

        "",

        "====================",

        `Subtotal: ₹${order.subtotal}`,

        `Delivery: ₹${order.deliveryCharge}`,

        `TOTAL: ₹${order.total}`,

        "",

        `Payment: ${order.paymentMethod}`,

        `Payment Status: ${order.paymentStatus}`,

        "",

        "Thank you for ordering from MEATZY Fresh Meat."

    ];


    if (order.location) {

        lines.push(
            "",
            "CUSTOMER LOCATION",
            `https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}`
        );

    }


    const message = lines.join("\n");

    const whatsappURL =
        "https://wa.me/" +
        MEATZY_WHATSAPP +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =====================================================
   FLOATING WHATSAPP
===================================================== */

document
    .getElementById(
        "whatsappFloatingBtn"
    )
    .addEventListener(
        "click",
        openWhatsAppQuery
    );


/* =====================================================
   YEAR
===================================================== */

document
    .getElementById(
        "year"
    )
    .textContent =
        new Date().getFullYear();


/* =====================================================
   INITIAL LOAD
===================================================== */

render();

renderCart();

