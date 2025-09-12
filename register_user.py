import requests
from typing import Dict, Any, Optional


def register_user(username: str, password: str, base_url: str = "http://localhost:8000") -> Dict[str, Any]:
    """
    Register a new user via the /register endpoint.
    
    Args:
        username (str): The username for the new user
        password (str): The password for the new user
        base_url (str): The base URL of the API (default: http://localhost:8000)
    
    Returns:
        Dict[str, Any]: The response from the server containing user information
                       or error details
    
    Raises:
        requests.exceptions.RequestException: If there's a network error
        requests.exceptions.HTTPError: If the server returns an HTTP error
    """
    # Construct the full URL for the register endpoint
    url = f"{base_url.rstrip('/')}/register"
    
    # Prepare the request payload
    payload = {
        "username": username,
        "password": password
    }
    
    # Set headers for JSON content
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        # Make the POST request
        response = requests.post(url, json=payload, headers=headers)
        
        # Raise an exception for bad status codes
        response.raise_for_status()
        
        # Return the JSON response
        return response.json()
        
    except requests.exceptions.HTTPError as e:
        # Handle HTTP errors (4xx, 5xx)
        if response.status_code == 400:
            error_detail = response.json() if response.content else {"detail": "Username already registered"}
            raise ValueError(f"Registration failed: {error_detail}")
        else:
            raise e
    except requests.exceptions.RequestException as e:
        # Handle other request exceptions (network errors, etc.)
        raise e


# Example usage
if __name__ == "__main__":
    try:
        # Example registration
        result = register_user("john_doe", "secure_password123")
        print(f"User registered successfully: {result}")
        
    except ValueError as e:
        print(f"Registration error: {e}")
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")