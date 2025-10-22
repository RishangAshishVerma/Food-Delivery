import Restaurant from "../Models/Restaurant.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createrestaurant = async (req, res) => {
  try {
    const { name, state, address, city } = req.body;

    if (!name || !state || !address || !city) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required!" });
    }

    const image = await uploadOnCloudinary(req.file.path);
    if (!image) {
      return res.status(400).json({ message: "Failed to upload image to Cloudinary!" });
    }

    const restaurant = await Restaurant.create({
      name,
      state,
      address,
      city,
      image,
      owner: req.userId,
    });

    await restaurant.populate("owner");

    return res.status(201).json({
      message: "Restaurant registered successfully with our platform FoodFleetGo",
      restaurant,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return res.status(500).json({
      message: "Something went wrong while creating the restaurant",
      error: error.message,
    });
  }
};


export const editrestaurant = async (req, res) => {
  try {
    const { name, state, address, city } = req.body;


    const restaurantData = await Restaurant.findOne({ owner: req.userId });

    if (!restaurantData) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }


    let image = restaurantData.image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);

      if (!image) {
        return res.status(400).json({ message: "Failed to upload image to Cloudinary!" });
      }
    }



    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantData._id,
      {
        name: name || restaurantData.name,
        state: state || restaurantData.state,
        address: address || restaurantData.address,
        city: city || restaurantData.city,
        image,
        owner: req.userId,
      },
      { new: true }
    ).populate("owner");

    return res.status(200).json({
      message: "Restaurant details updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return res.status(500).json({
      message: "Something went wrong while updating the restaurant",
      error: error.message,
    });
  }
};

export const getmyrestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.userId }).populate("owner items")
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }
    return res.status(200).json(restaurant)
  } catch (error) {
    return res.status(500).json(`Error while getting the current restaurant: ${error}`);

  }
}