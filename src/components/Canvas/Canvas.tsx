"use client";

import {
  DndContext,
  DragEndEvent,
  Over,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import styles from "./Canvas.module.css";
import { Box, Flex } from "@radix-ui/themes";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";

export const Canvas = () => {
  return (
    <Box p="4" className={styles.canvasContainer}>
      <Box className={styles.canvas}>
        <CanvasArea />
      </Box>
    </Box>
  );
};

/**
 * Example brought from
 * https://github.com/clauderic/dnd-kit
 * storybooks
 */
const CanvasArea = () => {
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const draggableBox = useMemo(
    () => <Draggable id="draggable">Drag me</Draggable>,
    []
  );
  const droppableIds = ["A", "B", "C"];

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { over } = event;
    if (over) {
      setParent(over.id);
    } else {
      setParent(null);
    }
  }, []);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box className={styles.canvasArea} p="6">
        {/* The box was not dropped in any container */}
        {parent === null ? draggableBox : null}
        {droppableIds.map((id) => {
          return (
            <Droppable key={id} id={id}>
              {parent === id ? draggableBox : `${id} - Drop here`}
            </Droppable>
          );
        })}
      </Box>
    </DndContext>
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
    <Box
      ref={setNodeRef}
      style={style}
      className={styles.droppable}
      p="3"
      m="6"
    >
      <Flex justify="center" align="center" shrink="0">
        {children}
      </Flex>
    </Box>
  );
};

const Draggable = ({ children, id }: PropsWithChildren<{ id: string }>) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  // Might be a problem performance-wise.
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={styles.draggable}
      p="3"
      display="inline-block"
      m="6"
    >
      <Flex justify="center" align="center">
        {children}
      </Flex>
    </Box>
  );
};
