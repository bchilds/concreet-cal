import React from 'react';
import moment from 'moment';

import { SingleDatePicker } from 'react-dates';

import * as CalendarModel from '../models/calendar.js';
import events from './events';
import FreeTimeSlotsModal from './FreeTimeSlotsModal.jsx';
import findFreeTimes from '../models/findFreeTimes.js';

class AddEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      contactsArray: []
    }
    //binding functions here
    //this.mergeContactsAndGroups = this.mergeContactsAndGroups.bind(this);
  }

  checkExist(contacts, target) {
    let check = false;
    for (let contact of contacts) {
      if (contact._id === target._id) {
        check = true;
      }
    }
    return check;
  }

  // mergeContactsAndGroups(callback) {
  //   let allContacts = this.props.selectedContacts.slice();
  //   // console.log(allContacts, 'What do u look like?');
  //   // console.log(this.props.selectedGroups, 'GROUPS?')
  //   this.props.selectedGroups.forEach((group)=> {
  //     group.contacts.forEach((contact) => {
  //       if (!this.checkExist(allContacts, contact)) {
  //         allContacts.push(contact);
  //       }
  //     })
  //   })

  //   this.setState({
  //     contactsArray: allContacts
  //   })
  //   console.log(allContacts, 'An array of all contacts')
  //   console.log(this.state.contactsArray, 'What do u look like?');

  // }

  handleEventSubmit(e) {
    var meetingLength = e.target.meetingLength.value
    var meetingTitle = e.target.title.value
    var timeMin = moment(e.target.date.value, "MM/DD/YYYY");

    var queryInfo = {
      timeMin: timeMin.toISOString(),
      timeMax: timeMin.add('1', 'days').toISOString()
    }; 

    var allContacts = this.props.selectedContacts.slice();
    console.log(allContacts, 'ONLY THE SELECTED CONTACTS')
    this.props.selectedGroups.forEach((group)=> {
      group.contacts.forEach((contact) => {
        if (!this.checkExist(allContacts, contact)) {
          allContacts.push(contact);
        }
      })
    })

    console.log('QI', queryInfo.timeMin)
    console.log(allContacts, 'finalizedd')


    CalendarModel.freeBusy(allContacts, this.props.user.user, queryInfo.timeMin, queryInfo.timeMax, (calendars) => {
      // receives back calendars object with each key being a unique email address
      // each property has a value that is an object with a busy property
      // value of busy property is an array of objects that include start and end property of busy times
      findFreeTimes.findAvailableSlots(meetingLength, calendars, (freeSlots) => {
        // passsing back the available slots as well as the selected date in ISO format
        this.props.updateSlotsAndEventInfo(freeSlots, queryInfo.timeMin, meetingTitle)
      });
    })

    e.preventDefault();
  }
  
  render() {
    return (
      <div className="addevent">
        <form onSubmit={this.handleEventSubmit.bind(this)}>
          <label>Meeting Title</label><input name="title"></input>
          <label>Meeting Length (minutes) </label><input name="meetingLength"></input>
          <label>Date</label><input name="date" placeholder="MM/DD/YYYY"></input>
          <button>Create event</button>
        </form>
      </div>

    );
  }
}

export default AddEvent;

//This will be a form with dates/event name/description ...etc