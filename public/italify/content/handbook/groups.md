# Glyph groups {#groups}

@lede Named sets of glyphs that share Italify parameters

Should you want to use different parameters for different glyphs, you can separate them into different groups.

## The groups palette {#groups-palette}

The **Italify Groups** palette sits in the right sidebar. Select one or more glyphs and use the **Group** pop-up to assign them either to an existing group, to *None*, or to *New Group…* to create one.

**Click a group** to shows the its saved parameters. Below the matrix an **editable glyph list** lists the group’s members: edit it and the names are validated against the font on close. The list accepts `*` **wildcards** – type `*-ar` and every glyph whose name ends in `-ar` belongs to the group. Explicitly assigning a glyph to a *different* group always wins over a wildcard match.

```screenshot tall
img: ../images/groupsPalette.png
alt: A group’s popover: the parameter matrix, the editable member list, and the group action buttons.
caption: A group’s popover: its parameter matrix, its members, and group actions.
```

## Editing group parameters {#group-parameters}

You **edit a group’s parameters from the filter dialogue**, not the palette. When saving parameters for a group, two options exist:

- **\<name\> (font)** – saves the value for *every* master of the group at once.
- **\<name\> (master)** – saves it for the current master only, overriding the all-masters value there.