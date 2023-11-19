"use client";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
} from "@dnd-kit/core";
import styles from "./Canvas.module.css";
import { Badge, Box, Button, Flex } from "@radix-ui/themes";
import { CSSProperties, PropsWithChildren, useCallback } from "react";
import { PreviewSection } from "../sections/PreviewSection";
import { SaveSection } from "../sections/SaveSection";
import { ConfigurationSection } from "../sections/ConfigurationSection";
import { v4 as uuidv4 } from "uuid";

import {
  ProgramProvider,
  useProgram,
} from "@/providers/ProgramProvider/ProgramProvider";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  IfElseStatement,
  SendStatement,
  Statement,
  StatementType,
  SwapStatement,
  emptyIfElseStatement,
  emptySendStatement,
  emptySwapStatement,
  isEventStatement,
} from "@/providers/ProgramProvider/Statements";

export const Canvas = () => {
  return (
    <Box p="4" className={styles.canvasContainer}>
      <Flex className={styles.canvas} direction="column">
        <Flex direction="row">
          <ProgramProvider>
            <DndArea>
              <ModulesSection />
              <CanvasSection />
            </DndArea>
          </ProgramProvider>
          <ConfigurationSection />
        </Flex>
        <Flex direction="column">
          <PreviewSection />
          <SaveSection />
        </Flex>
      </Flex>
    </Box>
  );
};

const DndArea = ({ children }: PropsWithChildren<{}>) => {
  const { statements, onStatementsChange } = useProgram();
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over, active } = event;
      if (!isEventStatement(active.data.current)) {
        return;
      }

      const draggedStatement = active.data.current;
      // If we are dropping a statement inside the drop area
      if (over?.id === DROP_NEW_STATEMENT_ID) {
        onStatementsChange([
          ...statements,
          { ...draggedStatement, id: uuidv4() },
        ]);
      }
    },
    [statements, onStatementsChange]
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={[mouseSensor, touchSensor]}>
      {children}
    </DndContext>
  );
};

// For now this stays here until I see how drag and drop works properly.
const ModulesSection = () => {
  return (
    <Box p="4">
      <Flex className={styles.modulesSection} p="4" direction="column" gap="4">
        <DraggableStatement statement={emptySendStatement} />
        <DraggableStatement statement={emptySwapStatement} />
        <DraggableStatement statement={emptyIfElseStatement} />
      </Flex>
    </Box>
  );
};

// For now this stays here until I see how drag and drop works properly.
const CanvasSection = () => {
  const { statements } = useProgram();

  return (
    <Box className={styles.canvasSection} p="6" grow="1">
      {statements.map((statement, index) => {
        return (
          <DraggableStatement
            key={index}
            statement={statement}
            canRemove
          ></DraggableStatement>
        );
      })}
      <Droppable
        id={DROP_NEW_STATEMENT_ID}
      >{`Drop new statement here`}</Droppable>
    </Box>
  );
};

const DROP_NEW_STATEMENT_ID = "new-statement";

const Droppable = ({ children, id }: PropsWithChildren<{ id: string }>) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <Box m="2">
      <Box
        ref={setNodeRef}
        style={style}
        className={styles.droppable}
        display="inline-block"
        p="4"
      >
        {children}
      </Box>
    </Box>
  );
};

type DraggableStatementProps = {
  statement: Statement;
  canRemove?: boolean;
};

function getTranslateValue(
  transform: { x: number; y: number } | null
): CSSProperties | undefined {
  return transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
}

const DraggableStatement = ({
  statement,
  canRemove = false,
}: PropsWithChildren<DraggableStatementProps>) => {
  const { onStatementRemove } = useProgram();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: statement.id,
    data: statement,
  });

  const handleRemove = useCallback(() => {
    onStatementRemove(statement);
  }, [onStatementRemove, statement]);
  const style = getTranslateValue(transform);

  return (
    <Box m="2">
      <Badge
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={styles.draggable}
        variant="solid"
        size="2"
      >
        {statement.label}
        {canRemove && (
          <Button
            onClick={handleRemove}
            className={styles.removeButton}
            variant="soft"
          >
            <TrashIcon />
          </Button>
        )}
      </Badge>
    </Box>
  );
};
