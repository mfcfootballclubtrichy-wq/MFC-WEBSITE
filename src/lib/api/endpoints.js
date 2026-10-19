/**
 * @fileoverview Typed endpoint functions matching FastAPI route specifications.
 */
import { apiClient } from './client.js';

/**
 * Checks system health and connectivity to the FastAPI backend.
 * @returns {Promise<{ status: string; version: string; environment: string; club: string }>}
 */
export async function getHealth() {
  return apiClient('/api/v1/health');
}

/**
 * Placeholder for future phase public endpoints (Phases 3-7).
 * Currently gracefully hand off to bundled content or future endpoints.
 */
export async function getPublishedContent(section) {
  return apiClient(`/api/v1/content/${encodeURIComponent(section)}`);
}

export async function getCoaches() {
  return apiClient('/api/v1/coaches');
}

export async function getTeamAchievements() {
  return apiClient('/api/v1/achievements/team');
}

export async function getIndividualAchievements() {
  return apiClient('/api/v1/achievements/individual');
}
