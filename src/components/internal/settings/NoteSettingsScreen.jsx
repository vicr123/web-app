import React, { Component } from 'react';
import { SelectableItem, ToggleSwitch, List, DefaultInput, CloseButton, Flex, FlexChild, User, Scroller } from '../..';
import { connect } from 'react-redux';
import './NoteSettingsScreen.scss';
import RULESETS from '../../../constants/Rulesets';

function mapStateToProps (state) {
  return {
    compact: false,
    board: state.boards[state.selectedBoard],
    members: state.membersByBoard[state.selectedBoard]
  };
}

const BASE_RULE = {
  id: 0,
  name: 'Basic rule', // name
  position: 0, // determines what order rules should be executed in
  instructions: 0x0
}

class SelectablePerformable extends Component {
  constructor (props) {
    super(props);
    this.state = {
      performables: [],
      performableFlags: []
    }
  }

  addPerformable () {
    const { onChange = () => void 0 } = this.props;
    if (onChange) {
      onChange();
    }

    let { performables } = this.state;
    performables.push(this.renderPerformableSelection());
    this.setState({ performables });
  }

  addToPerformableFlags (flag) {
    const { performableFlags } = this.state;
    performableFlags.push(flag);
    this.setState({ performableFlags });
    console.log(performableFlags)
  }

  handlePerformableSelect (event) {
    console.log(event.target.value)
    switch (event.target.value) {
      case 'assign-members': {
        this.addToPerformableFlags(RULESETS.ASSIGN_MEMBERS);
        break;
      }
      case 'set-title': {
        this.addToPerformableFlags(RULESETS.SET_TITLE);
        break;
      }
      case 'add-content-title': {
        this.addToPerformableFlags(RULESETS.ADD_CONTENT_TITLE);
        break;
      }
      case 'add-content-desc': {
        this.addToPerformableFlags(RULESETS.ADD_CONTENT_NOTE);
        break;
      }
      case 'replace-content': {
        this.addToPerformableFlags(RULESETS.REPLACE_CONTENT);
        break;
      }
      case 'add-due-date': {
        this.addToPerformableFlags(RULESETS.ADD_DUE_DATE);
        break;
      }
      case 'set-importance': {
        this.addToPerformableFlags(RULESETS.SET_IMPORTANCE_LEVEL);
        break;
      }
      case 'announce-content': {
        this.addToPerformableFlags(RULESETS.ANNOUNCE_CONTENT);
        break;
      }
      case 'send-notif': {
        this.addToPerformableFlags(RULESETS.SEND_NOTIFICATION);
        break;
      }
      default: {
        
      }
    }
  }

  renderUserPanel () {
    const users = this.props.members;
    return (
      <List style={{ height: '300px', maxHeight: '300px' }}>
        <Scroller>
          {users.map((user, i) =>
            <SelectableItem key={i} className='user-item' id={user.id} selected={false}>
              <Flex align='left' basis='auto' grow={1} shrink={1}>
                <FlexChild align='left' direction='row' basis='auto' grow={1} shrink={1}>
                  <User avatar={user.avatar} username={user.username} />
                </FlexChild>
              </Flex>
            </SelectableItem>)}
        </Scroller>
      </List>
    )
  }

  renderPerformableSelection (performable) {
    return (
      <Flex direction='row' key={Math.random() * 100} grow={1} align='center'>
        <select onChange={(e) => this.handlePerformableSelect(e)}>
          <option value='assign-members'>assign these members</option>
          <option value='set-title'>set the title to</option>
          <option value='add-content-title'>add content to the notes title</option>
          <option value='add-content-desc'>add content to the note</option>
          <option value='replace-content'>replace the content of the note</option>
          <option value='add-due-date'>add a due date</option>
          <option value='set-importance'>set the importance level</option>
          <option value='announce-content'>announce content</option>
          <option value='send-notif'>send a notification</option>
        </select>
        <CloseButton />
        <br />
      </Flex>
    );
  }

  newPerformableButton () {
    return <div key={Math.random() * 100} onClick={(e) => this.addPerformable()} className='performable-create-btn'>+</div>
  }

  render () {
    const { performables } = this.state;
    return performables.length ? <Flex direction='column'>
      <FlexChild direction='column' align='center' justify='center'>
        {performables.map((performable, i) => {
          console.log(performable)
          return this.renderPerformableSelection(performable)
        })}
      </FlexChild>
      <FlexChild className='performable-creation-section' direction='row'>
        <span className='performable-creation-text-add'>and...</span>{this.newPerformableButton()}
      </FlexChild>
    </Flex> : this.newPerformableButton();
  }
}
const ConnectedSelectablePerformable = connect(mapStateToProps, null)(SelectablePerformable);

class Rule extends Component {
  constructor (props) {
    super(props);
    this.state = {
      existingSelected: false
    }
  }

  initialize () {
    const { rule } = this.props;
    const has = {};
    this.bitfield = 0;
    for (const permission in RULESETS) {
      has[permission] = has[RULESETS[permission]] = (this.bitfield & permission) === this.bitfield;
    }
    return has;
  }

  handleActionTypeSelect (event) {
    switch (event.target.value) {
      case 'existing-note': {
        this.setState({ existingSelected: true });
        break;
      }
      case 'new-note': {
        this.setState({ existingSelected: false });
        break;
      }
      case 'created': {
        this.bitfield |= RULESETS.NOTE_CREATED;
        this.bitfield &= ~RULESETS.NOTE_EDITED;
        this.bitfield &= ~RULESETS.NOTE_DELETED;
        break;
      }
      case 'edited': {
        this.bitfield &= ~RULESETS.NOTE_CREATED;
        this.bitfield &= ~RULESETS.NOTE_DELETED;
        this.bitfield |= RULESETS.NOTE_EDITED;
      }
      case 'deleted': {
        this.bitfield &= ~RULESETS.NOTE_CREATED;
        this.bitfield &= ~RULESETS.NOTE_EDITED;
        this.bitfield |= RULESETS.NOTE_DELETED;
        break;
      }
      default: {
        this.setState({ existingSelected: false });
        break;
      }
    }
  }

  render () {
    const { index } = this.props;
    const { existingSelected } = this.state;
    const rule = this.initialize();
    const performableMenu = React.createElement(ConnectedSelectablePerformable, { onChange: () => this.forceUpdate() })
    console.log(this.bitfield)
    console.log(performableMenu)
    return (<div>
      <div className='rule-creating'>
        <Flex align='center' direction='row'>
          <span className='rule-creation-header' style={{ marginRight: '12px' }}>Rule</span> <DefaultInput placeholder={rule.name || index}></DefaultInput>
        </Flex>
        <div className='board-note-settings-midheader'>
          When <b>
            <select onChange={(e) => this.handleActionTypeSelect(e)}>
              <option value='existing-note'>an existing</option>
              <option value='new-note'>a new</option>
            </select>
          </b> note is...
          <select onChange={(e) => this.handleActionTypeSelect(e)}>
            <option disabled={!existingSelected} selected={rule.NOTE_CREATED || rule.EXISTING_NOTE_CREATED} value='created'>created</option>
            <option disabled={existingSelected} selected={rule.NOTE_EDITED || rule.EXISTING_NOTE_EDITED} value='edited'>edited</option>
            <option disabled={existingSelected} selected={rule.NOTE_DELETED || rule.EXISTING_NOTE_DELETED} value='deleted'>deleted</option>
          </select>
        </div>
        
        <Flex direction='column'>
          <Flex direction='row' grow={0} className='board-settings-subheader'>
            Performables
          </Flex>
          {performableMenu}
        </Flex>
      </div>
    </div>);
  }
}

class NoteSettingsScreen extends Component {
  constructor (props) {
    super(props);
    this.state = {
      rules: [
        // Basic rule object
        BASE_RULE
      ]
    }
  }

  createRule (options = BASE_RULE) {
    const { rules } = this.state;
    const { name, position, instructions } = options;
    const newRule = BASE_RULE;
    newRule.position = Math.max(...rules.map(o => o.y), 0) + 1;
    newRule.name = name;
    newRule.instructions = instructions;
    rules.push(newRule)
    this.forceUpdate();
    console.log(rules)
  }

  modifyRule (key, value) {

  }

  render () {
    let { compact } = this.props;
    let { rules } = this.state;

    return (
      <Flex direction='column' align='left' className='board-settings-content-container'>
        <div className='board-settings-header'>
          Notes
        </div>
        <div className='board-settings-text'>
          Adjust how notes look and perform actions on certain events
        </div>

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          Compact Mode
          <ToggleSwitch initialState={compact} small={true} style={{ marginLeft: '24px' }} />
        </Flex>
        Makes notes take up less space on the screen and displays less information

        <Flex direction='row' grow={0} className='board-settings-subheader'>
          Action Types
        </Flex>

        <List style={{ height: 'auto', maxHeight: '50%', paddingRight: '12px' }}>
          <Scroller>
            {!rules.length && <div>No note rules</div>}
            {rules.length && rules.map((rule, i) => <Rule index={i} key={i} rule={rule} />)}
          </Scroller>
        </List>
        <div style={{ marginTop: '12px' }} className='btn' onClick={() => this.createRule()}>New Rule</div>
      </Flex>
    );
  }
}

export default connect(mapStateToProps, null)(NoteSettingsScreen);