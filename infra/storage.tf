resource "aws_s3_bucket" "uploads" {
  bucket        = "${var.app_name}-uploads-storage"
  force_destroy = false

  tags = {
    Name        = "${var.app_name}-uploads"
    Environment = "production"
  }
}

resource "aws_s3_bucket_public_access_block" "uploads_privacy" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
