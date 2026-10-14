import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { RxCrossCircled } from "react-icons/rx";
import { toast, Bounce } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { LoadingButton } from "@mui/lab";
import { PoojaContext } from "../../context/PoojaContext";

const AddPanditPooja = ({
  panditId,
  panditPoojas = [],
  onClose,
  refreshPandits,
}) => {
  const { poojas: allPoojas, loading: poojaLoading } = useContext(PoojaContext);

  const [filteredPoojas, setFilteredPoojas] = useState([]);
  const [selectedPoojas, setSelectedPoojas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingPoojas, setExistingPoojas] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const existingIds = panditPoojas
      .filter((item) => item.poojaid?._id)
      .map((item) => item.poojaid?._id);

    const filtered = allPoojas.filter(
      (pooja) => !existingIds.includes(pooja?._id)
    );

    setFilteredPoojas(filtered);

    const formattedExistingPoojas = panditPoojas
      .filter((item) => item.poojaid?.poojaName)
      .map((item) => ({
        _id: item._id,
        poojaName: item.poojaid?.poojaName,
      }));

    setExistingPoojas(formattedExistingPoojas);
  }, [allPoojas, panditPoojas]);

  const handleSelectChange = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (opt) => opt.value
    );
    const selectedObjects = selectedIds.map((id) =>
      filteredPoojas.find((pooja) => pooja?._id === id)
    );

    setSelectedPoojas((prevSelected) => {
      const updated = [...prevSelected];
      selectedObjects.forEach((pooja) => {
        if (pooja && !updated.some((item) => item._id === pooja._id)) {
          updated.push(pooja);
        }
      });
      return updated;
    });
  };

  const handleRemovePooja = (poojaId) => {
    setSelectedPoojas((prev) => prev.filter((pooja) => pooja._id !== poojaId));
  };

  const handleDeletePooja = async (poojaObjId) => {
    if (loading) return;

    if (
      !window.confirm(
        "Are you sure want to delete this pooja from pandit's pooja list?"
      )
    )
      return;
    try {
      const response = await axios.delete(
        `${API_URL}/api/superadmin/delete-panditpooja/${panditId}`,
        {
          data: { poojaid: poojaObjId },
          withCredentials: true,
        }
      );

      if (response?.status === 200) {
        toast.success("Pooja removed successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });

        setExistingPoojas((prev) =>
          prev.filter((pooja) => pooja._id !== poojaObjId)
        );
        await refreshPandits();
      } else {
        toast.error("Failed to remove pooja.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during deletion.";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleAddPoojas = async () => {
    const selectedPoojaIds = selectedPoojas.map((pooja) => pooja._id);

    if (selectedPoojaIds.length === 0) {
      toast.info("Please select at least one pooja to add.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/superadmin/addPoojatoPandit`,
        {
          panditId: panditId,
          poojaId: selectedPoojaIds,
        },
        { withCredentials: true }
      );

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Poojas added successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        onClose();
        await refreshPandits();
      } else {
        toast.warn("Something went wrong. Please try again.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred!";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const searchedPoojas = filteredPoojas.filter((pooja) =>
    pooja.poojaName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-yellow-50 shadow-2xl p-6 rounded max-w-md max-h-[90vh] w-full relative">
        <h2 className="text-xl font-bold mb-4 text-[#FFD700]">
          Add Pooja for Pandit
        </h2>
        <p className="mb-4 text-sm text-gray-600">Pandit ID: {panditId}</p>

        {existingPoojas.length > 0 && (
          <div className="mb-4 text-sm text-gray-700">
            <strong>Existing Poojas:</strong>
            <ul className="list-disc list-inside">
              {existingPoojas.map((pooja) => (
                <li key={pooja._id} className="flex items-center space-x-2">
                  <span>{pooja.poojaName}</span>
                  <RxCrossCircled
                    onClick={() => !loading && handleDeletePooja(pooja._id)}
                    className={`text-red-500 hover:text-red-700 size-6 ${
                      loading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    style={{ pointerEvents: loading ? "none" : "auto" }}
                    aria-disabled={loading}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <input
          type="text"
          placeholder="Search pooja..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
          disabled={loading}
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Poojas
        </label>
        <select
          multiple
          onChange={handleSelectChange}
          className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
          disabled={loading}
        >
          {poojaLoading ? (
            <option disabled>
              <RotatingLines
                visible={true}
                height="50"
                width="50"
                color="grey"
              />
            </option>
          ) : searchedPoojas.length === 0 ? (
            <option disabled>No matching poojas found</option>
          ) : (
            searchedPoojas.map((pooja) => (
              <option key={pooja._id} value={pooja._id}>
                {pooja.poojaName}
              </option>
            ))
          )}
        </select>

        {selectedPoojas.length > 0 && (
          <div className="mt-4 text-sm text-gray-700">
            <strong>Selected Poojas:</strong>
            <ul className="list-disc list-inside">
              {selectedPoojas.map((pooja) => (
                <li key={pooja._id} className="flex items-center space-x-2">
                  <span>{pooja.poojaName}</span>
                  <RxCrossCircled
                    onClick={() => !loading && handleRemovePooja(pooja._id)}
                    className={`text-red-500 hover:text-red-700 size-6 ${
                      loading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    style={{ pointerEvents: loading ? "none" : "auto" }}
                    aria-disabled={loading}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 hover:bg-gray-400 px-4 py-2 rounded mr-2 disabled:opacity-50"
            disabled={loading}
          >
            Close
          </button>
          <LoadingButton
            onClick={handleAddPoojas}
            loading={loading}
            variant="contained"
            sx={{
              backgroundColor: "#FFD700",
              color: "black",
              px: 2,
              py: 1,
              borderRadius: "0.25rem",
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "none",
              minWidth: "unset",
              "&:hover": {
                backgroundColor: "#FFD700",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                backgroundColor: "#FFD700",
                color: "black",
              },
            }}
          >
            {loading ? "" : "Add"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default AddPanditPooja;
