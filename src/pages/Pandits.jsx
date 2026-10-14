import React, { useState, useContext } from "react";
import {
  MdModeEdit,
  MdAddCircleOutline,
  MdOutlineVerifiedUser,
  MdNumbers,
  MdOutlineQueryStats,
  MdEventAvailable,
  MdDeleteForever,
} from "react-icons/md";
import Switch from "@mui/material/Switch";
import TablePagination from "@mui/material/TablePagination";
import AddModal from "../components/pandits/AddModal";
import EditPanditModal from "../components/pandits/EditPanditModal";
import AddPanditPooja from "../components/pandits/AddPanditPooja";
import UpdateImageModal from "../components/pandits/UpdateImageModal";
import PanditAvailabilityModal from "../components/pandits/PanditAvailabilityModal";
import { PanditContext } from "../context/PanditContext";
import { toast, Bounce } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";

const Pandits = () => {
  const {
    pandits,
    loading,
    editingPandit,
    setEditingPandit,
    editFormData,
    setEditFormData,
    isAddModalOpen,
    isEditModalOpen,
    setIsAddModalOpen,
    setIsEditModalOpen,
    fetchPandits,
  } = useContext(PanditContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [activePanditId, setActivePanditId] = useState(null);
  const [isPoojaModalOpen, setIsPoojaModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isPanditAvailabilityModal, setPanditAvailabilityModal] =
    useState(false);
  const [selectedPanditForAvailability, setSelectedPanditForAvailability] =
    useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const closeEditModal = () => setIsEditModalOpen(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenPoojaModal = (pandit) => {
    setActivePanditId(pandit._id);
    setSelectedPanditForAvailability(pandit);
    setIsPoojaModalOpen(true);
  };

  const handleClosePoojaModal = () => {
    setActivePanditId(null);
    setIsPoojaModalOpen(false);
  };

  const handleStatus = async (slug, newStatus) => {
    if (
      !window.confirm("Are you sure want to change the status of this pandit?")
    )
      return;
    try {
      const response = await fetch(
        `${API_URL}/api/update-pandit-profile/${slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(`Pandit status changed to ${newStatus}`, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      fetchPandits();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred!";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPandits = pandits.filter((pandit) => {
    const matchesStatus =
      filterStatus === "all" ? true : pandit.status === filterStatus;
    const matchesSearch = pandit.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handlePanditAvailabilityModal = (pandit) => {
    setSelectedPanditForAvailability(pandit);
    setPanditAvailabilityModal(true);
  };

  const handleClosePanditAvailabilityModal = () => {
    setSelectedPanditForAvailability(null);
    setPanditAvailabilityModal(false);
  };

  const handleDeletePandit = async (panditId) => {
    if (!window.confirm("Are you sure want to delete this pandit?")) return;
    try {
      const response = await fetch(
        `${API_URL}/api/superadmin/delete-pandit/${panditId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pandit");
      }

      toast.success("Pandit deleted successfully", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });

      fetchPandits();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred!";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  if (loading) {
    return (
      <section className="h-screen flex justify-center items-center">
        <RotatingLines
          visible={true}
          height="60"
          width="60"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </section>
    );
  }

  const isAnyModalOpen =
    isAddModalOpen ||
    isEditModalOpen ||
    isImageModalOpen ||
    isPoojaModalOpen ||
    isPanditAvailabilityModal;

  return (
    <div className="p-6">
      <h1
        className={`text-3xl font-bold mb-6 text-center text-gray-800 transition duration-100 ${
          isAnyModalOpen ? "blur-3xl pointer-events-none select-none" : ""
        }`}
      >
        All Pandits
      </h1>

      {isEditModalOpen && <EditPanditModal onClose={closeEditModal} />}
      {isAddModalOpen && (
        <AddModal onClose={closeAddModal} refreshPandits={fetchPandits} />
      )}
      {isImageModalOpen && (
        <UpdateImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          pandit={editingPandit}
          formData={editFormData}
          setFormData={setEditFormData}
          fetchPandits={fetchPandits}
        />
      )}
      {isPoojaModalOpen && (
        <AddPanditPooja
          panditId={activePanditId}
          panditPoojas={
            pandits.find((p) => p._id === activePanditId)?.pooja || []
          }
          onClose={handleClosePoojaModal}
          refreshPandits={fetchPandits}
        />
      )}

      {isPanditAvailabilityModal && (
        <PanditAvailabilityModal
          isOpen={isPanditAvailabilityModal}
          pandit={pandits.find(
            (p) => p._id === selectedPanditForAvailability?._id
          )}
          onClose={handleClosePanditAvailabilityModal}
          refreshPandits={fetchPandits}
        />
      )}

      <div
        className={`transition duration-100 ${
          isAnyModalOpen ? "blur-3xl pointer-events-none select-none" : ""
        }`}
      >
        <div className="flex justify-between items-center gap-6 mb-5 flex-wrap">
          <div className="flex items-center gap-5">
            <button
              className="bg-[#FFD700] px-5 py-2 rounded-lg cursor-pointer font-semibold"
              onClick={openAddModal}
            >
              ADD PANDIT
            </button>
            <h1 className="text-2xl font-bold">Status:</h1>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-yellow-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-5 py-2 rounded-lg cursor-pointer font-semibold"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="not-verified">Not Verified</option>
            </select>
            <input
              type="text"
              placeholder="Search by Pandit name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-yellow-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-4 py-2 rounded-lg"
            />
          </div>
          <div className="bg-[#4B0082] border border-gray-200 shadow-xl rounded-lg px-6 py-4 min-w-[200px]">
            <h2 className="text-lg font-semibold text-[#FFD700] mb-2 flex items-center gap-1">
              <span>
                <MdOutlineQueryStats className="size-4" />
              </span>
              Pandit Stats
            </h2>
            <div className="flex gap-10">
              <p className="text-sm text-white flex items-center justify-center gap-1">
                <span>
                  <MdNumbers className="size-4" />
                </span>
                Total Pandits:{" "}
                <span className="font-bold">{pandits.length}</span>
              </p>
              <p className="text-sm text-white flex items-center justify-center gap-1">
                <span>
                  <MdOutlineVerifiedUser className="size-4" />
                </span>
                Verified:{" "}
                <span className="font-bold">
                  {pandits.filter((p) => p.status === "verified")?.length}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mt-5">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-[#FFD700] text-left text-gray-800 uppercase text-sm leading-normal">
              <tr>
                <th className="py-4 px-6 rounded-tl-lg">Photo</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Mobile</th>
                <th className="py-4 px-6">DOB</th>
                <th className="py-4 px-6">Gender</th>
                <th className="py-4 px-6">Skills</th>
                <th className="py-4 px-6">Languages</th>
                <th className="py-4 px-6">Professional Qualifications</th>
                <th className="py-4 px-6">Experience</th>
                <th className="py-4 px-6">City</th>
                <th className="py-4 px-6">Pincode</th>
                <th className="py-4 px-6">Add Pooja</th>
                <th className="py-4 px-6">Availability</th>
                <th className="py-4 px-6 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredPandits
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pandit, index) => (
                  <tr
                    key={pandit._id}
                    className={`border-b hover:bg-gray-100 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2 relative group min-w-25">
                      {pandit?.panditGallery?.length ? (
                        <>
                          <div className="relative group">
                            <img
                              src={pandit?.panditGallery?.[0]?.imageurl}
                              alt={`${pandit.name ?? "Pandit"}'s image`}
                              loading="lazy"
                              className="w-16 h-16 object-cover rounded-md cursor-pointer border border-gray-300 transition-transform duration-300 ease-in-out"
                            />

                            <div className="absolute bottom-1 right-1 z-10">
                              <MdModeEdit
                                size={20}
                                aria-label="Edit image"
                                className="bg-[#FFD700] bg-opacity-50 p-1 rounded-full cursor-pointer"
                                title="Edit"
                                onClick={() => {
                                  setEditingPandit(pandit);
                                  setEditFormData({ image: pandit?.image });
                                  setIsImageModalOpen(true);
                                }}
                              />
                            </div>
                          </div>

                          <div className="absolute top-2 left-25 z-20 hidden hover:cursor-pointer group-hover:flex flex-wrap bg-white p-3 border border-gray-200 rounded-md shadow-xl space-x-2 w-max opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                            {pandit?.panditGallery.map((img, idx) => (
                              <img
                                key={img._id || idx}
                                src={img?.imageurl}
                                alt={`Gallery-${idx}`}
                                loading="lazy"
                                className="w-[100px] h-[100px] object-cover rounded-md border border-gray-200 hover:scale-150 hover:z-50 transition-transform duration-200 ease-in-out"
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-md">
                          NA
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-6">{pandit?.name}</td>
                    <td className="py-3 px-6">{pandit?.mobile}</td>
                    <td className="py-3 px-6">{pandit?.dob}</td>
                    <td className="py-3 px-6">{pandit?.gender}</td>
                    <td className="py-3 px-6">
                      {Array.isArray(pandit?.Skills)
                        ? pandit?.Skills.join(", ")
                        : pandit?.Skills}
                    </td>
                    <td className="py-3 px-6">
                      {Array.isArray(pandit?.languages)
                        ? pandit?.languages.join(", ")
                        : pandit?.languages}
                    </td>
                    <td className="py-3 px-6">
                      {Array.isArray(pandit?.ProfessionalQualifications)
                        ? pandit?.ProfessionalQualifications.join(", ")
                        : pandit?.ProfessionalQualifications}
                    </td>
                    <td className="py-3 px-6">{pandit?.experience}</td>
                    <td className="py-3 px-6">{pandit?.city}</td>
                    <td className="py-3 px-6">{pandit?.pincode}</td>
                    <td className="py-3 px-6">
                      <h3 className="flex items-center justify-center gap-2">
                        Manage
                        <MdAddCircleOutline
                          className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer"
                          onClick={() => handleOpenPoojaModal(pandit)}
                        />
                      </h3>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-2 justify-center items-center">
                        <h3 className="flex items-center justify-center gap-2">
                          Activity
                          <MdEventAvailable
                            className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer"
                            onClick={() =>
                              handlePanditAvailabilityModal(pandit)
                            }
                          />
                        </h3>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex gap-2 justify-center items-center">
                        <Switch
                          checked={pandit?.status === "verified"}
                          onChange={() =>
                            handleStatus(
                              pandit?.slug,
                              pandit?.status === "verified"
                                ? "not-verified"
                                : "verified"
                            )
                          }
                          name="verified"
                        />
                        <MdModeEdit
                          className="text-green-500 hover:text-green-800 text-xl cursor-pointer"
                          title="Edit"
                          onClick={() => {
                            setEditingPandit(pandit);
                            setEditFormData({
                              mobile: pandit?.mobile,
                              dob: pandit?.dob,
                              gender: pandit?.gender,
                              skills: pandit?.Skills,
                              languages: pandit?.languages,
                              qualifications:
                                pandit?.ProfessionalQualifications,
                              packages: pandit?.PanditPackage,
                              status: pandit?.status,
                              city: pandit?.city,
                              belongs: pandit?.belongsTo,
                              pincode: pandit?.pincode,
                            });
                            setIsEditModalOpen(true);
                          }}
                        />
                        <MdDeleteForever
                          className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
                          onClick={() => handleDeletePandit(pandit?._id)}
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component="div"
          count={filteredPandits.length}
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

export default Pandits;
