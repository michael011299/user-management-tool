import { http, HttpResponse } from "msw";
import { mockGAAccountsList, mockGAUserLinks } from "./data/googleAnalytics.mock";
import { mockGTMAccountsList, mockGTMPermissions } from "./data/googleTagManager.mock";
import { mockMigrations } from "./data/migrations.mock";
import { mockCapacityStats } from "./data/capacity.mock";

const API_BASE_URL = "http://localhost:3000/api";

export const handlers = [
  // Migration endpoint
  http.post(`${API_BASE_URL}/migrate`, async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json({
      success: true,
      results: {
        moveId: Math.floor(Math.random() * 10000),
        agencyAccount: "account1@agency.com",
        gtm: {
          add: { success: true, message: "User added successfully" },
          remove: { success: true, message: "User removed successfully" },
        },
        ga: {
          add: { success: true, message: "User added successfully" },
          remove: { success: true, message: "User removed successfully" },
        },
      },
    });
  }),

  // Find endpoint
  http.post(`${API_BASE_URL}/find`, async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json({
      success: true,
      agencyAccount: "account1@agency.com",
      matchedBy: "Account ID",
      users: {
        gtm: [
          { email: "user1@example.com", permission: "edit" },
          { email: "user2@example.com", permission: "read" },
        ],
        ga: [
          { email: "user1@example.com", permissions: ["EDIT", "READ_AND_ANALYZE"] },
          { email: "user2@example.com", permissions: ["READ_AND_ANALYZE"] },
        ],
      },
    });
  }),

  // Get migration history
  http.get(`${API_BASE_URL}/migrations`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");

    return HttpResponse.json({
      success: true,
      data: mockMigrations.slice(0, limit),
    });
  }),

  // Get migration by ID
  http.get(`${API_BASE_URL}/migrations/:id`, ({ params }) => {
    const { id } = params;
    const migration = mockMigrations.find((m) => m.move_id === Number(id));

    if (!migration) {
      return HttpResponse.json({ success: false, error: "Migration not found" }, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      data: migration,
    });
  }),

  // Get capacity stats
  http.get(`${API_BASE_URL}/accounts/stats`, () => {
    return HttpResponse.json(mockCapacityStats);
  }),

  // Google Analytics accounts
  http.get("https://www.googleapis.com/analytics/v3/management/accounts", () => {
    return HttpResponse.json(mockGAAccountsList);
  }),

  // Google Analytics user links
  http.get("https://www.googleapis.com/analytics/v3/management/accounts/:accountId/entityUserLinks", () => {
    return HttpResponse.json(mockGAUserLinks);
  }),

  // Google Tag Manager accounts
  http.get("https://www.googleapis.com/tagmanager/v2/accounts", () => {
    return HttpResponse.json(mockGTMAccountsList);
  }),

  // Google Tag Manager permissions
  http.get("https://tagmanager.google.com/tagmanager/web/accounts/:accountId/permissions", () => {
    return HttpResponse.json(mockGTMPermissions);
  }),
];
