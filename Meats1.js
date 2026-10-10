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
   MEATZY PRODUCTS
===================================================== */

const products = [

    {
        id: 1,
        name: "Chicken Curry Cut",
        category: "Chicken",
        price: 320,
        image: "Chicken Curry cut.webp"
    },

    {
        id: 2,
        name: "Chicken Boneless",
        category: "Chicken",
        price: 420,
        image: "Chicken boneless.webp"
    },

    {
        id: 3,
        name: "Chicken Breast",
        category: "Chicken",
        price: 390,
        image: "Chicken breast.webp"
    },

    {
        id: 4,
        name: "Chicken Wings",
        category: "Chicken",
        price: 350,
        image: "Chicken wings.webp"
    },

    {
        id: 5,
        name: "Mutton Curry Cut",
        category: "Mutton",
        price: 900,
        image: "Mutton curry cut.webp"
    },

    {
        id: 6,
        name: "Mutton Boneless",
        category: "Mutton",
        price: 1400,
        image: "Mutton Boneless.webp"
    },

    {
        id: 7,
        name: "Desi Chicken",
        category: "Desi Chicken",
        price: 680,
        image: "Desi chicken cut.jpg"
    },

    {
        id: 8,
        name: "Eggs",
        category: "Eggs",
        price: 180,
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

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const proteinWeight =
    document.getElementById("proteinWeight");

const proteinResult =
    document.getElementById("proteinResult");


/* =====================================================
   CATEGORIES
===================================================== */

function renderFilters() {

    const categories = [
        "All",
        "Chicken",
        "Mutton",
        "Desi Chicken",
        "Eggs"
    ];

    filtersEl.innerHTML = categories
        .map(category => {

            return `
                <button
                    class="${category === selectedCategory ? "active" : ""}"
                    onclick="setCategory('${category}')"
                >
                    ${category}
                </button>
            `;

        })
        .join("");
}


/* =====================================================
   CATEGORY FILTER
===================================================== */

function setCategory(category) {

    selectedCategory = category;

    render();

    document
        .getElementById("shop")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =====================================================
   QUANTITY OPTIONS
===================================================== */

function getQuantityOptions(product) {

    /* Eggs */

    if (product.category === "Eggs") {

        return [
            6,
            12,
            18,
            30
        ];

    }


    /* Chicken / Mutton / Desi Chicken */

    return [
        250,
        500,
        1000
    ];
}


/* =====================================================
   QUANTITY TEXT
===================================================== */

function formatQuantity(product, quantity) {

    if (product.category === "Eggs") {

        return `${quantity} eggs`;

    }

    if (quantity === 1000) {

        return "1 kg";

    }

    return `${quantity} grams`;
}


/* =====================================================
   PRICE CALCULATION
===================================================== */

function calculatePrice(product, quantity) {

    /* Eggs */

    if (product.category === "Eggs") {

        /*
            ₹180 = 30 eggs

            6 eggs  = ₹36
            12 eggs = ₹72
            18 eggs = ₹108
            30 eggs = ₹180
        */

        return Math.round(
            (product.price / 30) * quantity
        );
    }


    /* Meat */

    /*
        product.price = price per 1kg

        250g = 25%
        500g = 50%
        1000g = 100%
    */

    return Math.round(
        (product.price / 1000) * quantity
    );
}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function render() {

    renderFilters();


    const filteredProducts =
        products.filter(product => {

            return (
                selectedCategory === "All" ||
                product.category === selectedCategory
            );

        });


    productsEl.innerHTML =
        filteredProducts
            .map(product => {

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


                return `

                    <article class="product">

                        <div class="product-image">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                loading="lazy"
                            >

                        </div>


                        <div class="product-body">

                            <h3>
                                ${product.name}
                            </h3>


                            <div class="meta">
                                ${product.category}
                            </div>


                            <label class="quantity-label">
                                Select quantity
                            </label>


                            <select
                                class="weight-select"
                                id="quantity-${index}"
                                onchange="updateProductPrice(${index})"
                            >

                                ${quantities
                                    .map(quantity => {

                                        return `
                                            <option
                                                value="${quantity}"
                                            >
                                                ${formatQuantity(
                                                    product,
                                                    quantity
                                                )}
                                            </option>
                                        `;

                                    })
                                    .join("")
                                }

                            </select>


                            <div
                                class="price"
                                id="price-${index}"
                            >
                                ₹${firstPrice}
                            </div>


                            <button
                                class="add-btn"
                                onclick="addToCart(${index})"
                            >
                                ADD TO CART
                            </button>

                        </div>

                    </article>

                `;

            })
            .join("");
}


/* =====================================================
   UPDATE PRODUCT PRICE
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


    if (!quantitySelect || !priceElement) {
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


    const quantitySelect =
        document.getElementById(
            `quantity-${index}`
        );


    const quantity =
        Number(quantitySelect.value);


    /*
        Unique cart key

        Example:

        Chicken Breast - 250g
        Chicken Breast - 500g

        They are treated as separate
        cart items.
    */

    const cartKey =
        `${product.id}-${quantity}`;


    if (!cart[cartKey]) {

        cart[cartKey] = {
            productId: product.id,
            quantity: quantity,
            count: 0
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
   CHANGE CART QUANTITY
===================================================== */

function changeCartQuantity(
    cartKey,
    change
) {

    if (!cart[cartKey]) {
        return;
    }


    cart[cartKey].count += change;


    if (cart[cartKey].count <= 0) {

        delete cart[cartKey];

    }


    saveCart();
}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    let total = 0;

    let itemCount = 0;


    const cartKeys =
        Object.keys(cart);


    if (cartKeys.length === 0) {

        cartItems.innerHTML = `

            <div class="empty">

                Your cart is empty.

                <br>

                Add fresh products to continue.

            </div>

        `;

        cartTotal.textContent = "0";

        cartCount.textContent = "0";

        return;
    }


    cartItems.innerHTML =
        cartKeys
            .map(cartKey => {

                const item =
                    cart[cartKey];


                const product =
                    products.find(
                        p => p.id === item.productId
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
                    price * item.count;


                total += itemTotal;

                itemCount += item.count;


                return `

                    <div class="cart-row">

                        <div>

                            <strong>
                                ${product.name}
                            </strong>

                            <br>

                            <small>
                                ${formatQuantity(
                                    product,
                                    item.quantity
                                )}
                                × ${item.count}
                                — ₹${itemTotal}
                            </small>

                        </div>


                        <div class="qty">

                            <button
                                onclick="changeCartQuantity(
                                    '${cartKey}',
                                    -1
                                )"
                            >
                                −
                            </button>


                            <b>
                                ${item.count}
                            </b>


                            <button
                                onclick="changeCartQuantity(
                                    '${cartKey}',
                                    1
                                )"
                            >
                                +
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");


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

    cartDrawer.classList.remove("open");

    overlay.classList.remove("show");
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


            checkoutModal.classList.add(
                "show"
            );

        }
    );


/* =====================================================
   CLOSE CHECKOUT - COD / RAZORPAY
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
   CHECKOUT FORM
===================================================== */

/* =====================================================
   CHECKOUT FORM — COD + RAZORPAY
===================================================== */

const API_BASE = "https://meaty-api.onrender.com";

document
    .getElementById("checkoutForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = this;
        const submitButton = form.querySelector('[type="submit"]');
        const orderMessage = document.getElementById("orderMessage");

        if (submitButton.disabled) return;

        // cart is an OBJECT, not an array
        const cartEntries = Object.entries(cart);

        if (cartEntries.length === 0) {
            orderMessage.textContent = "Your cart is empty.";
            return;
        }

        const customer = {
            name: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("customerPhone").value.trim(),
            address: document.getElementById("customerAddress").value.trim()
        };

        const deliverySlot =
            document.getElementById("deliverySlot").value;

        const paymentMethod =
            document.getElementById("paymentMethod").value;

        if (!customer.name || customer.name.length < 2) {
            orderMessage.textContent = "Please enter your name.";
            return;
        }

        if (!/^[6-9]\d{9}$/.test(customer.phone)) {
            orderMessage.textContent =
                "Enter a valid 10-digit Indian mobile number.";
            return;
        }

        if (customer.address.length < 5) {
            orderMessage.textContent =
                "Please enter your complete delivery address.";
            return;
        }

        // Convert the cart object into the API's expected array
        const items = cartEntries.map(([cartKey, item]) => {
            const product = products.find(
                p => Number(p.id) === Number(item.productId)
            );

            if (!product) {
                throw new Error("A product in your cart could not be found.");
            }

            return {
                productId: product.id,
                productName: product.name,
                category: product.category,
                quantity: Number(item.quantity),
                count: Number(item.count)
            };
        });

        submitButton.disabled = true;

        try {
            if (paymentMethod === "COD") {
                orderMessage.textContent = "Placing your order...";

                const response = await fetch(`${API_BASE}/api/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customer,
                        deliverySlot,
                        items
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Unable to place order.");
                }

                orderMessage.textContent =
                    `Order ${result.orderNumber} placed successfully. ` +
                    `Total: ₹${result.total}. Payment: Cash on Delivery.`;

                cart = {};
                saveCart();
                renderCart();
                form.reset();
                return;
            }

            if (paymentMethod !== "RAZORPAY") {
                throw new Error("Please select a valid payment method.");
            }

            if (typeof window.Razorpay !== "function") {
                throw new Error(
                    "Razorpay checkout did not load. Check your checkout.js script."
                );
            }

            orderMessage.textContent = "Creating secure payment order...";

            const createResponse = await fetch(
                `${API_BASE}/api/payments/create-order`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        customer,
                        deliverySlot,
                        items
                    })
                }
            );

            const order = await createResponse.json();

            if (!createResponse.ok) {
                throw new Error(
                    order.error || `Payment order failed (${createResponse.status}).`
                );
            }

            if (!order.keyId || !order.razorpayOrderId || !order.amount) {
                throw new Error("The server returned incomplete payment details.");
            }

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency || "INR",
                name: "MEATZY Fresh Meat",
                description: `Order ${order.orderNumber}`,
                order_id: order.razorpayOrderId,

                prefill: {
                    name: customer.name,
                    contact: customer.phone
                },

                notes: {
                    meatzyOrderNumber: order.orderNumber
                },

                theme: { color: "#d8aa50" },

                handler: async function (paymentResponse) {
                    orderMessage.textContent = "Verifying payment...";

                    try {
                        const verifyResponse = await fetch(
                            `${API_BASE}/api/payments/verify`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    orderId: order.orderId,
                                    razorpay_order_id:
                                        paymentResponse.razorpay_order_id,
                                    razorpay_payment_id:
                                        paymentResponse.razorpay_payment_id,
                                    razorpay_signature:
                                        paymentResponse.razorpay_signature
                                })
                            }
                        );

                        const verification = await verifyResponse.json();

                        if (!verifyResponse.ok || !verification.success) {
                            throw new Error(
                                verification.error || "Payment verification failed."
                            );
                        }

                        orderMessage.textContent =
                            `Payment successful! Order ${verification.orderNumber} confirmed.`;

                        cart = {};
                        saveCart();
                        renderCart();
                        form.reset();

                    } catch (error) {
                        console.error("Payment verification error:", error);
                        orderMessage.textContent =
                            "Payment was submitted, but confirmation is pending. " +
                            "Do not pay again immediately. Contact MEATZY support " +
                            `with order number ${order.orderNumber}.`;
                    } finally {
                        submitButton.disabled = false;
                    }
                },

                modal: {
                    ondismiss: function () {
                        orderMessage.textContent =
                            "Payment window closed. Your cart is still available.";
                        submitButton.disabled = false;
                    }
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                console.error(
                    "Razorpay payment failed:",
                    response.error?.description
                );

                orderMessage.textContent =
                    "Payment failed. Your cart is still available. Please try again.";

                submitButton.disabled = false;
            });

            razorpay.open();

        } catch (error) {
            console.error("Checkout error:", error);
            orderMessage.textContent =
                error.message || "Something went wrong. Please try again.";
            submitButton.disabled = false;
        }
    });

/* =====================================================
   MOBILE MENU
===================================================== */

document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            const nav =
                document.getElementById(
                    "nav"
                );


            if (
                nav.style.display === "flex"
            ) {

                nav.style.display = "none";

            } else {

                nav.style.display = "flex";

                nav.style.flexDirection =
                    "column";

                nav.style.position =
                    "absolute";

                nav.style.top = "72px";

                nav.style.left = "0";

                nav.style.right = "0";

                nav.style.padding = "20px";

                nav.style.background =
                    "#171614";

            }

        }
    );


/* =====================================================
   GYM PROTEIN CALCULATOR
===================================================== */

/*
    Approximate protein:

    100g = 27g
    250g = 67.5g
    500g = 135g
    750g = 202.5g
    1000g = 270g

    This is an estimate for raw chicken breast.
*/

function calculateProtein() {

    const grams =
        Number(
            proteinWeight.value
        );


    const protein =
        grams * 0.27;


    proteinResult.innerHTML = `

        <strong>
            ${grams === 1000 ? "1kg" : grams + "g"}
            chicken ≈
            ${protein.toFixed(1)}g protein
        </strong>

        <br>

        <small>
            Estimated using approximately
            27g protein per 100g raw chicken breast.
            Actual values vary by cut and preparation.
        </small>

    `;
}


/* =====================================================
   PROTEIN SELECT CHANGE
===================================================== */

proteinWeight.addEventListener(
    "change",
    calculateProtein
);


/* =====================================================
   ORDER PROTEIN CHICKEN
===================================================== */

document
    .getElementById(
        "proteinOrderBtn"
    )
    .addEventListener(
        "click",
        () => {

            const grams =
                Number(
                    proteinWeight.value
                );


            /*
                Chicken Breast
                product ID = 3
            */

            const product =
                products.find(
                    p =>
                        p.name ===
                        "Chicken Breast"
                );


            if (!product) {
                return;
            }


            const cartKey =
                `${product.id}-${grams}`;


            if (!cart[cartKey]) {

                cart[cartKey] = {
                    productId: product.id,
                    quantity: grams,
                    count: 0
                };

            }


            cart[cartKey].count++;


            saveCart();

            openCart();

        }
    );


/* =====================================================
   YEAR
===================================================== */

document
    .getElementById("year")
    .textContent =
        new Date().getFullYear();


/* =====================================================
   INITIAL LOAD
===================================================== */

render();

renderCart();

calculateProtein();
