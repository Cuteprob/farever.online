import { Breadcrumb } from "@/components/ui/breadcrumb"

export const metadata = {
  title: 'Terms of Service - Sprunksters',
  description: 'Terms of service and user guidelines for Sprunksters online game. Read about our policies, user conduct, and service terms.',
  alternates: {
    canonical: 'https://sprunksters.top/terms'
  }
}

export default function TermsOfService() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb 
        items={[
          { label: "Play Sprunksters", href: "/" },
          { label: "Terms of Service", href: "/terms" }
        ]} 
      />
      
      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <h1 className="text-3xl font-heading text-primary">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-text-secondary leading-relaxed">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">1. Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing and using Sprunksters, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">2. User Conduct</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Users are expected to maintain appropriate behavior while using Sprunksters. The following actions are strictly prohibited:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-secondary">
              <li>Cheating, hacking, or exploiting game mechanics</li>
              <li>Creating offensive or inappropriate track content</li>
              <li>Harassing or abusing other players</li>
              <li>Attempting to damage or disrupt the service</li>
              <li>Using automated systems or bots</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">3. Intellectual Property</h2>
            <p className="text-text-secondary leading-relaxed">
              Sprunksters and all related content, features, and functionality are owned by us and protected by international copyright, trademark, and other intellectual property laws. User-created tracks remain the property of their creators, but we reserve the right to use, modify, or remove them as needed.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">4. Service Modifications</h2>
            <p className="text-text-secondary leading-relaxed">
              We reserve the right to modify, suspend, or discontinue any part of Sprunksters at any time without notice. We will not be liable if any part of the service becomes unavailable at any time for any period.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">5. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              Sprunksters is provided &quot;as is&quot; without any warranties. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">6. Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We may revise these terms at any time without notice. By continuing to use Sprunksters after any changes, you agree to be bound by the revised terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 