# nanobanana/queue/ui_skin.prompt.md

## Asset Information
- **Filename**: ui_skin.png
- **Size**: 256x256 sprite sheet
- **Purpose**: UI borders, panels, and buttons (Nine-Slice ready)
- **Target**: assets/resources/sprites/ui/

## Nano Banana Command
/generate "pixel art UI skin borders buttons..." --styles="pixel art" --count=1

## Prompt
16-bit pixel art UI skin for Zelda-like RPG.
Style: Fantasy, Gold/Stone/Wood textures.

Elements Required:
1.  **Main Panel Background**: 
    - Stone or parchment texture.
    - 3x3 grid compatible (corners, edges, center).
2.  **Button**: 
    - Normal (Wood/Gold rim)
    - Pressed (Darker)
    - Disabled (Gray)
3.  **Item Slot Frame**: 
    - Square decorative frame for inventory icons.
    - Highlighted version.
4.  **Health Bar Container**:
    - Long frame or decorative bracket.

Output:
- Transparent background
- Clean separation for slicing (9-slice)

## Acceptance Criteria
- [ ] Textures tile correctly
- [ ] Distinct Normal/Pressed button states
