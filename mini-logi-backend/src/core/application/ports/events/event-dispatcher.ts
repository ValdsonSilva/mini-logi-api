import type { DomainEvent } from '../../../domain/events/domain-event.js';

export interface EventHandler<
    TEvent extends DomainEvent = DomainEvent,
> {
    handle(event: TEvent): Promise<void>;
}

export interface EventDispatcher {
    register<TEvent extends DomainEvent>(
        eventName: string,
        handler: EventHandler<TEvent>,
    ): void;

    dispatch(event: DomainEvent): Promise<void>;
}