export const STAGES = [
  { id: 'router', label: 'Analyze the request' },
  { id: 'research', label: 'Research sources' },
  { id: 'orchestrator', label: 'Plan the article' },
  { id: 'workers', label: 'Write the sections' },
  { id: 'reducer', label: 'Assemble and add diagrams' },
];

const blankStages = () =>
  Object.fromEntries(STAGES.map((s) => [s.id, { ...s, status: 'pending', detail: '' }]));

export const initialState = {
  status: 'idle', // idle | running | done | error | stopped
  topic: '',
  runId: null,
  stages: blankStages(),
  substages: [],
  routing: null,
  evidence: [],
  plan: null,
  sections: [],
  progress: { completed: 0, total: 0 },
  images: [],
  markdown: '',
  downloadUrl: null,
  error: null,
};

function setStage(state, id, patch) {
  if (!state.stages[id]) return state;
  return { ...state, stages: { ...state.stages, [id]: { ...state.stages[id], ...patch } } };
}

function applyEvent(state, e) {
  switch (e.type) {
    case 'run_started':
      return { ...state, runId: e.run_id };

    case 'stage':
      return setStage(state, e.id, {
        status: e.status === 'completed' ? 'done' : e.status,
        detail: e.detail || '',
      });

    case 'routing': {
      const next = {
        ...state,
        routing: { mode: e.mode, needsResearch: e.needs_research, queries: e.queries || [] },
      };
      return e.needs_research
        ? next
        : setStage(next, 'research', { status: 'skipped', detail: 'Not needed for this topic.' });
    }

    case 'research_complete':
      return { ...state, evidence: e.evidence || [] };

    case 'plan':
      return {
        ...state,
        plan: e.plan,
        progress: { completed: 0, total: e.plan?.tasks?.length || 0 },
      };

    case 'section_complete': {
      if (state.sections.some((s) => s.id === e.task_id)) return state;
      const sections = [...state.sections, { id: e.task_id, title: e.title, markdown: e.markdown }].sort(
        (a, b) => a.id - b.id
      );
      return { ...state, sections, progress: { completed: e.completed, total: e.total } };
    }

    case 'substage':
      return {
        ...state,
        substages: [...state.substages.filter((s) => s.id !== e.id), { id: e.id, label: e.label }],
      };

    case 'images_planned':
      return { ...state, images: e.images || [] };

    case 'final':
      return { ...state, markdown: e.markdown, downloadUrl: e.download_url };

    case 'done':
      return { ...state, status: 'done' };

    case 'error':
      return { ...state, status: 'error', error: e.message };

    default:
      return state;
  }
}

export function runReducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...initialState, stages: blankStages(), status: 'running', topic: action.topic };
    case 'event':
      return applyEvent(state, action.event);
    case 'stream_end':
      return state.status === 'running'
        ? { ...state, status: 'error', error: 'The connection closed before the article was finished.' }
        : state;
    case 'fail':
      return { ...state, status: 'error', error: action.message };
    case 'stopped':
      return { ...state, status: 'stopped' };
    default:
      return state;
  }
}
