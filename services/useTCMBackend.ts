import { useState } from 'react';

/**
 * React Native Hook for Lumina TCM Master Brain (Antigravity Agent)
 * Connects to the Cloud Run FastAPI backend.
 */

interface TCMAnalysisResponse {
  status: string;
  analysis: string;
}

interface AnalysisParams {
  userId: string;
  voiceJournal: string;
  facialBiomarkers: string[];
  imageBase64?: string;
}

export const useTCMBackend = (backendUrl: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeHealth = async (params: AnalysisParams): Promise<TCMAnalysisResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: params.userId,
          voice_journal: params.voiceJournal,
          facial_biomarkers: params.facialBiomarkers,
          image_base64: params.imageBase64,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (messageId: string, rating: number) => {
    try {
      await fetch(`${backendUrl}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_id: messageId,
          rating: rating,
        }),
      });
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  return {
    analyzeHealth,
    submitFeedback,
    loading,
    error,
  };
};
