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
  const res = await fs.promises.writeFile(
    contactsPath,
    JSON.stringify(contacts),
  );
  console.log(res);
  // listContacts().then((data) => {
  //   const contacts = data.filter(({ id }) => id !== contactId);
  //   // console.log(JSON.stringify(contacts));
  //   fs.promises
  //     .writeFile(contactsPath, JSON.stringify(contacts))
  //     .then(() => console.log(contacts));
  // });
}

function addContact(name, email, phone) {
  // ...твой код
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
