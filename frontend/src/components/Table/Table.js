import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Paper,
    TableContainer as MuiTableContainer,
    Table as MuiTable,
    TableHead as MuiTableHead,
    TableBody as MuiTableBody,
    TableFooter as MuiTableFooter,
    TableRow as MuiTableRow,
    TableCell as MuiTableCell,
    TableSortLabel as MuiTableSortLabel,
    CircularProgress,
    Typography
} from '@material-ui/core';
import { Alert, Pagination } from '@material-ui/lab';
import { SORT_ASC, SORT_DESC } from '../../consts/sort';
import styles from './Table.module.scss';

class Table extends Component {
    static propTypes = {
        PaperProps: PropTypes.shape(Paper.propTypes),
        TableContainerProps: PropTypes.shape(MuiTableContainer.propTypes),
        TableProps: PropTypes.shape(MuiTable.propTypes),
        TableHeadProps: PropTypes.shape(MuiTableHead.propTypes),
        TableBodyProps: PropTypes.shape(MuiTableBody.propTypes),
        TableFooterProps: PropTypes.shape(MuiTableFooter.propTypes),
        tableHeadRowProps: PropTypes.shape(MuiTableRow.propTypes),
        tableBodyRowProps: PropTypes.shape(MuiTableRow.propTypes),
        tableFooterRowProps: PropTypes.shape(MuiTableRow.propTypes),
        tableHeadCellProps: PropTypes.shape(MuiTableCell.propTypes),
        tableBodyCellProps: PropTypes.shape(MuiTableCell.propTypes),
        tableFooterCellProps: PropTypes.shape(MuiTableCell.propTypes),
        tableHeadSortLabelProps: PropTypes.shape(MuiTableSortLabel.propTypes),
        tableBodyLoadingCellProps: PropTypes.shape(MuiTableCell.propTypes),
        tableBodyErrorCellProps: PropTypes.shape(MuiTableCell.propTypes),
        tableBodyNotFoundCellProps: PropTypes.shape(MuiTableCell.propTypes),
        AlertProps: PropTypes.shape(Alert.propTypes),
        PaginationProps: PropTypes.shape(Pagination.propTypes),
        hideSummary: PropTypes.bool,
        hidePagination: PropTypes.bool,
        cells: PropTypes.arrayOf(PropTypes.exact({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]).isRequired,
            label: PropTypes.node,
            sortable: PropTypes.bool,
            headCellProps: PropTypes.shape(MuiTableCell.propTypes),
            bodyCellProps: PropTypes.shape(MuiTableCell.propTypes),
            getBodyCellContent: PropTypes.func.isRequired
        })).isRequired,
        rows: PropTypes.arrayOf(PropTypes.object).isRequired,
        sort: PropTypes.exact({
            column: PropTypes.string.isRequired,
            dir: PropTypes.oneOf([
                SORT_ASC,
                SORT_DESC
            ]).isRequired
        }),
        total: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired,
        // min value = 1
        page: PropTypes.number.isRequired,
        isLoading: PropTypes.bool,
        error: PropTypes.exact({
            status: PropTypes.number,
            message: PropTypes.string
        }),
        onToggleSort: PropTypes.func,
        onRowClick: PropTypes.func,
        onPageChange: PropTypes.func
    };

    static defaultProps = {
        PaperProps: {},
        TableContainerProps: {},
        TableProps: {},
        TableHeadProps: {},
        TableBodyProps: {},
        TableFooterProps: {},
        tableHeadRowProps: {},
        tableBodyRowProps: {},
        tableFooterRowProps: {},
        tableHeadCellProps: {},
        tableBodyCellProps: {},
        tableFooterCellProps: {},
        tableHeadSortLabelProps: {},
        tableBodyLoadingCellProps: {},
        tableBodyErrorCellProps: {},
        tableBodyNotFoundCellProps: {},
        AlertProps: {},
        PaginationProps: {},
        hideSummary: false,
        hidePagination: false,
        sort: null,
        isLoading: false,
        error: null,
        onToggleSort: null,
        onRowClick: null,
        onPageChange: null
    };

    get hasFooter() {
        const { hideSummary, hidePagination } = this.props;
        return !hideSummary || !hidePagination;
    }

    get totalColSpan() {
        const { cells } = this.props;

        const res = cells.reduce((acc, cell) => {
            const {
                headCellProps: { colSpan = 1 } = {}
            } = cell;

            return acc + colSpan;
        }, 0);

        return res;
    }

    onToggleSort = (e, column) => {
        const { sort, onToggleSort } = this.props;

        if (onToggleSort) {
            onToggleSort({
                column,
                dir: sort && sort.column === column && sort.dir === SORT_ASC
                    ? SORT_DESC
                    : SORT_ASC
            });
        }
    };

    onRowClick = (e, row) => {
        const { onRowClick, isLoading } = this.props;
        if (onRowClick && !isLoading) {
            onRowClick(row);
        }
    };

    onPageChange = (e, page) => {
        const { onPageChange } = this.props;
        if (onPageChange) {
            onPageChange(page);
        }
    };

    renderTableHead = () => {
        const {
            TableHeadProps, tableHeadRowProps, tableHeadCellProps,
            tableHeadSortLabelProps, cells,
            sort, total, isLoading
        } = this.props;

        return (
            <MuiTableHead {...TableHeadProps}>
                <MuiTableRow {...tableHeadRowProps}>
                    {
                        cells.map(({
                            id,
                            label,
                            sortable,
                            headCellProps: { align = 'left', ...headCellProps } = {}
                        }) => (
                            <MuiTableCell
                                key={id}
                                align={align}
                                {...tableHeadCellProps}
                                {...headCellProps}
                                className={
                                    clsx(
                                        styles.headCell,
                                        tableHeadCellProps.className,
                                        headCellProps.className
                                    )
                                }
                            >
                                {
                                    sortable && total > 1
                                        ? (
                                            <MuiTableSortLabel
                                                disabled={isLoading}
                                                active={sort && sort.column === id}
                                                direction={
                                                    sort && sort.column === id
                                                        ? sort.dir
                                                        : SORT_ASC
                                                }
                                                onClick={(e) => this.onToggleSort(e, id)}
                                                {...tableHeadSortLabelProps}
                                                className={
                                                    clsx(
                                                        styles.sortLabel,
                                                        tableHeadSortLabelProps.className
                                                    )
                                                }
                                            >
                                                {label}
                                            </MuiTableSortLabel>
                                        )
                                        : label
                                }
                            </MuiTableCell>
                        ))
                    }
                </MuiTableRow>
            </MuiTableHead>
        );
    };

    renderTableBodyError = () => {
        const {
            TableBodyProps, tableBodyRowProps, tableBodyCellProps,
            tableBodyErrorCellProps, AlertProps,
            error
        } = this.props;

        return (
            <MuiTableBody {...TableBodyProps}>
                <MuiTableRow
                    {...tableBodyRowProps}
                    className={
                        clsx(
                            { [styles.footerRow]: !this.hasFooter },
                            tableBodyRowProps.className
                        )
                    }
                >
                    <MuiTableCell
                        colSpan={this.totalColSpan}
                        {...tableBodyCellProps}
                        {...tableBodyErrorCellProps}
                    >
                        <Alert
                            severity='error'
                            {...AlertProps}
                        >
                            An error occurred while loading data.<br />
                            Request ended with message &lsquo;{error.message}&rsquo;
                            {
                                error.status && ` and status '${error.status}'`
                            }.
                        </Alert>
                    </MuiTableCell>
                </MuiTableRow>
            </MuiTableBody>
        );
    };

    renderTableBodyLoader = () => {
        const {
            TableBodyProps, tableBodyRowProps, tableBodyCellProps,
            tableBodyLoadingCellProps
        } = this.props;

        return (
            <MuiTableBody {...TableBodyProps}>
                <MuiTableRow
                    {...tableBodyRowProps}
                    className={
                        clsx(
                            { [styles.footerRow]: !this.hasFooter },
                            tableBodyRowProps.className
                        )
                    }
                >
                    <MuiTableCell
                        colSpan={this.totalColSpan}
                        align='center'
                        {...tableBodyCellProps}
                        {...tableBodyLoadingCellProps}
                        className={
                            clsx(
                                tableBodyCellProps.className,
                                styles.loadingCell,
                                tableBodyLoadingCellProps.className
                            )
                        }
                    >
                        <CircularProgress />
                    </MuiTableCell>
                </MuiTableRow>
            </MuiTableBody>
        );
    };

    renderTableBodyEmptyResults = () => {
        const {
            TableBodyProps, tableBodyRowProps, tableBodyCellProps,
            tableBodyNotFoundCellProps, AlertProps
        } = this.props;

        return (
            <MuiTableBody {...TableBodyProps}>
                <MuiTableRow
                    {...tableBodyRowProps}
                    className={
                        clsx(
                            { [styles.footerRow]: !this.hasFooter },
                            tableBodyRowProps.className
                        )
                    }
                >
                    <MuiTableCell
                        colSpan={this.totalColSpan}
                        {...tableBodyCellProps}
                        {...tableBodyNotFoundCellProps}
                    >
                        <Alert
                            severity='warning'
                            {...AlertProps}
                        >
                            Rows not found.
                        </Alert>
                    </MuiTableCell>
                </MuiTableRow>
            </MuiTableBody>
        );
    };

    renderTableBody = () => {
        const {
            TableBodyProps, tableBodyRowProps, tableBodyCellProps,
            cells, rows, total, error, isLoading
        } = this.props;

        if (error) {
            return this.renderTableBodyError();
        }

        if (isLoading) {
            return this.renderTableBodyLoader();
        }

        if (total === 0) {
            return this.renderTableBodyEmptyResults();
        }

        return (
            <MuiTableBody {...TableBodyProps}>
                {
                    rows.map((r) => (
                        <MuiTableRow
                            key={r.id}
                            hover={!isLoading}
                            onClick={(e) => this.onRowClick(e, r)}
                            {...tableBodyRowProps}
                            className={
                                clsx(
                                    { [styles.footerRow]: !this.hasFooter },
                                    tableBodyRowProps.className
                                )
                            }
                        >
                            {
                                cells.map(({ id, bodyCellProps, getBodyCellContent }) => (
                                    <MuiTableCell
                                        key={id}
                                        align='left'
                                        {...tableBodyCellProps}
                                        {...bodyCellProps}
                                    >
                                        {getBodyCellContent(r, this.props)}
                                    </MuiTableCell>
                                ))
                            }
                        </MuiTableRow>
                    ))
                }
            </MuiTableBody>
        );
    };

    renderTableFooter = () => {
        const {
            TableFooterProps, tableFooterRowProps, tableFooterCellProps,
            PaginationProps,
            total, rowsPerPage, page, isLoading,
            hideSummary, hidePagination
        } = this.props;

        const first = (page - 1) * rowsPerPage + 1;

        const defLast = first + rowsPerPage - 1;
        const last = defLast < total
            ? defLast
            : total;

        const pages = Math.ceil(total / rowsPerPage);

        return (
            <MuiTableFooter {...TableFooterProps}>
                <MuiTableRow
                    {...tableFooterRowProps}
                    className={clsx(styles.footerRow, tableFooterRowProps.className)}
                >
                    <MuiTableCell
                        colSpan={this.totalColSpan}
                        {...tableFooterCellProps}
                    >
                        <div className={styles.paginationContainer}>
                            {
                                !hideSummary && (
                                    <Typography className={styles.summary}>
                                        {
                                            total === 0
                                                ? '0 total'
                                                : `${first}-${last} of ${total}`
                                        }
                                    </Typography>
                                )
                            }
                            {
                                !hidePagination && total > 0 && (
                                    <Pagination
                                        disabled={isLoading}
                                        count={pages}
                                        page={page}
                                        onChange={this.onPageChange}
                                        {...PaginationProps}
                                        className={
                                            clsx(
                                                styles.paginationRoot,
                                                PaginationProps.className
                                            )
                                        }
                                    />
                                )
                            }
                        </div>
                    </MuiTableCell>
                </MuiTableRow>
            </MuiTableFooter>
        );
    };

    render() {
        const { PaperProps, TableContainerProps, TableProps } = this.props;

        return (
            <Paper
                variant='outlined'
                {...PaperProps}
                className={clsx(styles.paper, PaperProps.className)}
            >
                <MuiTableContainer {...TableContainerProps}>
                    <MuiTable
                        size='medium'
                        {...TableProps}
                    >
                        {this.renderTableHead()}
                        {this.renderTableBody()}
                        {this.hasFooter && this.renderTableFooter()}
                    </MuiTable>
                </MuiTableContainer>
            </Paper>
        );
    }
}

export default Table;
