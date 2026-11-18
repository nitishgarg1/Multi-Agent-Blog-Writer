import { useState } from 'react';

const MIN = 3;
const MAX = 1000;

export default function TopicForm({ running, onSubmit, onStop }) {
  const [topic, setTopic] = useState('');
  const valid = topic.trim().length >= MIN;

  function handleSubmit(event) {
    event.preventDefault();
    if (running) return onStop();
    if (valid) onSubmit(topic.trim());
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && valid && !running) {
      onSubmit(topic.trim());
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <label className="panel__title" htmlFor="topic">
        What should the post be about?
      </label>
      <textarea
        id="topic"
        className="field"
        rows={4}
        maxLength={MAX}
        value={topic}
        disabled={running}
        placeholder="e.g. Docker-in-Docker vs Docker-outside-of-Docker for CI pipelines"
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="form-row">
        <span className="hint">Ctrl+Enter to start</span>
        <button
          type="submit"
          className={running ? 'btn btn--quiet' : 'btn btn--primary'}
          disabled={!running && !valid}
        >
          {running ? 'Stop' : 'Write article'}
        </button>
      </div>
    </form>
  );
}
