import database from "infra/database.js";

async function status(request, response) {
  // Controller
  const updatedAt = new Date().toISOString();

  // max connections
  const maxConnectionsResult = await database.query("show max_connections");
  const maxConnections = parseInt(maxConnectionsResult.rows[0].max_connections);

  // activeConnections
  const databaseName = process.env.POSTGRES_DB;
  const activeConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const activeConnections = activeConnectionsResult.rows[0].count;

  // postgres version
  const postgresVersionResult = await database.query("SHOW server_version");
  const postgresVersion = String(postgresVersionResult.rows[0].server_version);

  // View
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_version: postgresVersion,
        max_connections: maxConnections,
        active_connections: activeConnections,
      },
    },
  });
}

export default status;
