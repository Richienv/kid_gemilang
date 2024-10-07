import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  part_id: string;
  quantity: number;
  spare_parts: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

const Keranjang: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('cart')
        .select(`
          id,
          part_id,
          quantity,
          spare_parts (
            id,
            name,
            price,
            image
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to fetch cart items. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to update quantity. Please try again.",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast({
        variant: 'success',
        title: "Success",
        description: "Item removed from cart.",
      });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to remove item. Please try again.",
      });
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.spare_parts.price * item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
      {cartItems.length === 0 ? (
        <p>Keranjang Anda kosong.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <img src={item.spare_parts.image} alt={item.spare_parts.name} className="w-16 h-16 object-cover mr-4" />
                <div>
                  <h2 className="font-semibold">{item.spare_parts.name}</h2>
                  <p className="text-gray-600">{formatPrice(item.spare_parts.price)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                  <Minus size={16} />
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-4"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xl font-semibold">Total: {formatPrice(totalPrice)}</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate('/pengiriman')}
            >
              Lanjutkan ke Pembayaran
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Keranjang;