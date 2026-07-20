@overline [Italify Handbook](./)

# Stems {#stem-marks}

@lede Nodes the filter corrects together as one rigid unit. Defining them, the per-stem options, and repairing a stem a path operation broke.

```toc
1. [What a stem is](#stems)
2. [Creating and deleting stems](#creating-stems)
3. [Anchored edges](#anchor-edges)
4. [Hinge corners](#hinge-corners)
5. [Flipping the axis](#flip-axis)
6. [Extras](#extras)
7. [Rearranging corners](#corner-swap)
8. [Repairing corrupted stems](#corruption)
```

## What a stem is {#stems}

A stem is a group of nodes the filter moves as **one rigid unit**: four **corners** define its frame, and any number of optional **extras** – additional nodes, details – ride along with it. Each stem gets a single shared transformation, so its width and angle behave coherently instead of every segment fending for itself. Curves tagged as stems will not be curve-corrected.

On the canvas, a stem appears as a blue trapezoid with halos on its four corners and dots on its members. Click anywhere in the blue area to select a stem; [[Shift]]-click to select several. Click empty space to deselect. [[⌘A]] steps through a select-all cycle – nodes, stems, tags, anchors and their combinations.
```screenshot
img: ../images/stem.png
alt: Anatomy of a selected stem: corner halos, member dots, the blue fill, and the primary axis.
caption: Anatomy of a stem: four corners, optional extras, one axis.
```

## Creating and deleting stems {#creating-stems}

Select at least four on-curve nodes (plus anything that should ride along) and press [[S]], or right-click and choose *Add Stem*. The tool picks the four corners from your selection automatically; everything else becomes an extra. Hold [[⌥]] while adding to tag the same stem in every compatible master at once.
```screenshot wide
img: ../images/addStem.png
alt: An outline in the tagger with nodes selected, ready to be tagged as a stem.
caption: Select nodes belonging to a stem to tag them.
```

To delete, select one or more stems and press [[⌫]] (or right-click → *Delete Stem*; with [[⌥]], in all masters). *Clear all Stems* in the context menu wipes a layer completely.

*Auto-tag Stems* scans the layer for pairs of roughly parallel segments and tags everything that passes validation, including extras and anchored edges. Existing stems are never modified, so it’s safe to run on a partially tagged layer and fill in the rest.

## Anchored edges {#anchor-edges}

By default, a stem corrects around its own centre. Often you instead want one edge to stay in place: the left and right edges of a “V”, for example. Select the two corners of that edge (or just click on the connecting line segment) and press [[A]] (*Toggle Anchored Edge*): the edge formed by those two corners is pinned, and the rest of the stem corrects relative to it. The anchored edge draws in pink.
```screenshot wide
img: ../images/anchoredEdges.png
alt: A glyph with anchored edges set up has its stems corrected to keep the anchored edges in place.
caption: Anchored edges allow you to control stem movement.
```

When you create a stem that sits on the outline’s outer silhouette, the outer edge is anchored automatically. Tagging a different edge moves the anchoring; a stem has at most one.

## Hinge corners {#hinge-corners}

Sometimes the constraint isn’t an edge but two opposite *points* – for example, the outer junction corners of a “Z” diagonal which must not move while the stroke between them keeps its width. Select one or two corners and press [[H]] (*Toggle Hinge Corners*; with one corner selected, the diagonally opposed one is implied). Both hinge corners are pinned exactly where the slant puts them, and the stem’s **angle** absorbs the correction instead: it re-angles about the diagonal so its sides pass through the pinned corners at the corrected width.

To select a corner, click its halo – the node selects along with it, so the verb appears; [[Shift]]-click a second corner to pick the pair explicitly. You can also right-click a corner directly: it selects that corner and the menu offers *Toggle Hinge Corners* and *Delete Corner* even if nothing was selected first.

Hinges and the anchored edge are mutually exclusive – a stem has one pin, not two – so tagging one removes the other. On the canvas a hinged stem shows pink rings on the two corners joined by a dashed pink diagonal. [[⌫]] on a tagged pair untags it.

```screenshot
img: ../images/hingeCorners.png
alt: A hinged stem: pink pin rings on two opposed corners joined by a dashed pink diagonal.
caption: Pin two opposing corners in place for the stem to adjust to this constraint.
```

## Flipping the axis {#flip-axis}

A stem’s primary axis – the direction it’s corrected along – is normally the long direction of its frame. For stems that are physically wider than tall but should still behave like an upright stroke, select the stem and click the small **flip button** on its midline to invert the axis. The trapezoid redraws along the other direction so you can see immediately which way the stem will move.

## Extras {#extras}

Extras are members beyond the four corners. Press [[E]] to toggle: selected nodes that are already extras are removed from their stem, and selected untagged nodes are added to the currently selected stem. Both on-curve and off-curve nodes qualify. You can also right-click an extra directly – even with nothing selected – and choose *Remove Extra from Stem*.

```screenshot
img: ../images/extraNodes.png
alt: Two stems, one selected, one unselected, with the extra nodes visible.
caption: The extra nodes are marked with slightly smaller halos than corner nodes.
```

One behaviour worth knowing: tagging a curve’s *handles* (off-curves) as extras opts that whole curve segment out of curve correction – the segment then moves rigidly with the stem.

You rarely need to do that by hand, though: whenever **both** on-curve ends of a curve segment belong to a stem (as corners or extras), the handles between them are added as extras automatically, so an enclosed curve always rides along rigidly. While both ends stay members those handles are locked in – [[E]] won’t remove them. They free up again only if you take one of the ends out of the stem.

## Rearranging corners {#corner-swap}

If the tool picked the wrong node as a corner, drag the corner’s halo onto the node you actually want – on any stem, selected or not. The other stems fade while you drag so the one you’re editing stands out (it isn’t *selected*, just spotlighted for the drag). The old corner is demoted to an extra; the target becomes a corner. A travelling halo and guide line preview the drag, and invalid drop targets simply don’t snap. A node that already belongs to **another stem** is not a valid target – with one exception: an **extra of the dragged stem itself** can always be promoted to a corner, whatever else it belongs to.

## Repairing corrupted stems {#corruption}

Path operations – Remove Overlap, deleting nodes, reordering contours – can orphan stem tags. The tool marks such stems in **red**: a red polygon through the remaining corners, red halos, alert dots on members. Three ways to fix them:

- *Resolve corrupted Stems* (context menu) repairs everything on the layer at once: stems that can be re-derived are rebuilt, hopeless ones are stripped.
- Hover over a red polygon edge, grab the ghost dot and drag it onto a node to add it as a missing corner – the polygon reshapes live.
- Click a red corner halo and press [[⌫]] (or choose *Delete Corner*) to surgically remove one bad tag. *Delete Corner* works on any stem corner, not just corrupted ones – clicking a healthy stem’s corner halo and pressing [[⌫]] removes that corner too (which leaves the stem with three corners, so it then shows as corrupt).

```screenshot
img: ../images/corruptedStem.png
alt: A corrupted stem drawn in red, with a ghost dot mid-drag rebuilding a missing corner.
caption: Corruption is drawn in red; dragging from an edge rebuilds the missing corner.
```
