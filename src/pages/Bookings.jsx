import React, { useState } from "react";
import { useBookingContext } from "../context/BookingContext";
import { RotatingLines } from "react-loader-spinner";
import TablePagination from "@mui/material/TablePagination";
import { MdAddCircleOutline, MdModeEdit } from "react-icons/md";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  MdOutlineQueryStats,
  MdNumbers,
  MdOutlineVerifiedUser,
} from "react-icons/md";
import BookingPackagesModal from "../components/bookings/BookingPackagesModal";
import { toast, Bounce } from "react-toastify";

const getStatusColor = (status) => {
  switch (status) {
    case "booked":
      return "bg-blue-500 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    case "completed":
      return "bg-green-500 text-white";
    default:
      return "";
  }
};

const getPaymentColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500 text-white";
    case "success":
      return "bg-green-500 text-white";
    case "failed":
      return "bg-red-500 text-white";
    case "refunded":
      return "bg-blue-500 text-white";
    default:
      return "";
  }
};

const Bookings = () => {
  const {
    activeTab,
    setActiveTab,
    bookings,
    epoojaBookings,
    loading,
    error,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useBookingContext();

  const clearFilters = () => {
    setStatusFilter("");
    setPaymentFilter("");
    setStartDate("");
    setEndDate("");
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [tempData, setTempData] = useState({});

  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [savingRowId, setSavingRowId] = useState(null);

  const handleBookingPackageModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  const handleEdit = (booking) => {
    setEditingRowId(booking._id);
    setTempData({
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    });
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSave = async (booking) => {
    setSavingRowId(booking._id);
    try {
      let endpoint = "";
      if (activeTab === "pandit") {
        endpoint = `${API_URL}/api/superadmin/update-pandit-bookings/${booking._id}`;
      } else if (activeTab === "epooja") {
        endpoint = `${API_URL}/api/superadmin/update-ebooking/${booking._id}`;
      }

      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: tempData.status,
          paymentStatus: tempData.paymentStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.warn(errorData.message || "Failed to update booking.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        setSavingRowId(null);
        return;
      }

      toast.success("Status updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      booking.status = tempData.status;
      booking.paymentStatus = tempData.paymentStatus;
      setEditingRowId(null);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setSavingRowId(null);
    }
  };

  const handleCancel = () => {
    setEditingRowId(null);
    setTempData({});
  };

  const filteredBookings = (
    activeTab === "pandit" ? bookings : epoojaBookings
  ).filter((booking) => {
    const bookingDate = new Date(
      activeTab === "pandit" ? booking.dateofpooja : booking.dateOfPooja
    );
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    const matchesPayment = paymentFilter
      ? booking.paymentStatus === paymentFilter
      : true;

    let matchesDate = true;
    if (startDate && !endDate) {
      matchesDate =
        bookingDate >= new Date(startDate) && bookingDate <= new Date();
    } else if (!startDate && endDate) {
      matchesDate = bookingDate <= new Date(endDate);
    } else if (startDate && endDate) {
      matchesDate =
        bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate);
    }

    return matchesStatus && matchesPayment && matchesDate;
  });

  const renderTableRow = (booking) => {
    const isEditing = editingRowId === booking._id;

    return (
      <tr
        key={booking._id}
        className="border-b hover:bg-gray-100 transition duration-200"
      >
        {activeTab === "pandit" ? (
          <>
            <td className="py-3 px-6">{booking?.firstName}</td>
            <td className="py-3 px-6">{booking?.lastName}</td>
            <td className="py-3 px-6">{booking?.mobile}</td>
            <td className="py-3 px-6">{booking?.email}</td>
            <td className="py-3 px-6">{booking?.dateofpooja}</td>
            <td className="py-3 px-6">{booking?.poojaid?.poojaName || "-"}</td>
            <td className="py-3 px-6">
              {booking?.matchedSlot?.from && booking?.matchedSlot?.to
                ? `${booking.matchedSlot.from} - ${booking.matchedSlot.to}`
                : "-"}
            </td>
            <td className="py-3 px-6">
              <div className="flex items-center gap-2">
                View
                <MdAddCircleOutline
                  className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer"
                  onClick={() => handleBookingPackageModal(booking)}
                />
              </div>
            </td>
            <td className="py-3 px-6">
              ₹{booking?.matchedPackage?.poojaPackages?.price || "-"}
            </td>
            <td className="py-3 px-6">{booking?.PanditId.name || "-"}</td>
            <td className="py-3 px-6">{booking?.address}</td>
            <td className="py-3 px-6">{booking?.pinCode}</td>
          </>
        ) : (
          <>
            <td className="py-3 px-6">{booking?.userId?.name}</td>
            <td className="py-3 px-6">{booking?.userId?.mobile}</td>
            <td className="py-3 px-6">{booking?.userId?.email}</td>
            <td className="py-3 px-6">{booking?.templeID?.name}</td>
            <td className="py-3 px-6">{booking?.poojaId?.poojaName}</td>
            <td className="py-3 px-6">{booking?.name?.join(", ") || "-"}</td>
            <td className="py-3 px-6">{booking?.dateOfPooja}</td>
            <td className="py-3 px-6">{booking?.gotra}</td>
            <td className="py-3 px-6">
              <div className="flex items-center gap-2">
                View
                <MdAddCircleOutline
                  className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer"
                  onClick={() => handleBookingPackageModal(booking)}
                />
              </div>
            </td>
            <td className="py-3 px-6">
              ₹{booking?.matchedPackage?.poojaPackages?.price}
            </td>
          </>
        )}

        <td className="py-3 px-6">
          {isEditing ? (
            <select
              value={tempData.status}
              onChange={(e) =>
                setTempData({ ...tempData, status: e.target.value })
              }
              className={`px-2 py-1 rounded border border-yellow-400 text-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer`}
            >
              <option value="booked">Booked</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          ) : (
            <h1
              className={`w-[100px] text-center px-2 py-1 rounded capitalize ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </h1>
          )}
        </td>

        <td className="py-3 px-6">
          {isEditing ? (
            <select
              value={tempData.paymentStatus}
              onChange={(e) =>
                setTempData({ ...tempData, paymentStatus: e.target.value })
              }
              className={`px-2 py-1 rounded border border-yellow-400 text-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer `}
            >
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          ) : (
            <h1
              className={`w-[100px] text-center px-2 py-1 rounded capitalize  ${getPaymentColor(
                booking.paymentStatus
              )}`}
            >
              {booking.paymentStatus}
            </h1>
          )}
        </td>

        <td className="py-3 px-6 text-center">
          {isEditing ? (
            <div className="flex gap-2 justify-center items-center min-w-[40px]">
              {savingRowId === booking._id ? (
                <RotatingLines
                  strokeColor="green"
                  strokeWidth="4"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />
              ) : (
                <>
                  <FaCheck
                    onClick={() => handleSave(booking)}
                    className="text-green-600 hover:text-green-800 cursor-pointer size-4"
                  />
                  <FaTimes
                    onClick={handleCancel}
                    className="text-red-500 hover:text-red-700 cursor-pointer size-4"
                  />
                </>
              )}
            </div>
          ) : (
            <MdModeEdit
              className="text-green-500 hover:text-green-800 text-xl cursor-pointer"
              onClick={() => handleEdit(booking)}
            />
          )}
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <section className="h-screen flex justify-center items-center">
        <RotatingLines visible={true} height="60" width="60" color="grey" />
      </section>
    );
  }

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <BookingPackagesModal
        open={modalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
      />

      <div
        className={`transition duration-100 ${
          modalOpen ? "blur-3xl pointer-events-none select-none" : ""
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          All Bookings
        </h1>
        <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4 flex-wrap">
          <div className="flex flex-wrap items-center gap-4 md:gap-5">
            <button
              className={`px-4 md:px-6 rounded-full h-[40px] font-bold text-base md:text-xl ${
                activeTab === "pandit"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("pandit");
                handleChangePage(null, 0);
              }}
            >
              Offline Booking
            </button>
            <button
              className={`px-4 md:px-6 rounded-full h-[40px] font-bold text-base md:text-xl ${
                activeTab === "epooja"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("epooja");
                handleChangePage(null, 0);
              }}
            >
              E-Pooja Booking
            </button>
          </div>

          <div className="bg-[#4B0082] border border-gray-200 shadow-xl rounded-lg px-4 md:px-6 py-4 w-full lg:w-auto min-w-[250px]">
            <h2 className="text-base md:text-lg font-semibold text-[#FFD700] mb-2 flex items-center gap-1">
              <MdOutlineQueryStats className="size-4" />
              {activeTab === "pandit"
                ? "Offline Booking Stats"
                : "E-Pooja Booking Stats"}
            </h2>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <p className="text-sm text-white flex items-center gap-2">
                <MdNumbers className="size-4" />
                Total:{" "}
                <span className="font-bold">{filteredBookings.length}</span>
              </p>
              <p className="text-sm text-white flex items-center gap-2">
                <FaCheck className="size-4 text-green-400" />
                Completed:{" "}
                <span className="font-bold">
                  {
                    filteredBookings.filter((b) => b.status === "completed")
                      .length
                  }
                </span>
              </p>
              <p className="text-sm text-white flex items-center gap-2">
                <MdOutlineVerifiedUser className="size-4 text-yellow-400" />
                Pending:{" "}
                <span className="font-bold">
                  {
                    filteredBookings.filter((b) => b.status === "pending")
                      .length
                  }
                </span>
              </p>
              <p className="text-sm text-white flex items-center gap-2">
                <FaTimes className="size-4 text-red-400" />
                Cancelled:{" "}
                <span className="font-bold">
                  {
                    filteredBookings.filter((b) => b.status === "cancelled")
                      .length
                  }
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-5 flex-wrap">
          <div className="flex flex-wrap items-center gap-4 md:gap-5">
            <h1 className="text-lg md:text-xl font-bold">Booking Status:</h1>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-yellow-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-4 md:px-5 py-2 rounded-lg font-semibold"
            >
              <option value="">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>

            <h1 className="text-lg md:text-xl font-bold">Payment Status:</h1>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="border border-yellow-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-4 md:px-5 py-2 rounded-lg font-semibold"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <h1 className="text-lg md:text-xl font-bold">From:</h1>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-yellow-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-4 md:px-5 py-2 rounded-lg font-semibold"
            />

            <h1 className="text-lg md:text-xl font-bold">To:</h1>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-yellow-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-4 md:px-5 py-2 rounded-lg font-semibold"
            />

            <button
              onClick={clearFilters}
              className="px-4 md:px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-5">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-[#FFD700] text-left text-gray-800 uppercase text-sm leading-normal">
              <tr>
                {activeTab === "pandit" ? (
                  <>
                    <th className="py-4 px-6">First Name</th>
                    <th className="py-4 px-6">Last Name</th>
                    <th className="py-4 px-6">Mobile</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Pooja's Date</th>
                    <th className="py-4 px-6">Pooja Name</th>
                    <th className="py-4 px-6">Slot</th>
                    <th className="py-4 px-6">Package</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Pandit</th>
                    <th className="py-4 px-6">Pooja Location</th>
                    <th className="py-4 px-6">Pincode</th>
                  </>
                ) : (
                  <>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Mobile</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Temple Name</th>
                    <th className="py-4 px-6">Pooja Name</th>
                    <th className="py-4 px-6">Participants</th>
                    <th className="py-4 px-6">Pooja's Date</th>
                    <th className="py-4 px-6">Gotra</th>
                    <th className="py-4 px-6">Package</th>
                    <th className="py-4 px-6">Price</th>
                  </>
                )}
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => renderTableRow(booking))}
            </tbody>
          </table>
        </div>

        <TablePagination
          component="div"
          count={filteredBookings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
      </div>
    </div>
  );
};

export default Bookings;
