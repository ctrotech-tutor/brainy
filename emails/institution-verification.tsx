import * as React from "react";
import { Text, Section } from "@react-email/components";
import { BaseLayout } from "./_components/BaseLayout";
import { PrimaryButton } from "./_components/PrimaryButton";

interface InstitutionVerificationEmailProps {
    url: string;
    institutionName: string;
}

export const InstitutionVerificationEmail = ({
    url,
    institutionName,
}: InstitutionVerificationEmailProps) => {
    return (
        <BaseLayout
            preview={`Verify ${institutionName} on Brainy`}
            heading="Institution Verification"
        >
            <Text className="text" style={text}>
                We're thrilled to have <strong>{institutionName}</strong> join Brainy!
            </Text>
            <Text className="text" style={text}>
                To complete your institution's registration and gain access to the dashboard, please verify your email address.
            </Text>

            <Section style={btnContainer}>
                <PrimaryButton href={url}>
                    Verify Institution
                </PrimaryButton>
            </Section>

            <Text className="text" style={text}>
                Once verified, you'll be able to set up your institutional profile, add staff, and start managing your educational ecosystem.
            </Text>

            <Text className="footer-text" style={subtext}>
                This link will expire in 48 hours.
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

export default InstitutionVerificationEmail;
