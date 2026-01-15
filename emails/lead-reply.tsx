import * as React from "react";
import { Text, Section } from "@react-email/components";
import { BaseLayout } from "./_components/BaseLayout";

interface LeadReplyEmailProps {
    name: string;
    content: string;
}

export const LeadReplyEmail = ({ name, content }: LeadReplyEmailProps) => {
    return (
        <BaseLayout
            preview="Official response to your inquiry"
            heading="Response to Inquiry"
        >
            <Text className="text" style={text}>
                Hello {name},
            </Text>
            <Text className="text" style={text}>
                Thank you for reaching out to Brainy. Below is our formal response to your inquiry:
            </Text>

            <Section style={replyBox}>
                <Text style={replyText}>{content}</Text>
            </Section>

            <Text className="text" style={text}>
                If you have any further questions or require additional clarification, please don't hesitate to reply to this email.
            </Text>

            <Text className="text" style={text}>
                Best regards,<br />
                The Brainy Team
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

const replyBox = {
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    padding: "32px",
    margin: "32px 0",
    border: "1px solid #e2e8f0",
};

const replyText = {
    color: "#1e293b",
    fontSize: "16px",
    lineHeight: "28px",
    margin: "0",
    whiteSpace: "pre-wrap" as const,
};

export default LeadReplyEmail;
