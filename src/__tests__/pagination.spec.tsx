import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Pagination from '@/components/Pagination';


describe("Pagination", () => {
  test("should render the Pagination component", () => {
    const expected = 4;
    const currentPage = 1;
    const totalCount = 10;
    render(<Pagination currentPage={currentPage} totalCount={totalCount} />);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  });
  test("should render the Pagination component with currentPage 2", () => {
    const expected = 5;
    const currentPage = 2;
    const totalCount = 10;
    render(<Pagination currentPage={currentPage} totalCount={totalCount} />);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  })
  test("should render the Pagination component with currentPage 3", () => {
    const expected = 4;
    const currentPage = 3;
    const totalCount = 10;
    render(<Pagination currentPage={currentPage} totalCount={totalCount} />);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  })
  test("should render the Pagination component with totalCount less than 4", () => {
    const expected = 1;
    const currentPage = 1;
    const totalCount = 3;
    render(<Pagination currentPage={currentPage} totalCount={totalCount} />);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  })
  test("should render the Pagination component with totalCount 25", () => {
    const expected = 5;
    const currentPage = 1;
    const totalCount = 25;
    render(<Pagination currentPage={currentPage} totalCount={totalCount} />);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  })
});