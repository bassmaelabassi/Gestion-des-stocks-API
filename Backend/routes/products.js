const express = require("express");
const Product = require("../models/Product.js");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const products = await Product.find()
      res.json(products)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  router.post("/", async (req, res) => {
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: req.body.image,
    })
  
    try {
      const newProduct = await product.save()
      res.status(201).json(newProduct)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  
  router.put("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      if (product == null) {
        return res.status(404).json({ message: "Produit non trouvé" })
      }
  
      if (req.body.title != null) {
        product.title = req.body.title
      }
      if (req.body.description != null) {
        product.description = req.body.description
      }
      if (req.body.price != null) {
        product.price = req.body.price
      }
      if (req.body.stock != null) {
        product.stock = req.body.stock
      }
      if (req.body.image != null) {
        product.image = req.body.image
      }
  
      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  })
  
  router.delete("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
      if (product == null) {
        return res.status(404).json({ message: "Produit non trouvé" })
      }
  
      await product.remove()
      res.json({ message: "Produit supprimé" })
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  })
  
  module.exports = router
  
  