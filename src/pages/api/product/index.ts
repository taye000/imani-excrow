import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/db";
import Product from "@/models/product";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "POST") {
    const session = await getSession(req, res);

    if (!session || typeof session !== "object" || !("user" in session)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = session.user;
    try {
      const productData = req.body;
      console.log("req.body", req.body);

      if (
        !productData.productName ||
        !productData.price ||
        !productData.paymentMethod ||
        !productData.description ||
        !productData.currency ||
        !productData.transactionType ||
        !productData.category
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const payload = {
        userId: user.sub,
        ...productData,
      };

      try {
        await connectToDatabase();
        console.log("Connected to db");

        const newProduct = await Product.create(payload);
        console.log("Product saved to database:", newProduct);
        return res
          .status(201)
          .json({ message: "Product added successfully", data: newProduct });
      } catch (error) {
        console.error("Error saving product:", error);
        return res.status(500).json({ message: "Failed to add product" }); // 500 Internal Server Error
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ message: "Error adding product" });
    }
  } else if (req.method === "GET") {
    try {
      await connectToDatabase();
      console.log("Connected to db");

      const products = await Product.find({});
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
  } else {
    return res.status(405).end();
  }
}
