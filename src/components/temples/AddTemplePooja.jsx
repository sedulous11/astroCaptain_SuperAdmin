import React, { useContext, useEffect, useState } from 'react';
import { TempleContext } from '../../context/TempleContext';
import { RxCrossCircled } from 'react-icons/rx';
import { PoojaContext } from '../../context/PoojaContext';
import axios from 'axios';

function AddTemplePoojaModal() {
  const {
    loading,
    setLoading,
    temples,
    setTemples,
    addTempleModel,
    setAddTempleModel,
    editTempleModel,
    setEditTempleModel,
    templeData,
    setTempleData,
    addTemplePoojaModel,
    setAddTemplePoojaModel,
    fetchTemples
  } = useContext(TempleContext);

  const { poojas } = useContext(PoojaContext);
  const [existingPoojas, setExistingPoojas] = useState([]);
  const [filteredPoojas, setFilteredPoojas] = useState([]);
  const [selectedPoojas, setSelectedPoojas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [existingLoading, setExistingLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (templeData?.famousFor?.length) {
      const filteredPoojas = templeData?.famousFor
        ?.filter(item => item?.pooja)
        .map(item => ({
          ...item?.pooja,
          famousForId: item?._id,
          poojaName: item?.pooja?.poojaName || 'Unnamed',
          _id: item?.pooja?._id || ''
        }));
      setExistingPoojas(filteredPoojas);
    }

    const existingIds = new Set(
      templeData?.famousFor?.map(item => item?.pooja?._id)
    );
    const filtered = poojas.filter(pooja => !existingIds.has(pooja._id));
    setFilteredPoojas(filtered);
  }, [templeData, poojas]);

  useEffect(() => {
    const existingIds = new Set(
      existingPoojas?.map(item => item._id)
    );
    const filtered = poojas.filter(pooja => !existingIds.has(pooja._id));
    setFilteredPoojas(filtered);
  }, [existingPoojas])

  const handleSelectChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, (opt) => opt.value);
    const selectedObjects = selectedIds.map((id) =>
      filteredPoojas.find((pooja) => pooja._id === id)
    );

    setSelectedPoojas((prevSelected) => {
      const updated = [...prevSelected];
      selectedObjects.forEach((pooja) => {
        if (pooja && !updated.some((item) => item._id === pooja._id)) {
          updated.push(pooja);
        }
      });
      return updated;
    });
  };

  const handleRemovePooja = (poojaId) => {
    setSelectedPoojas((prev) => prev.filter((pooja) => pooja._id !== poojaId));
  };

  const handleDeletePooja = async (famousForId) => {
    console.log(existingPoojas)
    try {
      setExistingLoading(true);
      const response = await axios.delete(`${API_URL}/api/superadmin/delete-pooja-temple`,
        {
          data: {
            templeId: templeData?._id,
            poojaId: famousForId
          },
          withCredentials: true
        }
      );
      let newPoojas = []
      response?.data?.data?.map((item) => {
        newPoojas.push({
          famousForId: item?._id,
          poojaName: item?.pooja?.poojaName,
          _id: item?.pooja?._id
        })
      })

      setExistingPoojas(newPoojas)
    } catch (error) {
      console.error('Error deleting pooja:', error);
    } finally {
      setExistingLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        templeId: templeData?._id,
        poojaid: selectedPoojas?.map(p => p._id),
      };
      console.log(payload)
      await axios.post(`${API_URL}/api/superadmin/addPoojaToTemple`, payload, { withCredentials: true });
      fetchTemples(); // Refresh temple data
      setAddTemplePoojaModel(false); // Close modal
    } catch (error) {
      console.error('Error adding poojas:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchedPoojas = filteredPoojas?.filter((pooja) =>
    pooja?.poojaName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xl">
      <div className="bg-yellow-50 shadow-2xl p-6 rounded-2xl max-w-md max-h-[90vh] w-full overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-md overflow-y-auto mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-black">Add Pooja</h1>

          <div>
            {existingLoading && <h2 className="text-2xl font-semibold mb-2 text-black">Existing Pooja List</h2>}

            {existingLoading ? <div className="flex items-center justify-center h-40 w-full">
              <div className="w-16 h-16 border-4 border-[#FFD700] border-dashed rounded-full animate-spin"></div>
            </div> : existingPoojas?.length > 0 && (
              <div className="mb-4 text-sm text-gray-700">
                <strong>Existing Poojas:</strong>
                <ul className="list-disc list-inside">
                  {existingPoojas?.map((pooja) => (
                    <li key={pooja._id} className="flex items-center space-x-2">
                      <span>{pooja?.poojaName}</span>
                      <RxCrossCircled
                        onClick={() => handleDeletePooja(pooja?.famousForId)}
                        className="text-red-500 hover:text-red-700 size-6 cursor-pointer"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <label htmlFor='search' className="block text-sm font-medium text-gray-700 mb-1">Search Pooja</label>
          <input
            type="text"
            name="search"
            placeholder="Search pooja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Poojas
          </label>
          <select
            multiple
            onChange={handleSelectChange}
            className="w-full border px-3 py-2 rounded border-gray-300 bg-white text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition duration-200"
          >
            {searchedPoojas?.length === 0 ? (
              <option disabled>No matching poojas found</option>
            ) : (
              searchedPoojas?.map((pooja) => (
                <option key={pooja._id} value={pooja._id}>
                  {pooja?.poojaName}
                </option>
              ))
            )}
          </select>

          {selectedPoojas?.length > 0 && (
            <div className="mt-4 text-sm text-gray-700">
              <strong>Selected Poojas:</strong>
              <ul className="list-disc list-inside">
                {selectedPoojas?.map((pooja) => (
                  <li key={pooja._id} className="flex items-center space-x-2">
                    <span>{pooja?.poojaName}</span>
                    <RxCrossCircled
                      onClick={() => handleRemovePooja(pooja._id)}
                      className="text-red-500 hover:text-red-700 size-6 cursor-pointer"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => {
                setAddTemplePoojaModel(false);
                fetchTemples();
              }}
              className="bg-gray-300 text-black mx-4 px-6 py-2 rounded-md hover:bg-gray-500 cursor-pointer transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-[#FFD700] text-black px-6 py-2 rounded-md hover:bg-[#ffd900ab] cursor-pointer transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTemplePoojaModal;
