import React from "react";
import { ApiHelper, GroupInterface, InputBox, ErrorMessages, ServiceTimesEdit } from ".";
import { Navigate } from "react-router-dom";
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"

interface Props { group: GroupInterface, updatedFunction: (group: GroupInterface) => void }

export const GroupDetailsEdit: React.FC<Props> = (props) => {
  const [group, setGroup] = React.useState<GroupInterface>({} as GroupInterface);
  const [errors, setErrors] = React.useState([]);
  const [redirect, setRedirect] = React.useState("");

  const handleCancel = () => props.updatedFunction(group);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let g = { ...group };
    switch (e.target.name) {
      case "categoryName": g.categoryName = e.target.value; break;
      case "name": g.name = e.target.value; break;
      case "trackAttendance": g.trackAttendance = (e.target.value === "true"); break;
      case "parentPickup": g.parentPickup = (e.target.value === "true"); break;
    }
    setGroup(g);
  }

  const validate = () => {
    let errors = [];
    if (group.categoryName === "") errors.push("Please enter a category name.");
    if (group.name === "") errors.push("Please enter a group name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/groups", [group], "MembershipApi").then(data => {
        setGroup(data);
        props.updatedFunction(data);
      });
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this group?")) {
      ApiHelper.delete("/groups/" + group.id.toString(), "MembershipApi").then(() => setRedirect("/groups"));
    }
  }

  React.useEffect(() => { setGroup(props.group) }, [props.group]);

  if (redirect !== "") return <Navigate to={redirect} />
  else return (
    <InputBox id="groupDetailsBox" headerText="Group Details" headerIcon="group" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
      <ErrorMessages errors={errors} />
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <TextField fullWidth type="text" name="categoryName" label="Category Name" value={group.categoryName} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField fullWidth label="Group Name" type="text" name="name" value={group.name} onChange={handleChange} onKeyDown={handleKeyDown} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Track Attendance</InputLabel>
            <Select label="Track Attendance" id="trackAttendance" name="trackAttendance" data-cy="select-attendance-type" value={group.trackAttendance?.toString() || "false"} onChange={handleChange} onKeyDown={handleKeyDown}>
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Parent Pickup</InputLabel>
            <Select label="Parent Pickup" name="parentPickup" value={group.parentPickup?.toString() || "false"} onChange={handleChange} onKeyDown={handleKeyDown}>
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <ServiceTimesEdit group={group} />
    </InputBox>
  );
}
