import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './shared/context/AuthContext';
import './styles/index.css';
import App from './app/App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Universal horizontal mouse-wheel scrolling for tab bars, navbars, and scrollable containers across all 9 panels
if (typeof window !== 'undefined') {
  window.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      // Allow native horizontal scrolling when shift key is held or when horizontal delta is dominant
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      let target = e.target as HTMLElement | null;
      while (target && target !== document.body && target !== document.documentElement) {
        const style = window.getComputedStyle(target);
        const overflowX = style.overflowX;
        const canScrollHorizontal =
          (overflowX === 'auto' || overflowX === 'scroll') &&
          target.scrollWidth > target.clientWidth;

        const canScrollVertical =
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          target.scrollHeight > target.clientHeight;

        // If the element has horizontal overflow and no vertical overflow, translate vertical wheel to horizontal scroll
        if (canScrollHorizontal && !canScrollVertical) {
          const maxScrollLeft = target.scrollWidth - target.clientWidth;
          const prevScroll = target.scrollLeft;
          target.scrollLeft += e.deltaY;

          // Prevent page vertical scroll if the container scrolled or is scrollable
          if (
            target.scrollLeft !== prevScroll ||
            (e.deltaY > 0 && target.scrollLeft < maxScrollLeft) ||
            (e.deltaY < 0 && target.scrollLeft > 0)
          ) {
            e.preventDefault();
          }
          return;
        }

        target = target.parentElement;
      }
    },
    { passive: false }
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
