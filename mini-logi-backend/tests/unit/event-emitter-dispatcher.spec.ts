import type { EventHandler } from '../../src/core/application/ports/events/event-dispatcher.js';
import { DeliveryStatus } from '../../src/core/domain/enums/delivery-status.js';
import { DeliveryStatusChangedEvent } from '../../src/core/domain/events/delivery-status-changed.event.js';
import { EventEmitterDispatcher } from '../../src/infra/events/event-emitter-dispatcher.js';

describe('EventEmitterDispatcher', () => {
  it('awaits all handlers registered for the event', async () => {
    const dispatcher =
      new EventEmitterDispatcher();

    const handledEvents: string[] = [];

    const firstHandler: EventHandler<DeliveryStatusChangedEvent> =
      {
        async handle(event): Promise<void> {
          handledEvents.push(
            `first:${event.payload.status}`,
          );
        },
      };

    const secondHandler: EventHandler<DeliveryStatusChangedEvent> =
      {
        async handle(event): Promise<void> {
          handledEvents.push(
            `second:${event.payload.status}`,
          );
        },
      };

    dispatcher.register(
      DeliveryStatusChangedEvent.eventName,
      firstHandler,
    );

    dispatcher.register(
      DeliveryStatusChangedEvent.eventName,
      secondHandler,
    );

    await dispatcher.dispatch(
      new DeliveryStatusChangedEvent({
        deliveryId: 'delivery-id',
        trackingCode: 'TEST1234',
        previousStatus:
          DeliveryStatus.PENDING,
        status: DeliveryStatus.COLLECTED,
        latitude: null,
        longitude: null,
      }),
    );

    expect(handledEvents).toEqual([
      'first:COLLECTED',
      'second:COLLECTED',
    ]);
  });
});