# plans/phase3_enemy.md

## Feature Overview
Implement the Enemy System, introducing 3 enemy types (Slime, Skeleton, Bat) with distinct behaviors, combat interactions, and drop logic. This phase makes the world dangerous and interactive.

## Phase 3 ASSETS ✓
- [x] slime.png, skeleton.png, bat.png - Generated via Nano Banana

## Technical Design
- **Entity**: `Enemy.ts` loads attributes from `enemies.json` (HP, Attack, Speed).
- **AI**: `AIComponent.ts` implements a state machine:
  - **Idle**: Wait or wobble in place.
  - **Patrol**: Move between random points or waypoints.
  - **Chase**: Detect player within range and move towards them.
  - **Attack**: Trigger attack when in range (for Skeleton).
- **Combat**: 
  - Player weapons (Sword) trigger `takeDamage` on Enemies.
  - Enemy collision/attacks trigger `takeDamage` on Player.
  - Knockback applied on hit.
- **Drops**: `ItemDrop.ts` system to spawn items (Heart, Rupees) on enemy death based on probability.

## Asset Requirements (Nano Banana)
| Filename | Size | Purpose | Prompt File |
|----------|------|---------|-------------|
| `slime.png` | 32x32 frames | Slime enemy sprite sheet | `nanobanana/queue/slime.prompt.md` |
| `skeleton.png` | 32x32 frames | Skeleton enemy sprite sheet | `nanobanana/queue/skeleton.prompt.md` |
| `bat.png` | 32x32 frames | Bat enemy sprite sheet | `nanobanana/queue/bat.prompt.md` |

## Code Tasks (Jules) ✓
1. **Enhance `Enemy.ts`**: Complete initialization from JSON data and connect AI/Combat components.
2. **Implement `AIComponent.ts`**:
   - `Slime`: Idle <-> Patrol (Random movement).
   - `Bat`: Idle <-> Chase (Flying, ignores obstacles).
   - `Skeleton`: Patrol <-> Chase <-> Attack.
3. **Combat Integration**:
   - Implement `checkCollision` in `CombatComponent` or `MovementComponent` to detect entity overlap.
   - Implement `knockback` logic in `MovementComponent`.
4. **Implement `ItemDrop.ts`**: Spawn drop on `Enemy.onDeath`.

## Acceptance Criteria
- [x] Slimes wander randomly and damage player on contact.
- [x] Bats fly towards player when detected.
- [x] Skeletons patrol and chase player.
- [x] Player can kill enemies with sword (visual feedback + HP reduction).
- [x] Enemies drop items upon death.
