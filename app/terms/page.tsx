import { Breadcrumb } from "@/components/ui/breadcrumb"

export const metadata = {
  title: 'Terms of Service - Bunny Market',
  description: 'Terms of service and user guidelines for Bunny Market online game. Read about our policies, user conduct, and service terms.',
  alternates: {
    canonical: 'https://bunnymarket.app/terms'
  }
}

export default function TermsOfService() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb 
        items={[
          { label: "Play Bunny Market", href: "/" },
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
              By accessing and using Bunny Market, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">2. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Users are expected to maintain appropriate behavior while using Bunny Market. The following actions are strictly prohibited:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Cheating, hacking, or exploiting game mechanics</li>
              <li>Creating offensive or inappropriate content</li>
              <li>Harassing or abusing other players</li>
              <li>Attempting to damage or disrupt the service</li>
              <li>Using automated systems or bots</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">3. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bunny Market and all related content, features, and functionality are owned by us and protected by international copyright, trademark, and other intellectual property laws. User-created content remains the property of their creators, but we reserve the right to use, modify, or remove them as needed.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">4. Service Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any part of Bunny Market at any time without notice. We will not be liable if any part of the service becomes unavailable at any time for any period.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bunny Market is provided &quot;as is&quot; without any warranties. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">6. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may revise these terms at any time without notice. By continuing to use Bunny Market after any changes, you agree to be bound by the revised terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 