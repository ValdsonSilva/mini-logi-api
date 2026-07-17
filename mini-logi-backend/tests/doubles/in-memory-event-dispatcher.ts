import type {
    EventDispatcher,
    EventHandler,
} from '../../src/core/application/ports/events/event-dispatcher.js';
import type { DomainEvent } from '../../src/core/domain/events/domain-event.js';

export class InMemoryEventDispatcher implements EventDispatcher {
    
    public readonly events: DomainEvent[] = [];

    private readonly handlers = new Map<
        string,
        EventHandler[]
    >();

    public register<TEvent extends DomainEvent>(
        eventName: string,
        handler: EventHandler<TEvent>,
    ): void {
        const handlers = this.handlers.get(eventName) ?? [];

        handlers.push(handler as EventHandler);
        this.handlers.set(eventName, handlers);
    }

    public async dispatch(event: DomainEvent): Promise<void> {
        this.events.push(event);

        const handlers = this.handlers.get(event.name) ?? [];

        await Promise.all(
            handlers.map((handler) => handler.handle(event)),
        );
    }
}