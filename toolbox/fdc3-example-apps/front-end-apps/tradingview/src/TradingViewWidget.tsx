// TradingViewWidget.jsx
import { getAgent, Listener } from '@finos/fdc3';
import { useEffect, useRef, memo, useState } from 'react';

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { TradingViewMode } from './common';
import { chartMode } from './modes/chart';
import { symbolInfoMode } from './modes/symbol-info';
import { fundamentalsMode } from './modes/fundamentals';
import { tickersMode } from './modes/tickers';
import { marketDataMode } from './modes/market-data';

const MODES: TradingViewMode[] = [chartMode, symbolInfoMode, fundamentalsMode, tickersMode, marketDataMode];

export const TradingViewWidget = ({ mode }: { mode: string }) => {
  const container: any = useRef();
  const modeProps = MODES.find(m => m.name === mode) ?? MODES[0];

  const [state, setState] = useState(modeProps.initialState);

  useEffect(() => {
    const registrations: Listener[] = [];
    let contextListenerTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    void getAgent().then(async fdc3 => {
      for (const intent of modeProps.intents) {
        if (cancelled) return;
        const registration = await fdc3.addIntentListener(intent.name, context => {
          setState((prev: any) => intent.function(context, prev));
        });
        registrations.push(registration);
      }

      contextListenerTimer = setTimeout(() => {
        void (async () => {
          for (const listener of modeProps.listeners) {
            if (cancelled) return;
            const registration = await fdc3.addContextListener(listener.name, context => {
              setState((prev: any) => listener.function(context, prev));
            });
            registrations.push(registration);
          }
        })();
      }, 2000);
    });

    return () => {
      cancelled = true;
      if (contextListenerTimer !== undefined) {
        clearTimeout(contextListenerTimer);
      }
      void Promise.all(registrations.map(r => r.unsubscribe()));
    };
  }, [mode]);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    script = document.getElementById('tradingview-widget-script') as HTMLScriptElement;

    if (script) {
      container.current.removeChild(script);
    }

    script = document.createElement('script');
    container.current.appendChild(script);

    script.id = 'tradingview-widget-script';
    script.src = modeProps.script;

    script.type = 'text/javascript';
    script.async = true;
    // nosemgrep: javascript.browser.security.insecure-document-method.insecure-document-method
    script.innerHTML = modeProps.innerHTML(state);
  }, [state]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text"> Track all markets on TradingView </span>
        </a>
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
