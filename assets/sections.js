var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// js/sections/announcement-bar.js
import { timeline } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
import { EffectCarousel } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var AnnouncementBar = class extends EffectCarousel {
  _transitionTo(fromSlide, toSlide) {
    timeline([
      [fromSlide, { transform: ["translateY(0)", "translateY(-5px)"], opacity: [1, 0], visibility: ["visible", "hidden"] }, { duration: 0.2 }],
      [toSlide, { transform: ["translateY(5px)", "translateY(0)"], opacity: [0, 1], visibility: ["hidden", "visible"] }, { duration: 0.2 }]
    ]);
  }
};
if (!window.customElements.get("announcement-bar")) {
  window.customElements.define("announcement-bar", AnnouncementBar);
}

// js/sections/before-after-image.js
var SplitCursor = class extends HTMLElement {
  connectedCallback() {
    this._parentSection = this.closest(".shopify-section");
    this._dragging = false;
    this._offsetX = this._currentX = 0;
    this._parentSection.addEventListener("pointerdown", this._onPointerDown.bind(this));
    this._parentSection.addEventListener("pointermove", this._onPointerMove.bind(this));
    this._parentSection.addEventListener("pointerup", this._onPointerUp.bind(this));
    this._recalculateOffset();
    window.addEventListener("resize", this._recalculateOffset.bind(this));
  }
  get minOffset() {
    return -this.offsetLeft - (document.dir === "rtl" ? this.clientWidth : 0);
  }
  get maxOffset() {
    return this.offsetParent.clientWidth + this.minOffset;
  }
  _onPointerDown(event) {
    if (event.target === this || this.contains(event.target)) {
      this._initialX = event.clientX - this._offsetX;
      this._dragging = true;
    }
  }
  _onPointerMove(event) {
    if (!this._dragging) {
      return;
    }
    this._currentX = Math.min(Math.max(event.clientX - this._initialX, this.minOffset), this.maxOffset);
    this._offsetX = this._currentX;
    this._parentSection.style.setProperty("--clip-path-offset", `${this._currentX.toFixed(1)}px`);
  }
  _onPointerUp() {
    this._dragging = false;
  }
  _recalculateOffset() {
    this._parentSection.style.setProperty("--clip-path-offset", `${Math.min(Math.max(this.minOffset, this._currentX.toFixed(1)), this.maxOffset)}px`);
  }
};
if (!window.customElements.get("split-cursor")) {
  window.customElements.define("split-cursor", SplitCursor);
}

// js/sections/collection-list.js
import { timeline as timeline2, inView } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
var CollectionList = class extends HTMLElement {
  connectedCallback() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      inView(this, this._reveal.bind(this), { margin: "-100px" });
    }
  }
  _reveal() {
    const toReveal = Array.from(this.querySelectorAll("[reveal-js]"));
    timeline2([
      [toReveal, { opacity: 1 }, { duration: 0 }],
      [toReveal.map((item) => item.querySelector("img, svg")), { opacity: [0, 1], transform: ["scale(1.03)", "auto"] }, { duration: 0.2 }],
      [toReveal.map((item) => item.querySelector(".collection-card__content-wrapper")), { opacity: [0, 1] }, { duration: 0.2 }]
    ]);
  }
};
if (!window.customElements.get("collection-list")) {
  window.customElements.define("collection-list", CollectionList);
}

// js/sections/customer-login.js
import { Delegate } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
var AccountLogin = class extends HTMLElement {
  connectedCallback() {
    this.recoverForm = this.querySelector("#recover");
    this.loginForm = this.querySelector("#login");
    if (window.location.hash === "#recover") {
      this._switchForms();
    }
    new Delegate(this).on("click", '[href="#recover"], [href="#login"]', this._switchForms.bind(this));
  }
  _switchForms(event) {
    if (event) {
      event.preventDefault();
    }
    this.recoverForm.hidden = !this.recoverForm.hidden;
    this.loginForm.hidden = !this.loginForm.hidden;
  }
};
if (!window.customElements.get("account-login")) {
  window.customElements.define("account-login", AccountLogin);
}

// js/sections/header.js
import { animate, timeline as timeline3, stagger, Delegate as Delegate2 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
import { AnimatedDetails, EffectCarousel as EffectCarousel2, Drawer, throttle } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var reduceMenuAnimation = JSON.parse("false");
var StoreHeader = class extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute("hide-on-scroll") && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      this._lastScrollTop = 0;
      this._accumulatedScroll = 0;
      this._isVisible = true;
      this._hasSwitchedToSticky = false;
      window.addEventListener("scroll", throttle(this._onScroll.bind(this)));
    }
    this.addEventListener("toggle", this._checkTransparency.bind(this), { capture: true });
    this._setupTransparentHeader();
    if (this.hasAttribute("sticky")) {
      if (Shopify.designMode) {
        document.addEventListener("shopify:section:load", this._setupTransparentHeader.bind(this));
        document.addEventListener("shopify:section:unload", this._setupTransparentHeader.bind(this));
        document.addEventListener("shopify:section:reorder", this._setupTransparentHeader.bind(this));
      }
    }
  }
  hide() {
    if (this._isVisible) {
      animate(this, { transform: ["translateY(0)", "translateY(-100%)"] }, { duration: 0.2, easing: "ease" });
      this._isVisible = false;
    }
  }
  show() {
    if (!this._isVisible) {
      animate(this, { transform: ["translateY(-100%)", "translateY(0)"] }, { duration: 0.2, easing: "ease" });
      this._accumulatedScroll = 0;
      this._isVisible = true;
    }
  }
  _onScroll() {
    if (window.scrollY < 0) {
      return;
    }
    this._accumulatedScroll = Math.max(0, this._accumulatedScroll + (window.scrollY - this._lastScrollTop));
    if (window.scrollY < this._lastScrollTop) {
      this.show();
    } else if (this._accumulatedScroll > parseInt(this.getAttribute("hide-on-scroll"))) {
      this.hide();
    }
    this._lastScrollTop = window.scrollY;
  }
  _checkTransparency() {
    let hasFallbackScrollDetection = false;
    if (CSS.supports("selector(:has(> *))") && this.hasAttribute("sticky") && !this.hasAttribute("hide-on-scroll") && this.hasAttribute("allow-transparency")) {
      const offsetBeforeChanging = 500;
      if (this.querySelectorAll("[open]").length > 0) {
        this.classList.add("is-filled");
      } else if (window.scrollY >= offsetBeforeChanging && !this._hasSwitchedToSticky) {
        this._hasSwitchedToSticky = true;
        this.classList.add("is-filled");
        animate(this, { transform: ["translateY(-100%)", "translateY(0)"] }, { duration: 0.15, easing: "ease" });
      } else if (window.scrollY < offsetBeforeChanging) {
        if (this._hasSwitchedToSticky) {
          this._hasSwitchedToSticky = false;
          animate(this, { transform: ["translateY(0)", "translateY(-100%)"] }, { duration: 0.15, easing: "ease" }).finished.then(() => {
            this.style.transform = null;
            this.classList.remove("is-filled");
          });
        } else if (this.getAnimations().length === 0) {
          this.classList.remove("is-filled");
        }
      }
    } else {
      hasFallbackScrollDetection = window.scrollY > 20;
      this.classList.toggle("is-filled", !this.hasAttribute("allow-transparency") || this.querySelectorAll("[open]").length > 0 || hasFallbackScrollDetection);
    }
  }
  _setupTransparentHeader() {
    if (document.querySelector(".shopify-section:first-child [allow-transparent-header]")) {
      this.setAttribute("allow-transparency", "");
      this.addEventListener("mouseenter", this._checkTransparency.bind(this));
      this.addEventListener("mouseleave", this._checkTransparency.bind(this));
      if (this.hasAttribute("sticky")) {
        window.addEventListener("scroll", throttle(this._checkTransparency.bind(this)));
      }
      this._checkTransparency();
    } else {
      this.removeAttribute("allow-transparency");
    }
  }
};
var DropdownDisclosure = class extends AnimatedDetails {
  constructor() {
    super();
    this._detectClickOutsideListener = this._detectClickOutside.bind(this);
    this._detectEscKeyboardListener = this._detectEscKeyboard.bind(this);
    this._detectFocusOutListener = this._detectFocusOut.bind(this);
    this._detectHoverListener = this._detectHover.bind(this);
    this._hoverTimer = null;
    this.addEventListener("mouseover", this._detectHoverListener.bind(this));
    this.addEventListener("mouseout", this._detectHoverListener.bind(this));
  }
  get trigger() {
    return !window.matchMedia("screen and (pointer: fine)").matches ? "click" : this.getAttribute("trigger");
  }
  get mouseOverDelayTolerance() {
    return 250;
  }
  /**
   * When the summary is clicked and that the mode is hover, we follow the link (if set) that may have been specified
   * on the parent. If the mode is click, then we deferred to the default behavior of the "AnimatedDetails" parent
   */
  _onSummaryClicked(event) {
    if (this.trigger === "hover") {
      event.preventDefault();
      if (event.currentTarget.hasAttribute("data-url")) {
        window.location.href = event.currentTarget.getAttribute("data-url");
      }
    } else {
      super._onSummaryClicked(event);
    }
  }
  async _transition(value) {
    if (value) {
      this.setAttribute("open", "");
      document.addEventListener("click", this._detectClickOutsideListener);
      document.addEventListener("keydown", this._detectEscKeyboardListener);
      document.addEventListener("focusout", this._detectFocusOutListener);
      const openSiblings = Array.from(this.closest("ul").querySelectorAll("[open]")).filter((item) => item !== this);
      openSiblings.forEach((sibling) => sibling.open = false);
      await this._transitionIn(openSiblings.length > 0);
    } else {
      document.removeEventListener("click", this._detectClickOutsideListener);
      document.removeEventListener("keydown", this._detectEscKeyboardListener);
      document.removeEventListener("focusout", this._detectFocusOutListener);
      await this._transitionOut();
      this.removeAttribute("open");
    }
  }
  _transitionIn(hasOpenSiblings = false) {
    const timelineSequence = [[this.contentElement, { opacity: 1 }, { duration: 0.2 }]];
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches && !reduceMenuAnimation) {
      timelineSequence.push([this.contentElement.querySelectorAll(":scope > ul > li"), { opacity: [0, 1], transform: ["translateY(-10px)", "translateY(0)"] }, { delay: stagger(0.025), at: "-0.1", duration: 0.2 }]);
    }
    return timeline3(timelineSequence, { delay: hasOpenSiblings > 0 ? 0.1 : 0 }).finished;
  }
  _transitionOut() {
    return timeline3([[this.contentElement, { opacity: 0 }, { duration: 0.2 }]]).finished;
  }
  /**
   * When dropdown menu is configured to open on click, we add a listener to detect click outside and automatically
   * close the navigation.
   */
  _detectClickOutside(event) {
    if (this.trigger !== "click") {
      return;
    }
    if (!this.contains(event.target) && !(event.target.closest("details") instanceof DropdownDisclosure)) {
      this.open = false;
    }
  }
  /**
   * On desktop device, if the mode is set to hover, we open/close the dropdown on hover
   */
  _detectHover(event) {
    if (this.trigger !== "hover") {
      return;
    }
    if (event.type === "mouseover") {
      this.open = true;
      clearTimeout(this._hoverTimer);
    } else {
      this._hoverTimer = setTimeout(() => this.open = false, this.mouseOverDelayTolerance);
    }
  }
  /**
   * Detect if we hit the "Escape" key to automatically close the dropdown
   */
  _detectEscKeyboard(event) {
    if (event.code === "Escape") {
      const targetMenu = event.target.closest("details[open]");
      if (targetMenu) {
        targetMenu.open = false;
      }
    }
  }
  /**
   * Close the dropdown automatically when the dropdown is focused out
   */
  _detectFocusOut(event) {
    if (event.relatedTarget && !this.contains(event.relatedTarget)) {
      this.open = false;
    }
  }
};
var MegaMenuDisclosure = class extends DropdownDisclosure {
  constructor() {
    super();
    this.addEventListener("pointerover", this._preloadImages.bind(this));
  }
  get mouseOverDelayTolerance() {
    return 500;
  }
  _transitionIn(hasOpenSiblings) {
    const timelineSequence = [[this.contentElement, { opacity: 1 }, { duration: 0.2 }], "mega-menu"], contentDelay = hasOpenSiblings ? 0.1 : 0;
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches && !reduceMenuAnimation) {
      this.contentElement.querySelectorAll(".mega-menu__promo").forEach((promo) => {
        timelineSequence.push([promo, { opacity: [0, 1] }, { duration: 0.25, delay: contentDelay, at: "mega-menu" }], "mega-menu-promo");
      });
      this.contentElement.querySelectorAll(".mega-menu__nav > li").forEach((column) => {
        timelineSequence.push([column.querySelectorAll(":scope > :first-child, :scope li"), { opacity: [0, 1], transform: ["translateY(-10px)", "translateY(0)"] }, { easing: "ease", delay: stagger(0.025, { start: contentDelay }), at: "mega-menu", duration: 0.2 }]);
      });
    }
    return timeline3(timelineSequence).finished;
  }
  /**
   * When the toggle is hovered we preload the mega-menu images to improve perceived performance
   */
  _preloadImages() {
    Array.from(this.querySelectorAll('img[loading="lazy"]')).forEach((image) => image.setAttribute("loading", "eager"));
  }
};
var MegaMenuPromoCarousel = class extends EffectCarousel2 {
  connectedCallback() {
    super.connectedCallback();
    if (this.nextElementSibling) {
      this.addEventListener("carousel:select", (event) => this._updateControlsColor(event.detail.slide));
    }
    this._updateControlsColor(this.items[this.selectedIndex]);
  }
  _updateControlsColor(slide) {
    const extractFrom = slide.classList.contains("content-over-media") ? slide : slide.firstElementChild;
    this.nextElementSibling.style.setProperty("--text-color", extractFrom.style.getPropertyValue("--text-color"));
  }
};
var NavigationDrawer = class extends Drawer {
  constructor() {
    super();
    const delegate = new Delegate2(this);
    delegate.on("click", "button[data-panel]", this._onPanelButtonClick.bind(this));
    this._isTransitioning = false;
    this.addEventListener("dialog:after-hide", () => {
      this.reinitializeDrawer();
    });
  }
  get openFrom() {
    return window.matchMedia("(max-width: 699px)").matches ? this.getAttribute("mobile-opening") : super.openFrom;
  }
  // Used for navigation mobile and navigation desktop set to drawer
  switchToPanel(panelIndex, linkListIndex = null) {
    const panels = this.querySelectorAll(".panel");
    let panelToHideTransform, panelToShowTransform, panelToHide = linkListIndex !== null ? panels[parseInt(panelIndex) - 1] : panels[parseInt(panelIndex) + 1], panelToShow = panels[panelIndex], linkLists = panelToShow.querySelectorAll(".panel__wrapper"), timelineSequence = [];
    if (document.dir === "rtl") {
      panelToHideTransform = linkListIndex !== null ? ["translateX(0%)", "translateX(100%)"] : ["translateX(0%)", "translateX(-100%)"];
      panelToShowTransform = linkListIndex !== null ? ["translateX(-100%)", "translateX(0%)"] : ["translateX(100%)", "translateX(0%)"];
    } else {
      panelToHideTransform = linkListIndex !== null ? ["translateX(0%)", "translateX(-100%)"] : ["translateX(0%)", "translateX(100%)"];
      panelToShowTransform = linkListIndex !== null ? ["translateX(100%)", "translateX(0%)"] : ["translateX(-100%)", "translateX(0%)"];
    }
    timelineSequence.push(
      [panelToHide, { transform: panelToHideTransform, opacity: [1, 0], visibility: ["visible", "hidden"] }, { duration: 0.3, opacity: { at: "+0.3" }, transform: { at: "+0.3" } }],
      "panelHidden",
      [panelToShow, { opacity: [0, 1], visibility: ["hidden", "visible"], transform: panelToShowTransform }, { at: "<", transform: { duration: 0.3 } }]
    );
    if (linkListIndex !== null) {
      timelineSequence.push(this.switchLinkList(linkLists, linkListIndex));
    }
    timeline3(timelineSequence);
  }
  // Used when mega menu is set to drawer
  showPanel(panelIndex, linkListIndex = null) {
    const panels = this.querySelectorAll(".panel");
    let timelineSequence = [], panelToShow = panels[panelIndex], linkLists = panelToShow.querySelectorAll(".panel__wrapper");
    if (!panelToShow.hasAttribute("open") && !this._isTransitioning) {
      this._isTransitioning = true;
      timelineSequence.push(
        [this, { width: [this.offsetWidth + "px", (this.offsetWidth - parseInt(window.getComputedStyle(this).getPropertyValue("padding"))) * 2 + "px"] }, { duration: 0.2 }],
        [panelToShow, { opacity: [0, 1], visibility: ["hidden", "visible"] }, { at: "<" }]
      );
      timelineSequence.push(this.switchLinkList(linkLists, linkListIndex));
    }
    if (this.previousLinkIndex && this.previousLinkIndex !== linkListIndex) {
      timelineSequence.push([linkLists[this.previousLinkIndex], { opacity: [1, 0], visibility: ["visible", "hidden"] }, { duration: 0.2 }]);
    }
    timeline3(timelineSequence).finished.then(() => {
      if (this.previousLinkIndex && this.previousLinkIndex !== linkListIndex) {
        linkLists[this.previousLinkIndex].removeAttribute("style");
      }
      if (panelToShow.hasAttribute("open") && this.previousLinkIndex !== linkListIndex) {
        timeline3([this.switchLinkList(linkLists, linkListIndex)]);
      }
      this.previousLinkIndex = linkListIndex;
      panelToShow.setAttribute("open", "");
      this._isTransitioning = false;
    });
  }
  switchLinkList(linkLists, linkListIndex) {
    Array.from(linkLists).forEach((item) => {
      item.setAttribute("hidden", "");
    });
    linkLists[linkListIndex].removeAttribute("hidden");
    return [linkLists[linkListIndex].querySelectorAll("li"), { opacity: [0, 1], visibility: ["hidden", "visible"], transform: ["translateY(-10px)", "translateY(0)"] }, { easing: "ease", duration: 0.2, at: "-0.15", delay: stagger(0.025, { start: 0.1 }) }];
  }
  // Set navigation drawer to initial state when drawer closed
  reinitializeDrawer() {
    if (this.hasAttribute("mega-menu") && window.matchMedia("(min-width:1150px)").matches) {
      this.style.removeProperty("width");
      this.setExpanded();
    } else {
      const firstPanel = this.querySelector(".panel:first-child");
      firstPanel.style.opacity = "1";
      firstPanel.style.visibility = "visible";
      firstPanel.style.transform = "translateX(0%)";
    }
    Array.from(this.querySelectorAll(".panel:not(:first-child)")).forEach((item) => {
      if (this.hasAttribute("mega-menu")) {
        item.removeAttribute("open");
      }
      item.style.opacity = "0";
      item.style.visibility = "hidden";
      Array.from(item.querySelectorAll(".panel__wrapper")).forEach((list) => list.setAttribute("hidden", ""));
    });
  }
  setExpanded(target) {
    Array.from(this.querySelectorAll("button[data-panel]")).forEach((item) => {
      item.setAttribute("aria-expanded", "false");
    });
    if (target) {
      target.setAttribute("aria-expanded", "true");
    }
  }
  _onPanelButtonClick(event, target) {
    if (this.hasAttribute("mega-menu") && window.matchMedia("(min-width:1150px)").matches) {
      this.setExpanded(target);
      this.showPanel(...target.getAttribute("data-panel").split("-"));
    } else {
      this.switchToPanel(...target.getAttribute("data-panel").split("-"));
    }
  }
};
if (!window.customElements.get("store-header")) {
  window.customElements.define("store-header", StoreHeader);
}
if (!window.customElements.get("dropdown-disclosure")) {
  window.customElements.define("dropdown-disclosure", DropdownDisclosure, { extends: "details" });
}
if (!window.customElements.get("mega-menu-disclosure")) {
  window.customElements.define("mega-menu-disclosure", MegaMenuDisclosure, { extends: "details" });
}
if (!window.customElements.get("mega-menu-promo-carousel")) {
  window.customElements.define("mega-menu-promo-carousel", MegaMenuPromoCarousel);
}
if (!window.customElements.get("navigation-drawer")) {
  window.customElements.define("navigation-drawer", NavigationDrawer);
}

// js/sections/feature-chart.js
import { animate as motionAnimate, scroll } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
var FeatureChart = class extends HTMLElement {
  connectedCallback() {
    this.viewButtonElement = this.querySelector('[data-action="toggle-rows"]');
    this.featureChartTable = this.querySelector(".feature-chart__table");
    this.featureChartRows = Array.from(this.featureChartTable.childNodes);
    this.featureProductRow = this.querySelector(".feature-chart__table-row--product");
    this.featureChartSticky = this.querySelector(".feature-chart__table-row--sticky");
    if (this.viewButtonElement) {
      this.viewButtonElement.addEventListener("click", this._toggleRows.bind(this));
    }
    if (this.featureChartSticky) {
      this.featureChartSticky.style.width = `${this.featureChartTable.scrollWidth}px`;
      this.featureChartTable.addEventListener("scroll", (event) => {
        this.featureChartSticky.style.marginLeft = -1 * event.target.scrollLeft + "px";
      });
      new ResizeObserver((entries) => {
        this.featureChartSticky.style.width = `${entries[0].contentRect.width}px`;
      }).observe(this.featureChartTable);
      const offset = getComputedStyle(this).scrollPaddingTop;
      scroll(({ y }) => {
        if (y.current >= y.targetOffset + this.featureProductRow.clientHeight / 2 && y.progress < 0.85) {
          this.featureChartSticky.classList.add("is-visible");
        } else {
          this.featureChartSticky.classList.remove("is-visible");
        }
      }, {
        target: this.featureChartTable,
        offset: [`${offset} start`, `end ${offset}`]
      });
    }
  }
  _toggleRows() {
    if (this.classList.contains("is-expanded")) {
      this._hideRows();
    } else {
      this._showRows();
    }
  }
  async _showRows() {
    const fromHeight = this.featureChartTable.clientHeight;
    this.featureChartRows.forEach((row) => {
      row.hidden = false;
    });
    this.viewButtonElement.querySelector(".feature-chart__toggle-text").innerText = this.viewButtonElement.getAttribute("data-view-less");
    this.classList.add("is-expanded");
    await motionAnimate(this.featureChartTable, { height: [`${fromHeight}px`, `${this.featureChartTable.clientHeight}px`] }).finished;
    this.featureChartTable.style.height = "auto";
  }
  async _hideRows() {
    let fromHeight = this.featureChartTable.clientHeight, toHeight = 0;
    this.featureChartRows.slice(0, parseInt(this.getAttribute("max-rows"))).forEach((row) => {
      toHeight += row.clientHeight;
    });
    this.viewButtonElement.querySelector(".feature-chart__toggle-text").innerText = this.viewButtonElement.getAttribute("data-view-more");
    this.classList.remove("is-expanded");
    await motionAnimate(this.featureChartTable, { height: [`${fromHeight}px`, `${toHeight}px`] }).finished;
    this.featureChartRows.slice(parseInt(this.getAttribute("max-rows"))).forEach((row) => row.hidden = true);
    this.featureChartTable.style.height = "auto";
  }
};
if (!window.customElements.get("feature-chart")) {
  window.customElements.define("feature-chart", FeatureChart);
}

// js/sections/image-banner.js
import { scroll as scroll2, timeline as timeline4, animate as animate2, inView as inView2 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
import { imageLoaded, getHeadingKeyframe } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var ImageBanner = class extends HTMLElement {
  connectedCallback() {
    if (this.parallax && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      this._setupParallax();
    }
    inView2(this, async () => {
      await imageLoaded(Array.from(this.querySelectorAll(":scope > :is(img, video, iframe, svg, video-media)")));
      const headings = Array.from(this.querySelectorAll('[reveal-on-scroll="true"]'));
      timeline4([
        [this, { opacity: [0, 1] }, { duration: 0.25 }],
        ...headings.map((heading) => [...getHeadingKeyframe(heading)])
      ]);
    });
  }
  get parallax() {
    return this.hasAttribute("parallax") ? parseFloat(this.getAttribute("parallax")) : false;
  }
  _setupParallax() {
    const media = Array.from(this.querySelectorAll(":scope > :is(img, video, iframe, svg, video-media)")), [scale, translate] = [1 + this.parallax, this.parallax * 100 / (1 + this.parallax)];
    scroll2(
      animate2(media, { transform: [`scale(${scale}) translateY(${translate}%)`, `scale(${scale}) translateY(0)`] }, { easing: "linear" }),
      {
        target: this,
        offset: ["start end", "end start"]
      }
    );
  }
};
if (!window.customElements.get("image-banner")) {
  window.customElements.define("image-banner", ImageBanner);
}

// js/sections/image-link-blocks.js
import { ScrollArea } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var ImageLinkBlocks = class extends HTMLElement {
  connectedCallback() {
    this.items = Array.from(this.children);
    new ScrollArea(this);
    this.addEventListener("control:prev", this._prev);
    this.addEventListener("control:next", this._next);
  }
  _prev() {
    this.scrollBy({ left: (document.dir === "rtl" ? 1 : -1) * this.items[0].clientWidth, behavior: "smooth" });
  }
  _next() {
    this.scrollBy({ left: (document.dir === "rtl" ? -1 : 1) * this.items[0].clientWidth, behavior: "smooth" });
  }
};
if (!window.customElements.get("image-link-blocks")) {
  window.customElements.define("image-link-blocks", ImageLinkBlocks);
}

// js/sections/images-with-text-scrolling.js
import { animate as animate3, timeline as timeline5, inView as inView3 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
import { getHeadingKeyframe as getHeadingKeyframe2, throttle as throttle2 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var ImagesWithTextScrolling = class extends HTMLElement {
  connectedCallback() {
    inView3(this, this._reveal.bind(this));
    if (this.hasAttribute("scrolling-experience")) {
      this._imageToTransitionItems = Array.from(this.querySelectorAll(".images-scrolling-desktop__media-wrapper > :not(:first-child)"));
      this._mainImage = this.querySelector(".images-scrolling-desktop__media-wrapper > :first-child");
      this._contentItems = Array.from(this.querySelectorAll(".images-scrolling__content"));
      if (this._imageToTransitionItems.length > 0) {
        window.addEventListener("scroll", throttle2(this._onScroll.bind(this)));
      }
    }
  }
  _reveal() {
    Array.from(this.querySelectorAll('[reveal-on-scroll="true"]')).forEach((heading) => {
      animate3(...getHeadingKeyframe2(heading));
    });
  }
  _onScroll() {
    const imageRect = this._mainImage.getBoundingClientRect(), imageBottom = imageRect.bottom, imageEffect = this.getAttribute("scrolling-experience");
    for (const [index, contentItem] of this._contentItems.entries()) {
      const contentItemRect = contentItem.getBoundingClientRect(), image = this._imageToTransitionItems[index - 1], content = this._contentItems[index];
      if (contentItemRect.top < imageBottom - imageRect.height * 0.15 && contentItemRect.bottom > imageBottom) {
        if (image && !image.classList.contains("is-visible")) {
          image.classList.add("is-visible");
          if (imageEffect === "fade") {
            timeline5([
              [image, { opacity: [null, 1] }, { duration: 0.2 }],
              [content, { opacity: [null, 1] }, { duration: 0.45, at: "<" }]
            ]);
          } else {
            timeline5([
              [image, { opacity: [null, 1], clipPath: ["inset(100% 0 0 0)", "inset(0 0 0 0)"] }, { duration: 0.35, easing: [0.99, 0.01, 0.5, 0.94], opacity: { duration: 0 } }],
              [content, { opacity: [null, 1] }, { duration: 0.45, at: "<" }]
            ]);
          }
        }
        break;
      }
      if (contentItemRect.top > imageBottom - imageRect.height * 0.15) {
        if (image && image.classList.contains("is-visible")) {
          image.classList.remove("is-visible");
          if (imageEffect === "fade") {
            timeline5([
              [image, { opacity: [null, 0] }, { duration: 0.2 }],
              [content, { opacity: [null, 0] }, { duration: 0.2, at: "<" }]
            ]);
          } else {
            timeline5([
              [image, { opacity: [null, 1], clipPath: ["inset(0 0 0 0)", "inset(100% 0 0 0)"] }, { duration: 0.35, easing: [0.99, 0.01, 0.5, 0.94], opacity: { duration: 0 } }],
              [content, { opacity: [null, 0] }, { duration: 0.2, at: "<" }]
            ]);
          }
        }
        break;
      }
    }
  }
};
if (!window.customElements.get("images-with-text-scrolling")) {
  window.customElements.define("images-with-text-scrolling", ImagesWithTextScrolling);
}

// js/sections/impact-text.js
import { animate as animate4, inView as inView4 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
var ImpactText = class extends HTMLElement {
  connectedCallback() {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      return;
    }
    inView4(this, ({ target }) => this._onBecameVisible(target), { margin: "-100px" });
  }
  async _onBecameVisible(target) {
    animate4(target, { opacity: 1, transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.3 });
    if (this.hasAttribute("count-up")) {
      const itemToSearch = this.childElementCount === 0 ? this : this.firstElementChild, matches = itemToSearch.textContent.trim().match(/\d+(?:[,. ]\d+)*/);
      if (!matches) {
        return;
      }
      itemToSearch.innerHTML = itemToSearch.textContent.replace(/\d+(?:[,. ]\d+)*/, `<span>${matches[0]}</span>`);
      const numberSpan = itemToSearch.querySelector("span");
      numberSpan.style.textAlign = matches[0] === matches["input"] ? null : "end";
      if (!itemToSearch.classList.contains("text-gradient")) {
        numberSpan.style.display = "inline-block";
        numberSpan.style.minWidth = `${numberSpan.clientWidth}px`;
      }
      const toReplace = matches[0].replace(/[,\. ]+/, ""), charactersMatches = [...matches[0].matchAll(/[,\. ]+/g)];
      await animate4((progress) => {
        let formattedString = Math.round(progress * parseInt(toReplace)).toString();
        charactersMatches.forEach((character) => {
          if (formattedString.length >= matches[0].length - character.index) {
            formattedString = formattedString.slice(0, character.index) + character[0] + formattedString.slice(character.index);
          }
        });
        numberSpan.textContent = progress === 1 ? matches[0] : formattedString;
      }, { duration: parseFloat(this.getAttribute("count-up")), easing: [0.16, 1, 0.3, 1] }).finished;
      numberSpan.style.minWidth = null;
    }
  }
};
if (!window.customElements.get("impact-text")) {
  window.customElements.define("impact-text", ImpactText);
}

// js/sections/media-grid.js
import { timeline as timeline6, inView as inView5 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
var MediaGrid = class extends HTMLElement {
  connectedCallback() {
    this.items = Array.from(this.children);
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      inView5(this, this._onBecameVisible.bind(this));
    }
  }
  _onBecameVisible() {
    const contentElements = this.querySelectorAll(".content-over-media > :not(img, video, iframe, svg, video-media, native-video, external-video)");
    timeline6([
      [this.items, { opacity: 1, transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.3 }],
      [contentElements, { opacity: [0, 1] }, { duration: 0.2, at: "+0.1" }]
    ]);
  }
};
if (!window.customElements.get("media-grid")) {
  window.customElements.define("media-grid", MediaGrid);
}

// js/sections/media-with-text.js
import { animate as animate5, timeline as timeline7, inView as inView6 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
import { imageLoaded as imageLoaded2 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var reduceMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
var MediaWithText = class extends HTMLElement {
  connectedCallback() {
    if (reduceMotion) {
      Array.from(this.querySelectorAll(".media-with-text__item")).forEach((item) => {
        inView6(item, (observer) => this.reveal(observer.target));
      });
    }
  }
  reveal(item) {
    const media = item.querySelector(".media-with-text__media");
    imageLoaded2(media.querySelector("img")).then(() => {
      timeline7([
        [media, { opacity: [0, 1] }, { duration: 0.3 }],
        [media.querySelector("img, video-media"), { transform: ["scale(1.05)", "scale(1)"] }, { duration: 0.3, at: "<" }]
      ]);
    });
    animate5(item.querySelector(".media-with-text__content > .prose"), { opacity: [0, 1] }, { duration: 0.2, delay: 0.3 });
  }
};
if (!window.customElements.get("media-with-text")) {
  window.customElements.define("media-with-text", MediaWithText);
}

// js/sections/multiple-images-with-text.js
import { timeline as timeline8, animate as animate6, stagger as stagger2, inView as inView7 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
import { EffectCarousel as EffectCarousel3, imageLoaded as imageLoaded3, getHeadingKeyframe as getHeadingKeyframe3 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var MultipleImagesWithText = class extends HTMLElement {
  constructor() {
    super();
    this._imageCarousel = this.querySelector("multiple-images-with-text-image-list");
    this._contentCarousel = this.querySelector("multiple-images-with-text-content-list");
    this.addEventListener("control:prev", () => {
      this._imageCarousel.previous();
      this._contentCarousel.previous();
    });
    this.addEventListener("control:next", () => {
      this._imageCarousel.next();
      this._contentCarousel.next();
    });
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => {
        if (event.target.hasAttribute("image-id")) {
          this._imageCarousel.select(this._imageCarousel.items.findIndex((item) => item.id === event.target.getAttribute("image-id")));
        }
      });
    }
  }
};
var MultipleImagesWithTextImageList = class extends EffectCarousel3 {
  constructor() {
    super();
    inView7(this, this._reveal.bind(this));
  }
  async _reveal() {
    await imageLoaded3(this.querySelectorAll("img"));
    if (this.getAttribute("layout") === "stacked") {
      timeline8([
        [this.lastElementChild, { transform: "rotate(0deg)" }],
        [this.lastElementChild?.previousElementSibling, { transform: "rotate(2deg)" }, { at: "<" }],
        [this.lastElementChild?.previousElementSibling?.previousElementSibling, { transform: "rotate(-2deg)" }, { at: "<" }]
      ], {
        defaultOptions: { duration: 0.15, easing: [0.26, 0.02, 0.27, 0.97] }
      });
    } else if (this.getAttribute("layout") === "collage") {
      timeline8([
        [this.children, { opacity: 1, transform: ["translateY(15px)", "translateY(0)"] }, { duration: 0.3, delay: stagger2(0.1) }]
      ]);
    } else {
      timeline8([
        [this.children, { opacity: 1, transform: "rotate(var(--image-rotation, 0deg))" }, { duration: 0.3, delay: stagger2(0.1) }]
      ]);
    }
  }
  _transitionTo(fromSlide, toSlide, { direction, animate: animate8 }) {
    if (this.getAttribute("layout") !== "stacked") {
      return;
    }
    const transitionSpeed = 0.2;
    if (direction === "next") {
      const fromSlideTransform = getComputedStyle(fromSlide).getPropertyValue("transform");
      return timeline8([
        [fromSlide, { opacity: 0, transform: "rotate(5deg) translate(40px, 10px)" }, { duration: transitionSpeed }],
        [toSlide, { zIndex: 1 }, { duration: transitionSpeed, zIndex: { easing: "step-start" } }],
        [fromSlide, { opacity: 1, transform: fromSlideTransform, zIndex: -1 }, { duration: transitionSpeed, at: "<", zIndex: { easing: "step-start" } }],
        [toSlide.previousElementSibling, { zIndex: 0 }, { at: "<", easing: "step-start" }]
      ], { defaultOptions: { easing: [0.26, 0.02, 0.27, 0.97] } }).finished;
    } else {
      const toSlideTransform = getComputedStyle(toSlide).getPropertyValue("transform");
      return timeline8([
        [toSlide, { opacity: 0, transform: "rotate(-5deg) translate(-40px, -10px)" }, { duration: transitionSpeed }],
        this.items.length >= 3 && [fromSlide.previousElementSibling || this.lastElementChild, { zIndex: -1 }, { easing: "step-start" }],
        [toSlide, { opacity: 1, transform: toSlideTransform, zIndex: 1 }, { duration: transitionSpeed, at: this.items.length >= 3 ? "<" : "+0", zIndex: { easing: "step-start" } }],
        [fromSlide, { zIndex: 0 }, { duration: transitionSpeed, at: "<", zIndex: { easing: "step-start" } }]
      ].filter(Boolean), { defaultOptions: { easing: [0.26, 0.02, 0.27, 0.97] } }).finished;
    }
  }
};
var MultipleImagesWithTextContentList = class extends EffectCarousel3 {
  constructor() {
    super();
    inView7(this, this._reveal.bind(this));
  }
  _reveal() {
    animate6(...getHeadingKeyframe3(this.querySelector('[reveal-on-scroll="true"]')));
  }
  _transitionTo(fromSlide, toSlide, { direction = "next", animate: animate8 = true } = {}) {
    fromSlide.classList.remove("is-selected");
    toSlide.classList.add("is-selected");
    return timeline8([
      [fromSlide, { opacity: [1, 0], visibility: ["visible", "hidden"] }],
      [toSlide, { opacity: [0, 1], visibility: ["hidden", "visible"] }],
      [...getHeadingKeyframe3(toSlide.querySelector('[reveal-on-scroll="true"]'), { at: "<" })]
    ], { duration: animate8 ? parseFloat(this.getAttribute("fade-speed") || 0.5) : 0 }).finished;
  }
};
if (!window.customElements.get("multiple-images-with-text")) {
  window.customElements.define("multiple-images-with-text", MultipleImagesWithText);
}
if (!window.customElements.get("multiple-images-with-text-image-list")) {
  window.customElements.define("multiple-images-with-text-image-list", MultipleImagesWithTextImageList);
}
if (!window.customElements.get("multiple-images-with-text-content-list")) {
  window.customElements.define("multiple-images-with-text-content-list", MultipleImagesWithTextContentList);
}

// js/sections/newsletter-popup.js
import { Drawer as Drawer2 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var NewsletterPopup = class extends Drawer2 {
  connectedCallback() {
    super.connectedCallback();
    if (this.shouldAppearAutomatically) {
      setTimeout(() => this.show(), this.apparitionDelay);
    }
  }
  get initialFocus() {
    return false;
  }
  get shouldAppendToBody() {
    return false;
  }
  get apparitionDelay() {
    return parseInt(this.getAttribute("apparition-delay") || 0) * 1e3;
  }
  get shouldAppearAutomatically() {
    return !(localStorage.getItem("theme:popup-filled") === "true" || this.hasAttribute("only-once") && localStorage.getItem("theme:popup-appeared") === "true");
  }
  _setInitialPosition() {
    this.style.top = null;
    this.style.bottom = "0px";
    this.style.left = document.dir === "ltr" ? null : "0px";
    this.style.right = document.dir === "rtl" ? "auto" : "0px";
  }
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "open" && this.open) {
      localStorage.setItem("theme:popup-appeared", "true");
    }
  }
};
if (!window.customElements.get("newsletter-popup")) {
  window.customElements.define("newsletter-popup", NewsletterPopup);
}

// js/sections/press.js
import { timeline as timeline9, animate as animate7, inView as inView8 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
import { EffectCarousel as EffectCarousel4 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var reduceMotion2 = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
var PressCarousel = class extends EffectCarousel4 {
  constructor() {
    super();
    if (reduceMotion2) {
      inView8(this, this._reveal.bind(this));
    }
  }
  _reveal() {
    animate7(this.selectedSlide.querySelector(".blockquote"), { opacity: 1, transform: ["translateY(15px)", "translateY(0)"] }, { duration: 0.2 });
  }
  async _transitionTo(fromSlide, toSlide, options = {}) {
    await timeline9([
      [fromSlide.querySelectorAll(".press__logo, .press__author"), { opacity: [null, 0] }, { duration: 0.2 }],
      [fromSlide.querySelector(".blockquote"), { opacity: [null, 0], ...reduceMotion2 && { transform: [null, "translateY(-10px)"] } }, { duration: 0.2, at: "<" }]
    ]).finished;
    fromSlide.classList.remove("is-selected");
    toSlide.classList.add("is-selected");
    await timeline9([
      [toSlide.querySelectorAll(".press__logo, .press__author"), { opacity: [0, 1] }, { duration: 0.2 }],
      [toSlide.querySelector(".blockquote"), { opacity: [0, 1], ...reduceMotion2 && { transform: ["translateY(10px)", "translateY(0px)"] } }, { duration: 0.2, at: "<" }]
    ]).finished;
  }
};
if (!window.customElements.get("press-carousel")) {
  window.customElements.define("press-carousel", PressCarousel);
}

// js/sections/product-recommendations.js
var ProductRecommendations = class extends HTMLElement {
  constructor() {
    super();
    this._isLoaded = false;
  }
  connectedCallback() {
    this._loadRecommendations();
  }
  async _loadRecommendations() {
    if (this._isLoaded) {
      return;
    }
    this._isLoaded = true;
    const section = this.closest(".shopify-section"), intent = this.getAttribute("intent") || "related", url = `${Shopify.routes.root}recommendations/products?product_id=${this.getAttribute("product")}&limit=${this.getAttribute("limit") || 4}&section_id=${section.id.replace("shopify-section-", "")}&intent=${intent}`, response = await fetch(url, { priority: "low" });
    const tempDiv = new DOMParser().parseFromString(await response.text(), "text/html"), productRecommendationsElement = tempDiv.querySelector("product-recommendations");
    if (productRecommendationsElement.childElementCount > 0) {
      this.replaceChildren(...document.importNode(productRecommendationsElement, true).childNodes);
    } else {
      if (intent === "related") {
        section.remove();
      } else {
        this.remove();
      }
    }
  }
};
if (!window.customElements.get("product-recommendations")) {
  window.customElements.define("product-recommendations", ProductRecommendations);
}

// js/sections/recently-viewed-products.js
import { extractSectionId } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var _isLoaded, _searchQueryString, searchQueryString_get, _loadProducts, loadProducts_fn;
var RecentlyViewedProducts = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _searchQueryString);
    __privateAdd(this, _loadProducts);
    __privateAdd(this, _isLoaded, false);
  }
  connectedCallback() {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(__privateMethod(this, _loadProducts, loadProducts_fn).bind(this), { timeout: 1500 });
    } else {
      __privateMethod(this, _loadProducts, loadProducts_fn).call(this);
    }
  }
};
_isLoaded = new WeakMap();
_searchQueryString = new WeakSet();
searchQueryString_get = function() {
  const items = new Set(JSON.parse(localStorage.getItem("theme:recently-viewed-products") || "[]"));
  if (this.hasAttribute("exclude-id")) {
    items.delete(parseInt(this.getAttribute("exclude-id")));
  }
  return Array.from(items.values(), (item) => `id:${item}`).slice(0, parseInt(this.getAttribute("products-count"))).join(" OR ");
};
_loadProducts = new WeakSet();
loadProducts_fn = async function() {
  if (__privateGet(this, _isLoaded)) {
    return;
  }
  __privateSet(this, _isLoaded, true);
  const section = this.closest(".shopify-section"), url = `${Shopify.routes.root}search?type=product&q=${__privateGet(this, _searchQueryString, searchQueryString_get)}&section_id=${extractSectionId(section)}`, response = await fetch(url, { priority: "low" });
  const tempDiv = new DOMParser().parseFromString(await response.text(), "text/html"), recentlyViewedProductsElement = tempDiv.querySelector("recently-viewed-products");
  if (recentlyViewedProductsElement.childElementCount > 0) {
    this.replaceChildren(...document.importNode(recentlyViewedProductsElement, true).childNodes);
  } else {
    section.remove();
  }
};
if (!window.customElements.get("recently-viewed-products")) {
  window.customElements.define("recently-viewed-products", RecentlyViewedProducts);
}

// js/sections/revealed-image-on-scroll.js
import { scroll as scroll3, timeline as timeline10, ScrollOffset, inView as inView9 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
var RevealedImage = class extends HTMLElement {
  connectedCallback() {
    const scrollTracker = this.querySelector(".revealed-image__scroll-tracker"), scroller = this.querySelector(".revealed-image__scroller");
    scrollTracker.style.height = `${scroller.clientHeight}px`;
    new ResizeObserver((entries) => scrollTracker.style.height = `${entries[0].contentRect.height}px`).observe(scroller);
    scroll3(timeline10([
      [this.querySelectorAll(".revealed-image__image-clipper, .revealed-image__content--inside"), { clipPath: ["inset(37% 37% 41% 37%)", "inset(calc(var(--sticky-area-height) / 2) 0)"] }, { easing: "ease-in" }],
      [this.querySelectorAll("img, svg"), { transform: ["translate(-10%, -1.5%) scale(1.4)", "translate(0, 0) scale(1)"] }, { easing: "ease-in", at: "<" }],
      [this.querySelectorAll(".revealed-image__content"), { opacity: [0, 1, 1] }, { offset: [0, 0.25, 1], at: "<" }]
    ]), {
      target: scrollTracker,
      offset: ScrollOffset.All
    });
    inView9(this, () => {
      this.style.visibility = "visible";
      return () => {
        this.style.visibility = "hidden";
      };
    }, { margin: "200px" });
  }
};
if (!window.customElements.get("revealed-image")) {
  window.customElements.define("revealed-image", RevealedImage);
}

// js/sections/shop-the-look.js
var ShopTheLookDots = class extends HTMLElement {
  connectedCallback() {
    this._abortController = new AbortController();
    Array.from(this.children).forEach((dots) => {
      document.getElementById(dots.getAttribute("aria-controls")).addEventListener("carousel:change", (event) => this._onDotClicked(event), { signal: this._abortController.signal });
    });
  }
  disconnectedCallback() {
    this._abortController.abort();
  }
  _onDotClicked(event) {
    Array.from(this.querySelectorAll(`button:nth-child(${event.detail.index + 1})`)).forEach((button) => button.click());
  }
};
if (!window.customElements.get("shop-the-look-dots")) {
  window.customElements.define("shop-the-look-dots", ShopTheLookDots);
}

// js/sections/slideshow.js
import { animate as motionAnimate2, timeline as timeline11, inView as inView10 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/vendor.min.js?v=19330323356122838161684366999";
import { EffectCarousel as EffectCarousel5, imageLoaded as imageLoaded4, getHeadingKeyframe as getHeadingKeyframe4 } from "//cdn.shopify.com/s/files/1/0760/7887/4912/t/2/assets/theme.js?v=13834297822315838121684421173";
var Slideshow = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("carousel:select", this._onSlideSelected);
  }
  async _onSlideSelected(event) {
    const slideStyles = getComputedStyle(event.detail.slide);
    this.style.setProperty("--slideshow-controls-background", slideStyles.getPropertyValue("--slideshow-slide-controls-background"));
    this.style.setProperty("--slideshow-controls-color", slideStyles.getPropertyValue("--slideshow-slide-controls-color"));
    if (!this.classList.contains("slideshow--boxed")) {
      return;
    }
    const backgroundElement = this.querySelector(".slideshow__slide-background");
    const background = slideStyles.getPropertyValue("--slideshow-slide-background");
    backgroundElement.style.background = background;
    await motionAnimate2(backgroundElement, { opacity: [0, 1] }, { duration: 0.2 }).finished;
    this.style.setProperty("--slideshow-background", background);
    motionAnimate2(backgroundElement, { opacity: 0 }, { duration: 0 });
  }
};
var SlideshowCarousel = class extends EffectCarousel5 {
  constructor() {
    super();
    inView10(this, this._reveal.bind(this));
    if (this.querySelector(".slideshow__cursor")) {
      this.addEventListener("tap", this._onSlideshowTap);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (this._player && this.hasAttribute("autoplay")) {
      this._player.addEventListener("player:start", () => {
        const cursorRing = this.querySelector(".slideshow__cursor-ring circle");
        if (cursorRing) {
          motionAnimate2(cursorRing, { strokeDasharray: [`0px, ${cursorRing.getTotalLength()}px`, `${cursorRing.getTotalLength()}px, ${cursorRing.getTotalLength()}px`] }, {
            duration: parseInt(this.getAttribute("autoplay")),
            easing: "linear"
          });
        }
        const circles = Array.from(this.querySelectorAll(".numbered-dots__item"));
        circles.forEach((item) => {
          const circle = item.querySelector("circle:last-child");
          if (item.getAttribute("aria-current") === "true") {
            motionAnimate2(circle, { strokeDasharray: [`0px, ${circle.getTotalLength()}px`, `${circle.getTotalLength()}px, ${circle.getTotalLength()}px`] }, { duration: parseInt(this.getAttribute("autoplay")), easing: "linear" });
          } else {
            motionAnimate2(circle, { strokeDasharray: `${circle.getTotalLength()}px, ${circle.getTotalLength()}px` }, { duration: 0, easing: "linear" });
          }
        });
      });
    }
  }
  get transitionType() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "fade" : this.getAttribute("transition");
  }
  async _reveal() {
    const selectedSlide = this.selectedSlide;
    await imageLoaded4(selectedSlide.querySelectorAll("img"));
    this.style.opacity = "1";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (!this._reloaded) {
      timeline11([
        [selectedSlide, { zIndex: 1 }, { duration: 0 }],
        [selectedSlide.querySelectorAll("img"), { opacity: [0, 1], transform: ["scale(1.05)", "scale(1)"] }, { duration: 0.3 }],
        "content",
        [selectedSlide.querySelectorAll('[data-sequence="subheading"], .button'), { opacity: [0, 1] }, { duration: 0.3, at: "content" }],
        [...getHeadingKeyframe4(selectedSlide.querySelector('[data-sequence="heading"]'), { duration: 0.3, at: "content" })],
        [selectedSlide.querySelector(".button"), { opacity: [0, 1] }, { duration: 0.3, at: "content" }],
        [this.querySelector(".slideshow__controls"), { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] }, { duration: 0.3 }]
      ]);
    }
  }
  _onSlideshowTap(event) {
    if (event.target.matches("button, a[href], button :scope, a[href] :scope") || !window.matchMedia("screen and (pointer: fine)").matches) {
      return;
    }
    event.detail.originalEvent.clientX > window.innerWidth / 2 ? this.next() : this.previous();
  }
  /**
   * Perform a simple fade animation. For more complex animations, you should implement your own custom elements
   * that extends the EffectCarousel, and implement your own transition. You should make sure to return a promise
   * that resolves when the animation is finished
   */
  async _transitionTo(fromSlide, toSlide, { direction, animate: animate8 = true } = {}) {
    fromSlide.classList.remove("is-selected");
    toSlide.classList.add("is-selected");
    let timelineControls = null;
    switch (this.transitionType) {
      case "fade":
        timelineControls = this._fade(fromSlide, toSlide, { animate: animate8 });
        break;
      case "fade_with_text":
        timelineControls = this._fadeWithText(fromSlide, toSlide, { animate: animate8 });
        break;
    }
    if (!animate8) {
      timelineControls.finish();
    }
    return timelineControls.finished;
  }
  /**
   * Perform a simple fade transition
   */
  _fade(fromSlide, toSlide) {
    return timeline11([
      [fromSlide, { opacity: [1, 0], visibility: ["visible", "hidden"], zIndex: 0 }, { duration: 0.3, easing: "ease-in", zIndex: { easing: "step-end" } }],
      [toSlide, { opacity: [0, 1], visibility: ["hidden", "visible"], zIndex: 1 }, { duration: 0.3, at: "<", easing: "ease-out", zIndex: { easing: "step-end" } }]
    ]);
  }
  /**
   * Perform a transition with fade images and image transition
   */
  async _fadeWithText(fromSlide, toSlide) {
    motionAnimate2(fromSlide, { opacity: [1, 0], visibility: ["visible", "hidden"], zIndex: 0 }, { duration: 0.3, easing: "ease-in", zIndex: { easing: "step-end" } });
    await imageLoaded4(toSlide.querySelectorAll("img"));
    motionAnimate2(toSlide, { opacity: [0, 1], visibility: ["hidden", "visible"], zIndex: 1 }, { duration: 0, zIndex: { easing: "step-end" } });
    return timeline11([
      [toSlide.querySelectorAll("img"), { opacity: [0, 1], transform: ["scale(1.05)", "scale(1)"] }, { duration: 0.3, easing: "ease-out" }],
      "content",
      [toSlide.querySelectorAll('[data-sequence="subheading"], .button'), { opacity: [0, 1] }, { duration: 0.3, at: "content" }],
      [...getHeadingKeyframe4(toSlide.querySelector('[data-sequence="heading"]'), { duration: 0.3, at: "content" })]
    ]);
  }
};
if (!window.customElements.get("x-slideshow")) {
  window.customElements.define("x-slideshow", Slideshow);
}
if (!window.customElements.get("slideshow-carousel")) {
  window.customElements.define("slideshow-carousel", SlideshowCarousel);
}
