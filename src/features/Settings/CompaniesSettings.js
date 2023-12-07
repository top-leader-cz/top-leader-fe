import { Button } from "@mui/material";
import { useState } from "react";
import { Icon } from "../../components/Icon";
import { MsgProvider } from "../../components/Msg";
import { useMsg } from "../../components/Msg/Msg";
import { TLCell } from "../../components/Table/TLLoadableTable";
import { TLTableWithHeader } from "../../components/Table/TLTableWithHeader";
import { CompanyModal } from "./Admin/CompanyModal";
import { useCompaniesQuery } from "./Admin/api";
import { messages } from "./messages";

function CompaniesSettingsInner() {
  const [company, setCompany] = useState();
  const msg = useMsg();
  const companiesQuery = useCompaniesQuery();
  // const mutation = useCompanyMutation(); // confirm modal?

  const columns = [
    {
      label: "ID",
      key: "id",
      render: (row) => <TLCell variant="emphasized" name={row.id || ""} />,
    },

    {
      label: "Name",
      key: "name",
      render: (row) => <TLCell variant="emphasized" name={row.name || ""} />,
    },
  ];

  return (
    <>
      <TLTableWithHeader
        titleDef={{
          heading: "Companies",
          chip: `${companiesQuery.data?.length} companies`,
        }}
        columns={columns}
        query={companiesQuery}
        action={
          <Button
            variant="contained"
            startIcon={<Icon name="Add" />}
            onClick={() => {
              setCompany({});
            }}
          >
            Add
          </Button>
        }
      />
      <CompanyModal
        open={!!company}
        initialValues={company}
        onClose={() => setCompany(false)}
      />
    </>
  );
}

export function CompaniesSettings() {
  return (
    <MsgProvider messages={messages}>
      <CompaniesSettingsInner />
    </MsgProvider>
  );
}
