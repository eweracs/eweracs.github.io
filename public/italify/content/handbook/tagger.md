@overline [Italify Handbook](./)

# The tagger {#tagger}

@lede The Edit View tool that describes your glyphs to the filter. It writes metadata only – it never moves a point.

```toc
1. [What it does](#tagger-overview)
2. [Navigation & live preview](#preview)
```

## What it does {#tagger-overview}

The *Italify Tagger* (toolbar icon, shortcut [[C]]) is where you can describe glyph features to the filter – diagonals to correct, how anchors should move, specific corrections. It is a metadata editor: it never moves points itself. Everything you tag is stored on the nodes in the file and drawn on the canvas, so what you see with the tool active is exactly what the filter will read.

It works with two kinds of marks – **stems** and **tags** – and additionally lets you link Glyphs *anchors* to nodes. Each has its own chapter:

```cards
## [Stems](stems)
Groups of nodes the filter corrects together as one rigid unit, with their own set of options.
## [Tags](tags)
Per-node marks that change how the filter treats a single spot.
## [Anchor links](anchor-links)
Ties between Glyphs anchors and outline nodes, so anchors ride the correction.
```

Marks travel: see [Copy, paste & propagate](copy-paste) for moving them between layers and masters, and the [Glyph → Italify menu](glyph-menu) for running the bulk verbs across many glyphs at once. The full shortcut list lives in the [keyboard reference](shortcuts).

## Navigation & live preview {#preview}

Hold [[Space]] to pan, as everywhere in Glyphs – while held, the tool shows the clean filled outline with all chrome hidden. Add [[Shift]] and the filled preview becomes a **live Italify preview:** the glyph rendered with the current filter parameters (your outline is untouched), with a small floating panel listing the parameters in effect. Change a value in the filter dialogue, hold [[Space]]+[[Shift]] again, and the preview reflects it – a fast way to judge the correction without applying anything. Useful for previewing different tagging results directly.

```screenshot
img: ../images/preview.png
alt: The tagger’s Space+Shift preview: the filled italified outline with the floating parameter panel.
caption: Hold Space + Shift in the tagger for a live preview of the current parameters.
```
