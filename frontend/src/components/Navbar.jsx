import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Recycle, Cpu, PlusCircle, LayoutDashboard,
  ShieldCheck, LogIn, LogOut, User, Menu, X, BarChart3, Search
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isSeller, isAdmin, isBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                REBUILD<span className="text-emerald-400 font-extrabold ml-1">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Circular C&D
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/marketplace')
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              Explore Marketplace
            </Link>

            <Link
              to="/create-listing"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/create-listing')
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Sell Material
            </Link>

            <Link
              to="/model-evaluation"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/model-evaluation')
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              AI Metrics
            </Link>

            {user && (
              <>
                {isSeller && (
                  <Link
                    to="/seller-dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/seller-dashboard')
                        ? 'bg-slate-800 text-emerald-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Seller Hub
                  </Link>
                )}

                {isBuyer && (
                  <Link
                    to="/buyer-dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/buyer-dashboard')
                        ? 'bg-slate-800 text-emerald-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Buyer Hub
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/admin')
                        ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                        : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Auth actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-200">{user.name}</div>
                  <div className="text-xs text-emerald-400 capitalize">{user.user_type} • {user.city}</div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 shadow-md shadow-emerald-500/20 transition-all"
                >
                  Join Platform
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/marketplace"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Explore Marketplace
          </Link>
          <Link
            to="/create-listing"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-slate-800"
          >
            Sell Material (AI Scanner)
          </Link>
          <Link
            to="/model-evaluation"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-cyan-400 hover:bg-slate-800"
          >
            AI Model Metrics
          </Link>
          {user && (
            <>
              {isSeller && (
                <Link
                  to="/seller-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  Seller Hub
                </Link>
              )}
              {isBuyer && (
                <Link
                  to="/buyer-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  Buyer Hub
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-purple-300 hover:bg-slate-800"
                >
                  Admin Governance
                </Link>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center px-3">
                <span className="text-sm text-slate-400">{user.name}</span>
                <button
                  onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}
                  className="text-sm text-rose-400"
                >
                  Logout
                </button>
              </div>
            </>
          )}
          {!user && (
            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-sm text-slate-300 bg-slate-900 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/auth?tab=register"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
