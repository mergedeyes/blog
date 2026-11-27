/* Shows webmentions (likes, reposts, replies, mentions) for this post from webmention.io.
   Everything is inserted as text, never as HTML, so a hostile mention can't inject markup. */
(function () {
  var box = document.getElementById("mentions");
  if (!box || !window.fetch) return;
  var target = box.getAttribute("data-target");
  var api = box.getAttribute("data-api");
  // also ask for the URL without/with trailing slash, people link both
  var alt = target.replace(/\/$/, "") === target ? target + "/" : target.replace(/\/$/, "");
  var url = api + "?per-page=200&sort-dir=up&target[]=" + encodeURIComponent(target) + "&target[]=" + encodeURIComponent(alt);

  function safeUrl(u) {
    try { var p = new URL(u); return (p.protocol === "https:" || p.protocol === "http:") ? p.href : null; }
    catch (e) { return null; }
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  fetch(url).then(function (r) { return r.ok ? r.json() : { children: [] }; }).then(function (data) {
    var items = data.children || [];
    if (!items.length) return;
    var count = { "like-of": 0, "repost-of": 0, "bookmark-of": 0 };
    var list = box.querySelector(".mentions__list");
    items.forEach(function (m) {
      var kind = m["wm-property"];
      if (kind in count) { count[kind]++; return; }
      var li = el("li");
      var who = (m.author && m.author.name) || "someone";
      var link = safeUrl(m.url || m["wm-source"]);
      var a = el(link ? "a" : "span", "mentions__who", who);
      if (link) a.href = link;
      li.appendChild(a);
      var when = m.published || m["wm-received"];
      if (when) li.appendChild(el("span", "mentions__when", String(when).slice(0, 10)));
      var text = m.content && (m.content.text || "");
      li.appendChild(el("p", "mentions__text", text ? (text.length > 400 ? text.slice(0, 400) + "…" : text)
                                                     : (kind === "in-reply-to" ? "replied" : "mentioned this post")));
      list.appendChild(li);
    });
    var parts = [];
    if (count["like-of"]) parts.push(count["like-of"] + (count["like-of"] === 1 ? " like" : " likes"));
    if (count["repost-of"]) parts.push(count["repost-of"] + (count["repost-of"] === 1 ? " repost" : " reposts"));
    if (count["bookmark-of"]) parts.push(count["bookmark-of"] + (count["bookmark-of"] === 1 ? " bookmark" : " bookmarks"));
    box.querySelector(".mentions__counts").textContent = parts.join(" · ");
    box.hidden = false;
  }).catch(function () { /* no mentions shown, page still works */ });
})();
