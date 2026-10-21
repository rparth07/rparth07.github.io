import { Component, PropsWithChildren } from "react";

/** Graphics failure must never hide the portfolio's text or navigation. */
export default class GraphicsBoundary extends Component<PropsWithChildren, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  componentDidCatch(error: Error) { console.error("Tech stack preview unavailable", error); }
  render() {
    return this.state.failed ? <p className="graphics-fallback" role="status">Interactive tech stack preview unavailable. All skills are listed above.</p> : this.props.children;
  }
}
