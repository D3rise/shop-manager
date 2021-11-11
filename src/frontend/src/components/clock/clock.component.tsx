import React from "react";

interface IProps {}
interface IState {
  date: Date;
}

export class Clock extends React.Component<IProps, IState> {
  timerID: any;
  constructor(props: IProps) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.setState({ date: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({ date: new Date() });
  }

  render() {
    return (
      <h2 style={{ textAlign: "right" }}>
        {this.state.date.getHours()}:{this.state.date.getMinutes()}:
        {this.state.date.getSeconds()}
      </h2>
    );
  }
}
