const contactsModels = require("../models/contacts");
const { AppError, catchAsync, contactValidator } = require("../utils");

exports.checkAddContact = catchAsync(async (req, res, next) => {
  const { error } = contactValidator(req.body);
  const { name, email, phone } = req.body;

  const keys = ["name", "email", "phone"];

  if (!name) {
    return next(new AppError(400, `missing required ${keys[0]} field`));
  }

  if (!email) {
    return next(new AppError(400, `missing required ${keys[1]} field`));
  }

  if (!phone) {
    return next(new AppError(400, `missing required ${keys[2]} field`));
  }

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  next();
});

exports.checkUpdateContact = catchAsync(async (req, res, next) => {
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

  next();
});
