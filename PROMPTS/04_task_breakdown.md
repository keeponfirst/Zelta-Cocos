# 04 - 任務分解

## Phase 0: 專案設置
### 0.1 初始化 Cocos 專案
- **目標**: 建立 Cocos Creator 專案基礎
- **檔案**: 專案根目錄
- **驗收**: `npm run build` 成功

### 0.2 建立目錄結構
- **目標**: 建立 scripts/data/scenes 結構
- **檔案**: `assets/scripts/`, `assets/data/`, `assets/scenes/`
- **驗收**: 所有目錄存在

---

## Phase 1: 核心框架
### 1.1 EventBus
- **目標**: 實作事件匯流排
- **檔案**: `core/EventBus.ts`
- **驗收**: on/off/emit/once 測試通過

### 1.2 Entity & Component
- **目標**: 實作 Entity-Component 基類
- **檔案**: `core/Entity.ts`, `core/Component.ts`
- **驗收**: 可新增/移除/取得 Component

### 1.3 ObjectPool
- **目標**: 實作物件池
- **檔案**: `core/ObjectPool.ts`
- **驗收**: get/release 無記憶體洩漏

### 1.4 DataManager
- **目標**: JSON 資料載入器
- **檔案**: `core/DataManager.ts`
- **驗收**: 可載入 items.json

---

## Phase 2: 玩家系統
### 2.1 Player Entity
- **目標**: 玩家實體 + 基礎移動
- **檔案**: `gameplay/entity/Player.ts`
- **驗收**: WASD 可移動

### 2.2 InputSystem
- **目標**: 鍵盤 + 虛擬搖桿
- **檔案**: `systems/InputSystem.ts`, `ui/VirtualJoystick.ts`
- **驗收**: 手機/PC 皆可操作

### 2.3 Player Combat
- **目標**: 劍擊攻擊
- **檔案**: `gameplay/components/CombatComponent.ts`
- **驗收**: 按攻擊鍵揮劍

### 2.4 Player Health
- **目標**: 血量 + 受傷/無敵
- **檔案**: `gameplay/components/HealthComponent.ts`
- **驗收**: 受傷後閃爍無敵

---

## Phase 3: 敵人系統
### 3.1 Enemy Entity
- **目標**: 敵人基類
- **檔案**: `gameplay/entity/Enemy.ts`
- **驗收**: 可生成 Slime

### 3.2 AI Component
- **目標**: 巡邏/追擊 AI
- **檔案**: `gameplay/components/AIComponent.ts`
- **驗收**: 敵人會追玩家

### 3.3 Combat Integration
- **目標**: 玩家 vs 敵人傷害
- **檔案**: `gameplay/CombatSystem.ts`
- **驗收**: 互相可造成傷害

### 3.4 Enemy Drops
- **目標**: 掉落道具
- **檔案**: `gameplay/entity/ItemDrop.ts`
- **驗收**: 敵人死亡掉愛心

---

## Phase 4: 世界系統
### 4.1 RoomManager
- **目標**: 房間載入/切換
- **檔案**: `gameplay/world/RoomManager.ts`
- **驗收**: 可切換房間

### 4.2 Door
- **目標**: 門 + 鎖門邏輯
- **檔案**: `gameplay/world/Door.ts`
- **驗收**: 清敵後開門

### 4.3 Triggers
- **目標**: 壓力板/開關/火把
- **檔案**: `gameplay/world/triggers/*.ts`
- **驗收**: 觸發連動門

### 4.4 Chest
- **目標**: 寶箱互動
- **檔案**: `gameplay/world/Chest.ts`
- **驗收**: 開啟獲得道具

---

## Phase 5: 道具系統
### 5.1 Inventory
- **目標**: 背包系統
- **檔案**: `gameplay/components/InventoryComponent.ts`
- **驗收**: 可新增/使用道具

### 5.2 Item Effects
- **目標**: 鑰匙/炸彈/迴力鏢
- **檔案**: `gameplay/items/*.ts`
- **驗收**: 各道具功能正常

### 5.3 Inventory UI
- **目標**: 背包介面
- **檔案**: `ui/InventoryPanel.ts`
- **驗收**: 可選擇道具

---

## Phase 6: 存檔系統
### 6.1 SaveSystem
- **目標**: 存檔/讀檔
- **檔案**: `systems/SaveSystem.ts`
- **驗收**: 關閉重開資料保留

### 6.2 SaveMigrator
- **目標**: 版本遷移
- **檔案**: `systems/SaveMigrator.ts`
- **驗收**: 舊存檔可遷移

---

## Phase 7: 打磨發布
### 7.1 HUD
- **目標**: 血量/道具 UI
- **檔案**: `ui/HUD.ts`
- **驗收**: 顯示即時狀態

### 7.2 Debug Panel
- **目標**: 除錯工具
- **檔案**: `ui/DebugPanel.ts`
- **驗收**: 可跳房/加道具

### 7.3 Audio
- **目標**: 音效整合
- **檔案**: `systems/AudioSystem.ts`
- **驗收**: 攻擊/受傷有音效

### 7.4 Polish
- **目標**: 最終調整
- **驗收**: QA Checklist 通過

---
*文件版本: 1.0*
