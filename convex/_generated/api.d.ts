/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as appointments from "../appointments.js";
import type * as auth from "../auth.js";
import type * as authActions from "../authActions.js";
import type * as businesses from "../businesses.js";
import type * as clients from "../clients.js";
import type * as email from "../email.js";
import type * as feedback from "../feedback.js";
import type * as http from "../http.js";
import type * as notifications from "../notifications.js";
import type * as otpActions from "../otpActions.js";
import type * as otps from "../otps.js";
import type * as services from "../services.js";
import type * as staff from "../staff.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  appointments: typeof appointments;
  auth: typeof auth;
  authActions: typeof authActions;
  businesses: typeof businesses;
  clients: typeof clients;
  email: typeof email;
  feedback: typeof feedback;
  http: typeof http;
  notifications: typeof notifications;
  otpActions: typeof otpActions;
  otps: typeof otps;
  services: typeof services;
  staff: typeof staff;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
