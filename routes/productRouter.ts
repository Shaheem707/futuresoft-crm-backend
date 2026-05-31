import { Router } from "express";
import productController from "../controllers/productController.js";
import { authenticate } from "../middleware/auth.js";

const productRoutes = Router();

productRoutes.get("/", authenticate, productController.getProducts);
productRoutes.get("/:id", authenticate, productController.getProductById);
productRoutes.post("/", authenticate, productController.createProduct);
productRoutes.put("/:id", authenticate, productController.updateProduct);
productRoutes.delete("/:id", authenticate, productController.deleteProduct);

export default productRoutes;