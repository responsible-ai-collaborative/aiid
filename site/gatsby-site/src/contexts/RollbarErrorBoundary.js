import { Component } from 'react';
import PropTypes from 'prop-types';

const INITIAL_ERROR_STATE = { hasError: false, error: null };

export class RollbarErrorBoundary extends Component {
  static propTypes = {
    rollbarInstance: PropTypes.object,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_ERROR_STATE };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  logError(error) {
    const rollbarInstance = this.props.rollbarInstance;

    rollbarInstance?.error(error);
  }

  componentDidMount() {
    window.onunhandledrejection = (error) => {
      this.logError(error.reason);
    };
  }

  componentDidCatch(error) {
    this.logError(error);
  }

  render() {
    const { hasError } = this.state;

    if (!hasError) {
      const { children } = this.props;

      return children;
    }

    return null;
  }
}
