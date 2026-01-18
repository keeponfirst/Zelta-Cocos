# 03 - 資料結構定義

## Schema 總覽

| Schema | 用途 | 檔案路徑 |
|--------|------|----------|
| Item | 道具定義 | `schemas/item.schema.json` |
| Enemy | 敵人定義 | `schemas/enemy.schema.json` |
| Room | 房間定義 | `schemas/room.schema.json` |
| Trigger | 觸發器定義 | `schemas/trigger.schema.json` |
| Quest | 任務定義 | `schemas/quest.schema.json` |
| Save | 存檔結構 | `schemas/save.schema.json` |

---

## Item Schema

```json
{
  "id": "string (unique)",
  "name": "string",
  "description": "string",
  "type": "consumable | equipment | key",
  "stackable": "boolean",
  "maxStack": "number (1-99)",
  "effect": {
    "type": "heal | damage | buff | unlock | explode | stun",
    "value": "number",
    "duration": "number (optional)"
  },
  "sprite": "string (resource path)",
  "rarity": "common | uncommon | rare"
}
```

---

## Enemy Schema

```json
{
  "id": "string (unique)",
  "name": "string",
  "hp": "number",
  "attack": "number",
  "speed": "number",
  "behavior": "idle | patrol | chase | fly",
  "drops": [
    { "itemId": "string", "chance": "number (0-1)" }
  ],
  "sprite": "string (resource path)",
  "hitbox": { "width": "number", "height": "number" }
}
```

---

## Room Schema

```json
{
  "id": "string (unique)",
  "name": "string",
  "size": { "width": "number", "height": "number" },
  "tilemap": "string (resource path)",
  "connections": {
    "north": { "roomId": "string", "doorType": "string" },
    "south": { "roomId": "string", "doorType": "string" },
    "east": { "roomId": "string", "doorType": "string" },
    "west": { "roomId": "string", "doorType": "string" }
  },
  "spawns": {
    "enemies": [
      { "enemyId": "string", "x": "number", "y": "number", "group": "string" }
    ],
    "items": [
      { "itemId": "string", "x": "number", "y": "number" }
    ]
  },
  "triggers": [
    { "triggerId": "string", "type": "string", "x": "number", "y": "number", "params": {} }
  ],
  "unlockCondition": {
    "type": "enemy_cleared | switch_all | item_used",
    "params": {}
  }
}
```

---

## Trigger Schema

```json
{
  "id": "string (unique)",
  "type": "pressure_plate | switch | torch | bombable_wall | chest",
  "linkedTo": ["string (door/trigger ids)"],
  "requiredItem": "string (optional)",
  "reward": { "itemId": "string", "count": "number" }
}
```

---

## Quest Schema

```json
{
  "id": "string (unique)",
  "name": "string",
  "description": "string",
  "objectives": [
    { "type": "kill | collect | reach", "target": "string", "count": "number" }
  ],
  "rewards": [
    { "itemId": "string", "count": "number" }
  ],
  "prerequisite": "string (questId, optional)"
}
```

---

## Save Schema

```json
{
  "version": "string (semver)",
  "timestamp": "number (unix ms)",
  "player": {
    "hp": "number",
    "maxHp": "number",
    "position": { "x": "number", "y": "number" },
    "currentRoom": "string"
  },
  "inventory": {
    "items": { "[itemId]": "number (count)" },
    "equipment": ["string (itemIds)"]
  },
  "world": {
    "chestsOpened": ["string (chestIds)"],
    "doorsUnlocked": ["string (doorIds)"],
    "triggersActivated": ["string (triggerIds)"]
  },
  "dungeon": {
    "currentDungeon": "string | null",
    "roomsCleared": ["string (roomIds)"],
    "bossDefeated": "boolean"
  }
}
```

---

## 版本遷移策略

```
v1.0.0 -> v1.1.0: 新增 player.maxHp
v1.1.0 -> v1.2.0: 新增 dungeon.bossDefeated
```

每個遷移函數接收舊版資料，回傳新版資料結構。

---
*文件版本: 1.0*
