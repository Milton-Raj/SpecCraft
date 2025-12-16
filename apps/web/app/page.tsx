import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-8">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600" />
            <span className="font-bold text-xl tracking-tight">SpecCraft</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link href="/auth/register">
              <Button size="sm" variant="premium">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(99,102,241,0.1),transparent)]" />
          <div className="container mx-auto flex flex-col items-center text-center px-4 md:px-6">
            <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                System 1.0 Live
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
              Turn Vague Ideas into{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Industry-Standard
              </span>{' '}
              Specs.
            </h1>
            <p className="mt-6 max-w-[42rem] text-muted-foreground sm:text-lg md:text-xl">
              Stop writing PRDs from scratch. SpecCraft uses advanced AI to
              convert your answers into IT-company-ready requirements documents,
              scope of work, and wireframe notes in minutes.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" variant="premium" className="w-full sm:w-auto">
                  Start Building for Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Sample Output
              </Button>
            </div>
            {/* Visual Placeholder for Credibility */}
            <div className="mt-16 w-full max-w-5xl rounded-xl border bg-muted/50 p-2 shadow-2xl lg:mt-24">
              <div className="aspect-video w-full rounded-lg bg-background shadow-inner flex items-center justify-center text-muted-foreground">
                [Product Screenshot / Feature Teaser Here]
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Not Just a Text Generator
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SpecCraft is an engineering tool. We focus on structure,
                clarity, and technical validity over creative fluff.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<FileText className="h-6 w-6" />}
                title="Structured Output"
                description="Generate PRDs, BRDs, and SRS documents that dev shops actually accept without 10 meetings."
              />
              <FeatureCard
                icon={<Layers className="h-6 w-6" />}
                title="Smart Context"
                description="Our AI engine detects contradictions in your requirements (e.g., 'Cheap' vs 'Enterprise SLA')."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Validation First"
                description="We force you to answer the hard questions about monetization and user flows before you start."
              />
            </div>
          </div>
        </section>

        {/* Pricing Peek */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>For early-stage founders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">₹499</div>
                  <p className="text-xs text-muted-foreground mt-1">per month</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>3 Documents / mo</li>
                    <li>Word Export</li>
                    <li>Basic AI Refinement</li>
                  </ul>
                  <Button className="mt-6 w-full" variant="outline">
                    Sign Up
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-indigo-500 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] px-2 py-1 rounded-bl">
                  POPULAR
                </div>
                <CardHeader>
                  <CardTitle>Professional</CardTitle>
                  <CardDescription>For serious builders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">₹1,499</div>
                  <p className="text-xs text-muted-foreground mt-1">per month</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>Unlimited Documents</li>
                    <li>Advanced AI Questioning</li>
                    <li>Priority Processing</li>
                  </ul>
                  <Button className="mt-6 w-full" variant="premium">
                    Go Pro
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Agency</CardTitle>
                  <CardDescription>For dev shops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">₹4,999</div>
                  <p className="text-xs text-muted-foreground mt-1">per month</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>Team Access</li>
                    <li>White-label Exports</li>
                    <li>Admin Dashboard</li>
                  </ul>
                  <Button className="mt-6 w-full" variant="outline">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href="#"
              className="font-medium underline underline-offset-4"
            >
              SpecCraft Inc
            </a>
            . The source code is available on{' '}
            <a
              href="#"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
