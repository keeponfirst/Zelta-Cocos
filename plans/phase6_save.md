# plans/phase6_save.md

## Feature Overview
Implement a robust Save/Load system to persist player progress, including health, inventory, equipment, and world state (cleared rooms/doors). Includes a version migration system to handle future data schema changes.

## Technical Design
- **SaveSystem (`systems/SaveSystem.ts`)**:
  - `save(slotId: number)`: Gather data from Managers, serialize to JSON, write to Storage (`cc.sys.localStorage`).
  - `load(slotId: number)`: Read JSON, deserialize, distribute data to Managers (`Player`, `Inventory`, `RoomManager`).
  - `SaveData` Interface:
    ```typescript
    interface SaveData {
      version: number;
      timestamp: number;
      player: { hp: number; maxHp: number; position: Vec3 };
      inventory: { items: InventoryItem[]; equippedIndex: number };
      world: { currentRoomId: string; clearedRooms: string[]; unlockedDoors: string[] };
    }
    ```
- **SaveMigrator (`systems/SaveMigrator.ts`)**:
  - Check `saveData.version`.
  - Apply transformations if version < CURRENT_VERSION.
- **UI Integration**:
  - Connect `PauseMenu` "Save" button.
  - Connect Title Screen "Continue" button.

## Asset Requirements
- **N/A**: Code-only feature. Will use existing UI elements.

## Code Tasks (Jules)
1.  **Implement `SaveSystem.ts`**:
    -   Singleton.
    -   Gather/Distribute logic using `EventBus` or direct Manager access.
2.  **Implement `SaveMigrator.ts`**:
    -   Basic structure for version 1.
3.  **Integrate with Managers**:
    -   Update `Player`, `InventoryComponent`, `RoomManager` to have `toSaveData()` and `loadFromSave()` methods.
4.  **UI Wiring**:
    -   Update `PauseMenu.ts` to call `SaveSystem.save()`.

## Acceptance Criteria
- [ ] Clicking "Save" in Pause Menu saves current state.
- [ ] Restarting game and clicking "Continue" restores:
    - [ ] Player HP and Position
    - [ ] Inventory items and counts
    - [ ] Cleared rooms (enemies don't respawn)
    - [ ] Unlocked doors remain open
- [ ] Save file format includes a version number.
