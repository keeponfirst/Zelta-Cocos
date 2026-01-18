# plans/phase5_item.md

## Feature Overview
Implement the Item and Inventory System, allowing players to collect, equip, and use items like Bombs and Boomerangs. This phase adds depth to combat and puzzle-solving.

## Phase 5 ASSETS ✓
- [x] items_projectiles.png - Generated via Nano Banana
- [x] ui_icons.png - Generated via Nano Banana

## Technical Design
- **Inventory System**:
  - `InventoryComponent.ts`: Manages a list of `InventoryItem` (id, count, maxCount).
  - `InventoryPanel.ts`: UI to visualize and select active item.
- **Item Logic**:
  - `ItemEffect` (Strategy Pattern):
    - `BombItem`: Spawn `Bomb` entity -> countdown -> `Explosion` entity (Area Damage + Wall break).
    - `BoomerangItem`: Spawn `Boomerang` projectile -> move forward -> return to player -> stun enemies/toggle switches.
- **Entities**:
  - `Projectile.ts`: General moving hitbox (Arrow, Boomerang).
  - `Bomb.ts`: Stationary explodable.

## Data Integration
- `items.json`: Define item properties (icon, max stack, effect script name).

## Asset Requirements (Nano Banana)
| Filename | Size | Purpose | Prompt File |
|----------|------|---------|-------------|
| `items_projectiles.png` | 128x128 | Bomb (idle/explode), Boomerang (spin), Arrow | `nanobanana/queue/items_projectiles.prompt.md` |
| `ui_icons.png` | 128x128 | HUD Icons (Heart, Sword, Bomb, Boomerang, Key) | `nanobanana/queue/ui_icons.prompt.md` |

## Code Tasks (Jules)
1. **Implement `InventoryComponent`**:
   - `addItem(id, count)`, `useItem(id)`, `equipItem(id)`.
2. **Implement `InventoryPanel`**:
   - Grid view of items.
   - Selection logic updates `Player.equippedItemId`.
3. **Implement `Bomb` Entity**:
   - Timer logic.
   - Explosion hitbox verification (Area of Effect).
   - Interaction with `BombableWall` (from Phase 4 or new).
4. **Implement `Boomerang` Entity**:
   - Bezier or simple forward-return movement.
   - Collision with Enemy (Stun) and Switch (Toggle).

## Acceptance Criteria
- [ ] Picking up an item adds it to Inventory UI.
- [ ] Equipping Bomb and pressing Use spawns a Bomb.
- [ ] Bomb explodes after ~3s, hurting enemies.
- [ ] Boomerang flies out and returns to player.
- [ ] Boomerang stuns enemies (mock stun if needed) and triggers Switches.
