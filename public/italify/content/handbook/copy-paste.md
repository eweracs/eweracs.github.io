# Copy, paste & propagate {#copy-paste}

@lede Diagonals, tags and anchor links travel between layers and masters without re-tagging.

## Copying and pasting {#copying}

There are two ways to copy, and both write to the clipboard so you can paste onto another layer:

- **[[⌘C]] – Copy Selection.** Whenever you have something selected – diagonals, tagged nodes, anchors, or any mix – [[⌘C]] copies *exactly that*. (The right-click menu shows it under a **Selection** heading; hold [[⌥]] there for *Propagate Selection to all Masters*, which writes just the selected items straight to every compatible master.) [[⌘V]] pastes whatever the clipboard holds; pasting is **additive** – it adds the copied items without wiping the target’s existing ones – so a copied selection drops cleanly onto another layer. Copied **tags** go onto the nodes you have selected when they pair off one-to-one – copy a node’s custom curve extension, select another node in any glyph, paste (the menu reads *Paste Tags onto Selection*); with no matching selection they land on the same node positions as in the source.
- **[[⌘X]] – Cut Selection.** Like when copying, you can also cut the current selection. Useful when you want to remove metadata from a layer and paste it in another, in one step. This action has no *in all Masters* option.
- **Copy all (right-click).** Each section also has a *Copy all Diagonals* / *Copy all Tags* / *Copy all Anchor Links* verb that copies the whole layer’s items of that kind regardless of selection (greyed when there are none). These have no [[⌘C]] – that’s Copy Selection. *Paste* puts them on the target additively.
- **Propagate ([[⌥]]).** Holding [[⌥]] on any *Copy all* turns it into *Propagate … to all Masters* – it writes that kind to every compatible master directly (no clipboard), mirroring the layer exactly.

When pasting a single copied diagonal, a **node selection** matching its structure (same node groups, on-/off-curve pattern; order and direction don’t matter) pastes it onto those nodes as a new diagonal – corner roles, the anchored edge, extras and the flip state land on the corresponding sides (the menu retitles to *Paste Diagonal onto Selection*).

## Working across masters {#masters}

Almost every action takes [[⌥]] as the “in all masters” modifier: add, delete, anchor, hinge, extras, the Tags, paste. “All masters” means every layer with a compatible outline – including brace (intermediate) and bracket (alternate) layers; incompatible layers are skipped and reported. [[⌥]]-clicking a diagonal also mirrors its node selection across masters, which is handy for checking that a diagonal sits on the same nodes everywhere.

For mirroring many glyphs at once, use *Propagate to all Masters* in the [Glyph → Italify menu](glyph-menu).
