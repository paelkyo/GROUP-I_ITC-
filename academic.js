// ===== MOVING TAB WITH STRETCH =====
var links = document.querySelectorAll(".tabs a");
var pill = document.querySelector(".pill");
var active = document.querySelector(".tabs a.active");
var curtain = document.getElementById("page-curtain");

function movePill(link) {
  pill.classList.add("stretching");
  pill.style.left = link.offsetLeft + "px";
  pill.style.width = link.offsetWidth + "px";

  clearTimeout(movePill._t);
  movePill._t = setTimeout(function () {
    pill.classList.remove("stretching");
  }, 320);
}

movePill(active);

window.addEventListener("resize", function () {
  movePill(active);
});

function triggerCurtain() {
  if (!curtain) return;
  curtain.classList.remove("active");
  void curtain.offsetWidth;
  curtain.classList.add("active");
}

// ===== SCROLL REVEAL (BLOCKS + STAGGERED CARDS) =====
function setupReveals() {
  var blocks = document.querySelectorAll(".reveal-block");
  var cards = document.querySelectorAll(".card");

  cards.forEach(function (card, idx) {
    card.classList.add("reveal-block");
    card.style.transitionDelay = ((idx % 4) * 0.09) + "s";
  });

  var allTargets = document.querySelectorAll(".reveal-block");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.1 });

    allTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    allTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
}

setupReveals();

// ===== TAB NAVIGATION =====
links.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    if (link === active) return;

    active.classList.remove("active");
    link.classList.add("active");
    active = link;
    movePill(link);
    triggerCurtain();

    var page = link.getAttribute("data-page");
    if (page) {
      setTimeout(function () {
        document.querySelectorAll(".page").forEach(function (p) {
          p.classList.remove("show");
        });
        var nextPage = document.getElementById(page);
        nextPage.classList.add("show");
        window.scrollTo({ top: 0, behavior: "instant" });

        nextPage.querySelectorAll(".reveal-block").forEach(function (el) {
          el.classList.remove("is-visible");
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.96) {
            requestAnimationFrame(function () {
              el.classList.add("is-visible");
            });
          }
        });
      }, 220);
    }
  });
});

// ===== 3D CARD TILT + POINTER GLOW =====
document.querySelectorAll(".tilt-card").forEach(function (card) {
  card.addEventListener("mousemove", function (e) {
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;

    var rotateY = ((x - centerX) / centerX) * 6;
    var rotateX = ((centerY - y) / centerY) * 6;

    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");
    card.style.setProperty("--rx", rotateX.toFixed(2) + "deg");
    card.style.setProperty("--ry", rotateY.toFixed(2) + "deg");
    card.style.transform =
      "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-6px)";
  });

  card.addEventListener("mouseleave", function () {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

// ===== SCROLL PROGRESS, NAVBAR SHADOW & HERO PARALLAX =====
var navbar = document.querySelector("nav");
var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateScrollEffects() {
  var scrollTop = window.scrollY;
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

  document.body.style.setProperty("--scroll-progress", progress + "%");

  if (scrollTop > 15) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  if (!prefersReducedMotion) {
    var shift = Math.min(75, scrollTop * 0.22);
    document.body.style.setProperty("--hero-shift", shift + "px");
  }
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects, { passive: true });
updateScrollEffects();

// ===== DARK / LIGHT MODE =====
var button = document.getElementById("theme-toggle");

button.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    button.setAttribute("aria-label", "Switch to light mode");
  } else {
    button.setAttribute("aria-label", "Switch to dark mode");
  }
});

// ===== EXPLORE BUTTON -> ACADEMICS =====
var exploreBtn = document.getElementById("explore-btn");
var academicsTab = document.querySelector('.tabs a[data-page="academics"]');

if (exploreBtn && academicsTab) {
  exploreBtn.addEventListener("click", function (e) {
    e.preventDefault();
    academicsTab.click();
  });
}

// ===== CONTACT FORM CONFIRMATION =====
var contactForm = document.getElementById("contact-form");
var formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    formStatus.classList.remove("show");
    void formStatus.offsetWidth;
    formStatus.classList.add("show");
    contactForm.reset();
  });
}
