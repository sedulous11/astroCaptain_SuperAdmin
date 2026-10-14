import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const PanditContext = createContext();

export const PanditProvider = ({ children }) => {
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPandit, setEditingPandit] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isAuthenticated) {
      fetchPandits();
    }
  }, [isAuthenticated]);

  const fetchPandits = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/superadmin/get-allpandits`,
        { withCredentials: true }
      );
      setPandits(response?.data?.PanditData || []);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred!";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setPandits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "slug") {
      newValue = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    setEditFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <PanditContext.Provider
      value={{
        pandits,
        setPandits,
        loading,
        setLoading,
        editingPandit,
        setEditingPandit,
        editFormData,
        setEditFormData,
        isAddModalOpen,
        setIsAddModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        handleEditChange,
        fetchPandits,
      }}
    >
      {children}
    </PanditContext.Provider>
  );
};
