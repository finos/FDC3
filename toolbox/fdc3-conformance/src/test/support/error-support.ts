import { ChannelError } from '@finos/fdc3';
import { expect } from 'chai';

export async function expectChannelError(
  action: () => Promise<unknown>,
  expectedError: ChannelError,
  errorMessage: string
): Promise<void> {
  try {
    await action();
  } catch (ex) {
    expect(ex, errorMessage).to.have.property('message', expectedError);
    return;
  }

  throw new Error(`Expected the operation to reject with ${expectedError}${errorMessage}`);
}
