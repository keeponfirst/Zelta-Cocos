'use strict';

/**
 * KOF Scene Validator
 * Enforces scene hierarchy contract: Root -> Systems, Map, Entities, UI
 */

module.exports = {
    load() { },
    unload() { },
    methods: {
        async validateScenes() {
            console.log('[KOF] Starting Scene Validation...');

            try {
                // Query all scene assets
                const scenes = await Editor.Message.request('asset-db', 'query-assets', {
                    type: 'scene'
                });

                if (!scenes || scenes.length === 0) {
                    console.warn('[KOF] No scenes found.');
                    return;
                }

                // Iterate through each scene
                for (const sceneInfo of scenes) {
                    console.log(`[KOF] Validating scene: ${sceneInfo.url}`);

                    // Open scene
                    // Note: This changes the currently open scene in the editor
                    await Editor.Message.request('scene', 'open-scene', sceneInfo.uuid);

                    // Get Scene Root
                    // query-node-tree returns the hierarchy.
                    // Usually the first element is the Scene object, which has children.
                    const rootNodes = await Editor.Message.request('scene', 'query-node-tree');

                    if (!rootNodes || rootNodes.length === 0) {
                        console.error(`[KOF] Failed to query node tree for ${sceneInfo.url}`);
                        continue;
                    }

                    // The scene root is usually the UUID of the scene itself
                    // But in the tree structure, it might be the object with type 'cc.Scene'
                    // For safety, we look at the uuid of the first node returned which is the Scene root.
                    const sceneRoot = rootNodes[0];
                    const sceneUuid = sceneRoot.uuid; // This should be the scene's node UUID (not asset UUID)

                    // Check children
                    const children = sceneRoot.children || [];
                    const existingNames = children.map(c => c.name);

                    const requiredNodes = ['Systems', 'Map', 'Entities', 'UI'];
                    let changed = false;

                    for (const nodeName of requiredNodes) {
                        if (!existingNames.includes(nodeName)) {
                            console.log(`[KOF] Creating missing node: ${nodeName} in ${sceneInfo.url}`);
                            await Editor.Message.request('scene', 'create-node', {
                                parent: sceneUuid,
                                name: nodeName
                            });
                            changed = true;
                        }
                    }

                    // Special handling for boot.scene
                    if (sceneInfo.url.endsWith('boot.scene')) {
                        console.log('[KOF] Checking BootController in boot.scene...');
                        // Query node details to check components
                        const nodeDump = await Editor.Message.request('scene', 'query-node', sceneUuid);
                        const components = nodeDump && nodeDump.__comps__ ? nodeDump.__comps__ : [];
                        const hasBootController = components.some(c => c.type === 'BootController');

                        if (!hasBootController) {
                            console.log('[KOF] Attaching BootController to scene root...');
                            await Editor.Message.request('scene', 'create-component', {
                                uuid: sceneUuid,
                                component: 'BootController'
                            });
                            changed = true;
                        }
                    }

                    // Only save if we made changes
                    if (changed) {
                        await Editor.Message.request('scene', 'save-scene');
                        console.log(`[KOF] Scene saved: ${sceneInfo.url}`);
                    } else {
                        console.log(`[KOF] Scene ${sceneInfo.url} is valid.`);
                    }
                }

                console.log('[KOF] Validation Complete. All scenes checked.');

            } catch (err) {
                console.error('[KOF] Validation failed:', err);
            }
        }
    }
};
