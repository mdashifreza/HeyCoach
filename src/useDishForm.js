import React, { useState } from 'react';

function useDishForm() {
    const [formData, setFormData] = useState({
        name: '',
        cuisine: '',
        description: '',
        price: '',
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData,  [name]: value, });
    };

    const resetForm = () => {
        setFormData({ 
            name: '',
            cuisine: '',
            description: '',
            price: ''
        });
    };

    return {
        formData,
        handleInputChange,
        resetForm,
    };
}
export default useDishForm;
