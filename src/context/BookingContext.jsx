import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("pandit");
  const [bookings, setBookings] = useState([]);
  const [epoojaBookings, setEpoojaBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const [panditRes, epoojaRes] = await Promise.all([
          axios.get(`${API_URL}/api/superadmin/getBookings`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/api/superadmin/getEBookings`, {
            withCredentials: true,
          }),
        ]);

        setBookings(
          Array.isArray(panditRes?.data?.data) ? panditRes.data.data : []
        );
        setEpoojaBookings(
          Array.isArray(epoojaRes?.data?.bookingDetails)
            ? epoojaRes.data.bookingDetails
            : []
        );
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <BookingContext.Provider
      value={{
        activeTab,
        setActiveTab,
        bookings,
        epoojaBookings,
        loading,
        error,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => useContext(BookingContext);
