/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import lineNumbers from "./lineNumbers.js";
import repeat from "lodash/repeat.js";

const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;

export default function ({ rawLines, lineNumber, colNumber, length }) {
    const lines = rawLines.split(NEWLINE);
    const start = Math.max(lineNumber - 3, 0);
    const end = Math.min(lineNumber + 3, lines.length);

    return lineNumbers(lines.slice(start, end), {
        start: start + 1,
        before: "  ",
        after: " | ",
        transform(params) {
            if (params.number !== lineNumber) {
                return;
            }

            if (typeof colNumber === "number") {
                params.line += `\n${params.before}${repeat(" ", params.width)}${
                    params.after
                }${repeat(" ", colNumber)}${repeat("^", length)}`;
            }

            params.before = params.before.replace(/^./, ">");
        }
    }).join("\n");
}
