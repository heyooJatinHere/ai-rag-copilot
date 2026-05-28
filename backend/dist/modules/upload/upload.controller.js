"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPdf = void 0;
const upload_service_1 = require("./upload.service");
const uploadPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "File missing",
            });
        }
        const result = await (0, upload_service_1.uploadDocument)(req.file);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Upload failed",
        });
    }
};
exports.uploadPdf = uploadPdf;
//# sourceMappingURL=upload.controller.js.map