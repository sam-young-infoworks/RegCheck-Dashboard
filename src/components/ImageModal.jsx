import React from "react";

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Document Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Close image"
          >
            <svg
              className="w-6 h-6 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(90vh - 80px)" }}
        >
          <img src={imageUrl} alt="Document" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
