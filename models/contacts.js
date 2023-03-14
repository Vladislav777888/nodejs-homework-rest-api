const fs = require("fs").promises;
const path = require("path");
const uuid = require("uuid").v4;

const dataPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    const contacts = JSON.parse(data);

    return contacts;
  } catch (error) {
    console.log(error);
  }
};

const getById = async (contactId) => {
  try {
    const contacts = await listContacts();

    const [contact] = contacts.filter((el) => el.id === contactId);

    return contact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();

    const deleteContact = contacts.find((el) => el.id === contactId);

    const fiteredContacts = contacts.filter((el) => el.id !== contactId);
    await fs.writeFile(dataPath, JSON.stringify(fiteredContacts));

    return deleteContact;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
  try {
    const contacts = await listContacts();

    const newContact = {
      id: uuid(),
      ...body,
    };

    contacts.push(newContact);
    await fs.writeFile(dataPath, JSON.stringify(contacts));

    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const { name, email, phone } = body;

    const contacts = await listContacts();

    const idxUpdatedContact = contacts.findIndex((el) => el.id === contactId);

    if (idxUpdatedContact !== -1) {
      contacts[idxUpdatedContact].name = name;
      contacts[idxUpdatedContact].email = email;
      contacts[idxUpdatedContact].phone = phone;

      await fs.writeFile(dataPath, JSON.stringify(contacts));

      console.log(contacts[idxUpdatedContact]);
      return contacts[idxUpdatedContact];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
