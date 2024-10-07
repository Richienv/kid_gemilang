import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface SignUpProps {
  onSignUp: () => void;
  onBackToSignIn: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onBackToSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone_number: phoneNumber,
            company_name: companyName,
            address,
          }
        }
      });

      if (authError) {
        if (authError.status === 429) {
          throw new Error('Terlalu banyak percobaan. Silakan coba lagi nanti.');
        }
        throw authError;
      }

      if (authData.user) {
        const { error: insertError } = await supabase
          .from('clients')
          .insert({
            id: authData.user.id,
            name,
            email,
            phone_number: phoneNumber,
            company_name: companyName,
            address,
          });

        if (insertError) throw insertError;

        setIsLoading(false);
        toast({
          title: "Akun berhasil dibuat!",
          description: "Silakan masuk dengan akun baru Anda.",
          duration: 5000,
        });
        onBackToSignIn();
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error during sign up:', error);
      setError(error.message || 'Terjadi kesalahan saat membuat akun. Silakan coba lagi.');
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
          <p className="mt-2 text-gray-400">Buat akun baru</p>
        </div>
        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400"
              required
            />
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
            <Input
              type="tel"
              placeholder="Nomor Telepon"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400"
            />
            <Input
              type="text"
              placeholder="Nama Perusahaan"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400"
            />
            <Input
              type="text"
              placeholder="Alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>
        <div className="text-center">
          <button onClick={onBackToSignIn} className="text-sm text-gray-400 hover:text-blue-500">
            Sudah punya akun? Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;