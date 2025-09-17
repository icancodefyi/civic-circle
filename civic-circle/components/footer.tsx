import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Platform", href: "#" },
    { name: "Features", href: "#" },
    { name: "Security", href: "#" },
    { name: "Documentation", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Leadership", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press Kit", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Training", href: "#" },
    { name: "Status", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Compliance", href: "#" },
    { name: "Security", href: "#" },
  ],
}

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
]

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-primary-foreground/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Subscribe to receive updates on platform developments and civic engagement best practices.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter email address"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-secondary rounded-lg"></div>
                <span className="text-xl font-semibold">Civic Circle</span>
              </div>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed text-sm">
                Professional civic engagement platform connecting communities with local government through secure, efficient communication channels.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-9 h-9 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors duration-200"
                  >
                    <social.icon className="h-4 w-4 text-primary-foreground/80" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div>
              <h4 className="font-medium mb-4 text-primary-foreground">Platform</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-primary-foreground">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-primary-foreground">Support</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4 text-primary-foreground">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 text-sm">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Civic Circle. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-primary-foreground/60">
              <span>Enterprise Grade</span>
              <span>•</span>
              <span>SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
