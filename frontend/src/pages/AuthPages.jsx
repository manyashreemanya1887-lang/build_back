import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Recycle, ArrowRight, ShieldCheck, Lock, Mail, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPages() {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('tab') === 'register');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state (Spec Section 4)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('both');
  const [city, setCity] = useState('Mysuru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('570001');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register({
          name,
          email,
          phone,
          password,
          user_type: userType,
          city,
          state,
          pincode
        });
      } else {
        await login(email, password);
      }
      navigate('/marketplace');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@rebuildai.com');
      setPassword('Admin@1234');
      setIsRegister(false);
    } else if (role === 'seller') {
      setEmail('seller@demolitioncorp.com');
      setPassword('Seller@1234');
      setIsRegister(false);
    } else if (role === 'buyer') {
      setEmail('buyer@greenbuild.in');
      setPassword('Buyer@1234');
      setIsRegister(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
          <Recycle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {isRegister ? 'Join the Circular Marketplace' : 'Welcome Back'}
        </h1>
        <p className="text-xs text-slate-400">
          {isRegister ? 'Create an account as a Contractor, Buyer, or Recycler' : 'Sign in to access your listings, bids, and AI diagnostics'}
        </p>
      </div>

      {/* Demo Credentials Quick Switcher */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
          Quick Demo Access Accounts:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill('seller')}
            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-400 font-semibold transition-colors"
          >
            Seller
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('buyer')}
            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-400 font-semibold transition-colors"
          >
            Buyer
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('admin')}
            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-purple-400 font-semibold transition-colors"
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Auth Form Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Full Name / Organization</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Karnataka Demolition Ltd"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Account Role (User Type)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['seller', 'buyer', 'both'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type)}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                        userType === type
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98860 12345"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">PIN Code</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contractor@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          {isRegister ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Sign In here
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Register as Contractor / Buyer
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
