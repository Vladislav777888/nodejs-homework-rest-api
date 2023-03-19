const Contact = require("../models/contactModel");

const listContacts = async () => {
  const contacts = await Contact.find().select("-__v");

  return contacts;
};

const getById = async (contactId) => {
  const contact = await Contact.findById(contactId);

  return contact;
};

const removeContact = async (contactId) => {
  await Contact.findByIdAndDelete(contactId);
};

const addContact = async (body) => {
  const newContact = await Contact.create(body);

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  return contact;
};

const updateStatusContact = async (contactId, body) => {
  const contact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  return contact;
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
