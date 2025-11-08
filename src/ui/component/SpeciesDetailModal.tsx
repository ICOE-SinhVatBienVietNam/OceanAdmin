import React from 'react';
import { Species, SpeciesField } from '../../ui/page/Database'; // Adjust path as needed

interface SpeciesDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    species: Species | null;
    speciesFields: SpeciesField[];
}

const SpeciesDetailModal: React.FC<SpeciesDetailModalProps> = ({ isOpen, onClose, species, speciesFields }) => {
    if (!isOpen || !species) return null;

    const mainThumbnail = species.thumbnails.find(t => t.is_main);
    const thumbnailUrl = mainThumbnail && mainThumbnail.thumbnail ? mainThumbnail.thumbnail : null;

    const renderFieldValue = (field: SpeciesField, value: any) => {
        if (value === null || value === undefined || value === '') {
            return '--';
        }

        if (Array.isArray(value)) {
            if (field.isObjectArray) {
                switch (field.isObjectArray) {
                    case 'common_names':
                        return (value as { name: string | null }[]).map(cn => cn.name).filter(Boolean).join(', ');
                    case 'species_coordinates':
                        return (value as { latitude: string | null; longitude: string | null }[])
                            .map(c => `(${c.latitude || 'N/A'}, ${c.longitude || 'N/A'})`)
                            .join('; ');
                    case 'references':
                        return (
                            <>
                                {(value as { display_name: string; path: string | null }[]).map((r, idx) => (
                                    <React.Fragment key={idx}>
                                        {r.path ? (
                                            <a href={r.path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {r.display_name}
                                            </a>
                                        ) : (
                                            r.display_name
                                        )}
                                        {idx < value.length - 1 && ', '}
                                    </React.Fragment>
                                ))}
                            </>
                        );
                    default:
                        return JSON.stringify(value);
                }
            } else {
                return value.join(', ');
            }
        }

        return value.toString();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin chi tiết loài: {species.species}</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-semibold"
                >
                    &times;
                </button>

                {thumbnailUrl && (
                    <div className="mb-6 flex justify-center">
                        <img src={thumbnailUrl} alt={species.species} className="max-h-64 object-contain rounded-md shadow-md" />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {speciesFields
                        .filter(field => field.key !== 'thumbnails')
                        .map(field => (
                            <div key={field.key} className="flex flex-col">
                                <p className="text-sm font-medium text-gray-500">{field.label}:</p>
                                <p className="text-base text-gray-900 break-words">
                                    {renderFieldValue(field, species[field.key])}
                                </p>
                            </div>
                        ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpeciesDetailModal;
