"use client"
import type { BlogTypeKeyLIteralType } from "@/types";
import { ReactNode, createContext, useReducer, type Dispatch } from "react";

export type GlobalState = {
  blogType: BlogTypeKeyLIteralType
}

export type Action = {
  type: "SET_BLOG_TYPE";
  payload: {
    blogType: GlobalState["blogType"];
  }
}

export type GlobalContextType = {
  state: GlobalState;
  dispatch: Dispatch<Action>;
}

export const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType)

const initialState: GlobalState = {
  blogType: "blogs"
}

export const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case "SET_BLOG_TYPE":
      return {
        ...state,
        blogType: action.payload.blogType
      }
    default:
      return state;
  }
}

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}