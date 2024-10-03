function getInterestAndPoints(loan){
  let constants = {
    max_lending_rate: 20,
    min_lending_rate: 12,
    annual_tax_rate: 20,
    max_credits: 20,
    min_discount: 25,
    discount_profit_percentage: 15,
    loan_multiple: 5,
    loan_risk: 30,
    members_served_percentage: 25,
    monthly_lending_rate: 2,
    one_point_value: 1000
  }
  let record = loan
  let interest_accrued = 0;
  let points_accrued =  0;
    if (record.loan_status == "Ongoing") {
      let remainder = getDaysDifference(record.loan_date, Today);
      let current_loan_duration = Math.ceil(remainder / 30);
      let point_days = Math.max(0, Math.min(12, current_loan_duration) - 6) + Math.max(18, current_loan_duration) - 18;
      let running_rate = constants.monthly_lending_rate * (current_loan_duration - point_days);
      let pending_amount_interest = running_rate * record.principal_left / 100;
      let payment_interest_amount = 0;
      let points = constants.monthly_lending_rate * point_days * record.principal_left / 100000;
  
      if (record.payments) {
        record.payments.forEach(payment => {
        let duration = (getDaysDifference(record.loan_date, payment.payment_date) % 30) / 30 < 0.24 ? Math.trunc(getDaysDifference(record.loan_date, payment.payment_date) / 30): Math.ceil(getDaysDifference(record.loan_date, payment.payment_date) / 30);
        let point_day = Math.max(0, Math.min(12, duration) - 6) + Math.max(18, duration) - 18;         
        let payment_interest = constants.monthly_lending_rate * (duration - point_day) * payment.payment_amount / 100;
        points += constants.monthly_lending_rate * point_day * payment.payment_amount / 100000;
        payment_interest_amount += payment_interest;
      })
    }
    interest_accrued = pending_amount_interest + payment_interest_amount;
    points_accrued = points;
  }
  return {interest_accrued, points_accrued}
}

//GET_DIFFERENCE_BETWEEN_DATES
function getDaysDifference(earlierDate, laterDate = new Date()) {
  const firstPeriod = new Date(earlierDate);
  const secondPeriod = new Date(laterDate);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const timeDifference = secondPeriod.getTime() - firstPeriod.getTime();
  const daysApart = Math.floor(timeDifference / millisecondsPerDay);
  return daysApart;
}