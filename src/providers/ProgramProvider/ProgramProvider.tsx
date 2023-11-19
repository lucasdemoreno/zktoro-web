import { PropsWithChildren, createContext, useContext, useState } from "react";

type ProgramContextValue = {
  statements: Statement[];
  onStatementsChange: (statements: Statement[]) => void;
};

export type Statement = {
  type: StatementType;
  data: any; // it will be depending on each type of statement.
};

export enum StatementType {
  SEND = "SEND",
  SWAP = "SWAP",
  IF_ELSE = "IF_ELSE",
}

export const ProgramProvider = ({ children }: PropsWithChildren) => {
  const [statements, setStatements] = useState<Statement[]>([]);

  const onStatementsChange = (statements: Statement[]) => {
    setStatements(statements);
  };

  return (
    <ProgramContext.Provider
      value={{
        statements,
        onStatementsChange,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const ProgramContext = createContext<ProgramContextValue>({
  statements: [],
  onStatementsChange: () => {},
});

export function useProgram() {
  return useContext(ProgramContext);
}
