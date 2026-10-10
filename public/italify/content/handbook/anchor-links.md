# Anchor links {#anchor-links}

@lede Connect an anchor to the outline so that it follows the correction.

An **anchor link** ties an anchor to one or more outline nodes so that a corrected shape includes the anchor it is designed to work with. Think of an *o* where the anchor is simply slanted, while the curves are corrected: accents will not sit visually centred anymore.

```screenshot wide
img: ../images/anchorDrift.png
caption: Left: uncorrected anchors, the accent drifts to the right. Right: anchors linked to their base path, the accents follow the visual correction.
```

## Linking anchors {#linking}

From an anchor, drag its halo onto the node you want to connect it to. An anchor links to **any number of nodes**. Grab an existing link’s halo to drag it onto another node (**move** the link) or away from attached nodes (**remove** it). Press [[⌫]] with the anchor selected to clear all of its links at once. Hold [[⌥]] for any of these action to mirror the change across compatible masters.

```screenshot wide
img: ../images/anchorLinks.png
alt: A selected anchor linked to two on-curve nodes, light-blue dotted link lines running to halos on each node.
caption: The `top` anchor is linked to a curve node, the `topright` anchor follows the horizontal movement of the linked curve.
```

## How a linked anchor moves {#anchor-movement}

A linked anchor renders **purple** instead of blue, and each link draws as a light-blue dotted line to its node. When attaching anchors to vertical/horizontal intersections with curves, it follows the axis on which it intersects with the curve. Click on the arrows to toggle between movement direction: ↔ for left/right movement, ↕ for up/down. Hold [[⌥]] to mirror the change across masters.

The anchor follows the corrected outlines depending on their type: It will move 50% of the way a smooth curve node moves, while it moves 100% when connected to anything else.

## Auto-linking {#auto-link}

**Auto-Link Anchors** (also in the [Glyph → Italify menu](glyph-menu)) links every unlinked anchor in one go: an anchor sitting **on a curve** (within 4‰ of the UPM, e.g. 4 units in a 1000 UPM font) gets an x/y-intersection link onto that curve and every other anchor links to its **nearest on-curve node**.

With **anchors selected** the item reads *Auto-Link Selected Anchors* and runs on just those. Anchors that already have a link are never touched, so you can auto-link first and refine by hand after. There is no “in all masters” variant. Verify the results first in one master and then propagate the links afterwards instead. Scripts can pick anchors by name, with `*` wildcards, using [`auto_link_anchors`](../python-api#bulk).

Copy / Paste / Propagate / Clear for anchor links live in the right-click *Anchors* section (see [Copy, paste & propagate](copy-paste)) and the [Glyph → Italify menu](glyph-menu).
