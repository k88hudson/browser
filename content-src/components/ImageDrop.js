const React = require("react");
const Channel = require("lib/channel");

const ImageDrop = React.createClass({
  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  onDragLeave() {
    return false;
  },
  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer.getData("text/uri-list"));
    console.log(e.dataTransfer.getData("text/plain"));
    if (!e.dataTransfer.files.length) return;
    const file = e.dataTransfer.files[0];
    // TODO convert to action creator
    Channel.send({
      type: "POST_IMAGE_REQUEST",
      data: {
        path: file.path
      }
    });
    this.props.onChange(file.path);
    return false;
  },
  render() {
    return (<div className="image-drop"
      style={{backgroundImage: this.props.path && `url(${this.props.path})`}}
      onDragOver={this.onDragOver}
      onDragLeave={this.onDragLeave}
      onDrop={this.onDrop} />);
  }
});

module.exports = ImageDrop;
