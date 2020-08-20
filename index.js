const fnContacts = require('./contacts');

// fnContacts.getContactById(8).then((data) => console.log(data));

// fnContacts.removeContact(8).then((data) => console.log(data));

// fnContacts
//   .addContact('Simon Morton', 'dui.Fusce.diam@Donec.com', '(233) 738-2360')
//   .then((data) => console.log(data));

const argv = require('yargs').argv;

// TODO: рефакторить
async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      const list = await fnContacts.listContacts();
      console.table(list);
      break;

    case 'get':
      const contactById = await fnContacts.getContactById(id);
      console.log(contactById);
      break;

    case 'add':
      const listAdded = await fnContacts.addContact(name, email, phone);
      console.table(listAdded);
      break;

    case 'remove':
      const contactRemoved = await fnContacts.removeContact(id);
      console.table(contactRemoved);
      break;

    default:
      console.warn('Unknown action type!');
  }
}

invokeAction(argv);
