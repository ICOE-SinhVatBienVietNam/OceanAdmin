import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { cloudinaryRoot } from "../../config/gateway";

// Lightbox component for displaying a single image with zoom and pan
const ImageLightbox: React.FC<{
  imageUrl: string;
  onClose: () => void;
}> = ({ imageUrl, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.2, 1);
    if (newZoom === 1) {
      // Reset pan and origin when zoomed all the way out
      setTranslate({ x: 0, y: 0 });
      setOrigin({ x: 50, y: 50 });
    }
    setZoom(newZoom);
    return newZoom;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop wheel events from propagating to the modal scroll

    const { clientX, clientY } = e;
    const imgElement = e.currentTarget.querySelector("img");
    if (!imgElement) return;

    const { left, top, width, height } = imgElement.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setOrigin({ x, y });

    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    if (zoom > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isPanning) {
      e.preventDefault();
      setTranslate({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.5)] overflow-hidden"
      onClick={onClose}
      onWheel={handleWheel}
    >
      <img
        src={cloudinaryRoot + imageUrl}
        alt="Zoomed"
        className="max-w-full max-h-full object-contain transition-transform duration-200"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
          transformOrigin: `${origin.x}% ${origin.y}%`,
          cursor: zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
      />
      <div className="absolute top-4 right-4">
        <button
          onClick={onClose}
          className="p-2 text-white bg-red-600 rounded-full hover:bg-red-500 px-4"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

interface SpeciesDetailModalProps {
  toggleModal: () => void;
}

const SpeciesDetailModal: React.FC<SpeciesDetailModalProps> = ({
  toggleModal,
}) => {
  const speciesDetail = useSelector(
    (state: RootState) => state.speciesReducer.speciesDetail,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!speciesDetail) {
    return null; // Return null if no species is selected
  }

  // Stop propagation to prevent closing the modal when clicking inside the content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.5)]"
        onClick={toggleModal} // Close modal on overlay click
      >
        <div
          className="relative w-full max-w-5xl max-h-[90vh] mx-4 bg-gray-50 rounded-lg shadow-xl overflow-y-auto"
          onClick={handleContentClick}
        >
          {/* Header */}
          <div className="sticky top-0 left-0 bg-white flex items-start justify-between py-4 px-6 border-b rounded-t border-gray-200">
            <h2 className="text-3xl font-semibold text-gray-900">
              {speciesDetail.species}
            </h2>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={toggleModal}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Thumbnails Section */}
            {speciesDetail.thumbnails &&
              speciesDetail.thumbnails.length > 0 && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    Hình ảnh
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {speciesDetail.thumbnails.map((thumb, index) => (
                      <img
                        key={index}
                        src={cloudinaryRoot + thumb.thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
                        onClick={() => setSelectedImage(thumb.thumbnail)}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* Taxonomy Section */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <DetailItem label="Nhóm" value={speciesDetail.group} />
                <DetailItem label="Ngành" value={speciesDetail.phylum} />
                <DetailItem label="Lớp" value={speciesDetail.class} />
                <DetailItem label="Bộ" value={speciesDetail.order} />
                <DetailItem label="Họ" value={speciesDetail.family} />
                <DetailItem label="Giống" value={speciesDetail.genus} />
                <DetailItem
                  label="Mức độ đe dọa"
                  value={speciesDetail.threatened_symbol}
                />
              </div>
            </div>

            {/* Common Names Section */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Tên tiếng Việt
              </h3>
              {speciesDetail.common_names &&
              speciesDetail.common_names.length > 0 ? (
                <ul className="space-y-2">
                  {speciesDetail.common_names.map((name, index) => (
                    <li key={index} className="text-gray-700">
                      {name.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Không có tên gọi khác.</p>
              )}
            </div>

            {/* Description Section */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Thông tin
              </h3>
              <TextSection label="Mô tả" value={speciesDetail.description} />
              <TextSection
                label="Đặc điểm"
                value={speciesDetail.characteristic}
              />
              <TextSection label="Nơi sống" value={speciesDetail.habitas} />
              <TextSection label="Tác động" value={speciesDetail.impact} />
            </div>

            {/* Distribution Section */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Sự phân bố
              </h3>
              <TextSection
                label="Việt Nam"
                value={speciesDetail.distribution_vietnam}
              />
              <TextSection
                label="Thế giới"
                value={speciesDetail.distribution_world}
              />
            </div>

            {/* Coordinates Section */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Dữ liệu toạ độ
              </h3>
              {speciesDetail.species_coordinates &&
              speciesDetail.species_coordinates.length > 0 ? (
                <ul className="space-y-2">
                  {speciesDetail.species_coordinates.map((coord, index) => (
                    <li key={index} className="text-gray-700">
                      <span>Vĩ độ: {coord.latitude}</span>
                      <span className="ml-4">Kinh độ: {coord.longitude}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Không có dữ liệu toạ độ.</p>
              )}
            </div>

            {/* References Section */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Tài liệu tham khảo
              </h3>
              {speciesDetail.references &&
              speciesDetail.references.length > 0 ? (
                <ul className="space-y-2">
                  {speciesDetail.references.map((ref, index) => (
                    <li key={index} className="text-gray-700">
                      {ref.display_name}
                      {ref.path && (
                        <a
                          href={ref.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-2"
                        >
                          [Link]
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No references available.</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end pt-6 mt-6 border-t border-gray-200 p-6">
            <p className="text-sm text-gray-500">
              Cập nhật:{" "}
              {
                new Date(speciesDetail.created_at)
                  .toLocaleString("vi-VN")
                  .split(" ")[1]
              }
            </p>
          </div>
        </div>
      </div>
      {selectedImage && (
        <ImageLightbox
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

// Helper components (DetailItem, TextSection) remain the same
const DetailItem: React.FC<{ label: string; value: string | null }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm font-bold text-gray-600">{label}</p>
    <p className="text-md text-gray-800">{value || "N/A"}</p>
  </div>
);

const TextSection: React.FC<{ label: string; value: string | null }> = ({
  label,
  value,
}) => (
  <div className="mb-4">
    <p className="text-md font-semibold text-gray-700">{label}</p>
    <p className="text-md text-gray-800 whitespace-pre-wrap">
      {value || "Not specified."}
    </p>
  </div>
);

export default SpeciesDetailModal;
