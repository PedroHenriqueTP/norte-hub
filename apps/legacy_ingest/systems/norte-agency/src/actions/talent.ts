"use server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export async function getFreelancers(query?: string) {
    // Ensure user is authenticated to view talent pool
    await getAuthenticatedUser();

    const freelancers = await prisma.freelancerProfile.findMany({
        where: query ? {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { skills: { has: query } } // Assuming array filter support
            ]
        } : undefined,
        orderBy: { rating: "desc" },
    });

    return freelancers;
}

export async function getFreelancerDetails(id: string) {
    await getAuthenticatedUser();

    return prisma.freelancerProfile.findUnique({
        where: { id }
    });
}
