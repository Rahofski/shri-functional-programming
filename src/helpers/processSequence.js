import Api from '../tools/api';
import {
  allPass, test, tap, ifElse, compose,
  andThen, otherwise, pipe, prop
} from 'ramda';

const api = new Api();

const square = num => num * num;
const remainder = num => num % 3;

const numberUrl = 'https://api.tech/numbers/base';
const animalUrl = 'https://animals.tech/';

const lengthGreaterThanTwo = str => str.length > 2;
const lengthLessThanTen = str => str.length < 10;
const isNumericWithDot = test(/^[0-9.]+$/);

const validate = allPass([
  lengthGreaterThanTwo,
  lengthLessThanTen,
  isNumericWithDot
]);

const getBinary = query => api.get(numberUrl)(query);

const getAnimal = id => api.get(animalUrl)(id)

const roundToNumber = compose(Math.round, Number);
const makeQuery = value => ({ from: 10, to: 2, number: value });

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const log = tap(writeLog);

  const onError = () => handleError('ValidationError');

  const process = pipe(
  log,
  roundToNumber,
  log,
  makeQuery,
  getBinary,
  andThen(pipe(
    prop('result'),        // binary result
    log,
    String,
    str => str.length,
    log,
    square,
    log,
    remainder,
    log,
    getAnimal  // ← возвращаем Promise
  )),
  andThen(pipe(
    prop('result'),
    handleSuccess
  )),
  otherwise(handleError)
);


  const run = ifElse(validate, process, onError);
  run(value);
};

export default processSequence;
