import * as fs from "fs/promises";
import * as path from "path";
import { nanoid } from "nanoid";
import colors from "colors";

const contactsPath: string = path.resolve("src", "db", "contacts.json");

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export async function listContacts(): Promise<Contact[] | null> {
  try {
    const readResult = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(readResult);
  } catch (error) {
    console.log(colors.red("Error:"), error.message);
    return null;
  }
}

export async function getContactById(
  contactId: string
): Promise<Contact | null> {
  try {
    const contacts = await listContacts();
    const requiredContact = contacts?.find(
      (contact) => contact.id === contactId
    );
    if (!requiredContact) {
      console.log(colors.red("There is no such contact, check provided ID"));
      return null;
    }
    return requiredContact;
  } catch (error) {
    console.log(colors.red("Error:"), error.message);
    return null;
  }
}

export async function removeContact(
  contactId: string
): Promise<Contact | null> {
  try {
    const contacts = await listContacts();
    if (!contacts) {
      console.log(colors.red("There are no contacts!"));
      return null;
    }
    const index =
      contacts?.findIndex((contact) => contact.id === contactId) || -1;
    if (index === -1) {
      console.log(colors.red("There is no such contact, check provided ID"));
      return null;
    }
    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(colors.green("File successfully saved."));
    return removedContact;
  } catch (error) {
    console.log(colors.red("Error:"), error.message);
    return null;
  }
}

export async function addContact(
  name: string,
  email: string,
  phone: string
): Promise<Contact | null> {
  if (!name || !email || !phone) {
    console.log(colors.red("All fields (name, email, phone) are required."));
    return null;
  }
  if (!validateEmail(email)) {
    console.log(
      colors.red(`Provided email: ${email} is wrong. Please try again.`)
    );
    return null;
  }

  console.log(`Validating phone number: ${phone}`);
  const isValidPhone = validatePhoneInput(phone);
  console.log(`Phone validation result for ${phone}: ${isValidPhone}`);
  if (!isValidPhone) {
    console.log(
      colors.red(`Provided phone number: ${phone} is wrong. Please try again.`)
    );
    return null;
  }

  try {
    const contacts = (await listContacts()) || [];
    const newContact: Contact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log(colors.green("File successfully saved."));
    return newContact;
  } catch (error) {
    console.log(colors.red("Error:"), error.message);
    return null;
  }
}

function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePhoneInput(input: string): boolean {
  return (
    /^(\(\d{3}\)\s?\d{3}-\d{4})$/.test(input.trim()) || // Matches (XXX) XXX-XXXX
    /^\d{3}-\d{2}-\d{2}$/.test(input.trim()) // Matches XXX-XX-XX
  );
}