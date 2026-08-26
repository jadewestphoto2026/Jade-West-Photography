const menuToggle = document.getElementById("menuToggle");
const navGroups = document.querySelectorAll(".nav-left, .nav-right");
const beeCursor = document.getElementById("bee-cursor");

function closeMobileMenu() {
  navGroups.forEach((group) => {
    group.classList.remove("active");
  });

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
  }
}

if (menuToggle && navGroups.length) {
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const shouldOpen = !Array.from(navGroups).some((group) =>
      group.classList.contains("active")
    );

    navGroups.forEach((group) => {
      group.classList.toggle("active", shouldOpen);
    });

    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.textContent = shouldOpen ? "Close" : "Menu";
  });

  navGroups.forEach((group) => {
    group.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMobileMenu();
    }
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