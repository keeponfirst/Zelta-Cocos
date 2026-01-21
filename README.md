# Zelta-Cocos

A Zelda-like 2D Action RPG built with Cocos Creator (TypeScript).

This repository serves as a live example and reference implementation for the **KeepOnFirst (KOF) Agentic Workflow**. It demonstrates how to structure, plan, and execute a complex game project using AI-assisted development patterns.

## 🚀 Project Overview

- **Engine**: Cocos Creator 3.x
- **Language**: TypeScript
- **Genre**: Top-down 2D Action RPG
- **Core Loop**: Explore overworld -> Enter dungeon -> Solve puzzles -> Defeat Boss -> Get Upgrade.

## 📊 Development Status

| Phase | Feature | Status | Notes |
|-------|---------|--------|-------|
| **0** | **Scaffolding** | ✅ Done | Project structure, schemas, base classes |
| **1** | **Core Framework** | ✅ Done | EventBus, Entity-Component system |
| **2** | **Player System** | ✅ Done | **Input**: Keyboard/Virtual Joystick<br>**Movement**: 8-way + collision<br>**Combat**: Attack logic & HP system |
| **3** | **Enemy System** | ✅ Done | Slime, Skeleton, Bat AI & behaviors |
| **4** | **World System** | ✅ Done | Room management, doors, triggers |
| **5** | **Item System** | ✅ Done | Inventory, bombs, boomerang |
| **6** | **Save System** | ✅ Done | Save/Load & migration |
| **7** | **Polish** | ✅ Done | HUD, Audio, QA |

## 📂 KOF Workflow Structure

This project follows the strict "App Factory" conventions:

- **`PROMPTS/`**: The "Brain" of the project. Contains `00_context.md`, `01_product_spec.md`, `02_architecture.md`, etc.
- **`TASK.md`**: Living document tracking execution progress from Phase 0 to Release.
- **`assets/data/`**: JSON schemas and data tables (Items, Enemies, Rooms) ensuring a data-driven design.
- **`nanobanana/`**: Structured prompts for AI asset generation (Sprites, Icons, Tilesets).
- **`assets/scripts/`**: Clean TypeScript architecture separated into Core, Systems, Gameplay, and UI.

## 🏗️ Architecture

The game uses an **Entity-Component** pattern with a global **EventBus**:

- **Core**: `Entity`, `Component`, `EventBus`, `ObjectPool`
- **Systems**: `InputSystem`, `SaveSystem`, `AudioSystem`
- **Data**: Data definitions in JSON, loaded via `DataManager`

## 📝 Dev Logs
- [2026-01-18: Code-First vs Scene-First (English)](records/2026-01-18_cocos_thoughts_en.md)
- [2026-01-18: Cocos Creator KOF 工作流心得 (中文)](records/2026-01-18_cocos_thoughts_zh.md)

## 🛠️ Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/keeponfirst/Zelta-Cocos.git
   ```
2. Open the project folder with **Cocos Creator 3.x**.
3. **Important:** Run the editor tool via menu `KOF > Validate Scenes` to ensure scene structure is correct.
4. Open `assets/scenes/boot.scene` to start. This is the configured Start Scene.

## 🧪 Debug: Save/Load Regression Check

- Add `SaveLoadRegressionCheck` to a scene node and enable **Run On Load** in the inspector.
- Press Play to run the check and review the Console logs for assertions.
- Remove or disable the component when finished.

---
*Built with ❤️ using the KeepOnFirst Workflow*
