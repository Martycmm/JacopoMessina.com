/* =========================================================
   BEHIND THE SCENES — LIGHTBOX GALLERY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const items = document.querySelectorAll(".bts-item img");
  const lightbox = document.getElementById("bts-lightbox");
  const lightboxImage = document.getElementById("bts-lightbox-image");
  const counter = document.getElementById("bts-counter");

  const closeButton = document.querySelector(".bts-close");
  const prevButton = document.querySelector(".bts-prev");
  const nextButton = document.querySelector(".bts-next");

  let currentIndex = 0;


  /* -------------------------------------------------------
     CONTROLLO
  ------------------------------------------------------- */

  if (
    !items.length ||
    !lightbox ||
    !lightboxImage ||
    !counter ||
    !closeButton ||
    !prevButton ||
    !nextButton
  ) {
    console.warn("BTS Lightbox: elementi mancanti nell'HTML.");
    return;
  }


  /* -------------------------------------------------------
     APRI LIGHTBOX
  ------------------------------------------------------- */

  function openLightbox(index) {

    currentIndex = index;

    const image = items[currentIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    counter.textContent =
      (currentIndex + 1) + " / " + items.length;

    lightbox.classList.add("is-open");

    document.body.style.overflow = "hidden";
  }


  /* -------------------------------------------------------
     CHIUDI LIGHTBOX
  ------------------------------------------------------- */

  function closeLightbox() {

    lightbox.classList.remove("is-open");

    document.body.style.overflow = "";

    lightboxImage.src = "";
    lightboxImage.alt = "";
  }


  /* -------------------------------------------------------
     IMMAGINE PRECEDENTE
  ------------------------------------------------------- */

  function showPrevious() {

    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = items.length - 1;
    }

    updateImage();
  }


  /* -------------------------------------------------------
     IMMAGINE SUCCESSIVA
  ------------------------------------------------------- */

  function showNext() {

    currentIndex++;

    if (currentIndex >= items.length) {
      currentIndex = 0;
    }

    updateImage();
  }


  /* -------------------------------------------------------
     AGGIORNA IMMAGINE
  ------------------------------------------------------- */

  function updateImage() {

    const image = items[currentIndex];

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;

    counter.textContent =
      (currentIndex + 1) + " / " + items.length;
  }


  /* -------------------------------------------------------
     CLICK SULLE IMMAGINI
  ------------------------------------------------------- */

  items.forEach(function (image, index) {

    image.addEventListener("click", function () {
      openLightbox(index);
    });

  });


  /* -------------------------------------------------------
     PULSANTI
  ------------------------------------------------------- */

  closeButton.addEventListener("click", function (event) {
    event.stopPropagation();
    closeLightbox();
  });

  prevButton.addEventListener("click", function (event) {
    event.stopPropagation();
    showPrevious();
  });

  nextButton.addEventListener("click", function (event) {
    event.stopPropagation();
    showNext();
  });


  /* -------------------------------------------------------
     CLICK SULLO SFONDO
  ------------------------------------------------------- */

  lightbox.addEventListener("click", function (event) {

    if (event.target === lightbox) {
      closeLightbox();
    }

  });


  /* -------------------------------------------------------
     TASTIERA
  ------------------------------------------------------- */

  document.addEventListener("keydown", function (event) {

    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }

  });

});
