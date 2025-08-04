import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, FileText, Users, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default async function HomePage() {
  const { userId } = await auth()
  
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="particle w-2 h-2 top-10 left-10 opacity-30" style={{ animationDelay: '0s' }}></div>
        <div className="particle w-1 h-1 top-20 right-20 opacity-20" style={{ animationDelay: '1s' }}></div>
        <div className="particle w-3 h-3 bottom-20 left-1/4 opacity-25" style={{ animationDelay: '2s' }}></div>
        <div className="particle w-1 h-1 top-1/2 right-1/3 opacity-15" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-yellow-400" />
          <span className="text-2xl font-bold gradient-text">Career Crafter</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Resume Builder
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Craft Your
            <span className="gradient-text block">Dream Career</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Build professional resumes with AI assistance, job matching analysis, and instant PDF generation. 
            Stand out in today's competitive job market.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-6">
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black text-lg px-8 py-6">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose Career Crafter?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
                <CardTitle className="text-xl">AI-Powered Content</CardTitle>
                <CardDescription className="text-gray-400">
                  Generate professional summaries and bullet points with advanced AI assistance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-yellow-400" />
                </div>
                <CardTitle className="text-xl">Instant PDF Export</CardTitle>
                <CardDescription className="text-gray-400">
                  Generate professional PDF resumes with multiple templates and sharing options
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-white">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <CardTitle className="text-xl">Job Matching</CardTitle>
                <CardDescription className="text-gray-400">
                  Analyze your resume against job descriptions and get skill gap insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-20 px-6 bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-gray-400">Resumes Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-400">AI Assistance</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Career?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who have transformed their careers with Career Crafter
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <span className="text-lg font-bold gradient-text">Career Crafter</span>
          </div>
          <div className="text-gray-400 text-sm">
            © 2024 Career Crafter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
