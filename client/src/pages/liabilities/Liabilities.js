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
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title='Credit'
                                        label='Last Payment Amount'
                                        date={institution.liabilities.credit[0].last_payment_date}
                                        value={institution.liabilities.credit[0].last_payment_amount}
                                        {...institution.liabilities.credit[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='Last Statement Balance'
                                        date={institution.liabilities.credit[0].last_payment_date}
                                        value={institution.liabilities.credit[0].last_statement_balance}
                                        {...institution.liabilities.credit[0]}
                                    />
                                     </List>
                                     <List>
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title='Mortgage'
                                        label='Last Payment Amount'
                                        date={institution.liabilities.mortgage[0].last_payment_date}
                                        value={institution.liabilities.mortgage[0].last_payment_amount}
                                        {...institution.liabilities.mortgage[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='Origination Principal Amount'
                                        date={institution.liabilities.mortgage[0].origination_date}
                                        value={institution.liabilities.mortgage[0].origination_principal_amount}
                                        {...institution.liabilities.mortgage[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='YTD Interest Paid'
                                        value={institution.liabilities.mortgage[0].ytd_interest_paid}
                                        {...institution.liabilities.mortgage[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='YTD Principal Paid'
                                        value={institution.liabilities.mortgage[0].ytd_principal_paid}
                                        {...institution.liabilities.mortgage[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='Past Due Amount'
                                        date={institution.liabilities.mortgage[0].last_payment_date}
                                        value={institution.liabilities.mortgage[0].past_due_amount}
                                        {...institution.liabilities.mortgage[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='Maturity Date / Loan term'
                                        date={institution.liabilities.mortgage[0].maturity_date}
                                        value={institution.liabilities.mortgage[0].loan_term}
                                        {...institution.liabilities.mortgage[0]}
                                    />
                                     </List>

                                     <List>
                                   <WidgetItem
                                        //key={transaction.account_id}
                                        title='Student Loans'
                                        label='Last Payment Amount'
                                        date={institution.liabilities.student[0].last_payment_date}
                                        value={institution.liabilities.student[0].last_payment_amount}
                                        {...institution.liabilities.student[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='Last Statement Balance'
                                        date={institution.liabilities.student[0].last_statement_issue_date}
                                        value={institution.liabilities.student[0].last_statement_balance}
                                        {...institution.liabilities.student[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='Origination Principal Amount'
                                        date={institution.liabilities.student[0].origination_date}
                                        value={institution.liabilities.student[0].origination_principal_amount}
                                        {...institution.liabilities.student[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='YTD Interest Paid'
                                        value={institution.liabilities.student[0].ytd_interest_paid}
                                        {...institution.liabilities.student[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='YTD Principal Paid'
                                        value={institution.liabilities.student[0].ytd_principal_paid}
                                        {...institution.liabilities.student[0]}
                                    />
                                    <WidgetItem
                                        //key={transaction.account_id}
                                        title=''
                                        label='Expected Payoff Date / Interest Rate Percentage'
                                        date={institution.liabilities.student[0].expected_payoff_date}
                                        value={institution.liabilities.student[0].interest_rate_percentage}
                                        {...institution.liabilities.student[0]}
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
