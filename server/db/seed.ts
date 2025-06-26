import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import { users, roles, meetings, contentPages, learningMaterials, meetingRoles, roleContent } from '@shared/schema';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
  console.log('Seeding database...');

  try {
    // Create default roles
    const defaultRoles = [
      { name: 'Toastmaster', description: 'The meeting leader who guides the session and ensures smooth flow' },
      { name: 'General Evaluator', description: 'Evaluates the overall meeting quality and provides comprehensive feedback' },
      { name: 'Table Topics Master', description: 'Conducts impromptu speaking sessions to improve quick thinking' },
      { name: 'Timer', description: 'Keeps track of speech timing and signals time limits' },
      { name: 'Ah-Counter', description: 'Counts filler words and sounds to improve speech clarity' },
      { name: 'Grammarian', description: 'Monitors language usage, grammar, and introduces word of the day' },
      { name: 'Sergeant-at-Arms', description: 'Manages meeting logistics, setup, and atmosphere' },
      { name: 'Speaker', description: 'Delivers prepared speeches for skill development' },
      { name: 'Evaluator', description: 'Provides constructive speech evaluations to help speakers improve' },
      { name: 'Gavel Taker', description: 'Assists with meeting roles and gains leadership experience' },
    ];

    const insertedRoles = [];
    for (const role of defaultRoles) {
      const result = await db.insert(roles).values(role).onConflictDoNothing().returning();
      if (result.length > 0) {
        insertedRoles.push(result[0]);
      } else {
        // If role exists, fetch it
        const existing = await db.select().from(roles).where(eq(roles.name, role.name)).limit(1);
        if (existing.length > 0) {
          insertedRoles.push(existing[0]);
        }
      }
    }

    // Create users with realistic data
    const userData = [
      {
        email: 'admin@gavelflow.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        displayName: 'Sarah Chen',
        fullName: 'Sarah Chen',
        dateOfBirth: '1990-05-15',
        school: 'National University of Singapore',
        gender: 'Female',
        phoneNumber: '+84 123 456 789',
        role: 'exco',
      },
      {
        email: 'member@gavelflow.com',
        passwordHash: await bcrypt.hash('member123', 10),
        displayName: 'John Doe',
        fullName: 'John Doe',
        dateOfBirth: '1992-08-22',
        school: 'Nanyang Technological University',
        gender: 'Male',
        phoneNumber: '+84 987 654 321',
        role: 'member',
      },
      {
        email: 'alice.nguyen@example.com',
        passwordHash: await bcrypt.hash('member123', 10),
        displayName: 'Alice Nguyen',
        fullName: 'Alice Nguyen',
        dateOfBirth: '1988-12-03',
        school: 'Singapore Management University',
        gender: 'Female',
        phoneNumber: '+84 111 222 333',
        role: 'member',
      },
      {
        email: 'guest@gavelflow.com',
        passwordHash: await bcrypt.hash('guest123', 10),
        displayName: 'Tom Wilson',
        fullName: 'Tom Wilson',
        dateOfBirth: '1995-03-10',
        school: 'Visiting Student',
        gender: 'Male',
        phoneNumber: '+84 555 666 777',
        role: 'guest',
      },
      {
        email: 'michael.smith@example.com',
        passwordHash: await bcrypt.hash('member123', 10),
        displayName: 'Michael Smith',
        fullName: 'Michael Smith',
        dateOfBirth: '1995-02-18',
        school: 'SUTD',
        gender: 'Male',
        phoneNumber: '+84 444 555 666',
        role: 'member',
      },
      {
        email: 'emily.johnson@example.com',
        passwordHash: await bcrypt.hash('member123', 10),
        displayName: 'Emily Johnson',
        fullName: 'Emily Johnson',
        dateOfBirth: '1993-07-11',
        school: 'SIT',
        gender: 'Female',
        phoneNumber: '+84 777 888 999',
        role: 'member',
      },
      {
        email: 'david.lee@example.com',
        passwordHash: await bcrypt.hash('member123', 10),
        displayName: 'David Lee',
        fullName: 'David Lee',
        dateOfBirth: '1991-11-25',
        school: 'NTU',
        gender: 'Male',
        phoneNumber: '+84 321 654 987',
        role: 'member',
      },
      {
        email: 'lisa.tran@example.com',
        passwordHash: await bcrypt.hash('member123', 10),
        displayName: 'Lisa Tran',
        fullName: 'Lisa Tran',
        dateOfBirth: '1994-04-08',
        school: 'SMU',
        gender: 'Female',
        phoneNumber: '+84 159 753 486',
        role: 'member',
      },
      {
        email: 'robert.wilson@example.com',
        passwordHash: await bcrypt.hash('member123', 10),
        displayName: 'Robert Wilson',
        fullName: 'Robert Wilson',
        dateOfBirth: '1987-12-20',
        school: 'NUS',
        gender: 'Male',
        phoneNumber: '+84 246 810 135',
        role: 'member',
      }
    ];

    const insertedUsers = [];
    for (const user of userData) {
      const result = await db.insert(users).values(user).onConflictDoNothing().returning();
      if (result.length > 0) {
        insertedUsers.push(result[0]);
      }
    }

    // Create meetings with realistic data
    const meetingData = [
      {
        title: 'Weekly Club Meeting #145',
        date: '2024-01-15',
        time: '18:30:00',
        theme: 'New Year, New Opportunities',
        location: 'Conference Room A, Danang Tech Hub',
        status: 'completed',
      },
      {
        title: 'Weekly Club Meeting #146',
        date: '2024-01-22',
        time: '18:30:00',
        theme: 'Leadership in Action',
        location: 'Conference Room A, Danang Tech Hub',
        status: 'completed',
      },
      {
        title: 'Weekly Club Meeting #147',
        date: '2024-01-29',
        time: '18:30:00',
        theme: 'Effective Communication',
        location: 'Conference Room A, Danang Tech Hub',
        status: 'upcoming',
      },
      {
        title: 'Weekly Club Meeting #148',
        date: '2024-02-05',
        time: '18:30:00',
        theme: 'Innovation and Creativity',
        location: 'Conference Room A, Danang Tech Hub',
        status: 'upcoming',
      },
    ];

    const insertedMeetings = [];
    for (const meeting of meetingData) {
      const result = await db.insert(meetings).values(meeting).returning();
      insertedMeetings.push(result[0]);
    }

    // Create content pages
    const contentPagesData = [
      {
        slug: 'what-is-gavel-club',
        title: 'What is Gavel Club? - About Meraki Gavel Club of Danang',
        content: `
# Welcome to Meraki Gavel Club of Danang

Gavel clubs are youth leadership programs designed to provide young people with communication and leadership skills. Our club, Meraki Gavel Club of Danang, is dedicated to fostering personal growth and professional development among young professionals in Danang, Vietnam.

## Our Mission
To provide a supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth.

## What We Do
- **Public Speaking**: Practice and improve presentation skills in a supportive environment
- **Leadership Development**: Take on various roles to build leadership capabilities
- **Networking**: Connect with like-minded young professionals
- **Personal Growth**: Build confidence and overcome fear of public speaking

## Meeting Structure
Our meetings follow a structured format that includes:
- Educational segments
- Prepared speeches
- Table Topics (impromptu speaking)
- Evaluations and feedback
- Leadership opportunities

Join us every Monday at 6:30 PM at the Danang Tech Hub!
        `,
        isPublished: true,
      },
      {
        slug: 'how-meetings-work',
        title: 'How does a club meeting work?',
        content: `
# Meeting Structure

Our club meetings follow a proven format designed to maximize learning and participation:

## Opening (15 minutes)
- Welcome and introductions
- Word of the Day presentation
- Educational segment

## Prepared Speeches (30 minutes)
- Members deliver prepared speeches (5-7 minutes each)
- Speeches follow educational pathways
- Focus on specific communication skills

## Table Topics (15 minutes)
- Impromptu speaking practice
- Random topics to think on your feet
- 1-2 minute responses

## Evaluation (20 minutes)
- Speech evaluations (2-3 minutes each)
- General evaluation of the meeting
- Report from functional roles

## Closing (10 minutes)
- Awards presentation
- Announcements
- Adjournment

## Roles in Every Meeting
- **Toastmaster**: Meeting leader
- **General Evaluator**: Overall meeting assessment
- **Timer**: Tracks all speaking times
- **Ah-Counter**: Monitors filler words
- **Grammarian**: Language and grammar focus
- **Table Topics Master**: Leads impromptu speaking
        `,
        isPublished: true,
      },
      {
        slug: 'rules-commitment',
        title: 'Rules & Commitment',
        content: `
# Club Rules and Member Commitment

## Attendance Policy
- Regular attendance is expected
- Notify in advance if unable to attend
- Minimum 75% attendance for good standing

## Member Responsibilities
1. **Punctuality**: Arrive on time for meetings
2. **Preparation**: Come prepared for assigned roles
3. **Participation**: Actively engage in all activities
4. **Respect**: Maintain supportive environment
5. **Growth**: Commit to personal development

## Meeting Etiquette
- Turn off mobile devices during meetings
- Listen actively to all speakers
- Provide constructive feedback
- Maintain professional demeanor

## Speech Requirements
- Complete educational pathways
- Accept speech assignments
- Prepare thoroughly for presentations
- Apply learned skills consistently

## Leadership Opportunities
- Take on meeting roles regularly
- Volunteer for club officer positions
- Mentor new members
- Support club activities

## Code of Conduct
- Treat all members with respect
- Maintain confidentiality when appropriate
- Support fellow members' growth
- Uphold club values and mission
        `,
        isPublished: true,
      },
      {
        slug: 'faq',
        title: 'Frequently Asked Questions',
        content: `
# Frequently Asked Questions

## General Questions

**Q: What is the age requirement for joining?**
A: Gavel clubs are typically for ages 18-30, though we welcome passionate learners of all backgrounds.

**Q: Do I need experience in public speaking?**
A: Not at all! Our club welcomes beginners and experienced speakers alike.

**Q: What is the time commitment?**
A: We meet weekly for 90 minutes. Additional time for speech preparation varies.

**Q: Is there a membership fee?**
A: Yes, we have modest membership dues to cover meeting expenses and materials.

## Meeting Questions

**Q: What if I'm nervous about speaking?**
A: Everyone starts nervous! Our supportive environment helps you build confidence gradually.

**Q: Can I bring guests?**
A: Absolutely! Guests are welcome to observe and participate in Table Topics.

**Q: What should I wear to meetings?**
A: Business casual attire is recommended but not required.

## Membership Questions

**Q: How do I join the club?**
A: Attend a few meetings as a guest, then submit a membership application.

**Q: Can I join if I travel frequently?**
A: Yes, though regular attendance helps maximize your growth.

**Q: Are there advancement opportunities?**
A: Yes! Members can pursue educational pathways and leadership roles.
        `,
        isPublished: true,
      },
      {
        slug: 'contact',
        title: 'Contact Us',
        content: `
# Get in Touch

## Club Information
**Meraki Gavel Club of Danang**

## Meeting Details
- **When**: Every Monday, 6:30 PM - 8:00 PM
- **Where**: Conference Room A, Danang Tech Hub
- **Address**: 123 Tech Street, Hai Chau District, Danang, Vietnam

## Contact Information
- **Email**: info@merakigavelclub.org
- **Phone**: +84 123 456 789
- **Facebook**: @MerakiGavelClubDanang

## Leadership Team
- **President**: Sarah Chen - president@merakigavelclub.org
- **Vice President Education**: John Doe - vpe@merakigavelclub.org
- **Vice President Membership**: Alice Nguyen - vpm@merakigavelclub.org
- **Secretary**: Emily Johnson - secretary@merakigavelclub.org
- **Treasurer**: Michael Smith - treasurer@merakigavelclub.org

## Visitor Information
New visitors are always welcome! No advance notice required - just show up to any meeting.

## Directions
The Danang Tech Hub is located in the heart of the city, easily accessible by:
- **Bus**: Routes 3, 7, and 12 stop nearby
- **Taxi/Grab**: Available throughout the city
- **Parking**: Free parking available in the building

We look forward to meeting you!
        `,
        isPublished: true,
      },
    ];

    for (const page of contentPagesData) {
      await db.insert(contentPages).values(page).onConflictDoNothing();
    }

    // Create learning materials
    const learningMaterialsData = [
      {
        title: 'Ice Breaker Speech Guide',
        description: 'Your first speech to introduce yourself to the club',
        content: `
# Ice Breaker Speech (4-6 minutes)

## Purpose
Introduce yourself to the club and practice basic speech structure.

## Objectives
- Tell your story in an engaging way
- Practice organizing a speech with clear beginning, middle, and end
- Begin building confidence in public speaking

## Structure Suggestions
1. **Opening** (30 seconds)
   - Grab attention with a question, quote, or interesting fact about yourself

2. **Body** (3-4 minutes)
   - Share 2-3 important aspects of your life
   - Include personal anecdotes or experiences
   - Explain what brought you to the club

3. **Conclusion** (30 seconds)
   - Summarize key points
   - End with a memorable statement

## Tips
- Be authentic and genuine
- Use personal stories to connect with audience
- Practice timing beforehand
- Make eye contact with different audience members
- Speak from the heart

## Common Topics
- Your background and career
- Hobbies and interests
- Family and personal life
- Goals and aspirations
- Why you joined the club
        `,
        materialType: 'speech_guide',
      },
      {
        title: 'Evaluation Guidelines',
        description: 'How to provide constructive feedback to speakers',
        content: `
# Speech Evaluation Guide

## Purpose of Evaluation
Help speakers improve by providing constructive, specific feedback.

## Evaluation Structure (2-3 minutes)

### 1. Opening (15 seconds)
- Thank the speaker
- State speech title and objectives

### 2. Strengths (60-90 seconds)
- Highlight what the speaker did well
- Be specific with examples
- Focus on both content and delivery

### 3. Recommendations (60-90 seconds)
- Suggest 1-2 areas for improvement
- Provide specific, actionable advice
- Frame positively

### 4. Closing (15 seconds)
- Encourage the speaker
- Thank them again

## Key Areas to Evaluate

**Content**
- Organization and structure
- Relevance to objectives
- Use of examples and stories

**Delivery**
- Voice variety and pace
- Gestures and movement
- Eye contact

**Language**
- Word choice
- Grammar
- Clarity

## Evaluation Tips
- Always start and end with positives
- Be honest but kind
- Focus on behavior, not personality
- Provide actionable suggestions
- Consider the speaker's experience level
        `,
        materialType: 'evaluation_guide',
      },
      {
        title: 'Table Topics Tips',
        description: 'Master the art of impromptu speaking',
        content: `
# Table Topics Success Guide

## What are Table Topics?
Impromptu speaking exercises designed to help you think on your feet and speak confidently without preparation.

## The PREP Method

**P - Point**: State your main point clearly
**R - Reason**: Explain why you hold this view
**E - Example**: Provide a specific example or story
**P - Point**: Restate your main point

## Other Useful Structures

### Past, Present, Future
- How things were
- How things are now
- How things will be

### Problem, Solution, Benefit
- Identify the issue
- Propose a solution
- Explain the benefits

### Three Points Method
- Make three related points
- Support each with brief examples
- Conclude by restating all three

## Tips for Success

**Before Speaking**
- Listen carefully to the question
- Take a moment to organize thoughts
- Choose your structure

**While Speaking**
- Start with confidence
- Use the structure you chose
- Make eye contact
- Speak slowly and clearly

**Managing Nerves**
- Take deep breaths
- Remember everyone is supportive
- Focus on your message, not perfection
- Practice makes perfect

## Common Pitfalls to Avoid
- Don't apologize for lack of preparation
- Avoid going off-topic
- Don't rush through your answer
- Don't end abruptly without conclusion
        `,
        materialType: 'speaking_guide',
      },
      {
        title: 'Meeting Roles Handbook',
        description: 'Complete guide to all meeting roles and responsibilities',
        content: `
# Meeting Roles and Responsibilities

## Toastmaster of the Meeting

**Before the Meeting**
- Arrive 15 minutes early
- Coordinate with role holders
- Prepare opening remarks and transitions

**During the Meeting**
- Lead the meeting with enthusiasm
- Introduce speakers and role holders
- Keep the meeting on schedule
- Handle any unexpected situations

**Key Skills Developed**
- Leadership and facilitation
- Time management
- Adaptability

## General Evaluator

**Responsibilities**
- Evaluate the overall meeting
- Coordinate with individual evaluators
- Provide constructive feedback on meeting flow

**Report Structure**
- Meeting highlights
- Areas for improvement
- Recognition of standout performances

## Timer

**Equipment Needed**
- Stopwatch or timer
- Green, yellow, and red cards

**Timing Guidelines**
- Green: Minimum time reached
- Yellow: One minute to maximum
- Red: Maximum time reached

**Responsibilities**
- Time all speakers and role holders
- Display timing signals clearly
- Provide detailed timing report

## Ah-Counter

**What to Track**
- Filler words (um, ah, you know)
- Repeated words or phrases
- Grammatical errors

**Reporting**
- Note specific examples
- Suggest alternatives
- Be encouraging and constructive

## Grammarian

**Responsibilities**
- Present word of the day
- Listen for good and poor language usage
- Provide language report

**Focus Areas**
- Grammar and syntax
- Word choice and variety
- Pronunciation

This role helps everyone improve their language skills!
        `,
        materialType: 'role_guide',
      },
    ];

    for (const material of learningMaterialsData) {
      await db.insert(learningMaterials).values(material);
    }

    // Add role content (scripts and guidelines)
    if (insertedRoles.length > 0) {
      const roleContentData = [
        {
          roleId: insertedRoles.find(r => r.name === 'Toastmaster')?.id,
          content: `
## Toastmaster Script

**Opening:**
"Good evening, fellow members and guests! Welcome to meeting #[NUMBER] of the Meraki Gavel Club of Danang. I am [YOUR NAME], your Toastmaster for this evening.

**Theme Introduction:**
Tonight's theme is '[THEME]'. [Elaborate on theme - 1-2 minutes]

**Introductions:**
Before we begin, let's welcome our guests... [Introduce guests]

**Program Overview:**
Tonight we have an exciting program featuring [NUMBER] prepared speeches and engaging Table Topics session.

**Transitions:**
- 'Now I'd like to introduce our first speaker...'
- 'Thank you [SPEAKER NAME]. Next, we'll hear from...'
- 'That concludes our prepared speeches. Now let's move to Table Topics.'

**Closing:**
'This concludes tonight's meeting. Thank you all for your participation and see you next week!'
          `,
          language: 'en',
        },
        {
          roleId: insertedRoles.find(r => r.name === 'General Evaluator')?.id,
          content: `
## General Evaluator Guidelines

**Opening:**
'Thank you, Toastmaster. Good evening everyone. As your General Evaluator, I will assess tonight's meeting and coordinate our evaluation team.'

**During Meeting:**
- Take notes on overall meeting flow
- Observe audience engagement
- Note timing adherence
- Watch for smooth transitions

**Evaluation Report Structure:**
1. **Meeting Highlights** (90 seconds)
   - What went particularly well
   - Standout moments or performances

2. **Areas for Improvement** (60 seconds)
   - Constructive suggestions for future meetings
   - Focus on process, not individuals

3. **Recognition** (30 seconds)
   - Acknowledge exceptional contributions
   - Thank role holders and speakers

**Closing:**
'Thank you for allowing me to serve as your General Evaluator. Back to you, Toastmaster.'
          `,
          language: 'en',
        },
      ];

      for (const content of roleContentData) {
        if (content.roleId) {
          await db.insert(roleContent).values(content);
        }
      }
    }

    // Assign roles to meetings
    if (insertedUsers.length > 0 && insertedMeetings.length > 0 && insertedRoles.length > 0) {
      const meetingRoleAssignments = [
        // Meeting 1 assignments
        {
          meetingId: insertedMeetings[0].id,
          userId: insertedUsers[0].id,
          roleId: insertedRoles.find(r => r.name === 'Toastmaster')?.id,
        },
        {
          meetingId: insertedMeetings[0].id,
          userId: insertedUsers[1].id,
          roleId: insertedRoles.find(r => r.name === 'Speaker')?.id,
          speechTitle: 'My Journey to Public Speaking',
          speechObjectives: 'Practice storytelling and build confidence',
        },
        {
          meetingId: insertedMeetings[0].id,
          userId: insertedUsers[2].id,
          roleId: insertedRoles.find(r => r.name === 'Evaluator')?.id,
        },
        {
          meetingId: insertedMeetings[0].id,
          userId: insertedUsers[3].id,
          roleId: insertedRoles.find(r => r.name === 'Table Topics Master')?.id,
        },
        {
          meetingId: insertedMeetings[0].id,
          userId: insertedUsers[4].id,
          roleId: insertedRoles.find(r => r.name === 'Timer')?.id,
        },
        // Meeting 2 assignments
        {
          meetingId: insertedMeetings[1].id,
          userId: insertedUsers[1].id,
          roleId: insertedRoles.find(r => r.name === 'Toastmaster')?.id,
        },
        {
          meetingId: insertedMeetings[1].id,
          userId: insertedUsers[2].id,
          roleId: insertedRoles.find(r => r.name === 'Speaker')?.id,
          speechTitle: 'Leadership Lessons from My Career',
          speechObjectives: 'Share leadership insights and inspire others',
        },
        {
          meetingId: insertedMeetings[1].id,
          userId: insertedUsers[3].id,
          roleId: insertedRoles.find(r => r.name === 'General Evaluator')?.id,
        },
      ];

      for (const assignment of meetingRoleAssignments) {
        if (assignment.roleId) {
          await db.insert(meetingRoles).values(assignment);
        }
      }
    }

    console.log('Database seeded successfully with comprehensive data!');
    console.log(`- Created ${insertedRoles.length} roles`);
    console.log(`- Created ${insertedUsers.length} users`);
    console.log(`- Created ${insertedMeetings.length} meetings`);
    console.log(`- Created ${contentPagesData.length} content pages`);
    console.log(`- Created ${learningMaterialsData.length} learning materials`);

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});