/**
 * Clean phone number to extract digits suitable for WhatsApp/phone fields.
 * E.g., "+91 98765 43210" -> "9876543210" (or 10-12 digits string)
 */
export const cleanPhoneNumber = (rawPhone) => {
  if (!rawPhone) return "";
  // Keep digits only
  let digits = rawPhone.replace(/\D/g, "");
  // If starts with 91 and has 12 digits, extract 10 digits
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  // If starts with 0 and has 11 digits, extract 10 digits
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
};

/**
 * Pick contact from mobile device Contact Diary using Web Contacts API.
 * Returns { name: string, whatsapp: string } or null if cancelled/failed.
 */
export const pickContactFromDiary = async () => {
  if ("contacts" in navigator && "ContactsManager" in window) {
    try {
      const props = ["name", "tel"];
      const options = { multiple: false };
      const contacts = await navigator.contacts.select(props, options);

      if (contacts && contacts.length > 0) {
        const contact = contacts[0];
        const rawName =
          contact.name && contact.name[0]
            ? contact.name[0]
            : "";
        const rawTel =
          contact.tel && contact.tel[0]
            ? contact.tel[0]
            : "";

        return {
          name: rawName.trim(),
          whatsapp: cleanPhoneNumber(rawTel),
        };
      }
    } catch (err) {
      if (err.name !== "SecurityError" && err.name !== "AbortError") {
        console.warn("Contact picker error:", err);
      }
    }
  }
  return null;
};

/**
 * Parse a VCF (vCard) text content to extract Full Name (FN) and Phone Number (TEL).
 */
export const parseVCard = (vcardText) => {
  let name = "";
  let tel = "";

  const lines = vcardText.split(/\r\n|\r|\n/);
  for (const line of lines) {
    if (line.startsWith("FN:") || line.startsWith("FN;")) {
      name = line.substring(line.indexOf(":") + 1).trim();
    } else if (!name && (line.startsWith("N:") || line.startsWith("N;"))) {
      const parts = line.substring(line.indexOf(":") + 1).split(";");
      name = parts.filter(Boolean).reverse().join(" ").trim();
    }
    if (line.startsWith("TEL:") || line.startsWith("TEL;")) {
      tel = line.substring(line.indexOf(":") + 1).trim();
    }
  }

  return {
    name,
    whatsapp: cleanPhoneNumber(tel),
  };
};
