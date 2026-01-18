# Zelta-Cocos 開發任務清單

## Phase 0: 專案設置

### 0.1 初始化 Cocos 專案
- **目標**: 建立 Cocos Creator 3.x TypeScript 專案
- **檔案**: 專案根目錄
- **驗收標準**: 
  - [ ] `npm install` 成功
  - [ ] Cocos Creator 可開啟專案
- **測試**: 開啟專案無錯誤

### 0.2 建立目錄結構
- **目標**: 建立完整 scripts/data/scenes 結構
- **檔案**: 
  - `assets/scripts/core/`
  - `assets/scripts/systems/`
  - `assets/scripts/gameplay/entity/`
  - `assets/scripts/gameplay/world/`
  - `assets/scripts/ui/`
  - `assets/data/schemas/`
  - `assets/data/tables/`
- **驗收標準**: 
  - [ ] 所有目錄存在
  - [ ] 佔位 .ts 檔案建立
- **測試**: 目錄結構符合架構文件

---

## Phase 1: 核心框架

### 1.1 EventBus 實作
- **目標**: 全局事件匯流排
- **檔案**: `assets/scripts/core/EventBus.ts`
- **驗收標準**:
  - [ ] Singleton 模式
  - [ ] on(event, callback) 註冊事件
  - [ ] off(event, callback) 移除事件
  - [ ] emit(event, ...args) 觸發事件
  - [ ] once(event, callback) 一次性事件
- **測試**: Unit test 覆蓋所有 API

### 1.2 Entity & Component
- **目標**: Entity-Component 基類
- **檔案**: 
  - `assets/scripts/core/Entity.ts`
  - `assets/scripts/core/Component.ts`
- **驗收標準**:
  - [ ] Entity 可新增 Component
  - [ ] Entity 可移除 Component
  - [ ] Entity 可取得指定 Component
  - [ ] Component 有 update() 生命週期
- **測試**: 建立測試 Entity + Component

### 1.3 ObjectPool
- **目標**: 泛型物件池
- **檔案**: `assets/scripts/core/ObjectPool.ts`
- **驗收標準**:
  - [ ] get() 取得物件
  - [ ] release() 回收物件
  - [ ] prewarm() 預熱
  - [ ] 無記憶體洩漏
- **測試**: 壓力測試 1000 次 get/release

### 1.4 DataManager
- **目標**: JSON 資料載入與管理
- **檔案**: `assets/scripts/core/DataManager.ts`
- **驗收標準**:
  - [ ] 載入 items.json
  - [ ] 載入 enemies.json
  - [ ] 依 ID 查詢資料
  - [ ] 型別安全
- **測試**: 載入所有 tables/*.json

---

## Phase 2: 玩家系統

### 2.1 Player Entity
- **目標**: 玩家實體 + 移動
- **檔案**: `assets/scripts/gameplay/entity/Player.ts`
- **驗收標準**:
  - [ ] 8 方向移動
  - [ ] 移動速度可配置
  - [ ] 碰撞停止
- **測試**: WASD 移動流暢

### 2.2 InputSystem
- **目標**: 輸入抽象層
- **檔案**: 
  - `assets/scripts/systems/InputSystem.ts`
  - `assets/scripts/ui/VirtualJoystick.ts`
- **驗收標準**:
  - [ ] 鍵盤輸入
  - [ ] 虛擬搖桿輸入
  - [ ] 統一輸入介面
- **測試**: PC/Mobile 皆可操作

### 2.3 Player Combat
- **目標**: 玩家攻擊
- **檔案**: `assets/scripts/gameplay/components/CombatComponent.ts`
- **驗收標準**:
  - [ ] 揮劍動作
  - [ ] 攻擊判定區域
  - [ ] 攻擊冷卻
- **測試**: 按攻擊鍵正確揮劍

### 2.4 Player Health
- **目標**: 玩家血量系統
- **檔案**: `assets/scripts/gameplay/components/HealthComponent.ts`
- **驗收標準**:
  - [ ] HP / MaxHP
  - [ ] takeDamage() 受傷
  - [ ] heal() 回復
  - [ ] 無敵時間
  - [ ] 受傷閃爍
- **測試**: 受傷後閃爍 + 無敵

---

## Phase 3: 敵人系統

### 3.1 Enemy Entity
- **目標**: 敵人基類
- **檔案**: `assets/scripts/gameplay/entity/Enemy.ts`
- **驗收標準**:
  - [ ] 繼承 Entity
  - [ ] 從 enemies.json 讀取屬性
  - [ ] 包含 Health/Combat/AI 元件
- **測試**: 生成 Slime

### 3.2 AI Component
- **目標**: 敵人 AI 行為
- **檔案**: `assets/scripts/gameplay/components/AIComponent.ts`
- **驗收標準**:
  - [ ] Idle 待機
  - [ ] Patrol 巡邏
  - [ ] Chase 追擊
  - [ ] 可配置偵測範圍
- **測試**: 接近敵人會追擊

### 3.3 Combat Integration
- **目標**: 戰鬥系統整合
- **檔案**: `assets/scripts/gameplay/CombatSystem.ts`
- **驗收標準**:
  - [ ] 玩家攻擊敵人造成傷害
  - [ ] 敵人碰撞玩家造成傷害
  - [ ] 擊退效果
- **測試**: 互相可造成傷害

### 3.4 Enemy Drops
- **目標**: 敵人掉落
- **檔案**: `assets/scripts/gameplay/entity/ItemDrop.ts`
- **驗收標準**:
  - [ ] 死亡時依機率掉落
  - [ ] 掉落物可拾取
  - [ ] 物件池管理
- **測試**: 殺敵有愛心掉落

---

## Phase 4: 世界系統

### 4.1 RoomManager
- **目標**: 房間管理
- **檔案**: `assets/scripts/gameplay/world/RoomManager.ts`
- **驗收標準**:
  - [ ] 載入房間
  - [ ] 切換房間
  - [ ] 發送 ROOM_ENTER/EXIT 事件
- **測試**: 房間切換平順

### 4.2 Door
- **目標**: 門系統
- **檔案**: `assets/scripts/gameplay/world/Door.ts`
- **驗收標準**:
  - [ ] 普通門自動開
  - [ ] 戰鬥門清敵後開
  - [ ] 鑰匙門消耗鑰匙
  - [ ] Boss 門特殊處理
- **測試**: 各種門行為正確

### 4.3 Triggers
- **目標**: 觸發器系統
- **檔案**: 
  - `assets/scripts/gameplay/world/triggers/TriggerBase.ts`
  - `assets/scripts/gameplay/world/triggers/PressurePlate.ts`
  - `assets/scripts/gameplay/world/triggers/Switch.ts`
- **驗收標準**:
  - [ ] 壓力板踩踏觸發
  - [ ] 開關攻擊切換
  - [ ] 連動門/機關
- **測試**: 觸發器連動正確

### 4.4 Chest
- **目標**: 寶箱系統
- **檔案**: `assets/scripts/gameplay/world/Chest.ts`
- **驗收標準**:
  - [ ] 互動開啟
  - [ ] 發放道具
  - [ ] 不可重複開啟
  - [ ] 狀態持久化
- **測試**: 開寶箱得道具

---

## Phase 5: 道具系統

### 5.1 Inventory
- **目標**: 背包系統
- **檔案**: `assets/scripts/gameplay/components/InventoryComponent.ts`
- **驗收標準**:
  - [ ] 新增道具
  - [ ] 移除道具
  - [ ] 堆疊上限
  - [ ] 裝備切換
- **測試**: 背包操作正確

### 5.2 Item Effects
- **目標**: 道具效果實作
- **檔案**: 
  - `assets/scripts/gameplay/items/KeyItem.ts`
  - `assets/scripts/gameplay/items/BombItem.ts`
  - `assets/scripts/gameplay/items/BoomerangItem.ts`
- **驗收標準**:
  - [ ] 鑰匙開門
  - [ ] 炸彈炸牆
  - [ ] 迴力鏢暈眩 + 觸發開關
- **測試**: 各道具功能正常

### 5.3 Inventory UI
- **目標**: 背包介面
- **檔案**: `assets/scripts/ui/InventoryPanel.ts`
- **驗收標準**:
  - [ ] 顯示道具列表
  - [ ] 選擇道具裝備
  - [ ] 使用道具
- **測試**: UI 操作流暢

---

## Phase 6: 存檔系統

### 6.1 SaveSystem
- **目標**: 存讀檔功能
- **檔案**: `assets/scripts/systems/SaveSystem.ts`
- **驗收標準**:
  - [ ] 手動存檔
  - [ ] 自動存檔
  - [ ] 讀檔還原
  - [ ] 多槽位支援
- **測試**: 關閉重開資料保留

### 6.2 SaveMigrator
- **目標**: 存檔版本遷移
- **檔案**: `assets/scripts/systems/SaveMigrator.ts`
- **驗收標準**:
  - [ ] 版本檢測
  - [ ] 遞進遷移
  - [ ] 遷移失敗處理
- **測試**: 舊版存檔正確遷移

---

## Phase 7: 打磨發布

### 7.1 HUD
- **目標**: 遊戲 HUD
- **檔案**: `assets/scripts/ui/HUD.ts`
- **驗收標準**:
  - [ ] 血量顯示
  - [ ] 當前道具顯示
  - [ ] 鑰匙/炸彈數量
- **測試**: 即時更新狀態

### 7.2 Debug Panel
- **目標**: 開發除錯面板
- **檔案**: `assets/scripts/ui/DebugPanel.ts`
- **驗收標準**:
  - [ ] God Mode 切換
  - [ ] 新增道具
  - [ ] 跳轉房間
  - [ ] 顯示碰撞框
  - [ ] Release 版隱藏
- **測試**: 所有功能可用

### 7.3 AudioSystem
- **目標**: 音效系統
- **檔案**: `assets/scripts/systems/AudioSystem.ts`
- **驗收標準**:
  - [ ] BGM 播放/切換
  - [ ] SFX 播放
  - [ ] 音量控制
- **測試**: 音效正確觸發

### 7.4 Final Polish
- **目標**: 最終打磨
- **驗收標準**:
  - [ ] QA Checklist 全部通過
  - [ ] 無 Console 錯誤
  - [ ] 效能達標
- **測試**: 完整通關測試

---

*文件版本: 1.0*
*創建日期: 2026-01-18*
