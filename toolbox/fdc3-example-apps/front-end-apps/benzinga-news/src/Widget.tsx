import { getAgent } from '@finos/fdc3';
import { useEffect, useMemo, useState } from 'react';

/**
 * Benzinga embed pattern: iframe to widgets.benzinga.com (see
 * https://docs.benzinga.com/widgets/overview ).
 *
 * Optional token: https://docs.benzinga.com/widgets/authorization
 * Set VITE_BENZINGA_WIDGET_TOKEN in packages/fdc3-example-apps/.env when licensed.
 */
const DEFAULT_SYMBOL = 'AAPL';

function buildNewsWidgetUrl(symbol: string): string {
  const s = (symbol || DEFAULT_SYMBOL).toUpperCase();
  const base = `https://widgets.benzinga.com/quote/${encodeURIComponent(s)}/news`;
  const token = import.meta.env.VITE_BENZINGA_WIDGET_TOKEN as string | undefined;
  if (token) {
    const q = new URLSearchParams({ token });
    return `${base}?${q.toString()}`;
  }
  return base;
}

export const Widget = () => {
  const [ticker, setTicker] = useState('');

  useEffect(() => {
    getAgent().then(fdc3 => {
      fdc3.addIntentListener('ViewChart', async context => {
        if (context?.id?.ticker && context.type == 'fdc3.instrument') {
          setTicker(context.id.ticker);
        }
      });

      fdc3.addContextListener('fdc3.instrument', async context => {
        if (context?.id?.ticker) {
          setTicker(context.id.ticker);
        }
      });
    });
  }, []);

  const iframeSrc = useMemo(() => buildNewsWidgetUrl(ticker), [ticker]);
  const displaySymbol = (ticker || DEFAULT_SYMBOL).toUpperCase();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <iframe
        title={`Benzinga news — ${displaySymbol}`}
        src={iframeSrc}
        style={{
          border: 0,
          flex: 1,
          width: '100%',
          minHeight: 480,
        }}
      />
      <div
        style={{
          textAlign: 'center',
          width: '100%',
          fontSize: '14px',
          padding: '8px 0',
          flexShrink: 0,
        }}
      >
        <a
          href="https://www.benzinga.com"
          rel="noopener noreferrer"
          target="_blank"
          style={{ color: '#6a6d78', textDecoration: 'none' }}
        >
          Provided by <span style={{ color: '#2ca2d1' }}>Benzinga</span>
        </a>
      </div>
    </div>
  );
};
