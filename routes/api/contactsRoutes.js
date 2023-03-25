const express = require("express");
const contactsRouter = express.Router();

const { contactsController } = require("../../controllers");
const { contactMiddlewares, authMiddlewares } = require("../../middlewares");

contactsRouter.use(authMiddlewares.protectRoute);

contactsRouter
  .route("/")
  .get(contactsController.listContacts)
  .post(contactMiddlewares.checkAddContact, contactsController.addContact);

contactsRouter.use("/:id", contactMiddlewares.checkContactId);

contactsRouter
  .route("/:contactId")
  .get(contactsController.getById)
  .delete(contactsController.removeContact)
  .put(contactMiddlewares.checkUpdateContact, contactsController.updateContact);

contactsRouter
  .route("/:contactId/favorite")
  .patch(
    contactMiddlewares.checkUpdateContactStatus,
    contactsController.updateStatusContact
  );

module.exports = contactsRouter;
