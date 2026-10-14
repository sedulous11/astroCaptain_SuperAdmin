import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PanditContext } from "../../context/PanditContext";
import { toast, Bounce } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";

const EditPanditModal = () => {
  const {
    editingPandit,
    editFormData,
    handleEditChange,
    setPandits,
    setIsEditModalOpen,
    setEditingPandit,
    setEditFormData,
  } = useContext(PanditContext);

  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setEditFormData({
      mobile: editingPandit?.mobile || "",
      dob: editingPandit?.dob || "",
      gender: editingPandit?.gender || "",
      skills: editingPandit?.Skills || "",
      languages: editingPandit?.languages || "",
      qualifications: editingPandit?.ProfessionalQualifications || "",
      status: editingPandit?.status || "",
      city: editingPandit?.city || "",
      belong: editingPandit?.belongsTo || "",
      pincode: editingPandit?.pincode || "",
      experience: editingPandit?.experience || "",
      description: editingPandit?.description || "",
      slug: editingPandit?.slug || "",
      name: editingPandit?.name || "",
    });
  }, [editingPandit, setEditFormData]);

  const isValidPincode = (pin) => /^[0-9]{6}$/.test(pin);

  const handleUpdatePandit = async () => {
    if (editFormData.pincode && !isValidPincode(editFormData.pincode)) {
      toast.warn("Please enter a valid 6-digit pincode.", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const normalizedData = {
      name: editFormData.name,
      mobile: editFormData.mobile,
      dob: editFormData.dob,
      gender: editFormData.gender,
      Skills: Array.isArray(editFormData.skills)
        ? editFormData.skills
        : editFormData.skills?.split(",").map((s) => s.trim()),
      languages: Array.isArray(editFormData.languages)
        ? editFormData.languages
        : editFormData.languages?.split(",").map((l) => l.trim()),
      ProfessionalQualifications: Array.isArray(editFormData.qualifications)
        ? editFormData.qualifications
        : editFormData.qualifications?.split(",").map((q) => q.trim()),
      status: editFormData.status,
      city: editFormData.city,
      belongsTo: editFormData.belong,
      pincode: editFormData.pincode,
      experience: editFormData.experience,
      description: editFormData.description,
      slug: editFormData.slug,
    };

    try {
      setLoading(true);

      const patchResponse = await axios.patch(
        `${API_URL}/api/superadmin/updatepandit/${editingPandit.slug}`,
        normalizedData,
        { withCredentials: true }
      );

      if (
        patchResponse.status === 200 &&
        patchResponse.data?.success !== false
      ) {
        toast.success("Pandit updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });

        const getResponse = await axios.get(
          `${API_URL}/api/superadmin/get-allpandits`,
          { withCredentials: true }
        );

        const fetchedPandits = getResponse.data?.PanditData;
        if (Array.isArray(fetchedPandits)) {
          setPandits(fetchedPandits);
          closeModal();
        } else {
          toast.warn(
            "Updated but failed to load updated list (unexpected format).",
            {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
              transition: Bounce,
            }
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred!";
      toast.warn(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setEditingPandit(null);
    setEditFormData({});
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-yellow-50 p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
          <h2 className="text-xl font-bold mb-4 text-[#FFD700]">Edit Pandit</h2>
          <div className="space-y-2">
            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block font-medium">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Mobile:</label>
                <input
                  type="text"
                  name="mobile"
                  maxLength={10}
                  minLength={10}
                  value={editFormData.mobile || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block font-medium">Date of Birth:</label>
                <input
                  type="text"
                  name="dob"
                  value={editFormData.dob || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Gender:</label>
                <input
                  type="text"
                  name="gender"
                  value={editFormData.gender || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block font-medium">Skills:</label>
                <input
                  type="text"
                  name="skills"
                  value={editFormData.skills || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Languages:</label>
                <input
                  type="text"
                  name="languages"
                  value={editFormData.languages || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block font-medium">
                  Professional Qualifications:
                </label>
                <input
                  type="text"
                  name="qualifications"
                  value={editFormData.qualifications || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Experience:</label>
                <input
                  type="text"
                  name="experience"
                  value={editFormData.experience || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block font-medium">Description:</label>
                <input
                  type="text"
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">City:</label>
                <input
                  type="text"
                  name="city"
                  value={editFormData.city || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block font-medium">Belongs To:</label>
                <input
                  type="text"
                  name="belong"
                  value={editFormData.belong || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">Pincode:</label>
                <input
                  type="text"
                  name="pincode"
                  value={editFormData.pincode || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-1/2">
                <label className="block font-medium">Status:</label>
                <input
                  type="text"
                  name="status"
                  value={editFormData.status || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
              <div className="w-1/2">
                <label className="block font-medium">
                  Slug:{" "}
                  <span className="text-gray-500 font-sm font-light">
                    (you can use only hyphen '-' as special character)
                  </span>{" "}
                </label>
                <input
                  type="text"
                  name="slug"
                  value={editFormData.slug || ""}
                  onChange={handleEditChange}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <LoadingButton
              onClick={handleUpdatePandit}
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
              {loading ? "" : "Save"}
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPanditModal;
