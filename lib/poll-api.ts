/**
 * Poll API Client Functions
 * 
 * This module provides TypeScript client functions for interacting with the Polly API.
 * All functions include proper error handling, type safety, and comprehensive documentation.
 */

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
 * Fetches the results for a specific poll
 * 
 * @param pollId - The ID of the poll to get results for
 * @returns Promise that resolves to the poll results data
 * @throws Error with status code and message on failure
 * 
 * @example
 * ```typescript
 * try {
 *   const results = await fetchPollResults("123");
 *   console.log('Poll results:', results);
 *   results.results.forEach(result => {
 *     console.log(`${result.text}: ${result.vote_count} votes`);
 *   });
 * } catch (error) {
 *   console.error('Failed to fetch poll results:', error.message);
 * }
 * ```
 */
export async function fetchPollResults(
  pollId: string
): Promise<PollResults> {
  const url = `http://localhost:8000/polls/${pollId}/results`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
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
    const pollResults: PollResults = await response.json();
    return pollResults;
    
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

/** Individual result for a poll option */
interface PollResultOption {
  option_id: number;
  text: string;
  vote_count: number;
}

/** Complete poll results response */
interface PollResults {
  poll_id: number;
  question: string;
  results: PollResultOption[];
}

/**
 * Example usage scenarios:
 * 
 * ```typescript
 * import { submitVote, fetchPollResults } from './lib/poll-api';
 * 
 * // Example 1: Submit a vote
 * async function handleVote(pollId: string, optionId: string, token: string) {
 *   try {
 *     const result = await submitVote(pollId, optionId, token);
 *     console.log('Vote submitted successfully:', result);
 *     return result;
 *   } catch (error) {
 *     if (error.message.includes('401')) {
 *       console.error('Authentication failed - please log in again');
 *     } else if (error.message.includes('404')) {
 *       console.error('Poll or option not found');
 *     } else {
 *       console.error('Failed to submit vote:', error.message);
 *     }
 *     throw error;
 *   }
 * }
 * 
 * // Example 2: Display poll results
 * async function displayPollResults(pollId: string) {
 *   try {
 *     const results = await fetchPollResults(pollId);
 *     
 *     console.log(`Poll: ${results.question}`);
 *     console.log('Results:');
 *     
 *     // Sort results by vote count (highest first)
 *     const sortedResults = results.results.sort((a, b) => b.vote_count - a.vote_count);
 *     
 *     sortedResults.forEach((result, index) => {
 *       console.log(`${index + 1}. ${result.text}: ${result.vote_count} votes`);
 *     });
 *     
 *     // Calculate total votes
 *     const totalVotes = results.results.reduce((sum, result) => sum + result.vote_count, 0);
 *     console.log(`Total votes: ${totalVotes}`);
 *     
 *     return results;
 *   } catch (error) {
 *     if (error.message.includes('404')) {
 *       console.error('Poll not found');
 *     } else {
 *       console.error('Failed to fetch poll results:', error.message);
 *     }
 *     throw error;
 *   }
 * }
 * 
 * // Example 3: Complete voting workflow
 * async function completeVotingWorkflow(pollId: string, optionId: string, token: string) {
 *   try {
 *     // First, get current results
 *     console.log('Current poll results:');
 *     await displayPollResults(pollId);
 *     
 *     // Submit the vote
 *     console.log('\nSubmitting vote...');
 *     await handleVote(pollId, optionId, token);
 *     
 *     // Show updated results
 *     console.log('\nUpdated poll results:');
 *     await displayPollResults(pollId);
 *     
 *   } catch (error) {
 *     console.error('Voting workflow failed:', error.message);
 *   }
 * }
 * ```
 */