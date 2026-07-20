@overline [Italify Handbook](./)

# Tips {#tips}

@lede Path-drawing advice that makes the correction behave – most “wrong” results trace back to one of these.

#### Draw good paths.

- Keep nodes on extremes whenever possible.
- Balance your handles, especially in shallow curves. Eliminate overshooting (large) handles. They introduce inflections that are often not intended. Use the script *mekkablue → Paths →  Path Problem Finder → Overshooting handles* to find them, and the plugin *Show Angled Handles* to highlight them. The scripts *mekkablue → Paths → Tunnify/Tunnify2.0* are a great way to balance your handles automatically.
- Nodes that should move on a straight line should be connected to that straight line. Example: don’t make a smooth /n out of a stem and a disconnected shoulder path, but connect the paths.
- You can leave out points at inflections. An /s will give usually give better results if you leave out the inflection points in the spine, for example.

#### Tag stems before judging parameters.

Diagonal correction and stem compensation act on tagged stems (by default, *only* on them). A glyph that looks under-corrected often just has untagged stems – run *Auto-tag Stems* first, then re-evaluate.

#### Make sure your components aren’t flipped.
Component transformation might turn out very wrong in cases where you are using flipped components, so make sure you have automatic alignment activated where possible and are avoiding scaling, flipping or shearing of components. Use the script *mekkablue → Components → Component Problem Finder* to find such potential issues.
