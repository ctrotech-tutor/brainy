import * as React from "react";
import { Text, Section } from "@react-email/components";
import { BaseLayout } from "./_components/BaseLayout";

interface StudentOTPEmailProps {
    otp: string;
    institutionName: string;
}

export const StudentOTPEmail = ({ otp, institutionName }: StudentOTPEmailProps) => {
    return (
        <BaseLayout
            preview={`Your verification code for ${institutionName}`}
            heading="Verification Code"
        >
            <Text className="text" style={text}>
                Welcome to the student community at <strong>{institutionName}</strong>.
            </Text>
            <Text className="text" style={text}>
                Please use the following verification code to confirm your email address:
            </Text>

            <Section style={otpContainer}>
                <Text style={otpText}>{otp}</Text>
            </Section>

            <Text className="text" style={text}>
                This code is valid for 10 minutes. Please do not share this code with anyone.
            </Text>
            <Text className="text" style={text}>
                If you didn't request this code, please ignore this email.
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

const otpContainer = {
    backgroundColor: "#f1f5f9",
    borderRadius: "16px",
    padding: "24px",
    margin: "32px 0",
    textAlign: "center" as const,
    border: "2px dashed #e2e8f0",
};

const otpText = {
    color: "#0f172a",
    fontSize: "42px",
    fontWeight: "900",
    letterSpacing: "0.5em",
    margin: "0",
    fontFamily: "monospace",
};

export default StudentOTPEmail;
