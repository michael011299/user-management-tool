// Based on official Google Tag Manager API v2
// Reference: https://developers.google.com/tag-platform/tag-manager/api/v2

export const mockGTMAccountsList = {
  account: [
    {
      path: "accounts/6000000001",
      accountId: "6000000001",
      name: "Acme Corporation",
      shareData: false,
      fingerprint: "1699876543210",
      tagManagerUrl: "https://tagmanager.google.com/#/container/accounts/6000000001",
    },
    {
      path: "accounts/6000000002",
      accountId: "6000000002",
      name: "Beta Industries",
      shareData: true,
      fingerprint: "1699876543211",
      tagManagerUrl: "https://tagmanager.google.com/#/container/accounts/6000000002",
    },
    {
      path: "accounts/6000000003",
      accountId: "6000000003",
      name: "Gamma Services",
      shareData: false,
      fingerprint: "1699876543212",
      tagManagerUrl: "https://tagmanager.google.com/#/container/accounts/6000000003",
    },
  ],
  nextPageToken: "",
};

export const mockGTMPermissions = {
  accountAccess: [
    {
      permission: "manage",
      accountId: "6000000001",
      emailAddress: "admin@acme.com",
    },
    {
      permission: "edit",
      accountId: "6000000001",
      emailAddress: "editor@acme.com",
    },
    {
      permission: "read",
      accountId: "6000000001",
      emailAddress: "viewer@acme.com",
    },
    {
      permission: "manage",
      accountId: "6000000001",
      emailAddress: "account1@agency.com",
    },
  ],
};

export const mockGTMContainers = {
  container: [
    {
      path: "accounts/6000000001/containers/12345678",
      accountId: "6000000001",
      containerId: "12345678",
      name: "Acme Website",
      publicId: "GTM-XXXXXX",
      usageContext: ["web"],
      fingerprint: "1699876543213",
      tagManagerUrl: "https://tagmanager.google.com/#/container/accounts/6000000001/containers/12345678",
      features: {
        supportUserPermissions: true,
        supportEnvironments: true,
        supportWorkspaces: true,
        supportGtagConfigs: true,
        supportBuiltInVariables: true,
        supportClients: true,
        supportFolders: true,
        supportTags: true,
        supportTemplates: true,
        supportTriggers: true,
        supportVariables: true,
        supportVersions: true,
        supportZones: true,
      },
    },
  ],
};
