Implement Polish features: HUD, AudioSystem, DebugPanel.

Files to modify/create:

1.  `assets/scripts/systems/AudioSystem.ts`:
    -   `playSFX(path: string)`: Load `AudioClip` from resources and play.
        -   Path examples: 'audio/mp3/attack/attack1', 'audio/mp3/utility/utility1'.
    -   `playBGM(path: string)`: Loop music.
        -   Path example: 'audio/music'.
    -   Store `volumeSFX` and `volumeMusic`.

2.  `assets/scripts/ui/HUD.ts`:
    -   Bindings: `heartsContainer` (Node), `rupeeLabel` (Label), `itemIcon` (Sprite).
    -   `updateHearts(current, max)`: Instantiate/Update heart prefabs (Full/Half/Empty state) inside container.
    -   Events: Listen for `HP_CHANGE` and `INVENTORY_CHANGE`.

3.  `assets/scripts/ui/DebugPanel.ts`:
    -   Prefab with "Close" button and list of Action buttons.
    -   `onBtnHeal()`: `Player.heal(99)`.
    -   `onBtnGodMode()`: Toggle `Player.isInvincible`.
    -   `onBtnAddRupee()`: `Inventory.addRupee(100)`.
    -   Hidden by default, toggle with key '`' (Backquote) or specific corner tap.

4.  `assets/scripts/gameplay/CameraFollow.ts` (if missing or needs update):
    -   Smooth lerp follow target (Player).
    -   Clamp to Room bounds (get bounds from `RoomManager`).

Dependencies:
- Use `ui_skin.png` for panel backgrounds.
- Use `ui_icons.png` for hearts in HUD.
- Use `audio/` files for Sound Effects.
