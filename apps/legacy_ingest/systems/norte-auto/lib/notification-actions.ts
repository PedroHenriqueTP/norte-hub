'use server';

import { auth } from "@/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function fetchNotifications() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
    });
}

export async function markAsRead(notificationId?: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    if (notificationId) {
        await db.notification.update({
            where: { id: notificationId, userId: session.user.id },
            data: { read: true }
        });
    } else {
        // Mark all
        await db.notification.updateMany({
            where: { userId: session.user.id, read: false },
            data: { read: true }
        });
    }
    revalidatePath('/dashboard');
}

export async function updateNotificationSettings(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return;

    // Extract boolean values
    const emailSales = formData.get('emailSales') === 'on';
    const emailLowStock = formData.get('emailLowStock') === 'on';
    const emailSecurity = formData.get('emailSecurity') === 'on';
    // ... others

    await db.notificationSettings.upsert({
        where: { userId: session.user.id },
        update: {
            emailSales, emailLowStock, emailSecurity
        },
        create: {
            userId: session.user.id,
            emailSales, emailLowStock, emailSecurity
        }
    });

    revalidatePath('/dashboard/settings/notifications');
}
