Implement the Item and Inventory System (Inventory logic, UI, Bomb, Boomerang).

Files to modify/create:

1. `assets/scripts/gameplay/components/InventoryComponent.ts`:
   - Store list of `{ itemId, count }`.
   - `addItem(itemId, count)`: Check max stack from `DataManager`.
   - `equipItem(index)`: Set `equippedItemId`.
   - `useCurrentItem()`: Trigger effect logic.

2. `assets/scripts/ui/InventoryPanel.ts`:
   - Render grid of items using `ui_icons.png` (mapped via `items.json` icon index).
   - Handle click/touch to equip.

3. `assets/scripts/systems/ItemSystem.ts` (or similar manager):
   - Handle "Use Item" logic.
   - **Bomb**: Spawn Bomb entity at player position.
   - **Boomerang**: Spawn Boomerang projectile.

4. `assets/scripts/gameplay/items/Bomb.ts`:
   - `onLoad`: Start timer.
   - `explode()`: Spawn explosion hitbox, deal AOE damage, destroy `BombableWall` (check `BombableWall` component).

5. `assets/scripts/gameplay/items/Boomerang.ts` (inherits `Projectile`?):
   - `update(dt)`: Move forward `dist`, then set state into 'return', move toward Player.
   - `onHit(target)`: If Enemy -> Stun/Damage. If Switch -> Toggle.
   - `onReturn()`: If touch Player -> Destroy.

6. `assets/data/tables/items.json`:
   - Add entries for `bomb`, `boomerang`, `key`.
