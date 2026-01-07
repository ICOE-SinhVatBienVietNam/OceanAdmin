import React, { useEffect, useState } from "react";
import AddOneSpeciesModal from "../component/AddOneSpeciesModal";
import AddSpeciesModal from "../component/AddSpeciesModal";
import SpeciesDetailModal from "../component/SpeciesDetailModal";
import { useDispatch, useSelector } from "react-redux";
import { SpeciesService } from "../../service/SpeciesService";
import { RootState } from "../../redux/store";
import { useDebounce } from "../../hooks/Debounce";
import {
  setDetailSpecies,
  setPage,
  SpeciesData,
} from "../../redux/reducer/speciesReducer";

// --- Type Definitions --- //
export interface Thumbnail {
  thumbnail: string | null;
  is_main: boolean;
}

export interface CommonName {
  name: string | null;
}

export interface Coordinate {
  latitude: string | null;
  longitude: string | null;
}

export interface Reference {
  display_name: string;
  path: string | null;
}

export interface Species {
  id: string | number;
  group: string;
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;
  genus: string | null;
  species: string;
  threatened_symbol: string | null;
  impact: string | null;
  description: string | null;
  characteristic: string | null;
  habitas: string | null | null;
  distribution_vietnam: string | null;
  distribution_world: string | null;
  species_coordinates: Coordinate[];
  common_names: CommonName[];
  references: Reference[];
  thumbnails: Thumbnail[];
}

export interface AddOneSpeciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onAdd is optional here; when provided it receives the species data and the real File[] selected by the user
  onAdd?: (newSpecies: Omit<Species, "id">, files: File[]) => void;
}

export interface SpeciesField {
  key: keyof Omit<Species, "id">;
  label: string;
  required?: boolean;
  isArray?: boolean;
  isObjectArray?: "common_names" | "coordinates" | "references" | "thumbnails";
  isTextArea?: boolean;
  width?: string;
  sortable?: boolean;
}

// --- Fields Configuration --- //
export const speciesFields: SpeciesField[] = [
  { key: "species", label: "Tên khoa học", required: true, width: "w-64" },
  {
    key: "common_names",
    label: "Tên tiếng Việt",
    width: "w-48",
    isObjectArray: "common_names",
  },
  { key: "group", label: "Nhóm", width: "w-32", sortable: true },
  { key: "phylum", label: "Ngành", width: "w-32", sortable: true },
  { key: "class", label: "Lớp", width: "w-32", sortable: true },
  { key: "order", label: "Bộ", width: "w-32", sortable: true },
  { key: "family", label: "Họ", width: "w-32", sortable: true },
  { key: "genus", label: "Giống", width: "w-32", sortable: true },
  { key: "threatened_symbol", label: "Ký hiệu", width: "w-24", sortable: true },
  { key: "description", label: "Mô tả", width: "w-72", isTextArea: true },
  { key: "characteristic", label: "Đặc điểm", width: "w-72", isTextArea: true },
  { key: "impact", label: "Tác động", width: "w-72", isTextArea: true },
  { key: "habitas", label: "Nơi sống", width: "w-64" },
  { key: "distribution_vietnam", label: "Phân bố Việt Nam", width: "w-64" },
  { key: "distribution_world", label: "Phân bố thế giới", width: "w-64" },
  {
    key: "species_coordinates",
    label: "Tọa độ",
    width: "w-64",
    isObjectArray: "coordinates",
  },
  {
    key: "references",
    label: "Tài liệu tham khảo",
    width: "w-72",
    isObjectArray: "references",
  },
  {
    key: "thumbnails",
    label: "Ảnh",
    width: "w-48",
    isObjectArray: "thumbnails",
  },
];

// --- Main Component --- //
const Database: React.FC = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector((state: RootState) => state.adminReducer.isAuth)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddMultipleOpen, setIsAddMultipleOpen] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");
  const [changePageValue, setChangePageValue] = useState<number>(1);
  const debounceSearch = useDebounce(search, 500);
  const pageValue = useDebounce(changePageValue, 500);

  const paginationData = useSelector(
    (state: RootState) => state.speciesReducer.data,
  );

  const total = useSelector((state: RootState) => state.speciesReducer.total);

  const pageNumber = useSelector(
    (state: RootState) => state.speciesReducer.page,
  );

  const totalPages = useSelector(
    (state: RootState) => state.speciesReducer.totalPages,
  );

  const [selectedSpeciesIds, setSelectedSpeciesIds] = useState<string[]>([]);

  const deleteSpecies = async () => {
    await SpeciesService.deleteMultipleSpecies(selectedSpeciesIds);
    setSelectedSpeciesIds([]);
    setIsDeleteMode(false);
  };

  const handleDeleteSelected = () => {
    deleteSpecies();
    setSelectedSpeciesIds([]);
    setIsDeleteMode(false);
  };

  // Pagination
  useEffect(() => {
    if (!isAuth) return
    const abortController = new AbortController();
    (async () => {
      await SpeciesService.getAllSpecies(
        pageNumber,
        50,
        debounceSearch,
        "DESC",
        abortController.signal,
      );
    })();

    return () => {
      abortController.abort();
    };
  }, [dispatch, debounceSearch, pageNumber, isAuth]);

  // Handler

  const handleSelectAll = () => {
    if (selectedSpeciesIds.length === paginationData.length) {
      setSelectedSpeciesIds([]);
    } else {
      setSelectedSpeciesIds(paginationData.map((item) => item.id as string));
    }
  };

  const handleSelectSpecies = (id: string) => {
    setSelectedSpeciesIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => prevId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const nextPage = () => {
    if (pageNumber < totalPages) {
      setChangePageValue(pageNumber + 1);
    }
  };

  useEffect(() => {
    dispatch(setPage(pageValue));
  }, [pageValue]);

  const backPage = () => {
    if (pageNumber > 1) {
      setChangePageValue(pageNumber - 1);
    }
  };

  // Detail modal
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const handleRowClick = (species: SpeciesData) => {
    dispatch(setDetailSpecies(species));
    toggleDetailModal();
  };

  const toggleDetailModal = () => {
    setIsDetail(!isDetail);
  };

  return (
    <div className="p-8 bg-gray-50 h-full flex flex-col">
      {/* Header & Actions */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="w-1/3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên khoa học, tên tiếng việt, nhóm, mô tả..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
        <div className="flex gap-4 items-center">
          {isDeleteMode && (
            <button
              onClick={handleDeleteSelected}
              disabled={selectedSpeciesIds.length === 0}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Xóa đã chọn ({selectedSpeciesIds.length})
            </button>
          )}
          <button
            onClick={() => {
              setIsDeleteMode((prev) => !prev);
              setSelectedSpeciesIds([]); // Clear selections when toggling delete mode
            }}
            className={`${isDeleteMode ? "bg-yellow-400 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"} font-bold py-2 px-4 rounded-lg shadow-md transition duration-300`}
          >
            {isDeleteMode ? "Hủy xóa" : "Chọn để xóa"}
          </button>

          {!isDeleteMode && (
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                + Thêm loài mới
              </button>
              <button
                onClick={() => setIsAddMultipleOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                + Thêm nhiều loài
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-md">
        {/* Phân trang */}
        <div className="flex items-center justify-between p-2.5">
          <div className="">
            <span className="flex items-center gap-1.5">
              <p className="text-csNormal">
                {!debounceSearch ? "Dữ liệu " : "Tìm thấy "}
                <b className="text-mainRed">{total}</b> loài
              </p>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-csNormal">Trang {pageNumber}</span>

            <span className="flex items-center gap-1">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={backPage}
                disabled={pageNumber === 1}
              >
                Trước
              </button>
              <input
                type="number"
                className="h-[30px] w-[50px] border-[0.5px] border-lightGray text-csNormal px-2.5 text-center"
                value={pageNumber}
                onChange={(e) => {
                  if (
                    Number(e.target.value) < 1 ||
                    Number(e.target.value) > totalPages
                  )
                    return;
                  setChangePageValue(Number(e.target.value));
                }}
              />
              <button
                className="px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={nextPage}
                disabled={pageNumber === totalPages}
              >
                Sau
              </button>
            </span>
          </div>
        </div>

        {/* Table wrapper để cuộn */}
        <div className="overflow-auto max-h-[75vh]">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {isDeleteMode && (
                  <th
                    scope="col"
                    className="sticky top-0 bg-gray-100 z-20 p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 w-16"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      checked={
                        paginationData.length > 0 &&
                        selectedSpeciesIds.length === paginationData.length
                      }
                      onChange={() => handleSelectAll()}
                    />
                  </th>
                )}

                {speciesFields.map((field, index) => (
                  <th
                    key={field.key}
                    scope="col"
                    className={`sticky top-0 bg-gray-100 z-20 p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 ${field.width || ""} ${
                      index === 0 ? "sticky left-0 z-30 shadow-md" : ""
                    } ${field.sortable ? "cursor-pointer hover:bg-gray-200" : ""}`}
                  >
                    <div className="flex items-center">{field.label}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginationData &&
                paginationData.map((item) => {
                  return (
                    <tr
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        if (isDeleteMode) {
                          handleSelectSpecies(item.id as string);
                        } else {
                          handleRowClick(item);
                        }
                      }}
                    >
                      {isDeleteMode && (
                        <td className="p-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200 w-16">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            checked={selectedSpeciesIds.includes(
                              item.id as string,
                            )}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectSpecies(item.id as string);
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent row click
                          />
                        </td>
                      )}

                      {speciesFields.map((field, index) => {
                        return (
                          <td
                            key={field.key}
                            className={`p-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200 ${
                              field.width || ""
                            } ${
                              index === 0
                                ? "sticky left-0 bg-white z-10 shadow-sm"
                                : ""
                            }`}
                          >
                            {(() => {
                              const value =
                                item[field.key as keyof SpeciesData];

                              if (field.isObjectArray) {
                                const arrayValue = value as unknown[];
                                if (!arrayValue || arrayValue.length === 0) {
                                  return (
                                    <span className="text-gray-400">
                                      Chưa có
                                    </span>
                                  );
                                }
                                switch (field.key) {
                                  case "common_names":
                                    return (value as CommonName[])
                                      .map((cn) => cn.name)
                                      .join(", ");
                                  case "thumbnails":
                                    return `Có ${
                                      (value as Thumbnail[]).length
                                    } ảnh`;
                                  case "species_coordinates":
                                    return `Có ${
                                      (value as Coordinate[]).length
                                    } tọa độ`;
                                  case "references":
                                    return `Có ${
                                      (value as Reference[]).length
                                    } tài liệu`;
                                  default:
                                    return "[Dữ liệu phức tạp]";
                                }
                              }

                              if (
                                value === null ||
                                value === undefined ||
                                value === ""
                              ) {
                                return (
                                  <span className="text-gray-400">Chưa có</span>
                                );
                              }

                              return String(value);
                            })()}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <AddOneSpeciesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <AddSpeciesModal
        isOpen={isAddMultipleOpen}
        onClose={() => setIsAddMultipleOpen(false)}
      />
      {isDetail && <SpeciesDetailModal toggleModal={toggleDetailModal} />}
    </div>
  );
};

export default Database;
