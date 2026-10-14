import React, { useContext, useState } from "react";
import { PoojaContext } from "../../context/PoojaContext";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import TagInput from "./TagInput";

function AddPoojaModal() {
  const { setAddPoojaModel, fetchPooja, setLoading, loading } =
    useContext(PoojaContext);

  const API_URL = import.meta.env.VITE_API_URL;
  const [imageWarning, setImageWarning] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const maxImages = 4;
  const [form, setForm] = useState({
    poojaName: "",
    significance: "",
    ingredients: [],
    description: "",
    procedure: "",
    sloks: "",
    durationMinutes: "",
    requiresMuhurta: true,
    allowedDays: [],
    restrictedTithis: [],
    requiredPandits: 1,
    visibility: "off",
    e_price: "",
  });

  const handleImageChange = (e) => {
    setImageWarning("");
    if (e.target.files.length > 4) {
      setImageWarning("Only 4 images are allowed");
    }
    const files = Array.from(e.target.files).slice(0, maxImages);
    const previews = files.map((file) => ({
      preview: URL.createObjectURL(file),
    }));
    setImages(files);
    setPreviewImages(previews);
    console.log(previews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(images);
    const formData = new FormData();

    formData.append("poojaName", form?.poojaName ?? "");
    formData.append("significance", form?.significance ?? "");
    formData.append("description", form?.description ?? "");
    formData.append("procedure", form?.procedure ?? "");
    formData.append("sloks", form?.sloks ?? "");
    formData.append("durationMinutes", form?.durationMinutes ?? "");
    formData.append("requiresMuhurta", form?.requiresMuhurta ?? true);
    formData.append("requiredPandits", form?.requiredPandits ?? 1);
    formData.append("visibility", form?.visibility ?? "off");
    formData.append("e_price", form?.e_price ?? "");

    // for arrays
    form?.ingredients?.forEach((ingredient) => {
      formData.append("ingredients[]", ingredient);
    });
    form?.allowedDays?.forEach((day) => {
      formData.append("allowedDays[]", day);
    });
    form?.restrictedTithis?.forEach((tithi) => {
      formData.append("restrictedTithis[]", tithi);
    });
    // for images
    images.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/superadmin/createPuja`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      toast.success(`Pooja created successfully`, {
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
      fetchPooja();
    } catch (error) {
      console.log(error);
      toast.error(`Error creating pooja`, {
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
      setAddPoojaModel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl">
      <div className="bg-yellow-50 p-6 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 rounded-2xl overflow-y-auto mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-black ">Add Pooja</h1>
          <div>
            <label className="block font-medium">Pooja Name</label>
            <input
              name="poojaName"
              value={form?.poojaName ?? ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={form?.description ?? ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded h-24"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Significance</label>
            <textarea
              name="significance"
              value={form?.significance ?? ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Duration (Minutes)</label>
              <input
                type="number"
                name="durationMinutes"
                value={form?.durationMinutes ?? ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">E_Price (₹)</label>
              <input
                type="number"
                name="e_price"
                value={form?.e_price ?? ""}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Required Pandits</label>
              <input
                type="number"
                name="requiredPandits"
                min="1"
                value={form?.requiredPandits ?? 1}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Visibility</label>
              <select
                name="visibility"
                className="w-full border px-3 py-2 rounded border-gray-300 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                value={form?.visibility ?? "off"}
                onChange={handleChange}
                required
              >
                <option value="on">on</option>
                <option value="off">off</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Requires Muhurta</label>
              <select
                name="requiresMuhurta"
                className="w-full border px-3 py-2 rounded border-gray-300 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                value={form?.requiresMuhurta ?? true}
                onChange={handleChange}
                required
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium">Procedure</label>
            <input
              name="procedure"
              value={form?.procedure ?? ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded "
              required
            />
          </div>

          <TagInput
            label="Restricted Tithis"
            tags={form?.restrictedTithis ?? []}
            setTags={(tags) =>
              setForm((prev) => ({ ...prev, restrictedTithis: tags }))
            }
            placeholder="Press Enter to add or click X to delete  (e.g., Ekadashi, Purnima)"
          />

          <TagInput
            label="Ingredients"
            tags={form?.ingredients ?? []}
            setTags={(tags) =>
              setForm((prev) => ({ ...prev, ingredients: tags }))
            }
            placeholder="Press Enter to add or click X to delete (e.g., Bilva Leaves, Rudraksha)"
          />

          <TagInput
            label="Allowed Days"
            tags={form?.allowedDays ?? []}
            setTags={(tags) =>
              setForm((prev) => ({ ...prev, allowedDays: tags }))
            }
            placeholder="Press Enter to add or click X to delete (e.g., Monday, Shivratri)"
          />

          <div>
            <label className="block font-medium">Sloks</label>
            <input
              name="sloks"
              value={form?.sloks ?? ""}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              placeholder="e.g., om namah shivay"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Images</label>
            <input
              type="file"
              accept="image/*"
              name="images"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                            file:rounded-full file:border-0 file:text-sm file:font-semibold 
                          file:bg-[#FFD700] file:text-black hover:file:bg-[#FFD700]"
            />
            <p className="text-sm text-gray-400">Max 4 images</p>
            {imageWarning && (
              <p className="text-sm text-red-400">{imageWarning}</p>
            )}
          </div>
          {previewImages.length ? (
            <div className="">
              <p className="text-sm text-gray-700 mb-1">
                Selected Image Preview:
              </p>
              <div className="flex gap-5">
                {previewImages.map((img, index) => (
                  <div key={index} className="mt-4 flex flex-row">
                    <img
                      loading="lazy"
                      src={img.preview}
                      alt="Selected Preview"
                      className="aspect-square h-40 object-cover rounded-md border-2 border-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-[#FFD700] text-black px-6 py-2 rounded-md hover:bg-[#ffd900ab] cursor-pointer transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setAddPoojaModel(false);
              }}
              className="bg-gray-300 text-black mx-4 px-6 py-2 rounded-md hover:bg-gray-500 cursor-pointer transition"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPoojaModal;
