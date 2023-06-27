import { useSession } from "next-auth/react";
import * as React from "react";
import {
  DEFAULT_STATE,
  type IGlobalState,
  type IGlobalStateShape,
  type ISetPartialState,
} from "~/utils/state";

const StateContext = React.createContext<IGlobalStateShape | null>(null);

export const StateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = React.useState<IGlobalState>({ ...DEFAULT_STATE });
  const { data: session } = useSession();

  const isAdmin = React.useMemo(() => {
    if (session == null) {
      return false;
    }

    return session.user.role === "ADMIN";
  }, [session]);

  const setPartialState: ISetPartialState = React.useCallback(
    (partialState) => {
      setState((prevState) => {
        const newState = {
          ...prevState,
          ...partialState,
        };
        return newState;
      });
    },
    []
  );

  return (
    <StateContext.Provider value={{ state, setPartialState, isAdmin }}>
      {children}
    </StateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = React.useContext(StateContext);
  if (context == null) {
    throw new Error("context was not initialised");
  }
  return context;
};
