import app from "./app";
import { logger } from "../src/libs/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
