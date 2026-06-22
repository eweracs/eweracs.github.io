# A jump start for your italics

@lede Italify is an algorithmic solution to optically corrected obliques. It corrects curve deformation, diagonals and anchor positions, so a slanted master becomes a starting point you can actually work with.

```buttons
[Read the handbook](handbook) primary
```

```screenshot wide
img: images/hero.png
alt: “Bosen” set in a heavy italic – the Italify-corrected outline in blue, with the plain mechanical slant ghosting out from behind it in pink and cyan.
caption: The Italify result in blue, with the plain mechanical slant behind it.
```

@overline The problem

## Good obliques are a huge amount of work. {#problem}

You’ve drawn your upright masters, spent months refining details... and now you want to tackle the italics. Just applying a slant looks terrible: Curves gain weight or are too thin in many places, while diagonals shift in contrast.

Correcting all of that by hand, glyph by glyph, is most of the work of drawing an oblique. It is repetitive and time-consuming. Italify automates exactly that – while leaving you in control. You get a result that is already a very advanced state of your final italic, which you can later adjust by hand to meet your specific taste.

```screenshot
img: images/slantProblems.png
tag: Screenshot – the problem
desc: A single mechanically slanted “o” or “e” with the upright original
  ghosted behind it, annotated with two or three short callouts pointing at
  the typical defects: swollen lower-left / upper-right curve, thinned
  opposite quadrants, rotated terminal. Keep annotations minimal – thin black
  lines, small labels.
caption: What a plain shear does to round shapes, diagonals and terminals.
```

@overline The idea

## Algorithmic precision for *really good* obliques. {#idea}

Italify is based on pure geometry. This means it works on any script and any outline. It treats every curve and line segment individually and compensates each one for the distortion the shear introduces. The result is a slanted outline whose curves and stems still measure and feel like the upright.

You have control over what is corrected, and how:

- **Curve correction** is applied to curve segments and is independent of line segments.
- **Terminal correction** adjusts the difference in angle for terminals, which varies depending on each design.
- **Diagonal correction** treats diagonal stems and adjusts their width and angle based on constraints you define with the built-in Stem Tagger.
- **Stem compensation** compensates for the loss in vertical stems when slanted, maintaining the exact same contrast. Useful for later interpolation adjustments.

@overline What’s in the box

## One plugin, three tools {#tools}
### The Italify filter
The filter itself. A dialogue with live preview: set the angle (or get it from the master), then balance curve correction, diagonal correction, stem compensation and terminal handling with sliders. Also runs at export as a custom parameter, so your sources stay upright.
```screenshot wide
img: images/filter.png
tag: Screenshot – tagger canvas
desc: The filter interface active on a glyph.
caption: The Italify filter in use in Glyphs.
```

### The Italify Tagger
An Edit View tool (shortcut [[C]]) for tagging stems and nodes. It never moves your points – it writes metadata the filter reads, and draws it on the canvas so you can see what the filter will do before you run it.

```screenshot wide
img: images/stemTagger.png
tag: Screenshot – tagger canvas
desc: The Edit View with the Italify Tagger active on a glyph with two or
  three tagged stems (an “n” or “h” is ideal): blue stem trapezoids with
  corner halos, one stem selected (saturated) with its flip-axis button
  visible, a pink anchored edge on one stem. Include the Glyphs toolbar at the
  top so the Italify Tagger icon is visible and highlighted.
caption: The tagger visualises every diagonal the filter will treat.
```

### The Italify Groups palette
A sidebar palette (Window) for **glyph groups** – named sets of glyphs that share Italify parameters, so you can tune “all the rounds” or “all the diagonals” at once. Assign the selection to a group in the palette; each group’s parameters are then edited from the filter dialogue.

```screenshot wide
img: images/groupsPalette.png
tag: Screenshot – Italify Groups palette
desc: The Italify Groups sidebar palette: a glyph name on the first line, a
  “Group” pop-up beneath it, and the list of the font's groups below.
caption: The Italify Groups palette manages group membership.
```

@overline Workflow

## A typical session {#workflow}

```steps
## Tag the stems.
Pick the Italify Tagger, select the nodes of a stem and press [[S]] – or
let *Auto-tag Stems* find them for you. Hold [[⌥]] to tag all masters at
once. Pin an anchored edge with [[A]] where a stem must not move, or set hinge corners with [[H]] for a diagonal whose diagonally opposed corners shouldn’t move.
## Run the filter.
Choose *Filter ▸ Italify*, click [[↺]] to adopt the master’s italic angle,
and watch the live preview while you adjust the sliders. Apply when it looks
right – or hold [[Space]]+[[Shift]] in the tagger for a preview without
leaving the canvas.
## Refine the exceptions.
Where a glyph needs special treatment, tag nodes with [[L]] (limit a curve’s correction) or [[N]] (skip curve
correction) and run the filter again.
```

```screenshot
img: images/preview.png
tag: Screenshot – live preview HUD
desc: The tagger’s Space+Shift preview: the filled, italified outline of a
  glyph with the floating parameter HUD below the baseline listing angle,
  curve correction, keep terminals, diagonal correction, stem compensation
  and retroactive. All node/stem chrome hidden (that is what the mode does),
  so the shot reads as “finished letter plus a small parameter readout”.
caption: Hold Space + Shift in the tagger for a live preview of the current parameters.
```

@overline Get started

## Installation {#get-started}

1. Double-click `Italify.glyphsPlugin` – Glyphs installs it into your Plugins folder.
2. Relaunch Glyphs. You’ll find *Italify* in the Filter menu, the *Italify Tagger* in the toolbar and the *Italify Groups* palette in the sidebar.

Italify requires **Glyphs 3.2 or later**.

```buttons
[Read the handbook](handbook) primary
```
