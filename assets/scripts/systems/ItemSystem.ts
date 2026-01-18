import { _decorator, Component, Node, Prefab, resources, instantiate } from 'cc';
import { Player } from '../gameplay/entity/Player';

const { ccclass, property } = _decorator;

@ccclass('ItemSystem')
export class ItemSystem extends Component {
    private static _instance: ItemSystem | null = null;

    public static getInstance(): ItemSystem {
        if (!ItemSystem._instance) {
            ItemSystem._instance = new ItemSystem();
        }
        return ItemSystem._instance;
    }

    public useItem(itemId: string, user: Node): void {
        switch (itemId) {
            case 'bomb':
                this.useBomb(user as Player);
                break;
            case 'boomerang':
                this.useBoomerang(user as Player);
                break;
        }
    }

    private useBomb(user: Player): void {
        resources.load('prefabs/items/bomb', Prefab, (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            const bomb = instantiate(prefab);
            bomb.setWorldPosition(user.node.worldPosition);
            user.node.parent.addChild(bomb);
        });
    }

    private useBoomerang(user: Player): void {
        resources.load('prefabs/items/boomerang', Prefab, (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            const boomerang = instantiate(prefab);
            boomerang.setWorldPosition(user.node.worldPosition);
            user.node.parent.addChild(boomerang);
            boomerang.getComponent('Boomerang').init(user);
        });
    }
}
