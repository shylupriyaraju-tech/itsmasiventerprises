// 1) Paste your deployed Google Apps Script Web App URL here:
const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

const menu = document.getElementById("menu");
const burger = document.querySelector(".burger");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
});
document.getElementById("yr").textContent = new Date().getFullYear();

const form = document.getElementById("proposalForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  if (d.website) return; // honeypot: bots only
  const name = d.name.trim(), phone = d.phone.replace(/[\s()-]/g, ""), email = d.email.trim();
  if (name.length < 2) return say("Please enter your name.", "err");
  if (!/^\+?\d{10,13}$/.test(phone)) return say("Please enter a valid phone number.", "err");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say("Please enter a valid email.", "err");
  if (SCRIPT_URL.startsWith("PASTE")) return say("Form is not connected yet. Add the Apps Script URL in script.js.", "err");

  const btn = form.querySelector("button");
  btn.disabled = true; say("Sending…");
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Apps Script does not return CORS headers; the request still arrives
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, phone, email, message: d.message.trim(), source: location.href, time: new Date().toISOString() })
    });
    form.reset(); say("Thank you! We will contact you shortly.", "ok");
  } catch (err) {
    say("Could not send. Please WhatsApp us instead.", "err");
  } finally { btn.disabled = false; }
});
function say(t, c = "") { status.textContent = t; status.className = c; }
