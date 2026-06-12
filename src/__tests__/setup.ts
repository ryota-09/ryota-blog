// import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.restoreAllMocks();
})

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
    })),
    useSearchParams: vi.fn(() => ({
      get: vi.fn(),
    })),
    usePathname: vi.fn(),
  };
});
vi.mock("next/link")

// next-intl はテストでは NextIntlClientProvider が無いため、実際の ja メッセージを参照する軽量モックに差し替える
vi.mock("next-intl", async () => {
  const ja = (await import("../../locales/ja.json")).default as Record<string, Record<string, string>>;
  return {
    useTranslations: (namespace?: string) => (key: string) => {
      const ns = namespace ? ja[namespace] : (ja as unknown as Record<string, string>);
      return (ns?.[key] as string) ?? key;
    },
    useLocale: () => "ja",
  };
});

// next-view-transitions は内部で `next/link`(拡張子なし) を import するため、
// Next.js 16 の ESM exports 解決と相性が悪い。テストでは素のアンカーにフォールバックさせる。
vi.mock("next-view-transitions", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    Link: ({ children, href, ...props }: { children?: unknown; href?: string } & Record<string, unknown>) =>
      React.createElement("a", { href, ...props }, children as never),
    useTransitionRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  };
});