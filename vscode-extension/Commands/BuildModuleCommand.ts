import * as Path from 'path'
import * as vscode from 'vscode'
import { Module, ModuleMode } from '../../shared/Module Entities/Module'
import { ModuleProject } from '../../shared/ModuleProject'
import { CommandBase } from './CommandBase'

export class BuildModuleCommand extends CommandBase {

  /** The module project that will be built */
  private moduleProject: ModuleProject | undefined = undefined

  /**
   * If specified, this will be displayed in the status bar
   * as the command executes
   */
  statusMessage = 'Building EncounterPlus Module...'

  /**
   * Starts a module project building
   * @param moduleProject The module project to build
   */
  async startModuleBuild(moduleProject: ModuleProject) {
    this.moduleProject = moduleProject
    this.startCommand()
  }

  /**
   * Contains execution code for the command
   */
  protected async executeCommand() {
    await vscode.workspace.saveAll(false)
    let moduleProjectPath = this.moduleProject?.moduleProjectPath
    let projectDirectory = this.moduleProject?.moduleProjectDirectory

    // Ensure we have a proper project path
    if (moduleProjectPath === undefined) {
      throw Error('Could not locate module project path.')
    }
    if (projectDirectory === undefined) {
      throw Error('Could not locate module project directory.')
    }

    let appRootPath = Path.join(__dirname, "..")
    let module = await Module.createModuleFromPath(projectDirectory, appRootPath, Path.basename(projectDirectory), ModuleMode.ModuleExport)

    let completeMessage = `Successfully created module: ${module.moduleProjectInfo.name}.`
    vscode.window.showInformationMessage(completeMessage, 'View Module File').then((selection) => {
      if (module.moduleArchivePath) {
        let archiveURI = vscode.Uri.file(module.moduleArchivePath)
        vscode.commands.executeCommand('revealFileInOS', archiveURI)
      }
    })
  }
}
