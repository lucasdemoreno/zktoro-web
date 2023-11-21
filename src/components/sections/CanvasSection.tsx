import { Box } from "@radix-ui/themes";
import styles from "../Canvas/Canvas.module.css";
import { useProgram } from "@/providers/ProgramProvider/ProgramProvider";
import { DraggableStatement, Droppable } from "../Canvas/Blocks";
import {
  Statement,
  StatementType,
} from "@/providers/ProgramProvider/Statements";

function renderStatement(
  statement: Statement,
  index: number,
  nestedLevel: number
): JSX.Element {
  if (
    statement.type == StatementType.SEND ||
    statement.type == StatementType.SWAP
  ) {
    return (
      <DraggableStatement
        key={index}
        statement={statement}
        canRemove
        nestedLevel={nestedLevel}
      />
    );
  }

  if (statement.type == StatementType.IF_ELSE) {
    return (
      <>
        {/* If (condition) */}
        <DraggableStatement
          key={index}
          statement={statement}
          canRemove
          nestedLevel={nestedLevel}
        />
        {statement.data?.ifStatements.map((ifStatement, index) => {
          return renderStatement(ifStatement, index, nestedLevel + 1);
        })}
        <Droppable
          key={`${getDropStatementId(statement.id)}`}
          id={`${getDropStatementId(statement.id)}`}
          nestedLevel={nestedLevel + 1}
        >{`Drop new statement here`}</Droppable>
      </>
    );
  }

  if (statement.type == StatementType.ELSE) {
    return (
      <>
        {/* Else */}
        <DraggableStatement
          key={index}
          statement={statement}
          canRemove
          nestedLevel={nestedLevel}
        />
        {statement.data?.elseStatements.map((elseStatement, index) => {
          return renderStatement(elseStatement, index, nestedLevel + 1);
        })}
        <Droppable
          key={getDropStatementId(statement.id)}
          id={getDropStatementId(statement.id)}
          nestedLevel={nestedLevel + 1}
        >{`Drop new statement here`}</Droppable>
      </>
    );
  }

  return <></>;
}

function getDropStatementId(statementId: string) {
  return `drop/${statementId}`;
}

export const CanvasSection = () => {
  const { statements } = useProgram();

  return (
    <Box className={styles.canvasSection} p="6" grow="1">
      {statements.map((statement, index) => {
        return renderStatement(statement, index, 1);
      })}
      <Droppable
        key={getDropStatementId("main")}
        id={getDropStatementId("main")}
        nestedLevel={1}
      >{`Drop new statement here`}</Droppable>
    </Box>
  );
};
