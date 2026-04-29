import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult,
  TestStep
} from "@playwright/test/reporter";

function formatDuration(duration: number) {
  if (duration < 1000) return `${duration}ms`;
  return `${(duration / 1000).toFixed(1)}s`;
}

function green(text: string) {
  return `\x1b[32m${text}\x1b[0m`;
}

function red(text: string) {
  return `\x1b[31m${text}\x1b[0m`;
}

function stepDepth(step: TestStep) {
  let depth = 0;
  let parent = step.parent;

  while (parent) {
    if (parent.category === "test.step") depth += 1;
    parent = parent.parent;
  }

  return depth;
}

class StepReporter implements Reporter {
  private totalTests = 0;

  onBegin(_config: FullConfig, suite: { allTests(): TestCase[] }) {
    this.totalTests = suite.allTests().length;
    console.log(`\nE2E tests: ${this.totalTests}`);
  }

  onTestBegin(test: TestCase) {
    console.log(`\n[TEST] ${test.title}`);
  }

  onStepEnd(_test: TestCase, _result: TestResult, step: TestStep) {
    if (step.category !== "test.step") return;

    const status = step.error ? red("FAIL") : green("PASS");
    const indent = "  ".repeat(stepDepth(step) + 1);
    console.log(`${indent}[${status}] ${step.title} (${formatDuration(step.duration)})`);
    if (step.error?.message) {
      console.log(`${indent}  ${red(step.error.message.split("\n")[0])}`);
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status === "passed" ? green("PASS") : red("FAIL");
    console.log(`[${status}] ${test.title} (${formatDuration(result.duration)})`);
    if (result.error?.message) {
      console.log(red(result.error.message.split("\n")[0]));
    }
  }

  onEnd(result: FullResult) {
    const summary = result.status === "passed" ? green(`${this.totalTests} passed`) : red(`E2E result: ${result.status}`);
    console.log(`\n${summary} (${formatDuration(result.duration)})\n`);
  }
}

export default StepReporter;
