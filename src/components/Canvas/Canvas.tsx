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
import { Box, Button, Flex } from "@radix-ui/themes";
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import { StrategyConfiguration } from "@/app/workspace/page";

type CanvasProps = {
  configuration: StrategyConfiguration;
  setConfiguration: (config: StrategyConfiguration) => void;
};

export const Canvas = (props: CanvasProps) => {
  const { configuration, setConfiguration } = props;
  return (
    <Box p="4" className={styles.canvasContainer}>
      <Flex className={styles.canvas} direction="column">
        <Flex className={styles.canvas} direction="row">
          <ModulesSection />
          <CanvasSection />
          <ConfigurationSection
            configuration={configuration}
            setConfiguration={setConfiguration}
          />
        </Flex>
        <Flex>
          <SaveSection />
        </Flex>
      </Flex>
    </Box>
  );
};

const SaveSection = () => {
  return (
    <Box p="4" grow="1">
      <Flex className={styles.saveSection} p="6" direction="column" gap="4">
        <Box className="">
          <BackTestingChart></BackTestingChart>
        </Box>
        <Box>
          <Button>Save</Button>
        </Box>
      </Flex>
    </Box>
  );
};

const BackTestingChart = () => {
  return (
    <Box className={styles.backTestingChart} p="4" grow="1">
      <Flex direction="column" align="center">
        Backtesting chart
      </Flex>
    </Box>
  );
};

type ConfigurationSectionProps = {
  configuration: StrategyConfiguration;
  setConfiguration: (config: StrategyConfiguration) => void;
};

const ConfigurationSection = (props: ConfigurationSectionProps) => {
  return (
    <Box p="4">
      <Flex
        className={styles.configurationSection}
        p="6"
        direction="column"
        gap="4"
      >
        <Button>Configuration 1</Button>
        <Button>Configuration 2</Button>
        <Button>Configuration 3</Button>
        <Button>Configuration 4</Button>
        <Button>Configuration 5</Button>
      </Flex>
    </Box>
  );
};

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

/**
 * Example brought from
 * https://github.com/clauderic/dnd-kit
 * storybooks
 */
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
