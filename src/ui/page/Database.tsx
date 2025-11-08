import React, { useState, useEffect, useMemo } from 'react';
import AddOneSpeciesModal from '../component/AddOneSpeciesModal';
import AddSpeciesModal from '../component/AddSpeciesModal';
import SpeciesDetailModal from '../component/SpeciesDetailModal';

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
    onAdd: (newSpecies: Omit<Species, 'id'>) => void;
}

export interface SpeciesField {
    key: keyof Omit<Species, 'id'>;
    label: string;
    required?: boolean;
    isArray?: boolean;
    isObjectArray?: 'common_names' | 'species_coordinates' | 'references' | 'thumbnails';
    isTextArea?: boolean;
    width?: string;
    sortable?: boolean;
}

// --- Placeholder Data --- //
const initialSpeciesData: Species[] = [
    {
        id: '34abdd09-02af-4fe8-83b1-b525c3658de1',
        group: 'San hô cứng',
        phylum: 'Cnidaria',
        class: 'Anthozoa',
        order: 'Scleractinia',
        family: 'Acroporidae',
        genus: 'Isopora',
        species: 'Isopora palifera (Lamarck, 1816)',
        threatened_symbol: 'EN',
        impact: null,
        description: 'Tập đoàn dạng tấm phủ với gờ dày nhô thẳng, không có xương polyp trục.',
        characteristic: 'Xương polyp tròn, nhô ra; vùng xương ngoài phủ gai dày kết nối, đỉnh hơi dẹt. Màu kem nhạt hoặc nâu.',
        habitas: 'Rạn viền, sườn dốc rạn, đầm phá; độ sâu 1–35 m.',
        distribution_vietnam: 'Từ mũi Đà Nẵng đến Vịnh Thái Lan.',
        distribution_world: 'Phân bố rộng ở vùng biển nhiệt đới Ấn Độ – Thái Bình Dương.',
        species_coordinates: [
            { latitude: '10.5', longitude: '107.5' },
            { latitude: '9.8', longitude: '106.9' }
        ],
        common_names: [
            { name: 'San hô lỗ đỉnh' }
        ],
        references: [
            { display_name: 'Cơ sở dữ liệu sinh vật biển thế giới (WoRMS)', path: 'https://marinespecies.org/aphia.php?p=taxdetails&id=730686' }
        ],
        thumbnails: [
            { thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Great_White_Shark.jpg/250px-Great_White_Shark.jpg', is_main: true }
        ]
    }
];

// --- Fields Configuration --- //
export const speciesFields: SpeciesField[] = [
    { key: 'species', label: 'Tên khoa học', required: true, width: 'w-64' },
    { key: 'common_names', label: 'Tên tiếng Việt', width: 'w-48', isObjectArray: 'common_names' },
    { key: 'group', label: 'Nhóm', width: 'w-32', sortable: true },
    { key: 'phylum', label: 'Ngành', width: 'w-32', sortable: true },
    { key: 'class', label: 'Lớp', width: 'w-32', sortable: true },
    { key: 'order', label: 'Bộ', width: 'w-32', sortable: true },
    { key: 'family', label: 'Họ', width: 'w-32', sortable: true },
    { key: 'genus', label: 'Giống', width: 'w-32', sortable: true },
    { key: 'threatened_symbol', label: 'Ký hiệu', width: 'w-24', sortable: true },
    { key: 'description', label: 'Mô tả', width: 'w-72', isTextArea: true },
    { key: 'characteristic', label: 'Đặc điểm', width: 'w-72', isTextArea: true },
    { key: 'habitas', label: 'Nơi sống', width: 'w-64' },
    { key: 'distribution_vietnam', label: 'Phân bố Việt Nam', width: 'w-64' },
    { key: 'distribution_world', label: 'Phân bố thế giới', width: 'w-64' },
    { key: 'species_coordinates', label: 'Tọa độ', width: 'w-64', isObjectArray: 'species_coordinates' },
    { key: 'references', label: 'Tài liệu tham khảo', width: 'w-72', isObjectArray: 'references' },
    { key: 'thumbnails', label: 'Ảnh', width: 'w-48', isObjectArray: 'thumbnails' },
];


// --- Main Component --- //
const Database: React.FC = () => {
    const [speciesList, setSpeciesList] = useState<Species[]>(initialSpeciesData);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMultipleOpen, setIsAddMultipleOpen] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedSpeciesIds, setSelectedSpeciesIds] = useState<(string | number)[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState<keyof Species | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

    const handleAddSpecies = (newSpeciesData: Omit<Species, 'id'>) => {
        const newEntry: Species = {
            id: Date.now().toString(),
            ...newSpeciesData,
        };
        setSpeciesList(prev => [newEntry, ...prev]);
    };

    const handleAddMultipleSpecies = (newSpecies: Omit<Species, 'id'>[]) => {
        const newEntries: Species[] = newSpecies.map(s => ({
            id: Date.now() + Math.random(), // Ensure unique IDs
            ...s,
        }));
        setSpeciesList(prev => [...newEntries, ...prev]);
    };

    const handleDeleteSelected = () => {
        if (selectedSpeciesIds.length === 0) {
            alert('Vui lòng chọn ít nhất một loài để xóa.');
            return;
        }
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedSpeciesIds.length} loài đã chọn không?`)) {
            setSpeciesList(prev => prev.filter(s => !selectedSpeciesIds.includes(s.id)));
            setSelectedSpeciesIds([]);
            setIsDeleteMode(false);
        }
    };

    // Clean up any object URLs when the main component unmounts or speciesList changes
    useEffect(() => {
        setSelectedSpeciesIds([]);
        setIsDeleteMode(false);
    }, [speciesList]);

    const filteredSpecies = speciesList.filter(s =>
        s.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.common_names.some(cn => cn.name && cn.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.characteristic && s.characteristic.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortedSpecies = useMemo(() => {
        if (!sortColumn) return filteredSpecies;

        return [...filteredSpecies].sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            // Fallback for other types or nulls, treat as equal for simplicity
            return 0;
        });
    }, [filteredSpecies, sortColumn, sortDirection]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSpecies = sortedSpecies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedSpecies.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setSelectedSpeciesIds([]); // Clear selection on page change
        }
    };

    const goToPreviousPage = () => {
        handlePageChange(currentPage - 1);
    };

    const goToNextPage = () => {
        handlePageChange(currentPage + 1);
    };

    const handleSort = (column: keyof Species) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1); // Reset to first page on sort
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedSpeciesIds(currentSpecies.map(species => species.id));
        } else {
            setSelectedSpeciesIds([]);
        }
    };

    const handleSelectSpecies = (id: string | number) => {
        setSelectedSpeciesIds(prev =>
            prev.includes(id) ? prev.filter(speciesId => speciesId !== id) : [...prev, id]
        );
    };

    const handleRowClick = (species: Species) => {
        if (!isDeleteMode) {
            setSelectedSpecies(species);
            setIsDetailModalOpen(true);
        }
    };

    return (
        <div className="p-8 bg-gray-50 h-full flex flex-col">
            {/* Header & Actions */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="w-1/3">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên khoa học, tên tiếng việt, nhóm, mô tả..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 items-center">
                    {isDeleteMode && (
                        <button
                            onClick={handleDeleteSelected}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Xóa đã chọn ({selectedSpeciesIds.length})
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsDeleteMode(prev => !prev);
                            setSelectedSpeciesIds([]); // Clear selections when toggling delete mode
                        }}
                        className={`${isDeleteMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'} font-bold py-2 px-4 rounded-lg shadow-md transition duration-300`}
                    >
                        {isDeleteMode ? 'Hủy xóa' : 'Chọn để xóa'}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                        + Thêm loài mới
                    </button>
                    <button onClick={() => setIsAddMultipleOpen(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                        + Thêm nhiều loài
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-md">
                {/* Phân trang */}
                <div className='flex items-center justify-between p-2.5'>
                    <div className=''>
                        <span className='flex items-center gap-1.5'>
                            <p className='text-csNormal'>Tìm thấy <b className='text-mainRed'>{filteredSpecies.length}</b> loài</p>
                        </span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <span className='text-csNormal'>
                            Trang {currentPage} / {totalPages}
                        </span>

                        <span className='flex items-center gap-1'>
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className='px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Trước
                            </button>
                            <input
                                type="number"
                                value={currentPage}
                                onChange={(e) => handlePageChange(Number(e.target.value))}
                                className='h-[30px] w-[50px] border-[0.5px] border-lightGray text-csNormal px-2.5 text-center'
                                min="1"
                                max={totalPages}
                            />
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className='px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
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
                                            onChange={handleSelectAll}
                                            checked={
                                                selectedSpeciesIds.length === currentSpecies.length &&
                                                currentSpecies.length > 0
                                            }
                                        />
                                    </th>
                                )}

                                {speciesFields.map((field, index) => (
                                    <th
                                        key={field.key}
                                        scope="col"
                                        className={`sticky top-0 bg-gray-100 z-20 p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 ${field.width || ''} ${index === 0 ? 'sticky left-0 z-30 shadow-md' : ''
                                            } ${field.sortable ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                                        onClick={field.sortable ? () => handleSort(field.key as keyof Species) : undefined}
                                    >
                                        <div className="flex items-center">
                                            {field.label}
                                            {sortColumn === field.key && (
                                                <span className="ml-1">
                                                    {sortDirection === 'asc' ? '▲' : '▼'}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {currentSpecies.map((s) => (
                                <tr
                                    key={s.id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                    onClick={isDeleteMode ? () => handleSelectSpecies(s.id) : () => handleRowClick(s)}
                                >
                                    {isDeleteMode && (
                                        <td className="p-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200 w-16">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                                                checked={selectedSpeciesIds.includes(s.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectSpecies(s.id);
                                                }}
                                            />
                                        </td>
                                    )}

                                    {speciesFields.map((field, index) => {
                                        const value = s[field.key];
                                        let cellContent: React.ReactNode;

                                        if (Array.isArray(value)) {
                                            if (field.isObjectArray) {
                                                switch (field.isObjectArray) {
                                                    case 'thumbnails':
                                                        const mainThumb = (value as Thumbnail[]).find(
                                                            (t) => t.is_main
                                                        );
                                                        cellContent =
                                                            mainThumb && mainThumb.thumbnail ? (
                                                                <img
                                                                    src={mainThumb.thumbnail}
                                                                    alt={s.species}
                                                                    className="w-16 h-10 object-cover rounded-md"
                                                                />
                                                            ) : (
                                                                'No image'
                                                            );
                                                        break;
                                                    case 'common_names':
                                                        cellContent = (value as CommonName[])
                                                            .map((cn) => cn.name)
                                                            .filter(Boolean)
                                                            .join(', ');
                                                        break;
                                                    case 'species_coordinates':
                                                        cellContent = (value as Coordinate[])
                                                            .map(
                                                                (c) =>
                                                                    `(${c.latitude || 'N/A'}, ${c.longitude || 'N/A'})`
                                                            )
                                                            .join('; ');
                                                        break;
                                                    case 'references':
                                                        cellContent = (value as Reference[])
                                                            .map((r) => r.display_name)
                                                            .join(', ');
                                                        break;
                                                    default:
                                                        cellContent = '[Unhandled Array]';
                                                }
                                            } else {
                                                cellContent = value.join(', ');
                                            }
                                        } else {
                                            cellContent = value ?? '--';
                                        }

                                        return (
                                            <td
                                                key={field.key}
                                                className={`p-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-200 ${field.width || ''
                                                    } ${index === 0
                                                        ? 'sticky left-0 bg-white z-10 shadow-sm'
                                                        : ''
                                                    }`}
                                            >
                                                {cellContent}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            <AddOneSpeciesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddSpecies}
            />
            <AddSpeciesModal
                isOpen={isAddMultipleOpen}
                onClose={() => setIsAddMultipleOpen(false)}
                onAdd={handleAddMultipleSpecies}
            />
            <SpeciesDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                species={selectedSpecies}
                speciesFields={speciesFields}
            />
        </div>
    );
};

export default Database;
