# pytest conf

<!-- TODO -->
特殊原因，还没完成

```py
# content of tests/conftest.py
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
print(sys.path)
```
