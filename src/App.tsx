import React from "react";
import "./styles.css";
import {
  Calendar as BigCalendar,
  DateCellWrapperProps,
  EventProps,
  momentLocalizer,
  Views
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "./CustomToolbar";
import Quarter from "./Quarter";
import events from "./events";
//import { AvaQuarter  from './AvaQuarter';
const localizer = momentLocalizer(moment);
interface AppProps {}
interface AppStates {
  stateEvent: any[];
  selectedView: any;
}

export const calendarViews = {
  MONTH: "month",
  WEEK: "week",
  WORK_WEEK: "work_week",
  DAY: "day",
  AGENDA: "agenda",
  AVA_QUARTER: "avaquarter"
};

//default view should be there
export const viewByOptions = [
  {
    name: "promotion",
    displayName: "Promotion View",
    defaultView: "month",
    EventObjMapping: {
      title: "title",
      start: "start",
      end: "end"
    }
  },
  {
    name: "completion",
    displayName: "Completion View",
    defaultView: "month",
    EventObjMapping: {
      title: "title",
      start: "start",
      end: "start"
    }
  }
];

export class EventComp extends React.Component<EventProps, {}> {
  render() {
    console.log(this.props);
    return <span>Event COmp header</span>;
  }
}

export class DateCellComp extends React.Component<DateCellWrapperProps, {}> {
  render() {
    console.log(this.props);
    return <span>datacell</span>;
  }
}

// export class customdateCellWrapper extends React.Component<
//   DateCellWrapperProps,
//   {}
// > {
//   constructor(props: DateCellWrapperProps) {
//     super(props);
//     this.state = {};
//   }
//   render() {
//     console.log(this.props);
//     return <span>{JSON.stringify(this.props)}</span>;
//   }
// }

export default class App extends React.Component<AppProps, AppStates> {
  myCal = null;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      stateEvent: events,
      selectedView: calendarViews.MONTH
    };
  }

  componentDidMount() {
    this.changeEventsData(this.state.selectedView);
  }
  propGetter = (event: any) => {
    console.log(event.id % 2 == 0);
    return {
      style: {
        backgroundColor: event.id % 2 == 0 ? "grey" : "red"
      }
    };
  };

  eventsOne = [events[0]];

  changeEventsData(view: string) {
    let newEvents = JSON.parse(JSON.stringify(events));
    newEvents = newEvents.map((item: any) => {
      item.end = item.start;
      return item;
    });

    const viewBy =
      view.split("|").length > 0 ? view.split("|")[1] : view.split("|")[0];
    const viewTypeBy = view.split("|")[0];

    //newEvents = JSON.parse(JSON.stringify(newEvents));
    if (view == calendarViews.MONTH) {
      this.setState({
        selectedView: calendarViews.MONTH,
        stateEvent: events
      });
    } else {
      //dynamically build events collection
      //EventObjMapping: {
      //   title: "title",
      //   start: "start",
      //   end: "end"
      // }
      let mailEvents = JSON.parse(JSON.stringify(events));

      const viewTypeByObj = viewByOptions.filter((item) => {
        return item.name == viewTypeBy;
      })[0];
      let viewTypeByObjMapping: any;
      if (viewTypeByObj) {
        viewTypeByObjMapping = viewTypeByObj.EventObjMapping;
      }

      newEvents = mailEvents.map((item: any) => {
        var a = {
          id: item.id,
          title: item[viewTypeByObjMapping.title],
          allDay: item.allDay,
          start: item[viewTypeByObjMapping.start],
          end: item[viewTypeByObjMapping.end],
          extrainfo: item.extrainfo
        };
        return a;
      });

      this.setState({
        selectedView: viewBy,
        stateEvent: newEvents
      });
    }
  }

  getViewObjectForViews = () => {
    let obj = {
      //day: true,
      //week: true,
      month: true,
      avaquarter: Quarter
      //  customMonthCompletion: Quarter,
      // customMonth: Quarter
    } as any;
    //return obj;
    viewByOptions &&
      viewByOptions.map((option) => {
        obj[option.name + "|" + calendarViews.MONTH] = option.defaultView;
        obj[option.name + "|" + calendarViews.AVA_QUARTER] = option.defaultView;
        //obj[option.name] = option.defaultView;
      });
    return obj;
  };

  getMessagesForCalendar = () => {
    let obj = {
      avaquarter: "Quarter",
      customMonthCompletion: "Month - Completion",
      customMonth: "Month Nomral"
    } as any;
    viewByOptions &&
      viewByOptions.map((option) => {
        obj[option.name] = option.displayName;
      });
    return obj;
  };

  render() {
    console.log(events);
    return (
      <div className="app">
        <BigCalendar
          ref={(ref) => (this.myCal = ref)}
          localizer={localizer}
          events={this.state.stateEvent as any}
          // startAccessor={(event) => {
          //   //console.log("startAccesor", event, this.myCal);
          //   //return event.start as Date;
          // }}

          formats={{
            weekdayFormat: "dddd",
            dateFormat: "D"
          }}
          onShowMore={(showMoreData) => {
            console.log("OnShowMore", showMoreData);
          }}
          selectable={true}
          onSelectSlot={(info) => {
            //console.log("slotinfos", info);
          }}
          eventPropGetter={this.propGetter as any}
          // onSelectEvent={(event) => {
          //   //this is for event selection
          //   console.log(event);
          // }}
          showAllEvents={false}
          //toolbar={true}
          components={{
            ///dateCellWrapper: DateCellComp,
            //event: EventComp as any,
            toolbar: CustomToolbar as any
          }}
          onNavigate={(data) => {
            //console.log("onNavigate", data);
          }}
          onView={(view) => {
            this.changeEventsData(view);
            console.log("onView", view);
            // view == "customMonthCompletion" ? (view = "month") : "";
            // this.setState({ selectedView: view });
          }}
          view={this.state.selectedView}
          //Component={{ toolbar: CustomToolbar }}
          views={this.getViewObjectForViews()}
          messages={this.getMessagesForCalendar()}
        />
      </div>
    );
  }
}
