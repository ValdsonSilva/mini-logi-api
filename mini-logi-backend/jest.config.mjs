/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.spec.ts'],
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                diagnostics: {
                    ignoreCodes: [151002],
                },
            },
        ],
    },
    collectCoverageFrom: [
        'src/core/**/*.ts',
        '!src/core/**/index.ts',
    ],
    coverageDirectory: 'coverage',
    clearMocks: true,
};

export default config;