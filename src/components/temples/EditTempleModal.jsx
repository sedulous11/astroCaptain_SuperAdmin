import React, { useContext, useState } from 'react'
import { TempleContext } from '../../context/TempleContext'
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';

function EditTempleModal() {
  const {
    setTemples,
    loading,
    setLoading,
    setAddTempleModel,
    addTempleData,
    setAddTempleData,
    editTempleModel,
    setEditTempleModel,
    templeData,
    setTempleData,
    fetchTemples
  } = useContext(TempleContext)

  const API_URL = import.meta.env.VITE_API_URL;
  const [templeID, setTempleID] = useState(templeData?.['_id']);
  const [imageWarning, setImageWarning] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [images, setImages] = useState(templeData?.img || []);

  const [form, setForm] = useState({
    name: templeData?.name || "",
    place: templeData?.place || "",
    significance: templeData?.significance || "",
    description: templeData?.description || "",
    visibility: templeData?.visibility || "off"
  });

  const handleImageChange = (e) => {
    setImageWarning("");
    const maxImages = images?.length ? 5 - images.length : 5;
    if (e.target.files.length > maxImages) {
      setImageWarning(`Only a total of 5 images are allowed, and ${images.length} are already selected.`);
    }
    const files = Array.from(e.target.files).slice(0, maxImages);
    const previews = files.map((file) => ({
      preview: URL.createObjectURL(file),
    }));
    setNewImages(files);
    setPreviewImages(previews);
    console.log(previews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('place', form.place);
    formData.append('description', form.description);
    formData.append('significance', form.significance);
    formData.append('visibility', form.visibility);

    // for images
    newImages.forEach((image) => {
      formData.append('temple_img', image);
    });

    formData.forEach((value, key) => {
      console.log(key, value);
    });
    setLoading(true);
    try {
      const response = await axios.patch(`${API_URL}/api/superadmin/update-temple-details/${templeID}`, formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      console.log(response);
      toast.success(`Temple updated successfully`, {
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
      toast.error(`Error updating Temple: ${error?.data?.message || error.message}`, {
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
      setEditTempleModel(false);
      fetchTemples();
    }
  };

  async function handleImageDelete(imageData) {
    const public_id = imageData?.public_id;
    const poojaId = templeData?._id;
    setIsImageLoading(true);
    if (public_id && poojaId) {
      try {
        const response = await axios.delete(`${API_URL}/api/superadmin/delete-temple-images`, {
          data: {
            public_id: public_id,
            templeId: templeID
          },
          withCredentials: true
        });
        const updatedArray = images?.filter(item => item?.public_id !== public_id);
        setImages(updatedArray);
        toast.success(`Image deleted successfully`, {
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
        console.error(error);
        toast.error(`Error deleting image: ${error}`, {
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
        setIsImageLoading(false);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl">
      <div className="bg-yellow-50 p-6 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 rounded-md overflow-y-auto mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-black">Edit Temple</h1>
          <div>
            <label className="block font-medium">Temple Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded h-24"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Significance</label>
            <textarea
              name="significance"
              value={form.significance}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded h-24"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Place</label>
            <input
              name="place"
              value={form.place}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Visibility</label>
            <select
              name="visibility"
              className="w-full border px-3 py-2 rounded border-gray-300 text-sm text-black shadow-sm focus:outline-none focus:ring-1 transition duration-200"
              value={form.visibility}
              onChange={handleChange}
              required
            >
              <option value="on">on</option>
              <option value="off">off</option>
            </select>
          </div>

          {images?.length ? (
            <div>
              <p className="text-bold mb-1">Images:</p>
              <div className="flex gap-5 flex-wrap">
                {!isImageLoading ? images.map((img, index) => (
                  <div key={index} className="mt-4 flex flex-row group/editImage relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-300">
                    <img
                      loading="lazy"
                      src={img?.imageurl}
                      alt="Selected Preview"
                      className="aspect-square h-40 object-cover"
                    />
                    <button type='button' onClick={() => { handleImageDelete(img) }} className='absolute hidden z-25 h-40 w-40 rounded-2xl group-hover/editImage:flex items-center justify-center backdrop-blur-lg transition duration-300 hover:cursor-pointer'><MdDeleteForever size={40} className='text-red-600' /></button>
                  </div>
                )) :
                  <div className="flex items-center justify-center h-40 w-full">
                    <div className="w-16 h-16 border-4 border-[#FFD700] border-dashed rounded-full animate-spin"></div>
                  </div>}
              </div>
            </div>
          ) : (
            ""
          )}

          {images?.length < 5 ? (
            <div>
              <label className="block font-medium">Images</label>
              <input
                type="file"
                accept="image/*"
                name="images"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFD700] file:text-black hover:file:bg-[#FFD700]"
              />
              <p className="text-sm text-gray-400">Max 2 images</p>
              {imageWarning && (
                <p className="text-sm text-red-400">{imageWarning}</p>
              )}
            </div>
          ) : ""}
          
          {previewImages?.length ? (
            <div>
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
                setEditTempleModel(false);
                fetchTemples();
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

export default EditTempleModal;
