import Activities from "./Activities";
import {PartyUsersRow} from "./TableElements";


function PartyTable(props) {

    return (
        <div className="table-wrapper">
            <h1>Dacha</h1>
            <div className="table party-table">
                <PartyUsersRow users={props.users}
                               handleAddUser={props.handleAddUser}
                               handleDeleteUser={props.handleDeleteUser}
                               handleUsernameChange={props.handleUsernameChange}
                />
                <Activities activities={props.activities}
                            items={props.items}
                            users={props.users}
                            handleActivityClick={props.handleActivityClick}
                            handleCheckboxClick={props.handleParticipationClick}
                            handleAddActivity={props.handleAddActivity}
                            handleDeleteActivity={props.handleDeleteActivity}
                />
            </div>
        </div>
    );
}

export default PartyTable;