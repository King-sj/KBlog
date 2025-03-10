# 翻转链表

https://www.nowcoder.com/share/jump/8561783581740796593241

```cpp
/**
 * struct ListNode {
 *	int val;
 *	struct ListNode *next;
 *	ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    /**
     * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
     *
     *
     * @param head ListNode类
     * @return ListNode类
     */
    ListNode* ReverseList(ListNode* head) {
        // write code here
        if(!head)return head;
        auto pre = head;
        auto cur = head->next;
        pre->next = nullptr;
        while(cur) {
            auto nxt = cur->next;
            cur->next = pre;
            pre = cur;
            cur = nxt;
        }
        return pre;
    }
};
```
