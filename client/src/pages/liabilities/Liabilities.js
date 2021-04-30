import React, { useEffect, useRef } from 'react';
import { Grid, List, Divider, CircularProgress, Box } from '@material-ui/core';
import PlaidLinkButton from 'react-plaid-link-button';
import { connect } from 'react-redux';

import getSymbolFromCurrency from 'currency-symbol-map';

import { getLiabilities, getAccounts } from '../../actions/accountActions';

// components
import PageTitle from '../../components/pagetitle/PageTitle';
import Widget from '../../components/widget/Widget';
import WidgetItem from '../../components/widget-item/WidgetItem';

// styles
import makeStyles from './styles';

function Liabilities({
    getLiabilities,
    auth,
    liabilities,
    getAccounts,
    plaid
}) {
    console.log('liabilities: ',liabilities);

    const classes = makeStyles();

    // Get accounts on render
    useEffect(() => {
        async function fetchAccounts() {
            await getAccounts();
        }

        fetchAccounts();
    }, []);

    // Get liabilities on state.plaid.accounts change
    useEffect(() => {
        async function fetchLiabilities() {
            await getLiabilities({ userId: auth.user._id });
        }

        fetchLiabilities();
    }, [plaid.accounts]);

    console.log('liabilities: ',liabilities)

    return (
        <>
            <Grid container justify="space-between" className={classes.header}>
                <PageTitle title="Liabilities" />
            </Grid>
            <Grid container spacing={3}>
                {liabilities.liabilities.length != 0 ? (
                    liabilities.liabilities.map(institution => (
                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                            <Widget
                                //id={institution._id}
                                title={institution.accountName}
                                bodyClass={classes.fullHeightBody}
                                className={classes.card}
                            >
                                <div>
                                    <Divider
                                        className={classes.accountsDivider}
                                    />
                                    <List>
                                        {institution.liabilities.map(
                                            liabilities => (
                                                <>
                                                {liabilities.map(type => (
                                                    <WidgetItem
                                                        //key={transaction.account_id}
                                                        title={type}
                                                        label={''}
                                                        date={type.last_payment_date}
                                                        value={`${type.last_statement_balance.toLocaleString()}`}
                                                        {...liabilities}
                                                    />
                                                ))}
                                                </>
                                            )
                                        )}
                                    </List>
                                </div>
                            </Widget>
                        </Grid>
                    ))
                ) : (
                    <div style={{ width: '100%' }}>
                        <Grid align="center" justify="center">
                            <CircularProgress />
                        </Grid>
                    </div>
                )}
            </Grid>
        </>
    );
}

const mapStateToProps = state => ({
    plaid: state.plaid,
    liabilities: state.liabilities,
    auth: state.auth,
});

export default connect(mapStateToProps, {
    getLiabilities,
    getAccounts
})(Liabilities);
