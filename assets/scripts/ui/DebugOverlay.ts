import { _decorator, Component, Node, Label, Color, director, UITransform, Canvas } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DebugOverlay')
export class DebugOverlay extends Component {
    private static _instance: DebugOverlay | null = null;
    private _label: Label | null = null;
    private _lines: string[] = [];

    public static getInstance(): DebugOverlay {
        if (!this._instance) {
            const node = new Node('DebugOverlay');
            this._instance = node.addComponent(DebugOverlay);

            // Ensure we attach to a Canvas
            let canvas = director.getScene()?.getComponentInChildren(Canvas);
            if (!canvas) {
                // Creates a fallback canvas if none exists (extreme fallback)
                const canvasNode = new Node('FallbackCanvas');
                canvas = canvasNode.addComponent(Canvas);
                director.getScene()?.addChild(canvasNode);
            }
            if (canvas) {
                canvas.node.addChild(node);
            } else {
                director.getScene()?.addChild(node);
            }

            director.addPersistRootNode(node);
        }
        return this._instance;
    }

    public static log(msg: string) {
        this.getInstance().addLog(msg);
    }

    onLoad() {
        if (DebugOverlay._instance && DebugOverlay._instance !== this) {
            this.node.destroy();
            return;
        }
        DebugOverlay._instance = this;
        this.setupUI();
    }

    private setupUI() {
        // Setup Node
        this.node.layer = 1073741824; // UI_2D layer
        const uiTrans = this.node.addComponent(UITransform);
        uiTrans.setContentSize(400, 300);

        // Setup Label
        this._label = this.node.addComponent(Label);
        this._label.string = "Debug Overlay Initialized";
        this._label.fontSize = 20;
        this._label.lineHeight = 24;
        this._label.color = Color.YELLOW;
        this._label.isBold = true;

        // Position top-left ish
        this.node.setPosition(0, 0, 0);
    }

    public addLog(msg: string) {
        console.log(`[DebugOverlay] ${msg}`);
        this._lines.push(msg);
        if (this._lines.length > 10) {
            this._lines.shift();
        }

        if (this._label) {
            this._label.string = this._lines.join('\n');
        }
    }
}
