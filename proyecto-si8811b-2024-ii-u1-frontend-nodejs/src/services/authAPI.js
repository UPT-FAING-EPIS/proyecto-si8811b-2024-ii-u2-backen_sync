export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://52.225.232.58:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Error en la autenticación');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
