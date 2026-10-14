import React, { useState, useEffect } from "react";
import { toast, Bounce } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import { MdDeleteForever } from "react-icons/md";

const UpdateImageModal = ({ isOpen, onClose, pandit, fetchPandits }) => {
  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageWarning, setImageWarning] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      setExistingImages(
        pandit?.panditGallery?.length ? pandit.panditGallery : []
      );

      setPreviewImages([]);
      setSelectedFiles([]);
      setImageWarning("");
    }
  }, [isOpen, pandit]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + files.length > 4) {
      setImageWarning("You can upload maximum 4 images.");
      return;
    }

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...previews]);
    setImageWarning("");
  };

  const handleImageDelete = async (img) => {
    if (!img?._id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/superadmin/delete-images/${img._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setExistingImages((prev) => prev.filter((i) => i._id !== img._id));

      toast.success("Image deleted successfully", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      toast.error("Failed to delete image", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (existingImages.length + selectedFiles.length === 0) {
      toast.info("Please select at least one image", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      const response = await fetch(
        `${API_URL}/api/superadmin/add-pandit-gallery/${pandit?._id}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to update images");

      toast.success("Images updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });

      fetchPandits();
      onClose();
    } catch (error) {
      toast.error("Failed to update images", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDelete = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-yellow-50 p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div
          className={`relative ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <h2 className="text-xl font-bold mb-4 text-[#FFD700]">
            Update Pandit Images
          </h2>
          <p className="text-sm text-gray-700 mb-4">Pandit: {pandit?.name}</p>

          {existingImages?.length > 0 && (
            <div>
              <p className="font-medium mb-1">Existing Images:</p>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group/editImage border border-gray-300 rounded-2xl overflow-hidden shadow"
                  >
                    <img
                      src={img?.imageurl}
                      alt="Pandit"
                      className="h-32 w-32 object-cover"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(img)}
                      className="absolute inset-0 hidden group-hover/editImage:flex items-center justify-center backdrop-blur-sm"
                    >
                      <MdDeleteForever
                        size={36}
                        className="text-red-600 hover:cursor-pointer"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {previewImages?.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-1">Selected Images Previews:</p>
              <div className="flex flex-wrap gap-4">
                {previewImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group/editImage border border-gray-300 rounded-lg overflow-hidden shadow"
                  >
                    <img
                      src={img.preview}
                      alt="Preview"
                      className="h-32 w-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handlePreviewDelete(idx)}
                      className="absolute inset-0 hidden group-hover/editImage:flex items-center justify-center backdrop-blur-sm"
                    >
                      <MdDeleteForever
                        size={36}
                        className="text-red-600 hover:cursor-pointer"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {existingImages.length + previewImages.length < 4 && (
            <div className="mt-4">
              <label className="block font-medium mb-1">Select Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0 file:text-sm file:font-semibold 
                file:bg-[#FFD700] file:text-black hover:file:bg-[#FFD700]"
                disabled={loading}
              />
              {imageWarning && (
                <p className="text-sm text-red-500 mt-1">{imageWarning}</p>
              )}
              <p className="text-xs text-gray-400">
                You can select maximum 4 images
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 hover:cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <LoadingButton
              onClick={handleSave}
              loading={loading}
              variant="contained"
              sx={{
                backgroundColor: "#FFD700",
                color: "black",
                px: 2,
                py: 1,
                borderRadius: "0.25rem",
                textTransform: "none",
                boxShadow: "none",
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
    </div>
  );
};

export default UpdateImageModal;
