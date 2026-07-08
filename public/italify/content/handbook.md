# Italify Handbook

@lede Everything the plugin does, in one place. New to Italify? Start with the [overview](overview).

```toc
1. [Installation](#installation)
2. [The filter](#filter)
    - [Parameters](#parameters)
    - [Saving parameters](#saving-parameters)
    - [Export](#export)
    - [Hidden settings](#hidden-settings)
3. [Glyph groups](#groups)
4. [The tagger](#tagger)
5. [Stems](#stem-marks)
    - [What a stem is](#stems)
    - [Creating stems](#creating-stems)
    - [Anchored edges](#anchor-edges)
    - [Hinge corners](#hinge-corners)
    - [Flip axis](#flip-axis)
    - [Extras](#extras)
    - [Rearranging corners](#corner-swap)
    - [Repairing corrupted stems](#corruption)
6. [Tags](#node-flags)
    - [Limit Curve](#limit-curve)
    - [No Curve Correction](#no-curve-correction)
    - [Inktrap](#inktrap)
    - [Y-Snap](#snap-y)
7. [Anchor links](#anchor-links)
8. [Copy, paste & propagate](#copy-paste)
9. [Working across masters](#masters)
10. [Navigation & live preview](#preview)
11. [The Glyph → Italify menu](#glyph-menu)
12. [Tips](#tips)
13. [Keyboard reference](#shortcuts)
```

## Installation {#installation}

1. Double-click `Italify.glyphsPlugin`; Glyphs installs it and asks to restart.
2. After relaunching you have all of Italify: the *Italify* entry in the *Filter* menu, the *Italify Tagger* in the Edit View toolbar (shortcut [[C]]), and the *Italify Groups* palette in the Window sidebar.

Italify requires **Glyphs 3.2 or later**.

```screenshot
img: images/bundle.png
tag: Screenshot – installed plugin
desc: Two-part composite: (1) the Filter, (2) the Edit View toolbar with the Italify Tagger icon
  visible and selected.
caption: After installing: the filter, with the tagger in the toolbar.
```

## The filter {#filter}

Choose *Filter → Italify* with one or more glyphs open in Edit View. You can adjust the parameters with the live preview showing the result you get when pressing *Apply*.
```annotated
img: images/window.png
alt: The Italify filter dialogue with the angle field and four correction sliders.
note 15.5%: **Angle** – the slant to apply. [[↺]] reads the current master’s italic angle.
note 26%: **Saved parameters** – Use the same parameters for the whole font, single masters, glyphs, layers or groups.
note 42%: **Curve correction** – rebalances curves against the shear’s distortion.
note 52%: **Keep terminals** – preserves the cut of stroke endings.
note 69%: **Diagonal correction** – corrects tagged diagonal stems’ width and angle.
note 82%: **Stem compensation** – how much of a stem’s width change is restored.
note 96%: The gear menu holds *Copy Filter Parameter* for [export](#export).
```

### Parameters {#parameters}

#### Angle | degrees | default 0°

The italic angle to apply. The [[↺]] button next to the field reads the angle from the current master’s *Italic Angle* setting, so the filter and your font metadata stay in agreement. The shear pivots around half the x-height – the standard Glyphs convention – so glyphs stay visually centred on the line.

#### Curve correction | 0–100% | default 100%

How strongly curved segments are corrected against the distortion the shear introduces. At 0%, curves are simply slanted, with all the familiar weight gain and loss around the bowl. At 100%, each curve is rebalanced so its weight distribution matches the upright. Values in between blend the two – useful when you want a hint of the mechanical flavour to survive.

#### Diagonal correction | 0–100% | default 100%

The equivalent control for straight diagonal segments. Out of the box this applies **only to tagged stems** – untagged diagonals are simply slanted – so the correction never second-guesses geometry you haven’t described. (A [hidden setting](#hidden-settings) extends it to all diagonals.)

#### Stem compensation | 0–100% | default 100%

Controls how much of the width change that slanting causes in stems is compensated. At 100%, a tagged stem comes out of the filter measuring what it did upright; at 0%, it keeps whatever width the shear left it with.

#### Keep terminals | 0–100% | default 0%

Governs the straight terminals at stroke ends – the cut of an *e*, *c* or *s*, for example. At 0%, a terminal is simply slanted. At 100%, it is rotated back against the rotation the correction gave the adjoining curves, preserving the original cut relative to the stroke. Terminals are detected automatically from the outline as line segments connecting two curves going in the same direction. This means it will not detect terminals designed using open corners.

### Saving parameters {#saving-parameters}

Out of the box, the four correction sliders edit one app-wide set of defaults: change them once and every glyph you run the filter on uses those values. Often you want finer control – a tighter curve correction on just the rounds, or a different stem compensation in the Bold master. Italify lets you **save a set of parameters scoped to a single layer, glyph, [group](#groups), master, or the whole font**, and resolves the right one automatically.

```screenshot wide
img: images/savingParameters.png
tag: Screenshot – saving parameters
desc: The Italify filter dialogue’s lower band, annotated: a status line reading
  “Using Glyph parameters”, a “Save for:” pop-up (showing the Font / Master /
  Group / Glyph / Layer choices), the Save button beside it, and the ⋯ actions menu
  open to show the Clear and Reset items. Label each control.
caption: Saving a scoped set of parameters from the filter dialogue.
```

Set the sliders the way you want them, pick a scope from **Save for:** – *Font*, *Master*, *Glyph*, or *Layer*, plus *Group (font)* and *Group (master)* when the active glyph belongs to a [group](#groups) – and press **Save**. The status line above the picker always tells you which scope is currently in effect (“Using *Glyph* parameters”, say) and warns when you have edited the sliders without saving.

When the filter runs, it resolves each of the four parameters independently through a **cascade**, from most specific to least:

```
layer → glyph → group → master → font → app-wide defaults
```

The first scope that has a saved value for a given parameter wins, so a value saved on the layer overrides one on its glyph, which overrides the master, and so on. Parameters with no saved override anywhere fall back to the global defaults. The [group](#groups) rung sits between glyph and master – see below.

The **⋯ actions menu** beside the picker handles removal: *Clear parameters for ▸ Layer / Glyph / Group (font) / Group (master) / Master / Font* drops a scope’s saved values (master and font ask for confirmation), and *Reset parameters* discards unsaved slider edits. A scope you have not saved anything to reads “No parameters saved”.

Selecting several glyphs that resolve to **different** values shows “Multiple parameters set.” instead of guessing – each keeps its own parameters, and saving is disabled until the selection agrees. Saved scopes are honoured both in the live preview and at [export](#export), where a saved value beats the instance’s `Filter` parameter for that glyph.

### Using Italify at export {#export}

You can keep your sources upright and let Italify run when instances are generated. This can be useful while the upright masters are still in development and a quick italic is needed for previewing.

Add a `Filter` custom parameter to an instance (Font Info → Exports) with a value like:

```
Italify;angle:9.5;curveCorrection:0.8;diagonalCorrection:0.9;stemCompensation:1;keepTerminals:0;diagonalStemsOnly:1
```

You don’t need to type this: open the filter dialogue, set the parameters the way you want them, and choose *Copy Filter Parameter* from the dialogue’s gear menu – filter parameter lands on your clipboard ready to paste into the instance. All arguments are optional and named, so partial parameters like `Italify;angle:10` work and fall back to the defaults above.

At export the angle is also written into each generated instance’s metadata: Glyphs derives `post.italicAngle`, the `hhea` caret slope and related fields from it, so the exported italics carry the correct angle without you ever editing the upright source’s *Font Info*.

```screenshot
img: images/exportFilter.png
tag: Screenshot – custom parameter
desc: Font Info → Exports with an instance selected and the Custom Parameters
  list showing a “Filter” row containing the Italify parameter string from
  the example above. Highlight or zoom the row enough that the string is
  legible.
caption: Italify as an export-time filter on an instance.
```

### Hidden settings {#hidden-settings}

Three behaviours have no dialogue control and are toggled via the Macro panel. All default to the behaviour most users want. The are prefixed with `com.eweracs.italify.`.

| Setting | Default | Effect |
|---|---|---|
| `diagonalCorrectionStemsOnly` | `True` | Diagonal correction and stem compensation apply only to tagged stems. Set to `False` to correct every diagonal segment, tagged or not. For untagged stems, the transformation origin will be (half layer width, half x-height). Experimental use only, results will be unexpected.|
| `flattenIntersections` | `True` | When the correction pushes an outline past an adjacent short line (typical at tight junctions), Italify collapses the junction into a clean, master-compatible doubled node – the way you would draw it by hand. Set to `False` to keep the uncollapsed geometry. |
| `autoSnapToMetrics` | `True` | An **unsmooth line-to-curve** node — where a straight segment meets a curve — whose height sits exactly on a metric (baseline, x-height, …) is held to that metric through the correction, so such corners don’t drift off it. Smooth nodes, line-to-line corners and curve-to-curve corners are left free. The tagger marks every node this affects with a violet pin. Set to `False` to disable the snap entirely. |

For example, in the Macro panel:

```
Glyphs.defaults["com.eweracs.italify.flattenIntersections"] = False
```

## Glyph groups {#groups}

A **group** is a named set of glyphs that share Italify parameters – the natural way to tune “all the rounds” or “all the diagonals” together. A group is coarser than a single glyph but finer than a master: it sits in the [parameter cascade](#saving-parameters) between the two (layer → glyph → **group** → master → font), so a value saved on a glyph or layer still wins, and the group is a fallback for every member that has no closer override. A glyph belongs to **at most one** group.

Membership is managed from the **Italify Groups** palette (Window sidebar). Select one or more glyphs and use the **Group** pop-up to assign them – to an existing group, to *None*, or to *New Group…* to create one. The list below shows every group defined in the font.

**Click a group** in the list to open its popover. It shows the group’s saved parameters as a matrix – one row for the whole font plus a row per master, one column each for Curve, Terminal, Diagonal, and Stem – with values inherited from the all-masters row greyed and unset cells shown as “–”. Below the matrix an **editable glyph list** holds the group’s members: edit it and the names are validated against the font on close (valid names join the group, removed ones leave it). The buttons at the bottom **Open in new Tab**, **Rename**, or **Delete** the group; the same three sit on each row’s right-click menu, where *Show all glyphs in group* also carries a badge with the member count.

```screenshot tall
img: images/groupsPalette.png
tag: Screenshot – group popover
desc: The popover that opens from a group row: a parameter matrix (rows Font +
  each master, columns Curve / Terminal / Diagonal / Stem, some cells greyed as
  inherited), an editable list of the group’s glyph names below it, and Open in
  new Tab / Rename / Delete buttons along the bottom.
caption: A group’s popover: its parameter matrix, its members, and group actions.
```

You **edit a group’s parameters from the filter dialogue**, not the palette. With a glyph that belongs to a group active, the **Save for:** picker gains two extra entries, each labelled with the group’s own name so you can see exactly which group you are saving for (e.g. *round (font)* / *round (master)* for a group named “round”):

- **\<name\> (font)** – saves the value for *every* master of the group at once (e.g. curve correction = 0 across the whole font).
- **\<name\> (master)** – saves it for the current master only, overriding the all-masters value there.

Both are disabled unless the active glyph is in a group (where they fall back to the generic *Group (font)* / *Group (master)* labels). The ⋯ actions menu likewise gains matching *Clear ▸ \<name\> (font) / \<name\> (master)* entries, and the all-masters clear warning names the group.

## The tagger {#tagger}

The *Italify Tagger* (toolbar icon, shortcut [[C]]) is where you can describe glyph features to the filter – diagonals to correct, how anchors should move, specific corrections. It is a metadata editor: it never moves points itself. Everything you tag is stored on the nodes in the file and drawn on the canvas, so what you see with the tool active is exactly what the filter will read.

It works with two kinds of marks: **[Stems](#stem-marks)** – groups of nodes corrected together as one rigid unit, with their own set of options – and **[Tags](#node-flags)** – per-node marks that change how the filter treats a single spot. It also lets you link Glyphs *anchors* to nodes. Each is covered below.

## Stems {#stem-marks}

Stems are the tagger's core: nodes the filter corrects together as one rigid unit. This section covers defining them, the per-stem options (anchored edges, hinges, extras, …), and repairing a stem a path operation broke.

### What a stem is {#stems}

A stem is a group of nodes the filter moves as **one rigid unit**: four **corners** define its frame, and any number of optional **extras** – additional nodes, details – ride along with it. Each stem gets a single shared transformation, so its width and angle behave coherently instead of every segment fending for itself. Curves tagged as stems will not be curve-corrected.

On the canvas, a stem appears as a blue trapezoid with halos on its four corners and dots on its members. Click anywhere in the blue area to select a stem; [[Shift]]-click to select several. Click empty space to deselect. [[⌘A]] steps through a select-all cycle – nodes, stems, tags, anchors and their combinations.
```screenshot
img: images/stem.png
tag: Screenshot – stem anatomy
desc: One selected stem on a serif lowercase “l” or “n” stem, close-cropped
  and annotated: corner halos labelled “corner (×4)”, member dots labelled
  “extras”, the blue fill labelled “click to select”, the axis line through
  the middle labelled “primary axis”. Use thin black annotation lines per
  the site’s style.
caption: Anatomy of a stem: four corners, optional extras, one axis.
```

### Creating and deleting stems {#creating-stems}

Select at least four on-curve nodes (plus anything that should ride along) and press [[S]], or right-click and choose *Add Stem*. The tool picks the four corners from your selection automatically; everything else becomes an extra. Hold [[⌥]] while adding to tag the same stem in every compatible master at once.
```screenshot wide
img: images/addStem.png
tag: Screenshot – add stem
desc: An outline in Stem Tagger mode with nodes selected, ready to be tagged.
caption: Select nodes belonging to a stem to tag them.
```

To delete, select one or more stems and press [[⌫]] (or right-click → *Delete Stem*; with [[⌥]], in all masters). *Clear all Stems* in the context menu wipes a layer completely.

*Auto-tag Stems* scans the layer for pairs of roughly parallel segments and tags everything that passes validation, including extras and anchored edges. Existing stems are never modified, so it’s safe to run on a partially tagged layer and fill in the rest.

### Anchored edges {#anchor-edges}

By default, a stem corrects around its own centre. Often you instead want one edge to stay in place: the left and right edges of a “V”, for example. Select the two corners of that edge (or just click on the connecting line segment) and press [[A]] (*Toggle Anchored Edge*): the edge formed by those two corners is pinned, and the rest of the stem corrects relative to it. The anchored edge draws in pink.
```screenshot wide
img: images/anchoredEdges.png
tag: Screenshot – anchored edge
desc: A glyph with anchored edges set up has its stems corrected to keep the anchored edges in place.
caption: Anchored edges allow you to control stem movement.
```

When you create a stem that sits on the outline’s outer silhouette, the outer edge is anchored automatically. Tagging a different edge moves the anchoring; a stem has at most one.

### Hinge corners {#hinge-corners}

Sometimes the constraint isn’t an edge but two opposite *points* – for example, the outer junction corners of a “Z” diagonal which must not move while the stroke between them keeps its width. Select one or two corners and press [[H]] (*Toggle Hinge Corners*; with one corner selected, the diagonally opposed one is implied). Both hinge corners are pinned exactly where the slant puts them, and the stem’s **angle** absorbs the correction instead: it re-angles about the diagonal so its sides pass through the pinned corners at the corrected width.

To select a corner, click its halo – the node selects along with it, so the verb appears; [[Shift]]-click a second corner to pick the pair explicitly. You can also right-click a corner directly: it selects that corner and the menu offers *Toggle Hinge Corners* and *Delete Corner* even if nothing was selected first.

Hinges and the anchored edge are mutually exclusive – a stem has one pin, not two – so tagging one removes the other. On the canvas a hinged stem shows pink rings on the two corners joined by a dashed pink diagonal. [[⌫]] on a tagged pair untags it.

```screenshot
img: images/hingeCorners.png
tag: Screenshot – anchored edge vs. hinge
desc: Two close crops side by side: (1) a stem with its pink anchored-edge
  stroke along one long side, (2) a zdiagonal stem with pink pin rings
  on the two opposed corners and the dashed pink diagonal between them.
  Caption labels “Anchored edge – pins a line” and “Hinge corners – pins two
  points”.
caption: Pin two opposing corners in place for the stem to adjust to this constraint.
```

### Flipping the axis {#flip-axis}

A stem’s primary axis – the direction it’s corrected along – is normally the long direction of its frame. For stems that are physically wider than tall but should still behave like an upright stroke, select the stem and click the small **flip button** on its midline to invert the axis. The trapezoid redraws along the other direction so you can see immediately which way the stem will move.

### Extras {#extras}

Extras are members beyond the four corners. Press [[E]] to toggle: selected nodes that are already extras are removed from their stem, and selected untagged nodes are added to the currently selected stem. Both on-curve and off-curve nodes qualify. You can also right-click an extra directly – even with nothing selected – and choose *Remove Extra from Stem*.

```screenshot
img: images/extraNodes.png
tag: Screenshot – extra nodes in a stem.
desc: Two stems, one selected, one unselected, with the extra nodes visible.
caption: The extra nodes are marked with slightly smaller halos than corner nodes.
```

One behaviour worth knowing: tagging a curve’s *handles* (off-curves) as extras opts that whole curve segment out of curve correction – the segment then moves rigidly with the stem.

You rarely need to do that by hand, though: whenever **both** on-curve ends of a curve segment belong to a stem (as corners or extras), the handles between them are added as extras automatically, so an enclosed curve always rides along rigidly. While both ends stay members those handles are locked in – [[E]] won’t remove them. They free up again only if you take one of the ends out of the stem.

### Rearranging corners {#corner-swap}

If the tool picked the wrong node as a corner, drag the corner’s halo onto the node you actually want – on any stem, selected or not. The other stems fade while you drag so the one you’re editing stands out (it isn’t *selected*, just spotlighted for the drag). The old corner is demoted to an extra; the target becomes a corner. A travelling halo and guide line preview the drag, and invalid drop targets simply don’t snap.

### Repairing corrupted stems {#corruption}

Path operations – Remove Overlap, deleting nodes, reordering contours – can orphan stem tags. The tool marks such stems in **red**: a red polygon through the remaining corners, red halos, alert dots on members. Three ways to fix them:

- *Resolve corrupted Stems* (context menu) repairs everything on the layer at once: stems that can be re-derived are rebuilt, hopeless ones are stripped.
- Hover over a red polygon edge, grab the ghost dot and drag it onto a node to add it as a missing corner – the polygon reshapes live.
- Click a red corner halo and press [[⌫]] (or choose *Delete Corner*) to surgically remove one bad tag. *Delete Corner* works on any stem corner, not just corrupted ones – clicking a healthy stem’s corner halo and pressing [[⌫]] removes that corner too (which leaves the stem with three corners, so it then shows as corrupt).

```screenshot
img: images/corruptedStem.png
tag: Screenshot – corrupted stem
desc: A stem in its red corruption state after a destructive path operation:
  red polygon through three remaining corners, red halos, alert dots – with
  the cursor mid-drag on the ghost dot pulling a new corner toward a node,
  the polygon reshaping live. This one shot covers both the diagnosis and
  the repair gesture.
caption: Corruption is drawn in red; dragging from an edge rebuilds the missing corner.
```

## Tags {#node-flags}

Four **Tags** live outside the stem model – each marks an individual node or segment and changes how the filter treats that one spot. Every Tag has a canvas marker, a keyboard shortcut, and an entry in the right-click *Tags* section, and each is removed the same way it was added. Hold [[⌥]] on any of them to mirror the change across every compatible master.

### Limit Curve {#limit-curve}

At an unsmooth curve boundary, the filter normally infers some extra context, which can lead to certain segments being transformed more strongly than desired. **Limit Curve** switches that off for one node – the tagged node becomes its own reference context. The node and its attached only slide **along the node’s own tangent**, so the curve can’t billow out beyond the corner. Use it wherever the inferred context drags a curve too far.

Select the on-curve node (or several) at a curve→line or curve→curve corner and press [[L]], or right-click and choose *Toggle Limit Curve*. The marker is a teal square around the node.

```screenshot
img: images/limitCurve.png
tag: Screenshot – Limit Curve
desc: A close crop of an unsmooth curve→line (or curve→curve) corner with the
  teal Limit-Curve square around the tagged on-curve node.
caption: Limit Curve pins a curve’s transformation direction to its own tangent.
```

### No Curve Correction {#no-curve-correction}

**No Curve Correction** takes a whole curve segment out of curve correction. The segment is then only slanted – its drawn shape is preserved exactly.

The tag sits on **both** on-curve endpoints of the segment (any curve, cubic or quadratic, with at least one off-curve between them). Select those two nodes and press [[N]], or right-click and choose *Toggle No Curve Correction*; press [[N]] again to remove it. The segment draws with a yellow overlay along its length.

```screenshot
img: images/noCurveCorrection.png
tag: Screenshot – No Curve Correction
desc: A curve segment carrying the yellow No-Curve-Correction overlay 
caption: No Curve Correction preserves a curve’s shape, only slanting it.
```

### Inktrap {#inktrap}

Mark a two-nodes line segment as **Inktrap** to keep it at its original length. After Italify corrects the two adjoining segments, an ink trap is held rigid and shifted so it still spans exactly its original distance. The neighbours can be lines or curves; the segment’s two endpoints simply land back on the corrected neighbours.

Select the two on-curve nodes at the ends of a straight segment – they must be directly connected and both **unsmooth** – and press [[I]], or right-click and choose *Add Inktrap*.

On the canvas the tagged segment glows purple, a short stretch of each adjoining contour is highlighted. Click anywhere in the ink trap to select it and press [[⌫]] to remove the tag.

```screenshot
img: images/inktrap.png
tag: Screenshot – Inktrap
desc: A short straight segment tagged as an inktrap.
caption: An Inktrap segment preserves its size even after correction of the adjoining segments.
```

### Y-Snap {#snap-y}

By default the filter automatically holds a node's height in place in one common case: an **unsmooth line-to-curve** corner sitting exactly on a metric (baseline, x-height, …) is pinned to that metric through the correction, so it doesn't drift off it. Every node this affects is marked with a violet pin. (This automatic behaviour is governed by the [`autoSnapToMetrics`](#hidden-settings) hidden setting.)

**Y-Snap** lets you take that decision by hand, node by node. It is a simple *retain the y position* – the metric is only how the automatic case is detected, so the override works on **any** on-curve node, on a metric or not:

- Tag a node the automatic snap *misses* (a line-to-line or curve-to-curve corner, a smooth node, or a node at any height) and it will hold its y exactly.
- Tag a node the automatic snap *catches* and it is released – free to move with the correction.

Select the node (or several) and press [[Y]], or right-click and choose *Toggle Y-Snap*. The key flips each node's current state: one that snaps is released, one that doesn't is pinned. The marker is the same violet pin the automatic snap uses – a pinned node shows it, a released node shows nothing. To hand a node back to the automatic behaviour, clear its tag (right-click *Clear all Tags*, or [[⌫]]).

```screenshot
img: images/snapY.png
tag: Screenshot – Y-Snap
desc: A node tagged Y-Snap, off any metric, carrying the violet horizontal pin
  marker, with the corrected outline holding that node's height in place.
caption: Y-Snap keeps a node at its original height, on a metric or not.
```

## Anchor links {#anchor-links}

An **anchor link** ties a Glyphs *anchor* to one or more outline nodes so it rides along when the filter corrects them. Useful for keeping anchors in sync with the curve shape they are designed to sit on.
Click an anchor to select it – the rest of the stem and tag overlays fade to grey so the links stand out; [[Shift]]-click to select several. With an anchor selected, **drag**: the anchor itself never moves; a halo follows the cursor and snaps onto the nearest **on-curve** node, and releasing links the anchor to it. An anchor links to **any number of nodes** – attaching is additive. Grab an existing link’s halo to drag it onto another node (**move** the link) or clear of any node (**remove** it). Press [[⌫]] with the anchor selected to clear all of its links at once. Hold [[⌥]] on any of these to mirror the change across compatible masters (anchor matched by name, node by index).

Anchors and stem selection are mutually exclusive: while a stem is selected the anchors grey out and stop responding to clicks, so a click lands on the stem’s own controls instead – handy when an anchor sits right over the flip-axis button. Click empty space to deselect the stem and the anchors are live again. (The [[⌘A]] cycle’s anchor phases are the exception, showing stems and anchors selected together.)

A linked anchor renders **purple** instead of blue, and each link draws as a light-blue dotted line to its node. At correction time the anchor is shifted horizontally by the **average of its linked nodes' weighted movements**: a node sitting on only straight segments carries the anchor **100 %** of the way it moves, while a node with a curve on either side carries it **50 %**. So an anchor linked to a single line-to-line node tracks that node exactly, one linked to a curve node moves half as far, and one linked to both moves by the average of the two. At 0 % correction nothing moves, so the anchor lands exactly where a plain slant would put it. Its vertical position is left untouched.

Copy / Paste / Propagate / Clear for anchor links live in the right-click *Anchors* section (see [below](#copy-paste)) and the [Glyph → Italify menu](#glyph-menu).

```screenshot wide
img: images/anchorLinks.png
tag: Screenshot – anchor links
desc: A tagger view with one anchor selected (drawn as a solid purple
  diamond with its name in a blue badge) linked to two on-curve nodes on a
  stem. Light-blue dotted lines run from the anchor to halos on each linked
  node; the rest of the stem / tag overlays are faded grey so the links
  stand out. Ideally catch the link halo mid-drag snapping onto a node.
caption: An anchor linked to stem nodes – it rides them through correction.
```

## Copy, paste & propagate {#copy-paste}

Stems, tags and anchor links all travel between layers without re-tagging. There are two ways to copy, and both write to the clipboard so you can paste onto another layer:

- **[[⌘C]] – Copy Selection.** Whenever you have something selected – stems, tagged nodes, anchors, or any mix – [[⌘C]] copies *exactly that*. (The right-click menu shows it under a **Selection** heading; hold [[⌥]] there for *Propagate Selection to all Masters*, which writes just the selected items straight to every compatible master.) [[⌘V]] pastes whatever the clipboard holds; pasting is **additive** – it adds the copied items without wiping the target’s existing ones – so a copied selection drops cleanly onto another layer.
- **Copy all (right-click).** Each section also has a *Copy all Stems* / *Copy all Tags* / *Copy all Anchor Links* verb that copies the whole layer’s items of that kind regardless of selection (greyed when there are none). These have no [[⌘C]] – that’s Copy Selection. *Paste* puts them on the target additively.
- **Propagate ([[⌥]]).** Holding [[⌥]] on any *Copy all* turns it into *Propagate … to all Masters* – it writes that kind to every compatible master directly (no clipboard), mirroring the layer exactly.

When pasting a single copied stem, a **node selection** matching its structure (same node groups, on-/off-curve pattern; order and direction don’t matter) pastes it onto those nodes as a new stem – corner roles, the anchored edge, extras and the flip state land on the corresponding sides (the menu retitles to *Paste Stem onto Selection*).

## Working across masters {#masters}

Almost every action takes [[⌥]] as the “in all masters” modifier: add, delete, anchor, hinge, extras, the Tags, paste. “All masters” means every layer with a compatible outline – including brace (intermediate) and bracket (alternate) layers; incompatible layers are skipped and reported. [[⌥]]-clicking a stem also mirrors its node selection across masters, which is handy for checking that a stem sits on the same nodes everywhere.

## Navigation & live preview {#preview}

Hold [[Space]] to pan, as everywhere in Glyphs – while held, the tool shows the clean filled outline with all chrome hidden. Add [[Shift]] and the filled preview becomes a **live Italify preview:** the glyph rendered with the current filter parameters (your outline is untouched), with a small floating panel listing the parameters in effect. Change a value in the filter dialogue, hold [[Space]]+[[Shift]] again, and the preview reflects it – a fast way to judge the correction without applying anything. Useful for previewing different tagging results directly.

```screenshot
img: images/preview.png
tag: Screenshot – live preview HUD
desc: The tagger’s Space+Shift preview: the filled, italified outline of a
  glyph with the floating parameter HUD below the baseline listing angle,
  curve correction, keep terminals, diagonal correction, and stem
  compensation. All node/stem chrome hidden (that is what the mode does),
  so the shot reads as “finished letter plus a small parameter readout”.
caption: Hold Space + Shift in the tagger for a live preview of the current parameters.
```

## The Glyph → Italify menu {#glyph-menu}

The tagger only ever sees the single active layer. For batch work there is a second surface: an **Italify** submenu under the **Glyph** menu that runs the bulk verbs across *every selected glyph and layer at once*. Select the glyphs you want to treat (in Font View or Edit View), then:

- **Auto-Tag Stems** – runs the auto-tagger on every selected layer (additive; existing stems are left untouched).
- **Propagate to all Masters → Stems / Tags / Anchor Links / All** – mirrors the chosen metadata from each selected layer onto its glyph’s other compatible masters. *All* sends every kind at once.
- **Clear all → Stems / Tags / Anchor Links / All** – wipes the chosen userData on every selected layer (*All* wipes every kind at once). Hold [[⌥]] for the “… in all Masters” variant.

This is the only way to tag or propagate across many glyphs in one go – the tagger’s equivalent commands always act on the layer in front of you.

```screenshot
img: images/glyphMenu.png
tag: Screenshot – Glyph → Italify menu
desc: The macOS menu bar with the Glyph menu open and the Italify submenu
  expanded, showing Auto-Tag Stems and the Propagate to all Masters and
  Clear all submenus with their Stems / Tags / Anchor Links / All entries. A
  multiple-glyph selection is visible behind it in Font View.
caption: The Glyph → Italify menu runs the bulk verbs across every selected glyph.
```

## Tips {#tips}
#### Draw good paths.

- Keep nodes on extremes whenever possible.
- Balance your handles, especially in shallow curves. Eliminate overshooting (large) handles. They introduce inflections that are often not intended. Use the script *mekkablue → Paths →  Path Problem Finder → Overshooting handles* to find them, and the plugin *Show Angled Handles* to highlight them. The scripts *mekkablue → Paths → Tunnify/Tunnify2.0* are a great way to balance your handles automatically.
- Nodes that should move on a straight line should be connected to that straight line. Example: don’t make a smooth /n out of a stem and a disconnected shoulder path, but connect the paths.
- You can leave out points at inflections. An /s will give usually give better results if you leave out the inflection points in the spine, for example.

#### Tag stems before judging parameters.

Diagonal correction and stem compensation act on tagged stems (by default, *only* on them). A glyph that looks under-corrected often just has untagged stems – run *Auto-tag Stems* first, then re-evaluate.

#### Make sure your components aren’t flipped.
Component transformation might turn out very wrong in cases where you are using flipped components, so make sure you have automatic alignment activated where possible and are avoiding scaling, flipping or shearing of components. Use the script *mekkablue → Components → Component Problem Finder* to find such potential issues.

## Keyboard reference {#shortcuts}

All shortcuts below apply while the Italify Tagger is active. [[⌥]] added to any tagging action fans it out across compatible masters.

| Keys | Action |
|---|---|
| [[C]] | Activate the Italify Tagger |
| [[S]] | Add **S**tem from the selected nodes |
| [[E]] | Toggle **E**xtras (add to selected stem / remove from owning stem) |
| [[A]] | Toggle **A**nchor edge on two selected corners |
| [[H]] | Toggle **H**inge corners (one selected corner implies its opposite) |
| [[L]] | Toggle **L**imit Curve on selected on-curve nodes |
| [[N]] | Toggle **N**o Curve Correction on selected curve segments |
| [[I]] | Add / remove **I**nktrap on a selected straight segment between two unsmooth nodes |
| [[Y]] | Toggle **Y**-Snap on selected on-curve nodes (retain ↔ release their y) |
| [[⌫]] | Remove tag / stem; with a corner clicked, delete that corner; with an anchor selected, clear its links |
| [[⌘A]] | Cycle select-all: nodes → stems → tags → anchors and their combinations (present kinds only) |
| [[Tab]] / [[⇧Tab]] | With one mark type selected (stem, tag or anchor), select the next / previous item of that type |
| [[⌘C]] | Copy Selection – copies the selected stems / tags / anchor links (any mix) |
| [[⌘V]] / [[⌘⌥V]] | Paste whatever Italify items are on the clipboard (additive); [[⌘⌥V]] pastes into all masters |
| [[Space]] | Pan, with filled outline preview |
| [[Space]]+[[Shift]] | Live Italify preview with parameter panel |