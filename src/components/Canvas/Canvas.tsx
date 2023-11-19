"use client";

import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import styles from "./Canvas.module.css";
import { Badge, Box, Button, Flex } from "@radix-ui/themes";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { PreviewSection } from "../sections/PreviewSection";
import { SaveSection } from "../sections/SaveSection";
import { ConfigurationSection } from "../sections/ConfigurationSection";
import {
  ProgramProvider,
  StatementType,
  useProgram,
} from "@/providers/ProgramProvider/ProgramProvider";

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
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over, active } = event;
      const draggedStatement = active.data.current;
      if (over?.id === "new-statement" && draggedStatement) {
        // We need more state in the statement for later.
        // The swap statement needs to know which tokens are being swapped.
        onStatementsChange([
          ...statements,
          { type: draggedStatement.type, data: draggedStatement.data },
        ]);
      }
    },
    [statements, onStatementsChange]
  );

  return <DndContext onDragEnd={handleDragEnd}>{children}</DndContext>;
};

// For now this stays here until I see how drag and drop works properly.
const ModulesSection = () => {
  return (
    <Box p="4">
      <Flex className={styles.modulesSection} p="4" direction="column" gap="4">
        <Draggable id="send" type={StatementType.SEND}>
          Send
        </Draggable>
        <Draggable id="swap" type={StatementType.SWAP}>
          Swap
        </Draggable>
        <Draggable id="if/else" type={StatementType.IF_ELSE}>
          If / Else
        </Draggable>
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
          <Draggable
            key={index}
            id={`${index}-${statement.type}`}
            type={statement.type}
          >
            {statement.type}
          </Draggable>
        );
      })}
      <Droppable id="new-statement">{`Drop new statement here`}</Droppable>
    </Box>
  );
};

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

const Draggable = ({
  children,
  id,
  type,
}: PropsWithChildren<{ id: string; type: StatementType }>) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      type,
    },
  });

  // Might be a problem performance-wise.
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

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
        {children}
      </Badge>
    </Box>
  );
};
