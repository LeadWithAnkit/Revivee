import healthHandler from "./health.js";

export default async function handler(req, res) {
  return healthHandler(req, res);
}
