import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import {action} from './action'

describe('action', () => {
  const info = jest.fn()
  const getExecOutput = jest.fn()

  const core = {info} as unknown as typeof Core
  const exec = {getExecOutput} as unknown as typeof Exec

  it('should run mypy', async () => {
    getExecOutput.mockResolvedValue({stdout: 'mypy ran successfully'})
    await action(core, exec)

    expect(info).toHaveBeenCalledWith('mypy ran successfully')
  })
})
