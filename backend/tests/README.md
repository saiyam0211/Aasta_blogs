# API Testing Documentation

## Overview

This document provides comprehensive API testing scenarios for the blog backend system. The tests validate all API endpoints, authentication mechanisms, error handling, and CORS functionality as specified in the requirements.

## Test Structure

### Test Files

1. **auth.test.js** - Authentication endpoint testing
2. **blogs.test.js** - Blog CRUD operations testing
3. **errorHandling.test.js** - Error handling and edge cases
4. **cors.test.js** - CORS functionality testing
5. **integration.test.js** - End-to-end integration tests

### Test Setup

- **Test Environment**: Node.js with Jest testing framework
- **Database**: In-memory MongoDB using mongodb-memory-server
- **HTTP Testing**: Supertest for API endpoint testing
- **Test Isolation**: Each test suite runs independently with clean database state

## Test Coverage

### Authentication Tests (auth.test.js)

#### Valid Authentication Scenarios
- ✅ Login with correct admin credentials (admin/admin123)
- ✅ JWT token generation and validation
- ✅ Access to protected routes with valid token

#### Invalid Authentication Scenarios
- ✅ Login with invalid username
- ✅ Login with invalid password
- ✅ Missing username in login request
- ✅ Missing password in login request
- ✅ Empty login request body
- ✅ Access denied with invalid JWT token
- ✅ Access denied with missing token
- ✅ Access denied with malformed Authorization header

### Blog CRUD Tests (blogs.test.js)

#### Create Blog Post (POST /api/blogs)
- ✅ Create blog with valid data and authentication
- ✅ Reject creation without authentication (401)
- ✅ Validate required fields (title, content, author)
- ✅ Enforce title length limit (200 characters)
- ✅ Enforce author length limit (100 characters)

#### Retrieve Blog Posts (GET /api/blogs)
- ✅ Return empty array when no blogs exist
- ✅ Return all blogs in descending order by creation date
- ✅ Include all necessary fields (id, title, content, author, timestamps)

#### Retrieve Specific Blog (GET /api/blogs/:id)
- ✅ Return specific blog by valid ID
- ✅ Return 404 for non-existent blog ID
- ✅ Return 400 for invalid ObjectId format

#### Update Blog Post (PUT /api/blogs/:id)
- ✅ Update blog with valid data and authentication
- ✅ Reject update without authentication (401)
- ✅ Return 404 for non-existent blog
- ✅ Validate update data

#### Delete Blog Post (DELETE /api/blogs/:id)
- ✅ Delete blog with valid ID and authentication
- ✅ Reject deletion without authentication (401)
- ✅ Return 404 for non-existent blog
- ✅ Return 400 for invalid ObjectId format

### Error Handling Tests (errorHandling.test.js)

#### Database Error Handling
- ✅ Graceful handling of database connection issues
- ✅ Invalid MongoDB ObjectId validation
- ✅ Proper error responses for database operations

#### Validation Error Handling
- ✅ Detailed validation error messages
- ✅ Field length validation errors
- ✅ Required field validation errors

#### Authentication Error Handling
- ✅ Missing Authorization header handling
- ✅ Malformed Authorization header handling
- ✅ Invalid/expired JWT token handling

#### HTTP Error Handling
- ✅ 404 errors for non-existent resources
- ✅ 404 errors for non-existent routes
- ✅ Malformed JSON request handling
- ✅ Unsupported content type handling

#### Error Response Consistency
- ✅ Consistent error format across all endpoints
- ✅ Proper HTTP status codes
- ✅ Meaningful error messages

### CORS Tests (cors.test.js)

#### CORS Headers
- ✅ Proper CORS headers in responses
- ✅ Preflight OPTIONS request handling (204 status)
- ✅ Cross-origin requests from frontend domain
- ✅ Support for all HTTP methods (GET, POST, PUT, DELETE)

#### Cross-Origin Request Handling
- ✅ Requests without Origin header
- ✅ Authentication endpoint CORS support
- ✅ Credentials handling in CORS requests

#### Content-Type and Authorization
- ✅ JSON content type handling in CORS requests
- ✅ Authorization header support in CORS requests

#### Frontend Integration Simulation
- ✅ Complete login flow simulation
- ✅ Blog creation flow simulation
- ✅ Blog retrieval flow simulation

### Integration Tests (integration.test.js)

#### Complete Blog Management Workflow
- ✅ End-to-end blog lifecycle (create → read → update → delete)
- ✅ Multiple blog posts management
- ✅ Data persistence and consistency validation

#### Authentication and Authorization Flow
- ✅ Authentication enforcement across all protected endpoints
- ✅ Token validation across different operations

#### Data Consistency
- ✅ Timestamp consistency (createdAt vs updatedAt)
- ✅ Data persistence across operations
- ✅ Proper data relationships

## Test Execution

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.js
```

### Test Results Summary

- **Total Test Suites**: 5
- **Total Tests**: 66
- **Passing Tests**: 66 (100%)
- **Test Coverage**: All requirements validated

## Requirements Validation

### Requirement 1 - Authentication System
- ✅ 1.1: JWT token generation for valid admin credentials
- ✅ 1.2: 401 status for invalid credentials
- ✅ 1.3: Access control for protected routes
- ✅ 1.4: 401 status for invalid/missing tokens
- ✅ 1.5: Token expiration handling

### Requirement 2 - Blog Creation
- ✅ 2.1: Blog creation with valid data and authentication
- ✅ 2.2: Required field validation
- ✅ 2.3: 201 status for successful creation
- ✅ 2.4: 400 status for invalid data
- ✅ 2.5: 401 status without authentication

### Requirement 3 - Blog Retrieval
- ✅ 3.1: Return all published blog posts
- ✅ 3.2: Descending order by creation date
- ✅ 3.3: Empty array when no posts exist
- ✅ 3.4: All necessary fields included
- ✅ 3.5: Specific blog retrieval by ID

### Requirement 4 - Blog Updates
- ✅ 4.1: Update with valid data and authentication
- ✅ 4.2: Data validation for updates
- ✅ 4.3: 200 status for successful updates
- ✅ 4.4: 404 status for non-existent blogs
- ✅ 4.5: 401 status without authentication

### Requirement 5 - Blog Deletion
- ✅ 5.1: Delete with valid ID and authentication
- ✅ 5.2: 204 status for successful deletion
- ✅ 5.3: 404 status for non-existent blogs
- ✅ 5.4: 401 status without authentication

### Requirement 6 - Error Handling
- ✅ 6.1: Database connection error handling
- ✅ 6.2: Invalid ObjectId error handling
- ✅ 6.3: 500 status for server errors
- ✅ 6.4: Detailed validation error messages
- ✅ 6.5: Error logging for debugging

### Requirement 7 - CORS and Middleware
- ✅ 7.1: Cross-origin requests support
- ✅ 7.2: JSON request body parsing
- ✅ 7.3: MongoDB database connection
- ✅ 7.4: Request logging for monitoring
- ✅ 7.5: Configurable port with fallback

## Edge Cases Tested

1. **Authentication Edge Cases**
   - Empty credentials
   - Malformed tokens
   - Expired tokens
   - Missing Authorization headers

2. **Data Validation Edge Cases**
   - Maximum field lengths
   - Empty required fields
   - Invalid data types
   - Special characters in content

3. **Database Edge Cases**
   - Invalid ObjectId formats
   - Non-existent resource access
   - Database connection failures

4. **HTTP Edge Cases**
   - Malformed JSON requests
   - Unsupported content types
   - Invalid HTTP methods
   - CORS preflight requests

## Test Environment Configuration

- **NODE_ENV**: Set to 'test' during test execution
- **Database**: In-memory MongoDB for isolation
- **Port**: Dynamic port assignment for parallel testing
- **Logging**: Error logging enabled for debugging
- **CORS**: Configured for localhost:5173 (React dev server)

## Conclusion

The comprehensive test suite validates all API functionality, error handling, and edge cases as specified in the requirements. All 66 tests pass successfully, ensuring the blog backend API is robust, secure, and ready for production use.