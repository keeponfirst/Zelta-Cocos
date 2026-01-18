Implement the Player System mechanics.

Files to modify/create:
1. `assets/scripts/systems/InputSystem.ts`: Implement `getDirection()` returning Vector2, and `isButtonPressed(button)` methods. Support WASD/Arrow keys and map to unified input state.
2. `assets/scripts/gameplay/components/MovementComponent.ts`: Implement `update(dt)` to move entity based on velocity, apply friction, and basic collision detection (AABB check against `BoxCollider2D` if possible, otherwise just movement logic).
3. `assets/scripts/gameplay/entity/Player.ts`:
   - In `update(dt)`: Get input from `InputSystem`.
   - Pass input direction to `MovementComponent`.
   - Update Animation state (Idle vs Run) based on velocity.
   - Handle Attack input -> trigger `CombatComponent.attack()`.
4. `assets/scripts/gameplay/components/CombatComponent.ts`: Implement `attack()` which checks cooldown, sets `isAttacking` flag, and spawns a temporary hitbox (can be a log message for now).
