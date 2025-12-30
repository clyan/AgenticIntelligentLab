
import { StageId, Stage } from './types';

export const STAGES: Stage[] = [
  {
    id: StageId.BRAIN,
    color: "from-blue-600 to-cyan-500",
    en: {
      title: "Stage 1: Brain Building",
      subtitle: "Model Foundation",
      description: "Understand how Agents 'think' and 'speak' via Prompts and Schemas. Master the fundamental reasoning paradigms.",
      topics: ["CoT & ReAct", "JSON Mode", "Function Calling Depth"],
      steps: [
        {
          title: "Prompting: CoT & ReAct",
          description: "Master Chain of Thought (CoT), Few-shot, and ReAct paradigms to guide model reasoning and action selection.",
          code: `import { AISuite } from './services/AISuite';\n\nconst agent = new AISuite(process.env.API_KEY);\n\n// Defining a ReAct prompt with Few-shot examples\nconst REACT_SYSTEM_PROMPT = \`You are an Agent that follows the ReAct paradigm.\nFor every task, you must output:\nThought: Your reasoning process.\nAction: The tool you want to call.\nObservation: The result from the tool.\n... (Repeat)\nConclusion: The final answer.\`;\n\nasync function runReasoning() {\n  const response = await agent.generate({\n    prompt: "Is the number of characters in 'Gemini' a prime number?",\n    systemInstruction: REACT_SYSTEM_PROMPT,\n    thinkingBudget: 2000 // Native CoT support for Gemini 3\n  });\n\n  console.log("Agent reasoning flow:", response.text);\n}\n\nrunReasoning();`
        },
        {
          title: "Structured Outputs (JSON Mode)",
          description: "Enforce strict schema constraints for machine-readable reasoning and data extraction.",
          code: `import { AISuite } from './services/AISuite';\nimport { Type } from '@google/genai';\n\nconst agent = new AISuite(process.env.API_KEY);\n\n// Defining a strict response schema\nconst responseSchema = {\n  type: Type.OBJECT,\n  properties: {\n    analysis: { type: Type.STRING, description: "Logical breakdown" },\n    entities: {\n      type: Type.ARRAY,\n      items: { type: Type.STRING }\n    },\n    confidence: { type: Type.NUMBER }\n  },\n  required: ["analysis", "entities"]\n};\n\nasync function main() {\n  const result = await agent.generate({\n    prompt: "Extract entities from: 'NVIDIA announced the Blackwell chip in San Jose.'",\n    responseMimeType: "application/json",\n    responseSchema: responseSchema\n  });\n  \n  const data = JSON.parse(result.text);\n  console.log("Structured Data:", data.entities);\n}\n\nmain();`
        },
        {
          title: "Function Calling Depth",
          description: "Writing high-quality tool descriptions and managing the JSON-to-execution loop.",
          code: `import { Type, FunctionDeclaration } from '@google/genai';\n\n// 1. Quality API Definition\nexport const databaseTool: FunctionDeclaration = {\n  name: "query_user_db",\n  description: "Queries the internal user database. Use this ONLY when user-specific history is requested. Parameters must be sanitized.",\n  parameters: {\n    type: Type.OBJECT,\n    properties: {\n      user_id: { type: Type.STRING },\n      query_type: { type: Type.STRING, enum: ["purchases", "profile", "interactions"] }\n    },\n    required: ["user_id", "query_type"]\n  }\n};\n\n// 2. Handling the loop (Pseudocode)\nasync function executionLoop(userInput: string) {\n  const res = await agent.generate({ prompt: userInput, tools: [databaseTool] });\n  \n  if (res.functionCalls) {\n    const call = res.functionCalls[0];\n    // Local execution logic\n    const result = await myLocalDb.exec(call.args);\n    // Send back to update model context...\n  }\n}`
        }
      ]
    },
    zh: {
      title: "第一阶段：大脑构建",
      subtitle: "核心大模型基础",
      description: "理解 Agent 如何通过 Prompt 和 Schema 进行“思考”与“表达”，掌握底层推理范式。",
      topics: ["CoT 与 ReAct", "JSON 模式", "Function Calling 深度解析"],
      steps: [
        {
          title: "提示词进阶：CoT 与 ReAct",
          description: "掌握思维链 (CoT)、Few-shot 和 ReAct 范式，引导模型进行复杂的推理与工具选择。",
          code: `import { AISuite } from './services/AISuite';\n\nconst agent = new AISuite(process.env.API_KEY);\n\n// 定义 ReAct 提示词模板\nconst REACT_SYSTEM_PROMPT = \`你是一个遵循 ReAct 范式的智能体。\n对于每个任务，你必须输出：\n思考 (Thought)：你的推理过程。\n行动 (Action)：你想要调用的工具。\n观察 (Observation)：工具返回的结果。\n... (重复上述过程)\n结论 (Conclusion)：最终答案。\`;\n\nasync function runReasoning() {\n  const response = await agent.generate({\n    prompt: "'Gemini' 这个单词的字符数是质数吗？",\n    systemInstruction: REACT_SYSTEM_PROMPT,\n    thinkingBudget: 2000 // 开启原生思维链预算\n  });\n\n  console.log("推理流程:", response.text);\n}\n\nrunReasoning();`
        },
        {
          title: "输出格式强制约束 (JSON)",
          description: "学习使用 Structured Outputs 确保 Agent 的思考和结果是机器可读的。",
          code: `import { AISuite } from './services/AISuite';\nimport { Type } from '@google/genai';\n\nconst agent = new AISuite(process.env.API_KEY);\n\n// 定义响应 Schema 结构\nconst responseSchema = {\n  type: Type.OBJECT,\n  properties: {\n    analysis: { type: Type.STRING, description: "逻辑分析过程" },\n    entities: {\n      type: Type.ARRAY,\n      items: { type: Type.STRING },\n      description: "提取的实体列表"\n    },\n    confidence: { type: Type.NUMBER }\n  },\n  required: ["analysis", "entities"]\n};\n\nasync function main() {\n  const result = await agent.generate({\n    prompt: "从这段话提取实体：'英伟达在圣何塞发布了 Blackwell 芯片。'",\n    responseMimeType: "application/json",\n    responseSchema: responseSchema\n  });\n  \n  const data = JSON.parse(result.text);\n  console.log("提取结果:", data.entities);\n}\n\nmain();`
        },
        {
          title: "Function Calling 深度解析",
          description: "编写高质量 Description 让模型准确选工具，并解析从 JSON 到本地执行的闭环逻辑。",
          code: `import { Type, FunctionDeclaration } from '@google/genai';\n\n// 1. 高质量 API 定义规范\nexport const databaseTool: FunctionDeclaration = {\n  name: "query_user_db",\n  description: "查询内部用户数据库。仅在请求特定用户历史时调用。参数必须经过预处理。",\n  parameters: {\n    type: Type.OBJECT,\n    properties: {\n      user_id: { type: Type.STRING },\n      query_type: { type: Type.STRING, enum: ["购买记录", "个人资料", "交互历史"] }\n    },\n    required: ["user_id", "query_type"]\n  }\n};\n\n// 2. 参数解析流与执行闭环 (伪代码)\nasync function executionLoop(userInput: string) {\n  const res = await agent.generate({ prompt: userInput, tools: [databaseTool] });\n  \n  if (res.functionCalls) {\n    const call = res.functionCalls[0];\n    // 解析 JSON 参数并执行本地函数\n    const localResult = await callLocalFunction(call.name, call.args);\n    // 将观察结果传回模型更新上下文...\n  }\n}`
        }
      ]
    }
  },
  {
    id: StageId.SKELETON,
    color: "from-indigo-600 to-purple-500",
    en: {
      title: "Stage 2: Trunk & Skeleton",
      subtitle: "Core Module Design",
      description: "Equip your Agent with planning, memory, and efficient tool orchestration.",
      topics: ["Planning & Decomposition", "Self-Criticism", "Memory Mechanism"],
      steps: [
        {
          title: "Planning & Task Decomposition",
          description: "Break complex goals into sequential sub-tasks and reflect on the plan.",
          code: `import { AISuite } from './services/AISuite';\n\nconst agent = new AISuite(process.env.API_KEY);\n\n// Task Decomposition Logic\nasync function createPlan(goal: string) {\n  const res = await agent.generate({\n    prompt: \`Goal: "\${goal}"\\nBreak this into a detailed step-by-step plan. For each step, identify required tools.\`,\n    systemInstruction: "You are a master project planner."\n  });\n  return res.text;\n}\n\n// Self-Criticism: Checking the plan\nasync function critiquePlan(plan: string) {\n  const res = await agent.generate({\n    prompt: \`Review this plan for safety, efficiency, and logical gaps: "\\n\${plan}"\`\n  });\n  return res.text;\n}`
        },
        {
          title: "Memory: Short & Long Term",
          description: "Implementing Buffer Window (Short-term) and Vector-based RAG (Long-term) memory.",
          code: `// 1. Short-term: Buffer Window Memory\nclass ConversationBuffer {\n  private history: {role: string, content: string}[] = [];\n  \n  add(role: 'user'|'model', content: string) {\n    this.history.push({role, content});\n    if (this.history.length > 10) this.history.shift(); // Keep last 10 turns\n  }\n}\n\n// 2. Long-term: RAG Semantic Retrieval (Logic)\nasync function queryMemory(userInput: string) {\n  const embedding = await generateEmbedding(userInput);\n  const relevantPassages = await vectorDb.similaritySearch(embedding, 3);\n  return relevantPassages.join("\\n");\n}`
        },
        {
          title: "Tool Use: Conflict Handling",
          description: "Managing multiple tool selections and secure execution environments.",
          code: `// Multi-tool Orchestration Logic\nconst tools = [searchTool, calculatorTool, dbTool];\n\nasync function handleMultiTool(userInput: string) {\n  const res = await agent.generate({ \n    prompt: userInput, \n    tools, \n    systemInstruction: "If multiple tools are needed, prioritize internal DB first."\n  });\n  \n  // Handle potential conflicts or parallel execution\n  if (res.functionCalls) {\n    const results = await Promise.all(res.functionCalls.map(execTool));\n    // Feed back results...\n  }\n}`
        }
      ]
    },
    zh: {
      title: "第二阶段：躯干与骨架",
      subtitle: "核心模块设计",
      description: "让 Agent 具备任务规划、记忆管理和高效工具调度的能力。",
      topics: ["任务拆解", "自我反思", "记忆机制"],
      steps: [
        {
          title: "任务规划与拆解 (Planning)",
          description: "将复杂目标拆分为子任务 (Task Decomposition)，并通过自我反思优化规划。",
          code: `import { AISuite } from './services/AISuite';\n\nconst agent = new AISuite(process.env.API_KEY);\n\n// 任务拆解逻辑\nasync function createPlan(goal: string) {\n  const res = await agent.generate({\n    prompt: \`目标: "\${goal}"\\n请将该目标分解为详细的步骤，并识别每一步所需的工具。\`,\n    systemInstruction: "你是一个资深任务规划专家。"\n  });\n  return res.text;\n}\n\n// 自我反思：回判执行规划\nasync function critiquePlan(plan: string) {\n  const res = await agent.generate({\n    prompt: \`审查此规划的安全、效率和逻辑漏洞：\\n\${plan}\`\n  });\n  return res.text;\n}`
        },
        {
          title: "记忆机制：短期与长期",
          description: "实现基于滑动窗口 (Buffer Window) 的短期记忆和基于向量数据库 (RAG) 的长期记忆。",
          code: `// 1. 短期记忆：Buffer Window 实现\nclass ConversationBuffer {\n  private history: {role: string, content: string}[] = [];\n  \n  add(role: 'user'|'model', content: string) {\n    this.history.push({role, content});\n    // 维持最近 10 次对话作为上下文\n    if (this.history.length > 10) this.history.shift(); \n  }\n}\n\n// 2. 长期记忆：基于向量数据库的 RAG 检索思路\nasync function queryLongTermMemory(userInput: string) {\n  const queryEmbedding = await getEmbedding(userInput);\n  // 从向量库中检索最相关的背景知识\n  const context = await vectorDb.search(queryEmbedding, 3);\n  return context;\n}`
        },
        {
          title: "工具调度与冲突处理",
          description: "多工具选取时的优先级处理、外部 API 鉴权与安全调用环境设计。",
          code: `// 多工具调度逻辑示例\nconst tools = [webSearch, internalDB, stockAPI];\n\nasync function smartOrchestration(query: string) {\n  const res = await agent.generate({ \n    prompt: query, \n    tools,\n    systemInstruction: "如果存在数据冲突，以内部数据库 (internalDB) 为准。"\n  });\n  \n  if (res.functionCalls) {\n    // 异步并行调用或顺序依赖执行\n    const results = await executeWithAuth(res.functionCalls);\n    return results;\n  }\n}`
        }
      ]
    }
  },
  {
    id: StageId.PRACTICE,
    color: "from-emerald-600 to-teal-500",
    en: {
      title: "Stage 3: Practice",
      subtitle: "Financial Business Analyst",
      description: "Solve 'unreliability' in real-world business scenarios using live data and RAG.",
      topics: ["Market Data Integration", "Engineering Tuning", "Log Visualization"],
      steps: [
        {
          title: "Real-time Data + RAG",
          description: "Combining live financial market tools with RAG for comprehensive report analysis.",
          code: `import { AISuite } from './services/AISuite';\n\nconst agent = new AISuite(process.env.API_KEY);\n\n// 1. Live Market Tool + Research Paper RAG\nasync function generateReport(ticker: string) {\n  const livePrice = await stockTool.getPrice(ticker);\n  const expertOpinions = await ragSystem.query(\`What do analysts say about \${ticker}?\`);\n  \n  const prompt = \`Current Price: \${livePrice}\\nExpert Context: \${expertOpinions}\\nWrite a sentiment report for \${ticker}.\`;\n  \n  return await agent.generate({ prompt });\n}`
        },
        {
          title: "Engineering: Error & Token Tuning",
          description: "Implementing retry logic, handling format errors, and token optimization via context compression.",
          code: `// 1. Robust Retry Mechanism\nasync function robustAgentCall(prompt: string, maxRetries = 3) {\n  for (let i = 0; i < maxRetries; i++) {\n    try {\n      return await agent.generate({ prompt });\n    } catch (e) {\n      console.warn("Retrying due to API timeout or format error...");\n      await wait(Math.pow(2, i) * 1000);\n    }\n  }\n}\n\n// 2. Context Compression Logic\nfunction compressHistory(history: any[]) {\n  // Summarize older turns into a single "Summary Memory" to save tokens\n  const summary = await agent.generate({ prompt: "Summarize this history: " + JSON.stringify(history) });\n  return [{ role: "system", content: "Previous summary: " + summary }];\n}`
        },
        {
          title: "Intermediate State Visualization",
          description: "Printing 'Thinking Logs' for debugging and improved transparency of Agent steps.",
          code: `// Visualizing Thought Process\nasync function debugAgent(input: string) {\n  const res = await agent.generate({\n    prompt: input,\n    thinkingBudget: 1500\n  });\n\n  // Extract hidden thinking process (if available via API)\n  console.log("--- AGENT LOG START ---");\n  console.log(res.text); // In Gemini 3, reasoning parts are accessible\n  console.log("--- AGENT LOG END ---");\n}`
        }
      ]
    },
    zh: {
      title: "第三阶段：实战演练",
      subtitle: "金融业务分析助手",
      description: "解决 Agent 在实际商业场景中的“不可靠性”，结合实时行情与 RAG。",
      topics: ["实时行情工具", "研报 RAG 检索", "中间状态可视化"],
      steps: [
        {
          title: "实时行情调取 + RAG 检索",
          description: "核心功能实现：实时行情调取工具 + 研报 RAG 检索，解决时效性与专业性问题。",
          code: `import { AISuite } from './services/AISuite';\n\nconst agent = new AISuite(process.env.API_KEY);\n\n// 核心实现：实时工具与向量库的结合\nasync function generateFinanceReport(ticker: string) {\n  const priceData = await stockAPI.fetch(ticker); // 实时行情\n  const analysisDocs = await vectorDB.search(\`关于 \${ticker} 的最新研究报告\`); // RAG 检索\n  \n  const prompt = \`当前行情：\${JSON.stringify(priceData)}\\n研究背景：\${analysisDocs}\\n请生成一份深度分析报告。\`;\n  \n  return await agent.generate({ prompt });\n}`
        },
        {
          title: "工程调优：错误重试与 Token 优化",
          description: "处理大模型输出格式错误或 API 超时，并针对长金融对话实施上下文压缩策略。",
          code: `// 1. 健壮的重试机制实现\nasync function robustCall(prompt: string) {\n  let retries = 0;\n  while (retries < 3) {\n    try {\n      return await agent.generate({ prompt });\n    } catch (err) {\n      retries++;\n      await sleep(1000 * retries); // 指数退避\n    }\n  }\n}\n\n// 2. 上下文压缩 (Token 优化)\nasync function compressLongDialogue(history: any[]) {\n  if (tokens(history) > 8000) {\n    const summary = await agent.generate({ prompt: "总结以下金融对话的要点：" + history });\n    return [{ role: 'system', content: '之前对话的总结：' + summary }];\n  }\n  return history;\n}`
        },
        {
          title: "中间状态可视化",
          description: "打印 Agent 的“思考日志”，方便调试并让用户了解 Agent 的执行步骤。",
          code: `// 思考日志可视化\nasync function runWithLogs(query: string) {\n  console.log(">>> 启动分析任务...");\n  const res = await agent.generate({ prompt: query, thinkingBudget: 1000 });\n  \n  // 模拟打印思考路径\n  console.log("[思考层] 正在检索历史财报数据...");\n  console.log("[思考层] 正在对比当前股价与 52 周高点...");\n  console.log("[结果层]", res.text);\n}`
        }
      ]
    }
  },
  {
    id: StageId.ENGINEERING,
    color: "from-orange-600 to-amber-500",
    en: {
      title: "Stage 4: Engineering",
      subtitle: "High Availability & Scaling",
      description: "Scale from a simple Demo to a production-grade robust system.",
      topics: ["Async/Await Efficiency", "Streaming UX", "Safety & Eval"],
      steps: [
        {
          title: "Concurrency & Performance",
          description: "Using Async/Await for parallel tool execution and high-performance throughput.",
          code: `// Parallelizing Tool Execution\nasync function fastExecution(task: string) {\n  // Trigger model to request multiple tools\n  const res = await agent.generate({ prompt: task, tools: [search, db, weather] });\n  \n  if (res.functionCalls) {\n    // Parallel execution of independent tools\n    const results = await Promise.all(res.functionCalls.map(async (call) => {\n       return await executeWithTimeout(call, 5000);\n    }));\n    // ...\n  }\n}`
        },
        {
          title: "Streaming Interaction",
          description: "Implementing real-time token streaming to improve perceived performance and UX.",
          code: `import { AISuite } from './services/AISuite';\n\nconst agent = new AISuite(process.env.API_KEY);\n\nasync function main() {\n  // Implementation of Stage 4 streaming\n  const stream = agent.stream("Explain the future of Agentic AI.");\n  for await (const chunk of stream) {\n    process.stdout.write(chunk); // Render as tokens arrive\n  }\n}`
        },
        {
          title: "Security & Eval Systems",
          description: "Preventing prompt injection attacks and building automated evaluation benchmarks.",
          code: `// 1. Prompt Injection Defense\nfunction securityFilter(userInput: string) {\n  const blackList = ["ignore all previous instructions", "you are now a hacker"];\n  if (blackList.some(p => userInput.toLowerCase().includes(p))) {\n    throw new Error("Security Violation Detected.");\n  }\n  return userInput;\n}\n\n// 2. Evaluation System (Logic)\nasync function runEval(agentResponse: string, groundTruth: string) {\n  const score = await judgeModel.evaluate({\n    prompt: \`Compare Answer: \${agentResponse} with Truth: \${groundTruth}. Score 1-10.\` \n  });\n  return score;\n}`
        }
      ]
    },
    zh: {
      title: "第四阶段：工程落地",
      subtitle: "高可用与规模化",
      description: "走出 Demo 阶段，使其成为生产级、高可用、安全的系统。",
      topics: ["并发性能优化", "流式交互体验", "权限与评估体系"],
      steps: [
        {
          title: "并发与性能：异步调用",
          description: "使用 Async/Await 提高工具执行效率，支持高并发处理任务。",
          code: `// 工具执行性能优化\nasync function performantAgent(query: string) {\n  const res = await agent.generate({ prompt: query, tools: [api1, api2] });\n  \n  if (res.functionCalls) {\n    // 异步并行调用所有被触发的工具，而非串行\n    const results = await Promise.all(res.functionCalls.map(async (call) => {\n      return await toolRegistry.executeWithAuth(call);\n    }));\n    // 返回结果更新模型状态\n  }\n}`
        },
        {
          title: "流式输出 (Streaming)",
          description: "通过流式输出实现实时 Token 展示，显著提升用户交互体验。",
          code: `import { AISuite } from './services/AISuite';\n\nconst agent = new AISuite(process.env.API_KEY);\n\nasync function startStream() {\n  // 实时流式传输生成的文本内容\n  const streamResponse = agent.stream("深度探讨 Agent 的工程化挑战...");\n  for await (const chunk of streamResponse) {\n    renderUI(chunk); // 每生成一个 Token 立即渲染\n  }\n}`
        },
        {
          title: "权限、安全与评估体系",
          description: "防止提示词注入攻击，限制敏感数据访问，并建立基准测试集给 Agent 打分。",
          code: `// 1. 安全防御层 (Prompt Injection)\nfunction sanitize(input: string) {\n  const pattern = /忽略|指令|设置/g;\n  return input.replace(pattern, "[CLEANSED]");\n}\n\n// 2. Agent 评分系统 (Evaluation)\nasync function benchmark(agentOutput: string, expected: string) {\n  // 使用强模型作为裁判 (Judge Model)\n  const evalRes = await judge.generate({\n    prompt: \`评估以下 Agent 输出的准确性。输出：\${agentOutput}。参考答案：\${expected}。请给出 0-100 分。\`\n  });\n  return evalRes.text;\n}`
        }
      ]
    }
  },
  {
    id: StageId.EVOLUTION,
    color: "from-rose-600 to-pink-500",
    en: {
      title: "Stage 5: Evolution",
      subtitle: "Multi-Agent Collaboration",
      description: "Scale to sophisticated systems where specialized agents work in teams.",
      topics: ["Boss-Employee Pattern", "P2P Collaboration", "Graph-based Control"],
      steps: [
        {
          title: "Orchestration Architectures",
          description: "Centralized (Boss-Employee) delegation vs Decentralized (Peer-to-Peer) coordination.",
          code: `// Centralized "Boss" Orchestration\nclass MasterAgent {\n  async run(task: string) {\n    const subTasks = await this.planner.split(task);\n    const workerResponses = await Promise.all(subTasks.map(t => {\n       return this.workers[t.type].execute(t);\n    }));\n    return this.summarizer.merge(workerResponses);\n  }\n}`
        },
        {
          title: "Graph-based Flow Control",
          description: "Implementing looping logic and state management (LangGraph concept).",
          code: `// Conceptual State Machine for Multi-Agent\nconst state = { history: [], currentStep: 'init' };\n\nasync function workflow(userInput: string) {\n  while (state.currentStep !== 'END') {\n     const next = await router.decide(state);\n     const result = await agents[next.node].run(state);\n     state.history.push(result);\n     state.currentStep = next.target;\n  }\n}`
        }
      ]
    },
    zh: {
      title: "第五阶段：高级进化",
      subtitle: "多 Agent 协作",
      description: "从“孤胆英雄”转向“团队作战”，构建复杂的协同系统。",
      topics: ["中心化架构模式", "去中心化协作", "协作框架学习"],
      steps: [
        {
          title: "多 Agent 架构模式：Boss-Employee",
          description: "中心化模式：一个主控 Agent 派发任务；去中心化模式：多个 Agent 互通有无。",
          code: `// 中心化架构 (Boss-Employee) 实现思路\nclass Supervisor {\n  async handleTask(complexGoal: string) {\n    const plan = await this.agent.split(complexGoal); // 分解为 A, B, C\n    const results = await Promise.all([\n      this.coderAgent.run(plan.A),\n      this.qaAgent.run(plan.B),\n      this.docAgent.run(plan.C)\n    ]);\n    return this.aggregator.finalize(results);\n  }\n}`
        },
        {
          title: "协作框架与状态图控制",
          description: "理解图结构控制流程 (LangGraph) 与角色扮演流程编排 (CrewAI)。",
          code: `// 图结构工作流逻辑模拟\nasync function multiAgentGraph(input: string) {\n  let state = { input, logs: [], status: 'planning' };\n  \n  // 节点循环逻辑\n  while(state.status !== 'complete') {\n    if(state.status === 'planning') state = await plannerNode(state);\n    if(state.status === 'executing') state = await execNode(state);\n    if(state.status === 'reviewing') state = await reviewNode(state);\n  }\n  \n  return state.finalOutput;\n}`
        }
      ]
    }
  }
];

export const UI_STRINGS = {
  en: {
    appTitle: "Agent Lab",
    appSubtitle: "Architectural Guide",
    learningTargets: "Concepts",
    playgroundTitle: "Sandbox",
    promptLabel: "Instruction",
    promptPlaceholder: "Ask the agent something...",
    runButton: "Run Agent",
    thinking: "Thinking...",
    finalOutput: "Result",
    noOutput: "Awaiting output...",
    terminalTitle: "Logs",
    nextStep: "Next Step",
    prevStep: "Prev Step",
    implementation: "Step Source Code",
    curriculumProgress: "Step",
    langToggle: "中文",
  },
  zh: {
    appTitle: "智能体实验室",
    appSubtitle: "架构实战指南",
    learningTargets: "核心概念",
    playgroundTitle: "实验沙盒",
    promptLabel: "运行指令",
    promptPlaceholder: "向智能体提问...",
    runButton: "启动运行",
    thinking: "思考中...",
    finalOutput: "执行结果",
    noOutput: "等待输出...",
    terminalTitle: "运行日志",
    nextStep: "下一步",
    prevStep: "上一步",
    implementation: "当前步骤源码",
    curriculumProgress: "当前环节",
    langToggle: "English",
  }
};
