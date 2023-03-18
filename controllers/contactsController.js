const contactsModels = require("../models/contacts");

const { catchAsync } = require("../utils");

exports.listContacts = catchAsync(async (req, res, next) => {
  const contacts = await contactsModels.listContacts();

  res.status(200).json(contacts);
});

exports.getById = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await contactsModels.getById(contactId);

  res.status(200).json(contact);
});

exports.addContact = catchAsync(async (req, res, next) => {
  const newContact = await contactsModels.addContact(req.body);

  res.status(201).json(newContact);
});

exports.removeContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;

  await contactsModels.removeContact(contactId);

  res.status(200).json({ message: "contact deleted" });
});

exports.updateContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await contactsModels.updateContact(contactId, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  });

  res.status(200).json(contact);
});

exports.updateStatusContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  const contact = await contactsModels.updateStatusContact(contactId, {
    favorite,
  });

  res.status(200).json(contact);
});
