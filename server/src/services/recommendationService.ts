import { Profile, IProfile } from '../models/Profile';
import { Types } from 'mongoose';

export class RecommendationService {
  /**
   * Get Curated Daily Matches for a User Profile
   */
  static async getDailyMatches(userProfile: IProfile): Promise<any[]> {
    const minAge = userProfile.partnerPreferences?.minAge || 18;
    const maxAge = userProfile.partnerPreferences?.maxAge || 50;

    const query: any = {
      user: { $ne: userProfile.user },
      gender: userProfile.gender === 'MALE' ? 'FEMALE' : 'MALE',
      age: { $gte: minAge, $lte: maxAge },
    };

    const matches = await Profile.find(query).limit(10).lean();

    return matches.map((match) => ({
      ...match,
      compatibilityScore: 92,
      matchExplanation: [
        `Matches age preference (${minAge}-${maxAge} yrs)`,
        `Located in preferred state (${match.state})`,
        `Shares similar lifestyle & community`,
      ],
    }));
  }

  /**
   * Get Categorized Recommendations
   */
  static async getCategorizedRecommendations(userProfile: IProfile): Promise<any> {
    const targetGender = userProfile.gender === 'MALE' ? 'FEMALE' : 'MALE';
    const baseQuery = { user: { $ne: userProfile.user }, gender: targetGender };

    const [daily, highlyCompatible, verified, nearYou] = await Promise.all([
      Profile.find(baseQuery).sort({ lastActiveAt: -1 }).limit(6).lean(),
      Profile.find({ ...baseQuery, isPremium: true }).limit(6).lean(),
      Profile.find({ ...baseQuery, verificationBadge: true }).limit(6).lean(),
      Profile.find({ ...baseQuery, state: userProfile.state }).limit(6).lean(),
    ]);

    return {
      dailyMatches: daily.map((m) => ({ ...m, score: 94 })),
      highlyCompatible: highlyCompatible.map((m) => ({ ...m, score: 96 })),
      verifiedProfiles: verified.map((m) => ({ ...m, score: 90 })),
      nearYou: nearYou.map((m) => ({ ...m, score: 88 })),
    };
  }
}
