import React from "react";

interface IProps {}
interface IState {
  name: string;
  password: string;
  secret: string;
  [x: string]: string | boolean;
}

export class Login extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      name: "",
      password: "",
      secret: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event: React.FormEvent) {
    alert("Введенное имя: " + this.state.name);
    alert("Введенный пароль: " + this.state.password);
    alert("Введенный секрет: " + this.state.secret);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Имя:
          <input
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          ></input>
        </label>
        <br />
        <label>
          Пароль:
          <input
            name="password"
            value={this.state.password}
            type="password"
            onChange={this.handleChange}
          ></input>
        </label>
        <br />
        <label>
          Секрет:
          <input
            name="secret"
            value={this.state.secret}
            type="password"
            onChange={this.handleChange}
          ></input>
        </label>
        <br />
        <button type="submit">Отправить</button>
      </form>
    );
  }
}
