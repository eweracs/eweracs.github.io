# A typical workflow {#workflow}

@lede The advised order of steps for italicising a project. Each step links to the chapter that covers it in depth.

Italify works best when it runs late: the more settled your upright drawings are, the less re-tagging and re-tuning you do. The order below keeps the manual work – tagging, tuning – on stable ground, and leaves the destructive step (actually slanting the outlines) for last, or skips it entirely by [running at export](filter#export).

## 1. Start from a finished upright {#upright}

Bring the uprights to a stable state first, as this will save you a lot of time later. Clean the paths: nodes on extremes, balanced handles, connected paths, no unnecessary inflection nodes. The [Tips](tips) chapter lists the path properties that make the correction behave, and the scripts that find violations for you.

## 2. Tag diagonals in bulk {#bulk-tag}

**Important:** To be most efficient, work in **only one master** (ideally a relatively light one) when setting up diagonals and tags, since you can later propagate them to all compatible masters with a single click.

Select all glyphs in Font View and run *Glyph → Italify → [Auto-Tag Diagonals](glyph-menu)*. The auto-tagger scans each layer for pairs of roughly parallel segments and tags everything that passes validation – on a text face this typically covers the large majority of diagonals. It is additive and never touches existing diagonals, so you can re-run it at any time.

```screenshot wide
img: ../images/autoTagDiagonals.png
desc: Font View with all glyphs selected and the Glyph → Italify → Auto-Tag
  Diagonals menu item highlighted; a few glyphs already showing their blue diagonal
  overlays in a preview strip.
caption: One menu command tags the bulk of the font’s diagonals.
```

## 3. Review the tagging glyph by glyph {#review}

Activate the [tagger](tagger) ([[C]]) and walk through the font. For each glyph, check that every diagonal the filter should correct is tagged, and that the four corners sit on the right nodes – [drag a corner halo](diagonals#corner-swap) to fix a wrong pick, [[D]] to add a missing diagonal, [[⌫]] to remove a wrong one. Then add the constraints the drawing calls for:

- [Anchored edges](diagonals#anchor-edges) ([[A]]) where one edge must stay put – the outer edges of a *V*, for example.
- [Hinge corners](diagonals#hinge-corners) ([[H]]) where two opposite points are fixed – the junctions of a *Z* diagonal.
- [Extras](diagonals#extras) ([[E]]) for details that should ride along with a diagonal.
- The [flip button](diagonals#flip-axis) for diagonals that are wider than tall, or that the auto-direction guesses wrong.

A glyph that looks under-corrected in preview usually just has an untagged diagonal – check the tagging before touching the parameters.

```screenshot
img: ../images/taggedDiagonals.png
desc: A lowercase “k” or “w” in the tagger with all diagonals tagged: blue
  trapezoids, one anchored edge in pink, corner halos visible. Conveys the
  “fully described glyph” end state of the review step.
caption: A fully described glyph: every diagonal tagged, constraints in place.
```

## 4. Add per-node tags where needed {#node-tags}

With the diagonals in place, handle the local exceptions with [Tags](tags):

- [Terminal](tags#terminal) ([[C]]) for stroke cuts the automatic detection misses – the filter already finds the obvious ones and draws them green.
- [Curve Extension](tags#curve-extension) where a small curve bends in unwanted ways – drag the control to 
  adjust how much Italify infers, or press [[L]] to jump straight to [Limit Curve](tags#limit-curve) (0%).
- [Inktrap](tags#inktrap) ([[I]]) to hold an ink trap at its original size.
- [Y-Snap](tags#snap-y) ([[Y]]) to pin (or release) a node’s height by hand.

Most glyphs need none of these; they are the surgical tools for the handful of spots the general correction gets wrong.

## 5. Link the anchors {#anchors}

Run *Glyph → Italify → [Auto-Link Anchors](glyph-menu)* over the selected glyphs: anchors sitting on a curve get an intersection link, every other anchor links to its nearest on-curve node. Then refine by hand in the tagger where an anchor should track a different node – see [Anchor links](anchor-links). Linked anchors ride the correction instead of being left behind by it.

## 6. Tune parameters with the live preview {#tune}

Open *Filter → Italify*, press [[↺]] to adopt the master’s angle, and judge the four sliders against the live preview – or hold [[Space]]+[[Shift]] in the [tagger](tagger#preview) to flip between the working outline and the corrected result without applying anything. The [parameters](filter#parameters) chapter explains what each slider does; the defaults (everything at 100%, terminals at 0%) are the right starting point for most designs.

```screenshot
img: ../images/preview.png
desc: The filter dialogue beside an Edit View glyph showing the live preview,
  mid-adjustment: one slider being dragged, the outline visibly responding.
caption: Judge every parameter against the live preview before applying anything.
```

## 7. Scope parameters with groups {#scope}

When one set of values doesn’t fit the whole font, save scoped overrides instead of compromising: create [groups](groups) for shapes that behave alike – rounds, diagonals, a `*-ar` wildcard for the Arabic – and save per-group values from the filter dialogue’s **Save for:** picker. Individual outliers get [glyph or layer parameters](filter#saving-parameters). The cascade (layer → glyph → group → master → font) resolves the right value everywhere, in the preview and at export.

## 9. Propagate across masters {#propagate}

If you tagged with [[⌥]] held, your marks are already in every compatible master. Otherwise mirror them now: *Glyph → Italify → [Propagate to all Masters](glyph-menu) → All*. Then step through the other masters and spot-check – bolder masters sometimes want an extra constraint or a slightly different [group value](groups) where the thin master needed none.

## 9. Duplicate your tagged masters {#duplicate}

Important: if you have activated Italify on your upright masters in order to test the preview, this activation doesn’t get carried over to the duplicated masters. Use the duplicated masters as the new upright source, and make your original upright masters the new italics.

Set the italic angle in your italic masters. You can use the angle lock to keep the Italify angle always in sync with the master angle.

Set *Generate from* to the upright source for quick updatability when things change in your uprights.

## 10. Apply, or run at export {#apply}

Two ways to finish, depending on where the project stands:

- **Apply the filter** (*Filter → Italify → Apply*) to generate real italic masters you continue drawing on.
- **Keep the sources upright** and add the `Filter` custom parameter to your italic instances, so Italify runs when they are generated – see [Using Italify at export](filter#export). Ideal while the uprights are still in development. Note: kerning will look somewhat off, as it would need to be adjusted to slanted shapes.
