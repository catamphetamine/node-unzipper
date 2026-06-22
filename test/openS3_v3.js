<<<<<<< HEAD
import { test } from "tap";
import { Open } from "../index.js";
import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

global.GetObjectCommand = GetObjectCommand;
global.HeadObjectCommand = HeadObjectCommand;
=======
const test = require("tap").test;
const fs = require("fs");
const path = require("path");
const Stream = require("stream");
const unzip = require("../unzip");
>>>>>>> aaf77f0c7b4d29af500b0aa9c0e2aa2ade0a2618

const version = +process.version.replace("v", "").split(".")[0];

function createS3ClientMock(buffer) {
  return {
    send: async function(command) {
      if (command.constructor.name == "HeadObjectCommand") {
        return {
          ContentLength: buffer.length,
        };
      }

      if (command.constructor.name == "GetObjectCommand") {
        const match = command.input.Range.match(/^bytes=(\d+)-(\d*)$/);
        const offset = Number(match[1]);
        const end = match[2] ? Number(match[2]) + 1 : undefined;
        const stream = Stream.PassThrough();

        stream.end(buffer.slice(offset, end));

        return {
          Body: stream,
        };
      }

      throw new Error("Unexpected command: " + command.constructor.name);
    },
  };
}

test(
  "get content of a single file entry out of a zip",
  { skip: version < 16 },
  function (t) {
<<<<<<< HEAD
    const client = new S3Client({
      region: "us-east-1",
      signer: { sign: async (request) => request },
    });

    // These files are provided by AWS's open data registry project.
    // https://github.com/awslabs/open-data-registry

    return Open.s3_v3(client, {
      Bucket: "wikisum",
      Key: "WikiSumDataset.zip",
=======
    const archive = path.join(__dirname, "../testData/compressed-standard/archive.zip");
    const buffer = fs.readFileSync(archive);
    const client = createS3ClientMock(buffer);

    return unzip.Open.s3_v3(client, {
      Bucket: "test",
      Key: "archive.zip",
>>>>>>> aaf77f0c7b4d29af500b0aa9c0e2aa2ade0a2618
    }).then(function (d) {
      const file = d.files.filter(function (file) {
        return file.path == "file.txt";
      })[0];

      return file.buffer().then(function (str) {
        const fileStr = fs.readFileSync(path.join(__dirname, "../testData/compressed-standard/inflated/file.txt"), "utf8");
        t.equal(str.toString(), fileStr);
        t.end();
      });
    });
  }
);
