const express = require("express");
const router = express.Router();
const llmController = require("../controllers/llmController");

router.get("/providers", llmController.getProviders);
router.post("/query", llmController.queryLLM);

module.exports = router;