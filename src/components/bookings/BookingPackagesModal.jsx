import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: "600px",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "linear-gradient(to bottom, #FFFBEB, #FFF9D5)",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  padding: "2rem",
};

const BookingPackagesModal = ({ open, onClose, booking }) => {
  const packageDetails = booking?.matchedPackage?.poojaPackages;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <h2 className="text-xl font-bold mb-4 text-[#FFD700]">
          Package Details
        </h2>

        {packageDetails ? (
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-800">
            <DetailRow label="Title" value={packageDetails.title} />
            <DetailRow label="Type" value={packageDetails.typeOfPackage} />
            <DetailRow label="No. of People" value={packageDetails.NoPepoles} />
            <DetailRow label="Subtitle" value={packageDetails.subtitle} />
            <DetailRow label="Price" value={`₹${packageDetails.price}`} />
            <DetailRow
              label="Material Included"
              value={packageDetails.materialIncluded === "yes" ? "Yes" : "No"}
            />
            <DetailRow label="Status" value={packageDetails.status} />
            <DetailRow
              label="Custom Description"
              value={packageDetails.CustomDescription}
            />
            <DetailRow
              label="Created At"
              value={new Date(packageDetails.createdAt).toLocaleString()}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No package details found.
          </p>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </Box>
    </Modal>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
      {label}
    </p>
    <p className="text-sm text-gray-900 break-words">{value || "N/A"}</p>
  </div>
);

export default BookingPackagesModal;
