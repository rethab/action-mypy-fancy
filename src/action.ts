import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import path from 'path'

export async function action(
  core: typeof Core,
  exec: typeof Exec
): Promise<void> {
  const exitCode = await exec.exec('mypy', ['test'], {ignoreReturnCode: true})

  const matchersDir = path.join(__dirname, '../')
  core.info('Add matcher')
  core.info(`##[add-matcher]${path.join(matchersDir, 'mypy.json')}`)
  core.info('After add matcher')

  if (exitCode !== 0) {
    throw new Error('mypy has returned errors')
  }
}
