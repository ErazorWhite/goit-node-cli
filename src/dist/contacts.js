import * as fs from "fs/promises";
import * as path from "path";
import { nanoid } from "nanoid";
import colors from "colors";
const contactsPath = path.resolve("src", "db", "contacts.json");
export const listContacts = async () => {
    try {
        const readResult = await fs.readFile(contactsPath, { encoding: "utf-8" });
        return JSON.parse(readResult);
    }
    catch (error) {
        console.error(colors.red("Error:"), error.message);
        return null;
    }
};
export const getContactById = async (contactId) => {
    try {
        const contacts = await listContacts();
        const requiredContact = contacts?.find((contact) => contact.id === contactId);
        return requiredContact || null;
    }
    catch (error) {
        console.error(colors.red("Error:"), error.message);
        return null;
    }
};
export const removeContact = async (contactId) => {
    try {
        const contacts = await listContacts();
        if (!contacts)
            return null;
        const index = contacts?.findIndex((contact) => contact.id === contactId) || -1;
        if (index === -1)
            return null;
        const [removedContact] = contacts.splice(index, 1);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return removedContact;
    }
    catch (error) {
        console.error(colors.red("Error:"), error.message);
        return null;
    }
};
export const addContact = async ({ name, email, phone }) => {
    if (!name ||
        !email ||
        !phone ||
        !validateEmail(email) ||
        !validatePhoneInput(phone))
        return null;
    try {
        const contacts = await listContacts();
        if (!contacts)
            return null;
        const newContact = {
            id: nanoid(),
            name,
            email,
            phone,
        };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    }
    catch (error) {
        console.error(colors.red("Error:"), error.message);
        return null;
    }
};
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validatePhoneInput(input) {
    return (/^(\(\d{3}\)\s?\d{3}-\d{4})$/.test(input.trim()) || // Matches (XXX) XXX-XXXX
        /^\d{3}-\d{2}-\d{2}$/.test(input.trim()) // Matches XXX-XX-XX
    );
}
//# sourceMappingURL=contacts.js.map