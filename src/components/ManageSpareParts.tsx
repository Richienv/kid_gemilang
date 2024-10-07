import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface SparePart {
  id: string;
  name: string;
  part_number: string;
  price: number;
  stock_availability: number;
}

const ManageSpareParts: React.FC = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [newPart, setNewPart] = useState<Partial<SparePart>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const { data, error } = await supabase
        .from('spare_parts')
        .select('*')
        .order('name');

      if (error) throw error;
      setSpareParts(data || []);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch spare parts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPart({ ...newPart, [name]: value });
  };

  const addSparePart = async () => {
    try {
      const { data, error } = await supabase
        .from('spare_parts')
        .insert([newPart])
        .select();

      if (error) throw error;

      setSpareParts([...spareParts, data[0]]);
      setNewPart({});
      toast({
        title: "Success",
        description: "New spare part added successfully.",
      });
    } catch (error) {
      console.error('Error adding spare part:', error);
      toast({
        title: "Error",
        description: "Failed to add new spare part. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('spare_parts')
        .update({ stock_availability: newStock })
        .eq('id', id);

      if (error) throw error;

      setSpareParts(spareParts.map(part => 
        part.id === id ? { ...part, stock_availability: newStock } : part
      ));

      toast({
        title: "Success",
        description: "Stock updated successfully.",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Spare Parts</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add New Spare Part</h3>
        <div className="flex space-x-2">
          <Input
            name="name"
            placeholder="Name"
            value={newPart.name || ''}
            onChange={handleInputChange}
          />
          <Input
            name="part_number"
            placeholder="Part Number"
            value={newPart.part_number || ''}
            onChange={handleInputChange}
          />
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={newPart.price || ''}
            onChange={handleInputChange}
          />
          <Input
            name="stock_availability"
            type="number"
            placeholder="Stock"
            value={newPart.stock_availability || ''}
            onChange={handleInputChange}
          />
          <Button onClick={addSparePart}>Add Part</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Part Number
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {spareParts.map((part) => (
              <tr key={part.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {part.name}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {part.part_number}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  Rp {part.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  {part.stock_availability}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <Input
                    type="number"
                    className="w-20 mr-2"
                    defaultValue={part.stock_availability}
                    onBlur={(e) => updateStock(part.id, parseInt(e.target.value))}
                  />
                  <Button onClick={() => updateStock(part.id, part.stock_availability + 1)}>+</Button>
                  <Button 
                    onClick={() => updateStock(part.id, Math.max(0, part.stock_availability - 1))}
                    className="ml-2"
                  >
                    -
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSpareParts;