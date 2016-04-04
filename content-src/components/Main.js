const React = require("react");
const {connect} = require("react-redux");
const {validateSelector} = require("selectors/selectors");
const {UpdateFrontMatter, UpdateContent} = require("actions/actions");
const classnames = require("classnames")
const editors = require("lib/editors");
const MarkdownEditor = require("components/MarkdownEditor");

const Main = React.createClass({
  render() {
    const {fields, content, empty} = this.props.CurrentFile;

    if (empty || !fields.length) return <main />;

    return (<main>
      {fields.map(field => {
        const key = field.key;
        const {errors, editor, label} = field;

        const Editor = editors[editor] ? editors[editor].element : editors.default.element;

        const props = Object.assign({}, field, {
          onChange: value => {
            this.props.dispatch(UpdateFrontMatter(key, value));
          },
          dispatch: this.props.dispatch
        });

        return (<div key={key} className={classnames("field", {"has-error": errors})}>
          <label>{label || key}</label>
          <div className="error" hidden={!errors}>
            {errors && errors.join(", ")}
          </div>
          <Editor {...props} />
        </div>);
      })}

      <div className="C">
        <label>Content</label>
        <MarkdownEditor value={content} name="content-editor" onChange={value => {
          this.props.dispatch(UpdateContent(value));
        }} />
      </div>

      <div className="field">
        <button className="action">Publish</button>
      </div>
    </main>);
  }
});

module.exports = connect(state => ({
  CurrentFile: validateSelector(state),
  Project: state.Project
}))(Main);
