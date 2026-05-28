"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//routers
app.use("/upload", upload_routes_1.default);
app.get("/health", (_, res) => {
    res.json({
        status: "OK",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map