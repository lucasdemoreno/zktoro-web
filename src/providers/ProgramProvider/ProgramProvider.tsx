import { v4 as uuidv4 } from "uuid";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ComparisonOperator,
  ElseStatement,
  IfElseStatement,
  SendStatement,
  Statement,
  StatementType,
  SwapStatement,
} from "./Statements";
import { Optimism, Polygon, USDC_Optimism, WETH_Optimism } from "./Tokens";

type ProgramContextValue = {
  statements: Statement[];
  onStatementsAdded: (statement: Statement, parentId: string) => void;
  onStatementRemove: (statement: Statement) => void;
  onStatementUpdate: (statement: Statement) => void;
};

function createStatementsFromDropped(statement: Statement): Statement[] {
  if (statement.type === StatementType.SWAP) {
    const swapStatement: SwapStatement = {
      ...statement,
      data: {
        ...statement.data,
        from: USDC_Optimism,
        to: WETH_Optimism,
        chain: Optimism,
        amount: "1",
      },
    };
    return [swapStatement];
  }

  if (statement.type === StatementType.SEND) {
    const sendStatement: SendStatement = {
      ...statement,
      data: {
        ...statement.data,
        token: WETH_Optimism,
        to: Optimism,
        from: Polygon,
        amount: "1",
      },
    };
    return [sendStatement];
  }

  if (statement.type !== StatementType.IF_ELSE) {
    console.error("Not supported statement type", statement.type);
    return [];
  }

  // When droping an if else statement, we need to create an else statement
  const elseStatement: ElseStatement = {
    type: StatementType.ELSE,
    label: "Else",
    id: uuidv4(),
    data: {
      ifStatement: statement,
      elseStatements: [],
    },
  };
  // and also referencing each other
  const ifStatement: IfElseStatement = {
    ...statement,
    label: "If",
    data: {
      ...statement.data,
      ifStatements: [],
      condition: {
        left: "2",
        right: "1",
        operator: ComparisonOperator.GREATER_THAN,
      },
      elseStatement,
    },
  };

  return [ifStatement, elseStatement];
}

/**
 *
 * @param statement node from where to remove the statmentId
 * @param statementId sentence to remove
 */
function findAndRemoveNodeWithStatementId(
  statement: Statement,
  statementId: string
): void {
  if (statement.type === StatementType.IF_ELSE) {
    const found = statement.data?.ifStatements.find(
      (s) => s.id !== statement.id
    );
    if (found && statement.data) {
      const newStatements = getFilteredStatements(
        statement.data.ifStatements,
        statementId
      );
      statement.data.ifStatements = newStatements;
      return;
    }
    statement.data?.ifStatements.forEach((s) =>
      findAndRemoveNodeWithStatementId(s, statementId)
    );
    return;
  }
  if (statement.type === StatementType.ELSE) {
    const found = statement.data?.elseStatements.find(
      (s) => s.id !== statement.id
    );
    if (found && statement.data) {
      statement.data.elseStatements = getFilteredStatements(
        statement.data.elseStatements,
        statementId
      );
      return;
    }
    statement.data?.elseStatements.forEach((s) =>
      findAndRemoveNodeWithStatementId(s, statementId)
    );
    return;
  }
  return;
}

function getFilteredStatements(
  statements: Statement[],
  statementId: string
): Statement[] {
  let ifStatementFromFilteredElse: IfElseStatement | undefined;
  let elseStatementFromFilteredIf: ElseStatement | undefined;
  const filtered = statements.filter((s) => {
    if (s.type === StatementType.IF_ELSE && s.id == statementId) {
      elseStatementFromFilteredIf = s.data?.elseStatement || undefined;
    }
    // If I delete an if statement, I also need to delete the else statement
    if (s.type === StatementType.ELSE && s.id === statementId) {
      ifStatementFromFilteredElse = s.data?.ifStatement || undefined;
    }
    if (elseStatementFromFilteredIf) {
      return s.id !== statementId && s.id !== elseStatementFromFilteredIf.id;
    }
    return s.id !== statementId;
  });

  // If I delete an else statement, I need to remove the reference from the if statement
  if (ifStatementFromFilteredElse?.data) {
    ifStatementFromFilteredElse.data.elseStatement = null;
  }

  return filtered;
}

function recursiveFind(
  statement: Statement,
  statementId: string
): Statement | undefined {
  if (statement.id === statementId) {
    return statement;
  }
  if (statement.type === StatementType.IF_ELSE) {
    let found = statement.data?.ifStatements.find((s) => s.id === statementId);
    if (found) {
      return found;
    }

    statement.data?.ifStatements.forEach((s) => {
      if (found) return;
      const maybeFound = recursiveFind(s, statementId);
      if (maybeFound) {
        found = maybeFound;
      }
    });

    if (found) {
      return found;
    }
  }

  if (statement.type === StatementType.ELSE) {
    let found = statement.data?.elseStatements.find(
      (s) => s.id === statementId
    );
    if (found) {
      return found;
    }

    statement.data?.elseStatements.forEach((s) => {
      if (found) return;
      const maybeFound = recursiveFind(s, statementId);
      if (maybeFound) {
        found = maybeFound;
      }
    });

    if (found) {
      return found;
    }
  }
  return statement;
}

export const ProgramProvider = ({ children }: PropsWithChildren) => {
  const [statements, setStatements] = useState<Statement[]>([]);

  const onStatementRemove = (statement: Statement) => {
    const found = statements.find((s) => s.id === statement.id);
    // Top level search.
    if (found) {
      const newStatements = getFilteredStatements(statements, statement.id);
      setStatements(newStatements);
      return;
    }
    statements.forEach((s) =>
      findAndRemoveNodeWithStatementId(s, statement.id)
    );

    // just to trigger a rerender
    setStatements(statements.concat([]));
  };

  // There is a bug here somewhere adding nested statements
  const onStatementsAdded = (statement: Statement, dropId: string) => {
    // The split can give multiple items in the array.
    // If the added statement is inside a nested if else, won't work
    const [_drop, parentId] = dropId.split("/");
    const newStatements = createStatementsFromDropped(statement);
    if (parentId === "main") {
      setStatements(statements.concat(newStatements));
      return;
    }

    const parentStatement = statements.find((s) => s.id === parentId);
    if (
      parentStatement?.type === StatementType.IF_ELSE &&
      parentStatement.data
    ) {
      parentStatement.data.ifStatements =
        parentStatement.data?.ifStatements.concat(newStatements);
    }
    if (parentStatement?.type === StatementType.ELSE && parentStatement.data) {
      parentStatement.data.elseStatements =
        parentStatement.data?.elseStatements.concat(newStatements);
    }
    setStatements(statements.concat([]));
  };

  const onStatementUpdate = (statement: Statement) => {
    let found: Statement | undefined;
    statements.forEach((s) => {
      if (found) return;
      const maybeFound = recursiveFind(s, statement.id);
      if (maybeFound) {
        found = maybeFound;
      }
    });
    if (found) {
      found.label = statement.label;
      found.data = statement.data;
    }
    setStatements(statements.concat([]));
  };

  useEffect(() => {
    console.log("Statements", statements);
  }, [statements]);

  return (
    <ProgramContext.Provider
      value={{
        statements,
        onStatementsAdded,
        onStatementRemove,
        onStatementUpdate,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};

export const ProgramContext = createContext<ProgramContextValue>({
  statements: [],
  onStatementsAdded: () => {},
  onStatementRemove: () => {},
  onStatementUpdate: () => {},
});

export function useProgram() {
  return useContext(ProgramContext);
}
