const express = require("express");
const router = express.Router();

const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require("../../controllers");

router.route("/").get(listContacts).post(addContact);

router
  .route("/:contactId")
  .get(getById)
  .delete(removeContact)
  .put(updateContact);

module.exports = router;
