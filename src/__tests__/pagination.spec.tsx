import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { PER_PAGE } from '@/static/blogs';

import Pagination from '@/components/Pagination';


describe("Pagination", () => {
  const renderPagination = (currentPage: number, totalCount: number) => {
    render(<Pagination currentPage={currentPage} totalCount={totalCount} />);
  }

  const calcArrowNavCount = (currentPage: number, totalCount?: number) => {
    const lastPage = totalCount ? Math.ceil(totalCount / PER_PAGE) : null
    if (lastPage === 1) return 0;
    // 終端もしくは始点の矢印ナビゲーションのみ
    if (currentPage === 1 || currentPage === lastPage) return 1;
    return 2;
  }

  const calcExpected = (currentPage: number, totalCount: number) => {
    return Math.ceil(totalCount / PER_PAGE) + calcArrowNavCount(currentPage, totalCount)
  }

  test("should render the Pagination component", () => {
    const totalCount = 10;
    const currentPage = 1;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  });
  test("should render the Pagination component with currentPage 2", () => {
    const totalCount = 10;
    const currentPage = 2;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  })
  test("should render the Pagination component with currentPage 3", () => {
    const totalCount = 10;
    const currentPage = 3;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  })
  test("should render the Pagination component with totalCount less than 4", () => {
    const totalCount = 3;
    const currentPage = 1;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    expect(navItems.length).toBe(expected);
  })
  test('should render the Pagination component with totalCount 1あ', async () => {
    const totalCount = 16;
    const currentPage = 1;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    const readerText = await screen.queryByText("...");
    expect(navItems.length).toBe(expected);
    expect(readerText).toBeTruthy()
  });
  test('should render the Pagination component with totalCount 18', async () => {
    const totalCount = 18;
    const currentPage = 1;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    const readerText = await screen.queryByText("...");
    expect(navItems.length).toBe(expected);
    expect(readerText).toBeTruthy()
  });
  test('should render the Pagination component with totalCount 18 and currentPage 3', async () => {
    const totalCount = 18;
    const currentPage = 3;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    const readerText = await screen.queryByText("...");
    expect(navItems.length).toBe(expected);
    expect(readerText).toBeFalsy();
  });
  test('should render the Pagination component with totalCount 18 and currentPage 4', async () => {
    const totalCount = 18;
    const currentPage = 4;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    const readerText = await screen.queryByText("...");
    expect(navItems.length).toBe(expected);
    expect(readerText).toBeTruthy()
  });
  test('should render the Pagination component with totalCount 18', async () => {
    const totalCount = 18;
    const currentPage = 1;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    const readerText = await screen.queryByText("...");
    expect(navItems.length).toBe(expected);
    expect(readerText).toBeTruthy()
  });
  test('should render the Pagination component with totalCount 25 and currentPage 4', async () => {
    const totalCount = 25;
    const currentPage = 4;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    const readerText = await screen.queryAllByText("...");
    expect(navItems.length).toBe(expected);
    expect(readerText.length).toBe(2);
  });
  test('should render the Pagination component with totalCount 25 and currentPage 5', async () => {
    const totalCount = 25;
    const currentPage = 5;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    const readerText = await screen.queryAllByText("...");
    expect(navItems.length).toBe(expected);
    expect(readerText.length).toBe(1);
  });
  test('check the numbers in menu', async () => {
    const totalCount = 59;
    const currentPage = 8;
    const expected = calcExpected(currentPage, totalCount);

    renderPagination(currentPage, totalCount);
    const navItems = screen.getAllByRole("navigation");
    const readerText = await screen.queryAllByText("...");
    expect(navItems.length).toBe(expected);
    expect(readerText.length).toBe(2);

    const menus = screen.getAllByRole('menu');
    const menu1Buttons = within(menus[0]).getAllByRole('navigation');
    const menu2Buttons = within(menus[1]).getAllByRole('navigation');

    const menu1StartNumber = 2;
    const menu1EndNumber = currentPage - 2
    const menu2StartNumber = currentPage + 2;
    const menu2EndNumber = Math.ceil(totalCount / PER_PAGE) - 1;
    const expectedMenu1List = Array.from({ length: menu1EndNumber - menu1StartNumber + 1 }, (_, i) => (i + menu1StartNumber).toString());
    const expectedMenu2List = Array.from({ length: menu2EndNumber - menu2StartNumber + 1 }, (_, i) => (i + menu2StartNumber).toString());

    expect(menu1Buttons.map(button => button.textContent)).toEqual(expectedMenu1List);
    expect(menu2Buttons.map(button => button.textContent)).toEqual(expectedMenu2List);
  });
});