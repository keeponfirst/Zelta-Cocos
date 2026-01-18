/**
 * SaveMigrator - 存檔版本遷移
 * 
 * 處理不同版本存檔的遷移
 */

import { SaveData } from './SaveSystem';

interface Migration {
    fromVersion: string;
    toVersion: string;
    migrate: (data: any) => any;
}

const migrations: Migration[] = [
    {
        fromVersion: '1.0.0',
        toVersion: '1.1.0',
        migrate: (data: any) => {
            // 範例: 新增 maxHp 欄位
            if (!data.player.maxHp) {
                data.player.maxHp = 6;
            }
            return data;
        },
    },
    // 未來版本遷移在此新增
];

export class SaveMigrator {
    /**
     * 遷移存檔到目標版本
     */
    public static migrate(data: SaveData, targetVersion: string): SaveData {
        let currentData = { ...data };
        let currentVersion = data.version;

        // 找出需要的遷移路徑
        while (currentVersion !== targetVersion) {
            const migration = migrations.find(m => m.fromVersion === currentVersion);

            if (!migration) {
                console.warn(`No migration path from ${currentVersion} to ${targetVersion}`);
                break;
            }

            console.log(`Migrating save from ${migration.fromVersion} to ${migration.toVersion}`);
            currentData = migration.migrate(currentData);
            currentVersion = migration.toVersion;
            currentData.version = currentVersion;
        }

        return currentData as SaveData;
    }

    /**
     * 檢查是否需要遷移
     */
    public static needsMigration(data: SaveData, targetVersion: string): boolean {
        return data.version !== targetVersion;
    }
}
