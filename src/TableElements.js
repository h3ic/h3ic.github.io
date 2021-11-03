import {useState, useRef} from "react";
import ContentEditable from "react-contenteditable";

/* Rows */

export function PartyUsersRow(props) {
    const userCells = props.users.map(user => <HeaderCellHover key={user.user_id}
                                                               userID={user.user_id}
                                                               value={user.username}
                                                               handleDelete={props.handleDeleteUser}>
            <EditableCell value={user.username}
                          id={user.user_id}
                          handleChange={props.handleUsernameChange}
            />
        </HeaderCellHover>
    );
    return (
        <div className="table-row users-row">
            <div className="table-cell header-cell">X</div>
            {userCells}
            <AddButton handleAdd={props.handleAddUser}/>
            <div className="table-cell header-cell">
                <i>Expenses</i>
            </div>
        </div>
    );
}

export function ActivityUsersRow(props) {
    const userCells = props.users.map(user =>
        <UserCell key={user.user_id} value={user.username}/>
    );
    return (
        <div className="table-row users-row">
            <div className="table-cell header-cell">X</div>
            {userCells}
            <div className="table-cell header-cell">
                <i>Expenses</i>
            </div>
        </div>
    );
}

export function PlaceholderRow(props) {
    const rowType = {
        buttonType: props.type === 'activity' ? 'checkbox' : 'radio',
        editable: props.type !== 'activity'
    }
    let placeholderCells = [];
    for (const userID of props.usersID) {
        placeholderCells.push(
            <PlaceholderCell key={userID} buttonType={rowType.buttonType}/>
        );
    }
    placeholderCells.push(<PlaceholderCell key={-1} buttonType={rowType.buttonType}/>);

    return (
        <div className="table-row placeholder-row">
            <AddButton id={props.activityID} handleAdd={props.handleAdd}/>
            {placeholderCells}
            <div className={"table-cell"}></div>
        </div>
    );
}

export function TotalRow(props) {
    const usersExpensesEntries = Object.entries(props.expenses);
    return (
        <div className="table-row total-row">
            <div className="table-cell header-cell"><i>{'Total' && props.rowName}</i></div>
            {usersExpensesEntries.map(expense => <ExpenseCell key={expense[0]} value={expense[1]}/>)}
            {props.forPartyTable && <div className="table-cell placeholder-cell"></div>}
            <div className="table-cell header-cell">X</div>
        </div>
    );
}

/* Cells */

function UserCell(props) {
    return (
        <div className={"table-cell header-cell"}>
            <div className={"header username"}>
                {props.value.toString()}
            </div>
        </div>
    );
}

export function PlaceholderCell(props) {
    return (
        <div className="table-cell placeholder-cell">
            <input className="check-button placeholder-check-button"
                   type={props.buttonType}
            />
        </div>
    );
}

export function ActivityCell(props) {
    const handleClick = () => {
        props.handleActivityClick(props.activityID);
    }
    return (
        <div className={"header activity-name"} onClick={handleClick}>
            {props.value.toString()}
        </div>
    );
}

export function ExpenseCell(props) {
    return (
        <div className={"table-cell"}>
            <div className="table-cell expense-cell">
                {props.value.toString()}
            </div>
        </div>
    );
}

/**
 * Contenteditable-friendly cell for changing data
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function EditableCell(props) {
    const contentEditable = useRef();
    const handleChange = e => {
        console.log(e.target.value);
        props.numbersOnly ?
            props.handleChange(e.target.value, props.id)
            : props.handleChange(e.target.value, props.id);
    };

    const charLimit = props.charLimit || 7;

    const preventFormatting = (e, numbersOnly) => {
        if (e.code === "Enter") {
            e.preventDefault();
        }
        if (e.ctrlKey) {
            switch (e.code) {
                case "KeyB":
                    e.preventDefault();
                    break;
                case "KeyI":
                    e.preventDefault();
                    break;
                case "KeyU":
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        }

        const allowedKeys = ["Backspace", "Delete",
            "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

        if (!allowedKeys.includes(e.code) && e.target.innerHTML.length >= charLimit) {
            e.preventDefault();
        }

        if (numbersOnly && e.target.innerHTML.includes(".") && e.code === "Period") {
            e.preventDefault();
        }

        const num = new RegExp('[0-9.]');

        if (numbersOnly && !allowedKeys.includes(e.code) && !num.test(e.key)) {
            e.preventDefault();
        }

    }

    return (
        <ContentEditable
            className={props.activityHeader ? "activity-header" : "header"}
            innerRef={contentEditable}
            html={props.value}
            spellCheck={false}
            onChange={handleChange}
            onKeyDown={e => preventFormatting(e, props.numbersOnly)}
            disabled={props.disabled}
        />
    );
}

/**
 * Plain header cell wrapper
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function HeaderCell(props) {
    return (
        <div className={"table-cell header-cell"}>
            {props.value}
            {props.children}
        </div>
    );
}

/**
 * Header cell with delete button used for users, activities, items
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function HeaderCellHover(props) {
    const [isHovered, setHovered] = useState(false);

    const handleMouseOver = () => {
        setHovered(true);
    }
    const handleMouseOut = () => {
        setHovered(false);
    }

    return (
        <div className="table-cell header-cell"
             onMouseOver={handleMouseOver}
             onMouseOut={handleMouseOut}>
            <DeleteButton visible={isHovered}
                          handleDelete={props.handleDelete}
                          userID={props.userID}
                          activityID={props.activityID}
                          itemID={props.itemID}/>
            {props.children}
        </div>
    );
}

/* Buttons */

/**
 * Returns a plus button used to add users, activities
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function AddButton(props) {
    const handleClick = () => {
        props.handleAdd(props.id);
    }
    return (
        <div className="table-cell add-button-cell">
            <svg xmlns="http://www.w3.org/2000/svg"
                 onClick={handleClick}
                 width="20" height="100%" fill="currentColor"
                 className="bi bi-plus"
                 viewBox="0 0 16 16">
                <path
                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
        </div>
    );
}

/**
 * Returns a cross button used to delete users, activities, items
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function DeleteButton(props) {
    const args = {
        userID: props.userID,
        activityID: props.activityID,
        itemID: props.itemID
    };
    const handleClick = () => {
        props.handleDelete(args);
    }
    const style = {
        position: "relative",
        right: 45,
        display: props.visible ? "block" : "none"
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             onClick={handleClick}
             style={style}
             width="20" height="100%" fill="currentColor"
             className="bi bi-x"
             viewBox="0 0 16 16">
            <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
    );
}

/**
 * Returns a checkbox used in PartyTable
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function ParticipationCheckbox(props) {
    const handleClick = (e) => {
        props.handleCheckboxClick(e.target.checked, props.activityID, props.userID);
    }
    return (
        <div className="table-cell checkbox-cell">
            <input className="check-button"
                   type="checkbox"
                   defaultChecked={props.defaultChecked}
                   onClick={handleClick}/>
        </div>
    );
}

/**
 * Returns a radio button used in ActivityTable
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function PurchaseRadioButton(props) {
    const handleClick = () => {
        props.handleCheckboxClick(props.itemID, props.userID);
    }
    return (
        <div className="table-cell radio-button-cell">
            <input className="check-button"
                   type="radio"
                   name={props.itemID}
                   defaultChecked={props.defaultChecked}
                   onClick={handleClick}/>
        </div>
    );
}