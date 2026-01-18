# plans/phase7_polish.md

## Feature Overview
Final polish phase. Implement the Heads-Up Display (HUD) to show player status, an Audio System for immersive sound, and a Debug Panel to assist with final testing and balancing.

## Phase 7 ASSETS ✓
- [x] ui_skin.png - Generated via Nano Banana (Verified)
- [x] Audio Files - Provided by User (Verified in `assets/resources/audio/`)

## Technical Design
- **HUD System (`ui/HUD.ts`)**:
  - **Health Bar**: Renders Hearts (Full/Half/Empty) based on `Player.hp / maxHp`.
  - **Rupee Counter**: Text label updated via EventBus `RUPEE_CHANGE`.
  - **Equipped Item**: Icon slot showing current generic or active item.
  - **Keys**: Counter for small keys and Boss Key icon.
- **Audio System (`systems/AudioSystem.ts`)**:
  - Singleton manager.
  - `playSFX(name)`: One-shot sound (sword swing, hit, explosion).
  - `playBGM(name)`: Loopable background music (dungeon, overworld).
  - Volume control (Music/SFX).
- **Debug Panel (`ui/DebugPanel.ts`)**:
  - Toggled via `F1` or specific touch gesture.
  - Features:
    - [Reset Save]
    - [Heal Full]
    - [Give All Items]
    - [God Mode Toggle]

## Asset Requirements (Nano Banana)
| Filename | Size | Purpose | Prompt File |
|----------|------|---------|-------------|
| `ui_skin.png` | 256x256 | UI Nine-slice borders, button backgrounds, dialog box frame | `nanobanana/queue/ui_skin.prompt.md` |
| **Audio Files** | N/A | User to provide WAV/MP3 files in `assets/resources/audio/` | N/A |

## Code Tasks (Jules)
1.  **Implement `AudioSystem`**:
    -   Methods to load/play/stop clips.
2.  **Implement `HUD`**:
    -   Layout nodes for Hearts, Rupee, Inventory.
    -   Script to sync with Player data.
3.  **Implement `DebugPanel`**:
    -   Simple scrollview with buttons.
    -   Logic to manipulate `DataManager` and `Player`.
4.  **Final Polish**:
    -   Ensure `Camera` follows player smoothly (if not already done).
    -   Add screen shake event support.

## Acceptance Criteria
- [ ] HUD correctly displays 3 hearts (or max HP).
- [ ] Taking damage updates HUD hearts.
- [ ] Switching items updates Equipped slot.
- [ ] AudioSystem can play a dummy SFX.
- [ ] Debug Panel opens and "Heal Full" works.
