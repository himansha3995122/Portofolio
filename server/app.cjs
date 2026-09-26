// Startup file for cPanel's "Setup Node.js App" (Phusion Passenger).
// Passenger loads the startup file with require(), which can't load the
// ES-module entry point directly — so this CommonJS shim imports it.
// Passenger takes over app.listen(), so the PORT value doesn't matter there.
import("./src/index.js").catch((err) => {
  console.error(err);
  process.exit(1);
});
