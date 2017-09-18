import React from "react";
import "react-select/dist/react-select.css";

import styles from "./ViewPollPage.css";
import coreStyles from "../Core.css";
import PollSelectionView from "./PollSelectionView";
import TextSectionView from "./TextSectionView";
import {TYPE_POLL, TYPE_TEXT, User} from "../Data.js";
import EventRest from "../EventRest";
import Footer from "../Footer";
import PollTableView from "./PollTableView";

export default class ViewPollPage extends React.Component {
    constructor(props) {
        super(props);

        this.eventId = this.props.match.params.eventId;

        this._onChangeUser = this._onChangeUser.bind(this);
        this._onEdit = this._onEdit.bind(this);
        this._onCancelEdit = this._onCancelEdit.bind(this);
        this._onSave = this._onSave.bind(this);
        this._onDelete = this._onDelete.bind(this);

        // if (!this.props.definitions || !this.props.commands) throw 'Missing parameters';
        let description = 'Rotting wooden planks, held aloft by rusty bits of wire, stretch out in front of you.' +
            ' You reach for a railing to steady yourself, but all you find are two threadbare ropes. ' +
            'The howling wind blows the rickety footbridge from side to side. Somewhere below you lies ' +
            'the forest floor—you don’t even know how far. (www.travelandleisure.com) ' +
            'Choose a bridge, pick a date and we will have sky walks together !';
        this.state = {
            event: null,
            /*event: {
             title: 'SUSPENSION BRIDGE DAY',
             subtitle: 'Magnific views from top of mountains',
             description: description
             },*/
            poll: {
                title: 'SUSPENSION BRIDGE DAY', subtitle: 'Magnific views from top of mountains',
                description: description
            },
            selectedUserIndex: 0,
            editing: true
        };

        EventRest.findEvent(this.eventId).then((event) => {
            this._appendNewUserEntry(event);
            this.setState({event: event});
        });
    }

    render() {
        let {event, selectedUserIndex} = this.state;
        if (event === null) return <div>Loading...</div>;
        let user = event.users[selectedUserIndex];
        return <div className={[styles.component, coreStyles.core].join(' ')}>
            <div className={coreStyles.body}>
                <div>
                    <div className={styles.section}>
                        <div className={styles.eventName}>{event.name.toUpperCase()}</div>
                        <div className={styles.description}>{event.description}</div>
                    </div>

                    <PollTableView/>
                    {this._renderSections(selectedUserIndex, user, event.sections)}
                </div>
                <Footer/>
            </div>
        </div>;
    }

    _appendNewUserEntry(event) {
        if (!event.users) {
            event.users = [];
        }
        event.users = [new User(null, 'Create new user', null)].concat(event.users);

    }

    _onChangeUser(index) {
        this.setState({selectedUserIndex: index, editing: index === 0});
    }

    _onEdit() {
        let user = this._getCurrentUser();
        this.saveSelect = user.selected ? user.selected.slice() : [];
        this.setState({editing: true});
    }

    _getCurrentUser() {
        return this.state.event.users[this.state.selectedUserIndex];
    }

    _onCancelEdit() {
        this.state.event.users[this.state.selectedUserIndex].selected = this.saveSelect;
        this.setState({editing: false});
    }

    _createFakeNewUser() {
        let newUser = new User(null, "", []);
        newUser.email = "";
        this.state.event.users.splice(0, 0, newUser);
        this.setState({selectedUserIndex: 1});
    }

    _onSave(userId, name, email) {
        let user = this.state.event.users[this.state.selectedUserIndex];
        if (user._id !== userId) return;

        user.name = name;
        user.email = email;
        console.log("SAVE:", user);
        EventRest.updateUser(this.eventId, user).then((updated) => {
            user._id = updated._id;
            if (userId === null) {
                this._createFakeNewUser();
                this.setState({editing: true});
            } else {
                this.setState({editing: false});
            }

        });
    }

    _onDelete() {
        let index = this.state.selectedUserIndex;
        if (index > 0) {
            let user = this.state.event.users[index];
            EventRest.deleteUser(this.eventId, user._id).then(() => {
                this.state.event.users.splice(index, 1);
                if (this.state.selectedUserIndex >= this.state.event.users.length) {
                    this.state.selectedUserIndex = this.state.event.users.length - 1;
                }
                this.setState({editing: false});
            });
        }
    }

    _renderSections(selectedUserIndex, user, sections) {
        if (selectedUserIndex == 0) return;
        if (!sections) return;

        return sections.map((section, i) => {
            let elmSectionBody;
            if (section.type === TYPE_POLL) {
                // console.log(section, section.type, section.type === TYPE_POLL, TYPE_POLL);
                elmSectionBody =
                    <PollSelectionView section={section} users={this.state.event.users}
                                       userIndex={this.state.selectedUserIndex}
                                       readOnly={!this.state.editing}/>;
            }
            else if (section.type === TYPE_TEXT) {
                elmSectionBody = <TextSectionView data={section.data}/>
            }
            return <div className={styles.section} key={i}>
                {elmSectionBody}
            </div>;
        });
    }
}

