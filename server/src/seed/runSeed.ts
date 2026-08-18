import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Subscription } from '../models/Subscription';
import { Match } from '../models/Match';
import { Interest } from '../models/Interest';
import { Visitor } from '../models/Visitor';
import { Shortlist } from '../models/Shortlist';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { Notification } from '../models/Notification';
import { Verification } from '../models/Verification';
import { Report } from '../models/Report';
import { SupportTicket } from '../models/SupportTicket';
import { SEED_PROFILES } from './seedData';
import { USER_ROLES, ACCOUNT_STATUS, VERIFICATION_STATUS, SUBSCRIPTION_PLANS } from '../config/constants';
import { logger } from '../utils/logger';

export async function seed(exitOnComplete = true) {
  try {
    await connectDatabase();
    logger.info('Starting RISHTA24 Database Seeding...');

    // Clear existing test data
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Subscription.deleteMany({}),
      Match.deleteMany({}),
      Interest.deleteMany({}),
      Visitor.deleteMany({}),
      Shortlist.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Verification.deleteMany({}),
      Report.deleteMany({}),
      SupportTicket.deleteMany({}),
    ]);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);
    const adminPasswordHash = await bcrypt.hash('AdminPass123!', salt);

    // 1. Create Super Admin User
    const adminUser = await User.create({
      email: 'admin@rishta24.test',
      phone: '+919999900000',
      passwordHash: adminPasswordHash,
      role: USER_ROLES.SUPER_ADMIN,
      status: ACCOUNT_STATUS.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
      referralCode: 'R24-ADMIN',
    });

    logger.info(`Super Admin created: admin@rishta24.test / AdminPass123!`);

    // 2. Create Demo User
    const demoUser = await User.create({
      email: 'demo@rishta24.test',
      phone: '+919876543210',
      passwordHash,
      role: USER_ROLES.USER,
      status: ACCOUNT_STATUS.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
      referralCode: 'R24-DEMO01',
    });

    const demoProfile = await Profile.create({
      user: demoUser._id,
      firstName: 'Kabir',
      lastName: 'Kapoor',
      gender: 'MALE',
      dateOfBirth: new Date('1997-05-14'),
      age: 28,
      height: 179,
      motherTongue: 'Hindi',
      maritalStatus: 'NEVER_MARRIED',
      religion: 'Hindu',
      community: 'Punjabi',
      caste: 'Khatri',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      educationLevel: 'Masters',
      degree: 'M.S. in Computer Science',
      occupation: 'Tech Lead / Software Architect',
      employer: 'Global Fintech Unicorn',
      annualIncome: 36,
      incomeRange: '₹35 - 50 Lakhs',
      diet: 'VEGETARIAN',
      smoking: 'NO',
      drinking: 'OCCASIONALLY',
      about: 'Passionate software architect who loves traveling the Himalayas, coffee roasting, and indie cinema. Deeply respectful of family traditions while championing modern open-mindedness.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
          isPrimary: true,
          privacy: 'PUBLIC',
          isApproved: true,
          uploadedAt: new Date(),
        },
        {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
          isPrimary: false,
          privacy: 'PUBLIC',
          isApproved: true,
          uploadedAt: new Date(),
        },
      ],
      familyType: 'NUCLEAR',
      fatherOccupation: 'Executive Director, PSU (Retd.)',
      motherOccupation: 'Educator & High School Principal',
      familyValues: 'MODERATE',
      familyLocation: 'Mumbai & Delhi',
      hobbies: ['Photography', 'Guitar', 'Trail Running', 'Specialty Coffee'],
      interests: ['Artificial Intelligence', 'Philosophy', 'Travel', 'Art'],
      partnerPreferences: {
        minAge: 23,
        maxAge: 29,
        minHeight: 155,
        maxHeight: 178,
        maritalStatus: ['NEVER_MARRIED'],
        religions: ['Hindu'],
        communities: [],
        motherTongues: ['Hindi', 'Punjabi', 'Marathi', 'English'],
        educations: ['Bachelors', 'Masters', 'Doctorate'],
        occupations: [],
        minIncome: 15,
        diets: ['VEGETARIAN', 'EGGETARIAN'],
        states: ['Maharashtra', 'Delhi', 'Karnataka'],
        countries: ['India'],
      },
      verificationStatus: VERIFICATION_STATUS.VERIFIED,
      verificationBadge: true,
      isPremium: true,
      premiumPlanId: 'PREMIUM_QUARTERLY',
      premiumExpiresAt: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
      isBoosted: true,
    });

    demoProfile.profileCompletion = demoProfile.calculateCompletion();
    await demoProfile.save();

    // Create Subscription for Demo User
    await Subscription.create({
      user: demoUser._id,
      planId: 'PREMIUM_QUARTERLY',
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
      features: SUBSCRIPTION_PLANS.PREMIUM_QUARTERLY,
    });

    logger.info(`Demo User created: demo@rishta24.test / Password123!`);

    // 3. Create Seed Profiles
    const createdUsers = [];
    const createdProfiles = [];

    for (const seedData of SEED_PROFILES) {
      const user = await User.create({
        email: seedData.email,
        phone: seedData.phone,
        passwordHash,
        role: USER_ROLES.USER,
        status: ACCOUNT_STATUS.ACTIVE,
        isEmailVerified: true,
        isPhoneVerified: true,
        referralCode: `R24-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });

      const profile = await Profile.create({
        user: user._id,
        firstName: seedData.firstName,
        lastName: seedData.lastName,
        gender: seedData.gender,
        dateOfBirth: new Date(seedData.dob),
        age: seedData.age,
        height: seedData.height,
        motherTongue: seedData.motherTongue,
        maritalStatus: 'NEVER_MARRIED',
        religion: seedData.religion,
        community: seedData.community,
        caste: seedData.caste,
        city: seedData.city,
        state: seedData.state,
        country: 'India',
        educationLevel: seedData.educationLevel,
        degree: seedData.degree,
        occupation: seedData.occupation,
        annualIncome: seedData.annualIncome,
        incomeRange: seedData.incomeRange,
        diet: seedData.diet,
        about: seedData.about,
        avatar: seedData.avatar,
        photos: seedData.photos.map((url, idx) => ({
          url,
          isPrimary: idx === 0,
          privacy: 'PUBLIC',
          isApproved: true,
          uploadedAt: new Date(),
        })),
        familyType: seedData.familyType,
        fatherOccupation: seedData.fatherOccupation,
        motherOccupation: seedData.motherOccupation,
        hobbies: seedData.hobbies,
        interests: seedData.interests,
        partnerPreferences: {
          minAge: seedData.age - 3,
          maxAge: seedData.age + 5,
          minHeight: 150,
          maxHeight: 190,
          maritalStatus: ['NEVER_MARRIED'],
          religions: [seedData.religion],
          communities: [seedData.community],
          motherTongues: [seedData.motherTongue],
          educations: [],
          occupations: [],
          minIncome: 10,
          diets: [],
          states: [seedData.state],
          countries: ['India'],
        },
        verificationStatus: seedData.isVerified ? VERIFICATION_STATUS.VERIFIED : VERIFICATION_STATUS.PENDING,
        verificationBadge: seedData.isVerified,
        isPremium: seedData.isPremium,
        premiumPlanId: seedData.isPremium ? 'PREMIUM_MONTHLY' : 'FREE',
        premiumExpiresAt: seedData.isPremium ? new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) : undefined,
        viewCount: Math.floor(15 + Math.random() * 80),
        shortlistCount: Math.floor(5 + Math.random() * 30),
      });

      profile.profileCompletion = profile.calculateCompletion();
      await profile.save();

      // Create subscription
      await Subscription.create({
        user: user._id,
        planId: seedData.isPremium ? 'PREMIUM_MONTHLY' : 'FREE',
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        features: seedData.isPremium ? SUBSCRIPTION_PLANS.PREMIUM_MONTHLY : SUBSCRIPTION_PLANS.FREE,
      });

      createdUsers.push(user);
      createdProfiles.push(profile);
    }

    logger.info(`Created ${createdUsers.length} seed profiles.`);

    // 4. Create Matches & Conversations for Demo User
    const femaleUsers = createdUsers.filter((u, i) => SEED_PROFILES[i].gender === 'FEMALE');

    if (femaleUsers.length >= 2) {
      // Mutual Match 1: Ananya Sharma
      const ananya = femaleUsers[0];
      await Match.create({
        user1: demoUser._id,
        user2: ananya._id,
        matchScore: 94,
        status: 'ACTIVE',
        matchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });

      const conv1 = await Conversation.create({
        participants: [demoUser._id, ananya._id],
        lastMessage: 'Looking forward to speaking with your family this weekend! 😊',
        lastMessageType: 'TEXT',
        lastMessageSender: ananya._id,
        lastMessageAt: new Date(),
      });

      await Message.create([
        {
          conversationId: conv1._id,
          sender: demoUser._id,
          receiver: ananya._id,
          messageType: 'TEXT',
          text: 'Hi Ananya! Great to connect with you. I saw that you also enjoy hiking in Sahyadris!',
          status: 'READ',
          createdAt: new Date(Date.now() - 3600000 * 5),
        },
        {
          conversationId: conv1._id,
          sender: ananya._id,
          receiver: demoUser._id,
          messageType: 'TEXT',
          text: 'Hello Kabir! Yes, absolutely! We go to Rajmachi almost every monsoon. How about you?',
          status: 'READ',
          createdAt: new Date(Date.now() - 3600000 * 4),
        },
        {
          conversationId: conv1._id,
          sender: demoUser._id,
          receiver: ananya._id,
          messageType: 'TEXT',
          text: 'Same here! It would be wonderful to chat more. Are our parents connected as well?',
          status: 'READ',
          createdAt: new Date(Date.now() - 3600000 * 2),
        },
        {
          conversationId: conv1._id,
          sender: ananya._id,
          receiver: demoUser._id,
          messageType: 'TEXT',
          text: 'Looking forward to speaking with your family this weekend! 😊',
          status: 'READ',
          createdAt: new Date(Date.now() - 3600000 * 1),
        },
      ]);

      // Mutual Match 2: Priya Nair
      const priya = femaleUsers[1];
      await Match.create({
        user1: demoUser._id,
        user2: priya._id,
        matchScore: 89,
        status: 'ACTIVE',
        matchedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      });

      const conv2 = await Conversation.create({
        participants: [demoUser._id, priya._id],
        lastMessage: 'Namaste Kabir, thank you for accepting my interest!',
        lastMessageType: 'TEXT',
        lastMessageSender: priya._id,
        lastMessageAt: new Date(Date.now() - 3600000 * 12),
      });

      await Message.create({
        conversationId: conv2._id,
        sender: priya._id,
        receiver: demoUser._id,
        messageType: 'TEXT',
        text: 'Namaste Kabir, thank you for accepting my interest!',
        status: 'READ',
        createdAt: new Date(Date.now() - 3600000 * 12),
      });
    }

    // 5. Create Pending Received Interests for Demo User
    if (femaleUsers.length >= 4) {
      await Interest.create([
        {
          sender: femaleUsers[2]._id, // Meera Iyer
          receiver: demoUser._id,
          status: 'PENDING',
          message: 'Hello! I found your profile very aligned with my values and preferences.',
        },
        {
          sender: femaleUsers[3]._id, // Tanvi Patel
          receiver: demoUser._id,
          status: 'PENDING',
          message: 'Greetings! Our family loved your profile details.',
        },
      ]);
    }

    // 6. Create Visitors for Demo User
    for (let i = 0; i < Math.min(femaleUsers.length, 4); i++) {
      await Visitor.create({
        profileOwner: demoUser._id,
        viewer: femaleUsers[i]._id,
        viewCount: i + 1,
        lastViewedAt: new Date(Date.now() - (i + 1) * 3600000 * 4),
      });
    }

    // 7. Create Shortlists
    if (femaleUsers.length > 0) {
      await Shortlist.create({
        user: demoUser._id,
        targetUser: femaleUsers[0]._id,
        notes: 'Very compatible family background and interests',
      });
    }

    // 8. Create In-App Notifications
    await Notification.create([
      {
        recipient: demoUser._id,
        sender: femaleUsers[0]._id,
        type: 'NEW_MATCH',
        title: "It's a Match! ❤️",
        body: 'You and Ananya Sharma matched with a 94% compatibility score!',
        isRead: false,
      },
      {
        recipient: demoUser._id,
        sender: femaleUsers[2]._id,
        type: 'INTEREST_RECEIVED',
        title: 'New Interest Received 💕',
        body: 'Meera Iyer sent you an interest request.',
        isRead: false,
      },
      {
        recipient: demoUser._id,
        type: 'VERIFICATION_APPROVED',
        title: 'Profile Verified! 🛡️',
        body: 'Congratulations! Your identity documents have been approved by the safety team.',
        isRead: true,
      },
    ]);

    // 9. Create Verification Submission for Admin Queue
    if (createdUsers.length > 4) {
      await Verification.create({
        user: createdUsers[4]._id,
        documentType: 'AADHAAR',
        documentNumberMasked: 'XXXX-XXXX-8921',
        documentFrontUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        selfieUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        status: VERIFICATION_STATUS.PENDING,
      });
    }

    // 10. Create Support Ticket
    await SupportTicket.create({
      ticketNumber: 'TKT-104928',
      user: demoUser._id,
      subject: 'Inquiry regarding Astro / Kundali matching report',
      category: 'PROFILE',
      priority: 'MEDIUM',
      status: 'OPEN',
      messages: [
        {
          sender: demoUser._id,
          senderRole: 'USER',
          message: 'Hello team, how can I download the full 36 Guna Kundali matching report for my matches?',
          sentAt: new Date(),
        },
      ],
    });

    logger.info('=====================================================');
    logger.info('🎉 RISHTA24 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    logger.info('Demo User:  demo@rishta24.test  / Password123!');
    logger.info('Super Admin: admin@rishta24.test / AdminPass123!');
    logger.info('=====================================================');
    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (err: any) {
    logger.error(`Seeding failed: ${err.message}`, { stack: err.stack });
    if (exitOnComplete) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seed(true);
}

