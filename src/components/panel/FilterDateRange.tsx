import { FlexLayout, TextStyles } from "@cedcommerce/ounce-ui"
import { DateRangePicker } from "rsuite"


function FilterDateRange({ allFilters, setAllFilters, title, code, objKey }: any) {
    return (
        <FlexLayout direction="vertical" halign="start" spacing="tight">
            <TextStyles>{title}</TextStyles>
            <DateRangePicker appearance="default" placeholder="Select Date" style={{ width: "150px" }} onChange={(e: any) => {
                if (e !== null) {
                    const startDate = new Intl.DateTimeFormat('en-US').format(e[0]).replaceAll("/", "-")
                    const endDate = new Intl.DateTimeFormat('en-US').format(e[1]).replaceAll("/", "-")
                    setAllFilters((prev: any) => {
                        return { ...prev, [objKey]: { value: `${startDate}%${endDate}`, code: code } }
                    })
                } else {
                    const { [objKey]: _, ...rest } = allFilters;
                    setAllFilters(rest);
                }
            }} />
        </FlexLayout>
    )
}

export default FilterDateRange