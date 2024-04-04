export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
};
export type NewContact = Omit<Contact, "id">;
export type ListContacts = () => Promise<Contact[] | null>;
export type ContactIdOperation = (contactId: string) => Promise<Contact | null>;
export type AddContact = (contactData: NewContact) => Promise<Contact | null>;
