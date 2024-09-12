import Icons from '@/components/ui/Icon';
import { Icon } from '@iconify/react';
import React, { useState } from 'react';

const PaginationComponent = ({ totalPages, currentPage, onPageChange, pageSize, onPageSizeChange }) => {
  const canPreviousPage = currentPage > 0;
  const canNextPage = currentPage < totalPages - 1;

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (size) => {
    onPageSizeChange(size);
  };

  const pageOptions = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="flex space-x-2 rtl:space-x-reverse items-center">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Go</span>
          <span>
            <input
              type="number"
              className="form-control py-2"
              value={currentPage + 1}
              onChange={(e) => {
                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                handlePageChange(pageNumber);
              }}
              style={{ width: '50px' }}
            />
          </span>
        </span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Page <span>{currentPage + 1} of {pageOptions.length}</span>
        </span>
      </div>
      <ul className="flex items-center space-x-3 rtl:space-x-reverse">
        <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
          <button
            className={`${!canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handlePageChange(0)}
            disabled={!canPreviousPage}
          >
            <Icons icon="heroicons:chevron-double-left-solid" />
          </button>
        </li>
        <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
          <button
            className={`${!canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canPreviousPage}
          >
            Prev
          </button>
        </li>
        {pageOptions.map((pageIdx) => (
          <li key={pageIdx}>
            <button
              aria-current="page"
              className={` ${pageIdx === currentPage
                ? 'bg-slate-900 dark:bg-slate-600 dark:text-slate-200 text-white font-medium'
                : 'bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900 font-normal'
              } text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
              onClick={() => handlePageChange(pageIdx)}
            >
              {pageIdx + 1}
            </button>
          </li>
        ))}
        <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
          <button
            className={`${!canNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canNextPage}
          >
            Next
          </button>
        </li>
        <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={!canNextPage}
            className={`${!canNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Icons icon="heroicons:chevron-double-right-solid" />
          </button>
        </li>
      </ul>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Show</span>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="form-select py-2"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default PaginationComponent;