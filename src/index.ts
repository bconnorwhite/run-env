import dotenv from "dotenv";
import { pkg } from "@bconnorwhite/package";
import { Scripts } from "@bconnorwhite/package/build/package-json/types";
import { getCommand as getExecCommand } from "package-run";
import exec from "@bconnorwhite/exec";

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

export function getCommand(script: string) {
  const env = dotenv.config().parsed;
  const NODE_ENV = (dotenv.config().parsed?.NODE_ENV) ?? process.env.NODE_ENV ?? "";
  const { scripts } = pkg;
  const matches = match(scripts, script);
  let key = Object.keys(matches.env).find((environment) => {
    return NODE_ENV === environment;
  }) ?? Object.keys(matches.env).find((prefix) => {
    return NODE_ENV.startsWith(prefix) && prefix.length >= 3;
  });
  const command = key ? matches.env[key] : (matches.exact && script);
  if(command) {
    return {
      command,
      env
    }
  } else {
    return undefined;
  }
}

const runEnv = async (script: string) => {
  const command = getCommand(script);
  if(command) {
    return getExecCommand(command).then((execCommand) => {
      return exec(execCommand);
    });
  } else {
    throw new Error(`No match was found for "${script}"`);
  }
};

export default runEnv;
