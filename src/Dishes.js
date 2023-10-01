import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useDishForm from './useDishForm';

function Dishes({ restaurants, selectedRestaurant, setSelectedRestaurantChild, handleAddDishToRestaurant }) {
    console.log("restaurants", restaurants)
    const { formData, handleInputChange, resetForm } = useDishForm();
    const [dishes, setDishes] = useState([]);
    const [updateBtnTrackDishes, setUpdateBtnTrackDishes] = useState(false);
    const [selectedDishes, setSelectedDishes] = useState(null);

    const handleDishBtn = async (e) => {
        e.preventDefault();
        try {
            if (selectedDishes) {
                console.log("adiba", selectedDishes)
                await axios.put(`http://localhost:8897/api/dishes/${selectedDishes}`, formData);
            } else {
                // If no restaurant is selected, add a new restaurant
                const response = await axios.post('http://localhost:8897/api/dishes', formData);
                resetForm();
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        displayDishesList();
    }, [])

    const displayDishesList = async () => {
        try {
            const endpoint = 'http://localhost:8897/api/dishesList';
            const responce = await axios.get(endpoint);
            setDishes(responce.data.results);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleUpdateClick = (dishes) => {
        setUpdateBtnTrackDishes(true)
        setSelectedDishes(dishes.id);
        handleInputChange({
            target: { name: 'name', value: dishes.name },
        });
    }

    const handleDeleteClick = async (dishId) => {
        try {
            const endpoint = `http://localhost:8897/api/dish/${dishId}`
            const responce = await axios.delete(endpoint);
            displayDishesList();
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleAddDishToRestaurantChild = (dish)=>{
        handleAddDishToRestaurant(dish);
    }

    const handleChangeRestaurant = (e)=>{
        setSelectedRestaurantChild(e.target.value);
    }

    return (
        <div>
            <h2>Add dishes:</h2>
            <input
                type="text"
                placeholder="Dish Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
            />
            <input
                type="text"
                placeholder="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleInputChange}
            />
            <input
                type="text"
                placeholder="Dish description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
            />
            <input
                type="text"
                placeholder="Dish Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
            />
            <button type="submit" onClick={handleDishBtn}>{!updateBtnTrackDishes ? "Add Dish" : "Update Dish"}</button>

            {dishes.map((dish) => {
                return (
                    <li key={dish.id}>
                        {dish.name} {dish.cuisine} {dish.description}: {dish.price}
                        <button onClick={() => handleUpdateClick(dish)}>Update</button>{' '}
                        <button onClick={() => handleDeleteClick(dish.id)}>Delete</button>
                        <select id="cars"
                            value={selectedRestaurant}
                            onChange={handleChangeRestaurant}
                        >   
                            <option value="">Select a restaurant</option>
                            {restaurants.map((restaurant) => (
                                <option key={restaurant.id} value={restaurant.name}>
                                    {restaurant.name}
                                </option>
                            ))}
                        </select>
                        <button onClick={()=>handleAddDishToRestaurantChild(dish)}>Add</button>
                    </li>
                );
            })}

        </div>
    )
}
export default Dishes;
