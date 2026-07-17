import type { TrackingCodeGenerator } from '../../src/core/application/ports/services/tracking-code-generator.js';

export class FixedTrackingCodeGenerator implements TrackingCodeGenerator {
    constructor(private readonly trackingCodes: string[]) { }

    public generate(): string {
        const trackingCode = this.trackingCodes.shift();

        if (!trackingCode) {
            throw new Error('No fixed tracking code is available.');
        }

        return trackingCode;
    }
}