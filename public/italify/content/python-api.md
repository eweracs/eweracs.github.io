# Italify Python API

@lede Author stems, tags and anchor links from Macro-panel scripts and batch jobs – the same metadata the tagger writes, scripted.

```toc
1. [Overview](#overview)
2. [Installation](#installation)
3. [Results & strict mode](#results)
4. [Quick start](#quick-start)
5. [Reading tags](#reads)
6. [Stems](#stems)
7. [Corner roles](#corner-roles)
8. [Extras](#extras)
9. [Stem objects](#stem-objects)
10. [Per-node flags](#flags)
11. [Anchor links](#anchor-links)
12. [Bulk operations](#bulk)
13. [Transfer between fonts](#transfer)
14. [Refusal reasons](#refusals)
```

## Overview {#overview}

The `italify` module exposes the [Tagger](handbook#tagger)’s authoring verbs to Python. It accesses the same methods the items in the [Glyph → Italify menu](handbook#glyph-menu) use. A script therefore writes the exact `userData` the filter reads – and, like the tool, it **never moves geometry**: it only writes metadata.

## Installation {#installation}

Install the Italify plugin and relaunch Glyphs once. You will then be able to write the following:

```python
import italify
```

## Results & strict mode {#results}

Every **mutating** call returns an `ItalifyResult`:

- it is **truthy on success**, falsy on refusal – so `if italify.add_stem(…):` reads naturally;
- `.stem_id` is the new stem’s UUID string (for `add_stem` / `add_stem_explicit`), otherwise `None`;
- `.count` is how many things the call touched – masters mirrored to, stems repaired, segments tagged;
- on refusal, `.reason` is a [machine code](#refusals) and `.message` a human-readable sentence.

Refusals are **returned, not raised**, by default. Set `italify.strict = True` (module-wide) or pass `strict=True` to a single call to make a refusal raise `ItalifyError` (carrying the same `.reason` / `.message`) instead. Read calls return plain values – lists, tuples, or booleans.

Every mutating call is **one undo step**. Most accept an `all_masters=True` keyword that fans the change out to compatible layers of the glyph in the same step – the scripted equivalent of the tool’s [[⌥]] modifier; incompatible layers are skipped.

## Quick start {#quick-start}

```python
import italify

layer = Glyphs.font.selectedLayers[0]

# Tag a stem from the current node selection.
r = italify.add_stem(layer, layer.selection)
if r:
    print("tagged stem", r.stem_id)
    # Pin one edge of it.
    a, b = layer.selection[0], layer.selection[1]
    italify.set_anchored_edge(layer, r.stem_id, a, b)
else:
    print("refused:", r.reason, "—", r.message)

# Or let the auto-tagger do the whole layer, then mirror to all masters.
italify.auto_tag(layer)
italify.propagate_stems(layer)
```

## Reading tags {#reads}

Read calls never refuse; they return plain values.

**`stem_ids(layer)`**

Every stem tagged on the layer.

*Parameters:*

- `layer` (`GSLayer`)

*Returns:*

- `list[str]` – the stem-id (UUID) strings, sorted

**`corners(layer, stem_id)`**

A stem’s corner nodes.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID

*Returns:*

- `list[GSNode]` – the (up to four) corner nodes

**`extras(layer, stem_id)`**

A stem’s non-corner member nodes.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID

*Returns:*

- `list[GSNode]` – the member nodes that aren’t corners (on- and off-curve)

**`is_corrupted(layer, stem_id)`**

Whether a stem’s tags still form a valid frame.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID

*Returns:*

- `bool` – `True` when the tags no longer form a valid frame

**`is_flipped(layer, stem_id)`**

Whether a stem’s axis is flipped.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID

*Returns:*

- `bool` – `True` when the axis is flipped

**`anchored_edge(layer, stem_id)`**

A stem’s anchored edge, if any.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID

*Returns:*

- `tuple[GSNode, GSNode] | None` – the edge’s two corner nodes, or `None` if unset

**`hinge_corners(layer, stem_id)`**

A stem’s hinge pair, if any.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID

*Returns:*

- `tuple[GSNode, GSNode] | None` – the pair’s two corner nodes, or `None` if unset

**`linked_nodes(layer, anchor_name)`**

The nodes an anchor is linked to.

*Parameters:*

- `layer` (`GSLayer`)
- `anchor_name` (`str`) – the anchor’s name

*Returns:*

- `list[GSNode]` – the linked nodes

**`linked_anchors(node)`**

The anchors a node belongs to.

*Parameters:*

- `node` (`GSNode`) – the node to query (this verb takes no `layer`)

*Returns:*

- `list[str]` – the anchor names linked to it

**`has_limit_curve(node)`**

Whether a node carries the [Limit Curve](handbook#node-flags) flag.

*Parameters:*

- `node` (`GSNode`) – the node to query (this verb takes no `layer`)

*Returns:*

- `bool` – `True` when the flag is set

**`has_no_curve_correction(node)`**

Whether a node carries the [No Curve Correction](handbook#node-flags) flag. The flag sits on both on-curve endpoints of an opted-out segment, so a `True` on either end identifies the segment.

*Parameters:*

- `node` (`GSNode`) – the node to query (this verb takes no `layer`)

*Returns:*

- `bool` – `True` when the flag is set

## Stems {#stems}

**`add_stem(layer, nodes, all_masters=False)`**

Tag a stem from ≥ 4 on-curve nodes; corners are auto-picked, the rest become extras.

*Parameters:*

- `layer` (`GSLayer`)
- `nodes` (sequence of `GSNode`) – at least four on-curve nodes, e.g. `layer.selection`
- `all_masters` (`bool`) – also tag every compatible master

*Returns:*

- `ItalifyResult` – `.stem_id` carries the new stem’s UUID

**`add_stem_explicit(layer, corners, extras=None, all_masters=False)`**

Tag a stem from an explicit four-corner set plus optional extras.

*Parameters:*

- `layer` (`GSLayer`)
- `corners` (sequence of `GSNode`) – exactly four on-curve corner nodes
- `extras` (sequence of `GSNode`, optional) – further member nodes, on- or off-curve
- `all_masters` (`bool`) – also tag every compatible master

*Returns:*

- `ItalifyResult` – `.stem_id` carries the new stem’s UUID

**`delete_stem(layer, stem_id, all_masters=False)`**

Remove a stem’s tags.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID
- `all_masters` (`bool`) – also clear it from every compatible master

*Returns:*

- `ItalifyResult`

**`set_flipped(layer, stem_id, flipped, all_masters=False)`**

Set the stem’s [flip-axis](handbook#flip-axis) flag.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID
- `flipped` (`bool`) – the flag’s new value
- `all_masters` (`bool`) – also set it on every compatible master

*Returns:*

- `ItalifyResult`

## Corner roles {#corner-roles}

A stem has at most one pin – setting an anchored edge clears any hinge and vice versa.

**`set_anchored_edge(layer, stem_id, node_a, node_b, on=True, all_masters=False)`**

Pin (or, with `on=False`, clear) the [anchored edge](handbook#anchor-edges) formed by two adjacent corners.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID
- `node_a` (`GSNode`) – one corner of the edge
- `node_b` (`GSNode`) – the adjacent corner forming the edge
- `on` (`bool`) – pin when `True`, clear when `False`
- `all_masters` (`bool`) – also apply to every compatible master

*Returns:*

- `ItalifyResult`

**`set_hinge_corners(layer, stem_id, node_a, node_b, on=True, all_masters=False)`**

Pin (or clear) two diagonally-opposed corners as a [hinge](handbook#hinge-corners).

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID
- `node_a` (`GSNode`) – one corner
- `node_b` (`GSNode`) – the diagonally-opposed corner
- `on` (`bool`) – pin when `True`, clear when `False`
- `all_masters` (`bool`) – also apply to every compatible master

*Returns:*

- `ItalifyResult`

## Extras {#extras}

**`add_extras(layer, stem_id, nodes, all_masters=False)`**

Add nodes as [extras](handbook#extras) of a stem.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the owning stem’s UUID
- `nodes` (sequence of `GSNode`) – the nodes to add, on- or off-curve
- `all_masters` (`bool`) – also add them on every compatible master

*Returns:*

- `ItalifyResult`

**`remove_extras(layer, nodes, all_masters=False)`**

Remove nodes from whichever stem owns them.

*Parameters:*

- `layer` (`GSLayer`)
- `nodes` (sequence of `GSNode`) – the extra nodes to detach; the owning stem is found automatically
- `all_masters` (`bool`) – also remove them on every compatible master

*Returns:*

- `ItalifyResult`

Handles whose curve has **both** on-curve ends in the stem are locked in as extras; removing one is refused with `lockedHandle` until you take an end out of the stem.

## Stem objects {#stem-objects}

An `ItalifyStem` reference lets you read and drive a stem directly instead of using methods to define and read it.

A reference stores only `(layer, stem_id)` and **reads through to the engine on every access** – it never caches. A stem deleted out from under it reports empty `corners` and `exists == False` rather than going stale.

Get one three ways:

**`stems(layer)`**

Every tagged stem on the layer, as a list of `ItalifyStem` references.

*Parameters:*

- `layer` (`GSLayer`)

*Returns:*

- `list[ItalifyStem]` – one reference per tagged stem

**`stem(layer, stem_id)`**

A reference to a single stem id. The stem need not exist yet – check `.exists`.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_id` (`str`) – the stem’s UUID (need not exist yet)

*Returns:*

- `ItalifyStem` – a reference bound to that id

**`result.stem`**

On a successful [`add_stem`](#stems) / `add_stem_explicit` result, the freshly-tagged stem as a reference.

*Returns:*

- `ItalifyStem | None` – a reference to the new stem, or `None` on any other call

### Reads – properties

| Property | Value |
|---|---|
| `.id` | the stem’s UUID string |
| `.exists` | `True` while the stem is still tagged on the layer |
| `.corners` | the (up to four) corner `GSNode`s |
| `.extras` | the non-corner member nodes (on- and off-curve) |
| `.is_corrupted` | `True` if the tags no longer form a valid frame |
| `.is_flipped` | `True` if the stem’s axis is flipped |
| `.anchored_edge` | the [anchored edge](#corner-roles)’s two corners as a tuple, or `None` |
| `.hinge_corners` | the hinge pair’s two corners as a tuple, or `None` |

### Writes – methods

Each returns an [`ItalifyResult`](#results) and keeps the underlying verb’s `all_masters` / `strict` keywords.

| Method | Does |
|---|---|
| `.set_flipped(flipped, all_masters=False)` | set the [flip-axis](handbook#flip-axis) flag |
| `.set_anchored_edge(a, b, on=True, all_masters=False)` | pin (or clear) the [anchored edge](handbook#anchor-edges) of two adjacent corners |
| `.set_hinge_corners(a, b, on=True, all_masters=False)` | pin (or clear) two diagonally-opposed [hinge](handbook#hinge-corners) corners |
| `.add_extras(nodes, all_masters=False)` | add nodes as [extras](handbook#extras) |
| `.remove_extras(nodes, all_masters=False)` | remove nodes from whichever stem owns them |
| `.delete(all_masters=False)` | remove the stem’s tags |

```python
import italify

layer = Glyphs.font.selectedLayers[0]

# Tag a stem from the selection, then drive it as an object.
r = italify.add_stem(layer, layer.selection)
if r:
    s = r.stem  # the new ItalifyStem
    a, b = s.corners[:2]  # two adjacent corners
    s.set_anchored_edge(a, b, all_masters=True)  # pin, mirrored to all masters
    print(s.id, "flipped?", s.is_flipped)

# Sweep the layer: pin the first edge of every healthy, un-pinned stem.
for s in italify.stems(layer):
    if s.is_corrupted or s.anchored_edge:
        continue
    a, b = s.corners[:2]
    res = s.set_anchored_edge(a, b)
    if not res:
        print("skipped", s.id, "—", res.message)
```

An `ItalifyStem` is a thin wrapper, so it refuses exactly as the free functions do: a write returns a falsy result carrying a [reason](#refusals); set `strict=True` (per call or module-wide) to raise [`ItalifyError`](#results) instead.

## Per-node flags {#flags}

**`set_limit_curve(layer, node, on, all_masters=False)`**

Toggle [Limit Curve](handbook#node-flags) on an on-curve node.

*Parameters:*

- `layer` (`GSLayer`)
- `node` (`GSNode`) – the on-curve node to flag
- `on` (`bool`) – set the flag when `True`, clear it when `False`
- `all_masters` (`bool`) – also flag it on every compatible master

*Returns:*

- `ItalifyResult`

**`set_no_curve_correction(layer, node_a, node_b, on, all_masters=False)`**

Toggle [No Curve Correction](handbook#node-flags) on the segment between two nodes.

*Parameters:*

- `layer` (`GSLayer`)
- `node_a` (`GSNode`) – one on-curve node bounding the segment
- `node_b` (`GSNode`) – the other on-curve node bounding the segment
- `on` (`bool`) – set the flag when `True`, clear it when `False`
- `all_masters` (`bool`) – also flag it on every compatible master

*Returns:*

- `ItalifyResult`

## Anchor links {#anchor-links}

**`link_anchor(layer, anchor_name, node, all_masters=False)`**

Link an [anchor](handbook#anchor-links) to a node (additive – an anchor links to any number of nodes).

*Parameters:*

- `layer` (`GSLayer`)
- `anchor_name` (`str`) – the anchor’s name
- `node` (`GSNode`) – the node to link it to
- `all_masters` (`bool`) – also link on every compatible master

*Returns:*

- `ItalifyResult`

**`unlink_anchor(layer, anchor_name, node, all_masters=False)`**

Remove one anchor → node link.

*Parameters:*

- `layer` (`GSLayer`)
- `anchor_name` (`str`) – the anchor’s name
- `node` (`GSNode`) – the node to unlink
- `all_masters` (`bool`) – also unlink on every compatible master

*Returns:*

- `ItalifyResult`

## Bulk operations {#bulk}

These mirror the [Glyph → Italify menu](handbook#glyph-menu) verbs.

**`auto_tag(layer)`**

Run the stem [auto-tagger](handbook#creating-stems) on the layer (active layer only; additive).

*Parameters:*

- `layer` (`GSLayer`)

*Returns:*

- `ItalifyResult` – `.count` is how many stems were added

**`resolve_corrupted(layer, all_masters=False)`**

[Repair or strip](handbook#corruption) corrupted stems.

*Parameters:*

- `layer` (`GSLayer`)
- `all_masters` (`bool`) – also act on every compatible master

*Returns:*

- `ItalifyResult` – `.count` is how many stems were acted on

**`clear_stems(layer, all_masters=False)`**

Remove every stem.

*Parameters:*

- `layer` (`GSLayer`)
- `all_masters` (`bool`) – also clear every compatible master

*Returns:*

- `ItalifyResult` – `.count` is how many layers were touched

**`clear_tags(layer, all_masters=False)`**

Remove every per-node flag.

*Parameters:*

- `layer` (`GSLayer`)
- `all_masters` (`bool`) – also clear every compatible master

*Returns:*

- `ItalifyResult` – `.count` is how many layers were touched

**`clear_anchor_links(layer, all_masters=False)`**

Remove every anchor link.

*Parameters:*

- `layer` (`GSLayer`)
- `all_masters` (`bool`) – also clear every compatible master

*Returns:*

- `ItalifyResult` – `.count` is how many layers were touched

**`clear(layer, stems=True, tags=True, anchor_links=True, all_masters=False)`**

Clear a chosen mix of kinds in one undo group.

*Parameters:*

- `layer` (`GSLayer`)
- `stems` (`bool`) – remove stems
- `tags` (`bool`) – remove per-node flags
- `anchor_links` (`bool`) – remove anchor links
- `all_masters` (`bool`) – also clear every compatible master

*Returns:*

- `ItalifyResult` – `.count` is how many layers were touched

**`propagate_stems(layer, stem_ids=None)`**

Mirror stems to compatible masters.

*Parameters:*

- `layer` (`GSLayer`)
- `stem_ids` (sequence of `str`, optional) – the stem UUIDs to mirror; `None` mirrors all

*Returns:*

- `ItalifyResult` – `.count` is how many stems were mirrored

**`propagate_tags(layer, nodes=None)`**

Mirror per-node flags to compatible masters.

*Parameters:*

- `layer` (`GSLayer`)
- `nodes` (sequence of `GSNode`, optional) – the nodes whose flags to mirror, additively; `None` mirrors all

*Returns:*

- `ItalifyResult` – `.count` is how many flags were mirrored

**`propagate_anchor_links(layer, anchor_names=None)`**

Mirror anchor links to compatible masters.

*Parameters:*

- `layer` (`GSLayer`)
- `anchor_names` (sequence of `str`, optional) – the anchor names to mirror; `None` mirrors all

*Returns:*

- `ItalifyResult` – `.count` is how many links were mirrored

**`propagate(layer, stems=True, tags=True, anchor_links=True)`**

Mirror a chosen mix of kinds in one undo group.

*Parameters:*

- `layer` (`GSLayer`)
- `stems` (`bool`) – mirror stems
- `tags` (`bool`) – mirror per-node flags
- `anchor_links` (`bool`) – mirror anchor links

*Returns:*

- `ItalifyResult` – `.count` is the total mirrored

## Transfer between fonts {#transfer}

`propagate_*` only reaches compatible masters of the *same* glyph. To copy metadata **between two fonts**, use `transfer` – it takes an explicit target layer, so source and target may belong to different fonts.

**`transfer(source_layer, target_layer, stems=True, tags=True, anchor_links=True, replace=True)`**

Copy a chosen mix of kinds from one layer onto another, in one undo group.

The two layers must *index-map* – the same path and node counts, and the same on-/off-curve at every index (the same structural match `propagate_*` requires of compatible masters). The copy maps purely by `(path, node)` index, so stem ids, corner roles, anchored edges, hinges, the flip flag, per-node tag flags and anchor links all carry over verbatim.

*Parameters:*

- `source_layer` (`GSLayer`) – the layer to read from
- `target_layer` (`GSLayer`) – the layer to write to (may be in another font)
- `stems` (`bool`) – copy stems
- `tags` (`bool`) – copy per-node flags
- `anchor_links` (`bool`) – copy anchor links
- `replace` (`bool`) – `True` mirrors the source exactly (clears whatever the source doesn't carry); `False` is additive (the target keeps marks the source lacks)

*Returns:*

- `ItalifyResult` – `.count` is how many kinds were applied; refuses with [`noCompatibleMasters`](#refusals) when the layers don’t index-map

```python
import italify

src, dst = Glyphs.fonts[0], Glyphs.fonts[1]
sid, did = src.masters[0].id, dst.masters[0].id

for g in src.glyphs:
    target = dst.glyphs[g.name]
    if target:
        italify.transfer(g.layers[sid], target.layers[did])
```

## Refusal reasons {#refusals}

When a write is refused, `result.reason` is one of these machine codes (`result.message` carries the matching sentence):

| Code | Meaning |
|---|---|
| `tooFewNodes` | Select at least 4 on-curve nodes. |
| `incoherentShape` | The selection isn’t a coherent stem shape (one of the four corner regions is empty). |
| `outsideBlack` | The stem area must be inside black shapes. |
| `extraExclusivity` | Extras belong to one stem only; a target is already part of another. |
| `cornerOverlap` | Two stems can share at most two nodes; this would overlap an existing stem. |
| `noCompatibleMasters` | No compatible layers with matching nodes were found. |
| `notLineAdjacent` | The two nodes must be corners forming a line segment (anchored edge). |
| `cornersNotDiagonal` | The two corners must be diagonally opposed (hinge). |
| `lockedHandle` | Those handles stay extras while both ends of their curve belong to the stem. |
| `notFound` | No matching stem, anchor, or node was found on the layer. |
| `trialBlocked` | The action requires a licensed copy of Italify. |
