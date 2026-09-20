# Tags {#node-flags}

@lede Five per-node marks outside the stem model – each changes how the filter treats one spot.

Five **Tags** live outside the stem model – each marks an individual node or segment and changes how the filter treats that one spot. Every Tag has a canvas marker and an entry in the right-click *Tags* section, most have a keyboard shortcut, and each is removed the same way it was added. Hold [[⌥]] on any of them to mirror the change across every compatible master.

## Curve Extension {#curve-extension}

If a curve doesn’t have its nodes on extremes, Italify will try to infer a larger curve for calculations based on the existing curves. While mathematically correct, the resulting correction can look wrong, or simply not match the design intent. In that case, you can set a custom amount by which the existing curve is extended for the calculations.

Select the curve end that is *not* on an extreme and you get a teal **control point** which you can drag in order to adjust the amount of curve extension.

- The **round tick** fully extends the curve – the default.
- The **square tick** is the same as [Limit Curve](#limit-curve), where the curve is taken as-is.

Hold [[⌥]] when releasing to mirror the value onto every compatible master. Each master keeps its own value, and when Italify runs [at export](filter#export) an instance between masters gets a value in between – halfway between a master at 20 % and one at 80 %, the curve is extended by 50 %. A master without a setting counts as the default, 100 %.

For exact values, click the control point to select it: it shows its percentage, and [[↑]] and [[↓]] change it by 1 % – by 10 % with [[⇧]]. Click anywhere else to deselect it.

Occasionally a curve can’t be meaningfully extended by default – no usable extreme exists anywhere near it, so Italify takes the curve as-is. The control still appears at such corners, resting at the square tick: drag it to add as much extension as the geometry supports (the track simply ends where the result would stop being useful).

When the non-extreme node is the connection between two curves, the value is shared between the curves. A **doubled node** at the corner behaves like a single one: click either of the two and the control appears. A node with a partial setting is marked with a **teal circle** – select it to bring the control back. To return to the default, drag the point back to the round tick or select Remove Custom Extension [[⌫]].

A segment tagged [No Curve Correction](#no-curve-correction) offers no control: it isn’t corrected, so there is nothing to extend. A stored setting on such a node draws greyed and is ignored until the segment is corrected again.

To reuse a setting elsewhere, select the node, copy it with [[⌘C]], select the target node and paste – see [Copy & Paste](copy-paste.md).

```screenshot
img: ../images/curveExtension.png
tag: Screenshot – curve-centre control
caption: The curve extension control: drag the teal point to adjust how much additional curve information Italify infers.
```

### Limit Curve {#limit-curve}

If you drag the custom extension slider to 0, Italify infers no extra information. The shortcut for this is **Limit Curve**, marked with a teal marker.

```screenshot
img: ../images/limitCurve.png
alt: An unsmooth curve corner with the teal Limit-Curve square around the tagged node.
caption: Limit Curve pins a curve’s transformation to the node’s own tangent.
```

## No Curve Correction {#no-curve-correction}

**No Curve Correction** takes a whole curve segment out of curve correction. The segment is then only slanted – its drawn shape is preserved exactly.

The tag sits on **both** on-curve endpoints of the segment (any curve, cubic or quadratic, with at least one off-curve between them). Select those two nodes and press [[N]], or right-click and choose *Toggle No Curve Correction*; press [[N]] again to remove it. The segment draws with a yellow overlay along its length. It takes precedence over a [Curve Extension](#curve-extension) on its nodes, and an adjoining [Inktrap](#inktrap) still meets it – on the untouched curve’s own extension where it has to.

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

By default the filter automatically holds a node’s height in place in one common case: an **unsmooth line-to-curve** corner sitting exactly on a metric (baseline, x-height, …) is pinned to that metric through the correction, so it doesn’t drift off it. Every node this affects is marked with a violet pin. (This automatic behaviour is governed by the [advanced setting](filter#hidden-settings) *Keep line-to-curve corners on metrics*.)

**Y-Snap** lets you take that decision by hand, node by node. It is a simple *retain the y position* – the metric is only how the automatic case is detected, so the override works on **any** on-curve node, on a metric or not:

- Tag a node the automatic snap *misses* (a line-to-line or curve-to-curve corner, a smooth node, or a node at any height) and it will hold its y exactly.
- Tag a node the automatic snap *catches* and it is released – free to move with the correction.

Select the node (or several) and press [[Y]], or right-click and choose *Toggle Y-Snap*. The key flips each node’s current state: one that snaps is released, one that doesn’t is pinned. The marker is the same violet pin the automatic snap uses – a pinned node shows it, a released node shows nothing. To hand a node back to the automatic behaviour, clear its tag (right-click *Clear all Tags*, or [[⌫]]).

```screenshot
img: ../images/snapY.png
alt: A node tagged Y-Snap carrying the violet pin marker, holding its height through the correction.
caption: Y-Snap keeps a node at its original height, on a metric or not.
```

## Terminal {#terminal}

A **terminal** is a straight segment that caps a stroke – the flat cut of a *c*, *e* or *s*. The [Keep terminals](filter#parameters) sliders hold a terminal’s cut in place through the italicisation: *Angle* keeps the angle it makes with its two adjoining segments after the slant, *Position* decides whether it stays where a plain slant puts it or rides along those segments with the curve correction. The filter finds the obvious terminals automatically (a line between two curves heading the same way), and draws every one it will keep in **green**.

**Terminal** lets you take that decision by hand. Tag any straight two-node segment whose end connections are **unsmooth** – it can be a line between two stems, not just between two curves – and the filter keeps it too. Tagging a segment the tool already detects instead **opts it out**.

Select the two on-curve nodes at the ends of the segment and press [[C]] (think of *C*ap), or right-click and choose *Toggle Terminal*. There is no restriction on the two neighbours – a straight cut holds its cleanest when they are roughly parallel, but the choice is yours; the filter keeps whatever you tag. The segment draws in green. To hand a segment back to the automatic detection, clear its tag.

This works even when the terminal’s visible corners are **open corners** or when the outline carries a **duplicate node** at a corner: the tool looks past the short connector to the real curve or line on the other side, and the kept angle is measured at the visible intersection – which is also where the green highlight is drawn. The open corners themselves survive the correction: only the tagged line moves, and the overlap structure stays intact. Angle and position both apply to the visible cut – the part of the line between the two intersections.

### A terminal’s own angle and position {#terminal-settings}

The filter’s two *Keep terminals* sliders apply to every terminal alike. If you want to use custom settings for a terminal, you can adjust the values directly in the interface, with those values overriding the filter’s values.

- **Position** adjusts how far the terminal follows the original correction’s position, versus a purely slanted position (no vertical change).
- **Angle** adjusts, you guessed it, the terminal’s angle.

Drag a control, or click it to select it and step its value with [[↑]] and [[↓]] – 1 % at a time, 10 % with [[⇧]].

The controls sit on the corrected terminal, so they need a slant to work with. In an **upright master** with the filter’s angle locked to the layer there is none – but that master may well be the source another one is [generated from](filter#generate-from), and then its terminals are the ones to set. There, the same two controls appear as short horizontal sliders next to the selected terminal, and work the same way.

A terminal with its own settings shows a small **reset button**: a circled [[↺]]. Click it to remove the custom settings. With the terminal selected, [[⌫]] does the same, as does *Remove Custom Terminal Settings* in the right-click menu. Hold [[⌥]] to do it in all compatible masters. The values copy, paste and propagate with the other tags. Like the curve extension, they are interpolated when an instance between masters is [exported](filter#export); a master where the terminal has no settings of its own contributes the filter’s values for that master.

One related behaviour: an [anchor](anchor-links) linked to a node that sits on a terminal follows that node **fully, in both x and y** – a terminal is a moving cut, so an anchor on it rides along completely rather than tracking only its horizontal shift.

```screenshot
img: ../images/terminal.png
alt: A straight terminal segment drawn with the green terminal highlight, its cut angle held through the slant.
caption: Terminals (green) keep their cut angle to the adjoining segments.
```
