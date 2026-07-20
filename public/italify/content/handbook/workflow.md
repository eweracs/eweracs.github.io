@overline [Italify Handbook](./)

# A typical workflow {#workflow}

@lede The advised order of steps for italicising a project. Each step links to the chapter that covers it in depth.

```toc
1. [Start from a finished upright](#upright)
2. [Set the italic angle](#angle)
3. [Tag stems in bulk](#bulk-tag)
4. [Review the tagging glyph by glyph](#review)
5. [Add per-node tags where needed](#node-tags)
6. [Link the anchors](#anchors)
7. [Tune parameters with the live preview](#tune)
8. [Scope parameters with groups](#scope)
9. [Propagate across masters](#propagate)
10. [Apply, or run at export](#apply)
```

Italify works best when it runs late: the more settled your upright drawings are, the less re-tagging and re-tuning you do. The order below keeps the manual work – tagging, tuning – on stable ground, and leaves the destructive step (actually slanting the outlines) for last, or skips it entirely by [running at export](filter#export).

## 1. Start from a finished upright {#upright}

Italify derives the italic from your upright masters, so bring the uprights to a stable state first – proportions, weight and spacing settled, even if details still move. Then clean the paths: nodes on extremes, balanced handles, connected paths, no unnecessary inflection nodes. The [Tips](tips) chapter lists the path properties that make the correction behave, and the scripts that find violations for you.

## 2. Set the italic angle {#angle}

Decide the slant and enter it as the *Italic Angle* in *Font Info → Masters* for every master. The filter's [[↺]] button reads exactly this value, so the correction and your font metadata never disagree – and at [export](filter#export) Glyphs derives `post.italicAngle` and the caret slope from it automatically.

## 3. Tag stems in bulk {#bulk-tag}

**Important:** To be most efficient, work in **only one master** (ideally a relatively light one) when setting up stems and tags, since you can later propagate them to all compatible masters with a single click.

Select all glyphs in Font View and run *Glyph → Italify → [Auto-Tag Stems](glyph-menu)*. The auto-tagger scans each layer for pairs of roughly parallel segments and tags everything that passes validation – on a text face this typically covers the large majority of stems. It is additive and never touches existing stems, so you can re-run it at any time.

```screenshot wide
tag: Screenshot – bulk auto-tagging
desc: Font View with all glyphs selected and the Glyph → Italify → Auto-Tag
  Stems menu item highlighted; a few glyphs already showing their blue stem
  overlays in a preview strip.
caption: One menu command tags the bulk of the font's stems.
```

## 4. Review the tagging glyph by glyph {#review}

Activate the [tagger](tagger) ([[C]]) and walk through the font. For each glyph, check that every stem the filter should correct is tagged, and that the four corners sit on the right nodes – [drag a corner halo](stems#corner-swap) to fix a wrong pick, [[S]] to add a missing stem, [[⌫]] to remove a wrong one. Then add the constraints the drawing calls for:

- [Anchored edges](stems#anchor-edges) ([[A]]) where one edge must stay put – the outer edges of a *V*, for example.
- [Hinge corners](stems#hinge-corners) ([[H]]) where two opposite points are fixed – the junctions of a *Z* diagonal.
- [Extras](stems#extras) ([[E]]) for details that should ride along with a stem.
- The [flip button](stems#flip-axis) for stems that are wider than tall but should behave like upright strokes.

A glyph that looks under-corrected in preview usually just has an untagged stem – check the tagging before touching the parameters.

```screenshot
tag: Screenshot – reviewing a glyph
desc: A lowercase “k” or “w” in the tagger with all stems tagged: blue
  trapezoids, one anchored edge in pink, corner halos visible. Conveys the
  “fully described glyph” end state of the review step.
caption: A fully described glyph: every stem tagged, constraints in place.
```

## 5. Add per-node tags where needed {#node-tags}

With the stems in place, handle the local exceptions with [Tags](tags):

- [Terminal](tags#terminal) ([[C]]) for stroke cuts the automatic detection misses – the filter already finds the obvious ones and draws them green.
- [Limit Curve](tags#limit-curve) ([[L]]) where a curve billows out past an unsmooth corner.
- [Inktrap](tags#inktrap) ([[I]]) to hold an ink trap at its original size.
- [Y-Snap](tags#snap-y) ([[Y]]) to pin (or release) a node's height by hand.

Most glyphs need none of these; they are the surgical tools for the handful of spots the general correction gets wrong.

## 6. Link the anchors {#anchors}

Run *Glyph → Italify → [Auto-Link Anchors](glyph-menu)* over the selected glyphs: anchors sitting on a curve get an intersection link, every other anchor links to its nearest on-curve node. Then refine by hand in the tagger where an anchor should track a different node – see [Anchor links](anchor-links). Linked anchors ride the correction instead of being left behind by it.

## 7. Tune parameters with the live preview {#tune}

Open *Filter → Italify*, press [[↺]] to adopt the master's angle, and judge the four sliders against the live preview – or hold [[Space]]+[[Shift]] in the [tagger](tagger#preview) to flip between the working outline and the corrected result without applying anything. The [parameters](filter#parameters) chapter explains what each slider does; the defaults (everything at 100%, terminals at 0%) are the right starting point for most designs.

```screenshot
tag: Screenshot – tuning against the preview
desc: The filter dialogue beside an Edit View glyph showing the live preview,
  mid-adjustment: one slider being dragged, the outline visibly responding.
caption: Judge every parameter against the live preview before applying anything.
```

## 8. Scope parameters with groups {#scope}

When one set of values doesn't fit the whole font, save scoped overrides instead of compromising: create [groups](groups) for shapes that behave alike – rounds, diagonals, a `*-ar` wildcard for the Arabic – and save per-group values from the filter dialogue's **Save for:** picker. Individual outliers get [glyph or layer parameters](filter#saving-parameters). The cascade (layer → glyph → group → master → font) resolves the right value everywhere, in the preview and at export.

## 9. Propagate across masters {#propagate}

If you tagged with [[⌥]] held, your marks are already in every compatible master. Otherwise mirror them now: *Glyph → Italify → [Propagate to all Masters](glyph-menu) → All*. Then step through the other masters and spot-check – bolder masters sometimes want an extra constraint or a slightly different [group value](groups) where the thin master needed none.

## 10. Apply, or run at export {#apply}

Two ways to finish, depending on where the project stands:

- **Apply the filter** (*Filter → Italify → Apply*) to generate real italic masters you continue drawing on. Do this once the tagging and parameters are final – it is the one step that actually moves your nodes.
- **Keep the sources upright** and add the `Filter` custom parameter to your italic instances, so Italify runs when they are generated – see [Using Italify at export](filter#export). Ideal while the uprights are still in flux: the italics stay a free by-product until you decide to draw them properly.
