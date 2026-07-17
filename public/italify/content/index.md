# A jump start for your italics

@lede Italify is an algorithmic approach to optical correction of obliques. It corrects curve deformation, diagonals and anchor positions, so a slanted master becomes a starting point you can actually work with.

```italify-hero
caption: Font in use: [MNKY Wilson](https://mnkytype.com/wilson).
```

The plugin is now available for licensing. I am happy to give you a demo, in person or by video: sebastian.carewe<span class="email-protected"></span>

```buttons
[Download](https://github.com/eweracs/Italify/releases/latest/download/Italify.glyphsPlugin.zip) primary
[Read the handbook](handbook)
```

@overline The problem

## Good obliques are a huge amount of work. {#problem}

You’ve drawn your upright masters, spent months refining details... and now you want to tackle the italics. Just applying a slant looks terrible: Curves gain weight or are too thin in many places, while diagonals shift in contrast.

Correcting all of that by hand, glyph by glyph, is most of the work of drawing an oblique. It is repetitive and time-consuming. Italify automates exactly that – while leaving you in control. You get a result that is already a very advanced state of your final italic, which you can later adjust by hand to meet your specific taste.

@overline Prior art

## Why not one of the existing approaches? {#prior-art}

So far, the most popular approaches, limited to curve correction, have been:

1. Slanting and adjusting curves by hand. Very tedious and manual, with inconsistent results and no formalisable algorithm.
2. A complex half-slant/rotate mix strategy (proposed by [Karow/Briem](https://help.fontlab.com/fontlab/8/tutorials/briem/4-3-italic/briem-4-34-curves)). This process requires a lot of manual intervention.
3. A custom slant/rotate mix, for example published in the [legacy Italify plugin](https://github.com/eweracs/italify). Relatively limited, and doesn’t keep nodes on horizontal extremes.
4. Stem-based transformation (e.g. Glyphs’ Cursivy algorithm). Some of the worst examples include [Inter](https://fonts.google.com/specimen/Inter)’s italics.
5. Another stem-based [algorithm](https://github.com/googlefonts/roboto-2/blob/main/scripts/lib/fontbuild/italics.py) used to generate [Roboto](https://fonts.google.com/specimen/Roboto)’s obliques. The resulting obliques have the same problems as Inter.
6. Various other combinations (as demonstrated by [Jeremy Tribby](https://vimeo.com/1059825184)).

Italify, in stark contrast, actually produces usable results. It is a stem-agnostic, purely geometrical algorithm. It guarantees master compatibility, as it doesn’t add or remove any nodes, and all horizontal extremes stay perfectly on their height coordinates. Notably, Italify also corrects diagonal stems, not only curves.

@overline The idea

## Algorithmic precision for *really good* obliques. {#idea}

Italify is based on pure geometry. This means it works on any script and any outline. It treats every curve and line segment individually and compensates each one for the distortion the shear introduces. The result is a slanted outline whose curves and stems still measure and feel like the upright.

You have control over what is corrected, and how:

- **Curve correction** is applied to curve segments and is independent of line segments.
- **Terminal correction** adjusts the difference in angle for terminals, which varies depending on each design.
- **Diagonal correction** treats diagonal stems and adjusts their width and angle based on constraints you define with the built-in Stem Tagger.
- **Stem compensation** compensates for the loss in vertical stems when slanted, maintaining the exact same contrast. Useful for later interpolation adjustments.

@overline Testimonials

## What designers say {#voices}

```quotes
## Henning Skibbe | Character Type | https://charactertype.com
Italify not only saved me a great amount of time, but also guaranteed systematic results whose quality speaks for itself. Adding italics to a major project was a breeze. I am a changed man.
## René Bieder | Studio René Bieder | https://www.renebieder.com/
Italify almost feels like an unfair advantage – I’d rather keep it to myself. But the results are simply too good: optically precise, thoughtfully executed, and a huge relief in the process.
## Ermin Međedović | Lettermin | https://lettermin.com/
Having worked with Sebastian for years, Italify’s results were no surprise to me. An efficient and reliable tool, it produces obliques that feel designed, not mechanic, while significantly reducing both time and friction.
## Jakob Runge | TypeMates | https://www.typemates.com/
We used Italify on a custom project – with striking results. In general, it creates obliques remarkably close to what I’d draw by hand, and handles geometric designs in a way that fits my workflow.
```

@overline Capabilities

## Tested on real fonts {#capabilities}

Italify handles all sorts of cases and designs.

```demos
## Overlap-agnostic | overlap
The algorithm works even when overlap is removed and curve intentions would seem more difficult to guess.
## Diagonal correction | diagonal
Italify can also correct diagonals, otherwise too thick or thin after a pure slant. Overlap-agnostic as usual.
## Extra nodes | sweep
Curves with multiple intermediate points between extremes are transformed without a problem – useful where a pure extreme-to-extreme construction doesn’t allow for the desired curve shape. The result is exactly the same as if the extra nodes were omitted.
## Inflections | inflect
Italify handles inflecting curves, without the need to insert explicit inflection points. This way, your outlines stay as smooth as possible.
## Retalics | retal
Whatever name you choose for your backslanted style, Italify has got you covered. Font in use: [Mae Soft](https://lettermin.com/fonts/mae-soft) (made with Italify).
## High-contrast designs | contrast
Theoretically, any curve can be treated with Italify. Whether it actually makes sense for your design is your decision.
## Implicit extremes | implicit
If you want to leave off your horizontal or vertical extreme nodes for curve segments, no problem.
```

@overline Interested?

## Get Italify {#get-italify}

Get in touch for licence purchases or custom quotes: sebastian.carewe<span class="email-protected"></span>

Or see for yourself first – the free trial gives you full access for 48 hours, and the [handbook](handbook) covers everything from tagging stems to per-group parameters. The plugin itself is a [free download](https://github.com/eweracs/Italify/releases/latest/download/Italify.glyphsPlugin.zip); license and trial codes unlock it.

```buttons
[Try free for 48 hours](trial) primary
[Read the handbook](handbook)
```

<small>Italify wordmark by [Morgane Vantorre](https://instagram.com/gagane_). Italify requires Glyphs 3.2 or later.</small>
