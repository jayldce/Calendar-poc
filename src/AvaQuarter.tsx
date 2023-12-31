// import PropTypes from 'prop-types'
import React from "react";
import moment from "moment";

//import dates, { momentLocalizer } from "react-big-calendar";
import { Navigate, DateLocalizer } from "react-big-calendar";
//import firstVisibleDay from "react-big-calendar";
//import startOf from "react-big-calendar";

function createCalendar(currentDate) {
  if (!currentDate) {
    currentDate = moment();
  } else {
    currentDate = moment(currentDate);
  }

  const first = currentDate.clone().startOf("month");
  const last = currentDate.clone().endOf("month");
  const weeksCount = Math.ceil((first.day() + last.date()) / 7);
  const calendar = Object.assign([], { currentDate, first, last });

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week = [];
    calendar.push(week);
    calendar.year = currentDate.year();
    calendar.month = currentDate.month();

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date = currentDate.clone().set("date", day + 1 - first.day());
      date.calendar = calendar;
      week.push(date);
    }
  }

  return calendar;
}

function CalendarDate(props) {
  const { dateToRender, dateOfMonth } = props;
  const today =
    dateToRender.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? "today"
      : "";

  if (dateToRender.month() < dateOfMonth.month()) {
    return (
      <button disabled={true} className="date prev-month">
        {dateToRender.date()}
      </button>
    );
  }

  if (dateToRender.month() > dateOfMonth.month()) {
    return (
      <button disabled={true} className="date next-month">
        {dateToRender.date()}
      </button>
    );
  }

  return (
    <button
      className={`date in-month ${today}`}
      onClick={() => props.onClick(dateToRender)}
    >
      {dateToRender.date()}
    </button>
  );
}

class AvaQuarter extends React.Component {
  state = {
    calendar: undefined
  };

  componentDidMount() {
    this.setState({ calendar: createCalendar(this.props.date) });
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.setState({ calendar: createCalendar(this.props.date) });
    }
  }

  render() {
    if (!this.state.calendar) {
      return null;
    }

    return (
      <div className="month">
        <div className="month-name">
          {this.state.calendar.currentDate.format("MMMM").toUpperCase()}
        </div>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={index} className="day">
            {day}
          </span>
        ))}
        {this.state.calendar.map((week, index) => (
          <div key={index}>
            {week.map((date) => (
              <CalendarDate
                key={date.date()}
                dateToRender={date}
                dateOfMonth={this.state.calendar.currentDate}
                onClick={(date) =>
                  alert(`Will go to daily-view of ${date.format("YYYY-MM-DD")}`)
                }
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

class AvaQuarter extends React.Component {
  render() {
    let { date, localizer, ...props } = this.props;
    console.log(localizer);
    let range = AvaQuarter.range(date, localizer);
    this.getCurrentQuarter(date, localizer);
    const months = [];
    // 8-9-10
    // 11-12-1
    //
    const firstMonth = localizer.startOf(date, "month");

    for (let i = 0; i < 3; i++) {
      months.push(
        <Calendar key={i + 1} date={localizer.add(firstMonth, i, "month")} />
      );
    }

    return <div className="year">{months.map((month) => month)}</div>;
  }

  getCurrentQuarter(date, localizer) {
    let x = date;
    console.log(x);
  }
}

// Day.propTypes = {
//   date: PropTypes.instanceOf(Date).isRequired,
// }

AvaQuarter.range = (date, localizer) => {
  console.log(this);
  //const x = this.props.localizer;
  const start = localizer.startOf(date, "month");
  const end = localizer.add(start, 3, "month");

  let current = start;
  const range = [];

  while (localizer.lte(current, end, "month")) {
    //range.push(current);
    current = localizer.add(current, 1, "month");
  }
  return range;
  //return [localizer.startOf(date, "year")];
};

AvaQuarter.navigate = (date, action, props) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return props.localizer.add(date, -3, "month");

    case Navigate.NEXT:
      return props.localizer.add(date, 3, "month");

    default:
      return date;
  }
};

AvaQuarter.title = (date, { localizer }) =>
  localizer.format(date, "yearHeaderFormat");

export default AvaQuarter;
