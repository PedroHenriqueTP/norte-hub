"use server";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const invoiceSchema = z.object({
    supplierName: z.string(),
    invoiceDate: z.string().describe("ISO date YYYY-MM-DD"),
    items: z.array(z.object({
        description: z.string(),
        amount: z.number(),
        category: z.enum(["PRODUCTION", "LOGISTICS", "TALENT", "MARKETING", "TAXES", "OTHER"]).optional(),
    })),
    totalAmount: z.number(),
    currency: z.string().default("BRL"),
});

export async function processDocument(imageBase64: string) {
    const { object } = await generateObject({
        model: openai("gpt-4o"), // Vision capable
        schema: invoiceSchema,
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "Extract data from this invoice/receipt. Map items to likely categories." },
                    { type: "image", image: imageBase64 },
                ],
            },
        ],
    });

    return object;
}
