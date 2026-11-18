function host(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function SourceList({ evidence, researchSkipped }) {
  if (!evidence.length) {
    return (
      <p className="empty">
        {researchSkipped
          ? 'This topic was written without web research.'
          : 'Sources found during research appear here.'}
      </p>
    );
  }

  return (
    <ul className="sources">
      {evidence.map((item) => (
        <li key={item.url}>
          <a href={item.url} target="_blank" rel="noreferrer">
            {item.title || item.url}
          </a>
          <span className="sources__host">
            {host(item.url)}
            {item.published_at && `, ${item.published_at}`}
          </span>
          {item.snippet && <p>{item.snippet}</p>}
        </li>
      ))}
    </ul>
  );
}
