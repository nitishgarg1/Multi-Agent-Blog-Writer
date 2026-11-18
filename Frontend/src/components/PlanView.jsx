export default function PlanView({ plan, completedIds }) {
  if (!plan) return <p className="empty">The outline appears once the plan is ready.</p>;

  return (
    <div className="plan">
      <dl className="plan__meta">
        <div>
          <dt>Audience</dt>
          <dd>{plan.audience}</dd>
        </div>
        <div>
          <dt>Tone</dt>
          <dd>{plan.tone}</dd>
        </div>
        <div>
          <dt>Kind</dt>
          <dd>{plan.blog_kind.replace('_', ' ')}</dd>
        </div>
      </dl>

      {plan.constraints?.length > 0 && (
        <ul className="plan__constraints">
          {plan.constraints.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}

      <ol className="tasks">
        {plan.tasks.map((task) => (
          <li key={task.id} className={completedIds.has(task.id) ? 'task task--done' : 'task'}>
            <h3>{task.title}</h3>
            <p>{task.goal}</p>
            <ul>
              {task.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="task__meta">
              about {task.target_words} words
              {task.requires_code && ', includes code'}
              {task.requires_citations && ', cites sources'}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
