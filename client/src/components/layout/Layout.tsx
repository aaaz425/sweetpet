import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import type { Page } from "../../types";
import { Footer } from "./Footer";
import { GlobalHeader } from "./GlobalHeader";

type LayoutProps = {
  activePage: Page | null;
  onSelectPage: (page: Page) => void;
  children: ReactNode;
};

export function Layout({
  activePage,
  onSelectPage,
  children
}: LayoutProps) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [activePage]);

  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-hidden bg-background text-text-primary">
      <GlobalHeader
        activePage={activePage}
        onSelectPage={onSelectPage}
      />
      <main ref={mainRef} className="min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto flex min-h-full w-full max-w-[1120px] min-w-0 flex-col px-4 py-5 md:px-8 md:py-7">
          <div className="min-w-0 flex-1">{children}</div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
