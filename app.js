const GAS_URL =
  "https://script.google.com/macros/s/AKfycbzLlbwEVAoACWPOaOTl6ZqAZAxXYAtE2mVtP3PSrYDp8ii0bBzyrq02QyDsaoSPa1RF/exec"; //ml2
// Make sure this is your latest public deployment URL

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

document.addEventListener("DOMContentLoaded", loadMenu);

let deferredPrompt = null;

// === Listen for the install prompt ===
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e; // Store the event for later use
  console.log("✅ PWA install prompt captured.");
});

// === Toast Function ===
function showToast(message, bg = "#333") {
  const toastContainer = document.getElementById("toastPWAContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.background = bg;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// === Install Button ===
document.getElementById("installAppBtn").addEventListener("click", async () => {
  if (deferredPrompt) {
    // Show install prompt instantly
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast("🎉 App installed successfully!", "#16a34a");
    } else {
      showToast("ℹ️ Installation cancelled.", "#dc2626");
    }
    deferredPrompt = null;
  } else {
    // Fallback for unsupported browsers (Messenger, Safari, etc.)
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      showToast("📱 Tap ‘Share’ → ‘Add to Home Screen’ to install.", "#2563eb");
    } else if (ua.includes("fbav") || ua.includes("instagram") || ua.includes("messenger")) {
      showToast("⚠️ Open in Chrome or Safari to install this app.", "#f59e0b");
    } else {
      showToast("ℹ️ App installation not supported on this browser.", "#dc2626");
    }
  }
});

// === Detect successful install (some browsers fire this event) ===
window.addEventListener('appinstalled', () => {
  showToast("🎉 App added to your home screen!", "#16a34a");
  deferredPrompt = null;
});

// === Toast Utility ===
function showToast(message, duration = 3000) {
  const toast = document.createElement("div");
  toast.className =
    "bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg opacity-0 translate-y-3 transition-all duration-500";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Fade in
  setTimeout(() => {
    toast.classList.add("opacity-100", "translate-y-0");
  }, 100);

  // Fade out
  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0", "translate-y-3");
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

// === Handle beforeinstallprompt (Android/desktop) ===
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
  showToast("✨ Smoothies & More App is ready to install!");
});

// === Install button click ===
installBtn.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      showToast("✅ Installing Smoothies & More App...");
    } else {
      showToast("ℹ️ Install canceled.");
    }
    deferredPrompt = null;
    installBtn.classList.add("hidden");
  } else if (isIos() || isInAppBrowser()) {
    manualPopup.classList.remove("hidden");
  } else {
    showToast("ℹ️ Use browser menu → 'Add to Home Screen'.");
  }
});

// === Manual Popup Close ===
closeGuide.addEventListener("click", () => {
  manualPopup.classList.add("hidden");
});

// === Hide install button if already installed ===
window.addEventListener("appinstalled", () => {
  installBtn.classList.add("hidden");
  showToast("🎉 Smoothies & More App installed successfully!");
});

// === Show button on load if not installed ===
window.addEventListener("load", () => {
  if (!isInStandaloneMode()) {
    installBtn.classList.remove("hidden");
  }
});

const menuContainer = document.getElementById("menuItems");

// ======= OPEN ORDER MODAL BUTTONS =======
document.getElementById("cartBtn").addEventListener("click", showOrderModal);
document.getElementById("orderBtn").addEventListener("click", showOrderModal);
document
  .getElementById("closeOrderModal")
  .addEventListener("click", closeOrderModal);
const mobileMenuBtn = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const orderModal = document.getElementById("orderModal");
const orderItemsContainer = document.getElementById("orderItems");
const orderTotalElem = document.getElementById("orderTotal");
const container = document.getElementById("toastContainer");
const toastFaceRec = document.getElementById("toastFaceRec");
const loader = document.getElementById("loader");
const regVideo = document.getElementById("regVideo");
const orderForm = document.getElementById("orderForm");
const contactForm = document.getElementById("contactForm");

document.getElementById("scanner").style.display = "none";

// Mobile cart button also opens the modal
document.getElementById("cartBtnMobile").addEventListener("click", () => {
  mobileMenu.classList.add("hidden"); // close mobile nav if open
  showOrderModal(); // open the modal
});

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// ======= CART & ORDER STATE =======
let cart = [];

function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartCountMobile").textContent = count;
}

// Toast helper function
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  // Remove after animation + delay (~3s)
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function showToaster(msg, color = "#16a34a") {
  toastFaceRec.textContent = msg;
  toastFaceRec.style.background = color;
  toastFaceRec.style.opacity = 1;
  setTimeout(() => (toastFaceRec.style.opacity = 0), 2500);
}

function showLoader(show) {
  loader.style.display = show ? "flex" : "none";
}

function showMsg(m) {
  document.getElementById("msg").textContent = m;
}

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;

      // Reset button styles
      tabButtons.forEach((b) => {
        b.classList.remove("bg-blue-600", "text-white", "shadow-md");
        b.classList.add("bg-white", "text-black");
      });

      // Hide all tab panes
      tabPanes.forEach((pane) => pane.classList.add("hidden"));

      // Activate the clicked button
      btn.classList.remove("bg-white", "text-black");
      btn.classList.add("bg-blue-600", "text-white", "shadow-md");

      // Show the corresponding tab content
      document.getElementById(targetId).classList.remove("hidden");
    });
  });

  // Auto-activate the first tab
  tabButtons[0].click();
});


// === Feature button toggle ===
document.querySelectorAll(".feature-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const selected = btn.dataset.feature;
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.classList.add("hidden");
    });
    document.querySelectorAll(".feature-btn").forEach((b) => {
      b.classList.remove("bg-white", "shadow-sm", "text-purple-600");
      b.classList.add("text-gray-600");
    });
    const activeCard = document.getElementById(`feature-${selected}`);
    if (activeCard) activeCard.classList.remove("hidden");
    btn.classList.add("bg-white", "shadow-sm", "text-purple-600");
  });
});

async function loadModels() {
  const modelURL =
    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights";
  await faceapi.nets.ssdMobilenetv1.loadFromUri(modelURL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(modelURL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(modelURL);
}

async function loadMenu() {
  try {
    const res = await fetch(GAS_URL);
    const data = await res.json();
    renderMenu(data); // Pass array, not string
  } catch (err) {
    if (menuContainer)
      menuContainer.innerHTML =
        '<p class="text-center text-red-500">Failed to load menu.</p>';
  }
}

// === RENDER MENU ===
function renderMenu(data) {
  const menuContainer = document.getElementById("menuItems");
  if (!menuContainer) return;
  menuContainer.innerHTML = "";

  const categories = Array.isArray(data[0]?.items)
    ? data
    : [{ name: "Menu", items: data }];

  categories.forEach((category) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "w-full text-center mb-12";

    const title = document.createElement("p");
    title.className = "text-2xl font-semibold mb-4 text-gray-800";
    title.textContent = category.name;

    const wrapper = document.createElement("div");
    wrapper.className = "relative flex items-center justify-center group";

    const safeId = category.name.replace(/\s+/g, "-").toLowerCase();

    wrapper.innerHTML = `
      <button class="left-arrow absolute left-2 top-1/2 -translate-y-1/2">&#8592;</button>

      <div id="menu-${safeId}" class="menu-scroll no-scrollbar">
        ${category.items
        .map(
          (item) => `
          <div class="bg-white rounded-xl shadow-md overflow-hidden flex flex-col 
                      hover:shadow-lg transform hover:-translate-y-1 transition snap-center">
            <img src="${item.imageUrl || "https://via.placeholder.com/400x300"}"
                 alt="${item.name}"
                 class="h-40 w-full object-cover" />
            <div class="p-4 flex flex-col flex-grow">
              <h3 class="font-semibold text-lg mb-1">${item.name}</h3>
              <p class="text-gray-600 text-sm flex-grow">${item.description || ""}</p>
              <div class="mt-3 flex items-center justify-between">
                <span class="font-bold text-indigo-600">$${parseFloat(item.price).toFixed(2)}</span>
                <button class="add-to-cart-btn bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs"
                        data-name="${item.name}"
                        data-price="${item.price}">
                  Add
                </button>
              </div>
            </div>
          </div>`
        )
        .join("")}
      </div>

      <button class="right-arrow absolute right-2 top-1/2 -translate-y-1/2">&#8594;</button>
    `;

    categoryDiv.appendChild(title);
    categoryDiv.appendChild(wrapper);
    menuContainer.appendChild(categoryDiv);

    const scrollContainer = wrapper.querySelector(`#menu-${safeId}`);
    const leftArrow = wrapper.querySelector(".left-arrow");
    const rightArrow = wrapper.querySelector(".right-arrow");

    // Scroll logic
    leftArrow.addEventListener("click", () => {
      scrollContainer.scrollBy({ left: -scrollContainer.clientWidth * 0.6, behavior: "smooth" });
    });
    rightArrow.addEventListener("click", () => {
      scrollContainer.scrollBy({ left: scrollContainer.clientWidth * 0.6, behavior: "smooth" });
    });

    // Center items if ≤4 (even 1 item)
    if (category.items.length <= 4) {
      leftArrow.classList.add("hidden");
      rightArrow.classList.add("hidden");
      scrollContainer.style.justifyContent = "center";
    }
  });

  // === Add to Cart Buttons ===
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const { name, price } = e.target.dataset;
      addToCart(name, parseFloat(price), e.target);
    });
  });

  // === Fade-in Animation (on scroll) ===
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".menu-scroll > div").forEach((el) => observer.observe(el));
}


// function renderMenu(items) {
//   // console.log("Menu Items:", items);
//   const menuContainer = document.getElementById("menuItems");
//   if (!menuContainer) return;

//   if (!items || items.length === 0) {
//     menuContainer.innerHTML =
//       '<p class="text-center text-gray-500 col-span-full">No menu items found.</p>';
//     return;
//   }

//   menuContainer.innerHTML = ""; // Clear previous

//   items.forEach((item) => {
//     const card = document.createElement("div");
//     card.className =
//       "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] hover:ring-2 hover:ring-offset-2 hover:ring-pink-400";
//     card.innerHTML = `
//         <img src="${item.imageUrl}" alt="${item.name
//       }" class="h-50 w-full object-cover" />
//         <div class="p-4 flex flex-col flex-grow">
//           <h3 class="font-semibold text-xl mb-1">${item.name}</h3>
//           <p class="text-gray-600 flex-grow">${item.description}</p>
//           <div class="mt-4 flex items-center justify-between">
//             <span class="font-bold text-lg">$${parseFloat(item.price).toFixed(
//         2
//       )}</span>
//             <button class="add-to-cart-btn bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition" data-name="${item.name
//       }" data-price="${item.price}">
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       `;
//     menuContainer.appendChild(card);
//   });
// }


function addToCart(name, price) {
  const existing = cart.find((i) => i.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartCount();
  showToast(`Added ${name} to cart!`);
}

// In order modal show
function showOrderModal() {
  if (cart.length === 0) {
    showToast("Your cart is empty. Please add items to order.");
    return;
  }
  document.getElementById("scanner").style.display = "block";
  document.getElementById("scannerLogin").style.display = "block";
  renderOrderItems();
  orderModal.classList.remove("hidden");
}

// ======= CLOSE ORDER MODAL FUNCTION =======
function closeOrderModal() {
  const orderModal = document.getElementById("orderModal");
  if (!orderModal) return;

  // Add smooth fade-out animation
  orderModal.classList.add("opacity-0", "transition", "duration-300");

  // After animation completes, hide modal
  setTimeout(() => {
    orderModal.classList.add("hidden");
    orderModal.classList.remove("opacity-0");
    showLoader(false);
  }, 300);
}

// ======= RENDER ORDER ITEMS =======
function renderOrderItems() {
  orderItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center space-x-4";

    div.innerHTML = `
        <div>
          <p class="font-semibold">${item.name} x ${item.quantity}</p>
          <p class="text-gray-500 text-sm">$${item.price.toFixed(2)} each</p>
        </div>
        <div class="flex items-center space-x-2">
          <button class="decrease-btn text-red-500 hover:text-red-700 font-bold px-2" data-name="${item.name
      }">−</button>
          <button class="increase-btn text-green-500 hover:text-green-700 font-bold px-2" data-name="${item.name
      }">+</button>
        </div>
      `;
    orderItemsContainer.appendChild(div);
  });

  orderTotalElem.textContent = `$${total.toFixed(2)}`;

  // Event listeners for + and − buttons
  orderItemsContainer.querySelectorAll(".increase-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const item = cart.find((i) => i.name === name);
      if (item) {
        item.quantity++;
        renderOrderItems();
        updateCartCount();
      }
    });
  });

  orderItemsContainer.querySelectorAll(".decrease-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.getAttribute("data-name");
      const itemIndex = cart.findIndex((i) => i.name === name);
      if (itemIndex > -1) {
        cart[itemIndex].quantity--;
        if (cart[itemIndex].quantity <= 0) {
          cart.splice(itemIndex, 1);
        }
        renderOrderItems();
        updateCartCount();
      }
    });
  });
}

document.getElementById("faceRegBtn").onclick = async () => {
  showLoader(true);
  await loadModels();
  await startCamera(regVideo);
  document.getElementById("cameraReg").classList.remove("hidden");
  showToaster("📷 Camera ready — capture your face");
  document.getElementById("scanner").style.display = "none";
};

async function startCamera(videoElement) {
  try {
    showLoader(false);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          minAspectRatio: 1.333,
          maxAspectRatio: 1.334,
          facingMode: "user",
        },
        optional: [{ minFrameRate: 60 }, { maxWidth: 640 }, { maxHeigth: 480 }],
      },
    });
    const videoTracks = stream.getVideoTracks();
    const track = videoTracks[0];
    // alert(`Getting video from: ${track.label}`);
    document.querySelector("video").srcObject = stream;
  } catch (err) {
    showToaster("⚠️ Camera access denied.", "#dc2626");
  }
}

let regDescriptor = null;
let regFaceImage = null;

document.getElementById("captureRegBtn").onclick = async () => {
  showLoader(true);
  const detections = await faceapi
    .detectAllFaces(regVideo)
    .withFaceLandmarks()
    .withFaceDescriptors();
  if (detections.length === 0) {
    showToaster("⚠️ No face detected.", "#dc2626");
    showLoader(false);
    return;
  }
  document.getElementById("scanner").style.display = "none";
  regDescriptor = JSON.stringify(Array.from(detections[0].descriptor));

  const canvas = document.createElement("canvas");
  canvas.width = regVideo.videoWidth;
  canvas.height = regVideo.videoHeight;
  canvas
    .getContext("2d")
    .drawImage(regVideo, 0, 0, canvas.width, canvas.height);
  regFaceImage = canvas.toDataURL("image/png");

  document.getElementById("regFacePreview").src = regFaceImage;
  document.getElementById("regPreview").classList.remove("hidden");

  stopCamera(regVideo);
  document.getElementById("cameraReg").classList.add("hidden");
  showLoader(false);
  showToaster("✅ Face captured successfully!");
};

function stopCamera(videoElement) {
  const stream = videoElement.srcObject;
  if (stream) stream.getTracks().forEach((track) => track.stop());
  videoElement.srcObject = null;
}

function isValidIndianNumber(contact) {
  const pattern = /^(?:\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/;
  return pattern.test(contact.trim());
}

// --- Live Sync Order Summary ---
function syncOrderSummary() {
  const orderItems = document.getElementById("orderItems");
  const orderTotal = document.getElementById("orderTotal");
  const summaryItems = document.getElementById("summaryItems");
  const summaryTotal = document.getElementById("summaryTotal");

  if (!orderItems || !summaryItems) return;

  // Clear old items
  summaryItems.innerHTML = "";

  // Copy each order item
  Array.from(orderItems.children).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.textContent;
    summaryItems.appendChild(li);
  });

  // Copy total
  summaryTotal.textContent = orderTotal ? orderTotal.textContent : "$0.00";
}

// Observe order changes in real-time
const orderSection = document.getElementById("orderItems");
const totalSection = document.getElementById("orderTotal");

// MutationObserver to detect any changes (add/remove items, total updates)
const observer = new MutationObserver(syncOrderSummary);

// Watch both items and total for updates
if (orderSection) observer.observe(orderSection, { childList: true, subtree: true });
if (totalSection) observer.observe(totalSection, { childList: true, characterData: true, subtree: true });

// Initial load
document.addEventListener("DOMContentLoaded", syncOrderSummary);

const placeOrderBtn = document.getElementById("placeOrderBtn");
const checkoutModal = document.getElementById("checkoutModal");
const cancelCheckout = document.getElementById("cancelCheckout");
const confirmCheckout = document.getElementById("confirmCheckout");

// 🧾 When user clicks "Place Order"
placeOrderBtn.addEventListener("click", () => {
  // Gather form values
  const name = document.getElementById("customerName").value.trim();
  const contact = document.getElementById("customerContact").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const payment = document.getElementById("paymentMethod").value;

  // Quick validation
  if (!name || !contact || !email || !address || !payment) {
    showToaster("⚠️ Please fill in all required fields", "#dc2626");
    return;
  }

  // Fill summary modal
  document.getElementById("summaryName").textContent = name;
  document.getElementById("summaryContact").textContent = contact;
  document.getElementById("summaryEmail").textContent = email;
  document.getElementById("summaryAddress").textContent = address;
  document.getElementById("summaryPayment").textContent = payment;

  // (Optional) You can dynamically calculate totals here
  document.getElementById("summaryTotal").textContent = totalSection.textContent;

  // Show modal
  checkoutModal.classList.remove("hidden");
});

// ❌ Cancel button
cancelCheckout.addEventListener("click", () => {
  checkoutModal.classList.add("hidden");
});

// ✅ Confirm button (final submit)
confirmCheckout.addEventListener("click", async () => {
  checkoutModal.classList.add("hidden");

  // Optionally: run card validation if needed
  const payment = document.getElementById("paymentMethod").value;
  if (payment === "CreditCard") {
    const valid = await validateCardDetails();
    if (!valid) return;
  }

  showToaster("🧾 Submitting your order...", "#2563eb");

  // Submit your form here
  document.getElementById("orderForm").submit();
});

// On order form submit
document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    showToast("Your cart is empty.");
    return;
  }

  const contactInput = document.getElementById("customerContact").value;

  if (!isValidIndianNumber(contactInput)) {
    showToast("📵 Please enter a valid Indian contact number.", "#dc2626");
    return;
  }

  if (paymentSelect.value === "card") {
    const valid = validateCardDetails();
    if (!valid) return;
  }

  const name = e.target.customerName.value.trim();
  const contact = e.target.customerContact.value.trim();
  const email = e.target.customerEmail.value.trim();
  const address = e.target.customerAddress.value.trim();
  const paymentMethod = e.target.paymentMethod.value;

  if (!name || !contact || !email || !address || !paymentMethod) {
    showToast("Please fill all required fields.");
    return;
  }

  // Prepare order data
  const order = {
    customerName: name,
    customerContact: contact,
    customerEmail: email,
    customerAddress: address,
    paymentMethod,
    items: cart,
    total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };

  const user = {
    customerName: name,
    customerContact: contact,
    customerEmail: email,
    customerAddress: address,
    paymentMethod,
  };

  submitOrder(order);
  registerUser(user);
});

const getLocationBtn = document.getElementById("getLocationBtn");
const addressInput = document.getElementById("customerAddress");
const addressValidationMsg = document.getElementById("addressValidationMsg");

// 🧭 Get current device location
getLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showToast("⚠️ Geolocation is not supported by your browser");
    return;
  }

  showToast("📡 Getting your location...");
  navigator.geolocation.getCurrentPosition(success, error);
});

async function success(position) {
  const { latitude, longitude } = position.coords;

  try {
    // Use Google Maps Geocoding API (or OpenStreetMap Nominatim if you prefer)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await res.json();

    addressInput.value = data.display_name || "Detected location";
    validateServiceArea(latitude, longitude);
  } catch (err) {
    showToast("⚠️ Unable to fetch address details.");
  }
}

function error() {
  showToast("❌ Failed to get your location.");
}

const SERVICE_CENTER = { lat: 19.076, lon: 72.8777 }; // Example: Mumbai center
const SERVICE_RADIUS_KM = 10;

function validateServiceArea(lat, lon) {
  const distance = getDistanceFromLatLonInKm(lat, lon, SERVICE_CENTER.lat, SERVICE_CENTER.lon);

  if (distance <= SERVICE_RADIUS_KM) {
    addressValidationMsg.textContent = "✅ Your location is serviceable for delivery.";
    addressValidationMsg.className = "text-green-600 text-sm mt-1";
  } else {
    addressValidationMsg.textContent = "❌ Sorry, we don’t deliver to your area yet.";
    addressValidationMsg.className = "text-red-600 text-sm mt-1";
  }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

addressInput.addEventListener("blur", async () => {
  if (addressInput.value.trim().length < 5) return;

  // Convert address → coordinates using Geocoding
  const query = encodeURIComponent(addressInput.value.trim());
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
  const data = await res.json();

  if (data.length > 0) {
    const { lat, lon } = data[0];
    validateServiceArea(parseFloat(lat), parseFloat(lon));
  } else {
    addressValidationMsg.textContent = "⚠️ Unable to locate this address.";
    addressValidationMsg.className = "text-yellow-600 text-sm mt-1";
  }
});

// 1️⃣ Send code
document.getElementById("sendCodeBtn").onclick = async () => {
  const email = document.getElementById("customerEmail").value.trim();
  const res = await sendToGAS({
    action: "send-code",
    email
  });
  showToaster(res.message);
};

// 2️⃣ Verify code
document.getElementById("verifyCodeBtn").onclick = async () => {
  const email = document.getElementById("customerEmail").value.trim();
  const code = document.getElementById("emailCode").value.trim();
  const res = await sendToGAS({
    action: "verify-code",
    email,
    code
  });
  showToaster(res.message);

  if (res.success) {
    document.getElementById("emailSection").classList.add("verified");
  }
};

const paymentSelect = document.getElementById("paymentMethod");
const cardSection = document.getElementById("cardSection");
const cardNumber = document.getElementById("cardNumber");
const expiryDate = document.getElementById("expiryDate");
const cvv = document.getElementById("cvv");

// 1️⃣ Show / Hide card section
paymentSelect.addEventListener("change", () => {
  console.log("Payment method changed to:", paymentSelect.value);
  if (paymentSelect.value === "card") {
    cardSection.classList.remove("hidden");
  } else {
    cardSection.classList.add("hidden");
  }
});

// 2️⃣ Format card number as XXXX XXXX XXXX XXXX
cardNumber.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "");
  val = val.match(/.{1,4}/g)?.join(" ") || "";
  e.target.value = val;
});

// 3️⃣ Format expiry as MM/YY
expiryDate.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "").slice(0, 4);
  if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
  e.target.value = val;
});

// 4️⃣ Validate card before form submit
async function validateCardDetails() {
  const number = cardNumber.value.replace(/\s/g, "");
  const expiry = expiryDate.value;
  const cvvVal = cvv.value;

  if (!luhnCheck(number)) {
    showToaster("❌ Invalid card number", "#dc2626");
    return false;
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
    showToaster("❌ Invalid expiry date", "#dc2626");
    return false;
  }

  if (!/^\d{3}$/.test(cvvVal)) {
    showToaster("❌ Invalid CVV", "#dc2626");
    return false;
  }

  showToaster("✅ Card validated successfully!", "#16a34a");
  return true;
}

// 5️⃣ Luhn algorithm to validate card numbers
function luhnCheck(num) {
  let arr = (num + "")
    .split("")
    .reverse()
    .map((x) => parseInt(x));
  let sum = arr.reduce((acc, val, i) => {
    if (i % 2) {
      val *= 2;
      if (val > 9) val -= 9;
    }
    return acc + val;
  }, 0);
  return sum % 10 === 0;
}

// Register
async function registerUser(user) {
  const name = user.customerName;
  const contact = user.customerContact;
  const email = user.customerEmail;
  const payment = user.paymentMethod;

  if (!name || !contact || !email || !paymentMethod) {
    showToast("Please fill all required fields.");
    return;
  }

  const res = await sendToGAS({
    action: "register",
    name,
    contact,
    email,
    payment,
    regDescriptor,
    regFaceImage,
  });
  showMsg(res.message);
}

// Submit Order
async function submitOrder(order) {
  const name = order.customerName;
  const contact = order.customerContact;
  const email = order.customerEmail;
  const payment = order.paymentMethod;
  const items = order.items;
  const amount = order.total;

  if (
    !name ||
    !contact ||
    !email ||
    !payment ||
    items.length === 0 ||
    amount <= 0
  ) {
    showToast("Please fill all required fields.");
    return;
  }

  const res = await sendToGAS({
    action: "order",
    name,
    contact,
    email,
    payment,
    items,
    amount,
  });
  showLoader(true);
  showToast('Order placed successfully! We will contact you soon.');
  cart = [];
  updateCartCount();
  closeOrderModal();
  orderForm.reset();
  // showMsg(res.message);
}

// Form submission
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    name: e.target.contact_name.value.trim(),
    email: e.target.contact_email.value.trim(),
    message: e.target.contact_message.value.trim(),
  };
  contactForm.querySelector("button").disabled = true;

  submitContactUs(data);
});

async function submitContactUs(data) {
  const name = data.name;
  const email = data.email;
  const message = data.message;

  if (!name || !email || !message) {
    showToast("Please fill all required fields.");
    return;
  }

  const res = await sendToGAS({
    action: "contact-us",
    name,
    email,
    message,
  });
  showLoader(true);
  showToast('Message sent. We will get back to you soon!');
  contactForm.reset();
  showLoader(false);
}

const loginVideo = document.getElementById("loginVideo");

document.getElementById("faceLoginBtn").onclick = async () => {
  showLoader(true);
  await loadModels();
  await startLoginCamera(loginVideo);
  document.getElementById("cameraLogin").classList.remove("hidden");
  showToaster("📷 Ready to capture your face for login");
  showLoader(false);
};

async function startLoginCamera(videoElement) {
  try {
    showLoader(false);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          minAspectRatio: 1.333,
          maxAspectRatio: 1.334,
          facingMode: "user",
        },
        optional: [{ minFrameRate: 60 }, { maxWidth: 640 }, { maxHeigth: 480 }],
      },
    });
    const videoTracks = stream.getVideoTracks();
    const track = videoTracks[0];
    // alert(`Getting video from: ${track.label}`);
    document.querySelector("#loginVideo").srcObject = stream;
  } catch (err) {
    showToaster("⚠️ Camera access denied.", "#dc2626");
  }
}

document.getElementById("captureLoginBtn").onclick = async () => {
  showLoader(true);

  const detections = await faceapi
    .detectAllFaces(loginVideo)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length === 0) {
    showToaster("⚠️ No face detected.", "#dc2626");
    showLoader(false);
    return;
  }

  // Convert face descriptor to JSON
  const currentDescriptor = JSON.stringify(Array.from(detections[0].descriptor));
  // console.log("Current Descriptor:", currentDescriptor);

  // Stop camera
  stopCamera(loginVideo);
  document.getElementById("cameraLogin").classList.add("hidden");
  document.getElementById("scannerLogin").style.display = "none";

  // Send descriptor to GAS
  const res = await sendToGAS({
    action: "face-login",
    descriptor: currentDescriptor,
  });

  // console.log("GAS Response:", res.results.name);
  showLoader(false);

  if (res.status === "success") {
    const user = res.results;
    showToaster(`👋 Welcome back, ${user.name}!`);
    showMsg(`👋 Welcome back, ${user.name}!`);

    // ✅ Auto-fill form fields

    // console.log("User Data:", user);
    document.getElementById("customerName").value = user.name || "";
    document.getElementById("customerContact").value = user.contact || "";
    document.getElementById("customerEmail").value = user.email || "";
    document.getElementById("paymentMethod").value = user.payment || "";
  } else {
    showToaster("❌ Face not recognized.", "#dc2626");
  }
};

async function sendToGAS(payload) {
  try {
    const r = await fetch(GAS_URL, {
      redirect: "follow",
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("Network response was not ok");
    return await r.json();
  } catch (err) {
    showMsg("❌ Request failed: " + err.message);
    return { message: err.message };
  }
}
