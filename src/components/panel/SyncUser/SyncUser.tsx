import { Badge, BodyLayout, Button, Card, CheckBox, FlexLayout, Grid } from "@cedcommerce/ounce-ui";
import { useEffect, useMemo, useState } from "react";
import { MoreVertical, RefreshCcw } from "react-feather";
import { appPlanOptions, filterOptions, installOptions, options, orderSyncOptions, prepaidOptions } from "../../../constants";
import useGetRequests from "../../../hooks/getRequests";
import Pagination from "../Activity/Pagination";
import FilterDateRange from "../FilterDateRange";
import FilterSelect from "../FilterSelect";
import FilterTextSelect from "../FilterTextSelect";

function SyncUser() {
    const [activePage, setActivePage] = useState(1);
    const [countPerPage, setCountPerPage] = useState(10);
    const [viewColumns, setViewColumns] = useState(false)
    const [hiddenColumns, setHiddenColumns] = useState<{ [key: string]: boolean }>({})
    // filters
    const [allFilters, setAllFilters] = useState<{ [key: string]: any }>({})

    const filterQuery = useMemo(() => {
        let query = "";
        Object.keys(allFilters).forEach((key) => {
            if (allFilters[key]?.code?.trim() === "" || allFilters[key]?.code === undefined || allFilters[key]?.value?.toString()?.trim() === "" || allFilters[key]?.value === undefined) return;
            if (key === "installed_at" || key === "activePlanDetails.expiring_at" || key === "activePlanDetails.activated_at" || key === "migration_start" || key === "migration_end") {
                const date = allFilters[key]?.value?.split("%");
                query += `&filter[${key}][${allFilters[key]?.code}][to]=${date[1]}&filter[${key}][${allFilters[key]?.code}][from]=${date[0]}`;
                return;
            }
            query += `&filter[${key}][${allFilters[key]?.code}]=${allFilters[key]?.value}`
        })
        return query;
    }, [allFilters])

    // console.log({ filterQuery }, "aaaaaa");

    const { data, isLoading, errors } = useGetRequests(`/frontend/adminpanelamazonmulti/getRefineUsersData?target_marketplace=all&count=${countPerPage}&activePage=${activePage}${filterQuery}`);

    const { data: totalCount, isLoading: totalCountLoading, errors: totalCountErrors } = useGetRequests(`/frontend/adminpanelamazonmulti/getRefineFilteredCount?target_marketplace=all&count=${countPerPage}&activePage=${activePage}`)

    const dataSource = useMemo(() => {
        return data?.data?.rows?.map((d: any) => {
            return {
                last_sync: d.last_sync,
                sync: null,
                user_id: d.user_id,
                installStatus: d.install_status,
                order_sync: d.order_sync,
                name: d.shops[0].name,
                username: d.username,
                email: d.email,
                shopUrl: d.shops[0].domain,
                migrationStatus: "new user",
                migrationStart: "NA",
                migrationEnd: "NA",
                phone: d.shops[0].phone ?? "NA",
                plan: d.shops[0].plan_display_name,
                connected_accounts: d.connected_accounts,
                product_count: d.product_count ?? 0,
                order_count: 0,
                app_plan: d.app_plan ?? "NA",
                activated_at: d.shops[0].updated_at,
                expiring_at: "NA",
                prepaid_used_credit: "NA",
                prepaid_available_credit: "NA",
                postpaid_used_credit: "NA",
                postpaid_available_credit: "NA",
                installed_at: "NA",
                action: null,
            }
        })
    }, [data])

    const columns = [
        {
            align: 'center',
            dataIndex: 'last_sync',
            key: 'last_sync',
            title: "Last Sync",
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'sync',
            key: 'sync',
            title: "Sync",
            width: 100,
            render: () => {
                return (
                    <Button type="Plain" icon={<RefreshCcw />} />
                )
            }
        },
        {
            align: 'center',
            dataIndex: 'installStatus',
            key: 'installStatus',
            title: <FilterSelect allFilters={allFilters} setAllFilters={setAllFilters} title="Install/Uninstall" code="1" options={installOptions} objKey="install_status" />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'order_sync',
            key: 'order_sync',
            title: <FilterSelect allFilters={allFilters} setAllFilters={setAllFilters} title="Order Sync" code="1" options={orderSyncOptions} objKey="order_sync" />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'user_id',
            key: 'user_id',
            title: <FilterTextSelect title="User Id" allFilters={allFilters} setAllFilters={setAllFilters} objKey="user_id" options={filterOptions} />,
            width: 50
        },
        {
            align: 'center',
            dataIndex: 'name',
            key: 'name',
            title: <FilterTextSelect title="Name" allFilters={allFilters} setAllFilters={setAllFilters} objKey="shops.name" options={filterOptions} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'username',
            key: 'username',
            title: <FilterTextSelect title="Username" allFilters={allFilters} setAllFilters={setAllFilters} objKey="username" options={filterOptions} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'email',
            key: 'email',
            title: <FilterTextSelect title="Email" objKey="email" options={filterOptions} allFilters={allFilters} setAllFilters={setAllFilters} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'shopUrl',
            key: 'shopUrl',
            title: <FilterTextSelect title="Shop Url" objKey="shops.domain" options={filterOptions} allFilters={allFilters} setAllFilters={setAllFilters} />,
            width: 100
        },
        {
            align: 'center',
            dataIndex: 'action',
            key: 'action',
            title: 'Action',
            width: 200,
            render: () => { return <Button type="Outlined" icon={<MoreVertical />} /> }
        },
        {
            align: 'center',
            dataIndex: 'migrationStatus',
            key: 'migrationStatus',
            title: 'Migration Status',
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'migrationStart',
            key: 'migrationStart',
            title: <FilterDateRange title="Migration Start" allFilters={allFilters} setAllFilters={setAllFilters} code="7" objKey="migration_start" />,
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'migrationEnd',
            key: 'migrationEnd',
            title: <FilterDateRange title="Migration End" allFilters={allFilters} setAllFilters={setAllFilters} code="7" objKey="migration_end" />,
            width: 300
        },
        {
            align: 'center',
            dataIndex: 'phone',
            key: 'phone',
            title: <FilterTextSelect title="Contact Number" objKey="shops.phone" options={filterOptions} allFilters={allFilters} setAllFilters={setAllFilters} />,
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'plan',
            key: 'plan',
            title: <FilterTextSelect title="Shopify Plan" objKey="shops.plan_display_name" options={filterOptions} allFilters={allFilters} setAllFilters={setAllFilters} />,
            width: 200
        },
        {
            align: 'center',
            dataIndex: 'amazon_seller',
            key: 'amazon_seller',
            title: 'View Amazon Seller',
            width: 200,
            render: () => {
                return <Button type="Plain">View Shops</Button>
            }
        },
        {
            align: 'center',
            dataIndex: 'connected_accounts',
            key: 'connected_accounts',
            title: <FilterTextSelect title="Connected Accounts" allFilters={allFilters} setAllFilters={setAllFilters} objKey="connected_accounts" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'product_count',
            key: 'order_count',
            title: <FilterTextSelect title="Product Count" allFilters={allFilters} setAllFilters={setAllFilters} objKey="product_count" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'order_count',
            key: 'order_count',
            title: <FilterTextSelect title="Order Count" allFilters={allFilters} setAllFilters={setAllFilters} objKey="order_count" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'app_plan',
            key: 'app_plan',
            title: <FilterSelect title="App Plan" allFilters={allFilters} setAllFilters={setAllFilters} options={appPlanOptions} objKey="activePlanDetails.plan_id" code="1" />,
            width: 300,
        },
        {
            align: 'center',
            dataIndex: 'activated_at',
            key: 'activated_at',
            title: <FilterDateRange title="Plan Activated At" allFilters={allFilters} setAllFilters={setAllFilters} code="7" objKey="activePlanDetails.activated_at" />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'expiring_at',
            key: 'expiring_at',
            title: <FilterDateRange title="Plan Expiring At" allFilters={allFilters} setAllFilters={setAllFilters} code="7" objKey="activePlanDetails.expiring_at" />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'prepaid_used_credit',
            key: 'prepaid_used_credit',
            title: <FilterTextSelect title="Prepaid Used Credit" allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.prepaid.total_used_credits" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'prepaid_available_credit',
            key: 'prepaid_available_credit',
            title: <FilterTextSelect title="Prepaid Available Credit" allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.prepaid.available_credits" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'postpaid_used_credit',
            key: 'postpaid_used_credit',
            title: <FilterTextSelect title="Postpaid Used Credit" allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.postpaid.total_used_credits" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'postpaid_available_credit',
            key: 'postpaid_available_credit',
            title: <FilterTextSelect title="Postpaid Available Credit" allFilters={allFilters} setAllFilters={setAllFilters} objKey="active_plan_app.postpaid.available_credits" options={prepaidOptions} />,
            width: 200,
        },
        {
            align: 'center',
            dataIndex: 'installed_at',
            key: 'installed_at',
            title: <FilterDateRange title="Installed At" allFilters={allFilters} setAllFilters={setAllFilters} code="7" objKey="installed_at" />,
            width: 200,
        },
    ]

    const modifiedCols = columns.filter(cols => {
        return hiddenColumns[cols.key];
    })

    useEffect(() => {
        const hiddenCols = columns.reduce((acc: any, col: any) => {
            return { ...acc, [col.key]: true }
        }, {})
        setHiddenColumns(hiddenCols)
    }, [])

    return (
        <BodyLayout Layout="Full">
            <FlexLayout direction="vertical" spacing="tight" desktopWidth="100">
                <Card>
                    <FlexLayout halign="fill" valign="center">
                        <FlexLayout spacing="tight">
                            <Button onClick={() => setViewColumns(prev => !prev)}>View Columns</Button>
                            <Button onClick={() => setAllFilters({})}>Reset All Filters</Button>
                        </FlexLayout>
                        <FlexLayout spacing="tight" valign="center">
                            <Button type="Outlined">Sync New User</Button>
                            <Button type="Outlined">Sync All Users</Button>
                            <Badge size="regular" type="Info-100">TotalCount = {totalCount.count ?? 0}</Badge>
                        </FlexLayout>
                        <Pagination
                            options={options}
                            totalCount={totalCount.count}
                            activePage={activePage}
                            countPerPage={countPerPage}
                            onPrev={() => setActivePage(activePage - 1)}
                            onNext={() => setActivePage(activePage + 1)}
                            onSelect={(e) => setCountPerPage(e)}
                        />
                    </FlexLayout>
                </Card>
                <Card>
                    <FlexLayout spacing="tight">
                        {viewColumns && columns.map(col => {
                            return (
                                <CheckBox
                                    checked={hiddenColumns[col.key]}
                                    key={col.key}
                                    labelVal={col.key}
                                    onClick={() => {
                                        setHiddenColumns(prev => {
                                            return { ...prev, [col.key]: !prev[col.key] }
                                        })
                                    }}
                                />
                            )
                        })}
                    </FlexLayout>
                </Card>
                <Grid loading={isLoading} dataSource={dataSource} columns={modifiedCols} scrollX={1500} />
            </FlexLayout>
        </BodyLayout>
    )
}

export default SyncUser