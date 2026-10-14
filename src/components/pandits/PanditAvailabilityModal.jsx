import React, { useState, useEffect, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { MdOutlineGetApp } from "react-icons/md";
import { LoadingButton } from "@mui/lab";
import { PanditContext } from "../../context/PanditContext";
import axios from "axios";
import { toast, Bounce } from "react-toastify";

const PanditAvailabilityModal = ({
  isOpen,
  onClose,
  pandit,

  refreshPandits,
}) => {
  const { setLoading } = useContext(PanditContext);
  const [slotsLength, setSlotsLength] = useState(0);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([{ from: "", to: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const availabilityData = pandit?.availability?.date || [];

  useEffect(() => {
    const availabilityData = pandit?.availability?.date || [];
    if (availabilityData) {
      let maxSlots = [];
      let maxLength = 0;
      availabilityData.forEach((item) => {
        if (item?.slots?.length > maxLength) {
          maxLength = item.slots.length;
          maxSlots = item.slots;
        }
      });
      setSlotsLength(maxLength);
      setSlots(maxSlots);
    }
  }, [pandit]);

  const handleDeleteSlots = async (date, slot) => {
    if (!window.confirm("Are you sure want to delete this slot?")) return;
    try {
      setLoading(true);
      await axios.delete(
        `${API_URL}/api/superadmin/delete-pandit-slots/${pandit?._id}`,
        {
          data: {
            date: date?.day,
            slotid: slot?._id,
          },
          withCredentials: true,
        }
      );
      toast.success("Slot deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      await refreshPandits();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete slot.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDate = async (dateId) => {
    if (!window.confirm("Are you sure want to delete this date?")) return;
    try {
      setLoading(true);
      await axios.delete(
        `${API_URL}/api/superadmin/deleteWholeDateslots/${pandit?._id}`,
        {
          data: { date_id: dateId },
          withCredentials: true,
        }
      );
      toast.success("Date deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      await refreshPandits();
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = () => {
    setTimeSlots([...timeSlots, { from: "", to: "" }]);
  };

  const handleRemoveSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...timeSlots];
    newSlots[index][field] = value;
    setTimeSlots(newSlots);
  };

  const handleSubmit = async () => {
    if (!selectedDate || timeSlots.some((slot) => !slot.from || !slot.to)) {
      toast.info("Please complete all fields before submitting.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
    const availability = {
      panditId: pandit?._id,
      date: selectedDate,
      slots: timeSlots,
    };

    try {
      setIsSubmitting(true);
      await axios.post(
        `${API_URL}/api/superadmin/bulid-slots-pandit`,
        availability,
        { withCredentials: true }
      );
      toast.success("Set availability successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      onClose();
      await refreshPandits();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to set availability.",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetMuhurts = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.55:3000/api/download-pooja-pdf/682db744879672c8ace734b8`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );
      const url = window.URL.createObjectURL(new Blob([response?.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "pooja_certificate.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Pooja Certificate downloaded!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch Muhurts.",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-6xl bg-yellow-50 p-6 rounded-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-[#FFD700]">
          Existing Slots for {pandit?.name}
        </h2>

        <div className="overflow-x-auto bg-white shadow-md mb-6">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-700">
            <thead className="bg-[#FFD700]">
              <tr>
                <th className="px-6 py-3 font-semibold border">S.NO</th>
                <th className="px-6 py-3 font-semibold border">Date</th>
                {slots.map((slot, index) => (
                  <th
                    key={slot?._id}
                    className="px-6 py-3 font-semibold text-center border"
                  >
                    Slot {index + 1}
                  </th>
                ))}
                <th className="px-6 py-3 font-semibold border">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {availabilityData?.map((item, index) => (
                <tr
                  key={item?._id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  <td className="px-4 py-2 font-bold">{index + 1}</td>
                  <td className="px-4 py-2 font-bold">{item?.day}</td>
                  {item?.slots?.map((slot, i) => (
                    <td
                      key={i}
                      className={`px-4 py-2 text-center relative group ${
                        slot?.booking_satus === "booked"
                          ? "bg-red-300 text-white"
                          : slot?.booking_satus === "hold"
                          ? "bg-yellow-200 text-black"
                          : "bg-green-200 text-black"
                      }`}
                    >
                      {slot?.from} - {slot?.to}
                      {slot?.booking_satus !== "booked" && (
                        <button
                          onClick={() => handleDeleteSlots(item, slot)}
                          className="absolute hidden group-hover:flex top-2 right-1 p-1 bg-red-200 border-2 border-red-500 rounded-full"
                        >
                          <MdDelete
                            className="text-red-500 hover:cursor-pointer"
                            size={20}
                          />
                        </button>
                      )}
                    </td>
                  ))}

                  {item?.slots?.length < slotsLength &&
                    Array(slotsLength - item?.slots?.length)
                      .fill("")
                      .map((_, i) => (
                        <td key={i} className="px-4 py-2 text-center">
                          —
                        </td>
                      ))}
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleDeleteDate(item?._id)}>
                      {" "}
                      <MdDelete
                        className="text-red-500 hover:cursor-pointer"
                        size={20}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-bold mb-4 text-[#FFD700]">
          Set Availability to {pandit?.name}{" "}
        </h2>
        <div className="flex items-center justify-center">
          <div className="mb-6 max-w-md">
            <div className="flex items-end gap-2">
              <button
                className="bg-indigo-700 hover:bg-yellow-300 hover:text-black px-3 rounded-md flex items-center gap-2 text-white shadow-lg border-2 border-yellow-600 h-10 hover:cursor-pointer"
                onClick={handleGetMuhurts}
              >
                Get Muhurts
                <MdOutlineGetApp />
              </button>
              <label className="block font-medium">
                Select Date:
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded-md bg-white text-sm shadow-lg h-10 focus:ring-yellow-400 focus:border-yellow-400 transition"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </label>
            </div>
            {selectedDate && (
              <div className="space-y-4 mt-5">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded bg-white shadow-sm"
                  >
                    <div>
                      <label className="block font-medium">From</label>
                      <input
                        type="time"
                        className="w-full border px-3 py-2 rounded shadow-sm"
                        value={slot.from}
                        onChange={(e) =>
                          handleSlotChange(index, "from", e.target.value)
                        }
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block font-medium">To</label>
                      <input
                        type="time"
                        className="w-full border px-3 py-2 rounded shadow-sm"
                        value={slot.to}
                        onChange={(e) =>
                          handleSlotChange(index, "to", e.target.value)
                        }
                      />
                    </div>
                    {timeSlots.length > 1 && (
                      <button
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
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add Another Time Slot
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <LoadingButton
            onClick={handleSubmit}
            loading={isSubmitting}
            variant="contained"
            sx={{
              backgroundColor: "#FFD700",
              color: "black",
              px: 2,
              py: 1,
              borderRadius: "0.25rem",
              fontSize: "1rem",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#FFD700",
              },
              "&.Mui-disabled": {
                backgroundColor: "#FFD700",
                color: "black",
              },
            }}
          >
            {isSubmitting ? "" : "Set Availability"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default PanditAvailabilityModal;
