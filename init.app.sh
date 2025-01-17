#!/bin/bash
source .env
echo "Starting to initiating application..."
docker compose up -d --build keycloak keycloak_db frontend
echo "Waiting for Keycloak..."

sleep 15

url=${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}

response=$(curl -s "${url}")

PUBLIC_KEY=$(echo "${response}" | jq -r '.public_key')

json_structure=$(jq -n '
{
  "resource": "'${KEYCLOAK_API_CLIENT_ID}'",
  "realm": "'${KEYCLOAK_REALM}'",
  "auth-server-url": "'${KEYCLOAK_SERVER_URL}'",
  "enabled": true,
  "credentials": {
    "secret" : "'${KEYCLOAK_SECRET}'"
  },
  "bearerOnly": true,
  "realmPublicKey": "'${PUBLIC_KEY}'"
}
')

echo "${json_structure}" > ./api/keycloak.json
chmod 644 ./api/keycloak.json
echo Keycloak configuration:
cat ./api/keycloak.json

echo "Start api service..."
docker compose up -d --build api
