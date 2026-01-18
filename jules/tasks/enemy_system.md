Implement the Enemy System mechanics.

Files to modify/create:
1. `assets/scripts/gameplay/entity/Enemy.ts`:
   - Initialize from `RoomData` spawn info.
   - Setup `HealthComponent` and `CombatComponent` with values from `DataManager`.
   - Setup `AIComponent` behavior (idle, patrol, chase).
   
2. `assets/scripts/gameplay/components/AIComponent.ts`:
   - Implement `update(dt)` for behaviors:
     - **Patrol**: Pick random point in radius, move there, wait, repeat.
     - **Chase**: If Player within `detectRange`, move towards player.
     - **Attack**: If close enough, stop and trigger `CombatComponent.attack()`.
   - Implement "Bat" specific flight (ignore obstacles/walls if possible, or just standard chase).

3. `assets/scripts/gameplay/components/CombatComponent.ts`:
   - Complete `attack()` to actually `dealDamage()` to the target via `HealthComponent`.
   - Add simple collision check (circle/box overlap) to detect hits if physics collider isn't fully set up yet.

4. `assets/scripts/gameplay/entity/ItemDrop.ts`:
   - Implement simple item pickup logic (distance check to Player -> consume -> add to Inventory).

5. `assets/scripts/gameplay/world/Room.ts`:
   - Ensure `spawnEnemies()` correctly instantiates Enemy prefabs (mock instantiate if prefab missing, just new Node).
