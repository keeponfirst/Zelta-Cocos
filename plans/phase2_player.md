# plans/phase2_player.md

## Feature Overview
Implement the complete Player System including movement, combat, input handling, and health management. This builds upon the existing scaffolding to create a fully playable character.

## Phase 2 ASSETS ✓
- [x] player.png - Generated via Nano Banana (32x32 frames)

## Technical Design
- **Entity**: `Player.ts` inherits from `Entity`.
- **Components**:
  - `MovementComponent`: Handles velocity, friction, and collision.
  - `CombatComponent`: Handles attack states, cooldowns, and hitboxes.
  - `HealthComponent`: Handles HP, invincibility frames, and death.
  - `InventoryComponent`: Manages equipment and items.
- **Input**: `InputSystem` unifies keyboard and virtual joystick events.
- **Visuals**: connect Sprite/Animation components to the Entity state.

## Asset Requirements (Nano Banana)
| Filename | Size | Purpose | Prompt File |
|----------|------|---------|-------------|
| `player.png` | 32x32 frames | Player sprite sheet (Idle, Walk, Attack) | `nanobanana/prompts/player.txt` |
| `sword.png` | 16x16 | Sword icon & weapon sprite | `nanobanana/prompts/ui_icons/sword.txt` |
| `heart.png` | 16x16 | Health UI icon | `nanobanana/prompts/ui_icons/heart.txt` |

## Code Tasks (Jules) ✓
- [x] **Implement `MovementComponent.ts`**: Add acceleration, friction, and wall sliding logic.
- [x] **Implement `InputSystem.ts`**: Ensure smooth 8-direction input mapping.
- [x] **Implement `Player.ts`**: Connect input to movement and state machine (Idle/Run).
- [x] **Implement `CombatComponent.ts`**: Add attack hitbox generation and cooldown logic.
- [x] **Implement `HealthComponent.ts`**: Add damage handling, invincibility flashing, and healing.

## Acceptance Criteria
- [x] Player can move in 8 directions with smooth acceleration/deceleration.
- [x] Player stops when hitting obstacles (collision placeholder).
- [x] Pressing Attack button triggers attack animation and cooldown.
- [x] Taking damage reduces HP and triggers temporary invincibility.
- [x] UI HUD updates when HP changes.
