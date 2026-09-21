# The Glyph → Italify menu {#glyph-menu}

@lede Batch verbs that run across every selected glyph and layer at once.

The tagger only ever sees the single active layer. For batch work there is a second surface: an **Italify** submenu under the **Glyph** menu that runs the bulk verbs across *every selected glyph/layer at once*. Select the glyphs you want to treat (in Font View or Edit View), then:

- **Auto-Tag Diagonals** – runs the auto-tagger on every selected layer (additive; existing diagonals are left untouched).
- **Auto-Link Anchors** – links every unlinked anchor on every selected layer (an x/y-intersection link when the anchor sits on a curve, else the nearest on-curve node – see [Anchor links](anchor-links)). Already-linked anchors are left untouched. To auto-link anchors by name (with `*` wildcards) across many layers, use [`auto_link_anchors`](../python-api#bulk) from Python.
- **Propagate to all Masters → Diagonals / Tags / Anchor Links / All** – mirrors the chosen metadata from each selected layer onto its glyph’s other compatible masters. *All* sends every kind at once.
- **Clear → Diagonals / Tags / Anchor Links / All** – wipes the chosen userData on every selected layer (*All* wipes every kind at once). Hold [[⌥]] for the “… in all Masters” variant.
- **Import → from Master… / from other Font…** – copies diagonals, tags and anchor links from another master for the selected glyphs. **Overwrites existing data** in those glyphs. In the dialogue: pick the kinds to import and the source master *Import*. Glyphs missing from the source font or with incompatible outlines are skipped untouched and reported. Use *Propagate to all Masters* after verifying the import.
- **Settings and Licences…** – opens the [Settings window](settings): licence codes and your licence history, the tagger’s keyboard shortcuts, the advanced options and the release notes. Always available, with or without a selection.

```screenshot
img: ../images/glyphMenu.png
alt: The Glyph menu with the Italify submenu expanded, showing the batch verbs.
caption: The Glyph → Italify menu runs the bulk verbs across every selected glyph.
```
