import React, { useState } from "react";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import { FaDeleteLeft } from "react-icons/fa6";
import { LoadingButton } from "@mui/lab";

const AddModal = ({ onClose, refreshPandits }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [belongsTo, setBelongsTo] = useState("");
  const [pincode, setPincode] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [professional, setProfessional] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const isValidPincode = (code) => /^\d{6}$/.test(code);

  const handleAddPandit = async (e) => {
    e.preventDefault();

    if (!isValidPincode(pincode)) {
      toast.warn("Pincode must be a 6-digit number.", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("experience", experience);
    formData.append("description", description);
    formData.append("city", city);
    formData.append("belongsTo", belongsTo);
    formData.append("pincode", pincode);
    formData.append("slug", slug);
    if (image) formData.append("image", image);

    skills.forEach((skill) => formData.append("Skills[]", skill));
    languages.forEach((lang) => formData.append("languages[]", lang));
    professional.forEach((qual) =>
      formData.append("ProfessionalQualifications[]", qual)
    );

    try {
      const response = await axios.post(
        `${API_URL}/api/superadmin/addpandit`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response?.status === 201 || response?.status === 200) {
        toast.success("Pandit added successfully!", {
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
        await refreshPandits();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred!";
      toast.warn(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-yellow-50 p-6 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-[#FFD700]">Add Pandit</h2>
        <form onSubmit={handleAddPandit} className="space-y-2">
          <div className="flex gap-5">
            <div className="w-1/2">
              <label className="block font-medium">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              />
            </div>
            <div className="w-1/2">
              <label className="block font-medium">Mobile:</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                maxLength={10}
                minLength={10}
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="w-1/2">
              <label className="block font-medium">Date of Birth:</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              />
            </div>
            <div className="w-1/2">
              <label className="block font-medium">Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Others</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium">Skills:</label>
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => {
                    const updated = [...skills];
                    updated[index] = e.target.value;
                    setSkills(updated);
                  }}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                  placeholder="e.g. Vedic Astrology"
                />
                <FaDeleteLeft
                  className="size-8 text-red-500 cursor-pointer"
                  onClick={() =>
                    setSkills(skills.filter((_, i) => i !== index))
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSkills([...skills, ""])}
              className="text-sm text-blue-600"
              disabled={loading}
            >
              + Add Skill
            </button>
          </div>
          <div>
            <label className="block font-medium">Languages:</label>
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={lang}
                  onChange={(e) => {
                    const updated = [...languages];
                    updated[index] = e.target.value;
                    setLanguages(updated);
                  }}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                  placeholder="e.g. Hindi"
                />
                <FaDeleteLeft
                  className="size-8 text-red-500 cursor-pointer"
                  onClick={() =>
                    setLanguages(languages.filter((_, i) => i !== index))
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLanguages([...languages, ""])}
              className="text-sm text-blue-600"
              disabled={loading}
            >
              + Add Language
            </button>
          </div>
          <div>
            <label className="block font-medium">
              Professional Qualifications:
            </label>
            {professional.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const updated = [...professional];
                    updated[index] = e.target.value;
                    setProfessional(updated);
                  }}
                  disabled={loading}
                  className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                  placeholder="e.g. Acharya Degree"
                />
                <FaDeleteLeft
                  className="size-8 text-red-500 cursor-pointer"
                  onClick={() =>
                    setProfessional(professional.filter((_, i) => i !== index))
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setProfessional([...professional, ""])}
              className="text-sm text-blue-600"
              disabled={loading}
            >
              + Add Qualification
            </button>
          </div>
          <div className="flex gap-5">
            <div className="w-1/2">
              <label className="block font-medium">Experience:</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              />
            </div>
            <div className="w-1/2">
              <label className="block font-medium">Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="w-1/2">
              <label className="block font-medium">City:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              />
            </div>
            <div className="w-1/2">
              <label className="block font-medium">Belongs To:</label>
              <input
                type="text"
                value={belongsTo}
                onChange={(e) => setBelongsTo(e.target.value)}
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="w-1/2">
              <label className="block font-medium">Pincode:</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) setPincode(value);
                }}
                required
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
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")
                  )
                }
                required
                disabled={loading}
                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              disabled={loading}
              className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
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
                  backgroundColor: "yellow",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#FFD700",
                  color: "black",
                },
              }}
            >
              {loading ? "" : "Add Pandit"}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
