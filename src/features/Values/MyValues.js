import { ArrowBack } from "@mui/icons-material";
import { Box, Button, CardContent, Divider, Skeleton } from "@mui/material";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChipsCard } from "../../components/ChipsCard";
import { HistoryRightMenu } from "../../components/HistoryRightMenu";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { Msg, MsgProvider } from "../../components/Msg";
import { H1, H2, P } from "../../components/Typography";
import { useHistoryEntries } from "../../hooks/useHistoryEntries";
import { routes } from "../../routes";
import { messages } from "./messages";
import { useValuesDict } from "./values";
import { useAuth } from "../Authorization";
import { useQuery } from "react-query";
import { QueryRenderer } from "../QM/QueryRenderer";

const useStaticCallback = (fn) => {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useCallback((...args) => fnRef.current?.(...args), []);
};

// {
//     "id": 1,
//     "username": "slavik.dan12@gmail.com",
//     "type": "VALUES",
//     "createdAt": "2023-08-15T17:12:10.640453",
//     "data": {
//         "type": "VALUES_TYPE",
//         "values": [
//             "fairness",
//             "love",
//             "truth",
//             "independence"
//         ]
//     }
// }

const useValuesHistoryQuery = () => {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: ["values"],
    onSuccess: (data) => {
      // console.log("q s", { data });
    },
    queryFn: async () => authFetch({ url: "/api/latest/history/VALUES" }),
  });
};

export const useMakeSelectable = ({
  entries = [],
  idKey = "timestamp",
  map,
}) => {
  const staticMap = useStaticCallback(map);
  const stack = useMemo(() => entries.map(staticMap), [entries, staticMap]);
  const last = stack[stack.length - 1];
  const [selectedId, setSelectedId] = useState();
  const isSelected = useCallback(
    (entry) => selectedId && entry[idKey] === selectedId,
    [idKey, selectedId]
  );
  const selected = stack.find(isSelected);

  return {
    last,
    all: stack,
    selected: selected || last,
    setSelected: useCallback((entry) => setSelectedId(entry?.[idKey]), []),
    isSelected,
  };
};

export function MyValuesPage() {
  const query = useValuesHistoryQuery();
  const sel = useMakeSelectable({
    entries: query.data ?? [],
    map: (el) => ({
      date: el.createdAt,
      timestamp: new Date(el.createdAt).getTime(),
      selectedKeys: el.data.values,
    }),
  });

  // const history = useHistoryEntries({ storageKey: "values_history" });

  const navigate = useNavigate();
  const { values } = useValuesDict();

  console.log("[MyValues.rndr]", {
    // history,
    query,
    sel,
  });

  // if (!query.data) {
  //   return <Skeleton />;
  // }

  return (
    <MsgProvider messages={messages}>
      <Layout
        rightMenuContent={
          <HistoryRightMenu
            heading={<Msg id="values.aside.title" />}
            perex={<Msg id="values.aside.perex" />}
            history={sel}
            // onRemove={history.remove}
            buttonProps={{
              children: <Msg id="values.aside.save" />,
              onClick: () => navigate(routes.setValues),
            }}
          />
        }
      >
        <Box mt={4} mb={3}>
          <Box
            display="flex"
            flexWrap="nowrap"
            alignItems="center"
            flexDirection="row"
          >
            <Button href={routes.dashboard}>
              <ArrowBack />
              <H2>
                <Msg id="values.header.back" />
              </H2>
            </Button>
          </Box>
          <Divider variant="fullWidth" sx={{ mt: 2, mb: 3 }} />
        </Box>
        <Box>
          <H1>
            <Msg id="values.heading" />
          </H1>
          <P mt={1} mb={3}>
            <Msg id="values.perex" />
          </P>
          <QueryRenderer
            {...query}
            success={() => (
              <ChipsCard
                keys={sel.selected?.selectedKeys}
                dict={values}
                renderSummary={() => (
                  <CardContent>
                    <P>
                      <Msg id="values.card.summary" />
                    </P>
                  </CardContent>
                )}
                renderSelected={({ name, description }) => (
                  <CardContent>
                    <InfoBox color="primary" heading={name}>
                      {description}
                    </InfoBox>
                  </CardContent>
                )}
              />
            )}
          />
        </Box>
      </Layout>
    </MsgProvider>
  );
}
