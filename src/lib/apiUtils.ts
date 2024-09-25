export async function fetchUserFromAPI(token: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error('API URL is not defined');
      return null;
    }
  
    try {
      const response = await fetch(`${apiUrl}/user`, {
        method:"GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Failed to fetch user data: ${errorText}`);
      }
  
      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('API fetch error:', error);
      return null;
    }
  }
  