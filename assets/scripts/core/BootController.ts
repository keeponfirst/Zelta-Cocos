import { _decorator, Component, director, Node } from 'cc';
import { DataManager } from './DataManager';
import { SceneRouter } from './SceneRouter';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { InputSystem } from '../systems/InputSystem';

const { ccclass, property } = _decorator;

@ccclass('BootController')
export class BootController extends Component {

    start() {
        this.initializeGame();
    }

    private async initializeGame() {
        console.log('Booting game...');

        // 1. Initialize DataManager
        try {
            await DataManager.getInstance().init();
            console.log('Data loaded.');
        } catch (e) {
            console.error('Failed to load data:', e);
        }

        // 2. Create Persistent Systems
        this.createPersistentSystems();

        // 3. Transition to menu
        console.log('Transitioning to menu...');
        SceneRouter.loadMenu();
    }

    private createPersistentSystems() {
        // Check if systems root already exists (e.g. if we returned to boot scene)
        let systemsRoot = director.getScene()?.getChildByName('KOF_SystemsRoot');
        if (systemsRoot) {
             console.log('Systems root already exists.');
             return;
        }

        // Check if it exists in persistent nodes (director.getScene() might not show persistent nodes directly depending on lifecycle)
        // director.addPersistRootNode adds it to the game's root, which is technically a sibling of the scene,
        // but accessible via director.
        // However, standard practice is to create it, add it, and checking if it exists is tricky if we don't keep a reference.
        // But since boot.scene is the entry point, we assume we do this once.
        // If we reload boot.scene, we should check.
        // The persistent root node stays in the scene graph but is not destroyed.

        // Actually, `director.addPersistRootNode` makes the node a child of `Director.root`.
        // It persists across scenes.

        // A common pattern is to have a Singleton to track initialization, or check if the node exists.
        // But since we can't easily query persistent nodes by name via `director` API directly without traversing,
        // we can rely on `AudioSystem.getInstance()` to check if systems are already up.

        if (AudioSystem.getInstance()) {
             console.log('Systems already initialized.');
             return;
        }

        systemsRoot = new Node('KOF_SystemsRoot');

        // Add Systems
        systemsRoot.addComponent(AudioSystem);
        systemsRoot.addComponent(SaveSystem);
        systemsRoot.addComponent(InputSystem);

        director.addPersistRootNode(systemsRoot);
        console.log('Persistent Systems Initialized.');
    }
}
