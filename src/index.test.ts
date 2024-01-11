/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import { run } from './main'

jest.mock('./main')

describe('index', () => {
  const runMock = run as jest.MockedFunction<typeof run>;
  it('calls run when imported', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('./index')

    expect(runMock).toHaveBeenCalled()
  })
})
