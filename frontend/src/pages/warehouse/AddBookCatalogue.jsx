import "./AddBookCatalogue.css";

import AddCatalogueBookModal from "../../components/warehouse/catalogue/AddCatalogueBookModal";

export default function AddBookCatalogue({
  isOpen,
  onClose,
  onCreated
}) {
  return (
    <div className="warehouse-add-book-catalogue-page">
      <AddCatalogueBookModal
        isOpen={!!isOpen}
        onClose={onClose}
        onCreated={onCreated}
      />
    </div>
  );
}

