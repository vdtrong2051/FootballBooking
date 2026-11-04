(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e2) {
      throw err = [e2], e2;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e2) {
      throw mod = 0, e2;
    }
  };

  // node_modules/preline/dist/index.mjs
  function i(s2) {
    var n2 = t[s2];
    if (void 0 !== n2) return n2.exports;
    var o2 = t[s2] = { exports: {} };
    return e[s2](o2, o2.exports, i), o2.exports;
  }
  var e, t, s, n, o, l, a, r, c, d, h, u, p, m, g, v, f, y, b, w, C, x, S, k, L, E, T, A, I, M, D, O, $, P, HSAccordion, HSCarousel, HSCollapse, HSComboBox, HSCopyMarkup, HSDataTable, HSDatepicker, HSDropdown, HSFileUpload, HSInputNumber, HSLayoutSplitter, HSOverlay, HSPinInput, HSRangeSlider, HSRemoveElement, HSScrollNav, HSScrollspy, HSSelect, HSStepper, HSStrongPassword, HSTabs, HSTextareaAutoHeight, HSThemeSwitch, HSToggleCount, HSTogglePassword, HSTooltip, HSTreeView;
  var init_dist = __esm({
    "node_modules/preline/dist/index.mjs"() {
      e = { 189(e2, t2, i2) {
        i2.d(t2, { LO: () => n2, lP: () => s2 });
        const s2 = { auto: "auto", "auto-start": "auto-start", "auto-end": "auto-end", top: "top", "top-left": "top-start", "top-right": "top-end", bottom: "bottom", "bottom-left": "bottom-start", "bottom-right": "bottom-end", right: "right", "right-start": "right-start", "right-end": "right-end", left: "left", "left-start": "left-start", "left-end": "left-end" }, n2 = { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };
      }, 8862(e2, t2, i2) {
        i2.d(t2, { A: () => n2 });
        var s2 = i2(1926);
        const n2 = class {
          constructor() {
            this.components = [], this.currentlyOpenedComponents = [], this.activeComponent = null, this.allowedKeybindings = /* @__PURE__ */ new Set(["Escape", "Enter", " ", "Space", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"]), this.initGlobalListeners();
          }
          initGlobalListeners() {
            document.addEventListener("keydown", (e3) => this.handleGlobalKeydown(e3)), document.addEventListener("focusin", (e3) => this.handleGlobalFocusin(e3));
          }
          isAllowedKeybinding(e3) {
            return !!this.allowedKeybindings.has(e3.key) || !(1 !== e3.key.length || !/^[a-zA-Z]$/.test(e3.key) || e3.metaKey || e3.ctrlKey || e3.altKey || e3.shiftKey);
          }
          getActiveComponent(e3) {
            if (!e3) return null;
            const t3 = this.components.filter((t4) => t4.wrapper.contains(e3) || t4.context && t4.context.contains(e3));
            if (0 === t3.length) return null;
            if (1 === t3.length) return t3[0];
            let i3 = null, s3 = Number.MAX_SAFE_INTEGER;
            for (const n3 of t3) {
              let t4 = 0, o2 = e3;
              for (; o2 && o2 !== n3.wrapper && o2 !== n3.context; ) t4++, o2 = o2.parentElement;
              t4 < s3 && (s3 = t4, i3 = n3);
            }
            return i3;
          }
          getActiveComponentForKey(e3, t3) {
            if (!e3) return null;
            const i3 = this.components.filter((t4) => t4.wrapper.contains(e3) || t4.context && t4.context.contains(e3));
            if (0 === i3.length) return null;
            const s3 = i3.filter((e4) => {
              const i4 = e4.handlers;
              switch (t3) {
                case "Escape":
                  return !!i4.onEsc;
                case "Enter":
                  return !!i4.onEnter;
                case " ":
                case "Space":
                  return !!i4.onSpace;
                case "ArrowDown":
                case "ArrowUp":
                case "ArrowLeft":
                case "ArrowRight":
                  return !!i4.onArrow;
                case "Tab":
                  return !!i4.onTab || !!i4.onShiftTab;
                case "Home":
                  return !!i4.onHome;
                case "End":
                  return !!i4.onEnd;
                default:
                  return !!i4.onFirstLetter;
              }
            });
            if (0 === s3.length) return this.getActiveComponent(e3);
            if (1 === s3.length) return s3[0];
            let n3 = null, o2 = Number.MAX_SAFE_INTEGER;
            for (const t4 of s3) {
              let i4 = 0, s4 = e3;
              for (; s4 && s4 !== t4.wrapper && s4 !== t4.context; ) i4++, s4 = s4.parentElement;
              i4 < o2 && (o2 = i4, n3 = t4);
            }
            return n3;
          }
          getDistanceToComponent(e3, t3) {
            let i3 = 0, s3 = e3;
            for (; s3 && s3 !== t3.wrapper && s3 !== t3.context; ) i3++, s3 = s3.parentElement;
            return i3;
          }
          getComponentsByNesting(e3) {
            if (!e3) return [];
            const t3 = this.components.filter((t4) => t4.wrapper.contains(e3) || t4.context && t4.context.contains(e3));
            return t3.length <= 1 ? t3 : [...t3].sort((t4, i3) => this.getDistanceToComponent(e3, i3) - this.getDistanceToComponent(e3, t4));
          }
          getSequentialHandlersForKey(e3, t3) {
            const i3 = this.getComponentsByNesting(e3);
            return 0 === i3.length ? [] : i3.map((e4) => "Enter" === t3 ? e4.handlers.onEnter : e4.handlers.onSpace).filter((e4) => "function" == typeof e4);
          }
          executeSequentialHandlers(e3, t3) {
            let i3 = false, s3 = false;
            for (const n3 of e3) {
              i3 = true;
              if (false === n3(t3)) {
                s3 = true;
                break;
              }
            }
            return { called: i3, stopped: s3 };
          }
          handleGlobalFocusin(e3) {
            const t3 = e3.target;
            this.activeComponent = this.getActiveComponent(t3);
          }
          handleGlobalKeydown(e3) {
            var t3;
            const i3 = e3.target;
            this.activeComponent = this.getActiveComponentForKey(i3, e3.key);
            const n3 = this.activeComponent, o2 = "Enter" === e3.key || " " === e3.key || "Space" === e3.key;
            if ((n3 || o2) && this.isAllowedKeybinding(e3)) switch (e3.key) {
              case "Escape":
                if (!n3) break;
                if (n3.isOpened) {
                  if (n3.handlers.onEsc) {
                    const t4 = n3.handlers.onEsc();
                    if (e3.preventDefault(), e3.stopPropagation(), false === t4) {
                      const e4 = this.findClosestOpenParent(i3);
                      (null == e4 ? void 0 : e4.handlers.onEsc) && e4.handlers.onEsc();
                    }
                  }
                } else {
                  const t4 = this.findClosestOpenParent(i3);
                  (null == t4 ? void 0 : t4.handlers.onEsc) && (t4.handlers.onEsc(), e3.preventDefault(), e3.stopPropagation());
                }
                break;
              case "Enter": {
                const t4 = this.getSequentialHandlersForKey(i3, "Enter");
                if (0 === t4.length) break;
                const { called: n4, stopped: o4 } = this.executeSequentialHandlers(t4, e3);
                if (n4 && !(0, s2.V6)(i3) && (e3.stopPropagation(), e3.preventDefault()), o4) break;
                break;
              }
              case " ":
              case "Space": {
                if ("INPUT" === i3.tagName || "TEXTAREA" === i3.tagName) return;
                const t4 = this.getActiveComponent(i3), s3 = this.getSequentialHandlersForKey(i3, "Space");
                if (0 === s3.length) break;
                const { stopped: n4 } = this.executeSequentialHandlers(s3);
                (n4 || (null == t4 ? void 0 : t4.handlers.onSpace)) && (e3.preventDefault(), e3.stopPropagation());
                break;
              }
              case "ArrowDown":
              case "ArrowUp":
              case "ArrowLeft":
              case "ArrowRight":
                if (!n3) break;
                if (n3.handlers.onArrow) {
                  if (e3.metaKey || e3.ctrlKey || e3.altKey || e3.shiftKey) return;
                  n3.handlers.onArrow(e3), e3.preventDefault(), e3.stopPropagation();
                }
                break;
              case "Tab":
                if (!n3) break;
                if (!n3.handlers.onTab) break;
                const o3 = e3.shiftKey ? n3.handlers.onShiftTab : n3.handlers.onTab;
                o3 && o3(e3);
                break;
              case "Home":
                if (!n3) break;
                n3.handlers.onHome && (n3.handlers.onHome(), e3.preventDefault(), e3.stopPropagation());
                break;
              case "End":
                if (!n3) break;
                n3.handlers.onEnd && (n3.handlers.onEnd(), e3.preventDefault(), e3.stopPropagation());
                break;
              default:
                if (!n3) break;
                if (n3.handlers.onFirstLetter && 1 === e3.key.length && /^[a-zA-Z]$/.test(e3.key)) {
                  if (n3.handlers.onFirstLetter(e3.key), !(null === (t3 = n3.stopPropagation) || void 0 === t3 ? void 0 : t3.onFirstLetter)) return;
                  e3.preventDefault(), e3.stopPropagation();
                }
            }
          }
          findClosestOpenParent(e3) {
            let t3 = e3.parentElement;
            for (; t3; ) {
              const e4 = this.currentlyOpenedComponents.find((e5) => e5.wrapper === t3 && e5 !== this.activeComponent);
              if (e4) return e4;
              t3 = t3.parentElement;
            }
            return null;
          }
          registerComponent(e3, t3, i3 = true, s3 = "", n3 = "", o2, l2) {
            const a2 = { wrapper: e3, handlers: t3, isOpened: i3, name: s3, selector: n3, context: o2, isRegistered: true, stopPropagation: l2 };
            return this.components.push(a2), a2;
          }
          updateComponentState(e3, t3) {
            e3.isOpened = t3, t3 ? this.currentlyOpenedComponents.includes(e3) || this.currentlyOpenedComponents.push(e3) : this.currentlyOpenedComponents = this.currentlyOpenedComponents.filter((t4) => t4 !== e3);
          }
          unregisterComponent(e3) {
            this.components = this.components.filter((t3) => t3 !== e3), this.currentlyOpenedComponents = this.currentlyOpenedComponents.filter((t3) => t3 !== e3);
          }
          addAllowedKeybinding(e3) {
            this.allowedKeybindings.add(e3);
          }
          removeAllowedKeybinding(e3) {
            this.allowedKeybindings.delete(e3);
          }
          getAllowedKeybindings() {
            return Array.from(this.allowedKeybindings);
          }
        };
      }, 2407(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3, i3) {
            super(e3, t3, i3), this.toggle = this.el.querySelector(".hs-accordion-toggle") || null, this.content = this.el.querySelector(".hs-accordion-content") || null, this.group = this.el.closest(".hs-accordion-group") || null, this.isAlwaysOpened = false, this.keepOneOpen = false, this.isToggleStopPropagated = false, window.$hsAccordionCollection || (window.$hsAccordionCollection = []), this.update(), this.isToggleStopPropagated = (0, s2.PK)((0, s2.gj)(this.toggle, "--stop-propagation", "false") || "false"), this.keepOneOpen = !!this.group && (0, s2.PK)((0, s2.gj)(this.group, "--keep-one-open", "false") || "false"), this.toggle && this.content && this.init();
          }
          init() {
            this.createCollection(window.$hsAccordionCollection, this), this.onToggleClickListener = (e3) => this.toggleClick(e3), this.toggle.addEventListener("click", this.onToggleClickListener);
          }
          toggleClick(e3) {
            if (this.el.classList.contains("active") && this.keepOneOpen) return false;
            this.isToggleStopPropagated && e3.stopPropagation(), this.el.classList.contains("active") ? this.hide() : this.show();
          }
          show() {
            var e3;
            if (this.group && !this.isAlwaysOpened && this.group.querySelector(":scope > .hs-accordion.active") && this.group.querySelector(":scope > .hs-accordion.active") !== this.el) {
              window.$hsAccordionCollection.find((e4) => e4.element.el === this.group.querySelector(":scope > .hs-accordion.active")).element.hide();
            }
            if (this.el.classList.contains("active")) return false;
            this.el.classList.add("active"), (null === (e3 = null == this ? void 0 : this.toggle) || void 0 === e3 ? void 0 : e3.ariaExpanded) && (this.toggle.ariaExpanded = "true"), this.fireEvent("beforeOpen", this.el), (0, s2.JD)("beforeOpen.hs.accordion", this.el, this.el), this.content.style.display = "block", this.content.style.height = "0", setTimeout(() => {
              this.content.style.height = `${this.content.scrollHeight}px`, (0, s2.yd)(this.content, () => {
                this.content.style.display = "block", this.content.style.height = "", this.fireEvent("open", this.el), (0, s2.JD)("open.hs.accordion", this.el, this.el);
              });
            });
          }
          hide() {
            var e3;
            if (!this.el.classList.contains("active")) return false;
            this.el.classList.remove("active"), (null === (e3 = null == this ? void 0 : this.toggle) || void 0 === e3 ? void 0 : e3.ariaExpanded) && (this.toggle.ariaExpanded = "false"), this.fireEvent("beforeClose", this.el), (0, s2.JD)("beforeClose.hs.accordion", this.el, this.el), this.content.style.height = `${this.content.scrollHeight}px`, setTimeout(() => {
              this.content.style.height = "0";
            }), (0, s2.yd)(this.content, () => {
              this.content.style.display = "none", this.content.style.height = "", this.fireEvent("close", this.el), (0, s2.JD)("close.hs.accordion", this.el, this.el);
            });
          }
          update() {
            return this.group = this.el.closest(".hs-accordion-group") || null, !!this.group && (this.isAlwaysOpened = this.group.hasAttribute("data-hs-accordion-always-open") || false, !!window.$hsAccordionCollection && void window.$hsAccordionCollection.map((e3) => (e3.id === this.el.id && (e3.element.group = this.group, e3.element.isAlwaysOpened = this.isAlwaysOpened), e3)));
          }
          destroy() {
            var e3;
            (null === (e3 = null == o2 ? void 0 : o2.selectable) || void 0 === e3 ? void 0 : e3.length) && o2.selectable.forEach((e4) => {
              e4.listeners.forEach(({ el: e5, listener: t3 }) => {
                e5.removeEventListener("click", t3);
              });
            }), this.onToggleClickListener && this.toggle.removeEventListener("click", this.onToggleClickListener), this.toggle = null, this.content = null, this.group = null, this.onToggleClickListener = null, window.$hsAccordionCollection = window.$hsAccordionCollection.filter(({ element: e4 }) => e4.el !== this.el);
          }
          static findInCollection(e3) {
            return window.$hsAccordionCollection.find((t3) => e3 instanceof o2 ? t3.element.el === e3.el : "string" == typeof e3 ? t3.element.el === document.querySelector(e3) : t3.element.el === e3) || null;
          }
          static autoInit() {
            window.$hsAccordionCollection || (window.$hsAccordionCollection = []), window.$hsAccordionCollection && (window.$hsAccordionCollection = window.$hsAccordionCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll(".hs-accordion:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsAccordionCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsAccordionCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static show(e3) {
            const t3 = o2.findInCollection(e3);
            t3 && "block" !== t3.element.content.style.display && t3.element.show();
          }
          static hide(e3) {
            const t3 = o2.findInCollection(e3), i3 = t3 ? window.getComputedStyle(t3.element.content) : null;
            t3 && "none" !== i3.display && t3.element.hide();
          }
          static treeView() {
            if (!document.querySelectorAll(".hs-accordion-treeview-root").length) return false;
            this.selectable = [], document.querySelectorAll(".hs-accordion-treeview-root").forEach((e3) => {
              const t3 = null == e3 ? void 0 : e3.getAttribute("data-hs-accordion-options"), i3 = t3 ? JSON.parse(t3) : {};
              this.selectable.push({ el: e3, options: Object.assign({}, i3), listeners: [] });
            }), this.selectable.length && this.selectable.forEach((e3) => {
              const { el: t3 } = e3;
              t3.querySelectorAll(".hs-accordion-selectable").forEach((t4) => {
                const i3 = (i4) => this.onSelectableClick(i4, e3, t4);
                t4.addEventListener("click", i3), e3.listeners.push({ el: t4, listener: i3 });
              });
            });
          }
          static toggleSelected(e3, t3) {
            t3.classList.contains("selected") ? t3.classList.remove("selected") : (e3.el.querySelectorAll(".hs-accordion-selectable").forEach((e4) => e4.classList.remove("selected")), t3.classList.add("selected"));
          }
          static on(e3, t3, i3) {
            const s3 = o2.findInCollection(t3);
            s3 && (s3.element.events[e3] = i3);
          }
        }
        o2.onSelectableClick = (e3, t3, i3) => {
          e3.stopPropagation(), o2.toggleSelected(t3, i3);
        };
        const l2 = o2;
      }, 7615(e2, t2, i2) {
        i2.d(t2, { A: () => s2 });
        class s2 {
          constructor(e3, t3, i3) {
            this.el = e3, this.options = t3, this.events = i3, this.el = e3, this.options = t3, this.events = {};
          }
          createCollection(e3, t3) {
            var i3, s3;
            let n2 = e3;
            if (!Array.isArray(n2) && "undefined" != typeof window) {
              const e4 = null === (i3 = this.constructor) || void 0 === i3 ? void 0 : i3.name, t4 = "string" == typeof e4 && e4.startsWith("HS") ? `$hs${e4.slice(2)}Collection` : null;
              t4 && (Array.isArray(window[t4]) || (window[t4] = []), n2 = window[t4]);
            }
            Array.isArray(n2) && n2.push({ id: (null === (s3 = null == t3 ? void 0 : t3.el) || void 0 === s3 ? void 0 : s3.id) || n2.length + 1, element: t3 });
          }
          fireEvent(e3, t3 = null) {
            if (this.events.hasOwnProperty(e3)) return this.events[e3](t3);
          }
          on(e3, t3) {
            this.events[e3] = t3;
          }
        }
      }, 4571(e2, t2, i2) {
        i2.d(t2, { A: () => a2 });
        var s2 = i2(1926), n2 = i2(7615), o2 = i2(189);
        class l2 extends n2.A {
          constructor(e3, t3) {
            var i3, s3, n3, o3, l3;
            super(e3, t3);
            const a3 = e3.getAttribute("data-hs-carousel"), r2 = a3 ? JSON.parse(a3) : {}, c2 = Object.assign(Object.assign({}, r2), t3);
            this.currentIndex = c2.currentIndex || 0, this.loadingClasses = c2.loadingClasses ? `${c2.loadingClasses}`.split(",") : null, this.dotsItemClasses = c2.dotsItemClasses ? c2.dotsItemClasses : null, this.isAutoHeight = void 0 !== c2.isAutoHeight && c2.isAutoHeight, this.isAutoPlay = void 0 !== c2.isAutoPlay && c2.isAutoPlay, this.isCentered = void 0 !== c2.isCentered && c2.isCentered, this.isDraggable = void 0 !== c2.isDraggable && c2.isDraggable, this.isInfiniteLoop = void 0 !== c2.isInfiniteLoop && c2.isInfiniteLoop, this.isRTL = void 0 !== c2.isRTL && c2.isRTL, this.isSnap = void 0 !== c2.isSnap && c2.isSnap, this.hasSnapSpacers = void 0 === c2.hasSnapSpacers || c2.hasSnapSpacers, this.speed = c2.speed || 4e3, this.updateDelay = c2.updateDelay || 0, this.slidesQty = c2.slidesQty || 1, this.loadingClassesRemove = (null === (i3 = this.loadingClasses) || void 0 === i3 ? void 0 : i3[0]) ? this.loadingClasses[0].split(" ") : "opacity-0", this.loadingClassesAdd = (null === (s3 = this.loadingClasses) || void 0 === s3 ? void 0 : s3[1]) ? this.loadingClasses[1].split(" ") : "", this.afterLoadingClassesAdd = (null === (n3 = this.loadingClasses) || void 0 === n3 ? void 0 : n3[2]) ? this.loadingClasses[2].split(" ") : "", this.container = this.el.querySelector(".hs-carousel") || null, this.inner = this.el.querySelector(".hs-carousel-body") || null, this.slides = this.el.querySelectorAll(".hs-carousel-slide") || [], this.prev = this.el.querySelector(".hs-carousel-prev") || null, this.next = this.el.querySelector(".hs-carousel-next") || null, this.dots = this.el.querySelector(".hs-carousel-pagination") || null, this.info = this.el.querySelector(".hs-carousel-info") || null, this.infoTotal = (null === (o3 = null == this ? void 0 : this.info) || void 0 === o3 ? void 0 : o3.querySelector(".hs-carousel-info-total")) || null, this.infoCurrent = (null === (l3 = null == this ? void 0 : this.info) || void 0 === l3 ? void 0 : l3.querySelector(".hs-carousel-info-current")) || null, this.sliderWidth = this.el.getBoundingClientRect().width, this.isDragging = false, this.dragStartX = null, this.initialTranslateX = null, this.touchX = { start: 0, end: 0 }, this.touchY = { start: 0, end: 0 }, this.resizeContainer = document.querySelector("body"), this.resizeContainerWidth = 0, this.init();
          }
          setIsSnap() {
            const e3 = this.container.getBoundingClientRect(), t3 = e3.left + e3.width / 2;
            let i3 = null, s3 = null, n3 = 1 / 0;
            Array.from(this.inner.children).forEach((e4) => {
              const s4 = e4.getBoundingClientRect(), o3 = this.inner.getBoundingClientRect(), l3 = s4.left + s4.width / 2 - o3.left, a3 = Math.abs(t3 - (o3.left + l3));
              a3 < n3 && (n3 = a3, i3 = e4);
            }), i3 && (s3 = Array.from(this.slides).findIndex((e4) => e4 === i3)), this.setIndex(s3), this.dots && this.setCurrentDot();
          }
          prevClick() {
            this.goToPrev(), this.isAutoPlay && (this.resetTimer(), this.setTimer());
          }
          nextClick() {
            this.goToNext(), this.isAutoPlay && (this.resetTimer(), this.setTimer());
          }
          containerScroll() {
            clearTimeout(this.isScrolling), this.isScrolling = setTimeout(() => {
              this.setIsSnap();
            }, 100);
          }
          elementTouchStart(e3) {
            this.touchX.start = e3.changedTouches[0].screenX, this.touchY.start = e3.changedTouches[0].screenY;
          }
          elementTouchEnd(e3) {
            this.touchX.end = e3.changedTouches[0].screenX, this.touchY.end = e3.changedTouches[0].screenY, this.detectDirection();
          }
          innerMouseDown(e3) {
            this.handleDragStart(e3);
          }
          innerTouchStart(e3) {
            this.handleDragStart(e3);
          }
          documentMouseMove(e3) {
            this.handleDragMove(e3);
          }
          documentTouchMove(e3) {
            this.handleDragMove(e3);
          }
          documentMouseUp() {
            this.handleDragEnd();
          }
          documentTouchEnd() {
            this.handleDragEnd();
          }
          dotClick(e3) {
            this.goTo(e3), this.isAutoPlay && (this.resetTimer(), this.setTimer());
          }
          init() {
            this.createCollection(window.$hsCarouselCollection, this), this.inner && (this.calculateWidth(), this.isDraggable && !this.isSnap && this.initDragHandling()), this.prev && (this.onPrevClickListener = () => this.prevClick(), this.prev.addEventListener("click", this.onPrevClickListener)), this.next && (this.onNextClickListener = () => this.nextClick(), this.next.addEventListener("click", this.onNextClickListener)), this.dots && this.initDots(), this.info && this.buildInfo(), this.slides.length && (this.addCurrentClass(), this.isInfiniteLoop || this.addDisabledClass(), this.isAutoPlay && this.autoPlay()), setTimeout(() => {
              this.isSnap && this.setIsSnap(), this.loadingClassesRemove && ("string" == typeof this.loadingClassesRemove ? this.inner.classList.remove(this.loadingClassesRemove) : this.inner.classList.remove(...this.loadingClassesRemove)), this.loadingClassesAdd && ("string" == typeof this.loadingClassesAdd ? this.inner.classList.add(this.loadingClassesAdd) : this.inner.classList.add(...this.loadingClassesAdd)), this.inner && this.afterLoadingClassesAdd && setTimeout(() => {
                "string" == typeof this.afterLoadingClassesAdd ? this.inner.classList.add(this.afterLoadingClassesAdd) : this.inner.classList.add(...this.afterLoadingClassesAdd);
              });
            }, 400), this.isSnap && (this.onContainerScrollListener = () => this.containerScroll(), this.container.addEventListener("scroll", this.onContainerScrollListener)), this.el.classList.add("init"), this.isSnap || (this.onElementTouchStartListener = (e3) => this.elementTouchStart(e3), this.onElementTouchEndListener = (e3) => this.elementTouchEnd(e3), this.el.addEventListener("touchstart", this.onElementTouchStartListener), this.el.addEventListener("touchend", this.onElementTouchEndListener)), this.observeResize();
          }
          initDragHandling() {
            const e3 = this.inner;
            this.onInnerMouseDownListener = (e4) => this.innerMouseDown(e4), this.onInnerTouchStartListener = (e4) => this.innerTouchStart(e4), this.onDocumentMouseMoveListener = (e4) => this.documentMouseMove(e4), this.onDocumentTouchMoveListener = (e4) => this.documentTouchMove(e4), this.onDocumentMouseUpListener = () => this.documentMouseUp(), this.onDocumentTouchEndListener = () => this.documentTouchEnd(), e3 && (e3.addEventListener("mousedown", this.onInnerMouseDownListener), e3.addEventListener("touchstart", this.onInnerTouchStartListener, { passive: true }), document.addEventListener("mousemove", this.onDocumentMouseMoveListener), document.addEventListener("touchmove", this.onDocumentTouchMoveListener, { passive: false }), document.addEventListener("mouseup", this.onDocumentMouseUpListener), document.addEventListener("touchend", this.onDocumentTouchEndListener));
          }
          getTranslateXValue() {
            var e3;
            const t3 = window.getComputedStyle(this.inner).transform;
            if ("none" !== t3) {
              const i3 = null === (e3 = t3.match(/matrix.*\((.+)\)/)) || void 0 === e3 ? void 0 : e3[1].split(", ");
              if (i3) {
                let e4 = parseFloat(6 === i3.length ? i3[4] : i3[12]);
                return this.isRTL && (e4 = -e4), isNaN(e4) || 0 === e4 ? 0 : -e4;
              }
            }
            return 0;
          }
          removeClickEventWhileDragging(e3) {
            e3.preventDefault();
          }
          handleDragStart(e3) {
            e3.preventDefault(), this.isDragging = true, this.dragStartX = this.getEventX(e3), this.initialTranslateX = this.isRTL ? this.getTranslateXValue() : -this.getTranslateXValue(), this.inner.classList.add("dragging");
          }
          handleDragMove(e3) {
            if (!this.isDragging) return;
            this.inner.querySelectorAll("a:not(.prevented-click)").forEach((e4) => {
              e4.classList.add("prevented-click"), e4.addEventListener("click", this.removeClickEventWhileDragging);
            });
            let t3 = this.getEventX(e3) - this.dragStartX;
            this.isRTL && (t3 = -t3);
            const i3 = this.initialTranslateX + t3;
            this.setTranslate((() => {
              let e4 = this.sliderWidth * this.slides.length / this.getCurrentSlidesQty() - this.sliderWidth;
              const t4 = this.sliderWidth, s3 = (t4 - t4 / this.getCurrentSlidesQty()) / 2, n3 = this.isCentered ? s3 : 0;
              this.isCentered && (e4 += s3);
              const o3 = -e4;
              return this.isRTL ? i3 < n3 ? n3 : i3 > e4 ? o3 : -i3 : i3 > n3 ? n3 : i3 < -e4 ? o3 : i3;
            })());
          }
          handleDragEnd() {
            if (!this.isDragging) return;
            this.isDragging = false;
            const e3 = this.sliderWidth / this.getCurrentSlidesQty(), t3 = this.getTranslateXValue();
            let i3 = Math.round(t3 / e3);
            this.isRTL && (i3 = Math.round(t3 / e3)), this.inner.classList.remove("dragging"), setTimeout(() => {
              this.calculateTransform(i3), this.dots && this.setCurrentDot(), this.dragStartX = null, this.initialTranslateX = null, this.inner.querySelectorAll("a.prevented-click").forEach((e4) => {
                e4.classList.remove("prevented-click"), e4.removeEventListener("click", this.removeClickEventWhileDragging);
              });
            });
          }
          getEventX(e3) {
            return e3 instanceof MouseEvent ? e3.clientX : e3.touches[0].clientX;
          }
          getCurrentSlidesQty() {
            if ("object" == typeof this.slidesQty) {
              const e3 = document.body.clientWidth;
              let t3 = 0;
              return Object.keys(this.slidesQty).forEach((i3) => {
                e3 >= (typeof i3 + 1 == "number" ? this.slidesQty[i3] : o2.LO[i3]) && (t3 = this.slidesQty[i3]);
              }), t3;
            }
            return this.slidesQty;
          }
          buildSnapSpacers() {
            const e3 = this.inner.querySelector(".hs-snap-before"), t3 = this.inner.querySelector(".hs-snap-after");
            e3 && e3.remove(), t3 && t3.remove();
            const i3 = this.sliderWidth, n3 = i3 / 2 - i3 / this.getCurrentSlidesQty() / 2, o3 = (0, s2.fc)(`<div class="hs-snap-before" style="height: 100%; width: ${n3}px"></div>`), l3 = (0, s2.fc)(`<div class="hs-snap-after" style="height: 100%; width: ${n3}px"></div>`);
            this.inner.prepend(o3), this.inner.appendChild(l3);
          }
          initDots() {
            this.el.querySelectorAll(".hs-carousel-pagination-item").length ? this.setDots() : this.buildDots(), this.dots && this.setCurrentDot();
          }
          buildDots() {
            this.dots.innerHTML = "";
            const e3 = !this.isCentered && this.slidesQty ? this.slides.length - (this.getCurrentSlidesQty() - 1) : this.slides.length;
            for (let t3 = 0; t3 < e3; t3++) {
              const e4 = this.buildSingleDot(t3);
              this.dots.append(e4);
            }
          }
          setDots() {
            this.dotsItems = this.dots.querySelectorAll(".hs-carousel-pagination-item"), this.dotsItems.forEach((e3, t3) => {
              const i3 = e3.getAttribute("data-carousel-pagination-item-target");
              this.singleDotEvents(e3, i3 ? +i3 : t3);
            });
          }
          goToCurrentDot() {
            const e3 = this.dots, t3 = e3.getBoundingClientRect(), i3 = e3.scrollLeft, s3 = e3.scrollTop, n3 = e3.clientWidth, o3 = e3.clientHeight, l3 = this.dotsItems[this.currentIndex], a3 = l3.getBoundingClientRect(), r2 = a3.left - t3.left + i3, c2 = r2 + l3.clientWidth, d2 = a3.top - t3.top + s3, h2 = d2 + l3.clientHeight;
            let u2 = i3, p2 = s3;
            (r2 < i3 || c2 > i3 + n3) && (u2 = c2 - n3), (d2 < s3 || h2 > s3 + o3) && (p2 = h2 - o3), e3.scrollTo({ left: u2, top: p2, behavior: "smooth" });
          }
          buildInfo() {
            this.infoTotal && this.setInfoTotal(), this.infoCurrent && this.setInfoCurrent();
          }
          setInfoTotal() {
            this.infoTotal.innerText = `${this.slides.length}`;
          }
          setInfoCurrent() {
            this.infoCurrent.innerText = `${this.currentIndex + 1}`;
          }
          buildSingleDot(e3) {
            const t3 = (0, s2.fc)("<span></span>");
            return this.dotsItemClasses && (0, s2.en)(this.dotsItemClasses, t3), this.singleDotEvents(t3, e3), t3;
          }
          singleDotEvents(e3, t3) {
            this.onDotClickListener = () => this.dotClick(t3), e3.addEventListener("click", this.onDotClickListener);
          }
          observeResize() {
            new ResizeObserver((0, s2.sg)((e3) => {
              for (let t3 of e3) {
                const e4 = t3.contentRect.width;
                e4 !== this.resizeContainerWidth && (this.recalculateWidth(), this.dots && this.initDots(), this.addCurrentClass(), this.resizeContainerWidth = e4);
              }
            }, this.updateDelay)).observe(this.resizeContainer);
          }
          calculateWidth() {
            this.isSnap || (this.inner.style.width = this.sliderWidth * this.slides.length / this.getCurrentSlidesQty() + "px"), this.slides.forEach((e3) => {
              e3.style.width = this.sliderWidth / this.getCurrentSlidesQty() + "px";
            }), this.calculateTransform();
          }
          addCurrentClass() {
            if (this.isSnap) {
              const e3 = Math.floor(this.getCurrentSlidesQty() / 2);
              for (let t3 = 0; t3 < this.slides.length; t3++) {
                const i3 = this.slides[t3];
                t3 <= this.currentIndex + e3 && t3 >= this.currentIndex - e3 ? i3.classList.add("active") : i3.classList.remove("active");
              }
            } else {
              const e3 = this.isCentered ? this.currentIndex + this.getCurrentSlidesQty() + (this.getCurrentSlidesQty() - 1) : this.currentIndex + this.getCurrentSlidesQty();
              this.slides.forEach((t3, i3) => {
                i3 >= this.currentIndex && i3 < e3 ? t3.classList.add("active") : t3.classList.remove("active");
              });
            }
          }
          setCurrentDot() {
            const e3 = (e4, t3) => {
              let i3 = false;
              const s3 = Math.floor(this.getCurrentSlidesQty() / 2);
              i3 = this.isSnap && !this.hasSnapSpacers ? t3 === (this.getCurrentSlidesQty() % 2 == 0 ? this.currentIndex - s3 + 1 : this.currentIndex - s3) : t3 === this.currentIndex, i3 ? e4.classList.add("active") : e4.classList.remove("active");
            };
            this.dotsItems ? this.dotsItems.forEach((t3, i3) => e3(t3, i3)) : this.dots.querySelectorAll(":scope > *").forEach((t3, i3) => e3(t3, i3));
          }
          setElementToDisabled(e3) {
            e3.classList.add("disabled"), "BUTTON" !== e3.tagName && "INPUT" !== e3.tagName || e3.setAttribute("disabled", "disabled");
          }
          unsetElementToDisabled(e3) {
            e3.classList.remove("disabled"), "BUTTON" !== e3.tagName && "INPUT" !== e3.tagName || e3.removeAttribute("disabled");
          }
          addDisabledClass() {
            if (!this.prev || !this.next) return false;
            const e3 = getComputedStyle(this.inner).getPropertyValue("gap"), t3 = Math.floor(this.getCurrentSlidesQty() / 2);
            let i3 = 0, s3 = 0, n3 = false, o3 = false;
            this.isSnap ? (i3 = this.currentIndex, s3 = this.hasSnapSpacers ? this.slides.length - 1 : this.slides.length - t3 - 1, n3 = this.hasSnapSpacers ? 0 === i3 : this.getCurrentSlidesQty() % 2 == 0 ? i3 - t3 < 0 : i3 - t3 === 0, o3 = i3 >= s3 && this.container.scrollLeft + this.container.clientWidth + (parseFloat(e3) || 0) >= this.container.scrollWidth) : (i3 = this.currentIndex, s3 = this.isCentered ? this.slides.length - this.getCurrentSlidesQty() + (this.getCurrentSlidesQty() - 1) : this.slides.length - this.getCurrentSlidesQty(), n3 = 0 === i3, o3 = i3 >= s3), n3 ? (this.unsetElementToDisabled(this.next), this.setElementToDisabled(this.prev)) : o3 ? (this.unsetElementToDisabled(this.prev), this.setElementToDisabled(this.next)) : (this.unsetElementToDisabled(this.prev), this.unsetElementToDisabled(this.next));
          }
          autoPlay() {
            this.setTimer();
          }
          setTimer() {
            this.timer = setInterval(() => {
              this.currentIndex === this.slides.length - 1 ? this.goTo(0) : this.goToNext();
            }, this.speed);
          }
          resetTimer() {
            clearInterval(this.timer);
          }
          detectDirection() {
            const e3 = this.touchX.end - this.touchX.start, t3 = this.touchY.end - this.touchY.start, i3 = Math.abs(e3), s3 = Math.abs(t3);
            if (i3 < 30 || i3 < s3) return;
            const n3 = this.isRTL ? e3 > 0 : e3 < 0;
            this.isInfiniteLoop ? n3 ? this.goToNext() : this.goToPrev() : (n3 && this.currentIndex < this.slides.length - this.getCurrentSlidesQty() && this.goToNext(), !n3 && this.currentIndex > 0 && this.goToPrev());
          }
          calculateTransform(e3) {
            void 0 !== e3 && (this.currentIndex = e3);
            const t3 = this.sliderWidth, i3 = t3 / this.getCurrentSlidesQty();
            let s3 = this.currentIndex * i3;
            if (this.isSnap && !this.isCentered && this.container.scrollLeft < t3 && this.container.scrollLeft + i3 / 2 > t3 && (this.container.scrollLeft = this.container.scrollWidth), this.isCentered && !this.isSnap) {
              const e4 = (t3 - i3) / 2;
              if (0 === this.currentIndex) s3 = -e4;
              else if (this.currentIndex >= this.slides.length - this.getCurrentSlidesQty() + (this.getCurrentSlidesQty() - 1)) {
                s3 = this.slides.length * i3 - t3 + e4;
              } else s3 = this.currentIndex * i3 - e4;
            }
            this.isSnap || this.setTransform(s3), this.isAutoHeight && (this.inner.style.height = `${this.slides[this.currentIndex].clientHeight}px`), this.dotsItems && this.goToCurrentDot(), this.addCurrentClass(), this.isInfiniteLoop || this.addDisabledClass(), this.isSnap && this.hasSnapSpacers && this.buildSnapSpacers(), this.infoCurrent && this.setInfoCurrent();
          }
          setTransform(e3) {
            this.slides.length > this.getCurrentSlidesQty() ? this.inner.style.transform = this.isRTL ? `translate(${e3}px, 0px)` : `translate(${-e3}px, 0px)` : this.inner.style.transform = "translate(0px, 0px)";
          }
          setTranslate(e3) {
            this.inner.style.transform = this.isRTL ? `translate(${-e3}px, 0px)` : `translate(${e3}px, 0px)`;
          }
          setIndex(e3) {
            this.currentIndex = e3, this.addCurrentClass(), this.isInfiniteLoop || this.addDisabledClass();
          }
          recalculateWidth() {
            this.sliderWidth = this.inner.parentElement.getBoundingClientRect().width, this.calculateWidth(), this.sliderWidth !== this.inner.parentElement.getBoundingClientRect().width && this.recalculateWidth();
          }
          goToPrev() {
            if (this.currentIndex > 0 ? this.currentIndex-- : this.currentIndex = this.slides.length - this.getCurrentSlidesQty(), this.fireEvent("update", this.currentIndex), this.isSnap) {
              const e3 = this.sliderWidth / this.getCurrentSlidesQty();
              this.container.scrollBy({ left: Math.max(-this.container.scrollLeft, -e3), behavior: "smooth" }), this.addCurrentClass(), this.isInfiniteLoop || this.addDisabledClass();
            } else this.calculateTransform();
            this.dots && this.setCurrentDot();
          }
          goToNext() {
            const e3 = this.isCentered ? this.slides.length - this.getCurrentSlidesQty() + (this.getCurrentSlidesQty() - 1) : this.slides.length - this.getCurrentSlidesQty();
            if (this.currentIndex < e3 ? this.currentIndex++ : this.currentIndex = 0, this.fireEvent("update", this.currentIndex), this.isSnap) {
              const e4 = this.sliderWidth / this.getCurrentSlidesQty(), t3 = this.container.scrollWidth - this.container.clientWidth;
              this.container.scrollBy({ left: Math.min(e4, t3 - this.container.scrollLeft), behavior: "smooth" }), this.addCurrentClass(), this.isInfiniteLoop || this.addDisabledClass();
            } else this.calculateTransform();
            this.dots && this.setCurrentDot();
          }
          goTo(e3) {
            const t3 = this.currentIndex;
            if (this.currentIndex = e3, this.fireEvent("update", this.currentIndex), this.isSnap) {
              const e4 = this.sliderWidth / this.getCurrentSlidesQty(), i3 = t3 > this.currentIndex ? t3 - this.currentIndex : this.currentIndex - t3, s3 = t3 > this.currentIndex ? -e4 * i3 : e4 * i3;
              this.container.scrollBy({ left: s3, behavior: "smooth" }), this.addCurrentClass(), this.isInfiniteLoop || this.addDisabledClass();
            } else this.calculateTransform();
            this.dots && this.setCurrentDot();
          }
          destroy() {
            var e3, t3;
            if (this.loadingClassesAdd && ("string" == typeof this.loadingClassesAdd ? this.inner.classList.remove(this.loadingClassesAdd) : this.inner.classList.remove(...this.loadingClassesAdd)), this.inner && this.afterLoadingClassesAdd && setTimeout(() => {
              "string" == typeof this.afterLoadingClassesAdd ? this.inner.classList.remove(this.afterLoadingClassesAdd) : this.inner.classList.remove(...this.afterLoadingClassesAdd);
            }), this.el.classList.remove("init"), this.inner.classList.remove("dragging"), this.slides.forEach((e4) => e4.classList.remove("active")), (null === (e3 = null == this ? void 0 : this.dotsItems) || void 0 === e3 ? void 0 : e3.length) && this.dotsItems.forEach((e4) => e4.classList.remove("active")), this.prev.classList.remove("disabled"), this.next.classList.remove("disabled"), this.inner.style.width = "", this.slides.forEach((e4) => e4.style.width = ""), this.isSnap || (this.inner.style.transform = ""), this.isAutoHeight && (this.inner.style.height = ""), this.prev.removeEventListener("click", this.onPrevClickListener), this.next.removeEventListener("click", this.onNextClickListener), this.container.removeEventListener("scroll", this.onContainerScrollListener), this.el.removeEventListener("touchstart", this.onElementTouchStartListener), this.el.removeEventListener("touchend", this.onElementTouchEndListener), this.inner.removeEventListener("mousedown", this.onInnerMouseDownListener), this.inner.removeEventListener("touchstart", this.onInnerTouchStartListener), document.removeEventListener("mousemove", this.onDocumentMouseMoveListener), document.removeEventListener("touchmove", this.onDocumentTouchMoveListener), document.removeEventListener("mouseup", this.onDocumentMouseUpListener), document.removeEventListener("touchend", this.onDocumentTouchEndListener), this.inner.querySelectorAll("a:not(.prevented-click)").forEach((e4) => {
              e4.classList.remove("prevented-click"), e4.removeEventListener("click", this.removeClickEventWhileDragging);
            }), (null === (t3 = null == this ? void 0 : this.dotsItems) || void 0 === t3 ? void 0 : t3.length) || this.dots.querySelectorAll(":scope > *").length) {
              ((null == this ? void 0 : this.dotsItems) || this.dots.querySelectorAll(":scope > *")).forEach((e4) => e4.removeEventListener("click", this.onDotClickListener)), this.dots.innerHTML = null;
            }
            this.isSnap && this.hasSnapSpacers && (this.inner.querySelector(".hs-snap-before").remove(), this.inner.querySelector(".hs-snap-after").remove()), this.dotsItems = null, this.isDragging = false, this.dragStartX = null, this.initialTranslateX = null, window.$hsCarouselCollection = window.$hsCarouselCollection.filter(({ element: e4 }) => e4.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsCarouselCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsCarouselCollection || (window.$hsCarouselCollection = []), window.$hsCarouselCollection && (window.$hsCarouselCollection = window.$hsCarouselCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-carousel]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsCarouselCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new l2(e3);
            });
          }
        }
        const a2 = l2;
      }, 9632(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3, i3) {
            super(e3, t3, i3), this.contentId = this.el.dataset.hsCollapse, this.content = document.querySelector(this.contentId), this.animationInProcess = false, this.content && this.init();
          }
          elementClick() {
            this.content.classList.contains("open") ? this.hide() : this.show();
          }
          init() {
            var e3;
            this.createCollection(window.$hsCollapseCollection, this), this.onElementClickListener = () => this.elementClick(), (null === (e3 = null == this ? void 0 : this.el) || void 0 === e3 ? void 0 : e3.ariaExpanded) && (this.el.classList.contains("open") ? this.el.ariaExpanded = "true" : this.el.ariaExpanded = "false"), this.el.addEventListener("click", this.onElementClickListener);
          }
          hideAllMegaMenuItems() {
            this.content.querySelectorAll(".hs-mega-menu-content.block").forEach((e3) => {
              e3.classList.remove("block"), e3.classList.add("hidden");
            });
          }
          show() {
            var e3;
            if (this.animationInProcess || this.el.classList.contains("open")) return false;
            this.animationInProcess = true, this.el.classList.add("open"), (null === (e3 = null == this ? void 0 : this.el) || void 0 === e3 ? void 0 : e3.ariaExpanded) && (this.el.ariaExpanded = "true"), this.content.classList.add("open"), this.content.classList.remove("hidden"), this.content.style.height = "0", setTimeout(() => {
              this.content.style.height = `${this.content.scrollHeight}px`, this.fireEvent("beforeOpen", this.el), (0, s2.JD)("beforeOpen.hs.collapse", this.el, this.el), (0, s2.yd)(this.content, () => {
                this.content.style.height = "", this.fireEvent("open", this.el), (0, s2.JD)("open.hs.collapse", this.el, this.el), this.animationInProcess = false;
              });
            });
          }
          hide() {
            var e3;
            if (this.animationInProcess || !this.el.classList.contains("open")) return false;
            this.animationInProcess = true, this.el.classList.remove("open"), (null === (e3 = null == this ? void 0 : this.el) || void 0 === e3 ? void 0 : e3.ariaExpanded) && (this.el.ariaExpanded = "false"), this.content.style.height = `${this.content.scrollHeight}px`, setTimeout(() => {
              this.content.style.height = "0";
            }), this.content.classList.remove("open"), (0, s2.yd)(this.content, () => {
              this.content.classList.add("hidden"), this.content.style.height = "", this.fireEvent("hide", this.el), (0, s2.JD)("hide.hs.collapse", this.el, this.el), this.animationInProcess = false;
            }), this.content.querySelectorAll(".hs-mega-menu-content.block").length && this.hideAllMegaMenuItems();
          }
          destroy() {
            this.el.removeEventListener("click", this.onElementClickListener), this.content = null, this.animationInProcess = false, window.$hsCollapseCollection = window.$hsCollapseCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static findInCollection(e3) {
            return window.$hsCollapseCollection.find((t3) => e3 instanceof o2 ? t3.element.el === e3.el : "string" == typeof e3 ? t3.element.el === document.querySelector(e3) : t3.element.el === e3) || null;
          }
          static getInstance(e3, t3 = false) {
            const i3 = window.$hsCollapseCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsCollapseCollection || (window.$hsCollapseCollection = []), window.$hsCollapseCollection && (window.$hsCollapseCollection = window.$hsCollapseCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll(".hs-collapse-toggle:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsCollapseCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
          static show(e3) {
            const t3 = o2.findInCollection(e3);
            t3 && t3.element.content.classList.contains("hidden") && t3.element.show();
          }
          static hide(e3) {
            const t3 = o2.findInCollection(e3);
            t3 && !t3.element.content.classList.contains("hidden") && t3.element.hide();
          }
          static on(e3, t3, i3) {
            const s3 = o2.findInCollection(t3);
            s3 && (s3.element.events[e3] = i3);
          }
        }
        const l2 = o2;
      }, 3200(e2, t2, i2) {
        i2.d(t2, { A: () => r2 });
        var s2 = i2(1926), n2 = i2(7615), o2 = i2(8862), l2 = function(e3, t3, i3, s3) {
          return new (i3 || (i3 = Promise))(function(n3, o3) {
            function l3(e4) {
              try {
                r3(s3.next(e4));
              } catch (e5) {
                o3(e5);
              }
            }
            function a3(e4) {
              try {
                r3(s3.throw(e4));
              } catch (e5) {
                o3(e5);
              }
            }
            function r3(e4) {
              var t4;
              e4.done ? n3(e4.value) : (t4 = e4.value, t4 instanceof i3 ? t4 : new i3(function(e5) {
                e5(t4);
              })).then(l3, a3);
            }
            r3((s3 = s3.apply(e3, t3 || [])).next());
          });
        };
        class a2 extends n2.A {
          constructor(e3, t3, i3) {
            var s3, n3, o3, l3, a3, r3, c2, d2, h2, u2, p2, m2, g2, v2, f2, y2, b2, w2, C2, x2, S2, k2, L2, E2, T2, A2, I2, M2, D2, O2, $2;
            super(e3, t3, i3), this.isSearchLengthExceeded = false, this.lastQuery = "";
            const P2 = e3.getAttribute("data-hs-combo-box"), N = P2 ? JSON.parse(P2) : {}, H = Object.assign(Object.assign({}, N), t3);
            this.gap = 5, this.viewport = null !== (s3 = "string" == typeof (null == H ? void 0 : H.viewport) ? document.querySelector(null == H ? void 0 : H.viewport) : null == H ? void 0 : H.viewport) && void 0 !== s3 ? s3 : null, this.preventVisibility = null !== (n3 = null == H ? void 0 : H.preventVisibility) && void 0 !== n3 && n3, this.minSearchLength = null !== (o3 = null == H ? void 0 : H.minSearchLength) && void 0 !== o3 ? o3 : 0, this.apiUrl = null !== (l3 = null == H ? void 0 : H.apiUrl) && void 0 !== l3 ? l3 : null, this.apiDataPart = null !== (a3 = null == H ? void 0 : H.apiDataPart) && void 0 !== a3 ? a3 : null, this.apiQuery = null !== (r3 = null == H ? void 0 : H.apiQuery) && void 0 !== r3 ? r3 : null, this.apiSearchQuery = null !== (c2 = null == H ? void 0 : H.apiSearchQuery) && void 0 !== c2 ? c2 : null, this.apiSearchPath = null !== (d2 = null == H ? void 0 : H.apiSearchPath) && void 0 !== d2 ? d2 : null, this.apiSearchDefaultPath = null !== (h2 = null == H ? void 0 : H.apiSearchDefaultPath) && void 0 !== h2 ? h2 : null, this.apiHeaders = null !== (u2 = null == H ? void 0 : H.apiHeaders) && void 0 !== u2 ? u2 : {}, this.apiGroupField = null !== (p2 = null == H ? void 0 : H.apiGroupField) && void 0 !== p2 ? p2 : null, this.outputItemTemplate = null !== (m2 = null == H ? void 0 : H.outputItemTemplate) && void 0 !== m2 ? m2 : '<div class="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" data-hs-combo-box-output-item>\n				<div class="flex justify-between items-center w-full">\n					<span data-hs-combo-box-search-text></span>\n					<span class="hidden hs-combo-box-selected:block">\n						<svg class="shrink-0 size-3.5 text-blue-600 dark:text-blue-500" xmlns="http:.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n							<polyline points="20 6 9 17 4 12"></polyline>\n						</svg>\n					</span>\n				</div>\n			</div>', this.outputEmptyTemplate = null !== (g2 = null == H ? void 0 : H.outputEmptyTemplate) && void 0 !== g2 ? g2 : '<div class="py-2 px-4 w-full text-sm text-gray-800 rounded-lg dark:bg-neutral-900 dark:text-neutral-200">Nothing found...</div>', this.outputLoaderTemplate = null !== (v2 = null == H ? void 0 : H.outputLoaderTemplate) && void 0 !== v2 ? v2 : '<div class="flex justify-center items-center py-2 px-4 text-sm text-gray-800 rounded-lg bg-white dark:bg-neutral-900 dark:text-neutral-200">\n				<div class="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-blue-600 rounded-[999px] dark:text-blue-500" role="status" aria-label="loading">\n					<span class="sr-only">Loading...</span>\n				</div>\n			</div>', this.groupingType = null !== (f2 = null == H ? void 0 : H.groupingType) && void 0 !== f2 ? f2 : null, this.groupingTitleTemplate = null !== (y2 = null == H ? void 0 : H.groupingTitleTemplate) && void 0 !== y2 ? y2 : "default" === this.groupingType ? '<div class="block mb-1 text-xs font-semibold uppercase text-blue-600 dark:text-blue-500"></div>' : '<button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold whitespace-nowrap rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"></button>', this.tabsWrapperTemplate = null !== (b2 = null == H ? void 0 : H.tabsWrapperTemplate) && void 0 !== b2 ? b2 : '<div class="overflow-x-auto p-4"></div>', this.preventSelection = null !== (w2 = null == H ? void 0 : H.preventSelection) && void 0 !== w2 && w2, this.preventAutoPosition = null !== (C2 = null == H ? void 0 : H.preventAutoPosition) && void 0 !== C2 && C2, this.preventClientFiltering = null !== (x2 = null == t3 ? void 0 : t3.preventClientFiltering) && void 0 !== x2 ? x2 : !!(null == H ? void 0 : H.apiSearchQuery) || !!(null == H ? void 0 : H.apiSearchPath), this.isOpenOnFocus = null !== (S2 = null == H ? void 0 : H.isOpenOnFocus) && void 0 !== S2 && S2, this.keepOriginalOrder = null !== (k2 = null == H ? void 0 : H.keepOriginalOrder) && void 0 !== k2 && k2, this.preserveSelectionOnEmpty = null === (L2 = null == H ? void 0 : H.preserveSelectionOnEmpty) || void 0 === L2 || L2, this.input = null !== (E2 = this.el.querySelector("[data-hs-combo-box-input]")) && void 0 !== E2 ? E2 : null, this.output = null !== (T2 = this.el.querySelector("[data-hs-combo-box-output]")) && void 0 !== T2 ? T2 : null, this.itemsWrapper = null !== (A2 = this.el.querySelector("[data-hs-combo-box-output-items-wrapper]")) && void 0 !== A2 ? A2 : null, this.items = null !== (I2 = Array.from(this.el.querySelectorAll("[data-hs-combo-box-output-item]"))) && void 0 !== I2 ? I2 : [], this.tabs = [], this.toggle = null !== (M2 = this.el.querySelector("[data-hs-combo-box-toggle]")) && void 0 !== M2 ? M2 : null, this.toggleClose = null !== (D2 = this.el.querySelector("[data-hs-combo-box-close]")) && void 0 !== D2 ? D2 : null, this.toggleOpen = null !== (O2 = this.el.querySelector("[data-hs-combo-box-open]")) && void 0 !== O2 ? O2 : null, this.outputPlaceholder = null, this.selected = this.value = null !== ($2 = this.el.querySelector("[data-hs-combo-box-input]").value) && void 0 !== $2 ? $2 : "", this.currentData = null, this.isOpened = false, this.isCurrent = false, this.animationInProcess = false, this.selectedGroup = "all", this.init();
          }
          inputFocus() {
            this.isOpened || (this.setResultAndRender(), this.open());
          }
          inputInput() {
            const e3 = this.input.value.trim();
            e3.length <= this.minSearchLength ? this.setResultAndRender("") : this.setResultAndRender(e3), this.preserveSelectionOnEmpty || "" !== e3 || (this.selected = "", this.value = "", this.currentData = null), "" !== this.input.value ? this.el.classList.add("has-value") : this.el.classList.remove("has-value"), this.isOpened || this.open();
          }
          toggleClick() {
            this.isOpened ? this.close() : this.open(this.toggle.getAttribute("data-hs-combo-box-toggle"));
          }
          toggleCloseClick() {
            this.close();
          }
          toggleOpenClick() {
            this.open();
          }
          init() {
            a2.ensureGlobalHandlers(), this.createCollection(window.$hsComboBoxCollection, this), this.build(), "undefined" != typeof window && (window.HSAccessibilityObserver || (window.HSAccessibilityObserver = new o2.A()), this.setupAccessibility());
          }
          build() {
            this.buildInput(), this.groupingType && this.setGroups(), this.buildItems(), this.preventVisibility && (this.preventAutoPosition || this.recalculateDirection()), this.toggle && this.buildToggle(), this.toggleClose && this.buildToggleClose(), this.toggleOpen && this.buildToggleOpen();
          }
          getNestedProperty(e3, t3) {
            return t3.split(".").reduce((e4, t4) => e4 && e4[t4], e3);
          }
          setValue(e3, t3 = null) {
            this.selected = e3, this.value = e3, this.input.value = e3, t3 && (this.currentData = t3), this.fireEvent("select", this.currentData), (0, s2.JD)("select.hs.combobox", this.el, this.currentData);
          }
          setValueAndOpen(e3) {
            this.value = e3, this.items.length && this.setItemsVisibility();
          }
          setValueAndClear(e3, t3 = null) {
            e3 ? this.setValue(e3, t3) : this.setValue(this.selected, t3), this.outputPlaceholder && this.destroyOutputPlaceholder();
          }
          setSelectedByValue(e3) {
            this.items.forEach((t3) => {
              const i3 = t3.querySelector("[data-hs-combo-box-value]");
              i3 && e3.includes(i3.textContent) ? t3.classList.add("selected") : t3.classList.remove("selected");
            });
          }
          setResultAndRender(e3 = "") {
            const t3 = (this.preventVisibility ? this.input.value : e3).trim(), i3 = t3.length < this.minSearchLength;
            this.isSearchLengthExceeded = i3, t3 !== this.lastQuery ? (this.lastQuery = t3, this.setResults(t3), !i3 && (this.apiSearchQuery || this.apiSearchPath || this.apiSearchDefaultPath) && this.itemsFromJson(), this.updatePlaceholderVisibility()) : this.updatePlaceholderVisibility();
          }
          setResults(e3) {
            this.value = e3, this.resultItems(), this.updatePlaceholderVisibility();
          }
          updatePlaceholderVisibility() {
            this.hasVisibleItems() ? this.destroyOutputPlaceholder() : this.buildOutputPlaceholder();
          }
          setGroups() {
            const e3 = [];
            this.items.forEach((t3) => {
              const { group: i3 } = JSON.parse(t3.getAttribute("data-hs-combo-box-output-item"));
              e3.some((e4) => (null == e4 ? void 0 : e4.name) === i3.name) || e3.push(i3);
            }), this.groups = e3;
          }
          setApiGroups(e3) {
            const t3 = [];
            e3.forEach((e4) => {
              const i3 = e4[this.apiGroupField];
              t3.some((e5) => e5.name === i3) || t3.push({ name: i3, title: i3 });
            }), this.groups = t3;
          }
          setItemsVisibility() {
            if (this.preventClientFiltering) return this.items.forEach((e4) => {
              e4.style.display = "";
            }), false;
            "tabs" === this.groupingType && "all" !== this.selectedGroup && this.items.forEach((e4) => {
              e4.style.display = "none";
            });
            const e3 = "tabs" === this.groupingType ? "all" === this.selectedGroup ? this.items : this.items.filter((e4) => {
              const { group: t3 } = JSON.parse(e4.getAttribute("data-hs-combo-box-output-item"));
              return t3.name === this.selectedGroup;
            }) : this.items;
            "tabs" === this.groupingType && "all" !== this.selectedGroup && e3.forEach((e4) => {
              e4.style.display = "block";
            }), e3.forEach((e4) => {
              this.isTextExistsAny(e4, this.value) ? e4.style.display = "block" : e4.style.display = "none";
            }), "default" === this.groupingType && this.output.querySelectorAll("[data-hs-combo-box-group-title]").forEach((e4) => {
              const t3 = e4.getAttribute("data-hs-combo-box-group-title");
              this.items.filter((e5) => {
                const { group: i3 } = JSON.parse(e5.getAttribute("data-hs-combo-box-output-item"));
                return i3.name === t3 && "block" === e5.style.display;
              }).length ? e4.style.display = "block" : e4.style.display = "none";
            });
          }
          isTextExistsAny(e3, t3) {
            return Array.from(e3.querySelectorAll("[data-hs-combo-box-search-text]")).some((e4) => e4.getAttribute("data-hs-combo-box-search-text").toLowerCase().includes(t3.toLowerCase()));
          }
          hasVisibleItems() {
            return !!this.items.length && this.items.some((e3) => {
              const t3 = window.getComputedStyle(e3);
              return "none" !== t3.display && "hidden" !== t3.visibility;
            });
          }
          valuesBySelector(e3) {
            return Array.from(e3.querySelectorAll("[data-hs-combo-box-search-text]")).reduce((e4, t3) => [...e4, t3.getAttribute("data-hs-combo-box-search-text")], []);
          }
          sortItems() {
            if (this.keepOriginalOrder) return this.items;
            return this.items.sort((e3, t3) => {
              const i3 = e3.querySelector("[data-hs-combo-box-value]").textContent, s3 = t3.querySelector("[data-hs-combo-box-value]").textContent;
              return i3 < s3 ? -1 : i3 > s3 ? 1 : 0;
            });
          }
          buildInput() {
            this.isOpenOnFocus && (this.onInputFocusListener = () => this.inputFocus(), this.input.addEventListener("focus", this.onInputFocusListener)), this.onInputInputListener = (0, s2.sg)(() => this.inputInput()), this.input.addEventListener("input", this.onInputInputListener), this.input.addEventListener("paste", (e3) => {
              var t3, i3, s3, n3, o3;
              const l3 = null !== (i3 = null === (t3 = e3.clipboardData) || void 0 === t3 ? void 0 : t3.getData("text")) && void 0 !== i3 ? i3 : "";
              e3.preventDefault();
              const a3 = null !== (s3 = this.input.selectionStart) && void 0 !== s3 ? s3 : this.input.value.length, r3 = null !== (n3 = this.input.selectionEnd) && void 0 !== n3 ? n3 : this.input.value.length, c2 = this.input.value.slice(0, a3) + l3 + this.input.value.slice(r3);
              this.input.value = c2, null === (o3 = this.onInputInputListener) || void 0 === o3 || o3.call(this, new InputEvent("input", { inputType: "insertFromPaste", data: l3 }));
            });
          }
          buildItems() {
            return l2(this, void 0, void 0, function* () {
              this.output.role = "listbox", this.output.tabIndex = -1, this.output.ariaOrientation = "vertical", this.apiUrl ? yield this.itemsFromJson() : (this.itemsWrapper ? this.itemsWrapper.innerHTML = "" : this.output.innerHTML = "", this.itemsFromHtml()), (null == this ? void 0 : this.items.length) && this.items[0].classList.contains("selected") && (this.currentData = JSON.parse(this.items[0].getAttribute("data-hs-combo-box-item-stored-data")));
            });
          }
          buildOutputLoader() {
            if (this.outputLoader) return false;
            this.outputLoader = (0, s2.fc)(this.outputLoaderTemplate), this.items.length || this.outputPlaceholder ? (this.outputLoader.style.position = "absolute", this.outputLoader.style.top = "0", this.outputLoader.style.bottom = "0", this.outputLoader.style.left = "0", this.outputLoader.style.right = "0", this.outputLoader.style.zIndex = "2") : (this.outputLoader.style.position = "", this.outputLoader.style.top = "", this.outputLoader.style.bottom = "", this.outputLoader.style.left = "", this.outputLoader.style.right = "", this.outputLoader.style.zIndex = "", this.outputLoader.style.height = "30px"), this.output.append(this.outputLoader);
          }
          buildToggle() {
            var e3, t3, i3, s3;
            this.isOpened ? ((null === (e3 = null == this ? void 0 : this.toggle) || void 0 === e3 ? void 0 : e3.ariaExpanded) && (this.toggle.ariaExpanded = "true"), (null === (t3 = null == this ? void 0 : this.input) || void 0 === t3 ? void 0 : t3.ariaExpanded) && (this.input.ariaExpanded = "true")) : ((null === (i3 = null == this ? void 0 : this.toggle) || void 0 === i3 ? void 0 : i3.ariaExpanded) && (this.toggle.ariaExpanded = "false"), (null === (s3 = null == this ? void 0 : this.input) || void 0 === s3 ? void 0 : s3.ariaExpanded) && (this.input.ariaExpanded = "false")), this.onToggleClickListener = () => this.toggleClick(), this.toggle.addEventListener("click", this.onToggleClickListener);
          }
          buildToggleClose() {
            this.onToggleCloseClickListener = () => this.toggleCloseClick(), this.toggleClose.addEventListener("click", this.onToggleCloseClickListener);
          }
          buildToggleOpen() {
            this.onToggleOpenClickListener = () => this.toggleOpenClick(), this.toggleOpen.addEventListener("click", this.onToggleOpenClickListener);
          }
          buildOutputPlaceholder() {
            this.outputPlaceholder || (this.outputPlaceholder = (0, s2.fc)(this.outputEmptyTemplate)), this.appendItemsToWrapper(this.outputPlaceholder);
          }
          destroyOutputLoader() {
            this.outputLoader && this.outputLoader.remove(), this.outputLoader = null;
          }
          itemRender(e3) {
            var t3;
            const i3 = e3.querySelector("[data-hs-combo-box-value]").textContent, s3 = null !== (t3 = JSON.parse(e3.getAttribute("data-hs-combo-box-item-stored-data"))) && void 0 !== t3 ? t3 : null;
            this.itemsWrapper ? this.itemsWrapper.append(e3) : this.output.append(e3), this.preventSelection || e3.addEventListener("click", () => {
              this.close(i3, s3), this.setSelectedByValue(this.valuesBySelector(e3));
            });
          }
          plainRender(e3) {
            e3.forEach((e4) => {
              this.itemRender(e4);
            });
          }
          jsonItemsRender(e3, t3 = 0) {
            e3.forEach((e4) => {
              const i3 = (0, s2.fc)(this.outputItemTemplate);
              i3.setAttribute("data-hs-combo-box-item-stored-data", JSON.stringify(e4)), i3.querySelectorAll("[data-hs-combo-box-output-item-field]").forEach((t4) => {
                const i4 = t4.getAttribute("data-hs-combo-box-output-item-field");
                let s3 = "";
                try {
                  const t5 = JSON.parse(i4);
                  s3 = Array.isArray(t5) ? t5.map((t6) => this.getNestedProperty(e4, t6)).filter(Boolean).join(" ") : this.getNestedProperty(e4, i4);
                } catch (t5) {
                  s3 = this.getNestedProperty(e4, i4);
                }
                t4.textContent = null != s3 ? s3 : "", !s3 && t4.hasAttribute("data-hs-combo-box-output-item-hide-if-empty") && (t4.style.display = "none");
              }), i3.querySelectorAll("[data-hs-combo-box-search-text]").forEach((t4) => {
                const i4 = t4.getAttribute("data-hs-combo-box-output-item-field");
                let s3 = "";
                try {
                  const t5 = JSON.parse(i4);
                  s3 = Array.isArray(t5) ? t5.map((t6) => this.getNestedProperty(e4, t6)).filter(Boolean).join(" ") : this.getNestedProperty(e4, i4);
                } catch (t5) {
                  s3 = this.getNestedProperty(e4, i4);
                }
                t4.setAttribute("data-hs-combo-box-search-text", null != s3 ? s3 : "");
              }), i3.querySelectorAll("[data-hs-combo-box-output-item-attr]").forEach((t4) => {
                JSON.parse(t4.getAttribute("data-hs-combo-box-output-item-attr")).forEach((i4) => {
                  let s3 = e4[i4.valueFrom];
                  "class" === i4.attr && t4.className ? t4.className = `${t4.className} ${s3}`.trim() : t4.setAttribute(i4.attr, s3);
                });
              }), i3.setAttribute("tabIndex", `${t3}`), "tabs" !== this.groupingType && "default" !== this.groupingType || i3.setAttribute("data-hs-combo-box-output-item", `{"group": {"name": "${e4[this.apiGroupField]}", "title": "${e4[this.apiGroupField]}"}}`), this.items = [...this.items, i3], this.preventSelection || i3.addEventListener("click", () => {
                this.close(i3.querySelector("[data-hs-combo-box-value]").textContent, JSON.parse(i3.getAttribute("data-hs-combo-box-item-stored-data"))), this.setSelectedByValue(this.valuesBySelector(i3));
              }), this.appendItemsToWrapper(i3), t3++;
            });
          }
          groupDefaultRender() {
            this.groups.forEach((e3) => {
              const t3 = (0, s2.fc)(this.groupingTitleTemplate);
              t3.setAttribute("data-hs-combo-box-group-title", e3.name), t3.classList.add("--exclude-accessibility"), t3.innerText = e3.title, this.itemsWrapper ? this.itemsWrapper.append(t3) : this.output.append(t3);
              const i3 = this.sortItems().filter((t4) => {
                const { group: i4 } = JSON.parse(t4.getAttribute("data-hs-combo-box-output-item"));
                return i4.name === e3.name;
              });
              this.plainRender(i3);
            });
          }
          groupTabsRender() {
            const e3 = (0, s2.fc)(this.tabsWrapperTemplate), t3 = (0, s2.fc)('<div class="flex flex-nowrap gap-x-2"></div>');
            e3.append(t3), this.output.insertBefore(e3, this.output.firstChild);
            const i3 = (0, s2.fc)(this.groupingTitleTemplate);
            i3.setAttribute("data-hs-combo-box-group-title", "all"), i3.classList.add("--exclude-accessibility", "active"), i3.innerText = "All", this.tabs = [...this.tabs, i3], t3.append(i3), i3.addEventListener("click", () => {
              this.selectedGroup = "all";
              const e4 = this.tabs.find((e5) => e5.getAttribute("data-hs-combo-box-group-title") === this.selectedGroup);
              this.tabs.forEach((e5) => e5.classList.remove("active")), e4.classList.add("active"), this.setItemsVisibility();
            }), this.groups.forEach((e4) => {
              const i4 = (0, s2.fc)(this.groupingTitleTemplate);
              i4.setAttribute("data-hs-combo-box-group-title", e4.name), i4.classList.add("--exclude-accessibility"), i4.innerText = e4.title, this.tabs = [...this.tabs, i4], t3.append(i4), i4.addEventListener("click", () => {
                this.selectedGroup = e4.name;
                const t4 = this.tabs.find((e5) => e5.getAttribute("data-hs-combo-box-group-title") === this.selectedGroup);
                this.tabs.forEach((e5) => e5.classList.remove("active")), t4.classList.add("active"), this.setItemsVisibility();
              });
            });
          }
          itemsFromHtml() {
            if ("default" === this.groupingType) this.groupDefaultRender();
            else if ("tabs" === this.groupingType) {
              const e3 = this.sortItems();
              this.groupTabsRender(), this.plainRender(e3);
            } else {
              const e3 = this.sortItems();
              this.plainRender(e3);
            }
            this.setResults(this.input.value);
          }
          itemsFromJson() {
            return l2(this, void 0, void 0, function* () {
              if (this.isSearchLengthExceeded) return this.buildOutputPlaceholder(), false;
              this.buildOutputLoader();
              try {
                this.queryAbortController && this.queryAbortController.abort();
                const e3 = new AbortController();
                this.queryAbortController = e3;
                const t3 = `${this.apiQuery}`;
                let i3, n3, o3 = this.apiUrl;
                !this.apiSearchQuery && this.apiSearchPath ? (n3 = this.apiSearchDefaultPath && "" === this.value ? `/${this.apiSearchDefaultPath}` : `/${this.apiSearchPath}/${this.value.toLowerCase()}`, (this.apiSearchPath || this.apiSearchDefaultPath) && (o3 += n3)) : (i3 = `${this.apiSearchQuery}=${this.value.toLowerCase()}`, this.apiQuery && this.apiSearchQuery ? o3 += `?${i3}&${t3}` : this.apiQuery ? o3 += `?${t3}` : this.apiSearchQuery && (o3 += `?${i3}`));
                const l3 = yield fetch(o3, Object.assign(Object.assign({}, this.apiHeaders), { signal: e3.signal }));
                if (!l3.ok) return this.items = [], this.itemsWrapper ? this.itemsWrapper.innerHTML = "" : this.output.innerHTML = "", void this.setResults(this.input.value);
                let a3 = yield l3.json();
                if (this.apiDataPart && (a3 = a3[this.apiDataPart]), Array.isArray(a3) || (a3 = []), (this.apiSearchQuery || this.apiSearchPath) && (this.items = []), this.itemsWrapper ? this.itemsWrapper.innerHTML = "" : this.output.innerHTML = "", "tabs" === this.groupingType) this.setApiGroups(a3), this.groupTabsRender(), this.jsonItemsRender(a3);
                else if ("default" === this.groupingType) {
                  let e4 = 0;
                  this.setApiGroups(a3), this.groups.forEach((t4) => {
                    const i4 = (0, s2.fc)(this.groupingTitleTemplate);
                    i4.setAttribute("data-hs-combo-box-group-title", t4.name), i4.classList.add("--exclude-accessibility"), i4.innerText = t4.title;
                    const n4 = a3.filter((e5) => e5[this.apiGroupField] === t4.name);
                    this.itemsWrapper ? this.itemsWrapper.append(i4) : this.output.append(i4), this.jsonItemsRender(n4, e4), e4 += n4.length;
                  });
                } else this.jsonItemsRender(a3);
                this.setResults(this.input.value.length <= this.minSearchLength ? "" : this.input.value), this.updatePlaceholderVisibility();
              } catch (e3) {
                console.error("Error fetching items:", e3), this.items = [], this.itemsWrapper ? this.itemsWrapper.innerHTML = "" : this.output.innerHTML = "", this.setResults(this.input.value);
              } finally {
                this.queryAbortController && this.queryAbortController.signal.aborted && (this.queryAbortController = void 0), this.destroyOutputLoader();
              }
            });
          }
          appendItemsToWrapper(e3) {
            this.itemsWrapper ? this.itemsWrapper.append(e3) : this.output.append(e3);
          }
          resultItems() {
            if (!this.items.length) return false;
            this.setItemsVisibility(), this.setSelectedByValue([this.selected]);
          }
          destroyOutputPlaceholder() {
            this.outputPlaceholder && this.outputPlaceholder.remove(), this.outputPlaceholder = null;
          }
          setHighlighted(e3, t3, i3) {
            t3.focus(), i3.value = t3.querySelector("[data-hs-combo-box-value]").getAttribute("data-hs-combo-box-search-text"), e3 && e3.classList.remove("hs-combo-box-output-item-highlighted"), t3.classList.add("hs-combo-box-output-item-highlighted");
          }
          setupAccessibility() {
            var e3;
            const t3 = null !== (e3 = this.itemsWrapper) && void 0 !== e3 ? e3 : this.output;
            this.accessibilityComponent = window.HSAccessibilityObserver.registerComponent(this.el, { onEnter: (e4) => this.onEnter(e4), onSpace: () => this.onEnter(), onEsc: () => {
              if (this.isOpened && (this.close(), this.input && this.input.focus(), this.preventVisibility)) return false;
            }, onArrow: (e4) => {
              if (this.isOpened || "ArrowDown" !== e4.key) {
                if (this.isOpened) switch (e4.key) {
                  case "ArrowDown":
                    this.focusMenuItem("next");
                    break;
                  case "ArrowUp":
                    this.focusMenuItem("prev");
                    break;
                  case "Home":
                    this.onStartEnd(true);
                    break;
                  case "End":
                    this.onStartEnd(false);
                }
              } else this.open();
            }, onTab: (e4) => {
              this.isOpened && (e4.preventDefault(), e4.stopPropagation(), this.focusMenuItem("next"));
            }, onShiftTab: (e4) => {
              this.isOpened && (e4.preventDefault(), e4.stopPropagation(), this.focusMenuItem("prev"));
            } }, this.isOpened, "ComboBox", "[data-hs-combo-box]", t3);
          }
          onEnter(e3) {
            var t3, i3, s3;
            if (this.isOpened) {
              const n3 = this.output.querySelector(".hs-combo-box-output-item-highlighted");
              if (n3) {
                this.close(null !== (i3 = null === (t3 = n3.querySelector("[data-hs-combo-box-value]")) || void 0 === t3 ? void 0 : t3.getAttribute("data-hs-combo-box-search-text")) && void 0 !== i3 ? i3 : null, null !== (s3 = JSON.parse(n3.getAttribute("data-hs-combo-box-item-stored-data"))) && void 0 !== s3 ? s3 : null);
                const o3 = "A" === n3.tagName ? n3 : n3.querySelector("a[href]");
                if (null == o3 ? void 0 : o3.href) return void ((null == e3 ? void 0 : e3.metaKey) || (null == e3 ? void 0 : e3.ctrlKey) ? window.open(o3.href, "_blank", "noopener") : window.location.href = o3.href);
                this.input && this.input.focus();
              }
            } else this.open();
          }
          focusMenuItem(e3) {
            var t3;
            const i3 = null !== (t3 = this.itemsWrapper) && void 0 !== t3 ? t3 : this.output;
            if (!i3) return false;
            const s3 = Array.from(i3.querySelectorAll(":scope > *:not(.--exclude-accessibility)")).filter((e4) => "none" !== e4.style.display);
            if (!s3.length) return false;
            const n3 = i3.querySelector(".hs-combo-box-output-item-highlighted"), o3 = n3 ? s3.indexOf(n3) : -1, l3 = "next" === e3 ? (o3 + 1) % s3.length : (o3 - 1 + s3.length) % s3.length;
            n3 && n3.classList.remove("hs-combo-box-output-item-highlighted"), s3[l3].classList.add("hs-combo-box-output-item-highlighted"), s3[l3].focus(), this.input.value = s3[l3].querySelector("[data-hs-combo-box-value]").getAttribute("data-hs-combo-box-search-text");
          }
          onStartEnd(e3 = true) {
            var t3;
            const i3 = null !== (t3 = this.itemsWrapper) && void 0 !== t3 ? t3 : this.output;
            if (!i3) return false;
            const s3 = Array.from(i3.querySelectorAll(":scope > *:not(.--exclude-accessibility)")).filter((e4) => "none" !== e4.style.display);
            if (!s3.length) return false;
            const n3 = i3.querySelector(".hs-combo-box-output-item-highlighted");
            this.setHighlighted(n3, s3[0], this.input);
          }
          getCurrentData() {
            return this.currentData;
          }
          setCurrent() {
            window.$hsComboBoxCollection.length && (window.$hsComboBoxCollection.map((e3) => e3.element.isCurrent = false), this.isCurrent = true);
          }
          open(e3) {
            return !this.animationInProcess && (void 0 !== e3 && this.setValueAndOpen(e3), this.preventVisibility ? (this.isOpened = true, this.el.classList.add("active"), window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, true), false) : (this.animationInProcess = true, this.output.style.display = "block", this.preventAutoPosition || this.recalculateDirection(), setTimeout(() => {
              var e4, t3;
              (null === (e4 = null == this ? void 0 : this.input) || void 0 === e4 ? void 0 : e4.ariaExpanded) && (this.input.ariaExpanded = "true"), (null === (t3 = null == this ? void 0 : this.toggle) || void 0 === t3 ? void 0 : t3.ariaExpanded) && (this.toggle.ariaExpanded = "true"), this.el.classList.add("active"), this.animationInProcess = false;
            }), this.isOpened = true, void (window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, true))));
          }
          close(e3, t3 = null) {
            var i3, n3;
            return !this.animationInProcess && (this.preventVisibility ? (this.setValueAndClear(e3, t3), "" !== this.input.value ? this.el.classList.add("has-value") : this.el.classList.remove("has-value"), false) : (this.preserveSelectionOnEmpty || "" !== this.input.value.trim() || (this.selected = "", this.value = ""), this.animationInProcess = true, (null === (i3 = null == this ? void 0 : this.input) || void 0 === i3 ? void 0 : i3.ariaExpanded) && (this.input.ariaExpanded = "false"), (null === (n3 = null == this ? void 0 : this.toggle) || void 0 === n3 ? void 0 : n3.ariaExpanded) && (this.toggle.ariaExpanded = "false"), this.el.classList.remove("active"), this.preventAutoPosition || (this.output.classList.remove("bottom-full", "top-full"), this.output.style.marginTop = "", this.output.style.marginBottom = ""), (0, s2.yd)(this.output, () => {
              this.output.style.display = "none", this.setValueAndClear(e3, t3 || null), this.animationInProcess = false;
            }), "" !== this.input.value ? this.el.classList.add("has-value") : this.el.classList.remove("has-value"), this.isOpened = false, void (window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, false))));
          }
          recalculateDirection() {
            (0, s2.PR)(this.output, this.input, "bottom", this.gap, this.viewport) ? (this.output.classList.remove("bottom-full"), this.output.style.marginBottom = "", this.output.classList.add("top-full"), this.output.style.marginTop = `${this.gap}px`) : (this.output.classList.remove("top-full"), this.output.style.marginTop = "", this.output.classList.add("bottom-full"), this.output.style.marginBottom = `${this.gap}px`);
          }
          destroy() {
            this.input.removeEventListener("focus", this.onInputFocusListener), this.input.removeEventListener("input", this.onInputInputListener), this.toggle.removeEventListener("click", this.onToggleClickListener), this.toggleClose && this.toggleClose.removeEventListener("click", this.onToggleCloseClickListener), this.toggleOpen && this.toggleOpen.removeEventListener("click", this.onToggleOpenClickListener), this.el.classList.remove("has-value", "active"), this.items.length && this.items.forEach((e3) => {
              e3.classList.remove("selected"), e3.style.display = "";
            }), this.output.removeAttribute("role"), this.output.removeAttribute("tabindex"), this.output.removeAttribute("aria-orientation"), this.outputLoader && (this.outputLoader.remove(), this.outputLoader = null), this.outputPlaceholder && (this.outputPlaceholder.remove(), this.outputPlaceholder = null), this.apiUrl && (this.output.innerHTML = ""), this.items = [], "undefined" != typeof window && window.HSAccessibilityObserver && window.HSAccessibilityObserver.unregisterComponent(this.accessibilityComponent), window.$hsComboBoxCollection = window.$hsComboBoxCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsComboBoxCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            a2.ensureGlobalHandlers(), window.$hsComboBoxCollection && (window.$hsComboBoxCollection = window.$hsComboBoxCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-combo-box]:not(.--prevent-on-load-init)").forEach((e3) => {
              if (!window.$hsComboBoxCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              })) {
                const t3 = e3.getAttribute("data-hs-combo-box"), i3 = t3 ? JSON.parse(t3) : {};
                new a2(e3, i3);
              }
            });
          }
          static ensureGlobalHandlers() {
            "undefined" != typeof window && (window.$hsComboBoxCollection || (window.$hsComboBoxCollection = []), a2.globalListenersInitialized || (a2.globalListenersInitialized = true, window.addEventListener("click", (e3) => {
              const t3 = e3.target;
              a2.closeCurrentlyOpened(t3);
            })));
          }
          static close(e3) {
            const t3 = window.$hsComboBoxCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            t3 && t3.element.isOpened && t3.element.close();
          }
          static closeCurrentlyOpened(e3 = null) {
            if (!e3.closest("[data-hs-combo-box].active")) {
              const e4 = window.$hsComboBoxCollection.filter((e5) => e5.element.isOpened) || null;
              e4 && e4.forEach((e5) => {
                e5.element.close();
              });
            }
          }
        }
        a2.globalListenersInitialized = false;
        const r2 = a2;
      }, 1173(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = e3.getAttribute("data-hs-copy-markup"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.targetSelector = (null == n3 ? void 0 : n3.targetSelector) || null, this.wrapperSelector = (null == n3 ? void 0 : n3.wrapperSelector) || null, this.limit = (null == n3 ? void 0 : n3.limit) || null, this.items = [], this.targetSelector && this.init();
          }
          elementClick() {
            this.copy();
          }
          deleteItemButtonClick(e3) {
            this.delete(e3);
          }
          init() {
            this.createCollection(window.$hsCopyMarkupCollection, this), this.onElementClickListener = () => this.elementClick(), this.setTarget(), this.setWrapper(), this.addPredefinedItems(), this.el.addEventListener("click", this.onElementClickListener);
          }
          copy() {
            if (this.limit && this.items.length >= this.limit) return false;
            this.el.hasAttribute("disabled") && this.el.setAttribute("disabled", "");
            const e3 = this.target.cloneNode(true);
            this.addToItems(e3), this.limit && this.items.length >= this.limit && this.el.setAttribute("disabled", "disabled"), this.fireEvent("copy", e3), (0, s2.JD)("copy.hs.copyMarkup", e3, e3);
          }
          addPredefinedItems() {
            Array.from(this.wrapper.children).filter((e3) => !e3.classList.contains("[--ignore-for-count]")).forEach((e3) => {
              this.addToItems(e3);
            }), this.limit && this.items.length >= this.limit && this.el.setAttribute("disabled", "disabled");
          }
          setTarget() {
            const e3 = "string" == typeof this.targetSelector ? document.querySelector(this.targetSelector).cloneNode(true) : this.targetSelector.cloneNode(true);
            e3.removeAttribute("id"), this.target = e3;
          }
          setWrapper() {
            this.wrapper = "string" == typeof this.wrapperSelector ? document.querySelector(this.wrapperSelector) : this.wrapperSelector;
          }
          addToItems(e3) {
            const t3 = e3.querySelector("[data-hs-copy-markup-delete-item]");
            this.wrapper ? this.wrapper.append(e3) : this.el.before(e3), t3 && (this.onDeleteItemButtonClickListener = () => this.deleteItemButtonClick(e3), t3.addEventListener("click", this.onDeleteItemButtonClickListener)), this.items.push(e3);
          }
          delete(e3) {
            const t3 = this.items.indexOf(e3);
            -1 !== t3 && this.items.splice(t3, 1), e3.remove(), this.limit && this.items.length < this.limit && this.el.removeAttribute("disabled"), this.fireEvent("delete", e3), (0, s2.JD)("delete.hs.copyMarkup", e3, e3);
          }
          destroy() {
            const e3 = this.wrapper.querySelectorAll("[data-hs-copy-markup-delete-item]");
            this.el.removeEventListener("click", this.onElementClickListener), e3.length && e3.forEach((e4) => e4.removeEventListener("click", this.onDeleteItemButtonClickListener)), this.el.removeAttribute("disabled"), this.target = null, this.wrapper = null, this.items = null, window.$hsCopyMarkupCollection = window.$hsCopyMarkupCollection.filter(({ element: e4 }) => e4.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsCopyMarkupCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsCopyMarkupCollection || (window.$hsCopyMarkupCollection = []), window.$hsCopyMarkupCollection && (window.$hsCopyMarkupCollection = window.$hsCopyMarkupCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-copy-markup]:not(.--prevent-on-load-init)").forEach((e3) => {
              if (!window.$hsCopyMarkupCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              })) {
                const t3 = e3.getAttribute("data-hs-copy-markup"), i3 = t3 ? JSON.parse(t3) : {};
                new o2(e3, i3);
              }
            });
          }
        }
        const l2 = o2;
      }, 5049(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3, i3) {
            var s3, n3, o3, l3, a2, r2, c2, d2, h2, u2, p2, m2, g2, v2, f2, y2, b2, w2, C2, x2, S2;
            super(e3, t3, i3), this.el = "string" == typeof e3 ? document.querySelector(e3) : e3;
            const k2 = [];
            Array.from(this.el.querySelectorAll("thead th, thead td")).forEach((e4, t4) => {
              e4.classList.contains("--exclude-from-ordering") && k2.push({ targets: t4, orderable: false });
            });
            const L2 = this.el.getAttribute("data-hs-datatable"), E2 = L2 ? JSON.parse(L2) : {};
            this.concatOptions = Object.assign(Object.assign({ searching: true, lengthChange: false, order: [], columnDefs: [...k2] }, E2), t3), this.table = this.el.querySelector("table"), this.searches = null !== (s3 = Array.from(this.el.querySelectorAll("[data-hs-datatable-search]"))) && void 0 !== s3 ? s3 : null, this.pageEntitiesList = null !== (n3 = Array.from(this.el.querySelectorAll("[data-hs-datatable-page-entities]"))) && void 0 !== n3 ? n3 : null, this.pagingList = null !== (o3 = Array.from(this.el.querySelectorAll("[data-hs-datatable-paging]"))) && void 0 !== o3 ? o3 : null, this.pagingPagesList = null !== (l3 = Array.from(this.el.querySelectorAll("[data-hs-datatable-paging-pages]"))) && void 0 !== l3 ? l3 : null, this.pagingPrevList = null !== (a2 = Array.from(this.el.querySelectorAll("[data-hs-datatable-paging-prev]"))) && void 0 !== a2 ? a2 : null, this.pagingNextList = null !== (r2 = Array.from(this.el.querySelectorAll("[data-hs-datatable-paging-next]"))) && void 0 !== r2 ? r2 : null, this.infoList = null !== (c2 = Array.from(this.el.querySelectorAll("[data-hs-datatable-info]"))) && void 0 !== c2 ? c2 : null, (null === (d2 = this.concatOptions) || void 0 === d2 ? void 0 : d2.rowSelectingOptions) && (this.rowSelectingAll = null !== (g2 = (null === (u2 = null === (h2 = this.concatOptions) || void 0 === h2 ? void 0 : h2.rowSelectingOptions) || void 0 === u2 ? void 0 : u2.selectAllSelector) ? document.querySelector(null === (m2 = null === (p2 = this.concatOptions) || void 0 === p2 ? void 0 : p2.rowSelectingOptions) || void 0 === m2 ? void 0 : m2.selectAllSelector) : document.querySelector("[data-hs-datatable-row-selecting-all]")) && void 0 !== g2 ? g2 : null), (null === (v2 = this.concatOptions) || void 0 === v2 ? void 0 : v2.rowSelectingOptions) && (this.rowSelectingIndividual = null !== (b2 = null === (y2 = null === (f2 = this.concatOptions) || void 0 === f2 ? void 0 : f2.rowSelectingOptions) || void 0 === y2 ? void 0 : y2.individualSelector) && void 0 !== b2 ? b2 : "[data-hs-datatable-row-selecting-individual]"), this.pageEntitiesList.length && (this.concatOptions.pageLength = parseInt(this.pageEntitiesList[0].value)), this.maxPagesToShow = 3, this.isRowSelecting = !!(null === (w2 = this.concatOptions) || void 0 === w2 ? void 0 : w2.rowSelectingOptions), this.pageBtnClasses = null !== (S2 = null === (x2 = null === (C2 = this.concatOptions) || void 0 === C2 ? void 0 : C2.pagingOptions) || void 0 === x2 ? void 0 : x2.pageBtnClasses) && void 0 !== S2 ? S2 : null, this.onSearchInputListener = [], this.onPageEntitiesChangeListener = [], this.onSinglePagingClickListener = [], this.onPagingPrevClickListener = [], this.onPagingNextClickListener = [], this.init();
          }
          init() {
            this.createCollection(window.$hsDataTableCollection, this), this.initTable(), this.searches.length && this.initSearch(), this.pageEntitiesList.length && this.initPageEntities(), this.pagingList.length && this.initPaging(), this.pagingPagesList.length && this.buildPagingPages(), this.pagingPrevList.length && this.initPagingPrev(), this.pagingNextList.length && this.initPagingNext(), this.infoList.length && this.initInfo(), this.isRowSelecting && this.initRowSelecting();
          }
          initTable() {
            this.dataTable = new DataTable(this.table, this.concatOptions), this.isRowSelecting && this.triggerChangeEventToRow(), this.dataTable.on("draw", () => {
              this.isRowSelecting && this.updateSelectAllCheckbox(), this.isRowSelecting && this.triggerChangeEventToRow(), this.updateInfo(), this.pagingPagesList.forEach((e3) => this.updatePaging(e3));
            });
          }
          searchInput(e3) {
            this.onSearchInput(e3.target.value);
          }
          pageEntitiesChange(e3) {
            this.onEntitiesChange(parseInt(e3.target.value), e3.target);
          }
          pagingPrevClick() {
            this.onPrevClick();
          }
          pagingNextClick() {
            this.onNextClick();
          }
          rowSelectingAllChange() {
            this.onSelectAllChange();
          }
          singlePagingClick(e3) {
            this.onPageClick(e3);
          }
          initSearch() {
            this.searches.forEach((e3) => {
              this.onSearchInputListener.push({ el: e3, fn: (0, s2.sg)((e4) => this.searchInput(e4)) }), e3.addEventListener("input", this.onSearchInputListener.find((t3) => t3.el === e3).fn);
            });
          }
          onSearchInput(e3) {
            this.dataTable.search(e3).draw();
          }
          initPageEntities() {
            this.pageEntitiesList.forEach((e3) => {
              this.onPageEntitiesChangeListener.push({ el: e3, fn: (e4) => this.pageEntitiesChange(e4) }), e3.addEventListener("change", this.onPageEntitiesChangeListener.find((t3) => t3.el === e3).fn);
            });
          }
          onEntitiesChange(e3, t3) {
            const i3 = this.pageEntitiesList.filter((e4) => e4 !== t3);
            i3.length && i3.forEach((t4) => {
              if (window.HSSelect) {
                const i4 = window.HSSelect.getInstance(t4, true);
                i4 && "element" in i4 && i4.element.setValue(`${e3}`);
              } else t4.value = `${e3}`;
            }), this.dataTable.page.len(e3).draw();
          }
          initInfo() {
            this.infoList.forEach((e3) => {
              this.initInfoFrom(e3), this.initInfoTo(e3), this.initInfoLength(e3);
            });
          }
          initInfoFrom(e3) {
            var t3;
            const i3 = null !== (t3 = e3.querySelector("[data-hs-datatable-info-from]")) && void 0 !== t3 ? t3 : null, { start: s3 } = this.dataTable.page.info();
            i3 && (i3.innerText = `${s3 + 1}`);
          }
          initInfoTo(e3) {
            var t3;
            const i3 = null !== (t3 = e3.querySelector("[data-hs-datatable-info-to]")) && void 0 !== t3 ? t3 : null, { end: s3 } = this.dataTable.page.info();
            i3 && (i3.innerText = `${s3}`);
          }
          initInfoLength(e3) {
            var t3;
            const i3 = null !== (t3 = e3.querySelector("[data-hs-datatable-info-length]")) && void 0 !== t3 ? t3 : null, { recordsTotal: s3 } = this.dataTable.page.info();
            i3 && (i3.innerText = `${s3}`);
          }
          updateInfo() {
            this.initInfo();
          }
          initPaging() {
            this.pagingList.forEach((e3) => this.hidePagingIfSinglePage(e3));
          }
          hidePagingIfSinglePage(e3) {
            const { pages: t3 } = this.dataTable.page.info();
            t3 < 2 ? (e3.classList.add("hidden"), e3.style.display = "none") : (e3.classList.remove("hidden"), e3.style.display = "");
          }
          initPagingPrev() {
            this.pagingPrevList.forEach((e3) => {
              this.onPagingPrevClickListener.push({ el: e3, fn: () => this.pagingPrevClick() }), e3.addEventListener("click", this.onPagingPrevClickListener.find((t3) => t3.el === e3).fn);
            });
          }
          onPrevClick() {
            this.dataTable.page("previous").draw("page");
          }
          disablePagingArrow(e3, t3) {
            t3 ? (e3.classList.add("disabled"), e3.setAttribute("disabled", "disabled")) : (e3.classList.remove("disabled"), e3.removeAttribute("disabled"));
          }
          initPagingNext() {
            this.pagingNextList.forEach((e3) => {
              this.onPagingNextClickListener.push({ el: e3, fn: () => this.pagingNextClick() }), e3.addEventListener("click", this.onPagingNextClickListener.find((t3) => t3.el === e3).fn);
            });
          }
          onNextClick() {
            this.dataTable.page("next").draw("page");
          }
          buildPagingPages() {
            this.pagingPagesList.forEach((e3) => this.updatePaging(e3));
          }
          updatePaging(e3) {
            const { page: t3, pages: i3, length: n3 } = this.dataTable.page.info(), o3 = this.dataTable.rows({ search: "applied" }).count(), l3 = Math.ceil(o3 / n3), a2 = t3 + 1;
            let r2 = Math.max(1, a2 - Math.floor(this.maxPagesToShow / 2)), c2 = Math.min(l3, r2 + (this.maxPagesToShow - 1));
            c2 - r2 + 1 < this.maxPagesToShow && (r2 = Math.max(1, c2 - this.maxPagesToShow + 1)), e3.innerHTML = "", r2 > 1 && (this.buildPagingPage(1, e3), r2 > 2 && e3.appendChild((0, s2.fc)('<span class="ellipsis">...</span>')));
            for (let t4 = r2; t4 <= c2; t4++) this.buildPagingPage(t4, e3);
            c2 < l3 && (c2 < l3 - 1 && e3.appendChild((0, s2.fc)('<span class="ellipsis">...</span>')), this.buildPagingPage(l3, e3)), this.pagingPrevList.forEach((e4) => this.disablePagingArrow(e4, 0 === t3)), this.pagingNextList.forEach((e4) => this.disablePagingArrow(e4, t3 === i3 - 1)), this.pagingList.forEach((e4) => this.hidePagingIfSinglePage(e4));
          }
          buildPagingPage(e3, t3) {
            const { page: i3 } = this.dataTable.page.info(), n3 = (0, s2.fc)('<button type="button"></button>');
            n3.innerText = `${e3}`, n3.setAttribute("data-page", `${e3}`), this.pageBtnClasses && (0, s2.en)(this.pageBtnClasses, n3), i3 === e3 - 1 && n3.classList.add("active"), this.onSinglePagingClickListener.push({ el: n3, fn: () => this.singlePagingClick(e3) }), n3.addEventListener("click", this.onSinglePagingClickListener.find((e4) => e4.el === n3).fn), t3.append(n3);
          }
          onPageClick(e3) {
            this.dataTable.page(e3 - 1).draw("page");
          }
          initRowSelecting() {
            this.onRowSelectingAllChangeListener = () => this.rowSelectingAllChange(), this.rowSelectingAll.addEventListener("change", this.onRowSelectingAllChangeListener);
          }
          triggerChangeEventToRow() {
            this.table.querySelectorAll(`tbody ${this.rowSelectingIndividual}`).forEach((e3) => {
              e3.addEventListener("change", () => {
                this.updateSelectAllCheckbox();
              });
            });
          }
          onSelectAllChange() {
            let e3 = this.rowSelectingAll.checked;
            Array.from(this.dataTable.rows({ page: "current", search: "applied" }).nodes()).forEach((t3) => {
              const i3 = t3.querySelector(this.rowSelectingIndividual);
              i3 && (i3.checked = e3);
            }), this.updateSelectAllCheckbox();
          }
          updateSelectAllCheckbox() {
            if (!this.dataTable.rows({ search: "applied" }).count()) return this.rowSelectingAll.checked = false, false;
            let e3 = true;
            Array.from(this.dataTable.rows({ page: "current", search: "applied" }).nodes()).forEach((t3) => {
              const i3 = t3.querySelector(this.rowSelectingIndividual);
              if (i3 && !i3.checked) return e3 = false, false;
            }), this.rowSelectingAll.checked = e3;
          }
          destroy() {
            this.searches && this.onSearchInputListener.forEach(({ el: e3, fn: t3 }) => e3.removeEventListener("click", t3)), this.pageEntitiesList && this.onPageEntitiesChangeListener.forEach(({ el: e3, fn: t3 }) => e3.removeEventListener("change", t3)), this.pagingPagesList.length && (this.onSinglePagingClickListener.forEach(({ el: e3, fn: t3 }) => e3.removeEventListener("click", t3)), this.pagingPagesList.forEach((e3) => e3.innerHTML = "")), this.pagingPrevList.length && this.onPagingPrevClickListener.forEach(({ el: e3, fn: t3 }) => e3.removeEventListener("click", t3)), this.pagingNextList.length && this.onPagingNextClickListener.forEach(({ el: e3, fn: t3 }) => e3.removeEventListener("click", t3)), this.rowSelectingAll && this.rowSelectingAll.removeEventListener("change", this.onRowSelectingAllChangeListener), this.dataTable.destroy(), this.rowSelectingAll = null, this.rowSelectingIndividual = null, window.$hsDataTableCollection = window.$hsDataTableCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsDataTableCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsDataTableCollection || (window.$hsDataTableCollection = []), window.$hsDataTableCollection && (window.$hsDataTableCollection = window.$hsDataTableCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-datatable]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsDataTableCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 63(e2, t2, i2) {
        i2.d(t2, { A: () => ct });
        var s2 = i2(1926), n2 = Object.defineProperty, o2 = Object.defineProperties, l2 = Object.getOwnPropertyDescriptors, a2 = Object.getOwnPropertySymbols, r2 = Object.prototype.hasOwnProperty, c2 = Object.prototype.propertyIsEnumerable, d2 = (e3, t3, i3) => t3 in e3 ? n2(e3, t3, { enumerable: true, configurable: true, writable: true, value: i3 }) : e3[t3] = i3, h2 = (e3, t3) => {
          for (var i3 in t3 || (t3 = {})) r2.call(t3, i3) && d2(e3, i3, t3[i3]);
          if (a2) for (var i3 of a2(t3)) c2.call(t3, i3) && d2(e3, i3, t3[i3]);
          return e3;
        }, u2 = (e3, t3, i3) => (d2(e3, "symbol" != typeof t3 ? t3 + "" : t3, i3), i3);
        const p2 = (e3) => `${e3} is not found, check the first argument passed to new Calendar.`, m2 = 'The calendar has not been initialized, please initialize it using the "init()" method first.', g2 = "You specified an incorrect language label or did not specify the required number of values \u200B\u200Bfor \xABlocale.weekdays\xBB or \xABlocale.months\xBB.", v2 = "The value of the time property can be: false, 12 or 24.", f2 = "For the \xABmultiple\xBB calendar type, the \xABdisplayMonthsCount\xBB parameter can have a value from 2 to 12, and for all others it cannot be greater than 1.", y2 = (e3, t3, i3) => {
          e3.context[t3] = i3;
        }, b2 = /* @__PURE__ */ new WeakSet(), w2 = "data-vc-prev-tabindex", C2 = (e3) => e3.tabIndex >= 0 && !e3.hasAttribute("disabled") && "true" !== e3.getAttribute("aria-disabled"), x2 = (e3) => {
          if (e3.hasAttribute(w2)) return;
          const t3 = e3.getAttribute("tabindex");
          e3.setAttribute(w2, null != t3 ? t3 : "");
        }, S2 = (e3) => {
          if (!e3.hasAttribute(w2)) return;
          const t3 = e3.getAttribute(w2);
          "" === t3 || null === t3 ? e3.removeAttribute("tabindex") : e3.setAttribute("tabindex", t3), e3.removeAttribute(w2);
        }, k2 = (e3) => {
          e3.context.isShowInInputMode && e3.context.currentType && (e3.context.mainElement.dataset.vcCalendarHidden = "", y2(e3, "isShowInInputMode", false), e3.inputMode && ((e4) => {
            C2(e4) && (x2(e4), e4.tabIndex = -1);
            const t3 = document.createTreeWalker(e4, NodeFilter.SHOW_ELEMENT, { acceptNode: (e5) => C2(e5) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP });
            for (; t3.nextNode(); ) {
              const e5 = t3.currentNode;
              x2(e5), e5.tabIndex = -1;
            }
          })(e3.context.mainElement), e3.context.cleanupHandlers[0] && (e3.context.cleanupHandlers.forEach((e4) => e4()), y2(e3, "cleanupHandlers", [])), e3.inputMode && e3.context.inputElement && e3.context.mainElement.contains(document.activeElement) && (("function" == typeof e3.openOnFocus || true === e3.openOnFocus) && ((e4) => {
            b2.add(e4);
          })(e3), e3.context.inputElement.focus()), e3.onHide && e3.onHide(e3));
        };
        function L2(e3) {
          if (!e3 || !e3.getBoundingClientRect) return { top: 0, bottom: 0, left: 0, right: 0 };
          const t3 = e3.getBoundingClientRect(), i3 = document.documentElement;
          return { bottom: t3.bottom, right: t3.right, top: t3.top + window.scrollY - i3.clientTop, left: t3.left + window.scrollX - i3.clientLeft };
        }
        function E2() {
          return { vw: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0), vh: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) };
        }
        function T2(e3) {
          const { top: t3, left: i3 } = { left: window.scrollX || document.documentElement.scrollLeft || 0, top: window.scrollY || document.documentElement.scrollTop || 0 }, { top: s3, left: n3 } = L2(e3), { vh: o3, vw: l3 } = E2(), a3 = s3 - t3, r3 = n3 - i3;
          return { top: a3, bottom: o3 - (a3 + e3.clientHeight), left: r3, right: l3 - (r3 + e3.clientWidth) };
        }
        function A2(e3, t3, i3 = 5) {
          const s3 = { top: true, bottom: true, left: true, right: true }, n3 = [];
          if (!t3 || !e3) return { canShow: s3, parentPositions: n3 };
          const { bottom: o3, top: l3 } = T2(e3), { top: a3, left: r3 } = L2(e3), { height: c3, width: d3 } = t3.getBoundingClientRect(), { vh: h3, vw: u3 } = E2(), p3 = u3 / 2, m3 = h3 / 2;
          return [{ condition: a3 < m3, position: "top" }, { condition: a3 > m3, position: "bottom" }, { condition: r3 < p3, position: "left" }, { condition: r3 > p3, position: "right" }].forEach(({ condition: e4, position: t4 }) => {
            e4 && n3.push(t4);
          }), Object.assign(s3, { top: c3 <= l3 - i3, bottom: c3 <= o3 - i3, left: d3 <= r3, right: d3 <= u3 - r3 }), { canShow: s3, parentPositions: n3 };
        }
        const I2 = (e3, t3) => {
          var i3;
          e3.popups && (null == (i3 = Object.entries(e3.popups)) || i3.forEach(([i4, s3]) => ((e4, t4, i5, s4) => {
            var n3;
            const o3 = s4.querySelector(`[data-vc-date="${t4}"]`), l3 = null == o3 ? void 0 : o3.querySelector("[data-vc-date-btn]");
            if (!o3 || !l3) return;
            if ((null == i5 ? void 0 : i5.modifier) && l3.classList.add(...i5.modifier.trim().split(" ")), !(null == i5 ? void 0 : i5.html)) return;
            const a3 = document.createElement("div");
            a3.className = e4.styles.datePopup, a3.dataset.vcDatePopup = "", a3.innerHTML = e4.sanitizerHTML(i5.html), l3.ariaExpanded = "true", l3.ariaLabel = `${l3.ariaLabel}, ${null == (n3 = null == a3 ? void 0 : a3.textContent) ? void 0 : n3.replace(/^\s+|\s+(?=\s)|\s+$/g, "").replace(/&nbsp;/g, " ")}`, o3.appendChild(a3), requestAnimationFrame(() => {
              if (!a3) return;
              const { canShow: e5 } = A2(o3, a3), t5 = e5.bottom ? o3.offsetHeight : -a3.offsetHeight, i6 = e5.left && !e5.right ? o3.offsetWidth - a3.offsetWidth / 2 : !e5.left && e5.right ? a3.offsetWidth / 2 : 0;
              Object.assign(a3.style, { left: `${i6}px`, top: `${t5}px` });
            });
          })(e3, i4, s3, t3)));
        }, M2 = (e3) => /* @__PURE__ */ new Date(`${e3}T00:00:00`), D2 = (e3) => `${e3.getFullYear()}-${String(e3.getMonth() + 1).padStart(2, "0")}-${String(e3.getDate()).padStart(2, "0")}`, O2 = (e3) => e3.reduce((e4, t3) => {
          if (t3 instanceof Date || "number" == typeof t3) {
            const i3 = t3 instanceof Date ? t3 : new Date(t3);
            e4.push(i3.toISOString().substring(0, 10));
          } else t3.match(/^(\d{4}-\d{2}-\d{2})$/g) ? e4.push(t3) : t3.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/g, (t4, i3, s3) => {
            const n3 = M2(i3), o3 = M2(s3), l3 = new Date(n3.getTime());
            for (; l3 <= o3; l3.setDate(l3.getDate() + 1)) e4.push(D2(l3));
            return t4;
          });
          return e4;
        }, []), $2 = (e3, t3, i3, s3 = "") => {
          t3 ? e3.setAttribute(i3, s3) : e3.getAttribute(i3) === s3 && e3.removeAttribute(i3);
        }, P2 = (e3, t3, i3, s3, n3, o3, l3) => {
          var a3, r3, c3, d3;
          const h3 = M2(e3.context.displayDateMin) > M2(o3) || M2(e3.context.displayDateMax) < M2(o3) || (null == (a3 = e3.context.disableDates) ? void 0 : a3.includes(o3)) || !e3.selectionMonthsMode && "current" !== l3 || !e3.selectionYearsMode && M2(o3).getFullYear() !== t3;
          $2(i3, h3, "data-vc-date-disabled"), s3 && $2(s3, h3, "aria-disabled", "true"), s3 && $2(s3, h3, "tabindex", "-1"), $2(i3, !e3.disableToday && e3.context.dateToday === o3, "data-vc-date-today"), $2(i3, !e3.disableToday && e3.context.dateToday === o3, "aria-current", "date"), $2(i3, null == (r3 = e3.selectedWeekends) ? void 0 : r3.includes(n3), "data-vc-date-weekend");
          const u3 = (null == (c3 = e3.selectedHolidays) ? void 0 : c3[0]) ? O2(e3.selectedHolidays) : [];
          if ($2(i3, u3.includes(o3), "data-vc-date-holiday"), (null == (d3 = e3.context.selectedDates) ? void 0 : d3.includes(o3)) ? (i3.setAttribute("data-vc-date-selected", ""), s3 && s3.setAttribute("aria-selected", "true"), e3.context.selectedDates.length > 1 && "multiple-ranged" === e3.selectionDatesMode && (e3.context.selectedDates[0] === o3 && e3.context.selectedDates[e3.context.selectedDates.length - 1] === o3 ? i3.setAttribute("data-vc-date-selected", "first-and-last") : e3.context.selectedDates[0] === o3 ? i3.setAttribute("data-vc-date-selected", "first") : e3.context.selectedDates[e3.context.selectedDates.length - 1] === o3 && i3.setAttribute("data-vc-date-selected", "last"), e3.context.selectedDates[0] !== o3 && e3.context.selectedDates[e3.context.selectedDates.length - 1] !== o3 && i3.setAttribute("data-vc-date-selected", "middle"))) : i3.hasAttribute("data-vc-date-selected") && (i3.removeAttribute("data-vc-date-selected"), s3 && s3.removeAttribute("aria-selected")), !e3.context.disableDates.includes(o3) && e3.enableEdgeDatesOnly && e3.context.selectedDates.length > 1 && "multiple-ranged" === e3.selectionDatesMode) {
            const t4 = M2(e3.context.selectedDates[0]), s4 = M2(e3.context.selectedDates[e3.context.selectedDates.length - 1]), n4 = M2(o3);
            $2(i3, n4 > t4 && n4 < s4, "data-vc-date-selected", "middle");
          }
        }, N = (e3, t3) => {
          const i3 = M2(e3), s3 = (i3.getDay() - t3 + 7) % 7;
          i3.setDate(i3.getDate() + 4 - s3);
          const n3 = new Date(i3.getFullYear(), 0, 1), o3 = Math.ceil(((+i3 - +n3) / 864e5 + 1) / 7);
          return { year: i3.getFullYear(), week: o3 };
        }, H = (e3, t3, i3, s3, n3, o3) => {
          const l3 = M2(n3).getDay(), a3 = "string" == typeof e3.locale && e3.locale.length ? e3.locale : "en", r3 = document.createElement("div");
          let c3;
          r3.className = e3.styles.date, r3.dataset.vcDate = n3, r3.dataset.vcDateMonth = o3, r3.dataset.vcDateWeekDay = String(l3), r3.role = "gridcell", ("current" === o3 || e3.displayDatesOutside) && (c3 = document.createElement("button"), c3.className = e3.styles.dateBtn, c3.type = "button", c3.ariaLabel = ((e4, t4, i4) => (/* @__PURE__ */ new Date(`${e4}T00:00:00.000Z`)).toLocaleString(t4, i4))(n3, a3, { dateStyle: "long", timeZone: "UTC" }), c3.dataset.vcDateBtn = "", c3.innerText = String(s3), r3.appendChild(c3)), e3.enableWeekNumbers && ((e4, t4, i4) => {
            const s4 = N(i4, e4.firstWeekday);
            s4 && (t4.dataset.vcDateWeekNumber = String(s4.week));
          })(e3, r3, n3), ((e4, t4, i4) => {
            var s4, n4, o4, l4, a4;
            const r4 = null == (s4 = e4.disableWeekdays) ? void 0 : s4.includes(i4), c4 = e4.disableAllDates && !!(null == (n4 = e4.context.enableDates) ? void 0 : n4[0]);
            !r4 && !c4 || (null == (o4 = e4.context.enableDates) ? void 0 : o4.includes(t4)) || (null == (l4 = e4.context.disableDates) ? void 0 : l4.includes(t4)) || (e4.context.disableDates.push(t4), null == (a4 = e4.context.disableDates) || a4.sort((e5, t5) => +new Date(e5) - +new Date(t5)));
          })(e3, n3, l3), P2(e3, t3, r3, c3, l3, n3, o3), i3.addDate(r3), e3.onCreateDateEls && e3.onCreateDateEls(e3, r3);
        }, F = (e3) => {
          const t3 = new Date(e3.context.selectedYear, e3.context.selectedMonth, 1), i3 = e3.context.mainElement.querySelectorAll('[data-vc="dates"]'), s3 = e3.context.mainElement.querySelectorAll('[data-vc-week="numbers"]');
          i3.forEach((i4, n3) => {
            e3.selectionDatesMode || (i4.dataset.vcDatesDisabled = ""), i4.textContent = "";
            const o3 = new Date(t3);
            o3.setMonth(o3.getMonth() + n3);
            const l3 = o3.getMonth(), a3 = o3.getFullYear(), r3 = (new Date(a3, l3, 1).getDay() - e3.firstWeekday + 7) % 7, c3 = new Date(a3, l3 + 1, 0).getDate(), d3 = r3 + c3, h3 = Math.ceil(d3 / 7), u3 = 7 * h3 - d3, p3 = [];
            for (let t4 = 0; t4 < h3; t4++) {
              const t5 = document.createElement("div");
              t5.className = e3.styles.datesRow, t5.setAttribute("data-vc-dates", "row"), t5.setAttribute("role", "row"), p3.push(t5);
            }
            let m3 = 0, g3 = 0;
            const v3 = { addDate: (e4) => {
              p3[m3].appendChild(e4), g3++, g3 >= 7 && (m3++, g3 = 0);
            } };
            ((e4, t4, i5, s4, n4) => {
              let o4 = new Date(i5, s4, 0).getDate() - (n4 - 1);
              const l4 = 0 === s4 ? i5 - 1 : i5, a4 = 0 === s4 ? 12 : s4 < 10 ? `0${s4}` : s4;
              for (let s5 = n4; s5 > 0; s5--, o4++) H(e4, i5, t4, o4, `${l4}-${a4}-${o4}`, "prev");
            })(e3, v3, a3, l3, r3), ((e4, t4, i5, s4, n4) => {
              for (let o4 = 1; o4 <= i5; o4++) {
                const i6 = new Date(s4, n4, o4);
                H(e4, s4, t4, o4, D2(i6), "current");
              }
            })(e3, v3, c3, a3, l3), ((e4, t4, i5, s4, n4) => {
              const o4 = n4 + 1 === 12 ? s4 + 1 : s4, l4 = n4 + 1 === 12 ? "01" : n4 + 2 < 10 ? `0${n4 + 2}` : n4 + 2;
              for (let n5 = 1; n5 <= i5; n5++) {
                const i6 = n5 < 10 ? `0${n5}` : String(n5);
                H(e4, s4, t4, n5, `${o4}-${l4}-${i6}`, "next");
              }
            })(e3, v3, u3, a3, l3);
            for (const e4 of p3) i4.appendChild(e4);
            I2(e3, i4), ((e4, t4, i5, s4, n4) => {
              if (!e4.enableWeekNumbers) return;
              s4.textContent = "";
              const o4 = document.createElement("b");
              o4.className = e4.styles.weekNumbersTitle, o4.innerText = "#", o4.dataset.vcWeekNumbers = "title", s4.appendChild(o4);
              const l4 = document.createElement("div");
              l4.className = e4.styles.weekNumbersContent, l4.dataset.vcWeekNumbers = "content", s4.appendChild(l4);
              const a4 = document.createElement("button");
              a4.type = "button", a4.className = e4.styles.weekNumber;
              const r4 = n4.querySelectorAll("[data-vc-date]"), c4 = Math.ceil((t4 + i5) / 7);
              for (let t5 = 0; t5 < c4; t5++) {
                const i6 = r4[0 === t5 ? 6 : 7 * t5].dataset.vcDate, s5 = N(i6, e4.firstWeekday);
                if (!s5) return;
                const n5 = a4.cloneNode(true);
                n5.innerText = String(s5.week), n5.dataset.vcWeekNumber = String(s5.week), n5.dataset.vcWeekYear = String(s5.year), n5.role = "rowheader", n5.ariaLabel = `${s5.week}`, l4.appendChild(n5);
              }
            })(e3, r3, c3, s3[n3], i4);
          });
        }, q = (e3) => `
  <div class="${e3.styles.header}" data-vc="header" role="toolbar" aria-label="${e3.labels.navigation}">
    <#ArrowPrev [month] />
    <div class="${e3.styles.headerContent}" data-vc-header="content">
      <#Month />
      <#Year />
    </div>
    <#ArrowNext [month] />
  </div>
  <div class="${e3.styles.wrapper}" data-vc="wrapper">
    <#WeekNumbers />
    <div class="${e3.styles.content}" data-vc="content" role="grid">
      <#Week />
      <#Dates />
      <#DateRangeTooltip />
    </div>
  </div>
  <#ControlTime />
`, B = (e3) => `
  <div class="${e3.styles.header}" data-vc="header" role="toolbar" aria-label="${e3.labels.navigation}">
    <div class="${e3.styles.headerContent}" data-vc-header="content">
      <#Month />
      <#Year />
    </div>
  </div>
  <div class="${e3.styles.wrapper}" data-vc="wrapper">
    <div class="${e3.styles.content}" data-vc="content">
      <#Months />
    </div>
  </div>
`, R = (e3) => `
  <div class="${e3.styles.controls}" data-vc="controls" role="toolbar" aria-label="${e3.labels.navigation}">
    <#ArrowPrev [month] />
    <#ArrowNext [month] />
  </div>
  <div class="${e3.styles.grid}" data-vc="grid">
    <#Multiple>
      <div class="${e3.styles.column}" data-vc="column" role="region">
        <div class="${e3.styles.header}" data-vc="header">
          <div class="${e3.styles.headerContent}" data-vc-header="content">
            <#Month />
            <#Year />
          </div>
        </div>
        <div class="${e3.styles.wrapper}" data-vc="wrapper">
          <#WeekNumbers />
          <div class="${e3.styles.content}" data-vc="content" role="grid">
            <#Week />
            <#Dates />
          </div>
        </div>
      </div>
    <#/Multiple>
    <#DateRangeTooltip />
  </div>
  <#ControlTime />
`, V = (e3) => `
  <div class="${e3.styles.header}" data-vc="header" role="toolbar" aria-label="${e3.labels.navigation}">
    <#ArrowPrev [year] />
    <div class="${e3.styles.headerContent}" data-vc-header="content">
      <#Month />
      <#Year />
    </div>
    <#ArrowNext [year] />
  </div>
  <div class="${e3.styles.wrapper}" data-vc="wrapper">
    <div class="${e3.styles.content}" data-vc="content">
      <#Years />
    </div>
  </div>
`, z = { ArrowNext: (e3, t3) => `<button type="button" class="${e3.styles.arrowNext}" data-vc-arrow="next" aria-label="${e3.labels.arrowNext[t3]}"></button>`, ArrowPrev: (e3, t3) => `<button type="button" class="${e3.styles.arrowPrev}" data-vc-arrow="prev" aria-label="${e3.labels.arrowPrev[t3]}"></button>`, ControlTime: (e3) => e3.selectionTimeMode ? `<div class="${e3.styles.time}" data-vc="time" role="group" aria-label="${e3.labels.selectingTime}"></div>` : "", Dates: (e3) => `<div class="${e3.styles.dates}" data-vc="dates" aria-live="assertive" aria-label="${e3.labels.dates}" ${"multiple" === e3.type ? "aria-multiselectable" : ""}></div>`, DateRangeTooltip: (e3) => e3.onCreateDateRangeTooltip ? `<div class="${e3.styles.dateRangeTooltip}" data-vc-date-range-tooltip="hidden"></div>` : "", Month: (e3) => `<button type="button" class="${e3.styles.month}" data-vc="month"></button>`, Months: (e3) => `<div class="${e3.styles.months}" data-vc="months" role="grid" aria-live="assertive" aria-label="${e3.labels.months}"></div>`, Week: (e3) => `<div class="${e3.styles.week}" data-vc="week" role="row" aria-label="${e3.labels.week}"></div>`, WeekNumbers: (e3) => e3.enableWeekNumbers ? `<div class="${e3.styles.weekNumbers}" data-vc-week="numbers" role="row" aria-label="${e3.labels.weekNumber}"></div>` : "", Year: (e3) => `<button type="button" class="${e3.styles.year}" data-vc="year"></button>`, Years: (e3) => `<div class="${e3.styles.years}" data-vc="years" role="grid" aria-live="assertive" aria-label="${e3.labels.years}"></div>` }, j = (e3, t3) => t3.replace(/[\n\t]/g, "").replace(/<#(?!\/?Multiple)(.*?)>/g, (t4, i3) => {
          const s3 = (i3.match(/\[(.*?)\]/) || [])[1], n3 = ((e4) => z[e4])(i3.replace(/[/\s\n\t]|\[(.*?)\]/g, "")), o3 = n3 ? n3(e3, null != s3 ? s3 : null) : "";
          return e3.sanitizerHTML(o3);
        }).replace(/[\n\t]/g, ""), W = (e3, t3) => {
          const i3 = { default: q, month: B, year: V, multiple: R };
          if (Object.keys(i3).forEach((t4) => {
            const s3 = t4;
            e3.layouts[s3].length || (e3.layouts[s3] = i3[s3](e3));
          }), e3.context.mainElement.className = e3.styles.calendar, e3.context.mainElement.dataset.vc = "calendar", e3.context.mainElement.dataset.vcType = e3.context.currentType, e3.context.mainElement.role = "application", e3.context.mainElement.tabIndex = 0, e3.context.mainElement.ariaLabel = e3.labels.application, "multiple" !== e3.context.currentType) {
            if ("multiple" === e3.type && t3) {
              const i4 = e3.context.mainElement.querySelector('[data-vc="controls"]'), s3 = e3.context.mainElement.querySelector('[data-vc="grid"]'), n3 = t3.closest('[data-vc="column"]');
              return i4 && i4.remove(), s3 && (s3.dataset.vcGrid = "hidden"), n3 && (n3.dataset.vcColumn = e3.context.currentType), void (n3 && (n3.innerHTML = e3.sanitizerHTML(j(e3, e3.layouts[e3.context.currentType]))));
            }
            e3.context.mainElement.innerHTML = e3.sanitizerHTML(j(e3, e3.layouts[e3.context.currentType]));
          } else e3.context.mainElement.innerHTML = e3.sanitizerHTML(((e4, t4) => t4.replace(new RegExp("<#Multiple>(.*?)<#\\/Multiple>", "gs"), (t5, i4) => {
            const s3 = Array(e4.context.displayMonthsCount).fill(i4).join("");
            return e4.sanitizerHTML(s3);
          }).replace(/[\n\t]/g, ""))(e3, j(e3, e3.layouts[e3.context.currentType])));
        }, U = (e3, t3, i3, s3) => {
          e3.style.visibility = i3 ? "hidden" : "", t3.style.visibility = s3 ? "hidden" : "";
        }, Y = (e3) => {
          if ("month" === e3.context.currentType) return;
          const t3 = e3.context.mainElement.querySelector('[data-vc-arrow="prev"]'), i3 = e3.context.mainElement.querySelector('[data-vc-arrow="next"]');
          t3 && i3 && { default: () => ((e4, t4, i4) => {
            const s3 = M2(D2(new Date(e4.context.selectedYear, e4.context.selectedMonth, 1))), n3 = new Date(s3.getTime()), o3 = new Date(s3.getTime());
            n3.setMonth(n3.getMonth() - e4.monthsToSwitch), o3.setMonth(o3.getMonth() + e4.monthsToSwitch);
            const l3 = M2(e4.context.dateMin), a3 = M2(e4.context.dateMax);
            e4.selectionYearsMode || (l3.setFullYear(s3.getFullYear()), a3.setFullYear(s3.getFullYear()));
            const r3 = !e4.selectionMonthsMode || n3.getFullYear() < l3.getFullYear() || n3.getFullYear() === l3.getFullYear() && n3.getMonth() < l3.getMonth(), c3 = !e4.selectionMonthsMode || o3.getFullYear() > a3.getFullYear() || o3.getFullYear() === a3.getFullYear() && o3.getMonth() > a3.getMonth() - (e4.context.displayMonthsCount - 1);
            U(t4, i4, r3, c3);
          })(e3, t3, i3), year: () => ((e4, t4, i4) => {
            const s3 = M2(e4.context.dateMin), n3 = M2(e4.context.dateMax), o3 = !!(s3.getFullYear() && e4.context.displayYear - 7 <= s3.getFullYear()), l3 = !!(n3.getFullYear() && e4.context.displayYear + 7 >= n3.getFullYear());
            U(t4, i4, o3, l3);
          })(e3, t3, i3) }["multiple" === e3.context.currentType ? "default" : e3.context.currentType]();
        }, J = (e3) => {
          const t3 = e3.context.mainElement.querySelectorAll('[data-vc="month"]'), i3 = e3.context.mainElement.querySelectorAll('[data-vc="year"]'), s3 = new Date(e3.context.selectedYear, e3.context.selectedMonth, 1);
          [t3, i3].forEach((t4) => null == t4 ? void 0 : t4.forEach((t5, i4) => ((e4, t6, i5, s4, n3) => {
            const o3 = new Date(s4.setFullYear(e4.context.selectedYear, e4.context.selectedMonth + i5)).getFullYear(), l3 = new Date(s4.setMonth(e4.context.selectedMonth + i5)).getMonth(), a3 = e4.context.locale.months.long[l3], r3 = t6.closest('[data-vc="column"]');
            r3 && (r3.ariaLabel = `${a3} ${o3}`);
            const c3 = { month: { id: l3, label: a3 }, year: { id: o3, label: o3 } };
            t6.innerText = String(c3[n3].label), t6.dataset[`vc${n3.charAt(0).toUpperCase() + n3.slice(1)}`] = String(c3[n3].id), t6.ariaLabel = `${e4.labels[n3]} ${c3[n3].label}`;
            const d3 = { month: e4.selectionMonthsMode, year: e4.selectionYearsMode }, h3 = false === d3[n3] || "only-arrows" === d3[n3];
            h3 && (t6.tabIndex = -1), t6.disabled = h3;
          })(e3, t5, i4, s3, t5.dataset.vc)));
        }, K = (e3, t3, i3, s3, n3) => {
          var o3;
          const l3 = { month: { selected: "data-vc-months-month-selected", aria: "aria-selected", value: "vcMonthsMonth", selectedProperty: "selectedMonth" }, year: { selected: "data-vc-years-year-selected", aria: "aria-selected", value: "vcYearsYear", selectedProperty: "selectedYear" } };
          n3 && (null == (o3 = e3.context.mainElement.querySelectorAll({ month: "[data-vc-months-month]", year: "[data-vc-years-year]" }[i3])) || o3.forEach((e4) => {
            e4.removeAttribute(l3[i3].selected), e4.removeAttribute(l3[i3].aria);
          }), y2(e3, l3[i3].selectedProperty, Number(t3.dataset[l3[i3].value])), J(e3), "year" === i3 && Y(e3)), s3 && (t3.setAttribute(l3[i3].selected, ""), t3.setAttribute(l3[i3].aria, "true"));
        }, Q = (e3, t3) => {
          var i3;
          if ("multiple" !== e3.type) return { currentValue: null, columnID: 0 };
          const s3 = e3.context.mainElement.querySelectorAll('[data-vc="column"]'), n3 = Array.from(s3).findIndex((e4) => e4.closest(`[data-vc-column="${t3}"]`));
          return { currentValue: n3 >= 0 ? Number(null == (i3 = s3[n3].querySelector(`[data-vc="${t3}"]`)) ? void 0 : i3.getAttribute(`data-vc-${t3}`)) : null, columnID: Math.max(n3, 0) };
        }, G = (e3, t3, i3, s3, n3, o3, l3) => {
          const a3 = t3.cloneNode(false);
          return a3.className = e3.styles.monthsMonth, a3.innerText = s3, a3.ariaLabel = n3, a3.role = "gridcell", a3.dataset.vcMonthsMonth = `${l3}`, o3 && (a3.ariaDisabled = "true"), o3 && (a3.tabIndex = -1), a3.disabled = o3, K(e3, a3, "month", i3 === l3, false), a3;
        }, Z = (e3, t3) => {
          var i3, s3;
          const n3 = null == (i3 = null == t3 ? void 0 : t3.closest('[data-vc="header"]')) ? void 0 : i3.querySelector('[data-vc="year"]'), o3 = n3 ? Number(n3.dataset.vcYear) : e3.context.selectedYear, l3 = (null == t3 ? void 0 : t3.dataset.vcMonth) ? Number(t3.dataset.vcMonth) : e3.context.selectedMonth;
          y2(e3, "currentType", "month"), W(e3, t3), J(e3);
          const a3 = e3.context.mainElement.querySelector('[data-vc="months"]');
          if (!e3.selectionMonthsMode || !a3) return;
          const r3 = e3.monthsToSwitch > 1 ? e3.context.locale.months.long.map((t4, i4) => l3 - e3.monthsToSwitch * i4).concat(e3.context.locale.months.long.map((t4, i4) => l3 + e3.monthsToSwitch * i4)).filter((e4) => e4 >= 0 && e4 <= 12) : Array.from(Array(12).keys()), c3 = document.createElement("button");
          c3.type = "button";
          for (let t4 = 0; t4 < 12; t4++) {
            const i4 = M2(e3.context.dateMin), s4 = M2(e3.context.dateMax), n4 = e3.context.displayMonthsCount - 1, { columnID: d3 } = Q(e3, "month"), h3 = o3 <= i4.getFullYear() && t4 < i4.getMonth() + d3 || o3 >= s4.getFullYear() && t4 > s4.getMonth() - n4 + d3 || o3 > s4.getFullYear() || t4 !== l3 && !r3.includes(t4), u3 = G(e3, c3, l3, e3.context.locale.months.short[t4], e3.context.locale.months.long[t4], h3, t4);
            a3.appendChild(u3), e3.onCreateMonthEls && e3.onCreateMonthEls(e3, u3);
          }
          null == (s3 = e3.context.mainElement.querySelector("[data-vc-months-month]:not([disabled])")) || s3.focus();
        }, X = (e3, t3, i3, s3, n3) => `
  <label class="${t3}" data-vc-time-input="${e3}">
    <input type="text" name="${e3}" maxlength="2" aria-label="${i3[`input${e3.charAt(0).toUpperCase() + e3.slice(1)}`]}" value="${s3}" ${n3 ? "disabled" : ""}>
  </label>
`, ee = (e3, t3, i3, s3, n3, o3, l3) => `
  <label class="${t3}" data-vc-time-range="${e3}">
    <input type="range" name="${e3}" min="${s3}" max="${n3}" step="${o3}" aria-label="${i3[`range${e3.charAt(0).toUpperCase() + e3.slice(1)}`]}" value="${l3}">
  </label>
`, te = (e3, t3, i3, s3) => {
          ({ hour: () => y2(e3, "selectedHours", i3), minute: () => y2(e3, "selectedMinutes", i3) })[s3](), y2(e3, "selectedTime", `${e3.context.selectedHours}:${e3.context.selectedMinutes}${e3.context.selectedKeeping ? ` ${e3.context.selectedKeeping}` : ""}`), e3.onChangeTime && e3.onChangeTime(e3, t3, false), e3.inputMode && e3.context.inputElement && e3.context.mainElement && e3.onChangeToInput && e3.onChangeToInput(e3, t3);
        }, ie = (e3, t3) => {
          var i3;
          return (null == (i3 = { 0: { AM: "00", PM: "12" }, 1: { AM: "01", PM: "13" }, 2: { AM: "02", PM: "14" }, 3: { AM: "03", PM: "15" }, 4: { AM: "04", PM: "16" }, 5: { AM: "05", PM: "17" }, 6: { AM: "06", PM: "18" }, 7: { AM: "07", PM: "19" }, 8: { AM: "08", PM: "20" }, 9: { AM: "09", PM: "21" }, 10: { AM: "10", PM: "22" }, 11: { AM: "11", PM: "23" }, 12: { AM: "00", PM: "12" } }[Number(e3)]) ? void 0 : i3[t3]) || String(e3);
        }, se = (e3) => ({ 0: "12", 13: "01", 14: "02", 15: "03", 16: "04", 17: "05", 18: "06", 19: "07", 20: "08", 21: "09", 22: "10", 23: "11" })[Number(e3)] || String(e3), ne = (e3, t3, i3, s3) => {
          e3.value = i3, t3.value = s3;
        }, oe = (e3, t3, i3, s3, n3, o3, l3) => {
          const a3 = { hour: (a4, r4, c3) => {
            e3.selectionTimeMode && { 12: () => {
              if (!e3.context.selectedKeeping) return;
              const d3 = Number(ie(r4, e3.context.selectedKeeping));
              if (!(d3 <= o3 && d3 >= l3)) return ne(i3, t3, e3.context.selectedHours, e3.context.selectedHours), void (e3.onChangeTime && e3.onChangeTime(e3, c3, true));
              ne(i3, t3, se(r4), ie(r4, e3.context.selectedKeeping)), a4 > 12 && ((e4, t4, i4) => {
                t4 && i4 && (y2(e4, "selectedKeeping", i4), t4.innerText = i4);
              })(e3, s3, "PM"), te(e3, c3, se(r4), n3);
            }, 24: () => {
              if (!(a4 <= o3 && a4 >= l3)) return ne(i3, t3, e3.context.selectedHours, e3.context.selectedHours), void (e3.onChangeTime && e3.onChangeTime(e3, c3, true));
              ne(i3, t3, r4, r4), te(e3, c3, r4, n3);
            } }[e3.selectionTimeMode]();
          }, minute: (s4, a4, r4) => {
            if (!(s4 <= o3 && s4 >= l3)) return i3.value = e3.context.selectedMinutes, void (e3.onChangeTime && e3.onChangeTime(e3, r4, true));
            i3.value = a4, t3.value = a4, te(e3, r4, a4, n3);
          } }, r3 = (e4) => {
            const t4 = Number(i3.value), s4 = i3.value.padStart(2, "0");
            a3[n3] && a3[n3](t4, s4, e4);
          };
          return i3.addEventListener("change", r3), () => {
            i3.removeEventListener("change", r3);
          };
        }, le = (e3, t3, i3, s3, n3) => {
          const o3 = (o4) => {
            const l3 = Number(t3.value), a3 = t3.value.padStart(2, "0"), r3 = "hour" === n3, c3 = 24 === e3.selectionTimeMode, d3 = l3 > 0 && l3 < 12;
            r3 && !c3 && ((e4, t4, i4) => {
              t4 && (y2(e4, "selectedKeeping", i4), t4.innerText = i4);
            })(e3, s3, 0 === l3 || d3 ? "AM" : "PM"), ((e4, t4, i4, s4, n4) => {
              t4.value = n4, te(e4, i4, n4, s4);
            })(e3, i3, o4, n3, !r3 || c3 || d3 ? a3 : se(t3.value));
          };
          return t3.addEventListener("input", o3), () => {
            t3.removeEventListener("input", o3);
          };
        }, ae = (e3) => e3.setAttribute("data-vc-input-focus", ""), re = (e3) => e3.removeAttribute("data-vc-input-focus"), ce = (e3, t3) => {
          const i3 = t3.querySelector('[data-vc-time-range="hour"] input[name="hour"]'), s3 = t3.querySelector('[data-vc-time-range="minute"] input[name="minute"]'), n3 = t3.querySelector('[data-vc-time-input="hour"] input[name="hour"]'), o3 = t3.querySelector('[data-vc-time-input="minute"] input[name="minute"]'), l3 = t3.querySelector('[data-vc-time="keeping"]');
          if (!(i3 && s3 && n3 && o3)) return;
          const a3 = (e4) => {
            e4.target === i3 && ae(n3), e4.target === s3 && ae(o3);
          }, r3 = (e4) => {
            e4.target === i3 && re(n3), e4.target === s3 && re(o3);
          };
          return t3.addEventListener("mouseover", a3), t3.addEventListener("mouseout", r3), oe(e3, i3, n3, l3, "hour", e3.timeMaxHour, e3.timeMinHour), oe(e3, s3, o3, l3, "minute", e3.timeMaxMinute, e3.timeMinMinute), le(e3, i3, n3, l3, "hour"), le(e3, s3, o3, l3, "minute"), l3 && ((e4, t4, i4, s4, n4) => {
            const o4 = (o5) => {
              const l4 = "AM" === e4.context.selectedKeeping ? "PM" : "AM", a4 = ie(e4.context.selectedHours, l4);
              Number(a4) <= s4 && Number(a4) >= n4 ? (y2(e4, "selectedKeeping", l4), i4.value = a4, te(e4, o5, e4.context.selectedHours, "hour"), t4.ariaLabel = `${e4.labels.btnKeeping} ${e4.context.selectedKeeping}`, t4.innerText = e4.context.selectedKeeping) : e4.onChangeTime && e4.onChangeTime(e4, o5, true);
            };
            t4.addEventListener("click", o4);
          })(e3, l3, i3, e3.timeMaxHour, e3.timeMinHour), () => {
            t3.removeEventListener("mouseover", a3), t3.removeEventListener("mouseout", r3);
          };
        }, de = (e3) => {
          const t3 = e3.selectedWeekends ? [...e3.selectedWeekends] : [], i3 = [...e3.context.locale.weekdays.long].reduce((i4, s4, n3) => [...i4, { id: n3, titleShort: e3.context.locale.weekdays.short[n3], titleLong: s4, isWeekend: t3.includes(n3) }], []), s3 = [...i3.slice(e3.firstWeekday), ...i3.slice(0, e3.firstWeekday)];
          e3.context.mainElement.querySelectorAll('[data-vc="week"]').forEach((t4) => {
            const i4 = e3.onClickWeekDay ? document.createElement("button") : document.createElement("b");
            e3.onClickWeekDay && (i4.type = "button"), s3.forEach((s4) => {
              const n3 = i4.cloneNode(true);
              n3.innerText = s4.titleShort, n3.className = e3.styles.weekDay, n3.role = "columnheader", n3.ariaLabel = s4.titleLong, n3.dataset.vcWeekDay = String(s4.id), s4.isWeekend && (n3.dataset.vcWeekDayOff = ""), t4.appendChild(n3);
            });
          });
        }, he = (e3, t3, i3, s3, n3) => {
          const o3 = t3.cloneNode(false);
          return o3.className = e3.styles.yearsYear, o3.innerText = String(n3), o3.ariaLabel = String(n3), o3.role = "gridcell", o3.dataset.vcYearsYear = `${n3}`, s3 && (o3.ariaDisabled = "true"), s3 && (o3.tabIndex = -1), o3.disabled = s3, K(e3, o3, "year", i3 === n3, false), o3;
        }, ue = (e3, t3) => {
          var i3;
          const s3 = (null == t3 ? void 0 : t3.dataset.vcYear) ? Number(t3.dataset.vcYear) : e3.context.selectedYear;
          y2(e3, "currentType", "year"), W(e3, t3), J(e3), Y(e3);
          const n3 = e3.context.mainElement.querySelector('[data-vc="years"]');
          if (!e3.selectionYearsMode || !n3) return;
          const o3 = "multiple" !== e3.type || e3.context.selectedYear === s3 ? 0 : 1, l3 = document.createElement("button");
          l3.type = "button";
          for (let t4 = e3.context.displayYear - 7; t4 < e3.context.displayYear + 8; t4++) {
            const i4 = t4 < M2(e3.context.dateMin).getFullYear() + o3 || t4 > M2(e3.context.dateMax).getFullYear(), a3 = he(e3, l3, s3, i4, t4);
            n3.appendChild(a3), e3.onCreateYearEls && e3.onCreateYearEls(e3, a3);
          }
          null == (i3 = e3.context.mainElement.querySelector("[data-vc-years-year]:not([disabled])")) || i3.focus();
        }, pe = { value: false, set: () => pe.value = true, check: () => pe.value }, me = (e3, t3) => e3.dataset.vcTheme = t3, ge = (e3, t3) => {
          if (me(e3.context.mainElement, t3.matches ? "dark" : "light"), "system" !== e3.selectedTheme || pe.check()) return;
          const i3 = (e4) => {
            const t4 = document.querySelectorAll('[data-vc="calendar"]');
            null == t4 || t4.forEach((t5) => me(t5, e4.matches ? "dark" : "light"));
          };
          t3.addEventListener ? t3.addEventListener("change", i3) : t3.addListener(i3), pe.set();
        }, ve = (e3, t3) => {
          const i3 = e3.themeAttrDetect.length ? document.querySelector(e3.themeAttrDetect) : null, s3 = e3.themeAttrDetect.replace(/^.*\[(.+)\]/g, (e4, t4) => t4);
          if (!i3 || "system" === i3.getAttribute(s3)) return void ge(e3, t3);
          const n3 = i3.getAttribute(s3);
          n3 ? (me(e3.context.mainElement, n3), ((e4, t4, i4) => {
            new MutationObserver((e5) => {
              for (let s4 = 0; s4 < e5.length; s4++) if (e5[s4].attributeName === t4) {
                i4();
                break;
              }
            }).observe(e4, { attributes: true });
          })(i3, s3, () => {
            const t4 = i3.getAttribute(s3);
            t4 && me(e3.context.mainElement, t4);
          })) : ge(e3, t3);
        }, fe = (e3) => e3.charAt(0).toUpperCase() + e3.slice(1).replace(/\./, ""), ye = (e3) => {
          var t3, i3, s3, n3, o3, l3, a3, r3;
          if (!(e3.context.locale.weekdays.short[6] && e3.context.locale.weekdays.long[6] && e3.context.locale.months.short[11] && e3.context.locale.months.long[11])) if ("string" == typeof e3.locale) {
            if ("string" == typeof e3.locale && !e3.locale.length) throw new Error(g2);
            Array.from({ length: 7 }, (t4, i4) => ((e4, t5, i5) => {
              const s4 = /* @__PURE__ */ new Date(`1978-01-0${t5 + 1}T00:00:00.000Z`), n4 = s4.toLocaleString(i5, { weekday: "short", timeZone: "UTC" }), o4 = s4.toLocaleString(i5, { weekday: "long", timeZone: "UTC" });
              e4.context.locale.weekdays.short.push(fe(n4)), e4.context.locale.weekdays.long.push(fe(o4));
            })(e3, i4, e3.locale)), Array.from({ length: 12 }, (t4, i4) => ((e4, t5, i5) => {
              const s4 = /* @__PURE__ */ new Date(`1978-${String(t5 + 1).padStart(2, "0")}-01T00:00:00.000Z`), n4 = s4.toLocaleString(i5, { month: "short", timeZone: "UTC" }), o4 = s4.toLocaleString(i5, { month: "long", timeZone: "UTC" });
              e4.context.locale.months.short.push(fe(n4)), e4.context.locale.months.long.push(fe(o4));
            })(e3, i4, e3.locale));
          } else {
            if (!((null == (i3 = null == (t3 = e3.locale) ? void 0 : t3.weekdays) ? void 0 : i3.short[6]) && (null == (n3 = null == (s3 = e3.locale) ? void 0 : s3.weekdays) ? void 0 : n3.long[6]) && (null == (l3 = null == (o3 = e3.locale) ? void 0 : o3.months) ? void 0 : l3.short[11]) && (null == (r3 = null == (a3 = e3.locale) ? void 0 : a3.months) ? void 0 : r3.long[11]))) throw new Error(g2);
            y2(e3, "locale", h2({}, e3.locale));
          }
        }, be = (e3) => {
          const t3 = { default: () => {
            de(e3), F(e3);
          }, multiple: () => {
            de(e3), F(e3);
          }, month: () => Z(e3), year: () => ue(e3) };
          ((e4) => {
            "not all" !== window.matchMedia("(prefers-color-scheme)").media ? "system" === e4.selectedTheme ? ve(e4, window.matchMedia("(prefers-color-scheme: dark)")) : me(e4.context.mainElement, e4.selectedTheme) : me(e4.context.mainElement, "light");
          })(e3), ye(e3), W(e3), J(e3), Y(e3), ((e4) => {
            const t4 = e4.context.mainElement.querySelector('[data-vc="time"]');
            if (!e4.selectionTimeMode || !t4) return;
            const [i3, s3] = [e4.timeMinHour, e4.timeMaxHour], [n3, o3] = [e4.timeMinMinute, e4.timeMaxMinute], l3 = e4.context.selectedKeeping ? ie(e4.context.selectedHours, e4.context.selectedKeeping) : e4.context.selectedHours, a3 = "range" === e4.timeControls;
            var r3;
            t4.innerHTML = e4.sanitizerHTML(`
    <div class="${e4.styles.timeContent}" data-vc-time="content">
      ${X("hour", e4.styles.timeHour, e4.labels, e4.context.selectedHours, a3)}
      ${X("minute", e4.styles.timeMinute, e4.labels, e4.context.selectedMinutes, a3)}
      ${12 === e4.selectionTimeMode ? (r3 = e4.context.selectedKeeping, `<button type="button" class="${e4.styles.timeKeeping}" aria-label="${e4.labels.btnKeeping} ${r3}" data-vc-time="keeping" ${a3 ? "disabled" : ""}>${r3}</button>`) : ""}
    </div>
    <div class="${e4.styles.timeRanges}" data-vc-time="ranges">
      ${ee("hour", e4.styles.timeRange, e4.labels, i3, s3, e4.timeStepHour, l3)}
      ${ee("minute", e4.styles.timeRange, e4.labels, n3, o3, e4.timeStepMinute, e4.context.selectedMinutes)}
    </div>
  `), ce(e4, t4);
          })(e3), t3[e3.context.currentType]();
        }, we = (e3) => {
          const t3 = (t4) => {
            var i3;
            const s3 = t4.target;
            if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(t4.key) || "button" !== s3.localName) return;
            const n3 = Array.from(e3.context.mainElement.querySelectorAll('[data-vc="calendar"] button')), o3 = n3.indexOf(s3);
            if (-1 === o3) return;
            const l3 = (a3 = n3[o3]).hasAttribute("data-vc-date-btn") ? 7 : a3.hasAttribute("data-vc-months-month") ? 4 : a3.hasAttribute("data-vc-years-year") ? 5 : 1;
            var a3;
            const r3 = (0, { ArrowUp: () => Math.max(0, o3 - l3), ArrowDown: () => Math.min(n3.length - 1, o3 + l3), ArrowLeft: () => Math.max(0, o3 - 1), ArrowRight: () => Math.min(n3.length - 1, o3 + 1) }[t4.key])();
            null == (i3 = n3[r3]) || i3.focus();
          };
          return e3.context.mainElement.addEventListener("keydown", t3), () => e3.context.mainElement.removeEventListener("keydown", t3);
        }, Ce = (e3, t3) => {
          const i3 = M2(D2(new Date(e3.context.selectedYear, e3.context.selectedMonth, 1)));
          ({ prev: () => i3.setMonth(i3.getMonth() - e3.monthsToSwitch), next: () => i3.setMonth(i3.getMonth() + e3.monthsToSwitch) })[t3](), y2(e3, "selectedMonth", i3.getMonth()), y2(e3, "selectedYear", i3.getFullYear()), J(e3), Y(e3), F(e3);
        }, xe = (e3, t3) => void 0 === t3 || ("function" == typeof t3 ? t3(e3) : t3), Se = (e3) => xe(e3, e3.enableDateToggle), ke = (e3, t3, i3) => {
          const s3 = t3.dataset.vcDate, n3 = t3.closest("[data-vc-date][data-vc-date-selected]"), o3 = Se(e3);
          if (n3 && !o3) return;
          const l3 = n3 ? e3.context.selectedDates.filter((e4) => e4 !== s3) : i3 ? [...e3.context.selectedDates, s3] : [s3];
          y2(e3, "selectedDates", l3);
        }, Le = (e3, t3, i3) => {
          if (!t3) return;
          if (!i3) return t3.dataset.vcDateRangeTooltip = "hidden", void (t3.textContent = "");
          const s3 = e3.context.mainElement.getBoundingClientRect(), n3 = i3.getBoundingClientRect();
          t3.style.left = n3.left - s3.left + n3.width / 2 + "px", t3.style.top = n3.bottom - s3.top - n3.height + "px", t3.dataset.vcDateRangeTooltip = "visible", t3.innerHTML = e3.sanitizerHTML(e3.onCreateDateRangeTooltip(e3, i3, t3, n3, s3));
        }, Ee = { self: null, lastDateEl: null, isHovering: false, rangeMin: void 0, rangeMax: void 0, tooltipEl: null, timeoutId: null }, Te = (e3, t3, i3) => {
          var s3, n3, o3;
          if (!(null == (n3 = null == (s3 = Ee.self) ? void 0 : s3.context) ? void 0 : n3.selectedDates[0])) return;
          const l3 = D2(e3);
          (null == (o3 = Ee.self.context.disableDates) ? void 0 : o3.includes(l3)) || (Ee.self.context.mainElement.querySelectorAll(`[data-vc-date="${l3}"]`).forEach((e4) => e4.dataset.vcDateHover = ""), t3.forEach((e4) => e4.dataset.vcDateHover = "first"), i3.forEach((e4) => {
            "first" === e4.dataset.vcDateHover ? e4.dataset.vcDateHover = "first-and-last" : e4.dataset.vcDateHover = "last";
          }));
        }, Ae = () => {
          var e3, t3;
          (null == (t3 = null == (e3 = Ee.self) ? void 0 : e3.context) ? void 0 : t3.mainElement) && Ee.self.context.mainElement.querySelectorAll("[data-vc-date-hover]").forEach((e4) => e4.removeAttribute("data-vc-date-hover"));
        }, Ie = (e3) => (t3) => {
          const i3 = t3.target;
          Ee.isHovering || (Ee.isHovering = true, requestAnimationFrame(() => {
            e3(i3), Ee.isHovering = false;
          }));
        }, Me = Ie((e3) => {
          var t3, i3;
          if (!e3 || !(null == (i3 = null == (t3 = Ee.self) ? void 0 : t3.context) ? void 0 : i3.selectedDates[0])) return;
          if (!e3.closest('[data-vc="dates"]')) return Ee.lastDateEl = null, Le(Ee.self, Ee.tooltipEl, null), void Ae();
          const s3 = e3.closest("[data-vc-date]");
          if (!s3 || Ee.lastDateEl === s3) return;
          Ee.lastDateEl = s3, Le(Ee.self, Ee.tooltipEl, s3), Ae();
          const n3 = s3.dataset.vcDate, o3 = M2(Ee.self.context.selectedDates[0]), l3 = M2(n3), a3 = Ee.self.context.mainElement.querySelectorAll(`[data-vc-date="${Ee.self.context.selectedDates[0]}"]`), r3 = Ee.self.context.mainElement.querySelectorAll(`[data-vc-date="${n3}"]`), [c3, d3] = o3 < l3 ? [a3, r3] : [r3, a3], [h3, u3] = o3 < l3 ? [o3, l3] : [l3, o3];
          for (let e4 = new Date(h3); e4 <= u3; e4.setDate(e4.getDate() + 1)) Te(e4, c3, d3);
        }), De = Ie((e3) => {
          const t3 = null == e3 ? void 0 : e3.closest("[data-vc-date-selected]");
          if (!t3 && Ee.lastDateEl) return Ee.lastDateEl = null, void Le(Ee.self, Ee.tooltipEl, null);
          t3 && Ee.lastDateEl !== t3 && (Ee.lastDateEl = t3, Le(Ee.self, Ee.tooltipEl, t3));
        }), Oe = (e3) => {
          Ee.self && "Escape" === e3.key && (Ee.lastDateEl = null, y2(Ee.self, "selectedDates", []), Ee.self.context.mainElement.removeEventListener("mousemove", Me), Ee.self.context.mainElement.removeEventListener("keydown", Oe), Le(Ee.self, Ee.tooltipEl, null), Ae());
        }, $e = () => {
          null !== Ee.timeoutId && clearTimeout(Ee.timeoutId), Ee.timeoutId = setTimeout(() => {
            Ee.lastDateEl = null, Le(Ee.self, Ee.tooltipEl, null), Ae();
          }, 50);
        }, Pe = (e3, t3) => {
          Ee.self = e3, Ee.lastDateEl = t3, Ae(), e3.disableDatesGaps && (Ee.rangeMin = Ee.rangeMin ? Ee.rangeMin : e3.context.displayDateMin, Ee.rangeMax = Ee.rangeMax ? Ee.rangeMax : e3.context.displayDateMax), e3.onCreateDateRangeTooltip && (Ee.tooltipEl = e3.context.mainElement.querySelector("[data-vc-date-range-tooltip]"));
          const i3 = null == t3 ? void 0 : t3.dataset.vcDate;
          if (i3) {
            const t4 = 1 === e3.context.selectedDates.length && e3.context.selectedDates[0].includes(i3), s3 = t4 && !Se(e3) ? [i3, i3] : t4 && Se(e3) ? [] : e3.context.selectedDates.length > 1 ? [i3] : [...e3.context.selectedDates, i3];
            y2(e3, "selectedDates", s3), e3.context.selectedDates.length > 1 && e3.context.selectedDates.sort((e4, t5) => +new Date(e4) - +new Date(t5));
          }
          ({ set: () => (e3.disableDatesGaps && (() => {
            var e4, t4, i4, s3;
            if (!(null == (i4 = null == (t4 = null == (e4 = Ee.self) ? void 0 : e4.context) ? void 0 : t4.selectedDates) ? void 0 : i4[0]) || !(null == (s3 = Ee.self.context.disableDates) ? void 0 : s3[0])) return;
            const n3 = M2(Ee.self.context.selectedDates[0]), [o3, l3] = Ee.self.context.disableDates.map((e5) => M2(e5)).reduce(([e5, t5], i5) => [n3 >= i5 ? i5 : e5, n3 < i5 && null === t5 ? i5 : t5], [null, null]);
            o3 && y2(Ee.self, "displayDateMin", D2(new Date(o3.setDate(o3.getDate() + 1)))), l3 && y2(Ee.self, "displayDateMax", D2(new Date(l3.setDate(l3.getDate() - 1)))), Ee.self.disableDatesPast && !Ee.self.disableAllDates && M2(Ee.self.context.displayDateMin) < M2(Ee.self.context.dateToday) && y2(Ee.self, "displayDateMin", Ee.self.context.dateToday);
          })(), Le(Ee.self, Ee.tooltipEl, t3), Ee.self.context.mainElement.removeEventListener("mousemove", De), Ee.self.context.mainElement.removeEventListener("mouseleave", $e), Ee.self.context.mainElement.removeEventListener("keydown", Oe), Ee.self.context.mainElement.addEventListener("mousemove", Me), Ee.self.context.mainElement.addEventListener("mouseleave", $e), Ee.self.context.mainElement.addEventListener("keydown", Oe), () => {
            Ee.self.context.mainElement.removeEventListener("mousemove", Me), Ee.self.context.mainElement.removeEventListener("mouseleave", $e), Ee.self.context.mainElement.removeEventListener("keydown", Oe);
          }), reset: () => {
            const [i4, s3] = [e3.context.selectedDates[0], e3.context.selectedDates[e3.context.selectedDates.length - 1]], n3 = e3.context.selectedDates[0] !== e3.context.selectedDates[e3.context.selectedDates.length - 1], o3 = O2([`${i4}:${s3}`]).filter((t4) => !e3.context.disableDates.includes(t4)), l3 = n3 ? e3.enableEdgeDatesOnly ? [i4, s3] : o3 : [e3.context.selectedDates[0], e3.context.selectedDates[0]];
            if (y2(e3, "selectedDates", l3), e3.disableDatesGaps && (y2(e3, "displayDateMin", Ee.rangeMin), y2(e3, "displayDateMax", Ee.rangeMax)), Ee.self.context.mainElement.removeEventListener("mousemove", Me), Ee.self.context.mainElement.removeEventListener("mouseleave", $e), Ee.self.context.mainElement.removeEventListener("keydown", Oe), e3.onCreateDateRangeTooltip) return e3.context.selectedDates[0] || (Ee.self.context.mainElement.removeEventListener("mousemove", De), Ee.self.context.mainElement.removeEventListener("mouseleave", $e), Le(Ee.self, Ee.tooltipEl, null)), e3.context.selectedDates[0] && (Ee.self.context.mainElement.addEventListener("mousemove", De), Ee.self.context.mainElement.addEventListener("mouseleave", $e), Le(Ee.self, Ee.tooltipEl, t3)), () => {
              Ee.self.context.mainElement.removeEventListener("mousemove", De), Ee.self.context.mainElement.removeEventListener("mouseleave", $e);
            };
          } })[1 === e3.context.selectedDates.length ? "set" : "reset"]();
        }, Ne = (e3) => {
          e3.context.mainElement.querySelectorAll("[data-vc-date]").forEach((t3) => {
            const i3 = t3.querySelector("[data-vc-date-btn]"), s3 = t3.dataset.vcDate, n3 = M2(s3).getDay();
            P2(e3, e3.context.selectedYear, t3, i3, n3, s3, "current");
          });
        }, He = ["month", "year"], Fe = (e3, t3, i3) => {
          const { currentValue: s3, columnID: n3 } = Q(e3, t3);
          return "month" === e3.context.currentType && n3 >= 0 ? i3 - n3 : "year" === e3.context.currentType && e3.context.selectedYear !== s3 ? i3 - 1 : i3;
        }, qe = (e3, t3, i3, s3) => {
          var n3;
          ({ year: () => {
            if ("multiple" === e3.type) return ((e4, t4) => {
              const i4 = Fe(e4, "year", Number(t4.dataset.vcYearsYear)), s4 = M2(e4.context.dateMin), n4 = M2(e4.context.dateMax), o3 = e4.context.displayMonthsCount - 1, { columnID: l3 } = Q(e4, "year"), a3 = e4.context.selectedMonth < s4.getMonth() && i4 <= s4.getFullYear(), r3 = e4.context.selectedMonth > n4.getMonth() - o3 + l3 && i4 >= n4.getFullYear(), c3 = i4 < s4.getFullYear(), d3 = i4 > n4.getFullYear(), h3 = a3 || c3 ? s4.getFullYear() : r3 || d3 ? n4.getFullYear() : i4, u3 = a3 || c3 ? s4.getMonth() : r3 || d3 ? n4.getMonth() - o3 + l3 : e4.context.selectedMonth;
              y2(e4, "selectedYear", h3), y2(e4, "selectedMonth", u3);
            })(e3, s3);
            y2(e3, "selectedYear", Number(s3.dataset.vcYearsYear));
          }, month: () => {
            if ("multiple" === e3.type) return ((e4, t4) => {
              const i4 = t4.closest('[data-vc-column="month"]').querySelector('[data-vc="year"]'), s4 = Fe(e4, "month", Number(t4.dataset.vcMonthsMonth)), n4 = Number(i4.dataset.vcYear), o3 = M2(e4.context.dateMin), l3 = M2(e4.context.dateMax), a3 = s4 < o3.getMonth() && n4 <= o3.getFullYear(), r3 = s4 > l3.getMonth() && n4 >= l3.getFullYear();
              y2(e4, "selectedYear", n4), y2(e4, "selectedMonth", a3 ? o3.getMonth() : r3 ? l3.getMonth() : s4);
            })(e3, s3);
            y2(e3, "selectedMonth", Number(s3.dataset.vcMonthsMonth));
          } })[i3](), { year: () => {
            var i4;
            return null == (i4 = e3.onClickYear) ? void 0 : i4.call(e3, e3, t3);
          }, month: () => {
            var i4;
            return null == (i4 = e3.onClickMonth) ? void 0 : i4.call(e3, e3, t3);
          } }[i3](), e3.context.currentType !== e3.type ? (y2(e3, "currentType", e3.type), be(e3), null == (n3 = e3.context.mainElement.querySelector(`[data-vc="${i3}"]`)) || n3.focus()) : K(e3, s3, i3, true, true);
        }, Be = (e3, t3) => {
          const i3 = { month: e3.selectionMonthsMode, year: e3.selectionYearsMode };
          He.forEach((s3) => {
            i3[s3] && t3.target && ((e4, t4, i4) => {
              var s4;
              const n3 = t4.target, o3 = n3.closest(`[data-vc="${i4}"]`), l3 = { year: () => ue(e4, n3), month: () => Z(e4, n3) };
              if (o3 && e4.onClickTitle && e4.onClickTitle(e4, t4), o3 && e4.context.currentType !== i4) return l3[i4]();
              const a3 = n3.closest(`[data-vc-${i4}s-${i4}]`);
              if (a3) return qe(e4, t4, i4, a3);
              const r3 = n3.closest('[data-vc="grid"]'), c3 = n3.closest('[data-vc="column"]');
              (e4.context.currentType === i4 && o3 || "multiple" === e4.type && e4.context.currentType === i4 && r3 && !c3) && (y2(e4, "currentType", e4.type), be(e4), null == (s4 = e4.context.mainElement.querySelector(`[data-vc="${i4}"]`)) || s4.focus());
            })(e3, t3, s3);
          });
        }, Re = (e3) => {
          const t3 = (t4) => {
            ((e4, t5) => {
              const i3 = t5.target.closest("[data-vc-arrow]");
              if (i3) {
                if (["default", "multiple"].includes(e4.context.currentType)) Ce(e4, i3.dataset.vcArrow);
                else if ("year" === e4.context.currentType && void 0 !== e4.context.displayYear) {
                  const s3 = { prev: -15, next: 15 }[i3.dataset.vcArrow];
                  y2(e4, "displayYear", e4.context.displayYear + s3), ue(e4, t5.target);
                }
                e4.onClickArrow && e4.onClickArrow(e4, t5);
              }
            })(e3, t4), ((e4, t5) => {
              if (!e4.onClickWeekDay) return;
              const i3 = t5.target.closest("[data-vc-week-day]"), s3 = t5.target.closest('[data-vc="column"]'), n3 = s3 ? s3.querySelectorAll("[data-vc-date-week-day]") : e4.context.mainElement.querySelectorAll("[data-vc-date-week-day]");
              if (!i3 || !n3[0]) return;
              const o3 = Number(i3.dataset.vcWeekDay), l3 = Array.from(n3).filter((e5) => Number(e5.dataset.vcDateWeekDay) === o3);
              e4.onClickWeekDay(e4, o3, l3, t5);
            })(e3, t4), ((e4, t5) => {
              if (!e4.enableWeekNumbers || !e4.onClickWeekNumber) return;
              const i3 = t5.target.closest("[data-vc-week-number]"), s3 = e4.context.mainElement.querySelectorAll("[data-vc-date-week-number]");
              if (!i3 || !s3[0]) return;
              const n3 = Number(i3.innerText), o3 = Number(i3.dataset.vcWeekYear), l3 = Array.from(s3).filter((e5) => Number(e5.dataset.vcDateWeekNumber) === n3);
              e4.onClickWeekNumber(e4, n3, o3, l3, t5);
            })(e3, t4), ((e4, t5) => {
              var i3;
              const s3 = t5.target, n3 = s3.closest("[data-vc-date-btn]");
              if (!e4.selectionDatesMode || !["single", "multiple", "multiple-ranged"].includes(e4.selectionDatesMode) || !n3) return;
              const o3 = n3.closest("[data-vc-date]");
              ({ single: () => ke(e4, o3, false), multiple: () => ke(e4, o3, true), "multiple-ranged": () => Pe(e4, o3) })[e4.selectionDatesMode](), null == (i3 = e4.context.selectedDates) || i3.sort((e5, t6) => +new Date(e5) - +new Date(t6)), e4.onClickDate && e4.onClickDate(e4, t5), e4.inputMode && e4.context.inputElement && e4.context.mainElement && e4.onChangeToInput && e4.onChangeToInput(e4, t5);
              const l3 = s3.closest('[data-vc-date-month="prev"]'), a3 = s3.closest('[data-vc-date-month="next"]');
              ({ prev: () => e4.enableMonthChangeOnDayClick ? Ce(e4, "prev") : Ne(e4), next: () => e4.enableMonthChangeOnDayClick ? Ce(e4, "next") : Ne(e4), current: () => Ne(e4) })[l3 ? "prev" : a3 ? "next" : "current"]();
            })(e3, t4), Be(e3, t4);
          };
          return e3.context.mainElement.addEventListener("click", t3), () => e3.context.mainElement.removeEventListener("click", t3);
        }, Ve = (e3, t3) => "today" === e3 ? (() => {
          const e4 = /* @__PURE__ */ new Date();
          return new Date(e4.getTime() - 6e4 * e4.getTimezoneOffset()).toISOString().substring(0, 10);
        })() : e3 instanceof Date || "number" == typeof e3 || "string" == typeof e3 ? O2([e3])[0] : t3, ze = (e3, t3, i3) => {
          y2(e3, "selectedMonth", t3), y2(e3, "selectedYear", i3), y2(e3, "displayYear", i3);
        }, je = (e3) => {
          var t3;
          if (e3.enableJumpToSelectedDate && (null == (t3 = e3.selectedDates) ? void 0 : t3[0]) && void 0 === e3.selectedMonth && void 0 === e3.selectedYear) {
            const t4 = M2(O2(e3.selectedDates)[0]);
            return void ze(e3, t4.getMonth(), t4.getFullYear());
          }
          if (((e4) => {
            const t4 = (t5) => {
              const i5 = new Date(t5);
              ze(e4, i5.getMonth(), i5.getFullYear());
            };
            if (e4.displayDateMin && "today" !== e4.displayDateMin && (i4 = e4.displayDateMin, s4 = /* @__PURE__ */ new Date(), new Date(i4).getTime() > s4.getTime())) {
              const i5 = e4.selectedDates.length && e4.selectedDates[0] ? O2(e4.selectedDates)[0] : e4.displayDateMin;
              return t4(M2(Ve(i5, e4.displayDateMin))), true;
            }
            var i4, s4;
            if (e4.displayDateMax && "today" !== e4.displayDateMax && ((e5, t5) => new Date(e5).getTime() < t5.getTime())(e4.displayDateMax, /* @__PURE__ */ new Date())) {
              const i5 = e4.selectedDates.length && e4.selectedDates[0] ? O2(e4.selectedDates)[0] : e4.displayDateMax;
              return t4(M2(Ve(i5, e4.displayDateMax))), true;
            }
            return false;
          })(e3)) return;
          const i3 = void 0 !== e3.selectedMonth && Number(e3.selectedMonth) >= 0 && Number(e3.selectedMonth) < 12, s3 = void 0 !== e3.selectedYear && Number(e3.selectedYear) >= 0 && Number(e3.selectedYear) <= 9999;
          ze(e3, i3 ? Number(e3.selectedMonth) : M2(e3.context.dateToday).getMonth(), s3 ? Number(e3.selectedYear) : M2(e3.context.dateToday).getFullYear());
        }, We = (e3) => {
          y2(e3, "currentType", e3.type), ((e4) => {
            if ("multiple" === e4.type && (e4.displayMonthsCount <= 1 || e4.displayMonthsCount > 12)) throw new Error(f2);
            if ("multiple" !== e4.type && e4.displayMonthsCount > 1) throw new Error(f2);
            y2(e4, "displayMonthsCount", e4.displayMonthsCount ? e4.displayMonthsCount : "multiple" === e4.type ? 2 : 1);
          })(e3), ((e4) => {
            var t3, i3, s3;
            const n3 = Ve(e4.dateMin, e4.dateMin), o3 = Ve(e4.dateMax, e4.dateMax), l3 = Ve(e4.displayDateMin, n3), a3 = Ve(e4.displayDateMax, o3);
            y2(e4, "dateToday", Ve(e4.dateToday, e4.dateToday)), y2(e4, "displayDateMin", l3 ? M2(n3) >= M2(l3) ? n3 : l3 : n3), y2(e4, "displayDateMax", a3 ? M2(o3) <= M2(a3) ? o3 : a3 : o3);
            const r3 = e4.disableDatesPast && !e4.disableAllDates && M2(l3) < M2(e4.context.dateToday);
            y2(e4, "displayDateMin", r3 || e4.disableAllDates ? e4.context.dateToday : l3), y2(e4, "displayDateMax", e4.disableAllDates ? e4.context.dateToday : a3), y2(e4, "disableDates", e4.disableDates[0] && !e4.disableAllDates ? O2(e4.disableDates) : e4.disableAllDates ? [e4.context.displayDateMin] : []), e4.context.disableDates.length > 1 && e4.context.disableDates.sort((e5, t4) => +new Date(e5) - +new Date(t4)), y2(e4, "enableDates", e4.enableDates[0] ? O2(e4.enableDates) : []), (null == (t3 = e4.context.enableDates) ? void 0 : t3[0]) && (null == (i3 = e4.context.disableDates) ? void 0 : i3[0]) && y2(e4, "disableDates", e4.context.disableDates.filter((t4) => !e4.context.enableDates.includes(t4))), e4.context.enableDates.length > 1 && e4.context.enableDates.sort((e5, t4) => +new Date(e5) - +new Date(t4)), (null == (s3 = e4.context.enableDates) ? void 0 : s3[0]) && e4.disableAllDates && (y2(e4, "displayDateMin", e4.context.enableDates[0]), y2(e4, "displayDateMax", e4.context.enableDates[e4.context.enableDates.length - 1])), y2(e4, "dateMin", e4.displayDisabledDates ? n3 : e4.context.displayDateMin), y2(e4, "dateMax", e4.displayDisabledDates ? o3 : e4.context.displayDateMax);
          })(e3), je(e3), ((e4) => {
            var t3;
            y2(e4, "selectedDates", (null == (t3 = e4.selectedDates) ? void 0 : t3[0]) ? O2(e4.selectedDates) : []);
          })(e3), ((e4) => {
            var t3, i3, s3;
            if (!e4.selectionTimeMode) return;
            if (![12, 24].includes(e4.selectionTimeMode)) throw new Error(v2);
            const n3 = 12 === e4.selectionTimeMode, o3 = n3 ? /^(0[1-9]|1[0-2]):([0-5][0-9]) ?(AM|PM)?$/i : /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
            let [l3, a3, r3] = null != (s3 = null == (i3 = null == (t3 = e4.selectedTime) ? void 0 : t3.match(o3)) ? void 0 : i3.slice(1)) ? s3 : [];
            l3 ? n3 && !r3 && (r3 = "AM") : (l3 = n3 ? se(String(e4.timeMinHour)) : String(e4.timeMinHour), a3 = String(e4.timeMinMinute), r3 = n3 ? Number(se(String(e4.timeMinHour))) >= 12 ? "PM" : "AM" : null), y2(e4, "selectedHours", l3.padStart(2, "0")), y2(e4, "selectedMinutes", a3.padStart(2, "0")), y2(e4, "selectedKeeping", r3), y2(e4, "selectedTime", `${e4.context.selectedHours}:${e4.context.selectedMinutes}${r3 ? ` ${r3}` : ""}`);
          })(e3);
        }, Ue = (e3, { year: t3, month: i3, dates: s3, time: n3, locale: o3 }, l3 = true) => {
          var a3;
          const r3 = { year: e3.selectedYear, month: e3.selectedMonth, dates: e3.selectedDates, time: e3.selectedTime };
          e3.selectedYear = t3 ? r3.year : e3.context.selectedYear, e3.selectedMonth = i3 ? r3.month : e3.context.selectedMonth, e3.selectedTime = n3 ? r3.time : e3.context.selectedTime, e3.selectedDates = "only-first" === s3 && (null == (a3 = e3.context.selectedDates) ? void 0 : a3[0]) ? [e3.context.selectedDates[0]] : true === s3 ? r3.dates : e3.context.selectedDates, o3 && y2(e3, "locale", { months: { short: [], long: [] }, weekdays: { short: [], long: [] } }), We(e3), l3 && be(e3), e3.selectedYear = r3.year, e3.selectedMonth = r3.month, e3.selectedDates = r3.dates, e3.selectedTime = r3.time, "multiple-ranged" === e3.selectionDatesMode && s3 && Pe(e3, null);
        }, Ye = (e3) => {
          y2(e3, "inputElement", e3.context.mainElement);
          const t3 = () => {
            e3.context.inputModeInit ? setTimeout(() => Qe(e3)) : ((e4) => {
              const t4 = document.createElement("div");
              t4.className = e4.styles.calendar, t4.dataset.vc = "calendar", t4.dataset.vcInput = "", t4.dataset.vcCalendarHidden = "", y2(e4, "inputModeInit", true), y2(e4, "isShowInInputMode", false), y2(e4, "mainElement", t4), document.body.appendChild(e4.context.mainElement), Ue(e4, { year: true, month: true, dates: true, time: true, locale: true }), setTimeout(() => Qe(e4)), e4.onInit && e4.onInit(e4), we(e4), Re(e4);
            })(e3);
          };
          e3.context.inputElement.addEventListener("click", t3);
          const i3 = "function" == typeof e3.openOnFocus || true === e3.openOnFocus, s3 = () => {
            ((e4) => b2.has(e4))(e3) ? ((e4) => {
              b2.delete(e4);
            })(e3) : ((e4) => xe(e4, e4.openOnFocus))(e3) && t3();
          };
          i3 && e3.context.inputElement.addEventListener("focus", s3);
          const n3 = (t4) => {
            const i4 = "Tab" === t4.key && !t4.shiftKey, s4 = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(t4.key);
            (i4 || s4) && ((t5) => {
              var i5;
              if (!e3.context.isShowInInputMode) return false;
              if (document.activeElement !== e3.context.inputElement) return false;
              const s5 = (e4) => e4.tabIndex >= 0 && !e4.hasAttribute("disabled") && "true" !== e4.getAttribute("aria-disabled"), n4 = null != (i5 = document.createTreeWalker(e3.context.mainElement, NodeFilter.SHOW_ELEMENT, { acceptNode: (e4) => s5(e4) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP }).nextNode()) ? i5 : s5(e3.context.mainElement) ? e3.context.mainElement : null;
              !n4 || n4.tabIndex < 0 || (t5.preventDefault(), n4.focus());
            })(t4);
          };
          return e3.context.inputElement.addEventListener("keydown", n3), () => {
            e3.context.inputElement.removeEventListener("click", t3), i3 && e3.context.inputElement.removeEventListener("focus", s3), e3.context.inputElement.removeEventListener("keydown", n3);
          };
        }, _e = (e3, t3) => {
          if (!e3.context.isInit) throw new Error(m2);
          Ue(e3, h2(h2({}, { year: true, month: true, dates: true, time: true, locale: true }), t3), !(e3.inputMode && !e3.context.inputModeInit)), e3.onUpdate && e3.onUpdate(e3);
        }, Je = (e3, t3) => {
          const i3 = Object.keys(t3);
          for (let s3 = 0; s3 < i3.length; s3++) {
            const n3 = i3[s3];
            "object" != typeof e3[n3] || "object" != typeof t3[n3] || t3[n3] instanceof Date || Array.isArray(t3[n3]) ? void 0 !== t3[n3] && (e3[n3] = t3[n3]) : Je(e3[n3], t3[n3]);
          }
        };
        const Ke = (e3, t3, i3) => {
          if (!e3) return;
          const s3 = "auto" === i3 ? (function(e4, t4) {
            const i4 = "left";
            if (!t4 || !e4) return i4;
            const { canShow: s4, parentPositions: n4 } = A2(e4, t4), o4 = s4.left && s4.right;
            return (o4 && s4.bottom ? "center" : o4 && s4.top ? ["top", "center"] : Array.isArray(n4) ? ["bottom" === n4[0] ? "top" : "bottom", ...n4.slice(1)] : n4) || i4;
          })(e3, t3) : i3, n3 = { top: -t3.offsetHeight, bottom: e3.offsetHeight, left: 0, center: e3.offsetWidth / 2 - t3.offsetWidth / 2, right: e3.offsetWidth - t3.offsetWidth }, o3 = Array.isArray(s3) ? s3[0] : "bottom", l3 = Array.isArray(s3) ? s3[1] : s3;
          t3.dataset.vcPosition = o3;
          const { top: a3, left: r3 } = L2(e3), c3 = a3 + n3[o3];
          let d3 = r3 + n3[l3];
          const { vw: h3 } = E2();
          if (d3 + t3.clientWidth > h3) {
            const e4 = window.innerWidth - document.body.clientWidth;
            d3 = h3 - t3.clientWidth - e4;
          } else d3 < 0 && (d3 = 0);
          Object.assign(t3.style, { left: `${d3}px`, top: `${c3}px` });
        }, Qe = (e3) => {
          if (e3.context.isShowInInputMode) return;
          if (!e3.context.currentType) return void e3.context.mainElement.click();
          y2(e3, "cleanupHandlers", []), y2(e3, "isShowInInputMode", true), e3.inputMode && ((e4) => {
            S2(e4), e4.querySelectorAll(`[${w2}]`).forEach(S2);
          })(e3.context.mainElement), Ke(e3.context.inputElement, e3.context.mainElement, e3.positionToInput), e3.context.mainElement.removeAttribute("data-vc-calendar-hidden");
          const t3 = () => {
            Ke(e3.context.inputElement, e3.context.mainElement, e3.positionToInput);
          };
          window.addEventListener("resize", t3), e3.context.cleanupHandlers.push(() => window.removeEventListener("resize", t3));
          const i3 = (t4) => {
            "Escape" === t4.key && k2(e3);
          };
          document.addEventListener("keydown", i3), e3.context.cleanupHandlers.push(() => document.removeEventListener("keydown", i3));
          const s3 = (t4) => {
            t4.target === e3.context.inputElement || e3.context.mainElement.contains(t4.target) || k2(e3);
          };
          document.addEventListener("click", s3, { capture: true }), e3.context.cleanupHandlers.push(() => document.removeEventListener("click", s3, { capture: true })), e3.onShow && e3.onShow(e3);
        }, Ge = { application: "Calendar", navigation: "Calendar Navigation", arrowNext: { month: "Next month", year: "Next list of years" }, arrowPrev: { month: "Previous month", year: "Previous list of years" }, month: "Select month, current selected month:", months: "List of months", year: "Select year, current selected year:", years: "List of years", week: "Days of the week", weekNumber: "Numbers of weeks in a year", dates: "Dates in the current month", selectingTime: "Selecting a time ", inputHour: "Hours", inputMinute: "Minutes", rangeHour: "Slider for selecting hours", rangeMinute: "Slider for selecting minutes", btnKeeping: "Switch AM/PM, current position:" }, Ze = { calendar: "vc", controls: "vc-controls", grid: "vc-grid", column: "vc-column", header: "vc-header", headerContent: "vc-header__content", month: "vc-month", year: "vc-year", arrowPrev: "vc-arrow vc-arrow_prev", arrowNext: "vc-arrow vc-arrow_next", wrapper: "vc-wrapper", content: "vc-content", months: "vc-months", monthsMonth: "vc-months__month", years: "vc-years", yearsYear: "vc-years__year", week: "vc-week", weekDay: "vc-week__day", weekNumbers: "vc-week-numbers", weekNumbersTitle: "vc-week-numbers__title", weekNumbersContent: "vc-week-numbers__content", weekNumber: "vc-week-number", dates: "vc-dates", datesRow: "vc-dates__row", date: "vc-date", dateBtn: "vc-date__btn", datePopup: "vc-date__popup", dateRangeTooltip: "vc-date-range-tooltip", time: "vc-time", timeContent: "vc-time__content", timeHour: "vc-time__hour", timeMinute: "vc-time__minute", timeKeeping: "vc-time__keeping", timeRanges: "vc-time__ranges", timeRange: "vc-time__range" };
        class Xe {
          constructor() {
            u2(this, "type", "default"), u2(this, "inputMode", false), u2(this, "openOnFocus", true), u2(this, "positionToInput", "left"), u2(this, "firstWeekday", 1), u2(this, "monthsToSwitch", 1), u2(this, "themeAttrDetect", "html[data-theme]"), u2(this, "locale", "en"), u2(this, "dateToday", "today"), u2(this, "dateMin", "1970-01-01"), u2(this, "dateMax", "2470-12-31"), u2(this, "displayDateMin"), u2(this, "displayDateMax"), u2(this, "displayDatesOutside", true), u2(this, "displayDisabledDates", false), u2(this, "displayMonthsCount"), u2(this, "disableDates", []), u2(this, "disableAllDates", false), u2(this, "disableDatesPast", false), u2(this, "disableDatesGaps", false), u2(this, "disableWeekdays", []), u2(this, "disableToday", false), u2(this, "enableDates", []), u2(this, "enableEdgeDatesOnly", true), u2(this, "enableDateToggle", true), u2(this, "enableWeekNumbers", false), u2(this, "enableMonthChangeOnDayClick", true), u2(this, "enableJumpToSelectedDate", false), u2(this, "selectionDatesMode", "single"), u2(this, "selectionMonthsMode", true), u2(this, "selectionYearsMode", true), u2(this, "selectionTimeMode", false), u2(this, "selectedDates", []), u2(this, "selectedMonth"), u2(this, "selectedYear"), u2(this, "selectedHolidays", []), u2(this, "selectedWeekends", [0, 6]), u2(this, "selectedTime"), u2(this, "selectedTheme", "system"), u2(this, "timeMinHour", 0), u2(this, "timeMaxHour", 23), u2(this, "timeMinMinute", 0), u2(this, "timeMaxMinute", 59), u2(this, "timeControls", "all"), u2(this, "timeStepHour", 1), u2(this, "timeStepMinute", 1), u2(this, "sanitizerHTML", (e3) => e3), u2(this, "onClickDate"), u2(this, "onClickWeekDay"), u2(this, "onClickWeekNumber"), u2(this, "onClickTitle"), u2(this, "onClickMonth"), u2(this, "onClickYear"), u2(this, "onClickArrow"), u2(this, "onChangeTime"), u2(this, "onChangeToInput"), u2(this, "onCreateDateRangeTooltip"), u2(this, "onCreateDateEls"), u2(this, "onCreateMonthEls"), u2(this, "onCreateYearEls"), u2(this, "onInit"), u2(this, "onUpdate"), u2(this, "onDestroy"), u2(this, "onShow"), u2(this, "onHide"), u2(this, "popups", {}), u2(this, "labels", h2({}, Ge)), u2(this, "layouts", { default: "", multiple: "", month: "", year: "" }), u2(this, "styles", h2({}, Ze));
          }
        }
        const et = class e3 extends Xe {
          constructor(t3, i3) {
            var s3;
            super(), u2(this, "init", () => ((e4) => (y2(e4, "originalElement", e4.context.mainElement.cloneNode(true)), y2(e4, "isInit", true), e4.inputMode ? Ye(e4) : (We(e4), be(e4), e4.onInit && e4.onInit(e4), we(e4), Re(e4))))(this)), u2(this, "update", (e4) => _e(this, e4)), u2(this, "destroy", () => ((e4) => {
              var t4, i4, s4, n3, o3;
              if (!e4.context.isInit) throw new Error(m2);
              e4.inputMode ? (null == (t4 = e4.context.mainElement.parentElement) || t4.removeChild(e4.context.mainElement), null == (s4 = null == (i4 = e4.context.inputElement) ? void 0 : i4.replaceWith) || s4.call(i4, e4.context.originalElement), y2(e4, "inputElement", void 0)) : null == (o3 = (n3 = e4.context.mainElement).replaceWith) || o3.call(n3, e4.context.originalElement), y2(e4, "mainElement", e4.context.originalElement), e4.onDestroy && e4.onDestroy(e4);
            })(this)), u2(this, "show", () => Qe(this)), u2(this, "hide", () => k2(this)), u2(this, "set", (e4, t4) => ((e5, t5, i4) => {
              Je(e5, t5), e5.context.isInit && _e(e5, i4);
            })(this, e4, t4)), u2(this, "context"), this.context = ((e4, t4) => o2(e4, l2(t4)))(h2({}, this.context), { locale: { months: { short: [], long: [] }, weekdays: { short: [], long: [] } } }), y2(this, "mainElement", "string" == typeof t3 ? null != (s3 = e3.memoizedElements.get(t3)) ? s3 : this.queryAndMemoize(t3) : t3), i3 && Je(this, i3);
          }
          queryAndMemoize(t3) {
            const i3 = document.querySelector(t3);
            if (!i3) throw new Error(p2(t3));
            return e3.memoizedElements.set(t3, i3), i3;
          }
        };
        u2(et, "memoizedElements", /* @__PURE__ */ new Map());
        let tt = et;
        const it = class extends tt {
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = this.set;
            this.set = (e4, t4) => {
              i3 && i3.call(this, e4, t4), e4.selectedTime && this.onChangeTime && this.onChangeTime(this, null, true), e4.selectedMonth && this.onClickMonth && this.onClickMonth(this, null), e4.selectedYear && this.onClickYear && this.onClickYear(this, null);
            };
          }
          static get defaultStyles() {
            return { calendar: "vc", controls: "vc-controls", grid: "vc-grid", column: "vc-column", header: "vc-header", headerContent: "vc-header__content", month: "vc-month", year: "vc-year", arrowPrev: "vc-arrow vc-arrow_prev", arrowNext: "vc-arrow vc-arrow_next", wrapper: "vc-wrapper", content: "vc-content", months: "vc-months", monthsMonth: "vc-months__month", years: "vc-years", yearsYear: "vc-years__year", week: "vc-week", weekDay: "vc-week__day", weekNumbers: "vc-week-numbers", weekNumbersTitle: "vc-week-numbers__title", weekNumbersContent: "vc-week-numbers__content", weekNumber: "vc-week-number", dates: "vc-dates", date: "vc-date", dateBtn: "vc-date__btn", datePopup: "vc-date__popup", dateRangeTooltip: "vc-date-range-tooltip", time: "vc-time", timeContent: "vc-time__content", timeHour: "vc-time__hour", timeMinute: "vc-time__minute", timeKeeping: "vc-time__keeping", timeRanges: "vc-time__ranges", timeRange: "vc-time__range" };
          }
          logInfo() {
            console.log("This log is from CustomVanillaCalendar!", this);
          }
        }, st = { default: (e3 = false) => `<div class="--single-month flex flex-col overflow-hidden">
    <div class="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3" data-vc="header">
      <div class="col-span-1">
        <#CustomArrowPrev />
      </div>
      <div class="col-span-3 flex justify-center items-center gap-x-1">
        <#CustomMonth />
        <span class="text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}">/</span>
        <#CustomYear />
      </div>
      <div class="col-span-1 flex justify-end">
        <#CustomArrowNext />
      </div>
    </div>
    <div data-vc="wrapper">
      <div data-vc="content">
        <#Week />
        <#Dates />
      </div>
    </div>
  </div>`, multiple: (e3 = false) => `<div class="relative flex flex-col overflow-hidden">
    <div class="absolute top-2 inset-s-2">
      <#CustomArrowPrev />
    </div>
    <div class="absolute top-2 inset-e-2">
      <#CustomArrowNext />
    </div>
    <div class="sm:flex" data-vc="grid">
      <#Multiple>
        <div class="p-3 space-y-0.5 --single-month" data-vc="column">
          <div class="pb-3" data-vc="header">
            <div class="flex justify-center items-center gap-x-1" data-vc-header="content">
              <#CustomMonth />
              <span class="text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}">/</span>
              <#CustomYear />
            </div>
          </div>
          <div data-vc="wrapper">
            <div data-vc="content">
              <#Week />
              <#Dates />
            </div>
          </div>
        </div>
      <#/Multiple>
    </div>
  </div>`, year: (e3 = false) => `<div class="relative bg-white ${"light" !== e3 ? "dark:bg-neutral-900" : ""}" data-vc="header" role="toolbar">
    <div class="grid grid-cols-5 items-center gap-x-3 mx-1.5 py-3" data-vc="header">
      <div class="col-span-1">
        <#CustomArrowPrev />
      </div>
      <div class="col-span-3 flex justify-center items-center gap-x-1">
        <#Month />
        <span class="text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}">/</span>
        <#Year />
      </div>
      <div class="col-span-1 flex justify-end">
        <#CustomArrowNext />
      </div>
    </div>
  </div>
  <div data-vc="wrapper">
    <div data-vc="content">
      <#Years />
    </div>
  </div>`, month: (e3 = false) => `<div class="py-3" data-vc="header" role="toolbar">
    <div class="flex justify-center items-center gap-x-1" data-vc-header="content">
      <#Month />
      <span class="text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}">/</span>
      <#Year />
    </div>
  </div>
  <div data-vc="wrapper">
    <div data-vc="content">
      <#Months />
    </div>
  </div>`, years: (e3, t3 = false) => `<div class="relative">
      <span class="hidden" data-vc="year"></span>
      <select data-hs-select='{
          "placeholder": "Select year",
          "dropdownScope": "parent",
          "dropdownVerticalFixedPlacement": "bottom",
          "toggleTag": "<button type=\\"button\\"><span data-title></span></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-gray-600 focus:outline-hidden focus:text-gray-600 before:absolute before:inset-0 before:z-1 ${"light" !== t3 ? "dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300" : ""}",
          "dropdownClasses": "mt-2 z-50 w-20 max-h-60 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== t3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
          "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 ${"light" !== t3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
          "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 ${"light" !== t3 ? "dark:text-neutral-200" : ""}\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>"
        }' class="hidden --year --prevent-on-load-init">
        ${e3}
      </select>
    </div>`, months: (e3 = false) => `<div class="relative">
    <span class="hidden" data-vc="month"></span>
    <select data-hs-select='{
        "placeholder": "Select month",
        "dropdownScope": "parent",
        "dropdownVerticalFixedPlacement": "bottom",
        "toggleTag": "<button type=\\"button\\"><span data-title></span></button>",
        "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-gray-600 focus:outline-hidden focus:text-gray-600 before:absolute before:inset-0 before:z-1 ${"light" !== e3 ? "dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300" : ""}",
        "dropdownClasses": "mt-2 z-50 w-32 max-h-60 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== e3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
        "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg hs-select-disabled:opacity-50 hs-select-disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 ${"light" !== e3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
        "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>"
      }' class="hidden --month --prevent-on-load-init">
      <option value="0">January</option>
      <option value="1">February</option>
      <option value="2">March</option>
      <option value="3">April</option>
      <option value="4">May</option>
      <option value="5">June</option>
      <option value="6">July</option>
      <option value="7">August</option>
      <option value="8">September</option>
      <option value="9">October</option>
      <option value="10">November</option>
      <option value="11">December</option>
    </select>
  </div>`, hours: (e3 = false) => `<div class="relative">
    <select class="--hours hidden" data-hs-select='{
      "placeholder": "Select option...",
      "dropdownVerticalFixedPlacement": "top",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 px-2 pe-6 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 ${"light" !== e3 ? "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400" : ""}",
      "dropdownClasses": "mt-2 z-50 w-full min-w-24 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== e3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
      "optionClasses": "hs-selected:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-neutral-800" : ""} py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-gray-700" : ""} ${"light" !== e3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span></div>"
    }'>
      <option value="01">01</option>
      <option value="02">02</option>
      <option value="03">03</option>
      <option value="04">04</option>
      <option value="05">05</option>
      <option value="06">06</option>
      <option value="07">07</option>
      <option value="08">08</option>
      <option value="09">09</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12" selected>12</option>
    </select>
    <div class="absolute top-1/2 inset-e-2 -translate-y-1/2">
      <svg class="shrink-0 size-3 text-gray-500 ${"light" !== e3 ? "dark:text-neutral-500" : ""}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    </div>
  </div>`, minutes: (e3 = false) => `<div class="relative">
    <select class="--minutes hidden" data-hs-select='{
      "placeholder": "Select option...",
      "dropdownVerticalFixedPlacement": "top",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 px-2 pe-6 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 ${"light" !== e3 ? "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400" : ""}",
      "dropdownClasses": "mt-2 z-50 w-full min-w-24 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== e3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
      "optionClasses": "hs-selected:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-neutral-800" : ""} py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-gray-700" : ""} ${"light" !== e3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span></div>"
    }'>
      <option value="00" selected>00</option>
      <option value="01">01</option>
      <option value="02">02</option>
      <option value="03">03</option>
      <option value="04">04</option>
      <option value="05">05</option>
      <option value="06">06</option>
      <option value="07">07</option>
      <option value="08">08</option>
      <option value="09">09</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
      <option value="13">13</option>
      <option value="14">14</option>
      <option value="15">15</option>
      <option value="16">16</option>
      <option value="17">17</option>
      <option value="18">18</option>
      <option value="19">19</option>
      <option value="20">20</option>
      <option value="21">21</option>
      <option value="22">22</option>
      <option value="23">23</option>
      <option value="24">24</option>
      <option value="25">25</option>
      <option value="26">26</option>
      <option value="27">27</option>
      <option value="28">28</option>
      <option value="29">29</option>
      <option value="30">30</option>
      <option value="31">31</option>
      <option value="32">32</option>
      <option value="33">33</option>
      <option value="34">34</option>
      <option value="35">35</option>
      <option value="36">36</option>
      <option value="37">37</option>
      <option value="38">38</option>
      <option value="39">39</option>
      <option value="40">40</option>
      <option value="41">41</option>
      <option value="42">42</option>
      <option value="43">43</option>
      <option value="44">44</option>
      <option value="45">45</option>
      <option value="46">46</option>
      <option value="47">47</option>
      <option value="48">48</option>
      <option value="49">49</option>
      <option value="50">50</option>
      <option value="51">51</option>
      <option value="52">52</option>
      <option value="53">53</option>
      <option value="54">54</option>
      <option value="55">55</option>
      <option value="56">56</option>
      <option value="57">57</option>
      <option value="58">58</option>
      <option value="59">59</option>
    </select>
    <div class="absolute top-1/2 inset-e-2 -translate-y-1/2">
      <svg class="shrink-0 size-3 text-gray-500 ${"light" !== e3 ? "dark:text-neutral-500" : ""}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    </div>
  </div>`, meridiem: (e3 = false) => `<div class="relative">
    <select class="--meridiem hidden" data-hs-select='{
      "placeholder": "Select option...",
      "dropdownVerticalFixedPlacement": "top",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 px-2 pe-6 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 ${"light" !== e3 ? "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400" : ""}",
      "dropdownClasses": "mt-2 z-50 w-full min-w-24 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== e3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
      "optionClasses": "hs-selected:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-neutral-800" : ""} py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-gray-700" : ""} ${"light" !== e3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span></div>"
    }'>
      <option value="PM" selected>PM</option>
      <option value="AM">AM</option>
    </select>
    <div class="absolute top-1/2 inset-e-2 -translate-y-1/2">
      <svg class="shrink-0 size-3 text-gray-500 ${"light" !== e3 ? "dark:text-neutral-500" : ""}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    </div>
  </div>` }, nt = { default: (e3 = false) => `<div class="--single-month flex flex-col overflow-hidden">
    <div class="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3" data-vc="header">
      <div class="col-span-1">
        <#CustomArrowPrev />
      </div>
      <div class="col-span-3 flex justify-center items-center gap-x-1">
        <#CustomMonth />
        <span class="text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}">/</span>
        <#CustomYear />
      </div>
      <div class="col-span-1 flex justify-end">
        <#CustomArrowNext />
      </div>
    </div>
    <div data-vc="wrapper">
      <div data-vc="content">
        <#Week />
        <#Dates />
      </div>
    </div>
  </div>`, multiple: (e3 = false) => `<div class="relative flex flex-col overflow-hidden">
    <div class="absolute top-2 inset-s-2">
      <#CustomArrowPrev />
    </div>
    <div class="absolute top-2 inset-e-2">
      <#CustomArrowNext />
    </div>
    <div class="sm:flex" data-vc="grid">
      <#Multiple>
        <div class="p-3 space-y-0.5 --single-month" data-vc="column">
          <div class="pb-3" data-vc="header">
            <div class="flex justify-center items-center gap-x-1" data-vc-header="content">
              <#CustomMonth />
              <span class="text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}">/</span>
              <#CustomYear />
            </div>
          </div>
          <div data-vc="wrapper">
            <div data-vc="content">
              <#Week />
              <#Dates />
            </div>
          </div>
        </div>
      <#/Multiple>
    </div>
  </div>`, year: (e3 = false) => `<div class="relative bg-white ${"light" !== e3 ? "dark:bg-neutral-900" : ""}" data-vc="header" role="toolbar">
    <div class="grid grid-cols-5 items-center gap-x-3 mx-1.5 py-3" data-vc="header">
      <div class="col-span-1">
        <#CustomArrowPrev />
      </div>
      <div class="col-span-3 flex justify-center items-center gap-x-1">
        <#Month />
        <span class="text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}">/</span>
        <#Year />
      </div>
      <div class="col-span-1 flex justify-end">
        <#CustomArrowNext />
      </div>
    </div>
  </div>
  <div data-vc="wrapper">
    <div data-vc="content">
      <#Years />
    </div>
  </div>`, month: (e3 = false) => `<div class="py-3" data-vc="header" role="toolbar">
    <div class="flex justify-center items-center gap-x-1" data-vc-header="content">
      <#Month />
      <span class="text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}">/</span>
      <#Year />
    </div>
  </div>
  <div data-vc="wrapper">
    <div data-vc="content">
      <#Months />
    </div>
  </div>`, years: (e3, t3 = false) => `<div class="relative">
      <span class="hidden" data-vc="year"></span>
      <select data-hs-select='{
          "placeholder": "Select year",
          "dropdownScope": "parent",
          "dropdownVerticalFixedPlacement": "bottom",
          "toggleTag": "<button type=\\"button\\"><span data-title></span></button>",
          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-gray-600 focus:outline-hidden focus:text-gray-600 before:absolute before:inset-0 before:z-1 ${"light" !== t3 ? "dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300" : ""}",
          "dropdownClasses": "mt-2 z-50 w-20 max-h-60 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== t3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
          "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 ${"light" !== t3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
          "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 ${"light" !== t3 ? "dark:text-neutral-200" : ""}\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>"
        }' class="hidden --year --prevent-on-load-init">
        ${e3}
      </select>
    </div>`, months: (e3 = false) => `<div class="relative">
    <span class="hidden" data-vc="month"></span>
    <select data-hs-select='{
        "placeholder": "Select month",
        "dropdownScope": "parent",
        "dropdownVerticalFixedPlacement": "bottom",
        "toggleTag": "<button type=\\"button\\"><span data-title></span></button>",
        "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-gray-600 focus:outline-hidden focus:text-gray-600 before:absolute before:inset-0 before:z-1 ${"light" !== e3 ? "dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300" : ""}",
        "dropdownClasses": "mt-2 z-50 w-32 max-h-60 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== e3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
        "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg hs-select-disabled:opacity-50 hs-select-disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 ${"light" !== e3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
        "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 ${"light" !== e3 ? "dark:text-neutral-200" : ""}\\" xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>"
      }' class="hidden --month --prevent-on-load-init">
      <option value="0">January</option>
      <option value="1">February</option>
      <option value="2">March</option>
      <option value="3">April</option>
      <option value="4">May</option>
      <option value="5">June</option>
      <option value="6">July</option>
      <option value="7">August</option>
      <option value="8">September</option>
      <option value="9">October</option>
      <option value="10">November</option>
      <option value="11">December</option>
    </select>
  </div>`, hours: (e3 = false) => `<div class="relative">
    <select class="--hours hidden" data-hs-select='{
      "placeholder": "Select option...",
      "dropdownVerticalFixedPlacement": "top",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 px-2 pe-6 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 ${"light" !== e3 ? "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400" : ""}",
      "dropdownClasses": "mt-2 z-50 w-full min-w-24 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== e3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
      "optionClasses": "hs-selected:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-neutral-800" : ""} py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-gray-700" : ""} ${"light" !== e3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span></div>"
    }'>
      <option value="01">01</option>
      <option value="02">02</option>
      <option value="03">03</option>
      <option value="04">04</option>
      <option value="05">05</option>
      <option value="06">06</option>
      <option value="07">07</option>
      <option value="08">08</option>
      <option value="09">09</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12" selected>12</option>
    </select>
    <div class="absolute top-1/2 inset-e-2 -translate-y-1/2">
      <svg class="shrink-0 size-3 text-gray-500 ${"light" !== e3 ? "dark:text-neutral-500" : ""}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    </div>
  </div>`, minutes: (e3 = false) => `<div class="relative">
    <select class="--minutes hidden" data-hs-select='{
      "placeholder": "Select option...",
      "dropdownVerticalFixedPlacement": "top",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 px-2 pe-6 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 ${"light" !== e3 ? "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400" : ""}",
      "dropdownClasses": "mt-2 z-50 w-full min-w-24 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== e3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
      "optionClasses": "hs-selected:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-neutral-800" : ""} py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-gray-700" : ""} ${"light" !== e3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span></div>"
    }'>
      <option value="00" selected>00</option>
      <option value="01">01</option>
      <option value="02">02</option>
      <option value="03">03</option>
      <option value="04">04</option>
      <option value="05">05</option>
      <option value="06">06</option>
      <option value="07">07</option>
      <option value="08">08</option>
      <option value="09">09</option>
      <option value="10">10</option>
      <option value="11">11</option>
      <option value="12">12</option>
      <option value="13">13</option>
      <option value="14">14</option>
      <option value="15">15</option>
      <option value="16">16</option>
      <option value="17">17</option>
      <option value="18">18</option>
      <option value="19">19</option>
      <option value="20">20</option>
      <option value="21">21</option>
      <option value="22">22</option>
      <option value="23">23</option>
      <option value="24">24</option>
      <option value="25">25</option>
      <option value="26">26</option>
      <option value="27">27</option>
      <option value="28">28</option>
      <option value="29">29</option>
      <option value="30">30</option>
      <option value="31">31</option>
      <option value="32">32</option>
      <option value="33">33</option>
      <option value="34">34</option>
      <option value="35">35</option>
      <option value="36">36</option>
      <option value="37">37</option>
      <option value="38">38</option>
      <option value="39">39</option>
      <option value="40">40</option>
      <option value="41">41</option>
      <option value="42">42</option>
      <option value="43">43</option>
      <option value="44">44</option>
      <option value="45">45</option>
      <option value="46">46</option>
      <option value="47">47</option>
      <option value="48">48</option>
      <option value="49">49</option>
      <option value="50">50</option>
      <option value="51">51</option>
      <option value="52">52</option>
      <option value="53">53</option>
      <option value="54">54</option>
      <option value="55">55</option>
      <option value="56">56</option>
      <option value="57">57</option>
      <option value="58">58</option>
      <option value="59">59</option>
    </select>
    <div class="absolute top-1/2 inset-e-2 -translate-y-1/2">
      <svg class="shrink-0 size-3 text-gray-500 ${"light" !== e3 ? "dark:text-neutral-500" : ""}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    </div>
  </div>`, meridiem: (e3 = false) => `<div class="relative">
    <select class="--meridiem hidden" data-hs-select='{
      "placeholder": "Select option...",
      "dropdownVerticalFixedPlacement": "top",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 px-2 pe-6 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-1 ${"light" !== e3 ? "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400" : ""}",
      "dropdownClasses": "mt-2 z-50 w-full min-w-24 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ${"light" !== e3 ? "dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700" : ""}",
      "optionClasses": "hs-selected:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-neutral-800" : ""} py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 ${"light" !== e3 ? "dark:hs-selected:bg-gray-700" : ""} ${"light" !== e3 ? "dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800" : ""}",
      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span></div>"
    }'>
      <option value="PM" selected>PM</option>
      <option value="AM">AM</option>
    </select>
    <div class="absolute top-1/2 inset-e-2 -translate-y-1/2">
      <svg class="shrink-0 size-3 text-gray-500 ${"light" !== e3 ? "dark:text-neutral-500" : ""}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
    </div>
  </div>` }, ot = { "ru-RU": "\u0441\u0435\u0433\u043E\u0434\u043D\u044F", ru: "\u0441\u0435\u0433\u043E\u0434\u043D\u044F", "de-DE": "Heute", de: "Heute", "fr-FR": "Aujourd'hui", fr: "Aujourd'hui", "es-ES": "Hoy", es: "Hoy", "it-IT": "Oggi", it: "Oggi", "pt-BR": "Hoje", pt: "Hoje", "pl-PL": "Dzisiaj", pl: "Dzisiaj", "uk-UA": "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456", uk: "\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456", "zh-CN": "\u4ECA\u5929", zh: "\u4ECA\u5929", "ja-JP": "\u4ECA\u65E5", ja: "\u4ECA\u65E5", "ko-KR": "\uC624\uB298", ko: "\uC624\uB298", "ar-SA": "\u0627\u0644\u064A\u0648\u0645", ar: "\u0627\u0644\u064A\u0648\u0645", "hi-IN": "\u0906\u091C", hi: "\u0906\u091C", "tr-TR": "Bug\xFCn", tr: "Bug\xFCn", "nl-NL": "Vandaag", nl: "Vandaag", "sv-SE": "Idag", sv: "Idag", "da-DK": "I dag", da: "I dag", "no-NO": "I dag", no: "I dag", "fi-FI": "T\xE4n\xE4\xE4n", fi: "T\xE4n\xE4\xE4n", "cs-CZ": "Dnes", cs: "Dnes", "sk-SK": "Dnes", sk: "Dnes", "hu-HU": "Ma", hu: "Ma", "ro-RO": "Ast\u0103zi", ro: "Ast\u0103zi", "bg-BG": "\u0414\u043D\u0435\u0441", bg: "\u0414\u043D\u0435\u0441", "hr-HR": "Danas", hr: "Danas", "sr-RS": "\u0414\u0430\u043D\u0430\u0441", sr: "\u0414\u0430\u043D\u0430\u0441", "sl-SI": "Danes", sl: "Danes", "et-EE": "T\xE4na", et: "T\xE4na", "lv-LV": "\u0160odien", lv: "\u0160odien", "lt-LT": "\u0160iandien", lt: "\u0160iandien", "el-GR": "\u03A3\u03AE\u03BC\u03B5\u03C1\u03B1", el: "\u03A3\u03AE\u03BC\u03B5\u03C1\u03B1", "he-IL": "\u05D4\u05D9\u05D5\u05DD", he: "\u05D4\u05D9\u05D5\u05DD", "th-TH": "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49", th: "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49", "vi-VN": "H\xF4m nay", vi: "H\xF4m nay", "id-ID": "Hari ini", id: "Hari ini", "ms-MY": "Hari ini", ms: "Hari ini", "fa-IR": "\u0627\u0645\u0631\u0648\u0632", fa: "\u0627\u0645\u0631\u0648\u0632", "ur-PK": "\u0622\u062C", ur: "\u0622\u062C", "bn-BD": "\u0986\u099C", bn: "\u0986\u099C", "ta-IN": "\u0B87\u0BA9\u0BCD\u0BB1\u0BC1", ta: "\u0B87\u0BA9\u0BCD\u0BB1\u0BC1", "te-IN": "\u0C28\u0C47\u0C21\u0C41", te: "\u0C28\u0C47\u0C21\u0C41", "ml-IN": "\u0D07\u0D28\u0D4D\u0D28\u0D4D", ml: "\u0D07\u0D28\u0D4D\u0D28\u0D4D", "kn-IN": "\u0C87\u0C82\u0CA6\u0CC1", kn: "\u0C87\u0C82\u0CA6\u0CC1", "gu-IN": "\u0A86\u0A9C\u0AC7", gu: "\u0A86\u0A9C\u0AC7", "pa-IN": "\u0A05\u0A71\u0A1C", pa: "\u0A05\u0A71\u0A1C", "or-IN": "\u0B06\u0B1C\u0B3F", or: "\u0B06\u0B1C\u0B3F", "as-IN": "\u0986\u099C\u09BF", as: "\u0986\u099C\u09BF", "ne-NP": "\u0906\u091C", ne: "\u0906\u091C", "si-LK": "\u0D85\u0DAF", si: "\u0D85\u0DAF", "my-MM": "\u101A\u1014\u1031\u1037", my: "\u101A\u1014\u1031\u1037", "km-KH": "\u1790\u17D2\u1784\u17C3\u1793\u17C1\u17C7", km: "\u1790\u17D2\u1784\u17C3\u1793\u17C1\u17C7", "lo-LA": "\u0EA1\u0EB7\u0EC9\u0E99\u0EB5\u0EC9", lo: "\u0EA1\u0EB7\u0EC9\u0E99\u0EB5\u0EC9", "mn-MN": "\u04E8\u043D\u04E9\u04E9\u0434\u04E9\u0440", mn: "\u04E8\u043D\u04E9\u04E9\u0434\u04E9\u0440", "ka-GE": "\u10D3\u10E6\u10D4\u10E1", ka: "\u10D3\u10E6\u10D4\u10E1", "hy-AM": "\u0531\u0575\u057D\u0585\u0580", hy: "\u0531\u0575\u057D\u0585\u0580", "az-AZ": "Bu g\xFCn", az: "Bu g\xFCn", "kk-KZ": "\u0411\u04AF\u0433\u0456\u043D", kk: "\u0411\u04AF\u0433\u0456\u043D", "ky-KG": "\u0411\u04AF\u0433\u04AF\u043D", ky: "\u0411\u04AF\u0433\u04AF\u043D", "uz-UZ": "Bugun", uz: "Bugun", "tg-TJ": "\u0418\u043C\u0440\u04EF\u0437", tg: "\u0418\u043C\u0440\u04EF\u0437", "ps-AF": "\u0646\u0646", ps: "\u0646\u0646", "ku-IQ": "\u0626\u06D5\u0645\u0695\u06C6", ku: "\u0626\u06D5\u0645\u0695\u06C6", "yi-IL": "\u05D4\u05D9\u05D9\u05E0\u05D8", yi: "\u05D4\u05D9\u05D9\u05E0\u05D8", "lb-LU": "Haut", lb: "Haut", "is-IS": "\xCD dag", is: "\xCD dag", "mt-MT": "Illum", mt: "Illum", "cy-GB": "Heddiw", cy: "Heddiw", "ga-IE": "Inniu", ga: "Inniu", "gd-GB": "An-diugh", gd: "An-diugh", "kw-GB": "Hedhyw", kw: "Hedhyw", "br-FR": "Hiziv", br: "Hiziv", "oc-FR": "U\xE8i", oc: "U\xE8i", "ca-ES": "Avui", ca: "Avui", "eu-ES": "Gaur", eu: "Gaur", "gl-ES": "Hoxe", gl: "Hoxe", "ast-ES": "G\xFCei", ast: "G\xFCei", "an-ES": "Hue", an: "Hue", "fur-IT": "Vu\xEA", fur: "Vu\xEA", "lij-IT": "Ancheu", lij: "Ancheu", "pms-IT": "Ancheuj", pms: "Ancheuj", "rm-CH": "Oz", rm: "Oz", "gsw-CH": "H\xFCt", gsw: "H\xFCt", "wae-CH": "H\xFCt", wae: "H\xFCt", "bar-AT": "Heit", bar: "Heit", "ksh-DE": "H\xFCck", ksh: "H\xFCck", "nds-DE": "Vundaag", nds: "Vundaag", "pfl-DE": "Haid", pfl: "Haid", "pdc-US": "Heit", pdc: "Heit", "af-ZA": "Vandag", af: "Vandag", "zu-ZA": "Namhlanje", zu: "Namhlanje", "xh-ZA": "Namhlanje", xh: "Namhlanje", "st-ZA": "Kajeno", st: "Kajeno", "tn-ZA": "Kajeno", tn: "Kajeno", "ve-ZA": "Leno", ve: "Leno", "nso-ZA": "Kajeno", nso: "Kajeno", "ts-ZA": "Namuntlha", ts: "Namuntlha", "ss-ZA": "Lamuhla", ss: "Lamuhla", "nr-ZA": "Namhlanje", nr: "Namhlanje", "ff-SN": "Hannde", ff: "Hannde", "wo-SN": "Tey", wo: "Tey", "ig-NG": "Taa", ig: "Taa", "yo-NG": "L\xF3n\xEC\xED", yo: "L\xF3n\xEC\xED", "ha-NG": "Yau", ha: "Yau", "sw-KE": "Leo", sw: "Leo", "am-ET": "\u12DB\u122C", am: "\u12DB\u122C", "ti-ER": "\u120E\u121A", ti: "\u120E\u121A", "so-SO": "Maanta", so: "Maanta", "om-ET": "Har'a", om: "Har'a" };
        var lt = i2(4189), at = i2(7615);
        class rt extends at.A {
          constructor(e3, t3, i3) {
            var n3, o3, l3, a3, r3, c3, d3, h3, u3;
            super(e3, t3, i3);
            const p3 = e3.getAttribute("data-hs-datepicker") ? JSON.parse(e3.getAttribute("data-hs-datepicker")) : {};
            this.dataOptions = Object.assign(Object.assign({}, p3), t3), this.applyUtilityClasses = void 0 !== (null === (n3 = this.dataOptions) || void 0 === n3 ? void 0 : n3.applyUtilityClasses) && (null === (o3 = this.dataOptions) || void 0 === o3 ? void 0 : o3.applyUtilityClasses), this.templatesByType = this.applyUtilityClasses ? st : nt;
            const m3 = void 0 !== (null === (l3 = this.dataOptions) || void 0 === l3 ? void 0 : l3.removeDefaultStyles) && (null === (a3 = this.dataOptions) || void 0 === a3 ? void 0 : a3.removeDefaultStyles);
            this.updatedStyles = _.mergeWith(m3 ? {} : it.defaultStyles, (null === (r3 = this.dataOptions) || void 0 === r3 ? void 0 : r3.styles) || {}, (e4, t4) => {
              if ("string" == typeof e4 && "string" == typeof t4) return `${e4} ${t4}`;
            });
            const g3 = /* @__PURE__ */ new Date(), v3 = { selectedTheme: null !== (c3 = this.dataOptions.selectedTheme) && void 0 !== c3 ? c3 : "", styles: this.updatedStyles, dateMin: null !== (d3 = this.dataOptions.dateMin) && void 0 !== d3 ? d3 : g3.toISOString().split("T")[0], dateMax: null !== (h3 = this.dataOptions.dateMax) && void 0 !== h3 ? h3 : "2470-12-31", mode: null !== (u3 = this.dataOptions.mode) && void 0 !== u3 ? u3 : "default", inputMode: void 0 === this.dataOptions.inputMode || this.dataOptions.inputMode }, f3 = (e4, t4) => (i4) => {
              null == e4 || e4(i4), null == t4 || t4(i4);
            }, y3 = (e4) => {
              this.hasTime(e4) && this.initCustomTime(e4);
            }, b3 = { layouts: { month: this.templatesByType.month(v3.selectedTheme) }, onInit: f3(this.dataOptions.onInit, (e4) => {
              "custom-select" !== v3.mode || this.dataOptions.inputMode || y3(e4);
            }), onShow: f3(this.dataOptions.onShow, (e4) => {
              v3.inputMode && requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  window.dispatchEvent(new Event("resize"));
                });
              }), "custom-select" === v3.mode && (this.updateCustomSelects(e4), y3(e4));
            }), onHide: f3(this.dataOptions.onHide, (e4) => {
              "custom-select" === v3.mode && this.destroySelects(e4.context.mainElement);
            }), onUpdate: f3(this.dataOptions.onUpdate, (e4) => {
              this.updateCalendar(e4.context.mainElement);
            }), onCreateDateEls: f3(this.dataOptions.onCreateDateEls, (e4) => {
              "custom-select" === v3.mode && this.updateCustomSelects(e4);
            }), onChangeToInput: f3(this.dataOptions.onChangeToInput, (e4) => {
              if (!e4.context.inputElement) return;
              this.setInputValue(e4.context.inputElement, e4.context.selectedDates);
              const t4 = { selectedDates: e4.context.selectedDates, selectedTime: e4.context.selectedTime, rest: e4.context };
              this.fireEvent("change", t4), (0, s2.JD)("change.hs.datepicker", this.el, t4);
            }), onChangeTime: f3(this.dataOptions.onChangeTime, y3), onClickYear: f3(this.dataOptions.onClickYear, y3), onClickMonth: f3(this.dataOptions.onClickMonth, y3), onClickArrow: f3(this.dataOptions.onClickArrow, (e4) => {
              "custom-select" === v3.mode && setTimeout(() => {
                this.disableNav(), this.disableOptions(), this.updateCalendar(e4.context.mainElement);
              });
            }) };
            this.concatOptions = _.merge(b3, this.dataOptions);
            const w3 = Object.assign(Object.assign({}, v3), { layouts: { default: this.processCustomTemplate(this.templatesByType.default(v3.selectedTheme), "default"), multiple: this.processCustomTemplate(this.templatesByType.multiple(v3.selectedTheme), "multiple"), year: this.processCustomTemplate(this.templatesByType.year(v3.selectedTheme), "default") } });
            this.concatOptions = _.merge(this.concatOptions, w3), this.vanillaCalendar = new it(this.el, this.concatOptions), this.init();
          }
          init() {
            var e3, t3;
            this.createCollection(window.$hsDatepickerCollection, this), this.vanillaCalendar.init(), (null === (e3 = this.dataOptions) || void 0 === e3 ? void 0 : e3.selectedDates) && this.setInputValue(this.vanillaCalendar.context.inputElement, this.formatDateArrayToIndividualDates(null === (t3 = this.dataOptions) || void 0 === t3 ? void 0 : t3.selectedDates));
          }
          getTimeParts(e3) {
            const [t3, i3] = e3.split(" "), [s3, n3] = t3.split(":");
            return [s3, n3, i3];
          }
          getCurrentMonthAndYear(e3) {
            const t3 = e3.querySelector('[data-vc="month"]'), i3 = e3.querySelector('[data-vc="year"]');
            return { month: +t3.getAttribute("data-vc-month"), year: +i3.getAttribute("data-vc-year") };
          }
          extractSeparatorFromFormat(e3) {
            const t3 = e3.match(/[^A-Za-z0-9]/);
            return t3 ? t3[0] : ".";
          }
          setInputValue(e3, t3) {
            var i3, s3, n3, o3, l3, a3, r3, c3, d3;
            const h3 = null === (i3 = this.dataOptions) || void 0 === i3 ? void 0 : i3.dateFormat, u3 = h3 ? this.extractSeparatorFromFormat(h3) : null, p3 = null !== (o3 = null != u3 ? u3 : null === (n3 = null === (s3 = this.dataOptions) || void 0 === s3 ? void 0 : s3.inputModeOptions) || void 0 === n3 ? void 0 : n3.dateSeparator) && void 0 !== o3 ? o3 : ".", m3 = null !== (r3 = null === (a3 = null === (l3 = this.dataOptions) || void 0 === l3 ? void 0 : l3.inputModeOptions) || void 0 === a3 ? void 0 : a3.itemsSeparator) && void 0 !== r3 ? r3 : ", ", g3 = null !== (d3 = null === (c3 = this.dataOptions) || void 0 === c3 ? void 0 : c3.selectionDatesMode) && void 0 !== d3 ? d3 : "single";
            if (t3.length && t3.length > 1) if ("multiple" === g3) {
              const i4 = [];
              t3.forEach((e4) => i4.push(h3 ? this.formatDate(e4, h3) : this.changeDateSeparator(e4, p3))), e3.value = i4.join(m3);
            } else {
              const i4 = h3 ? this.formatDate(t3[0], h3) : this.changeDateSeparator(t3[0], p3), s4 = h3 ? this.formatDate(t3[1], h3) : this.changeDateSeparator(t3[1], p3);
              e3.value = [i4, s4].join(m3);
            }
            else t3.length && 1 === t3.length ? e3.value = h3 ? this.formatDate(t3[0], h3) : this.changeDateSeparator(t3[0], p3) : e3.value = "";
          }
          getLocalizedTodayText(e3) {
            return ot[e3] || "Today";
          }
          changeDateSeparator(e3, t3 = ".", i3 = "-") {
            var s3, n3;
            const o3 = new Date(e3);
            if (null === (s3 = this.dataOptions) || void 0 === s3 ? void 0 : s3.replaceTodayWithText) {
              const e4 = /* @__PURE__ */ new Date();
              if (o3.toDateString() === e4.toDateString()) {
                const e5 = null === (n3 = this.dataOptions) || void 0 === n3 ? void 0 : n3.dateLocale;
                return this.getLocalizedTodayText(e5);
              }
            }
            return e3.split(i3).join(t3);
          }
          formatDateArrayToIndividualDates(e3) {
            var t3, i3;
            const s3 = null !== (i3 = null === (t3 = this.dataOptions) || void 0 === t3 ? void 0 : t3.selectionDatesMode) && void 0 !== i3 ? i3 : "single";
            return e3.flatMap((e4) => {
              if ("string" == typeof e4) {
                if ("today" === e4.toLowerCase()) {
                  return [(/* @__PURE__ */ new Date()).toISOString().split("T")[0]];
                }
                const t4 = e4.match(/^(\d{4}-\d{2}-\d{2})\s*[^a-zA-Z0-9]*\s*(\d{4}-\d{2}-\d{2})$/);
                if (t4) {
                  const [e5, i4, n3] = t4;
                  return "multiple-ranged" === s3 ? [i4, n3] : ((e6, t5) => {
                    const i5 = new Date(e6), s4 = new Date(t5), n4 = [];
                    for (; i5 <= s4; ) n4.push(i5.toISOString().split("T")[0]), i5.setDate(i5.getDate() + 1);
                    return n4;
                  })(i4.trim(), n3.trim());
                }
                return [e4];
              }
              return "number" == typeof e4 ? [new Date(e4).toISOString().split("T")[0]] : e4 instanceof Date ? [e4.toISOString().split("T")[0]] : [];
            });
          }
          hasTime(e3) {
            const { mainElement: t3 } = e3.context, i3 = t3.querySelector("[data-hs-select].--hours"), s3 = t3.querySelector("[data-hs-select].--minutes"), n3 = t3.querySelector("[data-hs-select].--meridiem");
            return i3 && s3 && n3;
          }
          createArrowFromTemplate(e3, t3 = false) {
            if (!t3) return e3;
            const i3 = (0, s2.fc)(e3);
            return (0, s2.en)(t3, i3), i3.outerHTML;
          }
          concatObjectProperties(e3, t3) {
            const i3 = {};
            return (/* @__PURE__ */ new Set([...Object.keys(e3 || {}), ...Object.keys(t3 || {})])).forEach((s3) => {
              const n3 = e3[s3] || "", o3 = t3[s3] || "";
              i3[s3] = `${n3} ${o3}`.trim();
            }), i3;
          }
          updateTemplate(e3, t3, i3) {
            if (!t3) return e3;
            const s3 = JSON.parse(e3.match(/data-hs-select='([^']+)'/)[1]), n3 = this.concatObjectProperties(t3, i3), o3 = _.merge(s3, n3);
            return e3.replace(/data-hs-select='[^']+'/, `data-hs-select='${JSON.stringify(o3)}'`);
          }
          initCustomTime(e3) {
            var t3;
            const { mainElement: i3 } = e3.context, s3 = this.getTimeParts(null !== (t3 = e3.selectedTime) && void 0 !== t3 ? t3 : "12:00 PM"), n3 = { hours: i3.querySelector("[data-hs-select].--hours"), minutes: i3.querySelector("[data-hs-select].--minutes"), meridiem: i3.querySelector("[data-hs-select].--meridiem") };
            Object.entries(n3).forEach(([t4, n4]) => {
              if (!lt.A.getInstance(n4, true)) {
                const o3 = new lt.A(n4);
                o3.setValue(s3["meridiem" === t4 ? 2 : "minutes" === t4 ? 1 : 0]), o3.el.addEventListener("change.hs.select", (n5) => {
                  this.destroySelects(i3);
                  const o4 = "hours" === t4 ? n5.detail.payload : s3[0], l3 = "minutes" === t4 ? n5.detail.payload : s3[1], a3 = "meridiem" === t4 ? n5.detail.payload : s3[2];
                  e3.set({ selectedTime: `${o4}:${l3} ${a3}` }, { dates: false, year: false, month: false });
                });
              }
            });
          }
          initCustomMonths(e3) {
            const { mainElement: t3 } = e3.context, i3 = Array.from(t3.querySelectorAll(".--single-month"));
            i3.length && i3.forEach((i4, s3) => {
              const n3 = i4.querySelector("[data-hs-select].--month");
              if (lt.A.getInstance(n3, true)) return false;
              const o3 = new lt.A(n3), { month: l3, year: a3 } = this.getCurrentMonthAndYear(i4);
              o3.setValue(`${l3}`), o3.el.addEventListener("change.hs.select", (i5) => {
                this.destroySelects(t3), e3.set({ selectedMonth: +i5.detail.payload - s3 < 0 ? 11 : +i5.detail.payload - s3, selectedYear: +i5.detail.payload - s3 < 0 ? +a3 - 1 : a3 }, { dates: false, time: false });
              });
            });
          }
          initCustomYears(e3) {
            const { mainElement: t3 } = e3.context, i3 = Array.from(t3.querySelectorAll(".--single-month"));
            i3.length && i3.forEach((i4) => {
              const s3 = i4.querySelector("[data-hs-select].--year");
              if (lt.A.getInstance(s3, true)) return false;
              const n3 = new lt.A(s3), { month: o3, year: l3 } = this.getCurrentMonthAndYear(i4);
              n3.setValue(`${l3}`), n3.el.addEventListener("change.hs.select", (i5) => {
                const { dateMax: s4, displayMonthsCount: n4 } = this.vanillaCalendar.context, l4 = new Date(s4).getFullYear(), a3 = new Date(s4).getMonth();
                this.destroySelects(t3), e3.set({ selectedMonth: o3 > a3 - n4 && +i5.detail.payload === l4 ? a3 - n4 + 1 : o3, selectedYear: i5.detail.payload }, { dates: false, time: false });
              });
            });
          }
          generateCustomTimeMarkup() {
            var e3, t3, i3, s3;
            const n3 = null === (e3 = this.updatedStyles) || void 0 === e3 ? void 0 : e3.customSelect, o3 = n3 ? this.updateTemplate(this.templatesByType.hours(this.concatOptions.selectedTheme), (null == n3 ? void 0 : n3.shared) || {}, (null == n3 ? void 0 : n3.hours) || {}) : this.templatesByType.hours(this.concatOptions.selectedTheme), l3 = n3 ? this.updateTemplate(this.templatesByType.minutes(this.concatOptions.selectedTheme), (null == n3 ? void 0 : n3.shared) || {}, (null == n3 ? void 0 : n3.minutes) || {}) : this.templatesByType.minutes(this.concatOptions.selectedTheme), a3 = n3 ? this.updateTemplate(this.templatesByType.meridiem(this.concatOptions.selectedTheme), (null == n3 ? void 0 : n3.shared) || {}, (null == n3 ? void 0 : n3.meridiem) || {}) : this.templatesByType.meridiem(this.concatOptions.selectedTheme);
            return `<div class="--time">${null !== (s3 = null === (i3 = null === (t3 = null == this ? void 0 : this.dataOptions) || void 0 === t3 ? void 0 : t3.templates) || void 0 === i3 ? void 0 : i3.time) && void 0 !== s3 ? s3 : `
			<div class="pt-3 flex justify-center items-center gap-x-2">
        ${o3}
        <span class="text-gray-800 ${"light" !== this.concatOptions.selectedTheme ? "dark:text-white" : ""}">:</span>
        ${l3}
        ${a3}
      </div>
		`}</div>`;
          }
          generateCustomMonthMarkup() {
            var e3, t3, i3;
            const s3 = null !== (t3 = null === (e3 = null == this ? void 0 : this.dataOptions) || void 0 === e3 ? void 0 : e3.mode) && void 0 !== t3 ? t3 : "default", n3 = null === (i3 = this.updatedStyles) || void 0 === i3 ? void 0 : i3.customSelect, o3 = n3 ? this.updateTemplate(this.templatesByType.months(this.concatOptions.selectedTheme), (null == n3 ? void 0 : n3.shared) || {}, (null == n3 ? void 0 : n3.months) || {}) : this.templatesByType.months(this.concatOptions.selectedTheme);
            return "custom-select" === s3 ? o3 : "<#Month />";
          }
          generateCustomYearMarkup() {
            var e3, t3, i3, s3, n3, o3, l3;
            if ("custom-select" === (null !== (t3 = null === (e3 = null == this ? void 0 : this.dataOptions) || void 0 === e3 ? void 0 : e3.mode) && void 0 !== t3 ? t3 : "default")) {
              const e4 = /* @__PURE__ */ new Date(), t4 = null !== (s3 = null === (i3 = null == this ? void 0 : this.dataOptions) || void 0 === i3 ? void 0 : i3.dateMin) && void 0 !== s3 ? s3 : e4.toISOString().split("T")[0], a3 = null !== (o3 = null === (n3 = null == this ? void 0 : this.dataOptions) || void 0 === n3 ? void 0 : n3.dateMax) && void 0 !== o3 ? o3 : "2470-12-31", r3 = new Date(t4), c3 = new Date(a3), d3 = r3.getFullYear(), h3 = c3.getFullYear(), u3 = () => {
                let e5 = "";
                for (let t5 = d3; t5 <= h3; t5++) e5 += `<option value="${t5}">${t5}</option>`;
                return e5;
              }, p3 = this.templatesByType.years(u3(), this.concatOptions.selectedTheme), m3 = null === (l3 = this.updatedStyles) || void 0 === l3 ? void 0 : l3.customSelect;
              return m3 ? this.updateTemplate(p3, (null == m3 ? void 0 : m3.shared) || {}, (null == m3 ? void 0 : m3.years) || {}) : p3;
            }
            return "<#Year />";
          }
          generateCustomArrowPrevMarkup() {
            var e3, t3;
            return (null === (t3 = null === (e3 = null == this ? void 0 : this.dataOptions) || void 0 === e3 ? void 0 : e3.templates) || void 0 === t3 ? void 0 : t3.arrowPrev) ? this.createArrowFromTemplate(this.dataOptions.templates.arrowPrev, this.updatedStyles.arrowPrev) : "<#ArrowPrev [month] />";
          }
          generateCustomArrowNextMarkup() {
            var e3, t3;
            return (null === (t3 = null === (e3 = null == this ? void 0 : this.dataOptions) || void 0 === e3 ? void 0 : e3.templates) || void 0 === t3 ? void 0 : t3.arrowNext) ? this.createArrowFromTemplate(this.dataOptions.templates.arrowNext, this.updatedStyles.arrowNext) : "<#ArrowNext [month] />";
          }
          parseCustomTime(e3) {
            return e3 = e3.replace(/<#CustomTime\s*\/>/g, this.generateCustomTimeMarkup());
          }
          parseCustomMonth(e3) {
            return e3 = e3.replace(/<#CustomMonth\s*\/>/g, this.generateCustomMonthMarkup());
          }
          parseCustomYear(e3) {
            return e3 = e3.replace(/<#CustomYear\s*\/>/g, this.generateCustomYearMarkup());
          }
          parseArrowPrev(e3) {
            return e3 = e3.replace(/<#CustomArrowPrev\s*\/>/g, this.generateCustomArrowPrevMarkup());
          }
          parseArrowNext(e3) {
            return e3 = e3.replace(/<#CustomArrowNext\s*\/>/g, this.generateCustomArrowNextMarkup());
          }
          processCustomTemplate(e3, t3) {
            var i3, s3, n3, o3;
            const l3 = "default" === t3 ? null === (s3 = null === (i3 = null == this ? void 0 : this.dataOptions) || void 0 === i3 ? void 0 : i3.layouts) || void 0 === s3 ? void 0 : s3.default : null === (o3 = null === (n3 = null == this ? void 0 : this.dataOptions) || void 0 === n3 ? void 0 : n3.layouts) || void 0 === o3 ? void 0 : o3.multiple, a3 = this.parseCustomMonth(null != l3 ? l3 : e3), r3 = this.parseCustomYear(a3), c3 = this.parseCustomTime(r3), d3 = this.parseArrowPrev(c3);
            return this.parseArrowNext(d3);
          }
          disableOptions() {
            const { mainElement: e3, dateMax: t3, displayMonthsCount: i3 } = this.vanillaCalendar.context, s3 = new Date(t3);
            Array.from(e3.querySelectorAll(".--single-month")).forEach((e4, t4) => {
              var n3;
              const o3 = +(null === (n3 = e4.querySelector('[data-vc="year"]')) || void 0 === n3 ? void 0 : n3.getAttribute("data-vc-year")), l3 = e4.querySelectorAll("[data-hs-select].--month option"), a3 = e4.querySelectorAll("[data-hs-select-dropdown] [data-value]"), r3 = (e5) => +e5.getAttribute("data-value") > s3.getMonth() - i3 + t4 + 1 && o3 === s3.getFullYear();
              Array.from(l3).forEach((e5) => e5.toggleAttribute("disabled", r3(e5))), Array.from(a3).forEach((e5) => e5.classList.toggle("disabled", r3(e5)));
            });
          }
          disableNav() {
            const { mainElement: e3, dateMax: t3, selectedYear: i3, selectedMonth: s3, displayMonthsCount: n3 } = this.vanillaCalendar.context, o3 = new Date(t3).getFullYear(), l3 = e3.querySelector('[data-vc-arrow="next"]');
            l3.style.visibility = i3 === o3 && s3 + n3 > 11 ? "hidden" : "";
          }
          destroySelects(e3) {
            Array.from(e3.querySelectorAll("[data-hs-select]")).forEach((e4) => {
              const t3 = lt.A.getInstance(e4, true);
              t3 && t3.element.destroy();
            });
          }
          updateSelect(e3, t3) {
            const i3 = lt.A.getInstance(e3, true);
            i3 && i3.element.setValue(t3);
          }
          updateCalendar(e3) {
            const t3 = e3.querySelectorAll(".--single-month");
            t3.length && t3.forEach((e4) => {
              const { month: t4, year: i3 } = this.getCurrentMonthAndYear(e4);
              this.updateSelect(e4.querySelector("[data-hs-select].--month"), `${t4}`), this.updateSelect(e4.querySelector("[data-hs-select].--year"), `${i3}`);
            });
          }
          updateCustomSelects(e3) {
            setTimeout(() => {
              this.disableOptions(), this.disableNav(), this.initCustomMonths(e3), this.initCustomYears(e3);
            });
          }
          getCurrentState() {
            return { selectedDates: this.vanillaCalendar.selectedDates, selectedTime: this.vanillaCalendar.selectedTime };
          }
          formatDate(e3, t3) {
            var i3, s3, n3, o3, l3, a3, r3;
            const c3 = t3 || (null === (i3 = this.dataOptions) || void 0 === i3 ? void 0 : i3.dateFormat), d3 = (null === (s3 = this.dataOptions) || void 0 === s3 ? void 0 : s3.dateLocale) || void 0;
            if (!c3) {
              const t4 = null !== (l3 = null === (o3 = null === (n3 = this.dataOptions) || void 0 === n3 ? void 0 : n3.inputModeOptions) || void 0 === o3 ? void 0 : o3.dateSeparator) && void 0 !== l3 ? l3 : ".";
              return this.changeDateSeparator(e3, t4);
            }
            const h3 = new Date(e3);
            if (isNaN(h3.getTime())) return this.changeDateSeparator(e3);
            let u3 = "", p3 = 0;
            for (; p3 < c3.length; ) if ("YYYY" === c3.slice(p3, p3 + 4)) u3 += h3.getFullYear().toString(), p3 += 4;
            else if ("dddd" === c3.slice(p3, p3 + 4)) {
              const e4 = h3.toLocaleDateString(d3, { weekday: "long" });
              if (null === (a3 = this.dataOptions) || void 0 === a3 ? void 0 : a3.replaceTodayWithText) {
                const t4 = /* @__PURE__ */ new Date();
                u3 += h3.toDateString() === t4.toDateString() ? this.getLocalizedTodayText(d3) : e4;
              } else u3 += e4;
              p3 += 4;
            } else if ("MMMM" === c3.slice(p3, p3 + 4)) u3 += h3.toLocaleDateString(d3, { month: "long" }), p3 += 4;
            else if ("ddd" === c3.slice(p3, p3 + 3)) {
              const e4 = h3.toLocaleDateString(d3, { weekday: "short" });
              if (null === (r3 = this.dataOptions) || void 0 === r3 ? void 0 : r3.replaceTodayWithText) {
                const t4 = /* @__PURE__ */ new Date();
                u3 += h3.toDateString() === t4.toDateString() ? this.getLocalizedTodayText(d3) : e4;
              } else u3 += e4;
              p3 += 3;
            } else "MMM" === c3.slice(p3, p3 + 3) ? (u3 += h3.toLocaleDateString(d3, { month: "short" }), p3 += 3) : "YY" === c3.slice(p3, p3 + 2) ? (u3 += h3.getFullYear().toString().slice(-2), p3 += 2) : "MM" === c3.slice(p3, p3 + 2) ? (u3 += String(h3.getMonth() + 1).padStart(2, "0"), p3 += 2) : "DD" === c3.slice(p3, p3 + 2) ? (u3 += String(h3.getDate()).padStart(2, "0"), p3 += 2) : "HH" === c3.slice(p3, p3 + 2) ? (u3 += String(h3.getHours()).padStart(2, "0"), p3 += 2) : "mm" === c3.slice(p3, p3 + 2) ? (u3 += String(h3.getMinutes()).padStart(2, "0"), p3 += 2) : "ss" === c3.slice(p3, p3 + 2) ? (u3 += String(h3.getSeconds()).padStart(2, "0"), p3 += 2) : "Y" === c3[p3] ? (u3 += h3.getFullYear().toString(), p3 += 1) : "M" === c3[p3] ? (u3 += String(h3.getMonth() + 1), p3 += 1) : "D" === c3[p3] ? (u3 += String(h3.getDate()), p3 += 1) : "H" === c3[p3] ? (u3 += String(h3.getHours()), p3 += 1) : "m" === c3[p3] ? (u3 += String(h3.getMinutes()), p3 += 1) : "s" === c3[p3] ? (u3 += String(h3.getSeconds()), p3 += 1) : (u3 += c3[p3], p3 += 1);
            return u3;
          }
          destroy() {
            const e3 = this.el, t3 = e3.id, i3 = e3.parentElement, s3 = e3.nextElementSibling, n3 = {};
            Array.from(e3.attributes).forEach((e4) => {
              n3[e4.name] = e4.value;
            });
            const o3 = e3.className, l3 = e3.value;
            this.vanillaCalendar && (this.vanillaCalendar.destroy(), this.vanillaCalendar = null), window.$hsDatepickerCollection = window.$hsDatepickerCollection.filter(({ element: e4 }) => e4.el !== this.el);
            const a3 = document.body.contains(e3), r3 = t3 ? document.getElementById(t3) : null;
            if (!a3 && !r3 && i3) {
              const e4 = document.createElement("input");
              Object.keys(n3).forEach((t4) => {
                e4.setAttribute(t4, n3[t4]);
              }), e4.className = o3, e4.value = l3, s3 && s3.parentElement === i3 ? i3.insertBefore(e4, s3) : i3.appendChild(e4), this.el = e4;
            }
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsDatepickerCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsDatepickerCollection || (window.$hsDatepickerCollection = []), document.querySelectorAll(".hs-datepicker:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsDatepickerCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new rt(e3);
            });
          }
        }
        const ct = rt;
      }, 7986(e2, t2, i2) {
        i2.d(t2, { A: () => c2 });
        var s2 = i2(1926), n2 = i2(7663), o2 = i2(7615), l2 = i2(8862), a2 = i2(189);
        class r2 extends o2.A {
          constructor(e3, t3, i3) {
            super(e3, t3, i3), this.longPressTimer = null, this.openedViaKeyboard = false, this.onTouchStartListener = null, this.onTouchEndListener = null, this.toggle = this.el.querySelector(":scope > .hs-dropdown-toggle") || this.el.querySelector(":scope > .hs-dropdown-toggle-wrapper > .hs-dropdown-toggle") || this.el.children[0], this.closers = Array.from(this.el.querySelectorAll(":scope .hs-dropdown-close")) || null, this.menu = this.el.querySelector(":scope > .hs-dropdown-menu"), this.eventMode = (0, s2.gj)(this.el, "--trigger", "click"), this.closeMode = (0, s2.gj)(this.el, "--auto-close", "true"), this.hasAutofocus = (0, s2.PK)((0, s2.gj)(this.el, "--has-autofocus", "true") || "true"), this.autofocusOnKeyboardOnly = (0, s2.PK)((0, s2.gj)(this.el, "--autofocus-on-keyboard-only", "true") || "true"), this.animationInProcess = false, this.onCloserClickListener = [], this.toggle && this.menu && this.init();
          }
          elementMouseEnter() {
            this.onMouseEnterHandler();
          }
          elementMouseLeave() {
            this.onMouseLeaveHandler();
          }
          toggleClick(e3) {
            this.onClickHandler(e3);
          }
          toggleContextMenu(e3) {
            e3.preventDefault(), this.onContextMenuHandler(e3);
          }
          handleTouchStart(e3) {
            this.longPressTimer = window.setTimeout(() => {
              e3.preventDefault();
              const t3 = e3.touches[0], i3 = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, view: window, clientX: t3.clientX, clientY: t3.clientY });
              this.toggle && this.toggle.dispatchEvent(i3);
            }, 400);
          }
          handleTouchEnd(e3) {
            this.longPressTimer && (clearTimeout(this.longPressTimer), this.longPressTimer = null);
          }
          closerClick() {
            this.close();
          }
          init() {
            if (r2.ensureGlobalHandlers(), this.createCollection(window.$hsDropdownCollection, this), this.toggle.disabled) return false;
            this.toggle && this.buildToggle(), this.menu && this.buildMenu(), this.closers && this.buildClosers(), (0, s2.un)() || (0, s2.zG)() || (this.onElementMouseEnterListener = () => this.elementMouseEnter(), this.onElementMouseLeaveListener = () => this.elementMouseLeave(), this.el.addEventListener("mouseenter", this.onElementMouseEnterListener), this.el.addEventListener("mouseleave", this.onElementMouseLeaveListener)), "undefined" != typeof window && (window.HSAccessibilityObserver || (window.HSAccessibilityObserver = new l2.A()), this.setupAccessibility());
          }
          resizeHandler() {
            this.eventMode = (0, s2.gj)(this.el, "--trigger", "click"), this.closeMode = (0, s2.gj)(this.el, "--auto-close", "true"), this.hasAutofocus = (0, s2.PK)((0, s2.gj)(this.el, "--has-autofocus", "true") || "true"), this.autofocusOnKeyboardOnly = (0, s2.PK)((0, s2.gj)(this.el, "--autofocus-on-keyboard-only", "true") || "true");
          }
          isOpen() {
            return this.el.classList.contains("open") && !this.menu.classList.contains("hidden");
          }
          buildToggle() {
            var e3;
            (null === (e3 = null == this ? void 0 : this.toggle) || void 0 === e3 ? void 0 : e3.ariaExpanded) && (this.el.classList.contains("open") ? this.toggle.ariaExpanded = "true" : this.toggle.ariaExpanded = "false"), "contextmenu" === this.eventMode ? (this.onToggleContextMenuListener = (e4) => this.toggleContextMenu(e4), this.onTouchStartListener = this.handleTouchStart.bind(this), this.onTouchEndListener = this.handleTouchEnd.bind(this), this.toggle.addEventListener("contextmenu", this.onToggleContextMenuListener), this.toggle.addEventListener("touchstart", this.onTouchStartListener, { passive: false }), this.toggle.addEventListener("touchend", this.onTouchEndListener), this.toggle.addEventListener("touchmove", this.onTouchEndListener)) : (this.onToggleClickListener = (e4) => this.toggleClick(e4), this.toggle.addEventListener("click", this.onToggleClickListener));
          }
          buildMenu() {
            this.menu.role = this.menu.getAttribute("role") || "menu", this.menu.tabIndex = -1;
            const e3 = this.menu.querySelectorAll('[role="menuitemcheckbox"]'), t3 = this.menu.querySelectorAll('[role="menuitemradio"]');
            e3.forEach((e4) => e4.addEventListener("click", () => this.selectCheckbox(e4))), t3.forEach((e4) => e4.addEventListener("click", () => this.selectRadio(e4))), this.menu.addEventListener("click", (e4) => {
              const t4 = e4.target;
              "INPUT" === t4.tagName || "TEXTAREA" === t4.tagName || "SELECT" === t4.tagName || "BUTTON" === t4.tagName || "A" === t4.tagName || t4.closest("button") || t4.closest("a") || t4.closest("input") || t4.closest("textarea") || t4.closest("select") || this.menu.focus();
            });
          }
          buildClosers() {
            this.closers.forEach((e3) => {
              this.onCloserClickListener.push({ el: e3, fn: () => this.closerClick() }), e3.addEventListener("click", this.onCloserClickListener.find((t3) => t3.el === e3).fn);
            });
          }
          getScrollbarSize() {
            let e3 = document.createElement("div");
            e3.style.overflow = "scroll", e3.style.width = "100px", e3.style.height = "100px", document.body.appendChild(e3);
            let t3 = e3.offsetWidth - e3.clientWidth;
            return document.body.removeChild(e3), t3;
          }
          onContextMenuHandler(e3) {
            const t3 = { getBoundingClientRect: (() => new DOMRect(), () => new DOMRect(e3.clientX, e3.clientY, 0, 0)) };
            r2.closeCurrentlyOpened(), this.el.classList.contains("open") && !this.menu.classList.contains("hidden") ? (this.close(), document.body.style.overflow = "", document.body.style.paddingRight = "") : (document.body.style.overflow = "hidden", document.body.style.paddingRight = `${this.getScrollbarSize()}px`, this.open(t3));
          }
          onClickHandler(e3) {
            var t3;
            if ("hover" === this.eventMode && window.matchMedia("(hover: hover)").matches && "mouse" === e3.pointerType) {
              const i3 = e3.currentTarget;
              return "A" === i3.tagName && i3.hasAttribute("href") && "#" !== i3.getAttribute("href") || (e3.preventDefault(), e3.stopPropagation(), null === (t3 = e3.stopImmediatePropagation) || void 0 === t3 || t3.call(e3)), false;
            }
            this.el.classList.contains("open") && !this.menu.classList.contains("hidden") ? this.close() : this.open();
          }
          onMouseEnterHandler() {
            if ("hover" !== this.eventMode) return false;
            (!this.el._floatingUI || this.el._floatingUI && !this.el.classList.contains("open")) && this.forceClearState(), !this.el.classList.contains("open") && this.menu.classList.contains("hidden") && this.open();
          }
          onMouseLeaveHandler() {
            if ("hover" !== this.eventMode) return false;
            this.el.classList.contains("open") && !this.menu.classList.contains("hidden") && this.close();
          }
          destroyFloatingUI() {
            const e3 = (window.getComputedStyle(this.el).getPropertyValue("--scope") || "").trim();
            this.menu.classList.remove("block"), this.menu.classList.add("hidden"), this.menu.style.inset = null, this.menu.style.position = null, this.el && this.el._floatingUI && (this.el._floatingUI.destroy(), this.el._floatingUI = null), "window" === e3 && this.el.appendChild(this.menu), this.animationInProcess = false;
          }
          focusElement() {
            const e3 = this.menu.querySelector("[autofocus]");
            if (e3) return e3.focus(), true;
            const t3 = this.menu.querySelectorAll('a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])');
            if (t3.length > 0) {
              return t3[0].focus(), true;
            }
            return false;
          }
          setupFloatingUI(e3) {
            const t3 = e3 || this.el, i3 = window.getComputedStyle(this.el), s3 = (i3.getPropertyValue("--placement") || "").trim(), o3 = (i3.getPropertyValue("--flip") || "true").trim(), l3 = (i3.getPropertyValue("--strategy") || "fixed").trim(), r3 = (i3.getPropertyValue("--offset") || "10").trim(), c3 = (i3.getPropertyValue("--gpu-acceleration") || "true").trim(), d2 = (window.getComputedStyle(this.el).getPropertyValue("--adaptive") || "adaptive").replace(" ", ""), h2 = l3, u2 = parseInt(r3, 10), p2 = a2.lP[s3] || "bottom-start", m2 = [..."true" === o3 ? [(0, n2.UU)()] : [], (0, n2.cY)(u2)], g2 = { placement: p2, strategy: h2, middleware: m2 };
            "fixed" === h2 && Object.assign(this.menu.style, { position: h2 });
            const v2 = (e4) => {
              const t4 = this.menu.getBoundingClientRect(), i4 = window.innerWidth - (window.innerWidth - document.documentElement.clientWidth);
              return e4 + t4.width > i4 && (e4 = i4 - t4.width), e4 < 0 && (e4 = 0), e4;
            }, f2 = () => {
              (0, n2.rD)(t3, this.menu, g2).then(({ x: e4, y: t4, placement: i4 }) => {
                const s4 = v2(e4);
                "absolute" === h2 && "none" === d2 ? Object.assign(this.menu.style, { position: h2, margin: "0" }) : "absolute" === h2 ? Object.assign(this.menu.style, { position: h2, transform: `translate3d(${e4}px, ${t4}px, 0px)`, margin: "0" }) : "true" === c3 ? Object.assign(this.menu.style, { position: h2, left: "", top: "", inset: "0px auto auto 0px", margin: "0", transform: `translate3d(${"adaptive" === d2 ? s4 : 0}px, ${t4}px, 0)` }) : Object.assign(this.menu.style, { position: h2, left: `${e4}px`, top: `${t4}px`, transform: "" }), this.menu.setAttribute("data-placement", i4);
              });
            };
            f2();
            return { update: f2, destroy: (0, n2.ll)(t3, this.menu, f2) };
          }
          selectCheckbox(e3) {
            e3.ariaChecked = "true" === e3.ariaChecked ? "false" : "true";
          }
          selectRadio(e3) {
            if ("true" === e3.ariaChecked) return false;
            const t3 = e3.closest(".group").querySelectorAll('[role="menuitemradio"]');
            Array.from(t3).filter((t4) => t4 !== e3).forEach((e4) => {
              e4.ariaChecked = "false";
            }), e3.ariaChecked = "true";
          }
          calculatePopperPosition(e3) {
            const t3 = this.setupFloatingUI(e3), i3 = this.menu.getAttribute("data-placement");
            return t3.update(), t3.destroy(), i3;
          }
          open(e3, t3 = false) {
            if (this.el.classList.contains("open") || this.animationInProcess) return false;
            this.openedViaKeyboard = t3, this.animationInProcess = true, this.menu.style.cssText = "";
            const i3 = e3 || this.el, n3 = window.getComputedStyle(this.el), o3 = (n3.getPropertyValue("--scope") || "").trim(), l3 = (n3.getPropertyValue("--strategy") || "fixed").trim();
            "window" === o3 && document.body.appendChild(this.menu), "static" !== l3 && (this.el._floatingUI = this.setupFloatingUI(i3)), this.menu.style.margin = null, this.menu.classList.remove("hidden"), this.menu.classList.add("block"), setTimeout(() => {
              var e4;
              (null === (e4 = null == this ? void 0 : this.toggle) || void 0 === e4 ? void 0 : e4.ariaExpanded) && (this.toggle.ariaExpanded = "true"), this.el.classList.add("open"), window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, true), "window" === o3 && this.menu.classList.add("open"), this.animationInProcess = false, !this.hasAutofocus || this.autofocusOnKeyboardOnly && !this.openedViaKeyboard || this.focusElement(), this.fireEvent("open", this.el), (0, s2.JD)("open.hs.dropdown", this.el, this.el);
            });
          }
          close(e3 = true) {
            if (this.animationInProcess || !this.el.classList.contains("open")) return false;
            const t3 = (window.getComputedStyle(this.el).getPropertyValue("--scope") || "").trim();
            if (this.animationInProcess = true, "window" === t3 && this.menu.classList.remove("open"), window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, false), e3) {
              const e4 = this.el.querySelector("[data-hs-dropdown-transition]") || this.menu;
              let t4 = false;
              const i3 = () => {
                t4 || (t4 = true, this.destroyFloatingUI());
              };
              (0, s2.yd)(e4, i3);
              const n3 = window.getComputedStyle(e4).getPropertyValue("transition-duration"), o3 = 1e3 * parseFloat(n3) || 150;
              setTimeout(i3, o3 + 50);
            } else this.destroyFloatingUI();
            (() => {
              var e4;
              this.menu.style.margin = null, (null === (e4 = null == this ? void 0 : this.toggle) || void 0 === e4 ? void 0 : e4.ariaExpanded) && (this.toggle.ariaExpanded = "false"), this.el.classList.remove("open"), this.openedViaKeyboard = false, this.fireEvent("close", this.el), (0, s2.JD)("close.hs.dropdown", this.el, this.el);
            })();
          }
          forceClearState() {
            this.destroyFloatingUI(), this.menu.style.margin = null, this.el.classList.remove("open"), this.menu.classList.add("hidden"), this.openedViaKeyboard = false;
          }
          destroy() {
            (0, s2.un)() || (0, s2.zG)() || (this.el.removeEventListener("mouseenter", this.onElementMouseEnterListener), this.el.removeEventListener("mouseleave", () => this.onElementMouseLeaveListener), this.onElementMouseEnterListener = null, this.onElementMouseLeaveListener = null), "contextmenu" === this.eventMode ? (this.toggle && (this.toggle.removeEventListener("contextmenu", this.onToggleContextMenuListener), this.toggle.removeEventListener("touchstart", this.onTouchStartListener), this.toggle.removeEventListener("touchend", this.onTouchEndListener), this.toggle.removeEventListener("touchmove", this.onTouchEndListener)), this.onToggleContextMenuListener = null, this.onTouchStartListener = null, this.onTouchEndListener = null) : (this.toggle && this.toggle.removeEventListener("click", this.onToggleClickListener), this.onToggleClickListener = null), this.closers.length && (this.closers.forEach((e3) => {
              e3.removeEventListener("click", this.onCloserClickListener.find((t3) => t3.el === e3).fn);
            }), this.onCloserClickListener = null), this.el.classList.remove("open"), this.destroyFloatingUI(), window.$hsDropdownCollection = window.$hsDropdownCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static findInCollection(e3) {
            return window.$hsDropdownCollection.find((t3) => e3 instanceof r2 ? t3.element.el === e3.el : "string" == typeof e3 ? t3.element.el === document.querySelector(e3) : t3.element.el === e3) || null;
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsDropdownCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            r2.ensureGlobalHandlers(), window.$hsDropdownCollection && (window.$hsDropdownCollection = window.$hsDropdownCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll(".hs-dropdown:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsDropdownCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new r2(e3);
            });
          }
          static ensureGlobalHandlers() {
            if ("undefined" == typeof window) return;
            if (window.$hsDropdownCollection || (window.$hsDropdownCollection = []), r2.globalListenersInitialized) return;
            r2.globalListenersInitialized = true, window.addEventListener("click", (e4) => {
              const t3 = e4.target;
              r2.closeCurrentlyOpened(t3);
            });
            let e3 = window.innerWidth;
            window.addEventListener("resize", () => {
              window.innerWidth !== e3 && (e3 = innerWidth, r2.closeCurrentlyOpened(null, false));
            });
          }
          static open(e3, t3 = false) {
            const i3 = r2.findInCollection(e3);
            i3 && i3.element.menu.classList.contains("hidden") && i3.element.open(void 0, t3);
          }
          static close(e3) {
            const t3 = r2.findInCollection(e3);
            t3 && !t3.element.menu.classList.contains("hidden") && t3.element.close();
          }
          static closeCurrentlyOpened(e3 = null, t3 = true) {
            const i3 = e3 && e3.closest(".hs-dropdown") && e3.closest(".hs-dropdown").parentElement.closest(".hs-dropdown") ? e3.closest(".hs-dropdown").parentElement.closest(".hs-dropdown") : null;
            let n3 = i3 ? window.$hsDropdownCollection.filter((e4) => e4.element.el.classList.contains("open") && e4.element.menu.closest(".hs-dropdown").parentElement.closest(".hs-dropdown") === i3) : window.$hsDropdownCollection.filter((e4) => e4.element.el.classList.contains("open"));
            if (e3) {
              const t4 = e3.closest(".hs-dropdown");
              if (t4) "inside" === (0, s2.BF)(t4, "--auto-close") && (n3 = n3.filter((e4) => e4.element.el !== t4));
              else {
                const t5 = e3.closest(".hs-dropdown-menu");
                if (t5) {
                  const e4 = window.$hsDropdownCollection.find((e5) => e5.element.menu === t5);
                  e4 && "inside" === (0, s2.BF)(e4.element.el, "--auto-close") && (n3 = n3.filter((t6) => t6.element.el !== e4.element.el));
                }
              }
            }
            n3 && n3.forEach((e4) => {
              if ("false" === e4.element.closeMode || "outside" === e4.element.closeMode) return false;
              e4.element.close(t3);
            }), n3 && n3.forEach((e4) => {
              if ("contextmenu" !== (0, s2.BF)(e4.element.el, "--trigger")) return false;
              document.body.style.overflow = "", document.body.style.paddingRight = "";
            });
          }
          setupAccessibility() {
            this.accessibilityComponent = window.HSAccessibilityObserver.registerComponent(this.el, { onEnter: () => {
              var e3;
              const t3 = document.activeElement;
              if (!t3) return;
              if (t3.closest(".hs-dropdown-menu")) {
                const i3 = t3.closest(".hs-dropdown-toggle, [data-hs-dropdown-toggle]");
                if (i3) return void i3.click();
                const s3 = t3.closest('[role="menuitem"], a, button, [data-hs-dropdown-item]');
                if ((null === (e3 = null == s3 ? void 0 : s3.children) || void 0 === e3 ? void 0 : e3.length) > 0) return Array.from(s3.children).forEach((e4) => {
                  e4.matches("input[type='checkbox']:not([hidden]), input[type='radio']:not([hidden])") && e4.click();
                }), void s3.focus();
                if (s3) {
                  if (t3.matches("input, textarea, select")) return;
                  s3.click();
                }
                return;
              }
              this.isOpened() ? this.close() : this.open(void 0, true);
            }, onSpace: () => {
              this.isOpened() || this.open(void 0, true);
            }, onEsc: () => {
              this.isOpened() && (this.close(), this.toggle && this.toggle.focus());
            }, onArrow: (e3) => {
              if (!e3.metaKey) switch (e3.key) {
                case "ArrowDown":
                  this.isOpened() ? this.focusMenuItem("next") : this.open(void 0, true);
                  break;
                case "ArrowUp":
                  this.isOpened() && this.focusMenuItem("prev");
                  break;
                case "ArrowRight":
                  this.onArrowX(e3, "right");
                  break;
                case "ArrowLeft":
                  this.onArrowX(e3, "left");
              }
            }, onHome: () => {
              this.isOpened() && this.onStartEnd(true);
            }, onEnd: () => {
              this.isOpened() && this.onStartEnd(false);
            }, onTab: () => {
              setTimeout(() => {
                const e3 = document.activeElement, t3 = e3.closest(".hs-dropdown-menu");
                if (e3 && t3) {
                  const t4 = e3.closest(".hs-dropdown-toggle, [data-hs-dropdown-toggle]");
                  return t4 ? void t4.click() : void e3.focus();
                }
                this.isOpened() && this.close();
              }, 100);
            }, onFirstLetter: (e3) => {
              const t3 = document.activeElement;
              !(null == t3 ? void 0 : t3.matches("input, textarea")) && this.isOpened() && this.onFirstLetter(e3);
            } }, this.isOpened(), "Dropdown", ".hs-dropdown", this.menu, { onFirstLetter: false });
          }
          onFirstLetter(e3) {
            var t3;
            if (!this.isOpened() || !this.menu) return;
            const i3 = this.menu.querySelectorAll('a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])');
            if (0 === i3.length) return;
            const s3 = Array.from(i3).indexOf(document.activeElement);
            for (let n3 = 1; n3 <= i3.length; n3++) {
              const o3 = (s3 + n3) % i3.length;
              if (((null === (t3 = i3[o3].textContent) || void 0 === t3 ? void 0 : t3.trim().toLowerCase()) || "").startsWith(e3.toLowerCase())) return void i3[o3].focus();
            }
            i3[0].focus();
          }
          onArrowX(e3, t3) {
            if (!this.isOpened()) return;
            e3.preventDefault(), e3.stopImmediatePropagation();
            const i3 = this.menu.querySelectorAll('a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])');
            if (!i3.length) return;
            const s3 = Array.from(i3).indexOf(document.activeElement);
            let n3 = -1;
            n3 = "right" === t3 ? (s3 + 1) % i3.length : s3 > 0 ? s3 - 1 : i3.length - 1, i3[n3].focus();
          }
          onStartEnd(e3 = true) {
            if (!this.isOpened()) return;
            const t3 = this.menu.querySelectorAll('a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])');
            if (!t3.length) return;
            t3[e3 ? 0 : t3.length - 1].focus();
          }
          focusMenuItem(e3) {
            const t3 = this.menu.querySelectorAll('a:not([hidden]), button:not([hidden]), [role="menuitem"]:not([hidden])');
            if (!t3.length) return;
            const i3 = Array.from(t3).indexOf(document.activeElement);
            t3["next" === e3 ? (i3 + 1) % t3.length : (i3 - 1 + t3.length) % t3.length].focus();
          }
          static on(e3, t3, i3) {
            const s3 = r2.findInCollection(t3);
            s3 && (s3.element.events[e3] = i3);
          }
          isOpened() {
            return this.isOpen();
          }
          containsElement(e3) {
            return this.el.contains(e3);
          }
        }
        r2.globalListenersInitialized = false;
        const c2 = r2;
      }, 1473(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        "undefined" != typeof Dropzone && (Dropzone.autoDiscover = false);
        class o2 extends n2.A {
          constructor(e3, t3, i3) {
            var s3;
            super(e3, t3, i3), this.extensions = {}, this.el = "string" == typeof e3 ? document.querySelector(e3) : e3;
            const n3 = this.el.getAttribute("data-hs-file-upload"), o3 = n3 ? JSON.parse(n3) : {};
            this.previewTemplate = (null === (s3 = this.el.querySelector("[data-hs-file-upload-preview]")) || void 0 === s3 ? void 0 : s3.innerHTML) || '<div class="p-3 bg-white border border-solid border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600">\n			<div class="mb-2 flex justify-between items-center">\n				<div class="flex items-center gap-x-3">\n					<span class="size-8 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500" data-hs-file-upload-file-icon></span>\n					<div>\n						<p class="text-sm font-medium text-gray-800 dark:text-white">\n							<span class="truncate inline-block max-w-75 align-bottom" data-hs-file-upload-file-name></span>.<span data-hs-file-upload-file-ext></span>\n						</p>\n						<p class="text-xs text-gray-500 dark:text-neutral-500" data-hs-file-upload-file-size></p>\n					</div>\n				</div>\n				<div class="inline-flex items-center gap-x-2">\n					<button type="button" class="text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200" data-hs-file-upload-remove>\n						<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>\n					</button>\n				</div>\n			</div>\n			<div class="flex items-center gap-x-3 whitespace-nowrap">\n				<div class="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" data-hs-file-upload-progress-bar>\n					<div class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-all duration-500 hs-file-upload-complete:bg-green-600 dark:bg-blue-500" style="width: 0" data-hs-file-upload-progress-bar-pane></div>\n				</div>\n				<div class="w-10 text-end">\n					<span class="text-sm text-gray-800 dark:text-white">\n						<span data-hs-file-upload-progress-bar-value>0</span>%\n					</span>\n				</div>\n			</div>\n		</div>', this.extensions = _.merge({ default: { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>', class: "size-5" }, xls: { icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.0243 1.43996H7.08805C6.82501 1.43996 6.57277 1.54445 6.38677 1.73043C6.20077 1.91642 6.09631 2.16868 6.09631 2.43171V6.64796L15.0243 11.856L19.4883 13.7398L23.9523 11.856V6.64796L15.0243 1.43996Z" fill="#21A366"></path><path d="M6.09631 6.64796H15.0243V11.856H6.09631V6.64796Z" fill="#107C41"></path><path d="M22.9605 1.43996H15.0243V6.64796H23.9523V2.43171C23.9523 2.16868 23.8478 1.91642 23.6618 1.73043C23.4758 1.54445 23.2235 1.43996 22.9605 1.43996Z" fill="#33C481"></path><path d="M15.0243 11.856H6.09631V21.2802C6.09631 21.5433 6.20077 21.7955 6.38677 21.9815C6.57277 22.1675 6.82501 22.272 7.08805 22.272H22.9606C23.2236 22.272 23.4759 22.1675 23.6618 21.9815C23.8478 21.7955 23.9523 21.5433 23.9523 21.2802V17.064L15.0243 11.856Z" fill="#185C37"></path><path d="M15.0243 11.856H23.9523V17.064H15.0243V11.856Z" fill="#107C41"></path><path opacity="0.1" d="M12.5446 5.15996H6.09631V19.296H12.5446C12.8073 19.2952 13.0591 19.1904 13.245 19.0046C13.4308 18.8188 13.5355 18.567 13.5363 18.3042V6.1517C13.5355 5.88892 13.4308 5.63712 13.245 5.4513C13.0591 5.26548 12.8073 5.16074 12.5446 5.15996Z" fill="black"></path><path opacity="0.2" d="M11.8006 5.90396H6.09631V20.04H11.8006C12.0633 20.0392 12.3151 19.9344 12.501 19.7486C12.6868 19.5628 12.7915 19.311 12.7923 19.0482V6.8957C12.7915 6.6329 12.6868 6.38114 12.501 6.19532C12.3151 6.0095 12.0633 5.90475 11.8006 5.90396Z" fill="black"></path><path opacity="0.2" d="M11.8006 5.90396H6.09631V18.552H11.8006C12.0633 18.5512 12.3151 18.4464 12.501 18.2606C12.6868 18.0748 12.7915 17.823 12.7923 17.5602V6.8957C12.7915 6.6329 12.6868 6.38114 12.501 6.19532C12.3151 6.0095 12.0633 5.90475 11.8006 5.90396Z" fill="black"></path><path opacity="0.2" d="M11.0566 5.90396H6.09631V18.552H11.0566C11.3193 18.5512 11.5711 18.4464 11.757 18.2606C11.9428 18.0748 12.0475 17.823 12.0483 17.5602V6.8957C12.0475 6.6329 11.9428 6.38114 11.757 6.19532C11.5711 6.0095 11.3193 5.90475 11.0566 5.90396Z" fill="black"></path><path d="M1.13604 5.90396H11.0566C11.3195 5.90396 11.5718 6.00842 11.7578 6.19442C11.9438 6.38042 12.0483 6.63266 12.0483 6.8957V16.8162C12.0483 17.0793 11.9438 17.3315 11.7578 17.5175C11.5718 17.7035 11.3195 17.808 11.0566 17.808H1.13604C0.873012 17.808 0.620754 17.7035 0.434765 17.5175C0.248775 17.3315 0.144287 17.0793 0.144287 16.8162V6.8957C0.144287 6.63266 0.248775 6.38042 0.434765 6.19442C0.620754 6.00842 0.873012 5.90396 1.13604 5.90396Z" fill="#107C41"></path><path d="M2.77283 15.576L5.18041 11.8455L2.9752 8.13596H4.74964L5.95343 10.5071C6.06401 10.7318 6.14015 10.8994 6.18185 11.01H6.19745C6.27683 10.8305 6.35987 10.6559 6.44669 10.4863L7.73309 8.13596H9.36167L7.09991 11.8247L9.41897 15.576H7.68545L6.29489 12.972C6.22943 12.861 6.17387 12.7445 6.12899 12.6238H6.10817C6.06761 12.7419 6.01367 12.855 5.94748 12.9608L4.51676 15.576H2.77283Z" fill="white"></path></svg>', class: "size-5" }, doc: { icon: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30.6141 1.91994H9.45071C9.09999 1.91994 8.76367 2.05926 8.51567 2.30725C8.26767 2.55523 8.12839 2.89158 8.12839 3.24228V8.86395L20.0324 12.3359L31.9364 8.86395V3.24228C31.9364 2.89158 31.797 2.55523 31.549 2.30725C31.3011 2.05926 30.9647 1.91994 30.6141 1.91994Z" fill="#41A5EE"></path><path d="M31.9364 8.86395H8.12839V15.8079L20.0324 19.2799L31.9364 15.8079V8.86395Z" fill="#2B7CD3"></path><path d="M31.9364 15.8079H8.12839V22.7519L20.0324 26.2239L31.9364 22.7519V15.8079Z" fill="#185ABD"></path><path d="M31.9364 22.752H8.12839V28.3736C8.12839 28.7244 8.26767 29.0607 8.51567 29.3087C8.76367 29.5567 9.09999 29.696 9.45071 29.696H30.6141C30.9647 29.696 31.3011 29.5567 31.549 29.3087C31.797 29.0607 31.9364 28.7244 31.9364 28.3736V22.752Z" fill="#103F91"></path><path opacity="0.1" d="M16.7261 6.87994H8.12839V25.7279H16.7261C17.0764 25.7269 17.4121 25.5872 17.6599 25.3395C17.9077 25.0917 18.0473 24.756 18.0484 24.4056V8.20226C18.0473 7.8519 17.9077 7.51616 17.6599 7.2684C17.4121 7.02064 17.0764 6.88099 16.7261 6.87994Z" class="fill-black dark:fill-neutral-200" fill="currentColor"></path><path opacity="0.2" d="M15.7341 7.87194H8.12839V26.7199H15.7341C16.0844 26.7189 16.4201 26.5792 16.6679 26.3315C16.9157 26.0837 17.0553 25.748 17.0564 25.3976V9.19426C17.0553 8.84386 16.9157 8.50818 16.6679 8.26042C16.4201 8.01266 16.0844 7.87299 15.7341 7.87194Z" class="fill-black dark:fill-neutral-200" fill="currentColor"></path><path opacity="0.2" d="M15.7341 7.87194H8.12839V24.7359H15.7341C16.0844 24.7349 16.4201 24.5952 16.6679 24.3475C16.9157 24.0997 17.0553 23.764 17.0564 23.4136V9.19426C17.0553 8.84386 16.9157 8.50818 16.6679 8.26042C16.4201 8.01266 16.0844 7.87299 15.7341 7.87194Z" class="fill-black dark:fill-neutral-200" fill="currentColor"></path><path opacity="0.2" d="M14.7421 7.87194H8.12839V24.7359H14.7421C15.0924 24.7349 15.4281 24.5952 15.6759 24.3475C15.9237 24.0997 16.0633 23.764 16.0644 23.4136V9.19426C16.0633 8.84386 15.9237 8.50818 15.6759 8.26042C15.4281 8.01266 15.0924 7.87299 14.7421 7.87194Z" class="fill-black dark:fill-neutral-200" fill="currentColor"></path><path d="M1.51472 7.87194H14.7421C15.0927 7.87194 15.4291 8.01122 15.6771 8.25922C15.925 8.50722 16.0644 8.84354 16.0644 9.19426V22.4216C16.0644 22.7723 15.925 23.1087 15.6771 23.3567C15.4291 23.6047 15.0927 23.7439 14.7421 23.7439H1.51472C1.16401 23.7439 0.827669 23.6047 0.579687 23.3567C0.3317 23.1087 0.192383 22.7723 0.192383 22.4216V9.19426C0.192383 8.84354 0.3317 8.50722 0.579687 8.25922C0.827669 8.01122 1.16401 7.87194 1.51472 7.87194Z" fill="#185ABD"></path><path d="M12.0468 20.7679H10.2612L8.17801 13.9231L5.99558 20.7679H4.20998L2.22598 10.8479H4.01158L5.40038 17.7919L7.48358 11.0463H8.97161L10.9556 17.7919L12.3444 10.8479H14.0308L12.0468 20.7679Z" fill="white"></path></svg>', class: "size-5" }, zip: { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v18"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="20" r="2"/><path d="M10 7V6"/><path d="M10 12v-1"/><path d="M10 18v-2"/></svg>', class: "size-5" } }, o3.extensions), this.singleton = o3.singleton, this.concatOptions = Object.assign(Object.assign({ clickable: this.el.querySelector("[data-hs-file-upload-trigger]"), previewsContainer: this.el.querySelector("[data-hs-file-upload-previews]"), addRemoveLinks: false, previewTemplate: this.previewTemplate, autoHideTrigger: false }, o3), t3), this.onReloadButtonClickListener = [], this.onTempFileInputChangeListener = [], this.init();
          }
          tempFileInputChange(e3, t3) {
            var i3;
            const s3 = null === (i3 = e3.target.files) || void 0 === i3 ? void 0 : i3[0];
            if (s3) {
              const e4 = s3;
              e4.status = Dropzone.ADDED, e4.accepted = true, e4.previewElement = t3.previewElement, e4.previewTemplate = t3.previewTemplate, e4.previewsContainer = t3.previewsContainer, this.dropzone.removeFile(t3), this.dropzone.addFile(e4);
            }
          }
          reloadButtonClick(e3, t3) {
            e3.preventDefault(), e3.stopPropagation();
            const i3 = document.createElement("input");
            i3.type = "file", this.onTempFileInputChangeListener.push({ el: i3, fn: (e4) => this.tempFileInputChange(e4, t3) }), i3.click(), i3.addEventListener("change", this.onTempFileInputChangeListener.find((e4) => e4.el === i3).fn);
          }
          init() {
            this.createCollection(window.$hsFileUploadCollection, this), this.initDropzone();
          }
          initDropzone() {
            const e3 = this.el.querySelector("[data-hs-file-upload-clear]"), t3 = Array.from(this.el.querySelectorAll("[data-hs-file-upload-pseudo-trigger]"));
            this.dropzone = new Dropzone(this.el, this.concatOptions), this.dropzone.on("addedfile", (e4) => this.onAddFile(e4)), this.dropzone.on("removedfile", () => this.onRemoveFile()), this.dropzone.on("uploadprogress", (e4, t4) => this.onUploadProgress(e4, t4)), this.dropzone.on("complete", (e4) => this.onComplete(e4)), e3 && (e3.onclick = () => {
              this.dropzone.files.length && this.dropzone.removeAllFiles(true);
            }), t3.length && t3.forEach((e4) => {
              e4.onclick = () => {
                var e5, t4;
                (null === (e5 = this.concatOptions) || void 0 === e5 ? void 0 : e5.clickable) && (null === (t4 = this.concatOptions) || void 0 === t4 ? void 0 : t4.clickable).click();
              };
            });
          }
          destroy() {
            this.onTempFileInputChangeListener.forEach((e3) => {
              e3.el.removeEventListener("change", e3.fn);
            }), this.onTempFileInputChangeListener = null, this.onReloadButtonClickListener.forEach((e3) => {
              e3.el.removeEventListener("click", e3.fn);
            }), this.onReloadButtonClickListener = null, this.dropzone.destroy(), window.$hsFileUploadCollection = window.$hsFileUploadCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          onAddFile(e3) {
            const { previewElement: t3 } = e3, i3 = e3.previewElement.querySelector("[data-hs-file-upload-reload]");
            if (!t3) return false;
            this.singleton && this.dropzone.files.length > 1 && this.dropzone.removeFile(this.dropzone.files[0]), i3 && (this.onReloadButtonClickListener.push({ el: i3, fn: (t4) => this.reloadButtonClick(t4, e3) }), i3.addEventListener("click", this.onReloadButtonClickListener.find((e4) => e4.el === i3).fn)), this.previewAccepted(e3);
          }
          previewAccepted(e3) {
            const { previewElement: t3 } = e3, i3 = this.splitFileName(e3.name), s3 = t3.querySelector("[data-hs-file-upload-file-name]"), n3 = t3.querySelector("[data-hs-file-upload-file-ext]"), o3 = t3.querySelector("[data-hs-file-upload-file-size]"), l3 = t3.querySelector("[data-hs-file-upload-file-icon]"), a2 = this.el.querySelector("[data-hs-file-upload-trigger]"), r2 = t3.querySelector("[data-dz-thumbnail]"), c2 = t3.querySelector("[data-hs-file-upload-remove]");
            s3 && (s3.textContent = i3.name), n3 && (n3.textContent = i3.extension), o3 && (o3.textContent = this.formatFileSize(e3.size)), r2 && (e3.type.includes("image/") ? r2.classList.remove("hidden") : this.setIcon(i3.extension, l3)), this.dropzone.files.length > 0 && this.concatOptions.autoHideTrigger && (a2.style.display = "none"), c2 && (c2.onclick = () => this.dropzone.removeFile(e3));
          }
          onRemoveFile() {
            const e3 = this.el.querySelector("[data-hs-file-upload-trigger]");
            0 === this.dropzone.files.length && this.concatOptions.autoHideTrigger && (e3.style.display = "");
          }
          onUploadProgress(e3, t3) {
            const { previewElement: i3 } = e3;
            if (!i3) return false;
            const s3 = i3.querySelector("[data-hs-file-upload-progress-bar]"), n3 = i3.querySelector("[data-hs-file-upload-progress-bar-pane]"), o3 = i3.querySelector("[data-hs-file-upload-progress-bar-value]"), l3 = Math.floor(t3);
            s3 && s3.setAttribute("aria-valuenow", `${l3}`), n3 && (n3.style.width = `${l3}%`), o3 && (o3.innerText = `${l3}`);
          }
          onComplete(e3) {
            const { previewElement: t3 } = e3;
            if (!t3) return false;
            t3.classList.add("complete");
          }
          setIcon(e3, t3) {
            const i3 = this.createIcon(e3);
            t3.append(i3);
          }
          createIcon(e3) {
            var t3, i3;
            const n3 = (null === (t3 = this.extensions[e3]) || void 0 === t3 ? void 0 : t3.icon) ? (0, s2.fc)(this.extensions[e3].icon) : (0, s2.fc)(this.extensions.default.icon);
            return (0, s2.en)((null === (i3 = this.extensions[e3]) || void 0 === i3 ? void 0 : i3.class) ? this.extensions[e3].class : this.extensions.default.class, n3), n3;
          }
          formatFileSize(e3) {
            return e3 < 1024 ? e3.toFixed(2) + " B" : e3 < 1048576 ? (e3 / 1024).toFixed(2) + " KB" : e3 < 1073741824 ? (e3 / 1048576).toFixed(2) + " MB" : e3 < 1099511627776 ? (e3 / 1073741824).toFixed(2) + " GB" : (e3 / 1099511627776).toFixed(2) + " TB";
          }
          splitFileName(e3) {
            let t3 = e3.lastIndexOf(".");
            return -1 == t3 ? { name: e3, extension: "" } : { name: e3.substring(0, t3), extension: e3.substring(t3 + 1) };
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsFileUploadCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsFileUploadCollection || (window.$hsFileUploadCollection = []), window.$hsFileUploadCollection && (window.$hsFileUploadCollection = window.$hsFileUploadCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-file-upload]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsFileUploadCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 1251(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3) {
            super(e3, t3), this.input = this.el.querySelector("[data-hs-input-number-input]") || null, this.increment = this.el.querySelector("[data-hs-input-number-increment]") || null, this.decrement = this.el.querySelector("[data-hs-input-number-decrement]") || null;
            const i3 = this.el.dataset.hsInputNumber, s3 = i3 ? JSON.parse(i3) : { step: 1 }, n3 = Object.assign(Object.assign({}, s3), t3);
            this.minInputValue = "min" in n3 ? n3.min : 0, this.maxInputValue = "max" in n3 ? n3.max : null, this.step = "step" in n3 && n3.step > 0 ? n3.step : 1, this.forceBlankValue = "forceBlankValue" in n3 && n3.forceBlankValue, this.input && this.checkIsNumberAndConvert(), this.init();
          }
          inputInput() {
            this.changeValue();
          }
          incrementClick() {
            this.changeValue("increment");
          }
          decrementClick() {
            this.changeValue("decrement");
          }
          init() {
            this.createCollection(window.$hsInputNumberCollection, this), this.input && this.increment && this.build();
          }
          checkIsNumberAndConvert() {
            const e3 = this.input.value.trim(), t3 = this.cleanAndExtractNumber(e3);
            null !== t3 ? (this.inputValue = t3, this.input.value = t3.toString()) : this.forceBlankValue || (this.inputValue = 0, this.input.value = "0");
          }
          cleanAndExtractNumber(e3) {
            const t3 = [];
            let i3 = false, s3 = false;
            e3.split("").forEach((e4, n4) => {
              e4 >= "0" && e4 <= "9" ? t3.push(e4) : "." !== e4 || i3 ? "-" !== e4 || s3 || 0 !== t3.length || (t3.push(e4), s3 = true) : (t3.push(e4), i3 = true);
            });
            const n3 = t3.join(""), o3 = parseFloat(n3);
            return isNaN(o3) ? null : o3;
          }
          build() {
            this.input && this.buildInput(), this.increment && this.buildIncrement(), this.decrement && this.buildDecrement(), this.inputValue <= this.minInputValue && (this.inputValue = this.minInputValue, this.input.value = `${this.minInputValue}`), this.inputValue <= this.minInputValue && this.changeValue(), this.input.hasAttribute("disabled") && this.disableButtons();
          }
          buildInput() {
            this.onInputInputListener = () => this.inputInput(), this.input.addEventListener("input", this.onInputInputListener);
          }
          buildIncrement() {
            this.onIncrementClickListener = () => this.incrementClick(), this.increment.addEventListener("click", this.onIncrementClickListener);
          }
          buildDecrement() {
            this.onDecrementClickListener = () => this.decrementClick(), this.decrement.addEventListener("click", this.onDecrementClickListener);
          }
          changeValue(e3 = "none") {
            var t3, i3;
            const n3 = { inputValue: this.inputValue }, o3 = null !== (t3 = this.minInputValue) && void 0 !== t3 ? t3 : Number.MIN_SAFE_INTEGER, l3 = null !== (i3 = this.maxInputValue) && void 0 !== i3 ? i3 : Number.MAX_SAFE_INTEGER;
            switch (this.inputValue = isNaN(this.inputValue) ? 0 : this.inputValue, e3) {
              case "increment":
                const e4 = this.inputValue + this.step;
                this.inputValue = e4 >= o3 && e4 <= l3 ? e4 : l3, this.input.value = this.inputValue.toString();
                break;
              case "decrement":
                const t4 = this.inputValue - this.step;
                this.inputValue = t4 >= o3 && t4 <= l3 ? t4 : o3, this.input.value = this.inputValue.toString();
                break;
              default:
                const i4 = isNaN(parseInt(this.input.value)) ? 0 : parseInt(this.input.value);
                this.inputValue = i4 >= l3 ? l3 : i4 <= o3 ? o3 : i4, this.input.value = this.inputValue.toString();
            }
            n3.inputValue = this.inputValue, this.inputValue === o3 ? (this.el.classList.add("disabled"), this.decrement && this.disableButtons("decrement")) : (this.el.classList.remove("disabled"), this.decrement && this.enableButtons("decrement")), this.inputValue === l3 ? (this.el.classList.add("disabled"), this.increment && this.disableButtons("increment")) : (this.el.classList.remove("disabled"), this.increment && this.enableButtons("increment")), this.fireEvent("change", n3), (0, s2.JD)("change.hs.inputNumber", this.el, n3);
          }
          disableButtons(e3 = "all") {
            "all" === e3 ? ("BUTTON" !== this.increment.tagName && "INPUT" !== this.increment.tagName || this.increment.setAttribute("disabled", "disabled"), "BUTTON" !== this.decrement.tagName && "INPUT" !== this.decrement.tagName || this.decrement.setAttribute("disabled", "disabled")) : "increment" === e3 ? "BUTTON" !== this.increment.tagName && "INPUT" !== this.increment.tagName || this.increment.setAttribute("disabled", "disabled") : "decrement" === e3 && ("BUTTON" !== this.decrement.tagName && "INPUT" !== this.decrement.tagName || this.decrement.setAttribute("disabled", "disabled"));
          }
          enableButtons(e3 = "all") {
            "all" === e3 ? ("BUTTON" !== this.increment.tagName && "INPUT" !== this.increment.tagName || this.increment.removeAttribute("disabled"), "BUTTON" !== this.decrement.tagName && "INPUT" !== this.decrement.tagName || this.decrement.removeAttribute("disabled")) : "increment" === e3 ? "BUTTON" !== this.increment.tagName && "INPUT" !== this.increment.tagName || this.increment.removeAttribute("disabled") : "decrement" === e3 && ("BUTTON" !== this.decrement.tagName && "INPUT" !== this.decrement.tagName || this.decrement.removeAttribute("disabled"));
          }
          destroy() {
            this.el.classList.remove("disabled"), this.increment.removeAttribute("disabled"), this.decrement.removeAttribute("disabled"), this.input.removeEventListener("input", this.onInputInputListener), this.increment.removeEventListener("click", this.onIncrementClickListener), this.decrement.removeEventListener("click", this.onDecrementClickListener), window.$hsInputNumberCollection = window.$hsInputNumberCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsInputNumberCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsInputNumberCollection || (window.$hsInputNumberCollection = []), window.$hsInputNumberCollection && (window.$hsInputNumberCollection = window.$hsInputNumberCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-input-number]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsInputNumberCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 2579(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3) {
            var i3;
            super(e3, t3);
            const s3 = e3.getAttribute("data-hs-layout-splitter"), n3 = s3 ? JSON.parse(s3) : {}, o3 = Object.assign(Object.assign({}, n3), t3);
            this.horizontalSplitterClasses = (null == o3 ? void 0 : o3.horizontalSplitterClasses) || null, this.horizontalSplitterTemplate = (null == o3 ? void 0 : o3.horizontalSplitterTemplate) || "<div></div>", this.verticalSplitterClasses = (null == o3 ? void 0 : o3.verticalSplitterClasses) || null, this.verticalSplitterTemplate = (null == o3 ? void 0 : o3.verticalSplitterTemplate) || "<div></div>", this.isSplittersAddedManually = null !== (i3 = null == o3 ? void 0 : o3.isSplittersAddedManually) && void 0 !== i3 && i3, this.horizontalSplitters = [], this.horizontalControls = [], this.verticalSplitters = [], this.verticalControls = [], this.isDragging = false, this.activeSplitter = null, this.onControlPointerDownListener = [], this.init();
          }
          controlPointerDown(e3) {
            this.isDragging = true, this.activeSplitter = e3, this.onPointerDownHandler(e3);
          }
          controlPointerUp() {
            this.isDragging = false, this.activeSplitter = null, this.onPointerUpHandler();
          }
          init() {
            o2.ensureGlobalHandlers(), this.createCollection(window.$hsLayoutSplitterCollection, this), this.buildSplitters(), o2.isListenersInitialized || (document.addEventListener("pointermove", o2.onDocumentPointerMove), document.addEventListener("pointerup", o2.onDocumentPointerUp), o2.isListenersInitialized = true);
          }
          buildSplitters() {
            this.buildHorizontalSplitters(), this.buildVerticalSplitters();
          }
          buildHorizontalSplitters() {
            const e3 = this.el.querySelectorAll("[data-hs-layout-splitter-horizontal-group]");
            e3.length && (e3.forEach((e4) => {
              this.horizontalSplitters.push({ el: e4, items: Array.from(e4.querySelectorAll(":scope > [data-hs-layout-splitter-item]")) });
            }), this.updateHorizontalSplitter());
          }
          buildVerticalSplitters() {
            const e3 = this.el.querySelectorAll("[data-hs-layout-splitter-vertical-group]");
            e3.length && (e3.forEach((e4) => {
              this.verticalSplitters.push({ el: e4, items: Array.from(e4.querySelectorAll(":scope > [data-hs-layout-splitter-item]")) });
            }), this.updateVerticalSplitter());
          }
          buildControl(e3, t3, i3 = "horizontal") {
            let n3;
            if (this.isSplittersAddedManually) {
              if (n3 = null == t3 ? void 0 : t3.previousElementSibling, !n3) return false;
              n3.style.display = "";
            } else n3 = (0, s2.fc)("horizontal" === i3 ? this.horizontalSplitterTemplate : this.verticalSplitterTemplate), (0, s2.en)("horizontal" === i3 ? this.horizontalSplitterClasses : this.verticalSplitterClasses, n3), n3.classList.add("hs-layout-splitter-control");
            const o3 = { el: n3, direction: i3, prev: e3, next: t3 };
            "horizontal" === i3 ? this.horizontalControls.push(o3) : this.verticalControls.push(o3), this.bindListeners(o3), t3 && !this.isSplittersAddedManually && e3.insertAdjacentElement("afterend", n3);
          }
          getSplitterItemParsedParam(e3) {
            const t3 = e3.getAttribute("data-hs-layout-splitter-item");
            return (0, s2.Fh)(t3) ? JSON.parse(t3) : t3;
          }
          getContainerSize(e3, t3) {
            return t3 ? e3.getBoundingClientRect().width : e3.getBoundingClientRect().height;
          }
          getMaxFlexSize(e3, t3, i3) {
            const s3 = this.getSplitterItemSingleParam(e3, t3);
            return "number" == typeof s3 ? s3 / 100 * i3 : 0;
          }
          updateHorizontalSplitter() {
            this.horizontalSplitters.forEach(({ items: e3 }) => {
              e3.forEach((e4) => {
                this.updateSingleSplitter(e4);
              }), e3.forEach((t3, i3) => {
                i3 >= e3.length - 1 ? this.buildControl(t3, null) : this.buildControl(t3, e3[i3 + 1]);
              });
            });
          }
          updateSingleSplitter(e3) {
            const t3 = e3.getAttribute("data-hs-layout-splitter-item"), i3 = (0, s2.Fh)(t3) ? JSON.parse(t3) : t3, n3 = (0, s2.Fh)(t3) ? i3.dynamicSize : t3;
            e3.style.flex = `${n3} 1 0`;
          }
          updateVerticalSplitter() {
            this.verticalSplitters.forEach(({ items: e3 }) => {
              e3.forEach((e4) => {
                this.updateSingleSplitter(e4);
              }), e3.forEach((t3, i3) => {
                i3 >= e3.length - 1 ? this.buildControl(t3, null, "vertical") : this.buildControl(t3, e3[i3 + 1], "vertical");
              });
            });
          }
          updateSplitterItemParam(e3, t3) {
            const i3 = this.getSplitterItemParsedParam(e3), s3 = t3.toFixed(1), n3 = "object" == typeof i3 ? JSON.stringify(Object.assign(Object.assign({}, i3), { dynamicSize: +s3 })) : s3;
            e3.setAttribute("data-hs-layout-splitter-item", n3);
          }
          onPointerDownHandler(e3) {
            const { el: t3, prev: i3, next: s3 } = e3;
            t3.classList.add("dragging"), i3.classList.add("dragging"), s3.classList.add("dragging"), document.body.style.userSelect = "none";
          }
          onPointerUpHandler() {
            document.body.style.userSelect = "";
          }
          onPointerMoveHandler(e3, t3, i3) {
            const { prev: s3, next: n3 } = t3, o3 = t3.el.closest("horizontal" === i3 ? "[data-hs-layout-splitter-horizontal-group]" : "[data-hs-layout-splitter-vertical-group]"), l3 = "horizontal" === i3, a2 = this.getContainerSize(o3, l3), r2 = this.calculateAvailableSize(o3, s3, n3, l3, a2), c2 = this.calculateResizedSizes(e3, s3, r2, l3), d2 = this.enforceLimits(c2, s3, n3, a2, r2);
            this.applySizes(s3, n3, d2, a2);
          }
          bindListeners(e3) {
            const { el: t3 } = e3;
            this.onControlPointerDownListener.push({ el: t3, fn: () => this.controlPointerDown(e3) }), t3.addEventListener("pointerdown", this.onControlPointerDownListener.find((e4) => e4.el === t3).fn);
          }
          calculateAvailableSize(e3, t3, i3, s3, n3) {
            const o3 = e3.querySelectorAll(":scope > [data-hs-layout-splitter-item]");
            return n3 - Array.from(o3).reduce((e4, n4) => {
              if (n4 === t3 || n4 === i3) return e4;
              const o4 = n4.getBoundingClientRect();
              return e4 + ("fixed" === window.getComputedStyle(n4).position ? 0 : s3 ? o4.width : o4.height);
            }, 0);
          }
          calculateResizedSizes(e3, t3, i3, s3) {
            const n3 = s3 ? t3.getBoundingClientRect().left : t3.getBoundingClientRect().top;
            let o3 = Math.max(0, Math.min((s3 ? e3.clientX : e3.clientY) - n3, i3));
            return { previousSize: o3, nextSize: i3 - o3 };
          }
          enforceLimits(e3, t3, i3, n3, o3) {
            const l3 = this.getMaxFlexSize(t3, "minSize", n3), a2 = this.getMaxFlexSize(i3, "minSize", n3), r2 = this.getMaxFlexSize(t3, "preLimitSize", n3), c2 = this.getMaxFlexSize(i3, "preLimitSize", n3);
            let { previousSize: d2, nextSize: h2 } = e3;
            h2 < a2 ? (h2 = a2, d2 = o3 - h2) : d2 < l3 && (d2 = l3, h2 = o3 - d2);
            const u2 = { prev: t3, next: i3, previousSize: d2.toFixed(), previousFlexSize: d2 / n3 * 100, previousPreLimitSize: r2, previousPreLimitFlexSize: r2 / n3 * 100, previousMinSize: l3, previousMinFlexSize: l3 / n3 * 100, nextSize: h2.toFixed(), nextFlexSize: h2 / n3 * 100, nextPreLimitSize: c2, nextPreLimitFlexSize: c2 / n3 * 100, nextMinSize: a2, nextMinFlexSize: a2 / n3 * 100, static: { prev: { minSize: this.getSplitterItemSingleParam(t3, "minSize"), preLimitSize: this.getSplitterItemSingleParam(t3, "preLimitSize") }, next: { minSize: this.getSplitterItemSingleParam(i3, "minSize"), preLimitSize: this.getSplitterItemSingleParam(i3, "preLimitSize") } } };
            return h2 < a2 ? (this.fireEvent("onNextLimit", u2), (0, s2.JD)("onNextLimit.hs.layoutSplitter", this.el, u2)) : d2 < l3 && (this.fireEvent("onPrevLimit", u2), (0, s2.JD)("onPrevLimit.hs.layoutSplitter", this.el, u2)), d2 <= r2 && (this.fireEvent("onPrevPreLimit", u2), (0, s2.JD)("onPrevPreLimit.hs.layoutSplitter", this.el, u2)), h2 <= c2 && (this.fireEvent("onNextPreLimit", u2), (0, s2.JD)("onNextPreLimit.hs.layoutSplitter", this.el, u2)), this.fireEvent("drag", u2), (0, s2.JD)("drag.hs.layoutSplitter", this.el, u2), { previousSize: d2, nextSize: h2 };
          }
          applySizes(e3, t3, i3, s3) {
            const { previousSize: n3, nextSize: o3 } = i3, l3 = n3 / s3 * 100;
            this.updateSplitterItemParam(e3, l3), e3.style.flex = `${l3.toFixed(1)} 1 0`;
            const a2 = o3 / s3 * 100;
            this.updateSplitterItemParam(t3, a2), t3.style.flex = `${a2.toFixed(1)} 1 0`;
          }
          getSplitterItemSingleParam(e3, t3) {
            try {
              return this.getSplitterItemParsedParam(e3)[t3];
            } catch (e4) {
              return console.log("There is no parameter with this name in the object."), false;
            }
          }
          getData(e3) {
            var t3, i3;
            const s3 = e3.closest("[data-hs-layout-splitter-horizontal-group], [data-hs-layout-splitter-vertical-group]");
            if (!s3) throw new Error("Element is not inside a valid layout splitter container.");
            const n3 = s3.matches("[data-hs-layout-splitter-horizontal-group]"), o3 = this.getContainerSize(s3, n3), l3 = this.getSplitterItemSingleParam(e3, "dynamicSize") || 0, a2 = this.getMaxFlexSize(e3, "minSize", o3), r2 = this.getMaxFlexSize(e3, "preLimitSize", o3), c2 = a2 / o3 * 100, d2 = r2 / o3 * 100;
            return { el: e3, dynamicSize: +(l3 / 100 * o3).toFixed(), dynamicFlexSize: l3, minSize: +a2.toFixed(), minFlexSize: c2, preLimitSize: +r2.toFixed(), preLimitFlexSize: d2, static: { minSize: null !== (t3 = this.getSplitterItemSingleParam(e3, "minSize")) && void 0 !== t3 ? t3 : null, preLimitSize: null !== (i3 = this.getSplitterItemSingleParam(e3, "preLimitSize")) && void 0 !== i3 ? i3 : null } };
          }
          setSplitterItemSize(e3, t3) {
            this.updateSplitterItemParam(e3, t3), e3.style.flex = `${t3.toFixed(1)} 1 0`;
          }
          updateFlexValues(e3) {
            let t3 = 0;
            const i3 = window.innerWidth;
            if (e3.forEach(({ id: e4, breakpoints: s3 }) => {
              const n3 = document.getElementById(e4);
              if (n3) {
                const e5 = ((e6) => {
                  const t4 = Object.keys(e6).map(Number).sort((e7, t5) => e7 - t5);
                  for (let s4 = t4.length - 1; s4 >= 0; s4--) if (i3 >= t4[s4]) return e6[t4[s4]];
                  return 0;
                })(s3);
                this.updateSplitterItemParam(n3, e5), n3.style.flex = `${e5.toFixed(1)} 1 0`, t3 += e5;
              }
            }), 100 !== t3) {
              const i4 = 100 / t3;
              e3.forEach(({ id: e4 }) => {
                const t4 = document.getElementById(e4);
                if (t4) {
                  const e5 = parseFloat(t4.style.flex.split(" ")[0]) * i4;
                  this.updateSplitterItemParam(t4, e5), t4.style.flex = `${e5.toFixed(1)} 1 0`;
                }
              });
            }
          }
          destroy() {
            this.onControlPointerDownListener && (this.onControlPointerDownListener.forEach(({ el: e3, fn: t3 }) => {
              e3.removeEventListener("pointerdown", t3);
            }), this.onControlPointerDownListener = null), this.horizontalSplitters.forEach(({ items: e3 }) => {
              e3.forEach((e4) => {
                e4.style.flex = "";
              });
            }), this.verticalSplitters.forEach(({ items: e3 }) => {
              e3.forEach((e4) => {
                e4.style.flex = "";
              });
            }), this.horizontalControls.forEach(({ el: e3 }) => {
              this.isSplittersAddedManually ? e3.style.display = "none" : e3.remove();
            }), this.verticalControls.forEach(({ el: e3 }) => {
              this.isSplittersAddedManually ? e3.style.display = "none" : e3.remove();
            }), this.horizontalControls = [], this.verticalControls = [], window.$hsLayoutSplitterCollection = window.$hsLayoutSplitterCollection.filter(({ element: e3 }) => e3.el !== this.el), 0 === window.$hsLayoutSplitterCollection.length && o2.isListenersInitialized && (document.removeEventListener("pointermove", o2.onDocumentPointerMove), document.removeEventListener("pointerup", o2.onDocumentPointerUp), o2.isListenersInitialized = false);
          }
          static findInCollection(e3) {
            return window.$hsLayoutSplitterCollection.find((t3) => e3 instanceof o2 ? t3.element.el === e3.el : "string" == typeof e3 ? t3.element.el === document.querySelector(e3) : t3.element.el === e3) || null;
          }
          static autoInit() {
            o2.ensureGlobalHandlers(), window.$hsLayoutSplitterCollection && (window.$hsLayoutSplitterCollection = window.$hsLayoutSplitterCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-layout-splitter]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsLayoutSplitterCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
          static ensureGlobalHandlers() {
            "undefined" != typeof window && (window.$hsLayoutSplitterCollection || (window.$hsLayoutSplitterCollection = []), o2.isWindowListenersInitialized || (o2.isWindowListenersInitialized = true, window.addEventListener("pointerup", () => {
              if (!window.$hsLayoutSplitterCollection) return false;
              const e3 = document.querySelector(".hs-layout-splitter-control.dragging"), t3 = document.querySelectorAll("[data-hs-layout-splitter-item].dragging");
              if (!e3) return false;
              const i3 = o2.getInstance(e3.closest("[data-hs-layout-splitter]"), true);
              e3.classList.remove("dragging"), t3.forEach((e4) => e4.classList.remove("dragging")), i3.element.isDragging = false;
            })));
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsLayoutSplitterCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static on(e3, t3, i3) {
            const s3 = o2.findInCollection(t3);
            s3 && (s3.element.events[e3] = i3);
          }
        }
        o2.isListenersInitialized = false, o2.isWindowListenersInitialized = false, o2.onDocumentPointerMove = (e3) => {
          const t3 = document.querySelector(".hs-layout-splitter-control.dragging");
          if (!t3) return;
          const i3 = o2.getInstance(t3.closest("[data-hs-layout-splitter]"), true);
          if (!i3 || !i3.element.isDragging) return;
          const s3 = i3.element.activeSplitter;
          s3 && ("vertical" === s3.direction ? i3.element.onPointerMoveHandler(e3, s3, "vertical") : i3.element.onPointerMoveHandler(e3, s3, "horizontal"));
        }, o2.onDocumentPointerUp = () => {
          const e3 = document.querySelector(".hs-layout-splitter-control.dragging");
          if (!e3) return;
          const t3 = o2.getInstance(e3.closest("[data-hs-layout-splitter]"), true);
          t3 && t3.element.controlPointerUp();
        };
        const l2 = o2;
      }, 3717(e2, t2, i2) {
        i2.d(t2, { A: () => r2 });
        var s2 = i2(1926), n2 = i2(189), o2 = i2(7615), l2 = i2(8862);
        class a2 extends o2.A {
          constructor(e3, t3, i3) {
            var o3, l3, a3, r3, c2, d2, h2;
            super(e3, t3, i3), this.lastFocusedToggle = null, this.initialZIndex = 0, window.$hsOverlayCollection || (window.$hsOverlayCollection = []), this.toggleButtons = Array.from(document.querySelectorAll(`[data-hs-overlay="#${this.el.id}"]`));
            const u2 = this.collectToggleParameters(this.toggleButtons);
            this.toggleMinifierButtons = Array.from(document.querySelectorAll(`[data-hs-overlay-minifier="#${this.el.id}"]`));
            const p2 = e3.getAttribute("data-hs-overlay-options"), m2 = p2 ? JSON.parse(p2) : {}, g2 = Object.assign(Object.assign(Object.assign({}, m2), u2), t3);
            this.hiddenClass = (null == g2 ? void 0 : g2.hiddenClass) || "hidden", this.emulateScrollbarSpace = (null == g2 ? void 0 : g2.emulateScrollbarSpace) || false, this.isClosePrev = null === (o3 = null == g2 ? void 0 : g2.isClosePrev) || void 0 === o3 || o3, this.backdropClasses = null !== (l3 = null == g2 ? void 0 : g2.backdropClasses) && void 0 !== l3 ? l3 : "hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900/50 dark:bg-neutral-900/80", this.backdropParent = "string" == typeof g2.backdropParent ? document.querySelector(g2.backdropParent) : document.body, this.backdropExtraClasses = null !== (a3 = null == g2 ? void 0 : g2.backdropExtraClasses) && void 0 !== a3 ? a3 : "", this.moveOverlayToBody = (null == g2 ? void 0 : g2.moveOverlayToBody) || null, this.isToggleClassesImmediately = null !== (r3 = null == g2 ? void 0 : g2.isToggleClassesImmediately) && void 0 !== r3 ? r3 : (0, s2.PK)((0, s2.gj)(this.el, "--toggle-classes-immediately", "false") || "false"), this.openNextOverlay = false, this.autoHide = null, this.initContainer = (null === (c2 = this.el) || void 0 === c2 ? void 0 : c2.parentElement) || null, this.isCloseWhenClickInside = (0, s2.PK)((0, s2.gj)(this.el, "--close-when-click-inside", "false") || "false"), this.isTabAccessibilityLimited = (0, s2.PK)((0, s2.gj)(this.el, "--tab-accessibility-limited", "true") || "true"), this.isLayoutAffect = (0, s2.PK)((0, s2.gj)(this.el, "--is-layout-affect", "false") || "false"), this.hasAutofocus = (0, s2.PK)((0, s2.gj)(this.el, "--has-autofocus", "true") || "true"), this.hasDynamicZIndex = (0, s2.PK)((0, s2.gj)(this.el, "--has-dynamic-z-index", "false") || "false"), this.hasAbilityToCloseOnBackdropClick = (0, s2.PK)(this.el.getAttribute("data-hs-overlay-keyboard") || "true"), this.isScrollInsideViewport = "inside-viewport" === (0, s2.gj)(this.el, "--overlay-scroll-behavior"), this.onScrollInsideViewportClickListener = null;
            const v2 = (0, s2.gj)(this.el, "--auto-close"), f2 = (0, s2.gj)(this.el, "--auto-close-equality-type"), y2 = (0, s2.gj)(this.el, "--opened");
            this.autoClose = !isNaN(+v2) && isFinite(+v2) ? +v2 : n2.LO[v2] || null, this.autoCloseEqualityType = null !== (d2 = f2) && void 0 !== d2 ? d2 : null, this.openedBreakpoint = (!isNaN(+y2) && isFinite(+y2) ? +y2 : n2.LO[y2]) || null, this.animationTarget = (null === (h2 = null == this ? void 0 : this.el) || void 0 === h2 ? void 0 : h2.querySelector(".hs-overlay-animation-target")) || this.el, this.initialZIndex = parseInt(getComputedStyle(this.el).zIndex, 10), this.onElementClickListener = [], this.onElementMinifierClickListener = [], this.initiallyOpened = this.isOpened(), this.init();
          }
          elementClick() {
            const e3 = () => {
              const e4 = { el: this.el, isOpened: !!this.el.classList.contains("open") };
              this.fireEvent("toggleClicked", e4), (0, s2.JD)("toggleClicked.hs.overlay", this.el, e4);
            };
            this.el.classList.contains("opened") ? this.close(false, e3) : this.open(e3);
          }
          elementMinifierClick() {
            const e3 = () => {
              const e4 = { el: this.el, isMinified: !!this.el.classList.contains("minified") };
              this.fireEvent("toggleMinifierClicked", e4), (0, s2.JD)("toggleMinifierClicked.hs.overlay", this.el, e4);
            };
            this.el.classList.contains("minified") ? this.minify(false, e3) : this.minify(true, e3);
          }
          minify(e3, t3 = null) {
            e3 ? (this.el.classList.add("minified"), document.body.classList.add("hs-overlay-minified"), t3 && t3()) : (this.el.classList.remove("minified"), document.body.classList.remove("hs-overlay-minified"), t3 && t3());
          }
          overlayClick(e3) {
            e3.target.id && e3.target.id === this.el.id && this.isCloseWhenClickInside && this.hasAbilityToCloseOnBackdropClick && this.close();
          }
          backdropClick() {
            this.close();
          }
          init() {
            if (this.createCollection(window.$hsOverlayCollection, this), this.isLayoutAffect && this.openedBreakpoint) {
              const e3 = a2.getInstance(this.el, true);
              a2.setOpened(this.openedBreakpoint, e3);
            }
            this.onOverlayClickListener = (e3) => this.overlayClick(e3), this.el.addEventListener("click", this.onOverlayClickListener), this.toggleButtons.length && this.buildToggleButtons(this.toggleButtons), this.toggleMinifierButtons.length && this.buildToggleMinifierButtons(), "undefined" != typeof window && (window.HSAccessibilityObserver || (window.HSAccessibilityObserver = new l2.A()), this.setupAccessibility());
          }
          buildToggleButtons(e3) {
            e3.forEach((e4) => {
              this.el.classList.contains("opened") ? e4.ariaExpanded = "true" : e4.ariaExpanded = "false", this.onElementClickListener.push({ el: e4, fn: () => this.elementClick() }), e4.addEventListener("click", this.onElementClickListener.find((t3) => t3.el === e4).fn);
            });
          }
          buildToggleMinifierButtons() {
            this.toggleMinifierButtons.forEach((e3) => {
              this.el.classList.contains("minified") ? e3.ariaExpanded = "true" : e3.ariaExpanded = "false", this.onElementMinifierClickListener.push({ el: e3, fn: () => this.elementMinifierClick() }), e3.addEventListener("click", this.onElementMinifierClickListener.find((t3) => t3.el === e3).fn);
            });
          }
          hideAuto() {
            const e3 = parseInt((0, s2.gj)(this.el, "--auto-hide", "0"));
            e3 && (this.autoHide = setTimeout(() => {
              this.close();
            }, e3));
          }
          checkTimer() {
            this.autoHide && (clearTimeout(this.autoHide), this.autoHide = null);
          }
          buildBackdrop() {
            const e3 = this.el.classList.value.split(" "), t3 = parseInt(window.getComputedStyle(this.el).getPropertyValue("z-index")), i3 = this.el.getAttribute("data-hs-overlay-backdrop-container") || false;
            this.backdrop = document.createElement("div");
            let n3 = `${this.backdropClasses} ${this.backdropExtraClasses}`;
            const o3 = "static" !== (0, s2.gj)(this.el, "--overlay-backdrop", "true"), l3 = "false" === (0, s2.gj)(this.el, "--overlay-backdrop", "true");
            this.backdrop.id = `${this.el.id}-backdrop`, "style" in this.backdrop && (this.backdrop.style.zIndex = "" + (t3 - 1));
            for (const t4 of e3) (t4.startsWith("hs-overlay-backdrop-open:") || t4.includes(":hs-overlay-backdrop-open:")) && (n3 += ` ${t4}`);
            l3 || (i3 && (this.backdrop = document.querySelector(i3).cloneNode(true), this.backdrop.classList.remove("hidden"), n3 = `${this.backdrop.classList.toString()}`, this.backdrop.classList.value = ""), o3 && (this.onBackdropClickListener = () => this.backdropClick(), this.backdrop.addEventListener("click", this.onBackdropClickListener, true)), this.backdrop.setAttribute("data-hs-overlay-backdrop-template", ""), this.backdropParent.appendChild(this.backdrop), setTimeout(() => {
              this.backdrop.classList.value = n3;
            }));
          }
          destroyBackdrop() {
            const e3 = document.querySelector(`#${this.el.id}-backdrop`);
            e3 && (this.openNextOverlay && (e3.style.transitionDuration = 1.8 * parseFloat(window.getComputedStyle(e3).transitionDuration.replace(/[^\d.-]/g, "")) + "s"), e3.classList.add("opacity-0"), (0, s2.yd)(e3, () => {
              e3.remove();
            }));
          }
          focusElement() {
            const e3 = this.el.querySelector("[autofocus]");
            if (!e3) return false;
            e3.focus();
          }
          getBodyCurrentScrollbarSize() {
            return Math.max(window.innerWidth - document.documentElement.clientWidth, 0);
          }
          collectToggleParameters(e3) {
            let t3 = {};
            return e3.forEach((e4) => {
              const i3 = e4.getAttribute("data-hs-overlay-options"), s3 = i3 ? JSON.parse(i3) : {};
              t3 = Object.assign(Object.assign({}, t3), s3);
            }), t3;
          }
          isElementVisible() {
            const e3 = window.getComputedStyle(this.el);
            if ("none" === e3.display || "hidden" === e3.visibility || "0" === e3.opacity) return false;
            const t3 = this.el.getBoundingClientRect();
            if (0 === t3.width || 0 === t3.height) return false;
            let i3 = this.el.parentElement;
            for (; i3; ) {
              const e4 = window.getComputedStyle(i3);
              if ("none" === e4.display || "hidden" === e4.visibility || "0" === e4.opacity) return false;
              i3 = i3.parentElement;
            }
            return true;
          }
          isOpened() {
            return this.el.classList.contains("open") && !this.el.classList.contains(this.hiddenClass);
          }
          open(e3 = null) {
            window.$hsOverlayCollection || (window.$hsOverlayCollection = []), this.el.classList.contains("minified") && this.minify(false), this.hasDynamicZIndex && (a2.currentZIndex < this.initialZIndex && (a2.currentZIndex = this.initialZIndex), a2.currentZIndex++, this.el.style.zIndex = `${a2.currentZIndex}`);
            const t3 = document.querySelectorAll(".hs-overlay.open"), i3 = window.$hsOverlayCollection.find((e4) => Array.from(t3).includes(e4.element.el) && !e4.element.isLayoutAffect), n3 = document.querySelectorAll(`[data-hs-overlay="#${this.el.id}"]`), o3 = "true" !== (0, s2.gj)(this.el, "--body-scroll", "false");
            if (this.lastFocusedToggle = document.activeElement, this.isClosePrev && i3) return this.openNextOverlay = true, i3.element.close().then(() => {
              this.open(), this.openNextOverlay = false;
            });
            o3 && (this.emulateScrollbarSpace && (document.body.style.paddingRight = `${this.getBodyCurrentScrollbarSize()}px`), document.body.style.overflow = "hidden"), this.buildBackdrop(), this.checkTimer(), this.hideAuto(), n3.forEach((e4) => {
              e4.ariaExpanded && (e4.ariaExpanded = "true");
            }), this.el.classList.remove(this.hiddenClass), this.el.setAttribute("aria-overlay", "true"), this.el.setAttribute("tabindex", "-1");
            const l3 = () => {
              if (this.el.classList.contains("opened")) return false;
              this.el.classList.add("open", "opened"), this.isLayoutAffect && document.body.classList.add("hs-overlay-body-open"), this.initiallyOpened || (this.el.focus(), this.el.style.outline = "none"), this.initiallyOpened = false, this.fireEvent("open", this.el), (0, s2.JD)("open.hs.overlay", this.el, this.el), window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, true), this.hasAutofocus && this.focusElement(), "function" == typeof e3 && e3(), this.isScrollInsideViewport && (this.el.style.pointerEvents = "auto", this.onScrollInsideViewportClickListener = (e4) => {
                e4.target === this.el && this.hasAbilityToCloseOnBackdropClick && this.close();
              }, this.el.addEventListener("click", this.onScrollInsideViewportClickListener)), this.isElementVisible() && a2.openedItemsQty++;
            };
            this.isToggleClassesImmediately ? l3() : setTimeout(l3, 50);
          }
          close(e3 = false, t3 = null) {
            window.$hsOverlayCollection || (window.$hsOverlayCollection = []), this.isElementVisible() && (a2.openedItemsQty = a2.openedItemsQty <= 0 ? 0 : a2.openedItemsQty - 1), 0 === a2.openedItemsQty && this.isLayoutAffect && document.body.classList.remove("hs-overlay-body-open");
            const i3 = (e4) => {
              if (this.el.classList.contains("open")) return false;
              document.querySelectorAll(`[data-hs-overlay="#${this.el.id}"]`).forEach((e5) => {
                e5.ariaExpanded && (e5.ariaExpanded = "false");
              }), this.el.classList.add(this.hiddenClass), this.hasDynamicZIndex && (this.el.style.zIndex = ""), this.destroyBackdrop(), this.fireEvent("close", this.el), (0, s2.JD)("close.hs.overlay", this.el, this.el), window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, false);
              if (window.$hsOverlayCollection.some((e5) => e5.element.el.classList.contains("opened") && !e5.element.isLayoutAffect) || (document.body.style.overflow = "", this.emulateScrollbarSpace && (document.body.style.paddingRight = "")), this.lastFocusedToggle && (this.lastFocusedToggle.focus(), this.lastFocusedToggle = null), e4(this.el), "function" == typeof t3 && t3(), 0 === a2.openedItemsQty) {
                if (!this.isLayoutAffect) {
                  window.$hsOverlayCollection.some((e5) => e5.element.isLayoutAffect && e5.element.el.classList.contains("opened")) || document.body.classList.remove("hs-overlay-body-open");
                }
                this.hasDynamicZIndex && (a2.currentZIndex = 0);
              }
            };
            return new Promise((t4) => {
              this.el.classList.remove("open", "opened"), this.el.removeAttribute("aria-overlay"), this.el.removeAttribute("tabindex"), this.el.style.outline = "", this.isScrollInsideViewport && (this.el.style.pointerEvents = "", this.onScrollInsideViewportClickListener && (this.el.removeEventListener("click", this.onScrollInsideViewportClickListener), this.onScrollInsideViewportClickListener = null)), e3 || this.isToggleClassesImmediately ? i3(t4) : (0, s2.yd)(this.animationTarget, () => i3(t4));
            });
          }
          updateToggles() {
            const e3 = Array.from(document.querySelectorAll(`[data-hs-overlay="#${this.el.id}"]`)).filter((e4) => !this.toggleButtons.includes(e4));
            e3.length && (this.toggleButtons.push(...e3), this.buildToggleButtons(e3)), this.toggleButtons = this.toggleButtons.filter((e4) => {
              var t3;
              if (document.contains(e4)) return true;
              const i3 = null === (t3 = this.onElementClickListener) || void 0 === t3 ? void 0 : t3.find((t4) => t4.el === e4);
              return i3 && e4.removeEventListener("click", i3.fn), false;
            });
          }
          destroy() {
            window.$hsOverlayCollection && (this.el.classList.remove("open", "opened", this.hiddenClass), this.isLayoutAffect && document.body.classList.remove("hs-overlay-body-open"), this.el.removeEventListener("click", this.onOverlayClickListener), this.onElementClickListener.length && (this.onElementClickListener.forEach(({ el: e3, fn: t3 }) => {
              e3.removeEventListener("click", t3);
            }), this.onElementClickListener = null), this.backdrop && this.backdrop.removeEventListener("click", this.onBackdropClickListener), this.backdrop && (this.backdrop.remove(), this.backdrop = null), this.onScrollInsideViewportClickListener && (this.el.removeEventListener("click", this.onScrollInsideViewportClickListener), this.onScrollInsideViewportClickListener = null), window.$hsOverlayCollection = window.$hsOverlayCollection.filter(({ element: e3 }) => e3.el !== this.el));
          }
          static findInCollection(e3) {
            return window.$hsOverlayCollection && window.$hsOverlayCollection.find((t3) => e3 instanceof a2 ? t3.element.el === e3.el : "string" == typeof e3 ? t3.element.el === document.querySelector(e3) : t3.element.el === e3) || null;
          }
          static getInstance(e3, t3) {
            const i3 = "string" == typeof e3 ? document.querySelector(e3) : e3, s3 = (null == i3 ? void 0 : i3.getAttribute("data-hs-overlay")) ? i3.getAttribute("data-hs-overlay") : e3, n3 = window.$hsOverlayCollection.find((e4) => e4.element.el === ("string" == typeof s3 ? document.querySelector(s3) : s3) || e4.element.el === ("string" == typeof s3 ? document.querySelector(s3) : s3));
            return n3 ? t3 ? n3 : n3.element.el : null;
          }
          static autoInit() {
            window.$hsOverlayCollection || (window.$hsOverlayCollection = []), window.$hsOverlayCollection && (window.$hsOverlayCollection = window.$hsOverlayCollection.filter(({ element: e3 }) => document.contains(e3.el))), a2.openedItemsQty = window.$hsOverlayCollection.filter(({ element: e3 }) => e3.el.classList.contains("opened")).length, document.querySelectorAll(".hs-overlay:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsOverlayCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new a2(e3);
            }), window.$hsOverlayCollection.forEach(({ element: e3 }) => {
              e3.updateToggles();
            });
          }
          static open(e3) {
            const t3 = a2.findInCollection(e3);
            t3 && t3.element.el.classList.contains(t3.element.hiddenClass) && t3.element.open();
          }
          static close(e3) {
            const t3 = a2.findInCollection(e3);
            t3 && !t3.element.el.classList.contains(t3.element.hiddenClass) && t3.element.close();
          }
          static minify(e3, t3) {
            const i3 = a2.findInCollection(e3);
            i3 && i3.element.minify(t3);
          }
          static setOpened(e3, t3) {
            document.body.clientWidth >= e3 ? (t3.element.el.classList.contains("minified") && t3.element.minify(false), document.body.classList.add("hs-overlay-body-open"), t3.element.open()) : t3.element.close(true);
          }
          setupAccessibility() {
            this.accessibilityComponent = window.HSAccessibilityObserver.registerComponent(this.el, { onEnter: () => {
              this.isOpened() || this.open();
            }, onEsc: () => {
              this.isOpened() && this.hasAbilityToCloseOnBackdropClick && this.close();
            }, onTab: () => {
              var e3;
              if (!this.isOpened() || !this.isTabAccessibilityLimited) return;
              const t3 = Array.from(this.el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((e4) => !e4.hidden && "none" !== window.getComputedStyle(e4).display);
              if (0 === t3.length) return;
              const i3 = this.el.querySelector(":focus"), s3 = i3 ? t3.indexOf(i3) : -1;
              window.event instanceof KeyboardEvent && window.event.shiftKey ? s3 <= 0 ? t3[t3.length - 1].focus() : t3[s3 - 1].focus() : s3 === t3.length - 1 ? t3[0].focus() : t3[s3 + 1].focus(), null === (e3 = window.event) || void 0 === e3 || e3.preventDefault();
            } }, this.isOpened(), "Overlay", ".hs-overlay"), this.toggleButtons.forEach((e3) => {
              window.HSAccessibilityObserver.registerComponent(e3, { onEnter: () => {
                this.isOpened() ? this.close() : this.open();
              }, onEsc: () => {
                this.isOpened() && this.hasAbilityToCloseOnBackdropClick && this.close();
              } }, this.isOpened(), "Overlay Toggle", `[data-hs-overlay="#${this.el.id}"]`);
            });
          }
          static on(e3, t3, i3) {
            const s3 = a2.findInCollection(t3);
            s3 && (s3.element.events[e3] = i3);
          }
        }
        a2.openedItemsQty = 0, a2.currentZIndex = 0;
        const r2 = a2;
      }, 1159(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          elementInput(e3, t3) {
            this.onInput(e3, t3);
          }
          elementPaste(e3) {
            this.onPaste(e3);
          }
          elementKeydown(e3, t3) {
            this.onKeydown(e3, t3);
          }
          elementFocusin(e3) {
            this.onFocusIn(e3);
          }
          elementFocusout(e3) {
            this.onFocusOut(e3);
          }
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = e3.getAttribute("data-hs-pin-input"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.items = this.el.querySelectorAll("[data-hs-pin-input-item]"), this.currentItem = null, this.currentValue = new Array(this.items.length).fill(""), this.placeholders = [], this.availableCharsRE = new RegExp((null == n3 ? void 0 : n3.availableCharsRE) || "^[a-zA-Z0-9]+$"), this.onElementInputListener = [], this.onElementPasteListener = [], this.onElementKeydownListener = [], this.onElementFocusinListener = [], this.onElementFocusoutListener = [], this.init();
          }
          init() {
            this.createCollection(window.$hsPinInputCollection, this), this.items.length && this.build();
          }
          build() {
            this.buildInputItems();
          }
          buildInputItems() {
            this.items.forEach((e3, t3) => {
              this.placeholders.push(e3.getAttribute("placeholder") || ""), e3.hasAttribute("autofocus") && this.onFocusIn(t3), this.onElementInputListener.push({ el: e3, fn: (e4) => this.elementInput(e4, t3) }), this.onElementPasteListener.push({ el: e3, fn: (e4) => this.elementPaste(e4) }), this.onElementKeydownListener.push({ el: e3, fn: (e4) => this.elementKeydown(e4, t3) }), this.onElementFocusinListener.push({ el: e3, fn: () => this.elementFocusin(t3) }), this.onElementFocusoutListener.push({ el: e3, fn: () => this.elementFocusout(t3) }), e3.addEventListener("input", this.onElementInputListener.find((t4) => t4.el === e3).fn), e3.addEventListener("paste", this.onElementPasteListener.find((t4) => t4.el === e3).fn), e3.addEventListener("keydown", this.onElementKeydownListener.find((t4) => t4.el === e3).fn), e3.addEventListener("focusin", this.onElementFocusinListener.find((t4) => t4.el === e3).fn), e3.addEventListener("focusout", this.onElementFocusoutListener.find((t4) => t4.el === e3).fn);
            });
          }
          checkIfNumber(e3) {
            return e3.match(this.availableCharsRE);
          }
          autoFillAll(e3) {
            Array.from(e3).forEach((e4, t3) => {
              if (!(null == this ? void 0 : this.items[t3])) return false;
              this.items[t3].value = e4, this.items[t3].dispatchEvent(new Event("input", { bubbles: true }));
            });
          }
          setCurrentValue() {
            this.currentValue = Array.from(this.items).map((e3) => e3.value);
          }
          toggleCompleted() {
            this.currentValue.includes("") ? this.el.classList.remove("active") : this.el.classList.add("active");
          }
          onInput(e3, t3) {
            const i3 = e3.target.value;
            if (this.currentItem = e3.target, this.currentItem.value = "", this.currentItem.value = i3[i3.length - 1], !this.checkIfNumber(this.currentItem.value)) return this.currentItem.value = this.currentValue[t3] || "", false;
            if (this.setCurrentValue(), this.currentItem.value) {
              if (t3 < this.items.length - 1 && this.items[t3 + 1].focus(), !this.currentValue.includes("")) {
                const e4 = { currentValue: this.currentValue };
                this.fireEvent("completed", e4), (0, s2.JD)("completed.hs.pinInput", this.el, e4);
              }
              this.toggleCompleted();
            } else t3 > 0 && this.items[t3 - 1].focus();
          }
          onKeydown(e3, t3) {
            "Backspace" === e3.key && t3 > 0 && ("" === this.items[t3].value ? (this.items[t3 - 1].value = "", this.items[t3 - 1].focus()) : this.items[t3].value = ""), this.setCurrentValue(), this.toggleCompleted();
          }
          onFocusIn(e3) {
            this.items[e3].setAttribute("placeholder", "");
          }
          onFocusOut(e3) {
            this.items[e3].setAttribute("placeholder", this.placeholders[e3]);
          }
          onPaste(e3) {
            e3.preventDefault(), this.items.forEach((t3) => {
              document.activeElement === t3 && this.autoFillAll(e3.clipboardData.getData("text"));
            });
          }
          destroy() {
            this.el.classList.remove("active"), this.items.length && this.items.forEach((e3) => {
              e3.removeEventListener("input", this.onElementInputListener.find((t3) => t3.el === e3).fn), e3.removeEventListener("paste", this.onElementPasteListener.find((t3) => t3.el === e3).fn), e3.removeEventListener("keydown", this.onElementKeydownListener.find((t3) => t3.el === e3).fn), e3.removeEventListener("focusin", this.onElementFocusinListener.find((t3) => t3.el === e3).fn), e3.removeEventListener("focusout", this.onElementFocusoutListener.find((t3) => t3.el === e3).fn);
            }), this.items = null, this.currentItem = null, this.currentValue = null, window.$hsPinInputCollection = window.$hsPinInputCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsPinInputCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsPinInputCollection || (window.$hsPinInputCollection = []), window.$hsPinInputCollection && (window.$hsPinInputCollection = window.$hsPinInputCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-pin-input]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsPinInputCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 794(e2, t2, i2) {
        i2.d(t2, { A: () => o2 });
        var s2 = i2(7615);
        class n2 extends s2.A {
          constructor(e3, t3, i3) {
            var s3;
            if (super(e3, t3 || {}, i3), !n2.isAvailable()) throw new Error(n2.unavailableMessage);
            const o3 = e3.getAttribute("data-hs-range-slider"), l2 = o3 ? JSON.parse(o3) : {};
            this.concatOptions = Object.assign(Object.assign(Object.assign({}, l2), t3), { cssClasses: Object.assign(Object.assign({}, noUiSlider.cssClasses), this.processClasses(l2.cssClasses)) }), this.wrapper = this.concatOptions.wrapper || e3.closest(".hs-range-slider-wrapper") || null, this.currentValue = this.concatOptions.currentValue ? Array.from(this.concatOptions.currentValue) : Array.from((null === (s3 = this.wrapper) || void 0 === s3 ? void 0 : s3.querySelectorAll(".hs-range-slider-current-value")) || []), this.icons = this.concatOptions.icons || {}, this.init();
          }
          get formattedValue() {
            const e3 = this.el.noUiSlider.get();
            if (Array.isArray(e3) && this.format) {
              const t3 = [];
              return e3.forEach((e4) => {
                t3.push(this.format.to(e4));
              }), t3;
            }
            return this.format ? this.format.to(e3) : e3;
          }
          processClasses(e3) {
            const t3 = {};
            return Object.keys(e3).forEach((i3) => {
              i3 && (t3[i3] = `${noUiSlider.cssClasses[i3]} ${e3[i3]}`);
            }), t3;
          }
          init() {
            var e3, t3, i3, s3, n3, o3, l2, a2, r2, c2, d2, h2, u2;
            this.createCollection(window.$hsRangeSliderCollection, this), ("object" == typeof (null === (e3 = this.concatOptions) || void 0 === e3 ? void 0 : e3.formatter) ? "thousandsSeparatorAndDecimalPoints" === (null === (i3 = null === (t3 = this.concatOptions) || void 0 === t3 ? void 0 : t3.formatter) || void 0 === i3 ? void 0 : i3.type) : "thousandsSeparatorAndDecimalPoints" === (null === (s3 = this.concatOptions) || void 0 === s3 ? void 0 : s3.formatter)) ? this.thousandsSeparatorAndDecimalPointsFormatter() : ("object" == typeof (null === (n3 = this.concatOptions) || void 0 === n3 ? void 0 : n3.formatter) ? "integer" === (null === (l2 = null === (o3 = this.concatOptions) || void 0 === o3 ? void 0 : o3.formatter) || void 0 === l2 ? void 0 : l2.type) : "integer" === (null === (a2 = this.concatOptions) || void 0 === a2 ? void 0 : a2.formatter)) ? this.integerFormatter() : "object" == typeof (null === (r2 = this.concatOptions) || void 0 === r2 ? void 0 : r2.formatter) && ((null === (d2 = null === (c2 = this.concatOptions) || void 0 === c2 ? void 0 : c2.formatter) || void 0 === d2 ? void 0 : d2.prefix) || (null === (u2 = null === (h2 = this.concatOptions) || void 0 === h2 ? void 0 : h2.formatter) || void 0 === u2 ? void 0 : u2.postfix)) && this.prefixOrPostfixFormatter(), noUiSlider.create(this.el, this.concatOptions), this.currentValue && this.currentValue.length > 0 && this.el.noUiSlider.on("update", (e4) => {
              this.updateCurrentValue(e4);
            }), this.concatOptions.disabled && this.setDisabled(), this.icons.handle && this.buildHandleIcon();
          }
          formatValue(e3) {
            var t3, i3, s3, n3, o3, l2, a2, r2, c2;
            let d2 = "";
            return "object" == typeof (null === (t3 = this.concatOptions) || void 0 === t3 ? void 0 : t3.formatter) ? ((null === (s3 = null === (i3 = this.concatOptions) || void 0 === i3 ? void 0 : i3.formatter) || void 0 === s3 ? void 0 : s3.prefix) && (d2 += null === (o3 = null === (n3 = this.concatOptions) || void 0 === n3 ? void 0 : n3.formatter) || void 0 === o3 ? void 0 : o3.prefix), d2 += e3, (null === (a2 = null === (l2 = this.concatOptions) || void 0 === l2 ? void 0 : l2.formatter) || void 0 === a2 ? void 0 : a2.postfix) && (d2 += null === (c2 = null === (r2 = this.concatOptions) || void 0 === r2 ? void 0 : r2.formatter) || void 0 === c2 ? void 0 : c2.postfix)) : d2 += e3, d2;
          }
          integerFormatter() {
            var e3;
            this.format = { to: (e4) => this.formatValue(Math.round(e4)), from: (e4) => Math.round(+e4) }, (null === (e3 = this.concatOptions) || void 0 === e3 ? void 0 : e3.tooltips) && (this.concatOptions.tooltips = this.format);
          }
          prefixOrPostfixFormatter() {
            var e3;
            this.format = { to: (e4) => this.formatValue(e4), from: (e4) => +e4 }, (null === (e3 = this.concatOptions) || void 0 === e3 ? void 0 : e3.tooltips) && (this.concatOptions.tooltips = this.format);
          }
          thousandsSeparatorAndDecimalPointsFormatter() {
            var e3;
            this.format = { to: (e4) => this.formatValue(new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(e4)), from: (e4) => parseFloat(e4.replace(/,/g, "")) }, (null === (e3 = this.concatOptions) || void 0 === e3 ? void 0 : e3.tooltips) && (this.concatOptions.tooltips = this.format);
          }
          setDisabled() {
            this.el.setAttribute("disabled", "disabled"), this.el.classList.add("disabled");
          }
          buildHandleIcon() {
            if (!this.icons.handle) return false;
            const e3 = this.el.querySelector(".noUi-handle");
            if (!e3) return false;
            e3.innerHTML = this.icons.handle;
          }
          updateCurrentValue(e3) {
            this.currentValue && 0 !== this.currentValue.length && e3.forEach((e4, t3) => {
              var i3;
              const s3 = null === (i3 = this.currentValue) || void 0 === i3 ? void 0 : i3[t3];
              if (!s3) return;
              const n3 = this.format ? this.format.to(e4).toString() : e4.toString();
              s3 instanceof HTMLInputElement ? s3.value = n3 : s3.textContent = n3;
            });
          }
          destroy() {
            this.el.noUiSlider.destroy(), this.format = null, window.$hsRangeSliderCollection = window.$hsRangeSliderCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static isAvailable() {
            return "undefined" != typeof noUiSlider;
          }
          static getInstance(e3, t3 = false) {
            const i3 = window.$hsRangeSliderCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            const e3 = "[data-hs-range-slider]:not(.--prevent-on-load-init)";
            n2.isAvailable() ? (window.$hsRangeSliderCollection || (window.$hsRangeSliderCollection = []), window.$hsRangeSliderCollection && (window.$hsRangeSliderCollection = window.$hsRangeSliderCollection.filter(({ element: e4 }) => document.contains(e4.el))), document.querySelectorAll(e3).forEach((e4) => {
              window.$hsRangeSliderCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e4;
              }) || new n2(e4);
            })) : document.querySelectorAll(e3).length && console.error(n2.unavailableMessage);
          }
        }
        n2.unavailableMessage = "HSRangeSlider: noUiSlider is not available, please add it to the page.";
        const o2 = n2;
      }, 242(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = e3.getAttribute("data-hs-remove-element-options"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.removeTargetId = this.el.getAttribute("data-hs-remove-element"), this.removeTarget = document.querySelector(this.removeTargetId), this.removeTargetAnimationClass = (null == n3 ? void 0 : n3.removeTargetAnimationClass) || "hs-removing", this.removeTarget && this.init();
          }
          elementClick() {
            this.remove();
          }
          init() {
            this.createCollection(window.$hsRemoveElementCollection, this), this.onElementClickListener = () => this.elementClick(), this.el.addEventListener("click", this.onElementClickListener);
          }
          remove() {
            if (!this.removeTarget) return false;
            this.removeTarget.classList.add(this.removeTargetAnimationClass), (0, s2.yd)(this.removeTarget, () => setTimeout(() => this.removeTarget.remove()));
          }
          destroy() {
            this.removeTarget.classList.remove(this.removeTargetAnimationClass), this.el.removeEventListener("click", this.onElementClickListener), window.$hsRemoveElementCollection = window.$hsRemoveElementCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsRemoveElementCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3) || t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsRemoveElementCollection || (window.$hsRemoveElementCollection = []), window.$hsRemoveElementCollection && (window.$hsRemoveElementCollection = window.$hsRemoveElementCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-remove-element]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsRemoveElementCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 2010(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3) {
            var i3, s3;
            super(e3, t3);
            const n3 = e3.getAttribute("data-hs-scroll-nav"), o3 = n3 ? JSON.parse(n3) : {}, l3 = Object.assign(Object.assign(Object.assign({}, { paging: true, autoCentering: false }), o3), t3);
            this.paging = null === (i3 = l3.paging) || void 0 === i3 || i3, this.autoCentering = null !== (s3 = l3.autoCentering) && void 0 !== s3 && s3, this.body = this.el.querySelector(".hs-scroll-nav-body"), this.items = this.body ? Array.from(this.body.querySelectorAll(":scope > *")) : [], this.prev = this.el.querySelector(".hs-scroll-nav-prev") || null, this.next = this.el.querySelector(".hs-scroll-nav-next") || null, this.setCurrentState(), this.init();
          }
          init() {
            if (!this.body || !this.items.length) return false;
            this.createCollection(window.$hsScrollNavCollection, this), this.setCurrentState(), this.paging ? (this.prev && this.buildPrev(), this.next && this.buildNext()) : (this.prev && this.buildPrevSingle(), this.next && this.buildNextSingle()), this.autoCentering && this.scrollToActiveElement(), this.body.addEventListener("scroll", (0, s2.sg)(() => this.setCurrentState(), 200)), window.addEventListener("resize", (0, s2.sg)(() => {
              this.setCurrentState(), this.autoCentering && this.scrollToActiveElement();
            }, 200));
          }
          setCurrentState() {
            this.currentState = { first: this.getFirstVisibleItem(), last: this.getLastVisibleItem(), center: this.getCenterVisibleItem() }, this.prev && this.setPrevToDisabled(), this.next && this.setNextToDisabled();
          }
          setPrevToDisabled() {
            this.currentState.first === this.items[0] ? (this.prev.setAttribute("disabled", "disabled"), this.prev.classList.add("disabled")) : (this.prev.removeAttribute("disabled"), this.prev.classList.remove("disabled"));
          }
          setNextToDisabled() {
            this.currentState.last === this.items[this.items.length - 1] ? (this.next.setAttribute("disabled", "disabled"), this.next.classList.add("disabled")) : (this.next.removeAttribute("disabled"), this.next.classList.remove("disabled"));
          }
          buildPrev() {
            this.prev && this.prev.addEventListener("click", () => {
              const e3 = this.currentState.first;
              if (!e3) return;
              const t3 = this.getVisibleItemsCount();
              let i3 = e3;
              for (let e4 = 0; e4 < t3 && i3.previousElementSibling; e4++) i3 = i3.previousElementSibling;
              this.goTo(i3);
            });
          }
          buildNext() {
            this.next && this.next.addEventListener("click", () => {
              const e3 = this.currentState.last;
              if (!e3) return;
              const t3 = this.getVisibleItemsCount();
              let i3 = e3;
              for (let e4 = 0; e4 < t3 && i3.nextElementSibling; e4++) i3 = i3.nextElementSibling;
              this.goTo(i3);
            });
          }
          buildPrevSingle() {
            var e3;
            null === (e3 = this.prev) || void 0 === e3 || e3.addEventListener("click", () => {
              const e4 = this.currentState.first;
              if (!e4) return;
              const t3 = e4.previousElementSibling;
              t3 && this.goTo(t3);
            });
          }
          buildNextSingle() {
            var e3;
            null === (e3 = this.next) || void 0 === e3 || e3.addEventListener("click", () => {
              const e4 = this.currentState.last;
              if (!e4) return;
              const t3 = e4.nextElementSibling;
              t3 && this.goTo(t3);
            });
          }
          getCenterVisibleItem() {
            const e3 = this.body.scrollLeft + this.body.clientWidth / 2;
            let t3 = null, i3 = 1 / 0;
            return this.items.forEach((s3) => {
              const n3 = s3.offsetLeft + s3.offsetWidth / 2, o3 = Math.abs(n3 - e3);
              o3 < i3 && (i3 = o3, t3 = s3);
            }), t3;
          }
          getFirstVisibleItem() {
            const e3 = this.body.getBoundingClientRect();
            for (let t3 of this.items) {
              const i3 = t3.getBoundingClientRect();
              if (i3.left >= e3.left && i3.right <= e3.right) return t3;
            }
            return null;
          }
          getLastVisibleItem() {
            const e3 = this.body.getBoundingClientRect();
            for (let t3 = this.items.length - 1; t3 >= 0; t3--) {
              const i3 = this.items[t3], s3 = i3.getBoundingClientRect();
              if (s3.left < e3.right && s3.right > e3.left) return i3;
            }
            return null;
          }
          getVisibleItemsCount() {
            const e3 = this.body.clientWidth;
            let t3 = 0, i3 = 0;
            for (let s3 of this.items) {
              if (i3 += s3.offsetWidth, !(i3 <= e3)) break;
              t3++;
            }
            return t3;
          }
          scrollToActiveElement() {
            const e3 = this.body.querySelector(".active");
            if (!e3) return false;
            this.centerElement(e3);
          }
          getCurrentState() {
            return this.currentState;
          }
          goTo(e3, t3) {
            e3.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            new IntersectionObserver((i3, s3) => {
              i3.forEach((i4) => {
                i4.target === e3 && i4.isIntersecting && ("function" == typeof t3 && t3(), s3.disconnect());
              });
            }, { root: this.body, threshold: 1 }).observe(e3);
          }
          centerElement(e3, t3 = "smooth") {
            if (!this.body.contains(e3)) return;
            const i3 = e3.offsetLeft + e3.offsetWidth / 2 - this.body.clientWidth / 2;
            this.body.scrollTo({ left: i3, behavior: t3 });
          }
          destroy() {
            this.paging ? (this.prev && this.prev.removeEventListener("click", this.buildPrev), this.next && this.next.removeEventListener("click", this.buildNext)) : (this.prev && this.prev.removeEventListener("click", this.buildPrevSingle), this.next && this.next.removeEventListener("click", this.buildNextSingle)), window.removeEventListener("resize", (0, s2.sg)(() => this.setCurrentState(), 200)), window.$hsScrollNavCollection = window.$hsScrollNavCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsScrollNavCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3) || t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsScrollNavCollection || (window.$hsScrollNavCollection = []), window.$hsScrollNavCollection && (window.$hsRemoveElementCollection = window.$hsRemoveElementCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-scroll-nav]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsScrollNavCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 8402(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3 = {}) {
            super(e3, t3), this.isScrollingDown = false, this.lastScrollTop = 0;
            const i3 = e3.getAttribute("data-hs-scrollspy-options"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.ignoreScrollUp = void 0 !== n3.ignoreScrollUp && n3.ignoreScrollUp, this.links = this.el.querySelectorAll("[href]"), this.sections = [], this.scrollableId = this.el.getAttribute("data-hs-scrollspy-scrollable-parent"), this.scrollable = this.scrollableId ? document.querySelector(this.scrollableId) : document, this.onLinkClickListener = [], this.init();
          }
          scrollableScroll(e3) {
            const t3 = this.scrollable instanceof HTMLElement ? this.scrollable.scrollTop : window.scrollY;
            this.isScrollingDown = t3 > this.lastScrollTop, this.lastScrollTop = t3 <= 0 ? 0 : t3, Array.from(this.sections).forEach((t4) => {
              if (!t4.getAttribute("id")) return false;
              this.update(e3, t4);
            });
          }
          init() {
            this.createCollection(window.$hsScrollspyCollection, this), this.links.forEach((e3) => {
              this.sections.push(this.scrollable.querySelector(e3.getAttribute("href")));
            }), this.onScrollableScrollListener = (e3) => this.scrollableScroll(e3), this.onPopstateListener = (e3) => this.handlePopstate(e3), this.scrollable.addEventListener("scroll", this.onScrollableScrollListener), window.addEventListener("popstate", this.onPopstateListener), this.links.forEach((e3) => {
              this.onLinkClickListener.push({ el: e3, fn: (t3) => this.linkClick(t3, e3) }), e3.addEventListener("click", this.onLinkClickListener.find((t3) => t3.el === e3).fn);
            });
          }
          determineScrollDirection(e3) {
            const t3 = this.el.querySelector("a.active");
            if (!t3) return true;
            const i3 = Array.from(this.links).indexOf(t3), s3 = Array.from(this.links).indexOf(e3);
            return -1 === s3 || s3 > i3;
          }
          linkClick(e3, t3) {
            e3.preventDefault();
            const i3 = t3.getAttribute("href");
            if (!i3 || "javascript:;" === i3) return;
            (i3 ? document.querySelector(i3) : null) && (this.isScrollingDown = this.determineScrollDirection(t3), this.scrollTo(t3));
          }
          update(e3, t3) {
            const i3 = parseInt((0, s2.gj)(this.el, "--scrollspy-offset", "0")), n3 = parseInt((0, s2.gj)(t3, "--scrollspy-offset")) || i3, o3 = e3.target === document ? 0 : parseInt(String(e3.target.getBoundingClientRect().top)), l3 = parseInt(String(t3.getBoundingClientRect().top)) - n3 - o3, a2 = t3.offsetHeight;
            if (this.ignoreScrollUp || this.isScrollingDown ? l3 <= 0 && l3 + a2 > 0 : l3 <= 0 && l3 < a2) {
              this.links.forEach((e5) => e5.classList.remove("active"));
              const e4 = this.el.querySelector(`[href="#${t3.getAttribute("id")}"]`);
              if (e4) {
                e4.classList.add("active");
                const t4 = e4.closest("[data-hs-scrollspy-group]");
                if (t4) {
                  const e5 = t4.querySelector("[href]");
                  e5 && e5.classList.add("active");
                }
              }
              this.fireEvent("afterScroll", e4), (0, s2.JD)("afterScroll.hs.scrollspy", e4, this.el);
            }
          }
          handlePopstate(e3) {
            const t3 = window.location.hash;
            if (!t3) return;
            const i3 = this.el.querySelector(`[href="${t3}"]`);
            if (!i3) return;
            const n3 = document.querySelector(t3);
            if (!n3) return;
            this.isScrollingDown = this.determineScrollDirection(i3);
            const o3 = parseInt((0, s2.gj)(this.el, "--scrollspy-offset", "0")), l3 = parseInt((0, s2.gj)(n3, "--scrollspy-offset")) || o3, a2 = this.scrollable === document ? 0 : this.scrollable.offsetTop, r2 = n3.offsetTop - l3 - a2, c2 = this.scrollable === document ? window : this.scrollable;
            "scrollTo" in c2 && c2.scrollTo({ top: r2, left: 0, behavior: "smooth" });
          }
          scrollTo(e3) {
            const t3 = e3.getAttribute("href"), i3 = document.querySelector(t3), n3 = parseInt((0, s2.gj)(this.el, "--scrollspy-offset", "0")), o3 = parseInt((0, s2.gj)(i3, "--scrollspy-offset")) || n3, l3 = this.scrollable === document ? 0 : this.scrollable.offsetTop, a2 = i3.offsetTop - o3 - l3, r2 = this.scrollable === document ? window : this.scrollable, c2 = () => {
              window.history.pushState(null, null, e3.getAttribute("href")), "scrollTo" in r2 && r2.scrollTo({ top: a2, left: 0, behavior: "smooth" });
            }, d2 = this.fireEvent("beforeScroll", this.el);
            (0, s2.JD)("beforeScroll.hs.scrollspy", this.el, this.el), d2 instanceof Promise ? d2.then(() => c2()) : c2();
          }
          destroy() {
            this.el.querySelector("[href].active").classList.remove("active"), this.scrollable.removeEventListener("scroll", this.onScrollableScrollListener), window.removeEventListener("popstate", this.onPopstateListener), this.onLinkClickListener.length && this.onLinkClickListener.forEach(({ el: e3, fn: t3 }) => {
              e3.removeEventListener("click", t3);
            }), window.$hsScrollspyCollection = window.$hsScrollspyCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3 = false) {
            const i3 = window.$hsScrollspyCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsScrollspyCollection || (window.$hsScrollspyCollection = []), window.$hsScrollspyCollection && (window.$hsScrollspyCollection = window.$hsScrollspyCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-scrollspy]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsScrollspyCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 4189(e2, t2, i2) {
        i2.d(t2, { A: () => c2 });
        var s2 = i2(1926), n2 = i2(7615), o2 = i2(8862), l2 = i2(189), a2 = function(e3, t3, i3, s3) {
          return new (i3 || (i3 = Promise))(function(n3, o3) {
            function l3(e4) {
              try {
                r3(s3.next(e4));
              } catch (e5) {
                o3(e5);
              }
            }
            function a3(e4) {
              try {
                r3(s3.throw(e4));
              } catch (e5) {
                o3(e5);
              }
            }
            function r3(e4) {
              var t4;
              e4.done ? n3(e4.value) : (t4 = e4.value, t4 instanceof i3 ? t4 : new i3(function(e5) {
                e5(t4);
              })).then(l3, a3);
            }
            r3((s3 = s3.apply(e3, t3 || [])).next());
          });
        };
        class r2 extends n2.A {
          constructor(e3, t3) {
            var i3, s3, n3, o3, l3;
            super(e3, t3), this.disabledObserver = null, this.remoteSearchAbortController = null, this.loadMoreAbortController = null, this.requestId = 0, this.lastQuery = "", this.isLoadEventFired = false, this.optionId = 0;
            const a3 = e3.getAttribute("data-hs-select"), r3 = a3 ? JSON.parse(a3) : {}, c3 = Object.assign(Object.assign({}, r3), t3);
            this.value = (null == c3 ? void 0 : c3.value) || this.el.value || null, this.placeholder = (null == c3 ? void 0 : c3.placeholder) || "Select...", this.hasSearch = (null == c3 ? void 0 : c3.hasSearch) || false, this.minSearchLength = null !== (i3 = null == c3 ? void 0 : c3.minSearchLength) && void 0 !== i3 ? i3 : 0, this.preventSearchFocus = (null == c3 ? void 0 : c3.preventSearchFocus) || false, this.preventSearchInsideDescription = (null == c3 ? void 0 : c3.preventSearchInsideDescription) || false, this.mode = (null == c3 ? void 0 : c3.mode) || "default", this.viewport = void 0 !== (null == c3 ? void 0 : c3.viewport) ? document.querySelector(null == c3 ? void 0 : c3.viewport) : null, this.scrollToSelected = void 0 !== (null == c3 ? void 0 : c3.scrollToSelected) && (null == c3 ? void 0 : c3.scrollToSelected), this._isOpened = Boolean(null == c3 ? void 0 : c3.isOpened) || false, this.isMultiple = this.el.hasAttribute("multiple") || false, this.isDisabled = this.el.hasAttribute("disabled") || false, this.selectedItems = [], this.apiUrl = (null == c3 ? void 0 : c3.apiUrl) || null, this.apiQuery = (null == c3 ? void 0 : c3.apiQuery) || null, this.apiOptions = (null == c3 ? void 0 : c3.apiOptions) || null, this.apiSearchQueryKey = (null == c3 ? void 0 : c3.apiSearchQueryKey) || null, this.apiDataPart = (null == c3 ? void 0 : c3.apiDataPart) || null, this.apiLoadMore = true === (null == c3 ? void 0 : c3.apiLoadMore) ? { perPage: 10, scrollThreshold: 100 } : "object" == typeof (null == c3 ? void 0 : c3.apiLoadMore) && null !== (null == c3 ? void 0 : c3.apiLoadMore) && { perPage: c3.apiLoadMore.perPage || 10, scrollThreshold: c3.apiLoadMore.scrollThreshold || 100 }, this.apiPageStart = "number" == typeof (null == c3 ? void 0 : c3.apiPageStart) ? c3.apiPageStart : void 0, this.apiTotalPath = "string" == typeof (null == c3 ? void 0 : c3.apiTotalPath) ? c3.apiTotalPath : null, this.apiFieldsMap = (null == c3 ? void 0 : c3.apiFieldsMap) || null, this.apiIconTag = (null == c3 ? void 0 : c3.apiIconTag) || null, this.apiSelectedValues = (null == c3 ? void 0 : c3.apiSelectedValues) || null, this.currentPage = 0, this.isLoading = false, this.hasMore = true, this.wrapperClasses = (null == c3 ? void 0 : c3.wrapperClasses) || null, this.toggleTag = (null == c3 ? void 0 : c3.toggleTag) || null, this.toggleClasses = (null == c3 ? void 0 : c3.toggleClasses) || null, this.toggleCountText = void 0 === typeof (null == c3 ? void 0 : c3.toggleCountText) ? null : c3.toggleCountText, this.toggleCountTextPlacement = (null == c3 ? void 0 : c3.toggleCountTextPlacement) || "postfix", this.toggleCountTextMinItems = (null == c3 ? void 0 : c3.toggleCountTextMinItems) || 1, this.toggleCountTextMode = (null == c3 ? void 0 : c3.toggleCountTextMode) || "countAfterLimit", this.toggleSeparators = { items: (null === (s3 = null == c3 ? void 0 : c3.toggleSeparators) || void 0 === s3 ? void 0 : s3.items) || ", ", betweenItemsAndCounter: (null === (n3 = null == c3 ? void 0 : c3.toggleSeparators) || void 0 === n3 ? void 0 : n3.betweenItemsAndCounter) || "and" }, this.tagsItemTemplate = (null == c3 ? void 0 : c3.tagsItemTemplate) || null, this.tagsItemClasses = (null == c3 ? void 0 : c3.tagsItemClasses) || null, this.tagsInputId = (null == c3 ? void 0 : c3.tagsInputId) || null, this.tagsInputClasses = (null == c3 ? void 0 : c3.tagsInputClasses) || null, this.dropdownTag = (null == c3 ? void 0 : c3.dropdownTag) || null, this.dropdownClasses = (null == c3 ? void 0 : c3.dropdownClasses) || null, this.dropdownDirectionClasses = (null == c3 ? void 0 : c3.dropdownDirectionClasses) || null, this.dropdownSpace = (null == c3 ? void 0 : c3.dropdownSpace) || 10, this.dropdownPlacement = (null == c3 ? void 0 : c3.dropdownPlacement) || null, this.dropdownVerticalFixedPlacement = (null == c3 ? void 0 : c3.dropdownVerticalFixedPlacement) || null, this.dropdownScope = (null == c3 ? void 0 : c3.dropdownScope) || "parent", this.dropdownAutoPlacement = (null == c3 ? void 0 : c3.dropdownAutoPlacement) || false, this.searchTemplate = (null == c3 ? void 0 : c3.searchTemplate) || null, this.searchWrapperTemplate = (null == c3 ? void 0 : c3.searchWrapperTemplate) || null, this.searchWrapperClasses = (null == c3 ? void 0 : c3.searchWrapperClasses) || "bg-white p-2 sticky top-0", this.searchId = (null == c3 ? void 0 : c3.searchId) || null, this.searchLimit = (null == c3 ? void 0 : c3.searchLimit) || 1 / 0, this.isSearchDirectMatch = void 0 === (null == c3 ? void 0 : c3.isSearchDirectMatch) || c3.isSearchDirectMatch, this.searchMatchMode = (null == c3 ? void 0 : c3.searchMatchMode) || (this.isSearchDirectMatch ? "substring" : "chars-sequence"), this.searchClasses = (null == c3 ? void 0 : c3.searchClasses) || "block w-[calc(100%-32px)] text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 py-2 px-3 my-2 mx-4", this.searchPlaceholder = (null == c3 ? void 0 : c3.searchPlaceholder) || "Search...", this.searchNoResultTemplate = (null == c3 ? void 0 : c3.searchNoResultTemplate) || "<span></span>", this.searchNoResultText = (null == c3 ? void 0 : c3.searchNoResultText) || "No results found", this.searchNoResultClasses = (null == c3 ? void 0 : c3.searchNoResultClasses) || "px-4 text-sm text-gray-800 dark:text-neutral-200", this.optionAllowEmptyOption = void 0 !== (null == c3 ? void 0 : c3.optionAllowEmptyOption) && (null == c3 ? void 0 : c3.optionAllowEmptyOption), this.optionTemplate = (null == c3 ? void 0 : c3.optionTemplate) || null, this.optionTag = (null == c3 ? void 0 : c3.optionTag) || null, this.optionClasses = (null == c3 ? void 0 : c3.optionClasses) || null, this.optgroupTag = (null == c3 ? void 0 : c3.optgroupTag) || null, this.optgroupClasses = (null == c3 ? void 0 : c3.optgroupClasses) || null, this.extraMarkup = (null == c3 ? void 0 : c3.extraMarkup) || null, this.descriptionClasses = (null == c3 ? void 0 : c3.descriptionClasses) || null, this.iconClasses = (null == c3 ? void 0 : c3.iconClasses) || null, this.isAddTagOnEnter = null === (o3 = null == c3 ? void 0 : c3.isAddTagOnEnter) || void 0 === o3 || o3, this.isSelectedOptionOnTop = null !== (l3 = null == c3 ? void 0 : c3.isSelectedOptionOnTop) && void 0 !== l3 && l3, this.animationInProcess = false, this.selectOptions = [], this.staticOptions = [], this.remoteOptions = [], this.tagsInputHelper = null, this.disabledObserver = new MutationObserver((e4) => {
              e4.some((e5) => "disabled" === e5.attributeName) && this.setDisabledState(this.el.hasAttribute("disabled"));
            }), this.disabledObserver.observe(this.el, { attributes: true, attributeFilter: ["disabled"] }), this.init();
          }
          wrapperClick(e3) {
            e3.target.closest("[data-hs-select-dropdown]") || e3.target.closest("[data-tag-value]") || this.tagsInput.focus();
          }
          toggleClick() {
            if (this.isDisabled) return false;
            this.toggleFn();
          }
          tagsInputFocus() {
            this._isOpened || this.open();
          }
          tagsInputInput() {
            this.calculateInputWidth();
          }
          tagsInputInputSecond(e3) {
            this.apiUrl || this.searchOptions(e3.target.value);
          }
          tagsInputKeydown(e3) {
            if ("Enter" === e3.key && this.isAddTagOnEnter) {
              const t3 = e3.target.value;
              if (this.selectOptions.find((e4) => e4.val === t3)) return false;
              this.addSelectOption(t3, t3), this.buildOption(t3, t3), this.buildOriginalOption(t3, t3), this.dropdown.querySelector(`[data-value="${t3}"]`).click(), this.resetTagsInputField();
            }
          }
          searchInput(e3) {
            const t3 = e3.target.value;
            this.lastQuery = t3, this.apiUrl ? this.remoteSearch(t3) : this.searchOptions(t3);
          }
          setValue(e3) {
            if (this.value = e3, this.clearSelections(), Array.isArray(e3)) if ("tags" === this.mode) {
              this.unselectMultipleItems(), this.selectMultipleItems(), this.selectedItems = [];
              this.wrapper.querySelectorAll("[data-tag-value]").forEach((e4) => e4.remove()), this.setTagsItems(), this.reassignTagsInputPlaceholder(this.hasValue() ? "" : this.placeholder);
            } else this.toggleTextWrapper.innerHTML = this.hasValue() ? this.stringFromValue() : this.placeholder, this.unselectMultipleItems(), this.selectMultipleItems();
            else this.setToggleTitle(), this.toggle.querySelector("[data-icon]") && this.setToggleIcon(), this.toggle.querySelector("[data-title]") && this.setToggleTitle(), this.selectSingleItem();
          }
          setDisabledState(e3) {
            this.isDisabled = e3;
            const t3 = "tags" === this.mode ? this.wrapper : this.toggle;
            null == t3 || t3.classList.toggle("disabled", e3), e3 && this.isOpened() && this.close();
          }
          hasValue() {
            return this.isMultiple ? Array.isArray(this.value) && this.value.length > 0 && this.value.some((e3) => null != e3 && "" !== e3) : null !== this.value && void 0 !== this.value && "" !== this.value;
          }
          init() {
            r2.ensureGlobalHandlers(), this.createCollection(window.$hsSelectCollection, this), this.build(), "undefined" != typeof window && (window.HSAccessibilityObserver || (window.HSAccessibilityObserver = new o2.A()), this.setupAccessibility());
          }
          build() {
            this.el.style.display = "none";
            if (this.el.querySelectorAll("option").length && this.setOptions(), this.optionAllowEmptyOption && !this.value && (this.value = ""), this.isMultiple) {
              const e3 = this.el.querySelectorAll("option"), t3 = Array.from(e3).filter((e4) => e4.selected), i3 = [];
              t3.forEach((e4) => {
                i3.push(e4.value);
              }), this.value = i3;
            }
            this.buildWrapper(), "tags" === this.mode ? this.buildTags() : this.buildToggle(), this.buildDropdown(), this.extraMarkup && this.buildExtraMarkup(), this.apiUrl || this.fireLoadEvent();
          }
          fireLoadEvent() {
            this.isLoadEventFired || (this.isLoadEventFired = true, setTimeout(() => {
              this.fireEvent("load", this.el), (0, s2.JD)("load.hs.select", this.el, this.el);
            }));
          }
          setOptions() {
            const e3 = this.el.querySelectorAll("option");
            Array.from(e3).filter((e4) => this.optionAllowEmptyOption || !this.optionAllowEmptyOption && e4.value && "" !== e4.value).forEach((e4) => {
              var t3;
              const i3 = e4.getAttribute("data-hs-select-option"), s3 = { title: e4.textContent, val: e4.value, disabled: e4.disabled, options: i3 && "undefined" !== i3 ? JSON.parse(i3) : null, optgroupName: "OPTGROUP" === (null === (t3 = e4.parentElement) || void 0 === t3 ? void 0 : t3.tagName) ? e4.parentElement.label : null };
              this.selectOptions = [...this.selectOptions, s3], this.apiUrl && (this.staticOptions = [...this.staticOptions, s3], e4.setAttribute("data-static", "true"));
            });
          }
          buildWrapper() {
            this.wrapper = document.createElement("div"), this.wrapper.classList.add("hs-select", "relative"), this.setDisabledState(this.isDisabled), "tags" === this.mode && (this.onWrapperClickListener = (e3) => this.wrapperClick(e3), this.wrapper.addEventListener("click", this.onWrapperClickListener)), this.wrapperClasses && (0, s2.en)(this.wrapperClasses, this.wrapper), this.el.before(this.wrapper), this.wrapper.append(this.el);
          }
          buildExtraMarkup() {
            const e3 = (e4) => {
              const t4 = (0, s2.fc)(e4);
              return this.wrapper.append(t4), t4;
            }, t3 = (e4) => {
              e4.classList.contains("--prevent-click") || e4.addEventListener("click", (e5) => {
                e5.stopPropagation(), this.isDisabled || this.toggleFn();
              });
            };
            if (Array.isArray(this.extraMarkup)) this.extraMarkup.forEach((i3) => {
              const s3 = e3(i3);
              t3(s3);
            });
            else {
              const i3 = e3(this.extraMarkup);
              t3(i3);
            }
          }
          buildToggle() {
            var e3, t3;
            let i3, n3;
            this.toggleTextWrapper = document.createElement("span"), this.toggleTextWrapper.classList.add("truncate"), this.toggle = (0, s2.fc)(this.toggleTag || "<div></div>"), i3 = this.toggle.querySelector("[data-icon]"), n3 = this.toggle.querySelector("[data-title]"), !this.isMultiple && i3 && this.setToggleIcon(), !this.isMultiple && n3 && this.setToggleTitle(), this.isMultiple ? this.toggleTextWrapper.innerHTML = this.hasValue() ? this.stringFromValue() : this.placeholder : this.toggleTextWrapper.innerHTML = (null === (e3 = this.getItemByValue(this.value)) || void 0 === e3 ? void 0 : e3.title) || this.placeholder, n3 || this.toggle.append(this.toggleTextWrapper), this.toggleClasses && (0, s2.en)(this.toggleClasses, this.toggle), this.isDisabled && this.toggle.classList.add("disabled"), this.wrapper && this.wrapper.append(this.toggle), (null === (t3 = this.toggle) || void 0 === t3 ? void 0 : t3.ariaExpanded) && (this._isOpened ? this.toggle.ariaExpanded = "true" : this.toggle.ariaExpanded = "false"), this.onToggleClickListener = () => this.toggleClick(), this.toggle.addEventListener("click", this.onToggleClickListener);
          }
          setToggleIcon() {
            var e3, t3, i3, n3;
            const o3 = this.getItemByValue(this.value), l3 = this.toggle.querySelector("[data-icon]");
            if (l3) {
              l3.innerHTML = "";
              const a3 = null === (t3 = null === (e3 = null == o3 ? void 0 : o3.options) || void 0 === e3 ? void 0 : e3.apiFields) || void 0 === t3 ? void 0 : t3.icon, r3 = null == o3 ? void 0 : o3[null === (i3 = this.apiFieldsMap) || void 0 === i3 ? void 0 : i3.icon], c3 = null === (n3 = null == o3 ? void 0 : o3.options) || void 0 === n3 ? void 0 : n3.icon, d2 = (0, s2.fc)((this.apiUrl || a3) && this.apiIconTag ? this.apiIconTag || "" : c3 || "");
              this.value && (a3 ? d2.src = a3 : this.apiUrl && this.apiIconTag && r3 ? d2.src = r3 : c3 && "string" == typeof c3 && !c3.trim().startsWith("<") && (d2.src = c3)), l3.append(d2), (d2 instanceof HTMLImageElement ? d2.src : d2) ? l3.classList.remove("hidden") : l3.classList.add("hidden");
            }
          }
          setToggleTitle() {
            const e3 = this.toggle.querySelector("[data-title]");
            let t3 = this.placeholder;
            if (this.optionAllowEmptyOption && "" === this.value) {
              const e4 = this.selectOptions.find((e5) => "" === e5.val);
              t3 = (null == e4 ? void 0 : e4.title) || this.placeholder;
            } else if (this.value) if (this.apiUrl) {
              const e4 = this.staticOptions.find((e5) => e5.val === this.value);
              if (e4) t3 = e4.title;
              else {
                const e5 = this.remoteOptions.find((e6) => `${e6[this.apiFieldsMap.val]}` === this.value || `${e6[this.apiFieldsMap.title]}` === this.value);
                e5 && (t3 = e5[this.apiFieldsMap.title]);
              }
            } else {
              const e4 = this.selectOptions.find((e5) => e5.val === this.value);
              e4 && (t3 = e4.title);
            }
            e3 ? (e3.innerHTML = t3, e3.classList.add("truncate"), this.toggle.append(e3)) : this.toggleTextWrapper.innerHTML = t3;
          }
          buildTags() {
            this.isDisabled && this.wrapper.classList.add("disabled"), this.wrapper.setAttribute("tabindex", "0"), this.buildTagsInput(), this.setTagsItems();
          }
          reassignTagsInputPlaceholder(e3) {
            this.tagsInput.placeholder = e3, this.tagsInputHelper.innerHTML = e3, this.calculateInputWidth();
          }
          buildTagsItem(e3) {
            var t3, i3, n3, o3, l3, a3, r3, c3;
            const d2 = this.getItemByValue(e3);
            let h2, u2, p2, m2;
            const g2 = document.createElement("div");
            if (g2.setAttribute("data-tag-value", e3), this.tagsItemClasses && (0, s2.en)(this.tagsItemClasses, g2), this.tagsItemTemplate && (h2 = (0, s2.fc)(this.tagsItemTemplate), g2.append(h2)), (null === (t3 = null == d2 ? void 0 : d2.options) || void 0 === t3 ? void 0 : t3.icon) || this.apiIconTag) {
              const e4 = (0, s2.fc)(this.apiUrl && this.apiIconTag ? this.apiIconTag : null === (i3 = null == d2 ? void 0 : d2.options) || void 0 === i3 ? void 0 : i3.icon);
              if (this.apiUrl && this.apiIconTag) {
                const t4 = d2[this.apiFieldsMap.icon] || (null === (o3 = null === (n3 = null == d2 ? void 0 : d2.options) || void 0 === n3 ? void 0 : n3.apiFields) || void 0 === o3 ? void 0 : o3.icon) || (null === (l3 = null == d2 ? void 0 : d2.options) || void 0 === l3 ? void 0 : l3.icon) || "";
                t4 && (e4.src = t4);
              }
              m2 = h2 ? h2.querySelector("[data-icon]") : document.createElement("span"), m2.append(e4), h2 || g2.append(m2);
            }
            !h2 || !h2.querySelector("[data-icon]") || (null === (a3 = null == d2 ? void 0 : d2.options) || void 0 === a3 ? void 0 : a3.icon) || this.apiUrl || this.apiIconTag || d2[null === (r3 = this.apiFieldsMap) || void 0 === r3 ? void 0 : r3.icon] || h2.querySelector("[data-icon]").classList.add("hidden"), u2 = h2 ? h2.querySelector("[data-title]") : document.createElement("span"), this.apiUrl && (null === (c3 = this.apiFieldsMap) || void 0 === c3 ? void 0 : c3.title) && d2[this.apiFieldsMap.title] ? u2.textContent = d2[this.apiFieldsMap.title] : u2.textContent = d2.title || "", h2 || g2.append(u2), h2 ? p2 = h2.querySelector("[data-remove]") : (p2 = document.createElement("span"), p2.textContent = "X", g2.append(p2)), p2.addEventListener("click", () => {
              this.value = this.value.filter((t4) => t4 !== e3), this.selectedItems = this.selectedItems.filter((t4) => t4 !== e3), this.hasValue() || this.reassignTagsInputPlaceholder(this.placeholder), this.unselectMultipleItems(), this.selectMultipleItems(), g2.remove(), this.triggerChangeEventForNativeSelect();
            }), this.wrapper.append(g2);
          }
          getItemByValue(e3) {
            if (this.apiUrl) {
              const t3 = this.staticOptions.find((t4) => t4.val === e3);
              return t3 || this.remoteOptions.find((t4) => `${t4[this.apiFieldsMap.val]}` === e3 || t4[this.apiFieldsMap.title] === e3);
            }
            return this.selectOptions.find((t3) => t3.val === e3);
          }
          setTagsItems() {
            if (this.value) {
              (Array.isArray(this.value) ? this.value : null != this.value ? [this.value] : []).forEach((e3) => {
                this.selectedItems.includes(e3) || this.buildTagsItem(e3), this.selectedItems = this.selectedItems.includes(e3) ? this.selectedItems : [...this.selectedItems, e3];
              });
            }
            this._isOpened && this.floatingUIInstance && this.floatingUIInstance.update();
          }
          buildTagsInput() {
            this.tagsInput = document.createElement("input"), this.tagsInputId && (this.tagsInput.id = this.tagsInputId), this.tagsInputClasses && (0, s2.en)(this.tagsInputClasses, this.tagsInput), this.tagsInput.setAttribute("tabindex", "-1"), this.onTagsInputFocusListener = () => this.tagsInputFocus(), this.onTagsInputInputListener = () => this.tagsInputInput(), this.onTagsInputInputSecondListener = (0, s2.sg)((e3) => this.tagsInputInputSecond(e3)), this.onTagsInputKeydownListener = (e3) => this.tagsInputKeydown(e3), this.tagsInput.addEventListener("focus", this.onTagsInputFocusListener), this.tagsInput.addEventListener("input", this.onTagsInputInputListener), this.tagsInput.addEventListener("input", this.onTagsInputInputSecondListener), this.tagsInput.addEventListener("keydown", this.onTagsInputKeydownListener), this.wrapper.append(this.tagsInput), setTimeout(() => {
              this.adjustInputWidth(), this.reassignTagsInputPlaceholder(this.hasValue() ? "" : this.placeholder);
            });
          }
          buildDropdown() {
            if (this.dropdown = (0, s2.fc)(this.dropdownTag || "<div></div>"), this.dropdown.setAttribute("data-hs-select-dropdown", ""), "parent" === this.dropdownScope && (this.dropdown.classList.add("absolute"), this.dropdownVerticalFixedPlacement || this.dropdown.classList.add("top-full")), this.dropdown.role = "listbox", this.dropdown.tabIndex = -1, this.dropdown.ariaOrientation = "vertical", this._isOpened || this.dropdown.classList.add("hidden"), this.dropdownClasses && (0, s2.en)(this.dropdownClasses, this.dropdown), this.wrapper && this.wrapper.append(this.dropdown), this.dropdown && this.hasSearch && this.buildSearch(), this.selectOptions) {
              let e3 = "";
              this.selectOptions.forEach((t3, i3) => {
                t3.optgroupName && t3.optgroupName !== e3 && (this.hasOptgroup = true, e3 = t3.optgroupName, this.buildOptgroup(e3)), this.buildOption(t3.title, t3.val, t3.disabled, t3.selected, t3.options, `${i3}`, void 0, !!this.apiUrl);
              }), e3 = "";
            }
            this.apiUrl && this.optionsFromRemoteData().then(() => this.fireLoadEvent()), this.apiUrl || (this.sortElements(this.el, "option"), this.sortElements(this.dropdown, "[data-value]")), "window" === this.dropdownScope && this.buildFloatingUI(), this.dropdown && this.apiLoadMore && this.setupInfiniteScroll();
          }
          buildOptgroup(e3) {
            const t3 = (0, s2.fc)(this.optgroupTag || "<div></div>");
            t3.textContent = e3, t3.setAttribute("data-optgroup", ""), this.optgroupClasses && (0, s2.en)(this.optgroupClasses, t3), this.dropdown.append(t3);
          }
          setupInfiniteScroll() {
            this.dropdown.addEventListener("scroll", this.handleScroll.bind(this));
          }
          handleScroll() {
            return a2(this, void 0, void 0, function* () {
              if (!this.dropdown || this.isLoading || !this.hasMore || !this.apiLoadMore) return;
              const { scrollTop: e3, scrollHeight: t3, clientHeight: i3 } = this.dropdown;
              t3 - e3 - i3 < ("object" == typeof this.apiLoadMore ? this.apiLoadMore.scrollThreshold : 100) && (yield this.loadMore());
            });
          }
          loadMore() {
            return a2(this, void 0, void 0, function* () {
              var e3, t3, i3, s3, n3, o3, l3, a3, r3, c3, d2, h2;
              if (!this.apiUrl || this.isLoading || !this.hasMore || !this.apiLoadMore) return;
              const u2 = this.requestId;
              this.isLoading = true;
              try {
                const p2 = new URL(this.apiUrl), m2 = (null !== (e3 = this.lastQuery) && void 0 !== e3 ? e3 : "").trim().toLowerCase(), g2 = new URLSearchParams(null !== (t3 = this.apiQuery) && void 0 !== t3 ? t3 : ""), v2 = null !== (i3 = this.apiSearchQueryKey) && void 0 !== i3 ? i3 : "q";
                "" !== m2 && g2.set(v2, m2), p2.search = g2.toString();
                const f2 = (null === (s3 = this.apiFieldsMap) || void 0 === s3 ? void 0 : s3.page) || (null === (n3 = this.apiFieldsMap) || void 0 === n3 ? void 0 : n3.offset) || "page", y2 = !!(null === (o3 = this.apiFieldsMap) || void 0 === o3 ? void 0 : o3.offset), b2 = "object" == typeof this.apiLoadMore ? this.apiLoadMore.perPage : 10, w2 = this.currentPage + 1;
                if (y2) {
                  const e4 = this.currentPage * b2;
                  p2.searchParams.set(f2, String(e4));
                } else p2.searchParams.set(f2, String(w2));
                if (p2.searchParams.set((null === (l3 = this.apiFieldsMap) || void 0 === l3 ? void 0 : l3.limit) || "limit", String(b2)), this.loadMoreAbortController) try {
                  this.loadMoreAbortController.abort();
                } catch (e4) {
                }
                this.loadMoreAbortController = new AbortController();
                const C2 = Object.assign(Object.assign({}, this.apiOptions || {}), { signal: this.loadMoreAbortController.signal }), x2 = yield fetch(p2.toString(), C2), S2 = yield x2.json();
                if (u2 !== this.requestId) return void (this.isLoading = false);
                const k2 = this.apiDataPart ? null !== (r3 = null !== (a3 = S2[this.apiDataPart]) && void 0 !== a3 ? a3 : S2.results) && void 0 !== r3 ? r3 : S2 : null !== (c3 = S2.results) && void 0 !== c3 ? c3 : S2, L2 = (e4, t4) => t4.split(".").reduce((e5, t5) => e5 ? e5[t5] : void 0, e4);
                let E2 = null;
                if (this.apiTotalPath) {
                  const e4 = L2(S2, this.apiTotalPath);
                  E2 = "number" == typeof e4 ? e4 : null;
                } else E2 = null !== (h2 = null !== (d2 = "number" == typeof S2.count ? S2.count : null) && void 0 !== d2 ? d2 : "number" == typeof S2.total ? S2.total : null) && void 0 !== h2 ? h2 : S2.info && "number" == typeof S2.info.count ? S2.info.count : null;
                if (k2 && k2.length > 0) {
                  if (this.remoteOptions = [...this.remoteOptions || [], ...k2], this.buildOptionsFromRemoteData(k2), "number" == typeof E2) {
                    const e4 = w2 * b2;
                    this.hasMore = e4 < E2;
                  } else this.hasMore = k2.length === b2;
                  this.currentPage = w2;
                } else this.hasMore = false;
              } catch (e4) {
                this.hasMore = false, console.error("Error loading more options:", e4);
              } finally {
                this.isLoading = false;
              }
            });
          }
          buildFloatingUI() {
            if ("undefined" != typeof FloatingUIDOM && FloatingUIDOM.computePosition) {
              document.body.appendChild(this.dropdown);
              const e3 = "tags" === this.mode ? this.wrapper : this.toggle, t3 = [FloatingUIDOM.offset([0, 5])];
              this.dropdownAutoPlacement && "function" == typeof FloatingUIDOM.flip && t3.push(FloatingUIDOM.flip({ fallbackPlacements: ["bottom-start", "bottom-end", "top-start", "top-end"] }));
              const i3 = { placement: l2.lP[this.dropdownPlacement] || "bottom", strategy: "fixed", middleware: t3 }, s3 = () => {
                Object.assign(this.dropdown.style, { marginLeft: "", marginTop: "", marginRight: "", marginBottom: "" }), FloatingUIDOM.computePosition(e3, this.dropdown, i3).then(({ x: e4, y: t4, placement: i4 }) => {
                  Object.assign(this.dropdown.style, { position: "fixed", left: `${e4}px`, top: `${t4}px`, ["margin" + (i4.startsWith("bottom") || i4.startsWith("top") ? "Top" : i4.startsWith("right") ? "Left" : "Right")]: `${i4.startsWith("top") ? "-" : ""}${this.dropdownSpace}px` }), this.dropdown.setAttribute("data-placement", i4);
                });
              };
              s3();
              const n3 = FloatingUIDOM.autoUpdate(e3, this.dropdown, s3);
              this.floatingUIInstance = { update: s3, destroy: n3 };
            } else console.error("FloatingUIDOM not found! Please enable it on the page.");
          }
          updateDropdownWidth() {
            const e3 = "tags" === this.mode ? this.wrapper : this.toggle;
            this.dropdown.style.width = `${e3.clientWidth}px`;
          }
          buildSearch() {
            var e3, t3, i3;
            if (!this.hasSearch) return;
            if ("tags" === this.mode) {
              const n4 = null !== (i3 = null !== (e3 = this.tagsInput) && void 0 !== e3 ? e3 : null === (t3 = this.wrapper) || void 0 === t3 ? void 0 : t3.querySelector(":scope input")) && void 0 !== i3 ? i3 : this.el.querySelector(":scope input");
              return n4 ? (this.search = n4, this.searchPlaceholder && (this.search.placeholder = this.searchPlaceholder), this.searchId && (this.search.id = this.searchId), this.searchClasses && (0, s2.en)(this.searchClasses, this.search), void (this.apiUrl && (this.onSearchInputListener = (0, s2.sg)((e4) => this.searchInput(e4)), this.search.addEventListener("input", this.onSearchInputListener)))) : void 0;
            }
            let n3;
            this.searchWrapper = (0, s2.fc)(this.searchWrapperTemplate || "<div></div>"), this.searchWrapperClasses && (0, s2.en)(this.searchWrapperClasses, this.searchWrapper), n3 = this.searchWrapper.querySelector("[data-input]");
            const o3 = (0, s2.fc)(this.searchTemplate || '<input type="text">');
            this.search = "INPUT" === o3.tagName ? o3 : o3.querySelector(":scope input"), this.search.placeholder = this.searchPlaceholder, this.searchClasses && (0, s2.en)(this.searchClasses, this.search), this.searchId && (this.search.id = this.searchId), this.onSearchInputListener = (0, s2.sg)((e4) => this.searchInput(e4)), this.search.addEventListener("input", this.onSearchInputListener), n3 ? n3.append(o3) : this.searchWrapper.append(o3), this.dropdown.append(this.searchWrapper);
          }
          buildOption(e3, t3, i3 = false, n3 = false, o3, l3 = "1", a3, r3 = false) {
            var c3, d2, h2, u2, p2;
            let m2 = null, g2 = null, v2 = null, f2 = null;
            const y2 = (0, s2.fc)(this.optionTag || "<div></div>");
            if (y2.setAttribute("data-value", t3), y2.setAttribute("data-title-value", e3), y2.setAttribute("tabIndex", l3), y2.classList.add("cursor-pointer"), y2.setAttribute("data-id", a3 || `${this.optionId}`), r3 && y2.setAttribute("data-static", "true"), a3 || this.optionId++, i3 && y2.classList.add("disabled"), n3 && (this.isMultiple ? this.value = [...this.value, t3] : this.value = t3), this.optionTemplate && (m2 = (0, s2.fc)(this.optionTemplate), y2.append(m2)), m2 ? (g2 = m2.querySelector("[data-title]"), g2.textContent = e3 || "") : y2.textContent = e3 || "", o3) {
              const t4 = null !== (d2 = null === (c3 = o3.apiFields) || void 0 === c3 ? void 0 : c3.icon) && void 0 !== d2 ? d2 : o3.icon, i4 = null !== (u2 = null === (h2 = o3.apiFields) || void 0 === h2 ? void 0 : h2.description) && void 0 !== u2 ? u2 : o3.description;
              if (t4) {
                const i5 = (0, s2.fc)(null !== (p2 = this.apiIconTag) && void 0 !== p2 ? p2 : t4);
                if (i5.classList.add("max-w-full"), (this.apiUrl || o3.apiFields) && (i5.setAttribute("alt", e3), i5.setAttribute("src", t4)), m2) v2 = m2.querySelector("[data-icon]"), v2.append(i5);
                else {
                  const e4 = (0, s2.fc)("<div></div>");
                  this.iconClasses && (0, s2.en)(this.iconClasses, e4), e4.append(i5), y2.append(e4);
                }
              }
              if (Array.isArray(o3.additionalClasses) && o3.additionalClasses.forEach(([e4, t5]) => {
                const i5 = e4 ? y2.querySelector(e4) : y2;
                i5 && t5.forEach((e5) => i5.classList.add(e5));
              }), i4) if (y2.dataset.description = i4, m2) f2 = m2.querySelector("[data-description]"), f2 && f2.append(i4);
              else {
                const e4 = (0, s2.fc)("<div></div>");
                e4.textContent = i4, this.descriptionClasses && (0, s2.en)(this.descriptionClasses, e4), y2.append(e4);
              }
            }
            m2 && m2.querySelector("[data-icon]") && !o3 && !(null == o3 ? void 0 : o3.icon) && m2.querySelector("[data-icon]").classList.add("hidden"), this.value && (this.isMultiple ? this.value.includes(t3) : this.value === t3) && y2.classList.add("selected"), i3 || y2.addEventListener("click", () => this.onSelectOption(t3)), this.optionClasses && (0, s2.en)(this.optionClasses, y2), this.dropdown && this.dropdown.append(y2), n3 && this.setNewValue();
          }
          buildOptionFromRemoteData(e3, t3, i3 = false, s3 = false, n3 = "1", o3, l3) {
            n3 ? this.buildOption(e3, t3, i3, s3, l3, n3, o3) : alert("ID parameter is required for generating remote options! Please check your API endpoint have it.");
          }
          buildOptionsFromRemoteData(e3) {
            e3.forEach((e4, t3) => {
              let i3 = null, s3 = "", n3 = "";
              const o3 = { id: "", val: "", title: "", icon: null, description: null, rest: {} };
              Object.keys(e4).forEach((t4) => {
                var l4;
                e4[this.apiFieldsMap.id] && (i3 = e4[this.apiFieldsMap.id], o3.id = `${i3}`), e4[this.apiFieldsMap.val] && (n3 = `${e4[this.apiFieldsMap.val]}`, o3.val = n3), e4[this.apiFieldsMap.title] && (s3 = e4[this.apiFieldsMap.title], o3.title = s3, e4[this.apiFieldsMap.val] || (n3 = s3, o3.val = n3)), e4[this.apiFieldsMap.icon] && (o3.icon = e4[this.apiFieldsMap.icon]), e4[null === (l4 = this.apiFieldsMap) || void 0 === l4 ? void 0 : l4.description] && (o3.description = e4[this.apiFieldsMap.description]), o3.rest[t4] = e4[t4];
              });
              const l3 = this.staticOptions.findIndex((e5) => e5.val === n3);
              if (-1 !== l3) return void this.mergeRemoteDataIntoStaticOption(l3, n3, o3, t3);
              if (!this.dropdown.querySelector(`[data-value="${n3}"]`)) {
                const e5 = !!this.apiSelectedValues && (Array.isArray(this.apiSelectedValues) ? this.apiSelectedValues.includes(n3) : this.apiSelectedValues === n3);
                this.buildOriginalOption(s3, n3, i3, false, e5, o3), this.buildOptionFromRemoteData(s3, n3, false, e5, `${t3}`, i3, o3), e5 && (this.isMultiple ? (this.value || (this.value = []), Array.isArray(this.value) && (this.value = [...this.value, n3])) : this.value = n3, this.toggle && (this.toggle.querySelector("[data-title]") && this.setToggleTitle(), this.toggle.querySelector("[data-icon]") && this.setToggleIcon()));
              }
            }), this.sortElements(this.el, "option"), this.sortElements(this.dropdown, "[data-value]");
          }
          mergeRemoteDataIntoStaticOption(e3, t3, i3, n3) {
            const o3 = this.staticOptions[e3];
            o3.options || (o3.options = {}), o3.options.apiFields || (o3.options.apiFields = {}), i3.title && (o3.title = i3.title), i3.icon && (o3.options.apiFields.icon = i3.icon), i3.description && (o3.options.apiFields.description = i3.description), Object.keys(i3.rest).forEach((e4) => {
              o3.options.apiFields[e4] = i3.rest[e4];
            });
            const l3 = this.dropdown.querySelector(`[data-value="${t3}"][data-static]`);
            if (l3) {
              if (l3.setAttribute("tabIndex", `${n3}`), i3.id && l3.setAttribute("data-id", `${i3.id}`), i3.title) {
                l3.setAttribute("data-title-value", i3.title);
                const e4 = l3.querySelector("[data-title]");
                e4 && (e4.textContent = i3.title);
              }
              if (i3.icon) {
                const e4 = l3.querySelector("[data-icon]");
                if (e4) {
                  e4.innerHTML = "";
                  const t4 = (0, s2.fc)(this.apiIconTag || "<img />");
                  t4.classList.add("max-w-full"), t4.setAttribute("alt", o3.title), t4.setAttribute("src", i3.icon), e4.append(t4);
                }
              }
              if (i3.description) {
                l3.dataset.description = i3.description;
                const e4 = l3.querySelector("[data-description]");
                e4 && (e4.textContent = i3.description);
              }
            }
            const a3 = this.el.querySelector(`option[value="${t3}"][data-static]`);
            if (a3) {
              i3.id && a3.setAttribute("data-id", `${i3.id}`), i3.title && (a3.textContent = i3.title);
              const e4 = { id: i3.id || "", val: i3.val || "", title: i3.title || "", icon: i3.icon || null, description: i3.description || null, rest: i3.rest };
              a3.setAttribute("data-hs-select-option", JSON.stringify(e4));
            }
            const r3 = this.selectOptions.findIndex((e4) => e4.val === t3);
            -1 !== r3 && (this.selectOptions[r3] = o3);
            (this.isMultiple ? Array.isArray(this.value) && this.value.includes(t3) : this.value === t3) && this.toggle && (i3.title && (this.toggle.querySelector("[data-title]") ? this.setToggleTitle() : this.toggleTextWrapper && (this.isMultiple ? this.toggleTextWrapper.innerHTML = this.stringFromValue() : this.toggleTextWrapper.innerHTML = i3.title)), i3.icon && this.toggle.querySelector("[data-icon]") && this.setToggleIcon());
          }
          optionsFromRemoteData() {
            return a2(this, arguments, void 0, function* (e3 = "") {
              const t3 = (yield this.apiRequest(e3)) || [];
              this.remoteOptions = t3, t3.length ? this.buildOptionsFromRemoteData(this.remoteOptions) : console.log("There is no data were responded!");
            });
          }
          apiRequest() {
            return a2(this, arguments, void 0, function* (e3 = "", t3) {
              var i3, s3, n3, o3, l3, a3, r3, c3, d2, h2;
              try {
                const u2 = new URL(this.apiUrl), p2 = new URLSearchParams(null !== (i3 = this.apiQuery) && void 0 !== i3 ? i3 : ""), m2 = null !== (s3 = this.apiOptions) && void 0 !== s3 ? s3 : {}, g2 = Object.assign({}, m2);
                t3 && (g2.signal = t3);
                const v2 = null !== (n3 = this.apiSearchQueryKey) && void 0 !== n3 ? n3 : "q", f2 = (null != e3 ? e3 : "").trim().toLowerCase();
                if ("" !== f2 && p2.set(v2, f2), this.apiLoadMore) {
                  const e4 = "object" == typeof this.apiLoadMore ? this.apiLoadMore.perPage : 10, t4 = null !== (r3 = null !== (l3 = null === (o3 = this.apiFieldsMap) || void 0 === o3 ? void 0 : o3.page) && void 0 !== l3 ? l3 : null === (a3 = this.apiFieldsMap) || void 0 === a3 ? void 0 : a3.offset) && void 0 !== r3 ? r3 : "page", i4 = null !== (d2 = null === (c3 = this.apiFieldsMap) || void 0 === c3 ? void 0 : c3.limit) && void 0 !== d2 ? d2 : "limit", s4 = Boolean(null === (h2 = this.apiFieldsMap) || void 0 === h2 ? void 0 : h2.offset) ? 0 : 1, n4 = "number" == typeof this.apiPageStart ? this.apiPageStart : s4;
                  p2.delete(t4), p2.delete(i4), p2.set(t4, String(n4)), p2.set(i4, String(e4));
                }
                u2.search = p2.toString();
                const y2 = yield fetch(u2.toString(), g2), b2 = yield y2.json();
                return this.apiDataPart ? b2[this.apiDataPart] : b2;
              } catch (e4) {
                console.error(e4);
              }
            });
          }
          sortElements(e3, t3) {
            if (this.hasOptgroup) return;
            const i3 = Array.from(e3.querySelectorAll(t3));
            this.isSelectedOptionOnTop && i3.sort((e4, t4) => {
              const i4 = e4.classList.contains("selected") || e4.hasAttribute("selected"), s3 = t4.classList.contains("selected") || t4.hasAttribute("selected");
              return i4 && !s3 ? -1 : !i4 && s3 ? 1 : 0;
            }), i3.forEach((t4, i4) => {
              e3.appendChild(t4), t4.hasAttribute("tabindex") && t4.setAttribute("tabIndex", `${i4}`);
            });
          }
          remoteSearch(e3) {
            return a2(this, void 0, void 0, function* () {
              var t3, i3, s3, n3;
              if (this.requestId++, this.remoteSearchAbortController) try {
                this.remoteSearchAbortController.abort();
              } catch (e4) {
              }
              if (this.loadMoreAbortController) try {
                this.loadMoreAbortController.abort();
              } catch (e4) {
              }
              if (this.remoteSearchAbortController = new AbortController(), this.currentPage = 0, this.hasMore = true, this.isLoading = false, this.filterStaticOptions(e3), e3.length <= this.minSearchLength) {
                const e4 = yield this.apiRequest("", null === (t3 = this.remoteSearchAbortController) || void 0 === t3 ? void 0 : t3.signal);
                if (!e4) return false;
                const s4 = Boolean(null === (i3 = this.apiFieldsMap) || void 0 === i3 ? void 0 : i3.offset) ? 0 : 1, n4 = "number" == typeof this.apiPageStart ? this.apiPageStart : s4;
                this.currentPage = n4;
                const o4 = Array.isArray(this.value) ? this.value : this.value ? [this.value] : [], l4 = this.remoteOptions.filter((e5) => {
                  var t4;
                  return o4.includes(`${e5[null === (t4 = this.apiFieldsMap) || void 0 === t4 ? void 0 : t4.val]}`);
                }), a4 = new Set(e4.map((e5) => {
                  var t4;
                  return `${e5[null === (t4 = this.apiFieldsMap) || void 0 === t4 ? void 0 : t4.val]}`;
                }));
                return this.remoteOptions = [...e4, ...l4.filter((e5) => {
                  var t4;
                  return !a4.has(`${e5[null === (t4 = this.apiFieldsMap) || void 0 === t4 ? void 0 : t4.val]}`);
                })], Array.from(this.dropdown.querySelectorAll("[data-value]:not([data-static])")).forEach((e5) => {
                  o4.includes(e5.getAttribute("data-value")) || e5.remove();
                }), Array.from(this.el.querySelectorAll("option[value][data-hs-select-option]:not([data-static])")).forEach((e5) => {
                  o4.includes(e5.value) || e5.remove();
                }), e4.length ? this.buildOptionsFromRemoteData(e4) : console.log("No data responded!"), false;
              }
              const o3 = yield this.apiRequest(e3, null === (s3 = this.remoteSearchAbortController) || void 0 === s3 ? void 0 : s3.signal);
              if (!o3) return;
              const l3 = Boolean(null === (n3 = this.apiFieldsMap) || void 0 === n3 ? void 0 : n3.offset) ? 0 : 1, a3 = "number" == typeof this.apiPageStart ? this.apiPageStart : l3;
              this.currentPage = a3;
              const r3 = Array.isArray(this.value) ? this.value : this.value ? [this.value] : [], c3 = this.remoteOptions.filter((e4) => {
                var t4;
                return r3.includes(`${e4[null === (t4 = this.apiFieldsMap) || void 0 === t4 ? void 0 : t4.val]}`);
              }), d2 = new Set(o3.map((e4) => {
                var t4;
                return `${e4[null === (t4 = this.apiFieldsMap) || void 0 === t4 ? void 0 : t4.val]}`;
              }));
              this.remoteOptions = [...o3, ...c3.filter((e4) => {
                var t4;
                return !d2.has(`${e4[null === (t4 = this.apiFieldsMap) || void 0 === t4 ? void 0 : t4.val]}`);
              })];
              let h2 = o3.map((e4) => `${e4.id}`), u2 = null;
              const p2 = this.dropdown.querySelectorAll("[data-value]:not([data-static])");
              this.el.querySelectorAll("[data-hs-select-option]:not([data-static])").forEach((e4) => {
                var t4;
                const i4 = e4.getAttribute("data-id");
                h2.includes(i4) || (null === (t4 = this.value) || void 0 === t4 ? void 0 : t4.includes(e4.value)) || this.destroyOriginalOption(e4.value);
              }), p2.forEach((e4) => {
                var t4;
                const i4 = e4.getAttribute("data-id");
                h2.includes(i4) || (null === (t4 = this.value) || void 0 === t4 ? void 0 : t4.includes(e4.getAttribute("data-value"))) ? h2 = h2.filter((e5) => e5 !== i4) : this.destroyOption(e4.getAttribute("data-value"));
              }), u2 = o3.filter((e4) => h2.includes(`${e4.id}`)), u2.length ? this.buildOptionsFromRemoteData(u2) : console.log("No data responded!");
            });
          }
          filterStaticOptions(e3) {
            const t3 = this.dropdown.querySelectorAll("[data-value][data-static]"), i3 = e3.trim().toLowerCase();
            t3.forEach((e4) => {
              var t4, s3;
              if (i3.length <= this.minSearchLength) e4.classList.remove("hidden");
              else {
                const n3 = (null === (t4 = e4.getAttribute("data-title-value")) || void 0 === t4 ? void 0 : t4.toLowerCase()) || "", o3 = (null === (s3 = e4.dataset.description) || void 0 === s3 ? void 0 : s3.toLowerCase()) || "";
                this.optionMatchesQuery(i3, n3, o3) ? e4.classList.remove("hidden") : e4.classList.add("hidden");
              }
            });
          }
          normalizeSearchText(e3 = "") {
            return e3.toLocaleLowerCase().replace(/\s+/g, " ").trim();
          }
          tokenizeSearchQuery(e3) {
            return this.normalizeSearchText(e3).split(" ").filter(Boolean);
          }
          charsSequenceMatch(e3, t3) {
            const i3 = e3.split("").map((e4) => /\w/.test(e4) ? `${e4}[\\W_]*` : "\\W*").join("");
            return new RegExp(i3, "i").test(t3);
          }
          optionMatchesQuery(e3, t3, i3 = "") {
            const s3 = this.normalizeSearchText(e3);
            if (!s3) return true;
            const n3 = this.normalizeSearchText(t3), o3 = this.normalizeSearchText(i3), l3 = this.preventSearchInsideDescription ? [n3] : [n3, o3];
            if ("token-all" === this.searchMatchMode) {
              const e4 = this.tokenizeSearchQuery(s3);
              return l3.some((t4) => e4.every((e5) => t4.includes(e5)));
            }
            if ("hybrid" === this.searchMatchMode) {
              const e4 = this.tokenizeSearchQuery(s3);
              return l3.some((t4) => {
                const i4 = e4.every((e5) => t4.includes(e5)), n4 = this.charsSequenceMatch(s3, t4);
                return i4 || n4;
              });
            }
            return "chars-sequence" === this.searchMatchMode ? l3.some((e4) => this.charsSequenceMatch(s3, e4)) : l3.some((e4) => e4.includes(s3));
          }
          destroyOption(e3) {
            const t3 = this.dropdown.querySelector(`[data-value="${e3}"]`);
            if (!t3) return false;
            t3.remove();
          }
          buildOriginalOption(e3, t3, i3, n3, o3, l3) {
            const a3 = (0, s2.fc)("<option></option>");
            a3.setAttribute("value", t3), n3 && a3.setAttribute("disabled", "disabled"), o3 && a3.setAttribute("selected", "selected"), i3 && a3.setAttribute("data-id", i3), a3.setAttribute("data-hs-select-option", JSON.stringify(l3)), a3.innerText = e3, this.el.append(a3);
          }
          destroyOriginalOption(e3) {
            const t3 = this.el.querySelector(`[value="${e3}"]`);
            if (!t3) return false;
            t3.remove();
          }
          buildTagsInputHelper() {
            this.tagsInputHelper = document.createElement("span"), this.tagsInputHelper.style.fontSize = window.getComputedStyle(this.tagsInput).fontSize, this.tagsInputHelper.style.fontFamily = window.getComputedStyle(this.tagsInput).fontFamily, this.tagsInputHelper.style.fontWeight = window.getComputedStyle(this.tagsInput).fontWeight, this.tagsInputHelper.style.letterSpacing = window.getComputedStyle(this.tagsInput).letterSpacing, this.tagsInputHelper.style.visibility = "hidden", this.tagsInputHelper.style.whiteSpace = "pre", this.tagsInputHelper.style.position = "absolute", this.wrapper.appendChild(this.tagsInputHelper);
          }
          calculateInputWidth() {
            this.tagsInputHelper.textContent = this.tagsInput.value || this.tagsInput.placeholder;
            const e3 = parseInt(window.getComputedStyle(this.tagsInput).paddingLeft) + parseInt(window.getComputedStyle(this.tagsInput).paddingRight), t3 = parseInt(window.getComputedStyle(this.tagsInput).borderLeftWidth) + parseInt(window.getComputedStyle(this.tagsInput).borderRightWidth), i3 = this.tagsInputHelper.offsetWidth + e3 + t3, s3 = this.wrapper.offsetWidth - (parseInt(window.getComputedStyle(this.wrapper).paddingLeft) + parseInt(window.getComputedStyle(this.wrapper).paddingRight));
            this.tagsInput.style.width = `${Math.min(i3, s3) + 2}px`;
          }
          adjustInputWidth() {
            this.buildTagsInputHelper(), this.calculateInputWidth();
          }
          onSelectOption(e3) {
            if (this.clearSelections(), this.isMultiple ? (Array.isArray(this.value) || (this.value = []), this.value = this.value.includes(e3) ? this.value.filter((t3) => t3 !== e3) : [...this.value, e3], this.selectMultipleItems(), this.setNewValue()) : (this.value = e3, this.selectSingleItem(), this.setNewValue()), this.fireEvent("change", this.value), "tags" === this.mode) {
              const e4 = this.selectedItems.filter((e5) => !this.value.includes(e5));
              e4.length && e4.forEach((e5) => {
                this.selectedItems = this.selectedItems.filter((t3) => t3 !== e5), this.wrapper.querySelector(`[data-tag-value="${e5}"]`).remove();
              }), this.resetTagsInputField();
            }
            this.isMultiple || (this.toggle.querySelector("[data-icon]") && this.setToggleIcon(), this.toggle.querySelector("[data-title]") && this.setToggleTitle(), this.close(true)), this.hasValue() || "tags" !== this.mode || this.reassignTagsInputPlaceholder(this.placeholder), this._isOpened && "tags" === this.mode && this.tagsInput && this.tagsInput.focus(), this.triggerChangeEventForNativeSelect();
          }
          triggerChangeEventForNativeSelect() {
            const e3 = new Event("change", { bubbles: true });
            this.el.dispatchEvent(e3), (0, s2.JD)("change.hs.select", this.el, this.value);
          }
          addSelectOption(e3, t3, i3, s3, n3) {
            this.selectOptions = [...this.selectOptions, { title: e3, val: t3, disabled: i3, selected: s3, options: n3 }];
          }
          removeSelectOption(e3, t3 = false) {
            if (!!!this.selectOptions.some((t4) => t4.val === e3)) return false;
            this.selectOptions = this.selectOptions.filter((t4) => t4.val !== e3), this.value = t3 ? this.value.filter((t4) => t4 !== e3) : e3;
          }
          resetTagsInputField() {
            this.tagsInput.value = "", this.reassignTagsInputPlaceholder(""), this.searchOptions("");
          }
          clearSelections() {
            const e3 = this.el.querySelectorAll("option");
            Array.from(this.dropdown.children).forEach((e4) => {
              e4.classList.contains("selected") && e4.classList.remove("selected");
            }), Array.from(e3).forEach((e4) => {
              e4.selected && (e4.selected = false);
            });
          }
          setNewValue() {
            if ("tags" === this.mode) this.setTagsItems();
            else if (this.optionAllowEmptyOption && "" === this.value) {
              const e3 = this.selectOptions.find((e4) => "" === e4.val);
              this.toggleTextWrapper.innerHTML = (null == e3 ? void 0 : e3.title) || this.placeholder;
            } else if (this.hasValue()) if (this.apiUrl) {
              const e3 = this.dropdown.querySelector(`[data-value="${this.value}"]`);
              if (e3) this.toggleTextWrapper.innerHTML = e3.getAttribute("data-title-value") || this.placeholder;
              else {
                const e4 = this.staticOptions.find((e5) => e5.val === this.value);
                if (e4) this.toggleTextWrapper.innerHTML = e4.title;
                else {
                  const e5 = this.remoteOptions.find((e6) => (e6[this.apiFieldsMap.val] ? `${e6[this.apiFieldsMap.val]}` : e6[this.apiFieldsMap.title]) === this.value);
                  this.toggleTextWrapper.innerHTML = e5 ? `${e5[this.apiFieldsMap.title]}` : this.stringFromValue();
                }
              }
            } else this.toggleTextWrapper.innerHTML = this.stringFromValue();
            else this.toggleTextWrapper.innerHTML = this.placeholder;
          }
          stringFromValueBasic(e3) {
            var t3;
            const i3 = [];
            let s3 = "";
            if (e3.forEach((e4) => {
              this.isMultiple ? Array.isArray(this.value) && this.value.includes(e4.val) && i3.push(e4.title) : this.value === e4.val && i3.push(e4.title);
            }), void 0 !== this.toggleCountText && null !== this.toggleCountText && i3.length >= this.toggleCountTextMinItems) if ("nItemsAndCount" === this.toggleCountTextMode) {
              const e4 = i3.slice(0, this.toggleCountTextMinItems - 1), n3 = [e4.join(this.toggleSeparators.items)], o3 = "" + (i3.length - e4.length);
              if ((null === (t3 = null == this ? void 0 : this.toggleSeparators) || void 0 === t3 ? void 0 : t3.betweenItemsAndCounter) && n3.push(this.toggleSeparators.betweenItemsAndCounter), this.toggleCountText) switch (this.toggleCountTextPlacement) {
                case "postfix-no-space":
                  n3.push(`${o3}${this.toggleCountText}`);
                  break;
                case "prefix-no-space":
                  n3.push(`${this.toggleCountText}${o3}`);
                  break;
                case "prefix":
                  n3.push(`${this.toggleCountText} ${o3}`);
                  break;
                default:
                  n3.push(`${o3} ${this.toggleCountText}`);
              }
              s3 = n3.join(" ");
            } else s3 = `${i3.length} ${this.toggleCountText}`;
            else s3 = i3.join(this.toggleSeparators.items);
            return s3;
          }
          stringFromValueRemoteData() {
            if (!this.dropdown) return this.stringFromValueBasic(this.selectOptions);
            const e3 = this.dropdown.querySelectorAll("[data-title-value]"), t3 = [];
            let i3 = "";
            if (e3.forEach((e4) => {
              const i4 = e4.getAttribute("data-value"), s3 = e4.getAttribute("data-title-value");
              this.isMultiple ? Array.isArray(this.value) && this.value.includes(i4) && t3.push(s3) : this.value === i4 && t3.push(s3);
            }), this.toggleCountText && "" !== this.toggleCountText && t3.length >= this.toggleCountTextMinItems) if ("nItemsAndCount" === this.toggleCountTextMode) {
              const e4 = t3.slice(0, this.toggleCountTextMinItems - 1);
              i3 = `${e4.join(this.toggleSeparators.items)} ${this.toggleSeparators.betweenItemsAndCounter} ${t3.length - e4.length} ${this.toggleCountText}`;
            } else i3 = `${t3.length} ${this.toggleCountText}`;
            else i3 = t3.join(this.toggleSeparators.items);
            return i3;
          }
          stringFromValue() {
            return this.apiUrl ? this.stringFromValueRemoteData() : this.stringFromValueBasic(this.selectOptions);
          }
          selectSingleItem() {
            const e3 = this.el.querySelectorAll("option");
            Array.from(e3).find((e4) => this.value === e4.value).selected = true;
            const t3 = Array.from(this.dropdown.children).find((e4) => this.value === e4.getAttribute("data-value"));
            t3 && t3.classList.add("selected"), this.sortElements(this.el, "option"), this.sortElements(this.dropdown, "[data-value]");
          }
          selectMultipleItems() {
            if (!Array.isArray(this.value)) return;
            const e3 = this.el.querySelectorAll("option");
            Array.from(this.dropdown.children).filter((e4) => this.value.includes(e4.getAttribute("data-value"))).forEach((e4) => e4.classList.add("selected")), Array.from(e3).filter((e4) => this.value.includes(e4.value)).forEach((e4) => e4.selected = true), this.sortElements(this.el, "option"), this.sortElements(this.dropdown, "[data-value]");
          }
          unselectMultipleItems() {
            const e3 = this.el.querySelectorAll("option");
            Array.from(this.dropdown.children).forEach((e4) => e4.classList.remove("selected")), Array.from(e3).forEach((e4) => e4.selected = false), this.sortElements(this.el, "option"), this.sortElements(this.dropdown, "[data-value]");
          }
          searchOptions(e3) {
            if (e3.length <= this.minSearchLength) {
              this.searchNoResult && (this.searchNoResult.remove(), this.searchNoResult = null);
              return this.dropdown.querySelectorAll("[data-value]").forEach((e4) => {
                e4.classList.remove("hidden");
              }), false;
            }
            this.searchNoResult && (this.searchNoResult.remove(), this.searchNoResult = null), this.searchNoResult = (0, s2.fc)(this.searchNoResultTemplate), this.searchNoResult.innerText = this.searchNoResultText, (0, s2.en)(this.searchNoResultClasses, this.searchNoResult);
            const t3 = this.dropdown.querySelectorAll("[data-value]");
            let i3, n3 = false;
            this.searchLimit && (i3 = 0), t3.forEach((t4) => {
              var s3;
              const o3 = t4.getAttribute("data-title-value") || "", l3 = (null === (s3 = null == t4 ? void 0 : t4.dataset) || void 0 === s3 ? void 0 : s3.description) || "";
              !this.optionMatchesQuery(e3, o3, l3) || this.searchLimit && i3 >= this.searchLimit ? t4.classList.add("hidden") : (t4.classList.remove("hidden"), n3 = true, this.searchLimit && i3++);
            }), n3 || this.dropdown.append(this.searchNoResult);
          }
          eraseToggleIcon() {
            const e3 = this.toggle.querySelector("[data-icon]");
            e3 && (e3.innerHTML = null, e3.classList.add("hidden"));
          }
          eraseToggleTitle() {
            const e3 = this.toggle.querySelector("[data-title]");
            e3 ? e3.innerHTML = this.placeholder : this.toggleTextWrapper.innerHTML = this.placeholder;
          }
          toggleFn() {
            this._isOpened ? this.close() : this.open();
          }
          setupAccessibility() {
            this.accessibilityComponent = window.HSAccessibilityObserver.registerComponent(this.wrapper, { onEnter: () => {
              if (this._isOpened) {
                const e3 = this.dropdown.querySelector(".hs-select-option-highlighted");
                e3 && (this.onSelectOption(e3.getAttribute("data-value") || ""), this._isOpened && e3.focus());
              } else this.open();
            }, onSpace: () => {
              if (this._isOpened) {
                const e3 = this.dropdown.querySelector(".hs-select-option-highlighted");
                e3 && (this.onSelectOption(e3.getAttribute("data-value") || ""), this._isOpened && e3.focus());
              } else this.open();
            }, onEsc: () => {
              this._isOpened && this.close(true);
            }, onArrow: (e3) => {
              if (!e3.metaKey) if (this._isOpened || "ArrowDown" !== e3.key) {
                if (this._isOpened) switch (e3.key) {
                  case "ArrowDown":
                    this.focusMenuItem("next");
                    break;
                  case "ArrowUp":
                    this.focusMenuItem("prev");
                    break;
                  case "Home":
                    this.onStartEnd(true);
                    break;
                  case "End":
                    this.onStartEnd(false);
                }
              } else this.open();
            }, onHome: () => {
              this._isOpened && this.onStartEnd(true);
            }, onEnd: () => {
              this._isOpened && this.onStartEnd(false);
            }, onTab: () => {
              this._isOpened && this.close();
            } }, this._isOpened, "Select", ".hs-select", this.dropdown);
          }
          focusMenuItem(e3) {
            const t3 = Array.from(this.dropdown.querySelectorAll(":scope > *:not(.hidden)")).filter((e4) => !e4.classList.contains("disabled") && !e4.hasAttribute("data-optgroup"));
            if (!t3.length) return;
            const i3 = this.dropdown.querySelector(".hs-select-option-highlighted"), s3 = i3 ? t3.indexOf(i3) : -1, n3 = "next" === e3 ? (s3 + 1) % t3.length : (s3 - 1 + t3.length) % t3.length;
            i3 && i3.classList.remove("hs-select-option-highlighted"), t3[n3].classList.add("hs-select-option-highlighted"), t3[n3].focus();
          }
          onStartEnd(e3 = true) {
            if (!this.dropdown) return;
            const t3 = Array.from(this.dropdown.querySelectorAll(":scope > *:not(.hidden)")).filter((e4) => !e4.classList.contains("disabled"));
            if (!t3.length) return;
            const i3 = this.dropdown.querySelector(".hs-select-option-highlighted");
            i3 && i3.classList.remove("hs-select-option-highlighted");
            const s3 = e3 ? 0 : t3.length - 1;
            t3[s3].classList.add("hs-select-option-highlighted"), t3[s3].focus();
          }
          destroy() {
            var e3;
            this.wrapper && this.wrapper.removeEventListener("click", this.onWrapperClickListener), this.toggle && this.toggle.removeEventListener("click", this.onToggleClickListener), this.tagsInput && (this.tagsInput.removeEventListener("focus", this.onTagsInputFocusListener), this.tagsInput.removeEventListener("input", this.onTagsInputInputListener), this.tagsInput.removeEventListener("input", this.onTagsInputInputSecondListener), this.tagsInput.removeEventListener("keydown", this.onTagsInputKeydownListener)), this.search && this.search.removeEventListener("input", this.onSearchInputListener);
            const t3 = this.el.parentElement.parentElement;
            this.el.classList.add("hidden"), this.el.style.display = "", t3.prepend(this.el), t3.querySelector(".hs-select").remove(), this.wrapper = null, null === (e3 = this.disabledObserver) || void 0 === e3 || e3.disconnect(), this.disabledObserver = null, window.$hsSelectCollection = window.$hsSelectCollection.filter(({ element: e4 }) => e4.el !== this.el);
          }
          open() {
            var e3;
            const t3 = (null === (e3 = null === window || void 0 === window ? void 0 : window.$hsSelectCollection) || void 0 === e3 ? void 0 : e3.find((e4) => e4.element.isOpened())) || null;
            if (t3 && t3.element.close(), this.animationInProcess) return false;
            this.animationInProcess = true, "window" === this.dropdownScope && this.dropdown.classList.add("invisible"), this.dropdown.classList.remove("hidden"), "window" !== this.dropdownScope && this.recalculateDirection(), setTimeout(() => {
              var e4;
              if ((null === (e4 = null == this ? void 0 : this.toggle) || void 0 === e4 ? void 0 : e4.ariaExpanded) && (this.toggle.ariaExpanded = "true"), this.wrapper.classList.add("active"), this.dropdown.classList.add("opened"), this.dropdown.classList.contains("w-full") && "window" === this.dropdownScope && this.updateDropdownWidth(), this.floatingUIInstance && "window" === this.dropdownScope && (this.floatingUIInstance.update(), this.dropdown.classList.remove("invisible")), this.hasSearch && !this.preventSearchFocus && this.search.focus(), this.animationInProcess = false, this.scrollToSelected && this.dropdown) {
                const e5 = this.dropdown.querySelector(".selected");
                if (e5) {
                  const t4 = this.dropdown.clientHeight, i3 = e5.offsetTop - t4 / 2 + e5.clientHeight / 2;
                  this.dropdown.scrollTop = i3;
                }
              }
            }), this._isOpened = true, window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, this._isOpened);
          }
          close(e3 = false) {
            var t3, i3, n3, o3;
            if (this.animationInProcess) return false;
            this.animationInProcess = true, (null === (t3 = null == this ? void 0 : this.toggle) || void 0 === t3 ? void 0 : t3.ariaExpanded) && (this.toggle.ariaExpanded = "false"), this.wrapper.classList.remove("active"), this.dropdown.classList.remove("opened", "bottom-full", "top-full"), (null === (i3 = this.dropdownDirectionClasses) || void 0 === i3 ? void 0 : i3.bottom) && this.dropdown.classList.remove(this.dropdownDirectionClasses.bottom), (null === (n3 = this.dropdownDirectionClasses) || void 0 === n3 ? void 0 : n3.top) && this.dropdown.classList.remove(this.dropdownDirectionClasses.top), this.dropdown.style.marginTop = "", this.dropdown.style.marginBottom = "", (0, s2.yd)(this.dropdown, () => {
              var t4;
              this.dropdown.classList.add("hidden"), this.hasSearch && "tags" !== this.mode && (this.search.value = "", this.apiUrl ? this.filterStaticOptions("") : this.search.dispatchEvent(new Event("input", { bubbles: true })), this.search.blur()), e3 && ((null === (t4 = this.mode) || void 0 === t4 ? void 0 : t4.includes("tags")) ? this.wrapper.focus() : this.toggle.focus()), this.animationInProcess = false;
            }), null === (o3 = this.dropdown.querySelector(".hs-select-option-highlighted")) || void 0 === o3 || o3.classList.remove("hs-select-option-highlighted"), this._isOpened = false, window.HSAccessibilityObserver && this.accessibilityComponent && window.HSAccessibilityObserver.updateComponentState(this.accessibilityComponent, this._isOpened);
          }
          addOption(e3) {
            let t3 = `${this.selectOptions.length}`;
            const i3 = (e4) => {
              const { title: i4, val: s3, disabled: n3, selected: o3, options: l3 } = e4;
              !!this.selectOptions.some((e5) => e5.val === s3) || (this.addSelectOption(i4, s3, n3, o3, l3), this.buildOption(i4, s3, n3, o3, l3, t3), this.buildOriginalOption(i4, s3, null, n3, o3, l3), o3 && !this.isMultiple && this.onSelectOption(s3));
            };
            Array.isArray(e3) ? e3.forEach((e4) => {
              i3(e4);
            }) : i3(e3), this.sortElements(this.el, "option"), this.sortElements(this.dropdown, "[data-value]");
          }
          removeOption(e3) {
            const t3 = (e4, t4 = false) => {
              !!this.selectOptions.some((t5) => t5.val === e4) && (this.removeSelectOption(e4, t4), this.destroyOption(e4), this.destroyOriginalOption(e4), this.value === e4 && (this.value = null, this.eraseToggleTitle(), this.eraseToggleIcon()));
            };
            Array.isArray(e3) ? e3.forEach((e4) => {
              t3(e4, this.isMultiple);
            }) : t3(e3, this.isMultiple), this.setNewValue(), this.sortElements(this.el, "option"), this.sortElements(this.dropdown, "[data-value]");
          }
          recalculateDirection() {
            var e3, t3, i3, n3;
            if ((null == this ? void 0 : this.dropdownVerticalFixedPlacement) && (this.dropdown.classList.contains("bottom-full") || this.dropdown.classList.contains("top-full"))) return false;
            "top" === (null == this ? void 0 : this.dropdownVerticalFixedPlacement) ? (this.dropdown.classList.add("bottom-full"), this.dropdown.style.marginBottom = `${this.dropdownSpace}px`) : "bottom" === (null == this ? void 0 : this.dropdownVerticalFixedPlacement) ? (this.dropdown.classList.add("top-full"), this.dropdown.style.marginTop = `${this.dropdownSpace}px`) : (0, s2.PR)(this.dropdown, this.toggle || this.tagsInput, "bottom", this.dropdownSpace, this.viewport) ? (this.dropdown.classList.remove("bottom-full"), (null === (e3 = this.dropdownDirectionClasses) || void 0 === e3 ? void 0 : e3.bottom) && this.dropdown.classList.remove(this.dropdownDirectionClasses.bottom), this.dropdown.style.marginBottom = "", this.dropdown.classList.add("top-full"), (null === (t3 = this.dropdownDirectionClasses) || void 0 === t3 ? void 0 : t3.top) && this.dropdown.classList.add(this.dropdownDirectionClasses.top), this.dropdown.style.marginTop = `${this.dropdownSpace}px`) : (this.dropdown.classList.remove("top-full"), (null === (i3 = this.dropdownDirectionClasses) || void 0 === i3 ? void 0 : i3.top) && this.dropdown.classList.remove(this.dropdownDirectionClasses.top), this.dropdown.style.marginTop = "", this.dropdown.classList.add("bottom-full"), (null === (n3 = this.dropdownDirectionClasses) || void 0 === n3 ? void 0 : n3.bottom) && this.dropdown.classList.add(this.dropdownDirectionClasses.bottom), this.dropdown.style.marginBottom = `${this.dropdownSpace}px`);
          }
          isOpened() {
            return this._isOpened || false;
          }
          containsElement(e3) {
            var t3;
            return (null === (t3 = this.wrapper) || void 0 === t3 ? void 0 : t3.contains(e3)) || false;
          }
          containsDropdownElement(e3) {
            var t3;
            return (null === (t3 = this.dropdown) || void 0 === t3 ? void 0 : t3.contains(e3)) || false;
          }
          static findInCollection(e3) {
            return r2.ensureGlobalHandlers(), window.$hsSelectCollection.find((t3) => e3 instanceof r2 ? t3.element.el === e3.el : "string" == typeof e3 ? t3.element.el === document.querySelector(e3) : t3.element.el === e3) || null;
          }
          static getInstance(e3, t3) {
            r2.ensureGlobalHandlers();
            const i3 = window.$hsSelectCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            r2.ensureGlobalHandlers(), window.$hsSelectCollection && (window.$hsSelectCollection = window.$hsSelectCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-select]:not(.--prevent-on-load-init)").forEach((e3) => {
              if (!window.$hsSelectCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              })) {
                const t3 = e3.getAttribute("data-hs-select"), i3 = t3 ? JSON.parse(t3) : {};
                new r2(e3, i3);
              }
            });
          }
          static ensureGlobalHandlers() {
            "undefined" != typeof window && (window.$hsSelectCollection || (window.$hsSelectCollection = []), r2.globalListenersInitialized || (r2.globalListenersInitialized = true, window.addEventListener("click", (e3) => {
              const t3 = e3.target;
              r2.closeCurrentlyOpened(t3);
            })));
          }
          static open(e3) {
            const t3 = r2.findInCollection(e3);
            t3 && !t3.element.isOpened() && t3.element.open();
          }
          static close(e3) {
            const t3 = r2.findInCollection(e3);
            t3 && t3.element.isOpened() && t3.element.close();
          }
          static closeCurrentlyOpened(e3 = null) {
            if (!e3.closest(".hs-select.active") && !e3.closest("[data-hs-select-dropdown].opened")) {
              const e4 = window.$hsSelectCollection.filter((e5) => e5.element.isOpened()) || null;
              e4 && e4.forEach((e5) => {
                e5.element.close();
              });
            }
          }
        }
        r2.globalListenersInitialized = false;
        const c2 = r2;
      }, 2166(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = e3.getAttribute("data-hs-stepper"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.currentIndex = (null == n3 ? void 0 : n3.currentIndex) || 1, this.mode = (null == n3 ? void 0 : n3.mode) || "linear", this.isCompleted = void 0 !== (null == n3 ? void 0 : n3.isCompleted) && (null == n3 ? void 0 : n3.isCompleted), this.totalSteps = 1, this.navItems = [], this.contentItems = [], this.onNavItemClickListener = [], this.init();
          }
          navItemClick(e3) {
            this.handleNavItemClick(e3);
          }
          backClick() {
            if (this.handleBackButtonClick(), "linear" === this.mode) {
              const e3 = this.navItems.find(({ index: e4 }) => e4 === this.currentIndex), t3 = this.contentItems.find(({ index: e4 }) => e4 === this.currentIndex);
              if (!e3 || !t3) return;
              e3.isCompleted && (e3.isCompleted = false, e3.isSkip = false, e3.el.classList.remove("success", "skipped")), t3.isCompleted && (t3.isCompleted = false, t3.isSkip = false, t3.el.classList.remove("success", "skipped")), "linear" === this.mode && this.currentIndex !== this.totalSteps && (this.nextBtn && (this.nextBtn.style.display = ""), this.completeStepBtn && (this.completeStepBtn.style.display = "")), this.showSkipButton(), this.showFinishButton(), this.showCompleteStepButton();
            }
          }
          nextClick() {
            var e3;
            if (this.fireEvent("beforeNext", this.currentIndex), (0, s2.JD)("beforeNext.hs.stepper", this.el, this.currentIndex), null === (e3 = this.getNavItem(this.currentIndex)) || void 0 === e3 ? void 0 : e3.isProcessed) return this.disableAll(), false;
            this.goToNext();
          }
          skipClick() {
            this.handleSkipButtonClick(), "linear" === this.mode && this.currentIndex === this.totalSteps && (this.nextBtn && (this.nextBtn.style.display = "none"), this.completeStepBtn && (this.completeStepBtn.style.display = "none"), this.finishBtn && (this.finishBtn.style.display = ""));
          }
          completeStepBtnClick() {
            this.handleCompleteStepButtonClick();
          }
          finishBtnClick() {
            var e3;
            if (this.fireEvent("beforeFinish", this.currentIndex), (0, s2.JD)("beforeFinish.hs.stepper", this.el, this.currentIndex), null === (e3 = this.getNavItem(this.currentIndex)) || void 0 === e3 ? void 0 : e3.isProcessed) return this.disableAll(), false;
            this.handleFinishButtonClick();
          }
          resetBtnClick() {
            this.handleResetButtonClick();
          }
          init() {
            this.createCollection(window.$hsStepperCollection, this), this.buildNav(), this.buildContent(), this.buildButtons(), this.setTotalSteps();
          }
          getUncompletedSteps(e3 = false) {
            return this.navItems.filter(({ isCompleted: t3, isSkip: i3 }) => e3 ? !t3 || i3 : !t3 && !i3);
          }
          setTotalSteps() {
            this.navItems.forEach((e3) => {
              const { index: t3 } = e3;
              t3 > this.totalSteps && (this.totalSteps = t3);
            });
          }
          buildNav() {
            this.el.querySelectorAll("[data-hs-stepper-nav-item]").forEach((e3) => this.addNavItem(e3)), this.navItems.forEach((e3) => this.buildNavItem(e3));
          }
          buildNavItem(e3) {
            const { index: t3, isDisabled: i3, el: s3 } = e3;
            t3 === this.currentIndex && this.setCurrentNavItem(), ("linear" !== this.mode || i3) && (this.onNavItemClickListener.push({ el: s3, fn: () => this.navItemClick(e3) }), s3.addEventListener("click", this.onNavItemClickListener.find((e4) => e4.el === s3).fn));
          }
          addNavItem(e3) {
            const { index: t3, isFinal: i3 = false, isCompleted: s3 = false, isSkip: n3 = false, isOptional: o3 = false, isDisabled: l3 = false, isProcessed: a2 = false, hasError: r2 = false } = JSON.parse(e3.getAttribute("data-hs-stepper-nav-item"));
            s3 && e3.classList.add("success"), n3 && e3.classList.add("skipped"), l3 && ("BUTTON" !== e3.tagName && "INPUT" !== e3.tagName || e3.setAttribute("disabled", "disabled"), e3.classList.add("disabled")), r2 && e3.classList.add("error"), this.navItems.push({ index: t3, isFinal: i3, isCompleted: s3, isSkip: n3, isOptional: o3, isDisabled: l3, isProcessed: a2, hasError: r2, el: e3 });
          }
          setCurrentNavItem() {
            this.navItems.forEach((e3) => {
              const { index: t3, el: i3 } = e3;
              t3 === this.currentIndex ? this.setCurrentNavItemActions(i3) : this.unsetCurrentNavItemActions(i3);
            });
          }
          setCurrentNavItemActions(e3) {
            e3.classList.add("active"), this.fireEvent("active", this.currentIndex), (0, s2.JD)("active.hs.stepper", this.el, this.currentIndex);
          }
          getNavItem(e3 = this.currentIndex) {
            return this.navItems.find(({ index: t3 }) => t3 === e3);
          }
          setProcessedNavItemActions(e3) {
            e3.isProcessed = true, e3.el.classList.add("processed");
          }
          setErrorNavItemActions(e3) {
            e3.hasError = true, e3.el.classList.add("error");
          }
          unsetCurrentNavItemActions(e3) {
            e3.classList.remove("active");
          }
          handleNavItemClick(e3) {
            const { index: t3 } = e3;
            this.currentIndex = t3, this.setCurrentNavItem(), this.setCurrentContentItem(), this.checkForTheFirstStep();
          }
          buildContent() {
            this.el.querySelectorAll("[data-hs-stepper-content-item]").forEach((e3) => this.addContentItem(e3)), this.navItems.forEach((e3) => this.buildContentItem(e3));
          }
          buildContentItem(e3) {
            const { index: t3 } = e3;
            t3 === this.currentIndex && this.setCurrentContentItem();
          }
          addContentItem(e3) {
            const { index: t3, isFinal: i3 = false, isCompleted: s3 = false, isSkip: n3 = false } = JSON.parse(e3.getAttribute("data-hs-stepper-content-item"));
            s3 && e3.classList.add("success"), n3 && e3.classList.add("skipped"), this.contentItems.push({ index: t3, isFinal: i3, isCompleted: s3, isSkip: n3, el: e3 });
          }
          setCurrentContentItem() {
            if (this.isCompleted) {
              const e3 = this.contentItems.find(({ isFinal: e4 }) => e4), t3 = this.contentItems.filter(({ isFinal: e4 }) => !e4);
              return e3.el.style.display = "", t3.forEach(({ el: e4 }) => e4.style.display = "none"), false;
            }
            this.contentItems.forEach((e3) => {
              const { index: t3, el: i3 } = e3;
              t3 === this.currentIndex ? this.setCurrentContentItemActions(i3) : this.unsetCurrentContentItemActions(i3);
            });
          }
          hideAllContentItems() {
            this.contentItems.forEach(({ el: e3 }) => e3.style.display = "none");
          }
          setCurrentContentItemActions(e3) {
            e3.style.display = "";
          }
          unsetCurrentContentItemActions(e3) {
            e3.style.display = "none";
          }
          disableAll() {
            const e3 = this.getNavItem(this.currentIndex);
            e3.hasError = false, e3.isCompleted = false, e3.isDisabled = false, e3.el.classList.remove("error", "success"), this.disableButtons();
          }
          disableNavItemActions(e3) {
            e3.isDisabled = true, e3.el.classList.add("disabled");
          }
          enableNavItemActions(e3) {
            e3.isDisabled = false, e3.el.classList.remove("disabled");
          }
          buildButtons() {
            this.backBtn = this.el.querySelector("[data-hs-stepper-back-btn]"), this.nextBtn = this.el.querySelector("[data-hs-stepper-next-btn]"), this.skipBtn = this.el.querySelector("[data-hs-stepper-skip-btn]"), this.completeStepBtn = this.el.querySelector("[data-hs-stepper-complete-step-btn]"), this.finishBtn = this.el.querySelector("[data-hs-stepper-finish-btn]"), this.resetBtn = this.el.querySelector("[data-hs-stepper-reset-btn]"), this.buildBackButton(), this.buildNextButton(), this.buildSkipButton(), this.buildCompleteStepButton(), this.buildFinishButton(), this.buildResetButton();
          }
          buildBackButton() {
            this.backBtn && (this.checkForTheFirstStep(), this.onBackClickListener = () => this.backClick(), this.backBtn.addEventListener("click", this.onBackClickListener));
          }
          handleBackButtonClick() {
            1 !== this.currentIndex && ("linear" === this.mode && this.removeOptionalClasses(), this.currentIndex--, "linear" === this.mode && this.removeOptionalClasses(), this.setCurrentNavItem(), this.setCurrentContentItem(), this.checkForTheFirstStep(), this.completeStepBtn && this.changeTextAndDisableCompleteButtonIfStepCompleted(), this.fireEvent("back", this.currentIndex), (0, s2.JD)("back.hs.stepper", this.el, this.currentIndex));
          }
          checkForTheFirstStep() {
            1 === this.currentIndex ? this.setToDisabled(this.backBtn) : this.setToNonDisabled(this.backBtn);
          }
          setToDisabled(e3) {
            "BUTTON" !== e3.tagName && "INPUT" !== e3.tagName || e3.setAttribute("disabled", "disabled"), e3.classList.add("disabled");
          }
          setToNonDisabled(e3) {
            "BUTTON" !== e3.tagName && "INPUT" !== e3.tagName || e3.removeAttribute("disabled"), e3.classList.remove("disabled");
          }
          buildNextButton() {
            this.nextBtn && (this.onNextClickListener = () => this.nextClick(), this.nextBtn.addEventListener("click", this.onNextClickListener));
          }
          unsetProcessedNavItemActions(e3) {
            e3.isProcessed = false, e3.el.classList.remove("processed");
          }
          handleNextButtonClick(e3 = true) {
            if (e3) this.currentIndex === this.totalSteps ? this.currentIndex = 1 : this.currentIndex++;
            else {
              const e4 = this.getUncompletedSteps();
              if (1 === e4.length) {
                const { index: t3 } = e4[0];
                this.currentIndex = t3;
              } else {
                if (this.currentIndex === this.totalSteps) return;
                this.currentIndex++;
              }
            }
            "linear" === this.mode && this.removeOptionalClasses(), this.setCurrentNavItem(), this.setCurrentContentItem(), this.checkForTheFirstStep(), this.completeStepBtn && this.changeTextAndDisableCompleteButtonIfStepCompleted(), this.showSkipButton(), this.showFinishButton(), this.showCompleteStepButton(), this.fireEvent("next", this.currentIndex), (0, s2.JD)("next.hs.stepper", this.el, this.currentIndex);
          }
          removeOptionalClasses() {
            const e3 = this.navItems.find(({ index: e4 }) => e4 === this.currentIndex), t3 = this.contentItems.find(({ index: e4 }) => e4 === this.currentIndex);
            e3.isSkip = false, e3.hasError = false, e3.isDisabled = false, t3.isSkip = false, e3.el.classList.remove("skipped", "success", "error"), t3.el.classList.remove("skipped", "success", "error");
          }
          buildSkipButton() {
            this.skipBtn && (this.showSkipButton(), this.onSkipClickListener = () => this.skipClick(), this.skipBtn.addEventListener("click", this.onSkipClickListener));
          }
          setSkipItem(e3) {
            const t3 = this.navItems.find(({ index: t4 }) => t4 === (e3 || this.currentIndex)), i3 = this.contentItems.find(({ index: t4 }) => t4 === (e3 || this.currentIndex));
            t3 && i3 && (this.setSkipItemActions(t3), this.setSkipItemActions(i3));
          }
          setSkipItemActions(e3) {
            e3.isSkip = true, e3.el.classList.add("skipped");
          }
          showSkipButton() {
            if (!this.skipBtn) return;
            const { isOptional: e3 } = this.navItems.find(({ index: e4 }) => e4 === this.currentIndex);
            this.skipBtn.style.display = e3 ? "" : "none";
          }
          handleSkipButtonClick() {
            this.setSkipItem(), this.handleNextButtonClick(), this.fireEvent("skip", this.currentIndex), (0, s2.JD)("skip.hs.stepper", this.el, this.currentIndex);
          }
          buildCompleteStepButton() {
            this.completeStepBtn && (this.completeStepBtnDefaultText = this.completeStepBtn.innerText, this.onCompleteStepBtnClickListener = () => this.completeStepBtnClick(), this.completeStepBtn.addEventListener("click", this.onCompleteStepBtnClickListener));
          }
          changeTextAndDisableCompleteButtonIfStepCompleted() {
            const e3 = this.navItems.find(({ index: e4 }) => e4 === this.currentIndex), { completedText: t3 } = JSON.parse(this.completeStepBtn.getAttribute("data-hs-stepper-complete-step-btn"));
            e3 && (e3.isCompleted ? (this.completeStepBtn.innerText = t3 || this.completeStepBtnDefaultText, this.completeStepBtn.setAttribute("disabled", "disabled"), this.completeStepBtn.classList.add("disabled")) : (this.completeStepBtn.innerText = this.completeStepBtnDefaultText, this.completeStepBtn.removeAttribute("disabled"), this.completeStepBtn.classList.remove("disabled")));
          }
          setCompleteItem(e3) {
            const t3 = this.navItems.find(({ index: t4 }) => t4 === (e3 || this.currentIndex)), i3 = this.contentItems.find(({ index: t4 }) => t4 === (e3 || this.currentIndex));
            t3 && i3 && (this.setCompleteItemActions(t3), this.setCompleteItemActions(i3));
          }
          setCompleteItemActions(e3) {
            e3.isCompleted = true, e3.el.classList.add("success");
          }
          showCompleteStepButton() {
            if (!this.completeStepBtn) return;
            1 === this.getUncompletedSteps().length ? this.completeStepBtn.style.display = "none" : this.completeStepBtn.style.display = "";
          }
          handleCompleteStepButtonClick() {
            this.setCompleteItem(), this.fireEvent("complete", this.currentIndex), (0, s2.JD)("complete.hs.stepper", this.el, this.currentIndex), this.handleNextButtonClick(false), this.showFinishButton(), this.showCompleteStepButton(), this.checkForTheFirstStep(), this.completeStepBtn && this.changeTextAndDisableCompleteButtonIfStepCompleted(), this.showSkipButton();
          }
          buildFinishButton() {
            this.finishBtn && (this.isCompleted && this.setCompleted(), this.onFinishBtnClickListener = () => this.finishBtnClick(), this.finishBtn.addEventListener("click", this.onFinishBtnClickListener));
          }
          setCompleted() {
            this.el.classList.add("completed");
          }
          unsetCompleted() {
            this.el.classList.remove("completed");
          }
          showFinishButton() {
            if (!this.finishBtn) return;
            1 === this.getUncompletedSteps().length ? this.finishBtn.style.display = "" : this.finishBtn.style.display = "none";
          }
          handleFinishButtonClick() {
            const e3 = this.getUncompletedSteps(), t3 = this.getUncompletedSteps(true), { el: i3 } = this.contentItems.find(({ isFinal: e4 }) => e4);
            e3.length && e3.forEach(({ index: e4 }) => this.setCompleteItem(e4)), this.currentIndex = this.totalSteps, this.setCurrentNavItem(), this.hideAllContentItems();
            const n3 = this.navItems.find(({ index: e4 }) => e4 === this.currentIndex);
            (n3 ? n3.el : null).classList.remove("active"), i3.style.display = "block", this.backBtn && (this.backBtn.style.display = "none"), this.nextBtn && (this.nextBtn.style.display = "none"), this.skipBtn && (this.skipBtn.style.display = "none"), this.completeStepBtn && (this.completeStepBtn.style.display = "none"), this.finishBtn && (this.finishBtn.style.display = "none"), this.resetBtn && (this.resetBtn.style.display = ""), t3.length <= 1 && (this.isCompleted = true, this.setCompleted()), this.fireEvent("finish", this.currentIndex), (0, s2.JD)("finish.hs.stepper", this.el, this.currentIndex);
          }
          buildResetButton() {
            this.resetBtn && (this.onResetBtnClickListener = () => this.resetBtnClick(), this.resetBtn.addEventListener("click", this.onResetBtnClickListener));
          }
          handleResetButtonClick() {
            this.backBtn && (this.backBtn.style.display = ""), this.nextBtn && (this.nextBtn.style.display = ""), this.completeStepBtn && (this.completeStepBtn.style.display = "", this.completeStepBtn.innerText = this.completeStepBtnDefaultText, this.completeStepBtn.removeAttribute("disabled"), this.completeStepBtn.classList.remove("disabled")), this.resetBtn && (this.resetBtn.style.display = "none"), this.navItems.forEach((e3) => {
              const { el: t3 } = e3;
              e3.isSkip = false, e3.isCompleted = false, this.unsetCurrentNavItemActions(t3), t3.classList.remove("success", "skipped");
            }), this.contentItems.forEach((e3) => {
              const { el: t3 } = e3;
              e3.isSkip = false, e3.isCompleted = false, this.unsetCurrentContentItemActions(t3), t3.classList.remove("success", "skipped");
            }), this.currentIndex = 1, this.unsetCompleted(), this.isCompleted = false, this.showSkipButton(), this.setCurrentNavItem(), this.setCurrentContentItem(), this.showFinishButton(), this.showCompleteStepButton(), this.checkForTheFirstStep(), this.fireEvent("reset", this.currentIndex), (0, s2.JD)("reset.hs.stepper", this.el, this.currentIndex);
          }
          setProcessedNavItem(e3) {
            const t3 = this.getNavItem(e3);
            t3 && this.setProcessedNavItemActions(t3);
          }
          unsetProcessedNavItem(e3) {
            const t3 = this.getNavItem(e3);
            t3 && this.unsetProcessedNavItemActions(t3);
          }
          goToNext() {
            "linear" === this.mode && this.setCompleteItem(), this.handleNextButtonClick("linear" !== this.mode), "linear" === this.mode && this.currentIndex === this.totalSteps && (this.nextBtn && (this.nextBtn.style.display = "none"), this.completeStepBtn && (this.completeStepBtn.style.display = "none"));
          }
          goToFinish() {
            this.handleFinishButtonClick();
          }
          disableButtons() {
            this.backBtn && this.setToDisabled(this.backBtn), this.nextBtn && this.setToDisabled(this.nextBtn);
          }
          enableButtons() {
            this.backBtn && this.setToNonDisabled(this.backBtn), this.nextBtn && this.setToNonDisabled(this.nextBtn);
          }
          setErrorNavItem(e3) {
            const t3 = this.getNavItem(e3);
            t3 && this.setErrorNavItemActions(t3);
          }
          destroy() {
            this.el.classList.remove("completed"), this.el.querySelectorAll("[data-hs-stepper-nav-item]").forEach((e3) => {
              e3.classList.remove("active", "success", "skipped", "disabled", "error"), "BUTTON" !== e3.tagName && "INPUT" !== e3.tagName || e3.removeAttribute("disabled");
            }), this.el.querySelectorAll("[data-hs-stepper-content-item]").forEach((e3) => {
              e3.classList.remove("success", "skipped");
            }), this.backBtn && this.backBtn.classList.remove("disabled"), this.nextBtn && this.nextBtn.classList.remove("disabled"), this.completeStepBtn && this.completeStepBtn.classList.remove("disabled"), this.backBtn && (this.backBtn.style.display = ""), this.nextBtn && (this.nextBtn.style.display = ""), this.skipBtn && (this.skipBtn.style.display = ""), this.finishBtn && (this.finishBtn.style.display = "none"), this.resetBtn && (this.resetBtn.style.display = "none"), this.onNavItemClickListener.length && this.onNavItemClickListener.forEach(({ el: e3, fn: t3 }) => {
              e3.removeEventListener("click", t3);
            }), this.backBtn && this.backBtn.removeEventListener("click", this.onBackClickListener), this.nextBtn && this.nextBtn.removeEventListener("click", this.onNextClickListener), this.skipBtn && this.skipBtn.removeEventListener("click", this.onSkipClickListener), this.completeStepBtn && this.completeStepBtn.removeEventListener("click", this.onCompleteStepBtnClickListener), this.finishBtn && this.finishBtn.removeEventListener("click", this.onFinishBtnClickListener), this.resetBtn && this.resetBtn.removeEventListener("click", this.onResetBtnClickListener), window.$hsStepperCollection = window.$hsStepperCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsStepperCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsStepperCollection || (window.$hsStepperCollection = []), window.$hsStepperCollection && (window.$hsStepperCollection = window.$hsStepperCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-stepper]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsStepperCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 6652(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3) {
            super(e3, t3), this.isOpened = false, this.strength = 0, this.passedRules = /* @__PURE__ */ new Set();
            const i3 = e3.getAttribute("data-hs-strong-password"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.target = (null == n3 ? void 0 : n3.target) ? "string" == typeof (null == n3 ? void 0 : n3.target) ? document.querySelector(n3.target) : n3.target : null, this.hints = (null == n3 ? void 0 : n3.hints) ? "string" == typeof (null == n3 ? void 0 : n3.hints) ? document.querySelector(n3.hints) : n3.hints : null, this.stripClasses = (null == n3 ? void 0 : n3.stripClasses) || null, this.minLength = (null == n3 ? void 0 : n3.minLength) || 6, this.mode = (null == n3 ? void 0 : n3.mode) || "default", this.popoverSpace = (null == n3 ? void 0 : n3.popoverSpace) || 10, this.checksExclude = (null == n3 ? void 0 : n3.checksExclude) || [], this.availableChecks = ["lowercase", "uppercase", "numbers", "special-characters", "min-length"].filter((e4) => !this.checksExclude.includes(e4)), this.specialCharactersSet = (null == n3 ? void 0 : n3.specialCharactersSet) || "!\"#$%&'()*+,-./:;<=>?@[\\\\\\]^_`{|}~", this.target && this.init();
          }
          targetInput(e3) {
            this.setStrength(e3.target.value);
          }
          targetFocus() {
            this.isOpened = true, this.hints.classList.remove("hidden"), this.hints.classList.add("block"), this.recalculateDirection();
          }
          targetBlur() {
            this.isOpened = false, this.hints.classList.remove("block", "bottom-full", "top-full"), this.hints.classList.add("hidden"), this.hints.style.marginTop = "", this.hints.style.marginBottom = "";
          }
          targetInputSecond() {
            this.setWeaknessText();
          }
          targetInputThird() {
            this.setRulesText();
          }
          init() {
            this.createCollection(window.$hsStrongPasswordCollection, this), this.availableChecks.length && this.build();
          }
          build() {
            this.buildStrips(), this.hints && this.buildHints(), this.setStrength(this.target.value), this.onTargetInputListener = (e3) => this.targetInput(e3), this.target.addEventListener("input", this.onTargetInputListener);
          }
          buildStrips() {
            if (this.el.innerHTML = "", this.stripClasses) for (let e3 = 0; e3 < this.availableChecks.length; e3++) {
              const e4 = (0, s2.fc)("<div></div>");
              (0, s2.en)(this.stripClasses, e4), this.el.append(e4);
            }
          }
          buildHints() {
            this.weakness = this.hints.querySelector("[data-hs-strong-password-hints-weakness-text]") || null, this.rules = Array.from(this.hints.querySelectorAll("[data-hs-strong-password-hints-rule-text]")) || null, this.rules.forEach((e3) => {
              var t3;
              const i3 = e3.getAttribute("data-hs-strong-password-hints-rule-text");
              (null === (t3 = this.checksExclude) || void 0 === t3 ? void 0 : t3.includes(i3)) && e3.remove();
            }), this.weakness && this.buildWeakness(), this.rules && this.buildRules(), "popover" === this.mode && (this.onTargetFocusListener = () => this.targetFocus(), this.onTargetBlurListener = () => this.targetBlur(), this.target.addEventListener("focus", this.onTargetFocusListener), this.target.addEventListener("blur", this.onTargetBlurListener));
          }
          buildWeakness() {
            this.checkStrength(this.target.value), this.setWeaknessText(), this.onTargetInputSecondListener = () => setTimeout(() => this.targetInputSecond()), this.target.addEventListener("input", this.onTargetInputSecondListener);
          }
          buildRules() {
            this.setRulesText(), this.onTargetInputThirdListener = () => setTimeout(() => this.targetInputThird()), this.target.addEventListener("input", this.onTargetInputThirdListener);
          }
          setWeaknessText() {
            const e3 = this.weakness.getAttribute("data-hs-strong-password-hints-weakness-text"), t3 = JSON.parse(e3);
            this.weakness.textContent = t3[this.strength];
          }
          setRulesText() {
            this.rules.forEach((e3) => {
              const t3 = e3.getAttribute("data-hs-strong-password-hints-rule-text");
              this.checkIfPassed(e3, this.passedRules.has(t3));
            });
          }
          togglePopover() {
            const e3 = this.el.querySelector(".popover");
            e3 && e3.classList.toggle("show");
          }
          checkStrength(e3) {
            const t3 = /* @__PURE__ */ new Set(), i3 = { lowercase: /[a-z]+/, uppercase: /[A-Z]+/, numbers: /[0-9]+/, "special-characters": new RegExp(`[${this.specialCharactersSet}]`) };
            let s3 = 0;
            return this.availableChecks.includes("lowercase") && e3.match(i3.lowercase) && (s3 += 1, t3.add("lowercase")), this.availableChecks.includes("uppercase") && e3.match(i3.uppercase) && (s3 += 1, t3.add("uppercase")), this.availableChecks.includes("numbers") && e3.match(i3.numbers) && (s3 += 1, t3.add("numbers")), this.availableChecks.includes("special-characters") && e3.match(i3["special-characters"]) && (s3 += 1, t3.add("special-characters")), this.availableChecks.includes("min-length") && e3.length >= this.minLength && (s3 += 1, t3.add("min-length")), e3.length || (s3 = 0), s3 === this.availableChecks.length ? this.el.classList.add("accepted") : this.el.classList.remove("accepted"), this.strength = s3, this.passedRules = t3, { strength: this.strength, rules: this.passedRules };
          }
          checkIfPassed(e3, t3 = false) {
            const i3 = e3.querySelector("[data-check]"), s3 = e3.querySelector("[data-uncheck]");
            t3 ? (e3.classList.add("active"), i3.classList.remove("hidden"), s3.classList.add("hidden")) : (e3.classList.remove("active"), i3.classList.add("hidden"), s3.classList.remove("hidden"));
          }
          setStrength(e3) {
            const { strength: t3, rules: i3 } = this.checkStrength(e3), n3 = { strength: t3, rules: i3 };
            this.hideStrips(t3), this.fireEvent("change", n3), (0, s2.JD)("change.hs.strongPassword", this.el, n3);
          }
          hideStrips(e3) {
            Array.from(this.el.children).forEach((t3, i3) => {
              i3 < e3 ? t3.classList.add("passed") : t3.classList.remove("passed");
            });
          }
          recalculateDirection() {
            (0, s2.PR)(this.hints, this.target, "bottom", this.popoverSpace) ? (this.hints.classList.remove("bottom-full"), this.hints.classList.add("top-full"), this.hints.style.marginBottom = "", this.hints.style.marginTop = `${this.popoverSpace}px`) : (this.hints.classList.remove("top-full"), this.hints.classList.add("bottom-full"), this.hints.style.marginTop = "", this.hints.style.marginBottom = `${this.popoverSpace}px`);
          }
          destroy() {
            this.target.removeEventListener("input", this.onTargetInputListener), this.target.removeEventListener("focus", this.onTargetFocusListener), this.target.removeEventListener("blur", this.onTargetBlurListener), this.target.removeEventListener("input", this.onTargetInputSecondListener), this.target.removeEventListener("input", this.onTargetInputThirdListener), window.$hsStrongPasswordCollection = window.$hsStrongPasswordCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsStrongPasswordCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsStrongPasswordCollection || (window.$hsStrongPasswordCollection = []), window.$hsStrongPasswordCollection && (window.$hsStrongPasswordCollection = window.$hsStrongPasswordCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-strong-password]:not(.--prevent-on-load-init)").forEach((e3) => {
              if (!window.$hsStrongPasswordCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              })) {
                const t3 = e3.getAttribute("data-hs-strong-password"), i3 = t3 ? JSON.parse(t3) : {};
                new o2(e3, i3);
              }
            });
          }
        }
        const l2 = o2;
      }, 7430(e2, t2, i2) {
        i2.d(t2, { A: () => r2 });
        var s2 = i2(1926), n2 = i2(7615), o2 = i2(8862), l2 = i2(189);
        class a2 extends n2.A {
          constructor(e3, t3, i3) {
            var s3, n3;
            super(e3, t3, i3);
            const o3 = e3.getAttribute("data-hs-tabs"), a3 = o3 ? JSON.parse(o3) : {}, r3 = Object.assign(Object.assign({}, a3), t3);
            this.eventType = null !== (s3 = r3.eventType) && void 0 !== s3 ? s3 : "click", this.preventNavigationResolution = "number" == typeof r3.preventNavigationResolution ? r3.preventNavigationResolution : l2.LO[r3.preventNavigationResolution] || null, this.toggles = this.el.querySelectorAll("[data-hs-tab]"), this.extraToggleId = this.el.getAttribute("data-hs-tab-select"), this.extraToggle = this.extraToggleId ? document.querySelector(this.extraToggleId) : null, this.current = Array.from(this.toggles).find((e4) => e4.classList.contains("active")), this.currentContentId = (null === (n3 = this.current) || void 0 === n3 ? void 0 : n3.getAttribute("data-hs-tab")) || null, this.currentContent = this.currentContentId ? document.querySelector(this.currentContentId) : null, this.prev = null, this.prevContentId = null, this.prevContent = null, this.onToggleHandler = [], this.init();
          }
          toggle(e3) {
            this.open(e3);
          }
          extraToggleChange(e3) {
            this.change(e3);
          }
          init() {
            this.createCollection(window.$hsTabsCollection, this), this.toggles.forEach((e3) => {
              const t3 = (t4) => {
                "click" === this.eventType && this.preventNavigationResolution && document.body.clientWidth <= +this.preventNavigationResolution && t4.preventDefault(), this.toggle(e3);
              }, i3 = (e4) => {
                this.preventNavigationResolution && document.body.clientWidth <= +this.preventNavigationResolution && e4.preventDefault();
              };
              this.onToggleHandler.push({ el: e3, fn: t3, preventClickFn: i3 }), "click" === this.eventType ? e3.addEventListener("click", t3) : (e3.addEventListener("mouseenter", t3), e3.addEventListener("click", i3));
            }), this.extraToggle && (this.onExtraToggleChangeListener = (e3) => this.extraToggleChange(e3), this.extraToggle.addEventListener("change", this.onExtraToggleChangeListener)), "undefined" != typeof window && (window.HSAccessibilityObserver || (window.HSAccessibilityObserver = new o2.A()), this.setupAccessibility());
          }
          open(e3) {
            var t3, i3, n3, o3, l3;
            this.prev = this.current, this.prevContentId = this.currentContentId, this.prevContent = this.currentContent, this.current = e3, this.currentContentId = e3.getAttribute("data-hs-tab"), this.currentContent = this.currentContentId ? document.querySelector(this.currentContentId) : null, (null === (t3 = null == this ? void 0 : this.prev) || void 0 === t3 ? void 0 : t3.ariaSelected) && (this.prev.ariaSelected = "false"), null === (i3 = this.prev) || void 0 === i3 || i3.classList.remove("active"), null === (n3 = this.prevContent) || void 0 === n3 || n3.classList.add("hidden"), (null === (o3 = null == this ? void 0 : this.current) || void 0 === o3 ? void 0 : o3.ariaSelected) && (this.current.ariaSelected = "true"), this.current.classList.add("active"), null === (l3 = this.currentContent) || void 0 === l3 || l3.classList.remove("hidden"), this.fireEvent("change", { el: e3, prev: this.prevContentId, current: this.currentContentId, tabsId: this.el.id }), (0, s2.JD)("change.hs.tab", e3, { el: e3, prev: this.prevContentId, current: this.currentContentId, tabsId: this.el.id });
          }
          change(e3) {
            const t3 = document.querySelector(`[data-hs-tab="${e3.target.value}"]`);
            t3 && ("hover" === this.eventType ? t3.dispatchEvent(new Event("mouseenter")) : t3.click());
          }
          setupAccessibility() {
            this.accessibilityComponent = window.HSAccessibilityObserver.registerComponent(this.el, { onArrow: (e3) => {
              if (e3.metaKey) return;
              const t3 = "true" === this.el.getAttribute("data-hs-tabs-vertical") || "vertical" === this.el.getAttribute("aria-orientation");
              switch (e3.key) {
                case (t3 ? "ArrowUp" : "ArrowLeft"):
                  this.onArrow(true);
                  break;
                case (t3 ? "ArrowDown" : "ArrowRight"):
                  this.onArrow(false);
                  break;
                case "Home":
                  this.onStartEnd(true);
                  break;
                case "End":
                  this.onStartEnd(false);
              }
            } }, true, "Tabs", '[role="tablist"]');
          }
          onArrow(e3 = true) {
            const t3 = e3 ? Array.from(this.toggles).reverse() : Array.from(this.toggles), i3 = t3.find((e4) => document.activeElement === e4);
            let s3 = t3.findIndex((e4) => e4 === i3);
            s3 = s3 + 1 < t3.length ? s3 + 1 : 0, t3[s3].focus(), t3[s3].click();
          }
          onStartEnd(e3 = true) {
            const t3 = e3 ? Array.from(this.toggles) : Array.from(this.toggles).reverse();
            t3.length && (t3[0].focus(), t3[0].click());
          }
          destroy() {
            this.toggles.forEach((e3) => {
              var t3;
              const i3 = null === (t3 = this.onToggleHandler) || void 0 === t3 ? void 0 : t3.find(({ el: t4 }) => t4 === e3);
              i3 && ("click" === this.eventType ? e3.removeEventListener("click", i3.fn) : (e3.removeEventListener("mouseenter", i3.fn), e3.removeEventListener("click", i3.preventClickFn)));
            }), this.onToggleHandler = [], this.extraToggle && this.extraToggle.removeEventListener("change", this.onExtraToggleChangeListener), "undefined" != typeof window && window.HSAccessibilityObserver && window.HSAccessibilityObserver.unregisterComponent(this.accessibilityComponent), window.$hsTabsCollection = window.$hsTabsCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsTabsCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsTabsCollection || (window.$hsTabsCollection = []), window.$hsTabsCollection && (window.$hsTabsCollection = window.$hsTabsCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll('[role="tablist"]:not(select):not(.--prevent-on-load-init)').forEach((e3) => {
              window.$hsTabsCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new a2(e3);
            });
          }
          static open(e3) {
            const t3 = window.$hsTabsCollection.find((t4) => Array.from(t4.element.toggles).includes("string" == typeof e3 ? document.querySelector(e3) : e3)), i3 = t3 ? Array.from(t3.element.toggles).find((t4) => t4 === ("string" == typeof e3 ? document.querySelector(e3) : e3)) : null;
            i3 && !i3.classList.contains("active") && t3.element.open(i3);
          }
          static on(e3, t3, i3) {
            const s3 = window.$hsTabsCollection.find((e4) => Array.from(e4.element.toggles).includes("string" == typeof t3 ? document.querySelector(t3) : t3));
            s3 && (s3.element.events[e3] = i3);
          }
        }
        const r2 = a2;
      }, 6955(e2, t2, i2) {
        i2.d(t2, { A: () => o2 });
        var s2 = i2(7615);
        class n2 extends s2.A {
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = e3.getAttribute("data-hs-copy-markup"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.defaultHeight = (null == n3 ? void 0 : n3.defaultHeight) || 0, this.init();
          }
          elementInput() {
            this.textareaSetHeight(3);
          }
          init() {
            this.createCollection(window.$hsTextareaAutoHeightCollection, this), this.setAutoHeight();
          }
          setAutoHeight() {
            this.isParentHidden() ? this.callbackAccordingToType() : this.textareaSetHeight(3), this.onElementInputListener = () => this.elementInput(), this.el.addEventListener("input", this.onElementInputListener);
          }
          textareaSetHeight(e3 = 0) {
            this.el.style.height = "auto", this.el.style.height = this.checkIfOneLine() && this.defaultHeight ? `${this.defaultHeight}px` : `${this.el.scrollHeight + e3}px`;
          }
          checkIfOneLine() {
            const e3 = this.el.clientHeight;
            return !(this.el.scrollHeight > e3);
          }
          isParentHidden() {
            return this.el.closest(".hs-overlay.hidden") || this.el.closest('[role="tabpanel"].hidden') || this.el.closest(".hs-collapse.hidden");
          }
          parentType() {
            return this.el.closest(".hs-collapse") ? "collapse" : this.el.closest(".hs-overlay") ? "overlay" : !!this.el.closest('[role="tabpanel"]') && "tabs";
          }
          callbackAccordingToType() {
            var e3;
            if ("collapse" === this.parentType()) {
              const e4 = this.el.closest(".hs-collapse").id, { element: t3 } = window.HSCollapse.getInstance(`[data-hs-collapse="#${e4}"]`, true);
              t3.on("beforeOpen", () => {
                if (!this.el) return false;
                this.textareaSetHeight(3);
              });
            } else if ("overlay" === this.parentType()) {
              const e4 = window.HSOverlay.getInstance(this.el.closest(".hs-overlay"), true);
              e4.element.on("open", () => {
                window.$hsTextareaAutoHeightCollection.filter(({ element: t3 }) => t3.el.closest(".hs-overlay") === e4.element.el).forEach(({ element: e5 }) => e5.textareaSetHeight(3));
              });
            } else {
              if ("tabs" !== this.parentType()) return false;
              {
                const t3 = null === (e3 = this.el.closest('[role="tabpanel"]')) || void 0 === e3 ? void 0 : e3.id, i3 = document.querySelector(`[data-hs-tab="#${t3}"]`).closest('[role="tablist"]'), { element: s3 } = window.HSTabs.getInstance(i3, true) || null;
                s3.on("change", (e4) => {
                  const t4 = document.querySelectorAll(`${e4.current} [data-hs-textarea-auto-height]`);
                  if (!t4.length) return false;
                  t4.forEach((e5) => {
                    const t5 = window.HSTextareaAutoHeight.getInstance(e5, true) || null;
                    t5 && t5.element.textareaSetHeight(3);
                  });
                });
              }
            }
          }
          destroy() {
            this.el.removeEventListener("input", this.onElementInputListener), window.$hsTextareaAutoHeightCollection = window.$hsTextareaAutoHeightCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsTextareaAutoHeightCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsTextareaAutoHeightCollection || (window.$hsTextareaAutoHeightCollection = []), window.$hsTextareaAutoHeightCollection && (window.$hsTextareaAutoHeightCollection = window.$hsTextareaAutoHeightCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-textarea-auto-height]:not(.--prevent-on-load-init)").forEach((e3) => {
              if (!window.$hsTextareaAutoHeightCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              })) {
                const t3 = e3.getAttribute("data-hs-textarea-auto-height"), i3 = t3 ? JSON.parse(t3) : {};
                new n2(e3, i3);
              }
            });
          }
        }
        const o2 = n2;
      }, 7189(e2, t2, i2) {
        i2.d(t2, { A: () => o2 });
        var s2 = i2(7615);
        class n2 extends s2.A {
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = e3.getAttribute("data-hs-theme-switch"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.theme = (null == n3 ? void 0 : n3.theme) || localStorage.getItem("hs_theme") || "default", this.type = (null == n3 ? void 0 : n3.type) || "change", this.init();
          }
          elementChange(e3) {
            const t3 = e3.target.checked ? "dark" : "default";
            this.setAppearance(t3), this.toggleObserveSystemTheme();
          }
          elementClick(e3) {
            this.setAppearance(e3), this.toggleObserveSystemTheme();
          }
          init() {
            this.createCollection(window.$hsThemeSwitchCollection, this), "default" !== this.theme && this.setAppearance(), "click" === this.type ? this.buildSwitchTypeOfClick() : this.buildSwitchTypeOfChange();
          }
          buildSwitchTypeOfChange() {
            this.el.checked = "dark" === this.theme, this.toggleObserveSystemTheme(), this.onElementChangeListener = (e3) => this.elementChange(e3), this.el.addEventListener("change", this.onElementChangeListener);
          }
          buildSwitchTypeOfClick() {
            const e3 = this.el.getAttribute("data-hs-theme-click-value");
            this.toggleObserveSystemTheme(), this.onElementClickListener = () => this.elementClick(e3), this.el.addEventListener("click", this.onElementClickListener);
          }
          setResetStyles() {
            const e3 = document.createElement("style");
            return e3.innerText = "*{transition: unset !important;}", e3.setAttribute("data-hs-appearance-onload-styles", ""), document.head.appendChild(e3), e3;
          }
          addSystemThemeObserver() {
            n2.systemThemeObserver || (n2.systemThemeObserver = (e3) => {
              var t3;
              null === (t3 = window.$hsThemeSwitchCollection) || void 0 === t3 || t3.forEach((e4) => {
                "auto" === localStorage.getItem("hs_theme") && e4.element.setAppearance("auto", false);
              });
            }, window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", n2.systemThemeObserver));
          }
          removeSystemThemeObserver() {
            n2.systemThemeObserver && (window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", n2.systemThemeObserver), n2.systemThemeObserver = null);
          }
          toggleObserveSystemTheme() {
            "auto" === localStorage.getItem("hs_theme") ? this.addSystemThemeObserver() : this.removeSystemThemeObserver();
          }
          setAppearance(e3 = this.theme, t3 = true, i3 = true) {
            const s3 = document.querySelector("html"), n3 = this.setResetStyles();
            t3 && localStorage.setItem("hs_theme", e3);
            let o3 = e3;
            "default" === o3 && (o3 = "light"), "auto" === o3 && (o3 = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"), s3.classList.remove("light", "dark", "default", "auto"), "auto" === e3 ? s3.classList.add("auto", o3) : s3.classList.add(o3), setTimeout(() => n3.remove()), i3 && window.dispatchEvent(new CustomEvent("on-hs-appearance-change", { detail: e3 }));
          }
          destroy() {
            "change" === this.type && this.el.removeEventListener("change", this.onElementChangeListener), "click" === this.type && this.el.removeEventListener("click", this.onElementClickListener), window.$hsThemeSwitchCollection = window.$hsThemeSwitchCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsThemeSwitchCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsThemeSwitchCollection || (window.$hsThemeSwitchCollection = []), window.$hsThemeSwitchCollection && (window.$hsThemeSwitchCollection = window.$hsThemeSwitchCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-theme-switch]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsThemeSwitchCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new n2(e3, { type: "change" });
            }), document.querySelectorAll("[data-hs-theme-click-value]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsThemeSwitchCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new n2(e3, { type: "click" });
            });
          }
        }
        n2.systemThemeObserver = null;
        const o2 = n2;
      }, 11(e2, t2, i2) {
        i2.d(t2, { A: () => o2 });
        var s2 = i2(7615);
        class n2 extends s2.A {
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = e3.getAttribute("data-hs-toggle-count"), s3 = i3 ? JSON.parse(i3) : {}, n3 = Object.assign(Object.assign({}, s3), t3);
            this.target = (null == n3 ? void 0 : n3.target) ? "string" == typeof (null == n3 ? void 0 : n3.target) ? document.querySelector(n3.target) : n3.target : null, this.min = (null == n3 ? void 0 : n3.min) || 0, this.max = (null == n3 ? void 0 : n3.max) || 0, this.duration = (null == n3 ? void 0 : n3.duration) || 700, this.isChecked = this.target.checked || false, this.target && this.init();
          }
          toggleChange() {
            this.isChecked = !this.isChecked, this.toggle();
          }
          init() {
            this.createCollection(window.$hsToggleCountCollection, this), this.isChecked && (this.el.innerText = String(this.max)), this.onToggleChangeListener = () => this.toggleChange(), this.target.addEventListener("change", this.onToggleChangeListener);
          }
          toggle() {
            this.isChecked ? this.countUp() : this.countDown();
          }
          animate(e3, t3) {
            let i3 = 0;
            const s3 = (n3) => {
              i3 || (i3 = n3);
              const o3 = Math.min((n3 - i3) / this.duration, 1);
              this.el.innerText = String(Math.floor(o3 * (t3 - e3) + e3)), o3 < 1 && window.requestAnimationFrame(s3);
            };
            window.requestAnimationFrame(s3);
          }
          countUp() {
            this.animate(this.min, this.max);
          }
          countDown() {
            this.animate(this.max, this.min);
          }
          destroy() {
            this.target.removeEventListener("change", this.onToggleChangeListener), window.$hsToggleCountCollection = window.$hsToggleCountCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsToggleCountCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsToggleCountCollection || (window.$hsToggleCountCollection = []), window.$hsToggleCountCollection && (window.$hsToggleCountCollection = window.$hsToggleCountCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-toggle-count]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsToggleCountCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new n2(e3);
            });
          }
        }
        const o2 = n2;
      }, 847(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3) {
            super(e3, t3);
            const i3 = e3.getAttribute("data-hs-toggle-password"), n3 = i3 ? JSON.parse(i3) : {}, o3 = Object.assign(Object.assign({}, n3), t3), l3 = [];
            if ((null == o3 ? void 0 : o3.target) && "string" == typeof (null == o3 ? void 0 : o3.target)) {
              (null == o3 ? void 0 : o3.target.split(",")).forEach((e4) => {
                l3.push(document.querySelector(e4));
              });
            } else (null == o3 ? void 0 : o3.target) && "object" == typeof (null == o3 ? void 0 : o3.target) ? o3.target.forEach((e4) => l3.push(document.querySelector(e4))) : o3.target.forEach((e4) => l3.push(e4));
            this.target = l3, this.isShown = !!this.el.hasAttribute("type") && this.el.checked, this.eventType = (0, s2.V6)(this.el) ? "change" : "click", this.isMultiple = this.target.length > 1 && !!this.el.closest("[data-hs-toggle-password-group]"), this.target && this.init();
          }
          elementAction() {
            this.isShown ? this.hide() : this.show(), this.fireEvent("toggle", this.target), (0, s2.JD)("toggle.hs.toggle-select", this.el, this.target);
          }
          init() {
            this.createCollection(window.$hsTogglePasswordCollection, this), this.isShown ? this.show() : this.hide(), this.onElementActionListener = () => this.elementAction(), this.el.addEventListener(this.eventType, this.onElementActionListener);
          }
          getMultipleToggles() {
            const e3 = this.el.closest("[data-hs-toggle-password-group]").querySelectorAll("[data-hs-toggle-password]"), t3 = [];
            return e3.forEach((e4) => {
              t3.push(o2.getInstance(e4));
            }), t3;
          }
          show() {
            if (this.isMultiple) {
              this.getMultipleToggles().forEach((e3) => !!e3 && (e3.isShown = true)), this.el.closest("[data-hs-toggle-password-group]").classList.add("active");
            } else this.isShown = true, this.el.classList.add("active");
            this.target.forEach((e3) => {
              e3.type = "text";
            });
          }
          hide() {
            if (this.isMultiple) {
              this.getMultipleToggles().forEach((e3) => !!e3 && (e3.isShown = false)), this.el.closest("[data-hs-toggle-password-group]").classList.remove("active");
            } else this.isShown = false, this.el.classList.remove("active");
            this.target.forEach((e3) => {
              e3.type = "password";
            });
          }
          destroy() {
            this.isMultiple ? this.el.closest("[data-hs-toggle-password-group]").classList.remove("active") : this.el.classList.remove("active"), this.target.forEach((e3) => {
              e3.type = "password";
            }), this.el.removeEventListener(this.eventType, this.onElementActionListener), this.isShown = false, window.$hsTogglePasswordCollection = window.$hsTogglePasswordCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsTogglePasswordCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element : null;
          }
          static autoInit() {
            window.$hsTogglePasswordCollection || (window.$hsTogglePasswordCollection = []), window.$hsTogglePasswordCollection && (window.$hsTogglePasswordCollection = window.$hsTogglePasswordCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-toggle-password]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsTogglePasswordCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
        }
        const l2 = o2;
      }, 9060(e2, t2, i2) {
        i2.d(t2, { A: () => c2 });
        var s2 = i2(7663), n2 = i2(1926), o2 = i2(7615), l2 = i2(189), a2 = function(e3, t3, i3, s3) {
          return new (i3 || (i3 = Promise))(function(n3, o3) {
            function l3(e4) {
              try {
                r3(s3.next(e4));
              } catch (e5) {
                o3(e5);
              }
            }
            function a3(e4) {
              try {
                r3(s3.throw(e4));
              } catch (e5) {
                o3(e5);
              }
            }
            function r3(e4) {
              var t4;
              e4.done ? n3(e4.value) : (t4 = e4.value, t4 instanceof i3 ? t4 : new i3(function(e5) {
                e5(t4);
              })).then(l3, a3);
            }
            r3((s3 = s3.apply(e3, t3 || [])).next());
          });
        };
        class r2 extends o2.A {
          constructor(e3, t3, i3) {
            super(e3, t3, i3), this.cleanupAutoUpdate = null, window.$hsTooltipCollection || (window.$hsTooltipCollection = []), this.el && (this.toggle = this.el.querySelector(".hs-tooltip-toggle") || this.el, this.content = this.el.querySelector(".hs-tooltip-content"), this.eventMode = (0, n2.gj)(this.el, "--trigger") || "hover", this.preventFloatingUI = (0, n2.gj)(this.el, "--prevent-popper", "false"), this.placement = (0, n2.gj)(this.el, "--placement") || "top", this.strategy = (0, n2.gj)(this.el, "--strategy"), this.scope = (0, n2.gj)(this.el, "--scope") || "parent"), this.el && this.toggle && this.content && this.init();
          }
          toggleClick() {
            this.click();
          }
          toggleFocus() {
            this.focus();
          }
          toggleMouseEnter() {
            this.enter();
          }
          toggleMouseLeave() {
            this.leave();
          }
          toggleHandle() {
            this.hide(), this.toggle.removeEventListener("click", this.onToggleHandleListener, true), this.toggle.removeEventListener("blur", this.onToggleHandleListener, true);
          }
          hideOtherTooltips() {
            window.$hsTooltipCollection && window.$hsTooltipCollection.forEach(({ element: e3 }) => e3.el !== this.el && (!!e3.el.classList.contains("show") && void e3.hide()));
          }
          init() {
            this.createCollection(window.$hsTooltipCollection, this), this.onToggleFocusListener = () => this.enter(), this.onToggleBlurListener = () => this.hide(), this.toggle.addEventListener("focus", this.onToggleFocusListener), this.toggle.addEventListener("blur", this.onToggleBlurListener), "click" === this.eventMode ? (this.onToggleClickListener = () => this.toggleClick(), this.toggle.addEventListener("click", this.onToggleClickListener)) : "hover" === this.eventMode && (this.onToggleMouseEnterListener = () => this.toggleMouseEnter(), this.onToggleMouseLeaveListener = () => this.toggleMouseLeave(), this.toggle.addEventListener("mouseenter", this.onToggleMouseEnterListener), this.toggle.addEventListener("mouseleave", this.onToggleMouseLeaveListener));
          }
          enter() {
            this._show();
          }
          leave() {
            this.hide();
          }
          click() {
            if (this.el.classList.contains("show")) return false;
            this._show(), this.onToggleHandleListener = () => {
              setTimeout(() => this.toggleHandle());
            }, this.toggle.addEventListener("click", this.onToggleHandleListener, true), this.toggle.addEventListener("blur", this.onToggleHandleListener, true);
          }
          focus() {
            this._show();
          }
          positionTooltip(e3) {
            return a2(this, void 0, void 0, function* () {
              const t3 = "auto" === e3 ? "top" : e3, i3 = "auto" === e3 ? ["bottom", "left", "right"] : this.getFallbackPlacements(t3), n3 = [(0, s2.cY)(5), (0, s2.UU)({ fallbackPlacements: i3 })];
              return yield (0, s2.rD)(this.toggle, this.content, { placement: t3, strategy: this.strategy || "fixed", middleware: n3 });
            });
          }
          getFallbackPlacements(e3) {
            switch (e3) {
              case "top":
                return ["bottom", "left", "right"];
              case "bottom":
                return ["top", "left", "right"];
              case "left":
                return ["right", "top", "bottom"];
              case "right":
                return ["left", "top", "bottom"];
              case "top-start":
                return ["bottom-start", "top-end", "bottom-end"];
              case "top-end":
                return ["bottom-end", "top-start", "bottom-start"];
              case "bottom-start":
                return ["top-start", "bottom-end", "top-end"];
              case "bottom-end":
                return ["top-end", "bottom-start", "top-start"];
              case "left-start":
                return ["right-start", "left-end", "right-end"];
              case "left-end":
                return ["right-end", "left-start", "right-start"];
              case "right-start":
                return ["left-start", "right-end", "left-end"];
              case "right-end":
                return ["left-end", "right-start", "left-start"];
              default:
                return ["top", "bottom", "left", "right"];
            }
          }
          applyTooltipPosition(e3, t3, i3) {
            Object.assign(this.content.style, { position: this.strategy || "fixed", left: `${e3}px`, top: `${t3}px` }), this.content.setAttribute("data-placement", i3);
          }
          buildFloatingUI() {
            "window" === this.scope && document.body.appendChild(this.content);
            const e3 = this.placement.startsWith("auto"), t3 = (0, n2.gj)(this.el, "--placement"), i3 = e3 || (!t3 || "" === t3) ? "auto" : l2.lP[this.placement] || this.placement;
            this.positionTooltip(i3).then((e4) => {
              this.applyTooltipPosition(e4.x, e4.y, e4.placement);
            }), this.cleanupAutoUpdate = (0, s2.ll)(this.toggle, this.content, () => {
              this.positionTooltip(i3).then((e4) => {
                Object.assign(this.content.style, { position: this.strategy || "fixed", left: `${e4.x}px`, top: `${e4.y}px` }), this.content.setAttribute("data-placement", e4.placement);
              });
            });
          }
          _show() {
            if (this.el.classList.contains("show")) return false;
            this.hideOtherTooltips(), this.content.classList.remove("hidden"), "window" === this.scope && this.content.classList.add("show"), "false" !== this.preventFloatingUI || this.cleanupAutoUpdate || this.buildFloatingUI(), setTimeout(() => {
              this.el.classList.add("show"), this.fireEvent("show", this.el), (0, n2.JD)("show.hs.tooltip", this.el, this.el);
            });
          }
          show() {
            "click" === this.eventMode ? this.click() : this.enter(), this.toggle.focus(), this.toggle.style.outline = "none";
          }
          hide() {
            this.el.classList.remove("show"), "window" === this.scope && this.content.classList.remove("show"), "false" === this.preventFloatingUI && this.cleanupAutoUpdate && (this.cleanupAutoUpdate(), this.cleanupAutoUpdate = null), this.fireEvent("hide", this.el), (0, n2.JD)("hide.hs.tooltip", this.el, this.el), (0, n2.yd)(this.content, () => {
              if (this.el.classList.contains("show")) return false;
              this.content.classList.add("hidden"), this.toggle.style.outline = "";
            });
          }
          destroy() {
            this.el.classList.remove("show"), this.content.classList.add("hidden"), this.toggle.removeEventListener("focus", this.onToggleFocusListener), this.toggle.removeEventListener("blur", this.onToggleBlurListener), "click" === this.eventMode ? this.toggle.removeEventListener("click", this.onToggleClickListener) : "hover" === this.eventMode && (this.toggle.removeEventListener("mouseenter", this.onToggleMouseEnterListener), this.toggle.removeEventListener("mouseleave", this.onToggleMouseLeaveListener)), this.toggle.removeEventListener("click", this.onToggleHandleListener, true), this.toggle.removeEventListener("blur", this.onToggleHandleListener, true), this.cleanupAutoUpdate && (this.cleanupAutoUpdate(), this.cleanupAutoUpdate = null), window.$hsTooltipCollection = window.$hsTooltipCollection.filter(({ element: e3 }) => e3.el !== this.el);
          }
          static findInCollection(e3) {
            return window.$hsTooltipCollection.find((t3) => e3 instanceof r2 ? t3.element.el === e3.el : "string" == typeof e3 ? t3.element.el === document.querySelector(e3) : t3.element.el === e3) || null;
          }
          static getInstance(e3, t3 = false) {
            const i3 = window.$hsTooltipCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsTooltipCollection || (window.$hsTooltipCollection = []), window.$hsTooltipCollection && (window.$hsTooltipCollection = window.$hsTooltipCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll(".hs-tooltip:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsTooltipCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new r2(e3);
            });
          }
          static show(e3) {
            const t3 = r2.findInCollection(e3);
            t3 && t3.element.show();
          }
          static hide(e3) {
            const t3 = r2.findInCollection(e3);
            t3 && t3.element.hide();
          }
          static on(e3, t3, i3) {
            const s3 = r2.findInCollection(t3);
            s3 && (s3.element.events[e3] = i3);
          }
        }
        const c2 = r2;
      }, 1771(e2, t2, i2) {
        i2.d(t2, { A: () => l2 });
        var s2 = i2(1926), n2 = i2(7615);
        class o2 extends n2.A {
          constructor(e3, t3, i3) {
            super(e3, t3, i3), this.items = [];
            const s3 = e3.getAttribute("data-hs-tree-view"), n3 = s3 ? JSON.parse(s3) : {}, o3 = Object.assign(Object.assign({}, n3), t3);
            this.controlBy = (null == o3 ? void 0 : o3.controlBy) || "button", this.autoSelectChildren = (null == o3 ? void 0 : o3.autoSelectChildren) || false, this.isIndeterminate = (null == o3 ? void 0 : o3.isIndeterminate) || true, this.onElementClickListener = [], this.onControlChangeListener = [], this.init();
          }
          elementClick(e3, t3, i3) {
            if (e3.stopPropagation(), t3.classList.contains("disabled")) return false;
            e3.metaKey || e3.shiftKey || this.unselectItem(i3), this.selectItem(t3, i3), this.fireEvent("click", { el: t3, data: i3 }), (0, s2.JD)("click.hs.treeView", this.el, { el: t3, data: i3 });
          }
          controlChange(e3, t3) {
            this.autoSelectChildren ? (this.selectItem(e3, t3), t3.isDir && this.selectChildren(e3, t3), this.toggleParent(e3)) : this.selectItem(e3, t3);
          }
          init() {
            this.createCollection(window.$hsTreeViewCollection, this), o2.group += 1, this.initItems();
          }
          initItems() {
            this.el.querySelectorAll("[data-hs-tree-view-item]").forEach((e3, t3) => {
              var i3, s3;
              const n3 = JSON.parse(e3.getAttribute("data-hs-tree-view-item"));
              e3.id || (e3.id = `tree-view-item-${o2.group}-${t3}`);
              const l3 = Object.assign(Object.assign({}, n3), { id: null !== (i3 = n3.id) && void 0 !== i3 ? i3 : e3.id, path: this.getPath(e3), isSelected: null !== (s3 = n3.isSelected) && void 0 !== s3 && s3 });
              this.items.push(l3), "checkbox" === this.controlBy ? this.controlByCheckbox(e3, l3) : this.controlByButton(e3, l3);
            });
          }
          controlByButton(e3, t3) {
            this.onElementClickListener.push({ el: e3, fn: (i3) => this.elementClick(i3, e3, t3) }), e3.addEventListener("click", this.onElementClickListener.find((t4) => t4.el === e3).fn);
          }
          controlByCheckbox(e3, t3) {
            const i3 = e3.querySelector(`input[value="${t3.value}"]`);
            i3 && (this.onControlChangeListener.push({ el: i3, fn: () => this.controlChange(e3, t3) }), i3.addEventListener("change", this.onControlChangeListener.find((e4) => e4.el === i3).fn));
          }
          getItem(e3) {
            return this.items.find((t3) => t3.id === e3);
          }
          getPath(e3) {
            var t3;
            const i3 = [];
            let s3 = e3.closest("[data-hs-tree-view-item]");
            for (; s3; ) {
              const e4 = JSON.parse(s3.getAttribute("data-hs-tree-view-item"));
              i3.push(e4.value), s3 = null === (t3 = s3.parentElement) || void 0 === t3 ? void 0 : t3.closest("[data-hs-tree-view-item]");
            }
            return i3.reverse().join("/");
          }
          unselectItem(e3 = null) {
            let t3 = this.getSelectedItems();
            e3 && (t3 = t3.filter((t4) => t4.id !== e3.id)), t3.length && t3.forEach((e4) => {
              document.querySelector(`#${e4.id}`).classList.remove("selected"), this.changeItemProp(e4.id, "isSelected", false);
            });
          }
          selectItem(e3, t3) {
            t3.isSelected ? (e3.classList.remove("selected"), this.changeItemProp(t3.id, "isSelected", false)) : (e3.classList.add("selected"), this.changeItemProp(t3.id, "isSelected", true));
          }
          selectChildren(e3, t3) {
            const i3 = e3.querySelectorAll("[data-hs-tree-view-item]");
            Array.from(i3).filter((e4) => !e4.classList.contains("disabled")).forEach((e4) => {
              const i4 = e4.id ? this.getItem(e4.id) : null;
              if (!i4) return false;
              t3.isSelected ? (e4.classList.add("selected"), this.changeItemProp(i4.id, "isSelected", true)) : (e4.classList.remove("selected"), this.changeItemProp(i4.id, "isSelected", false));
              const s3 = this.getItem(e4.id), n3 = e4.querySelector(`input[value="${s3.value}"]`);
              this.isIndeterminate && (n3.indeterminate = false), s3.isSelected ? n3.checked = true : n3.checked = false;
            });
          }
          toggleParent(e3) {
            var t3, i3;
            let s3 = null === (t3 = e3.parentElement) || void 0 === t3 ? void 0 : t3.closest("[data-hs-tree-view-item]");
            for (; s3; ) {
              const e4 = s3.querySelectorAll("[data-hs-tree-view-item]:not(.disabled)"), t4 = JSON.parse(s3.getAttribute("data-hs-tree-view-item")), n3 = s3.querySelector(`input[value="${t4.value}"]`);
              let o3 = false, l3 = 0;
              e4.forEach((e5) => {
                const t5 = this.getItem(e5.id);
                t5.isSelected && (l3 += 1), t5.isSelected || (o3 = true);
              }), o3 ? (s3.classList.remove("selected"), this.changeItemProp(s3.id, "isSelected", false), n3.checked = false) : (s3.classList.add("selected"), this.changeItemProp(s3.id, "isSelected", true), n3.checked = true), this.isIndeterminate && (l3 > 0 && l3 < e4.length ? n3.indeterminate = true : n3.indeterminate = false), s3 = null === (i3 = s3.parentElement) || void 0 === i3 ? void 0 : i3.closest("[data-hs-tree-view-item]");
            }
          }
          update() {
            this.items.map((e3) => {
              const t3 = document.querySelector(`#${e3.id}`);
              return e3.path !== this.getPath(t3) && (e3.path = this.getPath(t3)), e3;
            });
          }
          getSelectedItems() {
            return this.items.filter((e3) => e3.isSelected);
          }
          changeItemProp(e3, t3, i3) {
            this.items.map((s3) => (s3.id === e3 && (s3[t3] = i3), s3));
          }
          destroy() {
            this.onElementClickListener.forEach(({ el: e3, fn: t3 }) => {
              e3.removeEventListener("click", t3);
            }), this.onControlChangeListener.length && this.onElementClickListener.forEach(({ el: e3, fn: t3 }) => {
              e3.removeEventListener("change", t3);
            }), this.unselectItem(), this.items = [], window.$hsTreeViewCollection = window.$hsTreeViewCollection.filter(({ element: e3 }) => e3.el !== this.el), o2.group -= 1;
          }
          static findInCollection(e3) {
            return window.$hsTreeViewCollection.find((t3) => e3 instanceof o2 ? t3.element.el === e3.el : "string" == typeof e3 ? t3.element.el === document.querySelector(e3) : t3.element.el === e3) || null;
          }
          static getInstance(e3, t3) {
            const i3 = window.$hsTreeViewCollection.find((t4) => t4.element.el === ("string" == typeof e3 ? document.querySelector(e3) : e3));
            return i3 ? t3 ? i3 : i3.element.el : null;
          }
          static autoInit() {
            window.$hsTreeViewCollection || (window.$hsTreeViewCollection = []), window.$hsTreeViewCollection && (window.$hsTreeViewCollection = window.$hsTreeViewCollection.filter(({ element: e3 }) => document.contains(e3.el))), document.querySelectorAll("[data-hs-tree-view]:not(.--prevent-on-load-init)").forEach((e3) => {
              window.$hsTreeViewCollection.find((t3) => {
                var i3;
                return (null === (i3 = null == t3 ? void 0 : t3.element) || void 0 === i3 ? void 0 : i3.el) === e3;
              }) || new o2(e3);
            });
          }
          static on(e3, t3, i3) {
            const s3 = o2.findInCollection(t3);
            s3 && (s3.element.events[e3] = i3);
          }
        }
        o2.group = 0;
        const l2 = o2;
      }, 1926(e2, t2, i2) {
        i2.d(t2, { BF: () => o2, Fh: () => d2, JD: () => u2, PK: () => s2, PR: () => l2, V6: () => a2, en: () => g2, fc: () => m2, gj: () => n2, sg: () => h2, un: () => r2, yd: () => p2, zG: () => c2 });
        const s2 = (e3) => "true" === e3, n2 = (e3, t3, i3 = "") => (window.getComputedStyle(e3).getPropertyValue(t3) || i3).replace(" ", ""), o2 = (e3, t3, i3 = "") => {
          let s3 = "";
          return e3.classList.forEach((e4) => {
            e4.includes(t3) && (s3 = e4);
          }), s3.match(/:(.*)]/) ? s3.match(/:(.*)]/)[1] : i3;
        }, l2 = (e3, t3, i3 = "auto", s3 = 10, n3 = null) => {
          const o3 = t3.getBoundingClientRect(), l3 = n3 ? n3.getBoundingClientRect() : null, a3 = window.innerHeight, r3 = l3 ? o3.top - l3.top : o3.top, c3 = (n3 ? l3.bottom : a3) - o3.bottom, d3 = e3.clientHeight + s3;
          return "bottom" === i3 ? c3 >= d3 : "top" === i3 ? r3 >= d3 : r3 >= d3 || c3 >= d3;
        }, a2 = (e3) => e3 instanceof HTMLInputElement || e3 instanceof HTMLTextAreaElement || e3 instanceof HTMLSelectElement, r2 = () => !!/iPad|iPhone|iPod/.test(navigator.platform) || navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform), c2 = () => navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform), d2 = (e3) => {
          if ("string" != typeof e3) return false;
          const t3 = e3.trim()[0], i3 = e3.trim().slice(-1);
          if ("{" === t3 && "}" === i3 || "[" === t3 && "]" === i3) try {
            return JSON.parse(e3), true;
          } catch (e4) {
            return false;
          }
          return false;
        }, h2 = (e3, t3 = 200) => {
          let i3;
          return (...s3) => {
            clearTimeout(i3), i3 = setTimeout(() => {
              e3.apply(void 0, s3);
            }, t3);
          };
        }, u2 = (e3, t3, i3 = null) => {
          const s3 = new CustomEvent(e3, { detail: { payload: i3 }, bubbles: true, cancelable: true, composed: false });
          t3.dispatchEvent(s3);
        }, p2 = (e3, t3) => {
          const i3 = () => {
            t3(), e3.removeEventListener("transitionend", i3, true);
          }, s3 = window.getComputedStyle(e3), n3 = s3.getPropertyValue("transition-duration");
          "none" !== s3.getPropertyValue("transition-property") && parseFloat(n3) > 0 ? e3.addEventListener("transitionend", i3, true) : t3();
        }, m2 = (e3) => {
          const t3 = document.createElement("template");
          return e3 = e3.trim(), t3.innerHTML = e3, t3.content.firstChild;
        }, g2 = (e3, t3, i3 = " ", s3 = "add") => {
          e3.split(i3).forEach((e4) => {
            e4.trim() && ("add" === s3 ? t3.classList.add(e4) : t3.classList.remove(e4));
          });
        };
      }, 7663(e2, t2, i2) {
        i2.d(t2, { ll: () => ue, rD: () => ge, UU: () => me, cY: () => pe });
        const s2 = Math.min, n2 = Math.max, o2 = Math.round, l2 = Math.floor, a2 = (e3) => ({ x: e3, y: e3 }), r2 = { left: "right", right: "left", bottom: "top", top: "bottom" };
        function c2(e3, t3) {
          return "function" == typeof e3 ? e3(t3) : e3;
        }
        function d2(e3) {
          return e3.split("-")[0];
        }
        function h2(e3) {
          return e3.split("-")[1];
        }
        function u2(e3) {
          return "y" === e3 ? "height" : "width";
        }
        function p2(e3) {
          const t3 = e3[0];
          return "t" === t3 || "b" === t3 ? "y" : "x";
        }
        function m2(e3) {
          return "x" === p2(e3) ? "y" : "x";
        }
        function g2(e3) {
          return e3.includes("start") ? e3.replace("start", "end") : e3.replace("end", "start");
        }
        const v2 = ["left", "right"], f2 = ["right", "left"], y2 = ["top", "bottom"], b2 = ["bottom", "top"];
        function w2(e3, t3, i3, s3) {
          const n3 = h2(e3);
          let o3 = (function(e4, t4, i4) {
            switch (e4) {
              case "top":
              case "bottom":
                return i4 ? t4 ? f2 : v2 : t4 ? v2 : f2;
              case "left":
              case "right":
                return t4 ? y2 : b2;
              default:
                return [];
            }
          })(d2(e3), "start" === i3, s3);
          return n3 && (o3 = o3.map((e4) => e4 + "-" + n3), t3 && (o3 = o3.concat(o3.map(g2)))), o3;
        }
        function C2(e3) {
          const t3 = d2(e3);
          return r2[t3] + e3.slice(t3.length);
        }
        function x2(e3) {
          const { x: t3, y: i3, width: s3, height: n3 } = e3;
          return { width: s3, height: n3, top: i3, left: t3, right: t3 + s3, bottom: i3 + n3, x: t3, y: i3 };
        }
        function S2(e3, t3, i3) {
          let { reference: s3, floating: n3 } = e3;
          const o3 = p2(t3), l3 = m2(t3), a3 = u2(l3), r3 = d2(t3), c3 = "y" === o3, g3 = s3.x + s3.width / 2 - n3.width / 2, v3 = s3.y + s3.height / 2 - n3.height / 2, f3 = s3[a3] / 2 - n3[a3] / 2;
          let y3;
          switch (r3) {
            case "top":
              y3 = { x: g3, y: s3.y - n3.height };
              break;
            case "bottom":
              y3 = { x: g3, y: s3.y + s3.height };
              break;
            case "right":
              y3 = { x: s3.x + s3.width, y: v3 };
              break;
            case "left":
              y3 = { x: s3.x - n3.width, y: v3 };
              break;
            default:
              y3 = { x: s3.x, y: s3.y };
          }
          switch (h2(t3)) {
            case "start":
              y3[l3] -= f3 * (i3 && c3 ? -1 : 1);
              break;
            case "end":
              y3[l3] += f3 * (i3 && c3 ? -1 : 1);
          }
          return y3;
        }
        async function k2(e3, t3) {
          var i3;
          void 0 === t3 && (t3 = {});
          const { x: s3, y: n3, platform: o3, rects: l3, elements: a3, strategy: r3 } = e3, { boundary: d3 = "clippingAncestors", rootBoundary: h3 = "viewport", elementContext: u3 = "floating", altBoundary: p3 = false, padding: m3 = 0 } = c2(t3, e3), g3 = (function(e4) {
            return "number" != typeof e4 ? (function(e5) {
              return { top: 0, right: 0, bottom: 0, left: 0, ...e5 };
            })(e4) : { top: e4, right: e4, bottom: e4, left: e4 };
          })(m3), v3 = a3[p3 ? "floating" === u3 ? "reference" : "floating" : u3], f3 = x2(await o3.getClippingRect({ element: null == (i3 = await (null == o3.isElement ? void 0 : o3.isElement(v3))) || i3 ? v3 : v3.contextElement || await (null == o3.getDocumentElement ? void 0 : o3.getDocumentElement(a3.floating)), boundary: d3, rootBoundary: h3, strategy: r3 })), y3 = "floating" === u3 ? { x: s3, y: n3, width: l3.floating.width, height: l3.floating.height } : l3.reference, b3 = await (null == o3.getOffsetParent ? void 0 : o3.getOffsetParent(a3.floating)), w3 = await (null == o3.isElement ? void 0 : o3.isElement(b3)) && await (null == o3.getScale ? void 0 : o3.getScale(b3)) || { x: 1, y: 1 }, C3 = x2(o3.convertOffsetParentRelativeRectToViewportRelativeRect ? await o3.convertOffsetParentRelativeRectToViewportRelativeRect({ elements: a3, rect: y3, offsetParent: b3, strategy: r3 }) : y3);
          return { top: (f3.top - C3.top + g3.top) / w3.y, bottom: (C3.bottom - f3.bottom + g3.bottom) / w3.y, left: (f3.left - C3.left + g3.left) / w3.x, right: (C3.right - f3.right + g3.right) / w3.x };
        }
        const L2 = /* @__PURE__ */ new Set(["left", "top"]);
        function E2() {
          return "undefined" != typeof window;
        }
        function T2(e3) {
          return M2(e3) ? (e3.nodeName || "").toLowerCase() : "#document";
        }
        function A2(e3) {
          var t3;
          return (null == e3 || null == (t3 = e3.ownerDocument) ? void 0 : t3.defaultView) || window;
        }
        function I2(e3) {
          var t3;
          return null == (t3 = (M2(e3) ? e3.ownerDocument : e3.document) || window.document) ? void 0 : t3.documentElement;
        }
        function M2(e3) {
          return !!E2() && (e3 instanceof Node || e3 instanceof A2(e3).Node);
        }
        function D2(e3) {
          return !!E2() && (e3 instanceof Element || e3 instanceof A2(e3).Element);
        }
        function O2(e3) {
          return !!E2() && (e3 instanceof HTMLElement || e3 instanceof A2(e3).HTMLElement);
        }
        function $2(e3) {
          return !(!E2() || "undefined" == typeof ShadowRoot) && (e3 instanceof ShadowRoot || e3 instanceof A2(e3).ShadowRoot);
        }
        function P2(e3) {
          const { overflow: t3, overflowX: i3, overflowY: s3, display: n3 } = W(e3);
          return /auto|scroll|overlay|hidden|clip/.test(t3 + s3 + i3) && "inline" !== n3 && "contents" !== n3;
        }
        function N(e3) {
          return /^(table|td|th)$/.test(T2(e3));
        }
        function H(e3) {
          try {
            if (e3.matches(":popover-open")) return true;
          } catch (e4) {
          }
          try {
            return e3.matches(":modal");
          } catch (e4) {
            return false;
          }
        }
        const F = /transform|translate|scale|rotate|perspective|filter/, q = /paint|layout|strict|content/, B = (e3) => !!e3 && "none" !== e3;
        let R;
        function V(e3) {
          const t3 = D2(e3) ? W(e3) : e3;
          return B(t3.transform) || B(t3.translate) || B(t3.scale) || B(t3.rotate) || B(t3.perspective) || !z() && (B(t3.backdropFilter) || B(t3.filter)) || F.test(t3.willChange || "") || q.test(t3.contain || "");
        }
        function z() {
          return null == R && (R = "undefined" != typeof CSS && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), R;
        }
        function j(e3) {
          return /^(html|body|#document)$/.test(T2(e3));
        }
        function W(e3) {
          return A2(e3).getComputedStyle(e3);
        }
        function U(e3) {
          return D2(e3) ? { scrollLeft: e3.scrollLeft, scrollTop: e3.scrollTop } : { scrollLeft: e3.scrollX, scrollTop: e3.scrollY };
        }
        function Y(e3) {
          if ("html" === T2(e3)) return e3;
          const t3 = e3.assignedSlot || e3.parentNode || $2(e3) && e3.host || I2(e3);
          return $2(t3) ? t3.host : t3;
        }
        function _2(e3) {
          const t3 = Y(e3);
          return j(t3) ? e3.ownerDocument ? e3.ownerDocument.body : e3.body : O2(t3) && P2(t3) ? t3 : _2(t3);
        }
        function J(e3, t3, i3) {
          var s3;
          void 0 === t3 && (t3 = []), void 0 === i3 && (i3 = true);
          const n3 = _2(e3), o3 = n3 === (null == (s3 = e3.ownerDocument) ? void 0 : s3.body), l3 = A2(n3);
          if (o3) {
            const e4 = K(l3);
            return t3.concat(l3, l3.visualViewport || [], P2(n3) ? n3 : [], e4 && i3 ? J(e4) : []);
          }
          return t3.concat(n3, J(n3, [], i3));
        }
        function K(e3) {
          return e3.parent && Object.getPrototypeOf(e3.parent) ? e3.frameElement : null;
        }
        function Q(e3) {
          const t3 = W(e3);
          let i3 = parseFloat(t3.width) || 0, s3 = parseFloat(t3.height) || 0;
          const n3 = O2(e3), l3 = n3 ? e3.offsetWidth : i3, a3 = n3 ? e3.offsetHeight : s3, r3 = o2(i3) !== l3 || o2(s3) !== a3;
          return r3 && (i3 = l3, s3 = a3), { width: i3, height: s3, $: r3 };
        }
        function G(e3) {
          return D2(e3) ? e3 : e3.contextElement;
        }
        function Z(e3) {
          const t3 = G(e3);
          if (!O2(t3)) return a2(1);
          const i3 = t3.getBoundingClientRect(), { width: s3, height: n3, $: l3 } = Q(t3);
          let r3 = (l3 ? o2(i3.width) : i3.width) / s3, c3 = (l3 ? o2(i3.height) : i3.height) / n3;
          return r3 && Number.isFinite(r3) || (r3 = 1), c3 && Number.isFinite(c3) || (c3 = 1), { x: r3, y: c3 };
        }
        const X = a2(0);
        function ee(e3) {
          const t3 = A2(e3);
          return z() && t3.visualViewport ? { x: t3.visualViewport.offsetLeft, y: t3.visualViewport.offsetTop } : X;
        }
        function te(e3, t3, i3, s3) {
          void 0 === t3 && (t3 = false), void 0 === i3 && (i3 = false);
          const n3 = e3.getBoundingClientRect(), o3 = G(e3);
          let l3 = a2(1);
          t3 && (s3 ? D2(s3) && (l3 = Z(s3)) : l3 = Z(e3));
          const r3 = (function(e4, t4, i4) {
            return void 0 === t4 && (t4 = false), !(!i4 || t4 && i4 !== A2(e4)) && t4;
          })(o3, i3, s3) ? ee(o3) : a2(0);
          let c3 = (n3.left + r3.x) / l3.x, d3 = (n3.top + r3.y) / l3.y, h3 = n3.width / l3.x, u3 = n3.height / l3.y;
          if (o3) {
            const e4 = A2(o3), t4 = s3 && D2(s3) ? A2(s3) : s3;
            let i4 = e4, n4 = K(i4);
            for (; n4 && s3 && t4 !== i4; ) {
              const e5 = Z(n4), t5 = n4.getBoundingClientRect(), s4 = W(n4), o4 = t5.left + (n4.clientLeft + parseFloat(s4.paddingLeft)) * e5.x, l4 = t5.top + (n4.clientTop + parseFloat(s4.paddingTop)) * e5.y;
              c3 *= e5.x, d3 *= e5.y, h3 *= e5.x, u3 *= e5.y, c3 += o4, d3 += l4, i4 = A2(n4), n4 = K(i4);
            }
          }
          return x2({ width: h3, height: u3, x: c3, y: d3 });
        }
        function ie(e3, t3) {
          const i3 = U(e3).scrollLeft;
          return t3 ? t3.left + i3 : te(I2(e3)).left + i3;
        }
        function se(e3, t3) {
          const i3 = e3.getBoundingClientRect();
          return { x: i3.left + t3.scrollLeft - ie(e3, i3), y: i3.top + t3.scrollTop };
        }
        function ne(e3, t3, i3) {
          let s3;
          if ("viewport" === t3) s3 = (function(e4, t4) {
            const i4 = A2(e4), s4 = I2(e4), n3 = i4.visualViewport;
            let o3 = s4.clientWidth, l3 = s4.clientHeight, a3 = 0, r3 = 0;
            if (n3) {
              o3 = n3.width, l3 = n3.height;
              const e5 = z();
              (!e5 || e5 && "fixed" === t4) && (a3 = n3.offsetLeft, r3 = n3.offsetTop);
            }
            const c3 = ie(s4);
            if (c3 <= 0) {
              const e5 = s4.ownerDocument, t5 = e5.body, i5 = getComputedStyle(t5), n4 = "CSS1Compat" === e5.compatMode && parseFloat(i5.marginLeft) + parseFloat(i5.marginRight) || 0, l4 = Math.abs(s4.clientWidth - t5.clientWidth - n4);
              l4 <= 25 && (o3 -= l4);
            } else c3 <= 25 && (o3 += c3);
            return { width: o3, height: l3, x: a3, y: r3 };
          })(e3, i3);
          else if ("document" === t3) s3 = (function(e4) {
            const t4 = I2(e4), i4 = U(e4), s4 = e4.ownerDocument.body, o3 = n2(t4.scrollWidth, t4.clientWidth, s4.scrollWidth, s4.clientWidth), l3 = n2(t4.scrollHeight, t4.clientHeight, s4.scrollHeight, s4.clientHeight);
            let a3 = -i4.scrollLeft + ie(e4);
            const r3 = -i4.scrollTop;
            return "rtl" === W(s4).direction && (a3 += n2(t4.clientWidth, s4.clientWidth) - o3), { width: o3, height: l3, x: a3, y: r3 };
          })(I2(e3));
          else if (D2(t3)) s3 = (function(e4, t4) {
            const i4 = te(e4, true, "fixed" === t4), s4 = i4.top + e4.clientTop, n3 = i4.left + e4.clientLeft, o3 = O2(e4) ? Z(e4) : a2(1);
            return { width: e4.clientWidth * o3.x, height: e4.clientHeight * o3.y, x: n3 * o3.x, y: s4 * o3.y };
          })(t3, i3);
          else {
            const i4 = ee(e3);
            s3 = { x: t3.x - i4.x, y: t3.y - i4.y, width: t3.width, height: t3.height };
          }
          return x2(s3);
        }
        function oe(e3, t3) {
          const i3 = Y(e3);
          return !(i3 === t3 || !D2(i3) || j(i3)) && ("fixed" === W(i3).position || oe(i3, t3));
        }
        function le(e3, t3, i3) {
          const s3 = O2(t3), n3 = I2(t3), o3 = "fixed" === i3, l3 = te(e3, true, o3, t3);
          let r3 = { scrollLeft: 0, scrollTop: 0 };
          const c3 = a2(0);
          function d3() {
            c3.x = ie(n3);
          }
          if (s3 || !s3 && !o3) if (("body" !== T2(t3) || P2(n3)) && (r3 = U(t3)), s3) {
            const e4 = te(t3, true, o3, t3);
            c3.x = e4.x + t3.clientLeft, c3.y = e4.y + t3.clientTop;
          } else n3 && d3();
          o3 && !s3 && n3 && d3();
          const h3 = !n3 || s3 || o3 ? a2(0) : se(n3, r3);
          return { x: l3.left + r3.scrollLeft - c3.x - h3.x, y: l3.top + r3.scrollTop - c3.y - h3.y, width: l3.width, height: l3.height };
        }
        function ae(e3) {
          return "static" === W(e3).position;
        }
        function re(e3, t3) {
          if (!O2(e3) || "fixed" === W(e3).position) return null;
          if (t3) return t3(e3);
          let i3 = e3.offsetParent;
          return I2(e3) === i3 && (i3 = i3.ownerDocument.body), i3;
        }
        function ce(e3, t3) {
          const i3 = A2(e3);
          if (H(e3)) return i3;
          if (!O2(e3)) {
            let t4 = Y(e3);
            for (; t4 && !j(t4); ) {
              if (D2(t4) && !ae(t4)) return t4;
              t4 = Y(t4);
            }
            return i3;
          }
          let s3 = re(e3, t3);
          for (; s3 && N(s3) && ae(s3); ) s3 = re(s3, t3);
          return s3 && j(s3) && ae(s3) && !V(s3) ? i3 : s3 || (function(e4) {
            let t4 = Y(e4);
            for (; O2(t4) && !j(t4); ) {
              if (V(t4)) return t4;
              if (H(t4)) return null;
              t4 = Y(t4);
            }
            return null;
          })(e3) || i3;
        }
        const de = { convertOffsetParentRelativeRectToViewportRelativeRect: function(e3) {
          let { elements: t3, rect: i3, offsetParent: s3, strategy: n3 } = e3;
          const o3 = "fixed" === n3, l3 = I2(s3), r3 = !!t3 && H(t3.floating);
          if (s3 === l3 || r3 && o3) return i3;
          let c3 = { scrollLeft: 0, scrollTop: 0 }, d3 = a2(1);
          const h3 = a2(0), u3 = O2(s3);
          if ((u3 || !u3 && !o3) && (("body" !== T2(s3) || P2(l3)) && (c3 = U(s3)), u3)) {
            const e4 = te(s3);
            d3 = Z(s3), h3.x = e4.x + s3.clientLeft, h3.y = e4.y + s3.clientTop;
          }
          const p3 = !l3 || u3 || o3 ? a2(0) : se(l3, c3);
          return { width: i3.width * d3.x, height: i3.height * d3.y, x: i3.x * d3.x - c3.scrollLeft * d3.x + h3.x + p3.x, y: i3.y * d3.y - c3.scrollTop * d3.y + h3.y + p3.y };
        }, getDocumentElement: I2, getClippingRect: function(e3) {
          let { element: t3, boundary: i3, rootBoundary: o3, strategy: l3 } = e3;
          const a3 = [..."clippingAncestors" === i3 ? H(t3) ? [] : (function(e4, t4) {
            const i4 = t4.get(e4);
            if (i4) return i4;
            let s3 = J(e4, [], false).filter((e5) => D2(e5) && "body" !== T2(e5)), n3 = null;
            const o4 = "fixed" === W(e4).position;
            let l4 = o4 ? Y(e4) : e4;
            for (; D2(l4) && !j(l4); ) {
              const t5 = W(l4), i5 = V(l4);
              i5 || "fixed" !== t5.position || (n3 = null), (o4 ? !i5 && !n3 : !i5 && "static" === t5.position && n3 && ("absolute" === n3.position || "fixed" === n3.position) || P2(l4) && !i5 && oe(e4, l4)) ? s3 = s3.filter((e5) => e5 !== l4) : n3 = t5, l4 = Y(l4);
            }
            return t4.set(e4, s3), s3;
          })(t3, this._c) : [].concat(i3), o3], r3 = ne(t3, a3[0], l3);
          let c3 = r3.top, d3 = r3.right, h3 = r3.bottom, u3 = r3.left;
          for (let e4 = 1; e4 < a3.length; e4++) {
            const i4 = ne(t3, a3[e4], l3);
            c3 = n2(i4.top, c3), d3 = s2(i4.right, d3), h3 = s2(i4.bottom, h3), u3 = n2(i4.left, u3);
          }
          return { width: d3 - u3, height: h3 - c3, x: u3, y: c3 };
        }, getOffsetParent: ce, getElementRects: async function(e3) {
          const t3 = this.getOffsetParent || ce, i3 = this.getDimensions, s3 = await i3(e3.floating);
          return { reference: le(e3.reference, await t3(e3.floating), e3.strategy), floating: { x: 0, y: 0, width: s3.width, height: s3.height } };
        }, getClientRects: function(e3) {
          return Array.from(e3.getClientRects());
        }, getDimensions: function(e3) {
          const { width: t3, height: i3 } = Q(e3);
          return { width: t3, height: i3 };
        }, getScale: Z, isElement: D2, isRTL: function(e3) {
          return "rtl" === W(e3).direction;
        } };
        function he(e3, t3) {
          return e3.x === t3.x && e3.y === t3.y && e3.width === t3.width && e3.height === t3.height;
        }
        function ue(e3, t3, i3, o3) {
          void 0 === o3 && (o3 = {});
          const { ancestorScroll: a3 = true, ancestorResize: r3 = true, elementResize: c3 = "function" == typeof ResizeObserver, layoutShift: d3 = "function" == typeof IntersectionObserver, animationFrame: h3 = false } = o3, u3 = G(e3), p3 = a3 || r3 ? [...u3 ? J(u3) : [], ...t3 ? J(t3) : []] : [];
          p3.forEach((e4) => {
            a3 && e4.addEventListener("scroll", i3, { passive: true }), r3 && e4.addEventListener("resize", i3);
          });
          const m3 = u3 && d3 ? (function(e4, t4) {
            let i4, o4 = null;
            const a4 = I2(e4);
            function r4() {
              var e5;
              clearTimeout(i4), null == (e5 = o4) || e5.disconnect(), o4 = null;
            }
            return (function c4(d4, h4) {
              void 0 === d4 && (d4 = false), void 0 === h4 && (h4 = 1), r4();
              const u4 = e4.getBoundingClientRect(), { left: p4, top: m4, width: g4, height: v4 } = u4;
              if (d4 || t4(), !g4 || !v4) return;
              const f4 = { rootMargin: -l2(m4) + "px " + -l2(a4.clientWidth - (p4 + g4)) + "px " + -l2(a4.clientHeight - (m4 + v4)) + "px " + -l2(p4) + "px", threshold: n2(0, s2(1, h4)) || 1 };
              let y4 = true;
              function b3(t5) {
                const s3 = t5[0].intersectionRatio;
                if (s3 !== h4) {
                  if (!y4) return c4();
                  s3 ? c4(false, s3) : i4 = setTimeout(() => {
                    c4(false, 1e-7);
                  }, 1e3);
                }
                1 !== s3 || he(u4, e4.getBoundingClientRect()) || c4(), y4 = false;
              }
              try {
                o4 = new IntersectionObserver(b3, { ...f4, root: a4.ownerDocument });
              } catch (e5) {
                o4 = new IntersectionObserver(b3, f4);
              }
              o4.observe(e4);
            })(true), r4;
          })(u3, i3) : null;
          let g3, v3 = -1, f3 = null;
          c3 && (f3 = new ResizeObserver((e4) => {
            let [s3] = e4;
            s3 && s3.target === u3 && f3 && t3 && (f3.unobserve(t3), cancelAnimationFrame(v3), v3 = requestAnimationFrame(() => {
              var e5;
              null == (e5 = f3) || e5.observe(t3);
            })), i3();
          }), u3 && !h3 && f3.observe(u3), t3 && f3.observe(t3));
          let y3 = h3 ? te(e3) : null;
          return h3 && (function t4() {
            const s3 = te(e3);
            y3 && !he(y3, s3) && i3();
            y3 = s3, g3 = requestAnimationFrame(t4);
          })(), i3(), () => {
            var e4;
            p3.forEach((e5) => {
              a3 && e5.removeEventListener("scroll", i3), r3 && e5.removeEventListener("resize", i3);
            }), null == m3 || m3(), null == (e4 = f3) || e4.disconnect(), f3 = null, h3 && cancelAnimationFrame(g3);
          };
        }
        const pe = function(e3) {
          return void 0 === e3 && (e3 = 0), { name: "offset", options: e3, async fn(t3) {
            var i3, s3;
            const { x: n3, y: o3, placement: l3, middlewareData: a3 } = t3, r3 = await (async function(e4, t4) {
              const { placement: i4, platform: s4, elements: n4 } = e4, o4 = await (null == s4.isRTL ? void 0 : s4.isRTL(n4.floating)), l4 = d2(i4), a4 = h2(i4), r4 = "y" === p2(i4), u3 = L2.has(l4) ? -1 : 1, m3 = o4 && r4 ? -1 : 1, g3 = c2(t4, e4);
              let { mainAxis: v3, crossAxis: f3, alignmentAxis: y3 } = "number" == typeof g3 ? { mainAxis: g3, crossAxis: 0, alignmentAxis: null } : { mainAxis: g3.mainAxis || 0, crossAxis: g3.crossAxis || 0, alignmentAxis: g3.alignmentAxis };
              return a4 && "number" == typeof y3 && (f3 = "end" === a4 ? -1 * y3 : y3), r4 ? { x: f3 * m3, y: v3 * u3 } : { x: v3 * u3, y: f3 * m3 };
            })(t3, e3);
            return l3 === (null == (i3 = a3.offset) ? void 0 : i3.placement) && null != (s3 = a3.arrow) && s3.alignmentOffset ? {} : { x: n3 + r3.x, y: o3 + r3.y, data: { ...r3, placement: l3 } };
          } };
        }, me = function(e3) {
          return void 0 === e3 && (e3 = {}), { name: "flip", options: e3, async fn(t3) {
            var i3, s3;
            const { placement: n3, middlewareData: o3, rects: l3, initialPlacement: a3, platform: r3, elements: v3 } = t3, { mainAxis: f3 = true, crossAxis: y3 = true, fallbackPlacements: b3, fallbackStrategy: x3 = "bestFit", fallbackAxisSideDirection: S3 = "none", flipAlignment: k3 = true, ...L3 } = c2(e3, t3);
            if (null != (i3 = o3.arrow) && i3.alignmentOffset) return {};
            const E3 = d2(n3), T3 = p2(a3), A3 = d2(a3) === a3, I3 = await (null == r3.isRTL ? void 0 : r3.isRTL(v3.floating)), M3 = b3 || (A3 || !k3 ? [C2(a3)] : (function(e4) {
              const t4 = C2(e4);
              return [g2(e4), t4, g2(t4)];
            })(a3)), D3 = "none" !== S3;
            !b3 && D3 && M3.push(...w2(a3, k3, S3, I3));
            const O3 = [a3, ...M3], $3 = await r3.detectOverflow(t3, L3), P3 = [];
            let N2 = (null == (s3 = o3.flip) ? void 0 : s3.overflows) || [];
            if (f3 && P3.push($3[E3]), y3) {
              const e4 = (function(e5, t4, i4) {
                void 0 === i4 && (i4 = false);
                const s4 = h2(e5), n4 = m2(e5), o4 = u2(n4);
                let l4 = "x" === n4 ? s4 === (i4 ? "end" : "start") ? "right" : "left" : "start" === s4 ? "bottom" : "top";
                return t4.reference[o4] > t4.floating[o4] && (l4 = C2(l4)), [l4, C2(l4)];
              })(n3, l3, I3);
              P3.push($3[e4[0]], $3[e4[1]]);
            }
            if (N2 = [...N2, { placement: n3, overflows: P3 }], !P3.every((e4) => e4 <= 0)) {
              var H2, F2;
              const e4 = ((null == (H2 = o3.flip) ? void 0 : H2.index) || 0) + 1, t4 = O3[e4];
              if (t4) {
                if (!("alignment" === y3 && T3 !== p2(t4)) || N2.every((e5) => p2(e5.placement) !== T3 || e5.overflows[0] > 0)) return { data: { index: e4, overflows: N2 }, reset: { placement: t4 } };
              }
              let i4 = null == (F2 = N2.filter((e5) => e5.overflows[0] <= 0).sort((e5, t5) => e5.overflows[1] - t5.overflows[1])[0]) ? void 0 : F2.placement;
              if (!i4) switch (x3) {
                case "bestFit": {
                  var q2;
                  const e5 = null == (q2 = N2.filter((e6) => {
                    if (D3) {
                      const t5 = p2(e6.placement);
                      return t5 === T3 || "y" === t5;
                    }
                    return true;
                  }).map((e6) => [e6.placement, e6.overflows.filter((e7) => e7 > 0).reduce((e7, t5) => e7 + t5, 0)]).sort((e6, t5) => e6[1] - t5[1])[0]) ? void 0 : q2[0];
                  e5 && (i4 = e5);
                  break;
                }
                case "initialPlacement":
                  i4 = a3;
              }
              if (n3 !== i4) return { reset: { placement: i4 } };
            }
            return {};
          } };
        }, ge = (e3, t3, i3) => {
          const s3 = /* @__PURE__ */ new Map(), n3 = { platform: de, ...i3 }, o3 = { ...n3.platform, _c: s3 };
          return (async (e4, t4, i4) => {
            const { placement: s4 = "bottom", strategy: n4 = "absolute", middleware: o4 = [], platform: l3 } = i4, a3 = l3.detectOverflow ? l3 : { ...l3, detectOverflow: k2 }, r3 = await (null == l3.isRTL ? void 0 : l3.isRTL(t4));
            let c3 = await l3.getElementRects({ reference: e4, floating: t4, strategy: n4 }), { x: d3, y: h3 } = S2(c3, s4, r3), u3 = s4, p3 = 0;
            const m3 = {};
            for (let i5 = 0; i5 < o4.length; i5++) {
              const g3 = o4[i5];
              if (!g3) continue;
              const { name: v3, fn: f3 } = g3, { x: y3, y: b3, data: w3, reset: C3 } = await f3({ x: d3, y: h3, initialPlacement: s4, placement: u3, strategy: n4, middlewareData: m3, rects: c3, platform: a3, elements: { reference: e4, floating: t4 } });
              d3 = null != y3 ? y3 : d3, h3 = null != b3 ? b3 : h3, m3[v3] = { ...m3[v3], ...w3 }, C3 && p3 < 50 && (p3++, "object" == typeof C3 && (C3.placement && (u3 = C3.placement), C3.rects && (c3 = true === C3.rects ? await l3.getElementRects({ reference: e4, floating: t4, strategy: n4 }) : C3.rects), { x: d3, y: h3 } = S2(c3, u3, r3)), i5 = -1);
            }
            return { x: d3, y: h3, placement: u3, strategy: n4, middlewareData: m3 };
          })(e3, t3, { ...n3, platform: o3 });
        };
      } };
      t = {};
      i.d = (e2, t2) => {
        for (var s2 in t2) i.o(t2, s2) && !i.o(e2, s2) && Object.defineProperty(e2, s2, { enumerable: true, get: t2[s2] });
      }, i.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2);
      s = i(8862);
      n = i(1926);
      o = i(1173);
      l = i(2407);
      a = i(4571);
      r = i(9632);
      c = i(3200);
      d = i(5049);
      h = i(63);
      u = i(7986);
      p = i(1473);
      m = i(1251);
      g = i(2579);
      v = i(3717);
      f = i(1159);
      y = i(794);
      b = i(242);
      w = i(2010);
      C = i(8402);
      x = i(4189);
      S = i(2166);
      k = i(6652);
      L = i(7430);
      E = i(6955);
      T = i(7189);
      A = i(11);
      I = i(847);
      M = i(9060);
      D = i(1771);
      O = () => globalThis;
      $ = [{ key: "copy-markup", fn: o.A, collection: "$hsCopyMarkupCollection" }, { key: "accordion", fn: l.A, collection: "$hsAccordionCollection" }, { key: "carousel", fn: a.A, collection: "$hsCarouselCollection" }, { key: "collapse", fn: r.A, collection: "$hsCollapseCollection" }, { key: "combobox", fn: c.A, collection: "$hsComboBoxCollection" }, { key: "datatable", fn: (() => {
        const e2 = O();
        return void 0 !== e2.DataTable && void 0 !== e2.jQuery;
      })() ? d.A : null, collection: "$hsDataTableCollection" }, { key: "datepicker", fn: void 0 !== O().VanillaCalendarPro ? h.A : null, collection: "$hsDatepickerCollection" }, { key: "dropdown", fn: u.A, collection: "$hsDropdownCollection" }, { key: "file-upload", fn: (() => {
        const e2 = O();
        return void 0 !== e2._ && void 0 !== e2.Dropzone;
      })() ? p.A : null, collection: "$hsFileUploadCollection" }, { key: "input-number", fn: m.A, collection: "$hsInputNumberCollection" }, { key: "layout-splitter", fn: g.A, collection: "$hsLayoutSplitterCollection" }, { key: "overlay", fn: v.A, collection: "$hsOverlayCollection" }, { key: "pin-input", fn: f.A, collection: "$hsPinInputCollection" }, { key: "range-slider", fn: void 0 !== O().noUiSlider ? y.A : null, collection: "$hsRangeSliderCollection" }, { key: "remove-element", fn: b.A, collection: "$hsRemoveElementCollection" }, { key: "scroll-nav", fn: w.A, collection: "$hsScrollNavCollection" }, { key: "scrollspy", fn: C.A, collection: "$hsScrollspyCollection" }, { key: "select", fn: x.A, collection: "$hsSelectCollection" }, { key: "stepper", fn: S.A, collection: "$hsStepperCollection" }, { key: "strong-password", fn: k.A, collection: "$hsStrongPasswordCollection" }, { key: "tabs", fn: L.A, collection: "$hsTabsCollection" }, { key: "textarea-auto-height", fn: E.A, collection: "$hsTextareaAutoHeightCollection" }, { key: "theme-switch", fn: T.A, collection: "$hsThemeSwitchCollection" }, { key: "toggle-count", fn: A.A, collection: "$hsToggleCountCollection" }, { key: "toggle-password", fn: I.A, collection: "$hsTogglePasswordCollection" }, { key: "tooltip", fn: M.A, collection: "$hsTooltipCollection" }, { key: "tree-view", fn: D.A, collection: "$hsTreeViewCollection" }];
      P = { getClassProperty: n.gj, afterTransition: n.yd, autoInit(e2 = "all") {
        if ("all" === e2) return void $.forEach(({ fn: e3 }) => {
          var t3;
          null === (t3 = null == e3 ? void 0 : e3.autoInit) || void 0 === t3 || t3.call(e3);
        });
        const t2 = Array.isArray(e2) ? e2 : [e2];
        $.forEach(({ key: e3, fn: i2 }) => {
          var s2;
          t2.includes(e3) && (null === (s2 = null == i2 ? void 0 : i2.autoInit) || void 0 === s2 || s2.call(i2));
        });
      }, cleanCollection(e2 = "all") {
        if ("undefined" == typeof window) return;
        if ("all" === e2) return void $.forEach(({ collection: e3 }) => {
          window[e3] instanceof Array && (window[e3] = []);
        });
        const t2 = Array.isArray(e2) ? e2 : [e2];
        $.forEach(({ key: e3, collection: i2 }) => {
          t2.includes(e3) && window[i2] instanceof Array && (window[i2] = []);
        });
      } };
      "undefined" != typeof window && (window.HSAccessibilityObserver = new s.A(), window.HSStaticMethods = P);
      HSAccordion = l.A;
      HSCarousel = a.A;
      HSCollapse = r.A;
      HSComboBox = c.A;
      HSCopyMarkup = o.A;
      HSDataTable = d.A;
      HSDatepicker = h.A;
      HSDropdown = u.A;
      HSFileUpload = p.A;
      HSInputNumber = m.A;
      HSLayoutSplitter = g.A;
      HSOverlay = v.A;
      HSPinInput = f.A;
      HSRangeSlider = y.A;
      HSRemoveElement = b.A;
      HSScrollNav = w.A;
      HSScrollspy = C.A;
      HSSelect = x.A;
      HSStepper = S.A;
      HSStrongPassword = k.A;
      HSTabs = L.A;
      HSTextareaAutoHeight = E.A;
      HSThemeSwitch = T.A;
      HSToggleCount = A.A;
      HSTogglePassword = I.A;
      HSTooltip = M.A;
      HSTreeView = D.A;
    }
  });

  // src/FootballBooking.Web/Scripts/site.js
  var require_site = __commonJS({
    "src/FootballBooking.Web/Scripts/site.js"() {
      init_dist();
      var initializePreline = () => {
        if (window.HSStaticMethods?.autoInit) {
          window.HSStaticMethods.autoInit();
        }
      };
      document.addEventListener("DOMContentLoaded", initializePreline);
    }
  });
  require_site();
})();
/*! Bundled license information:

preline/dist/index.mjs:
  (*
   * HSAccordion
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSBasePlugin
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSCarousel
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSCollapse
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSCopyMarkup
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSDataTable
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSDatepicker
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSDropdown
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSFileUpload
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSInputNumber
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSLayoutSplitter
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSOverlay
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSPinInput
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSRangeSlider
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSRemoveElement
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSScrollNav
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSScrollspy
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSStepper
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSStrongPassword
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSTabs
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSTextareaAutoHeight
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSThemeSwitch
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSToggleCount
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSTogglePassword
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * HSTreeView
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
  (*
   * @version: 4.2.0
   * @author: Preline Labs Ltd.
   * @license: Licensed under MIT and Preline UI Fair Use License (https://preline.co/docs/license.html)
   * Copyright 2024 Preline Labs Ltd.
   *)
*/
//# sourceMappingURL=site.js.map
