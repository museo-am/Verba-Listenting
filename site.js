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
    /* bring-a-friend strip: can be closed, stays closed on this device */
    var rb = document.getElementById("refbar");
    if(rb){ try{ if(localStorage.getItem("vs-refbar") === "0") rb.classList.add("gone"); }catch(e){}
      rb.querySelector("[data-refbar-close]").addEventListener("click", function(){ rb.classList.add("gone"); try{ localStorage.setItem("vs-refbar", "0"); }catch(e){} }); }
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

/* bring-a-friend page: the forms post to the school's Google Apps Script (codes + sign-ups go to a Google Sheet,
   the school gets a Telegram alert), so nobody has to send a message anywhere */
(function(){
  var box = document.querySelector(".refforms"); if(!box) return;
  var D = box.dataset, code = "";
  function copy(text){ var ok = false, t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.top = "0"; t.style.opacity = "0";
    document.body.appendChild(t); t.focus(); t.select(); try { t.setSelectionRange(0, text.length); ok = document.execCommand("copy"); } catch(e){} document.body.removeChild(t);
    try { if(navigator.clipboard && window.isSecureContext){ navigator.clipboard.writeText(text).catch(function(){}); ok = true; } } catch(e){}
    return ok; }
  function okPhone(p){ var n = p.replace(/\D/g, "").length; return n >= 8 && n <= 15 && !/[^\d\s()+-]/.test(p); }
  function send(form, body, done){
    var btn = form.querySelector("button[type=submit]"), msg = form.querySelector(".pmsg"), label = btn.textContent;
    body.lang = D.lang; body.website = form.querySelector(".hp").value;
    btn.disabled = true; btn.textContent = D.busy; msg.textContent = "";
    fetch(D.api, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) })
      .then(function(r){ return r.json(); })
      .then(function(r){ btn.disabled = false; btn.textContent = label; if(r && r.ok) done(r); else msg.textContent = D[{ name: "need", phone: "needPhone", code: "needCode" }[r && r.error] || (r && r.error)] || D.fail; })
      .catch(function(){ btn.disabled = false; btn.textContent = label; msg.textContent = D.fail; });
  }
  function check(form, ins){ var msg = form.querySelector(".pmsg");
    for(var i = 0; i < ins.length; i++){ var el = ins[i][0], v = el.value.trim(), bad = ins[i][1] === "phone" ? !okPhone(v) : !v;
      if(bad){ msg.textContent = D[ins[i][2]]; el.focus(); return false; } }
    return true; }

  var f1 = document.getElementById("refcode"), n1 = document.getElementById("refname"), p1 = document.getElementById("refphone"), val = document.getElementById("refcodeval");
  f1.addEventListener("submit", function(e){ e.preventDefault();
    if(!check(f1, [[n1, "text", "need"], [p1, "phone", "needPhone"]])) return;
    send(f1, { action: "code", name: n1.value.trim(), phone: p1.value.trim() }, function(r){
      code = r.code; val.textContent = code; f1.querySelector(".refout").hidden = false;
      f1.querySelector(".pmsg").textContent = r.existing ? D.existing : "";
      try { localStorage.setItem("vs-ref-code", code); } catch(err){} });
  });
  function link(){ return location.origin + location.pathname + "?ref=" + encodeURIComponent(code); }
  f1.querySelector("[data-ref-share]").addEventListener("click", function(){ var url = link(), text = D.shareText + " " + code;
    if(navigator.share){ navigator.share({ title: "Verba School", text: text, url: url }).catch(function(){}); }
    else { copy(text + "\n" + url); f1.querySelector(".pmsg").textContent = D.linkCopied; } });
  f1.querySelector("[data-ref-copy]").addEventListener("click", function(){ copy(code); f1.querySelector(".pmsg").textContent = D.codeCopied; });

  var f2 = document.getElementById("refinv"), n2 = document.getElementById("invname"), p2 = document.getElementById("invphone"), c2 = document.getElementById("invcode");
  var q = (location.search.match(/[?&]ref=([A-Za-z0-9-]{3,12})/) || [])[1]; if(q){ c2.value = q.toUpperCase(); }
  f2.addEventListener("submit", function(e){ e.preventDefault();
    if(!check(f2, [[n2, "text", "need"], [p2, "phone", "needPhone"], [c2, "text", "needCode"]])) return;
    send(f2, { action: "invite", name: n2.value.trim(), phone: p2.value.trim(), code: c2.value.trim().toUpperCase() }, function(){
      [].forEach.call(f2.querySelectorAll(".field, button[type=submit]"), function(el){ el.hidden = true; });
      var d = f2.querySelector(".refdone"); d.hidden = false; d.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
  });
})();
