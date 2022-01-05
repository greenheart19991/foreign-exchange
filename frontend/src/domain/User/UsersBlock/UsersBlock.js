import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import Block from '../../../components/Block';
import Table from '../../../components/Table';
import { SORT_ASC } from '../../../consts/sort';
import { PAG_LIMIT } from '../../../consts/pagination';
import { ROLE_USER, ROLE_ADMIN } from '../../../consts/roles';
import { getAPIResponseErrorSummary } from '../../../helpers/api';
import api from '../../../services/api';
import styles from './UsersBlock.module.scss';

const UsersBlock = () => {
    const [sort, setSort] = useState({
        column: 'fullName',
        dir: SORT_ASC
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const history = useHistory();

    const loadData = async (params) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await api.user.list({
                where: {},
                sort: params.sort,
                limit: PAG_LIMIT,
                offset: (params.page - 1) * PAG_LIMIT
            });

            setRows(data.results);
            setTotal(data.count);
        } catch (e) {
            const { status, message } = getAPIResponseErrorSummary(e);

            setError({
                status,
                message
            });
        }

        setIsLoading(false);
    };

    const getApiSort = (stateSort) => {
        const apiSort = [];

        if (stateSort.column === 'fullName') {
            apiSort.push(
                ['firstName', stateSort.dir],
                ['lastName', stateSort.dir]
            );
        } else {
            apiSort.push([stateSort.column, stateSort.dir]);
        }

        return apiSort;
    };

    const onToggleSort = async (v) => {
        await loadData({
            sort: getApiSort(v),
            page
        });

        setSort(v);
    };

    const onPageChange = async (v) => {
        await loadData({
            sort: getApiSort(sort),
            page: v
        });

        setPage(v);
    };

    const onRowClick = ({ id }) => {
        history.push(`/users/${id}`);
    };

    useEffect(() => {
        loadData({
            sort: getApiSort(sort),
            page
        });
    }, []);

    /* eslint-disable react/prop-types */

    const cells = [
        {
            id: 'fullName',
            label: 'Name',
            sortable: true,
            headCellProps: {
                style: {
                    width: '22%'
                }
            },
            getBodyCellContent: ({ firstName, lastName }) => `${firstName} ${lastName}`
        },
        {
            id: 'email',
            label: 'Email',
            sortable: true,
            headCellProps: {
                style: {
                    width: '28%'
                }
            },
            getBodyCellContent: ({ email }) => email
        },
        {
            id: 'subscription',
            label: 'Subscription',
            headCellProps: {
                style: {
                    width: '22%'
                }
            },
            getBodyCellContent: ({ subscription }) => {
                if (!subscription) {
                    return '-';
                }

                return subscription.name;
            }
        },
        {
            id: 'role',
            label: 'Role',
            sortable: true,
            headCellProps: {
                style: {
                    width: '10%'
                }
            },
            getBodyCellContent: ({ role }) => {
                switch (role) {
                    case ROLE_USER:
                        return 'User';
                    case ROLE_ADMIN:
                        return 'Admin';
                    default:
                        throw new Error(`Role '${role}' is not supported`);
                }
            }
        },
        {
            id: 'isActive',
            label: 'Active?',
            sortable: true,
            headCellProps: {
                align: 'center'
            },
            bodyCellProps: {
                align: 'center'
            },
            getBodyCellContent: ({ isActive }) => (isActive ? 'Yes' : 'No')
        }
    ];

    /* eslint-enable react/prop-types */

    return (
        <Block>
            <div className={styles.toolbar}>
                <Button
                    type='button'
                    onClick={() => history.push('/users/new')}
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
                error={error}
                onToggleSort={onToggleSort}
                onPageChange={onPageChange}
                onRowClick={onRowClick}
                tableBodyRowProps={{
                    classes: {
                        hover: styles.rowHover
                    }
                }}
            />
        </Block>
    );
};

export default UsersBlock;
