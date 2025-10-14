const GAS_URL = "https://script.google.com/macros/s/AKfycbzMwdWYukYcz0jUJP9h5CT23Br7rH_Fa4m5gj_5Bt40E5yImN2OM5TeFfAvJFshmqPb/exec";  
// Make sure this is your latest public deployment URL

const video = document.getElementById("camera");
const preview = document.getElementById("preview");
let faceData = null;

// Start camera safely
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    video.srcObject = stream;
  } catch (err) {
    showMsg("📷 Camera error: " + err.message);
  }
}

document.addEventListener("DOMContentLoaded", startCamera);

// Capture face
document.getElementById("captureBtn").onclick = () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 250;
  canvas.height = video.videoHeight || 180;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);
  faceData = canvas.toDataURL("image/png");
  preview.src = faceData;
  preview.hidden = false;
  showMsg("✅ Face captured");
};

// Register
document.getElementById("registerBtn").onclick = async () => {
  const email = emailVal();
  const password = passVal();
  if (!faceData) return showMsg("⚠️ Capture your face first!");
  const res = await sendToGAS({ action: "register", email, password, face: faceData });
  showMsg(res.message);
};

// Login
document.getElementById("loginBtn").onclick = async () => {
  const email = emailVal();
  const password = passVal();
  const res = await sendToGAS({ action: "login", email, password });
  showMsg(res.message);
};

// Helpers
function emailVal() { return document.getElementById("email").value.trim(); }
function passVal() { return document.getElementById("password").value.trim(); }

async function sendToGAS(payload) {
  try {
    const r = await fetch(GAS_URL, {
      redirect: "follow",
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error("Network response was not ok");
    return await r.json();
  } catch (err) {
    showMsg("❌ Request failed: " + err.message);
    return { message: err.message };
  }
}

function showMsg(m) { document.getElementById("msg").textContent = m; }