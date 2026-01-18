# plans/phase4_world.md

## Feature Overview
Implement the World System to enable room transitions, interactive environmental objects (Doors, Chests), and trigger mechanisms (Switches, Pressure Plates). This phase transforms static rooms into a playable dungeon environment.

## Phase 4 ASSETS ✓
- [x] dungeon_tileset.png - Generated via Nano Banana
- [x] overworld_tileset.png - Generated via Nano Banana
- [x] world_objects.png - Generated via Nano Banana

## Technical Design
- **World Management**:
  - `RoomManager.ts`: Handles loading room prefabs/data and managing active room state.
  - `Room.ts`: Represents a single screen, containing tileset, enemies, and triggers.
- **Interactive Objects**:
  - `Door.ts`: Handles state (Open, Closed, Locked) and transitions.
  - `Chest.ts`: Handles opening animation and spawning reward items.
  - `TriggerBase.ts`: Abstract base for all triggers.
    - `Switch.ts`: Toggle state via attack.
    - `PressurePlate.ts`: Active while entity stands on it.
- **Data Integration**:
  - Load room layouts from `rooms.json` (mocked or Tiled export).
  - Link Triggers to Doors (e.g., Switch A opens Door B).

## Asset Requirements (Nano Banana)
| Filename | Size | Purpose | Prompt File |
|----------|------|---------|-------------|
| `dungeon_tileset.png` | 16x16 grid | Walls, floors, pits | `nanobanana/queue/dungeon_tileset.prompt.md` |
| `overworld_tileset.png` | 16x16 grid | Grass, water, trees | `nanobanana/queue/overworld_tileset.prompt.md` |
| `world_objects.png` | 16x16 / 32x32 | Door, Chest, Switch | `nanobanana/queue/world_objects.prompt.md` |

## Code Tasks (Jules)
1. **Implement `RoomManager.ts`**:
   - `loadRoom(roomId)`: Instantiate room prefab or build from data.
   - `transition(doorId)`: Handle player position change and camera shift (if any).
2. **Implement `Room.ts`**:
   - Parse `RefRoom` data to spawn Enemies, Doors, and Triggers at correct positions.
3. **Implement `Door.ts`**:
   - `open()`, `close()`, `unlock()` methods.
   - Collision logic (block when closed).
4. **Implement `Chest.ts`**:
   - `interact()`: Check state, play anim, spawn item.
5. **Implement Triggers**:
   - Connect `Switch`/`PressurePlate` events to `Door` or `Chest` via `EventBus` or direct link.

## Acceptance Criteria
- [ ] Player can move between rooms via Doors.
- [ ] Locked doors require a Key item to open.
- [ ] Switches/Pressure Plates can open doors or reveal chests.
- [ ] Chests can be opened to receive items (e.g., Key, Heart).
- [ ] Walls block player movement (Collider support).
