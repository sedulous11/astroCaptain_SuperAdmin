import { TablePagination } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TempleContext } from "../context/TempleContext";
import AddTempleModal from "../components/temples/AddTempleModal";
import EditTempleModal from "../components/temples/EditTempleModal";
import { MdDelete } from "react-icons/md";

import {
  MdAddCircleOutline,
  MdModeEdit,
  MdNumbers,
  MdOutlineQueryStats,
} from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { RotatingLines } from "react-loader-spinner";
import { Bounce, toast } from "react-toastify";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axios from "axios";
import AddTemplePooja from "../components/temples/AddTemplePooja";

function Temple() {
  const {
    temples,
    setTemples,
    loading,
    setLoading,
    addTempleModel,
    setAddTempleModel,
    addTempleData,
    setAddTempleData,
    editTempleModel,
    setEditTempleModel,
    addTemplePoojaModel,
    setAddTemplePoojaModel,
    templeData,
    setTempleData,
    fetchTemples,
    templeMeta,
  } = useContext(TempleContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [visibilityBtn, setVisibliltyBtn] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  async function handleVisibilityChange(templeID, visibility) {
    const confirmDelete = window.confirm(
      "Are you sure you want to change visibility of this temple?"
    );
    if (!confirmDelete) return;

    if (visibility === "on") {
      visibility = "off";
    } else {
      visibility = "on";
    }
    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_URL}/api/superadmin/update-temple-details/${templeID}`,
        { visibility: visibility },
        { withCredentials: true }
      );
      toast.success(`Temple visibility changed to ${visibility}`, {
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
      toast.error(`Error updating temple visibility`, {
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
      fetchTemples();
      setLoading(false);
    }
  }

  async function handleDeleteTemple(templeID) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this temple? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axios.delete(
        `${API_URL}/api/superadmin/delete-temple/${templeID}`,
        {
          withCredentials: true,
        }
      );
      toast.success(`Temple deleted successfully`, {
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
      toast.error(`Failed to delete temple`, {
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
      fetchTemples();
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

  useEffect(() => {
    if (templeMeta?.currentPage) {
      setPage(templeMeta.currentPage - 1);
    }
  }, [templeMeta?.currentPage]);

  useEffect(() => {
    fetchTemples({
      page: page + 1,
      limit: rowsPerPage,
      search: searchQuery,
      visibility: filterStatus,
    });
  }, [page, rowsPerPage, filterStatus, searchQuery]);

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 uppercase text-center text-gray-800">
        Temples
      </h1>
      <div className="overflow-hidden">
        {/* add new temple */}
        {addTempleModel && <AddTempleModal />}
        {/* edit model */}
        {editTempleModel && <EditTempleModal />}
        {/* add pooja to temple model */}
        {addTemplePoojaModel && <AddTemplePooja />}

        <div className="flex justify-between items-center gap-6 mb-5 flex-wrap">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setAddTempleModel(true)}
              className="bg-[#FFD700] px-5 py-2 rounded-lg cursor-pointer font-semibold"
            >
              Add Temple
            </button>
            <label htmlFor="filter" className="text-2xl font-bold">
              Visibility:
            </label>
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
              placeholder="Search by Temple name..."
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
              Temple Stats
            </h2>
            <div className="flex gap-10">
              <p className="text-sm text-white flex items-center justify-center gap-1">
                <span>
                  <MdNumbers className="size-4" />
                </span>
                Total Temples:{" "}
                <span className="font-bold">{temples.length}</span>
              </p>
              <p className="text-sm text-white flex items-center justify-center gap-1">
                <span>
                  <IoMdEye className="size-4" />
                </span>
                Visibility:{" "}
                <span className="font-bold">
                  {temples.filter((p) => p.visibility === "on")?.length}
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
                  Place
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Significance
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Visiblity
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Famous For
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Add Pooja
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Edit
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Delete Temple
                </th>
              </tr>
            </thead>
            <tbody className=" text-sm">
              {temples &&
                temples.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b hover:bg-gray-100 h-40 max-h-[100px] overflow-y-hidden transition duration-200  ${
                      index % 2 === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2 relative group min-w-25">
                      {item?.img?.length ? (
                        <>
                          <img
                            src={item?.img?.[0]?.imageurl}
                            alt="Pooja"
                            loading="lazy"
                            className="w-16 h-16 object-cover rounded-md cursor-pointer border border-gray-300 transition-transform duration-300 ease-in-out group-hover:scale-105"
                          />
                          {/* Hover Gallery */}
                          <div className="absolute top-5 left-20 z-20 hidden hover:cursor-pointer group-hover:flex flex-wrap bg-white p-3 border border-gray-200 rounded-md shadow-xl space-x-2 w-max opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                            {item?.img?.map((image, idx) => (
                              <img
                                key={idx}
                                src={image?.imageurl}
                                alt={`temple-${idx}`}
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
                      {item?.name}
                    </td>
                    <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                      {item?.place}
                    </td>
                    <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                      {item?.description}
                    </td>
                    <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                      {item?.significance}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {visibilityBtn ? (
                        <button
                          onClick={() => {
                            handleVisibilityChange(item?._id, item?.visibility);
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
                            handleVisibilityChange(item?._id, item?.visibility);
                          }}
                        ></button>
                      )}
                    </td>

                    <td className="px-4 py-2 text-sm truncate max-w-[200px]">
                      {item?.famousFor
                        ?.map((item) => item?.pooja?.poojaName)
                        .filter((name) => name) // removes null, undefined, and empty strings
                        .join(", ")}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        className="py-2 px-3 rounded-[6px] hover:cursor-pointer"
                        onClick={() => {
                          setAddTemplePoojaModel(true), setTempleData(item);
                        }}
                      >
                        <MdAddCircleOutline className="text-blue-500 hover:text-blue-700 text-xl cursor-pointer" />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() => {
                          setTempleData(item), setEditTempleModel(true);
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
                        onClick={() => handleDeleteTemple(item._id)}
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
          count={templeMeta.total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20]}
        />
      </div>
    </div>
  );
}

export default Temple;
