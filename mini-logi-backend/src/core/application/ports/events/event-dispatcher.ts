import type { DomainEvent } from '../../../domain/events/domain-event.js';

export interface EventDispatcher {
    dispatch(event: DomainEvent): Promise<void>;
}