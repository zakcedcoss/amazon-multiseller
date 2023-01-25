import { FlexLayout, Select, TextStyles } from "@cedcommerce/ounce-ui"

function FilterSelect({ title, allFilters, setAllFilters, objKey, code, options }: any) {
    return (
        <FlexLayout direction="vertical" halign="start" valign="center" spacing="tight">
            <TextStyles>{title}</TextStyles>

            <Select value={allFilters?.[objKey]?.value} options={options} onChange={(e) => {
                setAllFilters((prev: any) => {
                    if (e === "all") {
                        const { [objKey]: _, ...rest } = prev;
                        return rest;
                    }
                    return { ...prev, [objKey]: { ...prev[objKey], value: e, code: code } }
                })
            }} />
        </FlexLayout>
    )
}

export default FilterSelect