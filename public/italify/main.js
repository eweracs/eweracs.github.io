/* Italify docs – Markdown loader.
   Fetches the page's .md file (the <main data-source> attribute),
   expands the authoring conventions documented in AUTHORING.md, and
   renders with marked (vendored in vendor/marked.min.js). */

(function () {
	"use strict";

	function escapeHtml(text) {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	function inline(md) {
		return marked.parseInline(md);
	}

	/* ---- Custom fenced blocks ---------------------------------------
	   ```screenshot [wide|tall]   placeholder (tag/desc/caption) or
	                               real image (img/alt/caption)
	   ```buttons                  one markdown link per line,
	                               optionally followed by "primary"
	   ```cards                    "## Title" lines split the cards
	   ```steps                    "## Title" lines split the steps
	   ```toc                      markdown list, wrapped in the TOC box */

	function parseKeyValues(body) {
		const data = {};
		let key = null;
		for (const line of body.split("\n")) {
			const m = line.match(/^(\w+):\s*(.*)$/);
			if (m) {
				key = m[1];
				data[key] = m[2];
			} else if (key && line.trim()) {
				data[key] += " " + line.trim();
			}
		}
		return data;
	}

	function splitTitledChunks(body) {
		const chunks = [];
		let current = null;
		for (const line of body.split("\n")) {
			const m = line.match(/^##\s+(.*)$/);
			if (m) {
				current = { title: m[1], body: [] };
				chunks.push(current);
			} else if (current && line.trim()) {
				current.body.push(line);
			}
		}
		return chunks;
	}

	const customFences = {
		screenshot(body, modifier) {
			const data = parseKeyValues(body);
			const aspect = modifier ? ' data-aspect="' + escapeHtml(modifier) + '"' : "";
			const caption = data.caption
				? "<figcaption>" + inline(data.caption) + "</figcaption>"
				: "";
			if (data.img) {
				const alt = data.alt ? escapeHtml(data.alt) : "";
				return '<figure class="shot"' + aspect + '><img src="' + escapeHtml(data.img) +
					'" alt="' + alt + '">' + caption + "</figure>";
			}
			return '<figure class="shot"' + aspect + '><div class="shot-frame">' +
				'<span class="shot-tag">' + inline(data.tag || "Screenshot") + "</span>" +
				'<p class="shot-desc">' + inline(data.desc || "") + "</p>" +
				"</div>" + caption + "</figure>";
		},

		buttons(body) {
			const links = [];
			for (const line of body.split("\n")) {
				const m = line.match(/^\[([^\]]+)\]\(([^)]+)\)\s*(primary)?\s*$/);
				if (m) {
					const cls = m[3] ? "button-primary" : "button-secondary";
					links.push('<a class="' + cls + '" href="' + escapeHtml(m[2]) + '">' +
						inline(m[1]) + "</a>");
				}
			}
			return '<div class="actions">' + links.join("") + "</div>";
		},

		cards(body) {
			const cards = splitTitledChunks(body).map(function (c) {
				return '<div class="card"><h4>' + inline(c.title) + "</h4><p>" +
					inline(c.body.join(" ")) + "</p></div>";
			});
			return '<div class="card-row">' + cards.join("") + "</div>";
		},

		steps(body) {
			const items = splitTitledChunks(body).map(function (c) {
				return "<li><h4>" + inline(c.title) + "</h4><p>" +
					inline(c.body.join(" ")) + "</p></li>";
			});
			return '<ol class="steps">' + items.join("") + "</ol>";
		},

		toc(body) {
			return '<div class="toc"><span class="overline">On this page</span>' +
				marked.parse(body) + "</div>";
		},

		// The interactive slant/correction hero (index page). Markup only —
		// behaviour and the outline data live in italify-demos.js, which
		// boots on the `italify:rendered` event. Body: `caption: …`.
		"italify-hero"(body) {
			const data = parseKeyValues(body);
			const caption = data.caption
				? '<p class="hero-caption">' + inline(data.caption) + "</p>"
				: "";
			function check(cls, label, checked) {
				return '<label class="demo-toggle ' + cls + '"><input type="checkbox"' +
					(checked ? " checked" : "") + "><span>" + escapeHtml(label) + "</span></label>";
			}
			return '<div class="italify-hero" data-italify-hero>' +
				'<div class="hero-controls">' +
				check("hero-slant", "Slant", false) +
				'<label class="hero-correction"><span>Correction</span>' +
				'<input class="hero-slider" type="range" min="0" max="100" value="0" disabled></label>' +
				check("hero-nodes-toggle", "Show nodes", true) +
				"</div>" +
				// The outline spans 0…3463 × 0…712; the viewBox margin keeps
				// node circles and handles clear of the stage's scroll clip
				// (generous left/right, matching the old standalone page).
				'<div class="hero-stage"><svg viewBox="-60 -30 3583 772" role="img" ' +
				'aria-label="Interactive interpolation between the upright and the Italify-corrected oblique">' +
				'<path class="hero-outline demo-outline"></path></svg></div>' +
				caption + "</div>";
		},

		// Horizontal carousel of animated outline demos. Chunk titles carry
		// the demo id after a pipe – `## Overlap-agnostic | overlap` – and
		// the body is the description (inline Markdown). The outline data,
		// per-demo toggles and animation live in italify-demos.js.
		demos(body) {
			const TOGGLES = { overlap: "Remove overlap" };
			const CHECKED = { overlap: false };
			const cards = splitTitledChunks(body).map(function (c) {
				const m = c.title.match(/^(.*?)\s*\|\s*(\S+)\s*$/);
				const title = m ? m[1] : c.title;
				const id = m ? m[2] : "";
				const toggle = TOGGLES[id]
					? '<label class="demo-toggle"><input type="checkbox"' +
						(CHECKED[id] ? " checked" : "") + "><span>" +
						escapeHtml(TOGGLES[id]) + "</span></label>"
					: "";
				return '<article class="demo-card" data-demo="' + escapeHtml(id) +
					'" data-label="' + escapeHtml(title) + '">' +
					'<div class="demo-figure"></div>' +
					"<h4>" + inline(title) + "</h4>" +
					"<p>" + inline(c.body.join(" ")) + "</p>" + toggle +
					"</article>";
			});
			return '<div class="demo-carousel-wrap">' +
				'<div class="demo-nav">' +
				'<button type="button" class="demo-nav-prev" aria-label="Previous demo">←</button>' +
				'<button type="button" class="demo-nav-next" aria-label="Next demo">→</button>' +
				"</div>" +
				'<div class="demo-carousel">' + cards.join("") + "</div>" +
				'<div class="demo-dots" role="tablist"></div>' +
				"</div>";
		},

		// Testimonials: `## Name | Affiliation | https://…` + quote body.
		quotes(body) {
			const items = splitTitledChunks(body).map(function (c) {
				const parts = c.title.split("|").map(function (p) { return p.trim(); });
				const name = parts[0] || "";
				const affiliation = parts[1] || "";
				const url = parts[2] || "";
				const source = url
					? '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' +
						escapeHtml(affiliation) + "</a>"
					: escapeHtml(affiliation);
				return '<figure class="quote"><blockquote>' + inline(c.body.join(" ")) +
					"</blockquote><figcaption>– " + escapeHtml(name) +
					(affiliation ? ", " + source : "") + "</figcaption></figure>";
			});
			return '<div class="quote-row">' + items.join("") + "</div>";
		},

		// Image on the right, notes on the left at percentage heights of
		// the image: `note 34%: **Curve correction** – …`
		annotated(body) {
			const data = {};
			const notes = [];
			let current = null;
			for (const line of body.split("\n")) {
				const note = line.match(/^note\s+([\d.]+)\s*%?\s*:\s*(.*)$/);
				if (note) {
					current = { note: true, top: parseFloat(note[1]), text: note[2] };
					notes.push(current);
					continue;
				}
				const kv = line.match(/^(\w+):\s*(.*)$/);
				if (kv) {
					current = { note: false, key: kv[1] };
					data[kv[1]] = kv[2];
					continue;
				}
				if (current && line.trim()) {
					if (current.note) current.text += " " + line.trim();
					else data[current.key] += " " + line.trim();
				}
			}
			const noteHtml = notes.map(function (n) {
				return '<p class="annotated-note" style="top:' + n.top + '%">' +
					inline(n.text) + "</p>";
			}).join("");
			const caption = data.caption
				? "<figcaption>" + inline(data.caption) + "</figcaption>"
				: "";
			const alt = data.alt ? escapeHtml(data.alt) : "";
			return '<figure class="shot annotated"><div class="annotated-row">' +
				'<div class="annotated-notes">' + noteHtml + "</div>" +
				'<img src="' + escapeHtml(data.img || "") + '" alt="' + alt + '">' +
				"</div>" + caption + "</figure>";
		},
	};

	/* ---- Line directives (outside fences) ----------------------------
	   @overline TEXT              small-caps section label
	   @lede TEXT                  large grey intro paragraph
	   #### Title | chip | chip    parameter heading with chips */

	function transformLine(line) {
		let m = line.match(/^@overline\s+(.*)$/);
		if (m) {
			return '<p class="overline">' + escapeHtml(m[1]) + "</p>";
		}
		m = line.match(/^@lede\s+(.*)$/);
		if (m) {
			return '<p class="lede">' + inline(m[1]) + "</p>";
		}
		m = line.match(/^####\s+(.+?)\s*\|\s*(.+)$/);
		if (m) {
			const chips = m[2].split("|").map(function (chip) {
				return '<span class="chip">' + escapeHtml(chip.trim()) + "</span>";
			});
			return '<h4 class="param-title">' + inline(m[1]) + " " + chips.join(" ") + "</h4>";
		}
		return line;
	}

	function preprocess(src) {
		const lines = src.split("\n");
		const out = [];
		let i = 0;
		while (i < lines.length) {
			const open = lines[i].match(/^```(\S*)\s*(\S*)\s*$/);
			if (open) {
				let j = i + 1;
				while (j < lines.length && !/^```\s*$/.test(lines[j])) j++;
				const handler = customFences[open[1]];
				if (handler) {
					out.push(handler(lines.slice(i + 1, j).join("\n"), open[2]));
				} else {
					out.push(lines.slice(i, Math.min(j + 1, lines.length)).join("\n"));
				}
				i = j + 1;
			} else {
				out.push(transformLine(lines[i]));
				i++;
			}
		}
		return out.join("\n");
	}

	/* ---- DOM post-processing ---------------------------------------- */

	// "## Heading {#anchor}" → id on the heading element.
	function applyHeadingIds(root) {
		root.querySelectorAll("h1, h2, h3, h4").forEach(function (h) {
			const m = h.innerHTML.match(/\s*\{#([A-Za-z0-9_-]+)\}\s*$/);
			if (m) {
				h.id = m[1];
				h.innerHTML = h.innerHTML.replace(/\s*\{#([A-Za-z0-9_-]+)\}\s*$/, "");
			}
		});
	}

	// [[X]] → <kbd>X</kbd> in prose (never inside code samples).
	function applyKbd(root) {
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
			acceptNode: function (node) {
				if (node.parentElement.closest("pre, code, kbd, script, style")) {
					return NodeFilter.FILTER_REJECT;
				}
				return /\[\[[^\]]+\]\]/.test(node.nodeValue)
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_SKIP;
			},
		});
		const nodes = [];
		while (walker.nextNode()) nodes.push(walker.currentNode);
		nodes.forEach(function (node) {
			const parts = node.nodeValue.split(/\[\[([^\]]+)\]\]/);
			const frag = document.createDocumentFragment();
			parts.forEach(function (part, index) {
				if (index % 2 === 1) {
					const kbd = document.createElement("kbd");
					kbd.textContent = part;
					frag.appendChild(kbd);
				} else if (part) {
					frag.appendChild(document.createTextNode(part));
				}
			});
			node.parentNode.replaceChild(frag, node);
		});
	}

	// Wrap each chip-carrying h4 and its following content in div.param.
	function wrapParams(root) {
		root.querySelectorAll("h4.param-title").forEach(function (h) {
			const members = [h];
			let el = h.nextElementSibling;
			while (el && !/^H[1-6]$/.test(el.tagName)) {
				members.push(el);
				el = el.nextElementSibling;
			}
			const wrap = document.createElement("div");
			wrap.className = "param";
			h.parentNode.insertBefore(wrap, h);
			members.forEach(function (member) {
				wrap.appendChild(member);
			});
		});
	}

	// On the Python API page, group each "**`func(...)`**" entry – its
	// name plus the description and Parameters/Returns blocks that follow
	// – into div.api-entry, so the name reads as a header and the rest
	// indents beneath it. A function header is a paragraph whose sole
	// content is `<strong><code>…</code></strong>`.
	function wrapApiEntries(main) {
		if (!/python-api/.test(main.dataset.source || "")) return;

		function isApiName(el) {
			if (!el || el.tagName !== "P" || el.children.length !== 1) return false;
			const strong = el.firstElementChild;
			if (strong.tagName !== "STRONG" || strong.children.length !== 1) return false;
			const code = strong.firstElementChild;
			return code.tagName === "CODE" &&
				el.textContent.trim() === code.textContent.trim();
		}

		function isLabel(el) {
			return el && el.tagName === "P" && el.children.length === 1 &&
				el.firstElementChild.tagName === "EM" &&
				/^(Parameters|Returns):$/.test(el.textContent.trim());
		}

		Array.from(main.querySelectorAll("p")).filter(isApiName).forEach(function (name) {
			name.classList.add("api-name");
			const entry = document.createElement("div");
			entry.className = "api-entry";
			name.parentNode.insertBefore(entry, name);
			entry.appendChild(name);

			const body = document.createElement("div");
			body.className = "api-body";
			let el = entry.nextElementSibling;
			while (el && !/^H[1-6]$/.test(el.tagName) && !isApiName(el)) {
				const next = el.nextElementSibling;
				if (isLabel(el)) el.classList.add("api-label");
				body.appendChild(el);
				el = next;
			}
			if (body.children.length) entry.appendChild(body);
		});
	}

	// Group top-level content into <section>s, splitting at every h2.
	// An overline immediately before an h2 moves into the new section.
	function wrapSections(main) {
		const groups = [];
		let current = [];
		Array.from(main.children).forEach(function (el) {
			if (el.tagName === "H2") {
				let overline = null;
				const last = current[current.length - 1];
				if (last && last.classList && last.classList.contains("overline")) {
					overline = current.pop();
				}
				if (current.length) groups.push(current);
				current = overline ? [overline, el] : [el];
			} else {
				current.push(el);
			}
		});
		if (current.length) groups.push(current);
		main.textContent = "";
		groups.forEach(function (group) {
			const section = document.createElement("section");
			const heading = group.find(function (el) { return /^H[12]$/.test(el.tagName); });
			if (heading && heading.id) {
				section.dataset.section = heading.id;
			}
			group.forEach(function (el) { section.appendChild(el); });
			main.appendChild(section);
		});
	}

	// Syntax-highlight fenced code with Prism, where it's loaded (only the
	// Python API page pulls in vendor/prism.min.js). marked emits
	// `<code class="language-python">`, which Prism tokenises in place;
	// the token colours live in styles.css, not a vendored Prism theme.
	function highlightCode(main) {
		if (typeof Prism !== "undefined") Prism.highlightAllUnder(main);
	}

	// Clipboard + check glyphs for the copy button (Feather-style line icons,
	// inheriting currentColor so the button's CSS controls them).
	var COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
	var CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

	function copyText(text) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			return navigator.clipboard.writeText(text);
		}
		// Fallback for non-secure contexts without the async Clipboard API.
		return new Promise(function (resolve, reject) {
			var ta = document.createElement("textarea");
			ta.value = text;
			ta.style.position = "fixed";
			ta.style.opacity = "0";
			document.body.appendChild(ta);
			ta.select();
			try { document.execCommand("copy"); resolve(); }
			catch (err) { reject(err); }
			finally { document.body.removeChild(ta); }
		});
	}

	// Give each Python sample a "Copy to clipboard" button. The <pre> is
	// wrapped in a positioned .code-block so the button stays pinned to the
	// corner regardless of horizontal scroll; clicking copies the raw code
	// and briefly swaps the clipboard glyph for a check.
	function addCopyButtons(main) {
		main.querySelectorAll("pre > code.language-python").forEach(function (code) {
			var pre = code.parentElement;
			if (pre.parentElement && pre.parentElement.classList.contains("code-block")) return;
			var wrap = document.createElement("div");
			wrap.className = "code-block";
			pre.parentNode.insertBefore(wrap, pre);
			wrap.appendChild(pre);

			var btn = document.createElement("button");
			btn.type = "button";
			btn.className = "copy-btn";
			btn.setAttribute("aria-label", "Copy to clipboard");
			btn.innerHTML = COPY_ICON;
			var timer;
			btn.addEventListener("click", function () {
				copyText(code.textContent.replace(/\n+$/, "")).then(function () {
					btn.classList.add("copied");
					btn.innerHTML = CHECK_ICON;
					btn.setAttribute("aria-label", "Copied");
					clearTimeout(timer);
					timer = setTimeout(function () {
						btn.classList.remove("copied");
						btn.innerHTML = COPY_ICON;
						btn.setAttribute("aria-label", "Copy to clipboard");
					}, 1600);
				});
			});
			wrap.appendChild(btn);
		});
	}

	/* ---- Theme switch -------------------------------------------------
	   The initial theme is set before paint by the inline script in each
	   page's <head> (reads localStorage, else the OS preference). Here we
	   only wire the header button: flip <html data-theme>, persist the
	   choice, and keep the button's labels in sync. */
	function initThemeToggle() {
		var btn = document.getElementById("theme-toggle");
		if (!btn) return;
		var root = document.documentElement;

		function sync() {
			var dark = root.getAttribute("data-theme") === "dark";
			var label = dark ? "Switch to light mode" : "Switch to dark mode";
			btn.setAttribute("aria-label", label);
			btn.setAttribute("title", label);
			btn.setAttribute("aria-pressed", dark ? "true" : "false");
		}

		sync();
		btn.addEventListener("click", function () {
			var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
			root.setAttribute("data-theme", next);
			try { localStorage.setItem("italify-theme", next); } catch (e) {}
			sync();
		});
	}

	/* ---- Boot --------------------------------------------------------- */

	async function render() {
		const main = document.querySelector("main[data-source]");
		if (!main) return;
		try {
			// no-cache: always revalidate so edits to the .md show on reload
			const response = await fetch(main.dataset.source, { cache: "no-cache" });
			if (!response.ok) throw new Error(response.status + " " + response.statusText);
			const markdown = await response.text();
			main.innerHTML = marked.parse(preprocess(markdown));
			applyHeadingIds(main);
			wrapParams(main);
			wrapApiEntries(main);
			wrapSections(main);
			applyKbd(main);
			highlightCode(main);
			addCopyButtons(main);
			// Let widget scripts (italify-demos.js) boot against the
			// freshly rendered DOM, whichever load order won.
			window.__italifyContentRendered = true;
			document.dispatchEvent(new CustomEvent("italify:rendered"));
			if (location.hash) {
				const target = document.getElementById(location.hash.slice(1));
				if (target) target.scrollIntoView();
			}
		} catch (error) {
			main.innerHTML =
				"<section><h1>Couldn’t load the page content.</h1>" +
				"<p>This site loads its text from Markdown files, which requires a web server. " +
				"If you opened the file directly, serve the folder instead, e.g.:</p>" +
				"<pre><code>python3 -m http.server --directory docs</code></pre>" +
				"<p><code>" + escapeHtml(String(error)) + "</code></p></section>";
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function () {
			initThemeToggle();
			render();
		});
	} else {
		initThemeToggle();
		render();
	}
})();
