import { _decorator, Component, director, Node } from 'cc';
import { DataManager } from './DataManager';
import { SceneRouter } from './SceneRouter';
import { AudioSystem } from '../systems/AudioSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { InputSystem } from '../systems/InputSystem';
import { DebugOverlay } from '../ui/DebugOverlay';

const { ccclass, property } = _decorator;

@ccclass('BootController')
export class BootController extends Component {

    start() {
        this.initializeGame();
    }

    private async initializeGame() {
        DebugOverlay.log('Booting game...');
        console.log('Booting game...');

        // 1. Initialize DataManager
        try {
            DebugOverlay.log('Initializing DataManager...');
            await DataManager.getInstance().init();
            DebugOverlay.log('Data loaded.');
            console.log('Data loaded.');
        } catch (e) {
            DebugOverlay.log('Failed to load data!');
            console.error('Failed to load data:', e);
        }

        // 2. Create Persistent Systems
        this.createPersistentSystems();

        // 3. Transition to menu with delay
        DebugOverlay.log('Transitioning to menu in 2s...');
        console.log('Transitioning to menu...');

        setTimeout(() => {
            DebugOverlay.log('Loading Menu Scene Now...');
            SceneRouter.loadMenu();
        }, 2000);
    }

    private createPersistentSystems() {
        // Check if systems root already exists (e.g. if we returned to boot scene)
        let systemsRoot = director.getScene()?.getChildByName('KOF_SystemsRoot');
        if (systemsRoot) {
            console.log('Systems root already exists.');
            return;
        }

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
