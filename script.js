/* =========================================================
   JACOPO MESSINA — SITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     MOBILE MENU
     ========================================================= */

  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");

      hamburger.classList.toggle("is-open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute(
        "aria-label",
        isOpen ? "Chiudi menu" : "Apri menu"
      );
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Apri menu");
      });
    });
  }


  /* =========================================================
     AUDIO NAVIGATION TIMELINE
     ========================================================= */

  const clips = document.querySelectorAll(".timeline-clip");
  const playhead = document.querySelector(".timeline-playhead");
  const audioTimeline = document.querySelector(".audio-timeline");
  const siteHeader = document.querySelector(".site-header");


  /* ---------------------------------------------------------
     TIMELINE — VISIBILITY
     --------------------------------------------------------- */

  if (audioTimeline && siteHeader) {
    const updateTimelineVisibility = () => {
      const headerBottom = siteHeader.getBoundingClientRect().bottom;

      audioTimeline.classList.toggle(
        "is-visible",
        headerBottom <= 0
      );
    };

    window.addEventListener(
      "scroll",
      updateTimelineVisibility,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateTimelineVisibility
    );

    updateTimelineVisibility();
  }


  /* ---------------------------------------------------------
     TIMELINE — CURRENT SECTION
     --------------------------------------------------------- */

  if (clips.length) {
    const sectionMap = [];

    clips.forEach((clip) => {
      const targetId = clip.getAttribute("href");

      if (!targetId || !targetId.startsWith("#")) {
        return;
      }

      const section = document.querySelector(targetId);

      if (section) {
        sectionMap.push({
          clip,
          section
        });
      }
    });


    /* -------------------------------------------------------
       AGGIORNA SEZIONE ATTIVA + PLAYHEAD
       ------------------------------------------------------- */

    const updateCurrentClip = () => {
      if (!sectionMap.length) {
        return;
      }

      const marker = window.innerHeight * 0.30;
      let current = sectionMap[0];

      sectionMap.forEach((item) => {
        const rect = item.section.getBoundingClientRect();

        if (rect.top <= marker) {
          current = item;
        }
      });

      clips.forEach((clip) => {
        clip.classList.toggle("current", clip === current.clip);
      });

      if (playhead && audioTimeline) {
        const clipRect = current.clip.getBoundingClientRect();
        const timelineRect = audioTimeline.getBoundingClientRect();

        const clipCenter =
          clipRect.left + (clipRect.width / 2);

        const playheadPosition =
          clipCenter - timelineRect.left;

        playhead.style.left = `${playheadPosition}px`;
      }
    };


    /* -------------------------------------------------------
       SCROLL / RESIZE
       ------------------------------------------------------- */

    window.addEventListener(
      "scroll",
      updateCurrentClip,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateCurrentClip
    );

    updateCurrentClip();


    /* -------------------------------------------------------
       NAVIGAZIONE TIMELINE
       ------------------------------------------------------- */

    clips.forEach((clip) => {
      clip.addEventListener("click", (event) => {
        const targetId = clip.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        /*
         * L'header desktop è alto 50px.
         * Su mobile la timeline è nascosta e l'header è fixed:
         * usiamo quindi la sua altezza reale quando disponibile.
         */
        const headerHeight = siteHeader
          ? siteHeader.offsetHeight
          : 50;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: "smooth"
        });
      });
    });
  }


  /* =========================================================
     BACK TO TOP
     ========================================================= */

  const backToTop =
    document.querySelector(".audio-back-top");

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  /* =========================================================
     VERTICAL LEVEL SCROLLER
     ========================================================= */

  const scroller = document.querySelector(".level-scroller");
  const knob = document.querySelector(".level-knob");
  const track = document.querySelector(".level-track");

  if (scroller && knob && track) {

    /* -------------------------------------------------------
       UPDATE KNOB FROM PAGE SCROLL
       ------------------------------------------------------- */

    const updateKnob = () => {
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (maxScroll <= 0) {
        knob.style.top = "0px";
        return;
      }

      const scrollProgress = Math.min(
        1,
        Math.max(0, window.scrollY / maxScroll)
      );

      const maxKnobPosition =
        Math.max(0, track.clientHeight - knob.offsetHeight);

      /*
       * The knob is translated -50%, so the usable travel is
       * based on the track height minus the knob height.
       */
      knob.style.top =
        `${scrollProgress * maxKnobPosition}px`;
    };


    /* -------------------------------------------------------
       SCROLL / RESIZE
       ------------------------------------------------------- */

    window.addEventListener(
      "scroll",
      updateKnob,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateKnob
    );


    /* -------------------------------------------------------
       KNOB DRAGGING
       ------------------------------------------------------- */

    let dragging = false;

    const moveKnob = (clientY) => {
      const rect = track.getBoundingClientRect();

      if (rect.height <= 0) {
        return;
      }

      /*
       * Convert the pointer position into the centre position
       * of the knob, then clamp it to the usable track range.
       */
      const knobHeight = knob.offsetHeight;
      const maxPosition = Math.max(
        0,
        rect.height - knobHeight
      );

      let position =
        clientY - rect.top - (knobHeight / 2);

      position = Math.max(
        0,
        Math.min(position, maxPosition)
      );

      const progress =
        maxPosition > 0
          ? position / maxPosition
          : 0;

      const maxScroll =
        Math.max(
          0,
          document.documentElement.scrollHeight -
          window.innerHeight
        );

      window.scrollTo({
        top: progress * maxScroll,
        behavior: "auto"
      });
    };


    knob.addEventListener(
      "pointerdown",
      (event) => {
        dragging = true;

        if (knob.setPointerCapture) {
          knob.setPointerCapture(event.pointerId);
        }

        document.body.style.userSelect = "none";
        moveKnob(event.clientY);
        event.preventDefault();
      }
    );

    knob.addEventListener(
      "pointermove",
      (event) => {
        if (!dragging) {
          return;
        }

        moveKnob(event.clientY);
      }
    );

    const stopDragging = () => {
      dragging = false;
      document.body.style.userSelect = "";
    };

    knob.addEventListener("pointerup", stopDragging);
    knob.addEventListener("pointercancel", stopDragging);
    knob.addEventListener("lostpointercapture", stopDragging);


    /* -------------------------------------------------------
       CLICK ON TRACK → JUMP TO POSITION
       ------------------------------------------------------- */

    track.addEventListener(
      "pointerdown",
      (event) => {
        if (
          event.target === knob ||
          knob.contains(event.target)
        ) {
          return;
        }

        moveKnob(event.clientY);
      }
    );


    /* -------------------------------------------------------
       KEYBOARD CONTROL
       ------------------------------------------------------- */

    knob.addEventListener(
      "keydown",
      (event) => {
        const current = window.scrollY;
        const amount = window.innerHeight * 0.15;

        let target = null;

        switch (event.key) {
          case "ArrowUp":
            target = current - amount;
            break;

          case "ArrowDown":
            target = current + amount;
            break;

          case "Home":
            target = 0;
            break;

          case "End":
            target =
              document.documentElement.scrollHeight -
              window.innerHeight;
            break;

          default:
            return;
        }

        window.scrollTo({
          top: Math.max(0, target),
          behavior: "smooth"
        });

        event.preventDefault();
      }
    );


    /* -------------------------------------------------------
       INITIAL POSITION
       ------------------------------------------------------- */

    updateKnob();
  }


  /* =========================================================
     CONTACT FORM — EMAIL + WHATSAPP
     ========================================================= */

  const contactForm =
    document.getElementById("audio-contact-form");

  const whatsappSubmit =
    document.getElementById("whatsapp-submit");

  const nameField =
    document.getElementById("contact-name");

  const emailField =
    document.getElementById("contact-email");

  const subjectField =
    document.getElementById("contact-subject");

  const messageField =
    document.getElementById("contact-message");


  /* ---------------------------------------------------------
     EMAIL
     --------------------------------------------------------- */

  if (
    contactForm &&
    nameField &&
    emailField &&
    subjectField &&
    messageField
  ) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      /*
       * Let the browser perform its native HTML validation.
       */
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const subject = subjectField.value.trim();
      const message = messageField.value.trim();

      const finalSubject =
        subject || "Richiesta di contatto";

      const body =
        "Ciao Jacopo,\n\n" +
        message +
        "\n\n" +
        "--------------------------------\n" +
        "Nome: " + name + "\n" +
        "Email: " + email + "\n";

      const mailto =
        "mailto:jpmessina86@gmail.com" +
        "?subject=" +
        encodeURIComponent(finalSubject) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
    });
  }


  /* ---------------------------------------------------------
     WHATSAPP
     --------------------------------------------------------- */

  if (
    whatsappSubmit &&
    contactForm &&
    nameField &&
    emailField &&
    subjectField &&
    messageField
  ) {
    whatsappSubmit.addEventListener("click", () => {

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const subject = subjectField.value.trim();
      const message = messageField.value.trim();

      /*
       * Numero di Jacopo, mantenuto come nel file originale.
       */
      const phone = "393318792303";

      const whatsappMessage =
`Ciao Jacopo,

sono ${name}.

Email: ${email}

${subject ? "Oggetto: " + subject + "\n\n" : ""}Messaggio:
${message}`;

      const encodedMessage =
        encodeURIComponent(whatsappMessage);

      const whatsappURL =
        `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );
    });
  }

/* =========================================================
   BEHIND THE SCENES — LIGHTBOX GALLERY
========================================================= */

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
