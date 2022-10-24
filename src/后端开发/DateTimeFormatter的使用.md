## **DateTimeFormatter的使用**

```java
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class DateApi {
	public static void main(String[] args) {
		LocalDateTime ldt1 = LocalDateTime.now();
		System.out.println(ldt1);// 2019-07-23T20:30:02.557
		
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String d = ldt1.format(dtf);
		System.out.println(d);// 2019-07-23T20:30:02.557
		
		LocalDateTime ldt2 = LocalDateTime.parse("2019-11-26 00:00:00", dtf);
		System.out.println(ldt2);// 2019-11-26T00:00
		
		System.out.println(ldt1.getYear());// 2019
		System.out.println(ldt1.getMonth());// JULY
		System.out.println(ldt1.getMonthValue());// 7
		System.out.println(ldt1.getDayOfYear());// 204
		System.out.println(ldt1.getDayOfMonth());// 23
		System.out.println(ldt1.getDayOfWeek());// TUESDAY
		System.out.println(ldt1.getHour());// 20
		System.out.println(ldt1.getMinute());// 30
		System.out.println(ldt1.getSecond());// 2
		
		LocalDateTime ldt3 = ldt1.withYear(2020);
		System.out.println(ldt3);// 2020-07-23T20:30:02.557
		System.out.println(ldt1);// 2019-07-23T20:30:02.557
		
		LocalDate date = LocalDate.now();
		System.out.println(date);// 2019-07-23
		
		LocalTime time = LocalTime.now();
		System.out.println(time);// 20:30:02.587
	}
}
```


