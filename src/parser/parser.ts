import {
  Sepolia,
  Chain,
  Mumbai,
  USDC_Sepolia,
  USDC_Mumbai,
  WETH_Sepolia,
  WETH_Mumbai,
} from "@/providers/ProgramProvider/Tokens";
import {
  ChainToken,
  ComparisonOperator,
  Condition,
  ElseStatement,
  IfElseStatement,
  MathExpression,
  MathOperator,
  SendStatement,
  Statement,
  StatementType,
  SwapStatement,
} from "../providers/ProgramProvider/Statements";

const TAB = "    ";

function parseMathExpression(expression: MathExpression): PythonCode {
  const { left, right, operator } = expression;
  if (!left || !right || !operator) {
    return { variables: [], lines: [] };
  }
  const parsedLeft = parseMathSide(left);
  const parsedRight = parseMathSide(right);
  const parsedOperator = parseMathOperator(operator);

  const leftSide = parsedLeft.lines[0];
  const rightSide = parsedRight.lines[0];
  if (!leftSide || !rightSide) {
    throw new Error(`Math Expression was invalid. Operator: ${operator}`);
  }

  return {
    variables: [...parsedLeft.variables, ...parsedRight.variables],
    lines: [`${leftSide} ${parsedOperator} ${rightSide}`],
  };
}

function converToVariable(token: ChainToken): string {
  if (token.name.includes("Sepolia") && token.name.includes("WETH")) {
    return "SepoliaPrice";
  }
  if (token.name.includes("Mumbai") && token.name.includes("WETH")) {
    return "MumbaiPrice";
  }
  if (token.name.includes("Sepolia")) {
    return "USDCSepolia";
  }
  if (token.name.includes("Mumbai")) {
    return "USDCMumbai";
  }
  return "UNKNOWN";
}

function parseMathSide(left: string | ChainToken | MathExpression): PythonCode {
  if (typeof left === "string") {
    return {
      variables: [],
      lines: [left],
    };
  }
  if ("symbol" in left) {
    const tokenName = converToVariable(left);
    return {
      variables: [],
      lines: [tokenName],
    };
  }
  if ("operator" in left) {
    // Only one level of depth is supported
    throw new Error("Not implemented yet");
  }

  return { variables: [], lines: [] };
}

function parseMathOperator(operator: MathOperator): string {
  switch (operator) {
    case MathOperator.ADD:
      return "+";
    case MathOperator.SUBTRACT:
      return "-";
    case MathOperator.MULTIPLY:
      return "*";
    case MathOperator.DIVIDE:
      return "/";
    default:
      throw new Error(`Operator ${operator} is not supported`);
  }
}

function parseConditionSide(
  left: string | ChainToken | MathExpression
): PythonCode {
  if (typeof left === "string") {
    return {
      variables: [],
      lines: [left],
    };
  }
  if ("symbol" in left) {
    return {
      variables: [],
      lines: [left.name],
    };
  }
  if ("operator" in left) {
    const { variables, lines } = parseMathExpression(left);
    return { variables, lines };
  }

  return { variables: [], lines: [] };
}

function parseConditionOperator(operator: ComparisonOperator): string {
  switch (operator) {
    case ComparisonOperator.EQUAL:
      return "==";
    case ComparisonOperator.GREATER_THAN:
      return ">";
    case ComparisonOperator.LESS_THAN:
      return "<";
    default:
      throw new Error(`Operator ${operator} is not supported`);
  }
}

function parseCondition(condition: Condition): PythonCode {
  const { left, right, operator } = condition;
  if (!left || !right || !operator) {
    return { variables: [], lines: [] };
  }
  const parsedLeft = parseConditionSide(left);
  const parsedRight = parseConditionSide(right);
  const parsedOperator = parseConditionOperator(operator);

  const leftSide = parsedLeft.lines[0];
  const rightSide = parsedRight.lines[0];
  if (!leftSide || !rightSide) {
    throw new Error(`Condition was invalid. Operator: ${operator}`);
  }

  return {
    variables: [...parsedLeft.variables, ...parsedRight.variables],
    lines: [`${leftSide} ${parsedOperator} ${rightSide}`],
  };
}

function parseIfElseStatement(statement: IfElseStatement): PythonCode {
  const { condition, ifStatements } = statement.data!;
  if (!condition || !ifStatements || ifStatements.length === 0) {
    return { variables: [], lines: [] };
  }

  const variables = [];
  const lines = [];
  const conditionCode = parseCondition(condition);
  const ifStatementsCode = parseAllStatements(ifStatements);

  const conditionLine = conditionCode.lines[0];
  if (!conditionLine || !ifStatementsCode.lines) {
    return { variables: [], lines: [] };
  }
  const tabbedLines = ifStatementsCode.lines.map((line) => `${TAB}${line}`);

  lines.push(`if ${conditionLine}:`);
  lines.push(...tabbedLines);
  variables.push(...conditionCode.variables);
  variables.push(...ifStatementsCode.variables);

  return { variables, lines };
}

function parseElseStatement(statement: ElseStatement): PythonCode {
  const { elseStatements } = statement.data!;
  if (!elseStatements || elseStatements.length === 0) {
    return { variables: [], lines: [] };
  }

  const variables = [];
  const lines = [];
  const elseStatementsCode = parseAllStatements(elseStatements);
  const tabbedLines = elseStatementsCode.lines.map((line) => `${TAB}${line}`);
  lines.push(`else:`);
  lines.push(...tabbedLines);
  variables.push(...elseStatementsCode.variables);

  return { variables, lines };
}

function parseSwapStatement(statement: SwapStatement): PythonCode {
  const { data } = statement;
  if (!data) {
    return { variables: [], lines: [] };
  }

  const { from, to, chain, amount } = data;
  const variables: string[] = [];
  const lines: string[] = [];

  if (from && to) {
    const swapLines = buildSwapCall(from, to, chain, amount);
    lines.push(...swapLines);
  }

  return { variables, lines };
}

function getOtherChain(chain: Chain): Chain {
  if (chain.name === "Sepolia") {
    return Mumbai;
  }
  if (chain.name === "Mumbai") {
    return Sepolia;
  }
  throw new Error(`Chain ${chain.name} is not supported`);
}

function getSetToken(chain: string): string {
  if (chain === "Sepolia") {
    return "SetTokenSepolia";
  }
  if (chain === "Mumbai") {
    return "SetTokenPoly";
  }
  throw new Error(`Chain ${chain} is not supported`);
}

function safeChainName(chain: Chain): string {
  if (chain.name === "Sepolia") {
    return "Sepolia";
  }
  if (chain.name === "Mumbai") {
    return "Polygon";
  }
  throw new Error(`Chain ${chain.name} is not supported`);
}

function buildSwapCall(
  from: ChainToken,
  to: ChainToken,
  chain: Chain,
  quantity: string
): string[] {
  const sourceChain = `"${safeChainName(chain)}"`;
  const destChain = `"${safeChainName(getOtherChain(chain))}"`;
  const setTokenSourceChain = getSetToken(chain.name); // `SET_TOKEN_in_${chain.name}`;
  const sendTokenSourceChain = `"${from.address}"`;
  const sendQuantitySourceChain = 55 * 10 ** 12; // Fixed for now.
  const receiveTokenSourceChain = `"${to.address}"`;
  const minReceiveQuantitySourceChain = 0; // For now.
  const poolFeeSourceChain = 3000; // Fixed for now.

  const variableSwapResult = `result_swap_${from.symbol}_${to.symbol}`;
  const swapCall = `${variableSwapResult} = swap(${sourceChain}, ${destChain}, ${setTokenSourceChain}, ${sendTokenSourceChain}, ${sendQuantitySourceChain}, ${receiveTokenSourceChain}, ${minReceiveQuantitySourceChain}, ${poolFeeSourceChain}, circomProof, circomProofSignal)`;
  const loggingSwapCall = `print(${variableSwapResult})`;
  const swapLines = [swapCall, loggingSwapCall];

  return swapLines;
}

function getTokenInChain(symbol: string, chain: string): string {
  if (chain === "Sepolia" && symbol === "WETH") {
    return WETH_Sepolia.address;
  }
  if (chain === "Sepolia" && symbol === "USDC") {
    return USDC_Sepolia.address;
  }
  if (chain === "Mumbai" && symbol === "WETH") {
    return WETH_Mumbai.address;
  }
  if (chain === "Mumbai" && symbol === "USDC") {
    return USDC_Mumbai.address;
  }

  throw new Error(`Chain ${chain} is not supported`);
}

function buildSendCall(
  from: Chain,
  to: Chain,
  token: ChainToken,
  quantity: string
): string[] {
  const sourceChain = `"${safeChainName(from)}"`;
  const destChain = `"${safeChainName(to)}"`;

  const setTokenDestChain = getSetToken(to.name);
  const sendTokenDestChain = `"${getTokenInChain(token.symbol, to.name)}"`;
  const receiveTokenDestChain = `"${getTokenInChain("USDC", to.name)}"`; // hardcoded for now
  const sendQuantityDestChain = 5 * 10 ** 15; // Of WETH for now.
  const minReceiveTokenQuantityDestChain = 0; // For now.
  const poolFeeDestChain = 3000; // For now.
  const lockReleaseTokenDestChain = sendTokenDestChain;
  const lockReleaseQuantity = 5 * 10 ** 15; // Of WETH for now.;

  const destActionType = 0; // This is a releaseAndSwap;

  const setTokenSourceChain = getSetToken(from.name);
  const lockReleaseTokenSourceChain = `"${getTokenInChain(
    token.symbol,
    from.name
  )}"`;
  const useLink = "True"; // For now.

  const variableSendResult = `result_send_${from.name}_${to.name}`;

  const sendCall = `${variableSendResult} = send(${sourceChain}, ${destChain}, ${setTokenDestChain}, ${sendTokenDestChain}, ${receiveTokenDestChain}, ${sendQuantityDestChain}, ${minReceiveTokenQuantityDestChain}, ${poolFeeDestChain}, ${lockReleaseTokenDestChain}, ${lockReleaseQuantity}, ${destActionType}, ${setTokenSourceChain}, ${lockReleaseTokenSourceChain}, ${useLink}, circomProof, circomProofSignal)`;

  const loggingSendCall = `print(${variableSendResult})`;
  const sendLines = [sendCall, loggingSendCall];

  return sendLines;
}

function parseSendStatement(statement: SendStatement): PythonCode {
  const { data } = statement;
  if (!data) {
    return { variables: [], lines: [] };
  }

  const { from, to, token, amount } = data;
  const variables: string[] = [];
  const lines: string[] = [];
  // (5*10**15) is quantity
  if (from && to && token) {
    const sendLines = buildSendCall(from, to, token, amount);
    lines.push(...sendLines);
  }

  return { variables, lines };
}

function parseSentence(statement: Statement): PythonCode {
  if (statement.type === StatementType.IF_ELSE) {
    return parseIfElseStatement(statement);
  }
  if (statement.type === StatementType.SWAP) {
    return parseSwapStatement(statement);
  }
  if (statement.type === StatementType.SEND) {
    return parseSendStatement(statement);
  }
  if (statement.type === StatementType.ELSE) {
    return parseElseStatement(statement);
  }
  return { variables: [], lines: [] };
}

type PythonCode = {
  variables: string[];
  lines: string[];
};

function parseAllStatements(statements: Statement[]): PythonCode {
  const pythonCode: PythonCode = {
    variables: [],
    lines: [],
  };
  statements.forEach((statement, index) => {
    // Special case for Swap after a Send.
    if (
      statement.type === StatementType.SWAP &&
      statements[index - 1]?.type === StatementType.SEND
    ) {
      // This is because, we do everything in the same call.
      return;
    }
    const code = parseSentence(statement);
    pythonCode.variables.push(...code.variables);
    pythonCode.lines.push(...code.lines);
  });

  return pythonCode;
}

function replacedConditionWithCircom(pythonCode: PythonCode) {
  const { variables, lines } = pythonCode;
  if (lines.length === 0) {
    return 0;
  }
  let alreadyChangedFirstIf = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("if ")) {
      if (!alreadyChangedFirstIf) {
        lines[i] = "if circomSignal == 1:";
        alreadyChangedFirstIf = true;
      } else {
        lines[i] = `${TAB}if circomSignal == 2:`;
      }
    }
  }

  const line1 = `Deviation = int((SepoliaPrice / MumbaiPrice - 1) * 10**6)`;
  const line2 = `Threshold = int(0.00001 * 10**6)`; // input from user
  const line3 = `circom = runcircom(Deviation, Threshold) `;
  const line4 = `circomSignal = circom['signal']`;
  const line5 = `circomProof = circom['zkproof']`;
  const line6 = `circomProofSignal = circom['zkproofSignal']`;

  variables.push(line1);
  variables.push(line2);
  variables.push(line3);
  variables.push(line4);
  variables.push(line5);
  variables.push(line6);
}

export function parse(statements: Statement[]): string {
  const pythonCode = parseAllStatements(statements);

  replacedConditionWithCircom(pythonCode);

  const pythonLines = pythonCode.lines.join(`\n${TAB}`);
  const pythonVariables = pythonCode.variables.join(`\n${TAB}`);

  // console.log(pythonVariables);
  // console.log(pythonLines);

  // This Tabs are just because the Python code is inside a if/else statements.
  // There is this warning in VScode but I thinks it's fine.
  // https://stackoverflow.com/questions/5685406/inconsistent-use-of-tabs-and-spaces-in-indentation
  return `${pythonVariables}\n${TAB}${pythonLines}`;
}
