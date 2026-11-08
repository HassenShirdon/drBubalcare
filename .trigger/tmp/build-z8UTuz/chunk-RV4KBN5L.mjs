import {
  require_auth_errors,
  require_token_error,
  require_token_util
} from "./chunk-KOYVPRES.mjs";
import {
  ZodFirstPartyTypeKind,
  external_exports,
  safeParseAsync,
  toJSONSchema
} from "./chunk-UTPLH5KB.mjs";
import {
  EventSourceParserStream
} from "./chunk-N2VJDWOE.mjs";
import {
  __commonJS,
  __name,
  __toESM,
  init_esm
} from "./chunk-JUPALWCH.mjs";

// node_modules/.pnpm/@vercel+oidc@3.2.0/node_modules/@vercel/oidc/dist/get-context.js
var require_get_context = __commonJS({
  "node_modules/.pnpm/@vercel+oidc@3.2.0/node_modules/@vercel/oidc/dist/get-context.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name24 in all)
        __defProp2(target, name24, { get: all[name24], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var get_context_exports = {};
    __export2(get_context_exports, {
      SYMBOL_FOR_REQ_CONTEXT: /* @__PURE__ */ __name(() => SYMBOL_FOR_REQ_CONTEXT, "SYMBOL_FOR_REQ_CONTEXT"),
      getContext: /* @__PURE__ */ __name(() => getContext3, "getContext")
    });
    module.exports = __toCommonJS(get_context_exports);
    var SYMBOL_FOR_REQ_CONTEXT = Symbol.for("@vercel/request-context");
    function getContext3() {
      const fromSymbol = globalThis;
      return fromSymbol[SYMBOL_FOR_REQ_CONTEXT]?.get?.() ?? {};
    }
    __name(getContext3, "getContext");
  }
});

// node_modules/.pnpm/@vercel+oidc@3.2.0/node_modules/@vercel/oidc/dist/get-vercel-oidc-token.js
var require_get_vercel_oidc_token = __commonJS({
  "node_modules/.pnpm/@vercel+oidc@3.2.0/node_modules/@vercel/oidc/dist/get-vercel-oidc-token.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name24 in all)
        __defProp2(target, name24, { get: all[name24], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var get_vercel_oidc_token_exports = {};
    __export2(get_vercel_oidc_token_exports, {
      getVercelOidcToken: /* @__PURE__ */ __name(() => getVercelOidcToken3, "getVercelOidcToken"),
      getVercelOidcTokenSync: /* @__PURE__ */ __name(() => getVercelOidcTokenSync2, "getVercelOidcTokenSync")
    });
    module.exports = __toCommonJS(get_vercel_oidc_token_exports);
    var import_get_context = require_get_context();
    var import_token_error = require_token_error();
    async function getVercelOidcToken3(options) {
      let token = "";
      let err;
      try {
        token = getVercelOidcTokenSync2();
      } catch (error) {
        err = error;
      }
      try {
        const [{ getTokenPayload, isExpired }, { refreshToken }] = await Promise.all([
          await import("./token-util-4W42PUD4.mjs"),
          await import("./token-AEODNUOI.mjs")
        ]);
        if (!token || isExpired(getTokenPayload(token), options?.expirationBufferMs)) {
          await refreshToken(options);
          token = getVercelOidcTokenSync2();
        }
      } catch (error) {
        let message = err instanceof Error ? err.message : "";
        if (error instanceof Error) {
          message = `${message}
${error.message}`;
        }
        if (message) {
          throw new import_token_error.VercelOidcTokenError(message);
        }
        throw error;
      }
      return token;
    }
    __name(getVercelOidcToken3, "getVercelOidcToken");
    function getVercelOidcTokenSync2() {
      const token = (0, import_get_context.getContext)().headers?.["x-vercel-oidc-token"] ?? process.env.VERCEL_OIDC_TOKEN;
      if (!token) {
        throw new Error(
          `The 'x-vercel-oidc-token' header is missing from the request. Do you have the OIDC option enabled in the Vercel project settings?`
        );
      }
      return token;
    }
    __name(getVercelOidcTokenSync2, "getVercelOidcTokenSync");
  }
});

// node_modules/.pnpm/@vercel+oidc@3.2.0/node_modules/@vercel/oidc/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/@vercel+oidc@3.2.0/node_modules/@vercel/oidc/dist/index.js"(exports, module) {
    "use strict";
    init_esm();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name24 in all)
        __defProp2(target, name24, { get: all[name24], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var src_exports = {};
    __export2(src_exports, {
      AccessTokenMissingError: /* @__PURE__ */ __name(() => import_auth_errors.AccessTokenMissingError, "AccessTokenMissingError"),
      RefreshAccessTokenFailedError: /* @__PURE__ */ __name(() => import_auth_errors.RefreshAccessTokenFailedError, "RefreshAccessTokenFailedError"),
      getContext: /* @__PURE__ */ __name(() => import_get_context.getContext, "getContext"),
      getVercelOidcToken: /* @__PURE__ */ __name(() => import_get_vercel_oidc_token.getVercelOidcToken, "getVercelOidcToken"),
      getVercelOidcTokenSync: /* @__PURE__ */ __name(() => import_get_vercel_oidc_token.getVercelOidcTokenSync, "getVercelOidcTokenSync"),
      getVercelToken: /* @__PURE__ */ __name(() => import_token_util.getVercelToken, "getVercelToken")
    });
    module.exports = __toCommonJS(src_exports);
    var import_get_vercel_oidc_token = require_get_vercel_oidc_token();
    var import_get_context = require_get_context();
    var import_auth_errors = require_auth_errors();
    var import_token_util = require_token_util();
  }
});

// node_modules/.pnpm/ai@7.0.31_zod@3.25.76/node_modules/ai/dist/index.js
init_esm();

// node_modules/.pnpm/@ai-sdk+gateway@4.0.23_zod@3.25.76/node_modules/@ai-sdk/gateway/dist/index.js
init_esm();

// node_modules/.pnpm/@ai-sdk+provider-utils@5.0.11_zod@3.25.76/node_modules/@ai-sdk/provider-utils/dist/index.js
init_esm();

// node_modules/.pnpm/@ai-sdk+provider@4.0.3/node_modules/@ai-sdk/provider/dist/index.js
init_esm();
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a;
var _b;
var AISDKError = class _AISDKError extends (_b = Error, _a = symbol, _b) {
  static {
    __name(this, "_AISDKError");
  }
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name153,
    message,
    cause
  }) {
    super(message);
    this[_a] = true;
    this.name = name153;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker);
  }
  static hasMarker(error, marker163) {
    const markerSymbol = Symbol.for(marker163);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
var name = "AI_APICallError";
var marker2 = `vercel.ai.error.${name}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var _b2;
var APICallError = class extends (_b2 = AISDKError, _a2 = symbol2, _b2) {
  static {
    __name(this, "APICallError");
  }
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name, message, cause });
    this[_a2] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker2);
  }
};
var name2 = "AI_EmptyResponseBodyError";
var marker3 = `vercel.ai.error.${name2}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var _b3;
var EmptyResponseBodyError = class extends (_b3 = AISDKError, _a3 = symbol3, _b3) {
  static {
    __name(this, "EmptyResponseBodyError");
  }
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2, message });
    this[_a3] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker3);
  }
};
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.toString();
  }
  return JSON.stringify(error);
}
__name(getErrorMessage, "getErrorMessage");
var name3 = "AI_InvalidArgumentError";
var marker4 = `vercel.ai.error.${name3}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var _b4;
var InvalidArgumentError = class extends (_b4 = AISDKError, _a4 = symbol4, _b4) {
  static {
    __name(this, "InvalidArgumentError");
  }
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3, message, cause });
    this[_a4] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker4);
  }
};
var name4 = "AI_InvalidPromptError";
var marker5 = `vercel.ai.error.${name4}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var _b5;
var InvalidPromptError = class extends (_b5 = AISDKError, _a5 = symbol5, _b5) {
  static {
    __name(this, "InvalidPromptError");
  }
  constructor({
    prompt,
    message,
    cause
  }) {
    super({ name: name4, message: `Invalid prompt: ${message}`, cause });
    this[_a5] = true;
    this.prompt = prompt;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker5);
  }
};
var name5 = "AI_InvalidResponseDataError";
var marker6 = `vercel.ai.error.${name5}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var _b6;
var InvalidResponseDataError = class extends (_b6 = AISDKError, _a6 = symbol6, _b6) {
  static {
    __name(this, "InvalidResponseDataError");
  }
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name5, message });
    this[_a6] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker6);
  }
};
var name6 = "AI_JSONParseError";
var marker7 = `vercel.ai.error.${name6}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var _b7;
var JSONParseError = class extends (_b7 = AISDKError, _a7 = symbol7, _b7) {
  static {
    __name(this, "JSONParseError");
  }
  constructor({ text: text2, cause }) {
    super({
      name: name6,
      message: `JSON parsing failed: Text: ${text2}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a7] = true;
    this.text = text2;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7);
  }
};
var name7 = "AI_LoadAPIKeyError";
var marker8 = `vercel.ai.error.${name7}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var _b8;
var LoadAPIKeyError = class extends (_b8 = AISDKError, _a8 = symbol8, _b8) {
  static {
    __name(this, "LoadAPIKeyError");
  }
  // used in isInstance
  constructor({ message }) {
    super({ name: name7, message });
    this[_a8] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker8);
  }
};
var name8 = "AI_LoadSettingError";
var marker9 = `vercel.ai.error.${name8}`;
var symbol9 = Symbol.for(marker9);
var _a9;
var _b9;
var LoadSettingError = class extends (_b9 = AISDKError, _a9 = symbol9, _b9) {
  static {
    __name(this, "LoadSettingError");
  }
  // used in isInstance
  constructor({ message }) {
    super({ name: name8, message });
    this[_a9] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker9);
  }
};
var name9 = "AI_NoContentGeneratedError";
var marker10 = `vercel.ai.error.${name9}`;
var symbol10 = Symbol.for(marker10);
var _a10;
var _b10;
var NoContentGeneratedError = class extends (_b10 = AISDKError, _a10 = symbol10, _b10) {
  static {
    __name(this, "NoContentGeneratedError");
  }
  // used in isInstance
  constructor({
    message = "No content generated."
  } = {}) {
    super({ name: name9, message });
    this[_a10] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker10);
  }
};
var name10 = "AI_NoSuchModelError";
var marker11 = `vercel.ai.error.${name10}`;
var symbol11 = Symbol.for(marker11);
var _a11;
var _b11;
var NoSuchModelError = class extends (_b11 = AISDKError, _a11 = symbol11, _b11) {
  static {
    __name(this, "NoSuchModelError");
  }
  constructor({
    errorName = name10,
    modelId,
    modelType,
    message = `No such ${modelType}: ${modelId}`
  }) {
    super({ name: errorName, message });
    this[_a11] = true;
    this.modelId = modelId;
    this.modelType = modelType;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker11);
  }
};
var name11 = "AI_NoSuchProviderReferenceError";
var marker12 = `vercel.ai.error.${name11}`;
var symbol12 = Symbol.for(marker12);
var _a12;
var _b12;
var NoSuchProviderReferenceError = class extends (_b12 = AISDKError, _a12 = symbol12, _b12) {
  static {
    __name(this, "NoSuchProviderReferenceError");
  }
  constructor({
    provider,
    reference,
    message = `No provider reference found for provider '${provider}'. Available providers: ${Object.keys(reference).join(", ")}`
  }) {
    super({ name: name11, message });
    this[_a12] = true;
    this.provider = provider;
    this.reference = reference;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker12);
  }
};
var name12 = "AI_TooManyEmbeddingValuesForCallError";
var marker13 = `vercel.ai.error.${name12}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var _b13;
var TooManyEmbeddingValuesForCallError = class extends (_b13 = AISDKError, _a13 = symbol13, _b13) {
  static {
    __name(this, "TooManyEmbeddingValuesForCallError");
  }
  constructor(options) {
    super({
      name: name12,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a13] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13);
  }
};
var name13 = "AI_TypeValidationError";
var marker14 = `vercel.ai.error.${name13}`;
var symbol14 = Symbol.for(marker14);
var _a14;
var _b14;
var TypeValidationError = class _TypeValidationError extends (_b14 = AISDKError, _a14 = symbol14, _b14) {
  static {
    __name(this, "_TypeValidationError");
  }
  constructor({
    value,
    cause,
    context
  }) {
    let contextPrefix = "Type validation failed";
    if (context == null ? void 0 : context.field) {
      contextPrefix += ` for ${context.field}`;
    }
    if ((context == null ? void 0 : context.entityName) || (context == null ? void 0 : context.entityId)) {
      contextPrefix += " (";
      const parts = [];
      if (context.entityName) {
        parts.push(context.entityName);
      }
      if (context.entityId) {
        parts.push(`id: "${context.entityId}"`);
      }
      contextPrefix += parts.join(", ");
      contextPrefix += ")";
    }
    super({
      name: name13,
      message: `${contextPrefix}: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a14] = true;
    this.value = value;
    this.context = context;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker14);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value and context, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @param {TypeValidationContext} params.context - Optional context about what is being validated.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause,
    context
  }) {
    var _a163, _b162, _c;
    if (_TypeValidationError.isInstance(cause) && cause.value === value && ((_a163 = cause.context) == null ? void 0 : _a163.field) === (context == null ? void 0 : context.field) && ((_b162 = cause.context) == null ? void 0 : _b162.entityName) === (context == null ? void 0 : context.entityName) && ((_c = cause.context) == null ? void 0 : _c.entityId) === (context == null ? void 0 : context.entityId)) {
      return cause;
    }
    return new _TypeValidationError({ value, cause, context });
  }
};
var name14 = "AI_UnsupportedFunctionalityError";
var marker15 = `vercel.ai.error.${name14}`;
var symbol15 = Symbol.for(marker15);
var _a15;
var _b15;
var UnsupportedFunctionalityError = class extends (_b15 = AISDKError, _a15 = symbol15, _b15) {
  static {
    __name(this, "UnsupportedFunctionalityError");
  }
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name14, message });
    this[_a15] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker15);
  }
};
function isJSONValue(value) {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isJSONValue);
  }
  if (typeof value === "object") {
    return Object.entries(value).every(
      ([key, val]) => typeof key === "string" && (val === void 0 || isJSONValue(val))
    );
  }
  return false;
}
__name(isJSONValue, "isJSONValue");
function isJSONArray(value) {
  return Array.isArray(value) && value.every(isJSONValue);
}
__name(isJSONArray, "isJSONArray");
function isJSONObject(value) {
  return value != null && typeof value === "object" && Object.entries(value).every(
    ([key, val]) => typeof key === "string" && (val === void 0 || isJSONValue(val))
  );
}
__name(isJSONObject, "isJSONObject");

// node_modules/.pnpm/@workflow+serde@4.1.0/node_modules/@workflow/serde/dist/index.js
init_esm();
var WORKFLOW_SERIALIZE = Symbol.for("workflow-serialize");
var WORKFLOW_DESERIALIZE = Symbol.for("workflow-deserialize");

// node_modules/.pnpm/@ai-sdk+provider-utils@5.0.11_zod@3.25.76/node_modules/@ai-sdk/provider-utils/dist/index.js
function asArray(value) {
  return value === void 0 ? [] : Array.isArray(value) ? value : [value];
}
__name(asArray, "asArray");
function combineHeaders(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}
__name(combineHeaders, "combineHeaders");
function removeUndefinedEntries(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([_key, value]) => value != null)
  );
}
__name(removeUndefinedEntries, "removeUndefinedEntries");
async function delay(delayInMs, options) {
  if (delayInMs == null) {
    return Promise.resolve();
  }
  const signal = options == null ? void 0 : options.abortSignal;
  return new Promise((resolve2, reject) => {
    if (signal == null ? void 0 : signal.aborted) {
      reject(createAbortError());
      return;
    }
    const timeoutId = setTimeout(() => {
      cleanup();
      resolve2();
    }, delayInMs);
    const cleanup = /* @__PURE__ */ __name(() => {
      clearTimeout(timeoutId);
      signal == null ? void 0 : signal.removeEventListener("abort", onAbort);
    }, "cleanup");
    const onAbort = /* @__PURE__ */ __name(() => {
      cleanup();
      reject(createAbortError());
    }, "onAbort");
    signal == null ? void 0 : signal.addEventListener("abort", onAbort);
  });
}
__name(delay, "delay");
function createAbortError() {
  return new DOMException("Delay was aborted", "AbortError");
}
__name(createAbortError, "createAbortError");
function getWebSocketConstructor(webSocket) {
  const WebSocketConstructor = webSocket != null ? webSocket : globalThis.WebSocket;
  if (WebSocketConstructor == null) {
    throw new Error("No WebSocket implementation available.");
  }
  return WebSocketConstructor;
}
__name(getWebSocketConstructor, "getWebSocketConstructor");
function toWebSocketUrl(url) {
  const wsUrl = new URL(url);
  if (wsUrl.protocol === "http:") {
    wsUrl.protocol = "ws:";
  } else if (wsUrl.protocol === "https:") {
    wsUrl.protocol = "wss:";
  }
  return wsUrl;
}
__name(toWebSocketUrl, "toWebSocketUrl");
var textDecoder = new TextDecoder();
async function readWebSocketMessageText(data) {
  if (typeof data === "string") return data;
  if (data instanceof ArrayBuffer) return textDecoder.decode(data);
  if (ArrayBuffer.isView(data)) {
    return textDecoder.decode(data);
  }
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    return data.text();
  }
  return String(data);
}
__name(readWebSocketMessageText, "readWebSocketMessageText");
var WEBSOCKET_OPEN_STATE = 1;
async function waitForWebSocketBufferDrain(socket, {
  highWaterMark = 1024 * 1024,
  pollIntervalMs = 20,
  abortSignal
} = {}) {
  var _a24;
  while (socket.readyState === WEBSOCKET_OPEN_STATE && ((_a24 = socket.bufferedAmount) != null ? _a24 : 0) > highWaterMark) {
    if ((abortSignal == null ? void 0 : abortSignal.aborted) === true) {
      return;
    }
    await delay(pollIntervalMs);
  }
}
__name(waitForWebSocketBufferDrain, "waitForWebSocketBufferDrain");
function connectToWebSocket({
  url,
  protocols,
  headers,
  webSocket,
  abortSignal,
  onOpen,
  onMessageText,
  onProcessingError,
  onSocketError,
  onClose,
  onAbort
}) {
  var _a24;
  let socket;
  let abortListener;
  const close = /* @__PURE__ */ __name((code) => {
    if (abortListener != null) {
      abortSignal == null ? void 0 : abortSignal.removeEventListener("abort", abortListener);
      abortListener = void 0;
    }
    try {
      socket == null ? void 0 : socket.close(code);
    } catch (e) {
    }
  }, "close");
  if (abortSignal == null ? void 0 : abortSignal.aborted) {
    onAbort == null ? void 0 : onAbort((_a24 = abortSignal.reason) != null ? _a24 : new Error("Aborted"));
    return { socket: void 0, close };
  }
  try {
    const WebSocketConstructor = getWebSocketConstructor(webSocket);
    socket = new WebSocketConstructor(url, protocols, {
      headers: removeUndefinedEntries(headers != null ? headers : {})
    });
  } catch (error) {
    onProcessingError(error);
    return { socket: void 0, close };
  }
  if (abortSignal != null && onAbort != null) {
    abortListener = /* @__PURE__ */ __name(() => {
      var _a34;
      return onAbort((_a34 = abortSignal.reason) != null ? _a34 : new Error("Aborted"));
    }, "abortListener");
    abortSignal.addEventListener("abort", abortListener, { once: true });
  }
  const openedSocket = socket;
  socket.onopen = () => {
    try {
      onOpen == null ? void 0 : onOpen(openedSocket);
    } catch (error) {
      onProcessingError(error);
    }
  };
  let tail = Promise.resolve();
  socket.onmessage = (event) => {
    tail = tail.then(() => readWebSocketMessageText(event.data)).then((text2) => onMessageText(text2)).catch(onProcessingError);
  };
  socket.onerror = () => {
    tail = tail.then(() => onSocketError == null ? void 0 : onSocketError()).catch(onProcessingError);
  };
  socket.onclose = () => {
    tail = tail.then(() => onClose == null ? void 0 : onClose()).catch(onProcessingError);
  };
  return { socket, close };
}
__name(connectToWebSocket, "connectToWebSocket");
var { btoa: btoa2, atob: atob2 } = globalThis;
function convertBase64ToUint8Array(base64String) {
  const base64Url = base64String.replace(/-/g, "+").replace(/_/g, "/");
  const latin1string = atob2(base64Url);
  return Uint8Array.from(latin1string, (byte) => byte.codePointAt(0));
}
__name(convertBase64ToUint8Array, "convertBase64ToUint8Array");
function convertUint8ArrayToBase64(array2) {
  let latin1string = "";
  for (let i = 0; i < array2.length; i++) {
    latin1string += String.fromCodePoint(array2[i]);
  }
  return btoa2(latin1string);
}
__name(convertUint8ArrayToBase64, "convertUint8ArrayToBase64");
function convertToBase64(value) {
  return value instanceof Uint8Array ? convertUint8ArrayToBase64(value) : value;
}
__name(convertToBase64, "convertToBase64");
function convertInlineFileDataToUint8Array(data) {
  if (data.type === "text") {
    return new TextEncoder().encode(data.text);
  }
  if (data.data instanceof Uint8Array) {
    return data.data;
  }
  if (data.data instanceof ArrayBuffer) {
    return new Uint8Array(data.data);
  }
  return convertBase64ToUint8Array(data.data);
}
__name(convertInlineFileDataToUint8Array, "convertInlineFileDataToUint8Array");
function convertToFormData(input, options = {}) {
  const { useArrayBrackets = true } = options;
  const formData = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value == null) {
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length === 1) {
        formData.append(key, value[0]);
        continue;
      }
      const arrayKey = useArrayBrackets ? `${key}[]` : key;
      for (const item of value) {
        formData.append(arrayKey, item);
      }
      continue;
    }
    formData.append(key, value);
  }
  return formData;
}
__name(convertToFormData, "convertToFormData");
function createToolNameMapping({
  tools = [],
  providerToolNames
}) {
  const customToolNameToProviderToolName = {};
  const providerToolNameToCustomToolName = {};
  for (const tool2 of tools) {
    if (tool2.type === "provider" && tool2.id in providerToolNames) {
      const providerToolName = providerToolNames[tool2.id];
      customToolNameToProviderToolName[tool2.name] = providerToolName;
      providerToolNameToCustomToolName[providerToolName] = tool2.name;
    }
  }
  return {
    toProviderToolName: /* @__PURE__ */ __name((customToolName) => {
      var _a24;
      return (_a24 = customToolNameToProviderToolName[customToolName]) != null ? _a24 : customToolName;
    }, "toProviderToolName"),
    toCustomToolName: /* @__PURE__ */ __name((providerToolName) => {
      var _a24;
      return (_a24 = providerToolNameToCustomToolName[providerToolName]) != null ? _a24 : providerToolName;
    }, "toCustomToolName")
  };
}
__name(createToolNameMapping, "createToolNameMapping");
var DelayedPromise = class {
  static {
    __name(this, "DelayedPromise");
  }
  constructor() {
    this.status = { type: "pending" };
    this._resolve = void 0;
    this._reject = void 0;
  }
  get promise() {
    if (this._promise) {
      return this._promise;
    }
    this._promise = new Promise((resolve2, reject) => {
      if (this.status.type === "resolved") {
        resolve2(this.status.value);
      } else if (this.status.type === "rejected") {
        reject(this.status.error);
      }
      this._resolve = resolve2;
      this._reject = reject;
    });
    return this._promise;
  }
  resolve(value) {
    var _a24;
    this.status = { type: "resolved", value };
    if (this._promise) {
      (_a24 = this._resolve) == null ? void 0 : _a24.call(this, value);
    }
  }
  reject(error) {
    var _a24;
    this.status = { type: "rejected", error };
    if (this._promise) {
      (_a24 = this._reject) == null ? void 0 : _a24.call(this, error);
    }
  }
  isResolved() {
    return this.status.type === "resolved";
  }
  isRejected() {
    return this.status.type === "rejected";
  }
  isPending() {
    return this.status.type === "pending";
  }
};
var imageMediaTypeSignatures = [
  {
    mediaType: "image/gif",
    bytesPrefix: [71, 73, 70]
    // GIF
  },
  {
    mediaType: "image/png",
    bytesPrefix: [137, 80, 78, 71]
    // PNG
  },
  {
    mediaType: "image/jpeg",
    bytesPrefix: [255, 216]
    // JPEG
  },
  {
    mediaType: "image/webp",
    bytesPrefix: [
      82,
      73,
      70,
      70,
      // "RIFF"
      null,
      null,
      null,
      null,
      // file size (variable)
      87,
      69,
      66,
      80
      // "WEBP"
    ]
  },
  {
    mediaType: "image/bmp",
    bytesPrefix: [66, 77]
  },
  {
    mediaType: "image/tiff",
    bytesPrefix: [73, 73, 42, 0]
  },
  {
    mediaType: "image/tiff",
    bytesPrefix: [77, 77, 0, 42]
  },
  {
    mediaType: "image/avif",
    bytesPrefix: [
      0,
      0,
      0,
      32,
      102,
      116,
      121,
      112,
      97,
      118,
      105,
      102
    ]
  },
  {
    mediaType: "image/heic",
    bytesPrefix: [
      0,
      0,
      0,
      32,
      102,
      116,
      121,
      112,
      104,
      101,
      105,
      99
    ]
  }
];
var documentMediaTypeSignatures = [
  {
    mediaType: "application/pdf",
    bytesPrefix: [37, 80, 68, 70]
    // %PDF
  }
];
var audioMediaTypeSignatures = [
  {
    mediaType: "audio/mpeg",
    bytesPrefix: [255, 251]
  },
  {
    mediaType: "audio/mpeg",
    bytesPrefix: [255, 250]
  },
  {
    mediaType: "audio/mpeg",
    bytesPrefix: [255, 243]
  },
  {
    mediaType: "audio/mpeg",
    bytesPrefix: [255, 242]
  },
  {
    mediaType: "audio/mpeg",
    bytesPrefix: [255, 227]
  },
  {
    mediaType: "audio/mpeg",
    bytesPrefix: [255, 226]
  },
  {
    mediaType: "audio/wav",
    bytesPrefix: [
      82,
      // R
      73,
      // I
      70,
      // F
      70,
      // F
      null,
      null,
      null,
      null,
      87,
      // W
      65,
      // A
      86,
      // V
      69
      // E
    ]
  },
  {
    mediaType: "audio/ogg",
    bytesPrefix: [79, 103, 103, 83]
  },
  {
    mediaType: "audio/flac",
    bytesPrefix: [102, 76, 97, 67]
  },
  {
    mediaType: "audio/aac",
    bytesPrefix: [64, 21, 0, 0]
  },
  {
    mediaType: "audio/mp4",
    bytesPrefix: [102, 116, 121, 112]
  },
  {
    mediaType: "audio/webm",
    bytesPrefix: [26, 69, 223, 163]
  }
];
var videoMediaTypeSignatures = [
  {
    mediaType: "video/mp4",
    bytesPrefix: [
      0,
      0,
      0,
      null,
      102,
      116,
      121,
      112
      // ftyp
    ]
  },
  {
    mediaType: "video/webm",
    bytesPrefix: [26, 69, 223, 163]
    // EBML
  },
  {
    mediaType: "video/quicktime",
    bytesPrefix: [
      0,
      0,
      0,
      20,
      102,
      116,
      121,
      112,
      113,
      116
      // ftypqt
    ]
  },
  {
    mediaType: "video/x-msvideo",
    bytesPrefix: [82, 73, 70, 70]
    // RIFF (AVI)
  }
];
var stripID3 = /* @__PURE__ */ __name((data) => {
  const bytes = typeof data === "string" ? convertBase64ToUint8Array(data) : data;
  const id3Size = (bytes[6] & 127) << 21 | (bytes[7] & 127) << 14 | (bytes[8] & 127) << 7 | bytes[9] & 127;
  return bytes.slice(id3Size + 10);
}, "stripID3");
function stripID3TagsIfPresent(data) {
  const hasId3 = typeof data === "string" && data.startsWith("SUQz") || typeof data !== "string" && data.length > 10 && data[0] === 73 && // 'I'
  data[1] === 68 && // 'D'
  data[2] === 51;
  return hasId3 ? stripID3(data) : data;
}
__name(stripID3TagsIfPresent, "stripID3TagsIfPresent");
function detectMediaTypeBySignatures({
  data,
  signatures
}) {
  const processedData = stripID3TagsIfPresent(data);
  const bytes = typeof processedData === "string" ? convertBase64ToUint8Array(
    processedData.substring(0, Math.min(processedData.length, 24))
  ) : processedData;
  for (const signature of signatures) {
    if (bytes.length >= signature.bytesPrefix.length && signature.bytesPrefix.every(
      (byte, index) => byte === null || bytes[index] === byte
    )) {
      return signature.mediaType;
    }
  }
  return void 0;
}
__name(detectMediaTypeBySignatures, "detectMediaTypeBySignatures");
var topLevelSignatureTables = {
  image: imageMediaTypeSignatures,
  audio: audioMediaTypeSignatures,
  video: videoMediaTypeSignatures,
  application: documentMediaTypeSignatures
};
function detectMediaType({
  data,
  topLevelType
}) {
  if (topLevelType === void 0) {
    return detectMediaTypeBySignatures({
      data,
      signatures: [
        ...imageMediaTypeSignatures,
        ...documentMediaTypeSignatures,
        ...audioMediaTypeSignatures,
        ...videoMediaTypeSignatures
      ]
    });
  }
  const signatures = topLevelSignatureTables[topLevelType];
  if (signatures === void 0) {
    return void 0;
  }
  return detectMediaTypeBySignatures({ data, signatures });
}
__name(detectMediaType, "detectMediaType");
function getTopLevelMediaType(mediaType) {
  const slashIndex = mediaType.indexOf("/");
  return slashIndex === -1 ? mediaType : mediaType.substring(0, slashIndex);
}
__name(getTopLevelMediaType, "getTopLevelMediaType");
function isFullMediaType(mediaType) {
  const slashIndex = mediaType.indexOf("/");
  if (slashIndex === -1) {
    return false;
  }
  const subtype = mediaType.substring(slashIndex + 1);
  return subtype.length > 0 && subtype !== "*";
}
__name(isFullMediaType, "isFullMediaType");
async function cancelResponseBody(response) {
  var _a24;
  try {
    await ((_a24 = response.body) == null ? void 0 : _a24.cancel());
  } catch (e) {
  }
}
__name(cancelResponseBody, "cancelResponseBody");
var name15 = "AI_DownloadError";
var marker16 = `vercel.ai.error.${name15}`;
var symbol16 = Symbol.for(marker16);
var _a16;
var _b16;
var DownloadError = class extends (_b16 = AISDKError, _a16 = symbol16, _b16) {
  static {
    __name(this, "DownloadError");
  }
  constructor({
    url,
    statusCode,
    statusText,
    cause,
    message = cause == null ? `Failed to download ${url}: ${statusCode} ${statusText}` : `Failed to download ${url}: ${cause}`
  }) {
    super({ name: name15, message, cause });
    this[_a16] = true;
    this.url = url;
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker16);
  }
};
function isBrowserRuntime(globalThisAny = globalThis) {
  return globalThisAny.window != null;
}
__name(isBrowserRuntime, "isBrowserRuntime");
function isSameOrigin(url, baseUrl) {
  try {
    return new URL(url).origin === new URL(baseUrl).origin;
  } catch (e) {
    return false;
  }
}
__name(isSameOrigin, "isSameOrigin");
var BLOCKED_REQUEST_HEADERS = [
  // Hop-by-hop / transport (RFC 7230 §6.1)
  "connection",
  "keep-alive",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  // Host / virtual-host routing
  "host",
  // Proxy / origin spoofing
  "forwarded",
  "proxy-authorization",
  "via",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-real-ip",
  // Cloud metadata (GCP, AWS IMDSv1/v2, Azure, Alibaba, DigitalOcean)
  "metadata",
  "metadata-flavor",
  "x-aws-ec2-metadata-token",
  "x-metadata-token",
  // Session / cookie
  "cookie",
  "set-cookie"
];
function sanitizeRequestHeaders(input) {
  const headers = new Headers(input);
  for (const name24 of BLOCKED_REQUEST_HEADERS) {
    headers.delete(name24);
  }
  return headers;
}
__name(sanitizeRequestHeaders, "sanitizeRequestHeaders");
function validateDownloadUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    throw new DownloadError({
      url,
      message: `Invalid URL: ${url}`
    });
  }
  if (parsed.protocol === "data:") {
    return;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new DownloadError({
      url,
      message: `URL scheme must be http, https, or data, got ${parsed.protocol}`
    });
  }
  const hostname = parsed.hostname.toLowerCase().replace(/\.+$/, "");
  if (!hostname) {
    throw new DownloadError({
      url,
      message: `URL must have a hostname`
    });
  }
  if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".localhost")) {
    throw new DownloadError({
      url,
      message: `URL with hostname ${hostname} is not allowed`
    });
  }
  if (hostname.startsWith("[") && hostname.endsWith("]")) {
    const ipv6 = hostname.slice(1, -1);
    if (isPrivateIPv6(ipv6)) {
      throw new DownloadError({
        url,
        message: `URL with IPv6 address ${hostname} is not allowed`
      });
    }
    return;
  }
  if (isIPv4(hostname)) {
    if (isPrivateIPv4(hostname)) {
      throw new DownloadError({
        url,
        message: `URL with IP address ${hostname} is not allowed`
      });
    }
    return;
  }
}
__name(validateDownloadUrl, "validateDownloadUrl");
function isIPv4(hostname) {
  const parts = hostname.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    const num = Number(part);
    return Number.isInteger(num) && num >= 0 && num <= 255 && String(num) === part;
  });
}
__name(isIPv4, "isIPv4");
function isPrivateIPv4(ip) {
  const parts = ip.split(".").map(Number);
  const [a, b, c] = parts;
  if (a === 0) return true;
  if (a === 10) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 0 && c === 0) return true;
  if (a === 192 && b === 0 && c === 2) return true;
  if (a === 192 && b === 168) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a === 198 && b === 51 && c === 100) return true;
  if (a === 203 && b === 0 && c === 113) return true;
  if (a >= 224) return true;
  return false;
}
__name(isPrivateIPv4, "isPrivateIPv4");
function parseIPv6(ip) {
  let address = ip.toLowerCase();
  const zoneIndex = address.indexOf("%");
  if (zoneIndex !== -1) {
    address = address.slice(0, zoneIndex);
  }
  const halves = address.split("::");
  if (halves.length > 2) return null;
  const toGroups = /* @__PURE__ */ __name((segment) => {
    if (segment === "") return [];
    const groups = [];
    const parts = segment.split(":");
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.includes(".")) {
        if (i !== parts.length - 1 || !isIPv4(part)) return null;
        const [a, b, c, d] = part.split(".").map(Number);
        groups.push(a << 8 | b, c << 8 | d);
        continue;
      }
      if (!/^[0-9a-f]{1,4}$/.test(part)) return null;
      groups.push(parseInt(part, 16));
    }
    return groups;
  }, "toGroups");
  const head = toGroups(halves[0]);
  if (head === null) return null;
  if (halves.length === 2) {
    const tail = toGroups(halves[1]);
    if (tail === null) return null;
    const fill = 8 - head.length - tail.length;
    if (fill < 0) return null;
    return [...head, ...new Array(fill).fill(0), ...tail];
  }
  return head.length === 8 ? head : null;
}
__name(parseIPv6, "parseIPv6");
function isPrivateIPv6(ip) {
  const groups = parseIPv6(ip);
  if (groups === null) return true;
  const topZero = /* @__PURE__ */ __name((count) => groups.slice(0, count).every((group) => group === 0), "topZero");
  if (topZero(7) && (groups[7] === 0 || groups[7] === 1)) return true;
  if ((groups[0] & 65024) === 64512) return true;
  if ((groups[0] & 65472) === 65152) return true;
  if ((groups[0] & 65472) === 65216) return true;
  if ((groups[0] & 65280) === 65280) return true;
  if (groups[0] === 8193 && groups[1] === 3512) return true;
  if (groups[0] === 16383 && (groups[1] & 61440) === 0) return true;
  const embedsIPv4 = (
    // ::/96 — IPv4-compatible (deprecated)
    topZero(6) || // ::ffff:0:0/96 — IPv4-mapped (ffff in group 5)
    topZero(5) && groups[5] === 65535 || // ::ffff:0:0/96 — IPv4-translated form (ffff in group 4, group 5 zero)
    topZero(4) && groups[4] === 65535 && groups[5] === 0 || // 64:ff9b::/96 — NAT64 well-known prefix
    groups[0] === 100 && groups[1] === 65435 && groups[2] === 0 && groups[3] === 0 && groups[4] === 0 && groups[5] === 0 || // 64:ff9b:1::/48 — NAT64 local-use prefix
    groups[0] === 100 && groups[1] === 65435 && groups[2] === 1
  );
  if (embedsIPv4) {
    const a = groups[6] >> 8 & 255;
    const b = groups[6] & 255;
    const c = groups[7] >> 8 & 255;
    const d = groups[7] & 255;
    return isPrivateIPv4(`${a}.${b}.${c}.${d}`);
  }
  return false;
}
__name(isPrivateIPv6, "isPrivateIPv6");
var MAX_DOWNLOAD_REDIRECTS = 10;
var REDIRECT_STATUS_CODES = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
async function fetchWithValidatedRedirects({
  url,
  headers,
  abortSignal,
  maxRedirects = MAX_DOWNLOAD_REDIRECTS,
  fetch: fetch2 = globalThis.fetch,
  trustedOrigin
}) {
  let currentHeaders = headers === void 0 ? void 0 : sanitizeRequestHeaders(headers);
  const perHopInit = /* @__PURE__ */ __name((redirect) => {
    const init = { signal: abortSignal, redirect };
    if (currentHeaders !== void 0) {
      init.headers = new Headers(currentHeaders);
    }
    return init;
  }, "perHopInit");
  let currentUrl = url;
  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount++) {
    if (trustedOrigin === void 0 || !isSameOrigin(currentUrl, trustedOrigin)) {
      validateDownloadUrl(currentUrl);
    }
    const response = await fetch2(currentUrl, perHopInit("manual"));
    if (response.type === "opaqueredirect") {
      if (!isBrowserRuntime()) {
        throw new DownloadError({
          url,
          message: `Redirect from ${currentUrl} could not be validated and was blocked`
        });
      }
      return await fetch2(currentUrl, perHopInit("follow"));
    }
    const location = response.headers.get("location");
    if (REDIRECT_STATUS_CODES.has(response.status) && location) {
      await cancelResponseBody(response);
      const nextUrl = new URL(location, currentUrl).toString();
      if (currentHeaders !== void 0 && !isSameOrigin(nextUrl, currentUrl)) {
        const userAgent = currentHeaders.get("user-agent");
        currentHeaders = new Headers(
          userAgent == null ? void 0 : { "user-agent": userAgent }
        );
      }
      currentUrl = nextUrl;
      continue;
    }
    return response;
  }
  throw new DownloadError({
    url,
    message: `Too many redirects (max ${maxRedirects})`
  });
}
__name(fetchWithValidatedRedirects, "fetchWithValidatedRedirects");
var DEFAULT_MAX_DOWNLOAD_SIZE = 2 * 1024 * 1024 * 1024;
async function readResponseWithSizeLimit({
  response,
  url,
  maxBytes = DEFAULT_MAX_DOWNLOAD_SIZE
}) {
  const contentLength = response.headers.get("content-length");
  if (contentLength != null) {
    const length = parseInt(contentLength, 10);
    if (!isNaN(length) && length > maxBytes) {
      await cancelResponseBody(response);
      throw new DownloadError({
        url,
        message: `Download of ${url} exceeded maximum size of ${maxBytes} bytes (Content-Length: ${length}).`
      });
    }
  }
  const body = response.body;
  if (body == null) {
    return new Uint8Array(0);
  }
  const reader = body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      totalBytes += value.length;
      if (totalBytes > maxBytes) {
        throw new DownloadError({
          url,
          message: `Download of ${url} exceeded maximum size of ${maxBytes} bytes.`
        });
      }
      chunks.push(value);
    }
  } finally {
    try {
      await reader.cancel();
    } finally {
      reader.releaseLock();
    }
  }
  const result = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
__name(readResponseWithSizeLimit, "readResponseWithSizeLimit");
async function downloadBlob(url, options) {
  var _a24, _b23;
  try {
    const response = await fetchWithValidatedRedirects({
      url,
      abortSignal: options == null ? void 0 : options.abortSignal
    });
    if (!response.ok) {
      await cancelResponseBody(response);
      throw new DownloadError({
        url,
        statusCode: response.status,
        statusText: response.statusText
      });
    }
    const data = await readResponseWithSizeLimit({
      response,
      url,
      maxBytes: (_a24 = options == null ? void 0 : options.maxBytes) != null ? _a24 : DEFAULT_MAX_DOWNLOAD_SIZE
    });
    const contentType = (_b23 = response.headers.get("content-type")) != null ? _b23 : void 0;
    return new Blob([data], contentType ? { type: contentType } : void 0);
  } catch (error) {
    if (DownloadError.isInstance(error)) {
      throw error;
    }
    throw new DownloadError({ url, cause: error });
  }
}
__name(downloadBlob, "downloadBlob");
function extractResponseHeaders(response) {
  return Object.fromEntries([...response.headers]);
}
__name(extractResponseHeaders, "extractResponseHeaders");
var createIdGenerator = /* @__PURE__ */ __name(({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = /* @__PURE__ */ __name(() => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  }, "generator");
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
}, "createIdGenerator");
var generateId = createIdGenerator();
function isAbortError(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}
__name(isAbortError, "isAbortError");
var FETCH_FAILED_ERROR_MESSAGES = ["fetch failed", "failed to fetch"];
var BUN_ERROR_CODES = [
  "ConnectionRefused",
  "ConnectionClosed",
  "FailedToOpenSocket",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EPIPE"
];
function isBunNetworkError(error) {
  if (!(error instanceof Error)) {
    return false;
  }
  const code = error.code;
  if (typeof code === "string" && BUN_ERROR_CODES.includes(code)) {
    return true;
  }
  return false;
}
__name(isBunNetworkError, "isBunNetworkError");
function handleFetchError({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  if (isBunNetworkError(error)) {
    return new APICallError({
      message: `Cannot connect to API: ${error.message}`,
      cause: error,
      url,
      requestBodyValues,
      isRetryable: true
    });
  }
  return error;
}
__name(handleFetchError, "handleFetchError");
function getRuntimeEnvironmentUserAgent(globalThisAny = globalThis) {
  var _a24, _b23, _c;
  if (globalThisAny.window) {
    return `runtime/browser`;
  }
  if ((_a24 = globalThisAny.navigator) == null ? void 0 : _a24.userAgent) {
    return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
  }
  if ((_c = (_b23 = globalThisAny.process) == null ? void 0 : _b23.versions) == null ? void 0 : _c.node) {
    return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
  }
  if (globalThisAny.EdgeRuntime) {
    return `runtime/vercel-edge`;
  }
  return "runtime/unknown";
}
__name(getRuntimeEnvironmentUserAgent, "getRuntimeEnvironmentUserAgent");
function normalizeHeaders(headers) {
  if (headers == null) {
    return {};
  }
  const normalized = {};
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalized[key.toLowerCase()] = value;
    });
  } else {
    if (!Array.isArray(headers)) {
      headers = Object.entries(headers);
    }
    for (const [key, value] of headers) {
      if (value != null) {
        normalized[key.toLowerCase()] = value;
      }
    }
  }
  return normalized;
}
__name(normalizeHeaders, "normalizeHeaders");
function withUserAgentSuffix(headers, ...userAgentSuffixParts) {
  const normalizedHeaders = new Headers(normalizeHeaders(headers));
  const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
  normalizedHeaders.set(
    "user-agent",
    [currentUserAgentHeader, ...userAgentSuffixParts].filter(Boolean).join(" ")
  );
  return Object.fromEntries(normalizedHeaders.entries());
}
__name(withUserAgentSuffix, "withUserAgentSuffix");
var VERSION = true ? "5.0.11" : "0.0.0-test";
var getOriginalFetch = /* @__PURE__ */ __name(() => globalThis.fetch, "getOriginalFetch");
var getFromApi = /* @__PURE__ */ __name(async ({
  url,
  headers = {},
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch: fetch2 = getOriginalFetch(),
  validateUrl,
  credentialedOrigin,
  trustedOrigin
}) => {
  try {
    const outgoingHeaders = credentialedOrigin !== void 0 && !isSameOrigin(url, credentialedOrigin) ? {} : headers;
    const requestHeaders = withUserAgentSuffix(
      outgoingHeaders,
      `ai-sdk/provider-utils/${VERSION}`,
      getRuntimeEnvironmentUserAgent()
    );
    const response = validateUrl ? await fetchWithValidatedRedirects({
      url,
      headers: requestHeaders,
      abortSignal,
      fetch: fetch2,
      trustedOrigin
    }) : await fetch2(url, {
      method: "GET",
      headers: requestHeaders,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: {}
        });
      } catch (error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
        throw new APICallError({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: {}
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: {}
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: {}
      });
    }
  } catch (error) {
    throw handleFetchError({ error, url, requestBodyValues: {} });
  }
}, "getFromApi");
function isBuffer(value) {
  var _a24, _b23;
  return (_b23 = (_a24 = globalThis.Buffer) == null ? void 0 : _a24.isBuffer(value)) != null ? _b23 : false;
}
__name(isBuffer, "isBuffer");
function isNonNullable(value) {
  return value != null;
}
__name(isNonNullable, "isNonNullable");
function isProviderReference(data) {
  return typeof data === "object" && data !== null && !(data instanceof Uint8Array) && !(data instanceof URL) && !(data instanceof ArrayBuffer) && !isBuffer(data) && !("type" in data);
}
__name(isProviderReference, "isProviderReference");
function isUrlSupported({
  mediaType,
  url,
  supportedUrls
}) {
  url = url.toLowerCase();
  mediaType = mediaType.toLowerCase();
  const isTopLevelOnly = !mediaType.includes("/");
  return Object.entries(supportedUrls).map(([key, value]) => {
    const mediaType2 = key.toLowerCase();
    return mediaType2 === "*" || mediaType2 === "*/*" ? { mediaTypePrefix: "", regexes: value } : { mediaTypePrefix: mediaType2.replace(/\*/, ""), regexes: value };
  }).filter(({ mediaTypePrefix }) => {
    if (mediaTypePrefix === "") {
      return true;
    }
    if (isTopLevelOnly) {
      return `${mediaType}/` === mediaTypePrefix;
    }
    return mediaType.startsWith(mediaTypePrefix);
  }).flatMap(({ regexes }) => regexes).some((pattern) => pattern.test(url));
}
__name(isUrlSupported, "isUrlSupported");
function loadApiKey({
  apiKey,
  environmentVariableName,
  apiKeyParameterName = "apiKey",
  description
}) {
  if (typeof apiKey === "string") {
    return apiKey;
  }
  if (apiKey != null) {
    throw new LoadAPIKeyError({
      message: `${description} API key must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter. Environment variables are not supported in this environment.`
    });
  }
  apiKey = process.env[environmentVariableName];
  if (apiKey == null) {
    throw new LoadAPIKeyError({
      message: `${description} API key is missing. Pass it using the '${apiKeyParameterName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof apiKey !== "string") {
    throw new LoadAPIKeyError({
      message: `${description} API key must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return apiKey;
}
__name(loadApiKey, "loadApiKey");
function loadOptionalSetting({
  settingValue,
  environmentVariableName
}) {
  if (typeof settingValue === "string") {
    return settingValue;
  }
  if (settingValue != null || typeof process === "undefined") {
    return void 0;
  }
  settingValue = process.env[environmentVariableName];
  if (settingValue == null || typeof settingValue !== "string") {
    return void 0;
  }
  return settingValue;
}
__name(loadOptionalSetting, "loadOptionalSetting");
function isCustomReasoning(reasoning) {
  return reasoning !== void 0 && reasoning !== "provider-default";
}
__name(isCustomReasoning, "isCustomReasoning");
function mediaTypeToExtension(mediaType) {
  var _a24;
  const [_type, subtype = ""] = mediaType.toLowerCase().split("/");
  return (_a24 = {
    mpeg: "mp3",
    "x-wav": "wav",
    opus: "ogg",
    mp4: "m4a",
    "x-m4a": "m4a"
  }[subtype]) != null ? _a24 : subtype;
}
__name(mediaTypeToExtension, "mediaTypeToExtension");
var suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
function _parse(text2) {
  const obj = JSON.parse(text2);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx.test(text2) === false && suspectConstructorRx.test(text2) === false) {
    return obj;
  }
  return filter(obj);
}
__name(_parse, "_parse");
function filter(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && node.constructor !== null && typeof node.constructor === "object" && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
__name(filter, "filter");
function secureJsonParse(text2) {
  const { stackTraceLimit } = Error;
  try {
    Error.stackTraceLimit = 0;
  } catch (e) {
    return _parse(text2);
  }
  try {
    return _parse(text2);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
__name(secureJsonParse, "secureJsonParse");
function addAdditionalPropertiesToJsonSchema(jsonSchema2) {
  if (jsonSchema2.type === "object" || Array.isArray(jsonSchema2.type) && jsonSchema2.type.includes("object")) {
    jsonSchema2.additionalProperties = false;
    const { properties } = jsonSchema2;
    if (properties != null) {
      for (const key of Object.keys(properties)) {
        properties[key] = visit(properties[key]);
      }
    }
  }
  if (jsonSchema2.items != null) {
    jsonSchema2.items = Array.isArray(jsonSchema2.items) ? jsonSchema2.items.map(visit) : visit(jsonSchema2.items);
  }
  if (jsonSchema2.anyOf != null) {
    jsonSchema2.anyOf = jsonSchema2.anyOf.map(visit);
  }
  if (jsonSchema2.allOf != null) {
    jsonSchema2.allOf = jsonSchema2.allOf.map(visit);
  }
  if (jsonSchema2.oneOf != null) {
    jsonSchema2.oneOf = jsonSchema2.oneOf.map(visit);
  }
  const { definitions } = jsonSchema2;
  if (definitions != null) {
    for (const key of Object.keys(definitions)) {
      definitions[key] = visit(definitions[key]);
    }
  }
  return jsonSchema2;
}
__name(addAdditionalPropertiesToJsonSchema, "addAdditionalPropertiesToJsonSchema");
function visit(def) {
  if (typeof def === "boolean") return def;
  return addAdditionalPropertiesToJsonSchema(def);
}
__name(visit, "visit");
var ignoreOverride = /* @__PURE__ */ Symbol(
  "Let zodToJsonSchema decide on which parser to use"
);
var defaultOptions = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: true,
  rejectedAdditionalProperties: false,
  definitionPath: "definitions",
  strictUnions: false,
  definitions: {},
  errorMessages: false,
  patternStrategy: "escape",
  applyRegexFlags: false,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
};
var getDefaultOptions = /* @__PURE__ */ __name((options) => typeof options === "string" ? {
  ...defaultOptions,
  name: options
} : {
  ...defaultOptions,
  ...options
}, "getDefaultOptions");
function parseAnyDef() {
  return {};
}
__name(parseAnyDef, "parseAnyDef");
function parseArrayDef(def, refs) {
  var _a24, _b23, _c;
  const res = {
    type: "array"
  };
  if (((_a24 = def.type) == null ? void 0 : _a24._def) && ((_c = (_b23 = def.type) == null ? void 0 : _b23._def) == null ? void 0 : _c.typeName) !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    res.minItems = def.minLength.value;
  }
  if (def.maxLength) {
    res.maxItems = def.maxLength.value;
  }
  if (def.exactLength) {
    res.minItems = def.exactLength.value;
    res.maxItems = def.exactLength.value;
  }
  return res;
}
__name(parseArrayDef, "parseArrayDef");
function parseBigintDef(def) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}
__name(parseBigintDef, "parseBigintDef");
function parseBooleanDef() {
  return { type: "boolean" };
}
__name(parseBooleanDef, "parseBooleanDef");
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}
__name(parseBrandedDef, "parseBrandedDef");
var parseCatchDef = /* @__PURE__ */ __name((def, refs) => {
  return parseDef(def.innerType._def, refs);
}, "parseCatchDef");
function parseDateDef(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy != null ? overrideDateStrategy : refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item) => parseDateDef(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser(def);
  }
}
__name(parseDateDef, "parseDateDef");
var integerDateParser = /* @__PURE__ */ __name((def) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        res.minimum = check.value;
        break;
      case "max":
        res.maximum = check.value;
        break;
    }
  }
  return res;
}, "integerDateParser");
function parseDefaultDef(_def, refs) {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}
__name(parseDefaultDef, "parseDefaultDef");
function parseEffectsDef(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : parseAnyDef();
}
__name(parseEffectsDef, "parseEffectsDef");
function parseEnumDef(def) {
  return {
    type: "string",
    enum: Array.from(def.values)
  };
}
__name(parseEnumDef, "parseEnumDef");
var isJsonSchema7AllOfType = /* @__PURE__ */ __name((type) => {
  if ("type" in type && type.type === "string") return false;
  return "allOf" in type;
}, "isJsonSchema7AllOfType");
function parseIntersectionDef(def, refs) {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType(schema)) {
      mergedAllOf.push(...schema.allOf);
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const { additionalProperties: _additionalProperties, ...rest } = schema;
        nestedSchema = rest;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? { allOf: mergedAllOf } : void 0;
}
__name(parseIntersectionDef, "parseIntersectionDef");
function parseLiteralDef(def) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}
__name(parseLiteralDef, "parseLiteralDef");
var emojiRegex = void 0;
var zodPatterns = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: /* @__PURE__ */ __name(() => {
    if (emojiRegex === void 0) {
      emojiRegex = RegExp(
        "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
        "u"
      );
    }
    return emojiRegex;
  }, "emoji"),
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          break;
        case "max":
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern(res, zodPatterns.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern(res, zodPatterns.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern(res, zodPatterns.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern(
            res,
            RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`),
            check.message,
            refs
          );
          break;
        case "endsWith":
          addPattern(
            res,
            RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`),
            check.message,
            refs
          );
          break;
        case "datetime":
          addFormat(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat(res, "date", check.message, refs);
          break;
        case "time":
          addFormat(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat(res, "duration", check.message, refs);
          break;
        case "length":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "includes": {
          addPattern(
            res,
            RegExp(escapeLiteralCheckValue(check.value, refs)),
            check.message,
            refs
          );
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "base64url":
          addPattern(res, zodPatterns.base64url, check.message, refs);
          break;
        case "jwt":
          addPattern(res, zodPatterns.jwt, check.message, refs);
          break;
        case "cidr": {
          if (check.version !== "v6") {
            addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
          }
          if (check.version !== "v4") {
            addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern(res, zodPatterns.emoji(), check.message, refs);
          break;
        case "ulid": {
          addPattern(res, zodPatterns.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              res.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              addPattern(res, zodPatterns.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern(res, zodPatterns.nanoid, check.message, refs);
        }
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
          /* @__PURE__ */ ((_) => {
          })(check);
      }
    }
  }
  return res;
}
__name(parseStringDef, "parseStringDef");
function escapeLiteralCheckValue(literal, refs) {
  return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
__name(escapeLiteralCheckValue, "escapeLiteralCheckValue");
var ALPHA_NUMERIC = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);
function escapeNonAlphaNumeric(source) {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    if (!ALPHA_NUMERIC.has(source[i])) {
      result += "\\";
    }
    result += source[i];
  }
  return result;
}
__name(escapeNonAlphaNumeric, "escapeNonAlphaNumeric");
function addFormat(schema, value, message, refs) {
  var _a24;
  if (schema.format || ((_a24 = schema.anyOf) == null ? void 0 : _a24.some((x) => x.format))) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push({
        format: schema.format
      });
      delete schema.format;
    }
    schema.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    schema.format = value;
  }
}
__name(addFormat, "addFormat");
function addPattern(schema, regex, message, refs) {
  var _a24;
  if (schema.pattern || ((_a24 = schema.allOf) == null ? void 0 : _a24.some((x) => x.pattern))) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push({
        pattern: schema.pattern
      });
      delete schema.pattern;
    }
    schema.allOf.push({
      pattern: stringifyRegExpWithFlags(regex, refs),
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    schema.pattern = stringifyRegExpWithFlags(regex, refs);
  }
}
__name(addPattern, "addPattern");
function stringifyRegExpWithFlags(regex, refs) {
  var _a24;
  if (!refs.applyRegexFlags || !regex.flags) {
    return regex.source;
  }
  const flags = {
    i: regex.flags.includes("i"),
    // Case-insensitive
    m: regex.flags.includes("m"),
    // `^` and `$` matches adjacent to newline characters
    s: regex.flags.includes("s")
    // `.` matches newlines
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && ((_a24 = source[i + 2]) == null ? void 0 : _a24.match(/[a-z]/))) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  try {
    new RegExp(pattern);
  } catch (e) {
    console.warn(
      `Could not convert regex pattern at ${refs.currentPath.join(
        "/"
      )} to a flag-independent form! Falling back to the flag-ignorant source`
    );
    return regex.source;
  }
  return pattern;
}
__name(stringifyRegExpWithFlags, "stringifyRegExpWithFlags");
function parseRecordDef(def, refs) {
  var _a24, _b23, _c, _d, _e, _f;
  const schema = {
    type: "object",
    additionalProperties: (_a24 = parseDef(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) != null ? _a24 : refs.allowedAdditionalProperties
  };
  if (((_b23 = def.keyType) == null ? void 0 : _b23._def.typeName) === ZodFirstPartyTypeKind.ZodString && ((_c = def.keyType._def.checks) == null ? void 0 : _c.length)) {
    const { type: _type, ...keyType } = parseStringDef(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  } else if (((_d = def.keyType) == null ? void 0 : _d._def.typeName) === ZodFirstPartyTypeKind.ZodEnum) {
    return {
      ...schema,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  } else if (((_e = def.keyType) == null ? void 0 : _e._def.typeName) === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && ((_f = def.keyType._def.type._def.checks) == null ? void 0 : _f.length)) {
    const { type: _type, ...keyType } = parseBrandedDef(
      def.keyType._def,
      refs
    );
    return {
      ...schema,
      propertyNames: keyType
    };
  }
  return schema;
}
__name(parseRecordDef, "parseRecordDef");
function parseMapDef(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }
  const keys = parseDef(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || parseAnyDef();
  const values = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || parseAnyDef();
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}
__name(parseMapDef, "parseMapDef");
function parseNativeEnumDef(def) {
  const object2 = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object2[object2[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object2[key]);
  const parsedTypes = Array.from(
    new Set(actualValues.map((values) => typeof values))
  );
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}
__name(parseNativeEnumDef, "parseNativeEnumDef");
function parseNeverDef() {
  return { not: parseAnyDef() };
}
__name(parseNeverDef, "parseNeverDef");
function parseNullDef() {
  return {
    type: "null"
  };
}
__name(parseNullDef, "parseNullDef");
var primitiveMappings = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef(def, refs) {
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every(
    (x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length)
  )) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce(
      (acc, x) => {
        const type = typeof x._def.value;
        switch (type) {
          case "string":
          case "number":
          case "boolean":
            return [...acc, type];
          case "bigint":
            return [...acc, "integer"];
          case "object":
            if (x._def.value === null) return [...acc, "null"];
          case "symbol":
          case "undefined":
          case "function":
          default:
            return acc;
        }
      },
      []
    );
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce(
          (acc, x) => {
            return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
          },
          []
        )
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce(
        (acc, x) => [
          ...acc,
          ...x._def.values.filter((x2) => !acc.includes(x2))
        ],
        []
      )
    };
  }
  return asAnyOf(def, refs);
}
__name(parseUnionDef, "parseUnionDef");
var asAnyOf = /* @__PURE__ */ __name((def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map(
    (x, i) => parseDef(x._def, {
      ...refs,
      currentPath: [...refs.currentPath, "anyOf", `${i}`]
    })
  ).filter(
    (x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0)
  );
  return anyOf.length ? { anyOf } : void 0;
}, "asAnyOf");
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    def.innerType._def.typeName
  ) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    return {
      type: [
        primitiveMappings[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  const base = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}
__name(parseNullableDef, "parseNullableDef");
function parseNumberDef(def) {
  const res = {
    type: "number"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        break;
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}
__name(parseNumberDef, "parseNumberDef");
function parseObjectDef(def, refs) {
  const result = {
    type: "object",
    properties: {}
  };
  const required = [];
  const shape = def.shape();
  for (const propName in shape) {
    let propDef = shape[propName];
    if (propDef === void 0 || propDef._def === void 0) {
      continue;
    }
    const propOptional = safeIsOptional(propDef);
    const parsedDef = parseDef(propDef._def, {
      ...refs,
      currentPath: [...refs.currentPath, "properties", propName],
      propertyPath: [...refs.currentPath, "properties", propName]
    });
    if (parsedDef === void 0) {
      continue;
    }
    result.properties[propName] = parsedDef;
    if (!propOptional) {
      required.push(propName);
    }
  }
  if (required.length) {
    result.required = required;
  }
  const additionalProperties = decideAdditionalProperties(def, refs);
  if (additionalProperties !== void 0) {
    result.additionalProperties = additionalProperties;
  }
  return result;
}
__name(parseObjectDef, "parseObjectDef");
function decideAdditionalProperties(def, refs) {
  if (def.catchall._def.typeName !== "ZodNever") {
    return parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    });
  }
  switch (def.unknownKeys) {
    case "passthrough":
      return refs.allowedAdditionalProperties;
    case "strict":
      return refs.rejectedAdditionalProperties;
    case "strip":
      return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
  }
}
__name(decideAdditionalProperties, "decideAdditionalProperties");
function safeIsOptional(schema) {
  try {
    return schema.isOptional();
  } catch (e) {
    return true;
  }
}
__name(safeIsOptional, "safeIsOptional");
var parseOptionalDef = /* @__PURE__ */ __name((def, refs) => {
  var _a24;
  if (refs.currentPath.toString() === ((_a24 = refs.propertyPath) == null ? void 0 : _a24.toString())) {
    return parseDef(def.innerType._def, refs);
  }
  const innerSchema = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"]
  });
  return innerSchema ? { anyOf: [{ not: parseAnyDef() }, innerSchema] } : parseAnyDef();
}, "parseOptionalDef");
var parsePipelineDef = /* @__PURE__ */ __name((def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef(def.out._def, refs);
  }
  const inputSchema = parseDef(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"]
  });
  const outputSchema2 = parseDef(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", inputSchema ? "1" : "0"]
  });
  return {
    allOf: [inputSchema, outputSchema2].filter(
      (schema) => schema !== void 0
    )
  };
}, "parsePipelineDef");
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}
__name(parsePromiseDef, "parsePromiseDef");
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    schema.minItems = def.minSize.value;
  }
  if (def.maxSize) {
    schema.maxItems = def.maxSize.value;
  }
  return schema;
}
__name(parseSetDef, "parseSetDef");
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      ),
      additionalItems: parseDef(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      )
    };
  }
}
__name(parseTupleDef, "parseTupleDef");
function parseUndefinedDef() {
  return {
    not: parseAnyDef()
  };
}
__name(parseUndefinedDef, "parseUndefinedDef");
function parseUnknownDef() {
  return parseAnyDef();
}
__name(parseUnknownDef, "parseUnknownDef");
var parseReadonlyDef = /* @__PURE__ */ __name((def, refs) => {
  return parseDef(def.innerType._def, refs);
}, "parseReadonlyDef");
var selectParser = /* @__PURE__ */ __name((def, typeName, refs) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef(def);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef();
    case ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind.ZodUnion:
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def);
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind.ZodLazy:
      return () => def.getter()._def;
    case ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind.ZodNaN:
    case ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef(def, refs);
    case ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind.ZodFunction:
    case ZodFirstPartyTypeKind.ZodVoid:
    case ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)(typeName);
  }
}, "selectParser");
var getRelativePath = /* @__PURE__ */ __name((pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
}, "getRelativePath");
function parseDef(def, refs, forceResolution = false) {
  var _a24;
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = (_a24 = refs.override) == null ? void 0 : _a24.call(
      refs,
      def,
      refs,
      seenItem,
      forceResolution
    );
    if (overrideResult !== ignoreOverride) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
  const jsonSchema2 = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
  if (jsonSchema2) {
    addMeta(def, refs, jsonSchema2);
  }
  if (refs.postProcess) {
    const postProcessResult = refs.postProcess(jsonSchema2, def, refs);
    newItem.jsonSchema = jsonSchema2;
    return postProcessResult;
  }
  newItem.jsonSchema = jsonSchema2;
  return jsonSchema2;
}
__name(parseDef, "parseDef");
var get$ref = /* @__PURE__ */ __name((item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return { $ref: item.path.join("/") };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            "/"
          )}! Defaulting to any`
        );
        return parseAnyDef();
      }
      return refs.$refStrategy === "seen" ? parseAnyDef() : void 0;
    }
  }
}, "get$ref");
var addMeta = /* @__PURE__ */ __name((def, refs, jsonSchema2) => {
  if (def.description) {
    jsonSchema2.description = def.description;
  }
  return jsonSchema2;
}, "addMeta");
var getRefs = /* @__PURE__ */ __name((options) => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return {
    ..._options,
    currentPath,
    propertyPath: void 0,
    seen: new Map(
      Object.entries(_options.definitions).map(([name24, def]) => [
        def._def,
        {
          def: def._def,
          path: [..._options.basePath, _options.definitionPath, name24],
          // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
          jsonSchema: void 0
        }
      ])
    )
  };
}, "getRefs");
var zod3ToJsonSchema = /* @__PURE__ */ __name((schema, options) => {
  var _a24;
  const refs = getRefs(options);
  let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce(
    (acc, [name34, schema2]) => {
      var _a34;
      return {
        ...acc,
        [name34]: (_a34 = parseDef(
          schema2._def,
          {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name34]
          },
          true
        )) != null ? _a34 : parseAnyDef()
      };
    },
    {}
  ) : void 0;
  const name24 = typeof options === "string" ? options : (options == null ? void 0 : options.nameStrategy) === "title" ? void 0 : options == null ? void 0 : options.name;
  const main = (_a24 = parseDef(
    schema._def,
    name24 === void 0 ? refs : {
      ...refs,
      currentPath: [...refs.basePath, refs.definitionPath, name24]
    },
    false
  )) != null ? _a24 : parseAnyDef();
  const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
  if (title !== void 0) {
    main.title = title;
  }
  const combined = name24 === void 0 ? definitions ? {
    ...main,
    [refs.definitionPath]: definitions
  } : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name24
    ].join("/"),
    [refs.definitionPath]: {
      ...definitions,
      [name24]: main
    }
  };
  combined.$schema = "http://json-schema.org/draft-07/schema#";
  return combined;
}, "zod3ToJsonSchema");
var schemaSymbol = /* @__PURE__ */ Symbol.for("vercel.ai.schema");
function lazySchema(createSchema) {
  let schema;
  return () => {
    if (schema == null) {
      schema = createSchema();
    }
    return schema;
  };
}
__name(lazySchema, "lazySchema");
function jsonSchema(jsonSchema2, {
  validate
} = {}) {
  return {
    [schemaSymbol]: true,
    _type: void 0,
    // should never be used directly
    get jsonSchema() {
      if (typeof jsonSchema2 === "function") {
        jsonSchema2 = jsonSchema2();
      }
      return jsonSchema2;
    },
    validate
  };
}
__name(jsonSchema, "jsonSchema");
function isSchema(value) {
  return typeof value === "object" && value !== null && schemaSymbol in value && value[schemaSymbol] === true && "jsonSchema" in value && "validate" in value;
}
__name(isSchema, "isSchema");
function asSchema(schema) {
  return schema == null ? jsonSchema({
    type: "object",
    properties: {},
    additionalProperties: false
  }) : isSchema(schema) ? schema : "~standard" in schema ? schema["~standard"].vendor === "zod" ? zodSchema(schema) : standardSchema(schema) : schema();
}
__name(asSchema, "asSchema");
function standardSchema(standardSchema2) {
  return jsonSchema(
    () => {
      if (!hasStandardJsonSchema(standardSchema2)) {
        throw new Error(
          `Standard schema vendor '${standardSchema2["~standard"].vendor}' does not support JSON Schema conversion.`
        );
      }
      return addAdditionalPropertiesToJsonSchema(
        standardSchema2["~standard"].jsonSchema.input({
          target: "draft-07"
        })
      );
    },
    {
      validate: /* @__PURE__ */ __name(async (value) => {
        const result = await standardSchema2["~standard"].validate(value);
        return "value" in result ? { success: true, value: result.value } : {
          success: false,
          error: new TypeValidationError({
            value,
            cause: result.issues
          })
        };
      }, "validate")
    }
  );
}
__name(standardSchema, "standardSchema");
function hasStandardJsonSchema(schema) {
  return schema["~standard"].jsonSchema != null;
}
__name(hasStandardJsonSchema, "hasStandardJsonSchema");
function zod3Schema(zodSchema2, options) {
  var _a24;
  const useReferences = (_a24 = options == null ? void 0 : options.useReferences) != null ? _a24 : false;
  return jsonSchema(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => zod3ToJsonSchema(zodSchema2, {
      $refStrategy: useReferences ? "root" : "none"
    }),
    {
      validate: /* @__PURE__ */ __name(async (value) => {
        const result = await zodSchema2.safeParseAsync(value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }, "validate")
    }
  );
}
__name(zod3Schema, "zod3Schema");
function zod4Schema(zodSchema2, options) {
  var _a24;
  const useReferences = (_a24 = options == null ? void 0 : options.useReferences) != null ? _a24 : false;
  return jsonSchema(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => addAdditionalPropertiesToJsonSchema(
      toJSONSchema(zodSchema2, {
        target: "draft-7",
        io: "input",
        reused: useReferences ? "ref" : "inline"
      })
    ),
    {
      validate: /* @__PURE__ */ __name(async (value) => {
        const result = await safeParseAsync(zodSchema2, value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }, "validate")
    }
  );
}
__name(zod4Schema, "zod4Schema");
function isZod4Schema(zodSchema2) {
  return "_zod" in zodSchema2;
}
__name(isZod4Schema, "isZod4Schema");
function zodSchema(zodSchema2, options) {
  if (isZod4Schema(zodSchema2)) {
    return zod4Schema(zodSchema2, options);
  } else {
    return zod3Schema(zodSchema2, options);
  }
}
__name(zodSchema, "zodSchema");
async function validateTypes({
  value,
  schema,
  context
}) {
  const result = await safeValidateTypes({ value, schema, context });
  if (!result.success) {
    throw TypeValidationError.wrap({ value, cause: result.error, context });
  }
  return result.value;
}
__name(validateTypes, "validateTypes");
async function safeValidateTypes({
  value,
  schema,
  context
}) {
  const actualSchema = asSchema(schema);
  try {
    if (actualSchema.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await actualSchema.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: result.error, context }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: error, context }),
      rawValue: value
    };
  }
}
__name(safeValidateTypes, "safeValidateTypes");
async function parseJSON({
  text: text2,
  schema
}) {
  try {
    const value = secureJsonParse(text2);
    if (schema == null) {
      return value;
    }
    return await validateTypes({ value, schema });
  } catch (error) {
    if (JSONParseError.isInstance(error) || TypeValidationError.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError({ text: text2, cause: error });
  }
}
__name(parseJSON, "parseJSON");
async function safeParseJSON({
  text: text2,
  schema
}) {
  try {
    const value = secureJsonParse(text2);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError.isInstance(error) ? error : new JSONParseError({ text: text2, cause: error }),
      rawValue: void 0
    };
  }
}
__name(safeParseJSON, "safeParseJSON");
function parseJsonEventStream({
  stream,
  schema
}) {
  return stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream()).pipeThrough(
    new TransformStream({
      async transform({ data }, controller) {
        if (data === "[DONE]") {
          return;
        }
        controller.enqueue(await safeParseJSON({ text: data, schema }));
      }
    })
  );
}
__name(parseJsonEventStream, "parseJsonEventStream");
async function parseProviderOptions({
  provider,
  providerOptions,
  schema
}) {
  if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
    return void 0;
  }
  const parsedProviderOptions = await safeValidateTypes({
    value: providerOptions[provider],
    schema
  });
  if (!parsedProviderOptions.success) {
    throw new InvalidArgumentError({
      argument: "providerOptions",
      message: `invalid ${provider} provider options`,
      cause: parsedProviderOptions.error
    });
  }
  return parsedProviderOptions.value;
}
__name(parseProviderOptions, "parseProviderOptions");
var getOriginalFetch2 = /* @__PURE__ */ __name(() => globalThis.fetch, "getOriginalFetch2");
var postJsonToApi = /* @__PURE__ */ __name(async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
}) => await postToApi({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
}), "postJsonToApi");
var postFormDataToApi = /* @__PURE__ */ __name(async ({
  url,
  headers,
  formData,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
}) => await postToApi({
  url,
  headers,
  body: {
    content: formData,
    values: Object.fromEntries(formData.entries())
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
}), "postFormDataToApi");
var postToApi = /* @__PURE__ */ __name(async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch: fetch2 = getOriginalFetch2()
}) => {
  try {
    const response = await fetch2(url, {
      method: "POST",
      headers: withUserAgentSuffix(
        headers,
        `ai-sdk/provider-utils/${VERSION}`,
        getRuntimeEnvironmentUserAgent()
      ),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
        throw new APICallError({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError({ error, url, requestBodyValues: body.values });
  }
}, "postToApi");
function tool(tool2) {
  return tool2;
}
__name(tool, "tool");
function createProviderDefinedToolFactory({
  id,
  inputSchema
}) {
  return ({
    execute,
    outputSchema: outputSchema2,
    needsApproval,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool({
    type: "provider",
    isProviderExecuted: false,
    id,
    args,
    inputSchema,
    outputSchema: outputSchema2,
    execute,
    needsApproval,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}
__name(createProviderDefinedToolFactory, "createProviderDefinedToolFactory");
function createProviderDefinedToolFactoryWithOutputSchema({
  id,
  inputSchema,
  outputSchema: outputSchema2
}) {
  return ({
    execute,
    needsApproval,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool({
    type: "provider",
    isProviderExecuted: false,
    id,
    args,
    inputSchema,
    outputSchema: outputSchema2,
    execute,
    needsApproval,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}
__name(createProviderDefinedToolFactoryWithOutputSchema, "createProviderDefinedToolFactoryWithOutputSchema");
function createProviderExecutedToolFactory({
  id,
  inputSchema,
  outputSchema: outputSchema2,
  supportsDeferredResults
}) {
  return ({
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool({
    type: "provider",
    isProviderExecuted: true,
    id,
    args,
    inputSchema,
    outputSchema: outputSchema2,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    supportsDeferredResults
  });
}
__name(createProviderExecutedToolFactory, "createProviderExecutedToolFactory");
async function resolve(value) {
  if (typeof value === "function") {
    value = value();
  }
  return Promise.resolve(value);
}
__name(resolve, "resolve");
function resolveFullMediaType({
  part
}) {
  if (isFullMediaType(part.mediaType)) {
    return part.mediaType;
  }
  if (part.data.type === "data") {
    const detected = detectMediaType({
      data: part.data.data,
      topLevelType: getTopLevelMediaType(part.mediaType)
    });
    if (detected) {
      return detected;
    }
    throw new UnsupportedFunctionalityError({
      functionality: `file of media type "${part.mediaType}" must specify subtype since it could not be auto-detected`
    });
  }
  throw new UnsupportedFunctionalityError({
    functionality: `file of media type "${part.mediaType}" must specify subtype since it is not passed as inline bytes`
  });
}
__name(resolveFullMediaType, "resolveFullMediaType");
function resolveProviderReference({
  reference,
  provider
}) {
  const id = reference[provider];
  if (id != null) {
    return id;
  }
  throw new NoSuchProviderReferenceError({
    provider,
    reference
  });
}
__name(resolveProviderReference, "resolveProviderReference");
var retryWithExponentialBackoff = /* @__PURE__ */ __name(({
  maxRetries = 2,
  initialDelayInMs = 2e3,
  backoffFactor = 2,
  abortSignal,
  shouldRetry,
  getDelayInMs = /* @__PURE__ */ __name(({ exponentialBackoffDelay }) => exponentialBackoffDelay, "getDelayInMs"),
  createRetryError = /* @__PURE__ */ __name(({ message }) => new Error(message), "createRetryError")
}) => async (f) => retryWithExponentialBackoffInternal(f, {
  maxRetries,
  delayInMs: initialDelayInMs,
  backoffFactor,
  abortSignal,
  shouldRetry,
  getDelayInMs,
  createRetryError
}), "retryWithExponentialBackoff");
async function retryWithExponentialBackoffInternal(f, {
  maxRetries,
  delayInMs,
  backoffFactor,
  abortSignal,
  shouldRetry,
  getDelayInMs,
  createRetryError
}, errors = []) {
  try {
    return await f();
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    if (maxRetries === 0) {
      throw error;
    }
    const errorMessage = getErrorMessage(error);
    const newErrors = [...errors, error];
    const tryNumber = newErrors.length;
    if (tryNumber > maxRetries) {
      throw createRetryError({
        message: `Failed after ${tryNumber} attempts. Last error: ${errorMessage}`,
        reason: "maxRetriesExceeded",
        errors: newErrors
      });
    }
    if (await shouldRetry(error) && tryNumber <= maxRetries) {
      await delay(
        getDelayInMs({
          error,
          exponentialBackoffDelay: delayInMs
        }),
        { abortSignal }
      );
      return retryWithExponentialBackoffInternal(
        f,
        {
          maxRetries,
          delayInMs: backoffFactor * delayInMs,
          backoffFactor,
          abortSignal,
          shouldRetry,
          getDelayInMs,
          createRetryError
        },
        newErrors
      );
    }
    if (tryNumber === 1) {
      throw error;
    }
    throw createRetryError({
      message: `Failed after ${tryNumber} attempts with non-retryable error: '${errorMessage}'`,
      reason: "errorNotRetryable",
      errors: newErrors
    });
  }
}
__name(retryWithExponentialBackoffInternal, "retryWithExponentialBackoffInternal");
var textDecoder2 = new TextDecoder();
async function readResponseBodyAsText({
  response,
  url
}) {
  return textDecoder2.decode(
    await readResponseWithSizeLimit({
      response,
      url
    })
  );
}
__name(readResponseBodyAsText, "readResponseBodyAsText");
var createJsonErrorResponseHandler = /* @__PURE__ */ __name(({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await readResponseBodyAsText({ response, url });
  const responseHeaders = extractResponseHeaders(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (e) {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
}, "createJsonErrorResponseHandler");
var createEventSourceResponseHandler = /* @__PURE__ */ __name((chunkSchema) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError({});
  }
  return {
    responseHeaders,
    value: parseJsonEventStream({
      stream: response.body,
      schema: chunkSchema
    })
  };
}, "createEventSourceResponseHandler");
var createJsonResponseHandler = /* @__PURE__ */ __name((responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await readResponseBodyAsText({ response, url });
  const parsedResult = await safeParseJSON({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders(response);
  if (!parsedResult.success) {
    throw new APICallError({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
}, "createJsonResponseHandler");
var createBinaryResponseHandler = /* @__PURE__ */ __name(() => async ({ response, url, requestBodyValues }) => {
  const responseHeaders = extractResponseHeaders(response);
  if (!response.body) {
    throw new APICallError({
      message: "Response body is empty",
      url,
      requestBodyValues,
      statusCode: response.status,
      responseHeaders,
      responseBody: void 0
    });
  }
  try {
    const buffer = await response.arrayBuffer();
    return {
      responseHeaders,
      value: new Uint8Array(buffer)
    };
  } catch (error) {
    throw new APICallError({
      message: "Failed to read response as array buffer",
      url,
      requestBodyValues,
      statusCode: response.status,
      responseHeaders,
      responseBody: void 0,
      cause: error
    });
  }
}, "createBinaryResponseHandler");
function isJSONSerializable(value) {
  if (value === null || value === void 0) return true;
  const type = typeof value;
  if (type === "string" || type === "number" || type === "boolean") return true;
  if (type === "function" || type === "symbol" || type === "bigint")
    return false;
  if (Array.isArray(value)) {
    return value.every(isJSONSerializable);
  }
  if (Object.getPrototypeOf(value) === Object.prototype) {
    return Object.values(value).every(
      isJSONSerializable
    );
  }
  return false;
}
__name(isJSONSerializable, "isJSONSerializable");
function serializeModelOptions(options) {
  const serializableConfig = {};
  for (const [key, value] of Object.entries(options.config)) {
    if (key === "headers") {
      const resolvedHeaders = resolveSync(value);
      if (isJSONSerializable(resolvedHeaders)) {
        serializableConfig[key] = resolvedHeaders;
      }
    } else if (isJSONSerializable(value)) {
      serializableConfig[key] = value;
    }
  }
  return { modelId: options.modelId, config: serializableConfig };
}
__name(serializeModelOptions, "serializeModelOptions");
function resolveSync(value) {
  let next = value;
  if (typeof value === "function") {
    next = value();
  }
  if (next instanceof Promise) {
    throw new Error("Promise returned from resolveSync");
  }
  return next;
}
__name(resolveSync, "resolveSync");
var StreamingToolCallTracker = class {
  static {
    __name(this, "StreamingToolCallTracker");
  }
  constructor(controller, options = {}) {
    this.toolCalls = [];
    var _a24, _b23;
    this.controller = controller;
    this._generateId = (_a24 = options.generateId) != null ? _a24 : generateId;
    this.typeValidation = (_b23 = options.typeValidation) != null ? _b23 : "none";
    this.extractMetadata = options.extractMetadata;
    this.buildToolCallProviderMetadata = options.buildToolCallProviderMetadata;
  }
  /**
   * Process a tool call delta from a streaming response chunk.
   * Emits tool-input-start, tool-input-delta, tool-input-end, and tool-call
   * events as appropriate.
   */
  processDelta(toolCallDelta) {
    var _a24;
    const index = (_a24 = toolCallDelta.index) != null ? _a24 : this.toolCalls.length;
    if (this.toolCalls[index] == null) {
      this.processNewToolCall(index, toolCallDelta);
    } else {
      this.processExistingToolCall(index, toolCallDelta);
    }
  }
  /**
   * Finalize any unfinished tool calls. Should be called during the stream's
   * flush handler to ensure all tool calls are properly completed.
   */
  flush() {
    for (const toolCall of this.toolCalls) {
      if (!toolCall.hasFinished) {
        this.finishToolCall(toolCall);
      }
    }
  }
  processNewToolCall(index, toolCallDelta) {
    var _a24, _b23, _c;
    if (this.typeValidation === "required") {
      if (toolCallDelta.type !== "function") {
        throw new InvalidResponseDataError({
          data: toolCallDelta,
          message: `Expected 'function' type.`
        });
      }
    } else if (this.typeValidation === "if-present") {
      if (toolCallDelta.type != null && toolCallDelta.type !== "function") {
        throw new InvalidResponseDataError({
          data: toolCallDelta,
          message: `Expected 'function' type.`
        });
      }
    }
    if (toolCallDelta.id == null) {
      throw new InvalidResponseDataError({
        data: toolCallDelta,
        message: `Expected 'id' to be a string.`
      });
    }
    if (((_a24 = toolCallDelta.function) == null ? void 0 : _a24.name) == null) {
      throw new InvalidResponseDataError({
        data: toolCallDelta,
        message: `Expected 'function.name' to be a string.`
      });
    }
    this.controller.enqueue({
      type: "tool-input-start",
      id: toolCallDelta.id,
      toolName: toolCallDelta.function.name
    });
    const metadata = (_b23 = this.extractMetadata) == null ? void 0 : _b23.call(this, toolCallDelta);
    this.toolCalls[index] = {
      id: toolCallDelta.id,
      type: "function",
      function: {
        name: toolCallDelta.function.name,
        arguments: (_c = toolCallDelta.function.arguments) != null ? _c : ""
      },
      hasFinished: false,
      metadata
    };
    const toolCall = this.toolCalls[index];
    if (toolCall.function.arguments.length > 0) {
      this.controller.enqueue({
        type: "tool-input-delta",
        id: toolCall.id,
        delta: toolCall.function.arguments
      });
    }
  }
  processExistingToolCall(index, toolCallDelta) {
    var _a24;
    const toolCall = this.toolCalls[index];
    if (toolCall.hasFinished) {
      return;
    }
    if (((_a24 = toolCallDelta.function) == null ? void 0 : _a24.arguments) != null) {
      toolCall.function.arguments += toolCallDelta.function.arguments;
      this.controller.enqueue({
        type: "tool-input-delta",
        id: toolCall.id,
        delta: toolCallDelta.function.arguments
      });
    }
  }
  finishToolCall(toolCall) {
    var _a24, _b23;
    this.controller.enqueue({
      type: "tool-input-end",
      id: toolCall.id
    });
    const providerMetadata = (_a24 = this.buildToolCallProviderMetadata) == null ? void 0 : _a24.call(
      this,
      toolCall.metadata
    );
    this.controller.enqueue({
      type: "tool-call",
      toolCallId: (_b23 = toolCall.id) != null ? _b23 : this._generateId(),
      toolName: toolCall.function.name,
      input: toolCall.function.arguments,
      ...providerMetadata ? { providerMetadata } : {}
    });
    toolCall.hasFinished = true;
  }
};
var TRANSCRIPTION_STREAM_START_FRAME_TYPE = "transcription-stream.start";
var TRANSCRIPTION_STREAM_AUDIO_DONE_FRAME_TYPE = "transcription-stream.audio-done";
function parseTranscriptionStreamPart(text2) {
  let value;
  try {
    value = secureJsonParse(text2);
  } catch (e) {
    return void 0;
  }
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return void 0;
  }
  const part = value;
  switch (part.type) {
    case "stream-start":
      return Array.isArray(part.warnings) && part.warnings.every(isWarning) ? part : void 0;
    case "transcript-delta":
      return isString(part.delta) && isOptional(part.id, isString) && isOptional(part.providerMetadata, isPlainObject) ? part : void 0;
    case "transcript-partial":
      return isString(part.text) && isOptional(part.id, isString) && isOptional(part.startSecond, isNumber) && isOptional(part.durationInSeconds, isNumber) && isOptional(part.channelIndex, isNumber) && isOptional(part.providerMetadata, isPlainObject) ? part : void 0;
    case "transcript-final":
      return isString(part.text) && isOptional(part.id, isString) && isOptional(part.startSecond, isNumber) && isOptional(part.endSecond, isNumber) && isOptional(part.channelIndex, isNumber) && isOptional(part.providerMetadata, isPlainObject) ? part : void 0;
    case "finish":
      return isString(part.text) && Array.isArray(part.segments) && part.segments.every(isSegment) && isOptional(part.language, isString) && isOptional(part.durationInSeconds, isNumber) && isOptional(part.providerMetadata, isPlainObject) ? part : void 0;
    case "response-metadata": {
      if (!(isOptional(part.modelId, isString) && isOptional(part.headers, isPlainObject))) {
        return void 0;
      }
      const timestamp = part.timestamp;
      if (timestamp == null) {
        return { ...part, timestamp: void 0 };
      }
      if (typeof timestamp !== "string") {
        return void 0;
      }
      const revived = new Date(timestamp);
      return Number.isNaN(revived.getTime()) ? void 0 : { ...part, timestamp: revived };
    }
    case "raw":
      return "rawValue" in part ? part : void 0;
    case "error":
      return "error" in part ? part : void 0;
    default:
      return void 0;
  }
}
__name(parseTranscriptionStreamPart, "parseTranscriptionStreamPart");
function isString(value) {
  return typeof value === "string";
}
__name(isString, "isString");
function isNumber(value) {
  return typeof value === "number";
}
__name(isNumber, "isNumber");
function isOptional(value, check) {
  return value === void 0 || check(value);
}
__name(isOptional, "isOptional");
function isPlainObject(value) {
  return typeof value === "object" && value != null && !Array.isArray(value);
}
__name(isPlainObject, "isPlainObject");
function isWarning(value) {
  return isPlainObject(value) && isString(value.type);
}
__name(isWarning, "isWarning");
function isSegment(value) {
  return isPlainObject(value) && isString(value.text) && isNumber(value.startSecond) && isNumber(value.endSecond);
}
__name(isSegment, "isSegment");
function validateBaseURL(baseURL) {
  if ((baseURL == null ? void 0 : baseURL.trim()) === "") {
    throw new InvalidArgumentError({
      argument: "baseURL",
      message: "baseURL must be a non-empty string."
    });
  }
  return baseURL;
}
__name(validateBaseURL, "validateBaseURL");
function withoutTrailingSlash(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}
__name(withoutTrailingSlash, "withoutTrailingSlash");

// node_modules/.pnpm/@ai-sdk+gateway@4.0.23_zod@3.25.76/node_modules/@ai-sdk/gateway/dist/index.js
var import_oidc = __toESM(require_dist(), 1);
var import_oidc2 = __toESM(require_dist(), 1);
var GATEWAY_REALTIME_SUBPROTOCOL = "ai-gateway-realtime.v1";
var GATEWAY_TRANSCRIPTION_SUBPROTOCOL = "ai-gateway-transcription.v1";
var GATEWAY_AUTH_SUBPROTOCOL_PREFIX = "ai-gateway-auth.";
var GATEWAY_TEAM_SUBPROTOCOL_PREFIX = "ai-gateway-team.";
function getGatewayRealtimeProtocols(token, options) {
  return buildGatewayProtocols(GATEWAY_REALTIME_SUBPROTOCOL, token, options);
}
__name(getGatewayRealtimeProtocols, "getGatewayRealtimeProtocols");
function getGatewayTranscriptionProtocols(token, options) {
  return buildGatewayProtocols(
    GATEWAY_TRANSCRIPTION_SUBPROTOCOL,
    token,
    options
  );
}
__name(getGatewayTranscriptionProtocols, "getGatewayTranscriptionProtocols");
function buildGatewayProtocols(marker113, token, options) {
  const protocols = [marker113, `${GATEWAY_AUTH_SUBPROTOCOL_PREFIX}${token}`];
  if (options == null ? void 0 : options.teamIdOrSlug) {
    protocols.push(
      `${GATEWAY_TEAM_SUBPROTOCOL_PREFIX}${encodeSubprotocolValue(options.teamIdOrSlug)}`
    );
  }
  return protocols;
}
__name(buildGatewayProtocols, "buildGatewayProtocols");
function encodeSubprotocolValue(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}
__name(encodeSubprotocolValue, "encodeSubprotocolValue");
var marker17 = "vercel.ai.gateway.error";
var symbol17 = Symbol.for(marker17);
var _a17;
var _b17;
var GatewayError = class _GatewayError extends (_b17 = Error, _a17 = symbol17, _b17) {
  static {
    __name(this, "_GatewayError");
  }
  constructor({
    message,
    statusCode = 500,
    cause,
    generationId,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500)
    // server error
  }) {
    super(generationId ? `${message} [${generationId}]` : message);
    this[_a17] = true;
    this.statusCode = statusCode;
    this.cause = cause;
    this.generationId = generationId;
    this.isRetryable = isRetryable;
  }
  /**
   * Checks if the given error is a Gateway Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is a Gateway Error, false otherwise.
   */
  static isInstance(error) {
    return _GatewayError.hasMarker(error);
  }
  static hasMarker(error) {
    return typeof error === "object" && error !== null && symbol17 in error && error[symbol17] === true;
  }
};
var name16 = "GatewayAuthenticationError";
var marker22 = `vercel.ai.gateway.error.${name16}`;
var symbol22 = Symbol.for(marker22);
var _a22;
var _b22;
var GatewayAuthenticationError = class _GatewayAuthenticationError extends (_b22 = GatewayError, _a22 = symbol22, _b22) {
  static {
    __name(this, "_GatewayAuthenticationError");
  }
  constructor({
    message = "Authentication failed",
    statusCode = 401,
    cause,
    generationId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a22] = true;
    this.name = name16;
    this.type = "authentication_error";
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol22 in error;
  }
  /**
   * Creates a contextual error message when authentication fails
   */
  static createContextualError({
    apiKeyProvided,
    oidcTokenProvided,
    statusCode = 401,
    cause,
    generationId
  }) {
    let contextualMessage;
    if (apiKeyProvided) {
      contextualMessage = `AI Gateway authentication failed: Invalid API key or token.

Create a new API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys

Provide an API key or Vercel access token via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.`;
    } else if (oidcTokenProvided) {
      contextualMessage = `AI Gateway authentication failed: Invalid OIDC token.

Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.

Alternatively, use an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys
or pass a Vercel access token via the 'apiKey' option.`;
    } else {
      contextualMessage = `AI Gateway authentication failed: No authentication provided.

Option 1 - API key:
Create an API key: https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%2Fapi-keys
Provide via 'apiKey' option or 'AI_GATEWAY_API_KEY' environment variable.

Option 2 - Vercel access token:
Pass a Vercel personal access token or Vercel app access token via the 'apiKey' option.

Option 3 - OIDC token:
Run 'npx vercel link' to link your project, then 'vc env pull' to fetch the token.`;
    }
    return new _GatewayAuthenticationError({
      message: contextualMessage,
      statusCode,
      cause,
      generationId
    });
  }
};
var name22 = "GatewayInvalidRequestError";
var marker32 = `vercel.ai.gateway.error.${name22}`;
var symbol32 = Symbol.for(marker32);
var _a32;
var _b32;
var GatewayInvalidRequestError = class extends (_b32 = GatewayError, _a32 = symbol32, _b32) {
  static {
    __name(this, "GatewayInvalidRequestError");
  }
  constructor({
    message = "Invalid request",
    statusCode = 400,
    cause,
    generationId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a32] = true;
    this.name = name22;
    this.type = "invalid_request_error";
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol32 in error;
  }
};
var name32 = "GatewayRateLimitError";
var marker42 = `vercel.ai.gateway.error.${name32}`;
var symbol42 = Symbol.for(marker42);
var _a42;
var _b42;
var GatewayRateLimitError = class extends (_b42 = GatewayError, _a42 = symbol42, _b42) {
  static {
    __name(this, "GatewayRateLimitError");
  }
  constructor({
    message = "Rate limit exceeded",
    statusCode = 429,
    cause,
    generationId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a42] = true;
    this.name = name32;
    this.type = "rate_limit_exceeded";
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol42 in error;
  }
};
var name42 = "GatewayModelNotFoundError";
var marker52 = `vercel.ai.gateway.error.${name42}`;
var symbol52 = Symbol.for(marker52);
var modelNotFoundParamSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      modelId: external_exports.string()
    })
  )
);
var _a52;
var _b52;
var GatewayModelNotFoundError = class extends (_b52 = GatewayError, _a52 = symbol52, _b52) {
  static {
    __name(this, "GatewayModelNotFoundError");
  }
  constructor({
    message = "Model not found",
    statusCode = 404,
    modelId,
    cause,
    generationId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a52] = true;
    this.name = name42;
    this.type = "model_not_found";
    this.modelId = modelId;
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol52 in error;
  }
};
var name52 = "GatewayInternalServerError";
var marker62 = `vercel.ai.gateway.error.${name52}`;
var symbol62 = Symbol.for(marker62);
var _a62;
var _b62;
var GatewayInternalServerError = class extends (_b62 = GatewayError, _a62 = symbol62, _b62) {
  static {
    __name(this, "GatewayInternalServerError");
  }
  constructor({
    message = "Internal server error",
    statusCode = 500,
    cause,
    generationId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a62] = true;
    this.name = name52;
    this.type = "internal_server_error";
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol62 in error;
  }
};
var name62 = "GatewayFailedDependencyError";
var marker72 = `vercel.ai.gateway.error.${name62}`;
var symbol72 = Symbol.for(marker72);
var _a72;
var _b72;
var GatewayFailedDependencyError = class extends (_b72 = GatewayError, _a72 = symbol72, _b72) {
  static {
    __name(this, "GatewayFailedDependencyError");
  }
  constructor({
    message = "Failed dependency",
    statusCode = 424,
    cause,
    generationId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a72] = true;
    this.name = name62;
    this.type = "failed_dependency";
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol72 in error;
  }
};
var name72 = "GatewayForbiddenError";
var marker82 = `vercel.ai.gateway.error.${name72}`;
var symbol82 = Symbol.for(marker82);
var forbiddenParamSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      ruleId: external_exports.string()
    })
  )
);
var _a82;
var _b82;
var GatewayForbiddenError = class extends (_b82 = GatewayError, _a82 = symbol82, _b82) {
  static {
    __name(this, "GatewayForbiddenError");
  }
  constructor({
    message = "Forbidden",
    statusCode = 403,
    cause,
    generationId,
    ruleId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a82] = true;
    this.name = name72;
    this.type = "forbidden";
    this.ruleId = ruleId;
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol82 in error;
  }
};
var name82 = "GatewayResponseError";
var marker92 = `vercel.ai.gateway.error.${name82}`;
var symbol92 = Symbol.for(marker92);
var _a92;
var _b92;
var GatewayResponseError = class extends (_b92 = GatewayError, _a92 = symbol92, _b92) {
  static {
    __name(this, "GatewayResponseError");
  }
  constructor({
    message = "Invalid response from Gateway",
    statusCode = 502,
    response,
    validationError,
    cause,
    generationId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a92] = true;
    this.name = name82;
    this.type = "response_error";
    this.response = response;
    this.validationError = validationError;
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol92 in error;
  }
};
async function createGatewayErrorFromResponse({
  response,
  statusCode,
  defaultMessage = "Gateway request failed",
  cause,
  authMethod
}) {
  var _a113;
  const parseResult = await safeValidateTypes({
    value: response,
    schema: gatewayErrorResponseSchema
  });
  if (!parseResult.success) {
    const rawGenerationId = typeof response === "object" && response !== null && "generationId" in response ? response.generationId : void 0;
    return new GatewayResponseError({
      message: `Invalid error response format: ${defaultMessage}`,
      statusCode,
      response,
      validationError: parseResult.error,
      cause,
      generationId: rawGenerationId
    });
  }
  const validatedResponse = parseResult.value;
  const errorType = validatedResponse.error.type;
  const message = validatedResponse.error.message;
  const generationId = (_a113 = validatedResponse.generationId) != null ? _a113 : void 0;
  switch (errorType) {
    case "authentication_error":
      return GatewayAuthenticationError.createContextualError({
        apiKeyProvided: authMethod === "api-key",
        oidcTokenProvided: authMethod === "oidc",
        statusCode,
        cause,
        generationId
      });
    case "invalid_request_error":
      return new GatewayInvalidRequestError({
        message,
        statusCode,
        cause,
        generationId
      });
    case "rate_limit_exceeded":
      return new GatewayRateLimitError({
        message,
        statusCode,
        cause,
        generationId
      });
    case "model_not_found": {
      const modelResult = await safeValidateTypes({
        value: validatedResponse.error.param,
        schema: modelNotFoundParamSchema
      });
      return new GatewayModelNotFoundError({
        message,
        statusCode,
        modelId: modelResult.success ? modelResult.value.modelId : void 0,
        cause,
        generationId
      });
    }
    case "internal_server_error":
      return new GatewayInternalServerError({
        message,
        statusCode,
        cause,
        generationId
      });
    case "failed_dependency":
      return new GatewayFailedDependencyError({
        message,
        statusCode,
        cause,
        generationId
      });
    case "forbidden": {
      const ruleResult = await safeValidateTypes({
        value: validatedResponse.error.param,
        schema: forbiddenParamSchema
      });
      return new GatewayForbiddenError({
        message,
        statusCode,
        cause,
        generationId,
        ruleId: ruleResult.success ? ruleResult.value.ruleId : void 0
      });
    }
    default:
      return new GatewayInternalServerError({
        message,
        statusCode,
        cause,
        generationId
      });
  }
}
__name(createGatewayErrorFromResponse, "createGatewayErrorFromResponse");
var gatewayErrorResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      error: external_exports.object({
        message: external_exports.string(),
        type: external_exports.string().nullish(),
        param: external_exports.unknown().nullish(),
        code: external_exports.union([external_exports.string(), external_exports.number()]).nullish()
      }),
      generationId: external_exports.string().nullish()
    })
  )
);
function extractApiCallResponse(error) {
  if (error.data !== void 0) {
    return error.data;
  }
  if (error.responseBody != null) {
    try {
      return secureJsonParse(error.responseBody);
    } catch (e) {
      return error.responseBody;
    }
  }
  return {};
}
__name(extractApiCallResponse, "extractApiCallResponse");
var name92 = "GatewayTimeoutError";
var marker102 = `vercel.ai.gateway.error.${name92}`;
var symbol102 = Symbol.for(marker102);
var _a102;
var _b102;
var GatewayTimeoutError = class _GatewayTimeoutError extends (_b102 = GatewayError, _a102 = symbol102, _b102) {
  static {
    __name(this, "_GatewayTimeoutError");
  }
  constructor({
    message = "Request timed out",
    statusCode = 408,
    cause,
    generationId
  } = {}) {
    super({ message, statusCode, cause, generationId });
    this[_a102] = true;
    this.name = name92;
    this.type = "timeout_error";
  }
  static isInstance(error) {
    return GatewayError.hasMarker(error) && symbol102 in error;
  }
  /**
   * Creates a helpful timeout error message with troubleshooting guidance
   */
  static createTimeoutError({
    originalMessage,
    statusCode = 408,
    cause,
    generationId
  }) {
    const message = `Gateway request timed out: ${originalMessage}

    This is a client-side timeout. To resolve this, increase your timeout configuration: https://vercel.com/docs/ai-gateway/capabilities/video-generation#extending-timeouts-for-node.js`;
    return new _GatewayTimeoutError({
      message,
      statusCode,
      cause,
      generationId
    });
  }
};
function isTimeoutError(error) {
  if (!(error instanceof Error)) {
    return false;
  }
  const errorCode = error.code;
  if (typeof errorCode === "string") {
    const undiciTimeoutCodes = [
      "UND_ERR_HEADERS_TIMEOUT",
      "UND_ERR_BODY_TIMEOUT",
      "UND_ERR_CONNECT_TIMEOUT"
    ];
    return undiciTimeoutCodes.includes(errorCode);
  }
  return false;
}
__name(isTimeoutError, "isTimeoutError");
async function asGatewayError(error, authMethod) {
  var _a113;
  if (GatewayError.isInstance(error)) {
    return error;
  }
  if (isTimeoutError(error)) {
    return GatewayTimeoutError.createTimeoutError({
      originalMessage: error instanceof Error ? error.message : "Unknown error",
      cause: error
    });
  }
  if (APICallError.isInstance(error)) {
    if (error.cause && isTimeoutError(error.cause)) {
      return GatewayTimeoutError.createTimeoutError({
        originalMessage: error.message,
        cause: error
      });
    }
    return await createGatewayErrorFromResponse({
      response: extractApiCallResponse(error),
      statusCode: (_a113 = error.statusCode) != null ? _a113 : 500,
      defaultMessage: "Gateway request failed",
      cause: error,
      authMethod
    });
  }
  return await createGatewayErrorFromResponse({
    response: {},
    statusCode: 500,
    defaultMessage: error instanceof Error ? `Gateway request failed: ${error.message}` : "Unknown Gateway error",
    cause: error,
    authMethod
  });
}
__name(asGatewayError, "asGatewayError");
var GATEWAY_AUTH_METHOD_HEADER = "ai-gateway-auth-method";
var VERCEL_AI_GATEWAY_TEAM_HEADER = "x-vercel-ai-gateway-team";
async function parseAuthMethod(headers) {
  const result = await safeValidateTypes({
    value: headers[GATEWAY_AUTH_METHOD_HEADER],
    schema: gatewayAuthMethodSchema
  });
  return result.success ? result.value : void 0;
}
__name(parseAuthMethod, "parseAuthMethod");
var gatewayAuthMethodSchema = lazySchema(
  () => zodSchema(external_exports.union([external_exports.literal("api-key"), external_exports.literal("oidc")]))
);
var KNOWN_MODEL_TYPES = [
  "embedding",
  "image",
  "language",
  "realtime",
  "reranking",
  "speech",
  "transcription",
  "video"
];
var GatewayFetchMetadata = class {
  static {
    __name(this, "GatewayFetchMetadata");
  }
  constructor(config) {
    this.config = config;
  }
  async getAvailableModels() {
    try {
      const { value } = await getFromApi({
        url: `${this.config.baseURL}/config`,
        validateUrl: false,
        headers: this.config.headers ? await resolve(this.config.headers) : void 0,
        successfulResponseHandler: createJsonResponseHandler(
          gatewayAvailableModelsResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        fetch: this.config.fetch
      });
      return value;
    } catch (error) {
      throw await asGatewayError(error);
    }
  }
  async getCredits() {
    try {
      const baseUrl = new URL(this.config.baseURL);
      const { value } = await getFromApi({
        url: `${baseUrl.origin}/v1/credits`,
        validateUrl: false,
        headers: this.config.headers ? await resolve(this.config.headers) : void 0,
        successfulResponseHandler: createJsonResponseHandler(
          gatewayCreditsResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        fetch: this.config.fetch
      });
      return value;
    } catch (error) {
      throw await asGatewayError(error);
    }
  }
};
var gatewayAvailableModelsResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      models: external_exports.array(
        external_exports.object({
          id: external_exports.string(),
          name: external_exports.string(),
          description: external_exports.string().nullish(),
          pricing: external_exports.object({
            input: external_exports.string(),
            output: external_exports.string(),
            input_cache_read: external_exports.string().nullish(),
            input_cache_write: external_exports.string().nullish()
          }).transform(
            ({ input, output, input_cache_read, input_cache_write }) => ({
              input,
              output,
              ...input_cache_read ? { cachedInputTokens: input_cache_read } : {},
              ...input_cache_write ? { cacheCreationInputTokens: input_cache_write } : {}
            })
          ).nullish(),
          specification: external_exports.object({
            specificationVersion: external_exports.literal("v4"),
            provider: external_exports.string(),
            modelId: external_exports.string()
          }),
          modelType: external_exports.string().nullish()
        })
      ).transform(
        (models) => models.filter(
          (m) => m.modelType == null || KNOWN_MODEL_TYPES.includes(m.modelType)
        )
      )
    })
  )
);
var gatewayCreditsResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      balance: external_exports.string(),
      total_used: external_exports.string()
    }).transform(({ balance, total_used }) => ({
      balance,
      totalUsed: total_used
    }))
  )
);
var GatewaySpendReport = class {
  static {
    __name(this, "GatewaySpendReport");
  }
  constructor(config) {
    this.config = config;
  }
  async getSpendReport(params) {
    try {
      const baseUrl = new URL(this.config.baseURL);
      const searchParams = new URLSearchParams();
      searchParams.set("start_date", params.startDate);
      searchParams.set("end_date", params.endDate);
      if (params.groupBy) {
        searchParams.set("group_by", params.groupBy);
      }
      if (params.datePart) {
        searchParams.set("date_part", params.datePart);
      }
      if (params.userId) {
        searchParams.set("user_id", params.userId);
      }
      if (params.model) {
        searchParams.set("model", params.model);
      }
      if (params.provider) {
        searchParams.set("provider", params.provider);
      }
      if (params.credentialType) {
        searchParams.set("credential_type", params.credentialType);
      }
      if (params.tags && params.tags.length > 0) {
        searchParams.set("tags", params.tags.join(","));
      }
      const { value } = await getFromApi({
        url: `${baseUrl.origin}/v1/report?${searchParams.toString()}`,
        validateUrl: false,
        headers: this.config.headers ? await resolve(this.config.headers) : void 0,
        successfulResponseHandler: createJsonResponseHandler(
          gatewaySpendReportResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        fetch: this.config.fetch
      });
      return value;
    } catch (error) {
      throw await asGatewayError(error);
    }
  }
};
var gatewaySpendReportResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      results: external_exports.array(
        external_exports.object({
          day: external_exports.string().optional(),
          hour: external_exports.string().optional(),
          user: external_exports.string().optional(),
          model: external_exports.string().optional(),
          tag: external_exports.string().optional(),
          provider: external_exports.string().optional(),
          credential_type: external_exports.enum(["byok", "system"]).optional(),
          total_cost: external_exports.number(),
          market_cost: external_exports.number().optional(),
          input_tokens: external_exports.number().optional(),
          output_tokens: external_exports.number().optional(),
          cached_input_tokens: external_exports.number().optional(),
          cache_creation_input_tokens: external_exports.number().optional(),
          reasoning_tokens: external_exports.number().optional(),
          request_count: external_exports.number().optional()
        }).transform(
          ({
            credential_type,
            total_cost,
            market_cost,
            input_tokens,
            output_tokens,
            cached_input_tokens,
            cache_creation_input_tokens,
            reasoning_tokens,
            request_count,
            ...rest
          }) => ({
            ...rest,
            ...credential_type !== void 0 ? { credentialType: credential_type } : {},
            totalCost: total_cost,
            ...market_cost !== void 0 ? { marketCost: market_cost } : {},
            ...input_tokens !== void 0 ? { inputTokens: input_tokens } : {},
            ...output_tokens !== void 0 ? { outputTokens: output_tokens } : {},
            ...cached_input_tokens !== void 0 ? { cachedInputTokens: cached_input_tokens } : {},
            ...cache_creation_input_tokens !== void 0 ? { cacheCreationInputTokens: cache_creation_input_tokens } : {},
            ...reasoning_tokens !== void 0 ? { reasoningTokens: reasoning_tokens } : {},
            ...request_count !== void 0 ? { requestCount: request_count } : {}
          })
        )
      )
    })
  )
);
var GatewayGenerationInfoFetcher = class {
  static {
    __name(this, "GatewayGenerationInfoFetcher");
  }
  constructor(config) {
    this.config = config;
  }
  async getGenerationInfo(params) {
    try {
      const baseUrl = new URL(this.config.baseURL);
      const { value } = await getFromApi({
        url: `${baseUrl.origin}/v1/generation?id=${encodeURIComponent(params.id)}`,
        validateUrl: false,
        headers: this.config.headers ? await resolve(this.config.headers) : void 0,
        successfulResponseHandler: createJsonResponseHandler(
          gatewayGenerationInfoResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        fetch: this.config.fetch
      });
      return value;
    } catch (error) {
      throw await asGatewayError(error);
    }
  }
};
var gatewayGenerationInfoResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      data: external_exports.object({
        id: external_exports.string(),
        total_cost: external_exports.number(),
        upstream_inference_cost: external_exports.number(),
        usage: external_exports.number(),
        created_at: external_exports.string(),
        model: external_exports.string(),
        is_byok: external_exports.boolean(),
        provider_name: external_exports.string(),
        streamed: external_exports.boolean(),
        finish_reason: external_exports.string(),
        latency: external_exports.number(),
        generation_time: external_exports.number(),
        native_tokens_prompt: external_exports.number(),
        native_tokens_completion: external_exports.number(),
        native_tokens_reasoning: external_exports.number(),
        native_tokens_cached: external_exports.number(),
        native_tokens_cache_creation: external_exports.number(),
        billable_web_search_calls: external_exports.number()
      }).transform(
        ({
          total_cost,
          upstream_inference_cost,
          created_at,
          is_byok,
          provider_name,
          finish_reason,
          generation_time,
          native_tokens_prompt,
          native_tokens_completion,
          native_tokens_reasoning,
          native_tokens_cached,
          native_tokens_cache_creation,
          billable_web_search_calls,
          ...rest
        }) => ({
          ...rest,
          totalCost: total_cost,
          upstreamInferenceCost: upstream_inference_cost,
          createdAt: created_at,
          isByok: is_byok,
          providerName: provider_name,
          finishReason: finish_reason,
          generationTime: generation_time,
          promptTokens: native_tokens_prompt,
          completionTokens: native_tokens_completion,
          reasoningTokens: native_tokens_reasoning,
          cachedTokens: native_tokens_cached,
          cacheCreationTokens: native_tokens_cache_creation,
          billableWebSearchCalls: billable_web_search_calls
        })
      )
    }).transform(({ data }) => data)
  )
);
var GatewayLanguageModel = class _GatewayLanguageModel {
  static {
    __name(this, "_GatewayLanguageModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
    this.supportedUrls = { "*/*": [/.*/] };
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _GatewayLanguageModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs(options) {
    const { abortSignal: _abortSignal, ...optionsWithoutSignal } = options;
    return {
      args: this.maybeEncodeFileParts(optionsWithoutSignal),
      warnings: []
    };
  }
  async doGenerate(options) {
    const { args, warnings } = await this.getArgs(options);
    const { abortSignal } = options;
    const resolvedHeaders = this.config.headers ? await resolve(this.config.headers) : void 0;
    try {
      const {
        responseHeaders,
        value: responseBody,
        rawValue: rawResponse
      } = await postJsonToApi({
        url: this.getUrl(),
        headers: combineHeaders(
          resolvedHeaders,
          options.headers,
          this.getModelConfigHeaders(this.modelId, false),
          await resolve(this.config.o11yHeaders)
        ),
        body: args,
        successfulResponseHandler: createJsonResponseHandler(external_exports.any()),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        ...abortSignal && { abortSignal },
        fetch: this.config.fetch
      });
      return {
        ...responseBody,
        request: { body: args },
        response: { headers: responseHeaders, body: rawResponse },
        warnings
      };
    } catch (error) {
      throw await asGatewayError(
        error,
        await parseAuthMethod(resolvedHeaders != null ? resolvedHeaders : {})
      );
    }
  }
  async doStream(options) {
    const { args, warnings } = await this.getArgs(options);
    const { abortSignal } = options;
    const resolvedHeaders = this.config.headers ? await resolve(this.config.headers) : void 0;
    try {
      const { value: response, responseHeaders } = await postJsonToApi({
        url: this.getUrl(),
        headers: combineHeaders(
          resolvedHeaders,
          options.headers,
          this.getModelConfigHeaders(this.modelId, true),
          await resolve(this.config.o11yHeaders)
        ),
        body: args,
        successfulResponseHandler: createEventSourceResponseHandler(external_exports.any()),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        ...abortSignal && { abortSignal },
        fetch: this.config.fetch
      });
      return {
        stream: response.pipeThrough(
          new TransformStream({
            start(controller) {
              if (warnings.length > 0) {
                controller.enqueue({ type: "stream-start", warnings });
              }
            },
            transform(chunk, controller) {
              if (chunk.success) {
                const streamPart = chunk.value;
                if (streamPart.type === "raw" && !options.includeRawChunks) {
                  return;
                }
                if (streamPart.type === "response-metadata" && streamPart.timestamp && typeof streamPart.timestamp === "string") {
                  streamPart.timestamp = new Date(streamPart.timestamp);
                }
                controller.enqueue(streamPart);
              } else {
                controller.error(
                  chunk.error
                );
              }
            }
          })
        ),
        request: { body: args },
        response: { headers: responseHeaders }
      };
    } catch (error) {
      throw await asGatewayError(
        error,
        await parseAuthMethod(resolvedHeaders != null ? resolvedHeaders : {})
      );
    }
  }
  /**
   * Encodes inline `Uint8Array` file data to a base64 string in place.
   * @param options - The options to encode.
   * @returns The options with the file data encoded.
   */
  maybeEncodeFileParts(options) {
    for (const message of options.prompt) {
      if (!Array.isArray(message.content)) {
        continue;
      }
      for (const part of message.content) {
        if (part.type === "file" || part.type === "reasoning-file") {
          part.data = maybeBase64EncodeFileData(part.data);
        } else if (part.type === "tool-result" && part.output.type === "content") {
          for (const contentPart of part.output.value) {
            if (contentPart.type === "file") {
              contentPart.data = maybeBase64EncodeFileData(contentPart.data);
            }
          }
        }
      }
    }
    return options;
  }
  getUrl() {
    return `${this.config.baseURL}/language-model`;
  }
  getModelConfigHeaders(modelId, streaming) {
    return {
      "ai-language-model-specification-version": "4",
      "ai-language-model-id": modelId,
      "ai-language-model-streaming": String(streaming)
    };
  }
};
function maybeBase64EncodeFileData(data) {
  if (data.type === "data") {
    const bytes = data.data;
    if (bytes instanceof Uint8Array) {
      return { ...data, data: Buffer.from(bytes).toString("base64") };
    }
  }
  return data;
}
__name(maybeBase64EncodeFileData, "maybeBase64EncodeFileData");
var GatewayEmbeddingModel = class _GatewayEmbeddingModel {
  static {
    __name(this, "_GatewayEmbeddingModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
    this.maxEmbeddingsPerCall = 2048;
    this.supportsParallelCalls = true;
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _GatewayEmbeddingModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values,
    headers,
    abortSignal,
    providerOptions
  }) {
    var _a113, _b112;
    const resolvedHeaders = this.config.headers ? await resolve(this.config.headers) : void 0;
    try {
      const {
        responseHeaders,
        value: responseBody,
        rawValue
      } = await postJsonToApi({
        url: this.getUrl(),
        headers: combineHeaders(
          resolvedHeaders,
          headers != null ? headers : {},
          this.getModelConfigHeaders(),
          await resolve(this.config.o11yHeaders)
        ),
        body: {
          values,
          ...providerOptions ? { providerOptions } : {}
        },
        successfulResponseHandler: createJsonResponseHandler(
          gatewayEmbeddingResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        ...abortSignal && { abortSignal },
        fetch: this.config.fetch
      });
      return {
        embeddings: responseBody.embeddings,
        usage: (_a113 = responseBody.usage) != null ? _a113 : void 0,
        providerMetadata: responseBody.providerMetadata,
        response: { headers: responseHeaders, body: rawValue },
        warnings: (_b112 = responseBody.warnings) != null ? _b112 : []
      };
    } catch (error) {
      throw await asGatewayError(
        error,
        await parseAuthMethod(resolvedHeaders != null ? resolvedHeaders : {})
      );
    }
  }
  getUrl() {
    return `${this.config.baseURL}/embedding-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-embedding-model-specification-version": "4",
      "ai-model-id": this.modelId
    };
  }
};
var gatewayEmbeddingWarningSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("unsupported"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("compatibility"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("deprecated"),
    setting: external_exports.string(),
    message: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("other"),
    message: external_exports.string()
  })
]);
var gatewayEmbeddingResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      embeddings: external_exports.array(external_exports.array(external_exports.number())),
      usage: external_exports.object({ tokens: external_exports.number() }).nullish(),
      warnings: external_exports.array(gatewayEmbeddingWarningSchema).optional(),
      providerMetadata: external_exports.record(external_exports.string(), external_exports.record(external_exports.string(), external_exports.unknown())).optional()
    })
  )
);
var GatewayImageModel = class _GatewayImageModel {
  static {
    __name(this, "_GatewayImageModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
    this.maxImagesPerCall = Number.MAX_SAFE_INTEGER;
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _GatewayImageModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt,
    n,
    size,
    aspectRatio,
    seed,
    files,
    mask,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a113, _b112, _c, _d;
    const resolvedHeaders = this.config.headers ? await resolve(this.config.headers) : void 0;
    try {
      const { responseHeaders, value: responseBody } = await postJsonToApi({
        url: this.getUrl(),
        headers: combineHeaders(
          resolvedHeaders,
          headers != null ? headers : {},
          this.getModelConfigHeaders(),
          await resolve(this.config.o11yHeaders)
        ),
        body: {
          prompt,
          n,
          ...size && { size },
          ...aspectRatio && { aspectRatio },
          ...seed && { seed },
          ...providerOptions && { providerOptions },
          ...files && {
            files: files.map((file) => maybeEncodeImageFile(file))
          },
          ...mask && { mask: maybeEncodeImageFile(mask) }
        },
        successfulResponseHandler: createJsonResponseHandler(
          gatewayImageResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        ...abortSignal && { abortSignal },
        fetch: this.config.fetch
      });
      return {
        images: responseBody.images,
        // Always base64 strings from server
        warnings: (_a113 = responseBody.warnings) != null ? _a113 : [],
        providerMetadata: responseBody.providerMetadata,
        response: {
          timestamp: /* @__PURE__ */ new Date(),
          modelId: this.modelId,
          headers: responseHeaders
        },
        ...responseBody.usage != null && {
          usage: {
            inputTokens: (_b112 = responseBody.usage.inputTokens) != null ? _b112 : void 0,
            outputTokens: (_c = responseBody.usage.outputTokens) != null ? _c : void 0,
            totalTokens: (_d = responseBody.usage.totalTokens) != null ? _d : void 0
          }
        }
      };
    } catch (error) {
      throw await asGatewayError(
        error,
        await parseAuthMethod(resolvedHeaders != null ? resolvedHeaders : {})
      );
    }
  }
  getUrl() {
    return `${this.config.baseURL}/image-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-image-model-specification-version": "4",
      "ai-model-id": this.modelId
    };
  }
};
function maybeEncodeImageFile(file) {
  if (file.type === "file" && file.data instanceof Uint8Array) {
    return {
      ...file,
      data: convertUint8ArrayToBase64(file.data)
    };
  }
  return file;
}
__name(maybeEncodeImageFile, "maybeEncodeImageFile");
var providerMetadataEntrySchema = external_exports.object({
  images: external_exports.array(external_exports.unknown()).optional()
}).catchall(external_exports.unknown());
var gatewayImageWarningSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("unsupported"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("compatibility"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("deprecated"),
    setting: external_exports.string(),
    message: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("other"),
    message: external_exports.string()
  })
]);
var gatewayImageUsageSchema = external_exports.object({
  inputTokens: external_exports.number().nullish(),
  outputTokens: external_exports.number().nullish(),
  totalTokens: external_exports.number().nullish()
});
var gatewayImageResponseSchema = external_exports.object({
  images: external_exports.array(external_exports.string()),
  // Always base64 strings over the wire
  warnings: external_exports.array(gatewayImageWarningSchema).optional(),
  providerMetadata: external_exports.record(external_exports.string(), providerMetadataEntrySchema).optional(),
  usage: gatewayImageUsageSchema.optional()
});
var GatewayVideoModel = class {
  static {
    __name(this, "GatewayVideoModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
    this.maxVideosPerCall = Number.MAX_SAFE_INTEGER;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt,
    n,
    aspectRatio,
    resolution,
    duration,
    fps,
    seed,
    generateAudio,
    image,
    frameImages,
    inputReferences,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a113;
    const resolvedHeaders = this.config.headers ? await resolve(this.config.headers) : void 0;
    try {
      const { responseHeaders, value: responseBody } = await postJsonToApi({
        url: this.getUrl(),
        headers: combineHeaders(
          resolvedHeaders,
          headers != null ? headers : {},
          this.getModelConfigHeaders(),
          await resolve(this.config.o11yHeaders),
          { accept: "text/event-stream" }
        ),
        body: {
          prompt,
          n,
          ...aspectRatio && { aspectRatio },
          ...resolution && { resolution },
          ...duration && { duration },
          ...fps && { fps },
          ...seed && { seed },
          ...generateAudio !== void 0 && { generateAudio },
          ...providerOptions && { providerOptions },
          ...image && { image: maybeEncodeVideoFile(image) },
          ...frameImages && {
            frameImages: frameImages.map((frame) => ({
              ...frame,
              image: maybeEncodeVideoFile(frame.image)
            }))
          },
          ...inputReferences && {
            inputReferences: inputReferences.map(
              (reference) => maybeEncodeVideoFile(reference)
            )
          }
        },
        successfulResponseHandler: /* @__PURE__ */ __name(async ({
          response,
          url,
          requestBodyValues
        }) => {
          if (response.body == null) {
            throw new APICallError({
              message: "SSE response body is empty",
              url,
              requestBodyValues,
              statusCode: response.status
            });
          }
          const eventStream = parseJsonEventStream({
            stream: response.body,
            schema: gatewayVideoEventSchema
          });
          const reader = eventStream.getReader();
          const { done, value: parseResult } = await reader.read();
          reader.releaseLock();
          if (done || !parseResult) {
            throw new APICallError({
              message: "SSE stream ended without a data event",
              url,
              requestBodyValues,
              statusCode: response.status
            });
          }
          if (!parseResult.success) {
            throw new APICallError({
              message: "Failed to parse video SSE event",
              cause: parseResult.error,
              url,
              requestBodyValues,
              statusCode: response.status
            });
          }
          const event = parseResult.value;
          if (event.type === "error") {
            throw new APICallError({
              message: event.message,
              statusCode: event.statusCode,
              url,
              requestBodyValues,
              responseHeaders: Object.fromEntries([...response.headers]),
              responseBody: JSON.stringify(event),
              data: {
                error: {
                  message: event.message,
                  type: event.errorType,
                  param: event.param
                }
              }
            });
          }
          return {
            value: {
              videos: event.videos,
              warnings: event.warnings,
              providerMetadata: event.providerMetadata
            },
            responseHeaders: Object.fromEntries([...response.headers])
          };
        }, "successfulResponseHandler"),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        ...abortSignal && { abortSignal },
        fetch: this.config.fetch
      });
      return {
        videos: responseBody.videos,
        warnings: (_a113 = responseBody.warnings) != null ? _a113 : [],
        providerMetadata: responseBody.providerMetadata,
        response: {
          timestamp: /* @__PURE__ */ new Date(),
          modelId: this.modelId,
          headers: responseHeaders
        }
      };
    } catch (error) {
      throw await asGatewayError(
        error,
        await parseAuthMethod(resolvedHeaders != null ? resolvedHeaders : {})
      );
    }
  }
  getUrl() {
    return `${this.config.baseURL}/video-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-video-model-specification-version": "4",
      "ai-model-id": this.modelId
    };
  }
};
function maybeEncodeVideoFile(file) {
  if (file.type === "file" && file.data instanceof Uint8Array) {
    return {
      ...file,
      data: convertUint8ArrayToBase64(file.data)
    };
  }
  return file;
}
__name(maybeEncodeVideoFile, "maybeEncodeVideoFile");
var providerMetadataEntrySchema2 = external_exports.object({
  videos: external_exports.array(external_exports.unknown()).optional()
}).catchall(external_exports.unknown());
var gatewayVideoDataSchema = external_exports.union([
  external_exports.object({
    type: external_exports.literal("url"),
    url: external_exports.string(),
    mediaType: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("base64"),
    data: external_exports.string(),
    mediaType: external_exports.string()
  })
]);
var gatewayVideoWarningSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("unsupported"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("compatibility"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("deprecated"),
    setting: external_exports.string(),
    message: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("other"),
    message: external_exports.string()
  })
]);
var gatewayVideoEventSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("result"),
    videos: external_exports.array(gatewayVideoDataSchema),
    warnings: external_exports.array(gatewayVideoWarningSchema).optional(),
    providerMetadata: external_exports.record(external_exports.string(), providerMetadataEntrySchema2).optional()
  }),
  external_exports.object({
    type: external_exports.literal("error"),
    message: external_exports.string(),
    errorType: external_exports.string(),
    statusCode: external_exports.number(),
    param: external_exports.unknown().nullable()
  })
]);
var GatewayRerankingModel = class {
  static {
    __name(this, "GatewayRerankingModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
  }
  get provider() {
    return this.config.provider;
  }
  async doRerank({
    documents,
    query,
    topN,
    headers,
    abortSignal,
    providerOptions
  }) {
    var _a113;
    const resolvedHeaders = this.config.headers ? await resolve(this.config.headers) : void 0;
    try {
      const {
        responseHeaders,
        value: responseBody,
        rawValue
      } = await postJsonToApi({
        url: this.getUrl(),
        headers: combineHeaders(
          resolvedHeaders,
          headers != null ? headers : {},
          this.getModelConfigHeaders(),
          await resolve(this.config.o11yHeaders)
        ),
        body: {
          documents,
          query,
          ...topN != null ? { topN } : {},
          ...providerOptions ? { providerOptions } : {}
        },
        successfulResponseHandler: createJsonResponseHandler(
          gatewayRerankingResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        ...abortSignal && { abortSignal },
        fetch: this.config.fetch
      });
      return {
        ranking: responseBody.ranking,
        providerMetadata: responseBody.providerMetadata,
        response: { headers: responseHeaders, body: rawValue },
        warnings: (_a113 = responseBody.warnings) != null ? _a113 : []
      };
    } catch (error) {
      throw await asGatewayError(
        error,
        await parseAuthMethod(resolvedHeaders != null ? resolvedHeaders : {})
      );
    }
  }
  getUrl() {
    return `${this.config.baseURL}/reranking-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-reranking-model-specification-version": "4",
      "ai-model-id": this.modelId
    };
  }
};
var gatewayRerankingWarningSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("unsupported"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("compatibility"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("deprecated"),
    setting: external_exports.string(),
    message: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("other"),
    message: external_exports.string()
  })
]);
var gatewayRerankingResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      ranking: external_exports.array(
        external_exports.object({
          index: external_exports.number(),
          relevanceScore: external_exports.number()
        })
      ),
      warnings: external_exports.array(gatewayRerankingWarningSchema).optional(),
      providerMetadata: external_exports.record(external_exports.string(), external_exports.record(external_exports.string(), external_exports.unknown())).optional()
    })
  )
);
var GatewaySpeechModel = class {
  static {
    __name(this, "GatewaySpeechModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    text: text2,
    voice,
    outputFormat,
    instructions,
    speed,
    language,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a113;
    const resolvedHeaders = this.config.headers ? await resolve(this.config.headers) : void 0;
    try {
      const {
        responseHeaders,
        value: responseBody,
        rawValue
      } = await postJsonToApi({
        url: this.getUrl(),
        headers: combineHeaders(
          resolvedHeaders,
          headers != null ? headers : {},
          this.getModelConfigHeaders(),
          await resolve(this.config.o11yHeaders)
        ),
        body: {
          text: text2,
          ...voice && { voice },
          ...outputFormat && { outputFormat },
          ...instructions && { instructions },
          ...speed != null && { speed },
          ...language && { language },
          ...providerOptions && { providerOptions }
        },
        successfulResponseHandler: createJsonResponseHandler(
          gatewaySpeechResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        ...abortSignal && { abortSignal },
        fetch: this.config.fetch
      });
      return {
        audio: responseBody.audio,
        warnings: (_a113 = responseBody.warnings) != null ? _a113 : [],
        providerMetadata: responseBody.providerMetadata,
        response: {
          timestamp: /* @__PURE__ */ new Date(),
          modelId: this.modelId,
          headers: responseHeaders,
          body: rawValue
        }
      };
    } catch (error) {
      throw await asGatewayError(
        error,
        await parseAuthMethod(resolvedHeaders != null ? resolvedHeaders : {})
      );
    }
  }
  getUrl() {
    return `${this.config.baseURL}/speech-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-speech-model-specification-version": "4",
      "ai-model-id": this.modelId
    };
  }
};
var providerMetadataEntrySchema3 = external_exports.object({}).catchall(external_exports.unknown());
var gatewaySpeechWarningSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("unsupported"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("compatibility"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("deprecated"),
    setting: external_exports.string(),
    message: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("other"),
    message: external_exports.string()
  })
]);
var gatewaySpeechResponseSchema = external_exports.object({
  audio: external_exports.string(),
  warnings: external_exports.array(gatewaySpeechWarningSchema).optional(),
  providerMetadata: external_exports.record(external_exports.string(), providerMetadataEntrySchema3).optional()
});
var GatewayTranscriptionModel = class {
  static {
    __name(this, "GatewayTranscriptionModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    audio,
    mediaType,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a113, _b112, _c, _d;
    const resolvedHeaders = this.config.headers ? await resolve(this.config.headers) : void 0;
    try {
      const {
        responseHeaders,
        value: responseBody,
        rawValue
      } = await postJsonToApi({
        url: this.getUrl(),
        headers: combineHeaders(
          resolvedHeaders,
          headers != null ? headers : {},
          this.getModelConfigHeaders(),
          await resolve(this.config.o11yHeaders)
        ),
        body: {
          audio: audio instanceof Uint8Array ? convertUint8ArrayToBase64(audio) : audio,
          mediaType,
          ...providerOptions && { providerOptions }
        },
        successfulResponseHandler: createJsonResponseHandler(
          gatewayTranscriptionResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        ...abortSignal && { abortSignal },
        fetch: this.config.fetch
      });
      return {
        text: responseBody.text,
        segments: (_a113 = responseBody.segments) != null ? _a113 : [],
        language: (_b112 = responseBody.language) != null ? _b112 : void 0,
        durationInSeconds: (_c = responseBody.durationInSeconds) != null ? _c : void 0,
        warnings: (_d = responseBody.warnings) != null ? _d : [],
        providerMetadata: responseBody.providerMetadata,
        response: {
          timestamp: /* @__PURE__ */ new Date(),
          modelId: this.modelId,
          headers: responseHeaders,
          body: rawValue
        }
      };
    } catch (error) {
      throw await asGatewayError(
        error,
        await parseAuthMethod(resolvedHeaders != null ? resolvedHeaders : {})
      );
    }
  }
  async doStream(options) {
    var _a113, _b112, _c, _d, _e;
    const currentDate = (_c = (_b112 = (_a113 = this.config._internal) == null ? void 0 : _a113.currentDate) == null ? void 0 : _b112.call(_a113)) != null ? _c : /* @__PURE__ */ new Date();
    const headers = combineHeaders(
      await resolve((_d = this.config.headers) != null ? _d : {}),
      (_e = options.headers) != null ? _e : {},
      this.getModelConfigHeaders(),
      await resolve(this.config.o11yHeaders)
    );
    const authMethod = await parseAuthMethod(headers);
    const startFrame = {
      type: TRANSCRIPTION_STREAM_START_FRAME_TYPE,
      inputAudioFormat: options.inputAudioFormat,
      ...options.providerOptions != null && {
        providerOptions: options.providerOptions
      },
      ...options.includeRawChunks != null && {
        includeRawChunks: options.includeRawChunks
      }
    };
    return {
      stream: createGatewayTranscriptionStream({
        webSocket: this.config.webSocket,
        url: toGatewayTranscriptionUrl(this.config.baseURL, this.modelId),
        protocols: getProtocolsFromHeaders(headers),
        headers,
        startFrame,
        audio: options.audio,
        abortSignal: options.abortSignal,
        authMethod
      }),
      request: { body: startFrame },
      response: { timestamp: currentDate, modelId: this.modelId }
    };
  }
  getUrl() {
    return `${this.config.baseURL}/transcription-model`;
  }
  getModelConfigHeaders() {
    return {
      "ai-transcription-model-specification-version": "4",
      "ai-model-id": this.modelId
    };
  }
};
function toGatewayTranscriptionUrl(baseURL, modelId) {
  const url = new URL(`${baseURL.replace(/^http/, "ws")}/transcription-model`);
  url.searchParams.set("ai-model-id", modelId);
  return url.toString();
}
__name(toGatewayTranscriptionUrl, "toGatewayTranscriptionUrl");
function getProtocolsFromHeaders(headers) {
  const normalizedHeaders = normalizeHeaders(headers);
  const authorization = normalizedHeaders.authorization;
  const token = (authorization == null ? void 0 : authorization.startsWith("Bearer ")) ? authorization.slice("Bearer ".length) : void 0;
  return token == null ? [GATEWAY_TRANSCRIPTION_SUBPROTOCOL] : getGatewayTranscriptionProtocols(token, {
    teamIdOrSlug: normalizedHeaders[VERCEL_AI_GATEWAY_TEAM_HEADER]
  });
}
__name(getProtocolsFromHeaders, "getProtocolsFromHeaders");
var MAX_AUDIO_FRAME_BYTES = 64 * 1024;
function createGatewayTranscriptionStream({
  webSocket,
  url,
  protocols,
  headers,
  startFrame,
  audio,
  abortSignal,
  authMethod
}) {
  let finished = false;
  let cleanup = /* @__PURE__ */ __name(() => {
  }, "cleanup");
  return new ReadableStream({
    start: /* @__PURE__ */ __name((controller) => {
      let audioReader;
      let hasServerErrorPart = false;
      let lastServerError;
      let audioStopped = false;
      let connection;
      cleanup = /* @__PURE__ */ __name((closeCode) => {
        if (audioReader != null) {
          void audioReader.cancel().catch(() => {
          });
        } else {
          void audio.cancel().catch(() => {
          });
        }
        connection == null ? void 0 : connection.close(closeCode);
      }, "cleanup");
      const stopAudio = /* @__PURE__ */ __name(() => {
        audioStopped = true;
        if (audioReader != null) {
          void audioReader.cancel().catch(() => {
          });
          audioReader = void 0;
        } else {
          void audio.cancel().catch(() => {
          });
        }
      }, "stopAudio");
      const finishWithError = /* @__PURE__ */ __name((error) => {
        if (finished) return;
        finished = true;
        cleanup();
        void errorControllerWithGatewayError(controller, error, authMethod);
      }, "finishWithError");
      const sendAudio = /* @__PURE__ */ __name(async (socket) => {
        const reader = audio.getReader();
        audioReader = reader;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done || finished) break;
            const bytes = typeof value === "string" ? convertBase64ToUint8Array(value) : value;
            for (let offset = 0; offset < bytes.length; offset += MAX_AUDIO_FRAME_BYTES) {
              if (finished) break;
              socket.send(
                bytes.subarray(offset, offset + MAX_AUDIO_FRAME_BYTES)
              );
              await waitForWebSocketBufferDrain(socket);
            }
          }
        } finally {
          reader.releaseLock();
          if (audioReader === reader) {
            audioReader = void 0;
          }
        }
        if (!finished && !audioStopped) {
          socket.send(
            JSON.stringify({
              type: TRANSCRIPTION_STREAM_AUDIO_DONE_FRAME_TYPE
            })
          );
        }
      }, "sendAudio");
      connection = connectToWebSocket({
        url,
        protocols,
        headers,
        webSocket,
        abortSignal,
        onAbort: /* @__PURE__ */ __name((reason) => {
          if (finished) return;
          finished = true;
          cleanup();
          controller.error(reason);
        }, "onAbort"),
        onProcessingError: finishWithError,
        onOpen: /* @__PURE__ */ __name((socket) => {
          socket.send(JSON.stringify(startFrame));
          void sendAudio(socket).catch(finishWithError);
        }, "onOpen"),
        // Server frames are envelope-serialized stream parts; the codec
        // handles parsing, unknown-part skipping, and timestamp revival.
        onMessageText: /* @__PURE__ */ __name((text2) => {
          if (finished) return;
          const part = parseTranscriptionStreamPart(text2);
          if (part == null) return;
          if (part.type === "finish") {
            finished = true;
            controller.enqueue(part);
            controller.close();
            cleanup(1e3);
            return;
          }
          if (part.type === "error") {
            hasServerErrorPart = true;
            lastServerError = part.error;
            stopAudio();
          }
          controller.enqueue(part);
        }, "onMessageText"),
        onSocketError: /* @__PURE__ */ __name(() => {
          finishWithError(
            new Error("Connection error on AI Gateway transcription stream")
          );
        }, "onSocketError"),
        onClose: /* @__PURE__ */ __name(() => {
          if (hasServerErrorPart) {
            if (finished) return;
            void createErrorFromServerErrorPart(
              lastServerError,
              authMethod
            ).then(finishWithError);
            return;
          }
          finishWithError(
            new Error(
              "AI Gateway transcription stream closed before a finish part was received"
            )
          );
        }, "onClose")
      });
    }, "start"),
    cancel: /* @__PURE__ */ __name(() => {
      if (finished) return;
      finished = true;
      cleanup();
    }, "cancel")
  });
}
__name(createGatewayTranscriptionStream, "createGatewayTranscriptionStream");
var providerMetadataEntrySchema4 = external_exports.object({}).catchall(external_exports.unknown());
var gatewayTranscriptionWarningSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("unsupported"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("compatibility"),
    feature: external_exports.string(),
    details: external_exports.string().optional()
  }),
  external_exports.object({
    type: external_exports.literal("deprecated"),
    setting: external_exports.string(),
    message: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("other"),
    message: external_exports.string()
  })
]);
var gatewayTranscriptionResponseSchema = external_exports.object({
  text: external_exports.string(),
  segments: external_exports.array(
    external_exports.object({
      text: external_exports.string(),
      startSecond: external_exports.number(),
      endSecond: external_exports.number()
    })
  ).optional(),
  language: external_exports.string().nullish(),
  durationInSeconds: external_exports.number().nullish(),
  warnings: external_exports.array(gatewayTranscriptionWarningSchema).optional(),
  providerMetadata: external_exports.record(external_exports.string(), providerMetadataEntrySchema4).optional()
});
async function errorControllerWithGatewayError(controller, error, authMethod) {
  controller.error(await asGatewayError(error, authMethod));
}
__name(errorControllerWithGatewayError, "errorControllerWithGatewayError");
function getServerErrorMessage(error) {
  if (error != null && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return getErrorMessage(error);
}
__name(getServerErrorMessage, "getServerErrorMessage");
var SERVER_ERROR_STATUS_CODES = {
  authentication_error: 401,
  failed_dependency: 424,
  forbidden: 403,
  internal_server_error: 500,
  invalid_request_error: 400,
  model_not_found: 404,
  rate_limit_exceeded: 429
};
async function createErrorFromServerErrorPart(error, authMethod) {
  if (typeof error === "object" && error != null && "message" in error && typeof error.message === "string" && "type" in error && typeof error.type === "string" && error.type in SERVER_ERROR_STATUS_CODES) {
    return createGatewayErrorFromResponse({
      response: { error: { message: error.message, type: error.type } },
      statusCode: SERVER_ERROR_STATUS_CODES[error.type],
      authMethod
    });
  }
  return new Error(
    `AI Gateway transcription stream failed: ${getServerErrorMessage(error)}`
  );
}
__name(createErrorFromServerErrorPart, "createErrorFromServerErrorPart");
var GatewayRealtimeModel = class {
  static {
    __name(this, "GatewayRealtimeModel");
  }
  constructor(modelId, config) {
    this.specificationVersion = "v4";
    this.modelId = modelId;
    this.provider = config.provider;
    this.config = config;
  }
  /**
   * Mints a single-use, short-lived client secret (`vcst_`) the browser uses to
   * open the realtime WebSocket without ever holding the long-lived Gateway
   * credential. The customer's server calls this (via
   * `gateway.experimental_realtime.getToken`) and hands the returned token to
   * the browser, which connects with it through the `ai-gateway-auth.<token>`
   * subprotocol. `expiresAfterSeconds` is forwarded to the mint endpoint;
   * `sessionConfig` is intentionally unused here — it is applied later via the
   * normalized `session-update` event.
   */
  async doCreateClientSecret(options) {
    const secret = await this.config.createClientSecret({
      modelId: this.modelId,
      ...(options == null ? void 0 : options.expiresAfterSeconds) != null && {
        expiresAfterSeconds: options.expiresAfterSeconds
      }
    });
    return {
      token: secret.token,
      url: toGatewayRealtimeUrl(this.config.baseURL, this.modelId),
      ...secret.expiresAt != null && { expiresAt: secret.expiresAt }
    };
  }
  getWebSocketConfig(options) {
    return {
      url: options.url,
      protocols: getGatewayRealtimeProtocols(options.token, {
        teamIdOrSlug: this.config.teamIdOrSlug
      })
    };
  }
  parseServerEvent(raw) {
    return raw;
  }
  serializeClientEvent(event) {
    return event;
  }
  buildSessionConfig(config) {
    return config;
  }
};
function toGatewayRealtimeUrl(baseURL, modelId) {
  const url = new URL(`${baseURL.replace(/^http/, "ws")}/realtime-model`);
  url.searchParams.set("ai-model-id", modelId);
  return url.toString();
}
__name(toGatewayRealtimeUrl, "toGatewayRealtimeUrl");
var exaSearchInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      query: external_exports.string().describe("Natural-language web search query. This is required."),
      type: external_exports.enum(["auto", "fast", "instant"]).optional().describe(
        "Search method. Use auto for the default balance of speed and quality."
      ),
      num_results: external_exports.number().optional().describe("Maximum number of results to return (1-100, default: 10)."),
      category: external_exports.enum([
        "company",
        "people",
        "research paper",
        "news",
        "personal site",
        "financial report"
      ]).optional().describe("Optional content category to focus results."),
      user_location: external_exports.string().optional().describe("Two-letter ISO country code such as 'US'."),
      include_domains: external_exports.array(external_exports.string()).optional().describe("Only return results from these domains."),
      exclude_domains: external_exports.array(external_exports.string()).optional().describe("Exclude results from these domains."),
      start_published_date: external_exports.string().optional().describe("Only return links published after this ISO 8601 date."),
      end_published_date: external_exports.string().optional().describe("Only return links published before this ISO 8601 date."),
      contents: external_exports.object({
        text: external_exports.union([
          external_exports.boolean(),
          external_exports.object({
            max_characters: external_exports.number().optional(),
            include_html_tags: external_exports.boolean().optional(),
            verbosity: external_exports.enum(["compact", "standard", "full"]).optional(),
            include_sections: external_exports.array(
              external_exports.enum([
                "header",
                "navigation",
                "banner",
                "body",
                "sidebar",
                "footer",
                "metadata"
              ])
            ).optional(),
            exclude_sections: external_exports.array(
              external_exports.enum([
                "header",
                "navigation",
                "banner",
                "body",
                "sidebar",
                "footer",
                "metadata"
              ])
            ).optional()
          })
        ]).optional(),
        highlights: external_exports.union([
          external_exports.boolean(),
          external_exports.object({
            query: external_exports.string().optional(),
            max_characters: external_exports.number().optional()
          })
        ]).optional(),
        max_age_hours: external_exports.number().optional(),
        livecrawl_timeout: external_exports.number().optional(),
        subpages: external_exports.number().optional(),
        subpage_target: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
        extras: external_exports.object({
          links: external_exports.number().optional(),
          image_links: external_exports.number().optional()
        }).optional()
      }).optional().describe("Controls extracted page content and freshness.")
    })
  )
);
var exaSearchOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.union([
      external_exports.object({
        requestId: external_exports.string(),
        searchType: external_exports.string().optional(),
        resolvedSearchType: external_exports.string().optional(),
        results: external_exports.array(
          external_exports.object({
            title: external_exports.string(),
            url: external_exports.string(),
            id: external_exports.string(),
            publishedDate: external_exports.string().nullable().optional(),
            author: external_exports.string().nullable().optional(),
            image: external_exports.string().nullable().optional(),
            favicon: external_exports.string().nullable().optional(),
            text: external_exports.string().optional(),
            highlights: external_exports.array(external_exports.string()).optional(),
            highlightScores: external_exports.array(external_exports.number()).optional(),
            summary: external_exports.string().optional(),
            subpages: external_exports.array(external_exports.any()).optional(),
            extras: external_exports.object({
              links: external_exports.array(external_exports.string()).optional(),
              imageLinks: external_exports.array(external_exports.string()).optional()
            }).optional()
          })
        ),
        costDollars: external_exports.object({
          total: external_exports.number().optional(),
          search: external_exports.record(external_exports.string(), external_exports.number()).optional()
        }).optional()
      }),
      external_exports.object({
        error: external_exports.enum([
          "api_error",
          "rate_limit",
          "timeout",
          "invalid_input",
          "configuration_error",
          "execution_error",
          "unknown"
        ]),
        statusCode: external_exports.number().optional(),
        message: external_exports.string()
      })
    ])
  )
);
var exaSearchToolFactory = createProviderExecutedToolFactory({
  id: "gateway.exa_search",
  inputSchema: exaSearchInputSchema,
  outputSchema: exaSearchOutputSchema
});
var exaSearch = /* @__PURE__ */ __name((config = {}) => exaSearchToolFactory(config), "exaSearch");
var parallelSearchInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      objective: external_exports.string().describe(
        "Natural-language description of the web research goal, including source or freshness guidance and broader context from the task. Maximum 5000 characters."
      ),
      search_queries: external_exports.array(external_exports.string()).optional().describe(
        "Optional search queries to supplement the objective. Maximum 200 characters per query."
      ),
      mode: external_exports.enum(["one-shot", "agentic"]).optional().describe(
        'Mode preset: "one-shot" for comprehensive results with longer excerpts (default), "agentic" for concise, token-efficient results for multi-step workflows.'
      ),
      max_results: external_exports.number().optional().describe(
        "Maximum number of results to return (1-20). Defaults to 10 if not specified."
      ),
      source_policy: external_exports.object({
        include_domains: external_exports.array(external_exports.string()).optional().describe(
          "Limit results to these domains. Use plain domain names only — e.g. example.com or sub.example.gov, or a bare extension like .edu. Do not include a scheme, path, or port (e.g. not https://example.com/page)."
        ),
        exclude_domains: external_exports.array(external_exports.string()).optional().describe(
          "Exclude results from these domains. Use plain domain names only — e.g. example.com or sub.example.gov, or a bare extension like .edu. Do not include a scheme, path, or port (e.g. not https://example.com/page)."
        ),
        after_date: external_exports.string().optional().describe(
          "Only include results published after this date. Use an ISO 8601 calendar date formatted YYYY-MM-DD (e.g. 2025-01-01); do not include a time."
        )
      }).optional().describe(
        "Source policy for controlling which domains to include/exclude and freshness."
      ),
      excerpts: external_exports.object({
        max_chars_per_result: external_exports.number().optional().describe("Maximum characters per result."),
        max_chars_total: external_exports.number().optional().describe("Maximum total characters across all results.")
      }).optional().describe("Excerpt configuration for controlling result length."),
      fetch_policy: external_exports.object({
        max_age_seconds: external_exports.number().optional().describe(
          "Maximum age in seconds for cached content. Set to 0 to always fetch fresh content."
        )
      }).optional().describe("Fetch policy for controlling content freshness.")
    })
  )
);
var parallelSearchOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.union([
      // Success response
      external_exports.object({
        searchId: external_exports.string(),
        results: external_exports.array(
          external_exports.object({
            url: external_exports.string(),
            title: external_exports.string(),
            excerpt: external_exports.string(),
            publishDate: external_exports.string().nullable().optional(),
            relevanceScore: external_exports.number().optional()
          })
        )
      }),
      // Error response
      external_exports.object({
        error: external_exports.enum([
          "api_error",
          "rate_limit",
          "timeout",
          "invalid_input",
          "configuration_error",
          "unknown"
        ]),
        statusCode: external_exports.number().optional(),
        message: external_exports.string()
      })
    ])
  )
);
var parallelSearchToolFactory = createProviderExecutedToolFactory({
  id: "gateway.parallel_search",
  inputSchema: parallelSearchInputSchema,
  outputSchema: parallelSearchOutputSchema
});
var parallelSearch = /* @__PURE__ */ __name((config = {}) => parallelSearchToolFactory(config), "parallelSearch");
var perplexitySearchInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      query: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).describe(
        "Search query (string) or multiple queries (array of up to 5 strings). Multi-query searches return combined results from all queries."
      ),
      max_results: external_exports.number().optional().describe(
        "Maximum number of search results to return (1-20, default: 10)"
      ),
      max_tokens_per_page: external_exports.number().optional().describe(
        "Maximum number of tokens to extract per search result page (256-2048, default: 2048)"
      ),
      max_tokens: external_exports.number().optional().describe(
        "Maximum total tokens across all search results (default: 25000, max: 1000000)"
      ),
      country: external_exports.string().optional().describe(
        "Two-letter ISO 3166-1 alpha-2 country code for regional search results (e.g., 'US', 'GB', 'FR')"
      ),
      search_domain_filter: external_exports.array(external_exports.string()).optional().describe(
        "List of domains to include or exclude from search results (max 20). To include: ['nature.com', 'science.org']. To exclude: ['-example.com', '-spam.net']"
      ),
      search_language_filter: external_exports.array(external_exports.string()).optional().describe(
        "List of ISO 639-1 language codes to filter results (max 10, lowercase). Examples: ['en', 'fr', 'de']"
      ),
      search_after_date: external_exports.string().optional().describe(
        "Include only results published after this date. Format: 'MM/DD/YYYY' (e.g., '3/1/2025'). Cannot be used with search_recency_filter."
      ),
      search_before_date: external_exports.string().optional().describe(
        "Include only results published before this date. Format: 'MM/DD/YYYY' (e.g., '3/15/2025'). Cannot be used with search_recency_filter."
      ),
      last_updated_after_filter: external_exports.string().optional().describe(
        "Include only results last updated after this date. Format: 'MM/DD/YYYY' (e.g., '3/1/2025'). Cannot be used with search_recency_filter."
      ),
      last_updated_before_filter: external_exports.string().optional().describe(
        "Include only results last updated before this date. Format: 'MM/DD/YYYY' (e.g., '3/15/2025'). Cannot be used with search_recency_filter."
      ),
      search_recency_filter: external_exports.enum(["day", "week", "month", "year"]).optional().describe(
        "Filter results by relative time period. Cannot be used with search_after_date or search_before_date."
      )
    })
  )
);
var perplexitySearchOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.union([
      // Success response
      external_exports.object({
        results: external_exports.array(
          external_exports.object({
            title: external_exports.string(),
            url: external_exports.string(),
            snippet: external_exports.string(),
            date: external_exports.string().optional(),
            lastUpdated: external_exports.string().optional()
          })
        ),
        id: external_exports.string()
      }),
      // Error response
      external_exports.object({
        error: external_exports.enum([
          "api_error",
          "rate_limit",
          "timeout",
          "invalid_input",
          "unknown"
        ]),
        statusCode: external_exports.number().optional(),
        message: external_exports.string()
      })
    ])
  )
);
var perplexitySearchToolFactory = createProviderExecutedToolFactory({
  id: "gateway.perplexity_search",
  inputSchema: perplexitySearchInputSchema,
  outputSchema: perplexitySearchOutputSchema
});
var perplexitySearch = /* @__PURE__ */ __name((config = {}) => perplexitySearchToolFactory(config), "perplexitySearch");
var gatewayTools = {
  /**
   * Search the web using Exa for current information and token-efficient
   * excerpts optimized for agent workflows.
   *
   * Supports search type, category, domain, date, location, and content
   * extraction controls.
   */
  exaSearch,
  /**
   * Search the web using Parallel AI's Search API for LLM-optimized excerpts.
   *
   * Takes a natural language objective and returns relevant excerpts,
   * replacing multiple keyword searches with a single call for broad
   * or complex queries. Supports different search types for depth vs
   * breadth tradeoffs.
   */
  parallelSearch,
  /**
   * Search the web using Perplexity's Search API for real-time information,
   * news, research papers, and articles.
   *
   * Provides ranked search results with advanced filtering options including
   * domain, language, date range, and recency filters.
   */
  perplexitySearch
};
async function getVercelRequestId() {
  var _a113;
  return (_a113 = (0, import_oidc.getContext)().headers) == null ? void 0 : _a113["x-vercel-id"];
}
__name(getVercelRequestId, "getVercelRequestId");
var VERSION2 = true ? "4.0.23" : "0.0.0-test";
var AI_GATEWAY_PROTOCOL_VERSION = "0.0.1";
var gatewayClientSecretResponseSchema = external_exports.object({
  token: external_exports.string(),
  expiresAt: external_exports.number().nullish()
});
function createGateway(options = {}) {
  var _a113, _b112;
  let pendingMetadata = null;
  let metadataCache = null;
  const cacheRefreshMillis = (_a113 = options.metadataCacheRefreshMillis) != null ? _a113 : 1e3 * 60 * 5;
  let lastFetchTime = 0;
  const baseURL = (_b112 = withoutTrailingSlash(options.baseURL)) != null ? _b112 : "https://ai-gateway.vercel.sh/v4/ai";
  const createAuthHeaders = /* @__PURE__ */ __name((auth) => withUserAgentSuffix(
    {
      Authorization: `Bearer ${auth.token}`,
      "ai-gateway-protocol-version": AI_GATEWAY_PROTOCOL_VERSION,
      [GATEWAY_AUTH_METHOD_HEADER]: auth.authMethod,
      ...options.teamIdOrSlug != null ? { [VERCEL_AI_GATEWAY_TEAM_HEADER]: options.teamIdOrSlug } : {},
      ...options.headers
    },
    `ai-sdk/gateway/${VERSION2}`
  ), "createAuthHeaders");
  const getHeaders = /* @__PURE__ */ __name(async () => {
    try {
      return createAuthHeaders(await getGatewayAuthToken(options));
    } catch (error) {
      throw GatewayAuthenticationError.createContextualError({
        apiKeyProvided: false,
        oidcTokenProvided: false,
        statusCode: 401,
        cause: error
      });
    }
  }, "getHeaders");
  const getRealtimeAuthToken = /* @__PURE__ */ __name(async () => {
    try {
      return await getGatewayAuthToken(options);
    } catch (error) {
      throw GatewayAuthenticationError.createContextualError({
        apiKeyProvided: false,
        oidcTokenProvided: false,
        statusCode: 401,
        cause: error
      });
    }
  }, "getRealtimeAuthToken");
  const mintClientSecret = /* @__PURE__ */ __name(async (params) => {
    assertGatewayClientSecretServerEnvironment();
    const auth = await getRealtimeAuthToken();
    const headers = createAuthHeaders(auth);
    const url = new URL("/v1/realtime/client-secrets", baseURL).toString();
    try {
      const { value } = await postJsonToApi({
        url,
        headers,
        body: {
          model: params.modelId,
          ...params.routeKind != null && { routeKind: params.routeKind },
          ...params.expiresAfterSeconds != null && {
            expiresIn: params.expiresAfterSeconds
          }
        },
        successfulResponseHandler: createJsonResponseHandler(
          gatewayClientSecretResponseSchema
        ),
        failedResponseHandler: createJsonErrorResponseHandler({
          errorSchema: external_exports.any(),
          errorToMessage: /* @__PURE__ */ __name((data) => data, "errorToMessage")
        }),
        fetch: options.fetch
      });
      return {
        token: value.token,
        ...value.expiresAt != null && { expiresAt: value.expiresAt }
      };
    } catch (error) {
      throw await asGatewayError(error, await parseAuthMethod(headers));
    }
  }, "mintClientSecret");
  const createO11yHeaders = /* @__PURE__ */ __name(() => {
    const deploymentId = loadOptionalSetting({
      settingValue: void 0,
      environmentVariableName: "VERCEL_DEPLOYMENT_ID"
    });
    const environment = loadOptionalSetting({
      settingValue: void 0,
      environmentVariableName: "VERCEL_ENV"
    });
    const region = loadOptionalSetting({
      settingValue: void 0,
      environmentVariableName: "VERCEL_REGION"
    });
    const projectId = loadOptionalSetting({
      settingValue: void 0,
      environmentVariableName: "VERCEL_PROJECT_ID"
    });
    return async () => {
      const requestId = await getVercelRequestId();
      return {
        ...deploymentId && { "ai-o11y-deployment-id": deploymentId },
        ...environment && { "ai-o11y-environment": environment },
        ...region && { "ai-o11y-region": region },
        ...requestId && { "ai-o11y-request-id": requestId },
        ...projectId && { "ai-o11y-project-id": projectId }
      };
    };
  }, "createO11yHeaders");
  const createLanguageModel = /* @__PURE__ */ __name((modelId) => {
    return new GatewayLanguageModel(modelId, {
      provider: "gateway",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      o11yHeaders: createO11yHeaders()
    });
  }, "createLanguageModel");
  const getAvailableModels = /* @__PURE__ */ __name(async () => {
    var _a123, _b122, _c;
    const now2 = (_c = (_b122 = (_a123 = options._internal) == null ? void 0 : _a123.currentDate) == null ? void 0 : _b122.call(_a123).getTime()) != null ? _c : Date.now();
    if (!pendingMetadata || now2 - lastFetchTime > cacheRefreshMillis) {
      lastFetchTime = now2;
      pendingMetadata = new GatewayFetchMetadata({
        baseURL,
        headers: getHeaders,
        fetch: options.fetch
      }).getAvailableModels().then((metadata) => {
        metadataCache = metadata;
        return metadata;
      }).catch(async (error) => {
        throw await asGatewayError(
          error,
          await parseAuthMethod(await getHeaders())
        );
      });
    }
    return metadataCache ? Promise.resolve(metadataCache) : pendingMetadata;
  }, "getAvailableModels");
  const getCredits = /* @__PURE__ */ __name(async () => {
    return new GatewayFetchMetadata({
      baseURL,
      headers: getHeaders,
      fetch: options.fetch
    }).getCredits().catch(async (error) => {
      throw await asGatewayError(
        error,
        await parseAuthMethod(await getHeaders())
      );
    });
  }, "getCredits");
  const getSpendReport = /* @__PURE__ */ __name(async (params) => {
    return new GatewaySpendReport({
      baseURL,
      headers: getHeaders,
      fetch: options.fetch
    }).getSpendReport(params).catch(async (error) => {
      throw await asGatewayError(
        error,
        await parseAuthMethod(await getHeaders())
      );
    });
  }, "getSpendReport");
  const getGenerationInfo = /* @__PURE__ */ __name(async (params) => {
    return new GatewayGenerationInfoFetcher({
      baseURL,
      headers: getHeaders,
      fetch: options.fetch
    }).getGenerationInfo(params).catch(async (error) => {
      throw await asGatewayError(
        error,
        await parseAuthMethod(await getHeaders())
      );
    });
  }, "getGenerationInfo");
  const provider = /* @__PURE__ */ __name(function(modelId) {
    if (new.target) {
      throw new Error(
        "The Gateway Provider model function cannot be called with the new keyword."
      );
    }
    return createLanguageModel(modelId);
  }, "provider");
  provider.specificationVersion = "v4";
  provider.getAvailableModels = getAvailableModels;
  provider.getCredits = getCredits;
  provider.getSpendReport = getSpendReport;
  provider.getGenerationInfo = getGenerationInfo;
  provider.imageModel = (modelId) => {
    return new GatewayImageModel(modelId, {
      provider: "gateway",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      o11yHeaders: createO11yHeaders()
    });
  };
  provider.languageModel = createLanguageModel;
  const createEmbeddingModel = /* @__PURE__ */ __name((modelId) => {
    return new GatewayEmbeddingModel(modelId, {
      provider: "gateway",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      o11yHeaders: createO11yHeaders()
    });
  }, "createEmbeddingModel");
  provider.embeddingModel = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.videoModel = (modelId) => {
    return new GatewayVideoModel(modelId, {
      provider: "gateway",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      o11yHeaders: createO11yHeaders()
    });
  };
  const createRerankingModel = /* @__PURE__ */ __name((modelId) => {
    return new GatewayRerankingModel(modelId, {
      provider: "gateway",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      o11yHeaders: createO11yHeaders()
    });
  }, "createRerankingModel");
  provider.rerankingModel = createRerankingModel;
  provider.reranking = createRerankingModel;
  const createSpeechModel = /* @__PURE__ */ __name((modelId) => {
    return new GatewaySpeechModel(modelId, {
      provider: "gateway",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      o11yHeaders: createO11yHeaders()
    });
  }, "createSpeechModel");
  provider.speechModel = createSpeechModel;
  provider.speech = createSpeechModel;
  const createTranscriptionModel = /* @__PURE__ */ __name((modelId) => {
    return new GatewayTranscriptionModel(modelId, {
      provider: "gateway",
      baseURL,
      headers: getHeaders,
      fetch: options.fetch,
      o11yHeaders: createO11yHeaders(),
      webSocket: options.webSocket
    });
  }, "createTranscriptionModel");
  provider.transcriptionModel = createTranscriptionModel;
  provider.transcription = createTranscriptionModel;
  provider.experimental_transcription = Object.assign(
    (modelId) => createTranscriptionModel(modelId),
    {
      getToken: /* @__PURE__ */ __name(async (tokenOptions) => {
        const secret = await mintClientSecret({
          modelId: tokenOptions.model,
          routeKind: "transcription",
          ...tokenOptions.expiresAfterSeconds != null && {
            expiresAfterSeconds: tokenOptions.expiresAfterSeconds
          }
        });
        return {
          token: secret.token,
          url: toGatewayTranscriptionUrl(baseURL, tokenOptions.model),
          ...secret.expiresAt != null && { expiresAt: secret.expiresAt }
        };
      }, "getToken")
    }
  );
  const createRealtimeModel = /* @__PURE__ */ __name((modelId) => new GatewayRealtimeModel(modelId, {
    provider: "gateway.realtime",
    baseURL,
    teamIdOrSlug: options.teamIdOrSlug,
    createClientSecret: mintClientSecret
  }), "createRealtimeModel");
  provider.experimental_realtime = Object.assign(
    (modelId) => createRealtimeModel(modelId),
    {
      getToken: /* @__PURE__ */ __name(async (tokenOptions) => {
        const { model: modelId, ...secretOptions } = tokenOptions;
        const model = createRealtimeModel(modelId);
        const secret = await model.doCreateClientSecret(secretOptions);
        return {
          token: secret.token,
          url: secret.url,
          ...secret.expiresAt != null && { expiresAt: secret.expiresAt }
        };
      }, "getToken")
    }
  );
  provider.chat = provider.languageModel;
  provider.embedding = provider.embeddingModel;
  provider.image = provider.imageModel;
  provider.video = provider.videoModel;
  provider.tools = gatewayTools;
  return provider;
}
__name(createGateway, "createGateway");
var gateway = createGateway();
async function getGatewayAuthToken(options) {
  const apiKey = loadOptionalSetting({
    settingValue: options.apiKey,
    environmentVariableName: "AI_GATEWAY_API_KEY"
  });
  if (apiKey) {
    return {
      token: apiKey,
      authMethod: "api-key"
    };
  }
  const oidcToken = await (0, import_oidc2.getVercelOidcToken)();
  return {
    token: oidcToken,
    authMethod: "oidc"
  };
}
__name(getGatewayAuthToken, "getGatewayAuthToken");
function assertGatewayClientSecretServerEnvironment() {
  if (typeof globalThis.window !== "undefined") {
    throw new Error(
      "AI Gateway client secrets must be minted server-side: minting needs your Gateway credential, which must never reach the browser. Call gateway.experimental_realtime.getToken() or gateway.experimental_transcription.getToken() from your server and pass the returned token to the client."
    );
  }
}
__name(assertGatewayClientSecretServerEnvironment, "assertGatewayClientSecretServerEnvironment");

// node_modules/.pnpm/ai@7.0.31_zod@3.25.76/node_modules/ai/dist/index.js
var __defProp = Object.defineProperty;
var __export = /* @__PURE__ */ __name((target, all) => {
  for (var name222 in all)
    __defProp(target, name222, { get: all[name222], enumerable: true });
}, "__export");
var name17 = "AI_InvalidArgumentError";
var marker18 = `vercel.ai.error.${name17}`;
var symbol18 = Symbol.for(marker18);
var _a18;
var InvalidArgumentError2 = class extends AISDKError {
  static {
    __name(this, "InvalidArgumentError");
  }
  constructor({
    parameter,
    value,
    message
  }) {
    super({
      name: name17,
      message: `Invalid argument for parameter ${parameter}: ${message}`
    });
    this[_a18] = true;
    this.parameter = parameter;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker18);
  }
};
_a18 = symbol18;
var name23 = "AI_InvalidStreamPartError";
var marker23 = `vercel.ai.error.${name23}`;
var symbol23 = Symbol.for(marker23);
var _a23;
_a23 = symbol23;
var name33 = "AI_InvalidToolApprovalError";
var marker33 = `vercel.ai.error.${name33}`;
var symbol33 = Symbol.for(marker33);
var _a33;
_a33 = symbol33;
var name43 = "AI_InvalidToolApprovalSignatureError";
var marker43 = `vercel.ai.error.${name43}`;
var symbol43 = Symbol.for(marker43);
var _a43;
_a43 = symbol43;
var name53 = "AI_InvalidToolInputError";
var marker53 = `vercel.ai.error.${name53}`;
var symbol53 = Symbol.for(marker53);
var _a53;
_a53 = symbol53;
var name63 = "AI_ToolCallNotFoundForApprovalError";
var marker63 = `vercel.ai.error.${name63}`;
var symbol63 = Symbol.for(marker63);
var _a63;
_a63 = symbol63;
var name73 = "AI_MissingToolResultsError";
var marker73 = `vercel.ai.error.${name73}`;
var symbol73 = Symbol.for(marker73);
var _a73;
var MissingToolResultsError = class extends AISDKError {
  static {
    __name(this, "MissingToolResultsError");
  }
  constructor({ toolCallIds }) {
    super({
      name: name73,
      message: `Tool result${toolCallIds.length > 1 ? "s are" : " is"} missing for tool call${toolCallIds.length > 1 ? "s" : ""} ${toolCallIds.join(
        ", "
      )}.`
    });
    this[_a73] = true;
    this.toolCallIds = toolCallIds;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker73);
  }
};
_a73 = symbol73;
var name83 = "AI_NoImageGeneratedError";
var marker83 = `vercel.ai.error.${name83}`;
var symbol83 = Symbol.for(marker83);
var _a83;
_a83 = symbol83;
var name93 = "AI_NoObjectGeneratedError";
var marker93 = `vercel.ai.error.${name93}`;
var symbol93 = Symbol.for(marker93);
var _a93;
var NoObjectGeneratedError = class extends AISDKError {
  static {
    __name(this, "NoObjectGeneratedError");
  }
  constructor({
    message = "No object generated.",
    cause,
    text: text2,
    response,
    usage,
    finishReason
  }) {
    super({ name: name93, message, cause });
    this[_a93] = true;
    this.text = text2;
    this.response = response;
    this.usage = usage;
    this.finishReason = finishReason;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker93);
  }
};
_a93 = symbol93;
var name102 = "AI_NoOutputGeneratedError";
var marker103 = `vercel.ai.error.${name102}`;
var symbol103 = Symbol.for(marker103);
var _a103;
_a103 = symbol103;
var name112 = "AI_NoSpeechGeneratedError";
var marker112 = `vercel.ai.error.${name112}`;
var symbol112 = Symbol.for(marker112);
var _a112;
_a112 = symbol112;
var name122 = "AI_NoTranscriptGeneratedError";
var marker122 = `vercel.ai.error.${name122}`;
var symbol122 = Symbol.for(marker122);
var _a122;
_a122 = symbol122;
var name132 = "AI_NoVideoGeneratedError";
var marker132 = `vercel.ai.error.${name132}`;
var symbol132 = Symbol.for(marker132);
var _a132;
_a132 = symbol132;
var name142 = "AI_NoSuchToolError";
var marker142 = `vercel.ai.error.${name142}`;
var symbol142 = Symbol.for(marker142);
var _a142;
_a142 = symbol142;
var name152 = "AI_ToolCallRepairError";
var marker152 = `vercel.ai.error.${name152}`;
var symbol152 = Symbol.for(marker152);
var _a152;
_a152 = symbol152;
var UnsupportedModelVersionError = class extends AISDKError {
  static {
    __name(this, "UnsupportedModelVersionError");
  }
  constructor(options) {
    super({
      name: "AI_UnsupportedModelVersionError",
      message: `Unsupported model version ${options.version} for provider "${options.provider}" and model "${options.modelId}". AI SDK 5 only supports models that implement specification version "v2".`
    });
    this.version = options.version;
    this.provider = options.provider;
    this.modelId = options.modelId;
  }
};
var name162 = "AI_UIMessageStreamError";
var marker162 = `vercel.ai.error.${name162}`;
var symbol162 = Symbol.for(marker162);
var _a162;
_a162 = symbol162;
var name172 = "AI_InvalidDataContentError";
var marker172 = `vercel.ai.error.${name172}`;
var symbol172 = Symbol.for(marker172);
var _a172;
var InvalidDataContentError = class extends AISDKError {
  static {
    __name(this, "InvalidDataContentError");
  }
  constructor({
    content,
    cause,
    message = `Invalid data content. Expected a base64 string, Uint8Array, ArrayBuffer, or Buffer, but got ${typeof content}.`
  }) {
    super({ name: name172, message, cause });
    this[_a172] = true;
    this.content = content;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker172);
  }
};
_a172 = symbol172;
var name18 = "AI_InvalidMessageRoleError";
var marker182 = `vercel.ai.error.${name18}`;
var symbol182 = Symbol.for(marker182);
var _a182;
var InvalidMessageRoleError = class extends AISDKError {
  static {
    __name(this, "InvalidMessageRoleError");
  }
  constructor({
    role,
    message = `Invalid message role: '${role}'. Must be one of: "system", "user", "assistant", "tool".`
  }) {
    super({ name: name18, message });
    this[_a182] = true;
    this.role = role;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker182);
  }
};
_a182 = symbol182;
var name19 = "AI_MessageConversionError";
var marker19 = `vercel.ai.error.${name19}`;
var symbol19 = Symbol.for(marker19);
var _a19;
_a19 = symbol19;
var name20 = "AI_RetryError";
var marker20 = `vercel.ai.error.${name20}`;
var symbol20 = Symbol.for(marker20);
var _a20;
var RetryError = class extends AISDKError {
  static {
    __name(this, "RetryError");
  }
  constructor({
    message,
    reason,
    errors
  }) {
    super({ name: name20, message });
    this[_a20] = true;
    this.reason = reason;
    this.errors = errors;
    this.lastError = errors[errors.length - 1];
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker20);
  }
};
_a20 = symbol20;
function formatWarning({
  warning,
  provider,
  model
}) {
  const scope = provider != null && model != null ? ` (${provider} / ${model})` : "";
  const prefix = `AI SDK Warning${scope}:`;
  switch (warning.type) {
    case "unsupported": {
      let message = `${prefix} The feature "${warning.feature}" is not supported.`;
      if (warning.details) {
        message += ` ${warning.details}`;
      }
      return message;
    }
    case "compatibility": {
      let message = `${prefix} The feature "${warning.feature}" is used in a compatibility mode.`;
      if (warning.details) {
        message += ` ${warning.details}`;
      }
      return message;
    }
    case "deprecated": {
      return `${prefix} Deprecated: "${warning.setting}". ${warning.message}`;
    }
    case "other": {
      return `${prefix} ${warning.message}`;
    }
    default: {
      return `${prefix} ${JSON.stringify(warning, null, 2)}`;
    }
  }
}
__name(formatWarning, "formatWarning");
var FIRST_WARNING_INFO_MESSAGE = "AI SDK Warning System: To turn off warning logging, set the AI_SDK_LOG_WARNINGS global to false.";
var hasLoggedBefore = false;
var logWarnings = /* @__PURE__ */ __name((options) => {
  if (options.warnings.length === 0) {
    return;
  }
  const logger = globalThis.AI_SDK_LOG_WARNINGS;
  if (logger === false) {
    return;
  }
  if (typeof logger === "function") {
    logger(options);
    return;
  }
  if (!hasLoggedBefore) {
    hasLoggedBefore = true;
    console.info(FIRST_WARNING_INFO_MESSAGE);
  }
  for (const warning of options.warnings) {
    const message = formatWarning({
      warning,
      provider: options.provider,
      model: options.model
    });
    if (typeof process !== "undefined" && typeof process.emitWarning === "function") {
      process.emitWarning(message, {
        type: warning.type === "deprecated" ? "DeprecationWarning" : "Warning"
      });
    } else {
      console.warn(message);
    }
  }
}, "logWarnings");
function logV2CompatibilityWarning({
  provider,
  modelId
}) {
  logWarnings({
    warnings: [
      {
        type: "compatibility",
        feature: "specificationVersion",
        details: `Using v2 specification compatibility mode. Some features may not be available.`
      }
    ],
    provider,
    model: modelId
  });
}
__name(logV2CompatibilityWarning, "logV2CompatibilityWarning");
function asEmbeddingModelV3(model) {
  if (model.specificationVersion === "v3") {
    return model;
  }
  logV2CompatibilityWarning({
    provider: model.provider,
    modelId: model.modelId
  });
  return new Proxy(model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v3";
      return target[prop];
    }
  });
}
__name(asEmbeddingModelV3, "asEmbeddingModelV3");
function asEmbeddingModelV4(model) {
  if (model.specificationVersion === "v4") {
    return model;
  }
  const v3Model = model.specificationVersion === "v2" ? asEmbeddingModelV3(model) : model;
  return new Proxy(v3Model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v4";
      return target[prop];
    }
  });
}
__name(asEmbeddingModelV4, "asEmbeddingModelV4");
function asImageModelV3(model) {
  if (model.specificationVersion === "v3") {
    return model;
  }
  logV2CompatibilityWarning({
    provider: model.provider,
    modelId: model.modelId
  });
  return new Proxy(model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v3";
      return target[prop];
    }
  });
}
__name(asImageModelV3, "asImageModelV3");
function asImageModelV4(model) {
  if (model.specificationVersion === "v4") {
    return model;
  }
  const v3Model = model.specificationVersion === "v2" ? asImageModelV3(model) : model;
  return new Proxy(v3Model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v4";
      return target[prop];
    }
  });
}
__name(asImageModelV4, "asImageModelV4");
function asLanguageModelV3(model) {
  if (model.specificationVersion === "v3") {
    return model;
  }
  logV2CompatibilityWarning({
    provider: model.provider,
    modelId: model.modelId
  });
  return new Proxy(model, {
    get(target, prop) {
      switch (prop) {
        case "specificationVersion":
          return "v3";
        case "doGenerate":
          return async (...args) => {
            const result = await target.doGenerate(...args);
            return {
              ...result,
              finishReason: convertV2FinishReasonToV3(result.finishReason),
              usage: convertV2UsageToV3(result.usage)
            };
          };
        case "doStream":
          return async (...args) => {
            const result = await target.doStream(...args);
            return {
              ...result,
              stream: convertV2StreamToV3(result.stream)
            };
          };
        default:
          return target[prop];
      }
    }
  });
}
__name(asLanguageModelV3, "asLanguageModelV3");
function convertV2StreamToV3(stream) {
  return stream.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        switch (chunk.type) {
          case "finish":
            controller.enqueue({
              ...chunk,
              finishReason: convertV2FinishReasonToV3(chunk.finishReason),
              usage: convertV2UsageToV3(chunk.usage)
            });
            break;
          default:
            controller.enqueue(chunk);
            break;
        }
      }
    })
  );
}
__name(convertV2StreamToV3, "convertV2StreamToV3");
function convertV2FinishReasonToV3(finishReason) {
  return {
    unified: finishReason === "unknown" ? "other" : finishReason,
    raw: void 0
  };
}
__name(convertV2FinishReasonToV3, "convertV2FinishReasonToV3");
function convertV2UsageToV3(usage) {
  return {
    inputTokens: {
      total: usage.inputTokens,
      noCache: void 0,
      cacheRead: usage.cachedInputTokens,
      cacheWrite: void 0
    },
    outputTokens: {
      total: usage.outputTokens,
      text: void 0,
      reasoning: usage.reasoningTokens
    }
  };
}
__name(convertV2UsageToV3, "convertV2UsageToV3");
function asLanguageModelV4(model) {
  if (model.specificationVersion === "v4") {
    return model;
  }
  const v3Model = model.specificationVersion === "v2" ? asLanguageModelV3(model) : model;
  return new Proxy(v3Model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v4";
      return target[prop];
    }
  });
}
__name(asLanguageModelV4, "asLanguageModelV4");
function asRerankingModelV4(model) {
  if (model.specificationVersion === "v4") {
    return model;
  }
  return new Proxy(model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v4";
      return target[prop];
    }
  });
}
__name(asRerankingModelV4, "asRerankingModelV4");
function asSpeechModelV3(model) {
  if (model.specificationVersion === "v3") {
    return model;
  }
  logV2CompatibilityWarning({
    provider: model.provider,
    modelId: model.modelId
  });
  return new Proxy(model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v3";
      return target[prop];
    }
  });
}
__name(asSpeechModelV3, "asSpeechModelV3");
function asSpeechModelV4(model) {
  if (model.specificationVersion === "v4") {
    return model;
  }
  const v3Model = model.specificationVersion === "v2" ? asSpeechModelV3(model) : model;
  return new Proxy(v3Model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v4";
      return target[prop];
    }
  });
}
__name(asSpeechModelV4, "asSpeechModelV4");
function asTranscriptionModelV3(model) {
  if (model.specificationVersion === "v3") {
    return model;
  }
  logV2CompatibilityWarning({
    provider: model.provider,
    modelId: model.modelId
  });
  return new Proxy(model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v3";
      return target[prop];
    }
  });
}
__name(asTranscriptionModelV3, "asTranscriptionModelV3");
function asTranscriptionModelV4(model) {
  if (model.specificationVersion === "v4") {
    return model;
  }
  const v3Model = model.specificationVersion === "v2" ? asTranscriptionModelV3(model) : model;
  return new Proxy(v3Model, {
    get(target, prop) {
      if (prop === "specificationVersion")
        return "v4";
      return target[prop];
    }
  });
}
__name(asTranscriptionModelV4, "asTranscriptionModelV4");
function asProviderV3(provider) {
  if ("specificationVersion" in provider && provider.specificationVersion === "v3") {
    return provider;
  }
  const v2Provider = provider;
  return {
    specificationVersion: "v3",
    languageModel: /* @__PURE__ */ __name((modelId) => asLanguageModelV3(v2Provider.languageModel(modelId)), "languageModel"),
    embeddingModel: /* @__PURE__ */ __name((modelId) => asEmbeddingModelV3(v2Provider.textEmbeddingModel(modelId)), "embeddingModel"),
    imageModel: /* @__PURE__ */ __name((modelId) => asImageModelV3(v2Provider.imageModel(modelId)), "imageModel"),
    transcriptionModel: v2Provider.transcriptionModel ? (modelId) => asTranscriptionModelV3(v2Provider.transcriptionModel(modelId)) : void 0,
    speechModel: v2Provider.speechModel ? (modelId) => asSpeechModelV3(v2Provider.speechModel(modelId)) : void 0,
    rerankingModel: void 0
    // v2 providers don't have reranking models
  };
}
__name(asProviderV3, "asProviderV3");
function asProviderV4(provider) {
  if ("specificationVersion" in provider && provider.specificationVersion === "v4") {
    return provider;
  }
  const v3Provider = !("specificationVersion" in provider) || provider.specificationVersion !== "v3" ? asProviderV3(provider) : provider;
  return {
    specificationVersion: "v4",
    languageModel: /* @__PURE__ */ __name((modelId) => asLanguageModelV4(v3Provider.languageModel(modelId)), "languageModel"),
    embeddingModel: /* @__PURE__ */ __name((modelId) => asEmbeddingModelV4(v3Provider.embeddingModel(modelId)), "embeddingModel"),
    imageModel: /* @__PURE__ */ __name((modelId) => asImageModelV4(v3Provider.imageModel(modelId)), "imageModel"),
    transcriptionModel: v3Provider.transcriptionModel ? (modelId) => asTranscriptionModelV4(v3Provider.transcriptionModel(modelId)) : void 0,
    speechModel: v3Provider.speechModel ? (modelId) => asSpeechModelV4(v3Provider.speechModel(modelId)) : void 0,
    rerankingModel: v3Provider.rerankingModel ? (modelId) => asRerankingModelV4(v3Provider.rerankingModel(modelId)) : void 0
  };
}
__name(asProviderV4, "asProviderV4");
function resolveLanguageModel(model) {
  if (typeof model === "string") {
    return getGlobalProvider().languageModel(model);
  }
  if (!["v4", "v3", "v2"].includes(model.specificationVersion)) {
    const unsupportedModel = model;
    throw new UnsupportedModelVersionError({
      version: unsupportedModel.specificationVersion,
      provider: unsupportedModel.provider,
      modelId: unsupportedModel.modelId
    });
  }
  return asLanguageModelV4(model);
}
__name(resolveLanguageModel, "resolveLanguageModel");
function getGlobalProvider() {
  var _a222;
  const provider = (_a222 = globalThis.AI_SDK_DEFAULT_PROVIDER) != null ? _a222 : gateway;
  return asProviderV4(provider);
}
__name(getGlobalProvider, "getGlobalProvider");
var VERSION3 = true ? "7.0.31" : "0.0.0-test";
var download = /* @__PURE__ */ __name(async ({
  url,
  maxBytes,
  abortSignal
}) => {
  var _a222;
  const urlText = url.toString();
  try {
    const headers = withUserAgentSuffix(
      {},
      `ai-sdk/${VERSION3}`,
      getRuntimeEnvironmentUserAgent()
    );
    const response = await fetchWithValidatedRedirects({
      url: urlText,
      headers,
      abortSignal
    });
    if (!response.ok) {
      await cancelResponseBody(response);
      throw new DownloadError({
        url: urlText,
        statusCode: response.status,
        statusText: response.statusText
      });
    }
    const data = await readResponseWithSizeLimit({
      response,
      url: urlText,
      maxBytes: maxBytes != null ? maxBytes : DEFAULT_MAX_DOWNLOAD_SIZE
    });
    return {
      data,
      mediaType: (_a222 = response.headers.get("content-type")) != null ? _a222 : void 0
    };
  } catch (error) {
    if (DownloadError.isInstance(error)) {
      throw error;
    }
    throw new DownloadError({ url: urlText, cause: error });
  }
}, "download");
var createDefaultDownloadFunction = /* @__PURE__ */ __name((download2 = download) => (requestedDownloads) => Promise.all(
  requestedDownloads.map(
    async (requestedDownload) => requestedDownload.isUrlSupportedByModel ? null : await download2(requestedDownload)
  )
), "createDefaultDownloadFunction");
function splitDataUrl(dataUrl) {
  try {
    const [header, base64Content] = dataUrl.split(",");
    return {
      mediaType: header.split(";")[0].split(":")[1],
      base64Content
    };
  } catch (e) {
    return {
      mediaType: void 0,
      base64Content: void 0
    };
  }
}
__name(splitDataUrl, "splitDataUrl");
function isTaggedFileData(value) {
  if (typeof value !== "object" || value === null)
    return false;
  const type = value.type;
  return type === "data" || type === "url" || type === "reference" || type === "text";
}
__name(isTaggedFileData, "isTaggedFileData");
function convertUrlToFilePartData(url) {
  if (url.protocol === "data:") {
    const { mediaType, base64Content } = splitDataUrl(url.toString());
    if (mediaType == null || base64Content == null) {
      throw new InvalidDataContentError({
        content: url,
        message: `Invalid data URL format in content ${url.toString()}`
      });
    }
    return { data: { type: "data", data: base64Content }, mediaType };
  }
  return { data: { type: "url", url }, mediaType: void 0 };
}
__name(convertUrlToFilePartData, "convertUrlToFilePartData");
function convertInlineDataToFilePartData(content) {
  if (content instanceof Uint8Array) {
    return { data: { type: "data", data: content }, mediaType: void 0 };
  }
  if (content instanceof ArrayBuffer) {
    return {
      data: { type: "data", data: new Uint8Array(content) },
      mediaType: void 0
    };
  }
  if (isBuffer(content)) {
    return {
      data: { type: "data", data: new Uint8Array(content) },
      mediaType: void 0
    };
  }
  return {
    data: { type: "data", data: content },
    mediaType: void 0
  };
}
__name(convertInlineDataToFilePartData, "convertInlineDataToFilePartData");
function convertToLanguageModelV4FilePart(content) {
  if (isTaggedFileData(content)) {
    switch (content.type) {
      case "data":
        if (typeof content.data === "string" && content.data.startsWith("data:")) {
          throw new InvalidDataContentError({
            content: content.data,
            message: 'Data URLs are not valid inline data. Pass them as { type: "url", url } instead.'
          });
        }
        return convertInlineDataToFilePartData(content.data);
      case "url":
        return convertUrlToFilePartData(content.url);
      case "reference":
        return {
          data: { type: "reference", reference: content.reference },
          mediaType: void 0
        };
      case "text":
        return {
          data: { type: "text", text: content.text },
          mediaType: void 0
        };
    }
  }
  if (content instanceof URL) {
    return convertUrlToFilePartData(content);
  }
  if (typeof content === "string") {
    try {
      return convertUrlToFilePartData(new URL(content));
    } catch (e) {
      return convertInlineDataToFilePartData(content);
    }
  }
  if (isProviderReference(content)) {
    return {
      data: { type: "reference", reference: content },
      mediaType: void 0
    };
  }
  return convertInlineDataToFilePartData(content);
}
__name(convertToLanguageModelV4FilePart, "convertToLanguageModelV4FilePart");
async function convertToLanguageModelPrompt({
  prompt,
  supportedUrls,
  download: download2 = createDefaultDownloadFunction(),
  // `provider` is only needed here to convert legacy tool output types via `mapToolResultOutput`.
  // TODO: remove in v8 when "file-id" and "image-file-id" types are removed
  provider
}) {
  const downloadedAssets = await downloadAssets(
    prompt.messages,
    download2,
    supportedUrls
  );
  const approvalIdToToolCallId = /* @__PURE__ */ new Map();
  for (const message of prompt.messages) {
    if (message.role === "assistant" && Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part.type === "tool-approval-request" && "approvalId" in part && "toolCallId" in part) {
          approvalIdToToolCallId.set(
            part.approvalId,
            part.toolCallId
          );
        }
      }
    }
  }
  const approvedToolCallIds = /* @__PURE__ */ new Set();
  for (const message of prompt.messages) {
    if (message.role === "tool") {
      for (const part of message.content) {
        if (part.type === "tool-approval-response") {
          const toolCallId = approvalIdToToolCallId.get(part.approvalId);
          if (toolCallId) {
            approvedToolCallIds.add(toolCallId);
          }
        }
      }
    }
  }
  const messages = [
    ...prompt.instructions != null ? typeof prompt.instructions === "string" ? [{ role: "system", content: prompt.instructions }] : asArray(prompt.instructions).map((message) => ({
      role: "system",
      content: message.content,
      providerOptions: message.providerOptions
    })) : [],
    ...prompt.messages.map(
      (message) => convertToLanguageModelMessage({ message, downloadedAssets, provider })
    )
  ];
  const combinedMessages = [];
  for (const message of messages) {
    if (message.role !== "tool") {
      combinedMessages.push(message);
      continue;
    }
    const lastCombinedMessage = combinedMessages.at(-1);
    if ((lastCombinedMessage == null ? void 0 : lastCombinedMessage.role) === "tool") {
      lastCombinedMessage.content.push(...message.content);
    } else {
      combinedMessages.push(message);
    }
  }
  const toolCallIds = /* @__PURE__ */ new Set();
  for (const message of combinedMessages) {
    switch (message.role) {
      case "assistant": {
        for (const content of message.content) {
          if (content.type === "tool-call" && !content.providerExecuted) {
            toolCallIds.add(content.toolCallId);
          }
        }
        break;
      }
      case "tool": {
        for (const content of message.content) {
          if (content.type === "tool-result") {
            toolCallIds.delete(content.toolCallId);
          }
        }
        break;
      }
      case "user":
      case "system":
        for (const id of approvedToolCallIds) {
          toolCallIds.delete(id);
        }
        if (toolCallIds.size > 0) {
          throw new MissingToolResultsError({
            toolCallIds: Array.from(toolCallIds)
          });
        }
        break;
    }
  }
  for (const id of approvedToolCallIds) {
    toolCallIds.delete(id);
  }
  if (toolCallIds.size > 0) {
    throw new MissingToolResultsError({ toolCallIds: Array.from(toolCallIds) });
  }
  return combinedMessages.filter(
    // Filter out empty tool messages (e.g. if they only contained
    // tool-approval-response parts that were removed).
    // This prevents sending invalid empty messages to the provider.
    // Note: provider-executed tool-approval-response parts are preserved.
    (message) => message.role !== "tool" || message.content.length > 0
  );
}
__name(convertToLanguageModelPrompt, "convertToLanguageModelPrompt");
function convertToLanguageModelMessage({
  message,
  downloadedAssets,
  // `provider` is only needed here to convert legacy tool output types via `mapToolResultOutput`.
  // TODO: remove in v8 when "file-id" and "image-file-id" types are removed
  provider
}) {
  const warnings = [];
  const role = message.role;
  switch (role) {
    case "system": {
      return {
        role: "system",
        content: message.content,
        providerOptions: message.providerOptions
      };
    }
    case "user": {
      if (typeof message.content === "string") {
        return {
          role: "user",
          content: [{ type: "text", text: message.content }],
          providerOptions: message.providerOptions
        };
      }
      const converted = {
        role: "user",
        content: message.content.map((part) => {
          if (part.type === "image") {
            warnings.push({
              type: "deprecated",
              setting: '"image" content part',
              message: `The "image" content part type is deprecated. Use a "file" part with mediaType: 'image' (or a more specific image/* subtype) instead.`
            });
          }
          return convertImagePartToFilePart(part);
        }).map((part) => convertPartToLanguageModelPart(part, downloadedAssets)).filter((part) => part.type !== "text" || part.text !== ""),
        providerOptions: message.providerOptions
      };
      if (warnings.length > 0) {
        logWarnings({ warnings });
      }
      return converted;
    }
    case "assistant": {
      if (typeof message.content === "string") {
        return {
          role: "assistant",
          content: [{ type: "text", text: message.content }],
          providerOptions: message.providerOptions
        };
      }
      const converted = {
        role: "assistant",
        content: message.content.filter(
          // remove empty text parts (no text, and no provider options):
          (part) => part.type !== "text" || part.text !== "" || part.providerOptions != null
        ).filter(
          (part) => part.type !== "tool-approval-request"
        ).map((part) => {
          const providerOptions = part.providerOptions;
          switch (part.type) {
            case "custom": {
              return {
                type: "custom",
                kind: part.kind,
                providerOptions
              };
            }
            case "file": {
              const { data, mediaType } = convertToLanguageModelV4FilePart(
                part.data
              );
              return {
                type: "file",
                data,
                filename: part.filename,
                mediaType: mediaType != null ? mediaType : part.mediaType,
                providerOptions
              };
            }
            case "reasoning": {
              return {
                type: "reasoning",
                text: part.text,
                providerOptions
              };
            }
            case "reasoning-file": {
              const { data, mediaType } = convertToLanguageModelV4FilePart(
                part.data
              );
              if (data.type !== "data" && data.type !== "url") {
                throw new Error(
                  `Unsupported reasoning-file data type: ${data.type}`
                );
              }
              return {
                type: "reasoning-file",
                data,
                mediaType: mediaType != null ? mediaType : part.mediaType,
                providerOptions
              };
            }
            case "text": {
              return {
                type: "text",
                text: part.text,
                providerOptions
              };
            }
            case "tool-call": {
              return {
                type: "tool-call",
                toolCallId: part.toolCallId,
                toolName: part.toolName,
                input: part.input,
                providerExecuted: part.providerExecuted,
                providerOptions
              };
            }
            case "tool-result": {
              return {
                type: "tool-result",
                toolCallId: part.toolCallId,
                toolName: part.toolName,
                output: mapToolResultOutput({
                  output: part.output,
                  provider,
                  warnings,
                  downloadedAssets
                }),
                providerOptions
              };
            }
          }
        }),
        providerOptions: message.providerOptions
      };
      if (warnings.length > 0) {
        logWarnings({ warnings });
      }
      return converted;
    }
    case "tool": {
      const converted = {
        role: "tool",
        content: message.content.filter(
          // Only include tool-approval-response for provider-executed tools
          (part) => part.type !== "tool-approval-response" || part.providerExecuted
        ).map((part) => {
          switch (part.type) {
            case "tool-result": {
              return {
                type: "tool-result",
                toolCallId: part.toolCallId,
                toolName: part.toolName,
                output: mapToolResultOutput({
                  output: part.output,
                  provider,
                  warnings,
                  downloadedAssets
                }),
                providerOptions: part.providerOptions
              };
            }
            case "tool-approval-response": {
              return {
                type: "tool-approval-response",
                approvalId: part.approvalId,
                approved: part.approved,
                reason: part.reason
              };
            }
          }
        }),
        providerOptions: message.providerOptions
      };
      if (warnings.length > 0) {
        logWarnings({ warnings });
      }
      return converted;
    }
    default: {
      const _exhaustiveCheck = role;
      throw new InvalidMessageRoleError({ role: _exhaustiveCheck });
    }
  }
}
__name(convertToLanguageModelMessage, "convertToLanguageModelMessage");
function convertImagePartToFilePart(part) {
  var _a222;
  if (part.type !== "image") {
    return part;
  }
  return {
    type: "file",
    data: part.image,
    mediaType: (_a222 = part.mediaType) != null ? _a222 : "image",
    providerOptions: part.providerOptions
  };
}
__name(convertImagePartToFilePart, "convertImagePartToFilePart");
async function downloadAssets(messages, download2, supportedUrls) {
  const downloadableFiles = [];
  for (const message of messages) {
    if (message.role === "user" && Array.isArray(message.content)) {
      for (const part of message.content) {
        const filePart = convertImagePartToFilePart(part);
        if (filePart.type === "file") {
          downloadableFiles.push(filePart);
        }
      }
    }
    if (message.role === "tool") {
      for (const part of message.content) {
        if (part.type !== "tool-result") {
          continue;
        }
        if (part.output.type !== "content") {
          continue;
        }
        for (const contentPart of part.output.value) {
          if (contentPart.type === "file") {
            downloadableFiles.push(contentPart);
          }
        }
      }
    }
    if (message.role === "assistant" && Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part.type !== "tool-result") {
          continue;
        }
        if (part.output.type !== "content") {
          continue;
        }
        for (const contentPart of part.output.value) {
          if (contentPart.type === "file") {
            downloadableFiles.push(contentPart);
          }
        }
      }
    }
  }
  const plannedDownloads = downloadableFiles.map((part) => {
    const mediaType = part.mediaType;
    const { data } = convertToLanguageModelV4FilePart(part.data);
    return { mediaType, data };
  }).filter((part) => part.data.type === "url").map((part) => ({
    url: part.data.url,
    isUrlSupportedByModel: part.mediaType != null && isUrlSupported({
      url: part.data.url.toString(),
      mediaType: part.mediaType,
      supportedUrls
    })
  }));
  const downloadedFiles = await download2(plannedDownloads);
  return Object.fromEntries(
    downloadedFiles.map(
      (file, index) => file == null ? null : [
        plannedDownloads[index].url.toString(),
        { data: file.data, mediaType: file.mediaType }
      ]
    ).filter((file) => file != null)
  );
}
__name(downloadAssets, "downloadAssets");
function convertPartToLanguageModelPart(part, downloadedAssets) {
  if (part.type === "text") {
    return {
      type: "text",
      text: part.text,
      providerOptions: part.providerOptions
    };
  }
  const { data: normalizedData, mediaType: dataUrlMediaType } = convertToLanguageModelV4FilePart(part.data);
  let mediaType = dataUrlMediaType != null ? dataUrlMediaType : part.mediaType;
  let data = normalizedData;
  if (data.type === "url") {
    const downloadedFile = downloadedAssets[data.url.toString()];
    if (downloadedFile) {
      data = { type: "data", data: downloadedFile.data };
      if (downloadedFile.mediaType != null && (mediaType == null || !isFullMediaType(mediaType))) {
        mediaType = downloadedFile.mediaType;
      }
    }
  }
  if (data.type === "data" && (data.data instanceof Uint8Array || typeof data.data === "string")) {
    const imageMediaType = detectMediaType({
      data: data.data,
      topLevelType: "image"
    });
    if (imageMediaType != null) {
      mediaType = imageMediaType;
    }
  }
  if (mediaType == null) {
    throw new Error(`Media type is missing for file part`);
  }
  return {
    type: "file",
    mediaType,
    filename: part.filename,
    data,
    providerOptions: part.providerOptions
  };
}
__name(convertPartToLanguageModelPart, "convertPartToLanguageModelPart");
function mapToolResultOutput({
  output,
  // `provider` is only needed here to convert legacy "file-id" and "image-file-id" types to provider references, in case they are using string ID values.
  // TODO: remove in v8 when "file-id" and "image-file-id" types are removed
  provider,
  warnings = [],
  downloadedAssets
}) {
  if (output.type !== "content") {
    return output;
  }
  return {
    type: "content",
    value: output.value.map((item) => {
      var _a222;
      switch (item.type) {
        case "file": {
          const convertedPart = convertPartToLanguageModelPart(
            item,
            downloadedAssets
          );
          if (convertedPart.type !== "file") {
            throw new Error(
              "Expected tool result file content to convert to file."
            );
          }
          return convertedPart;
        }
        case "file-data": {
          warnings.push({
            type: "deprecated",
            setting: '"tool-result" content of type "file-data"',
            message: `The "file-data" type for tool result content is deprecated. Use the "file" type with mediaType and { type: 'data', data } instead.`
          });
          return {
            type: "file",
            data: { type: "data", data: item.data },
            filename: item.filename,
            mediaType: item.mediaType,
            providerOptions: item.providerOptions
          };
        }
        case "file-url": {
          const mediaType = (_a222 = item.mediaType) != null ? _a222 : getMediaTypeFromUrl(item.url);
          let message = `The "file-url" type for tool result content is deprecated. Use the "file" type with mediaType and { type: 'url', url } instead.`;
          if (!item.mediaType) {
            const inferenceSuffix = mediaType === "application/octet-stream" ? `Unable to infer media type from URL. Defaulting to 'application/octet-stream'.` : `Inferred media type '${mediaType}' from URL.`;
            message = `The "file-url" tool result content part with URL "${item.url}" is missing a "mediaType". ${inferenceSuffix} ${message}`;
          }
          warnings.push({
            type: "deprecated",
            setting: '"tool-result" content of type "file-url"',
            message
          });
          return {
            type: "file",
            data: { type: "url", url: new URL(item.url) },
            mediaType,
            providerOptions: item.providerOptions
          };
        }
        case "file-id": {
          warnings.push({
            type: "deprecated",
            setting: '"tool-result" content of type "file-id"',
            message: `The "file-id" type for tool result content is deprecated. Use the "file" type with mediaType and { type: 'reference', reference } instead.`
          });
          return {
            type: "file",
            data: {
              type: "reference",
              reference: convertFileIdToProviderReference({
                fileId: item.fileId,
                provider
              })
            },
            mediaType: "application",
            providerOptions: item.providerOptions
          };
        }
        case "file-reference": {
          warnings.push({
            type: "deprecated",
            setting: '"tool-result" content of type "file-reference"',
            message: `The "file-reference" type for tool result content is deprecated. Use the "file" type with mediaType and { type: 'reference', reference } instead.`
          });
          return {
            type: "file",
            data: {
              type: "reference",
              reference: item.providerReference
            },
            mediaType: "application",
            providerOptions: item.providerOptions
          };
        }
        case "image-data": {
          warnings.push({
            type: "deprecated",
            setting: '"tool-result" content of type "image-data"',
            message: `The "image-data" type for tool result content is deprecated. Use the "file" type with mediaType and { type: 'data', data } instead.`
          });
          return {
            type: "file",
            data: { type: "data", data: item.data },
            mediaType: item.mediaType,
            providerOptions: item.providerOptions
          };
        }
        case "image-url": {
          warnings.push({
            type: "deprecated",
            setting: '"tool-result" content of type "image-url"',
            message: `The "image-url" type for tool result content is deprecated. Use the "file" type with mediaType 'image' (or a specific image/* subtype) and { type: 'url', url } instead.`
          });
          return {
            type: "file",
            data: { type: "url", url: new URL(item.url) },
            mediaType: "image",
            providerOptions: item.providerOptions
          };
        }
        case "image-file-id": {
          warnings.push({
            type: "deprecated",
            setting: '"tool-result" content of type "image-file-id"',
            message: `The "image-file-id" type for tool result content is deprecated. Use the "file" type with mediaType and { type: 'reference', reference } instead.`
          });
          return {
            type: "file",
            data: {
              type: "reference",
              reference: convertFileIdToProviderReference({
                fileId: item.fileId,
                provider
              })
            },
            mediaType: "image",
            providerOptions: item.providerOptions
          };
        }
        case "image-file-reference": {
          warnings.push({
            type: "deprecated",
            setting: '"tool-result" content of type "image-file-reference"',
            message: `The "image-file-reference" type for tool result content is deprecated. Use the "file" type with mediaType and { type: 'reference', reference } instead.`
          });
          return {
            type: "file",
            data: {
              type: "reference",
              reference: item.providerReference
            },
            mediaType: "image",
            providerOptions: item.providerOptions
          };
        }
        default:
          return item;
      }
    })
  };
}
__name(mapToolResultOutput, "mapToolResultOutput");
function convertFileIdToProviderReference({
  fileId,
  provider
}) {
  if (typeof fileId === "object") {
    return fileId;
  }
  if (provider == null) {
    throw new Error(
      "Cannot convert string fileId to provider reference without a provider ID. Use a Record<string, string> fileId or switch to the file-reference type."
    );
  }
  return { [provider]: fileId };
}
__name(convertFileIdToProviderReference, "convertFileIdToProviderReference");
var URL_EXTENSION_TO_MEDIA_TYPE = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
  heic: "image/heic",
  bmp: "image/bmp",
  tiff: "image/tiff",
  tif: "image/tiff",
  pdf: "application/pdf",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg"
};
function getMediaTypeFromUrl(url, fallbackMediaType = "application/octet-stream") {
  var _a222;
  try {
    const pathname = new URL(url).pathname;
    const fileExtension = (_a222 = pathname.split(".").pop()) == null ? void 0 : _a222.toLowerCase();
    if (fileExtension && Object.hasOwn(URL_EXTENSION_TO_MEDIA_TYPE, fileExtension)) {
      return URL_EXTENSION_TO_MEDIA_TYPE[fileExtension];
    }
  } catch (e) {
  }
  return fallbackMediaType;
}
__name(getMediaTypeFromUrl, "getMediaTypeFromUrl");
function prepareLanguageModelCallOptions({
  maxOutputTokens,
  temperature,
  topP,
  topK,
  presencePenalty,
  frequencyPenalty,
  seed,
  stopSequences,
  reasoning
}) {
  if (maxOutputTokens != null) {
    if (!Number.isInteger(maxOutputTokens)) {
      throw new InvalidArgumentError2({
        parameter: "maxOutputTokens",
        value: maxOutputTokens,
        message: "maxOutputTokens must be an integer"
      });
    }
    if (maxOutputTokens < 1) {
      throw new InvalidArgumentError2({
        parameter: "maxOutputTokens",
        value: maxOutputTokens,
        message: "maxOutputTokens must be >= 1"
      });
    }
  }
  if (temperature != null) {
    if (typeof temperature !== "number") {
      throw new InvalidArgumentError2({
        parameter: "temperature",
        value: temperature,
        message: "temperature must be a number"
      });
    }
  }
  if (topP != null) {
    if (typeof topP !== "number") {
      throw new InvalidArgumentError2({
        parameter: "topP",
        value: topP,
        message: "topP must be a number"
      });
    }
  }
  if (topK != null) {
    if (typeof topK !== "number") {
      throw new InvalidArgumentError2({
        parameter: "topK",
        value: topK,
        message: "topK must be a number"
      });
    }
  }
  if (presencePenalty != null) {
    if (typeof presencePenalty !== "number") {
      throw new InvalidArgumentError2({
        parameter: "presencePenalty",
        value: presencePenalty,
        message: "presencePenalty must be a number"
      });
    }
  }
  if (frequencyPenalty != null) {
    if (typeof frequencyPenalty !== "number") {
      throw new InvalidArgumentError2({
        parameter: "frequencyPenalty",
        value: frequencyPenalty,
        message: "frequencyPenalty must be a number"
      });
    }
  }
  if (seed != null) {
    if (!Number.isInteger(seed)) {
      throw new InvalidArgumentError2({
        parameter: "seed",
        value: seed,
        message: "seed must be an integer"
      });
    }
  }
  return {
    maxOutputTokens,
    temperature,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    stopSequences,
    seed,
    reasoning
  };
}
__name(prepareLanguageModelCallOptions, "prepareLanguageModelCallOptions");
var jsonValueSchema = external_exports.lazy(
  () => external_exports.union([
    external_exports.null(),
    external_exports.string(),
    external_exports.number(),
    external_exports.boolean(),
    external_exports.record(external_exports.string(), jsonValueSchema.optional()),
    external_exports.array(jsonValueSchema)
  ])
);
var providerMetadataSchema = external_exports.record(
  external_exports.string(),
  external_exports.record(external_exports.string(), jsonValueSchema.optional())
);
var fileInlineDataSchema = external_exports.union([
  external_exports.string(),
  external_exports.instanceof(Uint8Array),
  external_exports.instanceof(ArrayBuffer),
  external_exports.custom(isBuffer, { message: "Must be a Buffer" })
]);
var providerReferenceSchema = external_exports.record(external_exports.string(), external_exports.string());
var textPartSchema = external_exports.object({
  type: external_exports.literal("text"),
  text: external_exports.string(),
  providerOptions: providerMetadataSchema.optional()
});
var imagePartSchema = external_exports.object({
  type: external_exports.literal("image"),
  image: external_exports.union([
    fileInlineDataSchema,
    external_exports.instanceof(URL),
    providerReferenceSchema
  ]),
  mediaType: external_exports.string().optional(),
  providerOptions: providerMetadataSchema.optional()
});
var taggedFileDataSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({ type: external_exports.literal("data"), data: fileInlineDataSchema }),
  external_exports.object({ type: external_exports.literal("url"), url: external_exports.instanceof(URL) }),
  external_exports.object({
    type: external_exports.literal("reference"),
    reference: providerReferenceSchema
  }),
  external_exports.object({ type: external_exports.literal("text"), text: external_exports.string() })
]);
var taggedReasoningFileDataSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({ type: external_exports.literal("data"), data: fileInlineDataSchema }),
  external_exports.object({ type: external_exports.literal("url"), url: external_exports.instanceof(URL) })
]);
var filePartSchema = external_exports.object({
  type: external_exports.literal("file"),
  data: external_exports.union([
    taggedFileDataSchema,
    fileInlineDataSchema,
    external_exports.instanceof(URL),
    providerReferenceSchema
  ]),
  filename: external_exports.string().optional(),
  mediaType: external_exports.string(),
  providerOptions: providerMetadataSchema.optional()
});
var reasoningPartSchema = external_exports.object({
  type: external_exports.literal("reasoning"),
  text: external_exports.string(),
  providerOptions: providerMetadataSchema.optional()
});
var customPartSchema = external_exports.object({
  type: external_exports.literal("custom"),
  kind: external_exports.string().transform((value) => value),
  providerOptions: providerMetadataSchema.optional()
});
var reasoningFilePartSchema = external_exports.object({
  type: external_exports.literal("reasoning-file"),
  data: external_exports.union([
    taggedReasoningFileDataSchema,
    fileInlineDataSchema,
    external_exports.instanceof(URL)
  ]),
  mediaType: external_exports.string(),
  providerOptions: providerMetadataSchema.optional()
});
var toolCallPartSchema = external_exports.object({
  type: external_exports.literal("tool-call"),
  toolCallId: external_exports.string(),
  toolName: external_exports.string(),
  input: external_exports.unknown(),
  providerOptions: providerMetadataSchema.optional(),
  providerExecuted: external_exports.boolean().optional()
});
var outputSchema = external_exports.discriminatedUnion(
  "type",
  [
    external_exports.object({
      type: external_exports.literal("text"),
      value: external_exports.string(),
      providerOptions: providerMetadataSchema.optional()
    }),
    external_exports.object({
      type: external_exports.literal("json"),
      value: jsonValueSchema,
      providerOptions: providerMetadataSchema.optional()
    }),
    external_exports.object({
      type: external_exports.literal("execution-denied"),
      reason: external_exports.string().optional(),
      providerOptions: providerMetadataSchema.optional()
    }),
    external_exports.object({
      type: external_exports.literal("error-text"),
      value: external_exports.string(),
      providerOptions: providerMetadataSchema.optional()
    }),
    external_exports.object({
      type: external_exports.literal("error-json"),
      value: jsonValueSchema,
      providerOptions: providerMetadataSchema.optional()
    }),
    external_exports.object({
      type: external_exports.literal("content"),
      value: external_exports.array(
        external_exports.union([
          external_exports.object({
            type: external_exports.literal("text"),
            text: external_exports.string(),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            type: external_exports.literal("file"),
            data: taggedFileDataSchema,
            mediaType: external_exports.string(),
            filename: external_exports.string().optional(),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            // Deprecated.
            type: external_exports.literal("file-data"),
            data: external_exports.string(),
            mediaType: external_exports.string(),
            filename: external_exports.string().optional(),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            // Deprecated.
            type: external_exports.literal("file-url"),
            url: external_exports.string(),
            mediaType: external_exports.string().optional(),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            // Deprecated.
            type: external_exports.literal("file-id"),
            fileId: external_exports.union([external_exports.string(), external_exports.record(external_exports.string(), external_exports.string())]),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            // Deprecated.
            type: external_exports.literal("file-reference"),
            providerReference: external_exports.record(external_exports.string(), external_exports.string()),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            // Deprecated.
            type: external_exports.literal("image-data"),
            data: external_exports.string(),
            mediaType: external_exports.string(),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            // Deprecated.
            type: external_exports.literal("image-url"),
            url: external_exports.string(),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            // Deprecated.
            type: external_exports.literal("image-file-id"),
            fileId: external_exports.union([external_exports.string(), external_exports.record(external_exports.string(), external_exports.string())]),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            // Deprecated.
            type: external_exports.literal("image-file-reference"),
            providerReference: external_exports.record(external_exports.string(), external_exports.string()),
            providerOptions: providerMetadataSchema.optional()
          }),
          external_exports.object({
            type: external_exports.literal("custom"),
            providerOptions: providerMetadataSchema.optional()
          })
        ])
      )
    })
  ]
);
var toolResultPartSchema = external_exports.object({
  type: external_exports.literal("tool-result"),
  toolCallId: external_exports.string(),
  toolName: external_exports.string(),
  output: outputSchema,
  providerOptions: providerMetadataSchema.optional()
});
var toolApprovalRequestSchema = external_exports.object({
  type: external_exports.literal("tool-approval-request"),
  approvalId: external_exports.string(),
  toolCallId: external_exports.string()
});
var toolApprovalResponseSchema = external_exports.object({
  type: external_exports.literal("tool-approval-response"),
  approvalId: external_exports.string(),
  approved: external_exports.boolean(),
  reason: external_exports.string().optional()
});
var systemModelMessageSchema = external_exports.object(
  {
    role: external_exports.literal("system"),
    content: external_exports.string(),
    providerOptions: providerMetadataSchema.optional()
  }
);
var userModelMessageSchema = external_exports.object({
  role: external_exports.literal("user"),
  content: external_exports.union([
    external_exports.string(),
    external_exports.array(external_exports.union([textPartSchema, imagePartSchema, filePartSchema]))
  ]),
  providerOptions: providerMetadataSchema.optional()
});
var assistantModelMessageSchema = external_exports.object({
  role: external_exports.literal("assistant"),
  content: external_exports.union([
    external_exports.string(),
    external_exports.array(
      external_exports.union([
        textPartSchema,
        customPartSchema,
        filePartSchema,
        reasoningPartSchema,
        reasoningFilePartSchema,
        toolCallPartSchema,
        toolResultPartSchema,
        toolApprovalRequestSchema
      ])
    )
  ]),
  providerOptions: providerMetadataSchema.optional()
});
var toolModelMessageSchema = external_exports.object({
  role: external_exports.literal("tool"),
  content: external_exports.array(external_exports.union([toolResultPartSchema, toolApprovalResponseSchema])),
  providerOptions: providerMetadataSchema.optional()
});
var modelMessageSchema = external_exports.union([
  systemModelMessageSchema,
  userModelMessageSchema,
  assistantModelMessageSchema,
  toolModelMessageSchema
]);
async function standardizePrompt({
  allowSystemInMessages = false,
  system,
  instructions = system,
  prompt,
  messages
}) {
  if (prompt == null && messages == null) {
    throw new InvalidPromptError({
      prompt,
      message: "prompt or messages must be defined"
    });
  }
  if (prompt != null && messages != null) {
    throw new InvalidPromptError({
      prompt,
      message: "prompt and messages cannot be defined at the same time"
    });
  }
  if (typeof instructions !== "string" && !asArray(instructions).every((message) => message.role === "system")) {
    throw new InvalidPromptError({
      prompt,
      message: "instructions must be a string, SystemModelMessage, or array of SystemModelMessage"
    });
  }
  if (prompt != null && typeof prompt === "string") {
    messages = [{ role: "user", content: prompt }];
  } else if (prompt != null && Array.isArray(prompt)) {
    messages = prompt;
  } else if (messages == null) {
    throw new InvalidPromptError({
      prompt,
      message: "prompt or messages must be defined"
    });
  }
  if (messages.length === 0) {
    throw new InvalidPromptError({
      prompt,
      message: "messages must not be empty"
    });
  }
  if (!allowSystemInMessages && messages.some((message) => message.role === "system")) {
    throw new InvalidPromptError({
      prompt,
      message: "System messages are not allowed in the prompt or messages fields. Use the instructions option instead."
    });
  }
  const validationResult = await safeValidateTypes({
    value: messages,
    schema: external_exports.array(modelMessageSchema)
  });
  if (!validationResult.success) {
    throw new InvalidPromptError({
      prompt,
      message: "The messages do not match the ModelMessage[] schema.",
      cause: validationResult.error
    });
  }
  return { messages, instructions };
}
__name(standardizePrompt, "standardizePrompt");
function wrapGatewayError(error) {
  if (!GatewayAuthenticationError.isInstance(error))
    return error;
  const isProductionEnv = (process == null ? void 0 : process.env.NODE_ENV) === "production";
  const moreInfoURL = "https://ai-sdk.dev/unauthenticated-ai-gateway";
  if (isProductionEnv) {
    return new AISDKError({
      name: "GatewayError",
      message: `Unauthenticated. Configure AI_GATEWAY_API_KEY or use a provider module. Learn more: ${moreInfoURL}`
    });
  }
  return Object.assign(
    new Error(`\x1B[1m\x1B[31mUnauthenticated request to AI Gateway.\x1B[0m

To authenticate, set the \x1B[33mAI_GATEWAY_API_KEY\x1B[0m environment variable with your API key.

Alternatively, you can use a provider module instead of the AI Gateway.

Learn more: \x1B[34m${moreInfoURL}\x1B[0m

`),
    { name: "GatewayAuthenticationError" }
  );
}
__name(wrapGatewayError, "wrapGatewayError");
function asLanguageModelUsage(usage) {
  return {
    inputTokens: usage.inputTokens.total,
    inputTokenDetails: {
      noCacheTokens: usage.inputTokens.noCache,
      cacheReadTokens: usage.inputTokens.cacheRead,
      cacheWriteTokens: usage.inputTokens.cacheWrite
    },
    outputTokens: usage.outputTokens.total,
    outputTokenDetails: {
      textTokens: usage.outputTokens.text,
      reasoningTokens: usage.outputTokens.reasoning
    },
    totalTokens: addTokenCounts(
      usage.inputTokens.total,
      usage.outputTokens.total
    ),
    raw: usage.raw
  };
}
__name(asLanguageModelUsage, "asLanguageModelUsage");
function createNullLanguageModelUsage() {
  return {
    inputTokens: void 0,
    inputTokenDetails: {
      noCacheTokens: void 0,
      cacheReadTokens: void 0,
      cacheWriteTokens: void 0
    },
    outputTokens: void 0,
    outputTokenDetails: {
      textTokens: void 0,
      reasoningTokens: void 0
    },
    totalTokens: void 0,
    raw: void 0
  };
}
__name(createNullLanguageModelUsage, "createNullLanguageModelUsage");
function addTokenCounts(tokenCount1, tokenCount2) {
  return tokenCount1 == null && tokenCount2 == null ? void 0 : (tokenCount1 != null ? tokenCount1 : 0) + (tokenCount2 != null ? tokenCount2 : 0);
}
__name(addTokenCounts, "addTokenCounts");
function now() {
  var _a222, _b18;
  return (_b18 = (_a222 = globalThis == null ? void 0 : globalThis.performance) == null ? void 0 : _a222.now()) != null ? _b18 : Date.now();
}
__name(now, "now");
async function notify(options) {
  await Promise.all(
    asArray(options.callbacks).map(async (callback) => {
      try {
        await (callback == null ? void 0 : callback(options.event));
      } catch (e) {
      }
    })
  );
}
__name(notify, "notify");
function getRetryDelayInMs({
  error,
  exponentialBackoffDelay
}) {
  const headers = APICallError.isInstance(error) ? error.responseHeaders : APICallError.isInstance(error.cause) ? error.cause.responseHeaders : void 0;
  if (!headers)
    return exponentialBackoffDelay;
  let ms;
  const retryAfterMs = headers["retry-after-ms"];
  if (retryAfterMs) {
    const timeoutMs = parseFloat(retryAfterMs);
    if (!Number.isNaN(timeoutMs)) {
      ms = timeoutMs;
    }
  }
  const retryAfter = headers["retry-after"];
  if (retryAfter && ms === void 0) {
    const timeoutSeconds = parseFloat(retryAfter);
    if (!Number.isNaN(timeoutSeconds)) {
      ms = timeoutSeconds * 1e3;
    } else {
      ms = Date.parse(retryAfter) - Date.now();
    }
  }
  if (ms != null && !Number.isNaN(ms) && 0 <= ms && (ms < 60 * 1e3 || ms < exponentialBackoffDelay)) {
    return ms;
  }
  return exponentialBackoffDelay;
}
__name(getRetryDelayInMs, "getRetryDelayInMs");
var retryWithExponentialBackoffRespectingRetryHeaders = /* @__PURE__ */ __name(({
  maxRetries = 2,
  initialDelayInMs = 2e3,
  backoffFactor = 2,
  abortSignal
} = {}) => retryWithExponentialBackoff({
  maxRetries,
  initialDelayInMs,
  backoffFactor,
  abortSignal,
  shouldRetry: /* @__PURE__ */ __name((error) => error instanceof Error && (APICallError.isInstance(error) && error.isRetryable === true || GatewayError.isInstance(error) && error.isRetryable === true), "shouldRetry"),
  getDelayInMs: /* @__PURE__ */ __name(({ error, exponentialBackoffDelay }) => getRetryDelayInMs({
    error,
    exponentialBackoffDelay
  }), "getDelayInMs"),
  createRetryError: /* @__PURE__ */ __name(({ message, reason, errors }) => new RetryError({ message, reason, errors }), "createRetryError")
}), "retryWithExponentialBackoffRespectingRetryHeaders");
function prepareRetries({
  maxRetries,
  abortSignal
}) {
  if (maxRetries != null) {
    if (!Number.isInteger(maxRetries)) {
      throw new InvalidArgumentError2({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be an integer"
      });
    }
    if (maxRetries < 0) {
      throw new InvalidArgumentError2({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be >= 0"
      });
    }
  }
  const maxRetriesResult = maxRetries != null ? maxRetries : 2;
  return {
    maxRetries: maxRetriesResult,
    retry: retryWithExponentialBackoffRespectingRetryHeaders({
      maxRetries: maxRetriesResult,
      abortSignal
    })
  };
}
__name(prepareRetries, "prepareRetries");
var output_exports = {};
__export(output_exports, {
  array: /* @__PURE__ */ __name(() => array, "array"),
  choice: /* @__PURE__ */ __name(() => choice, "choice"),
  json: /* @__PURE__ */ __name(() => json, "json"),
  object: /* @__PURE__ */ __name(() => object, "object"),
  text: /* @__PURE__ */ __name(() => text, "text")
});
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  let unicodeEscapeDigits = 0;
  function isHexDigit(char) {
    return char >= "0" && char <= "9" || char >= "A" && char <= "F" || char >= "a" && char <= "f";
  }
  __name(isHexDigit, "isHexDigit");
  function processValueStart(char, i, swapState) {
    {
      switch (char) {
        case '"': {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_STRING");
          break;
        }
        case "f":
        case "t":
        case "n": {
          lastValidIndex = i;
          literalStart = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_LITERAL");
          break;
        }
        case "-": {
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "{": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_OBJECT_START");
          break;
        }
        case "[": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_ARRAY_START");
          break;
        }
      }
    }
  }
  __name(processValueStart, "processValueStart");
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  __name(processAfterObjectValue, "processAfterObjectValue");
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  __name(processAfterArrayValue, "processAfterArrayValue");
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        if (char === "u") {
          unicodeEscapeDigits = 0;
          stack.push("INSIDE_STRING_UNICODE_ESCAPE");
        } else {
          lastValidIndex = i;
        }
        break;
      }
      case "INSIDE_STRING_UNICODE_ESCAPE": {
        if (isHexDigit(char)) {
          unicodeEscapeDigits++;
          if (unicodeEscapeDigits === 4) {
            stack.pop();
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return result;
}
__name(fixJson, "fixJson");
async function parsePartialJson(jsonText) {
  if (jsonText === void 0) {
    return { value: void 0, state: "undefined-input" };
  }
  let result = await safeParseJSON({ text: jsonText });
  if (result.success) {
    return { value: result.value, state: "successful-parse" };
  }
  result = await safeParseJSON({ text: fixJson(jsonText) });
  if (result.success) {
    return { value: result.value, state: "repaired-parse" };
  }
  return { value: void 0, state: "failed-parse" };
}
__name(parsePartialJson, "parsePartialJson");
var text = /* @__PURE__ */ __name(() => ({
  name: "text",
  responseFormat: Promise.resolve({ type: "text" }),
  async parseCompleteOutput({ text: text2 }) {
    return text2;
  },
  async parsePartialOutput({ text: text2 }) {
    return { partial: text2 };
  },
  createElementStreamTransform() {
    return void 0;
  }
}), "text");
var object = /* @__PURE__ */ __name(({
  schema: inputSchema,
  name: name222,
  description
}) => {
  const schema = asSchema(inputSchema);
  return {
    name: "object",
    responseFormat: resolve(schema.jsonSchema).then((jsonSchema2) => ({
      type: "json",
      schema: jsonSchema2,
      ...name222 != null && { name: name222 },
      ...description != null && { description }
    })),
    async parseCompleteOutput({ text: text2 }, context) {
      const parseResult = await safeParseJSON({ text: text2 });
      if (!parseResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: could not parse the response.",
          cause: parseResult.error,
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      const validationResult = await safeValidateTypes({
        value: parseResult.value,
        schema
      });
      if (!validationResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: response did not match schema.",
          cause: validationResult.error,
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      return validationResult.value;
    },
    async parsePartialOutput({ text: text2 }) {
      const result = await parsePartialJson(text2);
      switch (result.state) {
        case "failed-parse":
        case "undefined-input": {
          return void 0;
        }
        case "repaired-parse":
        case "successful-parse": {
          return {
            // Note: currently no validation of partial results:
            partial: result.value
          };
        }
      }
    },
    createElementStreamTransform() {
      return void 0;
    }
  };
}, "object");
var array = /* @__PURE__ */ __name(({
  element: inputElementSchema,
  name: name222,
  description
}) => {
  const elementSchema = asSchema(inputElementSchema);
  return {
    name: "array",
    // JSON schema that describes an array of elements:
    responseFormat: resolve(elementSchema.jsonSchema).then((jsonSchema2) => {
      const { $schema: _$schema, ...itemSchema } = jsonSchema2;
      return {
        type: "json",
        schema: {
          $schema: "http://json-schema.org/draft-07/schema#",
          type: "object",
          properties: {
            elements: { type: "array", items: itemSchema }
          },
          required: ["elements"],
          additionalProperties: false
        },
        ...name222 != null && { name: name222 },
        ...description != null && { description }
      };
    }),
    async parseCompleteOutput({ text: text2 }, context) {
      const parseResult = await safeParseJSON({ text: text2 });
      if (!parseResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: could not parse the response.",
          cause: parseResult.error,
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      const outerValue = parseResult.value;
      if (outerValue == null || typeof outerValue !== "object" || !("elements" in outerValue) || !Array.isArray(outerValue.elements)) {
        throw new NoObjectGeneratedError({
          message: "No object generated: response did not match schema.",
          cause: new TypeValidationError({
            value: outerValue,
            cause: "response must be an object with an elements array"
          }),
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      const validatedElements = [];
      for (const element of outerValue.elements) {
        const validationResult = await safeValidateTypes({
          value: element,
          schema: elementSchema
        });
        if (!validationResult.success) {
          throw new NoObjectGeneratedError({
            message: "No object generated: response did not match schema.",
            cause: validationResult.error,
            text: text2,
            response: context.response,
            usage: context.usage,
            finishReason: context.finishReason
          });
        }
        validatedElements.push(validationResult.value);
      }
      return validatedElements;
    },
    async parsePartialOutput({ text: text2 }) {
      const result = await parsePartialJson(text2);
      switch (result.state) {
        case "failed-parse":
        case "undefined-input": {
          return void 0;
        }
        case "repaired-parse":
        case "successful-parse": {
          const outerValue = result.value;
          if (outerValue == null || typeof outerValue !== "object" || !("elements" in outerValue) || !Array.isArray(outerValue.elements)) {
            return void 0;
          }
          const rawElements = result.state === "repaired-parse" && outerValue.elements.length > 0 ? outerValue.elements.slice(0, -1) : outerValue.elements;
          const parsedElements = [];
          for (const rawElement of rawElements) {
            const validationResult = await safeValidateTypes({
              value: rawElement,
              schema: elementSchema
            });
            if (validationResult.success) {
              parsedElements.push(validationResult.value);
            }
          }
          return { partial: parsedElements };
        }
      }
    },
    createElementStreamTransform() {
      let publishedElements = 0;
      return new TransformStream({
        transform({ partialOutput }, controller) {
          if (partialOutput != null) {
            for (; publishedElements < partialOutput.length; publishedElements++) {
              controller.enqueue(partialOutput[publishedElements]);
            }
          }
        }
      });
    }
  };
}, "array");
var choice = /* @__PURE__ */ __name(({
  options: choiceOptions,
  name: name222,
  description
}) => {
  return {
    name: "choice",
    // JSON schema that describes an enumeration:
    responseFormat: Promise.resolve({
      type: "json",
      schema: {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          result: { type: "string", enum: choiceOptions }
        },
        required: ["result"],
        additionalProperties: false
      },
      ...name222 != null && { name: name222 },
      ...description != null && { description }
    }),
    async parseCompleteOutput({ text: text2 }, context) {
      const parseResult = await safeParseJSON({ text: text2 });
      if (!parseResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: could not parse the response.",
          cause: parseResult.error,
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      const outerValue = parseResult.value;
      if (outerValue == null || typeof outerValue !== "object" || !("result" in outerValue) || typeof outerValue.result !== "string" || !choiceOptions.includes(outerValue.result)) {
        throw new NoObjectGeneratedError({
          message: "No object generated: response did not match schema.",
          cause: new TypeValidationError({
            value: outerValue,
            cause: "response must be an object that contains a choice value."
          }),
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      return outerValue.result;
    },
    async parsePartialOutput({ text: text2 }) {
      const result = await parsePartialJson(text2);
      switch (result.state) {
        case "failed-parse":
        case "undefined-input": {
          return void 0;
        }
        case "repaired-parse":
        case "successful-parse": {
          const outerValue = result.value;
          if (outerValue == null || typeof outerValue !== "object" || !("result" in outerValue) || typeof outerValue.result !== "string") {
            return void 0;
          }
          const potentialMatches = choiceOptions.filter(
            (choiceOption) => choiceOption.startsWith(outerValue.result)
          );
          if (result.state === "successful-parse") {
            return potentialMatches.includes(outerValue.result) ? { partial: outerValue.result } : void 0;
          } else {
            return potentialMatches.length === 1 ? { partial: potentialMatches[0] } : void 0;
          }
        }
      }
    },
    createElementStreamTransform() {
      return void 0;
    }
  };
}, "choice");
var json = /* @__PURE__ */ __name(({
  name: name222,
  description
} = {}) => {
  return {
    name: "json",
    responseFormat: Promise.resolve({
      type: "json",
      ...name222 != null && { name: name222 },
      ...description != null && { description }
    }),
    async parseCompleteOutput({ text: text2 }, context) {
      const parseResult = await safeParseJSON({ text: text2 });
      if (!parseResult.success) {
        throw new NoObjectGeneratedError({
          message: "No object generated: could not parse the response.",
          cause: parseResult.error,
          text: text2,
          response: context.response,
          usage: context.usage,
          finishReason: context.finishReason
        });
      }
      return parseResult.value;
    },
    async parsePartialOutput({ text: text2 }) {
      const result = await parsePartialJson(text2);
      switch (result.state) {
        case "failed-parse":
        case "undefined-input": {
          return void 0;
        }
        case "repaired-parse":
        case "successful-parse": {
          return result.value === void 0 ? void 0 : { partial: result.value };
        }
      }
    },
    createElementStreamTransform() {
      return void 0;
    }
  };
}, "json");
function mergeCallbacks(...callbacks) {
  return async (event) => {
    await Promise.allSettled(
      callbacks.map(async (callback) => {
        await (callback == null ? void 0 : callback(event));
      })
    );
  };
}
__name(mergeCallbacks, "mergeCallbacks");
var AI_SDK_TELEMETRY_TRACING_CHANNEL = "ai:telemetry";
function isNodeRuntime() {
  var _a222;
  return typeof process !== "undefined" && ((_a222 = process.release) == null ? void 0 : _a222.name) === "node";
}
__name(isNodeRuntime, "isNodeRuntime");
var diagnosticsChannelPromise;
async function loadDiagnosticsChannel() {
  if (!isNodeRuntime()) {
    return void 0;
  }
  if (diagnosticsChannelPromise == null) {
    diagnosticsChannelPromise = Promise.resolve(
      loadBuiltinModule("node:diagnostics_channel")
    );
  }
  return diagnosticsChannelPromise;
}
__name(loadDiagnosticsChannel, "loadDiagnosticsChannel");
function loadBuiltinModule(id) {
  var _a222;
  const processWithBuiltins = globalThis.process;
  try {
    return (_a222 = processWithBuiltins == null ? void 0 : processWithBuiltins.getBuiltinModule) == null ? void 0 : _a222.call(processWithBuiltins, id);
  } catch (e) {
    return void 0;
  }
}
__name(loadBuiltinModule, "loadBuiltinModule");
async function runWithTracingChannelSpan(message, execute) {
  var _a222;
  const diagnosticsChannel = await loadDiagnosticsChannel();
  const tracingChannel = (_a222 = diagnosticsChannel == null ? void 0 : diagnosticsChannel.tracingChannel) == null ? void 0 : _a222.call(
    diagnosticsChannel,
    AI_SDK_TELEMETRY_TRACING_CHANNEL
  );
  if (tracingChannel == null || tracingChannel.hasSubscribers === false) {
    return await execute();
  }
  let executePromise;
  let executionResult;
  let executionError;
  let hasExecutionResult = false;
  let hasExecutionError = false;
  const tracedExecute = /* @__PURE__ */ __name(() => {
    try {
      executePromise = Promise.resolve(execute());
    } catch (error) {
      executePromise = Promise.reject(error);
    }
    executePromise = executePromise.then(
      (result) => {
        executionResult = result;
        hasExecutionResult = true;
        return result;
      },
      (error) => {
        executionError = error;
        hasExecutionError = true;
        throw error;
      }
    );
    return executePromise;
  }, "tracedExecute");
  try {
    return await tracingChannel.tracePromise(tracedExecute, message);
  } catch (e) {
    if (hasExecutionError) {
      throw executionError;
    }
    if (hasExecutionResult) {
      return executionResult;
    }
    if (executePromise != null) {
      return await executePromise;
    }
    return await execute();
  }
}
__name(runWithTracingChannelSpan, "runWithTracingChannelSpan");
function openTelemetryChannelSpanContext({
  message,
  completion
}) {
  var _a222;
  if (!isNodeRuntime()) {
    return void 0;
  }
  const diagnosticsChannel = loadBuiltinModule(
    "node:diagnostics_channel"
  );
  const asyncHooks = loadBuiltinModule("node:async_hooks");
  const tracingChannel = (_a222 = diagnosticsChannel == null ? void 0 : diagnosticsChannel.tracingChannel) == null ? void 0 : _a222.call(
    diagnosticsChannel,
    AI_SDK_TELEMETRY_TRACING_CHANNEL
  );
  if (tracingChannel == null || tracingChannel.hasSubscribers === false || asyncHooks == null) {
    Promise.resolve(completion).catch(() => {
    });
    return void 0;
  }
  const context = message;
  let asyncResource;
  let asyncEndPublished = false;
  const safePublish = /* @__PURE__ */ __name((publish) => {
    try {
      publish();
    } catch (e) {
    }
  }, "safePublish");
  const publishAsyncEnd = /* @__PURE__ */ __name(({
    result,
    error
  }) => {
    if (asyncEndPublished) {
      return;
    }
    asyncEndPublished = true;
    if (error !== void 0) {
      context.error = error;
      safePublish(() => tracingChannel.error.publish(context));
    }
    if (result !== void 0) {
      context.result = result;
    }
    safePublish(() => tracingChannel.asyncEnd.publish(context));
  }, "publishAsyncEnd");
  safePublish(() => {
    tracingChannel.start.runStores(context, () => {
      asyncResource = new asyncHooks.AsyncResource("ai.telemetry");
    });
  });
  safePublish(() => tracingChannel.end.publish(context));
  void Promise.resolve(completion).then(
    (result) => publishAsyncEnd({ result }),
    (error) => publishAsyncEnd({ error })
  );
  return {
    run: /* @__PURE__ */ __name((execute) => asyncResource == null ? execute() : asyncResource.runInAsyncScope(execute), "run")
  };
}
__name(openTelemetryChannelSpanContext, "openTelemetryChannelSpanContext");
function getGlobalTelemetryIntegrations() {
  var _a222;
  return (_a222 = globalThis.AI_SDK_TELEMETRY_INTEGRATIONS) != null ? _a222 : [];
}
__name(getGlobalTelemetryIntegrations, "getGlobalTelemetryIntegrations");
function augmentEvent(event, telemetry) {
  return Object.assign(
    Object.create(Object.getPrototypeOf(event)),
    event,
    telemetry
  );
}
__name(augmentEvent, "augmentEvent");
function createTelemetryDispatcher({
  telemetry
}) {
  if ((telemetry == null ? void 0 : telemetry.isEnabled) === false) {
    return {};
  }
  const localIntegrations = telemetry == null ? void 0 : telemetry.integrations;
  const integrations = localIntegrations != null ? asArray(localIntegrations) : getGlobalTelemetryIntegrations();
  const telemetryMetadata = {
    recordInputs: telemetry == null ? void 0 : telemetry.recordInputs,
    recordOutputs: telemetry == null ? void 0 : telemetry.recordOutputs,
    functionId: telemetry == null ? void 0 : telemetry.functionId
  };
  const mergeTelemetryCallback = /* @__PURE__ */ __name((key) => {
    const integrationCallbacks = integrations.map((integration) => {
      var _a222;
      return (_a222 = integration[key]) == null ? void 0 : _a222.bind(integration);
    }).filter(Boolean).map(
      (callback) => (event) => callback(augmentEvent(event, telemetryMetadata))
    );
    const mergedIntegrationCallback = mergeCallbacks(...integrationCallbacks);
    return async (event) => {
      await mergedIntegrationCallback(event);
    };
  }, "mergeTelemetryCallback");
  const executeLanguageModelCallWrappers = integrations.map((integration) => {
    var _a222;
    return (_a222 = integration.executeLanguageModelCall) == null ? void 0 : _a222.bind(integration);
  }).filter(Boolean);
  const executeToolWrappers = integrations.map((integration) => {
    var _a222;
    return (_a222 = integration.executeTool) == null ? void 0 : _a222.bind(integration);
  }).filter(Boolean);
  return {
    runInTracingChannelSpan: /* @__PURE__ */ __name(async ({ type, event, execute }) => await runWithTracingChannelSpan(
      {
        type,
        event: augmentEvent(event, telemetryMetadata)
      },
      execute
    ), "runInTracingChannelSpan"),
    startTracingChannelContext: /* @__PURE__ */ __name(({ type, event, completion }) => openTelemetryChannelSpanContext({
      message: {
        type,
        event: augmentEvent(event, telemetryMetadata)
      },
      completion
    }), "startTracingChannelContext"),
    onStart: mergeTelemetryCallback("onStart"),
    onStepStart: mergeTelemetryCallback("onStepStart"),
    onLanguageModelCallStart: mergeTelemetryCallback(
      "onLanguageModelCallStart"
    ),
    onLanguageModelCallEnd: mergeTelemetryCallback("onLanguageModelCallEnd"),
    onToolExecutionStart: mergeTelemetryCallback("onToolExecutionStart"),
    onToolExecutionEnd: mergeTelemetryCallback("onToolExecutionEnd"),
    // Fan out step-end events to both the new `onStepEnd` callback and the
    // deprecated `onStepFinish` callback so integrations that still implement
    // only `onStepFinish` keep receiving step-end events during the deprecation
    // window.
    onStepEnd: mergeCallbacks(
      mergeTelemetryCallback("onStepEnd"),
      mergeTelemetryCallback("onStepFinish")
    ),
    onObjectStepStart: mergeTelemetryCallback("onObjectStepStart"),
    onObjectStepEnd: mergeTelemetryCallback("onObjectStepEnd"),
    onEmbedStart: mergeTelemetryCallback("onEmbedStart"),
    onEmbedEnd: mergeTelemetryCallback("onEmbedEnd"),
    onRerankStart: mergeTelemetryCallback("onRerankStart"),
    onRerankEnd: mergeTelemetryCallback("onRerankEnd"),
    onEnd: mergeTelemetryCallback("onEnd"),
    onAbort: mergeTelemetryCallback("onAbort"),
    onError: mergeTelemetryCallback("onError"),
    /**
     * Runs provider calls inside integration-specific context so
     * auto-instrumented provider requests can be associated with model work.
     */
    executeLanguageModelCall: /* @__PURE__ */ __name(async ({ execute, ...event }) => {
      const augmentedEvent = augmentEvent(event, telemetryMetadata);
      let wrappedExecute = execute;
      for (const executeWrapper of executeLanguageModelCallWrappers) {
        const innerExecute = wrappedExecute;
        wrappedExecute = /* @__PURE__ */ __name(() => executeWrapper({ ...augmentedEvent, execute: innerExecute }), "wrappedExecute");
      }
      return await runWithTracingChannelSpan(
        { type: "languageModelCall", event: augmentedEvent },
        wrappedExecute
      );
    }, "executeLanguageModelCall"),
    /**
     * Composes all `executeTool` wrappers around the original tool execution.
     * Each wrapper receives an `execute` function that calls the next wrapper in
     * the chain, so integrations can establish nested telemetry context before
     * delegating to the underlying tool.
     */
    executeTool: /* @__PURE__ */ __name(async ({ execute, ...event }) => {
      const augmentedEvent = augmentEvent(event, telemetryMetadata);
      let wrappedExecute = execute;
      for (const executeWrapper of executeToolWrappers) {
        const innerExecute = wrappedExecute;
        wrappedExecute = /* @__PURE__ */ __name(() => executeWrapper({ ...augmentedEvent, execute: innerExecute }), "wrappedExecute");
      }
      return await wrappedExecute();
    }, "executeTool")
  };
}
__name(createTelemetryDispatcher, "createTelemetryDispatcher");
var encoder = new TextEncoder();
var encoder2 = new TextEncoder();
var originalGenerateId = createIdGenerator({
  prefix: "aitxt",
  size: 24
});
var originalGenerateCallId = createIdGenerator({
  prefix: "call",
  size: 24
});
function prepareHeaders(headers, defaultHeaders) {
  const responseHeaders = new Headers(headers != null ? headers : {});
  for (const [key, value] of Object.entries(defaultHeaders)) {
    if (!responseHeaders.has(key)) {
      responseHeaders.set(key, value);
    }
  }
  return responseHeaders;
}
__name(prepareHeaders, "prepareHeaders");
function createTextStreamResponse({
  status,
  statusText,
  headers,
  stream
}) {
  return new Response(stream.pipeThrough(new TextEncoderStream()), {
    status: status != null ? status : 200,
    statusText,
    headers: prepareHeaders(headers, {
      "content-type": "text/plain; charset=utf-8"
    })
  });
}
__name(createTextStreamResponse, "createTextStreamResponse");
function writeToServerResponse({
  response,
  status,
  statusText,
  headers,
  stream
}) {
  const statusCode = status != null ? status : 200;
  if (statusText !== void 0) {
    response.writeHead(statusCode, statusText, headers);
  } else {
    response.writeHead(statusCode, headers);
  }
  const reader = stream.getReader();
  const read = /* @__PURE__ */ __name(async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        const canContinue = response.write(value);
        const flush = response.flush;
        if (typeof flush === "function") {
          flush.call(response);
        }
        if (!canContinue) {
          await new Promise((resolve3) => {
            response.once("drain", resolve3);
          });
        }
      }
    } catch (error) {
      throw error;
    } finally {
      response.end();
    }
  }, "read");
  read();
}
__name(writeToServerResponse, "writeToServerResponse");
function pipeTextStreamToResponse({
  response,
  status,
  statusText,
  headers,
  stream
}) {
  writeToServerResponse({
    response,
    status,
    statusText,
    headers: Object.fromEntries(
      prepareHeaders(headers, {
        "content-type": "text/plain; charset=utf-8"
      }).entries()
    ),
    stream: stream.pipeThrough(new TextEncoderStream())
  });
}
__name(pipeTextStreamToResponse, "pipeTextStreamToResponse");
var JsonToSseTransformStream = class extends TransformStream {
  static {
    __name(this, "JsonToSseTransformStream");
  }
  constructor() {
    super({
      transform(part, controller) {
        controller.enqueue(`data: ${JSON.stringify(part)}

`);
      },
      flush(controller) {
        controller.enqueue("data: [DONE]\n\n");
      }
    });
  }
};
var toolMetadataSchema = external_exports.record(
  external_exports.string(),
  jsonValueSchema.optional()
);
var uiMessageChunkSchema = lazySchema(
  () => zodSchema(
    external_exports.union([
      external_exports.strictObject({
        type: external_exports.literal("text-start"),
        id: external_exports.string(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("text-delta"),
        id: external_exports.string(),
        delta: external_exports.string(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("text-end"),
        id: external_exports.string(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("error"),
        errorText: external_exports.string()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-input-start"),
        toolCallId: external_exports.string(),
        toolName: external_exports.string(),
        providerExecuted: external_exports.boolean().optional(),
        providerMetadata: providerMetadataSchema.optional(),
        toolMetadata: toolMetadataSchema.optional(),
        dynamic: external_exports.boolean().optional(),
        title: external_exports.string().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-input-delta"),
        toolCallId: external_exports.string(),
        inputTextDelta: external_exports.string()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-input-available"),
        toolCallId: external_exports.string(),
        toolName: external_exports.string(),
        input: external_exports.unknown(),
        providerExecuted: external_exports.boolean().optional(),
        providerMetadata: providerMetadataSchema.optional(),
        toolMetadata: toolMetadataSchema.optional(),
        dynamic: external_exports.boolean().optional(),
        title: external_exports.string().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-input-error"),
        toolCallId: external_exports.string(),
        toolName: external_exports.string(),
        input: external_exports.unknown(),
        providerExecuted: external_exports.boolean().optional(),
        providerMetadata: providerMetadataSchema.optional(),
        toolMetadata: toolMetadataSchema.optional(),
        dynamic: external_exports.boolean().optional(),
        errorText: external_exports.string(),
        title: external_exports.string().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-approval-request"),
        approvalId: external_exports.string(),
        toolCallId: external_exports.string(),
        isAutomatic: external_exports.boolean().optional(),
        signature: external_exports.string().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-approval-response"),
        approvalId: external_exports.string(),
        approved: external_exports.boolean(),
        reason: external_exports.string().optional(),
        providerExecuted: external_exports.boolean().optional(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-output-available"),
        toolCallId: external_exports.string(),
        output: external_exports.unknown(),
        providerExecuted: external_exports.boolean().optional(),
        providerMetadata: providerMetadataSchema.optional(),
        toolMetadata: toolMetadataSchema.optional(),
        dynamic: external_exports.boolean().optional(),
        preliminary: external_exports.boolean().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-output-error"),
        toolCallId: external_exports.string(),
        errorText: external_exports.string(),
        providerExecuted: external_exports.boolean().optional(),
        providerMetadata: providerMetadataSchema.optional(),
        toolMetadata: toolMetadataSchema.optional(),
        dynamic: external_exports.boolean().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("tool-output-denied"),
        toolCallId: external_exports.string()
      }),
      external_exports.strictObject({
        type: external_exports.literal("reasoning-start"),
        id: external_exports.string(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("reasoning-delta"),
        id: external_exports.string(),
        delta: external_exports.string(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("reasoning-end"),
        id: external_exports.string(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("custom"),
        kind: external_exports.string().transform((value) => value),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("source-url"),
        sourceId: external_exports.string(),
        url: external_exports.string(),
        title: external_exports.string().optional(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("source-document"),
        sourceId: external_exports.string(),
        mediaType: external_exports.string(),
        title: external_exports.string(),
        filename: external_exports.string().optional(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("file"),
        url: external_exports.string(),
        mediaType: external_exports.string(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("reasoning-file"),
        url: external_exports.string(),
        mediaType: external_exports.string(),
        providerMetadata: providerMetadataSchema.optional()
      }),
      external_exports.strictObject({
        type: external_exports.custom(
          (value) => typeof value === "string" && value.startsWith("data-"),
          { message: 'Type must start with "data-"' }
        ),
        id: external_exports.string().optional(),
        data: external_exports.unknown(),
        transient: external_exports.boolean().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("start-step")
      }),
      external_exports.strictObject({
        type: external_exports.literal("finish-step")
      }),
      external_exports.strictObject({
        type: external_exports.literal("start"),
        messageId: external_exports.string().optional(),
        messageMetadata: external_exports.unknown().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("finish"),
        finishReason: external_exports.enum([
          "stop",
          "length",
          "content-filter",
          "tool-calls",
          "error",
          "other"
        ]).optional(),
        messageMetadata: external_exports.unknown().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("abort"),
        reason: external_exports.string().optional()
      }),
      external_exports.strictObject({
        type: external_exports.literal("message-metadata"),
        messageMetadata: external_exports.unknown()
      })
    ])
  )
);
function createAsyncIterableStream(source) {
  return asAsyncIterableStream(source.pipeThrough(new TransformStream()));
}
__name(createAsyncIterableStream, "createAsyncIterableStream");
function asAsyncIterableStream(stream) {
  stream[Symbol.asyncIterator] = function() {
    const reader = this.getReader();
    let finished = false;
    async function cleanup(cancelStream) {
      var _a222;
      if (finished)
        return;
      finished = true;
      try {
        if (cancelStream) {
          await ((_a222 = reader.cancel) == null ? void 0 : _a222.call(reader));
        }
      } finally {
        try {
          reader.releaseLock();
        } catch (e) {
        }
      }
    }
    __name(cleanup, "cleanup");
    return {
      /**
       * Reads the next chunk from the stream.
       * @returns A promise resolving to the next IteratorResult.
       */
      async next() {
        if (finished) {
          return { done: true, value: void 0 };
        }
        const { done, value } = await reader.read();
        if (done) {
          await cleanup(true);
          return { done: true, value: void 0 };
        }
        return { done: false, value };
      },
      /**
       * May be called on early exit (e.g., break from for-await) or after completion.
       * Ensures the stream is cancelled and resources are released.
       * @returns A promise resolving to a completed IteratorResult.
       */
      async return() {
        await cleanup(true);
        return { done: true, value: void 0 };
      },
      /**
       * Called on early exit with error.
       * Ensures the stream is cancelled and resources are released, then rethrows the error.
       * @param err The error to throw.
       * @returns A promise that rejects with the provided error.
       */
      async throw(err) {
        await cleanup(true);
        throw err;
      }
    };
  };
  return stream;
}
__name(asAsyncIterableStream, "asAsyncIterableStream");
function createResolvablePromise() {
  let resolve3;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve3 = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve3,
    reject
  };
}
__name(createResolvablePromise, "createResolvablePromise");
function createStitchableStream() {
  let innerStreamReaders = [];
  let controller = null;
  let isClosed = false;
  let waitForNewStream = createResolvablePromise();
  const terminate = /* @__PURE__ */ __name(() => {
    isClosed = true;
    waitForNewStream.resolve();
    innerStreamReaders.forEach((reader) => reader.cancel());
    innerStreamReaders = [];
    controller == null ? void 0 : controller.close();
  }, "terminate");
  const processPull = /* @__PURE__ */ __name(async () => {
    if (isClosed && innerStreamReaders.length === 0) {
      controller == null ? void 0 : controller.close();
      return;
    }
    if (innerStreamReaders.length === 0) {
      waitForNewStream = createResolvablePromise();
      await waitForNewStream.promise;
      return await processPull();
    }
    try {
      const { value, done } = await innerStreamReaders[0].read();
      if (done) {
        innerStreamReaders.shift();
        if (innerStreamReaders.length === 0 && isClosed) {
          controller == null ? void 0 : controller.close();
        } else {
          await processPull();
        }
      } else {
        controller == null ? void 0 : controller.enqueue(value);
      }
    } catch (error) {
      controller == null ? void 0 : controller.error(error);
      innerStreamReaders.shift();
      terminate();
    }
  }, "processPull");
  return {
    stream: new ReadableStream({
      start(controllerParam) {
        controller = controllerParam;
      },
      pull: processPull,
      async cancel() {
        for (const reader of innerStreamReaders) {
          await reader.cancel();
        }
        innerStreamReaders = [];
        isClosed = true;
      }
    }),
    addStream: /* @__PURE__ */ __name((innerStream) => {
      if (isClosed) {
        throw new Error("Cannot add inner stream: outer stream is closed");
      }
      innerStreamReaders.push(innerStream.getReader());
      waitForNewStream.resolve();
    }, "addStream"),
    /**
     * Gracefully close the outer stream. This will let the inner streams
     * finish processing and then close the outer stream.
     */
    close: /* @__PURE__ */ __name(() => {
      isClosed = true;
      waitForNewStream.resolve();
      if (innerStreamReaders.length === 0) {
        controller == null ? void 0 : controller.close();
      }
    }, "close"),
    /**
     * Immediately close the outer stream. This will cancel all inner streams
     * and close the outer stream.
     */
    terminate
  };
}
__name(createStitchableStream, "createStitchableStream");
var originalGenerateId2 = createIdGenerator({
  prefix: "aitxt",
  size: 24
});
var originalGenerateCallId2 = createIdGenerator({
  prefix: "call",
  size: 24
});
var originalGenerateId3 = createIdGenerator({
  prefix: "aitxt",
  size: 24
});
var originalGenerateCallId3 = createIdGenerator({
  prefix: "call",
  size: 24
});
var toolMetadataSchema2 = external_exports.record(
  external_exports.string(),
  jsonValueSchema.optional()
);
var providerReferenceSchema2 = external_exports.record(external_exports.string(), external_exports.string());
var uiMessagesSchema = lazySchema(
  () => zodSchema(
    external_exports.array(
      external_exports.object({
        id: external_exports.string(),
        role: external_exports.enum(["system", "user", "assistant"]),
        metadata: external_exports.unknown().optional(),
        parts: external_exports.array(
          external_exports.union([
            external_exports.object({
              type: external_exports.literal("text"),
              text: external_exports.string(),
              state: external_exports.enum(["streaming", "done"]).optional(),
              providerMetadata: providerMetadataSchema.optional()
            }),
            external_exports.object({
              type: external_exports.literal("reasoning"),
              text: external_exports.string(),
              state: external_exports.enum(["streaming", "done"]).optional(),
              providerMetadata: providerMetadataSchema.optional()
            }),
            external_exports.object({
              type: external_exports.literal("custom"),
              kind: external_exports.string(),
              providerMetadata: providerMetadataSchema.optional()
            }),
            external_exports.object({
              type: external_exports.literal("source-url"),
              sourceId: external_exports.string(),
              url: external_exports.string(),
              title: external_exports.string().optional(),
              providerMetadata: providerMetadataSchema.optional()
            }),
            external_exports.object({
              type: external_exports.literal("source-document"),
              sourceId: external_exports.string(),
              mediaType: external_exports.string(),
              title: external_exports.string(),
              filename: external_exports.string().optional(),
              providerMetadata: providerMetadataSchema.optional()
            }),
            external_exports.object({
              type: external_exports.literal("file"),
              mediaType: external_exports.string(),
              filename: external_exports.string().optional(),
              url: external_exports.string(),
              providerReference: providerReferenceSchema2.optional(),
              providerMetadata: providerMetadataSchema.optional()
            }),
            external_exports.object({
              type: external_exports.literal("reasoning-file"),
              mediaType: external_exports.string(),
              url: external_exports.string(),
              providerMetadata: providerMetadataSchema.optional()
            }),
            external_exports.object({
              type: external_exports.literal("step-start")
            }),
            external_exports.object({
              type: external_exports.string().startsWith("data-"),
              id: external_exports.string().optional(),
              data: external_exports.unknown()
            }),
            external_exports.object({
              type: external_exports.literal("dynamic-tool"),
              toolName: external_exports.string(),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("input-streaming"),
              input: external_exports.unknown().optional(),
              providerExecuted: external_exports.boolean().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              approval: external_exports.never().optional()
            }),
            external_exports.object({
              type: external_exports.literal("dynamic-tool"),
              toolName: external_exports.string(),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("input-available"),
              input: external_exports.unknown(),
              providerExecuted: external_exports.boolean().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.never().optional()
            }),
            external_exports.object({
              type: external_exports.literal("dynamic-tool"),
              toolName: external_exports.string(),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("approval-requested"),
              input: external_exports.unknown(),
              providerExecuted: external_exports.boolean().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.never().optional(),
                reason: external_exports.never().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              })
            }),
            external_exports.object({
              type: external_exports.literal("dynamic-tool"),
              toolName: external_exports.string(),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("approval-responded"),
              input: external_exports.unknown(),
              providerExecuted: external_exports.boolean().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.boolean(),
                reason: external_exports.string().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              })
            }),
            external_exports.object({
              type: external_exports.literal("dynamic-tool"),
              toolName: external_exports.string(),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("output-available"),
              input: external_exports.unknown(),
              providerExecuted: external_exports.boolean().optional(),
              output: external_exports.unknown(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              resultProviderMetadata: providerMetadataSchema.optional(),
              preliminary: external_exports.boolean().optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.literal(true),
                reason: external_exports.string().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              }).optional()
            }),
            external_exports.object({
              type: external_exports.literal("dynamic-tool"),
              toolName: external_exports.string(),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("output-error"),
              input: external_exports.unknown().optional(),
              rawInput: external_exports.unknown().optional(),
              providerExecuted: external_exports.boolean().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.string(),
              callProviderMetadata: providerMetadataSchema.optional(),
              resultProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.literal(true),
                reason: external_exports.string().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              }).optional()
            }),
            external_exports.object({
              type: external_exports.literal("dynamic-tool"),
              toolName: external_exports.string(),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("output-denied"),
              input: external_exports.unknown(),
              providerExecuted: external_exports.boolean().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.literal(false),
                reason: external_exports.string().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              })
            }),
            external_exports.object({
              type: external_exports.string().startsWith("tool-"),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("input-streaming"),
              providerExecuted: external_exports.boolean().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              input: external_exports.unknown().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              approval: external_exports.never().optional()
            }),
            external_exports.object({
              type: external_exports.string().startsWith("tool-"),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("input-available"),
              providerExecuted: external_exports.boolean().optional(),
              input: external_exports.unknown(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.never().optional()
            }),
            external_exports.object({
              type: external_exports.string().startsWith("tool-"),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("approval-requested"),
              input: external_exports.unknown(),
              providerExecuted: external_exports.boolean().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.never().optional(),
                reason: external_exports.never().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              })
            }),
            external_exports.object({
              type: external_exports.string().startsWith("tool-"),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("approval-responded"),
              input: external_exports.unknown(),
              providerExecuted: external_exports.boolean().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.boolean(),
                reason: external_exports.string().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              })
            }),
            external_exports.object({
              type: external_exports.string().startsWith("tool-"),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("output-available"),
              providerExecuted: external_exports.boolean().optional(),
              input: external_exports.unknown(),
              output: external_exports.unknown(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              resultProviderMetadata: providerMetadataSchema.optional(),
              preliminary: external_exports.boolean().optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.literal(true),
                reason: external_exports.string().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              }).optional()
            }),
            external_exports.object({
              type: external_exports.string().startsWith("tool-"),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("output-error"),
              providerExecuted: external_exports.boolean().optional(),
              input: external_exports.unknown().optional(),
              rawInput: external_exports.unknown().optional(),
              output: external_exports.never().optional(),
              errorText: external_exports.string(),
              callProviderMetadata: providerMetadataSchema.optional(),
              resultProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.literal(true),
                reason: external_exports.string().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              }).optional()
            }),
            external_exports.object({
              type: external_exports.string().startsWith("tool-"),
              toolCallId: external_exports.string(),
              toolMetadata: toolMetadataSchema2.optional(),
              state: external_exports.literal("output-denied"),
              providerExecuted: external_exports.boolean().optional(),
              input: external_exports.unknown(),
              output: external_exports.never().optional(),
              errorText: external_exports.never().optional(),
              callProviderMetadata: providerMetadataSchema.optional(),
              approval: external_exports.object({
                id: external_exports.string(),
                approved: external_exports.literal(false),
                reason: external_exports.string().optional(),
                isAutomatic: external_exports.boolean().optional(),
                signature: external_exports.string().optional()
              })
            })
          ])
        )
      }).superRefine((message, context) => {
        if (message.role !== "assistant" && message.parts.length === 0) {
          context.addIssue({
            origin: "array",
            code: "too_small",
            minimum: 1,
            inclusive: true,
            input: message.parts,
            path: ["parts"],
            message: "Message must contain at least one part"
          });
        }
      })
    ).nonempty("Messages array must not be empty")
  )
);
var originalGenerateCallId4 = createIdGenerator({
  prefix: "call",
  size: 24
});
var originalGenerateCallId5 = createIdGenerator({
  prefix: "call",
  size: 24
});
function extractReasoningContent(content) {
  const parts = content.filter(
    (content2) => content2.type === "reasoning"
  );
  return parts.length === 0 ? void 0 : parts.map((content2) => content2.text).join("\n");
}
__name(extractReasoningContent, "extractReasoningContent");
function extractTextContent(content) {
  const parts = content.filter(
    (content2) => content2.type === "text"
  );
  if (parts.length === 0) {
    return void 0;
  }
  return parts.map((content2) => content2.text).join("");
}
__name(extractTextContent, "extractTextContent");
var noSchemaOutputStrategy = {
  type: "no-schema",
  jsonSchema: /* @__PURE__ */ __name(async () => void 0, "jsonSchema"),
  async validatePartialResult({ value, textDelta }) {
    return { success: true, value: { partial: value, textDelta } };
  },
  async validateFinalResult(value, context) {
    return value === void 0 ? {
      success: false,
      error: new NoObjectGeneratedError({
        message: "No object generated: response did not match schema.",
        text: context.text,
        response: context.response,
        usage: context.usage,
        finishReason: context.finishReason
      })
    } : { success: true, value };
  },
  createElementStream() {
    throw new UnsupportedFunctionalityError({
      functionality: "element streams in no-schema mode"
    });
  }
};
var objectOutputStrategy = /* @__PURE__ */ __name((schema) => ({
  type: "object",
  jsonSchema: /* @__PURE__ */ __name(async () => await schema.jsonSchema, "jsonSchema"),
  async validatePartialResult({ value, textDelta }) {
    return {
      success: true,
      value: {
        // Note: currently no validation of partial results:
        partial: value,
        textDelta
      }
    };
  },
  async validateFinalResult(value) {
    return safeValidateTypes({ value, schema });
  },
  createElementStream() {
    throw new UnsupportedFunctionalityError({
      functionality: "element streams in object mode"
    });
  }
}), "objectOutputStrategy");
var arrayOutputStrategy = /* @__PURE__ */ __name((schema) => {
  return {
    type: "array",
    // wrap in object that contains array of elements, since most LLMs will not
    // be able to generate an array directly:
    // possible future optimization: use arrays directly when model supports grammar-guided generation
    jsonSchema: /* @__PURE__ */ __name(async () => {
      const { $schema: _$schema, ...itemSchema } = await schema.jsonSchema;
      return {
        $schema: "http://json-schema.org/draft-07/schema#",
        type: "object",
        properties: {
          elements: { type: "array", items: itemSchema }
        },
        required: ["elements"],
        additionalProperties: false
      };
    }, "jsonSchema"),
    async validatePartialResult({
      value,
      latestObject,
      isFirstDelta,
      isFinalDelta
    }) {
      var _a222;
      if (!isJSONObject(value) || !isJSONArray(value.elements)) {
        return {
          success: false,
          error: new TypeValidationError({
            value,
            cause: "value must be an object that contains an array of elements"
          })
        };
      }
      const inputArray = value.elements;
      const resultArray = [];
      for (let i = 0; i < inputArray.length; i++) {
        const element = inputArray[i];
        const result = await safeValidateTypes({ value: element, schema });
        if (i === inputArray.length - 1 && !isFinalDelta) {
          continue;
        }
        if (!result.success) {
          return result;
        }
        resultArray.push(result.value);
      }
      const publishedElementCount = (_a222 = latestObject == null ? void 0 : latestObject.length) != null ? _a222 : 0;
      let textDelta = "";
      if (isFirstDelta) {
        textDelta += "[";
      }
      if (publishedElementCount > 0) {
        textDelta += ",";
      }
      textDelta += resultArray.slice(publishedElementCount).map((element) => JSON.stringify(element)).join(",");
      if (isFinalDelta) {
        textDelta += "]";
      }
      return {
        success: true,
        value: {
          partial: resultArray,
          textDelta
        }
      };
    },
    async validateFinalResult(value) {
      if (!isJSONObject(value) || !isJSONArray(value.elements)) {
        return {
          success: false,
          error: new TypeValidationError({
            value,
            cause: "value must be an object that contains an array of elements"
          })
        };
      }
      const inputArray = value.elements;
      const resultArray = [];
      for (const element of inputArray) {
        const result = await safeValidateTypes({ value: element, schema });
        if (!result.success) {
          return result;
        }
        resultArray.push(result.value);
      }
      return { success: true, value: resultArray };
    },
    createElementStream(originalStream) {
      let publishedElements = 0;
      return createAsyncIterableStream(
        originalStream.pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              switch (chunk.type) {
                case "object": {
                  const array2 = chunk.object;
                  for (; publishedElements < array2.length; publishedElements++) {
                    controller.enqueue(array2[publishedElements]);
                  }
                  break;
                }
                case "text-delta":
                case "finish":
                case "error":
                  break;
                default: {
                  const _exhaustiveCheck = chunk;
                  throw new Error(
                    `Unsupported chunk type: ${_exhaustiveCheck}`
                  );
                }
              }
            }
          })
        )
      );
    }
  };
}, "arrayOutputStrategy");
var enumOutputStrategy = /* @__PURE__ */ __name((enumValues) => {
  return {
    type: "enum",
    // wrap in object that contains result, since most LLMs will not
    // be able to generate an enum value directly:
    // possible future optimization: use enums directly when model supports top-level enums
    jsonSchema: /* @__PURE__ */ __name(async () => ({
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        result: { type: "string", enum: enumValues }
      },
      required: ["result"],
      additionalProperties: false
    }), "jsonSchema"),
    async validateFinalResult(value) {
      if (!isJSONObject(value) || typeof value.result !== "string") {
        return {
          success: false,
          error: new TypeValidationError({
            value,
            cause: 'value must be an object that contains a string in the "result" property.'
          })
        };
      }
      const result = value.result;
      return enumValues.includes(result) ? { success: true, value: result } : {
        success: false,
        error: new TypeValidationError({
          value,
          cause: "value must be a string in the enum"
        })
      };
    },
    async validatePartialResult({ value, textDelta }) {
      if (!isJSONObject(value) || typeof value.result !== "string") {
        return {
          success: false,
          error: new TypeValidationError({
            value,
            cause: 'value must be an object that contains a string in the "result" property.'
          })
        };
      }
      const result = value.result;
      const possibleEnumValues = enumValues.filter(
        (enumValue) => enumValue.startsWith(result)
      );
      if (value.result.length === 0 || possibleEnumValues.length === 0) {
        return {
          success: false,
          error: new TypeValidationError({
            value,
            cause: "value must be a string in the enum"
          })
        };
      }
      return {
        success: true,
        value: {
          partial: possibleEnumValues.length > 1 ? result : possibleEnumValues[0],
          textDelta
        }
      };
    },
    createElementStream() {
      throw new UnsupportedFunctionalityError({
        functionality: "element streams in enum mode"
      });
    }
  };
}, "enumOutputStrategy");
function getOutputStrategy({
  output,
  schema,
  enumValues
}) {
  switch (output) {
    case "object":
      return objectOutputStrategy(asSchema(schema));
    case "array":
      return arrayOutputStrategy(asSchema(schema));
    case "enum":
      return enumOutputStrategy(enumValues);
    case "no-schema":
      return noSchemaOutputStrategy;
    default: {
      const _exhaustiveCheck = output;
      throw new Error(`Unsupported output: ${_exhaustiveCheck}`);
    }
  }
}
__name(getOutputStrategy, "getOutputStrategy");
async function parseAndValidateObjectResult(result, outputStrategy, context) {
  const parseResult = await safeParseJSON({ text: result });
  if (!parseResult.success) {
    throw new NoObjectGeneratedError({
      message: "No object generated: could not parse the response.",
      cause: parseResult.error,
      text: result,
      response: context.response,
      usage: context.usage,
      finishReason: context.finishReason
    });
  }
  const validationResult = await outputStrategy.validateFinalResult(
    parseResult.value,
    {
      text: result,
      response: context.response,
      usage: context.usage
    }
  );
  if (!validationResult.success) {
    throw new NoObjectGeneratedError({
      message: "No object generated: response did not match schema.",
      cause: validationResult.error,
      text: result,
      response: context.response,
      usage: context.usage,
      finishReason: context.finishReason
    });
  }
  return validationResult.value;
}
__name(parseAndValidateObjectResult, "parseAndValidateObjectResult");
async function parseAndValidateObjectResultWithRepair(result, outputStrategy, repairText, context) {
  try {
    return await parseAndValidateObjectResult(result, outputStrategy, context);
  } catch (error) {
    if (repairText != null && NoObjectGeneratedError.isInstance(error) && (JSONParseError.isInstance(error.cause) || TypeValidationError.isInstance(error.cause))) {
      const repairedText = await repairText({
        text: result,
        error: error.cause
      });
      if (repairedText === null) {
        throw error;
      }
      return await parseAndValidateObjectResult(
        repairedText,
        outputStrategy,
        context
      );
    }
    throw error;
  }
}
__name(parseAndValidateObjectResultWithRepair, "parseAndValidateObjectResultWithRepair");
function validateObjectGenerationInput({
  output,
  schema,
  schemaName,
  schemaDescription,
  enumValues
}) {
  if (output != null && output !== "object" && output !== "array" && output !== "enum" && output !== "no-schema") {
    throw new InvalidArgumentError2({
      parameter: "output",
      value: output,
      message: "Invalid output type."
    });
  }
  if (output === "no-schema") {
    if (schema != null) {
      throw new InvalidArgumentError2({
        parameter: "schema",
        value: schema,
        message: "Schema is not supported for no-schema output."
      });
    }
    if (schemaDescription != null) {
      throw new InvalidArgumentError2({
        parameter: "schemaDescription",
        value: schemaDescription,
        message: "Schema description is not supported for no-schema output."
      });
    }
    if (schemaName != null) {
      throw new InvalidArgumentError2({
        parameter: "schemaName",
        value: schemaName,
        message: "Schema name is not supported for no-schema output."
      });
    }
    if (enumValues != null) {
      throw new InvalidArgumentError2({
        parameter: "enumValues",
        value: enumValues,
        message: "Enum values are not supported for no-schema output."
      });
    }
  }
  if (output === "object") {
    if (schema == null) {
      throw new InvalidArgumentError2({
        parameter: "schema",
        value: schema,
        message: "Schema is required for object output."
      });
    }
    if (enumValues != null) {
      throw new InvalidArgumentError2({
        parameter: "enumValues",
        value: enumValues,
        message: "Enum values are not supported for object output."
      });
    }
  }
  if (output === "array") {
    if (schema == null) {
      throw new InvalidArgumentError2({
        parameter: "schema",
        value: schema,
        message: "Element schema is required for array output."
      });
    }
    if (enumValues != null) {
      throw new InvalidArgumentError2({
        parameter: "enumValues",
        value: enumValues,
        message: "Enum values are not supported for array output."
      });
    }
  }
  if (output === "enum") {
    if (schema != null) {
      throw new InvalidArgumentError2({
        parameter: "schema",
        value: schema,
        message: "Schema is not supported for enum output."
      });
    }
    if (schemaDescription != null) {
      throw new InvalidArgumentError2({
        parameter: "schemaDescription",
        value: schemaDescription,
        message: "Schema description is not supported for enum output."
      });
    }
    if (schemaName != null) {
      throw new InvalidArgumentError2({
        parameter: "schemaName",
        value: schemaName,
        message: "Schema name is not supported for enum output."
      });
    }
    if (enumValues == null) {
      throw new InvalidArgumentError2({
        parameter: "enumValues",
        value: enumValues,
        message: "Enum values are required for enum output."
      });
    }
    for (const value of enumValues) {
      if (typeof value !== "string") {
        throw new InvalidArgumentError2({
          parameter: "enumValues",
          value,
          message: "Enum values must be strings."
        });
      }
    }
  }
}
__name(validateObjectGenerationInput, "validateObjectGenerationInput");
var originalGenerateId4 = createIdGenerator({ prefix: "aiobj", size: 24 });
async function generateObject(options) {
  var _a222, _b18, _c, _d, _e, _f, _g, _h, _i, _j;
  const {
    model: modelArg,
    output = "object",
    instructions,
    system,
    prompt,
    messages,
    allowSystemInMessages,
    maxRetries: maxRetriesArg,
    abortSignal,
    headers,
    experimental_repairText: repairText,
    experimental_telemetry,
    telemetry = experimental_telemetry,
    experimental_download: download2,
    providerOptions,
    onStart,
    experimental_onStart,
    onStepStart,
    experimental_onStepStart,
    onStepEnd,
    onStepFinish,
    onFinish,
    _internal: {
      generateId: generateId2 = originalGenerateId4,
      currentDate = /* @__PURE__ */ __name(() => /* @__PURE__ */ new Date(), "currentDate")
    } = {},
    ...settings
  } = options;
  const model = resolveLanguageModel(modelArg);
  const enumValues = "enum" in options ? options.enum : void 0;
  const {
    schema: inputSchema,
    schemaDescription,
    schemaName
  } = "schema" in options ? options : {};
  validateObjectGenerationInput({
    output,
    schema: inputSchema,
    schemaName,
    schemaDescription,
    enumValues
  });
  const { maxRetries, retry } = prepareRetries({
    maxRetries: maxRetriesArg,
    abortSignal
  });
  const outputStrategy = getOutputStrategy({
    output,
    schema: inputSchema,
    enumValues
  });
  const callSettings = prepareLanguageModelCallOptions(settings);
  const headersWithUserAgent = withUserAgentSuffix(
    headers != null ? headers : {},
    `ai/${VERSION3}`
  );
  const telemetryDispatcher = createTelemetryDispatcher({
    telemetry
  });
  const resolvedOnStart = onStart != null ? onStart : experimental_onStart;
  const resolvedOnStepStart = onStepStart != null ? onStepStart : experimental_onStepStart;
  const resolvedOnStepEnd = onStepEnd != null ? onStepEnd : onStepFinish;
  const jsonSchema2 = await outputStrategy.jsonSchema();
  const callId = generateId2();
  await notify({
    event: {
      callId,
      operationId: "ai.generateObject",
      provider: model.provider,
      modelId: model.modelId,
      system: instructions != null ? instructions : system,
      prompt,
      messages,
      maxOutputTokens: callSettings.maxOutputTokens,
      temperature: callSettings.temperature,
      topP: callSettings.topP,
      topK: callSettings.topK,
      presencePenalty: callSettings.presencePenalty,
      frequencyPenalty: callSettings.frequencyPenalty,
      seed: callSettings.seed,
      maxRetries,
      headers: headersWithUserAgent,
      providerOptions,
      output: outputStrategy.type,
      schema: jsonSchema2,
      schemaName,
      schemaDescription
    },
    callbacks: [resolvedOnStart, telemetryDispatcher.onStart]
  });
  try {
    const standardizedPrompt = await standardizePrompt({
      instructions,
      system,
      prompt,
      messages,
      allowSystemInMessages
    });
    const promptMessages = await convertToLanguageModelPrompt({
      prompt: standardizedPrompt,
      supportedUrls: await model.supportedUrls,
      download: download2,
      provider: model.provider.split(".")[0]
    });
    await notify({
      event: {
        callId,
        stepNumber: 0,
        provider: model.provider,
        modelId: model.modelId,
        providerOptions,
        headers: headersWithUserAgent,
        promptMessages
      },
      callbacks: [resolvedOnStepStart, telemetryDispatcher.onObjectStepStart]
    });
    const generateResult = await retry(
      () => model.doGenerate({
        responseFormat: {
          type: "json",
          schema: jsonSchema2,
          name: schemaName,
          description: schemaDescription
        },
        ...prepareLanguageModelCallOptions(settings),
        prompt: promptMessages,
        providerOptions,
        abortSignal,
        headers: headersWithUserAgent
      })
    );
    const responseData = {
      id: (_b18 = (_a222 = generateResult.response) == null ? void 0 : _a222.id) != null ? _b18 : generateId2(),
      timestamp: (_d = (_c = generateResult.response) == null ? void 0 : _c.timestamp) != null ? _d : currentDate(),
      modelId: (_f = (_e = generateResult.response) == null ? void 0 : _e.modelId) != null ? _f : model.modelId,
      headers: (_g = generateResult.response) == null ? void 0 : _g.headers,
      body: (_h = generateResult.response) == null ? void 0 : _h.body
    };
    const text2 = extractTextContent(generateResult.content);
    const reasoning = extractReasoningContent(generateResult.content);
    if (text2 === void 0) {
      throw new NoObjectGeneratedError({
        message: "No object generated: the model did not return a response.",
        response: responseData,
        usage: asLanguageModelUsage(generateResult.usage),
        finishReason: generateResult.finishReason.unified
      });
    }
    const finishReason = generateResult.finishReason.unified;
    const usage = asLanguageModelUsage(generateResult.usage);
    const warnings = generateResult.warnings;
    const resultProviderMetadata = generateResult.providerMetadata;
    const request = (_i = generateResult.request) != null ? _i : {};
    const response = responseData;
    logWarnings({
      warnings,
      provider: model.provider,
      model: model.modelId
    });
    const stepFinishEvent = {
      callId,
      stepNumber: 0,
      provider: model.provider,
      modelId: model.modelId,
      finishReason,
      usage,
      objectText: text2,
      msToFirstChunk: void 0,
      reasoning,
      warnings,
      request,
      response,
      providerMetadata: resultProviderMetadata
    };
    await notify({
      event: stepFinishEvent,
      callbacks: [resolvedOnStepEnd, telemetryDispatcher.onObjectStepEnd]
    });
    const object2 = await parseAndValidateObjectResultWithRepair(
      text2,
      outputStrategy,
      repairText,
      {
        response,
        usage,
        finishReason
      }
    );
    await notify({
      event: {
        callId,
        object: object2,
        error: void 0,
        reasoning,
        finishReason,
        usage,
        warnings,
        request,
        response,
        providerMetadata: resultProviderMetadata
      },
      callbacks: [onFinish, telemetryDispatcher.onEnd]
    });
    return new DefaultGenerateObjectResult({
      object: object2,
      reasoning,
      finishReason,
      usage,
      warnings,
      request,
      response,
      providerMetadata: resultProviderMetadata
    });
  } catch (error) {
    await ((_j = telemetryDispatcher.onError) == null ? void 0 : _j.call(telemetryDispatcher, { callId, error }));
    throw wrapGatewayError(error);
  }
}
__name(generateObject, "generateObject");
var DefaultGenerateObjectResult = class {
  static {
    __name(this, "DefaultGenerateObjectResult");
  }
  constructor(options) {
    this.object = options.object;
    this.finishReason = options.finishReason;
    this.usage = options.usage;
    this.warnings = options.warnings;
    this.providerMetadata = options.providerMetadata;
    this.response = options.response;
    this.request = options.request;
    this.reasoning = options.reasoning;
  }
  toJsonResponse(init) {
    var _a222;
    return new Response(JSON.stringify(this.object), {
      status: (_a222 = init == null ? void 0 : init.status) != null ? _a222 : 200,
      headers: prepareHeaders(init == null ? void 0 : init.headers, {
        "content-type": "application/json; charset=utf-8"
      })
    });
  }
};
function createDownload(options) {
  return ({ url, abortSignal }) => download({ url, maxBytes: options == null ? void 0 : options.maxBytes, abortSignal });
}
__name(createDownload, "createDownload");
function isDeepEqualData(obj1, obj2) {
  if (obj1 === obj2)
    return true;
  if (obj1 == null || obj2 == null)
    return false;
  if (typeof obj1 !== "object" && typeof obj2 !== "object")
    return obj1 === obj2;
  if (obj1.constructor !== obj2.constructor)
    return false;
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length)
      return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isDeepEqualData(obj1[i], obj2[i]))
        return false;
    }
    return true;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length)
    return false;
  for (const key of keys1) {
    if (!keys2.includes(key))
      return false;
    if (!isDeepEqualData(obj1[key], obj2[key]))
      return false;
  }
  return true;
}
__name(isDeepEqualData, "isDeepEqualData");
var originalGenerateId5 = createIdGenerator({ prefix: "aiobj", size: 24 });
function streamObject(options) {
  const {
    model,
    output = "object",
    instructions,
    system,
    prompt,
    messages,
    allowSystemInMessages,
    maxRetries,
    abortSignal,
    headers,
    experimental_repairText: repairText,
    experimental_telemetry,
    telemetry = experimental_telemetry,
    experimental_download: download2,
    providerOptions,
    onStart,
    experimental_onStart,
    onStepStart,
    experimental_onStepStart,
    onStepEnd,
    onStepFinish,
    onError = /* @__PURE__ */ __name(({ error }) => {
      console.error(error);
    }, "onError"),
    onFinish,
    _internal: {
      generateId: generateId2 = originalGenerateId5,
      currentDate = /* @__PURE__ */ __name(() => /* @__PURE__ */ new Date(), "currentDate"),
      now: now2 = now
    } = {},
    ...settings
  } = options;
  const enumValues = "enum" in options && options.enum ? options.enum : void 0;
  const {
    schema: inputSchema,
    schemaDescription,
    schemaName
  } = "schema" in options ? options : {};
  validateObjectGenerationInput({
    output,
    schema: inputSchema,
    schemaName,
    schemaDescription,
    enumValues
  });
  const outputStrategy = getOutputStrategy({
    output,
    schema: inputSchema,
    enumValues
  });
  return new DefaultStreamObjectResult({
    model,
    telemetry,
    headers,
    settings,
    maxRetries,
    abortSignal,
    outputStrategy,
    instructions,
    system,
    prompt,
    messages,
    allowSystemInMessages,
    schemaName,
    schemaDescription,
    providerOptions,
    repairText,
    onStart: onStart != null ? onStart : experimental_onStart,
    onStepStart: onStepStart != null ? onStepStart : experimental_onStepStart,
    onStepFinish: onStepEnd != null ? onStepEnd : onStepFinish,
    onError,
    onFinish,
    download: download2,
    generateId: generateId2,
    currentDate,
    now: now2
  });
}
__name(streamObject, "streamObject");
var DefaultStreamObjectResult = class {
  static {
    __name(this, "DefaultStreamObjectResult");
  }
  constructor({
    model: modelArg,
    headers,
    telemetry,
    settings,
    maxRetries: maxRetriesArg,
    abortSignal,
    outputStrategy,
    instructions,
    system,
    prompt,
    messages,
    allowSystemInMessages,
    schemaName,
    schemaDescription,
    providerOptions,
    repairText,
    onStart,
    onStepStart,
    onStepFinish,
    onError,
    onFinish,
    download: download2,
    generateId: generateId2,
    currentDate,
    now: now2
  }) {
    this._object = new DelayedPromise();
    this._usage = new DelayedPromise();
    this._providerMetadata = new DelayedPromise();
    this._warnings = new DelayedPromise();
    this._request = new DelayedPromise();
    this._response = new DelayedPromise();
    this._finishReason = new DelayedPromise();
    const model = resolveLanguageModel(modelArg);
    const { maxRetries, retry } = prepareRetries({
      maxRetries: maxRetriesArg,
      abortSignal
    });
    const callSettings = prepareLanguageModelCallOptions(settings);
    const telemetryDispatcher = createTelemetryDispatcher({
      telemetry
    });
    const self = this;
    const stitchableStream = createStitchableStream();
    const eventProcessor = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
        if (chunk.type === "error") {
          onError({ error: wrapGatewayError(chunk.error) });
        }
      }
    });
    this.baseStream = stitchableStream.stream.pipeThrough(eventProcessor);
    const callId = generateId2();
    (async () => {
      const jsonSchema2 = await outputStrategy.jsonSchema();
      await notify({
        event: {
          callId,
          operationId: "ai.streamObject",
          provider: model.provider,
          modelId: model.modelId,
          system: instructions != null ? instructions : system,
          prompt,
          messages,
          maxOutputTokens: callSettings.maxOutputTokens,
          temperature: callSettings.temperature,
          topP: callSettings.topP,
          topK: callSettings.topK,
          presencePenalty: callSettings.presencePenalty,
          frequencyPenalty: callSettings.frequencyPenalty,
          seed: callSettings.seed,
          maxRetries,
          headers,
          providerOptions,
          output: outputStrategy.type,
          schema: jsonSchema2,
          schemaName,
          schemaDescription
        },
        callbacks: [onStart, telemetryDispatcher.onStart]
      });
      const standardizedPrompt = await standardizePrompt({
        instructions,
        system,
        prompt,
        messages,
        allowSystemInMessages
      });
      const callOptions = {
        responseFormat: {
          type: "json",
          schema: jsonSchema2,
          name: schemaName,
          description: schemaDescription
        },
        ...prepareLanguageModelCallOptions(settings),
        prompt: await convertToLanguageModelPrompt({
          prompt: standardizedPrompt,
          supportedUrls: await model.supportedUrls,
          download: download2,
          provider: model.provider.split(".")[0]
        }),
        providerOptions,
        abortSignal,
        headers,
        includeRawChunks: false
      };
      await notify({
        event: {
          callId,
          stepNumber: 0,
          provider: model.provider,
          modelId: model.modelId,
          providerOptions,
          headers,
          promptMessages: callOptions.prompt
        },
        callbacks: [onStepStart, telemetryDispatcher.onObjectStepStart]
      });
      const transformer = {
        transform: /* @__PURE__ */ __name((chunk, controller) => {
          switch (chunk.type) {
            case "text-delta":
              controller.enqueue(chunk.delta);
              break;
            case "response-metadata":
            case "finish":
            case "error":
            case "stream-start":
              controller.enqueue(chunk);
              break;
          }
        }, "transform")
      };
      const startTimestampMs = now2();
      const { stream, response, request } = await retry(
        () => model.doStream(callOptions)
      );
      self._request.resolve(request != null ? request : {});
      let warnings;
      let usage = createNullLanguageModelUsage();
      let finishReason;
      let providerMetadata;
      let object2;
      let error;
      let msToFirstChunk = void 0;
      let accumulatedText = "";
      let textDelta = "";
      let fullResponse = {
        id: generateId2(),
        timestamp: currentDate(),
        modelId: model.modelId
      };
      let latestObjectJson = void 0;
      let latestObject = void 0;
      let isFirstChunk = true;
      let isFirstDelta = true;
      const transformedStream = stream.pipeThrough(new TransformStream(transformer)).pipeThrough(
        new TransformStream({
          async transform(chunk, controller) {
            var _a222, _b18, _c;
            if (typeof chunk === "object" && chunk.type === "stream-start") {
              warnings = chunk.warnings;
              return;
            }
            if (isFirstChunk) {
              msToFirstChunk = now2() - startTimestampMs;
              isFirstChunk = false;
            }
            if (typeof chunk === "string") {
              accumulatedText += chunk;
              textDelta += chunk;
              const { value: currentObjectJson, state: parseState } = await parsePartialJson(accumulatedText);
              if (currentObjectJson !== void 0 && !isDeepEqualData(latestObjectJson, currentObjectJson)) {
                const validationResult = await outputStrategy.validatePartialResult({
                  value: currentObjectJson,
                  textDelta,
                  latestObject,
                  isFirstDelta,
                  isFinalDelta: parseState === "successful-parse"
                });
                if (validationResult.success && !isDeepEqualData(
                  latestObject,
                  validationResult.value.partial
                )) {
                  latestObjectJson = currentObjectJson;
                  latestObject = validationResult.value.partial;
                  controller.enqueue({
                    type: "object",
                    object: latestObject
                  });
                  controller.enqueue({
                    type: "text-delta",
                    textDelta: validationResult.value.textDelta
                  });
                  textDelta = "";
                  isFirstDelta = false;
                }
              }
              return;
            }
            switch (chunk.type) {
              case "response-metadata": {
                fullResponse = {
                  id: (_a222 = chunk.id) != null ? _a222 : fullResponse.id,
                  timestamp: (_b18 = chunk.timestamp) != null ? _b18 : fullResponse.timestamp,
                  modelId: (_c = chunk.modelId) != null ? _c : fullResponse.modelId
                };
                break;
              }
              case "finish": {
                if (textDelta !== "") {
                  controller.enqueue({ type: "text-delta", textDelta });
                }
                finishReason = chunk.finishReason.unified;
                usage = asLanguageModelUsage(chunk.usage);
                providerMetadata = chunk.providerMetadata;
                controller.enqueue({
                  ...chunk,
                  finishReason: chunk.finishReason.unified,
                  usage,
                  response: fullResponse
                });
                logWarnings({
                  warnings: warnings != null ? warnings : [],
                  provider: model.provider,
                  model: model.modelId
                });
                self._usage.resolve(usage);
                self._providerMetadata.resolve(providerMetadata);
                self._warnings.resolve(warnings);
                self._response.resolve({
                  ...fullResponse,
                  headers: response == null ? void 0 : response.headers
                });
                self._finishReason.resolve(finishReason != null ? finishReason : "other");
                try {
                  object2 = await parseAndValidateObjectResultWithRepair(
                    accumulatedText,
                    outputStrategy,
                    repairText,
                    {
                      response: fullResponse,
                      usage,
                      finishReason
                    }
                  );
                  self._object.resolve(object2);
                } catch (e) {
                  error = e;
                  self._object.reject(e);
                }
                break;
              }
              default: {
                controller.enqueue(chunk);
                break;
              }
            }
          },
          async flush(controller) {
            try {
              const finalUsage = usage != null ? usage : {
                promptTokens: NaN,
                completionTokens: NaN,
                totalTokens: NaN
              };
              await notify({
                event: {
                  callId,
                  stepNumber: 0,
                  provider: model.provider,
                  modelId: model.modelId,
                  finishReason: finishReason != null ? finishReason : "other",
                  usage: finalUsage,
                  objectText: accumulatedText,
                  msToFirstChunk,
                  reasoning: void 0,
                  warnings,
                  request: request != null ? request : {},
                  response: {
                    ...fullResponse,
                    headers: response == null ? void 0 : response.headers
                  },
                  providerMetadata
                },
                callbacks: [
                  onStepFinish,
                  telemetryDispatcher.onObjectStepEnd
                ]
              });
              await notify({
                event: {
                  callId,
                  object: object2,
                  error,
                  reasoning: void 0,
                  finishReason: finishReason != null ? finishReason : "other",
                  usage: finalUsage,
                  warnings,
                  request: request != null ? request : {},
                  response: {
                    ...fullResponse,
                    headers: response == null ? void 0 : response.headers
                  },
                  providerMetadata
                },
                callbacks: [onFinish, telemetryDispatcher.onEnd]
              });
            } catch (error2) {
              controller.enqueue({ type: "error", error: error2 });
            }
          }
        })
      );
      stitchableStream.addStream(transformedStream);
    })().catch(async (error) => {
      var _a222;
      await ((_a222 = telemetryDispatcher.onError) == null ? void 0 : _a222.call(telemetryDispatcher, { callId, error }));
      stitchableStream.addStream(
        new ReadableStream({
          start(controller) {
            controller.enqueue({ type: "error", error });
            controller.close();
          }
        })
      );
    }).finally(() => {
      stitchableStream.close();
    });
    this.outputStrategy = outputStrategy;
  }
  get object() {
    return this._object.promise;
  }
  get usage() {
    return this._usage.promise;
  }
  get providerMetadata() {
    return this._providerMetadata.promise;
  }
  get warnings() {
    return this._warnings.promise;
  }
  get request() {
    return this._request.promise;
  }
  get response() {
    return this._response.promise;
  }
  get finishReason() {
    return this._finishReason.promise;
  }
  get partialObjectStream() {
    return createAsyncIterableStream(
      this.baseStream.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            switch (chunk.type) {
              case "object":
                controller.enqueue(chunk.object);
                break;
              case "text-delta":
              case "finish":
              case "error":
                break;
              default: {
                const _exhaustiveCheck = chunk;
                throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
              }
            }
          }
        })
      )
    );
  }
  get elementStream() {
    return this.outputStrategy.createElementStream(this.baseStream);
  }
  get textStream() {
    return createAsyncIterableStream(
      this.baseStream.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            switch (chunk.type) {
              case "text-delta":
                controller.enqueue(chunk.textDelta);
                break;
              case "object":
              case "finish":
              case "error":
                break;
              default: {
                const _exhaustiveCheck = chunk;
                throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
              }
            }
          }
        })
      )
    );
  }
  get fullStream() {
    return createAsyncIterableStream(this.baseStream);
  }
  pipeTextStreamToResponse(response, init) {
    pipeTextStreamToResponse({
      response,
      stream: this.textStream,
      ...init
    });
  }
  toTextStreamResponse(init) {
    return createTextStreamResponse({
      stream: this.textStream,
      ...init
    });
  }
};
var defaultDownload = createDownload();
var name21 = "AI_NoSuchProviderError";
var marker21 = `vercel.ai.error.${name21}`;
var symbol21 = Symbol.for(marker21);
var _a21;
_a21 = symbol21;
var originalGenerateCallId6 = createIdGenerator({
  prefix: "call",
  size: 24
});
var defaultDownload2 = createDownload();

// lib/ai/client.ts
init_esm();

// node_modules/.pnpm/@ai-sdk+openai@4.0.16_zod@3.25.76/node_modules/@ai-sdk/openai/dist/index.js
init_esm();
var openaiErrorDataSchema = external_exports.object({
  error: external_exports.object({
    message: external_exports.string(),
    // The additional information below is handled loosely to support
    // OpenAI-compatible providers that have slightly different error
    // responses:
    type: external_exports.string().nullish(),
    param: external_exports.any().nullish(),
    code: external_exports.union([external_exports.string(), external_exports.number()]).nullish()
  })
});
var openaiFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: openaiErrorDataSchema,
  errorToMessage: /* @__PURE__ */ __name((data) => data.error.message, "errorToMessage")
});
function getOpenAILanguageModelCapabilities(modelId) {
  const supportsFlexProcessing = modelId.startsWith("o3") || modelId.startsWith("o4-mini") || modelId.startsWith("gpt-5") && !modelId.startsWith("gpt-5-chat");
  const supportsPriorityProcessing = modelId.startsWith("gpt-4") || modelId.startsWith("gpt-5") && !modelId.startsWith("gpt-5-nano") && !modelId.startsWith("gpt-5-chat") && !modelId.startsWith("gpt-5.4-nano") || modelId.startsWith("o3") || modelId.startsWith("o4-mini");
  const isReasoningModel = modelId.startsWith("o1") || modelId.startsWith("o3") || modelId.startsWith("o4-mini") || modelId.startsWith("gpt-5") && !modelId.startsWith("gpt-5-chat");
  const supportsNonReasoningParameters = modelId.startsWith("gpt-5.1") || modelId.startsWith("gpt-5.2") || modelId.startsWith("gpt-5.3") || modelId.startsWith("gpt-5.4") || modelId.startsWith("gpt-5.5") || modelId.startsWith("gpt-5.6");
  const systemMessageMode = isReasoningModel ? "developer" : "system";
  return {
    supportsFlexProcessing,
    supportsPriorityProcessing,
    isReasoningModel,
    systemMessageMode,
    supportsNonReasoningParameters
  };
}
__name(getOpenAILanguageModelCapabilities, "getOpenAILanguageModelCapabilities");
async function throwIfOpenAIStreamErrorBeforeOutput({
  stream,
  getError,
  isOutputChunk,
  url,
  requestBodyValues,
  responseHeaders
}) {
  const [streamForEarlyError, streamForConsumer] = stream.tee();
  const reader = streamForEarlyError.getReader();
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) {
        return streamForConsumer;
      }
      const chunk = result.value;
      if (!chunk.success) {
        return streamForConsumer;
      }
      const errorFrame = getError(chunk.value);
      if (errorFrame != null) {
        streamForConsumer.cancel().catch(() => {
        });
        throw createOpenAIStreamError({
          frame: errorFrame,
          url,
          requestBodyValues,
          responseHeaders
        });
      }
      if (isOutputChunk(chunk.value)) {
        return streamForConsumer;
      }
    }
  } finally {
    reader.cancel().catch(() => {
    });
    reader.releaseLock();
  }
}
__name(throwIfOpenAIStreamErrorBeforeOutput, "throwIfOpenAIStreamErrorBeforeOutput");
function createOpenAIStreamError({
  frame,
  url,
  requestBodyValues,
  responseHeaders
}) {
  var _a24;
  const streamError = parseStreamError(frame);
  return new APICallError({
    message: (_a24 = streamError == null ? void 0 : streamError.message) != null ? _a24 : "OpenAI stream failed before any output was generated",
    url,
    requestBodyValues,
    statusCode: streamError == null ? 500 : getStatusCode(streamError),
    responseHeaders,
    responseBody: JSON.stringify(frame),
    data: frame
  });
}
__name(createOpenAIStreamError, "createOpenAIStreamError");
function parseStreamError(frame) {
  var _a24;
  const value = asRecord(frame);
  if (value == null) {
    return void 0;
  }
  if (value.type === "response.failed") {
    const response = asRecord(value.response);
    const responseError = asRecord(response == null ? void 0 : response.error);
    return typeof (responseError == null ? void 0 : responseError.message) === "string" ? {
      message: responseError.message,
      code: getStringOrNumber(responseError.code),
      type: "response.failed",
      frame
    } : void 0;
  }
  const error = (_a24 = asRecord(value.error)) != null ? _a24 : value;
  return typeof error.message === "string" && (asRecord(value.error) != null || typeof error.type === "string" || "code" in error || "param" in error) ? {
    message: error.message,
    code: getStringOrNumber(error.code),
    type: typeof error.type === "string" ? error.type : void 0,
    frame
  } : void 0;
}
__name(parseStreamError, "parseStreamError");
function getStatusCode(error) {
  if (typeof error.code === "number" && isHttpErrorStatusCode(error.code)) {
    return error.code;
  }
  if (typeof error.code === "string" && /^\d{3}$/.test(error.code)) {
    const numericCode = Number(error.code);
    if (isHttpErrorStatusCode(numericCode)) {
      return numericCode;
    }
  }
  const discriminator = [error.code, error.type].filter((value) => typeof value === "string" || typeof value === "number").join(" ").toLowerCase();
  if (["insufficient_quota", "rate_limit"].some(
    (term) => discriminator.includes(term)
  )) {
    return 429;
  }
  if (discriminator.includes("authentication")) return 401;
  if (discriminator.includes("permission")) return 403;
  if (discriminator.includes("not_found")) return 404;
  if (["invalid", "bad_request", "context_length"].some(
    (term) => discriminator.includes(term)
  )) {
    return 400;
  }
  if (discriminator.includes("overload")) return 503;
  if (discriminator.includes("timeout")) return 504;
  return 500;
}
__name(getStatusCode, "getStatusCode");
function asRecord(value) {
  return typeof value === "object" && value != null ? value : void 0;
}
__name(asRecord, "asRecord");
function getStringOrNumber(value) {
  return typeof value === "string" || typeof value === "number" ? value : void 0;
}
__name(getStringOrNumber, "getStringOrNumber");
function isHttpErrorStatusCode(value) {
  return Number.isInteger(value) && value >= 400 && value <= 599;
}
__name(isHttpErrorStatusCode, "isHttpErrorStatusCode");
function convertOpenAIChatUsage(usage) {
  var _a24, _b18, _c, _d, _e, _f, _g, _h;
  if (usage == null) {
    return {
      inputTokens: {
        total: void 0,
        noCache: void 0,
        cacheRead: void 0,
        cacheWrite: void 0
      },
      outputTokens: {
        total: void 0,
        text: void 0,
        reasoning: void 0
      },
      raw: void 0
    };
  }
  const promptTokens = (_a24 = usage.prompt_tokens) != null ? _a24 : 0;
  const completionTokens = (_b18 = usage.completion_tokens) != null ? _b18 : 0;
  const cachedTokens = (_d = (_c = usage.prompt_tokens_details) == null ? void 0 : _c.cached_tokens) != null ? _d : 0;
  const cacheWriteTokens = (_f = (_e = usage.prompt_tokens_details) == null ? void 0 : _e.cache_write_tokens) != null ? _f : void 0;
  const reasoningTokens = (_h = (_g = usage.completion_tokens_details) == null ? void 0 : _g.reasoning_tokens) != null ? _h : 0;
  return {
    inputTokens: {
      total: promptTokens,
      noCache: promptTokens - cachedTokens - (cacheWriteTokens != null ? cacheWriteTokens : 0),
      cacheRead: cachedTokens,
      cacheWrite: cacheWriteTokens
    },
    outputTokens: {
      total: completionTokens,
      text: completionTokens - reasoningTokens,
      reasoning: reasoningTokens
    },
    raw: usage
  };
}
__name(convertOpenAIChatUsage, "convertOpenAIChatUsage");
function serializeToolCallArguments(input) {
  return JSON.stringify(input === void 0 ? {} : input);
}
__name(serializeToolCallArguments, "serializeToolCallArguments");
function getPromptCacheBreakpoint(providerOptions) {
  var _a24;
  return (_a24 = providerOptions == null ? void 0 : providerOptions.openai) == null ? void 0 : _a24.promptCacheBreakpoint;
}
__name(getPromptCacheBreakpoint, "getPromptCacheBreakpoint");
function convertToOpenAIChatMessages({
  prompt,
  systemMessageMode = "system"
}) {
  var _a24, _b18;
  const messages = [];
  const warnings = [];
  for (const { role, content, providerOptions } of prompt) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            const promptCacheBreakpoint = getPromptCacheBreakpoint(providerOptions);
            messages.push({
              role: "system",
              content: promptCacheBreakpoint == null ? content : [
                {
                  type: "text",
                  text: content,
                  prompt_cache_breakpoint: promptCacheBreakpoint
                }
              ]
            });
            break;
          }
          case "developer": {
            const promptCacheBreakpoint = getPromptCacheBreakpoint(providerOptions);
            messages.push({
              role: "developer",
              content: promptCacheBreakpoint == null ? content : [
                {
                  type: "text",
                  text: content,
                  prompt_cache_breakpoint: promptCacheBreakpoint
                }
              ]
            });
            break;
          }
          case "remove": {
            warnings.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        if (content.length === 1 && content[0].type === "text" && getPromptCacheBreakpoint(content[0].providerOptions) == null) {
          messages.push({ role: "user", content: content[0].text });
          break;
        }
        messages.push({
          role: "user",
          content: content.map((part, index) => {
            var _a25, _b23, _c;
            switch (part.type) {
              case "text": {
                const promptCacheBreakpoint = getPromptCacheBreakpoint(
                  part.providerOptions
                );
                return {
                  type: "text",
                  text: part.text,
                  ...promptCacheBreakpoint != null && {
                    prompt_cache_breakpoint: promptCacheBreakpoint
                  }
                };
              }
              case "file": {
                const promptCacheBreakpoint = getPromptCacheBreakpoint(
                  part.providerOptions
                );
                switch (part.data.type) {
                  case "reference": {
                    return {
                      type: "file",
                      file: {
                        file_id: resolveProviderReference({
                          reference: part.data.reference,
                          provider: "openai"
                        })
                      },
                      ...promptCacheBreakpoint != null && {
                        prompt_cache_breakpoint: promptCacheBreakpoint
                      }
                    };
                  }
                  case "text": {
                    throw new UnsupportedFunctionalityError({
                      functionality: "text file parts"
                    });
                  }
                  case "url":
                  case "data": {
                    const topLevel = getTopLevelMediaType(part.mediaType);
                    if (topLevel === "image") {
                      return {
                        type: "image_url",
                        image_url: {
                          url: part.data.type === "url" ? part.data.url.toString() : `data:${resolveFullMediaType({ part })};base64,${convertToBase64(part.data.data)}`,
                          detail: (_b23 = (_a25 = part.providerOptions) == null ? void 0 : _a25.openai) == null ? void 0 : _b23.imageDetail
                        },
                        ...promptCacheBreakpoint != null && {
                          prompt_cache_breakpoint: promptCacheBreakpoint
                        }
                      };
                    } else if (topLevel === "audio") {
                      if (part.data.type === "url") {
                        throw new UnsupportedFunctionalityError({
                          functionality: "audio file parts with URLs"
                        });
                      }
                      const fullMediaType = resolveFullMediaType({ part });
                      switch (fullMediaType) {
                        case "audio/wav": {
                          return {
                            type: "input_audio",
                            input_audio: {
                              data: convertToBase64(part.data.data),
                              format: "wav"
                            },
                            ...promptCacheBreakpoint != null && {
                              prompt_cache_breakpoint: promptCacheBreakpoint
                            }
                          };
                        }
                        case "audio/mp3":
                        case "audio/mpeg": {
                          return {
                            type: "input_audio",
                            input_audio: {
                              data: convertToBase64(part.data.data),
                              format: "mp3"
                            },
                            ...promptCacheBreakpoint != null && {
                              prompt_cache_breakpoint: promptCacheBreakpoint
                            }
                          };
                        }
                        default: {
                          throw new UnsupportedFunctionalityError({
                            functionality: `audio content parts with media type ${fullMediaType}`
                          });
                        }
                      }
                    }
                    {
                      const fullMediaType = resolveFullMediaType({ part });
                      if (fullMediaType !== "application/pdf") {
                        throw new UnsupportedFunctionalityError({
                          functionality: `file part media type ${fullMediaType}`
                        });
                      }
                      if (part.data.type === "url") {
                        throw new UnsupportedFunctionalityError({
                          functionality: "PDF file parts with URLs"
                        });
                      }
                      return {
                        type: "file",
                        file: {
                          filename: (_c = part.filename) != null ? _c : `part-${index}.pdf`,
                          file_data: `data:application/pdf;base64,${convertToBase64(part.data.data)}`
                        },
                        ...promptCacheBreakpoint != null && {
                          prompt_cache_breakpoint: promptCacheBreakpoint
                        }
                      };
                    }
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        let text2 = "";
        const textParts = [];
        let hasPromptCacheBreakpoint = false;
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              const promptCacheBreakpoint = getPromptCacheBreakpoint(
                part.providerOptions
              );
              text2 += part.text;
              textParts.push({
                type: "text",
                text: part.text,
                ...promptCacheBreakpoint != null && {
                  prompt_cache_breakpoint: promptCacheBreakpoint
                }
              });
              hasPromptCacheBreakpoint || (hasPromptCacheBreakpoint = promptCacheBreakpoint != null);
              break;
            }
            case "tool-call": {
              toolCalls.push({
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: serializeToolCallArguments(part.input)
                }
              });
              break;
            }
          }
        }
        messages.push({
          role: "assistant",
          content: hasPromptCacheBreakpoint ? textParts : toolCalls.length > 0 ? text2 || null : text2,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          if (toolResponse.type === "tool-approval-response") {
            continue;
          }
          const output = toolResponse.output;
          const promptCacheBreakpoint = (_a24 = output.type === "content" ? output.value.map((part) => getPromptCacheBreakpoint(part.providerOptions)).find((breakpoint) => breakpoint != null) : getPromptCacheBreakpoint(output.providerOptions)) != null ? _a24 : getPromptCacheBreakpoint(toolResponse.providerOptions);
          let contentValue;
          switch (output.type) {
            case "text":
            case "error-text":
              contentValue = output.value;
              break;
            case "execution-denied":
              contentValue = (_b18 = output.reason) != null ? _b18 : "Tool call execution denied.";
              break;
            case "content":
            case "json":
            case "error-json":
              contentValue = JSON.stringify(output.value);
              break;
          }
          messages.push({
            role: "tool",
            tool_call_id: toolResponse.toolCallId,
            content: promptCacheBreakpoint == null ? contentValue : [
              {
                type: "text",
                text: contentValue,
                prompt_cache_breakpoint: promptCacheBreakpoint
              }
            ]
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return { messages, warnings };
}
__name(convertToOpenAIChatMessages, "convertToOpenAIChatMessages");
function getResponseMetadata({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created ? new Date(created * 1e3) : void 0
  };
}
__name(getResponseMetadata, "getResponseMetadata");
function mapOpenAIFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "other";
  }
}
__name(mapOpenAIFinishReason, "mapOpenAIFinishReason");
var openaiChatResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      id: external_exports.string().nullish(),
      created: external_exports.number().nullish(),
      model: external_exports.string().nullish(),
      choices: external_exports.array(
        external_exports.object({
          message: external_exports.object({
            role: external_exports.literal("assistant").nullish(),
            content: external_exports.string().nullish(),
            tool_calls: external_exports.array(
              external_exports.object({
                id: external_exports.string().nullish(),
                type: external_exports.literal("function"),
                function: external_exports.object({
                  name: external_exports.string(),
                  arguments: external_exports.string()
                })
              })
            ).nullish(),
            annotations: external_exports.array(
              external_exports.object({
                type: external_exports.literal("url_citation"),
                url_citation: external_exports.object({
                  start_index: external_exports.number(),
                  end_index: external_exports.number(),
                  url: external_exports.string(),
                  title: external_exports.string()
                })
              })
            ).nullish()
          }),
          index: external_exports.number(),
          logprobs: external_exports.object({
            content: external_exports.array(
              external_exports.object({
                token: external_exports.string(),
                logprob: external_exports.number(),
                top_logprobs: external_exports.array(
                  external_exports.object({
                    token: external_exports.string(),
                    logprob: external_exports.number()
                  })
                )
              })
            ).nullish()
          }).nullish(),
          finish_reason: external_exports.string().nullish()
        })
      ),
      usage: external_exports.object({
        prompt_tokens: external_exports.number().nullish(),
        completion_tokens: external_exports.number().nullish(),
        total_tokens: external_exports.number().nullish(),
        prompt_tokens_details: external_exports.object({
          cached_tokens: external_exports.number().nullish(),
          cache_write_tokens: external_exports.number().nullish()
        }).nullish(),
        completion_tokens_details: external_exports.object({
          reasoning_tokens: external_exports.number().nullish(),
          accepted_prediction_tokens: external_exports.number().nullish(),
          rejected_prediction_tokens: external_exports.number().nullish()
        }).nullish()
      }).nullish()
    })
  )
);
var openaiChatChunkSchema = lazySchema(
  () => zodSchema(
    external_exports.union([
      external_exports.object({
        id: external_exports.string().nullish(),
        created: external_exports.number().nullish(),
        model: external_exports.string().nullish(),
        choices: external_exports.array(
          external_exports.object({
            delta: external_exports.object({
              role: external_exports.enum(["assistant"]).nullish(),
              content: external_exports.string().nullish(),
              tool_calls: external_exports.array(
                external_exports.object({
                  index: external_exports.number(),
                  id: external_exports.string().nullish(),
                  type: external_exports.literal("function").nullish(),
                  function: external_exports.object({
                    name: external_exports.string().nullish(),
                    arguments: external_exports.string().nullish()
                  })
                })
              ).nullish(),
              annotations: external_exports.array(
                external_exports.object({
                  type: external_exports.literal("url_citation"),
                  url_citation: external_exports.object({
                    start_index: external_exports.number(),
                    end_index: external_exports.number(),
                    url: external_exports.string(),
                    title: external_exports.string()
                  })
                })
              ).nullish()
            }).nullish(),
            logprobs: external_exports.object({
              content: external_exports.array(
                external_exports.object({
                  token: external_exports.string(),
                  logprob: external_exports.number(),
                  top_logprobs: external_exports.array(
                    external_exports.object({
                      token: external_exports.string(),
                      logprob: external_exports.number()
                    })
                  )
                })
              ).nullish()
            }).nullish(),
            finish_reason: external_exports.string().nullish(),
            index: external_exports.number()
          })
        ),
        usage: external_exports.object({
          prompt_tokens: external_exports.number().nullish(),
          completion_tokens: external_exports.number().nullish(),
          total_tokens: external_exports.number().nullish(),
          prompt_tokens_details: external_exports.object({
            cached_tokens: external_exports.number().nullish(),
            cache_write_tokens: external_exports.number().nullish()
          }).nullish(),
          completion_tokens_details: external_exports.object({
            reasoning_tokens: external_exports.number().nullish(),
            accepted_prediction_tokens: external_exports.number().nullish(),
            rejected_prediction_tokens: external_exports.number().nullish()
          }).nullish()
        }).nullish()
      }),
      openaiErrorDataSchema
    ])
  )
);
var openaiLanguageModelChatOptions = lazySchema(
  () => zodSchema(
    external_exports.object({
      /**
       * Modify the likelihood of specified tokens appearing in the completion.
       *
       * Accepts a JSON object that maps tokens (specified by their token ID in
       * the GPT tokenizer) to an associated bias value from -100 to 100.
       */
      logitBias: external_exports.record(external_exports.coerce.number(), external_exports.number()).optional(),
      /**
       * Return the log probabilities of the tokens.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       */
      logprobs: external_exports.union([external_exports.boolean(), external_exports.number()]).optional(),
      /**
       * Whether to enable parallel function calling during tool use. Default to true.
       */
      parallelToolCalls: external_exports.boolean().optional(),
      /**
       * A unique identifier representing your end-user, which can help OpenAI to
       * monitor and detect abuse.
       */
      user: external_exports.string().optional(),
      /**
       * Reasoning effort for reasoning models. Defaults to `medium`.
       */
      reasoningEffort: external_exports.enum(["none", "minimal", "low", "medium", "high", "xhigh", "max"]).optional(),
      /**
       * Maximum number of completion tokens to generate. Useful for reasoning models.
       */
      maxCompletionTokens: external_exports.number().optional(),
      /**
       * Whether to enable persistence in responses API.
       */
      store: external_exports.boolean().optional(),
      /**
       * Metadata to associate with the request.
       */
      metadata: external_exports.record(external_exports.string().max(64), external_exports.string().max(512)).optional(),
      /**
       * Parameters for prediction mode.
       */
      prediction: external_exports.record(external_exports.string(), external_exports.any()).optional(),
      /**
       * Service tier for the request.
       * - 'auto': Default service tier. The request will be processed with the service tier configured in the
       *           Project settings. Unless otherwise configured, the Project will use 'default'.
       * - 'flex': 50% cheaper processing at the cost of increased latency. Only available for o3 and o4-mini models.
       * - 'priority': Higher-speed processing with predictably low latency at premium cost. Available for Enterprise customers.
       * - 'default': The request will be processed with the standard pricing and performance for the selected model.
       *
       * @default 'auto'
       */
      serviceTier: external_exports.enum(["auto", "flex", "priority", "default"]).optional(),
      /**
       * Whether to use strict JSON schema validation.
       *
       * @default true
       */
      strictJsonSchema: external_exports.boolean().optional(),
      /**
       * Controls the verbosity of the model's responses.
       * Lower values will result in more concise responses, while higher values will result in more verbose responses.
       */
      textVerbosity: external_exports.enum(["low", "medium", "high"]).optional(),
      /**
       * A cache key for prompt caching. Allows manual control over prompt caching behavior.
       * Useful for improving cache hit rates and working around automatic caching issues.
       */
      promptCacheKey: external_exports.string().optional(),
      /**
       * Prompt cache behavior for GPT-5.6 and later models.
       * `mode` controls whether OpenAI also places an implicit breakpoint.
       * `ttl` sets the minimum cache lifetime and currently only supports 30 minutes.
       */
      promptCacheOptions: external_exports.object({
        mode: external_exports.enum(["implicit", "explicit"]).optional(),
        ttl: external_exports.literal("30m").optional()
      }).optional(),
      /**
       * The retention policy for the prompt cache.
       * - 'in_memory': Default. Standard prompt caching behavior.
       * - '24h': Extended prompt caching that keeps cached prefixes active for up to 24 hours.
       *          Available for models before GPT-5.6 that support extended caching.
       *
       * @deprecated For GPT-5.6 and later models, use `promptCacheOptions.ttl`.
       *
       * @default 'in_memory'
       */
      promptCacheRetention: external_exports.enum(["in_memory", "24h"]).optional(),
      /**
       * A stable identifier used to help detect users of your application
       * that may be violating OpenAI's usage policies. The IDs should be a
       * string that uniquely identifies each user. We recommend hashing their
       * username or email address, in order to avoid sending us any identifying
       * information.
       */
      safetyIdentifier: external_exports.string().optional(),
      /**
       * Override the system message mode for this model.
       * - 'system': Use the 'system' role for system messages (default for most models)
       * - 'developer': Use the 'developer' role for system messages (used by reasoning models)
       * - 'remove': Remove system messages entirely
       *
       * If not specified, the mode is automatically determined based on the model.
       */
      systemMessageMode: external_exports.enum(["system", "developer", "remove"]).optional(),
      /**
       * Force treating this model as a reasoning model.
       *
       * This is useful for "stealth" reasoning models (e.g. via a custom baseURL)
       * where the model ID is not recognized by the SDK's allowlist.
       *
       * When enabled, the SDK applies reasoning-model parameter compatibility rules
       * and defaults `systemMessageMode` to `developer` unless overridden.
       */
      forceReasoning: external_exports.boolean().optional()
    })
  )
);
function prepareChatTools({
  tools,
  toolChoice
}) {
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0, toolWarnings };
  }
  const openaiTools2 = [];
  for (const tool2 of tools) {
    switch (tool2.type) {
      case "function":
        openaiTools2.push({
          type: "function",
          function: {
            name: tool2.name,
            description: tool2.description,
            parameters: tool2.inputSchema,
            ...tool2.strict != null ? { strict: tool2.strict } : {}
          }
        });
        break;
      default:
        toolWarnings.push({
          type: "unsupported",
          feature: `tool type: ${tool2.type}`
        });
        break;
    }
  }
  if (toolChoice == null) {
    return { tools: openaiTools2, toolChoice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools2, toolChoice: type, toolWarnings };
    case "tool":
      return {
        tools: openaiTools2,
        toolChoice: {
          type: "function",
          function: {
            name: toolChoice.toolName
          }
        },
        toolWarnings
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
__name(prepareChatTools, "prepareChatTools");
var OpenAIChatLanguageModel = class _OpenAIChatLanguageModel {
  static {
    __name(this, "_OpenAIChatLanguageModel");
  }
  constructor(modelId, config) {
    this.specificationVersion = "v4";
    this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/]
    };
    this.modelId = modelId;
    this.config = config;
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _OpenAIChatLanguageModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    tools,
    toolChoice,
    reasoning,
    providerOptions
  }) {
    var _a24, _b18, _c, _d, _e, _f;
    const warnings = [];
    const openaiOptions = (_a24 = await parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: openaiLanguageModelChatOptions
    })) != null ? _a24 : {};
    const modelCapabilities = getOpenAILanguageModelCapabilities(this.modelId);
    const resolvedReasoningEffort = (_b18 = openaiOptions.reasoningEffort) != null ? _b18 : isCustomReasoning(reasoning) ? reasoning : void 0;
    const isReasoningModel = (_c = openaiOptions.forceReasoning) != null ? _c : modelCapabilities.isReasoningModel;
    if (topK != null) {
      warnings.push({ type: "unsupported", feature: "topK" });
    }
    const { messages, warnings: messageWarnings } = convertToOpenAIChatMessages(
      {
        prompt,
        systemMessageMode: (_d = openaiOptions.systemMessageMode) != null ? _d : isReasoningModel ? "developer" : modelCapabilities.systemMessageMode
      }
    );
    warnings.push(...messageWarnings);
    const strictJsonSchema = (_e = openaiOptions.strictJsonSchema) != null ? _e : true;
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      logit_bias: openaiOptions.logitBias,
      logprobs: openaiOptions.logprobs === true || typeof openaiOptions.logprobs === "number" ? true : void 0,
      top_logprobs: typeof openaiOptions.logprobs === "number" ? openaiOptions.logprobs : typeof openaiOptions.logprobs === "boolean" ? openaiOptions.logprobs ? 0 : void 0 : void 0,
      user: openaiOptions.user,
      parallel_tool_calls: openaiOptions.parallelToolCalls,
      // standardized settings:
      max_tokens: maxOutputTokens,
      temperature,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? responseFormat.schema != null ? {
        type: "json_schema",
        json_schema: {
          schema: responseFormat.schema,
          strict: strictJsonSchema,
          name: (_f = responseFormat.name) != null ? _f : "response",
          description: responseFormat.description
        }
      } : { type: "json_object" } : void 0,
      stop: stopSequences,
      seed,
      verbosity: openaiOptions.textVerbosity,
      // openai specific settings:
      // TODO AI SDK 6: remove, we auto-map maxOutputTokens now
      max_completion_tokens: openaiOptions.maxCompletionTokens,
      store: openaiOptions.store,
      metadata: openaiOptions.metadata,
      prediction: openaiOptions.prediction,
      reasoning_effort: resolvedReasoningEffort,
      service_tier: openaiOptions.serviceTier,
      prompt_cache_key: openaiOptions.promptCacheKey,
      prompt_cache_options: openaiOptions.promptCacheOptions,
      prompt_cache_retention: openaiOptions.promptCacheRetention,
      safety_identifier: openaiOptions.safetyIdentifier,
      // messages:
      messages
    };
    if (isReasoningModel) {
      if (resolvedReasoningEffort !== "none" || !modelCapabilities.supportsNonReasoningParameters) {
        if (baseArgs.temperature != null) {
          baseArgs.temperature = void 0;
          warnings.push({
            type: "unsupported",
            feature: "temperature",
            details: "temperature is not supported for reasoning models"
          });
        }
        if (baseArgs.top_p != null) {
          baseArgs.top_p = void 0;
          warnings.push({
            type: "unsupported",
            feature: "topP",
            details: "topP is not supported for reasoning models"
          });
        }
        if (baseArgs.logprobs != null) {
          baseArgs.logprobs = void 0;
          warnings.push({
            type: "other",
            message: "logprobs is not supported for reasoning models"
          });
        }
      }
      if (baseArgs.frequency_penalty != null) {
        baseArgs.frequency_penalty = void 0;
        warnings.push({
          type: "unsupported",
          feature: "frequencyPenalty",
          details: "frequencyPenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.presence_penalty != null) {
        baseArgs.presence_penalty = void 0;
        warnings.push({
          type: "unsupported",
          feature: "presencePenalty",
          details: "presencePenalty is not supported for reasoning models"
        });
      }
      if (baseArgs.logit_bias != null) {
        baseArgs.logit_bias = void 0;
        warnings.push({
          type: "other",
          message: "logitBias is not supported for reasoning models"
        });
      }
      if (baseArgs.top_logprobs != null) {
        baseArgs.top_logprobs = void 0;
        warnings.push({
          type: "other",
          message: "topLogprobs is not supported for reasoning models"
        });
      }
      if (baseArgs.max_tokens != null) {
        if (baseArgs.max_completion_tokens == null) {
          baseArgs.max_completion_tokens = baseArgs.max_tokens;
        }
        baseArgs.max_tokens = void 0;
      }
    } else if (this.modelId.startsWith("gpt-4o-search-preview") || this.modelId.startsWith("gpt-4o-mini-search-preview")) {
      if (baseArgs.temperature != null) {
        baseArgs.temperature = void 0;
        warnings.push({
          type: "unsupported",
          feature: "temperature",
          details: "temperature is not supported for the search preview models and has been removed."
        });
      }
    }
    if (openaiOptions.serviceTier === "flex" && !modelCapabilities.supportsFlexProcessing) {
      warnings.push({
        type: "unsupported",
        feature: "serviceTier",
        details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
      });
      baseArgs.service_tier = void 0;
    }
    if (openaiOptions.serviceTier === "priority" && !modelCapabilities.supportsPriorityProcessing) {
      warnings.push({
        type: "unsupported",
        feature: "serviceTier",
        details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
      });
      baseArgs.service_tier = void 0;
    }
    const {
      tools: openaiTools2,
      toolChoice: openaiToolChoice,
      toolWarnings
    } = prepareChatTools({
      tools,
      toolChoice
    });
    return {
      args: {
        ...baseArgs,
        tools: openaiTools2,
        tool_choice: openaiToolChoice
      },
      warnings: [...warnings, ...toolWarnings]
    };
  }
  async doGenerate(options) {
    var _a24, _b18, _c, _d, _e, _f, _g, _h;
    const { args: body, warnings } = await this.getArgs(options);
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi({
      url: this.config.url({
        path: "/chat/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders((_b18 = (_a24 = this.config).headers) == null ? void 0 : _b18.call(_a24), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const choice2 = response.choices[0];
    const content = [];
    const text2 = choice2.message.content;
    if (text2 != null && text2.length > 0) {
      content.push({ type: "text", text: text2 });
    }
    for (const toolCall of (_c = choice2.message.tool_calls) != null ? _c : []) {
      content.push({
        type: "tool-call",
        toolCallId: (_d = toolCall.id) != null ? _d : generateId(),
        toolName: toolCall.function.name,
        input: toolCall.function.arguments
      });
    }
    for (const annotation of (_e = choice2.message.annotations) != null ? _e : []) {
      content.push({
        type: "source",
        sourceType: "url",
        id: generateId(),
        url: annotation.url_citation.url,
        title: annotation.url_citation.title
      });
    }
    const completionTokenDetails = (_f = response.usage) == null ? void 0 : _f.completion_tokens_details;
    const providerMetadata = { openai: {} };
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens) != null) {
      providerMetadata.openai.acceptedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.accepted_prediction_tokens;
    }
    if ((completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens) != null) {
      providerMetadata.openai.rejectedPredictionTokens = completionTokenDetails == null ? void 0 : completionTokenDetails.rejected_prediction_tokens;
    }
    if (((_g = choice2.logprobs) == null ? void 0 : _g.content) != null) {
      providerMetadata.openai.logprobs = choice2.logprobs.content;
    }
    return {
      content,
      finishReason: {
        unified: mapOpenAIFinishReason(choice2.finish_reason),
        raw: (_h = choice2.finish_reason) != null ? _h : void 0
      },
      usage: convertOpenAIChatUsage(response.usage),
      request: { body },
      response: {
        ...getResponseMetadata(response),
        headers: responseHeaders,
        body: rawResponse
      },
      warnings,
      providerMetadata
    };
  }
  async doStream(options) {
    var _a24, _b18;
    const { args, warnings } = await this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      stream_options: {
        include_usage: true
      }
    };
    const url = this.config.url({
      path: "/chat/completions",
      modelId: this.modelId
    });
    const { responseHeaders, value: response } = await postJsonToApi({
      url,
      headers: combineHeaders((_b18 = (_a24 = this.config).headers) == null ? void 0 : _b18.call(_a24), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        openaiChatChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const checkedResponse = await throwIfOpenAIStreamErrorBeforeOutput({
      stream: response,
      getError: /* @__PURE__ */ __name((chunk) => "error" in chunk ? chunk.error : void 0, "getError"),
      isOutputChunk: isOpenAIChatOutputChunk,
      url,
      requestBodyValues: body,
      responseHeaders
    });
    let toolCallTracker;
    let finishReason = {
      unified: "other",
      raw: void 0
    };
    let usage = void 0;
    let metadataExtracted = false;
    let isActiveText = false;
    const providerMetadata = { openai: {} };
    const result = {
      stream: checkedResponse.pipeThrough(
        new TransformStream({
          start(controller) {
            toolCallTracker = new StreamingToolCallTracker(controller, {
              generateId,
              typeValidation: "if-present"
            });
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a25, _b23, _c, _d, _e;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              finishReason = { unified: "error", raw: void 0 };
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = { unified: "error", raw: void 0 };
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (!metadataExtracted) {
              const metadata = getResponseMetadata(value);
              if (Object.values(metadata).some(Boolean)) {
                metadataExtracted = true;
                controller.enqueue({
                  type: "response-metadata",
                  ...getResponseMetadata(value)
                });
              }
            }
            if (value.usage != null) {
              usage = value.usage;
              if (((_a25 = value.usage.completion_tokens_details) == null ? void 0 : _a25.accepted_prediction_tokens) != null) {
                providerMetadata.openai.acceptedPredictionTokens = (_b23 = value.usage.completion_tokens_details) == null ? void 0 : _b23.accepted_prediction_tokens;
              }
              if (((_c = value.usage.completion_tokens_details) == null ? void 0 : _c.rejected_prediction_tokens) != null) {
                providerMetadata.openai.rejectedPredictionTokens = (_d = value.usage.completion_tokens_details) == null ? void 0 : _d.rejected_prediction_tokens;
              }
            }
            const choice2 = value.choices[0];
            if ((choice2 == null ? void 0 : choice2.finish_reason) != null) {
              finishReason = {
                unified: mapOpenAIFinishReason(choice2.finish_reason),
                raw: choice2.finish_reason
              };
            }
            if (((_e = choice2 == null ? void 0 : choice2.logprobs) == null ? void 0 : _e.content) != null) {
              providerMetadata.openai.logprobs = choice2.logprobs.content;
            }
            if ((choice2 == null ? void 0 : choice2.delta) == null) {
              return;
            }
            const delta = choice2.delta;
            if (delta.content != null) {
              if (!isActiveText) {
                controller.enqueue({ type: "text-start", id: "0" });
                isActiveText = true;
              }
              controller.enqueue({
                type: "text-delta",
                id: "0",
                delta: delta.content
              });
            }
            if (delta.tool_calls != null) {
              for (const toolCallDelta of delta.tool_calls) {
                toolCallTracker.processDelta(toolCallDelta);
              }
            }
            if (delta.annotations != null) {
              for (const annotation of delta.annotations) {
                controller.enqueue({
                  type: "source",
                  sourceType: "url",
                  id: generateId(),
                  url: annotation.url_citation.url,
                  title: annotation.url_citation.title
                });
              }
            }
          },
          flush(controller) {
            if (isActiveText) {
              controller.enqueue({ type: "text-end", id: "0" });
            }
            toolCallTracker.flush();
            controller.enqueue({
              type: "finish",
              finishReason,
              usage: convertOpenAIChatUsage(usage),
              ...providerMetadata != null ? { providerMetadata } : {}
            });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
    return result;
  }
};
function isOpenAIChatOutputChunk(chunk) {
  if ("error" in chunk) {
    return false;
  }
  return chunk.choices.some((choice2) => {
    const delta = choice2.delta;
    return (delta == null ? void 0 : delta.content) != null && delta.content.length > 0 || (delta == null ? void 0 : delta.tool_calls) != null && delta.tool_calls.length > 0 || (delta == null ? void 0 : delta.annotations) != null && delta.annotations.length > 0;
  });
}
__name(isOpenAIChatOutputChunk, "isOpenAIChatOutputChunk");
function convertOpenAICompletionUsage(usage) {
  var _a24, _b18, _c, _d;
  if (usage == null) {
    return {
      inputTokens: {
        total: void 0,
        noCache: void 0,
        cacheRead: void 0,
        cacheWrite: void 0
      },
      outputTokens: {
        total: void 0,
        text: void 0,
        reasoning: void 0
      },
      raw: void 0
    };
  }
  const promptTokens = (_a24 = usage.prompt_tokens) != null ? _a24 : 0;
  const completionTokens = (_b18 = usage.completion_tokens) != null ? _b18 : 0;
  return {
    inputTokens: {
      total: (_c = usage.prompt_tokens) != null ? _c : void 0,
      noCache: promptTokens,
      cacheRead: void 0,
      cacheWrite: void 0
    },
    outputTokens: {
      total: (_d = usage.completion_tokens) != null ? _d : void 0,
      text: completionTokens,
      reasoning: void 0
    },
    raw: usage
  };
}
__name(convertOpenAICompletionUsage, "convertOpenAICompletionUsage");
function convertToOpenAICompletionPrompt({
  prompt,
  user = "user",
  assistant = "assistant"
}) {
  let text2 = "";
  if (prompt[0].role === "system") {
    text2 += `${prompt[0].content}

`;
    prompt = prompt.slice(1);
  }
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        throw new InvalidPromptError({
          message: "Unexpected system message in prompt: ${content}",
          prompt
        });
      }
      case "user": {
        const userMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
          }
        }).filter(Boolean).join("");
        text2 += `${user}:
${userMessage}

`;
        break;
      }
      case "assistant": {
        const assistantMessage = content.map((part) => {
          switch (part.type) {
            case "text": {
              return part.text;
            }
            case "tool-call": {
              throw new UnsupportedFunctionalityError({
                functionality: "tool-call messages"
              });
            }
          }
        }).join("");
        text2 += `${assistant}:
${assistantMessage}

`;
        break;
      }
      case "tool": {
        throw new UnsupportedFunctionalityError({
          functionality: "tool messages"
        });
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  text2 += `${assistant}:
`;
  return {
    prompt: text2,
    stopSequences: [`
${user}:`]
  };
}
__name(convertToOpenAICompletionPrompt, "convertToOpenAICompletionPrompt");
function getResponseMetadata2({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}
__name(getResponseMetadata2, "getResponseMetadata2");
function mapOpenAIFinishReason2(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content-filter";
    case "function_call":
    case "tool_calls":
      return "tool-calls";
    default:
      return "other";
  }
}
__name(mapOpenAIFinishReason2, "mapOpenAIFinishReason2");
var openaiCompletionResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      id: external_exports.string().nullish(),
      created: external_exports.number().nullish(),
      model: external_exports.string().nullish(),
      choices: external_exports.array(
        external_exports.object({
          text: external_exports.string(),
          finish_reason: external_exports.string(),
          logprobs: external_exports.object({
            tokens: external_exports.array(external_exports.string()),
            token_logprobs: external_exports.array(external_exports.number()),
            top_logprobs: external_exports.array(external_exports.record(external_exports.string(), external_exports.number())).nullish()
          }).nullish()
        })
      ),
      usage: external_exports.object({
        prompt_tokens: external_exports.number(),
        completion_tokens: external_exports.number(),
        total_tokens: external_exports.number()
      }).nullish()
    })
  )
);
var openaiCompletionChunkSchema = lazySchema(
  () => zodSchema(
    external_exports.union([
      external_exports.object({
        id: external_exports.string().nullish(),
        created: external_exports.number().nullish(),
        model: external_exports.string().nullish(),
        choices: external_exports.array(
          external_exports.object({
            text: external_exports.string(),
            finish_reason: external_exports.string().nullish(),
            index: external_exports.number(),
            logprobs: external_exports.object({
              tokens: external_exports.array(external_exports.string()),
              token_logprobs: external_exports.array(external_exports.number()),
              top_logprobs: external_exports.array(external_exports.record(external_exports.string(), external_exports.number())).nullish()
            }).nullish()
          })
        ),
        usage: external_exports.object({
          prompt_tokens: external_exports.number(),
          completion_tokens: external_exports.number(),
          total_tokens: external_exports.number()
        }).nullish()
      }),
      openaiErrorDataSchema
    ])
  )
);
var openaiLanguageModelCompletionOptions = lazySchema(
  () => zodSchema(
    external_exports.object({
      /**
       * Echo back the prompt in addition to the completion.
       */
      echo: external_exports.boolean().optional(),
      /**
       * Modify the likelihood of specified tokens appearing in the completion.
       *
       * Accepts a JSON object that maps tokens (specified by their token ID in
       * the GPT tokenizer) to an associated bias value from -100 to 100. You
       * can use this tokenizer tool to convert text to token IDs. Mathematically,
       * the bias is added to the logits generated by the model prior to sampling.
       * The exact effect will vary per model, but values between -1 and 1 should
       * decrease or increase likelihood of selection; values like -100 or 100
       * should result in a ban or exclusive selection of the relevant token.
       *
       * As an example, you can pass {"50256": -100} to prevent the <|endoftext|>
       * token from being generated.
       */
      logitBias: external_exports.record(external_exports.string(), external_exports.number()).optional(),
      /**
       * The suffix that comes after a completion of inserted text.
       */
      suffix: external_exports.string().optional(),
      /**
       * A unique identifier representing your end-user, which can help OpenAI to
       * monitor and detect abuse. Learn more.
       */
      user: external_exports.string().optional(),
      /**
       * Return the log probabilities of the tokens. Including logprobs will increase
       * the response size and can slow down response times. However, it can
       * be useful to better understand how the model is behaving.
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       */
      logprobs: external_exports.union([external_exports.boolean(), external_exports.number()]).optional()
    })
  )
);
var OpenAICompletionLanguageModel = class _OpenAICompletionLanguageModel {
  static {
    __name(this, "_OpenAICompletionLanguageModel");
  }
  constructor(modelId, config) {
    this.specificationVersion = "v4";
    this.supportedUrls = {
      // No URLs are supported for completion models.
    };
    this.modelId = modelId;
    this.config = config;
  }
  get providerOptionsName() {
    return this.config.provider.split(".")[0].trim();
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _OpenAICompletionLanguageModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences: userStopSequences,
    responseFormat,
    tools,
    toolChoice,
    seed,
    providerOptions
  }) {
    const warnings = [];
    const openaiOptions = {
      ...await parseProviderOptions({
        provider: "openai",
        providerOptions,
        schema: openaiLanguageModelCompletionOptions
      }),
      ...await parseProviderOptions({
        provider: this.providerOptionsName,
        providerOptions,
        schema: openaiLanguageModelCompletionOptions
      })
    };
    if (topK != null) {
      warnings.push({ type: "unsupported", feature: "topK" });
    }
    if (tools == null ? void 0 : tools.length) {
      warnings.push({ type: "unsupported", feature: "tools" });
    }
    if (toolChoice != null) {
      warnings.push({ type: "unsupported", feature: "toolChoice" });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported",
        feature: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { prompt: completionPrompt, stopSequences } = convertToOpenAICompletionPrompt({ prompt });
    const stop = [...stopSequences != null ? stopSequences : [], ...userStopSequences != null ? userStopSequences : []];
    return {
      args: {
        // model id:
        model: this.modelId,
        // model specific settings:
        echo: openaiOptions.echo,
        logit_bias: openaiOptions.logitBias,
        logprobs: (openaiOptions == null ? void 0 : openaiOptions.logprobs) === true ? 0 : (openaiOptions == null ? void 0 : openaiOptions.logprobs) === false ? void 0 : openaiOptions == null ? void 0 : openaiOptions.logprobs,
        suffix: openaiOptions.suffix,
        user: openaiOptions.user,
        // standardized settings:
        max_tokens: maxOutputTokens,
        temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        seed,
        // prompt:
        prompt: completionPrompt,
        // stop sequences:
        stop: stop.length > 0 ? stop : void 0
      },
      warnings
    };
  }
  async doGenerate(options) {
    var _a24, _b18, _c;
    const { args, warnings } = await this.getArgs(options);
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi({
      url: this.config.url({
        path: "/completions",
        modelId: this.modelId
      }),
      headers: combineHeaders((_b18 = (_a24 = this.config).headers) == null ? void 0 : _b18.call(_a24), options.headers),
      body: args,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiCompletionResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const choice2 = response.choices[0];
    const providerMetadata = { openai: {} };
    if (choice2.logprobs != null) {
      providerMetadata.openai.logprobs = choice2.logprobs;
    }
    return {
      content: [{ type: "text", text: choice2.text }],
      usage: convertOpenAICompletionUsage(response.usage),
      finishReason: {
        unified: mapOpenAIFinishReason2(choice2.finish_reason),
        raw: (_c = choice2.finish_reason) != null ? _c : void 0
      },
      request: { body: args },
      response: {
        ...getResponseMetadata2(response),
        headers: responseHeaders,
        body: rawResponse
      },
      providerMetadata,
      warnings
    };
  }
  async doStream(options) {
    var _a24, _b18;
    const { args, warnings } = await this.getArgs(options);
    const body = {
      ...args,
      stream: true,
      stream_options: {
        include_usage: true
      }
    };
    const url = this.config.url({
      path: "/completions",
      modelId: this.modelId
    });
    const { responseHeaders, value: response } = await postJsonToApi({
      url,
      headers: combineHeaders((_b18 = (_a24 = this.config).headers) == null ? void 0 : _b18.call(_a24), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        openaiCompletionChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const checkedResponse = await throwIfOpenAIStreamErrorBeforeOutput({
      stream: response,
      getError: /* @__PURE__ */ __name((chunk) => "error" in chunk ? chunk.error : void 0, "getError"),
      isOutputChunk: isOpenAICompletionOutputChunk,
      url,
      requestBodyValues: body,
      responseHeaders
    });
    let finishReason = {
      unified: "other",
      raw: void 0
    };
    const providerMetadata = { openai: {} };
    let usage = void 0;
    let isFirstChunk = true;
    const result = {
      stream: checkedResponse.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              finishReason = { unified: "error", raw: void 0 };
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if ("error" in value) {
              finishReason = { unified: "error", raw: void 0 };
              controller.enqueue({ type: "error", error: value.error });
              return;
            }
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata2(value)
              });
              controller.enqueue({ type: "text-start", id: "0" });
            }
            if (value.usage != null) {
              usage = value.usage;
            }
            const choice2 = value.choices[0];
            if ((choice2 == null ? void 0 : choice2.finish_reason) != null) {
              finishReason = {
                unified: mapOpenAIFinishReason2(choice2.finish_reason),
                raw: choice2.finish_reason
              };
            }
            if ((choice2 == null ? void 0 : choice2.logprobs) != null) {
              providerMetadata.openai.logprobs = choice2.logprobs;
            }
            if ((choice2 == null ? void 0 : choice2.text) != null && choice2.text.length > 0) {
              controller.enqueue({
                type: "text-delta",
                id: "0",
                delta: choice2.text
              });
            }
          },
          flush(controller) {
            if (!isFirstChunk) {
              controller.enqueue({ type: "text-end", id: "0" });
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              providerMetadata,
              usage: convertOpenAICompletionUsage(usage)
            });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
    return result;
  }
};
function isOpenAICompletionOutputChunk(chunk) {
  return !("error" in chunk) && chunk.choices.some((choice2) => choice2.text.length > 0);
}
__name(isOpenAICompletionOutputChunk, "isOpenAICompletionOutputChunk");
var openaiEmbeddingModelOptions = lazySchema(
  () => zodSchema(
    external_exports.object({
      /**
       * The number of dimensions the resulting output embeddings should have.
       * Only supported in text-embedding-3 and later models.
       */
      dimensions: external_exports.number().optional(),
      /**
       * A unique identifier representing your end-user, which can help OpenAI to
       * monitor and detect abuse. Learn more.
       */
      user: external_exports.string().optional()
    })
  )
);
var openaiTextEmbeddingResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      data: external_exports.array(external_exports.object({ embedding: external_exports.array(external_exports.number()) })),
      usage: external_exports.object({ prompt_tokens: external_exports.number() }).nullish()
    })
  )
);
var OpenAIEmbeddingModel = class _OpenAIEmbeddingModel {
  static {
    __name(this, "_OpenAIEmbeddingModel");
  }
  constructor(modelId, config) {
    this.specificationVersion = "v4";
    this.maxEmbeddingsPerCall = 2048;
    this.supportsParallelCalls = true;
    this.modelId = modelId;
    this.config = config;
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _OpenAIEmbeddingModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values,
    headers,
    abortSignal,
    providerOptions
  }) {
    var _a24, _b18, _c;
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const openaiOptions = (_a24 = await parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: openaiEmbeddingModelOptions
    })) != null ? _a24 : {};
    const {
      responseHeaders,
      value: response,
      rawValue
    } = await postJsonToApi({
      url: this.config.url({
        path: "/embeddings",
        modelId: this.modelId
      }),
      headers: combineHeaders((_c = (_b18 = this.config).headers) == null ? void 0 : _c.call(_b18), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float",
        dimensions: openaiOptions.dimensions,
        user: openaiOptions.user
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiTextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      warnings: [],
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      response: { headers: responseHeaders, body: rawValue }
    };
  }
};
var openaiFilesResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      id: external_exports.string(),
      object: external_exports.string().nullish(),
      bytes: external_exports.number().nullish(),
      created_at: external_exports.number().nullish(),
      filename: external_exports.string().nullish(),
      purpose: external_exports.string().nullish(),
      status: external_exports.string().nullish(),
      expires_at: external_exports.number().nullish()
    })
  )
);
var openaiFilesOptionsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      /*
       * Required by the OpenAI API, but optional here because
       * the SDK defaults to "assistants" — by far the most common
       * purpose when uploading files in this context.
       */
      purpose: external_exports.string().optional(),
      expiresAfter: external_exports.number().optional()
    })
  )
);
var OpenAIFiles = class {
  static {
    __name(this, "OpenAIFiles");
  }
  constructor(config) {
    this.config = config;
    this.specificationVersion = "v4";
  }
  get provider() {
    return this.config.provider;
  }
  async uploadFile({
    data,
    mediaType,
    filename,
    providerOptions
  }) {
    var _a24, _b18, _c;
    const openaiOptions = await parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: openaiFilesOptionsSchema
    });
    const fileBytes = convertInlineFileDataToUint8Array(data);
    const blob = new Blob([fileBytes], {
      type: mediaType
    });
    const formData = new FormData();
    if (filename != null) {
      formData.append("file", blob, filename);
    } else {
      formData.append("file", blob);
    }
    formData.append("purpose", (_a24 = openaiOptions == null ? void 0 : openaiOptions.purpose) != null ? _a24 : "assistants");
    if ((openaiOptions == null ? void 0 : openaiOptions.expiresAfter) != null) {
      formData.append("expires_after", String(openaiOptions.expiresAfter));
    }
    const { value: response } = await postFormDataToApi({
      url: `${this.config.baseURL}/files`,
      headers: combineHeaders(this.config.headers()),
      formData,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiFilesResponseSchema
      ),
      fetch: this.config.fetch
    });
    return {
      warnings: [],
      providerReference: { openai: response.id },
      ...((_b18 = response.filename) != null ? _b18 : filename) ? { filename: (_c = response.filename) != null ? _c : filename } : {},
      ...mediaType != null ? { mediaType } : {},
      providerMetadata: {
        openai: {
          ...response.filename != null ? { filename: response.filename } : {},
          ...response.purpose != null ? { purpose: response.purpose } : {},
          ...response.bytes != null ? { bytes: response.bytes } : {},
          ...response.created_at != null ? { createdAt: response.created_at } : {},
          ...response.status != null ? { status: response.status } : {},
          ...response.expires_at != null ? { expiresAt: response.expires_at } : {}
        }
      }
    };
  }
};
var openaiImageResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      created: external_exports.number().nullish(),
      data: external_exports.array(
        external_exports.object({
          b64_json: external_exports.string(),
          revised_prompt: external_exports.string().nullish()
        })
      ),
      background: external_exports.string().nullish(),
      output_format: external_exports.string().nullish(),
      size: external_exports.string().nullish(),
      quality: external_exports.string().nullish(),
      usage: external_exports.object({
        input_tokens: external_exports.number().nullish(),
        output_tokens: external_exports.number().nullish(),
        total_tokens: external_exports.number().nullish(),
        input_tokens_details: external_exports.object({
          image_tokens: external_exports.number().nullish(),
          text_tokens: external_exports.number().nullish()
        }).nullish()
      }).nullish()
    })
  )
);
var modelMaxImagesPerCall = {
  "dall-e-3": 1,
  "dall-e-2": 10,
  "gpt-image-1": 10,
  "gpt-image-1-mini": 10,
  "gpt-image-1.5": 10,
  "gpt-image-2": 10,
  "chatgpt-image-latest": 10
};
var defaultResponseFormatPrefixes = [
  "chatgpt-image-",
  "gpt-image-1-mini",
  "gpt-image-1.5",
  "gpt-image-1",
  "gpt-image-2"
];
function hasDefaultResponseFormat(modelId) {
  return defaultResponseFormatPrefixes.some(
    (prefix) => modelId.startsWith(prefix)
  );
}
__name(hasDefaultResponseFormat, "hasDefaultResponseFormat");
var baseImageModelOptionsObject = external_exports.object({
  /**
   * Quality of the generated image(s).
   *
   * Valid values: `standard`, `hd`, `low`, `medium`, `high`, `auto`.
   */
  quality: external_exports.enum(["standard", "hd", "low", "medium", "high", "auto"]).optional(),
  /**
   * Background behavior for the generated image(s).
   *
   * If `transparent`, the output format must support transparency
   * (i.e. `png` or `webp`).
   */
  background: external_exports.enum(["transparent", "opaque", "auto"]).optional(),
  /**
   * Format in which the generated image(s) are returned.
   */
  outputFormat: external_exports.enum(["png", "jpeg", "webp"]).optional(),
  /**
   * Compression level (0-100) for the generated image(s). Applies to the
   * `jpeg` and `webp` output formats.
   */
  outputCompression: external_exports.number().int().min(0).max(100).optional(),
  /**
   * A unique identifier representing your end-user, which can help OpenAI
   * to monitor and detect abuse.
   */
  user: external_exports.string().optional()
});
var openaiImageModelOptions = lazySchema(
  () => zodSchema(baseImageModelOptionsObject)
);
var openaiImageModelGenerationOptions = lazySchema(
  () => zodSchema(
    baseImageModelOptionsObject.extend({
      /**
       * Style of the generated image. `vivid` produces hyper-real and
       * dramatic images; `natural` produces more subdued, less hyper-real
       * looking images.
       */
      style: external_exports.enum(["vivid", "natural"]).optional(),
      /**
       * Content moderation level for the generated image(s). `low` applies
       * less restrictive filtering.
       */
      moderation: external_exports.enum(["auto", "low"]).optional()
    })
  )
);
var openaiImageModelEditOptions = lazySchema(
  () => zodSchema(
    baseImageModelOptionsObject.extend({
      /**
       * Fidelity of the output image(s) to the input image(s).
       */
      inputFidelity: external_exports.enum(["high", "low"]).optional()
    })
  )
);
var OpenAIImageModel = class _OpenAIImageModel {
  static {
    __name(this, "_OpenAIImageModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _OpenAIImageModel(options.modelId, options.config);
  }
  get maxImagesPerCall() {
    var _a24;
    return (_a24 = modelMaxImagesPerCall[this.modelId]) != null ? _a24 : 1;
  }
  get provider() {
    return this.config.provider;
  }
  async doGenerate({
    prompt,
    files,
    mask,
    n,
    size,
    aspectRatio,
    seed,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a24, _b18, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    const warnings = [];
    if (aspectRatio != null) {
      warnings.push({
        type: "unsupported",
        feature: "aspectRatio",
        details: "This model does not support aspect ratio. Use `size` instead."
      });
    }
    if (seed != null) {
      warnings.push({ type: "unsupported", feature: "seed" });
    }
    const currentDate = (_c = (_b18 = (_a24 = this.config._internal) == null ? void 0 : _a24.currentDate) == null ? void 0 : _b18.call(_a24)) != null ? _c : /* @__PURE__ */ new Date();
    if (files != null) {
      const openaiOptions2 = (_d = await parseProviderOptions({
        provider: "openai",
        providerOptions,
        schema: openaiImageModelEditOptions
      })) != null ? _d : {};
      const { value: response2, responseHeaders: responseHeaders2 } = await postFormDataToApi({
        url: this.config.url({
          path: "/images/edits",
          modelId: this.modelId
        }),
        headers: combineHeaders((_f = (_e = this.config).headers) == null ? void 0 : _f.call(_e), headers),
        formData: convertToFormData({
          model: this.modelId,
          prompt,
          image: await Promise.all(
            files.map(
              (file) => file.type === "file" ? new Blob(
                [
                  file.data instanceof Uint8Array ? new Blob([file.data], {
                    type: file.mediaType
                  }) : new Blob([convertBase64ToUint8Array(file.data)], {
                    type: file.mediaType
                  })
                ],
                { type: file.mediaType }
              ) : downloadBlob(file.url)
            )
          ),
          mask: mask != null ? await fileToBlob(mask) : void 0,
          n,
          size,
          quality: openaiOptions2.quality,
          background: openaiOptions2.background,
          output_format: openaiOptions2.outputFormat,
          output_compression: openaiOptions2.outputCompression,
          input_fidelity: openaiOptions2.inputFidelity,
          user: openaiOptions2.user
        }),
        failedResponseHandler: openaiFailedResponseHandler,
        successfulResponseHandler: createJsonResponseHandler(
          openaiImageResponseSchema
        ),
        abortSignal,
        fetch: this.config.fetch
      });
      return {
        images: response2.data.map((item) => item.b64_json),
        warnings,
        usage: response2.usage != null ? {
          inputTokens: (_g = response2.usage.input_tokens) != null ? _g : void 0,
          outputTokens: (_h = response2.usage.output_tokens) != null ? _h : void 0,
          totalTokens: (_i = response2.usage.total_tokens) != null ? _i : void 0
        } : void 0,
        response: {
          timestamp: currentDate,
          modelId: this.modelId,
          headers: responseHeaders2
        },
        providerMetadata: {
          openai: {
            images: response2.data.map((item, index) => {
              var _a25, _b23, _c2, _d2, _e2, _f2;
              return {
                ...item.revised_prompt ? { revisedPrompt: item.revised_prompt } : {},
                created: (_a25 = response2.created) != null ? _a25 : void 0,
                size: (_b23 = response2.size) != null ? _b23 : void 0,
                quality: (_c2 = response2.quality) != null ? _c2 : void 0,
                background: (_d2 = response2.background) != null ? _d2 : void 0,
                outputFormat: (_e2 = response2.output_format) != null ? _e2 : void 0,
                ...distributeTokenDetails(
                  (_f2 = response2.usage) == null ? void 0 : _f2.input_tokens_details,
                  index,
                  response2.data.length
                )
              };
            })
          }
        }
      };
    }
    const openaiOptions = (_j = await parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: openaiImageModelGenerationOptions
    })) != null ? _j : {};
    const { value: response, responseHeaders } = await postJsonToApi({
      url: this.config.url({
        path: "/images/generations",
        modelId: this.modelId
      }),
      headers: combineHeaders((_l = (_k = this.config).headers) == null ? void 0 : _l.call(_k), headers),
      body: {
        model: this.modelId,
        prompt,
        n,
        size,
        quality: openaiOptions.quality,
        style: openaiOptions.style,
        background: openaiOptions.background,
        moderation: openaiOptions.moderation,
        output_format: openaiOptions.outputFormat,
        output_compression: openaiOptions.outputCompression,
        user: openaiOptions.user,
        ...!hasDefaultResponseFormat(this.modelId) ? { response_format: "b64_json" } : {}
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiImageResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      images: response.data.map((item) => item.b64_json),
      warnings,
      usage: response.usage != null ? {
        inputTokens: (_m = response.usage.input_tokens) != null ? _m : void 0,
        outputTokens: (_n = response.usage.output_tokens) != null ? _n : void 0,
        totalTokens: (_o = response.usage.total_tokens) != null ? _o : void 0
      } : void 0,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders
      },
      providerMetadata: {
        openai: {
          images: response.data.map((item, index) => {
            var _a25, _b23, _c2, _d2, _e2, _f2;
            return {
              ...item.revised_prompt ? { revisedPrompt: item.revised_prompt } : {},
              created: (_a25 = response.created) != null ? _a25 : void 0,
              size: (_b23 = response.size) != null ? _b23 : void 0,
              quality: (_c2 = response.quality) != null ? _c2 : void 0,
              background: (_d2 = response.background) != null ? _d2 : void 0,
              outputFormat: (_e2 = response.output_format) != null ? _e2 : void 0,
              ...distributeTokenDetails(
                (_f2 = response.usage) == null ? void 0 : _f2.input_tokens_details,
                index,
                response.data.length
              )
            };
          })
        }
      }
    };
  }
};
function distributeTokenDetails(details, index, total) {
  if (details == null) {
    return {};
  }
  const result = {};
  if (details.image_tokens != null) {
    const base = Math.floor(details.image_tokens / total);
    const remainder = details.image_tokens - base * (total - 1);
    result.imageTokens = index === total - 1 ? remainder : base;
  }
  if (details.text_tokens != null) {
    const base = Math.floor(details.text_tokens / total);
    const remainder = details.text_tokens - base * (total - 1);
    result.textTokens = index === total - 1 ? remainder : base;
  }
  return result;
}
__name(distributeTokenDetails, "distributeTokenDetails");
async function fileToBlob(file) {
  if (!file) return void 0;
  if (file.type === "url") {
    return downloadBlob(file.url);
  }
  const data = file.data instanceof Uint8Array ? file.data : convertBase64ToUint8Array(file.data);
  return new Blob([data], { type: file.mediaType });
}
__name(fileToBlob, "fileToBlob");
var applyPatchInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      callId: external_exports.string(),
      operation: external_exports.discriminatedUnion("type", [
        external_exports.object({
          type: external_exports.literal("create_file"),
          path: external_exports.string(),
          diff: external_exports.string()
        }),
        external_exports.object({
          type: external_exports.literal("delete_file"),
          path: external_exports.string()
        }),
        external_exports.object({
          type: external_exports.literal("update_file"),
          path: external_exports.string(),
          diff: external_exports.string()
        })
      ])
    })
  )
);
var applyPatchOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      status: external_exports.enum(["completed", "failed"]),
      output: external_exports.string().optional()
    })
  )
);
var applyPatchArgsSchema = lazySchema(() => zodSchema(external_exports.object({})));
var applyPatchToolFactory = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.apply_patch",
  inputSchema: applyPatchInputSchema,
  outputSchema: applyPatchOutputSchema
});
var applyPatch = applyPatchToolFactory;
var codeInterpreterInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      code: external_exports.string().nullish(),
      containerId: external_exports.string()
    })
  )
);
var codeInterpreterOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      outputs: external_exports.array(
        external_exports.discriminatedUnion("type", [
          external_exports.object({ type: external_exports.literal("logs"), logs: external_exports.string() }),
          external_exports.object({ type: external_exports.literal("image"), url: external_exports.string() })
        ])
      ).nullish()
    })
  )
);
var codeInterpreterArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      container: external_exports.union([
        external_exports.string(),
        external_exports.object({
          fileIds: external_exports.array(external_exports.string()).optional()
        })
      ]).optional()
    })
  )
);
var codeInterpreterToolFactory = createProviderExecutedToolFactory({
  id: "openai.code_interpreter",
  inputSchema: codeInterpreterInputSchema,
  outputSchema: codeInterpreterOutputSchema
});
var codeInterpreter = /* @__PURE__ */ __name((args = {}) => {
  return codeInterpreterToolFactory(args);
}, "codeInterpreter");
var safetyCheckSchema = external_exports.object({
  id: external_exports.string(),
  code: external_exports.string().optional(),
  message: external_exports.string().optional()
});
var computerActionSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("click"),
    button: external_exports.enum(["left", "right", "wheel", "back", "forward"]),
    x: external_exports.number(),
    y: external_exports.number(),
    keys: external_exports.array(external_exports.string()).optional()
  }),
  external_exports.object({
    type: external_exports.literal("double_click"),
    x: external_exports.number(),
    y: external_exports.number(),
    keys: external_exports.array(external_exports.string()).optional()
  }),
  external_exports.object({
    type: external_exports.literal("drag"),
    path: external_exports.array(external_exports.object({ x: external_exports.number(), y: external_exports.number() })),
    keys: external_exports.array(external_exports.string()).optional()
  }),
  external_exports.object({
    type: external_exports.literal("keypress"),
    keys: external_exports.array(external_exports.string())
  }),
  external_exports.object({
    type: external_exports.literal("move"),
    x: external_exports.number(),
    y: external_exports.number(),
    keys: external_exports.array(external_exports.string()).optional()
  }),
  external_exports.object({
    type: external_exports.literal("screenshot")
  }),
  external_exports.object({
    type: external_exports.literal("scroll"),
    x: external_exports.number(),
    y: external_exports.number(),
    scrollX: external_exports.number(),
    scrollY: external_exports.number(),
    keys: external_exports.array(external_exports.string()).optional()
  }),
  external_exports.object({
    type: external_exports.literal("type"),
    text: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("wait")
  })
]);
var computerInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      actions: external_exports.array(computerActionSchema),
      pendingSafetyChecks: external_exports.array(safetyCheckSchema),
      status: external_exports.enum(["in_progress", "completed", "incomplete"])
    })
  )
);
var computerOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      output: external_exports.union([
        external_exports.object({
          type: external_exports.literal("computer_screenshot"),
          imageUrl: external_exports.string(),
          fileId: external_exports.string().optional(),
          detail: external_exports.enum(["auto", "low", "high", "original"]).optional()
        }),
        external_exports.object({
          type: external_exports.literal("computer_screenshot"),
          fileId: external_exports.string(),
          imageUrl: external_exports.string().optional(),
          detail: external_exports.enum(["auto", "low", "high", "original"]).optional()
        })
      ]),
      acknowledgedSafetyChecks: external_exports.array(safetyCheckSchema).optional()
    })
  )
);
var computerToolFactory = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.computer",
  inputSchema: computerInputSchema,
  outputSchema: computerOutputSchema
});
var computer = /* @__PURE__ */ __name((options = {}) => computerToolFactory(options), "computer");
var customArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      description: external_exports.string().optional(),
      format: external_exports.union([
        external_exports.object({
          type: external_exports.literal("grammar"),
          syntax: external_exports.enum(["regex", "lark"]),
          definition: external_exports.string()
        }),
        external_exports.object({
          type: external_exports.literal("text")
        })
      ]).optional()
    })
  )
);
var customInputSchema = lazySchema(() => zodSchema(external_exports.string()));
var customToolFactory = createProviderDefinedToolFactory({
  id: "openai.custom",
  inputSchema: customInputSchema
});
var customTool = /* @__PURE__ */ __name((args) => customToolFactory(args), "customTool");
var comparisonFilterSchema = external_exports.object({
  key: external_exports.string(),
  type: external_exports.enum(["eq", "ne", "gt", "gte", "lt", "lte", "in", "nin"]),
  value: external_exports.union([external_exports.string(), external_exports.number(), external_exports.boolean(), external_exports.array(external_exports.string())])
});
var compoundFilterSchema = external_exports.object({
  type: external_exports.enum(["and", "or"]),
  filters: external_exports.array(
    external_exports.union([comparisonFilterSchema, external_exports.lazy(() => compoundFilterSchema)])
  )
});
var fileSearchArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      vectorStoreIds: external_exports.array(external_exports.string()),
      maxNumResults: external_exports.number().optional(),
      ranking: external_exports.object({
        ranker: external_exports.string().optional(),
        scoreThreshold: external_exports.number().optional()
      }).optional(),
      filters: external_exports.union([comparisonFilterSchema, compoundFilterSchema]).optional()
    })
  )
);
var fileSearchOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      queries: external_exports.array(external_exports.string()),
      results: external_exports.array(
        external_exports.object({
          attributes: external_exports.record(external_exports.string(), external_exports.unknown()),
          fileId: external_exports.string(),
          filename: external_exports.string(),
          score: external_exports.number(),
          text: external_exports.string()
        })
      ).nullable()
    })
  )
);
var fileSearch = createProviderExecutedToolFactory({
  id: "openai.file_search",
  inputSchema: external_exports.object({}),
  outputSchema: fileSearchOutputSchema
});
var imageGenerationArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      background: external_exports.enum(["auto", "opaque", "transparent"]).optional(),
      inputFidelity: external_exports.enum(["low", "high"]).optional(),
      inputImageMask: external_exports.object({
        fileId: external_exports.string().optional(),
        imageUrl: external_exports.string().optional()
      }).optional(),
      model: external_exports.string().optional(),
      moderation: external_exports.enum(["auto"]).optional(),
      outputCompression: external_exports.number().int().min(0).max(100).optional(),
      outputFormat: external_exports.enum(["png", "jpeg", "webp"]).optional(),
      partialImages: external_exports.number().int().min(0).max(3).optional(),
      quality: external_exports.enum(["auto", "low", "medium", "high"]).optional(),
      size: external_exports.enum(["1024x1024", "1024x1536", "1536x1024", "auto"]).optional()
    }).strict()
  )
);
var imageGenerationInputSchema = lazySchema(() => zodSchema(external_exports.object({})));
var imageGenerationOutputSchema = lazySchema(
  () => zodSchema(external_exports.object({ result: external_exports.string() }))
);
var imageGenerationToolFactory = createProviderExecutedToolFactory({
  id: "openai.image_generation",
  inputSchema: imageGenerationInputSchema,
  outputSchema: imageGenerationOutputSchema
});
var imageGeneration = /* @__PURE__ */ __name((args = {}) => {
  return imageGenerationToolFactory(args);
}, "imageGeneration");
var localShellInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      action: external_exports.object({
        type: external_exports.literal("exec"),
        command: external_exports.array(external_exports.string()),
        timeoutMs: external_exports.number().optional(),
        user: external_exports.string().optional(),
        workingDirectory: external_exports.string().optional(),
        env: external_exports.record(external_exports.string(), external_exports.string()).optional()
      })
    })
  )
);
var localShellOutputSchema = lazySchema(
  () => zodSchema(external_exports.object({ output: external_exports.string() }))
);
var localShell = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.local_shell",
  inputSchema: localShellInputSchema,
  outputSchema: localShellOutputSchema
});
var shellInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      action: external_exports.object({
        commands: external_exports.array(external_exports.string()),
        timeoutMs: external_exports.number().optional(),
        maxOutputLength: external_exports.number().optional()
      })
    })
  )
);
var shellOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      output: external_exports.array(
        external_exports.object({
          stdout: external_exports.string(),
          stderr: external_exports.string(),
          outcome: external_exports.discriminatedUnion("type", [
            external_exports.object({ type: external_exports.literal("timeout") }),
            external_exports.object({ type: external_exports.literal("exit"), exitCode: external_exports.number() })
          ])
        })
      )
    })
  )
);
var shellSkillsSchema = external_exports.array(
  external_exports.discriminatedUnion("type", [
    external_exports.object({
      type: external_exports.literal("skillReference"),
      providerReference: external_exports.record(external_exports.string(), external_exports.string()),
      version: external_exports.string().optional()
    }),
    external_exports.object({
      type: external_exports.literal("inline"),
      name: external_exports.string(),
      description: external_exports.string(),
      source: external_exports.object({
        type: external_exports.literal("base64"),
        mediaType: external_exports.literal("application/zip"),
        data: external_exports.string()
      })
    })
  ])
).optional();
var shellArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      environment: external_exports.union([
        external_exports.object({
          type: external_exports.literal("containerAuto"),
          fileIds: external_exports.array(external_exports.string()).optional(),
          memoryLimit: external_exports.enum(["1g", "4g", "16g", "64g"]).optional(),
          networkPolicy: external_exports.discriminatedUnion("type", [
            external_exports.object({ type: external_exports.literal("disabled") }),
            external_exports.object({
              type: external_exports.literal("allowlist"),
              allowedDomains: external_exports.array(external_exports.string()),
              domainSecrets: external_exports.array(
                external_exports.object({
                  domain: external_exports.string(),
                  name: external_exports.string(),
                  value: external_exports.string()
                })
              ).optional()
            })
          ]).optional(),
          skills: shellSkillsSchema
        }),
        external_exports.object({
          type: external_exports.literal("containerReference"),
          containerId: external_exports.string()
        }),
        external_exports.object({
          type: external_exports.literal("local").optional(),
          skills: external_exports.array(
            external_exports.object({
              name: external_exports.string(),
              description: external_exports.string(),
              path: external_exports.string()
            })
          ).optional()
        })
      ]).optional()
    })
  )
);
var shell = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.shell",
  inputSchema: shellInputSchema,
  outputSchema: shellOutputSchema
});
var toolSearchArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      execution: external_exports.enum(["server", "client"]).optional(),
      description: external_exports.string().optional(),
      parameters: external_exports.record(external_exports.string(), external_exports.unknown()).optional()
    })
  )
);
var toolSearchInputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      arguments: external_exports.unknown().optional(),
      call_id: external_exports.string().nullish()
    })
  )
);
var toolSearchOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      tools: external_exports.array(external_exports.record(external_exports.string(), external_exports.unknown()))
    })
  )
);
var toolSearchToolFactory = createProviderDefinedToolFactoryWithOutputSchema({
  id: "openai.tool_search",
  inputSchema: toolSearchInputSchema,
  outputSchema: toolSearchOutputSchema
});
var toolSearch = /* @__PURE__ */ __name((args = {}) => toolSearchToolFactory(args), "toolSearch");
var webSearchArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      externalWebAccess: external_exports.boolean().optional(),
      filters: external_exports.object({ allowedDomains: external_exports.array(external_exports.string()).optional() }).optional(),
      searchContextSize: external_exports.enum(["low", "medium", "high"]).optional(),
      userLocation: external_exports.object({
        type: external_exports.literal("approximate"),
        country: external_exports.string().optional(),
        city: external_exports.string().optional(),
        region: external_exports.string().optional(),
        timezone: external_exports.string().optional()
      }).optional()
    })
  )
);
var webSearchInputSchema = lazySchema(() => zodSchema(external_exports.object({})));
var webSearchOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      action: external_exports.discriminatedUnion("type", [
        external_exports.object({
          type: external_exports.literal("search"),
          query: external_exports.string().optional(),
          queries: external_exports.array(external_exports.string()).optional()
        }),
        external_exports.object({
          type: external_exports.literal("openPage"),
          url: external_exports.string().nullish()
        }),
        external_exports.object({
          type: external_exports.literal("findInPage"),
          url: external_exports.string().nullish(),
          pattern: external_exports.string().nullish()
        })
      ]).optional(),
      sources: external_exports.array(
        external_exports.discriminatedUnion("type", [
          external_exports.object({ type: external_exports.literal("url"), url: external_exports.string() }),
          external_exports.object({ type: external_exports.literal("api"), name: external_exports.string() })
        ])
      ).optional()
    })
  )
);
var webSearchToolFactory = createProviderExecutedToolFactory({
  id: "openai.web_search",
  inputSchema: webSearchInputSchema,
  outputSchema: webSearchOutputSchema
});
var webSearch = /* @__PURE__ */ __name((args = {}) => webSearchToolFactory(args), "webSearch");
var webSearchPreviewArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      searchContextSize: external_exports.enum(["low", "medium", "high"]).optional(),
      userLocation: external_exports.object({
        type: external_exports.literal("approximate"),
        country: external_exports.string().optional(),
        city: external_exports.string().optional(),
        region: external_exports.string().optional(),
        timezone: external_exports.string().optional()
      }).optional()
    })
  )
);
var webSearchPreviewInputSchema = lazySchema(
  () => zodSchema(external_exports.object({}))
);
var webSearchPreviewOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      action: external_exports.discriminatedUnion("type", [
        external_exports.object({
          type: external_exports.literal("search"),
          query: external_exports.string().optional()
        }),
        external_exports.object({
          type: external_exports.literal("openPage"),
          url: external_exports.string().nullish()
        }),
        external_exports.object({
          type: external_exports.literal("findInPage"),
          url: external_exports.string().nullish(),
          pattern: external_exports.string().nullish()
        })
      ]).optional()
    })
  )
);
var webSearchPreview = createProviderExecutedToolFactory({
  id: "openai.web_search_preview",
  inputSchema: webSearchPreviewInputSchema,
  outputSchema: webSearchPreviewOutputSchema
});
var jsonValueSchema2 = external_exports.lazy(
  () => external_exports.union([
    external_exports.string(),
    external_exports.number(),
    external_exports.boolean(),
    external_exports.null(),
    external_exports.array(jsonValueSchema2),
    external_exports.record(external_exports.string(), jsonValueSchema2)
  ])
);
var mcpArgsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      serverLabel: external_exports.string(),
      allowedTools: external_exports.union([
        external_exports.array(external_exports.string()),
        external_exports.object({
          readOnly: external_exports.boolean().optional(),
          toolNames: external_exports.array(external_exports.string()).optional()
        })
      ]).optional(),
      authorization: external_exports.string().optional(),
      connectorId: external_exports.string().optional(),
      headers: external_exports.record(external_exports.string(), external_exports.string()).optional(),
      requireApproval: external_exports.union([
        external_exports.enum(["always", "never"]),
        external_exports.object({
          never: external_exports.object({
            toolNames: external_exports.array(external_exports.string()).optional()
          }).optional()
        })
      ]).optional(),
      serverDescription: external_exports.string().optional(),
      serverUrl: external_exports.string().optional()
    }).refine(
      (v) => v.serverUrl != null || v.connectorId != null,
      "One of serverUrl or connectorId must be provided."
    )
  )
);
var mcpInputSchema = lazySchema(() => zodSchema(external_exports.object({})));
var mcpOutputSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      type: external_exports.literal("call"),
      serverLabel: external_exports.string(),
      name: external_exports.string(),
      arguments: external_exports.string(),
      output: external_exports.string().nullish(),
      error: external_exports.union([external_exports.string(), jsonValueSchema2]).optional()
    })
  )
);
var mcpToolFactory = createProviderExecutedToolFactory({
  id: "openai.mcp",
  inputSchema: mcpInputSchema,
  outputSchema: mcpOutputSchema
});
var mcp = /* @__PURE__ */ __name((args) => mcpToolFactory(args), "mcp");
var openaiTools = {
  /**
   * The apply_patch tool lets GPT-5.1 create, update, and delete files in your
   * codebase using structured diffs. Instead of just suggesting edits, the model
   * emits patch operations that your application applies and then reports back on,
   * enabling iterative, multi-step code editing workflows.
   *
   */
  applyPatch,
  /**
   * Custom tools let callers constrain model output to a grammar (regex or
   * Lark syntax). The model returns a `custom_tool_call` output item whose
   * `input` field is a string matching the specified grammar.
   *
   * @param description - An optional description of the tool.
   * @param format - The output format constraint (grammar type, syntax, and definition).
   */
  customTool,
  /**
   * The Code Interpreter tool allows models to write and run Python code in a
   * sandboxed environment to solve complex problems in domains like data analysis,
   * coding, and math.
   *
   * @param container - The container to use for the code interpreter.
   */
  codeInterpreter,
  /**
   * The computer tool allows models to operate a browser or desktop through
   * batched UI actions. Your application executes the actions and returns an
   * updated screenshot.
   *
   * WARNING: Run computer use in an isolated environment, treat on-screen
   * content as untrusted, and require confirmation for consequential actions.
   */
  computer,
  /**
   * File search is a tool available in the Responses API. It enables models to
   * retrieve information in a knowledge base of previously uploaded files through
   * semantic and keyword search.
   *
   * @param vectorStoreIds - The vector store IDs to use for the file search.
   * @param maxNumResults - The maximum number of results to return.
   * @param ranking - The ranking options to use for the file search.
   * @param filters - The filters to use for the file search.
   */
  fileSearch,
  /**
   * The image generation tool allows you to generate images using a text prompt,
   * and optionally image inputs. It leverages the GPT Image model,
   * and automatically optimizes text inputs for improved performance.
   *
   * @param background - Background type for the generated image. One of 'auto', 'opaque', or 'transparent'.
   * @param inputFidelity - Input fidelity for the generated image. One of 'low' or 'high'.
   * @param inputImageMask - Optional mask for inpainting. Contains fileId and/or imageUrl.
   * @param model - The image generation model to use. Default: gpt-image-1.
   * @param moderation - Moderation level for the generated image. Default: 'auto'.
   * @param outputCompression - Compression level for the output image (0-100).
   * @param outputFormat - The output format of the generated image. One of 'png', 'jpeg', or 'webp'.
   * @param partialImages - Number of partial images to generate in streaming mode (0-3).
   * @param quality - The quality of the generated image. One of 'auto', 'low', 'medium', or 'high'.
   * @param size - The size of the generated image. One of 'auto', '1024x1024', '1024x1536', or '1536x1024'.
   */
  imageGeneration,
  /**
   * Local shell is a tool that allows agents to run shell commands locally
   * on a machine you or the user provides.
   *
   * Supported models: `gpt-5-codex`
   */
  localShell,
  /**
   * The shell tool allows the model to interact with your local computer through
   * a controlled command-line interface. The model proposes shell commands; your
   * integration executes them and returns the outputs.
   *
   * Available through the Responses API for use with GPT-5.1.
   *
   * WARNING: Running arbitrary shell commands can be dangerous. Always sandbox
   * execution or add strict allow-/deny-lists before forwarding a command to
   * the system shell.
   */
  shell,
  /**
   * Web search allows models to access up-to-date information from the internet
   * and provide answers with sourced citations.
   *
   * @param searchContextSize - The search context size to use for the web search.
   * @param userLocation - The user location to use for the web search.
   */
  webSearchPreview,
  /**
   * Web search allows models to access up-to-date information from the internet
   * and provide answers with sourced citations.
   *
   * @param filters - The filters to use for the web search.
   * @param searchContextSize - The search context size to use for the web search.
   * @param userLocation - The user location to use for the web search.
   */
  webSearch,
  /**
   * MCP (Model Context Protocol) allows models to call tools exposed by
   * remote MCP servers or service connectors.
   *
   * @param serverLabel - Label to identify the MCP server.
   * @param allowedTools - Allowed tool names or filter object.
   * @param authorization - OAuth access token for the MCP server/connector.
   * @param connectorId - Identifier for a service connector.
   * @param headers - Optional headers to include in MCP requests.
   * // param requireApproval - Approval policy ('always'|'never'|filter object). (Removed - always 'never')
   * @param serverDescription - Optional description of the server.
   * @param serverUrl - URL for the MCP server.
   */
  mcp,
  /**
   * Tool search allows the model to dynamically search for and load deferred
   * tools into the model's context as needed. This helps reduce overall token
   * usage, cost, and latency by only loading tools when the model needs them.
   *
   * To use tool search, mark functions or namespaces with `defer_loading: true`
   * in the tools array. The model will use tool search to load these tools
   * when it determines they are needed.
   */
  toolSearch
};
function parseOpenAIRealtimeServerEvent(raw) {
  var _a24, _b18, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
  const event = raw;
  const type = event.type;
  switch (type) {
    // ── Session lifecycle ──────────────────────────────────────────
    case "session.created":
      return {
        type: "session-created",
        sessionId: (_a24 = event.session) == null ? void 0 : _a24.id,
        raw
      };
    case "session.updated":
      return { type: "session-updated", raw };
    // ── Input audio buffer ─────────────────────────────────────────
    case "input_audio_buffer.speech_started":
      return {
        type: "speech-started",
        itemId: event.item_id,
        raw
      };
    case "input_audio_buffer.speech_stopped":
      return {
        type: "speech-stopped",
        itemId: event.item_id,
        raw
      };
    case "input_audio_buffer.committed":
      return {
        type: "audio-committed",
        itemId: event.item_id,
        previousItemId: event.previous_item_id,
        raw
      };
    // ── Conversation items ─────────────────────────────────────────
    case "conversation.item.added":
      return {
        type: "conversation-item-added",
        itemId: (_c = (_b18 = event.item) == null ? void 0 : _b18.id) != null ? _c : event.item_id,
        item: event.item,
        raw
      };
    case "conversation.item.input_audio_transcription.completed":
      return {
        type: "input-transcription-completed",
        itemId: event.item_id,
        transcript: (_d = event.transcript) != null ? _d : "",
        raw
      };
    // ── Response lifecycle ──────────────────────────────────────────
    case "response.created":
      return {
        type: "response-created",
        responseId: (_f = (_e = event.response) == null ? void 0 : _e.id) != null ? _f : event.response_id,
        raw
      };
    case "response.done":
      return {
        type: "response-done",
        responseId: (_h = (_g = event.response) == null ? void 0 : _g.id) != null ? _h : event.response_id,
        status: (_j = (_i = event.response) == null ? void 0 : _i.status) != null ? _j : "completed",
        raw
      };
    // ── Output item lifecycle ───────────────────────────────────────
    case "response.output_item.added":
      return {
        type: "output-item-added",
        responseId: event.response_id,
        itemId: (_l = (_k = event.item) == null ? void 0 : _k.id) != null ? _l : event.item_id,
        raw
      };
    case "response.output_item.done":
      return {
        type: "output-item-done",
        responseId: event.response_id,
        itemId: (_n = (_m = event.item) == null ? void 0 : _m.id) != null ? _n : event.item_id,
        raw
      };
    case "response.content_part.added":
      return {
        type: "content-part-added",
        responseId: event.response_id,
        itemId: event.item_id,
        raw
      };
    case "response.content_part.done":
      return {
        type: "content-part-done",
        responseId: event.response_id,
        itemId: event.item_id,
        raw
      };
    // ── Audio output ────────────────────────────────────────────────
    case "response.output_audio.delta":
      return {
        type: "audio-delta",
        responseId: event.response_id,
        itemId: event.item_id,
        delta: event.delta,
        raw
      };
    case "response.output_audio.done":
      return {
        type: "audio-done",
        responseId: event.response_id,
        itemId: event.item_id,
        raw
      };
    // ── Audio transcript output ─────────────────────────────────────
    case "response.output_audio_transcript.delta":
      return {
        type: "audio-transcript-delta",
        responseId: event.response_id,
        itemId: event.item_id,
        delta: event.delta,
        raw
      };
    case "response.output_audio_transcript.done":
      return {
        type: "audio-transcript-done",
        responseId: event.response_id,
        itemId: event.item_id,
        transcript: event.transcript,
        raw
      };
    // ── Text output ─────────────────────────────────────────────────
    case "response.output_text.delta":
      return {
        type: "text-delta",
        responseId: event.response_id,
        itemId: event.item_id,
        delta: event.delta,
        raw
      };
    case "response.output_text.done":
      return {
        type: "text-done",
        responseId: event.response_id,
        itemId: event.item_id,
        text: event.text,
        raw
      };
    // ── Function calling ────────────────────────────────────────────
    case "response.function_call_arguments.delta":
      return {
        type: "function-call-arguments-delta",
        responseId: event.response_id,
        itemId: event.item_id,
        callId: event.call_id,
        delta: event.delta,
        raw
      };
    case "response.function_call_arguments.done":
      return {
        type: "function-call-arguments-done",
        responseId: event.response_id,
        itemId: event.item_id,
        callId: event.call_id,
        name: event.name,
        arguments: event.arguments,
        raw
      };
    // ── Error ───────────────────────────────────────────────────────
    case "error":
      return {
        type: "error",
        message: (_q = (_p = (_o = event.error) == null ? void 0 : _o.message) != null ? _p : event.message) != null ? _q : "Unknown error",
        code: (_s = (_r = event.error) == null ? void 0 : _r.code) != null ? _s : event.code,
        raw
      };
    // ── Pass-through ────────────────────────────────────────────────
    default:
      return { type: "custom", rawType: type, raw };
  }
}
__name(parseOpenAIRealtimeServerEvent, "parseOpenAIRealtimeServerEvent");
function serializeOpenAIRealtimeClientEvent(event, modelId) {
  switch (event.type) {
    case "session-update":
      return {
        type: "session.update",
        session: buildOpenAISessionConfig(event.config, modelId)
      };
    case "input-audio-append":
      return {
        type: "input_audio_buffer.append",
        audio: event.audio
      };
    case "input-audio-commit":
      return { type: "input_audio_buffer.commit" };
    case "input-audio-clear":
      return { type: "input_audio_buffer.clear" };
    case "conversation-item-create": {
      const item = event.item;
      switch (item.type) {
        case "text-message":
          return {
            type: "conversation.item.create",
            item: {
              type: "message",
              role: item.role,
              content: [{ type: "input_text", text: item.text }]
            }
          };
        case "audio-message":
          return {
            type: "conversation.item.create",
            item: {
              type: "message",
              role: item.role,
              content: [{ type: "input_audio", audio: item.audio }]
            }
          };
        case "function-call-output":
          return {
            type: "conversation.item.create",
            item: {
              type: "function_call_output",
              call_id: item.callId,
              output: item.output
            }
          };
      }
      break;
    }
    case "conversation-item-truncate":
      return {
        type: "conversation.item.truncate",
        item_id: event.itemId,
        content_index: event.contentIndex,
        audio_end_ms: event.audioEndMs
      };
    case "response-create":
      return {
        type: "response.create",
        ...event.options != null ? {
          response: {
            ...event.options.modalities != null ? { output_modalities: event.options.modalities } : {},
            ...event.options.instructions != null ? { instructions: event.options.instructions } : {},
            ...event.options.metadata != null ? { metadata: event.options.metadata } : {}
          }
        } : {}
      };
    case "response-cancel":
      return { type: "response.cancel" };
  }
}
__name(serializeOpenAIRealtimeClientEvent, "serializeOpenAIRealtimeClientEvent");
function buildOpenAISessionConfig(config, modelId) {
  var _a24;
  const session = {
    type: "realtime",
    model: modelId
  };
  if (config.instructions != null) {
    session.instructions = config.instructions;
  }
  if (config.outputModalities != null) {
    session.output_modalities = config.outputModalities;
  }
  const audio = {};
  if (config.inputAudioFormat != null || config.inputAudioTranscription != null || config.turnDetection != null) {
    const input = {};
    if (config.inputAudioFormat != null) {
      input.format = {
        type: config.inputAudioFormat.type,
        ...config.inputAudioFormat.rate != null ? { rate: config.inputAudioFormat.rate } : {}
      };
    }
    if (config.turnDetection != null) {
      if (config.turnDetection.type === "disabled") {
        input.turn_detection = null;
      } else {
        const td = {
          type: config.turnDetection.type === "server-vad" ? "server_vad" : "semantic_vad"
        };
        if (config.turnDetection.threshold != null) {
          td.threshold = config.turnDetection.threshold;
        }
        if (config.turnDetection.silenceDurationMs != null) {
          td.silence_duration_ms = config.turnDetection.silenceDurationMs;
        }
        if (config.turnDetection.prefixPaddingMs != null) {
          td.prefix_padding_ms = config.turnDetection.prefixPaddingMs;
        }
        input.turn_detection = td;
      }
    }
    if (config.inputAudioTranscription != null) {
      input.transcription = {
        model: (_a24 = config.inputAudioTranscription.model) != null ? _a24 : "gpt-realtime-whisper",
        ...config.inputAudioTranscription.language != null ? { language: config.inputAudioTranscription.language } : {},
        ...config.inputAudioTranscription.prompt != null ? { prompt: config.inputAudioTranscription.prompt } : {}
      };
    }
    audio.input = input;
  }
  if (config.outputAudioFormat != null || config.voice != null) {
    const output = {};
    if (config.outputAudioFormat != null) {
      output.format = {
        type: config.outputAudioFormat.type,
        ...config.outputAudioFormat.rate != null ? { rate: config.outputAudioFormat.rate } : {}
      };
    }
    if (config.voice != null) {
      output.voice = config.voice;
    }
    audio.output = output;
  }
  if (Object.keys(audio).length > 0) {
    session.audio = audio;
  }
  if (config.tools != null && config.tools.length > 0) {
    session.tools = config.tools.map((tool2) => ({
      type: tool2.type,
      name: tool2.name,
      description: tool2.description,
      parameters: tool2.parameters
    }));
    session.tool_choice = "auto";
  }
  if (config.providerOptions != null) {
    Object.assign(session, config.providerOptions);
  }
  return session;
}
__name(buildOpenAISessionConfig, "buildOpenAISessionConfig");
var OpenAIRealtimeModel = class {
  static {
    __name(this, "OpenAIRealtimeModel");
  }
  constructor(modelId, config) {
    this.specificationVersion = "v4";
    this.modelId = modelId;
    this.provider = config.provider;
    this.config = config;
  }
  async doCreateClientSecret(options) {
    var _a24;
    const fetchFn = (_a24 = this.config.fetch) != null ? _a24 : fetch;
    const url = `${this.config.baseURL}/realtime/client_secrets`;
    const session = options.sessionConfig != null ? buildOpenAISessionConfig(options.sessionConfig, this.modelId) : { type: "realtime", model: this.modelId };
    const response = await fetchFn(url, {
      method: "POST",
      headers: {
        ...this.config.headers(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session,
        ...options.expiresAfterSeconds != null ? {
          // `anchor` is required by the client secrets endpoint; without it
          // the request fails with "Missing required parameter:
          // 'expires_after.anchor'".
          expires_after: {
            anchor: "created_at",
            seconds: options.expiresAfterSeconds
          }
        } : {}
      })
    });
    if (!response.ok) {
      const text2 = await response.text();
      throw new Error(
        `OpenAI realtime client secret request failed: ${response.status} ${text2}`
      );
    }
    const data = await response.json();
    return {
      token: data.value,
      url: `wss://${new URL(this.config.baseURL).host}/v1/realtime?model=${encodeURIComponent(this.modelId)}`,
      expiresAt: data.expires_at
    };
  }
  getWebSocketConfig(options) {
    return {
      url: options.url,
      protocols: ["realtime", `openai-insecure-api-key.${options.token}`]
    };
  }
  parseServerEvent(raw) {
    return parseOpenAIRealtimeServerEvent(raw);
  }
  serializeClientEvent(event) {
    return serializeOpenAIRealtimeClientEvent(event, this.modelId);
  }
  buildSessionConfig(config) {
    return buildOpenAISessionConfig(config, this.modelId);
  }
};
function convertOpenAIResponsesUsage(usage) {
  var _a24, _b18, _c, _d, _e, _f;
  if (usage == null) {
    return {
      inputTokens: {
        total: void 0,
        noCache: void 0,
        cacheRead: void 0,
        cacheWrite: void 0
      },
      outputTokens: {
        total: void 0,
        text: void 0,
        reasoning: void 0
      },
      raw: void 0
    };
  }
  const inputTokens = usage.input_tokens;
  const outputTokens = usage.output_tokens;
  const cachedTokens = (_b18 = (_a24 = usage.input_tokens_details) == null ? void 0 : _a24.cached_tokens) != null ? _b18 : 0;
  const cacheWriteTokens = (_d = (_c = usage.input_tokens_details) == null ? void 0 : _c.cache_write_tokens) != null ? _d : void 0;
  const reasoningTokens = (_f = (_e = usage.output_tokens_details) == null ? void 0 : _e.reasoning_tokens) != null ? _f : 0;
  return {
    inputTokens: {
      total: inputTokens,
      noCache: inputTokens - cachedTokens - (cacheWriteTokens != null ? cacheWriteTokens : 0),
      cacheRead: cachedTokens,
      cacheWrite: cacheWriteTokens
    },
    outputTokens: {
      total: outputTokens,
      text: outputTokens - reasoningTokens,
      reasoning: reasoningTokens
    },
    raw: usage
  };
}
__name(convertOpenAIResponsesUsage, "convertOpenAIResponsesUsage");
function serializeToolCallArguments2(input) {
  return JSON.stringify(input === void 0 ? {} : input);
}
__name(serializeToolCallArguments2, "serializeToolCallArguments2");
function getPromptCacheBreakpoint2(providerOptions, providerOptionsName) {
  var _a24;
  return (_a24 = providerOptions == null ? void 0 : providerOptions[providerOptionsName]) == null ? void 0 : _a24.promptCacheBreakpoint;
}
__name(getPromptCacheBreakpoint2, "getPromptCacheBreakpoint2");
function isFileId(data, prefixes) {
  if (!prefixes) return false;
  return prefixes.some((prefix) => data.startsWith(prefix));
}
__name(isFileId, "isFileId");
async function convertToOpenAIResponsesInput({
  prompt,
  toolNameMapping,
  systemMessageMode,
  providerOptionsName,
  fileIdPrefixes,
  passThroughUnsupportedFiles = false,
  store,
  hasConversation = false,
  hasPreviousResponseId = false,
  hasLocalShellTool = false,
  hasShellTool = false,
  hasApplyPatchTool = false,
  hasComputerTool = false,
  customProviderToolNames
}) {
  var _a24, _b18, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
  let input = [];
  const warnings = [];
  const processedApprovalIds = /* @__PURE__ */ new Set();
  for (const { role, content, providerOptions } of prompt) {
    switch (role) {
      case "system": {
        switch (systemMessageMode) {
          case "system": {
            const promptCacheBreakpoint = getPromptCacheBreakpoint2(
              providerOptions,
              providerOptionsName
            );
            input.push({
              role: "system",
              content: promptCacheBreakpoint == null ? content : [
                {
                  type: "input_text",
                  text: content,
                  prompt_cache_breakpoint: promptCacheBreakpoint
                }
              ]
            });
            break;
          }
          case "developer": {
            const promptCacheBreakpoint = getPromptCacheBreakpoint2(
              providerOptions,
              providerOptionsName
            );
            input.push({
              role: "developer",
              content: promptCacheBreakpoint == null ? content : [
                {
                  type: "input_text",
                  text: content,
                  prompt_cache_breakpoint: promptCacheBreakpoint
                }
              ]
            });
            break;
          }
          case "remove": {
            warnings.push({
              type: "other",
              message: "system messages are removed for this model"
            });
            break;
          }
          default: {
            const _exhaustiveCheck = systemMessageMode;
            throw new Error(
              `Unsupported system message mode: ${_exhaustiveCheck}`
            );
          }
        }
        break;
      }
      case "user": {
        input.push({
          role: "user",
          content: content.map((part, index) => {
            var _a25, _b23, _c2, _d2, _e2;
            switch (part.type) {
              case "text": {
                const promptCacheBreakpoint = getPromptCacheBreakpoint2(
                  part.providerOptions,
                  providerOptionsName
                );
                return {
                  type: "input_text",
                  text: part.text,
                  ...promptCacheBreakpoint != null && {
                    prompt_cache_breakpoint: promptCacheBreakpoint
                  }
                };
              }
              case "file": {
                const promptCacheBreakpoint = getPromptCacheBreakpoint2(
                  part.providerOptions,
                  providerOptionsName
                );
                switch (part.data.type) {
                  case "reference": {
                    const fileId = resolveProviderReference({
                      reference: part.data.reference,
                      provider: providerOptionsName
                    });
                    if (getTopLevelMediaType(part.mediaType) === "image") {
                      return {
                        type: "input_image",
                        file_id: fileId,
                        detail: (_b23 = (_a25 = part.providerOptions) == null ? void 0 : _a25[providerOptionsName]) == null ? void 0 : _b23.imageDetail,
                        ...promptCacheBreakpoint != null && {
                          prompt_cache_breakpoint: promptCacheBreakpoint
                        }
                      };
                    }
                    return {
                      type: "input_file",
                      file_id: fileId,
                      ...promptCacheBreakpoint != null && {
                        prompt_cache_breakpoint: promptCacheBreakpoint
                      }
                    };
                  }
                  case "text": {
                    throw new UnsupportedFunctionalityError({
                      functionality: "text file parts"
                    });
                  }
                  case "url":
                  case "data": {
                    const topLevel = getTopLevelMediaType(part.mediaType);
                    if (topLevel === "image") {
                      return {
                        type: "input_image",
                        ...part.data.type === "url" ? { image_url: part.data.url.toString() } : typeof part.data.data === "string" && isFileId(part.data.data, fileIdPrefixes) ? { file_id: part.data.data } : {
                          image_url: `data:${resolveFullMediaType({ part })};base64,${convertToBase64(part.data.data)}`
                        },
                        detail: (_d2 = (_c2 = part.providerOptions) == null ? void 0 : _c2[providerOptionsName]) == null ? void 0 : _d2.imageDetail,
                        ...promptCacheBreakpoint != null && {
                          prompt_cache_breakpoint: promptCacheBreakpoint
                        }
                      };
                    } else {
                      if (part.data.type === "url") {
                        return {
                          type: "input_file",
                          file_url: part.data.url.toString(),
                          ...promptCacheBreakpoint != null && {
                            prompt_cache_breakpoint: promptCacheBreakpoint
                          }
                        };
                      }
                      const fullMediaType = resolveFullMediaType({ part });
                      if (fullMediaType !== "application/pdf" && !passThroughUnsupportedFiles) {
                        throw new UnsupportedFunctionalityError({
                          functionality: `file part media type ${fullMediaType}`
                        });
                      }
                      return {
                        type: "input_file",
                        ...typeof part.data.data === "string" && isFileId(part.data.data, fileIdPrefixes) ? { file_id: part.data.data } : {
                          filename: (_e2 = part.filename) != null ? _e2 : fullMediaType === "application/pdf" ? `part-${index}.pdf` : `part-${index}`,
                          file_data: `data:${fullMediaType};base64,${convertToBase64(part.data.data)}`
                        },
                        ...promptCacheBreakpoint != null && {
                          prompt_cache_breakpoint: promptCacheBreakpoint
                        }
                      };
                    }
                  }
                }
              }
            }
          })
        });
        break;
      }
      case "assistant": {
        const reasoningMessages = {};
        for (const part of content) {
          switch (part.type) {
            case "text": {
              const providerOptions2 = (_a24 = part.providerOptions) == null ? void 0 : _a24[providerOptionsName];
              const id = providerOptions2 == null ? void 0 : providerOptions2.itemId;
              const phase = providerOptions2 == null ? void 0 : providerOptions2.phase;
              if (hasConversation && id != null) {
                break;
              }
              if (store && id != null) {
                input.push({ type: "item_reference", id });
                break;
              }
              input.push({
                role: "assistant",
                content: [{ type: "output_text", text: part.text }],
                id,
                ...phase != null && { phase }
              });
              break;
            }
            case "tool-call": {
              const id = (_f = (_c = (_b18 = part.providerOptions) == null ? void 0 : _b18[providerOptionsName]) == null ? void 0 : _c.itemId) != null ? _f : (_e = (_d = part.providerMetadata) == null ? void 0 : _d[providerOptionsName]) == null ? void 0 : _e.itemId;
              const namespace = (_k = (_h = (_g = part.providerOptions) == null ? void 0 : _g[providerOptionsName]) == null ? void 0 : _h.namespace) != null ? _k : (_j = (_i = part.providerMetadata) == null ? void 0 : _i[providerOptionsName]) == null ? void 0 : _j.namespace;
              if (hasConversation && id != null) {
                break;
              }
              const resolvedToolName = toolNameMapping.toProviderToolName(
                part.toolName
              );
              if (resolvedToolName === "tool_search") {
                if (store && id != null) {
                  input.push({ type: "item_reference", id });
                  break;
                }
                const parsedInput = typeof part.input === "string" ? await parseJSON({
                  text: part.input,
                  schema: toolSearchInputSchema
                }) : await validateTypes({
                  value: part.input,
                  schema: toolSearchInputSchema
                });
                const execution = parsedInput.call_id != null ? "client" : "server";
                input.push({
                  type: "tool_search_call",
                  id: id != null ? id : part.toolCallId,
                  execution,
                  call_id: (_l = parsedInput.call_id) != null ? _l : null,
                  status: "completed",
                  arguments: parsedInput.arguments
                });
                break;
              }
              if (part.providerExecuted) {
                if (store && id != null) {
                  input.push({ type: "item_reference", id });
                }
                break;
              }
              if (hasPreviousResponseId && store && id != null) {
                break;
              }
              const isProviderDefinedToolCall = hasLocalShellTool && resolvedToolName === "local_shell" || hasShellTool && resolvedToolName === "shell" || hasApplyPatchTool && resolvedToolName === "apply_patch" || hasComputerTool && resolvedToolName === "computer" || ((_m = customProviderToolNames == null ? void 0 : customProviderToolNames.has(resolvedToolName)) != null ? _m : false);
              if (store && id != null && isProviderDefinedToolCall) {
                input.push({ type: "item_reference", id });
                break;
              }
              if (hasLocalShellTool && resolvedToolName === "local_shell") {
                const parsedInput = await validateTypes({
                  value: part.input,
                  schema: localShellInputSchema
                });
                input.push({
                  type: "local_shell_call",
                  call_id: part.toolCallId,
                  id,
                  action: {
                    type: "exec",
                    command: parsedInput.action.command,
                    timeout_ms: parsedInput.action.timeoutMs,
                    user: parsedInput.action.user,
                    working_directory: parsedInput.action.workingDirectory,
                    env: parsedInput.action.env
                  }
                });
                break;
              }
              if (hasShellTool && resolvedToolName === "shell") {
                const parsedInput = await validateTypes({
                  value: part.input,
                  schema: shellInputSchema
                });
                input.push({
                  type: "shell_call",
                  call_id: part.toolCallId,
                  id,
                  status: "completed",
                  action: {
                    commands: parsedInput.action.commands,
                    timeout_ms: parsedInput.action.timeoutMs,
                    max_output_length: parsedInput.action.maxOutputLength
                  }
                });
                break;
              }
              if (hasApplyPatchTool && resolvedToolName === "apply_patch") {
                const parsedInput = await validateTypes({
                  value: part.input,
                  schema: applyPatchInputSchema
                });
                input.push({
                  type: "apply_patch_call",
                  call_id: parsedInput.callId,
                  id,
                  status: "completed",
                  operation: parsedInput.operation
                });
                break;
              }
              if (hasComputerTool && resolvedToolName === "computer") {
                const parsedInput = await validateTypes({
                  value: part.input,
                  schema: computerInputSchema
                });
                input.push({
                  type: "computer_call",
                  call_id: part.toolCallId,
                  id,
                  status: parsedInput.status,
                  actions: parsedInput.actions.map((action) => {
                    switch (action.type) {
                      case "click":
                      case "double_click":
                      case "move":
                        return {
                          ...action,
                          keys: action.keys
                        };
                      case "drag":
                        return {
                          ...action,
                          keys: action.keys
                        };
                      case "scroll":
                        return {
                          type: "scroll",
                          x: action.x,
                          y: action.y,
                          scroll_x: action.scrollX,
                          scroll_y: action.scrollY,
                          keys: action.keys
                        };
                      default:
                        return action;
                    }
                  }),
                  pending_safety_checks: parsedInput.pendingSafetyChecks.map(
                    (safetyCheck) => ({
                      id: safetyCheck.id,
                      code: safetyCheck.code,
                      message: safetyCheck.message
                    })
                  )
                });
                break;
              }
              if (customProviderToolNames == null ? void 0 : customProviderToolNames.has(resolvedToolName)) {
                input.push({
                  type: "custom_tool_call",
                  call_id: part.toolCallId,
                  name: resolvedToolName,
                  input: typeof part.input === "string" ? part.input : JSON.stringify(part.input),
                  id
                });
                break;
              }
              input.push({
                type: "function_call",
                call_id: part.toolCallId,
                name: resolvedToolName,
                arguments: serializeToolCallArguments2(part.input),
                ...namespace != null && { namespace }
              });
              break;
            }
            // assistant tool result parts are from provider-executed tools:
            case "tool-result": {
              if (part.output.type === "execution-denied" || part.output.type === "json" && typeof part.output.value === "object" && part.output.value != null && "type" in part.output.value && part.output.value.type === "execution-denied") {
                break;
              }
              if (hasConversation) {
                break;
              }
              const resolvedResultToolName = toolNameMapping.toProviderToolName(
                part.toolName
              );
              if (resolvedResultToolName === "tool_search") {
                const itemId = (_p = (_o = (_n = part.providerOptions) == null ? void 0 : _n[providerOptionsName]) == null ? void 0 : _o.itemId) != null ? _p : part.toolCallId;
                if (store) {
                  input.push({ type: "item_reference", id: itemId });
                } else if (part.output.type === "json") {
                  const parsedOutput = await validateTypes({
                    value: part.output.value,
                    schema: toolSearchOutputSchema
                  });
                  input.push({
                    type: "tool_search_output",
                    id: itemId,
                    execution: "server",
                    call_id: null,
                    status: "completed",
                    tools: parsedOutput.tools
                  });
                }
                break;
              }
              if (hasShellTool && resolvedResultToolName === "shell") {
                if (part.output.type === "json") {
                  const parsedOutput = await validateTypes({
                    value: part.output.value,
                    schema: shellOutputSchema
                  });
                  input.push({
                    type: "shell_call_output",
                    call_id: part.toolCallId,
                    output: parsedOutput.output.map((item) => ({
                      stdout: item.stdout,
                      stderr: item.stderr,
                      outcome: item.outcome.type === "timeout" ? { type: "timeout" } : {
                        type: "exit",
                        exit_code: item.outcome.exitCode
                      }
                    }))
                  });
                }
                break;
              }
              if (store) {
                const itemId = (_s = (_r = (_q = part.providerOptions) == null ? void 0 : _q[providerOptionsName]) == null ? void 0 : _r.itemId) != null ? _s : part.toolCallId;
                input.push({ type: "item_reference", id: itemId });
              } else {
                warnings.push({
                  type: "other",
                  message: `Results for OpenAI tool ${part.toolName} are not sent to the API when store is false`
                });
              }
              break;
            }
            case "reasoning": {
              const providerOptions2 = await parseProviderOptions({
                provider: providerOptionsName,
                providerOptions: part.providerOptions,
                schema: openaiResponsesReasoningProviderOptionsSchema
              });
              const reasoningId = providerOptions2 == null ? void 0 : providerOptions2.itemId;
              if ((hasConversation || hasPreviousResponseId) && reasoningId != null) {
                break;
              }
              if (reasoningId != null) {
                const reasoningMessage = reasoningMessages[reasoningId];
                if (store) {
                  if (reasoningMessage === void 0) {
                    input.push({ type: "item_reference", id: reasoningId });
                    reasoningMessages[reasoningId] = {
                      type: "reasoning",
                      id: reasoningId,
                      summary: []
                    };
                  }
                } else {
                  const summaryParts = [];
                  if (part.text.length > 0) {
                    summaryParts.push({
                      type: "summary_text",
                      text: part.text
                    });
                  } else if (reasoningMessage !== void 0) {
                    warnings.push({
                      type: "other",
                      message: `Cannot append empty reasoning part to existing reasoning sequence. Skipping reasoning part: ${JSON.stringify(part)}.`
                    });
                  }
                  if (reasoningMessage === void 0) {
                    reasoningMessages[reasoningId] = {
                      type: "reasoning",
                      id: reasoningId,
                      encrypted_content: providerOptions2 == null ? void 0 : providerOptions2.reasoningEncryptedContent,
                      summary: summaryParts
                    };
                    input.push(reasoningMessages[reasoningId]);
                  } else {
                    reasoningMessage.summary.push(...summaryParts);
                    if ((providerOptions2 == null ? void 0 : providerOptions2.reasoningEncryptedContent) != null) {
                      reasoningMessage.encrypted_content = providerOptions2.reasoningEncryptedContent;
                    }
                  }
                }
              } else {
                const encryptedContent = providerOptions2 == null ? void 0 : providerOptions2.reasoningEncryptedContent;
                if (encryptedContent != null) {
                  const summaryParts = [];
                  if (part.text.length > 0) {
                    summaryParts.push({
                      type: "summary_text",
                      text: part.text
                    });
                  }
                  input.push({
                    type: "reasoning",
                    encrypted_content: encryptedContent,
                    summary: summaryParts
                  });
                } else {
                  warnings.push({
                    type: "other",
                    message: `Non-OpenAI reasoning parts are not supported. Skipping reasoning part: ${JSON.stringify(part)}.`
                  });
                }
              }
              break;
            }
            case "custom": {
              if (part.kind === "openai.compaction") {
                const providerOptions2 = (_t = part.providerOptions) == null ? void 0 : _t[providerOptionsName];
                const id = providerOptions2 == null ? void 0 : providerOptions2.itemId;
                if (hasConversation && id != null) {
                  break;
                }
                if (store && id != null) {
                  input.push({ type: "item_reference", id });
                  break;
                }
                const encryptedContent = providerOptions2 == null ? void 0 : providerOptions2.encryptedContent;
                if (id != null) {
                  input.push({
                    type: "compaction",
                    id,
                    encrypted_content: encryptedContent
                  });
                }
              }
              break;
            }
          }
        }
        break;
      }
      case "tool": {
        for (const part of content) {
          if (part.type === "tool-approval-response") {
            const approvalResponse = part;
            if (processedApprovalIds.has(approvalResponse.approvalId)) {
              continue;
            }
            processedApprovalIds.add(approvalResponse.approvalId);
            if (store) {
              input.push({
                type: "item_reference",
                id: approvalResponse.approvalId
              });
            }
            input.push({
              type: "mcp_approval_response",
              approval_request_id: approvalResponse.approvalId,
              approve: approvalResponse.approved
            });
            continue;
          }
          const output = part.output;
          if (output.type === "execution-denied") {
            const approvalId = (_v = (_u = output.providerOptions) == null ? void 0 : _u.openai) == null ? void 0 : _v.approvalId;
            if (approvalId) {
              continue;
            }
          }
          const resolvedToolName = toolNameMapping.toProviderToolName(
            part.toolName
          );
          if (resolvedToolName === "tool_search" && output.type === "json") {
            const parsedOutput = await validateTypes({
              value: output.value,
              schema: toolSearchOutputSchema
            });
            input.push({
              type: "tool_search_output",
              execution: "client",
              call_id: part.toolCallId,
              status: "completed",
              tools: parsedOutput.tools
            });
            continue;
          }
          if (hasLocalShellTool && resolvedToolName === "local_shell" && output.type === "json") {
            const parsedOutput = await validateTypes({
              value: output.value,
              schema: localShellOutputSchema
            });
            input.push({
              type: "local_shell_call_output",
              call_id: part.toolCallId,
              output: parsedOutput.output
            });
            continue;
          }
          if (hasShellTool && resolvedToolName === "shell" && output.type === "json") {
            const parsedOutput = await validateTypes({
              value: output.value,
              schema: shellOutputSchema
            });
            input.push({
              type: "shell_call_output",
              call_id: part.toolCallId,
              output: parsedOutput.output.map((item) => ({
                stdout: item.stdout,
                stderr: item.stderr,
                outcome: item.outcome.type === "timeout" ? { type: "timeout" } : {
                  type: "exit",
                  exit_code: item.outcome.exitCode
                }
              }))
            });
            continue;
          }
          if (hasApplyPatchTool && part.toolName === "apply_patch" && output.type === "json") {
            const parsedOutput = await validateTypes({
              value: output.value,
              schema: applyPatchOutputSchema
            });
            input.push({
              type: "apply_patch_call_output",
              call_id: part.toolCallId,
              status: parsedOutput.status,
              output: parsedOutput.output
            });
            continue;
          }
          if (hasComputerTool && resolvedToolName === "computer" && output.type === "json") {
            const parsedOutput = await validateTypes({
              value: output.value,
              schema: computerOutputSchema
            });
            input.push({
              type: "computer_call_output",
              call_id: part.toolCallId,
              output: {
                type: "computer_screenshot",
                image_url: parsedOutput.output.imageUrl,
                file_id: parsedOutput.output.fileId,
                detail: parsedOutput.output.detail
              },
              acknowledged_safety_checks: (_w = parsedOutput.acknowledgedSafetyChecks) == null ? void 0 : _w.map((safetyCheck) => ({
                id: safetyCheck.id,
                code: safetyCheck.code,
                message: safetyCheck.message
              }))
            });
            continue;
          }
          if (customProviderToolNames == null ? void 0 : customProviderToolNames.has(resolvedToolName)) {
            let outputValue;
            switch (output.type) {
              case "text":
              case "error-text":
                outputValue = output.value;
                break;
              case "execution-denied":
                outputValue = (_x = output.reason) != null ? _x : "Tool call execution denied.";
                break;
              case "json":
              case "error-json":
                outputValue = JSON.stringify(output.value);
                break;
              case "content":
                outputValue = output.value.map((item) => {
                  var _a25, _b23, _c2;
                  const promptCacheBreakpoint = getPromptCacheBreakpoint2(
                    item.providerOptions,
                    providerOptionsName
                  );
                  switch (item.type) {
                    case "text":
                      return {
                        type: "input_text",
                        text: item.text,
                        ...promptCacheBreakpoint != null && {
                          prompt_cache_breakpoint: promptCacheBreakpoint
                        }
                      };
                    case "file": {
                      const topLevel = getTopLevelMediaType(item.mediaType);
                      const imageDetail = (_b23 = (_a25 = item.providerOptions) == null ? void 0 : _a25[providerOptionsName]) == null ? void 0 : _b23.imageDetail;
                      if (item.data.type === "data") {
                        const fullMediaType = resolveFullMediaType({
                          part: item
                        });
                        if (topLevel === "image") {
                          return {
                            type: "input_image",
                            image_url: `data:${fullMediaType};base64,${convertToBase64(item.data.data)}`,
                            detail: imageDetail,
                            ...promptCacheBreakpoint != null && {
                              prompt_cache_breakpoint: promptCacheBreakpoint
                            }
                          };
                        }
                        return {
                          type: "input_file",
                          filename: (_c2 = item.filename) != null ? _c2 : "data",
                          file_data: `data:${fullMediaType};base64,${convertToBase64(item.data.data)}`,
                          ...promptCacheBreakpoint != null && {
                            prompt_cache_breakpoint: promptCacheBreakpoint
                          }
                        };
                      }
                      if (item.data.type === "url") {
                        if (topLevel === "image") {
                          return {
                            type: "input_image",
                            image_url: item.data.url.toString(),
                            detail: imageDetail,
                            ...promptCacheBreakpoint != null && {
                              prompt_cache_breakpoint: promptCacheBreakpoint
                            }
                          };
                        }
                        return {
                          type: "input_file",
                          file_url: item.data.url.toString(),
                          ...promptCacheBreakpoint != null && {
                            prompt_cache_breakpoint: promptCacheBreakpoint
                          }
                        };
                      }
                      warnings.push({
                        type: "other",
                        message: `unsupported custom tool content part type: ${item.type} with data type: ${item.data.type}`
                      });
                      return void 0;
                    }
                    default:
                      warnings.push({
                        type: "other",
                        message: `unsupported custom tool content part type: ${item.type}`
                      });
                      return void 0;
                  }
                }).filter(isNonNullable);
                break;
              default:
                outputValue = "";
            }
            input.push({
              type: "custom_tool_call_output",
              call_id: part.toolCallId,
              output: outputValue
            });
            continue;
          }
          let contentValue;
          switch (output.type) {
            case "text":
            case "error-text":
              contentValue = output.value;
              break;
            case "execution-denied":
              contentValue = (_y = output.reason) != null ? _y : "Tool call execution denied.";
              break;
            case "json":
            case "error-json":
              contentValue = JSON.stringify(output.value);
              break;
            case "content":
              contentValue = output.value.map((item) => {
                var _a25, _b23, _c2;
                const promptCacheBreakpoint = getPromptCacheBreakpoint2(
                  item.providerOptions,
                  providerOptionsName
                );
                switch (item.type) {
                  case "text": {
                    return {
                      type: "input_text",
                      text: item.text,
                      ...promptCacheBreakpoint != null && {
                        prompt_cache_breakpoint: promptCacheBreakpoint
                      }
                    };
                  }
                  case "file": {
                    const topLevel = getTopLevelMediaType(item.mediaType);
                    const imageDetail = (_b23 = (_a25 = item.providerOptions) == null ? void 0 : _a25[providerOptionsName]) == null ? void 0 : _b23.imageDetail;
                    if (item.data.type === "data") {
                      const fullMediaType = resolveFullMediaType({
                        part: item
                      });
                      if (topLevel === "image") {
                        return {
                          type: "input_image",
                          image_url: `data:${fullMediaType};base64,${convertToBase64(item.data.data)}`,
                          detail: imageDetail,
                          ...promptCacheBreakpoint != null && {
                            prompt_cache_breakpoint: promptCacheBreakpoint
                          }
                        };
                      }
                      return {
                        type: "input_file",
                        filename: (_c2 = item.filename) != null ? _c2 : "data",
                        file_data: `data:${fullMediaType};base64,${convertToBase64(item.data.data)}`,
                        ...promptCacheBreakpoint != null && {
                          prompt_cache_breakpoint: promptCacheBreakpoint
                        }
                      };
                    }
                    if (item.data.type === "url") {
                      if (topLevel === "image") {
                        return {
                          type: "input_image",
                          image_url: item.data.url.toString(),
                          detail: imageDetail,
                          ...promptCacheBreakpoint != null && {
                            prompt_cache_breakpoint: promptCacheBreakpoint
                          }
                        };
                      }
                      return {
                        type: "input_file",
                        file_url: item.data.url.toString(),
                        ...promptCacheBreakpoint != null && {
                          prompt_cache_breakpoint: promptCacheBreakpoint
                        }
                      };
                    }
                    warnings.push({
                      type: "other",
                      message: `unsupported tool content part type: ${item.type} with data type: ${item.data.type}`
                    });
                    return void 0;
                  }
                  default: {
                    warnings.push({
                      type: "other",
                      message: `unsupported tool content part type: ${item.type}`
                    });
                    return void 0;
                  }
                }
              }).filter(isNonNullable);
              break;
          }
          input.push({
            type: "function_call_output",
            call_id: part.toolCallId,
            output: contentValue
          });
        }
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  if (!store && input.some(
    (item) => "type" in item && item.type === "reasoning" && item.encrypted_content == null
  )) {
    warnings.push({
      type: "other",
      message: "Reasoning parts without encrypted content are not supported when store is false. Skipping reasoning parts."
    });
    input = input.filter(
      (item) => !("type" in item) || item.type !== "reasoning" || item.encrypted_content != null
    );
  }
  return { input, warnings };
}
__name(convertToOpenAIResponsesInput, "convertToOpenAIResponsesInput");
var openaiResponsesReasoningProviderOptionsSchema = external_exports.object({
  itemId: external_exports.string().nullish(),
  reasoningEncryptedContent: external_exports.string().nullish()
});
function mapOpenAIResponseFinishReason({
  finishReason,
  hasFunctionCall
}) {
  switch (finishReason) {
    case void 0:
    case null:
      return hasFunctionCall ? "tool-calls" : "stop";
    case "max_output_tokens":
      return "length";
    case "content_filter":
      return "content-filter";
    default:
      return hasFunctionCall ? "tool-calls" : "other";
  }
}
__name(mapOpenAIResponseFinishReason, "mapOpenAIResponseFinishReason");
var jsonValueSchema22 = external_exports.lazy(
  () => external_exports.union([
    external_exports.string(),
    external_exports.number(),
    external_exports.boolean(),
    external_exports.null(),
    external_exports.array(jsonValueSchema22),
    external_exports.record(external_exports.string(), jsonValueSchema22.optional())
  ])
);
var openaiResponsesComputerSafetyCheckSchema = external_exports.object({
  id: external_exports.string(),
  code: external_exports.string().nullish(),
  message: external_exports.string().nullish()
});
var openaiResponsesComputerActionSchema = external_exports.discriminatedUnion("type", [
  external_exports.object({
    type: external_exports.literal("click"),
    button: external_exports.enum(["left", "right", "wheel", "back", "forward"]),
    x: external_exports.number(),
    y: external_exports.number(),
    keys: external_exports.array(external_exports.string()).nullish()
  }),
  external_exports.object({
    type: external_exports.literal("double_click"),
    x: external_exports.number(),
    y: external_exports.number(),
    keys: external_exports.array(external_exports.string()).nullish()
  }),
  external_exports.object({
    type: external_exports.literal("drag"),
    path: external_exports.array(external_exports.object({ x: external_exports.number(), y: external_exports.number() })),
    keys: external_exports.array(external_exports.string()).nullish()
  }),
  external_exports.object({
    type: external_exports.literal("keypress"),
    keys: external_exports.array(external_exports.string())
  }),
  external_exports.object({
    type: external_exports.literal("move"),
    x: external_exports.number(),
    y: external_exports.number(),
    keys: external_exports.array(external_exports.string()).nullish()
  }),
  external_exports.object({
    type: external_exports.literal("screenshot")
  }),
  external_exports.object({
    type: external_exports.literal("scroll"),
    x: external_exports.number(),
    y: external_exports.number(),
    scroll_x: external_exports.number(),
    scroll_y: external_exports.number(),
    keys: external_exports.array(external_exports.string()).nullish()
  }),
  external_exports.object({
    type: external_exports.literal("type"),
    text: external_exports.string()
  }),
  external_exports.object({
    type: external_exports.literal("wait")
  })
]);
var openaiResponsesComputerCallSchema = external_exports.object({
  type: external_exports.literal("computer_call"),
  id: external_exports.string(),
  call_id: external_exports.string().nullish(),
  status: external_exports.enum(["in_progress", "completed", "incomplete"]),
  action: openaiResponsesComputerActionSchema.nullish(),
  actions: external_exports.array(openaiResponsesComputerActionSchema).nullish(),
  pending_safety_checks: external_exports.array(openaiResponsesComputerSafetyCheckSchema).nullish()
});
var openaiResponsesNestedErrorChunkSchema = external_exports.object({
  type: external_exports.literal("error"),
  sequence_number: external_exports.number(),
  error: external_exports.object({
    type: external_exports.string(),
    code: external_exports.string(),
    message: external_exports.string(),
    param: external_exports.string().nullish()
  })
});
var openaiResponsesErrorChunkSchema = external_exports.object({
  type: external_exports.literal("error"),
  sequence_number: external_exports.number(),
  code: external_exports.string().nullish(),
  message: external_exports.string(),
  param: external_exports.string().nullish()
});
var openaiResponsesChunkSchema = lazySchema(
  () => zodSchema(
    external_exports.union([
      external_exports.object({
        type: external_exports.literal("response.output_text.delta"),
        item_id: external_exports.string(),
        delta: external_exports.string(),
        logprobs: external_exports.array(
          external_exports.object({
            token: external_exports.string(),
            logprob: external_exports.number(),
            top_logprobs: external_exports.array(
              external_exports.object({
                token: external_exports.string(),
                logprob: external_exports.number()
              })
            )
          })
        ).nullish()
      }),
      external_exports.object({
        type: external_exports.enum(["response.completed", "response.incomplete"]),
        response: external_exports.object({
          incomplete_details: external_exports.object({ reason: external_exports.string() }).nullish(),
          usage: external_exports.object({
            input_tokens: external_exports.number(),
            input_tokens_details: external_exports.object({
              cached_tokens: external_exports.number().nullish(),
              cache_write_tokens: external_exports.number().nullish(),
              orchestration_input_tokens: external_exports.number().nullish(),
              orchestration_input_cached_tokens: external_exports.number().nullish()
            }).nullish(),
            output_tokens: external_exports.number(),
            output_tokens_details: external_exports.object({
              reasoning_tokens: external_exports.number().nullish(),
              orchestration_output_tokens: external_exports.number().nullish()
            }).nullish()
          }),
          reasoning: external_exports.object({
            context: external_exports.string().nullish()
          }).nullish(),
          service_tier: external_exports.string().nullish()
        })
      }),
      external_exports.object({
        type: external_exports.literal("response.failed"),
        sequence_number: external_exports.number(),
        response: external_exports.object({
          error: external_exports.object({
            code: external_exports.string().nullish(),
            message: external_exports.string()
          }).nullish(),
          incomplete_details: external_exports.object({ reason: external_exports.string() }).nullish(),
          usage: external_exports.object({
            input_tokens: external_exports.number(),
            input_tokens_details: external_exports.object({
              cached_tokens: external_exports.number().nullish(),
              cache_write_tokens: external_exports.number().nullish(),
              orchestration_input_tokens: external_exports.number().nullish(),
              orchestration_input_cached_tokens: external_exports.number().nullish()
            }).nullish(),
            output_tokens: external_exports.number(),
            output_tokens_details: external_exports.object({
              reasoning_tokens: external_exports.number().nullish(),
              orchestration_output_tokens: external_exports.number().nullish()
            }).nullish()
          }).nullish(),
          reasoning: external_exports.object({
            context: external_exports.string().nullish()
          }).nullish(),
          service_tier: external_exports.string().nullish()
        })
      }),
      external_exports.object({
        type: external_exports.literal("response.created"),
        response: external_exports.object({
          id: external_exports.string(),
          created_at: external_exports.number(),
          model: external_exports.string(),
          service_tier: external_exports.string().nullish()
        })
      }),
      external_exports.object({
        type: external_exports.literal("response.output_item.added"),
        output_index: external_exports.number(),
        item: external_exports.discriminatedUnion("type", [
          external_exports.object({
            type: external_exports.literal("message"),
            id: external_exports.string(),
            phase: external_exports.enum(["commentary", "final_answer"]).nullish()
          }),
          external_exports.object({
            type: external_exports.literal("reasoning"),
            id: external_exports.string(),
            encrypted_content: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("function_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            name: external_exports.string(),
            arguments: external_exports.string(),
            namespace: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("web_search_call"),
            id: external_exports.string(),
            status: external_exports.string()
          }),
          openaiResponsesComputerCallSchema,
          external_exports.object({
            type: external_exports.literal("file_search_call"),
            id: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("image_generation_call"),
            id: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("code_interpreter_call"),
            id: external_exports.string(),
            container_id: external_exports.string(),
            code: external_exports.string().nullable(),
            outputs: external_exports.array(
              external_exports.discriminatedUnion("type", [
                external_exports.object({ type: external_exports.literal("logs"), logs: external_exports.string() }),
                external_exports.object({ type: external_exports.literal("image"), url: external_exports.string() })
              ])
            ).nullable(),
            status: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("mcp_call"),
            id: external_exports.string(),
            status: external_exports.string(),
            approval_request_id: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("mcp_list_tools"),
            id: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("mcp_approval_request"),
            id: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("apply_patch_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed"]),
            operation: external_exports.discriminatedUnion("type", [
              external_exports.object({
                type: external_exports.literal("create_file"),
                path: external_exports.string(),
                diff: external_exports.string()
              }),
              external_exports.object({
                type: external_exports.literal("delete_file"),
                path: external_exports.string()
              }),
              external_exports.object({
                type: external_exports.literal("update_file"),
                path: external_exports.string(),
                diff: external_exports.string()
              })
            ])
          }),
          external_exports.object({
            type: external_exports.literal("custom_tool_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            name: external_exports.string(),
            input: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("shell_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            action: external_exports.object({
              commands: external_exports.array(external_exports.string())
            })
          }),
          external_exports.object({
            type: external_exports.literal("compaction"),
            id: external_exports.string(),
            encrypted_content: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("shell_call_output"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            output: external_exports.array(
              external_exports.object({
                stdout: external_exports.string(),
                stderr: external_exports.string(),
                outcome: external_exports.discriminatedUnion("type", [
                  external_exports.object({ type: external_exports.literal("timeout") }),
                  external_exports.object({
                    type: external_exports.literal("exit"),
                    exit_code: external_exports.number()
                  })
                ])
              })
            )
          }),
          external_exports.object({
            type: external_exports.literal("tool_search_call"),
            id: external_exports.string(),
            execution: external_exports.enum(["server", "client"]),
            call_id: external_exports.string().nullable(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            arguments: external_exports.unknown()
          }),
          external_exports.object({
            type: external_exports.literal("tool_search_output"),
            id: external_exports.string(),
            execution: external_exports.enum(["server", "client"]),
            call_id: external_exports.string().nullable(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            tools: external_exports.array(external_exports.record(external_exports.string(), jsonValueSchema22.optional()))
          })
        ])
      }),
      external_exports.object({
        type: external_exports.literal("response.output_item.done"),
        output_index: external_exports.number(),
        item: external_exports.discriminatedUnion("type", [
          external_exports.object({
            type: external_exports.literal("message"),
            id: external_exports.string(),
            phase: external_exports.enum(["commentary", "final_answer"]).nullish()
          }),
          external_exports.object({
            type: external_exports.literal("reasoning"),
            id: external_exports.string(),
            encrypted_content: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("function_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            name: external_exports.string(),
            arguments: external_exports.string(),
            status: external_exports.literal("completed"),
            namespace: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("custom_tool_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            name: external_exports.string(),
            input: external_exports.string(),
            status: external_exports.literal("completed")
          }),
          external_exports.object({
            type: external_exports.literal("code_interpreter_call"),
            id: external_exports.string(),
            code: external_exports.string().nullable(),
            container_id: external_exports.string(),
            outputs: external_exports.array(
              external_exports.discriminatedUnion("type", [
                external_exports.object({ type: external_exports.literal("logs"), logs: external_exports.string() }),
                external_exports.object({ type: external_exports.literal("image"), url: external_exports.string() })
              ])
            ).nullable()
          }),
          external_exports.object({
            type: external_exports.literal("image_generation_call"),
            id: external_exports.string(),
            result: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("web_search_call"),
            id: external_exports.string(),
            status: external_exports.string(),
            action: external_exports.discriminatedUnion("type", [
              external_exports.object({
                type: external_exports.literal("search"),
                query: external_exports.string().nullish(),
                queries: external_exports.array(external_exports.string()).nullish(),
                sources: external_exports.array(
                  external_exports.discriminatedUnion("type", [
                    external_exports.object({ type: external_exports.literal("url"), url: external_exports.string() }),
                    external_exports.object({ type: external_exports.literal("api"), name: external_exports.string() })
                  ])
                ).nullish()
              }),
              external_exports.object({
                type: external_exports.literal("open_page"),
                url: external_exports.string().nullish()
              }),
              external_exports.object({
                type: external_exports.literal("find_in_page"),
                url: external_exports.string().nullish(),
                pattern: external_exports.string().nullish()
              })
            ]).nullish()
          }),
          external_exports.object({
            type: external_exports.literal("file_search_call"),
            id: external_exports.string(),
            queries: external_exports.array(external_exports.string()),
            results: external_exports.array(
              external_exports.object({
                attributes: external_exports.record(
                  external_exports.string(),
                  external_exports.union([external_exports.string(), external_exports.number(), external_exports.boolean()])
                ),
                file_id: external_exports.string(),
                filename: external_exports.string(),
                score: external_exports.number(),
                text: external_exports.string()
              })
            ).nullish()
          }),
          external_exports.object({
            type: external_exports.literal("local_shell_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            action: external_exports.object({
              type: external_exports.literal("exec"),
              command: external_exports.array(external_exports.string()),
              timeout_ms: external_exports.number().optional(),
              user: external_exports.string().optional(),
              working_directory: external_exports.string().optional(),
              env: external_exports.record(external_exports.string(), external_exports.string()).optional()
            })
          }),
          openaiResponsesComputerCallSchema,
          external_exports.object({
            type: external_exports.literal("mcp_call"),
            id: external_exports.string(),
            status: external_exports.string(),
            arguments: external_exports.string(),
            name: external_exports.string(),
            server_label: external_exports.string(),
            output: external_exports.string().nullish(),
            error: external_exports.union([
              external_exports.string(),
              external_exports.object({
                type: external_exports.string().optional(),
                code: external_exports.union([external_exports.number(), external_exports.string()]).optional(),
                message: external_exports.string().optional()
              }).loose()
            ]).nullish(),
            approval_request_id: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("mcp_list_tools"),
            id: external_exports.string(),
            server_label: external_exports.string(),
            tools: external_exports.array(
              external_exports.object({
                name: external_exports.string(),
                description: external_exports.string().optional(),
                input_schema: external_exports.any(),
                annotations: external_exports.record(external_exports.string(), external_exports.unknown()).optional()
              })
            ),
            error: external_exports.union([
              external_exports.string(),
              external_exports.object({
                type: external_exports.string().optional(),
                code: external_exports.union([external_exports.number(), external_exports.string()]).optional(),
                message: external_exports.string().optional()
              }).loose()
            ]).optional()
          }),
          external_exports.object({
            type: external_exports.literal("mcp_approval_request"),
            id: external_exports.string(),
            server_label: external_exports.string(),
            name: external_exports.string(),
            arguments: external_exports.string(),
            approval_request_id: external_exports.string().optional()
          }),
          external_exports.object({
            type: external_exports.literal("apply_patch_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed"]),
            operation: external_exports.discriminatedUnion("type", [
              external_exports.object({
                type: external_exports.literal("create_file"),
                path: external_exports.string(),
                diff: external_exports.string()
              }),
              external_exports.object({
                type: external_exports.literal("delete_file"),
                path: external_exports.string()
              }),
              external_exports.object({
                type: external_exports.literal("update_file"),
                path: external_exports.string(),
                diff: external_exports.string()
              })
            ])
          }),
          external_exports.object({
            type: external_exports.literal("shell_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            action: external_exports.object({
              commands: external_exports.array(external_exports.string())
            })
          }),
          external_exports.object({
            type: external_exports.literal("compaction"),
            id: external_exports.string(),
            encrypted_content: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("shell_call_output"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            output: external_exports.array(
              external_exports.object({
                stdout: external_exports.string(),
                stderr: external_exports.string(),
                outcome: external_exports.discriminatedUnion("type", [
                  external_exports.object({ type: external_exports.literal("timeout") }),
                  external_exports.object({
                    type: external_exports.literal("exit"),
                    exit_code: external_exports.number()
                  })
                ])
              })
            )
          }),
          external_exports.object({
            type: external_exports.literal("tool_search_call"),
            id: external_exports.string(),
            execution: external_exports.enum(["server", "client"]),
            call_id: external_exports.string().nullable(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            arguments: external_exports.unknown()
          }),
          external_exports.object({
            type: external_exports.literal("tool_search_output"),
            id: external_exports.string(),
            execution: external_exports.enum(["server", "client"]),
            call_id: external_exports.string().nullable(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            tools: external_exports.array(external_exports.record(external_exports.string(), jsonValueSchema22.optional()))
          })
        ])
      }),
      external_exports.object({
        type: external_exports.literal("response.function_call_arguments.delta"),
        item_id: external_exports.string(),
        output_index: external_exports.number(),
        delta: external_exports.string()
      }),
      external_exports.object({
        type: external_exports.literal("response.custom_tool_call_input.delta"),
        item_id: external_exports.string(),
        output_index: external_exports.number(),
        delta: external_exports.string()
      }),
      external_exports.object({
        type: external_exports.literal("response.image_generation_call.partial_image"),
        item_id: external_exports.string(),
        output_index: external_exports.number(),
        partial_image_b64: external_exports.string()
      }),
      external_exports.object({
        type: external_exports.literal("response.code_interpreter_call_code.delta"),
        item_id: external_exports.string(),
        output_index: external_exports.number(),
        delta: external_exports.string()
      }),
      external_exports.object({
        type: external_exports.literal("response.code_interpreter_call_code.done"),
        item_id: external_exports.string(),
        output_index: external_exports.number(),
        code: external_exports.string()
      }),
      external_exports.object({
        type: external_exports.literal("response.output_text.annotation.added"),
        annotation: external_exports.discriminatedUnion("type", [
          external_exports.object({
            type: external_exports.literal("url_citation"),
            start_index: external_exports.number(),
            end_index: external_exports.number(),
            url: external_exports.string(),
            title: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("file_citation"),
            file_id: external_exports.string(),
            filename: external_exports.string(),
            index: external_exports.number()
          }),
          external_exports.object({
            type: external_exports.literal("container_file_citation"),
            container_id: external_exports.string(),
            file_id: external_exports.string(),
            filename: external_exports.string(),
            start_index: external_exports.number(),
            end_index: external_exports.number()
          }),
          external_exports.object({
            type: external_exports.literal("file_path"),
            file_id: external_exports.string(),
            index: external_exports.number()
          })
        ])
      }),
      external_exports.object({
        type: external_exports.literal("response.reasoning_summary_part.added"),
        item_id: external_exports.string(),
        summary_index: external_exports.number()
      }),
      external_exports.object({
        type: external_exports.literal("response.reasoning_summary_text.delta"),
        item_id: external_exports.string(),
        summary_index: external_exports.number(),
        delta: external_exports.string()
      }),
      external_exports.object({
        type: external_exports.literal("response.reasoning_summary_part.done"),
        item_id: external_exports.string(),
        summary_index: external_exports.number()
      }),
      external_exports.object({
        type: external_exports.literal("response.apply_patch_call_operation_diff.delta"),
        item_id: external_exports.string(),
        output_index: external_exports.number(),
        delta: external_exports.string(),
        obfuscation: external_exports.string().nullish()
      }),
      external_exports.object({
        type: external_exports.literal("response.apply_patch_call_operation_diff.done"),
        item_id: external_exports.string(),
        output_index: external_exports.number(),
        diff: external_exports.string()
      }),
      openaiResponsesNestedErrorChunkSchema,
      openaiResponsesErrorChunkSchema,
      external_exports.object({ type: external_exports.string() }).loose().transform((value) => ({
        type: "unknown_chunk",
        message: value.type
      }))
      // fallback for unknown chunks
    ])
  )
);
var openaiResponsesResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      id: external_exports.string().optional(),
      created_at: external_exports.number().optional(),
      error: external_exports.object({
        message: external_exports.string(),
        type: external_exports.string(),
        param: external_exports.string().nullish(),
        code: external_exports.string()
      }).nullish(),
      model: external_exports.string().optional(),
      output: external_exports.array(
        external_exports.discriminatedUnion("type", [
          external_exports.object({
            type: external_exports.literal("message"),
            role: external_exports.literal("assistant"),
            id: external_exports.string(),
            phase: external_exports.enum(["commentary", "final_answer"]).nullish(),
            content: external_exports.array(
              external_exports.object({
                type: external_exports.literal("output_text"),
                text: external_exports.string(),
                logprobs: external_exports.array(
                  external_exports.object({
                    token: external_exports.string(),
                    logprob: external_exports.number(),
                    top_logprobs: external_exports.array(
                      external_exports.object({
                        token: external_exports.string(),
                        logprob: external_exports.number()
                      })
                    )
                  })
                ).nullish(),
                annotations: external_exports.array(
                  external_exports.discriminatedUnion("type", [
                    external_exports.object({
                      type: external_exports.literal("url_citation"),
                      start_index: external_exports.number(),
                      end_index: external_exports.number(),
                      url: external_exports.string(),
                      title: external_exports.string()
                    }),
                    external_exports.object({
                      type: external_exports.literal("file_citation"),
                      file_id: external_exports.string(),
                      filename: external_exports.string(),
                      index: external_exports.number()
                    }),
                    external_exports.object({
                      type: external_exports.literal("container_file_citation"),
                      container_id: external_exports.string(),
                      file_id: external_exports.string(),
                      filename: external_exports.string(),
                      start_index: external_exports.number(),
                      end_index: external_exports.number()
                    }),
                    external_exports.object({
                      type: external_exports.literal("file_path"),
                      file_id: external_exports.string(),
                      index: external_exports.number()
                    })
                  ])
                )
              })
            )
          }),
          external_exports.object({
            type: external_exports.literal("web_search_call"),
            id: external_exports.string(),
            status: external_exports.string(),
            action: external_exports.discriminatedUnion("type", [
              external_exports.object({
                type: external_exports.literal("search"),
                query: external_exports.string().nullish(),
                queries: external_exports.array(external_exports.string()).nullish(),
                sources: external_exports.array(
                  external_exports.discriminatedUnion("type", [
                    external_exports.object({ type: external_exports.literal("url"), url: external_exports.string() }),
                    external_exports.object({
                      type: external_exports.literal("api"),
                      name: external_exports.string()
                    })
                  ])
                ).nullish()
              }),
              external_exports.object({
                type: external_exports.literal("open_page"),
                url: external_exports.string().nullish()
              }),
              external_exports.object({
                type: external_exports.literal("find_in_page"),
                url: external_exports.string().nullish(),
                pattern: external_exports.string().nullish()
              })
            ]).nullish()
          }),
          external_exports.object({
            type: external_exports.literal("file_search_call"),
            id: external_exports.string(),
            queries: external_exports.array(external_exports.string()),
            results: external_exports.array(
              external_exports.object({
                attributes: external_exports.record(
                  external_exports.string(),
                  external_exports.union([external_exports.string(), external_exports.number(), external_exports.boolean()])
                ),
                file_id: external_exports.string(),
                filename: external_exports.string(),
                score: external_exports.number(),
                text: external_exports.string()
              })
            ).nullish()
          }),
          external_exports.object({
            type: external_exports.literal("code_interpreter_call"),
            id: external_exports.string(),
            code: external_exports.string().nullable(),
            container_id: external_exports.string(),
            outputs: external_exports.array(
              external_exports.discriminatedUnion("type", [
                external_exports.object({ type: external_exports.literal("logs"), logs: external_exports.string() }),
                external_exports.object({ type: external_exports.literal("image"), url: external_exports.string() })
              ])
            ).nullable()
          }),
          external_exports.object({
            type: external_exports.literal("image_generation_call"),
            id: external_exports.string(),
            result: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("local_shell_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            action: external_exports.object({
              type: external_exports.literal("exec"),
              command: external_exports.array(external_exports.string()),
              timeout_ms: external_exports.number().optional(),
              user: external_exports.string().optional(),
              working_directory: external_exports.string().optional(),
              env: external_exports.record(external_exports.string(), external_exports.string()).optional()
            })
          }),
          external_exports.object({
            type: external_exports.literal("function_call"),
            call_id: external_exports.string(),
            name: external_exports.string(),
            arguments: external_exports.string(),
            id: external_exports.string(),
            namespace: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("custom_tool_call"),
            call_id: external_exports.string(),
            name: external_exports.string(),
            input: external_exports.string(),
            id: external_exports.string()
          }),
          openaiResponsesComputerCallSchema,
          external_exports.object({
            type: external_exports.literal("reasoning"),
            id: external_exports.string(),
            encrypted_content: external_exports.string().nullish(),
            summary: external_exports.array(
              external_exports.object({
                type: external_exports.literal("summary_text"),
                text: external_exports.string()
              })
            )
          }),
          external_exports.object({
            type: external_exports.literal("mcp_call"),
            id: external_exports.string(),
            status: external_exports.string(),
            arguments: external_exports.string(),
            name: external_exports.string(),
            server_label: external_exports.string(),
            output: external_exports.string().nullish(),
            error: external_exports.union([
              external_exports.string(),
              external_exports.object({
                type: external_exports.string().optional(),
                code: external_exports.union([external_exports.number(), external_exports.string()]).optional(),
                message: external_exports.string().optional()
              }).loose()
            ]).nullish(),
            approval_request_id: external_exports.string().nullish()
          }),
          external_exports.object({
            type: external_exports.literal("mcp_list_tools"),
            id: external_exports.string(),
            server_label: external_exports.string(),
            tools: external_exports.array(
              external_exports.object({
                name: external_exports.string(),
                description: external_exports.string().optional(),
                input_schema: external_exports.any(),
                annotations: external_exports.record(external_exports.string(), external_exports.unknown()).optional()
              })
            ),
            error: external_exports.union([
              external_exports.string(),
              external_exports.object({
                type: external_exports.string().optional(),
                code: external_exports.union([external_exports.number(), external_exports.string()]).optional(),
                message: external_exports.string().optional()
              }).loose()
            ]).optional()
          }),
          external_exports.object({
            type: external_exports.literal("mcp_approval_request"),
            id: external_exports.string(),
            server_label: external_exports.string(),
            name: external_exports.string(),
            arguments: external_exports.string(),
            approval_request_id: external_exports.string().optional()
          }),
          external_exports.object({
            type: external_exports.literal("apply_patch_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed"]),
            operation: external_exports.discriminatedUnion("type", [
              external_exports.object({
                type: external_exports.literal("create_file"),
                path: external_exports.string(),
                diff: external_exports.string()
              }),
              external_exports.object({
                type: external_exports.literal("delete_file"),
                path: external_exports.string()
              }),
              external_exports.object({
                type: external_exports.literal("update_file"),
                path: external_exports.string(),
                diff: external_exports.string()
              })
            ])
          }),
          external_exports.object({
            type: external_exports.literal("shell_call"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            action: external_exports.object({
              commands: external_exports.array(external_exports.string())
            })
          }),
          external_exports.object({
            type: external_exports.literal("compaction"),
            id: external_exports.string(),
            encrypted_content: external_exports.string()
          }),
          external_exports.object({
            type: external_exports.literal("shell_call_output"),
            id: external_exports.string(),
            call_id: external_exports.string(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            output: external_exports.array(
              external_exports.object({
                stdout: external_exports.string(),
                stderr: external_exports.string(),
                outcome: external_exports.discriminatedUnion("type", [
                  external_exports.object({ type: external_exports.literal("timeout") }),
                  external_exports.object({
                    type: external_exports.literal("exit"),
                    exit_code: external_exports.number()
                  })
                ])
              })
            )
          }),
          external_exports.object({
            type: external_exports.literal("tool_search_call"),
            id: external_exports.string(),
            execution: external_exports.enum(["server", "client"]),
            call_id: external_exports.string().nullable(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            arguments: external_exports.unknown()
          }),
          external_exports.object({
            type: external_exports.literal("tool_search_output"),
            id: external_exports.string(),
            execution: external_exports.enum(["server", "client"]),
            call_id: external_exports.string().nullable(),
            status: external_exports.enum(["in_progress", "completed", "incomplete"]),
            tools: external_exports.array(external_exports.record(external_exports.string(), jsonValueSchema22.optional()))
          })
        ])
      ).optional(),
      service_tier: external_exports.string().nullish(),
      reasoning: external_exports.object({
        context: external_exports.string().nullish()
      }).nullish(),
      incomplete_details: external_exports.object({ reason: external_exports.string() }).nullish(),
      usage: external_exports.object({
        input_tokens: external_exports.number(),
        input_tokens_details: external_exports.object({
          cached_tokens: external_exports.number().nullish(),
          cache_write_tokens: external_exports.number().nullish(),
          orchestration_input_tokens: external_exports.number().nullish(),
          orchestration_input_cached_tokens: external_exports.number().nullish()
        }).nullish(),
        output_tokens: external_exports.number(),
        output_tokens_details: external_exports.object({
          reasoning_tokens: external_exports.number().nullish(),
          orchestration_output_tokens: external_exports.number().nullish()
        }).nullish()
      }).optional()
    })
  )
);
var TOP_LOGPROBS_MAX = 20;
var openaiResponsesReasoningModelIds = [
  "o1",
  "o1-2024-12-17",
  "o3",
  "o3-2025-04-16",
  "o3-mini",
  "o3-mini-2025-01-31",
  "o4-mini",
  "o4-mini-2025-04-16",
  "gpt-5",
  "gpt-5-2025-08-07",
  "gpt-5-codex",
  "gpt-5-mini",
  "gpt-5-mini-2025-08-07",
  "gpt-5-nano",
  "gpt-5-nano-2025-08-07",
  "gpt-5-pro",
  "gpt-5-pro-2025-10-06",
  "gpt-5.1",
  "gpt-5.1-chat-latest",
  "gpt-5.1-codex-mini",
  "gpt-5.1-codex",
  "gpt-5.1-codex-max",
  "gpt-5.2",
  "gpt-5.2-chat-latest",
  "gpt-5.2-pro",
  "gpt-5.2-codex",
  "gpt-5.3-chat-latest",
  "gpt-5.3-codex",
  "gpt-5.4",
  "gpt-5.4-2026-03-05",
  "gpt-5.4-mini",
  "gpt-5.4-mini-2026-03-17",
  "gpt-5.4-nano",
  "gpt-5.4-nano-2026-03-17",
  "gpt-5.4-pro",
  "gpt-5.4-pro-2026-03-05",
  "gpt-5.5",
  "gpt-5.5-2026-04-23",
  "gpt-5.6",
  "gpt-5.6-luna",
  "gpt-5.6-sol",
  "gpt-5.6-terra"
];
var openaiResponsesModelIds = [
  "gpt-4.1",
  "gpt-4.1-2025-04-14",
  "gpt-4.1-mini",
  "gpt-4.1-mini-2025-04-14",
  "gpt-4.1-nano",
  "gpt-4.1-nano-2025-04-14",
  "gpt-4o",
  "gpt-4o-2024-05-13",
  "gpt-4o-2024-08-06",
  "gpt-4o-2024-11-20",
  "gpt-4o-audio-preview",
  "gpt-4o-audio-preview-2024-12-17",
  "gpt-4o-search-preview",
  "gpt-4o-search-preview-2025-03-11",
  "gpt-4o-mini-search-preview",
  "gpt-4o-mini-search-preview-2025-03-11",
  "gpt-4o-mini",
  "gpt-4o-mini-2024-07-18",
  "gpt-3.5-turbo-0125",
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-1106",
  "gpt-5-chat-latest",
  ...openaiResponsesReasoningModelIds
];
var openaiLanguageModelResponsesOptionsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      /**
       * The ID of the OpenAI Conversation to continue.
       * You must create a conversation first via the OpenAI API.
       * Cannot be used in conjunction with `previousResponseId`.
       * Defaults to `undefined`.
       * @see https://platform.openai.com/docs/api-reference/conversations/create
       */
      conversation: external_exports.string().nullish(),
      /**
       * The set of extra fields to include in the response (advanced, usually not needed).
       * Example values: 'reasoning.encrypted_content', 'file_search_call.results', 'web_search_call.results', 'message.output_text.logprobs'.
       */
      include: external_exports.array(
        external_exports.enum([
          "reasoning.encrypted_content",
          // handled internally by default, only needed for unknown reasoning models
          "file_search_call.results",
          "web_search_call.results",
          "message.output_text.logprobs"
        ])
      ).nullish(),
      /**
       * Instructions for the model.
       * They can be used to change the system or developer message when continuing a conversation using the `previousResponseId` option.
       * Defaults to `undefined`.
       */
      instructions: external_exports.string().nullish(),
      /**
       * Return the log probabilities of the tokens. Including logprobs will increase
       * the response size and can slow down response times. However, it can
       * be useful to better understand how the model is behaving.
       *
       * Setting to true will return the log probabilities of the tokens that
       * were generated.
       *
       * Setting to a number will return the log probabilities of the top n
       * tokens that were generated.
       *
       * @see https://platform.openai.com/docs/api-reference/responses/create
       * @see https://cookbook.openai.com/examples/using_logprobs
       */
      logprobs: external_exports.union([external_exports.boolean(), external_exports.number().min(1).max(TOP_LOGPROBS_MAX)]).optional(),
      /**
       * The maximum number of total calls to built-in tools that can be processed in a response.
       * This maximum number applies across all built-in tool calls, not per individual tool.
       * Any further attempts to call a tool by the model will be ignored.
       */
      maxToolCalls: external_exports.number().nullish(),
      /**
       * Additional metadata to store with the generation.
       */
      metadata: external_exports.any().nullish(),
      /**
       * Whether to use parallel tool calls. Defaults to `true`.
       */
      parallelToolCalls: external_exports.boolean().nullish(),
      /**
       * The ID of the previous response. You can use it to continue a conversation.
       * Defaults to `undefined`.
       */
      previousResponseId: external_exports.string().nullish(),
      /**
       * Sets a cache key to tie this prompt to cached prefixes for better caching performance.
       */
      promptCacheKey: external_exports.string().nullish(),
      /**
       * Prompt cache behavior for GPT-5.6 and later models.
       * `mode` controls whether OpenAI also places an implicit breakpoint.
       * `ttl` sets the minimum cache lifetime and currently only supports 30 minutes.
       */
      promptCacheOptions: external_exports.object({
        mode: external_exports.enum(["implicit", "explicit"]).optional(),
        ttl: external_exports.literal("30m").optional()
      }).optional(),
      /**
       * The retention policy for the prompt cache.
       * - 'in_memory': Default. Standard prompt caching behavior.
       * - '24h': Extended prompt caching that keeps cached prefixes active for up to 24 hours.
       *          Available for models before GPT-5.6 that support extended caching.
       *
       * @deprecated For GPT-5.6 and later models, use `promptCacheOptions.ttl`.
       *
       * @default 'in_memory'
       */
      promptCacheRetention: external_exports.enum(["in_memory", "24h"]).nullish(),
      /**
       * Reasoning effort for reasoning models. Defaults to `medium`. If you use
       * `providerOptions` to set the `reasoningEffort` option, this model setting will be ignored.
       * GPT-5.6 supports 'none' | 'low' | 'medium' | 'high' | 'xhigh' | 'max'.
       * Supported values vary by model.
       */
      reasoningEffort: external_exports.string().nullish(),
      /**
       * Controls how much model work GPT-5.6 performs before returning a final answer.
       * `standard` is the default. `pro` increases quality, latency, and token usage.
       */
      reasoningMode: external_exports.enum(["standard", "pro"]).optional(),
      /**
       * Controls which available reasoning items GPT-5.6 can use.
       * `auto` uses the model default, `current_turn` excludes reasoning from earlier
       * turns, and `all_turns` makes compatible earlier reasoning available.
       */
      reasoningContext: external_exports.enum(["auto", "current_turn", "all_turns"]).optional(),
      /**
       * Controls reasoning summary output from the model.
       * Set to "auto" to automatically receive the richest level available,
       * or "detailed" for comprehensive summaries.
       */
      reasoningSummary: external_exports.string().nullish(),
      /**
       * The identifier for safety monitoring and tracking.
       */
      safetyIdentifier: external_exports.string().nullish(),
      /**
       * Service tier for the request.
       * Set to 'flex' for 50% cheaper processing at the cost of increased latency (available for o3, o4-mini, and gpt-5 models).
       * Set to 'priority' for faster processing with Enterprise access (available for gpt-4, gpt-5, gpt-5-mini, o3, o4-mini; gpt-5-nano is not supported).
       *
       * Defaults to 'auto'.
       */
      serviceTier: external_exports.enum(["auto", "flex", "priority", "default"]).nullish(),
      /**
       * Whether to store the generation. Defaults to `true`.
       */
      store: external_exports.boolean().nullish(),
      /**
       * Whether to pass through non-image file types as generic input files.
       *
       * By default, inline file inputs are restricted to images and PDFs.
       * Enable this when the target OpenAI Responses model supports additional
       * file media types, such as text/csv.
       */
      passThroughUnsupportedFiles: external_exports.boolean().optional(),
      /**
       * Whether to use strict JSON schema validation.
       * Defaults to `true`.
       */
      strictJsonSchema: external_exports.boolean().nullish(),
      /**
       * Controls the verbosity of the model's responses. Lower values ('low') will result
       * in more concise responses, while higher values ('high') will result in more verbose responses.
       * Valid values: 'low', 'medium', 'high'.
       */
      textVerbosity: external_exports.enum(["low", "medium", "high"]).nullish(),
      /**
       * Controls output truncation. 'auto' (default) performs truncation automatically;
       * 'disabled' turns truncation off.
       */
      truncation: external_exports.enum(["auto", "disabled"]).nullish(),
      /**
       * A unique identifier representing your end-user, which can help OpenAI to
       * monitor and detect abuse.
       * Defaults to `undefined`.
       * @see https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids
       */
      user: external_exports.string().nullish(),
      /**
       * Override the system message mode for this model.
       * - 'system': Use the 'system' role for system messages (default for most models)
       * - 'developer': Use the 'developer' role for system messages (used by reasoning models)
       * - 'remove': Remove system messages entirely
       *
       * If not specified, the mode is automatically determined based on the model.
       */
      systemMessageMode: external_exports.enum(["system", "developer", "remove"]).optional(),
      /**
       * Force treating this model as a reasoning model.
       *
       * This is useful for "stealth" reasoning models (e.g. via a custom baseURL)
       * where the model ID is not recognized by the SDK's allowlist.
       *
       * When enabled, the SDK applies reasoning-model parameter compatibility rules
       * and defaults `systemMessageMode` to `developer` unless overridden.
       */
      forceReasoning: external_exports.boolean().optional(),
      /**
       * Enable server-side context management (compaction).
       */
      contextManagement: external_exports.array(
        external_exports.object({
          type: external_exports.literal("compaction"),
          compactThreshold: external_exports.number()
        })
      ).nullish(),
      /**
       * Restrict the callable tools to a subset while keeping the full tools
       * list intact, so prompt caching is preserved across requests with
       * different allowlists.
       *
       * When set, this overrides the request-level `toolChoice` and emits
       * `tool_choice: { type: "allowed_tools", mode, tools }` on the wire.
       *
       * @see https://developers.openai.com/api/reference/resources/responses/methods/create#(resource)%20responses%20%3E%20(model)%20tool_choice_allowed%20%3E%20(schema)
       */
      allowedTools: external_exports.object({
        toolNames: external_exports.array(external_exports.string()).min(1),
        mode: external_exports.enum(["auto", "required"]).optional()
      }).optional()
    })
  )
);
async function prepareResponsesTools({
  tools,
  toolChoice,
  allowedTools,
  toolNameMapping,
  customProviderToolNames
}) {
  var _a24, _b18, _c;
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0, toolWarnings };
  }
  const openaiTools2 = [];
  const namespaceTools = /* @__PURE__ */ new Map();
  const resolvedCustomProviderToolNames = customProviderToolNames != null ? customProviderToolNames : /* @__PURE__ */ new Set();
  for (const tool2 of tools) {
    switch (tool2.type) {
      case "function": {
        const openaiOptions = (_a24 = tool2.providerOptions) == null ? void 0 : _a24.openai;
        const openaiFunctionTool = prepareFunctionTool({
          tool: tool2,
          options: openaiOptions
        });
        const namespace = openaiOptions == null ? void 0 : openaiOptions.namespace;
        if (namespace == null) {
          openaiTools2.push(openaiFunctionTool);
        } else {
          let namespaceTool = namespaceTools.get(namespace.name);
          if (namespaceTool == null) {
            namespaceTool = {
              type: "namespace",
              name: namespace.name,
              description: namespace.description,
              tools: []
            };
            namespaceTools.set(namespace.name, namespaceTool);
            openaiTools2.push(namespaceTool);
          } else if (namespaceTool.description !== namespace.description) {
            throw new UnsupportedFunctionalityError({
              functionality: `conflicting descriptions for OpenAI tool namespace "${namespace.name}"`
            });
          }
          namespaceTool.tools.push(openaiFunctionTool);
        }
        break;
      }
      case "provider": {
        switch (tool2.id) {
          case "openai.file_search": {
            const args = await validateTypes({
              value: tool2.args,
              schema: fileSearchArgsSchema
            });
            openaiTools2.push({
              type: "file_search",
              vector_store_ids: args.vectorStoreIds,
              max_num_results: args.maxNumResults,
              ranking_options: args.ranking ? {
                ranker: args.ranking.ranker,
                score_threshold: args.ranking.scoreThreshold
              } : void 0,
              filters: args.filters
            });
            break;
          }
          case "openai.local_shell": {
            openaiTools2.push({
              type: "local_shell"
            });
            break;
          }
          case "openai.shell": {
            const args = await validateTypes({
              value: tool2.args,
              schema: shellArgsSchema
            });
            openaiTools2.push({
              type: "shell",
              ...args.environment && {
                environment: mapShellEnvironment(args.environment)
              }
            });
            break;
          }
          case "openai.apply_patch": {
            openaiTools2.push({
              type: "apply_patch"
            });
            break;
          }
          case "openai.computer": {
            openaiTools2.push({
              type: "computer"
            });
            break;
          }
          case "openai.web_search_preview": {
            const args = await validateTypes({
              value: tool2.args,
              schema: webSearchPreviewArgsSchema
            });
            openaiTools2.push({
              type: "web_search_preview",
              search_context_size: args.searchContextSize,
              user_location: args.userLocation
            });
            break;
          }
          case "openai.web_search": {
            const args = await validateTypes({
              value: tool2.args,
              schema: webSearchArgsSchema
            });
            openaiTools2.push({
              type: "web_search",
              filters: args.filters != null ? { allowed_domains: args.filters.allowedDomains } : void 0,
              external_web_access: args.externalWebAccess,
              search_context_size: args.searchContextSize,
              user_location: args.userLocation
            });
            break;
          }
          case "openai.code_interpreter": {
            const args = await validateTypes({
              value: tool2.args,
              schema: codeInterpreterArgsSchema
            });
            openaiTools2.push({
              type: "code_interpreter",
              container: args.container == null ? { type: "auto", file_ids: void 0 } : typeof args.container === "string" ? args.container : { type: "auto", file_ids: args.container.fileIds }
            });
            break;
          }
          case "openai.image_generation": {
            const args = await validateTypes({
              value: tool2.args,
              schema: imageGenerationArgsSchema
            });
            openaiTools2.push({
              type: "image_generation",
              background: args.background,
              input_fidelity: args.inputFidelity,
              input_image_mask: args.inputImageMask ? {
                file_id: args.inputImageMask.fileId,
                image_url: args.inputImageMask.imageUrl
              } : void 0,
              model: args.model,
              moderation: args.moderation,
              partial_images: args.partialImages,
              quality: args.quality,
              output_compression: args.outputCompression,
              output_format: args.outputFormat,
              size: args.size
            });
            break;
          }
          case "openai.mcp": {
            const args = await validateTypes({
              value: tool2.args,
              schema: mcpArgsSchema
            });
            const mapApprovalFilter = /* @__PURE__ */ __name((filter2) => ({
              tool_names: filter2.toolNames
            }), "mapApprovalFilter");
            const requireApproval = args.requireApproval;
            const requireApprovalParam = requireApproval == null ? void 0 : typeof requireApproval === "string" ? requireApproval : requireApproval.never != null ? { never: mapApprovalFilter(requireApproval.never) } : void 0;
            openaiTools2.push({
              type: "mcp",
              server_label: args.serverLabel,
              allowed_tools: Array.isArray(args.allowedTools) ? args.allowedTools : args.allowedTools ? {
                read_only: args.allowedTools.readOnly,
                tool_names: args.allowedTools.toolNames
              } : void 0,
              authorization: args.authorization,
              connector_id: args.connectorId,
              headers: args.headers,
              require_approval: requireApprovalParam != null ? requireApprovalParam : "never",
              server_description: args.serverDescription,
              server_url: args.serverUrl
            });
            break;
          }
          case "openai.custom": {
            const args = await validateTypes({
              value: tool2.args,
              schema: customArgsSchema
            });
            openaiTools2.push({
              type: "custom",
              name: tool2.name,
              description: args.description,
              format: args.format
            });
            resolvedCustomProviderToolNames.add(tool2.name);
            break;
          }
          case "openai.tool_search": {
            const args = await validateTypes({
              value: tool2.args,
              schema: toolSearchArgsSchema
            });
            openaiTools2.push({
              type: "tool_search",
              ...args.execution != null ? { execution: args.execution } : {},
              ...args.description != null ? { description: args.description } : {},
              ...args.parameters != null ? { parameters: args.parameters } : {}
            });
            break;
          }
        }
        break;
      }
      default:
        toolWarnings.push({
          type: "unsupported",
          feature: `function tool ${tool2}`
        });
        break;
    }
  }
  if (allowedTools != null) {
    return {
      tools: openaiTools2,
      toolChoice: {
        type: "allowed_tools",
        mode: (_b18 = allowedTools.mode) != null ? _b18 : "auto",
        tools: allowedTools.toolNames.map((name24) => {
          var _a25;
          return {
            type: "function",
            name: (_a25 = toolNameMapping == null ? void 0 : toolNameMapping.toProviderToolName(name24)) != null ? _a25 : name24
          };
        })
      },
      toolWarnings
    };
  }
  if (toolChoice == null) {
    return { tools: openaiTools2, toolChoice: void 0, toolWarnings };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
    case "required":
      return { tools: openaiTools2, toolChoice: type, toolWarnings };
    case "tool": {
      const resolvedToolName = (_c = toolNameMapping == null ? void 0 : toolNameMapping.toProviderToolName(toolChoice.toolName)) != null ? _c : toolChoice.toolName;
      return {
        tools: openaiTools2,
        toolChoice: resolvedToolName === "code_interpreter" || resolvedToolName === "file_search" || resolvedToolName === "image_generation" || resolvedToolName === "web_search_preview" || resolvedToolName === "web_search" || resolvedToolName === "mcp" || resolvedToolName === "apply_patch" || resolvedToolName === "computer" ? { type: resolvedToolName } : resolvedCustomProviderToolNames.has(resolvedToolName) ? { type: "custom", name: resolvedToolName } : { type: "function", name: resolvedToolName },
        toolWarnings
      };
    }
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
__name(prepareResponsesTools, "prepareResponsesTools");
function prepareFunctionTool({
  tool: tool2,
  options
}) {
  const deferLoading = options == null ? void 0 : options.deferLoading;
  return {
    type: "function",
    name: tool2.name,
    description: tool2.description,
    parameters: tool2.inputSchema,
    ...tool2.strict != null ? { strict: tool2.strict } : {},
    ...deferLoading != null ? { defer_loading: deferLoading } : {}
  };
}
__name(prepareFunctionTool, "prepareFunctionTool");
function mapShellEnvironment(environment) {
  if (environment.type === "containerReference") {
    const env2 = environment;
    return {
      type: "container_reference",
      container_id: env2.containerId
    };
  }
  if (environment.type === "containerAuto") {
    const env2 = environment;
    return {
      type: "container_auto",
      file_ids: env2.fileIds,
      memory_limit: env2.memoryLimit,
      network_policy: env2.networkPolicy == null ? void 0 : env2.networkPolicy.type === "disabled" ? { type: "disabled" } : {
        type: "allowlist",
        allowed_domains: env2.networkPolicy.allowedDomains,
        domain_secrets: env2.networkPolicy.domainSecrets
      },
      skills: mapShellSkills(env2.skills)
    };
  }
  const env = environment;
  return {
    type: "local",
    skills: env.skills
  };
}
__name(mapShellEnvironment, "mapShellEnvironment");
function mapShellSkills(skills) {
  return skills == null ? void 0 : skills.map(
    (skill) => {
      var _a24, _b18;
      return skill.type === "skillReference" ? {
        type: "skill_reference",
        skill_id: resolveProviderReference({
          reference: (_a24 = skill.providerReference) != null ? _a24 : {},
          provider: "openai"
        }),
        version: (_b18 = skill.version) != null ? _b18 : "latest"
      } : {
        type: "inline",
        name: skill.name,
        description: skill.description,
        source: {
          type: "base64",
          media_type: skill.source.mediaType,
          data: skill.source.data
        }
      };
    }
  );
}
__name(mapShellSkills, "mapShellSkills");
function extractApprovalRequestIdToToolCallIdMapping(prompt) {
  var _a24, _b18;
  const mapping = {};
  for (const message of prompt) {
    if (message.role !== "assistant") continue;
    for (const part of message.content) {
      if (part.type !== "tool-call") continue;
      const approvalRequestId = (_b18 = (_a24 = part.providerOptions) == null ? void 0 : _a24.openai) == null ? void 0 : _b18.approvalRequestId;
      if (approvalRequestId != null) {
        mapping[approvalRequestId] = part.toolCallId;
      }
    }
  }
  return mapping;
}
__name(extractApprovalRequestIdToToolCallIdMapping, "extractApprovalRequestIdToToolCallIdMapping");
function mapComputerAction(action) {
  switch (action.type) {
    case "click":
      return {
        type: "click",
        button: action.button,
        x: action.x,
        y: action.y,
        ...action.keys != null && { keys: action.keys }
      };
    case "double_click":
      return {
        type: "double_click",
        x: action.x,
        y: action.y,
        ...action.keys != null && { keys: action.keys }
      };
    case "drag":
      return {
        type: "drag",
        path: action.path,
        ...action.keys != null && { keys: action.keys }
      };
    case "keypress":
      return action;
    case "move":
      return {
        type: "move",
        x: action.x,
        y: action.y,
        ...action.keys != null && { keys: action.keys }
      };
    case "screenshot":
      return action;
    case "scroll":
      return {
        type: "scroll",
        x: action.x,
        y: action.y,
        scrollX: action.scroll_x,
        scrollY: action.scroll_y,
        ...action.keys != null && { keys: action.keys }
      };
    case "type":
      return action;
    case "wait":
      return action;
  }
}
__name(mapComputerAction, "mapComputerAction");
function mapComputerCallInput({
  action,
  actions,
  pending_safety_checks,
  status
}) {
  var _a24;
  return {
    actions: (actions != null ? actions : action != null ? [action] : []).map(
      mapComputerAction
    ),
    pendingSafetyChecks: (_a24 = pending_safety_checks == null ? void 0 : pending_safety_checks.map((safetyCheck) => ({
      id: safetyCheck.id,
      ...safetyCheck.code != null && { code: safetyCheck.code },
      ...safetyCheck.message != null && { message: safetyCheck.message }
    }))) != null ? _a24 : [],
    status
  };
}
__name(mapComputerCallInput, "mapComputerCallInput");
var OpenAIResponsesLanguageModel = class _OpenAIResponsesLanguageModel {
  static {
    __name(this, "_OpenAIResponsesLanguageModel");
  }
  constructor(modelId, config) {
    this.specificationVersion = "v4";
    this.supportedUrls = {
      "image/*": [/^https?:\/\/.*$/],
      "application/pdf": [/^https?:\/\/.*$/]
    };
    this.modelId = modelId;
    this.config = config;
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _OpenAIResponsesLanguageModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    maxOutputTokens,
    temperature,
    stopSequences,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    seed,
    prompt,
    reasoning,
    providerOptions,
    tools,
    toolChoice,
    responseFormat
  }) {
    var _a24, _b18, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const warnings = [];
    const modelCapabilities = getOpenAILanguageModelCapabilities(this.modelId);
    if (topK != null) {
      warnings.push({ type: "unsupported", feature: "topK" });
    }
    if (seed != null) {
      warnings.push({ type: "unsupported", feature: "seed" });
    }
    if (presencePenalty != null) {
      warnings.push({ type: "unsupported", feature: "presencePenalty" });
    }
    if (frequencyPenalty != null) {
      warnings.push({ type: "unsupported", feature: "frequencyPenalty" });
    }
    if (stopSequences != null) {
      warnings.push({ type: "unsupported", feature: "stopSequences" });
    }
    const providerOptionsName = this.config.provider.includes("azure") ? "azure" : "openai";
    let openaiOptions = await parseProviderOptions({
      provider: providerOptionsName,
      providerOptions,
      schema: openaiLanguageModelResponsesOptionsSchema
    });
    if (openaiOptions == null && providerOptionsName !== "openai") {
      openaiOptions = await parseProviderOptions({
        provider: "openai",
        providerOptions,
        schema: openaiLanguageModelResponsesOptionsSchema
      });
    }
    const resolvedReasoningEffort = (_a24 = openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null ? _a24 : isCustomReasoning(reasoning) ? reasoning : void 0;
    const resolvedReasoningSummary = (openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) !== void 0 ? openaiOptions.reasoningSummary : resolvedReasoningEffort != null && resolvedReasoningEffort !== "none" ? "detailed" : void 0;
    const isReasoningModel = (_b18 = openaiOptions == null ? void 0 : openaiOptions.forceReasoning) != null ? _b18 : modelCapabilities.isReasoningModel;
    if ((openaiOptions == null ? void 0 : openaiOptions.conversation) && (openaiOptions == null ? void 0 : openaiOptions.previousResponseId)) {
      warnings.push({
        type: "unsupported",
        feature: "conversation",
        details: "conversation and previousResponseId cannot be used together"
      });
    }
    const toolNameMapping = createToolNameMapping({
      tools,
      providerToolNames: {
        "openai.code_interpreter": "code_interpreter",
        "openai.computer": "computer",
        "openai.file_search": "file_search",
        "openai.image_generation": "image_generation",
        "openai.local_shell": "local_shell",
        "openai.shell": "shell",
        "openai.web_search": "web_search",
        "openai.web_search_preview": "web_search_preview",
        "openai.mcp": "mcp",
        "openai.apply_patch": "apply_patch",
        "openai.tool_search": "tool_search"
      }
    });
    const customProviderToolNames = /* @__PURE__ */ new Set();
    const {
      tools: openaiTools2,
      toolChoice: openaiToolChoice,
      toolWarnings
    } = await prepareResponsesTools({
      tools,
      toolChoice,
      allowedTools: (_c = openaiOptions == null ? void 0 : openaiOptions.allowedTools) != null ? _c : void 0,
      toolNameMapping,
      customProviderToolNames
    });
    const { input, warnings: inputWarnings } = await convertToOpenAIResponsesInput({
      prompt,
      toolNameMapping,
      systemMessageMode: (_d = openaiOptions == null ? void 0 : openaiOptions.systemMessageMode) != null ? _d : isReasoningModel ? "developer" : modelCapabilities.systemMessageMode,
      providerOptionsName,
      fileIdPrefixes: this.config.fileIdPrefixes,
      passThroughUnsupportedFiles: (_e = openaiOptions == null ? void 0 : openaiOptions.passThroughUnsupportedFiles) != null ? _e : false,
      store: (_f = openaiOptions == null ? void 0 : openaiOptions.store) != null ? _f : true,
      hasConversation: (openaiOptions == null ? void 0 : openaiOptions.conversation) != null,
      hasPreviousResponseId: (openaiOptions == null ? void 0 : openaiOptions.previousResponseId) != null,
      hasLocalShellTool: hasOpenAITool("openai.local_shell"),
      hasShellTool: hasOpenAITool("openai.shell"),
      hasApplyPatchTool: hasOpenAITool("openai.apply_patch"),
      hasComputerTool: hasOpenAITool("openai.computer"),
      customProviderToolNames: customProviderToolNames.size > 0 ? customProviderToolNames : void 0
    });
    warnings.push(...inputWarnings);
    const strictJsonSchema = (_g = openaiOptions == null ? void 0 : openaiOptions.strictJsonSchema) != null ? _g : true;
    let include = openaiOptions == null ? void 0 : openaiOptions.include;
    function addInclude(key) {
      if (include == null) {
        include = [key];
      } else if (!include.includes(key)) {
        include = [...include, key];
      }
    }
    __name(addInclude, "addInclude");
    function hasOpenAITool(id) {
      return (tools == null ? void 0 : tools.find((tool2) => tool2.type === "provider" && tool2.id === id)) != null;
    }
    __name(hasOpenAITool, "hasOpenAITool");
    const topLogprobs = typeof (openaiOptions == null ? void 0 : openaiOptions.logprobs) === "number" ? openaiOptions == null ? void 0 : openaiOptions.logprobs : (openaiOptions == null ? void 0 : openaiOptions.logprobs) === true ? TOP_LOGPROBS_MAX : void 0;
    if (topLogprobs) {
      addInclude("message.output_text.logprobs");
    }
    const webSearchToolName = (_h = tools == null ? void 0 : tools.find(
      (tool2) => tool2.type === "provider" && (tool2.id === "openai.web_search" || tool2.id === "openai.web_search_preview")
    )) == null ? void 0 : _h.name;
    if (webSearchToolName) {
      addInclude("web_search_call.action.sources");
    }
    if (hasOpenAITool("openai.code_interpreter")) {
      addInclude("code_interpreter_call.outputs");
    }
    const store = openaiOptions == null ? void 0 : openaiOptions.store;
    if (store === false && isReasoningModel) {
      addInclude("reasoning.encrypted_content");
    }
    const baseArgs = {
      model: this.modelId,
      input,
      temperature,
      top_p: topP,
      max_output_tokens: maxOutputTokens,
      ...((responseFormat == null ? void 0 : responseFormat.type) === "json" || (openaiOptions == null ? void 0 : openaiOptions.textVerbosity)) && {
        text: {
          ...(responseFormat == null ? void 0 : responseFormat.type) === "json" && {
            format: responseFormat.schema != null ? {
              type: "json_schema",
              strict: strictJsonSchema,
              name: (_i = responseFormat.name) != null ? _i : "response",
              description: responseFormat.description,
              schema: responseFormat.schema
            } : { type: "json_object" }
          },
          ...(openaiOptions == null ? void 0 : openaiOptions.textVerbosity) && {
            verbosity: openaiOptions.textVerbosity
          }
        }
      },
      // provider options:
      conversation: openaiOptions == null ? void 0 : openaiOptions.conversation,
      max_tool_calls: openaiOptions == null ? void 0 : openaiOptions.maxToolCalls,
      metadata: openaiOptions == null ? void 0 : openaiOptions.metadata,
      parallel_tool_calls: openaiOptions == null ? void 0 : openaiOptions.parallelToolCalls,
      previous_response_id: openaiOptions == null ? void 0 : openaiOptions.previousResponseId,
      store,
      user: openaiOptions == null ? void 0 : openaiOptions.user,
      instructions: openaiOptions == null ? void 0 : openaiOptions.instructions,
      service_tier: openaiOptions == null ? void 0 : openaiOptions.serviceTier,
      include,
      prompt_cache_key: openaiOptions == null ? void 0 : openaiOptions.promptCacheKey,
      prompt_cache_options: openaiOptions == null ? void 0 : openaiOptions.promptCacheOptions,
      prompt_cache_retention: openaiOptions == null ? void 0 : openaiOptions.promptCacheRetention,
      safety_identifier: openaiOptions == null ? void 0 : openaiOptions.safetyIdentifier,
      top_logprobs: topLogprobs,
      truncation: openaiOptions == null ? void 0 : openaiOptions.truncation,
      // context management (server-side compaction):
      ...(openaiOptions == null ? void 0 : openaiOptions.contextManagement) && {
        context_management: openaiOptions.contextManagement.map((cm) => ({
          type: cm.type,
          compact_threshold: cm.compactThreshold
        }))
      },
      // model-specific settings:
      ...isReasoningModel && (resolvedReasoningEffort != null || resolvedReasoningSummary != null || (openaiOptions == null ? void 0 : openaiOptions.reasoningMode) != null || (openaiOptions == null ? void 0 : openaiOptions.reasoningContext) != null) && {
        reasoning: {
          ...resolvedReasoningEffort != null && {
            effort: resolvedReasoningEffort
          },
          ...resolvedReasoningSummary != null && {
            summary: resolvedReasoningSummary
          },
          ...(openaiOptions == null ? void 0 : openaiOptions.reasoningMode) != null && {
            mode: openaiOptions.reasoningMode
          },
          ...(openaiOptions == null ? void 0 : openaiOptions.reasoningContext) != null && {
            context: openaiOptions.reasoningContext
          }
        }
      }
    };
    if (isReasoningModel) {
      if (!(resolvedReasoningEffort === "none" && modelCapabilities.supportsNonReasoningParameters)) {
        if (baseArgs.temperature != null) {
          baseArgs.temperature = void 0;
          warnings.push({
            type: "unsupported",
            feature: "temperature",
            details: "temperature is not supported for reasoning models"
          });
        }
        if (baseArgs.top_p != null) {
          baseArgs.top_p = void 0;
          warnings.push({
            type: "unsupported",
            feature: "topP",
            details: "topP is not supported for reasoning models"
          });
        }
      }
    } else {
      if ((openaiOptions == null ? void 0 : openaiOptions.reasoningEffort) != null) {
        warnings.push({
          type: "unsupported",
          feature: "reasoningEffort",
          details: "reasoningEffort is not supported for non-reasoning models"
        });
      }
      if ((openaiOptions == null ? void 0 : openaiOptions.reasoningSummary) != null) {
        warnings.push({
          type: "unsupported",
          feature: "reasoningSummary",
          details: "reasoningSummary is not supported for non-reasoning models"
        });
      }
      if ((openaiOptions == null ? void 0 : openaiOptions.reasoningMode) != null) {
        warnings.push({
          type: "unsupported",
          feature: "reasoningMode",
          details: "reasoningMode is not supported for non-reasoning models"
        });
      }
      if ((openaiOptions == null ? void 0 : openaiOptions.reasoningContext) != null) {
        warnings.push({
          type: "unsupported",
          feature: "reasoningContext",
          details: "reasoningContext is not supported for non-reasoning models"
        });
      }
    }
    if ((openaiOptions == null ? void 0 : openaiOptions.serviceTier) === "flex" && !modelCapabilities.supportsFlexProcessing) {
      warnings.push({
        type: "unsupported",
        feature: "serviceTier",
        details: "flex processing is only available for o3, o4-mini, and gpt-5 models"
      });
      delete baseArgs.service_tier;
    }
    if ((openaiOptions == null ? void 0 : openaiOptions.serviceTier) === "priority" && !modelCapabilities.supportsPriorityProcessing) {
      warnings.push({
        type: "unsupported",
        feature: "serviceTier",
        details: "priority processing is only available for supported models (gpt-4, gpt-5, gpt-5-mini, o3, o4-mini) and requires Enterprise access. gpt-5-nano is not supported"
      });
      delete baseArgs.service_tier;
    }
    const shellToolEnvType = (_l = (_k = (_j = tools == null ? void 0 : tools.find(
      (tool2) => tool2.type === "provider" && tool2.id === "openai.shell"
    )) == null ? void 0 : _j.args) == null ? void 0 : _k.environment) == null ? void 0 : _l.type;
    const isShellProviderExecuted = shellToolEnvType === "containerAuto" || shellToolEnvType === "containerReference";
    return {
      webSearchToolName,
      args: {
        ...baseArgs,
        tools: openaiTools2,
        tool_choice: openaiToolChoice
      },
      warnings: [...warnings, ...toolWarnings],
      store,
      toolNameMapping,
      providerOptionsName,
      isShellProviderExecuted
    };
  }
  async doGenerate(options) {
    var _a24, _b18, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F;
    const {
      args: body,
      warnings,
      webSearchToolName,
      toolNameMapping,
      providerOptionsName,
      isShellProviderExecuted
    } = await this.getArgs(options);
    const url = this.config.url({
      path: "/responses",
      modelId: this.modelId
    });
    const approvalRequestIdToDummyToolCallIdFromPrompt = extractApprovalRequestIdToToolCallIdMapping(options.prompt);
    const {
      responseHeaders,
      value: response,
      rawValue: rawResponse
    } = await postJsonToApi({
      url,
      headers: combineHeaders((_b18 = (_a24 = this.config).headers) == null ? void 0 : _b18.call(_a24), options.headers),
      body,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiResponsesResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    if (response.error) {
      throw new APICallError({
        message: response.error.message,
        url,
        requestBodyValues: body,
        statusCode: 400,
        responseHeaders,
        responseBody: rawResponse,
        isRetryable: false
      });
    }
    if (response.output == null) {
      const detail = (_c = response.incomplete_details) == null ? void 0 : _c.reason;
      throw new APICallError({
        message: detail ? `Responses API returned no output (${detail})` : "Responses API returned no output",
        url,
        requestBodyValues: body,
        statusCode: 500,
        responseHeaders,
        responseBody: rawResponse,
        isRetryable: false
      });
    }
    const content = [];
    const logprobs = [];
    let hasFunctionCall = false;
    const hostedToolSearchCallIds = [];
    for (const part of response.output) {
      switch (part.type) {
        case "reasoning": {
          if (part.summary.length === 0) {
            part.summary.push({ type: "summary_text", text: "" });
          }
          for (const summary of part.summary) {
            content.push({
              type: "reasoning",
              text: summary.text,
              providerMetadata: {
                [providerOptionsName]: {
                  itemId: part.id,
                  reasoningEncryptedContent: (_d = part.encrypted_content) != null ? _d : null
                }
              }
            });
          }
          break;
        }
        case "image_generation_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: toolNameMapping.toCustomToolName("image_generation"),
            input: "{}",
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: toolNameMapping.toCustomToolName("image_generation"),
            result: {
              result: part.result
            }
          });
          break;
        }
        case "tool_search_call": {
          const toolCallId = (_e = part.call_id) != null ? _e : part.id;
          const isHosted = part.execution === "server";
          if (isHosted) {
            hostedToolSearchCallIds.push(toolCallId);
          }
          content.push({
            type: "tool-call",
            toolCallId,
            toolName: toolNameMapping.toCustomToolName("tool_search"),
            input: JSON.stringify({
              arguments: part.arguments,
              call_id: part.call_id
            }),
            ...isHosted ? { providerExecuted: true } : {},
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "tool_search_output": {
          const toolCallId = (_g = (_f = part.call_id) != null ? _f : hostedToolSearchCallIds.shift()) != null ? _g : part.id;
          content.push({
            type: "tool-result",
            toolCallId,
            toolName: toolNameMapping.toCustomToolName("tool_search"),
            result: {
              tools: part.tools
            },
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "local_shell_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.call_id,
            toolName: toolNameMapping.toCustomToolName("local_shell"),
            input: JSON.stringify({
              action: part.action
            }),
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "shell_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.call_id,
            toolName: toolNameMapping.toCustomToolName("shell"),
            input: JSON.stringify({
              action: {
                commands: part.action.commands
              }
            }),
            ...isShellProviderExecuted && { providerExecuted: true },
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "shell_call_output": {
          content.push({
            type: "tool-result",
            toolCallId: part.call_id,
            toolName: toolNameMapping.toCustomToolName("shell"),
            result: {
              output: part.output.map((item) => ({
                stdout: item.stdout,
                stderr: item.stderr,
                outcome: item.outcome.type === "exit" ? {
                  type: "exit",
                  exitCode: item.outcome.exit_code
                } : { type: "timeout" }
              }))
            }
          });
          break;
        }
        case "message": {
          for (const contentPart of part.content) {
            if (((_i = (_h = options.providerOptions) == null ? void 0 : _h[providerOptionsName]) == null ? void 0 : _i.logprobs) && contentPart.logprobs) {
              logprobs.push(contentPart.logprobs);
            }
            const providerMetadata2 = {
              itemId: part.id,
              ...part.phase != null && { phase: part.phase },
              ...contentPart.annotations.length > 0 && {
                annotations: contentPart.annotations
              }
            };
            content.push({
              type: "text",
              text: contentPart.text,
              providerMetadata: {
                [providerOptionsName]: providerMetadata2
              }
            });
            for (const annotation of contentPart.annotations) {
              if (annotation.type === "url_citation") {
                content.push({
                  type: "source",
                  sourceType: "url",
                  id: (_l = (_k = (_j = this.config).generateId) == null ? void 0 : _k.call(_j)) != null ? _l : generateId(),
                  url: annotation.url,
                  title: annotation.title
                });
              } else if (annotation.type === "file_citation") {
                content.push({
                  type: "source",
                  sourceType: "document",
                  id: (_o = (_n = (_m = this.config).generateId) == null ? void 0 : _n.call(_m)) != null ? _o : generateId(),
                  mediaType: "text/plain",
                  title: annotation.filename,
                  filename: annotation.filename,
                  providerMetadata: {
                    [providerOptionsName]: {
                      type: annotation.type,
                      fileId: annotation.file_id,
                      index: annotation.index
                    }
                  }
                });
              } else if (annotation.type === "container_file_citation") {
                content.push({
                  type: "source",
                  sourceType: "document",
                  id: (_r = (_q = (_p = this.config).generateId) == null ? void 0 : _q.call(_p)) != null ? _r : generateId(),
                  mediaType: "text/plain",
                  title: annotation.filename,
                  filename: annotation.filename,
                  providerMetadata: {
                    [providerOptionsName]: {
                      type: annotation.type,
                      fileId: annotation.file_id,
                      containerId: annotation.container_id
                    }
                  }
                });
              } else if (annotation.type === "file_path") {
                content.push({
                  type: "source",
                  sourceType: "document",
                  id: (_u = (_t = (_s = this.config).generateId) == null ? void 0 : _t.call(_s)) != null ? _u : generateId(),
                  mediaType: "application/octet-stream",
                  title: annotation.file_id,
                  filename: annotation.file_id,
                  providerMetadata: {
                    [providerOptionsName]: {
                      type: annotation.type,
                      fileId: annotation.file_id,
                      index: annotation.index
                    }
                  }
                });
              }
            }
          }
          break;
        }
        case "function_call": {
          hasFunctionCall = true;
          content.push({
            type: "tool-call",
            toolCallId: part.call_id,
            toolName: part.name,
            input: part.arguments,
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id,
                ...part.namespace != null && { namespace: part.namespace }
              }
            }
          });
          break;
        }
        case "custom_tool_call": {
          hasFunctionCall = true;
          const toolName = toolNameMapping.toCustomToolName(part.name);
          content.push({
            type: "tool-call",
            toolCallId: part.call_id,
            toolName,
            input: JSON.stringify(part.input),
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "web_search_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: toolNameMapping.toCustomToolName(
              webSearchToolName != null ? webSearchToolName : "web_search"
            ),
            input: JSON.stringify({}),
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: toolNameMapping.toCustomToolName(
              webSearchToolName != null ? webSearchToolName : "web_search"
            ),
            result: mapWebSearchOutput(part.action)
          });
          break;
        }
        case "mcp_call": {
          const toolCallId = part.approval_request_id != null ? (_v = approvalRequestIdToDummyToolCallIdFromPrompt[part.approval_request_id]) != null ? _v : part.id : part.id;
          const toolName = `mcp.${part.name}`;
          content.push({
            type: "tool-call",
            toolCallId,
            toolName,
            input: part.arguments,
            providerExecuted: true,
            dynamic: true
          });
          content.push({
            type: "tool-result",
            toolCallId,
            toolName,
            result: {
              type: "call",
              serverLabel: part.server_label,
              name: part.name,
              arguments: part.arguments,
              ...part.output != null ? { output: part.output } : {},
              ...part.error != null ? { error: part.error } : {}
            },
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "mcp_list_tools": {
          break;
        }
        case "mcp_approval_request": {
          const approvalRequestId = (_w = part.approval_request_id) != null ? _w : part.id;
          const dummyToolCallId = (_z = (_y = (_x = this.config).generateId) == null ? void 0 : _y.call(_x)) != null ? _z : generateId();
          const toolName = `mcp.${part.name}`;
          content.push({
            type: "tool-call",
            toolCallId: dummyToolCallId,
            toolName,
            input: part.arguments,
            providerExecuted: true,
            dynamic: true
          });
          content.push({
            type: "tool-approval-request",
            approvalId: approvalRequestId,
            toolCallId: dummyToolCallId
          });
          break;
        }
        case "computer_call": {
          if (part.call_id == null) {
            content.push({
              type: "tool-call",
              toolCallId: part.id,
              toolName: toolNameMapping.toCustomToolName("computer_use"),
              input: "",
              providerExecuted: true
            });
            content.push({
              type: "tool-result",
              toolCallId: part.id,
              toolName: toolNameMapping.toCustomToolName("computer_use"),
              result: {
                type: "computer_use_tool_result",
                status: part.status
              }
            });
            break;
          }
          hasFunctionCall = true;
          const toolName = toolNameMapping.toCustomToolName("computer");
          content.push({
            type: "tool-call",
            toolCallId: part.call_id,
            toolName,
            input: JSON.stringify(mapComputerCallInput(part)),
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "file_search_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: toolNameMapping.toCustomToolName("file_search"),
            input: "{}",
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: toolNameMapping.toCustomToolName("file_search"),
            result: {
              queries: part.queries,
              results: (_B = (_A = part.results) == null ? void 0 : _A.map((result) => ({
                attributes: result.attributes,
                fileId: result.file_id,
                filename: result.filename,
                score: result.score,
                text: result.text
              }))) != null ? _B : null
            }
          });
          break;
        }
        case "code_interpreter_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.id,
            toolName: toolNameMapping.toCustomToolName("code_interpreter"),
            input: JSON.stringify({
              code: part.code,
              containerId: part.container_id
            }),
            providerExecuted: true
          });
          content.push({
            type: "tool-result",
            toolCallId: part.id,
            toolName: toolNameMapping.toCustomToolName("code_interpreter"),
            result: {
              outputs: part.outputs
            }
          });
          break;
        }
        case "apply_patch_call": {
          content.push({
            type: "tool-call",
            toolCallId: part.call_id,
            toolName: toolNameMapping.toCustomToolName("apply_patch"),
            input: JSON.stringify({
              callId: part.call_id,
              operation: part.operation
            }),
            providerMetadata: {
              [providerOptionsName]: {
                itemId: part.id
              }
            }
          });
          break;
        }
        case "compaction": {
          content.push({
            type: "custom",
            kind: "openai.compaction",
            providerMetadata: {
              [providerOptionsName]: {
                type: "compaction",
                itemId: part.id,
                encryptedContent: part.encrypted_content
              }
            }
          });
          break;
        }
      }
    }
    const providerMetadata = {
      [providerOptionsName]: {
        responseId: response.id,
        ...logprobs.length > 0 ? { logprobs } : {},
        ...typeof response.service_tier === "string" ? { serviceTier: response.service_tier } : {},
        ...((_C = response.reasoning) == null ? void 0 : _C.context) != null ? { reasoningContext: response.reasoning.context } : {}
      }
    };
    const usage = response.usage;
    return {
      content,
      finishReason: {
        unified: mapOpenAIResponseFinishReason({
          finishReason: (_D = response.incomplete_details) == null ? void 0 : _D.reason,
          hasFunctionCall
        }),
        raw: (_F = (_E = response.incomplete_details) == null ? void 0 : _E.reason) != null ? _F : void 0
      },
      usage: convertOpenAIResponsesUsage(usage),
      request: { body },
      response: {
        id: response.id,
        timestamp: new Date(response.created_at * 1e3),
        modelId: response.model,
        headers: responseHeaders,
        body: rawResponse
      },
      providerMetadata,
      warnings
    };
  }
  async doStream(options) {
    var _a24, _b18;
    const {
      args: body,
      warnings,
      webSearchToolName,
      toolNameMapping,
      store,
      providerOptionsName,
      isShellProviderExecuted
    } = await this.getArgs(options);
    const url = this.config.url({
      path: "/responses",
      modelId: this.modelId
    });
    const { responseHeaders, value: response } = await postJsonToApi({
      url,
      headers: combineHeaders((_b18 = (_a24 = this.config).headers) == null ? void 0 : _b18.call(_a24), options.headers),
      body: {
        ...body,
        stream: true
      },
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        openaiResponsesChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const checkedResponse = await throwIfOpenAIStreamErrorBeforeOutput({
      stream: response,
      getError: /* @__PURE__ */ __name((chunk) => isErrorChunk(chunk) || isResponseFailedChunk(chunk) && chunk.response.error != null ? chunk : void 0, "getError"),
      isOutputChunk: isResponseOutputChunk,
      url,
      requestBodyValues: body,
      responseHeaders
    });
    const self = this;
    const approvalRequestIdToDummyToolCallIdFromPrompt = extractApprovalRequestIdToToolCallIdMapping(options.prompt);
    const approvalRequestIdToDummyToolCallIdFromStream = /* @__PURE__ */ new Map();
    let finishReason = {
      unified: "other",
      raw: void 0
    };
    let usage = void 0;
    const logprobs = [];
    let responseId = null;
    const ongoingToolCalls = {};
    const ongoingAnnotations = [];
    let activeMessagePhase;
    let hasFunctionCall = false;
    const activeReasoning = {};
    let serviceTier;
    let reasoningContext;
    const hostedToolSearchCallIds = [];
    let encounteredStreamError = false;
    const result = {
      stream: checkedResponse.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a25, _b23, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O;
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              const error = isOpenAIChatCompletionChunk(chunk.rawValue) ? createOpenAIResponsesChatCompletionsMismatchError({
                value: chunk.rawValue,
                cause: chunk.error,
                url,
                requestBodyValues: body,
                responseHeaders
              }) : chunk.error;
              finishReason = { unified: "error", raw: void 0 };
              controller.enqueue({ type: "error", error });
              return;
            }
            const value = chunk.value;
            if (isResponseOutputItemAddedChunk(value)) {
              if (value.item.type === "function_call") {
                ongoingToolCalls[value.output_index] = {
                  toolName: value.item.name,
                  toolCallId: value.item.call_id
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: value.item.call_id,
                  toolName: value.item.name
                });
              } else if (value.item.type === "custom_tool_call") {
                const toolName = toolNameMapping.toCustomToolName(
                  value.item.name
                );
                ongoingToolCalls[value.output_index] = {
                  toolName,
                  toolCallId: value.item.call_id
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: value.item.call_id,
                  toolName
                });
              } else if (value.item.type === "web_search_call") {
                ongoingToolCalls[value.output_index] = {
                  toolName: toolNameMapping.toCustomToolName(
                    webSearchToolName != null ? webSearchToolName : "web_search"
                  ),
                  toolCallId: value.item.id
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: value.item.id,
                  toolName: toolNameMapping.toCustomToolName(
                    webSearchToolName != null ? webSearchToolName : "web_search"
                  ),
                  providerExecuted: true
                });
                controller.enqueue({
                  type: "tool-input-end",
                  id: value.item.id
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.id,
                  toolName: toolNameMapping.toCustomToolName(
                    webSearchToolName != null ? webSearchToolName : "web_search"
                  ),
                  input: JSON.stringify({}),
                  providerExecuted: true
                });
              } else if (value.item.type === "computer_call") {
                const toolCallId = (_a25 = value.item.call_id) != null ? _a25 : value.item.id;
                ongoingToolCalls[value.output_index] = {
                  toolName: toolNameMapping.toCustomToolName("computer"),
                  toolCallId
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: toolCallId,
                  toolName: toolNameMapping.toCustomToolName("computer")
                });
              } else if (value.item.type === "code_interpreter_call") {
                ongoingToolCalls[value.output_index] = {
                  toolName: toolNameMapping.toCustomToolName("code_interpreter"),
                  toolCallId: value.item.id,
                  codeInterpreter: {
                    containerId: value.item.container_id
                  }
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: value.item.id,
                  toolName: toolNameMapping.toCustomToolName("code_interpreter"),
                  providerExecuted: true
                });
                controller.enqueue({
                  type: "tool-input-delta",
                  id: value.item.id,
                  delta: `{"containerId":"${value.item.container_id}","code":"`
                });
              } else if (value.item.type === "file_search_call") {
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.id,
                  toolName: toolNameMapping.toCustomToolName("file_search"),
                  input: "{}",
                  providerExecuted: true
                });
              } else if (value.item.type === "image_generation_call") {
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.id,
                  toolName: toolNameMapping.toCustomToolName("image_generation"),
                  input: "{}",
                  providerExecuted: true
                });
              } else if (value.item.type === "tool_search_call") {
                const toolCallId = value.item.id;
                const toolName = toolNameMapping.toCustomToolName("tool_search");
                const isHosted = value.item.execution === "server";
                ongoingToolCalls[value.output_index] = {
                  toolName,
                  toolCallId,
                  toolSearchExecution: (_b23 = value.item.execution) != null ? _b23 : "server"
                };
                if (isHosted) {
                  controller.enqueue({
                    type: "tool-input-start",
                    id: toolCallId,
                    toolName,
                    providerExecuted: true
                  });
                }
              } else if (value.item.type === "tool_search_output") {
              } else if (value.item.type === "mcp_call" || value.item.type === "mcp_list_tools" || value.item.type === "mcp_approval_request") {
              } else if (value.item.type === "apply_patch_call") {
                const { call_id: callId, operation } = value.item;
                ongoingToolCalls[value.output_index] = {
                  toolName: toolNameMapping.toCustomToolName("apply_patch"),
                  toolCallId: callId,
                  applyPatch: {
                    // delete_file doesn't have diff
                    hasDiff: operation.type === "delete_file",
                    endEmitted: operation.type === "delete_file"
                  }
                };
                controller.enqueue({
                  type: "tool-input-start",
                  id: callId,
                  toolName: toolNameMapping.toCustomToolName("apply_patch")
                });
                if (operation.type === "delete_file") {
                  const inputString = JSON.stringify({
                    callId,
                    operation
                  });
                  controller.enqueue({
                    type: "tool-input-delta",
                    id: callId,
                    delta: inputString
                  });
                  controller.enqueue({
                    type: "tool-input-end",
                    id: callId
                  });
                } else {
                  controller.enqueue({
                    type: "tool-input-delta",
                    id: callId,
                    delta: `{"callId":"${escapeJSONDelta(callId)}","operation":{"type":"${escapeJSONDelta(operation.type)}","path":"${escapeJSONDelta(operation.path)}","diff":"`
                  });
                }
              } else if (value.item.type === "shell_call") {
                ongoingToolCalls[value.output_index] = {
                  toolName: toolNameMapping.toCustomToolName("shell"),
                  toolCallId: value.item.call_id
                };
              } else if (value.item.type === "shell_call_output") {
              } else if (value.item.type === "message") {
                ongoingAnnotations.splice(0, ongoingAnnotations.length);
                activeMessagePhase = (_c = value.item.phase) != null ? _c : void 0;
                controller.enqueue({
                  type: "text-start",
                  id: value.item.id,
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item.id,
                      ...value.item.phase != null && {
                        phase: value.item.phase
                      }
                    }
                  }
                });
              } else if (isResponseOutputItemAddedChunk(value) && value.item.type === "reasoning") {
                activeReasoning[value.item.id] = {
                  encryptedContent: value.item.encrypted_content,
                  summaryParts: { 0: "active" }
                };
                controller.enqueue({
                  type: "reasoning-start",
                  id: `${value.item.id}:0`,
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item.id,
                      reasoningEncryptedContent: (_d = value.item.encrypted_content) != null ? _d : null
                    }
                  }
                });
              }
            } else if (isResponseOutputItemDoneChunk(value)) {
              if (value.item.type === "message") {
                const phase = (_e = value.item.phase) != null ? _e : activeMessagePhase;
                activeMessagePhase = void 0;
                controller.enqueue({
                  type: "text-end",
                  id: value.item.id,
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item.id,
                      ...phase != null && { phase },
                      ...ongoingAnnotations.length > 0 && {
                        annotations: ongoingAnnotations
                      }
                    }
                  }
                });
              } else if (value.item.type === "function_call") {
                ongoingToolCalls[value.output_index] = void 0;
                hasFunctionCall = true;
                controller.enqueue({
                  type: "tool-input-end",
                  id: value.item.call_id,
                  ...value.item.namespace != null && {
                    providerMetadata: {
                      [providerOptionsName]: {
                        namespace: value.item.namespace
                      }
                    }
                  }
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.call_id,
                  toolName: value.item.name,
                  input: value.item.arguments,
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item.id,
                      ...value.item.namespace != null && {
                        namespace: value.item.namespace
                      }
                    }
                  }
                });
              } else if (value.item.type === "custom_tool_call") {
                ongoingToolCalls[value.output_index] = void 0;
                hasFunctionCall = true;
                const toolName = toolNameMapping.toCustomToolName(
                  value.item.name
                );
                controller.enqueue({
                  type: "tool-input-end",
                  id: value.item.call_id
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.call_id,
                  toolName,
                  input: JSON.stringify(value.item.input),
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item.id
                    }
                  }
                });
              } else if (value.item.type === "web_search_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: toolNameMapping.toCustomToolName(
                    webSearchToolName != null ? webSearchToolName : "web_search"
                  ),
                  result: mapWebSearchOutput(value.item.action)
                });
              } else if (value.item.type === "computer_call") {
                ongoingToolCalls[value.output_index] = void 0;
                if (value.item.call_id == null) {
                  controller.enqueue({
                    type: "tool-input-end",
                    id: value.item.id
                  });
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: value.item.id,
                    toolName: toolNameMapping.toCustomToolName("computer_use"),
                    input: "",
                    providerExecuted: true
                  });
                  controller.enqueue({
                    type: "tool-result",
                    toolCallId: value.item.id,
                    toolName: toolNameMapping.toCustomToolName("computer_use"),
                    result: {
                      type: "computer_use_tool_result",
                      status: value.item.status
                    }
                  });
                  return;
                }
                hasFunctionCall = true;
                const toolName = toolNameMapping.toCustomToolName("computer");
                const input = JSON.stringify(mapComputerCallInput(value.item));
                controller.enqueue({
                  type: "tool-input-delta",
                  id: value.item.call_id,
                  delta: input
                });
                controller.enqueue({
                  type: "tool-input-end",
                  id: value.item.call_id
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.call_id,
                  toolName,
                  input,
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item.id
                    }
                  }
                });
              } else if (value.item.type === "file_search_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: toolNameMapping.toCustomToolName("file_search"),
                  result: {
                    queries: value.item.queries,
                    results: (_g = (_f = value.item.results) == null ? void 0 : _f.map((result2) => ({
                      attributes: result2.attributes,
                      fileId: result2.file_id,
                      filename: result2.filename,
                      score: result2.score,
                      text: result2.text
                    }))) != null ? _g : null
                  }
                });
              } else if (value.item.type === "code_interpreter_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: toolNameMapping.toCustomToolName("code_interpreter"),
                  result: {
                    outputs: value.item.outputs
                  }
                });
              } else if (value.item.type === "image_generation_call") {
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.id,
                  toolName: toolNameMapping.toCustomToolName("image_generation"),
                  result: {
                    result: value.item.result
                  }
                });
              } else if (value.item.type === "tool_search_call") {
                const toolCall = ongoingToolCalls[value.output_index];
                const isHosted = value.item.execution === "server";
                if (toolCall != null) {
                  const toolCallId = isHosted ? toolCall.toolCallId : (_h = value.item.call_id) != null ? _h : value.item.id;
                  if (isHosted) {
                    hostedToolSearchCallIds.push(toolCallId);
                  } else {
                    controller.enqueue({
                      type: "tool-input-start",
                      id: toolCallId,
                      toolName: toolCall.toolName
                    });
                  }
                  controller.enqueue({
                    type: "tool-input-end",
                    id: toolCallId
                  });
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId,
                    toolName: toolCall.toolName,
                    input: JSON.stringify({
                      arguments: value.item.arguments,
                      call_id: isHosted ? null : toolCallId
                    }),
                    ...isHosted ? { providerExecuted: true } : {},
                    providerMetadata: {
                      [providerOptionsName]: {
                        itemId: value.item.id
                      }
                    }
                  });
                }
                ongoingToolCalls[value.output_index] = void 0;
              } else if (value.item.type === "tool_search_output") {
                const toolCallId = (_j = (_i = value.item.call_id) != null ? _i : hostedToolSearchCallIds.shift()) != null ? _j : value.item.id;
                controller.enqueue({
                  type: "tool-result",
                  toolCallId,
                  toolName: toolNameMapping.toCustomToolName("tool_search"),
                  result: {
                    tools: value.item.tools
                  },
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item.id
                    }
                  }
                });
              } else if (value.item.type === "mcp_call") {
                ongoingToolCalls[value.output_index] = void 0;
                const approvalRequestId = (_k = value.item.approval_request_id) != null ? _k : void 0;
                const aliasedToolCallId = approvalRequestId != null ? (_m = (_l = approvalRequestIdToDummyToolCallIdFromStream.get(
                  approvalRequestId
                )) != null ? _l : approvalRequestIdToDummyToolCallIdFromPrompt[approvalRequestId]) != null ? _m : value.item.id : value.item.id;
                const toolName = `mcp.${value.item.name}`;
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: aliasedToolCallId,
                  toolName,
                  input: value.item.arguments,
                  providerExecuted: true,
                  dynamic: true
                });
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: aliasedToolCallId,
                  toolName,
                  result: {
                    type: "call",
                    serverLabel: value.item.server_label,
                    name: value.item.name,
                    arguments: value.item.arguments,
                    ...value.item.output != null ? { output: value.item.output } : {},
                    ...value.item.error != null ? { error: value.item.error } : {}
                  },
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item.id
                    }
                  }
                });
              } else if (value.item.type === "mcp_list_tools") {
                ongoingToolCalls[value.output_index] = void 0;
              } else if (value.item.type === "apply_patch_call") {
                const toolCall = ongoingToolCalls[value.output_index];
                if ((toolCall == null ? void 0 : toolCall.applyPatch) && !toolCall.applyPatch.endEmitted && value.item.operation.type !== "delete_file") {
                  if (!toolCall.applyPatch.hasDiff) {
                    controller.enqueue({
                      type: "tool-input-delta",
                      id: toolCall.toolCallId,
                      delta: escapeJSONDelta(value.item.operation.diff)
                    });
                  }
                  controller.enqueue({
                    type: "tool-input-delta",
                    id: toolCall.toolCallId,
                    delta: '"}}'
                  });
                  controller.enqueue({
                    type: "tool-input-end",
                    id: toolCall.toolCallId
                  });
                  toolCall.applyPatch.endEmitted = true;
                }
                if (toolCall && value.item.status === "completed") {
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: toolCall.toolCallId,
                    toolName: toolNameMapping.toCustomToolName("apply_patch"),
                    input: JSON.stringify({
                      callId: value.item.call_id,
                      operation: value.item.operation
                    }),
                    providerMetadata: {
                      [providerOptionsName]: {
                        itemId: value.item.id
                      }
                    }
                  });
                }
                ongoingToolCalls[value.output_index] = void 0;
              } else if (value.item.type === "mcp_approval_request") {
                ongoingToolCalls[value.output_index] = void 0;
                const dummyToolCallId = (_p = (_o = (_n = self.config).generateId) == null ? void 0 : _o.call(_n)) != null ? _p : generateId();
                const approvalRequestId = (_q = value.item.approval_request_id) != null ? _q : value.item.id;
                approvalRequestIdToDummyToolCallIdFromStream.set(
                  approvalRequestId,
                  dummyToolCallId
                );
                const toolName = `mcp.${value.item.name}`;
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: dummyToolCallId,
                  toolName,
                  input: value.item.arguments,
                  providerExecuted: true,
                  dynamic: true
                });
                controller.enqueue({
                  type: "tool-approval-request",
                  approvalId: approvalRequestId,
                  toolCallId: dummyToolCallId
                });
              } else if (value.item.type === "local_shell_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.call_id,
                  toolName: toolNameMapping.toCustomToolName("local_shell"),
                  input: JSON.stringify({
                    action: {
                      type: "exec",
                      command: value.item.action.command,
                      timeoutMs: value.item.action.timeout_ms,
                      user: value.item.action.user,
                      workingDirectory: value.item.action.working_directory,
                      env: value.item.action.env
                    }
                  }),
                  providerMetadata: {
                    [providerOptionsName]: { itemId: value.item.id }
                  }
                });
              } else if (value.item.type === "shell_call") {
                ongoingToolCalls[value.output_index] = void 0;
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: value.item.call_id,
                  toolName: toolNameMapping.toCustomToolName("shell"),
                  input: JSON.stringify({
                    action: {
                      commands: value.item.action.commands
                    }
                  }),
                  ...isShellProviderExecuted && {
                    providerExecuted: true
                  },
                  providerMetadata: {
                    [providerOptionsName]: { itemId: value.item.id }
                  }
                });
              } else if (value.item.type === "shell_call_output") {
                controller.enqueue({
                  type: "tool-result",
                  toolCallId: value.item.call_id,
                  toolName: toolNameMapping.toCustomToolName("shell"),
                  result: {
                    output: value.item.output.map(
                      (item) => ({
                        stdout: item.stdout,
                        stderr: item.stderr,
                        outcome: item.outcome.type === "exit" ? {
                          type: "exit",
                          exitCode: item.outcome.exit_code
                        } : { type: "timeout" }
                      })
                    )
                  }
                });
              } else if (value.item.type === "reasoning") {
                const activeReasoningPart = activeReasoning[value.item.id];
                const summaryPartIndices = Object.entries(
                  activeReasoningPart.summaryParts
                ).filter(
                  ([_, status]) => status === "active" || status === "can-conclude"
                ).map(([summaryIndex]) => summaryIndex);
                for (const summaryIndex of summaryPartIndices) {
                  controller.enqueue({
                    type: "reasoning-end",
                    id: `${value.item.id}:${summaryIndex}`,
                    providerMetadata: {
                      [providerOptionsName]: {
                        itemId: value.item.id,
                        reasoningEncryptedContent: (_r = value.item.encrypted_content) != null ? _r : null
                      }
                    }
                  });
                }
                delete activeReasoning[value.item.id];
              } else if (value.item.type === "compaction") {
                controller.enqueue({
                  type: "custom",
                  kind: "openai.compaction",
                  providerMetadata: {
                    [providerOptionsName]: {
                      type: "compaction",
                      itemId: value.item.id,
                      encryptedContent: value.item.encrypted_content
                    }
                  }
                });
              }
            } else if (isResponseFunctionCallArgumentsDeltaChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if (toolCall != null) {
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  delta: value.delta
                });
              }
            } else if (isResponseCustomToolCallInputDeltaChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if (toolCall != null) {
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  delta: value.delta
                });
              }
            } else if (isResponseApplyPatchCallOperationDiffDeltaChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if (toolCall == null ? void 0 : toolCall.applyPatch) {
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  delta: escapeJSONDelta(value.delta)
                });
                toolCall.applyPatch.hasDiff = true;
              }
            } else if (isResponseApplyPatchCallOperationDiffDoneChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if ((toolCall == null ? void 0 : toolCall.applyPatch) && !toolCall.applyPatch.endEmitted) {
                if (!toolCall.applyPatch.hasDiff) {
                  controller.enqueue({
                    type: "tool-input-delta",
                    id: toolCall.toolCallId,
                    delta: escapeJSONDelta(value.diff)
                  });
                  toolCall.applyPatch.hasDiff = true;
                }
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  delta: '"}}'
                });
                controller.enqueue({
                  type: "tool-input-end",
                  id: toolCall.toolCallId
                });
                toolCall.applyPatch.endEmitted = true;
              }
            } else if (isResponseImageGenerationCallPartialImageChunk(value)) {
              controller.enqueue({
                type: "tool-result",
                toolCallId: value.item_id,
                toolName: toolNameMapping.toCustomToolName("image_generation"),
                result: {
                  result: value.partial_image_b64
                },
                preliminary: true
              });
            } else if (isResponseCodeInterpreterCallCodeDeltaChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if (toolCall != null) {
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  delta: escapeJSONDelta(value.delta)
                });
              }
            } else if (isResponseCodeInterpreterCallCodeDoneChunk(value)) {
              const toolCall = ongoingToolCalls[value.output_index];
              if (toolCall != null) {
                controller.enqueue({
                  type: "tool-input-delta",
                  id: toolCall.toolCallId,
                  delta: '"}'
                });
                controller.enqueue({
                  type: "tool-input-end",
                  id: toolCall.toolCallId
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolNameMapping.toCustomToolName("code_interpreter"),
                  input: JSON.stringify({
                    code: value.code,
                    containerId: toolCall.codeInterpreter.containerId
                  }),
                  providerExecuted: true
                });
              }
            } else if (isResponseCreatedChunk(value)) {
              responseId = value.response.id;
              controller.enqueue({
                type: "response-metadata",
                id: value.response.id,
                timestamp: new Date(value.response.created_at * 1e3),
                modelId: value.response.model
              });
            } else if (isTextDeltaChunk(value)) {
              controller.enqueue({
                type: "text-delta",
                id: value.item_id,
                delta: value.delta
              });
              if (((_t = (_s = options.providerOptions) == null ? void 0 : _s[providerOptionsName]) == null ? void 0 : _t.logprobs) && value.logprobs) {
                logprobs.push(value.logprobs);
              }
            } else if (value.type === "response.reasoning_summary_part.added") {
              if (value.summary_index > 0) {
                const activeReasoningPart = activeReasoning[value.item_id];
                activeReasoningPart.summaryParts[value.summary_index] = "active";
                for (const summaryIndex of Object.keys(
                  activeReasoningPart.summaryParts
                )) {
                  if (activeReasoningPart.summaryParts[summaryIndex] === "can-conclude") {
                    controller.enqueue({
                      type: "reasoning-end",
                      id: `${value.item_id}:${summaryIndex}`,
                      providerMetadata: {
                        [providerOptionsName]: {
                          itemId: value.item_id
                        }
                      }
                    });
                    activeReasoningPart.summaryParts[summaryIndex] = "concluded";
                  }
                }
                controller.enqueue({
                  type: "reasoning-start",
                  id: `${value.item_id}:${value.summary_index}`,
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item_id,
                      reasoningEncryptedContent: (_v = (_u = activeReasoning[value.item_id]) == null ? void 0 : _u.encryptedContent) != null ? _v : null
                    }
                  }
                });
              }
            } else if (value.type === "response.reasoning_summary_text.delta") {
              controller.enqueue({
                type: "reasoning-delta",
                id: `${value.item_id}:${value.summary_index}`,
                delta: value.delta,
                providerMetadata: {
                  [providerOptionsName]: {
                    itemId: value.item_id
                  }
                }
              });
            } else if (value.type === "response.reasoning_summary_part.done") {
              if (store) {
                controller.enqueue({
                  type: "reasoning-end",
                  id: `${value.item_id}:${value.summary_index}`,
                  providerMetadata: {
                    [providerOptionsName]: {
                      itemId: value.item_id
                    }
                  }
                });
                activeReasoning[value.item_id].summaryParts[value.summary_index] = "concluded";
              } else {
                activeReasoning[value.item_id].summaryParts[value.summary_index] = "can-conclude";
              }
            } else if (isResponseFinishedChunk(value)) {
              finishReason = {
                unified: mapOpenAIResponseFinishReason({
                  finishReason: (_w = value.response.incomplete_details) == null ? void 0 : _w.reason,
                  hasFunctionCall
                }),
                raw: (_y = (_x = value.response.incomplete_details) == null ? void 0 : _x.reason) != null ? _y : void 0
              };
              usage = value.response.usage;
              if (typeof value.response.service_tier === "string") {
                serviceTier = value.response.service_tier;
              }
              if (((_z = value.response.reasoning) == null ? void 0 : _z.context) != null) {
                reasoningContext = value.response.reasoning.context;
              }
            } else if (isResponseFailedChunk(value)) {
              const incompleteReason = (_A = value.response.incomplete_details) == null ? void 0 : _A.reason;
              finishReason = {
                unified: incompleteReason ? mapOpenAIResponseFinishReason({
                  finishReason: incompleteReason,
                  hasFunctionCall
                }) : "error",
                raw: incompleteReason != null ? incompleteReason : "error"
              };
              usage = (_B = value.response.usage) != null ? _B : void 0;
              if (((_C = value.response.reasoning) == null ? void 0 : _C.context) != null) {
                reasoningContext = value.response.reasoning.context;
              }
              if (!encounteredStreamError && value.response.error != null) {
                encounteredStreamError = true;
                controller.enqueue({
                  type: "error",
                  error: {
                    type: "response.failed",
                    sequence_number: value.sequence_number,
                    response: {
                      error: value.response.error,
                      incomplete_details: value.response.incomplete_details,
                      service_tier: value.response.service_tier
                    }
                  }
                });
              }
            } else if (isResponseAnnotationAddedChunk(value)) {
              ongoingAnnotations.push(value.annotation);
              if (value.annotation.type === "url_citation") {
                controller.enqueue({
                  type: "source",
                  sourceType: "url",
                  id: (_F = (_E = (_D = self.config).generateId) == null ? void 0 : _E.call(_D)) != null ? _F : generateId(),
                  url: value.annotation.url,
                  title: value.annotation.title
                });
              } else if (value.annotation.type === "file_citation") {
                controller.enqueue({
                  type: "source",
                  sourceType: "document",
                  id: (_I = (_H = (_G = self.config).generateId) == null ? void 0 : _H.call(_G)) != null ? _I : generateId(),
                  mediaType: "text/plain",
                  title: value.annotation.filename,
                  filename: value.annotation.filename,
                  providerMetadata: {
                    [providerOptionsName]: {
                      type: value.annotation.type,
                      fileId: value.annotation.file_id,
                      index: value.annotation.index
                    }
                  }
                });
              } else if (value.annotation.type === "container_file_citation") {
                controller.enqueue({
                  type: "source",
                  sourceType: "document",
                  id: (_L = (_K = (_J = self.config).generateId) == null ? void 0 : _K.call(_J)) != null ? _L : generateId(),
                  mediaType: "text/plain",
                  title: value.annotation.filename,
                  filename: value.annotation.filename,
                  providerMetadata: {
                    [providerOptionsName]: {
                      type: value.annotation.type,
                      fileId: value.annotation.file_id,
                      containerId: value.annotation.container_id
                    }
                  }
                });
              } else if (value.annotation.type === "file_path") {
                controller.enqueue({
                  type: "source",
                  sourceType: "document",
                  id: (_O = (_N = (_M = self.config).generateId) == null ? void 0 : _N.call(_M)) != null ? _O : generateId(),
                  mediaType: "application/octet-stream",
                  title: value.annotation.file_id,
                  filename: value.annotation.file_id,
                  providerMetadata: {
                    [providerOptionsName]: {
                      type: value.annotation.type,
                      fileId: value.annotation.file_id,
                      index: value.annotation.index
                    }
                  }
                });
              }
            } else if (isErrorChunk(value)) {
              encounteredStreamError = true;
              finishReason = { unified: "error", raw: "error" };
              controller.enqueue({ type: "error", error: value });
            }
          },
          flush(controller) {
            const providerMetadata = {
              [providerOptionsName]: {
                responseId,
                ...logprobs.length > 0 ? { logprobs } : {},
                ...serviceTier !== void 0 ? { serviceTier } : {},
                ...reasoningContext !== void 0 ? { reasoningContext } : {}
              }
            };
            controller.enqueue({
              type: "finish",
              finishReason,
              usage: convertOpenAIResponsesUsage(usage),
              providerMetadata
            });
          }
        })
      ),
      request: { body },
      response: { headers: responseHeaders }
    };
    return result;
  }
};
function isTextDeltaChunk(chunk) {
  return chunk.type === "response.output_text.delta";
}
__name(isTextDeltaChunk, "isTextDeltaChunk");
function isOpenAIChatCompletionChunk(value) {
  const chunk = asRecord2(value);
  return chunk != null && Array.isArray(chunk.choices) && typeof chunk.type !== "string";
}
__name(isOpenAIChatCompletionChunk, "isOpenAIChatCompletionChunk");
function createOpenAIResponsesChatCompletionsMismatchError({
  value,
  cause,
  url,
  requestBodyValues,
  responseHeaders
}) {
  return new APICallError({
    message: "Received a Chat Completions stream while using the OpenAI Responses API. The default OpenAI provider model uses the Responses API. If your custom baseURL targets a Chat Completions-compatible endpoint, use openai.chat('model-id') or createOpenAI(...).chat('model-id') instead. You can also use @ai-sdk/openai-compatible for OpenAI-compatible providers.",
    url,
    requestBodyValues,
    responseHeaders,
    responseBody: JSON.stringify(value),
    cause,
    data: value,
    isRetryable: false
  });
}
__name(createOpenAIResponsesChatCompletionsMismatchError, "createOpenAIResponsesChatCompletionsMismatchError");
function asRecord2(value) {
  return typeof value === "object" && value != null ? value : void 0;
}
__name(asRecord2, "asRecord2");
function isResponseOutputItemDoneChunk(chunk) {
  return chunk.type === "response.output_item.done";
}
__name(isResponseOutputItemDoneChunk, "isResponseOutputItemDoneChunk");
function isResponseFinishedChunk(chunk) {
  return chunk.type === "response.completed" || chunk.type === "response.incomplete";
}
__name(isResponseFinishedChunk, "isResponseFinishedChunk");
function isResponseFailedChunk(chunk) {
  return chunk.type === "response.failed";
}
__name(isResponseFailedChunk, "isResponseFailedChunk");
function isResponseCreatedChunk(chunk) {
  return chunk.type === "response.created";
}
__name(isResponseCreatedChunk, "isResponseCreatedChunk");
function isResponseFunctionCallArgumentsDeltaChunk(chunk) {
  return chunk.type === "response.function_call_arguments.delta";
}
__name(isResponseFunctionCallArgumentsDeltaChunk, "isResponseFunctionCallArgumentsDeltaChunk");
function isResponseCustomToolCallInputDeltaChunk(chunk) {
  return chunk.type === "response.custom_tool_call_input.delta";
}
__name(isResponseCustomToolCallInputDeltaChunk, "isResponseCustomToolCallInputDeltaChunk");
function isResponseImageGenerationCallPartialImageChunk(chunk) {
  return chunk.type === "response.image_generation_call.partial_image";
}
__name(isResponseImageGenerationCallPartialImageChunk, "isResponseImageGenerationCallPartialImageChunk");
function isResponseCodeInterpreterCallCodeDeltaChunk(chunk) {
  return chunk.type === "response.code_interpreter_call_code.delta";
}
__name(isResponseCodeInterpreterCallCodeDeltaChunk, "isResponseCodeInterpreterCallCodeDeltaChunk");
function isResponseCodeInterpreterCallCodeDoneChunk(chunk) {
  return chunk.type === "response.code_interpreter_call_code.done";
}
__name(isResponseCodeInterpreterCallCodeDoneChunk, "isResponseCodeInterpreterCallCodeDoneChunk");
function isResponseApplyPatchCallOperationDiffDeltaChunk(chunk) {
  return chunk.type === "response.apply_patch_call_operation_diff.delta";
}
__name(isResponseApplyPatchCallOperationDiffDeltaChunk, "isResponseApplyPatchCallOperationDiffDeltaChunk");
function isResponseApplyPatchCallOperationDiffDoneChunk(chunk) {
  return chunk.type === "response.apply_patch_call_operation_diff.done";
}
__name(isResponseApplyPatchCallOperationDiffDoneChunk, "isResponseApplyPatchCallOperationDiffDoneChunk");
function isResponseOutputItemAddedChunk(chunk) {
  return chunk.type === "response.output_item.added";
}
__name(isResponseOutputItemAddedChunk, "isResponseOutputItemAddedChunk");
function isResponseAnnotationAddedChunk(chunk) {
  return chunk.type === "response.output_text.annotation.added";
}
__name(isResponseAnnotationAddedChunk, "isResponseAnnotationAddedChunk");
function isErrorChunk(chunk) {
  return chunk.type === "error";
}
__name(isErrorChunk, "isErrorChunk");
function isResponseOutputChunk(chunk) {
  return !(chunk.type === "response.created" || chunk.type === "response.failed" || chunk.type === "error" || chunk.type === "unknown_chunk");
}
__name(isResponseOutputChunk, "isResponseOutputChunk");
function mapWebSearchOutput(action) {
  var _a24;
  if (action == null) {
    return {};
  }
  switch (action.type) {
    case "search":
      return {
        action: {
          type: "search",
          query: (_a24 = action.query) != null ? _a24 : void 0,
          ...action.queries != null && { queries: action.queries }
        },
        // include sources when provided by the Responses API (behind include flag)
        ...action.sources != null && { sources: action.sources }
      };
    case "open_page":
      return { action: { type: "openPage", url: action.url } };
    case "find_in_page":
      return {
        action: {
          type: "findInPage",
          url: action.url,
          pattern: action.pattern
        }
      };
  }
}
__name(mapWebSearchOutput, "mapWebSearchOutput");
function escapeJSONDelta(delta) {
  return JSON.stringify(delta).slice(1, -1);
}
__name(escapeJSONDelta, "escapeJSONDelta");
var openaiSpeechModelOptionsSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      instructions: external_exports.string().nullish(),
      speed: external_exports.number().min(0.25).max(4).default(1).nullish()
    })
  )
);
var OpenAISpeechModel = class _OpenAISpeechModel {
  static {
    __name(this, "_OpenAISpeechModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _OpenAISpeechModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    text: text2,
    voice = "alloy",
    outputFormat = "mp3",
    speed,
    instructions,
    language,
    providerOptions
  }) {
    const warnings = [];
    const openAIOptions = await parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: openaiSpeechModelOptionsSchema
    });
    const requestBody = {
      model: this.modelId,
      input: text2,
      voice,
      response_format: "mp3",
      speed,
      instructions
    };
    if (outputFormat) {
      if (["mp3", "opus", "aac", "flac", "wav", "pcm"].includes(outputFormat)) {
        requestBody.response_format = outputFormat;
      } else {
        warnings.push({
          type: "unsupported",
          feature: "outputFormat",
          details: `Unsupported output format: ${outputFormat}. Using mp3 instead.`
        });
      }
    }
    if (openAIOptions) {
      const speechModelOptions = {};
      for (const key in speechModelOptions) {
        const value = speechModelOptions[key];
        if (value !== void 0) {
          requestBody[key] = value;
        }
      }
    }
    if (language) {
      warnings.push({
        type: "unsupported",
        feature: "language",
        details: `OpenAI speech models do not support language selection. Language parameter "${language}" was ignored.`
      });
    }
    return {
      requestBody,
      warnings
    };
  }
  async doGenerate(options) {
    var _a24, _b18, _c, _d, _e;
    const currentDate = (_c = (_b18 = (_a24 = this.config._internal) == null ? void 0 : _a24.currentDate) == null ? void 0 : _b18.call(_a24)) != null ? _c : /* @__PURE__ */ new Date();
    const { requestBody, warnings } = await this.getArgs(options);
    const {
      value: audio,
      responseHeaders,
      rawValue: rawResponse
    } = await postJsonToApi({
      url: this.config.url({
        path: "/audio/speech",
        modelId: this.modelId
      }),
      headers: combineHeaders((_e = (_d = this.config).headers) == null ? void 0 : _e.call(_d), options.headers),
      body: requestBody,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createBinaryResponseHandler(),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    return {
      audio,
      warnings,
      request: {
        body: JSON.stringify(requestBody)
      },
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders,
        body: rawResponse
      }
    };
  }
};
var openaiTranscriptionResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      text: external_exports.string(),
      language: external_exports.string().nullish(),
      duration: external_exports.number().nullish(),
      words: external_exports.array(
        external_exports.object({
          word: external_exports.string(),
          start: external_exports.number(),
          end: external_exports.number()
        })
      ).nullish(),
      segments: external_exports.array(
        external_exports.object({
          id: external_exports.number(),
          seek: external_exports.number(),
          start: external_exports.number(),
          end: external_exports.number(),
          text: external_exports.string(),
          tokens: external_exports.array(external_exports.number()),
          temperature: external_exports.number(),
          avg_logprob: external_exports.number(),
          compression_ratio: external_exports.number(),
          no_speech_prob: external_exports.number()
        })
      ).nullish()
    })
  )
);
var openAITranscriptionModelOptions = lazySchema(
  () => zodSchema(
    external_exports.object({
      /**
       * Additional information to include in the transcription response.
       */
      include: external_exports.array(external_exports.string()).optional(),
      /**
       * The language of the input audio in ISO-639-1 format.
       */
      language: external_exports.string().optional(),
      /**
       * An optional text to guide the model's style or continue a previous audio segment.
       */
      prompt: external_exports.string().optional(),
      /**
       * The sampling temperature, between 0 and 1.
       * @default 0
       */
      temperature: external_exports.number().min(0).max(1).default(0).optional(),
      /**
       * The timestamp granularities to populate for this transcription.
       * @default ['segment']
       */
      timestampGranularities: external_exports.array(external_exports.enum(["word", "segment"])).default(["segment"]).optional(),
      /**
       * Options for streaming transcription models such as `gpt-realtime-whisper`.
       */
      streaming: external_exports.object({
        /**
         * Latency/accuracy tradeoff for realtime transcription.
         */
        delay: external_exports.enum(["minimal", "low", "medium", "high", "xhigh"]).optional(),
        /**
         * Additional fields to include in realtime transcription events.
         */
        include: external_exports.array(external_exports.string()).optional()
      }).optional()
    })
  )
);
function isRealtimeTranscriptionModelId(modelId) {
  return modelId === "gpt-realtime-whisper" || modelId.startsWith("gpt-realtime-whisper-");
}
__name(isRealtimeTranscriptionModelId, "isRealtimeTranscriptionModelId");
var languageMap = {
  afrikaans: "af",
  arabic: "ar",
  armenian: "hy",
  azerbaijani: "az",
  belarusian: "be",
  bosnian: "bs",
  bulgarian: "bg",
  catalan: "ca",
  chinese: "zh",
  croatian: "hr",
  czech: "cs",
  danish: "da",
  dutch: "nl",
  english: "en",
  estonian: "et",
  finnish: "fi",
  french: "fr",
  galician: "gl",
  german: "de",
  greek: "el",
  hebrew: "he",
  hindi: "hi",
  hungarian: "hu",
  icelandic: "is",
  indonesian: "id",
  italian: "it",
  japanese: "ja",
  kannada: "kn",
  kazakh: "kk",
  korean: "ko",
  latvian: "lv",
  lithuanian: "lt",
  macedonian: "mk",
  malay: "ms",
  marathi: "mr",
  maori: "mi",
  nepali: "ne",
  norwegian: "no",
  persian: "fa",
  polish: "pl",
  portuguese: "pt",
  romanian: "ro",
  russian: "ru",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  spanish: "es",
  swahili: "sw",
  swedish: "sv",
  tagalog: "tl",
  tamil: "ta",
  thai: "th",
  turkish: "tr",
  ukrainian: "uk",
  urdu: "ur",
  vietnamese: "vi",
  welsh: "cy"
};
var OpenAITranscriptionModel = class _OpenAITranscriptionModel {
  static {
    __name(this, "_OpenAITranscriptionModel");
  }
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v4";
  }
  static [WORKFLOW_SERIALIZE](model) {
    return serializeModelOptions({
      modelId: model.modelId,
      config: model.config
    });
  }
  static [WORKFLOW_DESERIALIZE](options) {
    return new _OpenAITranscriptionModel(options.modelId, options.config);
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    audio,
    mediaType,
    providerOptions
  }) {
    const warnings = [];
    const openAIOptions = await parseProviderOptions({
      provider: "openai",
      providerOptions,
      schema: openAITranscriptionModelOptions
    });
    const formData = new FormData();
    const blob = audio instanceof Uint8Array ? new Blob([audio]) : new Blob([convertBase64ToUint8Array(audio)]);
    formData.append("model", this.modelId);
    const fileExtension = mediaTypeToExtension(mediaType);
    formData.append(
      "file",
      new File([blob], "audio", { type: mediaType }),
      `audio.${fileExtension}`
    );
    if (this.modelId === "whisper-1") {
      formData.append("response_format", "verbose_json");
    }
    if (openAIOptions) {
      const isGpt4oTranscribeModel = [
        "gpt-4o-transcribe",
        "gpt-4o-mini-transcribe"
      ].includes(this.modelId);
      const transcriptionModelOptions = {
        include: openAIOptions.include,
        language: openAIOptions.language,
        prompt: openAIOptions.prompt,
        // https://platform.openai.com/docs/api-reference/audio/createTranscription#audio_createtranscription-response_format
        // prefer verbose_json to get segments for models that support it
        ...this.modelId !== "whisper-1" && {
          response_format: isGpt4oTranscribeModel ? "json" : "verbose_json"
        },
        temperature: openAIOptions.temperature,
        timestamp_granularities: openAIOptions.timestampGranularities
      };
      for (const [key, value] of Object.entries(transcriptionModelOptions)) {
        if (value != null) {
          if (Array.isArray(value)) {
            for (const item of value) {
              formData.append(`${key}[]`, String(item));
            }
          } else {
            formData.append(key, String(value));
          }
        }
      }
    }
    return {
      formData,
      warnings
    };
  }
  async doGenerate(options) {
    var _a24, _b18, _c, _d, _e, _f, _g, _h, _i, _j;
    if (isRealtimeTranscriptionModelId(this.modelId)) {
      throw new UnsupportedFunctionalityError({
        functionality: `non-streaming transcription with ${this.modelId}`
      });
    }
    const currentDate = (_c = (_b18 = (_a24 = this.config._internal) == null ? void 0 : _a24.currentDate) == null ? void 0 : _b18.call(_a24)) != null ? _c : /* @__PURE__ */ new Date();
    const { formData, warnings } = await this.getArgs(options);
    const {
      value: response,
      responseHeaders,
      rawValue: rawResponse
    } = await postFormDataToApi({
      url: this.config.url({
        path: "/audio/transcriptions",
        modelId: this.modelId
      }),
      headers: combineHeaders((_e = (_d = this.config).headers) == null ? void 0 : _e.call(_d), options.headers),
      formData,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiTranscriptionResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const language = response.language != null && response.language in languageMap ? languageMap[response.language] : void 0;
    return {
      text: response.text,
      segments: (_i = (_h = (_f = response.segments) == null ? void 0 : _f.map((segment) => ({
        text: segment.text,
        startSecond: segment.start,
        endSecond: segment.end
      }))) != null ? _h : (_g = response.words) == null ? void 0 : _g.map((word) => ({
        text: word.word,
        startSecond: word.start,
        endSecond: word.end
      }))) != null ? _i : [],
      language,
      durationInSeconds: (_j = response.duration) != null ? _j : void 0,
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders,
        body: rawResponse
      }
    };
  }
  async doStream(options) {
    var _a24, _b18, _c, _d, _e, _f, _g;
    if (!isRealtimeTranscriptionModelId(this.modelId)) {
      throw new UnsupportedFunctionalityError({
        functionality: `streaming transcription with ${this.modelId}`
      });
    }
    const currentDate = (_c = (_b18 = (_a24 = this.config._internal) == null ? void 0 : _a24.currentDate) == null ? void 0 : _b18.call(_a24)) != null ? _c : /* @__PURE__ */ new Date();
    const openAIOptions = await parseProviderOptions({
      provider: "openai",
      providerOptions: options.providerOptions,
      schema: openAITranscriptionModelOptions
    });
    const warnings = [];
    const rawOpenAIOptions = (_e = (_d = options.providerOptions) == null ? void 0 : _d.openai) != null ? _e : {};
    for (const option of [
      "include",
      "prompt",
      "temperature",
      "timestampGranularities"
    ]) {
      if (rawOpenAIOptions[option] != null) {
        warnings.push({
          type: "unsupported",
          feature: `providerOptions.openai.${option}`,
          details: `OpenAI streaming transcription does not support ${option}.`
        });
      }
    }
    const headers = combineHeaders((_g = (_f = this.config).headers) == null ? void 0 : _g.call(_f), options.headers);
    const sessionUpdate = buildOpenAIRealtimeTranscriptionSession({
      modelId: this.modelId,
      inputAudioFormat: options.inputAudioFormat,
      providerOptions: openAIOptions
    });
    return {
      request: { body: sessionUpdate },
      response: {
        timestamp: currentDate,
        modelId: this.modelId
      },
      stream: createOpenAIRealtimeTranscriptionStream({
        webSocket: this.config.webSocket,
        url: toWebSocketUrl(
          this.config.url({
            path: "/realtime?intent=transcription",
            modelId: this.modelId
          })
        ),
        headers,
        sessionUpdate,
        language: openAIOptions == null ? void 0 : openAIOptions.language,
        warnings,
        audio: options.audio,
        abortSignal: options.abortSignal,
        includeRawChunks: options.includeRawChunks
      })
    };
  }
};
function createOpenAIRealtimeTranscriptionStream({
  webSocket,
  url,
  headers,
  sessionUpdate,
  language,
  warnings,
  audio,
  abortSignal,
  includeRawChunks
}) {
  let finished = false;
  let cleanup = /* @__PURE__ */ __name(() => {
  }, "cleanup");
  return new ReadableStream({
    start: /* @__PURE__ */ __name((controller) => {
      const realtimeConnection = getOpenAIRealtimeConnection(headers);
      let audioReader;
      let connection;
      cleanup = /* @__PURE__ */ __name((closeCode) => {
        if (audioReader != null) {
          void audioReader.cancel().catch(() => {
          });
        } else {
          void audio.cancel().catch(() => {
          });
        }
        connection == null ? void 0 : connection.close(closeCode);
      }, "cleanup");
      const finishWithError = /* @__PURE__ */ __name((error) => {
        if (finished) return;
        finished = true;
        cleanup();
        controller.error(error);
      }, "finishWithError");
      const finish = /* @__PURE__ */ __name((text2, id) => {
        if (finished) return;
        finished = true;
        if (id != null) {
          controller.enqueue({ type: "transcript-final", id, text: text2 });
        }
        controller.enqueue({
          type: "finish",
          text: text2,
          segments: [],
          language
        });
        controller.close();
        cleanup(1e3);
      }, "finish");
      const sendAudio = /* @__PURE__ */ __name(async (socket) => {
        audioReader = audio.getReader();
        try {
          while (true) {
            const { done, value } = await audioReader.read();
            if (done || finished) break;
            socket.send(
              JSON.stringify({
                type: "input_audio_buffer.append",
                audio: convertToBase64(value)
              })
            );
            await waitForWebSocketBufferDrain(socket);
          }
        } finally {
          audioReader.releaseLock();
          audioReader = void 0;
        }
        if (!finished) {
          socket.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
        }
      }, "sendAudio");
      connection = connectToWebSocket({
        url,
        protocols: realtimeConnection.protocols,
        headers: realtimeConnection.headers,
        webSocket,
        abortSignal,
        onAbort: finishWithError,
        onProcessingError: finishWithError,
        onOpen: /* @__PURE__ */ __name((socket) => {
          controller.enqueue({ type: "stream-start", warnings });
          socket.send(JSON.stringify(sessionUpdate));
          void sendAudio(socket).catch(finishWithError);
        }, "onOpen"),
        onMessageText: /* @__PURE__ */ __name(async (text2) => {
          var _a24, _b18, _c, _d;
          const parsed = await safeParseJSON({ text: text2 });
          if (!parsed.success) return;
          const raw = parsed.value;
          if (includeRawChunks) {
            controller.enqueue({ type: "raw", rawValue: raw });
          }
          switch (raw.type) {
            case "conversation.item.input_audio_transcription.delta": {
              controller.enqueue({
                type: "transcript-delta",
                id: raw.item_id,
                delta: (_a24 = raw.delta) != null ? _a24 : ""
              });
              break;
            }
            case "conversation.item.input_audio_transcription.completed": {
              finish((_b18 = raw.transcript) != null ? _b18 : "", raw.item_id);
              break;
            }
            case "error": {
              finishWithError(
                new Error((_d = (_c = raw.error) == null ? void 0 : _c.message) != null ? _d : "OpenAI realtime error")
              );
              break;
            }
          }
        }, "onMessageText"),
        onSocketError: /* @__PURE__ */ __name(() => {
          finishWithError(new Error("OpenAI realtime transcription error"));
        }, "onSocketError"),
        onClose: /* @__PURE__ */ __name(() => {
          if (finished) return;
          finished = true;
          cleanup();
          controller.close();
        }, "onClose")
      });
    }, "start"),
    cancel: /* @__PURE__ */ __name(() => {
      if (finished) return;
      finished = true;
      cleanup();
    }, "cancel")
  });
}
__name(createOpenAIRealtimeTranscriptionStream, "createOpenAIRealtimeTranscriptionStream");
function buildOpenAIRealtimeTranscriptionSession({
  modelId,
  inputAudioFormat,
  providerOptions
}) {
  var _a24, _b18;
  return {
    type: "session.update",
    session: {
      type: "transcription",
      audio: {
        input: {
          format: {
            type: inputAudioFormat.type,
            ...inputAudioFormat.rate != null ? { rate: inputAudioFormat.rate } : {}
          },
          transcription: {
            model: modelId,
            ...(providerOptions == null ? void 0 : providerOptions.language) != null ? { language: providerOptions.language } : {},
            ...((_a24 = providerOptions == null ? void 0 : providerOptions.streaming) == null ? void 0 : _a24.delay) != null ? { delay: providerOptions.streaming.delay } : {}
          },
          turn_detection: null
        }
      },
      ...((_b18 = providerOptions == null ? void 0 : providerOptions.streaming) == null ? void 0 : _b18.include) != null ? { include: providerOptions.streaming.include } : {}
    }
  };
}
__name(buildOpenAIRealtimeTranscriptionSession, "buildOpenAIRealtimeTranscriptionSession");
function getOpenAIRealtimeConnection(headers) {
  var _a24;
  let authorization;
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === "authorization" && value != null) {
      authorization = value;
    }
  }
  const token = (_a24 = authorization == null ? void 0 : authorization.match(/^bearer\s+(.+)$/i)) == null ? void 0 : _a24[1];
  if (token == null) {
    return { protocols: ["realtime"], headers };
  }
  return {
    protocols: ["realtime", `openai-insecure-api-key.${token}`],
    headers: Object.fromEntries(
      Object.entries(headers).filter(
        ([key]) => key.toLowerCase() !== "authorization"
      )
    )
  };
}
__name(getOpenAIRealtimeConnection, "getOpenAIRealtimeConnection");
var openaiSkillResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      id: external_exports.string(),
      name: external_exports.string().nullish(),
      description: external_exports.string().nullish(),
      default_version: external_exports.string().nullish(),
      latest_version: external_exports.string().nullish(),
      created_at: external_exports.number(),
      updated_at: external_exports.number().nullish()
    })
  )
);
var openaiSkillVersionResponseSchema = lazySchema(
  () => zodSchema(
    external_exports.object({
      id: external_exports.string(),
      version: external_exports.string().nullish(),
      name: external_exports.string().nullish(),
      description: external_exports.string().nullish()
    })
  )
);
var OpenAISkills = class {
  static {
    __name(this, "OpenAISkills");
  }
  constructor(config) {
    this.config = config;
    this.specificationVersion = "v4";
  }
  get provider() {
    return this.config.provider;
  }
  async uploadSkill(params) {
    const warnings = [];
    if (params.displayTitle != null) {
      warnings.push({
        type: "unsupported",
        feature: "displayTitle"
      });
    }
    const formData = new FormData();
    for (const file of params.files) {
      const content = convertInlineFileDataToUint8Array(file.data);
      formData.append("files[]", new Blob([content]), file.path);
    }
    const { value: response } = await postFormDataToApi({
      url: this.config.url({ path: "/skills" }),
      headers: combineHeaders(this.config.headers()),
      formData,
      failedResponseHandler: openaiFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        openaiSkillResponseSchema
      ),
      fetch: this.config.fetch
    });
    return {
      providerReference: { openai: response.id },
      ...response.name != null ? { name: response.name } : {},
      ...response.description != null ? { description: response.description } : {},
      ...response.latest_version != null ? { latestVersion: response.latest_version } : {},
      providerMetadata: {
        openai: {
          ...response.default_version != null ? { defaultVersion: response.default_version } : {},
          ...response.created_at != null ? { createdAt: response.created_at } : {},
          ...response.updated_at != null ? { updatedAt: response.updated_at } : {}
        }
      },
      warnings
    };
  }
};
var VERSION4 = true ? "4.0.16" : "0.0.0-test";
function createOpenAI(options = {}) {
  var _a24, _b18;
  const baseURL = (_a24 = withoutTrailingSlash(
    validateBaseURL(
      loadOptionalSetting({
        settingValue: options.baseURL,
        environmentVariableName: "OPENAI_BASE_URL"
      })
    )
  )) != null ? _a24 : "https://api.openai.com/v1";
  const providerName = (_b18 = options.name) != null ? _b18 : "openai";
  const getHeaders = /* @__PURE__ */ __name(() => withUserAgentSuffix(
    {
      Authorization: `Bearer ${loadApiKey({
        apiKey: options.apiKey,
        environmentVariableName: "OPENAI_API_KEY",
        description: "OpenAI"
      })}`,
      "OpenAI-Organization": options.organization,
      "OpenAI-Project": options.project,
      ...options.headers
    },
    `ai-sdk/openai/${VERSION4}`
  ), "getHeaders");
  const createChatModel = /* @__PURE__ */ __name((modelId) => new OpenAIChatLanguageModel(modelId, {
    provider: `${providerName}.chat`,
    url: /* @__PURE__ */ __name(({ path }) => `${baseURL}${path}`, "url"),
    headers: getHeaders,
    fetch: options.fetch
  }), "createChatModel");
  const createCompletionModel = /* @__PURE__ */ __name((modelId) => new OpenAICompletionLanguageModel(modelId, {
    provider: `${providerName}.completion`,
    url: /* @__PURE__ */ __name(({ path }) => `${baseURL}${path}`, "url"),
    headers: getHeaders,
    fetch: options.fetch
  }), "createCompletionModel");
  const createEmbeddingModel = /* @__PURE__ */ __name((modelId) => new OpenAIEmbeddingModel(modelId, {
    provider: `${providerName}.embedding`,
    url: /* @__PURE__ */ __name(({ path }) => `${baseURL}${path}`, "url"),
    headers: getHeaders,
    fetch: options.fetch
  }), "createEmbeddingModel");
  const createImageModel = /* @__PURE__ */ __name((modelId) => new OpenAIImageModel(modelId, {
    provider: `${providerName}.image`,
    url: /* @__PURE__ */ __name(({ path }) => `${baseURL}${path}`, "url"),
    headers: getHeaders,
    fetch: options.fetch
  }), "createImageModel");
  const createTranscriptionModel = /* @__PURE__ */ __name((modelId) => new OpenAITranscriptionModel(modelId, {
    provider: `${providerName}.transcription`,
    url: /* @__PURE__ */ __name(({ path }) => `${baseURL}${path}`, "url"),
    headers: getHeaders,
    fetch: options.fetch,
    webSocket: options.webSocket
  }), "createTranscriptionModel");
  const createSpeechModel = /* @__PURE__ */ __name((modelId) => new OpenAISpeechModel(modelId, {
    provider: `${providerName}.speech`,
    url: /* @__PURE__ */ __name(({ path }) => `${baseURL}${path}`, "url"),
    headers: getHeaders,
    fetch: options.fetch
  }), "createSpeechModel");
  const createFiles = /* @__PURE__ */ __name(() => new OpenAIFiles({
    provider: `${providerName}.files`,
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  }), "createFiles");
  const createSkills = /* @__PURE__ */ __name(() => new OpenAISkills({
    provider: `${providerName}.skills`,
    url: /* @__PURE__ */ __name(({ path }) => `${baseURL}${path}`, "url"),
    headers: getHeaders,
    fetch: options.fetch
  }), "createSkills");
  const createLanguageModel = /* @__PURE__ */ __name((modelId) => {
    if (new.target) {
      throw new Error(
        "The OpenAI model function cannot be called with the new keyword."
      );
    }
    return createResponsesModel(modelId);
  }, "createLanguageModel");
  const createResponsesModel = /* @__PURE__ */ __name((modelId) => {
    return new OpenAIResponsesLanguageModel(modelId, {
      provider: `${providerName}.responses`,
      url: /* @__PURE__ */ __name(({ path }) => `${baseURL}${path}`, "url"),
      headers: getHeaders,
      fetch: options.fetch,
      // Soft-deprecated. TODO: remove in v8
      fileIdPrefixes: ["file-"]
    });
  }, "createResponsesModel");
  const createRealtimeModel = /* @__PURE__ */ __name((modelId) => new OpenAIRealtimeModel(modelId, {
    provider: `${providerName}.realtime`,
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  }), "createRealtimeModel");
  const experimentalRealtimeFactory = Object.assign(
    (modelId) => createRealtimeModel(modelId),
    {
      getToken: /* @__PURE__ */ __name(async (tokenOptions) => {
        const model = createRealtimeModel(tokenOptions.model);
        const secret = await model.doCreateClientSecret({
          sessionConfig: tokenOptions.sessionConfig,
          expiresAfterSeconds: tokenOptions.expiresAfterSeconds
        });
        return {
          token: secret.token,
          url: secret.url,
          expiresAt: secret.expiresAt
        };
      }, "getToken")
    }
  );
  const provider = /* @__PURE__ */ __name(function(modelId) {
    return createLanguageModel(modelId);
  }, "provider");
  provider.specificationVersion = "v4";
  provider.languageModel = createLanguageModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.responses = createResponsesModel;
  provider.embedding = createEmbeddingModel;
  provider.embeddingModel = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.image = createImageModel;
  provider.imageModel = createImageModel;
  provider.transcription = createTranscriptionModel;
  provider.transcriptionModel = createTranscriptionModel;
  provider.speech = createSpeechModel;
  provider.speechModel = createSpeechModel;
  provider.files = createFiles;
  provider.skills = createSkills;
  provider.experimental_realtime = experimentalRealtimeFactory;
  provider.tools = openaiTools;
  return provider;
}
__name(createOpenAI, "createOpenAI");
var openai = createOpenAI();

// lib/ai/client.ts
var go = createOpenAI({
  baseURL: "https://opencode.ai/zen/go/v1",
  apiKey: process.env.OPENCODE_GO_API_KEY ?? ""
});
var aiModel = go("deepseek-v4-pro");

export {
  generateObject,
  streamObject,
  aiModel
};
//# sourceMappingURL=chunk-RV4KBN5L.mjs.map
