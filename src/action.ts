import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import path from 'path'
import * as fs from 'fs'

export async function action(
  core: typeof Core,
  exec: typeof Exec
): Promise<void> {
  const exitCode = await exec.exec('mypy', ['test'], {ignoreReturnCode: true})

  const matchersDir = path.join(__dirname, '../')
  const matcherPath = path.join(matchersDir, 'mypy.json')
  core.info(`Matcher file: ${fs.readFileSync(matcherPath, 'utf-8')}`)
  core.info('Add matcher')
  core.info(`##[add-matcher]${matcherPath}`)
  core.info('After add matcher')

  if (exitCode !== 0) {
    throw new Error('mypy has returned errors')
  }
}
