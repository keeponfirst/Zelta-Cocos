import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Damageable')
export class Damageable extends Component {
    @property
    public maxHealth: number = 1;

    private _health: number = 1;

    public takeDamage(damage: number): void {
        this._health -= damage;
        if (this._health <= 0) {
            this.node.destroy();
        }
    }
}
