## **Golang的基础语法**

### 基本使用

```go
package main
import "fmt"
func main() {
	fmt.Println("HelloWorld")
}
```

- 运行方式
  - go build编译生成可执行文件后运行
  - go run直接运行

- 注意事项

  - 每个语句后不需要加分号，会在每行后自动加分号

  - 每行写一条语句

  - 不能存在未使用的变量和导包

  - 转义字符

    ```go
    \t // 制表符
    \n // 换行符
    \\ // \
    \" // "
    \r // 回车符
    ```
  
- 标准库文档：https://studygolang.com/pkgdoc

### 变量

```go
package main
import "fmt"
func main() {
	// 不赋值，使用默认值
	var a int =1
	fmt.Println("a=", a)

	// 根据值判断变量类型
	var b = 3.5
	fmt.Println("b=", b)

	// 省略var
	c := "test"
	fmt.Println("c=", c)
	
	// 多变量声明
	var a1 = 1
	var b1 = 3.5
	var c1 = "test"
	fmt.Println(a1, b1, c1)

	a2, b2, c2 := 1, 3.5, "test"
	fmt.Println(a2, b2, c2)

	var (
		a3 = 1
		b3 = 3.5
		c3 = "test"
	)
	fmt.Println(a3, b3, c3)
}
```

### 基本数据类型

#### 整数类型

- 整数类型默认声明为int

| 类型   | 符号 | 存储空间             | 表数范围                      |
| ------ | ---- | -------------------- | ----------------------------- |
| int8   | 有   | 1字节                | -2^7 ~ 2^7-1(-128 ~ 127)      |
| int16  | 有   | 2字节                | -2^15~ 2^15-1(-32768 ~ 32767) |
| int32  | 有   | 4字节                | -2^31 ~ 2^31-1                |
| int64  | 有   | 8字节                | -2^63 ~ 2^63-1                |
| uint8  | 无   | 1字节                | 0 ~ 2^8-1(0 ~ 255)            |
| uint16 | 无   | 2字节                | 0 ~ 2^16-1                    |
| uint32 | 无   | 4字节                | 0 ~ 2^32-1                    |
| uint64 | 无   | 8字节                | 0 ~ 2^64-1                    |
| int    | 有   | 64位8字节，32位4字节 |                               |
| uint   | 无   | 64位8字节，32位4字节 |                               |
| rune   | 有   | 4字节                | -2^31 ~ 2^31-1                |
| byte   | 无   | 1字节                | 0 ~ 2^8-1(0 ~ 255)            |

```go
package main
import (
	"fmt"
	"unsafe"
)
func main() {
	var a int8 = 10
	fmt.Printf("a的类型是%T，a占用字节数是%d", a, unsafe.Sizeof(a))
}
```

#### 浮点类型

- 浮点类型默认声明为float64

| 类型    | 存储空间 | 表数范围               |
| ------- | -------- | ---------------------- |
| float32 | 4        | -3.403E38 ~ 3.403E38   |
| float64 | 8        | -1.798E308 ~ 1.798E308 |

#### 字符型

- Go没有专门的字符类型，通常使用byte来保存单个字符，Go的字符由字节组成

```go
package main
import "fmt"
func main() {
	// 不赋值，使用默认值
	var a byte = 'a'
	fmt.Println("a=", a) // 97
	fmt.Printf("a=%c", a) // a
}
```

#### 布尔型

- bool
  - ture
  - false

#### 字符串

- string
  - 双引号：识别转义字符
  - 反引号：输出原生形式

#### 默认值

| 数据类型 | 默认值 |
| -------- | ------ |
| 整数类型 | 0      |
| 浮点类型 | 0      |
| 布尔类型 | ""     |
| 字符串   | false  |

#### 类型转换

```go
package main
import "fmt"
func main() {
	var a int32 = 135
	var a1 int8 = int8(a)
	var a2 int64 = int64(a)
	var a3 float64 = float64(a)
	fmt.Printf("a=%v a1=%v a2=%v a3=%v", a, a1, a2, a3) // a=135 a1=-121 a2=135 a3=135
}
```

- 其他基本数据类型转string

```go
package main
import "fmt"
func main() {
	var n1 int = 1
	var n2 float64 = 3.5
	var b1 bool = true
	var c1 byte = 'h'
	var str string

	str = fmt.Sprintf("%d", n1)
	fmt.Printf("str type %T str=%q\n", str, str)
	str = fmt.Sprintf("%f", n2)
	fmt.Printf("str type %T str=%q\n", str, str)
	str = fmt.Sprintf("%t", b1)
	fmt.Printf("str type %T str=%q\n", str, str)
	str = fmt.Sprintf("%c", c1)
	fmt.Printf("str type %T str=%q\n", str, str)
	// str type string str="1"
	// str type string str="3.500000"
	// str type string str="true"
	// str type string str="h"
}
```

```go
package main
import (
	"fmt"
	"strconv"
)
func main() {
	var n1 int = 1
	var n2 float64 = 3.5
	var b1 bool = true
	var str string
	
	str = strconv.FormatInt(int64(n1), 10)
	fmt.Printf("str type %T str=%q\n", str, str)
	str = strconv.FormatFloat(n2, 'f', 10, 64) // f格式（-ddd.dddd）；精度（f格式为小数点后位数）；float64
	fmt.Printf("str type %T str=%q\n", str, str)
	str = strconv.FormatBool(b1)
	fmt.Printf("str type %T str=%q\n", str, str)
	// str type string str="1"
	// str type string str="3.5000000000"
	// str type string str="true"
}
```

- string转其他基本数据类型
  - 若不能转为有效数据则会转为默认值



