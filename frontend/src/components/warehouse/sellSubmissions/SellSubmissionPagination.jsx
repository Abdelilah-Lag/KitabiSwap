export default function SellSubmissionPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div style={{display:'flex',gap:10,alignItems:'center',justifyContent:'center',marginTop:18}}>
      <button className="btn" onClick={() => onPageChange(page-1)} disabled={prevDisabled}>Précédent</button>
      <div style={{opacity:.8}}>Page {page} / {totalPages}</div>
      <button className="btn" onClick={() => onPageChange(page+1)} disabled={nextDisabled}>Suivant</button>
    </div>
  );
}

