import { _decorator, Component, Node, Prefab, resources, instantiate, Sprite, SpriteFrame } from 'cc';
import { InventoryComponent } from '../gameplay/components/InventoryComponent';

const { ccclass, property } = _decorator;

@ccclass('InventoryPanel')
export class InventoryPanel extends Component {
    @property(Node)
    public grid: Node = null;

    @property(Prefab)
    public itemSlotPrefab: Prefab = null;

    private _inventory: InventoryComponent = null;

    public init(inventory: InventoryComponent): void {
        this._inventory = inventory;
        this.render();
    }

    public render(): void {
        this.grid.removeAllChildren();

        if (!this._inventory) {
            return;
        }

        const items = this._inventory.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemSlot = instantiate(this.itemSlotPrefab);
            this.grid.addChild(itemSlot);

            const sprite = itemSlot.getComponent(Sprite);
            resources.load('textures/ui_icons/spriteFrame', SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                sprite.spriteFrame = spriteFrame;
            });
        }
    }
}
