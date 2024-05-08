---
lang: zh-CN
title: 页面的标题
description: 页面的描述
date: 2023-08-02
category:
  - OI
tag:
  - MODInt
archive: true
---

# 「泛型与 OI」modint

在 OI 中，有大量的题目要求对一些数字取模，这便是本文写作的背景。

## 背景介绍

这些题目要么是因为答案太大，不方便输出结果，例如许多计数 dp；要么是因为答案是浮点数，出题人不愿意写一个确定精度的 Special Judge，例如很多期望概率题；要么是因为这道题目直接考察了模的性质和运用，比如大量的 998244353 类的多项式题目。

## 过去的做法

在这种要求之下，取模运算就成为了编程中不可缺少的一部分。下面以式子 $\texttt{ans}=(x+y+z)\times u$ 为例介绍几种写法。

### 第一种 直接取模

这种方法是直接取模，简单直接，清晰明了。

```cpp
constexpr int p=998244353;

int ans=1ll*(((x+y)%p+z)%p)*u%p;
```

但是这种方法有着严重的缺陷，一是容易忘记大括号，二是容易中间运算时搞错运算顺序、忘记取模，三是式子太长、括号太多、不易检验。

因此，不推荐运用这种方法。

### 第二种 函数取模

这种方法有效地解决了直接取模的忘记取模的漏洞。

```cpp
constexpr int p=998244353;

int add(int a,int b){
	return a+b>=p?a+b-p:a+b;
}

int sub(int a,int b){
	return a<b?a-b+p:a-b;
}

int mul(int a,int b){
	return 1ll*a*b%p;
}

int ans=mul(add(add(x,y),z),u);
```

但是，这种写法的式子依旧太长，不易检验，并且如果编译器没有任何优化（现在不存在这种情况了）的话，大量的函数调用将会耗费不少的时间。并且如果要对多个模数取模，则需要写多个函数，显得代码冗长。

## 泛型编程

考虑到函数取模的优点，我们不妨通过类的运算符重载来进一步优化 `add` 等函数。

同时为了解决多个模数的问题，我们考虑泛型编程，将模数直接包含在类型中。

```cpp
template<typename T,const T p>
class modint{
	private:
		T v;
	public:
		modint(){}
		modint(const T& x){assert(0<=x&&x<p);v=x;}
		modint operator+(const modint& a)const{
			return v+a.v>=p?v+a.v-p:v+a.v;
		}
		modint operator-(const modint& a)const{
			return v<a.v?v-a.v+p:v-a.v;
		}
		modint operator*(const modint& a)const{
			return 1ll*v*a.v%p;
		}
		T operator()(void)const{
			return v;
		}
};

modint<int,998244353> x(),y(),z(),u();
modint<int,998244353> ans=(x+y+z)*u;
```

这样使用的时候，一方面减少了心智负担，不用操心运算时忘记取模；另一方面采取了常数更小的加减法操作，运算更快。

唯一的缺点就是类型名难写，但是模数个数少的时候可以缩写，即写成：

```cpp
typedef modint<int,998244353> modInt1;
```

这样就解决了类型名长的缺点。