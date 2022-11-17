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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config;
const client = require("../db/db");
const getAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_position_id } = req.params;
        // Retrieve assessments
        let query = `
      SELECT * FROM assessments WHERE user_position_id = '${user_position_id}'
      ORDER BY date, assessment_number;
    `;
        let result = yield client.query(query);
        // Retrieved but no assessments
        if (result.rowCount === 0) {
            res.json({ status: "ok", message: "Positions has no assessments" });
            return;
        }
        const assessments = result.rows;
        const data = { assessments };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Assessments retrieved");
        res.json({ status: "ok", message: "Assessments retrieved", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to retrieve assessment" });
    }
});
const createAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_position_id } = req.params;
        const { assessment_number, instructor, date, intensity, objective1, objective2, objective3, a, b, c, d, e, f, g, h, i, j, safety, is_simulator, remarks, } = req.body;
        // Create new assessment
        let query = `
      INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, objective2, objective3, a, b, c, d, e, f, g, h, i, j, safety, remarks, is_simulator)
      VALUES (
        '${user_position_id}', ${assessment_number}, '${instructor}', ${date}, ${intensity},
        '${objective1}',
        ${objective2 ? `'${objective2}'` : null},
        ${objective3 ? `'${objective3}'` : null},
        ${a}, ${b}, ${c}, ${d}, ${e}, ${f}, ${g}, ${h}, ${i}, ${j},
        ${safety}, '${remarks}', ${is_simulator})
      RETURNING id, grade;
    `;
        let result = yield client.query(query);
        const assessment = {
            id: result.rows[0].id,
            grade: result.rows[0].grade,
        };
        const data = { assessment };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Assessment created");
        res.json({ status: "ok", message: "Assessment created", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to create assessment" });
    }
});
const updateAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessment_id } = req.params;
        const { user_position_id, assessment_number, instructor, date, intensity, objective1, objective2, objective3, a, b, c, d, e, f, g, h, i, j, safety, is_simulator, remarks, } = req.body;
        // Update assessment
        let query = `
      UPDATE assessments SET 
        user_position_id = '${user_position_id}',
        assessment_number =  ${assessment_number},
        instructor = '${instructor}',
        date = ${date},
        intensity = ${intensity},
        objective1 = '${objective1}',
        objective2 = ${objective2 ? `'${objective2}'` : null},
        objective3 = ${objective3 ? `'${objective3}'` : null},
        a = ${a}, b = ${b}, c = ${c}, d = ${d}, e = ${e},
        f = ${f}, g = ${g}, h = ${h}, i = ${i}, j = ${j},
        safety = ${safety},
        remarks = '${remarks}',
        is_simulator = ${is_simulator}
      WHERE id = '${assessment_id}'
      RETURNING grade;
    `;
        let result = yield client.query(query);
        const assessment = {
            grade: result.rows[0].grade,
        };
        const data = { assessment };
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Assessment updated");
        res.json({ status: "ok", message: "Assessment updated", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to update assessment" });
    }
});
const deleteAssessment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessment_id } = req.params;
        // Delete assessment
        let query = `DELETE FROM assessments WHERE id = '${assessment_id}';`;
        yield client.query(query);
        const data = {};
        if (req.newToken) {
            data.access = req.newToken;
        }
        console.log("Assessment deleted");
        res.json({ status: "ok", message: "Assessment deleted", data });
    }
    catch (err) {
        console.error(err.message);
        res
            .status(400)
            .json({ status: "error", message: "Failed to delete assessment" });
    }
});
module.exports = {
    getAssessment,
    createAssessment,
    updateAssessment,
    deleteAssessment,
};
