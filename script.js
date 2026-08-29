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
  document.querySelector(".audio-back-top");


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

/* =========================================================
   VERTICAL LEVEL SCROLLER
   ========================================================= */

(function () {

  const scroller = document.querySelector('.level-scroller');
  const knob = document.querySelector('.level-knob');
  const track = document.querySelector('.level-track');

  if (!scroller || !knob || !track) return;


  /* -------------------------------------------------------
     UPDATE KNOB FROM PAGE SCROLL
     ------------------------------------------------------- */

  function updateKnob() {

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (maxScroll <= 0) return;

    const scrollProgress =
      window.scrollY / maxScroll;

const maxKnobPosition =
  track.clientHeight - knob.offsetHeight;

knob.style.top =
  (scrollProgress * maxKnobPosition) + 'px';
  }


  /* -------------------------------------------------------
     SCROLL → KNOB
     ------------------------------------------------------- */

  window.addEventListener(
    'scroll',
    updateKnob,
    { passive: true }
  );


  window.addEventListener(
    'resize',
    updateKnob
  );


  /* -------------------------------------------------------
     KNOB DRAGGING
     ------------------------------------------------------- */

  let dragging = false;


  function moveKnob(clientY) {

    const rect = track.getBoundingClientRect();

    let position =
      clientY - rect.top;

    position = Math.max(
      0,
      Math.min(position, rect.height)
    );


    const progress =
      position / rect.height;


    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;


    window.scrollTo({
      top: progress * maxScroll,
      behavior: 'auto'
    });
  }


  knob.addEventListener(
    'pointerdown',
    function (event) {

      dragging = true;

      knob.setPointerCapture(event.pointerId);

      document.body.style.userSelect = 'none';

      moveKnob(event.clientY);

      event.preventDefault();
    }
  );


  knob.addEventListener(
    'pointermove',
    function (event) {

      if (!dragging) return;

      moveKnob(event.clientY);
    }
  );


  knob.addEventListener(
    'pointerup',
    function () {

      dragging = false;

      document.body.style.userSelect = '';
    }
  );


  knob.addEventListener(
    'pointercancel',
    function () {

      dragging = false;

      document.body.style.userSelect = '';
    }
  );


  /* -------------------------------------------------------
     CLICK ON TRACK → JUMP TO POSITION
     ------------------------------------------------------- */

  track.addEventListener(
    'pointerdown',
    function (event) {

      if (event.target === knob ||
          knob.contains(event.target)) {
        return;
      }

      moveKnob(event.clientY);
    }
  );


  /* -------------------------------------------------------
     KEYBOARD CONTROL
     ------------------------------------------------------- */

  knob.addEventListener(
    'keydown',
    function (event) {

      const current =
        window.scrollY;

      const amount =
        window.innerHeight * 0.15;


      if (event.key === 'ArrowUp') {

        window.scrollTo({
          top: current - amount,
          behavior: 'smooth'
        });

        event.preventDefault();
      }


      if (event.key === 'ArrowDown') {

        window.scrollTo({
          top: current + amount,
          behavior: 'smooth'
        });

        event.preventDefault();
      }


      if (event.key === 'Home') {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        event.preventDefault();
      }


      if (event.key === 'End') {

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });

        event.preventDefault();
      }

    }
  );


  /* -------------------------------------------------------
     INITIAL POSITION
     ------------------------------------------------------- */

   updateKnob();

})();

});

/* =========================================================
   CONTACT FORM — MAIL CLIENT
   ========================================================= */

const contactForm = document.getElementById("audio-contact-form");

if (contactForm) {

  contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    /*
     * Se l'utente non inserisce un oggetto,
     * ne utilizziamo uno predefinito.
     */
    const finalSubject = subject || "Richiesta di contatto";

    /*
     * Corpo della mail
     */
    const body =
      "Ciao Jacopo,\n\n" +
      message +
      "\n\n" +
      "--------------------------------\n" +
      "Nome: " + name + "\n" +
      "Email: " + email + "\n";

    /*
     * Crea il collegamento mailto
     */
    const mailto =
      "mailto:jpmessina86@gmail.com" +
      "?subject=" + encodeURIComponent(finalSubject) +
      "&body=" + encodeURIComponent(body);

    /*
     * Apre il programma email predefinito
     */
    window.location.href = mailto;

  });

}
