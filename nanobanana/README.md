# Nano Banana Asset Prompts

本目錄包含用於 AI 圖片生成的提示詞。這些提示詞設計用於 Nano Banana CLI、Midjourney、DALL-E 或其他 AI 圖片生成工具。

## 目錄結構

```
nanobanana/
├── README.md           # 本說明文件
└── prompts/
    ├── player.txt      # 玩家角色
    ├── enemies/        # 敵人角色
    │   ├── slime.txt
    │   ├── skeleton.txt
    │   └── bat.txt
    ├── ui_icons/       # UI 圖示
    │   ├── heart.txt
    │   ├── key.txt
    │   ├── bomb.txt
    │   ├── boomerang.txt
    │   ├── sword.txt
    │   └── menu.txt
    └── tilesets/       # 地圖圖塊
        ├── overworld_moodboard.txt
        └── dungeon_moodboard.txt
```

## 使用方式

### 方法 1: Nano Banana CLI

```bash
# 安裝 Nano Banana
npm install -g nanobanana-cli

# 批次生成
for file in prompts/**/*.txt; do
  nanobanana generate --prompt "$(cat $file)" --output "generated/$(basename $file .txt).png"
done
```

### 方法 2: 手動生成

1. 開啟你偏好的 AI 圖片生成工具
2. 複製 prompts/ 目錄下的提示詞
3. 生成圖片並儲存到 `generated/` 目錄
4. 將圖片匯入 Cocos Creator 專案

## 風格指南

所有資源應遵循以下風格：

- **風格**: 16-bit 像素風格，類似 SNES 時代薩爾達
- **調色板**: 有限色彩，每個 sprite 約 8-16 色
- **解析度**: 
  - 角色: 32x32 或 64x64 像素
  - 圖塊: 16x16 像素
  - UI 圖示: 16x16 或 24x24 像素
- **朝向**: 4 方向 (上/下/左/右)

## 動畫幀需求

| 資源類型 | 幀數 | 說明 |
|----------|------|------|
| 玩家待機 | 2 | 輕微呼吸動作 |
| 玩家行走 | 4 | 每方向 4 幀 |
| 玩家攻擊 | 3 | 揮劍動作 |
| 敵人待機 | 2 | 待機動畫 |
| 敵人移動 | 4 | 移動動畫 |
| 敵人受傷 | 1 | 閃爍/變色 |

## 後處理步驟

1. 生成圖片後，使用像素藝術編輯器調整
2. 確保透明背景
3. 統一尺寸和調色板
4. 輸出為 PNG 格式
5. 創建 Sprite Sheet 或 Atlas

## 推薦工具

- **Aseprite** - 像素藝術編輯和動畫
- **TexturePacker** - Sprite sheet 打包
- **Piskel** - 線上像素藝術編輯器 (免費)

## 資源清單 Checklist

- [ ] 玩家角色 (4 方向 x 3 動作 x 4 幀)
- [ ] 史萊姆 (2 動作 x 2 幀)
- [ ] 骷髏兵 (3 動作 x 4 幀)
- [ ] 蝙蝠 (2 動作 x 2 幀)
- [ ] UI 圖示 x 6
- [ ] 大地圖圖塊集
- [ ] 地城圖塊集

---

*最後更新: 2026-01-18*
