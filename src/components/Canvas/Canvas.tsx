"use client";

import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import styles from "./Canvas.module.css";
import { Box, Button, Flex } from "@radix-ui/themes";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { PreviewSection } from "../sections/PreviewSection";
import { SaveSection } from "../sections/SaveSection";
import { ConfigurationSection } from "../sections/ConfigurationSection";

export const Canvas = () => {
  return (
    <Box p="4" className={styles.canvasContainer}>
      <Flex className={styles.canvas} direction="column">
        <Flex direction="row">
          <ModulesSection />
          <CanvasSection />
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

// For now this stays here until I see how drag and drop works properly.
const ModulesSection = () => {
  return (
    <Box p="4">
      <Flex className={styles.modulesSection} p="6" direction="column" gap="4">
        <Button>Module 1</Button>
        <Button>Module 2</Button>
        <Button>Module 3</Button>
        <Button>Module 4</Button>
        <Button>Module 5</Button>
      </Flex>
    </Box>
  );
};

// For now this stays here until I see how drag and drop works properly.
const CanvasSection = () => {
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
      <Box className={styles.canvasSection} p="6" grow="1">
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
      p="2"
      display="inline-block"
      m="2"
    >
      <Flex justify="center" align="center">
        {children}
      </Flex>
    </Box>
  );
};
