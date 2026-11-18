import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { API_URL } from '../config.js';

// The backend writes image paths like "images/foo.svg"; point them at the API server.
const components = {
  img: ({ src = '', alt = '' }) => (
    <img src={/^https?:/.test(src) ? src : `${API_URL}/${src.replace(/^\//, '')}`} alt={alt} loading="lazy" />
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

export default function Markdown({ children }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
