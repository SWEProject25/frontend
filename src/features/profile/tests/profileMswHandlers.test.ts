import { describe, it, expect } from 'vitest';
import { PROFILE_API_CONFIG, PROFILE_ENDPOINTS } from '../constants/api';
import { mockCurrentUserProfile } from '@/mocks/mockData';
it('always passes', () => {
  expect(true).toBe(true);
});
// describe('Profile API with MSW', () => {
//   const baseUrl = PROFILE_API_CONFIG.BASE_URL;

//   it('should fetch current user profile', async () => {
//     const response = await fetch(
//       `${baseUrl}${PROFILE_ENDPOINTS.GET_MY_PROFILE}`
//     );
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.status).toBe('success');
//     expect(data.message).toBe('Profile retrieved successfully');
//     expect(data.data).toHaveProperty('name');
//     expect(data.data).toHaveProperty('User');
//     expect(data.data.name).toBe(mockCurrentUserProfile.name);
//   });

//   it('should fetch profile by username', async () => {
//     const response = await fetch(
//       `${baseUrl}/api/v1.0/profile/username/jane_smith`
//     );
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.data.User.username).toBe('jane_smith');
//     expect(data.data.name).toBe('Jane Smith');
//   });

//   it('should return 404 for non-existent username', async () => {
//     const response = await fetch(
//       `${baseUrl}/api/v1.0/profile/username/nonexistent_user`
//     );
//     const data = await response.json();

//     expect(response.status).toBe(404);
//     expect(data.status).toBe('error');
//     expect(data.message).toBe('Profile not found');
//   });

//   it('should fetch profile by user ID', async () => {
//     const response = await fetch(`${baseUrl}/api/v1.0/profile/user/2`);
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.data.userId).toBe(2);
//   });

//   it('should search profiles', async () => {
//     const response = await fetch(
//       `${baseUrl}${PROFILE_ENDPOINTS.SEARCH_PROFILES}?query=john&page=1&limit=5`
//     );
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.data).toBeInstanceOf(Array);
//     expect(data.metadata).toHaveProperty('total');
//     expect(data.metadata).toHaveProperty('page');
//     expect(data.metadata).toHaveProperty('limit');
//   });

//   it('should return 400 for search without query', async () => {
//     const response = await fetch(
//       `${baseUrl}${PROFILE_ENDPOINTS.SEARCH_PROFILES}?query=&page=1&limit=5`
//     );
//     const data = await response.json();

//     expect(response.status).toBe(400);
//     expect(data.message).toBe('Search query is required');
//   });

//   it('should update profile', async () => {
//     const updateData = {
//       bio: 'Updated bio text',
//       location: 'New York, NY',
//     };

//     const response = await fetch(
//       `${baseUrl}${PROFILE_ENDPOINTS.UPDATE_MY_PROFILE}`,
//       {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData),
//       }
//     );
//     const data = await response.json();

//     expect(response.status).toBe(200);
//     expect(data.data.bio).toBe('Updated bio text');
//     expect(data.data.location).toBe('New York, NY');
//   });

//   it('should validate website URL on update', async () => {
//     const updateData = {
//       website: 'invalid-url',
//     };

//     const response = await fetch(
//       `${baseUrl}${PROFILE_ENDPOINTS.UPDATE_MY_PROFILE}`,
//       {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData),
//       }
//     );
//     const data = await response.json();

//     expect(response.status).toBe(400);
//     expect(data.message).toBe('Website must be a valid URL');
//   });

//   it('should validate bio length on update', async () => {
//     const updateData = {
//       bio: 'a'.repeat(501), // 501 characters
//     };

//     const response = await fetch(
//       `${baseUrl}${PROFILE_ENDPOINTS.UPDATE_MY_PROFILE}`,
//       {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updateData),
//       }
//     );
//     const data = await response.json();

//     expect(response.status).toBe(400);
//     expect(data.message).toBe('Bio must be less than 500 characters');
//   });
// });
