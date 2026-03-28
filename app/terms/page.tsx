import { Breadcrumb } from "@/components/ui/breadcrumb"
import { siteConfig } from "@/lib/site-config"

export const runtime = 'edge';

export const metadata = {
  title: `Terms of Service - ${siteConfig.siteName}`,
  description: `Terms of service for ${siteConfig.siteName}, including acceptable use, site availability, and content rights.`,
  alternates: {
    canonical: `${siteConfig.siteUrl}/terms`
  }
}

export default function TermsOfService() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb 
        items={[
          { label: siteConfig.siteName, href: "/" },
          { label: "Terms of Service", href: "/terms" }
        ]} 
      />
      
      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <h1 className="text-3xl font-heading text-primary">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using {siteConfig.siteName}, you agree to these Terms of Service and applicable laws. If you do not agree, please do not use the site.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">2. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While using {siteConfig.siteName}, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Attempt to disrupt, overload, or damage the site or embedded game experience</li>
              <li>Use bots, scraping, or automated abuse against site features</li>
              <li>Upload or submit unlawful, harmful, or infringing content where user input is allowed</li>
              <li>Bypass technical restrictions or security protections</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">3. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The site design, branding, and original content of {siteConfig.siteName} are protected by applicable intellectual property laws. Embedded games, trademarks, and media may remain the property of their respective owners.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">4. Service Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update, suspend, remove, or change any part of {siteConfig.siteName} at any time without notice.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              {siteConfig.siteName} is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. To the fullest extent allowed by law, we are not liable for indirect or consequential damages arising from your use of the site.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">6. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may revise these terms from time to time. By continuing to use {siteConfig.siteName} after updates are posted, you agree to the revised terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
