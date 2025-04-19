const { createTestUser, getTestClient } = require('./setup');
const { CareJourney } = require('../models');

describe('Care Journey Features', () => {
  let testUser;
  let testClient;

  beforeAll(async () => {
    testUser = await createTestUser();
    testClient = getTestClient();
  });

  describe('Timeline Events', () => {
    it('should create a timeline event', async () => {
      const CREATE_TIMELINE_EVENT = `
        mutation CreateTimelineEvent($input: TimelineEventInput!) {
          createTimelineEvent(input: $input) {
            id
            title
            description
            date
            eventType
          }
        }
      `;

      const result = await testClient.mutate({
        mutation: CREATE_TIMELINE_EVENT,
        variables: {
          input: {
            userId: testUser.id,
            title: 'Test Event',
            description: 'Test Description',
            date: new Date().toISOString(),
            eventType: 'appointment'
          }
        }
      });

      expect(result.data.createTimelineEvent).toBeDefined();
      expect(result.data.createTimelineEvent.title).toBe('Test Event');
    });

    it('should retrieve timeline events', async () => {
      const GET_TIMELINE_EVENTS = `
        query GetTimelineEvents($userId: ID!, $startDate: String!, $endDate: String!) {
          timelineEvents(userId: $userId, startDate: $startDate, endDate: $endDate) {
            id
            title
            description
            date
          }
        }
      `;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const result = await testClient.query({
        query: GET_TIMELINE_EVENTS,
        variables: {
          userId: testUser.id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });

      expect(result.data.timelineEvents).toBeDefined();
      expect(Array.isArray(result.data.timelineEvents)).toBe(true);
    });
  });

  describe('Medical History', () => {
    it('should add a medical record', async () => {
      const ADD_MEDICAL_RECORD = `
        mutation AddMedicalRecord($input: MedicalRecordInput!) {
          addMedicalRecord(input: $input) {
            id
            title
            description
            medicalType
            provider
          }
        }
      `;

      const result = await testClient.mutate({
        mutation: ADD_MEDICAL_RECORD,
        variables: {
          input: {
            userId: testUser.id,
            title: 'Test Medical Record',
            description: 'Test Description',
            date: new Date().toISOString(),
            medicalType: 'diagnosis',
            provider: 'Test Provider'
          }
        }
      });

      expect(result.data.addMedicalRecord).toBeDefined();
      expect(result.data.addMedicalRecord.title).toBe('Test Medical Record');
    });

    it('should retrieve medical history', async () => {
      const GET_MEDICAL_HISTORY = `
        query GetMedicalHistory($userId: ID!) {
          medicalHistory(userId: $userId) {
            id
            title
            description
            medicalType
          }
        }
      `;

      const result = await testClient.query({
        query: GET_MEDICAL_HISTORY,
        variables: {
          userId: testUser.id
        }
      });

      expect(result.data.medicalHistory).toBeDefined();
      expect(Array.isArray(result.data.medicalHistory)).toBe(true);
    });
  });

  describe('School Progress', () => {
    it('should add school progress', async () => {
      const ADD_SCHOOL_PROGRESS = `
        mutation AddSchoolProgress($input: SchoolProgressInput!) {
          addSchoolProgress(input: $input) {
            id
            title
            description
            academicYear
            subject
            grade
          }
        }
      `;

      const result = await testClient.mutate({
        mutation: ADD_SCHOOL_PROGRESS,
        variables: {
          input: {
            userId: testUser.id,
            title: 'Test Progress',
            description: 'Test Description',
            date: new Date().toISOString(),
            academicYear: '2023-2024',
            subject: 'Math',
            grade: 'A'
          }
        }
      });

      expect(result.data.addSchoolProgress).toBeDefined();
      expect(result.data.addSchoolProgress.title).toBe('Test Progress');
    });

    it('should retrieve school progress', async () => {
      const GET_SCHOOL_PROGRESS = `
        query GetSchoolProgress($userId: ID!) {
          schoolProgress(userId: $userId) {
            id
            title
            description
            academicYear
            subject
            grade
          }
        }
      `;

      const result = await testClient.query({
        query: GET_SCHOOL_PROGRESS,
        variables: {
          userId: testUser.id
        }
      });

      expect(result.data.schoolProgress).toBeDefined();
      expect(Array.isArray(result.data.schoolProgress)).toBe(true);
    });
  });

  describe('Memories', () => {
    it('should add a memory', async () => {
      const ADD_MEMORY = `
        mutation AddMemory($input: MemoryInput!) {
          addMemory(input: $input) {
            id
            title
            description
            memoryType
          }
        }
      `;

      const result = await testClient.mutate({
        mutation: ADD_MEMORY,
        variables: {
          input: {
            userId: testUser.id,
            title: 'Test Memory',
            description: 'Test Description',
            date: new Date().toISOString(),
            memoryType: 'photo'
          }
        }
      });

      expect(result.data.addMemory).toBeDefined();
      expect(result.data.addMemory.title).toBe('Test Memory');
    });

    it('should retrieve memories', async () => {
      const GET_MEMORIES = `
        query GetMemories($userId: ID!) {
          memories(userId: $userId) {
            id
            title
            description
            memoryType
          }
        }
      `;

      const result = await testClient.query({
        query: GET_MEMORIES,
        variables: {
          userId: testUser.id
        }
      });

      expect(result.data.memories).toBeDefined();
      expect(Array.isArray(result.data.memories)).toBe(true);
    });
  });

  describe('Future Planning', () => {
    it('should create a future plan', async () => {
      const CREATE_FUTURE_PLAN = `
        mutation CreateFuturePlan($input: FuturePlanInput!) {
          createFuturePlan(input: $input) {
            id
            title
            description
            planType
            priority
            status
          }
        }
      `;

      const result = await testClient.mutate({
        mutation: CREATE_FUTURE_PLAN,
        variables: {
          input: {
            userId: testUser.id,
            title: 'Test Plan',
            description: 'Test Description',
            planType: 'education',
            priority: 'high',
            dueDate: new Date().toISOString()
          }
        }
      });

      expect(result.data.createFuturePlan).toBeDefined();
      expect(result.data.createFuturePlan.title).toBe('Test Plan');
    });

    it('should update plan status', async () => {
      const UPDATE_PLAN_STATUS = `
        mutation UpdatePlanStatus($id: ID!, $status: String!) {
          updatePlanStatus(id: $id, status: $status) {
            id
            status
          }
        }
      `;

      // First, create a plan
      const plan = await CareJourney.create({
        userId: testUser.id,
        type: 'future_plan',
        title: 'Test Plan',
        description: 'Test Description',
        date: new Date(),
        planType: 'education',
        priority: 'high',
        status: 'planned'
      });

      const result = await testClient.mutate({
        mutation: UPDATE_PLAN_STATUS,
        variables: {
          id: plan.id,
          status: 'in_progress'
        }
      });

      expect(result.data.updatePlanStatus).toBeDefined();
      expect(result.data.updatePlanStatus.status).toBe('in_progress');
    });
  });
}); 