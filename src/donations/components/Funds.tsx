import React from "react";
import { ApiHelper, FundInterface, FundEdit, DisplayBox, UserHelper, Permissions, Loading } from ".";
import { Link } from "react-router-dom";
import { Icon, Table, TableBody, TableCell, TableRow } from "@mui/material";

export const Funds: React.FC = () => {
  const [funds, setFunds] = React.useState<FundInterface[]>(null);
  const [editFund, setEditFund] = React.useState<FundInterface>(null);

  const loadData = () => {
    ApiHelper.get("/funds", "GivingApi").then(data => { setFunds(data) });
  }
  const handleFundUpdated = () => { loadData(); setEditFund(null); }
  const getEditSection = () => {
    if (UserHelper.checkAccess(Permissions.givingApi.donations.edit)) return (<a href="about:blank" data-cy="add-fund" onClick={(e: React.MouseEvent) => { e.preventDefault(); setEditFund({ id: "", name: "" }) }}><Icon>add</Icon></a>);
    else return null;
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let idx = parseInt(anchor.getAttribute("data-index"));
    setEditFund(funds[idx]);
  }

  const getRows = () => {
    const result: JSX.Element[] = [];

    if (funds.length === 0) {
      result.push(<TableRow key="0">No funds found.</TableRow>);
      return result;
    }

    let canEdit = UserHelper.checkAccess(Permissions.givingApi.donations.edit);
    let canViewIndividual = UserHelper.checkAccess(Permissions.givingApi.donations.view);
    for (let i = 0; i < funds.length; i++) {
      let f = funds[i];
      const editLink = (canEdit) ? (<a href="about:blank" data-cy={`edit-${i}`} onClick={handleEdit} data-index={i}><Icon>edit</Icon></a>) : null;
      const viewLink = (canViewIndividual) ? (<Link to={"/donations/funds/" + f.id}>{f.name}</Link>) : (<>{f.name}</>);
      result.push(<TableBody key={result.length - 1}>
        <TableRow>
          <TableCell> {viewLink}</TableCell>
          <TableCell className="text-right"> {editLink}</TableCell>
        </TableRow>
      </TableBody>)
    }
    return result;
  }

  React.useEffect(loadData, []);

  if (editFund === null) {
    let contents = <Loading />
    if (funds) contents = <Table size="small">{getRows()}</Table>
    return (
      <DisplayBox id="fundsBox" headerIcon="volunteer_activism" data-cy="funds-box" headerText="Funds" editContent={getEditSection()}>
        {contents}
      </DisplayBox>
    );
  }
  else return (<FundEdit fund={editFund} updatedFunction={handleFundUpdated} />);

}

