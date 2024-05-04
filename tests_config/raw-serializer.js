const RAW = Symbol.for("raw");

const print = val => val[RAW];
const test = val =>
    val &&
    Object.prototype.hasOwnProperty.call(val, RAW) &&
    typeof val[RAW] === "string";
export default {
    print,
    test
};
