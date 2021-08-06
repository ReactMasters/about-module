# What is module

## 단어의 뜻

> one of a set of separate parts that, when combined, form a complete whole - cambridge dict.

module 이란 하나의 거대한 완전체를 구성하는 분리된 파츠들의 집합입니다.
즉, 구성품 조합이 모듈입니다.

## 프로그래밍에서 module

프로그래밍에서는 프로그램을 기능할 수 있는 작은 요소들로 쪼개어 사용하는 것을 Modular programming이라 하고 그 작은 조각들을 module이라 합니다. 이렇게 함으로 써 각각 역할을 분리 시키고, 재사용성을 높일 수 있습니다.

## JavaScript, Node.js의 모듈들

브라우저 상에서 동작하는 JavaScript였기에 여러개의 스크립트 태그는 글로벌 스코프를 공유하게 되어 변수명에 유의하지 않는 이상 잦은 버그의 원인이 되었습니다.

자바스크립트를 브라우저 외의 환경에서 쓰고자 하는 움직임 덕에 모듈의 필요성이 커졌고, node.js는 등장하며 CommonJS모듈을 채택했습니다.

### 1. CJS (CommonJS)

CommonJS 그룹에서 만들었습니다.
그룹 이름이 Common인 이유가 JavaScript를 브라우저에서뿐만 아니라 범용 언어로 사용할 수 있도록 하려는 취지를 가졌기 때문입니다.
CommonJS는 동기적으로 작동합니다.

아래처럼 씁니다.

```js
const math = require("./math.js");

module.exports = {
  sum: math.sum,
};
```

대표적으로 Node.js는 기본 CJS를 채택하고 있습니다.

### 2. AMD (Asynchronous Module Definition)

CommonJS는 동기적이라서 브라우저 환경에서는 모듈이 다 다운 받기 전까지 다음 라인의 코드를 실행하지 못하는 단점이 있습니다.
AMD는 비동기적인 상황에서 모듈을 사용하기 위해 CommonJS그룹과 합의하지 못하고 독립한 그룹입니다.
CommonJS는 보다 서버 사이드 자바스크립트르 중점에 두었고 AMD는 클라이언트 사이드 (브라우저)에 더 중점을 뒀습니다.

아래처럼 씁니다.
특이한 것은 모듈을 가져온 다음, 콜백 함수에서 해당 모듈을 쓰는 것입니다.

```js
// 모듈의 정의 : 의존적인 모듈을 첫번째 파라미터로 배열로 전달합니다. 그 뒤 해당 모듈을 콜백함수로 정의합니다.

// js/sum.js
define(["js/math"], function (math) {
  return {
    sum: math.sum,
  };
});

// 모듈 가져다 쓰기

// js/cal.js
require("js/sum.js", function (sum) {
  console.log(sum(3, 4));
});
```

공식적으로 브라우저가 지원하지 않기에, 쓰고자 한다면 `RequireJS`같은 모듈 로더를 이용해야 합니다.

### 3. ESM (ECMAScript Module)

우리에게 가장 친숙한, ES6 부터 명세에 포함된 모듈, 표준입니다. 거의 모든 모던 브라우저가 지원하고 있습니다. (모듈 로더 없이 바로 쓸 수 있다는 말입니다.)

모양새

```js
// sum.js
import math from "./math.js";

export const sum = math.sum;
export default { sum: math.sum };
```

단 브라우저에서 쓸 때는 script의 `type`속성에 `module`이라는 값을 넣어주어야 합니다.

```html
<script type="module" src="./sum.js"></script>
```

더 자세하게 다룰 것이지만, CJS가 모듈 래퍼로 감싸서 공급해주던 `require`, `__dirname`, `__filename`, `module`, `exports`등은 사용할 수 없습니다.

Node.js 는 기본적으로 CommonJS를 쓰지만 ESM도 지원합니다.
이렇게 실행할 수 있습니다. ESM을 쓰는 파일의 확장자는 `.mjs`여야 합니다.

```bash
node --experimental-modules ./src/esm-cjs/b.mjs
```

또한 CJS와 ESM간 interoperability(상호 운용성)을 지원합니다.
즉 CJS에서 ESM도 불러올 수 있고 반대도 됩니다.

#### ESM 에서 CJS 불러오기

```js
// a.js
const validator = require("validator");

module.exports = {
  isEmail: validator.isEmail,
};

// cjs-in-esm.mjs
import a from "./a.js";

console.log(a.isEmail("safdfds"));
console.log(a.isEmail("jegwan@naver.com"));

// 실행은 아래 처럼 플래그를 붙어야한다.
// node --experimental-modules ./src/esm-cjs/cjs-in-esm.mjs
```

#### CJS 에서 ESM 불러오기

```js
// b.mjs
import validator from "validator";

export const isDate = validator.isDate;
console.log(isDate("2018"));
console.log(isDate("2018-01-31"));

// esm-in-cjs.mjs
import("./b.mjs").then((b) => {
  console.log(b, b.isDate("2018-01-03"));
});

// 실행은 아래 처럼 플래그를 붙어야한다.
// node --experimental-modules ./src/esm-cjs/esm-in-cjs.mjs
```

# CommonJS module 과 Module Wrapper

Node.js module 시스템에서 각 파일은 별개의 모듈로 여겨집니다.

예를 들어서 다음 두 파일을 봐봅시다.

```js
// foo.js
const circle = require("./circle.js");

console.log(`The area of a circle of radius 4 is ${circle.area(4)}`);

// circle.js
const { PI } = Math;

exports.area = (r) => PI * r ** 2;
exports.circumference = (r) => 2 * PI * r;
```

foo.js는 같은 디렉토리에 있는 circle.js를 불러옵니다.
circle.js 는 `area`, `circumference` 함수를 export 하고 있습니다.
`exports`라는 특별한 객체의 프로퍼티로 함수나 객체가 export 되고 있습니다.

node.js의 하나의 함수로 모듈은 wrapping 되므로 모듈 안의 로컬 변수는 숨겨집니다.
이 예시에서는 `PI` 변수는 private이 됩니다.
이리 하여 각 모듈의 독립성(isolation)이 보장됩니다.

module.exports는 새로운 값으로 할당될 수도 있습니다.
모듈 시스템은 require('module')로 구현됩니다.

```js
const ms = require("module");
const a = new ms.Module();
a.exports = { c: "안녕?" };
```

## Accessing the main module

Node.js를 통해 파일이 직접 실행되면 require.main에 해당 파일의 모듈이 붙습니다. 이것은 파일 내부에서 파일이 Node.js를 통해 직접 실행되는지 아닌지를 다음 코드로 알 수 있다는 것입니다.

```js
require.main === module;
```

만약 `foo.js`가 `node foo.js`를 통해 직접 실행되면 위 표현식은 `true`를, 다른파일이 직접실행되고 `foo.js`는 require를 통해 불러온 모듈이라면 `false`를 리턴합니다.

그리고 module은 filename 프로퍼티를 제공하므로 현재 앱의 entry point는 `require.main.filename`으로 알 수 있습니다.

## Module Wrapper

**모듈의 코드를 실행하기 전에 Node.js는 이것을 하나의 함수 래퍼로 감싸게 됩니다.**
아주 중요한 표현입니다. 한번 더 음미해보세요 😋

```js
(function (exports, require, module, __filename, __dirname) {
  // Module code actually lives in here
});
```

이렇게 함으로써 Node.js는 다음을 달성하게 됩니다.

- 모듈에서 선언한 top-level variables가 global 스코프에 선언되는 것을 막습니다.
- 이것은 실제로는 모듈안에 제공되는 변수들을 글로벌 변수처럼 제공합니다. 예를 들면
  - 구현자(implementor)인 `module` 과 `exports`가 모듈 내부에서 값을 내보니기 위해 사용될 수 있습니다.
  - `__filename` 과 `_dirname` 같은 편한 변수들이 모듈의 절대 경로를 포함하게 됩니다.

다시 우리가 글로벌 변수처럼 썼던 애들을 바라봅시다.
이들은 결국 모듈래퍼에서 내려준 `argument` 였습니다.

```js
const c = require("./exports-test/c"); // require
exports.a = ""; // exports
module.exports.b = NaN; // module
console.log(__dirname, __filename); // __dirname, __filename
```

`__dirname` 테스트!

```js
// ./a.js
const b = require("./c/b");
b.log();
console.log(`a scope __dirname : ${__dirname}`);

// ./c/b.js
exports.log = () => console.log(`b scope __dirname : ${__dirname}`);
```

`node ./a.js` 를 하면 다음과 같이 출력됩니다.

```
b scope __dirname : /Users/user/Projects/about-module/module-test/c
a scope __dirname : /Users/user/Projects/about-module/module-test
```

네 가져온 파일 내부 `__dirname`과 상관없이 모듈 안에서 `__dirname`이 자신의 위치로 잘 보존되고 있음을 보여줍니다.

## `exports` 객체

`exports` 객체는 module.exports 를 가리키는 레퍼런스 입니다. 따라서 다음이 성립합니다.

```js
console.log(exports === module.exports); // true
```

## `module` 객체

현재 모듈을 가리키는 레퍼런스입니다.
특별히 `module.exports` 는 다른 곳에서 `require()` 로 부를 때 어떤 것들이 export 될지 가리킵니다.

## `require(id)` 함수

`id` : string, 모듈 이름이나 경로

모듈(`module.exports`, `exports`로 선언한), JSON, 로컬 파일을 불러오기 위해 쓰입니다. node_modules 로부터 가져올 수도 있습니다.
lcoal module()이나 json 파일은 상대 경로로 가져올 수 있습니다.
상대경로는 OS상관 없이 POSIX 스타일을 따릅니다. 따라서 Window에서도 Unix 시스템과 같은 방식으로 쓸 수 있습니다.

상대경로를 쓸 수 있는 이유는 현재 모듈의 `__dirname`을 참조할 수 있기 때문입니다.

몇가지 예시를 볼까요.

```js
// Importing a local module with a path relative to the `__dirname` or current
// working directory. (On Windows, this would resolve to .\path\myLocalModule.)
const myLocalModule = require("./path/myLocalModule");

// Importing a JSON file:
const jsonData = require("./path/filename.json");

// Importing a module from node_modules or Node.js built-in module:
const crypto = require("crypto");
```

### `require.cache`

모듈들이 필요할 때 여기에 캐싱됩니다. 이 객체의 키를 지우거나 밸류를 지우면, 다음 require는 모듈을 새로 로드해옵니다. 이것은 다시 로드하면 오류가 발생하는 native addon(C++로 쓰여진 Node.js에서 불러올 수 있는 모듈)에는 적용되지 않습니다.

해당 엔트리(require.cache)에 무언가를 추가하거나 대체하는 것도 가능합니다.

이 캐시는 네이티브 모듈(위의 native addon을 포함한, node의 네이티브 모듈)을 가져올 때 캐시에 이름이 있는지 체크하여 다시 불러오지 않습니다.
`node:`로 prefix로 붙여져 불러올 때만 빼구요.
