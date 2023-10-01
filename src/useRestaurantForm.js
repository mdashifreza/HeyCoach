import { useState } from 'react';

const useRestaurantForm = () => {
    const [formData, setFormData] = useState({ name: '', address: '', contact: '' });
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData,  [name]: value, });
    };

    const resetForm = () => {
        setFormData({ name: '', address: '', contact: ''});
    };

    return {
        formData,
        handleInputChange,
        resetForm,
    };
};

export default useRestaurantForm;
