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
// generate keypair from the file
//get new keypair of accounts to be transferring sol
//sendsol
var path = require("path");
var fs = require("mz/fs");
var borsh = require("borsh");
var web3_js_1 = require("@solana/web3.js");
var pathis = path.resolve(__dirname, '../transfersol/target/deploy/transfersol-keypair.json');
var programKeypair;
var generateProgramKeypair = function () { return __awaiter(void 0, void 0, void 0, function () {
    var secretKeyFile, parsedJson, bufferIs, keypair;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readFile(pathis, { encoding: 'utf8' })
                // console.log("The secret file is",secretKeyFile);
            ];
            case 1:
                secretKeyFile = _a.sent();
                parsedJson = JSON.parse(secretKeyFile);
                bufferIs = Uint8Array.from(parsedJson);
                keypair = web3_js_1.Keypair.fromSecretKey(bufferIs);
                programKeypair = keypair;
                return [2 /*return*/];
        }
    });
}); };
var payer = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(([202, 226, 58, 245, 91, 39, 163, 206, 172, 166, 234, 149, 97, 74, 103, 67, 1, 84, 42, 134, 64, 145, 240, 180, 2, 102, 81, 60, 140, 91, 66, 211, 98, 7, 39, 253, 160, 46, 3, 157, 134, 25, 115, 42, 248, 248, 185, 158, 184, 177, 124, 2, 238, 99, 153, 96, 2, 87, 155, 238, 27, 44, 191, 195])));
var payee = web3_js_1.Keypair.generate();
var connection;
var getConnectedToSolanacluster = function () {
    connection = new web3_js_1.Connection("https://solana-devnet.g.alchemy.com/v2/oa5nvvXzBNYrwp_f8c19H_XsccjRXDqA");
};
var TransferData = /** @class */ (function () {
    function TransferData(fields) {
        this.lamports = fields.lamports;
    }
    return TransferData;
}());
var transferDataSchema = new Map([
    [TransferData, { kind: 'struct', fields: [['lamports', 'u64']] }]
]);
var sendSolFunction = function () { return __awaiter(void 0, void 0, void 0, function () {
    var transferData, serializeData, Instruction, transaction, _a, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                transferData = new TransferData({ lamports: BigInt(10000) });
                serializeData = borsh.serialize(transferDataSchema, transferData);
                Instruction = new web3_js_1.TransactionInstruction({
                    keys: [{ isSigner: true, isWritable: true, pubkey: payer.publicKey },
                        { isSigner: false, isWritable: true, pubkey: payee.publicKey },
                        { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false }
                    ],
                    programId: programKeypair.publicKey,
                    data: Buffer.from(serializeData)
                });
                transaction = new web3_js_1.Transaction().add(Instruction);
                _a = transaction;
                return [4 /*yield*/, connection.getRecentBlockhash()];
            case 1:
                _a.recentBlockhash = (_b.sent()).blockhash;
                transaction.feePayer = payer.publicKey;
                return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [payer])];
            case 2:
                signature = _b.sent();
                console.log("THe signature is ", signature);
                console.log("Sending sol completed");
                return [2 /*return*/];
        }
    });
}); };
// const airdropSol = async () => {
//   try {
//       const latestBlockhash = await connection.getLatestBlockhash();
//     const signature = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL*2);
//     console.log("Airdrop requested. Signature:", signature);
//     // Get the latest blockhash so we can confirm with correct context
//     // Confirm the transaction using the latest blockhash
//     // const confirmation = await connection.confirmTransaction({
//     //   signature,
//     //   ...latestBlockhash,
//     // }, 'finalized'); // 'confirmed' or 'finalized' is recommended
//     await connection.confirmTransaction(signature)
//     // console.log("Airdrop confirmed:", confirmation);
//   } catch (err) {
//     console.error("Airdrop failed:", err);
//   }
// };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var _o, _p, _q, _r;
    return __generator(this, function (_s) {
        switch (_s.label) {
            case 0: return [4 /*yield*/, generateProgramKeypair()];
            case 1:
                _s.sent();
                console.log("The programAddress is ", programKeypair);
                getConnectedToSolanacluster();
                console.log("the payer public key is", payer.publicKey);
                console.log("the payer public key is", payee.publicKey);
                // await airdropSol()
                // const data1=await connection.getBalance(payer.publicKey);
                // console.log(data1);
                _b = (_a = console).log;
                _c = ["The initial amount of lamports in payer's address"];
                return [4 /*yield*/, connection.getAccountInfo(payer.publicKey)];
            case 2:
                // await airdropSol()
                // const data1=await connection.getBalance(payer.publicKey);
                // console.log(data1);
                _b.apply(_a, _c.concat([(_o = (_s.sent())) === null || _o === void 0 ? void 0 : _o.lamports]));
                _e = (_d = console).log;
                _f = ["The initial amount of lamports in payer's address"];
                return [4 /*yield*/, connection.getAccountInfo(payee.publicKey)];
            case 3:
                _e.apply(_d, _f.concat([(_p = (_s.sent())) === null || _p === void 0 ? void 0 : _p.lamports]));
                return [4 /*yield*/, sendSolFunction()];
            case 4:
                _s.sent();
                _h = (_g = console).log;
                _j = ["The final amount of lamports in payer's address"];
                return [4 /*yield*/, connection.getAccountInfo(payer.publicKey)];
            case 5:
                _h.apply(_g, _j.concat([(_q = (_s.sent())) === null || _q === void 0 ? void 0 : _q.lamports]));
                _l = (_k = console).log;
                _m = ["The final amount of lamports in payer's address"];
                return [4 /*yield*/, connection.getAccountInfo(payee.publicKey)];
            case 6:
                _l.apply(_k, _m.concat([(_r = (_s.sent())) === null || _r === void 0 ? void 0 : _r.lamports]));
                return [2 /*return*/];
        }
    });
}); };
main().then(function () {
    console.log("Function called");
})
    .catch(function (e) { return console.log(e); });
