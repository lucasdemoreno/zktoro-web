import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Statement } from "./Statements";

type ProgramContextValue = {
  statements: Statement[];
  onStatementsChange: (statements: Statement[]) => void;
  onStatementRemove: (statement: Statement) => void;
};

export const ProgramProvider = ({ children }: PropsWithChildren) => {
  const [statements, setStatements] = useState<Statement[]>([]);
  const onStatementRemove = (statement: Statement) => {
    setStatements(statements.filter((s) => s.id !== statement.id));
  };

  const onStatementsChange = (statements: Statement[]) => {
    setStatements(statements);
  };

  return (
    <ProgramContext.Provider
      value={{
        statements,
        onStatementsChange,
        onStatementRemove,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const ProgramContext = createContext<ProgramContextValue>({
  statements: [],
  onStatementsChange: () => {},
  onStatementRemove: () => {},
});

export function useProgram() {
  return useContext(ProgramContext);
}
