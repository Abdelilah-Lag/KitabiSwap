import "./InventoryBookSearchResult.css";

export default function InventoryBookSearchResult({
    results = [],
    onSelect,
    onAdd
}) {
    if (!Array.isArray(results) || results.length === 0) {
        return (
            <div className="inventory-book-search-results">
                <div className="inventory-book-search-empty">
                    Aucun livre trouvé. Utilisez la barre de recherche ci-dessus
                    pour trouver un livre du catalogue.
                </div>
            </div>
        );
    }

    return (
        <div className="inventory-book-search-results">
            {results.map((book) => {
                // Backend `searchCatalogue` returns { cover: { image_url } }.
                // We also fall back to book_images[0].image_url for
                // safety in case another endpoint feeds this component.
                const cover =
                    book?.cover?.image_url ||
                    (Array.isArray(book?.book_images) && book.book_images[0]?.image_url) ||
                    null;

                return (
                    <div
                        key={book.id}
                        className="inventory-book-search-card"
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelect?.(book)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onSelect?.(book);
                            }
                        }}
                    >
                        <div className="inventory-book-search-cover">
                            {cover ? (
                                <img src={cover} alt={book.title} />
                            ) : (
                                <span>📚</span>
                            )}
                        </div>

                        <div className="inventory-book-search-meta">
                            <div className="inventory-book-search-title">
                                {book.title}
                            </div>
                            <div className="inventory-book-search-author">
                                {book.author}
                            </div>
                            <div className="inventory-book-search-isbn">
                                {book.isbn || "Aucun ISBN"}
                            </div>
                            <div className="inventory-book-search-category">
                                {book.category || "-"}
                            </div>
                        </div>

                        <div className="inventory-book-search-actions">
                            <button
                                type="button"
                                className="inventory-book-search-add"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAdd?.(book);
                                }}
                            >
                                Ajouter au stock
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
