'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LifeOSLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/lifeos/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center p-4">

      {/* Background subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"/>

      <div className="relative w-full max-w-md">

        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-900/40 border border-green-800/50 mb-4">
            <span className="text-3xl">🌲</span>
          </div>
          <h1 className="text-2xl font-bold text-white">LifeOS</h1>
          <p className="text-green-600/70 text-sm mt-1">
            Where life grows wild
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 border border-green-900/40 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-white font-semibold text-lg mb-6">
            Sign in to continue
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-green-400/80 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-green-400/80 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-2.5">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Protected by SecureAuth-Lite · JWT Authentication
        </p>

      </div>
    </div>
  );
}