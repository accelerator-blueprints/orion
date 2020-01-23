aws_region = "eu-west-1"
project_name = "orion"
vpc_az_count = 2
route53_zone = "nearform.com."
cf_wildcard_domain_name = "*.nearform.com"
cf_domain_name = "orion.nearform.com"
cf_app_domain_name = "orion.nearform.com"
cf_uploaded_assets_domain_name = "orion-assets.nearform.com"
cf_storybook_domain_name = "orion-storybook.nearform.com"
cf_not_found_path = "/404.html"
ci_user_name = "orion-ci-user"
rds_identifier = "orion"
rds_db_name = "orion"
rds_password = "REDACTED"
hasura_domain_name = "orion-hasura.nearform.com"
hasura_port = 8080
HASURA_GRAPHQL_ENABLE_CONSOLE = "false"
HASURA_GRAPHQL_ADMIN_SECRET = "REDACTED"
HASURA_GRAPHQL_UNAUTHORIZED_ROLE = "public"
http_basic_auth_username = "nearform"
http_basic_auth_password = "REDACTED"
org="orion"
gatsby_graphql_api="https://orion-hasura.nearform.com/v1/graphql" #Most of these are output after terraform refresh..
gatsby_aws_region="eu-west-1"
gatsby_aws_cognito_identity_pool_id="REDACTED"
gatsby_aws_cognito_user_pool_id="REDACTED"
gatsby_aws_cognito_user_pool_web_client_id="REDACTED"
gatsby_aws_s3_bucket="orion-assets.nearform.com"
s3_deploy_artifacts = "orion-deploy-artifacts"
enrichment_artifact = "jwt-enrichment-hook-1.0.0-000.zip"
signup_artifact = "signup-hook-1.0.0-000.zip"
hasura_artifact = "hasura-1.0.0-000.zip"
alarms_enabled = true
alarms_slack_notification_webhook = "https://slack-notification-webhook-url"
default_tags = {}
