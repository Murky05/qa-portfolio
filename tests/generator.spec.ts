import { test, expect } from "@playwright/test";
import { mockCases, toCsv, type TestCase } from "../generator/generate";

const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const TYPES = ["positive", "negative", "edge"];

function assertWellFormed(cases: TestCase[]) {
  expect(cases.length).toBeGreaterThan(0);
  const ids = new Set<string>();
  for (const c of cases) {
    expect(c.id).toMatch(/^TC-\d+$/);
    expect(ids.has(c.id), `duplicate id ${c.id}`).toBe(false);
    ids.add(c.id);
    expect(c.title.trim().length).toBeGreaterThan(0);
    expect(PRIORITIES).toContain(c.priority);
    expect(TYPES).toContain(c.type);
    expect(Array.isArray(c.steps)).toBe(true);
    expect(c.steps.length).toBeGreaterThan(0);
    for (const step of c.steps) {
      expect(step.trim().length).toBeGreaterThan(0);
    }
    expect(c.expectedResult.trim().length).toBeGreaterThan(0);
  }
}

test.describe("mockCases", () => {
  test("login story yields the four login test cases", () => {
    const cases = mockCases("As a user I want to login to my account");
    expect(cases.map((c) => c.id)).toEqual(["TC-01", "TC-02", "TC-03", "TC-04"]);
    assertWellFormed(cases);
    // At least one negative and one edge case are produced for login flows.
    expect(cases.some((c) => c.type === "negative")).toBe(true);
    expect(cases.some((c) => c.type === "edge")).toBe(true);
  });

  test("matches the 'log in' phrase with a space", () => {
    const cases = mockCases("The customer should be able to log in with credentials");
    expect(cases).toHaveLength(4);
    assertWellFormed(cases);
  });

  test("keyword match is case-insensitive", () => {
    const upper = mockCases("User must LOGIN before checkout");
    const lower = mockCases("User must login before checkout");
    expect(upper).toHaveLength(4);
    expect(upper).toEqual(lower);
  });

  test("falls back to a single generic happy-path case when no keyword matches", () => {
    const cases = mockCases("Customer browses the catalog and filters products");
    expect(cases).toHaveLength(1);
    expect(cases[0].id).toBe("TC-01");
    expect(cases[0].type).toBe("positive");
    assertWellFormed(cases);
  });

  test("empty story still returns a well-formed fallback case", () => {
    const cases = mockCases("");
    expect(cases).toHaveLength(1);
    assertWellFormed(cases);
  });
});

test.describe("toCsv", () => {
  test("emits a header row followed by one row per case", () => {
    const cases = mockCases("login flow");
    const lines = toCsv(cases).split("\n");
    expect(lines[0]).toBe(
      "id,title,priority,type,preconditions,steps,expectedResult",
    );
    expect(lines).toHaveLength(cases.length + 1);
  });

  test("escapes embedded double quotes by doubling them", () => {
    const cases: TestCase[] = [
      {
        id: "TC-99",
        title: 'Search for "shoes" returns results',
        priority: "Medium",
        type: "positive",
        preconditions: "User is on the catalog",
        steps: ["Type a query", "Submit"],
        expectedResult: "Matching items are shown",
      },
    ];
    const row = toCsv(cases).split("\n")[1];
    expect(row).toContain('"Search for ""shoes"" returns results"');
  });

  test("keeps commas inside quoted fields so column count is preserved", () => {
    const cases: TestCase[] = [
      {
        id: "TC-50",
        title: "Add item, then remove it",
        priority: "Low",
        type: "edge",
        preconditions: "Cart is empty, user logged in",
        steps: ["Add item", "Remove item"],
        expectedResult: "Cart is empty again",
      },
    ];
    const row = toCsv(cases).split("\n")[1];
    // Every field is wrapped in quotes, so the embedded commas do not add columns.
    expect(row.startsWith('"TC-50"')).toBe(true);
    expect(row).toContain('"Add item, then remove it"');
    expect(row).toContain('"Cart is empty, user logged in"');
  });

  test("joins multiple steps with a pipe separator", () => {
    const cases: TestCase[] = [
      {
        id: "TC-07",
        title: "Multi-step flow",
        priority: "High",
        type: "positive",
        preconditions: "None",
        steps: ["First", "Second", "Third"],
        expectedResult: "Done",
      },
    ];
    const row = toCsv(cases).split("\n")[1];
    expect(row).toContain('"First | Second | Third"');
  });
});
