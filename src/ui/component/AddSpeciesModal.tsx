import React, { useState } from 'react';
import { SpeciesService } from '../../service/SpeciesService';
import { Species, Thumbnail } from '../page/Database';

export interface AddSpeciesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (species: any[]) => void;
}

// Define an augmented species type for the modal's internal state
type ProcessedSpecies = Omit<Species, 'id'> & { imagePreviewUrl?: string };

const AddSpeciesModal: React.FC<AddSpeciesModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [processedSpecies, setProcessedSpecies] = useState<ProcessedSpecies[] | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [unmatchedImages, setUnmatchedImages] = useState<{ name: string; previewUrl: string }[]>([]);
    const [imgFolderName, setImgFolderName] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    if (!isOpen) {
        return null;
    }

    const resetState = () => {
        setProcessedSpecies(null);
        setUnmatchedImages([]);
        setShowResults(false);
        setImgFolderName(null)
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        resetState();
        const file = event.target.files?.[0];
        if (file) {
            try {
                const data = await SpeciesService.processExcelFile(file);
                setProcessedSpecies(data);
                setFileName(file.name)
            } catch (error) {
                console.error('File processing failed:', error);
            }
        }
    };

    const handleImageFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !processedSpecies) return;

        const imageFiles = Array.from(files);
        const speciesCopy = [...processedSpecies];
        const matchedImageNames = new Set<string>();

        // Match species to images
        speciesCopy.forEach(species => {
            const cleanSpeciesName = species.species.split('(')[0].trim().toLowerCase();
            const matchedImage = imageFiles.find(file => {
                const cleanImageName = file.name.split('.')[0].replace(/_/g, ' ').toLowerCase();
                return cleanImageName === cleanSpeciesName;
            });

            if (matchedImage) {
                species.imagePreviewUrl = URL.createObjectURL(matchedImage);
                const thumbnail: Thumbnail = {
                    thumbnail: species.imagePreviewUrl, // In a real scenario, this would be a permanent URL
                    is_main: true,
                };
                species.thumbnails = [thumbnail];
                matchedImageNames.add(matchedImage.name);
            }
        });

        // Find unmatched images
        const newUnmatchedImages = imageFiles
            .filter(file => !matchedImageNames.has(file.name))
            .map(file => ({ name: file.name, previewUrl: URL.createObjectURL(file) }));

        setProcessedSpecies(speciesCopy);
        setUnmatchedImages(newUnmatchedImages);
        setShowResults(true);
        setImgFolderName("Đã nhận hình ảnh")
    };

    const handleAdd = () => {
        onAdd(processedSpecies || []);
        handleClose(); // Close after adding
        console.log(processedSpecies)
        console.log(unmatchedImages)
    };

    const handleClose = () => {
        // Revoke all object URLs to prevent memory leaks
        processedSpecies?.forEach(s => {
            if (s.imagePreviewUrl) URL.revokeObjectURL(s.imagePreviewUrl);
        });
        unmatchedImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
        resetState();
        onClose();
    }

    const inputFolderProps = {
        webkitdirectory: "",
        directory: "",
    };

    const matchedSpecies = processedSpecies?.filter(s => s.imagePreviewUrl) || [];
    const unmatchedSpecies = processedSpecies?.filter(s => !s.imagePreviewUrl) || [];

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-6xl max-h-[90vh] flex flex-col">
                <div className='flex flex-col mb-6'>
                    <h2 className="text-2xl font-bold text-gray-800">Thêm nhiều loài</h2>
                    <p className='text-csMedium text-gray'>Chọn lại <b className='text-gray italic'>Thư mục ảnh</b> nếu thay đổi <b className='text-gray italic'>File dữ liệu</b></p>
                </div>

                <div className="grow overflow-y-auto pr-2">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Panel: Data File Upload */}
                        <div className="flex flex-col p-6 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">1. Tải lên file dữ liệu</h3>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-colors">
                                    {fileName ? (
                                        <div className='flex flex-col items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-15 stroke-lime">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>

                                            <p className="mb-2 text-sm text-black font-bold">Đã nhận</p>
                                            <p className="mb-2 text-sm text-gray-500 italic">{fileName}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Bấm để tải lên</span> hoặc kéo thả</p>
                                            <p className="text-xs text-gray-500">.CSV, .XLSX</p>
                                        </div>
                                    )}

                                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                                </label>
                            </div>
                        </div>

                        {/* Right Panel: Image Folder Upload */}
                        <div className={`flex flex-col p-6 border rounded-lg bg-gray-50 ${!processedSpecies ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">2. Tải lên thư mục ảnh (tùy chọn)</h3>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="image-folder-input" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg ${processedSpecies ? 'cursor-pointer bg-white hover:bg-gray-100' : ''} transition-colors`}>
                                    {imgFolderName ? (
                                        <div className='flex flex-col items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-15 stroke-lime">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>

                                            <p className="mb-2 text-sm text-gray-500 italic">{imgFolderName}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M.5 8h19M4 1.5 1 8l3 6.5M16 1.5l3 6.5-3 6.5" />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Chọn thư mục ảnh</span></p>
                                            <p className="text-xs text-gray-500">Tên ảnh phải khớp với tên khoa học</p>
                                        </div>
                                    )}

                                    <input id="image-folder-input" type="file" {...inputFolderProps} className="hidden" onChange={handleImageFolderChange} disabled={!processedSpecies} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {showResults && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Kết quả so khớp ảnh</h3>

                            {/* Matched Species */}
                            <div className="p-4 border rounded-lg bg-white mb-6">
                                <h4 className="font-semibold text-green-700 mb-3">Các loài đã khớp ảnh ({matchedSpecies.length})</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
                                    {matchedSpecies.map(s => (
                                        <div key={s.species} className="flex flex-col items-center text-center border p-2 rounded-md">
                                            <img src={s.imagePreviewUrl} alt={s.species} className="w-24 h-24 object-cover rounded-md mb-2" />
                                            <p className="text-xs font-medium text-gray-700">{s.species}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Unmatched Species */}
                                <div className="p-4 border rounded-lg bg-white">
                                    <h4 className="font-semibold text-orange-700 mb-3">{unmatchedSpecies.length == 0 ? "Không nhận được dữ liệu loài" : `Loài chưa có ảnh (${unmatchedSpecies.length})`}</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 max-h-48 overflow-y-auto">
                                        {unmatchedSpecies.map(s => <li key={s.species}>{s.species}</li>)}
                                    </ul>
                                </div>

                                {/* Unmatched Images */}
                                <div className="p-4 border rounded-lg bg-white">
                                    <h4 className="font-semibold text-red-700 mb-3">{unmatchedImages.length == 0 ? "Không có ảnh" : `Ảnh không khớp (${unmatchedImages.length})`}</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-600 max-h-48 overflow-y-auto">
                                        {unmatchedImages.map(img => <li key={img.name}>{img.name}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-between items-center gap-4 mt-8 shrink-0">
                    <div className=''>
                        <span className='flex items-center gap-2 bg-mainLightBlueRGB px-2.5 py-1.5'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 stroke-mainDarkBlue">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>

                            <p className='text-csNormal font-medium text-mainDarkBlue'>Dữ liệu vẫn có thể được thêm vào nếu thiếu hình ảnh</p>
                        </span>
                    </div>

                    <div className='flex items-center gap-2.5'>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!processedSpecies}
                            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Thêm loài
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSpeciesModal;