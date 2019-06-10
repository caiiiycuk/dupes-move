import * as process from "process";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import * as fse from "fs-extra";

const node = process.argv[0];
const mdupes = process.argv[1];
const listFile = process.argv[2];
const trashDir = process.argv[3];
const mFlag = process.argv[4] === "-m";

if (listFile === undefined || trashDir === undefined) {
    console.log(`Usage: node mdupes.js duplicates-list trash-directory [-m]

Where:
 - duplicates-list is output of fdupse/jdupse
   > fdupes -r . > duplicates.list
 - trash-directory is directory where all duplicate copy will be moved 
 -m move files while running (instead of generating mv commands)

 **NOTE**: By default this program never modify or move your files, it's only generates
 sequency of mv commands for moving files. For actual moving you should use -m flag
`);
}

const duplicates = fs.readFileSync(listFile).toString().split("\n");

const root = path.dirname(listFile);
process.chdir(root);

const moveList: { src: string, dst: string }[] = [];
let copies: string[] = [];
for (const next of duplicates) {
  if (next.trim().length === 0) {
    moveCopies(copies, trashDir, moveList);
    copies = [];
  } else {
    copies.push(next);
  }
}
moveCopies(copies, trashDir, moveList);

console.log("Executing move task, records:", moveList.length);
execute(moveList);

function moveCopies(copies: string[], trashDir: string, moveList: { src: string, dst: string }[]) {
  if (copies.length === 0) {
    return;
  }

  if (copies.length < 2) {
    console.warn("Copies array contains 1 entry", copies);
    process.exit(-1);
    return;
  }

  let original = copies[0];
  for (const next of copies) {
    if (next.length < original.length) {
      original = next;
    }
  }

  for (const next of copies) {
    if (next !== original) {
      moveList.push({
        src: next,
        dst: path.resolve(trashDir, next)
      });
    }
  }
}


function execute(moveList: { src: string, dst: string }[]) {
  for (const next of moveList) {
    if (mFlag) {
      if (fse.existsSync(next.src)) {
        fse.ensureDirSync(path.dirname(next.dst));
        fse.moveSync(next.src, next.dst);
      } else {
        console.warn("Copy", next.src, "does not exists, skipping");
      }
    } else {
      console.log("mv " + next.src + " " + next.dst);
    }
  }
}

