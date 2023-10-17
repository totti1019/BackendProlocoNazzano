const express = require("express");

const {
  getAllUser,
  insertUser,
  getUserByID,
  deleteUser,
  updateUser,
} = require("../controllers/users");

const router = express.Router();

router.get("/", getAllUser);
router.post("/", insertUser);
router.get("/:id", getUserByID);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

module.exports = router;
