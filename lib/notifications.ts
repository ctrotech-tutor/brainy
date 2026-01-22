import { createNotification, NotificationType } from "@/app/(platform)/_actions/notifications";

export const Notify = {
    send: async (
        recipientId: string,
        title: string,
        message: string,
        type: NotificationType = "INFO",
        link?: string
    ) => {
        await createNotification(recipientId, title, message, type, link);
    },

    admin: async (title: string, message: string, link?: string) => {
        // Ideally fetch all PLATFORM_ADMIN users and send to them 
        // For now, we might need a simpler strategy or just user specific
        // This is a placeholder for broadcasting to admins
        // Implementation requires fetching admin IDs
        console.log("Admin notification triggered:", title);
    }
};
