import validator from "validator";

export const isDate = validator.isDate;
console.log(isDate("2018"));
console.log(isDate("2018-01-31"));
