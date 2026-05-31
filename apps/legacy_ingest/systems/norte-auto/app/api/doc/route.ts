import { createSwaggerSpec } from 'next-swagger-doc';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const spec = createSwaggerSpec({
        apiFolder: 'app/api', // define api folder
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'OmniSync Retail Hub API',
                version: '1.0',
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [],
        },
    });
    return NextResponse.json(spec);
}
