"use client"
import type { BlogTypeKeyLIteralType } from "@/types";
import { ReactNode, createContext, useContext, useReducer, type Dispatch } from "react";

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

// Provider外での誤用を実行時に検出できるよう、初期値は型偽装({} as ...)ではなくnullにする
const GlobalContext = createContext<GlobalContextType | null>(null)

/**
 * GlobalContextを安全に参照するフック。Provider外で呼ばれた場合は明確なエラーを投げる
 */
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error("useGlobalContextはGlobalStateProviderの内側で使用してください")
  }
  return context
}

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