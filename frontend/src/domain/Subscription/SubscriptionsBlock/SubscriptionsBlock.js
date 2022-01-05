import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Link, IconButton, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Archive as ArchiveIcon, Add as AddIcon } from '@material-ui/icons';
import Block from '../../../components/Block';
import Table from '../../../components/Table';
import { SORT_ASC } from '../../../consts/sort';
import { PAG_LIMIT } from '../../../consts/pagination';
import { PERIOD_TYPE_MONTH, PERIOD_TYPE_YEAR } from '../../../consts/periodTypes';
import { getAPIResponseErrorSummary } from '../../../helpers/api';
import { shortDateTimeFormat } from '../../../i18n/dateFns';
import api from '../../../services/api';
import styles from './SubscriptionsBlock.module.scss';

const SubscriptionsBlock = () => {
    const [sort, setSort] = useState({
        column: 'name',
        dir: SORT_ASC
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isArchiving, setIsArchiving] = useState(false);

    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const [loadError, setLoadError] = useState(null);
    const [blockError, setBlockError] = useState(null);

    const history = useHistory();

    const loadData = async (params) => {
        setIsLoading(true);
        setLoadError(null);
        setBlockError(null);

        try {
            const data = await api.subscription.list({
                where: {},
                sort: [[params.sort.column, params.sort.dir]],
                limit: PAG_LIMIT,
                offset: (params.page - 1) * PAG_LIMIT,
                unpublished: true
            });

            setRows(data.results);
            setTotal(data.count);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setLoadError({
                status,
                message
            });
        }

        setIsLoading(false);
    };

    const onToggleSort = async (v) => {
        await loadData({
            sort: v,
            page
        });

        setSort(v);
    };

    const onPageChange = async (v) => {
        await loadData({
            sort,
            page: v
        });

        setPage(v);
    };

    const onArchive = async ({ id }) => {
        setIsArchiving(true);
        setBlockError(null);

        try {
            await api.subscription.archive(id);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setIsArchiving(false);
            setBlockError({
                status,
                message
            });

            return;
        }

        setIsArchiving(false);
        loadData({ sort, page });
    };

    useEffect(() => {
        loadData({ sort, page });
    }, []);

    /* eslint-disable react/prop-types */

    const now = new Date();

    const cells = [
        {
            id: 'name',
            label: 'Name',
            sortable: true,
            headCellProps: {
                style: {
                    width: '21.55%'
                }
            },
            getBodyCellContent: ({ id, name }) => (
                <Link
                    to={`/subscriptions/${id}`}
                    component={RouterLink}
                    className={styles.name}
                >
                    {name}
                </Link>
            )
        },
        {
            id: 'price',
            label: 'Price',
            sortable: true,
            headCellProps: {
                style: {
                    width: '5.9%',
                    textAlign: 'right'
                }
            },
            bodyCellProps: {
                align: 'right'
            },
            getBodyCellContent: ({ price }) => (price ? `$${price}` : '-')
        },
        {
            id: 'requests',
            label: 'Requests',
            sortable: true,
            headCellProps: {
                style: {
                    width: '8.33%',
                    textAlign: 'right'
                }
            },
            bodyCellProps: {
                align: 'right'
            },
            getBodyCellContent: ({ requests }) => requests
        },
        {
            id: 'periodType',
            label: 'Period',
            sortable: true,
            headCellProps: {
                align: 'center',
                style: {
                    width: '6.69%'
                }
            },
            bodyCellProps: {
                align: 'center'
            },
            getBodyCellContent: ({ periodType }) => {
                switch (periodType) {
                    case PERIOD_TYPE_MONTH:
                        return 'Month';
                    case PERIOD_TYPE_YEAR:
                        return 'Year';
                    default:
                        throw new Error(`Period type '${periodType}' is not supported`);
                }
            }
        },
        {
            id: 'periods',
            label: 'Periods',
            sortable: true,
            headCellProps: {
                style: {
                    width: '9.46%',
                    textAlign: 'right'
                }
            },
            bodyCellProps: {
                align: 'right'
            },
            getBodyCellContent: ({ periods }) => periods
        },
        {
            id: 'startTimestamp',
            label: 'Start date',
            sortable: true,
            headCellProps: {
                style: {
                    width: '15.85%'
                }
            },
            getBodyCellContent: ({ startTimestamp }) => format(startTimestamp, shortDateTimeFormat)
        },
        {
            id: 'endTimestamp',
            label: 'End date',
            sortable: true,
            headCellProps: {
                style: {
                    width: '15.85%'
                }
            },
            getBodyCellContent: ({ endTimestamp }) => (
                endTimestamp
                    ? format(endTimestamp, shortDateTimeFormat)
                    : '-'
            )
        },
        {
            id: 'isActive',
            label: 'Active?',
            headCellProps: {
                align: 'center',
                style: {
                    width: '8.95%'
                }
            },
            bodyCellProps: {
                align: 'center'
            },
            getBodyCellContent: ({ startTimestamp, endTimestamp }) => {
                const isArchived = endTimestamp !== null && endTimestamp <= now;
                const isUnpublished = startTimestamp > now;

                return (isArchived || isUnpublished)
                    ? 'No'
                    : 'Yes';
            }
        },
        {
            id: 'actions',
            label: '',
            bodyCellProps: {
                align: 'center',
                style: {
                    paddingTop: 0,
                    paddingBottom: 0,
                    width: '7.42%'
                }
            },
            getBodyCellContent: (row) => (
                (
                    row.endTimestamp === null
                    || (
                        row.startTimestamp < row.endTimestamp
                        && row.endTimestamp > now
                    )
                ) && (
                    <IconButton
                        disabled={isArchiving}
                        onClick={() => onArchive(row)}
                    >
                        <ArchiveIcon />
                    </IconButton>
                )
            )
        }
    ];

    /* eslint-disable react/prop-types */

    const isTableControlsDisabled = isLoading || isArchiving;

    return (
        <Block>
            {
                blockError && (
                    <Alert
                        severity='error'
                        className={styles.alert}
                    >
                        An error occurred while archiving.<br />
                        Request ended with message &lsquo;{blockError.message}&rsquo;
                        {
                            blockError.status && ` and status '${blockError.status}'`
                        }.
                    </Alert>
                )
            }
            <div className={styles.toolbar}>
                <Button
                    type='button'
                    onClick={() => history.push('/subscriptions/new')}
                >
                    <AddIcon />
                    <span className={styles.buttonText}>Create</span>
                </Button>
            </div>
            <Table
                cells={cells}
                rows={rows}
                sort={sort}
                total={total}
                page={page}
                rowsPerPage={PAG_LIMIT}
                isLoading={isLoading}
                error={loadError}
                onToggleSort={onToggleSort}
                onPageChange={onPageChange}
                tableHeadSortLabelProps={{
                    disabled: isTableControlsDisabled
                }}
                PaginationProps={{
                    disabled: isTableControlsDisabled
                }}
            />
        </Block>
    );
};

export default SubscriptionsBlock;
