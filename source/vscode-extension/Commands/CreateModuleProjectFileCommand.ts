import * as FileSystem from 'fs-extra'
import * as Path from 'path'
import { v4 as UUIDV4 } from 'uuid'
import * as vscode from 'vscode'
import * as YAML from 'yaml'
import { VSCodeUtilities } from '../extension'
import { Module } from '../../shared/Module Entities/Module'
import { CommandBase } from './CommandBase'

export class CreateModuleProjectFileCommand extends CommandBase {

  /**
   * If specified, this will be displayed in the status bar
   * as the command executes
   */
  statusMessage = 'Creating Module Project File...'

  /**
   * If specified, this will be displayed as an info
   * message whtn the command succeeds.
   */
  successMessage = 'Module Project File created successfully.'

  /**
   * Contains execution code for the command
   */
  protected async executeCommand() {    
    let projectPath = VSCodeUtilities.getPrimaryWorkspaceFolderPath()
    if (projectPath === undefined) {
      throw Error('Could not locate folder for Module.yaml.')
    }

    // See if a Module.yaml file already exists
    let moduleProjectFilePath = Path.join(projectPath, Module.moduleProjectFileName)
    if (FileSystem.existsSync(moduleProjectFilePath)) {
      throw Error('Module.yaml already exists.')
    }

    // Check module path again in case it was deleted
    // while we were waiting for user input
    if (FileSystem.existsSync(moduleProjectFilePath)) {
      throw Error('Module.yaml already exists.')
    }

    let moduleName = Path.basename(projectPath)

    // Format Module.yaml data
    let moduleFileContent = {
      id: UUIDV4(),
      name: moduleName,
      slug: Module.sanitizeSlug(moduleName),
      description: 'TBD',
      category: 'adventure',
      author: 'Anonymous',
      code: 'TBD',
      version: 1,
      autoIncrementVersion: true,
    }

    // Write Module.yaml
    let outputProjectFile = YAML.stringify(moduleFileContent)
    FileSystem.writeFileSync(moduleProjectFilePath, outputProjectFile)
    vscode.commands.executeCommand('encounterPlusMarkdown.refreshModules')
  }
}