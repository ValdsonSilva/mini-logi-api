import { randomUUID } from 'node:crypto';

export abstract class Entity {
    public readonly id: string;

    protected constructor(id?: string) {
        this.id = id ?? randomUUID();
    }

    public equals(entity?: Entity): boolean {
        if (!entity) {
            return false;
        }

        return this.id === entity.id;
    }
}