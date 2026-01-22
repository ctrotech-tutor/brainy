import { Metadata } from "next";
import { InboxClient } from "./InboxClient";

export const metadata: Metadata = {
    title: "Inbox | Platform Admin",
    description: "View all your notifications.",
};

export default function InboxPage() {
    return <InboxClient />;
}
