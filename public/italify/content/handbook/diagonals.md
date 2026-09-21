# Diagonals {#diagonal-marks}

@lede Diagonal strokes – nodes the filter corrects together as one rigid unit. Defining them, the per-diagonal options, and repairing a diagonal a path operation broke.

## What a diagonal is {#diagonals}

A diagonal is a diagonal stroke of the outline – the legs of a “V”, the arms of a “k” – tagged as a group of nodes the filter moves as **one rigid unit**: four **corners** define its frame, and any number of optional **extras** – additional nodes, details – ride along with it. Each diagonal gets a single shared transformation, so its width and angle behave coherently instead of every segment fending for itself. (Diagonals have nothing to do with the stems in *Font Info → Masters*. Earlier versions of Italify called them “stems”; a file tagged back then is brought up to date by itself when you open it – nothing to re-tag – and keeps the new names from your next save on.) Curves tagged as diagonals will not be curve-corrected.

On the canvas, a diagonal appears as a blue trapezoid with halos on its four corners and dots on its members. Click anywhere in the blue area to select a diagonal; [[Shift]]-click to select several. Click empty space to deselect. [[⌘A]] steps through a select-all cycle – nodes, diagonals, tags, anchors and their combinations.
```screenshot
img: ../images/diagonal.png
alt: Anatomy of a selected diagonal: corner halos, member dots, the blue fill, and the primary axis.
caption: Anatomy of a diagonal: four corners, optional extras, one axis.
```

## Creating and deleting diagonals {#creating-diagonals}

Select at least four on-curve nodes (plus anything that should ride along) and press [[D]], or right-click and choose *Add Diagonal*. The tool picks the four corners from your selection automatically; everything else becomes an extra. Hold [[⌥]] while adding to tag the same diagonal in every compatible master at once.
```screenshot wide
img: ../images/addDiagonal.png
alt: An outline in the tagger with nodes selected, ready to be tagged as a diagonal.
caption: Select nodes belonging to a diagonal to tag them.
```

To delete, select one or more diagonals and press [[⌫]] (or right-click → *Delete Diagonal*; with [[⌥]], in all masters). *Clear all Diagonals* in the context menu wipes a layer completely.

*Auto-tag Diagonals* scans the layer for pairs of roughly parallel segments and tags everything that passes validation, including extras and anchored edges. Existing diagonals are never modified, so it’s safe to run on a partially tagged layer and fill in the rest.

## Anchored edges {#anchor-edges}

By default, a diagonal corrects around its own centre. Often you instead want one edge to stay in place: the left and right edges of a “V”, for example. Select the two corners of that edge (or just click on the connecting line segment) and press [[A]] (*Toggle Anchored Edge*): the edge formed by those two corners is pinned, and the rest of the diagonal corrects relative to it. The anchored edge draws in pink.
```screenshot wide
img: ../images/anchoredEdges.png
alt: A glyph with anchored edges set up has its diagonals corrected to keep the anchored edges in place.
caption: Anchored edges allow you to control diagonal movement.
```

When you create a diagonal that sits on the outline’s outer silhouette, the outer edge is anchored automatically. Tagging a different edge moves the anchoring; a diagonal has at most one.

## Hinge corners {#hinge-corners}

Sometimes the constraint isn’t an edge but two opposite *points* – for example, the outer junction corners of the diagonal of a “Z”, which must not move while the stroke between them keeps its width. Select one or two corners and press [[H]] (*Toggle Hinge Corners*; with one corner selected, the opposite one is implied). Both hinge corners are pinned exactly where the slant puts them, and the diagonal’s **angle** absorbs the correction instead: it re-angles about the line between the two pinned corners so its sides pass through the pinned corners at the corrected width.

To select a corner, click its halo – the node selects along with it, so the verb appears; [[Shift]]-click a second corner to pick the pair explicitly. You can also right-click a corner directly: it selects that corner and the menu offers *Toggle Hinge Corners* and *Delete Corner* even if nothing was selected first.

Hinges and the anchored edge are mutually exclusive – a diagonal has one pin, not two – so tagging one removes the other. On the canvas a hinged diagonal shows pink rings on the two corners joined by a dashed pink line. [[⌫]] on a tagged pair untags it.

```screenshot
img: ../images/hingeCorners.png
alt: A hinged diagonal: pink pin rings on two opposite corners joined by a dashed pink line.
caption: Pin two opposing corners in place for the diagonal to adjust to this constraint.
```

## Flipping the axis {#flip-axis}

A diagonal’s primary axis – the direction it’s corrected along – is normally the long direction of its frame. For diagonals that are physically wider than tall but should still behave like an upright stroke, select the diagonal and click the small **flip button** on its midline to invert the axis. The trapezoid redraws along the other direction so you can see immediately which way the diagonal will move.

## Extras {#extras}

Extras are members beyond the four corners. Press [[E]] to toggle: selected nodes that are already extras are removed from their diagonal, and selected untagged nodes are added to the currently selected diagonal. Both on-curve and off-curve nodes qualify. You can also right-click an extra directly – even with nothing selected – and choose *Remove Extra from Diagonal*.

```screenshot
img: ../images/extraNodes.png
alt: Two diagonals, one selected, one unselected, with the extra nodes visible.
caption: The extra nodes are marked with slightly smaller halos than corner nodes.
```

One behaviour worth knowing: tagging a curve’s *handles* (off-curves) as extras opts that whole curve segment out of curve correction – the segment then moves rigidly with the diagonal.

You rarely need to do that by hand, though: whenever **both** on-curve ends of a curve segment belong to a diagonal (as corners or extras), the handles between them are added as extras automatically, so an enclosed curve always rides along rigidly. While both ends stay members those handles are locked in – [[E]] won’t remove them. They free up again only if you take one of the ends out of the diagonal.

## Rearranging corners {#corner-swap}

If the tool picked the wrong node as a corner, drag the corner’s halo onto the node you actually want – on any diagonal, selected or not. The other diagonals fade while you drag so the one you’re editing stands out (it isn’t *selected*, just spotlighted for the drag). The old corner is demoted to an extra; the target becomes a corner. A travelling halo and guide line preview the drag, and invalid drop targets simply don’t snap. A node that already belongs to **another diagonal** is not a valid target – with one exception: an **extra of the dragged diagonal itself** can always be promoted to a corner, whatever else it belongs to.

## Repairing corrupted diagonals {#corruption}

Path operations – Remove Overlap, deleting nodes, reordering contours – can orphan diagonal tags. The tool marks such diagonals in **red**: a red polygon through the remaining corners, red halos, alert dots on members. Three ways to fix them:

- *Resolve corrupted Diagonals* (context menu) repairs everything on the layer at once: diagonals that can be re-derived are rebuilt, hopeless ones are stripped.
- Hover over a red polygon edge, grab the ghost dot and drag it onto a node to add it as a missing corner – the polygon reshapes live.
- Click a red corner halo and press [[⌫]] (or choose *Delete Corner*) to surgically remove one bad tag. *Delete Corner* works on any diagonal corner, not just corrupted ones – clicking a healthy diagonal’s corner halo and pressing [[⌫]] removes that corner too (which leaves the diagonal with three corners, so it then shows as corrupt).

```screenshot
img: ../images/corruptedDiagonal.png
alt: A corrupted diagonal drawn in red, with a ghost dot mid-drag rebuilding a missing corner.
caption: Corruption is drawn in red; dragging from an edge rebuilds the missing corner.
```
