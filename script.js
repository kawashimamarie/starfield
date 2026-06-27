(() => {
  const loader = document.querySelector(".loader");
  window.addEventListener("load", () => {
    window.setTimeout(() => loader?.classList.add("is-hidden"), 650);
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".global-nav");
  toggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(Boolean(open)));
    document.body.classList.toggle("menu-open", Boolean(open));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".count");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCount = (el) => {
    if (el.dataset.done) return;
    el.dataset.done = "true";
    const target = Number(el.dataset.count || 0);
    if (reduced) {
      el.textContent = String(target);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("number-card")) {
          entry.target.querySelectorAll(".count").forEach(animateCount);
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    counters.forEach(animateCount);
  }

  const inquiryType = document.querySelector("#inquiry-type");
  const typeAliases = {
    nursery: "nursery",
    hoiku: "nursery",
    childcare: "dayservice",
    dayservice: "dayservice",
    day: "dayservice",
    temporary: "temporary",
    nicotto: "nicotto",
    home: "home",
    recruit: "recruit",
    certificate: "certificate",
    other: "other"
  };

  const setInquiryType = (type) => {
    if (!inquiryType || !type) return;
    const value = typeAliases[type] || type;
    if ([...inquiryType.options].some((option) => option.value === value)) {
      inquiryType.value = value;
    }
  };

  const params = new URLSearchParams(window.location.search);
  setInquiryType(params.get("type"));

  document.querySelectorAll("[data-contact-type]").forEach((card) => {
    card.addEventListener("click", () => {
      setInquiryType(card.dataset.contactType);
    });
  });

  const recruitTabs = document.querySelectorAll("[data-tab-target]");
  const recruitPanels = document.querySelectorAll("[data-tab-panel]");
  const activateRecruitTab = (target) => {
    recruitTabs.forEach((tab) => {
      const active = tab.dataset.tabTarget === target;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    recruitPanels.forEach((panel) => {
      const active = panel.dataset.tabPanel === target;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  };
  recruitTabs.forEach((tab) => {
    tab.addEventListener("click", () => activateRecruitTab(tab.dataset.tabTarget));
  });
})();
