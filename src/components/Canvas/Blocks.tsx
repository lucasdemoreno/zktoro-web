"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import styles from "./Canvas.module.css";
import { Badge, Box, Button } from "@radix-ui/themes";
import { PropsWithChildren, useCallback } from "react";

import { useProgram } from "@/providers/ProgramProvider/ProgramProvider";
import { TrashIcon } from "@radix-ui/react-icons";
import { Statement } from "@/providers/ProgramProvider/Statements";

export const Droppable = ({
  children,
  id,
  nestedLevel = 0,
}: PropsWithChildren<{ id: string; nestedLevel?: number }>) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  const marginLeft = nestedLevel * 20;
  const style = {
    marginLeft: marginLeft,
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
  nestedLevel?: number;
};

function getTranslateValue(
  transform: { x: number; y: number } | null
): string | undefined {
  return transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined;
}

export const DraggableStatement = ({
  statement,
  canRemove = false,
  nestedLevel = 0,
}: PropsWithChildren<DraggableStatementProps>) => {
  const { onStatementRemove } = useProgram();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: statement.id,
    data: statement,
  });

  const handleRemove = useCallback(() => {
    onStatementRemove(statement);
  }, [onStatementRemove, statement]);
  const transformValue = getTranslateValue(transform);
  const marginLeft = nestedLevel * 20;
  const style = {
    transform: transformValue,
    marginLeft: marginLeft,
  };

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
