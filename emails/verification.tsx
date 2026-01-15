import * as React from "react";
import { Text, Section } from "@react-email/components";
import { BaseLayout } from "./_components/BaseLayout";
import { PrimaryButton } from "./_components/PrimaryButton";

interface VerificationEmailProps {
    url: string;
}

export const VerificationEmail = ({ url }: VerificationEmailProps) => {
    return (
        <BaseLayout
            preview="Verify your email address to activate your Brainy account."
            heading="Welcome to Brainy! 🧠"
        >
            <Text className="text" style={text}>
                Thank you for joining Brainy. We're excited to have you on board!
            </Text>
            <Text className="text" style={text}>
                Please click the button below to verify your email address and complete your registration.
            </Text>

            <Section style={btnContainer}>
                <PrimaryButton href={url}>
                    Verify Email Address
                </PrimaryButton>
            </Section>

            <Text className="text" style={text}>
                If you didn't create an account, you can safely ignore this email.
            </Text>
            <Text className="footer-text" style={subtext}>
                This link will expire in 24 hours.
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

const btnContainer = {
    textAlign: "center" as const,
    margin: "32px 0",
};

export default VerificationEmail;
