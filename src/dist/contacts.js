import * as fs from "fs/promises";
import * as path from "path";
import { nanoid } from "nanoid";
import colors from "colors";
const contactsPath = path.resolve("src", "db", "contacts.json");
export async function listContacts() {
    try {
        const readResult = await fs.readFile(contactsPath, { encoding: "utf-8" });
        return JSON.parse(readResult);
    }
    catch (error) {
        console.log(colors.red("Error:"), error.message);
        return null;
    }
}
export async function getContactById(contactId) {
    try {
        const contacts = await listContacts();
        const requiredContact = contacts?.find((contact) => contact.id === contactId);
        if (!requiredContact) {
            console.log(colors.red("There is no such contact, check provided ID"));
            return null;
        }
        return requiredContact;
    }
    catch (error) {
        console.log(colors.red("Error:"), error.message);
        return null;
    }
}
export async function removeContact(contactId) {
    try {
        const contacts = await listContacts();
        if (!contacts) {
            console.log(colors.red("There are no contacts!"));
            return null;
        }
        const index = contacts?.findIndex((contact) => contact.id === contactId) || -1;
        if (index === -1) {
            console.log(colors.red("There is no such contact, check provided ID"));
            return null;
        }
        const [removedContact] = contacts.splice(index, 1);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        console.log(colors.green("File successfully saved."));
        return removedContact;
    }
    catch (error) {
        console.log(colors.red("Error:"), error.message);
        return null;
    }
}
export async function addContact(name, email, phone) {
    if (!name || !email || !phone) {
        console.log(colors.red("All fields (name, email, phone) are required."));
        return null;
    }
    if (!validateEmail(email)) {
        console.log(colors.red(`Provided email: ${email} is wrong. Please try again.`));
        return null;
    }
    console.log(`Validating phone number: ${phone}`);
    const isValidPhone = validatePhoneInput(phone);
    console.log(`Phone validation result for ${phone}: ${isValidPhone}`);
    if (!isValidPhone) {
        console.log(colors.red(`Provided phone number: ${phone} is wrong. Please try again.`));
        return null;
    }
    try {
        const contacts = (await listContacts()) || [];
        const newContact = {
            id: nanoid(),
            name,
            email,
            phone,
        };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        console.log(colors.green("File successfully saved."));
        return newContact;
    }
    catch (error) {
        console.log(colors.red("Error:"), error.message);
        return null;
    }
}
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validatePhoneInput(input) {
    return (/^(\(\d{3}\)\s?\d{3}-\d{4})$/.test(input.trim()) || // Matches (XXX) XXX-XXXX
        /^\d{3}-\d{2}-\d{2}$/.test(input.trim()) // Matches XXX-XX-XX
    );
}
// node ./src/dist/index.js -a list
// node ./src/dist/index.js -a get -i 05olLMgyVQdWRwgKfg5J6
// node ./src/dist/index.js -a add -n Mango -e mango@gmail.com -p 322-22-22
// node ./src/dist/index.js -a remove -i qdggE76Jtbfd9eWJHrssH
//# sourceMappingURL=contacts.js.map