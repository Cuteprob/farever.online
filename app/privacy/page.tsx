import { Breadcrumb } from "@/components/ui/breadcrumb"
import { siteConfig } from "@/lib/site-config"

export const runtime = 'edge';

export const metadata = {
  title: `Privacy Policy - ${siteConfig.siteName}`,
  description: `Privacy policy for ${siteConfig.siteName}, including how site analytics, gameplay data, and support requests are handled.`,
  alternates: {
    canonical: `${siteConfig.siteUrl}/privacy`
  }
}

export default function PrivacyPolicy() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb 
        items={[
          { label: siteConfig.siteName, href: "/" },
          { label: "Privacy Policy", href: "/privacy" }
        ]} 
      />
      
      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <h1 className="text-3xl font-heading text-primary">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you use {siteConfig.siteName}, we may collect limited information needed to operate the site and understand how people use the game:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Basic technical data such as browser type, device type, and approximate region</li>
              <li>Gameplay-related events needed to load and operate the embedded game</li>
              <li>Anonymous traffic and engagement metrics from configured analytics tools</li>
              <li>Device information and browser type</li>
              <li>Information you choose to send us, such as support emails or feedback</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Deliver the game site and keep it available</li>
              <li>Measure performance, errors, and basic usage trends</li>
              <li>Improve page quality, loading speed, and gameplay experience</li>
              <li>Respond to support requests and abuse reports</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">3. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">4. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.siteName} may rely on third-party providers for hosting, analytics, embedded game delivery, and advertising. Those providers may process data under their own privacy policies.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">5. Your Choices</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can control cookies and storage through your browser settings. If you do not want analytics to run, you can also use browser privacy controls or content blockers where supported.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">5. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at: {siteConfig.siteEmail || "support@example.com"}
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 
