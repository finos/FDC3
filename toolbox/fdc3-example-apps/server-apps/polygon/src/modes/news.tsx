/* eslint-disable  @typescript-eslint/no-explicit-any */

import { PolygonMode } from '../common';
import NewsComponent from '../components/news/NewsComponent';
import styles from './styles.module.css';
export const newsMode: PolygonMode = {
  name: 'news',
  endpoint: (state: object, apiKey: string) =>
    `https://api.polygon.io/v2/reference/news?apiKey=${apiKey}&ticker=${state}&limit=10`,
  initialState: 'AAPL',
  initialData: [],
  intents: [
    {
      name: 'ViewNews',
      function: (context: any) => {
        return context?.id?.ticker;
      },
    },
  ],
  listeners: [
    {
      name: 'fdc3.instrument',
      function: (context: any) => {
        return context?.id?.ticker;
      },
    },
  ],
  dataRenderer: (data: any) => {
    return <NewsComponent newsData={data.results ?? []} />;
  },
  stateRenderer: (state: any) => {
    return <h2 className={styles.state}>{state}</h2>;
  },
};
