import { _decorator, Component, Prefab, resources, instantiate, Node } from 'cc';
import { Damageable } from '../components/Damageable';

const { ccclass, property } = _decorator;

@ccclass('Bomb')
export class Bomb extends Component {
    @property
    public explosionRadius: number = 2;

    @property
    public explosionDuration: number = 0.5;

    @property
    public damage: number = 1;

    private _timer: number = 2;

    protected update(dt: number): void {
        this._timer -= dt;
        if (this._timer <= 0) {
            this.explode();
        }
    }

    private explode(): void {
        resources.load('prefabs/effects/explosion', Prefab, (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            const explosion = instantiate(prefab);
            explosion.setWorldPosition(this.node.worldPosition);
            this.node.parent.addChild(explosion);

            const colliders = this.getCollidersInRange();
            colliders.forEach(collider => {
                const damageable = collider.getComponent(Damageable);
                if (damageable) {
                    damageable.takeDamage(this.damage);
                }
                if (collider.name.includes('BombableWall')) {
                    collider.destroy();
                }
            });

            this.scheduleOnce(() => {
                explosion.destroy();
            }, this.explosionDuration);

            this.node.destroy();
        });
    }

    private getCollidersInRange(): Node[] {
        // This is a placeholder for a proper physics query
        const colliders: Node[] = [];
        const allNodes = this.node.scene.children;
        for (const node of allNodes) {
            if (node.getComponent(Damageable) || node.name.includes('BombableWall')) {
                if (this.node.position.subtract(node.position).length() < this.explosionRadius) {
                    colliders.push(node);
                }
            }
        }
        return colliders;
    }
}
