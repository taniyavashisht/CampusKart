import Product from "../models/Product.js";

// @desc    Get all products with search & filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      condition,
      status,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = "available";
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === "price-low") {
      sortOption = { price: 1 };
    } else if (sort === "price-high") {
      sortOption = { price: -1 };
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 };
    } else if (sort === "popular") {
      sortOption = { views: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate("seller", "username name")
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products"
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      images
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      condition,
      location,
      images,
      seller: req.user.id
    });

    await product.populate("seller", "username name");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product"
    });
  }
};

// @desc    Toggle favorite product
// @route   POST /api/products/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const index = product.favorites.indexOf(req.user.id);

    if (index > -1) {
      product.favorites.splice(index, 1);
    } else {
      product.favorites.push(req.user.id);
    }

    await product.save();

    res.json({
      success: true,
      isFavorite: index === -1,
      message:
        index === -1
          ? "Added to favorites"
          : "Removed from favorites"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling favorite"
    });
  }
};

// @desc    Get user's favorite products
// @route   GET /api/products/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const products = await Product.find({
      favorites: req.user.id
    }).populate("seller", "username name");

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching favorites"
    });
  }
};

// ======================================================
// ✅ DELETE PRODUCT (NEW)
// @route   DELETE /api/products/:id
// @access  Private (OWNER ONLY)
// ======================================================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Only owner can delete
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product"
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "✅ Product deleted successfully"
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.error("Get single product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ======================================================
// ✅ UPDATE PRODUCT (NEW - FOR EDIT)
// @route   PUT /api/products/:id
// @access  Private (OWNER ONLY)
// ======================================================
export const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      images
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // ✅ Only product owner can edit
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this product"
      });
    }

    // ✅ Update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.condition = condition || product.condition;
    product.location = location || product.location;

    if (images && images.length > 0) {
      product.images = images;
    }

    const updated = await product.save();

    res.status(200).json({
      success: true,
      message: "✅ Product updated successfully",
      product: updated
    });

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product"
    });
  }
};
