@overline [Italify Handbook](./)

# Anchor links {#anchor-links}

@lede Tie a Glyphs anchor to the outline so it rides along when the filter corrects it.

An **anchor link** ties a Glyphs *anchor* to one or more outline nodes so it rides along when the filter corrects them. Useful for keeping anchors in sync with the curve shape they are designed to sit on.

## Linking anchors {#linking}

Click an anchor to select it – the rest of the stem and tag overlays fade to grey so the links stand out; [[Shift]]-click to select several. With an anchor selected, **drag**: the anchor itself never moves; a halo follows the cursor and snaps onto the nearest **on-curve** node, and releasing links the anchor to it. An anchor links to **any number of nodes** – attaching is additive. Grab an existing link’s halo to drag it onto another node (**move** the link) or clear of any node (**remove** it). Press [[⌫]] with the anchor selected to clear all of its links at once. Hold [[⌥]] on any of these to mirror the change across compatible masters (anchor matched by name, node by index).

Anchors and stem selection are mutually exclusive: while a stem is selected the anchors grey out and stop responding to clicks, so a click lands on the stem’s own controls instead – handy when an anchor sits right over the flip-axis button. Click empty space to deselect the stem and the anchors are live again. (The [[⌘A]] cycle’s anchor phases are the exception, showing stems and anchors selected together.)

```screenshot wide
img: ../images/anchorLinks.png
alt: A selected anchor linked to two on-curve nodes, light-blue dotted link lines running to halos on each node.
caption: An anchor linked to stem nodes – it rides them through correction.
```

## How a linked anchor moves {#anchor-movement}

A linked anchor renders **purple** instead of blue, and each link draws as a light-blue dotted line to its node. At correction time the anchor is shifted horizontally by the **average of its linked nodes' weighted movements**: a node sitting on only straight segments carries the anchor **100 %** of the way it moves, while a node with a curve on either side carries it **50 %**. So an anchor linked to a single line-to-line node tracks that node exactly, one linked to a curve node moves half as far, and one linked to both moves by the average of the two. At 0 % correction nothing moves, so the anchor lands exactly where a plain slant would put it. Its vertical position is left untouched. (The exception is a node on a [terminal](tags#terminal), which carries its anchor fully in both x and y.)

## Linking to intersections {#anchor-intersections}

When a [terminal](tags#terminal)'s visible corner is an **open corner**, the link gesture also snaps onto the visible **intersection point** – the corner the outline actually shows, rather than the overshooting node beyond it. The link then draws at the intersection, and the anchor follows the intersection's corrected position in both x and y.

The gesture also snaps onto **path intersections** – the crossing points where two contours overlap (the bar of a *t* through its stem, say). Drag the halo onto a crossing and the link attaches to the intersection itself: it draws at the crossing, and the anchor follows the crossing's corrected position at **100 % in both x and y**, counting as one participant in the average like any linked node. The crossing is recomputed from the outline whenever it is needed, so the link tracks the corrected geometry exactly. Grab the crossing link's halo to move it – drop it on a node, a candidate ring, or another crossing – or pull it clear to remove it; [[⌫]] with the anchor selected clears it along with the rest, and copy / paste / propagate carry it like any other link.

While an anchor is selected, small **rings pop up on curve segments** wherever the horizontal line at the anchor's y – or the vertical line at its x – crosses a curve. Drag the halo onto a ring to link the anchor to that **x/y intersection**: the link point is “where the curve passes my height (or my x)”, recomputed live, and the anchor follows it at **100 %** – so an anchor sitting beside a bowl tracks exactly how far the curve drifts at its own height through the correction. Move or remove it by its halo like any other link – any lifted link can be dropped onto a node, a candidate ring, or a crossing, whatever kind it started as.

For an anchor sitting essentially **on** the curve the two rings coincide, so the direction is set with a control instead: a selected anchor with an x/y link shows a small **arrow below its marker** – ↔ for left/right movement, ↕ for up/down. **Click the arrow to toggle** between the two; hold [[⌥]] to mirror the change across masters.

## Auto-linking {#auto-link}

**Auto-Link Anchors** (last item in the right-click *Anchors* section, and in the [Glyph → Italify menu](glyph-menu)) links every unlinked anchor in one go: an anchor sitting **on a curve** (within 4‰ of the UPM, e.g. 4 units in a 1000 UPM font) gets an x/y-intersection link onto that curve – the axis is chosen across the curve's direction – and every other anchor links to its **nearest on-curve node**. With anchors selected the item reads *Auto-Link Selected Anchors* and runs on just those. Anchors that already have a link are never touched, so you can auto-link first and refine by hand after. There is no “in all masters” variant – propagate the links afterwards instead.

Copy / Paste / Propagate / Clear for anchor links live in the right-click *Anchors* section (see [Copy, paste & propagate](copy-paste)) and the [Glyph → Italify menu](glyph-menu).
