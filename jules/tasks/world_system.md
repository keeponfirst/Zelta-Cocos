Implement the World System (Room management, Doors, Triggers, Chests).

Files to modify/create:
1. `assets/scripts/gameplay/world/RoomManager.ts`:
   - Implement `loadRoom(roomId)`: Load data from `DataManager`, instantiate room.
   - Implement `transition(doorId)`: Find destination door, move player, switch active room.

2. `assets/scripts/gameplay/world/Room.ts`:
   - `init(data: RoomData)`: Spawn doors, enemies, triggers based on JSON data.
   - Store references to child objects for easy lookup.

3. `assets/scripts/gameplay/world/Door.ts`:
   - `interact()`: If locked, check Inventory for Key. If valid, `unlock()` and `open()`.
   - `onEnter()`: Trigger `RoomManager.transition()`.
   - Collision: Ensure `Collider2D` is enabled when closed, disabled (or sensor) when open.

4. `assets/scripts/gameplay/world/Chest.ts`:
   - `interact()`: If closed, open it and spawn item (use `ItemDrop` logic or direct inventory add).
   - Track state so it stays open.

5. `assets/scripts/gameplay/world/triggers/Switch.ts` & `PressurePlate.ts`:
   - Implement activation logic (Attack hit for Switch, Collision stay for Plate).
   - Emit events or directly call methods on linked `targetId` objects (Door/Chest).

6. `assets/data/tables/rooms.json` (Mock Data):
   - Add at least 2 connected rooms to verify transition.
   - Add a locked door and a key in a chest to verify puzzle flow.
