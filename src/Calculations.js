/**
 * Sums prices of items for all activities
 * Used in PartyTable's "Expenses" column
 *
 * @param activities
 * @param items
 * @returns {{}}
 */
export function calcActivityExpenses(activities, items) {
    let activityExpenses = {};

    for (const activity of activities) {
        activityExpenses[activity.activity_id] = 0;
        const activityItems = items.filter(item => activity.items_id.includes(item.item_id));
        for (const item of activityItems) {
            activityExpenses[activity.activity_id] += parseFloat(item.item_price);
        }
    }
    return activityExpenses;
}


/**
 * Calculates total expenses and debt data for all users in PartyTable
 * Used in TotalRow component
 *
 * @param users
 * @param activities
 * @param items
 * @param activitiesExpenses
 * @returns {{debt: {[p: string]: any}, expenses: {[p: string]: any}}}
 */
export function calcTotalUsersFinance(users, activities, items, activitiesExpenses) {
    let totalUsersFinance = {
        'expenses': Object.fromEntries(users.map(user => [user.user_id, 0])),
        'debt': Object.fromEntries(users.map(user => [user.user_id, 0]))
    };

    for (const activity of activities) {

        const partialExpense = activitiesExpenses[activity.activity_id] / activity.users_id.length;
        const activityItems = items.filter(item => activity.items_id.includes(item.item_id));

        for (const userID of activity.users_id) {
            totalUsersFinance['expenses'][userID] += partialExpense;
            totalUsersFinance['debt'][userID] += partialExpense;
        }
        for (const item of activityItems) {
            if (item.bought_by !== null) {
                totalUsersFinance['debt'][item.bought_by] -= parseFloat(item.item_price);
            }
        }
    }

    for (const userID in totalUsersFinance.expenses) {
        totalUsersFinance['expenses'][userID] = Math.round(totalUsersFinance['expenses'][userID] * 100) / 100;
        totalUsersFinance['debt'][userID] = Math.round(totalUsersFinance['debt'][userID] * 100) / 100;
    }
    return totalUsersFinance;
}


/**
 * Caclulates users' expenses in ActivityTable
 * Used in TotalRow component
 *
 * @param usersID
 * @param items
 * @returns {{}}
 */
export function calcActivityUserExpenses(usersID, items) {
    let activityUserExpenses = Object.fromEntries(usersID.map(userID => [userID, 0]));
    for (const item of items) {
        if (item.bought_by !== null) {
            activityUserExpenses[item.bought_by] += parseFloat(item.item_price);
        }
    }
    return activityUserExpenses;
}