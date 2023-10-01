import React, { useEffect, useState } from 'react';
import useRestaurantForm from './useRestaurantForm';
import axios from 'axios';
import Dishes from './Dishes';
function App() {
  const { formData, handleInputChange, resetForm } = useRestaurantForm();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Inside App.js
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedRestaurant) {
        console.log("adiba2", selectedRestaurant)
        // If a restaurant is selected, update its information
        await axios.put(`http://localhost:8897/api/restaurants/${selectedRestaurant.id}`,formData);
      } else {
        // If no restaurant is selected, add a new restaurant
        const response = await axios.post('http://localhost:8897/api/restaurants',formData);

      }
      // Reset the form and fetch updated restaurant list
      resetForm();
      displayRestaurants();
    } catch (error) {
      console.error(error);
    }
  };

  const displayRestaurants = async () => {
    let endpoint = `http://localhost:8897/api/restaurants?page=${currentPage}`;

    // Append search term to the endpoint if a search term is provided
    if (searchTerm) {
      endpoint += `&search=${searchTerm}`;
    }

    try {
      const response = await axios.get(endpoint);
      setRestaurants(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.log(error);
    }
  };

  const [updateBtnTrack, setUpdateBtnTrack] = useState(false);
  const handleUpdateClick = (restaurant) => {
    // Set the selected restaurant for updating
    setUpdateBtnTrack(true);
    setSelectedRestaurant(restaurant);
    // Populate the form fields with the selected restaurant's data
    handleInputChange({
      target: { name: 'name', value: restaurant.name },
    });
  };

  const handleDeleteClick = async (restaurantId) => {
    try {
      // Send a DELETE request to remove the restaurant
      await axios.delete(`http://localhost:8897/api/restaurants/${restaurantId}`);
      // Fetch the updated restaurant list
      displayRestaurants();
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearch = () => {
    console.log(restaurants)
    setCurrentPage(1);
    displayRestaurants();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    displayRestaurants();
  };

  const [selectedRestaurantChild, setSelectedRestaurantChild] = useState('');
  const [dishesInRestaurant, setDishesInRestaurant] = useState([]);
  const handleAddDishToRestaurant = (dish)=>{
    // console.log("dish", dish)
      const { name, cuisine, description, price} = dish;
      const newDishInRestaurant = {
          name: `${selectedRestaurantChild}`,
          dishName:`${name}`,
          cuisine,
          description,
          price,
      };
    // console.log("ashif reza khannnn", newDishInRestaurant);
  setDishesInRestaurant((prevDishes) => [...prevDishes, newDishInRestaurant]);

  }

  const [productData, setProductData] = useState([]);
  const handleShowProduct = (restaurant)=>{
    const filterValue = dishesInRestaurant.filter((item)=> item.id !== restaurant.id);
    console.log("filterDishes", filterValue)
    console.log("adiba", restaurant, dishesInRestaurant);
    setProductData(filterValue);
  }

  useEffect(() => {
    displayRestaurants();
  }, [currentPage, searchTerm, formData]);

  return (
    <div>
      <h2>Search and Manage Restaurants</h2>
      <input
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <h2>Add New Restaurant</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Contact"
          name="contact"
          value={formData.contact}
          onChange={handleInputChange}
        />
        <button type="submit">{!updateBtnTrack ? "Add Restaurant" : "Update Restaurants"}</button>
      </form>
      {restaurants.map((restaurant) => {
        return (
          <li key={restaurant.id}>
            {restaurant.name} {restaurant.address} {restaurant.contact}:
            <button onClick = { () => handleUpdateClick(restaurant) }> Update </button> {' '}
            <button onClick = { () => handleDeleteClick(restaurant.id) }> Delete </button>
            <button onClick = { () => handleShowProduct(restaurant) }> Show Product </button>
            {productData && (
              <div>
                <ul>
                  {productData.map((product, index) => (
                    <li key={index}>{product.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
      {totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          ))}
        </div>
      )}
      <Dishes 
          restaurants = {restaurants} 
          selectedRestaurantChild = {selectedRestaurantChild}
          setSelectedRestaurantChild = {setSelectedRestaurantChild}
          handleAddDishToRestaurant = {handleAddDishToRestaurant}
      />
    </div>
  );
}

export default App;
