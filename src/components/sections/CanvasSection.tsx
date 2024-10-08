import { Box, Text } from "@radix-ui/themes";
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
          key={`${getDropStatementId(statement.id, nestedLevel)}`}
          id={`${getDropStatementId(statement.id, nestedLevel)}`}
          nestedLevel={nestedLevel + 1}
        >
          <Text size="2">Drop here</Text>
        </Droppable>
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
          key={getDropStatementId(statement.id, nestedLevel)}
          id={getDropStatementId(statement.id, nestedLevel)}
          nestedLevel={nestedLevel + 1}
        >
          <Text size="2">Drop here</Text>
        </Droppable>
      </>
    );
  }

  return <></>;
}

function getDropStatementId(statementId: string, nestedLevel: number) {
  const drops = new Array(nestedLevel).fill("drop").join("/");
  return `${drops}/${statementId}`;
}

export const CanvasSection = () => {
  const { statements } = useProgram();

  return (
    <Box className={styles.canvasSection} p="6" grow="1">
      {statements.map((statement, index) => {
        return renderStatement(statement, index, 1);
      })}
      <Droppable
        key={getDropStatementId("main", 1)}
        id={getDropStatementId("main", 1)}
        nestedLevel={1}
      >
        <Text size="2">Drop here</Text>
      </Droppable>
    </Box>
  );
};
