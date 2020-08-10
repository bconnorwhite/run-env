#!/usr/bin/env node
import { argv } from "process";
import runEnv from "../";

if(argv.length >= 3) {
  runEnv(argv[2]);
} else {
  throw new Error("Missing argument");
}
