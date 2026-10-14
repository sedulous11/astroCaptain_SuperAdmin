import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LogIn from "./pages/LogIn";
import Dashboard from "./pages/Dashboard";
import Pandits from "./pages/Pandits";
import { PanditProvider } from "./context/PanditContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Pooja from "./pages/Pooja";
import { PoojaProvider } from "./context/PoojaContext";
import { TempleProvider } from "./context/TempleContext";
import Temple from "./pages/Temple";
import Bookings from "./pages/Bookings";
import { BookingProvider } from "./context/BookingContext";

const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const Layout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen">
      {isAuthenticated && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <PanditProvider>
            <PoojaProvider>
              <TempleProvider>
                <BookingProvider>
                  <Routes>
                    <Route path="/login" element={<LogIn />} />
                    <Route element={<PrivateRoute />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/pandit" element={<Pandits />} />
                      <Route path="/pooja" element={<Pooja />} />
                      <Route path="/temple" element={<Temple />} />
                      <Route path="/bookings" element={<Bookings />} />
                    </Route>
                  </Routes>
                </BookingProvider>
              </TempleProvider>
            </PoojaProvider>
          </PanditProvider>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <Layout />
      </AuthProvider>
    </Router>
  );
};

export default App;
