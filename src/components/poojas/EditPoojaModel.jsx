import React, { useContext, useState } from 'react';
import { PoojaContext } from '../../context/PoojaContext';
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';
import { MdDeleteForever } from 'react-icons/md';
import TagInput from './TagInput';

const EditPoojaModel = () => {
    const {
        poojaData,
        setPoojaModel,
        setLoading,
        fetchPooja,
        setPoojaData
    } = useContext(PoojaContext);

    const [poojaID, setPoojaID] = useState(poojaData?.['_id']);
    const API_URL = import.meta.env.VITE_API_URL;
    const [imageWarning, setImageWarning] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [images, setImages] = useState(poojaData?.images || []);
    const [form, setForm] = useState({
        poojaName: poojaData?.poojaName || '',
        significance: poojaData?.significance || '',
        ingredients: poojaData?.ingredients || [],
        description: poojaData?.description || '',
        procedure: poojaData?.procedure || '',
        sloks: poojaData?.sloks || '',
        durationMinutes: poojaData?.durationMinutes || '',
        requiresMuhurta: poojaData?.requiresMuhurta ?? true, // default to true if null or undefined
        allowedDays: poojaData?.allowedDays || [],
        restrictedTithis: poojaData?.restrictedTithis || [],
        requiredPandits: poojaData?.requiredPandits || 1,
        visibility: poojaData?.visibility || '',
        e_price: poojaData?.e_price || '',
    });

    const handleImageChange = (e) => {
        setImageWarning("");
        const maxImages = images?.length ? 4 - images?.length : 4;
        if (e.target.files.length > maxImages) {
            setImageWarning(`Only a total of 4 images are allowed, of which ${images?.length} are already selected`);
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

        formData.append('poojaName', form?.poojaName);
        formData.append('significance', form?.significance);
        formData.append('description', form?.description);
        formData.append('procedure', form?.procedure);
        formData.append('sloks', form?.sloks);
        formData.append('durationMinutes', form?.durationMinutes);
        formData.append('requiresMuhurta', form?.requiresMuhurta);
        formData.append('requiredPandits', form?.requiredPandits);
        formData.append('visibility', form?.visibility);
        formData.append('e_price', form?.e_price);

        // for arrays
        form?.ingredients?.forEach((ingredient) => {
            formData.append('ingredients[]', ingredient);
        });
        form?.allowedDays?.forEach((day) => {
            formData.append('allowedDays[]', day);
        });
        form?.restrictedTithis?.forEach((tithi) => {
            formData.append('restrictedTithis[]', tithi);
        });
        // for images
        newImages?.forEach((image) => {
            formData.append('images', image);
        });

        formData.forEach((value, key) => {
            console.log(key, value);
        });
        setLoading(true);
        try {
            const response = await axios.patch(`${API_URL}/api/update-pooja-details/${poojaID}`, formData, { withCredentials: true });
            console.log(response);
            toast.success(`Pooja updated successfully`, {
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
            toast.error(`Error updating pooja`, {
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
            setPoojaModel(false);
        }
    };

    async function handleImageDelete(imageData) {
        const public_id = imageData?.public_id;
        const poojaId = poojaData?._id;
        setIsImageLoading(true);
        if (public_id && poojaId) {
            try {
                const response = await axios.delete(`${API_URL}/api/superadmin/delete-puja-image`, {
                    data: {
                        public_id: public_id,
                        poojaId: poojaId
                    },
                    withCredentials: true
                });
                console.log(response);
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
                setImages(response?.data?.data?.images);
            } catch (error) {
                console.error(error);
                toast.error(`Error deleting image`, {
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
            <div className="bg-yellow-50 p-6 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl mx-5">
                <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-yellow-50 rounded-md overflow-y-auto mx-auto">
                    <h1 className="text-4xl font-bold mb-4 text-black">Edit Pooja</h1>

                    <div>
                        <label className="block font-medium">Pooja Name</label>
                        <input
                            name="poojaName"
                            value={form?.poojaName}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Description</label>
                        <textarea
                            name="description"
                            value={form?.description}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded h-24"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Significance</label>
                        <textarea
                            name="significance"
                            value={form?.significance}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded h-24"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Duration (Minutes)</label>
                            <input
                                type="number"
                                name="durationMinutes"
                                value={form?.durationMinutes}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">E_Price (₹)</label>
                            <input
                                type="number"
                                name="e_price"
                                value={form?.e_price}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                required
                                autoComplete="off"
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
                                value={form?.requiredPandits}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Visibility</label>
                            <select
                                name="visibility"
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                value={form?.visibility}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            >
                                <option value="on">On</option>
                                <option value="off">Off</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Requires Muhurta</label>
                            <select
                                name="requiresMuhurta"
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                value={form?.requiresMuhurta}
                                onChange={handleChange}
                                required
                            >
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium">Procedure</label>
                        <input
                            name="procedure"
                            value={form?.procedure}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <TagInput
                        label="Restricted Tithis"
                        tags={form?.restrictedTithis}
                        setTags={(tags) => setForm((prev) => ({ ...prev, restrictedTithis: tags }))}
                        placeholder="Press Enter to add or click X to delete (e.g., Ekadashi, Purnima)"
                    />

                    <TagInput
                        label="Ingredients"
                        tags={form?.ingredients}
                        setTags={(tags) => setForm((prev) => ({ ...prev, ingredients: tags }))}
                        placeholder="Press Enter to add or click X to delete (e.g., Bilva Leaves, Rudraksha)"
                    />

                    <TagInput
                        label="Allowed Days"
                        tags={form?.allowedDays}
                        setTags={(tags) => setForm((prev) => ({ ...prev, allowedDays: tags }))}
                        placeholder="Press Enter to add or click X to delete (e.g., Monday, Shivratri)"
                    />

                    <div>
                        <label className="block font-medium">Sloks</label>
                        <input
                            name="sloks"
                            value={form?.sloks}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                            placeholder="e.g., om namah shivay"
                            required
                            autoComplete="off"
                        />
                    </div>

                    {images?.length ? (
                        <div>
                            <p className="text-bold mb-1">Images:</p>
                            <div className="flex gap-5 flex-wrap">
                                {!isImageLoading ? images?.map((img, index) => (
                                    <div key={index} className="mt-4 flex flex-row group/editImage relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-300">
                                        <img
                                            loading="lazy"
                                            src={img?.imageUrl}
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

                    {images?.length < 4 && (
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
                            {imageWarning && <p className="text-sm text-red-400">{imageWarning}</p>}
                        </div>
                    )}

                    {previewImages?.length<0 && (
                        <div className=''>
                            <p className="text-sm text-gray-700 mb-1">
                                Selected Images:
                            </p>
                            <div className='flex gap-5'>
                                {previewImages?.map((img, index) => (
                                    <div key={index} className="mt-4 flex flex-row">
                                        <img
                                            loading="lazy"
                                            src={img?.preview}
                                            alt="Selected Preview"
                                            className="aspect-square h-40 object-cover rounded-md border-2 border-gray-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='flex justify-end mt-4'>
                        <button
                            type="submit"
                            className="bg-[#FFD700] text-black px-6 py-2 rounded-md hover:bg-[#ffd900ab] cursor-pointer transition"
                        >
                            Save Changes
                        </button>
                        <button onClick={() => { setPoojaModel(false); fetchPooja(); }}
                            className="bg-gray-300 text-black mx-4 px-6 py-2 rounded-md hover:bg-gray-500 cursor-pointer transition"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPoojaModel;
