import { createAction } from "@ngrx/store";

export const enter = createAction('[Auth User] Enter');
export const logIn = createAction('[Auth User] Login');
export const logOut = createAction('[Auth User] Logout');