import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Bell } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface Notification {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to fetch notifications. Please try again later.",
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <Bell className="mr-2" /> Notifications
      </h1>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 rounded-lg shadow ${
                notification.read ? 'bg-gray-100' : 'bg-blue-50'
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <p className="text-gray-800">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(notification.created_at).toLocaleString()}
              </p>
              {!notification.read && (
                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-2">
                  New
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;