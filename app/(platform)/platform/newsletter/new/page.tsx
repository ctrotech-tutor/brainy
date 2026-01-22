import { Metadata } from "next";
import NewBroadcastClient from "./NewBroadcastClient";

export const metadata: Metadata = {
    title: "New Broadcast",
    description: "Compose and send a new newsletter broadcast.",
};

export default function NewBroadcastPage() {
    return <NewBroadcastClient />;
}
