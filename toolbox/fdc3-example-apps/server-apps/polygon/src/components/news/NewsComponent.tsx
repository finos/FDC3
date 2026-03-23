import styles from './styles.module.css';

interface Publisher {
  name: string;
  homepage_url: string;
  logo_url: string;
  favicon_url: string;
}

interface Insight {
  ticker: string;
  sentiment: string;
  sentiment_reasoning: string;
}

interface NewsItem {
  id: string;
  publisher: Publisher;
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  tickers: string[];
  image_url: string;
  description: string;
  keywords: string[];
  insights: Insight[];
}

const NewsComponent = ({ newsData }: { newsData: NewsItem[] }) => {
  return (
    <div className={styles.newsContainer}>
      {newsData.map(newsItem => (
        <div key={newsItem.id} className={styles.newsItem}>
          <div className={styles.newsHeader}>
            <img
              src={newsItem.publisher.logo_url}
              alt={`${newsItem.publisher.name} logo`}
              className={styles.publisherLogo}
            />
            <h2 className={styles.newsTitle}>
              <a href={newsItem.article_url} target="_blank" rel="noopener noreferrer">
                {newsItem.title}
              </a>
            </h2>
          </div>
          <div className={styles.newsMeta}>
            <span className={styles.newsAuthor}>{newsItem.author}</span>
            <span className={styles.newsDate}>{new Date(newsItem.published_utc).toLocaleDateString()}</span>
          </div>
          <details>
            <summary>Read more</summary>
            <img src={newsItem.image_url} alt={newsItem.title} className={styles.newsImage} />
            <p className={styles.newsDescription}>{newsItem.description}</p>
            <div className={styles.newsInsights}>
              <h3>Insights</h3>
              <ul>
                {newsItem.insights.map((insight, index) => (
                  <li key={index}>
                    <strong>{insight.ticker}:</strong> {insight.sentiment} - {insight.sentiment_reasoning}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
};

export default NewsComponent;
