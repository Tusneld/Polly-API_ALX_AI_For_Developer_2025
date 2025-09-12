import requests
from typing import List, Dict, Any, Optional


def fetch_polls(skip: int = 0, limit: int = 10, base_url: str = "http://localhost:8000") -> List[Dict[str, Any]]:
    """
    Fetch paginated poll data from the /polls endpoint.
    
    Args:
        skip (int): Number of items to skip (default: 0)
        limit (int): Maximum number of items to return (default: 10)
        base_url (str): The base URL of the API (default: http://localhost:8000)
    
    Returns:
        List[Dict[str, Any]]: List of poll objects following the PollOut schema
    
    Raises:
        requests.exceptions.RequestException: If there's a network error
        requests.exceptions.HTTPError: If the server returns an HTTP error
    """
    # Construct the full URL for the polls endpoint
    url = f"{base_url.rstrip('/')}/polls"
    
    # Set up query parameters
    params = {
        "skip": skip,
        "limit": limit
    }
    
    try:
        # Make the GET request
        response = requests.get(url, params=params)
        
        # Raise an exception for bad status codes
        response.raise_for_status()
        
        # Return the JSON response (array of PollOut objects)
        return response.json()
        
    except requests.exceptions.HTTPError as e:
        # Handle HTTP errors
        if response.status_code == 404:
            raise ValueError("Polls endpoint not found")
        else:
            raise e
    except requests.exceptions.RequestException as e:
        # Handle other request exceptions (network errors, etc.)
        raise e


def fetch_all_polls(base_url: str = "http://localhost:8000", batch_size: int = 10) -> List[Dict[str, Any]]:
    """
    Fetch all polls by making multiple paginated requests.
    
    Args:
        base_url (str): The base URL of the API (default: http://localhost:8000)
        batch_size (int): Number of polls to fetch per request (default: 10)
    
    Returns:
        List[Dict[str, Any]]: Complete list of all poll objects
    
    Raises:
        requests.exceptions.RequestException: If there's a network error
        requests.exceptions.HTTPError: If the server returns an HTTP error
    """
    all_polls = []
    skip = 0
    
    while True:
        # Fetch a batch of polls
        batch = fetch_polls(skip=skip, limit=batch_size, base_url=base_url)
        
        # If no polls returned, we've reached the end
        if not batch:
            break
            
        # Add the batch to our complete list
        all_polls.extend(batch)
        
        # If we got fewer polls than requested, we've reached the end
        if len(batch) < batch_size:
            break
            
        # Move to the next batch
        skip += batch_size
    
    return all_polls


# Example usage
if __name__ == "__main__":
    try:
        # Fetch first 10 polls
        polls = fetch_polls(skip=0, limit=10)
        print(f"Fetched {len(polls)} polls:")
        for poll in polls:
            print(f"- ID: {poll.get('id')}, Question: {poll.get('question')}")
        
        print("\n" + "="*50 + "\n")
        
        # Fetch all polls
        all_polls = fetch_all_polls(batch_size=5)
        print(f"Total polls in database: {len(all_polls)}")
        
    except ValueError as e:
        print(f"API error: {e}")
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")