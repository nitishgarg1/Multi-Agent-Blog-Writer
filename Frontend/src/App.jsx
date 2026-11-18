import { useMemo, useState } from 'react';
import { useBlogRun } from './hooks/useBlogRun.js';
import TopicForm from './components/TopicForm.jsx';
import ProgressPanel from './components/ProgressPanel.jsx';
import ArticleView from './components/ArticleView.jsx';
import PlanView from './components/PlanView.jsx';
import SourceList from './components/SourceList.jsx';

export default function App() {
  const { state, start, stop } = useBlogRun();
  const [tab, setTab] = useState('article');
  const running = state.status === 'running';

  const completedIds = useMemo(() => new Set(state.sections.map((s) => s.id)), [state.sections]);

  const draft = useMemo(() => {
    if (!state.sections.length) return '';
    const title = state.plan?.blog_title || state.topic;
    return `# ${title}\n\n${state.sections.map((s) => s.markdown).join('\n\n')}`;
  }, [state.sections, state.plan, state.topic]);

  const tabs = [
    { id: 'article', label: 'Article' },
    { id: 'outline', label: 'Outline', count: state.plan?.tasks.length },
    { id: 'sources', label: 'Sources', count: state.evidence.length },
  ];

  return (
    <>
      <header className="masthead">
        <h1>Blog Agent</h1>
        <p>Research, outline and draft a technical post from a single topic.</p>
      </header>

      <main className="shell">
        <aside className="rail">
          <TopicForm running={running} onSubmit={start} onStop={stop} />
          {state.status !== 'idle' && (
            <ProgressPanel
              stages={state.stages}
              substages={state.substages}
              progress={state.progress}
              routing={state.routing}
            />
          )}
        </aside>

        <section className="stage" aria-live="polite">
          {state.status === 'error' && (
            <div className="alert" role="alert">
              <strong>The run failed.</strong> {state.error}
            </div>
          )}
          {state.status === 'stopped' && (
            <div className="alert alert--info">Stopped before the article was finished.</div>
          )}

          <div className="tabs" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                className={tab === t.id ? 'tab tab--active' : 'tab'}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {t.count > 0 && <span className="tab__count">{t.count}</span>}
              </button>
            ))}
          </div>

          <div className="stage__body">
            {tab === 'article' && (
              <ArticleView markdown={state.markdown} draft={draft} downloadUrl={state.downloadUrl} running={running} />
            )}
            {tab === 'outline' && <PlanView plan={state.plan} completedIds={completedIds} />}
            {tab === 'sources' && (
              <SourceList evidence={state.evidence} researchSkipped={state.routing?.needsResearch === false} />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
