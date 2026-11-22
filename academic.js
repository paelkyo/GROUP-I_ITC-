// ===== MOVING TAB =====
var links = document.querySelectorAll(".tabs a");
var pill = document.querySelector(".pill");
var active = document.querySelector(".tabs a.active");

// put the pill behind a link
function movePill(link) {
  pill.style.left = link.offsetLeft + "px";
  pill.style.width = link.offsetWidth + "px";
}

movePill(active);   // start behind "Home"

// when a link is clicked, make it the active one
links.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    active.classList.remove("active");
    link.classList.add("active");
    active = link;
    movePill(link);

    // show the page of the clicked tab (Home or Academics)
    var page = link.getAttribute("data-page");
    if (page) {
      document.querySelectorAll(".page").forEach(function (p) {
        p.classList.remove("show");
      });
      document.getElementById(page).classList.add("show");
      window.scrollTo(0, 0);
    }
  });
});

// ===== DARK / LIGHT MODE =====
var button = document.getElementById("theme-toggle");

button.addEventListener("click", function () {
  document.body.classList.toggle("dark");   // add or remove the "dark" class

  // update the button's label for screen readers
  if (document.body.classList.contains("dark")) {
    button.setAttribute("aria-label", "Switch to light mode");
  } else {
    button.setAttribute("aria-label", "Switch to dark mode");
  }
});

var exploreBtn = document.getElementById("explore-btn");
var academicsTab = document.querySelector('.tabs a[data-page="academics"]');

exploreBtn.addEventListener("click", function (e) {
  e.preventDefault();
  academicsTab.click();   // same as clicking the Academics tab: pill moves + page changes
});