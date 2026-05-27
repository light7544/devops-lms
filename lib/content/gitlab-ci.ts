import type { Track } from "./types";

export const gitlabCiTrack: Track = {
  id: "gitlab-ci",
  title: "GitLab CI/CD",
  description: "Build, test, and deploy with GitLab CI/CD pipelines",
  longDescription:
    "Master GitLab CI/CD from basic pipelines to advanced multi-stage workflows — runners, caching, environments, security scanning, container registry, and GitLab-native DevSecOps patterns used at scale.",
  icon: "GitBranch",
  color: "#fc6d26",
  gradient: "track-gitlab-gradient",
  tags: ["ci-cd", "gitlab", "devops", "pipelines", "automation"],
  modules: [
    {
      id: "gitlab-ci-fundamentals",
      title: "GitLab CI/CD Fundamentals",
      level: "beginner",
      description: "Understand .gitlab-ci.yml structure, stages, jobs, and how GitLab pipelines execute.",
      lessons: [
        {
          id: "pipeline-basics",
          title: "Pipeline Structure: Stages, Jobs, and Scripts",
          duration: 30,
          type: "lesson",
          description: "Learn the anatomy of a GitLab CI/CD pipeline — how .gitlab-ci.yml works, how stages sequence jobs, and how job scripts execute.",
          objectives: [
            "Write a valid .gitlab-ci.yml with multiple stages",
            "Understand how GitLab executes stages sequentially and jobs in parallel",
            "Use variables, before_script, after_script, and rules",
            "Read pipeline output and diagnose failed jobs",
          ],
          content: `# GitLab CI/CD Pipeline Basics

## What is GitLab CI/CD?

GitLab CI/CD is built directly into GitLab — no separate server to install. Every push to a repository can trigger a pipeline defined in a \`.gitlab-ci.yml\` file at the root of the repo. The pipeline runs on **runners** (execution agents) and produces jobs that appear in the GitLab UI.

## The .gitlab-ci.yml File

\`\`\`yaml
# .gitlab-ci.yml — minimal working pipeline

stages:
  - build
  - test
  - deploy

build-app:
  stage: build
  script:
    - echo "Building application..."
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

unit-tests:
  stage: test
  script:
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'

lint:
  stage: test          # runs in parallel with unit-tests (same stage)
  script:
    - npm run lint

deploy-staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - main
\`\`\`

## How GitLab Executes Pipelines

**Stages execute sequentially** — all jobs in stage 1 must pass before stage 2 starts:

\`\`\`
Stage: build    → Stage: test       → Stage: deploy
  build-app     →   unit-tests      →   deploy-staging
                →   lint            →   deploy-prod
                →   security-scan   →
\`\`\`

**Jobs within a stage execute in parallel** (if enough runners are available).

If any job in a stage fails, the pipeline stops — subsequent stages don't run (unless configured otherwise with \`allow_failure: true\`).

## Job Structure

Every job in .gitlab-ci.yml follows the same structure:

\`\`\`yaml
job-name:          # unique name — shows in pipeline UI
  stage: build     # which stage this job belongs to
  image: node:20   # Docker image to run in (optional, uses runner default)

  before_script:   # runs before script — often used for setup
    - npm ci

  script:          # the commands that actually run
    - npm run build
    - npm run test

  after_script:    # always runs — even if script fails
    - echo "Cleanup done"

  artifacts:       # files to preserve between stages or for download
    paths:
      - dist/
      - coverage/
    expire_in: 7 days
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura.xml

  rules:           # when to run this job
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

  allow_failure: false  # true = pipeline continues even if this fails

  timeout: 10 minutes  # job-level timeout

  retry:
    max: 2        # retry failed jobs up to 2 times
    when:
      - runner_system_failure
      - stuck_or_timeout_failure
\`\`\`

## Predefined CI/CD Variables

GitLab injects dozens of variables into every job:

\`\`\`yaml
print-context:
  script:
    - echo "Branch: $CI_COMMIT_BRANCH"
    - echo "Commit SHA: $CI_COMMIT_SHA"
    - echo "Short SHA: $CI_COMMIT_SHORT_SHA"
    - echo "Tag: $CI_COMMIT_TAG"
    - echo "Pipeline ID: $CI_PIPELINE_ID"
    - echo "Job ID: $CI_JOB_ID"
    - echo "Project path: $CI_PROJECT_PATH"
    - echo "Registry: $CI_REGISTRY_IMAGE"
    - echo "Source: $CI_PIPELINE_SOURCE"  # push, merge_request_event, schedule, etc.
    - echo "Runner tags: $CI_RUNNER_TAGS"
\`\`\`

Key variables:

| Variable | Value |
|----------|-------|
| \`CI_COMMIT_BRANCH\` | Branch name (empty on tag pipelines) |
| \`CI_COMMIT_TAG\` | Tag name (empty on branch pipelines) |
| \`CI_COMMIT_SHA\` | Full 40-char commit SHA |
| \`CI_COMMIT_SHORT_SHA\` | First 8 chars of SHA |
| \`CI_PIPELINE_SOURCE\` | \`push\`, \`merge_request_event\`, \`schedule\`, \`api\`, \`trigger\` |
| \`CI_REGISTRY_IMAGE\` | Image path in GitLab Container Registry |
| \`CI_PROJECT_PATH\` | \`group/project\` |
| \`CI_ENVIRONMENT_NAME\` | Set when deploying to an environment |

## Controlling When Jobs Run: rules

\`rules\` replaces the older \`only\`/\`except\` syntax. More expressive:

\`\`\`yaml
deploy-prod:
  stage: deploy
  script:
    - ./deploy.sh production
  rules:
    # Only run on the main branch, but NOT on merge requests
    - if: '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE != "merge_request_event"'
      when: on_success    # run when previous stages passed
    # Allow manual trigger from any branch
    - when: manual
      allow_failure: true

security-scan:
  stage: test
  script:
    - ./scan.sh
  rules:
    # Run automatically on MR pipelines
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    # Run on main, but only if security-related files changed
    - if: '$CI_COMMIT_BRANCH == "main"'
      changes:
        - "Dockerfile"
        - "requirements*.txt"
        - "package*.json"

nightly-tests:
  stage: test
  script:
    - npm run test:e2e
  rules:
    # Only run on scheduled pipelines
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
\`\`\`

\`when\` options: \`on_success\` (default), \`on_failure\`, \`always\`, \`manual\`, \`never\`, \`delayed\`.

## Passing Data Between Jobs: artifacts

Jobs in later stages can use files from earlier jobs via artifacts:

\`\`\`yaml
build:
  stage: build
  script:
    - go build -o bin/app .
  artifacts:
    paths:
      - bin/
    expire_in: 1 hour

test:
  stage: test
  dependencies:
    - build           # download artifacts from the build job
  script:
    - ./bin/app --version    # use the built binary
    - go test ./...

deploy:
  stage: deploy
  dependencies:
    - build
  script:
    - scp bin/app prod-server:/usr/local/bin/app
\`\`\`

**By default**, GitLab automatically downloads artifacts from all previous stages. Use \`dependencies: []\` to disable downloads for a job that doesn't need them (faster startup).`,
        },
        {
          id: "runners",
          title: "GitLab Runners: Types, Executors, and Registration",
          duration: 25,
          type: "lesson",
          description: "Understand the different types of GitLab runners, executor modes, and how to register and configure self-hosted runners.",
          objectives: [
            "Distinguish between shared, group, and project runners",
            "Choose the right executor: shell, Docker, Kubernetes",
            "Register a self-hosted runner and configure it",
            "Use runner tags to target specific runners",
          ],
          content: `# GitLab Runners

## What is a Runner?

A runner is an agent that picks up CI jobs from GitLab and executes them. Runners can be:

- **Shared runners**: provided by GitLab.com, available to all projects (with usage limits on free tier)
- **Group runners**: registered to a GitLab group, available to all projects in the group
- **Project runners**: registered to a specific project only

## Runner Executors

The executor determines HOW a job runs on the runner:

### Docker Executor (Recommended)

Each job runs in a fresh Docker container. The \`image:\` field in your job specifies which container:

\`\`\`yaml
# Docker executor — clean environment per job
build:
  image: node:20-alpine
  stage: build
  script:
    - node --version
    - npm ci
    - npm run build
\`\`\`

Pros: clean state per job, any language via any image, no dependency conflicts.
Cons: Docker daemon must be accessible from the runner.

### Shell Executor

Jobs run directly on the runner machine in a shell (bash/PowerShell). Faster (no container overhead) but jobs share the runner's environment:

\`\`\`yaml
# Shell executor — runs directly on the machine
build:
  tags:
    - my-shell-runner   # target this specific runner
  stage: build
  script:
    - node --version    # uses whatever node is installed on the machine
    - npm ci
    - npm run build
\`\`\`

Use cases: builds that need hardware access (GPU, physical devices), running on Windows, or when container startup overhead is unacceptable.

### Kubernetes Executor

Each job runs as a Kubernetes pod. Auto-scales with cluster capacity:

\`\`\`yaml
# Each job becomes a pod in your K8s cluster
build:
  image: node:20
  stage: build
  script:
    - npm ci && npm run build
  # Runner creates a pod, mounts the repo, runs the script, tears down the pod
\`\`\`

Configure in \`config.toml\` on the runner:

\`\`\`toml
[[runners]]
  name = "k8s-runner"
  executor = "kubernetes"
  [runners.kubernetes]
    namespace = "gitlab-runners"
    image = "alpine:latest"
    cpu_request = "100m"
    cpu_limit = "2"
    memory_request = "128Mi"
    memory_limit = "2Gi"
\`\`\`

## Registering a Self-Hosted Runner

\`\`\`bash
# 1. Install gitlab-runner on your machine
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
sudo apt-get install gitlab-runner

# 2. Register it — you need the registration token from:
#    Project → Settings → CI/CD → Runners → New project runner
sudo gitlab-runner register \\
  --url "https://gitlab.com/" \\
  --token "glrt-xxxxxxxxxxxx" \\
  --name "my-docker-runner" \\
  --executor "docker" \\
  --docker-image "alpine:latest" \\
  --docker-volumes "/var/run/docker.sock:/var/run/docker.sock"

# 3. Start the runner
sudo gitlab-runner start
sudo gitlab-runner status
\`\`\`

The runner writes its config to \`/etc/gitlab-runner/config.toml\`:

\`\`\`toml
concurrent = 4          # max jobs this runner handles simultaneously
check_interval = 0

[[runners]]
  name = "my-docker-runner"
  url = "https://gitlab.com/"
  token = "glrt-xxxxxxxxxxxx"
  executor = "docker"

  [runners.docker]
    image = "alpine:latest"
    privileged = false
    disable_cache = false
    volumes = ["/cache", "/var/run/docker.sock:/var/run/docker.sock"]
    shm_size = 0
    pull_policy = ["if-not-present"]   # don't pull if image already exists locally

  [runners.cache]
    type = "s3"
    [runners.cache.s3]
      server_address = "s3.amazonaws.com"
      bucket_name = "my-gitlab-runner-cache"
      bucket_location = "us-east-1"
\`\`\`

## Runner Tags

Tags let you route jobs to specific runners — critical when different runners have different capabilities:

\`\`\`yaml
# Route to specific runner by tag
deploy-prod:
  tags:
    - production         # only runners tagged 'production' pick this up
    - aws-us-east-1     # AND tagged 'aws-us-east-1'
  script:
    - ./deploy.sh

# GPU-intensive ML job
train-model:
  tags:
    - gpu
    - high-memory
  script:
    - python train.py

# Build requiring Docker-in-Docker
docker-build:
  tags:
    - dind               # runner with Docker-in-Docker configured
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
\`\`\`

## Caching Dependencies

Cache node_modules, pip packages, Go modules between pipeline runs to speed up jobs:

\`\`\`yaml
variables:
  CACHE_VERSION: "v1"     # bump to invalidate all caches

.node-cache: &node-cache
  cache:
    key:
      files:
        - package-lock.json   # cache key based on lockfile hash
      prefix: "$CACHE_VERSION-node"
    paths:
      - node_modules/
    policy: pull-push         # pull at job start, push at job end

install:
  stage: build
  <<: *node-cache
  script:
    - npm ci

test:
  stage: test
  <<: *node-cache
  cache:
    policy: pull              # only pull cache, don't update it
  script:
    - npm test
\`\`\`

Cache policies:
- \`pull-push\`: download cache at start, upload at end (default)
- \`pull\`: only download — faster for read-only jobs
- \`push\`: only upload — use in jobs that generate the cache
- \`clear\`: delete the cache entry`,
        },
      ],
      exam: [
        { question: "You have 5 jobs in a single stage. How many jobs run simultaneously?", answer: "All 5 can run in parallel — jobs in the same stage run concurrently, limited only by available runners and the runner's 'concurrent' setting. If you have 5 idle runners, all 5 jobs start simultaneously. If you have 2 runners with concurrent=2 each, at most 4 jobs run at a time, and the 5th waits. The stage is only considered complete when all jobs in it have finished (passed or failed).", difficulty: "junior" },
        { question: "What is the difference between 'only/except' and 'rules' in GitLab CI?", answer: "Both control when jobs run, but 'rules' is newer, more expressive, and recommended. 'only/except' uses simple lists of branches, tags, and refs — limited to equality matching. 'rules' supports: 'if' with full expression syntax ($VAR == 'value', string matching), 'changes' (file path patterns), 'exists' (file existence checks), 'when' (on_success, manual, delayed), and 'allow_failure'. Rules are evaluated top-to-bottom and the first matching rule wins. GitLab recommends migrating to rules; only/except may be deprecated. Key difference: rules can set 'when: manual' per condition, allowing the same job to auto-run on some branches and be manual on others.", difficulty: "mid" },
        { question: "A job fails with 'This job is stuck, because the project doesn't have any runners online for this job.' How do you diagnose it?", answer: "This means no available runner can pick up the job. Diagnose: (1) Check if the job has 'tags:' that don't match any registered runner. Go to Settings → CI/CD → Runners and check runner tags. (2) Check if all runners are offline or paused. (3) If using shared runners on GitLab.com, check if you've exhausted your CI/CD minutes quota for the month. (4) Check if the runner is configured for Docker executor but the job requires a Docker image — if the runner's Docker daemon is down, it won't accept Docker jobs. (5) Check 'Run untagged jobs' — if the job has no tags, the runner must have 'Run untagged jobs' enabled.", difficulty: "junior" },
        { question: "How do you pass sensitive data (API keys, passwords) to GitLab CI jobs without storing them in .gitlab-ci.yml?", answer: "Use GitLab CI/CD Variables: Settings → CI/CD → Variables. These are injected as environment variables in every job. Mark sensitive variables as 'Masked' (redacted from job logs) and 'Protected' (only available in protected branches/tags). Reference in jobs: $MY_SECRET or $MY_SECRET (with braces). For group-wide secrets, use Group-level Variables (Settings → CI/CD → Variables at the group level). For secrets that rotate or need audit trails, use an external vault: integrate with HashiCorp Vault via the CI_JOB_JWT token or use GitLab's built-in Vault integration (Settings → CI/CD → Secrets). Never commit secrets in .gitlab-ci.yml even in encrypted form.", difficulty: "junior" },
      ],
    },
    {
      id: "gitlab-ci-advanced",
      title: "Advanced Pipeline Patterns",
      level: "intermediate",
      description: "Master pipeline templates, dynamic child pipelines, environments, artifacts, and GitLab-specific features.",
      lessons: [
        {
          id: "pipeline-templates",
          title: "Includes, Templates, and Reusable Jobs",
          duration: 30,
          type: "lesson",
          description: "Eliminate duplication with include, extends, and YAML anchors — share pipeline logic across jobs and projects.",
          objectives: [
            "Use include to compose pipelines from multiple files",
            "Extend jobs with extends and YAML anchors",
            "Share pipeline templates across projects with includes from other repos",
            "Use hidden jobs as base templates",
          ],
          content: `# Includes, Templates, and Reusable Jobs

## The Problem: Pipeline Duplication

Without reuse, every project copy-pastes the same Docker build, security scan, and deploy logic. One bug fix requires updating 20 pipelines.

## include — Compose Pipelines from Files

\`\`\`yaml
# .gitlab-ci.yml — main file
include:
  # Include from the same repo
  - local: '.gitlab/ci/build.yml'
  - local: '.gitlab/ci/deploy.yml'

  # Include from another project in the same GitLab instance
  - project: 'mygroup/pipeline-templates'
    ref: 'main'
    file: '/templates/docker-build.yml'

  # Include GitLab's built-in templates
  - template: 'Security/SAST.gitlab-ci.yml'
  - template: 'Security/Dependency-Scanning.gitlab-ci.yml'

  # Include from a remote URL
  - remote: 'https://raw.githubusercontent.com/myorg/ci-templates/main/node.yml'

# You can still define jobs in the main file
# Jobs from included files are merged with jobs here
deploy-production:
  stage: deploy
  script:
    - ./deploy.sh prod
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
\`\`\`

\`\`\`yaml
# .gitlab/ci/build.yml — shared build template
stages:
  - build
  - test

build-docker:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
\`\`\`

## extends — Inherit Job Configuration

\`extends\` lets one job inherit all fields from a base job and override specific ones:

\`\`\`yaml
# Hidden job (starts with '.') — never runs directly, used as base
.deploy-base:
  stage: deploy
  image: bitnami/kubectl:latest
  before_script:
    - kubectl config use-context $KUBE_CONTEXT
  script:
    - kubectl set image deployment/$APP_NAME app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA -n $NAMESPACE
    - kubectl rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=5m
  after_script:
    - kubectl get pods -n $NAMESPACE -l app=$APP_NAME

# Concrete jobs that inherit from the base
deploy-staging:
  extends: .deploy-base
  variables:
    NAMESPACE: staging
    APP_NAME: web
    KUBE_CONTEXT: mygroup/myproject:staging-agent
  environment:
    name: staging
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

deploy-production:
  extends: .deploy-base
  variables:
    NAMESPACE: production
    APP_NAME: web
    KUBE_CONTEXT: mygroup/myproject:production-agent
  environment:
    name: production
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: manual          # requires human approval
  allow_failure: false
\`\`\`

## YAML Anchors — DRY Config

YAML anchors (\`&\`) and aliases (\`*\`) let you reuse YAML blocks within the same file:

\`\`\`yaml
# Define a reusable block with &
.node-setup: &node-setup
  image: node:20-alpine
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
  before_script:
    - npm ci

# Use it with * (merges with <<: *)
unit-tests:
  <<: *node-setup
  stage: test
  script:
    - npm test

lint:
  <<: *node-setup
  stage: test
  script:
    - npm run lint

coverage:
  <<: *node-setup
  stage: test
  script:
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura.xml
\`\`\`

## Shared Templates Across Projects

Create a \`pipeline-templates\` project in your group and include from there:

\`\`\`yaml
# mygroup/pipeline-templates: templates/docker-build.yml
.docker-build:
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
    DOCKER_BUILDKIT: "1"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - |
      docker buildx build \\
        --platform linux/amd64 \\
        --cache-from $CI_REGISTRY_IMAGE:cache \\
        --cache-to type=registry,ref=$CI_REGISTRY_IMAGE:cache,mode=max \\
        --tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA \\
        --tag $CI_REGISTRY_IMAGE:latest \\
        --push \\
        .
\`\`\`

\`\`\`yaml
# In any project's .gitlab-ci.yml:
include:
  - project: 'mygroup/pipeline-templates'
    ref: 'v1.2.0'        # pin to a version tag
    file: '/templates/docker-build.yml'

build:
  extends: .docker-build
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
\`\`\`

## needs — DAG Pipelines (Skip Stage Ordering)

By default, stages are sequential. \`needs:\` lets jobs start as soon as their dependencies are done, regardless of stage:

\`\`\`yaml
stages:
  - build
  - test
  - scan
  - deploy

build-backend:
  stage: build
  script: go build -o bin/api .
  artifacts:
    paths: [bin/]

build-frontend:
  stage: build
  script: npm run build
  artifacts:
    paths: [dist/]

# Starts as soon as build-backend finishes — doesn't wait for build-frontend
test-backend:
  stage: test
  needs: [build-backend]   # explicit dependency
  script: go test ./...

# Starts as soon as build-frontend finishes
test-frontend:
  stage: test
  needs: [build-frontend]
  script: npm test

# Starts as soon as BOTH build jobs finish — doesn't wait for tests
security-scan:
  stage: scan
  needs: [build-backend, build-frontend]
  script: ./scan.sh

# Only runs after tests AND scan pass
deploy-staging:
  stage: deploy
  needs: [test-backend, test-frontend, security-scan]
  script: ./deploy.sh staging
\`\`\`

With \`needs:\`, your pipeline becomes a DAG (Directed Acyclic Graph) — total pipeline time can be much shorter than strict stage sequencing.`,
        },
        {
          id: "environments-deployments",
          title: "Environments, Deployments, and Protected Branches",
          duration: 30,
          type: "lesson",
          description: "Use GitLab environments to track deployments, control who can deploy to production, and implement deployment review workflows.",
          objectives: [
            "Define and use environments in pipeline jobs",
            "Implement protected environments with deployment approvals",
            "Use environment-scoped variables",
            "Implement stop environments and review apps",
          ],
          content: `# GitLab Environments and Deployments

## What are Environments?

Environments in GitLab track WHERE your code is deployed. Each successful deploy job targeting an environment creates a deployment record. This gives you:

- A history of what was deployed when and by whom
- One-click rollback to a previous deployment
- Live vs stopped status per environment
- Environment-scoped CI/CD variables

## Defining Environments

\`\`\`yaml
deploy-staging:
  stage: deploy
  script:
    - ./deploy.sh staging
  environment:
    name: staging
    url: https://staging.example.com    # shown as a link in the GitLab UI
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

deploy-production:
  stage: deploy
  script:
    - ./deploy.sh production
  environment:
    name: production
    url: https://example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: manual        # requires clicking "Play" in the UI
\`\`\`

## Environment-Scoped Variables

Variables can be scoped to specific environments — different DATABASE_URL per env:

\`\`\`
Settings → CI/CD → Variables:

Variable: DATABASE_URL
Value: postgres://dev-host/dev_db
Environment scope: staging

Variable: DATABASE_URL
Value: postgres://prod-host/prod_db
Environment scope: production
\`\`\`

\`\`\`yaml
deploy-staging:
  environment:
    name: staging
  script:
    - echo "Connecting to: $DATABASE_URL"   # gets the staging value

deploy-production:
  environment:
    name: production
  script:
    - echo "Connecting to: $DATABASE_URL"   # gets the production value
\`\`\`

## Protected Environments — Deployment Approvals

Prevent unauthorized production deployments:

\`\`\`
Settings → CI/CD → Protected environments:
- Environment name: production
- Allowed to deploy: Maintainers
- Required approvals: 2
\`\`\`

When a job targets the \`production\` environment, GitLab will:
1. Pause the job and send notifications to eligible approvers
2. Show the deployment in the environment page awaiting approval
3. Only run the job after the required number of approvals

\`\`\`yaml
deploy-production:
  stage: deploy
  script:
    - ./deploy.sh production
  environment:
    name: production      # protected — requires 2 approver clicks
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
\`\`\`

## Review Apps — Ephemeral Preview Environments

Review apps spin up a temporary environment per merge request, so reviewers can preview the actual running app:

\`\`\`yaml
deploy-review:
  stage: deploy
  script:
    - ./deploy.sh review-$CI_MERGE_REQUEST_IID    # unique per MR
  environment:
    name: review/$CI_COMMIT_REF_SLUG              # e.g., review/feature-login
    url: https://$CI_COMMIT_REF_SLUG.review.example.com
    on_stop: stop-review                          # what job tears it down
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'

stop-review:
  stage: deploy
  script:
    - ./teardown.sh review-$CI_MERGE_REQUEST_IID
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop                    # marks the environment as stopped
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: manual                  # can be triggered manually
  variables:
    GIT_STRATEGY: none              # don't check out code — just tear down
\`\`\`

GitLab automatically shows the review app URL on the merge request page. When the MR is merged or closed, GitLab offers to run the \`stop-review\` job.

## Deployment Safety: auto_stop_in

Automatically stop environments after a period of inactivity:

\`\`\`yaml
deploy-review:
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: https://$CI_COMMIT_REF_SLUG.review.example.com
    auto_stop_in: 1 week      # stop after 1 week if not updated
    on_stop: stop-review
\`\`\`

## Tracking Deployments with release:

Create a GitLab Release alongside a deployment:

\`\`\`yaml
stages:
  - build
  - release

release-job:
  stage: release
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  rules:
    - if: '$CI_COMMIT_TAG'     # only on tags
  script:
    - echo "Creating release for $CI_COMMIT_TAG"
  release:
    name: "Release $CI_COMMIT_TAG"
    tag_name: "$CI_COMMIT_TAG"
    description: "$CI_COMMIT_TAG_MESSAGE"
    assets:
      links:
        - name: "Docker image"
          url: "https://registry.gitlab.com/mygroup/myapp:$CI_COMMIT_TAG"
\`\`\``,
        },
        {
          id: "docker-container-registry",
          title: "Docker Builds and GitLab Container Registry",
          duration: 25,
          type: "lesson",
          description: "Build and push Docker images to GitLab's built-in Container Registry with caching, multi-stage builds, and image signing.",
          objectives: [
            "Authenticate to GitLab Container Registry from CI jobs",
            "Build and push images with BuildKit caching",
            "Tag images with commit SHA and semantic versions",
            "Scan images for vulnerabilities using GitLab's built-in scanner",
          ],
          content: `# Docker Builds and GitLab Container Registry

## GitLab Container Registry

Every GitLab project gets a built-in container registry at:
\`registry.gitlab.com/group/project\`

CI jobs can authenticate automatically using built-in variables:
- \`$CI_REGISTRY\`: registry hostname
- \`$CI_REGISTRY_IMAGE\`: full image path for this project
- \`$CI_REGISTRY_USER\`: login username
- \`$CI_REGISTRY_PASSWORD\`: login password (job token)

## Standard Docker Build Job

\`\`\`yaml
variables:
  DOCKER_TLS_CERTDIR: "/certs"

build-and-push:
  stage: build
  image: docker:24
  services:
    - docker:24-dind    # Docker-in-Docker
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - |
      docker build \\
        --tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA \\
        --tag $CI_REGISTRY_IMAGE:latest \\
        .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
\`\`\`

## BuildKit with Registry Cache

Registry-based caching means cache persists across all runner instances — not just one machine:

\`\`\`yaml
variables:
  DOCKER_BUILDKIT: "1"
  DOCKER_TLS_CERTDIR: "/certs"
  IMAGE: $CI_REGISTRY_IMAGE

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - |
      docker buildx create --use --name mybuilder || true
      docker buildx build \\
        --platform linux/amd64 \\
        --cache-from type=registry,ref=$IMAGE:cache \\
        --cache-to   type=registry,ref=$IMAGE:cache,mode=max \\
        --tag $IMAGE:$CI_COMMIT_SHORT_SHA \\
        --push \\
        .
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
\`\`\`

## Tagging Strategy

\`\`\`yaml
build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    # Always tag with commit SHA (immutable reference)
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

    # Tag branch name (mutable — use for dev/staging references)
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG

release-image:
  stage: release
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    # Pull the SHA-tagged image built earlier
    - docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
    # Tag with the semantic version from the git tag
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG
    - docker push $CI_REGISTRY_IMAGE:latest
  rules:
    - if: '$CI_COMMIT_TAG'    # only on version tags like v1.2.3

\`\`\`

## GitLab Container Scanning (Built-in)

GitLab Ultimate/Gold includes Trivy-based container scanning:

\`\`\`yaml
include:
  - template: Security/Container-Scanning.gitlab-ci.yml

container_scanning:
  variables:
    CS_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
    CS_SEVERITY_THRESHOLD: HIGH    # fail on HIGH or CRITICAL vulnerabilities
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
\`\`\`

For GitLab Free, use Trivy directly:

\`\`\`yaml
trivy-scan:
  stage: test
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  script:
    - trivy image
        --exit-code 1
        --severity HIGH,CRITICAL
        --no-progress
        --format sarif
        --output trivy-results.sarif
        $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
  artifacts:
    when: always
    reports:
      sast: trivy-results.sarif    # shows results in GitLab Security tab
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
\`\`\`

## Using the Image in Deploy Jobs

Always deploy by digest — not by tag:

\`\`\`yaml
build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
    # Capture the immutable digest
    - DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA)
    - echo "IMAGE_DIGEST=$DIGEST" >> build.env
  artifacts:
    reports:
      dotenv: build.env      # exports IMAGE_DIGEST as a variable to downstream jobs

deploy:
  stage: deploy
  needs:
    - job: build
      artifacts: true        # download the dotenv artifact
  script:
    # Use $IMAGE_DIGEST — immutable, guaranteed same image that was built
    - kubectl set image deployment/app app=$IMAGE_DIGEST -n production
\`\`\``,
        },
      ],
      exam: [
        { question: "You want to share a common Docker build job across 20 projects without duplicating YAML. How do you implement this in GitLab?", answer: "Create a 'pipeline-templates' project in your GitLab group. Define a hidden job (starting with '.') like '.docker-build' in a template file (e.g., templates/docker-build.yml). In each project's .gitlab-ci.yml, use 'include: project: mygroup/pipeline-templates ref: v1.0.0 file: /templates/docker-build.yml', then 'extends: .docker-build'. Pin the ref to a tag for stability — not 'main', which could change. For urgent security fixes to the build process, you only update the template project; projects that pin to 'latest' inherit the fix, while those on tags need a deliberate bump.", difficulty: "mid" },
        { question: "What is the 'needs:' keyword in GitLab CI and how does it differ from stages?", answer: "Stages enforce sequential execution globally — stage N only starts when all jobs in stage N-1 finish. 'needs:' creates job-level dependencies, allowing a job to start as soon as its specific dependencies complete, regardless of stage. This turns the pipeline from a sequential stage graph into a DAG (Directed Acyclic Graph). Example: if 'build-backend' and 'build-frontend' are in the same stage and 'test-backend' needs only 'build-backend', test-backend can start as soon as backend is built — without waiting for frontend. This significantly reduces total pipeline time for large pipelines. Caveat: jobs with 'needs:' bypass stage ordering, so be explicit about all dependencies.", difficulty: "mid" },
        { question: "How do you ensure only specific people can deploy to production in GitLab CI?", answer: "Use Protected Environments: Settings → CI/CD → Protected environments → Add 'production'. Set 'Allowed to deploy' to a specific role (Maintainers) or specific users/groups. Optionally set 'Required approvals' to 2. Any job targeting the 'production' environment will pause for approval. Additionally: protect the 'main' branch (Settings → Repository → Protected branches) so only Maintainers can push. This ensures the pipeline that deploys to production can only be triggered by authorized commits. For extra safety, combine with environment-scoped variables so production credentials are only available to the production environment.", difficulty: "senior" },
        { question: "A merge request pipeline takes 45 minutes. Half that time is waiting for npm install. How do you optimize it?", answer: "Use GitLab CI cache with a key based on the package-lock.json hash: 'cache: key: files: [package-lock.json] paths: [node_modules/] policy: pull-push'. This caches node_modules between pipeline runs. The first run after package-lock.json changes will be slow; subsequent runs are fast. Fine-tune: in the install job use 'policy: pull-push' (default), in test/lint jobs use 'policy: pull' (only download, don't re-upload). Also use npm ci with the --prefer-offline flag to use the cache without network fallback. For Docker builds, use registry-backed BuildKit cache so even fresh runners benefit from previous build layers.", difficulty: "mid" },
      ],
    },
    {
      id: "gitlab-devsecops",
      title: "GitLab DevSecOps and Production Workflows",
      level: "advanced",
      description: "Integrate security scanning, multi-project pipelines, Kubernetes deployments, and GitLab Flow into real-world production workflows.",
      lessons: [
        {
          id: "security-scanning",
          title: "GitLab Security Scanning: SAST, DAST, and Dependency Scanning",
          duration: 30,
          type: "lesson",
          description: "Integrate GitLab's built-in security scanners into pipelines to catch vulnerabilities before they reach production.",
          objectives: [
            "Enable SAST, dependency scanning, and secret detection with template includes",
            "Configure DAST for running API and web scans",
            "Review security findings in merge requests and the security dashboard",
            "Use compliance pipelines to enforce scanning across all projects",
          ],
          content: `# GitLab Security Scanning

## GitLab's Built-in Security Scanners

GitLab provides security scanning templates that integrate with the Security Dashboard and MR widgets. Include them and they just work:

\`\`\`yaml
# .gitlab-ci.yml
include:
  - template: Security/SAST.gitlab-ci.yml                  # static code analysis
  - template: Security/Dependency-Scanning.gitlab-ci.yml   # known CVEs in dependencies
  - template: Security/Secret-Detection.gitlab-ci.yml      # API keys, tokens in code
  - template: Security/Container-Scanning.gitlab-ci.yml    # CVEs in Docker images
  - template: Security/DAST.gitlab-ci.yml                  # dynamic app scanning

stages:
  - build
  - test
  - dast
  - deploy

# SAST, dependency scanning, and secret detection run in test stage automatically

# Configure DAST (dynamic testing against a running app)
dast:
  variables:
    DAST_WEBSITE: https://staging.example.com
    DAST_SPIDER_MINS: 3
    DAST_FULL_SCAN_ENABLED: "false"   # use baseline scan (faster)
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
\`\`\`

When security jobs run, GitLab:
- Shows vulnerability count in the MR widget ("3 new Critical vulnerabilities")
- Populates the Security Dashboard (Project → Security → Dashboard)
- Blocks MR merges if Critical vulnerabilities are found (configurable)

## SAST — Detect Code Vulnerabilities

SAST (Static Application Security Testing) analyzes source code without running it:

\`\`\`yaml
include:
  - template: Security/SAST.gitlab-ci.yml

# Override SAST settings
sast:
  variables:
    SAST_EXCLUDED_PATHS: "spec,test,tests,tmp"
    SAST_EXCLUDED_ANALYZERS: "spotbugs"   # exclude Java analyzer for Node projects
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'
\`\`\`

GitLab runs language-appropriate analyzers:
- JavaScript/TypeScript: ESLint Security, Semgrep
- Python: Bandit, Semgrep
- Go: Gosec, Semgrep
- Java: SpotBugs, Semgrep
- Ruby: Brakeman

## Secret Detection — Catch Leaked Credentials

\`\`\`yaml
include:
  - template: Security/Secret-Detection.gitlab-ci.yml

secret_detection:
  variables:
    SECRET_DETECTION_HISTORIC_SCAN: "true"   # scan entire git history, not just new commits
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
\`\`\`

Detects patterns like AWS keys, GitHub tokens, private keys, Stripe keys. Results appear in the MR and can block merges.

## Custom Security Scanning

For teams not using GitLab Ultimate, run scanners directly:

\`\`\`yaml
sast-semgrep:
  stage: test
  image: returntocorp/semgrep
  script:
    - semgrep ci
        --config auto
        --sarif
        --output semgrep-results.sarif
  artifacts:
    when: always
    reports:
      sast: semgrep-results.sarif    # shows in GitLab Security tab
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'

dependency-check:
  stage: test
  image: owasp/dependency-check
  script:
    - /usr/share/dependency-check/bin/dependency-check.sh
        --project "$CI_PROJECT_NAME"
        --scan .
        --format ALL
        --out dependency-check-report
  artifacts:
    when: always
    paths:
      - dependency-check-report/
  allow_failure: true    # don't block pipeline — report only
\`\`\`

## Compliance Pipelines — Enforce Security Across All Projects

For groups that must ensure every project runs security scans (SOC2, PCI-DSS):

\`\`\`yaml
# In a compliance framework project:
# compliance-framework/.gitlab-ci.yml

stages:
  - pre-compliance
  - build
  - test
  - post-compliance
  - deploy

# These jobs inject into every project using this compliance framework
compliance-sast:
  stage: test
  trigger:
    include:
      - template: Security/SAST.gitlab-ci.yml

# Project's own jobs go here — but compliance jobs cannot be overridden
\`\`\`

Set at: Group → Settings → Security and Compliance → Compliance framework → Pipeline configuration.`,
        },
        {
          id: "multi-project-pipelines",
          title: "Multi-Project Pipelines and GitLab Flow",
          duration: 35,
          type: "lesson",
          description: "Trigger downstream pipelines across projects, use child/parent pipelines for monorepos, and implement GitLab Flow for release management.",
          objectives: [
            "Trigger downstream pipelines in other projects",
            "Use parent-child pipelines for monorepos",
            "Implement GitLab Flow branching strategy",
            "Pass variables between pipelines",
          ],
          content: `# Multi-Project Pipelines and GitLab Flow

## Multi-Project Pipelines

When services are in separate repos but must be deployed together, multi-project pipelines coordinate them:

\`\`\`yaml
# In the 'api' project — triggers deployment of 'frontend' and 'worker'
stages:
  - build
  - deploy
  - trigger-downstream

build-api:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

deploy-api:
  stage: deploy
  script:
    - ./deploy.sh api $CI_COMMIT_SHORT_SHA staging

trigger-frontend-deploy:
  stage: trigger-downstream
  trigger:
    project: mygroup/frontend     # trigger a pipeline in this project
    branch: main
    strategy: depend              # wait for triggered pipeline to complete
  variables:
    API_VERSION: $CI_COMMIT_SHORT_SHA    # pass context to downstream
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
\`\`\`

The triggered project (\`frontend\`) receives the variables and can use them:

\`\`\`yaml
# In the 'frontend' project — triggered by api project
deploy-frontend:
  stage: deploy
  script:
    - echo "Deploying frontend against API version $API_VERSION"
    - ./deploy.sh frontend $CI_COMMIT_SHORT_SHA staging
\`\`\`

## Parent-Child Pipelines for Monorepos

A monorepo with multiple services benefits from child pipelines — each service has its own .gitlab-ci.yml:

\`\`\`yaml
# Root .gitlab-ci.yml — parent pipeline
stages:
  - detect-changes
  - trigger

# Detect which directories changed using git diff
detect:
  stage: detect-changes
  script:
    - |
      CHANGED=$(git diff --name-only $CI_MERGE_REQUEST_DIFF_BASE_SHA $CI_COMMIT_SHA 2>/dev/null || git diff --name-only HEAD~1 HEAD)
      echo "SERVICES_CHANGED=$(echo $CHANGED | grep -oP 'services/\K[^/]+' | sort -u | tr '\n' ',')" >> detect.env
  artifacts:
    reports:
      dotenv: detect.env

trigger-api:
  stage: trigger
  needs: [detect]
  rules:
    - if: '$SERVICES_CHANGED =~ /api/'
  trigger:
    include: services/api/.gitlab-ci.yml   # child pipeline
    strategy: depend

trigger-frontend:
  stage: trigger
  needs: [detect]
  rules:
    - if: '$SERVICES_CHANGED =~ /frontend/'
  trigger:
    include: services/frontend/.gitlab-ci.yml
    strategy: depend

trigger-worker:
  stage: trigger
  needs: [detect]
  rules:
    - if: '$SERVICES_CHANGED =~ /worker/'
  trigger:
    include: services/worker/.gitlab-ci.yml
    strategy: depend
\`\`\`

\`\`\`yaml
# services/api/.gitlab-ci.yml — child pipeline (runs independently)
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - cd services/api && docker build -t $CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHORT_SHA .
    - docker push $CI_REGISTRY_IMAGE/api:$CI_COMMIT_SHORT_SHA

test:
  stage: test
  script:
    - cd services/api && go test ./...
\`\`\`

## Dynamic Child Pipelines

Generate pipeline YAML programmatically — useful when services are discovered at runtime:

\`\`\`yaml
# Parent pipeline generates child pipeline YAML
generate-pipelines:
  stage: generate
  script:
    - python3 scripts/generate_ci.py > generated-pipeline.yml
    - cat generated-pipeline.yml  # for debugging
  artifacts:
    paths:
      - generated-pipeline.yml

run-generated:
  stage: run
  needs: [generate-pipelines]
  trigger:
    include:
      - artifact: generated-pipeline.yml
        job: generate-pipelines
    strategy: depend
\`\`\`

\`\`\`python
# scripts/generate_ci.py — Python generates the YAML
import os, yaml

services = ["auth", "payments", "notifications", "search"]
jobs = {}

for svc in services:
    jobs[f"build-{svc}"] = {
        "stage": "build",
        "script": [f"cd services/{svc}", "docker build -t $CI_REGISTRY_IMAGE/{svc}:$CI_COMMIT_SHORT_SHA ."],
    }

print(yaml.dump({"stages": ["build"], **jobs}))
\`\`\`

## GitLab Flow — Branching Strategy

GitLab Flow extends GitHub Flow with environment branches:

\`\`\`
feature/* → main (development)
main      → pre-production (testing)
pre-production → production (stable releases)
\`\`\`

Or with release branches for versioned software:

\`\`\`
feature/* → main (ongoing development)
main      → release-1.x (cut release branch for each minor version)
release-1.x → cherry-pick fixes only (no direct feature work)
\`\`\`

**GitLab Flow implementation:**

\`\`\`yaml
# Deploy when pushed to each environment branch
deploy-dev:
  stage: deploy
  script:
    - ./deploy.sh dev $CI_COMMIT_SHORT_SHA
  environment:
    name: development
    url: https://dev.example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

deploy-staging:
  stage: deploy
  script:
    - ./deploy.sh staging $CI_COMMIT_SHORT_SHA
  environment:
    name: staging
    url: https://staging.example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "pre-production"'

deploy-production:
  stage: deploy
  script:
    - ./deploy.sh production $CI_COMMIT_SHORT_SHA
  environment:
    name: production
    url: https://example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "production"'
      when: manual    # explicit human approval
\`\`\`

**Promotion workflow:**

\`\`\`bash
# 1. Feature merged to main → deploys to dev automatically

# 2. QA signs off → promote to staging
git checkout pre-production
git merge main
git push origin pre-production
# → triggers staging deployment automatically

# 3. Staging validated → promote to production
git checkout production
git merge pre-production
git push origin production
# → triggers production deployment (manual job requires approval)
\`\`\`

## Complete Production Pipeline

A full production-ready .gitlab-ci.yml combining all patterns:

\`\`\`yaml
stages:
  - build
  - test
  - security
  - release
  - deploy

include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml

variables:
  IMAGE: $CI_REGISTRY_IMAGE
  DOCKER_TLS_CERTDIR: "/certs"

# Build once, promote the same image
build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker buildx create --use || true
    - docker buildx build
        --cache-from type=registry,ref=$IMAGE:cache
        --cache-to   type=registry,ref=$IMAGE:cache,mode=max
        --tag $IMAGE:$CI_COMMIT_SHORT_SHA
        --push .
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'

unit-tests:
  stage: test
  image: golang:1.22
  needs: []           # doesn't need build artifacts — runs in parallel
  script:
    - go test -race -coverprofile=coverage.out ./...
    - go tool cover -func=coverage.out
  coverage: '/total:\s+\(statements\)\s+(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml

container-scan:
  stage: security
  image:
    name: aquasec/trivy:latest
    entrypoint: [""]
  needs: [build]
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - trivy image --exit-code 1 --severity HIGH,CRITICAL --no-progress $IMAGE:$CI_COMMIT_SHORT_SHA
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'

deploy-staging:
  stage: deploy
  image: bitnami/kubectl:latest
  needs: [unit-tests, container-scan]
  script:
    - kubectl set image deployment/app app=$IMAGE:$CI_COMMIT_SHORT_SHA -n staging
    - kubectl rollout status deployment/app -n staging --timeout=5m
  environment:
    name: staging
    url: https://staging.example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'

deploy-production:
  stage: deploy
  image: bitnami/kubectl:latest
  needs: [deploy-staging]
  script:
    - kubectl set image deployment/app app=$IMAGE:$CI_COMMIT_SHORT_SHA -n production
    - kubectl rollout status deployment/app -n production --timeout=10m
  environment:
    name: production
    url: https://example.com
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: manual
\`\`\``,
        },
      ],
      exam: [
        { question: "How does GitLab CI differ from GitHub Actions in its approach to pipeline structure?", answer: "GitLab CI uses a single .gitlab-ci.yml with a flat job list organized by stages. All jobs across all stages are defined in one file (or composed via include). GitHub Actions uses workflow files where each file is an independent workflow triggered by events. GitLab's stage model is more explicit about execution order — stage N only starts after stage N-1 completes. GitHub Actions jobs are more loosely coupled with 'needs:' for dependencies. GitLab has built-in concepts (environments, review apps, protected environments with approval gates) that require external actions in GitHub. GitLab's runners use a simple tagging system vs GitHub's label-based routing. For monorepos, GitLab's parent-child pipelines are more powerful than GitHub's path filter + matrix approach.", difficulty: "mid" },
        { question: "A pipeline is using 'trigger: project: strategy: depend'. The upstream pipeline shows success but the downstream job shows as cancelled. What could cause this?", answer: "The downstream pipeline was cancelled either manually, by a timeout, or by a newer pipeline run. When 'strategy: depend' is used, the upstream job mirrors the downstream pipeline's status. If the downstream project has 'auto-cancel redundant pipelines' enabled (Settings → CI/CD → Auto DevOps), a newer push to that branch would cancel the triggered pipeline. Also check: (1) the downstream pipeline's overall status — it might have been cancelled by a user; (2) whether the downstream project has a pipeline timeout shorter than the triggered pipeline's runtime; (3) whether the trigger token (project access token or trigger token) expired or was revoked.", difficulty: "senior" },
        { question: "You need to run 3 different test suites (unit, integration, e2e) but they all need a running database. How do you configure this in GitLab CI?", answer: "Use the 'services:' keyword to start a PostgreSQL container alongside the test job: 'services: - postgres:15 with alias: postgres'. All three test jobs define the same service. Set environment variables for DB connection: POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD as job variables (or group CI/CD variables for security). The service is accessible at the hostname matching the alias ('postgres'). For parallel execution: put all three jobs in the same 'test' stage — they run concurrently, each with their own Postgres service container. For shared state (e.g., integration tests need unit test artifacts), use 'needs:' to chain them and 'artifacts:' to pass data between jobs.", difficulty: "mid" },
        { question: "What is the GitLab CI 'dotenv' artifact report and when would you use it?", answer: "A dotenv artifact ('artifacts: reports: dotenv: vars.env') reads a file of KEY=VALUE pairs produced by a job and exposes those as CI/CD variables in downstream jobs (via 'needs: artifacts: true'). This is the primary mechanism for passing computed values between jobs. Use cases: (1) a build job computes the Docker image digest and passes it to a deploy job — so deploy uses the exact image hash, not a tag; (2) a version-detection job reads the version from package.json and passes it to release and tagging jobs; (3) a change-detection job determines which services changed and passes boolean flags to conditional trigger jobs. The dotenv file format is simply 'KEY=value' on each line, no quoting needed for simple strings.", difficulty: "mid" },
        { question: "How do you implement a blue-green deployment with manual promotion in GitLab CI?", answer: "Tag the 'blue' environment as the current production and 'green' as the new deployment. The pipeline: (1) deploy-green job deploys the new version to the green environment (auto on merge to main); (2) smoke-test-green job runs health checks against green; (3) promote-green job (when: manual) updates the load balancer/ingress to route traffic to green; (4) stop-blue job (when: manual, runs after promote) tears down the old blue environment. Use GitLab environments: 'name: production-green' and 'name: production-blue'. Environment variables CI_ENVIRONMENT_NAME differentiate them. The manual 'promote' job calls your load balancer API (ALB target group swap, nginx upstream update, or Kubernetes service selector change).", difficulty: "senior" },
      ],
    },
  ],
};
