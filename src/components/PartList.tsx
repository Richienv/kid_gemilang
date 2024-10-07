import React, { useState, useEffect } from 'react';
import { Part } from '../types';
import { supabase } from '../lib/supabase';
import { Info, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from './ui/use-toast';

const PartList: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('spare_parts')
        .select('*');

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Error fetching parts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch parts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (part: Part) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('cart')
        .insert({ user_id: user.id, part_id: part.id, quantity: 1 });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item added to cart successfully.",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p>Loading...</p>
      ) : parts.length === 0 ? (
        <p>No spare parts available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parts.map((part) => (
            <Card key={part.id} className="flex flex-col overflow-hidden">
              <img src={part.image} alt={part.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle className="text-xl font-bold">{part.name}</CardTitle>
                <p className="text-sm text-gray-500">{part.part_number}</p>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-blue-600">{formatPrice(part.price)}</p>
                <p className="text-sm text-gray-600">Stock: {part.stock_availability}</p>
                <p className="text-sm text-gray-600">Category: {part.category}</p>
                <p className="text-sm text-gray-600">Compatible: {part.compatible_vehicles.join(', ')}</p>
              </CardContent>
              <CardFooter className="mt-auto space-x-2">
                <Button onClick={() => setSelectedPart(part)} variant="outline" className="flex-1">
                  <Info className="mr-2 h-4 w-4" /> Details
                </Button>
                <Button onClick={() => handleAddToCart(part)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={selectedPart !== null} onOpenChange={() => setSelectedPart(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{selectedPart?.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="space-y-2">
              <p><strong>Part Number:</strong> {selectedPart?.part_number}</p>
              <p><strong>Category:</strong> {selectedPart?.category}</p>
              <p><strong>Compatible Vehicles:</strong> {selectedPart?.compatible_vehicles.join(', ')}</p>
              <p><strong>Price:</strong> {selectedPart && formatPrice(selectedPart.price)}</p>
              <p><strong>Stock:</strong> {selectedPart?.stock_availability}</p>
              <p><strong>Description:</strong> {selectedPart?.description}</p>
              <div>
                <h4 className="font-semibold mt-4">Specifications:</h4>
                <ul className="list-disc pl-5 mt-2">
                  {selectedPart?.specifications && Object.entries(selectedPart.specifications).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartList;