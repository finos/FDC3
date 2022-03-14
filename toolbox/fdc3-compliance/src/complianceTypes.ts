import { Test, Stats } from "mocha";

export interface TestResultHandlers {
  onPass?: (test: any) => void;
  onFail?: (test: any) => void;
}

export interface Summary {
  passed: Test[];
  failed: Test[];
  stats: Stats;
}
