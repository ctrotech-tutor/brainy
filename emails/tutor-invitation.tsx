import * as React from "react";
import { Text, Section } from "@react-email/components";
import { BaseLayout } from "./_components/BaseLayout";
import { PrimaryButton } from "./_components/PrimaryButton";

interface TutorInvitationEmailProps {
    url: string;
    institutionName: string;
    inviterName: string;
    customMessage?: string;
}

export const TutorInvitationEmail = ({
    url,
    institutionName,
    inviterName,
    customMessage,
}: TutorInvitationEmailProps) => {
    return (
        <BaseLayout
            preview={`Invitation to join ${institutionName} on Brainy`}
            heading="Join the Team! 🤝"
        >
            <Text className="text" style={text}>
                Hello,
            </Text>
            <Text className="text" style={text}>
                <strong>{inviterName}</strong> has invited you to join <strong>{institutionName}</strong> as a tutor on the Brainy platform.
            </Text>

            {customMessage && (
                <Section style={messageBox}>
                    <Text style={quote}>"{customMessage}"</Text>
                </Section>
            )}

            <Text className="text" style={text}>
                As a tutor, you'll be able to manage your students, schedule sessions, and access institutional resources.
            </Text>

            <Section style={btnContainer}>
                <PrimaryButton href={url}>
                    Accept Invitation
                </PrimaryButton>
            </Section>

            <Text className="footer-text" style={subtext}>
                If you have any questions about this invitation, please contact your institution admin.
            </Text>
        </BaseLayout>
    );
};

const text = {
    color: "#334155",
    fontSize: "16px",
    lineHeight: "26px",
    margin: "16px 0",
};

const subtext = {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "24px",
    margin: "16px 0",
};

const messageBox = {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    margin: "24px 0",
    borderLeft: "4px solid #6d28d9",
};

const quote = {
    color: "#475569",
    fontSize: "15px",
    fontStyle: "italic",
    margin: "0",
};

const btnContainer = {
    textAlign: "center" as const,
    margin: "32px 0",
};

export default TutorInvitationEmail;
