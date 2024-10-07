import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SignInProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onSignIn();
    } catch (error) {
      setError('Data akun tidak ditemukan, password atau username salah');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800 p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            <span className="text-red-500">KID </span>
            <span className="text-blue-500">GEMILANG</span>
          </h2>
          <p className="mt-2 text-gray-400">Belum punya akun? <button onClick={onSignUp} className="text-blue-500 hover:underline">Buat Akun</button></p>
        </div>
        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Masuk
          </Button>
        </form>
        <div className="text-center">
          <a href="#" className="text-sm text-gray-400 hover:text-blue-500">Lupa Password?</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;