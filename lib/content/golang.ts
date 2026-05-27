import type { Track } from "./types";

export const golangTrack: Track = {
  id: "golang",
  title: "Go Programming",
  description: "Go from fundamentals to building DevOps tooling",
  longDescription:
    "Learn Go from the ground up — types, structs, interfaces, error handling, and the concurrency model that makes Go ideal for DevOps tooling. Build real CLI tools, HTTP clients, and work with the Docker and Kubernetes APIs.",
  icon: "Code",
  color: "#00acd7",
  gradient: "track-golang-gradient",
  tags: ["go", "programming", "devops", "cli", "concurrency"],
  modules: [
    {
      id: "go-fundamentals",
      title: "Go Fundamentals",
      level: "beginner",
      description: "Learn Go's type system, control flow, functions, and error handling.",
      lessons: [
        {
          id: "go-basics",
          title: "Types, Variables, and Control Flow",
          duration: 30,
          type: "lesson",
          description: "Understand Go's static type system, variable declarations, and how control flow differs from other languages.",
          objectives: [
            "Understand Go's static type system and zero values",
            "Declare variables with var, short declaration (:=), and constants",
            "Use if, for, and switch effectively (Go has no while)",
            "Work with arrays, slices, and maps",
          ],
          content: `# Go Types, Variables, and Control Flow

## Why Go for DevOps?

Go compiles to a single static binary with no runtime dependencies. A tool you write in Go can be \`scp\`'d to any Linux server and run immediately — no Python, no Node, no JVM. That property matters enormously in DevOps:

\`\`\`bash
# Build for any target from your laptop
GOOS=linux GOARCH=amd64 go build -o my-tool .

# Ship and run
scp my-tool prod-server:/usr/local/bin/
ssh prod-server my-tool --help
\`\`\`

Docker, Kubernetes, Terraform, and most modern DevOps tooling is written in Go. Reading and extending them requires knowing Go.

## Hello World

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, DevOps!")
}
\`\`\`

- Every Go file belongs to a \`package\`
- Executable programs must be in \`package main\` with a \`main()\` function
- \`import\` pulls in packages; unused imports are a compile error

## Variables and Zero Values

\`\`\`go
package main

import "fmt"

func main() {
    // var declaration — explicit type
    var count int
    var name string
    var active bool

    fmt.Println(count, name, active)  // 0  false
    // All variables have a zero value — Go never leaves memory uninitialized

    // Short declaration — type inferred, only inside functions
    port := 8080
    host := "localhost"
    ratio := 3.14

    fmt.Println(port, host, ratio)  // 8080 localhost 3.14

    // Multiple assignment
    x, y := 10, 20
    x, y = y, x  // swap — no temp variable needed
    fmt.Println(x, y)  // 20 10

    // Constants — evaluated at compile time
    const MaxRetries = 3
    const DefaultTimeout = 30.0
}
\`\`\`

**Zero values matter**: A new \`map\` is \`nil\`; a new \`int\` is \`0\`; a new \`bool\` is \`false\`. Go always initializes — no garbage data.

## Basic Types

\`\`\`go
// Integer types
var a int     // platform-sized (64-bit on 64-bit systems)
var b int32   // exactly 32 bits
var c int64   // exactly 64 bits
var d uint    // unsigned int
var e byte    // alias for uint8

// Float types
var f float32
var g float64  // default for floating-point literals

// String — immutable sequence of bytes (UTF-8)
var h string = "hello"
s := fmt.Sprintf("port: %d, host: %s", 8080, "localhost")

// Boolean
var ok bool = true

// Type conversion is explicit — no implicit coercion
var n int = 42
var f64 float64 = float64(n)  // must convert explicitly
var n2 int = int(f64)
\`\`\`

## Slices — Go's Dynamic Arrays

\`\`\`go
// Array (fixed size — rarely used directly)
arr := [3]string{"a", "b", "c"}

// Slice (dynamic, backed by array)
s := []string{"web-01", "web-02", "web-03"}

// Append (may allocate new backing array)
s = append(s, "web-04")
s = append(s, "web-05", "web-06")  // append multiple

// Length and capacity
fmt.Println(len(s), cap(s))

// Slice of slice (shares backing array — careful with mutations)
first_two := s[0:2]  // s[low:high] — excludes high

// make — create slice with length and capacity
servers := make([]string, 0, 10)  // len=0, cap=10
for i := 0; i < 5; i++ {
    servers = append(servers, fmt.Sprintf("server-%d", i))
}

// Range over slice
for index, value := range servers {
    fmt.Printf("%d: %s\n", index, value)
}

// Ignore index or value with _
for _, name := range servers {
    fmt.Println(name)
}
\`\`\`

## Maps

\`\`\`go
// Map literal
config := map[string]string{
    "host":    "localhost",
    "port":    "5432",
    "dbname":  "mydb",
}

// make — create empty map
labels := make(map[string]string)
labels["env"]  = "prod"
labels["team"] = "platform"

// Access — returns zero value if key absent
port := config["port"]   // "5432"
missing := config["foo"] // "" (zero value for string)

// Check if key exists
if val, ok := config["host"]; ok {
    fmt.Println("host:", val)
} else {
    fmt.Println("host not set")
}

// Delete
delete(config, "port")

// Range over map (order is random — intentional in Go)
for key, val := range config {
    fmt.Printf("%s = %s\n", key, val)
}
\`\`\`

## Control Flow

Go has three control structures: \`if\`, \`for\`, and \`switch\`. No \`while\` — \`for\` handles all looping.

\`\`\`go
// if — parentheses optional, braces required
if len(servers) == 0 {
    fmt.Println("no servers")
}

// if with init statement — scopes variable to the block
if err := doSomething(); err != nil {
    fmt.Println("error:", err)
    return
}

// for — three forms:
// 1. classic C-style
for i := 0; i < 10; i++ {
    fmt.Println(i)
}

// 2. while-style (condition only)
retries := 0
for retries < 3 {
    retries++
}

// 3. infinite loop
for {
    // use break to exit
    break
}

// switch — no fallthrough by default
status := 404
switch status {
case 200, 201:
    fmt.Println("success")
case 400:
    fmt.Println("bad request")
case 404:
    fmt.Println("not found")
default:
    fmt.Println("other:", status)
}

// switch with no expression = if/else chain
switch {
case status >= 500:
    fmt.Println("server error")
case status >= 400:
    fmt.Println("client error")
default:
    fmt.Println("ok")
}
\`\`\``,
        },
        {
          id: "structs-interfaces",
          title: "Structs, Interfaces, and Methods",
          duration: 30,
          type: "lesson",
          description: "Model data with structs, define behavior with methods, and write flexible code with interfaces.",
          objectives: [
            "Define structs and attach methods",
            "Understand value vs pointer receivers",
            "Implement interfaces implicitly",
            "Use embedding for composition",
          ],
          content: `# Structs, Interfaces, and Methods

## Structs

Structs are Go's primary way to define data types:

\`\`\`go
type Server struct {
    Name     string
    Host     string
    Port     int
    Healthy  bool
    Tags     map[string]string
}

// Struct literal
s := Server{
    Name:    "web-01",
    Host:    "10.0.1.5",
    Port:    8080,
    Healthy: true,
    Tags:    map[string]string{"env": "prod"},
}

// Access fields
fmt.Println(s.Name, s.Host)

// Pointer to struct
p := &Server{Name: "web-02", Host: "10.0.1.6", Port: 8080}
p.Healthy = true  // Go auto-dereferences — same as (*p).Healthy = true
\`\`\`

**Exported vs unexported**: Fields starting with uppercase are exported (accessible outside the package); lowercase fields are private.

## Methods

Methods are functions with a receiver — they define behavior on a type:

\`\`\`go
// Value receiver — operates on a copy
func (s Server) Address() string {
    return fmt.Sprintf("%s:%d", s.Host, s.Port)
}

// Pointer receiver — can modify the original
func (s *Server) SetHealthy(healthy bool) {
    s.Healthy = healthy
}

func (s *Server) AddTag(key, value string) {
    if s.Tags == nil {
        s.Tags = make(map[string]string)
    }
    s.Tags[key] = value
}

// Usage
s := &Server{Host: "10.0.1.5", Port: 8080}
fmt.Println(s.Address())      // "10.0.1.5:8080"
s.SetHealthy(true)
s.AddTag("region", "us-east-1")
\`\`\`

**Rule of thumb**: If the method modifies state, use a pointer receiver. For consistency, once any method uses pointer receiver, make all methods pointer receivers.

## Interfaces

An interface defines a set of methods. Any type that implements those methods satisfies the interface — no \`implements\` keyword needed:

\`\`\`go
// Define interface
type HealthChecker interface {
    Check() (bool, error)
    Name() string
}

// HTTP health checker
type HTTPChecker struct {
    URL     string
    Timeout time.Duration
}

func (h *HTTPChecker) Check() (bool, error) {
    resp, err := http.Get(h.URL)
    if err != nil {
        return false, err
    }
    defer resp.Body.Close()
    return resp.StatusCode == 200, nil
}

func (h *HTTPChecker) Name() string {
    return "http:" + h.URL
}

// TCP health checker — different implementation, same interface
type TCPChecker struct {
    Host string
    Port int
}

func (t *TCPChecker) Check() (bool, error) {
    addr := fmt.Sprintf("%s:%d", t.Host, t.Port)
    conn, err := net.DialTimeout("tcp", addr, 5*time.Second)
    if err != nil {
        return false, err
    }
    conn.Close()
    return true, nil
}

func (t *TCPChecker) Name() string {
    return fmt.Sprintf("tcp:%s:%d", t.Host, t.Port)
}

// Function that accepts any HealthChecker
func CheckAll(checkers []HealthChecker) {
    for _, c := range checkers {
        ok, err := c.Check()
        if err != nil {
            fmt.Printf("[%s] ERROR: %v\n", c.Name(), err)
        } else if ok {
            fmt.Printf("[%s] OK\n", c.Name())
        } else {
            fmt.Printf("[%s] UNHEALTHY\n", c.Name())
        }
    }
}

// Mix and match implementations
checkers := []HealthChecker{
    &HTTPChecker{URL: "http://api.example.com/health"},
    &TCPChecker{Host: "postgres.internal", Port: 5432},
    &HTTPChecker{URL: "http://cache.example.com/ping"},
}
CheckAll(checkers)
\`\`\`

## The io.Reader and io.Writer Interfaces

The most important interfaces in Go's standard library:

\`\`\`go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}
\`\`\`

Anything that can provide bytes is a \`Reader\`: files, HTTP response bodies, strings, network connections. This lets one function work with all of them:

\`\`\`go
// This function works with files, HTTP bodies, strings — anything
func parseConfig(r io.Reader) (*Config, error) {
    data, err := io.ReadAll(r)
    if err != nil {
        return nil, err
    }
    // parse data...
}

// From a file
f, _ := os.Open("config.yaml")
defer f.Close()
cfg, _ := parseConfig(f)

// From an HTTP response
resp, _ := http.Get("http://config-server/config.yaml")
defer resp.Body.Close()
cfg, _ = parseConfig(resp.Body)

// From a string (for testing)
cfg, _ = parseConfig(strings.NewReader("key: value"))
\`\`\`

## Embedding — Composition over Inheritance

Go has no inheritance. Instead, embed types to compose behavior:

\`\`\`go
type BaseResource struct {
    Name      string
    Namespace string
    Labels    map[string]string
}

func (b *BaseResource) SetLabel(key, value string) {
    if b.Labels == nil {
        b.Labels = make(map[string]string)
    }
    b.Labels[key] = value
}

func (b *BaseResource) HasLabel(key string) bool {
    _, ok := b.Labels[key]
    return ok
}

// Embed BaseResource — Pod gets all its fields and methods
type Pod struct {
    BaseResource        // embedded — not a named field
    Image     string
    Command   []string
    Resources ResourceRequirements
}

type Service struct {
    BaseResource
    ClusterIP string
    Ports     []ServicePort
}

// Usage — embedded methods promoted to outer type
pod := &Pod{
    BaseResource: BaseResource{Name: "web-pod", Namespace: "default"},
    Image:        "nginx:latest",
}
pod.SetLabel("app", "web")        // promoted from BaseResource
fmt.Println(pod.HasLabel("app"))  // true
fmt.Println(pod.Name)             // "web-pod" — field access promoted
\`\`\``,
        },
        {
          id: "error-handling",
          title: "Error Handling in Go",
          duration: 20,
          type: "lesson",
          description: "Handle errors the Go way — explicit returns, wrapping, and custom error types.",
          objectives: [
            "Understand Go's error-as-value philosophy",
            "Wrap errors with context using fmt.Errorf and %w",
            "Inspect error chains with errors.Is and errors.As",
            "Define custom error types for richer context",
          ],
          content: `# Error Handling in Go

## Errors Are Values

Go does not have exceptions. Errors are regular values returned as the last return value of a function:

\`\`\`go
// Functions that can fail return (result, error)
func readConfig(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, err  // propagate
    }
    return data, nil
}

func main() {
    data, err := readConfig("/etc/app/config.yaml")
    if err != nil {
        log.Fatalf("failed to read config: %v", err)
    }
    // use data...
}
\`\`\`

The \`error\` type is an interface: any type with an \`Error() string\` method satisfies it.

## Wrapping Errors with Context

Always add context when returning errors — you want the full call chain in the message:

\`\`\`go
func loadDatabase(cfg Config) (*sql.DB, error) {
    db, err := sql.Open("postgres", cfg.DSN)
    if err != nil {
        return nil, fmt.Errorf("open database: %w", err)
        // %w wraps — preserves original for errors.Is/As
    }

    if err := db.Ping(); err != nil {
        return nil, fmt.Errorf("ping database at %s: %w", cfg.Host, err)
    }

    return db, nil
}

func startApp() error {
    cfg, err := loadConfig()
    if err != nil {
        return fmt.Errorf("load config: %w", err)
    }

    db, err := loadDatabase(cfg)
    if err != nil {
        return fmt.Errorf("initialize: %w", err)
    }

    // ...
    return nil
}

// Error message chain:
// "initialize: open database: dial tcp 10.0.1.5:5432: connection refused"
// Each layer adds context — no need to log at every level
\`\`\`

## Inspecting Errors

\`\`\`go
// errors.Is — check if any error in the chain matches a sentinel
var ErrNotFound = errors.New("not found")

func getUser(id string) (*User, error) {
    u, ok := db[id]
    if !ok {
        return nil, fmt.Errorf("getUser %s: %w", id, ErrNotFound)
    }
    return u, nil
}

user, err := getUser("123")
if errors.Is(err, ErrNotFound) {
    // handle missing user
} else if err != nil {
    // handle other errors
}

// errors.As — extract a specific error type from the chain
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error on %s: %s", e.Field, e.Message)
}

func validatePort(port int) error {
    if port < 1 || port > 65535 {
        return fmt.Errorf("config: %w", &ValidationError{
            Field:   "port",
            Message: fmt.Sprintf("%d is not a valid port number", port),
        })
    }
    return nil
}

err := validatePort(99999)
var ve *ValidationError
if errors.As(err, &ve) {
    fmt.Printf("Invalid field '%s': %s\n", ve.Field, ve.Message)
}
\`\`\`

## Patterns for Robust Error Handling

**Sentinel errors** for expected failure modes:

\`\`\`go
var (
    ErrTimeout     = errors.New("operation timed out")
    ErrUnauthorized = errors.New("unauthorized")
    ErrRateLimit   = errors.New("rate limit exceeded")
)

func callAPI(endpoint string) ([]byte, error) {
    resp, err := http.Get(endpoint)
    if err != nil {
        return nil, fmt.Errorf("callAPI: %w", err)
    }
    defer resp.Body.Close()

    switch resp.StatusCode {
    case 200:
        return io.ReadAll(resp.Body)
    case 401, 403:
        return nil, fmt.Errorf("callAPI %s: %w", endpoint, ErrUnauthorized)
    case 429:
        return nil, fmt.Errorf("callAPI %s: %w", endpoint, ErrRateLimit)
    default:
        return nil, fmt.Errorf("callAPI %s: unexpected status %d", endpoint, resp.StatusCode)
    }
}
\`\`\`

**Retry with context**:

\`\`\`go
func withRetry(ctx context.Context, maxAttempts int, fn func() error) error {
    var lastErr error
    for attempt := 1; attempt <= maxAttempts; attempt++ {
        if err := ctx.Err(); err != nil {
            return fmt.Errorf("context cancelled after %d attempts: %w", attempt-1, err)
        }

        lastErr = fn()
        if lastErr == nil {
            return nil
        }

        // Don't retry non-retryable errors
        if errors.Is(lastErr, ErrUnauthorized) {
            return lastErr
        }

        wait := time.Duration(attempt) * 500 * time.Millisecond
        fmt.Printf("attempt %d failed: %v — retrying in %v\n", attempt, lastErr, wait)

        select {
        case <-time.After(wait):
        case <-ctx.Done():
            return ctx.Err()
        }
    }
    return fmt.Errorf("all %d attempts failed: %w", maxAttempts, lastErr)
}
\`\`\`

**defer for cleanup** — runs when the function returns, even on error:

\`\`\`go
func processFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return fmt.Errorf("open %s: %w", path, err)
    }
    defer f.Close()  // always runs — no need to close in every error branch

    // process file...
    return nil
}
\`\`\``,
        },
      ],
      exam: [
        { question: "What is the zero value of a map in Go, and what happens if you try to write to it?", answer: "The zero value of a map is nil. Writing to a nil map (e.g., 'var m map[string]string; m[\"key\"] = \"value\"') causes a runtime panic: 'assignment to entry in nil map'. You must initialize the map first with make: 'm := make(map[string]string)' or with a map literal 'm := map[string]string{}'. Reading from a nil map is safe and returns the zero value for the value type.", difficulty: "junior" },
        { question: "Explain the difference between value receivers and pointer receivers in Go methods.", answer: "A value receiver (func (s Server) Method()) receives a copy of the struct — modifications inside the method do not affect the original. A pointer receiver (func (s *Server) Method()) receives a pointer to the original struct — modifications affect the original. Use pointer receivers when: (1) the method modifies state, (2) the struct is large (copying is expensive), or (3) consistency — if any method on a type uses a pointer receiver, all methods should use pointer receivers. Value receivers are appropriate for small read-only methods on small structs, and for types where you want copy semantics.", difficulty: "junior" },
        { question: "Why does Go use errors as return values instead of exceptions? What are the trade-offs?", answer: "Go's design philosophy: errors are expected outcomes, not exceptional situations. By returning errors explicitly, the compiler forces callers to handle them — you can't accidentally ignore an error the way you can with uncaught exceptions. Advantages: error handling is visible in the code, easy to reason about control flow, no magic stack unwinding, and errors can carry rich context through wrapping. Trade-offs: verbose — every fallible call site needs 'if err != nil' check, which can obscure the main logic in functions with many error points. The pattern scales well for library code and CLI tools, where explicit error handling is desirable. For very deep call stacks, Go 1.13+ error wrapping with fmt.Errorf/%w maintains the chain without re-implementing error propagation.", difficulty: "mid" },
        { question: "What is the difference between errors.Is and errors.As?", answer: "errors.Is checks if any error in the chain matches a specific error value (sentinel). It compares using equality: useful for sentinel errors like 'var ErrNotFound = errors.New(...)'. errors.As checks if any error in the chain is of a specific type and extracts it into a target variable. It's useful when you want to access fields on a custom error type: 'var ve *ValidationError; if errors.As(err, &ve) { fmt.Println(ve.Field) }'. Both traverse the error chain created by fmt.Errorf with %w, unwrapping at each level until they find a match or exhaust the chain.", difficulty: "mid" },
      ],
    },
    {
      id: "go-concurrency",
      title: "Go Concurrency",
      level: "intermediate",
      description: "Master goroutines, channels, select, and the sync package for safe concurrent programs.",
      lessons: [
        {
          id: "goroutines-channels",
          title: "Goroutines and Channels",
          duration: 35,
          type: "lesson",
          description: "Build concurrent programs with goroutines and communicate safely between them using channels.",
          objectives: [
            "Launch goroutines and understand their lifecycle",
            "Communicate between goroutines with buffered and unbuffered channels",
            "Use select for multiplexing channels",
            "Coordinate goroutines with WaitGroup",
          ],
          content: `# Goroutines and Channels

## Goroutines

A goroutine is a lightweight concurrent function. Go can run hundreds of thousands of goroutines with minimal overhead — each starts with a 2KB stack that grows as needed.

\`\`\`go
func checkServer(host string) {
    resp, err := http.Get("http://" + host + "/health")
    if err != nil {
        fmt.Printf("[%s] ERROR: %v\n", host, err)
        return
    }
    resp.Body.Close()
    fmt.Printf("[%s] %d\n", host, resp.StatusCode)
}

func main() {
    servers := []string{"web-01:8080", "web-02:8080", "web-03:8080"}

    // Sequential — takes 3 × timeout time
    for _, s := range servers {
        checkServer(s)
    }

    // Concurrent — all checks run in parallel
    for _, s := range servers {
        go checkServer(s)  // go keyword launches a goroutine
    }

    // Problem: main exits before goroutines finish
    // Fix: use WaitGroup or channels to synchronize
}
\`\`\`

## sync.WaitGroup — Wait for Goroutines

\`\`\`go
func checkAllServers(servers []string) {
    var wg sync.WaitGroup

    for _, server := range servers {
        wg.Add(1)  // increment before launching goroutine
        go func(s string) {
            defer wg.Done()  // decrement when goroutine finishes
            checkServer(s)
        }(server)  // pass server as argument — capture correctly
    }

    wg.Wait()  // block until all Done() calls received
    fmt.Println("all checks complete")
}
\`\`\`

**Common mistake** — capturing loop variable:

\`\`\`go
// BUG: all goroutines see the same 's' — usually the last value
for _, s := range servers {
    go func() {
        fmt.Println(s)  // captures loop variable, not a copy
    }()
}

// CORRECT: pass as parameter
for _, s := range servers {
    go func(server string) {
        fmt.Println(server)
    }(s)
}
\`\`\`

## Channels — Communication Between Goroutines

\`\`\`go
// Unbuffered channel — sender blocks until receiver is ready
ch := make(chan string)

go func() {
    ch <- "hello"  // send — blocks until someone receives
}()

msg := <-ch  // receive — blocks until someone sends
fmt.Println(msg)  // "hello"

// Buffered channel — sender only blocks when buffer is full
results := make(chan string, 10)  // buffer 10 items

// Send results from goroutines
for _, server := range servers {
    go func(s string) {
        resp, err := http.Get("http://" + s + "/health")
        if err != nil {
            results <- fmt.Sprintf("%s: error", s)
            return
        }
        resp.Body.Close()
        results <- fmt.Sprintf("%s: %d", s, resp.StatusCode)
    }(server)
}

// Collect all results
for i := 0; i < len(servers); i++ {
    fmt.Println(<-results)
}
\`\`\`

## Fan-Out / Fan-In Pattern

Fan-out distributes work across multiple workers; fan-in collects their results:

\`\`\`go
type Result struct {
    Server  string
    Healthy bool
    Error   error
}

func checkServers(servers []string) []Result {
    results := make(chan Result, len(servers))

    // Fan-out: launch one goroutine per server
    for _, s := range servers {
        go func(server string) {
            ok, err := pingServer(server)
            results <- Result{Server: server, Healthy: ok, Error: err}
        }(s)
    }

    // Fan-in: collect all results
    var all []Result
    for i := 0; i < len(servers); i++ {
        all = append(all, <-results)
    }
    return all
}
\`\`\`

## select — Multiplex Channels

\`\`\`select\` waits on multiple channels and handles whichever is ready:

\`\`\`go
func doWithTimeout(ctx context.Context, work func() error) error {
    done := make(chan error, 1)

    go func() {
        done <- work()
    }()

    select {
    case err := <-done:
        return err  // work finished
    case <-ctx.Done():
        return fmt.Errorf("timed out: %w", ctx.Err())  // deadline exceeded
    }
}

// Usage
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

err := doWithTimeout(ctx, func() error {
    return deployService("web")
})
\`\`\`

**Non-blocking select with default**:

\`\`\`go
select {
case msg := <-incoming:
    process(msg)
default:
    // no message ready — don't block
}
\`\`\`

## Worker Pool — Bounded Concurrency

For large workloads, a worker pool limits how many goroutines run simultaneously:

\`\`\`go
func processURLs(urls []string, concurrency int) []Result {
    jobs    := make(chan string, len(urls))
    results := make(chan Result, len(urls))

    // Start N workers
    var wg sync.WaitGroup
    for i := 0; i < concurrency; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for url := range jobs {  // range over channel — exits when closed
                ok, err := fetch(url)
                results <- Result{URL: url, OK: ok, Error: err}
            }
        }()
    }

    // Send all jobs
    for _, url := range urls {
        jobs <- url
    }
    close(jobs)  // signal workers: no more jobs

    // Wait for all workers, then close results
    go func() {
        wg.Wait()
        close(results)
    }()

    // Collect results
    var all []Result
    for r := range results {
        all = append(all, r)
    }
    return all
}

// Usage: check 1000 URLs with max 20 concurrent requests
results := processURLs(urls, 20)
\`\`\``,
        },
        {
          id: "sync-context",
          title: "Sync Primitives and Context",
          duration: 25,
          type: "lesson",
          description: "Use Mutex, RWMutex, Once, and the context package for safe concurrent state and cancellation.",
          objectives: [
            "Protect shared state with Mutex and RWMutex",
            "Use sync.Once for one-time initialization",
            "Propagate cancellation and deadlines with context",
            "Pass request-scoped values through context",
          ],
          content: `# Sync Primitives and Context

## sync.Mutex — Protecting Shared State

When multiple goroutines access shared state, use a mutex:

\`\`\`go
type MetricsCollector struct {
    mu      sync.Mutex  // guards the fields below
    counts  map[string]int64
    totals  map[string]float64
}

func NewMetricsCollector() *MetricsCollector {
    return &MetricsCollector{
        counts: make(map[string]int64),
        totals: make(map[string]float64),
    }
}

func (m *MetricsCollector) Record(name string, value float64) {
    m.mu.Lock()
    defer m.mu.Unlock()  // always unlock — defer is safer
    m.counts[name]++
    m.totals[name] += value
}

func (m *MetricsCollector) Average(name string) float64 {
    m.mu.Lock()
    defer m.mu.Unlock()
    count := m.counts[name]
    if count == 0 {
        return 0
    }
    return m.totals[name] / float64(count)
}
\`\`\`

## sync.RWMutex — Read-Heavy Workloads

When reads far outnumber writes, RWMutex allows concurrent reads:

\`\`\`go
type ServiceRegistry struct {
    mu       sync.RWMutex  // RWMutex: multiple readers OR one writer
    services map[string]string
}

// Read — can run concurrently with other reads
func (r *ServiceRegistry) Get(name string) (string, bool) {
    r.mu.RLock()
    defer r.mu.RUnlock()
    addr, ok := r.services[name]
    return addr, ok
}

// Write — exclusive access
func (r *ServiceRegistry) Register(name, addr string) {
    r.mu.Lock()
    defer r.mu.Unlock()
    r.services[name] = addr
}
\`\`\`

## sync.Once — One-Time Initialization

\`\`\`go
type Database struct {
    once sync.Once
    db   *sql.DB
}

func (d *Database) Get() *sql.DB {
    d.once.Do(func() {
        var err error
        d.db, err = sql.Open("postgres", os.Getenv("DATABASE_URL"))
        if err != nil {
            panic(err)  // only acceptable in initialization
        }
    })
    return d.db
}

// No matter how many goroutines call Get() simultaneously,
// the database is only opened once.
\`\`\`

## context Package — Cancellation and Deadlines

Context carries deadlines, cancellation signals, and request-scoped values across API boundaries. Every long-running or network operation should accept a context:

\`\`\`go
// Pass context as the first parameter — universal convention in Go
func fetchData(ctx context.Context, url string) ([]byte, error) {
    req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    if err != nil {
        return nil, err
    }
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err  // includes context cancellation errors
    }
    defer resp.Body.Close()
    return io.ReadAll(resp.Body)
}
\`\`\`

**Creating contexts**:

\`\`\`go
// Root context — use context.Background() at program entry points
ctx := context.Background()

// With timeout — cancel automatically after duration
ctx, cancel := context.WithTimeout(ctx, 30*time.Second)
defer cancel()  // always call cancel to release resources

// With deadline — cancel at specific time
deadline := time.Now().Add(5 * time.Minute)
ctx, cancel := context.WithDeadline(ctx, deadline)
defer cancel()

// With manual cancellation
ctx, cancel := context.WithCancel(ctx)
// call cancel() when you want to cancel all work derived from ctx

// With values — pass request-scoped data (not for optional parameters)
type contextKey string
const RequestIDKey contextKey = "requestID"

ctx = context.WithValue(ctx, RequestIDKey, "req-abc-123")

// Retrieve value
if id, ok := ctx.Value(RequestIDKey).(string); ok {
    fmt.Println("request ID:", id)
}
\`\`\`

**Context for coordinating goroutines**:

\`\`\`go
func runWorkers(ctx context.Context, n int) {
    var wg sync.WaitGroup

    for i := 0; i < n; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    fmt.Printf("worker %d stopping: %v\n", id, ctx.Err())
                    return
                default:
                    doWork(id)
                }
            }
        }(i)
    }

    wg.Wait()
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())

    // Cancel on OS signal
    go func() {
        c := make(chan os.Signal, 1)
        signal.Notify(c, os.Interrupt, syscall.SIGTERM)
        <-c
        fmt.Println("shutting down...")
        cancel()
    }()

    runWorkers(ctx, 5)
}
\`\`\``,
        },
      ],
      exam: [
        { question: "You launch 100 goroutines to make HTTP requests but the server starts returning 503 errors. How do you limit concurrency to 10 simultaneous requests?", answer: "Use a semaphore pattern with a buffered channel: 'sem := make(chan struct{}, 10)'. Before each request: 'sem <- struct{}{}' (acquires a slot, blocks if 10 are busy). After each request: '<-sem' (releases the slot). Alternatively, use a worker pool: create 10 goroutines that read from a jobs channel. This is cleaner — workers are reused rather than creating and destroying goroutines for each request. A third option is golang.org/x/sync/semaphore for a more ergonomic API.", difficulty: "mid" },
        { question: "What is the difference between context.WithTimeout and context.WithDeadline?", answer: "context.WithTimeout(parent, duration) creates a context that cancels after 'duration' from now — it's relative. context.WithDeadline(parent, time.Time) creates a context that cancels at a specific absolute point in time. WithTimeout is implemented using WithDeadline internally (deadline = now + duration). Use WithTimeout for 'this operation must complete within X seconds'. Use WithDeadline when you have a fixed point in time (e.g., SLA deadline, scheduled task cutoff). In both cases, always call the returned cancel function with defer cancel() — even if the deadline fires first, calling cancel() is idempotent and releases resources.", difficulty: "mid" },
        { question: "A goroutine writes to a channel that nobody is reading from. What happens?", answer: "An unbuffered channel send blocks forever if no goroutine is receiving — the goroutine is stuck, consuming its stack memory. This is a goroutine leak. If the goroutine also holds resources (file handles, database connections, locks), those leak too. For a buffered channel, the send blocks only when the buffer is full — if nobody ever reads, eventually the buffer fills and the sender blocks permanently. Detection: runtime.NumGoroutine() growing over time, or using pprof /debug/pprof/goroutine. Prevention: always pair sends with receivers, use context cancellation to break out of blocked sends, use select with ctx.Done() instead of bare channel sends.", difficulty: "senior" },
        { question: "What does sync.Once guarantee and why is it useful compared to checking a boolean flag manually?", answer: "sync.Once guarantees that the function passed to Do() is called exactly once, even if multiple goroutines call Do() concurrently. It handles the memory visibility guarantee (happens-before) so all goroutines see the initialized state after Once.Do returns. A manual boolean flag requires a mutex around both the check and the initialization to be safe: 'if !initialized { mu.Lock(); if !initialized { initialize(); initialized = true }; mu.Unlock() }' — this double-checked locking is error-prone. sync.Once encapsulates this pattern correctly. Use it for: lazy initialization of expensive resources (database connections, config parsing), singleton construction, one-time setup that must survive concurrent callers.", difficulty: "mid" },
      ],
    },
    {
      id: "go-for-devops",
      title: "Go for DevOps",
      level: "intermediate",
      description: "Build real DevOps tooling — CLI tools, HTTP clients, and integrations with Docker and Kubernetes.",
      lessons: [
        {
          id: "cli-tools",
          title: "Building CLI Tools with Cobra",
          duration: 35,
          type: "lesson",
          description: "Build production-quality CLI tools in Go using the Cobra library, the same library used by kubectl and Helm.",
          objectives: [
            "Structure a CLI application with commands and subcommands",
            "Add flags, required arguments, and validation",
            "Read configuration from flags, environment variables, and files",
            "Produce structured output and handle errors correctly",
          ],
          content: `# Building CLI Tools with Cobra

## Why Cobra?

kubectl, Helm, Docker CLI, GitHub CLI, and Terraform all use Cobra for command-line parsing. It provides:
- Subcommand trees (\`mycli server start\`, \`mycli server stop\`)
- Flag inheritance and persistent flags
- Shell completion (bash, zsh, fish, PowerShell)
- Automatic help generation

\`\`\`bash
go get github.com/spf13/cobra@latest
go get github.com/spf13/viper@latest  # for config file + env var support
\`\`\`

## Project Structure

\`\`\`
myctl/
  cmd/
    root.go       ← root command, persistent flags
    server.go     ← server subcommand group
    server_start.go
    server_stop.go
    deploy.go
  internal/
    client/       ← API client
    config/       ← config loading
  main.go
\`\`\`

## Root Command

\`\`\`go
// cmd/root.go
package cmd

import (
    "fmt"
    "os"
    "github.com/spf13/cobra"
    "github.com/spf13/viper"
)

var rootCmd = &cobra.Command{
    Use:   "myctl",
    Short: "Infrastructure control tool",
    Long:  \`myctl manages servers, deployments, and infrastructure.\`,
}

var cfgFile string

func init() {
    cobra.OnInitialize(initConfig)

    // Persistent flags — available to all subcommands
    rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default: ~/.myctl.yaml)")
    rootCmd.PersistentFlags().String("api-url", "http://localhost:8080", "API server URL")
    rootCmd.PersistentFlags().String("token", "", "API token")
    rootCmd.PersistentFlags().BoolP("verbose", "v", false, "enable verbose output")

    // Bind flags to viper so env vars also work
    viper.BindPFlag("api_url", rootCmd.PersistentFlags().Lookup("api-url"))
    viper.BindPFlag("token", rootCmd.PersistentFlags().Lookup("token"))
    // MYCTL_TOKEN env var automatically maps to "token" key
    viper.SetEnvPrefix("MYCTL")
    viper.AutomaticEnv()
}

func initConfig() {
    if cfgFile != "" {
        viper.SetConfigFile(cfgFile)
    } else {
        home, _ := os.UserHomeDir()
        viper.AddConfigPath(home)
        viper.SetConfigName(".myctl")
        viper.SetConfigType("yaml")
    }
    viper.ReadInConfig()  // ignore error — config file is optional
}

func Execute() {
    if err := rootCmd.Execute(); err != nil {
        os.Exit(1)
    }
}
\`\`\`

## Subcommands

\`\`\`go
// cmd/server.go
package cmd

import "github.com/spf13/cobra"

var serverCmd = &cobra.Command{
    Use:   "server",
    Short: "Manage servers",
}

func init() {
    rootCmd.AddCommand(serverCmd)
}

// cmd/server_list.go
package cmd

import (
    "fmt"
    "github.com/spf13/cobra"
    "github.com/spf13/viper"
)

var listCmd = &cobra.Command{
    Use:   "list",
    Short: "List all servers",
    RunE:  runServerList,  // RunE returns an error — preferred over Run
}

var outputFormat string

func init() {
    serverCmd.AddCommand(listCmd)
    listCmd.Flags().StringVarP(&outputFormat, "output", "o", "table", "output format: table|json|yaml")
    listCmd.Flags().String("filter", "", "filter servers by label (e.g. env=prod)")
}

func runServerList(cmd *cobra.Command, args []string) error {
    apiURL := viper.GetString("api_url")
    token := viper.GetString("token")

    if token == "" {
        return fmt.Errorf("API token required: set --token or MYCTL_TOKEN env var")
    }

    client := NewClient(apiURL, token)
    servers, err := client.ListServers(cmd.Context())
    if err != nil {
        return fmt.Errorf("list servers: %w", err)
    }

    switch outputFormat {
    case "json":
        return printJSON(servers)
    case "yaml":
        return printYAML(servers)
    default:
        printTable(servers)
        return nil
    }
}
\`\`\`

## Command with Required Arguments

\`\`\`go
var deployCmd = &cobra.Command{
    Use:   "deploy SERVICE VERSION",
    Short: "Deploy a service to an environment",
    Args:  cobra.ExactArgs(2),  // require exactly 2 positional args
    RunE:  runDeploy,
    Example: \`  # Deploy web service version 1.2.3
  myctl deploy web 1.2.3

  # Deploy to specific environment
  myctl deploy web 1.2.3 --env staging\`,
}

var deployEnv string
var dryRun bool

func init() {
    rootCmd.AddCommand(deployCmd)
    deployCmd.Flags().StringVarP(&deployEnv, "env", "e", "dev", "target environment")
    deployCmd.Flags().BoolVar(&dryRun, "dry-run", false, "show what would happen without making changes")
    deployCmd.MarkFlagRequired("env")  // fail fast if not provided
}

func runDeploy(cmd *cobra.Command, args []string) error {
    service := args[0]
    version := args[1]

    verbose, _ := cmd.Flags().GetBool("verbose")
    if verbose {
        fmt.Printf("Deploying %s@%s to %s\n", service, version, deployEnv)
    }

    if dryRun {
        fmt.Printf("[DRY RUN] would deploy %s@%s to %s\n", service, version, deployEnv)
        return nil
    }

    client := NewClient(viper.GetString("api_url"), viper.GetString("token"))
    return client.Deploy(cmd.Context(), service, version, deployEnv)
}
\`\`\`

## Structured Output

\`\`\`go
import (
    "encoding/json"
    "fmt"
    "os"
    "text/tabwriter"
)

type Server struct {
    Name    string \`json:"name"\`
    Host    string \`json:"host"\`
    Status  string \`json:"status"\`
    Region  string \`json:"region"\`
}

func printTable(servers []Server) {
    w := tabwriter.NewWriter(os.Stdout, 0, 0, 3, ' ', 0)
    fmt.Fprintln(w, "NAME\tHOST\tSTATUS\tREGION")
    for _, s := range servers {
        fmt.Fprintf(w, "%s\t%s\t%s\t%s\n", s.Name, s.Host, s.Status, s.Region)
    }
    w.Flush()
}

func printJSON(v any) error {
    enc := json.NewEncoder(os.Stdout)
    enc.SetIndent("", "  ")
    return enc.Encode(v)
}

// Error handling convention: write errors to stderr, exit 1
func exitWithError(msg string, err error) {
    fmt.Fprintf(os.Stderr, "error: %s: %v\n", msg, err)
    os.Exit(1)
}
\`\`\``,
        },
        {
          id: "docker-k8s-sdk",
          title: "Go with Docker and Kubernetes APIs",
          duration: 35,
          type: "lesson",
          description: "Use the Docker SDK and Kubernetes client-go to build tools that interact with containers and clusters.",
          objectives: [
            "Use the Docker Go SDK to list, start, and inspect containers",
            "Connect to a Kubernetes cluster with client-go",
            "List, watch, and manage Kubernetes resources programmatically",
            "Build a simple controller pattern",
          ],
          content: `# Go with Docker and Kubernetes APIs

## Docker SDK

The official Docker Go SDK gives you everything the Docker CLI can do, from Go code.

\`\`\`bash
go get github.com/docker/docker/client
go get github.com/docker/docker/api/types
\`\`\`

### Connecting and Listing Containers

\`\`\`go
package main

import (
    "context"
    "fmt"
    "log"

    "github.com/docker/docker/api/types"
    "github.com/docker/docker/api/types/container"
    "github.com/docker/docker/client"
)

func main() {
    // Connect to local Docker daemon (uses DOCKER_HOST env if set)
    cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
    if err != nil {
        log.Fatal(err)
    }
    defer cli.Close()

    ctx := context.Background()

    // List running containers
    containers, err := cli.ContainerList(ctx, container.ListOptions{All: false})
    if err != nil {
        log.Fatal(err)
    }

    for _, c := range containers {
        fmt.Printf("%-20s %-30s %s\n", c.ID[:12], c.Names[0], c.Status)
    }
}
\`\`\`

### Container Inspection and Stats

\`\`\`go
func inspectContainer(cli *client.Client, containerID string) {
    ctx := context.Background()

    info, err := cli.ContainerInspect(ctx, containerID)
    if err != nil {
        log.Printf("inspect %s: %v", containerID, err)
        return
    }

    fmt.Printf("Name:    %s\n", info.Name)
    fmt.Printf("Image:   %s\n", info.Config.Image)
    fmt.Printf("Status:  %s\n", info.State.Status)
    fmt.Printf("Started: %s\n", info.State.StartedAt)

    for port, bindings := range info.HostConfig.PortBindings {
        for _, b := range bindings {
            fmt.Printf("Port: %s -> %s\n", port, b.HostPort)
        }
    }
}

// Run a command inside a container
func execInContainer(cli *client.Client, containerID string, cmd []string) error {
    ctx := context.Background()

    exec, err := cli.ContainerExecCreate(ctx, containerID, types.ExecConfig{
        Cmd:          cmd,
        AttachStdout: true,
        AttachStderr: true,
    })
    if err != nil {
        return fmt.Errorf("create exec: %w", err)
    }

    resp, err := cli.ContainerExecAttach(ctx, exec.ID, types.ExecStartCheck{})
    if err != nil {
        return fmt.Errorf("attach exec: %w", err)
    }
    defer resp.Close()

    // Read output (Docker multiplexes stdout/stderr)
    _, err = stdcopy.StdCopy(os.Stdout, os.Stderr, resp.Reader)
    return err
}
\`\`\`

### Building and Pushing Images

\`\`\`go
func buildImage(cli *client.Client, contextDir, imageName string) error {
    ctx := context.Background()

    // Create a tar archive of the build context
    tar, err := archive.TarWithOptions(contextDir, &archive.TarOptions{})
    if err != nil {
        return fmt.Errorf("create build context: %w", err)
    }
    defer tar.Close()

    resp, err := cli.ImageBuild(ctx, tar, types.ImageBuildOptions{
        Tags:       []string{imageName},
        Dockerfile: "Dockerfile",
        Remove:     true,
    })
    if err != nil {
        return fmt.Errorf("build image: %w", err)
    }
    defer resp.Body.Close()

    // Stream build output
    return printBuildOutput(resp.Body)
}
\`\`\`

## Kubernetes client-go

client-go is the official Go client for the Kubernetes API — the same library kubectl uses internally.

\`\`\`bash
go get k8s.io/client-go@latest
go get k8s.io/api@latest
go get k8s.io/apimachinery@latest
\`\`\`

### Connecting to a Cluster

\`\`\`go
import (
    "k8s.io/client-go/kubernetes"
    "k8s.io/client-go/tools/clientcmd"
    "k8s.io/client-go/rest"
)

func buildClient() (*kubernetes.Clientset, error) {
    var config *rest.Config
    var err error

    // Inside a pod: use in-cluster config (ServiceAccount token)
    config, err = rest.InClusterConfig()
    if err != nil {
        // Outside cluster: use kubeconfig
        kubeconfig := filepath.Join(os.Getenv("HOME"), ".kube", "config")
        config, err = clientcmd.BuildConfigFromFlags("", kubeconfig)
        if err != nil {
            return nil, fmt.Errorf("build kubeconfig: %w", err)
        }
    }

    return kubernetes.NewForConfig(config)
}
\`\`\`

### Listing and Working with Resources

\`\`\`go
func listPods(clientset *kubernetes.Clientset, namespace string) {
    ctx := context.Background()

    pods, err := clientset.CoreV1().Pods(namespace).List(ctx, metav1.ListOptions{
        LabelSelector: "app=web,env=prod",
    })
    if err != nil {
        log.Fatal(err)
    }

    for _, pod := range pods.Items {
        fmt.Printf("%-40s %-10s %s\n",
            pod.Name,
            string(pod.Status.Phase),
            pod.Status.PodIP,
        )
    }
}

func getDeploymentStatus(clientset *kubernetes.Clientset, namespace, name string) error {
    ctx := context.Background()

    deploy, err := clientset.AppsV1().Deployments(namespace).Get(ctx, name, metav1.GetOptions{})
    if err != nil {
        return fmt.Errorf("get deployment %s: %w", name, err)
    }

    fmt.Printf("Deployment: %s\n", deploy.Name)
    fmt.Printf("Desired:    %d\n", *deploy.Spec.Replicas)
    fmt.Printf("Ready:      %d\n", deploy.Status.ReadyReplicas)
    fmt.Printf("Updated:    %d\n", deploy.Status.UpdatedReplicas)

    return nil
}

// Scale a deployment
func scaleDeployment(clientset *kubernetes.Clientset, namespace, name string, replicas int32) error {
    ctx := context.Background()

    scale, err := clientset.AppsV1().Deployments(namespace).GetScale(ctx, name, metav1.GetOptions{})
    if err != nil {
        return fmt.Errorf("get scale: %w", err)
    }

    scale.Spec.Replicas = replicas
    _, err = clientset.AppsV1().Deployments(namespace).UpdateScale(ctx, name, scale, metav1.UpdateOptions{})
    return err
}
\`\`\`

### Watching Resources — React to Changes

\`\`\`go
func watchPodEvents(clientset *kubernetes.Clientset, namespace string) {
    ctx := context.Background()

    watcher, err := clientset.CoreV1().Pods(namespace).Watch(ctx, metav1.ListOptions{
        LabelSelector: "app=web",
    })
    if err != nil {
        log.Fatal(err)
    }
    defer watcher.Stop()

    fmt.Println("Watching for pod changes...")
    for event := range watcher.ResultChan() {
        pod, ok := event.Object.(*corev1.Pod)
        if !ok {
            continue
        }

        switch event.Type {
        case watch.Added:
            fmt.Printf("[ADDED]   %s (%s)\n", pod.Name, pod.Status.Phase)
        case watch.Modified:
            fmt.Printf("[UPDATED] %s (%s)\n", pod.Name, pod.Status.Phase)
        case watch.Deleted:
            fmt.Printf("[DELETED] %s\n", pod.Name)
        }
    }
}
\`\`\`

### Simple Operator Pattern

A controller watches a resource and reconciles the desired state with actual state — this is the pattern used by Kubernetes operators:

\`\`\`go
type Controller struct {
    clientset *kubernetes.Clientset
    namespace string
}

func (c *Controller) Run(ctx context.Context) error {
    for {
        select {
        case <-ctx.Done():
            return nil
        case <-time.After(30 * time.Second):
            if err := c.reconcile(ctx); err != nil {
                log.Printf("reconcile error: %v", err)
            }
        }
    }
}

func (c *Controller) reconcile(ctx context.Context) error {
    // Get desired state (e.g., from a ConfigMap)
    desired, err := c.getDesiredConfig(ctx)
    if err != nil {
        return fmt.Errorf("get desired config: %w", err)
    }

    // Get actual state
    actual, err := c.getActualState(ctx)
    if err != nil {
        return fmt.Errorf("get actual state: %w", err)
    }

    // Compute diff and apply
    for _, change := range computeDiff(desired, actual) {
        if err := c.applyChange(ctx, change); err != nil {
            log.Printf("apply change %v: %v", change, err)
        }
    }

    return nil
}
\`\`\``,
        },
      ],
      exam: [
        { question: "You're building a CLI tool that needs configuration from three sources: a config file, environment variables, and command-line flags. What's the precedence order and how do you implement it with Cobra + Viper?", answer: "Precedence order (highest to lowest): command-line flags > environment variables > config file > defaults. Implementation: (1) Define flags with cobra: rootCmd.PersistentFlags().String('api-url', 'http://localhost', 'API URL'). (2) Bind flags to viper: viper.BindPFlag('api_url', cmd.Flags().Lookup('api-url')). (3) Set env prefix: viper.SetEnvPrefix('MYAPP'), viper.AutomaticEnv() — this maps MYAPP_API_URL to the 'api_url' key. (4) Load config file: viper.AddConfigPath('$HOME'), viper.SetConfigName('.myapp'), viper.ReadInConfig(). (5) Read values: viper.GetString('api_url') — Viper automatically applies the precedence.", difficulty: "mid" },
        { question: "How does the Kubernetes reconciliation loop pattern work and why does it eventually converge?", answer: "The reconciler continuously compares desired state (spec) with actual state (status) and applies the minimum changes to make them match. It converges because: (1) Each reconcile cycle reads current state fresh — it's not event-sourced, so stale data doesn't accumulate. (2) Changes are idempotent — applying the same change twice has the same result as applying it once. (3) If an error occurs, the loop retries — transient failures don't break convergence. (4) The reconciler doesn't store 'what it did last time' — it only looks at current state. This design means the controller is stateless and crash-safe: restarting it causes it to re-examine state and pick up where it left off.", difficulty: "senior" },
        { question: "Write pseudocode for a Go function that checks if a Kubernetes deployment is fully rolled out after an update, polling every 5 seconds with a 5-minute timeout.", answer: "func waitForRollout(ctx context.Context, client *kubernetes.Clientset, ns, name string) error { ctx, cancel := context.WithTimeout(ctx, 5*time.Minute); defer cancel(); for { deploy, err := client.AppsV1().Deployments(ns).Get(ctx, name, metav1.GetOptions{}); if err != nil { return err }; spec := deploy.Spec.Replicas; if deploy.Status.UpdatedReplicas == *spec && deploy.Status.ReadyReplicas == *spec && deploy.Status.AvailableReplicas == *spec && deploy.Generation == deploy.Status.ObservedGeneration { return nil // fully rolled out }; select { case <-ctx.Done(): return fmt.Errorf('timeout: deployment not ready'); case <-time.After(5*time.Second): } } }", difficulty: "senior" },
        { question: "A Go program using Docker SDK needs to run on both Linux (local Docker) and inside a Kubernetes pod that has access to a remote Docker registry. What connection approach handles both cases?", answer: "Use client.FromEnv() when creating the Docker client: 'client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())'. This reads DOCKER_HOST from the environment. On Linux with local Docker, DOCKER_HOST defaults to 'unix:///var/run/docker.sock'. For a remote Docker daemon, set DOCKER_HOST='tcp://registry-host:2376'. For a pod that needs to push images to a registry (not talk to a Docker daemon), use the Docker registry HTTP API directly or a library like google/go-containerregistry — Kubernetes pods typically don't mount Docker sockets. Separate concerns: Docker daemon access (for build/run) vs registry access (for push/pull).", difficulty: "senior" },
      ],
    },
  ],
};
