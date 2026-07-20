@overline [Italify Handbook](./)

# The Glyph → Italify menu {#glyph-menu}

@lede Batch verbs that run across every selected glyph and layer at once.

The tagger only ever sees the single active layer. For batch work there is a second surface: an **Italify** submenu under the **Glyph** menu that runs the bulk verbs across *every selected glyph and layer at once*. Select the glyphs you want to treat (in Font View or Edit View), then:

- **Auto-Tag Stems** – runs the auto-tagger on every selected layer (additive; existing stems are left untouched).
- **Auto-Link Anchors** – links every unlinked anchor on every selected layer (an x/y-intersection link when the anchor sits on a curve, else the nearest on-curve node – see [Anchor links](anchor-links)). Already-linked anchors are left untouched.
- **Propagate to all Masters → Stems / Tags / Anchor Links / All** – mirrors the chosen metadata from each selected layer onto its glyph’s other compatible masters. *All* sends every kind at once.
- **Clear all → Stems / Tags / Anchor Links / All** – wipes the chosen userData on every selected layer (*All* wipes every kind at once). Hold [[⌥]] for the “… in all Masters” variant.

This is the only way to tag or propagate across many glyphs in one go – the tagger’s equivalent commands always act on the layer in front of you.

```screenshot
img: ../images/glyphMenu.png
alt: The Glyph menu with the Italify submenu expanded, showing the batch verbs.
caption: The Glyph → Italify menu runs the bulk verbs across every selected glyph.
```
