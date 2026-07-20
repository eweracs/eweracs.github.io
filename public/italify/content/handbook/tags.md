@overline [Italify Handbook](./)

# Tags {#node-flags}

@lede Five per-node marks outside the stem model – each changes how the filter treats one spot.

```toc
1. [Limit Curve](#limit-curve)
2. [No Curve Correction](#no-curve-correction)
3. [Inktrap](#inktrap)
4. [Y-Snap](#snap-y)
5. [Terminal](#terminal)
```

Five **Tags** live outside the stem model – each marks an individual node or segment and changes how the filter treats that one spot. Every Tag has a canvas marker, a keyboard shortcut, and an entry in the right-click *Tags* section, and each is removed the same way it was added. Hold [[⌥]] on any of them to mirror the change across every compatible master.

## Limit Curve {#limit-curve}

At an unsmooth curve boundary, the filter normally infers some extra context, which can lead to certain segments being transformed more strongly than desired. **Limit Curve** switches that off for one node – the tagged node becomes its own reference context. The node and its attached only slide **along the node’s own tangent**, so the curve can’t billow out beyond the corner. Use it wherever the inferred context drags a curve too far.

Select the on-curve node (or several) at a curve→line or curve→curve corner and press [[L]], or right-click and choose *Toggle Limit Curve*. The marker is a teal square around the node.

```screenshot
img: ../images/limitCurve.png
alt: An unsmooth curve corner with the teal Limit-Curve square around the tagged node.
caption: Limit Curve pins a curve’s transformation direction to its own tangent.
```

## No Curve Correction {#no-curve-correction}

**No Curve Correction** takes a whole curve segment out of curve correction. The segment is then only slanted – its drawn shape is preserved exactly.

The tag sits on **both** on-curve endpoints of the segment (any curve, cubic or quadratic, with at least one off-curve between them). Select those two nodes and press [[N]], or right-click and choose *Toggle No Curve Correction*; press [[N]] again to remove it. The segment draws with a yellow overlay along its length.

```screenshot
img: ../images/noCurveCorrection.png
alt: A curve segment carrying the yellow No-Curve-Correction overlay.
caption: No Curve Correction preserves a curve’s shape, only slanting it.
```

## Inktrap {#inktrap}

Mark a two-nodes line segment as **Inktrap** to keep it at its original length. After Italify corrects the two adjoining segments, an ink trap is held rigid and shifted so it still spans exactly its original distance. The neighbours can be lines or curves; the segment’s two endpoints simply land back on the corrected neighbours.

Select the two on-curve nodes at the ends of a straight segment – they must be directly connected and both **unsmooth** – and press [[I]], or right-click and choose *Add Inktrap*.

On the canvas the tagged segment glows purple, a short stretch of each adjoining contour is highlighted. Click anywhere in the ink trap to select it and press [[⌫]] to remove the tag.

```screenshot
img: ../images/inktrap.png
alt: A short straight segment tagged as an inktrap, glowing purple.
caption: An Inktrap segment preserves its size even after correction of the adjoining segments.
```

## Y-Snap {#snap-y}

By default the filter automatically holds a node's height in place in one common case: an **unsmooth line-to-curve** corner sitting exactly on a metric (baseline, x-height, …) is pinned to that metric through the correction, so it doesn't drift off it. Every node this affects is marked with a violet pin. (This automatic behaviour is governed by the [`autoSnapToMetrics`](filter#hidden-settings) hidden setting.)

**Y-Snap** lets you take that decision by hand, node by node. It is a simple *retain the y position* – the metric is only how the automatic case is detected, so the override works on **any** on-curve node, on a metric or not:

- Tag a node the automatic snap *misses* (a line-to-line or curve-to-curve corner, a smooth node, or a node at any height) and it will hold its y exactly.
- Tag a node the automatic snap *catches* and it is released – free to move with the correction.

Select the node (or several) and press [[Y]], or right-click and choose *Toggle Y-Snap*. The key flips each node's current state: one that snaps is released, one that doesn't is pinned. The marker is the same violet pin the automatic snap uses – a pinned node shows it, a released node shows nothing. To hand a node back to the automatic behaviour, clear its tag (right-click *Clear all Tags*, or [[⌫]]).

```screenshot
img: ../images/snapY.png
alt: A node tagged Y-Snap carrying the violet pin marker, holding its height through the correction.
caption: Y-Snap keeps a node at its original height, on a metric or not.
```

## Terminal {#terminal}

A **terminal** is a straight segment that caps a stroke – the flat cut of a *c*, *e* or *s*. The [Keep Terminals](filter#parameters) parameter holds a terminal's cut in place through the italicisation: at 100% the angle it makes with its two adjoining segments after the slant matches the upright. The filter finds the obvious terminals automatically (a line between two curves heading the same way), and draws every one it will keep in **green**.

**Terminal** lets you take that decision by hand. Tag any straight two-node segment whose end connections are **unsmooth** – it can be a line between two stems, not just between two curves – and the filter keeps it too. Tagging a segment the tool already detects instead **opts it out**.

Select the two on-curve nodes at the ends of the segment and press [[C]] (think of *C*ap), or right-click and choose *Toggle Terminal*. There is no restriction on the two neighbours – a straight cut holds its cleanest when they are roughly parallel, but the choice is yours; the filter keeps whatever you tag. The segment draws in green. To hand a segment back to the automatic detection, clear its tag.

This works even when the terminal’s visible corners are **open corners** or when the outline carries a **duplicate node** at a corner: the tool looks past the short connector to the real curve or line on the other side, and the kept angle is measured at the visible intersection – which is also where the green highlight is drawn. The open corners themselves survive the correction: only the tagged line rotates, and the overlap structure stays intact.

One related behaviour: an [anchor](anchor-links) linked to a node that sits on a terminal follows that node **fully, in both x and y** – a terminal is a moving cut, so an anchor on it rides along completely rather than tracking only its horizontal shift.

```screenshot
img: ../images/terminal.png
alt: A straight terminal segment drawn with the green terminal highlight, its cut angle held through the slant.
caption: Terminals (green) keep their cut angle to the adjoining segments.
```
