const GAS_URL = "https://script.google.com/a/~/macros/s/AKfycbxLoj4AJMH8erDKeRodxmOqQrCdAVy1q2ajB3A9buu9eGv_GKh4RHGHZmrAV7-ZBgwC/exec"; // ← replace

const video = document.getElementById("camera");
const preview = document.getElementById("preview");
let faceData = null;

// Start camera safely
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:{facingMode:"user"} });
    video.srcObject = stream;
  } catch (err) {
    alert("Camera error: " + err.message);
  }
}

document.addEventListener("DOMContentLoaded", startCamera);

// Capture face
document.getElementById("captureBtn").onclick = () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);
  faceData = canvas.toDataURL("image/png");
  preview.src = faceData;
  preview.hidden = false;
  showMsg("Face captured ✅");
};

// Register
document.getElementById("registerBtn").onclick = async () => {
  const email = emailVal();
  const password = passVal();
  if (!faceData) return showMsg("Capture face first!");
  const res = await sendToGAS({ action:"register", email, password, face:faceData });
  showMsg(res.message);
};

// Login
document.getElementById("loginBtn").onclick = async () => {
  const email = emailVal();
  const password = passVal();
  const res = await sendToGAS({ action:"login", email, password });
  showMsg(res.message);
};

function emailVal(){ return document.getElementById("email").value.trim(); }
function passVal(){ return document.getElementById("password").value.trim(); }

async function sendToGAS(payload){
  const r = await fetch(GAS_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  return await r.json();
}

function showMsg(m){ document.getElementById("msg").textContent = m; }
