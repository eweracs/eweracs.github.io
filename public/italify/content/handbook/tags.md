# Tags {#node-flags}

@lede Six per-node marks outside the diagonal model. Each changes how the filter treats certain aspects.

Every Tag has a canvas marker and an entry in the right-click *Tags* section (or use the keyboard shortcuts). As always, hold [[⌥]] while toggling any of them to mirror the change across every compatible master.

## Fix Point {#fix-point}

Where a curve runs into a straight line, the correction moves the node where they meet. **Fix Point** holds such a node back: select it and press [[F]], or right-click and choose *Fix Point*. The node then stays where its straight neighbour puts it, and the rest of the curve is corrected around it. A fixed node is marked with a **teal square**; press [[F]] again (*Release Fixed Point*) to free it.

Fix Point works on a curve’s corner node – into a straight line or into another curve – and on a smooth node where a curve meets a straight line. It doesn’t apply to a smooth node between two curves.

To fix a node only partly, select it: a small teal knob, on a track beside the curve and parallel to its tangent, shows how much it is held back. Drag it, or click it and use [[↑]] and [[↓]] to change it by 1 % – by 10 % with [[⇧]]. In between, the correction blends the free and the fixed result. [[⌫]] removes the Fix Point.

Hold [[⌥]] when toggling or releasing to mirror the change onto every compatible master. Each master keeps its own amount, and when Italify runs [at export](filter#export) an instance between masters gets an amount in between. A master without a Fix Point counts as 0 %.

A **doubled node** behaves like a single one: click either of the two. To reuse a setting elsewhere, select the node, copy it with [[⌘C]], select the target node and paste – see [Copy & Paste](copy-paste.md).

```screenshot
img: ../images/fixPoint.png
caption: Fix Point holds a node back from the correction, by the set percentage.
```

## Curve Flow {#curve-flow}

To correct a curve properly, Italify needs to know where it is vertical or horizontal – its extremes. For a curve that doesn’t reach an extreme, Italify infers the missing rest of the curve. This can result in transformations not quite matching expectations.

In such a case, select the corner. Drag the round handle to adjust the corner’s tangent, which Italify relies on. Or drag the extreme’s line itself. Handle and line belong together. Click either and use the arrow keys for half a degree at a time – 5° with [[⇧]]. A corner with a setting is marked with a teal diamond. *Reset Curve Flow* [[⌫]] removes it.

```screenshot
img: ../images/curveFlow.png
caption: Curve Flow turns the tangent Italify derives the curve’s next extreme from – by its handle, or by the extreme’s line.
```

## No Curve Correction {#no-curve-correction}

**No Curve Correction** takes a whole curve segment out of curve correction. The segment is then only slanted – its drawn shape is preserved exactly.

The tag sits on **both** on-curve endpoints of the segment (any curve, cubic or quadratic, with at least one off-curve between them). Select those two nodes and press [[N]], or right-click and choose *Toggle No Curve Correction*; press [[N]] again to remove it. The segment draws with a yellow overlay along its length. It takes precedence over a [Fix Point](#fix-point) or a [Curve Flow](#curve-flow) setting on its nodes, and an adjoining [Inktrap](#inktrap) still meets it – on the untouched curve’s own extension where it has to.

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

## Terminal {#terminal}

A **terminal** is a straight segment that caps a stroke – the flat cut of a *c*, *e* or *s*. The [Keep terminals](filter#parameters) sliders hold a terminal’s cut in place through the italicisation: *Angle* keeps the angle it makes with its two adjoining segments after the slant, *Position* decides whether it stays where a plain slant puts it or rides along those segments with the curve correction. The filter finds the obvious terminals automatically (a line between two curves heading the same way), and draws every one it will keep in **green**. The [advanced settings](filter#hidden-settings) can switch that detection off, or limit it to terminals cut at an angle (leaving out horizontal and vertical cuts). The terminals you tag are kept either way.

**Terminal** lets you take that decision by hand. Tag any straight two-node segment whose end connections are **unsmooth** – it can be a line between two stems, not just between two curves – and the filter keeps it too. Tagging a segment the tool already detects instead **opts it out**.

Select the two on-curve nodes at the ends of the segment and press [[C]] (think of *C*ap), or right-click and choose *Toggle Terminal*. There is no restriction on the two neighbours – a straight cut holds its cleanest when they are roughly parallel, but the choice is yours; the filter keeps whatever you tag. The segment draws in green. To hand a segment back to the automatic detection, clear its tag.

This works even when the terminal’s visible corners are **open corners** or when the outline carries a **duplicate node** at a corner: the tool looks past the short connector to the real curve or line on the other side, and the kept angle is measured at the visible intersection – which is also where the green highlight is drawn. The open corners themselves survive the correction: only the tagged line moves, and the overlap structure stays intact. Angle and position both apply to the visible cut – the part of the line between the two intersections.

### A terminal’s own angle and position {#terminal-settings}

The filter’s two *Keep terminals* sliders apply to every terminal alike. If you want to use custom settings for a terminal, you can adjust the values directly in the interface, with those values overriding the filter’s values.

- **Position** adjusts how far the terminal follows the original correction’s position, versus a purely slanted position (no vertical change).
- **Angle** adjusts, you guessed it, the terminal’s angle.

Drag a control, or click it to select it and step its value with [[↑]] and [[↓]] – 1 % at a time, 10 % with [[⇧]].

The controls sit on the corrected terminal, so they need a slant to work with. In an **upright master** with the filter’s angle locked to the layer there is none – but that master may well be the source another one is [generated from](filter#generate-from), and then its terminals are the ones to set. There, the same two controls appear as short horizontal sliders next to the selected terminal, and work the same way.

A terminal with its own settings shows a small **reset button**: a circled [[↺]]. Click it to remove the custom settings. With the terminal selected, [[⌫]] does the same, as does *Remove Custom Terminal Settings* in the right-click menu. Hold [[⌥]] to do it in all compatible masters. The values copy, paste and propagate with the other tags. Like a Fix Point, they are interpolated when an instance between masters is [exported](filter#export); a master where the terminal has no settings of its own contributes the filter’s values for that master.

One related behaviour: an [anchor](anchor-links) linked to a node that sits on a terminal follows that node **fully, in both x and y** – a terminal is a moving cut, so an anchor on it rides along completely rather than tracking only its horizontal shift.

```screenshot
img: ../images/terminal.png
alt: A straight terminal segment drawn with the green terminal highlight, its cut angle held through the slant.
caption: Terminals (green) keep their cut angle to the adjoining segments.
```
