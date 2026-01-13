provider "aws" {
  region = var.aws_region
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  version         = "~> 19.0"
  cluster_name    = "lyvon-eks"
  cluster_version = "1.29"
  subnet_ids      = module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "lyvon-redis"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 3
  parameter_group_name = "default.redis7"
}

resource "aws_sqs_queue" "order_queue" {
  name = "lyvon-order-queue.fifo"
  fifo_queue = true
}