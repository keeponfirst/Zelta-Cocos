import { director } from 'cc';

/**
 * SceneRouter - 場景路由
 *
 * 集中管理場景切換，避免硬編碼字串
 */
export class SceneRouter {

    /**
     * 載入選單場景
     */
    public static loadMenu(): void {
        director.loadScene('menu');
    }

    /**
     * 載入世界地圖場景
     */
    public static loadWorld(): void {
        director.loadScene('world');
    }

    /**
     * 載入地牢場景
     * @param dungeonId 地牢 ID (e.g. '01')
     */
    public static loadDungeon(dungeonId: string): void {
        const sceneName = `dungeon_${dungeonId}`;
        director.loadScene(sceneName);
    }

    /**
     * 載入啟動場景
     */
    public static loadBoot(): void {
        director.loadScene('boot');
    }
}
