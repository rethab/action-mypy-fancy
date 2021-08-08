import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import path from 'path'

export async function action(
  core: typeof Core,
  exec: typeof Exec
): Promise<void> {
  const matcherPath = path.join(__dirname, '../', 'mypy.json')
  core.info(`##[add-matcher]${matcherPath}`)
  await exec.exec('mypy', ['test'])
}
