@overline [Italify Handbook](./)

# Glyph groups {#groups}

@lede Named sets of glyphs that share Italify parameters – the natural way to tune “all the rounds” or “all the diagonals” together.

A **group** is a named set of glyphs that share Italify parameters. A group is coarser than a single glyph but finer than a master: it sits in the [parameter cascade](filter#saving-parameters) between the two (layer → glyph → **group** → master → font), so a value saved on a glyph or layer still wins, and the group is a fallback for every member that has no closer override. A glyph belongs to **at most one** group.

## The groups palette {#groups-palette}

Membership is managed from the **Italify Groups** palette (Window sidebar). Select one or more glyphs and use the **Group** pop-up to assign them – to an existing group, to *None*, or to *New Group…* to create one. The list below shows every group defined in the font.

**Click a group** in the list to open its popover. It shows the group’s saved parameters as a matrix – one row for the whole font plus a row per master, one column each for Curve, Terminal, Diagonal, and Stem – with values inherited from the all-masters row greyed and unset cells shown as “–”. Below the matrix an **editable glyph list** holds the group’s members: edit it and the names are validated against the font on close (valid names join the group, removed ones leave it). The list accepts `*` **wildcards** – type `*-ar` and every glyph whose name ends in `-ar` belongs to the group. The pattern is stored **as written**, never expanded into names: membership through a wildcard is *live*, so a glyph added to the font later that matches the pattern joins automatically, and the list stays short and manageable. Explicitly assigning a glyph to a *different* group always wins over a pattern match; to take a pattern-matched glyph out of the group otherwise, adjust the pattern (assigning *None* in the palette clears only an explicit assignment). The buttons at the bottom **Open in new Tab**, **Rename**, or **Delete** the group; the same three sit on each row’s right-click menu, where *Show all glyphs in group* also carries a badge with the member count.

```screenshot tall
img: ../images/groupsPalette.png
alt: A group’s popover: the parameter matrix, the editable member list, and the group action buttons.
caption: A group’s popover: its parameter matrix, its members, and group actions.
```

## Editing group parameters {#group-parameters}

You **edit a group’s parameters from the filter dialogue**, not the palette. With a glyph that belongs to a group active, the **Save for:** picker gains two extra entries, each labelled with the group’s own name so you can see exactly which group you are saving for (e.g. *round (font)* / *round (master)* for a group named “round”):

- **\<name\> (font)** – saves the value for *every* master of the group at once (e.g. curve correction = 0 across the whole font).
- **\<name\> (master)** – saves it for the current master only, overriding the all-masters value there.

Both are disabled unless the active glyph is in a group (where they fall back to the generic *Group (font)* / *Group (master)* labels). The ⋯ actions menu likewise gains matching *Clear ▸ \<name\> (font) / \<name\> (master)* entries, and the all-masters clear warning names the group.
