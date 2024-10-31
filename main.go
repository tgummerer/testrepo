package main

import (
	"fmt"
	"time"
)

func main() {
	ticker := time.NewTicker(1 * time.Minute)
	totalDuration := 10 * time.Minute
	start := time.Now()
	i := 0
	count := func() {
		var i int64
		for {
			i++
			if i == 100000000000000000 {
				fmt.Println("count reached", i)
			}
		}
	}
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()
	go count()

	for range ticker.C {
		i++
		fmt.Println("Hello, World!", time.Now())
		if time.Since(start) > totalDuration {
			fmt.Println("Total duration reached", i, "expected", totalDuration/20*time.Second)
			return
		}
	}
}
