import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'coverage/**',
            'node_modules/**',
            'prisma/migrations/**',
        ],
    },

    eslint.configs.recommended,

    ...tseslint.configs.recommendedTypeChecked.map(
        (config) => ({
            ...config,
            files: [
                'src/**/*.ts',
                'tests/**/*.ts',
            ],
        }),
    ),

    {
        files: [
            'src/**/*.ts',
            'tests/**/*.ts',
        ],

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },

            parserOptions: {
                projectService: true,
                tsconfigRootDir:
                    import.meta.dirname,
            },
        },

        rules: {
            '@typescript-eslint/consistent-type-imports':
                [
                    'error',
                    {
                        prefer: 'type-imports',
                    },
                ],

            '@typescript-eslint/no-floating-promises':
                'error',

            '@typescript-eslint/no-misused-promises':
                'error',

            '@typescript-eslint/no-unused-vars':
                [
                    'error',
                    {
                        argsIgnorePattern: '^_',
                    },
                ],
        },
    },

    {
        files: ['tests/**/*.ts'],

        rules: {
            '@typescript-eslint/no-unsafe-assignment':
                'off',

            '@typescript-eslint/no-unsafe-member-access':
                'off',

            '@typescript-eslint/require-await':
                'off',
        },
    },
);