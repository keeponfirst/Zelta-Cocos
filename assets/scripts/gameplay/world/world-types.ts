// assets/scripts/gameplay/world/world-types.ts

import { DoorType, DoorDirection } from "./Door";

export interface DoorData {
    doorId: string;
    doorType: DoorType;
    targetRoomId?: string;
    direction: DoorDirection;
}

export interface ChestData {
    chestId: string;
    itemId: string;
    itemCount: number;
    requiresTrigger?: boolean;
}

export interface TriggerData {
    triggerId: string;
    type: string;
    params?: any;
}
