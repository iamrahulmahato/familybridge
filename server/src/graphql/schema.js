const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: String!
    dateOfBirth: String
    phone: String
    address: String
    emergencyContact: JSON
    preferences: JSON
    notificationSettings: JSON
    lastLogin: String
    status: String!
    avatar: String
  }

  type CareJourney {
    id: ID!
    userId: ID!
    type: String!
    title: String!
    description: String
    date: String!
    category: String
    tags: [String]
    attachments: [JSON]
    metadata: JSON
    eventType: String
    location: String
    medicalType: String
    provider: String
    academicYear: String
    subject: String
    grade: String
    memoryType: String
    planType: String
    status: String
    priority: String
    sharedWith: [ID]
  }

  type ResourceExchange {
    id: ID!
    type: String!
    title: String!
    description: String
    category: String
    tags: [String]
    location: String
    contactInfo: JSON
    metadata: JSON
    resourceType: String
    author: String
    providerType: String
    specialties: [String]
    availability: JSON
    ratings: JSON
    legalType: String
    jurisdiction: String
    equipmentType: String
    condition: String
    ownerId: ID
    status: String
  }

  type Query {
    # User Queries
    user(id: ID!): User
    users: [User]

    # Care Journey Queries
    timelineEvents(userId: ID!, startDate: String!, endDate: String!): [CareJourney]
    medicalHistory(userId: ID!): [CareJourney]
    schoolProgress(userId: ID!): [CareJourney]
    memories(userId: ID!): [CareJourney]
    futurePlans(userId: ID!): [CareJourney]

    # Resource Exchange Queries
    communityResources(category: String, tags: [String]): [ResourceExchange]
    serviceProviders(providerType: String, location: String, specialties: [String]): [ResourceExchange]
    legalGuides(legalType: String, jurisdiction: String): [ResourceExchange]
    equipment(equipmentType: String, location: String, condition: String): [ResourceExchange]
  }

  type Mutation {
    # Care Journey Mutations
    createTimelineEvent(input: TimelineEventInput!): CareJourney
    addMedicalRecord(input: MedicalRecordInput!): CareJourney
    addSchoolProgress(input: SchoolProgressInput!): CareJourney
    addMemory(input: MemoryInput!): CareJourney
    createFuturePlan(input: FuturePlanInput!): CareJourney
    updatePlanStatus(id: ID!, status: String!): CareJourney
    shareWithFamily(id: ID!, familyMemberIds: [ID]!): CareJourney

    # Resource Exchange Mutations
    addCommunityResource(input: CommunityResourceInput!): ResourceExchange
    addServiceProvider(input: ServiceProviderInput!): ResourceExchange
    rateProvider(id: ID!, rating: Int!): ResourceExchange
    addLegalGuide(input: LegalGuideInput!): ResourceExchange
    addEquipment(input: EquipmentInput!): ResourceExchange
    updateEquipmentAvailability(id: ID!, available: Boolean!): ResourceExchange
  }

  # Input Types
  input TimelineEventInput {
    userId: ID!
    title: String!
    description: String
    date: String!
    eventType: String
    location: String
    category: String
    tags: [String]
  }

  input MedicalRecordInput {
    userId: ID!
    title: String!
    description: String
    date: String!
    medicalType: String
    provider: String
    category: String
  }

  input SchoolProgressInput {
    userId: ID!
    title: String!
    description: String
    date: String!
    academicYear: String
    subject: String
    grade: String
  }

  input MemoryInput {
    userId: ID!
    title: String!
    description: String
    date: String!
    memoryType: String
    category: String
    attachments: [Upload]
  }

  input FuturePlanInput {
    userId: ID!
    title: String!
    description: String
    planType: String!
    priority: String!
    dueDate: String!
  }

  input CommunityResourceInput {
    title: String!
    description: String
    resourceType: String!
    author: String
    category: String
    tags: [String]
  }

  input ServiceProviderInput {
    title: String!
    description: String
    providerType: String!
    specialties: [String]
    contactInfo: JSON!
    location: String
  }

  input LegalGuideInput {
    title: String!
    description: String
    legalType: String!
    jurisdiction: String!
    category: String
  }

  input EquipmentInput {
    title: String!
    description: String
    equipmentType: String!
    condition: String!
    location: String
  }

  scalar JSON
  scalar Upload
`;

module.exports = typeDefs; 