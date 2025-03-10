# GCD、EXGCD

## GCD
$gcd(a,b)=gcd(b,a\%b)$

证明:
$$
设a=bq+r=bq+a\%b\\
a\%b=a-bq\\
设d=gcd(a,b),则\\
d|a,d|b \rightarrow d| a\%b\\
即d=(b,a\%b)
$$
得证

代码
```cpp
int gcd(a,b) {
  if(!b)return a;
  return (b,a%b);
}
```

## EXGCD

原理

裴蜀定理$ax+by=gcd(a,b)$

以及$gcd(a,b)=gcd(b,a\%b)$

带入有$ax_1+by_1=bx_2+a\%by_2=bx_2+(a-bq)y_2$

对比系数有$x_1=y_2,y_2=x_2-\frac{a}{b}y_2$

注意到 a*x +  0*y=gcd(a,0)=a 得x=1,y=0

```cpp
void exgcd(a,b,int& x,int& y){
  if(!b){
    x=1,y=0;
    return;
  }
  exgcd(b,a%b,y,x); // 求解 gcd(b,a%b)的系数y,x
  // x=y_2 已经自动赋值了
  y = y - a/b *x; // x_2 - a/b y_2
}
```

若$\gcd(a,b)=1,b为质数,则x=a^{-1}(mod p)$
## 费马小定理

$a^{p-1}=1(mod p)$

即$aa^{p-2}=1(mod p)$

得$a^{-1}=a^{p-2}$

```cpp
inv[1]=1;
for(i in 1... ) {
  inv[i]=(p-p/i)*inv[p%i] % p;
}
```
## 递推办法

$inv(i)=(p-p/i)inv(p\%i) \% p$

$inv(1)=1$

### 数学推导

我们需要证明 $inv(i) = (p - p/i) \cdot inv(p \% i) \% p$。

设 $inv(i)$ 是 $i$ 在模 $p$ 意义下的逆元，即 $i \cdot inv(i) \equiv 1 \pmod{p}$。

根据模运算的性质，有：
$$ i \cdot inv(i) \equiv 1 \pmod{p} $$

我们可以将 $i$ 表示为 $p$ 和 $p \% i$ 的线性组合：
$$ i = p - (p \% i) \cdot \left\lfloor \frac{p}{i} \right\rfloor $$

设 $inv(p \% i)$ 是 $p \% i$ 在模 $p$ 意义下的逆元，即：
$$ (p \% i) \cdot inv(p \% i) \equiv 1 \pmod{p} $$

将 $i$ 的表达式代入 $i \cdot inv(i) \equiv 1 \pmod{p}$：
$$ (p - (p \% i) \cdot \left\lfloor \frac{p}{i} \right\rfloor) \cdot inv(i) \equiv 1 \pmod{p} $$

展开并整理：
$$ p \cdot inv(i) - (p \% i) \cdot \left\lfloor \frac{p}{i} \right\rfloor \cdot inv(i) \equiv 1 \pmod{p} $$

由于 $p \cdot inv(i) \equiv 0 \pmod{p}$，因此：
$$ - (p \% i) \cdot \left\lfloor \frac{p}{i} \right\rfloor \cdot inv(i) \equiv 1 \pmod{p} $$

两边同时乘以 $-1$：
$$ (p \% i) \cdot \left\lfloor \frac{p}{i} \right\rfloor \cdot inv(i) \equiv -1 \pmod{p} $$

将 $inv(p \% i)$ 代入上式：
$$ (p \% i) \cdot inv(p \% i) \equiv 1 \pmod{p} $$

因此：
$$ \left\lfloor \frac{p}{i} \right\rfloor \cdot inv(i) \equiv inv(p \% i) \pmod{p} $$

所以：
$$ inv(i) \equiv (p - p/i) \cdot inv(p \% i) \pmod{p} $$

即：
$$ inv(i) = (p - p/i) \cdot inv(p \% i) \% p $$

得证。
