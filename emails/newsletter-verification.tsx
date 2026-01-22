import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface NewsletterVerificationEmailProps {
    url: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const NewsletterVerificationEmail = ({
    url,
}: NewsletterVerificationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Confirm your subscription to the Brainy Newsletter</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Img
                        src={`${baseUrl}/brainy-logo.png`}
                        width="48"
                        height="48"
                        alt="Brainy"
                        style={logo}
                    />
                    <Heading style={heading}>Confirm Subscription</Heading>
                    <Text style={paragraph}>
                        Thanks for signing up for the Brainy Newsletter! We're excited to
                        share the latest updates on academic integrity, AI assessments, and
                        platform features with you.
                    </Text>
                    <Text style={paragraph}>
                        To verify your email address and complete your subscription, please
                        click the button below:
                    </Text>
                    <Section style={btnContainer}>
                        <Button style={button} href={url}>
                            Verify Email Address
                        </Button>
                    </Section>
                    <Text style={paragraph}>
                        If you didn't sign up for this newsletter, you can safely ignore
                        this email.
                    </Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        &copy; {new Date().getFullYear()} Brainy OS. All rights reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default NewsletterVerificationEmail;

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "560px",
};

const logo = {
    margin: "0 auto",
    filter: "invert(1)", // Assuming dark logo on light background if needed, or remove if logo is verified
};

const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 0 0",
};

const paragraph = {
    margin: "0 0 15px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#3c4149",
};

const btnContainer = {
    textAlign: "center" as const,
};

const button = {
    backgroundColor: "#000000",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "12px",
};

const hr = {
    borderColor: "#dfe1e4",
    margin: "42px 0 26px",
};

const footer = {
    fontSize: "12px",
    lineHeight: "1.5",
    color: "#b4becc",
};
