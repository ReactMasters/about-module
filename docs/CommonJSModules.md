# Modules: CommonJS modules

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

### POSIX(포직스, /ˈpɒzɪks/)

이식 가능 운영 체제 인터페이스(portable operating system interface, 마지막 x는 unix의 약자로 붙였다)의 약자로, 서로 다른 UNIX OS의 공통 API를 정리하여 이식성이 높은 유닉스 응용 프로그램을 개발하기 위한 목적으로 IEEE가 책정한 애플리케이션 인터페이스 규격이다.

한마디로 UNIX 시스템의 표준 인터페이스입니다.

## `module` 객체 - 더 자세히

In each module, the module free variable is a reference to the object representing the current module. For convenience, module.exports is also accessible via the exports module-global. module is not actually a global but rather local to each module.
