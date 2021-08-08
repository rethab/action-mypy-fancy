import * as Core from '@actions/core'
import * as Exec from '@actions/exec'
import {getOctokit as GetOctokit} from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'

export async function action(
  core: typeof Core,
  exec: typeof Exec,
  getOctokit: typeof GetOctokit
): Promise<void> {
  const token = core.getInput('github-token', {required: true})
  const octokit = getOctokit(token)
  const {stdout} = await exec.getExecOutput('mypy', ['test'], {
    ignoreReturnCode: true,
  })

  const annotations = parseLogs(core, stdout)

  await sendChecks(octokit, annotations)
}

interface Annotation {
  file: string
  line: number
  message: string
}

function parseLogs(core: typeof Core, logs: string): Annotation[] {
  return logs.split('\n').flatMap(line => {
    const annotation = parseLine(line)
    if (annotation !== null && annotation) {
      return [annotation]
    } else {
      return []
    }
  })
}

function parseLine(line: string): Annotation | null {
  const matches = line.match(/^([^:]+):([0-9]+): (.+)$/)
  if (!matches) {
    return null
  }

  return {file: matches[1], line: Number(matches[2]), message: matches[3]}
}

async function sendChecks(
  octokit: InstanceType<typeof GitHub>,
  annotations: Annotation[]
): Promise<void> {
  octokit.rest.checks.create({
    repo: 'foo',
    output: {
      annotations,
    },
  })
}
