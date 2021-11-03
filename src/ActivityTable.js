import Items from "./Items";
import {ActivityUsersRow, EditableCell} from "./TableElements";


function ActivityTable(props) {

    const selectedActivity = props.selectedActivity;
    const activityItems = props.items.filter(item => selectedActivity.items_id.includes(item.item_id));

    return (
        <div className="table-wrapper">
            <h2>
                <EditableCell activityHeader={true}
                              value={selectedActivity.activity_name}
                              id={selectedActivity.activity_id}
                              handleChange={props.handleActivityNameChange}
                              charLimit={20}/>
            </h2>
            <div className="table activity-table">
                <ActivityUsersRow users={props.users}
                                  activityID={selectedActivity.activity_id}
                                  handleAddUser={props.handleAddUser}
                />
                <Items activity={props.selectedActivity}
                       users={props.users}
                       items={activityItems}
                       handleCheckboxClick={props.handlePurchaseClick}
                       handleAddItem={props.handleAddItem}
                       handleDeleteItem={props.handleDeleteItem}
                       handleActivityNameChange={props.handleActivityNameChange}
                       handleItemNameChange={props.handleItemNameChange}
                       handleExpenseChange={props.handleExpenseChange}
                />
            </div>
        </div>
    )
}

export default ActivityTable;