import { Link } from "wouter";
import { Sparkles, Zap, Shield, Target, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-deep-black text-white overflow-hidden relative">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="particle animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-gold-primary" />
          <span className="text-2xl font-bold text-gold-primary">CareerCrafter</span>
        </div>
        <Link href="/api/login">
          <button className="btn-primary flex items-center space-x-2">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gold-primary/10 rounded-full px-4 py-2 mb-8">
            <Shield className="h-4 w-4 text-gold-primary" />
            <span className="text-sm text-gold-primary font-medium">100% Free Forever</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="block text-white">Craft Your</span>
            <span className="block text-transparent bg-clip-text gold-gradient animate-glow">
              Perfect Resume
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Create stunning, ATS-friendly resumes with AI-powered insights. 
            Get job match analysis, skill recommendations, and professional formatting 
            - all completely free.
          </p>
          
          <Link href="/api/login">
            <button className="btn-primary text-lg px-8 py-4 mb-8">
              Start Building Your Resume
            </button>
          </Link>
          
          <p className="text-sm text-gray-400">
            No credit card required • No hidden fees • Always free
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="card-3d-interactive p-8 text-center">
            <div className="w-16 h-16 bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-gold-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gold-primary">AI-Powered Enhancement</h3>
            <p className="text-gray-300">
              Get intelligent suggestions for your resume content, optimized for ATS systems and recruiters.
            </p>
          </div>
          
          <div className="card-3d-interactive p-8 text-center">
            <div className="w-16 h-16 bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-gold-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gold-primary">Job Match Analysis</h3>
            <p className="text-gray-300">
              Compare your resume against job descriptions and get actionable recommendations for improvement.
            </p>
          </div>
          
          <div className="card-3d-interactive p-8 text-center">
            <div className="w-16 h-16 bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-gold-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gold-primary">Always Free</h3>
            <p className="text-gray-300">
              No premium tiers, no hidden costs. All features are available to everyone, forever.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center card-glass p-12 rounded-2xl">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-white">Ready to land your</span>
            <br />
            <span className="text-gold-primary">dream job?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have crafted winning resumes with CareerCrafter.
          </p>
          <Link href="/api/login">
            <button className="btn-primary text-lg px-8 py-4">
              Create Your Resume Now
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-gold-primary" />
              <span className="text-lg font-semibold text-gold-primary">CareerCrafter</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gold-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2025 CareerCrafter. All rights reserved. Built with ❤️ for job seekers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}