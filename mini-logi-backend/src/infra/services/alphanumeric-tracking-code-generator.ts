import { randomInt } from 'node:crypto';
import type { TrackingCodeGenerator } from '../../core/application/ports/services/tracking-code-generator.js';

export class AlphanumericTrackingCodeGenerator implements TrackingCodeGenerator {

    private static readonly alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    private static readonly codeLength = 8;

    public generate(): string {
        let trackingCode = '';

        for (
            let position = 0;
            position < AlphanumericTrackingCodeGenerator.codeLength;
            position += 1
        ) {
            const index = randomInt(
                AlphanumericTrackingCodeGenerator.alphabet.length,
            );

            trackingCode +=
                AlphanumericTrackingCodeGenerator.alphabet[index];
        }

        return trackingCode;
    }
}