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
 * Example usage:
 * 
 * ```typescript
 * import { fetchPollResults } from './fetchPollResults';
 * 
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
 *   } catch (error) {
 *     if (error.message.includes('404')) {
 *       console.error('Poll not found');
 *     } else {
 *       console.error('Failed to fetch poll results:', error.message);
 *     }
 *   }
 * }
 * ```
 */