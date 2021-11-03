import {
    HeaderCellHover,
    PlaceholderRow,
    PurchaseRadioButton,
    TotalRow, EditableCell
} from "./TableElements";
import {calcActivityUserExpenses} from "./Calculations";


function ItemRow(props) {
    let radioButtons = [];
    for (const userID of props.usersID) {
        radioButtons.push(<PurchaseRadioButton key={props.itemID.toString() + userID.toString()}
                                               handleCheckboxClick={props.handleCheckboxClick}
                                               activityID={props.activityID}
                                               itemID={props.itemID}
                                               userID={userID}
                                               defaultChecked={userID === props.itemBoughtBy}
        />);
    }

    return (
        <div className="table-row item-row">
            <HeaderCellHover
                activityID={props.activityID}
                itemID={props.itemID}
                handleDelete={props.handleDeleteItem}
            >
                <EditableCell id={props.itemID}
                              value={props.itemName}
                              handleChange={props.handleItemNameChange}
                />
            </HeaderCellHover>
            {radioButtons}
            <div className={"table-cell"}>
                <EditableCell id={props.itemID}
                              value={props.itemPrice.toString()}
                              handleChange={props.handleExpenseChange}
                              numbersOnly={true}
                />
            </div>
        </div>
    );
}


function Items(props) {
    const usersID = props.users.map(user => user.user_id);
    const activityUsersExpenses = calcActivityUserExpenses(usersID, props.items);
    let itemsRows = [];

    for (const item of props.items) {
        const itemID = item.item_id;
        const itemName = item.item_name;
        const itemBoughtBy = item.bought_by;
        const itemPrice = item.item_price;
        itemsRows.push(<ItemRow key={itemID}
                                activityID={props.activity.activity_id}
                                itemID={itemID}
                                itemName={itemName}
                                itemBoughtBy={itemBoughtBy}
                                itemPrice={itemPrice}
                                usersID={usersID}
                                handleCheckboxClick={props.handleCheckboxClick}
                                handleDeleteItem={props.handleDeleteItem}
                                handleItemNameChange={props.handleItemNameChange}
                                handleExpenseChange={props.handleExpenseChange}
        />);
    }

    itemsRows.push(<PlaceholderRow key={-1}
                                   usersID={usersID}
                                   handleAdd={props.handleAddItem}
                                   activityID={props.activity.activity_id}
    />);
    itemsRows.push(<TotalRow key={-2}
                             rowName={'Total'}
                             expenses={activityUsersExpenses}
                             forPartyTable={false}
    />);

    return itemsRows;
}

export default Items;