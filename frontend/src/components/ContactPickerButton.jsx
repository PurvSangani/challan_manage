import { useRef } from "react";
import { pickContactFromDiary, parseVCard } from "../utils/contactPicker";

const ContactPickerButton = ({
  onSelectContact,
  className = "btn btn-outline-primary btn-sm",
  buttonText = "Pick from Contacts",
}) => {
  const fileInputRef = useRef(null);

  const isNativeSupported =
    typeof navigator !== "undefined" &&
    "contacts" in navigator &&
    "ContactsManager" in window;

  const handleClick = async () => {
    if (isNativeSupported) {
      try {
        const contact = await pickContactFromDiary();
        if (contact) {
          onSelectContact(contact);
          return;
        }
      } catch (err) {
        console.error("Failed to pick contact natively:", err);
      }
    } else {
      const isMobileDevice =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      let message =
        "Direct Contact Diary access opens your phone contact book when viewed on a mobile device (Android Chrome / Edge).\n\n";

      if (isMobileDevice && !window.isSecureContext) {
        message +=
          "Note: Mobile Chrome requires HTTPS or localhost to access phone contacts.\n\nWould you like to select a contact (.vcf) file instead?";
      } else {
        message +=
          "Since you are currently on Desktop, would you like to select a contact (.vcf) file from your computer?";
      }

      const choice = window.confirm(message);
      if (choice && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const parsed = parseVCard(content);
      if (parsed.name || parsed.whatsapp) {
        onSelectContact(parsed);
      } else {
        alert("Could not extract contact details from this VCF file.");
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleClick}
        title="Select contact directly from your Phone Contact Diary to avoid typing errors"
      >
        <i className="bi bi-journal-bookmark-fill me-1 text-success"></i>
        {buttonText}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".vcf,.vcard"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ContactPickerButton;
