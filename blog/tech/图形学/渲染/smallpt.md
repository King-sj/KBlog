# smallpt
```cpp
#include <math.h>
#include <stdlib.h>

#include <iostream>
using namespace std;
#define M_PI 3.1415926
// 向量
struct Vec {
  double x, y, z;
  Vec(double x_ = 0, double y_ = 0, double z_ = 0) : x(x_), y(y_), z(z_) {}
  Vec operator+(const Vec &b) const { return Vec(x + b.x, y + b.y, z + b.z); }
  Vec operator-(const Vec &b) const { return Vec(x - b.x, y - b.y, z - b.z); }
  // 数乘
  Vec operator*(double b) const { return Vec(x * b, y * b, z * b); }
  // 逐元素相乘
  Vec mult(const Vec &b) const { return Vec(x * b.x, y * b.y, z * b.z); }
  // 归一化
  Vec &norm() { return *this = *this * (1 / sqrt(x * x + y * y + z * z)); }
  // 点乘
  double dot(const Vec &b) const { return x * b.x + y * b.y + z * b.z; }
  // 叉乘
  Vec cross(const Vec &b) const {
    return Vec(y * b.z - z * b.y, z * b.x - x * b.z, x * b.y - y * b.x);
  }
};
// 射线
struct Ray {
  Vec o, d;  // 射线起点和方向
  Ray(Vec o_, Vec d_) : o(o_), d(d_) {}
};
// 材质类型 DIFF:漫反射 SPEC:镜面反射 REFR:折射
enum Refl_t { DIFF, SPEC, REFR };
// 球体
class Sphere {
 public:
  double rad;   // 半径
  Vec p, e, c;  // 位置，辐射，颜色
  Refl_t refl;  // 反射类型
  /**
   * @brief Construct a new Sphere object
   * @param rad_ 半径
   * @param p_ 位置
   * @param e_ 辐射， 用于光源， 大部分物体为0
   * @param c_ 颜色
   * @param refl_ 反射类型
   */
  Sphere(double rad_, Vec p_, Vec e_, Vec c_, Refl_t refl_)
      : rad(rad_), p(p_), e(e_), c(c_), refl(refl_) {}
  /**
   * @brief 求解射线和球体的交点
   *
   * @param r 射线
   * @return double 交点距离，0表示无交点
   */
  double intersect(const Ray &r) const {
    Vec op = p - r.o;  // 求解t^2*d.d + 2*t*(o-p).d + (o-p).(o-p)-R^2 = 0
    double t, eps = 1e-4, b = op.dot(r.d), det = b * b - op.dot(op) + rad * rad;
    if (det < 0)
      return 0;
    else
      det = sqrt(det);
    return (t = b - det) > eps ? t : ((t = b + det) > eps ? t : 0);
  }
};
// 场景中的球体
Sphere spheres[] = {
    Sphere(1e5, Vec(1e5 + 1, 40.8, 81.6), Vec(), Vec(.75, .25, .25),
           DIFF),  // 左边的红色墙
    Sphere(1e5, Vec(-1e5 + 99, 40.8, 81.6), Vec(), Vec(.25, .25, .75),
           DIFF),  // 右边的蓝色墙
    Sphere(1e5, Vec(50, 40.8, 1e5), Vec(), Vec(.75, .75, .75),
           DIFF),  // 后面的灰色墙
    Sphere(1e5, Vec(50, 40.8, -1e5 + 170), Vec(), Vec(), DIFF),  // 前面的墙
    Sphere(1e5, Vec(50, 1e5, 81.6), Vec(), Vec(.75, .75, .75), DIFF),  // 地板
    Sphere(1e5, Vec(50, -1e5 + 81.6, 81.6), Vec(), Vec(.75, .75, .75),
           DIFF),  // 顶部
    Sphere(16.5, Vec(27, 16.5, 47), Vec(), Vec(1, 1, 1) * .999, SPEC),  // 镜子
    Sphere(16.5, Vec(73, 16.5, 78), Vec(), Vec(1, 1, 1) * .999, REFR),  // 玻璃
    Sphere(600, Vec(50, 681.6 - .27, 81.6), Vec(12, 12, 12), Vec(),
           DIFF)  // 光源
};
// 随机数
double erand48(unsigned short xsubi[3]) {
  return (double)rand() / (double)RAND_MAX;
}
// 限制x的范围在0-1之间
inline double clamp(double x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
// 将double转换为int
inline int toInt(double x) { return int(pow(clamp(x), 1 / 2.2) * 255 + .5); }
// 求解射线和物体的交点
inline bool intersect(const Ray &r, double &t, int &id) {
  double n = sizeof(spheres) / sizeof(Sphere), d, inf = t = 1e20;
  for (int i = int(n); i--;)
    if ((d = spheres[i].intersect(r)) && d < t) {
      t = d;
      id = i;
    }
  return t < inf;
}
// 求解光线的辐射度, r: 光线, depth: 递归深度, Xi: 随机数
Vec radiance(const Ray &r, int depth, unsigned short *Xi) {
  if (depth > 100) return Vec();
  double t;    // 距离
  int id = 0;  // 碰撞的物体id
  // 无碰撞
  if (!intersect(r, t, id)) return Vec();
  const Sphere &obj = spheres[id];  // 碰撞的物体
  Vec x = r.o + r.d * t, n = (x - obj.p).norm(),
      nl = n.dot(r.d) < 0 ? n : n * -1, f = obj.c;
  double p = f.x > f.y && f.x > f.z ? f.x
             : f.y > f.z            ? f.y
                                    : f.z;  // 最大反射率
  if (++depth > 5)
    if (erand48(Xi) < p)
      f = f * (1 / p);
    else
      return obj.e;        // R.R.
  if (obj.refl == DIFF) {  // 漫反射
    double r1 = 2 * M_PI * erand48(Xi), r2 = erand48(Xi), r2s = sqrt(r2);
    Vec w = nl, u = ((fabs(w.x) > .1 ? Vec(0, 1) : Vec(1)).cross(w)).norm(),
        v = w.cross(u);
    Vec d = (u * cos(r1) * r2s + v * sin(r1) * r2s + w * sqrt(1 - r2)).norm();
    return obj.e + f.mult(radiance(Ray(x, d), depth, Xi));
  } else if (obj.refl == SPEC)  // 镜面反射
    return obj.e +
           f.mult(radiance(Ray(x, r.d - n * 2 * n.dot(r.d)), depth, Xi));
  Ray reflRay(x, r.d - n * 2 * n.dot(r.d));  // 折射
  bool into = n.dot(nl) > 0;                 // 从外部到内部
  double nc = 1, nt = 1.5, nnt = into ? nc / nt : nt / nc, ddn = r.d.dot(nl),
         cos2t;
  if ((cos2t = 1 - nnt * nnt * (1 - ddn * ddn)) < 0)  // 全反射
    return obj.e + f.mult(radiance(reflRay, depth, Xi));
  Vec tdir =
      (r.d * nnt - n * ((into ? 1 : -1) * (ddn * nnt + sqrt(cos2t)))).norm();
  double a = nt - nc, b = nt + nc, R0 = a * a / (b * b),
         c = 1 - (into ? -ddn : tdir.dot(n));
  double Re = R0 + (1 - R0) * c * c * c * c * c, Tr = 1 - Re, P = .25 + .5 * Re,
         RP = Re / P, TP = Tr / (1 - P);
  return obj.e +
         f.mult(depth > 2
                    ? (erand48(Xi) < P ? radiance(reflRay, depth, Xi) * RP
                                       : radiance(Ray(x, tdir), depth, Xi) * TP)
                    : radiance(reflRay, depth, Xi) * Re +
                          radiance(Ray(x, tdir), depth, Xi) * Tr);
}
void renderProgressBar(int y, int h, int samps) {
  int barWidth = 70;
  double progress = (double)y / (h - 1);
  int pos = barWidth * progress;

  std::cout << "\r[";
  for (int i = 0; i < barWidth; ++i) {
    if (i < pos)
      std::cout << "=";
    else if (i == pos)
      std::cout << ">";
    else
      std::cout << " ";
  }
  std::cout << "] " << int(progress * 100.0) << " % (" << samps * 4 << " spp)";
  std::cout.flush();
}
int main(int argc, char *argv[]) {
  cout << "Rendering..." << endl;
  // 图像宽高, 采样次数
  int w = 1024, h = 768, samps = argc == 2 ? atoi(argv[1]) / 4 : 4;
  // 相机位置和方向
  Ray cam(Vec(50, 52, 295.6), Vec(0, -0.042612, -1).norm());
  // 摄像机坐标系,
  Vec cx = Vec(w * .5135 / h), cy = (cx.cross(cam.d)).norm() * .5135, r,
      *c = new Vec[w * h];
  // 多线程
#pragma omp parallel for schedule(dynamic, 1) private(r)
  // 循环每一行
  for (int y = 0; y < h; y++) {
    renderProgressBar(y, h, samps);
    // 循环每一列, XI用于随机数
    for (unsigned short x = 0, Xi[3] = {0, 0, y * y * y}; x < w; x++) {
      // 2x2个子像素
      for (int sy = 0, i = (h - y - 1) * w + x; sy < 2; sy++) {
        // 2x2个子像素
        for (int sx = 0; sx < 2; sx++, r = Vec()) {
          // 采样次数
          for (int s = 0; s < samps; s++) {
            double r1 = 2 * erand48(Xi),
                   dx = r1 < 1 ? sqrt(r1) - 1 : 1 - sqrt(2 - r1);
            double r2 = 2 * erand48(Xi),
                   dy = r2 < 1 ? sqrt(r2) - 1 : 1 - sqrt(2 - r2);
            //  产生随机光线
            Vec d = cx * (((sx + .5 + dx) / 2 + x) / w - .5) +
                    cy * (((sy + .5 + dy) / 2 + y) / h - .5) + cam.d;
            // 递归求解辐射度
            r = r +
                radiance(Ray(cam.o + d * 140, d.norm()), 0, Xi) * (1. / samps);
          }
          // 累加颜色
          c[i] = c[i] + Vec(clamp(r.x), clamp(r.y), clamp(r.z)) * .25;
        }
      }
    }
  }
  // 输出到文件
  cout << "Writing to file..." << endl;
  FILE *f = fopen("image.ppm", "w");
  fprintf(f, "P3\n%d %d\n%d\n", w, h, 255);
  for (int i = 0; i < w * h; i++)
    fprintf(f, "%d %d %d ", toInt(c[i].x), toInt(c[i].y), toInt(c[i].z));
  cout << "Done!" << endl;
  return 0;
}
```
