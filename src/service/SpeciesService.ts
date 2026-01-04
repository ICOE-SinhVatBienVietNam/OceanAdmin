import * as XLSX from "xlsx";
import { Species, Coordinate, Reference } from "../ui/page/Database";
import api from "../config/gateway";
import { toastConfig } from "../config/toastConfig";
import {
  removeSpecies,
  setPagination,
  setPaginationData,
  SpeciesData,
} from "../redux/reducer/speciesReducer";
import { store } from "../redux/store";
import { toast } from "react-toastify";

export type SpeciesDataForPost_type = {
  species: Omit<Species, "id">;
  images: File[];
};

export type AddOneSpeciesType = {
  group: string | null;
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;

  genus: string; // NOT NULL
  species: string; // NOT NULL

  threatened_symbol: string | null;
  impact: string | null;
  description: string | null;
  characteristic: string | null;
  habitas: string | null;
  distribution_vietnam: string | null;
  distribution_world: string | null;

  coordinates:
    | {
        latitude: number;
        longitude: number;
      }[]
    | [];

  common_names:
    | {
        name: string;
      }[]
    | [];

  references:
    | {
        display_name: string;
        path: string;
      }[]
    | [];

  thumbnails:
    | {
        thumbnail: string;
        is_main: boolean;
      }[]
    | [];
};

export type postSpeciesImageType = {
  message: string;
  publicIds: string[];
};

export class SpeciesService {
  // Get all species
  public static async getAllSpecies(
    page: number,
    limit: number,
    search: string,
    sort_by: "DESC" | "ASC",
    signal?: AbortSignal,
  ) {
    toastConfig({
      toastType: "info",
      toastMessage: "Đang tải dữ liệu",
    });
    try {
      const { data, status } = await api.get("/species/get-all", {
        params: {
          page,
          limit,
          search,
          sort_by,
        },
        signal,
      });

      if (status === 200 || status === 201) {
        const speciesDataPagination = data as {
          data: SpeciesData[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
        };

        store.dispatch(setPaginationData(speciesDataPagination.data));
        store.dispatch(setPagination(speciesDataPagination.pagination));
        return true;
      }

      return false;
    } catch (error) {
      if (error instanceof Error && error.name === "CanceledError")
        return false;
      toastConfig({
        toastType: "error",
        toastMessage: "Lỗi khi tải dữ liệu",
      });
      console.error("Error fetching species data:", error);
      return false;
    }
  }

  public static async postSpeciesImage(images: File[]) {
    if (images.length === 0) return false;

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    formData.append("folderName", "test");

    try {
      const { data, status } = await api.post("/user/img", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (status === 200 || status === 201) {
        return data as postSpeciesImageType;
      }

      return false;
    } catch (error) {
      toastConfig({
        toastType: "error",
        toastMessage: "Lỗi khi tải ảnh",
      });
      console.error("Error uploading species image:", error);
      return false;
    }
  }

  public static async addOneSpecies(speciesData: AddOneSpeciesType) {
    const { species, genus } = speciesData;

    if (!species || !genus) {
      toastConfig({
        toastType: "error",
        toastMessage: "Tên loài và giống không được để trống",
      });
      return false;
    }

    try {
      const { data, status } = await api.post("/species/add-one", speciesData);
      if (status === 200 || status === 201) {
        // return data as SpeciesData;
        return true;
      }

      return false;

      return false;
    } catch (error) {
      toastConfig({
        toastType: "error",
        toastMessage: "Lỗi khi thêm loài",
      });
      console.error("Error adding species:", error);
      return false;
    }
  }

  public static async updateSpecies() {}

  public static async deleteMultipleSpecies(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      toastConfig({
        toastType: "error",
        toastMessage: "Không có loài nào được chọn để xóa",
      });
      return false;
    }
    let pending = toastConfig({
      pending: true,
      toastMessage: `Đang xóa ${ids.length} loài`,
    });
    try {
      const { status } = await api.delete("/species/delete-multiple", {
        data: { ids },
      });
      if (status === 200 || status === 201) {
        toastConfig({
          toastType: "success",
          toastMessage: `Đã xóa ${ids.length} loài`,
        });
        store.dispatch(removeSpecies(ids));
        return true;
      }
    } catch (error) {
      toastConfig({
        toastType: "error",
        toastMessage: "Lỗi khi xóa loài",
      });
      console.error("Error deleting species:", error);
      return false;
    } finally {
      toast.dismiss(pending);
    }
  }

  public static async processExcelFile(
    file: File,
  ): Promise<Omit<Species, "id">[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Use header on row 4 (0-indexed: 3) as per user instruction.
          // The log confirms this creates keys like 'species', 'name', '__EMPTY_3', '__EMPTY_4', etc.
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 3,
            defval: "",
          });

          // Filter out header/junk rows that might have been parsed as data
          const cleanData = jsonData.filter(
            (row) => row["species"] && row["species"] !== "Tên khoa học",
          );

          const speciesMap = new Map<string, Omit<Species, "id">>();

          for (const row of cleanData) {
            const speciesName = String(row["species"]).trim();
            if (!speciesName) {
              continue;
            }

            let speciesEntry = speciesMap.get(speciesName);

            if (!speciesEntry) {
              speciesEntry = {
                species: speciesName,
                group: row["group"] || "",
                phylum: row["phylum"] || null,
                class: row["class"] || null,
                order: row["order"] || null,
                family: row["family"] || null,
                genus: row["genus"] || null,
                threatened_symbol: row["threatened_symbol"] || null,
                impact: row["impact"] || null,
                description: row["description"] || null,
                characteristic: row["characteristic"] || null,
                habitas: row["habitas"] || null,
                distribution_vietnam: row["__EMPTY_1"] || null, // From log
                distribution_world: row["__EMPTY_2"] || null, // From log
                common_names: [],
                coordinates: [],
                references: [],
                thumbnails: [],
              };
              speciesMap.set(speciesName, speciesEntry);
            }

            // Tên tiếng Việt (from 'name' column)
            const vietnameseNameRaw = row["name"];
            if (
              vietnameseNameRaw &&
              vietnameseNameRaw !== "Chưa có" &&
              vietnameseNameRaw !== "Tên Tiếng Việt"
            ) {
              const names = String(vietnameseNameRaw)
                .split(",")
                .map((name) => name.trim());
              for (const name of names) {
                if (
                  name &&
                  !speciesEntry.common_names.some((cn) => cn.name === name)
                ) {
                  speciesEntry.common_names.push({ name });
                }
              }
            }

            // Tọa độ (from '__EMPTY_4' and '__EMPTY_5' columns)
            const lat = row["__EMPTY_4"];
            const lon = row["__EMPTY_5"];
            if (
              lat != null &&
              lon != null &&
              String(lat).trim() !== "" &&
              String(lon).trim() !== ""
            ) {
              const newCoord: Coordinate = {
                latitude: String(lat).trim().replace("°", ""),
                longitude: String(lon).trim().replace("°", ""),
              };
              if (
                !speciesEntry.coordinates.some(
                  (c) =>
                    c.latitude === newCoord.latitude &&
                    c.longitude === newCoord.longitude,
                )
              ) {
                speciesEntry.coordinates.push(newCoord);
              }
            }

            // Tài liệu tham khảo (from '__EMPTY_3' column)
            const refName = row["__EMPTY_3"];
            if (refName) {
              const newRef: Reference = {
                display_name: String(refName).trim(),
                path: null,
              };
              if (
                !speciesEntry.references.some(
                  (r) => r.display_name === newRef.display_name,
                )
              ) {
                speciesEntry.references.push(newRef);
              }
            }
          }

          const result = Array.from(speciesMap.values());
          // console.log('FINAL PROCESSED DATA:', result);
          resolve(result);
        } catch (error) {
          console.error(
            "Service: CRITICAL ERROR during file processing:",
            error,
          );
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error("Service: FileReader failed.", error);
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  public static async addSpeciesData(
    speciesData: SpeciesDataForPost_type[],
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        const imageCounts: number[] = [];

        speciesData.forEach((item) => {
          formData.append("speciesInfo", JSON.stringify(item.species));
          let count = 0;
          if (item.images && item.images.length > 0) {
            item.images.forEach((imageFile) => {
              formData.append("speciesImg", imageFile);
              count++;
            });
          }
          imageCounts.push(count);
        });

        imageCounts.forEach((count) => {
          formData.append("imageCounts", String(count));
        });

        // SỬA Ở ĐÂY: Thêm cấu hình headers
        const result = await api.post("/species/add-multi-species", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        resolve(result.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
