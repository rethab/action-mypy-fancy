import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import {action} from './action'

describe('action', () => {
  const info = jest.fn()
  const getInput = jest.fn()
  const getExecOutput = jest.fn()
  const createCheck = jest.fn()

  const octokit = {rest: {checks: {create: createCheck}}}
  const getOctokit = jest.fn().mockReturnValue(octokit)

  const core = {info, getInput} as unknown as typeof Core
  const exec = {getExecOutput} as unknown as typeof Exec

  it('should create the octokit using the github-token input', async () => {
    getInput.mockReturnValue('my-secret-token')
    getExecOutput.mockResolvedValue({stdout: '', exitCode: 0})

    await action(core, exec, getOctokit)

    expect(getInput).toHaveBeenCalledWith('github-token', {required: true})
    expect(getOctokit).toHaveBeenCalledWith('my-secret-token')
  })

  it('should pass arguments to exec call', async () => {
    await action(core, exec, getOctokit)

    expect(getExecOutput).toHaveBeenCalledWith('mypy', ['test'], {
      ignoreReturnCode: true,
    })
  })

  it('should throw error after posting checks if exit code was one', async () => {
    getExecOutput.mockResolvedValue({
      stdout: 'test/main.py:2: error: Unsupported',
      exitCode: 1,
    })

    await expect(action(core, exec, getOctokit)).rejects.toThrow(
      'mypy has returned errors'
    )

    expect(createCheck).toHaveBeenCalledTimes(1)
  })

  it('should pass parse errors to create check endpoint', async () => {
    getExecOutput.mockResolvedValue({
      exitCode: 1,
      stdout: `test/main.py:2: error: Unsupported operand types for + ("str" and "int")
test/main.py:4: error: Name "add" already defined on line 1
test/main.py:5: error: Unsupported operand types for + ("str" and "int")
Found 3 errors in 1 file (checked 1 source file)`,
    })

    await expect(action(core, exec, getOctokit)).rejects.toThrow()

    expect(createCheck).toHaveBeenCalledWith({
      repo: '',
      output: {
        annotations: [
          {
            file: 'test/main.py',
            line: 2,
            message: 'error: Unsupported operand types for + ("str" and "int")',
          },
          {
            file: 'test/main.py',
            line: 4,
            message: 'error: Name "add" already defined on line 1',
          },
          {
            file: 'test/main.py',
            line: 5,
            message: 'error: Unsupported operand types for + ("str" and "int")',
          },
        ],
      },
    })
  })
})
