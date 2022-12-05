require("dotenv").config;
import { Request, Response } from "express";
const client = require("../db/db");

interface AssessmentRequest extends Request {
  newToken?: string;
}

const getAssessment = async (req: AssessmentRequest, res: Response) => {
  try {
    const { user_position_id } = req.params;

    // Retrieve assessments
    let query = `
      SELECT * FROM assessments WHERE user_position_id = '${user_position_id}'
      ORDER BY date, assessment_number;
    `;
    let result = await client.query(query);
    const assessments = result.rows;

    // Retrieved but no assessments
    if (result.rowCount === 0) {
      const data: any = {};

      if (req.newToken) {
        data.access = req.newToken;
      }

      res.json({ status: "ok", message: "Positions has no assessments", data });
      return;
    }

    const data: any = { assessments };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Assessments retrieved");
    res.json({ status: "ok", message: "Assessments retrieved", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to retrieve assessment" });
  }
};

const createAssessment = async (req: AssessmentRequest, res: Response) => {
  try {
    const { user_position_id } = req.params;
    const {
      assessment_number,
      instructor,
      date,
      intensity,
      objective1,
      objective2,
      objective3,
      a,
      b,
      c,
      d,
      e,
      f,
      g,
      h,
      i,
      j,
      safety,
      is_simulator,
      remarks,
      scenarios,
    } = req.body;

    let assessment_scenarios_query = "";
    for (let i = 1; i <= Object.keys(scenarios).length; i++) {
      if (scenarios[`scenario${i}`]) {
        assessment_scenarios_query += `((SELECT id FROM assessment), '${
          scenarios[`scenario${i}`]
        }'),`;
      }
    }
    const assessment_scenarios_query_array =
      assessment_scenarios_query.split("");
    assessment_scenarios_query_array.pop();
    assessment_scenarios_query = assessment_scenarios_query_array.join("");

    let scenario_requirements_query = "";
    for (let i = 1; i <= Object.keys(scenarios).length; i++) {
      if (scenarios[`scenario${i}`]) {
        assessment_scenarios_query += `
          WITH scenario_count AS (
            SELECT COUNT(assessment_scenarios.scenario_id) AS scenario_count FROM assessment_scenarios
            JOIN assessments ON assessments.id = assessment_scenarios.assessment_id
            WHERE assessments.user_position_id = '${user_position_id}' AND scenario_id = '${
          scenarios[`scenario${i}`]
        }'), live_scenario_count AS (
            SELECT COUNT(assessment_scenarios.scenario_id) AS live_scenario_count FROM assessment_scenarios
            JOIN assessments ON assessments.id = assessment_scenarios.assessment_id
            WHERE assessments.user_position_id = '${user_position_id}' AND scenario_id = '${
          scenarios[`scenario${i}`]
        }' AND assessments.is_simulator = false
          )
          UPDATE scenario_requirements
          SET fulfilled = scenario_count.scenario_count, live_fulfilled = live_scenario_count.live_scenario_count
          FROM scenario_count, live_scenario_count
          WHERE user_position_id = '${user_position_id}' AND scenario_id = '${
          scenarios[`scenario${i}`]
        }';
        `;
      }
    }

    // Database Queries
    let query = `
      BEGIN;

      -- Create New Assessment
      WITH assessment AS (
        INSERT INTO assessments (user_position_id, assessment_number, instructor, date, intensity, objective1, objective2, objective3, a, b, c, d, e, f, g, h, i, j, safety, remarks, is_simulator)
        VALUES (
          '${user_position_id}', ${assessment_number}, '${instructor}', ${date}, ${intensity},
          '${objective1}',
          ${objective2 ? `'${objective2}'` : null},
          ${objective3 ? `'${objective3}'` : null},
          ${a}, ${b}, ${c}, ${d}, ${e}, ${f}, ${g}, ${h}, ${i}, ${j},
          ${safety}, '${remarks}', ${is_simulator})
          RETURNING id, grade
      ),

      -- Insert into Assessment Scenarios
      assessment_scenarios AS (
        INSERT INTO assessment_scenarios (assessment_id, scenario_id)
        VALUES ${assessment_scenarios_query}
      ) 
      SELECT id, grade FROM assessment;

      -- Update Scenario Requirements
      ${scenario_requirements_query}

      COMMIT;
    `;
    let result = await client.query(query);

    const assessment = {
      id: result[1].rows[0].id,
      grade: result[1].rows[0].grade,
    };

    const data: any = { assessment };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Assessment created");
    res.json({ status: "ok", message: "Assessment created", data });
  } catch (err: any) {
    console.error(err.message);
    await client.query("ROLLBACK;");
    res
      .status(400)
      .json({ status: "error", message: "Failed to create assessment" });
  }
};

const updateAssessment = async (req: AssessmentRequest, res: Response) => {
  try {
    const { assessment_id } = req.params;
    const {
      user_position_id,
      assessment_number,
      instructor,
      date,
      intensity,
      objective1,
      objective2,
      objective3,
      a,
      b,
      c,
      d,
      e,
      f,
      g,
      h,
      i,
      j,
      safety,
      is_simulator,
      remarks,
      scenarios,
    } = req.body;

    let assessment_scenarios_query = "";
    for (let i = 1; i <= Object.keys(scenarios).length; i++) {
      if (scenarios[`scenario${i}`]) {
        assessment_scenarios_query += `('${assessment_id}', '${
          scenarios[`scenario${i}`]
        }'),`;
      }
    }
    const assessment_scenarios_query_array =
      assessment_scenarios_query.split("");
    assessment_scenarios_query_array.pop();
    assessment_scenarios_query = assessment_scenarios_query_array.join("");

    let scenario_requirements_query = "";
    for (let i = 1; i <= Object.keys(scenarios).length; i++) {
      if (scenarios[`scenario${i}`]) {
        scenario_requirements_query += `
          WITH scenario_count AS (
            SELECT COUNT(assessment_scenarios.scenario_id) AS scenario_count FROM assessment_scenarios
            JOIN assessments ON assessments.id = assessment_scenarios.assessment_id
            WHERE assessments.user_position_id = '${user_position_id}' AND scenario_id = '${
          scenarios[`scenario${i}`]
        }'), live_scenario_count AS (
            SELECT COUNT(assessment_scenarios.scenario_id) AS live_scenario_count FROM assessment_scenarios
            JOIN assessments ON assessments.id = assessment_scenarios.assessment_id
            WHERE assessments.user_position_id = '${user_position_id}' AND scenario_id = '${
          scenarios[`scenario${i}`]
        }' AND assessments.is_simulator = false
          )
          UPDATE scenario_requirements
          SET fulfilled = scenario_count.scenario_count, live_fulfilled = live_scenario_count.live_scenario_count
          FROM scenario_count, live_scenario_count
          WHERE user_position_id = '${user_position_id}' AND scenario_id = '${
          scenarios[`scenario${i}`]
        }';
        `;
      }
    }

    // Update assessment
    let query = `
      BEGIN;

      -- Delete Previous Assessment Scenarios
      DELETE FROM assessment_scenarios WHERE assessment_id = '${assessment_id}';

      -- Update Assessment Details
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

      -- Insert New Assessment Scenarios
      INSERT INTO assessment_scenarios (assessment_id, scenario_id)
      VALUES ${assessment_scenarios_query};

      -- Update Scenario Requirements
      ${scenario_requirements_query}

      COMMIT;
    `;
    let result = await client.query(query);

    const assessment = {
      grade: result[2].rows[0].grade,
    };
    const data: any = { assessment };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Assessment updated");
    res.json({ status: "ok", message: "Assessment updated", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to update assessment" });
  }
};

const deleteAssessment = async (req: AssessmentRequest, res: Response) => {
  try {
    const { assessment_id } = req.params;

    // Delete assessment scenarios
    let query = `
      DELETE FROM assessment_scenarios WHERE assessment_id = '${assessment_id}';
    `;
    await client.query(query);

    // Delete assessment
    query = `DELETE FROM assessments WHERE id = '${assessment_id}';`;
    await client.query(query);

    const data: any = {};

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Assessment deleted");
    res.json({ status: "ok", message: "Assessment deleted", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to delete assessment" });
  }
};

const getScenarios = async (req: AssessmentRequest, res: Response) => {
  try {
    const { position } = req.params;

    let query = `
    SELECT id, scenario_number FROM scenarios WHERE position = '${position}';
`;
    let result = await client.query(query);

    const scenarios = result.rows;

    const data: any = { scenarios };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved scenarios");
    res.json({ status: "ok", message: "Retrieved scenarios", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to retrieve scenarios" });
  }
};

const getAssessmentScenarios = async (
  req: AssessmentRequest,
  res: Response
) => {
  try {
    const { assessment_id, position } = req.params;

    let query = `
      WITH scenario_id AS (
        SELECT scenario_id
        FROM assessment_scenarios
        WHERE assessment_scenarios.assessment_id = '${assessment_id}'
      )
      SELECT scenarios.scenario_number, scenario_id.scenario_id
      FROM scenarios
      LEFT JOIN scenario_id ON scenario_id = scenarios.id
      WHERE scenarios.position = '${position}';
    `;
    let result = await client.query(query);

    const assessment_scenarios = result.rows;
    const data: any = { assessment_scenarios };

    if (req.newToken) {
      data.access = req.newToken;
    }

    console.log("Retrieved assessment scenarios");
    res.json({ status: "ok", message: "Retrieved assessment scenarios", data });
  } catch (err: any) {
    console.error(err.message);
    res
      .status(400)
      .json({ status: "error", message: "Failed to assessment scenarios" });
  }
};

module.exports = {
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  getScenarios,
  getAssessmentScenarios,
};
