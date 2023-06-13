// import PropTypes from 'prop-types'
import React from "react";
import moment from "moment";

//import dates, { momentLocalizer } from "react-big-calendar";
import { Navigate, DateLocalizer, DateLocalizerSpec } from "react-big-calendar";
//import firstVisibleDay from "react-big-calendar";
//import startOf from "react-big-calendar";

function createCalendar(currentDate: any) {
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

function CalendarDateTwo(props) {
  const { dateToRender, dateOfMonth } = props;
  // const today =
  //   dateToRender.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
  //     ? "today"
  //     : "";

  // if (dateToRender.month() < dateOfMonth.month()) {
  //   return <div></div>;
  // }

  // if (dateToRender.month() > dateOfMonth.month()) {
  //   return <div></div>;
  // }
  //console.log(dateToRender);
  return (
    <div
      className="quarterview_days"
      onClick={() => props.onClick(dateToRender)}
    >
      {dateToRender}
    </div>
  );
}

class Calendar extends React.Component {
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
    console.log(this.state.calendar);
    return (
      <div className="quarterview_month">
        <div className="month-name">
          {this.state.calendar.currentDate.format("MMMM").toUpperCase()}
        </div>

        <>
          {this.props.events.map((event) => (
            <CalendarDateTwo
              key={event.id}
              dateToRender={event.title}
              //dateOfMonth={this.state.calendar.currentDate}
              onClick={(date) =>
                alert(`Will go to daily-view of ${date.format("YYYY-MM-DD")}`)
              }
            />
          ))}
        </>
        {/* {this.state.calendar.map((week, index) => (
          <div key={index}>
            {week.map((date) => (
              // <div>{date.format("YYYY-MM-DD")}</div>
              <CalendarDateTwo
                key={date.date()}
                dateToRender={date}
                dateOfMonth={this.state.calendar.currentDate}
                onClick={(date) =>
                  alert(`Will go to daily-view of ${date.format("YYYY-MM-DD")}`)
                }
              />
            ))}
          </div>
        ))} */}
      </div>
    );
  }
}

export function inRange(e, start, end, accessors, localizer) {
  const event = {
    start: accessors.start(e),
    end: accessors.end(e)
  };
  const range = { start, end };
  return localizer.inEventRange({ event, range });
}

let eventsForQuarter = (evts, start, end, accessors, localizer) =>
  evts.filter((e) => inRange(e, start, end, accessors, localizer));

class QuarterView extends React.Component {
  static getCurrentQuarter(date, localizer) {
    let monthIndex = parseInt(localizer.format(date, "M"));
    let minIndex;
    let current = localizer.startOf(date, "month");
    if (monthIndex >= 3 && monthIndex <= 5) {
      minIndex = 3;
    } else if (monthIndex >= 6 && monthIndex <= 8) {
      minIndex = 6;
    } else if (monthIndex >= 9 && monthIndex <= 11) {
      minIndex = 9;
    } else {
      minIndex = 12;
    }
    while (monthIndex !== minIndex) {
      current = localizer.add(current, -1, "month");
      monthIndex = parseInt(localizer.format(current, "M"));
    }
    console.log(current);
    return current;
  }

  componentDidMount() {
    let { localizer, events, accessors } = this.props;

    console.log(this.props);
    console.log(
      eventsForQuarter(events, new Date(), new Date(), accessors, localizer)
    );
    //eventsForQuarter(this.props.events);
  }
  render() {
    let { date, localizer, events, accessors, ...props } = this.props;
    console.log(this.props);

    let range = QuarterView.range(date, localizer);
    //this.getCurrentQuarter(date, localizer);
    const months = [];
    //    const firstMonth = localizer.startOf(date, "month");
    const firstMonth = QuarterView.getCurrentQuarter(date, localizer);

    let eventsForCurrentQuearter = eventsForQuarter(
      events,
      firstMonth,
      localizer.add(firstMonth, 3, "month"),
      accessors,
      localizer
    );

    for (let i = 0; i < 3; i++) {
      let currentMonthEvents = eventsForQuarter(
        events,
        localizer.add(firstMonth, i, "month"),
        localizer.add(firstMonth, i + 1, "month"),
        accessors,
        localizer
      );
      console.log(currentMonthEvents);
      months.push(
        <Calendar
          key={i + 1}
          events={currentMonthEvents}
          date={localizer.add(firstMonth, i, "month")}
        />
      );
    }

    return (
      <div>
        <div className="quarterview_year">{months.map((month) => month)}</div>;
      </div>
    );
  }
}

// Day.propTypes = {
//   date: PropTypes.instanceOf(Date).isRequired,
// }

QuarterView.range = (date, localizer) => {
  // console.log(this);
  // //const x = this.props.localizer;
  // const start = localizer.startOf(date, "month");
  // const end = localizer.add(start, 3, "month");
  // let current = start;
  // const range = [];
  // while (localizer.lte(current, end, "month")) {
  //   range.push(current);
  //   current = localizer.add(current, 1, "month");
  // }
  // return range;
  //return [localizer.startOf(date, "year")];
};

QuarterView.navigate = (date, action, props) => {
  const firstMonth = QuarterView.getCurrentQuarter(date, props.localizer);
  switch (action) {
    case Navigate.PREVIOUS:
      return props.localizer.add(firstMonth, -3, "month");

    case Navigate.NEXT:
      return props.localizer.add(firstMonth, 3, "month");

    default:
      return date;
  }
};

QuarterView.title = (date, { localizer }) => {
  const firstMonth = QuarterView.getCurrentQuarter(date, localizer);
  return localizer.format(firstMonth, "YYYY-MMMM");
};

export default QuarterView;
