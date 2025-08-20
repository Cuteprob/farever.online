import { Breadcrumb } from "@/components/ui/breadcrumb"

// 在文件顶部添加 metadata
export const metadata = {
  title: 'Privacy Policy - Bunny Market',
  description: 'Privacy policy and data collection practices for Bunny Market online game. Learn how we protect your information and maintain your privacy.',
  alternates: {
    canonical: 'https://bunnymarket.app/privacy'
  }
}

export default function PrivacyPolicy() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb 
        items={[
          { label: "Play Bunny Market", href: "/" },
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
              When you use Bunny Market, we collect certain information to improve your gaming experience and our services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Game progress and preferences</li>
              <li>Game data and records</li>
              <li>Performance metrics and gameplay statistics</li>
              <li>Device information and browser type</li>
              <li>IP address and general location data</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide and maintain our gaming services</li>
              <li>Improve game performance and user experience</li>
              <li>Track leaderboard rankings and achievements</li>
              <li>Detect and prevent cheating or abuse</li>
              <li>Send important game updates and notifications</li>
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
              Bunny Market integrates with third-party services for enhanced gaming experience. These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-heading text-primary mb-4">5. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@bunnymarket.app.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 