"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

type SegmentMove = { type: "M" | "L"; x: number; y: number };
type SegmentCurve = {
  type: "C";
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
  x: number;
  y: number;
};
type SegmentClose = { type: "Z"; x: number; y: number };
type Segment = SegmentMove | SegmentCurve | SegmentClose;

type Palette = {
  accent: string;
  ink: string;
  paper: string;
};

const sweepA =
  "M199.014,510c60,0,119-19,170-52c72-47,128-120,149-203c36-143-48-255-191-255c-50,0-100,13-144,37c-54,28-100,71-133,123c-20,29-34,61-42,95c-25,102,10,188,84,229c30,17,66,26,107,26Z";
const sweepB =
  "M238.624,510c48,0,95-15,137-42c57-38,103-96,120-163c42-171-58-305-229-305c-40,0-80,10-116,30c-42,22-80,57-108,99c-14,23-26,49-33,76c-30,122,12,225,100,274c36,20,80,31,129,31Z";

const pairs = {
  a: {
    from:
      "M0,702h281c170,0,282-75,306-197c18-87-21-143-94-166c79-34,127-87,141-158c23-114-60-181-217-181h-277ZM876,712c163,0,276-97,310-265s-41-265-204-265s-276,97-310,265s41,265,204,265ZM900,591c-56,0-73-45-53-144s55-144,111-144s73,45,53,144s-55,144-111,144ZM1932,712c118,0,196-55,246-141l-143-37c-18,42-47,63-84,63c-52,0-74-39-62-116h320c42-208-18-299-177-299c-166,0-275,105-306,262c-33,164,41,268,206,268ZM2237,702h170l60-298c14-71,56-101,98-101c37,0,52,19,43,65l-67,334h170l69-344c22-109-34-176-134-176c-63,0-113,27-151,78l14-68h-170ZM1401,712c132,0,227-64,248-169c38-193-236-129-221-208c5-24,31-41,63-41c37,0,57,23,54,62l140-38c-6-86-68-134-176-134c-126,0-224,68-244,169c-37,184,234,123,217,207c-5,25-29,42-61,42c-39,0-59-26-52-66l-157,29c-2,93,67,147,189,147ZM200,570l32-159h106c60,0,84,26,73,80s-45,79-105,79ZM257,285l31-153h93c58,0,81,25,71,76c-10,50-44,77-102,77ZM1908,391c17-58,48-95,101-95c50,0,65,32,57,95Z",
    to:
      "M0,702h315c148,0,246-65,268-174c18-89-15-150-85-180c76-30,118-77,132-144c25-128-68-204-245-204h-245ZM909,712c142,0,241-85,270-231c38-190-46-299-230-299c-142,0-241,85-270,231c-38,190,46,299,230,299ZM911,591c-64,0-83-51-60-162c17-87,48-126,96-126c64,0,83,51,60,162c-17,87-48,126-96,126ZM1963,712c108,0,178-53,222-136l-147-45c-15,44-42,66-80,66c-52,0-77-39-68-116h318c33-208-37-299-206-299c-147,0-242,92-270,228c-37,185,47,302,231,302ZM2237,702h170l62-311c13-62,49-88,89-88c42,0,59,21,48,73l-65,326h170l64-321c25-123-29-199-150-199c-52,0-94,21-126,61l10-51h-170ZM1428,712c116,0,198-56,216-147c39-194-231-153-215-235c5-21,27-36,55-36c36,0,58,21,60,58l135-29c-11-90-80-139-197-139c-110,0-195,59-213,147c-37,187,230,147,212,234c-4,22-25,37-53,37c-39,0-61-25-58-63l-153,22c4,96,82,151,211,151ZM200,570l32-159h95c67,0,94,29,82,90c-9,47-39,69-92,69ZM257,285l31-153h82c65,0,91,28,80,86c-9,43-38,67-89,67ZM1907,391c14-58,42-95,93-95c52,0,70,32,65,95Z",
  },
};

const basePath =
  "M0,702h281c170,0,267-75,267-197c0-87-50-143-127-166c72-34,109-87,109-158c0-114-96-181-253-181h-277ZM878,712c163,0,257-97,257-265s-94-265-257-265s-257,97-257,265s94,265,257,265ZM878,591c-56,0-82-45-82-144s26-144,82-144s82,45,82,144s-26,144-82,144ZM1934,712c118,0,185-55,218-141l-151-37c-9,42-34,63-71,63c-52,0-82-39-85-116h320c0-208-78-299-237-299c-166,0-254,105-254,262c0,164,95,268,260,268ZM2237,702h170v-298c0-71,36-101,78-101c37,0,56,19,56,65v334h170v-344c0-109-69-176-169-176c-63,0-108,27-135,78v-68h-170ZM1403,712c132,0,214-64,214-169c0-193-262-129-262-208c0-24,22-41,54-41c37,0,62,23,67,62l132-38c-23-86-95-134-203-134c-126,0-210,68-210,169c0,184,259,123,259,207c0,25-21,42-53,42c-39,0-64-26-65-66l-151,29c16,93,96,147,218,147ZM174,570v-159h106c60,0,89,26,89,80s-29,79-89,79ZM174,285v-153h93c58,0,86,25,86,76c0,50-28,77-86,77ZM1846,391c5-58,29-95,82-95c50,0,71,32,76,95Z";

const parsePath = (d: string): Segment[] => {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  const segments: Segment[] = [];
  let i = 0;
  let cmd = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let prevControlX: number | null = null;
  let prevControlY: number | null = null;

  const nextNumber = () => Number(tokens[i++]);

  while (i < tokens.length) {
    const token = tokens[i++];
    if (/[a-zA-Z]/.test(token)) {
      cmd = token;
    } else {
      i -= 1;
    }

    switch (cmd) {
      case "M": {
        x = nextNumber();
        y = nextNumber();
        startX = x;
        startY = y;
        segments.push({ type: "M", x, y });
        prevControlX = null;
        prevControlY = null;
        cmd = "L";
        break;
      }
      case "m": {
        x += nextNumber();
        y += nextNumber();
        startX = x;
        startY = y;
        segments.push({ type: "M", x, y });
        prevControlX = null;
        prevControlY = null;
        cmd = "l";
        break;
      }
      case "L": {
        x = nextNumber();
        y = nextNumber();
        segments.push({ type: "L", x, y });
        prevControlX = null;
        prevControlY = null;
        break;
      }
      case "l": {
        x += nextNumber();
        y += nextNumber();
        segments.push({ type: "L", x, y });
        prevControlX = null;
        prevControlY = null;
        break;
      }
      case "H": {
        x = nextNumber();
        segments.push({ type: "L", x, y });
        prevControlX = null;
        prevControlY = null;
        break;
      }
      case "h": {
        x += nextNumber();
        segments.push({ type: "L", x, y });
        prevControlX = null;
        prevControlY = null;
        break;
      }
      case "V": {
        y = nextNumber();
        segments.push({ type: "L", x, y });
        prevControlX = null;
        prevControlY = null;
        break;
      }
      case "v": {
        y += nextNumber();
        segments.push({ type: "L", x, y });
        prevControlX = null;
        prevControlY = null;
        break;
      }
      case "C": {
        const c1x = nextNumber();
        const c1y = nextNumber();
        const c2x = nextNumber();
        const c2y = nextNumber();
        x = nextNumber();
        y = nextNumber();
        segments.push({ type: "C", c1x, c1y, c2x, c2y, x, y });
        prevControlX = c2x;
        prevControlY = c2y;
        break;
      }
      case "c": {
        const c1x = x + nextNumber();
        const c1y = y + nextNumber();
        const c2x = x + nextNumber();
        const c2y = y + nextNumber();
        x += nextNumber();
        y += nextNumber();
        segments.push({ type: "C", c1x, c1y, c2x, c2y, x, y });
        prevControlX = c2x;
        prevControlY = c2y;
        break;
      }
      case "S": {
        let c1x = x;
        let c1y = y;
        if (prevControlX !== null && prevControlY !== null) {
          c1x = x * 2 - prevControlX;
          c1y = y * 2 - prevControlY;
        }
        const c2x = nextNumber();
        const c2y = nextNumber();
        x = nextNumber();
        y = nextNumber();
        segments.push({ type: "C", c1x, c1y, c2x, c2y, x, y });
        prevControlX = c2x;
        prevControlY = c2y;
        break;
      }
      case "s": {
        let c1x = x;
        let c1y = y;
        if (prevControlX !== null && prevControlY !== null) {
          c1x = x * 2 - prevControlX;
          c1y = y * 2 - prevControlY;
        }
        const c2x = x + nextNumber();
        const c2y = y + nextNumber();
        x += nextNumber();
        y += nextNumber();
        segments.push({ type: "C", c1x, c1y, c2x, c2y, x, y });
        prevControlX = c2x;
        prevControlY = c2y;
        break;
      }
      case "Z":
      case "z": {
        segments.push({ type: "Z", x: startX, y: startY });
        x = startX;
        y = startY;
        prevControlX = null;
        prevControlY = null;
        break;
      }
      default: {
        break;
      }
    }
  }
  return segments;
};

const isCurve = (seg: Segment): seg is SegmentCurve => seg.type === "C";

const drawNodes = (d: string, group: SVGGElement, clear = false, palette: Palette) => {
  if (clear) {
    while (group.firstChild) {
      group.removeChild(group.firstChild);
    }
  }
  const segments = parsePath(d);
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  const svgNS = "http://www.w3.org/2000/svg";
  const handleGroup = document.createElementNS(svgNS, "g");
  const nodeGroup = document.createElementNS(svgNS, "g");
  group.appendChild(handleGroup);
  group.appendChild(nodeGroup);

  const addCircle = (x: number, y: number, r: number, fill: string, stroke: string) => {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", `${x}`);
    circle.setAttribute("cy", `${y}`);
    circle.setAttribute("r", `${r}`);
    circle.setAttribute("fill", fill);
    circle.setAttribute("stroke", stroke);
    circle.setAttribute("stroke-width", "1.4");
    nodeGroup.appendChild(circle);
  };
  const addCross = (x: number, y: number, size: number, stroke: string) => {
    const lineA = document.createElementNS(svgNS, "line");
    const lineB = document.createElementNS(svgNS, "line");
    lineA.setAttribute("x1", `${x - size}`);
    lineA.setAttribute("y1", `${y - size}`);
    lineA.setAttribute("x2", `${x + size}`);
    lineA.setAttribute("y2", `${y + size}`);
    lineB.setAttribute("x1", `${x - size}`);
    lineB.setAttribute("y1", `${y + size}`);
    lineB.setAttribute("x2", `${x + size}`);
    lineB.setAttribute("y2", `${y - size}`);
    lineA.setAttribute("stroke", stroke);
    lineB.setAttribute("stroke", stroke);
    lineA.setAttribute("stroke-width", "1.6");
    lineB.setAttribute("stroke-width", "1.6");
    nodeGroup.appendChild(lineA);
    nodeGroup.appendChild(lineB);
  };
  const addHandle = (x1: number, y1: number, x2: number, y2: number) => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", `${x1}`);
    line.setAttribute("y1", `${y1}`);
    line.setAttribute("x2", `${x2}`);
    line.setAttribute("y2", `${y2}`);
    line.setAttribute("stroke", palette.accent);
    line.setAttribute("stroke-width", "1.2");
    line.setAttribute("opacity", "0.7");
    handleGroup.appendChild(line);
  };

  segments.forEach((seg) => {
    if (seg.type === "M") {
      currentX = seg.x;
      currentY = seg.y;
      startX = seg.x;
      startY = seg.y;
      addCircle(seg.x, seg.y, 8, palette.paper, palette.ink);
      return;
    }
    if (isCurve(seg)) {
      addHandle(currentX, currentY, seg.c1x, seg.c1y);
      addHandle(seg.x, seg.y, seg.c2x, seg.c2y);
      addCross(seg.c1x, seg.c1y, 6, "#ffffff");
      addCross(seg.c2x, seg.c2y, 6, "#ffffff");
      addCircle(seg.x, seg.y, 8, palette.paper, palette.ink);
      currentX = seg.x;
      currentY = seg.y;
      return;
    }
    if (seg.type === "L") {
      addCircle(seg.x, seg.y, 8, palette.paper, palette.ink);
      currentX = seg.x;
      currentY = seg.y;
      return;
    }
    if (seg.type === "Z") {
      currentX = startX;
      currentY = startY;
    }
  });
};

const interpolateSegments = (from: string, to: string, t: number) => {
  const fromSeg = parsePath(from);
  const toSeg = parsePath(to);
  if (!fromSeg || !toSeg || fromSeg.length !== toSeg.length) {
    return { path: null, reason: "segment mismatch" };
  }
  const parts: string[] = [];
  for (let i = 0; i < fromSeg.length; i += 1) {
    const a = fromSeg[i];
    const b = toSeg[i];
    if (a.type !== b.type) {
      return { path: null, reason: "command mismatch" };
    }
    if (a.type === "M" || a.type === "L") {
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      parts.push(`${a.type}${Number(x.toFixed(3))} ${Number(y.toFixed(3))}`);
    } else if (isCurve(a) && isCurve(b)) {
      const c1x = a.c1x + (b.c1x - a.c1x) * t;
      const c1y = a.c1y + (b.c1y - a.c1y) * t;
      const c2x = a.c2x + (b.c2x - a.c2x) * t;
      const c2y = a.c2y + (b.c2y - a.c2y) * t;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      parts.push(
        `C${Number(c1x.toFixed(3))} ${Number(c1y.toFixed(3))} ${Number(c2x.toFixed(3))} ${Number(
          c2y.toFixed(3)
        )} ${Number(x.toFixed(3))} ${Number(y.toFixed(3))}`
      );
    } else if (a.type === "Z") {
      parts.push("Z");
    }
  }
  return { path: parts.join(" "), reason: "ok" };
};

export default function ItalifyClient() {
  const sliderRef = useRef<HTMLInputElement>(null);
  const toggleNodesRef = useRef<HTMLInputElement>(null);
  const toggleSlantRef = useRef<HTMLInputElement>(null);
  const morphOuterRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<SVGGElement>(null);
  const sweepPathRef = useRef<SVGPathElement>(null);
  const sweepNodesRef = useRef<SVGGElement>(null);
  const morphAnimRef = useRef<number | null>(null);
  const currentOuterPathRef = useRef<string>(basePath);
  const [flubberReady, setFlubberReady] = useState(false);
  const [isSlantOn, setIsSlantOn] = useState(false);
  const [sweepValue, setSweepValue] = useState(0);

  const palette = useMemo<Palette>(
    () => ({
      accent: "#ffffff",
      ink: "#ffffff",
      paper: "#0f172a",
    }),
    []
  );

  useEffect(() => {
    if (!flubberReady) {
      return;
    }

    const flubber = (window as { flubber?: { interpolate: (...args: unknown[]) => (t: number) => string } })
      .flubber;
    if (!flubber) {
      return;
    }

    const slider = sliderRef.current;
    const toggleNodes = toggleNodesRef.current;
    const toggleSlant = toggleSlantRef.current;
    const morphOuter = morphOuterRef.current;
    const nodesGroup = nodesRef.current;

    if (!slider || !toggleNodes || !toggleSlant || !morphOuter || !nodesGroup) {
      return;
    }

    const { from: fromPath, to: toPath } = pairs.a;
    const outerInterpolator = flubber.interpolate(fromPath, toPath, {
      maxSegmentLength: 2,
    });

    const render = (percent: number, overridePath?: string) => {
      const t = percent / 100;
      const slantOn = toggleSlant.checked;
      let outerPath = basePath;
      if (slantOn) {
        const outerBlend = interpolateSegments(fromPath, toPath, t);
        outerPath = outerBlend.path || outerInterpolator(t);
      }
      if (overridePath) {
        outerPath = overridePath;
      }
      currentOuterPathRef.current = outerPath;
      morphOuter.setAttribute("d", outerPath);
      if (toggleNodes.checked) {
        morphOuter.style.fill = "none";
        morphOuter.style.stroke = "currentColor";
        morphOuter.style.strokeWidth = "2";
        drawNodes(outerPath, nodesGroup, true, palette);
      } else {
        morphOuter.style.fill = "currentColor";
        morphOuter.style.stroke = "none";
        morphOuter.style.strokeWidth = "";
        nodesGroup.replaceChildren();
      }
    };

    const renderAll = (percent: number) => {
      render(percent);
    };

    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      if (!target) {
        return;
      }
      renderAll(Number(target.value));
    };

    const onToggleNodes = () => renderAll(Number(slider.value));
    const animateBetween = (from: string, to: string) => {
      if (morphAnimRef.current !== null) {
        cancelAnimationFrame(morphAnimRef.current);
      }
      const duration = 450;
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (start === null) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(progress);
        const blend = interpolateSegments(from, to, eased);
        const d = blend.path || (eased < 0.5 ? from : to);
        render(Number(slider.value), d);
        if (progress < 1) {
          morphAnimRef.current = requestAnimationFrame(step);
        } else {
          morphAnimRef.current = null;
        }
      };

      morphAnimRef.current = requestAnimationFrame(step);
    };

    const onToggleSlant = () => {
      slider.disabled = !toggleSlant.checked;
      setIsSlantOn(toggleSlant.checked);
      const percent = Number(slider.value);
      const targetBlend = interpolateSegments(fromPath, toPath, percent / 100);
      const targetPath = targetBlend.path || outerInterpolator(percent / 100);
      const fromPathForAnim = currentOuterPathRef.current || basePath;
      const toPathForAnim = toggleSlant.checked ? targetPath : basePath;
      animateBetween(fromPathForAnim, toPathForAnim);
    };

    slider.addEventListener("input", onInput);
    toggleNodes.addEventListener("change", onToggleNodes);
    toggleSlant.addEventListener("change", onToggleSlant);

    slider.disabled = !toggleSlant.checked;
    setIsSlantOn(toggleSlant.checked);
    renderAll(0);

    return () => {
      slider.removeEventListener("input", onInput);
      toggleNodes.removeEventListener("change", onToggleNodes);
      toggleSlant.removeEventListener("change", onToggleSlant);
      if (morphAnimRef.current !== null) {
        cancelAnimationFrame(morphAnimRef.current);
        morphAnimRef.current = null;
      }
    };
  }, [flubberReady, palette]);

  useEffect(() => {
    if (!flubberReady) {
      return;
    }

    const flubber = (window as { flubber?: { interpolate: (...args: unknown[]) => (t: number) => string } })
      .flubber;
    if (!flubber) {
      return;
    }

    const sweepPath = sweepPathRef.current;
    const sweepNodes = sweepNodesRef.current;
    if (!sweepPath || !sweepNodes) {
      return;
    }

    const interpolator = flubber.interpolate(sweepA, sweepB, {
      maxSegmentLength: 2,
    });

    let raf = 0;
    let start: number | null = null;
    const duration = 3200;

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (timestamp: number) => {
      if (start === null) {
        start = timestamp;
      }
      const elapsed = timestamp - start;
      const raw = (elapsed % duration) / duration;
      const pingPong = raw < 0.5 ? raw * 2 : (1 - raw) * 2;
      const eased = easeInOutCubic(pingPong);

      const sweepBlend = interpolateSegments(sweepA, sweepB, eased);
      const d = sweepBlend.path || interpolator(eased);
      sweepPath.setAttribute("d", d);
      drawNodes(d, sweepNodes, true, palette);
      setSweepValue(Number(eased.toFixed(3)));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [flubberReady, palette]);

  return (
    <main className="min-h-screen bg-slate-900 text-white px-[6vw] py-12">
      <Script
        src="https://unpkg.com/flubber@0.4.2"
        strategy="afterInteractive"
        onLoad={() => setFlubberReady(true)}
      />
      <section className="max-w-[1100px] mx-auto">
        <h1 className="text-[clamp(2rem,4vw,2.8rem)] [font-variation-settings:'wght'_700]">
          Italify
        </h1>
        <p className="text-white/90 leading-[1.7]">
          Italify is an algorithmic approach to optical correction of oblique curves.
        </p>

        <div className="my-6 py-4 border-y border-white/10">
          <div className="grid grid-cols-[120px_1fr] gap-y-4 items-center text-white/80 text-sm">
            <span>Slant</span>
            <label className="inline-flex items-center gap-2">
              <input
                ref={toggleSlantRef}
                id="toggle-slant"
                type="checkbox"
                className="peer sr-only"
              />
              <span className="relative h-5 w-5 rounded-full border border-white/30 bg-white/5 transition peer-checked:[&>svg]:opacity-100">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="absolute inset-0 m-auto h-3.5 w-3.5 text-amber-400 opacity-0 transition"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 10.5l3 3 7-7" />
                </svg>
              </span>
            </label>

            <span className={isSlantOn ? "text-white/80" : "text-white/40"}>Correction</span>
            <div
              className={`flex flex-wrap items-center gap-3 ${
                isSlantOn ? "text-white/80" : "text-white/40"
              }`}
            >
              <input
                ref={sliderRef}
                id="slider"
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                className={`w-40 h-1 appearance-none rounded-full bg-white/15 accent-amber-400 focus:outline-none ${
                  isSlantOn ? "" : "opacity-60"
                }`}
              />
            </div>

            <span>Show nodes</span>
            <label className="inline-flex items-center gap-2">
              <input
                ref={toggleNodesRef}
                id="toggle-nodes"
                type="checkbox"
                className="peer sr-only"
              />
              <span className="relative h-5 w-5 rounded-full border border-white/30 bg-white/5 transition peer-checked:[&>svg]:opacity-100">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="absolute inset-0 m-auto h-3.5 w-3.5 text-amber-400 opacity-0 transition"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 10.5l3 3 7-7" />
                </svg>
              </span>
            </label>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="bg-slate-900 p-5" data-pair="a">
            <svg
              viewBox="0 0 2784 712"
              role="img"
              aria-label="Interpolated outline"
              className="w-full h-auto overflow-visible text-white"
            >
              <path ref={morphOuterRef} className="fill-current"></path>
              <g ref={nodesRef} className="nodes" fill="none" strokeWidth="2"></g>
            </svg>
          </section>
        </div>

        <div className="mt-10 space-y-4 text-white/85">
          <p className="leading-relaxed">
            Italify is a novel algorithm that offers a purely geometric approach to oblique curve
            correction. Existing correction approaches include:
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Slanting and rotating curves (proposed by{" "}
              <a
                href="https://help.fontlab.com/fontlab/8/tutorials/briem/4-3-italic/briem-4-34-curves"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-colors"
              >
                Karow/Briem
              </a>
              ). The resulting outlines require a lot of manual intervention.
            </li>
            <li>
              Slanting and adjusting curves by hand. Very tedious and manual, with inconsistent
              results and no formalisable algorithm.
            </li>
            <li>Stem-based transformation (e.g. Glyphs’ Cursivy algorithm). Some of the worst examples include {" "}
              <a
                  href="https://fonts.google.com/specimen/Inter"
                  target="_blank"
                  rel="noopener referrer"
                  className="text-white/90 hover:text-white transition-colors"
              >
                Inter
              </a>
              ’s italics.
            </li>
            <li>The {" "}
              <a
                  href="https://github.com/googlefonts/roboto-2/blob/main/scripts/lib/fontbuild/italics.py"
                  target="_blank"
                  rel="noopener referrer"
                  className="text-white/90 hover:text-white transition-colors"
              >
                algorithm
              </a> used to generate {" "}
              <a
                  href="https://fonts.google.com/specimen/Roboto"
                  target="_blank"
                  rel="noopener referrer"
                  className="text-white/90 hover:text-white transition-colors"
              >
                Roboto
              </a>’s obliques. The resulting obliques have the same problems as Inter.
            </li>
            <li>
              Various other combinations (as shown by {" "}
              <a
                  href="https://vimeo.com/1059825184"
                  target="_blank"
                  rel="noopener referrer"
                  className="text-white/90 hover:text-white transition-colors"
              >
                Jeremy Tribby
              </a>
              ).
            </li>
          </ol>
          <p className="leading-relaxed">
            Italify, in stark contrast, actually produces usable results. It is a stem-agnostic, purely geometrical algorithm. It
            guarantees master compatibility, as it doesn’t add or remove any nodes.
            Furthermore, all horizontal extremes stay perfectly on their height coordinates.
          </p>
        </div>

        <section className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
            <div className="bg-slate-900 p-5 w-full">
              <svg
                viewBox="0 0 526 510"
                role="img"
                aria-label="Interpolated stroke"
                className="w-full h-auto overflow-visible text-white"
              >
                <path ref={sweepPathRef} className="fill-none stroke-current" strokeWidth="3" />
                <g ref={sweepNodesRef} className="nodes" fill="none" strokeWidth="2"></g>
              </svg>
            </div>
            <div className="text-white/85 leading-relaxed">
              Thanks to Italify’s purely geometrical approach, curves with multiple intermediate
              points are transformed without a problem. This can be useful in cases where a pure
              extreme-to-extreme curve construction doesn’t allow for the desired curve shape.
              The result is exactly the same as if the extra nodes were omitted.
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-white/70 text-sm w-full lg:max-w-[50%]">
            <span>Correction</span>
            <div className="relative flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-amber-400"
                style={{ width: `${Math.round(sweepValue * 100)}%` }}
              ></div>
            </div>
          </div>
        </section>
          The algorithm takes as much context into account as necessary in order to
          calculate transformations. It handles all possible node types (segment transitions), as enumerated below:
          <ul className="list-disc pl-4 space-y-3">
            <li>
              Has curve before
              <ul className="list-disc pl-4 mt-2 space-y-2 border-l border-white/15">
                <li>
                  Has curve after
                  <ul className="list-disc pl-4 mt-2 space-y-2 border-l border-white/15">
                    <li>
                      <span className="inline-flex items-center gap-2">
                        Smooth transition
                        <svg
                          viewBox="0 -20 400 220"
                          aria-hidden="true"
                          className="w-7 h-3 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeLinecap="round"
                        >
                          <path d="M400,200c0-110-90-200-200-200s-200,90-200,200"></path>
                        </svg>
                      </span>
                    </li>
                    <li>
                      <span className="inline-flex items-center gap-2">
                        Unsmooth transition
                        <svg
                          viewBox="0 -20 400 220"
                          aria-hidden="true"
                          className="w-7 h-3 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeLinecap="round"
                        >
                          <path d="M400,200c-110,0-200-90-200-200c-110,0-200,90-200,200"></path>
                        </svg>
                      </span>
                    </li>
                  </ul>
                </li>
                <li>
                  Has no curve after
                  <ul className="list-disc pl-4 mt-2 space-y-2 border-l border-white/15">
                    <li>
                      <span className="inline-flex items-center gap-2">
                        Smooth transition
                        <svg
                          viewBox="0 -20 400 220"
                          aria-hidden="true"
                          className="w-7 h-3 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeLinecap="round"
                        >
                          <path d="M400,0h-200c-110,0-200,90-200,200"></path>
                        </svg>
                      </span>
                    </li>
                    <li>
                      <span className="inline-flex items-center gap-2">
                        Unsmooth transition
                        <svg
                          viewBox="0 -20 400 220"
                          aria-hidden="true"
                          className="w-7 h-3 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeLinecap="round"
                        >
                          <path d="M400,200l-200-200c-110,0-200,90-200,200"></path>
                        </svg>
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Has no curve before
              <ul className="list-disc pl-4 mt-2 space-y-2 border-l border-white/15">
                <li>
                  Has curve after
                  <ul className="list-disc pl-4 mt-2 space-y-2 border-l border-white/15">
                    <li>
                      <span className="inline-flex items-center gap-2">
                        Smooth transition
                        <svg
                          viewBox="0 -20 400 220"
                          aria-hidden="true"
                          className="w-7 h-3 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeLinecap="round"
                        >
                          <path d="M0,0h200c110,0,200,90,200,200"></path>
                        </svg>
                      </span>
                    </li>
                    <li>
                      <span className="inline-flex items-center gap-2">
                        Unsmooth transition
                        <svg
                          viewBox="0 -20 400 220"
                          aria-hidden="true"
                          className="w-7 h-3 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeLinecap="round"
                        >
                          <path d="M400,200c0-110-90-200-200-200l-200,200"></path>
                        </svg>
                      </span>
                    </li>
                  </ul>
                </li>
                <li>
                  Has no curve after
                  <ul className="list-disc pl-4 mt-2 space-y-2 border-l border-white/15">
                    <li>
                      <span className="inline-flex items-center gap-2">
                        Smooth transition
                        <svg
                          viewBox="0 -20 400 220"
                          aria-hidden="true"
                          className="w-7 h-3 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeLinecap="round"
                        >
                          <path d="M400,0h-200h-200"></path>
                        </svg>
                      </span>
                    </li>
                    <li>
                      <span className="inline-flex items-center gap-2">
                        Unsmooth transition
                        <svg
                          viewBox="0 -20 400 220"
                          aria-hidden="true"
                          className="w-7 h-3 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="20"
                          strokeLinecap="round"
                        >
                          <path d="M400,200l-200-200l-200,200"></path>
                        </svg>
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
      </section>
    </main>
  );
}
