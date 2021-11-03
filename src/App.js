import React, {useEffect, useState} from "react";
import './App.css';
import PartyTable from "./PartyTable";
import ActivityTable from "./ActivityTable";
import users from "./data/party_users.json";
import activities from "./data/activities.json";
import items from "./data/items.json";


function App() {
    const [currUsers, setCurrUsers] = useState([]);
    const [currActivities, setCurrActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState();
    const [currItems, setCurrItems] = useState([]);

    useEffect(() => {
        setCurrUsers(users.users);
        setCurrActivities(activities.activities);
        setCurrItems(items.items);
    }, []);

    const updateActivityTable = activityID => {
        if (selectedActivity && selectedActivity.activity_name.length === 0) {
            alert("Activity should have name");
            return;
        }
        const activity = currActivities.find(activity => activity.activity_id === activityID);
        setSelectedActivity(activity);
    }

    const handleParticipationClick = (checked, activityID, userID) => {
        setCurrActivities(prevState => prevState.map(activity => {
            if (activity.activity_id === activityID) {
                const updatedUsersID = [...activity.users_id];
                // e.target.checked ?
                checked ?
                    updatedUsersID.push(userID) :
                    updatedUsersID.splice(updatedUsersID.indexOf(userID), 1);

                // make current activity adopt changes
                if (selectedActivity && selectedActivity.activity_id === activityID) {
                    setSelectedActivity({
                            ...activity,
                            users_id: updatedUsersID
                        }
                    );
                }

                return {
                    ...activity,
                    users_id: updatedUsersID
                };
            } else return activity;
        }));
    }

    const handlePurchaseClick = (itemID, userID) => {
        setCurrItems(prevState => prevState.map(item => {
            if (item.item_id === itemID) {
                return {
                    ...item,
                    bought_by: userID
                };
            } else return item;
        }));
    }

    // factory and exceptions, when no property || ids
    const getMaxID = (state, property) => {
        return Math.max(...state.map(obj => obj[property]));
    }

    const handleAddUser = () => {
        if (currUsers.length >= 10) {
            alert("Cannot add a user: 10 users max")
            return;
        }
        const newUserID = getMaxID(currUsers, "user_id") + 1;
        const newUser = {
            user_id: newUserID,
            username: "User"
        };

        setCurrUsers(prevState => [...prevState, newUser]);
    }

    const handleDeleteUser = props => {
        if (currItems.some(item => item.bought_by === props.userID)) {
            alert('Cannot remove the user: they have items purchased')
            return;
        }

        setCurrActivities(prevState => prevState.map(activity => {
            const updatedUsersID = [...activity.users_id];

            if (updatedUsersID.includes(props.userID)) {
                updatedUsersID.splice(updatedUsersID.indexOf(props.userID), 1);
            }

            return {
                ...activity,
                users_id: updatedUsersID
            };
        }));

        setCurrUsers(prevState => prevState.filter(
            user => user.user_id !== props.userID));
    }

    const handleAddActivity = () => {
        const newActivityID = getMaxID(currActivities, "activity_id") + 1;
        const newActivity = {
            activity_id: newActivityID,
            activity_name: "Activity",
            users_id: [],
            items_id: []
        };

        setCurrActivities(prevState => [...prevState, newActivity]);
        setSelectedActivity(newActivity);
    }

    const handleDeleteActivity = props => {
        setCurrActivities(prevState => prevState.filter(
            activity => activity.activity_id !== props.activityID));
        setSelectedActivity();
    }

    const updateActivityItems = (activityID, itemID, action) => {
        setCurrActivities(prevState => prevState.map(activity => {
            if (activity.activity_id === activityID) {
                const updatedItemsID = [...activity.items_id];
                action === 'add' ?
                    updatedItemsID.push(itemID) :
                    updatedItemsID.splice(updatedItemsID.indexOf(itemID), 1);

                // make current activity adopt changes
                if (selectedActivity && selectedActivity.activity_id === activityID) {
                    setSelectedActivity({
                            ...activity,
                            items_id: updatedItemsID
                        }
                    );
                }

                return {
                    ...activity,
                    items_id: updatedItemsID
                };
            } else {
                return activity;
            }
        }));
        // updateActivityTable(activityID);
    }

    const handleAddItem = activityID => {
        const newItemID = getMaxID(currItems, "item_id") + 1;
        const newItem = {
            item_id: newItemID,
            item_name: "Item",
            item_price: 0,
            bought_by: null
        };

        setCurrItems(prevState => [...prevState, newItem]);
        updateActivityItems(activityID, newItemID, 'add');
        // updateActivityTable(activityID);
    }

    // same item cannot be in two activities
    const handleDeleteItem = props => {
        setCurrItems(prevState => prevState.filter(item => item.item_id !== props.itemID));
        updateActivityItems(props.activityID, props.itemID, 'delete');
    }

    const handleUsernameChange = (username, userID) => {
        setCurrUsers(prevState => prevState.map(user => {
            if (user.user_id === userID) {
                return {
                    ...user,
                    username: username
                };
            } else {
                return user;
            }
        }));
    }

    const handleActivityNameChange = (activityName, activityID) => {
        setCurrActivities(prevState => prevState.map(activity => {
            if (activity.activity_id === activityID) {

                // make current activity adopt changes
                if (selectedActivity && selectedActivity.activity_id === activityID) {
                    setSelectedActivity({
                            ...activity,
                            activity_name: activityName
                        }
                    );
                }

                return {
                    ...activity,
                    activity_name: activityName
                };
            } else {
                return activity;
            }
        }));
    }

    const handleItemNameChange = (itemName, itemID) => {
        setCurrItems(prevState => prevState.map(item => {
            if (item.item_id === itemID) {
                return {
                    ...item,
                    item_name: itemName
                }
            } else {
                return item;
            }
        }));
    }

    const handleExpenseChange = (expense, itemID) => {
        setCurrItems(prevState => prevState.map(item => {
            if (item.item_id === itemID) {
                return {
                    ...item,
                    item_price: expense
                }
            } else {
                return item;
            }
        }));
    }


    return (
        <div className="App">
            <div className="tables-container">
                <PartyTable users={currUsers}
                            activities={currActivities}
                            items={currItems}
                            handleActivityClick={updateActivityTable}
                            handleParticipationClick={handleParticipationClick}
                            handleAddUser={handleAddUser}
                            handleDeleteUser={handleDeleteUser}
                            handleUsernameChange={handleUsernameChange}
                            handleAddActivity={handleAddActivity}
                            handleDeleteActivity={handleDeleteActivity}
                />
                {selectedActivity ? <ActivityTable users={currUsers}
                                                   selectedActivity={selectedActivity}
                                                   items={currItems}
                                                   handlePurchaseClick={handlePurchaseClick}
                                                   handleAddUser={handleAddUser}
                                                   handleAddItem={handleAddItem}
                                                   handleDeleteItem={handleDeleteItem}
                                                   handleActivityNameChange={handleActivityNameChange}
                                                   handleItemNameChange={handleItemNameChange}
                                                   handleExpenseChange={handleExpenseChange}
                    /> :
                    <div>
                        <br/>
                        <p>select an activity</p>
                    </div>
                }
            </div>
        </div>

    );
}

export default App;