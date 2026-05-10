import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex-center">
      <div className="text-center py-24 px-4">
        <h1 className="font-theme-display text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">This page does not exist in Siagarta.</p>
        <Link href="/" className="btn-primary">
          Return to Guide Hub
        </Link>
      </div>
    </div>
  );
}
