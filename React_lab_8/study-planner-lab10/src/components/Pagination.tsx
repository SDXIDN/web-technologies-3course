import './Pagination.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Сторінки">
      <button
        type="button"
        className="pagination__button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ← Назад
      </button>
      <span className="pagination__info">
        Сторінка {page} з {totalPages}
      </span>
      <button
        type="button"
        className="pagination__button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Далі →
      </button>
    </nav>
  );
}

export default Pagination;
