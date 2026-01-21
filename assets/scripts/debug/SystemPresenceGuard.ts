import { _decorator, Component } from 'cc';
import { ItemSystem } from '../systems/ItemSystem';
import { SaveSystem } from '../systems/SaveSystem';

const { ccclass } = _decorator;

@ccclass('SystemPresenceGuard')
export class SystemPresenceGuard extends Component {
    protected onLoad(): void {
        if (!ItemSystem.getInstance()) {
            console.warn('[SystemPresenceGuard] ItemSystem is missing from the scene.');
        }
        if (!SaveSystem.getInstance()) {
            console.warn('[SystemPresenceGuard] SaveSystem is missing from the scene.');
        }
    }
}
