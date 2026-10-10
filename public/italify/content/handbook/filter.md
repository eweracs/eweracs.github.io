# The filter {#filter}

@lede *Filter → Italify* – the correction itself: its parameters, saving scoped parameter sets, running at export, and the advanced settings.

## The dialogue {#dialogue}

Choose *Filter → Italify* with one or more glyphs open in Edit View. You can adjust the parameters with the live preview showing the result you get when pressing *Apply*.
```annotated
img: ../images/window.png
alt: The Italify filter dialogue with the angle field and the correction sliders.
note 11.5%: **Angle** – the slant to apply.
note 19%: **Generate from** – select another master as the source.
note 30%: **Saved parameters** – Use the same parameters for the whole font, single masters, glyphs, layers or groups.
note 42%: **Curve correction** – rebalances curves against the shear’s distortion.
note 51.5%: **Keep terminals** – preserves the cut of stroke endings: its *Angle* and its *Position* along the stroke.
note 67.5%: **Diagonal correction** – corrects tagged diagonals’ width and angle.
note 78%: **Stem compensation** – widens the whole outline to restore the weight vertical stems lose.
note 91%: **Keep nodes on extremes** – Attempts to keep nodes on orthogonal extremes.
note 99%: The gear menu holds *Copy Filter Parameter* for [export](#export) and *Settings and Licences…*.
```

## Parameters {#parameters}

#### Angle | degrees | default 0°

The italic angle to apply. The [[↺]] button next to the field reads the angle from the current master’s *Italic Angle* setting, so the filter and your font metadata stay in agreement. The shear pivots around half the x-height – the standard Glyphs convention – so glyphs stay visually centred on the line.

#### Curve correction | 0–100% | default 100%

How strongly curved segments are corrected against the distortion the shear introduces. At 0%, curves are simply slanted, with all the familiar weight gain and loss around the bowl. At 100%, each curve is rebalanced so its weight distribution matches the upright. Values in between blend the two – useful when you want a hint of the mechanical flavour to survive.

#### Diagonal correction | 0–100% | default 100%

The equivalent control for straight diagonal segments. Out of the box this applies **only to [tagged diagonals](diagonals)** – untagged diagonal segments are simply slanted – so the correction never second-guesses geometry you haven’t described. (An [advanced setting](#hidden-settings) extends it to every diagonal segment.)

#### Stem compensation | 0–100% | default 100%

Slanting thins every vertical stem: measured across the stroke, a sheared stem is narrower than it was upright. Stem compensation makes up for that by scaling the **whole outline horizontally** – every glyph by the same factor, tagged or not. At 100%, a vertical stem comes out of the filter measuring what it did upright; at 0%, it keeps whatever width the shear left it with. It is independent of [tagged diagonals](diagonals), which are *Diagonal correction*’s business.

The **advance width grows with it**. Because compensation widens the outline horizontally about the glyph centre, the layer’s advance is widened by the same factor and the outline is shifted by half the difference, so the growth is split equally between the two sidebearings – the outline never eats into a fixed advance. At 0 % (or 0° angle) the advance is left untouched.

#### Keep terminals – Angle | 0–100% | default 0% · Position | 0–100% | default 100%

Governs the straight terminals at stroke ends – the cut of an *e*, *c* or *s*, for example. Two things can happen to a terminal when the curves either side of it are corrected, and each has its own slider:

- **Position** – where along its adjoining curves the terminal sits. At **100%**, the terminal sits where a slant would put it. At **0%**, it follows the curves and their correction. Think of it like a rotation, rather than a slant.
- **Angle** – the angle of the terminal. At 0%, it is a pure slant. At 100%, the angles at which the terminal attaches to the adjoining segments matches that in the upright source.

Terminals are detected automatically from the outline as line segments connecting two curves going in the same direction. Automatic detection stays narrow – terminals designed with open corners aren’t caught – but you can tag those (and any other cut) by hand with the [Terminal](tags#terminal) tag. Terminals can also be given [angle and position settings](tags#terminal-settings), which override the filter’s sliders.

## Generating a layer from another master {#generate-from}

Normally, the filter runs directly on the selected layer’s outline. You can, however, select another source layer/master (and bulk-edit this by selecting multiple glyphs). Then, the filter uses that layer as the source instead. Useful for quickly updating an italic layer when the upright source changes. The dropdown guesses the source based on axis location and name.

A few things worth knowing:

- Diagonals, tags and anchor links (only) need to exist on the **source** layer. Anything drawn or tagged by hand on the generated layer is replaced. Switch *Generate from* off before retouching a layer you want to keep.
- The generated layer still uses **its own** [saved parameters](#saving-parameters).
- With several glyphs open, the checkbox and popup apply to all of them at once.
- The setting only concerns the source file. It plays no part [at export](#export), where the filter runs on interpolated instances.

## Saving parameters {#saving-parameters}

By default, the correction sliders edit one app-wide set of defaults: change them once and every glyph you run the filter on uses those values. You can save parameters for a font, so that they don’t get lost when you change the slider values somewhere else. You can also **save a set of parameters scoped to a single layer, glyph, [group](groups) or master**. They are resolved in that hierarchy, with font parameters being the lowest hierarchy.

```screenshot wide
img: ../images/savingParameters.png
alt: The filter dialogue’s lower band with the scope picker, Save button and actions menu.
caption: Saving a scoped set of parameters from the filter dialogue.
```

Set the sliders the way you want them, pick a scope from **Save for:** – *Font*, *Master*, *Glyph*, or *Layer*, plus *Group (font)* and *Group (master)* when the active glyph belongs to a [group](groups) – and press **Save**. The status line above the picker always tells you which scope is currently in effect and warns when you have edited the sliders without saving.

When the filter runs, it resolves the parameters from most specific to least:

```
layer → glyph → group → master → font → app-wide defaults
```

The **⋯ actions menu** beside the picker handles removal: *Clear parameters for ▸ Layer / Glyph / Group (font) / Group (master) / Master / Font* drops a scope’s saved values.

Selecting several glyphs that resolve to **different** values shows “Multiple parameters set”. Saved scopes are used both in the live preview and at [export](#export), where a saved value **overrides the instance’s `Filter` parameter for that glyph.**

## Using Italify at export {#export}

You can keep your sources upright and let Italify run when instances are generated. This can be useful while the upright masters are still in development and a quick italic is needed for previewing.

Add a `Filter` custom parameter to an instance (Font Info → Exports) with a value like:

```
Italify;angle:9.5;curveCorrection:0.8;diagonalCorrection:0.9;stemCompensation:1;keepTerminalAngle:1;keepTerminalPosition:1;taggedDiagonalsOnly:1;keepExtremes:0;autoDetectTerminals:1;nonOrthogonalTerminalsOnly:0
```

Instead of typing this out, simply open the filter dialogue, set your desired parameters, and choose *Copy Filter Parameter* from the dialogue’s gear menu. All arguments are optional and named, so partial parameters like `Italify;angle:10` work and fall back to the defaults above.

Four arguments are **switches** rather than values: **`keepExtremes`**, **`taggedDiagonalsOnly`**, **`autoDetectTerminals`** and **`nonOrthogonalTerminalsOnly`**. Write them as `1` or `0` (`true`/`false` and `yes`/`no` are accepted too). `taggedDiagonalsOnly` mirrors the [advanced setting](#hidden-settings) *Correct tagged diagonals only* and is on unless you set it to `0`. `autoDetectTerminals` and `nonOrthogonalTerminalsOnly` mirror the advanced settings *Auto-detect terminals* and *Only detect non-orthogonal terminals*: left out, every terminal is detected.

Like many Glyphs export filters, Italify also accepts an **`include`** or **`exclude`** argument to scope which glyphs it runs on – comma-separated glyph names, with `*` wildcards allowed:

```
Italify;angle:10;exclude:A,B,*-ar
```

`include` means “run *only* on these glyphs”; `exclude` means “run on everything *except* these”. The two can’t be combined – if both are given, `include` is used.

Saved parameters apply at export too. For an instance between masters, anything saved per master – a *Master* scope, a *Group (master)* value set, a *Layer* – is interpolated. Halfway between a Regular saved at 40 % curve correction and a Bold at 100 %, the instance gets 70 %. An instance beyond the outermost master takes that master’s value (no extrapolation). The same goes for the amounts stored on nodes – a [curve extension](tags#curve-extension) and a [terminal’s own angle and position](tags#terminal-settings). Diagonals and the other tags are **not interpolated:** the instance takes them from the first master it is made from.

If you work with **master credits**, the filter runs on an instance only if every master that instance is interpolated from is [activated](settings#licences). With a time pass, every instance is covered.

```screenshot
img: ../images/exportFilter.png
alt: Font Info → Exports with an instance’s Filter custom parameter carrying the Italify parameter string.
caption: Italify as an export-time filter on an instance.
```

## Advanced settings {#hidden-settings}

A few behaviours have no control in the dialogue. They live in [*Settings and Licences… → Advanced*](settings#advanced) (*Glyph → Italify*, or the dialogue’s gear menu) and apply app-wide.

| Setting | Default | Effect |
|---|---|---|
| *Flatten intersections* | on | When the correction pushes an outline past an adjacent short line (typical at tight junctions), Italify collapses the junction into a clean, master-compatible doubled node – the way you would draw it by hand. Switch it off to keep the uncollapsed geometry. |
| *Keep line-to-curve corners on metrics* | on | An **unsmooth line-to-curve** node – where a straight segment meets a curve – whose height sits exactly on a metric (baseline, x-height, …) is held to that metric through the correction, so such corners don’t drift off it. Smooth nodes, line-to-line corners and curve-to-curve corners are left free. The tagger marks every node this affects with a violet pin. Switch it off to disable the snap entirely. |
| *Correct tagged diagonals only* | on | Diagonal correction applies only to tagged diagonals. Switch it off to correct every diagonal segment, tagged or not. For untagged segments, the transformation origin will be (half layer width, half x-height). Experimental use only, results will be unexpected. |
| *Auto-detect terminals* | on | The filter finds the obvious [terminals](tags#terminal) by itself – a straight cut between two curves heading the same way – and the *Keep terminals* sliders apply to them. Switch it off to keep only the terminals you tag. |
| *Only detect non-orthogonal terminals* | off | Under *Auto-detect terminals*: detect only terminals cut at an angle. A terminal cut horizontally or vertically (within about half a degree) is then only kept when you tag it. |
| *Keep nodes on extremes – tolerance* | 1 unit | With [Keep nodes on extremes](#parameters) on, a node is only moved onto the extreme when the corrected shape can be re-drawn within this distance; otherwise it stays where the correction put it. |

Scripts can still set them as `Glyphs.defaults`. the keys are `flattenIntersections`, `autoSnapToMetrics`, `taggedDiagonalsOnly`, `autoDetectTerminals`, `nonOrthogonalTerminalsOnly` and `keepExtremesTolerance`, each prefixed with `com.eweracs.italify.`:

```
Glyphs.defaults["com.eweracs.italify.flattenIntersections"] = False
```
