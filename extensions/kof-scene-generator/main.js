
'use strict';

module.exports = {
    methods: {
        async generateBaseScenes() {
            console.log('[KOF] Starting Scene Generation...');

            // Ensure assets/scenes directory exists
            // We can't easily check existence with simple API without filesystem,
            // but we can try to create it or assume it exists.
            // Editor.Message.request('asset-db', 'create-asset', 'db://assets/scenes', null) might work for folders if we pass type?
            // Usually we assume it exists or use FS. But let's just proceed to save-scene.

            try {
                await this.generateBootScene();
                await this.generateMenuScene();
                await this.generateWorldScene();
                await this.generateDungeonScene();
                console.log('[KOF] All Base Scenes Generated!');
            } catch (err) {
                console.error('[KOF] Scene Generation Failed:', err);
            }
        },

        async generateBootScene() {
            console.log('[KOF] Generating boot.scene...');
            // 1. New Scene
            await Editor.Message.request('scene', 'create-scene');

            // 2. Create Hierarchy
            // Root is already there. create-node without parent defaults to Scene root.

            // - Systems
            const systemsNodeId = await Editor.Message.request('scene', 'create-node', {
                name: 'Systems'
            });

            //   - EventBus
            await Editor.Message.request('scene', 'create-node', {
                parent: systemsNodeId,
                name: 'EventBus'
            });

            //   - SaveSystem
            const saveSystemId = await Editor.Message.request('scene', 'create-node', {
                parent: systemsNodeId,
                name: 'SaveSystem'
            });
            await Editor.Message.request('scene', 'add-component', {
                uuid: saveSystemId,
                component: 'SaveSystem'
            });

            //   - AudioSystem
            const audioSystemId = await Editor.Message.request('scene', 'create-node', {
                parent: systemsNodeId,
                name: 'AudioSystem'
            });
            await Editor.Message.request('scene', 'add-component', {
                uuid: audioSystemId,
                component: 'AudioSystem'
            });

            // - Bootstrap
            const bootstrapNodeId = await Editor.Message.request('scene', 'create-node', {
                name: 'Bootstrap'
            });

            //   - BootController
            const bootControllerId = await Editor.Message.request('scene', 'create-node', {
                parent: bootstrapNodeId,
                name: 'BootController'
            });
            await Editor.Message.request('scene', 'add-component', {
                uuid: bootControllerId,
                component: 'BootController'
            });

            // Save
            await Editor.Message.request('scene', 'save-scene', 'db://assets/scenes/boot.scene');
        },

        async generateMenuScene() {
            console.log('[KOF] Generating menu.scene...');
            await Editor.Message.request('scene', 'create-scene');

            // - UI
            const uiNodeId = await Editor.Message.request('scene', 'create-node', {
                name: 'UI'
            });

            //   - Canvas
            const canvasId = await Editor.Message.request('scene', 'create-node', {
                parent: uiNodeId,
                name: 'Canvas'
            });
            await Editor.Message.request('scene', 'add-component', {
                uuid: canvasId,
                component: 'cc.Canvas'
            });
            // Add Camera for Canvas usually required?
            // In 3.x Canvas usually looks for a camera.
            // We'll create a Camera node too or rely on default Main Camera if it exists.
            // Let's explicitly create a Camera for UI if needed, but usually Canvas is enough if there is a camera.
            // Let's create a Camera inside Canvas or parallel. Standard 2D setup: Canvas is root of UI.

            //   - MainMenu
            const mainMenuId = await Editor.Message.request('scene', 'create-node', {
                parent: canvasId,
                name: 'MainMenu'
            });
            await Editor.Message.request('scene', 'add-component', {
                uuid: mainMenuId,
                component: 'MainMenu'
            });
             // Also add MenuController
            await Editor.Message.request('scene', 'add-component', {
                uuid: mainMenuId,
                component: 'MenuController'
            });

            //     - Title
            await Editor.Message.request('scene', 'create-node', {
                parent: mainMenuId,
                name: 'Title'
            });
            // Add Label?
            // await Editor.Message.request('scene', 'add-component', { uuid: titleId, component: 'cc.Label' });

            //     - StartButton
            const startBtnId = await Editor.Message.request('scene', 'create-node', {
                parent: mainMenuId,
                name: 'StartButton'
            });
            await Editor.Message.request('scene', 'add-component', { uuid: startBtnId, component: 'cc.Button' });

            //     - ContinueButton
            const continueBtnId = await Editor.Message.request('scene', 'create-node', {
                parent: mainMenuId,
                name: 'ContinueButton'
            });
            await Editor.Message.request('scene', 'add-component', { uuid: continueBtnId, component: 'cc.Button' });

            // Save
            await Editor.Message.request('scene', 'save-scene', 'db://assets/scenes/menu.scene');
        },

        async generateWorldScene() {
            console.log('[KOF] Generating world.scene...');
            await Editor.Message.request('scene', 'create-scene');

            // - Map
            await Editor.Message.request('scene', 'create-node', { name: 'Map' });

            // - Entities
            const entitiesId = await Editor.Message.request('scene', 'create-node', { name: 'Entities' });
            //   - PlayerSpawn
            await Editor.Message.request('scene', 'create-node', { parent: entitiesId, name: 'PlayerSpawn' });

            // - Systems
            await Editor.Message.request('scene', 'create-node', { name: 'Systems' });

            // - UI
            const uiId = await Editor.Message.request('scene', 'create-node', { name: 'UI' });
            // Add Canvas to UI?
             const canvasId = await Editor.Message.request('scene', 'create-node', {
                parent: uiId,
                name: 'Canvas'
            });
            await Editor.Message.request('scene', 'add-component', {
                uuid: canvasId,
                component: 'cc.Canvas'
            });

            // Save
            await Editor.Message.request('scene', 'save-scene', 'db://assets/scenes/world.scene');
        },

        async generateDungeonScene() {
            console.log('[KOF] Generating dungeon_01.scene...');
            await Editor.Message.request('scene', 'create-scene');

             // - Map
            await Editor.Message.request('scene', 'create-node', { name: 'Map' });

            // - Entities
            const entitiesId = await Editor.Message.request('scene', 'create-node', { name: 'Entities' });
            //   - PlayerSpawn
            await Editor.Message.request('scene', 'create-node', { parent: entitiesId, name: 'PlayerSpawn' });
            //   - EnemySpawnGroup
            await Editor.Message.request('scene', 'create-node', { parent: entitiesId, name: 'EnemySpawnGroup' });

            // - Systems
            await Editor.Message.request('scene', 'create-node', { name: 'Systems' });

            // - UI
             const uiId = await Editor.Message.request('scene', 'create-node', { name: 'UI' });
             const canvasId = await Editor.Message.request('scene', 'create-node', {
                parent: uiId,
                name: 'Canvas'
            });
            await Editor.Message.request('scene', 'add-component', {
                uuid: canvasId,
                component: 'cc.Canvas'
            });

            // Save
            await Editor.Message.request('scene', 'save-scene', 'db://assets/scenes/dungeon_01.scene');
        }
    }
};
