# ECMAScript modules

ECMAScript 모듈(이하 ESM)은 자바스크립트 코드를 재사용하기 위해 패키지화하는 공식 표준입니다.
모듈은 import, export statement를 통해 정의됩니다.

```js
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```

```js
// app.mjs
import { addTwo } from "./addTwo.mjs";

// Prints: 6
console.log(addTwo(4));
```

Node.js는 현재 지정된 대로 ESM을 완벽하게 지원하며 모듈과 원래 모듈 형식인 CommonJS 간의 호환성을 제공합니다.

## Enabling

어떻게 가능하냐구요?

Node.js는 자바스크립트 코드를 기본적으로 CommonJS 로 삼고 있기 때문에, 우리가 Node.js에게 `.mjs` 확장자인 파일들을 ESM으로 인식하라고 말해줘야 합니다.
`package.json`의 `"type"` 필드를 통해서요.

JavaScript code를

Node.js treats JavaScript code as CommonJS modules by default. Authors can tell Node.js to treat JavaScript code as ECMAScript modules via the .mjs file extension, the package.json "type" field, or the --input-type flag. See Modules: Packages for more details.
