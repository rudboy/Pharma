const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(body_parser.json());

mongoose.connect(
  "mongodb://localhost/pharma-app",
  { useNewUrlParser: true }
);

app.get("/", (req, res) => {
  res.json("welcome");
});

const Product = mongoose.model("Product", {
  name: {
    type: String,
    default: ""
  },
  quantity: {
    type: Number
  }
});

const creation = async (id, name, quantity) => {
  const newProduct = new Product({
    name: name,
    quantity: quantity
  });
  let toto = await newProduct.save();
  return toto;
};
const verification_name = async (req, res) => {
  try {
    const exist = await Product.findOne({ name: req.body.name });

    return exist;
  } catch (error) {
    res.status(400).json({ error: error.message });
    return exist;
  }
};

const verification_id = async (req, res) => {
  try {
    let _id = req.body.id;
    //console.log(_id);

    const exist = await Product.findById(_id);
    return true;
  } catch (error) {
    res.status(400).json("Drug already exists");
    return false;
  }
};

app.post("/create", async (req, res) => {
  try {
    //let result = creation(req.body.id, req.body.name, req.body.quantity);
    let resl = await verification_name(req, res);
    //console.log("resultat fonction", resl);
    if (resl !== null) {
      res.json("Drug already exists");
    } else if (resl === null) {
      const newProduct = new Product({
        name: req.body.name,
        quantity: req.body.quantity
      });
      let toto = await newProduct.save();
      if (toto) {
        res.json(toto);
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/voir", async (req, res) => {
  try {
    const allProduct = await Product.find();
    res.json(allProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/drugs/add", async (req, res) => {
  try {
    let resl = await verification_id(req, res);
    if (resl === true) {
      let _id = req.body.id;
      let quantity = req.body.quantity;
      const product_find = await Product.findById(_id);

      product_find.quantity = Number(product_find.quantity) + quantity;
      let toto = await product_find.save();

      res.json({ id: toto.id, quantity: toto.quantity });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post("/drugs/remove", async (req, res) => {
  try {
    let resl = await verification_id(req, res);
    if (resl === true) {
      let _id = req.body.id;
      let quantity = req.body.quantity;
      const product_find = await Product.findById(_id);
      if (product_find.quantity > quantity) {
        product_find.quantity = Number(product_find.quantity) - quantity;
        let toto = await product_find.save();

        res.json({ id: toto.id, quantity: toto.quantity });
      } else {
        res.json("Invalid quantity");
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server has started");
});
