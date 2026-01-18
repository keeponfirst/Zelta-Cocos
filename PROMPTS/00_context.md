# 00 - 專案背景與概述

## 專案名稱
**Zelta-Cocos** - 類薩爾達 2D 俯視角動作 RPG

## 專案目標
使用 Cocos Creator (TypeScript) 開發一款具備完整遊戲循環的類薩爾達遊戲，包含：
- 大地圖探索 (Overworld)
- 地城房間制闖關 (Dungeon)
- 即時動作戰鬥 (Sword Combat)
- 道具解謎機制 (Item-gated Puzzles)
- 存檔系統 (Save System)

## 核心玩法特色

### 戰鬥系統
- 劍擊攻擊 + 受傷/無敵/擊退機制
- 敵人 AI 巡邏與追擊行為
- 傷害計算與碰撞偵測

### 地城設計
- 房間制地城，進入後鎖門
- 清除敵人後解鎖門
- 寶箱與道具收集

### 道具解謎
| 道具 | 功能 |
|------|------|
| 鑰匙 (Key) | 開啟鎖住的門 |
| 炸彈 (Bomb) | 炸開牆壁/開關 |
| 迴力鏢 (Boomerang) | 暈眩敵人 + 遠端觸發開關 |

### 解謎元素
- 推箱子 (Push Block)
- 壓力板 (Pressure Plate)
- 火把謎題 (Torch Puzzle)
- 尖刺陷阱 (Spike Trap)

## 技術選型

### 引擎
- **Cocos Creator 3.x** (TypeScript)

### 架構模式
- Entity-Component 風格
- EventBus 事件驅動
- 資料驅動設計 (JSON Tables)

### 目標平台
- Mobile-first (iOS / Android)
- 支援觸控操作
- 效能優化 (Object Pool, 避免 GC Spike)

## 開發原則

### KOF Workflow 遵循
1. **Prompt-first Planning** - 先完成規劃文件
2. **Task-driven Development** - 任務驅動開發
3. **Data-driven Design** - 資料驅動設計
4. **Commit-ready Output** - 可直接提交的產出

### 品質標準
- 無模糊任務描述
- 每個任務必須指定目標檔案與驗收標準
- 所有資料定義使用 JSON Schema

## 專案結構預覽

```
Zelta-Cocos/
├── PROMPTS/                    # 規劃文件
│   ├── 00_context.md
│   ├── 01_product_spec.md
│   ├── 02_architecture.md
│   ├── 03_data_schemas.md
│   ├── 04_task_breakdown.md
│   ├── 05_qa_checklist.md
│   └── 06_release_plan.md
├── TASK.md                     # 開發任務清單
├── assets/
│   ├── data/
│   │   ├── schemas/           # JSON Schema 定義
│   │   └── tables/            # 遊戲資料表
│   ├── scripts/
│   │   ├── core/              # 核心框架
│   │   ├── systems/           # 遊戲系統
│   │   ├── gameplay/
│   │   │   ├── entity/        # 實體類別
│   │   │   └── world/         # 世界/房間邏輯
│   │   └── ui/                # UI 元件
│   └── scenes/                # 場景檔案
└── nanobanana/                # 美術資源生成
    ├── README.md
    └── prompts/               # AI 圖片生成提示詞
```

## 里程碑概覽

| Phase | 名稱 | 產出 |
|-------|------|------|
| 0 | 專案設置 | Cocos 專案 + 基礎框架 |
| 1 | 核心系統 | Entity, EventBus, InputSystem |
| 2 | 玩家系統 | Player Movement + Combat |
| 3 | 敵人系統 | Enemy AI + 傷害系統 |
| 4 | 世界系統 | Room + Door + Trigger |
| 5 | 道具系統 | Inventory + Item Effects |
| 6 | 存檔系統 | Save/Load + Migration |
| 7 | 打磨發布 | Debug Panel + QA + Release |

## 參考遊戲
- The Legend of Zelda: A Link to the Past
- The Legend of Zelda: Link's Awakening
- Cadence of Hyrule
- Binding of Isaac (房間制設計)

---
*文件版本: 1.0*
*創建日期: 2026-01-18*
