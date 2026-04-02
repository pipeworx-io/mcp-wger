/**
 * Wger MCP — wraps wger Workout Manager REST API (free, no auth for read)
 *
 * Tools:
 * - list_exercises: List exercises filtered to English
 * - get_exercise: Get a specific exercise by ID
 * - list_muscles: List all muscles in the database
 * - list_equipment: List all equipment types in the database
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://wger.de/api/v2';

type RawExercise = {
  id: number;
  uuid: string;
  name: string;
  description: string;
  category: { id: number; name: string } | null;
  muscles: Array<{ id: number; name_en: string }>;
  muscles_secondary: Array<{ id: number; name_en: string }>;
  equipment: Array<{ id: number; name: string }>;
  language: number;
};

type RawMuscle = {
  id: number;
  name_en: string;
  is_front: boolean;
};

type RawEquipment = {
  id: number;
  name: string;
};

type RawListResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

function formatExercise(e: RawExercise) {
  return {
    id: e.id,
    name: e.name,
    description: e.description.replace(/<[^>]*>/g, '').trim(),
    category: e.category?.name ?? null,
    muscles: e.muscles.map((m) => m.name_en),
    muscles_secondary: e.muscles_secondary.map((m) => m.name_en),
    equipment: e.equipment.map((eq) => eq.name),
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'list_exercises',
    description: 'List exercises from the wger database (English language only).',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of exercises to return. Defaults to 20.',
        },
      },
    },
  },
  {
    name: 'get_exercise',
    description: 'Get detailed information for a specific exercise by its numeric ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'The numeric wger exercise ID.',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_muscles',
    description: 'List all muscles tracked in the wger database.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_equipment',
    description: 'List all equipment types available in the wger database.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list_exercises':
      return listExercises((args.limit as number | undefined) ?? 20);
    case 'get_exercise':
      return getExercise(args.id as number);
    case 'list_muscles':
      return listMuscles();
    case 'list_equipment':
      return listEquipment();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function listExercises(limit: number) {
  const res = await fetch(`${BASE_URL}/exercise/?format=json&language=2&limit=${limit}`);
  if (!res.ok) throw new Error(`wger API error: ${res.status}`);
  const data = (await res.json()) as RawListResponse<RawExercise>;
  return {
    count: data.count,
    exercises: data.results.map(formatExercise),
  };
}

async function getExercise(id: number) {
  const res = await fetch(`${BASE_URL}/exercise/${id}/?format=json`);
  if (!res.ok) throw new Error(`wger API error: ${res.status}`);
  const data = (await res.json()) as RawExercise;
  return formatExercise(data);
}

async function listMuscles() {
  const res = await fetch(`${BASE_URL}/muscle/?format=json`);
  if (!res.ok) throw new Error(`wger API error: ${res.status}`);
  const data = (await res.json()) as RawListResponse<RawMuscle>;
  return {
    count: data.count,
    muscles: data.results.map((m) => ({
      id: m.id,
      name: m.name_en,
      is_front: m.is_front,
    })),
  };
}

async function listEquipment() {
  const res = await fetch(`${BASE_URL}/equipment/?format=json`);
  if (!res.ok) throw new Error(`wger API error: ${res.status}`);
  const data = (await res.json()) as RawListResponse<RawEquipment>;
  return {
    count: data.count,
    equipment: data.results.map((e) => ({ id: e.id, name: e.name })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
