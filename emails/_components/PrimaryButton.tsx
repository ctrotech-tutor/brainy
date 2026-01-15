import * as React from "react";
import { Button } from "@react-email/components";

interface PrimaryButtonProps {
    href: string;
    children: React.ReactNode;
}

export const PrimaryButton = ({ href, children }: PrimaryButtonProps) => {
    return (
        <Button
            href={href}
            style={button}
        >
            {children}
        </Button>
    );
};

const button = {
    backgroundColor: "#6d28d9",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "16px 32px",
    margin: "30px auto",
};
