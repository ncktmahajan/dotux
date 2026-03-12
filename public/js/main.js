/**
 * nachiket.ux — client JS
 * Subtle type-on effect for the terminal + card hover glow
 */

document.addEventListener("DOMContentLoaded", () => {

  // ── Typewriter on terminal domain line ──────────────────────
  const domainEl = document.querySelector(".domain-highlight");
  if (domainEl) {
    const original = domainEl.textContent;
    domainEl.textContent = "";
    let i = 0;
    const type = () => {
      if (i < original.length) {
        domainEl.textContent += original[i++];
        setTimeout(type, 60);
      }
    };
    setTimeout(type, 800);
  }

  // ── Card spotlight glow on mousemove ────────────────────────
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, #131320, #0d0d14)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.background = "";
    });
  });

  // ── Title hover shimmer ──────────────────────────────────────
  const tld = document.querySelector(".tld");
  if (tld) {
    tld.addEventListener("mouseenter", () => {
      tld.style.textShadow = "0 0 60px rgba(126,255,197,0.7)";
    });
    tld.addEventListener("mouseleave", () => {
      tld.style.textShadow = "0 0 40px rgba(126,255,197,0.4)";
    });
  }

  // ── Console greeting ────────────────────────────────────────
  console.log("%c nachiket.ux ", "background:#7effc5;color:#050508;font-weight:bold;font-size:1.2rem;padding:4px 10px;border-radius:4px");
  console.log("%c Your local domain is alive. No cloud required.", "color:#6b6b80;font-size:0.9rem");
});
