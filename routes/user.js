const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const { Product } = require("../models/product");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

userRouter.put('/api/change-password', auth, async (req, res) => {
  try {
    const userId = req.user;
    const { currentPassword, newPassword } = req.body; // Assuming the request contains current and new passwords

    // Validate request parameters
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: 'Please provide current and new passwords' });
    }

    // Retrieve the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify the current password
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ msg: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


userRouter.put('/api/profile', auth, async (req, res) => {
  try {
    const userId = req.user;
    const { name, email } = req.body; // Assuming the request contains updated name and email fields

    // Validate request parameters
    if (!name || !email) {
      return res.status(400).json({ msg: 'Please provide name and email for update' });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, email } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



userRouter.get('/api/profile', auth, async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


userRouter.post("/api/add-to-cart", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Assuming you have a route like this in your application
userRouter.get("/api/get-cart", auth, async (req, res) => {
  try {
    // Fetch the user based on the authenticated user ID
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's cart
    res.json(user.cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// Increment quantity in the cart
userRouter.post("/api/increment-cart/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;
    let user = await User.findById(req.user);

    const cartItem = user.cart.find((item) => item.product._id.equals(productId));
    if (cartItem) {
      cartItem.quantity += 1;
      user = await user.save();
      res.json(user.cart);
    } else {
      res.status(404).json({ error: "Product not found in the cart" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Decrement quantity in the cart
userRouter.post("/api/decrement-cart/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;
    let user = await User.findById(req.user);

    const cartItem = user.cart.find((item) => item.product._id.equals(productId));
    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        user = await user.save();
        res.json(user.cart);
      } else {
        // Remove the item from the cart if the quantity becomes 0
        user.cart = user.cart.filter((item) => !item.product._id.equals(productId));
        user = await user.save();
        res.json(user.cart);
      }
    } else {
      res.status(404).json({ error: "Product not found in the cart" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quantity -= 1;
        }
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
userRouter.delete("/api/delete-cart-item/:productId", auth, async (req, res) => {
  try {
    const { productId } = req.params;
    let user = await User.findById(req.user);

    // Find the index of the item in the cart based on the product ID
    const itemIndex = user.cart.findIndex((item) => item.product._id.equals(productId));

    if (itemIndex !== -1) {
      // Remove the item from the cart array
      user.cart.splice(itemIndex, 1);
      user = await user.save();
      res.json(user.cart);
    } else {
      res.status(404).json({ error: "Product not found in the cart" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// save user address
userRouter.post("/api/save-user-address", auth, async (req, res) => {
  try {
    const { address } = req.body;
    let user = await User.findById(req.user);
    user.address = address;
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
userRouter.post('/api/orders', async (req, res) => {
  try {
    const { productList, address, userId } = req.body;

    // Validate if productList is present in the request body
    if (!productList || productList.length === 0) {
      return res.status(400).json({ error: 'Product list is required in the request body.' });
    }

    // Validate if userId and address are present in the request bodyfff
    if (!userId || !address) {
      return res.status(400).json({ error: 'UserId and address are required in the request body.' });
    }

    // Calculate total price based on the product list
    const totalPrice = productList.reduce((total, product) => {
      const productPrice = product.product.price;
      const productQuantity = product.quantity;
      return total + productPrice * productQuantity;
    }, 0);

    // Create an order
    const order = new Order({
      products: productList,
      totalPrice,
      address,
      userId,
      orderedAt: Date.now(),
      status: 0, // Default status
    });

    // Save the order to the database
    await order.save();

    // Empty the user's cart after placing an order
    const user = await User.findById(userId);
    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order created successfully.', order, user });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// // order product
// userRouter.post("/api/order", auth, async (req, res) => {
//   try {
//     const { cart, totalPrice, address } = req.body;
//     let products = [];

//     for (let i = 0; i < cart.length; i++) {
//       let product = await Product.findById(cart[i].product._id);
//       if (product.quantity >= cart[i].quantity) {
//         product.quantity -= cart[i].quantity;
//         products.push({ product, quantity: cart[i].quantity });
//         await product.save();
//       } else {
//         return res
//           .status(400)
//           .json({ msg: `${product.name} is out of stock!` });
//       }
//     }

//     let user = await User.findById(req.user);
//     user.cart = [];
//     user = await user.save();

//     let order = new Order({
//       products,
//       totalPrice,
//       address,
//       userId: req.user,
//       orderedAt: new Date().getTime(),
//     });
//     order = await order.save();
//     res.json(order);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

userRouter.get("/api/orders/me", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = userRouter;
