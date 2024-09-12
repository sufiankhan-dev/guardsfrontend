import React from 'react';

const Pagination = ({ currentPageIndex, pageOptions, handlePageChange }) => {
  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      handlePageChange(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pageOptions.length - 1) {
      handlePageChange(currentPageIndex + 1);
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="btn btn-primary mr-2"
        onClick={handlePreviousPage}
        disabled={currentPageIndex === 0}
      >
        Previous
      </button>
      <input
        type="number"
        className="form-control py-2 mr-2"
        defaultValue={currentPageIndex + 1}
        onChange={(e) => {
          const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
          handlePageChange(pageNumber);
        }}
        style={{ width: "50px" }}
      />
      <button
        className="btn btn-primary"
        onClick={handleNextPage}
        disabled={currentPageIndex === pageOptions.length - 1}
      >
        Next
      </button>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-2">
        Page <span>{currentPageIndex + 1} of {pageOptions.length}</span>
      </span>
    </div>
  );
};

export default Pagination;
