import * as React from 'react';
import { useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AppBar, Box, Button, Modal, TextField, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';

const Dashboard = () => {
    const [checked, setChecked] = React.useState([]);
    const [todoItems, setTodoItems] = React.useState([]);
    const [todoItemsCompleted, setTodoItemsCompleted] = React.useState([]);
    const [openAddNew, setOpenAddNew] = React.useState(false);
    const [newTodoText, setNewTodoText] = React.useState("");
    const [currentActiveTab, setCurrentActiveTab] = React.useState(0);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        p: 4,
    };

    useEffect(() => {
        fetchTodoItems();
    }, []);

    const fetchTodoItems = () => {
        var username = window.localStorage.getItem("username");
        fetch("http://localhost:3000/api/user/added-todos/pending?username=" + username).then((response) => response.json())
            .then((response) => {
                if (response.status === "Success") {
                    setTodoItems(response.data);
                } else {
                    alert(response.err);
                }
            });
    }

    const fetchTodoItemsCompleted = () => {
        var username = window.localStorage.getItem("username");
        fetch("http://localhost:3000/api/user/added-todos/completed?username=" + username).then((response) => response.json())
            .then((response) => {
                if (response.status === "Success") {
                    setTodoItemsCompleted(response.data);
                } else {
                    alert(response.err);
                }
            });
    }

    const handleNewTodoTextChange = (event) => {
        setNewTodoText(event.target.value);
    }

    const saveNewTodo = () => {
        fetch("http://localhost:3000/api/user/add-list", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username: window.localStorage.getItem("username"),
                todo: newTodoText
            })
        }).then((response) => response.json())
            .then((response) => {
                setOpenAddNew(false);
                setCurrentActiveTab(0);
                setNewTodoText("");
                setChecked([]);
                fetchTodoItems();
            });
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleTabChange = (event, newTabIndex) => {
        if (newTabIndex === 1) {
            fetchTodoItemsCompleted();
        }
        else {
            fetchTodoItems();
        }
        setCurrentActiveTab(newTabIndex);
    }

    const handleTodoCompletion = () => {
        fetch("http://localhost:3000/api/user/added-todos/complete", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: window.localStorage.getItem("username"),
                unique_ids: checked
            })
        }).then((response) => response.json())
            .then((response) => {
                if (response.status === "Success") {
                    fetchTodoItems();
                    setChecked([]);
                } else {
                    alert(response.err);
                }
            });
    }

    const handleLogOut = () => {
        window.localStorage.removeItem("username");
        window.location.href = "/";
    }

    return (
        <Container component="main" maxWidth="xl">
            <span>
                <span style={{ fontSize: 30 }}>Todo List</span>
                <Button style={{ float: "right" }} onClick={handleLogOut}>Logout</Button> <br />
            </span>
            <CssBaseline />
            <AppBar position="static">
                <Tabs
                    value={currentActiveTab}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                >
                    <Tab label="Pending Todo List" />
                    <Tab label="Completed Todo List" />
                    <Tab icon={<AddCircle />} label="Add new" onClick={() => { setOpenAddNew(true) }} />
                </Tabs>
                {currentActiveTab === 0 && (todoItems.length > 0) && (
                    <Grid container>
                        <Grid item xl>
                            <List sx={{ alignContent: "center", bgcolor: 'background.paper' }}>
                                {todoItems.map((value) => {
                                    const labelId = `checkbox-list-label-${value.unique_id}`;

                                    return (
                                        <ListItem
                                            key={labelId}
                                        >
                                            <ListItemButton role={undefined} onClick={handleToggle(value.unique_id)} dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        // checked={checked.indexOf(value) !=== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={value.todo} style={{ color: "black" }} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                    </Grid>
                )}
                {currentActiveTab === 1 && (todoItemsCompleted.length > 0) && (
                    <Grid container>
                        <Grid item xl>
                            <List sx={{ alignContent: "center", bgcolor: 'background.paper' }}>
                                {todoItemsCompleted.map((value) => {
                                    const labelId = `checkbox-list-label-${value.unique_id}`;

                                    return (
                                        <ListItem
                                            key={labelId}
                                        >
                                            <ListItemText id={labelId} primary={value.todo} style={{ color: "black", textDecoration: "line-through" }} />

                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Grid>
                    </Grid>
                )}
            </AppBar>
            {currentActiveTab === 0 && (todoItems.length === 0) && (
                <Typography> No items here</Typography>
            )}
            {currentActiveTab === 1 && (todoItemsCompleted.length === 0) && (
                <Typography> No items here</Typography>
            )}
            <Modal
                open={openAddNew}
                onClose={() => { setOpenAddNew(false); setCurrentActiveTab(0); }}
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add a new todo
                    </Typography>
                    <TextField
                        margin="normal"
                        required
                        name="new-todo-item"
                        label="New todo item"
                        type="text"
                        id="new-todo-item"
                        onChange={handleNewTodoTextChange}
                        value={newTodoText}
                    /> <br /><br />
                    <Button onClick={saveNewTodo}> Save </Button>
                    <Button onClick={() => { setOpenAddNew(false); setCurrentActiveTab(0); }}> Cancel </Button>
                </Box>
            </Modal>
            {
                checked.length > 0 && (
                    <Button onClick={handleTodoCompletion}>Mark Completed</Button>
                )
            }
        </Container >
    );
}

export default Dashboard;