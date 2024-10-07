import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import PartList from './components/PartList'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Settings from './components/Settings'
import Keranjang from './components/Keranjang'
import Pengiriman from './components/Pengiriman'
import Notifications from './components/Notifications'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import ManageOrders from './components/ManageOrders'
import ManageSpareParts from './components/ManageSpareParts'
import { supabase } from './lib/supabase'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import { useToast } from './components/ui/use-toast'

function App() {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setSession(null)
      setIsAdmin(false)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error('Error logging out:', error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {!isAdmin && <Header session={session} onLogout={handleLogout} />}
        <main className="py-8">
          <Routes>
            <Route path="/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
            {isAdmin ? (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />}>
                  <Route path="orders" element={<ManageOrders />} />
                  <Route path="spare-parts" element={<ManageSpareParts />} />
                </Route>
                <Route path="/admin/*" element={<Navigate to="/admin/dashboard/orders" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={session ? <PartList /> : <SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/settings" element={session ? <Settings session={session} onClose={() => <Navigate to="/" />} /> : <Navigate to="/" />} />
                <Route path="/keranjang" element={session ? <Keranjang /> : <Navigate to="/" />} />
                <Route path="/pengiriman" element={session ? <Pengiriman /> : <Navigate to="/" />} />
                <Route path="/notifications" element={session ? <Notifications /> : <Navigate to="/" />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App