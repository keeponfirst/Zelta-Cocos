import { _decorator, Component, Node, Vec3, tween } from 'cc';
import { Player } from '../entity/Player';
import { Damageable } from '../components/Damageable';

const { ccclass, property } = _decorator;

enum BoomerangState {
    Forward,
    Returning,
}

@ccclass('Boomerang')
export class Boomerang extends Component {
    @property
    public speed: number = 10;

    @property
    public distance: number = 5;

    @property
    public damage: number = 1;

    private _state: BoomerangState = BoomerangState.Forward;
    private _startPosition: Vec3 = new Vec3();
    private _targetPosition: Vec3 = new Vec3();
    private _player: Player = null;

    public init(player: Player): void {
        this._player = player;
        this._startPosition.set(this.node.worldPosition);
        this._targetPosition.set(this._startPosition.x + this.distance, this._startPosition.y, this._startPosition.z);
    }

    protected update(dt: number): void {
        if (this._state === BoomerangState.Forward) {
            const direction = this._targetPosition.subtract(this.node.worldPosition).normalize();
            this.node.translate(direction.multiplyScalar(this.speed * dt));

            if (Vec3.distance(this.node.worldPosition, this._startPosition) >= this.distance) {
                this._state = BoomerangState.Returning;
            }
        } else {
            const direction = this._player.node.worldPosition.subtract(this.node.worldPosition).normalize();
            this.node.translate(direction.multiplyScalar(this.speed * dt));

            if (Vec3.distance(this.node.worldPosition, this._player.node.worldPosition) < 1) {
                this.onReturn();
            }
        }
    }

    private onHit(target: Node): void {
        const damageable = target.getComponent(Damageable);
        if (damageable) {
            damageable.takeDamage(this.damage);
        }
        // TODO: Add logic for switches
    }

    private onReturn(): void {
        this.node.destroy();
    }
}
