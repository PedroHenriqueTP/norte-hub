// @ts-nocheck
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const session = await auth();
    const tenantId = session?.user?.tenantId;

    if (!tenantId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();

    const result = streamText({
        model: openai('gpt-4-turbo'),
        messages,
        maxSteps: 5,
        system: `
      You are the Agency Copilot.
      Refuse to generate any images.
      
      You have access to tools to help manage the agency.
      When the user wants to add a transaction or job, use the tools to DRAFT it.
      
      IMPORTANT:
      - If searching for a job, use 'search_jobs'.
      - If creating a transaction, ALWAYS try to find the Job ID first using search if not provided.
      - NEVER invent IDs.
    `,
        tools: {
            search_jobs: tool({
                description: "Search for active jobs by name or client to get their ID.",
                parameters: z.object({
                    query: z.string().describe("The search query"),
                }),
                execute: async (args: { query: string }) => {
                    // Filter by tenant
                    const jobs = await prisma.job.findMany({
                        where: {
                            tenantId,
                            OR: [
                                { title: { contains: args.query, mode: "insensitive" } },
                                { client: { name: { contains: args.query, mode: "insensitive" } } }
                            ]
                        },
                        select: { id: true, title: true, client: { select: { name: true } } },
                        take: 5
                    });
                    return JSON.stringify(jobs);
                },
            }),
            query_financials: tool({
                description: "Query financial data (Expenses/Revenue).",
                parameters: z.object({
                    startDate: z.string().describe("ISO date string start range"),
                    endDate: z.string().describe("ISO date string end range"),
                    type: z.enum(["INCOME", "EXPENSE"]).optional(),
                }),
                execute: async (args: { startDate: string, endDate: string, type?: "INCOME" | "EXPENSE" }) => {
                    const aggregations = await prisma.transaction.aggregate({
                        where: {
                            tenantId,
                            date: {
                                gte: new Date(args.startDate),
                                lte: new Date(args.endDate),
                            },
                            type: args.type
                        },
                        _sum: { amount: true },
                        _count: true
                    });

                    return JSON.stringify({
                        total: aggregations._sum.amount || 0,
                        count: aggregations._count,
                        currency: "BRL"
                    });
                }
            }),
            draft_transaction: tool({
                description: "Draft a financial transaction. The user will review it in the UI.",
                parameters: z.object({
                    jobId: z.string(),
                    description: z.string(),
                    amount: z.number(),
                    type: z.enum(["INCOME", "EXPENSE"]),
                    category: z.enum(["PRODUCTION", "LOGISTICS", "TALENT", "MARKETING", "TAXES", "OTHER"]),
                }),
                execute: async (args: any) => {
                    // We just return the args to the client
                    return { ...args, message: "Draft created. Please review." };
                }
            })
        },
    });

    return result.toDataStreamResponse();
}
