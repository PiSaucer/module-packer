import * as Path from 'path'
import { Module, ModuleMode } from '../shared/Module Entities/Module'
import { ModuleProject } from '../shared/ModuleProject'
import { PdfExporter } from '../shared/PdfExporter'

async function main() {
  let args = process.argv

  if (args.length < 3) {
    console.error('A Module path must be specified')
    return
  }
  let isPdfOutput = args.length > 3 && process.argv[3].toLowerCase() === 'pdf'
  let path = process.argv[2]
  if (isPdfOutput) {
    await createPDFFromPath(path, Path.basename(path))
  } else {
    await createModuleFromPath(path, Path.basename(path))
  }
}


/**
 * Creates the module from a path and name
 * @param path The path of the module
 * @param name The name of the module
 */
async function createModuleFromPath(path: string, name: string) {
  try {
    let moduleProjects = ModuleProject.findModuleProjects(path)
    let appRootPath = Path.join(__dirname, '..')
    if (moduleProjects.length === 0) {
      await Module.createModuleFromPath(path, appRootPath, name, ModuleMode.ModuleExport)
    } else if (moduleProjects.length === 1) {
      let modulePath = Path.dirname(moduleProjects[0].moduleProjectPath)
      await Module.createModuleFromPath(modulePath, appRootPath, name, ModuleMode.ModuleExport)
    } else {
    }
  } catch (error) {
  }
}

/**
 * Creates the PDF from a path and name
 * @param path The path of the module
 * @param name The name of the module
 */
async function createPDFFromPath(path: string, name: string) {
  try {
    let moduleProjects = ModuleProject.findModuleProjects(path)
    let appRootPath = Path.join(__dirname, '..')
    if (moduleProjects.length === 0) {
      await PdfExporter.installChromiumForRendering(updateChromiumInstallProgress)
      await PdfExporter.exportToPdf(path, appRootPath)
    } else if (moduleProjects.length === 1) {
      let moduleFolderPath = Path.dirname(moduleProjects[0].moduleProjectPath)
      await PdfExporter.installChromiumForRendering(updateChromiumInstallProgress)
      await PdfExporter.exportToPdf(moduleFolderPath, appRootPath)
    } else {
    }
  } catch (error) {
  }
}

function updateChromiumInstallProgress(progress: number) {
}

main()