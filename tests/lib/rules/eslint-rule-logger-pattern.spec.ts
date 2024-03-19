import { RuleTester } from "eslint";
import rule from "../../../lib/rules/eslint-rule-logger-pattern";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2015,
  },
});

ruleTester.run("structured-logger-rule", rule as any, {
  valid: [
    "let logger = new StructuredLogger('Bootstrap');",
    "const logger = new StructuredLogger();",
    "var logger = new StructuredLogger();",
    "let logger = new StructuredLogger('Bootstrap'); logger.log('some log ${log}', log);",
    "let logger = new StructuredLogger('Bootstrap'); logger.log('some log ${log} ${log2}', log, log2);",
  ],
  invalid: [
    {
      code: "let logger = new StructuredLogger('Bootstrap'); logger.log('some log ${log}');",
      errors: [
        {
          message:
            "The number of placeholders in the string literal must match the number of additional arguments.",
        },
      ],
    },
    {
      code: "let logger = new StructuredLogger('Bootstrap'); logger.log('some log ${log} ${log2}', log);",
      errors: [
        {
          message:
            "The number of placeholders in the string literal must match the number of additional arguments.",
        },
      ],
    },
  ],
});
