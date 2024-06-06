import { render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';

import Pagination from '@/components/Pagination';
import { server } from '@/__tests__/mocks/msw/server';


describe("Pagination", () => {
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => server.close());
  // beforeEach(() => {
  // });
  test("should render the Pagination component", async () => {
    const currentPage = 1;
    const query = { limit: 4, offset: 0, filters: '' }
    render(<Pagination currentPage={currentPage} query={query} />);
    // const nextElement = screen.getByText('1');
    await waitFor(() => {
      screen.debug();
      expect("1").toBeInTheDocument();
    });
  });
});