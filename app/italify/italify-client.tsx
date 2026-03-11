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

type NodeCache = {
  handleGroup: SVGGElement;
  nodeGroup: SVGGElement;
  handles: SVGLineElement[];
  crosses: SVGLineElement[];
  circles: SVGCircleElement[];
};

const sweepA =
  "M199.014,510c60,0,119-19,170-52c72-47,128-120,149-203c36-143-48-255-191-255c-50,0-100,13-144,37c-54,28-100,71-133,123c-20,29-34,61-42,95c-25,102,10,188,84,229c30,17,66,26,107,26Z";
const sweepB =
  "M238.624,510c48,0,95-15,137-42c57-38,103-96,120-163c42-171-58-305-229-305c-40,0-80,10-116,30c-42,22-80,57-108,99c-14,23-26,49-33,76c-30,122,12,225,100,274c36,20,80,31,129,31Z";
const overlapA =
  "M171.494,730c65,0,117-26,156-78l-14,68h164l144-720h-170l-54,268c-19-46-60-68-121-68c-131,0-235,99-268,264c-33,167,32,266,163,266ZM243.494,609c-69,0-76-66-60-146c16-79,49-142,118-142c61,0,75,55,57,143c-18,90-54,145-115,145Z";
const overlapB =
  "M188.891,730c52,0,96-20,128-60l-10,50h164l144-720h-170l-57,287c-22-59-69-87-142-87c-113,0-208,85-236,227c-38,190,36,303,179,303ZM248.891,609c-78,0-86-75-68-166c14-68,42-122,102-122c70,0,85,63,65,163c-15,78-47,125-99,125Z";
const overlapAltA =
  "M171.494,730c118,0,192-83,228-265c36-181-4-265-123-265c-131,0-235,99-268,264c-33,167,32,266,163,266ZM243.494,609c-69,0-76-66-60-146c16-79,49-142,118-142c61,0,75,55,57,143c-18,90-54,145-115,145ZM313.494,720h164l144-720h-170l-120,599l3,16Z";
const overlapAltB =
  "M188.891,730c102,0,165-71,197-228c41-206-5-302-140-302c-119,0-208,85-236,227c-38,190,36,303,179,303ZM248.891,609c-78,0-86-75-68-166c14-68,42-122,102-122c70,0,85,63,65,163c-15,78-47,125-99,125ZM306.891,720h164l144-720h-170l-120,600l3,14Z";
const inflectA =
  "M189.042,528c132,0,227-64,248-169c38-193-236-129-221-208c5-24,31-41,63-41c37,0,57,23,54,62l140-38c-6-86-68-134-176-134c-126,0-224,68-244,169c-37,184,234,123,217,207c-5,25-29,42-61,42c-39,0-59-26-52-66l-157,29c-2,93,67,147,189,147Z";
const inflectB =
  "M211,528c116,0,198-56,216-147c39-194-231-153-215-235c5-21,27-36,55-36c36,0,58,21,60,58l135-29c-11-90-80-139-197-139c-110,0-195,59-213,147c-37,187,230,147,212,234c-4,22-25,37-53,37c-39,0-61-25-58-63l-153,22c4,96,82,151,211,151Z";
const roundedA =
  "M165.924,559c150,0,256-67,278-176c35-171-179-150-168-205c3-11,13-19,27-19c30,0,58,34,99,34s79-36,89-86c8-40-8-70-46-87c-27-13-73-20-121-20c-145,0-244,65-266,174c-35,174,168,158,158,209c-2,11-13,18-30,18c-36,0-61-34-98-34c-39,0-76,37-86,85c-8,42,9,72,50,89c27,12,68,18,114,18Z";
const roundedB =
  "M189.174,559c137,0,229-58,247-152c35-173-173-175-162-232c2-9,11-16,23-16c31,0,64,34,111,34c36,0,69-31,77-74c9-43-9-77-53-96c-31-15-82-23-137-23c-131,0-216,56-235,150c-35,175,163,182,153,235c-2,10-12,16-26,16c-38,0-68-34-110-34c-35,0-67,32-75,73c-9,45,10,79,56,99c31,13,78,20,131,20Z";
const roundedStatic =
  "M185,559c150,0,243-67,243-176c0-171-209-150-209-205c0-11,9-19,23-19c30,0,65,34,106,34s71-36,71-86c0-40-22-70-63-87c-30-13-77-20-125-20c-145,0-231,65-231,174c0,174,200,158,200,209c0,11-10,18-27,18c-36,0-67-34-104-34c-39,0-69,37-69,85c0,42,23,72,67,89c30,12,72,18,118,18Z";
const retalA =
  "M333.766,537c168,0,234-53,218-131c-5-23-16-44-34-61c-52,19-100,27-153,27c-52,0-105-15-114-59l-10-51c-12-58-9-97,34-97c18,0,37,12,43,46l10,47l20-30h-157l19,96h190c87,0,145-33,126-125c-25-126-120-199-256-199c-231,0-294,151-262,309c32,160,161,228,326,228Z";
const retalB =
  "M285.117,537c128,0,191-52,204-103c6-23,4-57-10-81c-43,13-80,19-121,19c-86,0-132-19-120-77l11-57c9-44,24-73,57-73c24,0,43,16,34,60l-7,34l32-31h-157l-19,96h226c67,0,120-25,134-95c26-132-60-229-240-229c-183,0-277,115-301,235c-43,212,90,302,277,302Z";
const contrastA =
  "M232.902,642c127,0,243-69,321-188c-48,17-105,27-147,27c-125,0-161-89-120-253c27-106,68-175,104-175c34,0,35,62,4,187l10-3h-166l-10,39h379c40-170-34-276-204-276c-184,0-345,133-392,323c-47,186,49,319,221,319Z";
const contrastB =
  "M274.261,642c106,0,222-69,286-187c-43,17-94,26-132,26c-156,0-188-104-143-283c22-88,56-145,87-145c37,0,41,62,13,187l11-3h-167l-10,39h376c23-171-65-276-247-276c-160,0-293,110-333,269c-54,217,36,373,259,373Z";

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

const drawNodes = (d: string, group: SVGGElement, palette: Palette) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const cacheKey = "__nodesCache";
  const cached = (group as unknown as { [key: string]: NodeCache | undefined })[cacheKey];
  let cache = cached;

  if (!cache) {
    const handleGroup = document.createElementNS(svgNS, "g");
    const nodeGroup = document.createElementNS(svgNS, "g");
    group.appendChild(handleGroup);
    group.appendChild(nodeGroup);
    cache = {
      handleGroup,
      nodeGroup,
      handles: [],
      crosses: [],
      circles: [],
    };
    (group as unknown as { [key: string]: NodeCache | undefined })[cacheKey] = cache;
  }

  const segments = parsePath(d);
  const circles: Array<{ x: number; y: number; r: number; fill: string; stroke: string }> = [];
  const handles: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const crosses: Array<{ x: number; y: number; size: number; stroke: string }> = [];
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  segments.forEach((seg) => {
    if (seg.type === "M") {
      currentX = seg.x;
      currentY = seg.y;
      startX = seg.x;
      startY = seg.y;
      circles.push({ x: seg.x, y: seg.y, r: 8, fill: palette.paper, stroke: palette.ink });
      return;
    }
    if (isCurve(seg)) {
      handles.push({ x1: currentX, y1: currentY, x2: seg.c1x, y2: seg.c1y });
      handles.push({ x1: seg.x, y1: seg.y, x2: seg.c2x, y2: seg.c2y });
      crosses.push({ x: seg.c1x, y: seg.c1y, size: 6, stroke: "#ffffff" });
      crosses.push({ x: seg.c2x, y: seg.c2y, size: 6, stroke: "#ffffff" });
      circles.push({ x: seg.x, y: seg.y, r: 8, fill: palette.paper, stroke: palette.ink });
      currentX = seg.x;
      currentY = seg.y;
      return;
    }
    if (seg.type === "L") {
      circles.push({ x: seg.x, y: seg.y, r: 8, fill: palette.paper, stroke: palette.ink });
      currentX = seg.x;
      currentY = seg.y;
      return;
    }
    if (seg.type === "Z") {
      currentX = startX;
      currentY = startY;
    }
  });

  const ensureLines = (list: SVGLineElement[], count: number, parent: SVGGElement) => {
    while (list.length < count) {
      const line = document.createElementNS(svgNS, "line");
      parent.appendChild(line);
      list.push(line);
    }
    while (list.length > count) {
      const line = list.pop();
      if (line) {
        parent.removeChild(line);
      }
    }
  };

  const ensureCircles = (list: SVGCircleElement[], count: number, parent: SVGGElement) => {
    while (list.length < count) {
      const circle = document.createElementNS(svgNS, "circle");
      parent.appendChild(circle);
      list.push(circle);
    }
    while (list.length > count) {
      const circle = list.pop();
      if (circle) {
        parent.removeChild(circle);
      }
    }
  };

  ensureLines(cache.handles, handles.length, cache.handleGroup);
  ensureLines(cache.crosses, crosses.length * 2, cache.nodeGroup);
  ensureCircles(cache.circles, circles.length, cache.nodeGroup);

  handles.forEach((h, i) => {
    const line = cache.handles[i];
    line.setAttribute("x1", `${h.x1}`);
    line.setAttribute("y1", `${h.y1}`);
    line.setAttribute("x2", `${h.x2}`);
    line.setAttribute("y2", `${h.y2}`);
    line.setAttribute("stroke", palette.accent);
    line.setAttribute("stroke-width", "1.2");
    line.setAttribute("opacity", "0.7");
  });

  crosses.forEach((c, i) => {
    const lineA = cache.crosses[i * 2];
    const lineB = cache.crosses[i * 2 + 1];
    lineA.setAttribute("x1", `${c.x - c.size}`);
    lineA.setAttribute("y1", `${c.y - c.size}`);
    lineA.setAttribute("x2", `${c.x + c.size}`);
    lineA.setAttribute("y2", `${c.y + c.size}`);
    lineB.setAttribute("x1", `${c.x - c.size}`);
    lineB.setAttribute("y1", `${c.y + c.size}`);
    lineB.setAttribute("x2", `${c.x + c.size}`);
    lineB.setAttribute("y2", `${c.y - c.size}`);
    lineA.setAttribute("stroke", c.stroke);
    lineB.setAttribute("stroke", c.stroke);
    lineA.setAttribute("stroke-width", "1.6");
    lineB.setAttribute("stroke-width", "1.6");
  });

  circles.forEach((c, i) => {
    const circle = cache.circles[i];
    circle.setAttribute("cx", `${c.x}`);
    circle.setAttribute("cy", `${c.y}`);
    circle.setAttribute("r", `${c.r}`);
    circle.setAttribute("fill", c.fill);
    circle.setAttribute("stroke", c.stroke);
    circle.setAttribute("stroke-width", "1.4");
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
  const overlapPathRef = useRef<SVGPathElement>(null);
  const overlapNodesRef = useRef<SVGGElement>(null);
  const inflectPathRef = useRef<SVGPathElement>(null);
  const inflectNodesRef = useRef<SVGGElement>(null);
  const roundedPathRef = useRef<SVGPathElement>(null);
  const roundedNodesRef = useRef<SVGGElement>(null);
  const retalPathRef = useRef<SVGPathElement>(null);
  const retalNodesRef = useRef<SVGGElement>(null);
  const contrastPathRef = useRef<SVGPathElement>(null);
  const contrastNodesRef = useRef<SVGGElement>(null);
  const morphAnimRef = useRef<number | null>(null);
  const currentOuterPathRef = useRef<string>(basePath);
  const syncStartRef = useRef<number | null>(null);
  const showOverlapNodesRef = useRef(true);
  const showInflectNodesRef = useRef(true);
  const showRoundedNodesRef = useRef(true);
  const showRetalNodesRef = useRef(true);
  const showContrastNodesRef = useRef(true);
  const removeOverlapRef = useRef(false);
  const roundedSlantRef = useRef(false);
  const overlapInterpolatorRef = useRef<((t: number) => string) | null>(null);
  const overlapKeyRef = useRef<string>("");
  const [flubberReady, setFlubberReady] = useState(false);
  const [isSlantOn, setIsSlantOn] = useState(false);
  const [sweepValue, setSweepValue] = useState(0);
  const [removeOverlap, setRemoveOverlap] = useState(false);
  const [roundedSlant, setRoundedSlant] = useState(false);
  const [showOverlapNodes, setShowOverlapNodes] = useState(true);
  const [showInflectNodes, setShowInflectNodes] = useState(true);
  const [showRoundedNodes, setShowRoundedNodes] = useState(true);
  const [showRetalNodes, setShowRetalNodes] = useState(true);
  const [showContrastNodes, setShowContrastNodes] = useState(true);

  useEffect(() => {
    showOverlapNodesRef.current = showOverlapNodes;
  }, [showOverlapNodes]);

  useEffect(() => {
    showInflectNodesRef.current = showInflectNodes;
  }, [showInflectNodes]);

  useEffect(() => {
    showRoundedNodesRef.current = showRoundedNodes;
  }, [showRoundedNodes]);

  useEffect(() => {
    showRetalNodesRef.current = showRetalNodes;
  }, [showRetalNodes]);

  useEffect(() => {
    showContrastNodesRef.current = showContrastNodes;
  }, [showContrastNodes]);

  useEffect(() => {
    removeOverlapRef.current = removeOverlap;
  }, [removeOverlap]);

  useEffect(() => {
    roundedSlantRef.current = roundedSlant;
  }, [roundedSlant]);

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
        nodesGroup.style.display = "";
        drawNodes(outerPath, nodesGroup, palette);
      } else {
        morphOuter.style.fill = "currentColor";
        morphOuter.style.stroke = "none";
        morphOuter.style.strokeWidth = "";
        nodesGroup.style.display = "none";
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
    const overlapPath = overlapPathRef.current;
    const overlapNodes = overlapNodesRef.current;
    const inflectPath = inflectPathRef.current;
    const inflectNodes = inflectNodesRef.current;
    const roundedPath = roundedPathRef.current;
    const roundedNodes = roundedNodesRef.current;
    const retalPath = retalPathRef.current;
    const retalNodes = retalNodesRef.current;
    const contrastPath = contrastPathRef.current;
    const contrastNodes = contrastNodesRef.current;

    if (
      (!sweepPath || !sweepNodes) &&
      (!overlapPath || !overlapNodes) &&
      (!inflectPath || !inflectNodes) &&
      (!roundedPath || !roundedNodes) &&
      (!retalPath || !retalNodes) &&
      (!contrastPath || !contrastNodes)
    ) {
      return;
    }

    const sweepInterpolator = flubber.interpolate(sweepA, sweepB, {
      maxSegmentLength: 2,
    });
    const getOverlapInterpolator = () => {
      const activeA = removeOverlapRef.current ? overlapA : overlapAltA;
      const activeB = removeOverlapRef.current ? overlapB : overlapAltB;
      const key = `${activeA}|${activeB}`;
      if (overlapKeyRef.current !== key || !overlapInterpolatorRef.current) {
        overlapKeyRef.current = key;
        overlapInterpolatorRef.current = flubber.interpolate(activeA, activeB, {
          maxSegmentLength: 2,
        });
      }
      return { activeA, activeB, interpolator: overlapInterpolatorRef.current };
    };
    const inflectInterpolator = flubber.interpolate(inflectA, inflectB, {
      maxSegmentLength: 2,
    });
    const roundedInterpolator = flubber.interpolate(roundedA, roundedB, {
      maxSegmentLength: 2,
    });
    const retalInterpolator = flubber.interpolate(retalA, retalB, {
      maxSegmentLength: 2,
    });
    const contrastInterpolator = flubber.interpolate(contrastA, contrastB, {
      maxSegmentLength: 2,
    });

    let raf = 0;
    const duration = 3200;
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (timestamp: number) => {
      if (syncStartRef.current === null) {
        syncStartRef.current = timestamp;
      }
      const elapsed = timestamp - syncStartRef.current;
      const raw = (elapsed % duration) / duration;
      const pingPong = raw < 0.5 ? raw * 2 : (1 - raw) * 2;
      const eased = easeInOutCubic(pingPong);

      if (sweepPath && sweepNodes) {
        const sweepBlend = interpolateSegments(sweepA, sweepB, eased);
        const d = sweepBlend.path || sweepInterpolator(eased);
        sweepPath.setAttribute("d", d);
        sweepPath.style.fill = "none";
        sweepPath.style.stroke = "currentColor";
        sweepPath.style.strokeWidth = "2";
        sweepNodes.style.display = "";
        drawNodes(d, sweepNodes, palette);
        setSweepValue(Number(eased.toFixed(3)));
      }

      if (overlapPath && overlapNodes) {
        const { activeA, activeB, interpolator } = getOverlapInterpolator();
        const blend = interpolateSegments(activeA, activeB, eased);
        const d = blend.path || interpolator(eased);
        overlapPath.setAttribute("d", d);
        if (showOverlapNodesRef.current) {
          overlapPath.style.fill = "none";
          overlapPath.style.stroke = "currentColor";
          overlapPath.style.strokeWidth = "2";
          overlapNodes.style.display = "";
          drawNodes(d, overlapNodes, palette);
        } else {
          overlapPath.style.fill = "currentColor";
          overlapPath.style.stroke = "none";
          overlapPath.style.strokeWidth = "";
          overlapNodes.style.display = "none";
        }
        const box = overlapPath.getBBox();
        const viewWidth = 621;
        const dx = viewWidth - (box.x + box.width);
        overlapPath.setAttribute("transform", `translate(${dx}, 0)`);
        overlapNodes.setAttribute("transform", `translate(${dx}, 0)`);
      }

      if (inflectPath && inflectNodes) {
        const blend = interpolateSegments(inflectA, inflectB, eased);
        const d = blend.path || inflectInterpolator(eased);
        inflectPath.setAttribute("d", d);
        if (showInflectNodesRef.current) {
          inflectPath.style.fill = "none";
          inflectPath.style.stroke = "currentColor";
          inflectPath.style.strokeWidth = "2";
          inflectNodes.style.display = "";
          drawNodes(d, inflectNodes, palette);
        } else {
          inflectPath.style.fill = "currentColor";
          inflectPath.style.stroke = "none";
          inflectPath.style.strokeWidth = "";
          inflectNodes.style.display = "none";
        }
        const box = inflectPath.getBBox();
        const viewWidth = 473;
        const dx = viewWidth / 2 - (box.x + box.width / 2);
        inflectPath.setAttribute("transform", `translate(${dx}, 0)`);
        inflectNodes.setAttribute("transform", `translate(${dx}, 0)`);
      }

      if (roundedPath && roundedNodes) {
        const viewWidth = 492;
        const d = roundedSlantRef.current
          ? (interpolateSegments(roundedA, roundedB, eased).path || roundedInterpolator(eased))
          : roundedStatic;
        roundedPath.setAttribute("d", d);
        if (showRoundedNodesRef.current) {
          roundedPath.style.fill = "none";
          roundedPath.style.stroke = "currentColor";
          roundedPath.style.strokeWidth = "2";
          roundedNodes.style.display = "";
          drawNodes(d, roundedNodes, palette);
        } else {
          roundedPath.style.fill = "currentColor";
          roundedPath.style.stroke = "none";
          roundedPath.style.strokeWidth = "";
          roundedNodes.style.display = "none";
        }
        const box = roundedPath.getBBox();
        const dx = viewWidth / 2 - (box.x + box.width / 2);
        roundedPath.setAttribute("transform", `translate(${dx}, 0)`);
        roundedNodes.setAttribute("transform", `translate(${dx}, 0)`);
      }

      if (retalPath && retalNodes) {
        const blend = interpolateSegments(retalA, retalB, eased);
        const d = blend.path || retalInterpolator(eased);
        retalPath.setAttribute("d", d);
        if (showRetalNodesRef.current) {
          retalPath.style.fill = "none";
          retalPath.style.stroke = "currentColor";
          retalPath.style.strokeWidth = "2";
          retalNodes.style.display = "";
          drawNodes(d, retalNodes, palette);
        } else {
          retalPath.style.fill = "currentColor";
          retalPath.style.stroke = "none";
          retalPath.style.strokeWidth = "";
          retalNodes.style.display = "none";
        }
        const box = retalPath.getBBox();
        const viewWidth = retalPath.ownerSVGElement?.viewBox.baseVal.width || 553;
        const dx = viewWidth / 2 - (box.x + box.width / 2);
        retalPath.setAttribute("transform", `translate(${dx}, 0)`);
        retalNodes.setAttribute("transform", `translate(${dx}, 0)`);
      }

      if (contrastPath && contrastNodes) {
        const blend = interpolateSegments(contrastA, contrastB, eased);
        const d = blend.path || contrastInterpolator(eased);
        contrastPath.setAttribute("d", d);
        if (showContrastNodesRef.current) {
          contrastPath.style.fill = "none";
          contrastPath.style.stroke = "currentColor";
          contrastPath.style.strokeWidth = "2";
          contrastNodes.style.display = "";
          drawNodes(d, contrastNodes, palette);
        } else {
          contrastPath.style.fill = "currentColor";
          contrastPath.style.stroke = "none";
          contrastPath.style.strokeWidth = "";
          contrastNodes.style.display = "none";
        }
        const box = contrastPath.getBBox();
        const viewWidth = contrastPath.ownerSVGElement?.viewBox.baseVal.width || 618;
        const dx = viewWidth / 2 - (box.x + box.width / 2);
        contrastPath.setAttribute("transform", `translate(${dx}, 0)`);
        contrastNodes.setAttribute("transform", `translate(${dx}, 0)`);
      }

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
      <header className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-4 mb-12">
        <a
          href="/?section=hello"
          className="text-white/90 hover:text-white transition-all no-underline"
        >
          Sebastian Carewe
        </a>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-white/70">
          <a
            href="/?section=hello"
            className="hover:text-white transition-all no-underline [font-variant-caps:all-small-caps] tracking-[0.08em]"
          >
            Hello
          </a>
          <a
            href="/?section=projects"
            className="hover:text-white transition-all no-underline [font-variant-caps:all-small-caps] tracking-[0.08em]"
          >
            Projects
          </a>
          <a
            href="/?section=expertise"
            className="hover:text-white transition-all no-underline [font-variant-caps:all-small-caps] tracking-[0.08em]"
          >
            Expertise
          </a>
          <a
            href="/?section=about"
            className="hover:text-white transition-all no-underline [font-variant-caps:all-small-caps] tracking-[0.08em]"
          >
            About
          </a>
        </nav>
      </header>
      <section className="max-w-[1100px] mx-auto">
        <h1 className="text-center text-[clamp(2rem,4vw,2.8rem)] [font-variation-settings:'wght'_700]">
          Italify
        </h1>
        <p className="text-white/90 leading-[1.7] text-center">
          An algorithmic approach to optical correction of oblique curves
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

        <p className="mt-3 text-white/60 text-sm">
          Font in use:{" "}
          <a
            href="https://mnkytype.com/wilson"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-all"
          >
            MNKY Wilson
          </a>
        </p>

        <div className="mt-10 space-y-4 text-white/85">
          <p className="leading-relaxed">
            Italify is a novel algorithm that offers a purely geometric approach to oblique curve
            correction. So far, the most popular approaches have been:
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Slanting and rotating curves (proposed by{" "}
              <a
                href="https://help.fontlab.com/fontlab/8/tutorials/briem/4-3-italic/briem-4-34-curves"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white transition-all"
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
                  className="text-white/90 hover:text-white transition-all"
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
                  className="text-white/90 hover:text-white transition-all"
              >
                algorithm
              </a> used to generate {" "}
              <a
                  href="https://fonts.google.com/specimen/Roboto"
                  target="_blank"
                  rel="noopener referrer"
                  className="text-white/90 hover:text-white transition-all"
              >
                Roboto
              </a>’s obliques. The resulting obliques have the same problems as Inter.
            </li>
            <li>
              Various other combinations (as demonstrated by {" "}
              <a
                  href="https://vimeo.com/1059825184"
                  target="_blank"
                  rel="noopener referrer"
                  className="text-white/90 hover:text-white transition-all"
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
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start lg:items-stretch">
            <div className="bg-slate-900 p-5 w-full">
              <svg
                viewBox="0 0 526 510"
                role="img"
                aria-label="Interpolated stroke"
                className="w-full h-auto overflow-visible text-white"
              >
                <path ref={sweepPathRef} className="fill-none stroke-current" strokeWidth="2" />
                <g ref={sweepNodesRef} className="nodes" fill="none" strokeWidth="2"></g>
              </svg>
            </div>
            <div className="text-white/85 leading-relaxed lg:flex lg:items-center lg:h-full">
              <div className="flex flex-col gap-3">
                <h2 className="text-white/90 text-xl">Extra nodes</h2>
                <p>
                  Thanks to Italify’s purely geometrical approach, curves with multiple intermediate
                  points are transformed without a problem. This can be useful in cases where a pure
                  extreme-to-extreme curve construction doesn’t allow for the desired curve shape.
                  The result is exactly the same as if the extra nodes were omitted.
                </p>
              </div>
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

        <section className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start lg:items-stretch">
            <div className="text-white/85 leading-relaxed lg:flex lg:items-center lg:h-full">
              <div className="flex flex-col gap-3">
                <h2 className="text-white/90 text-xl">Overlap-agnostic</h2>
                <p>
                  The algorithm works even when overlap is removed and curve intentions would seem
                  more difficult to guess.
                </p>
                <label className="inline-flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={removeOverlap}
                    onChange={(event) => setRemoveOverlap(event.target.checked)}
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
                  Remove overlap
                </label>
                <label className="inline-flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={showOverlapNodes}
                    onChange={(event) => setShowOverlapNodes(event.target.checked)}
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
                  Show nodes
                </label>
              </div>
            </div>
            <div className="bg-slate-900 p-5 w-full">
              <svg
                viewBox="0 0 621 730"
                role="img"
                aria-label="Overlap interpolation"
                className="w-full h-auto overflow-visible text-white"
              >
                <path ref={overlapPathRef} className="fill-none stroke-current" strokeWidth="2" />
                <g ref={overlapNodesRef} className="nodes" fill="none" strokeWidth="2"></g>
              </svg>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start lg:items-stretch">
            <div className="bg-slate-900 p-5 w-full">
              <svg
                viewBox="0 0 473 528"
                role="img"
                aria-label="Inflection interpolation"
                className="w-full h-auto overflow-visible text-white"
              >
                <path ref={inflectPathRef} className="fill-none stroke-current" strokeWidth="2" />
                <g ref={inflectNodesRef} className="nodes" fill="none" strokeWidth="2"></g>
              </svg>
            </div>
            <div className="text-white/85 leading-relaxed lg:flex lg:items-center lg:h-full">
              <div className="flex flex-col gap-3">
                <h2 className="text-white/90 text-xl">Inflections</h2>
                <p>
                  Italify handles inflecting curves, without the need to insert explicit inflection
                  points. This way, your outlines stay as smooth as possible.
                </p>
                <label className="inline-flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={showInflectNodes}
                    onChange={(event) => setShowInflectNodes(event.target.checked)}
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
                  Show nodes
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start lg:items-stretch">
            <div className="text-white/85 leading-relaxed lg:flex lg:items-center lg:h-full">
              <div className="flex flex-col gap-3">
                <h2 className="text-white/90 text-xl">Rounded fonts</h2>
                <p>
                  Even your squishy fonts can be manipulated with decent results. There are
                  limitations, but far less than with other approaches.
                </p>
                <label className="inline-flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={roundedSlant}
                    onChange={(event) => setRoundedSlant(event.target.checked)}
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
                  Italify!
                </label>
                <label className="inline-flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={showRoundedNodes}
                    onChange={(event) => setShowRoundedNodes(event.target.checked)}
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
                  Show nodes
                </label>
              </div>
            </div>
            <div className="bg-slate-900 p-5 w-full">
              <svg
                viewBox="0 0 492 559"
                role="img"
                aria-label="Rounded interpolation"
                className="w-full h-auto overflow-visible text-white"
              >
                <path ref={roundedPathRef} className="fill-none stroke-current" strokeWidth="2" />
                <g ref={roundedNodesRef} className="nodes" fill="none" strokeWidth="2"></g>
              </svg>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start lg:items-stretch">
            <div className="bg-slate-900 p-5 w-full">
              <svg
                viewBox="0 0 553 537"
                role="img"
                aria-label="Retalics interpolation"
                className="w-full h-auto overflow-visible text-white"
              >
                <path ref={retalPathRef} className="fill-none stroke-current" strokeWidth="2" />
                <g ref={retalNodesRef} className="nodes" fill="none" strokeWidth="2"></g>
              </svg>
            </div>
            <div className="text-white/85 leading-relaxed lg:flex lg:items-center lg:h-full">
              <div className="flex flex-col gap-3">
                <h2 className="text-white/90 text-xl">Retalics</h2>
                <p>
                  Whatever name you choose for your backslanted style, Italify has got you covered.
                </p>
                <p className="text-white/60 text-sm">
                  Font in use:{" "}
                  <a
                    href="https://lettermin.com/fonts/mae-soft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-all"
                  >
                    Mae Soft
                  </a>
                  {" "}(made with Italify)
                </p>
                <label className="inline-flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={showRetalNodes}
                    onChange={(event) => setShowRetalNodes(event.target.checked)}
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
                  Show nodes
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start lg:items-stretch">
            <div className="text-white/85 leading-relaxed lg:flex lg:items-center lg:h-full">
              <div className="flex flex-col gap-3">
                <h2 className="text-white/90 text-xl">High-contrast designs</h2>
                <p>
                  Theoretically, any curve can be treated with Italify. Whether it actually makes
                  sense for your design is your decision.
                </p>
                <label className="inline-flex items-center gap-2 text-white/80 text-sm">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={showContrastNodes}
                    onChange={(event) => setShowContrastNodes(event.target.checked)}
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
                  Show nodes
                </label>
              </div>
            </div>
            <div className="bg-slate-900 p-5 w-full">
              <svg
                viewBox="0 0 618 642"
                role="img"
                aria-label="High-contrast interpolation"
                className="w-full h-auto overflow-visible text-white"
              >
                <path ref={contrastPathRef} className="fill-none stroke-current" strokeWidth="2" />
                <g ref={contrastNodesRef} className="nodes" fill="none" strokeWidth="2"></g>
              </svg>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-white/10 pt-10">

          <h1 className="text-[clamp(2rem,4vw,2.8rem)] [font-variation-settings:'wght'_700]">Interested?</h1>
          <p className="mt-3 text-white/85">
            Italify is currently available as a service. Get in touch to request a quote for your
            project: sebastian.carewe
            <span className="email-protected" />
          </p>
        </section>
      </section>
    </main>
  );
}
