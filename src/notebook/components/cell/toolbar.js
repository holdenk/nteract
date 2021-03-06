/* eslint class-methods-use-this: 0 */
// @flow
import React from 'react';
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

import { executeCell } from '../../epics/execute';

import {
  removeCell,
  toggleStickyCell,
  clearCellOutput,
  changeOutputVisibility,
  changeInputVisibility,
  changeCellType,
} from '../../actions';

type Props = {
  cell: any,
  id: string,
  type: string,
}

export default class Toolbar extends React.Component {
  shouldComponentUpdate: (p: Props, s: any) => boolean;
  removeCell: () => void;
  executeCell: () => void;
  clearCellOutput: () => void;
  toggleStickyCell: () => void;
  changeInputVisibility: () => void;
  changeOutputVisibility: () => void;
  changeCellType: () => void;

  static contextTypes = {
    store: React.PropTypes.object,
  };

  constructor(props: Props): void {
    super(props);
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    this.removeCell = this.removeCell.bind(this);
    this.executeCell = this.executeCell.bind(this);
    this.clearCellOutput = this.clearCellOutput.bind(this);
    this.toggleStickyCell = this.toggleStickyCell.bind(this);
    this.changeInputVisibility = this.changeInputVisibility.bind(this);
    this.changeOutputVisibility = this.changeOutputVisibility.bind(this);
    this.changeCellType = this.changeCellType.bind(this);
  }

  shouldComponentUpdate(): boolean {
    return false;
  }

  toggleStickyCell(): void {
    this.context.store.dispatch(toggleStickyCell(this.props.id));
  }

  removeCell(): void {
    this.context.store.dispatch(removeCell(this.props.id));
  }

  executeCell(): void {
    this.context.store.dispatch(executeCell(
                                      this.props.id,
                                      this.props.cell.get('source')));
  }

  clearCellOutput(): void {
    this.refs.dropdown.hide();
    this.context.store.dispatch(clearCellOutput(this.props.id));
  }

  changeInputVisibility(): void {
    this.refs.dropdown.hide();
    this.context.store.dispatch(changeInputVisibility(this.props.id));
  }

  changeOutputVisibility(): void {
    this.refs.dropdown.hide();
    this.context.store.dispatch(changeOutputVisibility(this.props.id));
  }

  changeCellType(): void {
    this.refs.dropdown.hide();
    const to = this.props.type === 'markdown' ? 'code' : 'markdown';
    this.context.store.dispatch(changeCellType(this.props.id, to));
  }

  render(): ?React.Element<any> {
    const showPlay = this.props.type !== 'markdown';
    return (
      <div className="cell-toolbar-mask" ref="mask">
        <div className="cell-toolbar">
          {showPlay &&
            <span>
              <button onClick={this.executeCell} className="executeButton" >
                <span className="octicon octicon-triangle-right" />
              </button>
            </span>}
          <button onClick={this.removeCell} className="deleteButton" >
            <span className="octicon octicon-trashcan" />
          </button>
          <button onClick={this.toggleStickyCell} className="stickyButton" >
            <span className="octicon octicon-pin" />
          </button>
          <Dropdown ref="dropdown">
            <DropdownTrigger>
              <button>
                <span className="octicon octicon-chevron-down" />
              </button>
            </DropdownTrigger>
            <DropdownContent ref="DropdownContent">
              {
              (this.props.type === 'code') ?
                <ul>
                  <li onClick={this.clearCellOutput} className="clearOutput" >
                    <a>Clear Cell Output</a>
                  </li>
                  <li onClick={this.changeInputVisibility} className="inputVisibility" >
                    <a>Toggle Input Visibility</a>
                  </li>
                  <li onClick={this.changeOutputVisibility} className="outputVisibility" >
                    <a>Toggle Output Visibility</a>
                  </li>
                </ul> : null
              }
              <ul>
                <li onClick={this.changeCellType} className="changeType" >
                  <a>
                    Convert to {this.props.type === 'markdown' ? 'Code' : 'Markdown'} Cell
                  </a>
                </li>
              </ul>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    );
  }
}
