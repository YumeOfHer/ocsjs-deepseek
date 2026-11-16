import type { SearchInformation } from '@ocsjs/core';

export interface DeepSeekConfig {
	enabled: boolean;
	apiKey: string;
	model?: string;
}

export interface DeepSeekQuestion {
	title: string;
	options?: string;
	type?: string;
}

interface DeepSeekResponse {
	choices?: Array<{
		message?: {
			content?: string;
		};
	}>;
	error?: {
		message?: string;
	};
}

interface DeepSeekAnswer {
	answer?: string;
	explanation?: string;
	confidence?: number;
}

function parseAnswer(content: string): DeepSeekAnswer {
	const cleaned = content
		.replace(/```(?:json)?\s*/gi, '')
		.replace(/```/g, '')
		.trim();

	try {
		return JSON.parse(cleaned) as DeepSeekAnswer;
	} catch {
		const start = cleaned.indexOf('{');
		const end = cleaned.lastIndexOf('}');

		if (start >= 0 && end > start) {
			try {
				return JSON.parse(cleaned.slice(start, end + 1)) as DeepSeekAnswer;
			} catch {
				// Fall through to the explicit error below.
			}
		}

		throw new Error('DeepSeek 返回内容无法解析为 JSON：' + cleaned);
	}
}

export async function askDeepSeek(config: DeepSeekConfig, question: DeepSeekQuestion): Promise<SearchInformation[]> {
	if (!config.enabled) return [];

	const apiKey = config.apiKey?.trim();

	if (!apiKey) {
		throw new Error('尚未配置 DeepSeek API Key');
	}

	if (!question.title?.trim()) {
		throw new Error('题目内容为空，无法请求 DeepSeek');
	}

	const model = config.model?.trim() || 'deepseek-chat';

	const prompt = [
		'【题目分析任务】',
		'请分析下面提供的题目、题型和选项，给出最可能正确的答案。',
		'优先完成作答，不要因为不能百分之百确定就轻易拒答。',
		'结合题目内容、选项、上下文和已有知识进行推理。',
		'不得编造题目中不存在的材料、数据或事实。',
		'如果信息不足但仍可推断，应给出最合理答案并降低置信度。',
		'',
		`题型：${question.type || '未知'}`,
		`题目：${question.title}`,
		`选项：${question.options || '无'}`,
		'',
		'请按照 System 指定的 JSON 格式返回结果。'
	].join('\n');

	let response: Response;

	try {
		response = await fetch('https://api.deepseek.com/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model,
				messages: [
					{
						role: 'system',
						content: `你是OCS自动答题系统的答题引擎。唯一任务：根据题目、题型、选项，判断正确答案，严格按指定JSON格式返回，供程序自动识别填充。
【一、最高优先级规则】
1.必须优先给出答案，禁止输出推理、分析、解释或任何无关内容。
2.禁止因无法100%确定而拒答，必须根据已有知识给出最可能正确的答案。
3.必须先识别题型，再按对应题型格式作答。
4.答案必须简洁、准确、规范，不得添加题目未要求的内容。
5.严禁把解析、理由、知识点、置信度说明写入answer字段。
【二、各题型答案格式】
1.单选题：只输出选项字母，例如"B"。禁止输出选项内容或解释。
2.多选题：只输出所有正确选项字母，例如"ACD"。按选项出现顺序排列，不加空格、逗号或任何符号。
3.判断题：只能输出"正确"或"错误"。禁止输出"对""错""是""否"等变体。
4.填空题：只输出需填写的文字、词语、数字或短语。多个空按题目顺序用英文分号";"分隔。禁止加"答案是"等前缀。
5.简答题：直接输出完整、准确的答案内容，禁止输出分析过程。
6.计算题：只输出最终计算结果，必要时保留单位，禁止输出计算步骤。
【三、判断原则】
1.以题目考查的核心知识事实为判断依据。
2.不得仅因题干语法错误、措辞不规范或标点问题就判定答案错误。
3.选择题必须逐项判断，不得遗漏正确选项。
4.不得凭空编造事实、数据或选项。
5.信息不足时仍给出最合理答案，并适当降低confidence。
【四、强制JSON输出格式】
必须严格返回以下JSON结构：
{"answer":"最终答案","confidence":0.95}
字段要求：answer为字符串，只能包含最终答案；confidence为0到1之间的数字，表示置信程度。
【五、绝对禁止】
-禁止输出Markdown代码块。
-禁止输出JSON以外的任何文字。
-禁止输出解析、解释、推理过程。
-禁止输出"答案：""解析："等前缀。
-禁止在answer字段中包含置信度。
-禁止增加JSON结构以外的字段。
-禁止返回多个答案对象。
最终输出必须是一个合法、完整、可直接被JSON.parse()解析的JSON对象。`
					},
					{
						role: 'user',
						content: prompt
					}
				],
				temperature: 0,
				stream: false
			})
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);

		throw new Error('无法连接 DeepSeek API。请检查网络、浏览器跨域限制和 API 地址：' + message);
	}

	const raw = await response.text();

	let data: DeepSeekResponse;

	try {
		data = JSON.parse(raw) as DeepSeekResponse;
	} catch {
		throw new Error(`DeepSeek 返回了无法识别的数据，HTTP ${response.status}：${raw.slice(0, 500)}`);
	}

	if (!response.ok) {
		throw new Error(data.error?.message || `DeepSeek 请求失败：HTTP ${response.status}`);
	}

	const answerContent = data.choices?.[0]?.message?.content;

	if (!answerContent?.trim()) {
		throw new Error('DeepSeek 没有返回有效答案');
	}

	const result = parseAnswer(answerContent);

	if (!result.answer?.trim()) {
		throw new Error('DeepSeek 返回结果中没有答案');
	}

	const confidence = Number(result.confidence);

	const normalizedConfidence = Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : null;

	const explanation = result.explanation?.trim() || 'AI 未提供详细解析';

	const visibleAnswer = result.answer.trim();

	return [
		{
			name: `DeepSeek (${model})`,
			results: [
				{
					question: question.title,
					answer: visibleAnswer,
					extra_data: {
						ai: true,
						explanation,
						confidence: normalizedConfidence,
						model
					}
				}
			]
		}
	];
}
