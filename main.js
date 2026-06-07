// ===== Mobile Menu (Safe Version) =====
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector('#menu-icon');
  const navbar = document.querySelector('.navbar');

  if (menu && navbar) {
    menu.onclick = () => {
      menu.classList.toggle('bx-x');
      navbar.classList.toggle('active');
    };

    window.addEventListener('scroll', () => {
      menu.classList.remove('bx-x');
      navbar.classList.remove('active');
    });
  }
});


// ===== Scroll Reveal Animation (Upgraded Version) ===== //
const sr = ScrollReveal({
  distance: '50px',
  duration: 800,
  easing: 'ease-out',
  reset: false, 
  viewFactor: 0.1 
});

// Upgraded reveals with staggered delays and refined origins
sr.reveal('.text', { delay: 100, origin: 'top' });
sr.reveal('.home-text', { delay: 300, origin: 'bottom' });
sr.reveal('.heading', { delay: 400, origin: 'bottom' });
sr.reveal('.ride-container .box', { delay: 200, origin: 'bottom', interval: 150 }); // Staggered for boxes
sr.reveal('.services-container .box', { delay: 250, origin: 'bottom', interval: 150 });
sr.reveal('.about-container', { delay: 350, origin: 'left' }); // Changed to left for variety
sr.reveal('.reviews', { delay: 400, origin: 'bottom' });
sr.reveal('.newsletter', { delay: 500, origin: 'right' });
sr.reveal('.trust-heading', { delay: 450, origin: 'bottom' });
sr.reveal('.footer .box', { delay: 300, origin: 'right', interval: 200 });    

// ===== Modal + Lead Form Functionality (EmailJS Version) =====
document.addEventListener("DOMContentLoaded", () => {
  // ✅ Initialize EmailJS
  emailjs.init("_0eZp1hDuK5hhUGB9"); // Your Public Key

  // Elements
  const modalOverlay = document.getElementById("modal");
  const skillInput = document.getElementById("skillInput");
  const cancelModal = document.getElementById("cancelModal");
  const leadForm = document.getElementById("leadForm");
  const successBox = document.getElementById("successBox");

const burger = document.getElementById('burgerMenu');
const navbar = document.getElementById('navbar');

function toggleMenu(state) {
  burger.classList.toggle('active', state);
  navbar.classList.toggle('active', state);
  document.body.classList.toggle('menu-open', state);
}

burger.addEventListener('click', () => {
  const isActive = burger.classList.contains('active');
  toggleMenu(!isActive);
});

// Close when clicking a link
navbar.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close when clicking outside menu
document.addEventListener('click', (e) => {
  const clickedInsideMenu = navbar.contains(e.target) || burger.contains(e.target);
  if (!clickedInsideMenu && navbar.classList.contains('active')) {
    toggleMenu(false);
  }
});



  // === Show modal when "Claim Free eBook" clicked ===
  document.querySelectorAll(".btn[data-action='select']").forEach(btn => {
    btn.addEventListener("click", () => {
      const skill = btn.dataset.skill;
      skillInput.value = skill;
      modalOverlay.classList.add("active");
      leadForm.style.display = "block";
      successBox.style.display = "none";
    });
  });

  // === Close modal on Cancel or background click ===
  cancelModal.addEventListener("click", () => modalOverlay.classList.remove("active"));
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove("active");
  });

  // === Handle Form Submission (EmailJS) ===
  leadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const ebook = skillInput.value.trim();

    if (!name || !email) {
      alert("Please fill in your name and email.");
      return;
    }

    // Optional placeholder links (replace later with your real eBook URLs)
    const ebookLinks = {
      "Digital Marketing": "https://example.com/digital-marketing.pdf",
      "Web Development": "https://example.com/web-development.pdf",
      "Graphic Design": "https://example.com/graphic-design.pdf",
      "Academic Writing": "https://example.com/academic-writing.pdf"
    };

    const ebook_link = ebookLinks[ebook] || ebookLinks["Digital Marketing"];

    try {
      // ✅ Send email via EmailJS
      const result = await emailjs.send("service_1mxwm31", "template_6hujzum", {
        name: name,
        email: email,
        ebook: ebook,
        ebook_link: ebook_link
      });

      console.log("EmailJS response:", result);
      leadForm.style.display = "none";
      successBox.style.display = "block";

    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Network or EmailJS error. Please try again.");
    }
  });
});
// ===== End of File =====
