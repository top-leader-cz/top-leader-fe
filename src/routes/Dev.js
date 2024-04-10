import { Box } from "@mui/material";
import {
  addIndex,
  always,
  applySpec,
  assoc,
  chain,
  filter,
  fromPairs,
  groupBy,
  gte,
  identity,
  includes,
  keys,
  length,
  lensProp,
  lte,
  map,
  mapObjIndexed,
  over,
  path,
  pathOr,
  pathSatisfies,
  pick,
  pipe,
  prop,
  propSatisfies,
  reduce,
  tap,
  toPairs,
  uniq,
  uniqBy,
  update,
  values,
} from "ramda";
import { Layout } from "../components/Layout";
import { H1, H2 } from "../components/Typography";
import EN from "../translations/en.json";
import stringSimilarity from "string-similarity";
import { csv } from "./translationsCsv";
import Papa from "papaparse";
import { useState } from "react";
import {
  StyledTab,
  StyledTabs,
  TabPanel,
} from "../features/Settings/Settings.page";

const KEYS_SEPARATOR = "|";

// ChatGPT
function findDuplicateValues(obj) {
  var values = {};
  var duplicates = {};

  for (var key in obj) {
    var value = obj[key];
    var type = typeof value;

    if (values[type] === undefined) {
      values[type] = {};
    }

    if (values[type][value] !== undefined) {
      duplicates[value] = duplicates[value] || [values[type][value]];
      duplicates[value].push(key);
    } else {
      values[type][value] = key;
    }
  }

  return duplicates;
}

const valuesToKeys = pipe(
  toPairs,
  reduce(
    (acc, [k, v]) => over(lensProp(v), (kArr = []) => kArr.concat(k), acc),
    {}
  )
);

// https://github.com/mholt/PapaParse
const papaparsedCsvInput = Papa.parse(csv, { header: true });

const dupliciteValues = findDuplicateValues(EN);
const vkMap = valuesToKeys(EN);
const _values = values(vkMap);

const results = pipe(
  prop("data"),
  addIndex(map)((source, i) => {
    const appKeys = vkMap[source.en];

    console.log(i, source.index_column);
    return {
      source: {
        index_column: source.index_column,
        en: source.en,
        cs: source.cs,
        fr: source.fr,
        de_en: source.de_en,
        de_cz: source.de_cz,
        es: source.es,
      },
      computed: {
        keys: appKeys,
        duplicites: dupliciteValues[source.en],
        // similar: {
        //   bestMatch,
        // },
      },
    };
  })
)(papaparsedCsvInput);

const data = {
  EN,
  dupliciteValues,
  vkMap,
  results,
};

console.log({
  data,
  EN,
  stringSimilarity,
  _values,
  bm: stringSimilarity.findBestMatch("ahoj", ["ho", "aho", "cus"]),
});

const meta = pipe(
  applySpec({
    valuesSumLength: pipe(
      toPairs,
      chain(([value, keys]) => keys),
      length
    ),
    keysLength: pipe(keys, length),
  }),
  (meta) => ({
    ABS_DIFF: Math.abs(meta.valuesSumLength - meta.keysLength),
    ...meta,
  })
);

const dedupe = uniqBy(path(["source", "en"]));

const dims = applySpec({
  length,
  byKeysLength: pipe(
    groupBy(path(["computed", "keys", "length"])),
    mapObjIndexed((v, k) => v.length)
  ),
  withKeys: pipe(filter(path(["computed", "keys"])), length),
});

const summary = pipe(
  applySpec({
    original: dims,
    deduplicated: pipe(dedupe, dims),
  })
);

// const fn = pipe(filter());
const fn = identity;
// const fn = pipe(
//   filter(pathSatisfies((len) => len > 2, ["computed", "keys", "length"])),
//   map(
//     applySpec({
//       i: path(["source", "index_column"]),
//       en: path(["source", "en"]),
//       keys: path(["computed", "keys"]),
//     })
//   )
// );

const addCols = (row) => ({
  keys_str: row.computed.keys?.join(KEYS_SEPARATOR) ?? "",
});
const out = pipe(
  map((row) => ({ ...row, output: { ...row.source, ...addCols(row) } })),
  map(prop("output"))
);

const csvMatchedKeys = pipe(
  chain(pathOr([], ["computed", "keys"])),
  uniq
)(results);

const EN_PAIRS = {
  caseInsensitiveMatch: pipe(
    filter(([k, v]) => !csvMatchedKeys.includes(k)),
    map(([k, v]) => [
      k,
      v,
      results.find(
        ({ source }) => source.en?.toLowerCase() === v?.toLowerCase()
      ),
    ]),
    filter(([k, v, row]) => row),
    map(([k, v, row]) => [k, v])
    // fromPairs
  ),
};

const backfire = pipe(
  toPairs,
  // map(([k, v]) => ({ k, v })),
  // groupBy(([k, v]) => {
  //   if (
  //     !results.some(({ computed }) => computed.keys?.some((key) => key === k))
  //   )
  //     return "notMatched";
  //   return "matched";
  // }),
  applySpec({
    // csvMatchedKeys: always(csvMatchedKeys),
    caseInsensitiveMatch: pipe(EN_PAIRS.caseInsensitiveMatch),
    matched: pipe(filter(([k, v]) => csvMatchedKeys.includes(k))),
    notMatched: pipe((en) =>
      filter(
        ([k, v]) =>
          !csvMatchedKeys.includes(k) &&
          !pipe(EN_PAIRS.caseInsensitiveMatch, map(prop(0)), includes(k))(en)
      )(en)
    ),
  }),
  // mapObjIndexed(length)
  mapObjIndexed(fromPairs)
);

const TABS = {
  duplicites: "en duplicites",
  csv: "csv",
  en: "en",
};

const Pre = ({ data, label, sx = {} }) => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "400px",
        overflow: "auto",
        border: "1px solid black",
        // pt: label ? 3 : 0,
        ...sx,
      }}
    >
      <Box sx={{ position: "sticky", top: 0, left: 0, bgcolor: "white" }}>
        {label}
      </Box>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
};

const Area = ({ rows = 10, data, label, sx = {} }) => {
  return (
    <Box
      sx={{
        position: "relative",
        border: "1px solid black",
        // pt: label ? 3 : 0,
        ...sx,
      }}
    >
      <Box sx={{ position: "sticky", top: 0, left: 0, bgcolor: "white" }}>
        {label}
      </Box>
      <textarea style={{ width: "100%" }} rows={rows}>
        {JSON.stringify(data, null, 2)}
      </textarea>
    </Box>
  );
};

export const Dev = ({}) => {
  const [tab, setTab] = useState(TABS.csv);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <StyledTabs value={tab} onChange={handleChange}>
          <StyledTab label={TABS.en} value={TABS.en} />
          <StyledTab label={TABS.duplicites} value={TABS.duplicites} />
          <StyledTab label={TABS.csv} value={TABS.csv} />
        </StyledTabs>
        <TabPanel value={tab} tabName={TABS.en}>
          <Pre
            label="meta(data.EN)"
            data={meta(data.EN)}
            sx={{ height: "140px" }}
          />
          <Pre label="data.EN" data={data.EN} />
          <Pre label="backfire(data.EN)" data={backfire(data.EN)} />
        </TabPanel>
        <TabPanel value={tab} tabName={TABS.duplicites}>
          <Pre
            label="meta(data.EN)"
            data={meta(data.EN)}
            sx={{ height: "140px", mb: 3 }}
          />
          <Pre
            label="meta(data.dupliciteValues)"
            data={meta(data.dupliciteValues)}
            sx={{ height: "140px" }}
          />
          <Pre label="data.dupliciteValues" data={data.dupliciteValues} />

          <Pre
            label="meta(vkMap)"
            data={meta(vkMap)}
            sx={{ mt: 3, height: "140px" }}
          />
          <Pre
            label="by keys length(vkMap)"
            data={pipe(
              toPairs,
              groupBy(([k, v]) => v?.length),
              mapObjIndexed(length)
            )(vkMap)}
            sx={{ mt: 3, height: "140px" }}
          />
          <Pre label="vkMap" data={vkMap} />
        </TabPanel>
        <TabPanel value={tab} tabName={TABS.csv}>
          <Box>
            <Pre label="papaparsedCsvInput" data={papaparsedCsvInput} />
            <Pre
              label="summary(results)"
              data={summary(results)}
              sx={{ mt: 5, height: "180px" }}
            />
            <Pre label="fn(results)" data={fn(results)} />
            <Pre label="out(results)" data={out(results)} rows={70} />
          </Box>
        </TabPanel>
      </Box>
    </Layout>
  );
};
