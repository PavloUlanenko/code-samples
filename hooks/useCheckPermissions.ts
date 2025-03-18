import { PermissionsSchema } from 'api/tenant/types';
import { checkCommonModulePermissions, checkSpecificModulePermissions } from './utils';
import permissionsSchemaImported from 'assets/files/permissions.json';
import { UseCheckPermissionParams } from './types';

const useCheckPermissions = (
  module: UseCheckPermissionParams['module'],
  scopes: UseCheckPermissionParams['scopes'],
  subModule: UseCheckPermissionParams['subModule'] = {},
) => {
  const permissionsSchema: PermissionsSchema = permissionsSchemaImported;
  const thereAreSubModules = !!Object.keys(subModule).length;

  const commonPermissions = checkCommonModulePermissions({
    module,
    subModule,
    scopes,
    permissionsSchema,
    thereAreSubModules,
  });
  return Object.keys(commonPermissions).length
    ? commonPermissions
    : checkSpecificModulePermissions({
        module,
        subModule,
        permissionsSchema,
        thereAreSubModules,
        scopes,
      });
};

export default useCheckPermissions;
