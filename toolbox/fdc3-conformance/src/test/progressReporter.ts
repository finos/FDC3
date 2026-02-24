/**
 * Custom Mocha reporter that shows an amber in-progress indicator when each test
 * starts, then updates the indicator to a green tick or red cross when the test completes.
 */
export class ProgressReporter extends Mocha.reporters.Base {
  private testElements = new Map<string, HTMLElement>();
  private suiteStack: HTMLElement[];
  private canvas: HTMLCanvasElement;
  private passCount: HTMLElement;
  private failCount: HTMLElement;
  private durationCount: HTMLElement;
  private startTime: number;
  private durationTimer: ReturnType<typeof setInterval>;

  constructor(runner: Mocha.Runner, options?: Mocha.MochaOptions) {
    super(runner, options);

    const root = document.getElementById('mocha')!;
    root.replaceChildren();

    const statsEl = document.createElement('ul');
    statsEl.id = 'mocha-stats';
    root.appendChild(statsEl);

    const report = document.createElement('ul');
    report.id = 'mocha-report';
    root.appendChild(report);

    // Progress ring canvas
    const progressLi = document.createElement('li');
    progressLi.className = 'progress-ring';
    this.canvas = document.createElement('canvas');
    this.canvas.width = 40;
    this.canvas.height = 40;
    progressLi.appendChild(this.canvas);
    statsEl.appendChild(progressLi);

    const passLi = document.createElement('li');
    passLi.className = 'passes';
    this.passCount = this.buildStatItem(passLi, 'passes: ', '0');
    statsEl.appendChild(passLi);

    const failLi = document.createElement('li');
    failLi.className = 'failures';
    this.failCount = this.buildStatItem(failLi, 'failures: ', '0');
    statsEl.appendChild(failLi);

    const durationLi = document.createElement('li');
    durationLi.className = 'duration';
    this.durationCount = this.buildStatItem(durationLi, 'duration: ', '0', 's');
    statsEl.appendChild(durationLi);

    this.suiteStack = [report];
    this.startTime = Date.now();

    this.durationTimer = setInterval(() => this.updateDuration(), 100);

    runner.on('suite', suite => this.onSuite(suite));
    runner.on('suite end', suite => this.onSuiteEnd(suite));
    runner.on('test', test => this.onTest(test));
    runner.on('pass', test => this.onPass(test));
    runner.on('fail', (test, err) => this.onFail(test, err));
    runner.on('end', () => this.onEnd());
  }

  private onSuite(suite: Mocha.Suite) {
    if (suite.root) return;
    const li = document.createElement('li');
    li.className = 'suite';
    const h1 = document.createElement('h1');
    const a = document.createElement('a');
    a.textContent = suite.title;
    h1.appendChild(a);
    li.appendChild(h1);
    const ul = document.createElement('ul');
    li.appendChild(ul);
    this.suiteStack[this.suiteStack.length - 1].appendChild(li);
    this.suiteStack.push(ul);
  }

  private onSuiteEnd(suite: Mocha.Suite) {
    if (suite.root) return;
    if (this.suiteStack.length > 1) this.suiteStack.pop();
  }

  private onTest(test: Mocha.Test) {
    const li = document.createElement('li');
    li.className = 'test running';
    const h2 = document.createElement('h2');
    h2.textContent = test.title;
    li.appendChild(h2);
    this.suiteStack[this.suiteStack.length - 1].appendChild(li);
    this.testElements.set(test.fullTitle(), li);
    li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  private onPass(test: Mocha.Test) {
    const li = this.testElements.get(test.fullTitle());
    if (li) {
      li.className = `test pass ${this.getSpeedClass(test)}`;
      this.addDuration(li, test);
    }
    this.updateStats();
  }

  private onFail(test: Mocha.Test, err: Error) {
    const li = this.testElements.get(test.fullTitle());
    if (li) {
      li.className = 'test fail';
      this.addDuration(li, test);
      const pre = document.createElement('pre');
      pre.className = 'error';
      pre.textContent = err.message;
      li.appendChild(pre);
    }
    this.updateStats();
  }

  private onEnd() {
    clearInterval(this.durationTimer);
    this.updateDuration();
  }

  private getSpeedClass(test: Mocha.Test): string {
    const slow = test.slow ? test.slow() : 75;
    const duration = test.duration ?? 0;
    if (duration > slow) return 'slow';
    if (duration > slow / 2) return 'medium';
    return 'fast';
  }

  private addDuration(li: HTMLElement, test: Mocha.Test) {
    if (test.duration !== undefined) {
      const h2 = li.querySelector('h2')!;
      const span = document.createElement('span');
      span.className = 'duration';
      span.textContent = ` ${test.duration}ms`;
      h2.appendChild(span);
    }
  }

  private buildStatItem(parent: HTMLElement, label: string, initialValue: string, suffix?: string): HTMLElement {
    const a = document.createElement('a');
    a.href = 'javascript:void(0);';
    a.textContent = label;
    const em = document.createElement('em');
    em.textContent = initialValue;
    a.appendChild(em);
    if (suffix) {
      a.appendChild(document.createTextNode(suffix));
    }
    parent.appendChild(a);
    return em;
  }

  private updateDuration() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    this.durationCount.textContent = elapsed;
  }

  private updateStats() {
    const { passes, failures } = this.stats;
    this.passCount.textContent = String(passes);
    this.failCount.textContent = String(failures);

    // Draw progress ring
    const total = this.runner.total;
    const completed = passes + failures;
    const percent = total > 0 ? completed / total : 0;
    const ctx = this.canvas.getContext('2d')!;
    const x = this.canvas.width / 2;
    const y = this.canvas.height / 2;
    const rad = Math.min(x, y) - 1;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2, false);
    ctx.strokeStyle = '#9f9f9f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Progress arc
    ctx.beginPath();
    ctx.arc(x, y, rad - 1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * percent, false);
    ctx.strokeStyle = '#4fbc5f';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Percentage text
    ctx.fillStyle = '#888';
    ctx.font = '11px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percent * 100)}%`, x, y);
  }
}
