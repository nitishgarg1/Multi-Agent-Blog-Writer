import { STAGES } from '../state/runReducer.js';

const MARKS = { pending: '', running: '', done: '✓', skipped: '–' };

export default function ProgressPanel({ stages, substages, progress, routing }) {
  return (
    <section className="panel">
      <h2 className="panel__title">Progress</h2>

      <ol className="steps">
        {STAGES.map(({ id }) => {
          const stage = stages[id];
          return (
            <li key={id} className={`step step--${stage.status}`}>
              <span className="step__mark" aria-hidden="true">
                {MARKS[stage.status]}
              </span>
              <div className="step__body">
                <span className="step__label">{stage.label}</span>
                {stage.detail && <p className="step__detail">{stage.detail}</p>}

                {id === 'workers' && progress.total > 0 && (
                  <div
                    className="bar"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={progress.total}
                    aria-valuenow={progress.completed}
                  >
                    <span style={{ width: `${(progress.completed / progress.total) * 100}%` }} />
                  </div>
                )}

                {id === 'reducer' && substages.length > 0 && (
                  <ul className="substeps">
                    {substages.map((s) => (
                      <li key={s.id}>{s.label}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {routing && (
        <details className="queries">
          <summary>
            Mode: {routing.mode.replace('_', ' ')}
            {routing.queries.length > 0 && `, ${routing.queries.length} search queries`}
          </summary>
          {routing.queries.length > 0 && (
            <ul>
              {routing.queries.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          )}
        </details>
      )}
    </section>
  );
}
