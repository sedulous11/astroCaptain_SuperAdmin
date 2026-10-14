import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const TempleContext = createContext();

export const TempleProvider = ({ children }) => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(false);
  // Set visibility of add pooja
  const [addTempleModel, setAddTempleModel] = useState(false);
  // Set visibility of pooja update
  const [editTempleModel, setEditTempleModel] = useState(false);
  // Set visibility of add poojas in temple
  const [addTemplePoojaModel, setAddTemplePoojaModel] = useState(false);
  const [templeData, setTempleData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [templeMeta, setTempleMeta] = useState({ total: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      fetchTemples();
    }
  }, [isAuthenticated]);

  const fetchTemples = async ({
    page = 1,
    limit = 5,
    sortBy = "name",
    sortOrder = "asc",
    search = "",
    visibility = "all",
  } = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
      };

      if (search) params.name = search;
      if (visibility !== "all") params.visibility = visibility;

      const endpoint = search ? "search-temple" : "get-all-temple";

      const response = await axios.get(
        `${API_URL}/api/superadmin/${endpoint}`,
        {
          withCredentials: true,
          params,
        }
      );

      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      setTemples(data);
      setTempleMeta({
        total: response?.data?.pagination?.totalResults || 0,
        totalPages: response?.data?.pagination?.totalPages || 1,
        currentPage: response?.data?.pagination?.currentPage || 1,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error fetching temples", {
        position: "top-center",
        autoClose: 3000,
        transition: Bounce,
      });
      setTemples([]);
    } finally {
      setLoading(false);
    }
  };

  const templeContextValue = {
    loading,
    setLoading,
    // all temples data
    temples,
    setTemples,
    // add temple model
    addTempleModel,
    setAddTempleModel,
    // edit temple model
    editTempleModel,
    setEditTempleModel,
    // temple data
    templeData,
    setTempleData,
    // add pooja in temple
    addTemplePoojaModel,
    setAddTemplePoojaModel,
    // fetch pooja
    fetchTemples,
    templeMeta,
    setTempleMeta,
  };

  return (
    <TempleContext.Provider value={templeContextValue}>
      {children}
    </TempleContext.Provider>
  );
};
