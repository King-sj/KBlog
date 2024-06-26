---
lang: zh-CN
date: 2023-07-09
category:
  - 数学
tag:
  - 公理系统
---

# 「算术公理系统 1」自然数

假设存在一个算数系统的模型满足 Peano 公理，即假定 Peano 公理相容，在此承认次假设的基础之上，我们即可建立如今最常用的**算术公理系统**。**自然数的定义**则是构建此算术公理系统的第一步。
<!-- more -->

## 自然数的定义

先介绍 Peano 公理，共有五条：

1. $0$ 是自然数；
2. 任何自然数的后继存在且唯一，下文用 $\operatorname{suc}(n)$ 表示 $n$ 的后继；
3. $0$ 不是任何自然数的后继；
4. 不同的自然数后继不同；
5. $p(n)$ 是关于自然数 $n$ 的一个命题，且满足两个条件：
	- $p(0)$ 是真命题；
	- 由 $p(n)$ 为真命题可以推理出 $p(\operatorname{suc}(n))$ 为真命题。

	则有，对于任意自然数 $n$，$p(n)$ 为真命题。

这样就定义了自然数，自然数这个新的数学对象因我们的假设而确立。

## 自然数的加法运算

自然数中最重要的运算当然是**加法**。

### 加法的定义

定义加法的运算规则：

1. 若 $n$ 是自然数，则 $0+n$ 的运算结果为 $n$，即 $0+n=n$；
2. 若 $n,m$ 都是自然数，则 $\operatorname{suc}(m)+n=\operatorname{suc}(m+n)$。

下面我们需要证明对于任意两个自然数，都可以进行加法运算，也就是说，我们需要证明加法结果的存在性和唯一性。

#### 加法结果的存在性

$n$ 是任意自然数，记 $p_n(m)$ 表示 $m+n$ 是否是自然数，即 $m+n$ 是否存在。

$n$ 是自然数，由加法运算规则 Ⅰ 有 $0+n=n$，进而有 $0+n$ 是自然数；
**即 $p_n(0)$ 得证。**

$m$ 和 $m+n$ 是自然数，由 Peano 公理 Ⅱ 有 $\operatorname{suc}(m)$ 和 $\operatorname{suc}(m+n)$ 是自然数；
根据加法运算规则 Ⅱ 有 $\operatorname{suc}(m)+n=\operatorname{suc}(m+n)$，进有 $\operatorname{suc}(m)+n$ 是自然数；
综上所述，若 $m+n$ 是自然数，则 $\operatorname{suc}(m)+n$ 也是自然数；
**即由 $p_n(m)$ 为真命题可以推出 $p_n(\operatorname{suc}(m))$ 为真命题。**

由 $p_n(m)$ 的性质和 Peano 公理 Ⅴ 有，对于任意自然数 $m$，$p_n(m)$ 成立，即 $m+n$ 是自然数，再根据 $n$ 的任意性，得出对于任意自然数 $n,m$，$m+n$ 都是自然数。

#### 加法结果的唯一性

$n$ 是任意自然数，记 $p_n(m)$ 表示 $m+n$ 是否唯一，即 $m+n$ 的结果是否唯一。

$n$ 是自然数，由加法运算规则 Ⅰ 有 $0+n=n$，进而 $0+n$ 是唯一的，就是 $n$；
**即 $p_n(0)$ 得证。**

$m$ 是自然数，$m+n$ 是唯一的，由 Peano 公理 Ⅱ 有 $\operatorname{suc}(m)$ 是自然数且 $\operatorname{suc}(m+n)$ 唯一；
根据加法运算规则 Ⅱ 有 $\operatorname{suc}(m)+n=\operatorname{suc}(m+n)$，进有 $\operatorname{suc}(m)+n$ 唯一；
综上所述，若 $m+n$ 唯一，则 $\operatorname{suc}(m)+n$ 也唯一；
**即由 $p_n(m)$ 为真命题可以推出 $p_n(\operatorname{suc}(m))$ 为真命题。**

由 $p_n(m)$ 的性质和 Peano 公理 Ⅴ 有，对于任意自然数 $m$，$p_n(m)$ 成立，即 $m+n$ 唯一，再根据 $n$ 的任意性，得出对于任意自然数 $n,m$，$m+n$ 都是唯一的。

### 加法的性质

在明确证明了自然数加法运算的良好性质，即任意两个自然数都可以进行加法运算，且加法运算的结果存在且唯一之后，我们终于可以对自然数加法的性质进行进一步的探索。

#### 加法交换律

下面证明加法交换律，即对于任意自然数 $n,m$，有 $n+m=m+n$。

直接证明比较困难，考虑从加法运算的定义下手，即先证明加法的两条运算规则符合交换律。

试证 $0+n=n=n+0$，首先有

$$
\begin{aligned}
0+0&=0\quad&\#\text{加法运算规则 Ⅰ}\\
&=0+0\quad&\#\text{加法运算规则 Ⅰ}
\end{aligned}
$$

进而当 $n$ 是自然数且 $0+n=n=n+0$ 时有

$$
\begin{aligned}
0+\operatorname{suc}(n)&=\operatorname{suc}(n)\quad&\#\text{加法运算规则 Ⅰ}\\
&=\operatorname{suc}(n+0)\quad&\#\text{$n=n+0$}\\
&=\operatorname{suc}(n)+0\quad&\#\text{加法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $0+n=n=n+0$ 对任意自然数 $n$ 成立。

试证 $m+\operatorname{suc}(n)=\operatorname{suc}(m+n)=\operatorname{suc}(m)+n$，首先有

$$
\begin{aligned}
0+\operatorname{suc}(n)&=\operatorname{suc}(n)\quad&\#\text{加法运算规则 Ⅰ}\\
&=\operatorname{suc}(0+n)\quad&\#\text{加法运算规则 Ⅰ}\\
&=\operatorname{suc}(0)+n\quad&\#\text{加法运算规则 Ⅱ}
\end{aligned}
$$

进而当 $m$ 是自然数且 $m+\operatorname{suc}(n)=\operatorname{suc}(m+n)=\operatorname{suc}(m)+n$ 时有

$$
\begin{aligned}
\operatorname{suc}(m)+\operatorname{suc}(n)&=\operatorname{suc}(m+\operatorname{suc}(n))\quad&\#\text{加法运算规则 Ⅱ}\\
&=\operatorname{suc}(\operatorname{suc}(m+n))\quad&\#\text{$m+\operatorname{suc}(n)=\operatorname{suc}(m+n)$}\\
&=\operatorname{suc}(\operatorname{suc}(m)+n)\quad&\#\text{$\operatorname{suc}(m+n)=\operatorname{suc}(m)+n$}\\
&=\operatorname{suc}(\operatorname{suc}(m))+n\quad&\#\text{加法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $m+\operatorname{suc}(n)=\operatorname{suc}(m+n)=\operatorname{suc}(m)+n$ 对任意自然数 $n,m$ 成立，将其称为新的**加法运算规则 Ⅱ**。

证明了加法运算规则的交换律之后，试证加法交换律 $n+m=m+n$，首先由加法运算规则 Ⅰ 有 $0+m=m+0$，进而当 $n$ 是自然数且 $n+m=m+n$ 时，有

$$
\begin{aligned}
\operatorname{suc}(n)+m&=\operatorname{suc}(n+m)\quad&\#\text{加法运算规则 Ⅱ}\\
&=\operatorname{suc}(m+n)\quad&\#\text{$n+m=m+n$}\\
&=m+\operatorname{suc}(n)\quad&\#\text{加法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $n+m=m+n$ 对任意自然数 $n,m$ 成立，即加法交换律成立。

#### 加法结合律

下面证明加法结合律，即对于任意自然数 $a,b,c$，有 $(a+b)+c=a+(b+c)$。

首先当 $c=0$ 时，有

$$
\begin{aligned}
(a+b)+c&=(a+b)+0\quad&\#\text{$c=0$}\\
&=a+b\quad&\#\text{加法运算规则 Ⅰ}\\
&=a+(b+0)\quad&\#\text{加法运算规则 Ⅰ}\\
&=a+(b+c)\quad&\#\text{$c=0$}
\end{aligned}
$$

进而当 $c$ 为自然数且 $(a+b)+c=a+(b+c)$ 时有

$$
\begin{aligned}
(a+b)+\operatorname{suc}(c)&=\operatorname{suc}((a+b)+c)\quad&\#\text{加法运算规则 Ⅱ}\\
&=\operatorname{suc}(a+(b+c))\quad&\#\text{$(a+b)+c=a+(b+c)$}\\
&=a+\operatorname{suc}(b+c)\quad&\#\text{加法运算规则 Ⅱ}\\
&=a+(b+\operatorname{suc}(c))\quad&\#\text{加法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $(a+b)+c=a+(b+c)$ 对任意自然数 $a,b,c$ 成立，即加法结合律成立。

#### 加法消去律

下面证明加法消去律，即对于任意自然数 $a,b,c$，有 $a+c=b+c\Leftrightarrow a=b$。

试证 $a=b\Rightarrow a+c=b+c$。

首先当 $c=0$ 时有

$$
\begin{aligned}
a+c&=a+0\quad&\#\text{$c=0$}\\
&=a\quad&\#\text{加法运算规则 Ⅰ}\\
&=b\quad&\#\text{$a=b$}\\
&=b+0\quad&\#\text{加法运算规则 Ⅰ}\\
&=b+c\quad&\#\text{$c=0$}
\end{aligned}
$$

进而当 $c$ 为自然数且 $a=b\Rightarrow a+c=b+c$ 时有

$$
\begin{aligned}
a+\operatorname{suc}(c)&=\operatorname{suc}(a+c)\quad&\#\text{加法运算规则 Ⅱ}\\
&=\operatorname{suc}(b+c)\quad&\#\text{$a=b\Rightarrow a+c=b+c$}\\
&=b+\operatorname{suc}(c)\quad&\#\text{加法运算规则 Ⅱ}
\end{aligned}
$$

即 $a=b\Rightarrow a+c=b+c\Rightarrow a+\operatorname{suc}(c)=b+\operatorname{suc}(c)$，根据 Peano 公理 Ⅴ，得知 $a=b\Rightarrow a+c=b+c$ 对任意自然数 $a,b,c$ 成立。

试证 $a+c=b+c\Rightarrow a=b$。

首先当 $c=0$ 时有

$$
\begin{aligned}
a&=a+0\quad&\#\text{加法运算规则 Ⅰ}\\
&=a+c\quad&\#\text{$c=0$}\\
&=b+c\quad&\#\text{$a+c=b+c$}\\
&=b+0\quad&\#\text{$c=0$}\\
&=b\quad&\#\text{加法运算规则 Ⅰ}
\end{aligned}
$$

进而当 $c$ 为自然数且 $a+c=b+c\Rightarrow a=b$ 时有

$$
\begin{aligned}
a+\operatorname{suc}(c)&=b+\operatorname{suc}(c)\quad&\#\text{已知条件}\\
\operatorname{suc}(a+c)&=\operatorname{suc}(b+c)\quad&\#\text{加法运算规则 Ⅱ}\\
a+c&=b+c\quad&\#\text{Peano 公理 Ⅳ}\\
a&=b\quad&\#\text{$a+c=b+c\Rightarrow a=b$}
\end{aligned}
$$

即 $a+\operatorname{suc}(c)=b+\operatorname{suc}(c)\Rightarrow a+c=b+c\Rightarrow a=b$，根据 Peano 公理 Ⅴ，得知 $a+c=b+c\Rightarrow a=b$ 对任意自然数 $a,b,c$ 成立。

综上所述，加法消去律 $a+c=b+c\Leftrightarrow a=b$，对任意自然数 $a,b,c$ 成立。

## 自然数的序

自然数的序为两个自然数的关系。

### 序的定义

定义自然数的序即定义 $n\leq m$ 当且仅当存在自然数 $x$ 满足 $n=m+x$。定义 $n<m$ 当且仅当 $n\leq m$ 且 $n\neq m$。

自然数的序是全序关系，它应该具有反对称性、传递性和完全性。

### 正自然数

在考察序的性质之前，我们预先准备以方便证明。

定义正自然数为非 $0$ 自然数。

#### 正自然数的性质

正自然数与自然数相加为正自然数，即对于正自然数 $a$，其与自然数 $b$ 的和 $a+b$ 为正自然数。

首先，当 $b=0$ 时，$a+0=a$ 为正自然数。

进而当 $b$ 为自然数且 $a+b$ 为正自然数时有 $a+\operatorname{suc}(b)=\operatorname{suc}(a+b)$，根据 Peano 公理 Ⅲ，$\operatorname{suc}(a+b)$ 为正自然数，进而 $a+\operatorname{suc}(b)$ 为正自然数。

根据 Peano 公理 Ⅴ，正自然数与自然数相加为正自然数。

### 序的反对称性

若 $a\leq b$ 且 $b\leq a$，则 $a=b$。

由 $a\leq b$ 有 $b=a+m_1$，由 $b\leq a$ 有 $a=b+m_2$。

因此 $0+a=a=b+m_2=a+m_1+m_2$，由加法消去律得到 $m_1+m_2=0$，根据正自然数的性质得出 $m_1=m_2=0$，因此 $a=a+0=a+m_1=b$。

### 序的传递性

若 $a\leq b$ 且 $b\leq c$，则 $a\leq c$。

由 $a\leq b$ 有 $b=a+m_1$，由 $b\leq c$ 有 $c=b+m_2$。

根据加法结果的存在性得到 $m_1+m_2$ 是自然数，根据加法结合律得出 $c=b+m_2=(a+m_1)+m_2=a+(m_1+m_2)$，进而 $a\leq c$。

### 序的完全性

任意两个自然数 $a,b$ 都有序关系。

对于 $a,b$ 两个自然数，当 $b=0$ 时有 $a=0+a=b+a$ 所以 $a\leq b$。

当 $b$ 为自然数时。若 $a=b$，则 $\operatorname{suc}(b)=a+\operatorname{suc}(0)$，因此 $a<\operatorname{suc}(b)$；若 $a<b$，则 $\operatorname{suc}(b)=b+\operatorname{suc}(0)=b+m+\operatorname{suc}(0)$，因此 $a<\operatorname{suc}(b)$；若 $a>b$，则 $a\geq\operatorname{suc}(b)$。

由 Peano 公理 Ⅴ 有任意两个自然数 $a,b$ 都有序关系。

### 加法保序性

若 $a\leq b$，则 $a+c\leq b+c$。

由 $a\leq b$ 有 $b=a+m$，进而 $b+c=(a+m)+c=a+m+c=(a+c)+m$ 因此 $a+c\leq b+c$。

## 自然数的乘法运算

自然数的乘法也十分重要。

### 乘法的定义

定义乘法的运算规则：

1. 若 $n$ 是自然数，则 $0\times n$ 的运算结果为 $0$，即 $0\times n=0$；
2. 若 $n,m$ 都是自然数，则 $\operatorname{suc}(m)\times n=m\times n+n$。

下面我们需要证明对于任意两个自然数，都可以进行乘法运算，也就是说，我们需要证明乘法结果的存在性和唯一性。

#### 乘法结果的存在性

$n$ 是任意自然数，记 $p_n(m)$ 表示 $m\times n$ 是否是自然数，即 $m\times n$ 是否存在。

$n$ 是自然数，由乘法运算规则 Ⅰ 有 $0\times n=0$，进而有 $0\times n$ 是自然数；
**即 $p_n(0)$ 得证。**

$n$ 和 $m\times n$ 是自然数，由加法结果的存在性有 $m\times n+n$ 存在；
根据乘法运算规则 Ⅱ 有 $\operatorname{suc}(m)\times n=m\times n+n$，进有 $\operatorname{suc}(m)\times n$ 是自然数；
综上所述，若 $m\times n$ 是自然数，则 $\operatorname{suc}(m)\times n$ 也是自然数；
**即由 $p_n(m)$ 为真命题可以推出 $p_n(\operatorname{suc}(m))$ 为真命题。**

由 $p_n(m)$ 的性质和 Peano 公理 Ⅴ 有，对于任意自然数 $m$，$p_n(m)$ 成立，即 $m\times n$ 是自然数，再根据 $n$ 的任意性，得出对于任意自然数 $n,m$，$m\times n$ 都是自然数。

#### 乘法结果的唯一性

$n$ 是任意自然数，记 $p_n(m)$ 表示 $m\times n$ 是否唯一，即 $m\times n$ 的结果是否唯一。

$n$ 是自然数，由乘法运算规则 Ⅰ 有 $0\times n=0$，进而 $0\times n$ 是唯一的，就是 $0$；
**即 $p_n(0)$ 得证。**

$m$ 是自然数，$m\times n$ 是唯一的，由加法结果的唯一性有 $m\times n+n$ 唯一；
根据乘法运算规则 Ⅱ 有 $\operatorname{suc}(m)\times n=m\times n+n$，进有 $\operatorname{suc}(m)\times n$ 唯一；
综上所述，若 $m\times n$ 唯一，则 $\operatorname{suc}(m)\times n$ 也唯一；
**即由 $p_n(m)$ 为真命题可以推出 $p_n(\operatorname{suc}(m))$ 为真命题。**

由 $p_n(m)$ 的性质和 Peano 公理 Ⅴ 有，对于任意自然数 $m$，$p_n(m)$ 成立，即 $m\times n$ 唯一，再根据 $n$ 的任意性，得出对于任意自然数 $n,m$，$m\times n$ 都是唯一的。

### 乘法的性质

在明确证明了自然数乘法运算的良好性质，即任意两个自然数都可以进行乘法运算，且乘法运算的结果存在且唯一之后，我们终于可以对自然数乘法的性质进行进一步的探索。

#### 乘法交换律

下面证明乘法交换律，即对于任意自然数 $n,m$，有 $n\times m=m\times n$。

直接证明比较困难，考虑从乘法运算的定义下手，即先证明乘法的两条运算规则符合交换律。

试证 $0\times n=0=n\times 0$。

首先有 $0\times 0=0=0\times 0$。

进而当 $n$ 是自然数且 $0\times n=0=n\times 0$ 时有

$$
\begin{aligned}
0\times \operatorname{suc}(n)&=0\quad&\#\text{乘法运算规则 Ⅰ}\\
&=n\times 0\quad&\#\text{$0=n\times 0$}\\
&=n\times 0+0\quad&\#\text{加法运算规则 Ⅰ}\\
&=\operatorname{suc}(n)\times 0\quad&\#\text{乘法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $0\times n=0=n\times 0$ 对任意自然数 $n$ 成立。

试证 $m\times\operatorname{suc}(n)=m\times n+m$。

首先 $m=0$ 时有

$$
\begin{aligned}
m\times\operatorname{suc}(n)&=0\times\operatorname{suc}(n)\quad&\#\text{$m=0$}\\
&=0\quad&\#\text{乘法运算规则 Ⅰ}\\
&=0\times n\quad&\#\text{乘法运算规则 Ⅰ}\\
&=0\times n+0\quad&\#\text{加法运算规则 Ⅰ}\\
&=m\times n+m\quad&\#\text{$m=0$}
\end{aligned}
$$

进而当 $m$ 是自然数且 $m\times\operatorname{suc}(n)=m\times n+m$ 时有

$$
\begin{aligned}
\operatorname{suc}(m)\times\operatorname{suc}(n)&=m\times\operatorname{suc}(n)+\operatorname{suc}(n)\quad&\#\text{乘法运算规则 Ⅱ}\\
&=m\times n+m+\operatorname{suc}(n)\quad&\#\text{$m\times n+m$}\\
&=m\times n+\operatorname{suc}(m)+n\quad&\#\text{加法运算规则 Ⅱ}\\
&=m\times n+n+\operatorname{suc}(m)\quad&\#\text{加法交换律}\\
&=\operatorname{suc}(m)\times n+\operatorname{suc}(m)\quad&\#\text{乘法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $m\times\operatorname{suc}(n)=m\times n+m$ 对任意自然数 $n,m$ 成立，将其称为新的**乘法运算规则 Ⅱ**。

证明了乘法运算规则的交换律之后，试证乘法交换律 $n\times m=m\times n$，首先当 $n=0$ 时由乘法运算规则 Ⅰ 有 $0\times m=m\times 0$。

进而当 $n$ 是自然数且 $n\times m=m\times n$ 时，有

$$
\begin{aligned}
\operatorname{suc}(n)\times m&=n\times m+m\quad&\#\text{乘法运算规则 Ⅱ}\\
&=m\times n+m\quad&\#\text{$n\times m=m\times n$}\\
&=m\times\operatorname{suc}(n)\quad&\#\text{乘法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $n\times m=m\times n$ 对任意自然数 $n,m$ 成立，即乘法交换律成立。

#### 乘法分配律

下面证明乘法分配律，即对于任意自然数 $a,b,n$，有 $n\times (a+b)=n\times a+n\times b$。

首先当 $n=0$ 时，$n\times(a+b)=0\times(a+b)=0=0+0=0\times a+0\times b=n\times a+n\times b$，进而当 $n$ 为自然数且 $n\times(a+b)=n\times a+n\times b$ 时有

$$
\begin{aligned}
\operatorname{suc}(n)\times(a+b)&=n\times(a+b)+(a+b)\quad&\#\text{乘法运算规则 Ⅱ}\\
&=n\times a+n\times b+(a+b)\quad&\#\text{$n\times(a+b)=n\times a+n\times b$}\\
&=n\times a+n\times b+a+b\quad&\#\text{加法结合律}\\
&=n\times a+a+n\times b+b\quad&\#\text{加法交换律}\\
&=(n\times a+a)+(n\times b+b)\quad&\#\text{加法结合律}\\
&=\operatorname{suc}(n)\times a+\operatorname{suc}(n)\times b\quad&\#\text{乘法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $n\times(a+b)=n\times a+n\times b$ 对任意自然数 $n,a,b$ 成立，即乘法分配律成立。

#### 乘法结合律

下面证明乘法结合律，即对于任意自然数 $a,b,c$，有 $(a\times b)\times c=a\times (b\times c)$。

首先当 $c=0$ 时，有 $(a\times b)\times c=(a\times b)\times 0=0=a\times 0=a\times (b\times 0)=a\times (b\times c)$。

进而当 $c$ 为自然数且 $(a\times b)\times c=a\times(b\times c)$ 时有

$$
\begin{aligned}
(a\times b)\times\operatorname{suc}(c)&=(a\times b)\times c+a\times b\quad&\#\text{乘法运算规则 Ⅱ}\\
&=a\times(b\times c)+a\times b\quad&\#\text{$(a\times b)\times c=a\times(b\times c)$}\\
&=a\times(b\times c+b)\quad&\#\text{乘法分配律}\\
&=a\times(b\times\operatorname{suc}(c))\quad&\#\text{乘法运算规则 Ⅱ}
\end{aligned}
$$

根据 Peano 公理 Ⅴ，得知 $(a\times b)\times c=a\times(b\times c)$ 对任意自然数 $a,b,c$ 成立，即乘法结合律成立。

#### 乘法消去律

下面证明乘法消去律，即对于任意自然数 $a,b$ 和 $c$，有 $a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)\Leftrightarrow a=b$。

试证 $a=b\Rightarrow a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)$。

首先当 $c=0$ 时有

$$
\begin{aligned}
a\times\operatorname{suc}(c)&=a\times\operatorname{suc}(0)\quad&\#\text{$c=0$}\\
&=a\times 0+a\quad&\#\text{乘法运算规则 Ⅱ}\\
&=0+a\quad&\#\text{乘法运算规则 Ⅰ}\\
&=a\quad&\#\text{加法运算规则 Ⅰ}\\
&=b\quad&\#\text{$a=b$}\\
&=0+b\quad&\#\text{加法运算规则 Ⅰ}\\
&=b\times 0+b\quad&\#\text{乘法运算规则 Ⅰ}\\
&=b\times\operatorname{suc}(0)\quad&\#\text{乘法运算规则 Ⅱ}\\
&=b\times\operatorname{suc}(c)\quad&\#\text{$c=0$}
\end{aligned}
$$

进而当 $c$ 为自然数且 $a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)$ 时有

$$
\begin{aligned}
a\times\operatorname{suc}(\operatorname{suc}(c))&=a\times\operatorname{suc}(c)+a\quad&\#\text{乘法运算规则 Ⅱ}\\
&=b\times\operatorname{suc}(c)+b\quad&\#\text{$a=b$ 且 $a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)$}\\
&=b\times\operatorname{suc}(\operatorname{suc}(c))\quad&\#\text{乘法运算规则 Ⅱ}
\end{aligned}
$$

即 $a=b\Rightarrow a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)\Rightarrow a\times\operatorname{suc}(\operatorname{suc}(c))=b\times\operatorname{suc}(\operatorname{suc}(c))$，根据 Peano 公理 Ⅴ，得知 $a=b\Rightarrow a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)$ 对任意自然数 $a,b,c$ 成立。

试证 $a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)\Rightarrow a=b$，采用反证法，假设 $a\neq b$，则由加法运算规则 Ⅱ 可知 $a=b+m$ 或 $b=a+m$，其中 $m\neq 0$，不妨设 $a=b+m,m\neq 0$。

由 Peano 公理 Ⅲ 有 $\operatorname{suc}(c)\neq 0$。

由 Peano 公理 Ⅲ、Ⅳ 有，任意非零自然数 $c$ 都有唯一的数 $x$ 满足 $\operatorname{suc}(x)=c$，不妨记作 $\operatorname{pre}(c)=x$。

若有 $a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)$，则有

$$
\begin{aligned}
a\times\operatorname{suc}(c)&=b\times\operatorname{suc}(c)\quad&\#\text{已知条件}\\
(b+m)\times\operatorname{suc}(c)&=b\times\operatorname{suc}(c)\quad&\#\text{$a=b+m$}\\
b\times\operatorname{suc}(c)+m\times\operatorname{suc}(c)&=b\times\operatorname{suc}(c)\quad&\#\text{乘法交换律、乘法分配律}\\
m\times\operatorname{suc}(c)&=0\quad&\#\text{加法消去律}\\
m\times c+m&=0\quad&\#\text{乘法运算规则 Ⅱ}\\
m\times c+\operatorname{suc}(\operatorname{pre}(m))&=0\quad&\#\text{$m\neq 0$、$m=\operatorname{suc}(\operatorname{pre}(m))$}\\
\operatorname{suc}(m\times c+\operatorname{pre}(m))&=0\quad&\#\text{加法运算规则 Ⅱ}
\end{aligned}
$$

上述等式表明 $0$ 是 $m\times c+\operatorname{pre}(m)$ 的后继，这违背了 Peano 公理 Ⅲ，由此知道假设不成立，即 $a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)\Rightarrow a=b$。

综上所述，乘法消去律 $a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)\Leftrightarrow a=b$，对任意自然数 $a,b,c$ 成立。

## Peano 公理的合理性

通过上述步骤，我们成功地由 Peano 公理构建出了一个自然数代数系统。但 Peano 公理自身任有待研究。从上述步骤中我们看出 Peano 公理每一条公理都被使用过，少了任何一条都不足以构建出上述的自然数系统，这究竟是为什么呢？

下面我将阐述为什么每条公理都是必须的，通过举反例的方式。研究 Peano 公理自然不能从 Peano 公理系统内出发，我们将借助另一个公理系统——图论。


### 乘法保序性

若 $a\leq b$，则 $a\times\operatorname{suc}(c)\leq b\times\operatorname{suc}(c)$。

由 $a\leq b$ 有 $b=a+m$，进而 $b\times\operatorname{suc}(c)=(a+m)\times\operatorname{suc}(c)=a\times\operatorname{suc}(c)+m\times\operatorname{suc}(c)$ 因此 $a\times\operatorname{suc}(c)\leq b\times\operatorname{suc}(c)$。

### 乘法消去保序性

若 $a\times\operatorname{suc}(c)\leq b\times\operatorname{suc}(c)$，则 $a\leq b$。

采用反证法，假设 $a>b$，则存在正自然数 $m$ 满足 $a=b+m$，有

$$a\times\operatorname{suc}(c)=(b+m)\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)+m\times\operatorname{suc}(c)$$

由此有 $b\times\operatorname{suc}(c)\leq a\times\operatorname{suc}(c)$，根据序的反对称性有 $a\times\operatorname{suc}(c)=b\times\operatorname{suc}(c)$，根据乘法消去律有 $a=b$，这与 $a>b$ 的假设矛盾，因此假设不成立，即证明了乘法消去的保序性。

### 用图论阐述 Peano 系统

自然数与有向图 $\rm{G}(\rm{V},\rm{E})$ 同构，这个图满足如下性质：

1. 存在点 $0$，即 $v_0\in\rm{V}$；
2. 所有点的出度为 $1$，即 $\operatorname{outDeg}(v)=1$；
3. 点 $0$ 入度为 $0$，即 $\operatorname{inDeg}(v_0)=0$；
4. 任意点的入度小于等于 $1$，即 $\operatorname{inDeg}(v)\leq 1$；
5. 存在从 $0$ 到任意点的路径，即 $\exists\operatorname{path}(0,v)$。

下面我们试着通过**删除公理**的方法来寻找反例。

#### Peano 公理 Ⅰ

若去除，则允许不存在 $0$，可以构造出空集自然数系统。

#### Peano 公理 Ⅱ

若去除，则对点的出度无规定，可以构造出菊花图自然数系统。

#### Peano 公理 Ⅲ

若去除，则对 $0$ 的入度无规定，可以构造出环状自然数系统。

#### Peano 公理 Ⅳ

若去除，则对一个数可以是多个数的后继，可以构造出 $\rho$ 状自然数系统。

#### Peano 公理 Ⅴ

若去除，则对连通性无要求，可以构造出分段状自然数系统。
