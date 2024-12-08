import React from "react";

const Paginationn = ({
  pageIndex = 0, // Default value
  pageSize = 10, // Default value
  pageCount = 0, // Default value
  onPageChange = () => {}, // Default to no-op function
  onPageSizeChange = () => {}, // Default to no-op function
}) => {
  // Prevent accessing length of undefined
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  if (!pageCount || pageCount < 1) {
    return null; // If no pages, do not render the component
  }

  return (
    <div className="pagination">
      <button
        disabled={pageIndex === 0}
        onClick={() => onPageChange(pageIndex - 1)}
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={pageIndex + 1 === page ? "active" : ""}
          onClick={() => onPageChange(page - 1)}
        >
          {page}
        </button>
      ))}

      <button
        disabled={pageIndex + 1 === pageCount}
        onClick={() => onPageChange(pageIndex + 1)}
      >
        Next
      </button>

      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        {[10, 20, 50, 100].map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </select>
    </div>
  );
};

export default Paginationn;
