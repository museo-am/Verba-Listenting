/* Verba School public pages: header, menu, theme, scroll reveal, hero cards, listening demo.
   Shared by the home pages and every course, test and article page. */
  (function(){
    var nav = document.getElementById("lnav"), menu = document.getElementById("mmenu"), mb = nav && nav.querySelector(".menu-btn");
    /* light / dark switch, remembered on this device */
    document.addEventListener("click", function(ev){ if(!ev.target.closest("[data-theme-toggle]")) return; (function(){
      var cur = document.documentElement.dataset.theme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      var next = cur === "light" ? "dark" : "light"; document.documentElement.dataset.theme = next;
      try{ localStorage.setItem("vs-theme", next); }catch(e){}
    })(); });
    if(!nav) return;
    var onScroll = function(){ nav.classList.toggle("scrolled", window.scrollY > 8); };
    onScroll(); window.addEventListener("scroll", onScroll, {passive:true});
    var setMenu = function(open){ mb.setAttribute("aria-expanded", open); menu.hidden = !open; nav.classList.toggle("menu-open", open); document.body.classList.toggle("noscroll", open); };
    mb.addEventListener("click", function(){ setMenu(mb.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function(e){
      var a = e.target.closest("a"); if(!a) return;
      var u = new URL(a.href, location.href);
      setMenu(false);
      // same-page section: close the menu first, then scroll (scrolling while the page is locked lands in the wrong place)
      if(u.pathname === location.pathname && u.hash && document.querySelector(u.hash)){
        e.preventDefault();
        requestAnimationFrame(function(){ document.querySelector(u.hash).scrollIntoView({behavior:"smooth", block:"start"}); history.replaceState(history.state, "", u.hash); });
      }
    });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape" && !menu.hidden){ setMenu(false); mb.focus(); } });
    window.addEventListener("resize", function(){ if(window.innerWidth > 900 && !menu.hidden) setMenu(false); });

    /* scroll reveal (content stays visible without JS or with reduced motion) */
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var land = document.getElementById("landing");
    if(!reduce && "IntersectionObserver" in window){
      land.classList.add("reveal-on");
      var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }); }, {rootMargin:"0px 0px -8% 0px", threshold:0.08});
      land.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
    }

    /* hero cards follow the pointer a little */
    var deck = land.querySelector(".deck");
    if(deck && !reduce && window.matchMedia("(pointer:fine)").matches){
      land.querySelector(".hero").addEventListener("pointermove", function(e){
        var r = deck.getBoundingClientRect();
        deck.style.setProperty("--px", ((e.clientX - r.left) / r.width - .5).toFixed(3));
        deck.style.setProperty("--py", ((e.clientY - r.top) / r.height - .5).toFixed(3));
      });
    }

    /* listening demo: a real excerpt with synced sentences, word translations and a question */
    var demo = document.getElementById("demo");
    if(!demo) return;
    var au = demo.querySelector("audio"), btn = demo.querySelector(".demo-play"), wave = demo.querySelector(".wave"),
        time = demo.querySelector(".demo-time"), sents = [].slice.call(demo.querySelectorAll(".s")), DUR = +demo.dataset.dur || 17.25;
    wave.innerHTML = wave.dataset.peaks.split(",").map(function(p){ return '<i style="--h:' + p + '%"></i>'; }).join("");
    var bars = [].slice.call(wave.children);
    var fmt = function(t){ t = Math.max(0, Math.floor(t)); return Math.floor(t/60) + ":" + ("0" + t % 60).slice(-2); };
    var paint = function(){
      var t = au.currentTime || 0, f = Math.min(1, t / DUR), n = Math.round(f * bars.length);
      bars.forEach(function(b, i){ b.classList.toggle("on", i < n); });
      wave.setAttribute("aria-valuenow", Math.round(f * 100));
      time.textContent = fmt(t);
      var cur = -1; sents.forEach(function(s, i){ if(t >= +s.dataset.t0 && t > 0) cur = i; });
      sents.forEach(function(s, i){ s.classList.toggle("now", i === cur && !au.paused); s.classList.toggle("past", i < cur); });
    };
    var raf; var loop = function(){ paint(); if(!au.paused) raf = requestAnimationFrame(loop); };
    btn.addEventListener("click", function(){ if(au.paused){ au.play().catch(function(){}); } else au.pause(); });
    au.addEventListener("play", function(){ demo.classList.add("playing"); btn.setAttribute("aria-label", "Pause"); loop(); });
    au.addEventListener("pause", function(){ demo.classList.remove("playing"); btn.setAttribute("aria-label", "Play"); cancelAnimationFrame(raf); paint(); });
    au.addEventListener("ended", function(){ au.currentTime = 0; paint(); });
    var seekTo = function(f){ var go = function(){ au.currentTime = Math.max(0, Math.min(DUR - .05, f * DUR)); paint(); };
      if(au.readyState < 1){ au.preload = "auto"; au.addEventListener("loadedmetadata", go, {once:true}); au.load(); } else go(); };
    wave.addEventListener("click", function(e){ var r = wave.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width); });
    wave.addEventListener("keydown", function(e){ var d = e.key === "ArrowRight" ? 2 : e.key === "ArrowLeft" ? -2 : 0; if(d){ e.preventDefault(); seekTo(((au.currentTime || 0) + d) / DUR); } });
    sents.forEach(function(s){ s.addEventListener("click", function(e){ if(e.target.closest(".v")) return; seekTo(+s.dataset.t0 / DUR + .001); if(au.paused) au.play().catch(function(){}); }); });
    /* vocabulary: tap or focus a highlighted word to see its Armenian translation */
    demo.querySelectorAll(".v").forEach(function(v){
      var tip = document.createElement("span"); tip.className = "vtip"; tip.lang = "hy"; tip.textContent = v.dataset.hy; v.appendChild(tip);
      v.addEventListener("click", function(e){ e.stopPropagation(); var on = !v.classList.contains("open"); demo.querySelectorAll(".v.open").forEach(function(x){ x.classList.remove("open"); }); v.classList.toggle("open", on); });
    });
    document.addEventListener("click", function(){ demo.querySelectorAll(".v.open").forEach(function(x){ x.classList.remove("open"); }); });
    demo.querySelectorAll(".dopt").forEach(function(o){
      o.addEventListener("click", function(){
        demo.querySelectorAll(".dopt").forEach(function(x){ x.classList.remove("ok", "no", "hint"); x.removeAttribute("aria-pressed"); });
        o.classList.add(o.hasAttribute("data-ok") ? "ok" : "no"); o.setAttribute("aria-pressed", "true");
        if(!o.hasAttribute("data-ok")) demo.querySelector(".dopt[data-ok]").classList.add("hint");
      });
    });
    paint();
  })();

/* free placement test: count correct answers, show an approximate level, mark the answers */
(function(){
  var f = document.getElementById("ptest"); if(!f) return;
  var out = document.getElementById("presult"), qs = [].slice.call(f.querySelectorAll(".pq")), msg = f.querySelector(".pmsg");
  var desc = JSON.parse(f.dataset.desc), LV = ["A1","A2","B1","B2","C1"];
  f.addEventListener("change", function(e){ var q = e.target.closest(".pq"); if(q) q.classList.remove("miss"); msg.textContent = ""; });
  f.addEventListener("submit", function(e){
    e.preventDefault();
    var miss = qs.filter(function(q){ return !q.querySelector("input:checked"); });
    if(miss.length){ miss.forEach(function(q){ q.classList.add("miss"); }); msg.textContent = f.dataset.missing.replace("{k}", miss.length); miss[0].scrollIntoView({behavior:"smooth", block:"center"}); return; }
    var ok = 0;
    qs.forEach(function(q){
      var c = q.querySelector("input:checked");
      if(c.value === "1") ok++;
      q.querySelectorAll(".opt").forEach(function(o){ var i = o.querySelector("input"); i.disabled = true;
        if(i.value === "1") o.classList.add("ok"); else if(i.checked) o.classList.add("no"); });
    });
    var lv = ok <= 5 ? 0 : ok <= 9 ? 1 : ok <= 13 ? 2 : ok <= 16 ? 3 : 4;
    document.getElementById("plevel").textContent = LV[lv];
    document.getElementById("pscore").textContent = f.dataset.score.replace("{a}", ok).replace("{b}", qs.length);
    document.getElementById("pdesc").textContent = desc[LV[lv]];
    f.classList.add("pdone"); f.querySelector(".pfoot").hidden = true;
    out.hidden = false; f.parentNode.insertBefore(out, f);
    requestAnimationFrame(function(){ document.getElementById("pbar").style.width = ((lv + 1) * 20) + "%"; });
    out.scrollIntoView({behavior:"smooth", block:"start"});
  });
  document.getElementById("pagain").addEventListener("click", function(){
    f.reset(); f.classList.remove("pdone"); f.querySelector(".pfoot").hidden = false; out.hidden = true;
    qs.forEach(function(q){ q.querySelectorAll(".opt").forEach(function(o){ o.classList.remove("ok","no"); o.querySelector("input").disabled = false; }); });
    document.getElementById("pbar").style.width = 0; qs[0].scrollIntoView({behavior:"smooth", block:"center"});
  });
})();
