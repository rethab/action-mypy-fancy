import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import path from 'path'

export async function action(
  core: typeof Core,
  exec: typeof Exec
): Promise<void> {
  const matchersDir = path.join(__dirname, '../')
  const matcherPath = path.join(matchersDir, 'mypy.json')
  core.info(`##[add-matcher]${matcherPath}`)
  const exitCode = await exec.exec('mypy', ['test'], {ignoreReturnCode: true})

  // todo: remove matcher again

  if (exitCode !== 0) {
    throw new Error('mypy has returned errors')
  }
}
