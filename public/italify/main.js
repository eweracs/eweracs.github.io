/* Italify docs – Markdown loader.
   Fetches the page’s .md file (the <main data-source> attribute),
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

		// ```steps plain``` drops the numbered circles (used for the
		// handbook’s chapter list, which is an index, not a sequence) and
		// makes the titles h2s (set in regular weight by styles.css), like
		// the Glyphs handbook’s contents.
		steps(body, modifier) {
			const plain = modifier === "plain";
			const tag = plain ? "h2" : "h4";
			const items = splitTitledChunks(body).map(function (c) {
				return "<li><" + tag + ">" + inline(c.title) + "</" + tag + "><p>" +
					inline(c.body.join(" ")) + "</p></li>";
			});
			const cls = plain ? "steps steps-plain" : "steps";
			return '<ol class="' + cls + '">' + items.join("") + "</ol>";
		},

		// A hand-written "On this page" box. Handbook chapters don’t use
		// this – they get the whole-handbook TOC built by
		// buildHandbookToc(), whose section list is derived from the page’s
		// own headings.
		toc(body) {
			return '<div class="toc">' + marked.parse(body) + "</div>";
		},

		// The landing hero (index page): the first screen, a grid-paper
		// field holding icon, title, lede and buttons over the interactive
		// slant/correction demo and its control bar. Markup only –
		// behaviour and the outline data live in italify-demos.js, which
		// boots on the `italify:rendered` event. Body: `key: value` lines
		// (icon, eyebrow, title, lede, caption – all optional) plus button
		// lines written exactly as in a ```buttons fence.
		"italify-hero"(body) {
			const lines = body.split("\n");
			const isButton = function (line) { return /^\s*\[/.test(line); };
			const data = parseKeyValues(lines.filter(function (l) { return !isButton(l); }).join("\n"));
			const buttonLines = lines.filter(isButton);
			function check(cls, label, checked) {
				return '<label class="demo-toggle ' + cls + '"><input type="checkbox"' +
					(checked ? " checked" : "") + "><span>" + escapeHtml(label) + "</span></label>";
			}
			const intro =
				(data.icon ? '<span class="hero-icon"><img src="' + escapeHtml(data.icon) + '" alt=""></span>' : "") +
				(data.eyebrow ? '<p class="eyebrow">' + inline(data.eyebrow) + "</p>" : "") +
				(data.title ? '<h1 class="hero-title">' + inline(data.title) + "</h1>" : "") +
				(data.lede ? '<p class="hero-lede">' + inline(data.lede) + "</p>" : "") +
				(buttonLines.length ? customFences.buttons(buttonLines.join("\n")) : "");
			const caption = data.caption
				? '<p class="hero-caption">' + inline(data.caption) + "</p>"
				: "";
			// Font metrics of the hero word, in its own (y-down) units:
			// cap height 0, x-height 192 (the flat top of the w),
			// baseline 702 – drawn as faint guides like Glyphs’ edit view.
			const guides = [0, 192, 702].map(function (y) {
				return '<line x1="-60" x2="3523" y1="' + y + '" y2="' + y + '"></line>';
			}).join("");
			return '<div class="italify-hero" data-italify-hero data-own-section>' +
				'<div class="hero-inner">' +
				'<div class="hero-intro">' + intro + "</div>" +
				'<div class="hero-stage">' +
				// The outline spans 0…3463 × 0…712; the viewBox margin keeps
				// node circles and handles clear of the canvas edge.
				'<div class="hero-canvas"><svg viewBox="-60 -30 3583 772" role="img" ' +
				'aria-label="Interactive interpolation between the upright and the Italify-corrected oblique">' +
				'<g class="hero-guides">' + guides + "</g>" +
				'<path class="hero-outline demo-outline"></path></svg></div>' +
				caption + "</div>" +
				'<div class="hero-controls">' +
				check("hero-slant", "Slant", false) +
				'<label class="hero-correction"><span>Correction</span>' +
				'<input class="hero-slider" type="range" min="0" max="100" value="0" disabled>' +
				'<output class="hero-value">0%</output></label>' +
				check("hero-nodes-toggle", "Show nodes", true) +
				"</div></div></div>";
		},

		// The capabilities list (index page): one full-width row per demo,
		// animated outline card and text side by side, alternating sides.
		// Chunk titles carry the demo id after a pipe –
		// `## Overlap-agnostic | overlap` – and the body is the
		// description (inline Markdown). The outline data, per-demo
		// toggles and animation live in italify-demos.js.
		demos(body) {
			const TOGGLES = { overlap: "Remove overlap" };
			const CHECKED = { overlap: false };
			const rows = splitTitledChunks(body).map(function (c) {
				const m = c.title.match(/^(.*?)\s*\|\s*(\S+)\s*$/);
				const title = m ? m[1] : c.title;
				const id = m ? m[2] : "";
				const toggle = TOGGLES[id]
					? '<label class="demo-toggle"><input type="checkbox"' +
						(CHECKED[id] ? " checked" : "") + "><span>" +
						escapeHtml(TOGGLES[id]) + "</span></label>"
					: "";
				return '<article class="demo-row" data-demo="' + escapeHtml(id) +
					'" data-label="' + escapeHtml(title) + '">' +
					'<div class="demo-text">' +
					"<h3>" + inline(title) + "</h3>" +
					"<p>" + inline(c.body.join(" ")) + "</p>" + toggle +
					"</div>" +
					'<div class="demo-figure"></div>' +
					"</article>";
			});
			return '<div class="demo-list">' + rows.join("") + "</div>";
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
	   @lede TEXT                  large grey intro paragraph
	   #### Title | chip | chip    parameter heading with chips */

	function transformLine(line) {
		let m = line.match(/^@lede\s+(.*)$/);
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

	/* ---- Handbook chapter navigation --------------------------------
	   The handbook is one page per chapter (shells in handbook/, sources
	   in content/handbook/). This ordered manifest drives the prev/next
	   links appended to every chapter page – keep it in sync with the
	   chapter list in content/handbook/index.md when chapters are added,
	   removed or reordered. */
	var HANDBOOK_CHAPTERS = [
		{ slug: "installation", title: "Installation" },
		{ slug: "workflow", title: "A typical workflow" },
		{ slug: "filter", title: "The filter" },
		{ slug: "groups", title: "Glyph groups" },
		{ slug: "tagger", title: "The tagger" },
		{ slug: "diagonals", title: "Diagonals" },
		{ slug: "tags", title: "Tags" },
		{ slug: "anchor-links", title: "Anchor links" },
		{ slug: "copy-paste", title: "Copy, paste & propagate" },
		{ slug: "glyph-menu", title: "The Glyph → Italify menu" },
		{ slug: "settings", title: "Settings and licences" },
		{ slug: "tips", title: "Tips" },
		{ slug: "shortcuts", title: "Keyboard reference" },
	];

	// The handbook slug of the page being rendered, or null for anything
	// else (index page included – its content is the chapter list already).
	function chapterSlug(main) {
		var m = (main.dataset.source || "").match(/content\/handbook\/([\w-]+)\.md$/);
		return m && m[1] !== "index" ? m[1] : null;
	}

	// Build the handbook’s table of contents: every chapter, with the
	// current one’s own sections nested underneath it. This replaces the
	// per-page "On this page" box on chapter pages, so a reader can reach
	// any chapter from any chapter instead of only stepping prev/next.
	// The section list is derived from the rendered h2s, so it never drifts
	// from the page (call this after applyHeadingIds, before wrapSections).
	function buildHandbookToc(main) {
		var slug = chapterSlug(main);
		if (!slug) return;
		var ext = /\.html$/.test(location.pathname) ? ".html" : "";

		var nav = document.createElement("nav");
		nav.className = "toc handbook-toc";
		nav.setAttribute("aria-label", "Handbook contents");
		var home = document.createElement("a");
		home.className = "toc-home";
		home.href = "./";
		home.textContent = "Contents";
		nav.appendChild(home);

		var list = document.createElement("ol");
		HANDBOOK_CHAPTERS.forEach(function (chapter) {
			var li = document.createElement("li");
			var a = document.createElement("a");
			a.href = chapter.slug + ext;
			a.textContent = chapter.title;
			li.appendChild(a);
			if (chapter.slug === slug) {
				li.className = "toc-current";
				a.setAttribute("aria-current", "page");
				var sections = document.createElement("ul");
				main.querySelectorAll("h2[id]").forEach(function (h) {
					var item = document.createElement("li");
					var link = document.createElement("a");
					link.href = "#" + h.id;
					link.textContent = h.textContent.trim();
					item.appendChild(link);
					sections.appendChild(item);
				});
				if (sections.children.length) li.appendChild(sections);
			}
			list.appendChild(li);
		});
		nav.appendChild(list);

		// Chapters written before this was generated may still carry a
		// hand-written ```toc``` box; the generated one takes its place.
		// Otherwise the nav goes after the lede, where that box used to sit.
		var existing = main.querySelector(".toc");
		if (existing) {
			existing.parentNode.replaceChild(nav, existing);
			return;
		}
		var anchor = main.querySelector("p.lede") || main.querySelector("h1");
		if (anchor) anchor.parentNode.insertBefore(nav, anchor.nextSibling);
		else main.insertBefore(nav, main.firstChild);
	}

	// Append prev/next chapter links to every handbook chapter page.
	// Served locally the pages carry their .html extension, published
	// they are extensionless – mirror whatever the current URL uses.
	function addChapterNav(main) {
		var slug = chapterSlug(main);
		if (!slug) return;
		var index = -1;
		HANDBOOK_CHAPTERS.forEach(function (c, i) {
			if (c.slug === slug) index = i;
		});
		if (index < 0) return;
		var ext = /\.html$/.test(location.pathname) ? ".html" : "";
		function link(chapter, cls, label) {
			if (!chapter) return "<span></span>";
			return '<a class="' + cls + '" href="' + chapter.slug + ext + '">' +
				'<span class="page-nav-label">' + label + "</span>" +
				escapeHtml(chapter.title) + "</a>";
		}
		var nav = document.createElement("nav");
		nav.className = "page-nav";
		nav.setAttribute("aria-label", "Chapter navigation");
		nav.innerHTML =
			link(HANDBOOK_CHAPTERS[index - 1], "page-nav-prev", "← Previous") +
			link(HANDBOOK_CHAPTERS[index + 1], "page-nav-next", "Next →");
		main.appendChild(nav);
	}

	// Group top-level content into <section>s, splitting at every h2.
	// An element marked data-own-section (the landing hero) gets a
	// section to itself. On the landing page (<main class="landing">)
	// each section is further split: the h2, then .section-body with the
	// running text, then the wide blocks (figures, the demo list,
	// testimonials) at full width – styles.css lays these out stacked, or
	// in two columns for #overview.
	var WIDE_BLOCKS = "figure.shot, .demo-list, .quote-row";

	function wrapSections(main) {
		const landing = main.classList.contains("landing");
		const groups = [];
		let current = [];
		Array.from(main.children).forEach(function (el) {
			const own = el.hasAttribute("data-own-section");
			if (el.tagName === "H2" || own) {
				if (current.length) groups.push(current);
				current = [el];
				if (own) {
					groups.push(current);
					current = [];
				}
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
			if (group[0].hasAttribute("data-own-section")) {
				section.className = "section-own";
			}
			if (landing && !section.className) {
				const body = document.createElement("div");
				body.className = "section-body";
				const wide = [];
				group.forEach(function (el) {
					if (el.tagName === "H2") section.appendChild(el);
					else if (el.matches(WIDE_BLOCKS)) {
						el.classList.add("section-wide");
						wide.push(el);
					} else body.appendChild(el);
				});
				if (body.children.length) section.appendChild(body);
				wide.forEach(function (el) { section.appendChild(el); });
			} else {
				group.forEach(function (el) { section.appendChild(el); });
			}
			main.appendChild(section);
		});
	}

	// Documentation pages (<main class="doc">: the handbook, the Python
	// API, the licence terms) get the landing page's wide layout: the
	// title and lede move into a grid-paper intro band, and below it the
	// page's table of contents (the generated handbook TOC or a
	// hand-written ```toc``` box) is pinned in a left column beside the
	// text. A page without a TOC gets the text column alone. Runs after
	// wrapSections and addChapterNav, so it only rearranges finished
	// sections – ids, anchors and section data stay as they are.
	function layoutDoc(main) {
		if (!main.classList.contains("doc")) return;
		const first = main.querySelector("section");
		const heading = document.createElement("div");
		heading.className = "doc-heading";
		if (first) {
			Array.from(first.children).forEach(function (el) {
				if (el.tagName === "H1" || (el.tagName === "P" && el.classList.contains("lede"))) {
					heading.appendChild(el);
				}
			});
		}
		const toc = main.querySelector(".toc");

		const intro = document.createElement("div");
		intro.className = "doc-intro";
		const introInner = document.createElement("div");
		introInner.className = "doc-grid";
		introInner.appendChild(heading);
		intro.appendChild(introInner);

		const layout = document.createElement("div");
		layout.className = "doc-grid doc-layout";
		const article = document.createElement("div");
		article.className = "doc-article";
		if (toc) {
			const side = document.createElement("div");
			side.className = "doc-side";
			side.appendChild(toc);
			layout.appendChild(side);
		} else {
			introInner.classList.add("no-side");
			layout.classList.add("no-side");
		}
		Array.from(main.children).forEach(function (el) {
			// The first section may be left empty by the moves above.
			if (el === first && !el.children.length) return;
			article.appendChild(el);
		});
		layout.appendChild(article);
		main.textContent = "";
		main.appendChild(intro);
		main.appendChild(layout);
	}

	// Syntax-highlight fenced code with Prism, where it’s loaded (only the
	// Python API page pulls in vendor/prism.min.js). marked emits
	// `<code class="language-python">`, which Prism tokenises in place;
	// the token colours live in styles.css, not a vendored Prism theme.
	function highlightCode(main) {
		if (typeof Prism !== "undefined") Prism.highlightAllUnder(main);
	}

	// Clipboard + check glyphs for the copy button (Feather-style line icons,
	// inheriting currentColor so the button’s CSS controls them).
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
	   page’s <head> (reads localStorage, else the OS preference). Here we
	   only wire the header button: flip <html data-theme>, persist the
	   choice, and keep the button’s labels in sync. */
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
			buildHandbookToc(main);
			wrapSections(main);
			addChapterNav(main);
			layoutDoc(main);
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

	// The grid-paper bands slide up under the sticky header by its
	// height (--header-height in styles.css). The header grows when the
	// nav wraps onto a second line on a phone, so measure it rather than
	// trust the stylesheet's one-line figure.
	// The room the header takes in the page: its height less the
	// negative margin that hides the extra height of the taller bar at
	// the top (styles.css, .is-top) – the same figure in both states.
	function syncHeaderHeight() {
		var header = document.querySelector("header.site");
		if (!header) return;
		function set() {
			var room = header.getBoundingClientRect().height +
				(parseFloat(getComputedStyle(header).marginBottom) || 0);
			document.documentElement.style.setProperty("--header-height", Math.round(room) + "px");
		}
		set();
		if ("ResizeObserver" in window) new ResizeObserver(set).observe(header);
		else window.addEventListener("resize", set);
	}

	// Taller bar while the page sits at the very top, compact once it
	// scrolls (styles.css, .is-top). Transitions switch on after the
	// first frame, so the initial state doesn't animate in.
	function initHeaderScroll() {
		var header = document.querySelector("header.site");
		if (!header || !document.body.classList.contains("page-landing")) return;
		var ticking = false;
		function sync() {
			ticking = false;
			header.classList.toggle("is-top", window.scrollY <= 4);
		}
		sync();
		window.addEventListener("scroll", function () {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(sync);
			}
		}, { passive: true });
		requestAnimationFrame(function () {
			requestAnimationFrame(function () { header.classList.add("is-ready"); });
		});
	}

	// Hand-written documentation pages (<main class="doc"> without a
	// data-source: the trial and purchase pages) get the same layout as
	// the Markdown ones, straight away.
	function layoutStaticDoc() {
		var main = document.querySelector("main.doc:not([data-source])");
		if (main) layoutDoc(main);
	}

	function boot() {
		initThemeToggle();
		initHeaderScroll();
		syncHeaderHeight();
		layoutStaticDoc();
		render();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();
