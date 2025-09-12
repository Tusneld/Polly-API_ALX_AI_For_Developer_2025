/**
 * Submits a vote for a specific poll option
 * 
 * @param pollId - The ID of the poll to vote on
 * @param optionId - The ID of the option to vote for
 * @param token - The JWT bearer token for authentication
 * @returns Promise that resolves to the vote response data
 * @throws Error with status code and message on failure
 * 
 * @example
 * ```typescript
 * try {
 *   const vote = await submitVote("123", "456", "your-jwt-token");
 *   console.log('Vote submitted:', vote);
 * } catch (error) {
 *   console.error('Failed to submit vote:', error.message);
 * }
 * ```
 */
export async function submitVote(
  pollId: string,
  optionId: string,
  token: string
): Promise<VoteResponse> {
  const url = `http://localhost:8000/polls/${pollId}/vote`;
  
  const requestBody: VoteRequest = {
    option_id: parseInt(optionId, 10)
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    // Handle non-2xx responses
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch {
        // If we can't parse the error response, use the default message
      }
      
      throw new Error(errorMessage);
    }

    // Parse and return the successful response
    const voteData: VoteResponse = await response.json();
    return voteData;
    
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof Error) {
      throw error;
    }
    
    // Handle network errors or other unexpected errors
    throw new Error(`Network error: ${String(error)}`);
  }
}

/**
 * Type definitions based on the OpenAPI specification
 */

/** Request body for voting on a poll */
interface VoteRequest {
  option_id: number;
}

/** Response data when a vote is successfully submitted */
interface VoteResponse {
  id: number;
  user_id: number;
  option_id: number;
  created_at: string;
}

/**
 * Example usage:
 * 
 * ```typescript
 * import { submitVote } from './submitVote';
 * 
 * async function handleVote() {
 *   try {
 *     const result = await submitVote('1', '2', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *     console.log('Vote submitted successfully:', result);
 *   } catch (error) {
 *     if (error.message.includes('401')) {
 *       console.error('Authentication failed - please log in again');
 *     } else if (error.message.includes('404')) {
 *       console.error('Poll or option not found');
 *     } else {
 *       console.error('Failed to submit vote:', error.message);
 *     }
 *   }
 * }
 * ```
 */