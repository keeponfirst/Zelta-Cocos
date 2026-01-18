Implement the Save/Load System.

Files to modify/create:

1.  `assets/scripts/systems/SaveSystem.ts`:
    -   Define `SaveData` interface (version, timestamp, player, inventory, world).
    -   `save(slot: number)`: Collect data from `Player` (find in scene or via Manager), `InventoryComponent`, `RoomManager`. Save to `sys.localStorage`.
    -   `load(slot: number)`: Read data, validate version (call `SaveMigrator`), then apply data to game objects.

2.  `assets/scripts/systems/SaveMigrator.ts`:
    -   `migrate(data: any): SaveData`: Ensure data matches current schema. Handle upgrades.

3.  `assets/scripts/gameplay/entity/Player.ts`:
    -   Add `toSaveData()`: returns `{ hp, maxHp, position }`.
    -   Add `loadData(data)`: restores state.

4.  `assets/scripts/gameplay/components/InventoryComponent.ts`:
    -   Add `toSaveData()`: returns `{ items, equippedIndex }`.
    -   Add `loadData(data)`: restores items.

5.  `assets/scripts/gameplay/world/RoomManager.ts`:
    -   Add `toSaveData()`: returns `{ currentRoomId, clearedRooms }`.
    -   Add `loadData(data)`: restores state.

6.  `assets/scripts/ui/PauseMenu.ts`:
    -   Call `SaveSystem.getInstance().save(0)` on Save button click.

7.  `assets/scripts/ui/MainMenu.ts` (if validation needed, or creating simple load test script):
    -   Check if save exists, enable "Continue" button.
