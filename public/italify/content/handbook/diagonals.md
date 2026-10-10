# Diagonals {#diagonal-marks}

@lede Diagonal strokes – nodes the filter corrects together.

## What a diagonal is {#diagonals}

A diagonal is a diagonal stroke of the outline, like the legs of a “V”, the arms of a “k”. Four **corners** define its frame, and any number of optional extra nodes.

On the canvas, a diagonal appears as a blue trapezoid with halos on its four corners and dots on its members. Click anywhere in the blue area to select a diagonal, [[Shift]]-click to select several. [[⌘A]] steps through a select-all cycle – nodes, diagonals, tags, anchors and their combinations.
```screenshot
img: ../images/diagonal.png
alt: Anatomy of a selected diagonal: corner halos, member dots, the blue fill, and the primary axis.
caption: Anatomy of a diagonal: four corners, optional extras, one axis.
```

## Creating and deleting diagonals {#creating-diagonals}

Select at least four on-curve nodes (plus anything that should ride along) and press [[D]], or right-click and choose *Add Diagonal*. The tool picks the four corners from your selection automatically. Hold [[⌥]] while adding to tag the same diagonal in every compatible master at once.
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

When you create a diagonal that sits on the outline’s outer silhouette, the outer edge is anchored automatically. Tagging a different edge moves the anchoring. A diagonal has at most one.

## Hinge corners {#hinge-corners}

Sometimes the constraint isn’t an edge but two opposite *points* – for example, the outer junction corners of the diagonal of a “Z”, which must not move while the stroke between them keeps its width. Select one or both diagonally opposite corners and press [[H]] to *Toggle Hinge Corners*. Both hinge corners are pinned exactly where the slant puts them, and the diagonal’s **angle** absorbs the correction instead.

Hinges and the anchored edge are mutually exclusive. [[⌫]] on a tagged corner untags it.

```screenshot
img: ../images/hingeCorners.png
alt: A hinged diagonal: pink pin rings on two opposite corners joined by a dashed pink line.
caption: Pin two opposing corners in place for the diagonal to adjust to this constraint.
```

## Flipping the axis {#flip-axis}

A diagonal’s primary axis – the direction it’s corrected along – is normally the long direction of its frame. If a diagonal should transform in the other direction, click the **flip button** on its midline to invert the axis.

## Extras {#extras}

Extras are members beyond the four corners. Select a diagonal and some other nodes you want to add to it. Then press [[E]] to add them. To remove existing extra nodes, select them and press [[E]] again. You can also right-click an extra node directly and choose *Remove Extra from Diagonal*.

```screenshot
img: ../images/extraNodes.png
alt: Two diagonals, one selected, one unselected, with the extra nodes visible.
caption: The extra nodes are marked with slightly smaller halos than corner nodes.
```

**Note:** Adding offcurve nodes to a diagonal (as extras) opts them out of curve correction. Offcurve nodes belonging to a curve segment whose ends are extras are automatically included as extra nodes.

## Rearranging corners {#corner-swap}

If the tool picked the wrong node as a corner, drag the corner’s halo onto the node you actually want to use as the corner. The old corner is demoted to an extra.

## Repairing corrupted diagonals {#corruption}

Path operations – Remove Overlap, deleting nodes, reordering contours – can orphan diagonal tags. The tool marks such diagonals in **red**: a red polygon through the remaining corners, red halos, alert dots on members. Three ways to fix them:

- *Resolve corrupted Diagonals* (context menu) repairs everything on the layer at once: diagonals that can be re-derived are rebuilt, hopeless ones are stripped.
- Hover over a red polygon edge, grab the ghost dot and drag it onto a node to add it as a missing corner.
- Click a red corner halo and press [[⌫]] (or choose *Delete Corner*) to remove a corner. *Delete Corner* works on any diagonal corner, not just corrupted ones. Pressing [[⌫]] on a normal diagonal removes that corner too (which leaves the diagonal with three corners, then showing as corrupt).

```screenshot
img: ../images/corruptedDiagonal.png
alt: A corrupted diagonal drawn in red, with a ghost dot mid-drag rebuilding a missing corner.
caption: Corruption is drawn in red; dragging from an edge rebuilds the missing corner.
```
