
import { _decorator, Component, director, resources, JsonAsset } from 'cc';
import { DataManager } from './DataManager';

const { ccclass, property } = _decorator;

@ccclass('BootController')
export class BootController extends Component {

    start() {
        this.initializeGame();
    }

    private async initializeGame() {
        console.log('Booting game...');

        // Initialize DataManager
        try {
            console.log('Loading data...');
            // In a real scenario, we would wait for loadAll.
            // Since DataManager.loadAll is async but might need resources that are not yet loaded if we didn't preload,
            // we will just call it.
            await DataManager.getInstance().loadAll();
            console.log('Data loaded.');
        } catch (e) {
            console.error('Failed to load data:', e);
        }

        // Preload essential resources (placeholder)
        await this.preloadResources();

        // Transition to menu
        console.log('Transitioning to menu...');
        director.loadScene('menu');
    }

    private preloadResources(): Promise<void> {
        return new Promise((resolve) => {
            // Placeholder for preloading logic
            // e.g. resources.loadDir('prefabs', ...);
            setTimeout(resolve, 100);
        });
    }
}
