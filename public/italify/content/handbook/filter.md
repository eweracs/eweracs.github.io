@overline [Italify Handbook](./)

# The filter {#filter}

@lede *Filter → Italify* – the correction itself: its parameters, saving scoped parameter sets, running at export, and the hidden settings.

```toc
1. [The dialogue](#dialogue)
2. [Parameters](#parameters)
3. [Saving parameters](#saving-parameters)
4. [Using Italify at export](#export)
5. [Hidden settings](#hidden-settings)
```

## The dialogue {#dialogue}

Choose *Filter → Italify* with one or more glyphs open in Edit View. You can adjust the parameters with the live preview showing the result you get when pressing *Apply*.
```annotated
img: ../images/window.png
alt: The Italify filter dialogue with the angle field and four correction sliders.
note 15.5%: **Angle** – the slant to apply. [[↺]] reads the current master’s italic angle.
note 26%: **Saved parameters** – Use the same parameters for the whole font, single masters, glyphs, layers or groups.
note 42%: **Curve correction** – rebalances curves against the shear’s distortion.
note 52%: **Keep terminals** – preserves the cut of stroke endings.
note 69%: **Diagonal correction** – corrects tagged diagonal stems’ width and angle.
note 82%: **Stem compensation** – how much of a stem’s width change is restored.
note 96%: The gear menu holds *Copy Filter Parameter* for [export](#export).
```

## Parameters {#parameters}

#### Angle | degrees | default 0°

The italic angle to apply. The [[↺]] button next to the field reads the angle from the current master’s *Italic Angle* setting, so the filter and your font metadata stay in agreement. The shear pivots around half the x-height – the standard Glyphs convention – so glyphs stay visually centred on the line.

#### Curve correction | 0–100% | default 100%

How strongly curved segments are corrected against the distortion the shear introduces. At 0%, curves are simply slanted, with all the familiar weight gain and loss around the bowl. At 100%, each curve is rebalanced so its weight distribution matches the upright. Values in between blend the two – useful when you want a hint of the mechanical flavour to survive.

#### Diagonal correction | 0–100% | default 100%

The equivalent control for straight diagonal segments. Out of the box this applies **only to tagged stems** – untagged diagonals are simply slanted – so the correction never second-guesses geometry you haven’t described. (A [hidden setting](#hidden-settings) extends it to all diagonals.)

#### Stem compensation | 0–100% | default 100%

Controls how much of the width change that slanting causes in stems is compensated. At 100%, a tagged stem comes out of the filter measuring what it did upright; at 0%, it keeps whatever width the shear left it with.

The **advance width grows with it**. Because compensation widens the outline horizontally about the glyph centre, the layer’s advance is widened by the same factor and the outline is shifted by half the difference, so the growth is split equally between the two sidebearings – the outline never eats into a fixed advance. At 0 % (or 0° angle) the advance is left untouched.

#### Keep terminals | 0–100% | default 0%

Governs the straight terminals at stroke ends – the cut of an *e*, *c* or *s*, for example. At 0%, a terminal is simply slanted. At 100%, it is rotated back against the rotation the correction gave the adjoining curves, preserving the original cut relative to the stroke. Terminals are detected automatically from the outline as line segments connecting two curves going in the same direction. Automatic detection stays narrow – terminals designed with open corners aren’t caught – but you can tag those (and any other cut) by hand with the [Terminal](tags#terminal) tag.

## Saving parameters {#saving-parameters}

Out of the box, the four correction sliders edit one app-wide set of defaults: change them once and every glyph you run the filter on uses those values. Often you want finer control – a tighter curve correction on just the rounds, or a different stem compensation in the Bold master. Italify lets you **save a set of parameters scoped to a single layer, glyph, [group](groups), master, or the whole font**, and resolves the right one automatically.

```screenshot wide
img: ../images/savingParameters.png
alt: The filter dialogue’s lower band with the scope picker, Save button and actions menu.
caption: Saving a scoped set of parameters from the filter dialogue.
```

Set the sliders the way you want them, pick a scope from **Save for:** – *Font*, *Master*, *Glyph*, or *Layer*, plus *Group (font)* and *Group (master)* when the active glyph belongs to a [group](groups) – and press **Save**. The status line above the picker always tells you which scope is currently in effect (“Using *Glyph* parameters”, say) and warns when you have edited the sliders without saving. The picker opens **pre-selected to that same scope** – if the glyph is currently using *Glyph* parameters, *Glyph* is already chosen, so Save writes back to where the values came from; with nothing saved anywhere it defaults to *Font*.

When the filter runs, it resolves each of the four parameters independently through a **cascade**, from most specific to least:

```
layer → glyph → group → master → font → app-wide defaults
```

The first scope that has a saved value for a given parameter wins, so a value saved on the layer overrides one on its glyph, which overrides the master, and so on. Parameters with no saved override anywhere fall back to the global defaults. The [group](groups) rung sits between glyph and master.

The **⋯ actions menu** beside the picker handles removal: *Clear parameters for ▸ Layer / Glyph / Group (font) / Group (master) / Master / Font* drops a scope’s saved values (master and font ask for confirmation), and *Reset parameters* discards unsaved slider edits. A scope you have not saved anything to reads “No parameters saved”.

Selecting several glyphs that resolve to **different** values shows “Multiple parameters set.” instead of guessing – each keeps its own parameters, and saving is disabled until the selection agrees. Saved scopes are honoured both in the live preview and at [export](#export), where a saved value beats the instance’s `Filter` parameter for that glyph.

## Using Italify at export {#export}

You can keep your sources upright and let Italify run when instances are generated. This can be useful while the upright masters are still in development and a quick italic is needed for previewing.

Add a `Filter` custom parameter to an instance (Font Info → Exports) with a value like:

```
Italify;angle:9.5;curveCorrection:0.8;diagonalCorrection:0.9;stemCompensation:1;keepTerminals:0;diagonalStemsOnly:1
```

You don’t need to type this: open the filter dialogue, set the parameters the way you want them, and choose *Copy Filter Parameter* from the dialogue’s gear menu – filter parameter lands on your clipboard ready to paste into the instance. All arguments are optional and named, so partial parameters like `Italify;angle:10` work and fall back to the defaults above.

Like many Glyphs export filters, Italify also accepts an **`include`** or **`exclude`** argument to scope which glyphs it runs on – comma-separated glyph names, with `*` wildcards allowed:

```
Italify;angle:10;exclude:A,B,*-ar
```

`include` means “run *only* on these glyphs”; `exclude` means “run on everything *except* these”. The two can’t be combined – if both are given, `include` wins. A scoped-out glyph is left completely untouched.

At export the angle is also written into each generated instance’s metadata: Glyphs derives `post.italicAngle`, the `hhea` caret slope and related fields from it, so the exported italics carry the correct angle without you ever editing the upright source’s *Font Info*.

```screenshot
img: ../images/exportFilter.png
alt: Font Info → Exports with an instance’s Filter custom parameter carrying the Italify parameter string.
caption: Italify as an export-time filter on an instance.
```

## Hidden settings {#hidden-settings}

Three behaviours have no dialogue control and are toggled via the Macro panel. All default to the behaviour most users want. The are prefixed with `com.eweracs.italify.`.

| Setting | Default | Effect |
|---|---|---|
| `diagonalCorrectionStemsOnly` | `True` | Diagonal correction and stem compensation apply only to tagged stems. Set to `False` to correct every diagonal segment, tagged or not. For untagged stems, the transformation origin will be (half layer width, half x-height). Experimental use only, results will be unexpected.|
| `flattenIntersections` | `True` | When the correction pushes an outline past an adjacent short line (typical at tight junctions), Italify collapses the junction into a clean, master-compatible doubled node – the way you would draw it by hand. Set to `False` to keep the uncollapsed geometry. |
| `autoSnapToMetrics` | `True` | An **unsmooth line-to-curve** node – where a straight segment meets a curve – whose height sits exactly on a metric (baseline, x-height, …) is held to that metric through the correction, so such corners don’t drift off it. Smooth nodes, line-to-line corners and curve-to-curve corners are left free. The tagger marks every node this affects with a violet pin. Set to `False` to disable the snap entirely. |

For example, in the Macro panel:

```
Glyphs.defaults["com.eweracs.italify.flattenIntersections"] = False
```
