/**
 * The Worst Pizza Topping — one-line pitch writer for make.fun.
 *
 * The program writes a single funny line to <output>/entry.txt: a pitch
 * for the worst pizza topping imaginable. The line is fixed and
 * deliberate, not generated at random — a judged one-liner must be the
 * same strong sentence on every run — so the program holds one carefully
 * worded sentence and checks it against the competition gate (UTF-8
 * text, 1 to 200 characters, not only whitespace, a single line) before
 * writing it out. If the sentence ever failed a check, the program exits
 * non-zero instead of writing a bad entry.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pitch: a topping nobody asked for, sold with a straight face.
// The joke turns on the plant being haunted and judgemental — it rates
// the customer, not the other way round — and ends on the plant eating
// the diner's will to live instead of sunlight.
const PITCH =
  "Try our new pizza topped with a haunted houseplant — it judges your life choices, wilts if you tip badly, and photosynthesises your will to live.";

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`topping: error: ${message}`);
  process.exit(1);
}

function requireGate(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function checkPitch(text: string): void {
  requireGate(Boolean(text) && Boolean(text.trim()), "pitch is empty or only whitespace");
  // Character count is what the gate measures (not bytes).
  const length = [...text].length;
  requireGate(
    length <= MAX_CHARS,
    `pitch is ${length} characters, over the ${MAX_CHARS} limit`,
  );
  // One line: no line breaks anywhere in the entry.
  requireGate(!/[\r\n]/.test(text), "pitch must be a single line");
  // Must name a pizza and a topping, so the judge's first criterion is met.
  requireGate(/pizza/i.test(text), "pitch must mention pizza");
  // Must encode as UTF-8, as the gate requires.
  new TextEncoder().encode(text);
}

function main(): void {
  try {
    checkPitch(PITCH);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, "entry.txt");
  writeFileSync(target, PITCH, { encoding: "utf-8" });
  console.log(`topping: wrote ${[...PITCH].length} characters to ${target}`);
}

main();
