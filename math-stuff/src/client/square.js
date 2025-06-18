"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingProgram = void 0;
exports.example = example;
var web3_js_1 = require("@solana/web3.js");
// import fs from "mz/fs";
var path = require("path");
var os = require("os");
var util_1 = require("./util");
var CONFIG_FILE_PATH = path.resolve(os.homedir(), '.config', 'solana', 'id.json');
var connection;
function connect() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            connection = new web3_js_1.Connection("https://api.devnet.solana.com");
            console.log("Connection to the cluster established");
            return [2 /*return*/];
        });
    });
}
var localKeypair = web3_js_1.Keypair.fromSecretKey(Uint8Array.from([202, 226, 58, 245, 91, 39, 163, 206, 172, 166, 234, 149, 97, 74, 103, 67, 1, 84, 42, 134, 64, 145, 240, 180, 2, 102, 81, 60, 140, 91, 66, 211, 98, 7, 39, 253, 160, 46, 3, 157, 134, 25, 115, 42, 248, 248, 185, 158, 184, 177, 124, 2, 238, 99, 153, 96, 2, 87, 155, 238, 27, 44, 191, 195]));
console.log(CONFIG_FILE_PATH);
// const getLocalAccount = async () => {
//     const config = await fs.readFile(CONFIG_FILE_PATH,{encoding:'utf-8'});
//     // const keypairPath=yaml.parse(config).keypair_path;
//     const keypairPath=JSON.parse(config)
//     localKeypair = await createKeypairFromFile(keypairPath);
//     console.log("Local account loaded");
//     console.log(localKeypair.publicKey.toBase58());
// }
console.log(localKeypair.publicKey);
var PROGRAM_PATH = path.resolve(__dirname, '../sqaure/target/deploy/sqaure');
var programKeyPair;
var programId;
var getProgram = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(PROGRAM_PATH);
                return [4 /*yield*/, (0, util_1.createKeypairFromFile)(PROGRAM_PATH + '-keypair.json')];
            case 1:
                programKeyPair = _a.sent();
                programId = programKeyPair.publicKey;
                console.log("Program account loaded");
                console.log(programId.toBase58());
                return [2 /*return*/];
        }
    });
}); };
var clientPubKey;
var configureClient = function (account_space) { return __awaiter(void 0, void 0, void 0, function () {
    var seed, newTxs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                seed = "Test1";
                return [4 /*yield*/, web3_js_1.PublicKey.createWithSeed(localKeypair.publicKey, seed, programId)];
            case 1:
                clientPubKey = _a.sent();
                console.log("For simplicity's sake, we've created an address using a seed.");
                console.log("That seed is just the string \"test(num)\".");
                console.log("The generated address is:");
                console.log("   ".concat(clientPubKey.toBase58()));
                newTxs = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccountWithSeed({
                    fromPubkey: localKeypair.publicKey,
                    basePubkey: localKeypair.publicKey,
                    seed: seed,
                    newAccountPubkey: clientPubKey,
                    lamports: web3_js_1.LAMPORTS_PER_SOL,
                    space: account_space,
                    programId: programId
                }));
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, newTxs, [localKeypair])];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var pingProgram = function () { return __awaiter(void 0, void 0, void 0, function () {
    var instruction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                instruction = new web3_js_1.TransactionInstruction({
                    keys: [{ isSigner: false, pubkey: clientPubKey, isWritable: true }],
                    programId: programId,
                    data: Buffer.alloc(0),
                });
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, new web3_js_1.Transaction().add(instruction), [localKeypair])];
            case 1:
                _a.sent();
                console.log("Ping suuceessfull");
                return [2 /*return*/];
        }
    });
}); };
exports.pingProgram = pingProgram;
function example(accountSpaceSize) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connect()];
                case 1:
                    _a.sent();
                    // await getLocalAccount();
                    return [4 /*yield*/, getProgram()];
                case 2:
                    // await getLocalAccount();
                    _a.sent();
                    return [4 /*yield*/, configureClient(accountSpaceSize)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, (0, exports.pingProgram)()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
example(10);
