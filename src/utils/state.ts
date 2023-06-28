export interface IGlobalState {
  adminModeEnabled: boolean;
  searchResult: string;
}

export interface IGlobalStateShape {
  state: IGlobalState;
  setPartialState: ISetPartialState;
  isAdmin: boolean;
}

export type ISetPartialState = (partialState: Partial<IGlobalState>) => void;

export const DEFAULT_STATE: IGlobalState = {
  searchResult: "",
  adminModeEnabled: false,
};
