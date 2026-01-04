import React, { useEffect, useRef, useState } from "react";
import { speciesFields } from "../page/Database";
import {
  AddOneSpeciesType,
  postSpeciesImageType,
  SpeciesService,
} from "../../service/SpeciesService";
import { toastConfig } from "../../config/toastConfig";
import { toast } from "react-toastify";

interface Coordinate {
  latitude: string;
  longitude: string;
}

interface CommonName {
  name: string;
}

interface Reference {
  display_name: string;
  path: string;
}

interface Thumbnail {
  thumbnail: string;
  is_main: boolean;
}

// Simplified Species type for basic input capture
interface Species {
  species: string;
  group: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  threatened_symbol: string;
  impact: string;
  description: string;
  characteristic: string;
  habitas: string;
  distribution_vietnam: string;
  distribution_world: string;
  common_names: CommonName[];
  coordinates: Coordinate[];
  references: Reference[];
  thumbnails: Thumbnail[];
}

export interface AddOneSpeciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormState: Species = {
  species: "",
  group: "",
  phylum: "",
  class: "",
  order: "",
  family: "",
  genus: "",
  threatened_symbol: "",
  impact: "",
  description: "",
  characteristic: "",
  habitas: "",
  distribution_vietnam: "",
  distribution_world: "",
  common_names: [{ name: "" }],
  coordinates: [{ latitude: "", longitude: "" }],
  references: [{ display_name: "", path: "" }],
  thumbnails: [],
};

export type ImageFile = {
  file: File;
  preview: string; // object URL for preview
  id: string; // unique id for stable keys
  isExisting?: boolean; // true if this image was an existing URL (not used here, but kept for extension)
};

const AddOneSpeciesModal: React.FC<AddOneSpeciesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [newSpecies, setNewSpecies] = useState<Species>(initialFormState);

  // Manage image files separately to support actual File objects + preview URLs
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

  // A ref to the file input so we can reset it if needed
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generic input handlers
  const handleInputChange = (key: keyof Species, value: string) => {
    setNewSpecies((prev) => ({ ...prev, [key]: value }));
  };

  const handleCoordinateChange = (
    index: number,
    field: "latitude" | "longitude",
    value: string,
  ) => {
    setNewSpecies((prev) => {
      const newCoordinates = [...prev.coordinates];
      newCoordinates[index] = { ...newCoordinates[index], [field]: value };
      return { ...prev, coordinates: newCoordinates };
    });
  };

  const handleCommonNameChange = (index: number, value: string) => {
    setNewSpecies((prev) => {
      const newCommonNames = [...prev.common_names];
      newCommonNames[index] = { name: value };
      return { ...prev, common_names: newCommonNames };
    });
  };

  const handleReferenceChange = (
    index: number,
    field: "display_name" | "path",
    value: string,
  ) => {
    setNewSpecies((prev) => {
      const newReferences = [...prev.references];
      newReferences[index] = { ...newReferences[index], [field]: value };
      return { ...prev, references: newReferences };
    });
  };

  const handleAddCoordinate = () => {
    setNewSpecies((prev) => ({
      ...prev,
      coordinates: [...prev.coordinates, { latitude: "", longitude: "" }],
    }));
  };

  const handleAddCommonName = () => {
    setNewSpecies((prev) => ({
      ...prev,
      common_names: [...prev.common_names, { name: "" }],
    }));
  };

  const handleAddReference = () => {
    setNewSpecies((prev) => ({
      ...prev,
      references: [...prev.references, { display_name: "", path: "" }],
    }));
  };

  const handleRemoveCoordinate = (index: number) => {
    setNewSpecies((prev) => ({
      ...prev,
      coordinates: prev.coordinates.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveCommonName = (index: number) => {
    setNewSpecies((prev) => ({
      ...prev,
      common_names: prev.common_names.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveReference = (index: number) => {
    setNewSpecies((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  // Handle files selected via the file input
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const additions: ImageFile[] = Array.from(files).map((file) => {
      const preview = URL.createObjectURL(file);
      const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
      return { file, preview, id };
    });

    setImageFiles((prev) => {
      const next = [...prev, ...additions];
      return next;
    });

    // Reset file input so same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove an image (revokes object URL)
  const removeImageAt = (index: number) => {
    setImageFiles((prev) => {
      const toRemove = prev[index];
      if (toRemove) {
        // Revoke object URL to avoid memory leaks
        try {
          URL.revokeObjectURL(toRemove.preview);
        } catch {
          // ignore
        }
      }
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
  };

  // Optional: reorder, set main image, etc. (not implemented here)

  // Cleanup all object URLs on unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach((img) => {
        try {
          URL.revokeObjectURL(img.preview);
        } catch {
          // ignore
        }
      });
    };
    // We intentionally do NOT add imageFiles to deps because we only want this to run once on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If modal closes, clear temporary files and form
  useEffect(() => {
    if (!isOpen) {
      // revoke previews
      imageFiles.forEach((img) => {
        try {
          URL.revokeObjectURL(img.preview);
        } catch {
          // ignore
        }
      });
      setImageFiles([]);
      setNewSpecies(initialFormState);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = async () => {
    let pending = toastConfig({
      pending: true,
      toastMessage: "Đang thêm loài mới...",
    });
    const filesToUpload = imageFiles.map((img) => img.file);
    const data: postSpeciesImageType | boolean =
      await SpeciesService.postSpeciesImage(filesToUpload);

    if (typeof data !== "boolean" && data.publicIds) {
      const speciesToSubmit: AddOneSpeciesType = {
        ...newSpecies,
        thumbnails: data.publicIds.map((id, index) => ({
          thumbnail: id,
          is_main: index === 0, // First image is main
        })),
        coordinates: newSpecies.coordinates
          .map((coord) => ({
            latitude: parseFloat(coord.latitude),
            longitude: parseFloat(coord.longitude),
          }))
          .filter((coord) => !isNaN(coord.latitude) && !isNaN(coord.longitude)),
      };

      await SpeciesService.addOneSpecies(speciesToSubmit);

      onClose(); // Close modal on success
    } else {
      // Handle error
      console.error("Image upload failed or returned no publicIds.");
    }

    toast.dismiss(pending);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex justify-end items-center z-50">
      <div className="h-full bg-white rounded-lg shadow-xl px-10 w-full max-w-4xl overflow-y-auto">
        <div className="sticky top-0 left-0 bg-white pt-10 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Thêm loài mới</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
          {speciesFields.map((field) => (
            <div
              key={field.key as string}
              className={
                field.isObjectArray || field.isTextArea ? "md:col-span-2" : ""
              }
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.isTextArea ? (
                <textarea
                  placeholder={field.label}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                  required={field.required}
                  value={
                    newSpecies[field.key as keyof Omit<Species, "id">] as string
                  }
                  onChange={(e) =>
                    handleInputChange(
                      field.key as keyof Species,
                      e.target.value,
                    )
                  }
                />
              ) : field.isObjectArray === "thumbnails" ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesSelected}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-4">
                    {imageFiles.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Chưa có ảnh nào. Chọn ảnh để tải lên.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {imageFiles.map((img, index) => (
                          <div
                            key={img.id}
                            className="relative border rounded-lg overflow-hidden"
                          >
                            <img
                              src={img.preview}
                              alt={`preview-${index}`}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImageAt(index)}
                              className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600 hover:bg-white"
                              title="Xóa ảnh"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : field.isObjectArray === "coordinates" ? (
                <div className="space-y-2">
                  {newSpecies.coordinates.map((coord, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-4 items-center"
                    >
                      <input
                        type="text"
                        placeholder={`Latitude ${index + 1}`}
                        value={coord.latitude}
                        onChange={(e) =>
                          handleCoordinateChange(
                            index,
                            "latitude",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Longitude ${index + 1}`}
                          value={coord.longitude}
                          onChange={(e) =>
                            handleCoordinateChange(
                              index,
                              "longitude",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCoordinate(index)}
                          className="text-red-500"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCoordinate}
                    className="text-sm font-medium text-blue-600"
                  >
                    + Thêm tọa độ
                  </button>
                </div>
              ) : field.isObjectArray === "references" ? (
                <div className="space-y-2">
                  {newSpecies.references.map((ref, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-4 items-center"
                    >
                      <input
                        type="text"
                        placeholder={`Tên hiển thị ${index + 1}`}
                        value={ref.display_name}
                        onChange={(e) =>
                          handleReferenceChange(
                            index,
                            "display_name",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Đường dẫn ${index + 1}`}
                          value={ref.path}
                          onChange={(e) =>
                            handleReferenceChange(index, "path", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveReference(index)}
                          className="text-red-500"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddReference}
                    className="text-sm font-medium text-blue-600"
                  >
                    + Thêm tài liệu tham khảo
                  </button>
                </div>
              ) : field.isObjectArray === "common_names" ? (
                <div className="space-y-2">
                  {newSpecies.common_names.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`${field.label} ${index + 1}`}
                        value={item.name}
                        onChange={(e) =>
                          handleCommonNameChange(index, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCommonName(index)}
                        className="text-red-500"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCommonName}
                    className="text-sm font-medium text-blue-600"
                  >
                    + Thêm {field.label.toLowerCase()}
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={field.label}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required={field.required}
                  value={
                    newSpecies[field.key as keyof Omit<Species, "id">] as string
                  }
                  onChange={(e) =>
                    handleInputChange(
                      field.key as keyof Species,
                      e.target.value,
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6 sticky bottom-0 bg-white py-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            Hủy
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mainShadow transition"
            onClick={handleSubmit}
          >
            Thêm loài
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOneSpeciesModal;
