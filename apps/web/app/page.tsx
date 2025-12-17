import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Layers, ShieldCheck, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
// TeamSection import removed
import { PricingGrid } from '@/components/landing/PricingGrid';
import { HeaderAuth } from '@/components/landing/HeaderAuth';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col relative text-slate-800 font-sans">
      {/* Fixed Background Layer to prevent scroll expansion */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/30 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/30 blur-[100px]" />
      </div>

      {/* Navbar - Glass - Fixed position to ensure it's always there and smooth */}
      <header className="fixed top-6 left-0 right-0 z-50 mx-auto w-[95%] max-w-7xl rounded-full glass-panel px-6 py-3 flex items-center justify-between transition-all duration-300 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-pink-500 p-2 rounded-lg">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">SpecCraft</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </nav>

        <HeaderAuth />
      </header>

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 md:pt-40">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/60 shadow-sm backdrop-blur-md">
              <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
              <span className="text-xs font-semibold text-slate-600">AI-Powered PRD Generator</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] text-slate-900">
              Draft Specs in <br />
              <span className="text-gradient">Seconds, Not Days.</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-md leading-relaxed">
              Stop writing documents from scratch. Let our advanced AI architecture turn your vague ideas into enterprise-grade requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register">
                <button className="btn-premium px-8 py-4 rounded-full text-base font-bold flex items-center gap-2 group">
                  Start Creating Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold shadow-sm border border-slate-200 hover:bg-slate-50 transition-all">
                View Demo
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-10 w-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs overflow-hidden`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-slate-600">
                <span className="text-indigo-600 font-bold">1000+</span> PMs trust SpecCraft
              </div>
            </div>
          </div>

          {/* Hero Visual - Premium 3D Glass Card Effect */}
          <div className="relative h-[600px] w-full hidden lg:block">
            {/* Main Dashboard Preview Card */}
            <div className="absolute top-10 left-10 right-0 bottom-20 glass-panel rounded-2xl p-6 transform rotate-[-2deg] hover:rotate-0 transition-all duration-500 z-20">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs text-gray-400">Untitled Project.prd</div>
              </div>
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-100/50 rounded animate-pulse" />
                <div className="h-32 w-full bg-gray-50/50 rounded p-4 text-sm text-gray-400 font-mono">
                  # Product Requirements<br />
                  ## 1. Overview<br />
                  The system shall provide a comprehensive dashboard for...
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-indigo-50/50 rounded border border-indigo-100" />
                  <div className="h-20 bg-purple-50/50 rounded border border-purple-100" />
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-0 right-[-20px] p-4 glass-panel rounded-xl z-30 animate-bounce delay-700 shadow-xl">
              <ShieldCheck className="h-8 w-8 text-green-500" />
            </div>
            <div className="absolute bottom-40 left-[-20px] p-4 glass-panel rounded-xl z-30 animate-bounce delay-200 shadow-xl">
              <FileText className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
        </div>


        {/* Features Section */}
        <div id="features" className="py-20 md:py-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Not Just a Text Generator</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">SpecCraft is an engineering tool. We focus on structure, clarity, and technical validity over creative fluff.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Structured Output", desc: "Generate PRDs, BRDs, and SRS documents that dev shops actually accept without 10 meetings." },
              { icon: Layers, title: "Smart Context", desc: "Our AI engine detects contradictions in your requirements (e.g., 'Cheap' vs 'Enterprise SLA')." },
              { icon: ShieldCheck, title: "Validation First", desc: "We force you to answer the hard questions about monetization and user flows before you start." }
            ].map((feature, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl hover:translate-y-[-5px] transition-transform duration-300">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <div id="how-it-works" className="py-20 md:py-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">From Idea to Spec in 3 Steps</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our AI acts as a senior product manager, guiding you through the discovery process.</p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 -z-10" />

            {[
              { step: 1, title: "Tell Us Your Idea", desc: "Start with a simple sentence: 'I want to build a Tinder for dog walkers'." },
              { step: 2, title: "AI Interview", desc: "SpecCraft asks clarifying questions: 'How do walkers get paid?', 'Is there a rating system?'" },
              { step: 3, title: "Generate & Export", desc: "Receive a full PRD/SRS document, ready for development. Export to PDF or Word." }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="h-24 w-24 rounded-full bg-white border-4 border-indigo-50 shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">{s.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-600 max-w-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Pricing Section - Dynamic from API */}
        <section id="pricing" className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Choose the perfect plan for your project needs. No hidden fees.
              </p>
            </div>

            <PricingGrid />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-indigo-500 to-pink-500 p-2 rounded-lg">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">SpecCraft</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Turning vague ideas into professional engineering specifications with the power of AI.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#features" className="hover:text-indigo-600">Features</a></li>
                <li><a href="#pricing" className="hover:text-indigo-600">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-indigo-600">How it Works</a></li>
                <li><a href="#" className="hover:text-indigo-600">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} SpecCraft Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              {/* Social Placeholders */}
              <div className="h-5 w-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer" />
              <div className="h-5 w-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer" />
              <div className="h-5 w-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}
