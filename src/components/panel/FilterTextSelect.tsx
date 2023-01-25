import { FlexLayout, Select, TextField, TextStyles } from "@cedcommerce/ounce-ui"
import { useEffect, useState } from "react"

function FilterTextSelect({ title, objKey, options, allFilters, setAllFilters }: any) {
    const [textSearch, setTextSearch] = useState("")

    useEffect(() => {
        if (Object.keys(allFilters).length === 0) {
            setTextSearch("");
        }
    }, [allFilters])
    return (
        <FlexLayout direction="vertical" halign="start" valign="center" spacing="tight">
            <TextStyles>{title}</TextStyles>
            <>
                <TextField value={textSearch} placeHolder="Search..." onChange={setTextSearch} onEnter={() => {
                    setAllFilters((prev: any) => {
                        return { ...prev, [objKey]: { ...prev[objKey], value: textSearch } }
                    })
                }} />
                <Select value={allFilters?.[objKey]?.code} options={options} onChange={(e) => {
                    setAllFilters((prev: any) => {
                        return { ...prev, [objKey]: { ...prev[objKey], value: textSearch, code: e } }
                    })
                }} />
            </>
        </FlexLayout>
    )
}

export default FilterTextSelect