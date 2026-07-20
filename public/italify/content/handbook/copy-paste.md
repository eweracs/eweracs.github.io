@overline [Italify Handbook](./)

# Copy, paste & propagate {#copy-paste}

@lede Stems, tags and anchor links travel between layers and masters without re-tagging.

```toc
1. [Copying and pasting](#copying)
2. [Working across masters](#masters)
```

## Copying and pasting {#copying}

There are two ways to copy, and both write to the clipboard so you can paste onto another layer:

- **[[⌘C]] – Copy Selection.** Whenever you have something selected – stems, tagged nodes, anchors, or any mix – [[⌘C]] copies *exactly that*. (The right-click menu shows it under a **Selection** heading; hold [[⌥]] there for *Propagate Selection to all Masters*, which writes just the selected items straight to every compatible master.) [[⌘V]] pastes whatever the clipboard holds; pasting is **additive** – it adds the copied items without wiping the target’s existing ones – so a copied selection drops cleanly onto another layer.
- **Copy all (right-click).** Each section also has a *Copy all Stems* / *Copy all Tags* / *Copy all Anchor Links* verb that copies the whole layer’s items of that kind regardless of selection (greyed when there are none). These have no [[⌘C]] – that’s Copy Selection. *Paste* puts them on the target additively.
- **Propagate ([[⌥]]).** Holding [[⌥]] on any *Copy all* turns it into *Propagate … to all Masters* – it writes that kind to every compatible master directly (no clipboard), mirroring the layer exactly.

When pasting a single copied stem, a **node selection** matching its structure (same node groups, on-/off-curve pattern; order and direction don’t matter) pastes it onto those nodes as a new stem – corner roles, the anchored edge, extras and the flip state land on the corresponding sides (the menu retitles to *Paste Stem onto Selection*).

## Working across masters {#masters}

Almost every action takes [[⌥]] as the “in all masters” modifier: add, delete, anchor, hinge, extras, the Tags, paste. “All masters” means every layer with a compatible outline – including brace (intermediate) and bracket (alternate) layers; incompatible layers are skipped and reported. [[⌥]]-clicking a stem also mirrors its node selection across masters, which is handy for checking that a stem sits on the same nodes everywhere.

For mirroring many glyphs at once, use *Propagate to all Masters* in the [Glyph → Italify menu](glyph-menu).
