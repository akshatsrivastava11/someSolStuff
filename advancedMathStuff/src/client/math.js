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
exports.connect = connect;
exports.getLocalAccount = getLocalAccount;
exports.getProgram = getProgram;
exports.configureClientAccount = configureClientAccount;
exports.pingProgram = pingProgram;
exports.example = example;
var web3_js_1 = require("@solana/web3.js");
var util_1 = require("./util");
var fs = require("mz/fs");
var os = require("os");
var path = require("path");
var yaml = require("yaml");
/*
Path to Solana CLI config file.
*/
var CONFIG_FILE_PATH = path.resolve(os.homedir(), '.config', 'solana', 'cli', 'config.yml');
var connection;
var localKeypair;
var programKeypair;
var programId;
var clientPubKey;
var PROGRAM_PATH = path.resolve(__dirname, '../calculator/calculator/target/deploy');
/*
Connect to dev net.
*/
function connect() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            connection = new web3_js_1.Connection('https://api.devnet.solana.com', 'confirmed');
            console.log("Successfully connected to Solana dev net.");
            return [2 /*return*/];
        });
    });
}
/*
Use local keypair for client.
*/
function getLocalAccount() {
    return __awaiter(this, void 0, void 0, function () {
        var configYml, keypairPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFile(CONFIG_FILE_PATH, { encoding: 'utf8' })];
                case 1:
                    configYml = _a.sent();
                    return [4 /*yield*/, yaml.parse(configYml).keypair_path];
                case 2:
                    keypairPath = _a.sent();
                    return [4 /*yield*/, (0, util_1.createKeypairFromFile)(keypairPath)];
                case 3:
                    localKeypair = _a.sent();
                    // const airdropRequest = await connection.requestAirdrop(
                    //     localKeypair.publicKey,
                    //     LAMPORTS_PER_SOL*2,
                    // );
                    // await connection.confirmTransaction(airdropRequest);
                    console.log("Local account loaded successfully.");
                    console.log("Local account's address is:");
                    console.log("   ".concat(localKeypair.publicKey));
                    return [2 /*return*/];
            }
        });
    });
}
/*
Get the targeted program.
*/
function getProgram(programName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, util_1.createKeypairFromFile)(path.join(PROGRAM_PATH, programName + '-keypair.json'))];
                case 1:
                    programKeypair = _a.sent();
                    programId = programKeypair.publicKey;
                    console.log("We're going to ping the ".concat(programName, " program."));
                    console.log("It's Program ID is:");
                    console.log("   ".concat(programId.toBase58()));
                    return [2 /*return*/];
            }
        });
    });
}
/*
Configure client account.
*/
function configureClientAccount(accountSpaceSize) {
    return __awaiter(this, void 0, void 0, function () {
        var SEED, clientAccount, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    SEED = 'test7';
                    return [4 /*yield*/, web3_js_1.PublicKey.createWithSeed(localKeypair.publicKey, SEED, programId)];
                case 1:
                    clientPubKey = _a.sent();
                    console.log("For simplicity's sake, we've created an address using a seed.");
                    console.log("That seed is just the string \"test(num)\".");
                    console.log("The generated address is:");
                    console.log("   ".concat(clientPubKey.toBase58()));
                    return [4 /*yield*/, connection.getAccountInfo(clientPubKey)];
                case 2:
                    clientAccount = _a.sent();
                    if (!(clientAccount === null)) return [3 /*break*/, 4];
                    console.log("Looks like that account does not exist. Let's create it.");
                    transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccountWithSeed({
                        fromPubkey: localKeypair.publicKey,
                        basePubkey: localKeypair.publicKey,
                        seed: SEED,
                        newAccountPubkey: clientPubKey,
                        lamports: web3_js_1.LAMPORTS_PER_SOL,
                        space: accountSpaceSize,
                        programId: programId,
                    }));
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [localKeypair])];
                case 3:
                    _a.sent();
                    console.log("Client account created successfully.");
                    return [3 /*break*/, 5];
                case 4:
                    console.log("Looks like that account exists already. We can just use it.");
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/*
Ping the program.
*/
function pingProgram(operation, operatingValue) {
    return __awaiter(this, void 0, void 0, function () {
        var calcInstructions, _a, _b, _c, instruction;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("All right, let's run it.");
                    console.log("Pinging our calculator program...");
                    return [4 /*yield*/, (0, util_1.createCalculatorInstructions)(operation, operatingValue)];
                case 1:
                    calcInstructions = _d.sent();
                    _b = (_a = console).log;
                    _c = "We're going to ".concat;
                    return [4 /*yield*/, (0, util_1.getStringForInstruction)(operation, operatingValue)];
                case 2:
                    _b.apply(_a, [_c.apply("We're going to ", [_d.sent()])]);
                    instruction = new web3_js_1.TransactionInstruction({
                        keys: [{ pubkey: clientPubKey, isSigner: false, isWritable: true }],
                        programId: programId,
                        data: calcInstructions,
                    });
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, new web3_js_1.Transaction().add(instruction), [localKeypair])];
                case 3:
                    _d.sent();
                    console.log("Ping successful.");
                    return [2 /*return*/];
            }
        });
    });
}
/*
Run the example (main).
*/
function example(programName, accountSpaceSize) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getLocalAccount()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getProgram(programName)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, configureClientAccount(accountSpaceSize)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, pingProgram(1, 4)];
                case 5:
                    _a.sent(); // Add 4
                    return [4 /*yield*/, pingProgram(2, 1)];
                case 6:
                    _a.sent(); // Subtract 1
                    return [4 /*yield*/, pingProgram(3, 2)];
                case 7:
                    _a.sent(); // Multiply by 2
                    return [2 /*return*/];
            }
        });
    });
}
