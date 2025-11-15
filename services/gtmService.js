const { google } = require("googleapis");

class GTMService {
  static async addUser(authClient, gtmAccountId, gtmContainerId, userEmail) {
    try {
      const tagmanager = google.tagmanager("v2");

      await tagmanager.accounts.permissions.create({
        auth: authClient,
        parent: `accounts/${gtmAccountId}`,
        requestBody: {
          emailAddress: userEmail,
          accountAccess: {
            permission: "manage",
          },
        },
      });

      return {
        success: true,
        message: `User ${userEmail} added to GTM with manage permissions`,
      };
    } catch (error) {
      if (error.code === 409) {
        await this.updateUserPermissions(authClient, gtmAccountId, userEmail);
        return {
          success: true,
          message: `User ${userEmail} permissions updated to manage in GTM`,
        };
      }
      throw error;
    }
  }

  static async updateUserPermissions(authClient, gtmAccountId, userEmail) {
    const tagmanager = google.tagmanager("v2");

    const permissions = await tagmanager.accounts.permissions.list({
      auth: authClient,
      parent: `accounts/${gtmAccountId}`,
    });

    const userPermission = permissions.data.accountAccess?.find((perm) => perm.emailAddress === userEmail);

    if (userPermission) {
      await tagmanager.accounts.permissions.update({
        auth: authClient,
        path: userPermission.path,
        requestBody: {
          emailAddress: userEmail,
          accountAccess: {
            permission: "manage",
          },
        },
      });
    }
  }

  static async removeUser(authClient, gtmAccountId, userEmail) {
    try {
      const tagmanager = google.tagmanager("v2");

      const permissions = await tagmanager.accounts.permissions.list({
        auth: authClient,
        parent: `accounts/${gtmAccountId}`,
      });

      const userPermission = permissions.data.accountAccess?.find((perm) => perm.emailAddress === userEmail);

      if (!userPermission) {
        return {
          success: false,
          message: `User ${userEmail} not found in GTM`,
        };
      }

      await tagmanager.accounts.permissions.delete({
        auth: authClient,
        path: userPermission.path,
      });

      return {
        success: true,
        message: `User ${userEmail} removed from GTM`,
      };
    } catch (error) {
      throw error;
    }
  }

  static async findAllUsers(authClient, gtmAccountId) {
    const tagmanager = google.tagmanager("v2");

    const permissions = await tagmanager.accounts.permissions.list({
      auth: authClient,
      parent: `accounts/${gtmAccountId}`,
    });

    return permissions.data.accountAccess || [];
  }
}

module.exports = GTMService;
