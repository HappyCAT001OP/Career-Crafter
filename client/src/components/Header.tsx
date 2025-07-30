import { Link, useLocation } from "wouter";
import { FileText, User, LogOut, Crown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: FileText },
    { name: "Resume Builder", href: "/resume-builder", icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-primary/20 bg-deep-black/95 backdrop-blur supports-[backdrop-filter]:bg-deep-black/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-gold-primary to-gold-secondary rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <Crown className="h-5 w-5 text-deep-black" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-light-yellow rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gold-primary to-light-yellow bg-clip-text text-transparent">
                  CareerCrafter
                </h1>
                <p className="text-xs text-gray-400 -mt-1">AI-Powered Resume Builder</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <button className={`nav-link ${isActive(item.href) ? "nav-link-active" : ""}`}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Free Badge */}
                <div className="hidden sm:flex items-center">
                  <span className="badge-free">Free Plan</span>
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gold-primary/30"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gold-primary/20 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gold-primary" />
                    </div>
                  )}
                </div>

                {/* Logout */}
                <a
                  href="/api/logout"
                  className="btn-ghost p-2"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </a>
              </>
            ) : (
              <a href="/api/login" className="btn-primary">
                Sign In
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t border-gold-primary/20">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-nav-link ${isActive(item.href) ? "mobile-nav-link-active" : ""}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}