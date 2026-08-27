/* =========================================================
   JACOPO MESSINA — SITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */

  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {

    hamburger.addEventListener("click", () => {

      const isOpen = mobileMenu.classList.toggle("is-open");

      hamburger.classList.toggle("is-open", isOpen);

      hamburger.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      hamburger.setAttribute(
        "aria-label",
        isOpen ? "Chiudi menu" : "Apri menu"
      );

    });


    mobileMenu.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        mobileMenu.classList.remove("is-open");
        hamburger.classList.remove("is-open");

        hamburger.setAttribute(
          "aria-expanded",
          "false"
        );

        hamburger.setAttribute(
          "aria-label",
          "Apri menu"
        );

      });

    });

  }


  /* ---------------------------------------------------------
     AUDIO NAVIGATION TIMELINE
     --------------------------------------------------------- */

  const clips =
    document.querySelectorAll(".timeline-clip");

  const playhead =
    document.querySelector(".timeline-playhead");

  const audioTimeline =
    document.querySelector(".audio-timeline");

  const siteHeader =
    document.querySelector(".site-header");


  /* ---------------------------------------------------------
     TIMELINE — VISIBILITY
     --------------------------------------------------------- */

  if (audioTimeline && siteHeader) {

    const updateTimelineVisibility = () => {

      const headerBottom =
        siteHeader.getBoundingClientRect().bottom;

      if (headerBottom <= 0) {

        audioTimeline.classList.add("is-visible");

      } else {

        audioTimeline.classList.remove("is-visible");

      }

    };


    window.addEventListener(
      "scroll",
      updateTimelineVisibility,
      {
        passive: true
      }
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


    clips.forEach(clip => {

      const targetId =
        clip.getAttribute("href");

      if (
        !targetId ||
        !targetId.startsWith("#")
      ) {
        return;
      }


      const section =
        document.querySelector(targetId);


      if (section) {

        sectionMap.push({
          clip: clip,
          section: section
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

  sectionMap.forEach(item => {

    const rect =
      item.section.getBoundingClientRect();

    if (rect.top <= marker) {
      current = item;
    }

  });

  clips.forEach(clip => {
    clip.classList.remove("current");
  });

  current.clip.classList.add("current");

  if (
    playhead &&
    audioTimeline
  ) {

    const clipRect =
      current.clip.getBoundingClientRect();

    const timelineRect =
      audioTimeline.getBoundingClientRect();

    const clipCenter =
      clipRect.left +
      (clipRect.width / 2);

    const playheadPosition =
      clipCenter -
      timelineRect.left;

    playhead.style.left =
      `${playheadPosition}px`;

  }

};


    /* -------------------------------------------------------
       SCROLL
       ------------------------------------------------------- */

    window.addEventListener(
      "scroll",
      updateCurrentClip,
      {
        passive: true
      }
    );


    /* -------------------------------------------------------
       RESIZE
       ------------------------------------------------------- */

    window.addEventListener(
      "resize",
      updateCurrentClip
    );


    /* -------------------------------------------------------
       PRIMA INIZIALIZZAZIONE
       ------------------------------------------------------- */

    updateCurrentClip();


    /* -------------------------------------------------------
       NAVIGAZIONE TIMELINE
       ------------------------------------------------------- */

    clips.forEach(clip => {

      clip.addEventListener("click", event => {

        const targetId =
          clip.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(targetId);


        if (!target) {
          return;
        }


        event.preventDefault();


        /* Altezza header */

        const headerHeight = 50;


        /* Posizione destinazione */

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;


        /* Scroll morbido */

        window.scrollTo({

          top: Math.max(
            0,
            targetPosition
          ),

          behavior: "smooth"

        });

      });

    });

  }


  /* ---------------------------------------------------------
     BACK TO TOP
     --------------------------------------------------------- */

  const backToTop =
    document.querySelector(".back-to-top");


  if (backToTop) {

    backToTop.addEventListener(
      "click",
      event => {

        event.preventDefault();


        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }
    );

  }

});
