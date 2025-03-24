export const ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  SERVICE_DETAILS: (id: string) => `/services/${id}`,
  BOOKING: "/bookings",
  DASHBOARD: "/dashboard",
  AUTH: {
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/dashboard/reset-password",
  },
  PROVIDERS: {
    SIGN_UP: "/providers/sign-up",
    HOW_IT_WORKS: "/providers/how-it-works",
    RESOURCES: "/providers/resources",
    SUCCESS_STORIES: "/providers/success-stories",
  },
  LOCATIONS: (city: string) =>
    `/locations/${city.toLowerCase().replace(" ", "-")}`,
};
