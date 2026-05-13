const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const beeCursor = document.getElementById("bee-cursor");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

let lastTrailTime = 0;

document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;

  if (beeCursor) {
    beeCursor.style.left = `${x}px`;
    beeCursor.style.top = `${y}px`;
  }

  const now = Date.now();

  if (now - lastTrailTime > 65) {
    lastTrailTime = now;

    const particle = document.createElement("div");
    particle.className = "honey-particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1100);
  }
});