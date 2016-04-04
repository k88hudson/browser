const React = require("react");
const Icon = require("components/Icon");

const ArrayEditor = React.createClass({
  onChange(index, value) {
    const newArray = this.props.value.slice(0);
    if (value === null) {
      newArray.splice(index, 1);
    } else {
      newArray[index] = value;
    }
    this.props.onChange(newArray);
  },
  render() {
    if (!this.props.value || !this.props.value.map) {
      return (<div>{this.props.value}</div>);
    }
    return (<ul className="array-editor">
      {this.props.value.map((item, i) => {
        return (<li className="input-button-group" key={i}>
          <input value={item} onChange={e => this.onChange(i, e.target.value)} />
          <button onClick={() => this.onChange(i, null)}><Icon image="close" /></button>
        </li>);
      })}
      <li><button onClick={() => this.onChange(this.props.value.length, "")}>Add</button></li>
    </ul>);
  }
});

module.exports = ArrayEditor;
