/* =========================================================
   JACOPO MESSINA — SITE SCRIPT
   Complete / stable version
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     UTILITIES
     ======================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));


  /* =======================================================
     HEADER / MOBILE MENU
     ======================================================= */

  const hamburger = $(".hamburger");
  const mobileMenu = $("#mobile-menu");

  if (hamburger && mobileMenu) {

    const openMenu = () => {
      mobileMenu.classList.add("is-open");
      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute("aria-label", "Chiudi menu");
      document.body.classList.add("menu-open");
    };

    const closeMenu = () => {
      mobileMenu.classList.remove("is-open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Apri menu");
      document.body.classList.remove("menu-open");
    };

    const toggleMenu = () => {
      if (mobileMenu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    hamburger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    });

    /* Chiudi cliccando un link */
    $$(".mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    /* Chiudi cliccando fuori */
    document.addEventListener("click", (event) => {

      if (!mobileMenu.classList.contains("is-open")) {
        return;
      }

      if (
        !mobileMenu.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        closeMenu();
      }
    });

    /* ESC */
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    /* Se torniamo desktop, reset */
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) {
        closeMenu();
      }
    });
  }


  /* =======================================================
     SMOOTH ANCHOR SCROLL
     ======================================================= */

  const header = $(".site-header");

  $$('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const href = link.getAttribute("href");

      if (
        !href ||
        href === "#" ||
        href === "#top"
      ) {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight =
        header && getComputedStyle(header).position === "fixed"
          ? header.offsetHeight
          : 0;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth"
      });
    });

  });


  /* =======================================================
     BACK TO TOP
     ======================================================= */

  const backTop = $(".audio-back-top");

  if (backTop) {

    backTop.addEventListener("click", (event) => {

      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }


  /* =======================================================
     BTS LIGHTBOX
     ======================================================= */

  /*
     L'HTML attuale usa checkbox + label.
     Non modifichiamo quella struttura.

     Questo JS aggiunge:
     - apertura/chiusura affidabile
     - ESC
     - blocco scroll del body
     - navigazione precedente/successiva
     - click sullo sfondo per chiudere
  */

  const btsToggles = $$(".lightbox-toggle");

  if (btsToggles.length) {

    const btsCards = [];
    const btsLightboxes = [];

    btsToggles.forEach((toggle) => {

      const id = toggle.id;

      const card = document.querySelector(
        `label[for="${id}"].card`
      );

      /*
         Il lightbox associato viene cercato
         immediatamente dopo il checkbox.
      */
      let lightbox = toggle.nextElementSibling;

      if (
        lightbox &&
        lightbox.classList.contains("lightbox")
      ) {
        btsLightboxes.push(lightbox);
      } else {
        lightbox = null;
      }

      if (card && lightbox) {

        const image = $("img", lightbox);

        btsCards.push({
          toggle,
          card,
          lightbox,
          image
        });
      }

    });


    let currentBtsIndex = -1;


    const closeAllBts = () => {

      btsCards.forEach((item) => {
        item.toggle.checked = false;
        item.lightbox.classList.remove("is-open");
      });

      document.body.classList.remove("lightbox-open");

      currentBtsIndex = -1;
    };


    const openBts = (index) => {

      if (
        index < 0 ||
        index >= btsCards.length
      ) {
        return;
      }

      closeAllBts();

      const item = btsCards[index];

      item.toggle.checked = true;
      item.lightbox.classList.add("is-open");

      document.body.classList.add("lightbox-open");

      currentBtsIndex = index;

      /*
         Manteniamo il focus fuori dal documento
         quando possibile.
      */
      requestAnimationFrame(() => {

        const closeButton =
          $(".lightbox-close", item.lightbox);

        if (closeButton) {
          closeButton.focus({ preventScroll: true });
        }

      });

    };


    const nextBts = () => {

      if (!btsCards.length) {
        return;
      }

      const next =
        currentBtsIndex < btsCards.length - 1
          ? currentBtsIndex + 1
          : 0;

      openBts(next);
    };


    const previousBts = () => {

      if (!btsCards.length) {
        return;
      }

      const previous =
        currentBtsIndex > 0
          ? currentBtsIndex - 1
          : btsCards.length - 1;

      openBts(previous);
    };


    /*
       Apertura cliccando sulle immagini.
    */
    btsCards.forEach((item, index) => {

      item.card.addEventListener("click", (event) => {

        event.preventDefault();

        openBts(index);

      });


      /*
         Chiudi.
      */
      const closeButton =
        $(".lightbox-close", item.lightbox);

      if (closeButton) {

        closeButton.addEventListener("click", (event) => {

          event.preventDefault();
          event.stopPropagation();

          closeAllBts();

        });

      }


      /*
         Click sul background.
      */
      const background =
        $(".lightbox-background", item.lightbox);

      if (background) {

        background.addEventListener("click", (event) => {

          event.preventDefault();

          closeAllBts();

        });

      }

    });


    /*
       Tastiera.
    */
    document.addEventListener("keydown", (event) => {

      if (currentBtsIndex === -1) {
        return;
      }

      switch (event.key) {

        case "Escape":
          closeAllBts();
          break;

        case "ArrowRight":
          event.preventDefault();
          nextBts();
          break;

        case "ArrowLeft":
          event.preventDefault();
          previousBts();
          break;

      }

    });


    /*
       Supporto swipe touch.
    */
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", (event) => {

      if (currentBtsIndex === -1) {
        return;
      }

      if (!event.touches.length) {
        return;
      }

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;

    }, {
      passive: true
    });


    document.addEventListener("touchend", (event) => {

      if (currentBtsIndex === -1) {
        return;
      }

      if (!event.changedTouches.length) {
        return;
      }

      const endX =
        event.changedTouches[0].clientX;

      const endY =
        event.changedTouches[0].clientY;

      const dx = endX - touchStartX;
      const dy = endY - touchStartY;

      /*
         Consideriamo swipe solo se
         prevalentemente orizzontale.
      */
      if (
        Math.abs(dx) > 50 &&
        Math.abs(dx) > Math.abs(dy)
      ) {

        if (dx < 0) {
          nextBts();
        } else {
          previousBts();
        }

      }

    }, {
      passive: true
    });

  }


  /* =======================================================
     AUDIO TIMELINE
     ======================================================= */

  const audioTimeline = $(".audio-timeline");
  const timelineBody = $(".timeline-body");
  const timelineClips = $$(".timeline-clip");

  if (
    audioTimeline &&
    timelineBody &&
    timelineClips.length
  ) {

    /*
       Sezioni associate ai clip.
    */
    const sections = timelineClips
      .map((clip) => {

        const href = clip.getAttribute("href");

        if (!href || !href.startsWith("#")) {
          return null;
        }

        const section = document.querySelector(href);

        if (!section) {
          return null;
        }

        return {
          clip,
          section
        };

      })
      .filter(Boolean);


    /*
       Playhead.
    */
    let playhead =
      $(".timeline-playhead", audioTimeline);

    if (!playhead) {

      playhead =
        document.createElement("div");

      playhead.className =
        "timeline-playhead";

      playhead.setAttribute(
        "aria-hidden",
        "true"
      );

      const marker =
        document.createElement("span");

      marker.className =
        "playhead-marker";

      playhead.appendChild(marker);

      timelineBody.appendChild(playhead);

    }


    /*
       Aggiorna posizione playhead.
       Il playhead segue la sezione attiva.
    */
    const updatePlayhead = (index) => {

      if (
        index < 0 ||
        index >= timelineClips.length
      ) {
        return;
      }

      const clip =
        timelineClips[index];

      const bodyRect =
        timelineBody.getBoundingClientRect();

      const clipRect =
        clip.getBoundingClientRect();

      const left =
        clipRect.left -
        bodyRect.left;

      playhead.style.left =
        `${Math.max(0, left)}px`;

    };


    /*
       Determina la sezione attualmente visibile.
       Usa una soglia nella parte alta dello schermo
       invece di controllare solamente scrollY.
    */
    const updateCurrentClip = () => {

      if (!sections.length) {
        return;
      }

      const viewportHeight =
        window.innerHeight;

      const activationPoint =
        viewportHeight * 0.30;

      let activeIndex = 0;

      sections.forEach((item, index) => {

        const rect =
          item.section.getBoundingClientRect();

        if (rect.top <= activationPoint) {
          activeIndex = index;
        }

      });


      timelineClips.forEach((clip, index) => {

        clip.classList.toggle(
          "current",
          index === activeIndex
        );

      });


      updatePlayhead(activeIndex);

    };


    /*
       Timeline visibile dopo una certa quantità
       di scroll.
    */
    const updateTimelineVisibility = () => {

      /*
         Su mobile il CSS la nasconde.
         Non facciamo nulla in quel caso.
      */
      if (window.innerWidth <= 700) {
        audioTimeline.classList.remove("is-visible");
        return;
      }

      const threshold = 80;

      if (window.scrollY > threshold) {

        audioTimeline.classList.add(
          "is-visible"
        );

      } else {

        audioTimeline.classList.remove(
          "is-visible"
        );

      }

    };


    /*
       Click sui clip.
       Lo scroll viene gestito qui per avere
       lo stesso comportamento del resto del sito.
    */
    timelineClips.forEach((clip, index) => {

      clip.addEventListener("click", (event) => {

        const href =
          clip.getAttribute("href");

        if (
          !href ||
          !href.startsWith("#")
        ) {
          return;
        }

        const target =
          document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();

        const headerHeight =
          header &&
          getComputedStyle(header).position === "fixed"
            ? header.offsetHeight
            : 0;

        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: "smooth"
        });

        timelineClips.forEach((item) => {
          item.classList.remove("current");
        });

        clip.classList.add("current");

        updatePlayhead(index);

      });

    });


    /*
       Scroll performance:
       requestAnimationFrame evita una quantità
       eccessiva di ricalcoli durante lo scroll.
    */
    let timelineFrame = null;

    const handleTimelineScroll = () => {

      if (timelineFrame !== null) {
        return;
      }

      timelineFrame =
        requestAnimationFrame(() => {

          updateTimelineVisibility();
          updateCurrentClip();

          timelineFrame = null;

        });

    };


    window.addEventListener(
      "scroll",
      handleTimelineScroll,
      { passive: true }
    );


    window.addEventListener(
      "resize",
      () => {

        updateTimelineVisibility();
        updateCurrentClip();

      },
      { passive: true }
    );


    updateTimelineVisibility();
    updateCurrentClip();

  }


  /* =======================================================
     LEVEL SCROLLER
     ======================================================= */

  const levelScroller = $(".level-scroller");
  const levelTrack = $(".level-track");
  const levelKnob = $(".level-knob");

  /*
     IMPORTANTE:
     il controllo viene disabilitato dal CSS
     tra 701 e 1010px e sotto i 700px.
     Il JS quindi non forza la sua visualizzazione.
  */

  if (
    levelScroller &&
    levelTrack &&
    levelKnob
  ) {

    let dragging = false;

    /*
       Evitiamo che il browser tenti di fare
       selezione testo / drag nativo.
    */
    levelKnob.addEventListener(
      "dragstart",
      (event) => {
        event.preventDefault();
      }
    );


    /*
       Limiti reali del knob.
       Il centro del knob deve rimanere
       dentro il track.
    */
    const getTrackMetrics = () => {

      const trackRect =
        levelTrack.getBoundingClientRect();

      const knobRect =
        levelKnob.getBoundingClientRect();

      const halfKnob =
        knobRect.height / 2;

      const minY =
        trackRect.top + halfKnob;

      const maxY =
        trackRect.bottom - halfKnob;

      return {
        minY,
        maxY,
        range: Math.max(
          1,
          maxY - minY
        )
      };

    };


    /*
       Scroll massimo reale.
    */
    const getMaxScroll = () => {

      return Math.max(
        0,
        document.documentElement.scrollHeight -
        window.innerHeight
      );

    };


    /*
       Da scroll -> posizione knob.
    */
    const updateKnobFromScroll = () => {

      if (dragging) {
        return;
      }

      const maxScroll =
        getMaxScroll();

      const scrollTop =
        window.scrollY;

      const progress =
        maxScroll > 0
          ? Math.min(
              1,
              Math.max(
                0,
                scrollTop / maxScroll
              )
            )
          : 0;

      const {
        minY,
        range
      } = getTrackMetrics();

      /*
         Posizionamento relativo al track.
         top è relativo all'elemento .level-track.
      */
      const trackRect =
        levelTrack.getBoundingClientRect();

      const y =
        (minY - trackRect.top) +
        progress * range;

      levelKnob.style.top =
        `${y}px`;

    };


    /*
       Da coordinate pointer -> scroll.
       Questa è la parte fondamentale per eliminare
       il comportamento "a scatti".
    */
    const updateScrollFromPointer = (
      clientY
    ) => {

      const {
        minY,
        maxY,
        range
      } = getTrackMetrics();

      const clampedY =
        Math.min(
          maxY,
          Math.max(
            minY,
            clientY
          )
        );

      const progress =
        (clampedY - minY) /
        range;

      const maxScroll =
        getMaxScroll();

      const targetScroll =
        progress * maxScroll;

      /*
         Durante il drag NON usiamo
         behavior:smooth.

         È proprio questo che evita
         l'effetto "insegue il mouse" / scatti.
      */
      window.scrollTo({
        top: targetScroll,
        behavior: "auto"
      });

    };


    /*
       POINTER DOWN
       Funziona con:
       - mouse
       - trackpad
       - touch
       - penna
    */
    const startDrag = (event) => {

      /*
         Solo primary pointer.
      */
      if (
        event.isPrimary === false
      ) {
        return;
      }

      dragging = true;

      levelScroller.classList.add(
        "is-dragging"
      );

      /*
         Pointer capture:
         fondamentale quando il mouse
         esce dal pallino durante il drag.
      */
      try {
        levelKnob.setPointerCapture(
          event.pointerId
        );
      } catch (error) {
        /* Browser legacy: nessun problema */
      }

      /*
         Evita selezione testo e scrolling
         involontario sul touch.
      */
      event.preventDefault();

      updateScrollFromPointer(
        event.clientY
      );

    };


    /*
       POINTER MOVE
    */
    const moveDrag = (event) => {

      if (!dragging) {
        return;
      }

      if (
        event.isPrimary === false
      ) {
        return;
      }

      event.preventDefault();

      updateScrollFromPointer(
        event.clientY
      );

    };


    /*
       POINTER UP
    */
    const stopDrag = (event) => {

      if (!dragging) {
        return;
      }

      dragging = false;

      levelScroller.classList.remove(
        "is-dragging"
      );

      try {
        if (
          levelKnob.hasPointerCapture(
            event.pointerId
          )
        ) {
          levelKnob.releasePointerCapture(
            event.pointerId
          );
        }
      } catch (error) {
        /* Browser legacy */
      }

      /*
         Allineamento finale.
      */
      updateKnobFromScroll();

    };


    levelKnob.addEventListener(
      "pointerdown",
      startDrag,
      {
        passive: false
      }
    );

    levelKnob.addEventListener(
      "pointermove",
      moveDrag,
      {
        passive: false
      }
    );

    levelKnob.addEventListener(
      "pointerup",
      stopDrag,
      {
        passive: false
      }
    );

    levelKnob.addEventListener(
      "pointercancel",
      stopDrag,
      {
        passive: false
      }
    );


    /*
       Se il browser perde il pointer capture.
    */
    levelKnob.addEventListener(
      "lostpointercapture",
      () => {

        if (dragging) {

          dragging = false;

          levelScroller.classList.remove(
            "is-dragging"
          );

          updateKnobFromScroll();

        }

      }
    );


    /*
       Click sulla TRACK:
       permette di saltare direttamente
       a qualsiasi punto della pagina.
    */
    levelTrack.addEventListener(
      "pointerdown",
      (event) => {

        /*
           Se stiamo cliccando direttamente
           il knob, lascia lavorare il drag.
        */
        if (
          event.target === levelKnob ||
          levelKnob.contains(event.target)
        ) {
          return;
        }

        /*
           Solo primary pointer.
        */
        if (
          event.isPrimary === false
        ) {
          return;
        }

        event.preventDefault();

        updateScrollFromPointer(
          event.clientY
        );

      },
      {
        passive: false
      }
    );


    /*
       Anche il livello LABEL può essere usato
       come area di navigazione se si clicca.
       Non lo rendiamo però trascinabile.
    */


    /*
       Tastiera:
       il pallino è tabindex=0.
       Frecce, PageUp/PageDown, Home/End.
    */
    levelKnob.addEventListener(
      "keydown",
      (event) => {

        const maxScroll =
          getMaxScroll();

        if (maxScroll <= 0) {
          return;
        }

        const current =
          window.scrollY;

        const viewport =
          window.innerHeight;

        let target = current;

        switch (event.key) {

          case "ArrowUp":
            target = current - 100;
            break;

          case "ArrowDown":
            target = current + 100;
            break;

          case "PageUp":
            target = current - viewport * 0.8;
            break;

          case "PageDown":
            target = current + viewport * 0.8;
            break;

          case "Home":
            target = 0;
            break;

          case "End":
            target = maxScroll;
            break;

          default:
            return;

        }

        event.preventDefault();

        window.scrollTo({
          top: Math.max(
            0,
            Math.min(
              maxScroll,
              target
            )
          ),
          behavior: "smooth"
        });

      }
    );


    /*
       Aggiornamento knob durante scroll.
       requestAnimationFrame evita scatti
       causati da troppi layout recalculation.
    */
    let levelFrame = null;

    const handleLevelScroll = () => {

      if (dragging) {
        return;
      }

      if (levelFrame !== null) {
        return;
      }

      levelFrame =
        requestAnimationFrame(() => {

          updateKnobFromScroll();

          levelFrame = null;

        });

    };


    window.addEventListener(
      "scroll",
      handleLevelScroll,
      {
        passive: true
      }
    );


    window.addEventListener(
      "resize",
      () => {

        /*
           Dopo un resize il track cambia
           altezza: ricalcoliamo.
        */
        updateKnobFromScroll();

      },
      {
        passive: true
      }
    );


    /*
       Prima sincronizzazione.
    */
    updateKnobFromScroll();

  }


  /* =======================================================
     CONTACT FORM — EMAIL
     ======================================================= */

  const contactForm =
    $("#audio-contact-form");

  if (contactForm) {

    const nameInput =
      $("#contact-name");

    const emailInput =
      $("#contact-email");

    const subjectInput =
      $("#contact-subject");

    const messageInput =
      $("#contact-message");

    const status =
      $(".form-status", contactForm);

    const submitButton =
      $(".audio-submit-button", contactForm);


    const setStatus = (
      text,
      type = "normal"
    ) => {

      if (!status) {
        return;
      }

      status.textContent = text;

      status.dataset.status =
        type;

    };


    const validEmail = (email) => {

      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

    };


    contactForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const name =
          nameInput
            ? nameInput.value.trim()
            : "";

        const email =
          emailInput
            ? emailInput.value.trim()
            : "";

        const subject =
          subjectInput
            ? subjectInput.value.trim()
            : "";

        const message =
          messageInput
            ? messageInput.value.trim()
            : "";


        /*
           Validazione.
        */
        if (!name) {

          setStatus(
            "● INSERISCI IL TUO NOME",
            "error"
          );

          nameInput?.focus();

          return;

        }


        if (
          !email ||
          !validEmail(email)
        ) {

          setStatus(
            "● INSERISCI UNA EMAIL VALIDA",
            "error"
          );

          emailInput?.focus();

          return;

        }


        if (!message) {

          setStatus(
            "● INSERISCI UN MESSAGGIO",
            "error"
          );

          messageInput?.focus();

          return;

        }


        /*
           Costruiamo la mail.
        */
        const recipient =
          "jpmessina86@gmail.com";

        const finalSubject =
          subject ||
          "Richiesta dal sito Jacopo Messina";

        const body =
`Nome: ${name}

Email: ${email}

Messaggio:
${message}`;


        const mailto =
          "mailto:" +
          recipient +
          "?subject=" +
          encodeURIComponent(finalSubject) +
          "&body=" +
          encodeURIComponent(body);


        setStatus(
          "● APERTURA CLIENT EMAIL...",
          "sending"
        );


        /*
           Apriamo il client email
           senza lasciare la pagina.
        */
        window.location.href =
          mailto;


        /*
           Dopo un breve intervallo
           ripristiniamo lo stato.
        */
        window.setTimeout(() => {

          setStatus(
            "● CHANNEL OPEN",
            "normal"
          );

        }, 2500);

      }
    );

  }


  /* =======================================================
     WHATSAPP
     ======================================================= */

  const whatsappButton =
    $("#whatsapp-submit");

  if (whatsappButton) {

    whatsappButton.addEventListener(
      "click",
      () => {

        const nameInput =
          $("#contact-name");

        const emailInput =
          $("#contact-email");

        const subjectInput =
          $("#contact-subject");

        const messageInput =
          $("#contact-message");

        const status =
          $(".form-status");


        const name =
          nameInput
            ? nameInput.value.trim()
            : "";

        const email =
          emailInput
            ? emailInput.value.trim()
            : "";

        const subject =
          subjectInput
            ? subjectInput.value.trim()
            : "";

        const message =
          messageInput
            ? messageInput.value.trim()
            : "";


        /*
           WhatsApp non deve necessariamente
           richiedere email valida, ma nome
           e messaggio sono utili.
        */
        if (!name) {

          if (status) {
            status.textContent =
              "● INSERISCI IL TUO NOME";
          }

          nameInput?.focus();

          return;

        }


        if (!message) {

          if (status) {
            status.textContent =
              "● INSERISCI UN MESSAGGIO";
          }

          messageInput?.focus();

          return;

        }


        const whatsappNumber =
          "393318792303";


        let text =
`Ciao Jacopo, sono ${name}.`;


        if (subject) {
          text +=
            `\n\nOggetto: ${subject}`;
        }


        if (email) {
          text +=
            `\n\nLa mia email: ${email}`;
        }


        text +=
          `\n\n${message}`;


        const whatsappUrl =
          "https://wa.me/" +
          whatsappNumber +
          "?text=" +
          encodeURIComponent(text);


        if (status) {
          status.textContent =
            "● APERTURA WHATSAPP...";
        }


        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer"
        );


        window.setTimeout(() => {

          if (status) {
            status.textContent =
              "● CHANNEL OPEN";
          }

        }, 2500);

      }
    );

  }


  /* =======================================================
     FORM FIELD ACTIVE STATE
     ======================================================= */

  $$(".form-field").forEach((field) => {

    const input =
      $("input, textarea", field);

    if (!input) {
      return;
    }


    const updateFieldState = () => {

      field.classList.toggle(
        "has-value",
        input.value.trim() !== ""
      );

      field.classList.toggle(
        "is-focused",
        document.activeElement === input
      );

    };


    input.addEventListener(
      "focus",
      updateFieldState
    );

    input.addEventListener(
      "blur",
      updateFieldState
    );

    input.addEventListener(
      "input",
      updateFieldState
    );

    updateFieldState();

  });


  /* =======================================================
     EXTERNAL LINKS
     ======================================================= */

  /*
     I link esterni già impostati con target="_blank"
     mantengono noopener.
  */

  $$('a[target="_blank"]').forEach((link) => {

    const rel =
      link.getAttribute("rel") || "";

    const values =
      new Set(
        rel
          .split(/\s+/)
          .filter(Boolean)
      );

    values.add("noopener");
    values.add("noreferrer");

    link.setAttribute(
      "rel",
      Array.from(values).join(" ")
    );

  });


  /* =======================================================
     IMAGE ERROR HANDLING
     ======================================================= */

  $$("img").forEach((image) => {

    image.addEventListener(
      "error",
      () => {

        image.classList.add(
          "image-load-error"
        );

      }
    );

  });


  /* =======================================================
     INITIAL PAGE STATE
     ======================================================= */

  /*
     Forza un primo aggiornamento dopo che
     tutte le immagini hanno avuto modo di
     influenzare l'altezza della pagina.
  */
  window.setTimeout(() => {

    window.dispatchEvent(
      new Event("resize")
    );

    window.dispatchEvent(
      new Event("scroll")
    );

  }, 100);


});
