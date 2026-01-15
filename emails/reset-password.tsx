import * as React from "react";
import { Text, Section } from "@react-email/components";
import { BaseLayout } from "./_components/BaseLayout";
import { PrimaryButton } from "./_components/PrimaryButton";

interface ResetPasswordEmailProps {
    url: string;
}

export const ResetPasswordEmail = ({ url }: ResetPasswordEmailProps) => {
    return (
        <BaseLayout
            preview="Reset your Brainy account password."
            heading="Reset Password 🔐"
        >
            <Text className="text" style={text}>
                We received a request to reset the password for your Brainy account.
            </Text>
            <Text className="text" style={text}>
                If you made this request, please click the button below to continue:
            </Text>

            <Section style={btnContainer}>
                <PrimaryButton href={url}>
                    Reset Password
                </PrimaryButton>
            </Section>

            <Text className="text" style={text}>
                If you didn't request a password reset, you can safely ignore this email or contact support if you have concerns.
            </Text>
            <Text className="footer-text" style={subtext}>
                This link will expire in 1 hour.
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

export default ResetPasswordEmail;
