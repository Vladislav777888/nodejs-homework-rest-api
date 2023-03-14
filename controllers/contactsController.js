const contactsModels = require("../models/contacts");

const { AppError, catchAsync, contactValidator } = require("../utils");

exports.listContacts = catchAsync(async (req, res, next) => {
  const contacts = await contactsModels.listContacts();

  res.status(200).json([...contacts]);
});

exports.getById = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await contactsModels.getById(contactId);

  if (!contact) {
    return next(new AppError(404, "Not found"));
  }

  res.status(200).json(contact);
});

exports.addContact = catchAsync(async (req, res, next) => {
  const { error, value } = contactValidator(req.body);

  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return next(new AppError(400, "missing required name field"));
  }

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  const contact = await contactsModels.addContact(value);

  res.status(201).json(contact);
});

exports.removeContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;

  const deleteContact = await contactsModels.removeContact(contactId);

  if (!deleteContact) {
    return next(new AppError(404, "Not found"));
  }

  res.status(200).json({ message: "contact deleted" });
});

exports.updateContact = catchAsync(async (req, res, next) => {
  const { error, value } = contactValidator(req.body);
  const { name, email, phone } = req.body;
  const { contactId } = req.params;

  if (!name || !email || !phone) {
    return next(new AppError(400, "missing fields"));
  }

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  const contact = await contactsModels.updateContact(contactId, value);

  if (!contact) {
    return next(new AppError(404, "Not found"));
  }

  res.status(200).json(contact);
});
