import React, { useContext, useEffect, useState } from 'react'
import { PoojaContext } from '../../context/PoojaContext'
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';
import { IoIosAddCircle } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { MdDelete, MdEdit } from 'react-icons/md';


function AddPackage() {
    const { packageData, setPackageData, setPackageModel, fetchPooja, setLoading, poojaData } = useContext(PoojaContext);
    const [materialInput, setMaterialInput] = useState(true);
    const [formActive, setFormActive] = useState(false);
    const [editActive, setEditActive] = useState(false);
    const [packageType, setPackageType] = useState("");
    const [editPackageData, setEditPackageData] = useState({});
    const API_URL = import.meta.env.VITE_API_URL;
    const [titleOptions, setTitleOptions] = useState(['Family', 'Couple', 'Single']);

    useEffect(() => {
        if (packageData.length) {
            const offlinePackages = packageData.filter(data => data.poojaPackages?.typeOfPackage === "offlinepooja");
            const onlinePackages = packageData.filter(data => data.poojaPackages?.typeOfPackage === "onlinepooja");

            offlinePackages.map((data) => {
                if (packageType === "offline") {
                    if (data.poojaPackages?.materialIncluded === "yes") {
                        setMaterialInput(false);
                        setFormData({
                            ...formData,
                            materialIncluded: "no",
                        });
                    } else if (data.poojaPackages?.materialIncluded === "no") {
                        setMaterialInput(false);
                        setFormData({
                            ...formData,
                            materialIncluded: "yes",
                        });
                    } else {
                        setMaterialInput(true);
                        setFormData({
                            ...formData,
                            materialIncluded: "yes",
                        });
                    }
                }
            });

            let newOptions = titleOptions;
            onlinePackages.map((data) => {
                newOptions = newOptions.filter(item => item !== data?.poojaPackages?.title);
            });
            setTitleOptions(newOptions);

            if (packageType === "online") {
                setMaterialInput(false);
            }
        }
    }, [packageType]);

    const [formData, setFormData] = useState({
        poojaId: poojaData?._id,
        title: " ",
        subtitle: "",
        description: "",
        price: "",
        materialIncluded: "yes",
        status: "active",
        typeOfPackage: "",
        NoPepoles: 1
    });

    const [editFormData, setEditFormData] = useState({
        poojaId: poojaData?._id,
        title: editPackageData?.title,
        subtitle: editPackageData?.subtitle,
        description: editPackageData?.CustomDescription,
        price: editPackageData?.price,
        materialIncluded: editPackageData?.materialIncluded,
        status: editPackageData?.status,
        typeOfPackage: editPackageData?.typeOfPackage,
        NoPepoles: editPackageData?.NoPepoles
    });

    useEffect(() => {
        setEditFormData({
            poojaId: poojaData?._id,
            title: editPackageData?.title,
            subtitle: editPackageData?.subtitle,
            description: editPackageData?.CustomDescription,
            price: editPackageData?.price,
            materialIncluded: editPackageData?.materialIncluded,
            status: editPackageData?.status,
            typeOfPackage: editPackageData?.typeOfPackage,
            NoPepoles: editPackageData?.NoPepoles
        });
    }, [editPackageData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(formData);
        if (name === "title") {
            let noOfPeople = 1;
            if (value === "Couple") {
                noOfPeople = 2;
            } else if (value === "Family") {
                noOfPeople = 3;
            }

            setFormData((prev) => ({
                ...prev,
                [name]: value,
                NoPepoles: value === "Family" ? prev.NoPepoles : noOfPeople,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        console.log(editFormData);
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/api/superadmin/create-pooja-package`,
                { ...formData },
                {
                    withCredentials: true,
                }
            );
            console.log(response);
            setPackageData(response?.data?.data);
            toast.success(`Package created successfully`, {
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
            toast.error(`Error creating package`, {
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
    };

    const handlePackageDelete = async (data) => {
        console.log(data);
        try {
            setLoading(true);
            const response = await axios.delete(
                `${API_URL}/api/superadmin/delete-package?poojaId=${poojaData?._id}&packageID=${data?._id}`,
                {
                    withCredentials: true,
                }
            );
            console.log(response);
            setPackageData(response?.data?.data);
            toast.success(`Package deleted successfully`, {
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
            toast.error(`Error deleting package`, {
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
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        console.log(editFormData);

        try {
            setLoading(true);
            const response = await axios.patch(
                `${API_URL}/api/superadmin/edit-package?poojaId=${poojaData?._id}&packageID=${editPackageData?.id}`,
                { ...editFormData },
                {
                    withCredentials: true,
                }
            );
            console.log(response);
            const newPackages = packageData.map((data) =>
                data?._id === response?.data?.data?._id ? response.data.data : data
            );

            console.log(newPackages);
            setPackageData(newPackages);
            toast.success(`Package updated successfully`, {
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
            toast.error(`Error updating package`, {
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
    };

    const offlinePackages = packageData.filter(data => data.poojaPackages?.typeOfPackage === "offlinepooja");
    const onlinePackages = packageData.filter(data => data.poojaPackages?.typeOfPackage === "onlinepooja");

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl">
        <div className="bg-yellow-50 p-6 rounded-2xl w-full max-w-6xl mx-5 my-5 max-h-[90vh] overflow-y-auto transition shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-black uppercase text-center">Package details</h2>
            {formActive ? (
                <div className="">
                    <h2 className="text-2xl font-bold mb-4 flex flex-row gap-2 items-center">
                        <button
                            className="text-3xl hover:bg-[#FFD700] p-2 cursor-pointer aspect-squeare rounded-full"
                            onClick={() => setFormActive(false)}
                        >
                            <IoIosArrowBack />
                        </button>
                        Add {packageType} pooja package form
                    </h2>
                    <form className="flex flex-col gap-5 p-6 py-0" onSubmit={handleSubmit}>
                        {packageType === "online" && (
                            <div>
                                <label htmlFor="title" className="block font-medium">Title</label>
                                <select
                                    id="title"
                                    name="title"
                                    value={formData?.title}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                    required
                                >
                                    <option value="">Select Title</option>
                                    {titleOptions?.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label htmlFor="subtitle" className="block font-medium">Subtitle</label>
                            <input
                                type="text"
                                id="subtitle"
                                name="subtitle"
                                value={formData?.subtitle}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block font-medium">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData?.description}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block font-medium">Price</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData?.price}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        {formData?.title === "Family" && (
                            <div>
                                <label htmlFor="NoPepoles" className="block font-medium">No. of peoples</label>
                                <input
                                    type="number"
                                    id="NoPepoles"
                                    name="NoPepoles"
                                    value={formData?.NoPepoles}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                        )}

                        {materialInput && (
                            <div>
                                <label htmlFor="materialIncluded" className="block font-medium">Material Included</label>
                                <select
                                    id="materialIncluded"
                                    name="materialIncluded"
                                    value={formData?.materialIncluded}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label htmlFor="status" className="block font-medium">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData?.status}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="submit"
                                className="w-fit py-2 px-4 bg-[#FFD700] text-black font-semibold rounded-md hover:bg-[#ffd700] cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => {
                                    setPackageModel(false);
                                    fetchPooja();
                                }}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            ) : editActive ? (
                <div className="">
                    <h2 className="text-2xl font-bold mb-4 flex flex-row gap-2 items-center">
                        <button
                            className="text-3xl hover:bg-[#FFD700] p-2 cursor-pointer aspect-squeare rounded-full"
                            onClick={() => setEditActive(false)}
                        >
                            <IoIosArrowBack />
                        </button>
                        Edit {packageType} pooja package form
                    </h2>
                    <form className="flex flex-col gap-5 p-6 py-0" onSubmit={handleEditSubmit}>
                        {editFormData?.title !== " " && (
                            <div>
                                <label htmlFor="title" className="block font-medium">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={editFormData?.title}
                                    disabled // 🔒 Make the title read-only in edit
                                    className="w-full mt-1 p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="subtitle" className="block font-medium">Subtitle</label>
                            <input
                                type="text"
                                id="subtitle"
                                name="subtitle"
                                value={editFormData?.subtitle}
                                onChange={handleEditChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block font-medium">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={editFormData?.description}
                                onChange={handleEditChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                rows="4"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block font-medium">Price</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={editFormData?.price}
                                onChange={handleEditChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        {editFormData?.title === "Family" && (
                            <div>
                                <label htmlFor="NoPepoles" className="block font-medium">No. of People</label>
                                <input
                                    type="number"
                                    id="NoPepoles"
                                    name="NoPepoles"
                                    value={editFormData?.NoPepoles}
                                    onChange={handleEditChange}
                                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="status" className="block font-medium">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={editFormData?.status}
                                onChange={handleEditChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="submit"
                                className="w-fit py-2 px-4 bg-[#FFD700] text-black font-semibold rounded-md hover:bg-[#ffd700] cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => {
                                    setPackageModel(false);
                                    fetchPooja();
                                }}
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex gap-5 flex-col w-full flex-wrap p-6 space-y-5 h-auto">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex flex-row items-center justify-between">
                            Offline Pooja Packages
                        </h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                            {offlinePackages?.map((data, index) => (
                                <div className="p-6 shadow-md rounded-2xl bg-white group relative" key={index}>
                                    <h2 className="text-2xl font-bold text-gray-800 line-clamp-1 flex flex-row items-center justify-between">
                                        {data?.poojaPackages?.title}{" "}
                                        <button
                                            className="absolute right-16 bottom-3 hidden transition-all duration-300 group-hover:block cursor-pointer p-2 rounded-full bg-green-200 text-green-600"
                                            onClick={() => {
                                                setEditActive(true);
                                                setEditPackageData({ ...data?.poojaPackages, id: data?._id });
                                            }}
                                        >
                                            <MdEdit />
                                        </button>{" "}
                                        <button
                                            className="absolute right-3 bottom-3 hidden transition-all duration-300 group-hover:block cursor-pointer p-2 rounded-full bg-red-200 text-red-600"
                                            onClick={() => {
                                                handlePackageDelete(data);
                                            }}
                                        >
                                            <MdDelete />
                                        </button>
                                    </h2>
                                    <h2 className="text-2xl font-bold text-gray-800 line-clamp-1 flex flex-row items-center justify-between">
                                        {data?.poojaPackages?.subtitle}{" "}
                                        <button
                                            className="absolute right-16 bottom-3 hidden transition-all duration-300 group-hover:block cursor-pointer p-2 rounded-full bg-green-200 text-green-600"
                                            onClick={() => {
                                                setEditActive(true);
                                                setEditPackageData({ ...data?.poojaPackages, id: data?._id });
                                            }}
                                        >
                                            <MdEdit />
                                        </button>{" "}
                                        <button
                                            className="absolute right-3 bottom-3 hidden transition-all duration-300 group-hover:block cursor-pointer p-2 rounded-full bg-red-200 text-red-600"
                                            onClick={() => {
                                                handlePackageDelete(data);
                                            }}
                                        >
                                            <MdDelete />
                                        </button>
                                    </h2>

                                    <p className="mt-4 text-gray-700 line-clamp-4">
                                        {data?.poojaPackages?.CustomDescription}
                                    </p>

                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-lg font-semibold text-green-600">
                                            ₹{data?.poojaPackages?.price}
                                        </span>
                                        <span
                                            className={`text-sm font-medium px-2 py-1 rounded-full ${
                                                data?.poojaPackages?.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {data?.poojaPackages?.status}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-600">
                                        Type: <span className="font-medium">{data?.poojaPackages?.typeOfPackage}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        No. of People: <span className="font-medium">{data?.poojaPackages?.NoPepoles}</span>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-600">
                                        Materials Included:{" "}
                                        <span
                                            className={
                                                data?.poojaPackages?.materialIncluded === "yes"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {data?.poojaPackages?.materialIncluded === "yes" ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {offlinePackages?.length < 2 && (
                                <button
                                    className={`border-2 border-dashed border-gray-400 min-w-[300px] min-h-[300px] h-full rounded-2xl text-gray-500 text-xl font-semibold flex items-center justify-center cursor-pointer hover:text-[#FFD700] hover:bg-amber-100 transition-all duration-300`}
                                    onClick={() => {
                                        setPackageType("offline");
                                        setFormActive(true);
                                        setFormData({
                                            ...formData,
                                            typeOfPackage: "offlinepooja",
                                        });
                                    }}
                                    aria-label="Add Offline Package"
                                >
                                    <IoIosAddCircle className="text-6xl" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Online Packages */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-8">Online Pooja Packages</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {onlinePackages?.map((data, index) => (
                                <div className="p-6 shadow-md rounded-2xl bg-white group relative" key={index}>
                                    <h2 className="text-2xl font-bold text-gray-800 line-clamp-1 flex flex-row items-center justify-between">
                                        {data?.poojaPackages?.title}{" "}
                                        <button
                                            className="absolute right-16 bottom-3 hidden transition-all duration-300 group-hover:block cursor-pointer p-2 rounded-full bg-green-200 text-green-600"
                                            onClick={() => {
                                                setEditActive(true);
                                                setEditPackageData({ ...data?.poojaPackages, id: data?._id });
                                            }}
                                        >
                                            <MdEdit />
                                        </button>{" "}
                                        <button
                                            className="absolute right-3 bottom-3 hidden transition-all duration-300 group-hover:block cursor-pointer p-2 rounded-full bg-red-200 text-red-600"
                                            onClick={() => {
                                                handlePackageDelete(data);
                                            }}
                                        >
                                            <MdDelete />
                                        </button>
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-2">{data?.poojaPackages?.subtitle}</p>

                                    <p className="mt-4 text-gray-700">{data?.poojaPackages?.CustomDescription}</p>

                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-lg font-semibold text-green-600">
                                            ₹{data?.poojaPackages?.price}
                                        </span>
                                        <span
                                            className={`text-sm font-medium px-2 py-1 rounded-full ${
                                                data?.poojaPackages?.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {data?.poojaPackages?.status}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-600">
                                        Type: <span className="font-medium">{data?.poojaPackages?.typeOfPackage}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        No. of People: <span className="font-medium">{data?.poojaPackages?.NoPepoles}</span>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-600">
                                        Materials Included:{" "}
                                        <span
                                            className={
                                                data?.poojaPackages?.materialIncluded === "yes"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {data?.poojaPackages?.materialIncluded === "yes" ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {onlinePackages?.length < 3 && (
                                <button
                                    className={`border-2 border-dashed border-gray-400 min-h-[300px] h-full rounded-2xl text-gray-500 text-xl font-semibold flex items-center justify-center cursor-pointer hover:text-[#FFD700] hover:bg-amber-100 transition-all duration-300`}
                                    onClick={() => {
                                        setPackageType("online");
                                        setFormActive(true);
                                        setFormData({
                                            ...formData,
                                            typeOfPackage: "onlinepooja",
                                        });
                                    }}
                                >
                                    <IoIosAddCircle className="text-6xl" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!formActive && !editActive ? (
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            setPackageModel(false);
                            fetchPooja();
                        }}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            ) : (
                ""
            )}
        </div>
    </div>
);

}

export default AddPackage
