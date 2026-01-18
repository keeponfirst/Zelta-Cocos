
import { _decorator, Component, Node, Sprite, director, resources, Prefab, instantiate } from 'cc';
import { InputSystem } from '../../systems/InputSystem';
import { AudioSystem } from '../../systems/AudioSystem';
import { SaveSystem } from '../../systems/SaveSystem';
import { Player } from '../../gameplay/entity/Player';
import { MovementComponent } from '../../gameplay/components/MovementComponent';
import { CombatComponent } from '../../gameplay/components/CombatComponent';
import { RoomManager } from '../../gameplay/world/RoomManager';
import { CameraFollow } from '../../gameplay/CameraFollow';
import { HUD } from '../../ui/HUD';

const { ccclass, property } = _decorator;

@ccclass('GameBootstrap')
export class GameBootstrap extends Component {
    onLoad() {
        // Ensure singletons exist
        InputSystem.getInstance();
        AudioSystem.getInstance();
        SaveSystem.getInstance();

        // Create Player Node
        const playerNode = new Node('Player');
        playerNode.addComponent(Sprite); // Assuming a default white texture
        playerNode.addComponent(Player);
        playerNode.addComponent(MovementComponent);
        playerNode.addComponent(CombatComponent);
        playerNode.setPosition(0, 0, 0);
        director.getScene().addChild(playerNode);

        // Create UI Nodes
        resources.load('prefabs/ui/HUD', Prefab, (err, hudPrefab) => {
            if (err) {
                console.error('Failed to load HUD prefab:', err);
                // Create a placeholder HUD if the prefab fails to load
                const hudNode = new Node('HUD');
                hudNode.addComponent(HUD);
                director.getScene().addChild(hudNode);
                return;
            }
            const hud = instantiate(hudPrefab);
            director.getScene().addChild(hud);
        });

        // Initialize World
        RoomManager.getInstance().loadRoom('room_001');

        // Setup Camera
        const camera = director.getScene().getChildByName('Camera');
        if (camera) {
            const cameraFollow = camera.getComponent(CameraFollow) || camera.addComponent(CameraFollow);
            cameraFollow.target = playerNode;
        }
    }
}
