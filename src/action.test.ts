import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import {action} from './action'

describe('action', () => {
  const info = jest.fn()
  const getExecOutput = jest.fn()

  const core = {info} as unknown as typeof Core
  const exec = {getExecOutput} as unknown as typeof Exec

  it('should pass arguments to exec call', async () => {
    await action(core, exec)

    expect(getExecOutput).toHaveBeenCalledWith('mypy', ['test'], {
      ignoreReturnCode: true,
    })
  })

  it('should throw error after posting checks if exit code was one', async () => {
    getExecOutput.mockResolvedValue({
      stdout: 'test/main.py:2: error: Unsupported',
      exitCode: 1,
    })

    await expect(action(core, exec)).rejects.toThrow('mypy has returned errors')

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
