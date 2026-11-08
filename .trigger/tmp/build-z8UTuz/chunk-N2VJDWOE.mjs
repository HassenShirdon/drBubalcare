import {
  esm_exports,
  init_esm as init_esm2
} from "./chunk-UT4CBAZP.mjs";
import {
  __commonJS,
  __esm,
  __export,
  __name,
  __require,
  __toCommonJS,
  __toESM,
  init_esm
} from "./chunk-JUPALWCH.mjs";

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/trace/suppress-tracing.js
var require_suppress_tracing = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/trace/suppress-tracing.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isTracingSuppressed = exports.unsuppressTracing = exports.suppressTracing = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var SUPPRESS_TRACING_KEY = (0, api_1.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");
    function suppressTracing(context) {
      return context.setValue(SUPPRESS_TRACING_KEY, true);
    }
    __name(suppressTracing, "suppressTracing");
    exports.suppressTracing = suppressTracing;
    function unsuppressTracing(context) {
      return context.deleteValue(SUPPRESS_TRACING_KEY);
    }
    __name(unsuppressTracing, "unsuppressTracing");
    exports.unsuppressTracing = unsuppressTracing;
    function isTracingSuppressed(context) {
      return context.getValue(SUPPRESS_TRACING_KEY) === true;
    }
    __name(isTracingSuppressed, "isTracingSuppressed");
    exports.isTracingSuppressed = isTracingSuppressed;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/baggage/constants.js
var require_constants = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/baggage/constants.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BAGGAGE_MAX_TOTAL_LENGTH = exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = exports.BAGGAGE_MAX_NAME_VALUE_PAIRS = exports.BAGGAGE_HEADER = exports.BAGGAGE_ITEMS_SEPARATOR = exports.BAGGAGE_PROPERTIES_SEPARATOR = exports.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
    exports.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
    exports.BAGGAGE_PROPERTIES_SEPARATOR = ";";
    exports.BAGGAGE_ITEMS_SEPARATOR = ",";
    exports.BAGGAGE_HEADER = "baggage";
    exports.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
    exports.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
    exports.BAGGAGE_MAX_TOTAL_LENGTH = 8192;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/baggage/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/baggage/utils.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseKeyPairsIntoRecord = exports.parseBaggageHeaderString = exports.parsePairKeyValue = exports.getKeyPairs = exports.serializeKeyPairs = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var constants_1 = require_constants();
    function serializeKeyPairs(keyPairs) {
      return keyPairs.reduce((hValue, current) => {
        const value = `${hValue}${hValue !== "" ? constants_1.BAGGAGE_ITEMS_SEPARATOR : ""}${current}`;
        return value.length > constants_1.BAGGAGE_MAX_TOTAL_LENGTH ? hValue : value;
      }, "");
    }
    __name(serializeKeyPairs, "serializeKeyPairs");
    exports.serializeKeyPairs = serializeKeyPairs;
    function getKeyPairs(baggage) {
      return baggage.getAllEntries().map(([key, value]) => {
        let entry = `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
        if (value.metadata !== void 0) {
          entry += constants_1.BAGGAGE_PROPERTIES_SEPARATOR + value.metadata.toString();
        }
        return entry;
      });
    }
    __name(getKeyPairs, "getKeyPairs");
    exports.getKeyPairs = getKeyPairs;
    function parsePairKeyValue(entry) {
      if (!entry)
        return;
      const metadataSeparatorIndex = entry.indexOf(constants_1.BAGGAGE_PROPERTIES_SEPARATOR);
      const keyPairPart = metadataSeparatorIndex === -1 ? entry : entry.substring(0, metadataSeparatorIndex);
      const separatorIndex = keyPairPart.indexOf(constants_1.BAGGAGE_KEY_PAIR_SEPARATOR);
      if (separatorIndex <= 0)
        return;
      const rawKey = keyPairPart.substring(0, separatorIndex).trim();
      const rawValue = keyPairPart.substring(separatorIndex + 1).trim();
      if (!rawKey || !rawValue)
        return;
      let key;
      let value;
      try {
        key = decodeURIComponent(rawKey);
        value = decodeURIComponent(rawValue);
      } catch {
        return;
      }
      let metadata;
      if (metadataSeparatorIndex !== -1 && metadataSeparatorIndex < entry.length - 1) {
        const metadataString = entry.substring(metadataSeparatorIndex + 1);
        metadata = (0, api_1.baggageEntryMetadataFromString)(metadataString);
      }
      return { key, value, metadata };
    }
    __name(parsePairKeyValue, "parsePairKeyValue");
    exports.parsePairKeyValue = parsePairKeyValue;
    function parseBaggageHeaderString(value, baggage, count, totalSize) {
      let start = 0;
      while (start < value.length && count < constants_1.BAGGAGE_MAX_NAME_VALUE_PAIRS) {
        const end = value.indexOf(constants_1.BAGGAGE_ITEMS_SEPARATOR, start);
        const entryEnd = end === -1 ? value.length : end;
        const entryLength = entryEnd - start;
        if (entryLength <= constants_1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS) {
          const keyPair = parsePairKeyValue(value.substring(start, entryEnd));
          if (keyPair) {
            const entrySize = (count === 0 ? 0 : 1) + entryLength;
            if (totalSize + entrySize > constants_1.BAGGAGE_MAX_TOTAL_LENGTH)
              break;
            baggage[keyPair.key] = keyPair.metadata ? { value: keyPair.value, metadata: keyPair.metadata } : { value: keyPair.value };
            count++;
            totalSize += entrySize;
          }
        }
        if (end === -1)
          break;
        start = end + 1;
      }
      return [count, totalSize];
    }
    __name(parseBaggageHeaderString, "parseBaggageHeaderString");
    exports.parseBaggageHeaderString = parseBaggageHeaderString;
    function parseKeyPairsIntoRecord(value) {
      const result = {};
      if (typeof value === "string" && value.length > 0) {
        value.split(constants_1.BAGGAGE_ITEMS_SEPARATOR).forEach((entry) => {
          const keyPair = parsePairKeyValue(entry);
          if (keyPair !== void 0 && keyPair.value.length > 0) {
            result[keyPair.key] = keyPair.value;
          }
        });
      }
      return result;
    }
    __name(parseKeyPairsIntoRecord, "parseKeyPairsIntoRecord");
    exports.parseKeyPairsIntoRecord = parseKeyPairsIntoRecord;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/baggage/propagation/W3CBaggagePropagator.js
var require_W3CBaggagePropagator = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/baggage/propagation/W3CBaggagePropagator.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.W3CBaggagePropagator = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var suppress_tracing_1 = require_suppress_tracing();
    var constants_1 = require_constants();
    var utils_1 = require_utils();
    var W3CBaggagePropagator = class {
      static {
        __name(this, "W3CBaggagePropagator");
      }
      inject(context, carrier, setter) {
        const baggage = api_1.propagation.getBaggage(context);
        if (!baggage || (0, suppress_tracing_1.isTracingSuppressed)(context))
          return;
        const keyPairs = (0, utils_1.getKeyPairs)(baggage).filter((pair) => {
          return pair.length <= constants_1.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS;
        }).slice(0, constants_1.BAGGAGE_MAX_NAME_VALUE_PAIRS);
        const headerValue = (0, utils_1.serializeKeyPairs)(keyPairs);
        if (headerValue.length > 0) {
          setter.set(carrier, constants_1.BAGGAGE_HEADER, headerValue);
        }
      }
      extract(context, carrier, getter) {
        const headerValue = getter.get(carrier, constants_1.BAGGAGE_HEADER);
        if (!headerValue) {
          return context;
        }
        const baggage = {};
        let count = 0;
        let totalSize = 0;
        if (Array.isArray(headerValue)) {
          for (let i2 = 0; i2 < headerValue.length; i2++) {
            [count, totalSize] = (0, utils_1.parseBaggageHeaderString)(headerValue[i2], baggage, count, totalSize);
          }
        } else {
          [count] = (0, utils_1.parseBaggageHeaderString)(headerValue, baggage, count, totalSize);
        }
        if (count === 0) {
          return context;
        }
        return api_1.propagation.setBaggage(context, api_1.propagation.createBaggage(baggage));
      }
      fields() {
        return [constants_1.BAGGAGE_HEADER];
      }
    };
    exports.W3CBaggagePropagator = W3CBaggagePropagator;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/anchored-clock.js
var require_anchored_clock = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/anchored-clock.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnchoredClock = void 0;
    var AnchoredClock = class {
      static {
        __name(this, "AnchoredClock");
      }
      _monotonicClock;
      _epochMillis;
      _performanceMillis;
      /**
       * Create a new AnchoredClock anchored to the current time returned by systemClock.
       *
       * @param systemClock should be a clock that returns the number of milliseconds since January 1 1970 such as Date
       * @param monotonicClock should be a clock that counts milliseconds monotonically such as window.performance or perf_hooks.performance
       */
      constructor(systemClock, monotonicClock) {
        this._monotonicClock = monotonicClock;
        this._epochMillis = systemClock.now();
        this._performanceMillis = monotonicClock.now();
      }
      /**
       * Returns the current time by adding the number of milliseconds since the
       * AnchoredClock was created to the creation epoch time
       */
      now() {
        const delta = this._monotonicClock.now() - this._performanceMillis;
        return this._epochMillis + delta;
      }
    };
    exports.AnchoredClock = AnchoredClock;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/attributes.js
var require_attributes = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/attributes.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isAttributeValue = exports.isAttributeKey = exports.sanitizeAttributes = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    function sanitizeAttributes(attributes) {
      const out = {};
      if (typeof attributes !== "object" || attributes == null) {
        return out;
      }
      for (const key in attributes) {
        if (!Object.prototype.hasOwnProperty.call(attributes, key)) {
          continue;
        }
        if (!isAttributeKey(key)) {
          api_1.diag.warn(`Invalid attribute key: ${key}`);
          continue;
        }
        const val = attributes[key];
        if (!isAttributeValue(val)) {
          api_1.diag.warn(`Invalid attribute value set for key: ${key}`);
          continue;
        }
        if (Array.isArray(val)) {
          out[key] = val.slice();
        } else {
          out[key] = val;
        }
      }
      return out;
    }
    __name(sanitizeAttributes, "sanitizeAttributes");
    exports.sanitizeAttributes = sanitizeAttributes;
    function isAttributeKey(key) {
      return typeof key === "string" && key !== "";
    }
    __name(isAttributeKey, "isAttributeKey");
    exports.isAttributeKey = isAttributeKey;
    function isAttributeValue(val) {
      if (val == null) {
        return true;
      }
      if (Array.isArray(val)) {
        return isHomogeneousAttributeValueArray(val);
      }
      return isValidPrimitiveAttributeValueType(typeof val);
    }
    __name(isAttributeValue, "isAttributeValue");
    exports.isAttributeValue = isAttributeValue;
    function isHomogeneousAttributeValueArray(arr) {
      let type;
      for (const element of arr) {
        if (element == null)
          continue;
        const elementType = typeof element;
        if (elementType === type) {
          continue;
        }
        if (!type) {
          if (isValidPrimitiveAttributeValueType(elementType)) {
            type = elementType;
            continue;
          }
          return false;
        }
        return false;
      }
      return true;
    }
    __name(isHomogeneousAttributeValueArray, "isHomogeneousAttributeValueArray");
    function isValidPrimitiveAttributeValueType(valType) {
      switch (valType) {
        case "number":
        case "boolean":
        case "string":
          return true;
      }
      return false;
    }
    __name(isValidPrimitiveAttributeValueType, "isValidPrimitiveAttributeValueType");
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/logging-error-handler.js
var require_logging_error_handler = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/logging-error-handler.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loggingErrorHandler = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    function loggingErrorHandler() {
      return (ex) => {
        api_1.diag.error(stringifyException(ex));
      };
    }
    __name(loggingErrorHandler, "loggingErrorHandler");
    exports.loggingErrorHandler = loggingErrorHandler;
    function stringifyException(ex) {
      if (typeof ex === "string") {
        return ex;
      } else {
        return JSON.stringify(flattenException(ex));
      }
    }
    __name(stringifyException, "stringifyException");
    function flattenException(ex) {
      const result = {};
      let current = ex;
      while (current !== null) {
        Object.getOwnPropertyNames(current).forEach((propertyName) => {
          if (result[propertyName])
            return;
          const value = current[propertyName];
          if (value) {
            result[propertyName] = String(value);
          }
        });
        current = Object.getPrototypeOf(current);
      }
      return result;
    }
    __name(flattenException, "flattenException");
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/global-error-handler.js
var require_global_error_handler = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/global-error-handler.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.globalErrorHandler = exports.setGlobalErrorHandler = void 0;
    var logging_error_handler_1 = require_logging_error_handler();
    var delegateHandler = (0, logging_error_handler_1.loggingErrorHandler)();
    function setGlobalErrorHandler(handler) {
      delegateHandler = handler;
    }
    __name(setGlobalErrorHandler, "setGlobalErrorHandler");
    exports.setGlobalErrorHandler = setGlobalErrorHandler;
    function globalErrorHandler(ex) {
      try {
        delegateHandler(ex);
      } catch {
      }
    }
    __name(globalErrorHandler, "globalErrorHandler");
    exports.globalErrorHandler = globalErrorHandler;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/platform/node/environment.js
var require_environment = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/platform/node/environment.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getStringListFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = exports.getNumberFromEnv = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var util_1 = __require("util");
    function getNumberFromEnv(key) {
      const raw = process.env[key];
      if (raw == null || raw.trim() === "") {
        return void 0;
      }
      const value = Number(raw);
      if (isNaN(value)) {
        api_1.diag.warn(`Unknown value ${(0, util_1.inspect)(raw)} for ${key}, expected a number, using defaults`);
        return void 0;
      }
      return value;
    }
    __name(getNumberFromEnv, "getNumberFromEnv");
    exports.getNumberFromEnv = getNumberFromEnv;
    function getStringFromEnv(key) {
      const raw = process.env[key];
      if (raw == null || raw.trim() === "") {
        return void 0;
      }
      return raw;
    }
    __name(getStringFromEnv, "getStringFromEnv");
    exports.getStringFromEnv = getStringFromEnv;
    function getBooleanFromEnv(key) {
      const raw = process.env[key]?.trim().toLowerCase();
      if (raw == null || raw === "") {
        return false;
      }
      if (raw === "true") {
        return true;
      } else if (raw === "false") {
        return false;
      } else {
        api_1.diag.warn(`Unknown value ${(0, util_1.inspect)(raw)} for ${key}, expected 'true' or 'false', falling back to 'false' (default)`);
        return false;
      }
    }
    __name(getBooleanFromEnv, "getBooleanFromEnv");
    exports.getBooleanFromEnv = getBooleanFromEnv;
    function getStringListFromEnv(key) {
      return getStringFromEnv(key)?.split(",").map((v2) => v2.trim()).filter((s) => s !== "");
    }
    __name(getStringListFromEnv, "getStringListFromEnv");
    exports.getStringListFromEnv = getStringListFromEnv;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/globalThis.js
var require_globalThis = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/globalThis.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._globalThis = void 0;
    exports._globalThis = globalThis;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/version.js
var require_version = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/version.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VERSION = void 0;
    exports.VERSION = "2.8.0";
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/internal/utils.js
// @__NO_SIDE_EFFECTS__
function createConstMap(values) {
  let res = {};
  const len = values.length;
  for (let lp = 0; lp < len; lp++) {
    const val = values[lp];
    if (val) {
      res[String(val).toUpperCase().replace(/[-.]/g, "_")] = val;
    }
  }
  return res;
}
var init_utils = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/internal/utils.js"() {
    init_esm();
    __name(createConstMap, "createConstMap");
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/trace/SemanticAttributes.js
var TMP_AWS_LAMBDA_INVOKED_ARN, TMP_DB_SYSTEM, TMP_DB_CONNECTION_STRING, TMP_DB_USER, TMP_DB_JDBC_DRIVER_CLASSNAME, TMP_DB_NAME, TMP_DB_STATEMENT, TMP_DB_OPERATION, TMP_DB_MSSQL_INSTANCE_NAME, TMP_DB_CASSANDRA_KEYSPACE, TMP_DB_CASSANDRA_PAGE_SIZE, TMP_DB_CASSANDRA_CONSISTENCY_LEVEL, TMP_DB_CASSANDRA_TABLE, TMP_DB_CASSANDRA_IDEMPOTENCE, TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, TMP_DB_CASSANDRA_COORDINATOR_ID, TMP_DB_CASSANDRA_COORDINATOR_DC, TMP_DB_HBASE_NAMESPACE, TMP_DB_REDIS_DATABASE_INDEX, TMP_DB_MONGODB_COLLECTION, TMP_DB_SQL_TABLE, TMP_EXCEPTION_TYPE, TMP_EXCEPTION_MESSAGE, TMP_EXCEPTION_STACKTRACE, TMP_EXCEPTION_ESCAPED, TMP_FAAS_TRIGGER, TMP_FAAS_EXECUTION, TMP_FAAS_DOCUMENT_COLLECTION, TMP_FAAS_DOCUMENT_OPERATION, TMP_FAAS_DOCUMENT_TIME, TMP_FAAS_DOCUMENT_NAME, TMP_FAAS_TIME, TMP_FAAS_CRON, TMP_FAAS_COLDSTART, TMP_FAAS_INVOKED_NAME, TMP_FAAS_INVOKED_PROVIDER, TMP_FAAS_INVOKED_REGION, TMP_NET_TRANSPORT, TMP_NET_PEER_IP, TMP_NET_PEER_PORT, TMP_NET_PEER_NAME, TMP_NET_HOST_IP, TMP_NET_HOST_PORT, TMP_NET_HOST_NAME, TMP_NET_HOST_CONNECTION_TYPE, TMP_NET_HOST_CONNECTION_SUBTYPE, TMP_NET_HOST_CARRIER_NAME, TMP_NET_HOST_CARRIER_MCC, TMP_NET_HOST_CARRIER_MNC, TMP_NET_HOST_CARRIER_ICC, TMP_PEER_SERVICE, TMP_ENDUSER_ID, TMP_ENDUSER_ROLE, TMP_ENDUSER_SCOPE, TMP_THREAD_ID, TMP_THREAD_NAME, TMP_CODE_FUNCTION, TMP_CODE_NAMESPACE, TMP_CODE_FILEPATH, TMP_CODE_LINENO, TMP_HTTP_METHOD, TMP_HTTP_URL, TMP_HTTP_TARGET, TMP_HTTP_HOST, TMP_HTTP_SCHEME, TMP_HTTP_STATUS_CODE, TMP_HTTP_FLAVOR, TMP_HTTP_USER_AGENT, TMP_HTTP_REQUEST_CONTENT_LENGTH, TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, TMP_HTTP_RESPONSE_CONTENT_LENGTH, TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, TMP_HTTP_SERVER_NAME, TMP_HTTP_ROUTE, TMP_HTTP_CLIENT_IP, TMP_AWS_DYNAMODB_TABLE_NAMES, TMP_AWS_DYNAMODB_CONSUMED_CAPACITY, TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS, TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, TMP_AWS_DYNAMODB_CONSISTENT_READ, TMP_AWS_DYNAMODB_PROJECTION, TMP_AWS_DYNAMODB_LIMIT, TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET, TMP_AWS_DYNAMODB_INDEX_NAME, TMP_AWS_DYNAMODB_SELECT, TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE, TMP_AWS_DYNAMODB_TABLE_COUNT, TMP_AWS_DYNAMODB_SCAN_FORWARD, TMP_AWS_DYNAMODB_SEGMENT, TMP_AWS_DYNAMODB_TOTAL_SEGMENTS, TMP_AWS_DYNAMODB_COUNT, TMP_AWS_DYNAMODB_SCANNED_COUNT, TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, TMP_MESSAGING_SYSTEM, TMP_MESSAGING_DESTINATION, TMP_MESSAGING_DESTINATION_KIND, TMP_MESSAGING_TEMP_DESTINATION, TMP_MESSAGING_PROTOCOL, TMP_MESSAGING_PROTOCOL_VERSION, TMP_MESSAGING_URL, TMP_MESSAGING_MESSAGE_ID, TMP_MESSAGING_CONVERSATION_ID, TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES, TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES, TMP_MESSAGING_OPERATION, TMP_MESSAGING_CONSUMER_ID, TMP_MESSAGING_RABBITMQ_ROUTING_KEY, TMP_MESSAGING_KAFKA_MESSAGE_KEY, TMP_MESSAGING_KAFKA_CONSUMER_GROUP, TMP_MESSAGING_KAFKA_CLIENT_ID, TMP_MESSAGING_KAFKA_PARTITION, TMP_MESSAGING_KAFKA_TOMBSTONE, TMP_RPC_SYSTEM, TMP_RPC_SERVICE, TMP_RPC_METHOD, TMP_RPC_GRPC_STATUS_CODE, TMP_RPC_JSONRPC_VERSION, TMP_RPC_JSONRPC_REQUEST_ID, TMP_RPC_JSONRPC_ERROR_CODE, TMP_RPC_JSONRPC_ERROR_MESSAGE, TMP_MESSAGE_TYPE, TMP_MESSAGE_ID, TMP_MESSAGE_COMPRESSED_SIZE, TMP_MESSAGE_UNCOMPRESSED_SIZE, SEMATTRS_AWS_LAMBDA_INVOKED_ARN, SEMATTRS_DB_SYSTEM, SEMATTRS_DB_CONNECTION_STRING, SEMATTRS_DB_USER, SEMATTRS_DB_JDBC_DRIVER_CLASSNAME, SEMATTRS_DB_NAME, SEMATTRS_DB_STATEMENT, SEMATTRS_DB_OPERATION, SEMATTRS_DB_MSSQL_INSTANCE_NAME, SEMATTRS_DB_CASSANDRA_KEYSPACE, SEMATTRS_DB_CASSANDRA_PAGE_SIZE, SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL, SEMATTRS_DB_CASSANDRA_TABLE, SEMATTRS_DB_CASSANDRA_IDEMPOTENCE, SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT, SEMATTRS_DB_CASSANDRA_COORDINATOR_ID, SEMATTRS_DB_CASSANDRA_COORDINATOR_DC, SEMATTRS_DB_HBASE_NAMESPACE, SEMATTRS_DB_REDIS_DATABASE_INDEX, SEMATTRS_DB_MONGODB_COLLECTION, SEMATTRS_DB_SQL_TABLE, SEMATTRS_EXCEPTION_TYPE, SEMATTRS_EXCEPTION_MESSAGE, SEMATTRS_EXCEPTION_STACKTRACE, SEMATTRS_EXCEPTION_ESCAPED, SEMATTRS_FAAS_TRIGGER, SEMATTRS_FAAS_EXECUTION, SEMATTRS_FAAS_DOCUMENT_COLLECTION, SEMATTRS_FAAS_DOCUMENT_OPERATION, SEMATTRS_FAAS_DOCUMENT_TIME, SEMATTRS_FAAS_DOCUMENT_NAME, SEMATTRS_FAAS_TIME, SEMATTRS_FAAS_CRON, SEMATTRS_FAAS_COLDSTART, SEMATTRS_FAAS_INVOKED_NAME, SEMATTRS_FAAS_INVOKED_PROVIDER, SEMATTRS_FAAS_INVOKED_REGION, SEMATTRS_NET_TRANSPORT, SEMATTRS_NET_PEER_IP, SEMATTRS_NET_PEER_PORT, SEMATTRS_NET_PEER_NAME, SEMATTRS_NET_HOST_IP, SEMATTRS_NET_HOST_PORT, SEMATTRS_NET_HOST_NAME, SEMATTRS_NET_HOST_CONNECTION_TYPE, SEMATTRS_NET_HOST_CONNECTION_SUBTYPE, SEMATTRS_NET_HOST_CARRIER_NAME, SEMATTRS_NET_HOST_CARRIER_MCC, SEMATTRS_NET_HOST_CARRIER_MNC, SEMATTRS_NET_HOST_CARRIER_ICC, SEMATTRS_PEER_SERVICE, SEMATTRS_ENDUSER_ID, SEMATTRS_ENDUSER_ROLE, SEMATTRS_ENDUSER_SCOPE, SEMATTRS_THREAD_ID, SEMATTRS_THREAD_NAME, SEMATTRS_CODE_FUNCTION, SEMATTRS_CODE_NAMESPACE, SEMATTRS_CODE_FILEPATH, SEMATTRS_CODE_LINENO, SEMATTRS_HTTP_METHOD, SEMATTRS_HTTP_URL, SEMATTRS_HTTP_TARGET, SEMATTRS_HTTP_HOST, SEMATTRS_HTTP_SCHEME, SEMATTRS_HTTP_STATUS_CODE, SEMATTRS_HTTP_FLAVOR, SEMATTRS_HTTP_USER_AGENT, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH, SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH, SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED, SEMATTRS_HTTP_SERVER_NAME, SEMATTRS_HTTP_ROUTE, SEMATTRS_HTTP_CLIENT_IP, SEMATTRS_AWS_DYNAMODB_TABLE_NAMES, SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY, SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS, SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY, SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY, SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ, SEMATTRS_AWS_DYNAMODB_PROJECTION, SEMATTRS_AWS_DYNAMODB_LIMIT, SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET, SEMATTRS_AWS_DYNAMODB_INDEX_NAME, SEMATTRS_AWS_DYNAMODB_SELECT, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES, SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE, SEMATTRS_AWS_DYNAMODB_TABLE_COUNT, SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD, SEMATTRS_AWS_DYNAMODB_SEGMENT, SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS, SEMATTRS_AWS_DYNAMODB_COUNT, SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT, SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS, SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES, SEMATTRS_MESSAGING_SYSTEM, SEMATTRS_MESSAGING_DESTINATION, SEMATTRS_MESSAGING_DESTINATION_KIND, SEMATTRS_MESSAGING_TEMP_DESTINATION, SEMATTRS_MESSAGING_PROTOCOL, SEMATTRS_MESSAGING_PROTOCOL_VERSION, SEMATTRS_MESSAGING_URL, SEMATTRS_MESSAGING_MESSAGE_ID, SEMATTRS_MESSAGING_CONVERSATION_ID, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES, SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES, SEMATTRS_MESSAGING_OPERATION, SEMATTRS_MESSAGING_CONSUMER_ID, SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY, SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY, SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP, SEMATTRS_MESSAGING_KAFKA_CLIENT_ID, SEMATTRS_MESSAGING_KAFKA_PARTITION, SEMATTRS_MESSAGING_KAFKA_TOMBSTONE, SEMATTRS_RPC_SYSTEM, SEMATTRS_RPC_SERVICE, SEMATTRS_RPC_METHOD, SEMATTRS_RPC_GRPC_STATUS_CODE, SEMATTRS_RPC_JSONRPC_VERSION, SEMATTRS_RPC_JSONRPC_REQUEST_ID, SEMATTRS_RPC_JSONRPC_ERROR_CODE, SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE, SEMATTRS_MESSAGE_TYPE, SEMATTRS_MESSAGE_ID, SEMATTRS_MESSAGE_COMPRESSED_SIZE, SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE, SemanticAttributes, TMP_DBSYSTEMVALUES_OTHER_SQL, TMP_DBSYSTEMVALUES_MSSQL, TMP_DBSYSTEMVALUES_MYSQL, TMP_DBSYSTEMVALUES_ORACLE, TMP_DBSYSTEMVALUES_DB2, TMP_DBSYSTEMVALUES_POSTGRESQL, TMP_DBSYSTEMVALUES_REDSHIFT, TMP_DBSYSTEMVALUES_HIVE, TMP_DBSYSTEMVALUES_CLOUDSCAPE, TMP_DBSYSTEMVALUES_HSQLDB, TMP_DBSYSTEMVALUES_PROGRESS, TMP_DBSYSTEMVALUES_MAXDB, TMP_DBSYSTEMVALUES_HANADB, TMP_DBSYSTEMVALUES_INGRES, TMP_DBSYSTEMVALUES_FIRSTSQL, TMP_DBSYSTEMVALUES_EDB, TMP_DBSYSTEMVALUES_CACHE, TMP_DBSYSTEMVALUES_ADABAS, TMP_DBSYSTEMVALUES_FIREBIRD, TMP_DBSYSTEMVALUES_DERBY, TMP_DBSYSTEMVALUES_FILEMAKER, TMP_DBSYSTEMVALUES_INFORMIX, TMP_DBSYSTEMVALUES_INSTANTDB, TMP_DBSYSTEMVALUES_INTERBASE, TMP_DBSYSTEMVALUES_MARIADB, TMP_DBSYSTEMVALUES_NETEZZA, TMP_DBSYSTEMVALUES_PERVASIVE, TMP_DBSYSTEMVALUES_POINTBASE, TMP_DBSYSTEMVALUES_SQLITE, TMP_DBSYSTEMVALUES_SYBASE, TMP_DBSYSTEMVALUES_TERADATA, TMP_DBSYSTEMVALUES_VERTICA, TMP_DBSYSTEMVALUES_H2, TMP_DBSYSTEMVALUES_COLDFUSION, TMP_DBSYSTEMVALUES_CASSANDRA, TMP_DBSYSTEMVALUES_HBASE, TMP_DBSYSTEMVALUES_MONGODB, TMP_DBSYSTEMVALUES_REDIS, TMP_DBSYSTEMVALUES_COUCHBASE, TMP_DBSYSTEMVALUES_COUCHDB, TMP_DBSYSTEMVALUES_COSMOSDB, TMP_DBSYSTEMVALUES_DYNAMODB, TMP_DBSYSTEMVALUES_NEO4J, TMP_DBSYSTEMVALUES_GEODE, TMP_DBSYSTEMVALUES_ELASTICSEARCH, TMP_DBSYSTEMVALUES_MEMCACHED, TMP_DBSYSTEMVALUES_COCKROACHDB, DBSYSTEMVALUES_OTHER_SQL, DBSYSTEMVALUES_MSSQL, DBSYSTEMVALUES_MYSQL, DBSYSTEMVALUES_ORACLE, DBSYSTEMVALUES_DB2, DBSYSTEMVALUES_POSTGRESQL, DBSYSTEMVALUES_REDSHIFT, DBSYSTEMVALUES_HIVE, DBSYSTEMVALUES_CLOUDSCAPE, DBSYSTEMVALUES_HSQLDB, DBSYSTEMVALUES_PROGRESS, DBSYSTEMVALUES_MAXDB, DBSYSTEMVALUES_HANADB, DBSYSTEMVALUES_INGRES, DBSYSTEMVALUES_FIRSTSQL, DBSYSTEMVALUES_EDB, DBSYSTEMVALUES_CACHE, DBSYSTEMVALUES_ADABAS, DBSYSTEMVALUES_FIREBIRD, DBSYSTEMVALUES_DERBY, DBSYSTEMVALUES_FILEMAKER, DBSYSTEMVALUES_INFORMIX, DBSYSTEMVALUES_INSTANTDB, DBSYSTEMVALUES_INTERBASE, DBSYSTEMVALUES_MARIADB, DBSYSTEMVALUES_NETEZZA, DBSYSTEMVALUES_PERVASIVE, DBSYSTEMVALUES_POINTBASE, DBSYSTEMVALUES_SQLITE, DBSYSTEMVALUES_SYBASE, DBSYSTEMVALUES_TERADATA, DBSYSTEMVALUES_VERTICA, DBSYSTEMVALUES_H2, DBSYSTEMVALUES_COLDFUSION, DBSYSTEMVALUES_CASSANDRA, DBSYSTEMVALUES_HBASE, DBSYSTEMVALUES_MONGODB, DBSYSTEMVALUES_REDIS, DBSYSTEMVALUES_COUCHBASE, DBSYSTEMVALUES_COUCHDB, DBSYSTEMVALUES_COSMOSDB, DBSYSTEMVALUES_DYNAMODB, DBSYSTEMVALUES_NEO4J, DBSYSTEMVALUES_GEODE, DBSYSTEMVALUES_ELASTICSEARCH, DBSYSTEMVALUES_MEMCACHED, DBSYSTEMVALUES_COCKROACHDB, DbSystemValues, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL, TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_ALL, DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM, DBCASSANDRACONSISTENCYLEVELVALUES_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_TWO, DBCASSANDRACONSISTENCYLEVELVALUES_THREE, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE, DBCASSANDRACONSISTENCYLEVELVALUES_ANY, DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL, DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL, DbCassandraConsistencyLevelValues, TMP_FAASTRIGGERVALUES_DATASOURCE, TMP_FAASTRIGGERVALUES_HTTP, TMP_FAASTRIGGERVALUES_PUBSUB, TMP_FAASTRIGGERVALUES_TIMER, TMP_FAASTRIGGERVALUES_OTHER, FAASTRIGGERVALUES_DATASOURCE, FAASTRIGGERVALUES_HTTP, FAASTRIGGERVALUES_PUBSUB, FAASTRIGGERVALUES_TIMER, FAASTRIGGERVALUES_OTHER, FaasTriggerValues, TMP_FAASDOCUMENTOPERATIONVALUES_INSERT, TMP_FAASDOCUMENTOPERATIONVALUES_EDIT, TMP_FAASDOCUMENTOPERATIONVALUES_DELETE, FAASDOCUMENTOPERATIONVALUES_INSERT, FAASDOCUMENTOPERATIONVALUES_EDIT, FAASDOCUMENTOPERATIONVALUES_DELETE, FaasDocumentOperationValues, TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD, TMP_FAASINVOKEDPROVIDERVALUES_AWS, TMP_FAASINVOKEDPROVIDERVALUES_AZURE, TMP_FAASINVOKEDPROVIDERVALUES_GCP, FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD, FAASINVOKEDPROVIDERVALUES_AWS, FAASINVOKEDPROVIDERVALUES_AZURE, FAASINVOKEDPROVIDERVALUES_GCP, FaasInvokedProviderValues, TMP_NETTRANSPORTVALUES_IP_TCP, TMP_NETTRANSPORTVALUES_IP_UDP, TMP_NETTRANSPORTVALUES_IP, TMP_NETTRANSPORTVALUES_UNIX, TMP_NETTRANSPORTVALUES_PIPE, TMP_NETTRANSPORTVALUES_INPROC, TMP_NETTRANSPORTVALUES_OTHER, NETTRANSPORTVALUES_IP_TCP, NETTRANSPORTVALUES_IP_UDP, NETTRANSPORTVALUES_IP, NETTRANSPORTVALUES_UNIX, NETTRANSPORTVALUES_PIPE, NETTRANSPORTVALUES_INPROC, NETTRANSPORTVALUES_OTHER, NetTransportValues, TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI, TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED, TMP_NETHOSTCONNECTIONTYPEVALUES_CELL, TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE, TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN, NETHOSTCONNECTIONTYPEVALUES_WIFI, NETHOSTCONNECTIONTYPEVALUES_WIRED, NETHOSTCONNECTIONTYPEVALUES_CELL, NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE, NETHOSTCONNECTIONTYPEVALUES_UNKNOWN, NetHostConnectionTypeValues, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA, TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA, NETHOSTCONNECTIONSUBTYPEVALUES_GPRS, NETHOSTCONNECTIONSUBTYPEVALUES_EDGE, NETHOSTCONNECTIONSUBTYPEVALUES_UMTS, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A, NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT, NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA, NETHOSTCONNECTIONSUBTYPEVALUES_HSPA, NETHOSTCONNECTIONSUBTYPEVALUES_IDEN, NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B, NETHOSTCONNECTIONSUBTYPEVALUES_LTE, NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD, NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP, NETHOSTCONNECTIONSUBTYPEVALUES_GSM, NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA, NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN, NETHOSTCONNECTIONSUBTYPEVALUES_NR, NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA, NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA, NetHostConnectionSubtypeValues, TMP_HTTPFLAVORVALUES_HTTP_1_0, TMP_HTTPFLAVORVALUES_HTTP_1_1, TMP_HTTPFLAVORVALUES_HTTP_2_0, TMP_HTTPFLAVORVALUES_SPDY, TMP_HTTPFLAVORVALUES_QUIC, HTTPFLAVORVALUES_HTTP_1_0, HTTPFLAVORVALUES_HTTP_1_1, HTTPFLAVORVALUES_HTTP_2_0, HTTPFLAVORVALUES_SPDY, HTTPFLAVORVALUES_QUIC, HttpFlavorValues, TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE, TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC, MESSAGINGDESTINATIONKINDVALUES_QUEUE, MESSAGINGDESTINATIONKINDVALUES_TOPIC, MessagingDestinationKindValues, TMP_MESSAGINGOPERATIONVALUES_RECEIVE, TMP_MESSAGINGOPERATIONVALUES_PROCESS, MESSAGINGOPERATIONVALUES_RECEIVE, MESSAGINGOPERATIONVALUES_PROCESS, MessagingOperationValues, TMP_RPCGRPCSTATUSCODEVALUES_OK, TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED, TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN, TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT, TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED, TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND, TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS, TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED, TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED, TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION, TMP_RPCGRPCSTATUSCODEVALUES_ABORTED, TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE, TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED, TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL, TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE, TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS, TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED, RPCGRPCSTATUSCODEVALUES_OK, RPCGRPCSTATUSCODEVALUES_CANCELLED, RPCGRPCSTATUSCODEVALUES_UNKNOWN, RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT, RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED, RPCGRPCSTATUSCODEVALUES_NOT_FOUND, RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS, RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED, RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED, RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION, RPCGRPCSTATUSCODEVALUES_ABORTED, RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE, RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED, RPCGRPCSTATUSCODEVALUES_INTERNAL, RPCGRPCSTATUSCODEVALUES_UNAVAILABLE, RPCGRPCSTATUSCODEVALUES_DATA_LOSS, RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED, RpcGrpcStatusCodeValues, TMP_MESSAGETYPEVALUES_SENT, TMP_MESSAGETYPEVALUES_RECEIVED, MESSAGETYPEVALUES_SENT, MESSAGETYPEVALUES_RECEIVED, MessageTypeValues;
var init_SemanticAttributes = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/trace/SemanticAttributes.js"() {
    init_esm();
    init_utils();
    TMP_AWS_LAMBDA_INVOKED_ARN = "aws.lambda.invoked_arn";
    TMP_DB_SYSTEM = "db.system";
    TMP_DB_CONNECTION_STRING = "db.connection_string";
    TMP_DB_USER = "db.user";
    TMP_DB_JDBC_DRIVER_CLASSNAME = "db.jdbc.driver_classname";
    TMP_DB_NAME = "db.name";
    TMP_DB_STATEMENT = "db.statement";
    TMP_DB_OPERATION = "db.operation";
    TMP_DB_MSSQL_INSTANCE_NAME = "db.mssql.instance_name";
    TMP_DB_CASSANDRA_KEYSPACE = "db.cassandra.keyspace";
    TMP_DB_CASSANDRA_PAGE_SIZE = "db.cassandra.page_size";
    TMP_DB_CASSANDRA_CONSISTENCY_LEVEL = "db.cassandra.consistency_level";
    TMP_DB_CASSANDRA_TABLE = "db.cassandra.table";
    TMP_DB_CASSANDRA_IDEMPOTENCE = "db.cassandra.idempotence";
    TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = "db.cassandra.speculative_execution_count";
    TMP_DB_CASSANDRA_COORDINATOR_ID = "db.cassandra.coordinator.id";
    TMP_DB_CASSANDRA_COORDINATOR_DC = "db.cassandra.coordinator.dc";
    TMP_DB_HBASE_NAMESPACE = "db.hbase.namespace";
    TMP_DB_REDIS_DATABASE_INDEX = "db.redis.database_index";
    TMP_DB_MONGODB_COLLECTION = "db.mongodb.collection";
    TMP_DB_SQL_TABLE = "db.sql.table";
    TMP_EXCEPTION_TYPE = "exception.type";
    TMP_EXCEPTION_MESSAGE = "exception.message";
    TMP_EXCEPTION_STACKTRACE = "exception.stacktrace";
    TMP_EXCEPTION_ESCAPED = "exception.escaped";
    TMP_FAAS_TRIGGER = "faas.trigger";
    TMP_FAAS_EXECUTION = "faas.execution";
    TMP_FAAS_DOCUMENT_COLLECTION = "faas.document.collection";
    TMP_FAAS_DOCUMENT_OPERATION = "faas.document.operation";
    TMP_FAAS_DOCUMENT_TIME = "faas.document.time";
    TMP_FAAS_DOCUMENT_NAME = "faas.document.name";
    TMP_FAAS_TIME = "faas.time";
    TMP_FAAS_CRON = "faas.cron";
    TMP_FAAS_COLDSTART = "faas.coldstart";
    TMP_FAAS_INVOKED_NAME = "faas.invoked_name";
    TMP_FAAS_INVOKED_PROVIDER = "faas.invoked_provider";
    TMP_FAAS_INVOKED_REGION = "faas.invoked_region";
    TMP_NET_TRANSPORT = "net.transport";
    TMP_NET_PEER_IP = "net.peer.ip";
    TMP_NET_PEER_PORT = "net.peer.port";
    TMP_NET_PEER_NAME = "net.peer.name";
    TMP_NET_HOST_IP = "net.host.ip";
    TMP_NET_HOST_PORT = "net.host.port";
    TMP_NET_HOST_NAME = "net.host.name";
    TMP_NET_HOST_CONNECTION_TYPE = "net.host.connection.type";
    TMP_NET_HOST_CONNECTION_SUBTYPE = "net.host.connection.subtype";
    TMP_NET_HOST_CARRIER_NAME = "net.host.carrier.name";
    TMP_NET_HOST_CARRIER_MCC = "net.host.carrier.mcc";
    TMP_NET_HOST_CARRIER_MNC = "net.host.carrier.mnc";
    TMP_NET_HOST_CARRIER_ICC = "net.host.carrier.icc";
    TMP_PEER_SERVICE = "peer.service";
    TMP_ENDUSER_ID = "enduser.id";
    TMP_ENDUSER_ROLE = "enduser.role";
    TMP_ENDUSER_SCOPE = "enduser.scope";
    TMP_THREAD_ID = "thread.id";
    TMP_THREAD_NAME = "thread.name";
    TMP_CODE_FUNCTION = "code.function";
    TMP_CODE_NAMESPACE = "code.namespace";
    TMP_CODE_FILEPATH = "code.filepath";
    TMP_CODE_LINENO = "code.lineno";
    TMP_HTTP_METHOD = "http.method";
    TMP_HTTP_URL = "http.url";
    TMP_HTTP_TARGET = "http.target";
    TMP_HTTP_HOST = "http.host";
    TMP_HTTP_SCHEME = "http.scheme";
    TMP_HTTP_STATUS_CODE = "http.status_code";
    TMP_HTTP_FLAVOR = "http.flavor";
    TMP_HTTP_USER_AGENT = "http.user_agent";
    TMP_HTTP_REQUEST_CONTENT_LENGTH = "http.request_content_length";
    TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = "http.request_content_length_uncompressed";
    TMP_HTTP_RESPONSE_CONTENT_LENGTH = "http.response_content_length";
    TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = "http.response_content_length_uncompressed";
    TMP_HTTP_SERVER_NAME = "http.server_name";
    TMP_HTTP_ROUTE = "http.route";
    TMP_HTTP_CLIENT_IP = "http.client_ip";
    TMP_AWS_DYNAMODB_TABLE_NAMES = "aws.dynamodb.table_names";
    TMP_AWS_DYNAMODB_CONSUMED_CAPACITY = "aws.dynamodb.consumed_capacity";
    TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = "aws.dynamodb.item_collection_metrics";
    TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = "aws.dynamodb.provisioned_read_capacity";
    TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = "aws.dynamodb.provisioned_write_capacity";
    TMP_AWS_DYNAMODB_CONSISTENT_READ = "aws.dynamodb.consistent_read";
    TMP_AWS_DYNAMODB_PROJECTION = "aws.dynamodb.projection";
    TMP_AWS_DYNAMODB_LIMIT = "aws.dynamodb.limit";
    TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET = "aws.dynamodb.attributes_to_get";
    TMP_AWS_DYNAMODB_INDEX_NAME = "aws.dynamodb.index_name";
    TMP_AWS_DYNAMODB_SELECT = "aws.dynamodb.select";
    TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = "aws.dynamodb.global_secondary_indexes";
    TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = "aws.dynamodb.local_secondary_indexes";
    TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = "aws.dynamodb.exclusive_start_table";
    TMP_AWS_DYNAMODB_TABLE_COUNT = "aws.dynamodb.table_count";
    TMP_AWS_DYNAMODB_SCAN_FORWARD = "aws.dynamodb.scan_forward";
    TMP_AWS_DYNAMODB_SEGMENT = "aws.dynamodb.segment";
    TMP_AWS_DYNAMODB_TOTAL_SEGMENTS = "aws.dynamodb.total_segments";
    TMP_AWS_DYNAMODB_COUNT = "aws.dynamodb.count";
    TMP_AWS_DYNAMODB_SCANNED_COUNT = "aws.dynamodb.scanned_count";
    TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = "aws.dynamodb.attribute_definitions";
    TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = "aws.dynamodb.global_secondary_index_updates";
    TMP_MESSAGING_SYSTEM = "messaging.system";
    TMP_MESSAGING_DESTINATION = "messaging.destination";
    TMP_MESSAGING_DESTINATION_KIND = "messaging.destination_kind";
    TMP_MESSAGING_TEMP_DESTINATION = "messaging.temp_destination";
    TMP_MESSAGING_PROTOCOL = "messaging.protocol";
    TMP_MESSAGING_PROTOCOL_VERSION = "messaging.protocol_version";
    TMP_MESSAGING_URL = "messaging.url";
    TMP_MESSAGING_MESSAGE_ID = "messaging.message_id";
    TMP_MESSAGING_CONVERSATION_ID = "messaging.conversation_id";
    TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = "messaging.message_payload_size_bytes";
    TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = "messaging.message_payload_compressed_size_bytes";
    TMP_MESSAGING_OPERATION = "messaging.operation";
    TMP_MESSAGING_CONSUMER_ID = "messaging.consumer_id";
    TMP_MESSAGING_RABBITMQ_ROUTING_KEY = "messaging.rabbitmq.routing_key";
    TMP_MESSAGING_KAFKA_MESSAGE_KEY = "messaging.kafka.message_key";
    TMP_MESSAGING_KAFKA_CONSUMER_GROUP = "messaging.kafka.consumer_group";
    TMP_MESSAGING_KAFKA_CLIENT_ID = "messaging.kafka.client_id";
    TMP_MESSAGING_KAFKA_PARTITION = "messaging.kafka.partition";
    TMP_MESSAGING_KAFKA_TOMBSTONE = "messaging.kafka.tombstone";
    TMP_RPC_SYSTEM = "rpc.system";
    TMP_RPC_SERVICE = "rpc.service";
    TMP_RPC_METHOD = "rpc.method";
    TMP_RPC_GRPC_STATUS_CODE = "rpc.grpc.status_code";
    TMP_RPC_JSONRPC_VERSION = "rpc.jsonrpc.version";
    TMP_RPC_JSONRPC_REQUEST_ID = "rpc.jsonrpc.request_id";
    TMP_RPC_JSONRPC_ERROR_CODE = "rpc.jsonrpc.error_code";
    TMP_RPC_JSONRPC_ERROR_MESSAGE = "rpc.jsonrpc.error_message";
    TMP_MESSAGE_TYPE = "message.type";
    TMP_MESSAGE_ID = "message.id";
    TMP_MESSAGE_COMPRESSED_SIZE = "message.compressed_size";
    TMP_MESSAGE_UNCOMPRESSED_SIZE = "message.uncompressed_size";
    SEMATTRS_AWS_LAMBDA_INVOKED_ARN = TMP_AWS_LAMBDA_INVOKED_ARN;
    SEMATTRS_DB_SYSTEM = TMP_DB_SYSTEM;
    SEMATTRS_DB_CONNECTION_STRING = TMP_DB_CONNECTION_STRING;
    SEMATTRS_DB_USER = TMP_DB_USER;
    SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = TMP_DB_JDBC_DRIVER_CLASSNAME;
    SEMATTRS_DB_NAME = TMP_DB_NAME;
    SEMATTRS_DB_STATEMENT = TMP_DB_STATEMENT;
    SEMATTRS_DB_OPERATION = TMP_DB_OPERATION;
    SEMATTRS_DB_MSSQL_INSTANCE_NAME = TMP_DB_MSSQL_INSTANCE_NAME;
    SEMATTRS_DB_CASSANDRA_KEYSPACE = TMP_DB_CASSANDRA_KEYSPACE;
    SEMATTRS_DB_CASSANDRA_PAGE_SIZE = TMP_DB_CASSANDRA_PAGE_SIZE;
    SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = TMP_DB_CASSANDRA_CONSISTENCY_LEVEL;
    SEMATTRS_DB_CASSANDRA_TABLE = TMP_DB_CASSANDRA_TABLE;
    SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = TMP_DB_CASSANDRA_IDEMPOTENCE;
    SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT;
    SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = TMP_DB_CASSANDRA_COORDINATOR_ID;
    SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = TMP_DB_CASSANDRA_COORDINATOR_DC;
    SEMATTRS_DB_HBASE_NAMESPACE = TMP_DB_HBASE_NAMESPACE;
    SEMATTRS_DB_REDIS_DATABASE_INDEX = TMP_DB_REDIS_DATABASE_INDEX;
    SEMATTRS_DB_MONGODB_COLLECTION = TMP_DB_MONGODB_COLLECTION;
    SEMATTRS_DB_SQL_TABLE = TMP_DB_SQL_TABLE;
    SEMATTRS_EXCEPTION_TYPE = TMP_EXCEPTION_TYPE;
    SEMATTRS_EXCEPTION_MESSAGE = TMP_EXCEPTION_MESSAGE;
    SEMATTRS_EXCEPTION_STACKTRACE = TMP_EXCEPTION_STACKTRACE;
    SEMATTRS_EXCEPTION_ESCAPED = TMP_EXCEPTION_ESCAPED;
    SEMATTRS_FAAS_TRIGGER = TMP_FAAS_TRIGGER;
    SEMATTRS_FAAS_EXECUTION = TMP_FAAS_EXECUTION;
    SEMATTRS_FAAS_DOCUMENT_COLLECTION = TMP_FAAS_DOCUMENT_COLLECTION;
    SEMATTRS_FAAS_DOCUMENT_OPERATION = TMP_FAAS_DOCUMENT_OPERATION;
    SEMATTRS_FAAS_DOCUMENT_TIME = TMP_FAAS_DOCUMENT_TIME;
    SEMATTRS_FAAS_DOCUMENT_NAME = TMP_FAAS_DOCUMENT_NAME;
    SEMATTRS_FAAS_TIME = TMP_FAAS_TIME;
    SEMATTRS_FAAS_CRON = TMP_FAAS_CRON;
    SEMATTRS_FAAS_COLDSTART = TMP_FAAS_COLDSTART;
    SEMATTRS_FAAS_INVOKED_NAME = TMP_FAAS_INVOKED_NAME;
    SEMATTRS_FAAS_INVOKED_PROVIDER = TMP_FAAS_INVOKED_PROVIDER;
    SEMATTRS_FAAS_INVOKED_REGION = TMP_FAAS_INVOKED_REGION;
    SEMATTRS_NET_TRANSPORT = TMP_NET_TRANSPORT;
    SEMATTRS_NET_PEER_IP = TMP_NET_PEER_IP;
    SEMATTRS_NET_PEER_PORT = TMP_NET_PEER_PORT;
    SEMATTRS_NET_PEER_NAME = TMP_NET_PEER_NAME;
    SEMATTRS_NET_HOST_IP = TMP_NET_HOST_IP;
    SEMATTRS_NET_HOST_PORT = TMP_NET_HOST_PORT;
    SEMATTRS_NET_HOST_NAME = TMP_NET_HOST_NAME;
    SEMATTRS_NET_HOST_CONNECTION_TYPE = TMP_NET_HOST_CONNECTION_TYPE;
    SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = TMP_NET_HOST_CONNECTION_SUBTYPE;
    SEMATTRS_NET_HOST_CARRIER_NAME = TMP_NET_HOST_CARRIER_NAME;
    SEMATTRS_NET_HOST_CARRIER_MCC = TMP_NET_HOST_CARRIER_MCC;
    SEMATTRS_NET_HOST_CARRIER_MNC = TMP_NET_HOST_CARRIER_MNC;
    SEMATTRS_NET_HOST_CARRIER_ICC = TMP_NET_HOST_CARRIER_ICC;
    SEMATTRS_PEER_SERVICE = TMP_PEER_SERVICE;
    SEMATTRS_ENDUSER_ID = TMP_ENDUSER_ID;
    SEMATTRS_ENDUSER_ROLE = TMP_ENDUSER_ROLE;
    SEMATTRS_ENDUSER_SCOPE = TMP_ENDUSER_SCOPE;
    SEMATTRS_THREAD_ID = TMP_THREAD_ID;
    SEMATTRS_THREAD_NAME = TMP_THREAD_NAME;
    SEMATTRS_CODE_FUNCTION = TMP_CODE_FUNCTION;
    SEMATTRS_CODE_NAMESPACE = TMP_CODE_NAMESPACE;
    SEMATTRS_CODE_FILEPATH = TMP_CODE_FILEPATH;
    SEMATTRS_CODE_LINENO = TMP_CODE_LINENO;
    SEMATTRS_HTTP_METHOD = TMP_HTTP_METHOD;
    SEMATTRS_HTTP_URL = TMP_HTTP_URL;
    SEMATTRS_HTTP_TARGET = TMP_HTTP_TARGET;
    SEMATTRS_HTTP_HOST = TMP_HTTP_HOST;
    SEMATTRS_HTTP_SCHEME = TMP_HTTP_SCHEME;
    SEMATTRS_HTTP_STATUS_CODE = TMP_HTTP_STATUS_CODE;
    SEMATTRS_HTTP_FLAVOR = TMP_HTTP_FLAVOR;
    SEMATTRS_HTTP_USER_AGENT = TMP_HTTP_USER_AGENT;
    SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = TMP_HTTP_REQUEST_CONTENT_LENGTH;
    SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED;
    SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = TMP_HTTP_RESPONSE_CONTENT_LENGTH;
    SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED;
    SEMATTRS_HTTP_SERVER_NAME = TMP_HTTP_SERVER_NAME;
    SEMATTRS_HTTP_ROUTE = TMP_HTTP_ROUTE;
    SEMATTRS_HTTP_CLIENT_IP = TMP_HTTP_CLIENT_IP;
    SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = TMP_AWS_DYNAMODB_TABLE_NAMES;
    SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = TMP_AWS_DYNAMODB_CONSUMED_CAPACITY;
    SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS;
    SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY;
    SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY;
    SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = TMP_AWS_DYNAMODB_CONSISTENT_READ;
    SEMATTRS_AWS_DYNAMODB_PROJECTION = TMP_AWS_DYNAMODB_PROJECTION;
    SEMATTRS_AWS_DYNAMODB_LIMIT = TMP_AWS_DYNAMODB_LIMIT;
    SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET;
    SEMATTRS_AWS_DYNAMODB_INDEX_NAME = TMP_AWS_DYNAMODB_INDEX_NAME;
    SEMATTRS_AWS_DYNAMODB_SELECT = TMP_AWS_DYNAMODB_SELECT;
    SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES;
    SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES;
    SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE;
    SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = TMP_AWS_DYNAMODB_TABLE_COUNT;
    SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = TMP_AWS_DYNAMODB_SCAN_FORWARD;
    SEMATTRS_AWS_DYNAMODB_SEGMENT = TMP_AWS_DYNAMODB_SEGMENT;
    SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = TMP_AWS_DYNAMODB_TOTAL_SEGMENTS;
    SEMATTRS_AWS_DYNAMODB_COUNT = TMP_AWS_DYNAMODB_COUNT;
    SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = TMP_AWS_DYNAMODB_SCANNED_COUNT;
    SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS;
    SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES;
    SEMATTRS_MESSAGING_SYSTEM = TMP_MESSAGING_SYSTEM;
    SEMATTRS_MESSAGING_DESTINATION = TMP_MESSAGING_DESTINATION;
    SEMATTRS_MESSAGING_DESTINATION_KIND = TMP_MESSAGING_DESTINATION_KIND;
    SEMATTRS_MESSAGING_TEMP_DESTINATION = TMP_MESSAGING_TEMP_DESTINATION;
    SEMATTRS_MESSAGING_PROTOCOL = TMP_MESSAGING_PROTOCOL;
    SEMATTRS_MESSAGING_PROTOCOL_VERSION = TMP_MESSAGING_PROTOCOL_VERSION;
    SEMATTRS_MESSAGING_URL = TMP_MESSAGING_URL;
    SEMATTRS_MESSAGING_MESSAGE_ID = TMP_MESSAGING_MESSAGE_ID;
    SEMATTRS_MESSAGING_CONVERSATION_ID = TMP_MESSAGING_CONVERSATION_ID;
    SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES;
    SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES;
    SEMATTRS_MESSAGING_OPERATION = TMP_MESSAGING_OPERATION;
    SEMATTRS_MESSAGING_CONSUMER_ID = TMP_MESSAGING_CONSUMER_ID;
    SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = TMP_MESSAGING_RABBITMQ_ROUTING_KEY;
    SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = TMP_MESSAGING_KAFKA_MESSAGE_KEY;
    SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = TMP_MESSAGING_KAFKA_CONSUMER_GROUP;
    SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = TMP_MESSAGING_KAFKA_CLIENT_ID;
    SEMATTRS_MESSAGING_KAFKA_PARTITION = TMP_MESSAGING_KAFKA_PARTITION;
    SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = TMP_MESSAGING_KAFKA_TOMBSTONE;
    SEMATTRS_RPC_SYSTEM = TMP_RPC_SYSTEM;
    SEMATTRS_RPC_SERVICE = TMP_RPC_SERVICE;
    SEMATTRS_RPC_METHOD = TMP_RPC_METHOD;
    SEMATTRS_RPC_GRPC_STATUS_CODE = TMP_RPC_GRPC_STATUS_CODE;
    SEMATTRS_RPC_JSONRPC_VERSION = TMP_RPC_JSONRPC_VERSION;
    SEMATTRS_RPC_JSONRPC_REQUEST_ID = TMP_RPC_JSONRPC_REQUEST_ID;
    SEMATTRS_RPC_JSONRPC_ERROR_CODE = TMP_RPC_JSONRPC_ERROR_CODE;
    SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = TMP_RPC_JSONRPC_ERROR_MESSAGE;
    SEMATTRS_MESSAGE_TYPE = TMP_MESSAGE_TYPE;
    SEMATTRS_MESSAGE_ID = TMP_MESSAGE_ID;
    SEMATTRS_MESSAGE_COMPRESSED_SIZE = TMP_MESSAGE_COMPRESSED_SIZE;
    SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = TMP_MESSAGE_UNCOMPRESSED_SIZE;
    SemanticAttributes = /* @__PURE__ */ createConstMap([
      TMP_AWS_LAMBDA_INVOKED_ARN,
      TMP_DB_SYSTEM,
      TMP_DB_CONNECTION_STRING,
      TMP_DB_USER,
      TMP_DB_JDBC_DRIVER_CLASSNAME,
      TMP_DB_NAME,
      TMP_DB_STATEMENT,
      TMP_DB_OPERATION,
      TMP_DB_MSSQL_INSTANCE_NAME,
      TMP_DB_CASSANDRA_KEYSPACE,
      TMP_DB_CASSANDRA_PAGE_SIZE,
      TMP_DB_CASSANDRA_CONSISTENCY_LEVEL,
      TMP_DB_CASSANDRA_TABLE,
      TMP_DB_CASSANDRA_IDEMPOTENCE,
      TMP_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
      TMP_DB_CASSANDRA_COORDINATOR_ID,
      TMP_DB_CASSANDRA_COORDINATOR_DC,
      TMP_DB_HBASE_NAMESPACE,
      TMP_DB_REDIS_DATABASE_INDEX,
      TMP_DB_MONGODB_COLLECTION,
      TMP_DB_SQL_TABLE,
      TMP_EXCEPTION_TYPE,
      TMP_EXCEPTION_MESSAGE,
      TMP_EXCEPTION_STACKTRACE,
      TMP_EXCEPTION_ESCAPED,
      TMP_FAAS_TRIGGER,
      TMP_FAAS_EXECUTION,
      TMP_FAAS_DOCUMENT_COLLECTION,
      TMP_FAAS_DOCUMENT_OPERATION,
      TMP_FAAS_DOCUMENT_TIME,
      TMP_FAAS_DOCUMENT_NAME,
      TMP_FAAS_TIME,
      TMP_FAAS_CRON,
      TMP_FAAS_COLDSTART,
      TMP_FAAS_INVOKED_NAME,
      TMP_FAAS_INVOKED_PROVIDER,
      TMP_FAAS_INVOKED_REGION,
      TMP_NET_TRANSPORT,
      TMP_NET_PEER_IP,
      TMP_NET_PEER_PORT,
      TMP_NET_PEER_NAME,
      TMP_NET_HOST_IP,
      TMP_NET_HOST_PORT,
      TMP_NET_HOST_NAME,
      TMP_NET_HOST_CONNECTION_TYPE,
      TMP_NET_HOST_CONNECTION_SUBTYPE,
      TMP_NET_HOST_CARRIER_NAME,
      TMP_NET_HOST_CARRIER_MCC,
      TMP_NET_HOST_CARRIER_MNC,
      TMP_NET_HOST_CARRIER_ICC,
      TMP_PEER_SERVICE,
      TMP_ENDUSER_ID,
      TMP_ENDUSER_ROLE,
      TMP_ENDUSER_SCOPE,
      TMP_THREAD_ID,
      TMP_THREAD_NAME,
      TMP_CODE_FUNCTION,
      TMP_CODE_NAMESPACE,
      TMP_CODE_FILEPATH,
      TMP_CODE_LINENO,
      TMP_HTTP_METHOD,
      TMP_HTTP_URL,
      TMP_HTTP_TARGET,
      TMP_HTTP_HOST,
      TMP_HTTP_SCHEME,
      TMP_HTTP_STATUS_CODE,
      TMP_HTTP_FLAVOR,
      TMP_HTTP_USER_AGENT,
      TMP_HTTP_REQUEST_CONTENT_LENGTH,
      TMP_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
      TMP_HTTP_RESPONSE_CONTENT_LENGTH,
      TMP_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
      TMP_HTTP_SERVER_NAME,
      TMP_HTTP_ROUTE,
      TMP_HTTP_CLIENT_IP,
      TMP_AWS_DYNAMODB_TABLE_NAMES,
      TMP_AWS_DYNAMODB_CONSUMED_CAPACITY,
      TMP_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
      TMP_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
      TMP_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
      TMP_AWS_DYNAMODB_CONSISTENT_READ,
      TMP_AWS_DYNAMODB_PROJECTION,
      TMP_AWS_DYNAMODB_LIMIT,
      TMP_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
      TMP_AWS_DYNAMODB_INDEX_NAME,
      TMP_AWS_DYNAMODB_SELECT,
      TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
      TMP_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
      TMP_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
      TMP_AWS_DYNAMODB_TABLE_COUNT,
      TMP_AWS_DYNAMODB_SCAN_FORWARD,
      TMP_AWS_DYNAMODB_SEGMENT,
      TMP_AWS_DYNAMODB_TOTAL_SEGMENTS,
      TMP_AWS_DYNAMODB_COUNT,
      TMP_AWS_DYNAMODB_SCANNED_COUNT,
      TMP_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
      TMP_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
      TMP_MESSAGING_SYSTEM,
      TMP_MESSAGING_DESTINATION,
      TMP_MESSAGING_DESTINATION_KIND,
      TMP_MESSAGING_TEMP_DESTINATION,
      TMP_MESSAGING_PROTOCOL,
      TMP_MESSAGING_PROTOCOL_VERSION,
      TMP_MESSAGING_URL,
      TMP_MESSAGING_MESSAGE_ID,
      TMP_MESSAGING_CONVERSATION_ID,
      TMP_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
      TMP_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
      TMP_MESSAGING_OPERATION,
      TMP_MESSAGING_CONSUMER_ID,
      TMP_MESSAGING_RABBITMQ_ROUTING_KEY,
      TMP_MESSAGING_KAFKA_MESSAGE_KEY,
      TMP_MESSAGING_KAFKA_CONSUMER_GROUP,
      TMP_MESSAGING_KAFKA_CLIENT_ID,
      TMP_MESSAGING_KAFKA_PARTITION,
      TMP_MESSAGING_KAFKA_TOMBSTONE,
      TMP_RPC_SYSTEM,
      TMP_RPC_SERVICE,
      TMP_RPC_METHOD,
      TMP_RPC_GRPC_STATUS_CODE,
      TMP_RPC_JSONRPC_VERSION,
      TMP_RPC_JSONRPC_REQUEST_ID,
      TMP_RPC_JSONRPC_ERROR_CODE,
      TMP_RPC_JSONRPC_ERROR_MESSAGE,
      TMP_MESSAGE_TYPE,
      TMP_MESSAGE_ID,
      TMP_MESSAGE_COMPRESSED_SIZE,
      TMP_MESSAGE_UNCOMPRESSED_SIZE
    ]);
    TMP_DBSYSTEMVALUES_OTHER_SQL = "other_sql";
    TMP_DBSYSTEMVALUES_MSSQL = "mssql";
    TMP_DBSYSTEMVALUES_MYSQL = "mysql";
    TMP_DBSYSTEMVALUES_ORACLE = "oracle";
    TMP_DBSYSTEMVALUES_DB2 = "db2";
    TMP_DBSYSTEMVALUES_POSTGRESQL = "postgresql";
    TMP_DBSYSTEMVALUES_REDSHIFT = "redshift";
    TMP_DBSYSTEMVALUES_HIVE = "hive";
    TMP_DBSYSTEMVALUES_CLOUDSCAPE = "cloudscape";
    TMP_DBSYSTEMVALUES_HSQLDB = "hsqldb";
    TMP_DBSYSTEMVALUES_PROGRESS = "progress";
    TMP_DBSYSTEMVALUES_MAXDB = "maxdb";
    TMP_DBSYSTEMVALUES_HANADB = "hanadb";
    TMP_DBSYSTEMVALUES_INGRES = "ingres";
    TMP_DBSYSTEMVALUES_FIRSTSQL = "firstsql";
    TMP_DBSYSTEMVALUES_EDB = "edb";
    TMP_DBSYSTEMVALUES_CACHE = "cache";
    TMP_DBSYSTEMVALUES_ADABAS = "adabas";
    TMP_DBSYSTEMVALUES_FIREBIRD = "firebird";
    TMP_DBSYSTEMVALUES_DERBY = "derby";
    TMP_DBSYSTEMVALUES_FILEMAKER = "filemaker";
    TMP_DBSYSTEMVALUES_INFORMIX = "informix";
    TMP_DBSYSTEMVALUES_INSTANTDB = "instantdb";
    TMP_DBSYSTEMVALUES_INTERBASE = "interbase";
    TMP_DBSYSTEMVALUES_MARIADB = "mariadb";
    TMP_DBSYSTEMVALUES_NETEZZA = "netezza";
    TMP_DBSYSTEMVALUES_PERVASIVE = "pervasive";
    TMP_DBSYSTEMVALUES_POINTBASE = "pointbase";
    TMP_DBSYSTEMVALUES_SQLITE = "sqlite";
    TMP_DBSYSTEMVALUES_SYBASE = "sybase";
    TMP_DBSYSTEMVALUES_TERADATA = "teradata";
    TMP_DBSYSTEMVALUES_VERTICA = "vertica";
    TMP_DBSYSTEMVALUES_H2 = "h2";
    TMP_DBSYSTEMVALUES_COLDFUSION = "coldfusion";
    TMP_DBSYSTEMVALUES_CASSANDRA = "cassandra";
    TMP_DBSYSTEMVALUES_HBASE = "hbase";
    TMP_DBSYSTEMVALUES_MONGODB = "mongodb";
    TMP_DBSYSTEMVALUES_REDIS = "redis";
    TMP_DBSYSTEMVALUES_COUCHBASE = "couchbase";
    TMP_DBSYSTEMVALUES_COUCHDB = "couchdb";
    TMP_DBSYSTEMVALUES_COSMOSDB = "cosmosdb";
    TMP_DBSYSTEMVALUES_DYNAMODB = "dynamodb";
    TMP_DBSYSTEMVALUES_NEO4J = "neo4j";
    TMP_DBSYSTEMVALUES_GEODE = "geode";
    TMP_DBSYSTEMVALUES_ELASTICSEARCH = "elasticsearch";
    TMP_DBSYSTEMVALUES_MEMCACHED = "memcached";
    TMP_DBSYSTEMVALUES_COCKROACHDB = "cockroachdb";
    DBSYSTEMVALUES_OTHER_SQL = TMP_DBSYSTEMVALUES_OTHER_SQL;
    DBSYSTEMVALUES_MSSQL = TMP_DBSYSTEMVALUES_MSSQL;
    DBSYSTEMVALUES_MYSQL = TMP_DBSYSTEMVALUES_MYSQL;
    DBSYSTEMVALUES_ORACLE = TMP_DBSYSTEMVALUES_ORACLE;
    DBSYSTEMVALUES_DB2 = TMP_DBSYSTEMVALUES_DB2;
    DBSYSTEMVALUES_POSTGRESQL = TMP_DBSYSTEMVALUES_POSTGRESQL;
    DBSYSTEMVALUES_REDSHIFT = TMP_DBSYSTEMVALUES_REDSHIFT;
    DBSYSTEMVALUES_HIVE = TMP_DBSYSTEMVALUES_HIVE;
    DBSYSTEMVALUES_CLOUDSCAPE = TMP_DBSYSTEMVALUES_CLOUDSCAPE;
    DBSYSTEMVALUES_HSQLDB = TMP_DBSYSTEMVALUES_HSQLDB;
    DBSYSTEMVALUES_PROGRESS = TMP_DBSYSTEMVALUES_PROGRESS;
    DBSYSTEMVALUES_MAXDB = TMP_DBSYSTEMVALUES_MAXDB;
    DBSYSTEMVALUES_HANADB = TMP_DBSYSTEMVALUES_HANADB;
    DBSYSTEMVALUES_INGRES = TMP_DBSYSTEMVALUES_INGRES;
    DBSYSTEMVALUES_FIRSTSQL = TMP_DBSYSTEMVALUES_FIRSTSQL;
    DBSYSTEMVALUES_EDB = TMP_DBSYSTEMVALUES_EDB;
    DBSYSTEMVALUES_CACHE = TMP_DBSYSTEMVALUES_CACHE;
    DBSYSTEMVALUES_ADABAS = TMP_DBSYSTEMVALUES_ADABAS;
    DBSYSTEMVALUES_FIREBIRD = TMP_DBSYSTEMVALUES_FIREBIRD;
    DBSYSTEMVALUES_DERBY = TMP_DBSYSTEMVALUES_DERBY;
    DBSYSTEMVALUES_FILEMAKER = TMP_DBSYSTEMVALUES_FILEMAKER;
    DBSYSTEMVALUES_INFORMIX = TMP_DBSYSTEMVALUES_INFORMIX;
    DBSYSTEMVALUES_INSTANTDB = TMP_DBSYSTEMVALUES_INSTANTDB;
    DBSYSTEMVALUES_INTERBASE = TMP_DBSYSTEMVALUES_INTERBASE;
    DBSYSTEMVALUES_MARIADB = TMP_DBSYSTEMVALUES_MARIADB;
    DBSYSTEMVALUES_NETEZZA = TMP_DBSYSTEMVALUES_NETEZZA;
    DBSYSTEMVALUES_PERVASIVE = TMP_DBSYSTEMVALUES_PERVASIVE;
    DBSYSTEMVALUES_POINTBASE = TMP_DBSYSTEMVALUES_POINTBASE;
    DBSYSTEMVALUES_SQLITE = TMP_DBSYSTEMVALUES_SQLITE;
    DBSYSTEMVALUES_SYBASE = TMP_DBSYSTEMVALUES_SYBASE;
    DBSYSTEMVALUES_TERADATA = TMP_DBSYSTEMVALUES_TERADATA;
    DBSYSTEMVALUES_VERTICA = TMP_DBSYSTEMVALUES_VERTICA;
    DBSYSTEMVALUES_H2 = TMP_DBSYSTEMVALUES_H2;
    DBSYSTEMVALUES_COLDFUSION = TMP_DBSYSTEMVALUES_COLDFUSION;
    DBSYSTEMVALUES_CASSANDRA = TMP_DBSYSTEMVALUES_CASSANDRA;
    DBSYSTEMVALUES_HBASE = TMP_DBSYSTEMVALUES_HBASE;
    DBSYSTEMVALUES_MONGODB = TMP_DBSYSTEMVALUES_MONGODB;
    DBSYSTEMVALUES_REDIS = TMP_DBSYSTEMVALUES_REDIS;
    DBSYSTEMVALUES_COUCHBASE = TMP_DBSYSTEMVALUES_COUCHBASE;
    DBSYSTEMVALUES_COUCHDB = TMP_DBSYSTEMVALUES_COUCHDB;
    DBSYSTEMVALUES_COSMOSDB = TMP_DBSYSTEMVALUES_COSMOSDB;
    DBSYSTEMVALUES_DYNAMODB = TMP_DBSYSTEMVALUES_DYNAMODB;
    DBSYSTEMVALUES_NEO4J = TMP_DBSYSTEMVALUES_NEO4J;
    DBSYSTEMVALUES_GEODE = TMP_DBSYSTEMVALUES_GEODE;
    DBSYSTEMVALUES_ELASTICSEARCH = TMP_DBSYSTEMVALUES_ELASTICSEARCH;
    DBSYSTEMVALUES_MEMCACHED = TMP_DBSYSTEMVALUES_MEMCACHED;
    DBSYSTEMVALUES_COCKROACHDB = TMP_DBSYSTEMVALUES_COCKROACHDB;
    DbSystemValues = /* @__PURE__ */ createConstMap([
      TMP_DBSYSTEMVALUES_OTHER_SQL,
      TMP_DBSYSTEMVALUES_MSSQL,
      TMP_DBSYSTEMVALUES_MYSQL,
      TMP_DBSYSTEMVALUES_ORACLE,
      TMP_DBSYSTEMVALUES_DB2,
      TMP_DBSYSTEMVALUES_POSTGRESQL,
      TMP_DBSYSTEMVALUES_REDSHIFT,
      TMP_DBSYSTEMVALUES_HIVE,
      TMP_DBSYSTEMVALUES_CLOUDSCAPE,
      TMP_DBSYSTEMVALUES_HSQLDB,
      TMP_DBSYSTEMVALUES_PROGRESS,
      TMP_DBSYSTEMVALUES_MAXDB,
      TMP_DBSYSTEMVALUES_HANADB,
      TMP_DBSYSTEMVALUES_INGRES,
      TMP_DBSYSTEMVALUES_FIRSTSQL,
      TMP_DBSYSTEMVALUES_EDB,
      TMP_DBSYSTEMVALUES_CACHE,
      TMP_DBSYSTEMVALUES_ADABAS,
      TMP_DBSYSTEMVALUES_FIREBIRD,
      TMP_DBSYSTEMVALUES_DERBY,
      TMP_DBSYSTEMVALUES_FILEMAKER,
      TMP_DBSYSTEMVALUES_INFORMIX,
      TMP_DBSYSTEMVALUES_INSTANTDB,
      TMP_DBSYSTEMVALUES_INTERBASE,
      TMP_DBSYSTEMVALUES_MARIADB,
      TMP_DBSYSTEMVALUES_NETEZZA,
      TMP_DBSYSTEMVALUES_PERVASIVE,
      TMP_DBSYSTEMVALUES_POINTBASE,
      TMP_DBSYSTEMVALUES_SQLITE,
      TMP_DBSYSTEMVALUES_SYBASE,
      TMP_DBSYSTEMVALUES_TERADATA,
      TMP_DBSYSTEMVALUES_VERTICA,
      TMP_DBSYSTEMVALUES_H2,
      TMP_DBSYSTEMVALUES_COLDFUSION,
      TMP_DBSYSTEMVALUES_CASSANDRA,
      TMP_DBSYSTEMVALUES_HBASE,
      TMP_DBSYSTEMVALUES_MONGODB,
      TMP_DBSYSTEMVALUES_REDIS,
      TMP_DBSYSTEMVALUES_COUCHBASE,
      TMP_DBSYSTEMVALUES_COUCHDB,
      TMP_DBSYSTEMVALUES_COSMOSDB,
      TMP_DBSYSTEMVALUES_DYNAMODB,
      TMP_DBSYSTEMVALUES_NEO4J,
      TMP_DBSYSTEMVALUES_GEODE,
      TMP_DBSYSTEMVALUES_ELASTICSEARCH,
      TMP_DBSYSTEMVALUES_MEMCACHED,
      TMP_DBSYSTEMVALUES_COCKROACHDB
    ]);
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL = "all";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = "each_quorum";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = "quorum";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = "local_quorum";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE = "one";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO = "two";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE = "three";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = "local_one";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY = "any";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = "serial";
    TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = "local_serial";
    DBCASSANDRACONSISTENCYLEVELVALUES_ALL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL;
    DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM;
    DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM;
    DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM;
    DBCASSANDRACONSISTENCYLEVELVALUES_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE;
    DBCASSANDRACONSISTENCYLEVELVALUES_TWO = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO;
    DBCASSANDRACONSISTENCYLEVELVALUES_THREE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE;
    DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE;
    DBCASSANDRACONSISTENCYLEVELVALUES_ANY = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY;
    DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL;
    DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL;
    DbCassandraConsistencyLevelValues = /* @__PURE__ */ createConstMap([
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ALL,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ONE,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_TWO,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_THREE,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_ANY,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL,
      TMP_DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL
    ]);
    TMP_FAASTRIGGERVALUES_DATASOURCE = "datasource";
    TMP_FAASTRIGGERVALUES_HTTP = "http";
    TMP_FAASTRIGGERVALUES_PUBSUB = "pubsub";
    TMP_FAASTRIGGERVALUES_TIMER = "timer";
    TMP_FAASTRIGGERVALUES_OTHER = "other";
    FAASTRIGGERVALUES_DATASOURCE = TMP_FAASTRIGGERVALUES_DATASOURCE;
    FAASTRIGGERVALUES_HTTP = TMP_FAASTRIGGERVALUES_HTTP;
    FAASTRIGGERVALUES_PUBSUB = TMP_FAASTRIGGERVALUES_PUBSUB;
    FAASTRIGGERVALUES_TIMER = TMP_FAASTRIGGERVALUES_TIMER;
    FAASTRIGGERVALUES_OTHER = TMP_FAASTRIGGERVALUES_OTHER;
    FaasTriggerValues = /* @__PURE__ */ createConstMap([
      TMP_FAASTRIGGERVALUES_DATASOURCE,
      TMP_FAASTRIGGERVALUES_HTTP,
      TMP_FAASTRIGGERVALUES_PUBSUB,
      TMP_FAASTRIGGERVALUES_TIMER,
      TMP_FAASTRIGGERVALUES_OTHER
    ]);
    TMP_FAASDOCUMENTOPERATIONVALUES_INSERT = "insert";
    TMP_FAASDOCUMENTOPERATIONVALUES_EDIT = "edit";
    TMP_FAASDOCUMENTOPERATIONVALUES_DELETE = "delete";
    FAASDOCUMENTOPERATIONVALUES_INSERT = TMP_FAASDOCUMENTOPERATIONVALUES_INSERT;
    FAASDOCUMENTOPERATIONVALUES_EDIT = TMP_FAASDOCUMENTOPERATIONVALUES_EDIT;
    FAASDOCUMENTOPERATIONVALUES_DELETE = TMP_FAASDOCUMENTOPERATIONVALUES_DELETE;
    FaasDocumentOperationValues = /* @__PURE__ */ createConstMap([
      TMP_FAASDOCUMENTOPERATIONVALUES_INSERT,
      TMP_FAASDOCUMENTOPERATIONVALUES_EDIT,
      TMP_FAASDOCUMENTOPERATIONVALUES_DELETE
    ]);
    TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
    TMP_FAASINVOKEDPROVIDERVALUES_AWS = "aws";
    TMP_FAASINVOKEDPROVIDERVALUES_AZURE = "azure";
    TMP_FAASINVOKEDPROVIDERVALUES_GCP = "gcp";
    FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD;
    FAASINVOKEDPROVIDERVALUES_AWS = TMP_FAASINVOKEDPROVIDERVALUES_AWS;
    FAASINVOKEDPROVIDERVALUES_AZURE = TMP_FAASINVOKEDPROVIDERVALUES_AZURE;
    FAASINVOKEDPROVIDERVALUES_GCP = TMP_FAASINVOKEDPROVIDERVALUES_GCP;
    FaasInvokedProviderValues = /* @__PURE__ */ createConstMap([
      TMP_FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD,
      TMP_FAASINVOKEDPROVIDERVALUES_AWS,
      TMP_FAASINVOKEDPROVIDERVALUES_AZURE,
      TMP_FAASINVOKEDPROVIDERVALUES_GCP
    ]);
    TMP_NETTRANSPORTVALUES_IP_TCP = "ip_tcp";
    TMP_NETTRANSPORTVALUES_IP_UDP = "ip_udp";
    TMP_NETTRANSPORTVALUES_IP = "ip";
    TMP_NETTRANSPORTVALUES_UNIX = "unix";
    TMP_NETTRANSPORTVALUES_PIPE = "pipe";
    TMP_NETTRANSPORTVALUES_INPROC = "inproc";
    TMP_NETTRANSPORTVALUES_OTHER = "other";
    NETTRANSPORTVALUES_IP_TCP = TMP_NETTRANSPORTVALUES_IP_TCP;
    NETTRANSPORTVALUES_IP_UDP = TMP_NETTRANSPORTVALUES_IP_UDP;
    NETTRANSPORTVALUES_IP = TMP_NETTRANSPORTVALUES_IP;
    NETTRANSPORTVALUES_UNIX = TMP_NETTRANSPORTVALUES_UNIX;
    NETTRANSPORTVALUES_PIPE = TMP_NETTRANSPORTVALUES_PIPE;
    NETTRANSPORTVALUES_INPROC = TMP_NETTRANSPORTVALUES_INPROC;
    NETTRANSPORTVALUES_OTHER = TMP_NETTRANSPORTVALUES_OTHER;
    NetTransportValues = /* @__PURE__ */ createConstMap([
      TMP_NETTRANSPORTVALUES_IP_TCP,
      TMP_NETTRANSPORTVALUES_IP_UDP,
      TMP_NETTRANSPORTVALUES_IP,
      TMP_NETTRANSPORTVALUES_UNIX,
      TMP_NETTRANSPORTVALUES_PIPE,
      TMP_NETTRANSPORTVALUES_INPROC,
      TMP_NETTRANSPORTVALUES_OTHER
    ]);
    TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI = "wifi";
    TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED = "wired";
    TMP_NETHOSTCONNECTIONTYPEVALUES_CELL = "cell";
    TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = "unavailable";
    TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = "unknown";
    NETHOSTCONNECTIONTYPEVALUES_WIFI = TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI;
    NETHOSTCONNECTIONTYPEVALUES_WIRED = TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED;
    NETHOSTCONNECTIONTYPEVALUES_CELL = TMP_NETHOSTCONNECTIONTYPEVALUES_CELL;
    NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE;
    NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN;
    NetHostConnectionTypeValues = /* @__PURE__ */ createConstMap([
      TMP_NETHOSTCONNECTIONTYPEVALUES_WIFI,
      TMP_NETHOSTCONNECTIONTYPEVALUES_WIRED,
      TMP_NETHOSTCONNECTIONTYPEVALUES_CELL,
      TMP_NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE,
      TMP_NETHOSTCONNECTIONTYPEVALUES_UNKNOWN
    ]);
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = "gprs";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = "edge";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = "umts";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = "cdma";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = "evdo_0";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = "evdo_a";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = "cdma2000_1xrtt";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = "hsdpa";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = "hsupa";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = "hspa";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = "iden";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = "evdo_b";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE = "lte";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = "ehrpd";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = "hspap";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM = "gsm";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = "td_scdma";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = "iwlan";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR = "nr";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = "nrnsa";
    TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = "lte_ca";
    NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS;
    NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE;
    NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS;
    NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA;
    NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0;
    NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A;
    NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT;
    NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA;
    NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA;
    NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA;
    NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN;
    NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B;
    NETHOSTCONNECTIONSUBTYPEVALUES_LTE = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE;
    NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD;
    NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP;
    NETHOSTCONNECTIONSUBTYPEVALUES_GSM = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM;
    NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA;
    NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN;
    NETHOSTCONNECTIONSUBTYPEVALUES_NR = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR;
    NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA;
    NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA;
    NetHostConnectionSubtypeValues = /* @__PURE__ */ createConstMap([
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GPRS,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EDGE,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_UMTS,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IDEN,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_GSM,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NR,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA,
      TMP_NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA
    ]);
    TMP_HTTPFLAVORVALUES_HTTP_1_0 = "1.0";
    TMP_HTTPFLAVORVALUES_HTTP_1_1 = "1.1";
    TMP_HTTPFLAVORVALUES_HTTP_2_0 = "2.0";
    TMP_HTTPFLAVORVALUES_SPDY = "SPDY";
    TMP_HTTPFLAVORVALUES_QUIC = "QUIC";
    HTTPFLAVORVALUES_HTTP_1_0 = TMP_HTTPFLAVORVALUES_HTTP_1_0;
    HTTPFLAVORVALUES_HTTP_1_1 = TMP_HTTPFLAVORVALUES_HTTP_1_1;
    HTTPFLAVORVALUES_HTTP_2_0 = TMP_HTTPFLAVORVALUES_HTTP_2_0;
    HTTPFLAVORVALUES_SPDY = TMP_HTTPFLAVORVALUES_SPDY;
    HTTPFLAVORVALUES_QUIC = TMP_HTTPFLAVORVALUES_QUIC;
    HttpFlavorValues = {
      HTTP_1_0: TMP_HTTPFLAVORVALUES_HTTP_1_0,
      HTTP_1_1: TMP_HTTPFLAVORVALUES_HTTP_1_1,
      HTTP_2_0: TMP_HTTPFLAVORVALUES_HTTP_2_0,
      SPDY: TMP_HTTPFLAVORVALUES_SPDY,
      QUIC: TMP_HTTPFLAVORVALUES_QUIC
    };
    TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE = "queue";
    TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC = "topic";
    MESSAGINGDESTINATIONKINDVALUES_QUEUE = TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE;
    MESSAGINGDESTINATIONKINDVALUES_TOPIC = TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC;
    MessagingDestinationKindValues = /* @__PURE__ */ createConstMap([
      TMP_MESSAGINGDESTINATIONKINDVALUES_QUEUE,
      TMP_MESSAGINGDESTINATIONKINDVALUES_TOPIC
    ]);
    TMP_MESSAGINGOPERATIONVALUES_RECEIVE = "receive";
    TMP_MESSAGINGOPERATIONVALUES_PROCESS = "process";
    MESSAGINGOPERATIONVALUES_RECEIVE = TMP_MESSAGINGOPERATIONVALUES_RECEIVE;
    MESSAGINGOPERATIONVALUES_PROCESS = TMP_MESSAGINGOPERATIONVALUES_PROCESS;
    MessagingOperationValues = /* @__PURE__ */ createConstMap([
      TMP_MESSAGINGOPERATIONVALUES_RECEIVE,
      TMP_MESSAGINGOPERATIONVALUES_PROCESS
    ]);
    TMP_RPCGRPCSTATUSCODEVALUES_OK = 0;
    TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED = 1;
    TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN = 2;
    TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = 3;
    TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = 4;
    TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND = 5;
    TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = 6;
    TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = 7;
    TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = 8;
    TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = 9;
    TMP_RPCGRPCSTATUSCODEVALUES_ABORTED = 10;
    TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = 11;
    TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = 12;
    TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL = 13;
    TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = 14;
    TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS = 15;
    TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = 16;
    RPCGRPCSTATUSCODEVALUES_OK = TMP_RPCGRPCSTATUSCODEVALUES_OK;
    RPCGRPCSTATUSCODEVALUES_CANCELLED = TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED;
    RPCGRPCSTATUSCODEVALUES_UNKNOWN = TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN;
    RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT;
    RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED;
    RPCGRPCSTATUSCODEVALUES_NOT_FOUND = TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND;
    RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS;
    RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED;
    RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED;
    RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION;
    RPCGRPCSTATUSCODEVALUES_ABORTED = TMP_RPCGRPCSTATUSCODEVALUES_ABORTED;
    RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE;
    RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED;
    RPCGRPCSTATUSCODEVALUES_INTERNAL = TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL;
    RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE;
    RPCGRPCSTATUSCODEVALUES_DATA_LOSS = TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS;
    RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED;
    RpcGrpcStatusCodeValues = {
      OK: TMP_RPCGRPCSTATUSCODEVALUES_OK,
      CANCELLED: TMP_RPCGRPCSTATUSCODEVALUES_CANCELLED,
      UNKNOWN: TMP_RPCGRPCSTATUSCODEVALUES_UNKNOWN,
      INVALID_ARGUMENT: TMP_RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT,
      DEADLINE_EXCEEDED: TMP_RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED,
      NOT_FOUND: TMP_RPCGRPCSTATUSCODEVALUES_NOT_FOUND,
      ALREADY_EXISTS: TMP_RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS,
      PERMISSION_DENIED: TMP_RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED,
      RESOURCE_EXHAUSTED: TMP_RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED,
      FAILED_PRECONDITION: TMP_RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION,
      ABORTED: TMP_RPCGRPCSTATUSCODEVALUES_ABORTED,
      OUT_OF_RANGE: TMP_RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE,
      UNIMPLEMENTED: TMP_RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED,
      INTERNAL: TMP_RPCGRPCSTATUSCODEVALUES_INTERNAL,
      UNAVAILABLE: TMP_RPCGRPCSTATUSCODEVALUES_UNAVAILABLE,
      DATA_LOSS: TMP_RPCGRPCSTATUSCODEVALUES_DATA_LOSS,
      UNAUTHENTICATED: TMP_RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED
    };
    TMP_MESSAGETYPEVALUES_SENT = "SENT";
    TMP_MESSAGETYPEVALUES_RECEIVED = "RECEIVED";
    MESSAGETYPEVALUES_SENT = TMP_MESSAGETYPEVALUES_SENT;
    MESSAGETYPEVALUES_RECEIVED = TMP_MESSAGETYPEVALUES_RECEIVED;
    MessageTypeValues = /* @__PURE__ */ createConstMap([
      TMP_MESSAGETYPEVALUES_SENT,
      TMP_MESSAGETYPEVALUES_RECEIVED
    ]);
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/trace/index.js
var init_trace = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/trace/index.js"() {
    init_esm();
    init_SemanticAttributes();
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/resource/SemanticResourceAttributes.js
var TMP_CLOUD_PROVIDER, TMP_CLOUD_ACCOUNT_ID, TMP_CLOUD_REGION, TMP_CLOUD_AVAILABILITY_ZONE, TMP_CLOUD_PLATFORM, TMP_AWS_ECS_CONTAINER_ARN, TMP_AWS_ECS_CLUSTER_ARN, TMP_AWS_ECS_LAUNCHTYPE, TMP_AWS_ECS_TASK_ARN, TMP_AWS_ECS_TASK_FAMILY, TMP_AWS_ECS_TASK_REVISION, TMP_AWS_EKS_CLUSTER_ARN, TMP_AWS_LOG_GROUP_NAMES, TMP_AWS_LOG_GROUP_ARNS, TMP_AWS_LOG_STREAM_NAMES, TMP_AWS_LOG_STREAM_ARNS, TMP_CONTAINER_NAME, TMP_CONTAINER_ID, TMP_CONTAINER_RUNTIME, TMP_CONTAINER_IMAGE_NAME, TMP_CONTAINER_IMAGE_TAG, TMP_DEPLOYMENT_ENVIRONMENT, TMP_DEVICE_ID, TMP_DEVICE_MODEL_IDENTIFIER, TMP_DEVICE_MODEL_NAME, TMP_FAAS_NAME, TMP_FAAS_ID, TMP_FAAS_VERSION, TMP_FAAS_INSTANCE, TMP_FAAS_MAX_MEMORY, TMP_HOST_ID, TMP_HOST_NAME, TMP_HOST_TYPE, TMP_HOST_ARCH, TMP_HOST_IMAGE_NAME, TMP_HOST_IMAGE_ID, TMP_HOST_IMAGE_VERSION, TMP_K8S_CLUSTER_NAME, TMP_K8S_NODE_NAME, TMP_K8S_NODE_UID, TMP_K8S_NAMESPACE_NAME, TMP_K8S_POD_UID, TMP_K8S_POD_NAME, TMP_K8S_CONTAINER_NAME, TMP_K8S_REPLICASET_UID, TMP_K8S_REPLICASET_NAME, TMP_K8S_DEPLOYMENT_UID, TMP_K8S_DEPLOYMENT_NAME, TMP_K8S_STATEFULSET_UID, TMP_K8S_STATEFULSET_NAME, TMP_K8S_DAEMONSET_UID, TMP_K8S_DAEMONSET_NAME, TMP_K8S_JOB_UID, TMP_K8S_JOB_NAME, TMP_K8S_CRONJOB_UID, TMP_K8S_CRONJOB_NAME, TMP_OS_TYPE, TMP_OS_DESCRIPTION, TMP_OS_NAME, TMP_OS_VERSION, TMP_PROCESS_PID, TMP_PROCESS_EXECUTABLE_NAME, TMP_PROCESS_EXECUTABLE_PATH, TMP_PROCESS_COMMAND, TMP_PROCESS_COMMAND_LINE, TMP_PROCESS_COMMAND_ARGS, TMP_PROCESS_OWNER, TMP_PROCESS_RUNTIME_NAME, TMP_PROCESS_RUNTIME_VERSION, TMP_PROCESS_RUNTIME_DESCRIPTION, TMP_SERVICE_NAME, TMP_SERVICE_NAMESPACE, TMP_SERVICE_INSTANCE_ID, TMP_SERVICE_VERSION, TMP_TELEMETRY_SDK_NAME, TMP_TELEMETRY_SDK_LANGUAGE, TMP_TELEMETRY_SDK_VERSION, TMP_TELEMETRY_AUTO_VERSION, TMP_WEBENGINE_NAME, TMP_WEBENGINE_VERSION, TMP_WEBENGINE_DESCRIPTION, SEMRESATTRS_CLOUD_PROVIDER, SEMRESATTRS_CLOUD_ACCOUNT_ID, SEMRESATTRS_CLOUD_REGION, SEMRESATTRS_CLOUD_AVAILABILITY_ZONE, SEMRESATTRS_CLOUD_PLATFORM, SEMRESATTRS_AWS_ECS_CONTAINER_ARN, SEMRESATTRS_AWS_ECS_CLUSTER_ARN, SEMRESATTRS_AWS_ECS_LAUNCHTYPE, SEMRESATTRS_AWS_ECS_TASK_ARN, SEMRESATTRS_AWS_ECS_TASK_FAMILY, SEMRESATTRS_AWS_ECS_TASK_REVISION, SEMRESATTRS_AWS_EKS_CLUSTER_ARN, SEMRESATTRS_AWS_LOG_GROUP_NAMES, SEMRESATTRS_AWS_LOG_GROUP_ARNS, SEMRESATTRS_AWS_LOG_STREAM_NAMES, SEMRESATTRS_AWS_LOG_STREAM_ARNS, SEMRESATTRS_CONTAINER_NAME, SEMRESATTRS_CONTAINER_ID, SEMRESATTRS_CONTAINER_RUNTIME, SEMRESATTRS_CONTAINER_IMAGE_NAME, SEMRESATTRS_CONTAINER_IMAGE_TAG, SEMRESATTRS_DEPLOYMENT_ENVIRONMENT, SEMRESATTRS_DEVICE_ID, SEMRESATTRS_DEVICE_MODEL_IDENTIFIER, SEMRESATTRS_DEVICE_MODEL_NAME, SEMRESATTRS_FAAS_NAME, SEMRESATTRS_FAAS_ID, SEMRESATTRS_FAAS_VERSION, SEMRESATTRS_FAAS_INSTANCE, SEMRESATTRS_FAAS_MAX_MEMORY, SEMRESATTRS_HOST_ID, SEMRESATTRS_HOST_NAME, SEMRESATTRS_HOST_TYPE, SEMRESATTRS_HOST_ARCH, SEMRESATTRS_HOST_IMAGE_NAME, SEMRESATTRS_HOST_IMAGE_ID, SEMRESATTRS_HOST_IMAGE_VERSION, SEMRESATTRS_K8S_CLUSTER_NAME, SEMRESATTRS_K8S_NODE_NAME, SEMRESATTRS_K8S_NODE_UID, SEMRESATTRS_K8S_NAMESPACE_NAME, SEMRESATTRS_K8S_POD_UID, SEMRESATTRS_K8S_POD_NAME, SEMRESATTRS_K8S_CONTAINER_NAME, SEMRESATTRS_K8S_REPLICASET_UID, SEMRESATTRS_K8S_REPLICASET_NAME, SEMRESATTRS_K8S_DEPLOYMENT_UID, SEMRESATTRS_K8S_DEPLOYMENT_NAME, SEMRESATTRS_K8S_STATEFULSET_UID, SEMRESATTRS_K8S_STATEFULSET_NAME, SEMRESATTRS_K8S_DAEMONSET_UID, SEMRESATTRS_K8S_DAEMONSET_NAME, SEMRESATTRS_K8S_JOB_UID, SEMRESATTRS_K8S_JOB_NAME, SEMRESATTRS_K8S_CRONJOB_UID, SEMRESATTRS_K8S_CRONJOB_NAME, SEMRESATTRS_OS_TYPE, SEMRESATTRS_OS_DESCRIPTION, SEMRESATTRS_OS_NAME, SEMRESATTRS_OS_VERSION, SEMRESATTRS_PROCESS_PID, SEMRESATTRS_PROCESS_EXECUTABLE_NAME, SEMRESATTRS_PROCESS_EXECUTABLE_PATH, SEMRESATTRS_PROCESS_COMMAND, SEMRESATTRS_PROCESS_COMMAND_LINE, SEMRESATTRS_PROCESS_COMMAND_ARGS, SEMRESATTRS_PROCESS_OWNER, SEMRESATTRS_PROCESS_RUNTIME_NAME, SEMRESATTRS_PROCESS_RUNTIME_VERSION, SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION, SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_NAMESPACE, SEMRESATTRS_SERVICE_INSTANCE_ID, SEMRESATTRS_SERVICE_VERSION, SEMRESATTRS_TELEMETRY_SDK_NAME, SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, SEMRESATTRS_TELEMETRY_SDK_VERSION, SEMRESATTRS_TELEMETRY_AUTO_VERSION, SEMRESATTRS_WEBENGINE_NAME, SEMRESATTRS_WEBENGINE_VERSION, SEMRESATTRS_WEBENGINE_DESCRIPTION, SemanticResourceAttributes, TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD, TMP_CLOUDPROVIDERVALUES_AWS, TMP_CLOUDPROVIDERVALUES_AZURE, TMP_CLOUDPROVIDERVALUES_GCP, CLOUDPROVIDERVALUES_ALIBABA_CLOUD, CLOUDPROVIDERVALUES_AWS, CLOUDPROVIDERVALUES_AZURE, CLOUDPROVIDERVALUES_GCP, CloudProviderValues, TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS, TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC, TMP_CLOUDPLATFORMVALUES_AWS_EC2, TMP_CLOUDPLATFORMVALUES_AWS_ECS, TMP_CLOUDPLATFORMVALUES_AWS_EKS, TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA, TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK, TMP_CLOUDPLATFORMVALUES_AZURE_VM, TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES, TMP_CLOUDPLATFORMVALUES_AZURE_AKS, TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS, TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE, TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE, TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN, TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE, TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS, TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS, CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC, CLOUDPLATFORMVALUES_AWS_EC2, CLOUDPLATFORMVALUES_AWS_ECS, CLOUDPLATFORMVALUES_AWS_EKS, CLOUDPLATFORMVALUES_AWS_LAMBDA, CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK, CLOUDPLATFORMVALUES_AZURE_VM, CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES, CLOUDPLATFORMVALUES_AZURE_AKS, CLOUDPLATFORMVALUES_AZURE_FUNCTIONS, CLOUDPLATFORMVALUES_AZURE_APP_SERVICE, CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE, CLOUDPLATFORMVALUES_GCP_CLOUD_RUN, CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE, CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS, CLOUDPLATFORMVALUES_GCP_APP_ENGINE, CloudPlatformValues, TMP_AWSECSLAUNCHTYPEVALUES_EC2, TMP_AWSECSLAUNCHTYPEVALUES_FARGATE, AWSECSLAUNCHTYPEVALUES_EC2, AWSECSLAUNCHTYPEVALUES_FARGATE, AwsEcsLaunchtypeValues, TMP_HOSTARCHVALUES_AMD64, TMP_HOSTARCHVALUES_ARM32, TMP_HOSTARCHVALUES_ARM64, TMP_HOSTARCHVALUES_IA64, TMP_HOSTARCHVALUES_PPC32, TMP_HOSTARCHVALUES_PPC64, TMP_HOSTARCHVALUES_X86, HOSTARCHVALUES_AMD64, HOSTARCHVALUES_ARM32, HOSTARCHVALUES_ARM64, HOSTARCHVALUES_IA64, HOSTARCHVALUES_PPC32, HOSTARCHVALUES_PPC64, HOSTARCHVALUES_X86, HostArchValues, TMP_OSTYPEVALUES_WINDOWS, TMP_OSTYPEVALUES_LINUX, TMP_OSTYPEVALUES_DARWIN, TMP_OSTYPEVALUES_FREEBSD, TMP_OSTYPEVALUES_NETBSD, TMP_OSTYPEVALUES_OPENBSD, TMP_OSTYPEVALUES_DRAGONFLYBSD, TMP_OSTYPEVALUES_HPUX, TMP_OSTYPEVALUES_AIX, TMP_OSTYPEVALUES_SOLARIS, TMP_OSTYPEVALUES_Z_OS, OSTYPEVALUES_WINDOWS, OSTYPEVALUES_LINUX, OSTYPEVALUES_DARWIN, OSTYPEVALUES_FREEBSD, OSTYPEVALUES_NETBSD, OSTYPEVALUES_OPENBSD, OSTYPEVALUES_DRAGONFLYBSD, OSTYPEVALUES_HPUX, OSTYPEVALUES_AIX, OSTYPEVALUES_SOLARIS, OSTYPEVALUES_Z_OS, OsTypeValues, TMP_TELEMETRYSDKLANGUAGEVALUES_CPP, TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET, TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG, TMP_TELEMETRYSDKLANGUAGEVALUES_GO, TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA, TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS, TMP_TELEMETRYSDKLANGUAGEVALUES_PHP, TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON, TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY, TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS, TELEMETRYSDKLANGUAGEVALUES_CPP, TELEMETRYSDKLANGUAGEVALUES_DOTNET, TELEMETRYSDKLANGUAGEVALUES_ERLANG, TELEMETRYSDKLANGUAGEVALUES_GO, TELEMETRYSDKLANGUAGEVALUES_JAVA, TELEMETRYSDKLANGUAGEVALUES_NODEJS, TELEMETRYSDKLANGUAGEVALUES_PHP, TELEMETRYSDKLANGUAGEVALUES_PYTHON, TELEMETRYSDKLANGUAGEVALUES_RUBY, TELEMETRYSDKLANGUAGEVALUES_WEBJS, TelemetrySdkLanguageValues;
var init_SemanticResourceAttributes = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/resource/SemanticResourceAttributes.js"() {
    init_esm();
    init_utils();
    TMP_CLOUD_PROVIDER = "cloud.provider";
    TMP_CLOUD_ACCOUNT_ID = "cloud.account.id";
    TMP_CLOUD_REGION = "cloud.region";
    TMP_CLOUD_AVAILABILITY_ZONE = "cloud.availability_zone";
    TMP_CLOUD_PLATFORM = "cloud.platform";
    TMP_AWS_ECS_CONTAINER_ARN = "aws.ecs.container.arn";
    TMP_AWS_ECS_CLUSTER_ARN = "aws.ecs.cluster.arn";
    TMP_AWS_ECS_LAUNCHTYPE = "aws.ecs.launchtype";
    TMP_AWS_ECS_TASK_ARN = "aws.ecs.task.arn";
    TMP_AWS_ECS_TASK_FAMILY = "aws.ecs.task.family";
    TMP_AWS_ECS_TASK_REVISION = "aws.ecs.task.revision";
    TMP_AWS_EKS_CLUSTER_ARN = "aws.eks.cluster.arn";
    TMP_AWS_LOG_GROUP_NAMES = "aws.log.group.names";
    TMP_AWS_LOG_GROUP_ARNS = "aws.log.group.arns";
    TMP_AWS_LOG_STREAM_NAMES = "aws.log.stream.names";
    TMP_AWS_LOG_STREAM_ARNS = "aws.log.stream.arns";
    TMP_CONTAINER_NAME = "container.name";
    TMP_CONTAINER_ID = "container.id";
    TMP_CONTAINER_RUNTIME = "container.runtime";
    TMP_CONTAINER_IMAGE_NAME = "container.image.name";
    TMP_CONTAINER_IMAGE_TAG = "container.image.tag";
    TMP_DEPLOYMENT_ENVIRONMENT = "deployment.environment";
    TMP_DEVICE_ID = "device.id";
    TMP_DEVICE_MODEL_IDENTIFIER = "device.model.identifier";
    TMP_DEVICE_MODEL_NAME = "device.model.name";
    TMP_FAAS_NAME = "faas.name";
    TMP_FAAS_ID = "faas.id";
    TMP_FAAS_VERSION = "faas.version";
    TMP_FAAS_INSTANCE = "faas.instance";
    TMP_FAAS_MAX_MEMORY = "faas.max_memory";
    TMP_HOST_ID = "host.id";
    TMP_HOST_NAME = "host.name";
    TMP_HOST_TYPE = "host.type";
    TMP_HOST_ARCH = "host.arch";
    TMP_HOST_IMAGE_NAME = "host.image.name";
    TMP_HOST_IMAGE_ID = "host.image.id";
    TMP_HOST_IMAGE_VERSION = "host.image.version";
    TMP_K8S_CLUSTER_NAME = "k8s.cluster.name";
    TMP_K8S_NODE_NAME = "k8s.node.name";
    TMP_K8S_NODE_UID = "k8s.node.uid";
    TMP_K8S_NAMESPACE_NAME = "k8s.namespace.name";
    TMP_K8S_POD_UID = "k8s.pod.uid";
    TMP_K8S_POD_NAME = "k8s.pod.name";
    TMP_K8S_CONTAINER_NAME = "k8s.container.name";
    TMP_K8S_REPLICASET_UID = "k8s.replicaset.uid";
    TMP_K8S_REPLICASET_NAME = "k8s.replicaset.name";
    TMP_K8S_DEPLOYMENT_UID = "k8s.deployment.uid";
    TMP_K8S_DEPLOYMENT_NAME = "k8s.deployment.name";
    TMP_K8S_STATEFULSET_UID = "k8s.statefulset.uid";
    TMP_K8S_STATEFULSET_NAME = "k8s.statefulset.name";
    TMP_K8S_DAEMONSET_UID = "k8s.daemonset.uid";
    TMP_K8S_DAEMONSET_NAME = "k8s.daemonset.name";
    TMP_K8S_JOB_UID = "k8s.job.uid";
    TMP_K8S_JOB_NAME = "k8s.job.name";
    TMP_K8S_CRONJOB_UID = "k8s.cronjob.uid";
    TMP_K8S_CRONJOB_NAME = "k8s.cronjob.name";
    TMP_OS_TYPE = "os.type";
    TMP_OS_DESCRIPTION = "os.description";
    TMP_OS_NAME = "os.name";
    TMP_OS_VERSION = "os.version";
    TMP_PROCESS_PID = "process.pid";
    TMP_PROCESS_EXECUTABLE_NAME = "process.executable.name";
    TMP_PROCESS_EXECUTABLE_PATH = "process.executable.path";
    TMP_PROCESS_COMMAND = "process.command";
    TMP_PROCESS_COMMAND_LINE = "process.command_line";
    TMP_PROCESS_COMMAND_ARGS = "process.command_args";
    TMP_PROCESS_OWNER = "process.owner";
    TMP_PROCESS_RUNTIME_NAME = "process.runtime.name";
    TMP_PROCESS_RUNTIME_VERSION = "process.runtime.version";
    TMP_PROCESS_RUNTIME_DESCRIPTION = "process.runtime.description";
    TMP_SERVICE_NAME = "service.name";
    TMP_SERVICE_NAMESPACE = "service.namespace";
    TMP_SERVICE_INSTANCE_ID = "service.instance.id";
    TMP_SERVICE_VERSION = "service.version";
    TMP_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
    TMP_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
    TMP_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
    TMP_TELEMETRY_AUTO_VERSION = "telemetry.auto.version";
    TMP_WEBENGINE_NAME = "webengine.name";
    TMP_WEBENGINE_VERSION = "webengine.version";
    TMP_WEBENGINE_DESCRIPTION = "webengine.description";
    SEMRESATTRS_CLOUD_PROVIDER = TMP_CLOUD_PROVIDER;
    SEMRESATTRS_CLOUD_ACCOUNT_ID = TMP_CLOUD_ACCOUNT_ID;
    SEMRESATTRS_CLOUD_REGION = TMP_CLOUD_REGION;
    SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = TMP_CLOUD_AVAILABILITY_ZONE;
    SEMRESATTRS_CLOUD_PLATFORM = TMP_CLOUD_PLATFORM;
    SEMRESATTRS_AWS_ECS_CONTAINER_ARN = TMP_AWS_ECS_CONTAINER_ARN;
    SEMRESATTRS_AWS_ECS_CLUSTER_ARN = TMP_AWS_ECS_CLUSTER_ARN;
    SEMRESATTRS_AWS_ECS_LAUNCHTYPE = TMP_AWS_ECS_LAUNCHTYPE;
    SEMRESATTRS_AWS_ECS_TASK_ARN = TMP_AWS_ECS_TASK_ARN;
    SEMRESATTRS_AWS_ECS_TASK_FAMILY = TMP_AWS_ECS_TASK_FAMILY;
    SEMRESATTRS_AWS_ECS_TASK_REVISION = TMP_AWS_ECS_TASK_REVISION;
    SEMRESATTRS_AWS_EKS_CLUSTER_ARN = TMP_AWS_EKS_CLUSTER_ARN;
    SEMRESATTRS_AWS_LOG_GROUP_NAMES = TMP_AWS_LOG_GROUP_NAMES;
    SEMRESATTRS_AWS_LOG_GROUP_ARNS = TMP_AWS_LOG_GROUP_ARNS;
    SEMRESATTRS_AWS_LOG_STREAM_NAMES = TMP_AWS_LOG_STREAM_NAMES;
    SEMRESATTRS_AWS_LOG_STREAM_ARNS = TMP_AWS_LOG_STREAM_ARNS;
    SEMRESATTRS_CONTAINER_NAME = TMP_CONTAINER_NAME;
    SEMRESATTRS_CONTAINER_ID = TMP_CONTAINER_ID;
    SEMRESATTRS_CONTAINER_RUNTIME = TMP_CONTAINER_RUNTIME;
    SEMRESATTRS_CONTAINER_IMAGE_NAME = TMP_CONTAINER_IMAGE_NAME;
    SEMRESATTRS_CONTAINER_IMAGE_TAG = TMP_CONTAINER_IMAGE_TAG;
    SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = TMP_DEPLOYMENT_ENVIRONMENT;
    SEMRESATTRS_DEVICE_ID = TMP_DEVICE_ID;
    SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = TMP_DEVICE_MODEL_IDENTIFIER;
    SEMRESATTRS_DEVICE_MODEL_NAME = TMP_DEVICE_MODEL_NAME;
    SEMRESATTRS_FAAS_NAME = TMP_FAAS_NAME;
    SEMRESATTRS_FAAS_ID = TMP_FAAS_ID;
    SEMRESATTRS_FAAS_VERSION = TMP_FAAS_VERSION;
    SEMRESATTRS_FAAS_INSTANCE = TMP_FAAS_INSTANCE;
    SEMRESATTRS_FAAS_MAX_MEMORY = TMP_FAAS_MAX_MEMORY;
    SEMRESATTRS_HOST_ID = TMP_HOST_ID;
    SEMRESATTRS_HOST_NAME = TMP_HOST_NAME;
    SEMRESATTRS_HOST_TYPE = TMP_HOST_TYPE;
    SEMRESATTRS_HOST_ARCH = TMP_HOST_ARCH;
    SEMRESATTRS_HOST_IMAGE_NAME = TMP_HOST_IMAGE_NAME;
    SEMRESATTRS_HOST_IMAGE_ID = TMP_HOST_IMAGE_ID;
    SEMRESATTRS_HOST_IMAGE_VERSION = TMP_HOST_IMAGE_VERSION;
    SEMRESATTRS_K8S_CLUSTER_NAME = TMP_K8S_CLUSTER_NAME;
    SEMRESATTRS_K8S_NODE_NAME = TMP_K8S_NODE_NAME;
    SEMRESATTRS_K8S_NODE_UID = TMP_K8S_NODE_UID;
    SEMRESATTRS_K8S_NAMESPACE_NAME = TMP_K8S_NAMESPACE_NAME;
    SEMRESATTRS_K8S_POD_UID = TMP_K8S_POD_UID;
    SEMRESATTRS_K8S_POD_NAME = TMP_K8S_POD_NAME;
    SEMRESATTRS_K8S_CONTAINER_NAME = TMP_K8S_CONTAINER_NAME;
    SEMRESATTRS_K8S_REPLICASET_UID = TMP_K8S_REPLICASET_UID;
    SEMRESATTRS_K8S_REPLICASET_NAME = TMP_K8S_REPLICASET_NAME;
    SEMRESATTRS_K8S_DEPLOYMENT_UID = TMP_K8S_DEPLOYMENT_UID;
    SEMRESATTRS_K8S_DEPLOYMENT_NAME = TMP_K8S_DEPLOYMENT_NAME;
    SEMRESATTRS_K8S_STATEFULSET_UID = TMP_K8S_STATEFULSET_UID;
    SEMRESATTRS_K8S_STATEFULSET_NAME = TMP_K8S_STATEFULSET_NAME;
    SEMRESATTRS_K8S_DAEMONSET_UID = TMP_K8S_DAEMONSET_UID;
    SEMRESATTRS_K8S_DAEMONSET_NAME = TMP_K8S_DAEMONSET_NAME;
    SEMRESATTRS_K8S_JOB_UID = TMP_K8S_JOB_UID;
    SEMRESATTRS_K8S_JOB_NAME = TMP_K8S_JOB_NAME;
    SEMRESATTRS_K8S_CRONJOB_UID = TMP_K8S_CRONJOB_UID;
    SEMRESATTRS_K8S_CRONJOB_NAME = TMP_K8S_CRONJOB_NAME;
    SEMRESATTRS_OS_TYPE = TMP_OS_TYPE;
    SEMRESATTRS_OS_DESCRIPTION = TMP_OS_DESCRIPTION;
    SEMRESATTRS_OS_NAME = TMP_OS_NAME;
    SEMRESATTRS_OS_VERSION = TMP_OS_VERSION;
    SEMRESATTRS_PROCESS_PID = TMP_PROCESS_PID;
    SEMRESATTRS_PROCESS_EXECUTABLE_NAME = TMP_PROCESS_EXECUTABLE_NAME;
    SEMRESATTRS_PROCESS_EXECUTABLE_PATH = TMP_PROCESS_EXECUTABLE_PATH;
    SEMRESATTRS_PROCESS_COMMAND = TMP_PROCESS_COMMAND;
    SEMRESATTRS_PROCESS_COMMAND_LINE = TMP_PROCESS_COMMAND_LINE;
    SEMRESATTRS_PROCESS_COMMAND_ARGS = TMP_PROCESS_COMMAND_ARGS;
    SEMRESATTRS_PROCESS_OWNER = TMP_PROCESS_OWNER;
    SEMRESATTRS_PROCESS_RUNTIME_NAME = TMP_PROCESS_RUNTIME_NAME;
    SEMRESATTRS_PROCESS_RUNTIME_VERSION = TMP_PROCESS_RUNTIME_VERSION;
    SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = TMP_PROCESS_RUNTIME_DESCRIPTION;
    SEMRESATTRS_SERVICE_NAME = TMP_SERVICE_NAME;
    SEMRESATTRS_SERVICE_NAMESPACE = TMP_SERVICE_NAMESPACE;
    SEMRESATTRS_SERVICE_INSTANCE_ID = TMP_SERVICE_INSTANCE_ID;
    SEMRESATTRS_SERVICE_VERSION = TMP_SERVICE_VERSION;
    SEMRESATTRS_TELEMETRY_SDK_NAME = TMP_TELEMETRY_SDK_NAME;
    SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = TMP_TELEMETRY_SDK_LANGUAGE;
    SEMRESATTRS_TELEMETRY_SDK_VERSION = TMP_TELEMETRY_SDK_VERSION;
    SEMRESATTRS_TELEMETRY_AUTO_VERSION = TMP_TELEMETRY_AUTO_VERSION;
    SEMRESATTRS_WEBENGINE_NAME = TMP_WEBENGINE_NAME;
    SEMRESATTRS_WEBENGINE_VERSION = TMP_WEBENGINE_VERSION;
    SEMRESATTRS_WEBENGINE_DESCRIPTION = TMP_WEBENGINE_DESCRIPTION;
    SemanticResourceAttributes = /* @__PURE__ */ createConstMap([
      TMP_CLOUD_PROVIDER,
      TMP_CLOUD_ACCOUNT_ID,
      TMP_CLOUD_REGION,
      TMP_CLOUD_AVAILABILITY_ZONE,
      TMP_CLOUD_PLATFORM,
      TMP_AWS_ECS_CONTAINER_ARN,
      TMP_AWS_ECS_CLUSTER_ARN,
      TMP_AWS_ECS_LAUNCHTYPE,
      TMP_AWS_ECS_TASK_ARN,
      TMP_AWS_ECS_TASK_FAMILY,
      TMP_AWS_ECS_TASK_REVISION,
      TMP_AWS_EKS_CLUSTER_ARN,
      TMP_AWS_LOG_GROUP_NAMES,
      TMP_AWS_LOG_GROUP_ARNS,
      TMP_AWS_LOG_STREAM_NAMES,
      TMP_AWS_LOG_STREAM_ARNS,
      TMP_CONTAINER_NAME,
      TMP_CONTAINER_ID,
      TMP_CONTAINER_RUNTIME,
      TMP_CONTAINER_IMAGE_NAME,
      TMP_CONTAINER_IMAGE_TAG,
      TMP_DEPLOYMENT_ENVIRONMENT,
      TMP_DEVICE_ID,
      TMP_DEVICE_MODEL_IDENTIFIER,
      TMP_DEVICE_MODEL_NAME,
      TMP_FAAS_NAME,
      TMP_FAAS_ID,
      TMP_FAAS_VERSION,
      TMP_FAAS_INSTANCE,
      TMP_FAAS_MAX_MEMORY,
      TMP_HOST_ID,
      TMP_HOST_NAME,
      TMP_HOST_TYPE,
      TMP_HOST_ARCH,
      TMP_HOST_IMAGE_NAME,
      TMP_HOST_IMAGE_ID,
      TMP_HOST_IMAGE_VERSION,
      TMP_K8S_CLUSTER_NAME,
      TMP_K8S_NODE_NAME,
      TMP_K8S_NODE_UID,
      TMP_K8S_NAMESPACE_NAME,
      TMP_K8S_POD_UID,
      TMP_K8S_POD_NAME,
      TMP_K8S_CONTAINER_NAME,
      TMP_K8S_REPLICASET_UID,
      TMP_K8S_REPLICASET_NAME,
      TMP_K8S_DEPLOYMENT_UID,
      TMP_K8S_DEPLOYMENT_NAME,
      TMP_K8S_STATEFULSET_UID,
      TMP_K8S_STATEFULSET_NAME,
      TMP_K8S_DAEMONSET_UID,
      TMP_K8S_DAEMONSET_NAME,
      TMP_K8S_JOB_UID,
      TMP_K8S_JOB_NAME,
      TMP_K8S_CRONJOB_UID,
      TMP_K8S_CRONJOB_NAME,
      TMP_OS_TYPE,
      TMP_OS_DESCRIPTION,
      TMP_OS_NAME,
      TMP_OS_VERSION,
      TMP_PROCESS_PID,
      TMP_PROCESS_EXECUTABLE_NAME,
      TMP_PROCESS_EXECUTABLE_PATH,
      TMP_PROCESS_COMMAND,
      TMP_PROCESS_COMMAND_LINE,
      TMP_PROCESS_COMMAND_ARGS,
      TMP_PROCESS_OWNER,
      TMP_PROCESS_RUNTIME_NAME,
      TMP_PROCESS_RUNTIME_VERSION,
      TMP_PROCESS_RUNTIME_DESCRIPTION,
      TMP_SERVICE_NAME,
      TMP_SERVICE_NAMESPACE,
      TMP_SERVICE_INSTANCE_ID,
      TMP_SERVICE_VERSION,
      TMP_TELEMETRY_SDK_NAME,
      TMP_TELEMETRY_SDK_LANGUAGE,
      TMP_TELEMETRY_SDK_VERSION,
      TMP_TELEMETRY_AUTO_VERSION,
      TMP_WEBENGINE_NAME,
      TMP_WEBENGINE_VERSION,
      TMP_WEBENGINE_DESCRIPTION
    ]);
    TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD = "alibaba_cloud";
    TMP_CLOUDPROVIDERVALUES_AWS = "aws";
    TMP_CLOUDPROVIDERVALUES_AZURE = "azure";
    TMP_CLOUDPROVIDERVALUES_GCP = "gcp";
    CLOUDPROVIDERVALUES_ALIBABA_CLOUD = TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD;
    CLOUDPROVIDERVALUES_AWS = TMP_CLOUDPROVIDERVALUES_AWS;
    CLOUDPROVIDERVALUES_AZURE = TMP_CLOUDPROVIDERVALUES_AZURE;
    CLOUDPROVIDERVALUES_GCP = TMP_CLOUDPROVIDERVALUES_GCP;
    CloudProviderValues = /* @__PURE__ */ createConstMap([
      TMP_CLOUDPROVIDERVALUES_ALIBABA_CLOUD,
      TMP_CLOUDPROVIDERVALUES_AWS,
      TMP_CLOUDPROVIDERVALUES_AZURE,
      TMP_CLOUDPROVIDERVALUES_GCP
    ]);
    TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = "alibaba_cloud_ecs";
    TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = "alibaba_cloud_fc";
    TMP_CLOUDPLATFORMVALUES_AWS_EC2 = "aws_ec2";
    TMP_CLOUDPLATFORMVALUES_AWS_ECS = "aws_ecs";
    TMP_CLOUDPLATFORMVALUES_AWS_EKS = "aws_eks";
    TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA = "aws_lambda";
    TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = "aws_elastic_beanstalk";
    TMP_CLOUDPLATFORMVALUES_AZURE_VM = "azure_vm";
    TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = "azure_container_instances";
    TMP_CLOUDPLATFORMVALUES_AZURE_AKS = "azure_aks";
    TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = "azure_functions";
    TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = "azure_app_service";
    TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = "gcp_compute_engine";
    TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = "gcp_cloud_run";
    TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = "gcp_kubernetes_engine";
    TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = "gcp_cloud_functions";
    TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE = "gcp_app_engine";
    CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS;
    CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC;
    CLOUDPLATFORMVALUES_AWS_EC2 = TMP_CLOUDPLATFORMVALUES_AWS_EC2;
    CLOUDPLATFORMVALUES_AWS_ECS = TMP_CLOUDPLATFORMVALUES_AWS_ECS;
    CLOUDPLATFORMVALUES_AWS_EKS = TMP_CLOUDPLATFORMVALUES_AWS_EKS;
    CLOUDPLATFORMVALUES_AWS_LAMBDA = TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA;
    CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK;
    CLOUDPLATFORMVALUES_AZURE_VM = TMP_CLOUDPLATFORMVALUES_AZURE_VM;
    CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES;
    CLOUDPLATFORMVALUES_AZURE_AKS = TMP_CLOUDPLATFORMVALUES_AZURE_AKS;
    CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS;
    CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE;
    CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE;
    CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN;
    CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE;
    CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS;
    CLOUDPLATFORMVALUES_GCP_APP_ENGINE = TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE;
    CloudPlatformValues = /* @__PURE__ */ createConstMap([
      TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS,
      TMP_CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC,
      TMP_CLOUDPLATFORMVALUES_AWS_EC2,
      TMP_CLOUDPLATFORMVALUES_AWS_ECS,
      TMP_CLOUDPLATFORMVALUES_AWS_EKS,
      TMP_CLOUDPLATFORMVALUES_AWS_LAMBDA,
      TMP_CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK,
      TMP_CLOUDPLATFORMVALUES_AZURE_VM,
      TMP_CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES,
      TMP_CLOUDPLATFORMVALUES_AZURE_AKS,
      TMP_CLOUDPLATFORMVALUES_AZURE_FUNCTIONS,
      TMP_CLOUDPLATFORMVALUES_AZURE_APP_SERVICE,
      TMP_CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE,
      TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_RUN,
      TMP_CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE,
      TMP_CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS,
      TMP_CLOUDPLATFORMVALUES_GCP_APP_ENGINE
    ]);
    TMP_AWSECSLAUNCHTYPEVALUES_EC2 = "ec2";
    TMP_AWSECSLAUNCHTYPEVALUES_FARGATE = "fargate";
    AWSECSLAUNCHTYPEVALUES_EC2 = TMP_AWSECSLAUNCHTYPEVALUES_EC2;
    AWSECSLAUNCHTYPEVALUES_FARGATE = TMP_AWSECSLAUNCHTYPEVALUES_FARGATE;
    AwsEcsLaunchtypeValues = /* @__PURE__ */ createConstMap([
      TMP_AWSECSLAUNCHTYPEVALUES_EC2,
      TMP_AWSECSLAUNCHTYPEVALUES_FARGATE
    ]);
    TMP_HOSTARCHVALUES_AMD64 = "amd64";
    TMP_HOSTARCHVALUES_ARM32 = "arm32";
    TMP_HOSTARCHVALUES_ARM64 = "arm64";
    TMP_HOSTARCHVALUES_IA64 = "ia64";
    TMP_HOSTARCHVALUES_PPC32 = "ppc32";
    TMP_HOSTARCHVALUES_PPC64 = "ppc64";
    TMP_HOSTARCHVALUES_X86 = "x86";
    HOSTARCHVALUES_AMD64 = TMP_HOSTARCHVALUES_AMD64;
    HOSTARCHVALUES_ARM32 = TMP_HOSTARCHVALUES_ARM32;
    HOSTARCHVALUES_ARM64 = TMP_HOSTARCHVALUES_ARM64;
    HOSTARCHVALUES_IA64 = TMP_HOSTARCHVALUES_IA64;
    HOSTARCHVALUES_PPC32 = TMP_HOSTARCHVALUES_PPC32;
    HOSTARCHVALUES_PPC64 = TMP_HOSTARCHVALUES_PPC64;
    HOSTARCHVALUES_X86 = TMP_HOSTARCHVALUES_X86;
    HostArchValues = /* @__PURE__ */ createConstMap([
      TMP_HOSTARCHVALUES_AMD64,
      TMP_HOSTARCHVALUES_ARM32,
      TMP_HOSTARCHVALUES_ARM64,
      TMP_HOSTARCHVALUES_IA64,
      TMP_HOSTARCHVALUES_PPC32,
      TMP_HOSTARCHVALUES_PPC64,
      TMP_HOSTARCHVALUES_X86
    ]);
    TMP_OSTYPEVALUES_WINDOWS = "windows";
    TMP_OSTYPEVALUES_LINUX = "linux";
    TMP_OSTYPEVALUES_DARWIN = "darwin";
    TMP_OSTYPEVALUES_FREEBSD = "freebsd";
    TMP_OSTYPEVALUES_NETBSD = "netbsd";
    TMP_OSTYPEVALUES_OPENBSD = "openbsd";
    TMP_OSTYPEVALUES_DRAGONFLYBSD = "dragonflybsd";
    TMP_OSTYPEVALUES_HPUX = "hpux";
    TMP_OSTYPEVALUES_AIX = "aix";
    TMP_OSTYPEVALUES_SOLARIS = "solaris";
    TMP_OSTYPEVALUES_Z_OS = "z_os";
    OSTYPEVALUES_WINDOWS = TMP_OSTYPEVALUES_WINDOWS;
    OSTYPEVALUES_LINUX = TMP_OSTYPEVALUES_LINUX;
    OSTYPEVALUES_DARWIN = TMP_OSTYPEVALUES_DARWIN;
    OSTYPEVALUES_FREEBSD = TMP_OSTYPEVALUES_FREEBSD;
    OSTYPEVALUES_NETBSD = TMP_OSTYPEVALUES_NETBSD;
    OSTYPEVALUES_OPENBSD = TMP_OSTYPEVALUES_OPENBSD;
    OSTYPEVALUES_DRAGONFLYBSD = TMP_OSTYPEVALUES_DRAGONFLYBSD;
    OSTYPEVALUES_HPUX = TMP_OSTYPEVALUES_HPUX;
    OSTYPEVALUES_AIX = TMP_OSTYPEVALUES_AIX;
    OSTYPEVALUES_SOLARIS = TMP_OSTYPEVALUES_SOLARIS;
    OSTYPEVALUES_Z_OS = TMP_OSTYPEVALUES_Z_OS;
    OsTypeValues = /* @__PURE__ */ createConstMap([
      TMP_OSTYPEVALUES_WINDOWS,
      TMP_OSTYPEVALUES_LINUX,
      TMP_OSTYPEVALUES_DARWIN,
      TMP_OSTYPEVALUES_FREEBSD,
      TMP_OSTYPEVALUES_NETBSD,
      TMP_OSTYPEVALUES_OPENBSD,
      TMP_OSTYPEVALUES_DRAGONFLYBSD,
      TMP_OSTYPEVALUES_HPUX,
      TMP_OSTYPEVALUES_AIX,
      TMP_OSTYPEVALUES_SOLARIS,
      TMP_OSTYPEVALUES_Z_OS
    ]);
    TMP_TELEMETRYSDKLANGUAGEVALUES_CPP = "cpp";
    TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET = "dotnet";
    TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG = "erlang";
    TMP_TELEMETRYSDKLANGUAGEVALUES_GO = "go";
    TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA = "java";
    TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS = "nodejs";
    TMP_TELEMETRYSDKLANGUAGEVALUES_PHP = "php";
    TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON = "python";
    TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY = "ruby";
    TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS = "webjs";
    TELEMETRYSDKLANGUAGEVALUES_CPP = TMP_TELEMETRYSDKLANGUAGEVALUES_CPP;
    TELEMETRYSDKLANGUAGEVALUES_DOTNET = TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET;
    TELEMETRYSDKLANGUAGEVALUES_ERLANG = TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG;
    TELEMETRYSDKLANGUAGEVALUES_GO = TMP_TELEMETRYSDKLANGUAGEVALUES_GO;
    TELEMETRYSDKLANGUAGEVALUES_JAVA = TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA;
    TELEMETRYSDKLANGUAGEVALUES_NODEJS = TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS;
    TELEMETRYSDKLANGUAGEVALUES_PHP = TMP_TELEMETRYSDKLANGUAGEVALUES_PHP;
    TELEMETRYSDKLANGUAGEVALUES_PYTHON = TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON;
    TELEMETRYSDKLANGUAGEVALUES_RUBY = TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY;
    TELEMETRYSDKLANGUAGEVALUES_WEBJS = TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS;
    TelemetrySdkLanguageValues = /* @__PURE__ */ createConstMap([
      TMP_TELEMETRYSDKLANGUAGEVALUES_CPP,
      TMP_TELEMETRYSDKLANGUAGEVALUES_DOTNET,
      TMP_TELEMETRYSDKLANGUAGEVALUES_ERLANG,
      TMP_TELEMETRYSDKLANGUAGEVALUES_GO,
      TMP_TELEMETRYSDKLANGUAGEVALUES_JAVA,
      TMP_TELEMETRYSDKLANGUAGEVALUES_NODEJS,
      TMP_TELEMETRYSDKLANGUAGEVALUES_PHP,
      TMP_TELEMETRYSDKLANGUAGEVALUES_PYTHON,
      TMP_TELEMETRYSDKLANGUAGEVALUES_RUBY,
      TMP_TELEMETRYSDKLANGUAGEVALUES_WEBJS
    ]);
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/resource/index.js
var init_resource = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/resource/index.js"() {
    init_esm();
    init_SemanticResourceAttributes();
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js
var ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED, ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED, ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE, ATTR_ASPNETCORE_RATE_LIMITING_POLICY, ATTR_ASPNETCORE_RATE_LIMITING_RESULT, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER, ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED, ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED, ATTR_ASPNETCORE_ROUTING_IS_FALLBACK, ATTR_ASPNETCORE_ROUTING_MATCH_STATUS, ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE, ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS, ATTR_ASPNETCORE_USER_IS_AUTHENTICATED, ATTR_CLIENT_ADDRESS, ATTR_CLIENT_PORT, ATTR_CODE_COLUMN_NUMBER, ATTR_CODE_FILE_PATH, ATTR_CODE_FUNCTION_NAME, ATTR_CODE_LINE_NUMBER, ATTR_CODE_STACKTRACE, ATTR_DB_COLLECTION_NAME, ATTR_DB_NAMESPACE, ATTR_DB_OPERATION_BATCH_SIZE, ATTR_DB_OPERATION_NAME, ATTR_DB_QUERY_SUMMARY, ATTR_DB_QUERY_TEXT, ATTR_DB_RESPONSE_STATUS_CODE, ATTR_DB_STORED_PROCEDURE_NAME, ATTR_DB_SYSTEM_NAME, DB_SYSTEM_NAME_VALUE_MARIADB, DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER, DB_SYSTEM_NAME_VALUE_MYSQL, DB_SYSTEM_NAME_VALUE_POSTGRESQL, ATTR_DEPLOYMENT_ENVIRONMENT_NAME, DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT, DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION, DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING, DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST, ATTR_DOTNET_GC_HEAP_GENERATION, DOTNET_GC_HEAP_GENERATION_VALUE_GEN0, DOTNET_GC_HEAP_GENERATION_VALUE_GEN1, DOTNET_GC_HEAP_GENERATION_VALUE_GEN2, DOTNET_GC_HEAP_GENERATION_VALUE_LOH, DOTNET_GC_HEAP_GENERATION_VALUE_POH, ATTR_ERROR_TYPE, ERROR_TYPE_VALUE_OTHER, ATTR_EXCEPTION_ESCAPED, ATTR_EXCEPTION_MESSAGE, ATTR_EXCEPTION_STACKTRACE, ATTR_EXCEPTION_TYPE, ATTR_HTTP_REQUEST_HEADER, ATTR_HTTP_REQUEST_METHOD, HTTP_REQUEST_METHOD_VALUE_OTHER, HTTP_REQUEST_METHOD_VALUE_CONNECT, HTTP_REQUEST_METHOD_VALUE_DELETE, HTTP_REQUEST_METHOD_VALUE_GET, HTTP_REQUEST_METHOD_VALUE_HEAD, HTTP_REQUEST_METHOD_VALUE_OPTIONS, HTTP_REQUEST_METHOD_VALUE_PATCH, HTTP_REQUEST_METHOD_VALUE_POST, HTTP_REQUEST_METHOD_VALUE_PUT, HTTP_REQUEST_METHOD_VALUE_TRACE, ATTR_HTTP_REQUEST_METHOD_ORIGINAL, ATTR_HTTP_REQUEST_RESEND_COUNT, ATTR_HTTP_RESPONSE_HEADER, ATTR_HTTP_RESPONSE_STATUS_CODE, ATTR_HTTP_ROUTE, ATTR_JVM_GC_ACTION, ATTR_JVM_GC_NAME, ATTR_JVM_MEMORY_POOL_NAME, ATTR_JVM_MEMORY_TYPE, JVM_MEMORY_TYPE_VALUE_HEAP, JVM_MEMORY_TYPE_VALUE_NON_HEAP, ATTR_JVM_THREAD_DAEMON, ATTR_JVM_THREAD_STATE, JVM_THREAD_STATE_VALUE_BLOCKED, JVM_THREAD_STATE_VALUE_NEW, JVM_THREAD_STATE_VALUE_RUNNABLE, JVM_THREAD_STATE_VALUE_TERMINATED, JVM_THREAD_STATE_VALUE_TIMED_WAITING, JVM_THREAD_STATE_VALUE_WAITING, ATTR_NETWORK_LOCAL_ADDRESS, ATTR_NETWORK_LOCAL_PORT, ATTR_NETWORK_PEER_ADDRESS, ATTR_NETWORK_PEER_PORT, ATTR_NETWORK_PROTOCOL_NAME, ATTR_NETWORK_PROTOCOL_VERSION, ATTR_NETWORK_TRANSPORT, NETWORK_TRANSPORT_VALUE_PIPE, NETWORK_TRANSPORT_VALUE_QUIC, NETWORK_TRANSPORT_VALUE_TCP, NETWORK_TRANSPORT_VALUE_UDP, NETWORK_TRANSPORT_VALUE_UNIX, ATTR_NETWORK_TYPE, NETWORK_TYPE_VALUE_IPV4, NETWORK_TYPE_VALUE_IPV6, ATTR_OTEL_EVENT_NAME, ATTR_OTEL_SCOPE_NAME, ATTR_OTEL_SCOPE_VERSION, ATTR_OTEL_STATUS_CODE, OTEL_STATUS_CODE_VALUE_ERROR, OTEL_STATUS_CODE_VALUE_OK, ATTR_OTEL_STATUS_DESCRIPTION, ATTR_SERVER_ADDRESS, ATTR_SERVER_PORT, ATTR_SERVICE_INSTANCE_ID, ATTR_SERVICE_NAME, ATTR_SERVICE_NAMESPACE, ATTR_SERVICE_VERSION, ATTR_SIGNALR_CONNECTION_STATUS, SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN, SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE, SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT, ATTR_SIGNALR_TRANSPORT, SIGNALR_TRANSPORT_VALUE_LONG_POLLING, SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS, SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS, ATTR_TELEMETRY_DISTRO_NAME, ATTR_TELEMETRY_DISTRO_VERSION, ATTR_TELEMETRY_SDK_LANGUAGE, TELEMETRY_SDK_LANGUAGE_VALUE_CPP, TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET, TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG, TELEMETRY_SDK_LANGUAGE_VALUE_GO, TELEMETRY_SDK_LANGUAGE_VALUE_JAVA, TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS, TELEMETRY_SDK_LANGUAGE_VALUE_PHP, TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON, TELEMETRY_SDK_LANGUAGE_VALUE_RUBY, TELEMETRY_SDK_LANGUAGE_VALUE_RUST, TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT, TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS, ATTR_TELEMETRY_SDK_NAME, ATTR_TELEMETRY_SDK_VERSION, ATTR_URL_FRAGMENT, ATTR_URL_FULL, ATTR_URL_PATH, ATTR_URL_QUERY, ATTR_URL_SCHEME, ATTR_USER_AGENT_ORIGINAL;
var init_stable_attributes = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_attributes.js"() {
    init_esm();
    ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = "aspnetcore.diagnostics.exception.result";
    ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = "aborted";
    ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = "handled";
    ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = "skipped";
    ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = "unhandled";
    ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = "aspnetcore.diagnostics.handler.type";
    ATTR_ASPNETCORE_RATE_LIMITING_POLICY = "aspnetcore.rate_limiting.policy";
    ATTR_ASPNETCORE_RATE_LIMITING_RESULT = "aspnetcore.rate_limiting.result";
    ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = "acquired";
    ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = "endpoint_limiter";
    ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = "global_limiter";
    ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = "request_canceled";
    ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = "aspnetcore.request.is_unhandled";
    ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = "aspnetcore.routing.is_fallback";
    ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = "aspnetcore.routing.match_status";
    ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = "failure";
    ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = "success";
    ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = "aspnetcore.user.is_authenticated";
    ATTR_CLIENT_ADDRESS = "client.address";
    ATTR_CLIENT_PORT = "client.port";
    ATTR_CODE_COLUMN_NUMBER = "code.column.number";
    ATTR_CODE_FILE_PATH = "code.file.path";
    ATTR_CODE_FUNCTION_NAME = "code.function.name";
    ATTR_CODE_LINE_NUMBER = "code.line.number";
    ATTR_CODE_STACKTRACE = "code.stacktrace";
    ATTR_DB_COLLECTION_NAME = "db.collection.name";
    ATTR_DB_NAMESPACE = "db.namespace";
    ATTR_DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
    ATTR_DB_OPERATION_NAME = "db.operation.name";
    ATTR_DB_QUERY_SUMMARY = "db.query.summary";
    ATTR_DB_QUERY_TEXT = "db.query.text";
    ATTR_DB_RESPONSE_STATUS_CODE = "db.response.status_code";
    ATTR_DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
    ATTR_DB_SYSTEM_NAME = "db.system.name";
    DB_SYSTEM_NAME_VALUE_MARIADB = "mariadb";
    DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = "microsoft.sql_server";
    DB_SYSTEM_NAME_VALUE_MYSQL = "mysql";
    DB_SYSTEM_NAME_VALUE_POSTGRESQL = "postgresql";
    ATTR_DEPLOYMENT_ENVIRONMENT_NAME = "deployment.environment.name";
    DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT = "development";
    DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION = "production";
    DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING = "staging";
    DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST = "test";
    ATTR_DOTNET_GC_HEAP_GENERATION = "dotnet.gc.heap.generation";
    DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = "gen0";
    DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = "gen1";
    DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = "gen2";
    DOTNET_GC_HEAP_GENERATION_VALUE_LOH = "loh";
    DOTNET_GC_HEAP_GENERATION_VALUE_POH = "poh";
    ATTR_ERROR_TYPE = "error.type";
    ERROR_TYPE_VALUE_OTHER = "_OTHER";
    ATTR_EXCEPTION_ESCAPED = "exception.escaped";
    ATTR_EXCEPTION_MESSAGE = "exception.message";
    ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
    ATTR_EXCEPTION_TYPE = "exception.type";
    ATTR_HTTP_REQUEST_HEADER = /* @__PURE__ */ __name((key) => `http.request.header.${key}`, "ATTR_HTTP_REQUEST_HEADER");
    ATTR_HTTP_REQUEST_METHOD = "http.request.method";
    HTTP_REQUEST_METHOD_VALUE_OTHER = "_OTHER";
    HTTP_REQUEST_METHOD_VALUE_CONNECT = "CONNECT";
    HTTP_REQUEST_METHOD_VALUE_DELETE = "DELETE";
    HTTP_REQUEST_METHOD_VALUE_GET = "GET";
    HTTP_REQUEST_METHOD_VALUE_HEAD = "HEAD";
    HTTP_REQUEST_METHOD_VALUE_OPTIONS = "OPTIONS";
    HTTP_REQUEST_METHOD_VALUE_PATCH = "PATCH";
    HTTP_REQUEST_METHOD_VALUE_POST = "POST";
    HTTP_REQUEST_METHOD_VALUE_PUT = "PUT";
    HTTP_REQUEST_METHOD_VALUE_TRACE = "TRACE";
    ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
    ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
    ATTR_HTTP_RESPONSE_HEADER = /* @__PURE__ */ __name((key) => `http.response.header.${key}`, "ATTR_HTTP_RESPONSE_HEADER");
    ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
    ATTR_HTTP_ROUTE = "http.route";
    ATTR_JVM_GC_ACTION = "jvm.gc.action";
    ATTR_JVM_GC_NAME = "jvm.gc.name";
    ATTR_JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
    ATTR_JVM_MEMORY_TYPE = "jvm.memory.type";
    JVM_MEMORY_TYPE_VALUE_HEAP = "heap";
    JVM_MEMORY_TYPE_VALUE_NON_HEAP = "non_heap";
    ATTR_JVM_THREAD_DAEMON = "jvm.thread.daemon";
    ATTR_JVM_THREAD_STATE = "jvm.thread.state";
    JVM_THREAD_STATE_VALUE_BLOCKED = "blocked";
    JVM_THREAD_STATE_VALUE_NEW = "new";
    JVM_THREAD_STATE_VALUE_RUNNABLE = "runnable";
    JVM_THREAD_STATE_VALUE_TERMINATED = "terminated";
    JVM_THREAD_STATE_VALUE_TIMED_WAITING = "timed_waiting";
    JVM_THREAD_STATE_VALUE_WAITING = "waiting";
    ATTR_NETWORK_LOCAL_ADDRESS = "network.local.address";
    ATTR_NETWORK_LOCAL_PORT = "network.local.port";
    ATTR_NETWORK_PEER_ADDRESS = "network.peer.address";
    ATTR_NETWORK_PEER_PORT = "network.peer.port";
    ATTR_NETWORK_PROTOCOL_NAME = "network.protocol.name";
    ATTR_NETWORK_PROTOCOL_VERSION = "network.protocol.version";
    ATTR_NETWORK_TRANSPORT = "network.transport";
    NETWORK_TRANSPORT_VALUE_PIPE = "pipe";
    NETWORK_TRANSPORT_VALUE_QUIC = "quic";
    NETWORK_TRANSPORT_VALUE_TCP = "tcp";
    NETWORK_TRANSPORT_VALUE_UDP = "udp";
    NETWORK_TRANSPORT_VALUE_UNIX = "unix";
    ATTR_NETWORK_TYPE = "network.type";
    NETWORK_TYPE_VALUE_IPV4 = "ipv4";
    NETWORK_TYPE_VALUE_IPV6 = "ipv6";
    ATTR_OTEL_EVENT_NAME = "otel.event.name";
    ATTR_OTEL_SCOPE_NAME = "otel.scope.name";
    ATTR_OTEL_SCOPE_VERSION = "otel.scope.version";
    ATTR_OTEL_STATUS_CODE = "otel.status_code";
    OTEL_STATUS_CODE_VALUE_ERROR = "ERROR";
    OTEL_STATUS_CODE_VALUE_OK = "OK";
    ATTR_OTEL_STATUS_DESCRIPTION = "otel.status_description";
    ATTR_SERVER_ADDRESS = "server.address";
    ATTR_SERVER_PORT = "server.port";
    ATTR_SERVICE_INSTANCE_ID = "service.instance.id";
    ATTR_SERVICE_NAME = "service.name";
    ATTR_SERVICE_NAMESPACE = "service.namespace";
    ATTR_SERVICE_VERSION = "service.version";
    ATTR_SIGNALR_CONNECTION_STATUS = "signalr.connection.status";
    SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = "app_shutdown";
    SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = "normal_closure";
    SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = "timeout";
    ATTR_SIGNALR_TRANSPORT = "signalr.transport";
    SIGNALR_TRANSPORT_VALUE_LONG_POLLING = "long_polling";
    SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = "server_sent_events";
    SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = "web_sockets";
    ATTR_TELEMETRY_DISTRO_NAME = "telemetry.distro.name";
    ATTR_TELEMETRY_DISTRO_VERSION = "telemetry.distro.version";
    ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
    TELEMETRY_SDK_LANGUAGE_VALUE_CPP = "cpp";
    TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = "dotnet";
    TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = "erlang";
    TELEMETRY_SDK_LANGUAGE_VALUE_GO = "go";
    TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = "java";
    TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = "nodejs";
    TELEMETRY_SDK_LANGUAGE_VALUE_PHP = "php";
    TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = "python";
    TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = "ruby";
    TELEMETRY_SDK_LANGUAGE_VALUE_RUST = "rust";
    TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = "swift";
    TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
    ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
    ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
    ATTR_URL_FRAGMENT = "url.fragment";
    ATTR_URL_FULL = "url.full";
    ATTR_URL_PATH = "url.path";
    ATTR_URL_QUERY = "url.query";
    ATTR_URL_SCHEME = "url.scheme";
    ATTR_USER_AGENT_ORIGINAL = "user_agent.original";
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_metrics.js
var METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS, METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES, METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS, METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE, METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION, METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS, METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS, METRIC_DB_CLIENT_OPERATION_DURATION, METRIC_DOTNET_ASSEMBLY_COUNT, METRIC_DOTNET_EXCEPTIONS, METRIC_DOTNET_GC_COLLECTIONS, METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED, METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE, METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE, METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE, METRIC_DOTNET_GC_PAUSE_TIME, METRIC_DOTNET_JIT_COMPILATION_TIME, METRIC_DOTNET_JIT_COMPILED_IL_SIZE, METRIC_DOTNET_JIT_COMPILED_METHODS, METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS, METRIC_DOTNET_PROCESS_CPU_COUNT, METRIC_DOTNET_PROCESS_CPU_TIME, METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET, METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH, METRIC_DOTNET_THREAD_POOL_THREAD_COUNT, METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT, METRIC_DOTNET_TIMER_COUNT, METRIC_HTTP_CLIENT_REQUEST_DURATION, METRIC_HTTP_SERVER_REQUEST_DURATION, METRIC_JVM_CLASS_COUNT, METRIC_JVM_CLASS_LOADED, METRIC_JVM_CLASS_UNLOADED, METRIC_JVM_CPU_COUNT, METRIC_JVM_CPU_RECENT_UTILIZATION, METRIC_JVM_CPU_TIME, METRIC_JVM_GC_DURATION, METRIC_JVM_MEMORY_COMMITTED, METRIC_JVM_MEMORY_LIMIT, METRIC_JVM_MEMORY_USED, METRIC_JVM_MEMORY_USED_AFTER_LAST_GC, METRIC_JVM_THREAD_COUNT, METRIC_KESTREL_ACTIVE_CONNECTIONS, METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES, METRIC_KESTREL_CONNECTION_DURATION, METRIC_KESTREL_QUEUED_CONNECTIONS, METRIC_KESTREL_QUEUED_REQUESTS, METRIC_KESTREL_REJECTED_CONNECTIONS, METRIC_KESTREL_TLS_HANDSHAKE_DURATION, METRIC_KESTREL_UPGRADED_CONNECTIONS, METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS, METRIC_SIGNALR_SERVER_CONNECTION_DURATION;
var init_stable_metrics = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_metrics.js"() {
    init_esm();
    METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = "aspnetcore.diagnostics.exceptions";
    METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = "aspnetcore.rate_limiting.active_request_leases";
    METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = "aspnetcore.rate_limiting.queued_requests";
    METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = "aspnetcore.rate_limiting.request.time_in_queue";
    METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = "aspnetcore.rate_limiting.request_lease.duration";
    METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = "aspnetcore.rate_limiting.requests";
    METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = "aspnetcore.routing.match_attempts";
    METRIC_DB_CLIENT_OPERATION_DURATION = "db.client.operation.duration";
    METRIC_DOTNET_ASSEMBLY_COUNT = "dotnet.assembly.count";
    METRIC_DOTNET_EXCEPTIONS = "dotnet.exceptions";
    METRIC_DOTNET_GC_COLLECTIONS = "dotnet.gc.collections";
    METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = "dotnet.gc.heap.total_allocated";
    METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = "dotnet.gc.last_collection.heap.fragmentation.size";
    METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = "dotnet.gc.last_collection.heap.size";
    METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = "dotnet.gc.last_collection.memory.committed_size";
    METRIC_DOTNET_GC_PAUSE_TIME = "dotnet.gc.pause.time";
    METRIC_DOTNET_JIT_COMPILATION_TIME = "dotnet.jit.compilation.time";
    METRIC_DOTNET_JIT_COMPILED_IL_SIZE = "dotnet.jit.compiled_il.size";
    METRIC_DOTNET_JIT_COMPILED_METHODS = "dotnet.jit.compiled_methods";
    METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = "dotnet.monitor.lock_contentions";
    METRIC_DOTNET_PROCESS_CPU_COUNT = "dotnet.process.cpu.count";
    METRIC_DOTNET_PROCESS_CPU_TIME = "dotnet.process.cpu.time";
    METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = "dotnet.process.memory.working_set";
    METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = "dotnet.thread_pool.queue.length";
    METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = "dotnet.thread_pool.thread.count";
    METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = "dotnet.thread_pool.work_item.count";
    METRIC_DOTNET_TIMER_COUNT = "dotnet.timer.count";
    METRIC_HTTP_CLIENT_REQUEST_DURATION = "http.client.request.duration";
    METRIC_HTTP_SERVER_REQUEST_DURATION = "http.server.request.duration";
    METRIC_JVM_CLASS_COUNT = "jvm.class.count";
    METRIC_JVM_CLASS_LOADED = "jvm.class.loaded";
    METRIC_JVM_CLASS_UNLOADED = "jvm.class.unloaded";
    METRIC_JVM_CPU_COUNT = "jvm.cpu.count";
    METRIC_JVM_CPU_RECENT_UTILIZATION = "jvm.cpu.recent_utilization";
    METRIC_JVM_CPU_TIME = "jvm.cpu.time";
    METRIC_JVM_GC_DURATION = "jvm.gc.duration";
    METRIC_JVM_MEMORY_COMMITTED = "jvm.memory.committed";
    METRIC_JVM_MEMORY_LIMIT = "jvm.memory.limit";
    METRIC_JVM_MEMORY_USED = "jvm.memory.used";
    METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = "jvm.memory.used_after_last_gc";
    METRIC_JVM_THREAD_COUNT = "jvm.thread.count";
    METRIC_KESTREL_ACTIVE_CONNECTIONS = "kestrel.active_connections";
    METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = "kestrel.active_tls_handshakes";
    METRIC_KESTREL_CONNECTION_DURATION = "kestrel.connection.duration";
    METRIC_KESTREL_QUEUED_CONNECTIONS = "kestrel.queued_connections";
    METRIC_KESTREL_QUEUED_REQUESTS = "kestrel.queued_requests";
    METRIC_KESTREL_REJECTED_CONNECTIONS = "kestrel.rejected_connections";
    METRIC_KESTREL_TLS_HANDSHAKE_DURATION = "kestrel.tls_handshake.duration";
    METRIC_KESTREL_UPGRADED_CONNECTIONS = "kestrel.upgraded_connections";
    METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = "signalr.server.active_connections";
    METRIC_SIGNALR_SERVER_CONNECTION_DURATION = "signalr.server.connection.duration";
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_events.js
var EVENT_EXCEPTION;
var init_stable_events = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/stable_events.js"() {
    init_esm();
    EVENT_EXCEPTION = "exception";
  }
});

// node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js
var esm_exports2 = {};
__export(esm_exports2, {
  ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED: () => ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED,
  ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED: () => ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED,
  ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED: () => ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED,
  ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED: () => ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED,
  ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED: () => ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED,
  ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER: () => ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER,
  ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER: () => ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER,
  ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED: () => ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED,
  ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE: () => ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE,
  ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS: () => ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS,
  ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT: () => ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT,
  ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE: () => ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE,
  ATTR_ASPNETCORE_RATE_LIMITING_POLICY: () => ATTR_ASPNETCORE_RATE_LIMITING_POLICY,
  ATTR_ASPNETCORE_RATE_LIMITING_RESULT: () => ATTR_ASPNETCORE_RATE_LIMITING_RESULT,
  ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED: () => ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED,
  ATTR_ASPNETCORE_ROUTING_IS_FALLBACK: () => ATTR_ASPNETCORE_ROUTING_IS_FALLBACK,
  ATTR_ASPNETCORE_ROUTING_MATCH_STATUS: () => ATTR_ASPNETCORE_ROUTING_MATCH_STATUS,
  ATTR_ASPNETCORE_USER_IS_AUTHENTICATED: () => ATTR_ASPNETCORE_USER_IS_AUTHENTICATED,
  ATTR_CLIENT_ADDRESS: () => ATTR_CLIENT_ADDRESS,
  ATTR_CLIENT_PORT: () => ATTR_CLIENT_PORT,
  ATTR_CODE_COLUMN_NUMBER: () => ATTR_CODE_COLUMN_NUMBER,
  ATTR_CODE_FILE_PATH: () => ATTR_CODE_FILE_PATH,
  ATTR_CODE_FUNCTION_NAME: () => ATTR_CODE_FUNCTION_NAME,
  ATTR_CODE_LINE_NUMBER: () => ATTR_CODE_LINE_NUMBER,
  ATTR_CODE_STACKTRACE: () => ATTR_CODE_STACKTRACE,
  ATTR_DB_COLLECTION_NAME: () => ATTR_DB_COLLECTION_NAME,
  ATTR_DB_NAMESPACE: () => ATTR_DB_NAMESPACE,
  ATTR_DB_OPERATION_BATCH_SIZE: () => ATTR_DB_OPERATION_BATCH_SIZE,
  ATTR_DB_OPERATION_NAME: () => ATTR_DB_OPERATION_NAME,
  ATTR_DB_QUERY_SUMMARY: () => ATTR_DB_QUERY_SUMMARY,
  ATTR_DB_QUERY_TEXT: () => ATTR_DB_QUERY_TEXT,
  ATTR_DB_RESPONSE_STATUS_CODE: () => ATTR_DB_RESPONSE_STATUS_CODE,
  ATTR_DB_STORED_PROCEDURE_NAME: () => ATTR_DB_STORED_PROCEDURE_NAME,
  ATTR_DB_SYSTEM_NAME: () => ATTR_DB_SYSTEM_NAME,
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME: () => ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_DOTNET_GC_HEAP_GENERATION: () => ATTR_DOTNET_GC_HEAP_GENERATION,
  ATTR_ERROR_TYPE: () => ATTR_ERROR_TYPE,
  ATTR_EXCEPTION_ESCAPED: () => ATTR_EXCEPTION_ESCAPED,
  ATTR_EXCEPTION_MESSAGE: () => ATTR_EXCEPTION_MESSAGE,
  ATTR_EXCEPTION_STACKTRACE: () => ATTR_EXCEPTION_STACKTRACE,
  ATTR_EXCEPTION_TYPE: () => ATTR_EXCEPTION_TYPE,
  ATTR_HTTP_REQUEST_HEADER: () => ATTR_HTTP_REQUEST_HEADER,
  ATTR_HTTP_REQUEST_METHOD: () => ATTR_HTTP_REQUEST_METHOD,
  ATTR_HTTP_REQUEST_METHOD_ORIGINAL: () => ATTR_HTTP_REQUEST_METHOD_ORIGINAL,
  ATTR_HTTP_REQUEST_RESEND_COUNT: () => ATTR_HTTP_REQUEST_RESEND_COUNT,
  ATTR_HTTP_RESPONSE_HEADER: () => ATTR_HTTP_RESPONSE_HEADER,
  ATTR_HTTP_RESPONSE_STATUS_CODE: () => ATTR_HTTP_RESPONSE_STATUS_CODE,
  ATTR_HTTP_ROUTE: () => ATTR_HTTP_ROUTE,
  ATTR_JVM_GC_ACTION: () => ATTR_JVM_GC_ACTION,
  ATTR_JVM_GC_NAME: () => ATTR_JVM_GC_NAME,
  ATTR_JVM_MEMORY_POOL_NAME: () => ATTR_JVM_MEMORY_POOL_NAME,
  ATTR_JVM_MEMORY_TYPE: () => ATTR_JVM_MEMORY_TYPE,
  ATTR_JVM_THREAD_DAEMON: () => ATTR_JVM_THREAD_DAEMON,
  ATTR_JVM_THREAD_STATE: () => ATTR_JVM_THREAD_STATE,
  ATTR_NETWORK_LOCAL_ADDRESS: () => ATTR_NETWORK_LOCAL_ADDRESS,
  ATTR_NETWORK_LOCAL_PORT: () => ATTR_NETWORK_LOCAL_PORT,
  ATTR_NETWORK_PEER_ADDRESS: () => ATTR_NETWORK_PEER_ADDRESS,
  ATTR_NETWORK_PEER_PORT: () => ATTR_NETWORK_PEER_PORT,
  ATTR_NETWORK_PROTOCOL_NAME: () => ATTR_NETWORK_PROTOCOL_NAME,
  ATTR_NETWORK_PROTOCOL_VERSION: () => ATTR_NETWORK_PROTOCOL_VERSION,
  ATTR_NETWORK_TRANSPORT: () => ATTR_NETWORK_TRANSPORT,
  ATTR_NETWORK_TYPE: () => ATTR_NETWORK_TYPE,
  ATTR_OTEL_EVENT_NAME: () => ATTR_OTEL_EVENT_NAME,
  ATTR_OTEL_SCOPE_NAME: () => ATTR_OTEL_SCOPE_NAME,
  ATTR_OTEL_SCOPE_VERSION: () => ATTR_OTEL_SCOPE_VERSION,
  ATTR_OTEL_STATUS_CODE: () => ATTR_OTEL_STATUS_CODE,
  ATTR_OTEL_STATUS_DESCRIPTION: () => ATTR_OTEL_STATUS_DESCRIPTION,
  ATTR_SERVER_ADDRESS: () => ATTR_SERVER_ADDRESS,
  ATTR_SERVER_PORT: () => ATTR_SERVER_PORT,
  ATTR_SERVICE_INSTANCE_ID: () => ATTR_SERVICE_INSTANCE_ID,
  ATTR_SERVICE_NAME: () => ATTR_SERVICE_NAME,
  ATTR_SERVICE_NAMESPACE: () => ATTR_SERVICE_NAMESPACE,
  ATTR_SERVICE_VERSION: () => ATTR_SERVICE_VERSION,
  ATTR_SIGNALR_CONNECTION_STATUS: () => ATTR_SIGNALR_CONNECTION_STATUS,
  ATTR_SIGNALR_TRANSPORT: () => ATTR_SIGNALR_TRANSPORT,
  ATTR_TELEMETRY_DISTRO_NAME: () => ATTR_TELEMETRY_DISTRO_NAME,
  ATTR_TELEMETRY_DISTRO_VERSION: () => ATTR_TELEMETRY_DISTRO_VERSION,
  ATTR_TELEMETRY_SDK_LANGUAGE: () => ATTR_TELEMETRY_SDK_LANGUAGE,
  ATTR_TELEMETRY_SDK_NAME: () => ATTR_TELEMETRY_SDK_NAME,
  ATTR_TELEMETRY_SDK_VERSION: () => ATTR_TELEMETRY_SDK_VERSION,
  ATTR_URL_FRAGMENT: () => ATTR_URL_FRAGMENT,
  ATTR_URL_FULL: () => ATTR_URL_FULL,
  ATTR_URL_PATH: () => ATTR_URL_PATH,
  ATTR_URL_QUERY: () => ATTR_URL_QUERY,
  ATTR_URL_SCHEME: () => ATTR_URL_SCHEME,
  ATTR_USER_AGENT_ORIGINAL: () => ATTR_USER_AGENT_ORIGINAL,
  AWSECSLAUNCHTYPEVALUES_EC2: () => AWSECSLAUNCHTYPEVALUES_EC2,
  AWSECSLAUNCHTYPEVALUES_FARGATE: () => AWSECSLAUNCHTYPEVALUES_FARGATE,
  AwsEcsLaunchtypeValues: () => AwsEcsLaunchtypeValues,
  CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS: () => CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS,
  CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC: () => CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC,
  CLOUDPLATFORMVALUES_AWS_EC2: () => CLOUDPLATFORMVALUES_AWS_EC2,
  CLOUDPLATFORMVALUES_AWS_ECS: () => CLOUDPLATFORMVALUES_AWS_ECS,
  CLOUDPLATFORMVALUES_AWS_EKS: () => CLOUDPLATFORMVALUES_AWS_EKS,
  CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK: () => CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK,
  CLOUDPLATFORMVALUES_AWS_LAMBDA: () => CLOUDPLATFORMVALUES_AWS_LAMBDA,
  CLOUDPLATFORMVALUES_AZURE_AKS: () => CLOUDPLATFORMVALUES_AZURE_AKS,
  CLOUDPLATFORMVALUES_AZURE_APP_SERVICE: () => CLOUDPLATFORMVALUES_AZURE_APP_SERVICE,
  CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES: () => CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES,
  CLOUDPLATFORMVALUES_AZURE_FUNCTIONS: () => CLOUDPLATFORMVALUES_AZURE_FUNCTIONS,
  CLOUDPLATFORMVALUES_AZURE_VM: () => CLOUDPLATFORMVALUES_AZURE_VM,
  CLOUDPLATFORMVALUES_GCP_APP_ENGINE: () => CLOUDPLATFORMVALUES_GCP_APP_ENGINE,
  CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS: () => CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS,
  CLOUDPLATFORMVALUES_GCP_CLOUD_RUN: () => CLOUDPLATFORMVALUES_GCP_CLOUD_RUN,
  CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE: () => CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE,
  CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE: () => CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE,
  CLOUDPROVIDERVALUES_ALIBABA_CLOUD: () => CLOUDPROVIDERVALUES_ALIBABA_CLOUD,
  CLOUDPROVIDERVALUES_AWS: () => CLOUDPROVIDERVALUES_AWS,
  CLOUDPROVIDERVALUES_AZURE: () => CLOUDPROVIDERVALUES_AZURE,
  CLOUDPROVIDERVALUES_GCP: () => CLOUDPROVIDERVALUES_GCP,
  CloudPlatformValues: () => CloudPlatformValues,
  CloudProviderValues: () => CloudProviderValues,
  DBCASSANDRACONSISTENCYLEVELVALUES_ALL: () => DBCASSANDRACONSISTENCYLEVELVALUES_ALL,
  DBCASSANDRACONSISTENCYLEVELVALUES_ANY: () => DBCASSANDRACONSISTENCYLEVELVALUES_ANY,
  DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM: () => DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM,
  DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE: () => DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE,
  DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM: () => DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM,
  DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL: () => DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL,
  DBCASSANDRACONSISTENCYLEVELVALUES_ONE: () => DBCASSANDRACONSISTENCYLEVELVALUES_ONE,
  DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM: () => DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM,
  DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL: () => DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL,
  DBCASSANDRACONSISTENCYLEVELVALUES_THREE: () => DBCASSANDRACONSISTENCYLEVELVALUES_THREE,
  DBCASSANDRACONSISTENCYLEVELVALUES_TWO: () => DBCASSANDRACONSISTENCYLEVELVALUES_TWO,
  DBSYSTEMVALUES_ADABAS: () => DBSYSTEMVALUES_ADABAS,
  DBSYSTEMVALUES_CACHE: () => DBSYSTEMVALUES_CACHE,
  DBSYSTEMVALUES_CASSANDRA: () => DBSYSTEMVALUES_CASSANDRA,
  DBSYSTEMVALUES_CLOUDSCAPE: () => DBSYSTEMVALUES_CLOUDSCAPE,
  DBSYSTEMVALUES_COCKROACHDB: () => DBSYSTEMVALUES_COCKROACHDB,
  DBSYSTEMVALUES_COLDFUSION: () => DBSYSTEMVALUES_COLDFUSION,
  DBSYSTEMVALUES_COSMOSDB: () => DBSYSTEMVALUES_COSMOSDB,
  DBSYSTEMVALUES_COUCHBASE: () => DBSYSTEMVALUES_COUCHBASE,
  DBSYSTEMVALUES_COUCHDB: () => DBSYSTEMVALUES_COUCHDB,
  DBSYSTEMVALUES_DB2: () => DBSYSTEMVALUES_DB2,
  DBSYSTEMVALUES_DERBY: () => DBSYSTEMVALUES_DERBY,
  DBSYSTEMVALUES_DYNAMODB: () => DBSYSTEMVALUES_DYNAMODB,
  DBSYSTEMVALUES_EDB: () => DBSYSTEMVALUES_EDB,
  DBSYSTEMVALUES_ELASTICSEARCH: () => DBSYSTEMVALUES_ELASTICSEARCH,
  DBSYSTEMVALUES_FILEMAKER: () => DBSYSTEMVALUES_FILEMAKER,
  DBSYSTEMVALUES_FIREBIRD: () => DBSYSTEMVALUES_FIREBIRD,
  DBSYSTEMVALUES_FIRSTSQL: () => DBSYSTEMVALUES_FIRSTSQL,
  DBSYSTEMVALUES_GEODE: () => DBSYSTEMVALUES_GEODE,
  DBSYSTEMVALUES_H2: () => DBSYSTEMVALUES_H2,
  DBSYSTEMVALUES_HANADB: () => DBSYSTEMVALUES_HANADB,
  DBSYSTEMVALUES_HBASE: () => DBSYSTEMVALUES_HBASE,
  DBSYSTEMVALUES_HIVE: () => DBSYSTEMVALUES_HIVE,
  DBSYSTEMVALUES_HSQLDB: () => DBSYSTEMVALUES_HSQLDB,
  DBSYSTEMVALUES_INFORMIX: () => DBSYSTEMVALUES_INFORMIX,
  DBSYSTEMVALUES_INGRES: () => DBSYSTEMVALUES_INGRES,
  DBSYSTEMVALUES_INSTANTDB: () => DBSYSTEMVALUES_INSTANTDB,
  DBSYSTEMVALUES_INTERBASE: () => DBSYSTEMVALUES_INTERBASE,
  DBSYSTEMVALUES_MARIADB: () => DBSYSTEMVALUES_MARIADB,
  DBSYSTEMVALUES_MAXDB: () => DBSYSTEMVALUES_MAXDB,
  DBSYSTEMVALUES_MEMCACHED: () => DBSYSTEMVALUES_MEMCACHED,
  DBSYSTEMVALUES_MONGODB: () => DBSYSTEMVALUES_MONGODB,
  DBSYSTEMVALUES_MSSQL: () => DBSYSTEMVALUES_MSSQL,
  DBSYSTEMVALUES_MYSQL: () => DBSYSTEMVALUES_MYSQL,
  DBSYSTEMVALUES_NEO4J: () => DBSYSTEMVALUES_NEO4J,
  DBSYSTEMVALUES_NETEZZA: () => DBSYSTEMVALUES_NETEZZA,
  DBSYSTEMVALUES_ORACLE: () => DBSYSTEMVALUES_ORACLE,
  DBSYSTEMVALUES_OTHER_SQL: () => DBSYSTEMVALUES_OTHER_SQL,
  DBSYSTEMVALUES_PERVASIVE: () => DBSYSTEMVALUES_PERVASIVE,
  DBSYSTEMVALUES_POINTBASE: () => DBSYSTEMVALUES_POINTBASE,
  DBSYSTEMVALUES_POSTGRESQL: () => DBSYSTEMVALUES_POSTGRESQL,
  DBSYSTEMVALUES_PROGRESS: () => DBSYSTEMVALUES_PROGRESS,
  DBSYSTEMVALUES_REDIS: () => DBSYSTEMVALUES_REDIS,
  DBSYSTEMVALUES_REDSHIFT: () => DBSYSTEMVALUES_REDSHIFT,
  DBSYSTEMVALUES_SQLITE: () => DBSYSTEMVALUES_SQLITE,
  DBSYSTEMVALUES_SYBASE: () => DBSYSTEMVALUES_SYBASE,
  DBSYSTEMVALUES_TERADATA: () => DBSYSTEMVALUES_TERADATA,
  DBSYSTEMVALUES_VERTICA: () => DBSYSTEMVALUES_VERTICA,
  DB_SYSTEM_NAME_VALUE_MARIADB: () => DB_SYSTEM_NAME_VALUE_MARIADB,
  DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER: () => DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER,
  DB_SYSTEM_NAME_VALUE_MYSQL: () => DB_SYSTEM_NAME_VALUE_MYSQL,
  DB_SYSTEM_NAME_VALUE_POSTGRESQL: () => DB_SYSTEM_NAME_VALUE_POSTGRESQL,
  DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT: () => DEPLOYMENT_ENVIRONMENT_NAME_VALUE_DEVELOPMENT,
  DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION: () => DEPLOYMENT_ENVIRONMENT_NAME_VALUE_PRODUCTION,
  DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING: () => DEPLOYMENT_ENVIRONMENT_NAME_VALUE_STAGING,
  DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST: () => DEPLOYMENT_ENVIRONMENT_NAME_VALUE_TEST,
  DOTNET_GC_HEAP_GENERATION_VALUE_GEN0: () => DOTNET_GC_HEAP_GENERATION_VALUE_GEN0,
  DOTNET_GC_HEAP_GENERATION_VALUE_GEN1: () => DOTNET_GC_HEAP_GENERATION_VALUE_GEN1,
  DOTNET_GC_HEAP_GENERATION_VALUE_GEN2: () => DOTNET_GC_HEAP_GENERATION_VALUE_GEN2,
  DOTNET_GC_HEAP_GENERATION_VALUE_LOH: () => DOTNET_GC_HEAP_GENERATION_VALUE_LOH,
  DOTNET_GC_HEAP_GENERATION_VALUE_POH: () => DOTNET_GC_HEAP_GENERATION_VALUE_POH,
  DbCassandraConsistencyLevelValues: () => DbCassandraConsistencyLevelValues,
  DbSystemValues: () => DbSystemValues,
  ERROR_TYPE_VALUE_OTHER: () => ERROR_TYPE_VALUE_OTHER,
  EVENT_EXCEPTION: () => EVENT_EXCEPTION,
  FAASDOCUMENTOPERATIONVALUES_DELETE: () => FAASDOCUMENTOPERATIONVALUES_DELETE,
  FAASDOCUMENTOPERATIONVALUES_EDIT: () => FAASDOCUMENTOPERATIONVALUES_EDIT,
  FAASDOCUMENTOPERATIONVALUES_INSERT: () => FAASDOCUMENTOPERATIONVALUES_INSERT,
  FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD: () => FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD,
  FAASINVOKEDPROVIDERVALUES_AWS: () => FAASINVOKEDPROVIDERVALUES_AWS,
  FAASINVOKEDPROVIDERVALUES_AZURE: () => FAASINVOKEDPROVIDERVALUES_AZURE,
  FAASINVOKEDPROVIDERVALUES_GCP: () => FAASINVOKEDPROVIDERVALUES_GCP,
  FAASTRIGGERVALUES_DATASOURCE: () => FAASTRIGGERVALUES_DATASOURCE,
  FAASTRIGGERVALUES_HTTP: () => FAASTRIGGERVALUES_HTTP,
  FAASTRIGGERVALUES_OTHER: () => FAASTRIGGERVALUES_OTHER,
  FAASTRIGGERVALUES_PUBSUB: () => FAASTRIGGERVALUES_PUBSUB,
  FAASTRIGGERVALUES_TIMER: () => FAASTRIGGERVALUES_TIMER,
  FaasDocumentOperationValues: () => FaasDocumentOperationValues,
  FaasInvokedProviderValues: () => FaasInvokedProviderValues,
  FaasTriggerValues: () => FaasTriggerValues,
  HOSTARCHVALUES_AMD64: () => HOSTARCHVALUES_AMD64,
  HOSTARCHVALUES_ARM32: () => HOSTARCHVALUES_ARM32,
  HOSTARCHVALUES_ARM64: () => HOSTARCHVALUES_ARM64,
  HOSTARCHVALUES_IA64: () => HOSTARCHVALUES_IA64,
  HOSTARCHVALUES_PPC32: () => HOSTARCHVALUES_PPC32,
  HOSTARCHVALUES_PPC64: () => HOSTARCHVALUES_PPC64,
  HOSTARCHVALUES_X86: () => HOSTARCHVALUES_X86,
  HTTPFLAVORVALUES_HTTP_1_0: () => HTTPFLAVORVALUES_HTTP_1_0,
  HTTPFLAVORVALUES_HTTP_1_1: () => HTTPFLAVORVALUES_HTTP_1_1,
  HTTPFLAVORVALUES_HTTP_2_0: () => HTTPFLAVORVALUES_HTTP_2_0,
  HTTPFLAVORVALUES_QUIC: () => HTTPFLAVORVALUES_QUIC,
  HTTPFLAVORVALUES_SPDY: () => HTTPFLAVORVALUES_SPDY,
  HTTP_REQUEST_METHOD_VALUE_CONNECT: () => HTTP_REQUEST_METHOD_VALUE_CONNECT,
  HTTP_REQUEST_METHOD_VALUE_DELETE: () => HTTP_REQUEST_METHOD_VALUE_DELETE,
  HTTP_REQUEST_METHOD_VALUE_GET: () => HTTP_REQUEST_METHOD_VALUE_GET,
  HTTP_REQUEST_METHOD_VALUE_HEAD: () => HTTP_REQUEST_METHOD_VALUE_HEAD,
  HTTP_REQUEST_METHOD_VALUE_OPTIONS: () => HTTP_REQUEST_METHOD_VALUE_OPTIONS,
  HTTP_REQUEST_METHOD_VALUE_OTHER: () => HTTP_REQUEST_METHOD_VALUE_OTHER,
  HTTP_REQUEST_METHOD_VALUE_PATCH: () => HTTP_REQUEST_METHOD_VALUE_PATCH,
  HTTP_REQUEST_METHOD_VALUE_POST: () => HTTP_REQUEST_METHOD_VALUE_POST,
  HTTP_REQUEST_METHOD_VALUE_PUT: () => HTTP_REQUEST_METHOD_VALUE_PUT,
  HTTP_REQUEST_METHOD_VALUE_TRACE: () => HTTP_REQUEST_METHOD_VALUE_TRACE,
  HostArchValues: () => HostArchValues,
  HttpFlavorValues: () => HttpFlavorValues,
  JVM_MEMORY_TYPE_VALUE_HEAP: () => JVM_MEMORY_TYPE_VALUE_HEAP,
  JVM_MEMORY_TYPE_VALUE_NON_HEAP: () => JVM_MEMORY_TYPE_VALUE_NON_HEAP,
  JVM_THREAD_STATE_VALUE_BLOCKED: () => JVM_THREAD_STATE_VALUE_BLOCKED,
  JVM_THREAD_STATE_VALUE_NEW: () => JVM_THREAD_STATE_VALUE_NEW,
  JVM_THREAD_STATE_VALUE_RUNNABLE: () => JVM_THREAD_STATE_VALUE_RUNNABLE,
  JVM_THREAD_STATE_VALUE_TERMINATED: () => JVM_THREAD_STATE_VALUE_TERMINATED,
  JVM_THREAD_STATE_VALUE_TIMED_WAITING: () => JVM_THREAD_STATE_VALUE_TIMED_WAITING,
  JVM_THREAD_STATE_VALUE_WAITING: () => JVM_THREAD_STATE_VALUE_WAITING,
  MESSAGETYPEVALUES_RECEIVED: () => MESSAGETYPEVALUES_RECEIVED,
  MESSAGETYPEVALUES_SENT: () => MESSAGETYPEVALUES_SENT,
  MESSAGINGDESTINATIONKINDVALUES_QUEUE: () => MESSAGINGDESTINATIONKINDVALUES_QUEUE,
  MESSAGINGDESTINATIONKINDVALUES_TOPIC: () => MESSAGINGDESTINATIONKINDVALUES_TOPIC,
  MESSAGINGOPERATIONVALUES_PROCESS: () => MESSAGINGOPERATIONVALUES_PROCESS,
  MESSAGINGOPERATIONVALUES_RECEIVE: () => MESSAGINGOPERATIONVALUES_RECEIVE,
  METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS: () => METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS,
  METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES: () => METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES,
  METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS: () => METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS,
  METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS: () => METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS,
  METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION: () => METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION,
  METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE: () => METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE,
  METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS: () => METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS,
  METRIC_DB_CLIENT_OPERATION_DURATION: () => METRIC_DB_CLIENT_OPERATION_DURATION,
  METRIC_DOTNET_ASSEMBLY_COUNT: () => METRIC_DOTNET_ASSEMBLY_COUNT,
  METRIC_DOTNET_EXCEPTIONS: () => METRIC_DOTNET_EXCEPTIONS,
  METRIC_DOTNET_GC_COLLECTIONS: () => METRIC_DOTNET_GC_COLLECTIONS,
  METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED: () => METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED,
  METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE: () => METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE,
  METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE: () => METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE,
  METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE: () => METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE,
  METRIC_DOTNET_GC_PAUSE_TIME: () => METRIC_DOTNET_GC_PAUSE_TIME,
  METRIC_DOTNET_JIT_COMPILATION_TIME: () => METRIC_DOTNET_JIT_COMPILATION_TIME,
  METRIC_DOTNET_JIT_COMPILED_IL_SIZE: () => METRIC_DOTNET_JIT_COMPILED_IL_SIZE,
  METRIC_DOTNET_JIT_COMPILED_METHODS: () => METRIC_DOTNET_JIT_COMPILED_METHODS,
  METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS: () => METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS,
  METRIC_DOTNET_PROCESS_CPU_COUNT: () => METRIC_DOTNET_PROCESS_CPU_COUNT,
  METRIC_DOTNET_PROCESS_CPU_TIME: () => METRIC_DOTNET_PROCESS_CPU_TIME,
  METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET: () => METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET,
  METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH: () => METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH,
  METRIC_DOTNET_THREAD_POOL_THREAD_COUNT: () => METRIC_DOTNET_THREAD_POOL_THREAD_COUNT,
  METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT: () => METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT,
  METRIC_DOTNET_TIMER_COUNT: () => METRIC_DOTNET_TIMER_COUNT,
  METRIC_HTTP_CLIENT_REQUEST_DURATION: () => METRIC_HTTP_CLIENT_REQUEST_DURATION,
  METRIC_HTTP_SERVER_REQUEST_DURATION: () => METRIC_HTTP_SERVER_REQUEST_DURATION,
  METRIC_JVM_CLASS_COUNT: () => METRIC_JVM_CLASS_COUNT,
  METRIC_JVM_CLASS_LOADED: () => METRIC_JVM_CLASS_LOADED,
  METRIC_JVM_CLASS_UNLOADED: () => METRIC_JVM_CLASS_UNLOADED,
  METRIC_JVM_CPU_COUNT: () => METRIC_JVM_CPU_COUNT,
  METRIC_JVM_CPU_RECENT_UTILIZATION: () => METRIC_JVM_CPU_RECENT_UTILIZATION,
  METRIC_JVM_CPU_TIME: () => METRIC_JVM_CPU_TIME,
  METRIC_JVM_GC_DURATION: () => METRIC_JVM_GC_DURATION,
  METRIC_JVM_MEMORY_COMMITTED: () => METRIC_JVM_MEMORY_COMMITTED,
  METRIC_JVM_MEMORY_LIMIT: () => METRIC_JVM_MEMORY_LIMIT,
  METRIC_JVM_MEMORY_USED: () => METRIC_JVM_MEMORY_USED,
  METRIC_JVM_MEMORY_USED_AFTER_LAST_GC: () => METRIC_JVM_MEMORY_USED_AFTER_LAST_GC,
  METRIC_JVM_THREAD_COUNT: () => METRIC_JVM_THREAD_COUNT,
  METRIC_KESTREL_ACTIVE_CONNECTIONS: () => METRIC_KESTREL_ACTIVE_CONNECTIONS,
  METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES: () => METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES,
  METRIC_KESTREL_CONNECTION_DURATION: () => METRIC_KESTREL_CONNECTION_DURATION,
  METRIC_KESTREL_QUEUED_CONNECTIONS: () => METRIC_KESTREL_QUEUED_CONNECTIONS,
  METRIC_KESTREL_QUEUED_REQUESTS: () => METRIC_KESTREL_QUEUED_REQUESTS,
  METRIC_KESTREL_REJECTED_CONNECTIONS: () => METRIC_KESTREL_REJECTED_CONNECTIONS,
  METRIC_KESTREL_TLS_HANDSHAKE_DURATION: () => METRIC_KESTREL_TLS_HANDSHAKE_DURATION,
  METRIC_KESTREL_UPGRADED_CONNECTIONS: () => METRIC_KESTREL_UPGRADED_CONNECTIONS,
  METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS: () => METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS,
  METRIC_SIGNALR_SERVER_CONNECTION_DURATION: () => METRIC_SIGNALR_SERVER_CONNECTION_DURATION,
  MessageTypeValues: () => MessageTypeValues,
  MessagingDestinationKindValues: () => MessagingDestinationKindValues,
  MessagingOperationValues: () => MessagingOperationValues,
  NETHOSTCONNECTIONSUBTYPEVALUES_CDMA: () => NETHOSTCONNECTIONSUBTYPEVALUES_CDMA,
  NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT: () => NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT,
  NETHOSTCONNECTIONSUBTYPEVALUES_EDGE: () => NETHOSTCONNECTIONSUBTYPEVALUES_EDGE,
  NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD: () => NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD,
  NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0: () => NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0,
  NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A: () => NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A,
  NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B: () => NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B,
  NETHOSTCONNECTIONSUBTYPEVALUES_GPRS: () => NETHOSTCONNECTIONSUBTYPEVALUES_GPRS,
  NETHOSTCONNECTIONSUBTYPEVALUES_GSM: () => NETHOSTCONNECTIONSUBTYPEVALUES_GSM,
  NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA: () => NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA,
  NETHOSTCONNECTIONSUBTYPEVALUES_HSPA: () => NETHOSTCONNECTIONSUBTYPEVALUES_HSPA,
  NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP: () => NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP,
  NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA: () => NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA,
  NETHOSTCONNECTIONSUBTYPEVALUES_IDEN: () => NETHOSTCONNECTIONSUBTYPEVALUES_IDEN,
  NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN: () => NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN,
  NETHOSTCONNECTIONSUBTYPEVALUES_LTE: () => NETHOSTCONNECTIONSUBTYPEVALUES_LTE,
  NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA: () => NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA,
  NETHOSTCONNECTIONSUBTYPEVALUES_NR: () => NETHOSTCONNECTIONSUBTYPEVALUES_NR,
  NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA: () => NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA,
  NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA: () => NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA,
  NETHOSTCONNECTIONSUBTYPEVALUES_UMTS: () => NETHOSTCONNECTIONSUBTYPEVALUES_UMTS,
  NETHOSTCONNECTIONTYPEVALUES_CELL: () => NETHOSTCONNECTIONTYPEVALUES_CELL,
  NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE: () => NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE,
  NETHOSTCONNECTIONTYPEVALUES_UNKNOWN: () => NETHOSTCONNECTIONTYPEVALUES_UNKNOWN,
  NETHOSTCONNECTIONTYPEVALUES_WIFI: () => NETHOSTCONNECTIONTYPEVALUES_WIFI,
  NETHOSTCONNECTIONTYPEVALUES_WIRED: () => NETHOSTCONNECTIONTYPEVALUES_WIRED,
  NETTRANSPORTVALUES_INPROC: () => NETTRANSPORTVALUES_INPROC,
  NETTRANSPORTVALUES_IP: () => NETTRANSPORTVALUES_IP,
  NETTRANSPORTVALUES_IP_TCP: () => NETTRANSPORTVALUES_IP_TCP,
  NETTRANSPORTVALUES_IP_UDP: () => NETTRANSPORTVALUES_IP_UDP,
  NETTRANSPORTVALUES_OTHER: () => NETTRANSPORTVALUES_OTHER,
  NETTRANSPORTVALUES_PIPE: () => NETTRANSPORTVALUES_PIPE,
  NETTRANSPORTVALUES_UNIX: () => NETTRANSPORTVALUES_UNIX,
  NETWORK_TRANSPORT_VALUE_PIPE: () => NETWORK_TRANSPORT_VALUE_PIPE,
  NETWORK_TRANSPORT_VALUE_QUIC: () => NETWORK_TRANSPORT_VALUE_QUIC,
  NETWORK_TRANSPORT_VALUE_TCP: () => NETWORK_TRANSPORT_VALUE_TCP,
  NETWORK_TRANSPORT_VALUE_UDP: () => NETWORK_TRANSPORT_VALUE_UDP,
  NETWORK_TRANSPORT_VALUE_UNIX: () => NETWORK_TRANSPORT_VALUE_UNIX,
  NETWORK_TYPE_VALUE_IPV4: () => NETWORK_TYPE_VALUE_IPV4,
  NETWORK_TYPE_VALUE_IPV6: () => NETWORK_TYPE_VALUE_IPV6,
  NetHostConnectionSubtypeValues: () => NetHostConnectionSubtypeValues,
  NetHostConnectionTypeValues: () => NetHostConnectionTypeValues,
  NetTransportValues: () => NetTransportValues,
  OSTYPEVALUES_AIX: () => OSTYPEVALUES_AIX,
  OSTYPEVALUES_DARWIN: () => OSTYPEVALUES_DARWIN,
  OSTYPEVALUES_DRAGONFLYBSD: () => OSTYPEVALUES_DRAGONFLYBSD,
  OSTYPEVALUES_FREEBSD: () => OSTYPEVALUES_FREEBSD,
  OSTYPEVALUES_HPUX: () => OSTYPEVALUES_HPUX,
  OSTYPEVALUES_LINUX: () => OSTYPEVALUES_LINUX,
  OSTYPEVALUES_NETBSD: () => OSTYPEVALUES_NETBSD,
  OSTYPEVALUES_OPENBSD: () => OSTYPEVALUES_OPENBSD,
  OSTYPEVALUES_SOLARIS: () => OSTYPEVALUES_SOLARIS,
  OSTYPEVALUES_WINDOWS: () => OSTYPEVALUES_WINDOWS,
  OSTYPEVALUES_Z_OS: () => OSTYPEVALUES_Z_OS,
  OTEL_STATUS_CODE_VALUE_ERROR: () => OTEL_STATUS_CODE_VALUE_ERROR,
  OTEL_STATUS_CODE_VALUE_OK: () => OTEL_STATUS_CODE_VALUE_OK,
  OsTypeValues: () => OsTypeValues,
  RPCGRPCSTATUSCODEVALUES_ABORTED: () => RPCGRPCSTATUSCODEVALUES_ABORTED,
  RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS: () => RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS,
  RPCGRPCSTATUSCODEVALUES_CANCELLED: () => RPCGRPCSTATUSCODEVALUES_CANCELLED,
  RPCGRPCSTATUSCODEVALUES_DATA_LOSS: () => RPCGRPCSTATUSCODEVALUES_DATA_LOSS,
  RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED: () => RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED,
  RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION: () => RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION,
  RPCGRPCSTATUSCODEVALUES_INTERNAL: () => RPCGRPCSTATUSCODEVALUES_INTERNAL,
  RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT: () => RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT,
  RPCGRPCSTATUSCODEVALUES_NOT_FOUND: () => RPCGRPCSTATUSCODEVALUES_NOT_FOUND,
  RPCGRPCSTATUSCODEVALUES_OK: () => RPCGRPCSTATUSCODEVALUES_OK,
  RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE: () => RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE,
  RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED: () => RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED,
  RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED: () => RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED,
  RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED: () => RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED,
  RPCGRPCSTATUSCODEVALUES_UNAVAILABLE: () => RPCGRPCSTATUSCODEVALUES_UNAVAILABLE,
  RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED: () => RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED,
  RPCGRPCSTATUSCODEVALUES_UNKNOWN: () => RPCGRPCSTATUSCODEVALUES_UNKNOWN,
  RpcGrpcStatusCodeValues: () => RpcGrpcStatusCodeValues,
  SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET: () => SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET,
  SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS: () => SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS,
  SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ: () => SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ,
  SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY: () => SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY,
  SEMATTRS_AWS_DYNAMODB_COUNT: () => SEMATTRS_AWS_DYNAMODB_COUNT,
  SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE: () => SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE,
  SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES: () => SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES,
  SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES: () => SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES,
  SEMATTRS_AWS_DYNAMODB_INDEX_NAME: () => SEMATTRS_AWS_DYNAMODB_INDEX_NAME,
  SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS: () => SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS,
  SEMATTRS_AWS_DYNAMODB_LIMIT: () => SEMATTRS_AWS_DYNAMODB_LIMIT,
  SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES: () => SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES,
  SEMATTRS_AWS_DYNAMODB_PROJECTION: () => SEMATTRS_AWS_DYNAMODB_PROJECTION,
  SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY: () => SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY,
  SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY: () => SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY,
  SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT: () => SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT,
  SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD: () => SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD,
  SEMATTRS_AWS_DYNAMODB_SEGMENT: () => SEMATTRS_AWS_DYNAMODB_SEGMENT,
  SEMATTRS_AWS_DYNAMODB_SELECT: () => SEMATTRS_AWS_DYNAMODB_SELECT,
  SEMATTRS_AWS_DYNAMODB_TABLE_COUNT: () => SEMATTRS_AWS_DYNAMODB_TABLE_COUNT,
  SEMATTRS_AWS_DYNAMODB_TABLE_NAMES: () => SEMATTRS_AWS_DYNAMODB_TABLE_NAMES,
  SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS: () => SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS,
  SEMATTRS_AWS_LAMBDA_INVOKED_ARN: () => SEMATTRS_AWS_LAMBDA_INVOKED_ARN,
  SEMATTRS_CODE_FILEPATH: () => SEMATTRS_CODE_FILEPATH,
  SEMATTRS_CODE_FUNCTION: () => SEMATTRS_CODE_FUNCTION,
  SEMATTRS_CODE_LINENO: () => SEMATTRS_CODE_LINENO,
  SEMATTRS_CODE_NAMESPACE: () => SEMATTRS_CODE_NAMESPACE,
  SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL: () => SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL,
  SEMATTRS_DB_CASSANDRA_COORDINATOR_DC: () => SEMATTRS_DB_CASSANDRA_COORDINATOR_DC,
  SEMATTRS_DB_CASSANDRA_COORDINATOR_ID: () => SEMATTRS_DB_CASSANDRA_COORDINATOR_ID,
  SEMATTRS_DB_CASSANDRA_IDEMPOTENCE: () => SEMATTRS_DB_CASSANDRA_IDEMPOTENCE,
  SEMATTRS_DB_CASSANDRA_KEYSPACE: () => SEMATTRS_DB_CASSANDRA_KEYSPACE,
  SEMATTRS_DB_CASSANDRA_PAGE_SIZE: () => SEMATTRS_DB_CASSANDRA_PAGE_SIZE,
  SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT: () => SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT,
  SEMATTRS_DB_CASSANDRA_TABLE: () => SEMATTRS_DB_CASSANDRA_TABLE,
  SEMATTRS_DB_CONNECTION_STRING: () => SEMATTRS_DB_CONNECTION_STRING,
  SEMATTRS_DB_HBASE_NAMESPACE: () => SEMATTRS_DB_HBASE_NAMESPACE,
  SEMATTRS_DB_JDBC_DRIVER_CLASSNAME: () => SEMATTRS_DB_JDBC_DRIVER_CLASSNAME,
  SEMATTRS_DB_MONGODB_COLLECTION: () => SEMATTRS_DB_MONGODB_COLLECTION,
  SEMATTRS_DB_MSSQL_INSTANCE_NAME: () => SEMATTRS_DB_MSSQL_INSTANCE_NAME,
  SEMATTRS_DB_NAME: () => SEMATTRS_DB_NAME,
  SEMATTRS_DB_OPERATION: () => SEMATTRS_DB_OPERATION,
  SEMATTRS_DB_REDIS_DATABASE_INDEX: () => SEMATTRS_DB_REDIS_DATABASE_INDEX,
  SEMATTRS_DB_SQL_TABLE: () => SEMATTRS_DB_SQL_TABLE,
  SEMATTRS_DB_STATEMENT: () => SEMATTRS_DB_STATEMENT,
  SEMATTRS_DB_SYSTEM: () => SEMATTRS_DB_SYSTEM,
  SEMATTRS_DB_USER: () => SEMATTRS_DB_USER,
  SEMATTRS_ENDUSER_ID: () => SEMATTRS_ENDUSER_ID,
  SEMATTRS_ENDUSER_ROLE: () => SEMATTRS_ENDUSER_ROLE,
  SEMATTRS_ENDUSER_SCOPE: () => SEMATTRS_ENDUSER_SCOPE,
  SEMATTRS_EXCEPTION_ESCAPED: () => SEMATTRS_EXCEPTION_ESCAPED,
  SEMATTRS_EXCEPTION_MESSAGE: () => SEMATTRS_EXCEPTION_MESSAGE,
  SEMATTRS_EXCEPTION_STACKTRACE: () => SEMATTRS_EXCEPTION_STACKTRACE,
  SEMATTRS_EXCEPTION_TYPE: () => SEMATTRS_EXCEPTION_TYPE,
  SEMATTRS_FAAS_COLDSTART: () => SEMATTRS_FAAS_COLDSTART,
  SEMATTRS_FAAS_CRON: () => SEMATTRS_FAAS_CRON,
  SEMATTRS_FAAS_DOCUMENT_COLLECTION: () => SEMATTRS_FAAS_DOCUMENT_COLLECTION,
  SEMATTRS_FAAS_DOCUMENT_NAME: () => SEMATTRS_FAAS_DOCUMENT_NAME,
  SEMATTRS_FAAS_DOCUMENT_OPERATION: () => SEMATTRS_FAAS_DOCUMENT_OPERATION,
  SEMATTRS_FAAS_DOCUMENT_TIME: () => SEMATTRS_FAAS_DOCUMENT_TIME,
  SEMATTRS_FAAS_EXECUTION: () => SEMATTRS_FAAS_EXECUTION,
  SEMATTRS_FAAS_INVOKED_NAME: () => SEMATTRS_FAAS_INVOKED_NAME,
  SEMATTRS_FAAS_INVOKED_PROVIDER: () => SEMATTRS_FAAS_INVOKED_PROVIDER,
  SEMATTRS_FAAS_INVOKED_REGION: () => SEMATTRS_FAAS_INVOKED_REGION,
  SEMATTRS_FAAS_TIME: () => SEMATTRS_FAAS_TIME,
  SEMATTRS_FAAS_TRIGGER: () => SEMATTRS_FAAS_TRIGGER,
  SEMATTRS_HTTP_CLIENT_IP: () => SEMATTRS_HTTP_CLIENT_IP,
  SEMATTRS_HTTP_FLAVOR: () => SEMATTRS_HTTP_FLAVOR,
  SEMATTRS_HTTP_HOST: () => SEMATTRS_HTTP_HOST,
  SEMATTRS_HTTP_METHOD: () => SEMATTRS_HTTP_METHOD,
  SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH: () => SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH,
  SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED: () => SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED,
  SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH: () => SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH,
  SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED: () => SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED,
  SEMATTRS_HTTP_ROUTE: () => SEMATTRS_HTTP_ROUTE,
  SEMATTRS_HTTP_SCHEME: () => SEMATTRS_HTTP_SCHEME,
  SEMATTRS_HTTP_SERVER_NAME: () => SEMATTRS_HTTP_SERVER_NAME,
  SEMATTRS_HTTP_STATUS_CODE: () => SEMATTRS_HTTP_STATUS_CODE,
  SEMATTRS_HTTP_TARGET: () => SEMATTRS_HTTP_TARGET,
  SEMATTRS_HTTP_URL: () => SEMATTRS_HTTP_URL,
  SEMATTRS_HTTP_USER_AGENT: () => SEMATTRS_HTTP_USER_AGENT,
  SEMATTRS_MESSAGE_COMPRESSED_SIZE: () => SEMATTRS_MESSAGE_COMPRESSED_SIZE,
  SEMATTRS_MESSAGE_ID: () => SEMATTRS_MESSAGE_ID,
  SEMATTRS_MESSAGE_TYPE: () => SEMATTRS_MESSAGE_TYPE,
  SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE: () => SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE,
  SEMATTRS_MESSAGING_CONSUMER_ID: () => SEMATTRS_MESSAGING_CONSUMER_ID,
  SEMATTRS_MESSAGING_CONVERSATION_ID: () => SEMATTRS_MESSAGING_CONVERSATION_ID,
  SEMATTRS_MESSAGING_DESTINATION: () => SEMATTRS_MESSAGING_DESTINATION,
  SEMATTRS_MESSAGING_DESTINATION_KIND: () => SEMATTRS_MESSAGING_DESTINATION_KIND,
  SEMATTRS_MESSAGING_KAFKA_CLIENT_ID: () => SEMATTRS_MESSAGING_KAFKA_CLIENT_ID,
  SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP: () => SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP,
  SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY: () => SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY,
  SEMATTRS_MESSAGING_KAFKA_PARTITION: () => SEMATTRS_MESSAGING_KAFKA_PARTITION,
  SEMATTRS_MESSAGING_KAFKA_TOMBSTONE: () => SEMATTRS_MESSAGING_KAFKA_TOMBSTONE,
  SEMATTRS_MESSAGING_MESSAGE_ID: () => SEMATTRS_MESSAGING_MESSAGE_ID,
  SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES: () => SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES,
  SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES: () => SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES,
  SEMATTRS_MESSAGING_OPERATION: () => SEMATTRS_MESSAGING_OPERATION,
  SEMATTRS_MESSAGING_PROTOCOL: () => SEMATTRS_MESSAGING_PROTOCOL,
  SEMATTRS_MESSAGING_PROTOCOL_VERSION: () => SEMATTRS_MESSAGING_PROTOCOL_VERSION,
  SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY: () => SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY,
  SEMATTRS_MESSAGING_SYSTEM: () => SEMATTRS_MESSAGING_SYSTEM,
  SEMATTRS_MESSAGING_TEMP_DESTINATION: () => SEMATTRS_MESSAGING_TEMP_DESTINATION,
  SEMATTRS_MESSAGING_URL: () => SEMATTRS_MESSAGING_URL,
  SEMATTRS_NET_HOST_CARRIER_ICC: () => SEMATTRS_NET_HOST_CARRIER_ICC,
  SEMATTRS_NET_HOST_CARRIER_MCC: () => SEMATTRS_NET_HOST_CARRIER_MCC,
  SEMATTRS_NET_HOST_CARRIER_MNC: () => SEMATTRS_NET_HOST_CARRIER_MNC,
  SEMATTRS_NET_HOST_CARRIER_NAME: () => SEMATTRS_NET_HOST_CARRIER_NAME,
  SEMATTRS_NET_HOST_CONNECTION_SUBTYPE: () => SEMATTRS_NET_HOST_CONNECTION_SUBTYPE,
  SEMATTRS_NET_HOST_CONNECTION_TYPE: () => SEMATTRS_NET_HOST_CONNECTION_TYPE,
  SEMATTRS_NET_HOST_IP: () => SEMATTRS_NET_HOST_IP,
  SEMATTRS_NET_HOST_NAME: () => SEMATTRS_NET_HOST_NAME,
  SEMATTRS_NET_HOST_PORT: () => SEMATTRS_NET_HOST_PORT,
  SEMATTRS_NET_PEER_IP: () => SEMATTRS_NET_PEER_IP,
  SEMATTRS_NET_PEER_NAME: () => SEMATTRS_NET_PEER_NAME,
  SEMATTRS_NET_PEER_PORT: () => SEMATTRS_NET_PEER_PORT,
  SEMATTRS_NET_TRANSPORT: () => SEMATTRS_NET_TRANSPORT,
  SEMATTRS_PEER_SERVICE: () => SEMATTRS_PEER_SERVICE,
  SEMATTRS_RPC_GRPC_STATUS_CODE: () => SEMATTRS_RPC_GRPC_STATUS_CODE,
  SEMATTRS_RPC_JSONRPC_ERROR_CODE: () => SEMATTRS_RPC_JSONRPC_ERROR_CODE,
  SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE: () => SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE,
  SEMATTRS_RPC_JSONRPC_REQUEST_ID: () => SEMATTRS_RPC_JSONRPC_REQUEST_ID,
  SEMATTRS_RPC_JSONRPC_VERSION: () => SEMATTRS_RPC_JSONRPC_VERSION,
  SEMATTRS_RPC_METHOD: () => SEMATTRS_RPC_METHOD,
  SEMATTRS_RPC_SERVICE: () => SEMATTRS_RPC_SERVICE,
  SEMATTRS_RPC_SYSTEM: () => SEMATTRS_RPC_SYSTEM,
  SEMATTRS_THREAD_ID: () => SEMATTRS_THREAD_ID,
  SEMATTRS_THREAD_NAME: () => SEMATTRS_THREAD_NAME,
  SEMRESATTRS_AWS_ECS_CLUSTER_ARN: () => SEMRESATTRS_AWS_ECS_CLUSTER_ARN,
  SEMRESATTRS_AWS_ECS_CONTAINER_ARN: () => SEMRESATTRS_AWS_ECS_CONTAINER_ARN,
  SEMRESATTRS_AWS_ECS_LAUNCHTYPE: () => SEMRESATTRS_AWS_ECS_LAUNCHTYPE,
  SEMRESATTRS_AWS_ECS_TASK_ARN: () => SEMRESATTRS_AWS_ECS_TASK_ARN,
  SEMRESATTRS_AWS_ECS_TASK_FAMILY: () => SEMRESATTRS_AWS_ECS_TASK_FAMILY,
  SEMRESATTRS_AWS_ECS_TASK_REVISION: () => SEMRESATTRS_AWS_ECS_TASK_REVISION,
  SEMRESATTRS_AWS_EKS_CLUSTER_ARN: () => SEMRESATTRS_AWS_EKS_CLUSTER_ARN,
  SEMRESATTRS_AWS_LOG_GROUP_ARNS: () => SEMRESATTRS_AWS_LOG_GROUP_ARNS,
  SEMRESATTRS_AWS_LOG_GROUP_NAMES: () => SEMRESATTRS_AWS_LOG_GROUP_NAMES,
  SEMRESATTRS_AWS_LOG_STREAM_ARNS: () => SEMRESATTRS_AWS_LOG_STREAM_ARNS,
  SEMRESATTRS_AWS_LOG_STREAM_NAMES: () => SEMRESATTRS_AWS_LOG_STREAM_NAMES,
  SEMRESATTRS_CLOUD_ACCOUNT_ID: () => SEMRESATTRS_CLOUD_ACCOUNT_ID,
  SEMRESATTRS_CLOUD_AVAILABILITY_ZONE: () => SEMRESATTRS_CLOUD_AVAILABILITY_ZONE,
  SEMRESATTRS_CLOUD_PLATFORM: () => SEMRESATTRS_CLOUD_PLATFORM,
  SEMRESATTRS_CLOUD_PROVIDER: () => SEMRESATTRS_CLOUD_PROVIDER,
  SEMRESATTRS_CLOUD_REGION: () => SEMRESATTRS_CLOUD_REGION,
  SEMRESATTRS_CONTAINER_ID: () => SEMRESATTRS_CONTAINER_ID,
  SEMRESATTRS_CONTAINER_IMAGE_NAME: () => SEMRESATTRS_CONTAINER_IMAGE_NAME,
  SEMRESATTRS_CONTAINER_IMAGE_TAG: () => SEMRESATTRS_CONTAINER_IMAGE_TAG,
  SEMRESATTRS_CONTAINER_NAME: () => SEMRESATTRS_CONTAINER_NAME,
  SEMRESATTRS_CONTAINER_RUNTIME: () => SEMRESATTRS_CONTAINER_RUNTIME,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT: () => SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_DEVICE_ID: () => SEMRESATTRS_DEVICE_ID,
  SEMRESATTRS_DEVICE_MODEL_IDENTIFIER: () => SEMRESATTRS_DEVICE_MODEL_IDENTIFIER,
  SEMRESATTRS_DEVICE_MODEL_NAME: () => SEMRESATTRS_DEVICE_MODEL_NAME,
  SEMRESATTRS_FAAS_ID: () => SEMRESATTRS_FAAS_ID,
  SEMRESATTRS_FAAS_INSTANCE: () => SEMRESATTRS_FAAS_INSTANCE,
  SEMRESATTRS_FAAS_MAX_MEMORY: () => SEMRESATTRS_FAAS_MAX_MEMORY,
  SEMRESATTRS_FAAS_NAME: () => SEMRESATTRS_FAAS_NAME,
  SEMRESATTRS_FAAS_VERSION: () => SEMRESATTRS_FAAS_VERSION,
  SEMRESATTRS_HOST_ARCH: () => SEMRESATTRS_HOST_ARCH,
  SEMRESATTRS_HOST_ID: () => SEMRESATTRS_HOST_ID,
  SEMRESATTRS_HOST_IMAGE_ID: () => SEMRESATTRS_HOST_IMAGE_ID,
  SEMRESATTRS_HOST_IMAGE_NAME: () => SEMRESATTRS_HOST_IMAGE_NAME,
  SEMRESATTRS_HOST_IMAGE_VERSION: () => SEMRESATTRS_HOST_IMAGE_VERSION,
  SEMRESATTRS_HOST_NAME: () => SEMRESATTRS_HOST_NAME,
  SEMRESATTRS_HOST_TYPE: () => SEMRESATTRS_HOST_TYPE,
  SEMRESATTRS_K8S_CLUSTER_NAME: () => SEMRESATTRS_K8S_CLUSTER_NAME,
  SEMRESATTRS_K8S_CONTAINER_NAME: () => SEMRESATTRS_K8S_CONTAINER_NAME,
  SEMRESATTRS_K8S_CRONJOB_NAME: () => SEMRESATTRS_K8S_CRONJOB_NAME,
  SEMRESATTRS_K8S_CRONJOB_UID: () => SEMRESATTRS_K8S_CRONJOB_UID,
  SEMRESATTRS_K8S_DAEMONSET_NAME: () => SEMRESATTRS_K8S_DAEMONSET_NAME,
  SEMRESATTRS_K8S_DAEMONSET_UID: () => SEMRESATTRS_K8S_DAEMONSET_UID,
  SEMRESATTRS_K8S_DEPLOYMENT_NAME: () => SEMRESATTRS_K8S_DEPLOYMENT_NAME,
  SEMRESATTRS_K8S_DEPLOYMENT_UID: () => SEMRESATTRS_K8S_DEPLOYMENT_UID,
  SEMRESATTRS_K8S_JOB_NAME: () => SEMRESATTRS_K8S_JOB_NAME,
  SEMRESATTRS_K8S_JOB_UID: () => SEMRESATTRS_K8S_JOB_UID,
  SEMRESATTRS_K8S_NAMESPACE_NAME: () => SEMRESATTRS_K8S_NAMESPACE_NAME,
  SEMRESATTRS_K8S_NODE_NAME: () => SEMRESATTRS_K8S_NODE_NAME,
  SEMRESATTRS_K8S_NODE_UID: () => SEMRESATTRS_K8S_NODE_UID,
  SEMRESATTRS_K8S_POD_NAME: () => SEMRESATTRS_K8S_POD_NAME,
  SEMRESATTRS_K8S_POD_UID: () => SEMRESATTRS_K8S_POD_UID,
  SEMRESATTRS_K8S_REPLICASET_NAME: () => SEMRESATTRS_K8S_REPLICASET_NAME,
  SEMRESATTRS_K8S_REPLICASET_UID: () => SEMRESATTRS_K8S_REPLICASET_UID,
  SEMRESATTRS_K8S_STATEFULSET_NAME: () => SEMRESATTRS_K8S_STATEFULSET_NAME,
  SEMRESATTRS_K8S_STATEFULSET_UID: () => SEMRESATTRS_K8S_STATEFULSET_UID,
  SEMRESATTRS_OS_DESCRIPTION: () => SEMRESATTRS_OS_DESCRIPTION,
  SEMRESATTRS_OS_NAME: () => SEMRESATTRS_OS_NAME,
  SEMRESATTRS_OS_TYPE: () => SEMRESATTRS_OS_TYPE,
  SEMRESATTRS_OS_VERSION: () => SEMRESATTRS_OS_VERSION,
  SEMRESATTRS_PROCESS_COMMAND: () => SEMRESATTRS_PROCESS_COMMAND,
  SEMRESATTRS_PROCESS_COMMAND_ARGS: () => SEMRESATTRS_PROCESS_COMMAND_ARGS,
  SEMRESATTRS_PROCESS_COMMAND_LINE: () => SEMRESATTRS_PROCESS_COMMAND_LINE,
  SEMRESATTRS_PROCESS_EXECUTABLE_NAME: () => SEMRESATTRS_PROCESS_EXECUTABLE_NAME,
  SEMRESATTRS_PROCESS_EXECUTABLE_PATH: () => SEMRESATTRS_PROCESS_EXECUTABLE_PATH,
  SEMRESATTRS_PROCESS_OWNER: () => SEMRESATTRS_PROCESS_OWNER,
  SEMRESATTRS_PROCESS_PID: () => SEMRESATTRS_PROCESS_PID,
  SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION: () => SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION,
  SEMRESATTRS_PROCESS_RUNTIME_NAME: () => SEMRESATTRS_PROCESS_RUNTIME_NAME,
  SEMRESATTRS_PROCESS_RUNTIME_VERSION: () => SEMRESATTRS_PROCESS_RUNTIME_VERSION,
  SEMRESATTRS_SERVICE_INSTANCE_ID: () => SEMRESATTRS_SERVICE_INSTANCE_ID,
  SEMRESATTRS_SERVICE_NAME: () => SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE: () => SEMRESATTRS_SERVICE_NAMESPACE,
  SEMRESATTRS_SERVICE_VERSION: () => SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_TELEMETRY_AUTO_VERSION: () => SEMRESATTRS_TELEMETRY_AUTO_VERSION,
  SEMRESATTRS_TELEMETRY_SDK_LANGUAGE: () => SEMRESATTRS_TELEMETRY_SDK_LANGUAGE,
  SEMRESATTRS_TELEMETRY_SDK_NAME: () => SEMRESATTRS_TELEMETRY_SDK_NAME,
  SEMRESATTRS_TELEMETRY_SDK_VERSION: () => SEMRESATTRS_TELEMETRY_SDK_VERSION,
  SEMRESATTRS_WEBENGINE_DESCRIPTION: () => SEMRESATTRS_WEBENGINE_DESCRIPTION,
  SEMRESATTRS_WEBENGINE_NAME: () => SEMRESATTRS_WEBENGINE_NAME,
  SEMRESATTRS_WEBENGINE_VERSION: () => SEMRESATTRS_WEBENGINE_VERSION,
  SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN: () => SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN,
  SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE: () => SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE,
  SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT: () => SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT,
  SIGNALR_TRANSPORT_VALUE_LONG_POLLING: () => SIGNALR_TRANSPORT_VALUE_LONG_POLLING,
  SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS: () => SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS,
  SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS: () => SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS,
  SemanticAttributes: () => SemanticAttributes,
  SemanticResourceAttributes: () => SemanticResourceAttributes,
  TELEMETRYSDKLANGUAGEVALUES_CPP: () => TELEMETRYSDKLANGUAGEVALUES_CPP,
  TELEMETRYSDKLANGUAGEVALUES_DOTNET: () => TELEMETRYSDKLANGUAGEVALUES_DOTNET,
  TELEMETRYSDKLANGUAGEVALUES_ERLANG: () => TELEMETRYSDKLANGUAGEVALUES_ERLANG,
  TELEMETRYSDKLANGUAGEVALUES_GO: () => TELEMETRYSDKLANGUAGEVALUES_GO,
  TELEMETRYSDKLANGUAGEVALUES_JAVA: () => TELEMETRYSDKLANGUAGEVALUES_JAVA,
  TELEMETRYSDKLANGUAGEVALUES_NODEJS: () => TELEMETRYSDKLANGUAGEVALUES_NODEJS,
  TELEMETRYSDKLANGUAGEVALUES_PHP: () => TELEMETRYSDKLANGUAGEVALUES_PHP,
  TELEMETRYSDKLANGUAGEVALUES_PYTHON: () => TELEMETRYSDKLANGUAGEVALUES_PYTHON,
  TELEMETRYSDKLANGUAGEVALUES_RUBY: () => TELEMETRYSDKLANGUAGEVALUES_RUBY,
  TELEMETRYSDKLANGUAGEVALUES_WEBJS: () => TELEMETRYSDKLANGUAGEVALUES_WEBJS,
  TELEMETRY_SDK_LANGUAGE_VALUE_CPP: () => TELEMETRY_SDK_LANGUAGE_VALUE_CPP,
  TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET: () => TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET,
  TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG: () => TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG,
  TELEMETRY_SDK_LANGUAGE_VALUE_GO: () => TELEMETRY_SDK_LANGUAGE_VALUE_GO,
  TELEMETRY_SDK_LANGUAGE_VALUE_JAVA: () => TELEMETRY_SDK_LANGUAGE_VALUE_JAVA,
  TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS: () => TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
  TELEMETRY_SDK_LANGUAGE_VALUE_PHP: () => TELEMETRY_SDK_LANGUAGE_VALUE_PHP,
  TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON: () => TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON,
  TELEMETRY_SDK_LANGUAGE_VALUE_RUBY: () => TELEMETRY_SDK_LANGUAGE_VALUE_RUBY,
  TELEMETRY_SDK_LANGUAGE_VALUE_RUST: () => TELEMETRY_SDK_LANGUAGE_VALUE_RUST,
  TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT: () => TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT,
  TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS: () => TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS,
  TelemetrySdkLanguageValues: () => TelemetrySdkLanguageValues
});
var init_esm3 = __esm({
  "node_modules/.pnpm/@opentelemetry+semantic-conventions@1.41.1/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js"() {
    init_esm();
    init_trace();
    init_resource();
    init_stable_attributes();
    init_stable_metrics();
    init_stable_events();
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/semconv.js
var require_semconv = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/semconv.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ATTR_PROCESS_RUNTIME_NAME = void 0;
    exports.ATTR_PROCESS_RUNTIME_NAME = "process.runtime.name";
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/platform/node/sdk-info.js
var require_sdk_info = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/platform/node/sdk-info.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SDK_INFO = void 0;
    var version_1 = require_version();
    var semantic_conventions_1 = (init_esm3(), __toCommonJS(esm_exports2));
    var semconv_1 = require_semconv();
    exports.SDK_INFO = {
      [semantic_conventions_1.ATTR_TELEMETRY_SDK_NAME]: "opentelemetry",
      [semconv_1.ATTR_PROCESS_RUNTIME_NAME]: "node",
      [semantic_conventions_1.ATTR_TELEMETRY_SDK_LANGUAGE]: semantic_conventions_1.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
      [semantic_conventions_1.ATTR_TELEMETRY_SDK_VERSION]: version_1.VERSION
    };
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/platform/node/index.js
var require_node = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/platform/node/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.otperformance = exports.SDK_INFO = exports._globalThis = exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = void 0;
    var environment_1 = require_environment();
    Object.defineProperty(exports, "getStringFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return environment_1.getStringFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getBooleanFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return environment_1.getBooleanFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getNumberFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return environment_1.getNumberFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getStringListFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return environment_1.getStringListFromEnv;
    }, "get") });
    var globalThis_1 = require_globalThis();
    Object.defineProperty(exports, "_globalThis", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return globalThis_1._globalThis;
    }, "get") });
    var sdk_info_1 = require_sdk_info();
    Object.defineProperty(exports, "SDK_INFO", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return sdk_info_1.SDK_INFO;
    }, "get") });
    exports.otperformance = performance;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/platform/index.js
var require_platform = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/platform/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getStringFromEnv = exports.getBooleanFromEnv = exports.otperformance = exports._globalThis = exports.SDK_INFO = void 0;
    var node_1 = require_node();
    Object.defineProperty(exports, "SDK_INFO", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1.SDK_INFO;
    }, "get") });
    Object.defineProperty(exports, "_globalThis", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1._globalThis;
    }, "get") });
    Object.defineProperty(exports, "otperformance", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1.otperformance;
    }, "get") });
    Object.defineProperty(exports, "getBooleanFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1.getBooleanFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getStringFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1.getStringFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getNumberFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1.getNumberFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getStringListFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return node_1.getStringListFromEnv;
    }, "get") });
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/time.js
var require_time = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/time.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.addHrTimes = exports.isTimeInput = exports.isTimeInputHrTime = exports.hrTimeToSeconds = exports.hrTimeToMilliseconds = exports.hrTimeToMicroseconds = exports.hrTimeToNanoseconds = exports.hrTimeToTimeStamp = exports.hrTimeDuration = exports.timeInputToHrTime = exports.hrTime = exports.getTimeOrigin = exports.millisToHrTime = void 0;
    var platform_1 = require_platform();
    var NANOSECOND_DIGITS = 9;
    var NANOSECOND_DIGITS_IN_MILLIS = 6;
    var MILLISECONDS_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS_IN_MILLIS);
    var SECOND_TO_NANOSECONDS = Math.pow(10, NANOSECOND_DIGITS);
    function millisToHrTime(epochMillis) {
      const epochSeconds = epochMillis / 1e3;
      const seconds = Math.trunc(epochSeconds);
      const nanos = Math.round(epochMillis % 1e3 * MILLISECONDS_TO_NANOSECONDS);
      return [seconds, nanos];
    }
    __name(millisToHrTime, "millisToHrTime");
    exports.millisToHrTime = millisToHrTime;
    function getTimeOrigin() {
      return platform_1.otperformance.timeOrigin;
    }
    __name(getTimeOrigin, "getTimeOrigin");
    exports.getTimeOrigin = getTimeOrigin;
    function hrTime(performanceNow) {
      const timeOrigin = millisToHrTime(platform_1.otperformance.timeOrigin);
      const now = millisToHrTime(typeof performanceNow === "number" ? performanceNow : platform_1.otperformance.now());
      return addHrTimes(timeOrigin, now);
    }
    __name(hrTime, "hrTime");
    exports.hrTime = hrTime;
    function timeInputToHrTime(time) {
      if (isTimeInputHrTime(time)) {
        return time;
      } else if (typeof time === "number") {
        if (time < platform_1.otperformance.timeOrigin) {
          return hrTime(time);
        } else {
          return millisToHrTime(time);
        }
      } else if (time instanceof Date) {
        return millisToHrTime(time.getTime());
      } else {
        throw TypeError("Invalid input type");
      }
    }
    __name(timeInputToHrTime, "timeInputToHrTime");
    exports.timeInputToHrTime = timeInputToHrTime;
    function hrTimeDuration(startTime, endTime) {
      let seconds = endTime[0] - startTime[0];
      let nanos = endTime[1] - startTime[1];
      if (nanos < 0) {
        seconds -= 1;
        nanos += SECOND_TO_NANOSECONDS;
      }
      return [seconds, nanos];
    }
    __name(hrTimeDuration, "hrTimeDuration");
    exports.hrTimeDuration = hrTimeDuration;
    function hrTimeToTimeStamp(time) {
      const precision = NANOSECOND_DIGITS;
      const tmp = `${"0".repeat(precision)}${time[1]}Z`;
      const nanoString = tmp.substring(tmp.length - precision - 1);
      const date = new Date(time[0] * 1e3).toISOString();
      return date.replace("000Z", nanoString);
    }
    __name(hrTimeToTimeStamp, "hrTimeToTimeStamp");
    exports.hrTimeToTimeStamp = hrTimeToTimeStamp;
    function hrTimeToNanoseconds(time) {
      return time[0] * SECOND_TO_NANOSECONDS + time[1];
    }
    __name(hrTimeToNanoseconds, "hrTimeToNanoseconds");
    exports.hrTimeToNanoseconds = hrTimeToNanoseconds;
    function hrTimeToMicroseconds(time) {
      return time[0] * 1e6 + time[1] / 1e3;
    }
    __name(hrTimeToMicroseconds, "hrTimeToMicroseconds");
    exports.hrTimeToMicroseconds = hrTimeToMicroseconds;
    function hrTimeToMilliseconds(time) {
      return time[0] * 1e3 + time[1] / 1e6;
    }
    __name(hrTimeToMilliseconds, "hrTimeToMilliseconds");
    exports.hrTimeToMilliseconds = hrTimeToMilliseconds;
    function hrTimeToSeconds(time) {
      return time[0] + time[1] / SECOND_TO_NANOSECONDS;
    }
    __name(hrTimeToSeconds, "hrTimeToSeconds");
    exports.hrTimeToSeconds = hrTimeToSeconds;
    function isTimeInputHrTime(value) {
      return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number";
    }
    __name(isTimeInputHrTime, "isTimeInputHrTime");
    exports.isTimeInputHrTime = isTimeInputHrTime;
    function isTimeInput(value) {
      return isTimeInputHrTime(value) || typeof value === "number" || value instanceof Date;
    }
    __name(isTimeInput, "isTimeInput");
    exports.isTimeInput = isTimeInput;
    function addHrTimes(time1, time2) {
      const out = [time1[0] + time2[0], time1[1] + time2[1]];
      if (out[1] >= SECOND_TO_NANOSECONDS) {
        out[1] -= SECOND_TO_NANOSECONDS;
        out[0] += 1;
      }
      return out;
    }
    __name(addHrTimes, "addHrTimes");
    exports.addHrTimes = addHrTimes;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/timer-util.js
var require_timer_util = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/common/timer-util.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unrefTimer = void 0;
    function unrefTimer(timer) {
      if (typeof timer !== "number") {
        timer.unref();
      }
    }
    __name(unrefTimer, "unrefTimer");
    exports.unrefTimer = unrefTimer;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/ExportResult.js
var require_ExportResult = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/ExportResult.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExportResultCode = void 0;
    var ExportResultCode;
    (function(ExportResultCode2) {
      ExportResultCode2[ExportResultCode2["SUCCESS"] = 0] = "SUCCESS";
      ExportResultCode2[ExportResultCode2["FAILED"] = 1] = "FAILED";
    })(ExportResultCode = exports.ExportResultCode || (exports.ExportResultCode = {}));
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/propagation/composite.js
var require_composite = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/propagation/composite.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CompositePropagator = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var CompositePropagator = class {
      static {
        __name(this, "CompositePropagator");
      }
      _propagators;
      _fields;
      /**
       * Construct a composite propagator from a list of propagators.
       *
       * @param [config] Configuration object for composite propagator
       */
      constructor(config = {}) {
        this._propagators = config.propagators ?? [];
        const fields = /* @__PURE__ */ new Set();
        for (const propagator of this._propagators) {
          const propagatorFields = typeof propagator.fields === "function" ? propagator.fields() : [];
          for (const field of propagatorFields) {
            fields.add(field);
          }
        }
        this._fields = Array.from(fields);
      }
      /**
       * Run each of the configured propagators with the given context and carrier.
       * Propagators are run in the order they are configured, so if multiple
       * propagators write the same carrier key, the propagator later in the list
       * will "win".
       *
       * @param context Context to inject
       * @param carrier Carrier into which context will be injected
       */
      inject(context, carrier, setter) {
        for (const propagator of this._propagators) {
          try {
            propagator.inject(context, carrier, setter);
          } catch (err) {
            api_1.diag.warn(`Failed to inject with ${propagator.constructor.name}. Err: ${err.message}`);
          }
        }
      }
      /**
       * Run each of the configured propagators with the given context and carrier.
       * Propagators are run in the order they are configured, so if multiple
       * propagators write the same context key, the propagator later in the list
       * will "win".
       *
       * @param context Context to add values to
       * @param carrier Carrier from which to extract context
       */
      extract(context, carrier, getter) {
        return this._propagators.reduce((ctx, propagator) => {
          try {
            return propagator.extract(ctx, carrier, getter);
          } catch (err) {
            api_1.diag.warn(`Failed to extract with ${propagator.constructor.name}. Err: ${err.message}`);
          }
          return ctx;
        }, context);
      }
      fields() {
        return this._fields.slice();
      }
    };
    exports.CompositePropagator = CompositePropagator;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/internal/validators.js
var require_validators = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/internal/validators.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateValue = exports.validateKey = void 0;
    var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
    var VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
    var VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
    var VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
    var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
    var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
    function validateKey(key) {
      return VALID_KEY_REGEX.test(key);
    }
    __name(validateKey, "validateKey");
    exports.validateKey = validateKey;
    function validateValue(value) {
      return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
    }
    __name(validateValue, "validateValue");
    exports.validateValue = validateValue;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/trace/TraceState.js
var require_TraceState = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/trace/TraceState.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceState = void 0;
    var validators_1 = require_validators();
    var MAX_TRACE_STATE_ITEMS = 32;
    var MAX_TRACE_STATE_LEN = 512;
    var LIST_MEMBERS_SEPARATOR = ",";
    var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
    var TraceState = class _TraceState {
      static {
        __name(this, "TraceState");
      }
      _length;
      _rawTraceState;
      _internalState;
      constructor(rawTraceState) {
        this._rawTraceState = typeof rawTraceState === "string" ? rawTraceState : "";
        this._length = this._rawTraceState.length;
      }
      set(key, value) {
        if (!(0, validators_1.validateKey)(key) || !(0, validators_1.validateValue)(value)) {
          return this;
        }
        const currState = this._getState();
        const currValue = currState.get(key);
        let newLength = this._length;
        if (typeof currValue === "string") {
          newLength += value.length - currValue.length;
        } else {
          newLength += key.length + value.length + (currState.size > 0 ? 2 : 1);
        }
        if (newLength > MAX_TRACE_STATE_LEN) {
          return this;
        }
        const newState = new Map(currState);
        newState.delete(key);
        newState.set(key, value);
        return this._fromState(newState, newLength);
      }
      unset(key) {
        const currState = this._getState();
        const currValue = currState.get(key);
        if (typeof currValue !== "string") {
          return this;
        }
        let newLength = this._length - (key.length + currValue.length + 1);
        if (currState.size > 1) {
          newLength = newLength - 1;
        }
        const newState = new Map(currState);
        newState.delete(key);
        return this._fromState(newState, newLength);
      }
      get(key) {
        const currState = this._getState();
        return currState.get(key);
      }
      serialize() {
        let serialized = "";
        let index = 0;
        for (const entry of this._getState()) {
          if (index > 0) {
            serialized = LIST_MEMBERS_SEPARATOR + serialized;
          }
          serialized = `${entry[0]}${LIST_MEMBER_KEY_VALUE_SPLITTER}${entry[1]}` + serialized;
          index++;
        }
        return serialized;
      }
      _getState() {
        if (this._internalState) {
          return this._internalState;
        }
        const vendorMembers = this._rawTraceState.split(LIST_MEMBERS_SEPARATOR);
        const vendorEntries = /* @__PURE__ */ new Map();
        let currentLength = 0;
        for (const member of vendorMembers) {
          const m2 = member.trim();
          const idx = m2.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
          if (idx === -1) {
            continue;
          }
          const key = m2.slice(0, idx);
          const value = m2.slice(idx + 1);
          if (!(0, validators_1.validateKey)(key) || !(0, validators_1.validateValue)(value)) {
            continue;
          }
          const futureLength = currentLength + m2.length + (vendorEntries.size > 0 ? 1 : 0);
          if (futureLength > MAX_TRACE_STATE_LEN) {
            continue;
          }
          vendorEntries.set(key, value);
          currentLength = futureLength;
          if (vendorEntries.size >= MAX_TRACE_STATE_ITEMS) {
            break;
          }
        }
        this._length = currentLength;
        this._internalState = new Map(Array.from(vendorEntries.entries()).reverse());
        return this._internalState;
      }
      _fromState(state, length2) {
        const traceState = Object.create(_TraceState.prototype);
        traceState._internalState = state;
        traceState._length = length2;
        return traceState;
      }
    };
    exports.TraceState = TraceState;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/trace/W3CTraceContextPropagator.js
var require_W3CTraceContextPropagator = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/trace/W3CTraceContextPropagator.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.W3CTraceContextPropagator = exports.parseTraceParent = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var suppress_tracing_1 = require_suppress_tracing();
    var TraceState_1 = require_TraceState();
    exports.TRACE_PARENT_HEADER = "traceparent";
    exports.TRACE_STATE_HEADER = "tracestate";
    var VERSION = "00";
    var VERSION_PART = "(?!ff)[\\da-f]{2}";
    var TRACE_ID_PART = "(?![0]{32})[\\da-f]{32}";
    var PARENT_ID_PART = "(?![0]{16})[\\da-f]{16}";
    var FLAGS_PART = "[\\da-f]{2}";
    var TRACE_PARENT_REGEX = new RegExp(`^\\s?(${VERSION_PART})-(${TRACE_ID_PART})-(${PARENT_ID_PART})-(${FLAGS_PART})(-.*)?\\s?$`);
    function parseTraceParent(traceParent) {
      const match = TRACE_PARENT_REGEX.exec(traceParent);
      if (!match)
        return null;
      if (match[1] === "00" && match[5])
        return null;
      return {
        traceId: match[2],
        spanId: match[3],
        traceFlags: parseInt(match[4], 16)
      };
    }
    __name(parseTraceParent, "parseTraceParent");
    exports.parseTraceParent = parseTraceParent;
    var W3CTraceContextPropagator = class {
      static {
        __name(this, "W3CTraceContextPropagator");
      }
      inject(context, carrier, setter) {
        const spanContext = api_1.trace.getSpanContext(context);
        if (!spanContext || (0, suppress_tracing_1.isTracingSuppressed)(context) || !(0, api_1.isSpanContextValid)(spanContext))
          return;
        const traceParent = `${VERSION}-${spanContext.traceId}-${spanContext.spanId}-0${Number(spanContext.traceFlags || api_1.TraceFlags.NONE).toString(16)}`;
        setter.set(carrier, exports.TRACE_PARENT_HEADER, traceParent);
        if (spanContext.traceState) {
          setter.set(carrier, exports.TRACE_STATE_HEADER, spanContext.traceState.serialize());
        }
      }
      extract(context, carrier, getter) {
        const traceParentHeader = getter.get(carrier, exports.TRACE_PARENT_HEADER);
        if (!traceParentHeader)
          return context;
        const traceParent = Array.isArray(traceParentHeader) ? traceParentHeader[0] : traceParentHeader;
        if (typeof traceParent !== "string")
          return context;
        const spanContext = parseTraceParent(traceParent);
        if (!spanContext)
          return context;
        spanContext.isRemote = true;
        const traceStateHeader = getter.get(carrier, exports.TRACE_STATE_HEADER);
        if (traceStateHeader) {
          const state = Array.isArray(traceStateHeader) ? traceStateHeader.join(",") : traceStateHeader;
          spanContext.traceState = new TraceState_1.TraceState(typeof state === "string" ? state : void 0);
        }
        return api_1.trace.setSpanContext(context, spanContext);
      }
      fields() {
        return [exports.TRACE_PARENT_HEADER, exports.TRACE_STATE_HEADER];
      }
    };
    exports.W3CTraceContextPropagator = W3CTraceContextPropagator;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/trace/rpc-metadata.js
var require_rpc_metadata = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/trace/rpc-metadata.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRPCMetadata = exports.deleteRPCMetadata = exports.setRPCMetadata = exports.RPCType = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var RPC_METADATA_KEY = (0, api_1.createContextKey)("OpenTelemetry SDK Context Key RPC_METADATA");
    var RPCType;
    (function(RPCType2) {
      RPCType2["HTTP"] = "http";
    })(RPCType = exports.RPCType || (exports.RPCType = {}));
    function setRPCMetadata(context, meta) {
      return context.setValue(RPC_METADATA_KEY, meta);
    }
    __name(setRPCMetadata, "setRPCMetadata");
    exports.setRPCMetadata = setRPCMetadata;
    function deleteRPCMetadata(context) {
      return context.deleteValue(RPC_METADATA_KEY);
    }
    __name(deleteRPCMetadata, "deleteRPCMetadata");
    exports.deleteRPCMetadata = deleteRPCMetadata;
    function getRPCMetadata(context) {
      return context.getValue(RPC_METADATA_KEY);
    }
    __name(getRPCMetadata, "getRPCMetadata");
    exports.getRPCMetadata = getRPCMetadata;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/lodash.merge.js
var require_lodash_merge = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/lodash.merge.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isPlainObject = void 0;
    var objectTag = "[object Object]";
    var nullTag = "[object Null]";
    var undefinedTag = "[object Undefined]";
    var funcProto = Function.prototype;
    var funcToString = funcProto.toString;
    var objectCtorString = funcToString.call(Object);
    var getPrototypeOf = Object.getPrototypeOf;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
    var nativeObjectToString = objectProto.toString;
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) !== objectTag) {
        return false;
      }
      const proto = getPrototypeOf(value);
      if (proto === null) {
        return true;
      }
      const Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) === objectCtorString;
    }
    __name(isPlainObject, "isPlainObject");
    exports.isPlainObject = isPlainObject;
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    __name(isObjectLike, "isObjectLike");
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    __name(baseGetTag, "baseGetTag");
    function getRawTag(value) {
      const isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      let unmasked = false;
      try {
        value[symToStringTag] = void 0;
        unmasked = true;
      } catch {
      }
      const result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    __name(getRawTag, "getRawTag");
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    __name(objectToString, "objectToString");
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/merge.js
var require_merge = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/merge.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.merge = void 0;
    var lodash_merge_1 = require_lodash_merge();
    var MAX_LEVEL = 20;
    function merge(...args) {
      let result = args.shift();
      const objects = /* @__PURE__ */ new WeakMap();
      while (args.length > 0) {
        result = mergeTwoObjects(result, args.shift(), 0, objects);
      }
      return result;
    }
    __name(merge, "merge");
    exports.merge = merge;
    function takeValue(value) {
      if (isArray(value)) {
        return value.slice();
      }
      return value;
    }
    __name(takeValue, "takeValue");
    function mergeTwoObjects(one, two, level = 0, objects) {
      let result;
      if (level > MAX_LEVEL) {
        return void 0;
      }
      level++;
      if (isPrimitive(one) || isPrimitive(two) || isFunction(two)) {
        result = takeValue(two);
      } else if (isArray(one)) {
        result = one.slice();
        if (isArray(two)) {
          for (let i2 = 0, j = two.length; i2 < j; i2++) {
            result.push(takeValue(two[i2]));
          }
        } else if (isObject(two)) {
          const keys = Object.keys(two);
          for (let i2 = 0, j = keys.length; i2 < j; i2++) {
            const key = keys[i2];
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
              continue;
            }
            result[key] = takeValue(two[key]);
          }
        }
      } else if (isObject(one)) {
        if (isObject(two)) {
          if (!shouldMerge(one, two)) {
            return two;
          }
          result = Object.assign({}, one);
          const keys = Object.keys(two);
          for (let i2 = 0, j = keys.length; i2 < j; i2++) {
            const key = keys[i2];
            if (key === "__proto__" || key === "constructor" || key === "prototype") {
              continue;
            }
            const twoValue = two[key];
            if (isPrimitive(twoValue)) {
              if (typeof twoValue === "undefined") {
                delete result[key];
              } else {
                result[key] = twoValue;
              }
            } else {
              const obj1 = result[key];
              const obj2 = twoValue;
              if (wasObjectReferenced(one, key, objects) || wasObjectReferenced(two, key, objects)) {
                delete result[key];
              } else {
                if (isObject(obj1) && isObject(obj2)) {
                  const arr1 = objects.get(obj1) || [];
                  const arr2 = objects.get(obj2) || [];
                  arr1.push({ obj: one, key });
                  arr2.push({ obj: two, key });
                  objects.set(obj1, arr1);
                  objects.set(obj2, arr2);
                }
                result[key] = mergeTwoObjects(result[key], twoValue, level, objects);
              }
            }
          }
        } else {
          result = two;
        }
      }
      return result;
    }
    __name(mergeTwoObjects, "mergeTwoObjects");
    function wasObjectReferenced(obj, key, objects) {
      const arr = objects.get(obj[key]) || [];
      for (let i2 = 0, j = arr.length; i2 < j; i2++) {
        const info = arr[i2];
        if (info.key === key && info.obj === obj) {
          return true;
        }
      }
      return false;
    }
    __name(wasObjectReferenced, "wasObjectReferenced");
    function isArray(value) {
      return Array.isArray(value);
    }
    __name(isArray, "isArray");
    function isFunction(value) {
      return typeof value === "function";
    }
    __name(isFunction, "isFunction");
    function isObject(value) {
      return !isPrimitive(value) && !isArray(value) && !isFunction(value) && typeof value === "object";
    }
    __name(isObject, "isObject");
    function isPrimitive(value) {
      return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "undefined" || value instanceof Date || value instanceof RegExp || value === null;
    }
    __name(isPrimitive, "isPrimitive");
    function shouldMerge(one, two) {
      if (!(0, lodash_merge_1.isPlainObject)(one) || !(0, lodash_merge_1.isPlainObject)(two)) {
        return false;
      }
      return true;
    }
    __name(shouldMerge, "shouldMerge");
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/timeout.js
var require_timeout = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/timeout.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callWithTimeout = exports.TimeoutError = void 0;
    var TimeoutError = class _TimeoutError extends Error {
      static {
        __name(this, "TimeoutError");
      }
      constructor(message) {
        super(message);
        Object.setPrototypeOf(this, _TimeoutError.prototype);
      }
    };
    exports.TimeoutError = TimeoutError;
    function callWithTimeout(promise, timeout) {
      let timeoutHandle;
      const timeoutPromise = new Promise(/* @__PURE__ */ __name(function timeoutFunction(_resolve, reject) {
        timeoutHandle = setTimeout(/* @__PURE__ */ __name(function timeoutHandler() {
          reject(new TimeoutError("Operation timed out."));
        }, "timeoutHandler"), timeout);
      }, "timeoutFunction"));
      return Promise.race([promise, timeoutPromise]).then((result) => {
        clearTimeout(timeoutHandle);
        return result;
      }, (reason) => {
        clearTimeout(timeoutHandle);
        throw reason;
      });
    }
    __name(callWithTimeout, "callWithTimeout");
    exports.callWithTimeout = callWithTimeout;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/url.js
var require_url = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/url.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isUrlIgnored = exports.urlMatches = void 0;
    function urlMatches(url, urlToMatch) {
      if (typeof urlToMatch === "string") {
        return url === urlToMatch;
      } else {
        return !!url.match(urlToMatch);
      }
    }
    __name(urlMatches, "urlMatches");
    exports.urlMatches = urlMatches;
    function isUrlIgnored(url, ignoredUrls) {
      if (!ignoredUrls) {
        return false;
      }
      for (const ignoreUrl of ignoredUrls) {
        if (urlMatches(url, ignoreUrl)) {
          return true;
        }
      }
      return false;
    }
    __name(isUrlIgnored, "isUrlIgnored");
    exports.isUrlIgnored = isUrlIgnored;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/promise.js
var require_promise = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/promise.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Deferred = void 0;
    var Deferred = class {
      static {
        __name(this, "Deferred");
      }
      _promise;
      _resolve;
      _reject;
      constructor() {
        this._promise = new Promise((resolve, reject) => {
          this._resolve = resolve;
          this._reject = reject;
        });
      }
      get promise() {
        return this._promise;
      }
      resolve(val) {
        this._resolve(val);
      }
      reject(err) {
        this._reject(err);
      }
    };
    exports.Deferred = Deferred;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/callback.js
var require_callback = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/callback.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BindOnceFuture = void 0;
    var promise_1 = require_promise();
    var BindOnceFuture = class {
      static {
        __name(this, "BindOnceFuture");
      }
      _isCalled = false;
      _deferred = new promise_1.Deferred();
      _callback;
      _that;
      constructor(callback, that) {
        this._callback = callback;
        this._that = that;
      }
      get isCalled() {
        return this._isCalled;
      }
      get promise() {
        return this._deferred.promise;
      }
      call(...args) {
        if (!this._isCalled) {
          this._isCalled = true;
          try {
            Promise.resolve(this._callback.call(this._that, ...args)).then((val) => this._deferred.resolve(val), (err) => this._deferred.reject(err));
          } catch (err) {
            this._deferred.reject(err);
          }
        }
        return this._deferred.promise;
      }
    };
    exports.BindOnceFuture = BindOnceFuture;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/configuration.js
var require_configuration = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/utils/configuration.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.diagLogLevelFromString = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var logLevelMap = {
      ALL: api_1.DiagLogLevel.ALL,
      VERBOSE: api_1.DiagLogLevel.VERBOSE,
      DEBUG: api_1.DiagLogLevel.DEBUG,
      INFO: api_1.DiagLogLevel.INFO,
      WARN: api_1.DiagLogLevel.WARN,
      ERROR: api_1.DiagLogLevel.ERROR,
      NONE: api_1.DiagLogLevel.NONE
    };
    function diagLogLevelFromString(value) {
      if (value == null) {
        return void 0;
      }
      const resolvedLogLevel = logLevelMap[value.toUpperCase()];
      if (resolvedLogLevel == null) {
        api_1.diag.warn(`Unknown log level "${value}", expected one of ${Object.keys(logLevelMap)}, using default`);
        return api_1.DiagLogLevel.INFO;
      }
      return resolvedLogLevel;
    }
    __name(diagLogLevelFromString, "diagLogLevelFromString");
    exports.diagLogLevelFromString = diagLogLevelFromString;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/internal/exporter.js
var require_exporter = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/internal/exporter.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._export = void 0;
    var api_1 = (init_esm2(), __toCommonJS(esm_exports));
    var suppress_tracing_1 = require_suppress_tracing();
    function _export(exporter, arg) {
      return new Promise((resolve) => {
        api_1.context.with((0, suppress_tracing_1.suppressTracing)(api_1.context.active()), () => {
          exporter.export(arg, resolve);
        });
      });
    }
    __name(_export, "_export");
    exports._export = _export;
  }
});

// node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/index.js
var require_src = __commonJS({
  "node_modules/.pnpm/@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1/node_modules/@opentelemetry/core/build/src/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.diagLogLevelFromString = exports.BindOnceFuture = exports.urlMatches = exports.isUrlIgnored = exports.callWithTimeout = exports.TimeoutError = exports.merge = exports.TraceState = exports.unsuppressTracing = exports.suppressTracing = exports.isTracingSuppressed = exports.setRPCMetadata = exports.getRPCMetadata = exports.deleteRPCMetadata = exports.RPCType = exports.parseTraceParent = exports.W3CTraceContextPropagator = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = exports.CompositePropagator = exports.otperformance = exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = exports._globalThis = exports.SDK_INFO = exports.parseKeyPairsIntoRecord = exports.ExportResultCode = exports.unrefTimer = exports.timeInputToHrTime = exports.millisToHrTime = exports.isTimeInputHrTime = exports.isTimeInput = exports.hrTimeToTimeStamp = exports.hrTimeToSeconds = exports.hrTimeToNanoseconds = exports.hrTimeToMilliseconds = exports.hrTimeToMicroseconds = exports.hrTimeDuration = exports.hrTime = exports.getTimeOrigin = exports.addHrTimes = exports.loggingErrorHandler = exports.setGlobalErrorHandler = exports.globalErrorHandler = exports.sanitizeAttributes = exports.isAttributeValue = exports.AnchoredClock = exports.W3CBaggagePropagator = void 0;
    exports.internal = void 0;
    var W3CBaggagePropagator_1 = require_W3CBaggagePropagator();
    Object.defineProperty(exports, "W3CBaggagePropagator", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CBaggagePropagator_1.W3CBaggagePropagator;
    }, "get") });
    var anchored_clock_1 = require_anchored_clock();
    Object.defineProperty(exports, "AnchoredClock", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return anchored_clock_1.AnchoredClock;
    }, "get") });
    var attributes_1 = require_attributes();
    Object.defineProperty(exports, "isAttributeValue", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return attributes_1.isAttributeValue;
    }, "get") });
    Object.defineProperty(exports, "sanitizeAttributes", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return attributes_1.sanitizeAttributes;
    }, "get") });
    var global_error_handler_1 = require_global_error_handler();
    Object.defineProperty(exports, "globalErrorHandler", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return global_error_handler_1.globalErrorHandler;
    }, "get") });
    Object.defineProperty(exports, "setGlobalErrorHandler", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return global_error_handler_1.setGlobalErrorHandler;
    }, "get") });
    var logging_error_handler_1 = require_logging_error_handler();
    Object.defineProperty(exports, "loggingErrorHandler", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return logging_error_handler_1.loggingErrorHandler;
    }, "get") });
    var time_1 = require_time();
    Object.defineProperty(exports, "addHrTimes", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.addHrTimes;
    }, "get") });
    Object.defineProperty(exports, "getTimeOrigin", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.getTimeOrigin;
    }, "get") });
    Object.defineProperty(exports, "hrTime", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTime;
    }, "get") });
    Object.defineProperty(exports, "hrTimeDuration", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeDuration;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToMicroseconds", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToMicroseconds;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToMilliseconds", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToMilliseconds;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToNanoseconds", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToNanoseconds;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToSeconds", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToSeconds;
    }, "get") });
    Object.defineProperty(exports, "hrTimeToTimeStamp", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.hrTimeToTimeStamp;
    }, "get") });
    Object.defineProperty(exports, "isTimeInput", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.isTimeInput;
    }, "get") });
    Object.defineProperty(exports, "isTimeInputHrTime", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.isTimeInputHrTime;
    }, "get") });
    Object.defineProperty(exports, "millisToHrTime", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.millisToHrTime;
    }, "get") });
    Object.defineProperty(exports, "timeInputToHrTime", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return time_1.timeInputToHrTime;
    }, "get") });
    var timer_util_1 = require_timer_util();
    Object.defineProperty(exports, "unrefTimer", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return timer_util_1.unrefTimer;
    }, "get") });
    var ExportResult_1 = require_ExportResult();
    Object.defineProperty(exports, "ExportResultCode", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ExportResult_1.ExportResultCode;
    }, "get") });
    var utils_1 = require_utils();
    Object.defineProperty(exports, "parseKeyPairsIntoRecord", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return utils_1.parseKeyPairsIntoRecord;
    }, "get") });
    var platform_1 = require_platform();
    Object.defineProperty(exports, "SDK_INFO", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.SDK_INFO;
    }, "get") });
    Object.defineProperty(exports, "_globalThis", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1._globalThis;
    }, "get") });
    Object.defineProperty(exports, "getStringFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.getStringFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getBooleanFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.getBooleanFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getNumberFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.getNumberFromEnv;
    }, "get") });
    Object.defineProperty(exports, "getStringListFromEnv", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.getStringListFromEnv;
    }, "get") });
    Object.defineProperty(exports, "otperformance", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return platform_1.otperformance;
    }, "get") });
    var composite_1 = require_composite();
    Object.defineProperty(exports, "CompositePropagator", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return composite_1.CompositePropagator;
    }, "get") });
    var W3CTraceContextPropagator_1 = require_W3CTraceContextPropagator();
    Object.defineProperty(exports, "TRACE_PARENT_HEADER", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CTraceContextPropagator_1.TRACE_PARENT_HEADER;
    }, "get") });
    Object.defineProperty(exports, "TRACE_STATE_HEADER", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CTraceContextPropagator_1.TRACE_STATE_HEADER;
    }, "get") });
    Object.defineProperty(exports, "W3CTraceContextPropagator", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CTraceContextPropagator_1.W3CTraceContextPropagator;
    }, "get") });
    Object.defineProperty(exports, "parseTraceParent", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return W3CTraceContextPropagator_1.parseTraceParent;
    }, "get") });
    var rpc_metadata_1 = require_rpc_metadata();
    Object.defineProperty(exports, "RPCType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return rpc_metadata_1.RPCType;
    }, "get") });
    Object.defineProperty(exports, "deleteRPCMetadata", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return rpc_metadata_1.deleteRPCMetadata;
    }, "get") });
    Object.defineProperty(exports, "getRPCMetadata", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return rpc_metadata_1.getRPCMetadata;
    }, "get") });
    Object.defineProperty(exports, "setRPCMetadata", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return rpc_metadata_1.setRPCMetadata;
    }, "get") });
    var suppress_tracing_1 = require_suppress_tracing();
    Object.defineProperty(exports, "isTracingSuppressed", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return suppress_tracing_1.isTracingSuppressed;
    }, "get") });
    Object.defineProperty(exports, "suppressTracing", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return suppress_tracing_1.suppressTracing;
    }, "get") });
    Object.defineProperty(exports, "unsuppressTracing", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return suppress_tracing_1.unsuppressTracing;
    }, "get") });
    var TraceState_1 = require_TraceState();
    Object.defineProperty(exports, "TraceState", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return TraceState_1.TraceState;
    }, "get") });
    var merge_1 = require_merge();
    Object.defineProperty(exports, "merge", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return merge_1.merge;
    }, "get") });
    var timeout_1 = require_timeout();
    Object.defineProperty(exports, "TimeoutError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return timeout_1.TimeoutError;
    }, "get") });
    Object.defineProperty(exports, "callWithTimeout", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return timeout_1.callWithTimeout;
    }, "get") });
    var url_1 = require_url();
    Object.defineProperty(exports, "isUrlIgnored", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return url_1.isUrlIgnored;
    }, "get") });
    Object.defineProperty(exports, "urlMatches", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return url_1.urlMatches;
    }, "get") });
    var callback_1 = require_callback();
    Object.defineProperty(exports, "BindOnceFuture", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return callback_1.BindOnceFuture;
    }, "get") });
    var configuration_1 = require_configuration();
    Object.defineProperty(exports, "diagLogLevelFromString", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return configuration_1.diagLogLevelFromString;
    }, "get") });
    var exporter_1 = require_exporter();
    exports.internal = {
      _export: exporter_1._export
    };
  }
});

// node_modules/.pnpm/@google-cloud+precise-date@4.0.0/node_modules/@google-cloud/precise-date/build/src/index.js
var require_src2 = __commonJS({
  "node_modules/.pnpm/@google-cloud+precise-date@4.0.0/node_modules/@google-cloud/precise-date/build/src/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PreciseDate = void 0;
    var FULL_ISO_REG = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{4,9}Z/;
    var NO_BIG_INT = "BigInt only available in Node >= v10.7. Consider using getFullTimeString instead.";
    var Sign;
    (function(Sign2) {
      Sign2[Sign2["NEGATIVE"] = -1] = "NEGATIVE";
      Sign2[Sign2["POSITIVE"] = 1] = "POSITIVE";
      Sign2[Sign2["ZERO"] = 0] = "ZERO";
    })(Sign || (Sign = {}));
    var PreciseDate = class _PreciseDate extends Date {
      static {
        __name(this, "PreciseDate");
      }
      constructor(time) {
        super();
        this._micros = 0;
        this._nanos = 0;
        if (time && typeof time !== "number" && !(time instanceof Date)) {
          this.setFullTime(_PreciseDate.parseFull(time));
          return;
        }
        const args = Array.from(arguments);
        const dateFields = args.slice(0, 7);
        const date = new Date(...dateFields);
        const nanos = args.length === 9 ? args.pop() : 0;
        const micros = args.length === 8 ? args.pop() : 0;
        this.setTime(date.getTime());
        this.setMicroseconds(micros);
        this.setNanoseconds(nanos);
      }
      /**
       * Returns the specified date represented in nanoseconds according to
       * universal time.
       *
       * **NOTE:** Because this method returns a `BigInt` it requires Node >= v10.7.
       * Use {@link PreciseDate#getFullTimeString} to get the time as a string.
       *
       * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
       *
       * @throws {error} If `BigInt` is unavailable.
       * @returns {bigint}
       *
       * @example
       * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
       *
       * console.log(date.getFullTime());
       * // expected output: 1549622069481145231n
       */
      getFullTime() {
        if (typeof BigInt !== "function") {
          throw new Error(NO_BIG_INT);
        }
        return BigInt(this.getFullTimeString());
      }
      /**
       * Returns a string of the specified date represented in nanoseconds according
       * to universal time.
       *
       * @returns {string}
       *
       * @example
       * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
       *
       * console.log(date.getFullTimeString());
       * // expected output: "1549622069481145231"
       */
      getFullTimeString() {
        const seconds = this._getSeconds();
        let nanos = this._getNanos();
        if (nanos && Math.sign(seconds) === Sign.NEGATIVE) {
          nanos = 1e9 - nanos;
        }
        return `${seconds}${padLeft(nanos, 9)}`;
      }
      /**
       * Returns the microseconds in the specified date according to universal time.
       *
       * @returns {number}
       *
       * @example
       * const date = new PreciseDate('2019-02-08T10:34:29.481145Z');
       *
       * console.log(date.getMicroseconds());
       * // expected output: 145
       */
      getMicroseconds() {
        return this._micros;
      }
      /**
       * Returns the nanoseconds in the specified date according to universal time.
       *
       * @returns {number}
       *
       * @example
       * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
       *
       * console.log(date.getNanoseconds());
       * // expected output: 231
       */
      getNanoseconds() {
        return this._nanos;
      }
      /**
       * Sets the microseconds for a specified date according to universal time.
       *
       * @param {number} microseconds A number representing the microseconds.
       * @returns {string} Returns a string representing the nanoseconds in the
       *     specified date according to universal time.
       *
       * @example
       * const date = new PreciseDate();
       *
       * date.setMicroseconds(149);
       *
       * console.log(date.getMicroseconds());
       * // expected output: 149
       */
      setMicroseconds(micros) {
        const abs = Math.abs(micros);
        let millis = this.getUTCMilliseconds();
        if (abs >= 1e3) {
          millis += Math.floor(abs / 1e3) * Math.sign(micros);
          micros %= 1e3;
        }
        if (Math.sign(micros) === Sign.NEGATIVE) {
          millis -= 1;
          micros += 1e3;
        }
        this._micros = micros;
        this.setUTCMilliseconds(millis);
        return this.getFullTimeString();
      }
      /**
       * Sets the nanoseconds for a specified date according to universal time.
       *
       * @param {number} nanoseconds A number representing the nanoseconds.
       * @returns {string} Returns a string representing the nanoseconds in the
       *     specified date according to universal time.
       *
       * @example
       * const date = new PreciseDate();
       *
       * date.setNanoseconds(231);
       *
       * console.log(date.getNanoseconds());
       * // expected output: 231
       */
      setNanoseconds(nanos) {
        const abs = Math.abs(nanos);
        let micros = this._micros;
        if (abs >= 1e3) {
          micros += Math.floor(abs / 1e3) * Math.sign(nanos);
          nanos %= 1e3;
        }
        if (Math.sign(nanos) === Sign.NEGATIVE) {
          micros -= 1;
          nanos += 1e3;
        }
        this._nanos = nanos;
        return this.setMicroseconds(micros);
      }
      /**
       * Sets the PreciseDate object to the time represented by a number of
       * nanoseconds since January 1, 1970, 00:00:00 UTC.
       *
       * @param {bigint|number|string} time Value representing the number of
       *     nanoseconds since January 1, 1970, 00:00:00 UTC.
       * @returns {string} Returns a string representing the nanoseconds in the
       *     specified date according to universal time (effectively, the value of
       *     the argument).
       *
       * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
       *
       * @example <caption>With a nanosecond string.</caption>
       * const date = new PreciseDate();
       * date.setFullTime('1549622069481145231');
       *
       * @example <caption>With a BigInt</caption>
       * date.setFullTime(1549622069481145231n);
       */
      setFullTime(time) {
        if (typeof time !== "string") {
          time = time.toString();
        }
        const sign = Math.sign(Number(time));
        time = time.replace(/^-/, "");
        const seconds = Number(time.substr(0, time.length - 9)) * sign;
        const nanos = Number(time.substr(-9)) * sign;
        this.setTime(seconds * 1e3);
        return this.setNanoseconds(nanos);
      }
      /**
       * Sets the PreciseDate object to the time represented by a number of
       * milliseconds since January 1, 1970, 00:00:00 UTC. Calling this method will
       * reset both the microseconds and nanoseconds to 0.
       *
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setTime|Date#setTime}
       *
       * @param {number} time Value representing the number of milliseconds since
       *     January 1, 1970, 00:00:00 UTC.
       * @returns {string} The number of milliseconds between January 1, 1970,
       *     00:00:00 UTC and the updated date (effectively, the value of the
       *     argument).
       */
      setTime(time) {
        this._micros = 0;
        this._nanos = 0;
        return super.setTime(time);
      }
      /**
       * Returns a string in RFC 3339 format. Unlike the native `Date#toISOString`,
       * this will return 9 digits to represent sub-second precision.
       *
       * @see {@link https://tools.ietf.org/html/rfc3339|RFC 3339}
       *
       * @returns {string}
       *
       * @example
       * const date = new PreciseDate(1549622069481145231n);
       *
       * console.log(date.toISOString());
       * // expected output: "2019-02-08T10:34:29.481145231Z"
       */
      toISOString() {
        const micros = padLeft(this._micros, 3);
        const nanos = padLeft(this._nanos, 3);
        return super.toISOString().replace(/z$/i, `${micros}${nanos}Z`);
      }
      /**
       * Returns an object representing the specified date according to universal
       * time.
       *
       * @see {@link https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#timestamp|google.protobuf.Timestamp}
       *
       * @returns {DateStruct}
       *
       * @example
       * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
       *
       * console.log(date.toStruct());
       * // expected output: {seconds: 1549622069, nanos: 481145231}
       */
      toStruct() {
        let seconds = this._getSeconds();
        const nanos = this._getNanos();
        const sign = Math.sign(seconds);
        if (sign === Sign.NEGATIVE && nanos) {
          seconds -= 1;
        }
        return { seconds, nanos };
      }
      /**
       * Returns a tuple representing the specified date according to universal
       * time.
       *
       * @returns {DateTuple}
       *
       * @example
       * const date = new PreciseDate('2019-02-08T10:34:29.481145231Z');
       *
       * console.log(date.toTuple());
       * // expected output: [1549622069, 481145231]
       */
      toTuple() {
        const { seconds, nanos } = this.toStruct();
        return [seconds, nanos];
      }
      /**
       * Returns the total number of seconds in the specified date since Unix epoch.
       * Numbers representing < epoch will be negative.
       *
       * @private
       *
       * @returns {number}
       */
      _getSeconds() {
        const time = this.getTime();
        const sign = Math.sign(time);
        return Math.floor(Math.abs(time) / 1e3) * sign;
      }
      /**
       * Returns the sub-second precision of the specified date. This will always be
       * a positive number.
       *
       * @private
       *
       * @returns {number}
       */
      _getNanos() {
        const msInNanos = this.getUTCMilliseconds() * 1e6;
        const microsInNanos = this._micros * 1e3;
        return this._nanos + msInNanos + microsInNanos;
      }
      /**
       * Parses a precise time.
       *
       * @static
       *
       * @param {string|bigint|DateTuple|DateStruct} time The precise time value.
       * @returns {string} Returns a string representing the nanoseconds in the
       *     specified date according to universal time.
       *
       * @example <caption>From a RFC 3339 formatted string.</caption>
       * const time = PreciseDate.parseFull('2019-02-08T10:34:29.481145231Z');
       * console.log(time); // expected output: "1549622069481145231"
       *
       * @example <caption>From a nanosecond timestamp string.</caption>
       * const time = PreciseDate.parseFull('1549622069481145231');
       * console.log(time); // expected output: "1549622069481145231"
       *
       * @example <caption>From a BigInt (requires Node >= v10.7)</caption>
       * const time = PreciseDate.parseFull(1549622069481145231n);
       * console.log(time); // expected output: "1549622069481145231"
       *
       * @example <caption>From a tuple.</caption>
       * const time = PreciseDate.parseFull([1549622069, 481145231]);
       * console.log(time); // expected output: "1549622069481145231"
       *
       * @example <caption>From an object.</caption>
       * const struct = {seconds: 1549622069, nanos: 481145231};
       * const time = PreciseDate.parseFull(struct);
       * console.log(time); // expected output: "1549622069481145231"
       */
      static parseFull(time) {
        const date = new _PreciseDate();
        if (Array.isArray(time)) {
          const [seconds, nanos] = time;
          time = { seconds, nanos };
        }
        if (isFullTime(time)) {
          date.setFullTime(time);
        } else if (isStruct(time)) {
          const { seconds, nanos } = parseProto(time);
          date.setTime(seconds * 1e3);
          date.setNanoseconds(nanos);
        } else if (isFullISOString(time)) {
          date.setFullTime(parseFullISO(time));
        } else {
          date.setTime(new Date(time).getTime());
        }
        return date.getFullTimeString();
      }
      /**
       * Accepts the same number parameters as the PreciseDate constructor, but
       * treats them as UTC. It returns a string that represents the number of
       * nanoseconds since January 1, 1970, 00:00:00 UTC.
       *
       * **NOTE:** Because this method returns a `BigInt` it requires Node >= v10.7.
       *
       * @see {@link https://github.com/tc39/proposal-bigint|BigInt}
       *
       * @static
       *
       * @throws {error} If `BigInt` is unavailable.
       *
       * @param {...number} [dateFields] The date fields.
       * @returns {bigint}
       *
       * @example
       * const time = PreciseDate.fullUTC(2019, 1, 8, 10, 34, 29, 481, 145, 231);
       * console.log(time); // expected output: 1549622069481145231n
       */
      static fullUTC(...args) {
        if (typeof BigInt !== "function") {
          throw new Error(NO_BIG_INT);
        }
        return BigInt(_PreciseDate.fullUTCString(...args));
      }
      /**
       * Accepts the same number parameters as the PreciseDate constructor, but
       * treats them as UTC. It returns a string that represents the number of
       * nanoseconds since January 1, 1970, 00:00:00 UTC.
       *
       * @static
       *
       * @param {...number} [dateFields] The date fields.
       * @returns {string}
       *
       * @example
       * const time = PreciseDate.fullUTCString(2019, 1, 8, 10, 34, 29, 481, 145,
       * 231); console.log(time); // expected output: '1549622069481145231'
       */
      static fullUTCString(...args) {
        const milliseconds = Date.UTC(...args.slice(0, 7));
        const date = new _PreciseDate(milliseconds);
        if (args.length === 9) {
          date.setNanoseconds(args.pop());
        }
        if (args.length === 8) {
          date.setMicroseconds(args.pop());
        }
        return date.getFullTimeString();
      }
    };
    exports.PreciseDate = PreciseDate;
    function parseFullISO(time) {
      let digits = "0";
      time = time.replace(/\.(\d+)/, ($0, $1) => {
        digits = $1;
        return ".000";
      });
      const nanos = Number(padRight(digits, 9));
      const date = new PreciseDate(time);
      return date.setNanoseconds(nanos);
    }
    __name(parseFullISO, "parseFullISO");
    function parseProto({ seconds = 0, nanos = 0 }) {
      if (typeof seconds.toNumber === "function") {
        seconds = seconds.toNumber();
      }
      seconds = Number(seconds);
      nanos = Number(nanos);
      return { seconds, nanos };
    }
    __name(parseProto, "parseProto");
    function isFullTime(time) {
      return typeof time === "bigint" || typeof time === "string" && /^\d+$/.test(time);
    }
    __name(isFullTime, "isFullTime");
    function isStruct(time) {
      return typeof time === "object" && typeof time.seconds !== "undefined" || typeof time.nanos === "number";
    }
    __name(isStruct, "isStruct");
    function isFullISOString(time) {
      return typeof time === "string" && FULL_ISO_REG.test(time);
    }
    __name(isFullISOString, "isFullISOString");
    function padLeft(n2, min) {
      const padding2 = getPadding(n2, min);
      return `${padding2}${n2}`;
    }
    __name(padLeft, "padLeft");
    function padRight(n2, min) {
      const padding2 = getPadding(n2, min);
      return `${n2}${padding2}`;
    }
    __name(padRight, "padRight");
    function getPadding(n2, min) {
      const size = Math.max(min - n2.toString().length, 0);
      return "0".repeat(size);
    }
    __name(getPadding, "getPadding");
  }
});

// node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/types/LogRecord.js
var require_LogRecord = __commonJS({
  "node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/types/LogRecord.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeverityNumber = void 0;
    var SeverityNumber;
    (function(SeverityNumber2) {
      SeverityNumber2[SeverityNumber2["UNSPECIFIED"] = 0] = "UNSPECIFIED";
      SeverityNumber2[SeverityNumber2["TRACE"] = 1] = "TRACE";
      SeverityNumber2[SeverityNumber2["TRACE2"] = 2] = "TRACE2";
      SeverityNumber2[SeverityNumber2["TRACE3"] = 3] = "TRACE3";
      SeverityNumber2[SeverityNumber2["TRACE4"] = 4] = "TRACE4";
      SeverityNumber2[SeverityNumber2["DEBUG"] = 5] = "DEBUG";
      SeverityNumber2[SeverityNumber2["DEBUG2"] = 6] = "DEBUG2";
      SeverityNumber2[SeverityNumber2["DEBUG3"] = 7] = "DEBUG3";
      SeverityNumber2[SeverityNumber2["DEBUG4"] = 8] = "DEBUG4";
      SeverityNumber2[SeverityNumber2["INFO"] = 9] = "INFO";
      SeverityNumber2[SeverityNumber2["INFO2"] = 10] = "INFO2";
      SeverityNumber2[SeverityNumber2["INFO3"] = 11] = "INFO3";
      SeverityNumber2[SeverityNumber2["INFO4"] = 12] = "INFO4";
      SeverityNumber2[SeverityNumber2["WARN"] = 13] = "WARN";
      SeverityNumber2[SeverityNumber2["WARN2"] = 14] = "WARN2";
      SeverityNumber2[SeverityNumber2["WARN3"] = 15] = "WARN3";
      SeverityNumber2[SeverityNumber2["WARN4"] = 16] = "WARN4";
      SeverityNumber2[SeverityNumber2["ERROR"] = 17] = "ERROR";
      SeverityNumber2[SeverityNumber2["ERROR2"] = 18] = "ERROR2";
      SeverityNumber2[SeverityNumber2["ERROR3"] = 19] = "ERROR3";
      SeverityNumber2[SeverityNumber2["ERROR4"] = 20] = "ERROR4";
      SeverityNumber2[SeverityNumber2["FATAL"] = 21] = "FATAL";
      SeverityNumber2[SeverityNumber2["FATAL2"] = 22] = "FATAL2";
      SeverityNumber2[SeverityNumber2["FATAL3"] = 23] = "FATAL3";
      SeverityNumber2[SeverityNumber2["FATAL4"] = 24] = "FATAL4";
    })(SeverityNumber = exports.SeverityNumber || (exports.SeverityNumber = {}));
  }
});

// node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/NoopLogger.js
var require_NoopLogger = __commonJS({
  "node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/NoopLogger.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createNoopLogger = exports.NOOP_LOGGER = exports.NoopLogger = void 0;
    var NoopLogger = class {
      static {
        __name(this, "NoopLogger");
      }
      emit(_logRecord) {
      }
      enabled() {
        return false;
      }
    };
    exports.NoopLogger = NoopLogger;
    exports.NOOP_LOGGER = new NoopLogger();
    function createNoopLogger() {
      return exports.NOOP_LOGGER;
    }
    __name(createNoopLogger, "createNoopLogger");
    exports.createNoopLogger = createNoopLogger;
  }
});

// node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/internal/global-utils.js
var require_global_utils = __commonJS({
  "node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/internal/global-utils.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.API_BACKWARDS_COMPATIBILITY_VERSION = exports.makeGetter = exports._global = exports.GLOBAL_LOGS_API_KEY = void 0;
    exports.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
    exports._global = globalThis;
    function makeGetter(requiredVersion, instance, fallback) {
      return (version) => version === requiredVersion ? instance : fallback;
    }
    __name(makeGetter, "makeGetter");
    exports.makeGetter = makeGetter;
    exports.API_BACKWARDS_COMPATIBILITY_VERSION = 1;
  }
});

// node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/NoopLoggerProvider.js
var require_NoopLoggerProvider = __commonJS({
  "node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/NoopLoggerProvider.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NOOP_LOGGER_PROVIDER = exports.NoopLoggerProvider = void 0;
    var NoopLogger_1 = require_NoopLogger();
    var NoopLoggerProvider = class {
      static {
        __name(this, "NoopLoggerProvider");
      }
      getLogger(_name, _version, _options) {
        return new NoopLogger_1.NoopLogger();
      }
    };
    exports.NoopLoggerProvider = NoopLoggerProvider;
    exports.NOOP_LOGGER_PROVIDER = new NoopLoggerProvider();
  }
});

// node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/ProxyLogger.js
var require_ProxyLogger = __commonJS({
  "node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/ProxyLogger.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyLogger = void 0;
    var NoopLogger_1 = require_NoopLogger();
    var ProxyLogger = class {
      static {
        __name(this, "ProxyLogger");
      }
      constructor(provider, name, version, options) {
        this._provider = provider;
        this.name = name;
        this.version = version;
        this.options = options;
      }
      /**
       * Emit a log record. This method should only be used by log appenders.
       *
       * @param logRecord
       */
      emit(logRecord) {
        this._getLogger().emit(logRecord);
      }
      enabled(options) {
        return this._getLogger().enabled(options);
      }
      /**
       * Try to get a logger from the proxy logger provider.
       * If the proxy logger provider has no delegate, return a noop logger.
       */
      _getLogger() {
        if (this._delegate) {
          return this._delegate;
        }
        const logger = this._provider._getDelegateLogger(this.name, this.version, this.options);
        if (!logger) {
          return NoopLogger_1.NOOP_LOGGER;
        }
        this._delegate = logger;
        return this._delegate;
      }
    };
    exports.ProxyLogger = ProxyLogger;
  }
});

// node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/ProxyLoggerProvider.js
var require_ProxyLoggerProvider = __commonJS({
  "node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/ProxyLoggerProvider.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyLoggerProvider = void 0;
    var NoopLoggerProvider_1 = require_NoopLoggerProvider();
    var ProxyLogger_1 = require_ProxyLogger();
    var ProxyLoggerProvider = class {
      static {
        __name(this, "ProxyLoggerProvider");
      }
      getLogger(name, version, options) {
        var _a;
        return (_a = this._getDelegateLogger(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyLogger_1.ProxyLogger(this, name, version, options);
      }
      /**
       * Get the delegate logger provider.
       * Used by tests only.
       * @internal
       */
      _getDelegate() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER;
      }
      /**
       * Set the delegate logger provider
       * @internal
       */
      _setDelegate(delegate) {
        this._delegate = delegate;
      }
      /**
       * @internal
       */
      _getDelegateLogger(name, version, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getLogger(name, version, options);
      }
    };
    exports.ProxyLoggerProvider = ProxyLoggerProvider;
  }
});

// node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/api/logs.js
var require_logs = __commonJS({
  "node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/api/logs.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LogsAPI = void 0;
    var global_utils_1 = require_global_utils();
    var NoopLoggerProvider_1 = require_NoopLoggerProvider();
    var ProxyLoggerProvider_1 = require_ProxyLoggerProvider();
    var LogsAPI = class _LogsAPI {
      static {
        __name(this, "LogsAPI");
      }
      constructor() {
        this._proxyLoggerProvider = new ProxyLoggerProvider_1.ProxyLoggerProvider();
      }
      static getInstance() {
        if (!this._instance) {
          this._instance = new _LogsAPI();
        }
        return this._instance;
      }
      setGlobalLoggerProvider(provider) {
        if (global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) {
          return this.getLoggerProvider();
        }
        global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY] = (0, global_utils_1.makeGetter)(global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION, provider, NoopLoggerProvider_1.NOOP_LOGGER_PROVIDER);
        this._proxyLoggerProvider._setDelegate(provider);
        return provider;
      }
      /**
       * Returns the global logger provider.
       *
       * @returns LoggerProvider
       */
      getLoggerProvider() {
        var _a, _b;
        return (_b = (_a = global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY]) === null || _a === void 0 ? void 0 : _a.call(global_utils_1._global, global_utils_1.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b !== void 0 ? _b : this._proxyLoggerProvider;
      }
      /**
       * Returns a Logger, creating one if one with the given name, version,
       * schemaUrl, and attributes is not already created.
       *
       * Getting a Logger may be expensive, especially when `attributes` are
       * provided. Reuse Logger instances where possible instead of calling
       * `getLogger()` on hot paths.
       *
       * @param name The name of the logger or instrumentation library.
       * @param version The version of the logger or instrumentation library.
       * @param options The options of the logger or instrumentation library.
       * @returns {@link Logger}
       */
      getLogger(name, version, options) {
        return this.getLoggerProvider().getLogger(name, version, options);
      }
      /** Remove the global logger provider */
      disable() {
        delete global_utils_1._global[global_utils_1.GLOBAL_LOGS_API_KEY];
        this._proxyLoggerProvider = new ProxyLoggerProvider_1.ProxyLoggerProvider();
      }
    };
    exports.LogsAPI = LogsAPI;
  }
});

// node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/index.js
var require_src3 = __commonJS({
  "node_modules/.pnpm/@opentelemetry+api-logs@0.219.0/node_modules/@opentelemetry/api-logs/build/src/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logs = exports.createNoopLogger = exports.SeverityNumber = void 0;
    var LogRecord_1 = require_LogRecord();
    Object.defineProperty(exports, "SeverityNumber", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return LogRecord_1.SeverityNumber;
    }, "get") });
    var NoopLogger_1 = require_NoopLogger();
    Object.defineProperty(exports, "createNoopLogger", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return NoopLogger_1.createNoopLogger;
    }, "get") });
    var logs_1 = require_logs();
    exports.logs = logs_1.LogsAPI.getInstance();
  }
});

// node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/query-result.js
var require_query_result = __commonJS({
  "node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/query-result.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    var QueryResult = (
      /** @class */
      function() {
        function QueryResult2(depth, path, object) {
          this.depth = 0;
          this.depth = depth;
          this.path = path;
          this.object = object;
        }
        __name(QueryResult2, "QueryResult");
        QueryResult2.prototype.flatten = function() {
          var flattenedObject = this.object;
          if (typeof this.object === "object" && Array.isArray(this.object) && this.depth > 0) {
            flattenedObject = this.object.flat(this.depth);
          }
          return new QueryResult2(0, this.path, flattenedObject);
        };
        return QueryResult2;
      }()
    );
    exports.default = QueryResult;
  }
});

// node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/simple-key-path-component.js
var require_simple_key_path_component = __commonJS({
  "node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/simple-key-path-component.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleKeyPathComponent = void 0;
    var query_result_1 = require_query_result();
    var SimpleKeyPathComponent = (
      /** @class */
      function() {
        function SimpleKeyPathComponent2(keyName) {
          this.isArray = false;
          this.keyName = keyName;
          var keyAsInteger = parseInt(this.keyName, 10);
          if (isNaN(keyAsInteger)) {
            return;
          }
          var isInteger = Number.isInteger(keyAsInteger);
          if (!isInteger) {
            return;
          }
          if (keyAsInteger < 0) {
            return;
          }
          this.isArray = true;
        }
        __name(SimpleKeyPathComponent2, "SimpleKeyPathComponent");
        SimpleKeyPathComponent2.fromString = function(string) {
          var keyName = string;
          SimpleKeyPathComponent2.unescapeExpressions.forEach(function(unescapePair) {
            keyName = keyName.replace(unescapePair.search, unescapePair.replacement);
          });
          return new SimpleKeyPathComponent2(keyName);
        };
        SimpleKeyPathComponent2.prototype.toString = function() {
          var escapedString = this.keyName;
          SimpleKeyPathComponent2.escapeExpressions.forEach(function(escapePair) {
            escapedString = escapedString.replace(escapePair.search, escapePair.replacement);
          });
          return escapedString;
        };
        SimpleKeyPathComponent2.prototype.jsonPointer = function() {
          var escapedString = this.keyName;
          escapedString = escapedString.replace(/(\~)/g, "~0");
          escapedString = escapedString.replace(/(\/)/g, "~1");
          return escapedString;
        };
        SimpleKeyPathComponent2.prototype.query = function(results) {
          var newResults = [];
          for (var i2 = 0; i2 < results.length; i2++) {
            var result = results[i2];
            var object = result.object;
            if (typeof object !== "object") {
              continue;
            }
            var newObject = object[this.keyName];
            if (newObject === null) {
              continue;
            }
            var newResult = new query_result_1.default(result.depth, result.path.child(this.keyName), newObject);
            newResults.push(newResult);
          }
          return newResults;
        };
        SimpleKeyPathComponent2.escapeExpressions = [
          { search: new RegExp(/(\\)/g), replacement: "\\" },
          { search: new RegExp(/(\.)/g), replacement: "\\." }
        ];
        SimpleKeyPathComponent2.unescapeExpressions = [
          { search: new RegExp(/(\\\.)/g), replacement: "." },
          { search: new RegExp(/(\\\\)/g), replacement: "\\" },
          { search: "~1", replacement: "/" }
        ];
        return SimpleKeyPathComponent2;
      }()
    );
    exports.SimpleKeyPathComponent = SimpleKeyPathComponent;
  }
});

// node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/wildcard-path-component.js
var require_wildcard_path_component = __commonJS({
  "node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/wildcard-path-component.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WildcardPathComponent = void 0;
    var query_result_1 = require_query_result();
    var WildcardPathComponent = (
      /** @class */
      function() {
        function WildcardPathComponent2() {
          this.keyName = "*";
          this.isArray = true;
        }
        __name(WildcardPathComponent2, "WildcardPathComponent");
        WildcardPathComponent2.fromString = function(string) {
          if (string === "*") {
            return new WildcardPathComponent2();
          }
          return null;
        };
        WildcardPathComponent2.prototype.toString = function() {
          return this.keyName;
        };
        WildcardPathComponent2.prototype.jsonPointer = function() {
          throw Error("JSON Pointers don't work with wildcards");
        };
        WildcardPathComponent2.prototype.query = function(results) {
          var newResults = [];
          for (var i2 = 0; i2 < results.length; i2++) {
            var result = results[i2];
            var object = result.object;
            if (typeof object !== "object") {
              continue;
            }
            for (var key in object) {
              var newObject = object[key];
              var newResult = new query_result_1.default(result.depth + 1, result.path.child(key), newObject);
              newResults.push(newResult);
            }
          }
          return newResults;
        };
        return WildcardPathComponent2;
      }()
    );
    exports.WildcardPathComponent = WildcardPathComponent;
  }
});

// node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/start-path-component.js
var require_start_path_component = __commonJS({
  "node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/start-path-component.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    var StartPathComponent = (
      /** @class */
      function() {
        function StartPathComponent2() {
          this.keyName = "$";
          this.isArray = false;
        }
        __name(StartPathComponent2, "StartPathComponent");
        StartPathComponent2.fromString = function(string) {
          if (string === "$") {
            return new StartPathComponent2();
          }
          return null;
        };
        StartPathComponent2.prototype.toString = function() {
          return this.keyName;
        };
        StartPathComponent2.prototype.jsonPointer = function() {
          return "";
        };
        StartPathComponent2.prototype.query = function(objects) {
          return objects;
        };
        return StartPathComponent2;
      }()
    );
    exports.default = StartPathComponent;
  }
});

// node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/slice-path-component.js
var require_slice_path_component = __commonJS({
  "node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/slice-path-component.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SlicePathComponent = void 0;
    var query_result_1 = require_query_result();
    var SlicePathComponent = (
      /** @class */
      function() {
        function SlicePathComponent2(startIndex, endIndex) {
          this.endIndex = null;
          this.isArray = true;
          this.startIndex = startIndex;
          this.endIndex = endIndex;
        }
        __name(SlicePathComponent2, "SlicePathComponent");
        SlicePathComponent2.fromString = function(string) {
          if (!SlicePathComponent2.regex.test(string)) {
            return null;
          }
          SlicePathComponent2.regex.lastIndex = 0;
          var result = SlicePathComponent2.regex.exec(string);
          if (result == null || result.groups == null) {
            return null;
          }
          var startResult = result.groups.startIndex;
          var endResult = result.groups.endIndex;
          var startIndex = startResult == null || startResult === "" ? 0 : parseInt(startResult, 10);
          var endIndex = endResult == null ? null : parseInt(endResult, 10);
          if (startIndex == null && endIndex == null) {
            return null;
          }
          var isStartInteger = Number.isInteger(startIndex);
          if (!isStartInteger) {
            return null;
          }
          return new SlicePathComponent2(startIndex, endIndex);
        };
        SlicePathComponent2.prototype.toString = function() {
          return "[".concat(this.startIndex).concat(this.endIndex == null ? "" : ":" + this.endIndex, "]");
        };
        SlicePathComponent2.prototype.jsonPointer = function() {
          throw Error("JSON Pointers don't work with wildcards");
        };
        SlicePathComponent2.prototype.query = function(results) {
          var newResults = [];
          for (var i2 = 0; i2 < results.length; i2++) {
            var result = results[i2];
            var object = result.object;
            if (typeof object !== "object")
              continue;
            if (!Array.isArray(object))
              continue;
            var slicedItems = void 0;
            if (this.endIndex == null) {
              slicedItems = object.slice(this.startIndex);
            } else {
              slicedItems = object.slice(this.startIndex, this.endIndex);
            }
            for (var j = 0; j < slicedItems.length; j++) {
              var slicedItem = slicedItems[j];
              newResults.push(new query_result_1.default(result.depth + 1, result.path.child("".concat(j + this.startIndex)), slicedItem));
            }
          }
          return newResults;
        };
        SlicePathComponent2.regex = /^\[(?<startIndex>[0-9]*):(?<endIndex>\-?[0-9]*)?\]$/g;
        return SlicePathComponent2;
      }()
    );
    exports.SlicePathComponent = SlicePathComponent;
  }
});

// node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/path-builder.js
var require_path_builder = __commonJS({
  "node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/path/path-builder.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    var simple_key_path_component_1 = require_simple_key_path_component();
    var wildcard_path_component_1 = require_wildcard_path_component();
    var start_path_component_1 = require_start_path_component();
    var slice_path_component_1 = require_slice_path_component();
    var PathBuilder = (
      /** @class */
      function() {
        function PathBuilder2() {
        }
        __name(PathBuilder2, "PathBuilder");
        PathBuilder2.prototype.parse = function(path) {
          PathBuilder2.pathPattern.lastIndex = 0;
          var subPaths = path.match(PathBuilder2.pathPattern);
          var components = [new start_path_component_1.default()];
          if (subPaths == null || subPaths.length == 0 || subPaths.length == 1 && subPaths[0] == "") {
            return components;
          }
          var startIndex = 0;
          if (subPaths[0] == "$") {
            startIndex = 1;
          }
          for (var i2 = startIndex; i2 < subPaths.length; i2++) {
            var subPath = subPaths[i2];
            var pathComponent = this.parseComponent(subPath);
            components.push(pathComponent);
          }
          return components;
        };
        PathBuilder2.prototype.parsePointer = function(pointer) {
          PathBuilder2.pathPattern.lastIndex = 0;
          var subPaths = pointer.match(PathBuilder2.pointerPattern);
          var components = [new start_path_component_1.default()];
          if (subPaths == null || subPaths.length == 0 || subPaths.length == 1 && subPaths[0] == "") {
            return components;
          }
          for (var _i = 0, subPaths_1 = subPaths; _i < subPaths_1.length; _i++) {
            var subPath = subPaths_1[_i];
            components.push(this.parseComponent(subPath));
          }
          return components;
        };
        PathBuilder2.prototype.parseComponent = function(string) {
          var wildcardComponent = wildcard_path_component_1.WildcardPathComponent.fromString(string);
          if (wildcardComponent != null) {
            return wildcardComponent;
          }
          if (string == null) {
            throw new SyntaxError("Cannot create a path from null");
          }
          if (string == "") {
            throw new SyntaxError("Cannot create a path from an empty string");
          }
          var sliceComponent = slice_path_component_1.SlicePathComponent.fromString(string);
          if (sliceComponent != null) {
            return sliceComponent;
          }
          return simple_key_path_component_1.SimpleKeyPathComponent.fromString(string);
        };
        PathBuilder2.pathPattern = /(?:[^\.\\]|\\.)+/g;
        PathBuilder2.pointerPattern = /(?:[^\/\\]|\\\/)+/g;
        return PathBuilder2;
      }()
    );
    exports.default = PathBuilder;
  }
});

// node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/@jsonhero+path@1.0.21/node_modules/@jsonhero/path/lib/index.js"(exports) {
    "use strict";
    init_esm();
    var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
      if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
        if (ar || !(i2 in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
          ar[i2] = from[i2];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JSONHeroPath = void 0;
    var path_builder_1 = require_path_builder();
    var query_result_1 = require_query_result();
    var start_path_component_1 = require_start_path_component();
    var JSONHeroPath = (
      /** @class */
      function() {
        function JSONHeroPath2(components) {
          if (typeof components == "string") {
            var pathBuilder = new path_builder_1.default();
            this.components = pathBuilder.parse(components);
            return;
          }
          if (components.length == 0) {
            components.push(new start_path_component_1.default());
          }
          if (!(components[0] instanceof start_path_component_1.default)) {
            components.unshift(new start_path_component_1.default());
          }
          this.components = components;
        }
        __name(JSONHeroPath2, "JSONHeroPath");
        JSONHeroPath2.fromPointer = function(pointer) {
          var pathBuilder = new path_builder_1.default();
          return new JSONHeroPath2(pathBuilder.parsePointer(pointer));
        };
        Object.defineProperty(JSONHeroPath2.prototype, "root", {
          get: /* @__PURE__ */ __name(function() {
            return new JSONHeroPath2(this.components.slice(0, 1));
          }, "get"),
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(JSONHeroPath2.prototype, "isRoot", {
          get: /* @__PURE__ */ __name(function() {
            if (this.components.length > 1)
              return false;
            return this.components[0] instanceof start_path_component_1.default;
          }, "get"),
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(JSONHeroPath2.prototype, "parent", {
          get: /* @__PURE__ */ __name(function() {
            if (this.components.length == 1) {
              return null;
            }
            return new JSONHeroPath2(this.components.slice(0, -1));
          }, "get"),
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(JSONHeroPath2.prototype, "lastComponent", {
          get: /* @__PURE__ */ __name(function() {
            if (this.components.length === 0)
              return;
            return this.components[this.components.length - 1];
          }, "get"),
          enumerable: false,
          configurable: true
        });
        JSONHeroPath2.prototype.child = function(key) {
          var string = this.toString();
          return new JSONHeroPath2(string.concat(".".concat(key)));
        };
        JSONHeroPath2.prototype.replaceComponent = function(index, newKey) {
          var pathBuilder = new path_builder_1.default();
          var newComponent = pathBuilder.parseComponent(newKey);
          var newComponents = __spreadArray([], this.components, true);
          newComponents[index] = newComponent;
          return new JSONHeroPath2(newComponents);
        };
        JSONHeroPath2.prototype.toString = function() {
          return this.components.map(function(component) {
            return component.toString();
          }).join(".");
        };
        JSONHeroPath2.prototype.jsonPointer = function() {
          if (this.components.length === 1)
            return "";
          return this.components.map(function(component) {
            return component.jsonPointer();
          }).join("/");
        };
        JSONHeroPath2.prototype.first = function(object, options) {
          if (options === void 0) {
            options = { includePath: false };
          }
          var results = this.all(object, options);
          if (results === null || results.length === 0) {
            return null;
          }
          return results[0];
        };
        JSONHeroPath2.prototype.all = function(object, options) {
          if (options === void 0) {
            options = { includePath: false };
          }
          if (this.components.length == 0)
            return [object];
          if (this.components.length == 1 && this.components[0] instanceof start_path_component_1.default)
            return [object];
          var results = [];
          var firstResult = new query_result_1.default(0, this.root, object);
          results.push(firstResult);
          for (var i2 = 0; i2 < this.components.length; i2++) {
            var component = this.components[i2];
            results = component.query(results);
            if (results === null || results.length === 0) {
              return [];
            }
          }
          var flattenedResults = results.map(function(result) {
            return result.flatten();
          });
          if (!options.includePath) {
            return flattenedResults.map(function(result) {
              return result.object;
            });
          }
          var all = [];
          for (var i2 = 0; i2 < flattenedResults.length; i2++) {
            var flattenedResult = flattenedResults[i2];
            var object_1 = {
              value: flattenedResult.object
            };
            if (options.includePath) {
              object_1.path = flattenedResult.path;
            }
            all.push(object_1);
          }
          return all;
        };
        JSONHeroPath2.prototype.set = function(object, newValue) {
          var allResults = this.all(object, { includePath: true });
          allResults.forEach(function(_a) {
            var path = _a.path;
            var parentPath = path.parent;
            var parentObject = parentPath === null || parentPath === void 0 ? void 0 : parentPath.first(object);
            if (!path.lastComponent)
              return;
            parentObject[path.lastComponent.toString()] = newValue;
          });
        };
        JSONHeroPath2.prototype.merge = function(object, mergeValue) {
          var allResults = this.all(object, { includePath: true });
          allResults.forEach(function(_a) {
            var path = _a.path;
            var parentPath = path.parent;
            var parentObject = parentPath === null || parentPath === void 0 ? void 0 : parentPath.first(object);
            if (!path.lastComponent)
              return;
            var existingValue = parentObject[path.lastComponent.toString()];
            if (Array.isArray(existingValue)) {
              parentObject[path.lastComponent.toString()] = existingValue.concat([mergeValue].flat());
            } else {
              if (typeof mergeValue != "object" || Array.isArray(mergeValue))
                return;
              for (var key in mergeValue) {
                existingValue[key] = mergeValue[key];
              }
            }
          });
        };
        return JSONHeroPath2;
      }()
    );
    exports.JSONHeroPath = JSONHeroPath;
  }
});

// node_modules/.pnpm/@microsoft+fetch-event-source@2.0.1/node_modules/@microsoft/fetch-event-source/lib/cjs/parse.js
var require_parse = __commonJS({
  "node_modules/.pnpm/@microsoft+fetch-event-source@2.0.1/node_modules/@microsoft/fetch-event-source/lib/cjs/parse.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getMessages = exports.getLines = exports.getBytes = void 0;
    async function getBytes(stream, onChunk) {
      const reader = stream.getReader();
      let result;
      while (!(result = await reader.read()).done) {
        onChunk(result.value);
      }
    }
    __name(getBytes, "getBytes");
    exports.getBytes = getBytes;
    function getLines(onLine) {
      let buffer;
      let position;
      let fieldLength;
      let discardTrailingNewline = false;
      return /* @__PURE__ */ __name(function onChunk(arr) {
        if (buffer === void 0) {
          buffer = arr;
          position = 0;
          fieldLength = -1;
        } else {
          buffer = concat(buffer, arr);
        }
        const bufLength = buffer.length;
        let lineStart = 0;
        while (position < bufLength) {
          if (discardTrailingNewline) {
            if (buffer[position] === 10) {
              lineStart = ++position;
            }
            discardTrailingNewline = false;
          }
          let lineEnd = -1;
          for (; position < bufLength && lineEnd === -1; ++position) {
            switch (buffer[position]) {
              case 58:
                if (fieldLength === -1) {
                  fieldLength = position - lineStart;
                }
                break;
              case 13:
                discardTrailingNewline = true;
              case 10:
                lineEnd = position;
                break;
            }
          }
          if (lineEnd === -1) {
            break;
          }
          onLine(buffer.subarray(lineStart, lineEnd), fieldLength);
          lineStart = position;
          fieldLength = -1;
        }
        if (lineStart === bufLength) {
          buffer = void 0;
        } else if (lineStart !== 0) {
          buffer = buffer.subarray(lineStart);
          position -= lineStart;
        }
      }, "onChunk");
    }
    __name(getLines, "getLines");
    exports.getLines = getLines;
    function getMessages(onId, onRetry, onMessage) {
      let message = newMessage();
      const decoder = new TextDecoder();
      return /* @__PURE__ */ __name(function onLine(line, fieldLength) {
        if (line.length === 0) {
          onMessage === null || onMessage === void 0 ? void 0 : onMessage(message);
          message = newMessage();
        } else if (fieldLength > 0) {
          const field = decoder.decode(line.subarray(0, fieldLength));
          const valueOffset = fieldLength + (line[fieldLength + 1] === 32 ? 2 : 1);
          const value = decoder.decode(line.subarray(valueOffset));
          switch (field) {
            case "data":
              message.data = message.data ? message.data + "\n" + value : value;
              break;
            case "event":
              message.event = value;
              break;
            case "id":
              onId(message.id = value);
              break;
            case "retry":
              const retry = parseInt(value, 10);
              if (!isNaN(retry)) {
                onRetry(message.retry = retry);
              }
              break;
          }
        }
      }, "onLine");
    }
    __name(getMessages, "getMessages");
    exports.getMessages = getMessages;
    function concat(a2, b2) {
      const res = new Uint8Array(a2.length + b2.length);
      res.set(a2);
      res.set(b2, a2.length);
      return res;
    }
    __name(concat, "concat");
    function newMessage() {
      return {
        data: "",
        event: "",
        id: "",
        retry: void 0
      };
    }
    __name(newMessage, "newMessage");
  }
});

// node_modules/.pnpm/@microsoft+fetch-event-source@2.0.1/node_modules/@microsoft/fetch-event-source/lib/cjs/fetch.js
var require_fetch = __commonJS({
  "node_modules/.pnpm/@microsoft+fetch-event-source@2.0.1/node_modules/@microsoft/fetch-event-source/lib/cjs/fetch.js"(exports) {
    "use strict";
    init_esm();
    var __rest = exports && exports.__rest || function(s, e) {
      var t2 = {};
      for (var p2 in s) if (Object.prototype.hasOwnProperty.call(s, p2) && e.indexOf(p2) < 0)
        t2[p2] = s[p2];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s); i2 < p2.length; i2++) {
          if (e.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i2]))
            t2[p2[i2]] = s[p2[i2]];
        }
      return t2;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fetchEventSource = exports.EventStreamContentType = void 0;
    var parse_1 = require_parse();
    exports.EventStreamContentType = "text/event-stream";
    var DefaultRetryInterval = 1e3;
    var LastEventId = "last-event-id";
    function fetchEventSource2(input, _a) {
      var { signal: inputSignal, headers: inputHeaders, onopen: inputOnOpen, onmessage, onclose, onerror, openWhenHidden, fetch: inputFetch } = _a, rest = __rest(_a, ["signal", "headers", "onopen", "onmessage", "onclose", "onerror", "openWhenHidden", "fetch"]);
      return new Promise((resolve, reject) => {
        const headers = Object.assign({}, inputHeaders);
        if (!headers.accept) {
          headers.accept = exports.EventStreamContentType;
        }
        let curRequestController;
        function onVisibilityChange() {
          curRequestController.abort();
          if (!document.hidden) {
            create();
          }
        }
        __name(onVisibilityChange, "onVisibilityChange");
        if (!openWhenHidden) {
          document.addEventListener("visibilitychange", onVisibilityChange);
        }
        let retryInterval = DefaultRetryInterval;
        let retryTimer = 0;
        function dispose() {
          document.removeEventListener("visibilitychange", onVisibilityChange);
          window.clearTimeout(retryTimer);
          curRequestController.abort();
        }
        __name(dispose, "dispose");
        inputSignal === null || inputSignal === void 0 ? void 0 : inputSignal.addEventListener("abort", () => {
          dispose();
          resolve();
        });
        const fetch2 = inputFetch !== null && inputFetch !== void 0 ? inputFetch : window.fetch;
        const onopen = inputOnOpen !== null && inputOnOpen !== void 0 ? inputOnOpen : defaultOnOpen;
        async function create() {
          var _a2;
          curRequestController = new AbortController();
          try {
            const response = await fetch2(input, Object.assign(Object.assign({}, rest), { headers, signal: curRequestController.signal }));
            await onopen(response);
            await parse_1.getBytes(response.body, parse_1.getLines(parse_1.getMessages((id) => {
              if (id) {
                headers[LastEventId] = id;
              } else {
                delete headers[LastEventId];
              }
            }, (retry) => {
              retryInterval = retry;
            }, onmessage)));
            onclose === null || onclose === void 0 ? void 0 : onclose();
            dispose();
            resolve();
          } catch (err) {
            if (!curRequestController.signal.aborted) {
              try {
                const interval = (_a2 = onerror === null || onerror === void 0 ? void 0 : onerror(err)) !== null && _a2 !== void 0 ? _a2 : retryInterval;
                window.clearTimeout(retryTimer);
                retryTimer = window.setTimeout(create, interval);
              } catch (innerErr) {
                dispose();
                reject(innerErr);
              }
            }
          }
        }
        __name(create, "create");
        create();
      });
    }
    __name(fetchEventSource2, "fetchEventSource");
    exports.fetchEventSource = fetchEventSource2;
    function defaultOnOpen(response) {
      const contentType = response.headers.get("content-type");
      if (!(contentType === null || contentType === void 0 ? void 0 : contentType.startsWith(exports.EventStreamContentType))) {
        throw new Error(`Expected content-type to be ${exports.EventStreamContentType}, Actual: ${contentType}`);
      }
    }
    __name(defaultOnOpen, "defaultOnOpen");
  }
});

// node_modules/.pnpm/@microsoft+fetch-event-source@2.0.1/node_modules/@microsoft/fetch-event-source/lib/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/.pnpm/@microsoft+fetch-event-source@2.0.1/node_modules/@microsoft/fetch-event-source/lib/cjs/index.js"(exports) {
    "use strict";
    init_esm();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventStreamContentType = exports.fetchEventSource = void 0;
    var fetch_1 = require_fetch();
    Object.defineProperty(exports, "fetchEventSource", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return fetch_1.fetchEventSource;
    }, "get") });
    Object.defineProperty(exports, "EventStreamContentType", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return fetch_1.EventStreamContentType;
    }, "get") });
  }
});

// node_modules/.pnpm/std-env@3.10.0/node_modules/std-env/dist/index.mjs
init_esm();
var r = /* @__PURE__ */ Object.create(null);
var i = /* @__PURE__ */ __name((e) => globalThis.process?.env || import.meta.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (e ? r : globalThis), "i");
var o = new Proxy(r, { get(e, s) {
  return i()[s] ?? r[s];
}, has(e, s) {
  const E = i();
  return s in E || s in r;
}, set(e, s, E) {
  const B = i(true);
  return B[s] = E, true;
}, deleteProperty(e, s) {
  if (!s) return false;
  const E = i(true);
  return delete E[s], true;
}, ownKeys() {
  const e = i(true);
  return Object.keys(e);
} });
var t = typeof process < "u" && process.env && process.env.NODE_ENV || "";
var f = [["APPVEYOR"], ["AWS_AMPLIFY", "AWS_APP_ID", { ci: true }], ["AZURE_PIPELINES", "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"], ["AZURE_STATIC", "INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"], ["APPCIRCLE", "AC_APPCIRCLE"], ["BAMBOO", "bamboo_planKey"], ["BITBUCKET", "BITBUCKET_COMMIT"], ["BITRISE", "BITRISE_IO"], ["BUDDY", "BUDDY_WORKSPACE_ID"], ["BUILDKITE"], ["CIRCLE", "CIRCLECI"], ["CIRRUS", "CIRRUS_CI"], ["CLOUDFLARE_PAGES", "CF_PAGES", { ci: true }], ["CLOUDFLARE_WORKERS", "WORKERS_CI", { ci: true }], ["CODEBUILD", "CODEBUILD_BUILD_ARN"], ["CODEFRESH", "CF_BUILD_ID"], ["DRONE"], ["DRONE", "DRONE_BUILD_EVENT"], ["DSARI"], ["GITHUB_ACTIONS"], ["GITLAB", "GITLAB_CI"], ["GITLAB", "CI_MERGE_REQUEST_ID"], ["GOCD", "GO_PIPELINE_LABEL"], ["LAYERCI"], ["HUDSON", "HUDSON_URL"], ["JENKINS", "JENKINS_URL"], ["MAGNUM"], ["NETLIFY"], ["NETLIFY", "NETLIFY_LOCAL", { ci: false }], ["NEVERCODE"], ["RENDER"], ["SAIL", "SAILCI"], ["SEMAPHORE"], ["SCREWDRIVER"], ["SHIPPABLE"], ["SOLANO", "TDDIUM"], ["STRIDER"], ["TEAMCITY", "TEAMCITY_VERSION"], ["TRAVIS"], ["VERCEL", "NOW_BUILDER"], ["VERCEL", "VERCEL", { ci: false }], ["VERCEL", "VERCEL_ENV", { ci: false }], ["APPCENTER", "APPCENTER_BUILD_ID"], ["CODESANDBOX", "CODESANDBOX_SSE", { ci: false }], ["CODESANDBOX", "CODESANDBOX_HOST", { ci: false }], ["STACKBLITZ"], ["STORMKIT"], ["CLEAVR"], ["ZEABUR"], ["CODESPHERE", "CODESPHERE_APP_ID", { ci: true }], ["RAILWAY", "RAILWAY_PROJECT_ID"], ["RAILWAY", "RAILWAY_SERVICE_ID"], ["DENO-DEPLOY", "DENO_DEPLOYMENT_ID"], ["FIREBASE_APP_HOSTING", "FIREBASE_APP_HOSTING", { ci: true }]];
function b() {
  if (globalThis.process?.env) for (const e of f) {
    const s = e[1] || e[0];
    if (globalThis.process?.env[s]) return { name: e[0].toLowerCase(), ...e[2] };
  }
  return globalThis.process?.env?.SHELL === "/bin/jsh" && globalThis.process?.versions?.webcontainer ? { name: "stackblitz", ci: false } : { name: "", ci: false };
}
__name(b, "b");
var l = b();
var p = l.name;
function n(e) {
  return e ? e !== "false" : false;
}
__name(n, "n");
var I = globalThis.process?.platform || "";
var T = n(o.CI) || l.ci !== false;
var R = n(globalThis.process?.stdout && globalThis.process?.stdout.isTTY);
var d = n(o.DEBUG);
var a = t === "test" || n(o.TEST);
var v = n(o.MINIMAL) || T || a || !R;
var A = /^win/i.test(I);
var M = /^linux/i.test(I);
var m = /^darwin/i.test(I);
var Y = !n(o.NO_COLOR) && (n(o.FORCE_COLOR) || (R || A) && o.TERM !== "dumb" || T);
var C = (globalThis.process?.versions?.node || "").replace(/^v/, "") || null;
var V = Number(C?.split(".")[0]) || null;
var W = globalThis.process || /* @__PURE__ */ Object.create(null);
var _ = { versions: {} };
var y = new Proxy(W, { get(e, s) {
  if (s === "env") return o;
  if (s in e) return e[s];
  if (s in _) return _[s];
} });
var O = globalThis.process?.release?.name === "node";
var c = !!globalThis.Bun || !!globalThis.process?.versions?.bun;
var D = !!globalThis.Deno;
var L = !!globalThis.fastly;
var S = !!globalThis.Netlify;
var u = !!globalThis.EdgeRuntime;
var N = globalThis.navigator?.userAgent === "Cloudflare-Workers";
var F = [[S, "netlify"], [u, "edge-light"], [N, "workerd"], [L, "fastly"], [D, "deno"], [c, "bun"], [O, "node"]];
function G() {
  const e = F.find((s) => s[0]);
  if (e) return { name: e[1] };
}
__name(G, "G");
var P = G();
var K = P?.name || "";

// node_modules/.pnpm/nanoid@3.3.18/node_modules/nanoid/index.js
init_esm();
import crypto from "crypto";

// node_modules/.pnpm/nanoid@3.3.18/node_modules/nanoid/url-alphabet/index.js
init_esm();
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// node_modules/.pnpm/nanoid@3.3.18/node_modules/nanoid/index.js
var POOL_SIZE_MULTIPLIER = 128;
var pool;
var poolOffset;
var fillPool = /* @__PURE__ */ __name((bytes) => {
  if (bytes < 0) throw new RangeError("Wrong ID size");
  try {
    if (!pool || pool.length < bytes) {
      pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
      crypto.randomFillSync(pool);
      poolOffset = 0;
    } else if (poolOffset + bytes > pool.length) {
      crypto.randomFillSync(pool);
      poolOffset = 0;
    }
  } catch (e) {
    pool = void 0;
    throw e;
  }
  poolOffset += bytes;
}, "fillPool");
var random = /* @__PURE__ */ __name((bytes) => {
  fillPool(bytes |= 0);
  return pool.subarray(poolOffset - bytes, poolOffset);
}, "random");
var customRandom = /* @__PURE__ */ __name((alphabet, defaultSize, getRandom) => {
  let mask = (2 << 31 - Math.clz32(alphabet.length - 1 | 1)) - 1;
  let step = Math.ceil(1.6 * mask * defaultSize / alphabet.length);
  return (size = defaultSize) => {
    if (size <= 0) return "";
    let id = "";
    while (true) {
      let bytes = getRandom(step);
      let i2 = step;
      while (i2--) {
        id += alphabet[bytes[i2] & mask] || "";
        if (id.length === size) return id;
      }
    }
  };
}, "customRandom");
var customAlphabet = /* @__PURE__ */ __name((alphabet, size = 21) => customRandom(alphabet, size, random), "customAlphabet");
var nanoid = /* @__PURE__ */ __name((size = 21) => {
  fillPool(size |= 0);
  let id = "";
  for (let i2 = poolOffset - size; i2 < poolOffset; i2++) {
    id += urlAlphabet[pool[i2] & 63];
  }
  return id;
}, "nanoid");

// node_modules/.pnpm/eventsource-parser@3.1.0/node_modules/eventsource-parser/dist/stream.js
init_esm();

// node_modules/.pnpm/eventsource-parser@3.1.0/node_modules/eventsource-parser/dist/index.js
init_esm();
var ParseError = class extends Error {
  static {
    __name(this, "ParseError");
  }
  constructor(message, options) {
    super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
  }
};
var LF = 10;
var CR = 13;
var SPACE = 32;
function noop(_arg) {
}
__name(noop, "noop");
function createParser(config) {
  if (typeof config == "function")
    throw new TypeError(
      "`config` must be an object, got a function instead. Did you mean `createParser({onEvent: fn})`?"
    );
  const { onEvent = noop, onError = noop, onRetry = noop, onComment, maxBufferSize } = config, pendingFragments = [];
  let pendingFragmentsLength = 0, isFirstChunk = true, id, data = "", dataLines = 0, eventType, terminated = false;
  function feed(chunk) {
    if (terminated)
      throw new Error(
        "Cannot feed parser: it was terminated after exceeding the configured max buffer size. Call `reset()` to resume parsing."
      );
    if (isFirstChunk && (isFirstChunk = false, chunk.charCodeAt(0) === 239 && chunk.charCodeAt(1) === 187 && chunk.charCodeAt(2) === 191 && (chunk = chunk.slice(3))), pendingFragments.length === 0) {
      const trailing2 = processLines(chunk);
      trailing2 !== "" && (pendingFragments.push(trailing2), pendingFragmentsLength = trailing2.length), checkBufferSize();
      return;
    }
    if (chunk.indexOf(`
`) === -1 && chunk.indexOf("\r") === -1) {
      pendingFragments.push(chunk), pendingFragmentsLength += chunk.length, checkBufferSize();
      return;
    }
    pendingFragments.push(chunk);
    const input = pendingFragments.join("");
    pendingFragments.length = 0, pendingFragmentsLength = 0;
    const trailing = processLines(input);
    trailing !== "" && (pendingFragments.push(trailing), pendingFragmentsLength = trailing.length), checkBufferSize();
  }
  __name(feed, "feed");
  function checkBufferSize() {
    maxBufferSize !== void 0 && (pendingFragmentsLength + data.length <= maxBufferSize || (terminated = true, pendingFragments.length = 0, pendingFragmentsLength = 0, id = void 0, data = "", dataLines = 0, eventType = void 0, onError(
      new ParseError(`Buffered data exceeded max buffer size of ${maxBufferSize} characters`, {
        type: "max-buffer-size-exceeded"
      })
    )));
  }
  __name(checkBufferSize, "checkBufferSize");
  function processLines(chunk) {
    let searchIndex = 0;
    if (chunk.indexOf("\r") === -1) {
      let lfIndex = chunk.indexOf(`
`, searchIndex);
      for (; lfIndex !== -1; ) {
        if (searchIndex === lfIndex) {
          dataLines > 0 && onEvent({ id, event: eventType, data }), id = void 0, data = "", dataLines = 0, eventType = void 0, searchIndex = lfIndex + 1, lfIndex = chunk.indexOf(`
`, searchIndex);
          continue;
        }
        const firstCharCode = chunk.charCodeAt(searchIndex);
        if (isDataPrefix(chunk, searchIndex, firstCharCode)) {
          const valueStart = chunk.charCodeAt(searchIndex + 5) === SPACE ? searchIndex + 6 : searchIndex + 5, value = chunk.slice(valueStart, lfIndex);
          if (dataLines === 0 && chunk.charCodeAt(lfIndex + 1) === LF) {
            onEvent({ id, event: eventType, data: value }), id = void 0, data = "", eventType = void 0, searchIndex = lfIndex + 2, lfIndex = chunk.indexOf(`
`, searchIndex);
            continue;
          }
          data = dataLines === 0 ? value : `${data}
${value}`, dataLines++;
        } else isEventPrefix(chunk, searchIndex, firstCharCode) ? eventType = chunk.slice(
          chunk.charCodeAt(searchIndex + 6) === SPACE ? searchIndex + 7 : searchIndex + 6,
          lfIndex
        ) || void 0 : parseLine(chunk, searchIndex, lfIndex);
        searchIndex = lfIndex + 1, lfIndex = chunk.indexOf(`
`, searchIndex);
      }
      return chunk.slice(searchIndex);
    }
    for (; searchIndex < chunk.length; ) {
      const crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex);
      let lineEnd = -1;
      if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = crIndex < lfIndex ? crIndex : lfIndex : crIndex !== -1 ? crIndex === chunk.length - 1 ? lineEnd = -1 : lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1)
        break;
      parseLine(chunk, searchIndex, lineEnd), searchIndex = lineEnd + 1, chunk.charCodeAt(searchIndex - 1) === CR && chunk.charCodeAt(searchIndex) === LF && searchIndex++;
    }
    return chunk.slice(searchIndex);
  }
  __name(processLines, "processLines");
  function parseLine(chunk, start, end) {
    if (start === end) {
      dispatchEvent();
      return;
    }
    const firstCharCode = chunk.charCodeAt(start);
    if (isDataPrefix(chunk, start, firstCharCode)) {
      const valueStart = chunk.charCodeAt(start + 5) === SPACE ? start + 6 : start + 5, value2 = chunk.slice(valueStart, end);
      data = dataLines === 0 ? value2 : `${data}
${value2}`, dataLines++;
      return;
    }
    if (isEventPrefix(chunk, start, firstCharCode)) {
      eventType = chunk.slice(chunk.charCodeAt(start + 6) === SPACE ? start + 7 : start + 6, end) || void 0;
      return;
    }
    if (firstCharCode === 105 && chunk.charCodeAt(start + 1) === 100 && chunk.charCodeAt(start + 2) === 58) {
      const value2 = chunk.slice(chunk.charCodeAt(start + 3) === SPACE ? start + 4 : start + 3, end);
      id = value2.includes("\0") ? void 0 : value2;
      return;
    }
    if (firstCharCode === 58) {
      if (onComment) {
        const line2 = chunk.slice(start, end);
        onComment(line2.slice(chunk.charCodeAt(start + 1) === SPACE ? 2 : 1));
      }
      return;
    }
    const line = chunk.slice(start, end), fieldSeparatorIndex = line.indexOf(":");
    if (fieldSeparatorIndex === -1) {
      processField(line, "", line);
      return;
    }
    const field = line.slice(0, fieldSeparatorIndex), offset = line.charCodeAt(fieldSeparatorIndex + 1) === SPACE ? 2 : 1, value = line.slice(fieldSeparatorIndex + offset);
    processField(field, value, line);
  }
  __name(parseLine, "parseLine");
  function processField(field, value, line) {
    switch (field) {
      case "event":
        eventType = value || void 0;
        break;
      case "data":
        data = dataLines === 0 ? value : `${data}
${value}`, dataLines++;
        break;
      case "id":
        id = value.includes("\0") ? void 0 : value;
        break;
      case "retry":
        /^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(
          new ParseError(`Invalid \`retry\` value: "${value}"`, {
            type: "invalid-retry",
            value,
            line
          })
        );
        break;
      default:
        onError(
          new ParseError(
            `Unknown field "${field.length > 20 ? `${field.slice(0, 20)}…` : field}"`,
            { type: "unknown-field", field, value, line }
          )
        );
        break;
    }
  }
  __name(processField, "processField");
  function dispatchEvent() {
    dataLines > 0 && onEvent({
      id,
      event: eventType,
      data
    }), id = void 0, data = "", dataLines = 0, eventType = void 0;
  }
  __name(dispatchEvent, "dispatchEvent");
  function reset(options = {}) {
    if (options.consume && pendingFragments.length > 0) {
      const incompleteLine = pendingFragments.join("");
      parseLine(incompleteLine, 0, incompleteLine.length);
    }
    isFirstChunk = true, id = void 0, data = "", dataLines = 0, eventType = void 0, pendingFragments.length = 0, pendingFragmentsLength = 0, terminated = false;
  }
  __name(reset, "reset");
  return { feed, reset };
}
__name(createParser, "createParser");
function isDataPrefix(chunk, i2, firstCharCode) {
  return firstCharCode === 100 && chunk.charCodeAt(i2 + 1) === 97 && chunk.charCodeAt(i2 + 2) === 116 && chunk.charCodeAt(i2 + 3) === 97 && chunk.charCodeAt(i2 + 4) === 58;
}
__name(isDataPrefix, "isDataPrefix");
function isEventPrefix(chunk, i2, firstCharCode) {
  return firstCharCode === 101 && chunk.charCodeAt(i2 + 1) === 118 && chunk.charCodeAt(i2 + 2) === 101 && chunk.charCodeAt(i2 + 3) === 110 && chunk.charCodeAt(i2 + 4) === 116 && chunk.charCodeAt(i2 + 5) === 58;
}
__name(isEventPrefix, "isEventPrefix");

// node_modules/.pnpm/eventsource-parser@3.1.0/node_modules/eventsource-parser/dist/stream.js
var EventSourceParserStream = class extends TransformStream {
  static {
    __name(this, "EventSourceParserStream");
  }
  constructor({ onError, onRetry, onComment, maxBufferSize } = {}) {
    let parser;
    super({
      start(controller) {
        parser = createParser({
          onEvent: /* @__PURE__ */ __name((event) => {
            controller.enqueue(event);
          }, "onEvent"),
          onError(error) {
            typeof onError == "function" && onError(error), (onError === "terminate" || error.type === "max-buffer-size-exceeded") && controller.error(error);
          },
          onRetry,
          onComment,
          maxBufferSize
        });
      },
      transform(chunk) {
        parser.feed(chunk);
      }
    });
  }
};

// node_modules/.pnpm/@bugsnag+cuid@3.2.2/node_modules/@bugsnag/cuid/index.esm.mjs
init_esm();

// node_modules/.pnpm/@bugsnag+cuid@3.2.2/node_modules/@bugsnag/cuid/lib/fingerprint.mjs
init_esm();

// node_modules/.pnpm/@bugsnag+cuid@3.2.2/node_modules/@bugsnag/cuid/lib/pad.mjs
init_esm();
function pad(num, size) {
  var s = "000000000" + num;
  return s.substr(s.length - size);
}
__name(pad, "pad");

// node_modules/.pnpm/@bugsnag+cuid@3.2.2/node_modules/@bugsnag/cuid/lib/fingerprint.mjs
import os from "os";
function getHostname() {
  try {
    return os.hostname();
  } catch (e) {
    return process.env._CLUSTER_NETWORK_NAME_ || process.env.COMPUTERNAME || "hostname";
  }
}
__name(getHostname, "getHostname");
var padding = 2;
var pid = pad(process.pid.toString(36), padding);
var hostname = getHostname();
var length = hostname.length;
var hostId = pad(
  hostname.split("").reduce(function(prev, char) {
    return +prev + char.charCodeAt(0);
  }, +length + 36).toString(36),
  padding
);
function fingerprint() {
  return pid + hostId;
}
__name(fingerprint, "fingerprint");

// node_modules/.pnpm/@bugsnag+cuid@3.2.2/node_modules/@bugsnag/cuid/lib/cuid.mjs
init_esm();

// node_modules/.pnpm/@bugsnag+cuid@3.2.2/node_modules/@bugsnag/cuid/lib/is-cuid.mjs
init_esm();
function isCuid(value) {
  return typeof value === "string" && /^c[a-z0-9]{20,32}$/.test(value);
}
__name(isCuid, "isCuid");

// node_modules/.pnpm/@bugsnag+cuid@3.2.2/node_modules/@bugsnag/cuid/lib/cuid.mjs
function createCuid(fingerprint2) {
  const blockSize = 4, base = 36, discreteValues = Math.pow(base, blockSize);
  let c2 = 0;
  function randomBlock() {
    return pad((Math.random() * discreteValues << 0).toString(base), blockSize);
  }
  __name(randomBlock, "randomBlock");
  function safeCounter() {
    c2 = c2 < discreteValues ? c2 : 0;
    c2++;
    return c2 - 1;
  }
  __name(safeCounter, "safeCounter");
  function cuid2() {
    var letter = "c", timestamp = (/* @__PURE__ */ new Date()).getTime().toString(base), counter = pad(safeCounter().toString(base), blockSize), print = fingerprint2(), random2 = randomBlock() + randomBlock();
    return letter + timestamp + counter + print + random2;
  }
  __name(cuid2, "cuid");
  cuid2.fingerprint = fingerprint2;
  cuid2.isCuid = isCuid;
  return cuid2;
}
__name(createCuid, "createCuid");

// node_modules/.pnpm/@bugsnag+cuid@3.2.2/node_modules/@bugsnag/cuid/index.esm.mjs
var cuid = createCuid(fingerprint);
var index_esm_default = cuid;

// node_modules/.pnpm/@electric-sql+client@1.0.14/node_modules/@electric-sql/client/dist/index.mjs
init_esm();
var import_fetch_event_source = __toESM(require_cjs(), 1);
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __typeError = /* @__PURE__ */ __name((msg) => {
  throw TypeError(msg);
}, "__typeError");
var __defNormalProp = /* @__PURE__ */ __name((obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value, "__defNormalProp");
var __spreadValues = /* @__PURE__ */ __name((a2, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a2, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a2, prop, b2[prop]);
    }
  return a2;
}, "__spreadValues");
var __spreadProps = /* @__PURE__ */ __name((a2, b2) => __defProps(a2, __getOwnPropDescs(b2)), "__spreadProps");
var __objRest = /* @__PURE__ */ __name((source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
}, "__objRest");
var __accessCheck = /* @__PURE__ */ __name((obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg), "__accessCheck");
var __privateGet = /* @__PURE__ */ __name((obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj)), "__privateGet");
var __privateAdd = /* @__PURE__ */ __name((obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value), "__privateAdd");
var __privateSet = /* @__PURE__ */ __name((obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value), "__privateSet");
var __privateMethod = /* @__PURE__ */ __name((obj, member, method) => (__accessCheck(obj, member, "access private method"), method), "__privateMethod");
var __privateWrapper = /* @__PURE__ */ __name((obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
}), "__privateWrapper");
var __async = /* @__PURE__ */ __name((__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = /* @__PURE__ */ __name((value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }, "fulfilled");
    var rejected = /* @__PURE__ */ __name((value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    }, "rejected");
    var step = /* @__PURE__ */ __name((x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected), "step");
    step((generator = generator.apply(__this, __arguments)).next());
  });
}, "__async");
var FetchError = class _FetchError extends Error {
  static {
    __name(this, "_FetchError");
  }
  constructor(status, text, json, headers, url, message) {
    super(
      message || `HTTP Error ${status} at ${url}: ${text != null ? text : JSON.stringify(json)}`
    );
    this.url = url;
    this.name = `FetchError`;
    this.status = status;
    this.text = text;
    this.json = json;
    this.headers = headers;
  }
  static fromResponse(response, url) {
    return __async(this, null, function* () {
      const status = response.status;
      const headers = Object.fromEntries([...response.headers.entries()]);
      let text = void 0;
      let json = void 0;
      const contentType = response.headers.get(`content-type`);
      if (!response.bodyUsed) {
        if (contentType && contentType.includes(`application/json`)) {
          json = yield response.json();
        } else {
          text = yield response.text();
        }
      }
      return new _FetchError(status, text, json, headers, url);
    });
  }
};
var FetchBackoffAbortError = class extends Error {
  static {
    __name(this, "FetchBackoffAbortError");
  }
  constructor() {
    super(`Fetch with backoff aborted`);
    this.name = `FetchBackoffAbortError`;
  }
};
var MissingShapeUrlError = class extends Error {
  static {
    __name(this, "MissingShapeUrlError");
  }
  constructor() {
    super(`Invalid shape options: missing required url parameter`);
    this.name = `MissingShapeUrlError`;
  }
};
var InvalidSignalError = class extends Error {
  static {
    __name(this, "InvalidSignalError");
  }
  constructor() {
    super(`Invalid signal option. It must be an instance of AbortSignal.`);
    this.name = `InvalidSignalError`;
  }
};
var MissingShapeHandleError = class extends Error {
  static {
    __name(this, "MissingShapeHandleError");
  }
  constructor() {
    super(
      `shapeHandle is required if this isn't an initial fetch (i.e. offset > -1)`
    );
    this.name = `MissingShapeHandleError`;
  }
};
var ReservedParamError = class extends Error {
  static {
    __name(this, "ReservedParamError");
  }
  constructor(reservedParams) {
    super(
      `Cannot use reserved Electric parameter names in custom params: ${reservedParams.join(`, `)}`
    );
    this.name = `ReservedParamError`;
  }
};
var ParserNullValueError = class extends Error {
  static {
    __name(this, "ParserNullValueError");
  }
  constructor(columnName) {
    super(`Column "${columnName != null ? columnName : `unknown`}" does not allow NULL values`);
    this.name = `ParserNullValueError`;
  }
};
var MissingHeadersError = class extends Error {
  static {
    __name(this, "MissingHeadersError");
  }
  constructor(url, missingHeaders) {
    let msg = `The response for the shape request to ${url} didn't include the following required headers:
`;
    missingHeaders.forEach((h) => {
      msg += `- ${h}
`;
    });
    msg += `
This is often due to a proxy not setting CORS correctly so that all Electric headers can be read by the client.`;
    msg += `
For more information visit the troubleshooting guide: /docs/guides/troubleshooting/missing-headers`;
    super(msg);
  }
};
var parseNumber = /* @__PURE__ */ __name((value) => Number(value), "parseNumber");
var parseBool = /* @__PURE__ */ __name((value) => value === `true` || value === `t`, "parseBool");
var parseBigInt = /* @__PURE__ */ __name((value) => BigInt(value), "parseBigInt");
var parseJson = /* @__PURE__ */ __name((value) => JSON.parse(value), "parseJson");
var identityParser = /* @__PURE__ */ __name((v2) => v2, "identityParser");
var defaultParser = {
  int2: parseNumber,
  int4: parseNumber,
  int8: parseBigInt,
  bool: parseBool,
  float4: parseNumber,
  float8: parseNumber,
  json: parseJson,
  jsonb: parseJson
};
function pgArrayParser(value, parser) {
  let i2 = 0;
  let char = null;
  let str = ``;
  let quoted = false;
  let last = 0;
  let p2 = void 0;
  function extractValue(x, start, end) {
    let val = x.slice(start, end);
    val = val === `NULL` ? null : val;
    return parser ? parser(val) : val;
  }
  __name(extractValue, "extractValue");
  function loop(x) {
    const xs = [];
    for (; i2 < x.length; i2++) {
      char = x[i2];
      if (quoted) {
        if (char === `\\`) {
          str += x[++i2];
        } else if (char === `"`) {
          xs.push(parser ? parser(str) : str);
          str = ``;
          quoted = x[i2 + 1] === `"`;
          last = i2 + 2;
        } else {
          str += char;
        }
      } else if (char === `"`) {
        quoted = true;
      } else if (char === `{`) {
        last = ++i2;
        xs.push(loop(x));
      } else if (char === `}`) {
        quoted = false;
        last < i2 && xs.push(extractValue(x, last, i2));
        last = i2 + 1;
        break;
      } else if (char === `,` && p2 !== `}` && p2 !== `"`) {
        xs.push(extractValue(x, last, i2));
        last = i2 + 1;
      }
      p2 = char;
    }
    last < i2 && xs.push(xs.push(extractValue(x, last, i2 + 1)));
    return xs;
  }
  __name(loop, "loop");
  return loop(value)[0];
}
__name(pgArrayParser, "pgArrayParser");
var MessageParser = class {
  static {
    __name(this, "MessageParser");
  }
  constructor(parser, transformer) {
    this.parser = __spreadValues(__spreadValues({}, defaultParser), parser);
    this.transformer = transformer;
  }
  parse(messages, schema) {
    return JSON.parse(messages, (key, value) => {
      if ((key === `value` || key === `old_value`) && typeof value === `object` && value !== null) {
        const row = value;
        Object.keys(row).forEach((key2) => {
          row[key2] = this.parseRow(key2, row[key2], schema);
        });
        if (this.transformer) value = this.transformer(value);
      }
      return value;
    });
  }
  // Parses the message values using the provided parser based on the schema information
  parseRow(key, value, schema) {
    var _b;
    const columnInfo = schema[key];
    if (!columnInfo) {
      return value;
    }
    const _a = columnInfo, { type: typ, dims: dimensions } = _a, additionalInfo = __objRest(_a, ["type", "dims"]);
    const typeParser = (_b = this.parser[typ]) != null ? _b : identityParser;
    const parser = makeNullableParser(typeParser, columnInfo, key);
    if (dimensions && dimensions > 0) {
      const nullablePgArrayParser = makeNullableParser(
        (value2, _2) => pgArrayParser(value2, parser),
        columnInfo,
        key
      );
      return nullablePgArrayParser(value);
    }
    return parser(value, additionalInfo);
  }
};
function makeNullableParser(parser, columnInfo, columnName) {
  var _a;
  const isNullable = !((_a = columnInfo.not_null) != null ? _a : false);
  return (value) => {
    if (value === null) {
      if (!isNullable) {
        throw new ParserNullValueError(columnName != null ? columnName : `unknown`);
      }
      return null;
    }
    return parser(value, columnInfo);
  };
}
__name(makeNullableParser, "makeNullableParser");
function isChangeMessage(message) {
  return `key` in message;
}
__name(isChangeMessage, "isChangeMessage");
function isControlMessage(message) {
  return !isChangeMessage(message);
}
__name(isControlMessage, "isControlMessage");
function isUpToDateMessage(message) {
  return isControlMessage(message) && message.headers.control === `up-to-date`;
}
__name(isUpToDateMessage, "isUpToDateMessage");
function getOffset(message) {
  const lsn = message.headers.global_last_seen_lsn;
  if (!lsn) {
    return;
  }
  return `${lsn}_0`;
}
__name(getOffset, "getOffset");
function isVisibleInSnapshot(txid, snapshot) {
  const xid = BigInt(txid);
  const xmin = BigInt(snapshot.xmin);
  const xmax = BigInt(snapshot.xmax);
  const xip = snapshot.xip_list.map(BigInt);
  return xid < xmin || xid < xmax && !xip.includes(xid);
}
__name(isVisibleInSnapshot, "isVisibleInSnapshot");
var LIVE_CACHE_BUSTER_HEADER = `electric-cursor`;
var SHAPE_HANDLE_HEADER = `electric-handle`;
var CHUNK_LAST_OFFSET_HEADER = `electric-offset`;
var SHAPE_SCHEMA_HEADER = `electric-schema`;
var CHUNK_UP_TO_DATE_HEADER = `electric-up-to-date`;
var COLUMNS_QUERY_PARAM = `columns`;
var LIVE_CACHE_BUSTER_QUERY_PARAM = `cursor`;
var EXPIRED_HANDLE_QUERY_PARAM = `expired_handle`;
var SHAPE_HANDLE_QUERY_PARAM = `handle`;
var LIVE_QUERY_PARAM = `live`;
var OFFSET_QUERY_PARAM = `offset`;
var TABLE_QUERY_PARAM = `table`;
var WHERE_QUERY_PARAM = `where`;
var REPLICA_PARAM = `replica`;
var WHERE_PARAMS_PARAM = `params`;
var EXPERIMENTAL_LIVE_SSE_QUERY_PARAM = `experimental_live_sse`;
var FORCE_DISCONNECT_AND_REFRESH = `force-disconnect-and-refresh`;
var PAUSE_STREAM = `pause-stream`;
var LOG_MODE_QUERY_PARAM = `log`;
var SUBSET_PARAM_WHERE = `subset__where`;
var SUBSET_PARAM_LIMIT = `subset__limit`;
var SUBSET_PARAM_OFFSET = `subset__offset`;
var SUBSET_PARAM_ORDER_BY = `subset__order_by`;
var SUBSET_PARAM_WHERE_PARAMS = `subset__params`;
var ELECTRIC_PROTOCOL_QUERY_PARAMS = [
  LIVE_QUERY_PARAM,
  SHAPE_HANDLE_QUERY_PARAM,
  OFFSET_QUERY_PARAM,
  LIVE_CACHE_BUSTER_QUERY_PARAM,
  EXPIRED_HANDLE_QUERY_PARAM,
  LOG_MODE_QUERY_PARAM,
  SUBSET_PARAM_WHERE,
  SUBSET_PARAM_LIMIT,
  SUBSET_PARAM_OFFSET,
  SUBSET_PARAM_ORDER_BY,
  SUBSET_PARAM_WHERE_PARAMS
];
var HTTP_RETRY_STATUS_CODES = [429];
var BackoffDefaults = {
  initialDelay: 100,
  maxDelay: 1e4,
  multiplier: 1.3
};
function createFetchWithBackoff(fetchClient, backoffOptions = BackoffDefaults) {
  const {
    initialDelay,
    maxDelay,
    multiplier,
    debug = false,
    onFailedAttempt
  } = backoffOptions;
  return (...args) => __async(this, null, function* () {
    var _a;
    const url = args[0];
    const options = args[1];
    let delay = initialDelay;
    let attempt = 0;
    while (true) {
      try {
        const result = yield fetchClient(...args);
        if (result.ok) return result;
        const err = yield FetchError.fromResponse(result, url.toString());
        throw err;
      } catch (e) {
        onFailedAttempt == null ? void 0 : onFailedAttempt();
        if ((_a = options == null ? void 0 : options.signal) == null ? void 0 : _a.aborted) {
          throw new FetchBackoffAbortError();
        } else if (e instanceof FetchError && !HTTP_RETRY_STATUS_CODES.includes(e.status) && e.status >= 400 && e.status < 500) {
          throw e;
        } else {
          yield new Promise((resolve) => setTimeout(resolve, delay));
          delay = Math.min(delay * multiplier, maxDelay);
          if (debug) {
            attempt++;
            console.log(`Retry attempt #${attempt} after ${delay}ms`);
          }
        }
      }
    }
  });
}
__name(createFetchWithBackoff, "createFetchWithBackoff");
var NO_BODY_STATUS_CODES = [201, 204, 205];
function createFetchWithConsumedMessages(fetchClient) {
  return (...args) => __async(this, null, function* () {
    const url = args[0];
    const res = yield fetchClient(...args);
    try {
      if (res.status < 200 || NO_BODY_STATUS_CODES.includes(res.status)) {
        return res;
      }
      const text = yield res.text();
      return new Response(text, res);
    } catch (err) {
      throw new FetchError(
        res.status,
        void 0,
        void 0,
        Object.fromEntries([...res.headers.entries()]),
        url.toString(),
        err instanceof Error ? err.message : typeof err === `string` ? err : `failed to read body`
      );
    }
  });
}
__name(createFetchWithConsumedMessages, "createFetchWithConsumedMessages");
var ChunkPrefetchDefaults = {
  maxChunksToPrefetch: 2
};
function createFetchWithChunkBuffer(fetchClient, prefetchOptions = ChunkPrefetchDefaults) {
  const { maxChunksToPrefetch } = prefetchOptions;
  let prefetchQueue;
  const prefetchClient = /* @__PURE__ */ __name((...args) => __async(this, null, function* () {
    const url = args[0].toString();
    const prefetchedRequest = prefetchQueue == null ? void 0 : prefetchQueue.consume(...args);
    if (prefetchedRequest) {
      return prefetchedRequest;
    }
    prefetchQueue == null ? void 0 : prefetchQueue.abort();
    const response = yield fetchClient(...args);
    const nextUrl = getNextChunkUrl(url, response);
    if (nextUrl) {
      prefetchQueue = new PrefetchQueue({
        fetchClient,
        maxPrefetchedRequests: maxChunksToPrefetch,
        url: nextUrl,
        requestInit: args[1]
      });
    }
    return response;
  }), "prefetchClient");
  return prefetchClient;
}
__name(createFetchWithChunkBuffer, "createFetchWithChunkBuffer");
var requiredElectricResponseHeaders = [
  `electric-offset`,
  `electric-handle`
];
var requiredLiveResponseHeaders = [`electric-cursor`];
var requiredNonLiveResponseHeaders = [`electric-schema`];
function createFetchWithResponseHeadersCheck(fetchClient) {
  return (...args) => __async(this, null, function* () {
    const response = yield fetchClient(...args);
    if (response.ok) {
      const headers = response.headers;
      const missingHeaders = [];
      const addMissingHeaders = /* @__PURE__ */ __name((requiredHeaders) => missingHeaders.push(...requiredHeaders.filter((h) => !headers.has(h))), "addMissingHeaders");
      const input = args[0];
      const urlString = input.toString();
      const url = new URL(urlString);
      const isSnapshotRequest = [
        SUBSET_PARAM_WHERE,
        SUBSET_PARAM_WHERE_PARAMS,
        SUBSET_PARAM_LIMIT,
        SUBSET_PARAM_OFFSET,
        SUBSET_PARAM_ORDER_BY
      ].some((p2) => url.searchParams.has(p2));
      if (isSnapshotRequest) {
        return response;
      }
      addMissingHeaders(requiredElectricResponseHeaders);
      if (url.searchParams.get(LIVE_QUERY_PARAM) === `true`) {
        addMissingHeaders(requiredLiveResponseHeaders);
      }
      if (!url.searchParams.has(LIVE_QUERY_PARAM) || url.searchParams.get(LIVE_QUERY_PARAM) === `false`) {
        addMissingHeaders(requiredNonLiveResponseHeaders);
      }
      if (missingHeaders.length > 0) {
        throw new MissingHeadersError(urlString, missingHeaders);
      }
    }
    return response;
  });
}
__name(createFetchWithResponseHeadersCheck, "createFetchWithResponseHeadersCheck");
var _fetchClient;
var _maxPrefetchedRequests;
var _prefetchQueue;
var _queueHeadUrl;
var _queueTailUrl;
var _PrefetchQueue_instances;
var prefetch_fn;
var PrefetchQueue = class {
  static {
    __name(this, "PrefetchQueue");
  }
  constructor(options) {
    __privateAdd(this, _PrefetchQueue_instances);
    __privateAdd(this, _fetchClient);
    __privateAdd(this, _maxPrefetchedRequests);
    __privateAdd(this, _prefetchQueue, /* @__PURE__ */ new Map());
    __privateAdd(this, _queueHeadUrl);
    __privateAdd(this, _queueTailUrl);
    var _a;
    __privateSet(this, _fetchClient, (_a = options.fetchClient) != null ? _a : (...args) => fetch(...args));
    __privateSet(this, _maxPrefetchedRequests, options.maxPrefetchedRequests);
    __privateSet(this, _queueHeadUrl, options.url.toString());
    __privateSet(this, _queueTailUrl, __privateGet(this, _queueHeadUrl));
    __privateMethod(this, _PrefetchQueue_instances, prefetch_fn).call(this, options.url, options.requestInit);
  }
  abort() {
    __privateGet(this, _prefetchQueue).forEach(([_2, aborter]) => aborter.abort());
  }
  consume(...args) {
    var _a;
    const url = args[0].toString();
    const request = (_a = __privateGet(this, _prefetchQueue).get(url)) == null ? void 0 : _a[0];
    if (!request || url !== __privateGet(this, _queueHeadUrl)) return;
    __privateGet(this, _prefetchQueue).delete(url);
    request.then((response) => {
      const nextUrl = getNextChunkUrl(url, response);
      __privateSet(this, _queueHeadUrl, nextUrl);
      if (__privateGet(this, _queueTailUrl) && !__privateGet(this, _prefetchQueue).has(__privateGet(this, _queueTailUrl))) {
        __privateMethod(this, _PrefetchQueue_instances, prefetch_fn).call(this, __privateGet(this, _queueTailUrl), args[1]);
      }
    }).catch(() => {
    });
    return request;
  }
};
_fetchClient = /* @__PURE__ */ new WeakMap();
_maxPrefetchedRequests = /* @__PURE__ */ new WeakMap();
_prefetchQueue = /* @__PURE__ */ new WeakMap();
_queueHeadUrl = /* @__PURE__ */ new WeakMap();
_queueTailUrl = /* @__PURE__ */ new WeakMap();
_PrefetchQueue_instances = /* @__PURE__ */ new WeakSet();
prefetch_fn = /* @__PURE__ */ __name(function(...args) {
  var _a, _b;
  const url = args[0].toString();
  if (__privateGet(this, _prefetchQueue).size >= __privateGet(this, _maxPrefetchedRequests)) return;
  const aborter = new AbortController();
  try {
    const { signal, cleanup } = chainAborter(aborter, (_a = args[1]) == null ? void 0 : _a.signal);
    const request = __privateGet(this, _fetchClient).call(this, url, __spreadProps(__spreadValues({}, (_b = args[1]) != null ? _b : {}), { signal }));
    __privateGet(this, _prefetchQueue).set(url, [request, aborter]);
    request.then((response) => {
      if (!response.ok || aborter.signal.aborted) return;
      const nextUrl = getNextChunkUrl(url, response);
      if (!nextUrl || nextUrl === url) {
        __privateSet(this, _queueTailUrl, void 0);
        return;
      }
      __privateSet(this, _queueTailUrl, nextUrl);
      return __privateMethod(this, _PrefetchQueue_instances, prefetch_fn).call(this, nextUrl, args[1]);
    }).catch(() => {
    }).finally(cleanup);
  } catch (_2) {
  }
}, "prefetch_fn");
function getNextChunkUrl(url, res) {
  const shapeHandle = res.headers.get(SHAPE_HANDLE_HEADER);
  const lastOffset = res.headers.get(CHUNK_LAST_OFFSET_HEADER);
  const isUpToDate = res.headers.has(CHUNK_UP_TO_DATE_HEADER);
  if (!shapeHandle || !lastOffset || isUpToDate) return;
  const nextUrl = new URL(url);
  if (nextUrl.searchParams.has(LIVE_QUERY_PARAM)) return;
  nextUrl.searchParams.set(SHAPE_HANDLE_QUERY_PARAM, shapeHandle);
  nextUrl.searchParams.set(OFFSET_QUERY_PARAM, lastOffset);
  nextUrl.searchParams.sort();
  return nextUrl.toString();
}
__name(getNextChunkUrl, "getNextChunkUrl");
function chainAborter(aborter, sourceSignal) {
  let cleanup = noop2;
  if (!sourceSignal) {
  } else if (sourceSignal.aborted) {
    aborter.abort();
  } else {
    const abortParent = /* @__PURE__ */ __name(() => aborter.abort(), "abortParent");
    sourceSignal.addEventListener(`abort`, abortParent, {
      once: true,
      signal: aborter.signal
    });
    cleanup = /* @__PURE__ */ __name(() => sourceSignal.removeEventListener(`abort`, abortParent), "cleanup");
  }
  return {
    signal: aborter.signal,
    cleanup
  };
}
__name(chainAborter, "chainAborter");
function noop2() {
}
__name(noop2, "noop");
var ExpiredShapesCache = class {
  static {
    __name(this, "ExpiredShapesCache");
  }
  constructor() {
    this.data = {};
    this.max = 250;
    this.storageKey = `electric_expired_shapes`;
    this.load();
  }
  getExpiredHandle(shapeUrl) {
    const entry = this.data[shapeUrl];
    if (entry) {
      entry.lastUsed = Date.now();
      this.save();
      return entry.expiredHandle;
    }
    return null;
  }
  markExpired(shapeUrl, handle) {
    this.data[shapeUrl] = { expiredHandle: handle, lastUsed: Date.now() };
    const keys = Object.keys(this.data);
    if (keys.length > this.max) {
      const oldest = keys.reduce(
        (min, k) => this.data[k].lastUsed < this.data[min].lastUsed ? k : min
      );
      delete this.data[oldest];
    }
    this.save();
  }
  save() {
    if (typeof localStorage === `undefined`) return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
    }
  }
  load() {
    if (typeof localStorage === `undefined`) return;
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (e) {
      this.data = {};
    }
  }
  clear() {
    this.data = {};
    this.save();
  }
};
var expiredShapesCache = new ExpiredShapesCache();
var SnapshotTracker = class {
  static {
    __name(this, "SnapshotTracker");
  }
  constructor() {
    this.activeSnapshots = /* @__PURE__ */ new Map();
    this.xmaxSnapshots = /* @__PURE__ */ new Map();
    this.snapshotsByDatabaseLsn = /* @__PURE__ */ new Map();
  }
  /**
   * Add a new snapshot for tracking
   */
  addSnapshot(metadata, keys) {
    var _a, _b, _c, _d;
    this.activeSnapshots.set(metadata.snapshot_mark, {
      xmin: BigInt(metadata.xmin),
      xmax: BigInt(metadata.xmax),
      xip_list: metadata.xip_list.map(BigInt),
      keys
    });
    const xmaxSet = (_b = (_a = this.xmaxSnapshots.get(BigInt(metadata.xmax))) == null ? void 0 : _a.add(metadata.snapshot_mark)) != null ? _b : /* @__PURE__ */ new Set([metadata.snapshot_mark]);
    this.xmaxSnapshots.set(BigInt(metadata.xmax), xmaxSet);
    const databaseLsnSet = (_d = (_c = this.snapshotsByDatabaseLsn.get(BigInt(metadata.database_lsn))) == null ? void 0 : _c.add(metadata.snapshot_mark)) != null ? _d : /* @__PURE__ */ new Set([metadata.snapshot_mark]);
    this.snapshotsByDatabaseLsn.set(
      BigInt(metadata.database_lsn),
      databaseLsnSet
    );
  }
  /**
   * Remove a snapshot from tracking
   */
  removeSnapshot(snapshotMark) {
    this.activeSnapshots.delete(snapshotMark);
  }
  /**
   * Check if a change message should be filtered because its already in an active snapshot
   * Returns true if the message should be filtered out (not processed)
   */
  shouldRejectMessage(message) {
    const txids = message.headers.txids || [];
    if (txids.length === 0) return false;
    const xid = Math.max(...txids);
    for (const [xmax, snapshots] of this.xmaxSnapshots.entries()) {
      if (xid >= xmax) {
        for (const snapshot of snapshots) {
          this.removeSnapshot(snapshot);
        }
      }
    }
    return [...this.activeSnapshots.values()].some(
      (x) => x.keys.has(message.key) && isVisibleInSnapshot(xid, x)
    );
  }
  lastSeenUpdate(newDatabaseLsn) {
    for (const [dbLsn, snapshots] of this.snapshotsByDatabaseLsn.entries()) {
      if (dbLsn <= newDatabaseLsn) {
        for (const snapshot of snapshots) {
          this.removeSnapshot(snapshot);
        }
      }
    }
  }
};
var RESERVED_PARAMS = /* @__PURE__ */ new Set([
  LIVE_CACHE_BUSTER_QUERY_PARAM,
  SHAPE_HANDLE_QUERY_PARAM,
  LIVE_QUERY_PARAM,
  OFFSET_QUERY_PARAM
]);
function resolveValue(value) {
  return __async(this, null, function* () {
    if (typeof value === `function`) {
      return value();
    }
    return value;
  });
}
__name(resolveValue, "resolveValue");
function toInternalParams(params) {
  return __async(this, null, function* () {
    const entries = Object.entries(params);
    const resolvedEntries = yield Promise.all(
      entries.map((_0) => __async(this, [_0], function* ([key, value]) {
        if (value === void 0) return [key, void 0];
        const resolvedValue = yield resolveValue(value);
        return [
          key,
          Array.isArray(resolvedValue) ? resolvedValue.join(`,`) : resolvedValue
        ];
      }))
    );
    return Object.fromEntries(
      resolvedEntries.filter(([_2, value]) => value !== void 0)
    );
  });
}
__name(toInternalParams, "toInternalParams");
function resolveHeaders(headers) {
  return __async(this, null, function* () {
    if (!headers) return {};
    const entries = Object.entries(headers);
    const resolvedEntries = yield Promise.all(
      entries.map((_0) => __async(this, [_0], function* ([key, value]) {
        return [key, yield resolveValue(value)];
      }))
    );
    return Object.fromEntries(resolvedEntries);
  });
}
__name(resolveHeaders, "resolveHeaders");
function canonicalShapeKey(url) {
  const cleanUrl = new URL(url.origin + url.pathname);
  for (const [key, value] of url.searchParams) {
    if (!ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
      cleanUrl.searchParams.set(key, value);
    }
  }
  cleanUrl.searchParams.sort();
  return cleanUrl.toString();
}
__name(canonicalShapeKey, "canonicalShapeKey");
var _error;
var _fetchClient2;
var _sseFetchClient;
var _messageParser;
var _subscribers;
var _started;
var _state;
var _lastOffset;
var _liveCacheBuster;
var _lastSyncedAt;
var _isUpToDate;
var _isMidStream;
var _connected;
var _shapeHandle;
var _mode;
var _schema;
var _onError;
var _requestAbortController;
var _isRefreshing;
var _tickPromise;
var _tickPromiseResolver;
var _tickPromiseRejecter;
var _messageChain;
var _snapshotTracker;
var _activeSnapshotRequests;
var _midStreamPromise;
var _midStreamPromiseResolver;
var _ShapeStream_instances;
var start_fn;
var requestShape_fn;
var constructUrl_fn;
var createAbortListener_fn;
var onInitialResponse_fn;
var onMessages_fn;
var fetchShape_fn;
var requestShapeLongPoll_fn;
var requestShapeSSE_fn;
var pause_fn;
var resume_fn;
var nextTick_fn;
var waitForStreamEnd_fn;
var publish_fn;
var sendErrorToSubscribers_fn;
var subscribeToVisibilityChanges_fn;
var reset_fn;
var fetchSnapshot_fn;
var ShapeStream = class {
  static {
    __name(this, "ShapeStream");
  }
  constructor(options) {
    __privateAdd(this, _ShapeStream_instances);
    __privateAdd(this, _error, null);
    __privateAdd(this, _fetchClient2);
    __privateAdd(this, _sseFetchClient);
    __privateAdd(this, _messageParser);
    __privateAdd(this, _subscribers, /* @__PURE__ */ new Map());
    __privateAdd(this, _started, false);
    __privateAdd(this, _state, `active`);
    __privateAdd(this, _lastOffset);
    __privateAdd(this, _liveCacheBuster);
    __privateAdd(this, _lastSyncedAt);
    __privateAdd(this, _isUpToDate, false);
    __privateAdd(this, _isMidStream, true);
    __privateAdd(this, _connected, false);
    __privateAdd(this, _shapeHandle);
    __privateAdd(this, _mode);
    __privateAdd(this, _schema);
    __privateAdd(this, _onError);
    __privateAdd(this, _requestAbortController);
    __privateAdd(this, _isRefreshing, false);
    __privateAdd(this, _tickPromise);
    __privateAdd(this, _tickPromiseResolver);
    __privateAdd(this, _tickPromiseRejecter);
    __privateAdd(this, _messageChain, Promise.resolve([]));
    __privateAdd(this, _snapshotTracker, new SnapshotTracker());
    __privateAdd(this, _activeSnapshotRequests, 0);
    __privateAdd(this, _midStreamPromise);
    __privateAdd(this, _midStreamPromiseResolver);
    var _a, _b, _c, _d;
    this.options = __spreadValues({ subscribe: true }, options);
    validateOptions(this.options);
    __privateSet(this, _lastOffset, (_a = this.options.offset) != null ? _a : `-1`);
    __privateSet(this, _liveCacheBuster, ``);
    __privateSet(this, _shapeHandle, this.options.handle);
    __privateSet(this, _messageParser, new MessageParser(
      options.parser,
      options.transformer
    ));
    __privateSet(this, _onError, this.options.onError);
    __privateSet(this, _mode, (_b = this.options.log) != null ? _b : `full`);
    const baseFetchClient = (_c = options.fetchClient) != null ? _c : (...args) => fetch(...args);
    const backOffOpts = __spreadProps(__spreadValues({}, (_d = options.backoffOptions) != null ? _d : BackoffDefaults), {
      onFailedAttempt: /* @__PURE__ */ __name(() => {
        var _a2, _b2;
        __privateSet(this, _connected, false);
        (_b2 = (_a2 = options.backoffOptions) == null ? void 0 : _a2.onFailedAttempt) == null ? void 0 : _b2.call(_a2);
      }, "onFailedAttempt")
    });
    const fetchWithBackoffClient = createFetchWithBackoff(
      baseFetchClient,
      backOffOpts
    );
    __privateSet(this, _sseFetchClient, createFetchWithResponseHeadersCheck(
      createFetchWithChunkBuffer(fetchWithBackoffClient)
    ));
    __privateSet(this, _fetchClient2, createFetchWithConsumedMessages(__privateGet(this, _sseFetchClient)));
    __privateMethod(this, _ShapeStream_instances, subscribeToVisibilityChanges_fn).call(this);
  }
  get shapeHandle() {
    return __privateGet(this, _shapeHandle);
  }
  get error() {
    return __privateGet(this, _error);
  }
  get isUpToDate() {
    return __privateGet(this, _isUpToDate);
  }
  get lastOffset() {
    return __privateGet(this, _lastOffset);
  }
  get mode() {
    return __privateGet(this, _mode);
  }
  subscribe(callback, onError = () => {
  }) {
    const subscriptionId = Math.random();
    __privateGet(this, _subscribers).set(subscriptionId, [callback, onError]);
    if (!__privateGet(this, _started)) __privateMethod(this, _ShapeStream_instances, start_fn).call(this);
    return () => {
      __privateGet(this, _subscribers).delete(subscriptionId);
    };
  }
  unsubscribeAll() {
    __privateGet(this, _subscribers).clear();
  }
  /** Unix time at which we last synced. Undefined when `isLoading` is true. */
  lastSyncedAt() {
    return __privateGet(this, _lastSyncedAt);
  }
  /** Time elapsed since last sync (in ms). Infinity if we did not yet sync. */
  lastSynced() {
    if (__privateGet(this, _lastSyncedAt) === void 0) return Infinity;
    return Date.now() - __privateGet(this, _lastSyncedAt);
  }
  /** Indicates if we are connected to the Electric sync service. */
  isConnected() {
    return __privateGet(this, _connected);
  }
  /** True during initial fetch. False afterwise.  */
  isLoading() {
    return !__privateGet(this, _isUpToDate);
  }
  hasStarted() {
    return __privateGet(this, _started);
  }
  isPaused() {
    return __privateGet(this, _state) === `paused`;
  }
  /**
   * Refreshes the shape stream.
   * This preemptively aborts any ongoing long poll and reconnects without
   * long polling, ensuring that the stream receives an up to date message with the
   * latest LSN from Postgres at that point in time.
   */
  forceDisconnectAndRefresh() {
    return __async(this, null, function* () {
      var _a, _b;
      __privateSet(this, _isRefreshing, true);
      if (__privateGet(this, _isUpToDate) && !((_a = __privateGet(this, _requestAbortController)) == null ? void 0 : _a.signal.aborted)) {
        (_b = __privateGet(this, _requestAbortController)) == null ? void 0 : _b.abort(FORCE_DISCONNECT_AND_REFRESH);
      }
      yield __privateMethod(this, _ShapeStream_instances, nextTick_fn).call(this);
      __privateSet(this, _isRefreshing, false);
    });
  }
  /**
   * Request a snapshot for subset of data.
   *
   * Only available when mode is `changes_only`.
   * Returns the insertion point & the data, but more importantly injects the data
   * into the subscribed data stream. Returned value is unlikely to be useful for the caller,
   * unless the caller has complicated additional logic.
   *
   * Data will be injected in a way that's also tracking further incoming changes, and it'll
   * skip the ones that are already in the snapshot.
   *
   * @param opts - The options for the snapshot request.
   * @returns The metadata and the data for the snapshot.
   */
  requestSnapshot(opts) {
    return __async(this, null, function* () {
      if (__privateGet(this, _mode) === `full`) {
        throw new Error(
          `Snapshot requests are not supported in ${__privateGet(this, _mode)} mode, as the consumer is guaranteed to observe all data`
        );
      }
      if (!__privateGet(this, _started)) yield __privateMethod(this, _ShapeStream_instances, start_fn).call(this);
      yield __privateMethod(this, _ShapeStream_instances, waitForStreamEnd_fn).call(this);
      __privateWrapper(this, _activeSnapshotRequests)._++;
      try {
        if (__privateGet(this, _activeSnapshotRequests) === 1) {
          __privateMethod(this, _ShapeStream_instances, pause_fn).call(this);
        }
        const { fetchUrl, requestHeaders } = yield __privateMethod(this, _ShapeStream_instances, constructUrl_fn).call(this, this.options.url, true, opts);
        const { metadata, data } = yield __privateMethod(this, _ShapeStream_instances, fetchSnapshot_fn).call(this, fetchUrl, requestHeaders);
        const dataWithEndBoundary = data.concat([
          { headers: __spreadValues({ control: `snapshot-end` }, metadata) }
        ]);
        __privateGet(this, _snapshotTracker).addSnapshot(
          metadata,
          new Set(data.map((message) => message.key))
        );
        __privateMethod(this, _ShapeStream_instances, onMessages_fn).call(this, dataWithEndBoundary, false);
        return {
          metadata,
          data
        };
      } finally {
        __privateWrapper(this, _activeSnapshotRequests)._--;
        if (__privateGet(this, _activeSnapshotRequests) === 0) {
          __privateMethod(this, _ShapeStream_instances, resume_fn).call(this);
        }
      }
    });
  }
};
_error = /* @__PURE__ */ new WeakMap();
_fetchClient2 = /* @__PURE__ */ new WeakMap();
_sseFetchClient = /* @__PURE__ */ new WeakMap();
_messageParser = /* @__PURE__ */ new WeakMap();
_subscribers = /* @__PURE__ */ new WeakMap();
_started = /* @__PURE__ */ new WeakMap();
_state = /* @__PURE__ */ new WeakMap();
_lastOffset = /* @__PURE__ */ new WeakMap();
_liveCacheBuster = /* @__PURE__ */ new WeakMap();
_lastSyncedAt = /* @__PURE__ */ new WeakMap();
_isUpToDate = /* @__PURE__ */ new WeakMap();
_isMidStream = /* @__PURE__ */ new WeakMap();
_connected = /* @__PURE__ */ new WeakMap();
_shapeHandle = /* @__PURE__ */ new WeakMap();
_mode = /* @__PURE__ */ new WeakMap();
_schema = /* @__PURE__ */ new WeakMap();
_onError = /* @__PURE__ */ new WeakMap();
_requestAbortController = /* @__PURE__ */ new WeakMap();
_isRefreshing = /* @__PURE__ */ new WeakMap();
_tickPromise = /* @__PURE__ */ new WeakMap();
_tickPromiseResolver = /* @__PURE__ */ new WeakMap();
_tickPromiseRejecter = /* @__PURE__ */ new WeakMap();
_messageChain = /* @__PURE__ */ new WeakMap();
_snapshotTracker = /* @__PURE__ */ new WeakMap();
_activeSnapshotRequests = /* @__PURE__ */ new WeakMap();
_midStreamPromise = /* @__PURE__ */ new WeakMap();
_midStreamPromiseResolver = /* @__PURE__ */ new WeakMap();
_ShapeStream_instances = /* @__PURE__ */ new WeakSet();
start_fn = /* @__PURE__ */ __name(function() {
  return __async(this, null, function* () {
    var _a;
    __privateSet(this, _started, true);
    try {
      yield __privateMethod(this, _ShapeStream_instances, requestShape_fn).call(this);
    } catch (err) {
      __privateSet(this, _error, err);
      if (__privateGet(this, _onError)) {
        const retryOpts = yield __privateGet(this, _onError).call(this, err);
        if (typeof retryOpts === `object`) {
          __privateMethod(this, _ShapeStream_instances, reset_fn).call(this);
          if (`params` in retryOpts) {
            this.options.params = retryOpts.params;
          }
          if (`headers` in retryOpts) {
            this.options.headers = retryOpts.headers;
          }
          __privateSet(this, _started, false);
          __privateMethod(this, _ShapeStream_instances, start_fn).call(this);
        }
        return;
      }
      throw err;
    } finally {
      __privateSet(this, _connected, false);
      (_a = __privateGet(this, _tickPromiseRejecter)) == null ? void 0 : _a.call(this);
    }
  });
}, "start_fn");
requestShape_fn = /* @__PURE__ */ __name(function() {
  return __async(this, null, function* () {
    var _a, _b;
    if (__privateGet(this, _state) === `pause-requested`) {
      __privateSet(this, _state, `paused`);
      return;
    }
    if (!this.options.subscribe && (((_a = this.options.signal) == null ? void 0 : _a.aborted) || __privateGet(this, _isUpToDate))) {
      return;
    }
    const resumingFromPause = __privateGet(this, _state) === `paused`;
    __privateSet(this, _state, `active`);
    const { url, signal } = this.options;
    const { fetchUrl, requestHeaders } = yield __privateMethod(this, _ShapeStream_instances, constructUrl_fn).call(this, url, resumingFromPause);
    const abortListener = yield __privateMethod(this, _ShapeStream_instances, createAbortListener_fn).call(this, signal);
    const requestAbortController = __privateGet(this, _requestAbortController);
    try {
      yield __privateMethod(this, _ShapeStream_instances, fetchShape_fn).call(this, {
        fetchUrl,
        requestAbortController,
        headers: requestHeaders,
        resumingFromPause
      });
    } catch (e) {
      if ((e instanceof FetchError || e instanceof FetchBackoffAbortError) && requestAbortController.signal.aborted && requestAbortController.signal.reason === FORCE_DISCONNECT_AND_REFRESH) {
        return __privateMethod(this, _ShapeStream_instances, requestShape_fn).call(this);
      }
      if (e instanceof FetchBackoffAbortError) {
        if (requestAbortController.signal.aborted && requestAbortController.signal.reason === PAUSE_STREAM) {
          __privateSet(this, _state, `paused`);
        }
        return;
      }
      if (!(e instanceof FetchError)) throw e;
      if (e.status == 409) {
        if (__privateGet(this, _shapeHandle)) {
          const shapeKey = canonicalShapeKey(fetchUrl);
          expiredShapesCache.markExpired(shapeKey, __privateGet(this, _shapeHandle));
        }
        const newShapeHandle = e.headers[SHAPE_HANDLE_HEADER] || `${__privateGet(this, _shapeHandle)}-next`;
        __privateMethod(this, _ShapeStream_instances, reset_fn).call(this, newShapeHandle);
        yield __privateMethod(this, _ShapeStream_instances, publish_fn).call(this, e.json);
        return __privateMethod(this, _ShapeStream_instances, requestShape_fn).call(this);
      } else {
        __privateMethod(this, _ShapeStream_instances, sendErrorToSubscribers_fn).call(this, e);
        throw e;
      }
    } finally {
      if (abortListener && signal) {
        signal.removeEventListener(`abort`, abortListener);
      }
      __privateSet(this, _requestAbortController, void 0);
    }
    (_b = __privateGet(this, _tickPromiseResolver)) == null ? void 0 : _b.call(this);
    return __privateMethod(this, _ShapeStream_instances, requestShape_fn).call(this);
  });
}, "requestShape_fn");
constructUrl_fn = /* @__PURE__ */ __name(function(url, resumingFromPause, subsetParams) {
  return __async(this, null, function* () {
    const [requestHeaders, params] = yield Promise.all([
      resolveHeaders(this.options.headers),
      this.options.params ? toInternalParams(convertWhereParamsToObj(this.options.params)) : void 0
    ]);
    if (params) validateParams(params);
    const fetchUrl = new URL(url);
    if (params) {
      if (params.table) setQueryParam(fetchUrl, TABLE_QUERY_PARAM, params.table);
      if (params.where) setQueryParam(fetchUrl, WHERE_QUERY_PARAM, params.where);
      if (params.columns)
        setQueryParam(fetchUrl, COLUMNS_QUERY_PARAM, params.columns);
      if (params.replica) setQueryParam(fetchUrl, REPLICA_PARAM, params.replica);
      if (params.params)
        setQueryParam(fetchUrl, WHERE_PARAMS_PARAM, params.params);
      const customParams = __spreadValues({}, params);
      delete customParams.table;
      delete customParams.where;
      delete customParams.columns;
      delete customParams.replica;
      delete customParams.params;
      for (const [key, value] of Object.entries(customParams)) {
        setQueryParam(fetchUrl, key, value);
      }
    }
    if (subsetParams) {
      if (subsetParams.where)
        setQueryParam(fetchUrl, SUBSET_PARAM_WHERE, subsetParams.where);
      if (subsetParams.params)
        setQueryParam(fetchUrl, SUBSET_PARAM_WHERE_PARAMS, subsetParams.params);
      if (subsetParams.limit)
        setQueryParam(fetchUrl, SUBSET_PARAM_LIMIT, subsetParams.limit);
      if (subsetParams.offset)
        setQueryParam(fetchUrl, SUBSET_PARAM_OFFSET, subsetParams.offset);
      if (subsetParams.orderBy)
        setQueryParam(fetchUrl, SUBSET_PARAM_ORDER_BY, subsetParams.orderBy);
    }
    fetchUrl.searchParams.set(OFFSET_QUERY_PARAM, __privateGet(this, _lastOffset));
    fetchUrl.searchParams.set(LOG_MODE_QUERY_PARAM, __privateGet(this, _mode));
    if (__privateGet(this, _isUpToDate)) {
      if (!__privateGet(this, _isRefreshing) && !resumingFromPause) {
        fetchUrl.searchParams.set(LIVE_QUERY_PARAM, `true`);
      }
      fetchUrl.searchParams.set(
        LIVE_CACHE_BUSTER_QUERY_PARAM,
        __privateGet(this, _liveCacheBuster)
      );
    }
    if (__privateGet(this, _shapeHandle)) {
      fetchUrl.searchParams.set(SHAPE_HANDLE_QUERY_PARAM, __privateGet(this, _shapeHandle));
    }
    const shapeKey = canonicalShapeKey(fetchUrl);
    const expiredHandle = expiredShapesCache.getExpiredHandle(shapeKey);
    if (expiredHandle) {
      fetchUrl.searchParams.set(EXPIRED_HANDLE_QUERY_PARAM, expiredHandle);
    }
    fetchUrl.searchParams.sort();
    return {
      fetchUrl,
      requestHeaders
    };
  });
}, "constructUrl_fn");
createAbortListener_fn = /* @__PURE__ */ __name(function(signal) {
  return __async(this, null, function* () {
    var _a;
    __privateSet(this, _requestAbortController, new AbortController());
    if (signal) {
      const abortListener = /* @__PURE__ */ __name(() => {
        var _a2;
        (_a2 = __privateGet(this, _requestAbortController)) == null ? void 0 : _a2.abort(signal.reason);
      }, "abortListener");
      signal.addEventListener(`abort`, abortListener, { once: true });
      if (signal.aborted) {
        (_a = __privateGet(this, _requestAbortController)) == null ? void 0 : _a.abort(signal.reason);
      }
      return abortListener;
    }
  });
}, "createAbortListener_fn");
onInitialResponse_fn = /* @__PURE__ */ __name(function(response) {
  return __async(this, null, function* () {
    var _a;
    const { headers, status } = response;
    const shapeHandle = headers.get(SHAPE_HANDLE_HEADER);
    if (shapeHandle) {
      __privateSet(this, _shapeHandle, shapeHandle);
    }
    const lastOffset = headers.get(CHUNK_LAST_OFFSET_HEADER);
    if (lastOffset) {
      __privateSet(this, _lastOffset, lastOffset);
    }
    const liveCacheBuster = headers.get(LIVE_CACHE_BUSTER_HEADER);
    if (liveCacheBuster) {
      __privateSet(this, _liveCacheBuster, liveCacheBuster);
    }
    const getSchema = /* @__PURE__ */ __name(() => {
      const schemaHeader = headers.get(SHAPE_SCHEMA_HEADER);
      return schemaHeader ? JSON.parse(schemaHeader) : {};
    }, "getSchema");
    __privateSet(this, _schema, (_a = __privateGet(this, _schema)) != null ? _a : getSchema());
    if (status === 204) {
      __privateSet(this, _lastSyncedAt, Date.now());
    }
  });
}, "onInitialResponse_fn");
onMessages_fn = /* @__PURE__ */ __name(function(batch, isSseMessage = false) {
  return __async(this, null, function* () {
    var _a;
    if (batch.length > 0) {
      __privateSet(this, _isMidStream, true);
      const lastMessage = batch[batch.length - 1];
      if (isUpToDateMessage(lastMessage)) {
        if (isSseMessage) {
          const offset = getOffset(lastMessage);
          if (offset) {
            __privateSet(this, _lastOffset, offset);
          }
        }
        __privateSet(this, _lastSyncedAt, Date.now());
        __privateSet(this, _isUpToDate, true);
        __privateSet(this, _isMidStream, false);
        (_a = __privateGet(this, _midStreamPromiseResolver)) == null ? void 0 : _a.call(this);
      }
      const messagesToProcess = batch.filter((message) => {
        if (isChangeMessage(message)) {
          return !__privateGet(this, _snapshotTracker).shouldRejectMessage(message);
        }
        return true;
      });
      yield __privateMethod(this, _ShapeStream_instances, publish_fn).call(this, messagesToProcess);
    }
  });
}, "onMessages_fn");
fetchShape_fn = /* @__PURE__ */ __name(function(opts) {
  return __async(this, null, function* () {
    if (__privateGet(this, _isUpToDate) && this.options.experimentalLiveSse && !__privateGet(this, _isRefreshing) && !opts.resumingFromPause) {
      opts.fetchUrl.searchParams.set(EXPERIMENTAL_LIVE_SSE_QUERY_PARAM, `true`);
      return __privateMethod(this, _ShapeStream_instances, requestShapeSSE_fn).call(this, opts);
    }
    return __privateMethod(this, _ShapeStream_instances, requestShapeLongPoll_fn).call(this, opts);
  });
}, "fetchShape_fn");
requestShapeLongPoll_fn = /* @__PURE__ */ __name(function(opts) {
  return __async(this, null, function* () {
    const { fetchUrl, requestAbortController, headers } = opts;
    const response = yield __privateGet(this, _fetchClient2).call(this, fetchUrl.toString(), {
      signal: requestAbortController.signal,
      headers
    });
    __privateSet(this, _connected, true);
    yield __privateMethod(this, _ShapeStream_instances, onInitialResponse_fn).call(this, response);
    const schema = __privateGet(this, _schema);
    const res = yield response.text();
    const messages = res || `[]`;
    const batch = __privateGet(this, _messageParser).parse(messages, schema);
    yield __privateMethod(this, _ShapeStream_instances, onMessages_fn).call(this, batch);
  });
}, "requestShapeLongPoll_fn");
requestShapeSSE_fn = /* @__PURE__ */ __name(function(opts) {
  return __async(this, null, function* () {
    const { fetchUrl, requestAbortController, headers } = opts;
    const fetch2 = __privateGet(this, _sseFetchClient);
    try {
      let buffer = [];
      yield (0, import_fetch_event_source.fetchEventSource)(fetchUrl.toString(), {
        headers,
        fetch: fetch2,
        onopen: /* @__PURE__ */ __name((response) => __async(this, null, function* () {
          __privateSet(this, _connected, true);
          yield __privateMethod(this, _ShapeStream_instances, onInitialResponse_fn).call(this, response);
        }), "onopen"),
        onmessage: /* @__PURE__ */ __name((event) => {
          if (event.data) {
            const schema = __privateGet(this, _schema);
            const message = __privateGet(this, _messageParser).parse(
              event.data,
              schema
            );
            buffer.push(message);
            if (isUpToDateMessage(message)) {
              __privateMethod(this, _ShapeStream_instances, onMessages_fn).call(this, buffer, true);
              buffer = [];
            }
          }
        }, "onmessage"),
        onerror: /* @__PURE__ */ __name((error) => {
          throw error;
        }, "onerror"),
        signal: requestAbortController.signal
      });
    } catch (error) {
      if (requestAbortController.signal.aborted) {
        throw new FetchBackoffAbortError();
      }
      throw error;
    }
  });
}, "requestShapeSSE_fn");
pause_fn = /* @__PURE__ */ __name(function() {
  var _a;
  if (__privateGet(this, _started) && __privateGet(this, _state) === `active`) {
    __privateSet(this, _state, `pause-requested`);
    (_a = __privateGet(this, _requestAbortController)) == null ? void 0 : _a.abort(PAUSE_STREAM);
  }
}, "pause_fn");
resume_fn = /* @__PURE__ */ __name(function() {
  if (__privateGet(this, _started) && __privateGet(this, _state) === `paused`) {
    __privateMethod(this, _ShapeStream_instances, start_fn).call(this);
  }
}, "resume_fn");
nextTick_fn = /* @__PURE__ */ __name(function() {
  return __async(this, null, function* () {
    if (__privateGet(this, _tickPromise)) {
      return __privateGet(this, _tickPromise);
    }
    __privateSet(this, _tickPromise, new Promise((resolve, reject) => {
      __privateSet(this, _tickPromiseResolver, resolve);
      __privateSet(this, _tickPromiseRejecter, reject);
    }));
    __privateGet(this, _tickPromise).finally(() => {
      __privateSet(this, _tickPromise, void 0);
      __privateSet(this, _tickPromiseResolver, void 0);
      __privateSet(this, _tickPromiseRejecter, void 0);
    });
    return __privateGet(this, _tickPromise);
  });
}, "nextTick_fn");
waitForStreamEnd_fn = /* @__PURE__ */ __name(function() {
  return __async(this, null, function* () {
    if (!__privateGet(this, _isMidStream)) {
      return;
    }
    if (__privateGet(this, _midStreamPromise)) {
      return __privateGet(this, _midStreamPromise);
    }
    __privateSet(this, _midStreamPromise, new Promise((resolve) => {
      __privateSet(this, _midStreamPromiseResolver, resolve);
    }));
    __privateGet(this, _midStreamPromise).finally(() => {
      __privateSet(this, _midStreamPromise, void 0);
      __privateSet(this, _midStreamPromiseResolver, void 0);
    });
    return __privateGet(this, _midStreamPromise);
  });
}, "waitForStreamEnd_fn");
publish_fn = /* @__PURE__ */ __name(function(messages) {
  return __async(this, null, function* () {
    __privateSet(this, _messageChain, __privateGet(this, _messageChain).then(
      () => Promise.all(
        Array.from(__privateGet(this, _subscribers).values()).map((_0) => __async(this, [_0], function* ([callback, __]) {
          try {
            yield callback(messages);
          } catch (err) {
            queueMicrotask(() => {
              throw err;
            });
          }
        }))
      )
    ));
    return __privateGet(this, _messageChain);
  });
}, "publish_fn");
sendErrorToSubscribers_fn = /* @__PURE__ */ __name(function(error) {
  __privateGet(this, _subscribers).forEach(([_2, errorFn]) => {
    errorFn == null ? void 0 : errorFn(error);
  });
}, "sendErrorToSubscribers_fn");
subscribeToVisibilityChanges_fn = /* @__PURE__ */ __name(function() {
  if (typeof document === `object` && typeof document.hidden === `boolean` && typeof document.addEventListener === `function`) {
    const visibilityHandler = /* @__PURE__ */ __name(() => {
      if (document.hidden) {
        __privateMethod(this, _ShapeStream_instances, pause_fn).call(this);
      } else {
        __privateMethod(this, _ShapeStream_instances, resume_fn).call(this);
      }
    }, "visibilityHandler");
    document.addEventListener(`visibilitychange`, visibilityHandler);
  }
}, "subscribeToVisibilityChanges_fn");
reset_fn = /* @__PURE__ */ __name(function(handle) {
  __privateSet(this, _lastOffset, `-1`);
  __privateSet(this, _liveCacheBuster, ``);
  __privateSet(this, _shapeHandle, handle);
  __privateSet(this, _isUpToDate, false);
  __privateSet(this, _isMidStream, true);
  __privateSet(this, _connected, false);
  __privateSet(this, _schema, void 0);
  __privateSet(this, _activeSnapshotRequests, 0);
}, "reset_fn");
fetchSnapshot_fn = /* @__PURE__ */ __name(function(url, headers) {
  return __async(this, null, function* () {
    const response = yield __privateGet(this, _fetchClient2).call(this, url.toString(), { headers });
    if (!response.ok) {
      throw new FetchError(
        response.status,
        void 0,
        void 0,
        Object.fromEntries([...response.headers.entries()]),
        url.toString()
      );
    }
    const { metadata, data } = yield response.json();
    const batch = __privateGet(this, _messageParser).parse(
      JSON.stringify(data),
      __privateGet(this, _schema)
    );
    return {
      metadata,
      data: batch
    };
  });
}, "fetchSnapshot_fn");
ShapeStream.Replica = {
  FULL: `full`,
  DEFAULT: `default`
};
function validateParams(params) {
  if (!params) return;
  const reservedParams = Object.keys(params).filter(
    (key) => RESERVED_PARAMS.has(key)
  );
  if (reservedParams.length > 0) {
    throw new ReservedParamError(reservedParams);
  }
}
__name(validateParams, "validateParams");
function validateOptions(options) {
  if (!options.url) {
    throw new MissingShapeUrlError();
  }
  if (options.signal && !(options.signal instanceof AbortSignal)) {
    throw new InvalidSignalError();
  }
  if (options.offset !== void 0 && options.offset !== `-1` && options.offset !== `now` && !options.handle) {
    throw new MissingShapeHandleError();
  }
  validateParams(options.params);
  return;
}
__name(validateOptions, "validateOptions");
function setQueryParam(url, key, value) {
  if (value === void 0 || value == null) {
    return;
  } else if (typeof value === `string`) {
    url.searchParams.set(key, value);
  } else if (typeof value === `object`) {
    for (const [k, v2] of Object.entries(value)) {
      url.searchParams.set(`${key}[${k}]`, v2);
    }
  } else {
    url.searchParams.set(key, value.toString());
  }
}
__name(setQueryParam, "setQueryParam");
function convertWhereParamsToObj(allPgParams) {
  if (Array.isArray(allPgParams.params)) {
    return __spreadProps(__spreadValues({}, allPgParams), {
      params: Object.fromEntries(allPgParams.params.map((v2, i2) => [i2 + 1, v2]))
    });
  }
  return allPgParams;
}
__name(convertWhereParamsToObj, "convertWhereParamsToObj");
var _data;
var _subscribers2;
var _insertedKeys;
var _requestedSubSnapshots;
var _reexecuteSnapshotsPending;
var _status;
var _error2;
var _Shape_instances;
var process_fn;
var reexecuteSnapshots_fn;
var awaitUpToDate_fn;
var updateShapeStatus_fn;
var handleError_fn;
var notify_fn;
_data = /* @__PURE__ */ new WeakMap();
_subscribers2 = /* @__PURE__ */ new WeakMap();
_insertedKeys = /* @__PURE__ */ new WeakMap();
_requestedSubSnapshots = /* @__PURE__ */ new WeakMap();
_reexecuteSnapshotsPending = /* @__PURE__ */ new WeakMap();
_status = /* @__PURE__ */ new WeakMap();
_error2 = /* @__PURE__ */ new WeakMap();
_Shape_instances = /* @__PURE__ */ new WeakSet();
process_fn = /* @__PURE__ */ __name(function(messages) {
  let shouldNotify = false;
  messages.forEach((message) => {
    if (isChangeMessage(message)) {
      shouldNotify = __privateMethod(this, _Shape_instances, updateShapeStatus_fn).call(this, `syncing`);
      if (this.mode === `full`) {
        switch (message.headers.operation) {
          case `insert`:
            __privateGet(this, _data).set(message.key, message.value);
            break;
          case `update`:
            __privateGet(this, _data).set(message.key, __spreadValues(__spreadValues({}, __privateGet(this, _data).get(message.key)), message.value));
            break;
          case `delete`:
            __privateGet(this, _data).delete(message.key);
            break;
        }
      } else {
        switch (message.headers.operation) {
          case `insert`:
            __privateGet(this, _insertedKeys).add(message.key);
            __privateGet(this, _data).set(message.key, message.value);
            break;
          case `update`:
            if (__privateGet(this, _insertedKeys).has(message.key)) {
              __privateGet(this, _data).set(message.key, __spreadValues(__spreadValues({}, __privateGet(this, _data).get(message.key)), message.value));
            }
            break;
          case `delete`:
            if (__privateGet(this, _insertedKeys).has(message.key)) {
              __privateGet(this, _data).delete(message.key);
              __privateGet(this, _insertedKeys).delete(message.key);
            }
            break;
        }
      }
    }
    if (isControlMessage(message)) {
      switch (message.headers.control) {
        case `up-to-date`:
          shouldNotify = __privateMethod(this, _Shape_instances, updateShapeStatus_fn).call(this, `up-to-date`);
          if (__privateGet(this, _reexecuteSnapshotsPending)) {
            __privateSet(this, _reexecuteSnapshotsPending, false);
            void __privateMethod(this, _Shape_instances, reexecuteSnapshots_fn).call(this);
          }
          break;
        case `must-refetch`:
          __privateGet(this, _data).clear();
          __privateGet(this, _insertedKeys).clear();
          __privateSet(this, _error2, false);
          shouldNotify = __privateMethod(this, _Shape_instances, updateShapeStatus_fn).call(this, `syncing`);
          __privateSet(this, _reexecuteSnapshotsPending, true);
          break;
      }
    }
  });
  if (shouldNotify) __privateMethod(this, _Shape_instances, notify_fn).call(this);
}, "process_fn");
reexecuteSnapshots_fn = /* @__PURE__ */ __name(function() {
  return __async(this, null, function* () {
    yield __privateMethod(this, _Shape_instances, awaitUpToDate_fn).call(this);
    yield Promise.all(
      Array.from(__privateGet(this, _requestedSubSnapshots)).map((jsonParams) => __async(this, null, function* () {
        try {
          const snapshot = JSON.parse(jsonParams);
          yield this.stream.requestSnapshot(snapshot);
        } catch (_2) {
        }
      }))
    );
  });
}, "reexecuteSnapshots_fn");
awaitUpToDate_fn = /* @__PURE__ */ __name(function() {
  return __async(this, null, function* () {
    if (this.stream.isUpToDate) return;
    yield new Promise((resolve) => {
      const check = /* @__PURE__ */ __name(() => {
        if (this.stream.isUpToDate) {
          clearInterval(interval);
          unsub();
          resolve();
        }
      }, "check");
      const interval = setInterval(check, 10);
      const unsub = this.stream.subscribe(
        () => check(),
        () => check()
      );
      check();
    });
  });
}, "awaitUpToDate_fn");
updateShapeStatus_fn = /* @__PURE__ */ __name(function(status) {
  const stateChanged = __privateGet(this, _status) !== status;
  __privateSet(this, _status, status);
  return stateChanged && status === `up-to-date`;
}, "updateShapeStatus_fn");
handleError_fn = /* @__PURE__ */ __name(function(e) {
  if (e instanceof FetchError) {
    __privateSet(this, _error2, e);
    __privateMethod(this, _Shape_instances, notify_fn).call(this);
  }
}, "handleError_fn");
notify_fn = /* @__PURE__ */ __name(function() {
  __privateGet(this, _subscribers2).forEach((callback) => {
    callback({ value: this.currentValue, rows: this.currentRows });
  });
}, "notify_fn");

export {
  customAlphabet,
  nanoid,
  o,
  esm_exports2 as esm_exports,
  init_esm3 as init_esm,
  require_src,
  EventSourceParserStream,
  require_lib,
  FetchError,
  isChangeMessage,
  isControlMessage,
  ShapeStream,
  require_src2,
  require_src3,
  index_esm_default
};
/*! Bundled license information:

@google-cloud/precise-date/build/src/index.js:
  (*!
   * Copyright 2019 Google Inc. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=chunk-N2VJDWOE.mjs.map
