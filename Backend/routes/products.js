const express = require("express");
const multer = require("multer");
const Product = require("../models/Product.js");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "images/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-';
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/", upload.single('image'), async (req, res) => {
    try {
        if (!req.body.title || !req.body.price || !req.body.description || req.body.stock == null) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const product = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            stock: req.body.stock,
            image: req.file ? `images/${req.file.filename}` : "",
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des produits" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression", details: error.message });
    }
});

router.put("/:id", upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, stock } = req.body;
        let image = req.body.image;

        if (req.file) {
            image = `images/${req.file.filename}`;
        }

        if (!title || !description || price == null || stock == null) {
            return res.status(400).json({ error: "Tous les champs sont requis pour la mise à jour." });
        }

        const productUpdated = await Product.findByIdAndUpdate(
            req.params.id,
            { image, title, description, price, stock },
            { new: true }
        );

        if (!productUpdated) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }

        res.json({ message: "Produit mis à jour avec succès", produit: productUpdated });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la mise à jour", details: error.message });
    }
});

module.exports = router;
