const express = require("express");
const router = express.Router();

const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require("../../controllers");

const {
  checkAddContact,
  checkUpdateContact,
} = require("../../middlewares/contactMiddlewares");

router.route("/").get(listContacts).post(checkAddContact, addContact);

router
  .route("/:contactId")
  .get(getById)
  .delete(removeContact)
  .put(checkUpdateContact, updateContact);

module.exports = router;
