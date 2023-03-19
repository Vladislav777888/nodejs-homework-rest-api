const express = require("express");
const router = express.Router();

const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers");

const {
  checkContactId,
  checkAddContact,
  checkUpdateContact,
  checkUpdateContactStatus,
} = require("../../middlewares/contactMiddlewares");

router.route("/").get(listContacts).post(checkAddContact, addContact);

router.use("/:id", checkContactId);

router
  .route("/:contactId")
  .get(getById)
  .delete(removeContact)
  .put(checkUpdateContact, updateContact);

router
  .route("/:contactId/favorite")
  .patch(checkUpdateContactStatus, updateStatusContact);

module.exports = router;
