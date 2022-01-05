import React from 'react';
import PropTypes from 'prop-types';
import {
    AttachMoney as OrderIcon,
    TurnedIn as GrantIcon
} from '@material-ui/icons';
import { ITEM_ORDER, ITEM_GRANT } from '../../consts/itemTypes';

const HistoryStepIcon = ({
    itemType,
    ...rest
}) => {
    const Icon = itemType === ITEM_GRANT
        ? GrantIcon
        : OrderIcon;

    return (
        <Icon {...rest} />
    );
};

HistoryStepIcon.propTypes = {
    itemType: PropTypes.oneOf([
        ITEM_ORDER,
        ITEM_GRANT
    ]).isRequired
};

export default HistoryStepIcon;
