import "./CatalogueCard.css";

export default function CatalogueCard({ item }) {
  return (
    <div className="warehouse-catalogue-card">
      {item?.cover?.image_url ? (
        <img className="warehouse-catalogue-card-img" src={item.cover.image_url} alt={item.title || "cover"} />
      ) : (
        <div className="warehouse-catalogue-card-img placeholder" />
      )}
      <div className="warehouse-catalogue-card-body">
        <div className="warehouse-catalogue-card-title">{item?.title}</div>
        <div className="warehouse-catalogue-card-author">{item?.author}</div>
        <div className="warehouse-catalogue-card-meta">Catégorie: {item?.category}</div>
      </div>
    </div>
  );
}

