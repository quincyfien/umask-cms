resource "aws_ssm_parameter" "db_url" {
  name        = "/${var.app_name}/production/DATABASE_URL"
  description = "Production Database URL"
  type        = "SecureString"
  value       = "postgresql://devuser:devpassword@localhost:5432/devdb?schema=public"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "nextauth_secret" {
  name        = "/${var.app_name}/production/NEXTAUTH_SECRET"
  description = "NextAuth Application Secret"
  type        = "SecureString"
  value       = "change-me-in-production-secret-key"

  lifecycle {
    ignore_changes = [value]
  }
}
