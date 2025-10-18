const GAS_URL =
  "https://script.google.com/macros/s/AKfycbz9gbq_mUdbFUepid_YMTeiJfCIQgrpHyUmxHn-WsJH3RvmNj23sHePscnwACFJ8OWb/exec"; //fl-success
// Make sure this is your latest public deployment URL

document.addEventListener("DOMContentLoaded", loadMenu);
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
    renderMenu(data.menu); // Pass array, not string
  } catch (err) {
    if (menuContainer)
      menuContainer.innerHTML =
        '<p class="text-center text-red-500">Failed to load menu.</p>';
  }
}

function renderMenu(items) {
  const menuContainer = document.getElementById("menuItems");
  if (!menuContainer) return;

  if (!items || items.length === 0) {
    menuContainer.innerHTML =
      '<p class="text-center text-gray-500 col-span-full">No menu items found.</p>';
    return;
  }

  menuContainer.innerHTML = ""; // Clear previous

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] hover:ring-2 hover:ring-offset-2 hover:ring-pink-400";
    card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name
      }" class="h-50 w-full object-cover" />
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="font-semibold text-xl mb-1">${item.name}</h3>
          <p class="text-gray-600 flex-grow">${item.descriptio}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="font-bold text-lg">$${parseFloat(item.price).toFixed(
        2
      )}</span>
            <button class="add-to-cart-btn bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition" data-name="${item.name
      }" data-price="${item.price}">
              Add to Cart
            </button>
          </div>
        </div>
      `;
    menuContainer.appendChild(card);
  });

  // Add event listeners to buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      addToCart(name, price);
    });
  });
}

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

// On order form submit
document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    showToast("Your cart is empty.");
    return;
  }

  const name = e.target.customerName.value.trim();
  const contact = e.target.customerContact.value.trim();
  const email = e.target.customerEmail.value.trim();
  const paymentMethod = e.target.paymentMethod.value;

  if (!name || !contact || !email || !paymentMethod) {
    showToast("Please fill all required fields.");
    return;
  }

  // Prepare order data
  const order = {
    customerName: name,
    customerContact: contact,
    customerEmail: email,
    paymentMethod,
    items: cart,
    total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };

  const user = {
    customerName: name,
    customerContact: contact,
    customerEmail: email,
    paymentMethod,
  };

  submitOrder(order);
  registerUser(user);
});

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
