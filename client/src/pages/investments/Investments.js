import React, { useEffect, useRef } from 'react';
import { Grid, List, Divider, CircularProgress, Box } from '@material-ui/core';
import PlaidLinkButton from 'react-plaid-link-button';
import { connect } from 'react-redux';

import getSymbolFromCurrency from 'currency-symbol-map';

import { getInvestments, getAccounts } from '../../actions/accountActions';

// components
import PageTitle from '../../components/pagetitle/PageTitle';
import Widget from '../../components/widget/Widget';
import WidgetItem from '../../components/widget-item/WidgetItem';

// styles
import makeStyles from './styles';

function Investments({
    getInvestments,
    auth,
    investments,
    getAccounts,
    plaid
}) {
   console.log('investments: ',investments);

    const classes = makeStyles();

    // Get accounts on render
    useEffect(() => {
        async function fetchAccounts() {
            await getAccounts();
        }

        fetchAccounts();
    }, []);

    // Get investments on state.plaid.accounts change
    useEffect(() => {
        async function fetchInvestments() {
            await getInvestments({ userId: auth.user._id });
        }

        fetchInvestments();
    }, [plaid.accounts]);

    return (
        <>
            <Grid container justify="space-between" className={classes.header}>
                <PageTitle title="Investments" />
            </Grid>
            <Grid container spacing={3}>
                {investments.investments.length != 0 ? (
                    investments.investments.map(institution => (
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
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title='Credit'
                                        label='Last Payment Amount'
                                        date={institution.investments.credit[0].last_payment_date}
                                        value={institution.investments.credit[0].last_payment_amount}
                                        {...institution.investments.credit[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='Last Statement Balance'
                                        date={institution.investments.credit[0].last_payment_date}
                                        value={institution.investments.credit[0].last_statement_balance}
                                        {...institution.investments.credit[0]}
                                    />
                                     </List>
                            </div>
                            </Widget>
                        </Grid>
                    ))
                ) : (
                    <div style={{ width: '100%' }}>
                        <Grid align="center">
                            <CircularProgress />
                            <h2>No investment data for this bank account</h2>
                        </Grid>
                    </div>
                )}
            </Grid>
        </>
    );
}

const mapStateToProps = state => ({
    plaid: state.plaid,
    investments: state.investments,
    auth: state.auth,
});

export default connect(mapStateToProps, {
    getInvestments,
    getAccounts
})(Investments);
