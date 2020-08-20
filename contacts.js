const fs = require('fs');
const path = require('path');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  const data = await fs.promises.readFile(contactsPath, 'utf-8');
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const data = await listContacts();
  return data.find(({ id }) => id === contactId);
}

async function removeContact(contactId) {
  const data = await listContacts();
  const contacts = data.filter(({ id }) => id !== contactId);
  await fs.promises.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts;
  // return listContacts().then((data) => {
  //   const contacts = data.filter(({ id }) => id !== contactId);
  //   return fs.promises
  //     .writeFile(contactsPath, JSON.stringify(contacts))
  //     .then(() => contacts);
  // });
}

async function addContact(name, email, phone) {
  const data = await listContacts();
  const maxId =
    data.reduce((maxCurrent, { id }) => Math.max(maxCurrent, id), 0) + 1;
  const contacts = [...data, { id: maxId, name, email, phone }];
  await fs.promises.writeFile(contactsPath, JSON.stringify(contacts));
  return contacts;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
