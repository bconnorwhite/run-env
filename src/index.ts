import dotenv from "dotenv";
import { Scripts } from "@bconnorwhite/package/build/types";
import { getPackage } from "@bconnorwhite/package";
import run from "package-run";

type Matches = {
  exact?: boolean;
  env: {
    [env: string]: string;
  };
}

function match(scripts: Scripts = {}, script: string) {
  let matches: Matches = {
    exact: undefined,
    env: {}
  };
  Object.keys(scripts).forEach((name) => {
    if(name === script) {
      matches.exact = true;
    } else if(name.startsWith(`${script}:`)) {
      const env = name.slice(`${script}:`.length);
      if(env !== "") {
        matches.env[env] = name;
      }
    }
  });
  return matches;
}

const runEnv = (script: string) => {
  const env = dotenv.config().parsed;
  const NODE_ENV = (dotenv.config().parsed?.NODE_ENV) ?? process.env.NODE_ENV ?? "";
  const { scripts } = getPackage();
  const matches = match(scripts, script);
  let key = Object.keys(matches.env).find((environment) => {
    return NODE_ENV === environment;
  }) ?? Object.keys(matches.env).find((prefix) => {
    return NODE_ENV.startsWith(prefix);
  });
  const command = key ? matches.env[key] : (matches.exact && script);
  if(command) {
    run({
      command,
      env
    });
  } else {
    throw new Error(`No match was found for "${script}"`);
  }
};

export default runEnv;
