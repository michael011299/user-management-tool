const { google } = require("googleapis");

class GAService {
  static async addUser(authClient, gaAccountId, userEmail) {
    try {
      const analytics = google.analytics("v3");

      await analytics.management.accountUserLinks.insert({
        auth: authClient,
        accountId: gaAccountId,
        requestBody: {
          permissions: {
            local: ["MANAGE_USERS", "EDIT", "COLLABORATE", "READ_AND_ANALYZE"],
          },
          userRef: {
            email: userEmail,
          },
        },
      });

      return {
        success: true,
        message: `User ${userEmail} added to GA with full permissions`,
      };
    } catch (error) {
      if (error.code === 409) {
        await this.updateUserPermissions(authClient, gaAccountId, userEmail);
        return {
          success: true,
          message: `User ${userEmail} permissions updated to full access in GA`,
        };
      }
      throw error;
    }
  }

  static async updateUserPermissions(authClient, gaAccountId, userEmail) {
    const linkId = await this.findUserLinkId(authClient, gaAccountId, userEmail);

    if (linkId) {
      const analytics = google.analytics("v3");
      await analytics.management.accountUserLinks.update({
        auth: authClient,
        accountId: gaAccountId,
        linkId: linkId,
        requestBody: {
          permissions: {
            local: ["MANAGE_USERS", "EDIT", "COLLABORATE", "READ_AND_ANALYZE"],
          },
          userRef: {
            email: userEmail,
          },
        },
      });
    }
  }

  static async removeUser(authClient, gaAccountId, userEmail) {
    try {
      const linkId = await this.findUserLinkId(authClient, gaAccountId, userEmail);

      if (!linkId) {
        return {
          success: false,
          message: `User ${userEmail} not found in GA`,
        };
      }

      const analytics = google.analytics("v3");
      await analytics.management.accountUserLinks.delete({
        auth: authClient,
        accountId: gaAccountId,
        linkId: linkId,
      });

      return {
        success: true,
        message: `User ${userEmail} removed from GA`,
      };
    } catch (error) {
      throw error;
    }
  }

  static async findUserLinkId(authClient, gaAccountId, userEmail) {
    try {
      const analytics = google.analytics("v3");

      const links = await analytics.management.accountUserLinks.list({
        auth: authClient,
        accountId: gaAccountId,
      });

      const userLink = links.data.items?.find((link) => link.userRef.email === userEmail);

      return userLink ? userLink.id : null;
    } catch (error) {
      return null;
    }
  }

  static async findAllUsers(authClient, gaAccountId) {
    const analytics = google.analytics("v3");

    const links = await analytics.management.accountUserLinks.list({
      auth: authClient,
      accountId: gaAccountId,
    });

    return links.data.items || [];
  }
}

module.exports = GAService;
