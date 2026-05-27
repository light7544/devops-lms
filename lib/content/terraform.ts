import type { Track } from "./types";

export const terraformTrack: Track = {
  id: "terraform",
  title: "Terraform",
  description: "Infrastructure as Code from fundamentals to production",
  longDescription:
    "Master Terraform from HCL syntax to production-scale patterns — state management, modules, workspaces, CI/CD integration, and managing real cloud infrastructure on AWS/GCP/Azure.",
  icon: "Server",
  color: "#7c3aed",
  gradient: "track-terraform-gradient",
  tags: ["iac", "devops", "cloud", "automation"],
  modules: [
    {
      id: "iac-foundations",
      title: "Infrastructure as Code Fundamentals",
      level: "beginner",
      description: "Understand IaC principles and Terraform's architecture.",
      lessons: [
        {
          id: "what-is-iac",
          title: "What is Infrastructure as Code?",
          duration: 15,
          type: "lesson",
          description: "Understand why IaC exists, its benefits, and how Terraform fits in.",
          objectives: [
            "Explain the problems IaC solves vs. manual provisioning",
            "Compare Terraform to CloudFormation, Pulumi, and Ansible",
            "Understand Terraform's declarative model and idempotency",
            "Describe the Terraform workflow: write → plan → apply",
          ],
          content: `# Infrastructure as Code

## The Problem Before IaC

Before IaC, infrastructure was managed manually:

\`\`\`
Week 1: Engineer SSHes into server, installs packages, edits config files
Week 4: Another engineer SSHes in, changes some settings (undocumented)
Week 8: Server crashes. How do you rebuild it exactly?

Problems:
- Snowflake servers (each one is unique, undocumented)
- No version history ("who changed the firewall rule?")
- Slow scaling (manual steps take hours/days)
- Drift (what the docs say ≠ what's actually deployed)
- No testing ("hope it works" deployment strategy)
\`\`\`

## IaC Principles

**Declarative vs. Imperative:**

\`\`\`python
# Imperative (how): step-by-step instructions
server = create_server("t3.micro")
attach_security_group(server, create_sg([80, 443]))
attach_eip(server)

# Declarative (what): describe desired state
resource "aws_instance" "web" {
  instance_type = "t3.micro"
  security_groups = [aws_security_group.web.id]
}
# Terraform figures out HOW to make it happen
\`\`\`

**Idempotency**: Running Terraform 10 times produces the same result. If the infrastructure already matches the code, nothing changes.

**Immutability**: Rather than modifying servers in place (mutable), IaC creates new infrastructure and destroys the old. This eliminates configuration drift.

## Terraform vs. Alternatives

| Tool | Approach | Language | State | Use Case |
|------|----------|----------|-------|----------|
| Terraform | Declarative | HCL | Yes (remote) | Multi-cloud infra |
| CloudFormation | Declarative | JSON/YAML | Managed by AWS | AWS-only |
| Pulumi | Declarative | TypeScript/Python/Go | Yes | Developers prefer code over DSL |
| Ansible | Imperative | YAML | No (agentless) | Config mgmt, post-provisioning |
| CDK | Declarative | TypeScript/Python | Via CF | AWS, generates CF templates |

**When to use Terraform:**
- Multi-cloud or cloud-agnostic requirements
- Complex dependency graphs between resources
- Team already using HCL
- Need robust state management and import capabilities

## The Terraform Workflow

\`\`\`bash
# 1. Write — create .tf files describing desired state
# 2. Init — download providers and modules
terraform init

# 3. Plan — diff current state vs. desired state
terraform plan
# Shows: what will be created (+), changed (~), or destroyed (-)
# ALWAYS review before applying

# 4. Apply — execute the changes
terraform apply       # prompts for approval
terraform apply -auto-approve  # CI/CD (dangerous without plan review)

# 5. Destroy — tear everything down
terraform destroy
\`\`\`

## Terraform Architecture

\`\`\`
┌──────────────────────────────────────────┐
│           Your .tf Files (HCL)           │
└────────────────────┬─────────────────────┘
                     │
┌────────────────────▼─────────────────────┐
│         Terraform Core                    │
│  - Plan engine (dependency graph)         │
│  - State management                       │
│  - Module resolution                      │
└────────────────────┬─────────────────────┘
                     │ Provider API
┌────────────────────▼─────────────────────┐
│         Providers (plugins)               │
│  hashicorp/aws, hashicorp/google,         │
│  hashicorp/azurerm, hashicorp/kubernetes  │
└────────────────────┬─────────────────────┘
                     │ SDK calls
┌────────────────────▼─────────────────────┐
│         Cloud APIs (AWS, GCP, Azure)      │
└──────────────────────────────────────────┘
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What is the difference between declarative and imperative IaC? Which is Terraform?",
              difficulty: "junior",
              answer: `**Imperative IaC** describes the *steps* to reach a desired state — like a recipe. You write "create server, then attach security group, then configure load balancer." If you run it twice, it creates two servers.

**Declarative IaC** describes the *desired end state*. You write "I want a server with these properties and this security group." The tool figures out how to get there from the current state. Running it twice is a no-op if the state already matches.

**Terraform is declarative.** You describe what you want:
\`\`\`hcl
resource "aws_instance" "web" {
  instance_type = "t3.micro"
  ami           = "ami-abc123"
}
\`\`\`

Terraform compares this to the current state (what's actually in AWS) and calculates the minimal set of changes to reach the desired state. If the instance already exists with those properties, nothing changes (idempotency).

**The key benefit of declarative:** Infrastructure code becomes self-documenting — the code IS the documentation of what exists. With imperative scripts, you'd need to run them and check what they created.

**Comparison:**
- Ansible: primarily imperative (though it tries to be idempotent)
- CloudFormation: declarative
- Terraform: declarative
- Shell scripts: imperative`,
            },
            {
              question: "What happens when Terraform has a plan that destroys a production database? How do you prevent accidental destruction?",
              difficulty: "mid",
              answer: `**Prevention strategies:**

**1. lifecycle prevent_destroy:**
\`\`\`hcl
resource "aws_db_instance" "production" {
  identifier = "prod-postgres"
  # ...
  lifecycle {
    prevent_destroy = true  # Terraform errors if anything tries to destroy this
  }
}
\`\`\`
Terraform will refuse to plan a destroy of this resource with an error message.

**2. Automated plan review in CI/CD:**
\`\`\`yaml
- name: Check for destructive changes
  run: |
    terraform plan -out=plan.tfplan
    terraform show -json plan.tfplan | jq '
      .resource_changes[] | 
      select(.change.actions[] == "delete") |
      "DESTRUCTION: \(.address)"
    '
    # Fail the pipeline if any deletions are detected for protected resources
\`\`\`

**3. Separate state for databases:**
Keep long-lived stateful resources (DBs, S3 buckets) in a separate state file from application infrastructure. They have different lifecycles and destruction risk profiles.

**4. Required manual approval in CI:**
\`\`\`yaml
environment:
  name: production
# GitHub Environment requires human approval before apply runs
\`\`\`

**5. Delete protection at cloud level:**
- AWS RDS: enable deletion protection in the resource AND in the console
- S3: enable MFA delete
- AWS: use SCPs (Service Control Policies) to deny delete actions on tagged critical resources

**6. Backup and recovery:**
Even with all protections, always have automated snapshots: RDS automated backups, S3 versioning, regular pg_dump to a separate location.

**If you see a destruction in plan and it's unexpected:** Stop, investigate why Terraform thinks it needs to destroy. Often it's a \`name\` or \`identifier\` change that forces recreation. Use \`terraform state mv\` or add lifecycle \`ignore_changes\` to prevent.`,
            },
          ],
        },
        {
          id: "hcl-syntax",
          title: "HCL Syntax Deep Dive",
          duration: 20,
          type: "lesson",
          description: "Master HCL — resources, variables, locals, data sources, and expressions.",
          objectives: [
            "Write resources, variables, outputs, and locals",
            "Use data sources to query existing infrastructure",
            "Apply for_each and count for resource repetition",
            "Write dynamic blocks for complex nested configurations",
          ],
          content: `# HCL Syntax Deep Dive

## Core Resource Syntax

\`\`\`hcl
# resource "<provider>_<type>" "<local_name>" { }
resource "aws_instance" "web_server" {
  # Required arguments:
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  # Optional arguments:
  tags = {
    Name        = "web-\${var.environment}"
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  # Nested blocks:
  root_block_device {
    volume_size = 20
    encrypted   = true
  }

  lifecycle {
    create_before_destroy = true  # blue-green replacement
    prevent_destroy       = false
    ignore_changes        = [tags["LastUpdated"]]  # ignore specific tag changes
  }
}

# Reference another resource's attribute:
resource "aws_eip" "web" {
  instance = aws_instance.web_server.id   # implicit dependency
  domain   = "vpc"
}
\`\`\`

## Variables

\`\`\`hcl
# variables.tf
variable "environment" {
  description = "Deployment environment (dev/staging/prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_types" {
  type = map(string)
  default = {
    dev     = "t3.micro"
    staging = "t3.small"
    prod    = "t3.large"
  }
}

variable "allowed_cidrs" {
  type    = list(string)
  default = ["10.0.0.0/8"]
}

variable "db_config" {
  type = object({
    instance_class    = string
    allocated_storage = number
    multi_az          = bool
  })
  sensitive = true  # masked in plan output and logs
}
\`\`\`

\`\`\`bash
# Set variable values (multiple methods, in priority order):
# 1. CLI flag (highest priority):
terraform apply -var="environment=prod"
terraform apply -var-file="prod.tfvars"

# 2. terraform.tfvars (auto-loaded):
# environment = "staging"

# 3. *.auto.tfvars (auto-loaded):
# any file ending in .auto.tfvars

# 4. TF_VAR_ environment variables:
export TF_VAR_environment=prod

# 5. Default in variable block (lowest priority)
\`\`\`

## Locals — Computed Values

\`\`\`hcl
locals {
  # Computed from variables:
  instance_type = var.instance_types[var.environment]
  
  # Standardized naming:
  name_prefix = "\${var.project}-\${var.environment}"
  
  # Common tags applied everywhere:
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
    Repo        = "github.com/myorg/infra"
  }
  
  # Complex expressions:
  az_count = length(data.aws_availability_zones.available.names)
}

resource "aws_instance" "web" {
  instance_type = local.instance_type
  tags          = merge(local.common_tags, { Name = "\${local.name_prefix}-web" })
}
\`\`\`

## Data Sources — Query Existing Resources

\`\`\`hcl
# Query existing resources (not managed by this Terraform):
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical's AWS account

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-22.04-amd64-server-*"]
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_vpc" "default" {
  default = true
}

data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "my-terraform-state"
    key    = "network/terraform.tfstate"
    region = "us-east-1"
  }
}

# Use data source outputs:
resource "aws_instance" "web" {
  ami               = data.aws_ami.ubuntu.id
  availability_zone = data.aws_availability_zones.available.names[0]
  subnet_id         = data.terraform_remote_state.network.outputs.public_subnet_ids[0]
}
\`\`\`

## count and for_each — Resource Repetition

\`\`\`hcl
# count — simple repetition (use for identical resources):
resource "aws_instance" "workers" {
  count         = var.worker_count
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.medium"
  
  tags = {
    Name = "worker-\${count.index}"  # worker-0, worker-1, ...
  }
}

# Reference: aws_instance.workers[0].id, aws_instance.workers[*].id

# for_each — distinct named resources (preferred for maps/sets):
variable "subnets" {
  default = {
    "public-a"  = { cidr = "10.0.1.0/24", az = "us-east-1a" }
    "public-b"  = { cidr = "10.0.2.0/24", az = "us-east-1b" }
    "private-a" = { cidr = "10.0.11.0/24", az = "us-east-1a" }
  }
}

resource "aws_subnet" "subnets" {
  for_each          = var.subnets
  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value.cidr
  availability_zone = each.value.az
  
  tags = {
    Name = each.key  # "public-a", "public-b", "private-a"
  }
}

# Reference: aws_subnet.subnets["public-a"].id
# List all IDs: [for k, v in aws_subnet.subnets : v.id]
\`\`\`

## Outputs

\`\`\`hcl
# outputs.tf
output "instance_public_ip" {
  description = "Public IP of the web server"
  value       = aws_instance.web_server.public_ip
}

output "db_endpoint" {
  description = "Database connection endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true  # masked in output, but still in state
}

output "subnet_ids" {
  value = [for k, v in aws_subnet.subnets : v.id if startswith(k, "public")]
}
\`\`\`

## Dynamic Blocks

\`\`\`hcl
variable "ingress_rules" {
  default = [
    { port = 80, protocol = "tcp", cidrs = ["0.0.0.0/0"] },
    { port = 443, protocol = "tcp", cidrs = ["0.0.0.0/0"] },
    { port = 22, protocol = "tcp", cidrs = ["10.0.0.0/8"] },
  ]
}

resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = aws_vpc.main.id

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidrs
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
\`\`\`
`,
          interviewQuestions: [
            {
              question: "When would you use count vs for_each? What are the dangers of count?",
              difficulty: "mid",
              answer: `**Use count when:** Resources are truly identical and only differ in number. Example: 3 identical worker nodes.

**Use for_each when:** Resources are named/distinct and differ in properties. Example: subnets in different AZs with different CIDR blocks.

**The danger of count — index-based addressing:**

With \`count = 3\`, Terraform tracks resources as:
- \`aws_instance.workers[0]\`
- \`aws_instance.workers[1]\`
- \`aws_instance.workers[2]\`

If you remove the middle worker (now count = 2), Terraform:
- Keeps \`[0]\` unchanged
- **Destroys \`[2]\`** (old worker-2)
- **Recreates \`[1]\`** with what was worker-2's config

This is dangerous — removing one resource in the middle destroys and recreates all subsequent resources.

**with for_each — name-based addressing:**
\`\`\`hcl
for_each = toset(["worker-a", "worker-b", "worker-c"])
# Tracked as: workers["worker-a"], workers["worker-b"], workers["worker-c"]
\`\`\`
Removing "worker-b" only destroys "worker-b". "worker-a" and "worker-c" are untouched.

**Rule of thumb:** Default to for_each. Use count only for truly interchangeable resources (like copies of a load balancer target) or when creating zero or one resource conditionally:
\`\`\`hcl
count = var.create_bastion ? 1 : 0  # conditional creation
\`\`\``,
            },
            {
              question: "Explain Terraform data sources. When do you use them vs. resource references?",
              difficulty: "junior",
              answer: `**Data sources** let you query existing infrastructure that is NOT managed by the current Terraform configuration — they are read-only.

**Use data sources when:**
1. Infrastructure was created manually or by another team/tool
2. Resources are shared across Terraform configurations (e.g., a VPC managed by a network team)
3. You need dynamic values from the cloud provider (latest AMI, available AZs)
4. Reading outputs from another Terraform state

\`\`\`hcl
# Query the latest Amazon Linux 2023 AMI:
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# Use in a resource:
resource "aws_instance" "web" {
  ami = data.aws_ami.al2023.id  # always gets latest
}
\`\`\`

**Use resource references when:** The infrastructure IS managed by this Terraform config:
\`\`\`hcl
resource "aws_vpc" "main" { cidr_block = "10.0.0.0/16" }

resource "aws_subnet" "public" {
  vpc_id = aws_vpc.main.id  # reference, not data source
}
\`\`\`

**Key difference:** Data sources create an implicit read-only reference. Resource references create a dependency and Terraform manages the lifecycle. If you accidentally use a data source for something Terraform owns, you'll break the dependency graph and Terraform won't know to wait for the resource to exist before referencing it.`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your Terraform plan shows a production RDS instance will be destroyed and recreated. You did not intend this. What are the most common causes and how do you investigate?", answer: "Forced recreation happens when a resource attribute that requires replacement changes. Common causes: (1) The 'identifier' or 'name' of the resource changed in HCL — RDS cannot rename in-place. (2) A variable used in a computed attribute changed (e.g., environment name affecting a naming prefix). (3) The provider version was upgraded and the resource schema changed. Investigate: run 'terraform plan -out=plan.tfplan && terraform show -json plan.tfplan | jq .resource_changes[]' and look for the 'before' vs 'after' diff — the changing attribute is shown. To prevent accidental destruction, add 'lifecycle { prevent_destroy = true }' to critical resources.", difficulty: "senior" },
        { question: "What is Terraform state and why must it be stored remotely when working in a team?", answer: "Terraform state is a JSON file that maps HCL resource addresses (e.g., aws_instance.web) to real cloud resource IDs (e.g., i-0a1b2c3d4e5f). It also stores resource attributes for change detection. Without state, Terraform cannot determine what already exists and would try to create everything on every run. Remote state (S3, Terraform Cloud) is essential in teams because: (1) multiple engineers running apply simultaneously against local state causes corruption — last write wins, orphaning resources. (2) Local state files contain sensitive values (DB passwords, keys) — remote storage with encryption and IAM access controls is more secure. (3) Remote state with DynamoDB locking prevents concurrent applies.", difficulty: "mid" },
        { question: "Explain the difference between count and for_each in Terraform. In what scenario does using count instead of for_each cause dangerous resource destruction?", answer: "count creates a numbered array of resources (web[0], web[1], web[2]). for_each creates a map keyed by name (web['primary'], web['secondary']). Danger with count: if you remove an element from the middle of the list, Terraform shifts indices. Removing count=3's middle element makes the third element take the second slot — Terraform destroys the original second resource and recreates it with the third's config. With for_each, removing one key only destroys that exact resource; others are unaffected. Rule: use for_each when resources have distinct identities; use count only for truly interchangeable resources or conditional creation (count = var.enabled ? 1 : 0).", difficulty: "mid" },
        { question: "A new engineer accidentally deleted a Terraform resource from the state file using 'terraform state rm'. The real cloud resource still exists. How do you recover without destroying and recreating the resource?", answer: "Use 'terraform import' to bring the existing resource back under Terraform management. Steps: 1) Write (or verify) the HCL resource block that describes the resource. 2) Find the cloud resource's ID (from AWS console, CLI, or cloud provider). 3) Run 'terraform import <resource_address> <cloud_resource_id>' — e.g., 'terraform import aws_instance.web i-0a1b2c3d4e5f'. 4) Run 'terraform plan' and review the diff — you will likely need to update the HCL to match the actual resource attributes. 5) Iterate until plan shows 'No changes'. For Terraform 1.5+, you can use an 'import {}' block in HCL for declarative import.", difficulty: "mid" },
        { question: "What is the Terraform lock file (.terraform.lock.hcl) and what should you do with it in version control?", answer: "The lock file pins the exact version and cryptographic hashes of every provider used in the configuration. Even if a version constraint allows a range (e.g., ~> 5.0), the lock file records the specific version installed (e.g., 5.31.0) plus the SHA256 hashes of the downloaded binaries. Commit it to version control. This ensures every engineer and every CI/CD run uses exactly the same provider version — preventing 'works on my machine' bugs caused by different provider versions. The hashes also prevent supply chain attacks (a tampered provider binary won't match the recorded hash). To upgrade providers within constraints: 'terraform init -upgrade', then review and commit the updated lock file.", difficulty: "junior" },
        { question: "You have three environments (dev, staging, prod) managed with Terraform. Describe two approaches to structuring the code for multiple environments and the tradeoffs of each.", answer: "Approach 1 — Separate directories per environment: infra/dev/, infra/staging/, infra/prod/, each with its own backend config and tfvars. Tradeoff: clear isolation, each environment can differ in structure, but code duplication is high and drift between environments is harder to detect. Approach 2 — Single configuration with workspaces or variable files: one directory, different .tfvars per environment, separate backend keys per workspace. Tradeoff: less duplication, but all environments must use the same resource types and structure. In practice, separate directories with shared modules is the most common production pattern: environments call the same modules but pass different variable values, giving both code reuse and environment isolation.", difficulty: "senior" },
        { question: "What is a Terraform data source and how does it differ from a resource? Give a concrete example of when to use each.", answer: "A resource manages the full lifecycle of infrastructure — Terraform creates, updates, and destroys it. A data source is read-only — it queries existing infrastructure not managed by this Terraform configuration. Use a resource when Terraform should own the lifecycle: 'resource \"aws_vpc\" \"main\" { cidr_block = \"10.0.0.0/16\" }'. Use a data source when you need to reference infrastructure owned by another team, created manually, or managed by a different Terraform configuration: 'data \"aws_vpc\" \"existing\" { id = \"vpc-0a1b2c3d\" }'. Common examples: 'data \"aws_ami\"' to find the latest Amazon Linux AMI, 'data \"aws_availability_zones\"' to list available AZs, 'data \"terraform_remote_state\"' to read outputs from another stack.", difficulty: "junior" },
        { question: "Two engineers run 'terraform apply' simultaneously. There is no state locking configured. Describe exactly what goes wrong.", answer: "Both engineers read the current state file at the same time. Engineer A starts creating resources and writes the updated state (with new resource IDs) back to S3. Engineer B also starts creating resources — but based on the original state, so B does not know A's resources exist. B also writes its updated state back to S3, overwriting A's state. Now the state file reflects only B's changes. A's resources exist in AWS but are no longer in state — they are orphaned. On the next apply, Terraform will try to create A's resources again (it thinks they do not exist), potentially causing duplicate resource errors or creating untracked duplicates. Solution: use DynamoDB state locking ('dynamodb_table' in S3 backend config).", difficulty: "mid" },
        { question: "Explain how dynamic blocks work in Terraform and give a use case where they are preferable to duplicating static blocks.", answer: "A dynamic block generates repeated nested blocks from a collection variable, avoiding duplication. Syntax: 'dynamic \"ingress\" { for_each = var.ingress_rules; content { from_port = ingress.value.port; to_port = ingress.value.port; protocol = ingress.value.protocol; cidr_blocks = ingress.value.cidrs } }'. Use case: an AWS security group where the number of ingress rules varies by environment (dev allows SSH from everywhere, prod only from VPN). Without dynamic blocks, you'd need a separate aws_security_group resource per environment or hard-code all possible rules. With dynamic blocks, pass a list of rule objects as a variable and the block expands automatically. Also useful for optional blocks — use 'for_each = var.enable_feature ? [1] : []' to conditionally include a nested block.", difficulty: "mid" },
        { question: "What is Terraform's 'lifecycle' meta-argument and describe three of its options with use cases.", answer: "The lifecycle block controls how Terraform manages a resource's create/update/destroy behavior. (1) prevent_destroy = true: Terraform errors if a plan would destroy this resource. Use case: production databases, S3 buckets with critical data — prevents accidental deletion. (2) create_before_destroy = true: creates the replacement resource before destroying the old one. Use case: resources with unique names (like load balancer target groups) — avoids downtime during replacement. Without it, Terraform destroys first, then creates. (3) ignore_changes = [tags, ami]: Terraform ignores changes to specified attributes. Use case: EC2 instances where the AMI is updated by an external process (e.g., auto-patching) and you don't want Terraform to revert those changes on the next apply. Also useful for tags managed by external systems.", difficulty: "mid" },
      ],
    },
    {
      id: "terraform-core",
      title: "State Management & Providers",
      level: "intermediate",
      description: "Master Terraform state, remote backends, and provider configuration.",
      lessons: [
        {
          id: "state-management",
          title: "Terraform State Deep Dive",
          duration: 22,
          type: "lesson",
          description: "Understand Terraform state, remote backends, and state file operations.",
          objectives: [
            "Explain what Terraform state contains and why it's essential",
            "Configure remote backends (S3, Terraform Cloud) with locking",
            "Use terraform state commands for surgery",
            "Handle state corruption and recovery",
          ],
          content: `# Terraform State Deep Dive

## What is Terraform State?

State is a JSON file that maps your HCL resources to real-world infrastructure:

\`\`\`json
{
  "version": 4,
  "terraform_version": "1.6.0",
  "resources": [
    {
      "type": "aws_instance",
      "name": "web_server",
      "provider": "provider[\\"registry.terraform.io/hashicorp/aws\\"]",
      "instances": [
        {
          "attributes": {
            "id": "i-0a1b2c3d4e5f",
            "ami": "ami-0c55b159cbfafe1f0",
            "instance_type": "t3.micro",
            "public_ip": "54.201.3.100",
            "private_ip": "10.0.1.50",
            "tags": {"Name": "web-prod"},
            ...
          }
        }
      ]
    }
  ]
}
\`\`\`

**Why state is critical:**
- Maps resource addresses (e.g., \`aws_instance.web_server\`) to real IDs (e.g., \`i-0a1b2c3d4e5f\`)
- Tracks resource metadata not in the plan
- Enables dependency graph construction
- Enables change detection (current state vs. desired state)
- Without state: Terraform would try to create everything fresh every apply

## Remote Backends

Local state (\`terraform.tfstate\`) is a disaster waiting to happen in teams:
- Multiple engineers can apply simultaneously → corruption
- State file contains sensitive values → security risk
- No audit trail of who applied what

**S3 Backend with DynamoDB Locking:**

\`\`\`hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "prod/web/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true         # SSE-S3 encryption
    kms_key_id     = "arn:aws:kms:..."  # SSE-KMS for better audit
    
    # DynamoDB for state locking (prevents concurrent applies):
    dynamodb_table = "terraform-state-lock"
    
    # Optional: versioning (enable on the S3 bucket for state history)
  }
  
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"  # allow 5.x, not 6.x
    }
  }
}
\`\`\`

\`\`\`bash
# Bootstrap state infrastructure (chicken-and-egg: use CLI first):
aws s3 mb s3://mycompany-terraform-state --region us-east-1
aws s3api put-bucket-versioning --bucket mycompany-terraform-state \\
  --versioning-configuration Status=Enabled

aws dynamodb create-table \\
  --table-name terraform-state-lock \\
  --attribute-definitions AttributeName=LockID,AttributeType=S \\
  --key-schema AttributeName=LockID,KeyType=HASH \\
  --billing-mode PAY_PER_REQUEST

# Migrate local state to remote:
terraform init  # detects new backend, prompts to migrate
\`\`\`

## State Commands — Surgery

\`\`\`bash
# List all resources in state:
terraform state list
# aws_instance.web_server
# aws_s3_bucket.assets
# module.vpc.aws_vpc.main

# Show details of a resource in state:
terraform state show aws_instance.web_server

# Move a resource (rename in HCL without destroying):
terraform state mv aws_instance.web aws_instance.web_server
# Use case: you renamed a resource in HCL

# Remove from state without destroying (let someone else manage it):
terraform state rm aws_instance.web_server
# The EC2 instance still exists, Terraform just stops tracking it

# Import existing infrastructure into state:
terraform import aws_instance.web_server i-0a1b2c3d4e5f
# Brings unmanaged resource under Terraform management

# Pull state to local file:
terraform state pull > backup.tfstate

# Push state from file (DANGEROUS — overwrites remote):
terraform state push backup.tfstate
\`\`\`

## State Workspaces

\`\`\`bash
# Workspaces = separate state files in the same backend
terraform workspace new staging
terraform workspace new production
terraform workspace list
# * default
#   staging
#   production

terraform workspace select production
terraform apply  # applies against production state

# Use in code:
locals {
  env = terraform.workspace  # "production", "staging", "default"
}

resource "aws_instance" "web" {
  instance_type = local.env == "production" ? "t3.large" : "t3.micro"
}
\`\`\`

## Sensitive State Values

\`\`\`bash
# State files contain ALL resource attributes including secrets!
# Database passwords, private keys, etc. are in state in plaintext

# Always:
# 1. Encrypt state backend (S3 SSE-KMS)
# 2. Restrict access to state bucket (IAM policies)
# 3. Enable S3 access logging
# 4. Never commit state files to git

# Check for sensitive values:
terraform state show aws_db_instance.main | grep password
# If it shows, the state has the password. Encrypt your backend!
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What happens if two engineers run terraform apply simultaneously without state locking?",
              difficulty: "mid",
              answer: `**State corruption scenario:**

1. Engineer A runs \`terraform apply\` — reads state, starts creating resources
2. Engineer B runs \`terraform apply\` simultaneously — reads the SAME state (doesn't know about A's changes)
3. Both write their results back to state
4. The last write wins — one engineer's changes are lost from state
5. State now doesn't match reality — some resources exist but aren't in state

**Consequences:**
- Orphaned resources (exist in AWS but not in state → Terraform will try to create duplicates next run)
- Duplicate resources (Terraform creates new ones, not knowing old ones exist)
- Resource conflicts (two instances with the same name)
- Failed plans (state references resources that were already deleted)

**State locking prevents this:**
\`\`\`hcl
backend "s3" {
  dynamodb_table = "terraform-state-lock"  # atomic lock
}
\`\`\`

When Engineer A applies, DynamoDB creates a lock record. Engineer B's apply sees the lock and waits (or fails with "state is locked by another process"). After A finishes, the lock is released.

**Lock details in DynamoDB:**
\`\`\`bash
# Check current lock status:
aws dynamodb get-item \\
  --table-name terraform-state-lock \\
  --key '{"LockID": {"S": "mycompany-terraform-state/prod/terraform.tfstate"}}'

# Force-unlock (if a process died and left a stale lock):
terraform force-unlock <lock-id>  # use with extreme caution
\`\`\``,
            },
            {
              question: "How do you import existing AWS resources into Terraform without destroying them?",
              difficulty: "mid",
              answer: `**The import workflow:**

**Step 1 — Write the HCL resource block first:**
\`\`\`hcl
resource "aws_instance" "legacy_server" {
  ami           = "ami-abc123"  # fill in the actual values
  instance_type = "t3.large"
  tags          = { Name = "legacy-server" }
}
\`\`\`

**Step 2 — Import the resource:**
\`\`\`bash
# Find the resource ID (from AWS console or CLI):
aws ec2 describe-instances --filters Name=tag:Name,Values=legacy-server \\
  --query 'Reservations[].Instances[].InstanceId' --output text
# i-0a1b2c3d4e5f

# Import:
terraform import aws_instance.legacy_server i-0a1b2c3d4e5f
# Fetches all attributes from AWS and adds to state
\`\`\`

**Step 3 — Fix drift (the tricky part):**
\`\`\`bash
# Run plan to see differences between your HCL and actual resource:
terraform plan
# Shows: ~ aws_instance.legacy_server (change security_group from [...] to [...])
# You need to update your HCL to match reality, or accept the changes

# Iteratively update your HCL until plan shows "No changes"
\`\`\`

**Terraform 1.5+ Import Block (modern approach):**
\`\`\`hcl
# import.tf — declarative import
import {
  to = aws_instance.legacy_server
  id = "i-0a1b2c3d4e5f"
}

# Can also auto-generate the resource configuration:
\`\`\`
\`\`\`bash
terraform plan -generate-config-out=generated.tf
# Generates HCL from the actual AWS resource — a great starting point
\`\`\`

**Importing modules:**
\`\`\`bash
terraform import 'module.vpc.aws_vpc.main' vpc-0a1b2c3d
\`\`\`

**Important:** Never use \`terraform state push\` to manually add resources to state — that bypasses validation and can corrupt the state.`,
            },
          ],
        },
        {
          id: "variables-outputs",
          title: "Variables, Outputs & Modules",
          duration: 18,
          type: "lesson",
          description: "Structure Terraform code with modules for reusability.",
          objectives: [
            "Build reusable modules with versioned interfaces",
            "Use the Terraform Registry and version constraints",
            "Implement module composition patterns",
            "Understand provider inheritance in modules",
          ],
          content: `# Terraform Modules

Modules are reusable, versioned infrastructure components — Terraform's equivalent of functions or packages.

## Module Structure

\`\`\`
modules/
└── vpc/
    ├── main.tf         # resources
    ├── variables.tf    # inputs
    ├── outputs.tf      # outputs
    ├── versions.tf     # required_providers
    └── README.md       # documentation
\`\`\`

\`\`\`hcl
# modules/vpc/variables.tf
variable "cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
  
  validation {
    condition     = can(cidrhost(var.cidr_block, 0))
    error_message = "Must be a valid CIDR block."
  }
}

variable "enable_nat_gateway" {
  description = "Create NAT gateways for private subnets"
  type        = bool
  default     = true
}

variable "azs" {
  description = "Availability zones to use"
  type        = list(string)
}
\`\`\`

\`\`\`hcl
# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "\${var.name}-vpc"
  }
}

resource "aws_subnet" "public" {
  for_each = toset(var.azs)
  
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.cidr_block, 8, index(var.azs, each.value))
  availability_zone = each.value
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}
\`\`\`

\`\`\`hcl
# modules/vpc/outputs.tf
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = [for s in aws_subnet.public : s.id]
}
\`\`\`

## Using Modules

\`\`\`hcl
# Root module / main.tf

# Local module:
module "vpc" {
  source = "./modules/vpc"
  
  name       = "prod"
  cidr_block = "10.0.0.0/16"
  azs        = ["us-east-1a", "us-east-1b", "us-east-1c"]
  enable_nat_gateway = true
}

# Public registry module:
module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"   # SemVer constraint: 6.x only, not 7.x
  
  identifier     = "prod-postgres"
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t3.medium"
  
  db_name  = "appdb"
  username = "dbadmin"
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = module.vpc.database_subnet_group_name
}

# Use module outputs:
resource "aws_instance" "app" {
  subnet_id = module.vpc.public_subnet_ids[0]
}

output "db_endpoint" {
  value = module.rds.db_instance_endpoint
}
\`\`\`

## Version Constraints

\`\`\`hcl
# ~> 5.0   = >= 5.0.0, < 6.0.0 (patch and minor updates)
# ~> 5.20  = >= 5.20.0, < 5.21.0 (patch updates only)
# >= 5.0   = any version >= 5.0
# >= 5.0, < 6.0  = explicit range (same as ~> 5.0)

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
\`\`\`

\`\`\`bash
# Update providers (respecting version constraints):
terraform init -upgrade

# Lock file (.terraform.lock.hcl) pins exact versions:
# Commit this file to git for reproducible builds!
cat .terraform.lock.hcl
# provider "registry.terraform.io/hashicorp/aws" {
#   version     = "5.31.0"
#   constraints = "~> 5.0"
#   hashes = [...]
\`\`\`
`,
          interviewQuestions: [
            {
              question: "What is the Terraform lock file (.terraform.lock.hcl) and why should you commit it?",
              difficulty: "junior",
              answer: `The lock file (\`.terraform.lock.hcl\`) pins the exact versions of all providers used in a Terraform configuration, along with cryptographic hashes to verify integrity.

**Why it exists:** Version constraints like \`~> 5.0\` are ranges, not exact versions. Without a lock file, \`terraform init\` might download 5.20.0 today and 5.31.0 next month — different behavior from the same code.

**Why commit it to git:**
1. **Reproducibility**: Every engineer and CI/CD run uses exactly the same provider version
2. **Security**: Hashes prevent supply chain attacks (a compromised provider binary won't match the recorded hash)
3. **Auditability**: See exactly which provider version was introduced when

\`\`\`
# .terraform.lock.hcl
provider "registry.terraform.io/hashicorp/aws" {
  version     = "5.31.0"          # exact version pinned
  constraints = "~> 5.0"          # original constraint
  hashes = [
    "h1:abc123...",                # hash of the zip for this platform
    "zh:def456...",                # SHA256 of the zip (multi-platform)
  ]
}
\`\`\`

**Updating providers:**
\`\`\`bash
# Update to latest allowed by constraints:
terraform init -upgrade
# Updates .terraform.lock.hcl with new version and hashes
# Review the diff, commit the updated lock file
\`\`\`

**What NOT to commit:** \`.terraform/\` directory (downloaded providers/modules — these are large and platform-specific). Only the lock file goes to git.`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your S3 Terraform state bucket does not have versioning enabled. A 'terraform state push' command accidentally overwrites the state with a corrupt file. How do you recover and what does this incident highlight?", answer: "Without versioning, recovery is very difficult — the original state is permanently overwritten. Options: (1) Run 'terraform refresh' to reconstruct state from actual cloud resources (incomplete — it misses some metadata). (2) Manually reconstruct state by importing each resource one by one. (3) If you took a backup with 'terraform state pull > backup.tfstate' before the incident, push the backup back. This incident highlights: always enable S3 versioning on state buckets so you can restore previous versions instantly with 'aws s3api restore-object'. Also enable object lock for extra protection.", difficulty: "senior" },
        { question: "Explain the difference between terraform.tfvars and variables.tf. Which one should be committed to git and which should not?", answer: "variables.tf declares the variable definitions — their names, types, default values, descriptions, and validation rules. This is code and should always be committed to git. terraform.tfvars (and *.auto.tfvars) provides the actual values for variables. Whether to commit tfvars depends on sensitivity: non-sensitive values (environment name, region, instance type) can be committed. Sensitive values (passwords, API keys, certificates) must NOT be committed — use environment variables (TF_VAR_name) or a secrets manager. For environments with multiple tfvars (dev.tfvars, prod.tfvars), it is common to commit the non-sensitive ones and inject secrets via CI/CD pipeline variables.", difficulty: "junior" },
        { question: "A colleague proposes using Terraform workspaces to manage dev, staging, and production. You disagree. What are the risks of this approach?", answer: "Workspaces store separate state files but share the same Terraform code and backend configuration. Risks: (1) A mistake like running 'terraform apply' in the wrong workspace destroys production instead of dev — workspace is easy to switch accidentally. (2) All environments must use identical resource configurations — you cannot have fundamentally different architectures (e.g., dev has no NAT gateway but prod does without complex conditionals). (3) Workspace state isolation is logical, not physical — all state files are in the same bucket under different keys, reducing the blast radius protection of truly separate backends. Preferred alternative: separate directories per environment with separate backend configs and IAM roles, providing hard isolation.", difficulty: "senior" },
        { question: "You want to create a reusable Terraform module for an S3 bucket with optional versioning. How do you make versioning optional with a clean interface?", answer: "Define a boolean variable with a default: 'variable \"enable_versioning\" { type = bool; default = false }'. In the resource, use a dynamic block or conditional lifecycle: 'dynamic \"versioning\" { for_each = var.enable_versioning ? [1] : []; content { enabled = true } }'. This way, callers that don't specify enable_versioning get versioning disabled, while callers that need it set 'enable_versioning = true'. For the module interface, also export relevant outputs (bucket_id, bucket_arn) so callers can reference the bucket in other resources. Keep the module focused — one S3 bucket configuration, not multiple different resources.", difficulty: "mid" },
        { question: "What happens when you run 'terraform init' in a directory with a backend configuration for the first time after previously running it without a backend?", answer: "Terraform detects that you have added a backend configuration and prompts you to migrate local state to the new remote backend. It asks: 'Do you want to copy existing state to the new backend?' If you answer yes, it uploads your local terraform.tfstate to the remote backend (e.g., S3), then removes the local state file. After migration, the local .terraform/terraform.tfstate (a pointer to the backend) is updated. If you answer no, you start with empty remote state — existing resources become untracked. Always choose yes during migration. After migration, safe to delete the local terraform.tfstate file (it's been uploaded).", difficulty: "mid" },
        { question: "A module in the Terraform Registry has a bug in version 5.2.0 but 5.1.0 works correctly. How do you pin the module to 5.1.0 and prevent accidental upgrades?", answer: "Set an exact version constraint in the module source block: 'module \"rds\" { source = \"terraform-aws-modules/rds/aws\"; version = \"5.1.0\" }'. The exact constraint (without tilde or comparison operators) pins to exactly that version. Run 'terraform init' to download 5.1.0 and update the lock file. Commit the updated .terraform.lock.hcl — this also locks the module version hash. To upgrade once the bug is fixed: update the version string to '5.3.0' (skipping the broken 5.2.0), run 'terraform init', review the plan carefully, and commit the updated lock file.", difficulty: "junior" },
        { question: "You have an existing EC2 instance not managed by Terraform. Walk through importing it and resolving the inevitable plan drift.", answer: "Step 1: write an HCL resource block with the known configuration: 'resource \"aws_instance\" \"web\" { ami = \"ami-abc\"; instance_type = \"t3.micro\" }'. Step 2: import the instance: 'terraform import aws_instance.web i-0a1b2c3d4e5f'. Terraform fetches all 40+ attributes from AWS and adds them to state. Step 3: run 'terraform plan' — it will show many differences between your minimal HCL and the full state. Step 4: iteratively update the HCL to match the actual resource, adding missing attributes (security_groups, subnet_id, tags, etc.) until plan shows 'No changes'. Tip: use 'terraform plan -generate-config-out=generated.tf' (Terraform 1.5+) to auto-generate the full HCL as a starting point.", difficulty: "mid" },
        { question: "What is the purpose of 'terraform refresh' and when should you avoid using it?", answer: "'terraform refresh' queries the cloud provider for the current state of all resources tracked in state and updates the state file to match reality — without making any changes. Use it when: you know someone made manual changes outside Terraform and you want state to reflect reality before planning. Avoid it when: (1) you are using it as a routine step — it adds provider API calls and latency; plan already performs a refresh by default. (2) Your provider API has rate limits — refresh hammers all resources. (3) In automated pipelines — terraform plan already includes refresh. In Terraform 1.5+, 'terraform plan -refresh-only' is the safer alternative that shows what would change in state without modifying infrastructure.", difficulty: "mid" },
        { question: "A Terraform plan shows 'forces replacement' for an EC2 instance due to a root_block_device change. How do you change the volume size without destroying the instance?", answer: "EC2 root volume resizes can be done in-place via AWS if you use the 'volume_size' attribute under root_block_device — Terraform can modify this without replacement. The 'forces replacement' often happens when other attributes change. First, check the plan diff carefully to see which attribute is triggering replacement — it may not be volume_size itself but something else (encrypted, volume_type, delete_on_termination). If the change must be applied without replacement: (1) Make the change manually in AWS console to match the desired state, (2) Add 'lifecycle { ignore_changes = [root_block_device] }' temporarily to prevent Terraform from detecting the difference, (3) Or use 'create_before_destroy' if you must replace.", difficulty: "senior" },
        { question: "Explain provider version constraints. What is the difference between '~> 5.0', '>= 5.0', and '= 5.31.0'?", answer: "'~> 5.0' is the pessimistic constraint operator meaning >= 5.0.0 and < 6.0.0 — allows all minor and patch releases of 5.x but prevents major version upgrades. '~> 5.20' means >= 5.20 and < 5.21 — allows only patch updates. '>= 5.0' allows any version >= 5.0, including 6.x, 7.x — too permissive for production as a major release may have breaking changes. '= 5.31.0' pins to exactly 5.31.0 — most restrictive, requires explicit HCL change to upgrade. Recommended practice: use '~> 5.0' for stability with automatic patch/minor updates, and rely on the lock file (.terraform.lock.hcl) to pin the exact version used in each environment. Run 'terraform init -upgrade' intentionally when you want to adopt newer versions.", difficulty: "mid" },
      ],
    },
    {
      id: "terraform-cicd",
      title: "Terraform in CI/CD",
      level: "advanced",
      description: "Automate Terraform with CI/CD pipelines and policy enforcement.",
      lessons: [
        {
          id: "terraform-pipelines",
          title: "Terraform CI/CD Pipelines",
          duration: 25,
          type: "lesson",
          description: "Build safe, reviewable Terraform automation in GitHub Actions.",
          objectives: [
            "Implement the plan-then-apply pattern with manual approval",
            "Use Atlantis or Terraform Cloud for PR-based workflows",
            "Apply policy enforcement with OPA or Sentinel",
            "Handle multiple environments with workspaces or separate states",
          ],
          content: `# Terraform CI/CD Pipelines

## The Core Problem — Automation vs. Safety

Running \`terraform apply\` automatically is dangerous:
- Unexpected changes could destroy production
- No code review of the infrastructure changes
- No audit trail of what was applied and when

**The safe pattern:**
1. Developer opens PR with Terraform changes
2. CI runs \`terraform plan\` and posts the plan as a PR comment
3. Team reviews the plan (like reviewing a diff)
4. After approval, merge to main triggers \`terraform apply\`

## GitHub Actions Pipeline

\`\`\`yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  pull_request:
    paths: ['infra/**']
  push:
    branches: [main]
    paths: ['infra/**']

permissions:
  contents: read
  pull-requests: write
  id-token: write  # for OIDC auth with AWS

env:
  TF_VERSION: "1.6.0"
  AWS_REGION: "us-east-1"

jobs:
  terraform:
    name: Terraform Plan / Apply
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: infra/

    steps:
      - uses: actions/checkout@v4

      # OIDC auth with AWS (no stored credentials):
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-terraform-role
          aws-region: \${{ env.AWS_REGION }}

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}

      - name: Terraform Init
        id: init
        run: terraform init

      - name: Terraform Validate
        id: validate
        run: terraform validate -no-color

      - name: Terraform Plan
        id: plan
        if: github.event_name == 'pull_request'
        run: terraform plan -no-color -out=plan.tfplan
        continue-on-error: true  # post plan even if it fails

      - name: Post Plan to PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const output = \`#### Terraform Plan
            \\\`\\\`\\\`
            \${{ steps.plan.outputs.stdout }}
            \\\`\\\`\\\`
            *Pushed by: @\${{ github.actor }}*\`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            })

      - name: Terraform Plan Status
        if: steps.plan.outcome == 'failure'
        run: exit 1

      # Apply only on merge to main:
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        run: terraform apply -auto-approve
\`\`\`

## Policy as Code — OPA / Sentinel

\`\`\`hcl
# OPA policy: prevent unencrypted S3 buckets
# policies/s3_encryption.rego

package terraform.s3

deny[msg] {
  resource := input.planned_values.root_module.resources[_]
  resource.type == "aws_s3_bucket"
  
  # Find the encryption config
  not resource_has_encryption(resource)
  
  msg := sprintf("S3 bucket '%v' must have server-side encryption enabled", [resource.address])
}

resource_has_encryption(resource) {
  input.planned_values.root_module.resources[_].type == "aws_s3_bucket_server_side_encryption_configuration"
}
\`\`\`

\`\`\`bash
# Run OPA against terraform plan:
terraform show -json plan.tfplan > plan.json
opa eval --data policies/ --input plan.json "data.terraform.s3.deny" | jq '.'

# Integrate into CI:
- name: Policy Check
  run: |
    terraform show -json plan.tfplan > plan.json
    VIOLATIONS=\$(opa eval --data policies/ --input plan.json "data.terraform.deny" --format raw)
    if [ "\$VIOLATIONS" != "[]" ]; then
      echo "Policy violations found:"
      echo \$VIOLATIONS
      exit 1
    fi
\`\`\`

## Multi-Environment Pattern

\`\`\`
infra/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── backend.tf      # state: s3://bucket/dev/terraform.tfstate
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   │   ├── backend.tf      # state: s3://bucket/staging/terraform.tfstate
│   │   └── terraform.tfvars
│   └── production/
│       ├── main.tf
│       ├── backend.tf      # state: s3://bucket/prod/terraform.tfstate
│       └── terraform.tfvars
└── modules/
    ├── vpc/
    ├── eks/
    └── rds/
\`\`\`

\`\`\`hcl
# environments/production/main.tf
module "vpc" {
  source = "../../modules/vpc"
  # Use production-sized config:
  cidr_block         = "10.0.0.0/16"
  enable_nat_gateway = true
  single_nat_gateway = false  # HA: one per AZ
}
\`\`\`

## Drift Detection

\`\`\`yaml
# Scheduled workflow to detect drift (someone changed infra outside Terraform):
name: Drift Detection
on:
  schedule:
    - cron: '0 6 * * 1-5'  # Monday-Friday at 6 AM UTC

jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for drift
        run: |
          terraform plan -detailed-exitcode
          # Exit code 0 = no changes
          # Exit code 1 = error
          # Exit code 2 = changes detected (drift!)
        continue-on-error: true

      - name: Alert on drift
        if: steps.drift.outcome == 'failure'
        run: |
          # Send Slack notification, create GitHub issue, etc.
          gh issue create --title "Infrastructure drift detected" \\
            --body "Terraform plan shows differences in production"
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Walk me through how you would set up a safe Terraform CI/CD pipeline that prevents accidental production changes.",
              difficulty: "senior",
              answer: `**The design goals:**
- No one can apply without a reviewed plan
- Plan is visible to reviewers (not just "trust me")
- Production requires human approval
- Credentials are never stored as long-lived secrets

**Pipeline design:**

\`\`\`
PR opened
  ↓
terraform validate + tfsec/checkov (static analysis)
  ↓
terraform plan (per environment affected)
  ↓
Plan posted as PR comment (human readable)
  ↓
Code review (both code diff AND plan diff)
  ↓
PR approved + merged to main
  ↓
Dev/Staging: terraform apply (automatic)
  ↓
Production: GitHub Environment approval gate (manual)
  ↓
terraform apply (production)
  ↓
Slack notification with apply summary
\`\`\`

**Key implementation details:**

1. **Saved plan file**: Plan is saved with \`-out=plan.tfplan\` and apply uses the saved plan (\`terraform apply plan.tfplan\`). This ensures what was reviewed is exactly what gets applied.

2. **OIDC auth**: No long-lived AWS credentials. GitHub OIDC → IAM role assumption with conditions:
\`\`\`json
"Condition": {
  "StringEquals": {
    "token.actions.githubusercontent.com:sub": "repo:myorg/infra:ref:refs/heads/main"
  }
}
\`\`\`

3. **Separate roles per environment**: Dev GitHub Actions role has no access to production state. Production role only assumable from \`refs/heads/main\`.

4. **Policy checks before apply**:
\`\`\`bash
terraform show -json plan.tfplan | opa eval --data policies/ --input -
\`\`\`

5. **Blast radius limits**: Production Terraform role has explicit deny on delete actions for critical resources (via SCP or IAM boundary).

6. **Audit trail**: Every apply creates a GitHub Actions run log. State versioning in S3 shows before/after. CloudTrail shows actual API calls.`,
            },
          ],
        },
      ],
      exam: [
        { question: "Walk me through designing a safe Terraform CI/CD pipeline that prevents accidental production changes while still enabling automation.", answer: "The pipeline design: (1) On PR open: run terraform validate and tfsec/checkov for static analysis, then terraform plan -out=plan.tfplan and post the plan output as a PR comment. Engineers review both the code diff and the infrastructure plan. (2) On PR merge to main: run terraform apply plan.tfplan (the saved plan file, not a fresh plan — ensures exactly what was reviewed is applied). (3) For production: add a GitHub Environment with required reviewers — apply is gated behind manual approval. (4) Use OIDC for AWS authentication (no long-lived credentials stored as GitHub secrets). (5) Use separate IAM roles per environment — the dev role cannot touch production state. (6) Run drift detection on a schedule to catch out-of-band changes.", difficulty: "senior" },
        { question: "Why is it important to use the saved plan file ('terraform apply plan.tfplan') in CI/CD rather than running a fresh 'terraform apply' after PR approval?", answer: "When you run 'terraform plan -out=plan.tfplan', Terraform captures the exact changes it will make at that point in time — based on the current state and the proposed code. If you then run a fresh 'terraform apply' (without the plan file) after approval, the underlying infrastructure or state may have changed in the intervening time — another apply ran, someone made a manual change, a concurrent deployment completed. The fresh apply would calculate a new plan that may differ from what was reviewed and approved. Using the saved plan file guarantees that what was reviewed is exactly what gets applied — no surprises between approval and execution.", difficulty: "senior" },
        { question: "A GitHub Actions Terraform pipeline fails with 'Error: error configuring S3 backend: no valid credential sources found'. The pipeline was working yesterday. What do you investigate?", answer: "This error means Terraform cannot authenticate to AWS to access the state backend. Investigate in order: (1) Check if the GitHub Actions OIDC configuration is still valid — has the IAM role trust policy changed, or did the GitHub organization/repo name change? (2) Verify the 'Configure AWS Credentials' step in the workflow logs — is it successfully assuming the role? (3) If using static credentials (Access Key/Secret), check if the GitHub secret was accidentally deleted or expired. (4) Verify the IAM role has permission to access the specific S3 bucket and DynamoDB table used for state. (5) Check if the S3 bucket still exists and is in the same region as configured in the backend.", difficulty: "mid" },
        { question: "You want to implement a policy that prevents any Terraform plan from creating unencrypted S3 buckets. Describe how you would implement this with OPA.", answer: "Write an OPA Rego policy that evaluates the Terraform plan JSON: 'package terraform.s3; deny[msg] { resource := input.planned_values.root_module.resources[_]; resource.type == \"aws_s3_bucket\"; not has_encryption(resource); msg := sprintf(\"S3 bucket %v must have encryption configured\", [resource.address]) }'. In CI: (1) Generate plan JSON: 'terraform plan -out=plan.tfplan && terraform show -json plan.tfplan > plan.json'. (2) Evaluate: 'opa eval --data policies/ --input plan.json \"data.terraform.s3.deny\" --format raw'. (3) Fail the pipeline if the output is not empty ('[]'). This runs before apply so policy violations block the merge, not just report after deployment.", difficulty: "senior" },
        { question: "Explain how drift detection works with Terraform and how you would implement a scheduled drift detection pipeline.", answer: "Drift occurs when infrastructure changes outside Terraform — manual console edits, automated tools, or other deployment systems. 'terraform plan -detailed-exitcode' returns exit code 0 (no changes), 1 (error), or 2 (changes detected/drift). A scheduled GitHub Actions workflow runs this command daily or hourly. If exit code is 2, the workflow posts a Slack notification and creates a GitHub issue with the plan output showing what drifted. The team reviews and decides: update HCL to match reality (if the change was intentional) or run apply to revert to desired state (if the change was unauthorized). Key: run drift detection in read-only mode — never auto-apply to fix drift, as the drift might be an emergency change that should be codified.", difficulty: "senior" },
        { question: "A team member runs 'terraform apply -auto-approve' directly on production from their laptop. How do you prevent this class of problem?", answer: "Architectural controls: (1) The production state S3 bucket and DynamoDB table should only be accessible by a specific IAM role that is not assignable to human users — only assumable by the CI/CD service account (GitHub Actions OIDC role). Individual engineers' AWS credentials should have no access to the production state bucket. (2) Use an SCP (Service Control Policy) or Permission Boundary to restrict who can assume the production Terraform role. (3) Enable CloudTrail and alert on any terraform apply API calls not originating from the expected CI/CD IP range or role. (4) Require Terraform changes to go through the Git PR process — no one has a local workflow that bypasses it.", difficulty: "senior" },
        { question: "Your Terraform CI/CD pipeline fails during 'terraform init' with 'Failed to install provider: the object at this URL is not a valid zip archive'. What are the likely causes?", answer: "This error indicates the downloaded provider binary is corrupt or the download was interrupted. Causes: (1) Network issues during provider download — the file downloaded partially. (2) Proxy server or firewall is intercepting and modifying the download. (3) The .terraform.lock.hcl hash no longer matches what the registry serves (rare — provider was tampered with or the registry had a bug). (4) Corporate proxy requiring authentication is inserting an HTML error page instead of the binary. Fixes: (1) Add 'rm -rf .terraform' before 'terraform init' in CI to start fresh. (2) Check if the runner has direct internet access to registry.terraform.io. (3) Use a private registry mirror if direct access is not allowed. (4) Verify provider hash with the Terraform registry.", difficulty: "mid" },
        { question: "What is Terraform's 'terraform plan -refresh=false' flag and when would you use it in a CI/CD pipeline?", answer: "'-refresh=false' skips the provider API calls that synchronize state with the real world before planning. Normally, terraform plan queries each cloud resource to detect out-of-band changes. With -refresh=false, Terraform uses the last known state as-is. Use cases in CI/CD: (1) Speed: in large environments with hundreds of resources, the refresh phase can take minutes of API calls — skipping it makes the plan run faster for quick feedback. (2) API rate limits: if your cloud provider rate-limits describe/get calls, frequent CI plan runs can exhaust the quota. (3) Offline/air-gapped environments. Caveat: you may miss drift — someone else's apply or a manual change won't be detected. Run full refresh on nightly drift detection runs but skip for quick PR feedback.", difficulty: "mid" },
        { question: "Describe the OIDC authentication flow for GitHub Actions to AWS and why it is preferred over storing AWS access keys as GitHub secrets.", answer: "OIDC flow: (1) GitHub generates a signed JWT for the workflow run, including claims like the repository name, branch, and commit SHA. (2) The 'Configure AWS Credentials' action presents this JWT to AWS STS. (3) AWS validates the JWT signature against GitHub's public OIDC endpoint and checks the IAM role's trust policy conditions (e.g., 'StringEquals token.actions.githubusercontent.com:sub repo:myorg/infra:ref:refs/heads/main'). (4) STS issues short-lived credentials (valid 1 hour) that the workflow uses. Advantages over access keys: no long-lived credentials to rotate, audit, or accidentally expose. Credentials are valid only for the specific workflow run. Trust conditions can restrict which repos, branches, or environments can assume the role — dev branch cannot assume the production role.", difficulty: "senior" },
        { question: "A Terraform apply fails midway through creating 10 resources. 5 resources were created before the failure. What is the state of the Terraform configuration and what do you do next?", answer: "Terraform writes each resource to state as it is created — it does not roll back. The state now contains the 5 created resources. The other 5 either do not exist or exist partially. Steps: (1) Do NOT re-run apply immediately — first understand why it failed. Check the error message and cloud provider logs. (2) Run 'terraform plan' to see what Terraform intends to do next — it will try to create the remaining 5 resources. Review the plan for correctness. (3) Fix the underlying cause (permissions issue, resource limit, configuration error). (4) Re-run 'terraform apply' — Terraform picks up where it left off, only creating resources not yet in state. Terraform is designed for this — partial applies are recoverable without manual cleanup if the created resources are not conflicting.", difficulty: "mid" },
      ],
    },
    {
      id: "terraform-modules",
      title: "Terraform Modules & Workspaces",
      level: "intermediate",
      description: "Build reusable infrastructure components and manage multiple environments.",
      lessons: [
        {
          id: "writing-modules",
          title: "Writing Reusable Terraform Modules",
          duration: 30,
          type: "lesson",
          description: "Design and build reusable Terraform modules with proper inputs, outputs, and versioning.",
          objectives: [
            "Understand Terraform module structure and design principles",
            "Write modules with variables, outputs, and locals",
            "Use the Terraform Registry and version constraints",
            "Test modules with terratest or manual validation",
          ],
          content: `# Writing Reusable Terraform Modules

## Why Modules?

Without modules, every team copy-pastes infrastructure code. A bug in the VPC setup gets replicated across 20 repos. Modules solve this:

\`\`\`
modules/
  vpc/           ← one VPC implementation, used everywhere
  eks-cluster/   ← one EKS cluster pattern
  rds-postgres/  ← one database pattern
  alb/           ← one load balancer pattern

environments/
  dev/    → calls modules with dev-sized configs
  staging/ → same modules, staging-sized configs
  prod/   → same modules, production-sized configs
\`\`\`

The same infrastructure pattern is tested once, version-controlled, and promoted.

## Module File Structure

A well-structured module:

\`\`\`
modules/vpc/
  main.tf        ← actual resources
  variables.tf   ← input declarations
  outputs.tf     ← what callers can reference
  versions.tf    ← required_providers, terraform version
  README.md      ← usage examples (auto-generated with terraform-docs)
\`\`\`

### variables.tf — Inputs

\`\`\`hcl
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"

  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "vpc_cidr must be a valid CIDR block."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be dev, staging, or prod."
  }
}

variable "private_subnet_count" {
  description = "Number of private subnets to create"
  type        = number
  default     = 2
}

variable "enable_nat_gateway" {
  description = "Whether to create a NAT gateway for private subnets"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags to merge with default tags"
  type        = map(string)
  default     = {}
}
\`\`\`

### main.tf — Resources

\`\`\`hcl
locals {
  # Merge caller-provided tags with module defaults
  common_tags = merge(
    {
      Module      = "vpc"
      Environment = var.environment
      ManagedBy   = "terraform"
    },
    var.tags
  )

  # Generate subnet CIDRs dynamically
  private_subnets = [
    for i in range(var.private_subnet_count) :
    cidrsubnet(var.vpc_cidr, 8, i + 10)
  ]

  public_subnets = [
    for i in range(2) :
    cidrsubnet(var.vpc_cidr, 8, i)
  ]
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = merge(local.common_tags, { Name = "\${var.environment}-vpc" })
}

resource "aws_subnet" "private" {
  count             = var.private_subnet_count
  vpc_id            = aws_vpc.this.id
  cidr_block        = local.private_subnets[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index % length(data.aws_availability_zones.available.names)]
  tags              = merge(local.common_tags, { Name = "\${var.environment}-private-\${count.index + 1}", Tier = "private" })
}

resource "aws_nat_gateway" "this" {
  count         = var.enable_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id
  tags          = merge(local.common_tags, { Name = "\${var.environment}-nat" })
  depends_on    = [aws_internet_gateway.this]
}
\`\`\`

### outputs.tf — Expose What Callers Need

\`\`\`hcl
output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.this.id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.this.cidr_block
}
\`\`\`

## Calling a Module

\`\`\`hcl
# environments/prod/main.tf

module "vpc" {
  source  = "../../modules/vpc"   # local path
  # OR from registry:
  # source  = "terraform-aws-modules/vpc/aws"
  # version = "~> 5.0"

  vpc_cidr             = "10.0.0.0/16"
  environment          = "prod"
  private_subnet_count = 3
  enable_nat_gateway   = true

  tags = {
    CostCenter = "platform"
    Owner      = "infra-team"
  }
}

# Use module outputs in other resources
resource "aws_eks_cluster" "main" {
  name = "prod-eks"

  vpc_config {
    subnet_ids = module.vpc.private_subnet_ids
  }
}
\`\`\`

## Module Versioning

For modules shared across teams, publish to a registry with version constraints:

\`\`\`hcl
# Using the public Terraform Registry
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.1"   # >= 5.1.0, < 6.0.0 (minor version pinning)
}

# Private registry (Terraform Cloud / self-hosted)
module "vpc" {
  source  = "app.terraform.io/myorg/vpc/aws"
  version = "= 2.3.1"   # exact pin for production
}

# Git source with tag (simpler private option)
module "vpc" {
  source = "git::https://github.com/myorg/terraform-modules.git//modules/vpc?ref=v1.4.0"
}
\`\`\`

**Version constraint best practices:**
- Production: pin exact version (\`= 2.3.1\`) — no surprise upgrades
- Development: allow patch updates (\`~> 2.3\`) — get bug fixes
- Avoid \`>= 2.0\` — too broad, includes breaking changes

## Module Design Principles

**1. Single responsibility**: A VPC module creates only VPC resources, not EKS clusters. Compose modules rather than building monoliths.

**2. Sensible defaults with overrides**: Default to secure/recommended settings; allow callers to override.

**3. No hardcoded values**: Everything that might vary should be a variable. Never hardcode region, account IDs, or environment names.

**4. Expose what callers need**: Output IDs and ARNs of all created resources. Callers should not have to reconstruct what your module made.

**5. Backward compatibility**: Adding new optional variables with defaults is backward-compatible. Removing variables or changing types is a breaking change — bump the major version.

## Testing Modules with Terratest

\`\`\`go
// test/vpc_test.go
package test

import (
  "testing"
  "github.com/gruntwork-io/terratest/modules/terraform"
  "github.com/stretchr/testify/assert"
)

func TestVpcModule(t *testing.T) {
  opts := &terraform.Options{
    TerraformDir: "../examples/simple",
    Vars: map[string]interface{}{
      "environment": "test",
      "vpc_cidr":    "10.99.0.0/16",
    },
  }

  defer terraform.Destroy(t, opts)  // clean up after test
  terraform.InitAndApply(t, opts)

  vpcId := terraform.Output(t, opts, "vpc_id")
  assert.NotEmpty(t, vpcId)

  subnetIds := terraform.OutputList(t, opts, "private_subnet_ids")
  assert.Equal(t, 2, len(subnetIds))  // default count
}
\`\`\`

Run: \`go test -v -timeout 30m ./test/\`

Terratest creates real AWS resources, tests them, and destroys them. Slow but catches real integration issues.`,
        },
        {
          id: "workspaces",
          title: "Terraform Workspaces & Environment Management",
          duration: 25,
          type: "lesson",
          description: "Use Terraform workspaces and directory-per-environment patterns to manage multiple environments.",
          objectives: [
            "Understand Terraform workspace mechanics and limitations",
            "Compare workspace-per-environment vs directory-per-environment",
            "Manage environment-specific variables and backend configs",
            "Implement environment promotion workflows",
          ],
          content: `# Terraform Workspaces & Environment Management

## What Are Workspaces?

Terraform workspaces let you maintain multiple state files from the same configuration directory:

\`\`\`bash
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod
terraform workspace list
# * dev
#   staging
#   prod

terraform workspace select prod
terraform plan   # uses prod state
\`\`\`

Each workspace gets its own state file in the backend:
\`\`\`
s3://my-tf-state/
  env:/
    dev/
      terraform.tfstate
    staging/
      terraform.tfstate
    prod/
      terraform.tfstate
\`\`\`

## Using Workspace in Configuration

\`\`\`hcl
locals {
  env = terraform.workspace  # "dev", "staging", "prod"

  config = {
    dev = {
      instance_type  = "t3.micro"
      min_capacity   = 1
      max_capacity   = 2
      multi_az       = false
    }
    staging = {
      instance_type  = "t3.small"
      min_capacity   = 2
      max_capacity   = 4
      multi_az       = false
    }
    prod = {
      instance_type  = "t3.medium"
      min_capacity   = 3
      max_capacity   = 10
      multi_az       = true
    }
  }
}

resource "aws_db_instance" "main" {
  instance_class    = local.config[local.env].instance_type
  multi_az          = local.config[local.env].multi_az
  identifier        = "\${local.env}-postgres"
}
\`\`\`

## Workspace Limitations

Workspaces share the same configuration code. This causes problems:

- Can't use different providers per environment (different AWS accounts)
- Hard to review — prod and dev configs are interleaved
- One typo in the workspace config affects all environments
- State lock for one workspace blocks all workspaces in some backends

**Workspaces work well for**: temporary feature environments, quick multi-region deployments with identical config, developer sandboxes.

**Workspaces are wrong for**: dev/staging/prod with different AWS accounts, significantly different architectures per environment.

## Directory-Per-Environment (Recommended for Production)

\`\`\`
infra/
  modules/
    vpc/
    eks/
    rds/
  environments/
    dev/
      main.tf        ← calls modules with dev config
      variables.tf
      backend.tf     ← dev S3 bucket, dev DynamoDB table
      terraform.tfvars
    staging/
      main.tf
      backend.tf     ← staging S3 bucket
      terraform.tfvars
    prod/
      main.tf
      backend.tf     ← prod S3 bucket, separate AWS account
      terraform.tfvars
\`\`\`

Each environment is independently planned and applied — production changes never touch development state.

### Environment-Specific Backends

\`\`\`hcl
# environments/prod/backend.tf
terraform {
  backend "s3" {
    bucket         = "mycompany-tf-state-prod"
    key            = "eks/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tf-locks-prod"
    encrypt        = true
    # Assume a role in the prod account
    role_arn       = "arn:aws:iam::PROD_ACCOUNT_ID:role/TerraformStateRole"
  }
}
\`\`\`

\`\`\`hcl
# environments/dev/backend.tf
terraform {
  backend "s3" {
    bucket         = "mycompany-tf-state-dev"
    key            = "eks/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tf-locks-dev"
    encrypt        = true
    role_arn       = "arn:aws:iam::DEV_ACCOUNT_ID:role/TerraformStateRole"
  }
}
\`\`\`

### terraform.tfvars Per Environment

\`\`\`hcl
# environments/dev/terraform.tfvars
environment          = "dev"
vpc_cidr             = "10.0.0.0/16"
eks_node_instance    = "t3.medium"
eks_min_nodes        = 2
eks_max_nodes        = 5
rds_instance_class   = "db.t3.medium"
rds_multi_az         = false
enable_waf           = false
\`\`\`

\`\`\`hcl
# environments/prod/terraform.tfvars
environment          = "prod"
vpc_cidr             = "10.10.0.0/16"
eks_node_instance    = "m5.xlarge"
eks_min_nodes        = 5
eks_max_nodes        = 50
rds_instance_class   = "db.r6g.xlarge"
rds_multi_az         = true
enable_waf           = true
\`\`\`

## Environment Promotion Workflow

The promotion process ensures what runs in staging is exactly what runs in production:

\`\`\`
1. Engineer develops in dev:
   cd environments/dev && terraform plan && terraform apply

2. PR raised — infrastructure code reviewed like application code

3. Merge to main triggers CI:
   - terraform plan for staging (posted as PR comment)
   - Human reviews plan
   - terraform apply to staging
   - Integration tests run against staging

4. Staging validated → promotion PR to prod:
   - Update prod/terraform.tfvars with new module version or config
   - terraform plan for prod reviewed by senior engineer + security
   - Manual approval gate (GitHub Environment protection rule)
   - terraform apply to prod
   - Canary monitoring for 30 minutes
\`\`\`

**Key rule**: Production applies must use the exact same module versions that passed staging. Pin module versions:

\`\`\`hcl
# staging/main.tf
module "eks" {
  source  = "../../modules/eks"
  version = "= 3.2.1"   # tested this version in staging
}

# prod/main.tf — same pin after staging passes
module "eks" {
  source  = "../../modules/eks"
  version = "= 3.2.1"   # promoted from staging
}
\`\`\`

## Passing Outputs Between Environments

When environments share infrastructure (e.g., prod EKS uses prod VPC):

\`\`\`hcl
# environments/prod/main.tf
data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    bucket = "mycompany-tf-state-prod"
    key    = "vpc/terraform.tfstate"
    region = "us-east-1"
  }
}

module "eks" {
  source             = "../../modules/eks"
  vpc_id             = data.terraform_remote_state.vpc.outputs.vpc_id
  private_subnet_ids = data.terraform_remote_state.vpc.outputs.private_subnet_ids
}
\`\`\`

This is better than hardcoding VPC IDs — any VPC change propagates automatically on next apply.`,
        },
      ],
      exam: [
        { question: "You have three teams sharing a single Terraform repository. Each team owns different AWS resources and needs to apply changes independently. How do you structure the repository?", answer: "Use a directory-per-team-per-environment layout: infra/teams/platform/environments/prod, infra/teams/data/environments/prod, infra/teams/app/environments/prod. Each directory has its own backend config pointing to a separate state file. Teams can plan and apply independently without state lock conflicts. Shared infrastructure (VPC, IAM base) goes in a shared/ root with remote_state outputs that other teams read. Use strict IAM: the data team's CI role can only access the data team's state bucket, preventing cross-team accidents.", difficulty: "senior" },
        { question: "A module you published at version 1.0.0 has a bug. You fix it in 1.0.1. Callers pinned to '~> 1.0' get the fix automatically, but callers pinned to '= 1.0.0' do not. How do you communicate this and what's the guidance?", answer: "For security or data-loss bugs: file a GitHub advisory, add a note to the module README that 1.0.0 has a known bug and 1.0.1 is required, reach out directly to known consumers. For non-critical bugs: standard release notes and changelog. Guidance: production callers should pin exact versions (= 1.0.0) for stability, but they must have a process to periodically review and bump module versions — a scheduled job that opens PRs with module version bumps works well. The advantage of exact pinning is that upgrades are explicit and reviewed; the cost is that security fixes require manual action.", difficulty: "senior" },
        { question: "When should you use Terraform workspaces vs separate directories for environments?", answer: "Workspaces: use for identical infrastructure in multiple regions, temporary developer sandboxes, or feature environments that mirror a base config exactly. They're convenient when the config is truly identical and all environments live in the same AWS account. Separate directories: use when environments differ in size, architecture, or AWS account. Production should almost always be in a separate directory — it may use different AWS accounts (separate state backends with role_arn), different instance types, different feature flags, and must be independently deployable without touching dev state. The rule: if you'd feel uncomfortable with the same 'terraform apply' touching both dev and prod, use separate directories.", difficulty: "mid" },
        { question: "How do you handle secrets (database passwords, API keys) in Terraform without storing them in state plaintext?", answer: "Several approaches: (1) AWS Secrets Manager or Parameter Store: use a data source to reference the secret by name — Terraform reads the value at plan time but only stores the reference in state, not the value. Sensitive variables still appear in state for resources that accept them directly. (2) Mark variables as sensitive: 'variable \"db_password\" { sensitive = true }' — Terraform redacts the value from plan output and logs. (3) Don't create secrets in Terraform: create the secret resource without a value, then set the value via AWS CLI or a separate secrets management tool (Vault, External Secrets Operator). (4) Encrypt state: always use S3 with SSE-KMS for state backend — even if a password leaks into state, it's encrypted at rest and access is logged.", difficulty: "mid" },
      ],
    },
    {
      id: "advanced-hcl",
      title: "Advanced HCL Patterns",
      level: "intermediate",
      description: "Master for_each, dynamic blocks, locals, data sources, and lifecycle meta-arguments.",
      lessons: [
        {
          id: "for-each-and-count",
          title: "for_each, count, and Dynamic Blocks",
          duration: 30,
          type: "lesson",
          description: "Write DRY Terraform with iteration, conditional resources, and dynamic configuration blocks.",
          objectives: [
            "Use for_each with maps and sets for stable resource management",
            "Understand when count is appropriate vs for_each",
            "Write dynamic blocks for variable-length configuration",
            "Use for expressions to transform data structures",
          ],
          content: `# for_each, count, and Dynamic Blocks

## count vs for_each

**count** creates N copies of a resource, indexed by integer:

\`\`\`hcl
resource "aws_instance" "web" {
  count         = 3
  instance_type = "t3.micro"
  ami           = data.aws_ami.ubuntu.id
  tags = { Name = "web-\${count.index}" }
}

# Reference: aws_instance.web[0], aws_instance.web[1], aws_instance.web[2]
\`\`\`

**Problem with count**: If you remove the middle item from a list, Terraform renumbers all subsequent instances — it destroys and recreates them:

\`\`\`hcl
# Was: ["web1", "web2", "web3"]
# Remove "web2": ["web1", "web3"]
# Terraform sees: index 1 changed from "web2" to "web3" → destroy+create
# This is dangerous for stateful resources
\`\`\`

**for_each** uses a map or set — each resource has a stable key:

\`\`\`hcl
resource "aws_instance" "web" {
  for_each      = toset(["web1", "web2", "web3"])
  instance_type = "t3.micro"
  ami           = data.aws_ami.ubuntu.id
  tags          = { Name = each.key }
}

# Reference: aws_instance.web["web1"], aws_instance.web["web2"]
# Removing "web2" only destroys aws_instance.web["web2"] — others untouched
\`\`\`

**for_each with a map** — pass rich configuration per resource:

\`\`\`hcl
locals {
  buckets = {
    assets = {
      acl         = "public-read"
      versioning  = false
      lifecycle_days = 90
    }
    backups = {
      acl         = "private"
      versioning  = true
      lifecycle_days = 365
    }
    logs = {
      acl         = "private"
      versioning  = false
      lifecycle_days = 30
    }
  }
}

resource "aws_s3_bucket" "this" {
  for_each = local.buckets
  bucket   = "\${var.environment}-\${each.key}"
  tags     = { Name = each.key, Environment = var.environment }
}

resource "aws_s3_bucket_versioning" "this" {
  for_each = { for k, v in local.buckets : k => v if v.versioning }
  bucket   = aws_s3_bucket.this[each.key].id

  versioning_configuration {
    status = "Enabled"
  }
}
\`\`\`

## for Expressions

Transform one data structure into another:

\`\`\`hcl
# List to set of uppercase strings
variable "environments" {
  default = ["dev", "staging", "prod"]
}

locals {
  env_upper = [for e in var.environments : upper(e)]
  # → ["DEV", "STAGING", "PROD"]

  # List to map
  env_map = { for e in var.environments : e => "\${e}.example.com" }
  # → { dev = "dev.example.com", staging = "staging.example.com", ... }

  # Filter with if
  prod_only = [for e in var.environments : e if e != "dev"]
  # → ["staging", "prod"]

  # Map to list of values
  subnet_ids = [for k, v in aws_subnet.this : v.id]
}
\`\`\`

**Invert a map** (swap keys and values):

\`\`\`hcl
variable "role_arns" {
  default = {
    admin   = "arn:aws:iam::123:role/admin"
    readonly = "arn:aws:iam::123:role/readonly"
  }
}

locals {
  arn_to_role = { for name, arn in var.role_arns : arn => name }
  # → { "arn:aws:iam::123:role/admin" = "admin", ... }
}
\`\`\`

## dynamic Blocks

Use \`dynamic\` when a resource has a variable number of nested blocks:

\`\`\`hcl
variable "ingress_rules" {
  default = [
    { port = 80,  cidr = "0.0.0.0/0",      description = "HTTP" },
    { port = 443, cidr = "0.0.0.0/0",      description = "HTTPS" },
    { port = 22,  cidr = "10.0.0.0/8",     description = "SSH internal" },
  ]
}

resource "aws_security_group" "web" {
  name   = "web-sg"
  vpc_id = var.vpc_id

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = [ingress.value.cidr]
      description = ingress.value.description
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
\`\`\`

**Dynamic blocks for optional nested blocks**:

\`\`\`hcl
variable "enable_encryption" {
  default = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  dynamic "rule" {
    for_each = var.enable_encryption ? [1] : []  # trick: 1-element list = enabled
    content {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}
\`\`\`

## locals — Simplify Complex Expressions

\`\`\`hcl
locals {
  # Compute once, use many times
  account_id = data.aws_caller_identity.current.account_id
  region     = data.aws_region.current.name

  # Conditional value
  log_retention = var.environment == "prod" ? 365 : 30

  # Build complex structures from inputs
  eks_tags = merge(
    var.common_tags,
    {
      "kubernetes.io/cluster/\${var.cluster_name}" = "owned"
    }
  )

  # Flatten nested structure
  all_subnet_ids = flatten([
    aws_subnet.private[*].id,
    aws_subnet.public[*].id,
  ])

  # Conditional resource set
  multi_az_subnets = var.multi_az ? var.availability_zones : [var.availability_zones[0]]
}
\`\`\`

## Data Sources

Data sources read existing infrastructure without managing it:

\`\`\`hcl
# Look up the latest Ubuntu AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical's AWS account

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-*-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Look up existing VPC by tag
data "aws_vpc" "main" {
  tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Look up all subnets in a VPC
data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.main.id]
  }
  tags = {
    Tier = "private"
  }
}

# Current AWS account and region
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# IAM policy document (safer than raw JSON strings)
data "aws_iam_policy_document" "s3_read" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject", "s3:ListBucket"]
    resources = [
      aws_s3_bucket.assets.arn,
      "\${aws_s3_bucket.assets.arn}/*",
    ]
  }
}

resource "aws_iam_policy" "s3_read" {
  name   = "s3-read-policy"
  policy = data.aws_iam_policy_document.s3_read.json
}
\`\`\`

## lifecycle Meta-Arguments

Control how Terraform handles resource changes:

\`\`\`hcl
resource "aws_instance" "app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  lifecycle {
    # Create new instance before destroying old one
    # Prevents downtime during AMI updates
    create_before_destroy = true

    # Prevent Terraform from destroying this resource
    # Useful for production databases
    prevent_destroy = true

    # Ignore changes to these attributes after creation
    # Prevents Terraform from fighting with auto-scaling
    ignore_changes = [
      ami,           # don't rebuild when AMI updates
      user_data,     # launched instances may have drifted user_data
    ]

    # Custom pre-condition: validate before applying
    precondition {
      condition     = var.instance_type != "t2.micro"
      error_message = "t2.micro is too small for production. Use t3.small or larger."
    }

    # Custom post-condition: validate after apply
    postcondition {
      condition     = self.public_ip != ""
      error_message = "Instance did not get a public IP as expected."
    }
  }
}
\`\`\`

## moved Block — Rename Resources Without Destroy

When you need to rename a resource or move it into a module:

\`\`\`hcl
# Old: aws_instance.web
# New: module.web_servers.aws_instance.web

moved {
  from = aws_instance.web
  to   = module.web_servers.aws_instance.web
}
\`\`\`

Terraform updates the state entry without destroying and recreating the resource. Once applied, remove the \`moved\` block.

**When to use**: Refactoring modules, renaming resources, moving from count to for_each:

\`\`\`hcl
# Moving from count to for_each (common refactor)
moved {
  from = aws_subnet.private[0]
  to   = aws_subnet.private["us-east-1a"]
}
moved {
  from = aws_subnet.private[1]
  to   = aws_subnet.private["us-east-1b"]
}
\`\`\``,
        },
        {
          id: "terraform-functions-patterns",
          title: "Terraform Functions & Real-World Patterns",
          duration: 25,
          type: "lesson",
          description: "Use Terraform's built-in functions and apply patterns for real production infrastructure.",
          objectives: [
            "Use string, collection, and encoding functions effectively",
            "Apply templatefile and jsonencode for configuration generation",
            "Implement common production patterns: tagging strategy, multi-region, conditional modules",
            "Debug Terraform with console and targeted applies",
          ],
          content: `# Terraform Functions & Real-World Patterns

## Essential Built-in Functions

### String Functions

\`\`\`hcl
locals {
  # format — construct strings
  bucket_name = format("%s-%s-%s", var.company, var.environment, var.region)
  # → "myco-prod-us-east-1"

  # replace — sanitize inputs
  safe_name = replace(var.name, "/[^a-z0-9-]/", "-")

  # split and join
  parts  = split(",", "a,b,c")  # → ["a", "b", "c"]
  joined = join("-", ["web", "app", "01"])  # → "web-app-01"

  # trim and strip
  clean = trimspace("  hello  ")  # → "hello"
  stripped = trimprefix("prod-eks", "prod-")  # → "eks"

  # substr
  short_id = substr(var.long_id, 0, 8)  # first 8 characters
}
\`\`\`

### Collection Functions

\`\`\`hcl
locals {
  # concat — combine lists
  all_subnets = concat(var.private_subnets, var.public_subnets)

  # flatten — remove nesting
  flat_ids = flatten([["a", "b"], ["c", "d"]])  # → ["a", "b", "c", "d"]

  # distinct — remove duplicates
  unique_azs = distinct(["us-east-1a", "us-east-1a", "us-east-1b"])

  # merge — combine maps (later maps win on collision)
  tags = merge(var.default_tags, var.resource_tags, { ManagedBy = "terraform" })

  # contains — check membership
  is_prod = contains(["prod", "production"], var.environment)

  # lookup — safe map access with default
  instance_type = lookup(local.instance_types, var.environment, "t3.micro")

  # keys and values
  env_names = keys(var.environments)
  env_cidrs = values(var.environment_cidrs)

  # zipmap — build map from two lists
  env_map = zipmap(
    ["dev", "staging", "prod"],
    ["10.0.0.0/16", "10.1.0.0/16", "10.2.0.0/16"]
  )
}
\`\`\`

### Encoding Functions

\`\`\`hcl
# jsonencode — convert HCL to JSON string
resource "aws_iam_role_policy" "inline" {
  role = aws_iam_role.lambda.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = "\${aws_s3_bucket.data.arn}/*"
      }
    ]
  })
}

# yamlencode — HCL to YAML string
locals {
  k8s_config = yamlencode({
    apiVersion = "v1"
    kind       = "ConfigMap"
    metadata = { name = "app-config" }
    data = {
      DB_HOST = aws_db_instance.main.address
      DB_PORT = tostring(aws_db_instance.main.port)
    }
  })
}

# base64encode — for binary/sensitive data
resource "aws_instance" "app" {
  user_data = base64encode(templatefile("scripts/init.sh.tpl", {
    db_host = aws_db_instance.main.address
  }))
}
\`\`\`

### templatefile Function

Generate configuration files from templates:

\`\`\`hcl
# scripts/init.sh.tpl
#!/bin/bash
apt-get update
apt-get install -y nginx

cat > /etc/nginx/conf.d/app.conf <<EOF
upstream backend {
%{ for addr in backend_addresses ~}
  server \${addr}:8080;
%{ endfor ~}
}
server {
  listen 80;
  location / {
    proxy_pass http://backend;
  }
}
EOF

systemctl restart nginx
echo "DB_HOST=\${db_host}" >> /etc/environment
echo "ENVIRONMENT=\${environment}" >> /etc/environment

# terraform code
resource "aws_instance" "nginx" {
  user_data = base64encode(templatefile("\${path.module}/scripts/init.sh.tpl", {
    backend_addresses = aws_instance.app[*].private_ip
    db_host           = aws_db_instance.main.address
    environment       = var.environment
  }))
}
\`\`\`

## Production Tagging Strategy

Consistent tagging is critical for cost allocation and automation:

\`\`\`hcl
# modules/tagging/main.tf
locals {
  # Mandatory tags — all resources must have these
  required_tags = {
    Environment    = var.environment           # prod, staging, dev
    Application    = var.application           # "payment-service"
    Team           = var.team                  # "platform"
    CostCenter     = var.cost_center           # "engineering-platform"
    ManagedBy      = "terraform"
    TerraformRepo  = var.repo_url              # "github.com/myorg/infra"
    DataClass      = var.data_classification   # "public", "internal", "confidential"
  }

  # Merge with optional extra tags
  all_tags = merge(local.required_tags, var.additional_tags)
}

output "tags" {
  value = local.all_tags
}

# In every resource across all modules
resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
  tags   = module.tagging.tags  # or: merge(module.tagging.tags, { specific = "value" })
}
\`\`\`

**AWS default tags on the provider** — tag every resource automatically:

\`\`\`hcl
provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      ManagedBy   = "terraform"
      TerraformRepo = "github.com/myorg/infra"
      Environment = var.environment
    }
  }
}
\`\`\`

## Conditional Module Instantiation

\`\`\`hcl
# Only create WAF in production
module "waf" {
  count  = var.environment == "prod" ? 1 : 0
  source = "../../modules/waf"
  alb_arn = aws_lb.main.arn
}

# Only create read replica in prod/staging
module "db_replica" {
  count              = contains(["prod", "staging"], var.environment) ? 1 : 0
  source             = "../../modules/rds-replica"
  primary_identifier = aws_db_instance.main.identifier
}

# Enable monitoring only in prod
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  count               = var.environment == "prod" ? 1 : 0
  alarm_name          = "cpu-high-\${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  threshold           = 80
  # ...
}
\`\`\`

## Debugging Terraform

**terraform console** — interactive expression evaluation:

\`\`\`bash
$ terraform console

# Test expressions before putting them in code
> cidrsubnet("10.0.0.0/16", 8, 3)
"10.0.3.0/24"

> formatdate("YYYY-MM-DD", timestamp())
"2024-01-15"

> length(var.availability_zones)
3

> { for k, v in var.tags : k => upper(v) }
{ "env" = "PROD", "team" = "PLATFORM" }

# Exit with Ctrl+D
\`\`\`

**Targeted apply** — apply only specific resources during debugging:

\`\`\`bash
# Apply only one resource (useful when fixing a broken resource)
terraform apply -target=aws_instance.web["web1"]

# Apply only a module
terraform apply -target=module.vpc

# Plan a specific resource
terraform plan -target=aws_security_group.web
\`\`\`

**Caution**: Targeted applies can leave state inconsistent. Use only for debugging; always follow with a full plan to verify state is correct.

**terraform state commands** — inspect and repair state:

\`\`\`bash
# List all resources in state
terraform state list

# Show a specific resource's state
terraform state show aws_instance.web["web1"]

# Remove a resource from state (without destroying it)
# Use when a resource was deleted manually and you want Terraform to forget it
terraform state rm aws_instance.abandoned

# Import existing resource into state
# Use when a resource was created manually and you want Terraform to manage it
terraform import aws_instance.web i-0abcd1234567890

# Move resource in state (same as moved block but CLI-only)
terraform state mv aws_instance.old aws_instance.new
\`\`\``,
        },
      ],
      exam: [
        { question: "You have 20 S3 buckets defined with 'count'. You need to remove the bucket at index 5. What happens and how do you prevent it?", answer: "With count, removing index 5 causes Terraform to renumber all subsequent resources: index 6 becomes 5, 7 becomes 6, etc. Terraform destroys and recreates every resource from index 5 onward — potentially 15 bucket deletions and recreations, which destroys data. Prevention: migrate from count to for_each with a set of bucket names. Each bucket gets a stable string key instead of an integer index. Removing one key only affects that specific bucket. Migration requires 'moved' blocks to rename state entries without destroying: 'moved { from = aws_s3_bucket.this[5] to = aws_s3_bucket.this[\"logs\"] }'", difficulty: "senior" },
        { question: "Write a for expression that takes a map of {service_name: port_number} and produces a list of security group ingress rule objects with from_port and to_port set to the port.", answer: "local { ingress_rules = [ for name, port in var.services : { description = name, from_port = port, to_port = port, protocol = \"tcp\", cidr_blocks = [\"10.0.0.0/8\"] } ] }. Then use a dynamic ingress block that iterates over local.ingress_rules. The for expression transforms the map into a list of objects that the dynamic block can consume.", difficulty: "mid" },
        { question: "A Terraform plan shows a resource being destroyed and recreated due to a name change. The resource is a production database. How do you rename it without causing downtime?", answer: "Use a 'moved' block: 'moved { from = aws_db_instance.old_name to = aws_db_instance.new_name }'. Add this block to your configuration and run terraform plan — it should show zero destroy/create operations, only a state rename. Apply the plan. The physical database is not modified; only the state file is updated. After the apply succeeds, remove the moved block in a follow-up commit. If the resource is inside a module, the moved block can reference module addresses: 'from = module.old.aws_db_instance.main to = module.new.aws_db_instance.main'.", difficulty: "senior" },
        { question: "What is the difference between 'lifecycle { ignore_changes = [ami] }' and importing the resource with 'terraform import'? When would you use each?", answer: "ignore_changes tells Terraform to never update a specific attribute after initial creation — even if the HCL value changes, Terraform won't plan a change to that attribute. Use it for attributes managed by external systems (ASG replaces AMI, Kubernetes modifies annotations). terraform import pulls an existing real-world resource into Terraform state so Terraform can manage it going forward — it reads the current resource state and records it. Use import when you created a resource manually or outside Terraform and want to bring it under Terraform management. They solve different problems: ignore_changes suppresses unwanted updates; import adopts unmanaged resources.", difficulty: "mid" },
      ],
    },
  ],
};
