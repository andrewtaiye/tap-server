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
const capitaliseFirstLetter = (string) => {
    const words = string.split(/ |-/);
    const newWords = [];
    for (let word of words) {
        const arr = word.split("");
        arr[0] = arr[0].toUpperCase();
        newWords.push(arr.join(""));
    }
    return newWords.join(" ");
};
const fetchCall = (url, method = "GET", body = null) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(url, {
        method: method,
        body: body === null ? null : JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    });
    const response = yield res.json();
    return response;
});
module.exports = {
    capitaliseFirstLetter,
    fetchCall,
};
