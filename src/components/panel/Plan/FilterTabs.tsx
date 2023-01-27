import { FlexLayout, Select, TextField } from "@cedcommerce/ounce-ui"
import { useEffect, useState } from "react"
import { prepaidOptions } from "../../../constants"

function FilterTabs({ placeHolder, advanceFilter, setAdvanceFilter, objKey }: any) {
    const [searchedText, setSearchedText] = useState("")

    useEffect(() => {
        if (Object.keys(advanceFilter).length === 0) setSearchedText("");
    }, [advanceFilter])

    return (
        <FlexLayout desktopWidth="100" childWidth="fullWidth" spacing="tight">
            <Select value={advanceFilter?.[objKey]?.code} options={prepaidOptions} thickness="thin" onChange={(e) => setAdvanceFilter((prev: any) => {
                return { ...prev, [objKey]: { ...prev[objKey], value: searchedText, code: e } }
            })} />
            <TextField value={searchedText} thickness="thin" placeHolder={placeHolder} onChange={(e) => {
                setSearchedText(e);
                setAdvanceFilter((prev: any) => {
                    return { ...prev, [objKey]: { ...prev[objKey], value: e } }
                })
            }} />
        </FlexLayout>
    )
}

export default FilterTabs