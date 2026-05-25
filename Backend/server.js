import config from "./src/config/config.js";
import { server } from "./src/app/index.js";
import connectToDB from "./src/config/db.js";
import { initializeSocket } from "./src/sockets/socketManager.js";

server.listen(config.PORT, async () => {
  await connectToDB();

  const io = initializeSocket(server);
  
  console.log(`Server and WebSockets are running on port ${config.PORT}`);
});
