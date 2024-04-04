import { program } from "commander";
import {
  addContact,
  removeContact,
  listContacts,
  getContactById,
} from "./contacts.js";
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse();

const options = program.opts();

interface ActionWithContact {
  action: string;
  id: string;
  name: string;
  email: string;
  phone: string;
}

async function invokeAction({
  action,
  id,
  name,
  email,
  phone,
}: ActionWithContact) {
  try {
    let result;
    switch (action) {
      case "list":
        result = await listContacts();
        break;

      case "get":
        result = await getContactById(id);
        break;

      case "add":
        result = await addContact({name, email, phone});
        break;

      case "remove":
        result = await removeContact(id);
        break;

      default:
        console.warn("\x1B[31m Unknown action type!");
        return;
    }
    console.log(result);
  } catch (error) {
    console.error("\x1B[31m Error:", error.message);
  }
}

if (!options.action) {
  console.error(
    "\x1B[31m Error: Action is required. Use -a or --action to specify the action."
  );
  program.help(); // Shows help and completes the execution
}

invokeAction(options as ActionWithContact);
