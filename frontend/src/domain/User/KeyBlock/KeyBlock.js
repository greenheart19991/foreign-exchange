import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import Block from '../../../components/Block';
import Table from '../../../components/Table';
import styles from './KeyBlock.module.scss';

const KeyBlock = ({
    userKey: key,
    error,
    onCreate,
    onDelete
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateClick = async () => {
        if (!onCreate) {
            return;
        }

        setIsLoading(true);
        await onCreate();
        setIsLoading(false);
    };

    const handleDeleteClick = async (e, k) => {
        if (!onDelete) {
            return;
        }

        setIsLoading(true);
        await onDelete(k);
        setIsLoading(false);
    };

    const cells = [
        {
            id: 'key',
            label: 'Key',
            getBodyCellContent: (r) => r.key
        },
        {
            id: 'actions',
            label: '',
            bodyCellProps: {
                align: 'right',
                style: {
                    paddingTop: 0,
                    paddingBottom: 0
                }
            },
            getBodyCellContent: (r) => (
                <IconButton
                    disabled={isLoading}
                    onClick={(e) => handleDeleteClick(e, r.key)}
                >
                    <DeleteIcon />
                </IconButton>
            )
        }
    ];

    const rows = key ? [{ id: key, key }] : [];

    return (
        <Block>
            {
                error && (
                    <Alert
                        severity='error'
                        className={styles.alert}
                    >
                        An error occurred while performing operation.<br />
                        Request ended with message &lsquo;{error.message}&rsquo;
                        {
                            error.status && ` and status '${error.status}'`
                        }.
                    </Alert>
                )
            }
            <div className={styles.toolbar}>
                <Button
                    type='button'
                    disabled={rows.length > 0 || isLoading}
                    onClick={handleCreateClick}
                >
                    <AddIcon />
                    <span className={styles.buttonText}>Create</span>
                </Button>
            </div>
            <Table
                hideSummary
                hidePagination
                cells={cells}
                rows={rows}
                total={rows.length}
                page={1}
                rowsPerPage={1}
            />
        </Block>
    );
};

KeyBlock.propTypes = {
    userKey: PropTypes.string,
    error: PropTypes.exact({
        status: PropTypes.number,
        message: PropTypes.string
    }),
    onCreate: PropTypes.func,
    onDelete: PropTypes.func
};

KeyBlock.defaultProps = {
    userKey: null,
    error: null,
    onCreate: null,
    onDelete: null
};

export default KeyBlock;
