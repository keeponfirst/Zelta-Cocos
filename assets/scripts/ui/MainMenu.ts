import { _decorator, Component, Button } from 'cc';
import { SaveSystem } from '../systems/SaveSystem';

const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
    @property(Button)
    public continueButton: Button | null = null;

    protected start(): void {
        this.updateContinueButton();
    }

    private updateContinueButton(): void {
        if (this.continueButton) {
            this.continueButton.interactable = SaveSystem.getInstance()?.hasSave(0) ?? false;
        }
    }

    public onNewGame(): void {
        // Logic to start a new game
    }

    public onContinue(): void {
        // Logic to continue from a saved game
    }
}
