Generate `assets/scenes/Main.scene` and `assets/scripts/core/GameBootstrap.ts`.

Context:
This is the first scene. We need a script to bootstrap the entities because we can't easily edit scene files to attach existing components (no UUID access).

Tasks:

1.  **Create `assets/scripts/core/GameBootstrap.ts`**:
    -   Class `GameBootstrap` extends `Component`.
    -   **onLoad**:
        -   Ensure `InputSystem`, `AudioSystem`, `SaveSystem` instances exist (singleton access).
        -   Create **Player** Node:
            -   Add `Sprite` (use default white texture or load 'sprites/entities/player' if possible).
            -   Add `Player`, `MovementComponent`, `CombatComponent`.
            -   Set position `(0, 0, 0)`.
        -   Create **UI** Nodes:
            -   Instantiate `HUD` prefab (load from `prefabs/ui/HUD` if exists, otherwise create placeholder nodes).
        -   Initialize **World**:
            -   Call `RoomManager.getInstance().loadRoom('room_001')` (or 'start').
        -   Setup **Camera**:
            -   Find Main Camera.
            -   Add `CameraFollow` component (if exists) target = Player.

2.  **Create `assets/scenes/Main.scene`**:
    -   Generate a valid JSON content for a minimal Cocos Creator 3.x scene.
    -   **Hierarchy**:
        1.  `Scene`
        2.  `Canvas` (Node + Canvas Component + Widget)
            -   `Camera` (Node + Camera Component, ortho, height 640)
        3.  `Bootstrap` (Node) - *Intended to hold GameBootstrap*
    -   **Important**: Since we don't know the exact `__type__` UUID for `GameBootstrap`, you can try to leave it as a Node. The user will attach the script manually if needed. Or use a generic `cc.Component` placeholder if that's valid. **Prioritize a valid file format.**

3.  **Ensure directory exists**:
    -   `assets/scenes/`
