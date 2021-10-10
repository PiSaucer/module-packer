import * as YAML from 'yaml'
import * as FileSystem from 'fs-extra'
import * as Path from 'path'
import { Module } from './Module'
import { IncludeMode, ModuleEntity } from './ModuleEntity'

/** Represents a Group in a Module */
export class Group extends ModuleEntity {
  
  // ---------------------------------------------------------------
  // Initialization & Cleanup
  // ---------------------------------------------------------------

  /**
   * Initializes an instance of `Group`
   * @param name The name of the group
   * @param moduleUUID The UUID of the module
   * @param groupPath The path of the group
   */
  constructor(name: string = 'Unnamed Group', moduleUUID: string, groupPath: string) {
    let effectiveName = name    
    let slug: string | undefined = undefined
    let order: number | undefined = undefined
    let parentSlug: string | undefined = undefined

    let includeIn = 'all'
    let copyFiles = true
    let groupSettingsPath = Path.join(groupPath, Group.groupSettingsFileName)
    if (FileSystem.existsSync(groupSettingsPath)) {
      let groupDataBuffer = FileSystem.readFileSync(groupSettingsPath)

      let groupData: any = undefined
      try {
        groupData = YAML.parse(groupDataBuffer.toString())
      } catch (error: any) {
        throw Error(`Failed to parse ${groupSettingsPath}. Error: ${(error as Error).message}`)
      }

      let groupName = groupData['name'] as string
      if (groupName) {
        effectiveName = groupName
      }

      let parentSlugFromSettings = groupData['parent']
      if (parentSlugFromSettings) {
        parentSlug = parentSlugFromSettings
      }
      
      let slugFromSettings = groupData['slug']
      if (slugFromSettings) {
        slug = slugFromSettings
      }

      let includeInFromSettings = groupData['include-in']
      if(includeInFromSettings) {
        includeIn = includeInFromSettings
      }

      let copyFilesFromSettings = groupData['copy-files'] as boolean
      if(copyFilesFromSettings !== undefined) {
        copyFiles = copyFilesFromSettings
      }

      order = groupData['order'] as number
    }

    if (!slug) {
      slug = Module.getSlugFromValue(`group-${Module.getSlugFromValue(effectiveName)}`)
    }
    super(effectiveName, moduleUUID, slug)
    this.groupPath = groupPath
    this.copyFiles = copyFiles
    this.includeIn = ModuleEntity.getIncludeModeFromString(includeIn) 
    if(this.includeIn === IncludeMode.Compendium)
    {
      throw Error(`The 'include-in' value for groups cannot be 'compendium'`)
    }

    this.parentSlug = parentSlug

    if(order) {
      this.sort = order
    }
  }

  // ---------------------------------------------------------------
  // Public Properties
  // ---------------------------------------------------------------

  /** The group settings file name */
  static groupSettingsFileName = 'Group.yaml'

  /** The path of the group */
  groupPath: string

  /** Whether to copy files to module output */
  copyFiles: boolean
}
