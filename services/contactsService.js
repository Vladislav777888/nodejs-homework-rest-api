const Contact = require("../models/contactModel");

exports.listContacts = async (userId, { skip = 0, limit = 20, favorite }) => {
  const contacts = await Contact.find({
    owner: userId,
    favorite: favorite || { $in: [true, false] },
  })
    .select({ __v: 0 })
    .skip(skip)
    .limit(limit);

  return contacts;
};

exports.getById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, owner: userId });

  return contact;
};

exports.removeContact = async (contactId, userId) => {
  await Contact.findOneAndDelete({ _id: contactId, owner: userId });
};

exports.addContact = async (body, userId) => {
  const newContact = await Contact.create({ ...body, owner: userId });

  return newContact;
};

exports.updateContact = async (contactId, body, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    body,
    {
      new: true,
    }
  );

  return contact;
};

exports.updateStatusContact = async (contactId, body, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    body,
    {
      new: true,
    }
  );

  return contact;
};
