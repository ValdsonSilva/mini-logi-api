import type { EventDispatcher } from '../../src/core/application/ports/events/event-dispatcher.js';
import type { DomainEvent } from '../../src/core/domain/events/domain-event.js';

export class InMemoryEventDispatcher implements EventDispatcher {
    public readonly events: DomainEvent[] = [];

    public async dispatch(event: DomainEvent): Promise<void> {
        this.events.push(event);
    }
}