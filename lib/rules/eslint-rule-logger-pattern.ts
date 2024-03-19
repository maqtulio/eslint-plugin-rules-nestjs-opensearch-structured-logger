// @ts-check
import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://github.com/your-org/eslint-plugin#rules-${name}`
);

const structuredLoggerMethodUsage = createRule({
  create(context) {
    const loggerInstances = new Map();

    return {
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === "NewExpression" &&
          node.init.callee.type === "Identifier" &&
          node.init.callee.name === "StructuredLogger"
        ) {
          if (node.id.type === "Identifier") {
            loggerInstances.set(node.id.name, true);
          }
        }
      },
      CallExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.type === "Identifier" &&
          loggerInstances.has(node.callee.object.name) &&
          node.arguments.length > 0
        ) {
          const firstArg = node.arguments[0];
          if (
            firstArg.type !== "Literal" ||
            typeof firstArg.value !== "string"
          ) {
            context.report({
              node: firstArg,
              messageId: "mustBeStringLiteral",
            });
            return;
          }

          const placeholderMatches = firstArg.value.match(/\$\{[^}]+\}/g) || [];
          if (placeholderMatches.length !== node.arguments.length - 1) {
            context.report({
              node: firstArg,
              messageId: "placeholdersMismatch",
            });
          }
        }
      },
    };
  },
  name: "structured-logger-rule",
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure StructuredLogger methods are called with proper string literals and matching arguments",
      recommended: "error",
    },
    messages: {
      mustBeStringLiteral:
        "The first argument of the StructuredLogger method must be a string literal.",
      placeholdersMismatch:
        "The number of placeholders in the string literal must match the number of additional arguments.",
    },
    schema: [
      {
        type: "object",
        properties: {
          logMethods: {
            type: "array",
            items: {
              type: "string",
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [],
});

export default structuredLoggerMethodUsage;
