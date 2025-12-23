"use client";

import Link from "next/link";
import { Brain, Twitter, Linkedin, Github } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";

// Updated and reorganized footer links for a cleaner structure
const footerLinks = {
  platform: [
    { title: "Features", href: "/#features" },
    { title: "For Students", href: "/#for-students" },
    { title: "For Tutors", href: "/#fortutors" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Blog", href: "/blog" },
  ],
  resources: [
    { title: "Help Center", href: "/help" },
    { title: "Contact Support", href: "/contact" },
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
    <footer className="relative border-t bg-secondary pt-20 pb-8">
      {/* Large background icon for a unique, modern look */}
      <div
        aria-hidden="true"
        className="absolute inset-0 top-0 flex items-center justify-center"
      >
        <Brain className="h-96 w-96 text-primary/5 opacity-50" />
      </div>

      <Wrapper className="relative z-10">
        {/* Top section: Brand and Socials */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Brainy</span>
          </Link>
          <p className="mt-3 max-w-md text-muted-foreground">
            A smarter way to learn, designed for students and educators who
            demand excellence.
          </p>
          <div className="mt-6 flex space-x-6">
            {socialLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                aria-label={link["aria-label"]}
                className="text-muted-foreground transition-transform hover:scale-110 hover:text-primary"
              >
                <link.icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-border" />

        {/* Main Footer Content: Link Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-foreground">Platform</h3>
            <ul className="mt-4 space-y-3">
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
          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
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
          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
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
          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
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

        {/* Sub-Footer: Copyright */}
        <div className="mt-16 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Brainy, Inc. All rights reserved. A Ctrotech
            Tutor Insights Project.
          </p>
        </div>
      </Wrapper>
    </footer>
  );
};

export default Footer;
