import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {getOctokit} from '@actions/github'
import {action} from './action'

async function run(): Promise<void> {
  try {
    await action(core, exec, getOctokit)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
