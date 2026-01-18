
import { _decorator, Component, director } from 'cc';
import { SaveSystem } from '../systems/SaveSystem';

const { ccclass, property } = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {

    public onStartGame() {
        // Start a new game - typically load the world or the first dungeon
        // For this task: load world.scene or dungeon_01.scene.
        // We'll choose world.scene as the starting point for a new game usually.
        // But the prompt says "Buttons call a MenuController.ts script to load world.scene or dungeon_01.scene."
        // We can expose two methods or one.
        console.log('Starting new game...');
        director.loadScene('world');
    }

    public onContinueGame() {
        if (SaveSystem.getInstance()?.hasSave(0)) {
            console.log('Continuing game...');
            // Load save and determine where to go.
            // For now, we just load world.scene as well, or read from save where the player was.
            // But to keep it simple and fulfill the requirement "load world.scene or dungeon_01.scene":
            director.loadScene('world');
        } else {
            console.log('No save found.');
        }
    }

    public onLoadDungeon() {
        console.log('Loading dungeon...');
        director.loadScene('dungeon_01');
    }
}
