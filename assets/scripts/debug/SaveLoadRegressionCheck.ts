import { _decorator, Component, find, sys } from 'cc';
import { InventoryComponent } from '../gameplay/components/InventoryComponent';
import { SaveSystem } from '../systems/SaveSystem';

const { ccclass, property } = _decorator;
const SAVE_KEY = 'zelta_save';

@ccclass('SaveLoadRegressionCheck')
export class SaveLoadRegressionCheck extends Component {
    @property
    public runOnLoad: boolean = false;

    protected onLoad(): void {
        if (this.runOnLoad) {
            this.run();
        }
    }

    private run(): void {
        const saveSystem = SaveSystem.getInstance();
        if (!saveSystem) {
            console.warn('[SaveLoadRegressionCheck] SaveSystem not found.');
            return;
        }

        const inventory = find('Player')?.getComponent(InventoryComponent);
        const legacySlot = 998;
        const partialSlot = 999;
        const legacyData = {
            version: '1.0.0',
            timestamp: Date.now(),
            player: { hp: 1, maxHp: 1, position: { x: 0, y: 0 } },
            inventory: { items: [], equippedIndex: -1 },
            world: { currentRoomId: 'debug', clearedRooms: [] },
        };
        const partialData = {
            version: '1.0.0',
            timestamp: Date.now(),
            player: { hp: 1, maxHp: 1 },
            inventory: { items: [], equippedIndex: -1, rupees: 5 },
            world: { currentRoomId: 'debug' },
        };

        sys.localStorage.setItem(`${SAVE_KEY}_${legacySlot}`, JSON.stringify(legacyData));
        sys.localStorage.setItem(`${SAVE_KEY}_${partialSlot}`, JSON.stringify(partialData));

        try {
            saveSystem.load(legacySlot);
            if (inventory && inventory.rupees !== 0) {
                console.error('[SaveLoadRegressionCheck] Expected legacy rupees to default to 0.');
            }
            saveSystem.load(partialSlot);
            console.log('[SaveLoadRegressionCheck] Save/load regression check completed.');
        } catch (error) {
            console.error('[SaveLoadRegressionCheck] Unexpected error during load.', error);
        } finally {
            sys.localStorage.removeItem(`${SAVE_KEY}_${legacySlot}`);
            sys.localStorage.removeItem(`${SAVE_KEY}_${partialSlot}`);
        }
    }
}
