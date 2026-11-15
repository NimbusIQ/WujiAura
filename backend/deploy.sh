#!/bin/bash

# Lumina TCM Lab - Cloud Run Deployment Script
# Usage: ./deploy.sh [PROJECT_ID] [LOCATION]

PROJECT_ID=${1:-"your-gcp-project-id"}
LOCATION=${2:-"us-central1"}
SERVICE_NAME="antigravity-tcm-agent"

echo "🚀 Starting deployment for $SERVICE_NAME in $PROJECT_ID..."

# 1. Enable Required APIs
gcloud services enable run.googleapis.com \
                       aiplatform.googleapis.com \
                       artifactregistry.googleapis.com --project=$PROJECT_ID

# 2. Build and Push Docker Image
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME --project=$PROJECT_ID

# 3. Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $LOCATION \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=$LOCATION \
  --project=$PROJECT_ID

echo "✅ Deployment complete!"
echo "🔗 Your API is live at: $(gcloud run services describe $SERVICE_NAME --platform managed --region $LOCATION --format 'value(status.url)' --project=$PROJECT_ID)"

echo "--------------------------------------------------"
echo "🛠️ NEXT STEPS: Configure Vertex AI Vector Search"
echo "1. Go to Vertex AI > Vector Search in GCP Console."
echo "2. Create an Index using your NotebookLM exported documents."
echo "3. Deploy the Index to an Endpoint."
echo "4. Update the Cloud Run environment variable VDB_INDEX_ENDPOINT with the endpoint name."
echo "--------------------------------------------------"
