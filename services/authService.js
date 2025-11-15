const { google } = require("googleapis");
const { AGENCY_ACCOUNTS, OFFBOARD_ACCOUNT } = require("../config/accounts");

class AuthService {
  static getAuthClient(email) {
    const account = AGENCY_ACCOUNTS[email];

    if (!account) {
      throw new Error(`No credentials found for email: ${email}`);
    }

    const oauth2Client = new google.auth.OAuth2(account.clientId, account.clientSecret, process.env.REDIRECT_URI);

    oauth2Client.setCredentials({
      refresh_token: account.refreshToken,
    });

    return oauth2Client;
  }

  static getOffboardAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
      OFFBOARD_ACCOUNT.clientId,
      OFFBOARD_ACCOUNT.clientSecret,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: OFFBOARD_ACCOUNT.refreshToken,
    });

    return oauth2Client;
  }

  static async findAccountWithAccess(gtmAccountId, gaAccountId) {
    const emails = Object.keys(AGENCY_ACCOUNTS);

    for (const email of emails) {
      try {
        const authClient = this.getAuthClient(email);

        if (gtmAccountId) {
          const tagmanager = google.tagmanager("v2");
          await tagmanager.accounts.get({
            auth: authClient,
            path: `accounts/${gtmAccountId}`,
          });
          return email;
        }

        if (gaAccountId) {
          const analytics = google.analytics("v3");
          await analytics.management.accounts.get({
            auth: authClient,
            accountId: gaAccountId,
          });
          return email;
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error("No account found with access to the specified resources");
  }

  static async findAccountByClientName(clientName, gtmAccountId, gaAccountId) {
    const emails = Object.keys(AGENCY_ACCOUNTS);
    const normalizedClientName = clientName.toLowerCase().trim();

    for (const email of emails) {
      try {
        const authClient = this.getAuthClient(email);

        // Search through GTM accounts
        if (gtmAccountId || !gaAccountId) {
          try {
            const tagmanager = google.tagmanager("v2");
            const accounts = await tagmanager.accounts.list({
              auth: authClient,
            });

            if (accounts.data.account) {
              for (const account of accounts.data.account) {
                const accountName = account.name.toLowerCase();

                // Check if client name is in the account name
                if (accountName.includes(normalizedClientName)) {
                  // If specific GTM ID provided, verify it matches
                  if (gtmAccountId && account.accountId !== gtmAccountId) {
                    continue;
                  }
                  return { email, accountId: account.accountId };
                }
              }
            }
          } catch (error) {
            console.log(`GTM search error for ${email}:`, error.message);
          }
        }

        // Search through GA accounts
        if (gaAccountId || !gtmAccountId) {
          try {
            const analytics = google.analytics("v3");
            const accounts = await analytics.management.accounts.list({
              auth: authClient,
            });

            if (accounts.data.items) {
              for (const account of accounts.data.items) {
                const accountName = account.name.toLowerCase();

                // Check if client name is in the account name
                if (accountName.includes(normalizedClientName)) {
                  // If specific GA ID provided, verify it matches
                  if (gaAccountId && account.id !== gaAccountId) {
                    continue;
                  }
                  return { email, accountId: account.id };
                }
              }
            }
          } catch (error) {
            console.log(`GA search error for ${email}:`, error.message);
          }
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error(`No account found matching client name: ${clientName}`);
  }

  static getAllAccountEmails() {
    return Object.keys(AGENCY_ACCOUNTS);
  }

  static getOffboardEmail() {
    return OFFBOARD_ACCOUNT.email;
  }
}

module.exports = AuthService;
