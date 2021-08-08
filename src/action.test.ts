import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import {action} from './action'

describe('action', () => {
  const setOutput = jest.fn()
  const exec = jest.fn()

  const core = {info: setOutput} as unknown as typeof Core
  const shell = {exec} as unknown as typeof Exec

  it('should run action', async () => {
    exec.mockRejectedValue(new Error('many mypy errors'))
    await expect(action(core, shell)).rejects.toThrow('many mypy errors')

    expect(setOutput).toHaveBeenCalledWith(
      expect.stringMatching(
        /^##\[add-matcher]\/.*action-mypy-fancy\/mypy\.json/
      )
    )
    expect(exec).toHaveBeenCalledWith('mypy', ['test'])
  })
})
