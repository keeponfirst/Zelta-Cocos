# nanobanana/queue/world_objects.prompt.md

## Asset Information
- **Filename**: world_objects.png
- **Size**: 128x128 sprite sheet
- **Purpose**: Interactive world objects (Door, Chest, Switch)
- **Target**: assets/resources/sprites/objects/

## Nano Banana Command
/generate "16-bit pixel art dungeon objects sheet..." --styles="pixel art" --count=1

## Prompt
16-bit pixel art dungeon objects sprite sheet
Interactive items for top-down Zelda-like RPG.

Style: Matches dungeon tileset (Stone/Wood/Metal)

Items Required:
1. **Door** (32x32 or 16x16 fits):
   - Closed (Wood/Iron), Open (Dark passage), Locked (Keyhole), Boss Door (Fancy)
2. **Treasure Chest**:
   - Closed (Front view), Open (Lid up)
3. **Switch/Lever**:
   - Crystal Switch (Blue/Red states)
   - Floor Pressure Plate (Raised/Lowered)
4. **Pot/Jar**: Breakable ceramic pot

Output:
- Organized sprite sheet
- Transparent background
- Space between items

## Acceptance Criteria
- [ ] Includes Door states (Closed, Open, Locked)
- [ ] Includes Chest states (Closed, Open)
- [ ] Includes Switch states
