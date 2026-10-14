import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const PoojaContext = createContext();

export const PoojaProvider = ({ children }) => {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(false);
  //set visibility of add pooja
  const [addPoojaModel, setAddPoojaModel] = useState(false);
  const [addPoojaData, setAddPoojaData] = useState([]);
  // set visibility of muhurat
  const [muhuratModel, setMuhuratModel] = useState(false);
  const [muhuratData, setMuhuratData] = useState([]);
  // set visibility of pooja update
  const [poojaModel, setPoojaModel] = useState(false);
  const [poojaData, setPoojaData] = useState([]);
  // set visibility of package
  const [packageModel, setPackageModel] = useState(false);
  const [packageData, setPackageData] = useState([]);
  // auth
  const { isAuthenticated, logout } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isAuthenticated) {
      fetchPooja();
    }
  }, [isAuthenticated]);

  const fetchPooja = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/superadmin/get-all-pooja`,
        { withCredentials: true }
      );
      console.log(response?.data?.data);
      setPoojas(response?.data?.data ?? []);
    } catch (error) {
      if (
        error?.response?.data?.message === "Invalid or Expired Token" ||
        error?.response?.data?.message === "Access Denied. No Token Provided"
      ) {
        return logout();
      }

      toast.error("Error fetching poojas", {
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
      console.log(error);
      setPoojas([]);
    } finally {
      setLoading(false);
    }
  };

  async function handleUpdatePooja(poojaID, data, valueChanged) {
    console.log(poojaID, data, valueChanged);
    try {
      const response = await axios.patch(
        `${API_URL}/api/update-pooja-details/${poojaID}`,
        { ...data },
        { withCredentials: true }
      );
      console.log(response);

      const newPooja = response?.data?.data;
      let allPoojas = poojas;
      const item = poojas.find((pooja) => pooja._id === newPooja?._id);
      if (item) {
        Object.assign(item, newPooja);
      }
      setPoojas(allPoojas);

      toast.success(`Pooja ${valueChanged} changed to ${data.value}`, {
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
    } catch (error) {
      console.log(error);
      toast.error(`Error updating pooja ${valueChanged}`, {
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
    } finally {
      setLoading(false);
    }
  }

  const poojaContextValue = {
    poojas,
    setPoojas,
    loading,
    fetchPooja,
    // muhurut data
    muhuratData,
    muhuratModel,
    setMuhuratModel,
    setMuhuratData,
    // pooja data
    poojaData,
    setPoojaData,
    poojaModel,
    setPoojaModel,
    // add pooja model
    addPoojaData,
    setAddPoojaData,
    addPoojaModel,
    setAddPoojaModel,
    // setLoading
    setLoading,
    // update function
    handleUpdatePooja,
    // package
    packageModel,
    setPackageModel,
    packageData,
    setPackageData,
  };

  return (
    <PoojaContext.Provider value={poojaContextValue}>
      {children}
    </PoojaContext.Provider>
  );
};
