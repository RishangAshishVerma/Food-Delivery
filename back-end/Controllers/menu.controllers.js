import uploadOnCloudinary from "../utils/cloudinary.js";
import Restaurant from "../Models/Restaurant.model.js";
import Menu from "../Models/Menu.model.js";

export const createmenu = async (req, res) => {
  try {
    const { name, category, price, type } = req.body;

    const restaurantData = await Restaurant.findOne({ owner: req.userId });
    if (!restaurantData) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

   
    let image 
    if (req.file) {
      image = await uploadOnCloudinary(req.file);
    }

   
    const menu = await Menu.create({
      name,
      restaurant: restaurantData._id,
      category,
      price,
      type,
      image,
    });

   ty
    await menu.populate("restaurant");

    return res.status(201).json({
      message: "Menu item created successfully ",
      menu,
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    return res.status(500).json({
      message: `"Something went wrong while creating the menu"${error}` });
  }
}

export const updatemenu = async (req, res) => {
  try {
    const { name, category, price, type } = req.body;

    // const restaurantData = await Restaurant.findOne({ owner: req.userId });
    // if (!restaurantData) {
    //   return res.status(404).json({ message: "Restaurant not found!" });
    // }

    const menuId = req.params.menuId;
    const existingMenu = await Menu.findOne({ _id: menuId, restaurant: restaurantData._id });

    if (!existingMenu) {
      return res.status(404).json({ message: "Menu item not found!" });
    }

   
    let image = existingMenu.image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file);
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      {
        name: name || existingMenu.name,
        category: category || existingMenu.category,
        price: price || existingMenu.price,
        type: type || existingMenu.type,
        image,
      },
      { new: true }
    ).populate("restaurant");

    return res.status(200).json({
      message: "Menu item updated successfully ",
      menu: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    return res.status(500).json({
      message: `"Something went wrong while updating the menu"${error}` });
  }
};
