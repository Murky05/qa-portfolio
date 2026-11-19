import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type TestCase = {
  id: string;
  title: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  type: "positive" | "negative" | "edge";
  preconditions: string;
  steps: string[];
  expectedResult: string;
};

export type GeneratorResult = {
  source: "openai" | "mock";
  model: string;
  story: string;
  cases: TestCase[];
};

const ROOT = process.cwd();
const STORY_PATH = path.join(ROOT, "user-story.txt");
const JSON_OUT = path.join(ROOT, "test-cases.json");
const CSV_OUT = path.join(ROOT, "test-cases.csv");
const PUBLIC_OUT = path.join(ROOT, "public", "sample-test-cases.json");

export function mockCases(story: string): TestCase[] {
  const lower = story.toLowerCase();
  const cases: TestCase[] = [];

  if (lower.includes("log in") || lower.includes("login")) {
    cases.push(
      {
        id: "TC-01",
        title: "Valid credentials open the products page",
        priority: "High",
        type: "positive",
        preconditions: "User has a registered account and is on the login page",
        steps: [
          "Enter a valid username",
          "Enter a valid password",
          "Click the Login button",
        ],
        expectedResult: "User is redirected to the products page",
      },
      {
        id: "TC-02",
        title: "Invalid credentials show an error message",
        priority: "High",
        type: "negative",
        preconditions: "User is on the login page",
        steps: [
          "Enter an invalid username or password",
          "Click the Login button",
        ],
        expectedResult: "An error message is shown and the user stays on login",
      },
      {
        id: "TC-03",
        title: "Locked-out users cannot log in",
        priority: "High",
        type: "negative",
        preconditions: "Account is locked out",
        steps: [
          "Enter locked-out username and valid password",
          "Click the Login button",
        ],
        expectedResult: "A locked-out error is shown and access is denied",
      },
      {
        id: "TC-04",
        title: "Username and password are both required",
        priority: "Medium",
        type: "edge",
        preconditions: "User is on the login page",
        steps: [
          "Leave username and/or password empty",
          "Click the Login button",
        ],
        expectedResult: "Validation error indicates the missing required field",
      },
    );
  }

  if (cases.length === 0) {
    cases.push({
      id: "TC-01",
      title: "Happy path for the stated user story",
      priority: "High",
      type: "positive",
      preconditions: "Preconditions from the story are met",
      steps: [
        "Open the application",
        "Perform the primary action described in the story",
        "Observe the result",
      ],
      expectedResult: "Acceptance criteria for the happy path are met",
    });
  }

  return cases;
}

async function callOpenAI(story: string): Promise<TestCase[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
  const model = process.env.MODEL || "gpt-4o-mini";

  const prompt = `You are a senior QA engineer. Convert this user story into structured test cases.
Return ONLY valid JSON: an array of objects with keys id, title, priority (Critical|High|Medium|Low), type (positive|negative|edge), preconditions, steps (string array), expectedResult.

User story:
${story}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: "Return JSON only. No markdown." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return parseModelResponse(data.choices?.[0]?.message?.content);
}

export function parseModelResponse(rawContent: string | undefined | null): TestCase[] {
  const content = rawContent?.trim();
  if (!content) throw new Error("Empty model response");

  const parsed = JSON.parse(content.replace(/^```json\s*|\s*```$/g, "")) as TestCase[];
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Model did not return a test-case array");
  }
  return parsed;
}

export function toCsv(cases: TestCase[]): string {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const header = ["id", "title", "priority", "type", "preconditions", "steps", "expectedResult"];
  const rows = cases.map((c) =>
    [
      c.id,
      c.title,
      c.priority,
      c.type,
      c.preconditions,
      c.steps.join(" | "),
      c.expectedResult,
    ]
      .map(escape)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

async function main() {
  const story = (await readFile(STORY_PATH, "utf8")).trim();
  if (!story) throw new Error("user-story.txt is empty");

  let cases: TestCase[] | null = null;
  let source: GeneratorResult["source"] = "mock";
  let model = "local-heuristic";

  try {
    cases = await callOpenAI(story);
    if (cases) {
      source = "openai";
      model = process.env.MODEL || "gpt-4o-mini";
    }
  } catch (error) {
    console.warn("OpenAI generation failed; falling back to mock cases.");
    console.warn(error instanceof Error ? error.message : error);
  }

  if (!cases) {
    cases = mockCases(story);
    source = "mock";
    model = "local-heuristic";
  }

  const result: GeneratorResult = { source, model, story, cases };
  const json = JSON.stringify(result, null, 2);

  await writeFile(JSON_OUT, json, "utf8");
  await writeFile(CSV_OUT, toCsv(cases), "utf8");
  await mkdir(path.dirname(PUBLIC_OUT), { recursive: true });
  await writeFile(PUBLIC_OUT, json, "utf8");

  console.log(`Generated ${cases.length} test cases via ${source} (${model}).`);
  console.log(`Wrote ${path.relative(ROOT, JSON_OUT)}`);
  console.log(`Wrote ${path.relative(ROOT, CSV_OUT)}`);
  console.log("Review every generated case before using it in a release.");
}

function isDirectlyInvoked(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  const base = path.basename(entry);
  return base === "generate.ts" || base === "generate.js";
}

if (isDirectlyInvoked()) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
