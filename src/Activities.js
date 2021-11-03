import {
    ActivityCell,
    ParticipationCheckbox,
    TotalRow,
    PlaceholderCell,
    PlaceholderRow, HeaderCellHover, ExpenseCell
} from "./TableElements";
import {calcActivityExpenses, calcTotalUsersFinance} from './Calculations';


function ActivityRow(props) {
    let checkboxes = [];
    for (const userID of props.partyUsersID) {
        checkboxes.push(<ParticipationCheckbox key={props.activityID.toString() + userID.toString()}
                                               handleCheckboxClick={props.handleCheckboxClick}
                                               activityID={props.activityID}
                                               userID={userID}
                                               defaultChecked={props.activityUsers.includes(userID)}
        />);
    }
    return (
        <div className="table-row activity-row">
            <HeaderCellHover
                activityID={props.activityID}
                handleDelete={props.handleDeleteActivity}
            >
                <ActivityCell
                    activityID={props.activityID}
                    value={props.activityName}
                    handleActivityClick={props.handleActivityClick}
                />
            </HeaderCellHover>
            {checkboxes}
            <PlaceholderCell buttonType="checkbox"/>
            <ExpenseCell value={props.activityExpense}/>
        </div>
    );
}

function Activities(props) {
    const partyUsersID = props.users.map(user => user.user_id);
    const activitiesExpenses = calcActivityExpenses(props.activities, props.items);
    const totalUsersFinance = calcTotalUsersFinance(props.users, props.activities, props.items, activitiesExpenses);
    const usersExpenses = totalUsersFinance.expenses;
    const usersDebt = totalUsersFinance.debt;

    let activitiesRows = [];

    for (const activity of props.activities) {
        const activityID = activity.activity_id;
        const activityName = activity.activity_name;
        const activityUsers = activity.users_id;
        const activityItems = props.items.filter(item => activity.items_id.includes(item.item_id));

        activitiesRows.push(<ActivityRow key={activityID}
                                         activity={activity}
                                         activityID={activityID}
                                         activityName={activityName}
                                         activityUsers={activityUsers}
                                         activityItems={activityItems}
                                         activityExpense={activitiesExpenses[activityID]}
                                         partyUsersID={partyUsersID}
                                         handleActivityClick={props.handleActivityClick}
                                         handleCheckboxClick={props.handleCheckboxClick}
                                         handleDeleteActivity={props.handleDeleteActivity}
        />);
    }

    activitiesRows.push(<PlaceholderRow key={-1}
                                        usersID={partyUsersID}
                                        type={"activity"}
                                        handleAdd={props.handleAddActivity}/>);
    activitiesRows.push(<TotalRow key={-2} rowName={'Total'} expenses={usersExpenses} forPartyTable={true}/>);
    activitiesRows.push(<TotalRow key={-3} rowName={'Debt'} expenses={usersDebt} forPartyTable={true}/>);

    return activitiesRows;
}

export default Activities;