import { useState } from 'react';
import { API_URL } from '../config.js';
import Markdown from './Markdown.jsx';

export default function ArticleView({ markdown, draft, downloadUrl, running }) {
  const [copied, setCopied] = useState(false);
  const text = markdown || draft;

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (!text) {
    return (
      <p className="empty">
        {running
          ? 'Sections will appear here as soon as they are written.'
          : 'Enter a topic to generate a post. The article appears here, section by section.'}
      </p>
    );
  }

  return (
    <article>
      <div className="toolbar">
        {markdown ? (
          <>
            <button type="button" className="btn btn--quiet" onClick={copy}>
              {copied ? 'Copied' : 'Copy Markdown'}
            </button>
            {downloadUrl && (
              <a className="btn btn--quiet" href={`${API_URL}${downloadUrl}`}>
                Download .md
              </a>
            )}
          </>
        ) : (
          <span className="badge">Draft: still writing</span>
        )}
      </div>
      <Markdown>{text}</Markdown>
    </article>
  );
}
