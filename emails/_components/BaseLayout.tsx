import * as React from "react";
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Link,
    Hr,
} from "@react-email/components";

interface BaseLayoutProps {
    preview: string;
    heading?: string;
    children: React.ReactNode;
}

export const BaseLayout = ({ preview, heading, children }: BaseLayoutProps) => {
    return (
        <Html>
            <Head>
                <style>{`
                  @media (prefers-color-scheme: dark) {
                    .body { background-color: #0c0a09 !important; }
                    .container { background-color: #171717 !important; border-color: #262626 !important; }
                    .content { background-color: #1a1a1a !important; border-color: #262626 !important; }
                    .heading { color: #ffffff !important; }
                    .text { color: #a3a3a3 !important; }
                    .logo { color: #ffffff !important; }
                    .footer-text { color: #525252 !important; }
                    .hr { border-color: #262626 !important; }
                  }
                `}</style>
            </Head>
            <Preview>{preview}</Preview>
            <Body className="body" style={main}>
                <Container className="container" style={container}>
                    <Section style={header}>
                        <Text className="logo" style={logo}>BRAINY</Text>
                        <Text style={tagline}>Institutional Operating System</Text>
                    </Section>

                    <Section className="content" style={content}>
                        {heading && <Heading className="heading" style={h1}>{heading}</Heading>}
                        {children}
                    </Section>

                    <Section style={footer}>
                        <Hr className="hr" style={hr} />
                        <Text className="footer-text" style={footerText}>
                            &copy; {new Date().getFullYear()} Brainy Platform. All rights reserved.
                        </Text>
                        <Text className="footer-text" style={footerText}>
                            If you have any questions, please contact our support team.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

const main = {
    backgroundColor: "#f8fafc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px 20px",
    maxWidth: "600px",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
};

const header = {
    textAlign: "center" as const,
    paddingBottom: "40px",
};

const logo = {
    color: "#0f172a",
    fontSize: "32px",
    fontWeight: "900",
    letterSpacing: "-0.05em",
    margin: "0",
};

const tagline = {
    color: "#6d28d9",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "0.2em",
    margin: "4px 0 0 0",
};

const content = {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    border: "1px solid #f1f5f9",
};

const h1 = {
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: "800",
    textAlign: "center" as const,
    margin: "0 0 30px 0",
};

const footer = {
    textAlign: "center" as const,
    marginTop: "40px",
};

const footerText = {
    color: "#94a3b8",
    fontSize: "12px",
    margin: "4px 0",
};

const hr = {
    borderColor: "#e2e8f0",
    margin: "20px 0",
};
