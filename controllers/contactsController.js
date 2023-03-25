const { contactsService } = require("../services");

const { catchAsync } = require("../utils");

exports.listContacts = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  let { page, limit, favorite } = req.query;

  page = +page;
  limit = +limit;

  limit = limit > 20 ? 20 : limit;

  const skip = (page - 1) * limit;

  const contacts = await contactsService.listContacts(userId, {
    skip,
    limit,
    favorite,
  });

  res.status(200).json(contacts);
});

exports.getById = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await contactsService.getById(contactId, userId);

  res.status(200).json(contact);
});

exports.addContact = catchAsync(async (req, res, next) => {
  const { _id: userId } = req.user;
  const newContact = await contactsService.addContact(req.body, userId);

  res.status(201).json(newContact);
});

exports.removeContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  await contactsService.removeContact(contactId, userId);

  res.status(200).json({ message: "contact deleted" });
});

exports.updateContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const contact = await contactsService.updateContact(
    contactId,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    userId
  );

  res.status(200).json(contact);
});

exports.updateStatusContact = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id: userId } = req.user;

  const contact = await contactsService.updateStatusContact(
    contactId,
    {
      favorite,
    },
    userId
  );

  res.status(200).json(contact);
});
