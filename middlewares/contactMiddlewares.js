const { Types } = require("mongoose");
const { AppError, catchAsync, contactValidator } = require("../utils");
const Contact = require("../models/contactModel");

exports.checkContactId = catchAsync(async (req, res, next) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;

  const idIsValid = Types.ObjectId.isValid(contactId);

  if (!idIsValid) {
    return next(new AppError(404, "Not found"));
  }

  const contactExists = await Contact.exists({ _id: contactId, owner: userId });

  if (!contactExists) {
    return next(new AppError(404, "Not found"));
  }

  next();
});

exports.checkAddContact = catchAsync(async (req, res, next) => {
  const { error, value } = contactValidator.createContactDataValidator(
    req.body
  );
  const { _id: userId } = req.user;

  if (error) {
    return next(
      new AppError(
        400,
        error.details.map((item) => {
          return `missing required ${item.context.label} field`;
        })
      )
    );
  }

  const contactExists = await Contact.exists({
    email: value.email,
    owner: userId,
  });

  if (contactExists)
    return next(new AppError(409, "Contact with this email already exists.."));

  req.body = value;

  next();
});

exports.checkUpdateContact = catchAsync(async (req, res, next) => {
  const { error, value } = contactValidator.updateContactDataValidator(
    req.body
  );

  if (error) {
    return next(new AppError(400, error.details[0].message));
  }

  // console.log(Object.keys(value).length);

  if (Object.keys(value).length === 0) {
    return next(new AppError(400, "missing fields"));
  }

  const contactExists = await Contact.exists({ email: value.email });

  if (contactExists)
    return next(new AppError(409, "Contact with this email already exists.."));

  req.body = value;

  next();
});

exports.checkUpdateContactStatus = catchAsync(async (req, res, next) => {
  const { error, value } = contactValidator.updateContactStatusValidator(
    req.body
  );

  if (error) {
    return next(new AppError(400, "missing field favorite"));
  }

  req.body = value;

  next();
});
