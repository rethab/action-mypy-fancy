import * as Core from '@actions/core'
import * as Exec from '@actions/exec'

export async function action(
  core: typeof Core,
  exec: typeof Exec
): Promise<void> {
  const {stdout} = await exec.getExecOutput('mypy test')

  core.info(stdout)
}
