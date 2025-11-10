import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddOneSpeciesModal from '../component/AddOneSpeciesModal';
import AddSpeciesModal from '../component/AddSpeciesModal';
import SpeciesDetailModal from '../component/SpeciesDetailModal';
import { RootState } from '../../redux/store';
import { setNewSpecies } from '../../redux/reducer/speciesReducer';
import { ProcessedSpecies } from '../component/AddSpeciesModal';

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

// --- Placeholder Data (for initial load) --- //
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
    const dispatch = useDispatch();
    const speciesData = useSelector((state: RootState) => state.speciesReducer.NewSpecies);

    // Augment data from Redux with an ID (using index as a temporary, unstable ID)
    const allSpecies: Species[] = useMemo(() => {
        // Ensure speciesData is an array before mapping
        if (!Array.isArray(speciesData)) {
            return [];
        }
        return speciesData.map((s, index) => ({ ...s, id: index }));
    }, [speciesData]);


    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isAddMultipleOpen, setIsAddMultipleOpen] = useState<boolean>(false);
    const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
    const [selectedSpeciesIds, setSelectedSpeciesIds] = useState<(string | number)[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState<keyof Species | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

    // Load initial data into Redux store
    useEffect(() => {
        // We only set the initial data if the store is empty or not an array
        if (!Array.isArray(speciesData) || speciesData.length === 0) {
            const dataToLoad = initialSpeciesData.map(({ id, ...rest }) => rest); // Strip ID to match ProcessedSpecies
            dispatch(setNewSpecies({ data: dataToLoad as ProcessedSpecies[] }));
        }
    }, [dispatch, speciesData]);


    const handleDeleteSelected = () => {
        // TODO: Implement deletion when a proper delete action is available in the reducer.
        // This will require species in Redux to have stable IDs.
        // For now, this function will clear selection.
        setIsDeleteMode(false);
        setSelectedSpeciesIds([]);
    };

    const filteredAndSortedSpecies = useMemo(() => {
        let filtered = allSpecies.filter(s => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                s.species.toLowerCase().includes(searchTermLower) ||
                (s.common_names && s.common_names.some(cn => cn.name?.toLowerCase().includes(searchTermLower))) ||
                s.group.toLowerCase().includes(searchTermLower) ||
                s.description?.toLowerCase().includes(searchTermLower)
            );
        });

        if (sortColumn) {
            filtered.sort((a, b) => {
                const aValue = a[sortColumn as keyof Species];
                const bValue = b[sortColumn as keyof Species];

                if (aValue == null || bValue == null) return 0;

                const comparison = String(aValue).localeCompare(String(bValue), 'vi', { numeric: true });
                return sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        return filtered;
    }, [allSpecies, searchTerm, sortColumn, sortDirection]);


    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSpecies = filteredAndSortedSpecies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAndSortedSpecies.length / itemsPerPage);


    const handleSort = (column: keyof Species) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1); // Reset to first page on sort
    };

    const handleSelectSpecies = (id: string | number) => {
        setSelectedSpeciesIds(prev =>
            prev.includes(id) ? prev.filter(speciesId => speciesId !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedSpeciesIds(currentSpecies.map(s => s.id));
        } else {
            setSelectedSpeciesIds([]);
        }
    };

    const handleRowClick = (species: Species) => {
        if (!isDeleteMode) {
            setSelectedSpecies(species);
            setIsDetailModalOpen(true);
        }
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(Math.max(1, Math.min(totalPages, pageNumber)));
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
                            disabled={selectedSpeciesIds.length === 0}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Xóa đã chọn ({selectedSpeciesIds.length})
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsDeleteMode(prev => !prev);
                            setSelectedSpeciesIds([]); // Clear selections when toggling delete mode
                        }}
                        className={`${isDeleteMode ? 'bg-yellow-400 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'} font-bold py-2 px-4 rounded-lg shadow-md transition duration-300`}
                    >
                        {isDeleteMode ? 'Hủy xóa' : 'Chọn để xóa'}
                    </button>

                    {!isDeleteMode && (
                        <>
                            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                                + Thêm loài mới
                            </button>
                            <button onClick={() => setIsAddMultipleOpen(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
                                + Thêm nhiều loài
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-hidden bg-white rounded-lg shadow-md">
                {/* Phân trang */}
                <div className='flex items-center justify-between p-2.5'>
                    <div className=''>
                        <span className='flex items-center gap-1.5'>
                            <p className='text-csNormal'>Tìm thấy <b className='text-mainRed'>{filteredAndSortedSpecies.length}</b> loài</p>
                        </span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <span className='text-csNormal'>
                            Trang {currentPage}/{totalPages > 0 ? totalPages : 1}
                        </span>

                        <span className='flex items-center gap-1'>
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='px-3 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Trước
                            </button>
                            <input
                                type="number"
                                value={currentPage}
                                onChange={(e) => goToPage(Number(e.target.value))}
                                className='h-[30px] w-[50px] border-[0.5px] border-lightGray text-csNormal px-2.5 text-center'
                                min="1"
                                max={totalPages}
                            />
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
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
                                            checked={selectedSpeciesIds.length > 0 && selectedSpeciesIds.length === currentSpecies.length}
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
                                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
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
                                                onClick={(e) => e.stopPropagation()} // Prevent row click
                                            />
                                        </td>
                                    )}

                                    {speciesFields.map((field, index) => {
                                        const value = s[field.key as keyof typeof s];
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
                                                                'Không có hình ảnh'
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
                                            cellContent = (value as React.ReactNode) ?? '--';
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
            />
            <AddSpeciesModal
                isOpen={isAddMultipleOpen}
                onClose={() => setIsAddMultipleOpen(false)}
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