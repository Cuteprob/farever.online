import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { GuideMarkdown } from "@/components/guide-markdown";
import { GuidePageData, guidePages } from "@/data/guides";
import { siteConfig } from "@/lib/site-config";

function extractSections(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const title = line.replace(/^##\s+/, "").trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return { id, title };
    });
}

export function GuidePage({ guide }: { guide: GuidePageData }) {
  const sections = extractSections(guide.content);
  const relatedGuides = guidePages.filter((item) => item.slug !== guide.slug).slice(0, 2);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: siteConfig.siteName, href: "/" },
          { label: guide.heading, href: `/${guide.slug}` },
        ]}
      />

      <section className="relative mt-8 overflow-hidden rounded-[28px] border border-theme-dark-600 bg-[radial-gradient(circle_at_top_left,_rgba(255,115,0,0.22),_transparent_30%),linear-gradient(135deg,rgba(18,18,24,0.98),rgba(10,10,14,0.94))] px-6 py-10 shadow-neon sm:px-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_60%)] lg:block" />
        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-theme-fire-500/40 bg-theme-fire-500/10 px-4 py-1 text-xs font-theme-heading uppercase tracking-[0.25em] text-primary">
            Strategy Guide
          </div>
          <h1 className="font-theme-display text-4xl font-black leading-tight text-white sm:text-5xl">
            {guide.heading}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            {guide.intro}
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <article className="overflow-hidden rounded-[24px] border border-theme-dark-600 bg-theme-dark-800/90 shadow-game">
          <div className="border-b border-theme-dark-600 bg-theme-dark-900/80 px-6 py-5 sm:px-8">
            <h2 className="font-theme-heading text-xl font-bold text-primary">Guide Overview</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              This page is designed to help players understand the system logic behind Scritchy Scratchy, not just the surface-level mechanics.
            </p>
          </div>
          <div className="px-6 py-8 sm:px-8">
            <GuideMarkdown content={guide.content} />
          </div>
        </article>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[24px] border border-theme-dark-600 bg-theme-dark-800/95 p-6 shadow-game">
            <h2 className="font-theme-heading text-lg font-bold text-primary">On This Page</h2>
            <div className="mt-4 space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-xl border border-transparent bg-theme-dark-700/60 px-4 py-3 text-sm text-slate-200 transition-all hover:border-theme-fire-500/40 hover:bg-theme-dark-700 hover:text-white"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-theme-dark-600 bg-gradient-to-br from-theme-dark-800 to-theme-dark-900 p-6 shadow-game">
            <h2 className="font-theme-heading text-lg font-bold text-primary">More Scritchy Scratchy Reading</h2>
            <div className="mt-4 space-y-3">
              {relatedGuides.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="block rounded-2xl border border-theme-dark-600 bg-black/10 px-4 py-4 transition-all hover:border-theme-fire-500/50 hover:bg-black/20"
                >
                  <div className="text-sm font-semibold text-white">{item.heading}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-300">{item.metaDescription}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-theme-dark-600 bg-theme-dark-800/95 p-6 shadow-game">
            <h2 className="font-theme-heading text-lg font-bold text-primary">Quick Links</h2>
            <div className="mt-4 grid gap-3">
              <Link href="/" className="btn-primary text-center">
                Play {siteConfig.siteName}
              </Link>
              <Link href="/terms" className="btn-secondary text-center">
                Terms of Service
              </Link>
              <Link href="/privacy" className="btn-secondary text-center">
                Privacy Policy
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
