import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Upload, User } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface SettingsProps {
  session: any;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ session, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const { user } = session;

      let { data, error, status } = await supabase
        .from('clients')
        .select('name, email, phone_number, company_name, address, avatar_url')
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setName(data.name);
        setEmail(data.email || user.email);
        setPhoneNumber(data.phone_number);
        setCompanyName(data.company_name);
        setAddress(data.address);
        setAvatarUrl(data.avatar_url);
      } else {
        const { error: insertError } = await supabase
          .from('clients')
          .insert({ id: user.id, name: user.email, email: user.email });

        if (insertError) throw insertError;

        setName(user.email);
        setEmail(user.email);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error loading user data!",
        duration: 5000,
      });
      console.error('Error in getProfile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { user } = session;

      if (!email) {
        throw new Error("Email is required");
      }

      let newAvatarUrl = avatarUrl;
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('client_profile_pictures')
          .upload(fileName, avatar);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          throw uploadError;
        }

        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('client_profile_pictures')
            .getPublicUrl(fileName);

          if (urlData) {
            newAvatarUrl = urlData.publicUrl;
          }
        }
      }

      const updates = {
        id: user.id,
        name,
        email,
        phone_number: phoneNumber,
        company_name: companyName,
        address,
        avatar_url: newAvatarUrl,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('clients').upsert(updates);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      setAvatarUrl(newAvatarUrl);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
        duration: 5000,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error updating the data!",
        duration: 5000,
      });
      console.error('Error in updateProfile:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h2 className="text-2xl font-bold mb-4">Pengaturan Profil</h2>
      <div className="mb-6">
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {previewUrl || avatarUrl ? (
              <img
                src={previewUrl || avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} className="text-gray-400" />
            )}
          </div>
          <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
            <Upload size={20} className="mr-2" />
            {avatar ? 'Ganti Foto' : 'Unggah Foto'}
          </label>
        </div>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
          <Input
            id="name"
            type="text"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
          <Input
            id="phoneNumber"
            type="tel"
            value={phoneNumber || ''}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
          <Input
            id="companyName"
            type="text"
            value={companyName || ''}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat</label>
          <Input
            id="address"
            type="text"
            value={address || ''}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">Batal</Button>
          <Button onClick={updateProfile} disabled={loading}>
            {loading ? 'Menyimpan ...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;