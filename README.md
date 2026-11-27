# ~/log — blog.mergedcloud.de

Jan's blog. Plain Jekyll, built by GitHub Pages itself: no local tooling, no Actions.
Looks like mergedcloud.de (same colours, system fonts, no external requests except webmention.io).

## Write a post

Add `_posts/YYYY-MM-DD-some-slug.md`:

```markdown
---
layout: post
title: "Title"
description: "One line for the post list, the feed and link previews (optional)."
---

Text in Markdown.
```

Push, wait about a minute, done. The feed (`/feed.xml`) updates itself.

Optional front matter: `syndication:` with a list of `{name, url}` for copies elsewhere
(e.g. a Mastodon post), shown as `u-syndication` links.

## The /now page

`now.md` is the [/now page](https://nownownow.com/about) at `/now/`: what I'm up to at the
moment, rewritten in place (not a post, not in the feed). Its `updated:` front matter is
the date shown. Mainframe's `L` lists it on top, and pushing it from there (`P` / `^G`)
sets `updated:` to that day.

## IndieWeb pieces

- Posts are `h-entry` (title, date, author, content), the post list is an `h-feed`.
- Author identity is **https://mergedcloud.de/** (`h-card` + `rel="me"` there, GitHub links back).
- Webmentions go to `webmention.io/mergedcloud.de`; `assets/webmentions.js` shows likes,
  reposts and replies under each post (text only, no HTML from senders).
- Each post has a small form to send a webmention by hand.

## One-time setup

1. GitHub: create the public repo `mergedeyes/blog`, push this, then
   Settings → Pages → Source: "Deploy from a branch", `main` / root.
2. 1&1 DNS for mergedcloud.de: `blog` CNAME `mergedeyes.github.io.`
   (never use `ad.` — that name belongs to the AD lab).
3. GitHub → Settings → Pages: custom domain `blog.mergedcloud.de` (the `CNAME` file
   already says so), wait for the certificate, then tick "Enforce HTTPS".
4. Main site: apply `0001-IndieWeb-…patch` to `mergedeyes.github.io` (h-card, rel="me",
   webmention endpoint, Blog link in the menu).
5. Sign in at https://webmention.io with `mergedcloud.de` (IndieAuth via GitHub).
6. Check everything at https://indiewebify.me.
7. Optional: https://brid.gy to send posts to Mastodon/Bluesky and pull replies back.
