import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from './ui/button';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="mt-6">
          <Link to="/admin/orders">
            <Button variant="ghost" className="w-full justify-start">
              Manage Orders
            </Button>
          </Link>
          <Link to="/admin/spare-parts">
            <Button variant="ghost" className="w-full justify-start">
              Manage Spare Parts
            </Button>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;