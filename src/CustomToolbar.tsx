import PropTypes from "prop-types";
import React from "react";
import { calendarViews, viewByOptions } from "./App";
import clsx from "clsx";
import { Navigate, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "./fabric.css";
import {
  initializeIcons,
  DatePicker,
  DayOfWeek,
  TextField,
  Dropdown,
  IDropdownOption,
  mergeStyles,
  defaultDatePickerStrings,
  Calendar,
  DateRangeType,
  defaultCalendarStrings,
  Callout,
  ChoiceGroup,
  IChoiceGroupOption,
  ITextFieldProps
} from "@fluentui/react";

import { FontIcon } from "@fluentui/react/lib/Icon";
import styles from "./CustomToolbarStyle.module.scss";
initializeIcons();
enum viewByValues {
  promotionView = "promotionView",
  completionView = "completionView"
}

const DropdownControlledMultiExampleOptions = [
  { key: "apple", text: "Apple" },
  { key: "banana", text: "Banana" }
];

export interface CustomToolbarStates {
  viewType: any;
  viewByType: any;
  monthPickerOpen: boolean;
  goToDateValue: any;
  viewByChoices: any[];
}

const columnTextProps: ITextFieldProps = {
  defaultValue: "dasdas",
  placeholder: "Please enter text here"
  //onRenderInput: { root: { width: 300 } },
};
const options: IChoiceGroupOption[] = [
  { key: "month", text: "Month" },
  { key: "avaquarter", text: "Quarter" }
];

class CustomToolbar extends React.Component<ToolbarProps, CustomToolbarStates> {
  constructor(props: ToolbarProps) {
    super(props);
    this.state = {
      viewType: this.props.view,
      monthPickerOpen: false,
      goToDateValue: this.props.date,
      viewByChoices: viewByOptions.map((item) => {
        return {
          key: item.name,
          text: item.displayName
        };
      })
    };

    //this.viewChangeHandler = this.viewChangeHandler.bind(this);
  }

  viewChangeHandler(view) {
    this.setState(
      {
        viewType: view
      },
      () => {
        this.calendarViewChangeHandler();
        //this.props.onView(view);
        //this.props.view.bind(null, view);
      }
    );
  }

  viewByChangeHandler(e, viewby) {
    console.log(viewby);
    if (this.state.viewByType) {
      this.setState(
        {
          viewByType: viewby.key
          //viewType: calendarViews.MONTH
        },
        () => {
          this.calendarViewChangeHandler();
          //this.props.onView("key" as any);
          //this.props.onView((viewby.key + "month") as any);
        }
      );
    }
  }

  calendarViewChangeHandler() {
    if (this.state.viewByType && this.state.viewType) {
      const viewName: any = this.state.viewByType + "|" + this.state.viewType;
      this.props.onView(viewName);
    }
  }

  componentDidMount() {
    this.setState({
      viewByType: this.state.viewByChoices[0].key
    });
  }

  updateOverallView() {
    if (this.state.viewByType) {
    }
  }

  onRadioViewChange(e, choice) {
    console.log(choice);
    this.viewChangeHandler(choice.key);
  }

  onSelectDate(e) {
    console.log(e);
    this.setState(
      {
        goToDateValue: e ? e : this.state.goToDateValue,
        monthPickerOpen: !this.state.monthPickerOpen
      },
      () => {
        if (e) {
          this.newDirectGo(e);
        }
      }
    );
  }
  //viewby handlers
  //create json to add mapping to event object

  render() {
    console.log(this.props);
    let {
      localizer: { messages },
      label
    } = this.props;

    return (
      <div className={styles.avaToolbar}>
        <div className={styles.leftSection}>
          <button
            className={styles.todayButton}
            type="button"
            onClick={this.navigate.bind(null, "TODAY")}
          >
            <FontIcon
              aria-label="GotoToday"
              iconName="GotoToday"
              className={styles.btntodayIcon}
            />{" "}
            Today
          </button>
          <div className={styles.navigationContainer}>
            <div
              className={styles.prevIcon}
              onClick={this.navigate.bind(null, "PREV")}
            >
              <FontIcon iconName="Up" />
            </div>
            <div
              className={styles.nextIcon}
              onClick={this.navigate.bind(null, "NEXT")}
            >
              <FontIcon iconName="Down" />
            </div>
          </div>

          <div
            id="GoToDateBtn"
            className={styles.GoToDateControl}
            onClick={() =>
              this.setState({ monthPickerOpen: !this.state.monthPickerOpen })
            }
          >
            {this.props.date
              ? moment(this.props.date).format("MMM, YYYY")
              : //moment(this.state.goToDateValue).format("MMM, YYYY")
                moment().format("MMM, YYYY")}
            <FontIcon iconName="ChevronDown" className={styles.OpenIcon} />
          </div>
          <>
            {this.state.monthPickerOpen && (
              <Callout
                //ariaLabelledBy={labelId}
                //ariaDescribedBy={descriptionId}
                role="dialog"
                className={styles.callout}
                //gapSpace={0}
                target={`#GoToDateBtn`}
                isBeakVisible={false}
                //beakWidth={0}
                onDismiss={() => this.onSelectDate(null)}
                //directionalHint={directionalHint}
                setInitialFocus
              >
                <Calendar
                  className={styles.monthPicker}
                  dateRangeType={DateRangeType.Month}
                  highlightSelectedMonth
                  isDayPickerVisible={false}
                  onSelectDate={(e, value) => this.onSelectDate(e, value)}
                  value={this.props.date}
                  // Calendar uses English strings by default. For localized apps, you must override this prop.
                  strings={defaultCalendarStrings}
                />
              </Callout>
            )}
          </>
        </div>
        <div className={styles.rightSection}>
          {/* {viewByOptions[0].name} */}
          <div>
            <button
              className={styles.viewEventsButton}
              type="button"
              onClick={this.navigate.bind(null, "TODAY")}
            >
              <FontIcon
                aria-label="CalendarWeek"
                iconName="CalendarWeek"
                className={styles.btntodayIcon}
              />{" "}
              View Events
            </button>
          </div>
          <div>
            <ChoiceGroup
              defaultSelectedKey={calendarViews.MONTH}
              options={options}
              onChange={this.onRadioViewChange.bind(this)}
              required={true}
            />
          </div>
          <div>
            {this.state.viewByChoices && this.state.viewByChoices.length > 0 && (
              <Dropdown
                //placeholder="Select options"
                label="View by"
                defaultSelectedKey={
                  this.state.viewByChoices
                    ? this.state.viewByChoices[0].key
                    : ""
                }
                //         defaultSelectedKey={"promotion"}
                //selectedKeys={
                // this.state.viewByChoices ? this.state.viewByChoices[0].key : ""
                //}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={this.viewByChangeHandler.bind(this)}
                //multiSelect
                options={this.state.viewByChoices}
                // styles={dropdownStyles}
              />
            )}
          </div>
        </div>

        {/* <button type="button" onClick={this.newDirectGo}>
          {"Go to my date"} |{" "}
          {/* {this.props.view ? this.props.view + "|" + this.state.viewType : ""} */}
        {/* <button type="button" onClick={this.view.bind(null, "completion")}>
          {"Completion view"}
        </button> */}
        {/* <span className="ava-toolbar-label">{label}</span> */}
      </div>
    );
  }

  navigate = (action) => {
    this.props.onNavigate(action);
  };

  newDirectGo = (date) => {
    this.props.onNavigate("DATE", date);
  };

  view = (view) => {
    this.props.onView(view);
  };

  viewNamesGroup(messages) {
    let viewNames = this.props.views;
    const view = this.props.view;

    if (viewNames.length > 1) {
      return viewNames.map((name) => (
        <button
          type="button"
          key={name}
          //className={clsx({ "rbc-active": view === name })}
          onClick={this.view.bind(null, name)}
        >
          {messages[name]}
        </button>
      ));
    }
  }
}

CustomToolbar.propTypes = {
  view: PropTypes.string.isRequired,
  views: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.node.isRequired,
  localizer: PropTypes.object,
  onNavigate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired
};

// CustomToolbar.GetViewType = () => {
//   return "this_is_the_view";
// };

// export interface ToolbarProps<TEvent extends object = Event, TResource extends object = object> {
//   date: Date;
//   view: View;
//   views: ViewsProps<TEvent, TResource>;
//   label: string;
//   localizer: { messages: Messages };
//   onNavigate: (navigate: NavigateAction, date?: Date) => void;
//   onView: (view: View) => void;
//   children?: React.ReactNode | undefined;
// }

export default CustomToolbar;
