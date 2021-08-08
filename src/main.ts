import * as core from '@actions/core'
import * as exec from '@actions/exec'
import {action} from './action'

async function run(): Promise<void> {
  try {
    await action(core, exec)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
