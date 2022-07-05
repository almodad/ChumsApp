import React from "react";
import { Grid, Icon, Typography } from "@mui/material";
import { ApiHelper, ArrayHelper, DateHelper, DisplayBox, TaskInterface } from "../components";
import { SmallButton } from "../appBase/components";
import { Link } from "react-router-dom";
import { NewTask } from "./components";
import UserContext from "../UserContext";

export const TasksPage = () => {
  const [showAdd, setShowAdd] = React.useState(false);
  const [tasks, setTasks] = React.useState<TaskInterface[]>([])
  let context = React.useContext(UserContext)

  const editContent = <SmallButton icon="add" onClick={() => { setShowAdd(true) }} />

  const loadData = () => { ApiHelper.get("/tasks", "DoingApi").then(data => setTasks(data)); }

  React.useEffect(loadData, []);

  const getTask = (task: TaskInterface) => (<div style={{ borderTop: "1px solid #CCC", paddingTop: 10, paddingBottom: 10 }}>
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <b><Link to={"/tasks/" + task.id}>{task.title}</Link></b><br />
        <Typography variant="caption">#{task.taskNumber} opened {DateHelper.getDisplayDuration(DateHelper.convertToDate(task.dateCreated))} ago by {task.createdByLabel}</Typography>
      </Grid>
      <Grid item xs={3}>
        {task.associatedWithLabel}
      </Grid>
      <Grid item xs={3}>
        {task.assignedToLabel}
      </Grid>
    </Grid>
  </div>)

  const getHeader = () => (<div style={{ paddingBottom: 10 }}>
    <Grid container spacing={3}>
      <Grid item xs={6}>
        Title
      </Grid>
      <Grid item xs={3}>Associated with</Grid>
      <Grid item xs={3}>Assigned to</Grid>
    </Grid>
  </div>)

  const getAssignedToMe = () => {
    const assignedToMe = (tasks?.length > 0) ? ArrayHelper.getAll(tasks, "assignedToId", context.person?.id) : []
    if (assignedToMe.length === 0) return <></>
    else return (<>
      <h4>Assigned to Me</h4>
      {getHeader()}
      {assignedToMe.map(t => getTask(t))}
    </>);
  }

  const createdByMe = () => {
    const createdByMe = (tasks?.length > 0) ? ArrayHelper.getAll(tasks, "createdById", context.person?.id) : []
    if (createdByMe.length === 0) return <></>
    else return (<>
      <h4>Requested by Me</h4>
      {getHeader()}
      {createdByMe.map(t => getTask(t))}
    </>);
  }

  return (<>
    <h1><Icon>list_alt</Icon> Tasks</h1>
    {showAdd && <NewTask onCancel={() => { setShowAdd(false); }} onSave={() => { setShowAdd(false); }} />}

    <DisplayBox headerIcon="list_alt" headerText="Tasks" editContent={editContent}>
      {getAssignedToMe()}
      {createdByMe()}
    </DisplayBox>
  </>);
}
