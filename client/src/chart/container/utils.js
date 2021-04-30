
const futureValue = (amount, r, n, t) => (
    amount * Math.pow(1 + (r / n), n * t)
);

const annuitise = (amount, r, n, t) => {
    return (amount * ((Math.pow((1 + r / n), (n * t)) - 1) / (r / n)));
};

const addYear = (theDate, years) => {
    let copiedDate = new Date(theDate.getTime());
    return new Date(copiedDate.setYear(copiedDate.getFullYear() + years));
};

const addMonth = (theDate, months) => {
    let copiedDate = new Date(theDate.getTime());
    return new Date(copiedDate.setMonth(copiedDate.getMonth() + months));
}

const generateTimeseries = (person) => {
    const startDate = new Date(Date.now());
    const endDate = addYear(startDate, (person.retirementAge - person.age) + (90 - person.retirementAge));
    const retireDate = addYear(startDate, (person.retirementAge - person.age));
    let theDate = new Date;
    let rollingBurn = 0;
    let rollingSavings = person.savings;
    const monthSeries = [];
    for (let k = 1; theDate <= endDate; k++) {
        theDate = addMonth(startDate, k);

        const thisMonthBurn = (theDate > retireDate) ? futureValue(person.expenses, person.inf, 12, k / 12) : 0;
        const thisMonthAnnuity = (theDate <= retireDate) ? futureValue(person.contributions, person.i, 12, 1 / 12) : 0;
        const thisMonthRolling = futureValue(rollingSavings, person.i, 12, 1 / 12);

        rollingSavings = thisMonthRolling + thisMonthAnnuity - thisMonthBurn;

        monthSeries.push(
            {
                date: theDate,
                rollingSavings,
                thisMonthBurn, // for debugging
                rollingBurn, // for debugging
                fixed: futureValue(person.savings, person.i, 12, k / 12), // for debugging
                monthly: annuitise(person.savings, person.i, 12, k / 12), // for debugging
            }
        );
    }
    return monthSeries;
};

export const getData = people => (
    people.reduce((acc, curr, idx) => (
        [...acc, ...curr.timeseries.map(d => (
            {
                date: new Date(d.date.getFullYear(), d.date.getMonth(), d.date.getDate()),
                key: `person${idx}`,
                value: (d.value > 0) ? d.value : 0,
            }
        ))]
    ), [])
);

export const getDataAll = people => {
    const all = people.reduce((acc, curr, idx)=> {
        curr.timeseries.forEach( ( d, i ) => {
            const thisDate = `${d.date.getFullYear()}${d.date.getMonth()}`;
            const isSet = acc.findIndex( d => d.date == thisDate );
            if (isSet >= 0) {
                acc.find(x => x.date === thisDate).value += d.value;
            } else {
                acc.push( {date: thisDate, value: d.value } );
            }
        });
        return acc;
    }, []);
    return all.map(d=>{
        var year = d.date.substring(0, 4);
        var month = d.date.substring(4, 6);

        var date = new Date(year, month - 1, 1);
        return {
            date,
            value: d.value
        };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

export const updatePeople = ( people ) => {
    const updatedPeople = [];    people.forEach((person, i) => {
        updatedPeople.push(Object.assign({}, person, {
            timeseries: generateTimeseries(person).map(d => (
                { date: d.date, value: d.rollingSavings }
            ))
        }));
    });
    return [...updatedPeople ];
};
