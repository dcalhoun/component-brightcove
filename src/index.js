import React from 'react';
import PropTypes from 'prop-types';
import lodashUniqid from 'lodash.uniqueid';

const arbitraryDefaultWidth = 595;
const arbitraryDefaultHeight = 335;
export default class Brightcove extends React.Component {
  static get defaultProps() {
    return {
      experienceID: lodashUniqid('BrightCoveExperience_'),
    };
  }
  constructor(args) {
    super(...args);
    this.unmounted = false;
  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.loadBrightcoveScript().then(() => {
        if (this.unmounted) {
          return;
        }
        this.brightcove.createExperiences();
      }).catch((reason) => {
        if (this.props.onError) {
          this.props.onError(reason);
        }
      });
    }
  }
  shouldComponentUpdate() {
    return false;
  }
  componentWillUnmount() {
    if (this.brightcove) {
      this.brightcove.removeExperience(this.props.experienceID);
    }
    this.unmounted = true;
  }
  loadBrightcoveScript() {
    return this.props.getBrightcoveExperience().then((brightcove) => {
      this.brightcove = brightcove;
      return brightcove;
    });
  }
  render() {
    const {
      videoID,
      playerID,
      playerKey,
      labels,
      width = arbitraryDefaultWidth,
      height = arbitraryDefaultHeight,
      secureConnections = true,
      autoStart = true,
    } = this.props;
    return (
      <div className="brightcove" style={{ width, height }}>
        <object id={this.props.experienceID} className="BrightcoveExperience brightcove__experience">
          <param name="bgcolor" value="#FFFFFF" />
          <param name="isUI" value="true" />
          <param name="isVid" value="true" />
          <param name="dynamicStreaming" value="true" />
          <param name="autoStart" value={String(autoStart)} />
          <param name="wmode" value="opaque" />
          <param name="includeAPI" value="true" />
          <param name="cssclass" value="" />
          <param name="width" value={width} />
          <param name="height" value={height} />
          <param name="labels" value={labels} />
          <param name="playerID" value={playerID} />
          <param name="playerKey" value={playerKey} />
          <param name="@videoPlayer" value={videoID} />
          <param name="secureConnections" value={String(secureConnections)} />
          <param name="secureHTMLConnections" value={String(secureConnections)} />
        </object>
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  Brightcove.propTypes = {
    experienceID: PropTypes.string,
    videoID: PropTypes.string.isRequired,
    playerID: PropTypes.string.isRequired,
    playerKey: PropTypes.string.isRequired,
    labels: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    secureConnections: PropTypes.bool,
    getBrightcoveExperience: PropTypes.func,
    onError: PropTypes.func,
    autoStart: PropTypes.bool,
  };
}
