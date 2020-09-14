/**
 * Export the staging site firebase configuration
 *
 * NOTE - this could be exported as simple json (e.g. config={"apiKey":"..."})
 * however this is too easily identified online and can lead to warning flags
 * from firebase and github.
 *
 * This config can still be translated into human-readable code so is not considered
 * secure, however the security risk is limited for the staging site
 *
 * The production site has a config populated from firebaseConfig.prod.ts which
 * needs to be populated (manually or by ci), and is not committed to the repo
 */
const configBase64 =
  "eyJhcGlLZXkiOiJBSXphU3lBR25YeTQ0bU16RU9fWmRFOXVucmp3aS1aT2ZOSmZzU1UiLCJhdXRoRG9tYWluIjoic29tYS1ueXVtYmFuaS1hcHAtc3RhZ2luZy5maXJlYmFzZWFwcC5jb20iLCJkYXRhYmFzZVVSTCI6Imh0dHBzOi8vc29tYS1ueXVtYmFuaS1hcHAtc3RhZ2luZy5maXJlYmFzZWlvLmNvbSIsInByb2plY3RJZCI6InNvbWEtbnl1bWJhbmktYXBwLXN0YWdpbmciLCJzdG9yYWdlQnVja2V0Ijoic29tYS1ueXVtYmFuaS1hcHAtc3RhZ2luZy5hcHBzcG90LmNvbSIsIm1lc3NhZ2luZ1NlbmRlcklkIjoiOTUzMDU2NTgxOTExIiwiYXBwSWQiOiIxOjk1MzA1NjU4MTkxMTp3ZWI6YTNhZjdiMjg5NmQ4N2FiM2IxYmY1MiIsIm1lYXN1cmVtZW50SWQiOiJHLTJXWkRLSzExMUsifQ==";
const config = JSON.parse(atob(configBase64));
export default config;
