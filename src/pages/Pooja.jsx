import React, { useState, useContext, useEffect } from "react";
import {
  MdModeEdit,
  MdAddCircleOutline,
  MdOutlineQueryStats,
  MdNumbers,
  MdOutlineVerifiedUser,
  MdDelete,
} from "react-icons/md";
import { toast, Bounce } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { PoojaContext } from "../context/PoojaContext";
import MuhuratModel from "../components/poojas/MuhuratModel";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import EditPoojaModel from "../components/poojas/EditPoojaModel";
import AddPoojaModal from "../components/poojas/AddPoojaModal";
import axios from "axios";
import { TablePagination } from "@mui/material";
import AddPackage from "../components/poojas/AddPackage";

const Pooja = () => {
  const {
    poojas,
    setPoojas,
    loading,
    fetchPooja,
    setLoading,
    // muhurat data and model
    muhuratData,
    muhuratModel,
    setMuhuratData,
    setMuhuratModel,
    // pooja data and model
    poojaData,
    setPoojaData,
    poojaModel,
    setPoojaModel,
    // add new pooja model
    addPoojaData,
    setAddPoojaData,
    addPoojaModel,
    setAddPoojaModel,
    handleUpdatePooja,
    // package model
    packageModel,
    setPackageModel,
    packageData,
    setPackageData,
  } = useContext(PoojaContext);

  const API_URL = import.meta.env.VITE_API_URL;
  const [visibilityBtn, setVisibliltyBtn] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

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
          wrapperStyle={{}}
          wrapperClass=""
        />
      </section>
    );
  }

  async function handleVisibilityChange(poojaID, visibility) {
    const confirmDelete = window.confirm(
      "Are you sure you want to change visibility of this pooja?"
    );
    if (!confirmDelete) return;

    visibility = visibility === "on" ? "off" : "on";
    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_URL}/api/update-pooja-details/${poojaID}`,
        { visibility: visibility },
        { withCredentials: true }
      );

      const newPooja = response?.data?.data;
      if (newPooja) {
        const updatedPoojas = poojas?.map((pooja) =>
          pooja._id === newPooja._id ? { ...pooja, ...newPooja } : pooja
        );
        setPoojas(updatedPoojas);
      }

      toast.success(`Pooja visibility changed to ${visibility}`, {
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
      toast.error(`Error updating pooja visibility`, {
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
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredPoojas = poojas
    ?.filter((pooja) =>
      filterStatus === "all" ? true : pooja?.visibility === filterStatus
    )
    ?.filter((pooja) =>
      pooja?.poojaName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  async function handleDeletePooja(poojaID) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pooja?"
    );
    if (!confirmDelete) return;
    setLoading(true);
    try {
      const response = await axios.delete(
        `${API_URL}/api/superadmin/delete-pooja/${poojaID}`,
        { withCredentials: true }
      );

      toast.success(`Pooja Deleted successfully`, {
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
      toast.error(`Error deleting pooja`, {
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
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 uppercase text-center text-gray-800">
        All Pooja
      </h1>
      <div className="overflow-hidden">
        {/* muhurat model */}
        {muhuratModel && <MuhuratModel />}
        {/* edit pooja model */}
        {poojaModel && <EditPoojaModel />}
        {/* add new pooja */}
        {addPoojaModel && <AddPoojaModal />}
        {/* package model */}
        {packageModel && <AddPackage />}

        <div className="flex justify-between items-center gap-6 mb-5 flex-wrap">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setAddPoojaModel(true)}
              className="bg-[#FFD700] px-5 py-2 rounded-lg cursor-pointer font-semibold"
            >
              Add Pooja
            </button>
            <h1 htmlFor="filter" className="text-2xl font-bold">
              Visibility:
            </h1>
            <select
              value={filterStatus}
              name="filter"
              id="filter"
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-yellow-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-5 py-2 rounded-lg cursor-pointer font-semibold"
            >
              <option value="all">All</option>
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
            <input
              type="text"
              placeholder="Search by Pooja name..."
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
              Pooja Stats
            </h2>
            <div className="flex gap-10">
              <p className="text-sm text-white flex items-center justify-center gap-1">
                <span>
                  <MdNumbers className="size-4" />
                </span>
                Total Poojas:{" "}
                <span className="font-bold">{poojas?.length}</span>
              </p>
              <p className="text-sm text-white flex items-center justify-center gap-1">
                <span>
                  <IoMdEye className="size-4" />
                </span>
                Visibility:{" "}
                <span className="font-bold">
                  {poojas?.filter((p) => p?.visibility === "on")?.length}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto mt-5">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden mt-5 overflow-x-auto">
            <thead className="bg-[#FFD700] text-left uppercase text-sm leading-normal">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Image
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Allowed Days
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Restricted Tithi
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Duration
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Ingredients
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium max-w-[300px]">
                  Procedure
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Sloks
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Requires Muhurta
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Visiblity
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Muhurut
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Price (₹)
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Packages
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Pandits
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Edit
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Delete Pooja
                </th>
              </tr>
            </thead>
            <tbody className=" text-sm">
              {poojas?.length > 0 &&
                filteredPoojas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <tr
                      key={item._id}
                      className={`border-b hover:bg-gray-100 h-40 max-h-[100px] overflow-y-hidden transition duration-200  ${
                        index % 2 === 0 ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="px-4 py-2 relative group min-w-25">
                        {item?.images?.length ? (
                          <>
                            <img
                              src={item?.images?.[0]?.imageUrl}
                              alt="Pooja"
                              loading="lazy"
                              className="w-16 h-16 object-cover rounded-md cursor-pointer border border-gray-300 transition-transform duration-300 ease-in-out group-hover:scale-105"
                            />
                            {/* Hover Gallery */}
                            <div className="absolute top-5 left-20 z-20 hidden hover:cursor-pointer group-hover:flex flex-wrap bg-white p-3 border border-gray-200 rounded-md shadow-xl space-x-2 w-max opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                              {item?.images?.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img?.imageUrl}
                                  alt={`Pooja-${idx}`}
                                  loading="lazy"
                                  className="w-[100px] h-[100px] object-cover rounded-md border border-gray-200 hover:scale-155 hover:z-25 transition-transform duration-200 ease-in-out"
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

                      <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                        {item?.poojaName}
                      </td>
                      <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                        {item?.allowedDays?.join(", ")}
                      </td>
                      <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                        {item?.restrictedTithis?.join(", ")}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {item?.durationMinutes}
                      </td>
                      <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                        {item?.ingredients?.join(", ")}
                      </td>
                      <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                        {item?.procedure}
                      </td>
                      <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                        {item?.sloks}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {item?.requiresMuhurta ? "True" : "False"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {visibilityBtn ? (
                          <button
                            onClick={() => {
                              handleVisibilityChange(
                                item?._id,
                                item?.visibility
                              );
                            }}
                            className="cursor-pointer"
                          >
                            {item?.visibility === "on" ? (
                              <IoMdEye
                                size={24}
                                className="text-blue-500 hover:text-blue-700"
                              />
                            ) : (
                              <IoMdEyeOff
                                size={24}
                                className="text-red-500 hover:text-red-700"
                              />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleVisibilityChange(
                                item?._id,
                                item?.visibility
                              );
                            }}
                          ></button>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          className="py-2 px-3 rounded-[6px] hover:cursor-pointer"
                          onClick={() => {
                            setMuhuratData(item?.Muhurut?.availability),
                              setPoojaData(item),
                              setMuhuratModel(true);
                          }}
                        >
                          <h3 className="flex items-center justify-center gap-2">
                            Muhurut
                            <MdAddCircleOutline className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer" />
                          </h3>
                        </button>
                      </td>
                      <td className="px-4 py-2 text-sm">{item?.e_price}</td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          className="py-2 px-3 rounded-[6px] hover:cursor-pointer bg-[#FFD700]"
                          onClick={() => {
                            setPackageModel(true),
                              setPackageData(item?.packages),
                              setPoojaData(item);
                          }}
                        >
                          View
                        </button>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {item?.requiredPandits}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => {
                            setPoojaData(item), setPoojaModel(true);
                          }}
                          className="p-2 hover:cursor-pointer"
                        >
                          <MdModeEdit
                            size={24}
                            className="text-green-500 hover:text-green-700"
                          />
                        </button>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => {
                            handleDeletePooja(item?._id);
                          }}
                          className="p-2 hover:cursor-pointer"
                        >
                          <MdDelete
                            size={24}
                            className="text-red-500 hover:text-red-700"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component="div"
          count={filteredPoojas?.length || 0}
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

export default Pooja;
