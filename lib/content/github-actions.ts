import type { Track } from "./types";

export const githubActionsTrack: Track = {
  id: "github-actions",
  title: "GitHub Actions",
  description: "Build production CI/CD pipelines with GitHub Actions",
  longDescription:
    "Master GitHub Actions from workflow syntax to advanced patterns — matrix builds, reusable workflows, security hardening, self-hosted runners, and enterprise-scale CI/CD.",
  icon: "Workflow",
  color: "#2088ff",
  gradient: "track-actions-gradient",
  tags: ["cicd", "automation", "devops", "github"],
  modules: [
    {
      id: "actions-fundamentals",
      title: "Actions Architecture & Core Concepts",
      level: "beginner",
      description: "Understand how GitHub Actions works under the hood.",
      lessons: [
        {
          id: "actions-architecture",
          title: "GitHub Actions Architecture",
          duration: 18,
          type: "lesson",
          description: "Understand runners, events, contexts, and how Actions executes workflows.",
          objectives: [
            "Explain the event → workflow → job → step execution model",
            "Understand runner types and environment isolation",
            "Read and write expressions and contexts",
            "Use the GITHUB_TOKEN for API authentication",
          ],
          content: `# GitHub Actions Architecture

## How GitHub Actions Works

\`\`\`
GitHub Event (push, PR, schedule, etc.)
    ↓
Workflow File (.github/workflows/ci.yml)
    ↓
Jobs (one or more, parallel by default)
    ↓
Runner (GitHub-hosted or self-hosted VM)
    ↓
Steps (shell commands or action calls)
    ↓
Actions (reusable units from Marketplace or your repo)
\`\`\`

When a trigger event fires, GitHub:
1. Evaluates which workflow files match the event
2. Creates a workflow run
3. Allocates a runner for each job
4. Each runner clones your repo, then executes steps sequentially

## Events — Workflow Triggers

\`\`\`yaml
on:
  # Push to specific branches:
  push:
    branches: [main, 'release/**']
    paths:                    # only run if these files change
      - 'src/**'
      - 'package.json'
    paths-ignore:
      - '**.md'               # ignore docs changes

  # Pull request events:
  pull_request:
    types: [opened, synchronize, reopened]  # default
    branches: [main]

  # Scheduled (cron):
  schedule:
    - cron: '0 2 * * 1'      # Mondays at 2 AM UTC

  # Manual trigger:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deploy to'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]
      dry_run:
        type: boolean
        default: false

  # Called by another workflow:
  workflow_call:
    inputs:
      version:
        required: true
        type: string
    secrets:
      deploy_key:
        required: true

  # Repository dispatch (external API trigger):
  repository_dispatch:
    types: [deploy-event]
\`\`\`

## Runners — Where Jobs Execute

\`\`\`yaml
jobs:
  test:
    # GitHub-hosted runners:
    runs-on: ubuntu-latest    # Ubuntu 22.04 LTS
    runs-on: ubuntu-22.04     # pinned version (preferred)
    runs-on: windows-latest
    runs-on: macos-14         # Apple Silicon!

    # Self-hosted runners:
    runs-on: [self-hosted, linux, x64, gpu]  # label matching

    # Matrix (multiple runners in parallel):
    strategy:
      matrix:
        os: [ubuntu-22.04, macos-14, windows-latest]
        node: [18, 20, 22]
    runs-on: \${{ matrix.os }}
\`\`\`

**GitHub-hosted runner specs:**
- Ubuntu/Windows: 4 vCPUs, 16GB RAM, 14GB SSD
- macOS: 3 vCPUs (Intel) or 3 vCPUs M1 (macos-14)
- Each job gets a fresh VM (isolated completely)
- 6-hour job timeout, 35-day log retention

## Contexts — Runtime Information

Contexts provide runtime values. They're objects you access with \`\${{ }}\`:

\`\`\`yaml
# github context — info about the trigger:
\${{ github.event_name }}        # "push", "pull_request", etc.
\${{ github.sha }}               # commit SHA (40 chars)
\${{ github.ref }}               # "refs/heads/main"
\${{ github.ref_name }}          # "main"
\${{ github.repository }}        # "owner/repo"
\${{ github.actor }}             # username who triggered
\${{ github.run_id }}            # unique run ID
\${{ github.run_number }}        # sequential run number

# env context — environment variables:
\${{ env.MY_VAR }}

# secrets context — encrypted secrets:
\${{ secrets.MY_SECRET }}
\${{ secrets.GITHUB_TOKEN }}     # automatically provided

# steps context — outputs from previous steps:
\${{ steps.my-step-id.outputs.version }}
\${{ steps.my-step-id.outcome }}  # success, failure, cancelled, skipped

# needs context — outputs from dependent jobs:
\${{ needs.build.outputs.image_tag }}

# inputs context (workflow_dispatch):
\${{ inputs.environment }}
\`\`\`

## GITHUB_TOKEN — Automatic Authentication

GitHub creates a short-lived token automatically for each workflow run:

\`\`\`yaml
jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write      # push to repo, create releases
      packages: write      # push to GitHub Container Registry
      pull-requests: write # comment on PRs
      issues: write        # comment on issues
      id-token: write      # OIDC for cloud auth

    steps:
      - name: Create release
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: gh release create v1.0.0 --generate-notes
\`\`\`

**Permissions model:**
- Default: \`contents: read\` (safe, read-only)
- Minimum required permissions (principle of least privilege)
- Fork PRs get read-only GITHUB_TOKEN (security feature — untrusted code can't write)

## Expressions and Conditions

\`\`\`yaml
steps:
  # Conditional steps:
  - name: Deploy only on main
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    run: ./deploy.sh

  # Run even if previous steps fail:
  - name: Notify on failure
    if: failure()
    run: ./notify-slack.sh

  # Built-in functions:
  - name: Check branch pattern
    if: startsWith(github.ref, 'refs/heads/release/')
    run: echo "This is a release branch"

  # contains, startsWith, endsWith, format, join, toJSON, fromJSON
  - name: Debug context
    run: echo '\${{ toJSON(github) }}'

  # Expressions in environment variables:
  env:
    IMAGE_TAG: \${{ github.sha }}
    IS_PR: \${{ github.event_name == 'pull_request' }}
    DEPLOY_ENV: \${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
\`\`\`
`,
          interviewQuestions: [
            {
              question: "A pull request from a fork is failing with 'Resource not accessible by integration'. Why and how do you fix it?",
              difficulty: "mid",
              answer: `**Why it happens:** GitHub gives fork PRs a read-only GITHUB_TOKEN by default. This is a security measure — untrusted code (from a fork) cannot write to your repository, post comments, or access secrets.

**The error means the workflow is trying to:**
- Write comments to the PR
- Push to the repository
- Access repository secrets
- Create a release or package

**Solutions depending on use case:**

**Option A — Use pull_request_target (with care):**
\`\`\`yaml
on:
  pull_request_target:  # runs in context of BASE branch, not fork
    types: [opened, synchronize]
\`\`\`
⚠️ DANGEROUS: \`pull_request_target\` runs untrusted code with elevated permissions. Only use it if you don't checkout the PR code, or checkout only safe files.

**Option B — Two-workflow pattern (safe approach):**
\`\`\`yaml
# Workflow 1: runs on pull_request (read-only, on fork code)
# Saves artifacts, does not post results
name: Test
on: pull_request
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      - uses: actions/upload-artifact@v4
        with: {name: test-results, path: results/}

# Workflow 2: runs on workflow_run completion (has write access)
name: Post Results
on:
  workflow_run:
    workflows: ["Test"]
    types: [completed]
jobs:
  comment:
    permissions:
      pull-requests: write
    steps:
      - uses: actions/download-artifact@v4
      - run: gh pr comment \${{ ... }} --body-file results.txt
\`\`\`

**Option C — Explicit permission grant (for internal contributors):**
\`\`\`yaml
permissions:
  pull-requests: write
\`\`\`
This works for PRs from the same org, but NOT from forks.`,
            },
            {
              question: "How does OIDC authentication work in GitHub Actions, and why is it better than storing cloud credentials as secrets?",
              difficulty: "senior",
              answer: `**Traditional approach (credential-based):**
\`\`\`yaml
# Generate AWS access key, store as GitHub secret:
- uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}      # long-lived
    aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
\`\`\`
Problem: Long-lived credentials that can be leaked, stolen, forgotten to rotate.

**OIDC approach (identity federation):**
\`\`\`yaml
permissions:
  id-token: write  # required for OIDC
  contents: read

steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: arn:aws:iam::123456789:role/github-actions-role
      aws-region: us-east-1
      # NO CREDENTIALS — uses OIDC instead
\`\`\`

**How it works:**
1. GitHub Actions requests a short-lived JWT from GitHub's OIDC provider
2. The JWT contains: repo name, branch, actor, workflow name (claims)
3. AWS (or GCP, Azure) receives the JWT and validates it with GitHub's JWKS endpoint
4. If the IAM role's trust policy matches the claims, AWS issues temporary credentials (15 min)
5. No credentials are stored anywhere

**AWS IAM trust policy:**
\`\`\`json
{
  "Effect": "Allow",
  "Principal": {"Federated": "arn:aws:iam::123456789:oidc-provider/token.actions.githubusercontent.com"},
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
      "token.actions.githubusercontent.com:sub": "repo:myorg/myrepo:ref:refs/heads/main"
    }
  }
}
\`\`\`

**Why it's better:**
- No long-lived credentials to leak or rotate
- Automatic expiry (15 min)
- Auditable: exactly which repo/branch/workflow triggered the action
- Granular: different branches can assume different roles`,
            },
          ],
        },
        {
          id: "workflow-syntax",
          title: "Workflow Syntax & Best Practices",
          duration: 20,
          type: "lesson",
          description: "Write maintainable, efficient workflow files using all YAML features.",
          objectives: [
            "Use matrix strategies for parallel testing across environments",
            "Implement job dependencies and conditional execution",
            "Share data between jobs using artifacts and outputs",
            "Apply caching strategies to speed up workflows",
          ],
          content: `# Workflow Syntax & Best Practices

## Matrix Strategy — Parallel Test Grids

\`\`\`yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-22.04, windows-latest, macos-14]
        node: [18, 20, 22]
        # Generates 9 parallel jobs (3 OS × 3 Node versions)

      # Custom combinations:
      include:
        - os: ubuntu-22.04
          node: 20
          experimental: true   # extra config for this combo

      # Skip specific combinations:
      exclude:
        - os: windows-latest
          node: 18

      # Don't cancel other jobs if one fails:
      fail-fast: false

    runs-on: \${{ matrix.os }}
    name: Test (Node \${{ matrix.node }} on \${{ matrix.os }})
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm test
      continue-on-error: \${{ matrix.experimental }}
\`\`\`

## Job Dependencies

\`\`\`yaml
jobs:
  test:
    runs-on: ubuntu-latest
    outputs:
      coverage: \${{ steps.coverage.outputs.percent }}
    steps:
      - run: npm test
      - id: coverage
        run: echo "percent=87" >> \$GITHUB_OUTPUT

  build:
    needs: test        # runs after 'test' completes successfully
    runs-on: ubuntu-latest
    steps:
      - run: echo "Coverage was \${{ needs.test.outputs.coverage }}%"

  deploy-staging:
    needs: [test, build]    # wait for both
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh staging

  deploy-prod:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'  # conditional job
    environment:
      name: production
      url: https://myapp.com
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh production
\`\`\`

## Artifacts — Sharing Files Between Jobs

\`\`\`yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-output-\${{ github.sha }}
          path: dist/
          retention-days: 7          # auto-delete after 7 days
          compression-level: 6       # 0-9, balance speed vs size

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: build-output-\${{ github.sha }}
          path: dist/

      - run: ./deploy.sh dist/
\`\`\`

## Caching — Dramatically Speed Up Workflows

\`\`\`yaml
steps:
  # Node.js — cache node_modules:
  - uses: actions/setup-node@v4
    with:
      node-version: 20
      cache: npm                      # built-in npm caching
      cache-dependency-path: '**/package-lock.json'

  # Manual cache (for complex cases):
  - uses: actions/cache@v4
    id: npm-cache
    with:
      path: ~/.npm                    # npm cache directory
      key: npm-\${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        npm-\${{ runner.os }}-       # fallback: partial match
        npm-

  - run: npm ci
    if: steps.npm-cache.outputs.cache-hit != 'true'

  # Go modules:
  - uses: actions/cache@v4
    with:
      path: |
        ~/go/pkg/mod
        ~/.cache/go-build
      key: go-\${{ runner.os }}-\${{ hashFiles('**/go.sum') }}
      restore-keys: go-\${{ runner.os }}-

  # Docker layer caching (with GitHub Container Registry):
  - uses: docker/build-push-action@v5
    with:
      cache-from: type=gha          # GitHub Actions cache
      cache-to: type=gha,mode=max
\`\`\`

## Environment Variables and Outputs

\`\`\`yaml
env:
  # Workflow-level env (available to all jobs):
  APP_ENV: production

jobs:
  example:
    runs-on: ubuntu-latest
    env:
      # Job-level env:
      DB_URL: postgresql://localhost/test
    steps:
      - name: Set dynamic output
        id: semver
        run: |
          VERSION="\$(git describe --tags --abbrev=0)"
          echo "version=\$VERSION" >> \$GITHUB_OUTPUT
          # GITHUB_OUTPUT replaces set-output (deprecated)

      - name: Use output
        run: echo "Deploying \${{ steps.semver.outputs.version }}"

      - name: Append to PATH
        run: echo "/custom/bin" >> \$GITHUB_PATH

      - name: Set env for subsequent steps
        run: echo "GENERATED_VALUE=abc123" >> \$GITHUB_ENV

      - name: Use the env set above
        run: echo "\$GENERATED_VALUE"
\`\`\`

## Composite Actions — Reusable Steps

\`\`\`yaml
# .github/actions/setup-env/action.yml
name: 'Setup Environment'
description: 'Install tools and configure environment'
inputs:
  node-version:
    required: false
    default: '20'
  python-version:
    required: false
    default: '3.12'
outputs:
  node-path:
    description: 'Path to node binary'
    value: \${{ steps.setup-node.outputs.node-path }}

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      id: setup-node
      with:
        node-version: \${{ inputs.node-version }}
    - uses: actions/setup-python@v5
      with:
        python-version: \${{ inputs.python-version }}
    - shell: bash
      run: pip install --upgrade pip pre-commit
\`\`\`

\`\`\`yaml
# Using the composite action:
steps:
  - uses: ./.github/actions/setup-env
    with:
      node-version: '22'
\`\`\`
`,
          interviewQuestions: [
            {
              question: "How do you pass data between jobs in GitHub Actions? What are the trade-offs of each method?",
              difficulty: "junior",
              answer: `There are three ways to pass data between jobs:

**1. Job outputs (for small values like IDs, version strings):**
\`\`\`yaml
jobs:
  build:
    outputs:
      image_tag: \${{ steps.tag.outputs.value }}
    steps:
      - id: tag
        run: echo "value=\${{ github.sha }}" >> \$GITHUB_OUTPUT

  deploy:
    needs: build
    steps:
      - run: echo "Deploying \${{ needs.build.outputs.image_tag }}"
\`\`\`
✅ Simple, fast. ❌ Limited to strings, max size (~1MB for the whole outputs object)

**2. Artifacts (for files, build outputs):**
\`\`\`yaml
jobs:
  build:
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with: {name: dist, path: dist/}

  deploy:
    needs: build
    steps:
      - uses: actions/download-artifact@v4
        with: {name: dist, path: dist/}
\`\`\`
✅ For large files. ❌ Adds upload/download time (30s+), costs storage, 90-day expiry by default.

**3. Cache (for reusable build dependencies):**
Not for passing data between jobs in the same run — cache is for sharing across runs.

**4. External storage (for large data, production patterns):**
Upload to S3/GCS in one job, download in another. More reliable for large datasets, survives across workflow runs.

**Rule of thumb:** job outputs for small values, artifacts for build products, external storage for large/critical data.`,
            },
            {
              question: "Your CI workflow takes 25 minutes per run. How do you reduce it to under 5 minutes?",
              difficulty: "mid",
              answer: `**Step 1 — Profile where the time goes:**
\`\`\`bash
# Look at the workflow run visualization in GitHub UI
# Or use: actionlint + timing data
\`\`\`

**Common bottlenecks and fixes:**

**1. Dependency installation (npm ci, pip install, go mod download):**
\`\`\`yaml
# Enable caching:
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm  # saves 2-5 minutes per run
\`\`\`

**2. Sequential jobs that could be parallel:**
\`\`\`yaml
# BAD: lint → test → build (sequential, 25 min total)
# GOOD: lint and test in parallel, then build
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  test:
    runs-on: ubuntu-latest
    steps: [...]
  build:
    needs: [lint, test]  # waits for both, but they ran in parallel
    steps: [...]
\`\`\`

**3. Slow tests — parallelize with matrix:**
\`\`\`yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]  # split test suite into 4 parallel shards
steps:
  - run: npx jest --shard=\${{ matrix.shard }}/4
\`\`\`

**4. Docker builds — use layer caching:**
\`\`\`yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
# Saves 5-15 minutes for builds with stable dependencies
\`\`\`

**5. Path-based filtering — skip irrelevant jobs:**
\`\`\`yaml
on:
  push:
    paths: ['src/**', 'package.json']  # ignore doc changes
\`\`\`

**6. Merge queue / batching:**
Instead of running CI on every push, use GitHub's merge queue to batch commits.

**Expected result:** With caching, parallelism, and sharding: 25 min → 3-5 min.`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your GitHub Actions workflow takes 45 minutes per run. Identify the top three strategies to reduce it to under 10 minutes.", answer: "1. **Dependency caching**: Use `actions/setup-node@v4` with `cache: npm` or `actions/cache@v4` — saves 3-8 minutes per run by restoring node_modules/pip/go modules instead of re-downloading. 2. **Parallelism**: Split sequential jobs (lint → test → build) into parallel jobs using the `jobs` graph with `needs`. Use matrix strategy to shard test suites across multiple runners. 3. **Docker layer caching**: Use `cache-from: type=gha` in `docker/build-push-action` to reuse unchanged image layers. Also add path filters (`paths:` on push trigger) to skip the workflow entirely for doc-only changes.", difficulty: "mid" },
        { question: "A pull request from a forked repository fails with 'Resource not accessible by integration' when trying to post a comment. Why does this happen and what is the safe fix?", answer: "GitHub gives fork PRs a read-only GITHUB_TOKEN by default — untrusted external code cannot write to your repo. The safe fix is the two-workflow pattern: Workflow 1 runs on `pull_request` (fork's code, read-only), runs tests, and uploads results as artifacts. Workflow 2 runs on `workflow_run` completion (runs in the base repo context with write access) and downloads the artifact to post the comment. Never use `pull_request_target` with code checkout from the fork — that runs untrusted code with elevated permissions.", difficulty: "mid" },
        { question: "Explain the GitHub Actions execution model: what happens between a `git push` and your first step running?", answer: "1. The push event fires on GitHub's servers. 2. GitHub evaluates all workflow files in `.github/workflows/` to find those matching the event and branch filters. 3. For each matching workflow, GitHub creates a workflow run object. 4. For each job in the workflow, GitHub queues it and allocates a runner (GitHub-hosted = a fresh VM spun up; self-hosted = a registered machine picks it up). 5. The runner clones the repository (or uses `actions/checkout` in a step). 6. The runner executes each step sequentially — either running shell commands or downloading and executing action code. Each job runs in complete isolation from other jobs.", difficulty: "junior" },
        { question: "What is OIDC authentication in GitHub Actions and why is it safer than storing cloud credentials as secrets?", answer: "OIDC (OpenID Connect) lets GitHub Actions prove its identity to cloud providers (AWS, GCP, Azure) without storing long-lived credentials. The workflow requests a short-lived JWT from GitHub's OIDC provider. The cloud provider validates the JWT (checking claims like repo name, branch, actor) against a configured IAM trust policy, then issues temporary credentials valid for 15 minutes. Benefits over stored secrets: no long-lived credentials to rotate or leak, automatic expiry, granular trust (specific repo + branch + workflow), and full auditability. Configure with `permissions: id-token: write` in the job.", difficulty: "senior" },
        { question: "You want a workflow step to run only on pushes to `main`, but always run a cleanup step even if earlier steps fail. How do you express these conditions in YAML?", answer: "Use `if:` conditionals on steps. For main-only: `if: github.ref == 'refs/heads/main' && github.event_name == 'push'`. For always-run cleanup: `if: always()` — this runs regardless of whether previous steps succeeded, failed, or were cancelled. Other useful condition functions: `failure()` (runs only if a previous step failed), `success()` (default behavior), `cancelled()`. These can be combined: `if: always() && steps.build.outcome == 'failure'` to run only when a specific step failed.", difficulty: "junior" },
        { question: "What is the difference between `workflow_call` and `workflow_dispatch` triggers, and when would you use each?", answer: "`workflow_dispatch` enables manual triggering from the GitHub UI or API with optional user-defined inputs (text, choice, boolean). Use it for on-demand operations: manual deploys, releasing a specific version, running a database migration. `workflow_call` marks a workflow as reusable — it can only be triggered by another workflow using `uses:`. Use it for shared CI/CD templates across repos (build, test, deploy patterns) that multiple workflows call with typed inputs. `workflow_call` supports typed inputs and secrets passing, and its outputs can be consumed by the calling workflow via `needs.<job>.outputs`.", difficulty: "mid" },
        { question: "How do you share a Docker image built in one job with a deploy job later in the same workflow run?", answer: "Two approaches: 1. **Push to a registry**: Build and push to GitHub Container Registry (ghcr.io) in the build job using `docker/build-push-action` with `push: true`. The deploy job pulls by tag (e.g., `ghcr.io/org/app:${{ github.sha }}`). Pass the image tag between jobs using job outputs. 2. **Artifacts** (for internal use only): Save the image with `docker save app:latest | gzip > image.tar.gz`, upload with `actions/upload-artifact`, download in the deploy job, and `docker load`. Approach 1 is preferred for production — the image is in a real registry and reusable.", difficulty: "mid" },
        { question: "You need to run tests against Node 18, 20, and 22 on both Ubuntu and macOS simultaneously. How do you configure this in a workflow without writing 6 separate jobs?", answer: "Use a matrix strategy: set `strategy.matrix` with `os: [ubuntu-22.04, macos-14]` and `node: [18, 20, 22]`. Set `runs-on: ${{ matrix.os }}` and use `actions/setup-node@v4` with `node-version: ${{ matrix.node }}`. GitHub Actions generates 6 parallel jobs automatically (2 OS × 3 Node versions). Add `fail-fast: false` to prevent cancelling all matrix jobs when one fails. Use `exclude:` to skip specific combinations if needed (e.g., skip Node 18 on macOS), or `include:` to add extra config to specific combinations.", difficulty: "junior" },
        { question: "What permissions does `GITHUB_TOKEN` have by default, and how do you apply the principle of least privilege in your workflows?", answer: "By default `GITHUB_TOKEN` has `contents: read` (safe read-only access). At the workflow or job level, you can grant additional permissions only as needed: `contents: write` (push commits, create releases), `pull-requests: write` (comment on PRs), `packages: write` (push to GHCR), `id-token: write` (OIDC). Best practice: set `permissions: {}` at the workflow level to revoke all defaults, then grant only what each specific job needs. Fork PRs always get a read-only token regardless of your permissions setting — this is a security feature that cannot be overridden.", difficulty: "mid" },
        { question: "A workflow passes on the PR but fails in production deploy. The failing step uses `${{ secrets.PROD_API_KEY }}` which is empty. What are the likely causes and how do you debug?", answer: "Likely causes: 1. **Environment secrets**: the secret is scoped to a `production` environment but the job doesn't specify `environment: production`. Environment secrets are only available when the job explicitly targets that environment. 2. **Branch restriction**: the environment is configured to only allow deployments from `main`, but the job is running from another branch. 3. **Secret name typo**: case-sensitive mismatch between the secret name defined in Settings and the name used in the workflow. Debug: add a step `run: echo 'Secret set: ${{ secrets.PROD_API_KEY != '' }}'` to check if the secret resolves without revealing its value. Check Settings → Environments → production → Secrets to verify scope.", difficulty: "senior" },
      ],
    },
    {
      id: "advanced-actions",
      title: "Advanced Patterns & Security",
      level: "advanced",
      description: "Reusable workflows, self-hosted runners, and supply chain security.",
      lessons: [
        {
          id: "reusable-workflows",
          title: "Reusable Workflows & Secrets Management",
          duration: 22,
          type: "lesson",
          description: "Build organization-wide CI/CD templates with reusable workflows.",
          objectives: [
            "Create and call reusable workflows with typed inputs and secrets",
            "Implement centralized workflow templates across an organization",
            "Use repository environments for deployment protection",
            "Apply branch protection rules with required status checks",
          ],
          content: `# Reusable Workflows & Organization Patterns

## Reusable Workflows

Reusable workflows let you DRY up CI/CD across repositories:

\`\`\`yaml
# .github/workflows/reusable-build.yml (in a central repo or same repo)
name: Reusable Build

on:
  workflow_call:
    inputs:
      image-name:
        required: true
        type: string
      push:
        required: false
        type: boolean
        default: false
      environment:
        required: false
        type: string
        default: staging
    secrets:
      registry-token:
        required: true
    outputs:
      image-tag:
        description: "The full image tag built"
        value: \${{ jobs.build.outputs.image-tag }}

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image-tag: \${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.registry-token }}
      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ghcr.io/myorg/\${{ inputs.image-name }}
          tags: |
            type=sha
            type=ref,event=branch
            type=semver,pattern={{version}}
      - uses: docker/build-push-action@v5
        with:
          push: \${{ inputs.push }}
          tags: \${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
\`\`\`

\`\`\`yaml
# Calling the reusable workflow:
name: CI

on:
  push:
    branches: [main]

jobs:
  build-api:
    uses: myorg/.github/.github/workflows/reusable-build.yml@main
    with:
      image-name: api-service
      push: true
    secrets:
      registry-token: \${{ secrets.GITHUB_TOKEN }}

  deploy:
    needs: build-api
    runs-on: ubuntu-latest
    steps:
      - run: echo "Image: \${{ needs.build-api.outputs.image-tag }}"
\`\`\`

## Organization-Wide Workflow Templates

\`\`\`
myorg/.github repository (special repo):
├── workflow-templates/
│   ├── node-ci.yml           # template
│   └── node-ci.properties.json  # metadata
└── .github/workflows/
    └── reusable-*.yml        # reusable workflows
\`\`\`

\`\`\`json
// node-ci.properties.json
{
  "name": "Node.js CI",
  "description": "Standard Node.js CI with lint, test, and build",
  "iconName": "octicon package",
  "categories": ["JavaScript"]
}
\`\`\`

## Environment Protection Rules

\`\`\`yaml
jobs:
  deploy-production:
    environment:
      name: production
      url: https://myapp.com    # shown in workflow UI

    # Configured in GitHub Settings → Environments:
    # - Required reviewers (manual approval gate)
    # - Wait timer (15 min delay before deploy)
    # - Deployment branches (only 'main' can deploy)
    # - Environment-specific secrets
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
        env:
          PROD_KEY: \${{ secrets.PROD_DEPLOY_KEY }}  # environment secret
\`\`\`

## Security — Pinning Actions by SHA

\`\`\`yaml
steps:
  # BAD — tag can be force-pushed (supply chain attack):
  - uses: actions/checkout@v4

  # GOOD — SHA cannot be changed (immutable):
  - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
  - uses: actions/setup-node@cdca7365b2dadb8aad0a33bc7601856ffabcc48e  # v4.1.0

  # Use tools like Dependabot or Renovate to auto-update pinned SHAs
\`\`\`

\`\`\`yaml
# .github/dependabot.yml — auto-update action SHAs:
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
    labels: ['dependencies', 'github-actions']
\`\`\`

## Secrets — Best Practices

\`\`\`yaml
# Secrets are masked in logs automatically
# But protect them in code:

steps:
  - name: Use secret safely
    env:
      # Always inject via env, not directly in run script
      API_KEY: \${{ secrets.API_KEY }}
    run: |
      # Good — env var, masked in logs
      curl -H "Authorization: Bearer \$API_KEY" https://api.example.com

      # BAD — would log the secret value:
      # curl -H "Authorization: Bearer \${{ secrets.API_KEY }}" ...

  - name: Don't echo secrets
    run: |
      # This leaks the secret even though it's "masked":
      # echo "\${{ secrets.API_KEY }}"
      # Masking isn't foolproof for all output patterns
\`\`\`

## Self-Hosted Runners

\`\`\`bash
# Register a self-hosted runner:
# 1. Go to Settings → Actions → Runners → Add runner
# 2. Follow instructions to install and configure

# Run as a service (Linux):
sudo ./svc.sh install
sudo ./svc.sh start

# Runner configuration (for ephemeral runners in Kubernetes):
# Use: actions-runner-controller (ARC)
\`\`\`

\`\`\`yaml
# Use self-hosted runners:
jobs:
  build:
    runs-on: [self-hosted, linux, x64, large]
    # 'large' is a custom label for high-resource runners

  gpu-test:
    runs-on: [self-hosted, gpu, linux]
\`\`\`

**Self-hosted runner security:**
\`\`\`yaml
# NEVER use self-hosted runners for public repositories
# An attacker can fork your repo and trigger workflows that run
# malicious code on your self-hosted runner

# Mitigation for public repos:
on:
  pull_request_target:
    # Only trigger if the PR author is a contributor, not an outsider
\`\`\`
`,
          interviewQuestions: [
            {
              question: "How do you prevent supply chain attacks in GitHub Actions workflows?",
              difficulty: "senior",
              answer: `Supply chain attacks in GitHub Actions occur when a malicious actor compromises an action you're using (e.g., via tag manipulation, typosquatting, or maintainer account compromise).

**Defense strategies:**

**1. Pin actions to commit SHA (not tags):**
\`\`\`yaml
# Attacker can push to v4 tag → your workflow runs malicious code
- uses: actions/checkout@v4  # vulnerable

# SHA is immutable — no one can change what this points to
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2
\`\`\`

**2. Use Dependabot/Renovate to keep pinned SHAs updated:**
\`\`\`yaml
# .github/dependabot.yml
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule: {interval: weekly}
\`\`\`

**3. Restrict permissions (principle of least privilege):**
\`\`\`yaml
permissions:
  contents: read  # default — minimal access
# Only grant write when explicitly needed
\`\`\`

**4. Use only verified/trusted actions:**
- Prefer actions from github.com/actions/* (official)
- Check stars, activity, and code for third-party actions
- For critical workflows, vendor the action in your org

**5. Step Security Harden-Runner:**
\`\`\`yaml
- uses: step-security/harden-runner@v2
  with:
    egress-policy: audit  # block/audit unexpected network calls
    # Detects if an action tries to exfiltrate secrets
\`\`\`

**6. Audit logs:** Enable organization-level audit logs for all workflow runs.

**7. Secrets scanning:** Use GitHub Advanced Security or Gitleaks to ensure secrets don't leak into workflow outputs.

The most impactful single action: **pin all third-party actions by SHA**.`,
            },
            {
              question: "Design a CI/CD pipeline for a multi-service monorepo where each service should only deploy when its code changes.",
              difficulty: "senior",
              answer: `**The challenge:** A monorepo with services A, B, C — you don't want to deploy all services when only service A changed.

**Solution using path filtering and job outputs:**

\`\`\`yaml
name: Monorepo CI/CD

on:
  push:
    branches: [main]

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      api: \${{ steps.changes.outputs.api }}
      frontend: \${{ steps.changes.outputs.frontend }}
      worker: \${{ steps.changes.outputs.worker }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2  # need previous commit for diff
      - uses: dorny/paths-filter@v3
        id: changes
        with:
          filters: |
            api:
              - 'services/api/**'
              - 'shared/lib/**'        # shared dep → rebuild api too
            frontend:
              - 'services/frontend/**'
              - 'shared/ui-components/**'
            worker:
              - 'services/worker/**'
              - 'shared/lib/**'

  build-api:
    needs: detect-changes
    if: needs.detect-changes.outputs.api == 'true'
    uses: ./.github/workflows/reusable-build.yml
    with:
      service: api
      push: true

  build-frontend:
    needs: detect-changes
    if: needs.detect-changes.outputs.frontend == 'true'
    uses: ./.github/workflows/reusable-build.yml
    with:
      service: frontend
      push: true

  deploy:
    needs: [build-api, build-frontend, build-worker]
    if: always() && !failure() && !cancelled()
    runs-on: ubuntu-latest
    steps:
      - run: |
          # Only deploy changed services
          [[ "\${{ needs.build-api.result }}" == "success" ]] && ./deploy.sh api
          [[ "\${{ needs.build-frontend.result }}" == "success" ]] && ./deploy.sh frontend
\`\`\`

**Additional considerations:**
- **Shared libraries**: if \`shared/lib\` changes, rebuild ALL services that depend on it (handled by including it in each service's filter)
- **Deployment order**: if API has breaking changes and frontend must update together, use a combined deploy job
- **Rollback**: keep previous image tags in the registry, deploy script accepts version parameter
- **Integration tests**: run after all affected services deploy, against a staging environment`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your organization has 20 repositories that all build Docker images. They each have duplicated CI YAML. How do you centralize this logic?", answer: "Create reusable workflows in a central `.github` repository (e.g., `myorg/.github`). Define a workflow with `on: workflow_call:` that accepts typed inputs (image name, push flag, environment) and secrets (registry token). Each repository then calls it with `uses: myorg/.github/.github/workflows/reusable-build.yml@main` and passes the relevant inputs. The reusable workflow handles checkout, Docker build, tagging, and push. Changes to the build process need only be made in one place. Use `workflow_call` outputs to return the built image tag to the caller.", difficulty: "mid" },
        { question: "You need to run integration tests against 3 different database versions (Postgres 14, 15, 16) and 2 different app versions simultaneously. How do you configure this?", answer: "Use a matrix strategy with multiple dimensions: `matrix: postgres: [14, 15, 16]` and `app-version: [v2.1, v3.0]`. This generates 6 parallel jobs. Use `services:` to spin up the Postgres container in each job: `image: postgres:${{ matrix.postgres }}`. Set `fail-fast: false` so all 6 complete even if one fails — giving you a full compatibility matrix report. Use `exclude:` to skip known-unsupported combinations, and `include:` to add extra variables (like expected behavior flags) to specific matrix entries.", difficulty: "mid" },
        { question: "A reusable workflow needs access to a secret (e.g., a registry token). How do you pass it from the calling workflow?", answer: "In the reusable workflow, declare the secret under `on.workflow_call.secrets`: `registry-token: required: true`. In the calling workflow, pass it under `secrets:`: `registry-token: ${{ secrets.GITHUB_TOKEN }}` (or any named secret). Inside the reusable workflow, reference it as `${{ secrets.registry-token }}`. Note: you cannot pass `secrets: inherit` to a reusable workflow from a different repository unless you explicitly allow it in org settings. Secrets are masked in logs automatically, but never log them directly.", difficulty: "mid" },
        { question: "How do you prevent supply chain attacks when using third-party GitHub Actions?", answer: "Pin all third-party actions to an immutable commit SHA instead of a tag: `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`. Tags can be force-pushed (attacker compromises the action maintainer and pushes malicious code to the v4 tag). A SHA is immutable — it always points to the same commit. Use Dependabot (`package-ecosystem: github-actions`) to automatically open PRs updating pinned SHAs weekly. Also apply least-privilege `permissions:` blocks, use only official actions from `actions/*` or well-audited publishers, and consider Step Security's Harden-Runner to detect unexpected network egress.", difficulty: "senior" },
        { question: "You have a composite action that installs tools. How is it different from a reusable workflow, and when would you choose one over the other?", answer: "**Composite action**: defined in `action.yml` with `runs.using: composite`. It is a collection of steps that run within the caller's job — same runner, same environment, same context. Use it for reusable step sequences within a job (e.g., setup toolchain, install dependencies). Called with `uses: ./.github/actions/my-action`. **Reusable workflow**: a full workflow with its own jobs and runners. It runs as a separate set of jobs. Use it for reusable end-to-end pipelines (build-and-push, deploy) across repositories. Key difference: composite actions share the job's runner and environment; reusable workflows get isolated runners and can have multiple parallel jobs.", difficulty: "senior" },
        { question: "Describe how to set up a deployment workflow that requires manual approval before deploying to production.", answer: "Use GitHub Environments with required reviewers. Create a `production` environment in Settings → Environments and add required reviewers (specific users or teams). In the workflow, set `environment: name: production` on the deploy job. When the job reaches that step, GitHub pauses the run and sends notifications to the reviewers. The run resumes only after an approved reviewer clicks 'Approve'. You can also set a wait timer (e.g., 15-minute delay after approval) and restrict deployments to specific branches (e.g., only `main` can deploy to production). Environment-specific secrets are only available to jobs targeting that environment.", difficulty: "mid" },
        { question: "A monorepo has services A, B, and C. Service B depends on shared library `lib/`. When only `lib/` changes, how do you ensure all services that use it are rebuilt?", answer: "Use path filters in a change-detection job (e.g., with `dorny/paths-filter`). In the filter configuration, include `lib/**` in the paths for every service that depends on it: `service-a: ['services/a/**', 'lib/**']`, `service-b: ['services/b/**', 'lib/**']`, `service-c: ['services/c/**', 'lib/**']`. The detection job outputs booleans for each service. Downstream build jobs use `if: needs.detect.outputs.service-a == 'true'`. This way, a change to `lib/` triggers rebuilds for all three services, while a change only to `services/a/` triggers only service A's build.", difficulty: "senior" },
        { question: "How do you securely inject a secret into a workflow step? What patterns should you avoid?", answer: "**Safe pattern**: inject via environment variable, never directly in the run command text: `env: API_KEY: ${{ secrets.API_KEY }}` then use `$API_KEY` in the shell script. The `${{ secrets.X }}` expression is substituted before the runner sees it — if it appears directly in a multi-line `run:` block, it may appear in debug logs or be accessible to log injection attacks. **Patterns to avoid**: `run: curl -H 'Authorization: ${{ secrets.TOKEN }}'` (secret in command text), `run: echo ${{ secrets.TOKEN }}` (logs the value even though it's masked — masking isn't foolproof for all output formats), and storing secrets in artifacts or outputs.", difficulty: "mid" },
        { question: "What are self-hosted runners, and what is the critical security risk of using them with public repositories?", answer: "Self-hosted runners are machines you register with GitHub that pick up and execute workflow jobs instead of GitHub-hosted VMs. They're used for: GPU workloads, larger machines, access to private network resources, or specific OS/hardware requirements. **Critical security risk with public repos**: anyone can fork a public repo and open a pull request. If a workflow triggers on `pull_request` and runs on a self-hosted runner, the fork's PR code runs on your machine. An attacker can craft a PR that exfiltrates secrets, installs malware, or pivots to your internal network. Mitigation: never use self-hosted runners for public repos, or gate on `pull_request_target` with contributor verification.", difficulty: "senior" },
        { question: "You want to automatically tag and release your app whenever a version tag like `v1.2.3` is pushed. Sketch the workflow trigger and key steps.", answer: "Trigger: `on: push: tags: ['v[0-9]+.[0-9]+.[0-9]+']`. Key steps: 1. `actions/checkout@v4` to get the code. 2. Build the application (compile, package, Docker image). 3. Extract the version: `VERSION=${{ github.ref_name }}` (gives `v1.2.3`). 4. Create a GitHub Release using `gh release create $VERSION --generate-notes` (auto-generates release notes from PRs merged since last tag) with `env: GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` and `permissions: contents: write`. 5. Optionally upload build artifacts to the release or push Docker image tagged with the version to ghcr.io.", difficulty: "mid" },
      ],
    },

{
  id: "docker-registry-workflows",
  title: "Docker & Registry Workflows",
  level: "intermediate" as const,
  description: "Build production-grade Docker CI workflows — layer caching, multi-arch builds, pushing to GHCR and ECR, image signing, and vulnerability scanning.",
  lessons: [
    {
      id: "docker-build-push",
      title: "Building & Pushing Docker Images",
      duration: 45,
      type: "lesson" as const,
      description: "Master docker/build-push-action with BuildKit cache, multi-platform builds, GitHub Container Registry, and ECR — with image signing using cosign.",
      content: `# Building & Pushing Docker Images in GitHub Actions

## The Standard Docker Build Workflow

A minimal but production-worthy Docker build job:

\`\`\`yaml
name: Build & Push

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}   # e.g. myorg/myapp

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write       # required to push to GHCR
      id-token: write       # required for cosign OIDC signing

    outputs:
      image-digest: \${{ steps.build.outputs.digest }}
      image-tag: \${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

      # Set up Docker Buildx (required for caching and multi-arch)
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Log in to GitHub Container Registry
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      # Generate tags and labels from git context
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=sha-          # sha-abc1234
            type=ref,event=branch         # main
            type=semver,pattern={{version}} # v1.2.3 from tags
            type=raw,value=latest,enable=\${{ github.ref == 'refs/heads/main' }}

      # Build and push with layer caching
      - name: Build and push
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: \${{ github.event_name != 'pull_request' }}  # push only on merge
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
          cache-from: type=gha                 # restore cache from GitHub Actions cache
          cache-to: type=gha,mode=max          # save all layers to cache

      # Sign the image with cosign (supply chain security)
      - name: Sign image with cosign
        if: github.event_name != 'pull_request'
        uses: sigstore/cosign-installer@v3
      - run: |
          cosign sign --yes \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}@\${{ steps.build.outputs.digest }}
        if: github.event_name != 'pull_request'
        env:
          COSIGN_EXPERIMENTAL: 1
\`\`\`

## Layer Caching Strategies

Cache misses are the #1 cause of slow Docker builds. GitHub Actions supports two caching backends:

**GitHub Actions Cache (type=gha)** — Free, stored in GitHub's cache service. Max 10 GB per repo. Best for most teams:
\`\`\`yaml
cache-from: type=gha
cache-to: type=gha,mode=max   # mode=max caches ALL layers, not just final stage
\`\`\`

**Registry Cache (type=registry)** — Pushes cache layers to a registry. Survives runner restarts, shared across all runners. Better for large teams or expensive builds:
\`\`\`yaml
cache-from: type=registry,ref=ghcr.io/myorg/myapp:buildcache
cache-to: type=registry,ref=ghcr.io/myorg/myapp:buildcache,mode=max
\`\`\`

**Cache invalidation**: Docker invalidates layer cache when any instruction or its context changes. Order your Dockerfile so infrequently-changing layers (OS packages, runtime) come before frequently-changing layers (app code):

\`\`\`dockerfile
# Good: deps layer cached until package.json changes
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./          # copy only package files first
RUN npm ci --production        # this layer cached until package.json changes
COPY . .                       # app code — changes every commit, but layer above is cached
RUN npm run build
\`\`\`

## Multi-Platform / Multi-Arch Builds

GitHub-hosted runners are x86_64. To build ARM64 images (for Graviton EC2, Apple Silicon local dev, Raspberry Pi):

\`\`\`yaml
- name: Set up QEMU (required for cross-compilation)
  uses: docker/setup-qemu-action@v3
  with:
    platforms: linux/arm64

- name: Set up Buildx
  uses: docker/setup-buildx-action@v3

- name: Build multi-arch
  uses: docker/build-push-action@v5
  with:
    platforms: linux/amd64,linux/arm64
    push: true
    tags: ghcr.io/myorg/myapp:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
\`\`\`

QEMU emulates ARM64 on the x86_64 runner — it's slow (~3-5x slower for compilation). For production, use native ARM64 runners (GitHub offers arm64 runners in some tiers, or use self-hosted Graviton EC2 instances).

## Pushing to Amazon ECR

\`\`\`yaml
jobs:
  build-ecr:
    runs-on: ubuntu-latest
    permissions:
      id-token: write    # OIDC
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-ecr
          aws-region: us-east-1

      - name: Log in to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push to ECR
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            \${{ steps.login-ecr.outputs.registry }}/myapp:\${{ github.sha }}
            \${{ steps.login-ecr.outputs.registry }}/myapp:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
\`\`\`

## Container Vulnerability Scanning

Scan the built image before pushing or before deploying:

\`\`\`yaml
      - name: Scan image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ghcr.io/myorg/myapp:\${{ github.sha }}
          format: sarif
          output: trivy-results.sarif
          exit-code: '1'            # fail if critical CVEs found
          severity: CRITICAL,HIGH
          ignore-unfixed: true      # skip CVEs with no fix available

      - name: Upload Trivy results to Security tab
        uses: github/codeql-action/upload-sarif@v3
        if: always()               # upload even if scan failed
        with:
          sarif_file: trivy-results.sarif
\`\`\`

## Connecting Build to Deploy

Pass the image digest (immutable) between jobs — not the tag (which can be reassigned):

\`\`\`yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to ECS
        uses: aws-actions/amazon-ecs-deploy-task-definition@v1
        with:
          task-definition: task-definition.json
          service: my-service
          cluster: production
          # Use the digest from the build job — guaranteed immutable
          container-name: app
          image: ghcr.io/myorg/myapp@\${{ needs.build.outputs.image-digest }}
\`\`\``,
      interviewQuestions: [
        {
          question: "Why should you use the image digest rather than the image tag when deploying from CI?",
          answer: "Image tags are mutable — the same tag (like 'latest' or even 'v1.2.3') can be overwritten to point to a different image. If your deploy job references 'myapp:latest' and another pipeline pushes a new latest between your build and deploy steps, you'll deploy a different image than the one you tested. The image digest (sha256:abc123...) is immutable — it's a cryptographic hash of the image content and can never be reassigned. Using the digest in the deploy step guarantees you deploy exactly the image that was built and tested, not whatever happens to have that tag at deploy time.",
          difficulty: "mid" as const,
        },
      ],
    },
    {
      id: "ci-patterns-monorepo",
      title: "Real-World CI Patterns: Monorepos, Caching & Concurrency",
      duration: 45,
      type: "lesson" as const,
      description: "Solve real CI problems — path-filtered builds for monorepos, concurrency groups to cancel stale runs, workflow templates, and dependency caching for fast pipelines.",
      content: `# Real-World CI Patterns

## Path-Filtered Builds for Monorepos

In a monorepo, you don't want every service's CI to run when only one service's code changed. Path filtering scopes workflows to relevant changes:

\`\`\`yaml
# .github/workflows/service-api.yml
name: API Service CI

on:
  push:
    branches: [main]
    paths:
      - 'services/api/**'
      - 'shared/lib/**'       # shared lib changes also trigger API CI
      - '.github/workflows/service-api.yml'  # workflow file changes trigger it
  pull_request:
    branches: [main]
    paths:
      - 'services/api/**'
      - 'shared/lib/**'
      - '.github/workflows/service-api.yml'
\`\`\`

**Dynamic matrix from changed services** — Build only services that changed:
\`\`\`yaml
jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      services: \${{ steps.filter.outputs.changes }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            api: ['services/api/**']
            worker: ['services/worker/**']
            frontend: ['services/frontend/**']

  build:
    needs: detect-changes
    if: needs.detect-changes.outputs.services != '[]'
    strategy:
      matrix:
        service: \${{ fromJSON(needs.detect-changes.outputs.services) }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build \${{ matrix.service }}
        run: cd services/\${{ matrix.service }} && docker build .
\`\`\`

## Concurrency Control

Without concurrency limits, pushing 5 commits quickly starts 5 parallel CI runs — wasting runners and potentially deploying an old commit after a newer one:

\`\`\`yaml
# Cancel in-progress runs for the same branch when a new commit is pushed
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true
\`\`\`

**For production deploys — queue instead of cancel:**
\`\`\`yaml
concurrency:
  group: deploy-production
  cancel-in-progress: false   # queue; don't cancel an in-progress deploy
\`\`\`

**Per-PR concurrency** — Cancel the previous CI run for a PR when a new commit is pushed, but never cancel main:
\`\`\`yaml
concurrency:
  group: ci-\${{ github.ref == 'refs/heads/main' && github.run_id || github.ref }}
  cancel-in-progress: \${{ github.ref != 'refs/heads/main' }}
\`\`\`

## Dependency Caching

The \`actions/cache\` action stores directories between runs. For Node.js, Python, Go, and Gradle:

\`\`\`yaml
# Node.js — cache node_modules keyed by package-lock.json hash
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'              # built-in: automatically caches ~/.npm

# Python — cache pip packages
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: 'pip'              # caches ~/.cache/pip

# Go — cache module download cache and build cache
- uses: actions/setup-go@v5
  with:
    go-version: '1.22'
    cache: true               # caches ~/go/pkg/mod and ~/.cache/go-build

# Manual cache for other tools
- name: Cache Gradle
  uses: actions/cache@v4
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: gradle-\${{ runner.os }}-\${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
    restore-keys: |
      gradle-\${{ runner.os }}-
\`\`\`

**Cache key strategy** — Use a primary key + restore-keys fallback:
- Primary key: exact hash of lock file (perfect cache hit = no install needed)
- Restore key prefix: partial match returns closest cache (install only delta)

## Workflow Templates (Composite Actions)

Share common steps across workflows as a **composite action** stored in your repo:

\`\`\`yaml
# .github/actions/setup-node-app/action.yml
name: 'Setup Node App'
description: 'Checkout, setup Node, and install dependencies'
inputs:
  node-version:
    description: 'Node.js version'
    default: '20'
  working-directory:
    description: 'Directory containing package.json'
    default: '.'
outputs:
  cache-hit:
    description: 'Whether npm cache was hit'
    value: \${{ steps.setup.outputs.cache-hit }}

runs:
  using: composite
  steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      id: setup
      with:
        node-version: \${{ inputs.node-version }}
        cache: npm
        cache-dependency-path: \${{ inputs.working-directory }}/package-lock.json

    - name: Install dependencies
      shell: bash
      working-directory: \${{ inputs.working-directory }}
      run: npm ci --prefer-offline
\`\`\`

Use it:
\`\`\`yaml
steps:
  - uses: ./.github/actions/setup-node-app
    with:
      node-version: '20'
      working-directory: services/api
\`\`\`

## Environment Variables and Contexts

\`\`\`yaml
env:
  # Workflow-level env (all jobs)
  NODE_ENV: production
  APP_VERSION: \${{ github.sha }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      # Job-level env (this job only)
      DEPLOY_ENV: production

    steps:
      - name: Echo contexts
        run: |
          echo "Repo: \${{ github.repository }}"
          echo "Branch: \${{ github.ref_name }}"
          echo "SHA: \${{ github.sha }}"
          echo "Actor: \${{ github.actor }}"
          echo "Event: \${{ github.event_name }}"
          echo "Run ID: \${{ github.run_id }}"
          echo "Run number: \${{ github.run_number }}"

      # Dynamic env from a step output
      - name: Get version
        id: version
        run: echo "tag=\$(git describe --tags --abbrev=0)" >> \$GITHUB_OUTPUT

      - name: Use version
        run: echo "Deploying \${{ steps.version.outputs.tag }}"
\`\`\`

## Scheduled Workflows & Manual Triggers

\`\`\`yaml
on:
  # Run every day at 2 AM UTC
  schedule:
    - cron: '0 2 * * *'

  # Manual trigger with inputs
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        type: choice
        options: [dev, staging, production]
        required: true
      dry-run:
        description: 'Dry run (plan only, no apply)'
        type: boolean
        default: true
      version:
        description: 'Version to deploy (leave empty for latest)'
        type: string

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Show inputs
        run: |
          echo "Environment: \${{ inputs.environment }}"
          echo "Dry run: \${{ inputs.dry-run }}"
          echo "Version: \${{ inputs.version || 'latest' }}"
\`\`\`

## Notifications and PR Comments

\`\`\`yaml
      # Post plan output as PR comment (Terraform, cost estimates, etc.)
      - name: Comment on PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const output = \`## Terraform Plan

            \\\`\\\`\\\`
            \${{ steps.plan.outputs.stdout }}
            \\\`\\\`\\\`

            *Triggered by @\${{ github.actor }} on \`\${{ github.ref_name }}\`*\`;

            // Find and update existing comment, or create new one
            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });

            const existingComment = comments.find(c =>
              c.user.login === 'github-actions[bot]' &&
              c.body.includes('## Terraform Plan')
            );

            if (existingComment) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: existingComment.id,
                body: output
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body: output
              });
            }

      # Slack notification on deploy failure
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": ":red_circle: Deploy failed on *\${{ github.repository }}*",
              "blocks": [{
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": ":red_circle: *Deploy failed*\\nRepo: \${{ github.repository }}\\nBranch: \${{ github.ref_name }}\\nActor: \${{ github.actor }}\\n<\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|View run>"
                }
              }]
            }
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}
\`\`\``,
      interviewQuestions: [
        {
          question: "How do you prevent multiple production deploys from running simultaneously in GitHub Actions?",
          answer: "Use the 'concurrency' key with 'cancel-in-progress: false'. Setting a shared group name (e.g., 'deploy-production') means only one job in that group runs at a time — additional triggers queue up. 'cancel-in-progress: false' is critical for deploys: you don't want to cancel a running deploy halfway through (that would leave production in an inconsistent state). For PR CI builds, use 'cancel-in-progress: true' — you want the latest commit's tests, not the old one's. Set the group to include the branch ref so PRs don't cancel each other: group: ci-${{ github.ref }}.",
          difficulty: "mid" as const,
        },
      ],
    },
  ],
  exam: [
    { question: "A Docker image built in CI takes 8 minutes but most of the time is spent on 'npm install'. How do you fix this?", answer: "The npm install layer is being rebuilt on every commit because Docker cache is not persisted between GitHub Actions runner instances. Fix: 1) Enable GitHub Actions cache for BuildKit: add 'cache-from: type=gha' and 'cache-to: type=gha,mode=max' to docker/build-push-action. 2) Optimize the Dockerfile to maximize cache hits: copy only package.json and package-lock.json before running npm install, then copy the rest of the code. This way, the npm install layer is only invalidated when package*.json changes, not on every code change. Expected improvement: from 8 minutes to 30-60 seconds on cache hit.", difficulty: "mid" as const },
    { question: "You want to build a Docker image only for services that were actually changed in a monorepo PR. How do you implement this?", answer: "Use path filtering with dorny/paths-filter or tj-actions/changed-files to detect which service directories changed. Output the list as a JSON array, then use 'fromJSON()' to feed it into a matrix strategy. The detect-changes job outputs: services: '[\"api\",\"worker\"]' if those directories changed. The build job uses 'strategy.matrix.service: ${{ fromJSON(needs.detect-changes.outputs.services) }}' to run one job per changed service. Add the workflow file itself to all path filters so changing CI config triggers all builds.", difficulty: "senior" as const },
    { question: "A workflow secret is empty in a deploy job but works in the test job. Both jobs are in the same workflow file. What do you investigate?", answer: "The most common cause: the secret is scoped to a GitHub Environment and the deploy job specifies 'environment: production' while the test job doesn't. Environment secrets are only available to jobs that explicitly declare that environment. Other causes: 1) The secret name has a typo (case-sensitive). 2) The environment requires a reviewer approval before the job starts, and the secret is only available after approval — check if the job is waiting for approval in the Actions UI. 3) The secret was defined at the repo level but the deploy job is using a different environment's secret namespace. Debug: add a step that echoes '${{ secrets.MY_SECRET != \"\" }}' (prints true/false without revealing the value).", difficulty: "mid" as const },
  ],
},

{
  id: "actions-real-world-ci",
  title: "Full CI/CD Pipeline Patterns",
  level: "advanced" as const,
  description: "Complete end-to-end CI/CD pipelines for different stacks — Node.js, Python, Go, and Kubernetes — with environment promotion, OIDC auth, and release automation.",
  lessons: [
    {
      id: "complete-cicd-pipeline",
      title: "Complete CI/CD Pipeline: Build → Test → Deploy",
      duration: 50,
      type: "lesson" as const,
      description: "Build a complete production pipeline with PR checks, image build, staging deploy, production deploy with manual gate, and automated rollback.",
      content: `# Complete CI/CD Pipeline: Build → Test → Deploy

## Full Pipeline for a Node.js / Docker Application

This is a production-ready workflow split across three files for separation of concerns:

### File 1: PR Checks (.github/workflows/pr-checks.yml)

\`\`\`yaml
name: PR Checks

on:
  pull_request:
    branches: [main]

concurrency:
  group: pr-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Unit tests
        run: npm run test:unit -- --coverage

      - name: Integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: \${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: false

  security:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4

      - name: SAST with CodeQL
        uses: github/codeql-action/analyze@v3
        with:
          languages: javascript

      - name: Dependency audit
        run: npm audit --audit-level=high

      - name: Secret scanning
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: \${{ github.event.repository.default_branch }}
          head: HEAD
\`\`\`

### File 2: Build & Stage (.github/workflows/build-stage.yml)

\`\`\`yaml
name: Build & Stage

on:
  push:
    branches: [main]

concurrency:
  group: build-stage
  cancel-in-progress: false

env:
  REGISTRY: ghcr.io
  IMAGE: ghcr.io/\${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write
    outputs:
      digest: \${{ steps.push.outputs.digest }}
      version: \${{ steps.version.outputs.version }}

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0    # needed for git describe

      - name: Get version
        id: version
        run: |
          VERSION=\$(git describe --tags --abbrev=0 2>/dev/null || echo "0.0.0")
          echo "version=\${VERSION}-\${{ github.run_number }}" >> \$GITHUB_OUTPUT

      - name: Set up Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        id: push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            \${{ env.IMAGE }}:\${{ github.sha }}
            \${{ env.IMAGE }}:\${{ steps.version.outputs.version }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            VERSION=\${{ steps.version.outputs.version }}
            BUILD_DATE=\$(date -u +%Y-%m-%dT%H:%M:%SZ)
            GIT_SHA=\${{ github.sha }}

      - name: Scan image
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: \${{ env.IMAGE }}@\${{ steps.push.outputs.digest }}
          severity: CRITICAL
          exit-code: '1'
          ignore-unfixed: true

      - name: Sign image
        run: |
          cosign sign --yes \${{ env.IMAGE }}@\${{ steps.push.outputs.digest }}
        env:
          COSIGN_EXPERIMENTAL: 1

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.myapp.com
    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-staging-deploy
          aws-region: us-east-1

      - name: Deploy to staging
        run: |
          helm upgrade --install myapp ./charts/myapp \\
            --namespace staging \\
            --values charts/myapp/values-staging.yaml \\
            --set image.repository=\${{ env.IMAGE }} \\
            --set image.digest=\${{ needs.build.outputs.digest }} \\
            --set version=\${{ needs.build.outputs.version }} \\
            --atomic --timeout 5m --wait

      - name: Smoke tests
        run: |
          sleep 10  # let load balancer update
          curl -sf https://staging.myapp.com/health | jq '.status == "ok"'

      - name: E2E tests
        run: npx playwright test --project=staging
        env:
          BASE_URL: https://staging.myapp.com
\`\`\`

### File 3: Production Deploy (.github/workflows/deploy-prod.yml)

\`\`\`yaml
name: Deploy Production

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Image digest to deploy (sha256:...)'
        required: true
      confirm:
        description: 'Type DEPLOY to confirm production deployment'
        required: true

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Validate confirmation
        if: inputs.confirm != 'DEPLOY'
        run: |
          echo "Confirmation text must be 'DEPLOY'"
          exit 1

      - name: Verify image signature
        run: |
          cosign verify \\
            --certificate-identity-regexp="https://github.com/myorg/myapp" \\
            --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \\
            ghcr.io/myorg/myapp@\${{ inputs.version }}

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS (prod role)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::999888777666:role/github-prod-deploy
          aws-region: us-east-1

      - name: Deploy to production (canary)
        run: |
          helm upgrade --install myapp ./charts/myapp \\
            --namespace production \\
            --values charts/myapp/values-prod.yaml \\
            --set image.digest=\${{ inputs.version }} \\
            --set rollout.canaryWeight=10 \\
            --atomic --timeout 10m --wait

      - name: Post-deploy verification
        run: |
          ./scripts/post-deploy-verify.sh https://myapp.com

      - name: Annotate Grafana
        run: |
          curl -X POST https://grafana.mycompany.com/api/annotations \\
            -H "Authorization: Bearer \${{ secrets.GRAFANA_API_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d '{"text": "Deploy: \${{ inputs.version }} by \${{ github.actor }}", "tags": ["deploy","production"]}'
\`\`\`

## Release Automation

Automated semantic versioning and GitHub Releases on tag push:

\`\`\`yaml
name: Release

on:
  push:
    tags: ['v[0-9]+.[0-9]+.[0-9]+']

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
      id-token: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Build release image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            ghcr.io/myorg/myapp:\${{ github.ref_name }}
            ghcr.io/myorg/myapp:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true   # auto-generate from merged PRs
          make_latest: true
          files: |
            dist/myapp-linux-amd64
            dist/myapp-darwin-arm64
            checksums.txt
\`\`\``,
      interviewQuestions: [
        {
          question: "How do you handle secrets for multiple environments (dev, staging, prod) in GitHub Actions?",
          answer: "Use GitHub Environments with environment-scoped secrets. Create environments in Settings → Environments: 'staging' and 'production'. Add secrets to each environment (e.g., DATABASE_URL, API_KEY with different values per env). In the workflow, declare 'environment: staging' or 'environment: production' on the job. The job can only access that environment's secrets. Production environments can require manual reviewer approval before the job runs. For cross-account AWS access, use OIDC with different IAM roles per environment — the trust policy can restrict which branch or environment can assume each role.",
          difficulty: "mid" as const,
        },
      ],
    },
  ],
  exam: [
    { question: "A GitHub Actions workflow runs 'npm test' which passes, but integration tests that run against a PostgreSQL service container fail with 'connection refused'. What do you check?", answer: "Service containers in GitHub Actions are not immediately ready when the job starts — PostgreSQL needs time to initialize. Fix: add health check options to the service container definition: 'options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5'. GitHub Actions will wait until the health check passes before running job steps. Also verify: 1) The host is 'localhost' (not 'postgres') when services run on the same runner — service containers are accessible via localhost when using Docker-based runners. 2) The port mapping is correct: 'ports: [\"5432:5432\"]'. 3) The DATABASE_URL env var uses the correct credentials matching the service container's POSTGRES_USER/PASSWORD env vars.", difficulty: "mid" as const },
    { question: "How do you make a GitHub Actions workflow that only runs expensive E2E tests on PRs from team members, not from external contributors?", answer: "External contributors' PRs run with 'pull_request' trigger which has a read-only GITHUB_TOKEN and no access to secrets. Use 'pull_request_target' for the lightweight checks (runs with write token from the base repo) and gate expensive tests with a condition: 'if: github.event.pull_request.author_association == \"MEMBER\" || github.event.pull_request.author_association == \"COLLABORATOR\"'. For external PRs, run only safe checks (lint, unit tests with no secrets). Add a 'Run E2E' label workflow: when a maintainer applies a specific label to an external PR, trigger the E2E workflow — this gives humans explicit control over when untrusted code gets access to your environments.", difficulty: "senior" as const },
  ],
},
  ],
};
