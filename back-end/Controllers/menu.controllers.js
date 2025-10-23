import uploadOnCloudinary from "../utils/cloudinary.js";
import Restaurant from "../Models/Restaurant.model.js";
import Menu from "../Models/Menu.model.js";

export const createMenu = async (req, res) => {
  try {
    const { name, category, price, type } = req.body;

    const restaurantData = await Restaurant.findOne({ owner: req.userId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } }
    });

    if (!restaurantData) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }


    const image = await uploadOnCloudinary(req.file.path);
    if (!image) {
      return res.status(400).json({ message: "Failed to upload image to Cloudinary!" });
    }


    const menu = await Menu.create({
      name,
      restaurant: restaurantData._id,
      category,
      price,
      type,
      image,
    });
    restaurantData.items.push(menu._id);
    await restaurantData.save();

    await menu.populate(" owner").populate({
      path: "items",
      populate: { path: "restaurant" },
      options: { sort: { updatedAt: -1 } }
    });


    return res.status(201).json({
      message: "Menu item created successfully ",
      menu,
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    return res.status(500).json({
      message: `"Something went wrong while creating the menu"${error}`
    });
  }
}

export const updateMenu = async (req, res) => {
  try {
    const { name, category, price, type } = req.body;

    const restaurantData = await Restaurant.findOne({ owner: req.userId });
    if (!restaurantData) {
      return res.status(404).json({ message: "Restaurant not found!" });
    }

    const menuId = req.params.id;
    const existingMenu = await Menu.findOne({ _id: menuId, restaurant: restaurantData._id });
    if (!existingMenu) {
      return res.status(404).json({ message: "Menu item not found!" });
    }

    if (existingMenu.isdeleted) {
      return res.status(400).json({ message: "Cannot update a deleted menu item" });
    }

    let image = existingMenu.image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
      if (!image) {
        return res.status(400).json({ message: "Failed to upload image to Cloudinary!" });
      }
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
    ).populate({
      path: "items",
      populate: { path: "restaurant" },
      options: { sort: { updatedAt: -1 } }
    });


    return res.status(200).json({
      message: "Menu item updated successfully",
      menu: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    return res.status(500).json({
      message: `"Something went wrong while updating the menu": ${error.message}`
    });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const menuItemId = req.params.id;

    if (!menuItemId) {
      return res.status(404).json({ message: "Menu not found" });
    }
    const item = await Menu.findById(menuItemId);

    if (!item) {
      return res.status(404).json({ message: "Menu item not found!" });
    }

    if (item.isdeleted) {
      return res.status(400).json({ message: "This menu item has been deleted" });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;

    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    menu.isdeleted = true;
    await menu.save();

    return res.status(200).json({ message: "Menu deleted successfully", menu });
  } catch (error) {
    return res.status(500).json({ message: `Error deleting menu: ${error}` });
  }
};

export const getItemByCity = async (req, res) => {
  try {
    const { city } = req.params
    if (!city) {
      return res.status(400).json({ message: "city is required" })
    }

    const restaurant = await Restaurant.find({
      city: { $regex: new RegExp(`^${city}$`, "i") }
    }).populate('items')

    if (!restaurant) {
      return res.status(400).json({ message: "no resturant is required" })
    }

    const restaurantIds = restaurant.map((restaurant) => restaurant._id)

    const menu = await Menu.find({ restaurant: { $in: restaurantIds } })
    return res.status(200).json(menu)

  } catch (error) {
    return res.status(500).json({ message: `get item by city error: ${error}` });

  }
}