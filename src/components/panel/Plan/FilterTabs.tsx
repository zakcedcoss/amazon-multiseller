import { FlexLayout, Select, TextField } from "@cedcommerce/ounce-ui"
import { prepaidOptions } from "../../../constants"

interface FilterTabsProps {
    placeHolder: string
    advanceFilter?: { value: string, code: number }[]
    setAdvanceFilter?: React.Dispatch<React.SetStateAction<{
        value: string;
        code: number;
    }[]>>
}

function FilterTabs({ placeHolder, advanceFilter, setAdvanceFilter }: FilterTabsProps) {


    return (
        <FlexLayout desktopWidth="100" spacing="tight">
            <Select options={prepaidOptions} thickness="thin" />
            <TextField type="number" thickness="thin" placeHolder={placeHolder} />
        </FlexLayout>
    )
}

export default FilterTabs