import { Test, Stats } from "mocha";

export interface TestResultHandlers {
  onStart?: () => void;
  onPass?: (test: any) => void;
  onFail?: (test: any) => void;
  onComplete?: (summary: Summary) => void;
}

export interface Summary {
  passed: Test[];
  failed: Test[];
  stats: Stats;
}
