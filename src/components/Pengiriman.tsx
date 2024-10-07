import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useNavigate } from 'react-router-dom';

const Pengiriman: React.FC = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('cart')
        .select('quantity, spare_parts(price)')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data.reduce((sum, item) => sum + (item.quantity * item.spare_parts.price), 0);
      setTotalPrice(total);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cart items. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create the order using user_id as both user_id and client_id
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          client_id: user.id,
          total_price: totalPrice,
          status: 'pending',
          payment_method: paymentMethod
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Clear the cart
      const { error: cartError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
      setIsDialogOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: "Failed to process the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pengiriman</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ringkasan Belanja</h2>
        <p className="text-lg mb-4">Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice)}</p>
        <Button onClick={() => setIsDialogOpen(true)}>Pilih Pembayaran</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
          </DialogHeader>
          <Select onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih metode pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purchase_order">Purchase Order</SelectItem>
              <SelectItem value="cash" disabled>Cash (Coming Soon)</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4">
            <p className="font-semibold">Total Tagihan: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPrice)}</p>
          </div>
          <Button onClick={handlePaymentSubmit} className="w-full mt-4">Konfirmasi Pembayaran</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pengiriman;