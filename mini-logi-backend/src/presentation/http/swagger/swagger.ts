import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerDocument =
    swaggerJsdoc({
        definition: {
            openapi: '3.0.3',

            info: {
                title: 'Mini-Logi API',
                version: '1.0.0',
                description:
                    'API REST para gerenciamento de motoristas e entregas.',
            },

            servers: [
                {
                    url: '/api/v1',
                    description:
                        'Current API version',
                },
            ],

            tags: [
                {
                    name: 'Drivers',
                    description:
                        'Driver management',
                },
                {
                    name: 'Deliveries',
                    description:
                        'Delivery management',
                },
            ],

            components: {
                schemas: {
                    DriverStatus: {
                        type: 'string',
                        enum: [
                            'AVAILABLE',
                            'IN_TRANSIT',
                            'OFFLINE',
                        ],
                    },

                    DeliveryStatus: {
                        type: 'string',
                        enum: [
                            'PENDING',
                            'COLLECTED',
                            'DELIVERING',
                            'DELIVERED',
                            'RETURNED',
                        ],
                    },

                    Driver: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                            },
                            name: {
                                type: 'string',
                            },
                            licenseId: {
                                type: 'string',
                            },
                            status: {
                                $ref:
                                    '#/components/schemas/DriverStatus',
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },

                    Delivery: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                            },
                            trackingCode: {
                                type: 'string',
                                example: 'ABCD1234',
                            },
                            description: {
                                type: 'string',
                            },
                            status: {
                                $ref:
                                    '#/components/schemas/DeliveryStatus',
                            },
                            origin: {
                                type: 'string',
                            },
                            destination: {
                                type: 'string',
                            },
                            latitude: {
                                type: 'number',
                                nullable: true,
                            },
                            longitude: {
                                type: 'number',
                                nullable: true,
                            },
                            driverId: {
                                type: 'string',
                                format: 'uuid',
                                nullable: true,
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },

                    StatusHistory: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                            },
                            status: {
                                $ref:
                                    '#/components/schemas/DeliveryStatus',
                            },
                            latitude: {
                                type: 'number',
                                nullable: true,
                            },
                            longitude: {
                                type: 'number',
                                nullable: true,
                            },
                            changedAt: {
                                type: 'string',
                                format: 'date-time',
                            },
                        },
                    },

                    Error: {
                        type: 'object',
                        properties: {
                            error: {
                                type: 'object',
                                properties: {
                                    code: {
                                        type: 'string',
                                    },
                                    message: {
                                        type: 'string',
                                    },
                                    details: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },

            paths: {
                '/drivers': {
                    post: {
                        tags: ['Drivers'],
                        summary: 'Create a driver',

                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: [
                                            'name',
                                            'licenseId',
                                        ],
                                        properties: {
                                            name: {
                                                type: 'string',
                                                example:
                                                    'Maria Silva',
                                            },
                                            licenseId: {
                                                type: 'string',
                                                example:
                                                    'CNH123456',
                                            },
                                        },
                                    },
                                },
                            },
                        },

                        responses: {
                            201: {
                                description:
                                    'Driver created',
                            },
                            400: {
                                description:
                                    'Invalid input',
                            },
                            409: {
                                description:
                                    'License already registered',
                            },
                            429: {
                                description:
                                    'Rate limit exceeded',
                            },
                        },
                    },

                    get: {
                        tags: ['Drivers'],
                        summary: 'List drivers',
                        responses: {
                            200: {
                                description:
                                    'Driver list',
                            },
                        },
                    },
                },

                '/deliveries': {
                    post: {
                        tags: ['Deliveries'],
                        summary:
                            'Create a delivery',

                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: [
                                            'description',
                                            'origin',
                                            'destination',
                                        ],
                                        properties: {
                                            description: {
                                                type: 'string',
                                            },
                                            origin: {
                                                type: 'string',
                                            },
                                            destination: {
                                                type: 'string',
                                            },
                                            driverId: {
                                                type: 'string',
                                                format: 'uuid',
                                                nullable: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },

                        responses: {
                            201: {
                                description:
                                    'Delivery created',
                            },
                            400: {
                                description:
                                    'Invalid input',
                            },
                            429: {
                                description:
                                    'Rate limit exceeded',
                            },
                        },
                    },

                    get: {
                        tags: ['Deliveries'],
                        summary:
                            'List deliveries',

                        parameters: [
                            {
                                name: 'page',
                                in: 'query',
                                schema: {
                                    type: 'integer',
                                    minimum: 1,
                                    default: 1,
                                },
                            },
                            {
                                name: 'limit',
                                in: 'query',
                                schema: {
                                    type: 'integer',
                                    minimum: 1,
                                    maximum: 100,
                                    default: 20,
                                },
                            },
                        ],

                        responses: {
                            200: {
                                description:
                                    'Paginated delivery list',
                            },
                        },
                    },
                },

                '/deliveries/{trackingCode}': {
                    get: {
                        tags: ['Deliveries'],
                        summary:
                            'Get delivery details and status history',

                        parameters: [
                            {
                                name: 'trackingCode',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string',
                                    pattern:
                                        '^[A-Z0-9]{8}$',
                                },
                            },
                        ],

                        responses: {
                            200: {
                                description:
                                    'Delivery details',
                            },
                            404: {
                                description:
                                    'Delivery not found',
                            },
                        },
                    },
                },

                '/deliveries/{id}/status': {
                    patch: {
                        tags: ['Deliveries'],
                        summary:
                            'Update delivery status',

                        parameters: [
                            {
                                name: 'id',
                                in: 'path',
                                required: true,
                                schema: {
                                    type: 'string',
                                    format: 'uuid',
                                },
                            },
                        ],

                        requestBody: {
                            required: true,
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        required: ['status'],
                                        properties: {
                                            status: {
                                                $ref:
                                                    '#/components/schemas/DeliveryStatus',
                                            },
                                            latitude: {
                                                type: 'number',
                                                minimum: -90,
                                                maximum: 90,
                                            },
                                            longitude: {
                                                type: 'number',
                                                minimum: -180,
                                                maximum: 180,
                                            },
                                        },
                                    },
                                },
                            },
                        },

                        responses: {
                            200: {
                                description:
                                    'Status updated',
                            },
                            400: {
                                description:
                                    'Invalid input',
                            },
                            404: {
                                description:
                                    'Delivery not found',
                            },
                        },
                    },
                },
            },
        },

        apis: [],
    });