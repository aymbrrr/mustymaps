/**
 * Navigation type definitions.
 * Import these in screens to get typed navigation props.
 */

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type AppTabParamList = {
  Map: undefined;
  Profile: undefined;
};

export type AppRootParamList = {
  MainTabs: undefined;
  Report: { locationId: string; locationName: string };
  LocationDetail: { locationId: string; locationName: string };
};
