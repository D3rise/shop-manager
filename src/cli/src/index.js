const API = require("../../api");
const commands = require("./commands");
const fs = require("fs");

// this code was written by me in caffeine trip when
// deadline was really, really close, so please do not
// take it seriously and better if you do not read this code at all.
// I'm aware of all the clear-code principles that I broke here.
// TODO: refactor all this code

async function main(command, args) {
  global.api = new API("http://localhost:8545");

  if (!Object.keys(commands).includes(command)) {
    console.log('No such command!\nUse "help" to get command list!');
    process.exit(1);
  }

  if (args.length < commands[command].args) {
    console.log(
      `Insufficient amount of arguments! Required: ${commands[command].args}, given: ${args.length}`
    );
    process.exit(1);
  }

  try {
    global.userData = JSON.parse(fs.readFileSync("./userdata.txt").toString());
  } catch (e) {
    fs.writeFileSync("./userdata.txt", "{}");
    global.userData = {};
  }

  if (userData.username && command !== "login" && command !== "signup") {
    await commands.login.func(
      userData.username,
      userData.password,
      userData.secret
    );
  }

  commands[command].func(...args);
}

if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);

  main(command, args).catch((e) => {
    console.log("\nUnexpected error:\n" + e.message);
    process.exit(1);
  });
}
