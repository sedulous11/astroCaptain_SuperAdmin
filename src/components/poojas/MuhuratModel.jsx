import React, { useContext, useEffect, useState } from 'react'
import { PoojaContext } from '../../context/PoojaContext';
import { MdAdd, MdDelete } from 'react-icons/md';
import { LoadingButton } from '@mui/lab';
import { Bounce, toast } from 'react-toastify';
import axios from 'axios';

function MuhuratModel() {
    const {
        muhuratData,
        setMuhuratModel,
        poojaData,
        setMuhuratData,
        fetchPooja,
        setLoading
    } = useContext(PoojaContext);
    const [selectedDate, setSelectedDate] = useState("");
    const [muhuratSlots, setMuhuratSlots] = useState([{ from: "", to: "" }]);
    const [slotsLength, setSlotsLength] = useState(0);
    const [slots, setSlots] = useState([]);
    const [muhurutLoading, setMuhuratLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (muhuratData?.length) {
            console.log(muhuratData);
            let maxSlots = [];
            let maxLength = 0;

            muhuratData.forEach(item => {
                if (item?.slots?.length > maxLength) {
                    maxLength = item.slots.length;
                    maxSlots = item.slots;
                }
            });

            setSlotsLength(maxLength);
            setSlots(maxSlots);
            console.log(maxSlots);
        }
    }, [muhuratData]); // Dependency added to handle updates

    const handleAddSlot = () => {
        setMuhuratSlots([...muhuratSlots, { from: "", to: "" }]);
    };

    const handleRemoveSlot = (index) => {
        setMuhuratSlots(muhuratSlots.filter((_, i) => i !== index));
    };

    const handleSlotChange = (index, field, value) => {
        const newSlots = [...muhuratSlots];
        newSlots[index][field] = value;
        setMuhuratSlots(newSlots);
    };

    const handleSubmit = async () => {
        if (!selectedDate || muhuratSlots.some((slot) => !slot.from || !slot.to)) {
            alert("Please complete all fields before submitting.");
            return;
        }

        const availability = {
            puja_id: poojaData?._id,
            dateofslot: selectedDate,
            muhurut: muhuratSlots,
        };

        try {
            setMuhuratLoading(true);
            const response = await axios.post(
                `${API_URL}/api/superadmin/addmuhurut-to-pooja`,
                availability,
                { withCredentials: true }
            );
            setMuhuratData(response?.data?.data?.availability);
            toast.success("Set availability successfully!", {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
                transition: Bounce,
            });
        } catch (error) {
            console.error(error);
            const errorMessage =
                error?.response?.data?.message || "Failed to set availability.";
            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 3000,
                theme: "colored",
                transition: Bounce,
            });
        } finally {
            setMuhuratLoading(false);
            setSelectedDate("");
            setMuhuratSlots([{ from: "", to: "" }])
        }
    };

    async function handleDeleteSlots(date, slot) {
        const confirmDelete = window.confirm("Are you sure you want to delete this slot?");
        if (!confirmDelete) return;

        if (date && slot) {
            try {
                setMuhuratLoading(true)
                const response = await axios.delete(
                    `${API_URL}/api/superadmin/poojaMuhurat/${poojaData?._id}`, {
                    data: {
                        dateofslot: date?.day,
                        slot_id: slot?._id
                    },
                    withCredentials: true
                }
                );
                setMuhuratData(response?.data?.data?.availability);
                console.log(response)
                toast.success("Slot deleted successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                    transition: Bounce,
                });
            } catch (error) {
                console.error(error);
                const errorMessage =
                    error?.response?.data?.message || "Failed to delete slot.";
                toast.error(errorMessage, {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                    transition: Bounce,
                });
            } finally {
                setMuhuratLoading(false)
            }
        }
    }

    async function handleDeleteDate(date) {
        const confirmDelete = window.confirm("Are you sure you want to delete this date?");
        if (!confirmDelete) return;

        console.log(date)
        if (date) {
            try {
                setMuhuratLoading(true)
                const response = await axios.delete(
                    `${API_URL}/api/superadmin/delete-all-muhurut-slots`,
                    {
                        data: {
                            dateId: date?._id,
                            pujaid: poojaData?._id
                        },
                        withCredentials: true
                    }
                );
                setMuhuratData(response?.data?.data?.availability);
                console.log(response)
                toast.success("Date deleted successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                    transition: Bounce,
                });
            } catch (error) {
                console.error(error);
                const errorMessage =
                    error?.response?.data?.message || "Failed to delete date.";
                toast.error(errorMessage, {
                    position: "top-center",
                    autoClose: 3000,
                    theme: "colored",
                    transition: Bounce,
                });
            } finally {
                setMuhuratLoading(false)
            }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-xl">
            <div className="bg-yellow-50 p-6 rounded-2xl w-full max-w-6xl mx-5 my-5 max-h-[90vh] overflow-y-auto transition shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-[#FFD700] uppercase text-center">Muhurat details</h2>
                {muhurutLoading ? <div className="flex items-center justify-center h-50 w-full">
                    <div className="w-16 h-16 border-4 border-[#FFD700] border-dashed rounded-full animate-spin"></div>
                </div> : muhuratData?.length ? <div className="overflow-x-auto shadow-md">
                    <table className="min-w-full divide-y divide-yellow-100 text-sm text-left text-gray-700">
                        <thead className="bg-[#FFD700]">
                            <tr>
                                <th className="px-6 py-3 font-semibold border-1">S.NO</th>
                                <th className="px-6 py-3 font-semibold border-1">Date</th>
                                {slots?.map((slot, index) =>
                                    <th className="px-6 py-3 font-semibold text-center border-1" key={slot?._id}>Slot {index + 1}</th>
                                )}
                                <th className="px-6 py-3 font-semibold border-1">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-yellow-100">
                            {muhuratData?.map((item, index) => (
                                <tr key={item?._id} className={` hover:bg-gray-100 transition duration-200  ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
                                    <td className="px-4 py-2 font-bold min-w-[150px]">{index + 1}</td>
                                    <td className="px-4 py-2 font-bold min-w-[150px]">{item?.day}</td>
                                    {item?.slots?.map((slot, i) => (
                                        <td key={i} className="px-4 py-2 text-center hover:bg-red-200 relative group/slots min-w-[150px]">
                                            {slot?.from} - {slot?.to}
                                            <button onClick={() => { handleDeleteSlots(item, slot) }} className='absolute hidden group-hover/slots:flex top-2 right-1 shadow transition-all duration-500 cursor-pointer  border-2 border-red-500 rounded-full bg-red-200'><MdDelete className='text-red-500' size={20} /></button>
                                        </td>
                                    ))}
                                    {/* Fill empty cells if less than 3 slots */}
                                    {item?.slots?.length < slotsLength &&
                                        Array(slotsLength - item?.slots?.length)
                                            .fill("")
                                            .map((_, i) => (
                                                <td key={`empty-${i}`} className="px-4 py-2 text-center min-w-[150px]">
                                                    —
                                                </td>
                                            ))}

                                    <td className="px-4 py-2 font-bold min-w-[150px] flex items-center justify-center">
                                        <button onClick={() => { handleDeleteDate(item) }} className='shadow transition-all duration-500 cursor-pointer   rounded-full '><MdDelete className='text-red-500' size={20} /></button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> : ""}

                <div className='my-4 flex flex-col justify-between'>
                    <div className="w-full max-w-md bg-yellow-50 p-6 rounded-lg max-h-screen overflow-y-auto">
                        <h1 className='text-2xl font-bold'>Add Muhurat</h1>
                        <label className="block font-medium">
                            Select Date
                            <input
                                type="date"
                                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </label>

                        {selectedDate && (
                            <div className="mt-4 space-y-4">
                                <h2 className="text-lg font-semibold">Time Slots</h2>
                                {muhuratSlots?.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="border p-3 rounded bg-white shadow-sm"
                                    >
                                        <div>
                                            <label className="block font-medium">
                                                From (24-hour format)
                                            </label>
                                            <input
                                                type="time"
                                                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                                                value={slot?.from}
                                                onChange={(e) =>
                                                    handleSlotChange(index, "from", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label className="block font-medium">
                                                To (24-hour format)
                                            </label>
                                            <input
                                                type="time"
                                                className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
                                                value={slot?.to}
                                                onChange={(e) =>
                                                    handleSlotChange(index, "to", e.target.value)
                                                }
                                            />
                                        </div>
                                        {muhuratSlots?.length > 1 && (
                                            <button
                                                type="button"
                                                className="mt-2 text-sm text-red-600 hover:underline"
                                                onClick={() => handleRemoveSlot(index)}
                                            >
                                                Remove Slot
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddSlot}
                                    className="mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    + Add Another Time Slot
                                </button>
                            </div>
                        )}

                        <div className="mt-4 flex space-x-2">
                            <button onClick={() => { handleSubmit() }} className="bg-[#FFD700] text-black px-6 py-2 rounded-md hover:bg-[#ffd900ab] cursor-pointer transition"> Add Muhurat Slots</button>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={() => { setMuhuratModel(false), fetchPooja() }}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

export default MuhuratModel;
