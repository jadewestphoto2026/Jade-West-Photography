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

document.querySelectorAll(".shoot-stack").forEach((stack, stackIndex) => {
  const gallery = stack.querySelector(".shoot-stack-gallery");
  const grid = stack.parentElement;
  const stackId = `shoot-${stackIndex}`;

  stack.dataset.shootStackId = stackId;

  function returnPhotosToStack() {
    if (!gallery || !grid) {
      return;
    }

    grid.querySelectorAll(`[data-shoot-owner="${stackId}"]`).forEach((item) => {
      const image = item.querySelector("img");

      if (image) {
        gallery.appendChild(image);
      }

      item.remove();
    });

  }

  function flowPhotosIntoGrid() {
    if (!gallery || !grid) {
      return;
    }

    let insertionPoint = stack;

    Array.from(gallery.children).forEach((image, imageIndex) => {
      const item = document.createElement("figure");
      item.className = "shoot-stack-expanded-item";
      item.dataset.shootOwner = stackId;
      item.style.setProperty("--shoot-item-index", imageIndex);
      item.appendChild(image);
      insertionPoint.insertAdjacentElement("afterend", item);
      insertionPoint = item;
    });

  }

  stack.addEventListener("toggle", () => {
    if (!stack.open) {
      returnPhotosToStack();
      return;
    }

    grid.querySelectorAll(".shoot-stack[open]").forEach((otherStack) => {
      if (otherStack !== stack) {
        otherStack.open = false;
      }
    });

    flowPhotosIntoGrid();
  });
});

const contactForm = document.querySelector(".contact-form");
const contactFormStatus = document.querySelector(".contact-form-success");

if (contactForm && contactFormStatus && contactForm.dataset.ajaxEndpoint) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : "";
    const formData = Object.fromEntries(new FormData(contactForm).entries());

    contactFormStatus.classList.remove("is-visible", "is-error");
    contactForm.setAttribute("aria-busy", "true");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
    }

    try {
      const response = await fetch(contactForm.dataset.ajaxEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      const rejected = result.success === false || result.success === "false";

      if (!response.ok || rejected) {
        throw new Error(result.message || "Unable to send inquiry");
      }

      if (contactForm.dataset.sheetEndpoint) {
        const sheetData = new URLSearchParams();

        Object.entries(formData).forEach(([key, value]) => {
          sheetData.append(key, value);
        });

        try {
          await fetch(contactForm.dataset.sheetEndpoint, {
            method: "POST",
            mode: "no-cors",
            body: sheetData,
          });
        } catch (sheetError) {
          console.warn("The inquiry email was sent, but the inquiry log could not be updated.", sheetError);
        }
      }

      contactForm.reset();
      contactFormStatus.textContent =
        "Thank you! Your inquiry is on its way. I’ll be in touch soon.";
      contactFormStatus.classList.add("is-visible");
    } catch (error) {
      contactFormStatus.textContent =
        "Something went wrong while sending your inquiry. Please try again or email me directly at jadewestphoto@gmail.com.";
      contactFormStatus.classList.add("is-visible", "is-error");
    } finally {
      contactForm.removeAttribute("aria-busy");

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }

      contactFormStatus.focus();
    }
  });
}
