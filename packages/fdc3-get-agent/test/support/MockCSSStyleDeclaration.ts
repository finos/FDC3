export class MockCSSStyleDeclaration {
  setProperty(name: string, value: string) {
    (this as any)[name] = value;
  }

  removeProperty(name: string) {
    delete (this as any)[name];
  }
}
