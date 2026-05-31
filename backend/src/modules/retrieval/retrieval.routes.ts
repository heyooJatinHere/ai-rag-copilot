import { Router }
    from "express";

import { search }
    from "./search.controller";

const router = Router();

// search?q={query}
router.get("/", search);

export default router;