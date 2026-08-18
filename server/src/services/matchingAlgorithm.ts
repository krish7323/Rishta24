import { IProfile } from '../models/Profile';

export interface CompatibilityBreakdown {
  overallScore: number;
  ageScore: number;
  religionScore: number;
  locationScore: number;
  educationScore: number;
  lifestyleScore: number;
  interestsScore: number;
  completenessBonus: number;
  matchedCriteria: string[];
}

export const calculateCompatibilityScore = (
  userProfile: IProfile,
  candidateProfile: IProfile
): CompatibilityBreakdown => {
  let totalScore = 0;
  const matchedCriteria: string[] = [];

  // 1. Age Compatibility (Weight: 15%)
  let ageScore = 5;
  const pref = userProfile.partnerPreferences;
  if (pref && pref.minAge && pref.maxAge) {
    if (candidateProfile.age >= pref.minAge && candidateProfile.age <= pref.maxAge) {
      ageScore = 15;
      matchedCriteria.push('Age within preferred range');
    } else {
      const diff = Math.min(
        Math.abs(candidateProfile.age - pref.minAge),
        Math.abs(candidateProfile.age - pref.maxAge)
      );
      ageScore = Math.max(0, 15 - diff * 3);
    }
  } else {
    // Default reasonable age difference
    const diff = Math.abs(userProfile.age - candidateProfile.age);
    ageScore = Math.max(5, 15 - diff * 2);
  }
  totalScore += ageScore;

  // 2. Religion & Community (Weight: 20%)
  let religionScore = 0;
  if (userProfile.religion === candidateProfile.religion) {
    religionScore += 10;
    matchedCriteria.push(`Same Religion (${userProfile.religion})`);
  }
  if (userProfile.community === candidateProfile.community) {
    religionScore += 6;
    matchedCriteria.push(`Same Community (${userProfile.community})`);
  }
  if (userProfile.motherTongue === candidateProfile.motherTongue) {
    religionScore += 4;
    matchedCriteria.push(`Same Mother Tongue (${userProfile.motherTongue})`);
  }
  totalScore += religionScore;

  // 3. Location (Weight: 15%)
  let locationScore = 0;
  if (userProfile.city.toLowerCase() === candidateProfile.city.toLowerCase()) {
    locationScore = 15;
    matchedCriteria.push(`Same City (${userProfile.city})`);
  } else if (userProfile.state.toLowerCase() === candidateProfile.state.toLowerCase()) {
    locationScore = 10;
    matchedCriteria.push(`Same State (${userProfile.state})`);
  } else if (userProfile.country.toLowerCase() === candidateProfile.country.toLowerCase()) {
    locationScore = 5;
  }
  totalScore += locationScore;

  // 4. Education & Career (Weight: 15%)
  let educationScore = 5;
  if (userProfile.educationLevel === candidateProfile.educationLevel) {
    educationScore += 5;
    matchedCriteria.push('Similar Education Level');
  }
  if (userProfile.occupation === candidateProfile.occupation) {
    educationScore += 5;
    matchedCriteria.push('Similar Professional Field');
  }
  totalScore += educationScore;

  // 5. Lifestyle & Diet (Weight: 15%)
  let lifestyleScore = 0;
  if (userProfile.diet === candidateProfile.diet) {
    lifestyleScore += 7;
    matchedCriteria.push(`Matching Diet (${userProfile.diet.toLowerCase()})`);
  }
  if (userProfile.smoking === candidateProfile.smoking) {
    lifestyleScore += 4;
  }
  if (userProfile.drinking === candidateProfile.drinking) {
    lifestyleScore += 4;
  }
  totalScore += lifestyleScore;

  // 6. Hobbies & Shared Interests (Weight: 10%)
  let interestsScore = 2;
  if (userProfile.interests && candidateProfile.interests) {
    const userInterests = new Set(userProfile.interests.map((i) => i.toLowerCase()));
    const shared = candidateProfile.interests.filter((i) => userInterests.has(i.toLowerCase()));
    if (shared.length > 0) {
      interestsScore = Math.min(10, 3 + shared.length * 2.5);
      matchedCriteria.push(`${shared.length} Shared Interests: ${shared.slice(0, 2).join(', ')}`);
    }
  }
  totalScore += interestsScore;

  // 7. Profile Completeness & Verification Bonus (Weight: 10%)
  let completenessBonus = 0;
  if (candidateProfile.verificationBadge) {
    completenessBonus += 5;
    matchedCriteria.push('Verified Profile');
  }
  if (candidateProfile.profileCompletion >= 80) {
    completenessBonus += 5;
  }
  totalScore += completenessBonus;

  // Normalize final score between 60% and 98% for realistic matrimonial UI delight
  const finalScore = Math.min(98, Math.max(60, Math.round(totalScore)));

  return {
    overallScore: finalScore,
    ageScore,
    religionScore,
    locationScore,
    educationScore,
    lifestyleScore,
    interestsScore,
    completenessBonus,
    matchedCriteria,
  };
};
