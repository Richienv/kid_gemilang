import React, { useState, useEffect } from 'react';
import { Truck, User, ShoppingCart, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';

interface HeaderProps {
  session: any;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ session, onLogout }) => {
  const [clientName, setClientName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchClientName();
      fetchUnreadNotifications();
    }
  }, [session]);

  const fetchClientName = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('name')
        .eq('id', session.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No client name found, using email as fallback');
          setClientName(session.user.email);
        } else {
          throw error;
        }
      } else if (data) {
        setClientName(data.name);
      }
    } catch (error) {
      console.error('Error fetching client name:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user information. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('read', false);

      if (error) throw error;
      setUnreadNotifications(count || 0);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          KID GEMILANG
        </Link>
        {session ? (
          <div className="flex items-center space-x-4">
            <Link to="/keranjang">
              <Button variant="ghost">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Keranjang
              </Button>
            </Link>
            <Link to="/notifications">
              <Button variant="ghost" className="relative">
                <Bell className="mr-2 h-4 w-4" />
                Notifikasi
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User className="mr-2 h-4 w-4" />
                {clientName || 'User'}
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Pengaturan
                  </Link>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/signin">
            <Button>
              <User className="mr-2 h-4 w-4" />
              Masuk
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;