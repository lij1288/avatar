## **HQL转化为MapReduce的过程**

1. 通过开源语法分析器Antlr完成SQL解析，将SQL转化为抽象语法树（AST AbstractSyntaxTree）
2. 遍历抽象语法树，生成查询的基本组成单元QueryBlock，是一个递归的过程，QueryBlock包括输入源、计算过程、输出，是一个子查询
3. 遍历OueryBlock，翻译为执行操作树OperatorTree
4. 对OperatorTree进行优化，如分桶Map端聚合、合并相关的操作、将过滤操作提前
5. 遍历OperatorTree，翻译为MapReduce任务
6. 进行物理层优化，生成最终的执行计划