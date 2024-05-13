"use client"
import EllipsisMenu from "@/components/Pagination/EllipsisMenu"
import PaginationItem from "@/components/Pagination/PaginationItem"
import { useState } from "react"

type PaginationProps = {
  totalPages: number
  currentPage: number
  perPage: number
}

const Pagination = ({ totalPages, currentPage, perPage }: PaginationProps) => {
  const smallNumRange = Array.from({ length: totalPages + 1 }).map((_, index) => index + 1).slice(2, currentPage - 1 - 1);
  const largeNumRange = Array.from({ length: totalPages + 1 }).map((_, index) => index + 1).slice(currentPage + 1, totalPages - 1);
  const handleClick = () => {
    console.log(smallNumRange)
  }
  return (
    <ul className="flex items-center gap-2">
      {/* {Array.from({ length: totalPages + 1 }).map((_, index) => (
        <li key={index}>
          <PaginationItem currentPage={currentPage} pageNumber={index + 1} handleClick={handleClick} />
        </li>
      ))} */}
      <li>
        <PaginationItem currentPage={currentPage} handleClick={handleClick} >
          <svg
            className="-scale-x-90"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </PaginationItem>
      </li>
      <li>
        <PaginationItem pageNumber={1} currentPage={currentPage} handleClick={handleClick} >1</PaginationItem>
      </li>
      {currentPage >= 4 &&
        <li className="relative group mx-6">
          <button type="button">
            <span>...</span>
          </button>
          <EllipsisMenu range={smallNumRange} />
        </li>
      }
      {currentPage >= 3 && (
        <li>
          <PaginationItem pageNumber={currentPage - 1} currentPage={currentPage} handleClick={handleClick}>{currentPage - 1}</PaginationItem>
        </li>
      )}
      {currentPage !== 1 && currentPage !== totalPages && (
        <li>
          <PaginationItem pageNumber={currentPage} currentPage={currentPage} handleClick={handleClick}>{currentPage}</PaginationItem>
        </li>
      )}
      {currentPage < totalPages && currentPage + 1 !== totalPages && (
        <li>
          <PaginationItem pageNumber={currentPage + 1} currentPage={currentPage} handleClick={handleClick}>{currentPage + 1}</PaginationItem>
        </li>
      )}
      {currentPage <= totalPages - 3 &&
        <li className="relative group mx-6">
          <button type="button">
            <span>...</span>
          </button>
          <EllipsisMenu range={largeNumRange} />
        </li>
      }
      <li>
        <PaginationItem pageNumber={totalPages} currentPage={currentPage} handleClick={handleClick} >{totalPages}</PaginationItem>
      </li>
      <li>
        <PaginationItem currentPage={currentPage} handleClick={handleClick} >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </PaginationItem>
      </li>
    </ul>
  )
}
export default Pagination