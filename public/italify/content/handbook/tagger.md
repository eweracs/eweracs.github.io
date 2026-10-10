# The tagger {#tagger}

@lede The Edit View tool that describes your glyphs to the filter.

## What it does {#tagger-overview}

The *Italify Tagger* (toolbar icon, shortcut [[C]]) is where you can describe glyph features to the filter – diagonals to correct, how anchors should move, specific corrections. It is a metadata editor, similar to the hinting tool. Everything you tag is stored on the nodes in the file and drawn on the canvas, so what you see with the tool active is exactly what the filter will read.

Three main metadata types exist:

```cards
## [Diagonals](diagonals)
Diagonal strokes the filter corrects as one rigid unit, with their own set of options.
## [Tags](tags)
Per-node marks that change how the filter treats a single spot.
## [Anchor links](anchor-links)
Ties between Glyphs anchors and outline nodes, so anchors ride the correction.
```

See [Copy, paste & propagate](copy-paste) for moving metadata between layers and masters, and the [Glyph → Italify menu](glyph-menu) for running actions in bulk. You can find the full keyboard shortcut list in the [keyboard reference](shortcuts).

## Navigation & live preview {#preview}

Hold [[Space]] to pan, as usual in Glyphs. When pressing [[Shift]], the filled preview becomes a **live Italify preview:** the glyph rendered with the current filter parameters, with a small floating panel listing the parameters in effect. Adjust some tags and hold [[Space]]+[[Shift]] again to view the new result – a fast way to judge the correction without applying anything.

```screenshot
img: ../images/preview.png
alt: The tagger’s Space+Shift preview: the filled italified outline with the floating parameter panel.
caption: Hold Space + Shift in the tagger for a live preview of the current parameters.
```
