const menuToggle = document.getElementById("menuToggle");
const navGroups = document.querySelectorAll(".nav-left, .nav-right");
const beeCursor = document.getElementById("bee-cursor");

if (menuToggle && navGroups.length) {
  menuToggle.addEventListener("click", () => {
    navGroups.forEach((group) => {
      group.classList.toggle("active");
    });
  });

  navGroups.forEach((group) => {
    group.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navGroups.forEach((item) => {
          item.classList.remove("active");
        });
      });
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