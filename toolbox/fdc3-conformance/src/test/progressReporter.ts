/**
 * Custom Mocha reporter that shows an amber in-progress indicator when each test
 * starts, then updates the indicator to a green tick or red cross when the test completes.
 */
export class ProgressReporter extends Mocha.reporters.Base {
  private testElements = new Map<string, HTMLElement>();
  private suiteStack: HTMLElement[];
  private canvas: HTMLCanvasElement;
  private passLi: HTMLElement;
  private failLi: HTMLElement;
  private durationLi: HTMLElement;
  private startTime: number;
  private durationTimer: ReturnType<typeof setInterval>;

  constructor(runner: Mocha.Runner, options?: Mocha.MochaOptions) {
    super(runner, options);

    const root = document.getElementById('mocha')!;
    root.innerHTML = '';

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

    this.passLi = document.createElement('li');
    this.passLi.className = 'passes';
    this.passLi.innerHTML = `<a href="javascript:void(0);">passes: <em>0</em></a>`;
    statsEl.appendChild(this.passLi);

    this.failLi = document.createElement('li');
    this.failLi.className = 'failures';
    this.failLi.innerHTML = `<a href="javascript:void(0);">failures: <em>0</em></a>`;
    statsEl.appendChild(this.failLi);

    this.durationLi = document.createElement('li');
    this.durationLi.className = 'duration';
    this.durationLi.innerHTML = `duration: <em>0</em>s`;
    statsEl.appendChild(this.durationLi);

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

  private updateDuration() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    this.durationLi.innerHTML = `duration: <em>${elapsed}</em>s`;
  }

  private updateStats() {
    const { passes, failures } = this.stats;
    this.passLi.innerHTML = `<a href="javascript:void(0);">passes: <em>${passes}</em></a>`;
    this.failLi.innerHTML = `<a href="javascript:void(0);">failures: <em>${failures}</em></a>`;

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
