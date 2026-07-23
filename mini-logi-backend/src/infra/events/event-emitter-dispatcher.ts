import { EventEmitter } from 'node:events';

import type {
    EventDispatcher,
    EventHandler,
} from '../../core/application/ports/events/event-dispatcher.js';

import type { DomainEvent } from '../../core/domain/events/domain-event.js';
import { logger } from '../logging/logger.js';

type AsyncEventListener = (
    event: DomainEvent,
) => Promise<void>;

export class EventEmitterDispatcher
    implements EventDispatcher {
    private readonly emitter =
        new EventEmitter();

    public register<
        TEvent extends DomainEvent,
    >(
        eventName: string,
        handler: EventHandler<TEvent>,
    ): void {
        const listener:
            AsyncEventListener = async (
                event,
            ) => {
                await handler.handle(
                    event as TEvent,
                );
            };

        // EventEmitter types listeners as void
        // callbacks, while dispatch() retrieves
        // and awaits these promises explicitly.
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.emitter.on(
            eventName,
            listener,
        );
    }

    public async dispatch(
        event: DomainEvent,
    ): Promise<void> {
        const listeners =
            this.emitter.listeners(
                event.name,
            ) as AsyncEventListener[];

        logger.info(
            `Event ${event.name} emitted`,
            {
                eventName: event.name,
                occurredAt:
                    event.occurredAt.toISOString(),
                ...this.asLogMetadata(
                    event.payload,
                ),
            },
        );

        await Promise.all(
            listeners.map((listener) =>
                listener(event),
            ),
        );
    }

    private asLogMetadata(
        payload: unknown,
    ): Record<string, unknown> {
        if (
            typeof payload === 'object' &&
            payload !== null
        ) {
            return payload as Record<
                string,
                unknown
            >;
        }

        return { payload };
    }
}