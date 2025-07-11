import { allPass, prop, equals, compose, propEq, countBy, any, toPairs, values, identity, complement } from 'ramda'

const getStar = prop('star');
const getTriangle = prop('triangle');
const getSquare = prop('square');
const getCircle = prop('circle');
const isWhite = equals('white')
const isGreen = equals('green')
const isRed = equals('red')
const isBlue = equals('blue')
const isOrange = equals('orange')
const isNotRed = complement(isRed)
const isNotWhite = complement(isWhite)
const isWhiteTriangle = compose(isWhite, getTriangle);
const isWhiteCircle = compose(isWhite, getCircle);
const isRedStar = compose(isRed, getStar);
const isGreenTriangle = compose(isGreen, getTriangle);
const isBlueCircle = compose(isBlue, getCircle)
const isOrangeSquare = compose(isOrange, getSquare)
const isNotRedStar = compose(isNotRed, getStar);
const isNotWhiteStar = compose(isNotWhite, getStar);
const isGreenSquare = compose(isGreen, getSquare);

const numberOfColors = compose(countBy(identity), values);


const isRedBlueEqual = compose(
  ({ red , blue }) => red === blue,
  numberOfColors
);

const atLeastTwoGreen = compose(
    ({ green = 0 }) => green >= 2,
    numberOfColors
);

const onlyTwoGreen  = compose(
    ({ green = 0 }) => green === 2,
    numberOfColors
);

const onlyOneRed  = compose(
    ({ red = 0 }) => red === 1,
    numberOfColors
);

const allHasColor = color => compose(propEq(color, 4), numberOfColors);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isWhiteTriangle, isWhiteCircle, isRedStar, isGreenSquare])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = atLeastTwoGreen;

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = isRedBlueEqual;
// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isOrangeSquare, isRedStar, isBlueCircle])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
  any(
    ([color, count]) =>
      color !== 'white' && count >= 3
  ),
  toPairs,
  numberOfColors
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([onlyOneRed, onlyTwoGreen, isGreenTriangle])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allHasColor('orange');

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar])

// 9. Все фигуры зеленые.
export const validateFieldN9 = allHasColor('green');

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  colors => prop('triangle', colors) === prop('square', colors),

  compose(isNotWhite, prop('triangle'))
]);

