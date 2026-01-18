import { _decorator, Component, Node, Vec3, view } from 'cc';
import { RoomManager } from './world/RoomManager';

const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    public target: Node | null = null;

    @property
    public smoothSpeed: number = 0.125;

    private _offset: Vec3 = new Vec3();
    private _desiredPosition: Vec3 = new Vec3();
    private _smoothedPosition: Vec3 = new Vec3();

    protected lateUpdate(dt: number): void {
        if (!this.target) {
            return;
        }

        this._desiredPosition.set(this.target.position);
        Vec3.lerp(this._smoothedPosition, this.node.position, this._desiredPosition, this.smoothSpeed);
        this.node.position = this._smoothedPosition;

        this.clampToRoomBounds();
    }

    private clampToRoomBounds(): void {
        const room = RoomManager.getInstance()?.getCurrentRoom();
        if (!room) {
            return;
        }

        const camera = this.getComponent('cc.Camera');
        if (!camera) {
            return;
        }

        const visibleSize = view.getVisibleSize();
        const halfWidth = visibleSize.width / 2;
        const halfHeight = visibleSize.height / 2;

        const roomBounds = room.getRoomBounds();

        const minX = roomBounds.x + halfWidth;
        const maxX = roomBounds.x + roomBounds.width - halfWidth;
        const minY = roomBounds.y + halfHeight;
        const maxY = roomBounds.y + roomBounds.height - halfHeight;

        const currentPos = this.node.position;
        currentPos.x = Math.max(minX, Math.min(maxX, currentPos.x));
        currentPos.y = Math.max(minY, Math.min(maxY, currentPos.y));

        this.node.position = currentPos;
    }
}
