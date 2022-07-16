const router = require("express").Router();
const res = require("express/lib/response");
const list = require("../models/list");
const verify = require("../verifyToken");

//create
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new list(req.body);
    try {
      const savedList = await newList.save();
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

//delete
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await list.findByIdAndDelete(req.params.id);
      res.status(201).json("The list has benn delte");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed");
  }
});

//get
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genreQuery;
  let list = [];
  //why makeing lis as an arrary?
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await list.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      } else {
        list = await list.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
        ]);
      }
    } else {
      list = await list.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
