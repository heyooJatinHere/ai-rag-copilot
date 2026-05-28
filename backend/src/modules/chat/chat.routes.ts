import { Router }
    from "express";

import { chat }
    from "./chat.controller";

const router = Router();

router.post("/", chat);

export default router;