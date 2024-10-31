package main

import (
	"fmt"
	"time"
)

func main() {
	ticker := time.NewTicker(20 * time.Second)
	totalDuration := 10 * time.Minute
	start := time.Now()
	i := 0
	for range ticker.C {
		i++
		fmt.Println("Hello, World!", time.Now())
		if time.Since(start) > totalDuration {
			fmt.Println("Total duration reached", i, "expected", totalDuration/20*time.Second)
			return
		}
	}
}
