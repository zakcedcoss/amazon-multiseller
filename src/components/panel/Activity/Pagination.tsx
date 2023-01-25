import { Button, FlexLayout, Select, TextStyles } from "@cedcommerce/ounce-ui"
import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "react-feather"

interface PaginationType {
    options?: OptionsType[]
    totalCount?: number
    countPerPage?: number
    activePage?: number
    onNext?: () => void
    onPrev?: () => void
    onSelect?: (e: any) => void
}

interface OptionsType {
    label: string
    value: string
}

function Pagination({ options, activePage = 1, countPerPage = 10, totalCount = 1, onNext, onPrev, onSelect }: PaginationType) {
    const totalPages = useMemo(() => {
        if (totalCount && countPerPage) {
            return Math.ceil(totalCount / countPerPage)
        }
    }, [activePage, countPerPage, totalCount])

    return (
        <FlexLayout spacing="tight" halign="end" valign="center">
            <Select value={countPerPage?.toString()} options={options} onChange={onSelect} />
            <Button disable={activePage <= 1 ? true : false} type="Outlined" icon={<ChevronLeft />} onClick={onPrev}></Button>
            <TextStyles>{activePage} of {totalPages}</TextStyles>
            <Button icon={<ChevronRight />} onClick={onNext} type="Outlined" disable={totalPages && activePage >= totalPages ? true : false}></Button>
        </FlexLayout>
    )
}

export default Pagination