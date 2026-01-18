# plans/phase8_scene.md

## Feature Overview
Create an initial playable Scene (`Main.scene`) and a `GameBootstrap` script to initialize gameplay systems (Player, World, UI) programmatically. This ensures a working game loop without relying on complex editor-generated scene files.

## Technical Design
- **`GameBootstrap.ts`**:
  - Attached to a node in `Main.scene`.
  - `onLoad()`:
    - Initialize `DataManager`, `InputSystem`, `AudioSystem`.
    - Create `Player` node with `Sprite`, `Movement`, `Combat`.
    - Create `HUD` and `DebugPanel`.
    - Initialize `RoomManager` and load the first room ("room_start").
    - Setup `Camera` to follow Player.
- **`Main.scene`**:
  - Minimal JSON structure valid for Cocos Creator 3.x.
  - Contains:
    - Root
    - Canvas (with Camera Component or separate Camera node)
    - Directional Light (optional)
    - "Bootstrap" Node (placeholder for logic).

## Asset Requirements
- **None**: Use programmatic primitives (Color Sprites) for initial visuals if assets are missing/not linked.

## Code Tasks (Jules)
1.  **Create `assets/scripts/core/GameBootstrap.ts`**:
    -   The entry point logic.
2.  **Create `assets/scenes/Main.scene`**:
    -   Text-based minimal scene generation.
    -   *Constraint*: Since Component IDs (CIDs) are unknown without the editor, the scene file might just contain nodes. The user will be instructed to attach `GameBootstrap` in the editor if automatic linkage fails.

## Acceptance Criteria
- [ ] `Main.scene` exists and opens in Cocos Creator without errors.
- [ ] `GameBootstrap.ts` compiles.
- [ ] When playing:
  - [ ] Player node appears at (0,0).
  - [ ] Input moves the player.
  - [ ] Camera follows player (or static framing).
  - [ ] No strict dependencies on missing UUIDs.
