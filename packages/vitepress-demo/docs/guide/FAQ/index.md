# 常见问题

## 什么是异步函数?

一个函数即使没有 async 关键字，如果它返回一个 Promise，我们也可以用它来处理异步操作，但它不是异步函数（在语言定义上）。
所以，只有用 async 定义的函数才是异步函数，它的返回值会被包装成 Promise（即使返回的是非 Promise 值，也会被包装成一个已解决或者已拒绝的 Promise）。
而一个普通函数如果返回 Promise，我们可以说它返回了一个 Promise，用于异步操作，但它本身不是异步函数（没有使用 async 定义）。

所以异步函数是一个统称, 按照规范来说, 只有一个函数标注了 `async` 后才是一个异步函数, 普通函数返回一个 `Promise` 不能够标准的称为是异步函数, 只是比较笼统的叫法。

::: details 查看代码

```js
// ✅ 异步函数的标志​​：函数声明前的 async 关键字
const fn = async () => {
  return 666;
};
async function fn() {
  return 666;
}

// ❌ ​​非标志​​：返回值是否为 Promise（普通函数也可返回 Promise）
const fn = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(666);
    }, 1500);
  });
};
async function fn() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(666);
    }, 1500);
  });
}
```

:::

## 贡献者 :shamrock:

<Team />