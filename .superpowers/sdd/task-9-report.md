# Task 9: Trends Schema + Prompt

## Status
✅ Completed

## Commit SHA
`pending`

## What Changed

Created Zod schema and system prompt for lab result trend analysis.

**Files:**
- Created: `lib/ai/prompts/trends.ts`
- Modified: `__tests__/unit/prompts.test.ts` (added 4 test cases)

**Implementation:**
- `trendAnalysisSchema`: Zod schema for trend analysis output with fields:
  - `metricName`: String (lab metric name)
  - `trend`: Enum ["rising", "falling", "stable", "fluctuating"]
  - `significant`: Boolean (clinically significant flag)
  - `summary`: String (plain-language explanation)
  - `dataPoints`: Array of data point objects (date, value, unit, referenceRange, status)
- `TrendAnalysisResult`: TypeScript type inferred from schema
- `trendAnalysisSystemPrompt`: System prompt for LLM with rules for trend classification and output format

## Test Results

**RED Phase:** Test failed with `Cannot find package '@/lib/ai/prompts/trends'` (expected)

**GREEN Phase:** 19/19 tests passing (15 existing + 4 new trend analysis tests)

**Test Cases:**
1. ✅ Validates correct trend analysis output (rising trend)
2. ✅ Validates stable trend
3. ✅ Rejects invalid trend value ("increasing" not in enum)
4. ✅ Rejects missing metricName

## Concerns
None — implementation follows existing patterns in codebase (prescreen.ts, summary.ts, etc.)
