const tabsBtn = document.querySelectorAll(".tabs-nav-btn");
const tabsItems = document.querySelectorAll(".tabs-item");

tabsBtn.forEach(function (item) {
  item.addEventListener("click", function () {
    let currentBtn = item;
    let tabId = currentBtn.getAttribute("data-tab");
    let currentTab = document.querySelector(tabId);

    tabsBtn.forEach(function (item) {
      item.classList.remove("active");
    });

    tabsItems.forEach(function (item) {
      item.classList.remove("active");
    });

    currentBtn.classList.add("active");
    currentTab.classList.add("active");
  });
});

const modalBtn = document.querySelector(".video-txt-btn");
const modalVideo = document.querySelector(".video-modal");
const closeBtn = document.querySelector(".close-modal");
const bgLayer = document.querySelector(".bg-layer");

modalBtn.addEventListener("click", () => {
  modalVideo.classList.add("show");
  bgLayer.classList.add("show");
  document.body.classList.add("is-showing-modal");
});

closeBtn.addEventListener("click", () => {
  modalVideo.classList.remove("show");
  bgLayer.classList.remove("show");
  document.body.classList.remove("is-showing-modal");
});

const details = document.querySelectorAll("details");

details.forEach((targetDetail) => {
  targetDetail.addEventListener("click", () => {
    details.forEach((detail) => {
      if (detail !== targetDetail) {
        detail.removeAttribute("open");
      }
    });
  });
});

$(document).ready(function () {
  $(".search-btn").on("click", function () {
    $(".input").toggleClass("inclicked");
    $(".search-btn").toggleClass("close");
  });

  $(".carusel-area").slick({
    autoplay: true,
    speed: 800,
    dots: true,
    fade: true,
    arrows: true,
    dotsClass: "dots-style",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          settings: "unslick",
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 577,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          settings: "unslick",
          infinite: false,
          dots: false,
        },
      },
    ],
  });

  $(".recent-post-slider").slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    // responsive: [
    //   {
    //     breakpoint: 769,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2,
    //       infinite: false,
    //       dots: false,
    //     },
    //   },
    // ],
  });
});

//burger

const mobileMenu = document.querySelector(".menu-icon");

if (mobileMenu) {
  const navbarMenu = document.querySelector(".navbar");
  const navbarBg = document.querySelector(".mobile-menu-bg");
  mobileMenu.addEventListener("click", function (e) {
    mobileMenu.classList.toggle("active-menu");
    navbarMenu.classList.toggle("active-menu");
    navbarBg.classList.toggle("active-menu");
    document.body.classList.toggle("is-showing-modal");
  });
}
