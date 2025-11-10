import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { speciesFields, Species } from "../page/Database";
import { RootState } from "../../redux/store";
import { setNewSpecies } from "../../redux/reducer/speciesReducer";
import { ProcessedSpecies } from "./AddSpeciesModal";

export interface AddOneSpeciesModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onAdd is removed as the component will dispatch to Redux directly
}

const initialFormState: Partial<Omit<Species, 'id'>> = {
    species: '',
    group: '',
    common_names: [{ name: null }],
    species_coordinates: [{ latitude: null, longitude: null }],
    references: [{ display_name: '', path: null }],
    thumbnails: [],
    phylum: null,
    class: null,
    order: null,
    family: null,
    genus: null,
    threatened_symbol: null,
    impact: null,
    description: null,
    characteristic: null,
    habitas: null,
    distribution_vietnam: null,
    distribution_world: null,
};

const AddOneSpeciesModal: React.FC<AddOneSpeciesModalProps> = ({ isOpen, onClose }) => {
    const [newSpecies, setNewSpecies] = useState<Partial<Omit<Species, 'id'>>>(initialFormState);
    const dispatch = useDispatch();
    const currentSpeciesList = useSelector((state: RootState) => state.speciesReducer.NewSpecies);

    useEffect(() => {
        if (!isOpen) {
            newSpecies.thumbnails?.forEach(thumb => {
                if (thumb.thumbnail && thumb.thumbnail.startsWith('blob:')) {
                    URL.revokeObjectURL(thumb.thumbnail);
                }
            });
            setNewSpecies(initialFormState);
        }
    }, [isOpen, newSpecies.thumbnails]);

    const handleInputChange = (key: keyof Omit<Species, 'id'>, value: string) => {
        setNewSpecies(prev => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newImageUrl = URL.createObjectURL(file);

            newSpecies.thumbnails?.forEach(thumb => {
                if (thumb.thumbnail && thumb.thumbnail.startsWith('blob:')) {
                    URL.revokeObjectURL(thumb.thumbnail);
                }
            });
            
            setNewSpecies(prev => ({ ...prev, thumbnails: [{ thumbnail: newImageUrl, is_main: true }] }));
        }
    };

    const handleObjectArrayChange = (key: 'common_names' | 'species_coordinates' | 'references', index: number, subKey: string, value: string) => {
        const list = (newSpecies[key] as any[]) || [];
        const newList = [...list];
        newList[index] = { ...newList[index], [subKey]: value };
        setNewSpecies(prev => ({ ...prev, [key]: newList }));
    };
    
    const addObjectArrayItem = (key: 'common_names' | 'species_coordinates' | 'references') => {
        const list = (newSpecies[key] as any[]) || [];
        let newItem;
        switch (key) {
            case 'common_names': newItem = { name: null }; break;
            case 'species_coordinates': newItem = { latitude: null, longitude: null }; break;
            case 'references': newItem = { display_name: '', path: null }; break;
            default: return;
        }
        setNewSpecies(prev => ({...prev, [key]: [...list, newItem]}));
    };

    const removeObjectArrayItem = (key: 'common_names' | 'species_coordinates' | 'references', index: number) => {
        const list = (newSpecies[key] as any[]) || [];
        if (list.length > 1) {
            setNewSpecies(prev => ({...prev, [key]: list.filter((_, i) => i !== index)}));
        }
    };

    const handleSubmit = () => {
        if (!newSpecies.species) {
            alert('Tên khoa học (species) là trường bắt buộc.');
            return;
        }

        const payload: Omit<Species, 'id'> = {
            species: newSpecies.species,
            group: newSpecies.group || '',
            phylum: newSpecies.phylum || null,
            class: newSpecies.class || null,
            order: newSpecies.order || null,
            family: newSpecies.family || null,
            genus: newSpecies.genus || null,
            threatened_symbol: newSpecies.threatened_symbol || null,
            impact: newSpecies.impact || null,
            description: newSpecies.description || null,
            characteristic: newSpecies.characteristic || null,
            habitas: newSpecies.habitas || null,
            distribution_vietnam: newSpecies.distribution_vietnam || null,
            distribution_world: newSpecies.distribution_world || null,
            species_coordinates: newSpecies.species_coordinates?.filter(c => c.latitude || c.longitude) || [],
            common_names: newSpecies.common_names?.filter(c => c.name) || [],
            references: newSpecies.references?.filter(r => r.display_name) || [],
            thumbnails: newSpecies.thumbnails || [],
        };

        const currentData = Array.isArray(currentSpeciesList) ? currentSpeciesList : [];
        const newData = [payload as ProcessedSpecies, ...currentData];
        // dispatch();
        // Thêm loài mới

        onClose();
    };

    if (!isOpen) return null;

    const renderField = (field: typeof speciesFields[0]) => {
        if (field.isObjectArray) {
            switch (field.isObjectArray) {
                case 'thumbnails':
                    const mainThumb = newSpecies.thumbnails?.find(t => t.is_main);
                    return (
                        <div>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                            {mainThumb && mainThumb.thumbnail && <div className="mt-4"><img src={mainThumb.thumbnail} alt="Xem trước" className="h-32 w-auto rounded-lg object-cover" /></div>}
                        </div>
                    );
                case 'common_names':
                    return (
                        <div className="space-y-2">
                           {(newSpecies.common_names || [{ name: null }]).map((cn, index) => (
                               <div key={index} className="flex items-center gap-2">
                                   <input type="text" placeholder="Tên tiếng Việt" value={cn.name || ''} onChange={(e) => handleObjectArrayChange('common_names', index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                   { (newSpecies.common_names?.length || 0) > 1 && <button type="button" onClick={() => removeObjectArrayItem('common_names', index)} className="text-red-500">Xóa</button>}
                               </div>
                           ))}
                           <button type="button" onClick={() => addObjectArrayItem('common_names')} className="text-sm font-medium text-blue-600">+ Thêm tên</button>
                        </div>
                    );
                case 'species_coordinates':
                     return (
                        <div className="space-y-2">
                            {(newSpecies.species_coordinates || [{ latitude: null, longitude: null }]).map((coord, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" placeholder="Latitude" value={coord.latitude || ''} onChange={(e) => handleObjectArrayChange('species_coordinates', index, 'latitude', e.target.value)} className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"/>
                                    <input type="text" placeholder="Longitude" value={coord.longitude || ''} onChange={(e) => handleObjectArrayChange('species_coordinates', index, 'longitude', e.target.value)} className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"/>
                                    {(newSpecies.species_coordinates?.length || 0) > 1 && <button type="button" onClick={() => removeObjectArrayItem('species_coordinates', index)} className="text-red-500">Xóa</button>}
                                </div>
                            ))}
                            <button type="button" onClick={() => addObjectArrayItem('species_coordinates')} className="text-sm font-medium text-blue-600">+ Thêm tọa độ</button>
                        </div>
                    );
                case 'references':
                    return (
                        <div className="space-y-2">
                            {(newSpecies.references || [{display_name: '', path: null}]).map((ref, index) => (
                                <div key={index} className="flex flex-col gap-2 p-2 border rounded-md">
                                    <input type="text" placeholder="Tên tài liệu" value={ref.display_name || ''} onChange={(e) => handleObjectArrayChange('references', index, 'display_name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                                    <input type="text" placeholder="Đường dẫn" value={ref.path || ''} onChange={(e) => handleObjectArrayChange('references', index, 'path', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                                    {(newSpecies.references?.length || 0) > 1 && <button type="button" onClick={() => removeObjectArrayItem('references', index)} className="text-red-500 self-end">Xóa</button>}
                                </div>
                            ))}
                            <button type="button" onClick={() => addObjectArrayItem('references')} className="text-sm font-medium text-blue-600">+ Thêm tài liệu</button>
                        </div>
                    );
                default:
                    return <p>Unsupported field</p>;
            }
        } else if (field.isTextArea) {
            return <textarea value={(newSpecies[field.key] as string) || ''} onChange={(e) => handleInputChange(field.key, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]" required={field.required} />
        } else {
            return <input type="text" value={(newSpecies[field.key] as string) || ''} onChange={(e) => handleInputChange(field.key, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required={field.required}/>
        }
    };


    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex justify-end items-center z-50">
            <div className="h-full bg-white rounded-lg shadow-xl px-10 w-full max-w-4xl overflow-y-auto">
                <div className="sticky top-0 left-0 bg-white pt-10 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Thêm loài mới</h2>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
                    {speciesFields.map(field => (
                        <div key={field.key} className={field.isObjectArray || field.isTextArea ? 'md:col-span-2' : ''}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {renderField(field)}
                        </div>
                    ))}
                </form>

                <div className="flex justify-end gap-4 mt-6 sticky bottom-0 bg-white py-4 border-t">
                    <button type="button" onClick={onClose} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition">Hủy</button>
                    <button type="button" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition">Thêm loài</button>
                </div>
            </div>
        </div>
    );
};

export default AddOneSpeciesModal;