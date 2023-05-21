const EN = require("../extracted/en.json");
const {
  pipe,
  toPairs,
  reduce,
  over,
  lensProp,
  prop,
  addIndex,
  map,
  filter,
  groupBy,
  mapObjIndexed,
  length,
  pathOr,
  identity,
  chain,
  fromPairs,
  split,
  intersection,
  omit,
  concat,
  equals,
} = require("ramda");
const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");
const stringSimilarity = require("string-similarity");

const util = require("util");

const inspect = (obj) =>
  util.inspect(obj, { showHidden: false, depth: null, colors: true });

const valuesToKeys = pipe(
  toPairs,
  reduce(
    (acc, [k, v]) => over(lensProp(v), (kArr = []) => kArr.concat(k), acc),
    {}
  )
);
// {"Next": ["assessment.button.next", "controls.next", ...]}
const vkMap = valuesToKeys(EN);

// const rootPath = (...paths) => path.join(__dirname, ...paths);
const outputPath = (...paths) => path.join(__dirname, "output", ...paths);

const config = {
  INPUT_CSV_PATH: path.join(__dirname, "./input.csv"),
  // TODO: EN
};

const getInputCsv = (path = config.INPUT_CSV_PATH) => {
  const csv = fs.readFileSync(path, {
    encoding: "utf8",
    flag: "r",
  });
  // https://github.com/mholt/PapaParse
  const papaparsedCsvInput = Papa.parse(csv, { header: true });
  /*
    data: [...],
    errors: [],
    meta: { delimiter: ',', linebreak: '\n', aborted: false, truncated: false, cursor: 361941, fields: [Array] }
  */
  return papaparsedCsvInput.data;
};

const MAX_COMPUTATIONS = Infinity;
let computedCount = 0;

const getBestMatchMaybe = ({ enTranslation, vkValues }) => {
  if (computedCount >= MAX_COMPUTATIONS) return undefined;

  try {
    const match = stringSimilarity.findBestMatch(enTranslation, vkValues);
    computedCount++;
    return match;
  } catch (error) {
    console.log(
      "ERROR getBestMatchMaybe",
      inspect({ enTranslation, vkValues })
    );
    throw new Error(error);
  }
};

const vkPairs = toPairs(vkMap);
const vkValues = map(prop(0), vkPairs);

const getBestMatchProps = (item) => {
  const skip = !!item.computed.keys?.length;
  // TODO: || manual_keys
  if (skip)
    return {
      performed: false,
      found: false,
    };
  const bestMatch = getBestMatchMaybe({
    enTranslation: item.source.en ?? "",
    vkValues,
  });

  if (!bestMatch)
    return {
      performed: true,
      found: false,
    };

  const {
    bestMatchIndex,
    bestMatch: { target, rating },
  } = bestMatch;

  const [matchedTranslation, keys] = vkPairs[bestMatchIndex];
  return {
    performed: true,
    found: true,
    matchedTranslation,
    rating,
    keys,
  };
};

const getResults = ({ csvInput }) => {
  const exactMatched = addIndex(map)((source, index) => {
    const appKeys = vkMap[source.en];
    return {
      index,
      source: {
        ...omit(["best_match_bestMatchIndex"], source),
        // index_column: source.index_column,
        // en: source.en,
        // cs: source.cs,
        // fr: source.fr,
        // de_en: source.de_en,
        // de_cz: source.de_cz,
        // es: source.es,
      },
      computed: {
        keys: appKeys,
        //   similar: {
        //     bestMatch,
        //   },
      },
    };
  })(csvInput);

  const results = addIndex(map)((item) => {
    return {
      ...item,
      computed: {
        ...item.computed,
        bestMatch: getBestMatchProps(item),
      },
    };
  })(exactMatched);

  return results;
};

const DEFAULT_UNPARSE_CONFIG = {
  quotes: false, //or array of booleans
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  header: true,
  newline: "\r\n",
  skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
  columns: null, //or array of strings
};

const rewriteFile = ({
  name,
  pathParts, // = [__dirname, "output"],
  fileString,
  json,
}) => {
  const filePath = !pathParts
    ? outputPath(name)
    : path.join(...pathParts, name);
  const data = json ? JSON.stringify(json, null, 2) : fileString;

  fs.rmSync(filePath, { force: true });
  fs.writeFileSync(filePath, data, { encoding: "utf8" });
};

const rewriteTranslation = ({ code, data }) => {
  return rewriteFile({
    name: `${code}.json`,
    json: map(prop(code), data),
    pathParts: [__dirname, "..", "src", "translations"],
  });
};

const writeCsv = ({
  name,
  data,
  mapRow = identity,
  filterRow = identity,
  preFilterRow = identity,
  config = DEFAULT_UNPARSE_CONFIG,
}) => {
  const mapped = pipe(
    filter(preFilterRow),
    map(mapRow),
    filter(filterRow)
  )(data);

  const fileString = Papa.unparse(mapped, config);

  rewriteFile({ name: name + ".csv", fileString });
};

const expand = ({ keysPath }) =>
  pipe(
    filter(pathOr(undefined, keysPath)),
    chain((resultRow) =>
      pipe(
        pathOr(undefined, keysPath),
        (keys) => (Array.isArray(keys) ? keys : split("|", keys)),
        map((key) => [key, resultRow])
      )(resultRow)
    )
    // fromPairs
  );

const pairsToKeys = map(prop(0));

const pairsContainsKey = (key, pairs) => pairs.some((pair) => pair[0] === key);

const createMapResultsOutputRow = (notFoundPairs) => (row) => ({
  manual_keys: row.source.manual_keys || "",
  ...row.source,
  generated_keys: row.computed.keys?.join("|") ?? "",
  best_match_performed: row.computed.bestMatch.performed ? "Performed" : "",
  best_match_found: row.computed.bestMatch.found ? "Found" : "",
  best_match_in_not_found: notFoundPairs // TODO? in getResults
    .filter(([k, v]) => v === row.computed.bestMatch.matchedTranslation)
    .map(([k]) => k)
    .join("|"),
  en_copy: row.source.en,
  best_match_matchedTranslation: row.computed.bestMatch.matchedTranslation,
  best_match_rating: row.computed.bestMatch.rating,
  best_match_keys: row.computed.bestMatch.keys,
});

function run() {
  fs.rmSync(outputPath(), { force: true, recursive: true });
  fs.mkdirSync(outputPath());
  console.log("output folder cleared");

  console.log(
    "input EN.json (app translations)",
    inspect({
      en_length: Object.keys(EN).length,
      unique_values_length: vkPairs.length,
      values_with_multiple_keys_length: pipe(
        toPairs,
        filter(([translation, keys]) => keys?.length > 1),
        prop("length")
      )(vkMap),
      "by keys length(vkMap)": pipe(
        toPairs,
        groupBy(([k, v]) => v?.length ?? 0),
        mapObjIndexed(length)
      )(vkMap),
    })
  );

  const csvInput = getInputCsv();
  const results = getResults({ csvInput });

  console.log(
    "output RESULTS csv",
    inspect({
      total_len: results.length,
      exact_match_length: results.filter((item) => item.computed.keys?.length)
        .length,
      similarity_comparison_performed_len: results.filter(
        (item) => item.computed.bestMatch.performed
      ).length,
      found_len: results.filter((item) => item.computed.bestMatch.found).length,
      notfound_len: results.filter(
        (item) =>
          item.computed.bestMatch.performed && !item.computed.bestMatch.found
      ).length,
    })
  );

  const intermediate = map(createMapResultsOutputRow([]), results);
  const generatedPairs = expand({ keysPath: ["generated_keys"] })(intermediate);
  const manualPairs = expand({ keysPath: ["manual_keys"] })(intermediate);
  const notFoundPairs = pipe(
    toPairs,
    filter(
      ([k, v]) =>
        !pairsContainsKey(k, generatedPairs) &&
        !pairsContainsKey(k, manualPairs)
    )
  )(EN);

  const duplicites = intersection(
    pairsToKeys(generatedPairs),
    pairsToKeys(manualPairs)
  );
  if (duplicites.length) {
    const generatedObj = fromPairs(generatedPairs);
    const manualObj = fromPairs(manualPairs);
    const mapped = duplicites.map((key) => ({
      key,
      generated: generatedObj[key],
      manual: manualObj[key],
    }));
    const filtered = mapped.filter(
      ({ generated, manual }) => !equals(generated, manual)
      // ({ generated, manual }) => generated.manual_keys !== generated.generated_keys
    );
    console.log(inspect({ manualKeys: pairsToKeys(manualPairs) }));
    console.log(inspect({ generatedKeys: pairsToKeys(generatedPairs) }));
    console.log(inspect({ mapped, filtered }));
    // console.log(inspect({ generatedPairs }));
    if (filtered.length)
      throw new Error(
        "Duplicite keys in manual and generated: " + duplicites.join(",")
      );
  }

  console.log(
    "output GENERATED JSON",
    inspect({
      // manualPairs,
      csv_generated_keys_len: generatedPairs.length,
      csv_manual_keys_len: manualPairs.length,
      json_generated_and_manual_len: pipe(
        toPairs,
        filter(
          ([k, v]) =>
            pairsContainsKey(k, generatedPairs) ||
            pairsContainsKey(k, manualPairs)
        ),
        length
      )(EN),
      not_found_len: notFoundPairs.length,
    })
  );
  writeCsv({
    name: "results",
    data: results,
    mapRow: createMapResultsOutputRow(notFoundPairs),
  });
  const withDefinedTsKeys = pipe(
    concat(generatedPairs),
    concat(manualPairs),
    fromPairs
  )([]);

  rewriteTranslation({
    code: "en",
    data: withDefinedTsKeys,
  });
  rewriteTranslation({
    code: "cs",
    data: withDefinedTsKeys,
  });
  rewriteTranslation({
    code: "fr",
    data: withDefinedTsKeys,
  });
  rewriteTranslation({
    code: "de_en",
    data: withDefinedTsKeys,
  });
  rewriteTranslation({
    code: "de_cz",
    data: withDefinedTsKeys,
  });
  rewriteTranslation({
    code: "es",
    data: withDefinedTsKeys,
  });

  rewriteFile({
    name: "not-found.json",
    json: fromPairs(notFoundPairs),
  });
}

run();
