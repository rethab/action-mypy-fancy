"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const wait_1 = require("./wait");
const process = __importStar(require("process"));
const cp = __importStar(require("child_process"));
const path = __importStar(require("path"));
const globals_1 = require("@jest/globals");
globals_1.test('throws invalid number', async () => {
    const input = parseInt('foo', 10);
    await globals_1.expect(wait_1.wait(input)).rejects.toThrow('milliseconds not a number');
});
globals_1.test('wait 500 ms', async () => {
    const start = new Date();
    await wait_1.wait(500);
    const end = new Date();
    const delta = Math.abs(end.getTime() - start.getTime());
    globals_1.expect(delta).toBeGreaterThan(450);
});
// shows how the runner will run a javascript action with env / stdout protocol
globals_1.test('test runs', () => {
    process.env['INPUT_MILLISECONDS'] = '500';
    const np = process.execPath;
    const ip = path.join(__dirname, '..', 'lib', 'main.js');
    const options = {
        env: process.env,
    };
    cp.execFileSync(np, [ip], options).toString();
});
