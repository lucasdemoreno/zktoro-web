import styles from "./Canvas.module.css";
import { Box } from "@radix-ui/themes";

export const Canvas = () => {
  return (
    <Box p="4" className={styles.canvasContainer}>
      <Box className={styles.canvas}>Drag and Drop area</Box>
    </Box>
  );
};
