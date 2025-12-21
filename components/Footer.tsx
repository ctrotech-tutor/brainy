"use client";

import Link from "next/link";
import { Brain, Twitter, Linkedin, Github, Send } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Data for footer links
const footerLinks = {
  platform: [
    { title: "Features", href: "/#features" },
    { title: "Pricing", href: "/pricing" },
    { title: "For Students", href: "/#for-students" },
    { title: "For Tutors", href: "/#fortutors" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Careers", href: "/careers" },
    { title: "Blog", href: "/blog" },
    { title: "Contact Us", href: "/contact" },
  ],
  legal: [
    { title: "Terms of Service", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", "aria-label": "Twitter profile" },
  { icon: Github, href: "#", "aria-label": "GitHub profile" },
  { icon: Linkedin, href: "#", "aria-label": "LinkedIn profile" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary/50 pt-16 pb-8">
      <Wrapper>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Column 1: Brand & Socials */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground">Brainy</span>
            </Link>
            <p className="mt-4 max-w-xs text-muted-foreground">
              A smarter way to learn, designed for students and educators who
              demand excellence.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  aria-label={link["aria-label"]}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <link.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 & 3: Navigation Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-4">
            <div>
              <h3 className="font-semibold text-foreground">Platform</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.platform.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Company</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="md:col-span-4">
            <h3 className="font-semibold text-foreground">Stay Updated</h3>
            <p className="mt-2 text-muted-foreground">
              Get the latest news, feature updates, and educational tips from our team.
            </p>
            <form className="mt-4 flex w-full max-w-sm items-center space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                aria-label="Email for newsletter"
              />
              <Button type="submit" size="icon" aria-label="Subscribe">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Sub-Footer: Copyright & Legal Links */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Brainy, Inc. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
};

export default Footer;
