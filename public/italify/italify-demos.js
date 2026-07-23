/* Italify docs – interactive outline demos.
   Replaces the retired standalone Next.js Italify page's React/flubber
   implementation with a small vanilla engine:

   • Every path pair is PARSED ONCE at boot into a shared command
     skeleton plus flat coordinate arrays; a frame only lerps numbers,
     builds one `d` string and moves pre-created node-overlay elements.
     (The old page re-parsed every path string 2–3× per frame, for all
     eight demos at once, through React state – hence the sluggishness.)
   • Only demos actually on screen animate (IntersectionObserver), and
     in the carousel that is at most one or two cards.
   • No third-party interpolator: every pair here is point-compatible
     by construction (same font, same structure), which is exactly what
     Italify guarantees. A structure mismatch logs and shows the target
     outline statically instead of crashing.
   • Colours come from CSS classes (styles.css tokens), so the theme
     toggle restyles the demos with no JS involvement.
   • prefers-reduced-motion: the sweep demos hold the corrected outline
     statically; the hero stays fully interactive (user-initiated).

   Markup contract (emitted by main.js's `italify-hero` and `demos`
   fences): [data-italify-hero] for the hero, [data-demo="<id>"] cards
   inside .demo-carousel. Boots on the `italify:rendered` event. */

(function () {
	"use strict";

	var SVG_NS = "http://www.w3.org/2000/svg";

	/* ---- Outline data (from the retired standalone page) -------------- */

	var heroBase =
		"M0,702h281c168,0,267-74,267-197c0-84-47-142-127-166c73-34,109-87,109-158c0-114-95-181-253-181h-277ZM174,570v-159h106c60,0,89,26,89,80s-29,79-89,79ZM174,285v-153h93c58,0,86,25,86,76s-29,77-86,77ZM878,712c164,0,257-96,257-265s-93-265-257-265s-257,96-257,265s93,265,257,265ZM878,591c-59,0-82-41-82-144s24-144,82-144c59,0,82,41,82,144s-24,144-82,144ZM1299,702h180l51-191c14-53,26-111,34-171h-6c8,60,18,111,33,171l50,191h180l141-510h-162l-44,231c-10,51-16,100-22,171h5c-7-56-18-111-32-170l-58-232h-163l-59,233c-13,48-25,112-34,169h6c-5-71-10-107-22-171l-42-231h-172ZM2205,712c132,0,214-65,214-169c0-194-262-131-262-207c0-25,22-42,54-42c37,0,62,23,67,62l132-38c-23-86-95-134-203-134c-125,0-210,67-210,167c0,187,259,127,259,208c0,26-21,43-53,43c-39,0-65-26-65-66l-151,29c16,94,95,147,218,147ZM2736,712c113,0,183-50,218-141l-152-37c-8,41-33,63-70,63c-52,0-82-40-85-116h319c11-169-56-299-236-299c-162,0-254,101-254,262c0,166,96,268,260,268ZM2648,391c6-62,31-95,82-95c49,0,71,30,76,95ZM3039,702h170v-244c0-99,57-134,151-118l-1-157c-82-4-127,25-150,103v-94h-170Z";
	var heroFrom =
		"M0,702h281c168,0,282-74,306-197c17-84-18-142-93-166c79-34,126-87,140-158c23-114-59-181-217-181h-277ZM200,570l32-159h106c60,0,84,26,73,80s-45,79-105,79ZM257,285l31-153h93c58,0,81,25,71,76s-45,77-102,77ZM876,712c164,0,276-96,310-265s-40-265-204-265s-276,96-310,265s40,265,204,265ZM900,591c-59,0-74-41-53-144s53-144,111-144c59,0,74,41,53,144s-53,144-111,144ZM1299,702h180l89-191c25-53,48-111,68-171h-6c-4,60-4,111-1,171l12,191h180l243-510h-162l-90,231c-20,51-36,100-56,171h5c4-56,4-111,2-170l-12-232h-163l-106,233c-22,48-47,112-67,169h6c9-71,11-107,12-171l4-231h-172ZM2203,712c132,0,227-65,248-169c39-194-236-131-221-207c5-25,31-42,63-42c37,0,57,23,54,62l140-38c-6-86-68-134-176-134c-125,0-224,67-244,167c-37,187,234,127,218,208c-6,26-30,43-62,43c-39,0-60-26-52-66l-157,29c-2,94,66,147,189,147ZM2734,712c113,0,193-50,246-141l-144-37c-17,41-46,63-83,63c-52,0-74-40-62-116h319c45-169,4-299-176-299c-162,0-274,101-306,262c-34,166,42,268,206,268ZM2710,391c19-62,50-95,101-95c49,0,65,30,57,95ZM3039,702h170l49-244c20-99,84-134,174-118l31-157c-81-4-132,25-171,103l19-94h-170Z";
	var heroTo =
		"M0,702h313c148,0,248-66,270-176c18-86-14-147-86-178c75-29,119-78,133-146c25-127-66-202-243-202h-247ZM200,570l32-159h95c68,0,94,29,82,89c-9,47-40,70-92,70ZM257,285l31-153h83c65,0,90,27,79,85c-9,45-39,68-90,68ZM906,712c145,0,244-85,274-234c37-189-45-296-228-296c-145,0-244,85-274,234c-37,189,45,296,228,296ZM910,591c-66,0-83-46-60-161c19-92,46-127,98-127c66,0,83,46,60,161c-19,92-46,127-98,127ZM1299,702h180l89-191c25-53,48-111,68-171h-6c-4,60-4,111-1,171l12,191h180l243-510h-168l-90,231c-20,50-35,99-55,171h7c3-56,4-111,1-170l-12-232h-165l-106,233c-21,47-44,111-64,169h6c8-71,11-107,12-171l4-231h-169ZM2228,712c118,0,200-56,219-149c39-198-232-149-216-232c5-22,27-37,56-37c36,0,58,22,59,59l136-30c-11-90-79-139-196-139c-110,0-197,59-215,147c-38,189,229,150,213,233c-5,23-27,38-55,38c-38,0-60-24-59-62l-152,21c4,96,80,151,210,151ZM2763,712c105,0,178-48,223-136l-149-45c-12,43-40,66-75,66c-54,0-79-40-70-116h319c36-168-14-299-205-299c-145,0-244,89-272,231c-37,185,47,299,229,299ZM2709,391c16-62,44-95,93-95c52,0,71,30,65,95ZM3039,702h170l49-244c21-103,81-137,173-118l32-156c-79-8-131,18-169,93l17-85h-170Z";

	var sweepA =
		"M199.014,510c60,0,119-19,170-52c72-47,128-120,149-203c36-143-48-255-191-255c-50,0-100,13-144,37c-54,28-100,71-133,123c-20,29-34,61-42,95c-25,102,10,188,84,229c30,17,66,26,107,26Z";
	var sweepB =
		"M238.624,510c48,0,95-15,137-42c57-38,103-96,120-163c42-171-58-305-229-305c-40,0-80,10-116,30c-42,22-80,57-108,99c-14,23-26,49-33,76c-30,122,12,225,100,274c36,20,80,31,129,31Z";
	var overlapA =
		"M171.494,730c65,0,117-26,156-78l-14,68h164l144-720h-170l-54,268c-19-46-60-68-121-68c-131,0-235,99-268,264c-33,167,32,266,163,266ZM243.494,609c-69,0-76-66-60-146c16-79,49-142,118-142c61,0,75,55,57,143c-18,90-54,145-115,145Z";
	var overlapB =
		"M188.891,730c52,0,96-20,128-60l-10,50h164l144-720h-170l-57,287c-22-59-69-87-142-87c-113,0-208,85-236,227c-38,190,36,303,179,303ZM248.891,609c-78,0-86-75-68-166c14-68,42-122,102-122c70,0,85,63,65,163c-15,78-47,125-99,125Z";
	var overlapAltA =
		"M171.494,730c118,0,192-83,228-265c36-181-4-265-123-265c-131,0-235,99-268,264c-33,167,32,266,163,266ZM243.494,609c-69,0-76-66-60-146c16-79,49-142,118-142c61,0,75,55,57,143c-18,90-54,145-115,145ZM313.494,720h164l144-720h-170l-120,599l3,16Z";
	var overlapAltB =
		"M188.891,730c102,0,165-71,197-228c41-206-5-302-140-302c-119,0-208,85-236,227c-38,190,36,303,179,303ZM248.891,609c-78,0-86-75-68-166c14-68,42-122,102-122c70,0,85,63,65,163c-15,78-47,125-99,125ZM306.891,720h164l144-720h-170l-120,600l3,14Z";
	var inflectA =
		"M189.042,528c132,0,227-64,248-169c38-193-236-129-221-208c5-24,31-41,63-41c37,0,57,23,54,62l140-38c-6-86-68-134-176-134c-126,0-224,68-244,169c-37,184,234,123,217,207c-5,25-29,42-61,42c-39,0-59-26-52-66l-157,29c-2,93,67,147,189,147Z";
	var inflectB =
		"M211,528c116,0,198-56,216-147c39-194-231-153-215-235c5-21,27-36,55-36c36,0,58,21,60,58l135-29c-11-90-80-139-197-139c-110,0-195,59-213,147c-37,187,230,147,212,234c-4,22-25,37-53,37c-39,0-61-25-58-63l-153,22c4,96,82,151,211,151Z";
	var retalA =
		"M333.766,537c168,0,234-53,218-131c-5-23-16-44-34-61c-52,19-100,27-153,27c-52,0-105-15-114-59l-10-51c-12-58-9-97,34-97c18,0,37,12,43,46l10,47l20-30h-157l19,96h190c87,0,145-33,126-125c-25-126-120-199-256-199c-231,0-294,151-262,309c32,160,161,228,326,228Z";
	var retalB =
		"M285.117,537c128,0,191-52,204-103c6-23,4-57-10-81c-43,13-80,19-121,19c-86,0-132-19-120-77l11-57c9-44,24-73,57-73c24,0,43,16,34,60l-7,34l32-31h-157l-19,96h226c67,0,120-25,134-95c26-132-60-229-240-229c-183,0-277,115-301,235c-43,212,90,302,277,302Z";
	var contrastA =
		"M232.902,642c127,0,243-69,321-188c-48,17-105,27-147,27c-125,0-161-89-120-253c27-106,68-175,104-175c34,0,35,62,4,187l10-3h-166l-10,39h379c40-170-34-276-204-276c-184,0-345,133-392,323c-47,186,49,319,221,319Z";
	var contrastB =
		"M274.261,642c106,0,222-69,286-187c-43,17-94,26-132,26c-156,0-188-104-143-283c22-88,56-145,87-145c37,0,41,62,13,187l11-3h-167l-10,39h376c23-171-65-276-247-276c-160,0-293,110-333,269c-54,217,36,373,259,373Z";
	var diagonalA =
		"M327,760h243l-63-277l251-239h-226l-208,199l162-443h-209l-277,760h209l82-225Z";
	var diagonalB =
		"M329,760h235l-60-265l264-251h-243l-197,188l158-432h-209l-277,760h209l84-230Z";
	var implicitA =
		"M260,530c118,0,184-55,221-141l-151-37c-13,42-37,63-74,63c-55,0-85-44-85-129v-53c0-73,27-119,86-119c58,0,83,43,74,125l54-30h-236v90h336c28-181-57-299-224-299c-169,0-261,108-261,266c0,164,95,264,260,264Z";
	var implicitB =
		"M248.739,530c107,0,173-52,218-132l-148-50c-17,44-44,67-79,67c-63,0-88-51-68-149l10-52c12-61,43-100,92-100c65,0,85,46,63,125l60-30h-236l-18,90h339c51-175-19-299-203-299c-148,0-243,91-270,224c-38,190,49,306,240,306Z";

	/* ---- Path parsing (once, at boot) ---------------------------------
	   Absolute-command path strings (M/L/H/V/C/S/Z, upper or lower) →
	   { types: ['M','C','L','Z',…], coords: Float64Array } where every
	   M/L holds 2 numbers and every C holds 6, in command order. */

	function parsePath(d) {
		var tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
		var types = [];
		var coords = [];
		var i = 0, cmd = "", x = 0, y = 0, startX = 0, startY = 0;
		var prevCX = null, prevCY = null;

		function num() { return Number(tokens[i++]); }

		while (i < tokens.length) {
			var token = tokens[i++];
			if (/[a-zA-Z]/.test(token)) cmd = token;
			else i -= 1;

			switch (cmd) {
			case "M": case "m":
				if (cmd === "M") { x = num(); y = num(); } else { x += num(); y += num(); }
				startX = x; startY = y;
				types.push("M"); coords.push(x, y);
				prevCX = prevCY = null;
				cmd = cmd === "M" ? "L" : "l";
				break;
			case "L": x = num(); y = num(); types.push("L"); coords.push(x, y); prevCX = prevCY = null; break;
			case "l": x += num(); y += num(); types.push("L"); coords.push(x, y); prevCX = prevCY = null; break;
			case "H": x = num(); types.push("L"); coords.push(x, y); prevCX = prevCY = null; break;
			case "h": x += num(); types.push("L"); coords.push(x, y); prevCX = prevCY = null; break;
			case "V": y = num(); types.push("L"); coords.push(x, y); prevCX = prevCY = null; break;
			case "v": y += num(); types.push("L"); coords.push(x, y); prevCX = prevCY = null; break;
			case "C": case "c": {
				var rel = cmd === "c";
				var c1x = (rel ? x : 0) + num(), c1y = (rel ? y : 0) + num();
				var c2x = (rel ? x : 0) + num(), c2y = (rel ? y : 0) + num();
				x = (rel ? x : 0) + num(); y = (rel ? y : 0) + num();
				types.push("C"); coords.push(c1x, c1y, c2x, c2y, x, y);
				prevCX = c2x; prevCY = c2y;
				break;
			}
			case "S": case "s": {
				var srel = cmd === "s";
				var s1x = x, s1y = y;
				if (prevCX !== null) { s1x = 2 * x - prevCX; s1y = 2 * y - prevCY; }
				var s2x = (srel ? x : 0) + num(), s2y = (srel ? y : 0) + num();
				x = (srel ? x : 0) + num(); y = (srel ? y : 0) + num();
				types.push("C"); coords.push(s1x, s1y, s2x, s2y, x, y);
				prevCX = s2x; prevCY = s2y;
				break;
			}
			case "Z": case "z":
				types.push("Z");
				x = startX; y = startY;
				prevCX = prevCY = null;
				break;
			default:
				i = tokens.length; // unknown command: bail out of the loop
			}
		}
		return { types: types, coords: new Float64Array(coords) };
	}

	function sameStructure(a, b) {
		if (a.types.length !== b.types.length) return false;
		for (var i = 0; i < a.types.length; i++) {
			if (a.types[i] !== b.types[i]) return false;
		}
		return true;
	}

	/* A compiled morph: lerp two coordinate arrays over one shared
	   command skeleton, building the `d` string without re-parsing. */
	function compileMorph(fromD, toD) {
		var from = parsePath(fromD);
		var to = parsePath(toD);
		if (!sameStructure(from, to)) {
			console.warn("italify-demos: incompatible path pair; showing target statically");
			return { types: to.types, from: to.coords, to: to.coords, out: new Float64Array(to.coords.length) };
		}
		return { types: from.types, from: from.coords, to: to.coords, out: new Float64Array(from.coords.length) };
	}

	function lerpInto(morph, t) {
		var f = morph.from, o = morph.to, out = morph.out;
		for (var i = 0; i < f.length; i++) {
			out[i] = f[i] + (o[i] - f[i]) * t;
		}
		return out;
	}

	function r2(v) { return Math.round(v * 100) / 100; }

	function buildD(types, coords) {
		var parts = [];
		var k = 0;
		for (var i = 0; i < types.length; i++) {
			var type = types[i];
			if (type === "M" || type === "L") {
				parts.push(type, r2(coords[k]), ",", r2(coords[k + 1]));
				k += 2;
			} else if (type === "C") {
				parts.push("C", r2(coords[k]), ",", r2(coords[k + 1]), " ",
					r2(coords[k + 2]), ",", r2(coords[k + 3]), " ",
					r2(coords[k + 4]), ",", r2(coords[k + 5]));
				k += 6;
			} else {
				parts.push("Z");
			}
		}
		return parts.join("");
	}

	/* ---- Node overlay --------------------------------------------------
	   On-curve circles, off-curve crosses and their handle lines, created
	   ONCE per skeleton and repositioned per frame from the same lerped
	   coordinate buffer the outline uses. Colours via CSS classes. */

	function makeOverlay(svg, types) {
		var handleGroup = document.createElementNS(SVG_NS, "g");
		var nodeGroup = document.createElementNS(SVG_NS, "g");
		handleGroup.setAttribute("class", "demo-handles");
		nodeGroup.setAttribute("class", "demo-nodes");
		svg.appendChild(handleGroup);
		svg.appendChild(nodeGroup);

		var handles = [], crosses = [], circles = [];

		function line(parent, cls) {
			var el = document.createElementNS(SVG_NS, "line");
			if (cls) el.setAttribute("class", cls);
			parent.appendChild(el);
			return el;
		}
		function circle(parent) {
			var el = document.createElementNS(SVG_NS, "circle");
			el.setAttribute("r", "8");
			parent.appendChild(el);
			return el;
		}

		// The skeleton is constant, so element counts are too.
		for (var i = 0; i < types.length; i++) {
			if (types[i] === "M" || types[i] === "L") {
				circles.push(circle(nodeGroup));
			} else if (types[i] === "C") {
				handles.push(line(handleGroup), line(handleGroup));
				crosses.push(line(nodeGroup, "demo-cross"), line(nodeGroup, "demo-cross"),
					line(nodeGroup, "demo-cross"), line(nodeGroup, "demo-cross"));
				circles.push(circle(nodeGroup));
			}
		}

		function setLine(el, x1, y1, x2, y2) {
			el.setAttribute("x1", r2(x1)); el.setAttribute("y1", r2(y1));
			el.setAttribute("x2", r2(x2)); el.setAttribute("y2", r2(y2));
		}
		function setCross(a, b, x, y) {
			var s = 6;
			setLine(a, x - s, y - s, x + s, y + s);
			setLine(b, x - s, y + s, x + s, y - s);
		}

		return {
			handleGroup: handleGroup,
			nodeGroup: nodeGroup,
			update: function (coords) {
				var k = 0, h = 0, c = 0, n = 0;
				var curX = 0, curY = 0, startX = 0, startY = 0;
				for (var i = 0; i < types.length; i++) {
					var type = types[i];
					if (type === "M") {
						curX = startX = coords[k]; curY = startY = coords[k + 1];
						circles[n].setAttribute("cx", r2(curX));
						circles[n].setAttribute("cy", r2(curY));
						n++; k += 2;
					} else if (type === "L") {
						curX = coords[k]; curY = coords[k + 1];
						circles[n].setAttribute("cx", r2(curX));
						circles[n].setAttribute("cy", r2(curY));
						n++; k += 2;
					} else if (type === "C") {
						var c1x = coords[k], c1y = coords[k + 1];
						var c2x = coords[k + 2], c2y = coords[k + 3];
						var ex = coords[k + 4], ey = coords[k + 5];
						setLine(handles[h++], curX, curY, c1x, c1y);
						setLine(handles[h++], ex, ey, c2x, c2y);
						setCross(crosses[c], crosses[c + 1], c1x, c1y);
						setCross(crosses[c + 2], crosses[c + 3], c2x, c2y);
						c += 4;
						circles[n].setAttribute("cx", r2(ex));
						circles[n].setAttribute("cy", r2(ey));
						n++;
						curX = ex; curY = ey;
						k += 6;
					} else {
						curX = startX; curY = startY;
					}
				}
			},
			setVisible: function (visible) {
				handleGroup.style.display = visible ? "" : "none";
				nodeGroup.style.display = visible ? "" : "none";
			},
		};
	}

	/* ---- Demo registry ------------------------------------------------- */

	var DEMOS = {
		overlap: {
			viewBox: "0 0 621 730",
			variants: { off: [overlapAltA, overlapAltB], on: [overlapA, overlapB] },
			toggle: { label: "Remove overlap", variantOn: "on", variantOff: "off" },
		},
		sweep: { viewBox: "0 0 526 510", pair: [sweepA, sweepB] },
		inflect: { viewBox: "0 0 473 528", pair: [inflectA, inflectB] },
		diagonal: { viewBox: "0 0 685 760", pair: [diagonalA, diagonalB] },
		retal: { viewBox: "0 0 553 537", pair: [retalA, retalB] },
		contrast: { viewBox: "0 0 618 642", pair: [contrastA, contrastB] },
		implicit: { viewBox: "0 0 500 500", pair: [implicitA, implicitB] },
	};

	var reducedMotion = window.matchMedia &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	/* All sweep demos share one clock so side-by-side cards move in sync. */
	var SWEEP_MS = 3200;
	function easeInOutCubic(t) {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}
	function sweepPhase(now) {
		var raw = (now % SWEEP_MS) / SWEEP_MS;
		var pingPong = raw < 0.5 ? raw * 2 : (1 - raw) * 2;
		return easeInOutCubic(pingPong);
	}

	/* ---- One carousel card --------------------------------------------- */

	function initDemo(card) {
		var def = DEMOS[card.dataset.demo];
		if (!def) return;

		var svg = document.createElementNS(SVG_NS, "svg");
		svg.setAttribute("viewBox", def.viewBox);
		svg.setAttribute("role", "img");
		svg.setAttribute("aria-label", card.dataset.label || "Italify outline demo");
		var path = document.createElementNS(SVG_NS, "path");
		path.setAttribute("class", def.filled ? "demo-outline demo-outline-filled" : "demo-outline");
		svg.appendChild(path);

		var figure = card.querySelector(".demo-figure");
		figure.appendChild(svg);

		var morphs = {};
		function morphFor(key, pair) {
			if (!morphs[key]) morphs[key] = compileMorph(pair[0], pair[1]);
			return morphs[key];
		}

		var variant = def.toggle && def.toggle.variantOff ? def.toggle.variantOff : "pair";
		var animating = !(def.toggle && def.toggle.mode === "animate" && !def.toggle.defaultOn);

		function currentMorph() {
			var pair = def.variants ? def.variants[variant] : def.pair;
			return morphFor(variant, pair);
		}

		// Variants can have DIFFERENT skeletons (removing overlap drops a
		// subpath), so each gets its own lazily-created overlay; only the
		// active one is shown.
		var overlays = {};
		function overlayFor(key, types) {
			if (!overlays[key]) overlays[key] = makeOverlay(svg, types);
			return overlays[key];
		}
		function showOnly(activeKey) {
			Object.keys(overlays).forEach(function (key) {
				overlays[key].setVisible(key === activeKey);
			});
		}

		var staticParsed = def.staticPath ? parsePath(def.staticPath) : null;

		function renderT(t) {
			if (!animating && staticParsed) {
				path.setAttribute("d", def.staticPath);
				var staticOverlay = overlayFor("static", staticParsed.types);
				showOnly("static");
				staticOverlay.update(staticParsed.coords);
				return;
			}
			var morph = currentMorph();
			var coords = lerpInto(morph, t);
			path.setAttribute("d", buildD(morph.types, coords));
			var overlay = overlayFor(variant, morph.types);
			showOnly(variant);
			overlay.update(coords);
		}

		// Toggle wiring (at most one per card).
		var toggleInput = card.querySelector(".demo-toggle input");
		if (toggleInput && def.toggle) {
			toggleInput.addEventListener("change", function () {
				if (def.toggle.mode === "animate") {
					animating = toggleInput.checked;
				} else {
					variant = toggleInput.checked ? def.toggle.variantOn : def.toggle.variantOff;
				}
				renderT(reducedMotion ? 1 : lastPhase);
			});
		}

		// Animation loop, gated on visibility.
		var raf = 0;
		var lastPhase = reducedMotion ? 1 : 0;

		function tick(now) {
			lastPhase = sweepPhase(now);
			renderT(lastPhase);
			raf = requestAnimationFrame(tick);
		}
		function start() {
			if (!raf && !reducedMotion) raf = requestAnimationFrame(tick);
		}
		function stop() {
			if (raf) { cancelAnimationFrame(raf); raf = 0; }
		}

		renderT(reducedMotion ? 1 : 0);
		if (reducedMotion) return; // static corrected outline, no loop

		if ("IntersectionObserver" in window) {
			new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) start(); else stop();
				});
			}, { threshold: 0.05 }).observe(card);
		} else {
			start();
		}
	}

	/* ---- Carousel chrome (arrows + dots) -------------------------------- */

	function initCarousel(wrap) {
		var track = wrap.querySelector(".demo-carousel");
		var cards = Array.prototype.slice.call(track.querySelectorAll(".demo-card"));
		var prev = wrap.querySelector(".demo-nav-prev");
		var next = wrap.querySelector(".demo-nav-next");
		var dots = wrap.querySelector(".demo-dots");

		cards.forEach(function (card, index) {
			initDemo(card);
			if (dots) {
				var dot = document.createElement("button");
				dot.type = "button";
				dot.className = "demo-dot";
				dot.setAttribute("aria-label", "Go to demo " + (index + 1));
				dot.addEventListener("click", function () {
					track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
				});
				dots.appendChild(dot);
			}
		});

		function activeIndex() {
			var mid = track.scrollLeft + track.clientWidth / 2;
			var best = 0, bestDist = Infinity;
			cards.forEach(function (card, index) {
				var center = card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
				var dist = Math.abs(center - mid);
				if (dist < bestDist) { bestDist = dist; best = index; }
			});
			return best;
		}

		function sync() {
			var active = activeIndex();
			if (dots) {
				Array.prototype.forEach.call(dots.children, function (dot, index) {
					dot.classList.toggle("active", index === active);
				});
			}
			if (prev) prev.disabled = active === 0;
			if (next) next.disabled = active === cards.length - 1;
		}

		function step(direction) {
			var target = Math.min(cards.length - 1, Math.max(0, activeIndex() + direction));
			track.scrollTo({
				left: cards[target].offsetLeft - track.offsetLeft,
				behavior: "smooth",
			});
		}

		if (prev) prev.addEventListener("click", function () { step(-1); });
		if (next) next.addEventListener("click", function () { step(1); });
		var scrollTimer;
		track.addEventListener("scroll", function () {
			clearTimeout(scrollTimer);
			scrollTimer = setTimeout(sync, 80);
		}, { passive: true });
		sync();
	}

	/* ---- Hero ------------------------------------------------------------
	   Slant toggle + correction slider + node toggle. No standing loop:
	   renders on input, with one 450 ms coordinate-space transition when
	   the slant is switched (numeric lerp between the current and target
	   coordinate buffers – everything shares the hero skeleton). */

	function initHero(root) {
		var svg = root.querySelector("svg");
		var path = root.querySelector(".hero-outline");
		var slantInput = root.querySelector(".hero-slant input");
		var slider = root.querySelector(".hero-slider");
		var nodesInput = root.querySelector(".hero-nodes-toggle input");
		if (!svg || !path || !slantInput || !slider || !nodesInput) return;

		var base = parsePath(heroBase);
		var morph = compileMorph(heroFrom, heroTo);
		if (!sameStructure(base, { types: morph.types, coords: morph.from })) {
			console.warn("italify-demos: hero base incompatible with morph pair");
		}

		var overlay = makeOverlay(svg, morph.types);
		var current = new Float64Array(base.coords); // what's on screen now
		var scratch = new Float64Array(base.coords.length);
		var anim = 0;

		function targetCoords(into) {
			if (!slantInput.checked) {
				into.set(base.coords);
				return into;
			}
			var t = Number(slider.value) / 100;
			for (var i = 0; i < morph.from.length; i++) {
				into[i] = morph.from[i] + (morph.to[i] - morph.from[i]) * t;
			}
			return into;
		}

		function paint() {
			path.setAttribute("d", buildD(morph.types, current));
			var showNodes = nodesInput.checked;
			path.classList.toggle("demo-outline-filled", !showNodes);
			overlay.setVisible(showNodes);
			if (showNodes) overlay.update(current);
		}

		function jumpToTarget() {
			targetCoords(current);
			paint();
		}

		function transitionToTarget() {
			if (anim) cancelAnimationFrame(anim);
			var fromSnapshot = new Float64Array(current);
			var target = targetCoords(new Float64Array(current.length));
			var startTime = null;
			var duration = 450;
			function stepFrame(now) {
				if (startTime === null) startTime = now;
				var progress = Math.min(1, (now - startTime) / duration);
				var eased = easeInOutCubic(progress);
				for (var i = 0; i < current.length; i++) {
					current[i] = fromSnapshot[i] + (target[i] - fromSnapshot[i]) * eased;
				}
				paint();
				anim = progress < 1 ? requestAnimationFrame(stepFrame) : 0;
			}
			anim = requestAnimationFrame(stepFrame);
		}

		function syncDisabled() {
			slider.disabled = !slantInput.checked;
			root.classList.toggle("hero-slant-on", slantInput.checked);
		}

		slantInput.addEventListener("change", function () {
			syncDisabled();
			if (reducedMotion) jumpToTarget(); else transitionToTarget();
		});
		slider.addEventListener("input", jumpToTarget);
		nodesInput.addEventListener("change", paint);

		syncDisabled();
		jumpToTarget();
	}

	/* ---- Boot ------------------------------------------------------------ */

	function init() {
		document.querySelectorAll("[data-italify-hero]").forEach(initHero);
		document.querySelectorAll(".demo-carousel-wrap").forEach(initCarousel);
	}

	if (window.__italifyContentRendered) init();
	document.addEventListener("italify:rendered", init);
})();
