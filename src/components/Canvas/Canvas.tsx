"use client";

import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
} from "@dnd-kit/core";
import styles from "./Canvas.module.css";
import { Box, Flex } from "@radix-ui/themes";
import { PropsWithChildren, useCallback } from "react";
import { PreviewSection } from "../sections/PreviewSection";
import { SaveSection } from "../sections/SaveSection";
import { ConfigurationSection } from "../sections/ConfigurationSection";
import { v4 as uuidv4 } from "uuid";

import {
  ProgramProvider,
  useProgram,
} from "@/providers/ProgramProvider/ProgramProvider";
import { isEventStatement } from "@/providers/ProgramProvider/Statements";
import { ModulesSection } from "../sections/ModulesSection";
import { CanvasSection } from "../sections/CanvasSection";

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
  const { onStatementsAdded } = useProgram();
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
      // Any drop area, main level or nested level

      if (typeof over?.id === "string" && over?.id?.startsWith("drop/")) {
        onStatementsAdded({ ...draggedStatement, id: uuidv4() }, over.id);
      }
    },
    [onStatementsAdded]
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={[mouseSensor, touchSensor]}>
      {children}
    </DndContext>
  );
};
