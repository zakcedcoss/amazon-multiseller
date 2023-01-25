export const options = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
]

export const filterOptions = [
    { label: "equals", value: "1" },
    { label: "not equals", value: "2" },
    { label: "contains", value: "3" },
    { label: "not contains", value: "4" },
    { label: "start", value: "5" },
    { label: "end", value: "6" },
]

export const actionOptions = [
    { label: "bda_add", value: "bda_add" },
    { label: "bda_update", value: "bda_update" },
    { label: "login", value: "login" },
    { label: "logout", value: "logout" },
    { label: "create", value: "create" },
    { label: "update", value: "update" },
    { label: "delete", value: "delete" },
    { label: "store_login", value: "store_login" },
]

export const appPlanOptions = ["No Plan", "Free", "Beginner", "Startup", "Scale", "Growth", "Advanced", "Professional", "Enterprise"].map((n, i) => {
    return { label: n, value: i.toString() }
})

export const prepaidOptions = [
    { label: "equals", value: "1" },
    { label: "greater than or equal to", value: "9" },
    { label: "less than or equal to", value: "10" },
]

export const installOptions = ["Installed", "Uninstalled", "All"].map((e) => {
    return { label: e, value: e.toLowerCase() }
})

export const orderSyncOptions = ["Enabled", "Disabled", "All"].map(e => {
    return { label: e, value: e.toLowerCase() }
})