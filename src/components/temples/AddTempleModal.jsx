import React, { useContext, useState } from 'react'
import { TempleContext } from '../../context/TempleContext'
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';

function AddTempleModal() {
    const {
        setTemples,
        loading,
        setLoading,
        setAddTempleModel,
        editTempleModel,
        setEditTempleModel,
        templeData,
        setTempleData,
        fetchTemples
    } = useContext(TempleContext)

    const API_URL = import.meta.env.VITE_API_URL;
    const [imageWarning, setImageWarning] = useState("");
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const maxImages = 2;

    const [form, setForm] = useState({
        name: "",
        place: "",
        significance: "",
        description: "",
        visibility: "off"
    });

    const handleImageChange = (e) => {
        setImageWarning("");
        if (e.target.files.length > maxImages) {
            setImageWarning("Only 2 images are allowed");
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

        formData.append("name", form.name);
        formData.append("place", form.place);
        formData.append("significance", form.significance);
        formData.append("description", form.description);
        formData.append("visibility", form.visibility);

        images.forEach((image) => {
            formData.append("temple_img", image);
        });

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/api/superadmin/create-temple`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response);
            toast.success(`Temple created successfully`, {
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
            fetchTemples?.();
        } catch (error) {
            console.log(error);
            toast.error(`Error creating temple`, {
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
            setAddTempleModel(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl">
            <div className="bg-yellow-50 p-6 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-6 rounded-md overflow-y-auto  mx-auto"
                >
                    <h1 className="text-4xl font-bold mb-4 text-black ">Add Temple</h1>
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
                            className="w-full border px-3 py-2 rounded border-gray-300  text-sm text-black shadow-sm focus:outline-none focus:ring-1   transition duration-200"
                            value={form.visibility}
                            onChange={handleChange}
                            required
                        >
                            <option value="on">on</option>
                            <option value="off">off</option>
                        </select>
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
                        <p className="text-sm text-gray-400">Max 2 images</p>
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
                                setAddTempleModel(false)
                            }}
                            className="bg-gray-300 text-black mx-4 px-6 py-2 rounded-md hover:bg-gray-500 cursor-pointer transition"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTempleModal
