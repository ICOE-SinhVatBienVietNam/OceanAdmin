type threatenedSpecies = {
    level: string,
    code: string,
    color: string
    label: string,
}

// Based on IUCN
export const threatenedSpecies:threatenedSpecies[] = [
    { level: "0", color: "bg-[#FFFFFF]", code: "NE", label: "Chưa được đánh giá"},
    { level: "1", color: "bg-[#D1D1C6]", code: "DD", label: "Thiếu dữ liệu"},
    { level: "2", color: "bg-[#60C659]", code: "LC", label: "Ít quan tâm"},
    { level: "3", color: "bg-[#CCE226]", code: "NT", label: "Sắp bị đe dọa"},
    { level: "4", color: "bg-[#F9E814]", code: "VU", label: "Sắp nguy cấp"},
    { level: "5", color: "bg-[#FC7F3F]", code: "EN", label: "Nguy cấp"},
    { level: "6", color: "bg-[#D81E05]", code: "CR", label: "Cực kỳ nguy cấp"},
    { level: "7", color: "bg-[#542344]", code: "EW", label: "Tuyệt chủng trong tự nhiên"},
    { level: "8", color: "bg-[#000000]", code: "EX", label: "Tuyệt chủng"}, 
]